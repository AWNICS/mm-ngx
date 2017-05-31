export class Message {
    id: number;
    user: string;
    picUrl: string;
    text: string;
    type: string;
    status: string; //sent,seen,notSent,error(unauthorised,connectionFailed)
    lastUpdateTime: any;
}
