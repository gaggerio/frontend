<template>
    <section v-if="gag">
        <button @click="$emit('changeGagRate', { dir: 'up', gagId: gag._id })">Up {{ gag.rate.up.length }}</button>
        <button @click="$emit('changeGagRate', { dir: 'down', gagId: gag._id })">Down {{ gag.rate.down.length }}</button>
    </section>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Gag } from '../models/Gag.model'

defineProps({
    gag: Object as PropType<Gag>
})
</script>