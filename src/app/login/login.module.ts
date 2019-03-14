import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { HomeModule } from '../home/home.module';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { DoctorRegisterComponent } from './doctor-register.component';
import { ForgotPasswordComponent } from './forgot-password.component';
import { LoginService } from './login.service';
import { ResetPasswordComponent } from './reset-password.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ActivationComponent } from './activation.component';

@NgModule({
  imports: [CommonModule, SharedModule, HomeModule, FormsModule, ReactiveFormsModule, LoginRoutingModule,
     NgMultiSelectDropDownModule.forRoot()],
  declarations: [LoginComponent, RegisterComponent, DoctorRegisterComponent, ForgotPasswordComponent,
    ResetPasswordComponent, ActivationComponent],
  exports: [LoginComponent, RegisterComponent, DoctorRegisterComponent, ForgotPasswordComponent,
    ResetPasswordComponent, ActivationComponent],
  providers: [LoginService]
})
export class LoginModule { }
