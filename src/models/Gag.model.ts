import type { User } from "./User.model"

export interface Gag {
    _id: string
    rate: Rate
    createdAt: number
    createdBy: User
    imgUrl: string,
    title: string,
    comments: string[]
}

export type Rate = {
    up: string[]
    down: string[]
}