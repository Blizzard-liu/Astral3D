<script setup lang="ts">
import {computed, onMounted, reactive, toRaw} from "vue";
import {t} from "@/language";
import {App,Utils} from "@astral3d/engine";

const props = withDefaults(defineProps<{
  effectEnabled:boolean
}>(),{
  effectEnabled:false
})

const pixelate = reactive(JSON.parse(JSON.stringify(App.project.getKey("effect.Pixelate"))));
const disabled = computed(() => !props.effectEnabled || !pixelate.enabled);

onMounted(() => {
  const viewerLoaded = () => {
    Utils.deepAssign(pixelate, App.project.getKey("effect.Pixelate"));

    window.viewer.removeEventListener('loaded', viewerLoaded);
  }
  window.viewer.addEventListener('loaded', viewerLoaded);
})

function handlePixelateConfigChange(){
  App.project.setKey(`effect.Pixelate`, toRaw(pixelate));
}
</script>

<template>
  <div class="sidebar-config-item">
    <span>{{ t(`other.Enable`) }}</span>
    <div>
      <n-checkbox size="small" v-model:checked="pixelate.enabled" :disabled="!effectEnabled" @update:checked="handlePixelateConfigChange"/>
    </div>
  </div>

  <!-- 像素大小 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.postProcessing.PixelSize`) }}</span>
    <div>
      <n-slider v-model:value="pixelate.pixelSize" :step="1" :min="1" :max="16" :disabled="disabled" @update:value="handlePixelateConfigChange" />
    </div>
  </div>

  <!-- 法向边缘强度 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.postProcessing.NormalEdgeStrength`) }}</span>
    <div>
      <n-slider v-model:value="pixelate.normalEdgeStrength" :step="0.05" :min="0" :max="2" :disabled="disabled" @update:value="handlePixelateConfigChange" />
    </div>
  </div>

  <!-- 深度边缘强度 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.postProcessing.DepthEdgeStrength`) }}</span>
    <div>
      <n-slider v-model:value="pixelate.depthEdgeStrength" :step="0.05" :min="0" :max="1" :disabled="disabled" @update:value="handlePixelateConfigChange" />
    </div>
  </div>
</template>

<style scoped lang="less">

</style>