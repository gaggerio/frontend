import type { FilterBy } from '../models/FilterBy.model'
import type { Gag } from '../models/Gag.model'
import { useHttpService } from './http.service'
import { useStorageService } from './storage.service'
import { userService } from './user.service'
import { utilService } from './util.service'
import { imgService } from './img.service'
import { authService } from './auth.service'
import { commentService } from './comment.service'

const STORAGE_KEY = 'gag_db'
const API = 'gag'
const ENV = import.meta.env.VITE_ENV

const storageService = useStorageService<Gag>()
const httpService = useHttpService<Gag>()

export const gagService = {
    query,
    getById,
    save,
    update,
    updateRate
}

function query(filterBy: FilterBy) {
    return ENV === 'local' ?
        _filteredGags() :
        httpService.query(API, filterBy)
}

function getById(gagId: string) {
    return ENV === 'local' ?
        storageService.get(STORAGE_KEY, gagId) :
        httpService.get(`${API}/${gagId}`)
}

function save(data: { imgUrl: string, title: string }) {
    return ENV === 'local' ?
        _createGag(data) :
        httpService.post(API, data)
}

function update(gag: Gag) {
    return ENV === 'local' ?
        storageService.put(STORAGE_KEY, gag) :
        httpService.put(API, gag)
}

function updateRate(gagId: string, dir: string, diff: number) {
    return ENV === 'local' ?
        _updateRate(gagId, dir, diff) :
        httpService.post(`${API}/rate`, { gagId, dir, diff })
}

async function _updateRate(gagId: string, dir: string, diff: number) {
    const gag = await getById(gagId)
    gag.rate[dir] += diff
    return update(gag)
}

async function _filteredGags() {
    return await storageService.query(STORAGE_KEY)
}

function _createGag({ title, imgUrl }: { imgUrl: string, title: string }) {
    const gag: Gag = {
        _id: '',
        title,
        createdAt: Date.now(),
        createdBy: authService.getLoggedinUser(),
        imgUrl,
        rate: {
            up: [],
            down: []
        },
        comments: [],
        gags: []
    }
    return storageService.post(STORAGE_KEY, gag)
}

function _createRandomGags() {
    const gags = []
    for (let i = 0; i < 25; i++) {
        const gag = _createRandomGag()
        gags.push(gag)
    }
    return gags
}

function _createRandomGag() {
    const { url } = imgService.getRandomImg()
    const { _id, username, imgUrl } = userService.getRandomUser()
    const gag: Gag = {
        _id: utilService.makeId(),
        title: utilService.getLorem().slice(0, 30),
        createdAt: Date.now(),
        createdBy: { _id, username, imgUrl },
        imgUrl: url,
        comments: [],
        rate: {
            up: userService.getRandomUserIds(),
            down: userService.getRandomUserIds()
        },
        gags: []
    }
    return gag
}

(() => {
    if (ENV !== 'local') return
    let gags = utilService.loadFromStorage<Gag>(STORAGE_KEY)
    if (gags) return

    gags = _createRandomGags()
    gags.forEach(g => commentService.createRandomComments(g._id))
    utilService.saveToStorage(STORAGE_KEY, gags)
    console.log(JSON.stringify(gags))
    console.log(JSON.stringify(utilService.loadFromStorage('comment_db')))
})()