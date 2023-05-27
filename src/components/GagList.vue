<template>
    <ul class="gag-list" v-if="gags">
        <li class="gag-card" v-for="gag in gags" :key="gag._id">
            <GagPreview :gag="gag" />
            <GagRate :gag="gag" @changeGagRate="(data) => $emit('changeGagRate', data)" />
            <button @click="$router.push(`details/${gag._id}`)">Comments: {{ gag.comments.length }}</button>
        </li>
    </ul>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Gag } from '../models/Gag.model'
import GagPreview from './GagPreview.vue'
import GagRate from './GagRate.vue'

defineProps({
    gags: Array as PropType<Gag[]>
})
</script>