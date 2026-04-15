<script setup lang="ts">
import {ref} from "vue";
import {t} from "@/language";
import EsFormItemHelpLabel from "@/components/es/EsFormItemHelpLabel.vue";

const model = ref<IPlugin.GLTFHandlerOptimizeModel>({
  'compress': "draco",
  'meshoptLevel': "high",
  'instance': true,
  'instanceMin': 5,
  'flatten': true,
  'join': true,
  'palette': true,
  'paletteMin': 5,
  'prune': true,
  'pruneAttributes': true,
  'pruneLeaves': true,
  'pruneSolidTextures': true,
  'weld': true,
  'simplify': true,
  'simplifyError': 0.01,
  'simplifyLockBorder': false,
  'simplifyRatio': 0,
  'textureCompress': "webp",
  'textureSize': 512,
})

function handleKeyword(keyword: string, p: string) {
  const strs = p.split(keyword);

  return `${strs[0]}<span class="color-red">${keyword}</span>${strs[1]}`;
}

// 合并网格(开启合并网格必开启展平场景树)
function handleJoinChange(checked: boolean) {
  if (checked) {
    model.value.flatten = true;
  }
}

// 简化网格(开启简化网格必开启合并同位顶点)
function handleSimplifyChange(checked: boolean) {
  if (checked) {
    model.value.weld = true;
  }
}

defineExpose({
  model
})
</script>

