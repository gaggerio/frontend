<template>
    <li class="gag-preview" v-if="gag" @click="goToGag">
        <section class="header flex items-center gap-1">
            <UserPreview :user="gag.createdBy" />
            <span>{{ createdAt }}</span>
        </section>
        <section class="main">
            <h2>{{ gag.title }}</h2>
            <img :src="gag.imgUrl" alt="">
        </section>
        <section class="footer">
            <span>Likes: {{ gag.rate.like }}</span>
            <span>Dislike: {{ gag.rate.dislike }}</span>
            <span @click="goToGag">Comments: {{ commentCount }}</span>
        </section>
    </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { PropType } from 'vue'
import type { Gag } from '../models/Gag.model'
import UserPreview from './UserPreview.vue'

const router = useRouter()

const props = defineProps({
    gag: {
        type: Object as PropType<Gag>,
        require: true
    },
})

const createdAt = computed<string>(() => {
    if (!props.gag) return ''
    return new Date(props.gag.createdAt).getHours().toString()
})

const commentCount = computed<number>(() => {
    return props.gag.comments.length
})

function goToGag() {
    router.push(`/details/${props.gag?._id}`)
}
</script>