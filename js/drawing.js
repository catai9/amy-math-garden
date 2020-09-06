/**
 * Prepares the canvas for drawing.
 */
function prepareCanvas() {
    canvas = document.getElementById('my-canvas');
    context = canvas.getContext('2d');

    context.fillStyle = BACKGROUND_COLOUR;
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    context.strokeStyle = LINE_COLOUR;
    context.lineWidth = LINE_WIDTH;
    context.lineJoin = 'round';

    addMouseEvents();
    addTouchEvents();

}

/**
 * Add mouse events to the canvas for the start, the stop, and the process of drawing. 
 */
function addMouseEvents() {
    document.addEventListener('mousedown', (event) => startDrawing(event));
    document.addEventListener('mousemove', (event) => draw(event));
    document.addEventListener('mouseup', (event) => stopDrawing());

    canvas.addEventListener('mouseleave', (event) => stopDrawing());
}


/**
 * Add touch events to the canvas for the start, the cancel, and the process of drawing. 
 */
function addTouchEvents() {
    canvas.addEventListener('touchstart', (event) => startDrawing(event.touches[0]));
    canvas.addEventListener('touchcancel', (event) => stopDrawing());
    canvas.addEventListener('touchmove', (event) => draw(event.touches[0]));
}

/**
 * Sets up the code for starting to draw on the canvas.
 * @param {*} event 
 */
function startDrawing(event) {
    isPainting = true;
    currentX = event.clientX - canvas.offsetLeft;
    currentY = event.clientY - canvas.offsetTop;
}

/**
 * Sets up the code for stopping the canvas drawing.
 */
function stopDrawing() {
    isPainting = false;
}

/**
 * Handles the canvas drawing based on the specified X and Y points.
 */
function draw(event) {
    if (isPainting) {
        previousX = currentX;
        currentX = event.clientX - canvas.offsetLeft;

        previousY = currentY;
        currentY = event.clientY - canvas.offsetTop;

        context.beginPath();
        context.moveTo(previousX, previousY);
        context.lineTo(currentX, currentY);
        context.closePath();
        context.stroke();
    }
}

/**
 * Clears the canvas and resets the canvas.
 */
function clearCanvas() {
    currentX = 0;
    currentY = 0;
    previousX = 0;
    previousY = 0;

    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}