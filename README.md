# 小红书笔记风格排版器 (Rednote Format)

这是一个在线工具，旨在帮助用户轻松地将 Markdown 文本转换成具有小红书风格的精美图文笔记。用户可以选择多种预设主题和字体，实时预览效果，并最终下载为一张高质量的 PNG 图片。

## ✨ 功能特性

- **实时预览**：在左侧输入 Markdown，右侧即时显示渲染后的精美排版。
- **丰富主题**：内置多种背景主题，如“秋叶水彩”、“浅蓝素描”、“粉彩花卉”等，一键切换。
- **自定义字体**：支持多种中文字体，满足不同的排版风格需求。
- **图片导出**：可将完成的笔记连同背景导出为一张 PNG 图片，方便分享。
- **响应式布局**：界面简洁，支持拖动调整编辑区和预览区的宽度。
- **纯前端实现**：所有操作均在浏览器端完成，无需后端服务，保护用户隐私。
- **本地化运行**：提供 Python 脚本，方便在本地启动服务。

## 🚀 如何使用

本项目为纯静态页面，你可以通过以下两种方式运行它：

### 方式一：使用本地服务器 (推荐)

1.  确保你的电脑已经安装了 Python。
2.  在项目根目录下，运行 `start_server.py` 文件：
    ```bash
    python start_server.py
    ```
3.  脚本会自动在 `1314` 端口启动一个 HTTP 服务器。
4.  打开浏览器，访问 [http://localhost:1314](http://localhost:1314) 即可开始使用。

### 方式二：直接打开 HTML 文件

直接用浏览器打开 `index.html` 文件。但请注意，由于浏览器的安全策略（CORS），直接打开文件可能会导致字体、主题等资源加载失败。**因此，强烈推荐使用方式一**。

## 📂 目录结构

```
.
├── css/
│   └── style.css         # 主要样式文件，包含所有主题和字体定义
├── fonts/
│   ├── ...               # 存放所有字体文件 (.ttf, .otf)
├── imgs/
│   ├── bg/               # 存放所有主题的背景图片
│   └── cover_img/        # 存放封面图片 (当前未使用)
├── js/
│   └── main.js           # 核心交互逻辑
├── .gitattributes        # Git 属性文件
├── index.html            # 主页面
├── README.md             # 项目说明文档
└── start_server.py       # 本地服务器启动脚本
```

## 🎨 如何自定义

你可以轻松地添加自己的主题或字体。

### 添加新主题

1.  将你的背景图片 (例如 `my-theme.jpg`) 放入 `imgs/bg/` 目录。
2.  打开 `css/style.css` 文件。
3.  在文件末尾附近，仿照现有主题添加一个新的 CSS 规则来定义背景：
    ```css
    #background-container.bg-theme_my_theme { background-image: url('../imgs/bg/my-theme.jpg'); }
    ```
4.  (可选) 为你的主题添加特定的文本颜色、标题样式等。可以复制一个现有的主题块 (如 `.theme_bg_1-theme`) 并修改其中的样式。
5.  打开 `index.html` 文件。
6.  在 `<select id="theme-select">` 标签内，添加一个新的选项：
    ```html
    <option value="theme_my_theme">我的新主题</option>
    ```

### 添加新字体

1.  将你的字体文件 (例如 `my-font.ttf`) 放入 `fonts/` 目录。
2.  打开 `css/style.css` 文件。
3.  在文件顶部，仿照现有字体添加一个新的 `@font-face` 规则：
    ```css
    @font-face {
        font-family: 'my-font-family'; /* 给字体起一个 CSS 名字 */
        src: url('../fonts/my-font.ttf') format('truetype');
    }
    ```
4.  添加一个对应的 CSS 类，以便在预览区应用该字体：
    ```css
    .preview-area.font-my-font-family { font-family: 'my-font-family', sans-serif !important; }
    ```
5.  打开 `index.html` 文件。
6.  在 `<select id="font-select">` 标签内，添加一个新的选项：
    ```html
    <option value="my-font-family">我的新字体</option>
    ```

---
现在，重新加载页面，你就可以在下拉菜单中看到并使用你添加的新主题和字体了。