export class Program {
    constructor(
    public name: string,
    public description: string,
    public offeringPeriod: string,
    public price: number,
    public date: string,
    public maximumCapacity: number,
    public currentCapacity: number,
    public location: string,
    public length?: number,
    public programID?: number

    ){}
}