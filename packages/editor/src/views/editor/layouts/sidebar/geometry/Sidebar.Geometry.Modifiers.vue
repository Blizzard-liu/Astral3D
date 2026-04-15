<script lang="ts" setup>
import {App,Hooks} from "@astral3d/engine";
import {t} from "@/language";

//计算顶点法线
function computeVertexNormals() {
  if(!App.selected) return;

  const geometry = App.selected.geometry;
  geometry.computeVertexNormals();
  Hooks.useDispatchSignal("geometryChanged", App.selected);
}

//居中
function centerGeometry() {
  if(!App.selected) return;

  const geometry = App.selected.geometry;
  geometry.center();
  Hooks.useDispatchSignal("geometryChanged", App.selected);
}
</script>

<template>
  <!-- Compute Vertex Normals -->
  <div class="sider-scene-geometry-item">
    <span></span>
    <div>
      <n-button size="small" @click="computeVertexNormals">{{ t("layout.sider.geometry['Compute Vertex Normals']") }}
      </n-button>
    </div>
  </div>
  <!-- Center Geometry -->
  <div class="sider-scene-geometry-item">
    <span></span>
    <div>
      <n-button size="small" @click="centerGeometry">{{ t("layout.sider.scene.Center") }}</n-button>
    </div>
  </div>
</template>