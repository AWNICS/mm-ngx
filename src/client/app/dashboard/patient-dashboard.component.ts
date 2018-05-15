import { Component, ViewChild, ChangeDetectorRef, ElementRef, OnInit } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
const Chart = require('chart.js/dist/Chart.bundle.js');

@Component({
    moduleId: module.id,
    selector: 'mm-patient-dashboard',
    templateUrl: 'patient-dashboard.component.html',
    styleUrls: ['patient-dashboard.component.css']
})

export class PatientDashboardComponent implements OnInit {
    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    @ViewChild('lineChart') lineChart: ElementRef;

    constructor(
        private ref: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.navbarComponent.navbarColor(0, '#6960FF');
        this.chart();
    }

    chart() {
        var ctx = this.lineChart.nativeElement.getContext('2d');
        var barChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Consultation',
                    backgroundColor: '#4B8AF4',
                    radius: 6,
                    fill: false,
                    data: [1, 2, 1, 0, 0, 1, 0, 0, 2, 1, 0, 1],
                    showLine: false
                }, {
                    label: 'Reports',
                    backgroundColor: '#D0CEFD',
                    radius: 5,
                    fill: false,
                    data: [1, 0, 1, 0, 2, 1, 0, 1, 0, 0, 1, 2],
                    showLine: false
                }, {
                    label: 'Vitals',
                    backgroundColor: '#FDC2CC',
                    radius: 4,
                    fill: false,
                    data: [0, 1, 2, 0, 2, 1, 0, 1, 0, 0, 1, 2],
                    showLine: false
                }]
            },
            options: {
                responsive: true,
                tooltips: {
                    mode: 'index',
                },
                hover: {
                    mode: 'index'
                },

                scales: {
                    xAxes: [{
                        gridLines: {
                            display: false
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            fixedStepSize: 1
                        }
                    }]
                }
            }
        });
    }
}
