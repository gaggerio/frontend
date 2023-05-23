<template>
    <li class="comment-preview flex column gap-1" v-if="comment">
        <section class="header flex items-center gap-1">
            <UserPreview :user="comment.createdBy" />
            <span>{{ createdAt }}</span>
        </section>
        <section class="main">
            <p>{{ comment.text }}</p>
        </section>
        <section class="footer flex gap-1">
            <router-link to="/">Reply</router-link>
            <button>Up {{ comment.rate.like }}</button>
            <button>Down {{ comment.rate.dislike }}</button>
            <button>:</button>
        </section>
    </li>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Comment } from '../models/Gag.model'
import UserPreview from './UserPreview.vue'
import { computed } from 'vue'

const props = defineProps({
    comment: {
        type: Object as PropType<Comment>,
        require: true
    }
})

const createdAt = computed(() => {
    return new Date(props.comment.createdAt).getHours()
})
</script>