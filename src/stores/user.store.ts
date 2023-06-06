import { defineStore } from 'pinia'
import { authService } from '@/services/auth.service'
import { userService } from '@/services/user.service'
import type { Credentials, User } from '@/models/User.model'

export interface UserState {
    loggedinUser: User | null
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        loggedinUser: null,
    }),
    getters: {
        getLoggedinUser({ loggedinUser }: UserState) {
            return loggedinUser
        },
    },
    actions: {
        async login(credentials: Credentials) {
            try {
                const user = await authService.login(credentials)
                console.log('user', user)
                if (user) this.loggedinUser = user
            } catch (err) {
                console.dir('userStore: Error in login', err)
                throw Error
            }
        },
        async signup(credentials: Credentials) {
            try {
                const user = await authService.signup(credentials)
                if (user) this.loggedinUser = user
            } catch (err) {
                console.dir('userStore: Error in signup', err)
                throw Error
            }
        },
        async logout() {
            try {
                await authService.logout()
                this.loggedinUser = null
            } catch (err) {
                console.dir('userStore: Error in logout', err)
                throw Error
            }
        },
        async updateUser(user: User) {
            try {
                user = await userService.update(user)
                if (user) this.loggedinUser = user
            } catch (err) {
                console.dir('userStore: Error in updateUser', err)
                throw Error
            }
        },
        async loadLoggedinUser() {
            try {
                const user = authService.getLoggedinUser()
                this.loggedinUser = user ? user : authService.getGuest()
            } catch (err) {
                console.dir('userStore: Error in loadLoggedinUser', err)
                throw Error
            }
        },
        async saveLoggedinUser() {
            try {
                authService.saveLocalUser(this.loggedinUser as User)
                await this.updateUser(this.loggedinUser as User)
            } catch (err) {
                console.dir('userStore: Error in saving loggedinUser', err)
            }
        },
        async savePostedComment(commentId: string) {
            try {
                const user = this.getLoggedinUser
                if (!user) return

                user.rate.comment.posted.push(commentId)
                await this.saveLoggedinUser()
            } catch (err) {
                console.dir('userStore: Error in saving comment', err)
                throw Error
            }
        },
        async savePostedGag(gagId: string) {
            try {
                const user = this.getLoggedinUser
                if (!user) return

                user.rate.gag.uploaded.push(gagId)
                await this.saveLoggedinUser()
            } catch (err) {
                console.dir('userStore: Error in saving comment', err)
                throw Error
            }
        },
        async removeRate(gagId: string, dir: string, subject: string) {
            const user = this.getLoggedinUser
            if (!user) return

            const ratings = user.rate[subject][dir]
            const idx = ratings.findIndex((id: string) => id === gagId)
            if (idx < 0) return

            ratings.splice(idx, 1)
            this.saveLoggedinUser()
        },
        async addRate(gagId: string, dir: string, subject: string) {
            const user = this.getLoggedinUser
            if (!user) return

            user.rate[subject][dir].push(gagId)
            this.saveLoggedinUser()
        },
    },
})
