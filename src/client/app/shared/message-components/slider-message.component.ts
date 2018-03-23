import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Message } from '../database/message';
import { SocketService } from '../../chat/socket.service';

/**
 * Slider component in live chat
 * @export
 * @class SliderMessageComponent
 * @implements {OnDestroy}
 */
@Component({
    selector: 'mm-slider-message',
    template: `
        <p>{{header}}</p>
        <div class="range-slider">
            <input type="range" class="range-slider__range" min="0" max="10" value="5" 
                (change)="getRangeValue();"
                #slider>
                <span class="range-slider__value">{{selectedValue}}</span>
        </div>
        <button type="button" class="btn btn-secondary" (click)="submit();">Submit</button>
    `,
    styles: [`
    *, *:before, *:after {
        -webkit-box-sizing: border-box;
                box-sizing: border-box;
      }
      
      body {
        font-family: sans-serif;
        padding: 20px 20px;
      }
      @media (min-width: 600px) {
        body {
          padding: 20px;
        }
      }
      
      .range-slider {
        margin: 20px 0 20px 0%;
      }
      
      .range-slider {
        width: 100%;
      }
      
      .range-slider__range {
        -webkit-appearance: none;
        width: calc(100% - (73px));
        height: 10px;
        border-radius: 5px;
        background: #d7dcdf;
        outline: none;
        padding: 0;
        margin: 0;
      }
      .range-slider__range::-webkit-slider-thumb {
        -webkit-appearance: none;
                appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #2c3e50;
        cursor: pointer;
        -webkit-transition: background .15s ease-in-out;
        transition: background .15s ease-in-out;
      }
      .range-slider__range::-webkit-slider-thumb:hover {
        background: #1abc9c;
      }
      .range-slider__range:active::-webkit-slider-thumb {
        background: #1abc9c;
      }
      .range-slider__range::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border: 0;
        border-radius: 50%;
        background: #2c3e50;
        cursor: pointer;
        -webkit-transition: background .15s ease-in-out;
        transition: background .15s ease-in-out;
      }
      .range-slider__range::-moz-range-thumb:hover {
        background: #1abc9c;
      }
      .range-slider__range:active::-moz-range-thumb {
        background: #1abc9c;
      }
      
      .range-slider__value {
        display: inline-block;
        position: relative;
        width: 60px;
        color: #fff;
        line-height: 20px;
        text-align: center;
        border-radius: 3px;
        background: #2c3e50;
        padding: 5px 10px;
        margin-left: 8px;
      }
      .range-slider__value:after {
        position: absolute;
        top: 8px;
        left: -7px;
        width: 0;
        height: 0;
        border-top: 7px solid transparent;
        border-right: 7px solid #2c3e50;
        border-bottom: 7px solid transparent;
        content: '';
      }
      
      ::-moz-range-track {
        background: #d7dcdf;
        border: 0;
      }
      
      input::-moz-focus-inner,
      input::-moz-focus-outer {
        border: 0;
      }
      
    `]
})

export class SliderMessageComponent implements OnInit {

    @Input() message: Message;
    @Input() public selectedValue: string;
    @Output() public onNewEntryAdded = new EventEmitter();
    @ViewChild('slider') slider: ElementRef;
    header: string;

    constructor(private socketService: SocketService) {
    }

    ngOnInit() {
        this.header = this.message.text;
        this.selectedValue = '5';
    }

    getRangeValue() {
        this.selectedValue = this.slider.nativeElement.value;
    }

    submit() {
        this.message.contentType = 'text';
        this.message.text = this.header + this.message.contentData.data;
        this.edit(this.message);
        this.addNewEntry();
    }

    addNewEntry(): void {
        this.onNewEntryAdded.emit({
            value: 'You chose: ' + this.selectedValue
        });
    }

    edit(message: Message): void {
        let result = JSON.stringify(message);
        if (!result) {
            return;
        }
        this.socketService.updateMessage(message);
    }
}
