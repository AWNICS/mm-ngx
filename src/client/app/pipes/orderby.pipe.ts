import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name :'orderBy'
})

export class OrderBy implements PipeTransform {
    transform(groups: any[], unreadMessages:any):any {
    let transform:any=[];
    let unread:any = unreadMessages;
    let unreadGroups:any  = [];
    if(groups) {
        transform = groups;
        // let j = 0;
        // groups.map((group:any)=> {
        //     j++;
        //     if(Boolean(group.id) === Boolean(group.id === unread.id)) {
        //         unreadGroups.push(transform.splice(j-1,1));
        //     }
        // });
        let i = 0;
        groups.map((group:any)=> {
            i++;
            if(group.name ==='MedHelp') {
                let med = transform.splice(i-1,1);
                transform.unshift(med[0]);
            }
        });
        // unreadGroups.map((unread:any)=> {
        //     transform.unshift(unread);
        // });
    console.log(transform);
        return transform;
    }
    }
}
