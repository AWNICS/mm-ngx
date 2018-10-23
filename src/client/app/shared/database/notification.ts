export class Notification {
    id: number;
    userId: number;
    type: string;
    title: string;
    content: {
        speciality: string,
        consultationId: number
    };
    status: string;
    channel: string;
    priority: number;
    template: {
        to:string;
        from:string;
        body:string;
        signature:string;
        attachment:string;
    };
    triggerTime: Date;
    createdBy: number;
    updatedBy: number;
}
