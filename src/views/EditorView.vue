<template>
    <main class="meme-generator">
        <h1>Meme generator</h1>
        <section class="canvas-container">
            <canvas width="500" height="500" ref="canvasRef"></canvas>
        </section>
    </main>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { imgService } from '../services/img.service'
import { useCanvas } from '../composables/useCanvas.composable'
import type { UseCanvas } from '../composables/useCanvas.composable'
import { memeService } from '../services/meme.service'

const route = useRoute()
const { canvasRef, ctxRef, renderMeme }: UseCanvas = useCanvas()

onMounted(async () => {
    const { id } = route.params
    const img = await imgService.getById(id as string)

    if (!canvasRef.value) return
    ctxRef.value = canvasRef.value.getContext('2d')

    const meme = memeService.createMeme(
        canvasRef.value.width,
        canvasRef.value.height,
        img.url
    )
    renderMeme(meme)
})
</script>

<style scoped>
.canvas-container {
    border: 1px solid black;
    padding: 10px;
    width: max-content;
}

h1 {
    margin-bottom: 20px;
}
</style>