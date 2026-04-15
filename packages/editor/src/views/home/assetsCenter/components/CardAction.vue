<script setup lang="ts">
import { Edit,Airplay,Information,OverflowMenuVertical,Delete } from '@vicons/carbon';
import { t,cpt } from "@/language";
import { renderIcon } from "@/utils/common/render";
import {fetchRemoveAsset} from "@/http/api/assetsInfo";

const props = withDefaults(defineProps<{
  asset:IAssets.Item
}>(),{
  asset:undefined
})
const emits = defineEmits(["refresh","preview",'detail','edit']);

const options = [
  {
    label: () => cpt("home.Details").value,
    key: 'details',
    icon: renderIcon(Information)
  },
  {
    label: () => cpt("layout.sider.script.Edit").value,
    key: 'edit',
    icon: renderIcon(Edit)
  },
  {
    label: () => cpt("home.Delete").value,
    key: 'delete',
    icon: renderIcon(Delete)
  }
];

// 下拉菜单选中处理
function handleOperation(key: string){
  switch (key){
    case "details":
      emits('detail', props.asset);
      break;
    case 'edit':
      emits('edit', props.asset);
      break;
    case "delete":
      window.$dialog.warning({
        title: window.$t('other.warning'),
        content: window.$t("prompt['Are you sure you want to delete this resource?']"),
        positiveText: window.$t('other.Ok'),
        negativeText: window.$t('other.Cancel'),
        onPositiveClick: async () => {
          const res = await fetchRemoveAsset(props.asset.id);
          if(!res.error){
            window.$message?.success(t("prompt.Success to delete"));

            emits("refresh", props.asset, 'remove');
          }
        },
      });
      break;
  }
}

//预览场景
function handlePreview(){
  emits("preview", props.asset);
}
</script>

<template>
  <div class="w-full flex justify-between items-center">
    <n-tooltip trigger="hover">
      <template #trigger>
        <h4> {{ asset.name }} </h4>
      </template>
      <span> {{ asset.name }} </span>
    </n-tooltip>

    <div class="w-45px flex justify-between items-center">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button text @click="handlePreview">
            <template #icon>
              <n-icon><Airplay /></n-icon>
            </template>
          </n-button>
        </template>
        <span> {{ t('home.Preview') }} </span>
      </n-tooltip>

      <n-dropdown :options="options" @select="handleOperation">
        <n-button text>
          <template #icon>
            <n-icon><OverflowMenuVertical /></n-icon>
          </template>
        </n-button>
      </n-dropdown>
    </div>
  </div>
</template>

<style scoped lang="less">
h4{
  max-width: calc(100% - 90px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}
</style>