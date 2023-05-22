export interface Img {
    _id: string
    url: string
    keywords: string[],
    size: {
        width: number
        height: number
    }
}