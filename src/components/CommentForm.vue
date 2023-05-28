<template>
    <form @submit.prevent="$emit('saveComment', { text, file })">
        <input type="file" @change="handleFile">
        <input type="text" v-model="text" placeholder="Comment on post">
        <button>Post</button>
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const text = ref<string>('')
const file = ref<File>(null!)

function handleFile(ev: Event) {
    const files = (ev.target as HTMLInputElement).files
    if (!files) return
    file.value = files[0]
}
</script>