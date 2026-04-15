<template>
  <div id="extra-resource-materials" class="flex flex-col">
    <!-- 子分类标签 -->
    <div class="mb-3 flex flex-wrap items-center gap-2">
      <n-button v-for="subCategory in subCategories" :key="subCategory.key" strong secondary round
                :type="activeSubCategory === subCategory.key ? 'primary' : 'default'"
                @click="selectSubCategory(subCategory.key)">
        {{ subCategory.name }}
      </n-button>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div class="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3">
        <n-card size="small" hoverable v-for="item in filteredList" :key="item.key"
                @contextmenu.prevent="handlePreview(item)" @dblclick="apply(item)"
                draggable="true" @dragstart="dragStart(item)" @dragend="dragEnd">
          <template #cover>
            <img :src="item.img" :alt="item.key" draggable="false" class="w-full h-full object-cover"/>
          </template>
          <n-tooltip placement="bottom" trigger="hover">
            <template #trigger> {{ item.name.value || item.name }}</template>
            <span> {{ item.name.value || item.name }} </span>
          </n-tooltip>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, inject, toRaw, computed, nextTick} from "vue";
import type {Ref} from "vue";
import {Vector2,SphereGeometry,PlaneGeometry,Mesh} from 'three';
import {App,Utils,Hooks,SetMaterialCommand,CircleGridShaderMaterial,DynamicCheckerboardShaderMaterial,SlowSmokeShaderMaterial,FlickerShaderMaterial,StreamerWallShaderMaterial} from "@astral3d/engine";
import {t, cpt} from "@/language";
import { useDragStore } from "@/store/modules/drag";
import {reBufferGeometryUv} from "@/utils/common/scenes";

const searchText = inject('searchText') as Ref<string>;
const previewInfo = inject('previewInfo') as any;
const previewRef = inject('previewRef') as any;

const activeSubCategory = ref('wallBrick');
const subCategories = ref([
  {key: 'wallBrick', name: cpt('extra.resource.material.Wall brick')},
  {key: 'metal', name: cpt('extra.resource.material.Metal')},
  {key: 'shader', name: 'Shader'},
]);

// 切换子分类
function selectSubCategory(key: string) {
  activeSubCategory.value = key;
}

