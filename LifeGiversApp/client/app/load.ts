declare var System: any;

const deps = [
    'esri/Map',
    'esri/views/MapView',
    'esri/widgets/Locate',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/symbols/PictureMarkerSymbol',
    'esri/Graphic',
    'esri/layers/GraphicsLayer',
    'esri/geometry/support/webMercatorUtils',
    'esri/geometry/Point'
  ];
const moduleName = (name) => name.match(/[^\/]+$/).shift();

System.config({
  packages: {
    app: {
      defaultExtension: 'js'
    }
  }
});

function register(name: string, mods: any[]) {
  System.register(name, [], exp => {
    return {
      setters: [],
      execute: () => {
        mods.map((mod: any, idx: number) => {
          exp(moduleName(deps[idx]), mod);
        });
      }
    }
  });
}

require(deps, function(...modules) {
  register('esri-mods', modules);
  System.import('app/boot')
    .then(null, console.error.bind(console)); 
});