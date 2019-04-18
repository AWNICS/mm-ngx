import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from './login.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * This class represents the lazy loaded ActivationComponent.
 */
@Component({
    selector: 'app-activation',
    templateUrl: 'activation.component.html',
    styleUrls: ['activation.component.css'],
})
export class ActivationComponent implements OnInit, OnDestroy {

    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    token: string;
    private unsubscribeObservables = new Subject();

    constructor(private route: ActivatedRoute, private loginService: LoginService) { }

    ngOnInit(): void {
        this.token = this.route.snapshot.paramMap.get('token');
        // this.navbarComponent.navbarColor(0, '#6960FF');
        this.activateUser();
    }

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }

    activateUser() {
        this.loginService.activateUser(this.token)
        .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(res => {
                return;
            });
    }
}
