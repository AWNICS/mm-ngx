import { Component } from '@angular/core';
/**
 * This class represents the footer component.
 */
@Component({
  moduleId: module.id,
  selector: 'mm-footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.css'],
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