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
import { ImageRenderComponent } from './image-render.component';
import { MailToComponent } from './mailTo.component';

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
    ImageRenderComponent,
    UploadModalComponent,
    MailToComponent
    ],
  entryComponents: [
    ImageRenderComponent,
    UploadModalComponent,
    MailToComponent
  ],
  exports: [AdminComponent],
  providers: [AdminService]
})
export class AdminModule { }
