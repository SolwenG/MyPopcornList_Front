<template>
    <q-header class="bg-dark" elevated style="height: 80px">
        <q-toolbar>
            <q-btn aria-label="Menu" dense flat icon="menu" round @click="$emit('toggleMenu')" />
            <q-toolbar-title>
                <router-link class="flex items-center no-wrap" to="/">
                    <h1 class="text-h5 text-secondary">MyPopcornList</h1>
                    <q-img alt="popcorn cup" fit="cover" height="40px" src="images/popcorn.svg" style="rotate: 20deg" width="30px" />
                </router-link>
            </q-toolbar-title>

            <div style="width: 20em">
                <div class="row" style="width: 100%; justify-content: end; align-items: center; gap: 10px">
                    <q-btn dense flat round>
                        <q-icon color="secondary" name="search" size="1.5em" @click="openSearchModal" />
                        <q-tooltip class="bg-primary">{{ $t('search') }}</q-tooltip>
                    </q-btn>
                    <template v-if="isLogged">
                        <q-btn class="q-mr-sm" dense flat icon="account_circle" round to="/profile">
                            <q-tooltip>{{ $t('profile') }}</q-tooltip>
                        </q-btn>
                    </template>
                    <template v-else>
                        <router-link class="q-mr-md" style="font-size: 1rem" to="/login">{{ $t('login') }}</router-link>
                    </template>

                    <HeaderFlag />
                </div>
            </div>
        </q-toolbar>
        <SearchModal v-model="showSearchModal" />
    </q-header>
</template>

<script lang="js" setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../../stores/auth.js'
import HeaderFlag from './HeaderFlag.vue'
import SearchModal from '../leaves/SearchModal.vue'

defineEmits(['toggleMenu', 'openSearch'])

const authStore = useAuthStore()
const showSearchModal = ref(false)

const isLogged = computed(() => authStore.isLogged)

const openSearchModal = () => {
    showSearchModal.value = true
}
</script>
