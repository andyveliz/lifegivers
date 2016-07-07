var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", '@angular/core', 'rxjs/Observable'], function (require, exports, core_1, Observable_1) {
    "use strict";
    const GEOLOCATION_ERRORS = {
        'errors.location.unsupportedBrowser': 'Browser does not support location services',
        'errors.location.permissionDenied': 'You have rejected access to your location',
        'errors.location.positionUnavailable': 'Unable to determine your location',
        'errors.location.timeout': 'Service timeout has been reached'
    };
    let GeolocationService = class GeolocationService {
        /**
         * Obtains the geographic position, in terms of latitude and longitude coordinates, of the device.
         * @param {Object} [opts] An object literal to specify one or more of the following attributes and desired values:
         *   - enableHighAccuracy: Specify true to obtain the most accurate position possible, or false to optimize in favor of performance and power consumption.
         *   - timeout: An Integer value that indicates the time, in milliseconds, allowed for obtaining the position.
         *              If timeout is Infinity, (the default value) the location request will not time out.
         *              If timeout is zero (0) or negative, the results depend on the behavior of the location provider.
         *   - maximumAge: An Integer value indicating the maximum age, in milliseconds, of cached position information.
         *                 If maximumAge is non-zero, and a cached position that is no older than maximumAge is available, the cached position is used instead of obtaining an updated location.
         *                 If maximumAge is zero (0), watchPosition always tries to obtain an updated position, even if a cached position is already available.
         *                 If maximumAge is Infinity, any cached position is used, regardless of its age, and watchPosition only tries to obtain an updated position if no cached position data exists.
         * @returns {Observable} An observable sequence with the geographical location of the device running the client.
         */
        getLocation(opts) {
            return Observable_1.Observable.create(observer => {
                if (window.navigator && window.navigator.geolocation) {
                    window.navigator.geolocation.getCurrentPosition((position) => {
                        observer.next(position);
                        observer.complete();
                    }, (error) => {
                        switch (error.code) {
                            case 1:
                                observer.error(GEOLOCATION_ERRORS['errors.location.permissionDenied']);
                                break;
                            case 2:
                                observer.error(GEOLOCATION_ERRORS['errors.location.positionUnavailable']);
                                break;
                            case 3:
                                observer.error(GEOLOCATION_ERRORS['errors.location.timeout']);
                                break;
                        }
                    }, opts);
                }
                else {
                    observer.error(GEOLOCATION_ERRORS['errors.location.unsupportedBrowser']);
                }
            });
        }
    };
    GeolocationService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], GeolocationService);
    exports.GeolocationService = GeolocationService;
    exports.geolocationServiceInjectables = [
        core_1.provide(GeolocationService, { useClass: GeolocationService })
    ];
});
//# sourceMappingURL=geolocation.service.js.map