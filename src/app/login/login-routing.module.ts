import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { DoctorRegisterComponent } from './doctor-register.component';
import { ForgotPasswordComponent } from './forgot-password.component';
import { ResetPasswordComponent } from './reset-password.component';
import { ActivationComponent } from './activation.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'registerDoctor', component: DoctorRegisterComponent },
      { path: 'forgotPassword', component: ForgotPasswordComponent },
      { path: 'resetPassword/:token', component: ResetPasswordComponent },
      { path: 'activates/:token', component: ActivationComponent}
    ])
  ],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
