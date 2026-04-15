<template>
  <div id="drawing" class="!w-full !h-full" @contextmenu="handleContextMenu">
    <n-spin :show="loading">
      <template #description>加载中...</template>
      <div class="drawing-container" ref="containerRef">
        <canvas ref="canvasRef"></canvas>
      </div>
    </n-spin>

    <ImageToolbar v-if="!drawingInfo?.isCad" />
    <CADToolbar v-else />
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, nextTick, computed, onBeforeUnmount, watch, inject, Ref} from "vue";
import {useThemeVars} from 'naive-ui';
import {Hooks,DxfViewer,DxfParser} from "@astral3d/engine";
import {DrawRect} from "@/utils/drawing/drawRect";
import ImageToolbar from "./toolbar/Image.vue";
import CADToolbar from "./toolbar/CAD.vue";
import Config from "@/utils/storage/config";

const themeVars = useThemeVars();
const baseColor = computed(() => themeVars.value.baseColor);
const borderColor = computed(() => themeVars.value.borderColor);

const drawingInfo = inject("drawingInfo") as Ref<IDrawing>;

const containerRef = ref();
const canvasRef = ref();
const loading = ref(true);

function handleContextMenu(e: MouseEvent) {
  e.preventDefault();

  return false
}

function loadCadFile(canvas:HTMLCanvasElement,parentElement:HTMLDivElement){
  let dxf;

  // 实例化Dxf.Viewer
  function loadDxf() {
    const DXFViewer = new DxfViewer(dxf, canvas, parentElement.offsetWidth, parentElement.offsetHeight, () => {
      loading.value = false;
      window.DrawViewer = DXFViewer;
    });

    if (dxf.tables?.layer?.layers) {
      const bgColor = Config.getKey('cad')?.bgColor;

      if (bgColor) {
        const color = Number(bgColor);
        const contrastColor = color === 0x000000 ? 0xffffff : 0x000000;

        const l = dxf.tables.layer.layers;
        Object.keys(l).forEach(k => {
          if (l[k].color === color) {
            l[k].color = contrastColor;
          }
        })
      }
      drawingInfo.value.layers = dxf.tables.layer.layers;
    }
  }

  let notice = window.$notification.info({
    title: window.$t("drawing['Get the drawing data']") + "...",
    content: window.$t("other.Loading") + "...",
    closable: false,
  })

  // dxf 加载图纸
  const parser = new DxfParser();
  fetch(drawingInfo.value.imgSrc).then(res => res.text()).then(text => {
    notice.content = window.$t("scene['Parsing to editor']");
    dxf = parser.parse(text);
    loadDxf();

    setTimeout(() => {
      notice.destroy();
    }, 800)
  })
}

async function initCanvas() {
  if(!drawingInfo.value.imgSrc) return;

  let canvas = canvasRef.value as HTMLCanvasElement;
  const parentElement = containerRef.value as HTMLDivElement;

  if(drawingInfo.value.isCad){
    // dxf 加载图纸
    loadCadFile(canvas, parentElement);
  }else{
    // canvas 加载图片
    let bigImg = new Image();
    bigImg.src = drawingInfo.value.imgSrc;
    bigImg.onload = () => {
      const containerHeight = (containerRef.value as HTMLDivElement).offsetHeight;
      canvas.height = containerHeight;
      canvas.width = bigImg.width * (containerHeight / bigImg.height);

      canvas.style.backgroundImage = `url(${drawingInfo.value.imgSrc})`;
      canvas.style.backgroundRepeat = "no-repeat";
      canvas.style.backgroundPosition = "top left";
      canvas.style.backgroundSize = "100% 100%";

      drawingInfo.value.imgInfo = {
        width: canvas.width,
        height: canvas.height
      }

      window.DrawViewer = new DrawRect(canvas,parentElement);

      loading.value = false;
    }
  }
}

// 模型选中时反选图纸上的rect
function objectSelected(object){
  if(!object ||!window.DrawViewer) return;
  // if(!drawingInfo.isCad){
  //   window.DrawViewer?.selectRect(object.uuid);
  // }else{
  //   // 检查该模型是否已有绑定标记
  //   for (const rect of drawingInfo.markList) {
  //     if (rect.modelUuid === object.uuid) {
  //       window.DrawViewer?.selectRect(object.uuid);
  //       return;
  //     }
  //   }
  //
  //   window.DrawViewer?.selectRect(undefined);
  // }

  window.DrawViewer?.selectRect(object.uuid);
}

watch(() => drawingInfo.value.imgSrc, async () => {
  if(!canvasRef.value) return;
  const newCanvas = document.createElement("canvas");

  window.DrawViewer?.dispose();
  canvasRef.value.remove();
  canvasRef.value = null;

  containerRef.value.append(newCanvas);
  canvasRef.value = newCanvas;

  await initCanvas();
})

onMounted(async () => {
  await nextTick();
  await initCanvas();

  Hooks.useAddSignal("objectSelected", objectSelected);
})
onBeforeUnmount(() => {
  Hooks.useRemoveSignal("objectSelected", objectSelected);

  window.DrawViewer?.dispose();
  window.DrawViewer = undefined;
})
</script>

<style lang="less" scoped>
#drawing {
  overflow: hidden;
  display: flex;
  justify-content: center;

  :deep(.n-spin-container){
    width: 100%;
    height: 100%;

    .n-spin-content{
      width: 100%;
      height: 100%;
    }
  }

  .drawing-container {
    position: relative;
    margin: 0 auto;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    canvas {
      position: relative;
      transition: all 16ms;
      z-index: 10;
      width: auto;
      height: auto;
    }
  }

  .drawing-tool-bar {
    position: absolute;
    bottom: 3%;
    padding: 0.2rem 0.5rem;
    background: v-bind(baseColor);
    z-index: 999;
    border: 1px solid v-bind(borderColor);
    border-radius: 0.3rem;
    display: flex;

    :deep(.n-color-picker) {
      position: absolute;
      width: 0;
      overflow: hidden;

      &-trigger {
        border: 0;
        width: 0;
      }
    }
  }
}
</style>