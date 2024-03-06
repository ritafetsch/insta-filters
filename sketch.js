// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg
var imgIn;
var matrix = [
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64]
];

/////////////////////////////////////////////////////////////////
function preload() {
  imgIn = loadImage("assets/husky.jpg");
}
/////////////////////////////////////////////////////////////////
function setup() {
  // initalise canvas making room for filtered image to right and instructional text beneath 
  createCanvas((imgIn.width * 2), imgIn.height + 450);
}
/////////////////////////////////////////////////////////////////
function draw() {
  background(255);
  // draw og image in 0,0 of canvas 
  image(imgIn, 0, 0);
  // draw filtered image to right of og image 
  image(earlyBirdFilter(imgIn), imgIn.width, 0);

  // add instructional text below images for user navigation of filters
  textSize(30);
  var x = 750;
  text("- Press 'i' to apply inverse filter", 20,x + 40);
  text("- Press 'e' to apply edge detection filter", 20,x + 80);
  text("- Press 'g' to apply grayscale filter", 20,x + 120);
  text("- Press 't' to apply threshold filter", 20,x + 160);
  text("- Press 'b' to apply gaussian blur filter", 20,x + 200);
  text("- Press 's' to apply sharpen filter", 20,x + 240);
  text("- Press 'r' to reset", 20,x + 280);
  text("*** When set to original filter, click image on lefthand side to apply radial blur.", 20,x + 360);

  
  noLoop();

}
/////////////////////////////////////////////////////////////////
function mousePressed(){
  // call to loop only when mouse is pressed
  loop();

}
/////////////////////////////////////////////////////////////////
function earlyBirdFilter(img){
  // apply series of filters to input image and return the result 
  var resultImg = createImage(imgIn.width, imgIn.height);
  resultImg = sepiaFilter(img);
  resultImg = darkCorners(resultImg);
  resultImg = radialBlurFilter(resultImg);
  resultImg = borderFilter(resultImg)
  return resultImg;
}


function sepiaFilter(img) {
  // initalise graphics for imgOut the size of incoming img, passed in as arg
  var imgOut = createImage(img.width, img.height);

  // load pixels for both input and ouput imgs
  imgOut.loadPixels();
  img.loadPixels();

  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      var index = (y * img.width + x) * 4;

      // store input img pixels for each channel in variables
      var oldRed = img.pixels[index + 0];
      var oldGreen = img.pixels[index + 1];
      var oldBlue = img.pixels[index + 2];

      // manipulate each channel according to sepia conventions and store in new variables
      newRed = (oldRed * .393) + (oldGreen *.769) + (oldBlue * .189)
      newGreen = (oldRed * .349) + (oldGreen *.686) + (oldBlue * .168)
      newBlue = (oldRed * .272) + (oldGreen *.534) + (oldBlue * .131)

      // update imgOut pixels with previously calculated sepia values 
      imgOut.pixels[index + 0] = newRed;
      imgOut.pixels[index + 1] = newGreen;
      imgOut.pixels[index + 2] = newBlue;
      imgOut.pixels[index + 3] = 255;
      
    }
  }
  // update pixels for output image and return it 
  imgOut.updatePixels();
  return imgOut;
}

function darkCorners(img) {
  // initalise graphics for imgOut the size of incoming img, passed in as arg
  var imgOut = createImage(img.width, img.height);

  // load pixels for both input and ouput imgs
  imgOut.loadPixels();
  img.loadPixels();

  // create vector to store x and y values for center of image 
  var center = new createVector(img.width/2,img.height/2);

  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      var index = (y * img.width + x) * 4;

      // store input img pixels for each colour channel
      var oldRed = img.pixels[index + 0];
      var oldGreen = img.pixels[index + 1];
      var oldBlue = img.pixels[index + 2];

      // calculate distance of each pixel in input image from centre of image 
      var distance = (dist(x,y,center.x,center.y));
      // initialise dynamic Luminosity value to 1 (leaving pixels unaffected)
      var dynLum = 1;

      // if pixel distance is greater than 300 pixels and less than 400 pixels, set dynLum according to mapped values 
      if (distance > 300 && distance  < 450) {
        dynLum = map(distance,300,450,1,0.4);
      }
      // if pixel distance is greater than 450 pixels, set dynLum according to mapped values 
      else if (distance > 450) {
        dynLum = map(distance,450,img.width,0.4,0);
      }

      // constrain value returned in dynLum to a value between 0 and 1
      dynLum = constrain(dynLum,0,1);

      // apply calculated dynLum factor of each input pixel to corresponding output image 
      imgOut.pixels[index + 0] = oldRed * dynLum;
      imgOut.pixels[index + 1] = oldGreen  * dynLum;
      imgOut.pixels[index + 2] = oldBlue  * dynLum;
      imgOut.pixels[index + 3] = 255;
      
    }
  }
  // update pixels for output image and return it 
  imgOut.updatePixels();
  return imgOut;
}

