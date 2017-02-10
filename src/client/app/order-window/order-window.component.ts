import { Component, ViewChild, Input } from '@angular/core';

/**
 * This class represents the lazy loaded ModalComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-order-window',
  templateUrl: 'order-window.component.html',
  styleUrls: ['order-window.component.css'],
})
export class OrderWindowComponent {

    @Input() result:number;

    @ViewChild('modal')
    modal: OrderWindowComponent;
    open(){
        this.modal.open();
    }
 }