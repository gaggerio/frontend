import type { Pos } from '@/models/Line.model'
import type { Meme } from '../models/Meme.model'
import { computed, ref } from 'vue'
import { memeService } from '../services/meme.service'
import { showErrorMsg } from '@/services/event-bus.service'

// A reactive reference to hold the current meme object
var gMeme = ref<Meme>(memeService.createMeme({
    _id: '',
    url: '',
    keywords: [],
    size: { width: 0, height: 0 }
}))

/**
 * Custom composable for managing the Meme object.
 */
export function useMemeStore() {
    /**
     * Getters and computed properties
     */
    const meme = computed(() => gMeme.value)
    const currLine = computed(() => gMeme.value.lines[gMeme.value.currLine])
    const lines = computed(() => gMeme.value.lines)
    const currLineIdx = computed(() => gMeme.value.currLine)
    const img = computed(() => gMeme.value.img)

    /**
     * Methods and functions
     */

    /**
     * Get the current meme.
     * @returns The current meme object.
     */
    function getMeme() {
        return gMeme
    }

    /**
     * Load a meme from the server by its ID.
     * @param imgId - The ID of the meme image to load.
     */
    async function loadMeme(imgId: string) {
        try {
            const meme = await memeService.getMeme(imgId)
            gMeme.value = meme
        } catch (err) {
            showErrorMsg('Oops something went wrong')
        }
    }

    /**
     * Initialize the meme by setting initial font size and positions for each line.
     */
    function init() {
        gMeme.value.lines.forEach((line, i) => {
            const { width, height } = img.value.size
            line.fontSize = memeService.calcFontSize(width)
            line.pos = memeService.calcLinePos(width, height, i)
        })
    }

    /**
     * Increase or decrease the font size of the current line.
     * @param size - The amount by which to adjust the font size.
     */
    function setFontSize(size: number) {
        gMeme.value.lines[gMeme.value.currLine].fontSize += size
    }

    /**
     * Switch to the next line in the meme.
     * @param idx - Optional. The index of the line to switch to.
     */
    function switchLine(idx?: number) {
        if (idx !== undefined && !isNaN(idx)) {
            gMeme.value.currLine = idx
            return
        }
        if (gMeme.value.currLine === gMeme.value.lines.length - 1) {
            gMeme.value.currLine = 0
        } else {
            gMeme.value.currLine++
        }
    }

    /**
     * Add a new line to the meme. 
     * The font size and x,y positions will be calculated.
     */
    function addLine() {
        const { width, height } = img.value.size
        const newLine = memeService.createLine()
        newLine.fontSize = memeService.calcFontSize(width)
        newLine.pos = memeService.calcLinePos(width, height, 2)
        gMeme.value.lines.push(newLine)
    }

    /**
     * Remove the current line from the meme.
     * Will not remove the line if its the last line
     */
    function removeLine() {
        if (lines.value.length === 1) {
            return
        }
        gMeme.value.lines.splice(gMeme.value.currLine, 1)
        gMeme.value.currLine = 0
    }

    /**
     * Move the current line by the specified delta values.
     * @param delta - The delta values for the x and y coordinates.
     */
    function moveLine(delta: Pos) {
        const currLine = gMeme.value.lines[gMeme.value.currLine]
        currLine.pos.x += delta.x
        currLine.pos.y += delta.y
    }

    /**
     * Save the current meme to session storage.
     */
    function save() {
        memeService.save(gMeme.value)
    }

    /**
     * Clear the current meme from session storage.
     */
    function clear() {
        memeService.clear()
    }

    // Return the exposed methods, computed properties, and reactive references
    return {
        loadMeme,
        switchLine,
        addLine,
        removeLine,
        save,
        clear,
        init,
        moveLine,
        setFontSize,
        getMeme,
        meme,
        currLine,
        lines,
        currLineIdx,
        img,
    }
}