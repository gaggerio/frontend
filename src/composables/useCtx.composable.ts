import type { Line, Pos } from '../models/Line.model'
import type { Img } from '@/models/Img.model'
import { ref } from 'vue'
import { useMemeStore } from '../composables/useMemeStore.composable'
import { memeService } from '@/services/meme.service'

/**
Represents a composable for managing the canvas context and rendering functions.
@returns {Object} The object containing the composable functions and properties.
*/
export function useCtx() {

    var ctx: CanvasRenderingContext2D
    const memeStore = useMemeStore()

    const elCanvas = ref<HTMLCanvasElement>(null!)
    const startPos = ref<Pos>({ x: 0, y: 0 })
    const isDrag = ref<boolean>(false)

    /**
    Initializes the canvas context and resizes it based on the image size.
    */
    function init(): void {
        ctx = elCanvas.value.getContext('2d') as CanvasRenderingContext2D
        const { img } = memeStore.meme.value
        resizeCanvas(img)
    }

    /**
    Resizes the canvas based on the provided image size.
    @param {Img} img - The image object containing the width and height.
    */
    function resizeCanvas(img: Img): void {
        elCanvas.value.width = img.size.width
        elCanvas.value.height = img.size.height
    }

    /**
    Renders the meme by drawing the image, lines, and outline on the canvas.
    */
    async function render(): Promise<void> {
        await drawImg()
        drawLines()
        drawOutline()
    }

    /**
    Draws the meme image on the canvas.
    @returns {Promise<void>} A promise that resolves when the image is loaded and drawn.
    */
    function drawImg(): Promise<void> {
        return new Promise((resolve) => {
            const elImg = new Image()
            elImg.src = memeStore.img.value.url
            elImg.onload = () => {
                const { width, height } = elCanvas.value
                ctx.drawImage(elImg, 0, 0, width, height)
                resolve()
            }
        })
    }

    /**
    Draws the text lines of the meme on the canvas.
    */
    function drawLines(): void {
        memeStore.lines.value.forEach((line) => {
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

    /**
    Draws the outline of the current line on the canvas.
    */
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

    /**
    Calculates the width of the text based on the current line's properties.
    @param {Line} line - The line object containing the text and font properties.
    @returns {number} The calculated width of the text.
    */
    function calcTextWidth(line: Line): number {
        ctx.font = `${line.fontSize}px ${line.font}`
        return ctx.measureText(line.txt).width
    }

    /**
    Calculates the height of the text based on the current line's properties.
    @param {Line} line - The line object containing the text and font properties.
    @returns {number} The calculated height of the text.
    */
    function calcTextHeight(line: Line): number {
        return elCanvas.value.width * 0.08 + line.fontSize * 0.1
    }

    /**
    Handles the mouse over event on the canvas.
    @param {MouseEvent} ev - The mouse over event object.
    */
    function onMouseOver(ev: MouseEvent): void {
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

    /**
    Gets the index of the line that the mouse is currently over.
    @param {Pos} mousePos - The mouse position object containing the x and y coordinates.
    @returns {number} The index of the line, or -1 if not found.
    */
    function getMouseOverLineIdx(mousePos: Pos): number {
        return memeStore.lines.value.findIndex((line) => {
            return isOverLine(line, mousePos)
        })
    }

    /**
    Checks if the mouse is over a specific line.
    @param {Line} line - The line object to check against.
    @param {Pos} mousePos - The mouse position object containing the x and y coordinates.
    @returns {boolean} True if the mouse is over the line, false otherwise.
    */
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

    /**
    Handles the mouse down event on the canvas.
    If clicked on a line, switch to the selected line
    @param {MouseEvent} ev - The mouse down event object.
    */
    function onMouseDown(ev: MouseEvent): void {
        const mousePos = memeService.getMousePos(ev)
        const idx = getMouseOverLineIdx(mousePos)
        if (idx < 0) return

        memeStore.switchLine(idx)
        isDrag.value = true
        startPos.value = mousePos
    }

    /**
    Handles the mouse up event on the canvas.
    Sets the isDrag flag to false.
    */
    function onMouseUp(): void {
        isDrag.value = false
    }

    /**
    Moves the current line based on the mouse position.
    @param {Pos} mousePos - The mouse position object containing the x and y coordinates.
    */
    function moveLine(mousePos: Pos): void {
        const delta = {
            x: mousePos.x - startPos.value.x,
            y: mousePos.y - startPos.value.y,
        }
        memeStore.moveLine(delta)
        startPos.value = mousePos
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
    }
}