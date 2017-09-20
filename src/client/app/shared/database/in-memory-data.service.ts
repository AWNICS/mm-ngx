import { InMemoryDbService } from 'angular-in-memory-web-api';
import { OrderRequest } from '../../order-window/order-request';
import { Specialities } from '../speciality/speciality';
import { DoctorDetails } from './doctorDetails';
import { Message } from './message';
import { UserDetails } from './userDetails';
import { ContactUs } from './contact-us';

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
        button: 'You clicked me!',
        speciality: 'General Medicine'
      }
    ];

    let doctorDetails: DoctorDetails[] = [
      {
        id: 1,
        name: 'Dr. Joseph',
        picUrl: 'assets/png/docMale.png',
        briefDescription: {
          speciality: 'General Medicine',
          experience: 15,
          description: 'Visiting doctor at St.Johns'
        },
        status: 'online',
        waitingTime: 10,
        rating: 4,
        videoUrl: 'https://www.youtube.com/embed/aatr_2MstrI?enablejsapi=1&autoplay=1',
        appearUrl: 'https://appear.in/spiffy-chameleon',
        collapseId: 'collapse1',
        thumbnailUrl: 'assets/png/Symphony.png',
        lastUpdateTime: '21:29'
      },
      {
        id: 2,
        name: 'Dr. Jordan',
        picUrl: 'assets/png/docMale.png',
        briefDescription: {
          speciality: 'Dietician',
          experience: 12,
          description: 'Visiting doctor at St.Johns'
        },
        status: 'offline',
        waitingTime: 10,
        rating: 3,
        videoUrl: 'https://www.youtube.com/embed/psuRGfAaju4?enablejsapi=1&autoplay=1',
        appearUrl: 'https://appear.in/creative-yak',
        collapseId: 'collapse2',
        thumbnailUrl: 'assets/png/fireflies.png',
        lastUpdateTime: '03:00'
      },
      {
        id: 3,
        name: 'Dr. George',
        picUrl: 'assets/png/docMale.png',
        briefDescription: {
          speciality: 'Psychiatrist',
          experience: 10,
          description: 'Visiting doctor at St.Johns'
        },
        status: 'busy',
        waitingTime: 10,
        rating: 3.5,
        videoUrl: 'https://www.youtube.com/embed/papuvlVeZg8?enablejsapi=1&autoplay=1',
        appearUrl: 'https://appear.in/majestic-dinosaur',
        collapseId: 'collapse3',
        thumbnailUrl: 'assets/png/rockabye.png',
        lastUpdateTime: '20:00'
      },
      {
        id: 4,
        name: 'Dr. Shweta',
        picUrl: 'assets/jpg/docFemale.jpg',
        briefDescription: {
          speciality: 'Gynaecologist',
          experience: 5,
          description: 'Visiting doctor at St.Johns'
        },
        status: 'away',
        waitingTime: 10,
        rating: 4.5,
        videoUrl: 'https://www.youtube.com/embed/60ItHLz5WEA?enablejsapi=1&autoplay=1',
        appearUrl: 'https://appear.in/loyal-trout',
        collapseId: 'collapse4',
        thumbnailUrl: 'assets/png/faded.png',
        lastUpdateTime: '20:30'
      }
    ];

    let specialities: Specialities[] = [
      {
        speciality: 'Select'
      },
      {
        speciality: 'General Medicine'
      },
      {
        speciality: 'Family Medicine'
      },
      {
        speciality: 'Gynaecologist'
      },
      {
        speciality: 'Dietician'
      },
      {
        speciality: 'Psychiatrist'
      }
    ];

    let messages: Message[] = [];

    let userDetails: UserDetails = {
      id: 1,
      name: 'Jack',
      email: 'jack@mail.com',
      phoneNo: 8970074744,
      picUrl: 'assets/png/male2.png',
      briefDescription: {
        description: 'Have been recovering from severe cold and fever'
      },
      status: 'available',
      waitingTime: null, // in seconds
      rating: 4,
      //appearUrl: 'https://appear.in/loyal-trout',
      lastUpdateTime: ''
    };

    let contact: ContactUs[] = [{
      fullName: 'awnics',
      emailId: 'awnics@awnics.com',
      message: 'mesomeds details'
    }];

    return { orderRequests, specialities, doctorDetails, messages, userDetails, contact };
  }
}
