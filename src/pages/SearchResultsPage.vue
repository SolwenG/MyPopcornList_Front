<template>
    <q-page padding>
        <h1 class="text-h4 text-dark q-mb-lg">Résultats de recherche</h1>
        <div v-if="loading" class="full-width flex flex-center q-pa-xl">
            <q-spinner color="primary" size="3em" />
        </div>
        <div v-else-if="error" class="text-center q-pa-md">
            <q-icon name="error" color="negative" size="3em" />
            <p class="text-h6 text-negative">{{ error }}</p>
        </div>
        <div v-else-if="results.length === 0" class="text-center q-pa-md">
            <q-icon name="search_off" color="grey" size="3em" />
            <p class="text-h6 text-grey">Aucun résultat trouvé pour "{{ searchQuery }}"</p>
        </div>
        <div v-else class="row q-col-gutter-md">
            <div v-for="media in results" :key="media.imdb_id" class="q-mx-md">
                <MediaCard :media="media" style="min-height: 280px; width: 150px" @click="$router.push(`/media/${media.type}/${media.id}`)" />
            </div>
        </div>
    </q-page>
</template>

<script setup lang="js">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { tmdbApi } from 'boot/axios'
import MediaCard from 'components/media/MediaCard.vue'

const route = useRoute()
const results = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')

const searchMedia = async query => {
    if (!query) return

    loading.value = true
    error.value = null
    searchQuery.value = query

    try {
        const [movieResults, tvResults] = await Promise.all([
            tmdbApi.get('/search/movie', {
                params: { query }
            }),
            tmdbApi.get('/search/tv', {
                params: { query }
            })
        ])

        results.value = [
            ...movieResults.data.results.map(movie => ({
                id: movie.id,
                title: movie.title,
                type: 'movie',
                year: new Date(movie.release_date).getFullYear(),
                posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
                rating: movie.vote_average / 2
            })),
            ...tvResults.data.results.map(tv => ({
                id: tv.id,
                title: tv.name,
                type: 'tv',
                year: new Date(tv.first_air_date).getFullYear(),
                posterUrl: tv.poster_path ? `https://image.tmdb.org/t/p/w500${tv.poster_path}` : null,
                rating: tv.vote_average / 2
            }))
        ]
    } catch (err) {
        console.error('Error searching media:', err)
        error.value = 'Erreur lors de la recherche'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    if (route.query.q) {
        searchMedia(route.query.q)
    }
})
</script>
