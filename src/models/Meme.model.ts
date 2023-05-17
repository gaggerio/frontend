import { utilService } from "../services/util.service"
import { Img } from "./Img.model"
import { Line, MemeLine } from "./Line.model"

export interface Meme {
    _id: string
    imgUrl: string
    lines: MemeLine[]
    currLine: number
    outLineColor: string,
    width: number,
    height: number
}