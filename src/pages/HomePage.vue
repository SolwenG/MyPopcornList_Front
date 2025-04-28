<template>
    <q-page class="q-pa-md">
        <div v-if="isLogged">
            <!-- User's In Progress Media -->
            <MediaShowcase v-if="inProgressMedia.length" :medias="inProgressMedia" :title="$t('watching')" class="q-mb-lg" />

            <!-- Following Users' Activity -->
            <MediaShowcase v-if="followingActivity.length" :medias="followingActivity" title="Activité des amis" class="q-mb-lg" />

            <!-- Recommendations -->
            <MediaShowcase v-if="recommendations.length" :medias="recommendations" :title="$t('recommendations')" class="q-mb-lg" />
        </div>

        <!-- Popular Media -->
        <MediaShowcase :medias="trendingMedia" :title="$t('trending')" class="q-mb-lg" />

        <!-- Top Media by Category -->
        <MediaShowcase :medias="topMovies" :title="$t('topmovies')" :show-view-all="true" view-all-route="top/movies" class="q-mb-lg" />
        <MediaShowcase :medias="topSeries" :title="$t('topseries')" :show-view-all="true" view-all-route="top/series" class="q-mb-lg" />
        <MediaShowcase :medias="topAnime" :title="$t('topanime')" :show-view-all="true" view-all-route="top/anime" class="q-mb-lg" />
        <MediaShowcase :medias="topCartoons" :title="$t('topcartoons')" :show-view-all="true" view-all-route="top/cartoons" class="q-mb-lg" />
    </q-page>
</template>

<script setup lang="js">
import { onMounted, computed } from 'vue'
import { useMediaStore } from 'stores/media'
import { useAuthStore } from 'stores/auth'
import { useUserStore } from 'stores/user'
import MediaShowcase from 'components/media/MediaShowcase.vue'

const mediaStore = useMediaStore()
const authStore = useAuthStore()
const userStore = useUserStore()

const isLogged = computed(() => authStore.isLogged)
const trendingMedia = computed(() => mediaStore.getTrendingMedia)
const topMovies = computed(() => mediaStore.getTopMovies)
const topSeries = computed(() => mediaStore.getTopSeries)
const topAnime = computed(() => mediaStore.getTopAnimes)
const topCartoons = computed(() => mediaStore.getTopCartoons)

const inProgressMedia = computed(() => {
    if (!isLogged.value) return []
    return userStore.getUserLists.flatMap(list => list.media).filter(media => media.status === 'en_cours')
})

const followingActivity = computed(() => {
    if (!isLogged.value) return []
    // Implementation depends on your backend API
    return []
})

const recommendations = computed(() => {
    if (!isLogged.value) return []
    return mediaStore.getRecommendations
})

onMounted(async () => {
    await Promise.all([
        mediaStore.fetchTrendingMedia(),
        mediaStore.fetchTopMedia('movie'),
        mediaStore.fetchTopMedia('tv'),
        mediaStore.fetchTopMedia('anime'),
        mediaStore.fetchTopMedia('cartoon')
    ])

    if (isLogged.value) {
        await userStore.fetchUserLists()
    }
})
</script>
