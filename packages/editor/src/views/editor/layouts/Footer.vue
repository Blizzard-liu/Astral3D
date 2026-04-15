<script lang="ts" setup>
import SettingCenter from "@/components/setting/common/SettingCenter.vue";

const version = import.meta.env.VITE_GLOB_VERSION;
const author = import.meta.env.VITE_GLOB_AUTHOR;
const beian = import.meta.env.VITE_GLOB_BEIAN;
</script>

<template>
  <div class="inline-block !flex items-center">
    Version {{ version }} · Made by {{ author }}
    &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
    <p><a href="https://beian.miit.gov.cn/" target="_blank">{{beian}}</a></p>
  </div>

  <SettingCenter />
</template>
