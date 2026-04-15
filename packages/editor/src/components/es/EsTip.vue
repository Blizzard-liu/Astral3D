<script setup lang="ts">
import {AlertCircleOutline} from '@vicons/ionicons5';

withDefaults(defineProps<{
  size?: string,
  content?: string,
  trigger?: 'click' | 'hover' | 'focus' | 'manual',
  placement?: 'top-start' | 'top' | 'top-end' | 'right-start' | 'right' | 'right-end' | 'bottom-start' | 'bottom' | 'bottom-end' | 'left-start' | 'left' | 'left-end'
}>(), {
  size: '18',
  content: '',
  trigger: "hover",
  placement: 'top'
})
</script>

<template>
    <span class="flex items-center justify-center cursor-pointer">
        <span v-if="content" class="mr-2px">{{ content }}</span>
        <n-tooltip :trigger="trigger" :placement="placement">
            <template #trigger>
                <n-icon :size="size">
                    <AlertCircleOutline/>
                </n-icon>
            </template>
            <slot></slot>
        </n-tooltip>
    </span>
</template>