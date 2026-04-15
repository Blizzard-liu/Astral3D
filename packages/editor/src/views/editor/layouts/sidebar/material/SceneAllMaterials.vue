<script lang="ts" setup>
import {onMounted, onBeforeUnmount, ref} from 'vue';
import {NButton, NCollapse, NCollapseItem, NSelect} from 'naive-ui';
import {CaretForwardOutline} from "@vicons/ionicons5";
import {Mesh} from "three";
import {App,Hooks, SetMaterialCommand} from "@astral3d/engine";
import {t} from "@/language";

const selectMaterial = ref("");
const materialOptions = ref<{}[]>([]);

onMounted(() => {
  Hooks.useAddSignal("objectSelected", objectSelected);
  Hooks.useAddSignal("materialAdded", refreshMaterialBrowserUI);
  Hooks.useAddSignal("materialChanged", refreshMaterialBrowserUI);
  Hooks.useAddSignal("materialRemoved", refreshMaterialBrowserUI);
})
onBeforeUnmount(() => {
  Hooks.useRemoveSignal("objectSelected", objectSelected);
  Hooks.useRemoveSignal("materialAdded", refreshMaterialBrowserUI);
  Hooks.useRemoveSignal("materialChanged", refreshMaterialBrowserUI);
  Hooks.useRemoveSignal("materialRemoved", refreshMaterialBrowserUI);
})

function objectSelected(object) {
  if (object && object.material) {
    // const arr = Object.values(App.materials);
    // const index = arr.indexOf(object.material);
    // selectMaterial.value = arr[index];
    selectMaterial.value = object.material.uuid;
  } else {
    selectMaterial.value = "";
  }
}

function refreshMaterialBrowserUI() {
  materialOptions.value = Object.values(App.materials).map((item: any) => {
    return {
      label: item.name || item.uuid,
      value: item.uuid
    }
  });
}

//应用材质
function assignMaterial() {
  const selectedObject = App.selected;
  if (selectedObject === null) return;

  const oldMaterial = (<Mesh>selectedObject).material;
  //仅将材质指定给具有材质特性的对象(例如，避免将材质指定给THREE.Group)
  if (!oldMaterial) return;
  const material = App.getMaterialByUuid(selectMaterial.value);

  if (!material) return;
  App.removeMaterial(oldMaterial);
  App.execute(new SetMaterialCommand(selectedObject, material));
  App.addMaterial(material);
}
</script>

<template>
  <n-collapse display-directive="show" :default-expanded-names="['material']">
    <template #arrow>
      <n-icon>
        <CaretForwardOutline/>
      </n-icon>
    </template>

    <!--  选择材质  -->
    <n-collapse-item :title="t('layout.sider.project[\'select material\']')" name="material">
      <div class="flex justify-between">
        <n-select v-model:value="selectMaterial" filterable size="small"
                  :placeholder="t('layout.sider.project[\'select material\']')" :options="materialOptions"/>

        <n-button type="primary" size="small" class="ml-5px" @click="assignMaterial">
          {{ t('layout.sider.project.assign') }}
        </n-button>
      </div>
    </n-collapse-item>
  </n-collapse>

  <n-divider/>
</template>
