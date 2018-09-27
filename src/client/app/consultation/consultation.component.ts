import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SharedService } from '../shared/services/shared.service';

@Component({
    moduleId: module.id,
    selector: 'mm-consultation',
    templateUrl: 'consultation.component.html',
    styleUrls: ['consultation.component.css']
})

export class ConsultationComponent implements OnInit {

    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    consultations: any = [];
    events: any = [];
    userId: number;
    message: string;
    toggleText: string = 'More';

    constructor(
        private route: ActivatedRoute,
        private sharedService: SharedService
    ) { }

    ngOnInit() {
        this.navbarComponent.navbarColor(0, '#6960FF');
        this.userId = +this.route.snapshot.paramMap.get('id');// this is will give doctorId
        this.getConsultations(this.userId);
    }

    getConsultations(visitorId: number) {
        let page = 1;
        let size = 5;
        this.sharedService.getConsultationsByVisitorId(visitorId, page, size)
            .subscribe((res) => {
                if (res.length === 0) {
                    this.message = 'There are no consultations or events to be display';
                } else {
                    res.map((timeline: any) => {
                        if (timeline.consultations) {
                            this.consultations.push(timeline);
                        } else if (timeline.events) {
                            this.events.push(timeline);
                        } else {
                            return;
                        }
                    });
                }
            });
    }

    changeIcon() {
        if (this.toggleText === 'More') {
            this.toggleText = 'Less';
        } else {
            this.toggleText = 'More';
        }
    }
}
