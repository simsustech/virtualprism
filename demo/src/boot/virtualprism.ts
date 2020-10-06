import { boot } from 'quasar/wrappers'
import { useStore } from 'src/store'

export default boot(() => {
  const store = useStore()
  store.virtualprism.actions.loadVirtualPrismFromLocalStorage()
})
