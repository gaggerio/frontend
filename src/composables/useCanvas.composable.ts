import { Ref, ref } from "vue"
import { Img } from "../models/Img.model"
import { MemeLine } from "../models/Line.model"
import { Meme } from "../models/Meme.model"

type ElCanvas = HTMLCanvasElement
type Ctx = CanvasRenderingContext2D

export type UseCanvas = {
    renderMeme: (meme: Meme) => void,
    canvasRef: Ref<ElCanvas | null>,
    ctxRef: Ref<Ctx | null>
}

export function useCanvas(): UseCanvas {

    const canvasRef = ref<ElCanvas | null>(null)
    const ctxRef = ref<Ctx | null>(null)

    const renderMeme = (meme: Meme): void => {
        drawImg(meme)
        drawLines(meme)
    }

    const drawImg = (meme: Meme): void => {
        const elImg = new Image()
        elImg.src = meme.imgUrl

        elImg.onload = () => {
            if (!ctxRef.value || !canvasRef.value) return
            ctxRef.value.drawImage(
                elImg,
                0,
                0,
                canvasRef.value.width,
                canvasRef.value.height
            )
        }
    }

    const drawLines = (meme: Meme): void => {
        const ctx = ctxRef.value
        const elCanvas = canvasRef.value
        if (!ctx || !elCanvas) return

        meme.lines.forEach((line: MemeLine) => {
            ctx.font = `${(elCanvas.width * 0.08) + (line.fontSize * 0.1)}px ${line.font}`
            ctx.textAlign = line.textAlign
            ctx.textBaseline = line.textBaseline
            ctx.lineWidth = line.lineWidth
            ctx.strokeStyle = line.strokeStyle
            ctx.fillStyle = line.fillStyle

            ctx.strokeText(line.txt, line.pos.x, line.pos.y, elCanvas.width)
            ctx.fillText(line.txt, line.pos.x, line.pos.y, elCanvas.width)
        })
    }

    return {
        canvasRef,
        ctxRef,
        renderMeme
    }
}