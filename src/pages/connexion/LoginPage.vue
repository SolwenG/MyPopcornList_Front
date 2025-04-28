<template>
    <q-page class="flex flex-center">
        <div class="login-container bg-secondary rounded-borders q-px-xl q-pb-sm">
            <h2 class="text-center text-h4 text-dark q-mb-xl">CONNEXION</h2>
            <q-form @submit="onSubmit" class="q-gutter-y-sm">
                <q-input
                    v-model="email"
                    :rules="[val => !!val || 'Email requis', val => /^[^@]+@[^@]+\.[^@]+$/.test(val) || 'Email invalide']"
                    class="q-mb-md"
                    filled
                    bg-color="accent"
                    color="dark"
                    label="Email"
                    lazy-rules
                    type="email"
                />

                <q-input
                    v-model="password"
                    :rules="[val => !!val || 'Mot de passe requis']"
                    class="q-mb-lg"
                    bg-color="accent"
                    color="dark"
                    filled
                    label="Mot De Passe"
                    lazy-rules
                    :type="isPwdVisible ? 'text' : 'password'"
                >
                    <template #append>
                        <q-icon :name="isPwdVisible ? 'visibility' : 'visibility_off'" class="cursor-pointer" @click="isPwdVisible = !isPwdVisible" />
                    </template>
                </q-input>

                <div class="row justify-between items-center q-mb-sm">
                    <q-checkbox v-model="rememberMe" color="dark" label-color="dark" label="Se souvenir de moi" />
                    <q-btn flat color="primary" label="Mot de passe oublié ?" :to="'/forgot-password'" />
                </div>

                <q-btn class="full-width" color="primary" label="Se Connecter" size="lg" type="submit" />

                <div class="text-center q-mt-lg">
                    <p class="text-dark q-mb-sm">Vous n'avez pas encore de compte ?</p>
                    <q-btn flat color="primary" label="Rejoignez le culte du popcorn !" to="/register" />
                </div>
            </q-form>
        </div>
    </q-page>
</template>

<script setup lang="js">
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
