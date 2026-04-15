<script lang="ts" setup>
import {ref, onMounted, onUnmounted} from "vue";
import {Mesh,Material} from "three";
import {App,Hooks,SetMaterialRangeCommand} from "@astral3d/engine";
import {t} from "@/language";
import EsInputNumber from '@/components/es/EsInputNumber.vue';

const props = withDefaults(defineProps<{
  property: string,
  name: string,
  isMin: boolean,
  range: Array<number>,
  step: number,
  unit: string
}>(), {
  property: "",
  name: "",
  isMin: true,
  //@ts-ignore
  range: [-Infinity, Infinity],
  step: 1,
  unit: ''
})

const show = ref(false);
const numberValue = ref();
let object: Mesh;
let material: Material;
let currentMaterialSlot = 0;

onMounted(() => {
  Hooks.useAddSignal("objectSelected", handleObjectSelected);
  Hooks.useAddSignal("materialChanged", update);
  Hooks.useAddSignal("materialCurrentSlotChange", currentSlotChange);
})

onUnmounted(() => {
  Hooks.useRemoveSignal("objectSelected", handleObjectSelected);
  Hooks.useRemoveSignal("materialChanged", update);
  Hooks.useRemoveSignal("materialCurrentSlotChange", currentSlotChange)
})

function currentSlotChange(currentSlot) {
  currentMaterialSlot = currentSlot;
  update();
}

function handleObjectSelected(selected) {
  object = selected;
  update();
}

function update() {
  if (!object || !object.material) return;

  material = App.getObjectMaterial(object, currentMaterialSlot);

  if (props.property in material) {
    numberValue.value = material[props.property][props.isMin ? 0 : 1];
    show.value = true;
  } else {
    show.value = false;
  }
}

function onChange() {
  if (material[props.property][props.isMin ? 0 : 1] !== numberValue.value) {
    const minValue = props.isMin ? numberValue.value : material[props.property][0];
    const maxValue = props.isMin ? material[props.property][1] : numberValue.value;

    App.execute(new SetMaterialRangeCommand(object, props.property, minValue, maxValue, currentMaterialSlot));
  }
}

</script>

<template>
  <div class="sider-scene-material-range-value-property" v-if="show">
    <span>{{ t(`layout.sider.material.${name}`) }}</span>
    <div>
      <EsInputNumber v-model:value="numberValue" size="tiny" :show-button="false" :min="range[0]" :max="range[1]"
                     :step="step" @change="onChange"/>
      <span>{{ unit }}</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.sider-scene-material-range-value-property {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  align-items: center;

  & > span {
    min-width: 80px;
  }

  & > div {
    width: 150px;
    color: rgb(165, 164, 164);
  }
}
</style>