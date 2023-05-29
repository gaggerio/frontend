<template>
    <article class="user-preview" v-if="user">
        <div  class="img-container" :style="{ backgroundImage: `url(${user.imgUrl})` }">
        </div>
        <div class="flex items-end gap-1">
            <h3>{{ user.username }}</h3>
            <span>{{ createdAt }}</span>
        </div>
    </article>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { User } from '../models/User.model'
import { utilService } from '@/services/util.service'
import { useRoute } from 'vue-router';

const props = defineProps({
    user: {
        type: Object as PropType<User>,
        require: true
    },
    createdAt: {
        type: Number
    }
})

const createdAt = computed<string>(() => {
    return utilService.timeAgo(props.createdAt)
})

const shouldShow = computed(() => {
    return useRoute().path === '/'
})
</script>