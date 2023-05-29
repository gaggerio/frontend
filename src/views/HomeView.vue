<template>
    <main class="home-view">
        <router-link class="add-gag-btn" to="/explore">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="add">
                <path fill="currentColor"
                    d="M436.31,75.69A255,255,0,1,0,75.69,436.31,255,255,0,1,0,436.31,75.69ZM403.57,263.5H263.5V403.57h-15V263.5H108.43v-15H248.5V108.43h15V248.5H403.57Z">
                </path>
            </svg>
        </router-link>
        <GagList :gags="gags" @changeGagRate="gagStore.changeGagRate" />
    </main>
</template>

<script setup lang="ts">
import GagList from '../components/GagList.vue'
import { useGagStore } from '@/stores/gag.store'

const gagStore = useGagStore()
const gags = gagStore.getGags
</script>