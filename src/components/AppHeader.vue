<template>
    <header class="app-header">
        <!-- <div class="screen" v-if="isNavOpen" :class="{ open: isNavOpen }" @click="toggleNav"></div> -->
        <div class="hamburger">
            <svg @click="toggleNav" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="hamburger-menu">
                <path fill="currentColor"
                    d="M5 7h14c.6 0 1-.4 1-1s-.4-1-1-1H5c-.6 0-1 .4-1 1s.4 1 1 1zm0 6h14c.6 0 1-.4 1-1s-.4-1-1-1H5c-.6 0-1 .4-1 1s.4 1 1 1zm0 6h14c.6 0 1-.4 1-1s-.4-1-1-1H5c-.6 0-1 .4-1 1s.4 1 1 1z">
                </path>
            </svg>
        </div>
        <div class="logo flex items-center gap-2">
            GAGGER
        </div>

        <!-- <nav :class="{ open: isNavOpen, nav: true }">
            
        </nav> -->
    </header>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user.store'
import { ref, reactive, computed } from 'vue'
import { utilService } from '../services/util.service'
import HamburgerSvg from './HamburgerSvg.vue'

const userStore = useUserStore()

const isNavOpen = ref(false)

const state = reactive({
    isNavOpen: false,
    showLogout: false
})


const links = ref(utilService.getHeaderLinks())
const icons = {
    logo: utilService.getIcon('logo'),
    hamburger: utilService.getIcon('hamburger')
}

const loggedinUser = computed(() => {
    return userStore.getLoggedinUser
})

function toggleNav() {
    isNavOpen.value = !isNavOpen.value
}

function onLogout() {
    userStore.logout()
}
</script>