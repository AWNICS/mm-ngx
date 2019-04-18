import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectionStrategy,
    TemplateRef, ChangeDetectorRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { UserDetails } from '../shared/database/user-details';
import { SecurityService } from '../shared/services/security.service';
import { SharedService } from '../shared/services/shared.service';
import { ChatService } from '../chat/chat.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';

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
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['report.component.css']
})

export class ReportComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  activeDayIsOpen: Boolean = false;
  viewDate: Date = new Date('12/5/2018');

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: any[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        // this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        // this.events = this.events.filter(iEvent => iEvent !== event);
        // this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();
//    activeDayIsOpen: Boolean = true;

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
    private unsubscribeObservables = new Subject();

    constructor(
        private route: ActivatedRoute,
        private securityService: SecurityService,
        private sharedService: SharedService,
        private chatService: ChatService,
        private sanitizer: DomSanitizer,
        private modal: NgbModal,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.userId = +this.route.snapshot.paramMap.get('visitorId'); // this is will give visitorId
        this.reportId = this.route.snapshot.queryParams.reportId; // report id
        if (this.securityService.getCookie('userDetails')) {
            this.selectedUser = JSON.parse(this.securityService.getCookie('userDetails'));
        }
        if (this.selectedUser.role === 'patient') {
          this.getConsultations(this.selectedUser.id, this.page);
        }
        this.getReport();
    }

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }

    ngAfterViewInit() {
    }
    insertEvents(type: string) {
      if ( type === 'consultation' ) {
        console.log(this.consultations);
        this.consultationEvents = [];
        this.consultations.forEach((consultation: any) => {
          this.consultationEvents.push({
          start: new Date(consultation.updatedAt),
          end: new Date(new Date(consultation.updatedAt).setTime(new Date(consultation.updatedAt).getTime() + 1 * 900000)),
          title: 'Consultation event',
          draggable: false,
          doctorName: consultation.firstname + ' ' + consultation.lastname,
          doctorPicUrl: consultation.picUrl,
          qualification: consultation.qualification,
          prescriptionUrl: consultation.prescriptionUrl,
          mode: consultation.consultationMode,
          summary: consultation.analysis,
          instructions: consultation.Instructions
        });
        this.cd.markForCheck();
      });
      } else {
        this.reportEvents = [];
        this.reports.forEach((report: any) => {
          this.reportEvents.push({
            start: new Date(report.updatedAt),
            end: new Date(new Date(report.updatedAt).setTime(new Date(report.updatedAt).getTime() + 1 * 900000)),
            title: 'Report event',
            draggable: false,
            reportname: report.title,
            url: report.url
          });
        });
        this.reports.forEach((report: any) => {
          this.reportEvents.push({
            start: new Date(report.updatedAt),
            end: new Date(new Date(report.updatedAt).setTime(new Date(report.updatedAt).getTime() + 1 * 900000)),
            title: 'Report event',
            draggable: false,
            reportname: report.title,
            url: report.url
          });
        });
        this.cd.markForCheck();
      }
    }
    toggleView(event: any, number: any) {
      if(number === 1 && this.firstCall ) {
        this.getReports();
        this.firstCall = false;
      }
      event.srcElement.className += ' active';
      number === 1 ? event.srcElement.parentNode.children[0].className = '' : event.srcElement.parentNode.children[1].className = '';
      this.showConsultation = !(this.showConsultation);
    }
    // get the details of the report
    getReport() {
        this.sharedService.getReportById(this.reportId)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((report: any) => {
                if (report) {
                    console.log('report: ' + JSON.stringify(report));
                    this.report = report;
                    this.downloadDoc();
                 } else {
                     this.message = 'Sorry no report is matching with this id';
                 }
            });
    }

    downloadItem(url: any, event: any) {
      console.log('calling');
      if (this.downloaded) {
        this.downloaded = false;
      this.chatService.downloadFile(url)
          .pipe(takeUntil(this.unsubscribeObservables))
          .subscribe((res) => {
              res.onloadend = () => {
                console.log('one');
                event.preventDefault();
                const out = 
                res.result.replace('application/octet-stream', 'image/jpeg');
                event.srcElement.href = out;
                event.srcElement.click();
                event.srcElement.removeAttribute('href');
                this.downloaded = true;
              };
          });
    }
  }

    getConsultations(id: number, page: number) {
      const size = 5;
      if (this.selectedUser.role === 'patient') {
          this.sharedService.getConsultationsByVisitorId(id, page, size)
              .pipe(takeUntil(this.unsubscribeObservables))
              .subscribe((res) => {
                  res.prescriptions.map((consultation: any, index: number) => {
                      this.consultations.push(consultation);
                      // consultation.picUrl = consultation.picUrl ? this.downloadPic(consultation.picUrl, index):
                      // this.downloadPic(this.selectedUser.role, index);
                  });
                  this.insertEvents('consultation');
          });
      } else if (this.selectedUser.role === 'doctor') {
        return;
      } else {
          return;
      }
 }

 getReports() {
  if (this.selectedUser.role === 'patient') {
      this.sharedService.getReportsByVisitorId(this.selectedUser.id)
          .pipe(takeUntil(this.unsubscribeObservables))
          .subscribe((res) => {
              res.map((report: any, index: number) => {
                console.log(report);
                  this.reports.push(report);
              });
              this.insertEvents('report');
      });
}
}

    downloadDoc() {
        this.chatService.downloadFile(this.report.url)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res) => {
                res.onloadend = () => {
                    // event.srcElement.href = res.result;
                    // event.srcElement.click();
                    // event.srcElement.removeAttribute('href');
                    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(res.result);
                };
            });
    }

      // eventTimesChanged({
      //   event,
      //   newStart,
      //   newEnd
      // }: CalendarEventTimesChangedEvent): void {
      //   this.events = this.events.map(iEvent => {
      //     if (iEvent === event) {
      //       return {
      //         ...event,
      //         start: newStart,
      //         end: newEnd
      //       };
      //     }
      //     return iEvent;
      //   });
      // }

    setView(view: CalendarView, event: any) {
      this.view = view;
    }

    setWonthView(view: CalendarView, date: any) {
      this.viewDate = date;
      this.view = view;
    }

    closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
    }
}
