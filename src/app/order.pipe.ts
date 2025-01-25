import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderByPosition',
  standalone: true,
})
export class OrderByPositionPipe implements PipeTransform {
  transform(items: any[]): any[] {
    if (!items) return [];
    // Define a ordem de prioridade
    const order = ['left', 'center', 'right'];
    return items.sort((a, b) => order.indexOf(a.position) - order.indexOf(b.position));
  }
}