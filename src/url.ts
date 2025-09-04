/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * A destination for a "Open in Firebase Studio" link.
 */
export type OpenDestination =
  | ImportGitOpenDestination
  | NamedTemplateOpenDestination
  | CustomTemplateOpenDestination
  | PrototypePromptOpenDestination;

/**
 * A destination that creates a new workspace by importing a Git repository.
 */
export interface ImportGitOpenDestination {
  type: "git";
  /**
   * The Git repository to import into a new workspace. This is essentially a `git clone` in a
   * new workspace.
   */
  repoUrl: string;
}

/**
 * A destination that creates a new workspace from a named template.
 */
export interface NamedTemplateOpenDestination {
  type: "named-template";
  /**
   * The named template to create a new workspace from, for example `gemini`.
   */
  templateId: string;
}

/**
 * A destination that creates a new workspace from a custom template Git repository.
 */
export interface CustomTemplateOpenDestination {
  type: "custom-template";
  /**
   * The public Git repository URL for a custom template (a repo or subfolder with a
   * `idx-template.json` file).
   */
  templateRepoUrl: string;
}

/**
 * A destination that creates a new prototyper workspace from a natural language prompt.
 */
export interface PrototypePromptOpenDestination {
  type: "prototype-prompt";
  /**
   * The natural language prompt for a prototype to build.
   */
  prompt: string;
}

/**
 * Default base URL for "Open in Firebase Studio" links.
 */
const BASE_URL = "https://studio.firebase.google.com";

/**
 * Returns the URL for a given "Open in Firebase Studio" destination.
 */
export function getOpenUrl(
  destination: OpenDestination,
  baseUrl: string = BASE_URL
) {
  baseUrl = (baseUrl || "").replace(/\/$/, "");
  switch (destination.type) {
    case "git":
      return [
        baseUrl,
        "/import?url=",
        encodeURIComponent(normalizeGitUrl(destination.repoUrl)),
      ].join("");

    case "named-template":
      return [
        baseUrl,
        "/new/",
        encodeURIComponent(destination.templateId.trim()),
      ].join("");

    case "custom-template":
      return [
        baseUrl,
        "/new?template=",
        encodeURIComponent(normalizeGitUrl(destination.templateRepoUrl)),
      ].join("");

    case "prototype-prompt":
      return [
        baseUrl,
        "/?prototypePrompt=",
        encodeURIComponent(destination.prompt),
      ].join("");

    default:
      throw new Error(`Unknown destination type: ${(destination as any).type}`);
  }
}

function normalizeGitUrl(url: string): string {
  url = url.trim();
  if (!url) return url;
  if (!url.match(/^https?:\/\//)) {
    url = `https://${url}`;
  }
  return url;
}
