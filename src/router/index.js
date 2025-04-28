import { defineRouter } from '#q-app/wrappers'
import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import routes from './routes'

export default defineRouter(function () {
    let createHistory

    if (process.env.SERVER) {
        createHistory = createMemoryHistory
    } else if (process.env.VUE_ROUTER_MODE === 'history') {
        createHistory = createWebHistory
    } else {
        createHistory = createWebHashHistory
    }

    return createRouter({
        scrollBehavior: () => ({ left: 0, top: 0 }),
        routes,

        // Leave this as is and make changes in quasar.conf.js instead!
        // quasar.conf.js -> build -> vueRouterMode
        // quasar.conf.js -> build -> publicPath
        history: createHistory(process.env.VUE_ROUTER_BASE)
    })
})
