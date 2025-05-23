<template>
    <q-page class="flex flex-center">
        <div class="reset-password-container bg-secondary rounded-borders q-px-xl q-pb-sm">
            <h2 class="text-center text-h4 text-uppercase text-dark q-mb-xl">{{ $t('reset_password_title') }}</h2>
            <q-form @submit="onSubmit" class="q-gutter-y-md">
                <q-input
                    v-model="password"
                    :rules="[
                        val => !!val || $t('password_required'),
                        val => /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(val) || $t('password_rules')
                    ]"
                    class="q-mb-md"
                    filled
                    bg-color="accent"
                    color="dark"
                    :label="$t('new_password')"
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
                        val => !!val || $t('confirm_password_required'),
                        val => val === password || $t('passwords_not_match'),
                        val => /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(val) || $t('password_rules')
                    ]"
                    class="q-mb-lg"
                    filled
                    bg-color="accent"
                    color="dark"
                    :label="$t('confirm_new_password')"
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

                <q-btn class="full-width" color="primary" :label="$t('reset')" size="lg" type="submit" />

                <div class="text-center q-mt-lg">
                    <q-btn flat color="primary" :label="$t('back_to_login')" to="/login" />
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
                message: t('reset_token_missing'),
                icon: 'error'
            })
            return
        }

        const success = await authStore.resetPassword(token, password.value)
        if (success) {
            notify({
                color: 'positive',
                message: t('reset_success'),
                icon: 'check'
            })
            router.push('/login')
        } else {
            notify({
                color: 'negative',
                message: t('reset_error'),
                icon: 'error'
            })
        }
    } catch (error) {
        console.error('Reset password error:', error)
        notify({
            color: 'negative',
            message: t('error_occurred'),
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
