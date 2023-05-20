import type { MemeLine } from '../models/Line.model'
import type { Ref } from 'vue'
import type { Meme } from '../models/Meme.model'
import { ref, computed } from 'vue'

export function useCtx(_meme: Ref<Meme>) {

    const canvasRef = ref<HTMLCanvasElement>(null!)
    var ctx: CanvasRenderingContext2D

    const meme = computed(() => {
        return _meme.value
    })

    const setContext = () => {
        ctx = canvasRef.value.getContext('2d') as CanvasRenderingContext2D
    }

    const render = async () => {
        await drawImg()
        drawLines()
        drawOutline()
    }

    const drawImg = (): Promise<void> => {
        return new Promise((resolve) => {
            const elImg = new Image()
            elImg.src = meme.value.imgUrl

            elImg.onload = () => {
                ctx.drawImage(elImg, 0, 0, meme.value.width, meme.value.height)
                resolve()
            }
        })
    }

    const drawLines = () => {
        meme.value.lines.forEach((line: MemeLine) => {
            ctx.font = `${(meme.value.width * 0.08) + (line.fontSize * 0.1)}px ${line.font}`
            ctx.textAlign = line.textAlign
            ctx.textBaseline = line.textBaseline
            ctx.lineWidth = line.lineWidth
            ctx.strokeStyle = line.strokeStyle
            ctx.fillStyle = line.fillStyle

            ctx.strokeText(line.txt, line.pos.x, line.pos.y, meme.value.width)
            ctx.fillText(line.txt, line.pos.x, line.pos.y, meme.value.width)
        })
    }

    const drawOutline = () => {
        const line = meme.value.lines[meme.value.currLine]
        const { fontSize, pos } = line
        const textWidth = ctx.measureText(line.txt).width
        const bottomRight = (meme.value.width * 0.08) + (fontSize * 0.1)

        ctx.strokeStyle = '#fff'
        ctx.lineWidth = meme.value.width * 0.01
        ctx.beginPath()
        ctx.rect(
            pos.x - (textWidth / 2) - 10,
            pos.y - meme.value.height * 0.01,
            textWidth + 20,
            bottomRight + meme.value.height * 0.015
        )
        ctx.stroke()

        const arcPos = {
            x: pos.x + (textWidth / 2) + 10,
            y: pos.y + bottomRight + meme.value.height * 0.005
        }
        ctx.strokeStyle = '#fff'
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(
            arcPos.x,
            arcPos.y,
            meme.value.width * 0.015,
            0,
            2 * Math.PI
        )
        ctx.fill()
    }

    return {
        canvasRef,
        setContext,
        drawImg,
        drawLines,
        drawOutline,
        render
    }
}