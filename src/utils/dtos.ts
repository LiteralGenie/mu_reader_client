export interface SeriesData {
    id: number;
    title: string;
    description: string;
    year_start: number;
    bayesian_rating?: number;
    licensed: boolean;
    completed: boolean;
    type: string;
    authors: Array<{
        id: number;
        name: string;
    }>;
    genres: string[];
    categories: string[];
}
