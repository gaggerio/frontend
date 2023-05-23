<template>
    <main v-if="gag">
        <router-link to="/">Back</router-link>
        <GagPreview :gag="gag" />
        <CommentList :comments="gag.comments" />
    </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { gagService } from '../services/gag.service'
import { showErrorMsg } from '../services/event-bus.service'
import type { Gag } from '../models/Gag.model'
import GagPreview from '../components/GagPreview.vue'
import CommentList from '../components/CommentList.vue'

const route = useRoute()
const gag = ref<Gag>(null!)

onMounted(async () => {
    try {
        const { id } = route.params
        gag.value = await gagService.getById(id as string)
    }
    catch (err) {
        showErrorMsg('Gag not found')
    }
})
</script>
