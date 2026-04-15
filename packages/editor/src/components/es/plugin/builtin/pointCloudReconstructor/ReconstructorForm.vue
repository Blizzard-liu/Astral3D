<script setup lang="ts">
import { ref } from "vue";
import { t } from "@/language";
import EsFormItemHelpLabel from "@/components/es/EsFormItemHelpLabel.vue";

const model = ref<IPlugin.PointCloudReconstructorModel>({
    'colorTolerance': 5,
    'distanceThreshold': 0.3,
    'minClusterSize': 10,
    'downsampleResolution': 0.05,
})

defineExpose({
    model
})
</script>

<template>
    <n-form ref="formRef" :model="model" label-placement="left" label-width="auto" class="overflow-auto mt-2">
        <n-grid :cols="24" :x-gap="24">
            <!--  颜色容差  -->
            <n-form-item-gi :span="12">
                <template #label>
                    <EsFormItemHelpLabel :label="t('plugin.pointCloudReconstructor.Color tolerance')">
                        {{ t("plugin.pointCloudReconstructor['Color similarity processing, the larger the value, the wider the range of cluster color values.']") }}
                    </EsFormItemHelpLabel>
                </template>

                <n-slider v-model:value="model.colorTolerance" :min="1" :max="20" :step="1" />
            </n-form-item-gi>

            <!--  距离阈值  -->
            <n-form-item-gi :span="12">
                <template #label>
                    <EsFormItemHelpLabel :label="t('plugin.pointCloudReconstructor.Distance threshold')">
                        {{ t("plugin.pointCloudReconstructor['Control the sensitivity of object separation, that is, spatial clustering distance threshold.']") }}
                    </EsFormItemHelpLabel>
                </template>

                <n-slider v-model:value="model.distanceThreshold" :min="0.05" :max="0.5" :step="0.05" />
            </n-form-item-gi>

            <!--  最小簇大小  -->
            <n-form-item-gi :span="12">
                <template #label>
                    <EsFormItemHelpLabel :label="t('plugin.pointCloudReconstructor.Min cluster size')">
                        {{ t("plugin.pointCloudReconstructor['Minimum number of cluster points, filtering noise points and small clusters.']") }}
                    </EsFormItemHelpLabel>
                </template>

                <n-slider v-model:value="model.minClusterSize" :min="5" :max="100" :step="5" />
            </n-form-item-gi>

            <!--  点云抽稀  -->
            <n-form-item-gi :span="12">
                <template #label>
                    <EsFormItemHelpLabel :label="t('plugin.pointCloudReconstructor.Downsample resolution')">
                        {{ t("plugin.pointCloudReconstructor['The grid space division method is used to reduce the number of points, so as to reduce the amount of calculation in the subsequent processing.']") }}
                    </EsFormItemHelpLabel>
                </template>

                <n-slider v-model:value="model.downsampleResolution" :min="0.01" :max="0.2" :step="0.01" />
            </n-form-item-gi>
        </n-grid>
    </n-form>
</template>

<style scoped lang="less">

</style>