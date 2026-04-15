<template>
    <div class="absolute left-10px bottom-10px color-white text-12px">
        <span class="ml-6px">{{ t("layout.scene.viewportInfo.Objects") }}: {{ objectsText }}</span>
        <span class="ml-6px">{{ t("layout.scene.viewportInfo.Vertices") }}: {{ verticesText }}</span>
        <span class="ml-6px">{{ t("layout.scene.viewportInfo.Triangles") }}: {{ trianglesText }}</span>
        <span class="ml-6px">{{ t("layout.scene.viewportInfo.Frame time") }}: {{ frameTimeText }}</span>
    </div>
</template>

<script lang="ts" setup>
import { ref,onMounted, onBeforeUnmount } from "vue";
import { App,Hooks } from "@astral3d/engine";
import { t } from "@/language";

const objectsText = ref("0");
const verticesText = ref("0");
const trianglesText = ref("0");
const frameTimeText = ref("0 ms");

onMounted(() => {
  Hooks.useAddSignal("objectAdded",update);
  Hooks.useAddSignal("objectRemoved",update);
  Hooks.useAddSignal("geometryChanged",update);
  Hooks.useAddSignal("sceneRendered",updateFrameTime);
})
onBeforeUnmount(() => {
  Hooks.useRemoveSignal("objectAdded",update);
  Hooks.useRemoveSignal("objectRemoved",update);
  Hooks.useRemoveSignal("geometryChanged",update);
  Hooks.useRemoveSignal("sceneRendered",updateFrameTime);
})

function update() {
    const scene = App.scene;
    let objects = 0, vertices = 0, triangles = 0;
    for (let i = 0, l = scene.children.length; i < l; i++) {
        const object = scene.children[i];
        object.traverseByCondition((object) => {
            objects++;
            if (object.isMesh || object.isPoints) {
                const geometry = object.geometry;
                vertices += geometry.attributes.position?.count || 0;
                if (object.isMesh) {
                    if (geometry.index !== null) {
                        triangles += geometry.index.count / 3;
                    } else {
                        triangles += (geometry.attributes.position?.count || 0) / 3;
                    }
                }
            }
        }, (c) => {
          return !c.ignore;
        });
    }

    objectsText.value = objects.format();
    verticesText.value = vertices.format();
    trianglesText.value = triangles.format();
}

function updateFrameTime(frameTime: string) {
  frameTimeText.value = Number(frameTime).toFixed(2) + ' ms';
}
</script>