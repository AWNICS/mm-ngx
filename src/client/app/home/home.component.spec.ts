import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  async,
  TestBed
 } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { HomeComponent } from './home.component';
import { LocationService } from '../shared/location/location.service';

export function main() {
  describe('Home component', () => {

    beforeEach(() => {

      TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [HomeComponent],
        providers: [
          { provide: LocationService, useValue: new MockLocationService() }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      });

    });

    it('should work',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(HomeComponent);
            let homeInstance = fixture.debugElement.componentInstance;
            let homeDOMEl = fixture.debugElement.nativeElement;
            /*let mockLocationService = fixture.debugElement.injector.get(LocationService) as MockLocationService;
            let mockLocationSpy= spyOn(mockLocationService, 'getLocation').and.callThrough();

            mockLocationService.returnValue = ['Hebbal', 'Malleshwaram', 'RT Nagar'];

            fixture.detectChanges();

            expect(homeInstance._locationService).toEqual(jasmine.any(MockLocationService));
            expect(homeDOMEl.querySelectorAll('select').length).toEqual(1);
            expect(mockLocationSpy.calls.count()).toBe(1);*/

            fixture.detectChanges();

            //1. Change the name model in the component bound to the h2 tag in the html
            let testName:string = 'Mesomeds Landing';
            homeInstance.pageTitle = testName;
            console.log('Home component test name is: '+ testName);

            //2. Update the test bed with the changes
            fixture.detectChanges();

            //3. Test whether the test value was updated in the bound html's text property
            expect(homeDOMEl.querySelectorAll('h1')[0].textContent).toEqual('Mesomeds Landing');
          });
      }));
  });
}

class MockLocationService {
  returnValue: string[];
  getLocation(): Observable<string[]> {
    return Observable.create((observer: any) => {
      observer.next(this.returnValue);
      observer.complete();
    });
  }
}
