import type { Line, Pos } from "@/models/Line.model"
import type { Meme } from "../models/Meme.model"
import type { Img } from "@/models/Img.model"
import { utilService } from "./util.service"
import { imgService } from "./img.service"

const KEY = 'curr_meme'

export const memeService = {
    save,
    getMeme,
    createLine,
    clear,
    createMeme,
    calcLinePos,
    calcOutlinePos,
    getMousePos,
    calcFontSize
}

async function getMeme(imgId: string): Promise<Meme> {
    let meme = load()
    if (!meme) {
        const img = await imgService.getById(imgId)
        meme = createMeme(img)
        save(meme)
    }
    return meme
}

function load(): Meme | null {
    return utilService.loadFromSession(KEY)
}

function save(meme: Meme): void {
    utilService.saveToSession(KEY, meme)
}

function clear(): void {
    utilService.saveToSession(KEY, null)
}

function createMeme(img: Img): Meme {
    const meme: Meme = {
        _id: utilService.makeId(),
        outLineColor: '#fff',
        lines: [],
        currLine: 0,
        img,
    }
    meme.lines = [createLine(), createLine()]
    return meme
}

function createLine(): Line {
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
            y: 0,
        },
    }
}

function calcLinePos(width: number, height: number, i: number): Pos {
    const posY: { [idx: number]: number } = {
        0: height * 0.03,
        1: height * 0.83,
        2: height * 0.4,
    }
    return {
        x: width / 2,
        y: posY[i],
    }
}

function calcOutlinePos(line: Line, textWidth: number): Pos {
    return {
        x: line.pos.x - textWidth / 2 - 10,
        y: line.pos.y - 5,
    }
}

function getMousePos(ev: MouseEvent): Pos {
    const { offsetLeft, clientLeft, offsetTop, clientTop } = ev.target as HTMLElement
    return {
        x: ev.pageX - offsetLeft - clientLeft,
        y: ev.pageY - offsetTop - clientTop,
    }
}

function calcFontSize(width: number): number {
    return width * 0.1
}