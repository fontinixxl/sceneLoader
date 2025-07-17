# PixiJS Scene Loader

A scene management system for PixiJS applications, extracted and adapted from the navigation system in the [PixiJS Open Games Collection](https://github.com/pixijs/open-games), specifically the Bubbo Bubbo game.

## Attribution

This library is based on code from the [PixiJS Open Games Collection](https://github.com/pixijs/open-games), which is developed and maintained by the PixiJS team. The original navigation system in Bubbo Bubbo has been refactored into this standalone library.

## Development Note

This library was partially generated with the assistance of GitHub Copilot, an AI pair programming tool. The refactoring from the original source code to this modular library structure was facilitated by AI assistance while preserving the core functionality and architecture of the original system.

## Features

- **Scene Management**: Easily switch between game screens
- **Overlay Support**: Display overlays on top of scenes (pause menus, popups)
- **Asset Loading**: Automatically load required assets before showing scenes
- **Loading Screen**: Show a custom loading screen during asset loading
- **Responsive Design**: Built-in resize handling for scenes
- **Transition Effects**: Support for show/hide animations
- **Instance Reuse**: Scenes are cached and reused for better performance

## Installation

```bash
npm install pixi-scene-loader
```

## Basic Usage

```typescript
import { Application } from "pixi.js";
import { SceneLoader, Scene } from "pixi-scene-loader";

// Create PixiJS application
const app = new Application({
  width: 800,
  height: 600,
  backgroundColor: 0x1099bb,
});
document.body.appendChild(app.view);

// Create scene loader
const sceneLoader = new SceneLoader({
  app,
  // Optional: parent container (defaults to app.stage)
  parentContainer: app.stage,
  // Optional: loading scene
  loadingScene: new LoadingScene(),
});

// Create a scene
class MainMenuScene extends Container implements Scene {
  static readonly SCENE_ID = "mainMenu";
  static readonly assetBundles = ["menu"]; // Assets to preload

  constructor() {
    super();
    // Create UI elements
  }

  // Optional lifecycle methods
  prepare(data?: any) {
    // Initialize with data
  }

  async show() {
    // Show animation
    return Promise.resolve();
  }

  async hide() {
    // Hide animation
    return Promise.resolve();
  }

  update(ticker) {
    // Update logic
  }

  resize(width, height) {
    // Position elements
  }
}

// Navigate to scene
sceneLoader.goToScene(MainMenuScene);

// Show overlay
sceneLoader.showOverlay(PauseMenuScene);

// Hide overlay
sceneLoader.hideOverlay();

// Handle resize
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  app.renderer.resize(width, height);
  sceneLoader.resize(width, height);
});
```

## API Documentation

### SceneLoader

The main class that manages scenes and overlays.

#### Constructor

```typescript
constructor(options: SceneLoaderOptions)
```

Options:

- `app`: The PixiJS application instance
- `parentContainer?`: Optional parent container (defaults to app.stage)
- `loadingScene?`: Optional scene to show during asset loading

#### Methods

- `goToScene<T>(SceneCtor: SceneConstructor, data?: T)`: Navigate to a scene
- `showOverlay<T>(SceneCtor: SceneConstructor, data?: T)`: Show an overlay
- `hideOverlay()`: Hide the current overlay
- `resize(width: number, height: number)`: Handle resize events
- `setLoadingScene(scene: Scene)`: Set the loading scene
- `destroy()`: Clean up all resources

### Scene Interface

```typescript
interface Scene<T = any> extends Container {
  prepare?: (data?: T) => void;
  show?: () => Promise<void>;
  hide?: () => Promise<void>;
  update?: (time: Ticker) => void;
  resize?: (width: number, height: number) => void;
}
```

### Scene Constructor Interface

```typescript
interface SceneConstructor {
  readonly SCENE_ID: string;
  readonly assetBundles?: string[];
  new (): Scene;
}
```

## License

MIT
