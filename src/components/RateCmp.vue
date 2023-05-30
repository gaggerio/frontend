<template>
    <section v-if="item" class="item-rate">
        <button class="btn" :class="{ active: isUp }" @click.stop="upvote">
            <ArrowSvg :is-active="isUp" />
            {{ item.rate.up.length || '•' }}
        </button>
        <button class="btn" :class="{ active: isDown }" @click.stop="downvote">
            <ArrowSvg :is-active="isDown" :direction="'down'" />
            {{ item.rate.down.length || '•' }}
        </button>
    </section>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Comment } from '../models/Comment.model'
import type { Gag } from '@/models/Gag.model'
import { computed } from 'vue'
import { useUserStore } from '@/stores/user.store'
import ArrowSvg from '../svgs/ArrowSvg.vue'

const props = defineProps({
    item: Object as PropType<Comment | Gag>
})

const emit = defineEmits([
    'changeRate'
])

const userStore = useUserStore()
const user = userStore.getLoggedinUser

const isUp = computed(() => {
    if (!user || !props.item) return false
    return props.item.rate.up.includes(user._id)
})

const isDown = computed(() => {
    if (!user || !props.item) return false
    return props.item.rate.down.includes(user._id)
})

function upvote() {
    emit('changeRate', { dir: 'up', itemId: props.item?._id })
}

function downvote() {
    emit('changeRate', { dir: 'down', itemId: props.item?._id })
}
</script>