import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';

/**
 * This class represents the lazy loaded Policies Component.
 */
@Component({
    selector: 'app-policies',
    templateUrl: 'policies.component.html',
    styleUrls: ['policies.component.css'],
})
export class PoliciesComponent implements OnInit {

    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;

    ngOnInit() {
        this.navbarComponent.navbarColor(0, '#6960FF');
    }
}
