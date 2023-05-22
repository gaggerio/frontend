import type { MemeLine, Pos } from '../models/Line.model'
import { ref, watch } from 'vue'
import { useMemeStore } from '../composables/useMemeStore.composable'
import { memeService } from '@/services/meme.service'
import type { Img } from '@/models/Img.model'

export function useCtx() {

    var ctx: CanvasRenderingContext2D
    const elCanvas = ref<HTMLCanvasElement>(null!)

    const memeStore = useMemeStore()

    const startPos = ref<Pos>({ x: 0, y: 0 })
    const isDrag = ref<boolean>(false)

    function init() {
        ctx = elCanvas.value.getContext('2d') as CanvasRenderingContext2D
        const { img } = memeStore.meme.value
        resizeCanvas(img)
    }

    function resizeCanvas({ size }: Img) {
        elCanvas.value.width = size.width
        elCanvas.value.height = size.height
    }

    async function render() {
        await drawImg()
        drawLines()
        drawOutline()
    }

    function drawImg(): Promise<void> {
        return new Promise(resolve => {
            const elImg = new Image()
            elImg.src = memeStore.img.value.url
            elImg.onload = () => {
                const { width, height } = elCanvas.value
                ctx.drawImage(elImg, 0, 0, width, height)
                resolve()
            }
        })
    }

    function drawLines() {
        memeStore.lines.value.forEach(line => {
            ctx.font = `${line.fontSize}px ${line.font}`
            ctx.textAlign = line.textAlign
            ctx.textBaseline = line.textBaseline
            ctx.lineWidth = line.fontSize / 8
            ctx.strokeStyle = line.strokeStyle
            ctx.fillStyle = line.fillStyle

            ctx.strokeText(line.txt, line.pos.x, line.pos.y, elCanvas.value.width)
            ctx.fillText(line.txt, line.pos.x, line.pos.y, elCanvas.value.width)
        })
    }

    function drawOutline() {
        const line = memeStore.currLine.value
        const outLineColor = '#fff'
        const textWidth = calcTextWidth(line)
        const outLinePos = memeService.calcOutlinePos(line, textWidth)

        ctx.strokeStyle = outLineColor
        ctx.lineWidth = line.fontSize / 10

        ctx.beginPath()
        ctx.rect(
            outLinePos.x,
            outLinePos.y,
            textWidth + 20,
            line.fontSize + 10
        )
        ctx.stroke()
    }

    function calcTextWidth(line: MemeLine) {
        ctx.font = `${line.fontSize}px ${line.font}`
        return ctx.measureText(line.txt).width
    }

    function calcTextHeight(line: MemeLine) {
        return (elCanvas.value.width * 0.08) + (line.fontSize * 0.1)
    }

    function onMouseOver(ev: any) {
        const mousePos = memeService.getMousePos(ev)
        const currLineIdx = memeStore.currLineIdx.value
        const overLineIdx = getMouseOverLineIdx(mousePos)

        let cursor = 'auto'
        if (overLineIdx >= 0) {
            cursor = 'pointer'
        }
        if (overLineIdx === currLineIdx) {
            cursor = 'all-scroll'
            isDrag.value && moveLine(mousePos)
        }
        elCanvas.value.style.cursor = cursor
    }

    function getMouseOverLineIdx(mousePos: Pos) {
        return memeStore.lines.value.findIndex(line => {
            return isOverLine(line, mousePos)
        })
    }

    function isOverLine(line: MemeLine, mousePos: Pos) {
        const textWidth = calcTextWidth(line)
        const textHeight = calcTextHeight(line)

        const square = {
            x: line.pos.x - (textWidth / 2) - 10,
            y: line.pos.y - textHeight * 0.01,
            length: textWidth + 20,
            height: textHeight + elCanvas.value.height * 0.015
        }
        return (
            mousePos.x > square.x &&
            mousePos.y > square.y &&
            mousePos.x < square.length + square.x &&
            mousePos.y < square.height + square.y
        )
    }

    function onMouseDown(ev: any) {
        const mousePos = memeService.getMousePos(ev)
        const idx = getMouseOverLineIdx(mousePos)
        if (idx < 0) return

        memeStore.switchLine(idx)
        isDrag.value = true
        startPos.value = mousePos
    }

    function onMouseUp() {
        isDrag.value = false
    }

    function moveLine(mousePos: Pos) {
        const delta = {
            x: mousePos.x - startPos.value.x,
            y: mousePos.y - startPos.value.y
        }
        memeStore.moveLine(delta)
        startPos.value = mousePos
    }

    return {
        elCanvas,
        init,
        drawImg,
        drawLines,
        drawOutline,
        render,
        onMouseOver,
        onMouseDown,
        onMouseUp,
    }
}