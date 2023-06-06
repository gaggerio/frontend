<template>
    <form class="comment-form" @submit.prevent="saveComment">
        <section class="flex items-center gap-1">
            <div class="file">
                <CameraSvg />
                <input type="file" @change="handleFile" />
            </div>
            <div class="file">
                <GifSvg />
            </div>
        </section>
        <section class="text">
            <textarea v-model="text" placeholder="Post a comment..."></textarea>
            <button class="post">Post</button>
        </section>
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CameraSvg from '../svgs/CameraSvg.vue'
import GifSvg from '../svgs/GifSvg.vue'

const emit = defineEmits(['saveComment'])

const text = ref<string>('')
const file = ref<File>()

function handleFile(ev: Event) {
    const files = (ev.target as HTMLInputElement).files
    if (!files) return
    file.value = files[0]
}

function saveComment() {
    emit('saveComment', { text: text.value, file: file.value })
}
</script>
