// Fork of https://github.com/stackblitz/sdk (MIT license)

const DEFAULT_BASE_URL = 'https://studio.firebase.google.com/run.api';

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
    baselineEnvironment?: 'flutter' | undefined;
  }
}

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
export function newAdhocWorkspace(content: AdhocWorkspaceContent, options?: AdhocWorkspaceOptions) {
  const form = createAdhocWorkspaceForm(content);
  form.action = options?.url || DEFAULT_BASE_URL;
  form.target = (options?.newWindow === false) ? '_self' : '_blank';
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

function createAdhocWorkspaceForm({ files, settings }: AdhocWorkspaceContent) {
  const inputs: HTMLInputElement[] = [];
  const addInput = (name: string, value: string, defaultValue = '') => {
    inputs.push(createHiddenInput(name, typeof value === 'string' ? value : defaultValue));
  };

  Object.entries(files).forEach(([path, contents]) => {
    addInput(`project[files][${encodeURIComponent(path)}]`, contents);
  });

  if (settings) {
    addInput(`project[settings]`, JSON.stringify({
      baselineEnvironment: settings?.baselineEnvironment
    }));
  }

  const form = document.createElement('form');
  form.method = 'post';
  form.setAttribute('style', 'display:none !important;');
  form.append(...inputs);
  return form;
}

function createHiddenInput(name: string, value: string) {
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = name;
  input.value = value;
  return input;
}
