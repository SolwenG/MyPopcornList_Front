<template>
    <q-page padding>
        <q-page-sticky class="bg-secondary q-px-md" expand position="top" style="z-index: 1000">
            <h2 class="text-h4 text-bold text-dark q-my-none">TOP</h2>
            <q-space />
            <div class="row items-center q-mb-sm bg-secondary rounded-borders q-pa-md" style="margin: 0 -16px">
                <q-tabs v-model="tab" align="left" class="text-primary" dense indicator-color="primary" narrow-indicator>
                    <q-tab :label="$t('movies')" name="movies" />
                    <q-tab :label="$t('series')" name="series" />
                    <q-tab :label="$t('anime')" name="anime" />
                    <q-tab :label="$t('cartoons')" name="cartoons" />
                </q-tabs>
            </div>
            <q-space />
            <div class="row items-center justify-end q-mb-md">
                <q-btn-dropdown color="primary" icon="sort" label="Trier">
                    <q-list>
                        <q-item v-for="sort in sortOptions" :key="sort.value" v-close-popup clickable @click="handleSort(sort)">
                            <q-item-section>
                                <q-item-label>{{ sort.label }}</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-btn
                                    :icon="sort.value === currentSort.value ? (sortDirection === 'desc' ? 'arrow_downward' : 'arrow_upward') : ''"
                                    dense
                                    flat
                                    round
                                    @click.stop="toggleSortDirection(sort)"
                                />
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>
            </div>
            <q-separator color="primary" />
        </q-page-sticky>

        <div style="margin-top: 80px">
            <q-tab-panels v-model="tab" animated>
                <q-tab-panel name="movies">
                    <template v-for="(movie, index) in displayedMovies" :key="movie.id">
                        <media-ranking-item
                            :animation-score="movie.animation_score || movie.vote_average * 8.7"
                            :characters-score="movie.characters_score || movie.vote_average * 9.2"
                            :enjoyment-score="movie.enjoyment_score || movie.vote_average * 8.9"
                            :image-url="getImageUrl(movie.poster_path)"
                            :media-id="movie.id"
                            :music-score="movie.music_score || movie.vote_average * 9"
                            :rank="index + 1"
                            :scenario-score="movie.vote_average * 10"
                            :title="movie.title"
                            :vote-average="movie.vote_average"
                            :vote-count="movie.vote_count"
                            :year="movie.release_date?.split('-')[0]"
                            media-type="movie"
                        />
                    </template>
                </q-tab-panel>

                <q-tab-panel name="series">
                    <template v-for="(series, index) in displayedSeries" :key="series.id">
                        <media-ranking-item
                            :animation-score="series.animation_score || series.vote_average * 8.7"
                            :characters-score="series.characters_score || series.vote_average * 9.2"
                            :enjoyment-score="series.enjoyment_score || series.vote_average * 8.9"
                            :image-url="getImageUrl(series.poster_path)"
                            :media-id="series.id"
                            :music-score="series.music_score || series.vote_average * 9"
                            :rank="index + 1"
                            :scenario-score="series.vote_average * 10"
                            :title="series.name"
                            :vote-average="series.vote_average"
                            :vote-count="series.vote_count"
                            :year="series.first_air_date?.split('-')[0]"
                            media-type="tv"
                        />
                    </template>
                </q-tab-panel>

                <q-tab-panel name="anime">
                    <template v-for="(anime, index) in displayedAnime" :key="anime.id">
                        <media-ranking-item
                            :animation-score="anime.animation_score || anime.averageScore * 0.87"
                            :characters-score="anime.characters_score || anime.averageScore * 0.92"
                            :enjoyment-score="anime.enjoyment_score || anime.averageScore * 0.89"
                            :image-url="anime.coverImage.large"
                            :media-id="anime.id"
                            :music-score="anime.music_score || anime.averageScore * 0.9"
                            :rank="index + 1"
                            :scenario-score="anime.scenario_score || anime.averageScore"
                            :title="anime.title.english || anime.title.romaji"
                            :vote-average="anime.averageScore / 10"
                            :vote-count="anime.popularity"
                            :year="anime.startDate?.year"
                            media-type="anime"
                        />
                    </template>
                </q-tab-panel>

                <q-tab-panel name="cartoons">
                    <template v-for="(cartoon, index) in displayedCartoons" :key="cartoon.id">
                        <media-ranking-item
                            :animation-score="cartoon.animation_score || cartoon.vote_average * 8.7"
                            :characters-score="cartoon.characters_score || cartoon.vote_average * 9.2"
                            :enjoyment-score="cartoon.enjoyment_score || cartoon.vote_average * 8.9"
                            :image-url="getImageUrl(cartoon.poster_path)"
                            :media-id="cartoon.id"
                            :music-score="cartoon.music_score || cartoon.vote_average * 9"
                            :rank="index + 1"
                            :scenario-score="cartoon.vote_average * 10"
                            :title="cartoon.name"
                            :vote-average="cartoon.vote_average"
                            :vote-count="cartoon.vote_count"
                            :year="cartoon.first_air_date?.split('-')[0]"
                            media-type="cartoon"
                        />
                    </template>
                </q-tab-panel>
            </q-tab-panels>

            <div v-if="hasMorePages" id="loading-trigger" class="flex flex-center q-pa-md">
                <q-spinner-dots v-if="loadingMore" color="primary" size="40px" />
            </div>

            <div v-if="loading" class="flex flex-center q-pa-md">
                <q-spinner color="primary" size="2em" />
            </div>

            <div v-if="hasMorePages" class="flex flex-center q-pa-md">
                <q-btn :loading="loading" color="primary" text-color="white" @click="loadMoreItems">
                    Charger plus
                    <template #loading>
                        <q-spinner-dots />
                    </template>
                </q-btn>
            </div>
        </div>
    </q-page>
