<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Virtual Prism
        </q-toolbar-title>

        <q-btn
          flat
          dense
          round
          icon="settings"
          aria-label="Settings"
          @click="rightDrawerOpen = !rightDrawerOpen"
        />
      </q-toolbar>
    </q-header>

    <q-footer>
      <q-toolbar>
        <q-space />
        Powered by <a target="_blank" href="https://quasar.dev">Quasar</a> and <a target="_blank" href="https://www.babylonjs.com">Babylon.js</a>.
        <q-space />
      </q-toolbar>
    </q-footer>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Navigation
        </q-item-label>
        <q-item to="/" exact>
          <q-item-section>
            <q-item-label>
              Home
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/boxing" exact>
          <q-item-section>
            <q-item-label>
              Boxing
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/shooter" exact>
          <q-item-section>
            <q-item-label>
              Shooter
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-drawer
      side="right"
      v-model="rightDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Configuration
        </q-item-label>
        <q-item>
          <q-item-section side>
            <!-- <q-icon color="teal" name="volume_down" /> -->
          </q-item-section>
          <q-item-section>
            <q-item-label overline>Horizontal</q-item-label>
            <q-slider
              :value="virtualPrismOptions.hor"
              @change="setVirtualPrismValue('hor', $event)"
              :min="0"
              :max="30"
              label
              color="red"
            />
          </q-item-section>
          <q-item-section side>
            {{ `${virtualPrismOptions.hor} dpt`}}
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section side>
            <!-- <q-icon color="teal" name="volume_down" /> -->
          </q-item-section>
          <q-item-section>
            <q-item-label overline>Vertical</q-item-label>
            <q-slider
              :value="virtualPrismOptions.ver"
              @change="setVirtualPrismValue('ver', $event)"
              :min="0"
              :max="5"
              label
              color="green"
            />
          </q-item-section>
          <q-item-section side>
            {{ `${virtualPrismOptions.ver} dpt`}}
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section side>
            <!-- <q-icon color="teal" name="volume_down" /> -->
          </q-item-section>
          <q-item-section>
            <q-item-label overline>Cyclo</q-item-label>
            <q-slider
              :value="virtualPrismOptions.cyclo"
              @change="setVirtualPrismValue('cyclo', $event)"
              :min="-10"
              :max="10"
              label
              color="blue"
            />
          </q-item-section>
          <q-item-section side>
            {{ `${virtualPrismOptions.cyclo} °`}}
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section side>
            <!-- <q-icon color="teal" name="volume_down" /> -->
          </q-item-section>
          <q-item-section>
            <q-item-label overline>Vergence</q-item-label>
            <q-slider
              :value="virtualPrismOptions.vergence"
              @change="setVirtualPrismValue('vergence', $event)"
              :min="0"
              :max="10"
              label
              color="purple"
            />
            <q-item-label caption>Variable prism strength</q-item-label>

          </q-item-section>
          <q-item-section side>
            {{ `${virtualPrismOptions.vergence} dpt`}}
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section side>
            <!-- <q-icon color="teal" name="volume_down" /> -->
          </q-item-section>
          <q-item-section>
            <q-item-label overline>Contrast</q-item-label>
            <q-slider
              :value="virtualPrismOptions.contrast"
              @change="setVirtualPrismValue('contrast', $event)"
              :min="0"
              :max="100"
              label
              color="grey"
            />
            <q-item-label caption>On dominant eye</q-item-label>

          </q-item-section>
          <q-item-section side>
            {{ `${virtualPrismOptions.contrast} %`}}
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section side>
            <!-- <q-icon color="teal" name="volume_down" /> -->
          </q-item-section>
          <q-item-section>
            <q-item-label overline>Blur</q-item-label>
            <q-slider
              :value="virtualPrismOptions.blur"
              @change="setVirtualPrismValue('blur', $event)"
              :min="0"
              :max="100"
              label
              color="grey"
            />
            <q-item-label caption>On dominant eye</q-item-label>

          </q-item-section>
          <q-item-section side>
            {{ `${virtualPrismOptions.blur} %`}}
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section side>
            <q-btn :style="{ color: virtualPrismOptions.vignette.color }" icon="colorize">
              <q-menu>
                <q-color :value="virtualPrismOptions.vignette.color" @change="setVirtualPrismVignetteColor($event)" />
              </q-menu>
            </q-btn>
          </q-item-section>
          <q-item-section>
            <q-item-label overline>Vignette</q-item-label>
            <q-slider
              :value="virtualPrismOptions.vignette.weight"
              @change="setVirtualPrismVignetteWeight($event)"
              :min="0"
              :max="100"
              label
              color="grey"
            />
            <q-item-label caption>On dominant eye</q-item-label>

          </q-item-section>
          <q-item-section side>
            {{ `${virtualPrismOptions.vignette.weight} %`}}
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section side>
            <!-- <q-icon color="teal" name="volume_down" /> -->
          </q-item-section>
          <q-item-section>
            <q-item-label overline>Base direction horizontal</q-item-label>
            <q-btn-toggle
              :value="virtualPrismOptions.baseHor"
              spread
              @input="setVirtualPrismBaseHorizontal($event)"
              :options="[
                { label: 'In', value: 'in' },
                { label: 'Out', value: 'out'}
              ]"
            />

          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section side>
            <!-- <q-icon color="teal" name="volume_down" /> -->
          </q-item-section>
          <q-item-section>
            <q-item-label overline>Base direction vertical</q-item-label>
            <q-btn-toggle
              :value="virtualPrismOptions.baseVer"
              spread
              @input="setVirtualPrismBaseVertical($event)"
              :options="[
                { label: 'Up', value: 'up' },
                { label: 'Down', value: 'down'}
              ]"
            />

          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section side>
            <!-- <q-icon color="teal" name="volume_down" /> -->
          </q-item-section>
          <q-item-section>
            <q-item-label overline>Dominant eye</q-item-label>
            <q-btn-toggle
              :value="virtualPrismOptions.dominantEye"
              spread
              @input="setVirtualPrismDominantEye($event)"
              :options="[
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right'}
              ]"
            />

          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">

import { defineComponent, ref, computed } from '@vue/composition-api'
import { useStore } from 'src/store'

export default defineComponent({
  name: 'MainLayout',
  setup () {
    const leftDrawerOpen = ref(false)
    const rightDrawerOpen = ref(false)
    const store = useStore()
    const virtualPrismOptions = computed(() => store.virtualprism.state.value.virtualprism)

    const setVirtualPrismValue = store.virtualprism.mutations.setValue
    const setVirtualPrismDominantEye = store.virtualprism.mutations.setDominantEye
    const setVirtualPrismBaseHorizontal = store.virtualprism.mutations.setBaseHorizontal
    const setVirtualPrismBaseVertical = store.virtualprism.mutations.setBaseVertical
    const setVirtualPrismVignetteWeight = store.virtualprism.mutations.setVignetteWeight
    const setVirtualPrismVignetteColor = store.virtualprism.mutations.setVignetteColor

    return {
      leftDrawerOpen,
      rightDrawerOpen,
      virtualPrismOptions,
      setVirtualPrismValue,
      setVirtualPrismDominantEye,
      setVirtualPrismBaseHorizontal,
      setVirtualPrismBaseVertical,
      setVirtualPrismVignetteWeight,
      setVirtualPrismVignetteColor
    }
  }
})
</script>
