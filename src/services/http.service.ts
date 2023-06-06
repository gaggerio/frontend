import type { FilterBy } from '@/models/FilterBy.model'
import Axios from 'axios'

const BASE_URL =
    import.meta.env.NODE_ENV === 'production' ? '/api/' : '//localhost:3030/api/'

const axios = Axios.create({
    withCredentials: true,
})

export function useHttpService<T>() {
    return {
        async query(endpoint: string, data: FilterBy) {
            return ajax<T>(endpoint, 'GET', data)
        },
        async get(endpoint: string) {
            return ajax<T>(endpoint, 'GET', null)
        },
        async post<T>(endpoint: string, data: T) {
            return ajax<T>(endpoint, 'POST', data)
        },
        async put<T>(endpoint: string, data: T) {
            return ajax<T>(endpoint, 'PUT', data)
        },
        async delete<T>(endpoint: string, data: string) {
            return ajax<T>(endpoint, 'DELETE', data)
        },
    }
}

async function ajax<T>(endpoint: string, method = 'GET', data: T | FilterBy | string | null) {
    try {
        const response = await axios({
            url: `${BASE_URL}${endpoint}`,
            method,
            data,
            params: method === 'GET' ? data : null,
        })
        return response.data
    } catch (err) {
        console.log(`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data:`, data)
        console.dir(err)
        throw err
    }
}