import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { LocalStorage } from 'quasar'
import { useAuthStore } from '../stores/auth'
import { VITE_TMDB_ACCESS_TOKEN } from 'src/config/env.js'

const tmdbApi = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        Authorization: `Bearer ${VITE_TMDB_ACCESS_TOKEN}`,
        accept: 'application/json'
    }
})

const anilistApi = axios.create({
    baseURL: 'https://graphql.anilist.co',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
})

const backendApi = axios.create({
    baseURL: process.env.API_BASE_URL || 'http://localhost:8080',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
})

backendApi.interceptors.request.use(config => {
    const token = LocalStorage.getItem('token')
    if (typeof token === 'string') {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

backendApi.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            useAuthStore().logout()
        }
        return Promise.reject(new Error(error.message))
    }
)

export default defineBoot(({ app }) => {
    app.config.globalProperties.$axios = axios
    app.config.globalProperties.$tmdbApi = tmdbApi
    app.config.globalProperties.$anilistApi = anilistApi
    app.config.globalProperties.$backendApi = backendApi
})

export { axios, tmdbApi, anilistApi, backendApi }
