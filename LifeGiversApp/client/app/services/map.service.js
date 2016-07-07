define(["require", "exports", 'esri-mods'], function (require, exports, esri_mods_1) {
    "use strict";
    class MapService {
        constructor() {
            this.map = new esri_mods_1.Map({ basemap: 'streets' });
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MapService;
});
//# sourceMappingURL=map.service.js.map