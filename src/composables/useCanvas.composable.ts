import { ref } from "vue"
import type { Ref } from "vue"
import type { MemeLine } from "../models/Line.model"
import type { Meme } from "../models/Meme.model"

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

    const renderMeme = async (meme: Meme): Promise<void> => {
        await drawImg(meme)
        drawLines(meme)
        drawOutline(meme)
    }

    const drawImg = (meme: Meme): Promise<void> => {
        return new Promise((resolve) => {
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
                resolve()
            }
        })
    }

    const drawLines = (meme: Meme): void => {
        const elCanvas = canvasRef.value
        const ctx = ctxRef.value
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

    const drawOutline = (meme: Meme): void => {
        const elCanvas = canvasRef.value
        const ctx = ctxRef.value
        if (!ctx || !elCanvas) return

        const line = meme.lines[meme.currLine]
        const { fontSize, pos } = line
        const textWidth = ctx.measureText(line.txt).width
        const bottomRight = (elCanvas.width * 0.08) + (fontSize * 0.1)

        ctx.strokeStyle = '#fff'
        ctx.lineWidth = elCanvas.width * 0.01
        ctx.rect(
            pos.x - (textWidth / 2) - 10,
            pos.y - elCanvas.height * 0.01,
            textWidth + 20,
            bottomRight + elCanvas.height * 0.015
        )
        ctx.stroke()

        meme.arcPos = {
            x: pos.x + (textWidth / 2) + 10,
            y: pos.y + bottomRight + elCanvas.height * 0.005
        }
        ctx.beginPath()
        ctx.fillStyle = '#fff'
        ctx.arc(
            meme.arcPos.x,
            meme.arcPos.y,
            elCanvas.width * 0.015, 0, 2 * Math.PI
        )
        ctx.fill()

    }

    return {
        canvasRef,
        ctxRef,
        renderMeme
    }
}