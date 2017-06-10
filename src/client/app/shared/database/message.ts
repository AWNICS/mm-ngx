export class Message {
    id: number;
    user: string;
    picUrl: string;
    text: string;
    type: string;
    status: string; //sent,seen,notSent,error(unauthorised,connectionFailed)
    contentType: string; //text,image,radio,checkbox,slider,video
    contentData: { // data that needs to be sent to the component
        data:string[];
    };
    responseData: { // data that componenet send out to the web services
        data:string[];
    };
    lastUpdateTime: any;
}
