import { Application } from "pixi.js";
import { SceneLoader } from "pixi-scene-loader";
import { LoadingScene } from "./LoadingScene";
import { TitleScene } from "./TitleScene";

const app = new Application({
  width: 1920,
  height: 1080,
  backgroundColor: 0x1099bb,
});
document.body.appendChild(app.view as HTMLCanvasElement);

// Initialize the singleton SceneLoader
SceneLoader.init({
  app,
  parentContainer: app.stage,
  loadingScene: new LoadingScene(),
});

window.addEventListener("resize", () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  SceneLoader.resize(window.innerWidth, window.innerHeight);
});
SceneLoader.resize(window.innerWidth, window.innerHeight);

// Start with the title scene
SceneLoader.goToScene(TitleScene);
