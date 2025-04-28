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
            <MenuItem v-if="authStore.isLogged" :title="$t('profile')" icon="person" link="/profile" class="menu-item" />
            <MenuItem :title="$t('search')" icon="search" class="menu-item" @click="openSearchModal" />
            <MenuItem :title="$t('topmovies')" icon="movie_filter" link="/top/movies" class="menu-item" />
            <MenuItem :title="$t('topseries')" icon="live_tv" link="/top/series" class="menu-item" />
            <MenuItem :title="$t('topanime')" icon="animation" link="/top/anime" class="menu-item" />
            <MenuItem :title="$t('topcartoon')" icon="child_care" link="/top/cartoons" class="menu-item" />
            <MenuItem v-if="authStore.isLogged" :title="$t('settings')" icon="settings" link="/settings" class="menu-item" />
            <MenuItem v-if="authStore.isLogged" :title="$t('logout')" icon="logout" @click="authStore.logout()" class="menu-item" />
        </q-list>
        <SearchModal v-model="showSearchModal" />
    </q-drawer>
</template>

<script setup lang="js">
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
