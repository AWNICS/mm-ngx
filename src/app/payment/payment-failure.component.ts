import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
    selector: 'app-payment-failure',
    templateUrl: 'payment-failure.component.html',
    styleUrls: ['payment.component.css']
})

export class PaymentFailureComponent implements OnInit {

    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;

    ngOnInit() {
        this.navbarComponent.navbarColor(0, '#6960FF');
    }
}
