import { Program } from "./Program";

export class User{
    constructor(
        public firstName: String,
        public lastName: String,
        public balance: Number,
        public isStaff: boolean,
        public isMember: boolean,
        public username: String,
        private password: String,
        public ownedClasses: Program[],
        public classesTaken: Program[]

    ){}
}