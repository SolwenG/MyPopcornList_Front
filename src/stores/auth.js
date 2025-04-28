import { defineStore } from 'pinia'
import { backendApi } from 'boot/axios'
import { LocalStorage } from 'quasar'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: { id: null, username: '', email: '' },
        token: LocalStorage.getItem('token') || null
    }),

    getters: {
        isLogged: state => !!state.token,
        getUser: state => state.user
    },

    actions: {
        async login(email, password) {
            try {
                const response = await backendApi.post('/auth/login', { email, password })
                this.token = response.data.token
                this.user = response.data.user
                LocalStorage.set('token', this.token)
                backendApi.defaults.headers.common.Authorization = `Bearer ${this.token}`

                await this.fetchCurrentUser()
                return true
            } catch (error) {
                console.error('Login error:', error.response?.data || error)
                return false
            }
        },

        async register(email, password, pseudo) {
            try {
                const response = await backendApi.post('/auth/register', { email, password, pseudo })
                this.token = response.data.token
                this.user = response.data.user
                LocalStorage.set('token', this.token)
                backendApi.defaults.headers.common.Authorization = `Bearer ${this.token}`
                return true
            } catch (error) {
                console.error('Register error:', error.response?.data || error)
                return false
            }
        },

        logout() {
            this.token = null
            this.user = { id: null, username: '', email: '', token: null }
            LocalStorage.remove('token')
            delete backendApi.defaults.headers.common.Authorization
        },

        async fetchCurrentUser() {
            if (!this.token) return

            try {
                const response = await backendApi.get('/auth/me', {
                    headers: { Authorization: `Bearer ${this.token}` }
                })
                this.user = response.data
            } catch (error) {
                console.error('Fetch user error:', error)
                this.logout()
            }
        }
    }
})
