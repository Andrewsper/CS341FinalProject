import { Program } from "./ProgramModel";


export class User{
    constructor(
        public email: String,
        private password: String,
        public firstName?: String,
        public lastName?: String,
        public balance?: Number,
        public phoneNumber?: String,
        public address?: String,
        public zipCode?: String,
        public isStaff?: boolean,
        public isMember?: boolean,
        public userid? : String,
        public ownedClasses?: Number[],
        public classesTaken?: Program[]
    ){}

    
}
