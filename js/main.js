document.addEventListener('DOMContentLoaded', () => {
    const markdownInput = document.getElementById('markdown-input');
    const htmlOutput = document.getElementById('html-output');
    const themeSelect = document.getElementById('theme-select');
    const downloadBtn = document.getElementById('download-btn');
    const fontSelect = document.getElementById('font-select');

    marked.setOptions({
        gfm: true,
        breaks: true,
    });

    const render = () => {
        const markdownText = markdownInput.value;
        let html = marked.parse(markdownText);
        html = html.replace(/<strong>/g, '<span class="keyword">').replace(/<\/strong>/g, '</span>');
        htmlOutput.innerHTML = html;
    };

    const switchTheme = () => {
        const selectedTheme = themeSelect.value;
        const backgroundContainer = document.getElementById('background-container');
        document.body.className = `${selectedTheme}-theme`;
        backgroundContainer.className = `bg-${selectedTheme}`;
    };

    const switchFont = () => {
        const selectedFont = fontSelect.value;
        // Remove any existing font classes from the htmlOutput element
        htmlOutput.className = htmlOutput.className.replace(/\s?font-\S*/g, '');
        if (selectedFont !== 'default') {
            htmlOutput.classList.add(`font-${selectedFont}`);
        }
    };

    const downloadImage = async () => {
        const preview = document.getElementById('html-output');
        const background = document.getElementById('background-container');
        const loadingOverlay = document.getElementById('loading-overlay');

        // --- 增强版宽度计算: 考虑实际内容宽度和溢出 ---
        const computedStyle = window.getComputedStyle(preview);
        const paddingLeft = parseFloat(computedStyle.paddingLeft);
        const paddingRight = parseFloat(computedStyle.paddingRight);

        // 计算实际内容宽度 (取可视宽度和滚动宽度的最大值，确保捕获所有内容)
        const contentWidth = Math.max(
            preview.clientWidth, 
            preview.scrollWidth - paddingLeft - paddingRight
        );

        // 最终捕获宽度需要加上padding
        const captureWidth = contentWidth + paddingLeft + paddingRight;
        const captureHeight = preview.scrollHeight;

        // 1. 创建一个包装器来合成最终图像
        const captureWrapper = document.createElement('div');
        Object.assign(captureWrapper.style, {
            position: 'absolute',
            left: '-9999px',
            top: '0',
            width: `${captureWidth}px`,
            height: `${captureHeight}px`,
            overflow: 'hidden', // 确保内容不会溢出
        });

        // 2. Clone the background and content nodes.
        const backgroundClone = background.cloneNode(true);
        const contentClone = preview.cloneNode(true);

        // 3. Style the clones for proper composition.
        Object.assign(backgroundClone.style, {
            position: 'absolute', top: '0', left: '0',
            width: '100%', height: '100%',
        });
        Object.assign(contentClone.style, {
            position: 'absolute', top: '0', left: '0',
            width: '100%', height: '100%',
            overflow: 'visible', // 确保内容不被裁剪
            boxSizing: 'border-box', // 确保宽度计算包含padding
        });

        // 4. Assemble the layers.
        captureWrapper.appendChild(backgroundClone);
        captureWrapper.appendChild(contentClone);

        // 5. Append to body.
        document.body.appendChild(captureWrapper);

        try {
            // Show loading modal
            loadingOverlay.style.display = 'flex';

            // 6. 使用domtoimage.toPng捕获组合元素，确保足够宽度
            const dataUrl = await domtoimage.toPng(captureWrapper, {
                width: captureWidth,
                height: captureHeight,
                style: {
                    // 确保渲染时保留所有内容
                    'transform': 'none',
                    'width': `${captureWidth}px`,
                    'min-width': `${captureWidth}px`,
                    'max-width': 'none',
                }
            });

            // 7. Trigger download.
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = 'xiaohongshu-note.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

        } catch (error) {
            console.error('截图失败，错误信息:', error);
            alert(`截图失败！请打开开发者工具(F12)查看控制台(Console)中的错误信息.\n\n${error}`);
        } finally {
            // Hide loading modal
            loadingOverlay.style.display = 'none';
            // 8. Clean up.
            if (document.body.contains(captureWrapper)) {
                document.body.removeChild(captureWrapper);
            }
        }
    };

    markdownInput.addEventListener('input', render);
    themeSelect.addEventListener('change', switchTheme);
    fontSelect.addEventListener('change', switchFont);
    downloadBtn.addEventListener('click', downloadImage);

    // Initial render and theme
    switchTheme();
    switchFont();
    render();

    // --- Resizer Logic ---
    const resizer = document.getElementById('resizer');
    const mainGrid = document.querySelector('main');
    let isResizing = false;

    resizer.addEventListener('mousedown', () => {
        isResizing = true;
        document.body.style.userSelect = 'none';
        document.body.style.pointerEvents = 'none';
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    const onMouseMove = (e) => {
        if (!isResizing) return;
        const mainRect = mainGrid.getBoundingClientRect();
        const newWidth = e.clientX - mainRect.left;
        const totalWidth = mainGrid.offsetWidth - resizer.offsetWidth;
        const leftFraction = (newWidth / totalWidth);
        const rightFraction = 1 - leftFraction;
        mainGrid.style.gridTemplateColumns = `${leftFraction}fr ${resizer.offsetWidth}px ${rightFraction}fr`;
    };

    const onMouseUp = () => {
        isResizing = false;
        document.body.style.userSelect = '';
        document.body.style.pointerEvents = '';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };
});