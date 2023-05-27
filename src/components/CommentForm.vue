<template>
    <form @submit.prevent="postComment">
        <input type="file" @change="handleFile">
        <input type="text" v-model="text" placeholder="Comment on post">
        <button>Post</button>
    </form>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { showSuccessMsg } from '../services/event-bus.service'
import { ref } from 'vue'

const store = useStore()
const text = ref<string>('')
const file = ref<File>(null!)

async function postComment() {
    try {
        store.dispatch({
            type: 'saveComment',
            commentForm: {
                text: text.value,
                file: file.value
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
    file.value = files[0]
}
</script>