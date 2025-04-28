<template>
    <q-page class="flex flex-center">
        <div class="register-container bg-secondary rounded-borders q-px-xl q-pb-sm">
            <h2 class="text-center text-h4 text-dark q-mb-xl">INSCRIPTION</h2>
            <q-form @submit="onSubmit" class="q-gutter-y-md">
                <q-input
                    v-model="pseudo"
                    :rules="[val => !!val || 'Pseudo requis']"
                    class="q-mb-md"
                    filled
                    bg-color="accent"
                    color="dark"
                    label="Pseudo"
                    lazy-rules
                />

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
                    :rules="[val => !!val || 'Mot de passe requis', val => val.length >= 8 || 'Le mot de passe doit contenir au moins 8 caractères']"
                    class="q-mb-md"
                    filled
                    bg-color="accent"
                    color="dark"
                    label="Mot De Passe"
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
                    label="Confirmer le mot de passe"
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

                <q-btn class="full-width" color="primary" label="S'inscrire" size="lg" type="submit" />

                <div class="text-center q-mt-lg">
                    <p class="text-dark q-mb-sm">Vous avez déjà un compte ?</p>
                    <q-btn flat color="primary" label="Connectez-vous !" to="/login" />
                </div>
            </q-form>
        </div>
    </q-page>
</template>

<script setup lang="js">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { notify } from 'src/utils/notify'

const authStore = useAuthStore()
const router = useRouter()

const pseudo = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isPwdVisible = ref(false)
const isConfirmPwdVisible = ref(false)

const onSubmit = async () => {
    try {
        const success = await authStore.register(email.value, password.value, pseudo.value)
        if (success) {
            notify({
                color: 'positive',
                message: 'Inscription réussie !',
                icon: 'check'
            })
            router.push('/')
        } else {
            notify({
                color: 'warning',
                message: "Erreur lors de l'inscription",
                icon: 'warning'
            })
        }
    } catch (error) {
        console.error('Register error:', error)
        notify({
            color: 'negative',
            message: 'Une erreur est survenue',
            icon: 'error'
        })
    }
}
</script>

<style lang="scss" scoped>
.register-container {
    width: 100%;
    max-width: 500px;
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
