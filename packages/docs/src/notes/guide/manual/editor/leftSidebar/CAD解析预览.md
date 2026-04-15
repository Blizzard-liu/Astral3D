---
title: CAD解析预览
createTime: 2025/03/31 19:49:44
permalink: /guide/u1631nwk/
---

<div style="display:flex;justify-content:center;">
<ImageCard
  image="/images/manual/editor/leftSidebar/cad.png"
  title="CAD"
  description="编辑器支持用户上传CAD图纸(.dwg、.dxf)进行解析预览"
  width="300"
  author="ErSan"
  date="2025/04/15"
/>
</div>

## 简要说明
通过编辑器的CAD解析预览功能，您可以轻松上传并查看多种格式的CAD图纸。<br />
无论是`.dwg`还是`.dxf`，都能快速解析并在三维视口中直观展示。<br />
这一功能不仅提升了图纸管理的效率，还为三维设计和协作提供了极大的便利。<br />

**主要亮点：**
- 支持多种图纸格式，满足不同需求。
- 即时解析与预览，操作简单高效。
- 历史记录功能，方便快速查找和重新加载。

让您的设计流程更加流畅，体验前所未有的便捷与高效！

## 功能说明
- **图纸列表**：展示用户上传并解析成功的所有图纸。
- **上传图纸**：点击顶部==历史记录==右侧的==上传按钮==，会打开图纸上传界面。
- **历史记录**：点击顶部==历史记录==按钮，会弹出历史上传记录列表。

### 图纸列表
- **功能描述**：展示用户上传并解析成功的所有图纸。
- **操作方式**：  
  如本页面首图，列表以网格形式展示；  
  从列表中直接==拖动==相应图纸到中间的三维视口 或 ==双击==该图纸，都可加载并渲染对应图纸。

### 上传图纸
::: demo-wrapper img no-padding
<ImageCard
  image="/images/manual/editor/leftSidebar/cadUpload.png"
  title="上传图纸"
  author="ErSan"
  date="2025/04/15"
/>
:::

- **支持格式**：`.dwg、.dxf、.png、.jpg(jpeg)`  
- **解析方式**：  
  - `.dwg`格式图纸由于无法在前端直接解析，会在上传后通过WebSocket发起图纸解析请求。  
  - 解析结果通过WebSocket消息返回，并加载渲染展示。  
  - 如果`.dwg`图纸中包含缩略图，会自动解析为封面图，在`图纸列表`中展示。

### 历史记录
::: demo-wrapper img no-padding
<ImageCard
  image="/images/manual/editor/leftSidebar/cadHistory.png"
  title="历史记录"
  author="ErSan"
  date="2025/04/15"
/>
:::

- **功能描述**：展示用户之前上传的所有图纸记录，方便快速查找和重新加载。
- **操作方式**：点击顶部==历史记录==按钮，弹出历史上传记录列表。