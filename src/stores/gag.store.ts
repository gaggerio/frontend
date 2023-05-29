import { defineStore } from 'pinia'
import { gagService } from '@/services/gag.service'
import { useUserStore } from '@/stores/user.store'
import type { Gag } from '@/models/Gag.model'
import type { FilterBy } from '@/models/FilterBy.model'
import type { RateData } from '@/models/Rate.model'
import type { User } from '@/models/User.model'

export interface GagState {
    gags: Gag[],
    currGagId: string
}

export const useGagStore = defineStore('gag', {
    state: (): GagState => ({
        gags: null!,
        currGagId: ''
    }),
    getters: {
        getGags({ gags }: GagState) {
            return gags
        },
        getCurrGagId({ currGagId }: GagState) {
            return currGagId
        },
        getCurrGag({ gags, currGagId }: GagState) {
            if (!gags) return null
            const gag = gags.find(gag => gag._id === currGagId)
            return gag ? gag : null
        },
        getGagById({ gags }) {
            return (id: string) => gags.find(g => g._id === id)
        },
        userStore() {
            const userStore = useUserStore()
            return userStore
        }
    },
    actions: {
        setCurrGagId(gagId: string) {
            this.currGagId = gagId
        },
        async loadGags(filterBy: FilterBy) {
            try {
                const gags = await gagService.query(filterBy)
                if (gags) this.gags = gags
            }
            catch (err) {
                console.dir('gagStore: Failed to load gags', err)
                throw Error
            }
        },
        async saveGag(data: { imgUrl: string, title: string }) {
            try {
                const savedGag = await gagService.save(data)
                this.gags.unshift(savedGag)
                await this.userStore.savePostedGag(savedGag._id)
            }
            catch (err) {
                console.dir('gagStore: Failed to save gag', err)
                throw Error
            }
        },
        async changeGagRate(rateData: RateData) {
            try {
                const { gagId, dir } = rateData
                const gag = this.getGagById(gagId)
                if (!gag) return

                const user = this.userStore.loggedinUser
                if (!user) return

                const isUpvoted = gag.rate.up.includes(user._id)
                const isDownvoted = gag.rate.down.includes(user._id)

                switch (dir) {
                    case 'up':
                        this.toggleRate(gag, user, rateData)
                        if (isDownvoted) this.toggleRate(gag, user, { dir: 'down', gagId })
                        break;
                    case 'down':
                        this.toggleRate(gag, user, rateData)
                        if (isUpvoted) this.toggleRate(gag, user, { dir: 'up', gagId })
                        break;
                }
                await gagService.update(gag)
            }
            catch (err) {
                console.dir('gagStore: Failed to rate gag', err)
                throw Error
            }
        },
        toggleRate(gag: Gag, user: User, { dir, gagId }: RateData) {
            const subject = 'gag'
            let rate = gag.rate[dir]

            if (rate.includes(user._id)) {
                const idx = rate.findIndex((id: string) => id === user._id)
                rate.splice(idx, 1)
                this.userStore.removeRate(gagId, dir, subject)
            }
            else {
                rate.push(user._id)
                this.userStore.addRate(gagId, dir, subject)
            }
        },
    }
})