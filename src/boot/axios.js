import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { LocalStorage } from 'quasar'
import { useAuthStore } from '../stores/auth'
import { VITE_TMDB_ACCESS_TOKEN } from 'src/config/env.js'

// Create API instances for each service
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

// Add auth token interceptor for backend API
backendApi.interceptors.request.use(config => {
    const token = LocalStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Add auth token interceptor for backend API
backendApi.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // If token is invalid or expired, logout the user
            useAuthStore().logout()
        }
        return Promise.reject(error)
    }
)

export default defineBoot(({ app }) => {
    // Make APIs available globally
    app.config.globalProperties.$axios = axios
    app.config.globalProperties.$tmdbApi = tmdbApi
    app.config.globalProperties.$anilistApi = anilistApi
    app.config.globalProperties.$backendApi = backendApi
})

export { axios, tmdbApi, anilistApi, backendApi }
