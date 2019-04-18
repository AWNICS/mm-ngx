import { Component, ViewEncapsulation } from '@angular/core';
/**
 * This class represents the footer component.
 */
@Component({
  selector: 'app-footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.css']
})
export class FooterComponent {

  public lang: string;

  public constructor() {
    this.lang = localStorage.getItem('lang') || 'en-US';
  }

  public selectLanguage = (lang: string) => {
    localStorage.setItem('lang', lang);
    window.location.href = '/';
  }
}
