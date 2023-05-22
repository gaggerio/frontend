import type { User } from './User.model'

export interface Gag {
    _id: string
    rate: Rate
    createdAt: number
    createdBy: User
    comments: Comment[]
    imgUrl: string,
    title: string
}

export interface Comment {
    _id: string
    createBy: User
    createAt: number
    text: string
    attachments: string
    rate: Rate
}

export type Rate = {
    dislike: number
    like: number
}