<template>
  <div class="extra-pane-item">
    <div class="extra-pane-item-header">
      <n-button quaternary size="tiny" :disabled="!logs.length"
                @click="handleClearLogs" class="mr-2">{{ t("layout.header.Clear Out") }}
      </n-button>
    </div>

    <div class="extra-pane-item-content">
      <n-list v-if="logs.length" hoverable clickable>
        <n-list-item v-for="log in logs" :key="log.id" @contextmenu="(e) => handleContextMenu(e, log)">
          <n-text depth="3" class="text-12px mr-2 no-wrap h-22px flex-center">
            {{ log.time }}
          </n-text>

          <span class="inline-block min-w-55px">
                        <n-tag :type="getType(log.level)" size="small">
                            {{ log.level }}
                        </n-tag>
                    </span>

          <n-text :type="getType(log.level)" depth="2" class="astral-log-message inline-block inline-block">
            {{ log.message }}
          </n-text>
        </n-list-item>
      </n-list>

      <n-empty v-else description="Empty" class="flex-center h-full"/>

      <EsContextmenu ref="contextmenuRef" placement="right" trigger="manual" size="small"
                     :options="contextmenuOptions" @select="handleContextmenuSelect"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount} from 'vue';
import {Hooks, Utils} from '@astral3d/engine';
import {t} from "@/language";
import {copyToClipboard} from "@/utils/common/utils";

const logs = ref<Utils.ILog[]>([]);
let selectedLog: Utils.ILog | null = null;
const contextmenuRef = ref();
const contextmenuOptions = [
  {
    label: t("other.Copy"),
    key: 'copy'
  },
  {
    label: t("home.Delete"),
    key: 'delete'
  }
];

onMounted(() => {
  logs.value = [...Utils.logger.logs]
  Hooks.useAddSignal("addLog", addLog);
})

onBeforeUnmount(() => {
  Hooks.useRemoveSignal("addLog", addLog);
})

function addLog(log: Utils.ILog, _logs: Utils.ILog[]) {
  logs.value.unshift(log);
}

function getType(level: string) {
  switch (level) {
    case "trace":
      return "primary";
    case "debug":
      return "info";
    case "info":
      return "default";
    case "warn":
      return "warning";
    case "error":
      return "error";
  }
}

function handleContextMenu(e: MouseEvent, log: Utils.ILog) {
  e.preventDefault();

  selectedLog = log;

  contextmenuRef.value.show(e.clientX, e.clientY);
}

function handleContextmenuSelect(key: string) {
  switch (key) {
    case "copy":
      if (selectedLog) {
        copyToClipboard(selectedLog?.message).then((msg: string) => {
          window.$message?.success(msg);
        }).catch((msg: string) => {
          window.$message?.error(msg);
        });
      }
      break;
    case "delete":
      logs.value = logs.value.filter(l => l.id !== selectedLog?.id);
      Hooks.useDispatchSignal("deleteLog", selectedLog);
      selectedLog = null;
      break;
  }
}

// 清空
function handleClearLogs() {
  logs.value = [];
  Hooks.useDispatchSignal("clearLogs");
}
</script>

<style scoped lang="less">
.extra-pane-item-header {
  justify-content: end !important;
}

.n-list-item {
  padding: 0.4rem 0.6rem !important;

  :deep(.n-list-item__main) {
    display: flex;
    align-items: self-start;
  }
}

.astral-log-message {
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
}
</style>
