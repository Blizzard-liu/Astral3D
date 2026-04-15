<script setup lang="ts">
import {t} from "@/language";
import EsTip from "@/components/es/EsTip.vue";
import EsInputNumber from "@/components/es/EsInputNumber.vue";
import { getDefaultParticleConfig } from "@astral3d/engine";

withDefaults(defineProps<{
  data: IParticle.Config['attr']
}>(), {
  data: () => getDefaultParticleConfig().attr
})
const emits = defineEmits(['update'])

function update(method: string){
  emits('update', method)
}
</script>

<template>
  <!-- 发射器的总发射次数 -->
  <div class="particle-config-item">
    <span>{{ t(`layout.sider.particle.Total Emit Times`) }}</span>
    <div>
      <EsInputNumber v-model:value="data.totalEmitTimes" size="tiny" :show-button="false" :min="0" :max="Infinity"
        @change="update('totalEmitTimes')" />
    </div>
  </div>

  <!-- 发射器的发射阻尼系数 -->
  <div class="particle-config-item">
    <span>{{ t(`layout.sider.particle.Emitter Damping`) }}</span>
    <div>
      <EsInputNumber v-model:value="data.damping" size="tiny" :show-button="false" :min="0" :max="1" :decimal="3" @change="update('damping')" />
    </div>
  </div>

  <!-- 发射器的寿命: 此项不提供给用户设置，因为寿命到期后会自动移除发射器，用户使用发射次数来控制发射器的生命周期即可 -->
  <!--  <div class="particle-config-item">-->
  <!--    <span>{{ t(`layout.sider.particle.Duration`) }}</span>-->
  <!--    <div>-->
  <!--      <EsInputNumber v-model:value="data.life" size="tiny" :show-button="false"-->
  <!--                     :min="0" :max="Infinity" unit="ms" @blur="update('life')"/>-->
  <!--    </div>-->
  <!--  </div>-->

  <!-- 发射粒子的数量范围 -->
  <div class="particle-config-item">
    <span>
      <EsTip class="!justify-start" :content="t(`layout.sider.particle.Quantitative range`)">
        {{ t(`layout.sider.particle.The number range of emitted particles`) }}
      </EsTip>
    </span>
    <div class="flex">
      <EsInputNumber v-model:value="data.numPan.min" size="tiny" :show-button="false" :min="0" :max="Infinity"
        @change="update('rateNumPan')" />
      <EsInputNumber v-model:value="data.numPan.max" size="tiny" :show-button="false" :min="0" :max="Infinity"
        @change="update('rateNumPan')" />
    </div>
  </div>

  <!-- 每次粒子发射之间的时间间隔(s) -->
  <div class="particle-config-item">
    <span>
      <EsTip class="!justify-start" :content="t(`layout.sider.particle.Time interval`)">
        {{ t(`layout.sider.particle.The time interval between each particle emission`) }}
      </EsTip>
    </span>
    <div class="flex">
      <EsInputNumber v-model:value="data.timePan.a" size="tiny" :show-button="false" :min="0" :max="Infinity" unit="s"
        :decimal="2" @change="update('rateTimePan')" />
      <EsInputNumber v-model:value="data.timePan.b" size="tiny" :show-button="false" :min="0" :max="Infinity" unit="s"
        :decimal="2" @change="update('rateTimePan')" />
    </div>
  </div>
</template>

<style scoped lang="less">

</style>