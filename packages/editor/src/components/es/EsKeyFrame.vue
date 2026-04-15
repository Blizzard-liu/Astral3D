<script setup lang="ts">
import {ConditionPoint} from '@vicons/carbon';
import {t} from "@/language";
import {useAnimationStore} from "@/store/modules/animation";

withDefaults(defineProps<{
  label: string,
  attr: string
}>(), {
  label: "",
  attr: ""
})

const {addKeyframe} = useAnimationStore();
</script>

<template>
  <span class="flex items-center">
    <n-tooltip trigger="hover">
      <template #trigger>
        <n-button text @click="addKeyframe(attr)">
          <template #icon>
            <n-icon size="12">
              <ConditionPoint/>
            </n-icon>
          </template>
        </n-button>
      </template>
      {{ t("extra.Add keyframe") }}
    </n-tooltip>
    <label>{{ label }}</label>
  </span>
</template>

<style scoped lang="less">

</style>