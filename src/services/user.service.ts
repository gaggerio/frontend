import type { Credentials, User } from '../models/User.model'
import { utilService } from './util.service'
import { useStorageService } from './storage.service'
import { useHttpService } from './http.service'
import gUsers from '../assets/data/user.json'

const STORAGE_KEY = 'user_db'
const API = 'user'
const ENV = import.meta.env.VITE_ENV

const storageService = useStorageService<User>()
const httpService = useHttpService<User>()

export const userService = {
    query,
    update,
    save,
    getRandomUser,
    createUser,
    getRandomUserIds,
    createRandomUser,
}

async function query() {
    return storageService.query(STORAGE_KEY)
}

async function save(user: User) {
    return ENV === 'local'
        ? await storageService.post(STORAGE_KEY, user)
        : await httpService.post(`${API}`, user)
}

async function update(user: User) {
    return ENV === 'local'
        ? await storageService.put(STORAGE_KEY, user)
        : await httpService.put(`${API}/${user._id}`, user)
}

function getRandomUser(): User {
    const users: User[] = utilService.loadFromStorage(STORAGE_KEY) || []
    return users[utilService.getRandomIntInc(0, users.length - 1)]
}

function defaultProfilePic() {
    return 'https://res.cloudinary.com/dokgseqgj/image/upload/v1685341751/user_wyvr3v.png'
}

function createUser({ username, fullname, imgUrl }: Credentials): User {
    return {
        _id: utilService.makeId(),
        username,
        fullname,
        imgUrl: imgUrl ? imgUrl : defaultProfilePic(),
        rate: {
            gag: {
                up: [],
                down: [],
                uploaded: [],
            },
            comment: {
                up: [],
                down: [],
                posted: [],
            },
        },
    }
}

// function _createUsers() {
//     const names = utilService.getRandomNames()
//     const users = names.map(user => {
//         return createRandomUser(user)
//     })
//     console.log(JSON.stringify(users))
// }

function getRandomUserIds() {
    const ids = []
    const users: User[] = utilService.loadFromStorage(STORAGE_KEY) || []
    for (let i = 0; i < utilService.getRandomIntInc(0, 50); i++) {
        const user = users[utilService.getRandomIntInc(0, users.length - 1)]
        ids.push(user._id)
    }
    return ids
}

function createRandomUser(fullname: string): User {
    return {
        _id: utilService.makeId(),
        username: utilService.getRandomUsername(),
        fullname,
        imgUrl: `https://robohash.org/${fullname}`,
        rate: {
            gag: {
                up: [],
                down: [],
                uploaded: [],
            },
            comment: {
                up: [],
                down: [],
                posted: [],
            },
        },
    }
}

;(() => {
    if (ENV !== 'local') return
    let users = utilService.loadFromStorage(STORAGE_KEY) || []
    if (users.length) return

    users = gUsers
    utilService.saveToStorage(STORAGE_KEY, users)
    console.log(JSON.stringify(users))
})()
