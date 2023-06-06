<template>
    <div class="user-msg" :class="msg?.type" v-if="msg">
        <img :src="iconUrl" alt="" />
        <h3>{{ msg.txt }}</h3>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onUnmounted } from 'vue'
import { eventBus } from '../services/event-bus.service'
import type { MSG } from '../services/event-bus.service'
import { SHOW_MSG } from '../services/event-bus.service'
import { utilService } from '../services/util.service'

const msg = ref<MSG | null>(null)
const unsub = eventBus.on(SHOW_MSG, showMsg)

const iconUrl = computed(() => {
    if (!msg.value) return ''
    return utilService.getIcon(msg.value.type)
})

onUnmounted(() => {
    unsub()
})

function showMsg(msgData: MSG) {
    msg.value = msgData
    setTimeout(() => {
        msg.value = null
    }, 2000)
}
</script>
