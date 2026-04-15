<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <n-button text class="mr-2" :disabled="disabled" @click="handleDelete()">
        <template #icon>
          <n-icon size="22" class="cursor-pointer">
            <Delete />
          </n-icon>
        </template>
      </n-button>
    </template>
    {{ t("layout.header.Delete(Del)") }}
  </n-tooltip>
</template>

<script setup lang="ts">
import {ref,onMounted} from "vue";
import {Delete} from "@vicons/carbon";
import {NIcon, NTooltip} from "naive-ui";
import {t} from "@/language";
import {App,Hooks,RemoveObjectCommand} from "@astral3d/engine";

const disabled = ref(true);

function objectSelected(object){
    disabled.value = object === null;
}

onMounted(() => {
  Hooks.useAddSignal("objectSelected",objectSelected)
})

function handleDelete() {
  const object = App.selected;

  if (object !== null && object.parent !== null) {
    App.execute(new RemoveObjectCommand(object));
  }
}
</script>

<style scoped lang="less">

</style>