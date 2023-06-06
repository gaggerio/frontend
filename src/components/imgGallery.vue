<template>
    <ul class="img-gallery" v-if="imgs">
        <li
            class="img-preview"
            v-for="img in imgs"
            :key="img._id"
            @click="onImgSelect(img._id as string)"
        >
            <img :src="img.url" alt="" />
        </li>
    </ul>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Img } from '../models/Img.model'
import { useRouter } from 'vue-router'

defineProps({
    imgs: {
        type: Array as PropType<Img[]>,
        require: true,
    },
})

const router = useRouter()

function onImgSelect(imgId: string) {
    router.push(`/editor/${imgId}`)
}
</script>
