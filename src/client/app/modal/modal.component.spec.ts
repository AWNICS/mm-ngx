import { Component } from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';

import { ModalModule } from './modal.module';

export function main() {
   describe('Modal component', () => {
    // Setting module for testing
    // Disable old forms

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent],
        imports: [ModalModule]
      });
    });

    it('should work',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TestComponent);
            let modalDOMEl = fixture.debugElement.children[0].nativeElement;

              expect(modalDOMEl.querySelectorAll('h2')[0].textContent).toEqual('Features');
          });
        }));
    });
}

@Component({
  selector: 'test-cmp',
  template: '<sd-modal></sd-modal>'
})
class TestComponent {}
