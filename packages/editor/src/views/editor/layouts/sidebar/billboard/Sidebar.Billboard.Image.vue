<script setup lang="ts">
import {computed} from "vue";
import {t} from "@/language";
import {getDefaultBillboardOptions} from "@astral3d/engine";

const props = withDefaults(defineProps<{
  data: IBillboard.options['image']
}>(), {
  data: () => getDefaultBillboardOptions().image
})

const emits = defineEmits(['update']);

const disabled = computed(() => !props.data.visible);

function update(key: string){
  emits('update', "image", key);
}
</script>

<template>
  <!-- 是否启用 -->
  <div class="sidebar-config-item">
    <span>{{ t(`other.Enable`) }}</span>

    <n-checkbox size="small" v-model:checked="data.visible" @update:checked="update('visible')" />
  </div>

  <!-- 是否置顶 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.billboard.Set top`) }}</span>

    <n-checkbox size="small" v-model:checked="data.top" :disabled="disabled" @update:checked="update('top')" />
  </div>

  <!-- 宽度 -->
  <div class="sidebar-config-item">
    <span>{{ t(`other.Width`) }}</span>
    <EsInputNumber v-model:value="data.width" :disabled="disabled" size="small"
                   :show-button="false" :min="0" :max="Infinity" :decimal="0" @change="update('width')" />
  </div>

  <!-- 高度 -->
  <div class="sidebar-config-item">
    <span>{{ t(`other.Height`) }}</span>
    <EsInputNumber v-model:value="data.height" :disabled="disabled" size="small"
                   :show-button="false" :min="0" :max="Infinity" :decimal="0" @change="update('height')" />
  </div>

  <!-- 旋转 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.particle.Rotate`) }}</span>
    <n-slider v-model:value="data.rotate" :step="1" :min="0" :max="360" :disabled="disabled" @update:value="update('rotate')" />
  </div>

  <!-- 间距 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.billboard.Margin`) }}</span>
    <EsInputNumber v-model:value="data.margin" :disabled="disabled" size="small"
                   :show-button="false" :min="0" :max="Infinity" :decimal="0" @change="update('margin')" />
  </div>

  <!-- 图片位置 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.billboard.Position`) }}</span>
    <n-select v-model:value="data.position" size="small" :options="[
        {label: t('layout.sider.billboard.Left'), value: 'left'},
        {label: t('layout.sider.billboard.Right'), value: 'right'},
        {label: t('layout.sider.billboard.Top'), value: 'top'},
        {label: t('layout.sider.billboard.Bottom'), value: 'bottom'},
        {label: t('layout.sider.billboard.Center'), value: 'center'}
    ]" :disabled="disabled" @update:value="update('position')" />
  </div>
</template>

<style scoped lang="less">

</style>