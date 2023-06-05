import type { Gag } from "@/models/Gag.model"
import type { Img } from "@/models/Img.model"
import type { User } from "@/models/User.model"
import type { Comment } from "@/models/Comment.model"
import { utilService } from "./util.service"

export function useStorageService<T extends User | Gag | Img | Comment>() {

    async function query(key: string): Promise<T[]> {
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : []
    }

    async function get(key: string, entityId: string): Promise<T | null> {
        const entities = await query(key)
        const entity = entities.find(entity => entity._id === entityId)
        return entity ? entity : null
    }

    async function post(key: string, newEntity: T): Promise<T> {
        newEntity._id = utilService.makeId()
        const entities = await query(key)
        entities.unshift(newEntity)
        _save(key, entities)
        return newEntity
    }

    async function put(key: string, updatedEntity: T): Promise<T> {
        const entities = await query(key)
        const idx = entities.findIndex(entity => entity._id === updatedEntity._id)
        if (idx < 0) throw new Error('Bad entity, ID not found')
        entities.splice(idx, 1, updatedEntity)
        _save(key, entities)
        return updatedEntity
    }

    async function remove(key: string, entityId: string): Promise<string> {
        const entities = await query(key)
        const idx = entities.findIndex(entity => entity._id === entityId)
        if (idx < 0) throw new Error('Not matched id')
        entities.splice(idx, 1)
        return entityId
    }

    function _save(entityType: string, entities: T[]) {
        localStorage.setItem(entityType, JSON.stringify(entities))
    }

    return {
        query,
        get,
        post,
        put,
        remove
    }
}