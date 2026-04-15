<script setup lang="ts">
import {reactive, onMounted, onBeforeUnmount} from "vue";
import {CaretForwardOutline} from "@vicons/ionicons5";
import {t} from "@/language";
import Image from "./billboard/Sidebar.Billboard.Image.vue";
import Text from "./billboard/Sidebar.Billboard.Text.vue";
import {App,getDefaultBillboardOptions,Utils,Hooks} from "@astral3d/engine";

const billboardData = reactive<IBillboard.options>(getDefaultBillboardOptions());

onMounted(() => {
  Hooks.useAddSignal("objectSelected", updateUI);

  updateUI();
})
onBeforeUnmount(() => {
  Hooks.useRemoveSignal("objectSelected", updateUI);
})

function updateUI() {
  const object = App.selected;
  if(!object) return;

  if (!Utils.isBillboardObject(object)) return;

  Utils.deepAssign(billboardData, object.options);
}

function update(pkey: string,key:string){
  const object = App.selected;
  if(!object) return;

  if (!Utils.isBillboardObject(object)) return;

  object.options[pkey][key] = billboardData[pkey][key];

  Hooks.useDispatchSignal("materialChanged",object.material);
}
</script>

<template>
  <n-collapse display-directive="show" :default-expanded-names="['image', 'text']">
    <template #arrow>
      <n-icon>
        <CaretForwardOutline />
      </n-icon>
    </template>

    <!--  image  -->
    <n-collapse-item :title="t('layout.sider.billboard.Image')" name="image">
      <Image :data="billboardData.image" @update="update" />
    </n-collapse-item>

    <!--  text  -->
    <n-collapse-item :title="t('layout.sider.billboard.Text')" name="text">
      <Text :data="billboardData.text" @update="update" />
    </n-collapse-item>
  </n-collapse>
</template>

<style scoped lang="less">

</style>