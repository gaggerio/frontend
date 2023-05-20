<template>
    <main class="meme-generator">
        <h1>Meme generator</h1>
        <section class="flex">
            <section class="canvas-container">
                <canvas width="500" height="500" :ref="ctx.canvasRef"></canvas>
            </section>

            <section class="meme-editor" v-if="memeRef">
                <input type="text" v-model="currLine.txt">
                <input type="color" v-model="currLine.strokeStyle">
                <input type="color" v-model="currLine.fillStyle">
                <button @click="switchLine">Switch line</button>
                <button @click="addLine">Add line</button>
                <button @click="clearMeme">clear</button>
            </section>
        </section>
    </main>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref, watch, computed } from 'vue'
import { useCtx } from '../composables/useCtx.composable'
import { memeService } from '@/services/meme.service'
import type { Meme } from '@/models/Meme.model'

const memeRef = ref<Meme>(null!)

const route = useRoute()
const ctx = useCtx(memeRef)

onMounted(loadMeme)
watch(memeRef, renderCanvas, {
    deep: true
})

const currLine = computed(() =>
    memeRef.value.lines[memeRef.value.currLine]
)

async function loadMeme() {
    const { id } = route.params
    memeRef.value = await memeService.getMeme(id as string)
    ctx.setContext()
    ctx.render()
}

function renderCanvas() {
    ctx.render()
    memeService.save(memeRef.value)
}

function switchLine() {
    const meme = memeRef.value
    if (meme.currLine === meme.lines.length - 1) meme.currLine = 0
    else meme.currLine++
}

function addLine() {
    const line = memeService.createLine(
        memeRef.value,
        memeRef.value.lines.length - 1
    )
    memeRef.value.lines.push(line)
}

function clearMeme() {
    memeService.clear()
    loadMeme()
}
</script>