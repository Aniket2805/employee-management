import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectLoginToken } from '../../store/auth/auth.selectors';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss'
})
export class FooterComponent {
    currentYear = new Date().getFullYear();
    private store = inject(Store);
    token = this.store.selectSignal(selectLoginToken);
}
