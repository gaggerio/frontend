import type { RootState } from '../index'
import type { ActionContext } from "vuex"
import type { FilterBy } from "../../models/FilterBy.model"
import type { Gag } from "../../models/Gag.model"
import { gagService } from "../../services/gag.service"
import { commentService } from '@/services/comment.service'
import type { Comment, CommentForm } from '@/models/Comment.model'

export interface GagState {
    gags: Gag[] | null,
    currGagId: string
}

interface Payload {
    type: string
    gags: Gag[]
    savedGag: Gag
    gag: Gag
    gagId: string
    filterBy: FilterBy
    data: {
        imgUrl: string
        title: string
    },
    commentForm: CommentForm,
    savedComment: Comment
}

type Context = ActionContext<GagState, RootState>

export const gagStore = {
    state: {
        gags: null,
        currGagId: ''
    },
    getters: {
        gags({ gags }: GagState) {
            return gags
        },
        currGagId({ currGagId }: GagState) {
            return currGagId
        },
        currGag({ gags, currGagId }: GagState) {
            if (!gags) return null
            return gags.find(gag => gag._id === currGagId)
        }
    },
    mutations: {
        setGags(state: GagState, { gags }: Payload) {
            state.gags = gags
        },
        setCurrGagId(state: GagState, { gagId }: Payload) {
            state.currGagId = gagId
        },
        removeGag({ gags }: GagState, { gagId }: Payload) {
            if (!gags) return
            const idx = gags.findIndex(gag => gag._id === gagId)
            if (idx >= 0) gags.splice(idx, 1)
        },
        saveGag({ gags }: GagState, { savedGag }: Payload) {
            if (!gags) return
            gags.unshift(savedGag)
        },
        updateGag({ gags }: GagState, { savedGag }: Payload) {
            if (!gags) return
            const idx = gags.findIndex(i => i._id === savedGag._id)
            if (idx >= 0) gags.splice(idx, 1, savedGag)
        },
        saveComment({ gags, currGagId }: GagState, { savedComment }: Payload) {
            const gag = gags?.find(g => g._id === currGagId)
            if (gag) gag.comments.unshift(savedComment)
        }
    },
    actions: {
        async loadGags({ commit }: Context, { filterBy }: Payload) {
            try {
                const gags = await gagService.query(filterBy)
                if (gags) commit({ type: 'setGags', gags })
            }
            catch (err) {
                console.dir(err)
                throw Error
            }
        },
        async saveGag({ commit }: Context, { data }: Payload) {
            try {
                const savedGag = await gagService.save(data)
                commit({ type: 'saveGag', savedGag })
            }
            catch (err) {
                console.dir(err)
                throw Error
            }
        },
        async saveComment({ commit }: Context, { commentForm }: Payload) {
            try {
                const savedComment = await commentService.save(commentForm)
                commit({ type: 'saveComment', savedComment })
            }
            catch (err) {
                console.dir(err)
                throw Error
            }
        },
        setCurrGagId({ commit }: Context, payload: Payload) {
            commit(payload)
        }
    }
}