

export interface Article {
    id: number | string;
    title: string;
    summary: string;
    tags?: string[];
    thumbnail?: string
    createdAt: Date
    author: {
        id: number,
        firstName: string,
        lastName: string,
        job: string,
        ProfilePictureUrl: string,
    }
}
