import type { Rate } from './Gag.model'
import type { MiniUser } from './User.model'

export interface Comment {
    [key: string]: string | number | Rate | MiniUser
    _id: string
    gagId: string
    createdBy: MiniUser
    createdAt: number
    text: string
    attachments: string
    rate: Rate
}

export interface CommentForm {
    text: string
    file: string | File
    gagId: string
}
