import { Component, ViewChild, Output } from '@angular/core';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

import { ModalComponent } from '../modal/modal.component';
/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent{ 

  items:Array<string>;
  name:string = 'Mesomeds Home';
  @Output() tel:number;

  getName() {
    return name;
  }
  
  @ViewChild(ModalComponent)
    modalHtml: ModalComponent;

    open(tel:number) {
        let result:boolean = isNaN(tel);
        if( result == true || tel.toString().length < 10 || tel.toString().match(/^\s*$/g)) {
          alert;
        } else {
          this.modalHtml.open();
        }
    }
}