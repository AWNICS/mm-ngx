import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'date'
})

export class DatePipe implements PipeTransform {
    transform(date: any, type: string): any {
        if (!date) { return; }
        switch (type) {
            case 'sm': return moment(date).format('LT');
            case 'md': return moment(date).format('ll');
            case 'lg': return moment(date).format('lll');
            default: throw new Error(`Invalid date type specified: ${type}`);
        }
    }
}
