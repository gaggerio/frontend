<template>
    <article class="comment-preview" v-if="comment">
        <section class="main">
            <UserPreview :user="comment.createdBy" :createdAt="comment.createdAt" />
            <div class="flex items-center justify-center">
                <img :src="comment.attachments" alt="" v-if="comment.attachments">
            </div>
            <p>{{ comment.text }}</p>
        </section>
        <section class="footer">
            <router-link to="/">Reply</router-link>
            <CommentRate :comment="comment" @changeCommentRate="(data) => $emit('changeCommentRate', data)" />
        </section>
    </article>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Comment } from '../models/Comment.model'
import UserPreview from './UserPreview.vue'
import CommentRate from './CommentRate.vue'

defineProps({
    comment: {
        type: Object as PropType<Comment>,
        require: true
    }
})
</script>