<template>
    <div class="img-filter">
        <input type="search" class="c-input" v-model="txt" placeholder="Search templates" />
        <button class="file c-btn">
            <CameraSvg />
            <input type="file" @change="handleFile">
        </button>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import CameraSvg from '../svgs/CameraSvg.vue'

const emit = defineEmits([
    'filterImgs',
    'fileSelect'
])

const txt = ref<string>('')
const file = ref<File>()

function handleFile(ev: Event) {
    const files = (ev.target as HTMLInputElement).files
    if (!files) return
    file.value = files[0]
    emit('fileSelect', file.value)
}

// function filterImg() {
//     emit('filterImgs', txt.value)
// }
</script>