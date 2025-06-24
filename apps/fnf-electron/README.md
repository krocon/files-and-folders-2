# Files and Folders Electron App

This is an Electron wrapper for the Files and Folders application, allowing it to run as a desktop application on Windows, macOS, and Linux.

## Prerequisites

- Node.js 18 or higher
- pnpm 8 or higher

## Development

### Setup

From the project root, install dependencies:

```bash
pnpm install:all
```

### Running the app in development mode

1. Start the Angular app:

```bash
pnpm start:fnf
```

2. In a separate terminal, start the Electron app:

```bash
pnpm start:fnf-electron
```

The Electron app will connect to the Angular dev server running on http://localhost:4200.

### Building the app

1. Build the Angular app:

```bash
pnpm build:fnf
```

2. Build the Electron app:

```bash
pnpm build:fnf-electron
```

Alternatively, build everything at once:

```bash
pnpm build:all
```

The built Electron app will be in the `apps/fnf-electron/dist` directory.

## Architecture

The Electron app consists of:

- **Main Process** (`main.js`): Handles the application lifecycle, creates windows, and interacts with the operating system.
- **Preload Script** (`preload.js`): Provides a secure bridge between the renderer process and the main process.
- **Renderer Process**: The Angular application running in a Chromium browser window.

## Security

This Electron app follows security best practices:

- Node integration is disabled in the renderer process
- Context isolation is enabled
- A preload script is used to expose only specific APIs to the renderer
- IPC channels are whitelisted

## Packaging

The app can be packaged for distribution using electron-builder. The configuration in package.json supports building for Windows, macOS, and Linux.