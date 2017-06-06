import { InMemoryDbService } from 'angular-in-memory-web-api';
import { OrderRequest } from '../../order-window/order-request';
import { Specialities } from '../speciality/speciality';
import { DoctorDetails } from './doctorDetails';
import { Message } from './message';

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

    let messages: Message[] = [
      {
        user: 'Jack',
        id: 23423,
        text: 'I have been wondering where you have been for so long. You expect me to behave normal after so many years?',
        picUrl: 'assets/png/male1.png',
        lastUpdateTime: '',
        type: 'in',
        status: 'sent',
        contentType: 'text'
      },
      {
        user: 'Jessie',
        id: 54486,
        text: 'I understand the situation. I did not mean to hurt your feelings back then. I am sorry!',
        picUrl: 'assets/png/female3.png',
        lastUpdateTime: '',
        type: 'in',
        status: 'delivered',
        contentType: 'text'
      },
      {
        user: 'Dr. George',
        id: 54486,
        text: 'I understand the situation. I did not mean to hurt your feelings back then. I am sorry!',
        picUrl: 'assets/png/female3.png',
        lastUpdateTime: '',
        type: '',
        status: 'delivered',
        contentType: 'radio'
      },
      {
        user: 'Dr. Shwetha',
        id: 23423,
        text: 'I have been wondering where you have been for so long. You expect me to behave normal after so many years?',
        picUrl: 'assets/png/male1.png',
        lastUpdateTime: '',
        type: '',
        status: 'sent',
        contentType: 'checkbox'
      }
    ];

    return {orderRequests, specialities, doctorDetails, messages};
  }
}
