import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDialog } from './filter.dialog';

describe('FilterComponent', () => {
    let component: FilterDialog;
    let fixture: ComponentFixture<FilterDialog>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FilterDialog],
        }).compileComponents();

        fixture = TestBed.createComponent(FilterDialog);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
