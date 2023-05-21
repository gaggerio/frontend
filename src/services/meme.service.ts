import type { MemeLine } from "@/models/Line.model"
import type { Meme } from "../models/Meme.model"
import { utilService } from "./util.service"
import type { Img } from "@/models/Img.model"
import { imgService } from "./img.service"

const KEY = 'curr_meme'

export const memeService = {
    save,
    getMeme,
    createLine,
    clear,
    createMeme
}

async function getMeme(imgId: string) {
    let meme = load()
    if (!meme) {
        const img = await imgService.getById(imgId)
        meme = createMeme(img)
        save(meme)
    }
    return meme
}

function load(): Meme {
    return utilService.loadFromSession(KEY)
}

function save(meme: Meme) {
    utilService.saveToSession(KEY, meme)
}

function clear() {
    utilService.saveToSession(KEY, null)
}


function createMeme(img: Img): Meme {
    const meme: Meme = {
        _id: utilService.makeId(),
        outLineColor: '#7c7c7c',
        lines: [],
        currLine: 0,
        imgUrl: img.url,
        width: 500,
        height: 500,
        arcPos: { x: 0, y: 0 }
    }
    meme.lines = [
        createLine(meme, 0),
        createLine(meme, 1)
    ]
    return meme
}

function createLine({ width, height }: Meme, i: number): MemeLine {
    const posY = {
        0: height * 0.03,
        1: height * 0.83,
        2: height * 0.4
    }
    const line: MemeLine = {
        _id: utilService.makeId(),
        txt: 'Your Text',
        fontSize: 50,
        textAlign: 'center',
        strokeStyle: '#000000',
        fillStyle: '#ffffff',
        font: `Impact`,
        isDrag: false,
        textBaseline: 'top',
        lineWidth: 50 / 15,
        pos: {
            x: width / 2,
            y: i > 2 ? posY[2] : posY[i]
        },
    }
    return line
}
