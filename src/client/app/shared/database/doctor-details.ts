export class DoctorDetails {
  id: number;
  name: string;
  picUrl: string;
  briefDescription: {
      speciality: string;
      experience: number;
      description: string;
  };
  status: string;
  waitingTime: number; // in seconds
  rating: number;
  videoUrl: string;
  appearUrl: string;
  collapseId: string;
  thumbnailUrl: string;
  lastUpdateTime: any;
}
