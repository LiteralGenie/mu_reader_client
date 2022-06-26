import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of, tap } from 'rxjs'
import { config } from 'src/config/config'
import {
    Category,
    Genre,
    SearchRequest,
    SearchResponse,
    SeriesData,
} from 'src/utils/dtos'

@Injectable({
    providedIn: 'root',
})
export class DataService {
    constructor(private http: HttpClient) {}

    private seriesCache: SeriesCache = {}

    fetch_series(id: number) {
        if (this.seriesCache[id]) {
            return of(this.seriesCache[id].data)
        } else {
            return this.http
                .get<SeriesData>(config.serverUrl + `series/ids/${id}`)
                .pipe(
                    tap((data) => {
                        this.seriesCache[id] = { data, time: Date.now() }
                    })
                )
        }
    }

    fetch_series_ids({ offset = 0, limit = 30 } = {}) {
        return this.http.get<number[]>(
            config.serverUrl + `series/ids?offset=${offset}&limit=${limit}`
        )
    }

    get_cover_url(id: number): string {
        return config.serverUrl + `series/images/${id}`
    }

    fetch_search(request: SearchRequest) {
        const url =
            config.serverUrl + `series/search?` + request.serializeToQuery()
        return this.http.get<SearchResponse>(url)
    }

    private genresCache: Genre[] = []
    fetch_genres(update: boolean = false): Observable<Genre[]> {
        if (this.genresCache.length > 0 || update) {
            return of([...this.genresCache])
        } else {
            const url = config.serverUrl + `series/genres`
            return this.http
                .get<Genre[]>(url)
                .pipe(tap((resp) => (this.genresCache = [...resp])))
        }
    }

    private categoriesCache: Category[] = []
    fetch_categories(update: boolean = false): Observable<Category[]> {
        if (this.categoriesCache.length > 0 || update) {
            return of([...this.categoriesCache])
        } else {
            const url = config.serverUrl + `series/categories`
            return this.http
                .get<Category[]>(url)
                .pipe(tap((resp) => (this.categoriesCache = [...resp])))
        }
    }
}

interface SeriesCache {
    [id: number]: {
        time: number
        data: SeriesData
    }
}
