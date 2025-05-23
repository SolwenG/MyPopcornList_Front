<template>
    <q-dialog v-model="showDialog" :maximized="false" position="top">
        <q-card class="search-modal-card">
            <q-card-section>
                <div class="row items-center">
                    <div class="col">
                        <q-input
                            v-model="localQuery"
                            :loading="loading"
                            :placeholder="$t('search')"
                            autofocus
                            borderless
                            class="text-h6"
                            dense
                            @keyup.enter="handleSearch"
                        >
                            <template #append>
                                <q-icon color="primary" name="search" @click="handleSearch" />
                            </template>
                        </q-input>
                    </div>
                    <q-btn v-close-popup color="negative" dense flat icon="close" round />
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section class="scroll" style="max-height: 70vh">
                <div v-if="loading" class="full-width flex flex-center q-pa-xl">
                    <q-spinner color="primary" size="3em" />
                </div>
                <div v-else-if="error" class="text-center q-pa-md">
                    <q-icon color="negative" name="error" size="3em" />
                    <p class="text-h6 text-negative">{{ error }}</p>
                </div>
                <div v-else-if="results.length === 0 && localQuery" class="text-center q-pa-md">
                    <q-icon color="grey" name="search_off" size="3em" />
                    <p class="text-h6 text-grey">{{ $t('no_results_for') }} {{ localQuery }}"</p>
                </div>
                <div v-else-if="results.length > 0" class="row q-col-gutter-md justify-center">
                    <div v-for="media in results" :key="media.id" class="col-auto">
                        <MediaCard :media="media" style="min-height: 280px; width: 150px" />
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script lang="js" setup>
import { ref, watch } from 'vue'
import { tmdbApi } from 'boot/axios'
import MediaCard from 'components/media/MediaCard.vue'

const props = defineProps({
    modelValue: Boolean,
    query: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue', 'update:query'])

const showDialog = ref(false)
const localQuery = ref(props.query)
const results = ref([])
const loading = ref(false)
const error = ref(null)

watch(
    () => props.modelValue,
    val => {
        showDialog.value = val
    }
)

watch(showDialog, val => {
    emit('update:modelValue', val)
    if (!val) {
        emit('update:query', '')
        localQuery.value = ''
        results.value = []
        error.value = null
    }
})

watch(
    () => props.query,
    val => {
        localQuery.value = val
    }
)

watch(localQuery, val => {
    emit('update:query', val)
    if (val) {
        handleSearch()
    } else {
        results.value = []
    }
})

const handleSearch = async () => {
    if (!localQuery.value) return

    loading.value = true
    error.value = null

    try {
        const [movieResults, tvResults] = await Promise.all([
            tmdbApi.get('/search/movie', {
                params: { query: localQuery.value }
            }),
            tmdbApi.get('/search/tv', {
                params: { query: localQuery.value }
            })
        ])
        results.value = [
            ...movieResults.data.results.map(movie => ({
                ...movie,
                type: 'movie',
                title: movie.title,
                year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
                posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
                rating: movie.vote_average / 2
            })),
            ...tvResults.data.results.map(tv => ({
                ...tv,
                type: 'tv',
                title: tv.name,
                year: tv.first_air_date ? new Date(tv.first_air_date).getFullYear() : null,
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
</script>

<style lang="scss" scoped>
.search-modal-card {
    margin-top: 10vh;
    width: 80%;
    max-width: 80%;
}
</style>
