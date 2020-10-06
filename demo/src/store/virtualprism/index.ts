import Vue from 'vue'
import VueCompositionAPI, { computed } from '@vue/composition-api'
Vue.use(VueCompositionAPI)

import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'

export default {
  state: computed(() => state),
  mutations: mutations,
  actions: actions,
  getters: getters
}
