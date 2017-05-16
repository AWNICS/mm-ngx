import { InMemoryDbService } from 'angular-in-memory-web-api';
import { OrderRequest } from '../../order-window/order-request';
import { Location } from '../location/location';
import { DoctorDetails } from './doctorDetails';

export class InMemoryDataService implements InMemoryDbService {

  createDb() {
    let orderRequests: OrderRequest[] = [
      {
        id: 1,
        fullname: 'Arun Gadag',
        tel: 8970074777,
        watel: 8050836653,
        confirmationId: 654645,
        location: 'Bangalore',
        mail: 'arun.gdg@gmail.com',
        manual: 'This is testing',
        termsAccepted: true,
        uFile: '',
        dp: 'assets/jpg/arun.jpg',
        button: 'You clicked me!'
      }
    ];

    let doctorDetails: DoctorDetails[] = [
      {
        name: 'Dr. Joseph',
        picUrl: 'assets/jpg/a.jpg',
        breifDescription: {
          speciality: 'Pediatrics',
          experience: 15,
          description: 'Visiting doctor at St.Johns'
        },
        status: 'online',
        waitingTime: 10,
        rating: 4,
        videoUrl: 'http://www.youtube.com/watch?v=papuvlVeZg8'
      },
      {
        name: 'Dr. Jordan',
        picUrl: 'assets/jpg/a.jpg',
        breifDescription: {
          speciality: 'Pediatrics',
          experience: 15,
          description: 'Visiting doctor at St.Johns'
        },
        status: 'offline',
        waitingTime: 10,
        rating: 4,
        videoUrl: 'http://www.youtube.com/watch?v=papuvlVeZg8'
      },
      {
        name: 'Dr. George',
        picUrl: 'assets/jpg/a.jpg',
        breifDescription: {
          speciality: 'Pediatrics',
          experience: 15,
          description: 'Visiting doctor at St.Johns'
        },
        status: 'busy',
        waitingTime: 10,
        rating: 4,
        videoUrl: 'http://www.youtube.com/watch?v=papuvlVeZg8'
      },
      {
        name: 'Dr. Shweta',
        picUrl: 'assets/jpg/a.jpg',
        breifDescription: {
          speciality: 'Pediatrics',
          experience: 15,
          description: 'Visiting doctor at St.Johns'
        },
        status: 'away',
        waitingTime: 10,
        rating: 4,
        videoUrl: 'http://www.youtube.com/watch?v=papuvlVeZg8'
      }
    ];

    let locations: Location[] = [
      {
          location: 'RT Nagar'
      },
      {
          location: 'Hebbal'
      },
      {
          location: 'Sanjay Nagar'
      },
      {
          location: 'Malleswaram'
      },
      {
          location: 'Sadashivanagar'
      }
    ];
    return {orderRequests, locations, doctorDetails};
  }
}
