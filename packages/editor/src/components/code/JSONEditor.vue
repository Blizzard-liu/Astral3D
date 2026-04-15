<template>
  <div class="w-full h-auto relative">
    <CodeEditor ref="editorRef" v-model:source="source" mode="json" class="!h-300px" />

    <n-alert title="Error" type="error" v-if="errors.length" closable @close="errors = []" class="absolute bottom-0 w-full z-9999">
      <n-text depth="1" v-for="(error,index) in errors" :keys="index" class="block">{{error}}</n-text>
    </n-alert>
  </div>
</template>

<script setup lang="ts">
import {ref,useTemplateRef,watch} from "vue";
import {Utils} from "@astral3d/engine";
import CodeEditor from "@/components/code/CodeEditor.vue";

const props = withDefaults(defineProps<{
  value: string
}>(), {
  value: ""
})
const emits = defineEmits([ "update:value"]);

const editorRef = useTemplateRef("editorRef");
const source = ref<string>(props.value);
const errors = ref<string[]>([]);

const handleSourceChange = Utils.debounce(() => {
  if(!editorRef.value) return;

  errors.value = editorRef.value?.getErrors();
  if(errors.value.length > 0) return;

  emits("update:value", source.value);
},150)
watch(source,handleSourceChange);

function reset() {
  source.value = "";
  errors.value = [];
}

defineExpose({
  errors,
  reset
})
</script>

<style scoped lang="less">
</style>