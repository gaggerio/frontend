<template>
    <main class="explore-view">
        <ImgFilter @file-select="goToEditor" />
        <ImgGallery :imgs="imgs" />
    </main>
</template>

<script setup lang="ts">
import type { Img } from '../models/Img.model'
import { imgService } from '../services/img.service'
import { onMounted, ref } from 'vue'
import { showErrorMsg } from '@/services/event-bus.service'
import ImgGallery from '../components/ImgGallery.vue'
import ImgFilter from '../components/ImgFilter.vue'
import { uploadImg } from '@/services/upload.service'

const imgs = ref<Img[]>()

onMounted(async () => {
    try {
        imgs.value = await imgService.query()
    }
    catch (err) {
        showErrorMsg('Error loading imgs...')
    }
})

async function goToEditor(file: File) {
    try {
        const data = await uploadImg(file)
        if (!data) return

    }
    catch (err) {
        console.log('error', err)
    }
}
</script>