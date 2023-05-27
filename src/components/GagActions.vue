<template>
    <section class="gag-actions" v-if="gag">
        <button @click.stop="changeRate('up')">Up: {{ gag.rate.up }}</button>
        <button @click.stop="changeRate('down')">Down: {{ gag.rate.down }}</button>
        <button @click="showComments">Comments: {{ gag.comments.length }}</button>
    </section>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Gag } from '../models/Gag.model'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const emit = defineEmits()
const props = defineProps({
    gag: {
        type: Object as PropType<Gag>,
        require: true
    }
})

function changeRate(dir: string) {
    emit('changeRate', { dir, gagId: props.gag._id })
}

function showComments() {
    const path = route.path === '/' ?
        `details/${props.gag?._id}` :
        '#comments'
    router.push(path)
}

</script>