import { Application, Container, Graphics, Text } from "pixi.js";
import { SceneLoader, Scene } from "../src";

// Define LoadingScene class first to avoid "used before declaration" error
class LoadingScene extends Container implements Scene {
  static readonly SCENE_ID = "loading";

  private loadingText: Text;
  private loadingBarBg: Graphics;
  private loadingBar: Graphics;
  private progress = 0;

  constructor() {
    super();

    // Loading text
    this.loadingText = new Text("Loading...", {
      fontSize: 32,
      fill: 0xffffff,
    });
    this.loadingText.anchor.set(0.5);
    this.addChild(this.loadingText);

    // Loading bar background
    this.loadingBarBg = new Graphics()
      .beginFill(0x333333)
      .drawRect(0, 0, 300, 20)
      .endFill();
    this.loadingBarBg.position.set(-150, 20);
    this.addChild(this.loadingBarBg);

    // Loading bar
    this.loadingBar = new Graphics()
      .beginFill(0x00cc00)
      .drawRect(0, 0, 0, 20) // Width will be updated
      .endFill();
    this.loadingBar.position.set(-150, 20);
    this.addChild(this.loadingBar);
  }

  update() {
    // Animate loading bar
    this.progress += 0.01;
    if (this.progress > 1) this.progress = 0;
    this.loadingBar.width = 300 * this.progress;
  }

  resize(width: number, height: number) {
    // Center loading elements
    this.loadingText.position.set(width / 2, height / 2 - 40);
    this.loadingBarBg.position.set(width / 2 - 150, height / 2 + 20);
    this.loadingBar.position.set(width / 2 - 150, height / 2 + 20);
  }
}

// Create a PixiJS application
const app = new Application({
  width: 800,
  height: 600,
  backgroundColor: 0x1099bb,
});
document.body.appendChild(app.view as HTMLCanvasElement);

// Create scene loader
const sceneLoader = new SceneLoader({
  app,
  // Optional: provide a loading scene
  loadingScene: new LoadingScene(),
});

// Handle window resize
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  app.renderer.resize(width, height);
  sceneLoader.resize(width, height);
});

// Initial resize
sceneLoader.resize(window.innerWidth, window.innerHeight);

// Define scenes
class TitleScene extends Container implements Scene {
  static readonly SCENE_ID = "title";
  static readonly assetBundles = ["title"];

  private title: Text;
  private startButton: Container;

  constructor() {
    super();

    // Create title
    this.title = new Text("My Game", {
      fontSize: 64,
      fill: 0xffffff,
    });
    this.title.anchor.set(0.5);
    this.addChild(this.title);

    // Create start button
    this.startButton = new Container();
    const buttonBg = new Graphics()
      .beginFill(0x0066cc)
      .drawRoundedRect(0, 0, 200, 50, 10)
      .endFill();
    const buttonText = new Text("Start Game", {
      fontSize: 24,
      fill: 0xffffff,
    });
    buttonText.anchor.set(0.5);
    buttonText.position.set(100, 25);
    this.startButton.addChild(buttonBg, buttonText);
    this.startButton.position.set(-100, 50);
    this.startButton.eventMode = "static";
    this.startButton.cursor = "pointer";
    this.startButton.on("pointerup", () => {
      sceneLoader.goToScene(GameScene);
    });
    this.addChild(this.startButton);
  }

  async show() {
    // Animation for showing the scene
    this.alpha = 0;
    const showPromise = new Promise<void>((resolve) => {
      let alpha = 0;
      const animTicker = (delta: number) => {
        alpha += 0.05;
        this.alpha = alpha;
        if (alpha >= 1) {
          app.ticker.remove(animTicker);
          resolve();
        }
      };
      app.ticker.add(animTicker);
    });
    return showPromise;
  }

  async hide() {
    // Animation for hiding the scene
    const hidePromise = new Promise<void>((resolve) => {
      let alpha = 1;
      const animTicker = (delta: number) => {
        alpha -= 0.05;
        this.alpha = alpha;
        if (alpha <= 0) {
          app.ticker.remove(animTicker);
          resolve();
        }
      };
      app.ticker.add(animTicker);
    });
    return hidePromise;
  }

  resize(width: number, height: number) {
    // Center the title
    this.title.position.set(width / 2, height / 3);
    // Position the start button
    this.startButton.position.set(width / 2 - 100, height / 2);
  }
}

class GameScene extends Container implements Scene {
  static readonly SCENE_ID = "game";
  static readonly assetBundles = ["game"];

