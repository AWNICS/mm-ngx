import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';

import { TestBed, async, inject} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router, RouterModule, Route, Routes } from '@angular/router';
import { By } from '@angular/platform-browser';

import { NavbarComponent } from '../shared/navbar/navbar.component';
import { LoginComponent } from './login.component';

import { MockBackend, MockConnection } from '@angular/http/testing';
import { InMemoryWebApiModule, InMemoryBackendService } from 'angular-in-memory-web-api';
import { Http, Response, ResponseOptions, ConnectionBackend, BaseRequestOptions, RequestMethod, XHRBackend, BrowserXhr, XSRFStrategy, BaseResponseOptions } from "@angular/http";
import { Headers, RequestOptions,ResponseContentType } from '@angular/http';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserDetails } from '../shared/database/user-details';
import { FilterPipe } from '../pipes/filter.pipe';
import { SafePipe } from '../pipes/safe.pipe';
import { DatePipe } from '../pipes/date.pipe';

import { SharedService } from '../shared/services/shared.service';
import { SecurityService } from '../shared/services/security.service';
import { LoginService } from './login.service';
import { SocketService } from '../chat/socket.service';
import { ChatService } from '../chat/chat.service';
import { fakeLoginDataService } from './inmemory.service';

export function main(){

describe('Test the chat ui',()=>{
    const routes:Routes=[
        { path: 'login', component: LoginComponent },
        { path: 'register', component: LoginComponent },
        { path: 'doctors', component: LoginComponent },
        // { path: 'register', component: RegisterComponent },
        // { path: 'registerDoctor', component: DoctorRegisterComponent },
        // { path: 'forgotPassword', component: ForgotPasswordComponent },
        // { path: 'resetPassword/:token', component: ResetPasswordComponent }
    ]
    const headers = new Headers();
    beforeEach(()=>{
        TestBed.configureTestingModule({
            imports:[FormsModule, ReactiveFormsModule,  HttpModule, InMemoryWebApiModule.forRoot(fakeLoginDataService,{delay:0,passThruUnknownUrl: true }), RouterTestingModule.withRoutes(routes), NgbModule.forRoot(),],
            declarations:[TestLoginComponent, LoginComponent, NavbarComponent,  FilterPipe, SafePipe, DatePipe],
            schemas: [NO_ERRORS_SCHEMA],
            providers:[
                NgbModal,
                ConnectionBackend,
                MockBackend,
                BaseRequestOptions,
                BaseResponseOptions,
                SocketService,
                ChatService,
                SharedService,
                SecurityService,
                LoginService,
                // {provide:XHRBackend, useClass:InMemoryBackendService},
                // {provide: ActivatedRoute, useValue: {snapshot:{params:{'userId':'4'}}}}
            ]
        });
    });
    beforeEach(()=>{
        
    });
     let requiredFunc={
        buttonclick(){
                console.log('button clicked');
                // return null
        },
        linkclick(){
                console.log('link clicked');
                // return   
        }

     }


    it('Checks the Navbar components',async(()=>{
            TestBed.compileComponents().then(()=>{
                    let  a = TestBed.createComponent(TestLoginComponent);
                    let b = a.componentInstance;
                    a.detectChanges();
                    let i;
                    let button = a.nativeElement.querySelector('.navbar .navbar-toggler');
                    let buttond = a.debugElement.query(By.css('.navbar .navbar-toggler'));
                    let links = a.nativeElement.querySelectorAll('.navbar a');
                    let linksd = a.debugElement.queryAll(By.css('.navbar a'));
                    let spy1 = spyOn(requiredFunc,'buttonclick');
                    let spy2= spyOn(requiredFunc,'linkclick');
                    button.addEventListener('click',()=>{
                        requiredFunc.buttonclick();
                    });
                    button.click();
                    for(i=0;i<3;i++){
                        links[i].addEventListener('click',()=>{
                            requiredFunc.linkclick();
                        })
                        links[i].click();
                    }
                    expect(button).toBeTruthy();
                    expect(links).toBeTruthy();
                    expect(links.length).toEqual(3);
                    expect(button.innerHTML).not.toEqual(null||undefined);
                    for(i=0;i<3;i++){
                        expect(links[i].innerHTML).not.toEqual(null||undefined);
                    };
                    expect(spy1).toHaveBeenCalledTimes(1);
                    expect(spy1).toHaveBeenCalledTimes(1);
                    expect(spy2).toHaveBeenCalledTimes(3);

                    // a.detectChanges();
                    // console.log(buttond.triggerEventHandler);
                    // buttond.triggerEventHandler('click',null);
                });
            }));
        it('checks the form components if working',async(()=>{
            TestBed.compileComponents().then(()=>{
                let  a = TestBed.createComponent(TestLoginComponent);
                let b = a.componentInstance;
                a.detectChanges();
                let i;
                let button = a.nativeElement.querySelector('form button');
                let buttond = a.debugElement.query(By.css('form button'));
                let links = a.nativeElement.querySelectorAll('form a');
                let linksd = a.debugElement.queryAll(By.css('form a'));
                let spy1 = spyOn(requiredFunc,'buttonclick');
                let spy2= spyOn(requiredFunc,'linkclick');
                button.addEventListener('click',()=>{
                    requiredFunc.buttonclick();
                });
                button.click();
                for(i=0;i<2;i++){
                    links[i].addEventListener('click',()=>{
                        requiredFunc.linkclick();
                    })
                    links[i].click();
                }
                expect(button).toBeTruthy();
                expect(links).toBeTruthy();
                expect(links.length).toEqual(2);
                expect(button.innerHTML).not.toEqual(null||undefined);             
                for(i=0;i<2;i++){
                    expect(links[i].innerHTML).not.toEqual(null||undefined);
                    };
                expect(spy1).toHaveBeenCalledTimes(1);
                expect(spy2).toHaveBeenCalledTimes(2);
            })
        }));
        it('checks for form submission',async(()=>{
            TestBed.compileComponents().then(()=>{
                let  a = TestBed.createComponent(TestLoginComponent);
                let b = a.componentInstance;
                let c = a.debugElement;
                let LogService = TestBed.get(LoginService);
                let email = 'nilu@gmail.com';
                let password = 'dontask';
                a.detectChanges();
                let i;
                let button = a.nativeElement.querySelector('form button');
                let buttond = a.debugElement.query(By.css('form button'));
                let inputs = a.nativeElement.querySelectorAll('form input');
                let inputsd = a.debugElement.queryAll(By.css('form input'));
                let spy1 = spyOn(requiredFunc,'buttonclick');
                //right now calling the original service should replace if require
                let spy2 = spyOn(LogService,"login").and.callThrough();
                button.addEventListener('click',()=>{
                    requiredFunc.buttonclick();
                });
                for(i=0;i<2;i++){
                    if(inputs[i].type=='email'){
                        inputs[i].value = email;
                    }
                    else if(inputs[i].type=='password'){
                        inputs[i].value = password;
                    }
                };
                //validation of email part pending can be done once the app is set to validate the form
                button.click();
                expect(button).toBeTruthy();
                expect(inputs).toBeTruthy();
                expect(inputsd.length).toEqual(2);
                expect(button.innerHTML).not.toEqual(null||undefined);             
                for(i=0;i<2;i++){
                    expect(inputs[i].innerHTML).not.toEqual(null||undefined);
                };
                expect(spy1).toHaveBeenCalledTimes(1);
                expect(spy2).toHaveBeenCalledTimes(1);
                expect(spy2.calls.argsFor(0)).toEqual([email,password]);

                
            })
        }));  

})};
    
    
@Component({
    selector: 'test-login',
    template: '<mm-login></mm-login>',
  })
  
  class TestLoginComponent {
  }
  