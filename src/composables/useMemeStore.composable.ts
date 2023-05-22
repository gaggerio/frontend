import { computed, ref } from 'vue'
import type { Meme } from '../models/Meme.model'
import { memeService } from '../services/meme.service'
import type { Pos } from '@/models/Line.model'
import { showErrorMsg } from '@/services/event-bus.service'

var gMeme = ref<Meme>(memeService.createMeme({
    _id: '',
    url: '',
    keywords: [],
    size: { width: 0, height: 0 }
}))

export function useMemeStore() {

    const meme = computed(() => gMeme.value)
    const currLine = computed(() => gMeme.value.lines[gMeme.value.currLine])
    const lines = computed(() => gMeme.value.lines)
    const currLineIdx = computed(() => gMeme.value.currLine)
    const img = computed(() => gMeme.value.img)

    function getMeme() {
        return gMeme
    }

    async function loadMeme(imgId: string) {
        try {
            const meme = await memeService.getMeme(imgId)
            gMeme.value = meme
        }
        catch (err) {
            showErrorMsg('Oops somethign went wrong')
        }
    }

    function init() {
        gMeme.value.lines.forEach((line, i) => {
            const { width, height } = img.value.size
            line.fontSize = width * 0.1
            line.pos = memeService.caclLinePos(width, height, i)
        })
    }

    function setFontSize(size: number) {
        gMeme.value.lines[gMeme.value.currLine].fontSize += size
    }

    function switchLine(idx?: number) {
        if (idx !== undefined && !isNaN(idx)) {
            gMeme.value.currLine = idx
            return
        }
        if (gMeme.value.currLine === gMeme.value.lines.length - 1) gMeme.value.currLine = 0
        else gMeme.value.currLine++
    }

    function addLine() {
        const { width, height } = img.value.size
        const newLine = memeService.createLine()
        newLine.fontSize = width * 0.1
        newLine.pos = memeService.caclLinePos(width, height, 2)
        gMeme.value.lines.push(newLine)
    }

    function removeLine() {
        if (lines.value.length === 1) return
        gMeme.value.lines.splice(gMeme.value.currLine, 1)
        gMeme.value.currLine = 0
    }

    function moveLine(delta: Pos) {
        const currLine = gMeme.value.lines[gMeme.value.currLine]
        currLine.pos.x += delta.x
        currLine.pos.y += delta.y
    }

    function save() {
        memeService.save(gMeme.value)
    }

    function clear() {
        memeService.clear()
    }

    return {
        meme,
        currLine,
        lines,
        currLineIdx,
        img,
        getMeme,
        loadMeme,
        switchLine,
        addLine,
        removeLine,
        save,
        clear,
        init,
        moveLine,
        setFontSize,
    }
}