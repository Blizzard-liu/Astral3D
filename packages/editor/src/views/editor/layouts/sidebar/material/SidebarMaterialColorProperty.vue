<script lang="ts" setup>
import {ref, onMounted, onUnmounted} from "vue";
import {Mesh,Material,Color} from "three";
import {App,Hooks,Utils,SetMaterialColorCommand,SetMaterialValueCommand} from "@astral3d/engine";
import EsInputNumber from '@/components/es/EsInputNumber.vue';
import {t} from "@/language";
import EsKeyFrame from "@/components/es/EsKeyFrame.vue";

const props = withDefaults(defineProps<{
  property: string,
  name: string
}>(), {
  property: "",
  name: ""
})

const show = ref(false);
const color = ref<string>("");
const intensity = ref(0);
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

const update = Utils.throttle(function () {
  if (!object || !object.material) return;

  material = App.getObjectMaterial(object, currentMaterialSlot);

  if (props.property in material) {
    color.value = material[props.property].getStyle();
    if (material[`${props.property}Intensity`] !== undefined) {
      intensity.value = material[`${props.property}Intensity`];
    }
    show.value = true;
  } else {
    show.value = false;
  }
},100)

function onChange() {
  const newColor = new Color(color.value).getHex();
  if (material[props.property].getHex() !== newColor) {
    App.execute(new SetMaterialColorCommand(object, props.property, newColor, currentMaterialSlot));
  }

  if (intensity !== undefined) {
    if (material[`${props.property}Intensity`] !== intensity.value) {
      App.execute(new SetMaterialValueCommand(object, `${props.property}Intensity`, intensity.value, currentMaterialSlot));
    }
  }
}

</script>

<template>
    <div id="sider-scene-material-color-property" v-if="show">
        <!-- <span>{{ t(`layout.sider.material.${name}`) }}</span> -->
        <EsKeyFrame :label="t(`layout.sider.material.${name}`)" :attr="`material.${property}`" />
        <div>
            <n-color-picker v-model:value="color" :show-alpha="false" size="small" @update:value="onChange()" />
            <EsInputNumber v-if="property === 'emissive'" v-model:value="intensity" size="tiny" :show-button="false"
                @change="onChange()" />
        </div>
    </div>
</template>

<style lang="less" scoped>
#sider-scene-material-color-property {
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
