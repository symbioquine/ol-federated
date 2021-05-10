This example shows building against the normal OpenLayers dependency, but with `ol/` imports externalized such that they point at the static legacy `ol.js` OpenLayers build. e.g. an
import of `ol/source/Vector` becomes a reference to the global `ol.source.Vector`.

This strategy means loading all of OpenLayers, but has relatively low network overhead because the static `ol.js` build is only a single well-minified file which compresses decently.
