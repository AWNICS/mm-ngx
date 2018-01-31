import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { LoggedComponent } from './logged.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'logged', component: LoggedComponent }
    ])
  ],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
