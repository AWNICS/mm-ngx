import { Component, ViewChild } from '@angular/core';

/**
 * This class represents the lazy loaded ModalComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-modal',
  templateUrl: 'modal.component.html',
  styleUrls: ['modal.component.css'],
})
export class ModalComponent {
  constructor() {
    }
    @ViewChild('modal')
    modal: ModalComponent;
    open(){
        this.modal.open();
    }
 }