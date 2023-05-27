import type { User } from "../../../models/User.model"
import type { Payload } from "./user.actions"
import { userActions } from './user.actions'

export interface UserState {
    loggedinUser: User | null
}

export const userStore = {
    state: {
        loggedinUser: null,
    },
    getters: {
        loggedinUser({ loggedinUser }: UserState) {
            return loggedinUser
        },
    },
    mutations: {
        setLoggedinUser(state: UserState, { user }: Payload) {
            state.loggedinUser = user
        },
    },
    actions: userActions
}