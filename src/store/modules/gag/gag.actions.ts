import type { RootState } from '../../index'
import type { ActionContext } from "vuex"
import type { Gag } from '../../../models/Gag.model'
import type { FilterBy } from '../../../models/FilterBy.model'
import type { Comment, CommentForm } from '../../../models/Comment.model'
import type { GagState } from './gag.store'

import { gagService } from '../../../services/gag.service'
import { uploadImg } from '@/services/upload.service'
import { commentService } from '@/services/comment.service'
import { authService } from '@/services/auth.service'
import type { User } from '@/models/User.model'


export const gagActions = {
    loadGags,
    saveGag,
    saveComment,
    changeGagRate,
    changeCommentRate
}

export interface Payload {
    type: string
    gags: Gag[]
    savedGag: Gag
    gag: Gag
    gagId: string
    filterBy: FilterBy
    data: {
        imgUrl: string
        title: string,

    },
    commentForm: CommentForm,
    savedComment: Comment,
    rateData: RateData
}

export type RateData = {
    dir: string,
    gagId: string
    diff: number
    commentId?: string
}

type Context = ActionContext<GagState, RootState>

async function loadGags({ commit }: Context, { filterBy }: Payload) {
    try {
        const gags = await gagService.query(filterBy)
        if (gags) commit({ type: 'setGags', gags })
    }
    catch (err) {
        console.dir(err)
        throw Error
    }
}

async function saveGag({ commit, dispatch }: Context, { data }: Payload) {
    try {
        const savedGag = await gagService.save(data)
        commit({ type: 'saveGag', savedGag })

        const user: User = authService.getLoggedinUser()
        user.gag.uploaded.push(savedGag._id)
        await dispatch({ type: 'updateUser', user })
        authService.saveLocalUser(user)
    }
    catch (err) {
        console.dir(err)
        throw Error
    }
}

async function saveComment({ commit, getters, dispatch }: Context, { commentForm }: Payload) {
    try {
        const file = await uploadImg(commentForm.file)
        const commentToSave = {
            text: commentForm.text,
            file: file ? file.url : '',
            gagId: getters.currGagId
        }
        const savedComment = await commentService.save(commentToSave)
        commit({ type: 'saveComment', savedComment })

        const user: User = authService.getLoggedinUser()
        user.comment.posted.push(savedComment._id)
        await dispatch({ type: 'updateUser', user })
        authService.saveLocalUser(user)
    }
    catch (err) {
        console.dir(err)
        throw Error
    }
}

async function changeGagRate({ commit, dispatch }: Context, { rateData }: Payload) {
    try {
        const { dir, gagId } = rateData
        const user = authService.getLoggedinUser()
        if (!user) return

        let rate = user.gag[dir]
        let diff

        const idx = rate.findIndex((i: string) => i === gagId)

        if (idx < 0) {
            rate.push(gagId)
            diff = 1
        }
        else {
            rate.splice(idx, 1)
            diff = -1
        }
        commit({ type: 'updateGagRate', rateData: { ...rateData, diff } })
        authService.saveLocalUser(user)

        await gagService.updateRate(gagId, dir, diff)
        await dispatch({ type: 'updateUser', user })
    }
    catch (err) {
        console.dir(err)
        throw Error
    }
}

async function changeCommentRate({ commit, dispatch }: Context, { rateData }: Payload) {
    try {
        const { dir, commentId } = rateData
        const user = authService.getLoggedinUser()
        if (!user) return

        let rate = user.comment[dir]
        let diff

        const idx = rate.findIndex((i: string) => i === commentId)
        console.log(idx)
        if (idx < 0) {
            rate.push(commentId)
            diff = 1
        }
        else {
            rate.splice(idx, 1)
            diff = -1
        }
        commit({ type: 'updateCommentRate', rateData: { ...rateData, diff } })
        authService.saveLocalUser(user)

        await commentService.updateRate(commentId, dir, diff)
        await dispatch({ type: 'updateUser', user })
    }
    catch (err) {
        console.dir(err)
        throw Error
    }
}