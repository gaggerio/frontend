import { ref } from 'vue'
import type { UnwrapRef, Ref } from 'vue'
import { showErrorMsg } from '../services/event-bus.service'


export function useService<T>(func: (...args: any) => Promise<T>, ...args: any): Ref<UnwrapRef<T> | null> {
    const dataRef = ref<T | null>(null)

    func(...args)
        .then((data: T) => (dataRef.value = data as UnwrapRef<T>))
        .catch((err: unknown) => {
            showErrorMsg('Oops something went wrong')
            console.error(err)
        })

    return dataRef
}