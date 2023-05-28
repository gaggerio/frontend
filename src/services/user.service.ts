import { utilService } from './util.service'
import { storageService } from './storage.service'
import { httpService } from './http.service'
import type { Credentials, User } from '../models/User.model'
import gUsers from '../../data/user.json'

const STORAGE_KEY = 'user_db'
const ENV = import.meta.env.VITE_ENV
const API = 'user'

export const userService = {
    query,
    update,
    save,
    getRandomUser,
    createUser,
    getRandomUserIds
}

async function query() {
    return storageService.query(STORAGE_KEY)
}

async function save(user: User) {
    return ENV === 'local' ?
        await storageService.post(STORAGE_KEY, user) :
        await httpService.post(`${API}`, user)
}

async function update(user: User) {
    return ENV === 'local' ?
        await storageService.put(STORAGE_KEY, user) :
        await httpService.put(`${API}/${user._id}`, user)
}

function getRandomUser(): User {
    const users = utilService.loadFromStorage(STORAGE_KEY)
    return users[utilService.getRandomIntInc(0, users.length - 1)]
}

function defaultProfilePic() {
    return 'https://res.cloudinary.com/dokgseqgj/image/upload/v1684759113/user_xbka0l.png'
}

function createUser({ username, fullname, imgUrl }: Credentials): User {
    return {
        _id: utilService.makeId(),
        username,
        fullname,
        imgUrl: imgUrl ? imgUrl : defaultProfilePic(),
        gag: {
            up: [],
            down: [],
            uploaded: []
        },
        comment: {
            up: [],
            down: [],
            posted: []
        }
    }
}

function _createUsers() {
    const names = utilService.getRandomNames()
    const users = names.map(user => {
        return _createRandomUser(user)
    })
    console.log(JSON.stringify(users))
}

function getRandomUserIds() {
    const ids = []

    for (let i = 0; i < utilService.getRandomIntInc(0, 50); i++) {
        const user = gUsers[utilService.getRandomIntInc(0, gUsers.length - 1)]
        ids.push(user._id)
    }
    return ids
}

function _createRandomUser(fullname: string): User {
    return {
        _id: utilService.makeId(),
        username: utilService.getRandomUsername(),
        fullname,
        imgUrl: defaultProfilePic(),
        gag: {
            up: [],
            down: [],
            uploaded: []
        },
        comment: {
            up: [],
            down: [],
            posted: []
        }
    }
}

; (() => {
    // _createUsers()
    if (ENV !== 'local') return
    let users = utilService.loadFromStorage(STORAGE_KEY)
    if (!users || !users.length) {
        utilService.saveToStorage(STORAGE_KEY, gUsers)
    }
})()