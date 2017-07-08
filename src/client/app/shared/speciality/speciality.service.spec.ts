import { BaseRequestOptions, ConnectionBackend, Http, Response, ResponseOptions } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';

import { Observable } from 'rxjs/Observable';

import { SpecialityService } from './speciality.service';

export function main() {
  describe('Speciality Service', () => {
    let specialityService: SpecialityService;
    let mockBackend: MockBackend;

    beforeEach(() => {

      TestBed.configureTestingModule({
        providers: [
          SpecialityService,
          MockBackend,
          BaseRequestOptions,
          {
            provide: Http,
            useFactory: (backend: ConnectionBackend, options: BaseRequestOptions) => new Http(backend, options),
            deps: [MockBackend, BaseRequestOptions]
          }
        ]
      });
    });

    // checking for the Observable from LocationService
  /*  it('should return an Observable when get called', async(() => {
      expect(TestBed.get(SpecialityService).getSpecialities()).toEqual(jasmine.any(Observable));
    }));
*/
    // getting the names from the mockBackend
    /*it('should resolve to list of names when get called', async(() => {
      let specialityService = TestBed.get(SpecialityService);
      let mockBackend = TestBed.get(MockBackend);

      mockBackend.connections.subscribe((c: any) => {
        c.mockRespond(new Response(new ResponseOptions({ body: '["General Medicine", "Family Medicine"]' })));
      });

      specialityService.getSpecialities().subscribe((data: any) => {
        expect(data).toEqual(['General Medicine', 'Family Medicine']);
      });
    }));*/
  });
}
