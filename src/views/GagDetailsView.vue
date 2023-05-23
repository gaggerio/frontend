<template>
    <h1>Details</h1>
    <pre>{{ gag }}</pre>
    <router-link to="/">Back</router-link>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { gagService } from '../services/gag.service'
import { showErrorMsg } from '../services/event-bus.service'
import type { Gag } from '../models/Gag.model'

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
