import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Component } from '@angular/core';
import {
  async, TestBed
} from '@angular/core/testing';

import { ThanksComponent } from './thanks.component';
import { OrderRequestService } from '../order-window/order-request.service';
import { AdminService } from '../admin/admin.service';

class MockOrderRequest {
    constructor() {
        let rand = Math.floor((Math.random() * 1000000));
        return rand;
    }
}

export function main() {

  describe('Thanks component', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, ThanksComponent],
          providers: [
              {provide: OrderRequestService, useValue: new MockOrderRequest()},
              {provide: AdminService}
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
            console.log('Thanks component test ');
            expect(compiled).toBeTruthy();
          });
      }));
  });
}

@Component({
  selector: 'test-thanks-cmp',
  template: '<mm-thanks></mm-thanks>'
})

class TestComponent {
}
