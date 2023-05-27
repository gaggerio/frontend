<template>
    <section ref="commentsRef">
        <h3>Comments {{ commentsCount }}</h3>
        <ul class="commnet-list flex column gap-1" v-if="comments">
            <li v-for="comment in comments" :key="comment._id">
                <CommentPreview :comment=comment />
                <section class="footer flex gap-1">
                    <router-link to="/">Reply</router-link>
                    <CommentRate :comment="comment" @changeCommentRate="(data) => $emit('changeCommentRate', data)" />
                    <button>:</button>
                </section>
            </li>
        </ul>
    </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { PropType } from 'vue'
import type { Comment } from '../models/Comment.model'
import CommentPreview from './CommentPreview.vue'
import CommentRate from './CommentRate.vue'

const commentsRef = ref<HTMLElement | null>(null)
const props = defineProps({
    comments: {
        type: Array as PropType<Comment[]>,
        require: true
    },
})

onMounted(() => {
    if (!commentsRef.value) return
    commentsRef.value.scrollIntoView({ behavior: 'smooth' })

})
const commentsCount = computed(() => {
    return props.comments ? props.comments.length : 0
})
</script>