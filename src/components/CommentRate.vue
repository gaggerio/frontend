<template>
    <section v-if="comment">
        <button @click="$emit('changeCommentRate', { dir: 'up', commentId: comment._id })">Up {{ comment.rate.up.length
        }}</button>
        <button @click="$emit('changeCommentRate', { dir: 'down', commentId: comment._id })">Down {{
            comment.rate.down.length
        }}</button>
    </section>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Comment } from '../models/Comment.model'

defineProps({
    comment: Object as PropType<Comment>
})
</script>