/**
 * Copyright (c) 2020 by Stefan van Herwijnen
 * Virtual Prism * https://virtualprism.tech
 * "VISUAL FIELD ADJUSTMENT TOOLS FOR WEBXR"
 *
 * All Rights Reserved
 * ATTRIBUTION ASSURANCE LICENSE (adapted from the original BSD license)
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the conditions below are met.
 * These conditions require a modest attribution to VirtualPrism.tech (the
 * "Author"), who hopes that its promotional value may help justify the
 * thousands of dollars in otherwise billable time invested in writing
 * this and other freely available, open-source software.
 *
 * 1. Redistributions of source code, in whole or part and with or without
 * modification (the "Code"), must prominently display this GPG-signed
 * text in verifiable form.
 * 2. Redistributions of the Code in binary form must be accompanied by
 * this GPG-signed text in any documentation and, each time the resulting
 * executable program or a program dependent thereon is launched, a
 * prominent display (e.g., splash screen or banner text) of the Author's
 * attribution information, which includes:
 * (a) Name ("Stefan van Herwijnen"),
 * (b) Professional identification ("Virtual Prism"), and
 * (c) URL ("https://virtualprism.tech").
 * 3. Neither the name nor any trademark of the Author may be used to
 * endorse or promote products derived from this software without specific
 * prior written permission.
 * 4. Users are entirely responsible, to the exclusion of the Author and
 * any other persons, for compliance with (1) regulations set by owners or
 * administrators of employed equipment, (2) licensing terms of any other
 * software, and (3) local regulations regarding use, including those
 * regarding import, export, and use of encryption software.
 *
 * THIS FREE SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
 * EVENT SHALL THE AUTHOR OR ANY CONTRIBUTOR BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * EFFECTS OF UNAUTHORIZED OR MALICIOUS NETWORK ACCESS;
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN
 * IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { WebXRState, Quaternion, ImageProcessingConfiguration, ImageProcessingPostProcess, Color4, BlurPostProcess, Vector2 } from '@babylonjs/core';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { TextBlock, Slider, RadioButton, Control, AdvancedDynamicTexture, Rectangle, StackPanel, Checkbox } from '@babylonjs/gui';

class VirtualPrism {
    constructor(scene, xrHelper, options) {
        this.virtualprism = {
            hor: 0,
            ver: 0,
            cyclo: 0,
            baseHor: 'in',
            baseVer: 'up',
            dominantEye: 'left',
            vergence: 0,
            blur: 0,
            contrast: 100,
            vignette: {
                color: '#00000000',
                weight: 0
            },
            patch: {
                active: false,
                offset: 0
            }
        };
        this.variablePrismStrengthTextblock = { textblock: undefined, plane: undefined, texture: undefined };
        this.createSlider = (min, max, step, value, headerText, panel, onChange = undefined) => {
            var header = new TextBlock();
            var slider = new Slider();
            header.text = headerText(this.virtualprism[value]);
            header.height = "20px";
            header.color = "white";
            panel.addControl(header);
            slider.minimum = min;
            slider.maximum = max;
            slider.step = step;
            slider.value = this.virtualprism[value] || 0;
            slider.height = "20px";
            slider.width = "200px";
            slider.onValueChangedObservable.add((val) => {
                header.text = headerText(this.virtualprism[value]);
                this.virtualprism[value] = val;
                if (onChange) {
                    onChange(val);
                }
            });
            panel.addControl(slider);
        };
        this.createRadioOptions = function (value, options, headerText, group, panel) {
            let header = new TextBlock();
            header.text = headerText;
            header.height = "20px";
            header.color = "white";
            panel.addControl(header);
            for (let [key, val] of Object.entries(options)) {
                let button = new RadioButton();
                button.group = group;
                button.width = "20px";
                button.height = "20px";
                button.color = "white";
                button.background = "green";
                button.isChecked = this.virtualprism[value] === val;
                button.onIsCheckedChangedObservable.add((state) => {
                    if (state) {
                        this.virtualprism[value] = val;
                    }
                });
                let optionHeader = Control.AddHeader(button, key, "100px", { isHorizontal: true, controlFirst: true });
                optionHeader.height = "20px";
                panel.addControl(optionHeader);
            }
        };
        this.scene = scene;
        this.xrHelper = xrHelper;
        this.virtualprism = {
            hor: options.hor,
            ver: options.ver,
            cyclo: options.cyclo,
            baseHor: options.baseHor,
            baseVer: options.baseVer,
            dominantEye: options.dominantEye,
            vergence: options.vergence,
            blur: options.blur,
            contrast: options.contrast,
            vignette: options.vignette,
            patch: options.patch
        };
        this.direction = (options.dominantEye === 'right' ? 1 : -1) * (options.baseHor === 'in' ? 1 : -1);
        // Set layer masks for attaching meshes to camera, left last bit: 1101, right last bit: 1110
        this.xrHelper.onStateChangedObservable.add((state) => {
            if (state === WebXRState.IN_XR && this.xrHelper.camera.leftCamera && this.xrHelper.camera.rightCamera) {
                this.xrHelper.camera.leftCamera.layerMask = 0x0FFFFFFD;
                this.xrHelper.camera.rightCamera.layerMask = 0x0FFFFFFE;
            }
        });
    }
    get directionHor() {
        return (this.virtualprism.dominantEye === 'right' ? 1 : -1) * (this.virtualprism.baseHor === 'in' ? 1 : -1);
    }
    get directionVer() {
        return (this.virtualprism.baseVer === 'up' ? -1 : 1);
    }
    get directionCyclo() {
        return (this.virtualprism.dominantEye === 'right' ? 1 : -1);
    }
    get suppressedEye() {
        return this.virtualprism.dominantEye === 'left' ? 'right' : 'left';
    }
    set(options) {
        this.virtualprism = {
            hor: options.hor,
            ver: options.ver,
            cyclo: options.cyclo,
            baseHor: options.baseHor,
            baseVer: options.baseVer,
            dominantEye: options.dominantEye,
            vergence: options.vergence,
            blur: options.blur,
            contrast: options.contrast,
            vignette: options.vignette,
            patch: options.patch
        };
        this.direction = (options.dominantEye === 'right' ? 1 : -1) * (options.baseHor === 'in' ? 1 : -1);
    }
    activate() {
        this.activatePrism();
        this.activateBlur();
        this.activateContrast();
        this.activateVignette();
        if (this.virtualprism.patch.active) {
            this.activatePatch();
        }
    }
    deactivate() {
        if (this.virtualPrismObserver) {
            this.scene.onBeforeRenderObservable.remove(this.virtualPrismObserver);
        }
        if (this.contrastObserver) {
            this.xrHelper.onStateChangedObservable.remove(this.contrastObserver);
        }
        if (this.blurObserver) {
            this.xrHelper.onStateChangedObservable.remove(this.blurObserver);
        }
    }
    activatePrism() {
        let x, y, z;
        let vergenceX;
        let diffX, diffZ;
        diffX = 0.1, diffZ = 0.1;
        x = this.virtualprism.hor;
        y = this.virtualprism.ver;
        z = this.virtualprism.cyclo;
        vergenceX = this.virtualprism.hor;
        setInterval(() => {
            if (vergenceX < (this.virtualprism.hor - this.virtualprism.vergence))
                diffX = 0.1;
            if (vergenceX >= this.virtualprism.hor)
                diffX = -0.1;
            vergenceX = vergenceX + diffX;
        }, 1000);
        this.virtualPrismObserver = this.scene.onBeforeRenderObservable.add(() => {
            if (this.virtualprism.vergence && !this.variablePrismStrengthTextblock.textblock) {
                this.variablePrismStrengthTextblock.textblock = new TextBlock('overlay', `hor: ${this.virtualprism.hor}`);
                this.variablePrismStrengthTextblock.textblock.fontSize = 66;
                this.variablePrismStrengthTextblock.textblock.top = '10%';
                this.variablePrismStrengthTextblock.plane = MeshBuilder.CreatePlane('hud', { width: 2, height: 2 }, this.scene);
                this.variablePrismStrengthTextblock.plane.rotation.x = Math.PI * 0.5;
                this.variablePrismStrengthTextblock.plane.position.y = 0.5;
                this.variablePrismStrengthTextblock.plane.position.z = 2;
                this.variablePrismStrengthTextblock.plane.isPickable = false;
                this.variablePrismStrengthTextblock.texture = AdvancedDynamicTexture.CreateForMesh(this.variablePrismStrengthTextblock.plane, 1024, 1024, false);
                this.variablePrismStrengthTextblock.texture.addControl(this.variablePrismStrengthTextblock.textblock);
            }
            else if (!this.virtualprism.vergence && this.variablePrismStrengthTextblock.textblock) {
                this.variablePrismStrengthTextblock.textblock.dispose();
                this.variablePrismStrengthTextblock.plane.dispose();
                this.variablePrismStrengthTextblock.texture.dispose();
                this.variablePrismStrengthTextblock = { textblock: undefined, plane: undefined, texture: undefined };
            }
            if (this.xrHelper.state === WebXRState.IN_XR) {
                if (this.xrHelper.camera.leftCamera && this.xrHelper.camera.rightCamera) {
                    x = this.virtualprism.vergence ? vergenceX : this.virtualprism.hor;
                    y = this.virtualprism.ver;
                    z = this.virtualprism.cyclo;
                    this.direction = (this.virtualprism.dominantEye === 'right' ? 1 : -1) * (this.virtualprism.baseHor === 'in' ? 1 : -1);
                    let cameraToRotate = this.virtualprism.dominantEye === 'left' ? this.xrHelper.camera.rightCamera : this.xrHelper.camera.leftCamera;
                    let virtualPrismQuaternion = Quaternion.RotationYawPitchRoll(Math.atan(this.directionHor * x / 100), Math.atan(this.directionVer * y / 100), this.directionCyclo * z * Math.PI / 180);
                    cameraToRotate.rotationQuaternion.multiplyInPlace(virtualPrismQuaternion);
                }
            }
            if (this.virtualprism.vergence && this.variablePrismStrengthTextblock) {
                this.variablePrismStrengthTextblock.textblock.text = `hor: ${x.toFixed(1)}, ver: ${y.toFixed(1)}, cyclo: ${z.toFixed(1)}`;
            }
        });
    }
    setContrast(contrast) {
        this.virtualprism.contrast = contrast;
    }
    activateContrast(activate = true) {
        var postProcess;
        this.contrastObserver = this.xrHelper.onStateChangedObservable.add((state) => {
            if (state === WebXRState.IN_XR && this.virtualprism.contrast) {
                if (postProcess && this.virtualprism.contrast === 100) {
                    postProcess.dispose();
                }
                else if (this.virtualprism.contrast !== 100) {
                    const cameraToProcess = this.virtualprism.dominantEye === 'left' ? this.xrHelper.camera.leftCamera : this.xrHelper.camera.rightCamera;
                    const config = new ImageProcessingConfiguration();
                    postProcess = new ImageProcessingPostProcess("Contrast", 1.0, cameraToProcess, undefined, undefined, undefined, undefined, config);
                    postProcess.contrast = this.virtualprism.contrast / 100;
                }
                this.contrastWatcherObserver = this.scene.onBeforeRenderObservable.add((scene, state) => {
                    if (postProcess && postProcess.contrast !== this.virtualprism.contrast / 100) {
                        postProcess.contrast = this.virtualprism.contrast / 100;
                    }
                });
            }
            else if (state === WebXRState.NOT_IN_XR) {
                this.scene.onBeforeRenderObservable.remove(this.contrastWatcherObserver);
                if (postProcess) {
                    postProcess.dispose();
                }
            }
        }, 1);
    }
    activateVignette(activate = true) {
        var postProcess;
        const vignetteWeight = (weight) => {
            return 20 * (weight / 100);
        };
        this.vignetteObserver = this.xrHelper.onStateChangedObservable.add((state) => {
            var _a;
            if (state === WebXRState.IN_XR && this.virtualprism.contrast) {
                if (postProcess && ((_a = this.virtualprism.vignette) === null || _a === void 0 ? void 0 : _a.weight) === 0) {
                    postProcess.dispose();
                }
                if (this.virtualprism.vignette.weight && this.virtualprism.vignette.color) {
                    const cameraToProcess = this.virtualprism.dominantEye === 'left' ? this.xrHelper.camera.leftCamera : this.xrHelper.camera.rightCamera;
                    const config = new ImageProcessingConfiguration();
                    postProcess = new ImageProcessingPostProcess("Contrast", 1.0, cameraToProcess, undefined, undefined, undefined, undefined, config);
                    postProcess.vignetteWeight = vignetteWeight(this.virtualprism.vignette.weight);
                    postProcess.vignetteCentreX = this.virtualprism.dominantEye === 'left' ? -0.5 : 0.5;
                    postProcess.vignetteColor = Color4.FromHexString(this.virtualprism.vignette.color);
                    console.log(postProcess.vignetteColor.toHexString());
                    postProcess.vignetteBlendMode = ImageProcessingConfiguration.VIGNETTEMODE_MULTIPLY;
                    postProcess.vignetteEnabled = true;
                }
                this.vignetteWatcherObserver = this.scene.onBeforeRenderObservable.add((scene, state) => {
                    if (postProcess && this.virtualprism.vignette) {
                        if (postProcess.vignetteWeight !== vignetteWeight(this.virtualprism.vignette.weight)) {
                            postProcess.vignetteWeight = vignetteWeight(this.virtualprism.vignette.weight);
                        }
                        if (postProcess.vignetteColor.toHexString() !== this.virtualprism.vignette.color) {
                            postProcess.vignetteColor = Color4.FromHexString(this.virtualprism.vignette.color);
                        }
                    }
                });
            }
            else if (state === WebXRState.NOT_IN_XR) {
                this.scene.onBeforeRenderObservable.remove(this.vignetteWatcherObserver);
                if (postProcess) {
                    postProcess.dispose();
                }
            }
        }, 1);
    }
    setBlur(blur) {
        this.virtualprism.blur = blur;
    }
    activateBlur(activate = true) {
        var postProcess;
        if (this.blurObserver) {
            this.xrHelper.onStateChangedObservable.remove(this.blurObserver);
        }
        this.blurObserver = this.xrHelper.onStateChangedObservable.add((state) => {
            if (state === WebXRState.IN_XR && this.virtualprism.blur) {
                if (postProcess && this.virtualprism.blur === 0) {
                    postProcess.dispose();
                }
                else if (this.virtualprism.blur !== 0) {
                    const cameraToProcess = this.virtualprism.dominantEye === 'left' ? this.xrHelper.camera.leftCamera : this.xrHelper.camera.rightCamera;
                    postProcess = new BlurPostProcess("Horizontal blur", new Vector2(4.0, 0.0), this.virtualprism.blur, 1.0, cameraToProcess);
                }
                this.blurWatcherObserver = this.scene.onBeforeRenderObservable.add((scene, state) => {
                    if (postProcess && postProcess.kernel !== this.virtualprism.blur) {
                        postProcess.kernel = this.virtualprism.blur;
                    }
                });
            }
            else if (state === WebXRState.NOT_IN_XR) {
                this.scene.onBeforeRenderObservable.remove(this.blurWatcherObserver);
                if (postProcess) {
                    postProcess.dispose();
                }
            }
        }, 1);
    }
    activatePatch() {
        this.patchObserver = this.xrHelper.onStateChangedObservable.add((state) => {
            if (state === WebXRState.IN_XR && this.virtualprism.patch.active) {
                console.log('patch');
                const activePatch = AdvancedDynamicTexture.CreateFullscreenUI("Patch", true, this.scene);
                const cameraSide = this.virtualprism.dominantEye;
                const layerMask = cameraSide === 'left' ? 0x00000001 : 0x00000002;
                if (activePatch.layer) {
                    activePatch.layer.layerMask = layerMask;
                }
                const rect = new Rectangle();
                rect.width = "100%";
                rect.height = "100%";
                rect.left = `${cameraSide === 'left' ? this.virtualprism.patch.offset : -this.virtualprism.patch.offset}%`;
                rect.top = "0%";
                rect.thickness = 0;
                rect.background = '#000000';
                activePatch.addControl(rect);
                this.patchWatcherObserver = this.scene.onBeforeRenderObservable.add((scene, state) => {
                    const left = `${cameraSide === 'left' ? this.virtualprism.patch.offset : -this.virtualprism.patch.offset}%`;
                    if (rect && rect.left !== left) {
                        rect.left = left;
                    }
                });
            }
            else if (state === WebXRState.NOT_IN_XR) {
                this.scene.onBeforeRenderObservable.remove(this.patchWatcherObserver);
                if (this.activePatch) {
                    this.activePatch.dispose();
                }
            }
        }, 1);
    }
    /**
     * Mesh layerMask's last bit is set to 0001 (left) or 0010 (right)
     * @param mesh
     * @param cameraSide
     */
    attachMeshToCamera(mesh, cameraSide) {
        const layerMask = cameraSide === 'left' ? 0x00000001 : 0x00000002;
        mesh.layerMask = layerMask;
    }
    detachMeshFromCamera(mesh) {
        mesh.layerMask = 0xFFFFFFFF;
    }
    /**
     *
     * @param mesh
     * @param cameraSide
     * @param visibility
     */
    setMeshVisibility(mesh, cameraSide, visibility) {
        const clone = mesh.clone();
        clone.visibility = visibility;
        if (clone.physicsImpostor) {
            clone.physicsImpostor.dispose();
        }
        mesh.onMaterialChangedObservable.add(() => {
            clone.material = mesh.material;
        });
        this.scene.onBeforeRenderObservable.add(() => {
            if (mesh.isDisposed()) {
                clone.dispose();
            }
            else {
                clone.position = mesh.getAbsolutePosition();
            }
        });
        const attachTo = cameraSide === 'left' ? 'right' : 'left';
        this.attachMeshToCamera(mesh, attachTo);
    }
    deleteMeshVisibility(mesh) {
        this.detachMeshFromCamera(mesh);
        const children = mesh.getChildMeshes();
        for (let child of children) {
            child.dispose();
        }
    }
    createGui() {
        // GUI
        var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);
        var panel = new StackPanel();
        panel.width = "220px";
        panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        advancedTexture.addControl(panel);
        advancedTexture.layer.layerMask = 0x40000000;
        var activeHeader = new TextBlock();
        activeHeader.text = "Active";
        activeHeader.height = "20px";
        activeHeader.color = "white";
        panel.addControl(activeHeader);
        var activeCheckbox = new Checkbox();
        activeCheckbox.height = "20px";
        activeCheckbox.width = "20px";
        activeCheckbox.isChecked = false;
        activeCheckbox.color = "green";
        activeCheckbox.onIsCheckedChangedObservable.add((value) => {
            if (value) {
                this.activate();
            }
            else {
                console.log('Deactivate virtual prisms');
                this.deactivate();
            }
        });
        panel.addControl(activeCheckbox);
        var horizontalSlider = this.createSlider(0, 30, 1, 'hor', (value) => `Horizontal: ${value} dpt`, panel);
        var verticalSlider = this.createSlider(0, 10, 0.1, 'ver', (value) => `Vertical: ${value} dpt`, panel);
        var cycloSlider = this.createSlider(-5, 5, 0.1, 'cyclo', (value) => `Cyclo: ${value} degrees`, panel);
        var vergenceslider = this.createSlider(-20, 20, 1, 'vergence', (value) => `Vergence: ${value} dpt`, panel);
        var blurSlider = this.createSlider(0, 128, 1, 'blur', (value) => `Blur: ${value}`, panel, () => this.activateBlur());
        var contrastSlider = this.createSlider(0, 100, 1, 'contrast', (value) => `Contrast: ${value}`, panel, () => this.activateContrast());
        var baseHorRadio = this.createRadioOptions('base', { In: 'in', Out: 'out' }, 'Base:', 'baseHor', panel);
        var baseVerRadio = this.createRadioOptions('base', { Up: 'up', Down: 'down' }, 'Base:', 'baseVer', panel);
        var dominantEyeRadio = this.createRadioOptions('dominantEye', { Left: 'left', Right: 'right' }, 'Dominant eye::', 'dominantEye', panel);
        this.scene.cameras[0].layerMask = 0x4FFFFFFF;
    }
}

export { VirtualPrism };
