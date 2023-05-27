<template>
    <main class="home-view">
        <h1>HOT</h1>
        <router-link to="/explore">Add Post</router-link>
        <GagList :gags="gags" @changeRate="changeRate" />
    </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import GagList from '../components/GagList.vue'
import { showErrorMsg } from '@/services/event-bus.service'

const store = useStore()
const gags = computed(() => {
    return store.getters.gags
})

async function changeRate(rateData: { gagId: string, dir: string }) {
    store.dispatch({ type: 'changeRate', rateData })
}
</script>