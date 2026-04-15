<template>
  <div id="extra-resource-billboards" class="flex flex-col">
    <!-- 子分类标签 -->
    <div class="mb-3 flex flex-wrap items-center gap-2">
      <n-button v-for="subCategory in subCategories" :key="subCategory.key" strong secondary round
                :type="activeSubCategory === subCategory.key ? 'primary' : 'default'"
                @click="selectSubCategory(subCategory.key)">
        {{ subCategory.name }}
      </n-button>
    </div>

    <!-- 资源网格 -->
    <div class="flex-1 overflow-y-auto">
      <div class="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3">
        <n-card size="small" hoverable v-for="item in filteredList" :key="item.key"
                @contextmenu.prevent="handlePreview(item)"
                @dblclick="addToScene(item)" draggable="true" @dragstart="dragStart(item)" @dragend="dragEnd">
          <template #cover>
            <img :src="item.image" :alt="item.key" draggable="false" class="!w-70% h-full object-cover"/>
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
import {ref, inject, computed, h, nextTick} from "vue";
import type {Ref} from "vue";
import {NInput} from "naive-ui";
import {cpt, t} from "@/language";
import {useDragStore} from "@/store/modules/drag";
import {screenToWorld} from "@/utils/common/scenes";
import {App, AddObjectCommand, POSITION, Utils, Hooks,Billboard,getDefaultBillboardOptions} from "@astral3d/engine";

const searchText = inject('searchText') as Ref<string>;
const previewInfo = inject('previewInfo') as any;
const previewRef = inject('previewRef') as any;

const activeSubCategory = ref('icon');
const subCategories = ref([
  {key: 'icon', name: cpt('extra.resource.billboard.Icon')},
  {key: 'text', name: cpt('extra.resource.billboard.Text')},
]);

