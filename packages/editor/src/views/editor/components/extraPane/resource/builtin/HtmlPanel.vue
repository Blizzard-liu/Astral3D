<template>
  <div id="extra-resource-html-plane" class="flex flex-col">
    <!-- 子分类标签 -->
    <div class="mb-3 flex flex-wrap items-center gap-2">
      <n-button v-for="subCategory in subCategories" :key="subCategory.key" strong secondary round
                :type="activeSubCategory === subCategory.key ? 'primary' : 'default'"
                @click="selectSubCategory(subCategory.key)">
        {{ subCategory.name }}
      </n-button>
    </div>

    <!-- 资源网格 -->
    <div class="flex-1 overflow-y-auto">
      <div class="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3">
        <n-card size="small" hoverable v-for="item in filteredList" :key="item.key"
                @dblclick="addToScene(item)" draggable="true" @dragstart="dragStart(item)" @dragend="dragEnd"
                @contextmenu.prevent="handlePreview(item)">
          <template #cover>
            <img :src="item.image" :alt="item.key" draggable="false" class="w-full h-full object-cover"/>
          </template>
          <n-tooltip placement="bottom" trigger="hover">
            <template #trigger> {{ item.name.value || item.name }}</template>
            <span> {{ item.name.value || item.name }} </span>
          </n-tooltip>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, inject, computed, nextTick} from "vue";
import type {Ref} from "vue";
import {Box3, Vector3} from "three";
import {App,Preview,HtmlPanelConverter,AddObjectCommand} from "@astral3d/engine";
import {cpt} from "@/language";
import {useDragStore} from "@/store/modules/drag";
import {screenToWorld} from "@/utils/common/scenes";

const searchText = inject('searchText') as Ref<string>;
const previewInfo = inject('previewInfo') as any;
const previewRef = inject('previewRef') as any;

const activeSubCategory = ref('technology');
const subCategories = ref([
  {key: 'technology', name: cpt('extra.resource.htmlPanel.Technology')}
]);

const allList = {
  "technology": [
    {key: "factoryEquipment", image: "/static/images/resource/htmlPanel/technology/factoryEquipment.png", name: cpt("extra.resource.htmlPanel.Factory equipment"), html: "/static/resource/htmlPanel/technology/factoryEquipment.html"},
  ]
}

const filteredList = computed(() => {
  return allList[activeSubCategory.value].filter((item) => (item.name.value || item.name).toLowerCase().includes(searchText.value.toLowerCase()));
});

// 切换子分类
function selectSubCategory(key: string) {
  activeSubCategory.value = key;
}

// 预览
async function handlePreview(item){
  previewInfo.name = (item.name as Ref<string>).value || item.name;
  previewInfo.type = "Particle";

  previewInfo.visible = true;

  await nextTick();

  previewRef.value?.getPreviewer().then((previewer:Preview) => {
    if(!previewer) return;

    HtmlPanelConverter.getInstance().loadAsync({
      url: item.html,
      isSprite: true
    }).then(htmlPanelObj => {
      htmlPanelObj.scale.set(0.1, 0.1, 1);
      htmlPanelObj.name = previewInfo.name;

      previewer.scene.add(htmlPanelObj);

      const box3 = new Box3();
      box3.set(new Vector3(-30, 0, -30), new Vector3(30, 30, 30));

      previewer.modules.controls.fitToBox(box3,true);
    }).catch((e:Error) => window.$message?.error(e.message));
  })
}

//双击添加至场景..
function addToScene(item, position?: number[]) {
  HtmlPanelConverter.getInstance().loadAsync({
    url: item.html,
    isSprite: true
  }).then(htmlPanelObj => {
    if (!position) {
      position = [0, 0, 0];
    }
    htmlPanelObj.position.fromArray(position);
    htmlPanelObj.scale.set(0.1, 0.1, 1);
    htmlPanelObj.name = item.name.value || item.name;
    App.execute(new AddObjectCommand(htmlPanelObj), `Add Billboard: ${htmlPanelObj.name}`);
  }).catch((e:Error) => window.$message?.error(e.message));
}

// 开始拖拽事件
const dragStore = useDragStore();

function dragStart(item) {
  dragStore.setData(item)
}

function dragEnd() {
  if (dragStore.getActionTarget !== "addToScene" || dragStore.endArea !== "Scene") return;

  const position = screenToWorld(dragStore.endPosition.x, dragStore.endPosition.y);

  addToScene(dragStore.getData, position.toArray());

  dragStore.setActionTarget("");
}
</script>

<style scoped lang="less">
#extra-resource-html-plane {
  overflow-x: hidden;

  .n-card {
    cursor: pointer;

    :deep(.n-card__content) {
      padding: 0.3rem 0;
      font-size: 0.65rem;
      text-align: center;

      .n-button {
        font-size: 0.65rem !important;
      }
    }
  }
}
</style>
