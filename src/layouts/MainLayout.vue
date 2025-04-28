<template>
    <q-layout container style="height: 100vh" view="hHh Lpr lff">
        <AppHeader @toggle-menu="menuStore.toggleMenu()" />
        <AppMenu />

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script setup lang="js">
import AppHeader from 'components/header/HeaderApp.vue'
import AppMenu from 'components/menu/MenuApp.vue'
import { useMenuStore } from 'stores/menu'

const menuStore = useMenuStore()
</script>
