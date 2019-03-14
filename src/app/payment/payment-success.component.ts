import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
    selector: 'app-payment-success',
    templateUrl: 'payment-success.component.html',
    styleUrls: ['payment.component.css']
})

export class PaymentSucsessComponent implements OnInit {

    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;

    ngOnInit() {
        this.navbarComponent.navbarColor(0, '#6960FF');
    }
}
