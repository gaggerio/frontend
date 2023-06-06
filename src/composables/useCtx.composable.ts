import type { Line, Pos } from '../models/Line.model'
import type { Img } from '@/models/Img.model'
import { ref } from 'vue'
import { useMemeStore } from '../composables/useMemeStore.composable'
import { memeService } from '@/services/meme.service'
import { imgService } from '@/services/img.service'

export function useCtx() {

    let ctx: CanvasRenderingContext2D
    const memeStore = useMemeStore()

    const elCanvas = ref<HTMLCanvasElement>()
    const startPos = ref<Pos>({ x: 0, y: 0 })
    const isDrag = ref<boolean>(false)

    function init(): void {
        if (!elCanvas.value) return
        ctx = elCanvas.value.getContext('2d') as CanvasRenderingContext2D
        const { img } = memeStore.meme.value
        resizeCanvas(img)
    }

    function resizeCanvas(img: Img): void {
        if (!elCanvas.value) return
        elCanvas.value.width = img.size.width
        elCanvas.value.height = img.size.height
    }

    async function render(): Promise<void> {
        await drawImg()
        drawLines()
        drawOutline()
    }

    function drawImg(): Promise<void> {
        
        return new Promise((resolve) => {
            const elImg = new Image()
            elImg.src = imgService.getImgSrc(memeStore.img.value)
            elImg.onload = () => {
                if (!elCanvas.value) return
                const { width, height } = elCanvas.value
                ctx.drawImage(elImg, 0, 0, width, height)
                resolve()
            }
        })
    }

    function drawLines(): void {
        
        memeStore.lines.value.forEach((line) => {
            if (!elCanvas.value) return
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

    function drawOutline(): void {
        const line = memeStore.currLine.value
        const outLineColor = memeStore.meme.value.outLineColor
        const textWidth = calcTextWidth(line)
        const outLinePos = memeService.calcOutlinePos(line, textWidth)

        ctx.strokeStyle = outLineColor
        ctx.lineWidth = line.fontSize / 10
        ctx.beginPath()
        ctx.rect(outLinePos.x, outLinePos.y, textWidth + 20, line.fontSize + 10)
        ctx.stroke()
    }

    function calcTextWidth(line: Line): number {
        ctx.font = `${line.fontSize}px ${line.font}`
        return ctx.measureText(line.txt).width
    }

    function calcTextHeight(line: Line): number {
        if (!elCanvas.value) return -1
        return elCanvas.value.width * 0.08 + line.fontSize * 0.1
    }

    function onMouseOver(ev: MouseEvent): void {
        if (!elCanvas.value) return
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

    function getMouseOverLineIdx(mousePos: Pos): number {
        return memeStore.lines.value.findIndex((line) => {
            return isOverLine(line, mousePos)
        })
    }

    function isOverLine(line: Line, mousePos: Pos): boolean {
        const textWidth = calcTextWidth(line)
        const textHeight = calcTextHeight(line)

        const square = {
            x: line.pos.x - textWidth / 2 - 10,
            y: line.pos.y - textHeight * 0.01,
            length: textWidth + 20,
            height: textHeight + 10,
        }
        return (
            mousePos.x > square.x &&
            mousePos.y > square.y &&
            mousePos.x < square.length + square.x &&
            mousePos.y < square.height + square.y
        )
    }

    function onMouseDown(ev: MouseEvent): void {
        const mousePos = memeService.getMousePos(ev)
        const idx = getMouseOverLineIdx(mousePos)
        if (idx < 0) return

        memeStore.switchLine(idx)
        isDrag.value = true
        startPos.value = mousePos
    }

    function onMouseUp(): void {
        isDrag.value = false
    }

    function moveLine(mousePos: Pos): void {
        const delta = {
            x: mousePos.x - startPos.value.x,
            y: mousePos.y - startPos.value.y,
        }
        memeStore.moveLine(delta)
        startPos.value = mousePos
    }

    async function dataUrl() {
        if (!elCanvas.value) return
        await drawImg()
        drawLines()
        return elCanvas.value.toDataURL()
    }

    return {
        elCanvas,
        init,
        render,
        drawImg,
        drawLines,
        drawOutline,
        onMouseOver,
        onMouseDown,
        onMouseUp,
        dataUrl
    }
}