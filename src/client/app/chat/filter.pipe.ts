import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'filter'
})

export class FilterPipe implements PipeTransform {
    transform(groups: any[], searchText: string): any[] {
        if (!groups) return [];
        if (!searchText) return groups;
        searchText = searchText.toLowerCase();
        return groups.filter(group => {
            return group.name.toLowerCase().includes(searchText);
        });
    }
}