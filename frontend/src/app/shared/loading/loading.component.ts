import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
    selector: 'app-loading',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('600ms ease-out', style({ opacity: 1 }))
            ]),
            transition(':leave', [
                animate('400ms ease-in', style({ opacity: 0 }))
            ])
        ])
    ]
})
export class LoadingComponent {
    @Input() message: string = 'Loading';
}
