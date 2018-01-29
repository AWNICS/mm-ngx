import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Group } from '../shared/database/group';
import { Message } from '../shared/database/message';
import { UserDetails } from '../shared/database/user-details';
/**
 * This class represents the lazy loaded ChatComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'mm-chat',
    templateUrl: 'chat.component.html',
    styleUrls: ['chat.component.css'],
})
export class ChatComponent {

}
