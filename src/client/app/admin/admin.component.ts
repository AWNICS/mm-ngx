import { Component, ViewChild, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
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
    usersByGroup: any[] = [];
    selectedUser: UserDetails;
    newGroup: FormGroup;
    editGroup: FormGroup;
    deletedGroup: any;
    editIndex: number;
    deleteIndex: number;
    dropdownSettings: any;
    dropdownList: any[] = [];
    message: string;
    alert: boolean = false;

    constructor(
        private adminService: AdminService,
        private fb: FormBuilder,
        private securityService: SecurityService,
        private ref:ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.navbarComponent.navbarColor(0, '#6960FF');
        this.selectedUser = JSON.parse(this.securityService.getCookie('userDetails'));
        if (this.selectedUser) {
            this.createForm();
            this.getAllGroups();
            this.getAllUsers();
            this.dropdownSettings = {
                singleSelection: false,
                enableCheckAll: false,
                unSelectAllText: 'UnSelect All',
                selectAllText: 'Select All',
                itemsShowLimit: 3,
                allowSearchFilter: true,
                idField: 'id',
                textField: 'email'
            };
        }
    }

    createForm() {
        this.newGroup = this.fb.group({
            id: '',
            name: [''],
            url: '',
            userId: this.selectedUser.id,
            users: [''],
            description: [''],
            speciality: '',
            picture: '',
            status: 'online',
            phase: 'active',
            createdBy: this.selectedUser.id,
            updatedBy: this.selectedUser.id
        });
        this.editGroup = this.fb.group({
            id: '',
            name: '',
            url: '',
            userId: '',
            users: [],
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
        //value.url = `/${value.name}/${value.userId}`;
        value.url = `/consultation/${value.userId}`;
        this.adminService.createNewGroupByAdmin(value)
            .subscribe((res) => {
                this.createGroupUserMap(value.users, res.id);
                this.createGroupModal.nativeElement.click();
                this.getAllGroups();
            });
    }

    //mapping for the users inside newly created group
    createGroupUserMap(users: any, groupId: number) {
        this.adminService.createGroupUserMap(users, groupId)
            .subscribe((res: any) => {
                return;
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
                this.dropdownList = res;
            });
    }

    initializeEdit(group: any, index: number) {
        this.usersByGroup = [];
        this.adminService.getAllUsersByGroupId(group.id)
            .subscribe((res) => {
                res.map((user) => {
                    this.usersByGroup.push({id: user.id,email:user.email});
                });
                this.editGroup.setValue({
                    id: group.id,
                    name: group.name,
                    url: group.url,
                    users: this.usersByGroup,
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
                this.alert = false;
            });
    }

    initializeDelete(group: any, index: number) {
        this.deletedGroup = group;
        this.deleteIndex = index;
    }

    updateGroup({ value, valid }: { value: any, valid: boolean }) {
        let data = {
            id: value.id,
            name: value.name,
            url: value.url,
            userId: value.userId,
            users: value.users,
            details: {description: value.description, speciality: value.speciality},
            picture: value.picture,
            status: value.status,
            phase: value.phase,
            createdBy: value.createdBy,
            updatedBy: value.updatedBy
        };
        this.adminService.updateGroup(data)
            .subscribe((res) => {
                this.alert = true;
                if(true) {
                    this.message = 'Group is updated.';
                }
                this.getAllGroups();
            this.groups[this.editIndex] = value;
            this.editGroupModal.nativeElement.click();
            });
    }

    deleteGroup() {
        this.adminService.deleteGroup(this.deletedGroup)
            .subscribe(() => {
                this.deleteGroupModal.nativeElement.click();
                this.getAllGroups();
                return;
            });
    }
}
