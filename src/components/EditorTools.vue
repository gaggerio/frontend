<template>
    <section class="meme-editor">
        <input type="text" placeholder="Write text" v-model="currLineTxt">
    </section>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue'
import { Meme } from '../models/Meme.model'

const emit = defineEmits()
const props = defineProps({
    meme: {
        type: Object as PropType<Meme>,
        required: true,
    }
})

const currLineTxt = computed({
    get() {
        return props.meme.lines[props.meme.currLine].txt
    },
    set(value) {
        props.meme.lines[props.meme.currLine].txt = value
        emit('update')
    }
})
</script>