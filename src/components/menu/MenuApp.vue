<template>
    <q-drawer v-model="menuStore.isMenuOpen" :width="260" class="bg-dark text-secondary">
        <div v-if="menuStore.isMobileMode" class="text-center q-mt-md">
            <router-link style="font-size: 1.5rem" to="/">
                MyPopcornList
                <q-tooltip class="bg-primary">retour page d'accueil</q-tooltip>
            </router-link>
            <q-img alt="popcorn cup" fit="cover" height="40px" src="images/popcorn.svg" style="rotate: 20deg" width="30px" />
        </div>
        <q-list padding>
            <MenuItem v-if="authStore.isLogged" :title="$t('profile')" class="menu-item" icon="person" link="/profile" />
            <MenuItem :title="$t('search')" class="menu-item" icon="search" @click="openSearchModal" />
            <MenuItem :title="$t('topmovies')" class="menu-item" icon="movie_filter" link="/top/movies" />
            <MenuItem :title="$t('topseries')" class="menu-item" icon="live_tv" link="/top/series" />
            <MenuItem :title="$t('topanime')" class="menu-item" icon="animation" link="/top/anime" />
            <MenuItem :title="$t('topcartoons')" class="menu-item" icon="child_care" link="/top/cartoons" />
            <MenuItem v-if="authStore.isLogged" :title="$t('settings')" class="menu-item" icon="settings" link="/settings" />
            <MenuItem v-if="authStore.isLogged" :title="$t('logout')" class="menu-item" icon="logout" @click="authStore.logout()" />
        </q-list>
        <SearchModal v-model="showSearchModal" />
    </q-drawer>
</template>

<script lang="js" setup>
import { ref } from 'vue'
import { useMenuStore } from 'stores/menu'
import { useQuasar } from 'quasar'
import MenuItem from 'components/menu/MenuItem.vue'
import { useAuthStore } from 'stores/auth'
import SearchModal from 'components/leaves/SearchModal.vue'

const $q = useQuasar()
const menuStore = useMenuStore()
const authStore = useAuthStore()
const showSearchModal = ref(false)

const openSearchModal = () => {
    showSearchModal.value = true
}

menuStore.setMobileMode($q.screen.lt.md)
</script>

<style lang="scss">
.menu-item {
    .q-icon {
        margin-right: 8px;
        margin-left: -4px;
    }
}
</style>
