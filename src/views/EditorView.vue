<template>
    <main class="editor-view">
        <section class="canvas-container gag-preview">
            <section class="header">
                <UserPreview v-if="user" :user="user" />
                <div class="flex gap-1">
                    <input class="c-input grow" type="text" placeholder="Title..." v-model="gagTitle">
                    <button class="c-btn post" @click="postMeme">Post</button>
                </div>
            </section>
            <canvas :ref="ctx.elCanvas" @mousemove="ctx.onMouseOver" @mousedown="ctx.onMouseDown"
                @mouseup="ctx.onMouseUp"></canvas>
        </section>
        <section class="meme-editor" v-if="meme">
            <div>
                <section class="header">
                    <input type="text" class="c-input" v-model="currLine.txt" @input="memeStore.saveMoves">
                </section>
                <section class="actions">
                    <button class="c-btn" @click="memeStore.switchLine">
                        <img src="https://res.cloudinary.com/dokgseqgj/image/upload/v1685437460/switch_d5ub71.ico" alt="">
                    </button>
                    <button class="c-btn" @click="memeStore.addLine">
                        <img src="https://res.cloudinary.com/dokgseqgj/image/upload/v1685437941/add_sitydf.ico" alt="">
                    </button>
                    <button class="c-btn" @click="memeStore.removeLine">
                        <img src="https://res.cloudinary.com/dokgseqgj/image/upload/v1685438035/delete_i6rw0s.ico" alt="">
                    </button>
                    <button class="c-btn" @click="memeStore.undo">
                        <img src="https://res.cloudinary.com/dokgseqgj/image/upload/v1685445166/undo_lhrr1z.ico" alt="">
                    </button>
                </section>
                <section class="edits">
                    <button class="c-btn">
                        <input type="color" v-model="currLine.strokeStyle" class="color-picker"
                            @change="memeStore.saveMoves">
                        <img src="https://res.cloudinary.com/dokgseqgj/image/upload/v1685438264/brush_nmfgnk.ico" alt="">
                    </button>
                    <button class="c-btn">
                        <input type="color" v-model="currLine.fillStyle" class="color-picker" @change="memeStore.saveMoves">
                        <img src="https://res.cloudinary.com/dokgseqgj/image/upload/v1685438570/fill_aqjfnt.ico" alt="">
                    </button>
                    <button class="c-btn" @click="memeStore.setFontSize(5)">
                        <img src="https://res.cloudinary.com/dokgseqgj/image/upload/v1685439066/increase-text-size_tnyqsu.ico"
                            alt="">
                    </button>
                    <button class="c-btn" @click="memeStore.setFontSize(-5)">
                        <img src="https://res.cloudinary.com/dokgseqgj/image/upload/v1685439047/decrease-text-size_tke5a2.ico"
                            alt="">
                    </button>
                </section>
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onMounted, watch, computed, ref, onUnmounted } from 'vue'
import { useCtx } from '../composables/useCtx.composable'
import { useMemeStore } from '../composables/useMemeStore.composable'
import { showErrorMsg, showSuccessMsg } from '@/services/event-bus.service'
import { uploadImg } from '@/services/upload.service'
import { useGagStore } from '@/stores/gag.store'
import { useUserStore } from '@/stores/user.store'
import UserPreview from '@/components/UserPreview.vue'

const route = useRoute()
const router = useRouter()
const ctx = useCtx()

const gagStore = useGagStore()
const userStore = useUserStore()
const memeStore = useMemeStore()

const meme = memeStore.getMeme()
const gagTitle = ref<string>('')

const currLine = computed(() => {
    return meme.value.lines[meme.value.currLine]
})

const user = computed(() => {
    return userStore.loggedinUser
})

onMounted(loadMeme)
onUnmounted(memeStore.clear)
watch(meme, onUpdateMeme, { deep: true })


async function loadMeme() {
    const { id } = route.params
    await memeStore.loadMeme(id as string)

    ctx.init()
    memeStore.init()
    ctx.render()
}

function onUpdateMeme() {
    memeStore.save()
    ctx.render()
}

function clearMeme() {
    memeStore.clear()
    loadMeme()
}

async function postMeme() {
    try {
        const dataUrl = await ctx.dataUrl()
        const imgData = await uploadImg(dataUrl)
        if (!imgData) throw Error('Something went wrong')

        await gagStore.saveGag({
            imgUrl: imgData.url,
            title: gagTitle.value
        })
        router.push('/')
        showSuccessMsg('Gag posted successfuly!')
    }
    catch (err) {
        console.log('err', err)
        showErrorMsg('Something went wrong')
    }
}
</script>