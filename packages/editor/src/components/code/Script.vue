<template>
  <n-modal v-model:show="show" class="!w-90vw" preset="dialog" :title="title" :showIcon="false">
    <CodeEditor ref="scriptCodeRef" v-model:source="script.source" :mode="mode" class="!h-80vh"/>

    <n-alert title="Error" type="error" v-if="errors.length" closable @close="errors = []"
             class="absolute bottom-0 w-full z-9999">
      <n-text depth="1" v-for="(error,index) in errors" :keys="index" class="block">{{ error }}</n-text>
    </n-alert>
    <div class="float-right mt-10px">
      <n-button size="small" @click="show = false">{{ t('other.Cancel') }}</n-button>
      <n-button class="ml-5px" type="primary" size="small" @click="submit">{{ t('other.Ok') }}</n-button>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, reactive, ref} from "vue";
import * as THREE from 'three';
import {App, Hooks, SetScriptValueCommand, SetMaterialValueCommand} from '@astral3d/engine';
import {t} from "@/language";
import CodeEditor from "@/components/code/CodeEditor.vue";

const scriptCodeRef = ref();
const title = ref("");
const show = ref(false);
const script = reactive({
  name: '',
  source: ''
});
const errors = ref([]);
const mode = ref('javascript');

let currentScript: IScript.IStruct | string | null = null;
let currentObject: THREE.Mesh | null = null;

onMounted(async () => {
  Hooks.useAddSignal("sceneCleared", sceneCleared);
  Hooks.useAddSignal("scriptRemoved", scriptRemoved);
  Hooks.useAddSignal("editScript", editScript);
})
onBeforeUnmount(() => {
  Hooks.useRemoveSignal("sceneCleared", sceneCleared);
  Hooks.useRemoveSignal("scriptRemoved", scriptRemoved);
  Hooks.useRemoveSignal("editScript", editScript);
})

function sceneCleared() {
  show.value = false;
  script.name = "";
  script.source = "";
  errors.value = [];
}

function scriptRemoved(_: THREE.Object3D, sc: IScript.IStruct) {
  if (script.name === sc.name) {
    sceneCleared();
  }
}

function editScript(object: THREE.Object3D, sc: IScript.IStruct | string) {
  if (typeof (sc) === 'object') {
    mode.value = 'javascript';
    script.name = sc.name;
    script.source = sc.source;
    title.value = object.name + ' / ' + script.name;
  } else {
    switch (sc) {
      case 'vertexShader':
        mode.value = 'glsl';
        script.name = 'Vertex Shader';
        // @ts-ignore
        script.source = object.material.vertexShader || '';
        break;

      case 'fragmentShader':
        mode.value = 'glsl';
        script.name = 'Fragment Shader';
        // @ts-ignore
        script.source = object.material.fragmentShader || '';
        break;

      case 'programInfo':
        mode.value = 'json';
        script.name = 'Program Properties';
        const json = {
          // @ts-ignore
          defines: object.material.defines,
          // @ts-ignore
          uniforms: object.material.uniforms,
          // @ts-ignore
          attributes: object.material.attributes
        };
        script.source = JSON.stringify(json, null, '\t');
    }

    // @ts-ignore
    title.value = object.material.name + ' / ' + script.name;
  }

  currentScript = sc;
  currentObject = object as THREE.Mesh;

  show.value = true;
}

function submit(e: Event) {
  e.stopPropagation();

  errors.value = scriptCodeRef.value.getErrors();
  if (errors.value.length > 0) return;

  if (!currentObject) return;

  const value = script.source;

  if (typeof (currentScript) === 'object') {
    if (value !== currentScript?.source) {
      App.execute(new SetScriptValueCommand(currentObject as THREE.Object3D, currentScript as IScript.IStruct, 'source', value));
    }

    show.value = false;
    return;
  }

  if (mode.value === 'glsl' && currentObject.material) {
    currentObject.material[currentScript] = value;
    (currentObject.material as THREE.Material).needsUpdate = true;
    Hooks.useDispatchSignal('materialChanged', currentObject, 0);

    show.value = false;
    return;
  }

  if (currentScript !== 'programInfo') {
    show.value = false;
    return;
  }

  if (!currentObject.material) return

  const json = JSON.parse(value);

  if (JSON.stringify((currentObject.material as THREE.Material).defines) !== JSON.stringify(json.defines)) {
    const cmd = new SetMaterialValueCommand(currentObject, 'defines', json.defines);
    cmd.updatable = false;
    App.execute(cmd);
  }

  // @ts-ignore
  if (JSON.stringify(currentObject.material.uniforms) !== JSON.stringify(json.uniforms)) {
    const cmd = new SetMaterialValueCommand(currentObject, 'uniforms', json.uniforms);
    cmd.updatable = false;
    App.execute(cmd);
  }

  // @ts-ignore
  if (JSON.stringify(currentObject.material.attributes) !== JSON.stringify(json.attributes)) {
    const cmd = new SetMaterialValueCommand(currentObject, 'attributes', json.attributes);
    cmd.updatable = false;
    App.execute(cmd);
  }

  show.value = false;
}
</script>