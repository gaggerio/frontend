import type { Comment, CommentForm } from '../models/Comment.model'
import { useHttpService } from './http.service'
import { imgService } from './img.service'
import { useStorageService } from './storage.service'
import { userService } from './user.service'
import { utilService } from './util.service'
import { authService } from './auth.service'

const STORAGE_KEY = 'comment_db'
const API = 'comment'
const ENV = import.meta.env.VITE_ENV

const storageService = useStorageService<Comment>()
const httpService = useHttpService<Comment>()

export const commentService = {
    query,
    save,
    update,
    getById,
    createRandomComments,
}

function query(gagId: string): Promise<Comment[]> {
    return ENV === 'local'
        ? _filteredComments(gagId)
        : httpService.get(`${API}/${gagId}`)
}

function save(commentForm: CommentForm): Promise<Comment> {
    return ENV === 'local'
        ? _createComment(commentForm)
        : httpService.post(API, commentForm)
}

function update(comment: Comment): Promise<Comment> {
    return ENV === 'local'
        ? storageService.put(STORAGE_KEY, comment)
        : httpService.put(API, comment)
}

function getById(commentId: string): Promise<Comment> {
    return ENV === 'local'
        ? storageService.get(STORAGE_KEY, commentId)
        : httpService.get(`${API}/${commentId}`)
}

async function _filteredComments(gagId: string) {
    const comments = await storageService.query(STORAGE_KEY)
    return comments.filter((c: Comment) => c.gagId === gagId)
}

function _createComment(commentForm: CommentForm): Promise<Comment> {
    const comment: Comment = {
        _id: utilService.makeId(),
        gagId: commentForm.gagId,
        createdBy: authService.getLoggedinUser(),
        createdAt: Date.now(),
        text: commentForm.text,
        attachments: commentForm.file as string,
        rate: {
            up: [],
            down: []
        },
    }
    return storageService.post(STORAGE_KEY, comment)
}

function _getRandomComment(gagId: string): Comment {
    const chance = Math.random()
    const { _id, username, imgUrl } = userService.getRandomUser()
    return {
        _id: utilService.makeId(),
        gagId,
        createdBy: { _id, username, imgUrl },
        createdAt: Date.now(),
        text: utilService.getLorem(),
        attachments: chance > 0.5 ? imgService.getRandomImg().url : '',
        rate: {
            up: userService.getRandomUserIds(),
            down: userService.getRandomUserIds()
        },
    }
}

function createRandomComments(gagId: string) {
    const comments: Comment[] = utilService.loadFromStorage(STORAGE_KEY) || []
    for (let i = 0; i < utilService.getRandomIntInc(0, 25); i++) {
        const comment = _getRandomComment(gagId)
        comments.push(comment)
    }
    utilService.saveToStorage(STORAGE_KEY, comments)
}