type Listener<T> = (data: T) => void

type ListenerMap<T> = {
    [event: string]: Listener<T>[]
}

type EventEmitter<T> = {
    on(evName: string, listener: Listener<T>): () => void
    emit(evName: string, data: T): void
}

function createEventEmitter<T>(): EventEmitter<T> {
    const listenersMap: ListenerMap<T> = {}

    return {
        on(evName: string, listener: Listener<T>) {
            listenersMap[evName] = listenersMap[evName] ? [...listenersMap[evName], listener] : [listener]

            return () => {
                listenersMap[evName] = listenersMap[evName].filter((func) => func !== listener)
            }
        },
        emit(evName: string, data: T) {
            if (!listenersMap[evName]) return
            listenersMap[evName].forEach((listener) => listener(data))
        },
    }
}

export const eventBus: EventEmitter<{ txt: string, type: string }> = createEventEmitter()

export const SHOW_MSG = 'show-msg'

export function showUserMsg(msg: { txt: string, type: string }) {
    eventBus.emit(SHOW_MSG, msg)
}

export function showSuccessMsg(txt: string) {
    showUserMsg({ txt, type: 'success' })
}

export function showErrorMsg(txt: string) {
    showUserMsg({ txt, type: 'error' })
}