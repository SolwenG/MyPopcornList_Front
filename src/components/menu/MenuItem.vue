<template>
    <router-link :to="link">
        <q-item clickable>
            <q-item-section v-if="icon" avatar>
                <q-icon :name="icon" :color="color" />
            </q-item-section>
            <q-item-section>
                <q-item-label :class="`text-${color}`">{{ title }}</q-item-label>
            </q-item-section>
        </q-item>
    </router-link>
</template>

<script setup lang="js">
defineProps({
    title: {
        type: String,
        default: ''
    },
    link: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: 'secondary'
    }
})
</script>
