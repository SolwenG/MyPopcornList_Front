import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import pluginQuasar from '@quasar/app-vite/eslint'
import pluginSonarjs from 'eslint-plugin-sonarjs'
import prettierConfig from 'eslint-config-prettier'

export default [
    ...pluginQuasar.configs.recommended(),
    js.configs.recommended,

    // Vue.js linting configurations for JavaScript
    ...pluginVue.configs['flat/strongly-recommended'],

    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',

            globals: {
                ...globals.browser,
                ...globals.node, // SSR, Electron, config files
                process: 'readonly', // process.env.*
                ga: 'readonly', // Google Analytics
                cordova: 'readonly',
                Capacitor: 'readonly',
                chrome: 'readonly', // BEX related
                browser: 'readonly' // BEX related
            }
        },

        rules: {
            'prefer-promise-reject-errors': 'off',
            // allow debugger during development only
            'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
        }
    },

    pluginSonarjs.configs.recommended,

    prettierConfig
]
