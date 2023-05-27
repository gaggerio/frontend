<template>
    <ul class="gag-list" v-if="gags">
        <li class="gag-card" v-for="gag in gags" :key="gag._id">
            <GagPreview :gag="gag" />
            <GagActions :gag="gag" @changeRate="changeRate" />
        </li>
    </ul>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Gag } from '../models/Gag.model'
import GagPreview from './GagPreview.vue'
import GagActions from './GagActions.vue'

defineProps({
    gags: Array as PropType<Gag[]>
})

const emit = defineEmits()

function changeRate(rateData: { dir: string, gagId: string }) {
    emit('changeRate', rateData)
}

</script>