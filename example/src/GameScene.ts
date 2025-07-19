import { Container, Graphics, Text, Ticker } from "pixi.js";
import { SceneLoader, Scene } from "pixi-scene-loader";
import { PauseOverlay } from "./PauseOverlay";

export class GameScene extends Container implements Scene {
  static readonly SCENE_ID = "game";
  player: Graphics;
  score: Text;
  scoreValue = 0;
  pauseButton: Container;

  constructor() {
    super();
    this.player = new Graphics().beginFill(0xff0000).drawCircle(0, 0, 30).endFill();
    this.addChild(this.player);

    this.score = new Text("Score: 0", {
      fontSize: 24,
      fill: 0xffffff,
    });
    this.score.position.set(20, 20);
    this.addChild(this.score);

    this.pauseButton = new Container();
    const buttonBg = new Graphics()
      .beginFill(0x333333)
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
      SceneLoader.showOverlay(PauseOverlay);
    });
    this.addChild(this.pauseButton);
  }

  update(ticker: Ticker) {
    this.scoreValue += 0.1;
    this.score.text = `Score: ${Math.floor(this.scoreValue)}`;
    const time = ticker.lastTime / 1000;
    const radius = 100;
    const app = SceneLoader.getApp();
    this.player.x = Math.cos(time) * radius + app.renderer.width / 2;
    this.player.y = Math.sin(time) * radius + app.renderer.height / 2;
    Math.sin(time) * radius + (this.parent as any)?.app?.renderer?.height / 2;
  }

  resize(width: number, height: number) {
    this.pauseButton.position.set(width - 120, 20);
  }
}
