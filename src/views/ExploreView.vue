<template>
    <main class="explore-view">
        <h1>Image Gallery</h1>
        <ul class="img-gallery" v-if="imgs">
            <li class="img-preview" v-for="img in imgs" :key="img._id" @click="onImgSelect(img._id)">
                <img :src="img.url" alt="">
            </li>
        </ul>
    </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Img } from '../models/Img.model'
import { imgService } from '../services/img.service'
import { onMounted, ref } from 'vue'
import { showErrorMsg } from '@/services/event-bus.service'

const router = useRouter()
const imgs = ref<Img[]>(null!)

onMounted(async () => {
    try {
        imgs.value = await imgService.query()
    }
    catch (err) {
        showErrorMsg('Error loading imgs...')
    }
})

function onImgSelect(imgId: string) {
    router.push(`/editor/${imgId}`)
}
</script>