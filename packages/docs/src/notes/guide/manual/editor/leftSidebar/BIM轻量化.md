---
title: BIM轻量化
createTime: 2025/03/31 19:48:15
permalink: /guide/rf1xgf4z/
---

<div style="display:flex;justify-content:center;">
<ImageCard
  image="/images/manual/editor/leftSidebar/bim.png"
  title="BIM"
  description="通过将BIM工程文件（.rvt）转换为glTF文件，在保留BIM构件属性的同时压缩优化模型，以达到web端解析BIM并且轻量化的目的。"
  width="300"
  author="ErSan"
  date="2025/04/15"
/>
</div>

## 简要说明
通过编辑器的BIM轻量化功能，您可以将复杂的BIM工程文件（如`.rvt`）转换为轻量化的`.glTF`文件。  
转换过程中保留了BIM构件的属性信息，同时对模型进行了压缩优化，方便在Web端进行高效解析与展示。

**主要亮点：**
- 支持BIM文件的轻量化转换，优化模型大小。
- 保留构件属性，便于后续操作与分析。
- 界面设计与[CAD解析预览](/guide/u1631nwk/)类似，操作直观易用。

## 功能说明
- **模型列表**：展示用户上传转换的所有BIM模型。
- **上传模型**：点击顶部==历史记录==右侧的==上传按钮==，会打开模型上传界面。
- **历史记录**：点击顶部==历史记录==按钮，会弹出历史上传记录列表。

### 模型列表
- **功能描述**：展示用户上传并转换成功的所有BIM模型。
- **操作方式**：  
  如本页面首图，列表以网格形式展示；  
  从列表中直接==拖动==相应模型到中间的三维视口 或 ==双击==该模型，都可加载并渲染对应模型。

### 上传模型
<div style="display:flex;justify-content:center;">
<ImageCard
  image="/images/manual/editor/leftSidebar/bimUpload.png"
  title="上传模型"
  width="400"
  author="ErSan"
  date="2025/04/15"
/>
</div>

- **支持格式**：`.rvt、.rfa`  
- **转换方式**：  
  - 文件会在上传后通过WebSocket发起轻量化转换请求。  
  - 转换结果通过WebSocket消息返回，并加载渲染展示。  
- **转换配置**：
  - 极致轻量化：模型会在转换过程中执行==网格优化、材质贴图压缩并转换格式为WebP、网格实例化、网格合并==等模型优化操作，以确保输出的BIM轻量化模型是最小体积及最小渲染损耗的glTF模型。过程中可能执行的具体优化项可参考[glTF处理器](/guide/plugin/builtin/jo87cfk0/)章节；
  - 导出属性：生成的glTF模型中是否包含构件属性；
  - 转换视图：一个BIM文件中可能会包含多个3D视图，如果用户有确切的转换视图目标，可选择`按名称`并输入视图名称以转换；否则将自动以`默认3D视图`为目标转换；
  -视觉样式：此设置影响最终输出的模型材质。`着色`模式基本不包含任何材质贴图，以纯色材质方式输出；`真实`模式会包含用户建模时的材质贴图，输出材质更真实；
  - 坐标参考：一般情况下，一个BIM工程模型会由多工程师完成，便会存在多个单体BIM文件。此设置会决定最终输出模型与笛卡尔坐标系原点的相对位置信息。关于==原点、项目基点、测量点==的详细说明，可以参考这篇文章：[详解Revit坐标系](https://zhuanlan.zhihu.com/p/220113797)

### 历史记录
::: demo-wrapper img no-padding
<ImageCard
  image="/images/manual/editor/leftSidebar/bimHistory.png"
  title="历史记录"
  author="ErSan"
  date="2025/04/15"
/>
:::

- **功能描述**：展示用户之前上传的所有BIM模型记录，方便快速查找和重新加载。
- **操作方式**：点击顶部==历史记录==按钮，弹出历史上传记录列表。

