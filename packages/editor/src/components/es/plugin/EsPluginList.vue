<script setup lang="ts">
import {computed} from "vue";
import {usePluginStore} from "@/store/modules/plugin";
import Logo from "@/components/header/Logo.vue";

const props = withDefaults(defineProps<{
  search:string
}>(),{
  search:""
})

const emits = defineEmits(['close']);

const pluginStore = usePluginStore();
const list = computed(() => pluginStore.getPluginsList().value.filter(l => l.name.toLowerCase().indexOf(props.search.toLowerCase()) !== -1))

function handleRunPlugin(plugin:IPlugin.Item){
  emits("close");

  window.viewer.modules.plugin.run(plugin.name);
}

</script>

<template>
  <div class="grid grid-cols-5 gap-4">
    <n-card hoverable :bordered="false" v-for="plugin in list" :key="plugin.name" size="small"
            @click.stop="handleRunPlugin(plugin)"
            content-class="flex flex-col justify-center items-center cursor-pointer">
      <n-image v-if="plugin.icon" :src="plugin.icon" object-fit="cover" width="60"
               preview-disabled />
      <Logo v-else class="w-60px" />
      <span class="mt-8px text-center">{{ plugin.name }}</span>
    </n-card>
  </div>

</template>

<style scoped lang="less">

</style>