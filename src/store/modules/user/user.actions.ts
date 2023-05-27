import { ActionContext } from "vuex"
import { userService } from "../../../services/user.service"
import { authService } from '../../../services/auth.service'
import type { RootState } from '../../index'
import type { UserState } from "./user.store"
import type { Credentials, User } from "../../../models/User.model"

export const userActions = {
    login,
    signup,
    logout,
    updateUser,
    loadLoggedinUser,
}

export interface Payload {
    user: User
    credentials: Credentials
}

type Context = ActionContext<UserState, RootState>

async function login({ commit }: Context, { credentials }: Payload) {
    try {
        const user = await authService.login(credentials)
        commit({ type: 'setLoggedinUser', user })
        return user
    } catch (err) {
        console.log('userStore: Error in login', err)
        throw Error
    }
}

async function signup({ commit }: Context, { credentials }: Payload) {
    try {
        const user = await authService.signup(credentials)
        commit({ type: 'setLoggedinUser', user })
        return user
    } catch (err) {
        console.dir('userStore: Error in signup', err)
        throw Error
    }
}

async function logout({ commit }: Context) {
    try {
        await authService.logout()
        commit({ type: 'setLoggedinUser', user: null })
    } catch (err) {
        console.dir('userStore: Error in logout', err)
        throw Error
    }
}

async function updateUser({ commit }: Context, { user }: Payload) {
    try {
        user = await userService.update(user)
        commit({ type: 'setLoggedinUser', user })
    } catch (err) {
        console.dir('userStore: Error in updateUser', err)
        throw Error
    }
}

function loadLoggedinUser({ commit }: Context) {
    try {
        console.log('loading user')
        const user = authService.getLoggedinUser()
        if (user) commit({ type: 'setLoggedinUser', user })
    }
    catch (err) {
        console.dir(err)
        throw Error
    }
}