</template>

<script lang="js" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { tmdbService } from 'src/services/tmdb.service'
import { anilistApi } from 'boot/axios'
import MediaRankingItem from 'components/media/MediaRankingItem.vue'
import { notify } from 'src/utils/notify'
import { debounce } from 'quasar'
import { useI18n } from 'vue-i18n'

const ITEMS_PER_PAGE = 20

const createSortOptions = () => {
    const { t } = useI18n()
    return [
        { label: 'Popcorn Score', value: 'vote_average' },
        { label: "Popcorn O'Meter", value: 'vote_count' },
        { label: t('year'), value: 'year' },
        { label: t('title'), value: 'title' },
        { label: t('rating_scenario'), value: 'scenario_score' },
        { label: t('rating_animation'), value: 'animation_score' },
        { label: t('rating_enjoyment'), value: 'enjoyment_score' },
        { label: t('rating_characters'), value: 'characters_score' },
        { label: t('rating_music'), value: 'music_score' }
    ]
}

const route = useRoute()
const router = useRouter()
const sortOptions = createSortOptions()
const loading = ref(false)
const loadingMore = ref(false)
const sortingInProgress = ref(false)
const observer = ref(null)
const tab = ref(route.params.type || 'movies')

const page = ref(1)
const totalPages = ref(1)
const currentSort = ref(sortOptions[0])
const sortDirection = ref('desc')

const topMovies = ref([])
const topSeries = ref([])
const topAnime = ref([])
const topCartoons = ref([])

const displayedMovies = ref([])
const displayedSeries = ref([])
const displayedAnime = ref([])
const displayedCartoons = ref([])

const resetCurrentTabData = () => {
    switch (tab.value) {
        case 'movies':
            topMovies.value = []
            displayedMovies.value = []
            break
        case 'series':
            topSeries.value = []
            displayedSeries.value = []
            break
        case 'anime':
            topAnime.value = []
            displayedAnime.value = []
            break
        case 'cartoons':
            topCartoons.value = []
            displayedCartoons.value = []
            break
    }
}
// Watch for route changes
watch(
    () => route.params.type,
    async newType => {
        if (newType && ['movies', 'series', 'anime', 'cartoons'].includes(newType)) {
            tab.value = newType
            // Reset and reload data when route changes
            loading.value = true
            page.value = 1
            totalPages.value = 1
            resetCurrentTabData()
            try {
                await loadMoreItems()
                setupIntersectionObserver()
            } catch (error) {
                console.error('Error loading media:', error)
                notify({
                    color: 'negative',
                    message: 'Erreur lors du chargement des médias',
                    icon: 'error'
                })
            } finally {
                loading.value = false
            }
        }
    },
    { immediate: true }
)

const loadMoreItems = async () => {
    if (loading.value) return

    loading.value = true
    try {
        let response
        switch (tab.value) {
            case 'movies': {
                response = await tmdbService.getTopMovies(page.value)
                topMovies.value = [...topMovies.value, ...response.results]
                displayedMovies.value = topMovies.value
                totalPages.value = response.total_pages
                break
            }
            case 'series': {
                response = await tmdbService.getTopSeries(page.value)
                topSeries.value = [...topSeries.value, ...response.results]
                displayedSeries.value = topSeries.value
                totalPages.value = response.total_pages
                break
            }
            case 'anime': {
                const newAnime = await fetchAnime()
                topAnime.value = [...topAnime.value, ...newAnime]
                displayedAnime.value = topAnime.value
                break
            }
            case 'cartoons': {
                response = await tmdbService.getTopCartoons(page.value)
                topCartoons.value = [...topCartoons.value, ...response.results]
                displayedCartoons.value = topCartoons.value
                totalPages.value = response.total_pages
                break
            }
        }
        page.value++
        sortCurrentTab()
    } catch (error) {
        console.error('Error loading top media:', error)
        notify({
            color: 'negative',
            message: 'Erreur lors du chargement des médias',
            icon: 'error'
        })
    } finally {
        loading.value = false
    }
}

