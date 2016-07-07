var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", '@angular/core', 'rxjs/Subject'], function (require, exports, core_1, Subject_1) {
    "use strict";
    let CommService = class CommService {
        constructor() {
            //Observable Donor Source
            this.newDonorSource = new Subject_1.Subject();
            this.removeDonorSource = new Subject_1.Subject();
            //Observable Donor Stream
            this.newDonor$ = this.newDonorSource.asObservable();
            this.removeDonor$ = this.removeDonorSource.asObservable();
        }
        setSocket(_socket) {
            this.socket = _socket;
            var me = this;
            this.socket.on("getDonor", function (donor) {
                me.newDonorSource.next(donor);
            });
            this.socket.on("removeDonor", function (id) {
                me.removeDonorSource.next(id);
            });
        }
        saveDonor(donor, cb) {
            var me = this;
            this.socket.emit("saveDonor", donor, function (err, result) {
                if (err) {
                    result = { status: "ERR", err: err };
                }
                else {
                    me.newDonorSource.next(result);
                    result.status = "OK";
                }
                cb(result);
            });
        }
        getDonorsInArea(from, to, cb) {
            this.socket.emit("donorsInArea", { from: from, to: to }, function (err, result) {
                if (err) {
                    result = { status: "ERR", err: err };
                }
                else
                    result.status = "OK";
                cb(result);
            });
        }
        getDonorById(id, cb) {
            this.socket.emit("donorById", id, function (err, donor) {
                if (err) {
                    donor = { status: "ERR", err: err };
                }
                else {
                    if (donor == undefined)
                        donor = { status: "ERR", err: "Can't Find Donor" };
                    else
                        donor.status = "OK";
                }
                cb(donor);
            });
        }
        deleteDonor(id, cb) {
            var me = this;
            this.socket.emit("deleteDonor", id, function (err) {
                var ret = {};
                if (err) {
                    ret = { status: "ERR", err: err };
                }
                else {
                    me.removeDonorSource.next(id);
                    ret = { status: "OK" };
                }
                cb(ret);
            });
        }
    };
    CommService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], CommService);
    exports.CommService = CommService;
});
//# sourceMappingURL=comm.service.js.map