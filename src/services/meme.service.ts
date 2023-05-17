import { Line } from "../models/Line.model"
import { Meme } from "../models/Meme.model"
import { galleryService } from "./gallery.service"
import { utilService } from "./util.service"

const KEY = 'curr_meme'
type CrudMap = { [type: string]: (meme: Meme) => void }

export const memeService = {
    createMeme,
    // getMeme,
    // updateMeme,
    // updateLine,
    // onClickLine
}

// async function getMeme(imgId: string) {
//     const img = await galleryService.getImgById(imgId)
//     const meme = new Meme(img)
//     utilService.saveToStorage(KEY, meme)
//     return meme
// }

// function updateMeme(type: string) {
//     const meme: Meme = utilService.loadFromStorage(KEY)
//     const crudMap: CrudMap = {
//         switch: switchLines,
//         add: addNewLine,
//         remove: removeLine
//     }
//     crudMap[type](meme)
//     utilService.saveToStorage(KEY, meme)
//     return meme
// }

// function updateLine(key: string, value: string | number) {
//     const meme: Meme = utilService.loadFromStorage(KEY)
//     const line = meme.lines[meme.currLine]
//     if (typeof value !== 'number') line[key] = value
//     else {
//         let val: number = +line[key]
//         val += value
//         line[key] = val
//     }
//     utilService.saveToStorage(KEY, meme)
//     return meme
// }

// function switchLines(meme: Meme) {
//     if (meme.currLine === meme.lines.length - 1) meme.currLine = 0
//     else meme.currLine++
// }

// function addNewLine(meme: Meme) {
//     const line = new Line()
//     meme.lines.push(line)
// }

// function removeLine(meme: Meme) {
//     meme.lines.splice(meme.currLine, 1)
// }

// function onClickLine(lineIdx: number) {
//     const meme: Meme = utilService.loadFromStorage(KEY)
//     meme.currLine = lineIdx
//     meme.lines[meme.currLine].isDrag = true
//     utilService.saveToStorage(KEY, meme)
//     return meme
// }


function createMeme(width: number, height: number, imgUrl: string): Meme {
    const meme: Meme = {
        _id: utilService.makeId(),
        outLineColor: '#7c7c7c',
        lines: [],
        currLine: 0,
        imgUrl,
        width,
        height
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
            y: posY[i]
        },
    }
    return line
}
