document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('polygonCanvas');
    const ctx = canvas.getContext('2d');
    
    // Application state
    const state = {
        points: [],
        isClosed: false,
        unit: 'cm',
        cursorColor: '#ff4444',
        lineColor: '#3498db',
        lineWidth: 3,
        fillColor: '#3498db33',
        gridSize: 50,
        pointSize: 5,
        origin: { x: 0, y: 0 },
        offset: { x: 0, y: 0 },
        isDragging: false,
        lastPanPoint: { x: 0, y: 0 },
        currentMode: 'plot',
        isTouchDevice: false,
        currentMousePos: { x: 0, y: 0 },
        scale: 1.0
    };
    
    // DOM Elements
    const unitSelect = document.getElementById('unit');
    const mobileUnitSelect = document.getElementById('mobileUnit');
    const cursorColorInput = document.getElementById('cursorColor');
    const mobileCursorColorInput = document.getElementById('mobileCursorColor');
    const lineColorInput = document.getElementById('lineColor');
    const mobileLineColorInput = document.getElementById('mobileLineColor');
    const lineWidthInput = document.getElementById('lineWidth');
    const mobileLineWidthInput = document.getElementById('mobileLineWidth');
    const lineWidthValue = document.getElementById('lineWidthValue');
    const mobileLineWidthValue = document.getElementById('mobileLineWidthValue');
    const fillColorInput = document.getElementById('fillColor');
    const mobileFillColorInput = document.getElementById('mobileFillColor');
    const gridSizeInput = document.getElementById('gridSize');
    const mobileGridSizeInput = document.getElementById('mobileGridSize');
    const gridSizeValue = document.getElementById('gridSizeValue');
    const mobileGridSizeValue = document.getElementById('mobileGridSizeValue');
    const pointSizeInput = document.getElementById('pointSize');
    const mobilePointSizeInput = document.getElementById('mobilePointSize');
    const pointSizeValue = document.getElementById('pointSizeValue');
    const mobilePointSizeValue = document.getElementById('mobilePointSizeValue');
    const clearBtn = document.getElementById('clearBtn');
    const plotModeBtn = document.getElementById('plotModeBtn');
    const panModeBtn = document.getElementById('panModeBtn');
    const resultsDiv = document.getElementById('results');
    const cursorCoords = document.getElementById('cursorCoords');
    const liveMeasurement = document.getElementById('liveMeasurement');
    const modeIndicator = document.getElementById('modeIndicator');
    
    // Detect touch device
    state.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Initialize canvas dimensions
    function initCanvas() {
        const container = canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // Set origin to center
        state.origin = {
            x: canvas.width / 2,
            y: canvas.height / 2
        };
        
        updateCursorDisplay({x: 0, y: 0});
        redraw();
    }
    
    // Event Listeners
    function setupEventListeners() {
        // Mouse events
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mouseleave', handleMouseUp);
        
        // Touch events
        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas.addEventListener('touchend', handleTouchEnd);
        
        // Control events - Desktop
        unitSelect.addEventListener('change', (e) => {
            state.unit = e.target.value;
            mobileUnitSelect.value = e.target.value;
            updateCursorDisplay(state.currentMousePos);
            redraw();
        });
        
        cursorColorInput.addEventListener('input', (e) => {
            state.cursorColor = e.target.value;
            mobileCursorColorInput.value = e.target.value;
            updateCursorDisplay(state.currentMousePos);
            redraw();
        });
        
        lineColorInput.addEventListener('input', (e) => {
            state.lineColor = e.target.value;
            mobileLineColorInput.value = e.target.value;
            redraw();
        });
        
        lineWidthInput.addEventListener('input', (e) => {
            state.lineWidth = parseInt(e.target.value);
            lineWidthValue.textContent = state.lineWidth;
            mobileLineWidthInput.value = state.lineWidth;
            mobileLineWidthValue.textContent = state.lineWidth;
            redraw();
        });
        
        fillColorInput.addEventListener('input', (e) => {
            state.fillColor = e.target.value;
            mobileFillColorInput.value = e.target.value;
            redraw();
        });
        
        gridSizeInput.addEventListener('input', (e) => {
            state.gridSize = parseInt(e.target.value);
            gridSizeValue.textContent = state.gridSize;
            mobileGridSizeInput.value = state.gridSize;
            mobileGridSizeValue.textContent = state.gridSize;
            redraw();
        });
        
        pointSizeInput.addEventListener('input', (e) => {
            state.pointSize = parseInt(e.target.value);
            pointSizeValue.textContent = state.pointSize;
            mobilePointSizeInput.value = state.pointSize;
            mobilePointSizeValue.textContent = state.pointSize;
            redraw();
        });
        
        clearBtn.addEventListener('click', clearPolygon);
        
        // Control events - Mobile
        mobileUnitSelect.addEventListener('change', (e) => {
            state.unit = e.target.value;
            unitSelect.value = e.target.value;
            updateCursorDisplay(state.currentMousePos);
            redraw();
        });
        
        mobileCursorColorInput.addEventListener('input', (e) => {
            state.cursorColor = e.target.value;
            cursorColorInput.value = e.target.value;
            updateCursorDisplay(state.currentMousePos);
            redraw();
        });
        
        mobileLineColorInput.addEventListener('input', (e) => {
            state.lineColor = e.target.value;
            lineColorInput.value = e.target.value;
            redraw();
        });
        
        mobileLineWidthInput.addEventListener('input', (e) => {
            state.lineWidth = parseInt(e.target.value);
            lineWidthInput.value = state.lineWidth;
            lineWidthValue.textContent = state.lineWidth;
            mobileLineWidthValue.textContent = state.lineWidth;
            redraw();
        });
        
        mobileFillColorInput.addEventListener('input', (e) => {
            state.fillColor = e.target.value;
            fillColorInput.value = e.target.value;
            redraw();
        });
        
        mobileGridSizeInput.addEventListener('input', (e) => {
            state.gridSize = parseInt(e.target.value);
            gridSizeInput.value = state.gridSize;
            gridSizeValue.textContent = state.gridSize;
            mobileGridSizeValue.textContent = state.gridSize;
            redraw();
        });
        
        mobilePointSizeInput.addEventListener('input', (e) => {
            state.pointSize = parseInt(e.target.value);
            pointSizeInput.value = state.pointSize;
            pointSizeValue.textContent = state.pointSize;
            mobilePointSizeValue.textContent = state.pointSize;
            redraw();
        });
        
        // Mode buttons
        plotModeBtn.addEventListener('click', () => setMode('plot'));
        panModeBtn.addEventListener('click', () => setMode('pan'));
        
        window.addEventListener('load', initCanvas);
        window.addEventListener('resize', initCanvas);
        
        // Prevent context menu on right click
        canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    // Mode management
    function setMode(mode) {
        state.currentMode = mode;
        
        // Update button states
        plotModeBtn.classList.toggle('active', mode === 'plot');
        panModeBtn.classList.toggle('active', mode === 'pan');
        
        // Update cursor and indicator
        canvas.style.cursor = mode === 'plot' ? 'crosshair' : 'grab';
        modeIndicator.textContent = mode === 'plot' ? '📐 Plot Mode Active' : '🖐️ Pan Mode Active';
        modeIndicator.style.borderColor = mode === 'plot' ? 
            'rgba(79, 168, 228, 0.5)' : 'rgba(46, 204, 113, 0.5)';
        
        // Update instructions
        updateInstructions();
        
        // Reset dragging state
        state.isDragging = false;
        
        redraw();
    }
    
    function updateInstructions() {
        if (state.currentMode === 'plot') {
            resultsDiv.innerHTML = `
                <p><strong>Plot Mode Active</strong> - Click/tap to add points</p>
                <p>Close the polygon by clicking near the first point</p>
                <p>Switch to Pan Mode to move around the drawing area</p>
            `;
        } else {
            resultsDiv.innerHTML = `
                <p><strong>Pan Mode Active</strong> - Click and drag to move around</p>
                <p>Switch to Plot Mode to add points and create polygons</p>
            `;
        }
    }
    
    // Mouse event handlers
    function handleMouseDown(e) {
        if (state.currentMode === 'pan') {
            state.isDragging = true;
            state.lastPanPoint = { x: e.clientX, y: e.clientY };
            canvas.style.cursor = 'grabbing';
            e.preventDefault();
        } else if (state.currentMode === 'plot' && e.button === 0) {
            const screenPoint = getCanvasCoordinates(e);
            const worldPoint = screenToWorld(screenPoint);
            handlePointAddition(worldPoint);
        }
    }
    
    function handleMouseMove(e) {
        const screenPoint = getCanvasCoordinates(e);
        state.currentMousePos = screenPoint;
        
        const worldPoint = screenToWorld(screenPoint);
        
        updateCursorDisplay(worldPoint);
        
        if (state.currentMode === 'pan' && state.isDragging) {
            const dx = e.clientX - state.lastPanPoint.x;
            const dy = e.clientY - state.lastPanPoint.y;
            
            state.offset.x += dx;
            state.offset.y += dy;
            
            state.lastPanPoint = { x: e.clientX, y: e.clientY };
            redraw();
        } else if (state.currentMode === 'plot' && state.points.length > 0 && !state.isClosed) {
            showLiveMeasurement(screenPoint, worldPoint);
        } else {
            redraw();
        }
    }
    
    function handleMouseUp() {
        if (state.currentMode === 'pan') {
            state.isDragging = false;
            canvas.style.cursor = 'grab';
        }
    }
    
    // Touch event handlers
    function handleTouchStart(e) {
        e.preventDefault();
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            state.lastPanPoint = { x: touch.clientX, y: touch.clientY };
            
            if (state.currentMode === 'plot') {
                const screenPoint = getCanvasCoordinates(touch);
                const worldPoint = screenToWorld(screenPoint);
                handlePointAddition(worldPoint);
            } else if (state.currentMode === 'pan') {
                state.isDragging = true;
            }
        }
    }
    
    function handleTouchMove(e) {
        e.preventDefault();
        
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const screenPoint = getCanvasCoordinates(touch);
            state.currentMousePos = screenPoint;
            
            const worldPoint = screenToWorld(screenPoint);
            
            updateCursorDisplay(worldPoint);
            
            if (state.currentMode === 'pan' && state.isDragging) {
                const dx = touch.clientX - state.lastPanPoint.x;
                const dy = touch.clientY - state.lastPanPoint.y;
                
                state.offset.x += dx;
                state.offset.y += dy;
                
                state.lastPanPoint = { x: touch.clientX, y: touch.clientY };
                redraw();
            } else if (state.currentMode === 'plot' && state.points.length > 0 && !state.isClosed) {
                showLiveMeasurement(screenPoint, worldPoint);
            } else {
                redraw();
            }
        }
    }
    
    function handleTouchEnd(e) {
        state.isDragging = false;
    }
    
    // Coordinate conversion functions
    function getCanvasCoordinates(event) {
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        
        if (event.touches) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }
        
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }
    
    function screenToWorld(screenPoint) {
        return {
            x: (screenPoint.x - state.origin.x - state.offset.x) / state.scale,
            y: (screenPoint.y - state.origin.y - state.offset.y) / state.scale
        };
    }
    
    function worldToScreen(worldPoint) {
        return {
            x: worldPoint.x * state.scale + state.origin.x + state.offset.x,
            y: worldPoint.y * state.scale + state.origin.y + state.offset.y
        };
    }
    
    function updateCursorDisplay(worldPoint) {
        const conversionFactor = 0.1;
        const unitX = (worldPoint.x * conversionFactor).toFixed(1);
        const unitY = (-worldPoint.y * conversionFactor).toFixed(1);
        
        cursorCoords.textContent = `(${unitX}, ${unitY}) ${state.unit}`;
        cursorCoords.style.backgroundColor = state.cursorColor;
    }
    
    function handlePointAddition(worldPoint) {
        if (state.isClosed) return;
        
        const closingThreshold = 20;
        
        // Check if clicking near the first point to close the polygon
        if (state.points.length > 2) {
            const firstPoint = state.points[0];
            const distance = Math.sqrt(
                Math.pow(worldPoint.x - firstPoint.x, 2) + 
                Math.pow(worldPoint.y - firstPoint.y, 2)
            );
            
            if (distance < closingThreshold) {
                state.isClosed = true;
                redraw();
                calculateResults();
                return;
            }
        }
        
        state.points.push(worldPoint);
        redraw();
        
        // Auto-close if we have at least 3 points and user clicks near start
        if (state.points.length >= 3) {
            const firstPoint = state.points[0];
            const distance = Math.sqrt(
                Math.pow(worldPoint.x - firstPoint.x, 2) + 
                Math.pow(worldPoint.y - firstPoint.y, 2)
            );
            
            if (distance < closingThreshold) {
                state.isClosed = true;
                redraw();
                calculateResults();
            }
        }
    }
    
    function showLiveMeasurement(screenPoint, worldPoint) {
        drawGrid();
        drawExistingPolygon();
        
        const lastPoint = state.points[state.points.length - 1];
        const lastScreenPoint = worldToScreen(lastPoint);
        
        const distance = Math.sqrt(
            Math.pow(worldPoint.x - lastPoint.x, 2) + 
            Math.pow(worldPoint.y - lastPoint.y, 2)
        );
        const conversionFactor = 0.1;
        const unitDistance = (distance * conversionFactor).toFixed(2);
        
        // Draw temporary line with cursor color
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = state.cursorColor;
        ctx.lineWidth = state.lineWidth + 2;
        ctx.beginPath();
        ctx.moveTo(lastScreenPoint.x, lastScreenPoint.y);
        ctx.lineTo(screenPoint.x, screenPoint.y);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Update live measurement display
        const midX = (lastScreenPoint.x + screenPoint.x) / 2;
        const midY = (lastScreenPoint.y + screenPoint.y) / 2;
        
        liveMeasurement.textContent = `${unitDistance} ${state.unit}`;
        liveMeasurement.style.display = 'block';
        liveMeasurement.style.left = (midX - liveMeasurement.offsetWidth / 2) + 'px';
        liveMeasurement.style.top = (midY - 40) + 'px';
        liveMeasurement.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        liveMeasurement.style.color = state.cursorColor;
        liveMeasurement.style.borderColor = state.cursorColor;
    }
    
    function drawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Apply transformations
        ctx.save();
        ctx.translate(state.origin.x + state.offset.x, state.origin.y + state.offset.y);
        ctx.scale(state.scale, state.scale);
        
        // Draw grid
        ctx.strokeStyle = '#444444';
        ctx.lineWidth = 1;
        
        // Calculate visible area in world coordinates
        const visibleLeft = (-state.origin.x - state.offset.x) / state.scale;
        const visibleTop = (-state.origin.y - state.offset.y) / state.scale;
        const visibleRight = (canvas.width - state.origin.x - state.offset.x) / state.scale;
        const visibleBottom = (canvas.height - state.origin.y - state.offset.y) / state.scale;
        
        // Vertical lines
        for (let x = Math.floor(visibleLeft / state.gridSize) * state.gridSize; x <= visibleRight; x += state.gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, visibleTop);
            ctx.lineTo(x, visibleBottom);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = Math.floor(visibleTop / state.gridSize) * state.gridSize; y <= visibleBottom; y += state.gridSize) {
            ctx.beginPath();
            ctx.moveTo(visibleLeft, y);
            ctx.lineTo(visibleRight, y);
            ctx.stroke();
        }
        
        // Draw axes
        ctx.strokeStyle = '#ecf0f1';
        ctx.lineWidth = 2;
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(visibleLeft, 0);
        ctx.lineTo(visibleRight, 0);
        ctx.stroke();
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(0, visibleTop);
        ctx.lineTo(0, visibleBottom);
        ctx.stroke();
        
        // Draw axis labels
        ctx.fillStyle = '#ecf0f1';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const conversionFactor = 0.1;
        const labelStep = state.gridSize * 2;
        
        // X-axis labels
        for (let x = Math.floor(visibleLeft / labelStep) * labelStep; x <= visibleRight; x += labelStep) {
            if (Math.abs(x) > labelStep/2) {
                const measurement = (x * conversionFactor).toFixed(1);
                ctx.fillText(measurement, x, 15);
                
                // Tick marks
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, 8);
                ctx.stroke();
            }
        }
        
        // Y-axis labels
        for (let y = Math.floor(visibleTop / labelStep) * labelStep; y <= visibleBottom; y += labelStep) {
            if (Math.abs(y) > labelStep/2) {
                const measurement = (-y * conversionFactor).toFixed(1);
                ctx.fillText(measurement, -15, y);
                
                // Tick marks
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(-8, y);
                ctx.stroke();
            }
        }
        
        // Origin label
        ctx.fillStyle = state.cursorColor;
        ctx.font = 'bold 14px Arial';
        ctx.fillText('(0,0)', 15, -15);
        
        ctx.restore();
    }
    
    function drawExistingPolygon() {
        if (state.points.length === 0) return;
        
        ctx.save();
        ctx.translate(state.origin.x + state.offset.x, state.origin.y + state.offset.y);
        ctx.scale(state.scale, state.scale);
        
        // Draw filled polygon if closed
        if (state.isClosed && state.points.length >= 3) {
            ctx.fillStyle = state.fillColor;
            ctx.beginPath();
            ctx.moveTo(state.points[0].x, state.points[0].y);
            for (let i = 1; i < state.points.length; i++) {
                ctx.lineTo(state.points[i].x, state.points[i].y);
            }
            ctx.closePath();
            ctx.fill();
        }
        
        // Draw polygon lines
        ctx.strokeStyle = state.lineColor;
        ctx.lineWidth = state.lineWidth / state.scale;
        ctx.beginPath();
        ctx.moveTo(state.points[0].x, state.points[0].y);
        
        for (let i = 1; i < state.points.length; i++) {
            ctx.lineTo(state.points[i].x, state.points[i].y);
        }
        
        if (!state.isClosed && state.points.length > 1) {
            ctx.stroke();
        } else if (state.isClosed) {
            ctx.closePath();
            ctx.stroke();
        }
        
        // Draw points
        ctx.fillStyle = state.lineColor;
        for (let point of state.points) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, state.pointSize / state.scale, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Highlight first point if we have multiple points but polygon isn't closed
        if (state.points.length > 2 && !state.isClosed) {
            ctx.fillStyle = state.cursorColor;
            ctx.beginPath();
            ctx.arc(state.points[0].x, state.points[0].y, (state.pointSize + 3) / state.scale, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    function redraw() {
        liveMeasurement.style.display = 'none';
        drawGrid();
        drawExistingPolygon();
    }
    
    function calculateResults() {
        if (!state.isClosed || state.points.length < 3) return;
        
        // Calculate perimeter
        let perimeter = 0;
        let sideLengths = [];
        
        for (let i = 0; i < state.points.length; i++) {
            const p1 = state.points[i];
            const p2 = state.points[(i + 1) % state.points.length];
            const sideLength = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
            perimeter += sideLength;
            sideLengths.push(sideLength);
        }
        
        // Calculate area using shoelace formula
        let area = 0;
        for (let i = 0; i < state.points.length; i++) {
            const p1 = state.points[i];
            const p2 = state.points[(i + 1) % state.points.length];
            area += (p1.x * p2.y - p2.x * p1.y);
        }
        area = Math.abs(area) / 2;
        
        // Convert from pixels to selected unit
        const conversionFactor = 0.1;
        const unitPerimeter = (perimeter * conversionFactor).toFixed(2);
        const unitArea = (area * conversionFactor * conversionFactor).toFixed(2);
        
        // Calculate individual side lengths in selected units
        const unitSideLengths = sideLengths.map(length => 
            (length * conversionFactor).toFixed(2)
        );
        
        // Display results
        let sideLengthsHTML = '';
        unitSideLengths.forEach((length, index) => {
            sideLengthsHTML += `<div>Side ${index + 1}: ${length} ${state.unit}</div>`;
        });
        
        resultsDiv.innerHTML = `
            <div class="result-item">
                <h3>📐 Polygon Properties</h3>
                <div><strong>Shape Type:</strong> ${getPolygonType(state.points.length)}</div>
                <div><strong>Number of Sides:</strong> ${state.points.length}</div>
            </div>
            
            <div class="result-item">
                <h3>📏 Side Lengths</h3>
                ${sideLengthsHTML}
            </div>
            
            <div class="result-item">
                <h3>📊 Calculations</h3>
                <div><strong>Perimeter:</strong> ${unitPerimeter} ${state.unit}</div>
                <div><em>Sum of all side lengths</em></div>
                <div style="margin-top: 10px;"><strong>Area:</strong> ${unitArea} ${state.unit}²</div>
                <div><em>Space inside the polygon</em></div>
            </div>
        `;
    }
    
    function getPolygonType(sides) {
        const types = {
            3: 'Triangle',
            4: 'Quadrilateral',
            5: 'Pentagon',
            6: 'Hexagon',
            7: 'Heptagon',
            8: 'Octagon'
        };
        return types[sides] || `${sides}-sided Polygon`;
    }
    
    function clearPolygon() {
        state.points = [];
        state.isClosed = false;
        state.offset = { x: 0, y: 0 };
        updateInstructions();
        redraw();
    }
    
    // Initialize the application
    setupEventListeners();
    initCanvas();
    setMode('plot');
});
