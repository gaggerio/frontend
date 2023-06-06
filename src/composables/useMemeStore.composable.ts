import type { Pos } from '@/models/Line.model'
import type { Meme } from '../models/Meme.model'
import { computed, ref } from 'vue'
import { memeService } from '../services/meme.service'
import { showErrorMsg } from '@/services/event-bus.service'

const gMeme = ref<Meme>(
    memeService.createMeme({
        _id: '',
        url: '',
        keywords: [],
        size: { width: 0, height: 0 },
    })
)

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
        } catch (err) {
            showErrorMsg('Oops something went wrong')
        }
    }

    function init() {
        gMeme.value.lines.forEach((line, i) => {
            const { width, height } = img.value.size
            line.fontSize = memeService.calcFontSize(width)
            line.pos = memeService.calcLinePos(width, height, i)
        })
        saveMoves()
    }

    function setFontSize(size: number) {
        gMeme.value.lines[gMeme.value.currLine].fontSize += size
        saveMoves()
    }

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

    function addLine() {
        const { width, height } = img.value.size
        const newLine = memeService.createLine()
        newLine.fontSize = memeService.calcFontSize(width)
        newLine.pos = memeService.calcLinePos(width, height, 2)
        gMeme.value.lines.push(newLine)
        saveMoves()
    }

    function removeLine() {
        if (lines.value.length === 1) {
            return
        }
        gMeme.value.lines.splice(gMeme.value.currLine, 1)
        gMeme.value.currLine = 0
        saveMoves()
    }

    function moveLine(delta: Pos) {
        const currLine = gMeme.value.lines[gMeme.value.currLine]
        currLine.pos.x += delta.x
        currLine.pos.y += delta.y
    }

    function save() {
        memeService.save(gMeme.value)
    }

    function undo() {
        const meme = memeService.getLastMove()
        console.log('undiung', meme)
        if (meme) gMeme.value = meme
    }

    function saveMoves() {
        memeService.saveMoves(gMeme.value)
    }

    function clear() {
        memeService.clear()
    }

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
        undo,
        saveMoves,
        meme,
        currLine,
        lines,
        currLineIdx,
        img,
    }
}
