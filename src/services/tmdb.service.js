import { tmdbApi } from 'boot/axios'

export const tmdbService = {
    async searchMedia(query, type = 'multi') {
        const response = await tmdbApi.get(`/search/${type}`, {
            params: { query, language: 'fr-FR' }
        })
        return response.data
    },

    async getMediaDetails(id, type) {
        const response = await tmdbApi.get(`/${type}/${id}`, {
            params: {
                language: 'fr-FR',
                append_to_response: 'videos,credits,reviews'
            }
        })
        return response.data
    },

    async getTopMovies(page = 1) {
        const response = await tmdbApi.get('/movie/top_rated', {
            params: {
                language: 'fr-FR',
                page
            }
        })
        return response.data
    },

    async getTopSeries(page = 1) {
        const response = await tmdbApi.get('/tv/top_rated', {
            params: {
                language: 'fr-FR',
                without_genres: 16,
                page
            }
        })
        return response.data
    },

    async getTopCartoons(page = 1) {
        const response = await tmdbApi.get('/discover/tv', {
            params: {
                language: 'fr-FR',
                with_keywords: 6513,
                sort_by: 'vote_average.desc',
                'vote_count.gte': 200,
                page
            }
        })
        return response.data
    },

    async getTrending() {
        const response = await tmdbApi.get('/trending/all/week', {
            params: { language: 'fr-FR' }
        })
        return response.data
    },

    async getPersonDetails(id) {
        const response = await tmdbApi.get(`/person/${id}`, {
            params: {
                language: 'fr-FR',
                append_to_response: 'combined_credits'
            }
        })
        return response.data
    }
}
