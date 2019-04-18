import { Component, AfterViewInit } from '@angular/core';
/**
 * This class represents the lazy loaded ContentsComponent.
 */
@Component({
  selector: 'app-contents',
  templateUrl: 'contents.component.html',
  styleUrls: ['contents.component.css'],
})
export class ContentsComponent implements AfterViewInit{
  ngAfterViewInit(){
    this.carousel();
  }
  carousel(){
    const win: any = window;
    win.$(document).ready(function(){
      win.$('.owl-carousel').owlCarousel({
        loop: true,
        margin: 30,
        items: 4,
        center: true,
        autoplay: true,
        autoplayTimeout : 4000,
        responsive : {
          300 : {
            items: 1,
            margin: 10
          },
          620 : {
            items: 2,
            margin: 20
          },
          990 : {
            items: 3
          },
          1200: {
            items: 4
          }
      }
      });
    });
  }
  scrollDownHidden(height: number) {
     if (height >= 100) {
      document.getElementById('scrollToNext').style.display = 'none';
    } else {
      document.getElementById('scrollToNext').style.display = 'block';
    }
  }
}
