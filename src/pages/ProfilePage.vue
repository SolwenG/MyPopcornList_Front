<template>
    <q-page class="q-pa-md">
        <div class="profile-container">
            <!-- Profile Header -->
            <div class="profile-header q-mb-lg">
                <div class="row items-center">
                    <q-avatar class="q-mr-md" size="100px">
                        <img alt="Profile" src="https://cdn.quasar.dev/img/avatar.png" />
                    </q-avatar>
                    <div>
                        <h2 class="q-my-none">Username</h2>
                        <p class="text-subtitle1 q-mt-sm">Description</p>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <q-tabs v-model="activeTab" active-color="primary" align="justify" class="text-dark" indicator-color="primary" narrow-indicator>
                <q-tab label="Aperçu" name="overview" />
                <q-tab label="Mes Listes" name="lists" />
                <q-tab label="Mes Favoris" name="favorites" />
            </q-tabs>

            <q-separator />

            <!-- Tab Panels -->
            <q-tab-panels v-model="activeTab" animated>
                <!-- Overview Tab -->
                <q-tab-panel name="overview">
                    <div v-for="(showcase, index) in showcases" :key="index" class="q-mb-xl">
                        <h3 class="text-h6 q-mb-md">{{ showcase.title }}</h3>
                        <div class="row q-col-gutter-md">
                            <div v-for="media in showcase.items" :key="media.id" class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
                                <q-card class="media-card">
                                    <q-img :ratio="2 / 3" :src="media.image" />
                                    <q-card-section class="text-center">
                                        <div class="text-subtitle2">{{ media.title }}</div>
                                    </q-card-section>
                                </q-card>
                            </div>
                        </div>
                    </div>
                </q-tab-panel>

                <!-- Lists Tab -->
                <q-tab-panel name="lists">
                    <q-tabs v-model="listTab" align="left" class="text-primary">
                        <q-tab :label="$t('all')" name="all" />
                        <q-tab :label="$t('watching')" name="watching" />
                        <q-tab :label="$t('completed')" name="completed" />
                        <q-tab :label="$t('on_hold')" name="paused" />
                        <q-tab :label="$t('dropped')" name="dropped" />
                        <q-tab :label="$t('plan_to_watch')" name="planned" />
                    </q-tabs>

                    <q-separator />

                    <div class="q-pa-md">
                        <q-list>
                            <q-item v-for="item in listItems" :key="item.id">
                                <q-item-section avatar>
                                    <q-img :src="item.image" style="width: 50px; height: 75px" />
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label>{{ item.title }}</q-item-label>
                                    <q-item-label caption>
                                        <div class="row items-center">
                                            <div class="col">
                                                <q-rating v-model="item.rating" :max="5" color="primary" readonly size="1em" />
                                            </div>
                                            <div class="col">{{ $t('progress') }}: {{ item.progress }}/{{ item.total }}</div>
                                        </div>
                                    </q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </div>
                </q-tab-panel>

                <!-- Favorites Tab -->
                <q-tab-panel name="favorites">
                    <q-tabs v-model="favoriteTab" align="left" class="text-primary">
                        <q-tab :label="$t('topanime')" name="anime" />
                        <q-tab :label="$t('topmovies')" name="movies" />
                        <q-tab :label="$t('topseries')" name="series" />
                        <q-tab :label="$t('topcartoons')" name="cartoons" />
                        <q-tab :label="$t('all')" name="all" />
                    </q-tabs>

                    <q-separator />

                    <div class="row q-col-gutter-md q-pa-md">
                        <div v-for="item in favoriteItems" :key="item.id" class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
                            <q-card class="media-card">
                                <q-img :ratio="2 / 3" :src="item.image" />
                                <q-card-section class="text-center">
                                    <div class="text-subtitle2">{{ item.title }}</div>
                                </q-card-section>
                            </q-card>
                        </div>
                    </div>
                </q-tab-panel>
            </q-tab-panels>
        </div>
    </q-page>
</template>

<script lang="js" setup>
import { ref } from 'vue'
import { axios } from 'boot/axios'

const activeTab = ref('overview')
const listTab = ref('all')
const favoriteTab = ref('all')

// Sample data - replace with real data from your store
const showcases = ref([
    {
        title: 'Titre de la vitrine',
        items: [
            { id: 1, title: 'Attack on Titan', image: '/images/sample/aot.jpg' },
            { id: 2, title: 'Spy x Family', image: '/images/sample/spyxfamily.jpg' },
            { id: 3, title: 'Made in Abyss', image: '/images/sample/madeinabyss.jpg' }
        ]
    }
])

const listItems = ref([
    {
        id: 1,
        title: 'Shingeki no Kyojin',
        image: '/images/sample/aot.jpg',
        rating: 4,
        progress: 10,
        total: 25
    }
])

const favoriteItems = ref([
    { id: 1, title: 'Attack on Titan', image: '/images/sample/aot.jpg' },
    { id: 2, title: 'Spy x Family', image: '/images/sample/spyxfamily.jpg' }
])

const profile = ref(null)

const fetchProfileData = id => {
    // Logic to fetch profile data by ID
    axios
        .get(`/api/profiles/${id}`)
        .then(response => {
            profile.value = response.data
        })
        .catch(error => {
            console.error('Error fetching profile data:', error)
        })
}

defineExpose({
    beforeRouteUpdate: (to, from, next) => {
        fetchProfileData(to.params.id)
        next()
    }
})
</script>

<style lang="scss" scoped>
.profile-container {
    max-width: 1200px;
    margin: 0 auto;
}

.media-card {
    transition: transform 0.2s;
    &:hover {
        transform: scale(1.05);
    }
}
</style>