<template>
  <n-form ref="formRef" :model="model" label-placement="left" label-width="auto" class="optimize-form">
    <n-grid :cols="24" :x-gap="24">
      <!--  压缩方式  -->
      <n-form-item-gi :span="12">
        <template #label>
          <EsFormItemHelpLabel :label="t('plugin.gltfHandler.Compress')">
            <div>
              {{ t("plugin.gltfHandler['Floating point compression method.']") }}<br/>
              <span class="color-red">Draco</span>：{{ t('plugin.gltfHandler.compresses') }} geometry <br/>
              <span class="color-red">Meshopt & Quantization</span>：{{ t('plugin.gltfHandler.compresses') }} geometry &
              animation
            </div>
          </EsFormItemHelpLabel>
        </template>
        <n-select v-model:value="model.compress" class="!w-full" :options="[
            {label:'Draco',value:'draco'},
            {label:'Meshopt',value:'meshopt'},
            {label:'Quantization',value:'quantize'},
            {label:'None',value:'false'}
        ]"/>
      </n-form-item-gi>

      <!--  Meshopt压缩级别  -->
      <n-form-item-gi v-if="model.compress === 'meshopt'" :span="12" :label="t('plugin.gltfHandler.Meshopt compression level')">
        <n-select v-model:value="model.meshoptLevel" class="!w-full" :options="[
            {label:'medium',value:'medium'},
            {label:'high',value:'high'}
        ]"/>
      </n-form-item-gi>

      <!--  实例化网格  -->
      <n-form-item-gi :span="12">
        <template #label>
          <EsFormItemHelpLabel :label="t('plugin.gltfHandler.Instance')">
            {{ t("plugin.gltfHandler['Use GPU instancing with shared mesh references.']") }}
          </EsFormItemHelpLabel>
        </template>
        <n-switch v-model:value="model.instance"/>
      </n-form-item-gi>

      <!--  实例化网格界限  -->
      <n-form-item-gi v-if="model.instance" :span="12">
        <template #label>
          <EsFormItemHelpLabel :label="t('plugin.gltfHandler.Instance min')">
            {{ t("plugin.gltfHandler['Number of instances required for instancing.']") }}
          </EsFormItemHelpLabel>
        </template>
        <n-input-number v-model:value="model.instanceMin" :min="2" :max="Infinity" class="!w-full"/>
      </n-form-item-gi>

      <!--  展平场景树  -->
      <n-form-item-gi :span="12">
        <template #label>
          <EsFormItemHelpLabel :label="t('plugin.gltfHandler.Flatten')">
            <div>
              {{ t("plugin.gltfHandler['Flatten scene graph.']") }}<br/>
              <div
                  v-html="handleKeyword(t('plugin.gltfHandler.Join'),t('plugin.gltfHandler.This item cannot be closed when opening Join'))"></div>
            </div>
          </EsFormItemHelpLabel>
        </template>
        <n-switch v-model:value="model.flatten" :disabled="model.join"/>
      </n-form-item-gi>

      <!--  合并网格  -->
      <n-form-item-gi :span="12">
        <template #label>
          <EsFormItemHelpLabel :label="t('plugin.gltfHandler.Join')">
            <div>
              {{ t("plugin.gltfHandler['Join meshes and reduce draw calls.']") }}<br/>
              <div
                  v-html="handleKeyword(t('plugin.gltfHandler.Flatten'),t('plugin.gltfHandler[\'Prerequisites: Flatten is enabled\']'))"></div>
            </div>
          </EsFormItemHelpLabel>
        </template>
        <n-switch v-model:value="model.join" @update:value="handleJoinChange"/>
      </n-form-item-gi>

      <!--  合并纹理  -->
      <n-form-item-gi :span="12">
        <template #label>
          <EsFormItemHelpLabel :label="t('plugin.gltfHandler.Palette')">
            {{ t("plugin.gltfHandler['Creates palette textures and merges materials.']") }}<br/>
          </EsFormItemHelpLabel>
        </template>
        <n-switch v-model:value="model.palette"/>
      </n-form-item-gi>

      <!--  合并纹理界限  -->
      <n-form-item-gi v-if="model.palette" :span="12">
        <template #label>
          <EsFormItemHelpLabel :label="t('plugin.gltfHandler.Palette min')">
            {{
              t("plugin.gltfHandler['Minimum number of blocks in the palette texture. If fewer unique material values are found, no palettes will be generated.']")
            }}
          </EsFormItemHelpLabel>
        </template>
        <n-input-number v-model:value="model.paletteMin" :min="2" :max="Infinity" class="!w-full"/>
      </n-form-item-gi>

      <!--  修剪  -->
      <n-form-item-gi :span="12">
        <template #label>
          <EsFormItemHelpLabel :label="t('plugin.gltfHandler.Prune')">
            {{
              t("plugin.gltfHandler['Removes properties from the file if they are not referenced by a Scene.']")
            }}<br/>
          </EsFormItemHelpLabel>
        </template>
        <n-switch v-model:value="model.prune"/>
      </n-form-item-gi>

      <template v-if="model.prune">
        <!--  修剪顶点  -->
        <n-form-item-gi :span="12">
          <template #label>
            <EsFormItemHelpLabel :label="t('plugin.gltfHandler.Prune attributes')">
              {{ t("plugin.gltfHandler['Whether to prune unused vertex attributes.']") }}<br/>
            </EsFormItemHelpLabel>
          </template>
          <n-switch v-model:value="model.pruneAttributes"/>
        </n-form-item-gi>

        <!--  修剪子节点  -->
        <n-form-item-gi :span="12">
          <template #label>
            <EsFormItemHelpLabel :label="t('plugin.gltfHandler.Prune leaves')">
              {{ t("plugin.gltfHandler['Whether to prune empty leaf nodes.']") }}<br/>
            </EsFormItemHelpLabel>
          </template>
          <n-switch v-model:value="model.pruneLeaves"/>
        </n-form-item-gi>

        <!--  修剪纹理  -->
        <n-form-item-gi :span="12">
          <template #label>
            <EsFormItemHelpLabel :label="t('plugin.gltfHandler.Prune solid textures')">
              {{
                t("plugin.gltfHandler['Whether to prune solid (single-color) textures,converting them to material factors.']")
              }}<br/>
            </EsFormItemHelpLabel>
          </template>
          <n-switch v-model:value="model.pruneSolidTextures"/>
        </n-form-item-gi>
      </template>

      <!--  合并同位顶点  -->
      <n-form-item-gi :span="12">
        <template #label>
          <EsFormItemHelpLabel :label="t('plugin.gltfHandler.Weld')">
            <div>
              {{ t("plugin.gltfHandler['Merge equivalent vertices.']") }}<br/>
              <div
                  v-html="handleKeyword(t('plugin.gltfHandler.Simplify'),t('plugin.gltfHandler.This item cannot be closed when opening Simplify'))"></div>
            </div>
          </EsFormItemHelpLabel>
        </template>
        <n-switch v-model:value="model.weld" :disabled="model.simplify"/>
      </n-form-item-gi>

      <!--  简化网格  -->
      <n-form-item-gi :span="12">
        <template #label>
          <EsFormItemHelpLabel :label="t('plugin.gltfHandler.Simplify')">
            <div>
              {{ t("plugin.gltfHandler['Simplify mesh geometry with meshoptimizer.']") }}<br/>
              <div
                  v-html="handleKeyword(t('plugin.gltfHandler.Weld'),t('plugin.gltfHandler[\'Prerequisites: Weld is enabled\']'))"></div>
            </div>
          </EsFormItemHelpLabel>
        </template>
        <n-switch v-model:value="model.simplify" @update:value="handleSimplifyChange"/>
      </n-form-item-gi>

      <template v-if="model.simplify">
        <!--  简化误差界限  -->
        <n-form-item-gi :span="12">
          <template #label>
            <EsFormItemHelpLabel :label="t('plugin.gltfHandler.Simplify error')">
              {{ t("plugin.gltfHandler['Simplification error tolerance, as a fraction of mesh extent.']") }}
            </EsFormItemHelpLabel>
          </template>
          <n-input-number v-model:value="model.simplifyError" :min="0.01" :max="100" :step="0.01" :precision="2"
                          class="!w-full">
            <template #suffix> %</template>
          </n-input-number>
        </n-form-item-gi>

        <!--  简化锁定边界  -->
        <n-form-item-gi :span="12">
          <template #label>
            <EsFormItemHelpLabel :label="t('plugin.gltfHandler.Simplify lock border')">
              {{ t("plugin.gltfHandler['Whether to lock topological borders of the mesh.']") }}
            </EsFormItemHelpLabel>
          </template>
          <n-switch v-model:value="model.simplifyLockBorder"/>
        </n-form-item-gi>

        <!--  简化比率  -->
        <n-form-item-gi :span="12">
          <template #label>
            <EsFormItemHelpLabel :label="t('plugin.gltfHandler.Simplify ratio')">
              {{ t("plugin.gltfHandler['Target ratio (0-1) of vertices to keep.']") }}
            </EsFormItemHelpLabel>
          </template>

          <n-slider v-model:value="model.simplifyRatio" :min="0" :max="1" :step="0.01"/>
        </n-form-item-gi>
      </template>

      <!--  纹理压缩  -->
      <n-form-item-gi :span="12">
        <template #label>
          <EsFormItemHelpLabel :label="t('plugin.gltfHandler.Texture compress')">
            <div>
              {{ t("plugin.gltfHandler['AVIF and WebP optimize transfer size;']") }}<br/>
              {{ t("plugin.gltfHandler['Auto Compresses in the original format;']") }}<br/>
              {{ t("plugin.gltfHandler['none Does not compress.']") }}
            </div>
          </EsFormItemHelpLabel>
        </template>
        <n-select v-model:value="model.textureCompress" class="!w-full" :options="[
            {label:'WebP',value:'webp'},
            {label:'AVIF',value:'avif'},
            {label:'Auto',value:'auto'},
            {label:'None',value:'none'}
        ]"/>
      </n-form-item-gi>

      <!--  纹理最大尺寸  -->
      <n-form-item-gi :span="12">
        <template #label>
          <EsFormItemHelpLabel :label="t('plugin.gltfHandler.Texture size')">
            {{ t("plugin.gltfHandler['Maximum texture dimensions, in pixels.']") }}
          </EsFormItemHelpLabel>
        </template>
        <n-input-number v-model:value="model.textureSize" :min="2" :step="2" :max="Infinity" class="!w-full">
          <template #suffix> px</template>
        </n-input-number>
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<style scoped lang="less">
.optimize-form {
  margin-top: 20px;
  overflow-y: auto;
  overflow-x: auto;
}
</style>