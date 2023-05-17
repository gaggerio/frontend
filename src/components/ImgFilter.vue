<template>
    <section class="img-filter">
        <form @submit.prevent="filterImg" class="img-filter__form flex gap-1">
            <input type="search" class="c-input" v-model="filterBy.txt" placeholder="Search img" />
            <button class="c-btn">
                Search
            </button>
        </form>
    </section>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

const filterBy = reactive({
    txt: ''
})

const emit = defineEmits([
    'filterImgs'
])

function filterImg() {
    emit('filterImgs', { ...filterBy })
}
</script>