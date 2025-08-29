import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { appReducer } from './app/store/app.reducer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthEffects } from './app/store/auth/auth.effects';
import { importProvidersFrom } from '@angular/core';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { EmployeeEffects } from './app/store/employee/employee.effects';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    ReactiveFormsModule,
    provideAnimations(), // required animations providers
    provideToastr({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      maxOpened: 5,
      autoDismiss: true,
      closeButton: true,

    }),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(
      StoreModule.forRoot(appReducer),
      EffectsModule.forRoot([AuthEffects, EmployeeEffects]),
      StoreDevtoolsModule.instrument({ maxAge: 25 }))
  ],
})
  .catch((err) => console.error(err));
