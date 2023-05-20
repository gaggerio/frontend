import { createStore, Store } from 'vuex'
import { userStore } from './modules/user.store'
import type { UserState } from './modules/user.store'

export interface RootState {
    userStore: UserState,
}

const store: Store<RootState> = createStore({
    strict: import.meta.env.NODE_ENV !== 'production',
    modules: {
        userStore,
    }
})

export default store