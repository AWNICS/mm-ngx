import { Component, OnInit } from '@angular/core';
import { OrderRequest } from '../order-window/order-request';
/**
 * This class represents the lazy loaded ThanksComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'mm-thanks',
  templateUrl: 'thanks.component.html',
  styleUrls: ['thanks.component.css'],
})
export class ThanksComponent implements OnInit{

  ngOnInit() {
    console.log('Thanks component is loaded');
  }

 }
