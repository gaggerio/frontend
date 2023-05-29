<template>
    <UserMsg />
    <AppHeader />
    <RouterView />
</template>


<script lang="ts" setup>
import { useUserStore } from './stores/user.store'
import { useGagStore } from './stores/gag.store'
import AppHeader from './components/AppHeader.vue'
import UserMsg from './components/UserMsg.vue'

const userStore = useUserStore()
const gagStore = useGagStore()

gagStore.loadGags({ txt: '' })
userStore.loadLoggedinUser()
</script>