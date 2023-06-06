<template>
    <header class="app-header">
        <!-- <div class="screen" v-if="isNavOpen" :class="{ open: isNavOpen }" @click="toggleNav"></div> -->
        <section class="go-back flex items-center gap-1" v-if="showBack">
            <button @click="$router.go(-1)">
                <ArrowSvg :direction="'left'" />
            </button>
            {{ getTitle }}
        </section>
        <section v-else class="menu">
            <HamburgerSvg @click="toggleNav" class="hamburger" />
            <span class="logo">GAGGER</span>
        </section>
        <!-- <nav :class="{ open: isNavOpen, nav: true }">
            
        </nav> -->
    </header>
</template>

<script lang="ts" setup>
// import { useUserStore } from '@/stores/user.store'
import { ref, computed } from 'vue'
// import { utilService } from '../services/util.service'
import HamburgerSvg from '../svgs/HamburgerSvg.vue'
import { useRoute } from 'vue-router'
import ArrowSvg from '../svgs/ArrowSvg.vue'

// const userStore = useUserStore()
const route = useRoute()
// const router = useRouter()

const isNavOpen = ref(false)
// const currRoute = ref('')

// const state = reactive({
//     isNavOpen: false,
//     showLogout: false
// })

const showBack = computed(() => {
    return route.path !== '/'
})

// const links = ref(utilService.getHeaderLinks())
// const icons = {
//     logo: utilService.getIcon('logo'),
//     hamburger: utilService.getIcon('hamburger')
// }

// const loggedinUser = computed(() => {
//     return userStore.getLoggedinUser
// })

const getTitle = computed(() => {
    const titles: { [name: string]: string } = {
        explore: 'Explore templates',
        details: 'Post',
        editor: 'Edit',
    }
    return titles[route.name as string]
})

function toggleNav() {
    isNavOpen.value = !isNavOpen.value
}

// function onLogout() {
//     userStore.logout()
// }
</script>
