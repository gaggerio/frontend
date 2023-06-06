<template>
    <main class="home-view">
        <router-link class="add-gag-btn" to="/explore">
            <AddPostSvg />
        </router-link>
        <GagList :gags="gags" @changeRate="gagStore.changeGagRate" />
    </main>
</template>

<script setup lang="ts">
import GagList from '../components/GagList.vue'
import { useGagStore } from '@/stores/gag.store'
import AddPostSvg from '../svgs/AddPostSvg.vue'

const gagStore = useGagStore()
const gags = gagStore.getGags
</script>
