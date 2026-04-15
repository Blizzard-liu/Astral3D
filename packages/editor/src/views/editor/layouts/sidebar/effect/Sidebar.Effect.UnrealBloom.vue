<script setup lang="ts">
import {computed, onMounted, reactive, toRaw} from "vue";
import {t} from "@/language";
import {App,Utils} from "@astral3d/engine";

const props = withDefaults(defineProps<{
  effectEnabled:boolean
}>(),{
  effectEnabled:false
})

const unrealBloom = reactive(JSON.parse(JSON.stringify(App.project.getKey("effect.UnrealBloom"))));
const disabled = computed(() => !props.effectEnabled || !unrealBloom.enabled);

onMounted(() => {
  const viewerLoaded = () => {
    Utils.deepAssign(unrealBloom, App.project.getKey("effect.UnrealBloom"));

    window.viewer.removeEventListener('loaded', viewerLoaded);
  }
  window.viewer.addEventListener('loaded', viewerLoaded);
})

function handleUnrealBloomConfigChange(){
  App.project.setKey(`effect.UnrealBloom`, toRaw(unrealBloom));
}
</script>

<template>
  <div class="sidebar-config-item">
    <span>{{ t(`other.Enable`) }}</span>
    <div>
      <n-checkbox size="small" v-model:checked="unrealBloom.enabled" :disabled="!effectEnabled" @update:checked="handleUnrealBloomConfigChange"/>
    </div>
  </div>

  <!-- 光晕半径 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.postProcessing.Radius`) }}</span>
    <div>
      <n-slider v-model:value="unrealBloom.radius" :step="0.01" :min="0.00" :max="1.00" :disabled="disabled" @update:value="handleUnrealBloomConfigChange" />
    </div>
  </div>

  <!-- 光晕阈值 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.postProcessing.Threshold`) }}</span>
    <div>
      <n-slider v-model:value="unrealBloom.threshold" :step="0.01" :min="0.00" :max="1.00" :disabled="disabled" @update:value="handleUnrealBloomConfigChange" />
    </div>
  </div>

  <!-- 光晕强度 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.postProcessing.Strength`) }}</span>
    <div>
      <n-slider v-model:value="unrealBloom.strength" :step="0.01" :min="0.00" :max="3.00" :disabled="disabled" @update:value="handleUnrealBloomConfigChange" />
    </div>
  </div>
</template>

<style scoped lang="less">

</style>