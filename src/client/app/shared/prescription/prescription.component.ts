import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators  } from '@angular/forms';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { EventEmitter } from '@angular/core';
import { ChatService } from '../../chat/chat.service';
import { ProfileService } from '../../profile/profile.service';
import { SharedService } from '../services/shared.service';

@Component({
    moduleId: module.id,
    selector:'mm-prescription',
    templateUrl:'prescription.component.html',
    styleUrls:['style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush

})

export class PrescriptionComponent implements OnInit {
    prescriptionForm:FormGroup;
    medicineNumber:any=[{'id':1,'checkbox1':false,'checkbox2':false}];
    testNumber:any=[1];
    mesomedslogoImage:string;
    rxLogoImage:string;
    consultationDetails:any;
    patientInfo:any;
    submitted:Boolean=false;
    @Input() doctorDetails:any;
    @Input() patientDetails:any;
    @Input() selectedUser:any;
    @Input() selectedGroup:any;
    @Input() digitalSignature:string;
    @Output() closeIconClicked:EventEmitter<any> = new EventEmitter();
    @Output() generatedPdf:EventEmitter<any> = new EventEmitter();
    @Output() error:EventEmitter<any> = new EventEmitter();
    @ViewChild('container') container:ElementRef;

    constructor(
        private fb: FormBuilder,
        private chatService:ChatService,
        private profileService:ProfileService,
        private sharedService: SharedService
      ) {}

    ngOnInit(): void {
        this.prescriptionForm = this.fb.group({
            issue: ['', Validators.required],
            symptoms: '',
            medication: this.fb.array([this.createMedicalItem()]),
            tests: this.fb.array([this.createTestsItem()]),
            specialInstructions: ''
        });
        this.chatService.downloadFile('mesomedslogo.jpg').subscribe((res)=> {
            res.onloadend = () => {
                this.mesomedslogoImage=res.result;
            };
        });
        this.chatService.downloadFile('mesomedsrxlogo.jpeg').subscribe((res)=> {
            res.onloadend = () => {
                this.rxLogoImage=res.result;
            };
        });

        this.chatService.getConsultationDetails(this.patientDetails.id,this.doctorDetails.doctorDetails.userId).subscribe((consulation)=> {
            this.consultationDetails = consulation;
        });

        this.profileService.getPatientInfoById(this.patientDetails.id).subscribe((patientInfo:any)=> {
            this.patientInfo = patientInfo.patientInfo;
        });

    }
    // ngOnDestroy() {
    //     console.log('destroyed');
    // }
    unCheck(index:number,number:number) {
        if(number === 1) {
            if(this.medicineNumber[index].checkbox2===true) {
                this.medicineNumber[index].checkbox2= false;
            }
        } else if(number === 2) {
            if(this.medicineNumber[index].checkbox1 === true) {
                this.medicineNumber[index].checkbox1= false;
            }
        }
    }
    close() {
        this.closeIconClicked.emit(null);
    }
    medicineNumberInc() {
      this.medicineNumber.push({'id':1,'checkbox1':false,'checkbox2':false});
      let items = this.prescriptionForm.get('medication') as FormArray;
      items.push(this.createMedicalItem());
    }
    numberDec(parameter:String) {
        parameter==='medicine'?this.medicineNumber.pop():this.testNumber.pop();
        if(parameter==='medicine')  {
            let items = this.prescriptionForm.get('medication') as FormArray;
            items.removeAt(items.length - 1);
        } else {
            let items = this.prescriptionForm.get('tests') as FormArray;
            items.removeAt(items.length - 1);
        }
    }
    testsNumberInc() {
      this.testNumber.push(1);
      let items = this.prescriptionForm.get('tests') as FormArray;
      items.push(this.createTestsItem());
    }
    createMedicalItem(): FormGroup {
        return this.fb.group({
          name: '',
          time0: '',
          time1: '',
          time2:'',
          time3:'',
          time4:''
        });
      }
      createTestsItem(): FormGroup {
        return this.fb.group({
          name: ''
        });
      }
      generatePres(prescriptionData:any) {
        this.submitted = true;
        if(this.prescriptionForm.invalid) {
            this.container.nativeElement.scrollIntoView();
            return;
        }
        if(!this.digitalSignature) {
            this.error.emit('Please update the digital signature');
            return;
        }
        if(!this.patientDetails) {
            this.error.emit('Patient  Details not found');
            return;
        }
        let i:number;
        let prescription:any = prescriptionData.value;
        let issue:string = prescription.issue || 'NA';
        let symptoms:string = prescription.symptoms || 'NA';
        let medication:Array<any>=[];
        let tests:Array<any> = [];
        let specialInstructions:string = prescription.specialInstructions||'NA';
    try {
    if(prescription.medication[0].name) {
        for(i=0;i<prescription.medication.length;i++) {
            if(prescription.medication[i].name) {
            prescription.medication[i].time0===true?prescription.medication[i].time0=1:prescription.medication[i].time0=0;
            prescription.medication[i].time1===true?prescription.medication[i].time1=1:prescription.medication[i].time1=0;
            prescription.medication[i].time2===true?prescription.medication[i].time2=1:prescription.medication[i].time2=0;
            prescription.medication[i].time3===true?prescription.medication[i].time3='After Food':prescription.medication[i].time3=null;
            prescription.medication[i].time4===true?prescription.medication[i].time4='Before Food':prescription.medication[i].time4=null;
    let array = {
    'id':i+1,
    'title':prescription.medication[i].name,
    'time':prescription.medication[i].time0+' - '+prescription.medication[i].time1+' - '+prescription.medication[i].time2,
    'food':prescription.medication[i].time3||prescription.medication[i].time4||'NA'
    };
    if(array.time==='0 - 0 - 0') {
        array.time = 'NA';
    }
    medication.push(array);
}}} else {
        medication=[{'id':1,'title':'NA','time':'NA','food':'NA'}];
    }
    } catch(e) {
        medication=[{'id':1,'title':'NA','time':'NA','food':'NA'}];
    }
    try {
    if(prescription.tests[0].name) {
    for(i=0;i<prescription.tests.length;i++) {
      tests.push({'id':i+1,'testName':prescription.tests[i].name});
    }} else {
        tests=[{'id':'1','testName':'NA'}];
    }
} catch(e) {
    tests=[{'id':'1','testName':'NA'}];
}
    const doctorName =  'Dr. '+this.selectedUser.firstname+' '+this.selectedUser.lastname;
    this.generatePdf(issue,symptoms,medication,tests,specialInstructions,doctorName,this.doctorDetails);
    }

   generatePdf(issuePassed:any,symptomsPassed:any,medication:any,tests:any,specialInstructions:any,doctorName:any,doctorDetailsPassed:any) {
    let medicineList: string[] = [];
    let diagnosticList: string[] = [];
    medication.map((med: any) => {
        medicineList.push(med.title);
    });
    tests.map((test: any) => {
        diagnosticList.push(test.testName);
    });
    let prescriptionInfo = {
          visitorId: this.patientDetails.id,
          doctorId: doctorDetailsPassed.doctorDetails.userId,
          consultationId: this.consultationDetails.id,
          description: issuePassed,
          issue: issuePassed,
          medication: medicineList,
          diagnostic: diagnosticList,
          instructions: specialInstructions,
          createdBy: doctorDetailsPassed.doctorDetails.userId,
          updatedBy: doctorDetailsPassed.doctorDetails.userId
      };
      this.sharedService.createPrescription(prescriptionInfo)
        .subscribe(res => {
            return;
        });
      var doc:any = new jsPDF('p', 'pt', 'a4');
      const symptoms = symptomsPassed;
      const issue = issuePassed;
      let qualificationFound:Boolean = false;

      const table0columns = [
          { title: '', dataKey: 'value' }
      ];
      let table0rows;
      if(doctorDetailsPassed.doctorStores) {
        doctorDetailsPassed.doctorStores.map((doctorStore:any)=> {
            if(doctorStore.value.qualification) {
                qualificationFound = true;
                table0rows = [
                    { 'value': doctorName },
                    { 'value':  doctorStore.value.qualification},
                    { 'value': doctorDetailsPassed.doctorDetails.speciality.speciality },
                    { 'value': 'RegNo: '+doctorDetailsPassed.doctorDetails.regNo},
                ];
            }
        });
      }
      if(!qualificationFound) {
        table0rows = [
            { 'value': doctorName },
            { 'value': doctorDetailsPassed.doctorDetails.speciality.speciality },
            { 'value': 'RegNo: '+doctorDetailsPassed.doctorDetails.regNo},
        ];
      }

      const table1columns = [
          { title: '', dataKey: 'name' }, { title: '', dataKey: 'value' }
      ];
      const table1rows = [
          { 'name': 'Date', 'value': this.getDate() },
          { 'name': 'Consultation Id', 'value': this.consultationDetails.id },
          { 'name': 'Patient Name', 'value': this.patientDetails.firstname+ ' ' + this.patientDetails.lastname },
          { 'name': 'Age', 'value': this.patientInfo.age },
          { 'name': 'Sex', 'value': this.patientInfo.sex }
      ];

      const table2columns = [
          { title: '', dataKey: 'name' }, { title: '', dataKey: 'value' }
      ];
      const table2rows = [
          { 'name': 'Consulting Physician', 'value': doctorName },
          { 'name': 'Issue', 'value': issue },
          { 'name': 'Symptoms', 'value': symptoms }
      ];

      const table3columns =
      [{ title: 'ID', dataKey: 'id' },
       { title: 'Medicine Name', dataKey: 'title' },
       { title: 'Timings', dataKey: 'time' },
       { title: 'Food', dataKey: 'food' }];

      const table3rows = medication;

      const table4columns = [{title:'ID',dataKey: 'id'},{title:'Diagonistic Test Name',dataKey:'testName'}];
      const table4rows = tests;

      const table5columns = [
          { title: '', dataKey: 'name' }, { title: '', dataKey: 'value' }
      ];
      const table5rows = [
          { 'name': 'Instructions to patient', 'value': specialInstructions },
      ];
      //these are for reference of total a4 size page height in points
      const pageHeight = 842;
      const pageWidth = 596;
      const headerHeight = 100;
      const signatureHeading = 'Authorised Signature';
      //header
      doc.setFillColor(108, 99, 255);
      doc.rect(0, 0, 595, headerHeight, 'F');
      doc.autoTable(table0columns, table0rows, {
          drawHeaderRow: function() {
              return false;
          },
          margin: { left: 420 },
          startY: 10,
          tableWidth: 'wrap',
          columnStyles: { value: { overflow: 'linebreak' } },
          theme: 'plain',
          drawRow: function(row:any, data:any) {if(row.raw.value!==doctorName) {row.height = 12;} else {row.height = 18;}},
          createdCell: function(cell:any, data:any) {
              if (cell.raw === doctorName) { cell.styles.fontSize = '14', cell.styles.fontStyle = 'bold';}}
      });

      //table1 and table2 <-> body1
      doc.autoTable(table1columns, table1rows, {
          drawHeaderRow: function() {
              return false;
          },
          margin: { left: 22 },
          startY: headerHeight + 17,
          tableWidth: 'wrap',
          columnStyles: { overflow: 'ellipsize', name: { fontStyle: 'bold' }, value: { columnWidth: 117, overflow: 'linebreak' } },
          theme: 'plain'
      });

      const table1Pos = doc.autoTable.previous.cursor;
      doc.autoTable(table2columns, table2rows, {
          drawHeaderRow: function() {
              return false;
          },
          startY: headerHeight + 17,
          tableWidth: 'wrap',
          columnStyles: { overflow: 'ellipsize', name: { fontStyle: 'bold' }, value: { columnWidth: 220,overflow: 'linebreak' } },
          margin: { left: table1Pos.x + 20 },
          theme: 'plain'
      });

      //table3 and table4 pos
      var table3PosY = table1Pos.y > doc.autoTable.previous.finalY ? table1Pos.y : doc.autoTable.previous.finalY;
      doc.autoTableSetDefaults({
          headerStyles: { fillColor: [155, 89, 182] }, // Purple
      });
      doc.autoTable(table3columns, table3rows, {
          startY: table3PosY + 25,
          pageBreak: 'avoid',
          headerStyles: { halign: 'center', overflow: 'visible' },
          bodyStyles: { halign: 'center' },
          tableWidth: 'auto',
          columnStyles: { hliagn: 'center', title: { overflow: 'linebreak' } },
          // title: { overflow: 'linebreak' } },
          theme: 'grid'
      });

      if(table4rows.length > 0) {
          const table4Pos = doc.autoTable.previous.finalY;
          doc.autoTable(table4columns, table4rows, {
              startY: table4Pos + 25,
          headerStyles: { halign: 'center', overflow: 'visible' },
          bodyStyles: { halign: 'center' },
              pageBreak: 'avoid',
              tableWidth: 'auto',
              columnStyles: { hliagn: 'center', testName: { overflow: 'linebreak'} },
              theme: 'grid'
          });
      }

      //table4
      const table5PosY =doc.autoTable.previous.finalY;
      doc.autoTable(table5columns, table5rows, {
          drawHeaderRow: function() {
              return false;
          },
          startY: table5PosY + 25,
          pageBreak: 'avoid',
          headerStyles: { halign: 'center' },
          bodyStyles: { halign: 'center', valign: 'middle' },
          tableWidth: 267,
          margin: {
           left: 20, right:20 },
           columnStyles: { hliagn: 'center',
           name: { overflow:'linebreak', fontStyle: 'bold', columnWidth:67 },
           value: { halign: 'left', overflow: 'linebreak' }
        },
          theme: 'grid'
      });

      //signature
      const signatureX = doc.autoTable.previous.cursor.x+120;
      const signatureHeadingHeight = doc.autoTable.previous.finalY;
      doc.setFontSize(15);
      doc.setTextColor(40, 87, 240);
      doc.text(signatureX, signatureHeadingHeight+80, signatureHeading);
      this.drawCanvas(this.digitalSignature,185,80).then((res)=> {
        doc.addImage(res,'JPG',signatureX,signatureHeadingHeight);
        this.drawCanvas(this.rxLogoImage,28,28).then((res)=> {
            doc.addImage(res,'JPG',2,100);
            doc.setFillColor(255, 140, 0);
            doc.rect(0, 790, 595, 841, 'F');
            this.drawCanvas(this.mesomedslogoImage,90,90).then((res)=> {
            doc.addImage(res,'JPEG',10,10);
            var pdfData = doc.output();
            this.generatedPdf.emit({'data':pdfData,'userId':this.patientDetails.id});
            // this.prescriptionForm.reset();
            });
        });
      });
    }
    getDate() {
        let date:Date = new Date();
        let day:string = date.getDate().toString();
        let month:string  = date.getMonth().toString();
        let year:string = date.getFullYear().toString();
        if(day.length === 1)  {day='0'+day; }
        if(month.length === 1) {month='0'+month ;}
        let finalDate:string = day+'/'+month+'/'+year;
        return finalDate;
    }

    drawCanvas(base64ImageData:any,x:number,y:number) {
        return new Promise((res,rej)=> {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var image = new Image();
        image.src = base64ImageData;
        image.onload = () => {
        ctx.drawImage(image, 0, 0,x,y);
        var imgData = canvas.toDataURL('image/png');
        res(imgData);
        };
        }).catch(err=>console.log(err));

    }
}

