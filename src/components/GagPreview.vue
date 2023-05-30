<template>
    <article class="gag-preview" v-if="gag" @click="$router.push(`/details/${gag._id}`)">
        <section class="header">
            <UserPreview :user="gag.createdBy" :createdAt="gag.createdAt" />
            <h2>{{ gag.title }}</h2>
        </section>
        <section class="main">
            <img :src="gag.imgUrl" alt="">
        </section>
        <section class="footer">
            <RateCmp :item="gag" @changeRate="(data) => $emit('changeRate', data)" />
            <button class="btn comment" @click="$router.push(`details/${gag._id}`)">
                <CommentSvg />
                {{ gag.comments.length || '•' }}
            </button>
        </section>
    </article>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Gag } from '../models/Gag.model'
import UserPreview from './UserPreview.vue'
import RateCmp from './RateCmp.vue'
import CommentSvg from '../svgs/CommentSvg.vue'

defineEmits([
    'changeRate'
])

defineProps({
    gag: {
        type: Object as PropType<Gag>,
        require: true
    },
})
</script>