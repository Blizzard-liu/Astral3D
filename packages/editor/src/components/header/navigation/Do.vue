<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <n-button text class="mr-2" :disabled="undoDisabled" @click="handleUndo()">
        <template #icon>
          <n-icon size="22" class="cursor-pointer">
            <Undo />
          </n-icon>
        </template>
      </n-button>
    </template>
    {{ t("setting.shortcuts.Undo") + `(${Utils.IS_MAC ? 'Meta' : 'Ctrl'} + ${getUndoKey()})` }}
  </n-tooltip>

  <n-tooltip trigger="hover">
    <template #trigger>
      <n-button text class="mr-5" :disabled="redoDisabled" @click="handleRedo()">
        <template #icon>
          <n-icon size="22" class="cursor-pointer">
            <Redo />
          </n-icon>
        </template>
      </n-button>
    </template>
    {{ t("setting.shortcuts.Redo") + `(${Utils.IS_MAC ? 'Meta' : 'Ctrl'} + Shift +${getUndoKey()})` }}
  </n-tooltip>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {NIcon, NTooltip} from "naive-ui";
import {Undo,Redo} from "@vicons/carbon";
import {t} from "@/language";
import {App,Hooks,Utils} from "@astral3d/engine";

const undoDisabled = ref(true);
const redoDisabled = ref(true);

function historyChanged() {
  undoDisabled.value = App.history.undos.length === 0;
  redoDisabled.value = App.history.redos.length === 0;
}

onMounted(() => {
  Hooks.useAddSignal("historyChanged", historyChanged);

  historyChanged();
})

// 获取配置的撤销按键
function getUndoKey() {
  return (App.config.getShortcutItem('undo') || 'Z').toUpperCase();
}

//撤销
function handleUndo() {
  App.undo();
}

//重做
function handleRedo() {
  App.redo();
}
</script>

<style scoped lang="less">

</style>