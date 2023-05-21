import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import EditorView from '../views/EditorView.vue'
import ExploreView from '../views/ExploreView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/editor/:id',
            name: 'editor',
            component: EditorView
        },
        {
            path: '/explore',
            name: 'explore',
            component: ExploreView
        },
    ]
})

export default router