<template>
  <q-page class="column col">
    <div class="column col no-wrap">
        <canvas class="column col" ref="canvas" touch-action="none"></canvas>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from '@vue/composition-api'

import '@babylonjs/loaders/glTF'
import {
  Engine
} from '@babylonjs/core'
import { VirtualPrism } from 'virtualprism'

import { createScene } from 'assets/scenes/boxing'

import { SceneConfig } from 'assets/scenes/default'

import { useStore } from 'src/store'

export default defineComponent({
  name: 'PageBoxing',
  setup () {
    const store = useStore()
    const virtualPrismOptions = computed(() => store.virtualprism.state.value.virtualprism)

    const canvas = ref<HTMLCanvasElement>()

    // const virtualPrismOptions: VirtualPrismOptions = {
    //   hor: 2,
    //   ver: 0,
    //   cyclo: 0,
    //   base: 'in',
    //   dominantEye: 'left',
    //   vergence: 3,
    //   blur: null,
    //   contrast: null
    // }
    let config: SceneConfig
    watch(virtualPrismOptions, () => {
      if (config.virtualprism) {
        config.virtualprism.set(virtualPrismOptions.value)
      }
    }, { deep: true })
    onMounted(async () => {
      if (canvas.value) {
        const engine = new Engine(canvas.value, true)

        // call the createScene function
        config = await createScene(canvas.value, engine)

        config.virtualprism = new VirtualPrism(config.scene, config.xr.baseExperience, virtualPrismOptions.value)
        config.virtualprism.activate()
        // config.virtualprism.activateContrast()

        // run the render loop
        engine.runRenderLoop(function () {
          config.scene.render()
        })

        // the canvas/window resize event handler
        window.addEventListener('resize', function () {
          engine.resize()
        })
      }
    })

    return {
      canvas
    }
  }
})
</script>
