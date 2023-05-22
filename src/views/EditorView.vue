<template>
    <main class="meme-generator">
        <h1>Meme generator</h1>
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
            </section>
        </section>
    </main>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, watch, computed } from 'vue'
import { useCtx } from '../composables/useCtx.composable'
import { useMemeStore } from '../composables/useMemeStore.composable'

const route = useRoute()
const ctx = useCtx()

const memeStore = useMemeStore()
const meme = memeStore.getMeme()

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
</script>