const allList = {
  "icon": [
    {key: "error", image: "/static/resource/billboard/icon/error.png", name: cpt("extra.resource.billboard.Error")},
    {
      key: "location",
      image: "/static/resource/billboard/icon/location.png",
      name: cpt("extra.resource.billboard.Location")
    },
    {key: "heart", image: "/static/resource/billboard/icon/heart.png", name: cpt("extra.resource.billboard.Heart")},
    {key: "flag", image: "/static/resource/billboard/icon/flag.png", name: cpt("extra.resource.billboard.Flag")},
    {
      key: "bookmark",
      image: "/static/resource/billboard/icon/bookmark.png",
      name: cpt("extra.resource.billboard.Bookmark")
    },
    {
      key: "notification",
      image: "/static/resource/billboard/icon/notification.png",
      name: cpt("extra.resource.billboard.Notification")
    },
    {
      key: "notification2",
      image: "/static/resource/billboard/icon/notification2.svg",
      name: cpt("extra.resource.billboard.Notification message")
    },
    {key: "home", image: "/static/resource/billboard/icon/home.png", name: cpt("extra.resource.billboard.Home")},
    {
      key: "lightbulb",
      image: "/static/resource/billboard/icon/lightbulb.png",
      name: cpt("extra.resource.billboard.Lightbulb")
    },
    {key: "warn", image: "/static/resource/billboard/icon/warn.png", name: cpt("extra.resource.billboard.Warn")},
    {
      key: "comment",
      image: "/static/resource/billboard/icon/comment.png",
      name: cpt("extra.resource.billboard.Comment")
    },
    {
      key: "animal-paw-print",
      image: "/static/resource/billboard/icon/animal-paw-print.svg",
      name: cpt("extra.resource.billboard.Animal paw print")
    },
    {key: "edit", image: "/static/resource/billboard/icon/edit.svg", name: cpt("extra.resource.billboard.Edit")},
    {key: "drafts", image: "/static/resource/billboard/icon/drafts.svg", name: cpt("extra.resource.billboard.Drafts")},
    {
      key: "refresh",
      image: "/static/resource/billboard/icon/refresh.svg",
      name: cpt("extra.resource.billboard.Refresh")
    },
    {
      key: "correct",
      image: "/static/resource/billboard/icon/correct.svg",
      name: cpt("extra.resource.billboard.Correct")
    },
    {key: "add", image: "/static/resource/billboard/icon/add.svg", name: cpt("extra.resource.billboard.Add")},
    {key: "book", image: "/static/resource/billboard/icon/book.svg", name: cpt("extra.resource.billboard.Book")},
    {key: "read", image: "/static/resource/billboard/icon/read.svg", name: cpt("extra.resource.billboard.Read")},
    {key: "clock", image: "/static/resource/billboard/icon/clock.svg", name: cpt("extra.resource.billboard.Clock")},
    {
      key: "document",
      image: "/static/resource/billboard/icon/document.svg",
      name: cpt("extra.resource.billboard.Document")
    },
    {
      key: "building",
      image: "/static/resource/billboard/icon/building.png",
      name: cpt("extra.resource.billboard.Building")
    },
    {
      key: "building-multiple",
      image: "/static/resource/billboard/icon/building-multiple.png",
      name: cpt("extra.resource.billboard.Building-multiple")
    },
    {key: "store", image: "/static/resource/billboard/icon/store.png", name: cpt("extra.resource.billboard.Store")},
    {
      key: "question",
      image: "/static/resource/billboard/icon/question.png",
      name: cpt("extra.resource.billboard.Question")
    },
    {
      key: "arrow-down",
      image: "/static/resource/billboard/icon/arrow-down.svg",
      name: cpt("extra.resource.billboard.Download")
    },
    {key: "share", image: "/static/resource/billboard/icon/share.svg", name: cpt("extra.resource.billboard.Share")},
    {key: "image", image: "/static/resource/billboard/icon/image.svg", name: cpt("extra.resource.billboard.Image")},
    {key: "globe", image: "/static/resource/billboard/icon/globe.svg", name: cpt("extra.resource.billboard.Globe")},
    {key: "link", image: "/static/resource/billboard/icon/link.svg", name: cpt("extra.resource.billboard.Link")},
    {key: "chat", image: "/static/resource/billboard/icon/chat.svg", name: cpt("extra.resource.billboard.Chat")},
    {key: "send", image: "/static/resource/billboard/icon/send.svg", name: cpt("extra.resource.billboard.Send")},
    {
      key: "send-clock",
      image: "/static/resource/billboard/icon/send-clock.svg",
      name: cpt("extra.resource.billboard.Send clock")
    },
    {key: "mail", image: "/static/resource/billboard/icon/mail.svg", name: cpt("extra.resource.billboard.Mail")},
    {key: "cloud", image: "/static/resource/billboard/icon/cloud.svg", name: cpt("extra.resource.billboard.Cloud")},
    {
      key: "database",
      image: "/static/resource/billboard/icon/database.svg",
      name: cpt("extra.resource.billboard.Database")
    },
    {
      key: "diamond",
      image: "/static/resource/billboard/icon/diamond.svg",
      name: cpt("extra.resource.billboard.Diamond")
    },
    {
      key: "bar-chart",
      image: "/static/resource/billboard/icon/bar-chart.svg",
      name: cpt("extra.resource.billboard.Bar chart")
    },
    {
      key: "line-chart",
      image: "/static/resource/billboard/icon/line-chart.svg",
      name: cpt("extra.resource.billboard.Line chart")
    },
    {
      key: "pie-chart",
      image: "/static/resource/billboard/icon/pie-chart.svg",
      name: cpt("extra.resource.billboard.Pie chart")
    },
    {
      key: "area-chart",
      image: "/static/resource/billboard/icon/area-chart.svg",
      name: cpt("extra.resource.billboard.Area chart")
    },
    {
      key: "scatter-chart",
      image: "/static/resource/billboard/icon/scatter-chart.svg",
      name: cpt("extra.resource.billboard.Scatter chart")
    },
    {
      key: "trending-chart",
      image: "/static/resource/billboard/icon/trending-chart.svg",
      name: cpt("extra.resource.billboard.Trending chart")
    },
    {key: "camera", image: "/static/resource/billboard/icon/camera.svg", name: cpt("extra.resource.billboard.Camera")},
    {key: "bot", image: "/static/resource/billboard/icon/bot.svg", name: cpt("extra.resource.billboard.Bot")},
    {key: "person", image: "/static/resource/billboard/icon/person.svg", name: cpt("extra.resource.billboard.Person")},
    {key: "people", image: "/static/resource/billboard/icon/people.svg", name: cpt("extra.resource.billboard.People")},
    {key: "team", image: "/static/resource/billboard/icon/team.svg", name: cpt("extra.resource.billboard.Team")},
    {key: "beach", image: "/static/resource/billboard/icon/beach.svg", name: cpt("extra.resource.billboard.Beach")},
    {key: "mic", image: "/static/resource/billboard/icon/mic.svg", name: cpt("extra.resource.billboard.Mic")},
    {
      key: "speaker",
      image: "/static/resource/billboard/icon/speaker.svg",
      name: cpt("extra.resource.billboard.Speaker")
    },
    {key: "webcam", image: "/static/resource/billboard/icon/webcam.svg", name: cpt("extra.resource.billboard.Webcam")},
    {
      key: "setting",
      image: "/static/resource/billboard/icon/settings.svg",
      name: cpt("extra.resource.billboard.Setting")
    },
    {
      key: "printer",
      image: "/static/resource/billboard/icon/printer.svg",
      name: cpt("extra.resource.billboard.Printer")
    },
    {
      key: "elevator",
      image: "/static/resource/billboard/icon/elevator.svg",
      name: cpt("extra.resource.billboard.Elevator")
    },
    {
      key: "room-for-mother-and-infant",
      image: "/static/resource/billboard/icon/room-for-mother-and-infant.svg",
      name: cpt("extra.resource.billboard.Room for mother and infant")
    },
    {
      key: "restroom",
      image: "/static/resource/billboard/icon/restroom.svg",
      name: cpt("extra.resource.billboard.Restroom")
    },
    {
      key: "water-closet",
      image: "/static/resource/billboard/icon/water-closet.svg",
      name: cpt("extra.resource.billboard.Water closet")
    },
    {
      key: "parking-lot",
      image: "/static/resource/billboard/icon/parking-lot.svg",
      name: cpt("extra.resource.billboard.Parking lot")
    },
    {
      key: "right-arrow",
      image: "/static/resource/billboard/icon/right-arrow.svg",
      name: cpt("extra.resource.billboard.Right arrow")
    },
    {
      key: "down-arrow",
      image: "/static/resource/billboard/icon/down-arrow.svg",
      name: cpt("extra.resource.billboard.Down arrow")
    },
    {
      key: "right-arrow-curving-down",
      image: "/static/resource/billboard/icon/right-arrow-curving-down.svg",
      name: cpt("extra.resource.billboard.Right arrow curving down")
    },
    {
      key: "right-arrow-curving-left",
      image: "/static/resource/billboard/icon/right-arrow-curving-left.svg",
      name: cpt("extra.resource.billboard.Right arrow curving left")
    },
    {
      key: "left-arrow",
      image: "/static/resource/billboard/icon/left-arrow.svg",
      name: cpt("extra.resource.billboard.Left arrow")
    },
    {
      key: "down-left-arrow",
      image: "/static/resource/billboard/icon/down-left-arrow.svg",
      name: cpt("extra.resource.billboard.Down left arrow")
    },
    {
      key: "down-right-arrow",
      image: "/static/resource/billboard/icon/down-right-arrow.svg",
      name: cpt("extra.resource.billboard.Down right arrow")
    },
    {
      key: "up-left-arrow",
      image: "/static/resource/billboard/icon/up-left-arrow.svg",
      name: cpt("extra.resource.billboard.Up left arrow")
    },
    {
      key: "up-right-arrow",
      image: "/static/resource/billboard/icon/up-right-arrow.svg",
      name: cpt("extra.resource.billboard.Up right arrow")
    },
    {
      key: "up-arrow",
      image: "/static/resource/billboard/icon/up-arrow.svg",
      name: cpt("extra.resource.billboard.Up arrow")
    },
    {
      key: "right-arrow-curving-up",
      image: "/static/resource/billboard/icon/right-arrow-curving-up.svg",
      name: cpt("extra.resource.billboard.Right arrow curving up")
    },
    {key: "wireless", image: "/static/resource/billboard/icon/wireless.svg", name: 'Wifi'},
    {key: "atm", image: "/static/resource/billboard/icon/atm.svg", name: cpt("extra.resource.billboard.ATM")},
    {
      key: "bus-stop",
      image: "/static/resource/billboard/icon/bus-stop.svg",
      name: cpt("extra.resource.billboard.Bus stop")
    },
    {key: "bus", image: "/static/resource/billboard/icon/bus.svg", name: cpt("extra.resource.billboard.Bus")},
    {
      key: "delivery-truck",
      image: "/static/resource/billboard/icon/delivery-truck.svg",
      name: cpt("extra.resource.billboard.Delivery truck")
    },
    {key: "taxi", image: "/static/resource/billboard/icon/taxi.svg", name: cpt("extra.resource.billboard.Taxi")},
    {
      key: "private-car",
      image: "/static/resource/billboard/icon/private-car.svg",
      name: cpt("extra.resource.billboard.Private car")
    },
    {
      key: "automobile",
      image: "/static/resource/billboard/icon/automobile.svg",
      name: cpt("extra.resource.billboard.Automobile")
    },
    {
      key: "ambulance",
      image: "/static/resource/billboard/icon/ambulance.svg",
      name: cpt("extra.resource.billboard.Ambulance")
    },
    {key: "tram", image: "/static/resource/billboard/icon/tram.svg", name: cpt("extra.resource.billboard.Tram")},
    {key: "train", image: "/static/resource/billboard/icon/train.svg", name: cpt("extra.resource.billboard.Train")},
    {
      key: "airplane",
      image: "/static/resource/billboard/icon/airplane.svg",
      name: cpt("extra.resource.billboard.Airplane")
    },
    {
      key: "factory",
      image: "/static/resource/billboard/icon/factory.svg",
      name: cpt("extra.resource.billboard.Factory")
    },
    {
      key: "fire-extinguisher",
      image: "/static/resource/billboard/icon/fire-extinguisher.svg",
      name: cpt("extra.resource.billboard.Fire extinguisher")
    },
    {
      key: "no-smoking",
      image: "/static/resource/billboard/icon/no-smoking.svg",
      name: cpt("extra.resource.billboard.No smoking")
    },
    {
      key: "no-entry",
      image: "/static/resource/billboard/icon/no-entry.svg",
      name: cpt("extra.resource.billboard.No entry")
    },
    {key: "clown", image: "/static/resource/billboard/icon/clown.svg", name: cpt("ErSan")},
  ],
  "text": [
    {
      key: "infoBg",
      image: "/static/resource/billboard/text/infoBg.png",
      name: cpt("extra.resource.billboard.Background"),
      options: {
        text: {
          fontSize: 4,
          baseline: "middle",
        }
      }
    },
    {
      key: "infoBg2",
      image: "/static/resource/billboard/text/infoBg2.png",
      name: cpt("extra.resource.billboard.Background2"),
      options: {
        text: {
          fontSize: 4,
          baseline: "middle",
        }
      }
    },
    {
      key: "infoBg3",
      image: "/static/resource/billboard/text/infoBg3.png",
      name: cpt("extra.resource.billboard.Background3"),
      options: {
        text: {
          fontSize: 4,
          baseline: "middle",
        }
      }
    },
  ],
}

