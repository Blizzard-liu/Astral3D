<script setup lang="ts">
import {computed, onMounted, reactive, toRaw} from "vue";
import {t} from "@/language";
import {App,Utils,LUTEffectMap} from "@astral3d/engine";

const props = withDefaults(defineProps<{
  effectEnabled:boolean
}>(),{
  effectEnabled:false
})

const lut = reactive(JSON.parse(JSON.stringify(App.project.getKey("effect.LUT"))));
const disabled = computed(() => !props.effectEnabled || !lut.enabled);

const lutOptions = Object.keys(LUTEffectMap).map(key => ({label:key, value:key}));

onMounted(() => {
  const viewerLoaded = () => {
    Utils.deepAssign(lut, App.project.getKey("effect.LUT"));

    window.viewer.removeEventListener('loaded', viewerLoaded);
  }
  window.viewer.addEventListener('loaded', viewerLoaded);
})

function handleLUTConfigChange(){
  App.project.setKey(`effect.LUT`, toRaw(lut));
}
</script>

<template>
  <div class="sidebar-config-item">
    <span>{{ t(`other.Enable`) }}</span>
    <div>
      <n-checkbox size="small" v-model:checked="lut.enabled" :disabled="!effectEnabled" @update:checked="handleLUTConfigChange"/>
    </div>
  </div>

  <!-- LUT -->
  <div class="sidebar-config-item">
    <span>LUT</span>
    <div>
      <n-select v-model:value="lut.lut" :options="lutOptions"  :disabled="disabled" @update:value="handleLUTConfigChange" />
    </div>
  </div>

  <!-- 强度 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.postProcessing.Intensity`) }}</span>
    <div>
      <n-slider v-model:value="lut.intensity" :step="0.01" :min="0.00" :max="1.00" :disabled="disabled" @update:value="handleLUTConfigChange" />
    </div>
  </div>
</template>

<style scoped lang="less">

</style>