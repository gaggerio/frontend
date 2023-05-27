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

const STORAGE_KEY = 'gag_db'
const API = 'gag'
const ENV = import.meta.env.VITE_ENV

type Data = { imgUrl: string, title: string }

export const gagService = {
    query,
    getById,
    save,
    getRandomGag,
}

async function query(filterBy: FilterBy) {
    return ENV === 'local' ?
        await _filteredGags(filterBy) :
        await httpService.get(API, filterBy)
}

function getById(gagId: string) {
    return ENV === 'local' ?
        storageService.get(STORAGE_KEY, gagId) :
        httpService.get(`${API}/${gagId}`)
}

function save(data: Data) {
    return ENV === 'local' ?
        _createGag(data) :
        httpService.get(API, data)
}

function getRandomGag() {
    const imgs = imgService.getImgUrls()
    const _id = utilService.makeId()
    const comments: Comment[] = []
    for (let i = 0; i < utilService.getRandomIntInc(0, 25); i++) {
        const comment = commentService.getRandomComment(_id)
        comments.push(comment)
    }
    const gag = {
        _id,
        title: utilService.getLorem().slice(0, 80),
        createdAt: Date.now(),
        createdBy: userService.getEmptyUser(),
        imgUrl: imgs[utilService.getRandomIntInc(0, imgs.length - 1)],
        comments,
        rate: {
            dislike: utilService.getRandomIntInc(0, 50),
            like: utilService.getRandomIntInc(0, 110)
        },
    }
    return [gag, comments]
}

async function _filteredGags(filterBy: FilterBy) {
    let gags: Gag[] = await storageService.query(STORAGE_KEY)
    let comments: Comment[] = await commentService.query()

    gags = aggregate(gags, comments)
    return gags
}

function aggregate(gags: Gag[], comments: Comment[]): Gag[] {
    return gags.map(gag => {
        gag.comments = comments.filter(c => c.gagId === gag._id)
        return gag
    })
}

function _createGag({ title, imgUrl }: Data) {
    const gag = {
        title,
        createdAt: Date.now(),
        createdBy: userService.getEmptyUser(),
        imgUrl,
        rate: {
            dislike: 0,
            like: 0
        },
        comments: [],
    }
    return storageService.post(STORAGE_KEY, gag)
}

; (() => {
    // const gags: Gag[] = []
    // const allComments = []
    // for (let i = 0; i < 25; i++) {
    //     const [gag, comments] = getRandomGag()
    //     gags.push(gag)
    //     allComments.push(...comments)

    // }
    // console.log(JSON.stringify(gags))
    // console.log(JSON.stringify(allComments))
    if (ENV !== 'local') return
    let gags = utilService.loadFromStorage(STORAGE_KEY)
    if (!gags || !gags.length) {
        gags = gGags
        utilService.saveToStorage(STORAGE_KEY, gags)
    }
})()