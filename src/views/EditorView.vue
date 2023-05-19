<template>
    <main class="meme-generator">
        <h1>Meme generator</h1>
        <section class="flex" v-if="memeRef">
            <CanvasCmp :meme="memeRef" @ready="ctx.setContext"/>
            <EditorTools v-model:meme="memeRef" @update="ctx.render"/>
        </section>
    </main>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { imgService } from '../services/img.service'
import { memeService } from '../services/meme.service'
import { useCtx } from '../composables/useCtx.composable'
import type { Meme } from '@/models/Meme.model'
import CanvasCmp from '../components/CanvasCmp.vue'
import EditorTools from '../components/EditorTools.vue'

const route = useRoute()
const ctx = useCtx()

const memeRef = ref<Meme | null>(null)

onMounted(async () => {
    const { id } = route.params
    const img = await imgService.getById(id as string)

    const meme = memeService.createMeme(img)
    memeRef.value = meme

    ctx.setMeme(meme)
    ctx.render()
})
</script>