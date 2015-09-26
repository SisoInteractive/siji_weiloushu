function Stone (app) {
    var that = this;

    /* indexes setting */
    this.curFrameIndex = 0;
    this.direct = 'forward';
    this.canPlay = true;

    this.stoneFrameIndexes = [0, 23];
    this.stoneKeyframeIndexes = [0, 8, 15, 21];
    this.curStoneParaIndex = 0;

    //  set default info
    var stoneCanvas = document.getElementById('stone-body');
    var stoneCtx = stoneCanvas.getContext('2d');
    var stoneCanvasWidth = stoneCanvas.width;
    var stoneCanvasHeight = stoneCanvas.height;

    //  set touch info
    var touchStartPoint = 0;
    var minMove = 2;

    //  play the first time animation
    this.playFirstTime = function () {
        clearTimeout(that.playTimer);
        var curFrameIndex = that.stoneFrameIndexes[0];
        var endFrameIndex = that.stoneFrameIndexes[1];

        //  show bird
        $('.scene .bird').addClass('transform');
        setTimeout(function () {
            $('.scene .bird').removeClass('transform')
                .addClass('transformed');

            setTimeout(function () {
                $('.scene .bird').removeClass('transformed')
                    .addClass('fly');
            }, 600);
        }, 500);

        drawFirstTime(curFrameIndex, endFrameIndex);

        function drawFirstTime (curFrameIndex, endFrameIndex) {
            //  check whether currentFrame is the last frame of the current scene.
            if (curFrameIndex == endFrameIndex+1) {
                //  draw first frame
                that.draw(that.stoneFrameIndexes[0]);

                //  show para
                $('.main-scene .item').removeClass('active');
                $('.main-scene .item').eq(that.curStoneParaIndex).addClass('active');
                $('.cursor').removeClass('cursor01 cursor02 cursor03 cursor04')
                    .addClass('active cursor0' + (that.curStoneParaIndex+1));

                /** play the second time animation */
                that.playTimer = setTimeout(function () {
                    //  hide para
                    $('.main-scene .item').removeClass('active');

                    //  start from second frame
                    that.drawStoneSprite(that.stoneFrameIndexes[0], that.stoneFrameIndexes[1]);
                }, 3000);
            } else {
                that.draw(curFrameIndex);

                $('.cursor').removeClass('active');

                // drawStone next frame
                that.playTimer = setTimeout(function () {
                    drawFirstTime(parseInt(curFrameIndex)+1, endFrameIndex)
                }, 1000/12);
            }
        }
    };

    //  recursive to drawStone sprites
    this.drawStoneSprite = function (curFrameIndex, endFrameIndex) {
        clearTimeout(that.playTimer);

        if (that.canPlay == true) {
            that.curFrameIndex = curFrameIndex;

            //  check whether current frame is keyframe
            for (var i = 0; i < that.stoneKeyframeIndexes.length; i++) {
                if (that.curFrameIndex == that.stoneKeyframeIndexes[i]) {
                    that.curStoneParaIndex = i;

                    //  show para
                    $('.main-scene .item').removeClass('active');
                    $('.main-scene .item').eq(that.curStoneParaIndex).addClass('active');
                    $('.cursor').removeClass('cursor01 cursor02 cursor03 cursor04')
                        .addClass('active cursor0' + (that.curStoneParaIndex+1));

                    //  play next frames
                    that.playTimer = setTimeout(function () {
                        $('.main-scene .item').removeClass('active');
                        play();
                    }, 3200);
                    return;
                }
            }

            // if current frame is not keyframe, play the current frame
            $('.cursor').removeClass('active');
            play();
        }

        function play () {
            //  check whether currentFrame is the last frame of the current scene.
            if (curFrameIndex == endFrameIndex) {
                that.draw(curFrameIndex);
                // drawStone next frame
                that.playTimer = setTimeout(function () {
                    //  drawStone direction
                    that.direct == "forward" ? that.drawStoneSprite(that.stoneFrameIndexes[0], that.stoneFrameIndexes[1]) : that.drawStoneSprite(that.stoneFrameIndexes[1], that.stoneFrameIndexes[0]);
                }, 1000/8);
            } else {
                that.draw(curFrameIndex);

                // drawStone next frame
                that.playTimer = setTimeout(function () {
                    //  drawStone direction
                    that.direct == "forward" ? that.drawStoneSprite(parseInt(curFrameIndex)+1, endFrameIndex) : that.drawStoneSprite(parseInt(curFrameIndex)-1, endFrameIndex);
                }, 1000/8);
            }
        }
    };

    this.draw = function (frameIndex) {
        /**
         * Draw frame into canvas
         * @param {Number} frameIndex  the index of frame you want to drawStone into canvas
         * */
        var img = app.sprites.stone[frameIndex];

        if (img) {
            //  clear paper
            stoneCtx.clearRect(0, 0, stoneCanvasWidth, stoneCanvasHeight);

            //  drawStone image
            stoneCtx.drawImage(img, 0, 0, stoneCanvasWidth, stoneCanvasHeight);
        } else {

        }
    };

    this.setTouchStartPoint = function (e) {
        touchStartPoint = e.touches[0].pageX;
        clearTimeout(that.playTimer);

        //  hide para
        $('.main-scene .item').removeClass('active');
        $('.cursor').removeClass('active cursor01 cursor02 cursor03 cursor04');
    };

    this.setCurrentFrame = function (e) {
        that.canPlay = false;

        //  get current touch position
        var curPoint = e.touches[0].pageX;
        var distance = Math.abs(curPoint - touchStartPoint);

        var startFrame = that.stoneFrameIndexes[0];
        var endFrame = that.stoneFrameIndexes[1];

        //  calculate the next frame's index to draw
        //  if the drag direction is "forward"
        if (distance > minMove && curPoint > touchStartPoint) {
            that.curFrameIndex += 2;

            that.curFrameIndex > endFrame ? that.curFrameIndex = that.stoneFrameIndexes[0] : null;
        } else if (distance > minMove && curPoint < touchStartPoint) {
            that.curFrameIndex -= 2;

            that.curFrameIndex < startFrame ? that.curFrameIndex = that.stoneFrameIndexes[1] : null;
        } else {

        }

        //  draw next frame
        touchStartPoint = curPoint;
        that.draw(that.curFrameIndex);
    };

    this.touchEndHandler = function () {
        that.canPlay = true;

        //  get current frame closer which keyframe
        var min = 10000;
        var minIndex = 0;

        for (var i = 0; i < that.stoneKeyframeIndexes.length; i++) {
            var distance = Math.abs(that.curFrameIndex - that.stoneKeyframeIndexes[i]);
            if (distance < min) {
                min = distance;
                minIndex = i;
            }
        }

        //  show para
        $('.main-scene .item').removeClass('active');
        $('.main-scene .item').eq(minIndex).addClass('active');
        $('.cursor').removeClass('cursor01 cursor02 cursor03 cursor04')
            .addClass('active cursor0' + (minIndex+1));


        that.playTimer = setTimeout(function () {
            //  start from second frame

            that.curFrameIndex +1 == that.stoneFrameIndexes[1] ? that.curFrameIndex = 0 : that.curFrameIndex++;
            that.drawStoneSprite(that.curFrameIndex, that.stoneFrameIndexes[1]);
        }, 3200);
    };

    this.pause = function () {
      clearTimeout(that.playTimer);
    };
}