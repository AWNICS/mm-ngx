export class OrderRequest {
    location:string;
    tel:number;
    fullname:string;
    watel: number;
    mail:string;
    uFile:string;
    manual:string;
    termsAccepted:boolean;

    constructor(
        location:string,
        tel:number,
        fullname:string,
        watel: number,
        mail:string,
        uFile:string,
        manual:string,
        termsAccepted:boolean
        ) {
            this.location = location;
            this.tel = tel;
            this.fullname = fullname;
            this.watel = watel;
            this.mail = mail;
            this.uFile = uFile;
            this.manual = manual;
            this.termsAccepted = termsAccepted;
    }
}