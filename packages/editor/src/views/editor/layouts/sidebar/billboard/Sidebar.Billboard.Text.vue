<script setup lang="ts">
import {computed} from "vue";
import {t} from "@/language";
import {getDefaultBillboardOptions} from "@astral3d/engine";

const props = withDefaults(defineProps<{
  data: IBillboard.options['text']
}>(), {
  data: () => getDefaultBillboardOptions().text
})

const emits = defineEmits(['update']);

const disabled = computed(() => !props.data.visible);
const isItalic = computed(() => props.data.fontStyle !== "normal");

function handleUpdateItalic(value: boolean){
  props.data.fontStyle = value ? "italic" : "normal";
  update("fontStyle");
}

function update(key: string){
  emits('update', "text", key);
}
</script>

<template>
  <!-- 是否启用 -->
  <div class="sidebar-config-item">
    <span>{{ t(`other.Enable`) }}</span>

    <n-checkbox size="small" v-model:checked="data.visible" @update:checked="update('visible')" />
  </div>

  <!-- 文字内容 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.billboard.Content`) }}</span>

    <n-input size="small" type="textarea" v-model:value="data.value" :disabled="disabled" placeholder="" @update:value="update('value')" />
  </div>

  <!-- 字体大小 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.billboard.Size`) }}</span>
    <EsInputNumber v-model:value="data.fontSize" :disabled="disabled" size="small"
                   :show-button="false" :min="0" :max="Infinity" :decimal="0" @change="update('fontSize')" />
  </div>

  <!-- 颜色 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.billboard.Color`) }}</span>
    <n-color-picker v-model:value="data.fontColor" :disabled="disabled" :show-alpha="false" size="small" @update:value="update('fontColor')" />
  </div>

  <!-- 字体粗细 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.billboard.Weight`) }}</span>
    <n-select v-model:value="data.fontWeight" size="small" :options="[
        {label: 100, value: 100},
        {label: 200, value: 200},
        {label: 300, value: 300},
        {label: 400, value: 400},
        {label: 500, value: 500},
        {label: 600, value: 600},
        {label: 700, value: 700},
        {label: 800, value: 800},
        {label: 900, value: 900}
    ]" :disabled="disabled" @update:value="update('fontWeight')" />
  </div>

  <!-- 字体倾斜 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.billboard.Italic`) }}</span>

    <n-checkbox size="small" v-model:checked="isItalic" :disabled="disabled" @update:checked="handleUpdateItalic" />
  </div>

  <!-- 行间距 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.billboard.Line gap`) }}</span>
    <EsInputNumber v-model:value="data.lineGap" :disabled="disabled" size="small"
                   :show-button="false" :min="0" :max="Infinity" :decimal="0" @change="update('lineGap')" />
  </div>

  <!-- 内边距 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.billboard.Padding`) }}</span>
    <EsInputNumber v-model:value="data.padding" :disabled="disabled" size="small"
                   :show-button="false" :min="0" :max="Infinity" :decimal="0" @change="update('padding')" />
  </div>

  <!-- 水平对齐 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.billboard.Align`) }}</span>
    <n-select v-model:value="data.align" size="small" :options="[
        {label: t('layout.sider.billboard.Left'), value: 'left'},
        {label: t('layout.sider.billboard.Right'), value: 'right'},
        {label: t('layout.sider.billboard.Center'), value: 'center'}
    ]" :disabled="disabled" @update:value="update('align')" />
  </div>

  <!-- 垂直对齐 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.billboard.Vertical align`) }}</span>
    <n-select v-model:value="data.baseline" size="small" :options="[
        {label: 'top', value: 'top'},
        {label: 'middle', value: 'middle'},
        {label: 'bottom', value: 'bottom'},
        {label: 'alphabetic', value: 'alphabetic'},
        {label: 'hanging', value: 'hanging'},
        {label: 'ideographic', value: 'ideographic'},
    ]" :disabled="disabled" @update:value="update('baseline')" />
  </div>

  <!-- 描边宽度 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.billboard.Stroke width`) }}</span>
    <EsInputNumber v-model:value="data.strokeWidth" :disabled="disabled" size="small"
                   :show-button="false" :min="0" :max="Infinity" :decimal="0" @change="update('strokeWidth')" />
  </div>

  <!-- 描边颜色 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.billboard.Stroke color`) }}</span>
    <n-color-picker v-model:value="data.strokeColor" :disabled="disabled" :show-alpha="false" size="small" @update:value="update('strokeColor')" />
  </div>

  <!-- 背景填充 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.billboard.Fill`) }}</span>
    <n-checkbox size="small" v-model:checked="data.fill" :disabled="disabled" @update:checked="update('fill')" />
  </div>

  <!-- 填充颜色 -->
  <div class="sidebar-config-item">
    <span>{{ t(`layout.sider.billboard.Fill color`) }}</span>
    <n-color-picker v-model:value="data.fillColor" :disabled="disabled || !data.fill" :show-alpha="false" size="small" @update:value="update('fillColor')" />
  </div>
</template>

<style scoped lang="less">

</style>