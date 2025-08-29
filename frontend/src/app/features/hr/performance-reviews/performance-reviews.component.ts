import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectPerformanceReviewsData, selectPerformanceReviewsLoading } from '../../../store/employee/employee.selectors';
import * as EmployeeActions from '../../../store/employee/employee.actions';

@Component({
    selector: 'app-performance-reviews',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './performance-reviews.component.html',
    styleUrls: ['./performance-reviews.component.scss']
})
export class PerformanceReviewsComponent implements OnInit {
    private store = inject(Store);
    reviews: any[] = [];
    loading = false;
    constructor() { }

    ngOnInit(): void {
        this.loadUpcoming();
        this.store.select(selectPerformanceReviewsData).subscribe((d) => this.reviews = d || []);
        this.store.select(selectPerformanceReviewsLoading).subscribe((l) => this.loading = !!l);
    }

    loadUpcoming() {
        this.store.dispatch(EmployeeActions.loadPerformanceReviews());
    }
}
