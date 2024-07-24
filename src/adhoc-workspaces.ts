// Fork of https://github.com/stackblitz/sdk (MIT license)

const DEFAULT_BASE_URL = 'https://idx.google.com/run.api';

const DEFAULT_BASE_URL = 'https://idx.google.com/run.api';

export interface AdhocWorkspaceContent {
  /**
   * A map of relative file paths (e.g. `src/foo.html`) to their contents.
   * String for text files, Uint8Array for binary files.
   */
  files: Record<string, string | Uint8Array>;
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
   * Open IDX in a new browser tab/window.
   */
  newWindow?: boolean;
}

/**
 * Creates a new ad-hoc Project IDX workspace from the given file contents.
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
  const addInput = (name: string, value: string | Uint8Array, defaultValue = '') => {
    let inputValue: string;
    if (typeof value === 'string') {
      inputValue = value;
    } else if (value instanceof Uint8Array) {
      inputValue = btoa(String.fromCharCode.apply(null, value));
    } else {
      inputValue = defaultValue;
    }
    inputs.push(createHiddenInput(name, inputValue));
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