function radialBlurFilter(img){
  // initalise graphics for imgOut the size of incoming img, passed in as arg
  var imgOut = createImage(img.width, img.height);
  var matrixSize = matrix.length;

  // load pixels for both input and ouput imgs
  imgOut.loadPixels();
  img.loadPixels();

  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      
      var index = (y * img.width + x) * 4;

      // call to convolution function according to global matrix
      var c = convolution(x,y, matrix, matrixSize, img)

      // iniatlise dynamic blur to 0
      var dynBlur = 0;
      
      // calculate distance between each pixel and the location of the mouse 
      var distance = dist(x, y, mouseX,mouseY);
      
      // if the distance ^^ is < 100, dynamic blur is applied by a factor of 0 (none)
      if (distance < 100 ) {
        dynBlur = 0;
      }
      // else if the distance ^^ is > 100 and < 300, dynamic blur is applied by a mapped factor between 0 and 1
      else if (distance > 100 && distance < 300 ) {
        dynBlur = map(distance,100,300,0,1);
      }
      // else if the distance ^^ is > 300, dynamic blur is applied by a factor of 1
      else if (distance > 300) {
        dynBlur = 1;
      }

      // constrain value returned in dynLum to a value between 0 and 1
      dynBlur = constrain(dynBlur,0,1);

      // apply calculated dynLum factor of each input pixel to corresponding output image    
      imgOut.pixels[index + 0] = c[0]*dynBlur + img.pixels[index + 0]*(1-dynBlur);
      imgOut.pixels[index + 1] = c[1]*dynBlur + img.pixels[index + 1]*(1-dynBlur);
      imgOut.pixels[index + 2] = c[2]*dynBlur + img.pixels[index + 2]*(1-dynBlur);
      imgOut.pixels[index + 3] = 255

    }
  }

  // update pixels for output image and return it 
  imgOut.updatePixels();
  return imgOut;
}

// Convolution function adapted from lectures to calculate manipulation of pixels surrounding targetted ones
// Input image is passed in and convolution function will calculate values according to the filter specific matrix values 
function convolution(x,y,matrix,matrixSize,img) {
  var totalRed = 0;
  var totalGreen = 0;
  var totalBlue = 0;

  var offset = floor(matrixSize / 2);

  for (var i = 0; i < matrixSize; i++) {
    for (var j = 0; j < matrixSize; j++) {
      var xloc = x + i - offset;
      var yloc = y + j - offset;

      var index = (img.width * yloc + xloc) * 4;

      index = constrain(index,0, img.pixels.length - 1);

      totalRed += img.pixels[index + 0] * matrix[i][j];
      totalGreen += img.pixels[index + 1] * matrix[i][j];
      totalBlue += img.pixels[index + 2] * matrix[i][j];

    }
  }
  return [totalRed, totalGreen, totalBlue];
}

function borderFilter(img){
  // create graphics at location and size of filtered image in order to apply white border around it
  var buffer = createGraphics(img.width, img.height);
  
  // set graphics to have no fill with a large white stroke, creating the effect of white border
  buffer.strokeWeight(17);
  buffer.stroke(255);
  buffer.noFill();

  // draw the image onto the buffer 
  buffer.image(img,0,0);
  // draw rects with rounded corners on top of the image to create white border affect (rects 
  // will have no fill, image will come through with only the white stroke being visible)
  buffer.rect(5, 5, img.width-10, img.height-10, 30, 30, 30, 30);
  buffer.rect(0, 0, img.width, img.height);

  return buffer;
}

