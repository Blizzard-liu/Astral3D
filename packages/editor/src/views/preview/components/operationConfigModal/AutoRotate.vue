<script setup lang="ts">
import { ref, watch } from 'vue';
import {t} from "@/language";
import { usePreviewOperationStore } from "@/store/modules/previewOperation";

const operationStore = usePreviewOperationStore();

const showModal = ref(false);

watch(() => operationStore.menuList.autoRotate.active, (newVal:boolean) => {
  showModal.value = newVal;
})

function handleClose(){
  showModal.value = false;
}
</script>

<template>
  <n-card v-if="showModal" :title="t('preview.Auto rotation')" closable @close="handleClose" size="small" :segmented="{
      content: true,
      footer: 'soft'
    }">
    <div class="flex w-full">
      <span class="w-30%">{{ t("preview.Rotational speed") }}</span>
      <n-slider v-model:value="operationStore.autoRotateSpeed" :step="1" :min="1" :max="100"
                class="w-50%" />
      <n-text code class="w-18% ml-2% text-align-center">{{operationStore.autoRotateSpeed}}</n-text>
    </div>
  </n-card>
</template>

<style scoped lang="less">

</style>