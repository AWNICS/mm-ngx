import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { ContentsModule } from '../contents/contents.module';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { DoctorRegisterComponent } from './doctor-register.component';
import { LoginService } from './login.service';

@NgModule({
  imports: [CommonModule, SharedModule, ContentsModule, FormsModule, ReactiveFormsModule, LoginRoutingModule],
  declarations: [LoginComponent, RegisterComponent, DoctorRegisterComponent],
  exports: [LoginComponent, RegisterComponent, DoctorRegisterComponent],
  providers: [LoginService]
})
export class LoginModule { }
