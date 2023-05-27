import { createStore, Store } from 'vuex'
import { userStore } from './modules/user/user.store'
import { gagStore } from './modules/gag/gag.store'
import type { UserState } from './modules/user/user.store'
import type { GagState } from './modules/gag/gag.store'

export interface RootState {
    userStore: UserState,
    gagStore: GagState,
}

const store: Store<RootState> = createStore({
    strict: import.meta.env.NODE_ENV !== 'production',
    modules: {
        userStore,
        gagStore,
    }
})

export default store