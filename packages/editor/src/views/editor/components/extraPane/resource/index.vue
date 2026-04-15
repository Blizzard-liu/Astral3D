<template>
  <div class="extra-pane-item">
    <div class="extra-pane-item-header">
      <EsTip size="24" class="ml-2">
        {{ t(`prompt['Drag or double click to add to scene']`) }}
        <br />
        {{ t(`prompt['Right-click on the preview']`) }}
      </EsTip>

      <n-input v-model:value="searchText" :placeholder="t('layout.sider.scene.Search')" class="max-w-50"
               size="small">
        <template #prefix>
          <n-icon>
            <Search/>
          </n-icon>
        </template>
      </n-input>

      <n-radio-group v-model:value="type" name="type" size="small">
        <n-radio-button value="builtin" label="内置资源"/>
        <n-radio-button value="public" label="公共资源"/>
      </n-radio-group>
    </div>

    <div class="extra-pane-item-content">
      <Builtin v-if="type === 'builtin'"/>
      <Public v-else/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, provide} from 'vue';
import {Search} from "@vicons/carbon";
import {t} from "@/language";
import Builtin from "./builtin/index.vue";
import Public from "./public/index.vue";
import EsTip from "@/components/es/EsTip.vue";

const searchText = ref("");
provide('searchText', searchText);

const type = ref("builtin");
</script>

<style lang="less" scoped>
.extra-pane-item-header {
  padding-left: 0;
  justify-content: space-between !important;
}
</style>