import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ContentsModule } from './contents/contents.module';
import { HomeModule } from './home/home.module';
import { OrderWindowModule } from './order-window/order-window.module';
import { TermsModule } from './terms/terms.module';
import { SharedModule } from './shared/shared.module';
import { LocationService } from './shared/location-list/location-list.service';

@NgModule({
  imports: [BrowserModule, HttpModule, AppRoutingModule, ContentsModule, 
  HomeModule, OrderWindowModule, TermsModule, SharedModule.forRoot()],
  declarations: [AppComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }, LocationService],
  bootstrap: [AppComponent]

})
export class AppModule { }
