<template>
    <section v-if="comment">
        <button @click="$emit('changeCommentRate', { dir: 'up', commentId: comment._id })">Up {{ comment.rate.up }}</button>
        <button @click="$emit('changeCommentRate', { dir: 'down', commentId: comment._id })">Down {{ comment.rate.down
        }}</button>
    </section>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Comment } from '../models/Comment.model'

defineProps({
    comment: Object as PropType<Comment>
})
</script>