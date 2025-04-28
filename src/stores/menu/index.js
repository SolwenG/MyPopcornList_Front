import { defineStore } from 'pinia'
import state from './state.js'
import actions from './actions'

export const useMenuStore = defineStore('menu', {
    state,
    actions
})
