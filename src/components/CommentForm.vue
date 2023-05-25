<template>
    <form @submit.prevent="postComment">
        <input type="file" @change="handleFile">
        <input type="text" v-model="comment.text">
        <button>Post</button>
    </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { uploadImg } from '../services/upload.service'
import type { CommentForm } from '../models/Comment.model'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { showSuccessMsg } from '../services/event-bus.service'

const store = useStore()
const route = useRoute()

const comment = reactive<CommentForm>({
    text: '',
    file: null!
})

async function postComment() {
    try {
        const { url } = await uploadImg(comment.file)
        const { id } = route.params
        store.dispatch({
            type: 'addComment', commentForm: {
                text: comment.text,
                fileUrl: url,
                gagId: id
            }
        })
        showSuccessMsg('Comment Posted')
    }
    catch (err) {
        console.log('Error posting comment', err)
        showSuccessMsg('Failed to post comment')
    }
}

function handleFile(ev: Event) {
    const files = (ev.target as HTMLInputElement).files
    if (!files) return
    comment.file = files[0]
}
</script>