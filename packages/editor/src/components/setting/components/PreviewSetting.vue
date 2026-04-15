<template>
  <n-form :model="form" label-placement="left" :label-width="120" class="mt-2" :style="{ minWidth: '300px' }">
    <n-form-item :label="t('setting.preview.Roaming character')">
      <n-radio-group v-model:value="form.roamingCharacter" name="roaming_character" @update:value="handleRoamingCharacterChange">
        <n-space>
          <n-radio v-for="character in characters" :key="character.value" :value="character.value">
            <img :src="character.image" alt="" class="w-100px b-rd-6px" />
          </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import {onMounted,reactive} from "vue";
import {t} from "@/language";
import {App,ROAMING_CHARACTERS} from "@astral3d/engine";
import {MenuOperation} from "@/utils/preview/menuOperation";

const form = reactive({
  roamingCharacter: App.config.getKey("roamingCharacter"),
})
const characters = [
  {
    image: "/static/images/roaming/Jackie.jpg",
    value: ROAMING_CHARACTERS.JACKIE,
  },
  {
    image: "/static/images/roaming/Workman.jpg",
    value: ROAMING_CHARACTERS.WORK_MAN,
  },
  {
    image: "/static/images/roaming/X_Bot.jpg",
    value: ROAMING_CHARACTERS.X_BOT,
  },
  {
    image: "/static/images/roaming/Y_Bot.jpg",
    value: ROAMING_CHARACTERS.Y_BOT,
  }
];

// 漫游角色变更
function handleRoamingCharacterChange(){
  App.config.setKey("roamingCharacter",form.roamingCharacter);

  if(MenuOperation._roaming && MenuOperation._roaming.isRoaming){
    MenuOperation.Roaming.reloadPerson();
  }
}

onMounted(() => {
  form.roamingCharacter = App.config.getKey("roamingCharacter");
})
</script>

<style scoped lang="less">

</style>