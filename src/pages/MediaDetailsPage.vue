<template>
    <q-page padding>
        <div class="bg-secondary q-pa-md rounded-borders">
            <div v-if="loading" class="full-width full-height flex flex-center">
                <q-spinner color="primary" size="3em" />
            </div>
            <div v-else-if="error" class="text-center q-pa-md">
                <q-icon color="negative" name="error" size="3em" />
                <p class="text-h6 text-negative">{{ error }}</p>
            </div>
            <div v-else class="row q-col-gutter-lg">
                <!-- Media Poster -->
                <div class="col-12 col-sm-4 col-md-3">
                    <q-img :ratio="2 / 3" :src="media.posterPath" class="rounded-borders">
                        <template #error>
                            <div class="absolute-full flex flex-center bg-secondary text-dark">{{ media.title }}</div>
                        </template>
                    </q-img>
                </div>

                <!-- Media Info -->
                <div class="col-12 col-sm-8 col-md-9 text-dark">
                    <div class="row items-center q-gutter-x-md q-mb-md">
                        <q-icon
                            :icon="isFavorite ? 'fas fa-heart' : 'far fa-heart'"
                            class="cursor-pointer"
                            color="red"
                            size="2em"
                            @click="toggleFavorite"
                        />
                        <h2 class="text-h4 q-mt-none">{{ media.title }}</h2>
                    </div>
                    <div class="row items-center q-gutter-x-md q-mb-md">
                        <span class="text-h6">{{ media.year }}</span>
                        <q-rating
                            v-if="media.voteAverage"
                            v-model="media.voteAverage"
                            color="amber"
                            color-half="amber"
                            icon="star_border"
                            icon-half="star_half"
                            icon-selected="star"
                            max="5"
                            readonly
                            size="2em"
                        />
                    </div>

                    <p class="text-body1">{{ media.overview }}</p>

                    <div class="row q-col-gutter-md">
                        <div class="col-12 col-md-6">
                            <h2 class="text-h6">{{ $t('details') }}</h2>
                            <q-list>
                                <q-item v-if="media.genres">
                                    <q-item-section>
                                        <q-item-label caption>{{ $t('genre') }}</q-item-label>
                                        <q-item-label>{{ media.genres.map(genre => genre.name).join(', ') }} </q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item v-if="media.runtime">
                                    <q-item-section>
                                        <q-item-label caption>{{ $t('runtime') }}</q-item-label>
                                        <q-item-label>{{ media.runtime }} min</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item v-if="media.numberOfSeasons">
                                    <q-item-section>
                                        <q-item-label caption>{{ $t('season') }}</q-item-label>
                                        <q-item-label>{{ media.numberOfSeasons }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item v-if="media.numberOfEpisodes">
                                    <q-item-section>
                                        <q-item-label caption>{{ $t('episodes') }}</q-item-label>
                                        <q-item-label>{{ media.numberOfEpisodes }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item v-if="media.episodes">
                                    <q-item-section>
                                        <q-item-label caption>{{ $t('episodes') }}</q-item-label>
                                        <q-item-label>{{ media.episodes }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item v-if="media.duration">
                                    <q-item-section>
                                        <q-item-label caption>{{ $t('runtime') }}</q-item-label>
                                        <q-item-label>{{ media.duration }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </div>

                        <div class="col-12 col-md-6">
                            <q-btn
                                v-if="isLogged"
                                :label="userLists.length ? $t('update_lists') : $t('add_to_lists')"
                                class="q-mt-sm"
                                color="primary"
                                dense
                                flat
                                @click.stop="$refs.listMenu.show"
                            />
                            <q-menu ref="listMenu" :offset="[0, 8]">
                                <q-list style="min-width: 200px">
                                    <q-item-label header>
                                        {{ userLists.length ? $t('update_lists') : $t('add_to_lists') }}
                                    </q-item-label>
                                    <q-item v-for="list in userLists" :key="list.id" v-close-popup clickable>
                                        <q-item-section>
                                            <q-checkbox v-model="list.hasMedia" :label="list.name" @update:model-value="toggleMediaInList(list)" />
                                        </q-item-section>
                                    </q-item>
                                    <q-separator />
                                    <q-item v-close-popup clickable @click="createNewList">
                                        <q-item-section>
                                            <q-item-label>
                                                <q-icon name="add" size="xs" />
                                                Créer une nouvelle liste
                                            </q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </q-menu>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </q-page>
</template>

<script lang="js" setup>
import { computed, onMounted, ref } from 'vue'
import { anilistApi, tmdbApi } from 'boot/axios'
import { useQuasar } from 'quasar'
import { useUserStore } from 'stores/user'
import { useAuthStore } from 'stores/auth'
import { notify } from 'src/utils/notify'

const props = defineProps({
    type: {
        type: String,
        required: true,
        validator: value => ['movie', 'tv', 'anime', 'cartoon'].includes(value)
    },
    id: {
        type: [String, Number],
        required: true
    }
})

const $q = useQuasar()
const media = ref(null)
const loading = ref(true)
const error = ref(null)
const userStore = useUserStore()
const authStore = useAuthStore()

const isLogged = computed(() => authStore.isLogged)
const isFavorite = computed(() => userStore.getFavorites.some(f => f.id === Number(props.id) && f.type === props.type))
const userLists = computed(() => {
    return userStore.getLists.map(list => ({
        ...list,
        hasMedia: userStore.isMediaInList(list.id, Number(props.id))
    }))
})

const fetchMediaDetails = async () => {
    try {
        loading.value = true
        error.value = null
        let response

        switch (props.type) {
            case 'movie':
                response = await tmdbApi.get(`/movie/${props.id}`)
                break
            case 'tv':
            case 'cartoon':
                response = await tmdbApi.get(`/tv/${props.id}`)
                break
            case 'anime': {
                response = await anilistApi.post('', {
                    query: `
                        query ($id: Int) {
                            Media(id: $id, type: ANIME) {
                                id
                                title {
                                    romaji
                                    english
                                }
                                description
                                coverImage {
                                    large
                                }
                                startDate {
                                    year
                                }
                                episodes
                                duration
                                averageScore
                                popularity
                                genres
                            }
                        }
                    `,
                    variables: { id: Number(props.id) }
                })
                break
            }
        }

        const commonData = {
            id: response.data.id,
            title: response.data.title,
            overview: response.data.overview,
            posterPath: `https://image.tmdb.org/t/p/w500${response.data.poster_path}`,
            year: response.data.release_date
                ? new Date(response.data.release_date).getFullYear()
                : new Date(response.data.first_air_date).getFullYear(),
            voteAverage: response.data.vote_average,
            voteCount: response.data.vote_count,
            genres: response.data.genres
        }
        console.log(response.data)

        switch (props.type) {
            case 'movie':
                media.value = { ...commonData, runtime: response.data.runtime }
                break
            case 'tv':
            case 'cartoon':
                media.value = {
                    ...commonData,
                    numberOfSeasons: response.data.number_of_seasons,
                    numberOfEpisodes: response.data.number_of_episodes
                }
                break
            case 'anime': {
                const animeData = response.data.data.Media
                media.value = {
                    id: animeData.id,
                    type: 'anime',
                    title: animeData.title.english || animeData.title.romaji,
                    overview: animeData.description,
                    posterPath: animeData.coverImage.large,
                    year: animeData.startDate.year,
                    episodes: animeData.episodes,
                    duration: animeData.duration,
                    voteAverage: animeData.averageScore / 10,
                    voteCount: animeData.popularity,
                    genres: animeData.genres.map(genre => ({ name: genre }))
                }
                break
            }
        }
    } catch (err) {
        console.error('Error fetching media details:', err)
        error.value = 'Erreur lors du chargement des détails'
        notify({
            color: 'negative',
            message: 'Erreur lors du chargement des détails',
            icon: 'error'
        })
    } finally {
        loading.value = false
    }
}

const toggleFavorite = async () => {
    try {
        if (isFavorite.value) {
            await userStore.removeFavorite(media.value)
        } else {
            await userStore.addFavorite(media.value)
        }
    } catch (err) {
        console.error('Error updating favorites:', err)
        notify({ color: 'negative', message: "Erreur lors de l'ajout à mes favoris", icon: 'error' })
    }
}

const toggleMediaInList = async list => {
    try {
        if (list.hasMedia) {
            userStore.addMediaToList(list.id, media.value)
        } else {
            await userStore.removeMediaFromList(list.id, Number(props.id))
            notify({
                color: 'positive',
                message: `Retiré de la liste "${list.name}"`,
                icon: 'check'
            })
        }
    } catch (error) {
        notify({
            color: 'negative',
            message: 'Erreur lors de la modification de la liste',
            icon: 'error'
        })
        console.error(error)
    }
}

const createNewList = () => {
    $q.dialog({
        title: 'Créer une nouvelle liste',
        prompt: {
            model: '',
            type: 'text',
            placeholder: 'Nom de la liste'
        },
        cancel: true,
        persistent: true
    }).onOk(async name => {
        if (name) {
            try {
                await userStore.createList(name)
                notify({
                    color: 'positive',
                    message: 'Liste créée avec succès',
                    icon: 'check'
                })
            } catch (error) {
                notify({
                    color: 'negative',
                    message: 'Erreur lors de la création de la liste',
                    icon: 'error'
                })
                console.error(error)
            }
        }
    })
}

onMounted(fetchMediaDetails)
</script>
