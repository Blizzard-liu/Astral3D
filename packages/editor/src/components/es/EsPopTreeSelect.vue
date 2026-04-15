<script setup lang="ts">
import {ref, onMounted, nextTick} from 'vue';
import type {TreeOption} from 'naive-ui';
import {CaretRight, CaretDown} from '@vicons/carbon';
import {findTreeNode, markLeafNodes} from "@/utils/common/utils";

const props = withDefaults(defineProps<{
  trigger?: 'hover' | 'click' | 'focus' | 'manual',
  options: TreeOption[],
  value: string | number
}>(), {
  trigger: "hover",
  options: () => [],
  value: ""
})

const emits = defineEmits(['update:value', "select", "show","click"]);

const selectKey = ref(props.value);
const selectOption = ref<TreeOption | null>(null);
const treeShow = ref(false);
const treeNodeProps = ({ option }: { option: TreeOption }) => {
  return {
    onClick() {
      emits("click", option);
    }
  }
}

onMounted(async () => {
  await nextTick();

  markLeafNodes(props.options);

  selectOption.value = findTreeNode(props.options, selectKey.value);
})

function handleTreeShowChange(show: boolean) {
  treeShow.value = show;

  emits("show", show);
}

function handleTreeSelect(keys: Array<string | number>) {
  emits("update:value", keys[0]);

  selectKey.value = keys[0];
  selectOption.value = findTreeNode(props.options, selectKey.value);

  emits("select", selectOption.value, props.options);
}
</script>

<template>
  <n-button v-bind="$attrs" @click="emits('click',selectOption)">
    <template #icon>
      <n-popover placement="bottom" :trigger="trigger" @update:show="handleTreeShowChange">
        <template #trigger>
          <n-icon>
            <CaretRight v-if="!treeShow"/>
            <CaretDown v-else/>
          </n-icon>
        </template>

        <n-tree :data="options" block-line @update:selected-keys="handleTreeSelect"
                default-expand-all :default-selected-keys="[value]" :cancelable="false"
                :indent="18" :node-props="treeNodeProps"/>
      </n-popover>

    </template>

    {{ selectOption?.label || "" }}
  </n-button>
</template>

<style scoped lang="less">

</style>