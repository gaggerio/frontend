import type { Comment } from './Comment.model'
import type { User } from './User.model'

export interface Gag {
    _id: string
    rate: Rate
    createdAt: number
    createdBy: User
    imgUrl: string,
    title: string,
    comments: Comment[]
}

export type Rate = {
    dislike: number
    like: number
}