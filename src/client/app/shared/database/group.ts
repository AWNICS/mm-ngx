export class Group {
    id: number; // group id
    name: string; // group name
    url: string; // group url
    userId: number; // ids of the users present in the group
    details: { // description of the group
        description: string,
        speciality: string
    };
    picture: string; // picture url
    status: string;
    createdBy: number;
    updatedBy: number;
    createdTime: any;
    updatedTime: any;
}
