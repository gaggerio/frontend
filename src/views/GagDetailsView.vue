<template>
    <main v-if="gag">
        <GagPreview :gag="gag" @changeGagRate="gagStore.changeGagRate" />
        <CommentForm @saveComment="commentStore.saveComment" />
        <CommentList
            :comments="comments"
            @changeRate="commentStore.changeCommentRate"
        />
    </main>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGagStore } from '@/stores/gag.store'
import { useCommentStore } from '@/stores/comment.store'
import { showErrorMsg } from '../services/event-bus.service'
import GagPreview from '../components/GagPreview.vue'
import CommentList from '../components/CommentList.vue'
import CommentForm from '../components/CommentForm.vue'

const route = useRoute()
const gagStore = useGagStore()
const commentStore = useCommentStore()

const gag = computed(() => {
    return gagStore.getCurrGag
})

const comments = computed(() => {
    return commentStore.getComments
})

onMounted(async () => {
    try {
        const { id } = route.params
        gagStore.setCurrGagId(id as string)
        await commentStore.setComments(id as string)
    } catch (err) {
        showErrorMsg('Gag not found')
    }
})
</script>
