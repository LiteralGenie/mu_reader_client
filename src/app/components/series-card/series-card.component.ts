import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core'
import { DataService } from 'src/app/services/data-service.service'
import { config } from 'src/config/config'
import { SeriesData } from 'src/utils/dtos'

@Component({
    selector: 'app-series-card',
    templateUrl: './series-card.component.html',
    styleUrls: ['./series-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeriesCardComponent implements OnChanges {
    // Series id
    @Input() sid!: number

    constructor(
        private dataService: DataService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        // When series id changes...
        if (changes['sid']) {
            // Update the card data
            this.dataService.fetch_series(this.sid).subscribe((data) => {
                this.data = data
                this.img = this.dataService.get_cover_url(this.sid)
                this.reloadConfig()

                this.changeDetectorRef.markForCheck()
            })
        }
    }

    data?: SeriesData
    img?: string
    hidden = false

    onImageLoad(cover: HTMLImageElement, placeholder: HTMLImageElement) {
        cover.style.display = 'block'
        placeholder.style.display = 'none'
    }

    /**
     * Configure card based on config
     */
    private reloadConfig(): void {
        // Check if this series is blacklisted (based on genre)
        this.hidden = !!this.data?.genres.some((g) => {
            return config.tags_blacklist.includes(g.toLocaleLowerCase())
        })
    }
}
