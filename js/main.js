document.addEventListener('DOMContentLoaded', () => {
    // --- General Elements ---
    const themeSelect = document.getElementById('theme-select');
    const fontSelect = document.getElementById('font-select');
    const downloadBtn = document.getElementById('download-btn');
    const backgroundContainer = document.getElementById('background-container');
    const loadingOverlay = document.getElementById('loading-overlay');
    const titleSizeInput = document.getElementById('title-size-input');
    const contentSizeInput = document.getElementById('content-size-input');

    // --- Mode Switching Elements ---
    const navContentBtn = document.getElementById('nav-content-btn');
    const navCoverBtn = document.getElementById('nav-cover-btn');
    const contentMakerView = document.getElementById('content-maker-view');
    const coverMakerView = document.getElementById('cover-maker-view');

    // --- Content Maker Elements ---
    const markdownInput = document.getElementById('markdown-input');
    const htmlOutput = document.getElementById('html-output');

    // --- Cover Maker Elements ---
    const coverPreviewArea = document.getElementById('cover-preview-area');
    const coverTypeSwitcher = document.getElementById('cover-type-switcher');
    const sentenceInputs = document.getElementById('sentence-inputs');
    const sentenceLayout = document.getElementById('sentence-layout');
    const coverTitleInput = document.getElementById('cover-title-input');
    const coverAuthorInput = document.getElementById('cover-author-input');
    const coverTitleOutput = document.getElementById('cover-title-output');
    const newsInputs = document.getElementById('news-inputs');
    const newsLayout = document.getElementById('news-layout');
    const newsTitleInput = document.getElementById('news-title-input');
    const newsListInput = document.getElementById('news-list-input');
    const newsTitleOutput = document.getElementById('news-title-output');
    const newsListOutput = document.getElementById('news-list-output');
    const coverDate = document.getElementById('cover-date');
    const footerAuthor = document.getElementById('footer-author');

    // --- State ---
    let currentMode = 'content';
    let currentCoverType = 'sentence';

    //==================================================================
    // INITIALIZATION
    //==================================================================

    marked.setOptions({
        gfm: true,
        breaks: true,
    });

    // Create a dynamic stylesheet for font sizes
    const dynamicStyles = document.createElement('style');
    dynamicStyles.id = 'dynamic-font-styles';
    document.head.appendChild(dynamicStyles);

    //==================================================================
    // MODE & VIEW SWITCHING
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
            renderCover();
            displayDate();
        }
    };

    const switchCoverType = (type) => {
        currentCoverType = type;
        if (type === 'sentence') {
            sentenceInputs.style.display = 'block';
            sentenceLayout.style.display = 'block';
            newsInputs.style.display = 'none';
            newsLayout.style.display = 'none';
        } else {
            sentenceInputs.style.display = 'none';
            newsInputs.style.display = 'block';
            sentenceLayout.style.display = 'none';
            newsLayout.style.display = 'block';
        }
        renderCover();
    }

    navContentBtn.addEventListener('click', () => switchMode('content'));
    navCoverBtn.addEventListener('click', () => switchMode('cover'));
    coverTypeSwitcher.addEventListener('change', (e) => switchCoverType(e.target.value));

    //==================================================================
    // THEME & FONT
    //==================================================================

    const switchTheme = () => {
        const selectedTheme = themeSelect.value;
        document.body.className = `${selectedTheme}-theme`;
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

    const updateFontStyles = () => {
        const titleSize = titleSizeInput.value;
        const contentSize = contentSizeInput.value;

        const css = `
            /* Content Mode Font Sizes */
            #html-output { font-size: ${contentSize}px; }
            #html-output h1 { font-size: ${titleSize * 0.025}em; } 
            #html-output h2 { font-size: ${titleSize * 0.02}em; } 
            #html-output h3 { font-size: ${titleSize * 0.0175}em; } 

            /* Cover Mode Font Sizes */
            #cover-title-output { font-size: ${titleSize}px; }
            #news-title-output { font-size: ${titleSize}px; }
            #news-list-output li { font-size: ${contentSize}px; }
            #footer-author { font-size: ${contentSize * 0.8}px; }
            .footer-promo-text { font-size: ${contentSize * 0.7}px; }
        `;
        dynamicStyles.textContent = css;
    };

    themeSelect.addEventListener('change', switchTheme);
    fontSelect.addEventListener('change', switchFont);
    titleSizeInput.addEventListener('input', updateFontStyles);
    contentSizeInput.addEventListener('input', updateFontStyles);

    //==================================================================
    // RENDER LOGIC
    //==================================================================

    const renderContent = () => {
        const markdownText = markdownInput.value;
        let html = marked.parse(markdownText);
        html = html.replace(/<strong>/g, '<span class="keyword">').replace(/<\/strong>/g, '</span>');
        htmlOutput.innerHTML = html;
    };

    const renderSentenceCover = () => {
        coverTitleOutput.innerHTML = coverTitleInput.value.replace(/\n/g, '<br>');
        footerAuthor.innerText = coverAuthorInput.value;
    };

    const renderNewsCover = () => {
        newsTitleOutput.innerText = newsTitleInput.value;
        const items = newsListInput.value.split('\n').filter(item => item.trim() !== '');
        newsListOutput.innerHTML = items.map(item => `<li>${item}</li>`).join('');
        // Add inline style to prevent default list markers in html2canvas
        newsListOutput.style.listStyleType = 'none';
        footerAuthor.innerText = coverAuthorInput.value;
    };

    const renderCover = () => {
        if (currentCoverType === 'sentence') {
            renderSentenceCover();
        } else {
            renderNewsCover();
        }
    };

    const displayDate = () => {
        const today = new Date();
        const y = today.getFullYear();
        const m = String(today.getMonth() + 1).padStart(2, '0');
        const d = String(today.getDate()).padStart(2, '0');
        coverDate.innerText = `${y} / ${m} / ${d}`;
    };

    //==================================================================
    // EVENT LISTENERS
    //==================================================================

    markdownInput.addEventListener('input', renderContent);
    coverTitleInput.addEventListener('input', renderCover);
    coverAuthorInput.addEventListener('input', renderCover);
    newsTitleInput.addEventListener('input', renderCover);
    newsListInput.addEventListener('input', renderCover);

    // --- Resizer Logic ---
    const initResizer = (resizerEl, mainGridEl) => {
        let isResizing = false;
        resizerEl.addEventListener('mousedown', () => {
            isResizing = true;
            document.body.style.userSelect = 'none';
            document.body.style.pointerEvents = 'none';
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
        const onMouseMove = (e) => {
            if (!isResizing) return;
            const mainRect = mainGridEl.getBoundingClientRect();
            const newWidth = e.clientX - mainRect.left;
            const totalWidth = mainGridEl.offsetWidth - resizerEl.offsetWidth;
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
    // DOWNLOAD LOGIC
    //==================================================================

    const downloadImage = async (elementToCapture, filename) => {
        try {
            loadingOverlay.style.display = 'flex';

            // Get the computed style of the background container
            const backgroundContainer = document.getElementById('background-container');

            // Create a canvas for the background
            const backgroundCanvas = await html2canvas(backgroundContainer, {
                useCORS: true,
                scale: 2,
                width: elementToCapture.offsetWidth,
                height: elementToCapture.scrollHeight,
                x: 0,
                y: 0,
                scrollX: 0,
                scrollY: 0,
                windowWidth: elementToCapture.offsetWidth,
                windowHeight: elementToCapture.scrollHeight,
            });

            // Create a canvas for the content
            const contentCanvas = await html2canvas(elementToCapture, {
                useCORS: true,
                scale: 2,
                backgroundColor: null, // Capture with transparent background
            });

            // Create a final canvas to merge the two
            const finalCanvas = document.createElement('canvas');
            const ctx = finalCanvas.getContext('2d');
            finalCanvas.width = contentCanvas.width;
            finalCanvas.height = contentCanvas.height;

            // Draw the background canvas first
            ctx.drawImage(backgroundCanvas, 0, 0, finalCanvas.width, finalCanvas.height);

            // Draw the content canvas on top
            ctx.drawImage(contentCanvas, 0, 0, finalCanvas.width, finalCanvas.height);

            // Trigger the download
            const a = document.createElement('a');
            a.href = finalCanvas.toDataURL('image/png');
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

        } catch (error) {
            console.error('Image capture failed:', error);
            alert(`Image capture failed! Check the console (F12) for details.\n\n${error}`);
        } finally {
            loadingOverlay.style.display = 'none';
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
    renderCover();
    updateFontStyles();
    switchMode('content');
});
