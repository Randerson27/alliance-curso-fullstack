import Vue from 'vue'
import VueRouter from 'vue-router'


import Movimento from '@/components/movimentos/Movimento'

Vue.use(VueRouter)

const routes = [{
        path: '/movimentos',
        name: 'Movimento',
        component: Movimento
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router