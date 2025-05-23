import { createPinia } from 'pinia'
import { defineBoot } from '@quasar/app-vite/wrappers'

export default defineBoot(({ app }) => {
    app.use(createPinia())
})