const materials = {
  'wallBrick': [
    {
      key: "redBrick",
      name: cpt("extra.resource.material.Red brick"),
      img: "/static/images/resource/material/wallBrick/redBrick.jpg",
      textures:{
        baseColor:"/static/resource/material/wallBrick/red_brick/red_brick_diff_1k.jpg",
        normal:"/static/resource/material/wallBrick/red_brick/red_brick_nor_gl_1k.exr",
        //displacement:"/static/resource/material/wallBrick/red_brick/red_brick_disp_1k.png",
        // arm:AO/Rough/Metal; AO使用红色通道，Rough使用绿色通道，Metal使用蓝色通道
        metalness:"/static/resource/material/wallBrick/red_brick/red_brick_arm_1k.jpg",
        roughness:"/static/resource/material/wallBrick/red_brick/red_brick_arm_1k.jpg",
        ao:"/static/resource/material/wallBrick/red_brick/red_brick_arm_1k.jpg",
      }
    },
    {
      key: "redSandstone",
      name: cpt("extra.resource.material.Red sandstone"),
      img: "/static/images/resource/material/wallBrick/redSandstone.jpg",
      textures:{
        baseColor:"/static/resource/material/wallBrick/red_sandstone/red_sandstone_wall_diff_1k.exr",
        normal:"/static/resource/material/wallBrick/red_sandstone/red_sandstone_wall_nor_gl_1k.jpg",
        //displacement:"/static/resource/material/wallBrick/red_sandstone/red_sandstone_wall_disp_1k.jpg",
        // arm:AO/Rough/Metal; AO使用红色通道，Rough使用绿色通道，Metal使用蓝色通道
        metalness:"/static/resource/material/wallBrick/red_sandstone/red_sandstone_wall_arm_1k.jpg",
        roughness:"/static/resource/material/wallBrick/red_sandstone/red_sandstone_wall_arm_1k.jpg",
        ao:"/static/resource/material/wallBrick/red_sandstone/red_sandstone_wall_arm_1k.jpg",
      }
    },
    {
      key: "rusticStoneWall",
      name: cpt("extra.resource.material.Rustic stone wall"),
      img: "/static/images/resource/material/wallBrick/rusticStoneWall.jpg",
      textures:{
        baseColor:"/static/resource/material/wallBrick/rustic_stone_wall/rustic_stone_wall_02_diff_1k.exr",
        normal:"/static/resource/material/wallBrick/rustic_stone_wall/rustic_stone_wall_02_nor_gl_1k.jpg",
        //displacement:"/static/resource/material/wallBrick/rustic_stone_wall/rustic_stone_wall_02_disp_1k.jpg",
        // arm:AO/Rough/Metal; AO使用红色通道，Rough使用绿色通道，Metal使用蓝色通道
        metalness:"/static/resource/material/wallBrick/rustic_stone_wall/rustic_stone_wall_02_arm_1k.jpg",
        roughness:"/static/resource/material/wallBrick/rustic_stone_wall/rustic_stone_wall_02_arm_1k.jpg",
        ao:"/static/resource/material/wallBrick/rustic_stone_wall/rustic_stone_wall_02_arm_1k.jpg",
      }
    }
  ],
  'metal':[
    {
      key: "rusty",
      name: cpt("extra.resource.material.Rusty"),
      img: "/static/images/resource/material/metal/rusty.jpg",
      textures:{
        baseColor:"/static/resource/material/metal/rusty/rusty_metal_04_diff_1k.jpg",
        normal:"/static/resource/material/metal/rusty/rusty_metal_04_nor_gl_1k.jpg",
        //displacement:"/static/resource/metal/rusty/red_brick/rusty_metal_04_disp_1k.jpg",
        metalness:"/static/resource/material/metal/rusty/rusty_metal_04_arm_1k.jpg",
        roughness:"/static/resource/material/metal/rusty/rusty_metal_04_arm_1k.jpg",
        ao:"/static/resource/material/metal/rusty/rusty_metal_04_arm_1k.jpg",
      },
      properties:{
        metalness: 1,
        roughness: 0.5
      }
    },
    {
      key: "gold",
      name: cpt("extra.resource.material.Gold"),
      img: "/static/images/resource/material/metal/gold.jpg",
      textures:{
        baseColor:"/static/resource/material/metal/gold/1K-Metallic_gold_Base Color.jpg",
        metalness:"/static/resource/material/metal/gold/1K-Metallic_gold_Metallic.jpg",
        roughness:"/static/resource/material/metal/gold/1K-Metallic_gold_Roughness.jpg",
      },
      properties:{
        metalness: 1,
        roughness: 0.5
      }
    },
  ],
  'shader': [
    {
      key: "CircleGridShaderMaterial",
      name: cpt("extra.resource.material.Diffused color line"),
      img: "/static/images/resource/material/shader/CircleGrid.jpg",
      class: CircleGridShaderMaterial
    },
    {
      key: "DynamicCheckerboardShaderMaterial",
      name: cpt("extra.resource.material.Dynamic checkerboard"),
      img: "/static/images/resource/material//shader/DynamicCheckerboard.png",
      class: DynamicCheckerboardShaderMaterial
    },
    {
      key: "SlowSmokeShaderMaterial",
      name: cpt("extra.resource.material.Slow smoke"),
      img: "/static/images/resource/material//shader/SlowSmoke.jpg",
      class: SlowSmokeShaderMaterial
    },
    {
      key: "StreamerWallShaderMaterial",
      name: cpt("extra.resource.material.Flow line"),
      img: "/static/images/resource/material//shader/StreamerWall.jpg",
      class: StreamerWallShaderMaterial
    },
    {
      key: "FlickerShaderMaterial",
      name: cpt("extra.resource.material.Flicker"),
      img: "/static/images/resource/material//shader/Flicker.png",
      class: FlickerShaderMaterial},
  ]
};

const filteredList = computed(() => {
  return materials[activeSubCategory.value].filter((item) => (item.name.value || item.name).toLowerCase().includes(searchText.value.toLowerCase()));
});

