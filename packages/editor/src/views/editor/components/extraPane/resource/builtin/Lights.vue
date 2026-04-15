<template>
  <div id="extra-resource-lights">
    <div class="flex-1 overflow-y-auto">
      <div class="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3">
        <n-card size="small" hoverable v-for="item in filteredList" :key="item.key" @dblclick="addToScene(item.key)"
                draggable="true" @dragstart="dragStart($event, item.key)" @dragend="dragEnd">
          <template #cover>
            <n-icon size="50">
              <component :is="item.icon"/>
            </n-icon>
          </template>
          <n-tooltip placement="bottom" trigger="hover">
            <template #trigger> {{ item.name.value }}</template>
            <span> {{ item.name.value }} </span>
          </n-tooltip>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {inject, computed} from "vue";
import type {Ref} from "vue";
import {Sunny, Haze, BrightnessContrast} from "@vicons/carbon";
import {BulbOutline, FlashlightOutline} from "@vicons/ionicons5";
import * as Astral3D from "@astral3d/engine";
import {cpt} from "@/language";
import {useDragStore} from "@/store/modules/drag";
import {screenToWorld} from "@/utils/common/scenes";
import {NIcon} from "naive-ui";

const searchText = inject('searchText') as Ref<string>;

const lights = [
  {
    key: "AmbientLight",
    icon: Haze,
    name: cpt("layout.header.AmbientLight")
  },
  {
    key: "DirectionalLight",
    icon: Sunny,
    name: cpt("layout.header.DirectionalLight")
  },
  {
    key: "HemisphereLight",
    icon: BrightnessContrast,
    name: cpt("layout.header.HemisphereLight")
  },
  {key: "PointLight", icon: BulbOutline, name: cpt("layout.header.PointLight")},
  {key: "Spotlight", icon: FlashlightOutline, name: cpt("layout.header.SpotLight")}
]

const filteredList = computed(() => {
  return lights.filter((item) => (<string>(item.name.value || item.name)).toLowerCase().includes(searchText.value.toLowerCase()));
});

//双击添加至场景
function addToScene(key) {
  const obj = Astral3D[key]();

  Astral3D.App.execute(new Astral3D.AddObjectCommand(obj));
}

// 开始拖拽事件
const dragStore = useDragStore();

function dragStart(_, key) {
  dragStore.setData(key)
}

function dragEnd() {
  if (dragStore.getActionTarget !== "addToScene" || dragStore.endArea !== "Scene") return;

  const position = screenToWorld(dragStore.endPosition.x, dragStore.endPosition.y);

  const obj = Astral3D[dragStore.getData]();
  obj.position.copy(position);
  Astral3D.App.execute(new Astral3D.AddObjectCommand(obj));
  
  dragStore.setActionTarget("");
}
</script>

<style scoped lang="less">
#extra-resource-lights {
  overflow-x: hidden;

  .n-card {
    cursor: pointer;

    :deep(.n-card-cover) {
      height: 5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :deep(.n-card__content) {
      padding: 0.15rem 0;
      font-size: 0.65rem;
      text-align: center;
    }
  }
}
</style>
