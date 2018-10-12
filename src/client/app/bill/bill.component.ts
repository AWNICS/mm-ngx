import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
    moduleId: module.id,
    selector: 'mm-bill',
    templateUrl: 'bill.component.html',
    styleUrls: ['bill.component.css']
})

export class BillComponent implements OnInit {

    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;

    ngOnInit() {
        this.navbarComponent.navbarColor(0, '#6960FF');
    }
}
