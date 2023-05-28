<template>
    <main class="meme-generator">
        <input type="text" placeholder="Title..." v-model="gagTitle">
        <section class="flex">
            <section class="canvas-container">
                <canvas :ref="ctx.elCanvas" @mousemove="ctx.onMouseOver" @mousedown="ctx.onMouseDown"
                    @mouseup="ctx.onMouseUp"></canvas>
            </section>

            <section class="meme-editor" v-if="meme">
                <input type="text" v-model="currLine.txt">
                <input type="color" v-model="currLine.strokeStyle">
                <input type="color" v-model="currLine.fillStyle">
                <button @click="memeStore.switchLine">Switch line</button>
                <button @click="memeStore.addLine">Add line</button>
                <button @click="clearMeme">clear</button>
                <button @click="memeStore.removeLine">Remove line</button>
                <button @click="memeStore.setFontSize(5)">Font+</button>
                <button @click="memeStore.setFontSize(-5)">Font-</button>
                <button @click="postMeme">Post Meme</button>
            </section>
        </section>
    </main>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onMounted, watch, computed, ref } from 'vue'
import { useCtx } from '../composables/useCtx.composable'
import { useMemeStore } from '../composables/useMemeStore.composable'
import { showErrorMsg, showSuccessMsg } from '@/services/event-bus.service'
import { uploadImg } from '@/services/upload.service'
import { useGagStore } from '@/stores/gag.store'

const route = useRoute()
const router = useRouter()
const ctx = useCtx()

const gagStore = useGagStore()
const memeStore = useMemeStore()

const meme = memeStore.getMeme()
const gagTitle = ref<string>('')

const currLine = computed(() => {
    return meme.value.lines[meme.value.currLine]
})

onMounted(loadMeme)
watch(meme, onUpdateMeme, { deep: true })

async function loadMeme() {
    const { id } = route.params
    await memeStore.loadMeme(id as string)

    ctx.init()
    memeStore.init()
    ctx.render()
}

function onUpdateMeme() {
    memeStore.save()
    ctx.render()
}

function clearMeme() {
    memeStore.clear()
    loadMeme()
}

async function postMeme() {
    try {
        const dataUrl = await ctx.dataUrl()
        const imgData = await uploadImg(dataUrl)
        if (!imgData) throw Error('Something went wrong')

        await gagStore.saveGag({
            imgUrl: imgData.url,
            title: gagTitle.value
        })
        router.push('/')
        showSuccessMsg('Gag posted successfuly!')
    }
    catch (err) {
        console.log('err', err)
        showErrorMsg('Something went wrong')
    }
}
</script>