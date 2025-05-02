import { jest, beforeEach } from '@jest/globals'
import { config } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

// Mock Quasar's LocalStorage
const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    remove: jest.fn(),
    set: jest.fn()
}

// Mock Quasar
jest.mock('quasar', () => ({
    LocalStorage: mockLocalStorage
}))

// Mock axios
const mockBackendApi = {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    defaults: {
        headers: {
            common: {}
        }
    }
}

// Mock axios boot file
jest.mock('boot/axios', () => ({
    backendApi: mockBackendApi
}))

// Mock Vue Router
jest.mock('vue-router', () => ({
    useRouter: jest.fn(() => ({
        push: jest.fn(),
        replace: jest.fn()
    }))
}))

// Mock Pinia
const mockPinia = createTestingPinia({
    createSpy: jest.fn,
    stubActions: false,
    initialState: {
        auth: {
            user: { id: null, username: '', email: '' },
            token: null
        },
        media: {
            currentMedia: null,
            mediaList: [],
            searchResults: []
        },
        user: {
            profile: null,
            lists: [],
            watchlist: [],
            watchedList: []
        }
    }
})

// Global Vue configuration
config.global.plugins = [mockPinia]

// Reset all mocks before each test
beforeEach(() => {
    jest.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
    mockLocalStorage.set.mockImplementation((key, value) => {
        mockLocalStorage.getItem.mockReturnValue(value)
    })
    mockLocalStorage.remove.mockImplementation(() => {
        mockLocalStorage.getItem.mockReturnValue(null)
    })
})

// Export mocks for use in tests
export { mockLocalStorage, mockBackendApi, mockPinia }
