import { Component, ViewChild, OnInit, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { AdminService } from './admin.service';
import { Group } from '../shared/database/group';
import { UserDetails } from '../shared/database/user-details';
import { SecurityService } from '../shared/services/security.service';
import { DISABLED } from '@angular/forms/src/model';
// import { GridOptions } from 'ag-grid-community';

@Component({
    selector: 'app-admin',
    templateUrl: 'admin.component.html',
    styleUrls: ['admin.component.css']
})

export class AdminComponent implements OnInit, OnDestroy {

    // gridOptions:GridOptions;
    // rowData:any[];
    // columnDefs:any[];
    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    @ViewChild('createGroupModal') createGroupModal: ElementRef;
    @ViewChild('editGroupModal') editGroupModal: ElementRef;
    @ViewChild('button') button: ElementRef;
    @ViewChild('deleteGroupModal') deleteGroupModal: ElementRef;
    groups: Group[] = [];
    usersByGroup: any[] = [];
    selectedUser: UserDetails;
    newGroup: FormGroup;
    pastForm: any;
    editGroup: FormGroup;
    doctorDetails: FormGroup;
    doctorProfiles: any;
    deletedGroup: any;
    editIndex: number;
    deleteIndex: number;
    dropdownSettings: any;
    dropdownList: any[] = [];
    message: string;
    alert = false;
    JSON = JSON;
    showGroups: Boolean = false;
    private unsubscribeObservables: any = new Subject();

    constructor(
        private adminService: AdminService,
        private fb: FormBuilder,
        private securityService: SecurityService,
        private ref: ChangeDetectorRef
    ) {
        /*this.gridOptions = <GridOptions>{
            onGridReady: () => {
                this.gridOptions.api.sizeColumnsToFit();
            }
        };
        this.columnDefs = [
            {headerName: 'Make', field: 'make'},
            {headerName: 'Model', field: 'model'}
        ];
        this.rowData = [
            {make: 'Toyota', model: 'Celica', price: 35000},
            {make: 'Ford', model: 'Mondeo', price: 32000}
        ];*/
    }

    ngOnInit() {
        // this.navbarComponent.navbarColor(0, '#6960FF');
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
        this.getAllDoctors();
    }

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
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
        this.doctorDetails = this.fb.group({
            name: {value: '', disabled: true},
            workHistory: '',
            activity: '',
            activityUrl: '',
            signature: '',
            professionalSocieties: ['']
        })
    }
    getAllDoctors () {
        this.adminService.getAllDoctors().subscribe((res) => {
            this.doctorProfiles = res;
        })
    }
    triggerForm(index) {
        const data: any = this.doctorProfiles.slice(index, index + 1);
        this.pastForm = new Object(data[0]);
        console.log(this.pastForm);
        // console.log(data);
        // console.log(data[0].profSocieties);
        // data[0].profSocieties = JSON.parse(data[0].profSocieties);
        this.doctorDetails.patchValue(data[0]);
        const win: any = window;
        win.$('.modal').modal('show');
    }
    uploadFile(event){
        console.log(event.target.files[0]);
        this.button.nativeElement.disabled = true;
        this.adminService.uploadFile(event.target.files[0]).subscribe((res) => {
            this.doctorDetails.patchValue({signature: res.fileName});
            // if(event.target.files[0].type.match(/image/)){
            //     this.doctorDetails.patchValue({type: 'image'});
            // }
            this.button.nativeElement.disabled = false;
            console.log(res);
        });
    }
    updateDoctorDetails(){
        const values: any = this.doctorDetails.value;
        const body: any = {};
        Object.keys(values).map((key) => {
            if(key === 'professionalSocieties') {
                if(values[key] !== this.pastForm.professionalSocieties && this.pastForm.professionalSocieties) {
                    body.professionalSocieties = {
                        value: JSON.parse(values[key]),
                        operation: 'update',
                    };
                } else if(values[key] !== this.pastForm.professionalSocieties && !this.pastForm.professionalSocieties) {
                    body.professionalSocieties = {
                        value: JSON.parse(values[key]),
                        operation: 'insert',
                    };
                }
            } else if (key === 'activity'){
                if(values[key] !== this.pastForm.activity && this.pastForm.activity) {
                     body.activity = {
                         value: JSON.parse(values[key]),
                         url: values['activityUrl'],
                         operation: 'update'
                     };
                    //  values[key];
                 } else if (values[key] !== this.pastForm.activity && !this.pastForm.activity) {
                    body.activity = {
                        value: JSON.parse(values[key]),
                        url: values['activityUrl'],
                        operation: 'insert'
                    };
                 }
            } else if(key === 'workHistory'){
                if(values[key] !== this.pastForm.workHistory) {
                     body.workHistory = JSON.stringify(JSON.stringify(values[key]));
                }
            }
        });
        // if(values.signature && values.type){
        //     body.signature = {
        //         url: values.signature,
                
        //     }
        // }
        console.log(body);
    }
    createNewGroup({ value, valid }: { value: any, valid: boolean }) {
        // value.url = `/${value.name}/${value.userId}`;
        value.url = `/consultation/${value.userId}`;
        this.adminService.createNewGroupByAdmin(value)
        .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res) => {
                this.createGroupUserMap(value.users, res.id);
                this.createGroupModal.nativeElement.click();
                this.getAllGroups();
            });
    }

    // mapping for the users inside newly created group
    createGroupUserMap(users: any, groupId: number) {
        this.adminService.createGroupUserMap(users, groupId)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res: any) => {
                return;
            });
    }

    getAllGroups() {
        this.adminService.getAllGroups()
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res) => {
                this.groups = res;
            });
    }

    getAllUsers() {
        this.adminService.getAllUsers()
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res) => {
                this.dropdownList = res;
            });
    }
    initializeEdit(group: any, index: number) {
        this.usersByGroup = [];
        this.adminService.getAllUsersByGroupId(group.id)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res) => {
                res.map((user) => {
                    this.usersByGroup.push({id: user.id, email: user.email});
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
        const data = {
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
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res) => {
                this.alert = true;
                if (true) {
                    this.message = 'Group is updated.';
                }
                this.getAllGroups();
            this.groups[this.editIndex] = value;
            this.editGroupModal.nativeElement.click();
            });
    }

    deleteGroup() {
        this.adminService.deleteGroup(this.deletedGroup)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(() => {
                this.deleteGroupModal.nativeElement.click();
                this.getAllGroups();
                return;
            });
    }
}