function invertFilter(img) {
  // initalise graphics for imgOut the size of incoming img, passed in as arg
  var imgOut = createImage(img.width, img.height);

  // load pixels for both input and ouput imgs
  imgOut.loadPixels();
  img.loadPixels();

  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      var index = (y * img.width + x) * 4;

      // calculate pixels for inverted output image by subtracting original pixels from 255
      var newRed = 255 - img.pixels[index + 0];
      var newGreen = 255 - img.pixels[index + 1];
      var newBlue = 255 - img.pixels[index + 2];

      // update output image according to inverse pixel calculations  
      imgOut.pixels[index + 0] = newRed;
      imgOut.pixels[index + 1] = newGreen;
      imgOut.pixels[index + 2] = newBlue;
      imgOut.pixels[index + 3] = 255;
      
    }
  }
  // update pixels for output image and return it 
  imgOut.updatePixels();
  return imgOut;
}


function grayscaleFilter(img) {
  // initalise graphics for imgOut the size of incoming img, passed in as arg
  var imgOut = createImage(img.width, img.height);

  // load pixels for both input and ouput imgs
  imgOut.loadPixels();
  img.loadPixels();

  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      var index = (y * img.width + x) * 4;

      // store input img pixels for each colour channel
      var oldRed = img.pixels[index + 0];
      var oldGreen = img.pixels[index + 1];
      var oldBlue = img.pixels[index + 2];

      // calculate grayscale pixel value by summing channel values for each pixel
      var gray = (oldRed + oldGreen + oldBlue);

      // update output image pixels according to grayscale value calculated above
      imgOut.pixels[index + 0] = gray;
      imgOut.pixels[index + 1] = gray;
      imgOut.pixels[index + 2] = gray;
      imgOut.pixels[index + 3] = 255;
      
    }
  }
  // update pixels for output image and return it 
  imgOut.updatePixels();
  return imgOut;
}

function thresholdFilter(img) {
  // initalise graphics for imgOut the size of incoming img, passed in as arg
  var imgOut = createImage(img.width, img.height);

  // load pixels for both input and ouput imgs
  imgOut.loadPixels();
  img.loadPixels();

  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      var index = (y * img.width + x) * 4;

      // store input img pixels for each colour channel
      var oldRed = img.pixels[index + 0];
      var oldGreen = img.pixels[index + 1];
      var oldBlue = img.pixels[index + 2];

      // calculate threshold filter values by dividing total pixel values by 3
      var gray = (oldRed + oldGreen + oldBlue) / 3;

      // if threshold value is greater than 125, pixel value is set to white
      if (gray > 125) gray = 255;
      // otherwise, pixel value is set to black
      else gray = 0;

      // update output image pixels according to threshold values calculated above
      imgOut.pixels[index + 0] = gray;
      imgOut.pixels[index + 1] = gray;
      imgOut.pixels[index + 2] = gray;
      imgOut.pixels[index + 3] = 255;
      
    }
  }
  // update pixels for output image and return it 
  imgOut.updatePixels();
  return imgOut;
}


function gaussianBlurFilter(img) {
  // initalise graphics for imgOut the size of incoming img, passed in as arg
  var imgOut = createImage(img.width, img.height);

  // matrix to apply blur filter 
  var blurMatrix = [
    [2/571, 7/571, 12/571, 7/571, 2/571],
    [7/571, 31/571, 52/571, 31/571, 7/571],
    [12/571, 52/571, 127/571, 52/571, 12/571],
    [7/571, 31/571, 52/571, 31/571, 7/571],
    [2/571, 7/571, 12/571, 7/571, 2/571]
    
  ]
  // calcualte matrix size for convolution function 
  var matrixSize = blurMatrix.length;

  // load pixels for both input and ouput imgs
  imgOut.loadPixels();
  img.loadPixels();

  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      var index = (y * img.width + x) * 4;

      // call to convolution function using blurMatrix
      var c = convolution(x,y, blurMatrix, matrixSize, img);

      // update output image colour channels according to conovlution function calculations using blurMatrix
      imgOut.pixels[index + 0] = c[0] ;
      imgOut.pixels[index + 1] = c[1] ;
      imgOut.pixels[index + 2] = c[2] ;
      imgOut.pixels[index + 3] = 255;
      
    }
  }
  // update pixels for output image and return it 
  imgOut.updatePixels();
  return imgOut;
}


