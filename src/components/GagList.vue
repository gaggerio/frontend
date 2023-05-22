<template>
    <ul class="gag-list">
        <GagPreview v-for="gag in gags" :key="gag._id" :gag="gag" />
    </ul>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import type { Gag } from '../models/Gag.model'
import GagPreview from './GagPreview.vue'

defineProps({
    gags: Array as PropType<Gag[]>
})
</script>