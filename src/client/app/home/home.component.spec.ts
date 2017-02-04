import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  async,
  TestBed
 } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { HomeComponent } from './home.component';

export function main() {
  describe('Home component', () => {

    beforeEach(() => {

      TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [HomeComponent],
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

            fixture.detectChanges();

            //1. Change the name model in the component bound to the h2 tag in the html
            let testName:string = 'Mesomeds Landing';
            homeInstance.name = testName;
            console.log('Home component test name is: '+testName);

            //2. Update the test bed with the changes
            fixture.detectChanges();

            //3. Test whether the test value was updated in the bound html's text property
            expect(homeDOMEl.querySelectorAll('h1')[0].textContent).toEqual('Mesomeds Landing');

            //expect(homeDOMEl.querySelectorAll('li').length).toEqual(4);
            //expect(homeDOMEl.querySelectorAll('li')[3].textContent).toEqual('Minko');
          });

      }));
  });
}

/*class MockNameListService {

  returnValue: string[];

  get(): Observable<string[]> {
    return Observable.create((observer: any) => {
      observer.next(this.returnValue);
      observer.complete();
    });
  }
}*/
