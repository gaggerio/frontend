<template>
    <ul class="gag-list" v-if="gags">
        <li v-for="gag in gags" :key="gag._id">
            <GagPreview :gag="gag" @changeGagRate="(data) => $emit('changeGagRate', data)" />
        </li>
    </ul>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Gag } from '../models/Gag.model'
import GagPreview from './GagPreview.vue'

defineProps({
    gags: Array as PropType<Gag[]>
})
</script>