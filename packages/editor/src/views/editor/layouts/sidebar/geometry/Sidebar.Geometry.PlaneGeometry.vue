<script setup lang="ts">
import {reactive, onMounted} from "vue";
import {PlaneGeometry} from "three";
import {SetGeometryCommand,App} from '@astral3d/engine';
import {t} from "@/language";
import EsInputNumber from "@/components/es/EsInputNumber.vue";

let objectData = reactive({
  width: 1.00,
  height: 1.00,
  widthSegments:1,
  heightSegments:1,
})

onMounted(() => {
  // @ts-ignore
  const geometry = App.selected?.geometry;
  if(!geometry) return;

  const parameters = geometry.parameters;
  Object.keys(parameters).forEach(key => {
    objectData[key] = parameters[key]
  })
})

function update() {
  if(!App.selected) return;

  // @ts-ignore
  App.execute(new SetGeometryCommand(App.selected, new PlaneGeometry(
      objectData.width,
      objectData.height,
      objectData.widthSegments,
      objectData.heightSegments
  )))
}
</script>

<template>
  <div>
    <n-divider/>

    <!--  width  -->
    <div class="sider-scene-geometry-item">
      <span>{{ t("layout.sider.scene.Width") }}</span>

      <EsInputNumber v-model:value="objectData.width" class="!w-90px" size="small" :decimal="2"
                     :show-button="false" @change="update()"/>
    </div>

    <!--  height  -->
    <div class="sider-scene-geometry-item">
      <span>{{ t("layout.sider.scene.Height") }}</span>

      <EsInputNumber v-model:value="objectData.height" class="!w-90px" size="small" :decimal="2"
                     :show-button="false" @change="update()"/>
    </div>

    <!--  widthSegments  -->
    <div class="sider-scene-geometry-item">
      <span>{{ t("layout.sider.scene['Width segments']") }}</span>

      <EsInputNumber v-model:value="objectData.widthSegments" class="!w-90px" size="small" :decimal="0" :min="1"
                     :show-button="false" @change="update()"/>
    </div>

    <!--  heightSegments  -->
    <div class="sider-scene-geometry-item">
      <span>{{ t("layout.sider.scene['Height segments']") }}</span>

      <EsInputNumber v-model:value="objectData.heightSegments" class="!w-90px" size="small" :decimal="0" :min="1"
                     :show-button="false" @change="update()"/>
    </div>
  </div>
</template>