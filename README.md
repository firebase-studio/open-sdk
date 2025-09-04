# Open in Firebase Studio SDK

A JS library for opening workspaces in [Firebase Studio](https://firebase.google.com/studio).

## Installation

```shell
npm install @firebase-studio/open-sdk
```

## Usage

For all the examples below, after installing the SDK, import the package:

```ts
import * as FirebaseStudio from '@firebase-studio/open-sdk';
```

### Button images

Get a URL to a CDN-hosted "Open in Firebase Studio" button image:

```ts
img.src = FirebaseStudio.getButtonImageUrl({
  // optional config
});
```

Example:

<a href="https://studio.firebase.google.com/import?url=https%3A%2F%2Fgithub.com%2Ffirebase-studio%2Fopen-sdk">
  <picture>
    <source
      media="(prefers-color-scheme: dark)"
      srcset="https://cdn.firebasestudio.dev/btn/open_light_32.svg">
    <source
      media="(prefers-color-scheme: light)"
      srcset="https://cdn.firebasestudio.dev/btn/open_dark_32.svg">
    <img
      height="32"
      alt="Open in Firebase Studio"
      src="https://cdn.firebasestudio.dev/btn/open_blue_32.svg">
  </picture>
</a>

### Deep-link URLs

You can get a deep link into Firebase Studio for a variety of destinations, e.g.:

```ts
link.href = FirebaseStudio.getOpenUrl({
  type: 'named-template', // or 'git', etc
  templateId: 'gemini'
});
```

### Ad-hoc workspaces

In a browser environment, you can create an ad-hoc workspace from an arbitrary set of project files like so:

```ts
button.onclick = () => {
  FirebaseStudio.newAdhocWorkspace({
    files: {
      'index.html': '<h1>hello world</h1>',
      '.idx/dev.nix': '...',
    }
  });
};
```