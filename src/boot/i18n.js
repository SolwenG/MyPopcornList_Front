import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'

import messages from 'src/i18n/index.js'

export default defineBoot(({ app }) => {
    const i18n = createI18n({
        locale: 'fr',
        legacy: false,
        messages
    })

    app.use(i18n)
})
