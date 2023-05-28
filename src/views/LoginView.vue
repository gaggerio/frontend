<template>
    <main class="login-view">
        <form @submit.prevent="login" class="login-view__form">
            <h2>{{ loginType }}</h2>
            <UploadImg @uploaded="setImgUrl" :imgUrl="credentials.imgUrl" />
            <input class="c-input" v-model="credentials.fullname" type="text" placeholder="Full name" v-if="isSignUp" />
            <input class="c-input" v-model="credentials.username" type="text" placeholder="Username" autofocus />
            <input class="c-input" v-model="credentials.password" type="password" placeholder="Password" show-password />
            <button class="c-btn">{{ loginType }}</button>
            <p @click="isSignUp = !isSignUp">{{ loginSignup }}</p>
        </form>
    </main>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import UploadImg from '../components/UploadImg.vue'
import { useUserStore } from '@/stores/user.store'

const userStore = useUserStore()
const router = useRouter()

const credentials = reactive({
    username: '',
    password: '',
    fullname: '',
    isAdmin: false,
    imgUrl: ''
})
const isSignUp = ref(false)

async function login() {
    try {
        const type = isSignUp.value ? 'signup' : 'login'
        await userStore[type]({ ...credentials })
        showSuccessMsg('Welcom ' + userStore.getLoggedinUser?.fullname)
        router.push('/')
    }
    catch (err) {
        showErrorMsg('Wrong Credentials')
    }
}

function setImgUrl(imgUrl: string) {
    credentials.imgUrl = imgUrl
}

const loginType = computed(() => {
    return isSignUp.value ? 'Signup' : 'Login'
})

const loginSignup = computed(() => {
    return isSignUp.value ?
        'Already a memeber? Click here to login' :
        'Not a member? Click here to signup'
})
</script>
