/**
 * SceneLoader
 *
 * This class is extracted and adapted from the Navigation system in the PixiJS Open Games Collection,
 * specifically from the Bubbo Bubbo game:
 * https://github.com/pixijs/open-games
 *
 * Original concept and implementation by the PixiJS team.
 * Refactored into a standalone library for broader use.
 */

import { Assets, Container, Ticker } from "pixi.js";
import { Scene, SceneConstructor, SceneLoaderOptions } from "./interfaces";
import { areBundlesLoaded } from "../utils/assetHelper";

/**
 * SceneLoader manages scenes and overlays in a PixiJS application,
 * handling transitions, asset loading, and resize events.
 */
class SceneLoaderClass {
  private static instance: SceneLoaderClass;

  /** The view that contains the scenes */
  public sceneView = new Container();

  /** The view that contains the overlays */
  public overlayView = new Container();

  /** Current scene being displayed */
  private currentScene?: Scene;

  /** Resize function for current scene to avoid scope problems */
  private currentSceneResize?: () => void;

  /** Default loading scene */
  private loadingScene?: Scene;

  /** Current overlay being displayed */
  private currentOverlay?: Scene;

  /** Resize function for current overlay to avoid scope problems */
  private currentOverlayResize?: () => void;

  /** The width of the screen */
  private _width = 0;

  /** The height of the screen */
  private _height = 0;

  /** Map of scenes by ID for reuse */
  private readonly _sceneMap = new Map<string, Scene>();

  /** The application instance */
  private app?: any;

  /** Whether the SceneLoader has been initialized */
  private isInitialized = false;

  /**
   * Private constructor for singleton pattern
   */
  private constructor() {}

  /**
   * Get the singleton instance
   */
  public static getInstance(): SceneLoaderClass {
    if (!SceneLoaderClass.instance) {
      SceneLoaderClass.instance = new SceneLoaderClass();
    }
    return SceneLoaderClass.instance;
  }

  /**
   * Initialize the SceneLoader with the application and options
   * @param options - Configuration options
   */
  public init(options: SceneLoaderOptions): void {
    if (this.isInitialized) {
      console.warn("SceneLoader already initialized");
      return;
    }

    this.app = options.app;

    // Add scene containers to parent (default to app.stage)
    const parent = options.parentContainer || this.app.stage;
    parent.addChild(this.sceneView);
    parent.addChild(this.overlayView);

    // Set loading scene if provided
    if (options.loadingScene) {
      this.setLoadingScene(options.loadingScene);
    }

    this.isInitialized = true;
  }

  /**
   * Get the PixiJS application instance
   * @returns The PixiJS application
   */
  public getApp(): any {
    if (!this.isInitialized || !this.app) {
      throw new Error("SceneLoader not initialized. Call SceneLoader.init() first.");
    }
    return this.app;
  }

  /**
   * Set the loading scene
   * @param scene - Scene to use for loading
   */
  public setLoadingScene(scene: Scene): void {
    this.loadingScene = scene;
  }

  /**
   * Go to a scene
   * @param SceneCtor - Constructor of the scene to go to
   * @param data - Optional data to pass to the scene
   */
  public async goToScene<T>(SceneCtor: SceneConstructor, data?: T): Promise<void> {
    if (!this.isInitialized) {
      throw new Error("SceneLoader not initialized. Call SceneLoader.init() first.");
    }
    await this._showScene(SceneCtor, false, data);
  }

  /**
   * Show an overlay on top of the current scene
   * @param SceneCtor - Constructor of the overlay to show
   * @param data - Optional data to pass to the overlay
   */
  public async showOverlay<T>(SceneCtor: SceneConstructor, data?: T): Promise<void> {
    if (!this.isInitialized) {
      throw new Error("SceneLoader not initialized. Call SceneLoader.init() first.");
    }
    await this._showScene(SceneCtor, true, data);
  }

  /**
   * Hide the current overlay
   */
  public async hideOverlay(): Promise<void> {
    if (this.currentOverlay) {
      await this._removeScene(this.currentOverlay, true);
      this.currentOverlay = undefined;
      this.currentOverlayResize = undefined;
    }
  }

  /**
   * Handle resize events
   * @param width - New width
   * @param height - New height
   */
  public resize(width: number, height: number): void {
    if (!this.isInitialized) {
      throw new Error("SceneLoader not initialized. Call SceneLoader.init() first.");
    }

    this._width = width;
    this._height = height;

    // Resize current scene if it exists
    if (this.currentSceneResize) {
      this.currentSceneResize();
    }

    // Resize current overlay if it exists
    if (this.currentOverlayResize) {
      this.currentOverlayResize();
    }
  }

