import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)

import { state } from './state'

import { LocalStorage } from 'quasar'

const mutations = {
  setValue: (field: 'hor' | 'ver' | 'cyclo' | 'vergence' | 'blur' | 'contrast', value: number) => {
    state.virtualprism[field] = value
    LocalStorage.set('virtualprism', state.virtualprism)
  },
  setDominantEye: (dominantEye: 'left' | 'right') => {
    state.virtualprism.dominantEye = dominantEye
    LocalStorage.set('virtualprism', state.virtualprism)
  },
  setBaseHorizontal: (base: 'in' | 'out') => {
    state.virtualprism.baseHor = base
    LocalStorage.set('virtualprism', state.virtualprism)
  },
  setBaseVertical: (base: 'up' | 'down') => {
    state.virtualprism.baseVer = base
    LocalStorage.set('virtualprism', state.virtualprism)
  },
  setVignetteWeight: (weight: number) => {
    state.virtualprism.vignette.weight = weight
  },
  setVignetteColor: (color: string) => {
    state.virtualprism.vignette.color = color
  }
}

export { mutations }
export type VirtualPrismMutationsInterface = typeof mutations
