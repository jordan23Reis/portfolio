import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], positions: string[], visible: boolean): any[] {
    if (!items || !positions || positions.length === 0) return [];
    return items.filter(item => positions.includes(item.position) && visible);
  }
}