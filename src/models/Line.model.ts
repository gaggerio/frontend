export type Pos = { x: number, y: number }

export interface MemeLine {
    _id: string
    txt: string
    fontSize: number
    textAlign: CanvasTextAlign
    strokeStyle: string
    fillStyle: string
    font: string
    textBaseline: CanvasTextBaseline
    pos: Pos
}

