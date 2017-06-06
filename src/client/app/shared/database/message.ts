export class Message {
    id: number;
    user: string;
    picUrl: string;
    text: string;
    type: string;
    status: string; //sent,seen,notSent,error(unauthorised,connectionFailed)
    contentType: string; //text,image,radio,checkbox,slider,video
    /*contentData: {
        data:string[];
    };*/
    lastUpdateTime: any;
}
