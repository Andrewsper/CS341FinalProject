import { Program } from "./Program";

export class User{
    constructor(
        public email: String,
        private password: String,
        private userid? : String,
        public firstName?: String,
        public lastName?: String,
        public balance?: Number,
        public phoneNumber?: String,
        public address?: String,
        public zipCode?: String,
        public isStaff?: boolean,
        public isMember?: boolean,
        public ownedClasses?: Program[],
        public classesTaken?: Program[]
    ){}

    
}
