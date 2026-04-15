<template>
  <n-dropdown :options="exportOptions" placement="bottom-start" trigger="click" @select="handleExportSelect">
    <n-button class="mr-2">
      <template #icon>
        <n-icon size="22">
          <DocumentExport/>
        </n-icon>
      </template>
      {{ t("layout.header.Export") }}
    </n-button>
  </n-dropdown>

  <n-button type="primary" @click="handleImport">
    <template #icon>
      <n-icon>
        <DocumentImport/>
      </n-icon>
    </template>
    {{ t("layout.header.Import") }}
  </n-button>
</template>

<script setup lang="ts">
import {onMounted} from "vue";
import {DocumentImport, DocumentExport} from "@vicons/carbon";
import {t} from "@/language";
import {App, Export, Loader} from "@astral3d/engine";

const exportClass = new Export();

const exportOptions = [
  {
    label: t("layout.header['Export Object']"),
    key: "exportObject",
    children: [
      {
        label: "JSON",
        key: "exportObjectToJSON"
      },
      {
        label: "GLB",
        key: "exportObjectToGlb"
      },
      {
        label: "GLTF",
        key: "exportObjectToGltf"
      },
      {
        label: "OBJ",
        key: "exportObjectToObj"
      },
      {
        label: "PLY",
        key: "exportObjectToPly"
      },
      {
        label: t("layout.header['PLY (Binary)']"),
        key: "exportObjectToPlyBinary"
      },
      {
        label: "STL",
        key: "exportObjectToStl"
      },
      {
        label: t("layout.header['STL (Binary)']"),
        key: "exportObjectToStlBinary"
      },
      {
        label: "USDZ",
        key: "exportObjectToUSDZ"
      }
    ]
  },
  {
    label: t("layout.header['Export Scene']"),
    key: "exportScene",
    children: [
      {
        label: "JSON",
        key: "exportSceneToJSON"
      },
      {
        label: "GLB",
        key: "exportSceneToGlb"
      },
      {
        label: "GLTF",
        key: "exportSceneToGltf"
      },
      {
        label: "OBJ",
        key: "exportSceneToObj"
      },
      {
        label: "PLY",
        key: "exportSceneToPly"
      },
      {
        label: t("layout.header['PLY (Binary)']"),
        key: "exportSceneToPlyBinary"
      },
      {
        label: "STL",
        key: "exportSceneToStl"
      },
      {
        label: t("layout.header['STL (Binary)']"),
        key: "exportSceneToStlBinary"
      },
      {
        label: "USDZ",
        key: "exportSceneToUSDZ"
      }
    ]
  }
]

function handleImport() {
  const form = document.createElement('form');
  form.style.display = 'none';
  document.body.appendChild(form);

  const fileInput = document.createElement('input');
  fileInput.multiple = true;
  fileInput.type = 'file';
  fileInput.addEventListener('change', function () {
    Loader.loadFiles(fileInput.files, undefined)
        .catch((err) => {
          window.$message?.error(err);
        })
        .finally(() => {
          form.reset();
        });
  });
  form.appendChild(fileInput);

  fileInput.click();
}

function handleExportSelect(key: string) {
  if (key.startsWith("exportObject")) {
    if (App.selected === null) {
      window.$message?.error(window.$t("prompt['No object selected.']"));
      return;
    }
  }

  exportClass[key]();
}

onMounted(() => {
})
</script>

<style scoped lang="less"></style>