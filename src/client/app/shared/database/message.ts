export class Message {
    _id: any;
    receiverId: number; // id of the user to whom the message was sent
    receiverType: string; // group or individual
    senderId: number; // id of the user who has sent the message
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
    createdBy: string;
    updatedBy: string;
    createdTime: any;
    updatedTime: any;
}
