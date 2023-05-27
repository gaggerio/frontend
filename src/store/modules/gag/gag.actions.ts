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


export const gagActions = {
    loadGags,
    saveGag,
    saveComment,
    changeRate,
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

async function saveGag({ commit }: Context, { data }: Payload) {
    try {
        const savedGag = await gagService.save(data)
        commit({ type: 'saveGag', savedGag })
    }
    catch (err) {
        console.dir(err)
        throw Error
    }
}

async function saveComment({ commit, getters }: Context, { commentForm }: Payload) {
    try {
        const file = await uploadImg(commentForm.file)
        const commentToSave = {
            text: commentForm.text,
            file: file ? file.url : '',
            gagId: getters.currGagId
        }
        const savedComment = await commentService.save(commentToSave)
        commit({ type: 'saveComment', savedComment })
    }
    catch (err) {
        console.dir(err)
        throw Error
    }
}

async function changeRate({ commit, dispatch }: Context, { rateData }: Payload) {
    try {
        const { gagId, dir } = rateData
        const user = authService.getLoggedinUser()
        if (!user) return

        let ratedGags = user.gag[dir]
        let diff

        const idx = ratedGags.findIndex((i: string) => i === gagId)

        if (idx < 0) {
            ratedGags.push(gagId)
            diff = 1
        }
        else {
            ratedGags.splice(idx, 1)
            diff = -1
        }
        commit({ type: 'updateRate', rateData: { ...rateData, diff } })
        authService.saveLocalUser(user)

        await gagService.updateRate(gagId, dir, diff)
        await dispatch({ type: 'updateUser', user })
    }
    catch (err) {
        console.dir(err)
        throw Error
    }
}