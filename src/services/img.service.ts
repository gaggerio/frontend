import type { Img } from "../models/Img.model"
import { storageService } from "./storage.service"
import { utilService } from "./util.service"
import type { FilterBy } from '../models/FilterBy.model'
import { httpService } from './http.service'
import gImgs from '../../data/img.json'

const STORAGE_KEY = 'img_db'
const API = 'img'
const ENV = import.meta.env.VITE_ENV

export const imgService = {
    query,
    getById,
    getImgUrls,
    getImgSrc
}

async function query(filterBy: FilterBy = { txt: '' }): Promise<Img[]> {
    return ENV === 'local' ?
        await _filteredImgs(filterBy) :
        await httpService.get(API, filterBy)
}

function getById(itemId: string) {
    return ENV === 'local' ?
        storageService.get(STORAGE_KEY, itemId) :
        httpService.get(`${API}/${itemId}`)
}

async function _filteredImgs(filterBy: FilterBy) {
    let imgs: Img[] = await storageService.query(STORAGE_KEY)
    return imgs
}

function getImgUrls(): string[] {
    return gImgs.map(img => {
        return img.url
    })
}

function getImgSrc(img: Img): string {
    const proxyUrl = ENV === 'local' ?
        'http://localhost:5173/proxy' : '/proxy'
    return `${proxyUrl}/?url=${encodeURIComponent(img.url)}`
}

; (async () => {
    try {
        let imgs = await storageService.query(STORAGE_KEY) || []
        if (!imgs.length) {
            imgs = gImgs.map((img) => {
                img._id = utilService.makeId()
                return img
            })
            await storageService.postMany(STORAGE_KEY, imgs)
        }
    }
    catch (err) {
        console.log(err)
    }
})()