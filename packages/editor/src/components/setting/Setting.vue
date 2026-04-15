<script setup lang="ts">
import Theme from "./common/Theme.vue";
import Locale from "./common/Locale.vue";
import Color from "./common/Color.vue";
import SettingCenter from "./common/SettingCenter.vue";

withDefaults(defineProps<{
    showSetting: boolean
}>(),{
    showSetting: true
})
</script>

<template>
  <!--  国际化  -->
  <Locale />

  <!--  主题  -->
  <Theme />

  <!--  主色调  -->
  <Color />

  <!--  设置中心  -->
  <SettingCenter v-if="showSetting" />
</template>

<style scoped lang="less">

</style>