import Vue from 'vue'
import VueCompositionAPI, { reactive } from '@vue/composition-api'
Vue.use(VueCompositionAPI)
import { VirtualPrismOptions } from 'virtualprism'

export interface VirtualPrismStateInterface {
  virtualprism: VirtualPrismOptions
}
const state = reactive<VirtualPrismStateInterface>({
  virtualprism: {
    hor: 1,
    ver: 0,
    cyclo: 0,
    baseHor: 'in',
    baseVer: 'up',
    dominantEye: 'left',
    vergence: 0,
    blur: 0,
    contrast: 100,
    vignette: {
      color: '#ff00ffff',
      weight: 0
    }
  }
})

export { state }
