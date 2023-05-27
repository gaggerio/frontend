import type { Gag } from "../../../models/Gag.model"
import type { Payload } from './gag.actions'
import { gagActions } from "./gag.actions"

export interface GagState {
    gags: Gag[],
    currGagId: string
}

export const gagStore = {
    state: {
        gags: null!,
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
        },
        updateRate({ gags }: GagState, { rateData }: Payload) {
            const { gagId, dir, diff } = rateData
            const gag = gags.find((g: Gag) => g._id === gagId)
            if (gag) gag.rate[dir] += diff
        }
    },
    actions: gagActions
}