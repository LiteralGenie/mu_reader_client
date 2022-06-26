import { Injectable } from '@angular/core'
import { map, Observable, share, shareReplay } from 'rxjs'
import { SearchRequest, SearchResponse, SortType } from 'src/utils/dtos'
import { DataService } from './data-service.service'

/**
 * Service that...
 *   - holds a list of series (representing the user's most recent search)
 *   - updates / filters / sorts this list
 */
@Injectable({
    providedIn: 'root',
})
export class SearchService {
    constructor(private dataService: DataService) {
        // Set default list of series
        this.search(new SearchRequest())
    }

    public list!: SeriesList
    public activeSort!: Sort

    /**
     * Ask the api for a new list of series based on some filter / sort criteria
     * @param request
     * @param sortOrder
     * @param sortType
     * @returns
     */
    search(
        request: SearchRequest,
        sortOrder: SortOrder = SortOrder.DESCENDING,
        sortType?: SortType
    ): Observable<SearchResponse> {
        request.sort_type = sortType || request.sort_type

        const list = {
            request: request,
            sorts: {},
        } as SeriesList

        // For each possible sort criteria, prepare an observable that fetches that sort data
        Object.values(SortType).forEach((k) => {
            const requestCopy = new SearchRequest()
            Object.assign(requestCopy, request)
            requestCopy.sort_type = k

            list.sorts[k] = this.dataService
                // Fetch data
                .fetch_search(requestCopy)
                // Replay the response to any late subscribers
                .pipe(shareReplay(1))
        })

        // Return the requested sort
        this.list = list
        return this.sort(request.sort_type, sortOrder)
    }

    /**
     * Update the activeSort list and return the list of sorted series ids
     * @param sortType
     * @param sortOrder
     * @returns
     */
    sort(sortType: SortType, sortOrder: SortOrder): Observable<SearchResponse> {
        this.activeSort = {
            sortType: sortType,
            sortOrder: sortOrder,
            data: this.list.sorts[sortType].pipe(
                map((lst) => {
                    return sortOrder === SortOrder.ASCENDING
                        ? lst
                        : lst.reverse()
                })
            ),
        }

        return this.activeSort.data
    }
}

export interface Sort {
    sortType: SortType
    sortOrder: SortOrder
    data: Observable<SearchResponse>
}

export enum SortOrder {
    ASCENDING = 1,
    DESCENDING = 0,
}

export interface SeriesList {
    readonly request: SearchRequest
    sorts: { [key in SortType]: Observable<SearchResponse> }
}
