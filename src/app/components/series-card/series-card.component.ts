import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
} from '@angular/core';
import { DataService } from 'src/app/services/data-service.service';
import { SeriesData } from 'src/utils/dtos';

@Component({
    selector: 'app-series-card',
    templateUrl: './series-card.component.html',
    styleUrls: ['./series-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeriesCardComponent implements OnInit {
    @Input() sid!: number;

    constructor(
        private dataService: DataService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.dataService.fetch_series(this.sid).subscribe((data) => {
            this.data = data;
            this.changeDetectorRef.detectChanges();

            if (
                this.data.genres.some((g) => {
                    if ('yaoi shoujo josei hentai yuri'.split(' ').includes(g))
                        return true;
                    if (['shounen ai'].includes(g)) return true;
                    return false;
                })
            )
                this.debug = true;
        });

        this.img = this.dataService.get_cover_url(this.sid);
    }

    data?: SeriesData;
    img?: string;
    debug: any = false;

    onImageLoad(cover: HTMLImageElement, placeholder: HTMLImageElement) {
        cover.style.display = 'block';
        placeholder.style.display = 'none';
    }
}
