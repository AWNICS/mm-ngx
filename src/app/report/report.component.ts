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
  viewDate: Date = new Date();
  monthActive: Boolean = true;

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: any[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: any;
//    activeDayIsOpen: Boolean = true;

    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    userId: number;
    reportId: number;
    selectedUser: UserDetails;
    report: any;
    message: any;
    url: SafeResourceUrl;
    showConsultation: Boolean = true;
    consultationData: Array<any> = [{
      docname: 'Chandu',
      qualification: 'Physicist',
      summary: 'Great consultaiton infact',
      status: 'Success',
      meta: 'data',
      starttime: new Date('21/mar/2019 10:00:00'),
      endTime: new Date('21/mar/2019 11:00:00')
    },
    {
      docname: 'Chandu Aluri',
      qualification: 'Physiactrist',
      summary: 'Great consultaiton infact',
      status: 'Success',
      starttime: new Date('22/march/2019 10:40:00'),
      endTime: new Date('22/march/2019 11:40:00')
    },
    {
      docname: 'Chandu Hema',
      qualification: 'Dermatologist',
      summary: 'Great consultaiton infact',
      status: 'Success',
      starttime: new Date('22/march/2019 11:40:00'),
      endTime: new Date('22/march/2019 11:40:00')
    },
    {
      docname: 'Chandu Sai',
      qualification: 'Physicist',
      summary: 'Great consultaiton infact',
      status: 'Success',
      starttime: new Date('22/march/2019 12:40:00'),
      endTime: new Date('22/march/2019 11:40:00')
    },
    {
      docname: 'Dilip Varma',
      qualification: 'Speciality',
      summary: 'Great consultaiton infact',
      status: 'Success',
      starttime: new Date('29/march/2019 13:40:00'),
      endTime: new Date('29/march/2019 11:40:00')
    },
  ];
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
        this.getReport();
    }

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }

    ngAfterViewInit() {
      this.insertEvents();
    }
    insertEvents() {
      this.events = [];
        this.consultationData.forEach((consultation:any) => {
        this.events.push({
          start: consultation.starttime,
          end: consultation.endTime,
          title: 'Consultation event',
          draggable: false,
          docname: consultation.docname,
          qualification: consultation.qualification,
          summary: consultation.summary
        });
      });
      this.cd.detectChanges();
      const  eventElemets = document.querySelectorAll('.cal-event');
      // let presentDate;
      // let pastDate;
      // for (let i = 0; i < eventElemets.length ; i++) {
      //   presentDate = new Date(this.consultationData[i].starttime).toDateString();
      //     if (presentDate !== pastDate) {
      //     const parentElement: any = eventElemets[i].parentNode;
      //     parentElement.innerHTML += `<span>Details</span><div class="report-info">
      //     <div class="report-info-header">
      //     <img src="../../src/assets/png/doc.png">
      //     <div class="report-doc-name"> <div>${this.consultationData[i].docname}</div>
      //      <span>${this.consultationData[i].qualification}</span> </div>
      //      <button>DOWNLOAD</button> </div>
      //       <div class="report-time"> <div> ${new Date(this.consultationData[i].starttime).toDateString()}
      //       to ${new Date(this.consultationData[i].endTime).toDateString()} </div>
      //       </div> <div class="report-summary"> <span>Report Summary</span>
      //       <div>${this.consultationData[i].summary}</div>
      //       </div>
      //       </div>`;
      //       pastDate = new Date(this.consultationData[i].starttime).toDateString();
      //     } else {
      //       const eventElement = document.querySelectorAll('.cal-event');
      //       const parentElement: any = eventElement[i].parentNode;
      //       parentElement.innerHTML += `<span>Details</span><div class="report-info">
      //     <div class="report-info-header">
      //     <img src="../../src/assets/png/doc.png">
      //     <div class="report-doc-name"> <div>${this.consultationData[i].docname}</div>
      //      <span>${this.consultationData[i].qualification}</span> </div>
      //      <button>DOWNLOAD</button> </div>
      //       <div class="report-time"> <div> ${new Date(this.consultationData[i].starttime).toDateString()}
      //       to ${new Date(this.consultationData[i].endTime).toDateString()} </div>
      //       </div> <div class="report-summary"> <span>Report Summary</span>
      //       <div>${this.consultationData[i].summary}</div>
      //       </div>
      //       </div>
      //       <span id="more-${i}" value=${i}>more...</span>`;
      //       document.querySelector(`span#more-${i}`).addEventListener('click', (event: any) => {
      //         this.viewDate = new Date(event.srcElement.parentNode.querySelector('.report-time div').innerHTML.split('to')[0]);
      //         this.setView(CalendarView.Week, null);
      //       });
      //       pastDate = new Date(this.consultationData[i].starttime).toDateString();
      //     }
      // }
    }
    insertWeekEvents() {
      const  eventElemets = document.querySelectorAll('.cal-event');
      for (let i = 0; i < eventElemets.length ; i++) {
          const parentElement: any = eventElemets[i].parentNode;
          parentElement.innerHTML += `<span>Details</span><div class="report-info">
          <div class="report-info-header">
          <img src="../../src/assets/png/doc.png">
          <div class="report-doc-name"> <div>${this.consultationData[i].docname}</div>
           <span>${this.consultationData[i].qualification}</span> </div>
           <button>DOWNLOAD</button> </div>
            <div class="report-time"> <div> ${new Date(this.consultationData[i].starttime).toDateString()}
            to ${new Date(this.consultationData[i].endTime).toDateString()} </div>
            </div> <div class="report-summary"> <span>Report Summary</span>
            <div>${this.consultationData[i].summary}</div>
            </div>
            </div>`;
        }
    }
    toggleView(event: any, number: any) {
      event.srcElement.className += ' active';
      number === 1 ? event.srcElement.parentNode.children[0].className = '' : event.srcElement.parentNode.children[1].className = '';
      this.showConsultation = !(this.showConsultation);
      this.cd.detectChanges();
      if (this.monthActive) {
      this.insertEvents();
      }
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

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        // if (isSameMonth(date, this.viewDate)) {
        //   this.viewDate = date;
        //   if (
        //     (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        //     events.length === 0
        //   ) {
        //     this.activeDayIsOpen = false;
        //   } else {
        //     this.activeDayIsOpen = true;
        //   }
        // }
      }

      eventTimesChanged({
        event,
        newStart,
        newEnd
      }: CalendarEventTimesChangedEvent): void {
        this.events = this.events.map(iEvent => {
          if (iEvent === event) {
            return {
              ...event,
              start: newStart,
              end: newEnd
            };
          }
          return iEvent;
        });
        this.handleEvent('Dropped or resized', event);
      }

      handleEvent(action: string, event: CalendarEvent): void {
        this.modalData = { event, action };
        this.modal.open(this.modalContent, { size: 'lg' });
      }


    setView(view: CalendarView, event: any) {
      if (view.match(/week/)) {
        console.log('made false');
        this.monthActive = false;
      } else {
        this.monthActive = true;
      }
    this.view = view;
    }

    setMonthView(view: CalendarView, date: any) {
      this.viewDate = date;
      this.view = view;
    }
    test(){
      console.log('called');
    }

    closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
    }
}
