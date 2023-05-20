import type { MemeLine } from "@/models/Line.model"
import type { Meme } from "../models/Meme.model"
import { utilService } from "./util.service"
import type { Img } from "@/models/Img.model"
import { imgService } from "./img.service"
import { ref } from "vue"

const KEY = 'curr_meme'
const MEME = ref<Meme>(null!)

export const memeService = {
    MEME,
    switchLine,
    saveMeme,
    getMeme
}

async function getMeme(imgId: string) {
    let meme = loadMeme()
    if (!meme) {
        const img = await imgService.getById(imgId)
        meme = createMeme(img)
        saveMeme()
    }
    MEME.value = meme
    return meme
}

function loadMeme(): Meme {
    return utilService.loadFromSession(KEY)
}

function saveMeme() {
    utilService.saveToSession(KEY, MEME.value)
}

function switchLine() {
    if (MEME.value.currLine === MEME.value.lines.length - 1) MEME.value.currLine = 0
    else MEME.value.currLine++
    saveMeme()
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
    saveMeme()
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
            y: posY[i]
        },
    }
    return line
}
