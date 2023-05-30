import type { Line, Pos } from "@/models/Line.model"
import type { Meme } from "../models/Meme.model"
import type { Img } from "@/models/Img.model"
import { utilService } from "./util.service"
import { imgService } from "./img.service"

const MEME_KEY = 'curr_meme'
const MOVES_KEY = 'meme_moves'

export const memeService = {
    save,
    getMeme,
    createLine,
    clear,
    createMeme,
    calcLinePos,
    calcOutlinePos,
    getMousePos,
    calcFontSize,
    getLastMove,
    saveMoves
}

async function getMeme(imgId: string): Promise<Meme> {
    let meme = load()
    if (!meme) {
        const img = await imgService.getById(imgId)
        meme = createMeme(img)
        clear()
    }
    return meme
}

function load(): Meme | null {
    return utilService.loadFromSession(MEME_KEY)
}

function loadMoves(): Meme[] | null {
    return utilService.loadFromSession(MOVES_KEY)
}

function save(meme: Meme): void {
    utilService.saveToSession(MEME_KEY, meme)
}

function saveMoves(meme: Meme) {
    let moves = loadMoves() || []
    moves.push(meme)
    utilService.saveToSession(MOVES_KEY, moves)
}

function getLastMove(): Meme | void {
    const moves = loadMoves() || []
    if (moves.length === 1) return moves[0]
    moves.pop()
    utilService.saveToSession(MOVES_KEY, moves)
    return moves[moves.length - 1]
}

function clear(): void {
    utilService.saveToSession(MOVES_KEY, null)
    utilService.saveToSession(MEME_KEY, null)
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