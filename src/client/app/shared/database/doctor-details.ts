export class DoctorDetails {
  id: number;
  socketId: string;
  name: string;
  picUrl: string;
  regNo: string;
  speciality: string;
  experience: number;
  description: string;
  email: string;
  phoneNo: string;
  status: string;
  waitingTime: number; // in seconds
  rating: number;
  videoUrl: string;
  appearUrl: string;
  token: string;
  activate: number; // either 0 or 1(default is 0)
  privilege: string;
  createdAt: any;
  createdBy: string;
  updatedAt: any;
  updatedBy: string;
  termsAccepted:boolean;
}