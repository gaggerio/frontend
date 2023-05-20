<template>
    <main class="meme-generator">
        <h1>Meme generator</h1>
        <section class="flex">
            <section class="canvas-container">
                <canvas width="500" height="500" :ref="ctx.canvasRef"></canvas>
            </section>

            <section class="meme-editor" v-if="meme">
                <input type="text" v-model="currLine.txt">
                <input type="color" v-model="currLine.strokeStyle">
                <input type="color" v-model="currLine.fillStyle">
                <button @click="memeService.switchLine">Switch line</button>
            </section>
        </section>
    </main>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref, watch, computed } from 'vue'
import { useCtx } from '../composables/useCtx.composable'
import { memeService } from '@/services/meme.service'

const route = useRoute()
const ctx = useCtx()

onMounted(async () => {
    const { id } = route.params
    await memeService.getMeme(id)
    ctx.setContext()
    ctx.render()
})

const meme = memeService.MEME
const currLine = computed(() => meme.value.lines[meme.value.currLine])

watch(meme, () => {
    ctx.render()
    memeService.saveMeme()
}, { deep: true })
</script>