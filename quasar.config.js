import { defineConfig } from '#q-app/wrappers'
import { fileURLToPath } from 'node:url'

export default defineConfig(ctx => {
    return {
        boot: ['i18n', 'axios', 'pinia'],
        css: ['app.scss'],
        extras: [
            'fontawesome-v6',
            // 'eva-icons',
            // 'themify',
            // 'line-awesome',
            // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!
            'roboto-font',
            'material-icons'
        ],
        build: {
            target: {
                browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
                node: 'node22'
            },
            vueRouterMode: 'hash', // available values: 'hash', 'history'
            vitePlugins: [
                [
                    '@intlify/unplugin-vue-i18n/vite',
                    {
                        ssr: ctx.modeName === 'ssr',
                        include: [fileURLToPath(new URL('./src/i18n', import.meta.url))]
                    }
                ],
                [
                    'vite-plugin-checker',
                    {
                        eslint: {
                            lintCommand: 'eslint -c ./eslint.config.js "./src*/**/*.{js,mjs,cjs,vue}"',
                            useFlatConfig: true
                        }
                    },
                    { server: false }
                ]
            ]
        },
        devServer: {
            open: true
        },
        framework: {
            config: {},
            iconSet: 'material-icons', // Quasar icon set
            lang: 'fr', // Quasar language pack
            plugins: ['Dialog', 'Notify', 'Loading', 'LocalStorage']
        },
        animations: [],
        ssr: {
            prodPort: 8080,
            middlewares: ['render'],
            pwa: false
        },
        pwa: {
            workboxMode: 'GenerateSW'
        },
        cordova: {}
    }
})
