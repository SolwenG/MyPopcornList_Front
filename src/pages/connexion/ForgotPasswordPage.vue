<template>
    <q-page class="flex flex-center">
        <div class="forgot-password-container bg-secondary rounded-borders q-px-xl q-pb-sm">
            <h2 class="text-center text-h4 text-uppercase text-dark q-mb-xl">{{ $t('password_forgotten') }}</h2>
            <p class="text-dark text-center q-mb-lg">{{ $t('password_forgotten_instructions') }}</p>
            <q-form class="q-gutter-y-md" @submit="onSubmit">
                <q-input
                    v-model="email"
                    :rules="[val => !!val || $t('email_required'), val => /^[^@]+@[^@]+\.[^@]+$/.test(val) || $t('email_invalid')]"
                    bg-color="accent"
                    class="q-mb-lg"
                    color="dark"
                    filled
                    :label="$t('email')"
                    lazy-rules
                    type="email"
                />

                <q-btn class="full-width" color="primary" :label="$t('send_reset_link')" size="lg" type="submit" />

                <div class="text-center q-mt-lg">
                    <q-btn color="primary" flat :label="$t('back_to_login')" to="/login" />
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

const email = ref('')

const onSubmit = async () => {
    try {
        await authStore.forgotPassword(email.value)
        notify({
            color: 'positive',
            message: t('reset_email_sent'),
            icon: 'check'
        })
        router.push('/login')
    } catch (error) {
        console.error('Forgot password error:', error)
        notify({
            color: 'negative',
            message: t('error_occurred'),
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
