<template>
  <n-modal :show="show" @update:show="(s) => emits('update:show',s)" class="!w-60vw" preset="dialog"
           :title="t('layout.sider.object.userdata')" :showIcon="false">
    <CodeEditor ref="userdataRef" v-model:source="source" mode="json" class="!h-600px" />

    <n-alert title="Error" type="error" v-if="errors.length" closable @close="errors = []" class="absolute bottom-0 w-full z-9999">
      <n-text depth="1" v-for="(error,index) in errors" :keys="index" class="block">{{error}}</n-text>
    </n-alert>
    <div class="float-right mt-10px">
      <n-button size="small" @click="emits('update:show',false)">{{t('other.Cancel')}}</n-button>
      <n-button class="ml-5px" type="primary" size="small" @click="submitCallback">{{t('other.Ok')}}</n-button>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {t} from "@/language";
import CodeEditor from "@/components/code/CodeEditor.vue";

const props = withDefaults(defineProps<{
  show: boolean,
  value: string
}>(), {
  show: false,
  value: "{}"
})
const emits = defineEmits(["update:show", "update:value"]);

const userdataRef = ref();
const source = ref<string>(props.value);
const errors = ref([]);

watch(() => props.show,(nv) => {
  if(nv){
    source.value = props.value;
  }
})

function submitCallback(e: Event) {
  e.stopPropagation();

  errors.value = userdataRef.value.getErrors();
  if(errors.value.length > 0) return;

  emits("update:value", source.value);
  emits("update:show", false);
  source.value = "";
}
</script>

<style scoped lang="less">
</style>