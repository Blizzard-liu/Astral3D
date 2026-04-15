<script setup lang="ts">
import {ref, computed, onMounted, useTemplateRef} from "vue";
import type { TreeOption } from 'naive-ui'
import {t} from "@/language";
import AssetsList from "../assetsCenter/AssetsList.vue";
import EsPopTreeSelect from "@/components/es/EsPopTreeSelect.vue";
import UploadAsset from "@/views/home/assetsCenter/UploadAsset.vue";
import {useAssetsStore} from "@/store/modules/assets";

const assetsStore = useAssetsStore();

const assetsListRef = useTemplateRef<typeof AssetsList>("assetsListRef");
function refreshList(asset: IAssets.Item) {
  assetsListRef.value?.refresh(asset,'add');
}

/* 资产分类 */
// 主分类选择
const currentCategory = ref<IAssets.SupportType>(assetsStore.categories[0].key);
// 子分类
const subCategories = computed(() => assetsStore.getCategoryChildren(currentCategory.value));
// 子分类选中项
const activeSubCategory = ref('');
// 子分类UI选中按钮Key
const activeButtonKey = ref('');

// 处理主分类变更
function handleSelectCategory(key: IAssets.SupportType) {
  currentCategory.value = key;

  activeSubCategory.value = '';
  activeButtonKey.value = '';
}

// 处理子分类变更
function handleSelectSubCategory(key: string,buttonKey: string) {
  if(activeSubCategory.value === key){
    activeSubCategory.value = '';
    activeButtonKey.value = '';
  }else{
    activeSubCategory.value = key;
    activeButtonKey.value = buttonKey;
  }
}

/* 资产上传 */
const uploadVisible = ref(false);

function handleUploadAssetVisible(){
  uploadVisible.value = true;
}

onMounted(() => {
  assetsStore.fetchCategory();
})
</script>

<template>
  <n-layout-content content-class="p-4 flex space-x-4">
    <!-- 左侧分类 -->
    <n-card embedded class="assets-category-card w-40 h-full overflow-y-auto rounded-lg shadow-sm">
      <div class="grid grid-cols-2 gap-2">
        <n-button class="py-2 rounded-lg h-max"  :quaternary="category.key !== currentCategory" v-for="category in assetsStore.categories"
                  :key="category.key" :type="category.key === currentCategory ? 'primary' : 'default'"
                  @click="handleSelectCategory(category.key)">
          <div class="flex flex-col items-center">
            <n-icon :size="30" class="text-xl mb-2">
              <component :is="category.icon"></component>
            </n-icon>
            <div class="text-0.7rem">{{ category.label }}</div>
          </div>
        </n-button>
      </div>

      <n-button type="primary" class="w-full" @click="handleUploadAssetVisible">{{ t('home.assets.Upload asset') }}</n-button>
    </n-card>

    <!-- 右侧内容 -->
    <div class="w-calc-10rem h-full flex-1 flex flex-col">
      <!-- 子分类标签 -->
      <div class="mb-1 flex flex-wrap items-center gap-2">
        <template v-for="subCategory in subCategories" :key="subCategory.key">
          <n-button v-if="!subCategory.children?.length" strong secondary round
                     :type="activeButtonKey === subCategory.key ? 'primary' : 'default'"
                     @click="handleSelectSubCategory(subCategory.key,subCategory.key)">
            {{ subCategory.label }}
          </n-button>

          <EsPopTreeSelect v-else :options="[subCategory] as unknown as TreeOption[]" :value="subCategory.key"
                           strong secondary round :type="activeButtonKey === subCategory.key ? 'primary' : 'default'"
                           @click="(option) => handleSelectSubCategory(option.key,subCategory.key)" />
        </template>
      </div>

      <AssetsList ref="assetsListRef" :type="currentCategory" :category="activeSubCategory" />
    </div>
  </n-layout-content>

  <UploadAsset v-model:visible="uploadVisible" @refresh="refreshList" />
</template>

<style scoped lang="less">
.n-layout-content {
  height: calc(100vh - var(--header-height));

  .assets-category-card {
    :deep(.n-card__content) {
      padding: 0.6rem 0.7rem !important;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }
}
</style>
