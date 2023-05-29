import type { FilterBy } from "../models/FilterBy.model"
import type { Gag } from "../models/Gag.model"
import { httpService } from "./http.service"
import { storageService } from "./storage.service"
import { userService } from "./user.service"
import { utilService } from "./util.service"
import gGags from '../../data/gag.json'
import { imgService } from "./img.service"
import { commentService } from "./comment.service"
import type { Comment } from "@/models/Comment.model"
import { authService } from "./auth.service"

const STORAGE_KEY = 'gag_db'
const API = 'gag'
const ENV = import.meta.env.VITE_ENV

type Data = { imgUrl: string, title: string }

export const gagService = {
    query,
    getById,
    save,
    update,
    updateRate
}

function query(filterBy: FilterBy) {
    return ENV === 'local' ?
        _filteredGags(filterBy) :
        httpService.get(API, filterBy)
}

function getById(gagId: string) {
    return ENV === 'local' ?
        storageService.get(STORAGE_KEY, gagId) :
        httpService.get(`${API}/${gagId}`)
}

function save(data: Data) {
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

async function _filteredGags(filterBy: FilterBy) {
    let gags: Gag[] = await storageService.query(STORAGE_KEY)
    return gags
}

function _createGag({ title, imgUrl }: Data) {
    const gag = {
        title,
        createdAt: Date.now(),
        createdBy: authService.getLoggedinUser(),
        imgUrl,
        rate: {
            up: [],
            down: []
        },
        comments: [],
    }
    return storageService.post(STORAGE_KEY, gag)
}

function _createRandomGags() {
    const gags = []
    const comments = []
    for (let i = 0; i < 25; i++) {
        const [gag, c] = _createRandomGag()
        gags.push(gag)
        comments.push(...c)
    }
    console.log(JSON.stringify(gags))
    console.log(JSON.stringify(comments))
}

function _createRandomGag() {
    const id = utilService.makeId()
    const img = imgService.getRandomImg().url
    const comments = commentService.getRandomComments(id)
    const { _id, username, imgUrl } = userService.getRandomUser()
    const gag = {
        _id: id,
        title: utilService.getLorem().slice(0, 30),
        createdAt: Date.now(),
        createdBy: { _id, username, imgUrl },
        imgUrl: img,
        comments: comments.map(c => c._id),
        rate: {
            up: userService.getRandomUserIds(),
            down: userService.getRandomUserIds()
        },
    }
    return [gag, comments]
}

; (() => {
    // _createRandomGags()
    if (ENV !== 'local') return
    let gags = utilService.loadFromStorage(STORAGE_KEY)
    if (!gags || !gags.length) {
        gags = gGags
        utilService.saveToStorage(STORAGE_KEY, gags)
    }
})()