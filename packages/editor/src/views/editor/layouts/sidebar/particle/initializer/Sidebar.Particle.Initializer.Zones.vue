<script setup lang="ts">
import { ref, reactive, watch, onMounted, onBeforeUnmount } from "vue";
import {t} from "@/language";
import { Hooks } from "@astral3d/engine";
import EsInputNumber from "@/components/es/EsInputNumber.vue";

const props = withDefaults(defineProps<{
  zone:  IParticle.Config['init']['position']['zone'],
  disabled:boolean
}>(), {
  zone: null,
  disabled:false
})
const emits = defineEmits(['update:zone','update'])

const initData = reactive({
  PointZone:{
    x:0,
    y:0,
    z:0
  },
  LineZone:{
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
    z1: 0,
    z2: 0,
  },
  BoxZone:{
    depth: 1,
    height: 1,
    width: 1,
    x: 0,
    y: 0,
    z: 0,
  },
  SphereZone:{
    radius:1,
    x: 0,
    y: 0,
    z: 0,
  }
})
const select = ref('');
const options = [
  {label: t("layout.sider.particle.Point"),value:'PointZone'},
  {label: t("layout.sider.particle.Line"),value:'LineZone'},
  {label: t("layout.sider.particle.Box"),value:'BoxZone'},
  {label: t("layout.sider.particle.Sphere"),value:'SphereZone'},
  // {label: t("layout.sider.particle.Mesh"),value:'MeshZone'},
];

watch(() => props.zone,() => {
  updateUI();
})

onMounted(() => {
  Hooks.useAddSignal("objectSelected", updateUI);

  updateUI();
})
onBeforeUnmount(() => {
  Hooks.useRemoveSignal("objectSelected", updateUI);
})

function update(){
  if(!select.value) return;

  emits('update:zone', {
    type: select.value,
    ...initData[select.value]
  });

  emits('update')
}

function updateUI(){
  if(!props.zone){
    select.value = '';
    return;
  }

  select.value = props.zone.type;
  const zone = initData[props.zone.type];
  Object.keys(zone).forEach(key => {
    // @ts-ignore
    if(props.zone[key] === undefined) return;
    // @ts-ignore
    zone[key] = props.zone[key];
  })
}
</script>

