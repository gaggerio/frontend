import { ActionContext } from "vuex"
import type { FilterBy } from "../../models/FilterBy.model"
import type { Gag } from "../../models/Gag.model"
import { gagService } from "../../services/gag.service"
import type { RootState } from '../index'

export interface GagState {
    gags: Gag[] | null
}

interface Payload {
    gags: Gag[]
    savedGag: Gag
    gag: Gag
    gagId: string
    filterBy: FilterBy
    data: {
        imgUrl: string
        title: string
    }
}

type Context = ActionContext<GagState, RootState>

export const gagStore = {
    state: {
        gags: null
    },
    getters: {
        getGags({ gags }: GagState) {
            return gags
        }
    },
    mutations: {
        setGags(state: GagState, { gags }: Payload) {
            state.gags = gags
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
        async removeGag({ commit }: Context, { gagId }: Payload) {
            try {
                await gagService.remove(gagId)
                commit({ type: 'removeGag', gagId })
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
        }

    }
}