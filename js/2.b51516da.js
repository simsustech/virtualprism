(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[2],{"1a28":function(e,n,t){"use strict";t.r(n);var o=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("q-page",{staticClass:"column col"},[t("div",{staticClass:"column col no-wrap"},[t("canvas",{ref:"canvas",staticClass:"column col",attrs:{"touch-action":"none"}})])])},r=[],i=t("e4fd"),l=(t("752c"),t("bf93")),a=t("35c2"),s=t("9fe5"),c=t("8681"),u=function(e,n,t,o){function r(e){return e instanceof t?e:new t((function(n){n(e)}))}return new(t||(t=Promise))((function(t,i){function l(e){try{s(o.next(e))}catch(n){i(n)}}function a(e){try{s(o["throw"](e))}catch(n){i(n)}}function s(e){e.done?t(e.value):r(e.value).then(l,a)}s((o=o.apply(e,n||[])).next())}))};const d={objectRangeX:[-.4,.4],objectRangeY:[1,1.8],objectOffset:0,objectInterval:800,objectIntervalMultiplier:1,worldBox:{x:[-5,5],y:[0,5],z:[-1,20]}};function v(e){return!(e.position.x<d.worldBox.x[0]||e.position.x>d.worldBox.x[1]||e.position.y<d.worldBox.y[0]||e.position.y>d.worldBox.y[1]||e.position.z<d.worldBox.z[0]||e.position.z>d.worldBox.z[1])}let p=0;function f(e,n,t,o){if(n.baseExperience.state===l["n"].IN_XR){const t=n.baseExperience.featuresManager.getEnabledFeature(l["m"].Name),r=n.input.controllers.map((e=>t.getImpostorForController(e))),i=.09,a=4/3*Math.PI*Math.pow(i,3),s=l["f"].CreateSphere("sphere",{diameter:2*i,segments:32},e);s.position=new l["l"](Math.random()*(d.objectRangeX[1]-d.objectRangeX[0])+d.objectRangeX[0]+d.objectOffset,Math.random()*(d.objectRangeY[1]-d.objectRangeY[0])+d.objectRangeY[0],15),s.physicsImpostor=new l["g"](s,l["g"].SphereImpostor,{mass:10*a,friction:.1,restitution:1},e);const c=new l["l"](0,0,-1);s.physicsImpostor.setLinearVelocity(c),o&&(5===p?o.attachMeshToCamera(s,o.suppressedEye):o.setMeshVisibility(s,o.virtualprism.dominantEye,.3*Math.random()+.1)),e.onBeforeRenderObservable.add((()=>{v(s)||s.dispose()}));const u=function(n,t){s.material=h(e,.7)};r[1]&&s.physicsImpostor.registerOnPhysicsCollide(r,u),p<5?p++:p=0}}const h=(e,n)=>{const t=new l["j"]("hitMaterial",e);return t.alpha=1,t.diffuseColor=n>.5?new l["b"](0,n,0):new l["b"](n,0,0),t};function b(e,n,t){return u(this,void 0,void 0,(function*(){const t=new l["a"](!0,c),o=yield Object(s["a"])(e,n,{environment:{skyboxSize:100},physics:{gravity:new l["l"](0,0,0),plugin:t},xr:{teleport:!1,controller:{model:"glove",rotation:{x:1*Math.PI,y:0,z:0}}}});let r=setInterval((()=>f(o.scene,o.xr,o.controllers,o.virtualprism)),d.objectInterval);return setInterval((function(){clearInterval(r),d.objectIntervalMultiplier=.4*Math.random()+.4,r=setInterval((()=>f(o.scene,o.xr,o.controllers,o.virtualprism)),d.objectInterval*d.objectIntervalMultiplier),setTimeout((function(){clearInterval(r),r=setInterval((()=>f(o.scene,o.xr,o.controllers,o.virtualprism)),d.objectInterval)}),5e3)}),3e4),setInterval((()=>{d.objectOffset=1*Math.random()-.5}),1e4),o}))}var m=t("0613"),y=function(e,n,t,o){function r(e){return e instanceof t?e:new t((function(n){n(e)}))}return new(t||(t=Promise))((function(t,i){function l(e){try{s(o.next(e))}catch(n){i(n)}}function a(e){try{s(o["throw"](e))}catch(n){i(n)}}function s(e){e.done?t(e.value):r(e.value).then(l,a)}s((o=o.apply(e,n||[])).next())}))},w=Object(i["defineComponent"])({name:"PageBoxing",setup(){const e=Object(m["b"])(),n=Object(i["computed"])((()=>e.virtualprism.state.value.virtualprism)),t=Object(i["ref"])();let o;return Object(i["watch"])(n,(()=>{o.virtualprism&&o.virtualprism.set(n.value)}),{deep:!0}),Object(i["onMounted"])((()=>y(this,void 0,void 0,(function*(){if(t.value){const e=new l["c"](t.value,!0);o=yield b(t.value,e),o.virtualprism=new a["a"](o.scene,o.xr.baseExperience,n.value),o.virtualprism.activate(),e.runRenderLoop((function(){o.scene.render()})),window.addEventListener("resize",(function(){e.resize()}))}})))),{canvas:t}}}),g=w,x=t("2877"),j=t("9989"),I=t("eebe"),M=t.n(I),C=Object(x["a"])(g,o,r,!1,null,null,null);n["default"]=C.exports;M()(C,"components",{QPage:j["a"]})},"9fe5":function(e,n,t){"use strict";t.d(n,"a",(function(){return l}));var o=t("bf93"),r=t("35c2"),i=function(e,n,t,o){function r(e){return e instanceof t?e:new t((function(n){n(e)}))}return new(t||(t=Promise))((function(t,i){function l(e){try{s(o.next(e))}catch(n){i(n)}}function a(e){try{s(o["throw"](e))}catch(n){i(n)}}function s(e){e.done?t(e.value):r(e.value).then(l,a)}s((o=o.apply(e,n||[])).next())}))};function l(e,n,t){var l,a,s,c,u,d,v,p;return i(this,void 0,void 0,(function*(){const i=new o["h"](n);if((null===(l=null===t||void 0===t?void 0:t.physics)||void 0===l?void 0:l.gravity)||(null===(a=null===t||void 0===t?void 0:t.physics)||void 0===a?void 0:a.plugin)){if(!t.physics.gravity||!t.physics.plugin)throw new Error("Please provide a gravity vector and a physics plugin");i.enablePhysics(t.physics.gravity,t.physics.plugin)}const f={left:null,right:null};if(null===(c=null===(s=null===t||void 0===t?void 0:t.xr)||void 0===s?void 0:s.controller)||void 0===c?void 0:c.model){const e=["left","right"];for(const n of e)yield o["i"].ImportMeshAsync(null,"",`models/${t.xr.controller.model}${n}.babylon`,i).then((e=>{var r,i,l,a,s,c;if(f[n]=o["e"].MergeMeshes(e.meshes),f[n]){f[n].setEnabled(!1),f[n].position=new o["l"](0,0,0);const e=new o["l"]((null===(i=null===(r=t.xr)||void 0===r?void 0:r.controller)||void 0===i?void 0:i.rotation.x)||0,(null===(a=null===(l=t.xr)||void 0===l?void 0:l.controller)||void 0===a?void 0:a.rotation.y)||0,(null===(c=null===(s=t.xr)||void 0===s?void 0:s.controller)||void 0===c?void 0:c.rotation.z)||0);f[n].rotation=e}}))}const h=new o["k"]("UniversalCamera",new o["l"](0,1.5,0),i);h.setTarget(new o["l"](0,1.5,1)),e&&h.attachControl(e,!0);const b=new o["d"]("light",new o["l"](0,1,0),i);b.intensity=.7;const m=i.createDefaultEnvironment(t.environment);m&&m.setMainColor(o["b"].FromHexString("#74b9ff"));const y=yield i.createDefaultXRExperienceAsync(Object.assign({floorMeshes:(null===m||void 0===m?void 0:m.ground)?[m.ground]:void 0,disableTeleportation:null===(u=t.xr)||void 0===u?void 0:u.teleport,inputOptions:{doNotLoadControllerMeshes:!0}},t.xr));let w;return(null===(d=t.xr)||void 0===d?void 0:d.teleport)||(y.teleportation.detach(),y.pointerSelection.detach()),(null===(v=null===t||void 0===t?void 0:t.physics)||void 0===v?void 0:v.gravity)&&(null===(p=null===t||void 0===t?void 0:t.physics)||void 0===p?void 0:p.plugin)&&(console.log("Enable WebXRControllerPhysics"),y.baseExperience.featuresManager.enableFeature(o["m"].Name,"latest",{xrInput:y.input})),y.baseExperience.onStateChangedObservable.add((e=>{e===o["n"].IN_XR&&y.baseExperience.camera.setTransformationFromNonVRCamera(h,!0)})),y.input.onControllerAddedObservable.add((e=>{e.onMotionControllerInitObservable.add((n=>{const t=n.handness;"left"!==t&&"right"!==t||f[t]&&e.grip&&(f[t].parent=e.grip,f[t].setEnabled(!0))}))})),t.virtualprism&&(w=new r["a"](i,y.baseExperience,t.virtualprism)),{scene:i,virtualprism:w,environment:m,xr:y,controllers:f}}))}}}]);