export class Message {
    _id: any; // message id
    receiverId: number;
    receiverType: string; // group or individual
    senderId: number;
    picUrl: string; // image of the sender or receiver
    text: string; // message data
    type: string; // type of the message(checkbox, radio, image, video, etc)
    status: string; // delivered, read, not-delivered
    contentType: string; // for radio, checkbox and slider
    contentData: {
        data: [string] // for radio, checkbox and slider
    };
    responseData: {
        data: [string] // for radio, checkbox and slider
    };
    createdBy: string;
    updatedBy: string;
    createdTime: any;
    updatedTime: any;
}
