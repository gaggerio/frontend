import { defineStore } from 'pinia'
import { uploadImg } from '@/services/upload.service'
import { useUserStore } from '@/stores/user.store'
import { commentService } from '@/services/comment.service'
import { useGagStore } from './gag.store'
import type { Comment } from '@/models/Comment.model'
import type { CommentForm } from '@/models/Comment.model'
import type { RateData } from '@/models/Rate.model'

export interface CommentState {
    comments: Comment[]
}

export const useCommentStore = defineStore('comment', {
    state: (): CommentState => ({
        comments: null!
    }),
    getters: {
        getComments({ comments }) {
            return comments
        },
        gagStore() {
            const gagStore = useGagStore()
            return gagStore
        },
        userStore() {
            const userStore = useUserStore()
            return userStore
        },
        getCommentById({ comments }) {
            return (id: string) => comments.find(c => c._id === id)
        },
    },
    actions: {
        async setComments(gagId: string) {
            try {
                const comments = await commentService.query(gagId)
                if (comments) this.comments = comments
            }
            catch (err) {
                console.dir('commentStore: Failed to set comment', err)
                throw Error
            }
        },
        async saveComment(commentForm: CommentForm) {
            try {
                const file = await uploadImg(commentForm.file)
                const commentToSave = {
                    text: commentForm.text,
                    file: file ? file.url : '',
                    gagId: this.gagStore.currGagId
                }
                const savedComment = await commentService.save(commentToSave)
                this.comments?.unshift(savedComment)
                this.userStore.savePostedComment(savedComment._id)
            }
            catch (err) {
                console.dir('commentStore: Failed to save comment', err)
                throw Error
            }
        },
        async changeCommentRate(rateData: RateData) {
            try {
                const { dir, gagId, commentId } = rateData
                const subject = 'comment'
                const user = this.userStore.getLoggedinUser
                if (!user) return

                const comment = this.getCommentById(commentId as string)
                if (!comment) return
                let rate = comment.rate[dir]

                if (rate.includes(user._id)) {
                    const idx = rate.findIndex((id: string) => id === user._id)
                    rate.splice(idx, 1)
                    this.userStore.removeRate(gagId, dir, subject)
                }
                else {
                    rate.push(user._id)
                    this.userStore.addRate(gagId, dir, subject)
                }
                await commentService.update(comment)
            }
            catch (err) {
                console.dir('gagStore: Failed to rate gag', err)
                throw Error
            }
        }
    }
})