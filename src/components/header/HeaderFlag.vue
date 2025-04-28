<template>
    <q-select
        v-model="selectedFlag"
        :options="flags"
        color="primary"
        dense
        hide-bottom-space
        hide-dropdown-icon
        hide-hint
        map-options
        option-label="label"
        option-value="value"
        stack-label
        style="max-width: 3em"
    >
        <template #option="scope">
            <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                    <q-img :src="scope.opt.img" fit="cover" height="16px" style="border-radius: 2px" width="22px" />
                </q-item-section>
                <q-item-section>
                    {{ scope.opt.label }}
                </q-item-section>
            </q-item>
        </template>

        <template #selected>
            <q-img :src="selectedFlag.img" fit="cover" width="22px" />
        </template>

        <template #loading>
            <q-spinner color="primary" />
        </template>
    </q-select>
</template>

<script lang="js" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMenuStore } from '../../stores/menu'

const { locale } = useI18n()
const menuStore = useMenuStore()

const flags = [
    { label: 'Français', value: 'fr', img: 'images/flags/flag_fr.svg' },
    { label: 'English', value: 'en', img: 'images/flags/flag_en.svg' }
]

const initialFlag = flags.find(flag => flag.value === locale.value)
if (initialFlag) {
    menuStore.setLanguage(initialFlag, { locale })
}

const selectedFlag = computed({
    get: () => menuStore.selectedFlag,
    set: newFlag => {
        if (newFlag?.value && newFlag.value !== locale.value) {
            menuStore.setLanguage(newFlag, { locale })
        }
    }
})
</script>
