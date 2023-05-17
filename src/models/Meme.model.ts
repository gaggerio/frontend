import { utilService } from "../services/util.service"
import type { Img } from "./Img.model"
import type { MemeLine, Pos } from "./Line.model"

export interface Meme {
    _id: string
    imgUrl: string
    lines: MemeLine[]
    currLine: number
    outLineColor: string,
    width: number,
    height: number,
    arcPos: Pos
}