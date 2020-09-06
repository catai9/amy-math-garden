/**
 * Loads the Tensorflow model for classifying handwritten digits.
 */
async function loadModel() {
    model = await tf.loadGraphModel('TFJS/model.json');
}

/**
 * Adds the event listener for checking the answer after the user clicks the Check Answer button.
 */
function addEventListeners() {
    document.getElementById('checkAnswer').addEventListener('click', function () {
        checkAnswer();
        clearCanvas();
        loadNewQuestion();
    });
}

/**
 * Predicts the image based on what the user draws on the canvas.
 */
function predictImage() {
    let image = cv.imread(canvas);
    const X = createTensorFromImage(image);
    const result = model.predict(X);
    const output = result.dataSync()[0];

    // Deletes unused variables to prevent memory leaks.
    image.delete();
    X.dispose();
    result.dispose();

    // console.log(tf.memory());

    return output;
}

/**
 * Crops the image based on the contour.
 */
function cropImageFromContour(image, contours, hierarchy) {
    cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(image, image, 175, 255, cv.THRESH_BINARY);

    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    let cnt = contours.get(0);
    let rect = cv.boundingRect(cnt);

    // Deletes unused variables to prevent memory leaks.
    cnt.delete();

    return image.roi(rect);
}

/**
 * Resizes the image to the specified pixel values.
 * @param {Object} image 
 */
function resizeImage(image) {
    imageHeight = image.rows;
    imageWidth = image.cols;

    if (imageHeight > imageWidth) {
        imageHeight = MAX_PIXEL_DIM;
        const scaleFactor = image.rows / imageHeight;
        imageWidth = Math.round(image.cols / scaleFactor);
    } else {
        imageWidth = MAX_PIXEL_DIM;
        const scaleFactor = image.cols / imageWidth;
        imageHeight = Math.round(image.rows / scaleFactor);
    }

    let newSize = new cv.Size(imageWidth, imageHeight);
    cv.resize(image, image, newSize, 0, 0, cv.INTER_AREA);
}

/**
 * Adds the required padding to the image.
 * @param {Object} image 
 */
function addPadding(image) {
    const LEFT = Math.ceil(4 + (MAX_PIXEL_DIM - imageWidth) / 2);
    const RIGHT = Math.floor(4 + (MAX_PIXEL_DIM - imageWidth) / 2);
    const TOP = Math.ceil(4 + (MAX_PIXEL_DIM - imageHeight) / 2);
    const BOTTOM = Math.floor(4 + (MAX_PIXEL_DIM - imageHeight) / 2);

    cv.copyMakeBorder(image, image, TOP, BOTTOM, LEFT, RIGHT, cv.BORDER_CONSTANT, BLACK);
}

/**
 * Shifts the image to the center using the center of mass of the image.
 * @param {Object} image 
 * @param {MatVector} contours 
 * @param {Mat} hierarchy 
 */
function shiftImageToCenter(image, contours, hierarchy) {
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    let cnt = contours.get(0);
    const Moments = cv.moments(cnt, false);

    const cx = Moments.m10 / Moments.m00;
    const cy = Moments.m01 / Moments.m00;

    const X_SHIFT = Math.round(image.cols / 2.0 - cx);
    const Y_SHIFT = Math.round(image.rows / 2.0 - cy);

    let newSize = new cv.Size(image.cols, image.rows);

    const M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, X_SHIFT, 0, 1, Y_SHIFT]);
    cv.warpAffine(image, image, M, newSize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, BLACK);

    // Deletes unused variables to prevent memory leaks.
    cnt.delete();
    M.delete();
}

/**
 * Creates a tensor based on the image.
 * @param {Object} image 
 */
function createTensorFromImage(image) {
    const processedImage = processImage(image);

    let pixelValues = processedImage.data;
    pixelValues = Float32Array.from(pixelValues);
    pixelValues = pixelValues.map((num) => num / 255.0);

    // Deletes unused variables to prevent memory leaks.
    processedImage.delete();

    return tf.tensor([pixelValues]);
}

/**
 * Process the image to input into the model.
 * @param {Object} image 
 */
function processImage(image) {
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    image = cropImageFromContour(image, contours, hierarchy);

    resizeImage(image);
    addPadding(image);
    shiftImageToCenter(image, contours, hierarchy);

    // Deletes unused variables to prevent memory leaks.
    contours.delete();
    hierarchy.delete();

    return image;
}
