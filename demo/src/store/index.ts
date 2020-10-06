import VueCompositionAPI from '@vue/composition-api'
import { VueConstructor } from 'vue'
import virtualprism from './virtualprism'

const Store = {
  virtualprism: virtualprism
}
export type StoreInterface = typeof Store

const useStore = () => Store

const createStore = ({ Vue }: { Vue: VueConstructor}) => {
  Vue.use(VueCompositionAPI)

  return useStore()
}

export { useStore }
export default createStore
