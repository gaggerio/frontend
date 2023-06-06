<template>
    <article class="comment-preview" v-if="comment">
        <section class="header">
            <UserPreview
                :user="comment.createdBy"
                :createdAt="comment.createdAt"
            />
        </section>
        <section class="main">
            <div class="flex items-center justify-center">
                <img
                    :src="comment.attachments"
                    alt=""
                    v-if="comment.attachments"
                />
            </div>
            <p>{{ comment.text }}</p>
        </section>
        <section class="footer">
            <RateCmp
                :item="comment"
                @changeRate="(data) => $emit('changeRate', data)"
            />
            <router-link class="reply" to="/">Replies</router-link>
        </section>
    </article>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Comment } from '../models/Comment.model'
import UserPreview from './UserPreview.vue'
import RateCmp from './RateCmp.vue'

defineProps({
    comment: {
        type: Object as PropType<Comment>,
        require: true,
    },
})
</script>
