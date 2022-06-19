import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { config } from 'src/config/config';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor(private http: HttpClient) {}

    test = this.http.get(config.serverUrl + 'series/ids');
}
