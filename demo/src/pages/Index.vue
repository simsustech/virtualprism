<template>
  <q-page padding class="column col">
    <div class="column col no-wrap justify-between">
      <div class="col">
        <div class="row justify-center">
          <q-img src="~assets/logo.svg" style="max-width: 300px" />
        </div>
        <div class="row justify-center">
          <h4 class="text-italic">Visual field adjustment tools for WebXR</h4>
        </div>
      </div>
      <div class="col column justify-end">
        <h6 class="row justify-center">Only to be used under supervision of a medical professional.</h6>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

// import { useStore } from 'src/store'

export default defineComponent({
  name: 'PageIndex',
  setup () {
    // const store = useStore()

    return {

    }
  }
})
</script>
