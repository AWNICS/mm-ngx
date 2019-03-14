import { Component, ViewChild, HostListener, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SharedService } from '../shared/services/shared.service';
// import { FileValidator } from './file-input.validator';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-careers',
    templateUrl: 'careers.component.html',
    styleUrls: ['careers.component.css']
})

export class CareersComponent implements OnInit, OnDestroy {

    navIsFixed = false;
    userDetails: any;
    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    @ViewChild('jobModal') jobModal: ElementRef;
    filename = 'Upload resume';
    modalHeader: string;
    private unsubscribeObservables: any = new Subject();

    constructor(
        private fb: FormBuilder,
        private sharedService: SharedService
    ) { }

    ngOnInit() {
        window.scrollTo(0, 0);
        this.userDetails = this.fb.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            phone: ['', Validators.required],
            message: ['', Validators.required],
            resume: new FormControl('', Validators.required)
        });
    }

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        const number = window.scrollY;
        if (number > 500) {
            this.navIsFixed = true;
            document.getElementById('myBtn').style.display = 'block';
        } else if (this.navIsFixed && number < 1000) {
            this.navIsFixed = false;
            document.getElementById('myBtn').style.display = 'none';
        }

        // for moving to next section and to show navbar
        if (number > 100) {
            this.navbarComponent.navbarColor(number, '#6960FF');
        } else {
            this.navbarComponent.navbarColor(number, 'transparent');
        }
    }

    /**
     *
     * Service call to send the form data
     * @//param {{ value: any, valid: boolean }} { value, valid }
     * @//memberof CareersComponent
     */
    sendMail({ value, valid }: { value: any, valid: boolean }) {
        this.userDetails.reset();
        this.jobModal.nativeElement.click();
        this.sharedService.careerMail(value)
        .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res) => {
                if (res) {
                    return;
                }
            });
    }

    /**
     *
     * Appends the file into resume after encoding into base64
     * @//param {*} event
     * @//memberof CareersComponent
     */
    onFileChange(event: any) {
        const reader = new FileReader();
        if (event.target.files && event.target.files.length) {
            const [file] = event.target.files;
            reader.readAsDataURL(file);
            this.filename = file.name;
            reader.onload = () => {
                this.userDetails.patchValue({
                    resume: reader.result
                });
            };
        }
    }

    /**
     *
     * Changes modal window header to the designation
     * @//param {string} header
     * @//memberof CareersComponent
     */
    changeModalHeader(header: string) {
        this.modalHeader = header;
    }
}
