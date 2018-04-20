export class UserDetails {
  id: any;
  socketId: string;
  firstname: string;
  lastname: string;
  email: string;
  password:string;
  phoneNo: number;
  aadhaarNo: number;
  picUrl: string;
  description: string;
  status: string;
  waitingTime: number; // in seconds
  rating: number;
  appearUrl: string;
  token: string; // token generated to activate the user
  actviate: number; // either 0 or 1(default is 0)
  role: string; // user or admin privilege
  createdTime: any;
  createdBy: string;
  updatedTime: any;
  updatedBy: string;
}
