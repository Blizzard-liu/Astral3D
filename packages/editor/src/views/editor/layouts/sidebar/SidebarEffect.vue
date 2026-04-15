<script setup lang="ts">
import {onMounted, ref} from "vue";
import {CaretForwardOutline} from "@vicons/ionicons5";
import {t} from "@/language";
import {App} from "@astral3d/engine";
import OutLine from './effect/Sidebar.Effect.Outline.vue';
import FXAA from './effect/Sidebar.Effect.FXAA.vue';
import UnrealBloom from './effect/Sidebar.Effect.UnrealBloom.vue';
import LUT from './effect/Sidebar.Effect.LUT.vue';
import Afterimage from './effect/Sidebar.Effect.Afterimage.vue';
import Bokeh from './effect/Sidebar.Effect.Bokeh.vue';
import Pixelate from './effect/Sidebar.Effect.Pixelate.vue';
import Halftone from './effect/Sidebar.Effect.Halftone.vue';
import EsTip from "@/components/es/EsTip.vue";

const effectEnabled = ref(App.project.getKey("effect.enabled"));

onMounted(() => {
  const viewerLoaded = () => {
    effectEnabled.value = App.project.getKey("effect.enabled");

    window.viewer.removeEventListener('loaded', viewerLoaded);
  }
  window.viewer.addEventListener('loaded', viewerLoaded);
})

function handleEffectEnabledChange(value:boolean){
  App.project.setKey("effect.enabled",value);
}
</script>

<template>
  <div class="flex items-center justify-between">
    <h4>{{ t('layout.sider.Post processing') }}</h4>
    <n-switch v-model:value="effectEnabled" @update:value="handleEffectEnabledChange">
      <template #checked>
        {{ t("other.Open") }}
      </template>
      <template #unchecked>
        {{ t("other.Close") }}
      </template>
    </n-switch>
  </div>

  <n-divider class="!my-3" />

  <n-collapse display-directive="show" :default-expanded-names="['Anti-aliasing','Outline','UnrealBloom']">
    <template #arrow>
      <n-icon>
        <CaretForwardOutline />
      </n-icon>
    </template>

    <!--  抗锯齿  -->
    <n-collapse-item :title="t('layout.sider.postProcessing[\'Anti-aliasing\']')" name="Anti-aliasing">
      <FXAA :effect-enabled="effectEnabled" />
    </n-collapse-item>

    <!--  Outline:描边线  -->
    <n-collapse-item :title="t('layout.sider.postProcessing.Outline')" name="Outline">
      <OutLine :effect-enabled="effectEnabled" />
    </n-collapse-item>

    <!--  UnrealBloom:仿UE辉光  -->
    <n-collapse-item :title="t('layout.sider.postProcessing.Glow')" name="UnrealBloom">
      <UnrealBloom :effect-enabled="effectEnabled" />
    </n-collapse-item>

    <!--  LUT:颜色滤镜  -->
    <n-collapse-item :title="t('layout.sider.postProcessing.LUT Color filter')" name="LUT">
      <LUT :effect-enabled="effectEnabled" />
    </n-collapse-item>

    <!--  运动残影  -->
    <n-collapse-item :title="t('layout.sider.postProcessing.Afterimage')" name="Afterimage">
      <Afterimage :effect-enabled="effectEnabled" />
    </n-collapse-item>

    <!--  Bokeh:变焦  -->
    <n-collapse-item :title="t('layout.sider.postProcessing.Bokeh')" name="Bokeh">
      <Bokeh :effect-enabled="effectEnabled" />
    </n-collapse-item>

    <!--  Pixelate:像素风  -->
    <n-collapse-item name="Pixelate">
      <template #header>
        <n-text>
          <EsTip class="!justify-start" :content="t(`layout.sider.postProcessing.Pixelate`)">
            {{ t(`layout.sider.postProcessing.Use a solid color background to achieve the best rendering effect`) }}
          </EsTip>
        </n-text>
      </template>

      <Pixelate :effect-enabled="effectEnabled" />
    </n-collapse-item>

    <!--  Halftone:半色调  -->
    <n-collapse-item :title="t('layout.sider.postProcessing.Halftoning')" name="Halftoning">
      <Halftone :effect-enabled="effectEnabled" />
    </n-collapse-item>
  </n-collapse>
</template>

<style lang="less">
</style>