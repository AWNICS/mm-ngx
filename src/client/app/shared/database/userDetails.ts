export class UserDetails {
  id: number;
  name: string;
  email: string;
  phoneNo: number;
  picUrl: string;
  briefDescription: {
      description: string;
  };
  status: string;
  waitingTime: number; // in seconds
  rating: number;
  //appearUrl: string;
  lastUpdateTime: any;
}
