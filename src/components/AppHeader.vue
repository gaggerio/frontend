<template>
    <header class="app-header">
        <!-- <div class="screen" v-if="isNavOpen" :class="{ open: isNavOpen }" @click="toggleNav"></div> -->
        <section class="go-back flex items-center gap-1" v-if="showBack">
            <router-link to="/">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6.35 6.35" id="UpArrow">
                    <path
                        d="m 3.1671875,0.5344269 a 0.26460996,0.26460996 0 0 0 -0.179688,0.078125 L 0.60664052,2.9934112 a 0.26460996,0.26460996 0 0 0 0.1875,0.4511719 H 1.8527345 V 5.552005 a 0.26460996,0.26460996 0 0 0 0.263672,0.2636719 h 2.117187 A 0.26460996,0.26460996 0 0 0 4.4992185,5.552005 V 3.4445831 h 1.056641 a 0.26460996,0.26460996 0 0 0 0.1875,-0.4511719 l -2.38086,-2.3808593 a 0.26460996,0.26460996 0 0 0 -0.195312,-0.078125 z m 0.00781,0.6386719 1.744141,1.7421874 h -0.685547 a 0.26460996,0.26460996 0 0 0 -0.263672,0.265625 V 5.28638 h -1.58789 V 3.1809112 a 0.26460996,0.26460996 0 0 0 -0.265625,-0.265625 h -0.683594 z"
                        font-family="sans-serif" font-weight="400" overflow="visible" paint-order="markers fill stroke"
                        style="line-height:normal;font-variant-ligatures:normal;font-variant-position:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-alternates:normal;font-variant-east-asian:normal;font-feature-settings:normal;font-variation-settings:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000;text-transform:none;text-orientation:mixed;shape-padding:0;shape-margin:0;inline-size:0;isolation:auto;mix-blend-mode:normal"
                        fill="currentColor" class="color000000 svgShape"></path>
                </svg>
            </router-link>
            Post
        </section>
        <section v-else class="flex">
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
        </section>

        <!-- <nav :class="{ open: isNavOpen, nav: true }">
            
        </nav> -->
    </header>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user.store'
import { ref, reactive, computed } from 'vue'
import { utilService } from '../services/util.service'
import HamburgerSvg from './HamburgerSvg.vue'
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const route = useRoute()

const isNavOpen = ref(false)

const state = reactive({
    isNavOpen: false,
    showLogout: false
})

const showBack = computed(() => {
    return route.path.includes('details')
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