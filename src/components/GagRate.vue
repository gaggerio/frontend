<template>
    <section v-if="gag" class="gag-rate">
        <button class="btn" :class="{ active: isUp }" @click.stop="upvote">
            <svg :class="{ active: isUp }" class="up" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6.35 6.35"
                id="UpArrow">
                <path
                    d="m 3.1671875,0.5344269 a 0.26460996,0.26460996 0 0 0 -0.179688,0.078125 L 0.60664052,2.9934112 a 0.26460996,0.26460996 0 0 0 0.1875,0.4511719 H 1.8527345 V 5.552005 a 0.26460996,0.26460996 0 0 0 0.263672,0.2636719 h 2.117187 A 0.26460996,0.26460996 0 0 0 4.4992185,5.552005 V 3.4445831 h 1.056641 a 0.26460996,0.26460996 0 0 0 0.1875,-0.4511719 l -2.38086,-2.3808593 a 0.26460996,0.26460996 0 0 0 -0.195312,-0.078125 z m 0.00781,0.6386719 1.744141,1.7421874 h -0.685547 a 0.26460996,0.26460996 0 0 0 -0.263672,0.265625 V 5.28638 h -1.58789 V 3.1809112 a 0.26460996,0.26460996 0 0 0 -0.265625,-0.265625 h -0.683594 z"
                    font-family="sans-serif" font-weight="400" overflow="visible" paint-order="markers fill stroke"
                    style="line-height:normal;font-variant-ligatures:normal;font-variant-position:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-alternates:normal;font-variant-east-asian:normal;font-feature-settings:normal;font-variation-settings:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000;text-transform:none;text-orientation:mixed;shape-padding:0;shape-margin:0;inline-size:0;isolation:auto;mix-blend-mode:normal"
                    fill="currentColor" class="color000000 svgShape"></path>
            </svg>
            {{ gag.rate.up.length || '•' }}
        </button>
        <button class="btn" :class="{ active: isDown }" @click.stop="downvote">
            <svg :class="{ active: isDown }" class="down" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6.35 6.35"
                id="UpArrow">
                <path
                    d="m 3.1671875,0.5344269 a 0.26460996,0.26460996 0 0 0 -0.179688,0.078125 L 0.60664052,2.9934112 a 0.26460996,0.26460996 0 0 0 0.1875,0.4511719 H 1.8527345 V 5.552005 a 0.26460996,0.26460996 0 0 0 0.263672,0.2636719 h 2.117187 A 0.26460996,0.26460996 0 0 0 4.4992185,5.552005 V 3.4445831 h 1.056641 a 0.26460996,0.26460996 0 0 0 0.1875,-0.4511719 l -2.38086,-2.3808593 a 0.26460996,0.26460996 0 0 0 -0.195312,-0.078125 z m 0.00781,0.6386719 1.744141,1.7421874 h -0.685547 a 0.26460996,0.26460996 0 0 0 -0.263672,0.265625 V 5.28638 h -1.58789 V 3.1809112 a 0.26460996,0.26460996 0 0 0 -0.265625,-0.265625 h -0.683594 z"
                    font-family="sans-serif" font-weight="400" overflow="visible" paint-order="markers fill stroke"
                    style="line-height:normal;font-variant-ligatures:normal;font-variant-position:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-alternates:normal;font-variant-east-asian:normal;font-feature-settings:normal;font-variation-settings:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000;text-transform:none;text-orientation:mixed;shape-padding:0;shape-margin:0;inline-size:0;isolation:auto;mix-blend-mode:normal"
                    fill="currentColor" class="color000000 svgShape"></path>
            </svg>
            {{ gag.rate.down.length || '•' }}
        </button>
    </section>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Gag } from '../models/Gag.model'
import { computed } from 'vue'
import { useUserStore } from '@/stores/user.store'

const props = defineProps({
    gag: Object as PropType<Gag>
})

const emit = defineEmits([
    'changeGagRate'
])

const userStore = useUserStore()
const user = userStore.getLoggedinUser

const isUp = computed(() => {
    if (!user || !props.gag) return false
    return props.gag.rate.up.includes(user._id)
})

const isDown = computed(() => {
    if (!user || !props.gag) return false
    return props.gag.rate.down.includes(user._id)
})

function upvote() {
    emit('changeGagRate', { dir: 'up', gagId: props.gag?._id })
}

function downvote() {
    emit('changeGagRate', { dir: 'down', gagId: props.gag?._id })
}
</script>