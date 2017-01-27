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

              expect(contentsDOMEl.querySelectorAll('h2')[0].textContent).toEqual('Features');
          });
        }));
    });
}

@Component({
  selector: 'test-cmp',
  template: '<sd-contents></sd-contents>'
})
class TestComponent {}
