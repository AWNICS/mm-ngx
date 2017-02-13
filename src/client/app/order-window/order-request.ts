export class OrderRequest {
    
    constructor(
        public location:string,
        public tel:number,
        public fullname:string,
        public watel: number,
        public mail:string,
        public uFile:string,
        public manual:string,
        public termsAccepted:boolean) {
            location = this.location;
            tel = this.tel;
            fullname = this.fullname;
            watel = this.watel;
            mail = this.mail;
            uFile = this.uFile;
            manual = this.manual;
            termsAccepted = this.termsAccepted;
        }
}