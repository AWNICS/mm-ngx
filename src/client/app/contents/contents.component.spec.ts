import { Component } from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';

import { ContentsModule } from './contents.module';

export function main() {
   describe('Contents component', () => {
    // Setting module for testing
    // Disable old forms

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent],
        imports: [ContentsModule]
      });
    });

    it('should work',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TestComponent);
            let contentsDOMEl = fixture.debugElement.children[0].nativeElement;
            console.log('Content components test ');
            expect(contentsDOMEl.querySelectorAll('h2')[0].textContent)
            .toEqual('Get Medicines, Health care products, cosmetics and much more delivered to your doorstep.');
          });
        }));
    });
}

@Component({
  selector: 'test-cmp',
  template: '<mm-contents></mm-contents>'
})
class TestComponent {}
