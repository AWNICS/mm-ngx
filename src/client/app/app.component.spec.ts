import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';

import {
  async
} from '@angular/core/testing';
import {
  Route
} from '@angular/router';
import {
  RouterTestingModule
} from '@angular/router/testing';
import { AppComponent } from './app.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ContentsComponent } from './contents/contents.component';
import { TermsComponent } from './terms/terms.component';
import { HomeComponent } from './home/home.component';

export function main() {

  describe('App component', () => {

    let config: Route[] = [
      { path: '', component: HomeComponent },
      { path: 'terms', component: TermsComponent },
      { path: 'contents', component:ContentsComponent }
    ];
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, RouterTestingModule.withRoutes(config)],
        declarations: [
            TestComponent, FooterComponent,
            TermsComponent, AppComponent,
            ContentsComponent, HomeComponent
          ],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' }
        ]
      });
    });

    it('should build without a problem',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TestComponent);
            let compiled = fixture.nativeElement;
            console.log('App components test ');
            expect(compiled).toBeTruthy();
          });
      }));
  });
}

@Component({
  selector: 'test-cmp',
  template: '<sd-app></sd-app>'
})

class TestComponent {
}
