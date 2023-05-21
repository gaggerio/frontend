import type { MemeLine } from '../models/Line.model'
import { ref } from 'vue'
import { useMemeStore } from '../composables/useMemeStore.composable'

export function useCtx() {

    var ctx: CanvasRenderingContext2D
    const canvasRef = ref<HTMLCanvasElement>(null!)
    const arcPosRef = ref({ x: 0, y: 0 })
    const meme = useMemeStore().getMeme()

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

        arcPosRef.value = {
            x: pos.x + (textWidth / 2) + 10,
            y: pos.y + bottomRight + meme.value.height * 0.005
        }
        ctx.strokeStyle = '#fff'
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(
            arcPosRef.value.x,
            arcPosRef.value.y,
            meme.value.width * 0.015,
            0,
            2 * Math.PI
        )
        ctx.fill()
    }

    // function onMouseOver(ev: any) {
    //     const mousePos = getMousePos(ev)
    //     const arcPos = arcPosRef.value

    //     const distanceFromResize = Math.sqrt((arcPos.x - mousePos.x) ** 2 + (arcPos.y - mousePos.y) ** 2)
    //     const isOverCurrLine = isOverLine(meme.currLine, mousePos)
    //     const isOverText = meme.lines.some((line, i) => {
    //         return (i === meme.currLine) ? false : isOverLine(i, mousePos)
    //     })

    //     let cursor = ''
    //     if (distanceFromResize < 10) cursor = 'nwse-resize'
    //     else if (isOverCurrLine) cursor = 'all-scroll'
    //     else if (isOverText) cursor = 'pointer'
    //     elCanvas.style.cursor = cursor
    //     isOverCurrLine && isDragRef.current && moveLine(mousePos)
    // }

    // function getMousePos(ev: any) {
    //     const { offsetLeft, clientLeft, offsetTop, clientTop } = ev.target
    //     return {
    //         x: ev.pageX - offsetLeft - clientLeft,
    //         y: ev.pageY - offsetTop - clientTop,
    //     }
    // }

    return {
        canvasRef,
        setContext,
        drawImg,
        drawLines,
        drawOutline,
        render
    }
}