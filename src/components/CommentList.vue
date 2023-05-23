<template>
    <ul class="commnet-list flex column gap-1" v-if="comments">
        <CommentPreview v-for="comment in comments" :key="comment._id" :comment=comment />
    </ul>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Comment } from '../models/Gag.model'
import CommentPreview from './CommentPreview.vue'

defineProps({
    comments: {
        type: Array as PropType<Comment[]>,
        require: true
    }
})
</script>