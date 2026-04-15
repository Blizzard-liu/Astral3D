<script setup lang="ts">
	import { ref, onMounted } from "vue";
	import { Close } from "@vicons/carbon";
	import { t } from "@/language";
	import { fetchSceneExampleList } from "@/http/api/sceneExample";
	import ProjectInfoForm from "@/components/project/ProjectInfoForm.vue";
	import { App, defaultProjectInfo } from "@astral3d/engine";
	import { fetchAddScene } from "@/http/api/scenes";
	import { getServiceStaticFile } from "@/utils/common/file";

	withDefaults(
		defineProps<{
			visible: boolean;
		}>(),
		{
			visible: false,
		}
	);
	const emits = defineEmits(["update:visible", "refresh"]);

	const projectInfoFormRef = ref();

	const spin = ref(false);

	const currentExample = ref<ISceneFetchData | null>(null);
	const exampleList = ref<ISceneFetchData[]>([]);

	async function getExampleScene() {
		const res = await fetchSceneExampleList({
			limit: 1000,
		});
		if (res.data === null) return;

		exampleList.value.push(...res.data.items);
	}

	// 选中示例模板
	function handleSelectExample(example: ISceneFetchData | null) {
		currentExample.value = example;

		App.project.setKey("sceneInfo", example || defaultProjectInfo().sceneInfo);
	}

	// 确认创建项目
	function handleSubmit() {
		projectInfoFormRef.value.validate().then(() => {
			const submit = async () => {
				const data: ISceneFetchData = projectInfoFormRef.value.getData();

				spin.value = true;
				const res = await fetchAddScene({
					...data,
					id: "",
					zip: "",
					coverPicture: "",
					sceneVersion: 1,
					hasDrawing: data.hasDrawing ? 1 : 0,
					exampleSceneId: data.id,
				});

				spin.value = false;

				if (res.error === null) {
					window.$dialog.success({
						title: t("other.Tips"),
						content: t("prompt['The project is created successfully. Do you want to enter?']"),
						positiveText: t("other.Ok"),
						negativeText: t("other.Cancel"),
						onPositiveClick: () => {
							// 新窗口打开项目
							window.open(window.location.origin + "/#/editor/" + res.data.id, "_blank");

							emits("update:visible", false);
							// 刷新父页面列表
							emits("refresh");
						},
						onNegativeClick: () => {
							emits("update:visible", false);
							// 刷新父页面列表
							emits("refresh");
						},
					});
				}
			};

			submit();
		});
	}

	onMounted(() => {
		getExampleScene();
	});
</script>

<template>
	<n-modal :show="visible" @update:show="v => emits('update:visible', v)">
		<n-spin :show="spin">
			<n-card :title="t('home.New project')" :bordered="false" size="small" class="w-max" header-style="background:var(--n-color);">
				<template #header-extra>
					<n-icon size="20" class="cursor-pointer" @click="emits('update:visible', false)">
						<Close />
					</n-icon>
				</template>

				<div class="flex flex-wrap justify-between pt-20px h-max">
					<div class="flex flex-col mr-20px">
						<div class="relative cursor-pointer">
							<img
								width="300"
								src="/static/images/placeholder/Web3D.jpg"
								class="mb-15px b-rd-2 transition-all-500"
								:style="{ border: '2px solid var(--n-color-target)' }"
							/>
							<p class="text-16px absolute bottom-30px left-10px" style="text-shadow: 1px 1px 2px black">Web3D</p>
						</div>
					</div>

					<div class="grid grid-cols-3 gap-10px grid-auto-rows-max w-560px max-h-full mr-10px">
						<div style="grid-column: 1 / -1">
							<h4>{{ t("home.Template") }}</h4>
							<n-divider class="!my-10px" />
						</div>

						<n-card
							hoverable
							@click="handleSelectExample(null)"
							class="w-178px h-max cursor-pointer"
							:style="{ border: currentExample === null ? '1px solid var(--n-color-target)' : '1px solid transparent' }"
							:footer-style="`background:var(${currentExample === null ? '--n-color-target' : '--n-action-color'});padding:10px;`"
						>
							<template #cover>
								<img
									src="/static/images/carousel/Astral3DEditor.jpg"
									:alt="t('home.Empty project')"
									class="h-110px hover:transform-scale-140 transition-all-200"
								/>
							</template>

							<template #footer>
								<span>{{ t("home.Empty project") }}</span>
							</template>
						</n-card>

						<n-card
							hoverable
							v-for="example in exampleList"
							:key="example.id"
							@click="handleSelectExample(example)"
							class="w-178px h-max cursor-pointer"
							:style="{ border: currentExample === example ? '1px solid var(--n-color-target)' : '1px solid transparent' }"
							:footer-style="`background:var(${currentExample === example ? '--n-color-target' : '--n-action-color'});padding:10px;`"
						>
							<template #cover>
								<n-tag type="success" :bordered="false" class="absolute top-10px right-10px z-10">
									{{ example.sceneType }}
								</n-tag>
								<img
									:src="getServiceStaticFile(example.coverPicture) || '/static/images/carousel/Astral3DEditor.jpg'"
									:alt="example.sceneName"
									class="h-110px hover:transform-scale-140 transition-all-200"
								/>
							</template>

							<template #footer>
								<span>{{ example.sceneName }}</span>
							</template>
						</n-card>
					</div>

					<div class="h-full flex">
						<n-divider vertical class="!h-auto" />

						<div class="h-full w-320px flex flex-col justify-start ml-10px">
							<img
								:src="getServiceStaticFile(currentExample?.coverPicture || '') || '/static/images/carousel/Astral3DEditor.jpg'"
								class="w-full"
							/>

							<h3 class="mt-10px mb-8px">{{ currentExample?.sceneName || t("home.Empty project") }}</h3>
							<p class="h-100px overflow-y-auto">
								{{ currentExample === null ? t("home.A blank project without any scene elements") : currentExample.sceneIntroduction }}
							</p>

							<n-button tertiary size="small" class="mt-8px w-full text-left block">
								{{ t("home.Project default settings") }}
							</n-button>

							<n-tabs value="project" type="segment" size="small" class="project-setting-tabs mt-24px" pane-class="h-220px">
								<n-tab-pane name="project" :tab="t('home.Project')" display-directive="show">
									<ProjectInfoForm :value="currentExample" ref="projectInfoFormRef" class="!p-15px" />
								</n-tab-pane>
							</n-tabs>

							<div class="w-full text-end mt-15px">
								<n-button type="primary" size="small" @click.stop="handleSubmit">{{ t("other.Ok") }}</n-button>
								<n-button size="small" class="ml-10px" @click="emits('update:visible', false)">{{ t("other.Cancel") }}</n-button>
							</div>
						</div>
					</div>
				</div>
			</n-card>
		</n-spin>
	</n-modal>
</template>

<style scoped lang="less">
	.project-setting-tabs {
		:deep(.n-tabs-nav) {
			justify-content: center;

			.n-tabs-rail {
				width: 50%;
			}
		}
	}
</style>