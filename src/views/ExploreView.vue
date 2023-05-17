<template>
    <main class="explore-view">
        <h1>Image Gallery</h1>
        <ul class="img-gallery">
            <li class="img-preview" v-for="img in imgs" :key="img._id" @click="onImgSelect(img._id)">
                <img :src="img.url" alt="">
            </li>
        </ul>
    </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Img } from '../models/Img.model'
import { imgService } from '../services/img.service'

const router = useRouter()
const imgs = ref<Img | null>(null)
onMounted(async () => {
    try {
        imgs.value = await imgService.query()
    }
    catch (err) {
        console.log('error', err)
    }
})

function onImgSelect(imgId: string) {
    router.push(`/editor/${imgId}`)
}
</script>