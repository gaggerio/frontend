<template>
    <header class="app-header">
        <div class="screen" v-if="isNavOpen" :class="{ open: isNavOpen }" @click="toggleNav"></div>
        <div class="logo flex items-center gap-2">
            <img :src="icons.logo" alt="LOGO">
            GAGGER
        </div>
        <button class="hamburger btn" @click="toggleNav">
            <img :src="icons.hamburger" />
        </button>

        <nav :class="{ open: isNavOpen, nav: true }">
            <RouterLink class="nav-link" v-for="link in links" :key="link.path" :to="link.path">
                {{ link.name }}
            </RouterLink>
            <section class="nav-user">
                <div v-if="loggedinUser" @click="state.showLogout = !state.showLogout">
                    <img :src="loggedinUser.imgUrl" alt="">
                    <button v-if="state.showLogout" class="c-btn" @click="onLogout">Logout</button>
                </div>
                <RouterLink to="/login" class="nav-link" v-else>
                    Login
                </RouterLink>
            </section>
        </nav>
    </header>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user.store'
import { ref, reactive, computed } from 'vue'
import { utilService } from '../services/util.service'

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