  /**
   * Get a scene instance, creating it if needed
   * @param SceneCtor - Constructor for the scene
   * @returns Scene instance
   */
  private _getScene(SceneCtor: SceneConstructor): Scene {
    // Check if a scene instance exists on the scene map
    let scene = this._sceneMap.get(SceneCtor.SCENE_ID);

    // If not, create a new instance and add it to the scene map
    if (!scene) {
      scene = new SceneCtor();
      this._sceneMap.set(SceneCtor.SCENE_ID, scene);
    }

    return scene;
  }

  /**
   * Show a scene or overlay
   * @param SceneCtor - Constructor for the scene
   * @param isOverlay - Whether this is an overlay
   * @param data - Optional data to pass to the scene
   */
  private async _showScene<T>(
    SceneCtor: SceneConstructor,
    isOverlay: boolean,
    data?: T
  ): Promise<void> {
    const current = isOverlay ? this.currentOverlay : this.currentScene;

    // If there is a scene already created, hide it
    if (current) {
      await this._removeScene(current, isOverlay);
    }

    // Load assets for the new scene, if available
    if (SceneCtor.assetBundles && !areBundlesLoaded(SceneCtor.assetBundles)) {
      // If assets are not loaded yet, show loading scene, if there is one
      if (this.loadingScene) {
        await this._addScene(this.loadingScene, isOverlay);
      }

      // Load all assets required by this new scene
      try {
        await Assets.loadBundle(SceneCtor.assetBundles);
      } catch (error) {
        console.error("Error loading assets:", error);
        throw error;
      }

      // Hide loading scene, if exists
      if (this.loadingScene) {
        await this._removeScene(this.loadingScene, isOverlay);
      }
    }

    // Create the new scene and add to the stage
    if (isOverlay) {
      this.currentOverlay = this._getScene(SceneCtor);
      this.currentOverlay.prepare?.(data);
      await this._addScene(this.currentOverlay, isOverlay);
    } else {
      this.currentScene = this._getScene(SceneCtor);
      this.currentScene.prepare?.(data);
      await this._addScene(this.currentScene, isOverlay);
    }
  }

  /**
   * Add a scene to the stage
   * @param scene - Scene to add
   * @param isOverlay - Whether this is an overlay
   */
  private async _addScene(scene: Scene, isOverlay: boolean): Promise<void> {
    // Add to the appropriate container
    if (isOverlay) {
      this.overlayView.addChild(scene);

      // Create a resize handler
      this.currentOverlayResize = () => {
        scene.resize?.(this._width, this._height);
      };

      // Resize immediately
      this.currentOverlayResize();
    } else {
      this.sceneView.addChild(scene);

      // Create a resize handler
      this.currentSceneResize = () => {
        scene.resize?.(this._width, this._height);
      };

      // Resize immediately
      this.currentSceneResize();
    }

    // Register update handler if it exists
    if (scene.update) {
      this.app.ticker.add(scene.update, scene);
    }

    // Show the scene if it has a show method
    if (scene.show) {
      await scene.show();
    }
  }

  /**
   * Remove a scene from the stage
   * @param scene - Scene to remove
   * @param isOverlay - Whether this is an overlay
   */
  private async _removeScene(scene: Scene, isOverlay: boolean): Promise<void> {
    // Hide the scene if it has a hide method
    if (scene.hide) {
      await scene.hide();
    }

    // Unregister update handler if it exists
    if (scene.update) {
      this.app.ticker.remove(scene.update, scene);
    }

    // Remove from the appropriate container
    if (isOverlay) {
      this.overlayView.removeChild(scene);
    } else {
      this.sceneView.removeChild(scene);
    }
  }

  /**
   * Clean up all resources
   */
  public destroy(): void {
    // Remove all scenes from the scene map
    this._sceneMap.forEach((scene) => {
      if (scene.update) {
        this.app.ticker.remove(scene.update, scene);
      }
      scene.destroy();
    });

    this._sceneMap.clear();

    // Remove containers
    this.sceneView.destroy();
    this.overlayView.destroy();

    // Clear references
    this.currentScene = undefined;
    this.currentOverlay = undefined;
    this.loadingScene = undefined;
    this.currentSceneResize = undefined;
    this.currentOverlayResize = undefined;
  }
}

// Export singleton instance
export const SceneLoader = SceneLoaderClass.getInstance();
