export class Program {
    constructor(
    public name: string,
    public description: string,
    public offeringDateTo: Date,
    public offeringDateFrom: Date,
    public startTime: string,
    public price: number,
    public maximumCapacity: number,
    public currentCapacity: number,
    public location: string,
    public length?: number,
    public programID?: number,
    public daysOffered?: string[],
    public show?: boolean
    ){}
}
