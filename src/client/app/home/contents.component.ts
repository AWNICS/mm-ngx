import { Component } from '@angular/core';
/**
 * This class represents the lazy loaded ContentsComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'mm-contents',
  templateUrl: 'contents.component.html',
  styleUrls: ['contents.component.css'],
})
export class ContentsComponent {

  scrollDownHidden(height: number) {
     if(height >= 100) {
      document.getElementById('scrollToNext').style.display = 'none';
    } else {
      document.getElementById('scrollToNext').style.display = 'block';
    }
  }
}
