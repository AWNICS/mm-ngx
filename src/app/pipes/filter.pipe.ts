import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'filter'
})

export class FilterPipe implements PipeTransform {
    transform(groups: any[], searchText: string): any[] {
        if (groups.length === 0) { return []; }
        if(groups[0].phase){
            // if it is group
            if (!searchText) { return groups; }
            searchText = searchText.toLowerCase();
            return groups.filter(group => {
                return group.name.toLowerCase().includes(searchText);
            });
        } else {
            // if it is media message
            if (!searchText) { return groups; }
            searchText = searchText.toLowerCase();
            return groups.filter(group => {
                return group.contentData.data[0].includes(searchText);
            });
        }
    }
}
