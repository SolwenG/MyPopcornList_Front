const routes = [
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            {
                path: '',
                name: 'HomePage',
                component: () => import('pages/HomePage.vue')
            },
            {
                path: '/login',
                name: 'LoginPage',
                component: () => import('pages/connexion/LoginPage.vue')
            },
            {
                path: '/register',
                name: 'RegisterPage',
                component: () => import('pages/connexion/RegisterPage.vue')
            },
            {
                path: '/forgot-password',
                name: 'ForgotPasswordPage',
                component: () => import('pages/connexion/ForgotPasswordPage.vue')
            },
            {
                path: '/media/:type/:id',
                name: 'MediaDetails',
                component: () => import('pages/MediaDetailsPage.vue'),
                props: true
            },
            {
                path: '/top/:type?',
                name: 'Top',
                component: () => import('pages/TopPage.vue'),
                props: true
            },
            {
                path: '/search',
                name: 'SearchResults',
                component: () => import('pages/SearchResultsPage.vue')
            },
            {
                path: '/profile',
                name: 'Profile',
                component: () => import('pages/ProfilePage.vue')
            },
            {
                path: '/settings',
                name: 'SettingsPage',
                component: () => import('pages/SettingsPage.vue')
            }
        ]
    },

    {
        path: '/:catchAll(.*)*',
        name: 'ErrorPage',
        component: () => import('pages/ErrorPage.vue')
    }
]

export default routes
