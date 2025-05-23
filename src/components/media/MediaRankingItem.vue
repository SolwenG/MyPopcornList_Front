<template>
    <q-card class="media-item row q-mb-md">
        <div class="row items-center no-wrap" style="width: 100%">
            <!-- Rank -->
            <div class="q-mx-sm">
                <template v-if="!loading">
                    <div class="bg-primary q-pa-sm text-white text-center" style="border-radius: 50%; width: 35px; height: 35px">#{{ rank }}</div>
                </template>
                <template v-else>
                    <q-skeleton class="q-pa-sm" style="width: 35px; height: 35px" type="QBadge" />
                </template>
            </div>

            <!-- Image -->
            <template v-if="!loading">
                <q-img
                    :src="imageUrl"
                    class="rounded-borders cursor-pointer"
                    fit="cover"
                    style="min-width: 120px; max-width: 170px"
                    @click="goToDetails"
                />
            </template>
            <template v-else>
                <q-skeleton class="rounded-borders" style="min-width: 120px; max-width: 170px; height: 180px" type="QImg" />
            </template>

            <!-- Content -->
            <q-card-section class="col-grow text-dark q-py-sm">
                <!-- Title and Year -->
                <template v-if="!loading">
                    <div :title="title" class="text-h6 cursor-pointer" @click="goToDetails">{{ title }}</div>
                    <div class="text-subtitle2">{{ year }}</div>
                </template>
                <template v-else>
                    <div class="q-mb-sm">
                        <q-skeleton class="text-h6" type="text" />
                    </div>
                    <q-skeleton class="q-mb-lg" type="text" width="100px" />
                </template>

                <!-- Score Overview -->
                <div class="row q-col-gutter-md q-mb-md">
                    <div class="col-12 col-sm-6">
                        <div class="text-caption uppercase">Popcorn Score</div>
                        <template v-if="!loading">
                            <div class="row items-center">
                                <q-icon name="img:/images/popcorn.svg" size="26px" style="rotate: -10deg" />
                                <span class="text-h5 q-ml-sm">{{ voteAverage.toFixed(1) }}/10</span>
                            </div>
                        </template>
                        <template v-else>
                            <q-skeleton class="q-mt-sm" type="text" width="120px" />
                        </template>
                    </div>
                    <div class="col-12 col-sm-6">
                        <div class="text-caption uppercase">Popcorn O'meter</div>
                        <template v-if="!loading">
                            <div class="row items-center">
                                <q-icon name="fas fa-chart-line" size="20px" />
                                <span class="text-h5 q-ml-sm">{{ voteCount }}</span>
                            </div>
                        </template>
                        <template v-else>
                            <q-skeleton class="q-mt-sm" type="text" width="80px" />
                        </template>
                    </div>
                </div>

                <!-- Detailed Scores - Hidden on Mobile -->
                <div class="row q-col-gutter-sm gt-xs">
                    <template v-if="!loading">
                        <div class="col-6">
                            <div class="text-caption uppercase">{{ $t('scenario') }}</div>
                            <q-linear-progress :value="scenario / 10" class="q-mt-sm" color="primary" size="md" />
                            <div class="text-caption text-right">{{ scenario.toFixed(1) }}/10</div>
                        </div>
                        <div class="col-6">
                            <div class="text-caption uppercase">{{ $t('visual') }}</div>
                            <q-linear-progress :value="visual / 10" class="q-mt-sm" color="primary" size="md" />
                            <div class="text-caption text-right">{{ visual.toFixed(1) }}/10</div>
                        </div>
                        <div class="col-6">
                            <div class="text-caption uppercase">{{ $t('enjoyment') }}</div>
                            <q-linear-progress :value="enjoyment / 10" class="q-mt-sm" color="primary" size="md" />
                            <div class="text-caption text-right">{{ enjoyment.toFixed(1) }}/10</div>
                        </div>
                        <div class="col-6">
                            <div class="text-caption uppercase">{{ $t('characters') }}</div>
                            <q-linear-progress :value="characters / 10" class="q-mt-sm" color="primary" size="md" />
                            <div class="text-caption text-right">{{ characters.toFixed(1) }}/10</div>
                        </div>
                        <div class="col-6">
                            <div class="text-caption uppercase">{{ $t('music') }}</div>
                            <q-linear-progress :value="music / 10" class="q-mt-sm" color="primary" size="md" />
                            <div class="text-caption text-right">{{ music.toFixed(1) }}/10</div>
                        </div>
                    </template>
                    <template v-else>
                        <div v-for="n in 5" :key="n" class="col-6">
                            <q-skeleton class="q-mb-sm" type="text" width="80px" />
                            <q-skeleton class="q-mt-sm" type="QLinearProgress" />
                            <q-skeleton class="q-mt-sm float-right" type="text" width="50px" />
                        </div>
                    </template>
                </div>

                <!-- Mobile Scores -->
                <div class="row q-col-gutter-sm xs">
                    <template v-if="!loading">
                        <div class="col-6">
                            <div class="text-caption uppercase">{{ $t('scenario') }}</div>
                            <div class="text-subtitle1">{{ scenario.toFixed(1) }}/10</div>
                        </div>
                        <div class="col-6">
                            <div class="text-caption uppercase">{{ $t('visual') }}</div>
                            <div class="text-subtitle1">{{ visual.toFixed(1) }}/10</div>
                        </div>
                        <div class="col-6">
                            <div class="text-caption uppercase">{{ $t('enjoyment') }}</div>
                            <div class="text-subtitle1">{{ enjoyment.toFixed(1) }}/10</div>
                        </div>
                        <div class="col-6">
                            <div class="text-caption uppercase">{{ $t('characters') }}</div>
                            <div class="text-subtitle1">{{ characters.toFixed(1) }}/10</div>
                        </div>
                        <div class="col-6">
                            <div class="text-caption uppercase">{{ $t('music') }}</div>
                            <div class="text-subtitle1">{{ music.toFixed(1) }}/10</div>
                        </div>
                    </template>
                    <template v-else>
                        <div v-for="n in 5" :key="n" class="col-6">
                            <q-skeleton class="q-mb-sm" type="text" width="80px" />
                            <q-skeleton type="text" width="50px" />
                        </div>
                    </template>
                </div>
            </q-card-section>
        </div>
    </q-card>
</template>

<script lang="js" setup>
import { useRouter } from 'vue-router'

const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    },
    rank: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    year: {
        type: [String, Number],
        default: ''
    },
    voteAverage: {
        type: Number,
        required: true
    },
    voteCount: {
        type: Number,
        required: true
    },
    scenario: {
        type: Number,
        default: 0
    },
    visual: {
        type: Number,
        default: 0
    },
    enjoyment: {
        type: Number,
        default: 0
    },
    characters: {
        type: Number,
        default: 0
    },
    music: {
        type: Number,
        default: 0
    },
    mediaId: {
        type: [String, Number],
        required: true
    },
    mediaType: {
        type: String,
        required: true
    }
})

const router = useRouter()

const goToDetails = () => {
    if (!props.loading) {
        router.push(`/media/${props.mediaType}/${props.mediaId}`)
    }
}
</script>

<style lang="scss" scoped>
.media-item {
    background-color: $secondary;
}

.rounded-borders {
    border-radius: 8px;
    overflow: hidden;
}

.text-h6 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
