import {
  Engine, MeshBuilder, Scene, AbstractMesh, Mesh, Vector3
} from '@babylonjs/core'

import { createDefault, SceneConfig } from './default'
import { VirtualPrism, VirtualPrismOptions } from 'virtualprism'

export interface DynamicSceneOptions {
  virtualprism?: VirtualPrismOptions
}

interface BulletMesh extends Mesh {
  life: number,
  step: () => void
}
function fireBullet (scene: Scene, parent: AbstractMesh, intersections: Mesh[], virtualprism?: VirtualPrism) {
  if (parent) {
    const bullet = MeshBuilder.CreateSphere('bullet', { diameter: 0.1 }, scene) as BulletMesh
    const origin = parent.clone('origin', null)
    let direction: Vector3
    if (origin) {
      origin.setEnabled(false)
      origin.locallyTranslate(new Vector3(0, 0, 0.06))
      bullet.position = origin.getAbsolutePosition()

      const target = bullet.clone()
      target.position = new Vector3(0, 1, 0.06)
      target.parent = parent
      direction = bullet.getAbsolutePosition().subtract(target.getAbsolutePosition())
      origin.dispose()
      target.dispose()
    }
    // bullet.position = parent.getAbsolutePosition().clone()
    // bullet.position.x += 0.1

    bullet.life = 0
    const chance = Math.random()
    bullet.step = () => {
      bullet.life++
      bullet.translate(direction, 1)
      for (const mesh of intersections) {
        if (mesh.intersectsMesh(bullet)) {
          bullet.dispose()
          mesh.position = randomPosition()
          if (virtualprism) {
            virtualprism.detachMeshFromCamera(mesh)
            if (chance > 0.90) {
              virtualprism.attachMeshToCamera(mesh, 'left')
            } else if (chance < 0.10) {
              virtualprism.attachMeshToCamera(mesh, 'right')
            }
          }
        }
      }
      if (bullet.life > 100) {
        bullet.dispose()
      }
    }
    scene.onBeforeRenderObservable.add(bullet.step)
    return bullet
  }
}

function randomPosition () {
  return new Vector3(
    Math.random() * 10 - 5,
    Math.random() * 10,
    Math.random() * 20 + 10
  )
}

export async function createScene (canvas: HTMLCanvasElement, engine: Engine, sceneOptions?: DynamicSceneOptions): Promise<SceneConfig> {
  const config = await createDefault(canvas, engine, {
    environment: {
      skyboxSize: 100
    },
    virtualprism: sceneOptions?.virtualprism,
    xr: {
      teleport: false,
      controller: {
        model: 'pistol',
        rotation: {
          x: -1 / 8 * Math.PI,
          y: 0,
          z: 0
        }
      }
    }
  })

  const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 1 }, config.scene)
  sphere.position.y = 1
  sphere.position.z = 5

  const lastFired = {
    left: new Date().getTime(),
    right: new Date().getTime()
  }

  config.xr.input.onControllerAddedObservable.add((ctrl) => {
    ctrl.onMotionControllerInitObservable.add((motionController) => {
      const trigger = motionController.getComponent('xr-standard-trigger')

      const side = motionController.handness

      if (config.virtualprism && (side === 'left' || side === 'right')) {
        const mesh = config.controllers[side]
        if (mesh) {
          config.virtualprism.attachMeshToCamera(mesh, side)
        }
      }

      trigger.onButtonStateChangedObservable.add((component) => {
        const time = new Date().getTime()
        if (component.value > 0.8 && lastFired[side] < time - 200) {
          fireBullet(config.scene, config.controllers[side], [sphere], config.virtualprism)
          lastFired[side] = time
        }
      })
    })
  })
  return config
}
