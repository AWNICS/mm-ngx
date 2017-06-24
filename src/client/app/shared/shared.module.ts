import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { SpecialityService } from './speciality/speciality.service';
import { NavbarComponent } from './navbar/navbar.component';
import { RadioMessageComponent } from './message-components/radio-message.component';
import { SliderMessageComponent } from './message-components/slider-message.component';
import { CheckBoxMessageComponent } from './message-components/checkbox-message.component';
import { ImageMessageComponent } from './message-components/image-message.component';
import { VideoMessageComponent } from './message-components/video-message.component';
import { TextMessageComponent } from './message-components/text-message.component';
import { AppearMessageComponent } from './message-components/appear-message.component';
/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  declarations: [FooterComponent, NavbarComponent, RadioMessageComponent, SliderMessageComponent, CheckBoxMessageComponent,
  ImageMessageComponent, VideoMessageComponent, TextMessageComponent, AppearMessageComponent],
  exports: [FooterComponent, NavbarComponent, RadioMessageComponent, SliderMessageComponent, CheckBoxMessageComponent,
  ImageMessageComponent, VideoMessageComponent, TextMessageComponent, AppearMessageComponent,
    CommonModule, FormsModule, RouterModule]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [ SpecialityService ]
    };
  }
}
