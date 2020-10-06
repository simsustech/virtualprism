import {
  Engine, Scene, SceneLoader, UniversalCamera, HemisphericLight, Vector3,
  WebXRState, Mesh, WebXRControllerPhysics,
  Color3, WebXRDefaultExperience, WebXRDefaultExperienceOptions, EnvironmentHelper
} from '@babylonjs/core'
import type { IEnvironmentHelperOptions, IPhysicsEnginePlugin } from '@babylonjs/core'
import { VirtualPrism, VirtualPrismOptions } from 'virtualprism'

export interface SceneConfig {
  scene: Scene,
  environment: EnvironmentHelper | null
  xr: WebXRDefaultExperience,
  controllers: {'left': Mesh | null, 'right': Mesh | null},
  virtualprism?: VirtualPrism,
}

export interface DefaultSceneOptions {
  environment?: Partial<IEnvironmentHelperOptions>
  virtualprism?: VirtualPrismOptions
  xr?: {
    helperOptions?: Partial<WebXRDefaultExperienceOptions>
    teleport?: boolean
    controller?: {model: string, rotation: { x: number, y: number, z: number }}
  },
  physics?: {
    gravity: Vector3
    plugin: IPhysicsEnginePlugin
  }
}

export interface Controllers {
  'left': Mesh | null
  'right': Mesh | null
}

export async function createDefault (canvas: HTMLCanvasElement, engine: Engine, options: DefaultSceneOptions): Promise<SceneConfig> {
  const scene = new Scene(engine)

  if (options?.physics?.gravity || options?.physics?.plugin) {
    if (!options.physics.gravity || !options.physics.plugin) {
      throw new Error('Please provide a gravity vector and a physics plugin')
    }
    scene.enablePhysics(options.physics.gravity, options.physics.plugin)
  }

  const controllers: Controllers = {
    left: null,
    right: null
  }

  if (options?.xr?.controller?.model) {
    const sides: ['left', 'right'] = ['left', 'right']
    for (const side of sides) {
    // SceneLoader.ImportMesh('', '', `models/glove${side}.babylon`, scene, function (newMeshes, particlesystems) {
      await SceneLoader.ImportMeshAsync(null, '', `models/${options.xr.controller.model}${side}.babylon`, scene).then((result) => {
        controllers[side] = Mesh.MergeMeshes(result.meshes as Mesh[]) as Mesh
        if (controllers[side]) {
          controllers[side]!.setEnabled(false)
          controllers[side]!.position = new Vector3(0.0, 0.0, 0.0)
          // Hold controller upside down
          // controllers[side]!.rotation = new Vector3(-1 / 4 * Math.PI, 0, 0)
          const rotation = new Vector3(
            options.xr?.controller?.rotation.x || 0,
            options.xr?.controller?.rotation.y || 0,
            options.xr?.controller?.rotation.z || 0
          )
          controllers[side]!.rotation = rotation

          // controllers[side]!.bakeCurrentTransformIntoVertices()
          // if (options?.physics?.gravity && options?.physics?.plugin) {
          //   controllers[side]!.physicsImpostor = new PhysicsImpostor(controllers[side]!, PhysicsImpostor.MeshImpostor, { mass: 0.0, restitution: 1.0 }, scene)
          // }
        }
      })
    }
  }

  const camera = new UniversalCamera('UniversalCamera', new Vector3(0, 1.5, 0), scene)
  camera.setTarget(new Vector3(0, 1.5, 1))
  if (canvas) {
    camera.attachControl(canvas, true)
  }
  const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)
  light.intensity = 0.7

  const environment = scene.createDefaultEnvironment(options.environment)
  if (environment) {
    environment.setMainColor(Color3.FromHexString('#74b9ff'))
  }

  const xr = await scene.createDefaultXRExperienceAsync({
    floorMeshes: environment?.ground ? [environment.ground] : undefined,
    disableTeleportation: options.xr?.teleport,
    inputOptions: {
      doNotLoadControllerMeshes: true
    },
    ...options.xr
  })

  if (!options.xr?.teleport) {
    xr.teleportation.detach()
    xr.pointerSelection.detach()
  }

  if (options?.physics?.gravity && options?.physics?.plugin) {
    console.log('Enable WebXRControllerPhysics')
    xr.baseExperience.featuresManager.enableFeature(WebXRControllerPhysics.Name, 'latest', { xrInput: xr.input })
  }

  xr.baseExperience.onStateChangedObservable.add((state) => {
    if (state === WebXRState.IN_XR) {
      xr.baseExperience.camera.setTransformationFromNonVRCamera(camera, true)
    }
  })

  xr.input.onControllerAddedObservable.add((ctrl) => {
    ctrl.onMotionControllerInitObservable.add((motionController) => {
      const side = motionController.handness
      if (side === 'left' || side === 'right') {
        if (controllers[side] && ctrl.grip) {
          controllers[side]!.parent = ctrl.grip
          // ctrl.grip = controllers[side]!
          controllers[side]!.setEnabled(true)
        }
      }
    })
  })

  let virtualprism
  if (options.virtualprism) {
    virtualprism = new VirtualPrism(scene, xr.baseExperience, options.virtualprism)
  }

  // xr.input.onControllerRemovedObservable.add((ctrl) => {
  //   const side = ctrl.motionController?.handness
  //   if (side === 'left' || side === 'right') {
  //     if (controllers[side]) {
  //         controllers[side]!.parent = null
  //     }
  //   }
  // })

  return { scene, virtualprism, environment, xr, controllers }
}
