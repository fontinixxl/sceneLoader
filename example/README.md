# PixiJS Scene Loader Example

This is a complete example demonstrating how to use the pixi-scene-loader library with the singleton pattern.

## Features Demonstrated

- **Scene Management**: Clean transitions between scenes
- **Singleton Pattern**: SceneLoader available globally without dependency injection
- **Loading Screen**: Animated loading screen during scene transitions
- **Overlay System**: Pause menu overlay on top of game scene
- **Responsive Design**: Automatic resize handling
- **Game Loop**: Update cycle with moving elements
- **User Interaction**: Button clicks and scene navigation

## Project Structure

```
example/
├── src/
│   ├── main.ts          # Main application setup and SceneLoader initialization
│   ├── LoadingScene.ts  # Loading screen with animated progress bar
│   ├── TitleScene.ts    # Main menu with start button
│   ├── GameScene.ts     # Game scene with moving player and pause button
│   └── PauseOverlay.ts  # Pause overlay with resume and main menu options
├── public/
│   └── index.html       # HTML entry point
├── package.json         # Project configuration
└── tsconfig.json        # TypeScript configuration
```

## Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start the development server**:

   ```bash
   npm start
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## How it Works

### 1. Initialization

The SceneLoader is initialized as a singleton in `main.ts`:

```typescript
import { SceneLoader } from "pixi-scene-loader";

// Initialize the singleton SceneLoader
SceneLoader.init({
  app,
  parentContainer: app.stage,
  loadingScene: new LoadingScene(),
});
```

### 2. Scene Navigation

Scenes can navigate to other scenes without dependency injection:

```typescript
// In any scene
SceneLoader.goToScene(GameScene);
SceneLoader.showOverlay(PauseOverlay);
SceneLoader.hideOverlay();
```

### 3. Scene Lifecycle

Each scene can implement optional lifecycle methods:

- `prepare()`: Initialize scene with data
- `show()`: Animate scene entrance
- `hide()`: Animate scene exit
- `update()`: Called every frame
- `resize()`: Handle window resize

## Scene Examples

- **TitleScene**: Shows the main menu with animated transitions
- **GameScene**: Demonstrates game loop with moving elements
- **PauseOverlay**: Shows how overlays work on top of scenes
- **LoadingScene**: Shows animated loading progress

This example demonstrates the clean, dependency-free architecture that the singleton pattern provides for scene management.
