import { AfterViewInit, Component } from '@angular/core'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { map, Observable } from 'rxjs'
import { SearchRequest, SearchResponse, SortType } from 'src/utils/dtos'
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
        const request = new SearchRequest()
        request.sort_type = SortType.SCORE
        this.searchService.search(request, SortOrder.DESCENDING)
        this.loadList()
    }

    ngAfterViewInit(): void {
        this.onFilterClick()
    }

    readonly pageSize = 100
    ids$!: Observable<number[]>
    offset = 0

    onFilterClick() {
        const config: MatDialogConfig = {}
        this.matDialog
            .open(FilterDialog, config)
            .afterClosed()
            .subscribe((result) => {
                if (result === undefined) return

                this.loadList({ reset: true })
            })
    }

    loadList({ reset = false } = {}): void {
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
