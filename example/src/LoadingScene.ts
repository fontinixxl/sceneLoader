import { Container, Graphics, Text, Ticker } from "pixi.js";
import type { Scene } from "pixi-scene-loader";

export class LoadingScene extends Container implements Scene {
  static readonly SCENE_ID = "loading";
  loadingText: Text;
  loadingBarBg: Graphics;
  loadingBar: Graphics;
  progress = 0;

  constructor() {
    super();
    this.loadingText = new Text("Loading...", { fontSize: 32, fill: 0xffffff });
    this.loadingText.anchor.set(0.5);
    this.addChild(this.loadingText);

    this.loadingBarBg = new Graphics()
      .beginFill(0x333333)
      .drawRect(-150, 30, 300, 20)
      .endFill();
    this.addChild(this.loadingBarBg);

    this.loadingBar = new Graphics()
      .beginFill(0x00cc00)
      .drawRect(-150, 30, 0, 20)
      .endFill();
    this.addChild(this.loadingBar);
  }

  update(_ticker: Ticker) {
    this.progress += 0.02;
    if (this.progress > 1) this.progress = 0;
    this.loadingBar.scale.x = this.progress;
  }

  resize(width: number, height: number) {
    this.loadingText.position.set(width / 2, height / 2 - 20);
    this.loadingBarBg.position.set(width / 2, height / 2);
    this.loadingBar.position.set(width / 2, height / 2);
  }
}
