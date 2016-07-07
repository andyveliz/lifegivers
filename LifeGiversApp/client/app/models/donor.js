define(["require", "exports"], function (require, exports) {
    "use strict";
    class Donor {
        constructor(_id, name, email, phone, bloodtype, lat, lng) {
            this._id = _id;
            this.name = name;
            this.email = email;
            this.phone = phone;
            this.bloodtype = bloodtype;
            this.lat = lat;
            this.lng = lng;
        }
    }
    exports.Donor = Donor;
});
//# sourceMappingURL=donor.js.map