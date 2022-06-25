import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, tap } from 'rxjs';
import { config } from 'src/config/config';
import { SeriesData } from 'src/utils/dtos';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    constructor(private http: HttpClient) {}

    private seriesCache: SeriesCache = {};

    fetch_series(id: number) {
        if (this.seriesCache[id]) {
            return of(this.seriesCache[id].data);
        } else {
            return this.http
                .get<SeriesData>(config.serverUrl + `series/ids/${id}`)
                .pipe(
                    tap((data) => {
                        this.seriesCache[id] = { data, time: Date.now() };
                    })
                );
        }
    }

    fetch_series_ids({ offset = 0, limit = 30 } = {}) {
        return this.http.get<number[]>(
            config.serverUrl + `series/ids?offset=${offset}&limit=${limit}`
        );
    }

    get_cover_url(id: number) {
        return config.serverUrl + `series/images/${id}`;
    }
}

interface SeriesCache {
    [id: number]: {
        time: number;
        data: SeriesData;
    };
}
