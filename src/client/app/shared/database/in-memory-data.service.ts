import { InMemoryDbService } from 'angular-in-memory-web-api';
import { OrderRequest } from '../../order-window/order-request';
import { Specialities } from '../speciality/speciality';
import { DoctorDetails } from './doctorDetails';
import { ReplyMessage } from './replyMessage';
import { SentMessage } from './sentMessage';

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
        picUrl: 'assets/jpg/user.jpg',
        breifDescription: {
          speciality: 'Pediatrics',
          experience: 15,
          description: 'Visiting doctor at St.Johns'
        },
        status: 'online',
        waitingTime: 10,
        rating: 4,
        videoUrl: 'https://www.youtube.com/embed/aatr_2MstrI?enablejsapi=1&autoplay=1',
        appearUrl: 'https://appear.in/spiffy-chameleon',
        collapseId: 'collapse1',
        thumbnailUrl: 'assets/png/Symphony.png'
      },
      {
        name: 'Dr. Jordan',
        picUrl: 'assets/jpg/user.jpg',
        breifDescription: {
          speciality: 'Pediatrics',
          experience: 15,
          description: 'Visiting doctor at St.Johns'
        },
        status: 'offline',
        waitingTime: 10,
        rating: 3,
        videoUrl: 'https://www.youtube.com/embed/psuRGfAaju4?enablejsapi=1&autoplay=1',
        appearUrl: 'https://appear.in/creative-yak',
        collapseId: 'collapse2',
        thumbnailUrl: 'assets/png/fireflies.png'
      },
      {
        name: 'Dr. George',
        picUrl: 'assets/jpg/user.jpg',
        breifDescription: {
          speciality: 'Pediatrics',
          experience: 15,
          description: 'Visiting doctor at St.Johns'
        },
        status: 'busy',
        waitingTime: 10,
        rating: 3.5,
        videoUrl: 'https://www.youtube.com/embed/papuvlVeZg8?enablejsapi=1&autoplay=1',
        appearUrl: 'https://appear.in/majestic-dinosaur',
        collapseId: 'collapse3',
        thumbnailUrl: 'assets/png/rockabye.png'
      },
      {
        name: 'Dr. Shweta',
        picUrl: 'assets/jpg/user.jpg',
        breifDescription: {
          speciality: 'Pediatrics',
          experience: 15,
          description: 'Visiting doctor at St.Johns'
        },
        status: 'away',
        waitingTime: 10,
        rating: 4.5,
        videoUrl: 'https://www.youtube.com/embed/60ItHLz5WEA?enablejsapi=1&autoplay=1',
        appearUrl: 'https://appear.in/loyal-trout',
        collapseId: 'collapse4',
        thumbnailUrl: 'assets/png/faded.png'
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
          speciality: 'Gyaenocologist'
      },
      {
          speciality: 'Dietician'
      },
      {
          speciality: 'Psychiatrist'
      }
    ];

    let replyMessages: ReplyMessage[] = [
      {
        message: 'Hello there',
        replyTime: '12:27'
      }
    ];

    let sentMessages: SentMessage[] = [
      {
        message: 'How are you?',
        sentTime: '12:26'
      }
    ];

    return {orderRequests, specialities, doctorDetails, replyMessages, sentMessages};
  }
}
