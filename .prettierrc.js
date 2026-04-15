/** @type {import("prettier").Config} */
module.exports = {
	// 一行最多160字符
	printWidth: 160,
	// 指定一个制表符等于的空格数
	tabWidth: 4,
	// 使用制表符，而不使用空格
	useTabs: true,
	// 行尾需要有分号
	semi: true,
	// 使用单引号代替双引号
	singleQuote: false,
	// 默认值。因为使用了一些折行敏感型的渲染器（如GitHub comment）而按照markdown文本样式进行折行
	proseWrap: "preserve",
	// 对象的key仅在必要时用引号括起来
	quoteProps: "as-needed",
	// 尾逗号根据ES5规则使用
	trailingComma: "es5",
	// 在对象，数组括号与文字之间加空格 "{ foo: bar }"
	bracketSpacing: true,
	//  (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
	arrowParens: "avoid",
	// 指定 HTML 文件的空白字符敏感度
	htmlWhitespaceSensitivity: "ignore",
	// 缩进 Vue SFC 文件中的 <script> 和 <style> 标签
	vueIndentScriptAndStyle: true,
	// 结尾是 \n \r \n\r auto
	endOfLine: "auto",
	// 在jsx中使用单引号代替双引号
	jsxSingleQuote: false,
	// 在jsx中是否把'>' 单独放一行
	bracketSameLine: false,
	// === 不同文件的定制 ===
	overrides: [
		{
			files: "*.md",
			options: {
				printWidth: 120,
				proseWrap: "preserve",
			},
		},
		{
			files: "*.json",
			options: {
				printWidth: 120,
			},
		},
	],
};
