import type { MemeLine } from '../models/Line.model'
import { ref } from 'vue'
import { useMemeStore } from '../composables/useMemeStore.composable'

export function useCtx() {

    var ctx: CanvasRenderingContext2D
    const canvasRef = ref<HTMLCanvasElement>(null!)

    const memeStore = useMemeStore()
    const meme = memeStore.getMeme()

    const arcPosRef = ref({ x: 0, y: 0 })
    const startPosRef = ref({ x: 0, y: 0 })
    const isDragRef = ref<boolean>(false)

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

    function onMouseOver(ev: any) {
        const mousePos = getMousePos(ev)
        const arcPos = arcPosRef.value

        const distanceFromResize = Math.sqrt((arcPos.x - mousePos.x) ** 2 + (arcPos.y - mousePos.y) ** 2)
        const isOverResize = distanceFromResize < 10
        const isOverCurrLine = isOverLine(meme.value.currLine, mousePos)
        const isOverText = meme.value.lines.some((_, i) => {
            return (i === meme.value.currLine) ? false : isOverLine(i, mousePos)
        })

        let cursor = ''
        if (isOverResize) cursor = 'nwse-resize'
        else if (isOverCurrLine) cursor = 'all-scroll'
        else if (isOverText) cursor = 'pointer'
        canvasRef.value.style.cursor = cursor

        !isOverResize && isOverCurrLine && isDragRef.value && moveLine(mousePos)

    }

    function getMousePos(ev: any) {
        const { offsetLeft, clientLeft, offsetTop, clientTop } = ev.target
        return {
            x: ev.pageX - offsetLeft - clientLeft,
            y: ev.pageY - offsetTop - clientTop,
        }
    }

    function isOverLine(i: number, clickedPos: any) {
        const { pos, fontSize, txt } = meme.value.lines[i]

        const textWidth = ctx.measureText(txt).width || 10
        const textHeight = (canvasRef.value.width * 0.08) + (fontSize * 0.1)

        const square = {
            x: pos.x - (textWidth / 2) - 10,
            y: pos.y - textHeight * 0.01,
            length: textWidth + 20,
            height: textHeight + canvasRef.value.height * 0.015
        }

        return (
            clickedPos.x > square.x &&
            clickedPos.y > square.y &&
            clickedPos.x < square.length + square.x &&
            clickedPos.y < square.height + square.y
        )
    }

    function onMouseDown(ev: any) {
        const mousePos = getMousePos(ev)
        meme.value.lines.forEach((_, i) => {
            if (isOverLine(i, mousePos)) {
                memeStore.switchLine(i)
                isDragRef.value = true
                startPosRef.value = mousePos
            }
        })
    }

    function onMouseUp() {
        isDragRef.value = false
    }

    function moveLine(mousePos: { x: number, y: number }) {
        const currLine = meme.value.lines[meme.value.currLine]
        currLine.pos.x += mousePos.x - startPosRef.value.x
        currLine.pos.y += mousePos.y - startPosRef.value.y
        startPosRef.value = mousePos
    }

    function resize(mousePos: { x: number, y: number }) {
        
    }

    return {
        canvasRef,
        setContext,
        drawImg,
        drawLines,
        drawOutline,
        render,
        onMouseOver,
        onMouseDown,
        onMouseUp
    }
}