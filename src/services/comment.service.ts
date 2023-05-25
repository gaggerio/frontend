import type { Comment, CommentForm } from "../models/Comment.model"
import { httpService } from "./http.service"
import { imgService } from "./img.service"
import { storageService } from "./storage.service"
import { userService } from "./user.service"
import { utilService } from "./util.service"
import gComments from '../../data/comment.json'

const STORAGE_KEY = 'comment_db'
const API = 'comment'
const ENV = import.meta.env.VITE_ENV

export const commentService = {
    query,
    save,
    getRandomComment,
}

async function query(): Promise<Comment[]> {
    return ENV === 'local' ?
        await storageService.query(STORAGE_KEY) :
        await httpService.get(API)
}

function save(commentFrom: CommentForm): Promise<Comment> {
    return ENV === 'local' ?
        _createComment(commentFrom) :
        httpService.get(API, commentFrom)
}

function getRandomComment(gagId: string): Comment {
    const chance = Math.random()
    const imgs = imgService.getImgUrls()
    return {
        _id: utilService.makeId(),
        gagId,
        createdBy: userService.getEmptyUser(),
        createdAt: Date.now(),
        text: utilService.getLorem(),
        attachments: chance > 0.5 ? imgs[utilService.getRandomIntInc(0, imgs.length - 1)] : '',
        rate: {
            dislike: utilService.getRandomIntInc(0, 50),
            like: utilService.getRandomIntInc(0, 110)
        },
    }
}

function _createComment({ text, fileUrl, gagId }: CommentForm): Promise<Comment> {
    const comment = {
        _id: utilService.makeId(),
        gagId,
        createdBy: userService.getLoggedinUser(),
        createdAt: Date.now(),
        text,
        attachments: fileUrl,
        rate: {
            dislike: 0,
            like: 0
        },
    }
    return storageService.post(STORAGE_KEY, comment)
}

; (() => {
    if (ENV !== 'local') return
    let comments = utilService.loadFromStorage(STORAGE_KEY)
    if (!comments || !comments.length) {
        comments = gComments
        utilService.saveToStorage(STORAGE_KEY, comments)
    }
})()