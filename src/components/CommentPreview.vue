<template>
    <article class="comment-preview flex column gap-1" v-if="comment">
        <section class="header flex items-center gap-1">
            <UserPreview :user="comment.createdBy" />
            <span>{{ createdAt }}</span>
        </section>
        <section class="main">
            <img :src="comment.attachments" alt="" v-if="comment.attachments">
            <p>{{ comment.text }}</p>
        </section>
    </article>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Comment } from '../models/Comment.model'
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