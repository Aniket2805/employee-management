import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { Store } from '@ngrx/store';
import { initAuthFromStorage, checkTokenValidity } from './store/auth/auth.actions';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FooterComponent } from './shared/footer/footer.component';
import { AuthService } from './core/services/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NavbarComponent, ReactiveFormsModule, FormlyModule, FooterComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    private store = inject(Store);
    private authService = inject(AuthService);

    constructor() {
        this.store.dispatch(initAuthFromStorage());
    }

    ngOnInit(): void {
        this.store.dispatch(checkTokenValidity());
        setInterval(() => {
            if (this.authService.isTokenPresent()) {
                this.store.dispatch(checkTokenValidity());
            }
        }, 5 * 60 * 1000); // Check every 5 minutes
    }

    title = 'frontend';
}
