<template>
    <article class="user-preview" v-if="user">
        <img :src="user.imgUrl" alt="User">
        <h3>{{ user.username }}</h3>
    </article>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { User } from '../models/User.model'

defineProps({
    user: {
        type: Object as PropType<User>,
        require: true
    }
})
</script>