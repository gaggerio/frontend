<template>
    <main class="meme-generator">
        <h1>Meme generator</h1>
        <section class="flex">
            <section class="canvas-container">
                <canvas width="500" height="500" ref="canvasRef"></canvas>
            </section>

            <section class="meme-editor" v-if="memeRef">
                <input type="text" v-model="currLine.txt">
                <input type="color" v-model="currLine.strokeStyle">
                <input type="color" v-model="currLine.fillStyle">
            </section>
        </section>
    </main>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref, watch, computed } from 'vue'
import { imgService } from '../services/img.service'
import { memeService } from '../services/meme.service'
import { useCtx } from '../composables/useCtx.composable'
import type { Meme } from '@/models/Meme.model'

const route = useRoute()
const ctx = useCtx()

const memeRef = ref<Meme>(null!)
const canvasRef = ref<HTMLCanvasElement>(null!)

onMounted(async () => {
    const { id } = route.params
    const img = await imgService.getById(id as string)

    const meme = memeService.createMeme(img)
    memeRef.value = meme

    ctx.setContext(canvasRef.value)
    ctx.setMeme(meme)
    ctx.render()
})

watch(memeRef, ctx.render, {
    deep: true
})

const currLine = computed(() => {
    return memeRef.value.lines[memeRef.value.currLine]
})
</script>