import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { mockBackendApi, mockLocalStorage, mockPinia } from '../setup'

const TEST_EMAIL = 'test@test.com'
const TEST_PASSWORD = 'TEST_PASSWORD_123'
const TEST_USERNAME = 'test'

describe('Auth Store', () => {
    let store

    beforeEach(() => {
        setActivePinia(mockPinia)
        jest.clearAllMocks()
        store = useAuthStore()

        store.token = null
        store.user = { id: null, username: '', email: '' }
    })

    it('initializes with default state', () => {
        mockLocalStorage.getItem.mockReturnValue(null)
        store = useAuthStore()
        expect(store.user).toEqual({ id: null, username: '', email: '' })
        expect(store.token).toBeNull()
    })

    it('logs in successfully and stores token', async () => {
        const mockUser = { id: 1, username: TEST_USERNAME, email: TEST_EMAIL }
        const mockToken = 'test-token'
        const mockResponse = {
            data: {
                token: mockToken,
                user: mockUser
            }
        }

        mockBackendApi.post.mockResolvedValueOnce(mockResponse)
        mockBackendApi.get.mockResolvedValueOnce({ data: mockUser })

        const result = await store.login(TEST_EMAIL, TEST_PASSWORD)

        expect(result).toBe(true)
        expect(store.token).toBe(mockToken)
        expect(store.user).toEqual(mockUser)
        expect(mockLocalStorage.set).toHaveBeenCalledWith('token', mockToken)
        expect(mockBackendApi.defaults.headers.common.Authorization).toBe(`Bearer ${mockToken}`)
        expect(mockBackendApi.post).toHaveBeenCalledWith('/auth/login', {
            email: TEST_EMAIL,
            password: TEST_PASSWORD
        })
    })

    it('handles login failure', async () => {
        mockBackendApi.post.mockRejectedValueOnce(new Error('Login failed'))

        const result = await store.login(TEST_EMAIL, 'INVALID_PASSWORD')

        expect(result).toBe(false)
        expect(store.token).toBeNull()
        expect(store.user).toEqual({ id: null, username: '', email: '' })
        expect(mockLocalStorage.set).not.toHaveBeenCalled()
    })

    it('logs out and clears user data', () => {
        store.token = 'test-token'
        store.user = { id: 1, username: 'test', email: 'test@test.com' }

        store.logout()

        expect(store.token).toBeNull()
        expect(store.user).toEqual({ id: null, username: '', email: '', token: null })
        expect(mockLocalStorage.remove).toHaveBeenCalledWith('token')
        expect(mockBackendApi.defaults.headers.common.Authorization).toBeUndefined()
    })

    it('fetches current user successfully', async () => {
        const mockUser = { id: 1, username: 'test', email: 'test@test.com' }
        store.token = 'test-token'

        mockBackendApi.get.mockResolvedValueOnce({ data: mockUser })

        await store.fetchCurrentUser()

        expect(store.user).toEqual(mockUser)
        expect(mockBackendApi.get).toHaveBeenCalledWith('/auth/me', {
            headers: { Authorization: 'Bearer test-token' }
        })
    })

    it('handles fetch current user failure', async () => {
        store.token = 'test-token'
        store.user = { id: 1, username: 'test', email: 'test@test.com' }

        mockBackendApi.get.mockRejectedValueOnce(new Error('Fetch failed'))

        await store.fetchCurrentUser()

        expect(store.token).toBeNull()
        expect(store.user).toEqual({ id: null, username: '', email: '', token: null })
        expect(mockLocalStorage.remove).toHaveBeenCalledWith('token')
    })
})
