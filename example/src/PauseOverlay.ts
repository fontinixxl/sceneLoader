import { Container, Graphics, Text } from "pixi.js";
import { SceneLoader, Scene } from "pixi-scene-loader";
import { TitleScene } from "./TitleScene";

export class PauseOverlay extends Container implements Scene {
  static readonly SCENE_ID = "pause";
  panel: Graphics;
  title: Text;
  resumeButton: Container;
  mainMenuButton: Container;

  constructor() {
    super();
    const bg = new Graphics().beginFill(0x000000, 0.5).drawRect(0, 0, 800, 600).endFill();
    this.addChild(bg);

    this.panel = new Graphics()
      .beginFill(0x333333)
      .lineStyle(2, 0xffffff)
      .drawRoundedRect(0, 0, 300, 200, 20)
      .endFill();
    this.addChild(this.panel);

    this.title = new Text("Paused", {
      fontSize: 32,
      fill: 0xffffff,
    });
    this.title.anchor.set(0.5, 0);
    this.title.position.set(150, 20);
    this.panel.addChild(this.title);

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
      SceneLoader.hideOverlay();
    });
    this.panel.addChild(this.resumeButton);

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
      SceneLoader.hideOverlay();
      SceneLoader.goToScene(TitleScene);
    });
    this.panel.addChild(this.mainMenuButton);
  }

  resize(width: number, height: number) {
    const bg = this.getChildAt(0) as Graphics;
    bg.width = width;
    bg.height = height;
    this.panel.position.set(width / 2 - 150, height / 2 - 100);
  }
}
