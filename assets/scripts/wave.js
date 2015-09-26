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
        var img = app.sprites.wave[frameIndex];

        if (img) {
            //  clear paper
            waveCtx.clearRect(0, 0, waveCanvasWidth, waveCanvasHeight);

            //  drawStone image
            waveCtx.drawImage(img, 0, 0, waveCanvasWidth, waveCanvasHeight);

            waveCtx.save();
            waveCtx.globalAlpha = 0.2;
            waveCtx.drawImage(img, 0, 0, waveCanvasWidth, waveCanvasHeight);
            waveCtx.restore();
        } else {

        }
    };

    this.pause = function () {
        clearTimeout(that.playTimer);
    };
}