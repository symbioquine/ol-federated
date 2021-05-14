import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';


function createMap(mapFn) {
  const vectorSource = new VectorSource();
  const vectorLayer = new VectorLayer({source: vectorSource});

  vectorSource.addFeature(new Feature(
      new LineString([
        [-20, 0],
        [20, 0],
      ])
  ));

  let map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM()
      }),
      vectorLayer,
    ],
    view: new View({
      projection: 'EPSG:3857',
      center: fromLonLat([0, 0]),
      zoom: 20
    })
  });
  mapFn.call(null, map, vectorSource);
}

createMap((map, vectorSource) => {

});