const filteredList = computed(() => {
  return allList[activeSubCategory.value].filter((item) => (item.name.value || item.name).toLowerCase().includes(searchText.value.toLowerCase()));
});

// 切换子分类
function selectSubCategory(key: string) {
  activeSubCategory.value = key;
}

// 预览
async function handlePreview(item){
  previewInfo.name = (item.name as Ref<string>).value || item.name;
  previewInfo.type = "Billboard";

  const _ops = getDefaultBillboardOptions();
  _ops.name = previewInfo.name;

  const submit = async () => {
    previewInfo.visible = true;

    await nextTick();

    const previewer = await previewRef.value?.getPreviewer();
    if(!previewer) return;

    const billboard = new Billboard(_ops);

    previewer.scene.add(billboard);
    Utils.focusObject(billboard,previewer.modules.controls);
  }

  switch (activeSubCategory.value) {
    case "icon":
      _ops.image.visible = true;
      _ops.image.url = item.image;
      _ops.image.position = POSITION.LEFT;

      submit();
      break;
    case "text":
      const v = ref("");
      const status = ref<any>("");

      window.$dialog.info({
        title: t('prompt.Please enter the text'),
        content: () => h(
            NInput,
            {
              modelValue: v.value,
              placeholder: "",
              clearable: true,
              type: "textarea",
              size: "small",
              status: status.value,
              onUpdateValue: (n: string) => {
                v.value = n;
                status.value = !v.value ? "error" : "";
              },
              onBlur: () => {
                status.value = !v.value ? "error" : "";
              }
            }
        ),
        positiveText: t('other.Ok'),
        negativeText: t('other.Cancel'),
        onPositiveClick: () => {
          if (!v.value) return false;

          if (item.image) {
            _ops.image.visible = true;
            _ops.image.url = item.image;
            _ops.image.position = POSITION.CENTER;
            _ops.image.margin = 0;
          }

          _ops.text.value = v.value;
          _ops.text.visible = true;

          if (item.options) {
            Utils.deepAssign(_ops, item.options);
          }

          submit();
        },
      })
      break;
  }
}

