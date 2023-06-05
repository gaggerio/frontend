import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import EditorView from '../views/EditorView.vue'
import ExploreView from '../views/ExploreView.vue'
import GagDetailsView from '../views/GagDetailsView.vue'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
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
        {
            path: '/details/:id',
            name: 'details',
            component: GagDetailsView
        },
    ]
})

export default router