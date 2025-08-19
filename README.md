# RedNote 多功能排版工具

RedNote 是一个多功能的在线排版工具，旨在帮助用户轻松地将想法和内容，转换成适合社交媒体分享的精美图文。项目现在包含两大核心功能：**内容制作**和**封面制作**。

无论是撰写深度长文，还是设计吸引眼球的封面，RedNote 都提供了丰富的自定义选项和实时预览功能，让您的内容更具表现力。

## ✨ 核心功能

### 通用功能
- **实时预览**: 所有调整都可以在右侧预览区域即时生效，所见即所得。
- **丰富主题**: 内置多种精心设计的背景主题，同时包含一个专业的 **GitHub 风格**主题，满足不同场景需求。
- **海量字体库**: 集成了数十种优美的中英文字体，并可轻松扩展。
- **字号自由控制**: 支持分别调整**标题**和**正文**的字号，实现完美的视觉平衡。
- **图片导出**: 可将完成的笔记或封面，连同背景一起导出为一张高质量的 PNG 图片。
- **体验优化**: 在导出图片时，会有加载动画提示，避免用户因等待而困惑。

### 内容制作模式
- **Markdown 支持**: 使用标准的 Markdown 语法进行高效的内容创作。
- **可调节布局**: 通过拖动分隔条，可以自由调整编辑区和预览区的宽度。

### 封面制作模式
- **双模式封面**: 支持“**一句话封面**”和“**新闻列表封面**”两种类型，满足不同创意需求。
- **专业布局**: 采用经典的“页头-内容-页脚”三段式卡片布局，美观大方。
- **动态内容**: 自动生成日期；作者信息与页脚同步，并可设置默认作者。
- **品牌化元素**: 支持自定义 Logo 和二维码，提升品牌辨识度。

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
│   └── style.css         # 主要样式文件
├── fonts/
│   ├── ...               # 存放所有字体文件
├── imgs/
│   ├── bg/               # 主题背景图片
│   ├── LOGO/             # Logo图片
│   └── QRCode/           # 二维码图片
├── js/
│   └── main.js           # 核心交互逻辑
├── .gitattributes
├── index.html            # 主页面
├── README.md             # 项目说明文档
└── start_server.py       # 本地服务器启动脚本
```

## 🎨 如何自定义

你可以轻松地添加自己的主题或字体，也可以更换 Logo 和二维码。

### 添加新字体 (示例)

1.  将你的字体文件 (例如 `my-font.ttf`) 放入 `fonts/` 目录。
2.  打开 `css/style.css` 文件，在文件顶部仿照现有字体添加 `@font-face` 规则和对应的样式类：
    ```css
    /* 1. 定义字体 */
    @font-face {
        font-family: 'my-font-family'; /* 给字体起一个 CSS 名字 */
        src: url('../fonts/my-font.ttf') format('truetype');
    }

    /* 2. 创建一个应用该字体的类 */
    .preview-area.font-my-font-family { font-family: 'my-font-family', sans-serif !important; }
    ```
3.  打开 `index.html` 文件，在 `<select id="font-select">` 标签内，添加一个新的选项：
    ```html
    <option value="my-font-family">我的新字体</option>
    ```

### 更换 Logo

1.  准备好你的新 Logo 图片文件 (建议尺寸为正方形，例如 100x100 像素)。
2.  将新 Logo 文件放入 `imgs/LOGO/` 目录，并可以替换掉原有的 `logo.jpeg` 文件，或者保留它并使用新文件名 (例如 `my-logo.png`)。
3.  打开 `index.html` 文件，找到 `<img class="cover-icon" src="imgs/LOGO/logo.jpeg" alt="icon">` 这一行。
4.  修改 `src` 属性为你新 Logo 文件的路径：
    ```html
    <img class="cover-icon" src="imgs/LOGO/my-logo.png" alt="我的图标">
    ```
    *(如果你替换了原文件，则只需确认文件名正确即可)*

### 更换二维码

1.  准备好你的新二维码图片文件 (建议尺寸为正方形，例如 200x200 像素)。
2.  将新二维码文件放入 `imgs/QRCode/` 目录，并可以替换掉原有的 `QRcode.jpg` 文件，或者保留它并使用新文件名 (例如 `my-qrcode.png`)。
3.  打开 `index.html` 文件，找到 `<img id="cover-qr-code" src="imgs/QRCode/QRcode.jpg" alt="QR Code">` 这一行。
4.  修改 `src` 属性为你新二维码文件的路径：
    ```html
    <img id="cover-qr-code" src="imgs/QRCode/my-qrcode.png" alt="我的二维码">
    ```
    *(如果你替换了原文件，则只需确认文件名正确即可)*

---
现在，重新加载页面，你就可以看到新的 Logo 和二维码了。
