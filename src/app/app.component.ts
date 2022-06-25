import { Component } from '@angular/core';
import { DataService } from './services/data-service.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor(private dataService: DataService) {}

    ids$ = this.dataService.fetch_series_ids({ offset: 0, limit: 100 });
}
