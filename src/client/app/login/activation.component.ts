import { Component, ViewChild, OnInit } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from './login.service';

/**
 * This class represents the lazy loaded ActivationComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'mm-activation',
    templateUrl: 'activation.component.html',
    styleUrls: ['activation.component.css'],
})
export class ActivationComponent implements OnInit {

    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    token: string;

    constructor(private route: ActivatedRoute, private loginService: LoginService) { }

    ngOnInit(): void {
        this.token = this.route.snapshot.paramMap.get('token');
        this.navbarComponent.navbarColor(0, '#6960FF');
        this.activateUser();
    }

    activateUser() {
        this.loginService.activateUser(this.token)
            .subscribe(res => {
                return;
            });
    }
}
