---
pageLayout: home
externalLinkIcon: false
config:
  -
    type: hero
    full: true
    background: tint-plate
    hero:
      name: Astral 3D Engine
      tagline: Astral 3D Editor
      text: 工业孪生3D引擎
      actions:
        -
          theme: brand
          text: 快速入门 -->
          link: /guide/6xkx4dnv/
        -
          theme: alt
          text: Demo
          link: https://editor.astraljs.com/#/
        -
          theme: alt
          text: Github
          link: https://github.com/mlt131220/Astral3D
  -
    type: features
    features:
      -
        title: 最新技术栈
        icon: 🍡
        details: 基于Vue3、Vite、TypeScript、Naive UI等最新技术栈开发
      -
        title: 基于ThreeJS
        icon: 🌷
        details: Three.js 是基于webGL的封装的一个易于使用且轻量级的3D库，是前端开发者研发3D绘图的主要工具
      -
        title: 简洁易用
        icon: 🔅
        details: 高效进行场景处理，并且提供网络压缩存储功能，在项目中快速读取加载
      -
        title: CAD 在线解析
        icon: 🌈
        details: 支持CAD图纸在线解析预览
      -
        title: 插件系统
        icon: 🏝️
        details: 编辑器提供了开放的插件系统，内置丰富的插件库，如：glTF处理器、地形生成器、模型转换器等等。
      -
        title: 粒子系统
        icon: 💊
        details: 内置多种粒子效果，如：烟花、火焰、烟雾、萤火虫等，丰富的配置项可以满足用户各种需求。
      -
        title: 动画系统
        icon: 🎡
        details: 支持在线编辑动画关键帧，完善的动画编辑器将支撑你的创作。
      -
        title: 天气系统
        icon: 🌤️
        details: 支持多种天气效果，如：晴天、雾天、雨天、雪天等。
      -
        title: 资源中心
        icon: 🎁
        details: 模型、材质、粒子、广告牌(Billboard)、HtmlPanel....
      -
        title: WebGPU (开发阶段)
        icon: 🚩
        details: 更快的计算...
  -
    type: image-text
    title: 工业范
    description: CAD? BIM? 亦或更多？
    image: /images/home/industryDark.png
    width: 600
    list:
      -
        title: CAD
        description: 支持 <code>.dwg,.dxf</code> 图纸解析预览
      -
        title: Future
        description: PDMS、VTU
  -
    type: custom
---

<script setup>
import RepoCard from 'vuepress-theme-plume/features/RepoCard.vue'
</script>

<CardGrid>
    <RepoCard repo="mlt131220/Astral3D" />
    <RepoCard repo="mlt131220/Astral3D" provider="gitee" />
</CardGrid>


### :zap: 快速开始

:::code-tabs
@tab bash

```bash
    git clone https://github.com/mlt131220/Astral3D.git

    cd Astral3D
    pnpm install
    pnpm run sdk:build
    pnpm run editor:dev
```

:::