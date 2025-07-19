import { Container, Graphics, Text } from "pixi.js";
import { SceneLoader, Scene } from "pixi-scene-loader";
import { GameScene } from "./GameScene";

export class TitleScene extends Container implements Scene {
  static readonly SCENE_ID = "title";
  title: Text;
  startButton: Container;

  constructor() {
    super();
    this.title = new Text("PixiJS Scene Loader Demo", {
      fontSize: 48,
      fill: 0xffffff,
      fontWeight: "bold",
    });
    this.title.anchor.set(0.5);
    this.addChild(this.title);

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
    this.startButton.eventMode = "static";
    this.startButton.cursor = "pointer";
    this.startButton.on("pointerup", () => {
      SceneLoader.goToScene(GameScene);
    });
    this.addChild(this.startButton);
  }

  show() {
    this.alpha = 0;
    return new Promise<void>((resolve) => {
      const app = SceneLoader.getApp();
      const animate = () => {
        this.alpha += 0.05;
        if (this.alpha >= 1) {
          this.alpha = 1;
          app.ticker.remove(animate);
          resolve();
        }
      };
      app.ticker.add(animate);
    });
  }

  hide() {
    return new Promise<void>((resolve) => {
      const app = SceneLoader.getApp();
      const animate = () => {
        this.alpha -= 0.05;
        if (this.alpha <= 0) {
          this.alpha = 0;
          app.ticker.remove(animate);
          resolve();
        }
      };
      app.ticker.add(animate);
    });
  }

  resize(width: number, height: number) {
    this.title.position.set(width / 2, height / 3);
    this.startButton.position.set(width / 2 - 100, height / 2);
  }
}
