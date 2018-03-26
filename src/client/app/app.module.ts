import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieModule } from 'ngx-cookie';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AdminModule } from './admin/admin.module';
import { ContentsModule } from './contents/contents.module';
import { HomeModule } from './home/home.module';
import { OrderWindowModule } from './order-window/order-window.module';
import { TermsModule } from './terms/terms.module';
import { DoctorsListModule } from './doctors-list/doctors-list.module';
import { SharedModule } from './shared/shared.module';
import { DoctorLiveModule } from './doctor-live/doctor-live.module';
import { UserLiveModule } from './user-live/user-live.module';
import { LoginModule } from './login/login.module';
import { ChatModule } from './chat/chat.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//ng2-smart-tables
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    ContentsModule,
    FormsModule,
    AdminModule,
    HomeModule,
    OrderWindowModule,
    ReactiveFormsModule,
    TermsModule,
    DoctorsListModule,
    SharedModule.forRoot(),
    Ng2SmartTableModule,
    CookieModule.forRoot(),
    DoctorLiveModule,
    UserLiveModule,
    LoginModule,
    ChatModule,
    NgbModule.forRoot()
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
