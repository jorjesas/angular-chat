import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
 name: 'searchfilter'
})

@Injectable()
export class SearchFilterPipe implements PipeTransform {
 transform(items: any[], field: string, value: string): any[] {
    if (!items) {
       return [];
    }

    if (value === undefined) {
        value = '';
    }

    console.log(items[1]);
    return items.filter(it => it[field].toLowerCase().indexOf(value.toLowerCase()) > -1);
 }
}
