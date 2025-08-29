import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'prettyJson', standalone: true })
export class PrettyJsonPipe implements PipeTransform {
    transform(value: any): string {
        if (!value) return '';
        if (typeof value === 'string') {
            try {
                value = JSON.parse(value);
            } catch {
                return value;
            }
        }
        return JSON.stringify(value, null, 2);
    }
}
