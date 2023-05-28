<template>
    <main class="home-view">
        <h1>HOT</h1>
        <router-link to="/explore">Add Post</router-link>
        <GagList :gags="gags" @changeGagRate="gagStore.changeGagRate" />
    </main>
</template>

<script setup lang="ts">
import GagList from '../components/GagList.vue'
import { useGagStore } from '@/stores/gag.store'

const gagStore = useGagStore()
const gags = gagStore.getGags
</script>