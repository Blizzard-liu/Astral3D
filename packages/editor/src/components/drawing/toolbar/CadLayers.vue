<template>
  <n-popover trigger="manual" :show="show">
    <template #trigger>
      <span class="absolute" ref="triggerRef"></span>
    </template>

    <div class="overflow-y-auto h-500px" ref="popoverRef">
      <div className="flex items-center mb-15px">
        <n-icon size="16" color="#CACACA" v-if="viewAll">
          <EyeSharp className="cursor-pointer" @click="handleLayersAllView(false)"/>
        </n-icon>
        <n-icon size="16" color="#CACACA" v-else>
          <EyeOffSharp className="cursor-pointer" @click="handleLayersAllView(true)"/>
        </n-icon>
        <span className="ml-5px">全部图层</span>
      </div>

      <div v-for="key in Object.keys(drawingInfo.layers)" :key="key" className="flex items-center mt-10px">
        <n-icon size="16" color="#CACACA" v-if="drawingInfo.layers[key].visible">
          <EyeSharp className="cursor-pointer" @click="handleSetLayerVisible(key,false)"/>
        </n-icon>
        <n-icon size="16" color="#CACACA" v-else>
          <EyeOffSharp className="cursor-pointer" @click="handleSetLayerVisible(key,true)"/>
        </n-icon>
        <div className="w-15px h-15px mx-5px"
             :style="{backgroundColor: decToRgb(drawingInfo.layers[key].color)}"></div>
        <span className="ml-5px">{{ drawingInfo.layers[key].name }}</span>
      </div>
    </div>
  </n-popover>
</template>

<script setup lang="ts">
import {ref,useTemplateRef, onMounted, nextTick, inject, Ref} from 'vue';
import { onClickOutside } from '@vueuse/core';
import {EyeSharp, EyeOffSharp} from '@vicons/ionicons5';
import {decToRgb} from "@/utils/common/color";
import {App} from "@astral3d/engine";

const props = withDefaults(defineProps<{
  show: boolean
}>(), {
  show: false
})

const emits = defineEmits(['update:show','close'])

const drawingInfo = inject("drawingInfo") as Ref<IDrawing>;
const triggerRef = useTemplateRef<HTMLSpanElement>('triggerRef');
const popoverRef = useTemplateRef<HTMLSpanElement>('popoverRef');
const viewAll = ref(true);

onMounted(() => {
  // 在图层按钮位置弹出
  const layerBtn = document.getElementById("drawing-tool-bar-layers");
  nextTick().then(() => {
    if (layerBtn && triggerRef.value) {
      triggerRef.value.style.left = `${layerBtn.offsetLeft + layerBtn.clientWidth /2 }px`;
    }
  })
});
onClickOutside(popoverRef, () => {
  if(!props.show) return;

  emits('close');
})

// 全部图层显示/隐藏
function handleLayersAllView(bool: boolean) {
  viewAll.value = bool;

  Object.keys(drawingInfo.value.layers).forEach((key) => {
    handleSetLayerVisible(key, bool);
  });
}

function handleSetLayerVisible(layerName: string, bool: boolean) {
  drawingInfo.value.layers[layerName].visible = bool;
  window.DrawViewer?.callMethod("setLayerVisible", {layerName, visible: bool});
  App.project.setDrawingLayerVisible(layerName, bool);
}
</script>

<style scoped lang="less">

</style>