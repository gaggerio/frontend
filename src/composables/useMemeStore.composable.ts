import { ref } from 'vue'
import type { Meme } from '../models/Meme.model'
import { memeService } from '../services/meme.service'

var gMeme = ref<Meme>(memeService.createMeme({
    _id: '',
    url: '',
    keywords: []
}))

export function useMemeStore() {

    const getMeme = () => {
        return gMeme
    }

    const setMeme = async (imgId: string) => {
        try {
            const meme = await memeService.getMeme(imgId)
            if (meme) gMeme.value = meme
        }
        catch (err) {
            console.log('had error getting meme')
        }
    }

    const switchLine = () => {
        if (gMeme.value.currLine === gMeme.value.lines.length - 1) gMeme.value.currLine = 0
        else gMeme.value.currLine++
    }

    const addLine = () => {
        const newLine = memeService.createLine(gMeme.value, 2)
        gMeme.value.lines.push(newLine)
    }

    const removeLine = () => {
        gMeme.value.lines.splice(gMeme.value.currLine, 1)
        gMeme.value.currLine = 0
    }

    const save = () => {
        memeService.save(gMeme.value)
    }

    const clear = () => {
        memeService.clear()
    }

    return {
        getMeme,
        setMeme,
        switchLine,
        addLine,
        removeLine,
        save,
        clear
    }
}