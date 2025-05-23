<template>
    <q-page class="flex flex-center">
        <div class="login-container bg-secondary rounded-borders q-px-xl q-pb-sm">
            <h2 class="text-center text-uppercase text-h4 text-dark q-mb-xl">{{ $t('login') }}</h2>
            <q-form class="q-gutter-y-sm" @submit="onSubmit">
                <q-input
                    v-model="email"
                    :label="$t('email')"
                    :rules="[val => !!val || $t('email_required'), val => /^[^@]+@[^@]+\.[^@]+$/.test(val) || $t('email_required')]"
                    bg-color="accent"
                    class="q-mb-md"
                    color="dark"
                    filled
                    lazy-rules
                    type="email"
                />

                <q-input
                    v-model="password"
                    :label="$t('password')"
                    :rules="[val => !!val || $t('password_required')]"
                    :type="isPwdVisible ? 'text' : 'password'"
                    bg-color="accent"
                    class="q-mb-lg"
                    color="dark"
                    filled
                    lazy-rules
                >
                    <template #append>
                        <q-icon :name="isPwdVisible ? 'visibility' : 'visibility_off'" class="cursor-pointer" @click="isPwdVisible = !isPwdVisible" />
                    </template>
                </q-input>

                <div class="row justify-between items-center q-mb-sm">
                    <q-checkbox v-model="rememberMe" :label="$t('remember_me')" color="dark" label-color="dark" />
                    <q-btn :label="$t('password_forgotten')" :to="'/forgot-password'" color="primary" flat />
                </div>

                <q-btn :label="$t('login')" class="full-width" color="primary" size="lg" type="submit" />

                <div class="text-center q-mt-lg">
                    <p class="text-dark q-mb-sm">{{ $t('no_account') }}</p>
                    <q-btn :label="$t('join_us')" color="primary" flat to="/register" />
                </div>
            </q-form>
        </div>
    </q-page>
</template>

<script lang="js" setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'
import { notify } from '../../utils/notify'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const isPwdVisible = ref(false)
const rememberMe = ref(false)

const onSubmit = async () => {
    try {
        const success = await authStore.login(email.value, password.value)
        if (success) {
            router.push('/')
            notify({
                color: 'positive',
                message: 'Connexion réussie !',
                icon: 'check'
            })
        } else {
            notify({
                color: 'negative',
                message: 'Email ou mot de passe incorrect',
                icon: 'warning'
            })
        }
    } catch (error) {
        console.error('Login error:', error)
        notify({
            color: 'negative',
            message: 'Une erreur est survenue',
            icon: 'error'
        })
    }
}
</script>

<style lang="scss" scoped>
.login-container {
    width: 100%;
    max-width: 500px;
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
