import { defineStore } from 'pinia'
import { tmdbService } from 'src/services/tmdb.service'
import { anilistService } from 'src/services/anilist.service'

export const useMediaStore = defineStore('media', {
    state: () => ({
        trendingMedia: [],
        topMovies: [],
        topSeries: [],
        topAnime: [],
        topCartoons: [],
        currentMedia: null,
        searchResults: [],
        recommendations: [],
        loading: false,
        error: null
    }),

    getters: {
        getTrendingMedia: state =>
            state.trendingMedia.map(item => ({
                ...item,
                source: item.media_type === 'movie' ? 'movie' : 'tv'
            })),
        getTopMovies: state => state.topMovies.map(item => ({ ...item, source: 'movie' })),
        getTopSeries: state => state.topSeries.map(item => ({ ...item, source: 'tv' })),
        getTopAnimes: state => state.topAnime.map(item => ({ ...item, source: 'anime' })),
        getTopCartoons: state => state.topCartoons.map(item => ({ ...item, source: 'cartoon' })),
        getCurrentMedia: state => state.currentMedia,
        getSearchResults: state => state.searchResults,
        getRecommendations: state => state.recommendations,
        isLoading: state => state.loading
    },

    actions: {
        async fetchTrendingMedia() {
            this.loading = true
            try {
                const data = await tmdbService.getTrending()
                this.trendingMedia = data.results
            } catch (error) {
                console.error('Error fetching trending media:', error)
                this.error = error.message
            } finally {
                this.loading = false
            }
        },

        async fetchTopMedia(type) {
            this.loading = true
            try {
                let data
                switch (type) {
                    case 'movie':
                        data = await tmdbService.getTopMovies()
                        this.topMovies = data.results
                        break
                    case 'tv':
                        data = await tmdbService.getTopSeries()
                        this.topSeries = data.results
                        break
                    case 'anime':
                        data = await anilistService.getTopAnimes()
                        this.topAnime = data
                        break
                    case 'cartoon': {
                        data = await tmdbService.getTopCartoons()
                        this.topCartoons = data.results
                        break
                    }
                }
            } catch (error) {
                console.error(`Error fetching top ${type}:`, error)
                this.error = error.message
            } finally {
                this.loading = false
            }
        },

        async fetchMediaDetails(id, type) {
            this.loading = true
            try {
                let data
                switch (type) {
                    case 'movie':
                    case 'tv':
                        data = await tmdbService.getMediaDetails(id, type)
                        break
                    case 'anime':
                        data = await anilistService.getAnimeDetails(id)
                        break
                    case 'cartoon':
                        data = await tmdbService.getMediaDetails(id, 'tv')
                        break
                }
                this.currentMedia = { ...data, source: type }
            } catch (error) {
                console.error('Error fetching media details:', error)
                this.error = error.message
            } finally {
                this.loading = false
            }
        },

        async searchMedia(query) {
            if (!query?.trim()) {
                this.searchResults = []
                return
            }

            this.loading = true
            try {
                const [tmdbResults, animeResults] = await Promise.all([tmdbService.searchMedia(query), anilistService.search(query)])

                this.searchResults = [
                    ...tmdbResults.results.map(item => ({
                        ...item,
                        source: item.media_type === 'movie' ? 'movie' : 'tv'
                    })),
                    ...animeResults.map(item => ({
                        ...item,
                        source: 'anime'
                    }))
                ]
            } catch (error) {
                console.error('Error searching media:', error)
                this.error = error.message
                this.searchResults = []
            } finally {
                this.loading = false
            }
        },

        async fetchRecommendations() {
            if (!this.currentMedia) return

            this.loading = true
            try {
                let recommendations = []
                switch (this.currentMedia.source) {
                    case 'movie':
                    case 'tv': {
                        const data = await tmdbService.getMediaDetails(this.currentMedia.id, this.currentMedia.source)
                        recommendations = (data.recommendations?.results || []).map(item => ({
                            ...item,
                            source: this.currentMedia.source
                        }))
                        break
                    }
                    case 'anime': {
                        const animeData = await anilistService.getAnimeDetails(this.currentMedia.id)
                        recommendations = (animeData.recommendations?.nodes || []).map(node => ({
                            ...node.mediaRecommendation,
                            source: 'anime'
                        }))
                        break
                    }
                }
                this.recommendations = recommendations
            } catch (error) {
                console.error('Error fetching recommendations:', error)
                this.error = error.message
                this.recommendations = []
            } finally {
                this.loading = false
            }
        },

        clearError() {
            this.error = null
        }
    }
})
