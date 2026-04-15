<template>
  <div class="flex items-center justify-between mb-10px">
    <h4>{{ t("layout.sider.History") }}</h4>
    <div class="flex items-center">
      <n-switch v-model:value="persistent" @update:value="persistentChange">
        <template #checked>{{ t("layout.sider.history.persistent") }}</template>
        <template #unchecked>{{ t("layout.sider.history.persistent") }}</template>
      </n-switch>
    </div>
  </div>

  <n-card hoverable embedded content-class="!p-0 min-h-30vh max-h-80vh overflow-y-auto bg-red" :content-style="`background-color:${themeVars.inputColorDisabled};`">
    <n-menu :options="historyList" label-field="name" key-field="id" :indent="15"
            :value="selectedHistory.id" @update:value="historyItemClick"/>
  </n-card>

  <div class="w-full text-center mt-2">
    <n-button type="primary" size="small" class="w-24" @click="clearHistory">
      {{ t('layout.sider.history.Clear History') }}
    </n-button>
  </div>

</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";
import {NButton, useThemeVars} from "naive-ui";
import {Hooks,App} from "@astral3d/engine";
import {t} from "@/language";

interface IHistoryItem {
  name: string,
  id: string,
  opacity?: number
}

const themeVars = useThemeVars();

let ignoreObjectSelectedSignal = false;
const historyList = ref<Array<IHistoryItem>>([]);
const selectedHistory = ref<IHistoryItem>({name: "", id: ''});
//历史记录 -> 本地存储
const persistent = ref<boolean>(App.config.getKey('history'));

onMounted(() => {
  refreshUI();

  Hooks.useAddSignal("sceneCleared", refreshUI);
  Hooks.useAddSignal("historyChanged", refreshUI);
  Hooks.useAddSignal("historyChanged", historyChanged);
})
onBeforeUnmount(() => {
  Hooks.useRemoveSignal("sceneCleared", refreshUI);
  Hooks.useRemoveSignal("historyChanged", refreshUI);
  Hooks.useRemoveSignal("historyChanged", historyChanged);
})

function refreshUI(){
  const options: any = [];

  ((objects) => {
    for (let i = 0, l = objects.length; i < l; i++) {
      const object = objects[i];
      options.push({
        name: object.name,
        id: object.id
      });
    }
  })(App.history.undos);

  ((objects) => {
    for (let i = objects.length - 1; i >= 0; i--) {
      const object = objects[i];
      options.push({
        name: object.name,
        id: object.id,
        opacity: 0.3
      });
    }
  })(App.history.redos);

  historyList.value = options;
}

function historyChanged(cmd:IHistoryItem | undefined){
  if (ignoreObjectSelectedSignal) return;
  selectedHistory.value = cmd !== undefined ? cmd : {name: "", id: ''};
}

function historyItemClick(_key: string,item:IHistoryItem) {
  selectedHistory.value = item;
  ignoreObjectSelectedSignal = true;
  App.history.goToState(parseInt(selectedHistory.value.id));
  ignoreObjectSelectedSignal = false;
}

// 历史记录 -> 本地存储 change
function persistentChange(value) {
  App.config.setKey('history', value);

  if (value) {
    const tip = t("prompt['The history will be preserved across sessions. This can have an impact on performance when working with textures.']");
    window.$message?.warning(tip);

    const lastUndoCmd = App.history.undos[App.history.undos.length - 1];
    const lastUndoId = (lastUndoCmd !== undefined) ? lastUndoCmd.id : 0;
    App.history.enableSerialization(lastUndoId);
  } else {
    Hooks.useDispatchSignal("historyChanged");
  }
}

//清空历史记录
function clearHistory() {
  window.$dialog.warning({
    title: window.$t('other.warning'),
    content: window.$t("prompt['The Undo/Redo History will be cleared. Are you sure?']"),
    positiveText: window.$t('other.Ok'),
    negativeText: window.$t('other.Cancel'),
    onPositiveClick: () => {
      App.history.clear();
    },
  });
}
</script>

<style scoped lang="less">
.n-menu{
  :deep(&-item){
    margin-top: 5px;
    height: 35px;

    &-content{
      padding-right: 10px;
      font-size: 13px;

      &::before{
        left: 5px;
        right: 5px;
      }
    }
  }
}
</style>