<template>
  <div class="particle-config-item">
    <span>{{ t(`layout.sider.particle.Type`) }}</span>
    <div>
      <n-select v-model:value="select" :options="options" :disabled="disabled" @update:value="update" size="small"/>
    </div>
  </div>

  <template v-if="select === 'PointZone'">
    <div class="particle-config-item">
      <span>{{ t(`other.Coordinate`) }}</span>
      <div class="flex">
        <EsInputNumber v-model:value="initData.PointZone.x" size="tiny" :show-button="false" :disabled="disabled"
                       :min="-Infinity" :max="Infinity" :decimal="2" @change="update()"/>
        <EsInputNumber v-model:value="initData.PointZone.y" size="tiny" :show-button="false" :disabled="disabled"
                       :min="-Infinity" :max="Infinity" :decimal="2" @change="update()"/>
        <EsInputNumber v-model:value="initData.PointZone.z" size="tiny" :show-button="false" :disabled="disabled"
                       :min="-Infinity" :max="Infinity" :decimal="2" @change="update()"/>
      </div>
    </div>
  </template>

  <template v-else-if="select === 'LineZone'">
    <div class="particle-config-item">
      <span>{{ t(`layout.sider.particle.Start point`) }}</span>
      <div class="flex">
        <EsInputNumber v-model:value="initData.LineZone.x1" size="tiny" :show-button="false" :disabled="disabled"
                       :min="-Infinity" :max="Infinity" :decimal="2" @change="update()"/>
        <EsInputNumber v-model:value="initData.LineZone.y1" size="tiny" :show-button="false" :disabled="disabled"
                       :min="-Infinity" :max="Infinity" :decimal="2" @change="update()"/>
        <EsInputNumber v-model:value="initData.LineZone.z1" size="tiny" :show-button="false" :disabled="disabled"
                       :min="-Infinity" :max="Infinity" :decimal="2" @change="update()"/>
      </div>
    </div>
    <div class="particle-config-item">
      <span>{{ t(`layout.sider.particle.End point`) }}</span>
      <div class="flex">
        <EsInputNumber v-model:value="initData.LineZone.x2" size="tiny" :show-button="false" :disabled="disabled"
                       :min="-Infinity" :max="Infinity" :decimal="2" @change="update()"/>
        <EsInputNumber v-model:value="initData.LineZone.y2" size="tiny" :show-button="false" :disabled="disabled"
                       :min="-Infinity" :max="Infinity" :decimal="2" @change="update()"/>
        <EsInputNumber v-model:value="initData.LineZone.z2" size="tiny" :show-button="false" :disabled="disabled"
                       :min="-Infinity" :max="Infinity" :decimal="2" @change="update()"/>
      </div>
    </div>
  </template>

  <template v-else-if="select === 'BoxZone'">
    <div class="particle-config-item">
      <span>{{ t(`other.Coordinate`) }}</span>
      <div class="flex">
        <EsInputNumber v-model:value="initData.BoxZone.x" size="tiny" :show-button="false" :disabled="disabled"
                       :min="-Infinity" :max="Infinity" :decimal="2" @change="update()"/>
        <EsInputNumber v-model:value="initData.BoxZone.y" size="tiny" :show-button="false" :disabled="disabled"
                       :min="-Infinity" :max="Infinity" :decimal="2" @change="update()"/>
        <EsInputNumber v-model:value="initData.BoxZone.z" size="tiny" :show-button="false" :disabled="disabled"
                       :min="-Infinity" :max="Infinity" :decimal="2" @change="update()"/>
      </div>
    </div>
    <div class="particle-config-item">
      <span>{{ t(`other.Width`) }}</span>
      <div>
        <EsInputNumber v-model:value="initData.BoxZone.width" size="tiny" :show-button="false" :disabled="disabled"
                       :min="0" :max="Infinity" @change="update()"/>
      </div>
    </div>
    <div class="particle-config-item">
      <span>{{ t(`other.Height`) }}</span>
      <div>
        <EsInputNumber v-model:value="initData.BoxZone.height" size="tiny" :show-button="false" :disabled="disabled"
                       :min="0" :max="Infinity" @change="update()"/>
      </div>
    </div>
    <div class="particle-config-item">
      <span>{{ t(`other.Depth`) }}</span>
      <div>
        <EsInputNumber v-model:value="initData.BoxZone.depth" size="tiny" :show-button="false" :disabled="disabled"
                       :min="0" :max="Infinity" @change="update()"/>
      </div>
    </div>
  </template>

  <template v-else-if="select === 'SphereZone'">
    <div class="particle-config-item">
      <span>{{ t(`other.Coordinate`) }}</span>
      <div class="flex">
        <EsInputNumber v-model:value="initData.SphereZone.x" size="tiny" :show-button="false" :disabled="disabled"
                       :min="-Infinity" :max="Infinity" :decimal="2" @change="update()"/>
        <EsInputNumber v-model:value="initData.SphereZone.y" size="tiny" :show-button="false" :disabled="disabled"
                       :min="-Infinity" :max="Infinity" :decimal="2" @change="update()"/>
        <EsInputNumber v-model:value="initData.SphereZone.z" size="tiny" :show-button="false" :disabled="disabled"
                       :min="-Infinity" :max="Infinity" :decimal="2" @change="update()"/>
      </div>
    </div>
    <div class="particle-config-item">
      <span>{{ t(`layout.sider.postProcessing.Radius`) }}</span>
      <div>
        <EsInputNumber v-model:value="initData.SphereZone.radius" size="tiny" :show-button="false" :disabled="disabled"
                       :min="0" :max="Infinity" @change="update()"/>
      </div>
    </div>
  </template>
</template>

<style scoped lang="less">

</style>