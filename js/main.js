document.addEventListener('DOMContentLoaded', () => {
    const markdownInput = document.getElementById('markdown-input');
    const htmlOutput = document.getElementById('html-output');
    const themeSelect = document.getElementById('theme-select');
    const downloadBtn = document.getElementById('download-btn');

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

    const downloadImage = async () => {
        const preview = document.getElementById('html-output');
        const background = document.getElementById('background-container');

        // --- Final Strategy: dom-to-image-more ---

        // 1. Create a wrapper to composite the final image.
        const captureWrapper = document.createElement('div');
        Object.assign(captureWrapper.style, {
            position: 'absolute',
            left: '-9999px',
            top: '0',
            width: `${preview.offsetWidth}px`,
            height: `${preview.scrollHeight}px`,
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
        });

        // 4. Assemble the layers.
        captureWrapper.appendChild(backgroundClone);
        captureWrapper.appendChild(contentClone);

        // 5. Append to body.
        document.body.appendChild(captureWrapper);

        try {
            // 6. Use domtoimage.toPng to capture the composed element.
            const dataUrl = await domtoimage.toPng(captureWrapper, {
                width: captureWrapper.offsetWidth,
                height: captureWrapper.offsetHeight,
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
            alert(`截图失败！请打开开发者工具(F12)查看控制台(Console)中的错误信息。\n\n${error}`);
        } finally {
            // 8. Clean up.
            if (document.body.contains(captureWrapper)) {
                document.body.removeChild(captureWrapper);
            }
        }
    };

    markdownInput.addEventListener('input', render);
    themeSelect.addEventListener('change', switchTheme);
    downloadBtn.addEventListener('click', downloadImage);

    // Initial render and theme
    switchTheme();
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