<template>
    <q-page class="flex flex-center">
        <div class="register-container bg-secondary rounded-borders q-px-xl q-pb-sm">
            <h2 class="text-center text-h4 text-uppercase text-dark q-mb-lg">{{ $t('register') }}</h2>
            <q-form class="q-gutter-y-sm" @submit="onSubmit">
                <q-input
                    v-model="pseudo"
                    :label="$t('username')"
                    :rules="[val => !!val || $t('username_required')]"
                    bg-color="accent"
                    class="q-mb-md"
                    color="dark"
                    filled
                    lazy-rules
                />

                <q-input
                    v-model="email"
                    :label="$t('email')"
                    :rules="[val => !!val || $t('email_required'), val => /^[^@]+@[^@]+\.[^@]+$/.test(val) || $t('email_invalid')]"
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
                    :rules="[
                        val => !!val || $t('password_required'),
                        val => /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(val) || $t('password_rules')
                    ]"
                    :type="isPwdVisible ? 'text' : 'password'"
                    bg-color="accent"
                    class="q-mb-md"
                    color="dark"
                    filled
                    lazy-rules
                >
                    <template #append>
                        <q-icon :name="isPwdVisible ? 'visibility' : 'visibility_off'" class="cursor-pointer" @click="isPwdVisible = !isPwdVisible" />
                    </template>
                </q-input>

                <q-input
                    v-model="confirmPassword"
                    :label="$t('confirm_password')"
                    :rules="[
                        val => !!val || $t('confirm_password_required'),
                        val => val === password || $t('passwords_not_match'),
                        val => /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(val) || $t('password_rules')
                    ]"
                    :type="isConfirmPwdVisible ? 'text' : 'password'"
                    bg-color="accent"
                    class="q-mb-sm"
                    color="dark"
                    filled
                    lazy-rules
                >
                    <template #append>
                        <q-icon
                            :name="isConfirmPwdVisible ? 'visibility' : 'visibility_off'"
                            class="cursor-pointer"
                            @click="isConfirmPwdVisible = !isConfirmPwdVisible"
                        />
                    </template>
                </q-input>

                <q-btn :label="$t('register')" class="full-width" color="primary" size="lg" type="submit" />

                <div class="text-center q-mt-lg">
                    <p class="text-dark q-mb-xs">{{ $t('already_have_account') }}</p>
                    <q-btn :label="$t('login_now')" color="primary" flat to="/login" />
                </div>
            </q-form>
        </div>
    </q-page>
</template>

<script lang="js" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { notify } from 'src/utils/notify'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
                message: t('register_success'),
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
            message: t('error_occurred'),
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
