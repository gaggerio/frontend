export interface User {
    [key: string]: string | Rate
    _id: string
    username: string
    fullname: string
    imgUrl: string
    rate: Rate
}

interface Rate {
    [key: string]: GagRate | CommentRate
    gag: GagRate
    comment: CommentRate
}

interface GagRate {
    [key: string]: string[]
    up: string[]
    down: string[]
    uploaded: string[]
}

interface CommentRate {
    [key: string]: string[]
    up: string[]
    down: string[]
    posted: string[]
}

export interface Credentials {
    username: string
    password: string
    fullname: string
    imgUrl: string
}

export interface MiniUser {
    _id: string
    username: string
    imgUrl: string
}
