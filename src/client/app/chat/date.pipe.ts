import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'date'
})

export class DatePipe implements PipeTransform {
    transform(date: any): any {
        if (!date) return;
        let time = moment(date).format('LT');
        return time;
    }
}
