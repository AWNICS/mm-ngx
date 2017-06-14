import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Component } from '@angular/core';
import {
  async, TestBed
} from '@angular/core/testing';
import { FooterComponent } from './footer.component';

export function main() {

  describe('Footer component', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
            TestComponent, FooterComponent
          ],
        schemas: [NO_ERRORS_SCHEMA]
      });
    });

    it('should build without a problem',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TestComponent);
            let compiled = fixture.nativeElement;
            console.log('Footer component test ');
            expect(compiled).toBeTruthy();
          });
      }));
  });
}

@Component({
  selector: 'test-footer-cmp',
  template: '<mm-footer></mm-footer>'
})

class TestComponent {
}
