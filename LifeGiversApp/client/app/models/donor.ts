export class Donor {
  constructor(
    public _id: string,
    public name: string,
    public email: string,
    public phone: string,
    public bloodtype: string,
    public lat: number,
    public lng: number
  ) {  }

}