  private player: Graphics;
  private score: Text;
  private pauseButton: Container;
  private scoreValue = 0;

  constructor() {
    super();

    // Create player
    this.player = new Graphics().beginFill(0xff0000).drawCircle(0, 0, 20).endFill();
    this.addChild(this.player);

    // Create score text
    this.score = new Text("Score: 0", {
      fontSize: 24,
      fill: 0xffffff,
    });
    this.score.position.set(20, 20);
    this.addChild(this.score);

    // Create pause button
    this.pauseButton = new Container();
    const buttonBg = new Graphics()
      .beginFill(0x0066cc)
      .drawRoundedRect(0, 0, 100, 40, 10)
      .endFill();
    const buttonText = new Text("Pause", {
      fontSize: 20,
      fill: 0xffffff,
    });
    buttonText.anchor.set(0.5);
    buttonText.position.set(50, 20);
    this.pauseButton.addChild(buttonBg, buttonText);
    this.pauseButton.eventMode = "static";
    this.pauseButton.cursor = "pointer";
    this.pauseButton.on("pointerup", () => {
      sceneLoader.showOverlay(PauseOverlay);
    });
    this.addChild(this.pauseButton);
  }

  update(ticker: any) {
    // Update game logic each frame
    this.scoreValue += 0.1;
    this.score.text = `Score: ${Math.floor(this.scoreValue)}`;

    // Move player in a circle
    const time = ticker.lastTime / 1000;
    const radius = 100;
    this.player.x = Math.cos(time) * radius + app.renderer.width / 2;
    this.player.y = Math.sin(time) * radius + app.renderer.height / 2;
  }

  resize(width: number, height: number) {
    // Position the pause button
    this.pauseButton.position.set(width - 120, 20);
  }
}

class PauseOverlay extends Container implements Scene {
  static readonly SCENE_ID = "pause";

  private panel: Graphics;
  private title: Text;
  private resumeButton: Container;
  private mainMenuButton: Container;

  constructor() {
    super();

    // Semi-transparent background
    const bg = new Graphics()
      .beginFill(0x000000, 0.7)
      .drawRect(0, 0, 1, 1) // Will be resized
      .endFill();
    this.addChild(bg);

    // Pause panel
    this.panel = new Graphics()
      .beginFill(0x333333)
      .lineStyle(2, 0xffffff)
      .drawRoundedRect(0, 0, 300, 200, 20)
      .endFill();
    this.addChild(this.panel);

    // Title
    this.title = new Text("Paused", {
      fontSize: 32,
      fill: 0xffffff,
    });
    this.title.anchor.set(0.5, 0);
    this.title.position.set(150, 20);
    this.panel.addChild(this.title);

    // Resume button
    this.resumeButton = new Container();
    const resumeBg = new Graphics()
      .beginFill(0x0066cc)
      .drawRoundedRect(0, 0, 200, 40, 10)
      .endFill();
    const resumeText = new Text("Resume", {
      fontSize: 20,
      fill: 0xffffff,
    });
    resumeText.anchor.set(0.5);
    resumeText.position.set(100, 20);
    this.resumeButton.addChild(resumeBg, resumeText);
    this.resumeButton.position.set(50, 80);
    this.resumeButton.eventMode = "static";
    this.resumeButton.cursor = "pointer";
    this.resumeButton.on("pointerup", () => {
      sceneLoader.hideOverlay();
    });
    this.panel.addChild(this.resumeButton);

    // Main menu button
    this.mainMenuButton = new Container();
    const menuBg = new Graphics()
      .beginFill(0xcc6600)
      .drawRoundedRect(0, 0, 200, 40, 10)
      .endFill();
    const menuText = new Text("Main Menu", {
      fontSize: 20,
      fill: 0xffffff,
    });
    menuText.anchor.set(0.5);
    menuText.position.set(100, 20);
    this.mainMenuButton.addChild(menuBg, menuText);
    this.mainMenuButton.position.set(50, 140);
    this.mainMenuButton.eventMode = "static";
    this.mainMenuButton.cursor = "pointer";
    this.mainMenuButton.on("pointerup", () => {
      sceneLoader.hideOverlay();
      sceneLoader.goToScene(TitleScene);
    });
    this.panel.addChild(this.mainMenuButton);
  }

  resize(width: number, height: number) {
    // Resize background
    const bg = this.getChildAt(0) as Graphics;
    bg.width = width;
    bg.height = height;

    // Center panel
    this.panel.position.set(width / 2 - 150, height / 2 - 100);
  }
}

// Start with the title scene
sceneLoader.goToScene(TitleScene);
