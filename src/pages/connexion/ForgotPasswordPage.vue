<template>
    <q-page class="flex flex-center">
        <div class="forgot-password-container bg-secondary rounded-borders q-px-xl q-pb-sm">
            <h2 class="text-center text-h4 text-dark q-mb-xl">MOT DE PASSE OUBLIÉ</h2>
            <p class="text-dark text-center q-mb-lg">
                Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
            <q-form @submit="onSubmit" class="q-gutter-y-md">
                <q-input
                    v-model="email"
                    :rules="[val => !!val || 'Email requis', val => /^[^@]+@[^@]+\.[^@]+$/.test(val) || 'Email invalide']"
                    class="q-mb-lg"
                    filled
                    bg-color="accent"
                    color="dark"
                    label="Email"
                    lazy-rules
                    type="email"
                />

                <q-btn class="full-width" color="primary" label="Envoyer le lien" size="lg" type="submit" />

                <div class="text-center q-mt-lg">
                    <q-btn flat color="primary" label="Retour à la connexion" to="/login" />
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

const onSubmit = async () => {
    try {
        await authStore.forgotPassword(email.value)
        notify({
            color: 'positive',
            message: 'Un email de réinitialisation a été envoyé !',
            icon: 'check'
        })
        router.push('/login')
    } catch (error) {
        console.error('Forgot password error:', error)
        notify({
            color: 'negative',
            message: 'Une erreur est survenue',
            icon: 'error'
        })
    }
}
</script>

<style lang="scss" scoped>
.forgot-password-container {
    width: 100%;
    max-width: 500px;
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
