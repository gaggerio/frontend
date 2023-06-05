<template>
    <article class="user-preview" v-if="user">
        <div class="img-container" :style="{ backgroundImage: `url(${user.imgUrl})` }">
        </div>
        <div class="flex items-end gap-1">
            <h3>{{ user.username }}</h3>
            <span>{{ createdAt }}</span>
        </div>
    </article>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { MiniUser } from '../models/User.model'
import { utilService } from '@/services/util.service'
import { useRoute } from 'vue-router';

const props = defineProps({
    user: {
        type: Object as PropType<MiniUser>,
        require: true
    },
    createdAt: {
        type: Number
    }
})

const route = useRoute()

const createdAt = computed<string>(() => {
    if (route.name === 'editor') return ''
    if (!props.createdAt) return ''
    return utilService.timeAgo(props.createdAt)
})

const shouldShow = computed(() => {
    return useRoute().path === '/'
})
</script>