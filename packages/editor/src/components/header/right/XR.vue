<template>
  <div class="flex items-center mr-2">
    <n-tooltip trigger="hover" v-if="supportVR">
      <template #trigger>
        <n-icon size="20" class="cursor-pointer" @click="enterVR">
          <Carbon3DMprToggle />
        </n-icon>
      </template>
      VR
    </n-tooltip>

    <n-tooltip trigger="hover" v-if="supportAR">
      <template #trigger>
        <n-icon size="20" class="cursor-pointer" @click="enterAR">
          <JoinOuter />
        </n-icon>
      </template>
      AR
    </n-tooltip>
  </div>
</template>

<script setup lang="ts">
import {onMounted,ref} from "vue";
import {Carbon3DMprToggle, JoinOuter} from "@vicons/carbon";
import {NIcon, NTooltip} from "naive-ui";
import {Hooks} from "@astral3d/engine";

const supportAR = ref(false);
const supportVR = ref(false);

onMounted(() => {
  navigator.xr?.isSessionSupported( 'immersive-ar' ).then((supported) => {
    supportAR.value = supported;
  });

  navigator.xr?.isSessionSupported( 'immersive-vr' ).then((supported) => {
    supportVR.value = supported;
  });
})

function enterVR(){
  Hooks.useDispatchSignal("enterXR",'immersive-ar');
}

function enterAR(){
  Hooks.useDispatchSignal("enterXR",'immersive-vr');
}
</script>