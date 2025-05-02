import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { createPinia, setActivePinia } from 'pinia'
import { useUserStore } from '@/stores/user'

import { mockBackendApi } from '../setup'

describe('User Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        jest.clearAllMocks()
    })

    it('creates a list', async () => {
        const store = useUserStore()
        const mockList = { id: 1, name: 'Favorites' }

        mockBackendApi.post.mockResolvedValue({ data: mockList })

        await store.createList('Favorites')

        expect(store.lists).toContainEqual(mockList)
    })

    it('toggles a favorite', async () => {
        const store = useUserStore()
        const media = { id: 123, title: 'Test Media' }

        mockBackendApi.post.mockResolvedValue({ data: media })

        await store.toggleFavorite(media)
        expect(store.favorites).toContainEqual(media)

        mockBackendApi.delete.mockResolvedValue({})
        await store.toggleFavorite(media)
        expect(store.favorites).not.toContainEqual(media)
    })

    it('fetches user lists', async () => {
        const store = useUserStore()
        const mockLists = [{ id: 1, name: 'List A' }]
        mockBackendApi.get.mockResolvedValue({ data: mockLists })

        await store.fetchUserLists()
        expect(store.lists).toEqual(mockLists)
    })
})
