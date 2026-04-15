<script setup lang="ts">
import { ref, reactive, watch, onMounted, onBeforeUnmount } from "vue";
import {t} from "@/language";
import { Hooks } from "@astral3d/engine";
import EsInputNumber from "@/components/es/EsInputNumber.vue";

const props = withDefaults(defineProps<{
  velocity:  IParticle.Config['init']['velocity']['velocity'],
  disabled:boolean
}>(), {
  velocity: null,
  disabled:false
})
const emits = defineEmits(['update:velocity','update'])

const initData = reactive({
  RadialVelocity:{
    radius: 1,
    x: 0,
    y: 1,
    z: 0,
    theta: 90
  },
  PolarVelocity:{
    radius: 1,
    theta: 0,
    phi: 0,
    tha: 90
  },
  VectorVelocity:{
    x: 0,
    y: 1,
    z: 0,
    theta: 90
  },
})
const select = ref('');
const options = [
  {label: t("layout.sider.particle.Radial"),value:'RadialVelocity'},
  {label: t("layout.sider.particle.Polar"),value:'PolarVelocity'},
  {label: t("layout.sider.particle.Vector"),value:'VectorVelocity'},
];

watch(() => props.velocity,() => {
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

  emits('update:velocity', {
    type: select.value,
    ...initData[select.value]
  });

  emits('update')
}

function updateUI(){
  if(!props.velocity){
    select.value = '';
    return;
  }

  select.value = props.velocity.type;
  const velocity = initData[props.velocity.type];
  Object.keys(velocity).forEach(key => {
    // @ts-ignore
    if(props.velocity[key] === undefined) return;
    // @ts-ignore
    velocity[key] = props.velocity[key];
  })
}
</script>

<template>
  <div class="particle-config-item">
    <span>{{ t(`layout.sider.particle.Type`) }}</span>
    <div>
      <n-select v-model:value="select" :options="options" :disabled="disabled" @update:value="update"  size="small"/>
    </div>
  </div>

  <template v-if="select === 'RadialVelocity'">
    <!--  半径  -->
    <div class="particle-config-item">
      <span>{{ t(`layout.sider.particle.Radius`) }}</span>
      <EsInputNumber v-model:value="initData.RadialVelocity.radius" size="tiny" :show-button="false" :disabled="disabled"
                     :min="0" :max="Infinity" :decimal="2" @change="update()"/>
    </div>

    <!--  theta angle   -->
    <div class="particle-config-item">
      <span>{{ t(`layout.sider.particle.Theta`) }}</span>
      <EsInputNumber v-model:value="initData.RadialVelocity.theta" size="tiny" :show-button="false" :disabled="disabled"
                     :min="0" :max="360" :decimal="2" unit="°" @change="update()"/>
    </div>

    <!-- 方向  -->
    <div class="particle-config-item">
      <span>{{ t(`layout.sider.particle.Direction`) }}</span>
      <div class="flex">
        <EsInputNumber v-model:value="initData.RadialVelocity.x" size="tiny" :show-button="false" :disabled="disabled"
                       :min="-Infinity" :max="Infinity" :decimal="2" @change="update()"/>
        <EsInputNumber v-model:value="initData.RadialVelocity.y" size="tiny" :show-button="false" :disabled="disabled"
                       :min="-Infinity" :max="Infinity" :decimal="2" @change="update()"/>
        <EsInputNumber v-model:value="initData.RadialVelocity.z" size="tiny" :show-button="false" :disabled="disabled"
                       :min="-Infinity" :max="Infinity" :decimal="2" @change="update()"/>
      </div>
    </div>
  </template>

  <template v-else-if="select === 'PolarVelocity'">
    <!--  半径  -->
    <div class="particle-config-item">
      <span>{{ t(`layout.sider.particle.Radius`) }}</span>
      <EsInputNumber v-model:value="initData.PolarVelocity.radius" size="tiny" :show-button="false" :disabled="disabled"
                     :min="0" :max="Infinity" :decimal="2" @change="update()"/>
    </div>

    <!--  俯仰角   -->
    <div class="particle-config-item">
      <span>{{ t(`layout.sider.particle.Theta`) }}</span>
      <EsInputNumber v-model:value="initData.PolarVelocity.theta" size="tiny" :show-button="false" :disabled="disabled"
                     :min="0" :max="360" :decimal="2" unit="°" @change="update()"/>
    </div>

    <!--  方位角   -->
    <div class="particle-config-item">
      <span>{{ t(`layout.sider.particle.Phi`) }}</span>
      <EsInputNumber v-model:value="initData.PolarVelocity.phi" size="tiny" :show-button="false" :disabled="disabled"
                     :min="0" :max="360" :decimal="2" unit="°" @change="update()"/>
    </div>

    <!--  theta angle   -->
    <div class="particle-config-item">
      <span>{{ t(`preview.Angle`) }}</span>
      <EsInputNumber v-model:value="initData.PolarVelocity.tha" size="tiny" :show-button="false" :disabled="disabled"
                     :min="0" :max="360" :decimal="2" unit="°" @change="update()"/>
    </div>
  </template>

  <template v-else-if="select === 'VectorVelocity'">
    <!--  theta angle   -->
    <div class="particle-config-item">
      <span>{{ t(`layout.sider.particle.Theta`) }}</span>
      <EsInputNumber v-model:value="initData.VectorVelocity.theta" size="tiny" :show-button="false" :disabled="disabled"
                     :min="0" :max="360" :decimal="2" unit="°" @change="update()"/>
    </div>

    <!-- 方向  -->
    <div class="particle-config-item">
      <span>{{ t(`layout.sider.particle.Direction`) }}</span>
      <div class="flex">
        <EsInputNumber v-model:value="initData.VectorVelocity.x" size="tiny" :show-button="false" :disabled="disabled"
                       :min="-Infinity" :max="Infinity" :decimal="2" @change="update()"/>
        <EsInputNumber v-model:value="initData.VectorVelocity.y" size="tiny" :show-button="false" :disabled="disabled"
                       :min="-Infinity" :max="Infinity" :decimal="2" @change="update()"/>
        <EsInputNumber v-model:value="initData.VectorVelocity.z" size="tiny" :show-button="false" :disabled="disabled"
                       :min="-Infinity" :max="Infinity" :decimal="2" @change="update()"/>
      </div>
    </div>
  </template>
</template>

<style scoped lang="less">

</style>