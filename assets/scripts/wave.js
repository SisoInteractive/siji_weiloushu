function Wave (app) {
    var that = this;

    this.waveFrameIndexes = [1, 169];
    this.playTimer = null;

    //  set wave info
    var waveCanvas = document.getElementById('stone-wave');
    var waveCtx = waveCanvas.getContext('2d');

    var waveCanvasWidth = waveCanvas.width;
    var waveCanvasHeight = waveCanvas.height;

    //  recursive to drawStone sprites
    this.drawWaveSprite = function (curFrameIndex, endFrameIndex) {
        //  clear timer
        clearTimeout(that.playTimer);

        //  check whether currentFrame is the last frame of the current scene.
        if (curFrameIndex == endFrameIndex) {
            that.draw(curFrameIndex);

            // drawStone next frame
            that.playTimer = setTimeout(function () {
                that.drawWaveSprite(that.waveFrameIndexes[0], that.waveFrameIndexes[1]);
            }, 1000/25);
        } else {
            that.draw(curFrameIndex);

            // drawStone next frame
            that.playTimer = setTimeout(function () {
                //  drawStone direction
                that.drawWaveSprite(parseInt(curFrameIndex)+1, endFrameIndex);
            }, 1000/25);
        }
    };

    this.draw = function (frameIndex) {
        /**
         * Draw frame into canvas
         * @param {Number} frameIndex  the index of frame you want to drawStone into canvas
         * */

        var img;

        //  get current sprite image
        if (frameIndex <= 40) {
            img = app.sprites.wave[1];
        }
        else if (frameIndex <= 80) {
            img = app.sprites.wave[2];
        }
        else if (frameIndex <= 120) {
            img = app.sprites.wave[3];
        }
        else if (frameIndex <= 160) {
            img = app.sprites.wave[4];
        }
        else if (frameIndex <= 169) {
            img = app.sprites.wave[5];
        }

        if (img) {
            //  clear paper
            waveCtx.clearRect(0, 0, waveCanvasWidth, waveCanvasHeight);

            //  draw sprite
            if (frameIndex <= 40) {
                waveCtx.drawImage(img, 750*(frameIndex-1), 0, 750, 350, 0, 0, waveCanvasWidth, waveCanvasHeight);
            }
            else if (frameIndex <= 80) {
                waveCtx.drawImage(img, 750*(frameIndex-41), 0, 750, 350, 0, 0, waveCanvasWidth, waveCanvasHeight);
            }
            else if (frameIndex <= 120) {
                waveCtx.drawImage(img, 750*(frameIndex-81), 0, 750, 350, 0, 0, waveCanvasWidth, waveCanvasHeight);
            }
            else if (frameIndex <= 160) {
                waveCtx.drawImage(img, 750*(frameIndex-121), 0, 750, 350, 0, 0, waveCanvasWidth, waveCanvasHeight);
            }
            else if (frameIndex <= 169) {
                waveCtx.drawImage(img, 750*(frameIndex-161), 0, 750, 350, 0, 0, waveCanvasWidth, waveCanvasHeight);
            }
        } else {

        }
    };

    this.pause = function () {
        clearTimeout(that.playTimer);
    };
}