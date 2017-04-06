import { InMemoryDbService } from 'angular-in-memory-web-api';
import { OrderRequest } from '../../order-window/order-request';
import { Location } from '../location/location';

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
        uFile: ''
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
    return {orderRequests, locations};
  }
}
