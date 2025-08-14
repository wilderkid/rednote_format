document.addEventListener('DOMContentLoaded', () => {
    // --- General Elements ---
    const themeSelect = document.getElementById('theme-select');
    const fontSelect = document.getElementById('font-select');
    const downloadBtn = document.getElementById('download-btn');
    const backgroundContainer = document.getElementById('background-container');
    const loadingOverlay = document.getElementById('loading-overlay');

    // --- Mode Switching Elements ---
    const navContentBtn = document.getElementById('nav-content-btn');
    const navCoverBtn = document.getElementById('nav-cover-btn');
    const contentMakerView = document.getElementById('content-maker-view');
    const coverMakerView = document.getElementById('cover-maker-view');

    // --- Content Maker Elements ---
    const markdownInput = document.getElementById('markdown-input');
    const htmlOutput = document.getElementById('html-output');
    const resizer = document.getElementById('resizer');
    const mainGrid = document.querySelector('#content-maker-view main');

    // --- Cover Maker Elements ---
    const coverTitleInput = document.getElementById('cover-title-input');
    const coverAuthorInput = document.getElementById('cover-author-input');
    const coverPreviewArea = document.getElementById('cover-preview-area');
    const coverTitleOutput = document.getElementById('cover-title-output');
    const coverAuthorOutput = document.getElementById('cover-author-output');

    // --- State ---
    let currentMode = 'content'; // 'content' or 'cover'

    //==================================================================
    // INITIALIZATION
    //==================================================================

    marked.setOptions({
        gfm: true,
        breaks: true,
    });

    //==================================================================
    // MODE SWITCHING
    //==================================================================

    const switchMode = (mode) => {
        currentMode = mode;
        if (mode === 'content') {
            contentMakerView.style.display = 'block';
            coverMakerView.style.display = 'none';
            navContentBtn.classList.add('active');
            navCoverBtn.classList.remove('active');
        } else {
            contentMakerView.style.display = 'none';
            coverMakerView.style.display = 'block';
            navContentBtn.classList.remove('active');
            navCoverBtn.classList.add('active');
            renderCover(); // Initial render for cover
        }
    };

    navContentBtn.addEventListener('click', () => switchMode('content'));
    navCoverBtn.addEventListener('click', () => switchMode('cover'));

    //==================================================================
    // THEME & FONT
    //==================================================================

    const switchTheme = () => {
        const selectedTheme = themeSelect.value;
        document.body.className = `${selectedTheme}-theme`;
        // For non-background themes like GitHub, don't apply a background image class
        if (selectedTheme.startsWith('theme_bg_')) {
            backgroundContainer.className = `bg-${selectedTheme}`;
        } else {
            backgroundContainer.className = '';
        }
    };

    const switchFont = () => {
        const selectedFont = fontSelect.value;
        const previewAreas = document.querySelectorAll('.preview-area');
        previewAreas.forEach(area => {
            area.className = area.className.replace(/\s?font-\S*/g, '');
            if (selectedFont !== 'default') {
                area.classList.add(`font-${selectedFont}`);
            }
        });
    };

    themeSelect.addEventListener('change', switchTheme);
    fontSelect.addEventListener('change', switchFont);

    //==================================================================
    // CONTENT MAKER LOGIC
    //==================================================================

    const renderContent = () => {
        const markdownText = markdownInput.value;
        let html = marked.parse(markdownText);
        html = html.replace(/<strong>/g, '<span class="keyword">').replace(/<\/strong>/g, '</span>');
        htmlOutput.innerHTML = html;
    };

    markdownInput.addEventListener('input', renderContent);

    // --- Resizer Logic ---
    const initResizer = (resizerEl, mainGridEl) => {
        let isResizing = false;

        resizerEl.addEventListener('mousedown', (e) => {
            isResizing = true;
            document.body.style.userSelect = 'none';
            document.body.style.pointerEvents = 'none'; // Prevent interacting with elements underneath

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        const onMouseMove = (e) => {
            if (!isResizing) return;
            const mainRect = mainGridEl.getBoundingClientRect();
            const newWidth = e.clientX - mainRect.left;
            const totalWidth = mainGridEl.offsetWidth - resizerEl.offsetWidth;
            
            // Prevent resizing to extreme values
            if (newWidth < 100 || newWidth > totalWidth - 100) return;

            const leftFraction = (newWidth / totalWidth);
            const rightFraction = 1 - leftFraction;
            mainGridEl.style.gridTemplateColumns = `${leftFraction}fr ${resizerEl.offsetWidth}px ${rightFraction}fr`;
        };

        const onMouseUp = () => {
            isResizing = false;
            document.body.style.userSelect = '';
            document.body.style.pointerEvents = '';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }

    initResizer(document.getElementById('resizer'), document.querySelector('#content-maker-view main'));
    initResizer(document.getElementById('cover-resizer'), document.querySelector('#cover-maker-view main'));

    //==================================================================
    // COVER MAKER LOGIC
    //==================================================================

    const renderCover = () => {
        coverTitleOutput.innerText = coverTitleInput.value;
        coverAuthorOutput.innerText = coverAuthorInput.value ? `By: ${coverAuthorInput.value}` : '';
    };

    coverTitleInput.addEventListener('input', renderCover);
    coverAuthorInput.addEventListener('input', renderCover);

    //==================================================================
    // DOWNLOAD LOGIC
    //==================================================================

    const downloadImage = async (elementToCapture, filename) => {
        const loadingOverlay = document.getElementById('loading-overlay');
        const captureWrapper = document.createElement('div');

        try {
            loadingOverlay.style.display = 'flex';

            const computedStyle = window.getComputedStyle(elementToCapture);
            const width = elementToCapture.scrollWidth;
            const height = elementToCapture.scrollHeight;

            Object.assign(captureWrapper.style, {
                position: 'absolute',
                left: '-9999px',
                top: '0',
                width: `${width}px`,
                height: `${height}px`,
                overflow: 'hidden',
            });

            const backgroundClone = backgroundContainer.cloneNode(true);
            const contentClone = elementToCapture.cloneNode(true);

            Object.assign(backgroundClone.style, { position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' });
            Object.assign(contentClone.style, { position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', overflow: 'visible', boxSizing: 'border-box' });

            captureWrapper.appendChild(backgroundClone);
            captureWrapper.appendChild(contentClone);
            document.body.appendChild(captureWrapper);

            const dataUrl = await domtoimage.toPng(captureWrapper, {
                width: width,
                height: height,
            });

            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

        } catch (error) {
            console.error('Image capture failed:', error);
            alert(`Image capture failed! Check the console (F12) for details.\n\n${error}`);
        } finally {
            loadingOverlay.style.display = 'none';
            if (document.body.contains(captureWrapper)) {
                document.body.removeChild(captureWrapper);
            }
        }
    };

    downloadBtn.addEventListener('click', () => {
        if (currentMode === 'content') {
            downloadImage(htmlOutput, 'rednote-content.png');
        } else {
            downloadImage(coverPreviewArea, 'rednote-cover.png');
        }
    });

    //==================================================================
    // INITIAL RENDER
    //==================================================================
    switchTheme();
    switchFont();
    renderContent();
    switchMode('content'); // Start in content mode
});
