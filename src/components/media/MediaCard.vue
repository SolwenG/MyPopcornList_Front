<template>
    <div class="media-card" @click="goToMedia" style="cursor: pointer">
        <div class="media-poster">
            <q-img :src="posterUrl" class="rounded-borders" height="100%" width="100%" fit="cover">
                <template #error>
                    <div class="absolute-full flex flex-center bg-secondary text-dark">{{ mediaTitle }}</div>
                </template>
            </q-img>
        </div>
        <div class="media-info q-mt-sm">
            <div class="text-subtitle1 text-dark text-weight-medium ellipsis-2-lines">
                {{ mediaTitle }}
            </div>
            <div class="row items-center justify-between q-mt-xs">
                <div class="text-caption text-grey">{{ mediaYear }}</div>
                <div v-if="mediaRating" class="row items-center" :title="$t('rating')">
                    <q-icon name="star" color="yellow" size="xs" />
                    <span class="q-ml-xs text-caption">{{ mediaRating }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="js">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
    media: {
        type: Object,
        required: true
    }
})

const router = useRouter()

const posterUrl = computed(() => {
    // Handle direct posterUrl (from Anilist)
    if (props.media.coverImage) return props.media.coverImage.large || props.media.coverImage.medium
    // Handle TMDB poster path
    if (props.media.poster_path) return `https://image.tmdb.org/t/p/w500${props.media.poster_path}`
    return null
})

const mediaTitle = computed(() => {
    // Handle anime titles (object with english/romaji/native)
    if (props.media.title && typeof props.media.title === 'object') {
        return props.media.title.english || props.media.title.romaji || props.media.title.native
    }
    // Handle movie/TV show titles (string)
    return props.media.title || props.media.name
})

const mediaYear = computed(() => {
    // Direct year property
    if (props.media.startDate && props.media.startDate.year) return props.media.startDate.year
    // Handle various date formats
    const date = props.media.release_date || props.media.first_air_date
    if (date) return new Date(date).getFullYear()
    return null
})

const mediaRating = computed(() => {
    if (props.media.averageScore) return (props.media.averageScore / 20).toFixed(1)
    if (props.media.vote_average) return props.media.vote_average.toFixed(1)
    return null
})

const goToMedia = () => {
    let type = props.media.type
    if (!type) {
        // Try to determine type from the data structure
        if (props.media.first_air_date) type = 'tv'
        else if (props.media.release_date) type = 'movie'
        else if (props.media.title?.romaji) type = 'anime'
        else type = 'movie' // Default to movie if we can't determine
    }
    router.push(`/media/${type}/${props.media.id}`)
}
</script>

<style lang="scss" scoped>
.media-card {
    display: flex;
    flex-direction: column;
    height: 100%;

    .media-poster {
        position: relative;
        height: 225px;
        width: 150px;
    }

    .ellipsis-2-lines {
        display: -webkit-box;
        line-clamp: 2;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
}
</style>
