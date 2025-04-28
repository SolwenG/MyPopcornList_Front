import { defineStore } from 'pinia'
import { backendApi } from 'boot/axios'

export const useUserStore = defineStore('user', {
    state: () => ({
        lists: [],
        favorites: [],
        following: [],
        mediaScores: new Map()
    }),

    getters: {
        getUserLists: state => state.lists,
        getFavorites: state => state.favorites,
        getFollowing: state => state.following,
        getMediaScore: state => mediaId => state.mediaScores.get(mediaId)
    },

    actions: {
        async createList(name) {
            const response = await backendApi.post('/lists', { name })
            this.lists.push(response.data)
        },

        async deleteList(listId) {
            await backendApi.delete(`/lists/${listId}`)
            this.lists = this.lists.filter(list => list.id !== listId)
        },

        async addMediaToList(listId, media, scores = null, status = 'to_watch', progress = 0) {
            const payload = {
                mediaId: media.id,
                mediaType: media.type,
                scores,
                status,
                progress
            }

            const response = await backendApi.post(`/lists/${listId}/media`, payload)
            const listIndex = this.lists.findIndex(l => l.id === listId)
            if (listIndex !== -1) {
                this.lists[listIndex].media.push(response.data)
            }
        },

        async removeMediaFromList(listId, mediaId) {
            await backendApi.delete(`/lists/${listId}/media/${mediaId}`)
            const listIndex = this.lists.findIndex(l => l.id === listId)
            if (listIndex !== -1) {
                this.lists[listIndex].media = this.lists[listIndex].media.filter(m => m.id !== mediaId)
            }
        },

        async toggleFavorite(media) {
            const isFavorite = this.favorites.some(f => f.id === media.id)
            if (isFavorite) {
                await backendApi.delete(`/favorites/${media.id}`)
                this.favorites = this.favorites.filter(f => f.id !== media.id)
            } else {
                const response = await backendApi.post('/favorites', media)
                this.favorites.push(response.data)
            }
        },

        async updateMediaScore(mediaId, scores) {
            const response = await backendApi.put(`/media/${mediaId}/scores`, scores)
            this.mediaScores.set(mediaId, response.data)
        },

        async followUser(userId) {
            const response = await backendApi.post(`/follow/${userId}`)
            this.following.push(response.data)
        },

        async unfollowUser(userId) {
            await backendApi.delete(`/follow/${userId}`)
            this.following = this.following.filter(f => f.id !== userId)
        },

        async fetchUserLists() {
            const response = await backendApi.get('/lists')
            this.lists = response.data
        },

        async fetchFavorites() {
            const response = await backendApi.get('/favorites')
            this.favorites = response.data
        },

        async fetchFollowing() {
            const response = await backendApi.get('/following')
            this.following = response.data
        }
    }
})
