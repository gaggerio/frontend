<template>
    <article class="user-preview" v-if="user">
        <img :src="user.imgUrl" alt="User">
        <h3>{{ user.fullname }}</h3>
    </article>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import type { User } from '../models/User.model'
const props = defineProps({
    user: {
        type: Object as PropType<User>,
        require: true
    }
})
</script>