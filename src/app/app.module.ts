import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatTabsModule } from '@angular/material/tabs'
import { MatToolbarModule } from '@angular/material/toolbar'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { SafeHtmlPipe } from 'src/utils/safe-html.pipe'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { FilterDialog } from './components/filter/filter.dialog'
import { SeriesCardComponent } from './components/series-card/series-card.component'
import { TagComponent } from './components/tag/tag.component'

@NgModule({
    declarations: [
        AppComponent,
        SafeHtmlPipe,
        SeriesCardComponent,
        TagComponent,
        FilterDialog,
    ],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSidenavModule,
        MatTabsModule,
        MatToolbarModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
