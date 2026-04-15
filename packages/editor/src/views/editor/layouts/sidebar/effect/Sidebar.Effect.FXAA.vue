<script setup lang="ts">
import {onMounted, reactive, toRaw} from "vue";
import {t} from "@/language";
import {App,Utils} from "@astral3d/engine";

withDefaults(defineProps<{
  effectEnabled:boolean
}>(),{
  effectEnabled:false
})

const faxx = reactive(JSON.parse(JSON.stringify(App.project.getKey("effect.FXAA"))));

onMounted(() => {
  const viewerLoaded = () => {
    Utils.deepAssign(faxx, App.project.getKey("effect.FXAA"));

    window.viewer.removeEventListener('loaded', viewerLoaded);
  }
  window.viewer.addEventListener('loaded', viewerLoaded);
})

function handleFXAAConfigChange(){
  App.project.setKey(`effect.FXAA`, toRaw(faxx));
}
</script>

<template>
  <div class="sidebar-config-item">
    <span>{{ t(`other.Enable`) }}</span>
    <div>
      <n-checkbox size="small" v-model:checked="faxx.enabled" :disabled="!effectEnabled" @update:checked="handleFXAAConfigChange"/>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>