/* 材质预览 */
async function handlePreview(item) {
  previewInfo.name = (item.name as Ref<string>).value || item.name;
  previewInfo.type = "Material";
  previewInfo.visible = true;

  await nextTick();

  const previewer = await previewRef.value?.getPreviewer();
  if(!previewer) return;

  // shader
  if(item.class){
    const m = toRaw(item.class.PreviewMaterial);
    const mesh = new Mesh(new PlaneGeometry(2, 2), m);
    previewer.scene.add(mesh);
    previewer.addEventListener("beforeRender",() => {
      item.class.UpdatePreview(m);
    })
    Utils.focusObject(mesh,previewer.modules.controls);
  }else{
    App.createPBRMaterial(item.textures,item.properties).then(material => {
      const mesh = new Mesh(
          new SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI),
          material
      );
      previewer.scene.add(mesh);
      Utils.focusObject(mesh,previewer.modules.controls);
    }).catch(() => {
      window.$message?.error(t("prompt['Load fail,Please try again later!']"));
    })
  }
}

// 应用材质
function apply(item, targetObject?) {
  const object = targetObject || App.selected;

  if (!object) {
    window.$message?.error(t("prompt['No object selected.']"))
    return;
  }

  if(!object.material){
    window.$message?.error(t("prompt['Can not be applied to the current object']"))
    return;
  }

  const materialName = (item.name.value || item.name);

  // shader
  if (item.class) {
    if (Array.isArray(object.material)) {
      if (object.material.length === 0) {
        window.$message?.error(t("prompt['No object selected.']"))
        return;
      }

      object.material.forEach(m => {
        App.removeMaterial(m);
      });
      App.execute(new SetMaterialCommand(object, item.class.Material), 'Apply Material: ' + materialName);
      App.addMaterial(object.material);

      // 平铺uv
      reBufferGeometryUv(object.geometry);
      Hooks.useDispatchSignal("sceneGraphChanged");

      return;
    }

    App.removeMaterial(object.material);
    App.execute(new SetMaterialCommand(object, item.class.Material), 'Apply Material: ' + materialName);
    App.addMaterial(object.material);

    // 平铺uv
    reBufferGeometryUv(object.geometry);
    Hooks.useDispatchSignal("sceneGraphChanged");
  }else if(item.textures){
    // pbr
    if (Array.isArray(object.material)) {
      if (object.material.length === 0) {
        window.$message?.error(t("prompt['No object selected.']"))
        return;
      }

      App.createPBRMaterial(item.textures,item.properties).then(newMaterial => {
        newMaterial.name = materialName;

        object.material.forEach(m => {
          App.removeMaterial(m);
        });
        App.execute(new SetMaterialCommand(object, newMaterial), 'Apply Material: ' + materialName);
        App.addMaterial(newMaterial);

        Hooks.useDispatchSignal("sceneGraphChanged");
      }).catch(() => {
        window.$message?.error(t("prompt['Load fail,Please try again later!']"));
      })

      return;
    }

    App.createPBRMaterial(item.textures,item.properties).then(newMaterial => {
      newMaterial.name = materialName;

      App.removeMaterial(object.material);
      App.execute(new SetMaterialCommand(object, newMaterial), 'Apply Material: ' + materialName);
      App.addMaterial(newMaterial);

      Hooks.useDispatchSignal("sceneGraphChanged");
    }).catch(() => {
      window.$message?.error(t("prompt['Load fail,Please try again later!']"));
    })
  }
}

// 开始拖拽事件
const dragStore = useDragStore();

function dragStart(item){
  dragStore.setData(item)
}

function dragEnd(event) {
  if (dragStore.getActionTarget !== "addToScene" || dragStore.endArea !== "Scene") return;

  const position = new Vector2();
  const array = Utils.getMousePosition(window.viewer.container, event.clientX, event.clientY);
  position.fromArray(array);
  const intersects = window.viewer.getIntersects(position);
  if(intersects.length > 0){
    const object = intersects[0].object;

    apply(dragStore.getData,object);
  }

  dragStore.setActionTarget("");
}
</script>

<style scoped lang="less">
#extra-resource-materials {
  overflow-x: hidden;

  .n-card {
    cursor: pointer;

    :deep(.n-card__content) {
      padding: 0.3rem 0;
      font-size: 0.65rem;
      text-align: center;

      .n-button {
        font-size: 0.65rem !important;
      }
    }
  }
}
</style>
