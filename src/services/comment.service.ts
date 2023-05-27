import type { Comment, CommentForm } from "../models/Comment.model"
import { httpService } from "./http.service"
import { imgService } from "./img.service"
import { storageService } from "./storage.service"
import { userService } from "./user.service"
import { utilService } from "./util.service"
import gComments from '../../data/comment.json'
import { authService } from "./auth.service"

const STORAGE_KEY = 'comment_db'
const API = 'comment'
const ENV = import.meta.env.VITE_ENV

export const commentService = {
    query,
    save,
    update,
    updateRate,
    getRandomComments,
}

function query(): Promise<Comment[]> {
    return ENV === 'local' ?
        storageService.query(STORAGE_KEY) :
        httpService.get(API)
}

function save(commentFrom: CommentForm): Promise<Comment> {
    return ENV === 'local' ?
        _createComment(commentFrom) :
        httpService.get(API, commentFrom)
}

function update(comment: Comment): Promise<Comment> {
    return ENV === 'local' ?
        storageService.put(STORAGE_KEY, comment) :
        httpService.put(API, comment)
}

function getById(commentId: string): Promise<Comment> {
    return ENV === 'local' ?
        storageService.get(STORAGE_KEY, commentId) :
        httpService.get(`${API}/${commentId}`)
}

function updateRate(commentId: string, dir: string, diff: number) {
    return ENV === 'local' ?
        _updateRate(commentId, dir, diff) :
        httpService.post(`${API}/rate`, { commentId, dir, diff })
}

async function _updateRate(commentId: string, dir: string, diff: number) {
    const gag = await getById(commentId)
    gag.rate[dir] += diff
    return update(gag)
}

function _createComment({ text, file, gagId }: CommentForm): Promise<Comment> {
    const comment: Comment = {
        _id: utilService.makeId(),
        gagId,
        createdBy: authService.getLoggedinUser(),
        createdAt: Date.now(),
        text,
        attachments: file,
        rate: {
            up: 0,
            down: 0
        },
    }
    return storageService.post(STORAGE_KEY, comment)
}

function _getRandomComment(gagId: string): Comment {
    const chance = Math.random()
    return {
        _id: utilService.makeId(),
        gagId,
        createdBy: userService.getRandomUser(),
        createdAt: Date.now(),
        text: utilService.getLorem(),
        attachments: chance > 0.5 ? imgService.getRandomImg().url : '',
        rate: {
            up: utilService.getRandomIntInc(0, 50),
            down: utilService.getRandomIntInc(0, 110)
        },
    }
}

function getRandomComments(id: string) {
    const comments: Comment[] = []
    for (let i = 0; i < utilService.getRandomIntInc(0, 25); i++) {
        const comment = _getRandomComment(id)
        comments.push(comment)
    }
    return comments
}

; (() => {
    if (ENV !== 'local') return
    let comments = utilService.loadFromStorage(STORAGE_KEY)
    if (!comments || !comments.length) {
        comments = gComments
        utilService.saveToStorage(STORAGE_KEY, comments)
    }
})()