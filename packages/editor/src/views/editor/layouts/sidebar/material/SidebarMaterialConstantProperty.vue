<script lang="ts" setup>
import {ref, onMounted, onUnmounted} from "vue";
import {Mesh,Material} from "three";
import {App,Hooks,SetMaterialValueCommand} from "@astral3d/engine";
import {t} from "@/language";

const props = withDefaults(defineProps<{
  property: string,
  name: string,
  options: Array<{ label: string, value: any }>
}>(), {
  property: "",
  name: "",
})

const show = ref(false);
const value = ref();
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
    value.value = material[props.property];
    show.value = true;
  } else {
    show.value = false;
  }
}

function onChange() {
  if (material[props.property] !== value.value) {
    App.execute(new SetMaterialValueCommand(object, props.property, value.value, currentMaterialSlot));
  }
}
</script>

<template>
  <div class="sider-scene-material-constant-property" v-if="show">
    <span>{{ t(`layout.sider.material.${name}`) }}</span>
    <div>
      <n-select size="small" v-model:value="value" :options="options" @update:value="onChange"/>
    </div>
  </div>
</template>

<style lang="less" scoped>
.sider-scene-material-constant-property {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  align-items: center;

  & > span {
     min-width:80px;
  }

  & > div {
    width: 150px;
    color: rgb(165, 164, 164);
  }
}
</style>
