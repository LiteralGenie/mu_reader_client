export interface SeriesData {
    id: number
    title: string
    description: string
    year_start: number
    bayesian_rating?: number
    licensed: boolean
    completed: boolean
    type: string
    authors: Array<{
        id: number
        name: string
    }>
    genres: string[]
    categories: string[]
}

export class SearchRequest {
    title?: string
    author?: string
    year_start_min?: number
    year_start_max?: number
    score_min?: number
    licensed?: boolean
    completed?: boolean
    sort_type: SortType = SortType.SCORE
    genres: Set<number> = new Set()
    genres_exclude: Set<number> = new Set()
    categories: Set<number> = new Set()
    categories_exclude: Set<number> = new Set()
    ascending = false

    serializeToQuery(): string {
        let qs: string[] = []

        type Key = keyof SearchRequest

        const singles: Key[] = [
            'title',
            'author',
            'year_start_min',
            'year_start_max',
            'score_min',
            'licensed',
            'completed',
            'sort_type',
            'ascending',
        ]
        singles
            .filter((k) => this[k] !== undefined)
            .forEach((k) => {
                qs.push(`${k}=${this[k]}`)
            })

        const sets: Key[] = [
            'genres',
            'genres_exclude',
            'categories',
            'categories_exclude',
        ]
        sets.forEach((k) => {
            ;(this[k] as Set<any>).forEach((v) => {
                qs.push(`${k}=${v}`)
            })
        })

        return qs.join('&')
    }
}

export type SearchResponse = number[]

export interface Genre {
    id: number
    name: string
    count: number
}

export interface Category {
    id: number
    name: string
    count: number
}

export enum SortType {
    TITLE = 'title',
    YEAR = 'year',
    SCORE = 'score',
    TIME = 'time',
}
