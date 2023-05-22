import type { MemeLine, Pos } from "@/models/Line.model"
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
    createMeme,
    caclLinePos,
    calcOutlinePos,
    getMousePos
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
        img,
    }
    meme.lines = [
        createLine(),
        createLine()
    ]
    return meme
}

function createLine(): MemeLine {
    return {
        _id: utilService.makeId(),
        txt: 'Your Text',
        fontSize: 0,
        textAlign: 'center',
        strokeStyle: '#000000',
        fillStyle: '#ffffff',
        font: `Impact`,
        textBaseline: 'top',
        pos: {
            x: 0,
            y: 0
        },
    }
}

function caclLinePos(width: number, height: number, i: number) {
    type PosY = { [idx: number]: number }
    const posY: PosY = {
        0: height * 0.03,
        1: height * 0.83,
        2: height * 0.4
    }
    return {
        x: width / 2,
        y: posY[i]
    }
}

function calcOutlinePos(line: MemeLine, textWidth: number) {
    return {
        x: line.pos.x - (textWidth / 2) - 10,
        y: line.pos.y - 5
    }
}

function getMousePos(ev: any) {
    const { offsetLeft, clientLeft, offsetTop, clientTop } = ev.target
    return {
        x: ev.pageX - offsetLeft - clientLeft,
        y: ev.pageY - offsetTop - clientTop,
    }
}