<template>
  <n-select size="small" v-bind="attrs" v-model:value="selected" @update:value="update" :options="options"/>
</template>

<script setup lang="ts">
import {ref,useAttrs} from "vue";
import {t} from "@/language";

const props =withDefaults(defineProps<{
  value: string
}>(), {
  value: ''
})
const emits = defineEmits(["update:value"])

const attrs = useAttrs();
const selected = ref(props.value);
const options = [
  { label: t('layout.sider.particle.Ease linear'), value: 'easeLinear' },
  { label: t('layout.sider.particle.Ease in quad'), value: 'easeInQuad' },
  { label: t('layout.sider.particle.Ease out quad'), value: 'easeOutQuad' },
  { label: t('layout.sider.particle.Ease in out quad'), value: 'easeInOutQuad' },
  { label: t('layout.sider.particle.Ease in cubic'), value: 'easeInCubic' },
  { label: t('layout.sider.particle.Ease out cubic'), value: 'easeOutCubic' },
  { label: t('layout.sider.particle.Ease in out cubic'), value: 'easeInOutCubic' },
  { label: t('layout.sider.particle.Ease in quart'), value: 'easeInQuart' },
  { label: t('layout.sider.particle.Ease out quart'), value: 'easeOutQuart' },
  { label: t('layout.sider.particle.Ease in out quart'), value: 'easeInOutQuart' },
  { label: t('layout.sider.particle.Ease in sine'), value: 'easeInSine' },
  { label: t('layout.sider.particle.Ease out sine'), value: 'easeOutSine' },
  { label: t('layout.sider.particle.Ease in out sine'), value: 'easeInOutSine' },
  { label: t('layout.sider.particle.Ease in expo'), value: 'easeInExpo' },
  { label: t('layout.sider.particle.Ease out expo'), value: 'easeOutExpo' },
  { label: t('layout.sider.particle.Ease in out expo'), value: 'easeInOutExpo' },
  { label: t('layout.sider.particle.Ease in circ'), value: 'easeInCirc' },
  { label: t('layout.sider.particle.Ease out circ'), value: 'easeOutCirc' },
  { label: t('layout.sider.particle.Ease in out circ'), value: 'easeInOutCirc' },
  { label: t('layout.sider.particle.Ease in back'), value: 'easeInBack' },
  { label: t('layout.sider.particle.Ease out back'), value: 'easeOutBack' },
  { label: t('layout.sider.particle.Ease in out back'), value: 'easeInOutBack' }
];

function update(value: string) {
  emits("update:value", value);
}
</script>

<style scoped lang="less">

</style>