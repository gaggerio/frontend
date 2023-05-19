<template>
    <section class="canvas-container">
        <canvas width="500" height="500" ref="canvasRef"></canvas>
    </section>
</template>

<script setup lang="ts">
import { PropType, Ref, onMounted, ref } from 'vue'
import type { Meme } from "../models/Meme.model"

const canvasRef = ref<HTMLCanvasElement | null>(null)
const emit = defineEmits()
const props = defineProps({
    meme: {
        type: Object as PropType<Meme>,
        required: true,
    }
})
onMounted(()=>{
    if (!canvasRef.value) return
    emit('ready', canvasRef.value)
})
</script>

<style scoped>
.canvas-container {
    border: 1px solid black;
    padding: 10px;
    width: max-content;
}

h1 {
    margin-bottom: 20px;
}
</style>