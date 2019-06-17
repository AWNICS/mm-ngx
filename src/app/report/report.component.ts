import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectionStrategy,
    TemplateRef, ChangeDetectorRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { UserDetails } from '../shared/database/user-details';
import { SecurityService } from '../shared/services/security.service';
import { SharedService } from '../shared/services/shared.service';
import { ChatService } from '../chat/chat.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import * as moment from 'moment';
const colors: any = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3'
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF'
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA'
    }
  };


@Component({
    selector: 'app-report',
    templateUrl: 'report.component.html',
    styleUrls: ['report.component.css']
})

export class ReportComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  refresh: Subject<any> = new Subject();
  CalendarView = CalendarView;
  activeItem: String = 'Consultations';
  activeDayIsOpen: Boolean = false;
  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: any[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
      }
    }
  ];
    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    userId: number;
    reportId: number;
    selectedUser: UserDetails;
    report: any;
    message: any;
    url: SafeResourceUrl;
    showConsultation: Boolean = true;
    page: any = 1;
    firstCall: Boolean = true;
    consultations: Array<any> = [];
    reports: Array<any> = [];
    consultationEvents: any = [];
    reportEvents: any = [];
    downloaded = true;
    consultationOffset: any;
    reportOffset: any;
    private unsubscribeObservables = new Subject();

    constructor(
        private route: ActivatedRoute,
        private securityService: SecurityService,
        private sharedService: SharedService,
        private chatService: ChatService,
        private sanitizer: DomSanitizer,
        private modal: NgbModal,
        private router1: Router,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.userId = +this.route.snapshot.paramMap.get('visitorId'); // this is will give visitorId
        // this.reportId = this.route.snapshot.queryParams.reportId; // report id
        if (this.securityService.getCookie('userDetails')) {
            this.selectedUser = JSON.parse(this.securityService.getCookie('userDetails'));
            this.sharedService.makeSocketConnection();
        } else {
          this.router1.navigate(['/login']);
        }
        // if (this.selectedUser.role === 'patient') 
          this.getLimitedConsultations();
        // } else {
        // }
        // this.getReport();
    }

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }

    ngAfterViewInit() {
    }
    getLimitedItems(){
      if(this.showConsultation){
        this.getLimitedConsultations();
      } else {
        this.getLimitedReports();
      }
    }
    getLimitedConsultations() {
      if(!this.consultationOffset){
        const current = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
        const extra = moment().startOf('M');
        const low = moment(extra).subtract(3, 'M').format('YYYY-MM-DD');
        this.consultationOffset = moment(low).add(1, 'M');
        console.log('calling ' + 'low ' + low +'high ' + current);
        this.getConsultations(this.selectedUser.id, current, low);
      } else {
        if(moment(this.viewDate).startOf('M') <= this.consultationOffset){
          const high = moment(this.consultationOffset).subtract(1, 'M').subtract(1, 'd').format('YYYY-MM-DD');
          const low = moment(this.consultationOffset).subtract(4, 'M').format('YYYY-MM-DD');;
          this.consultationOffset = moment(low).add(1, 'M');
          console.log('calling ' + 'low ' + low +'high ' + high);
          console.log('offset '+moment(this.consultationOffset).format('YYYY-MM-DD'));
          this.getConsultations(this.selectedUser.id, high, low);
        }
      }
    }
    getLimitedReports(){
      if(!this.reportOffset){
        const current = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
        const extra = moment().startOf('M');
        const low = moment(extra).subtract(6, 'M').format('YYYY-MM-DD');
        this.reportOffset = moment(low).add(2, 'M');
        console.log('calling ' + 'low ' + low +'high ' + current);
        this.getReports(current, low);
      } else {
        if(moment(this.viewDate).startOf('M') <= this.reportOffset){
          const high = moment(this.reportOffset).subtract(2, 'M').subtract(1, 'd').format('YYYY-MM-DD');
          const low = moment(this.reportOffset).subtract(8, 'M').format('YYYY-MM-DD');;
          this.reportOffset = moment(low).add(2, 'M');
          console.log('calling ' + 'low ' + low + ' high ' + high);
          console.log('offset ' + moment(this.reportOffset).format('YYYY-MM-DD'));
          this.getReports(high, low);
        }
      }
    }
    insertEvents(type: string, pastLength) {
      if ( type === 'consultation' ) {
        this.consultations.slice(pastLength).forEach((consultation: any, index) => {
          this.consultationEvents.push({
          start: new Date(consultation.updatedAt),
          end: new Date(new Date(consultation.updatedAt).setTime(new Date(consultation.updatedAt).getTime() + 1 * 900000)),
          title: 'Consultation event',
          draggable: false,
          doctorName: consultation.firstname + ' ' + consultation.lastname,
          doctorPicUrl: consultation.picUrl,
          speciality: consultation.speciality,
          prescriptionUrl: consultation.prescriptionUrl,
          mode: consultation.consultationMode,
          summary: consultation.issue,
          instructions: consultation.Instructions,
          picUrl: ''
        });
        if(consultation.picUrl){
          this.downloadConsultationProfileImages(consultation.picUrl, pastLength + index);
        } else {
          this.downloadAltPic(pastLength + index);
        }
      });
      this.refresh.next();
      console.log(this.consultationEvents);
      } else {
        this.reports.slice(pastLength).forEach((report: any) => {
          this.reportEvents.push({
            start: new Date(report.updatedAt),
            end: new Date(new Date(report.updatedAt).setTime(new Date(report.updatedAt).getTime() + 1 * 900000)),
            title: 'Report event',
            draggable: false,
            reportname: report.title,
            url: report.url
          });
        });
        this.refresh.next();
      }
    }
    downloadAltPic(index) {
      let fileName: string;
      if (this.selectedUser.role === 'bot') {
          fileName = 'bot.jpg';
      } else if (this.selectedUser.role === 'doctor') {
          fileName = 'user.png';
      } else {
          fileName = 'doc.png';
      }
      this.chatService.downloadFile(fileName).subscribe((res) => {
             res.onloadend = () => {
                this.consultationEvents[index].picUrl = res.result;
                this.cd.markForCheck();
             }
         });
    }
    toggleView(event: any, number: any) {
      if(number === 1) {
        this.showConsultation = false;
        this.viewDate = new Date();
        this.getLimitedItems();
        // this.firstCall = false;
      } else {
        this.showConsultation = true;
      }
      event.srcElement.className += ' active';
      number === 1 ? event.srcElement.parentNode.children[0].className = '' : event.srcElement.parentNode.children[1].className = '';
      number === 1 ? this.activeItem = 'Reports' : this.activeItem = 'Consultations';
      // this.showConsultation = !(this.showConsultation);
    }

    downloadConsultationProfileImages(fileName: string, index) {
      this.chatService.downloadFile(fileName)
          .pipe(takeUntil(this.unsubscribeObservables))
          .subscribe((res) => {
              res.onloadend = () => {
                  this.consultationEvents[index].picUrl = res.result;
                  this.cd.markForCheck();
              };
          });
  }

    downloadItem(url: any, event: any) {
      if (this.downloaded) {
        this.downloaded = false;
      this.chatService.downloadFile(url)
          .pipe(takeUntil(this.unsubscribeObservables))
          .subscribe((res) => {
              res.onloadend = () => {
                event.preventDefault();
                console.log(url);
                let out: string;
                url.match(/pdf/) ? out = res.result.replace('application/octet-stream', 'application/pdf') 
                : out = res.result.replace('application/octet-stream', 'image/jpeg');
                event.srcElement.href = out;
                event.srcElement.click();
                event.srcElement.removeAttribute('href');
                this.downloaded = true;
              };
          });
    }
  }

    getConsultations(id: number, high: any, low: any) {
      if (this.selectedUser.role === 'patient') {
          this.sharedService.readAllConsultationsByVisitorId(id, high, low)
              .pipe(takeUntil(this.unsubscribeObservables))
              .subscribe((res) => {
                console.log(res);
                const pastLength = this.consultations.length;
                  res.prescriptions.map((consultation: any, index: number) => {
                      this.consultations.push(consultation);
                  });
                  this.insertEvents('consultation', pastLength);
          });
      } else if (this.selectedUser.role === 'doctor') {
        this.sharedService.readAllConsultationsByDoctorId(id, high, low)
        .pipe(takeUntil(this.unsubscribeObservables))
        .subscribe((res) => {
            console.log(res);
            const pastLength = this.consultations.length;
            res.consultations.map((consultation: any) => {
                this.consultations.push(consultation);
            });
            this.insertEvents('consultation', pastLength);
    });
      } else {
          return;
      }
 }

 getReports(high: any, low: any) {
  if (this.selectedUser.role === 'patient') {
      this.sharedService.getReportsByVisitorId(this.selectedUser.id, high, low)
          .pipe(takeUntil(this.unsubscribeObservables))
          .subscribe((res) => {
            console.log(res);
            const pastLength = this.reports.length;
              res.map((report: any, index: number) => {
                  this.reports.push(report);
              });
              this.insertEvents('report', pastLength);
      });
}
}

downloadDoc(event, url) {
    this.chatService.downloadFile(url)
        .pipe(takeUntil(this.unsubscribeObservables))
        .subscribe((res) => {
            res.onloadend = () => {
              console.log(res.result);
                const file = res.result.replace('octet-stream', 'pdf');
                const element = event.srcElement.parentNode.children[3];
                element.href = file;
                element.click();
                element.removeAttribute('href');
            };
        });
}

    setView(view: CalendarView, event: any) {
      this.view = view;
    }

    setWonthView(view: CalendarView, date: any) {
      this.viewDate = date;
      this.view = view;
    }
    test(event){
      console.log(this.viewDate);
    }

    closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
    }
}
