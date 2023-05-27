<template>
    <main v-if="gag">
        <router-link to="/">Back</router-link>
        <GagPreview :gag="gag" />
        <GagActions :gag="gag" @changeRate="changeRate" />
        <CommentForm />
        <CommentList :comments="gag.comments"  />
    </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { showErrorMsg } from '../services/event-bus.service'
import type { Gag } from '../models/Gag.model'
import GagPreview from '../components/GagPreview.vue'
import GagActions from '../components/GagActions.vue'
import CommentList from '../components/CommentList.vue'
import CommentForm from '../components/CommentForm.vue'

const route = useRoute()
const store = useStore()

const gag = computed<Gag>(() => {
    return store.getters.currGag
})

onMounted(async () => {
    try {
        const { id } = route.params
        store.commit({ type: 'setCurrGagId', gagId: id })
    }
    catch (err) {
        showErrorMsg('Gag not found')
    } 
})

async function changeRate(rateData: { gagId: string, dir: string }) {
    store.dispatch({ type: 'changeRate', rateData })
}
</script>