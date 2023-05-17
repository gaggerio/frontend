import { utilService } from "../services/util.service"

export type Pos = { x: number, y: number }

export interface MemeLine {
    _id: string
    txt: string
    fontSize: number
    textAlign: CanvasTextAlign
    strokeStyle: string
    fillStyle: string
    font: string
    isDrag: boolean
    textBaseline: CanvasTextBaseline
    lineWidth: number
    pos: Pos
}

