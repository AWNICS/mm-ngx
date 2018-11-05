import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { AdminService } from './admin.service';
import { Group } from '../shared/database/group';
import { UserDetails } from '../shared/database/user-details';
import { SecurityService } from '../shared/services/security.service';

@Component({
    moduleId: module.id,
    selector: 'mm-admin',
    templateUrl: 'admin.component.html',
    styleUrls: ['admin.component.css']
})

export class AdminComponent implements OnInit {

    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    @ViewChild('createGroupModal') createGroupModal: ElementRef;
    @ViewChild('editGroupModal') editGroupModal: ElementRef;
    @ViewChild('deleteGroupModal') deleteGroupModal: ElementRef;
    groups: Group[] = [];
    //users: UserDetails[] = [];
    usersByGroup: any[] = [];
    selectedUser: UserDetails;
    newGroup: FormGroup;
    eidtGroup: FormGroup;
    deletedGroup: any;
    editIndex: number;
    deleteIndex: number;
    dropdownSettings: any;
    dropdownList: any[] = [];

    constructor(
        private adminService: AdminService,
        private fb: FormBuilder,
        private securityService: SecurityService
    ) { }

    ngOnInit() {
        this.navbarComponent.navbarColor(0, '#6960FF');
        this.selectedUser = JSON.parse(this.securityService.getCookie('userDetails'));
        if (this.selectedUser) {
            this.getAllGroups();
            this.getAllUsers();
            this.createForm();
            this.dropdownSettings = {
                singleSelection: false,
                enableCheckAll: false,
                unSelectAllText: 'UnSelect All',
                selectAllText: 'Select All',
                itemsShowLimit: 2,
                allowSearchFilter: true,
                idField: 'id',
                textField: 'email'
            };
        }
    }

    createForm() {
        this.newGroup = this.fb.group({
            id: '',
            name: ['', Validators.required],
            url: '',
            userId: this.selectedUser.id,
            users: [],
            description: ['', Validators.required],
            speciality: '',
            picture: '',
            status: 'online',
            phase: 'active',
            createdBy: this.selectedUser.id,
            updatedBy: this.selectedUser.id
        });
        this.eidtGroup = this.fb.group({
            id: '',
            name: '',
            url: '',
            userId: '',
            users: [this.usersByGroup],
            description: '',
            speciality: '',
            picture: '',
            status: '',
            phase: '',
            createdBy: '',
            updatedBy: ''
        });
    }

    createNewGroup({ value, valid }: { value: any, valid: boolean }) {
        value.url = `/${value.name}/${value.userId}`;
        this.adminService.createNewGroup(value)
            .subscribe((res) => {
                console.log('created group ', res);
            });
    }

    getAllGroups() {
        this.adminService.getAllGroups()
            .subscribe((res) => {
                this.groups = res;
            });
    }

    getAllUsers() {
        this.adminService.getAllUsers()
            .subscribe((res) => {
                //this.users = res;
                this.dropdownList = res;
                console.log('list ', this.dropdownList);
            });
    }

    getAllUsersByGroupId(group: any) {
        this.adminService.getAllUsersByGroupId(group.id)
            .subscribe((res) => {
                    res.map((user) => {
                        this.usersByGroup.push({id:user.id,email:user.email});
                    });
                    console.log('users ', this.usersByGroup);
            });
    }

    initializeEdit(group: any, index: number) {
        this.getAllUsersByGroupId(group);
        this.eidtGroup.setValue({
            id: group.id,
            name: group.name,
            url: group.url,
            users: [this.usersByGroup],
            userId: group.userId,
            description: group.details.description,
            speciality: group.details.speciality,
            picture: group.picture,
            status: group.status,
            phase: group.phase,
            createdBy: group.createdBy,
            updatedBy: group.updatedBy
        });
        this.editIndex = index;
    }

    initializeDelete(group: any, index: number) {
        this.deletedGroup = group;
        this.deleteIndex = index;
    }

    updateGroup({ value, valid }: { value: any, valid: boolean }) {
        // this.adminService.updateGroup(value)
        //     .subscribe((res) => {
                //this.getAllGroups();
                value.details = {
                    description: value.description,
                    speciality: value.speciality
                };
                console.log('group updated', value);
            //     this.groups[this.editIndex] = value;
            //     this.editGroupModal.nativeElement.click();
            // });
    }

    deleteGroup() {
        console.log('delete ', this.deletedGroup);
    }
}
