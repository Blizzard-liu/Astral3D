<script setup lang="ts">
import {t} from "@/language";
import { getDefaultParticleConfig } from "@astral3d/engine";
import {CaretForwardOutline} from "@vicons/ionicons5";
import EsTip from "@/components/es/EsTip.vue";
import EsInputNumber from "@/components/es/EsInputNumber.vue";
import EsParticleEasing from "@/components/es/EsParticleEasing.vue";

withDefaults(defineProps<{
  data: IParticle.Config['behaviour'],
  hasMass: boolean
}>(), {
  data: () => getDefaultParticleConfig().behaviour,
  hasMass: false
})
const emits = defineEmits(['update'])

function update(method: string){
  emits('update', method)
}
</script>

<template>
  <n-collapse display-directive="show" :default-expanded-names="['color', 'force', 'scale', 'rotate']">
    <template #arrow>
      <n-icon>
        <CaretForwardOutline />
      </n-icon>
    </template>

    <!--  随时间改变粒子颜色  -->
    <n-collapse-item name="color">
      <template #header>
        <n-text>
          <EsTip class="!justify-start" :content="t(`layout.sider.material.Color`)">
            {{ t(`layout.sider.particle.A behaviour which mutates the color of a particle over time`) }}
          </EsTip>
        </n-text>
      </template>

      <!-- 是否启用 -->
      <div class="particle-config-item">
        <span>{{ t(`other.Enable`) }}</span>
        <div>
          <n-checkbox size="small" v-model:checked="data.color.isEnabled" @update:checked="update('color')" />
        </div>
      </div>

      <!-- 起始颜色 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Start color`) }}</span>
        <div>
          <n-color-picker v-model:value="data.color.colorA" :disabled="!data.color.isEnabled" :show-alpha="false"
            :modes="['hex']" size="small" @update:value="update('color')" :render-label="() => ''" />
        </div>
      </div>

      <!-- 结束颜色 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.End color`) }}</span>
        <div>
          <n-color-picker v-model:value="data.color.colorB" :disabled="!data.color.isEnabled" :show-alpha="false"
            :modes="['hex']" size="small" @update:value="update('color')" :render-label="() => ''" />
        </div>
      </div>

      <!-- 粒子生命周期 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Life`) }}</span>
        <div>
          <EsInputNumber v-model:value="data.color.life" size="tiny" :show-button="false"
            :disabled="!data.color.isEnabled" :min="0" :max="Infinity" @change="update('color')" />
        </div>
      </div>

      <!-- 行为缓解趋势 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Easing`) }}</span>
        <div>
          <EsParticleEasing v-model:value="data.color.easing" size="small" :disabled="!data.color.isEnabled"
            @update:value="update('color')" />
        </div>
      </div>
    </n-collapse-item>

    <!--  力，迫使粒子沿特定轴线运动  -->
    <n-collapse-item name="force">
      <template #header>
        <n-text>
          <EsTip class="!justify-start" :content="t(`layout.sider.particle.Force`)">
            {{ t(`layout.sider.particle.Behaviour that forces particles along a specific axis`) }}
          </EsTip>
        </n-text>
      </template>

      <!-- 是否启用 -->
      <div class="particle-config-item">
        <span>{{ t(`other.Enable`) }}</span>
        <div>
          <n-checkbox size="small" v-model:checked="data.force.isEnabled" @update:checked="update('force')" />
        </div>
      </div>

      <!-- 方向作用力 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Direction`) }}</span>
        <div class="flex">
          <EsInputNumber v-model:value="data.force.fx" size="tiny" :show-button="false"
            :disabled="!data.force.isEnabled" :min="-Infinity" :max="Infinity" :decimal="2" @change="update('force')" />
          <EsInputNumber v-model:value="data.force.fy" size="tiny" :show-button="false"
            :disabled="!data.force.isEnabled" :min="-Infinity" :max="Infinity" :decimal="2" @change="update('force')" />
          <EsInputNumber v-model:value="data.force.fz" size="tiny" :show-button="false"
            :disabled="!data.force.isEnabled" :min="-Infinity" :max="Infinity" :decimal="2" @change="update('force')" />
        </div>
      </div>

      <!-- 粒子生命周期 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Life`) }}</span>
        <div>
          <EsInputNumber v-model:value="data.force.life" size="tiny" :show-button="false"
            :disabled="!data.force.isEnabled" :min="0" :max="Infinity" @change="update('force')" />
        </div>
      </div>

      <!-- 行为缓解趋势 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Easing`) }}</span>
        <div>
          <EsParticleEasing v-model:value="data.force.easing" size="small" :disabled="!data.force.isEnabled"
            @update:value="update('force')" />
        </div>
      </div>
    </n-collapse-item>

    <!--  缩放粒子  -->
    <n-collapse-item :title="t(`layout.sider.particle.Scale`)" name="scale">
      <!-- 是否启用 -->
      <div class="particle-config-item">
        <span>{{ t(`other.Enable`) }}</span>
        <div>
          <n-checkbox size="small" v-model:checked="data.scale.isEnabled" @update:checked="update('scale')" />
        </div>
      </div>

      <!-- 起始缩放 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Start scale`) }}</span>
        <div>
          <EsInputNumber v-model:value="data.scale.scaleA" size="tiny" :show-button="false"
            :disabled="!data.scale.isEnabled" :min="0" :max="Infinity" :decimal="2" @change="update('scale')" />
        </div>
      </div>

      <!-- 结束缩放 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.End scale`) }}</span>
        <div>
          <EsInputNumber v-model:value="data.scale.scaleB" size="tiny" :show-button="false"
            :disabled="!data.scale.isEnabled" :min="0" :max="Infinity" :decimal="2" @change="update('scale')" />
        </div>
      </div>

      <!-- 粒子生命周期 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Life`) }}</span>
        <div>
          <EsInputNumber v-model:value="data.scale.life" size="tiny" :show-button="false"
            :disabled="!data.scale.isEnabled" :min="0" :max="Infinity" @change="update('scale')" />
        </div>
      </div>

      <!-- 行为缓解趋势 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Easing`) }}</span>
        <div>
          <EsParticleEasing v-model:value="data.scale.easing" size="small" :disabled="!data.scale.isEnabled"
            @update:value="update('scale')" />
        </div>
      </div>
    </n-collapse-item>

    <!--  旋转粒子  -->
    <n-collapse-item :title="t(`layout.sider.particle.Rotate`)" name="rotate">
      <!-- 是否启用 -->
      <div class="particle-config-item">
        <span>{{ t(`other.Enable`) }}</span>
        <div>
          <n-checkbox size="small" v-model:checked="data.rotate.isEnabled" @update:checked="update('rotate')" />
        </div>
      </div>

      <!-- xyz -->
      <div class="particle-config-item">
        <span>XYZ</span>
        <div class="flex">
          <EsInputNumber v-model:value="data.rotate.x" size="tiny" :show-button="false"
            :disabled="!data.rotate.isEnabled" :min="0" :max="360" @change="update('rotate')" />
          <EsInputNumber v-model:value="data.rotate.y" size="tiny" :show-button="false"
            :disabled="!data.rotate.isEnabled" :min="0" :max="360" @change="update('rotate')" />
          <EsInputNumber v-model:value="data.rotate.z" size="tiny" :show-button="false"
            :disabled="!data.rotate.isEnabled" :min="0" :max="360" @change="update('rotate')" />
        </div>
      </div>

      <!-- 粒子生命周期 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Life`) }}</span>
        <div>
          <EsInputNumber v-model:value="data.rotate.life" size="tiny" :show-button="false"
            :disabled="!data.rotate.isEnabled" :min="0" :max="Infinity" @change="update('rotate')" />
        </div>
      </div>

      <!-- 行为缓解趋势 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Easing`) }}</span>
        <div>
          <EsParticleEasing v-model:value="data.rotate.easing" size="small" :disabled="!data.rotate.isEnabled"
            @update:value="update('rotate')" />
        </div>
      </div>
    </n-collapse-item>

    <!--  粒子随机坐标漂移行为  -->
    <n-collapse-item name="randomDrift">
      <template #header>
        <n-text>
          <EsTip class="!justify-start" :content="t(`layout.sider.particle.Random drift`)">
            {{ t(`layout.sider.particle.Behaviour that causes particles to drift to random coordinates in 3D space`) }}
          </EsTip>
        </n-text>
      </template>

      <!-- 是否启用 -->
      <div class="particle-config-item">
        <span>{{ t(`other.Enable`) }}</span>
        <div>
          <n-checkbox size="small" v-model:checked="data.randomDrift.isEnabled"
            @update:checked="update('randomDrift')" />
        </div>
      </div>

      <!-- 随机力 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Random force`) }}</span>
        <div class="flex">
          <EsInputNumber v-model:value="data.randomDrift.driftX" size="tiny" :show-button="false"
            :disabled="!data.randomDrift.isEnabled" :min="0" :max="Infinity" :decimal="2"
            @change="update('randomDrift')" />
          <EsInputNumber v-model:value="data.randomDrift.driftY" size="tiny" :show-button="false"
            :disabled="!data.randomDrift.isEnabled" :min="0" :max="Infinity" :decimal="2"
            @change="update('randomDrift')" />
          <EsInputNumber v-model:value="data.randomDrift.driftZ" size="tiny" :show-button="false"
            :disabled="!data.randomDrift.isEnabled" :min="0" :max="Infinity" :decimal="2"
            @change="update('randomDrift')" />
        </div>
      </div>

      <!-- 漂移延迟 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Delay`) }}</span>
        <EsInputNumber v-model:value="data.randomDrift.delay" size="tiny" :show-button="false"
          :disabled="!data.randomDrift.isEnabled" :min="0" :max="Infinity" :decimal="2"
          @change="update('randomDrift')" />
      </div>

      <!-- 粒子生命周期 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Life`) }}</span>
        <div>
          <EsInputNumber v-model:value="data.randomDrift.life" size="tiny" :show-button="false"
            :disabled="!data.randomDrift.isEnabled" :min="0" :max="Infinity" @change="update('randomDrift')" />
        </div>
      </div>

      <!-- 行为缓解趋势 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Easing`) }}</span>
        <div>
          <EsParticleEasing v-model:value="data.randomDrift.easing" size="small" :disabled="!data.randomDrift.isEnabled"
            @update:value="update('randomDrift')" />
        </div>
      </div>
    </n-collapse-item>

    <!--  粒子弹跳  -->
    <n-collapse-item name="spring">
      <template #header>
        <n-text>
          <EsTip class="!justify-start" :content="t(`layout.sider.particle.Spring`)">
            {{ t(`layout.sider.particle.Behaviour that causes particles to spring`) }}
          </EsTip>
        </n-text>
      </template>

      <!-- 是否启用 -->
      <div class="particle-config-item">
        <span>{{ t(`other.Enable`) }}</span>
        <div>
          <n-checkbox size="small" v-model:checked="data.spring.isEnabled" @update:checked="update('spring')" />
        </div>
      </div>

      <!-- XYZ 轴上的弹跳 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Direction`) }}</span>
        <div class="flex">
          <EsInputNumber v-model:value="data.spring.x" size="tiny" :show-button="false"
            :disabled="!data.spring.isEnabled" :min="0" :max="Infinity" @change="update('spring')" />
          <EsInputNumber v-model:value="data.spring.y" size="tiny" :show-button="false"
            :disabled="!data.spring.isEnabled" :min="0" :max="Infinity" @change="update('spring')" />
          <EsInputNumber v-model:value="data.spring.z" size="tiny" :show-button="false"
            :disabled="!data.spring.isEnabled" :min="0" :max="Infinity" @change="update('spring')" />
        </div>
      </div>

      <!-- 弹跳系数 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Factor`) }}</span>
        <EsInputNumber v-model:value="data.spring.spring" size="tiny" :show-button="false"
          :disabled="!data.spring.isEnabled" :min="0" :max="Infinity" :decimal="2" @change="update('spring')" />
      </div>

      <!-- 摩擦 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Friction`) }}</span>
        <EsInputNumber v-model:value="data.spring.friction" size="tiny" :show-button="false"
          :disabled="!data.spring.isEnabled" :min="0" :max="Infinity" :decimal="2" @change="update('spring')" />
      </div>

      <!-- 粒子生命周期 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Life`) }}</span>
        <div>
          <EsInputNumber v-model:value="data.spring.life" size="tiny" :show-button="false"
            :disabled="!data.spring.isEnabled" :min="0" :max="Infinity" @change="update('spring')" />
        </div>
      </div>

      <!-- 行为缓解趋势 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Easing`) }}</span>
        <div>
          <EsParticleEasing v-model:value="data.spring.easing" size="small" :disabled="!data.spring.isEnabled"
            @update:value="update('spring')" />
        </div>
      </div>
    </n-collapse-item>

    <!--  粒子吸引  -->
    <n-collapse-item name="attraction">
      <template #header>
        <n-text>
          <EsTip class="!justify-start" :content="t(`layout.sider.particle.Attraction`)">
            {{ t(`layout.sider.particle.Behaviour that causes particles to be attracted to a target position`) }}
          </EsTip>
        </n-text>
      </template>

      <!-- 是否启用 -->
      <div class="particle-config-item">
        <span>{{ t(`other.Enable`) }}</span>
        <div>
          <n-checkbox size="small" v-model:checked="data.attraction.isEnabled" @update:checked="update('attraction')" />
        </div>
      </div>

      <!-- 目标位置 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Target position`) }}</span>
        <div class="flex">
          <EsInputNumber v-model:value="data.attraction.x" size="tiny" :show-button="false"
            :disabled="!data.attraction.isEnabled" :min="-Infinity" :max="Infinity" @change="update('attraction')" />
          <EsInputNumber v-model:value="data.attraction.y" size="tiny" :show-button="false"
            :disabled="!data.attraction.isEnabled" :min="-Infinity" :max="Infinity" @change="update('attraction')" />
          <EsInputNumber v-model:value="data.attraction.z" size="tiny" :show-button="false"
            :disabled="!data.attraction.isEnabled" :min="-Infinity" :max="Infinity" @change="update('attraction')" />
        </div>
      </div>

      <!-- 引力系数（标量） -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Force`) }}</span>
        <EsInputNumber v-model:value="data.attraction.force" size="tiny" :show-button="false"
          :disabled="!data.attraction.isEnabled" :min="0" :max="Infinity" @change="update('attraction')" />
      </div>

      <!-- 引力半径 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Radius`) }}</span>
        <EsInputNumber v-model:value="data.attraction.radius" size="tiny" :show-button="false"
          :disabled="!data.attraction.isEnabled" :min="0" :max="Infinity" @change="update('attraction')" />
      </div>

      <!-- 粒子生命周期 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Life`) }}</span>
        <div>
          <EsInputNumber v-model:value="data.attraction.life" size="tiny" :show-button="false"
            :disabled="!data.attraction.isEnabled" :min="0" :max="Infinity" @change="update('attraction')" />
        </div>
      </div>

      <!-- 行为缓解趋势 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Easing`) }}</span>
        <div>
          <EsParticleEasing v-model:value="data.attraction.easing" size="small" :disabled="!data.attraction.isEnabled"
            @update:value="update('attraction')" />
        </div>
      </div>
    </n-collapse-item>

    <!--  粒子碰撞  -->
    <n-collapse-item name="collision">
      <template #header>
        <n-text>
          <EsTip class="!justify-start" :content="t(`layout.sider.particle.Collision`)">
            {{ t(`layout.sider.particle.Behaviour that causes particles to move away from other particles they collide with`) }}
          </EsTip>
        </n-text>
      </template>

      <!-- 是否启用 -->
      <div class="particle-config-item">
        <span>{{ t(`other.Enable`) }}</span>
        <n-checkbox size="small" v-model:checked="data.collision.isEnabled" @update:checked="update('collision')" />
      </div>

      <!-- 质量相关 -->
      <div class="particle-config-item">
        <span>
          <EsTip class="!justify-start" :content="t(`layout.sider.particle.Mass related`)">
            {{ t(`layout.sider.particle.Consider mass when calculating collision displacement`) }}
          </EsTip>
        </span>
        <n-checkbox size="small" v-model:checked="data.collision.useMass"
          :disabled="!data.collision.isEnabled || !hasMass" @update:checked="update('collision')" />
      </div>

      <!-- 粒子生命周期 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Life`) }}</span>
        <div>
          <EsInputNumber v-model:value="data.collision.life" size="tiny" :show-button="false"
            :disabled="!data.collision.isEnabled" :min="0" :max="Infinity" @change="update('collision')" />
        </div>
      </div>

      <!-- 行为缓解趋势 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Easing`) }}</span>
        <div>
          <EsParticleEasing v-model:value="data.collision.easing" size="small" :disabled="!data.collision.isEnabled"
            @update:value="update('collision')" />
        </div>
      </div>
    </n-collapse-item>

    <!--  对粒子应用阿尔法转换效果  -->
    <n-collapse-item name="alpha">
      <template #header>
        <n-text>
          <EsTip class="!justify-start" content="α-effect">
            {{ t(`layout.sider.particle.Behaviour that applies an alpha transition effect to particles`) }}
          </EsTip>
        </n-text>
      </template>

      <!-- 是否启用 -->
      <div class="particle-config-item">
        <span>{{ t(`other.Enable`) }}</span>
        <div>
          <n-checkbox size="small" v-model:checked="data.alpha.isEnabled" @update:checked="update('alpha')" />
        </div>
      </div>

      <!-- 起始alpha -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Start alpha`) }}</span>
        <div>
          <EsInputNumber v-model:value="data.alpha.alphaA" size="tiny" :show-button="false"
            :disabled="!data.alpha.isEnabled" :min="0" :max="1" :decimal="2" @change="update('alpha')" />
        </div>
      </div>

      <!-- 结束alpha -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.End alpha`) }}</span>
        <div>
          <EsInputNumber v-model:value="data.alpha.alphaB" size="tiny" :show-button="false"
            :disabled="!data.alpha.isEnabled" :min="0" :max="1" :decimal="2" @change="update('alpha')" />
        </div>
      </div>

      <!-- 粒子生命周期 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Life`) }}</span>
        <div>
          <EsInputNumber v-model:value="data.alpha.life" size="tiny" :show-button="false"
            :disabled="!data.alpha.isEnabled" :min="0" :max="Infinity" @change="update('alpha')" />
        </div>
      </div>

      <!-- 行为缓解趋势 -->
      <div class="particle-config-item">
        <span>{{ t(`layout.sider.particle.Easing`) }}</span>
        <div>
          <EsParticleEasing v-model:value="data.alpha.easing" size="small" :disabled="!data.alpha.isEnabled"
            @update:value="update('alpha')" />
        </div>
      </div>
    </n-collapse-item>
  </n-collapse>
</template>

<style scoped lang="less">

</style>