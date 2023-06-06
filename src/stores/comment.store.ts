import { defineStore } from 'pinia'
import { uploadImg } from '@/services/upload.service'
import { useUserStore } from '@/stores/user.store'
import { commentService } from '@/services/comment.service'
import { useGagStore } from './gag.store'
import type { Comment } from '@/models/Comment.model'
import type { CommentForm } from '@/models/Comment.model'
import type { RateData } from '@/models/Rate.model'
import type { User } from '@/models/User.model'

export interface CommentState {
    comments: Comment[]
}

export const useCommentStore = defineStore('comment', {
    state: (): CommentState => ({
        comments: []
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
                const { itemId, dir } = rateData
                const comment = this.getCommentById(itemId)
                if (!comment) return

                const user = this.userStore.loggedinUser
                if (!user) return

                const isUpvoted = comment.rate.up.includes(user._id)
                const isDownvoted = comment.rate.down.includes(user._id)

                switch (dir) {
                    case 'up':
                        this.toggleRate(comment, user, rateData)
                        if (isDownvoted) this.toggleRate(comment, user, { ...rateData, dir: 'down' })
                        break
                    case 'down':
                        this.toggleRate(comment, user, rateData)
                        if (isUpvoted) this.toggleRate(comment, user, { ...rateData, dir: 'up' })
                        break
                }
                await commentService.update(comment)
            }
            catch (err) {
                console.dir('commentStore: Failed to rate comment', err)
                throw Error
            }
        },
        toggleRate(comment: Comment, user: User, { dir, itemId }: RateData) {
            const subject = 'comment'
            const rate = comment.rate[dir]

            if (rate.includes(user._id)) {
                const idx = rate.findIndex((id: string) => id === user._id)
                rate.splice(idx, 1)
                this.userStore.removeRate(itemId, dir, subject)
            }
            else {
                rate.push(user._id)
                this.userStore.addRate(itemId, dir, subject)
            }
        },
    }
})