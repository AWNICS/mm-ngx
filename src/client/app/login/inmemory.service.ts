import { InMemoryDbService, InMemoryWebApiModule} from 'angular-in-memory-web-api';
import { ParsedRequestUrl, RequestInfo, RequestInfoUtilities, ResponseOptions } from 'angular-in-memory-web-api/interfaces';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap, delay } from 'rxjs/operators';
import { createConnection } from 'net';

export class fakeLoginDataService implements InMemoryDbService{
createDb(reqInfo?: RequestInfo){
        console.log('hit memdb');
        let use={"id":4,"firstname":"Nilu","lastname":"Roy","email":"nilu@gmail.com","password":"$2a$10$7.g0F6yWuGnGyMjJSIi2peY5hqAMYVJpnZm3KtkPiPjqJcCM4Bce.","phoneNo":"7258456412","aadhaarNo":789654123654,"picUrl":"","description":null,"status":"online","token":"900dcd48e3e55c5d","activate":"0","role":"patient","socketId":"1xdHT-XqI_yG8QFWAAAU","createdBy":4,"updatedBy":4,"createdAt":"2018-05-22T10:37:36.000Z","updatedAt":"2018-07-06T09:57:52.000Z"};
        let logindata={
            "user": {
                "id": 4,
                "firstname": "Nilu",
                "lastname": "Roy",
                "email": "nilu@gmail.com",
                "password": "$2a$10$7.g0F6yWuGnGyMjJSIi2peY5hqAMYVJpnZm3KtkPiPjqJcCM4Bce.",
                "phoneNo": "7458456412",
                "aadhaarNo": 789654123654,
                "picUrl": "",
                "description": null,
                "status": "online",
                "token": "900dcd48e3e55c5d",
                "activate": "0",
                "role": "patient",
                "socketId": "vHj499Mc4knOROPwAADA",
                "createdBy": 4,
                "updatedBy": 4,
                "createdAt": "2018-05-22T10:37:36.000Z",
                "updatedAt": "2018-07-17T11:14:31.000Z"
            },
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjo0LCJmaXJzdG5hbWUiOiJOaWx1IiwibGFzdG5hbWUiOiJSb3kiLCJlbWFpbCI6Im5pbHVAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkNy5nMEY2eVd1R25HeU1qSlNJaTJwZVk1aHFBTVlWSnBuWm0zS3RrUGlQanFKY0NNNEJjZS4iLCJwaG9uZU5vIjoiNzQ1ODQ1NjQxMiIsImFhZGhhYXJObyI6Nzg5NjU0MTIzNjU0LCJwaWNVcmwiOiIiLCJkZXNjcmlwdGlvbiI6bnVsbCwic3RhdHVzIjoib25saW5lIiwidG9rZW4iOiI5MDBkY2Q0OGUzZTU1YzVkIiwiYWN0aXZhdGUiOiIwIiwicm9sZSI6InBhdGllbnQiLCJzb2NrZXRJZCI6InZIajQ5OU1jNGtuT1JPUHdBQURBIiwiY3JlYXRlZEJ5Ijo0LCJ1cGRhdGVkQnkiOjQsImNyZWF0ZWRBdCI6IjIwMTgtMDUtMjJUMTA6Mzc6MzYuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMTgtMDctMTdUMTE6MTQ6MzEuMDAwWiJ9LCJleHAiOjE1MzI0OTg2ODUsImlhdCI6MTUzMTg5Mzg4NX0.tfzFsrlwcWXqxSPrY-wm4k63JLHp3z_ZXxq2e85aO9Y"
        }
        const db = { use, logindata};
    return Observable.of(db);
}
get(reqInfo: RequestInfo) {
console.log(reqInfo);
    if(reqInfo.requestInfo.resourceUrl.match(/(users.\d.)$/)){
        const data = reqInfo.db.value.use; 
        const options = Observable.of(data);
        return options;
    }   
    else{
        console.log("hot else block");
        return reqInfo.passThruBackend.createConnection(reqInfo.requestInfo.req).response;
    }
}
post(reqInfo: RequestInfo){
    return reqInfo.passThruBackend.createConnection(reqInfo.requestInfo.req).response;
    // const data = reqInfo.db.value.logindata;
    // return Observable.of(data);
    // console.log(reqInfo.requestInfo.req);
}
 
}