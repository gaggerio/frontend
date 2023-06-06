<template>
    <ul class="comment-list" v-if="comments">
        <section class="list-header" ref="commentsRef">
            <div class="ads comment-preview">Ads go here</div>
            <div class="title">
                <h3>Comments {{ commentsCount }}</h3>
                <span>Remember to follow comunity guidlines</span>
            </div>
        </section>
        <li v-for="comment in comments" :key="comment._id">
            <CommentPreview
                :comment="comment"
                @changeRate="(data) => $emit('changeRate', data)"
            />
        </li>
    </ul>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { PropType } from 'vue'
import type { Comment } from '../models/Comment.model'
import CommentPreview from './CommentPreview.vue'

const props = defineProps({
    comments: {
        type: Array as PropType<Comment[]>,
        require: true,
    },
})

const commentsRef = ref<HTMLElement | null>(null)

onMounted(() => {
    if (!commentsRef.value) return
    commentsRef.value.scrollIntoView({ behavior: 'smooth' })
})

const commentsCount = computed(() => {
    return props.comments ? props.comments.length : 0
})
</script>
