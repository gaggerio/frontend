<template>
    <main class="home-view">
        <h1>HOT</h1>
        <GagList :gags="gags"/>
    </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import GagList from '../components/GagList.vue'

const store = useStore()
const gags = computed(() => {
    return store.getters.getGags
})
</script>