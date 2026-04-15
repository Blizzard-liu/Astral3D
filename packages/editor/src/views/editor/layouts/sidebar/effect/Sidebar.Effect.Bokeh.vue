<script setup lang="ts">
import {computed, onMounted, reactive, toRaw} from "vue";
import {t} from "@/language";
import {App,Utils} from "@astral3d/engine";

const props = withDefaults(defineProps<{
  effectEnabled:boolean
}>(),{
  effectEnabled:false
})

const bokeh = reactive(JSON.parse(JSON.stringify(App.project.getKey("effect.Bokeh"))));
const disabled = computed(() => !props.effectEnabled || !bokeh.enabled);

onMounted(() => {
  const viewerLoaded = () => {
    Utils.deepAssign(bokeh, App.project.getKey("effect.Bokeh"));

    window.viewer.removeEventListener('loaded', viewerLoaded);
  }
  window.viewer.addEventListener('loaded', viewerLoaded);
})

function handleBokehConfigChange(){
  App.project.setKey(`effect.Bokeh`, toRaw(bokeh));
}
</script>

<template>
  <div class="sidebar-config-item">
    <span>{{ t(`other.Enable`) }}</span>
    <div>
      <n-checkbox size="small" v-model:checked="bokeh.enabled" :disabled="!effectEnabled" @update:checked="handleBokehConfigChange"/>
    </div>
  </div>

  <!-- 焦距 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.postProcessing.Focus`) }}</span>
    <div>
      <n-slider v-model:value="bokeh.focus" :step="10" :min="10" :max="3000" :disabled="disabled" @update:value="handleBokehConfigChange" />
    </div>
  </div>

  <!-- 孔径 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.postProcessing.Aperture`) }}</span>
    <div>
      <n-slider v-model:value="bokeh.aperture" :step="0.000001" :min="0" :max="0.0001" :disabled="disabled"
                @update:value="handleBokehConfigChange" :format-tooltip="(value: number) => `${value * 10000}`" />
    </div>
  </div>

  <!-- 最大模糊 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.postProcessing.MaxBlur`) }}</span>
    <div>
      <n-slider v-model:value="bokeh.maxblur" :step="0.001" :min="0.0" :max="0.01" :disabled="disabled" @update:value="handleBokehConfigChange" />
    </div>
  </div>
</template>

<style scoped lang="less">

</style>