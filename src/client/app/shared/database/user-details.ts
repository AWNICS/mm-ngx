export class UserDetails {
  id: any;
  socketId: string;
  name: string;
  email: string;
  phoneNo: number;
  picUrl: string;
  description: string;
  status: string;
  waitingTime: number; // in seconds
  rating: number;
  appearUrl: 'https://appear.in/arun-gadag';
  token: string; // token generated to activate the user
  actviate: number; // either 0 or 1(default is 0)
  privilege: string; // user or admin privilege
  createdTime: any;
  createdBy: string;
  updatedTime: any;
  updatedBy: string;
}
