import type { MiniUser } from './User.model'

export interface Gag {
    _id: string
    rate: Rate
    createdAt: number
    createdBy: MiniUser
    imgUrl: string,
    title: string,
    comments: string[]
    gags: string[]
}

export type Rate = {
    [key: string]: string[]
    up: string[]
    down: string[]
}