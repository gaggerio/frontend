import type { FilterBy } from "../models/FilterBy.model"
import type { Gag, Comment } from "../models/Gag.model"
import { httpService } from "./http.service"
import { storageService } from "./storage.service"
import { userService } from "./user.service"
import { utilService } from "./util.service"
import gGags from '../../data/gag.json'
import { imgService } from "./img.service"

const GAG_KEY = 'gag_db'
const API = 'gag'
const ENV = import.meta.env.VITE_ENV

export const gagService = {
    query,
    getById,
    save,
    remove,
    getEmptyGag
}

async function query(filterBy: FilterBy) {
    return ENV === 'local' ?
        await _filteredGags(filterBy) :
        await httpService.get(API, filterBy)
}

function getById(gagId: string) {
    return ENV === 'local' ?
        storageService.get(GAG_KEY, gagId) :
        httpService.get(`${API}/${gagId}`)
}

function save(gagToSave: Gag) {
    const method = gagToSave._id ? 'put' : 'post'

    return ENV === 'local' ?
        storageService[method](GAG_KEY, gagToSave) :
        httpService[method](API, gagToSave)
}

function remove(gagId: string) {
    return ENV === 'local' ?
        storageService.remove(GAG_KEY, gagId) :
        httpService.delete(`${API}/${gagId}`)
}

function getEmptyGag(): Gag {
    const imgs = imgService.getImgUrls()
    const comments: Comment[] = []
    for (let i = 0; i < utilService.getRandomIntInc(0, 10); i++) {
        comments.push(
            getEmptyComment()
        )
    }
    return {
        _id: utilService.makeId(),
        title: utilService.getLorem().slice(0, 80),
        createdAt: Date.now(),
        createdBy: userService.getEmptyUser(),
        imgUrl: imgs[utilService.getRandomIntInc(0, imgs.length - 1)],
        rate: {
            dislike: utilService.getRandomIntInc(0, 50),
            like: utilService.getRandomIntInc(0, 110)
        },
        comments: comments,
    }
}

function getEmptyComment(): Comment {
    const chance = Math.random()
    const imgs = imgService.getImgUrls()
    return {
        _id: utilService.makeId(),
        createBy: userService.getEmptyUser(),
        createAt: Date.now(),
        text: utilService.getLorem(),
        attachments: chance > 0.5 ? imgs[utilService.getRandomIntInc(0, imgs.length - 1)] : '',
        rate: {
            dislike: utilService.getRandomIntInc(0, 50),
            like: utilService.getRandomIntInc(0, 110)
        },
    }
}

async function _filteredGags(filterBy: FilterBy) {
    let gags: Gag[] = await storageService.query(GAG_KEY)
    // if (!filterBy) return gags

    // gags = gags.filter(gag => {
    //     const regex = new RegExp(filterBy.txt, 'i')
    //     if (!regex.test(gag.name)) return false
    //     else return gag
    // })
    return gags
}

function _createGag(name: string) {
    return {
        _id: utilService.makeId(),
        name: name,
        price: utilService.getRandomIntInc(10, 100),
        imgUrl: utilService.getIcon(name)
    }
}

; (() => {
    if (ENV !== 'local') return
    let gags = utilService.loadFromStorage(GAG_KEY)
    if (!gags || !gags.length) {
        gags = gGags
        utilService.saveToStorage(GAG_KEY, gags)
    }
})()