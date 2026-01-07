// const fs = require('fs');
// const { captureState } = require('./clock_captures');

document.addEventListener('DOMContentLoaded', () => {
    const grids = [
        { rows: 6, cols: 4 },  // Hours
        { rows: 10, cols: 6 }, // Minutes
        { rows: 10, cols: 6 }  // Seconds
    ];

    const squareSize = 20;
    const squareGap = 0;
    const renderingCorrection = 0; // for all browsers except firefox 
    const columnGap = squareGap * 3 || (squareSize + renderingCorrection) * 1.5;

    // Create main SVG that spans the entire screen
    const mainSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    mainSVG.setAttribute('width', '100%');
    mainSVG.setAttribute('height', '100%');
    mainSVG.setAttribute('style', 'background-color: black;'); // Set background color to black
    document.body.appendChild(mainSVG);

    function createSVG(rows, cols) {
        const width = cols * (squareSize + squareGap) - squareGap;
        const height = rows * (squareSize + squareGap) - squareGap;
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', j * (squareSize + squareGap - renderingCorrection));
                rect.setAttribute('y', i * (squareSize + squareGap - renderingCorrection));
                // rect.setAttribute('x', j * (squareSize + squareGap));
                // rect.setAttribute('y', i * (squareSize + squareGap));
                rect.setAttribute('width', squareSize + renderingCorrection);
                rect.setAttribute('height', squareSize + renderingCorrection);
                rect.setAttribute('fill', 'black');
                rect.setAttribute('shape-rendering', 'crispEdges');
                group.appendChild(rect);
            }
        }
        return { group, width, height };
    }

    // Add all SVGs to the mainSVG
    const svgElements = grids.map((grid, index) => {
        const { group, width, height } = createSVG(grid.rows, grid.cols);
        group.setAttribute('data-index', index); // Add index data attribute

        mainSVG.appendChild(group);
        return { group, width, height };
    });

    const gridStates = svgElements.map(({ group }) => ({
        activeSquares: new Set(),
        inactiveSquares: new Set(group.querySelectorAll('rect')),
        isFull: false,
        lastValue: -1
    }));

    function centerGroups() {
        const totalWidth = svgElements.reduce((sum, { width }) => sum + width, 0) + (svgElements.length - 1) * columnGap;
        const maxHeight = Math.max(...svgElements.map(({ height }) => height));

        let offsetX = 0;

        svgElements.forEach(({ group, width, height }) => {
            const translateX = offsetX;
            const translateY = (maxHeight - height) / 2;

            group.setAttribute('transform', `translate(${translateX}, ${translateY})`);
            offsetX += width + columnGap;
        });
    }

    function scaleGroups() {
        const totalWidth = svgElements.reduce((sum, { width }) => sum + width, 0) + (svgElements.length - 1) * columnGap;
        const maxHeight = Math.max(...svgElements.map(({ height }) => height));

        const scale = Math.min(window.innerWidth / totalWidth, window.innerHeight / maxHeight) * 0.66;

        // If clockContainer doesn't exist, create it
        let clockContainer = document.getElementById('clock-container');
        if (!clockContainer) {
            clockContainer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            clockContainer.setAttribute('id', 'clock-container');

            // Move all groups into the clock container
            svgElements.forEach(({ group }) => {
                clockContainer.appendChild(group);
            });

            mainSVG.appendChild(clockContainer);
        }

        // Center the clock container
        const scaledWidth = totalWidth * scale;
        const scaledHeight = maxHeight * scale;
        const translateX = (window.innerWidth - scaledWidth) / 2;
        const translateY = (window.innerHeight - scaledHeight) / 2;

        mainSVG.setAttribute('width', window.innerWidth);
        mainSVG.setAttribute('height', window.innerHeight);

        // Apply both translation and scaling in a single transform
        clockContainer.setAttribute('transform', `translate(${translateX}, ${translateY}) scale(${scale})`);

        // Update viewBox to match window dimensions
        mainSVG.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
    }

    function updateClock() {
        const now = new Date();
        updateGrid(svgElements[0].group, gridStates[0], now.getHours(), 24);
        updateGrid(svgElements[1].group, gridStates[1], now.getMinutes(), 60);
        updateGrid(svgElements[2].group, gridStates[2], now.getSeconds(), 60);

        // captureState();
    }

    function updateGrid(svg, state, value, max) {
        if (value < state.lastValue || (state.lastValue === max - 1 && value === 0)) {
            state.isFull = !state.isFull;
            state.activeSquares.clear();
            state.inactiveSquares = new Set(svg.querySelectorAll('rect'));
        }

        const totalSquares = svg.querySelectorAll('rect').length;
        const targetActiveSquares = state.isFull ?
            totalSquares - Math.floor((value / max) * totalSquares) :
            Math.floor((value / max) * totalSquares);

        if (targetActiveSquares > state.activeSquares.size) {
            const toAdd = targetActiveSquares - state.activeSquares.size;
            const shuffledInactive = shuffleArray(Array.from(state.inactiveSquares));
            for (let i = 0; i < toAdd; i++) {
                const square = shuffledInactive[i];
                state.activeSquares.add(square);
                state.inactiveSquares.delete(square);
            }
        } else if (targetActiveSquares < state.activeSquares.size) {
            const toRemove = state.activeSquares.size - targetActiveSquares;
            const shuffledActive = shuffleArray(Array.from(state.activeSquares));
            for (let i = 0; i < toRemove; i++) {
                const square = shuffledActive[i];
                state.activeSquares.delete(square);
                state.inactiveSquares.add(square);
            }
        }

        svg.querySelectorAll('rect').forEach(rect => {
            rect.setAttribute('fill', state.activeSquares.has(rect) ? 'white' : 'black');
        });

        state.lastValue = value;
    }

    // let captureCount = 0;
    // const maxCaptures = 2;

    // let capturedStates = [];


    // async function captureState() {

    //     if (captureCount >= maxCaptures) {
    //         return;  // Stop capturing once maxCaptures is reached
    //     }
    //     // Capture the DOM state asynchronously
    //     const htmlContent = await new XMLSerializer().serializeToString(document.documentElement);
    //     capturedStates.push(htmlContent);
    //     // Write to file
    //     fs.writeFileSync(`src/clock_captures.nosync/as_html/output_${captureCount}.html`, htmlContent);
    //     captureCount++;
    // }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    window.addEventListener('resize', () => {
        centerGroups();
        scaleGroups();
    });


    let lastUpdateSecond = -1;

    function startClock() {
        function checkTime() {
            const now = performance.now();
            const currentSecond = Math.floor(now / 1000);
            const milliseconds = now % 1000;

            if (milliseconds < 100 && currentSecond !== lastUpdateSecond) {
                updateClock();
                lastUpdateSecond = currentSecond;
            }

            requestAnimationFrame(checkTime);
        }

        requestAnimationFrame(checkTime);
    }

    centerGroups();
    scaleGroups();
    startClock();
});

