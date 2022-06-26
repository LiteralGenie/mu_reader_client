import { Component } from '@angular/core'
import { MatCheckbox } from '@angular/material/checkbox'
import { MatDialogRef } from '@angular/material/dialog'
import { map } from 'rxjs'
import { DataService } from 'src/app/services/data-service.service'
import { SearchService } from 'src/app/services/search.service'
import { Category, Genre, SearchRequest } from 'src/utils/dtos'

@Component({
    selector: 'app-filter',
    templateUrl: './filter.dialog.html',
    styleUrls: ['./filter.dialog.scss'],
})
export class FilterDialog {
    constructor(
        private dataService: DataService,
        private matDialogRef: MatDialogRef<FilterDialog>,
        private searchService: SearchService
    ) {}

    request = new SearchRequest()
    genres = this.dataService
        .fetch_genres()
        .pipe(
            map((lst) =>
                lst.sort((a, b) =>
                    a.name
                        .toLocaleLowerCase()
                        .localeCompare(b.name.toLocaleLowerCase())
                )
            )
        )

    category_bins = this.dataService.fetch_categories().pipe(
        map((lst) => lst.sort((a, b) => a.count - b.count)),
        map((lst) => {
            type CategoryBin = {
                bin: Category[]
                breakpoint: number
            }

            const breakpoints = [250, 500, 1000]

            let result: CategoryBin[] = []

            let bin: Category[] = []
            let idx = 0
            let bpIdx = 0
            while (idx < lst.length) {
                const bp =
                    bpIdx < breakpoints.length ? breakpoints[bpIdx] : Infinity
                const it = lst[idx]

                if (it.count < bp) {
                    bin.push(it)
                } else {
                    result.push({ bin, breakpoint: bp })
                    bpIdx += 1
                    bin = [it]
                }

                idx += 1
            }
            result.push({ bin, breakpoint: Infinity })

            result = result.reverse()

            result.forEach((lst) => {
                lst.bin.sort((a, b) =>
                    a.name
                        .toLocaleLowerCase()
                        .localeCompare(b.name.toLocaleLowerCase())
                )
            })

            return result
        })
    )

    onSubmit(): void {
        this.searchService.search(this.request).subscribe((result) => {
            this.matDialogRef.close(result)
        })
    }

    onClear(): void {
        this.request = new SearchRequest()
    }

    onGenreClick(genre: Genre, checkbox: MatCheckbox): void {
        const id = genre.id
        const include = this.request.genres
        const exclude = this.request.genres_exclude

        if (checkbox.indeterminate === true) {
            // exclude -> noop
            include.delete(id)
            checkbox.checked = false

            exclude.delete(id)
            checkbox.indeterminate = false
        } else if (checkbox.checked === false) {
            // noop -> include
            include.add(id)
            checkbox.checked = true

            exclude.delete(id)
            checkbox.indeterminate = false
        } else {
            // include -> exclude
            include.add(id)
            checkbox.checked = false

            exclude.delete(id)
            checkbox.indeterminate = true
        }
    }

    onCategory(cat: Category, checkbox: MatCheckbox): void {
        const id = cat.id
        const include = this.request.categories
        const exclude = this.request.categories_exclude

        if (checkbox.indeterminate === true) {
            // exclude -> noop
            include.delete(id)
            checkbox.checked = false

            exclude.delete(id)
            checkbox.indeterminate = false
        } else if (checkbox.checked === false) {
            // noop -> include
            include.add(id)
            checkbox.checked = true

            exclude.delete(id)
            checkbox.indeterminate = false
        } else {
            // include -> exclude
            include.add(id)
            checkbox.checked = false

            exclude.delete(id)
            checkbox.indeterminate = true
        }
    }
}
