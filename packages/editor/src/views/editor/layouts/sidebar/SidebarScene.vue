<template>
    <n-collapse display-directive="show" :default-expanded-names="['information', 'scene']">
        <template #arrow>
            <n-icon>
                <CaretForwardOutline />
            </n-icon>
        </template>
        <!--  工程信息  -->
        <n-collapse-item :title="t('layout.sider.sceneConfig.Project information')" name="information">
            <SidebarSceneProjectSetting class="px-2" />
        </n-collapse-item>
        <!--  场景配置  -->
        <n-collapse-item :title="t('layout.sider.Scene config')" name="scene">
            <SidebarSceneSetting class="px-2" />
        </n-collapse-item>
    </n-collapse>
</template>

<script setup lang="ts">
import { NCollapse, NCollapseItem } from "naive-ui";
import { CaretForwardOutline } from "@vicons/ionicons5";
import { t } from "@/language";
import SidebarSceneProjectSetting from "./scene/Sidebar.Scene.ProjectSetting.vue";
import SidebarSceneSetting from "./scene/Sidebar.Scene.Setting.vue";
</script>

<style scoped lang="less"></style>