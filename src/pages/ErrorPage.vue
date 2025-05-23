<template>
    <div class="fullscreen bg-accent text-dark text-center q-pa-md flex flex-center">
        <div class="q-pa-xl bg-secondary" style="border-radius: 10px">
            <div style="font-size: 5rem">{{ $t('error') }} 404</div>
            <div style="font-size: 2.7rem; opacity: 0.5">Oops. {{ $t('nothing_here') }}...</div>
            <q-btn
                :label="$t('back_home')"
                class="q-mt-xl"
                color="primary"
                no-caps
                style="font-size: 1rem; border-radius: 10px"
                text-color="white"
                to="/"
                unelevated
            />
        </div>
    </div>
</template>

<script lang="js" setup></script>
