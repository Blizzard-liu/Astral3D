<template>
    <n-select value-field="uuid" label-field="name" size="small" :value="value" :options="animationStore.list" @update:value="handleCurrentChange" />
</template>

<script setup>
import { computed } from "vue";
import { useAnimationStore } from "@/store/modules/animation";

const animationStore = useAnimationStore();

const value = computed(() => animationStore.current ? animationStore.current.uuid : "");

function handleCurrentChange(value){
    const current = animationStore.list.find(a => a.uuid === value);
    animationStore.setCurrent(current);
}
</script>

<style lang="less" scoped>

</style>