const setupIntersectionObserver = () => {
    if (observer.value) observer.value.disconnect()

    observer.value = new IntersectionObserver(
        entries => {
            const target = entries[0]
            if (target.isIntersecting) {
                debouncedLoadMore()
            }
        },
        { rootMargin: '100px' }
    )

    const loadingTrigger = document.querySelector('#loading-trigger')
    if (loadingTrigger) {
        observer.value.observe(loadingTrigger)
    }
}

// Watch for tab changes
watch(tab, newTab => {
    if (newTab !== route.params.type) {
        router.push(`/top/${newTab}`)
    }
})

const hasMorePages = computed(() => page.value < totalPages.value)

const getImageUrl = path => {
    if (!path) return ''
    return `https://image.tmdb.org/t/p/w500${path}`
}

const getNumericValue = value => {
    const num = parseFloat(value)
    return isNaN(num) ? -Infinity : num
}

const getDateValue = item => {
    return item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0] || item.startDate?.year || ''
}

const getTitle = item => {
    return item.title || item.name || item.title?.english || item.title?.romaji || ''
}

const getScore = item => {
    return item.vote_average || (item.averageScore ? item.averageScore / 10 : 0)
}

const multipliers = {
    scenario_score: 10,
    animation_score: 8.7,
    enjoyment_score: 8.9,
    characters_score: 9.2,
    music_score: 9
}

const handleSort = sort => {
    if (currentSort.value.value === sort.value) {
        toggleSortDirection()
    } else {
        currentSort.value = sort
        sortDirection.value = 'desc'
    }
    sortCurrentTab()
}

const toggleSortDirection = () => {
    sortDirection.value = sortDirection.value === 'desc' ? 'asc' : 'desc'
    sortCurrentTab()
}

const sortFunction = (a, b) => {
    const direction = sortDirection.value === 'desc' ? -1 : 1
    const sortField = currentSort.value.value

    let valueA, valueB

    // Get values based on sort field
    if (sortField === 'vote_average') {
        valueA = getScore(a)
        valueB = getScore(b)
    } else if (sortField === 'vote_count') {
        valueA = getNumericValue(a.vote_count || a.popularity)
        valueB = getNumericValue(b.vote_count || b.popularity)
    } else if (sortField === 'year') {
        valueA = getDateValue(a)
        valueB = getDateValue(b)
        return direction * valueA.localeCompare(valueB)
    } else if (sortField === 'title') {
        valueA = getTitle(a)
        valueB = getTitle(b)
        return direction * valueA.localeCompare(valueB)
    } else {
        // Handle all score types
        const multiplier = multipliers[sortField] || 1
        valueA = getScore(a) * multiplier
        valueB = getScore(b) * multiplier
    }

    return direction * (valueA - valueB)
}

const sortCurrentTab = async () => {
    if (sortingInProgress.value) return

    sortingInProgress.value = true
    try {
        const currentData = {
            movies: topMovies.value,
            series: topSeries.value,
            anime: topAnime.value,
            cartoons: topCartoons.value
        }
        const displayData = {
            movies: displayedMovies,
            series: displayedSeries,
            anime: displayedAnime,
            cartoons: displayedCartoons
        }

        if (tab.value in currentData && tab.value in displayData) {
            displayData[tab.value].value = [...currentData[tab.value]].sort(sortFunction)
        }
    } catch (error) {
        console.error('Error during sorting:', error)
        notify({
            color: 'negative',
            message: 'Erreur lors du tri des médias',
            icon: 'error'
        })
    } finally {
        sortingInProgress.value = false
    }
}

const fetchAnime = async () => {
    try {
        const response = await anilistApi.post('', {
            query: `
                        query ($page: Int) {
                            Page(page: $page, perPage: ${ITEMS_PER_PAGE}) {
                                pageInfo {
                                    total
                                    perPage
                                    currentPage
                                    lastPage
                                    hasNextPage
                                }
                                media(type: ANIME, sort: SCORE_DESC) {
                                    id
                                    title {
                                        romaji
                                        english
                                    }
                                    coverImage {
                                        large
                                    }
                                    startDate {
                                        year
                                    }
                                    averageScore
                                    popularity
                                }
                            }
                        }
                    `,
            variables: {
                page: page.value
            }
        })
        const pageInfo = response.data.data.Page.pageInfo
        totalPages.value = pageInfo.lastPage
        return response.data.data.Page.media
    } catch (err) {
        notify({
            color: 'negative',
            message: 'Erreur lors du chargement des animes',
            icon: 'error'
        })
        console.error(err)
        return []
    }
}

// Debounced version of loadMoreItems to prevent excessive API calls
const debouncedLoadMore = debounce(async () => {
    if (loading.value || loadingMore.value || !hasMorePages.value) return

    loadingMore.value = true
    try {
        await loadMoreItems()
    } finally {
        loadingMore.value = false
    }
}, 300)

onMounted(() => {
    loadMoreItems()
    setupIntersectionObserver()
})

onUnmounted(() => {
    if (observer.value) {
        observer.value.disconnect()
    }
})
</script>
