<template>
    <div id="extra-resource-particles">
        <div class="flex-1 overflow-y-auto">
            <div class="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3">
                <n-card size="small" hoverable v-for="item in filteredList" :key="item.key"
                    @dblclick="addToScene(item.key,item.name)" draggable="true" @dragstart="dragStart($event, item.key)"
                    @dragend="dragEnd" @contextmenu.prevent="handlePreview(item)">
                    <template #cover>
                        <img :src="item.img" :alt="item.name.value" draggable="false" class="w-full h-full object-cover" />
                    </template>
                    <n-tooltip placement="bottom" trigger="hover">
                        <template #trigger> {{ item.name }}</template>
                        <span> {{ item.name }} </span>
                    </n-tooltip>
                </n-card>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {inject, computed, nextTick} from "vue";
import type { Ref } from "vue";
import {Box3, Vector3} from "three";
import { Particles,Preview } from "@astral3d/engine";
import { cpt } from "@/language";
import { useDragStore } from "@/store/modules/drag";
import { screenToWorld } from "@/utils/common/scenes";

const searchText = inject('searchText') as Ref<string>;
const previewInfo = inject('previewInfo') as any;
const previewRef = inject('previewRef') as any;

const particleList = [
    { key: "smoke", img: "/static/images/resource/particle/smoke.jpg", name: cpt("extra.resource.particle.Smoke") },
    { key: "fire", img: "/static/images/resource/particle/fire.jpg", name: cpt("extra.resource.particle.Fire") },
    { key: "fireLine", img: "/static/images/resource/particle/fireLine.jpg", name: cpt("extra.resource.particle.Fire line") },
    { key: "fireworks", img: "/static/images/resource/particle/fireworks.jpg", name: cpt("extra.resource.particle.Fireworks") },
    { key: "firefly", img: "/static/images/resource/particle/firefly.jpg", name: cpt("extra.resource.particle.Fire fly") },
]

const filteredList = computed(() => {
    return particleList.filter((item) => (<string>(item.name.value || item.name)).toLowerCase().includes(searchText.value.toLowerCase()));
});

// 预览
async function handlePreview(item){
  previewInfo.name = (item.name as Ref<string>).value || item.name;
  previewInfo.type = "Particle";

  previewInfo.visible = true;

  await nextTick();

  previewRef.value?.getPreviewer().then((previewer:Preview) => {
    if(!previewer) return;

    const {emitter,body} = Particles[item.key]();

    previewer.addParticle(emitter,body,previewInfo.name);

    const box3 = new Box3();
    box3.set(new Vector3(-10, 0, -10), new Vector3(10, 10, 10));

    previewer.modules.controls.fitToBox(box3,true);
  })
}

//双击添加至场景..
function addToScene(key,name) {
    const {emitter,body} = Particles[key]();

    window.viewer.addParticle(emitter,body,name.value);
}

// 开始拖拽事件
const dragStore = useDragStore();

function dragStart(_, key) {
    dragStore.setData(key)
}

function dragEnd() {
    if (dragStore.getActionTarget !== "addToScene" || dragStore.endArea !== "Scene") return;

    const position = screenToWorld(dragStore.endPosition.x, dragStore.endPosition.y);

    const key = dragStore.getData;
    const {emitter,body} = Particles[key](position);
    window.viewer.addParticle(emitter,body,particleList.find(item => item.key === key)?.name.value);

    dragStore.setActionTarget("");
}
</script>

<style scoped lang="less">
#extra-resource-particles {
    overflow-x: hidden;

    .n-card {
        cursor: pointer;

        :deep(.n-card__content) {
          padding: 0.15rem 0;
          font-size: 0.65rem;
          text-align: center;
      }
    }
}
</style>
