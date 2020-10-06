import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)

import { state } from './state'

import { LocalStorage } from 'quasar'
import { VirtualPrismOptions } from 'app/../dist/types'

const actions = {
  loadVirtualPrismFromLocalStorage: () => {
    const virtualprism = LocalStorage.getItem('virtualprism') as VirtualPrismOptions
    if (virtualprism) {
      state.virtualprism = { ...state.virtualprism, ...virtualprism }
    }
  }
}

export { actions }
export type VirtualPrismActionsInterface = typeof actions
