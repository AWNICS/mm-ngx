import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { DoctorRegisterComponent } from './doctor-register.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'registerDoctor', component: DoctorRegisterComponent }
    ])
  ],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
