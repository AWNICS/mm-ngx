import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DocumentMessageComponent } from './message-components/document-message.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RadioMessageComponent } from './message-components/radio-message.component';
import { SliderMessageComponent } from './message-components/slider-message.component';
import { CheckBoxMessageComponent } from './message-components/checkbox-message.component';
import { ImageMessageComponent } from './message-components/image-message.component';
import { VideoMessageComponent } from './message-components/video-message.component';
import { TextMessageComponent } from './message-components/text-message.component';
import { AppearMessageComponent } from './message-components/appear-message.component';
//import { AlertMessageComponent } from './message-components/alert-message.component';
import { SecurityService } from './services/security.service';
import { SharedService } from './services/shared.service';

import { PipesModule } from '../pipes/pipes.module';
import { NotificationComponent } from './notification/notification.component';
/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, PipesModule],
  declarations: [
    DocumentMessageComponent,
    FooterComponent,
    NavbarComponent,
    RadioMessageComponent,
    SliderMessageComponent,
    CheckBoxMessageComponent,
    ImageMessageComponent,
    VideoMessageComponent,
    TextMessageComponent,
    AppearMessageComponent,
    NotificationComponent
    //AlertMessageComponent
  ],
  exports: [
    DocumentMessageComponent,
    FooterComponent,
    NavbarComponent,
    RadioMessageComponent,
    SliderMessageComponent,
    CheckBoxMessageComponent,
    ImageMessageComponent,
    VideoMessageComponent,
    TextMessageComponent,
    AppearMessageComponent,
    NotificationComponent,
    //AlertMessageComponent,
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [ SharedService, SecurityService ]
    };
  }
}
