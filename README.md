# Open in Firebase Studio SDK

A JS library for opening workspaces in [Firebase Studio](https://firebase.google.com/studio).

Example:

<img src="https://cdn.firebasestudio.dev/btn/open_dark_32@2x.png" alt="Open in Firebase Studio button" height="32">

## Installation

```shell
npm install @firebase-studio/open-sdk
```

## Usage

```ts
import * as FirebaseStudio from '@firebase-studio/open-sdk';

// ... setup DOM elements ...

img.src = FirebaseStudio.buttonImageUrl();

button.onclick = () => {
  FirebaseStudio.newAdhocWorkspace({
    files: {
      'index.html': '<h1>hello world</h1>',
      '.idx/dev.nix': '...',
    }
  });
};
```