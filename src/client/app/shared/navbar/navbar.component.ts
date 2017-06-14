import { Component } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'mm-navbar',
    templateUrl: 'navbar.component.html',
    styleUrls: ['navbar.component.css']
})

export class NavbarComponent {
    home: string = 'Home';
    admin: string = 'Admin';
}
