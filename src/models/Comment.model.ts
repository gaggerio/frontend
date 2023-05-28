import type { Rate } from "./Gag.model"
import type { User } from "./User.model"

export interface Comment {
    _id: string
    gagId: string
    createdBy: User
    createdAt: number
    text: string
    attachments: string
    rate: Rate
}

export interface CommentForm {
    text: string,
    file: string | File,
    gagId: string
}