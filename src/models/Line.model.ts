export interface Line {
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

export type Pos = { 
    x: number, 
    y: number 
}

