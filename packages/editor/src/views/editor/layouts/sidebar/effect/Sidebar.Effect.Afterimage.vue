<script setup lang="ts">
import {computed, onMounted, reactive, toRaw} from "vue";
import {t} from "@/language";
import {App,Utils} from "@astral3d/engine";

const props = withDefaults(defineProps<{
  effectEnabled:boolean
}>(),{
  effectEnabled:false
})

const afterimage = reactive(JSON.parse(JSON.stringify(App.project.getKey("effect.Afterimage"))));
const disabled = computed(() => !props.effectEnabled || !afterimage.enabled);

onMounted(() => {
  const viewerLoaded = () => {
    Utils.deepAssign(afterimage, App.project.getKey("effect.Afterimage"));

    window.viewer.removeEventListener('loaded', viewerLoaded);
  }
  window.viewer.addEventListener('loaded', viewerLoaded);
})

function handleAfterimageConfigChange(){
  App.project.setKey(`effect.Afterimage`, toRaw(afterimage));
}
</script>

<template>
  <div class="sidebar-config-item">
    <span>{{ t(`other.Enable`) }}</span>
    <div>
      <n-checkbox size="small" v-model:checked="afterimage.enabled" :disabled="!effectEnabled" @update:checked="handleAfterimageConfigChange"/>
    </div>
  </div>

  <!-- 衰减 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.postProcessing.Damp`) }}</span>
    <div>
      <n-slider v-model:value="afterimage.damp" :step="0.001" :min="0.000" :max="1.000" :disabled="disabled" @update:value="handleAfterimageConfigChange" />
    </div>
  </div>
</template>

<style scoped lang="less">

</style>