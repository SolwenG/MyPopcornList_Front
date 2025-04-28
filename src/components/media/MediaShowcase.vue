<template>
    <div class="media-showcase bg-secondary q-pa-md rounded-borders">
        <div class="row items-center justify-between q-mb-md">
            <h2 class="text-h6 text-dark q-my-none">{{ title }}</h2>
            <q-btn v-if="showViewAll" flat color="primary" :to="viewAllRoute" label="Voir tout" />
        </div>

        <div class="row no-wrap overflow-auto">
            <div v-for="media in displayedMedia" :key="media.id" class="q-pa-sm">
                <MediaCard style="min-height: 280px; width: 150px" :media="media" @click="$emit('media-click', media)" />
            </div>
        </div>
    </div>
</template>

<script setup lang="js">
import { computed } from 'vue'
import MediaCard from './MediaCard.vue'

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    medias: {
        type: Array,
        required: true
    },
    showViewAll: {
        type: Boolean,
        default: false
    },
    viewAllRoute: {
        type: [String, Object],
        default: null
    }
})

defineEmits(['media-click'])

const displayedMedia = computed(() => props.medias.slice(0, 10))
</script>

<style lang="scss" scoped>
.media-showcase {
    .row {
        scrollbar-width: thin;
        &::-webkit-scrollbar {
            height: 6px;
        }
        &::-webkit-scrollbar-track {
            background: transparent;
        }
        &::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 3px;
        }
    }
}

.media-card {
    transition: transform 0.2s ease-in-out;

    &:hover {
        transform: scale(1.02);
        cursor: pointer;
    }
}
</style>
