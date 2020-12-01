import { Scene, Mesh, WebXRExperienceHelper } from '@babylonjs/core';
export interface VirtualPrismOptions {
    hor: number;
    ver: number;
    cyclo: number;
    baseHor: 'in' | 'out';
    baseVer: 'up' | 'down';
    dominantEye: 'left' | 'right';
    vergence: number;
    blur: number;
    contrast: number;
    vignette: {
        color: string;
        weight: number;
    };
    patch: {
        active: boolean;
        offset: number;
    };
}
export declare class VirtualPrism {
    virtualprism: VirtualPrismOptions;
    private direction;
    private scene;
    private xrHelper;
    get directionHor(): number;
    get directionVer(): 1 | -1;
    get directionCyclo(): 1 | -1;
    get suppressedEye(): "left" | "right";
    constructor(scene: Scene, xrHelper: WebXRExperienceHelper, options: VirtualPrismOptions);
    set(options: VirtualPrismOptions): void;
    private virtualPrismObserver;
    private variablePrismStrengthTextblock;
    activate(): void;
    deactivate(): void;
    activatePrism(): void;
    setContrast(contrast: number): void;
    private contrastObserver;
    private contrastWatcherObserver;
    activateContrast(activate?: boolean): void;
    private vignetteObserver;
    private vignetteWatcherObserver;
    activateVignette(activate?: boolean): void;
    setBlur(blur: number): void;
    private blurObserver;
    private blurWatcherObserver;
    activateBlur(activate?: boolean): void;
    private activePatch;
    private patchObserver;
    private patchWatcherObserver;
    activatePatch(): void;
    /**
     * Mesh layerMask's last bit is set to 0001 (left) or 0010 (right)
     * @param mesh
     * @param cameraSide
     */
    attachMeshToCamera(mesh: Mesh, cameraSide: 'left' | 'right'): void;
    detachMeshFromCamera(mesh: Mesh): void;
    /**
     *
     * @param mesh
     * @param cameraSide
     * @param visibility
     */
    setMeshVisibility(mesh: Mesh, cameraSide: 'left' | 'right', visibility: number): void;
    deleteMeshVisibility(mesh: Mesh): void;
    createGui(): void;
    private createSlider;
    private createRadioOptions;
}
