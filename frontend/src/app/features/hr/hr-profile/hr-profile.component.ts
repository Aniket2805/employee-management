import { Component } from '@angular/core';
import { ProfileComponent } from '../../../shared/profile/profile.component';

@Component({
    standalone: true,
    selector: 'app-hr-profile',
    imports: [ProfileComponent],
    template: '<app-profile [userRole]="\'HR\'"></app-profile>',
})
export class HrProfileComponent { }
