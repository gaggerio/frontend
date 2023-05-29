import { httpService } from './http.service'
import { userService } from './user.service'
import type { Credentials, User } from '../models/User.model'

const STORAGE_KEY = 'loggedinUser'
const API = 'auth'
const ENV = import.meta.env.VITE_ENV

/**
The ‘authService’ is a service that handles authentication and user management. 
It provides functionality for user login, logout, signup, and local user storage. 
The behavior of the authService is determined by the ENV variable, 
which specifies the environment in which the service is running. 
This variable influences whether the service interacts with local storage or 
communicates with a remote server.
@module
 */
export const authService = {
    login,
    logout,
    signup,
    saveLocalUser,
    getLoggedinUser,
    getGuest
}

/**
  * Logs in a user with the given credentials.
  * @param {Credentials} credentials - The user's credentials.
  * @returns {Promise<User|null>} A promise that resolves to the logged-in user if successful, or null otherwise.
  */
async function login(credentials: Credentials) {
    const user = ENV === 'local' ?
        await _login(credentials) :
        await httpService.post(`${API}/login`, credentials)

    return (user) ? saveLocalUser(user) : null
}

/**
  * Signs up a new user with the given credentials.
  * @param {Credentials} credentials - The user's credentials.
  * @returns {Promise<User>} A promise that resolves to the newly signed-up user.
  */
async function signup(credentials: Credentials) {
    const user = ENV === 'local' ?
        await _signup(credentials) :
        await await httpService.post(`${API}/signup`, credentials)

    return saveLocalUser(user)
}

/**
  * Logs out the current user.
  * @returns {Promise<void>} A promise that resolves when the user is logged out.
  */
async function logout() {
    return ENV === 'local' ?
        sessionStorage.removeItem(STORAGE_KEY) :
        await httpService.post(`${API}/logout`)
}

/**
 * Saves the given user object to the local storage.
 * @param {User} user - The user object to be saved
 * @returns {User} The saved user object.
 */
function saveLocalUser(user: User) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    return user
}

/**
 * Retrieves the currently logged-in user from the local storage.
 * @returns {User|null} The logged-in user object, or null if no user is logged in.
 */
function getLoggedinUser() {
    const user = sessionStorage.getItem(STORAGE_KEY) || 'null'
    return JSON.parse(user)
}

function getGuest() {
    const user = userService.createRandomUser('Guest')
    return saveLocalUser(user)
}

/**
 * Signs up a new user with the given credentials.
 * @private
 * @param {Credentials} credentials - The user's credentials.
 * @returns {Promise<User>} A promise that resolves to the newly signed-up user.
 */
async function _signup(credentials: Credentials) {
    const user = userService.createUser(credentials)
    return userService.save(user)
}

/**
 * Logs in a user with the given credentials.
 * @private
 * @param {Credentials} credentials - The user's credentials.
 * @returns {Promise<User>} A promise that resolves to the logged-in user.
 * @throws {Error} If the credentials are invalid.
 */
async function _login(credentials: Credentials) {
    const users = await userService.query()
    const user = users.find((user: User) =>
        user.username === credentials.username
    )
    if (user) return user
    else throw new Error('Wrong credentials')
}