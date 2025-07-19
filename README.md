# PixiJS Scene Loader

A scene management system for PixiJS applications, extracted and adapted from the navigation system in the [PixiJS Open Games Collection](https://github.com/pixijs/open-games), specifically the Bubbo Bubbo game.

## Features

- **Singleton Pattern**: Global access without dependency injection
- **Scene Management**: Easily switch between game screens
- **Overlay Support**: Display overlays on top of scenes (pause menus, popups)
- **Asset Loading**: Automatically load required assets before showing scenes
- **Loading Screen**: Show a custom loading screen during asset loading
- **Responsive Design**: Built-in resize handling for scenes
- **Transition Effects**: Support for show/hide animations
- **Instance Reuse**: Scenes are cached and reused for better performance

## Quick Start

```typescript
import { Application } from "pixi.js";
import { SceneLoader } from "pixi-scene-loader";
import { TitleScene } from "./scenes/TitleScene";

// Create PixiJS application
const app = new Application({
  width: 800,
  height: 600,
  backgroundColor: 0x1099bb,
});
document.body.appendChild(app.view);

// Initialize SceneLoader (singleton pattern)
SceneLoader.init({
  app,
  parentContainer: app.stage,
  loadingScene: new LoadingScene(),
});

// Navigate to first scene
SceneLoader.goToScene(TitleScene);
```

## Example Project

See the complete example in the [`example/`](./example) folder which demonstrates:

- Scene transitions with animations
- Overlay system (pause menu)
- Singleton pattern usage
- Responsive design
- Game loop integration

To run the example:

```bash
cd example
npm install
npm start
```

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

## Creating Scenes

```typescript
import { Container, Text } from "pixi.js";
import { SceneLoader, Scene } from "pixi-scene-loader";

class MainMenuScene extends Container implements Scene {
  static readonly SCENE_ID = "main-menu";
  static readonly assetBundles = ["ui"]; // Optional

  constructor() {
    super();

    // Create UI elements
    const title = new Text("Main Menu", { fontSize: 48, fill: 0xffffff });
    title.anchor.set(0.5);
    this.addChild(title);

    // Navigation using singleton
    const startButton = new Container();
    startButton.on("pointerup", () => {
      SceneLoader.goToScene(GameScene);
    });
    this.addChild(startButton);
  }

  show() {
    // Optional: entrance animation
    return Promise.resolve();
  }

  hide() {
    // Optional: exit animation
    return Promise.resolve();
  }

  update(ticker) {
    // Optional: update logic
  }

  resize(width, height) {
    // Optional: positioning logic
  }
}

// Navigate to scene (from anywhere in your app)
SceneLoader.goToScene(MainMenuScene);

// Show overlay
SceneLoader.showOverlay(PauseMenuScene);

// Hide overlay
SceneLoader.hideOverlay();

// Handle resize
window.addEventListener("resize", () => {
  SceneLoader.resize(window.innerWidth, window.innerHeight);
});
```

## API Documentation

### SceneLoader (Singleton)

The singleton class that manages scenes and overlays globally.

#### Static Methods

- `init(options: SceneLoaderOptions)`: Initialize the singleton with app and options
- `goToScene<T>(SceneCtor: SceneConstructor, data?: T)`: Navigate to a scene
- `showOverlay<T>(SceneCtor: SceneConstructor, data?: T)`: Show an overlay
- `hideOverlay()`: Hide the current overlay
- `resize(width: number, height: number)`: Handle resize events
- `getApp()`: Get the PixiJS application instance
- `setLoadingScene(scene: Scene)`: Set the loading scene

#### Initialization Options

```typescript
interface SceneLoaderOptions {
  app: Application; // PixiJS application instance
  parentContainer?: Container; // Optional parent (defaults to app.stage)
  loadingScene?: Scene; // Optional loading scene
}
```

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

## Attribution

This library is based on code from the [PixiJS Open Games Collection](https://github.com/pixijs/open-games), which is developed and maintained by the PixiJS team. The original navigation system from the Bubbo Bubbo game has been refactored into this standalone library.

## Development

This library was partially developed with the assistance of GitHub Copilot, an AI pair programming tool. The refactoring from the original source code to this modular, singleton-based library structure was facilitated by AI assistance while preserving the core functionality and architecture.

## License

MIT
