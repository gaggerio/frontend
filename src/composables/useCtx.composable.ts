import type { MemeLine } from '../models/Line.model'
import type { Meme } from '../models/Meme.model'

export function useCtx() {

    var elCanvas: HTMLCanvasElement
    var ctx: CanvasRenderingContext2D
    var meme: Meme

    const setContext = (canvasRef: HTMLCanvasElement) => {
        elCanvas = canvasRef
        ctx = elCanvas.getContext('2d') as CanvasRenderingContext2D
    }

    const setMeme = (_meme: Meme) => {
        meme = _meme
    }

    const render = async () => {
        await drawImg()
        drawLines()
        drawOutline()
    }

    const drawImg = (): Promise<void> => {
        
        return new Promise((resolve) => {
            const elImg = new Image()
            elImg.src = meme.imgUrl

            elImg.onload = () => {
                ctx.drawImage(elImg, 0, 0, elCanvas.width, elCanvas.height)
                resolve()
            }
        })
    }

    const drawLines = () => {
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

    const drawOutline = () => {
        const line = meme.lines[meme.currLine]
        const { fontSize, pos } = line
        const textWidth = ctx.measureText(line.txt).width
        const bottomRight = (elCanvas.width * 0.08) + (fontSize * 0.1)
        
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = elCanvas.width * 0.01
        ctx.beginPath()
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
        ctx.arc(
            meme.arcPos.x,
            meme.arcPos.y,
            elCanvas.width * 0.015, 
            0, 
            2 * Math.PI
        )
        ctx.fill()
    }

    return {
        setContext,
        drawImg,
        drawLines,
        drawOutline,
        render,
        setMeme
    }
}