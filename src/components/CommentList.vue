<template>
    <section>
        <h3>Comments {{ commentsCount }}</h3>
        <ul class="commnet-list flex column gap-1" v-if="comments">
            <CommentPreview v-for="comment in comments" :key="comment._id" :comment=comment />
        </ul>
    </section>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { Comment } from '../models/Gag.model'
import CommentPreview from './CommentPreview.vue'

const props = defineProps({
    comments: {
        type: Array as PropType<Comment[]>,
        require: true
    }
})

const commentsCount = computed(() => {
    return props.comments ? props.comments.length : 0
})
</script>