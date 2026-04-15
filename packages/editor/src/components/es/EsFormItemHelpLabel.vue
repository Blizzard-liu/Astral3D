<script setup lang="ts">
import {Help} from '@vicons/carbon';

withDefaults(defineProps<{
  label:string
}>(),{
  label:""
})
</script>

<template>
  <div class="flex items-center justify-end">
    <span>{{ label }}</span>

    <n-tooltip trigger="hover">
      <template #trigger>
        <n-icon :size="16" :depth="3" class="ml-5px mb-1px cursor-pointer">
          <Help />
        </n-icon>
      </template>

      <slot></slot>
    </n-tooltip>
  </div>
</template>

<style scoped lang="less">

</style>