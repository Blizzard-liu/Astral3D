<template>
  <n-popover :show-arrow="false" placement="bottom-start" trigger="click" :style="{ padding: 0 }">
    <template #trigger>
      <n-button round size="small">
        <template #icon>
          <n-icon>
            <component :is="current.icon"/>
          </n-icon>
        </template>
        {{ current.label }}
      </n-button>
    </template>
    <n-radio-group v-model:value="current.uuid" size="small">
      <template v-for="song in options" :key="song.uuid">
        <n-radio :value="song.uuid" v-if="song.type !== 'divider'" @click="handlerChange(song)">
          <div class="flex items-center">
            <n-icon class="ml-10px mr-5px">
              <component :is="song.icon"/>
            </n-icon>
            <span>{{ song.label }}</span>
          </div>

          <span>{{ song.shortcuts }}</span>
        </n-radio>
        <n-divider title-placement="left" v-else> {{ song.label }}</n-divider>
      </template>
      <template v-for="song in sceneCamera" :key="song.uuid">
        <n-radio :value="song.uuid" v-if="song.type !== 'divider'" @click="handlerChange(song)">
          <div class="flex items-center">
            <n-icon class="ml-10px mr-5px">
              <component :is="song.icon"/>
            </n-icon>
            <span>{{ song.label }}</span>
          </div>

          <span>{{ song.shortcuts }}</span>
        </n-radio>
        <n-divider title-placement="left" v-else> {{ song.label }}</n-divider>
      </template>
    </n-radio-group>
  </n-popover>
</template>

<script lang="ts" setup>
import type {ComputedRef} from "vue";
import {ref, markRaw, onMounted, onBeforeUnmount} from "vue";
import {Camera,Object3D} from 'three';
import {App, Hooks} from "@astral3d/engine";
import {
  OpenPanelFilledTop,
  OpenPanelFilledBottom,
  OpenPanelFilledLeft,
  OpenPanelFilledRight,
  RotateCounterclockwiseAlt,
  RotateClockwiseAlt,
  Carbon3DMprToggle, CenterToFit
} from '@vicons/carbon';
import {cpt} from "@/language";

interface IOption {
  label: ComputedRef<string> | string,
  uuid: string,
  type?: string,
  icon?: any,
  shortcuts?: string,
  children?: IOption[]
}

const defaultCamera = [
  {
    uuid: "divider",
    type: "divider",
    label: cpt("layout.scene.toolbar.Six views")
  },
  {
    uuid: "Top",
    label: cpt("layout.scene.toolbar.Top"),
    icon: markRaw(OpenPanelFilledTop),
    shortcuts: "ALT+J"
  },
  {
    uuid: "Bottom",
    label: cpt("layout.scene.toolbar.Bottom"),
    icon: markRaw(OpenPanelFilledBottom),
    shortcuts: "ALT+SHIFT+J"
  },
  {
    uuid: "Left",
    label: cpt("layout.scene.toolbar.Left"),
    icon: markRaw(OpenPanelFilledLeft),
    shortcuts: "ALT+K"
  },
  {
    uuid: "Right",
    label: cpt("layout.scene.toolbar.Right"),
    icon: markRaw(OpenPanelFilledRight),
    shortcuts: "ALT+SHIFT+K"
  },
  {
    uuid: "Front",
    label: cpt("layout.scene.toolbar.Front"),
    icon: markRaw(RotateCounterclockwiseAlt),
    shortcuts: "ALT+H"
  },
  {
    uuid: "Back",
    label: cpt("layout.scene.toolbar.Back"),
    icon: markRaw(RotateClockwiseAlt),
    shortcuts: "ALT+SHIFT+H"
  }
]

const current = ref<IOption>({
  label: "",
  uuid: ""
});
const options = ref<IOption[]>()
const sceneCamera = ref<IOption[]>();

function handlerChange(value: IOption) {
  // @ts-ignore
  current.value = value;

  const cameraManage = window.viewer.modules.cameraManage;
  switch (value.uuid) {
    case "Front":
      cameraManage.front().then((camera: Camera) => {
        App.setViewportCamera(camera.uuid);
      })
      break;
    case "Back":
      cameraManage.rear().then((camera: Camera) => {
        App.setViewportCamera(camera.uuid);
      })
      break;
    case "Left":
      cameraManage.left().then((camera: Camera) => {
        App.setViewportCamera(camera.uuid);
      })
      break;
    case "Right":
      cameraManage.right().then((camera: Camera) => {
        App.setViewportCamera(camera.uuid);
      })
      break;
    case "Top":
      cameraManage.top().then((camera: Camera) => {
        App.setViewportCamera(camera.uuid);
      })
      break;
    case "Bottom":
      cameraManage.bottom().then((camera: Camera) => {
        App.setViewportCamera(camera.uuid);
      })
      break;
    default:
      cameraManage.setInteract({});
      App.setViewportCamera(current.value.uuid);
      break;
  }
}

function handlerOptionsUpdate() {
  options.value = [];
  sceneCamera.value = [];

  const cameras = App.cameras;
  for (const key in cameras) {
    const camera = cameras[key];

    if (camera.uuid === App.camera.uuid) {
      // 默认透视相机
      options.value.unshift({
        uuid: App.camera.uuid,
        // label: cpt("layout.header.PerspectiveCamera"),
        label: cpt("core.editor.Default Camera"),
        icon: markRaw(Carbon3DMprToggle),
        shortcuts: "ALT+G"
      })
      continue;
    }

    // 场景相机
    sceneCamera.value.push({
      uuid: camera.uuid,
      label: camera.name,
      icon: camera.type === "PerspectiveCamera" ? markRaw(Carbon3DMprToggle) : markRaw(CenterToFit),
      shortcuts: ""
    })
  }

  options.value.push(...defaultCamera);

  if (sceneCamera.value.length > 0) {
    sceneCamera.value.unshift({
      uuid: "divider2",
      type: "divider",
      label: cpt("layout.scene.toolbar['Scene camera']")
    })
  }

  // @ts-ignore
  !current.value.uuid && (current.value = options.value[0]);
}

function objectChanged(object: Object3D) {
  if (object instanceof Camera) {
    handlerOptionsUpdate();
  }
}

onMounted(() => {
  Hooks.useAddSignal("cameraAdded", handlerOptionsUpdate);
  Hooks.useAddSignal("cameraRemoved", handlerOptionsUpdate);
  Hooks.useAddSignal("objectChanged", objectChanged);

  handlerOptionsUpdate();
})
onBeforeUnmount(() => {
  Hooks.useRemoveSignal("cameraAdded", handlerOptionsUpdate);
  Hooks.useRemoveSignal("cameraRemoved", handlerOptionsUpdate);
  Hooks.useRemoveSignal("objectChanged", objectChanged);
})
</script>

<style lang="less" scoped>
.n-radio-group {
  padding: 5px 0;

  .n-radio {
    display: flex;
    align-items: center;
    padding: 5px 10px;

    &:hover {
      background-color: var(--n-divider-color);
    }

    :deep(.n-radio__label) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 180px;

      & > span {
        font-size: 12px;
        color: var(--n-text-color-disabled);
      }
    }
  }

  .n-divider {
    margin: 10px 0;

    :deep(.n-divider__title) {
      font-size: 12px;
      font-weight: 400;
      color: #999;
    }
  }
}
</style>