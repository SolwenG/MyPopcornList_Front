<template>
    <div class="fullscreen bg-accent text-dark text-center q-pa-md flex flex-center">
        <div class="q-pa-xl bg-secondary" style="border-radius: 10px">
            <div style="font-size: 5rem">Erreur 404</div>
            <div style="font-size: 2.7rem; opacity: 0.5">Oops. Y a rien ici...</div>
            <q-btn
                class="q-mt-xl"
                color="primary"
                label="Retour accueil"
                no-caps
                style="font-size: 1rem; border-radius: 10px"
                text-color="white"
                to="/"
                unelevated
            />
        </div>
    </div>
</template>

<script setup lang="js"></script>
