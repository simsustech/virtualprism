<template>
  <q-page class="column col">
    <div class="column col no-wrap">
        <canvas class="column col" ref="canvas" touch-action="none"></canvas>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from '@vue/composition-api'

import '@babylonjs/loaders/glTF'
import {
  Engine
} from '@babylonjs/core'

import { createScene } from 'assets/scenes/shooter'

import { SceneConfig } from 'assets/scenes/default'
import { useStore } from 'src/store'

export default defineComponent({
  name: 'PageShooter',
  setup () {
    const store = useStore()
    const virtualPrismOptions = computed(() => store.virtualprism.state.value.virtualprism)

    const canvas = ref<HTMLCanvasElement>()
    let config: SceneConfig
    onMounted(async () => {
      if (canvas.value) {
        const engine = new Engine(canvas.value, true)

        // call the createScene function
        config = await createScene(canvas.value, engine, { virtualprism: virtualPrismOptions.value })

        // config.virtualprism = new VirtualPrism(config.scene, config.xr.baseExperience, virtualPrismOptions.value)
        if (config.virtualprism) {
          config.virtualprism.activate()
        }
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
