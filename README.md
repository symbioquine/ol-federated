## ol-federated

`ol-federated` is a third-party build of [OpenLayers](https://github.com/openlayers/openlayers) using Webpack's [Module Federation](https://webpack.js.org/concepts/module-federation/) features.

The `ol.js` entrypoint exposed by this package, exposes each of the modules from OpenLayers as a separate module within the federated container. This means that all of OpenLayers is available and
can be loaded incrementally as needed.

For many applications, the strategy provided by this package would be really slow/wasteful compared with the recommended strategy of directly bundling OpenLayers as part of your application's build.
The cost comes in terms of increased network connections and poorer overall compression. However, those costs may be worthwhile in the context of applications which need large swathes of OpenLayers
for different user-stories and want to lazy load the requisite OpenLayers functionality or applications which host plugins that need an unknown subset of OpenLayers' functionality.

The `examples/` directory includes demo projects which can be used to profile the performance differences between the three strategies; 1) Simple Webpack bundling, 2) OpenLayers externalized to legacy `ol.js`
build, and 3) OpenLayers federated using `ol-federated`.
