import { useHttpService } from './http.service'
import { userService } from './user.service'
import type { Credentials, User } from '../models/User.model'

const STORAGE_KEY = 'loggedinUser'
const API = 'auth'

const ENV = import.meta.env.VITE_ENV
const httpService = useHttpService<Credentials | User>()

export const authService = {
    login,
    logout,
    signup,
    saveLocalUser,
    getLoggedinUser,
    getGuest
}

async function login(credentials: Credentials) {
    const user = ENV === 'local' ?
        await _login(credentials) :
        await httpService.post(`${API}/login`, credentials)

    return (user) ? saveLocalUser(user as User) : null
}

async function signup(credentials: Credentials) {
    const user = ENV === 'local' ?
        await _signup(credentials) :
        await await httpService.post(`${API}/signup`, credentials)

    return saveLocalUser(user)
}

async function logout() {
    return ENV === 'local' ?
        sessionStorage.removeItem(STORAGE_KEY) :
        await httpService.post(`${API}/logout`, null)
}

function saveLocalUser(user: User) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    const user = sessionStorage.getItem(STORAGE_KEY) || 'null'
    return JSON.parse(user)
}

function getGuest() {
    const user = userService.createRandomUser('Guest')
    return saveLocalUser(user)
}

async function _signup(credentials: Credentials) {
    const user = userService.createUser(credentials)
    return userService.save(user)
}

async function _login(credentials: Credentials) {
    const users = await userService.query()
    const user = users.find((user: User) =>
        user.username === credentials.username
    )
    if (user) return user
    else throw new Error('Wrong credentials')
}