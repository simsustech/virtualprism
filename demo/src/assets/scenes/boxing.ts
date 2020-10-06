import {
  Engine, MeshBuilder, Mesh, Vector3, PhysicsImpostor, Scene, StandardMaterial, Color3, AmmoJSPlugin, WebXRControllerPhysics, WebXRDefaultExperience, WebXRState
} from '@babylonjs/core'

import { createDefault, SceneConfig, Controllers } from './default'
import { VirtualPrism } from 'virtualprism'
import * as Ammo from 'ammo.js'

export interface DynamicSceneOptions {
  key: 'value'
}

const localSceneOptions: {
  worldBox: {x: [number, number], y: [number, number], z: [number, number]},
  objectRangeX: [number, number],
  objectRangeY: [number, number],
  objectOffset: number,
  objectInterval: number,
  objectIntervalMultiplier: number,
} = {
  objectRangeX: [-0.4, 0.4],
  objectRangeY: [1, 1.80],
  objectOffset: 0,
  objectInterval: 800,
  objectIntervalMultiplier: 1,
  worldBox: {
    x: [-5, 5],
    y: [0, 5],
    z: [-1, 20]
  }
}

function isInsideWorldBox (mesh: Mesh) {
  if (
    mesh.position.x < localSceneOptions.worldBox.x[0] ||
      mesh.position.x > localSceneOptions.worldBox.x[1] ||
      mesh.position.y < localSceneOptions.worldBox.y[0] ||
      mesh.position.y > localSceneOptions.worldBox.y[1] ||
      mesh.position.z < localSceneOptions.worldBox.z[0] ||
      mesh.position.z > localSceneOptions.worldBox.z[1]
  ) {
    return false
  }
  return true
}

let counter = 0
function createObject (scene: Scene, xr: WebXRDefaultExperience, controllers: Controllers, virtualprism?: VirtualPrism) {
  // console.log(controllerImposters)

  if (xr.baseExperience.state === WebXRState.IN_XR) {
    const controllerPhysics = xr.baseExperience.featuresManager.getEnabledFeature(WebXRControllerPhysics.Name) as WebXRControllerPhysics
    const controllerImposters = xr.input.controllers.map((ctrl) => {
      return controllerPhysics.getImpostorForController(ctrl)
    })
    const radius = 0.09
    const volume = 4 / 3 * Math.PI * Math.pow(radius, 3)
    const sphere = MeshBuilder.CreateSphere('sphere', { diameter: radius * 2, segments: 32 }, scene)
    sphere.position = new Vector3(
      Math.random() * (localSceneOptions.objectRangeX[1] - localSceneOptions.objectRangeX[0]) + localSceneOptions.objectRangeX[0] + localSceneOptions.objectOffset,
      Math.random() * (localSceneOptions.objectRangeY[1] - localSceneOptions.objectRangeY[0]) + localSceneOptions.objectRangeY[0],
      15)

    sphere.physicsImpostor = new PhysicsImpostor(sphere, PhysicsImpostor.SphereImpostor, { mass: 10 * volume, friction: 0.1, restitution: 1.0 }, scene)
    const linearVelocity = new Vector3(0, 0, -1)
    sphere.physicsImpostor.setLinearVelocity(linearVelocity)
    if (virtualprism) {
      if (counter === 5) {
        virtualprism.attachMeshToCamera(sphere, virtualprism.suppressedEye)
      } else {
        virtualprism.setMeshVisibility(sphere, virtualprism.virtualprism.dominantEye, Math.random() * 0.3 + 0.1)
      }
    }

    // config.objects[sphere.id] = sphere
    scene.onBeforeRenderObservable.add(() => {
      if (!isInsideWorldBox(sphere)) {
        sphere.dispose()
      // delete config.objects[sphere.id]
      }
    })

    const collideFunction = function (collider: PhysicsImpostor, collideAgainst: PhysicsImpostor) {
      sphere.material = hitMaterial(scene, 0.7)
      // const controllerLinearVelocity = collideAgainst.getLinearVelocity()
      // if (controllerLinearVelocity) {
      //   sphere.material = hitMaterial(scene, Math.max(...[controllerLinearVelocity.x, controllerLinearVelocity.y, controllerLinearVelocity.z]) / 5)
      // }
    }
    if (controllerImposters[1]) {
      sphere.physicsImpostor.registerOnPhysicsCollide(controllerImposters as PhysicsImpostor[], collideFunction)
    }
    // sphere.physicsImpostor.registerOnPhysicsCollide(controllers.map((controller) => controller.physicsImpostor!), collideFunction)
    // sphere.physicsImpostor.registerOnPhysicsCollide(Object.values(controllers).map((controller: Mesh) => controller.physicsImpostor!), collideFunction)

    if (counter < 5) counter++
    else counter = 0
  }
}

const hitMaterial = (scene: Scene, fraction: number) => {
  const mat = new StandardMaterial('hitMaterial', scene)
  mat.alpha = 1
  if (fraction > 0.5) {
    mat.diffuseColor = new Color3(0.0, fraction, 0.0)
  } else {
    mat.diffuseColor = new Color3(fraction, 0.0, 0.0)
  }
  return mat
}

export async function createScene (canvas: HTMLCanvasElement, engine: Engine, sceneOptions?: DynamicSceneOptions): Promise<SceneConfig> {
  const AmmoPlugin = new AmmoJSPlugin(true, Ammo)
  const config = await createDefault(canvas, engine, {
    environment: {
      skyboxSize: 100
    },
    physics: {
      gravity: new Vector3(0, 0, 0),
      plugin: AmmoPlugin
    },
    xr: {
      teleport: false,
      controller: {
        model: 'glove',
        rotation: {
          x: 4 / 4 * Math.PI,
          y: 0,
          z: 0
        }
      }
    }
  })
  //

  // Dynamic content
  let objectInterval = setInterval(() => createObject(config.scene, config.xr, config.controllers, config.virtualprism), localSceneOptions.objectInterval)
  setInterval(function () {
    clearInterval(objectInterval)
    localSceneOptions.objectIntervalMultiplier = (Math.random() * 0.4) + 0.4
    objectInterval = setInterval(() => createObject(config.scene, config.xr, config.controllers, config.virtualprism), localSceneOptions.objectInterval * localSceneOptions.objectIntervalMultiplier)
    setTimeout(function () {
      clearInterval(objectInterval)
      objectInterval = setInterval(() => createObject(config.scene, config.xr, config.controllers, config.virtualprism), localSceneOptions.objectInterval)
    }, 5000)
  }, 30000)
  setInterval(() => {
    localSceneOptions.objectOffset = Math.random() * 1 - 0.5
  }, 10000)

  return config
}
