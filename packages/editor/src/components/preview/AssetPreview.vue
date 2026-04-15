<template>
	<n-modal
		:show="visible"
		@update:show="emits('update:visible', $event)"
		display-directive="show"
		class="w-66vw h-66vh min-w-1000px"
		@close="emits('update:visible', false)"
	>
		<n-card
			:title="asset.name"
			embedded
			size="small"
			content-class="!p-0 flex gap-x-15px"
			content-style="height: calc(100% - 48px);"
			closable
			@close="handleClose"
		>
			<div ref="assetPreviewRef" id="assetPreview"></div>

			<div class="w-345px mr-15px h-full">
				<n-descriptions label-placement="left" label-class="w-100px" bordered :column="1">
					<n-descriptions-item :label="t('home.assets.Name')">
						{{ asset.name }}
					</n-descriptions-item>
					<n-descriptions-item :label="t('home.assets.Type')">
						{{ t(`home.assets.${asset.type}`) }}
					</n-descriptions-item>
					<n-descriptions-item :label="t('home.assets.Category')">
						{{ asset.categoryName || asset.category }}
					</n-descriptions-item>
					<n-descriptions-item :label="t('bim.Thumbnail')">
						<n-image width="120" :src="getServiceStaticFile(asset.thumbnail)" />
						{{}}
					</n-descriptions-item>
					<n-descriptions-item :label="t('home.assets.Size')">
						{{ filterSize(asset.size) }}
					</n-descriptions-item>
					<n-descriptions-item :label="t('home.assets.Tags')">
						<n-tag type="success" :bordered="false" class="ml-5px" v-for="tag in asset.tags ? asset.tags.split(',') : []" :key="tag">
							{{ tag }}
						</n-tag>
					</n-descriptions-item>
					<n-descriptions-item :label="t('scene.Create time')">
						{{ asset.createTime }}
					</n-descriptions-item>
					<n-descriptions-item :label="t('scene.Update time')">
						{{ asset.updateTime }}
					</n-descriptions-item>
				</n-descriptions>

				<n-button type="primary" class="w-full" :loading="downloadLoading" @click="handleDownload">
					{{ t("plugin.gltfHandler.Download") }}
				</n-button>
			</div>
		</n-card>
	</n-modal>
</template>

<script setup lang="ts">
	import { ref, nextTick, watch, useTemplateRef, onBeforeUnmount } from "vue";
	import { Preview } from "@astral3d/engine";
	import { t } from "@/language";
	import { downloadWithFetch, filterSize, getServiceStaticFile } from "@/utils/common/file";

	const props = withDefaults(
		defineProps<{
			visible: boolean;
			asset: IAssets.Item;
		}>(),
		{
			visible: false,
			asset: () => ({
				name: "",
				type: "Model",
				category: "",
				thumbnail: "",
				size: 0,
				file: "",
				createTime: "",
				updateTime: "",
			}),
		}
	);
	const emits = defineEmits(["update:visible"]);

	let previewer: Preview | null = null;

	const assetPreviewRef = useTemplateRef("assetPreviewRef");

	watch(
		() => props.visible,
		async newVal => {
			if (newVal) {
				if (!previewer) {
					await nextTick();

					previewer = new Preview({
						container: assetPreviewRef.value,
						hdr: "/static/resource/hdr/cloudy.hdr",
						request: {
							baseUrl: "/file/static/",
						},
					});
				}

				if (props.asset.file) {
					previewer.load(getServiceStaticFile(props.asset.file), props.asset.type);
				}
			} else {
				disposePreviewer();
			}
		}
	);

	onBeforeUnmount(() => {
		disposePreviewer();
	});

	function disposePreviewer() {
		if (previewer) {
			previewer.dispose();
			previewer = null;
		}
	}

	function handleClose() {
		emits("update:visible", false);
	}

	const downloadLoading = ref(false);

	function handleDownload() {
		downloadLoading.value = true;

		downloadWithFetch(getServiceStaticFile(props.asset.file)).finally(() => {
			downloadLoading.value = false;
		});
	}
</script>

<style scoped lang="less">
	#assetPreview {
		width: calc(100% - 360px);
		height: 100%;
	}

	.n-descriptions {
		height: calc(100% - 65px);
		margin-bottom: 15px;
		overflow-y: auto;
	}
</style>
