import type { Img } from "../models/Img.model"
import type { FilterBy } from '../models/FilterBy.model'
import { useStorageService } from "./storage.service"
import { utilService } from "./util.service"
import { httpService } from './http.service'
import gImgs from '../assets/data/img.json'

const STORAGE_KEY = 'img_db'
const API = 'img'

const ENV = import.meta.env.VITE_ENV
const storageService = useStorageService<Img>()

export const imgService = {
    query,
    getById,
    getRandomImg,
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

function getRandomImg() {
    const imgs: Img[] = utilService.loadFromStorage(STORAGE_KEY) || []
    return imgs[utilService.getRandomIntInc(0, imgs.length - 1)]
}

function getImgSrc(img: Img): string {
    const proxyUrl = ENV === 'local' ?
        'http://localhost:5173/proxy' : '/proxy'
    return `${proxyUrl}/?url=${encodeURIComponent(img.url)}`
}

; (() => {
    if (ENV !== 'local') return
    let imgs = utilService.loadFromStorage(STORAGE_KEY) || []
    if (imgs.length) return

    imgs = gImgs.map((img) => {
        img._id = utilService.makeId()
        return img
    })
    utilService.saveToStorage(STORAGE_KEY, imgs)
    console.log(JSON.stringify(imgs))
})()