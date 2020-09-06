const BACKGROUND_COLOUR = '#000000';
const LINE_COLOUR = '#FFFFFF';
const LINE_WIDTH = 15;
const MAX_PIXEL_DIM = 20;
const BLACK = new cv.Scalar(0, 0, 0, 0);

var model;

var answer;
var score = 0;
var backgroundImages = [];

var currentX = 0;
var currentY = 0;
var previousX = 0;
var previousY = 0;

var canvas;
var context;
var isPainting = false;

var imageHeight;
var imageWidth;