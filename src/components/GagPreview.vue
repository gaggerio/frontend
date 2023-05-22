<template>
    <li class="gag-preview">
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
            <span>Comments: {{ gag.comments.length }}</span>
        </section>
    </li>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue'
import type { Gag } from '../models/Gag.model'
import UserPreview from './UserPreview.vue'

const props = defineProps({
    gag: Object as PropType<Gag>
})

const createdAt = computed(() => {
    return new Date(props.gag.createdAt).getHours()
})
</script>