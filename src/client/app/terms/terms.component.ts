import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';

/**
 * This class represents the lazy loaded TermsComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'mm-terms',
  templateUrl: 'terms.component.html',
  styleUrls: ['terms.component.css'],
})
export class TermsComponent implements OnInit {

  @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;

  ngOnInit() {
    this.navbarComponent.navbarColor(0, '#6960FF');
  }
}
