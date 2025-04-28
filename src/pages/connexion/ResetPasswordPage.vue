<template>
    <q-page class="flex flex-center">
        <div class="reset-password-container bg-secondary rounded-borders q-px-xl q-pb-sm">
            <h2 class="text-center text-h4 text-dark q-mb-xl">RÉINITIALISER LE MOT DE PASSE</h2>
            <q-form @submit="onSubmit" class="q-gutter-y-md">
                <q-input
                    v-model="password"
                    :rules="[val => !!val || 'Mot de passe requis', val => val.length >= 8 || 'Le mot de passe doit contenir au moins 8 caractères']"
                    class="q-mb-md"
                    filled
                    bg-color="accent"
                    color="dark"
                    label="Nouveau mot de passe"
                    lazy-rules
                    :type="isPwdVisible ? 'text' : 'password'"
                >
                    <template #append>
                        <q-icon :name="isPwdVisible ? 'visibility' : 'visibility_off'" class="cursor-pointer" @click="isPwdVisible = !isPwdVisible" />
                    </template>
                </q-input>

                <q-input
                    v-model="confirmPassword"
                    :rules="[
                        val => !!val || 'Confirmation du mot de passe requise',
                        val => val === password || 'Les mots de passe ne correspondent pas'
                    ]"
                    class="q-mb-lg"
                    filled
                    bg-color="accent"
                    color="dark"
                    label="Confirmer le nouveau mot de passe"
                    lazy-rules
                    :type="isConfirmPwdVisible ? 'text' : 'password'"
                >
                    <template #append>
                        <q-icon
                            :name="isConfirmPwdVisible ? 'visibility' : 'visibility_off'"
                            class="cursor-pointer"
                            @click="isConfirmPwdVisible = !isConfirmPwdVisible"
                        />
                    </template>
                </q-input>

                <q-btn class="full-width" color="primary" label="Réinitialiser" size="lg" type="submit" />

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
import { useRouter, useRoute } from 'vue-router'
import { notify } from '../../utils/notify'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const password = ref('')
const confirmPassword = ref('')
const isPwdVisible = ref(false)
const isConfirmPwdVisible = ref(false)

const onSubmit = async () => {
    try {
        const token = route.query.token
        if (!token) {
            notify({
                color: 'negative',
                message: 'Token de réinitialisation manquant',
                icon: 'error'
            })
            return
        }

        const success = await authStore.resetPassword(token, password.value)
        if (success) {
            notify({
                color: 'positive',
                message: 'Mot de passe réinitialisé avec succès !',
                icon: 'check'
            })
            router.push('/login')
        } else {
            notify({
                color: 'negative',
                message: 'Erreur lors de la réinitialisation du mot de passe',
                icon: 'error'
            })
        }
    } catch (error) {
        console.error('Reset password error:', error)
        notify({
            color: 'negative',
            message: 'Une erreur est survenue',
            icon: 'error'
        })
    }
}
</script>

<style lang="scss" scoped>
.reset-password-container {
    width: 100%;
    max-width: 500px;
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
