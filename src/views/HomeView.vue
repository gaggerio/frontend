<template>
    <main class="home-view">
        <h1>HOT</h1>
        <router-link to="/explore">Add Post</router-link>
        <GagList :gags="gags" @changeGagRate="changeGagRate" />
    </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import GagList from '../components/GagList.vue'

const store = useStore()
const gags = computed(() => {
    return store.getters.gags
})

async function changeGagRate(rateData: { gagId: string, dir: string }) {
    store.dispatch({ type: 'changeGagRate', rateData })
}
</script>