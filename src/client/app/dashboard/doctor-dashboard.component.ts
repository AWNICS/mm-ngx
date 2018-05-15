import { Component, ViewChild, ChangeDetectorRef, ElementRef, OnInit } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
const Chart = require('chart.js/dist/Chart.bundle.js');

@Component({
    moduleId: module.id,
    selector: 'mm-doctor-dashboard',
    templateUrl: 'doctor-dashboard.component.html',
    styleUrls: ['doctor-dashboard.component.css']
})

export class DoctorDashboardComponent implements OnInit {
    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    @ViewChild('barChart') barChart: ElementRef;

    constructor(
        private ref: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.navbarComponent.navbarColor(0, '#6960FF');
        this.chart();
    }

    chart() {
        var ctx = this.barChart.nativeElement.getContext('2d');
        var horizontalBarChartData = {
            labels: ['9am', '10am', '11am', '12am', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm'],
            datasets: [{
                label: 'Follow Ups',
                backgroundColor: '#9690FD',
                data: [3, 2, 4, 2, 0, 0, 1, 1, 0, 4, 1, 3, 2]
            }, {
                label: 'New Patients',
                backgroundColor: '#C4C1FF',
                data: [2, 1, 3, 1, 0, 0, 2, 3, 0, 2, 3, 0, 1]
            }]
        };
        var barChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: horizontalBarChartData,
            options: {
                elements: {
                    rectangle: {
                        borderWidth: 1,
                    }
                },
                responsive: true,
                legend: {
                    position: 'right',
                },
                title: {
                    display: false,
                    text: 'Chart.js Horizontal Bar Chart'
                }
            }
        });
    }
}
