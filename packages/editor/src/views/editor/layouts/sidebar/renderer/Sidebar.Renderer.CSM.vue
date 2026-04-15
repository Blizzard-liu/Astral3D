<template>
  <n-form label-placement="left" :label-width="90" label-align="left" size="small">
    <n-form-item :label="t('other.Enable')">
      <n-checkbox v-model:checked="csmConfig.enabled" @update:checked="updateEnabled"/>
    </n-form-item>

    <n-form-item :label="t('layout.sider.rendererConfig.Fade')">
      <n-checkbox v-model:checked="csmConfig.fade" :disabled="disabled"
                  @update:checked="(v) => updateProperty('fade',v)"/>
    </n-form-item>

    <n-form-item :label="t('layout.sider.rendererConfig.Shadow far')">
      <EsInputNumber v-model:value="csmConfig.maxFar" size="tiny" :show-button="false"
                     :min="0" :max="Infinity" :decimal="0" :disabled="disabled"
                     @change="(v) => updateProperty('maxFar', v)"/>
    </n-form-item>

    <n-form-item :label="t('layout.sider.rendererConfig.Frustum split mode')">
      <n-select v-model:value="csmConfig.mode" :options="csmModeOptions"
                :disabled="disabled" @update:value="(v) => updateProperty('mode', v)"/>
    </n-form-item>

    <n-form-item :label="t('layout.sider.rendererConfig.Shadow map')">
      <n-select v-model:value="csmConfig.shadowMapSize" :options="shadowMapSizeOptions"
                :disabled="disabled" @update:value="updateShadowMapSize"/>
    </n-form-item>

    <n-form-item :label="t('layout.sider.rendererConfig.Light intensity')">
      <EsInputNumber v-model:value="csmConfig.lightIntensity" size="tiny"
                     :show-button="false" :min="0" :max="Infinity" :decimal="0" :disabled="disabled"
                     @change="updateLightIntensity"/>
    </n-form-item>

    <n-form-item :label="t('layout.sider.rendererConfig.Light color')">
      <n-color-picker v-model:value="csmConfig.lightColor" :show-alpha="false" size="small"
                      @update:value="updateLightColor"/>
    </n-form-item>

    <n-form-item :label="t('layout.sider.rendererConfig.Light direction x')">
      <n-slider v-model:value="csmConfig.lightDirectionX" :step="0.001" :min="-1" :max="1"
                :disabled="disabled" @update:value="(v) => updateLightDirection('x',v)"/>
    </n-form-item>

    <n-form-item :label="t('layout.sider.rendererConfig.Light direction y')">
      <n-slider v-model:value="csmConfig.lightDirectionY" :step="0.001" :min="-1" :max="1"
                :disabled="disabled" @update:value="(v) => updateLightDirection('y', v)"/>
    </n-form-item>

    <n-form-item :label="t('layout.sider.rendererConfig.Light direction z')">
      <n-slider v-model:value="csmConfig.lightDirectionZ" :step="0.001" :min="-1" :max="1"
                :disabled="disabled" @update:value="(v) => updateLightDirection('z', v)"/>
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive} from "vue";
import {t} from "@/language";
import {App, Utils} from '@astral3d/engine';
import EsInputNumber from "@/components/es/EsInputNumber.vue";

const csmConfig = reactive(JSON.parse(JSON.stringify(App.project.getKey("csm"))));

const disabled = computed(() => !csmConfig.enabled);
//CSM mode选项
const csmModeOptions = [
  {label: "practical", value: "practical"},
  {label: "logarithmic", value: "logarithmic"},
  {label: "uniform", value: "uniform"}
];
//CSM shadowMapSize选项
const shadowMapSizeOptions = [
  {label: "256 * 256", value: 256},
  {label: "512 * 512", value: 512},
  {label: "1024 * 1024", value: 1024},
  {label: "2048 * 2048", value: 2048},
  {label: "4096 * 4096", value: 4096},
  {label: "8192 * 8192", value: 8192},
  // { label: "16384 * 16384", value: 16384 }, // 16K的选项不开发给用户
];

onMounted(() => {
  const viewerLoaded = () => {
    Utils.deepAssign(csmConfig, App.project.getKey("csm"));

    window.viewer.removeEventListener('loaded', viewerLoaded);
  }
  window.viewer.addEventListener('loaded', viewerLoaded);
});

function updateEnabled(isEnabled: boolean) {
  App.project.setKey("csm.enabled",isEnabled);
}

function updateProperty(key, value) {
  App.project.setKey(`csm.${key}`,value);
}

function updateShadowMapSize(size: 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384) {
  App.project.setKey("csm.shadowMapSize",size);
}

function updateLightColor(color: string) {
  App.project.setKey("csm.lightColor",color);
}

function updateLightIntensity(intensity: number) {
  App.project.setKey("csm.lightIntensity",intensity);
}

function updateLightDirection(direction: "x" | "y" | "z", value: number) {
  App.project.setKey(`csm.lightDirection${direction.toUpperCase()}`,value);
}
</script>

<style lang="less" scoped>

</style>