/*
 * Inject a convenience method at `ol.require` which allows
 * asynchronous loading of OpenLayers modules from
 * non-Webpack-bundled Javascript code - when Webpack is
 * available it is preferable to use {import} along with the
 * {ModuleFederationPlugin}.
 * 
 * @example
 *
 *     const { default: Map } = await ol.require('ol/Map');
 */
if (window !== undefined) {
  window.ol = window.ol || {};
  window.ol.require = function olRequire(openLayersModule) {
    const moduleWithoutOlPrefix = openLayersModule.replace(/^ol\//, './');

    return ol.get(moduleWithoutOlPrefix).then(m => m());
  };
}
