import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
    moduleId: module.id,
    selector: 'mm-payment',
    templateUrl: 'payment.component.html',
    styleUrls: ['payment.component.css']
})

export class PaymentComponent implements OnInit {

    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;

    ngOnInit() {
        this.navbarComponent.navbarColor(0, '#6960FF');
    }
}