//双击添加至场景..
function addToScene(item, position?: number[]) {
  const _ops = getDefaultBillboardOptions();
  _ops.name = item.name.value || item.name;

  const submit = () => {
    if (position) {
      _ops.position = position;
    }

    const billboard = new Billboard(_ops);

    App.execute(new AddObjectCommand(billboard), `Add Billboard: ${_ops.name}`);

    const handleImgLoaded = () => {
      Hooks.useDispatchSignal("materialChanged", billboard.material);
      // @ts-ignore
      billboard.removeEventListener("imgLoaded", handleImgLoaded);
    }
    // @ts-ignore
    billboard.addEventListener("imgLoaded", handleImgLoaded);
    // @ts-ignore TODO: 需确认是否应该在销毁时移除监听
    billboard.addEventListener("redraw", () => {
      Hooks.useDispatchSignal("geometryChanged", billboard);
    });
  }

  switch (activeSubCategory.value) {
    case "icon":
      _ops.image.visible = true;
      _ops.image.url = item.image;
      _ops.image.position = POSITION.LEFT;

      submit();
      break;
    case "text":
      const v = ref("");
      const status = ref<any>("");

      window.$dialog.info({
        title: t('prompt.Please enter the text'),
        content: () => h(
            NInput,
            {
              modelValue: v.value,
              placeholder: "",
              clearable: true,
              type: "textarea",
              size: "small",
              status: status.value,
              onUpdateValue: (n: string) => {
                v.value = n;
                status.value = !v.value ? "error" : "";
              },
              onBlur: () => {
                status.value = !v.value ? "error" : "";
              }
            }
        ),
        positiveText: t('other.Ok'),
        negativeText: t('other.Cancel'),
        onPositiveClick: () => {
          if (!v.value) return false;

          if (item.image) {
            _ops.image.visible = true;
            _ops.image.url = item.image;
            _ops.image.position = POSITION.CENTER;
            _ops.image.margin = 0;
          }

          _ops.text.value = v.value;
          _ops.text.visible = true;

          if (item.options) {
            Utils.deepAssign(_ops, item.options);
          }

          submit();
        },
      })
      break;
  }
}

// 开始拖拽事件
const dragStore = useDragStore();

function dragStart(item) {
  dragStore.setData(item)
}

function dragEnd() {
  if (dragStore.getActionTarget !== "addToScene" || dragStore.endArea !== "Scene") return;

  const position = screenToWorld(dragStore.endPosition.x, dragStore.endPosition.y);

  addToScene(dragStore.getData, position.toArray());

  dragStore.setActionTarget("");
}
</script>

<style scoped lang="less">
#extra-resource-billboards {
  overflow-x: hidden;

  .n-card {
    cursor: pointer;

    :deep(.n-card-cover) {
      display: flex;
      justify-content: center;
      align-items: center;
    }

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
