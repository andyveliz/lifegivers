import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

import { Donor }    from '../models/donor';

@Injectable()
export class CommService {
    socket: any
    //Observable Donor Source
    private newDonorSource = new Subject<Donor>();
    private removeDonorSource = new Subject<string>();

    //Observable Donor Stream
    newDonor$ = this.newDonorSource.asObservable();
    removeDonor$ = this.removeDonorSource.asObservable();

    constructor(){}
    setSocket(_socket){
        this.socket = _socket;
        var me = this;

        this.socket.on("getDonor", function(donor){
            me.newDonorSource.next(donor);
        })

        this.socket.on("removeDonor", function(id){
            me.removeDonorSource.next(id);
        })
    }
    saveDonor(donor, cb){
        var me = this;
        this.socket.emit("saveDonor", donor, function(err, result){
            if(err) {result = {status : "ERR", err : err} }
            else{
                me.newDonorSource.next(result);
                result.status = "OK";
            } 
            
            cb(result);
        });
    }

    getDonorsInArea(from:Array<number>, to:Array<number>, cb){
        this.socket.emit("donorsInArea", {from: from, to: to}, function(err, result){
            if(err) {result = {status : "ERR", err : err} }
            else result.status = "OK";
            cb(result);
        });
    }

    getDonorById(id:string, cb){
        this.socket.emit("donorById", id, function(err, donor){
            if(err) {donor = {status : "ERR", err : err} }
            else {
                if(donor == undefined)
                    donor = {status: "ERR", err:"Can't Find Donor"};
                else donor.status = "OK";
            }
            cb(donor);
        })
    }

    deleteDonor(id:string, cb){
        var me = this;
        this.socket.emit("deleteDonor", id, function(err){
            var ret = {}
            if(err) {ret = {status : "ERR", err : err} }
            else {
                me.removeDonorSource.next(id);
                ret = {status: "OK"};
            }
            cb(ret);
        })
    }
}