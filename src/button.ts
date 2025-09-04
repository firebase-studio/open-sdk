/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { getOpenUrl, OpenDestination } from "./url";

export type ButtonLabel = "open" | "try" | "export" | "continue";
export type ButtonColor = "dark" | "light" | "blue" | "bright";
export type ButtonHtmlColor = ButtonColor | "dynamic" | "dynamic-reverse";
export type ButtonSize = 20 | 32;
export type ButtonImageFormat = "svg" | "png";

/**
 * Configuration for an "Open in Firebase Studio" button.
 */
export interface ButtonImageConfig {
  /**
   * The text label to show in the button.
   */
  label?: ButtonLabel;
  /**
   * The button color. 'Bright' is a branded gradient.
   */
  color?: ButtonColor;
  /**
   * The button height in pixels.
   */
  size?: ButtonSize;
  /**
   * The image format. PNG is served at @2x resolution.
   */
  imageFormat?: ButtonImageFormat;
}

/**
 * Configuration for an "Open in Firebase Studio" button HTML snippet.
 */
export interface ButtonHtmlConfig extends Omit<ButtonImageConfig, "color"> {
  destination: OpenDestination;
  color?: ButtonHtmlColor;
}

const LABELS: Record<Exclude<ButtonImageConfig["label"], undefined>, string> = {
  continue: "Continue in Firebase Studio",
  export: "Export to Firebase Studio",
  open: "Open in Firebase Studio",
  try: "Try in Firebase Studio",
};

/**
 * Get the CDN URL for a given "Open in Firebase Studio" button image configuration.
 */
export function getButtonImageUrl({
  label = "open",
  color = "dark",
  size = 32,
  imageFormat = "svg",
}: ButtonImageConfig = {}) {
  return [
    "https://cdn.firebasestudio.dev/btn/",
    label,
    "_",
    color,
    "_",
    `${size}${imageFormat === "png" ? "@2x" : ""}.${imageFormat}`,
  ].join("");
}

/**
 * Get the HTML for a given "Open in Firebase Studio" button configuration, including
 * a target link.
 */
export function getButtonHtml(config: ButtonHtmlConfig) {
  const { destination, color, label = "open", size, imageFormat } = config;
  let inner = "";

  if (color === "dynamic" || color === "dynamic-reverse") {
    const reverse = color === "dynamic-reverse";
    inner = `
  <picture>
    <source
      media="(prefers-color-scheme: dark)"
      srcset="${getButtonImageUrl({
        ...config,
        color: reverse ? "light" : "dark",
      })}">
    <source
      media="(prefers-color-scheme: light)"
      srcset="${getButtonImageUrl({
        ...config,
        color: reverse ? "dark" : "light",
      })}">
    <img
      height="${size}"
      alt="${LABELS[label]}"
      src="${getButtonImageUrl({ ...config, color: "blue" })}">
  </picture>
    `.trim();
  } else {
    inner = `
  <img
    height="${size}"
    alt="${LABELS[label]}"
    src="${getButtonImageUrl({ color, label, size, imageFormat })}">
`.trim();
  }

  return `<a href="${getOpenUrl(destination)}">
  ${inner}
</a>`;
}
