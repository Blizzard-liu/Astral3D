<script setup lang="ts">
import {ref, reactive, watch, onMounted, onBeforeUnmount, nextTick, toRaw} from "vue";
import {Color, CubeTexture, Texture, TextureLoader} from 'three';
import { Hooks,ParticleSystem } from "@astral3d/engine";
import {t} from "@/language";
import EsTexture from "@/components/es/EsTexture.vue";

const props = withDefaults(defineProps<{
  body: IParticle.Config['init']['body'],
}>(), {
  body: () => ({
    isEnabled: false,
    body: {
      type: "Sprite",
      uuid: "",
    }
  })
})
const emits = defineEmits(['update:body'])

const initData = reactive(JSON.parse(JSON.stringify(props.body)));
const options = [
  {label: t("layout.sider.particle.Picture"), value: 'Sprite'},
  {label: t("layout.sider.particle.Mesh"), value: 'Mesh'},
  {label: t("layout.sider.particle.Point"), value: 'Point'},
];
const spriteTexture = ref<Color | Texture | CubeTexture | null>(null)
const meshSource = ref('basic');
const builtIn = ref('box');
const builtInMesh = [
  {label: t("extra.resource.model.Box"), value: 'box'},
  {label: t("extra.resource.model.Capsule"), value: 'capsule'},
  {label: t("extra.resource.model.Circle"), value: 'circle'},
  {label: t("extra.resource.model.Cylinder"), value: 'cylinder'},
  {label: t("extra.resource.model.Tetrahedron"), value: 'tetrahedron'},
  {label: t("extra.resource.model.Octahedron"), value: 'octahedron'},
  {label: t("extra.resource.model.Dodecahedron"), value: 'dodecahedron'},
  {label: t("extra.resource.model.Icosahedron"), value: 'icosahedron'},
  {label: t("extra.resource.model.Double cone"), value: 'doubleCone'},
  {label: t("extra.resource.model.Plane"), value: 'plane'},
  {label: t("extra.resource.model.Ring"), value: 'ring'},
  {label: t("extra.resource.model.Sphere"), value: 'sphere'},
  {label: t("extra.resource.model.Torus"), value: 'torus'},
  {label: t("extra.resource.model.TorusKnot"), value: 'torusKnot'},
  {label: t("extra.resource.model.Tube"), value: 'tube'},
  {label: t("extra.resource.model.Teapot"), value: 'teapot'},
]

watch(() => props.body, () => {
  updateUI();
})

onMounted(() => {
  Hooks.useAddSignal("objectSelected", updateUI);

  updateUI();
})
onBeforeUnmount(() => {
  Hooks.useRemoveSignal("objectSelected", updateUI);
})

function updateUI() {
  if (!props.body?.body) {
    initData.body.type = '';
    return;
  }

  initData.body.type = props.body.body.type;
  initData.body.uuid = props.body.body.uuid;
  initData.isEnabled = props.body.isEnabled;

  switch (initData.body.type) {
    case 'Sprite':
      const sprite = ParticleSystem.Body3DMap.get(initData.body.uuid);
      // @ts-ignore
      if(sprite?.material?.map){
        // @ts-ignore
        spriteTexture.value = sprite.material.map;
      }else{
        spriteTexture.value = null;
      }
      break;
    case 'Mesh':
      const mesh = ParticleSystem.Body3DMap.get(initData.body.uuid);
      if(meshSource.value === 'basic'){
        if(!mesh) {
          builtIn.value = 'box';
          return;
        }
        // 内置模型名称首字母是大写的，改为小写
        builtIn.value = mesh.name.charAt(0).toLowerCase() + mesh.name.slice(1);
      }
      break;
  }

  // spriteTexture不能是空对象，否则从其他类型切换过来时，update方法传过去空对象，会造成渲染报错
  if(spriteTexture.value && Object.keys(spriteTexture.value).length === 0){
    spriteTexture.value = new TextureLoader().load("/static/resource/textures/dot.png")
  }
}

async function update(isObjectChange = false) {
  if (!initData.body.type) return;

  await nextTick();

  const getObject = () => {
    if (initData.body.type === 'Sprite') {
      return toRaw(spriteTexture.value)
    } else if (initData.body.type === 'Point') {
      return 'Point'
    } else {
      return builtIn.value;
    }
  }
  Hooks.useDispatchSignal("particleBodyChanged", JSON.parse(JSON.stringify(initData)), getObject(), isObjectChange, (_data: IParticle.Config['init']['body']) => {
    emits('update:body', JSON.parse(JSON.stringify(_data)));
  });
}
</script>

<template>
  <!-- 是否启用 -->
  <div class="particle-config-item">
    <span>{{ t(`other.Enable`) }}</span>
    <div>
      <n-checkbox size="small" v-model:checked="initData.isEnabled" @update:checked="update(false)"/>
    </div>
  </div>

  <div class="particle-config-item">
    <span>{{ t(`layout.sider.particle.Type`) }}</span>
    <div>
      <n-select v-model:value="initData.body.type" :options="options" :disabled="!initData.isEnabled"
                @update:value="update(true)"  size="small"/>
    </div>
  </div>

  <template v-if="initData.body.type === 'Sprite'">
    <div class="particle-config-item">
      <span>{{ t(`layout.sider.particle.Picture`) }}</span>
      <div>
        <EsTexture v-model:texture="spriteTexture" :disabled="!initData.isEnabled"
                   @change="update(true)" width="40px" height="40px" class="ml-5px"/>
      </div>
    </div>
  </template>

  <template v-else-if="initData.body.type === 'Mesh'">
    <!-- Mesh来源 -->
    <div class="particle-config-item">
      <span>{{ t(`layout.sider.particle.Mesh source`) }}</span>
      <div>
        <n-radio-group v-model:value="meshSource" name="MeshSource">
          <n-space>
            <n-radio value="basic">{{ t(`layout.sider.particle.Built-in`) }}</n-radio>
            <n-radio value="scene" disabled>{{ t(`layout.sider.Scene`) }}</n-radio>
          </n-space>
        </n-radio-group>
      </div>
    </div>

    <!-- 内置Mesh -->
    <div class="particle-config-item" v-if="meshSource === 'basic'">
      <span>{{ t(`layout.sider.particle.Built-in`) }}</span>
      <n-select v-model:value="builtIn" :options="builtInMesh" :disabled="!initData.isEnabled"
                @update:value="update(true)"/>
    </div>
  </template>
</template>

<style scoped lang="less">

</style>