import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminComponent } from './admin.component';
import { CreateModalComponent } from './create-modal.component';
import { EditModalComponent } from './edit-modal.component';
import { UploadModalComponent } from './upload-modal.component';
import { AdminRoutingModule } from './admin-routing.module';
import { OrderWindowModule } from '../order-window/order-window.module';
import { AdminService } from './admin.service';
import { SharedModule } from '../shared/shared.module';

import { Ng2SmartTableModule } from 'ng2-smart-table'; // ng2-smart-table
import { ButtonRenderComponent } from './button-render.component'; //component to render the button
import { ImageRenderComponent } from './image-render.component';

import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal'; // ng2-modal-window

/**
 * @export
 * @class AdminModule
 */
@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    OrderWindowModule,
    SharedModule,
    Ng2SmartTableModule,
    Ng2Bs3ModalModule
    ],
  declarations: [
    AdminComponent,
    CreateModalComponent,
    EditModalComponent,
    ButtonRenderComponent,
    ImageRenderComponent,
    UploadModalComponent
    ],
  entryComponents: [
    ButtonRenderComponent,
    ImageRenderComponent,
    UploadModalComponent
  ],
  exports: [AdminComponent],
  providers: [AdminService]
})
export class AdminModule { }
