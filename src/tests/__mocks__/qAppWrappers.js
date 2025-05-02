import { jest } from '@jest/globals'

// Mock Quasar app wrappers
export const useQuasar = jest.fn(() => ({
    notify: jest.fn(),
    loading: {
        show: jest.fn(),
        hide: jest.fn()
    },
    dialog: {
        create: jest.fn(),
        show: jest.fn(),
        hide: jest.fn()
    }
}))

export function defineBoot(cb) {
    return cb
}
