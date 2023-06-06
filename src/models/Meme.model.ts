import type { Img } from './Img.model'
import type { Line } from './Line.model'

export interface Meme {
    _id: string
    img: Img
    lines: Line[]
    currLine: number
    outLineColor: string
}
