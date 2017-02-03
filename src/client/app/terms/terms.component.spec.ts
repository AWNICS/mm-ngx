import { Component } from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';

import { TermsModule } from './terms.module';

export function main() {
   describe('Terms component', () => {
    // Setting module for testing
    // Disable old forms

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestTermsComponent],
        imports: [TermsModule]
      });
    });

    it('should have the terms header',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TestTermsComponent);
            let contentsDOMEl = fixture.debugElement.children[0].nativeElement;
            console.log('Term components test '+contentsDOMEl.querySelectorAll('h1')[0].textContent);
            expect(contentsDOMEl.querySelectorAll('h1')[0].textContent).toEqual('TERMS OF USE');
          });
        }));
    });
}

@Component({
  selector: 'test-terms-cmp',
  template: '<sd-terms></sd-terms>'
})
class TestTermsComponent {}