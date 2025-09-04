/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * This file is forked from https://github.com/stackblitz/sdk (`src/generate.ts`)
 *
 * @copyright (c) 2018 Eric Simons and Albert Pai (original authors)
 * @license MIT (original license)
 */

/**
 * Default base URL for the adhoc workspaces API.
 */
const DEFAULT_BASE_URL = "https://studio.firebase.google.com/run.api";

/**
 * Valid baseline environments (optional).
 */
export type BaselineEnvironment =
  | "flutter"
  | "stitch"
  | "html"
  | "react"
  | "angular"
  | "python";

/**
 * The content and configuration for a new ad-hoc workspace.
 */
export interface AdhocWorkspaceContent {
  /**
   * A map of relative file paths (e.g. `src/foo.html`) to their contents (strings). Binary
   * files aren't supported.
   */
  files: Record<string, string>;
  /**
   * Optional workspace configuration.
   */
  settings?: {
    /**
     * The starting point to build on.
     */
    baselineEnvironment?: BaselineEnvironment | undefined;
    /**
     * The source of the request.
     */
    referrer?: string;
  };
}

/**
 * Options for creating a new ad-hoc workspace.
 */
export interface AdhocWorkspaceOptions {
  /**
   * Override base URL for the API.
   */
  url?: string;
  /**
   * Open Firebase Studio in a new browser tab/window.
   */
  newWindow?: boolean;
}

/**
 * Creates a new ad-hoc Firebase Studio workspace from the given set of project files. For best
 * effect, include a `.idx/dev.nix` file to customize the environment for the project.
 *
 * _NOTE: This is only supported in a browser environment._
 */
export function newAdhocWorkspace(
  content: AdhocWorkspaceContent,
  options?: AdhocWorkspaceOptions
) {
  const form = createAdhocWorkspaceForm(content);
  form.action = options?.url || DEFAULT_BASE_URL;
  form.target = options?.newWindow === false ? "_self" : "_blank";
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

function createAdhocWorkspaceForm({ files, settings }: AdhocWorkspaceContent) {
  const inputs: HTMLInputElement[] = [];
  const addInput = (name: string, value: string, defaultValue = "") => {
    inputs.push(
      createHiddenInput(name, typeof value === "string" ? value : defaultValue)
    );
  };

  Object.entries(files).forEach(([path, contents]) => {
    addInput(`project[files][${encodeURIComponent(path)}]`, contents);
  });

  if (settings) {
    addInput(
      `project[settings]`,
      JSON.stringify({
        baselineEnvironment: settings?.baselineEnvironment,
        referrer: settings?.referrer,
      })
    );
  }

  const form = document.createElement("form");
  form.method = "post";
  form.setAttribute("style", "display:none !important;");
  form.append(...inputs);
  return form;
}

function createHiddenInput(name: string, value: string) {
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = name;
  input.value = value;
  return input;
}
