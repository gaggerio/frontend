import type { Comment, CommentForm } from "../models/Comment.model"
import { httpService } from "./http.service"
import { imgService } from "./img.service"
import { storageService } from "./storage.service"
import { userService } from "./user.service"
import { utilService } from "./util.service"
import { authService } from "./auth.service"
import gComments from '../../data/comment.json'

const STORAGE_KEY = 'comment_db'
const API = 'comment'
const ENV = import.meta.env.VITE_ENV

/**
 * Service for managing comments.
 * This service handles operations related to comments, including querying,
 * saving, updating, and rating comments.
 * The behavior of the service is determined by the ENV variable,
 * which specifies the environment in which the service is running.
 * @module commentService
 */
export const commentService = {
    query,
    save,
    update,
    updateRate,
    getRandomComments,
}

/**
 * Retrieves comments based on the environment.
 * @returns {Promise<Comment[]>} A promise that resolves to an array of comments.
 */
function query(gagId: string): Promise<Comment[]> {
    return ENV === 'local'
        ? _filteredComments(gagId)
        : httpService.get(`${API}/${gagId}`)
}

/**
 * Saves a comment based on the environment.
 * @param {CommentForm} commentForm - The comment form object.
 * @returns {Promise<Comment>} A promise that resolves to the saved comment.
 */
function save(commentForm: CommentForm): Promise<Comment> {
    return ENV === 'local'
        ? _createComment(commentForm)
        : httpService.post(API, commentForm)
}

/**
 * Updates a comment based on the environment.
 * @param {Comment} comment - The comment object to update.
 * @returns {Promise<Comment>} A promise that resolves to the updated comment.
 */
function update(comment: Comment): Promise<Comment> {
    return ENV === 'local'
        ? storageService.put(STORAGE_KEY, comment)
        : httpService.put(API, comment)
}

/**
 * Retrieves a comment by its ID.
 * @param {string} commentId - The ID of the comment to retrieve.
 * @returns {Promise<Comment>} A promise that resolves to the retrieved comment.
 */
function getById(commentId: string): Promise<Comment> {
    return ENV === 'local'
        ? storageService.get(STORAGE_KEY, commentId)
        : httpService.get(`${API}/${commentId}`)
}

async function _filteredComments(gagId: string) {
    const comments = await storageService.query(STORAGE_KEY)
    return comments.filter((c: Comment) => c.gagId === gagId)
}

/**
 * Updates the rate of a comment.
 * @param {string} commentId - The ID of the comment to update.
 * @param {string} dir - The direction of the rate ('up' or 'down').
 * @param {number} diff - The difference to apply to the rate.
 */
function updateRate(commentId: string, dir: string, diff: number) {
    return ENV === 'local'
        ? _updateRate(commentId, dir, diff)
        : httpService.post(`${API}/rate`, { commentId, dir, diff })
}

/**
 * Updates the rate of a comment locally.
 * @private
 * @param {string} commentId - The ID of the comment to update.
 * @param {string} dir - The direction of the rate ('up' or 'down').
 * @param {number} diff - The difference to apply to the rate.
 * @returns {Promise<Comment>} A promise that resolves to the updated comment.
 */
async function _updateRate(commentId: string, dir: string, diff: number): Promise<Comment> {
    const comment = await getById(commentId)
    comment.rate[dir] += diff
    return update(comment)
}

/**
 * Creates a new comment object based on the provided comment form.
 * @private
 * @param {CommentForm} commentForm - The comment form object.
 * @returns {Promise<Comment>} A promise that resolves to the created comment.
 */
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

/**
 * Creates a random comment. Used only for development.
 * @private
 * @param {string} gagId - The gag ID associated with the comment.
 * @returns {Comment} The newly created comment.
 */
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

/**
 * Creates an array of random comments. Used for development only.
 * @param {string} id - Gag ID to associate with the comment.
 * @returns {Comment[]} An array of random comments.
 */
function getRandomComments(id: string): Comment[] {
    const comments: Comment[] = []
    for (let i = 0; i < utilService.getRandomIntInc(0, 25); i++) {
        const comment = _getRandomComment(id)
        comments.push(comment)
    }
    return comments
}

/**
 * Helper IIFE to load demo data, used for development only.
 */
(() => {
    if (ENV !== 'local') return
    let comments = utilService.loadFromStorage(STORAGE_KEY)
    if (!comments || !comments.length) {
        comments = gComments
        utilService.saveToStorage(STORAGE_KEY, comments)
    }
})()
