import { AfterViewInit, Component } from '@angular/core'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { EMPTY, map, Observable } from 'rxjs'
import { SearchRequest, SortType } from 'src/utils/dtos'
import { FilterDialog } from './components/filter/filter.dialog'
import { DataService } from './services/data-service.service'
import { SearchService, SortOrder } from './services/search.service'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
    constructor(
        private dataService: DataService,
        private matDialog: MatDialog,
        private searchService: SearchService
    ) {
        // Init list of series
        const request = new SearchRequest()
            .setSortType(SortType.SCORE)
            .setSortOrder(SortOrder.DESCENDING)
        this.searchService.search(request).subscribe(() => {
            this.reloadList()
        })
    }

    ngAfterViewInit(): void {
        // for debugging
        this.onFilterClick()
    }

    readonly pageSize = 100
    ids$: Observable<number[]> = EMPTY
    offset = 0

    /**
     * Open filter dialog
     */
    onFilterClick() {
        const config: MatDialogConfig = {}
        this.matDialog
            .open(FilterDialog, config)
            .afterClosed()
            .subscribe((result) => {
                // If user made a selection, reload list
                if (result === undefined) return
                this.reloadList({ reset: true })
            })
    }

    /**
     * Show user a list of series
     * @param options.reset whether to reset the current page index to 0
     */
    reloadList({ reset = false } = {}): void {
        if (reset) this.offset = 0

        this.ids$ = this.searchService.activeSort.data.pipe(
            map((lst) =>
                lst.slice(
                    this.offset * this.pageSize,
                    (this.offset + 1) * this.pageSize
                )
            )
        )
    }
}
