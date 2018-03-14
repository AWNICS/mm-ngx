export class DoctorDetails {
  id: number;
  socketId: string;
  name: string;
  password: string;
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
  role: string;
  termsAccepted:boolean;
  createdAt: any;
  createdBy: string;
  updatedAt: any;
  updatedBy: string;
}
