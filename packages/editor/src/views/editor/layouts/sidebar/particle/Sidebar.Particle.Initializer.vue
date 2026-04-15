<script setup lang="ts">
import {t} from "@/language";
import { getDefaultParticleConfig } from "@astral3d/engine";
import {CaretForwardOutline} from "@vicons/ionicons5";
import EsTip from "@/components/es/EsTip.vue";
import EsInputNumber from "@/components/es/EsInputNumber.vue";
import Zones from "./initializer/Sidebar.Particle.Initializer.Zones.vue";
import Velocity from "./initializer/Sidebar.Particle.Initializer.Velocity.vue";
import InitializerBody from "./initializer/Sidebar.Particle.Initializer.Body.vue";

withDefaults(defineProps<{
  data: IParticle.Config['init']
}>(), {
  data: () => getDefaultParticleConfig().init
})
const emits = defineEmits(['update'])

function update(method: string){
  emits('update', method)
}
</script>

<template>
  <n-collapse display-directive="show" :default-expanded-names="['body','velocity','zone','mass']">
    <template #arrow>
      <n-icon>
        <CaretForwardOutline />
      </n-icon>
    </template>

    <!--  粒子主体 -->
    <n-collapse-item :title="t('layout.sider.particle.Body')" name="body">
      <!-- 主体操作 -->
      <InitializerBody v-model:body="data.body" />
    </n-collapse-item>

    <!--  粒子生成区域  -->
    <n-collapse-item :title="t('layout.sider.particle.Generation region')" name="zone">
      <!-- 是否启用 -->
      <div class="particle-config-item">
        <span>{{ t(`other.Enable`) }}</span>
        <div>
          <n-checkbox size="small" v-model:checked="data.position.isEnabled" @update:checked="update('zone')"/>
        </div>
      </div>

      <!-- 区域类型 -->
      <Zones v-model:zone="data.position.zone" :disabled="!data.position.isEnabled" @update="update('zone')" />
    </n-collapse-item>

    <!--  速度  -->
    <n-collapse-item :title="t('layout.sider.particle.Velocity')" name="velocity">
      <!-- 是否启用 -->
      <div class="particle-config-item">
        <span>{{ t(`other.Enable`) }}</span>
        <div>
          <n-checkbox size="small" v-model:checked="data.velocity.isEnabled" @update:checked="update('velocity')"/>
        </div>
      </div>

      <!-- 速度类型 -->
      <Velocity v-model:velocity="data.velocity.velocity" :disabled="!data.velocity.isEnabled" @update="update('velocity')" />
    </n-collapse-item>

    <!--  质量  -->
    <n-collapse-item :title="t('layout.sider.particle.Mass')" name="mass">
      <!-- 是否启用 -->
      <div class="particle-config-item">
        <span>{{ t(`other.Enable`) }}</span>
        <div>
          <n-checkbox size="small" v-model:checked="data.mass.isEnabled" @update:checked="update('mass')"/>
        </div>
      </div>

      <!-- 是否对质量值进行平均 -->
      <div class="particle-config-item">
        <span>
          <EsTip class="!justify-start" :content="t(`layout.sider.particle.Average`)">
            {{ t(`layout.sider.particle.Determines whether to average the mass value`) }}
          </EsTip>
        </span>
        <div>
          <n-checkbox size="small" v-model:checked="data.mass.center" :disabled="!data.mass.isEnabled" @update:checked="update('mass')"/>
        </div>
      </div>

      <!-- 最小值 -->
      <div class="particle-config-item">
        <span>{{ t(`other.Minimum`) }}</span>
        <div>
          <EsInputNumber v-model:value="data.mass.min" size="tiny" :show-button="false" :disabled="!data.mass.isEnabled"
            :min="0" :max="Infinity" @change="update('mass')"/>
        </div>
      </div>

      <!-- 最大值 -->
      <div class="particle-config-item">
        <span>{{ t(`other.Maximum`) }}</span>
        <div>
          <EsInputNumber v-model:value="data.mass.max" size="tiny" :show-button="false" :disabled="!data.mass.isEnabled"
                         :min="0" :max="Infinity" @change="update('mass')"/>
        </div>
      </div>
    </n-collapse-item>

    <!--  寿命  -->
    <n-collapse-item :title="t('layout.sider.particle.Life')" name="life">
      <!-- 是否启用 -->
      <div class="particle-config-item">
        <span>{{ t(`other.Enable`) }}</span>
        <div>
          <n-checkbox size="small" v-model:checked="data.life.isEnabled" @update:checked="update('initializerLife')"/>
        </div>
      </div>

      <!-- 确定是否对寿命值进行平均 -->
      <div class="particle-config-item">
        <span>
          <EsTip class="!justify-start" :content="t(`layout.sider.particle.Average`)">
            {{ t(`layout.sider.particle.Determines whether to average the life value`) }}
          </EsTip>
        </span>
        <div>
          <n-checkbox size="small" v-model:checked="data.life.center" :disabled="!data.life.isEnabled" @update:checked="update('initializerLife')"/>
        </div>
      </div>

      <!-- 最小值 -->
      <div class="particle-config-item">
        <span>{{ t(`other.Minimum`) }}</span>
        <div>
          <EsInputNumber v-model:value="data.life.min" size="tiny" :show-button="false" :disabled="!data.life.isEnabled"
                         :min="0" :max="Infinity" @change="update('initializerLife')"/>
        </div>
      </div>

      <!-- 最大值 -->
      <div class="particle-config-item">
        <span>{{ t(`other.Maximum`) }}</span>
        <div>
          <EsInputNumber v-model:value="data.life.max" size="tiny" :show-button="false" :disabled="!data.life.isEnabled"
                         :min="0" :max="Infinity" @change="update('initializerLife')"/>
        </div>
      </div>
    </n-collapse-item>

    <!--  半径  -->
    <n-collapse-item :title="t('layout.sider.particle.Radius')" name="radius">
      <!-- 是否启用 -->
      <div class="particle-config-item">
        <span>{{ t(`other.Enable`) }}</span>
        <div>
          <n-checkbox size="small" v-model:checked="data.radius.isEnabled" @update:checked="update('radius')"/>
        </div>
      </div>

      <!-- 确定是否对半径值进行平均 -->
      <div class="particle-config-item">
        <span>
          <EsTip class="!justify-start" :content="t(`layout.sider.particle.Average`)">
            {{ t(`layout.sider.particle.Determines whether to average the radius value`) }}
          </EsTip>
        </span>
        <div>
          <n-checkbox size="small" v-model:checked="data.radius.center" :disabled="!data.radius.isEnabled" @update:checked="update('radius')"/>
        </div>
      </div>

      <!-- 宽度 -->
      <div class="particle-config-item">
        <span>{{ t(`other.Width`) }}</span>
        <div>
          <EsInputNumber v-model:value="data.radius.width" size="tiny" :show-button="false" :disabled="!data.radius.isEnabled"
                         :min="0" :max="Infinity" :decimal="2" @change="update('radius')"/>
        </div>
      </div>

      <!-- 高度 -->
      <div class="particle-config-item">
        <span>{{ t(`other.Height`) }}</span>
        <div>
          <EsInputNumber v-model:value="data.radius.height" size="tiny" :show-button="false" :disabled="!data.radius.isEnabled"
                         :min="0" :max="Infinity" :decimal="2" @change="update('radius')"/>
        </div>
      </div>
    </n-collapse-item>

    <!--  旋转  -->
    <n-collapse-item :title="t('layout.sider.particle.Rotation')" name="rotation">
      <!-- 是否启用 -->
      <div class="particle-config-item">
        <span>{{ t(`other.Enable`) }}</span>
        <div>
          <n-checkbox size="small" v-model:checked="data.rotation.isEnabled" @update:checked="update('rotation')"/>
        </div>
      </div>

      <!-- 确定是否使用发射器的旋转作为起始旋转 -->
      <div class="particle-config-item">
        <span>
          <EsTip class="!justify-start" :content="t(`layout.sider.particle.Follow parent`)">
            {{ t(`layout.sider.particle["Determines if we should use the emitter's rotation as the starting rotation"]`) }}
          </EsTip>
        </span>
        <div>
          <n-checkbox size="small" v-model:checked="data.rotation.useEmitterRotation" :disabled="!data.rotation.isEnabled" @update:checked="update('rotation')"/>
        </div>
      </div>

      <!-- XYZ -->
      <div class="particle-config-item">
        <span>XYZ</span>
        <div class="flex">
          <EsInputNumber v-model:value="data.rotation.x" size="tiny" :show-button="false" :disabled="!data.rotation.isEnabled"
                         :min="0" :max="Infinity" :decimal="2" unit="°" @change="update('rotation')"/>
          <EsInputNumber v-model:value="data.rotation.y" size="tiny" :show-button="false" :disabled="!data.rotation.isEnabled"
                         :min="0" :max="Infinity" :decimal="2" unit="°" @change="update('rotation')"/>
          <EsInputNumber v-model:value="data.rotation.z" size="tiny" :show-button="false" :disabled="!data.rotation.isEnabled"
                         :min="0" :max="Infinity" :decimal="2" unit="°" @change="update('rotation')"/>
        </div>
      </div>
    </n-collapse-item>
  </n-collapse>
</template>

<style scoped lang="less">

</style>