document.addEventListener('DOMContentLoaded', () => {
    const markdownInput = document.getElementById('markdown-input');
    const htmlOutput = document.getElementById('html-output');
    const themeSelect = document.getElementById('theme-select');
    const downloadBtn = document.getElementById('download-btn');

    // Configure marked.js
    // const renderer = new marked.Renderer();
    // renderer.strong = (text) => `<span class="keyword">${text}</span>`;

    marked.setOptions({
        gfm: true,
        breaks: true,
    });

    const render = () => {
        const markdownText = markdownInput.value;
        let html = marked.parse(markdownText);
        // Post-process the HTML to replace <strong> with our custom span
        html = html.replace(/<strong>/g, '<span class="keyword">').replace(/<\/strong>/g, '</span>');
        htmlOutput.innerHTML = html;
    };

    const switchTheme = () => {
        const selectedTheme = themeSelect.value;
        const backgroundContainer = document.getElementById('background-container');

        // Set the theme class on the body for text/preview area styling
        document.body.className = `${selectedTheme}-theme`;

        // Also set a dedicated class on the background container for the image
        // This makes the CSS much cleaner.
        backgroundContainer.className = `bg-${selectedTheme}`;
    };

    const downloadImage = async () => {
        const main = document.querySelector('main');
        const preview = document.getElementById('html-output');
        const editor = document.getElementById('markdown-input');
        const resizer = document.getElementById('resizer');
        const background = document.getElementById('background-container');

        // --- 1. Save original styles ---
        const originalState = {
            main: {
                height: main.style.height,
                gridTemplateColumns: main.style.gridTemplateColumns,
            },
            preview: {
                height: preview.style.height,
                overflow: preview.style.overflow,
            },
            editorDisplay: editor.style.display,
            resizerDisplay: resizer.style.display,
        };

        // --- 2. Prepare for capture by "unconstraining" the preview element ---
        // Temporarily hide other elements and let the preview take full width
        main.style.gridTemplateColumns = '1fr';
        editor.style.display = 'none';
        resizer.style.display = 'none';
        
        // Let the container and preview expand to the full content height
        main.style.height = 'auto';
        preview.style.height = 'auto';
        preview.style.overflow = 'visible';

        // --- 3. Create a temporary background element INSIDE the preview area ---
        // This ensures the background is part of the captured element
        const bgComputedStyle = window.getComputedStyle(background);
        const innerBg = document.createElement('div');
        innerBg.style.position = 'absolute';
        innerBg.style.top = '0';
        innerBg.style.left = '0';
        innerBg.style.width = '100%';
        innerBg.style.height = `${preview.scrollHeight}px`; // Use the full scroll height
        innerBg.style.zIndex = '-1';
        innerBg.style.backgroundImage = bgComputedStyle.backgroundImage;
        innerBg.style.filter = bgComputedStyle.filter;
        innerBg.style.backgroundSize = 'cover';
        innerBg.style.backgroundPosition = 'center';
        innerBg.style.transform = 'scale(1.1)';
        preview.style.position = 'relative';
        preview.prepend(innerBg);

        // --- HTML2CANVAS BUG WORKAROUND ---
        const keywords = preview.querySelectorAll('.keyword');
        const originalKeywordDisplays = [];
        keywords.forEach(keyword => {
            originalKeywordDisplays.push(keyword.style.display);
            keyword.style.display = 'inline-block';
        });

        // --- 4. Execute Capture ---
        try {
            const canvas = await html2canvas(preview, {
                useCORS: true,
                backgroundColor: null,
                // Ensure html2canvas uses the full scroll height for rendering
                height: preview.scrollHeight,
                windowHeight: preview.scrollHeight,
            });

            const a = document.createElement('a');
            a.href = canvas.toDataURL('image/png');
            a.download = 'xiaohongshu-note.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

        } catch (error) {
            console.error('截图失败，错误信息:', error);
            alert('截图失败！请打开开发者工具(F12)查看控制台(Console)中的错误信息。');
        } finally {
            // --- 5. Restore original styles ---
            main.style.height = originalState.main.height;
            main.style.gridTemplateColumns = originalState.main.gridTemplateColumns;
            preview.style.height = originalState.preview.height;
            preview.style.overflow = originalState.preview.overflow;
            editor.style.display = originalState.editorDisplay;
            resizer.style.display = originalState.resizerDisplay;
            preview.style.position = '';
            // Remove the temporary inner background
            if (preview.contains(innerBg)) {
                preview.removeChild(innerBg);
            }
            // Restore keyword display styles
            keywords.forEach((keyword, index) => {
                keyword.style.display = originalKeywordDisplays[index];
            });
        }
    };

    markdownInput.addEventListener('input', render);
    themeSelect.addEventListener('change', switchTheme);
    downloadBtn.addEventListener('click', downloadImage);

    // Initial render and theme
    switchTheme();
    render();
});
    // --- Resizer Logic ---
    const resizer = document.getElementById('resizer');
    const main = resizer.parentElement;

    let isResizing = false;

    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        // Set a class to the body to prevent text selection during resize
        document.body.style.userSelect = 'none';
        document.body.style.pointerEvents = 'none';

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    const onMouseMove = (e) => {
        if (!isResizing) return;

        // Get the left boundary of the main container
        const mainRect = main.getBoundingClientRect();
        const newWidth = e.clientX - mainRect.left;

        // Calculate the total width of the main container minus the resizer
        const totalWidth = main.offsetWidth - resizer.offsetWidth;
        
        // Calculate the new fractions for the grid
        const leftFraction = (newWidth / totalWidth);
        const rightFraction = 1 - leftFraction;

        // Set the new grid template columns
        // We use flex-grow values for the columns to make them responsive
        main.style.gridTemplateColumns = `${leftFraction}fr ${resizer.offsetWidth}px ${rightFraction}fr`;
    };

    const onMouseUp = () => {
        isResizing = false;
        // Remove the styles and event listeners
        document.body.style.userSelect = '';
        document.body.style.pointerEvents = '';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };