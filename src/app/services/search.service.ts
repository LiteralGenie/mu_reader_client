import { Injectable } from '@angular/core'
import { map, Observable, share, shareReplay } from 'rxjs'
import { SearchRequest, SearchResponse, SortType } from 'src/utils/dtos'
import { DataService } from './data-service.service'

@Injectable({
    providedIn: 'root',
})
export class SearchService {
    constructor(private dataService: DataService) {
        const request = new SearchRequest()
        this.search(request)
        this.activeSort = {
            type: request.sort_type,
            order: SortOrder.DESCENDING,
            data: this.list.sorts[request.sort_type],
        }
    }

    public list!: SeriesList
    public activeSort!: Sort

    search(
        request: SearchRequest,
        order: SortOrder = SortOrder.DESCENDING
    ): Observable<SearchResponse> {
        const list = {
            request: request,
            sorts: {},
        } as SeriesList

        Object.values(SortType).forEach((k) => {
            const requestCopy = new SearchRequest()
            Object.assign(requestCopy, request)
            requestCopy.sort_type = k

            list.sorts[k] = this.dataService
                .fetch_search(requestCopy)
                .pipe(shareReplay(1))
        })

        this.list = list
        return this.sort(request.sort_type, order)
    }

    sort(type: SortType, order: SortOrder): Observable<SearchResponse> {
        this.activeSort = {
            type,
            order,
            data: this.list.sorts[type].pipe(
                map((lst) => {
                    return order === SortOrder.ASCENDING ? lst : lst.reverse()
                })
            ),
        }

        return this.activeSort.data
    }
}

export interface Sort {
    type: SortType
    order: SortOrder
    data: Observable<SearchResponse>
}

export enum SortOrder {
    ASCENDING = 'ASCENDING',
    DESCENDING = 'DESCENDING',
}

export interface SeriesList {
    readonly request: SearchRequest
    sorts: { [key in SortType]: Observable<SearchResponse> }
}
