/**
 * Scene management interfaces
 *
 * These interfaces are based on the AppScreen system from the PixiJS Open Games Collection,
 * specifically from the Bubbo Bubbo game:
 * https://github.com/pixijs/open-games
 *
 * Original concept and implementation by the PixiJS team.
 * Refactored into a standalone library for broader use.
 *
 */

import { Container, Ticker } from "pixi.js";

/**
 * Interface for scenes in the application
 * @template T - Type of data that can be passed to the scene when preparing it
 */
export interface Scene<T = any> extends Container {
  /**
   * Prepare the scene with optional data
   * @param data - Optional data to initialize the scene
   */
  prepare?: (data?: T) => void;

  /**
   * Show the scene, possibly with animations
   * @returns Promise that resolves when showing is complete
   */
  show?: () => Promise<void>;

  /**
   * Hide the scene, possibly with animations
   * @returns Promise that resolves when hiding is complete
   */
  hide?: () => Promise<void>;

  /**
   * Update the scene (called each frame)
   * @param time - Ticker instance for timing information
   */
  update?: (time: Ticker) => void;

  /**
   * Resize the scene to new dimensions
   * @param width - New width
   * @param height - New height
   */
  resize?: (width: number, height: number) => void;
}

/**
 * Interface for scene class constructors
 */
export interface SceneConstructor {
  /**
   * A unique identifier for the scene
   */
  readonly SCENE_ID: string;

  /**
   * Optional asset bundles that need to be loaded before showing this scene
   */
  readonly assetBundles?: string[];

  /**
   * Constructor should return a Scene instance
   */
  new (): Scene;
}

/**
 * Configuration options for SceneLoader
 */
export interface SceneLoaderOptions {
  /**
   * The PixiJS application instance
   */
  app: any; // Using 'any' to avoid strict Application type for flexibility

  /**
   * Optional parent container to add scene and overlay views to
   * Defaults to app.stage if not provided
   */
  parentContainer?: Container;

  /**
   * Optional loading scene to show during asset loading
   */
  loadingScene?: Scene;
}
