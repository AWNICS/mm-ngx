import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SmartTableModule } from 'ng2-smart-table';
// Import the timeline library
import { VerticalTimelineModule } from 'angular-vertical-timeline';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
import { TermsModule } from './terms/terms.module';
import { SharedModule } from './shared/shared.module';
import { LoginModule } from './login/login.module';
import { ChatModule } from './chat/chat.module';
import { ProfileModule } from './profile/profile.module';
import { PipesModule } from './pipes/pipes.module';
import { ConsultationModule } from './consultation/consultation.module';
import { PaymentModule } from './payment/payment.module';
import { DoctorsListModule } from './doctors-list/doctors-list.module';
import { DashboardModule } from './dashboard/dashboard.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    FormsModule,
    HomeModule,
    ReactiveFormsModule,
    TermsModule,
    SharedModule.forRoot(),
    Ng2SmartTableModule,
    VerticalTimelineModule,
    LoginModule,
    ChatModule,
    ConsultationModule,
    PaymentModule,
    ProfileModule,
    DoctorsListModule,
    NgbModule.forRoot(),
    PipesModule.forRoot(),
    DashboardModule
    ],
  declarations: [AppComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]

})
export class AppModule { }
