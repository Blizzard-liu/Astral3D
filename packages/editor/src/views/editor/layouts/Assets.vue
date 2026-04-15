<template>
    <div id="layout-assets">
        <div class="layout-assets-scene-tree" style="height: calc(40% - 25px)">
            <SceneTree />
        </div>

        <n-tabs default-value="cad" animated type="line" justify-content="space-around" class="!h-60%"
            pane-wrapper-class="layout-assets-tab-pane-wrapper">
            <n-tab-pane name="cad" tab="CAD" display-directive="show">
                <CadLibrary />
            </n-tab-pane>
        </n-tabs>
    </div>
</template>

<script lang="ts" setup>
import SceneTree from "@/components/tree/SceneTree.vue";
import CadLibrary from "./assets/CadLibrary.vue";
</script>

<style scoped lang="less">
#layout-assets {
    // height: calc(100vh - var(--header-height) - var(--footer-height));
    height: calc(100vh - var(--header-height));
    border-right: 1px solid var(--n-border-color);

    .layout-assets-scene-tree {
        padding: 10px;
        border-bottom: 5px solid var(--n-border-color);
    }

    :deep(.layout-assets-tab-pane-wrapper) {
        height: calc(100% - var(--n-pane-padding-top) - 42px);
        overflow-y: auto;

        .n-tab-pane {
            height: calc(100% - 10px);
            padding-top: 10px !important;
            overflow-y: auto;

            &:first-child {
                overflow: unset;
            }
        }
    }
}
</style>