function edgeDetectionFilter(img){
  // initalise graphics for imgOut the size of incoming img, passed in as arg
  var imgOut = createImage(img.width, img.height);

  // matrices to apply edge detection filter 
  // to detect horizontal edges
  var matrixX = [
    [-1,-2,-1],
    [0, 0, 0],
    [1, 2, 1]
  ]
  // to detect vertical edges 
  var matrixY = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
  ]
  // calcualte matrix size for convolution function 
  var matrixSize = matrixX.length;

  // load pixels for both input and ouput imgs
  imgOut.loadPixels();
  img.loadPixels();

  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      
      var index = (y * img.width + x) * 4;

      // calcualte convolution values for horizontal edges 
      var cX = convolution(x,y, matrixX, matrixSize, img)
      cX = map(abs(cX[0]), 0, 1020, 0, 255); 

      // calcualte convolution values for vertical edges 
      var cY = convolution(x,y,matrixY,matrixSize,img);
      cY = map(abs(cY[0]), 0, 1020, 0, 255); 
      
      // add both convolution values together
      var combo = cX + cY;

       // update output image colour channels according to conovlution function calculations (combo) using matrixX and matrixY
      imgOut.pixels[index + 0] = combo;
      imgOut.pixels[index + 1] = combo;
      imgOut.pixels[index + 2] = combo;
      imgOut.pixels[index + 3] = 255

    }
  }
  // update pixels for output image and return it 
  imgOut.updatePixels();
  return imgOut;
}

function sharpFilter(img) {
  // initalise graphics for imgOut the size of incoming img, passed in as arg
  var imgOut = createImage(img.width, img.height);

  // matrix for applying sharp filter 
  var sharpMatrix = [
    [-1,-1,-1],
    [-1, 9, -1],
    [-1, -1, -1]
  ]
  // calcualte matrix size for convolution function
  var matrixSize = sharpMatrix.length;

  // load pixels for both input and ouput imgs
  imgOut.loadPixels();
  img.loadPixels();

  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      
      var index = (y * img.width + x) * 4;

      // call to convolution function using sharpMatrix
      var c = convolution(x,y, sharpMatrix, matrixSize, img)

      // update output image colour channels according to conovlution function calculations using sharpMatrix
      imgOut.pixels[index + 0] = c[0];
      imgOut.pixels[index + 1] = c[1];
      imgOut.pixels[index + 2] = c[2];
      imgOut.pixels[index + 3] = 255

    }
  }
  // update pixels for output image and return it 
  imgOut.updatePixels();
  return imgOut;
}

// apply filters according to key user presses 
function keyTyped(){
  

  if (key == 'i') {
    // invert filter
    image(invertFilter(imgIn), imgIn.width, 0);
  }

  if (key == 'e') {
    // edge detection filter
    image(edgeDetectionFilter(imgIn), imgIn.width, 0);
  }

  if (key == 'g') {
    // grayscale filter
    image(grayscaleFilter(imgIn), imgIn.width, 0);
  }

  if (key == 't') {
    // threshold filter
    image(thresholdFilter(imgIn), imgIn.width, 0);
  }

  if (key == 'b') {
    // gaussian blur filter
    image(gaussianBlurFilter(imgIn), imgIn.width,0);
  }

  if (key == 's') {
    // sharpen filter
    image(sharpFilter(imgIn), imgIn.width, 0);
  }
  if (key == 'r') {
    // Call draw function to revert back to original filter 
    draw()
  }

}

