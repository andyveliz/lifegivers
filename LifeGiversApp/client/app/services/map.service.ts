import { Map } from 'esri-mods';

export default class MapService {
  map: Map;
  constructor() {
    this.map = new Map({ basemap: 'streets' });
  }
}