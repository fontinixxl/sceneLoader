// Export core classes
export { SceneLoader } from "./core/SceneLoader";

// Export interfaces - use 'export type' for TypeScript interfaces when isolatedModules is enabled
export type { Scene, SceneConstructor, SceneLoaderOptions } from "./core/interfaces";

// Export utility functions
export { areBundlesLoaded, loadBundles } from "./utils/assetHelper";

/**
 * pixi-scene-loader
 * A scene management system for PixiJS applications
 */
