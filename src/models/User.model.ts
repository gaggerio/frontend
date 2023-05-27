export interface User {
    _id: string
    username: string,
    fullname: string,
    imgUrl: string
    gag: {
        up: string[]
        down: string[]
        uploaded: string[]
    }
    comment: {
        up: string[]
        down: string[]
        posted: string[]
    }
}

export interface Credentials {
    username: string
    password: string
    fullname: string
    imgUrl: string
}