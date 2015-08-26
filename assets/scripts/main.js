// Created by sam mok 2015(Siso brand interactive team).

"use strict";

var app = {
    sprites: {
        stone: [],
        wave: []
    },

    direct: 'forward',

    canPlay: true,

    preload: function () {
        var that = this;
        var Canvas = document.getElementById('stone-body');
        var ctx = Canvas.getContext('2d');

        //  set images generator
        var imgPath = "assets/images/";
        //  img amounts, use the amounts order to general image objects
        var imgAmounts = 24+169;
        var loadedAmounts = 0;
        var isLoaded = false;

        //  load stone scene frames
        for (var i = 1; i <= 24; i++) {
            var img = new Image();
            img.src = imgPath + 's01-stone-body' + fixZero(i) + '.png';

            img.index = i;

            loadedAmounts++;

            img.onload = function () {
                that.sprites.stone[this.index] = this;
                /* check img load progress */
                if (checkIsAllLoaded() && isLoaded == false) {
                    isLoaded = true;

                    console.log('images loader end..');
                    setTimeout(function () {
                        app.start();
                    }, 300);
                }
            };

            img.onerror = function (error) {
                imgAmounts -= 1;

                /* check img load progress */
                if (checkIsAllLoaded() && isLoaded == false) {
                    var runningTimerEnd = new Date();
                    isLoaded = true;

                    console.log('images loader end..');
                    app.start();
                }
            };
        }

        //  load wave scene frames
        for (var i = 1; i <= 169; i++) {
            var img = new Image();
            img.src = imgPath + 'wave_00' + fixZeroForWave(i) + '.png';

            img.index = i;

            img.onload = function () {
                that.sprites.wave[this.index] = this;
                loadedAmounts++;

                /* check img load progress */
                if (checkIsAllLoaded() && isLoaded == false) {
                    isLoaded = true;

                    console.log('images loader end..');
                    setTimeout(function () {
                        app.start();
                    }, 300);
                }
            };

            img.onerror = function (error) {
                imgAmounts -= 1;

                /* check img load progress */
                if (checkIsAllLoaded() && isLoaded == false) {
                    var runningTimerEnd = new Date();
                    isLoaded = true;

                    console.log('images loader end..');
                    app.start();
                }
            };
        }

        function checkIsAllLoaded () {
            var loadedRate = 1;
            return loadedAmounts / imgAmounts >= loadedRate;
        }

        function fixZero (num) {
            return num < 10 ? '0' + num : num;
        }

        function fixZeroForWave (num) {
            if (num < 10) {
                return '00' + num;
            } else if (num <100) {
                return '0' + num;
            } else {
                return num;
            }
        }
    },

    create: function (){
        var that = this;

        //  init swiper
        app.mySwiper = new Swiper ('.swiper-container', {
            direction: 'vertical',

            parallax : true,

            noSwiping: false,

            // init
            onInit: function () {
                $('.swiper-container').show();
            },

            onTransitionStart: function (swiper) {
            },

            onTransitionEnd: function (swiper) {

            }
        });

        //  first time play BGM
        var initSound = function () {
            //  delay play
            $('#audio')[0].play();

            document.removeEventListener('touchstart', initSound, false);
        };
        document.addEventListener('touchstart', initSound, false);

        /**
         * Animation parts
         * */
        var stoneCanvas = document.getElementById('stone-body');
        var waveCanvas = document.getElementById('stone-wave');

        var stoneCtx = stoneCanvas.getContext('2d');
        var waveCtx = waveCanvas.getContext('2d');

        var stoneCanvasWidth = stoneCanvas.width;
        var stoneCanvasHeight = stoneCanvas.height;

        var waveCanvasWidth = waveCanvas.width;
        var waveCanvasHeight = waveCanvas.height;

        /* indexes setting */
        var stoneFrameIndexes = [1, 24];
        var stoneKeyframeIndexes = [1, 9, 16, 22];

        var waveFrameIndexes = [1, 169];

        that.curFrameIndex = 1;
        var curStoneParaIndex = 0;
        that.canPlay = true;

        //  show bird
        $('.bird').addClass('transform');
        setTimeout(function () {
            $('.bird').removeClass('transform')
                .addClass('transformed');
        }, 3000);

        //  play stone animation
        /**  play the first time animation */
        (function (curFrameIndex, endFrameIndex) {
            drawFirstTime(curFrameIndex, endFrameIndex);

            function drawFirstTime (curFrameIndex, endFrameIndex) {
                //  check whether currentFrame is the last frame of the current scene.
                if (curFrameIndex == endFrameIndex+1) {
                    //  draw first frame
                    drawStone(stoneFrameIndexes[0]);

                    //  show para
                    $('.scene01 .item').removeClass('active');
                    $('.scene01 .item').eq(curStoneParaIndex).addClass('active');
                    $('.cursor').removeClass('cursor01 cursor02 cursor03 cursor04')
                        .addClass('active cursor0' + (curStoneParaIndex+1));

                    /** play the second time animation */
                    that.playTimer = setTimeout(function () {
                        //  hide para
                        $('.scene01 .item').removeClass('active');

                        //  start from second frame
                        drawStoneSprite(that.curFrameIndex+1, stoneFrameIndexes[1]);
                    }, 3000);
                } else {
                    drawStone(curFrameIndex);
                    $('.cursor').removeClass('active');

                    // drawStone next frame
                    that.playTimer = setTimeout(function () {
                        //  drawStone direction
                        that.direct == "forward" ? drawFirstTime(parseInt(curFrameIndex)+1, endFrameIndex) : drawFirstTime(parseInt(curFrameIndex)-1, endFrameIndex);
                    }, 1000/8);
                }
            }
        })(stoneFrameIndexes[0], stoneFrameIndexes[1]);

        /**  play wave animation */
        drawWaveSprite(waveFrameIndexes[0], waveFrameIndexes[1]);

        //  bind touch event
        var toucharea = document.getElementById('stone-touch-area');
        var touchStartPoint = 0;
        var minMove = 2;

        toucharea.addEventListener('touchstart', setTouchStartPoint);

        toucharea.addEventListener('touchmove', setCurrentFrame);

        toucharea.addEventListener('touchend', touchEndHandler);

        //  recursive to drawStone sprites
        function drawStoneSprite(curFrameIndex, endFrameIndex) {
            clearTimeout(that.playTimer);

            function play () {
                //  check whether currentFrame is the last frame of the current scene.
                if (curFrameIndex == endFrameIndex) {
                    drawStone(curFrameIndex);
                    // drawStone next frame
                    that.playTimer = setTimeout(function () {
                        //  drawStone direction
                        that.direct == "forward" ? drawStoneSprite(stoneFrameIndexes[0], stoneFrameIndexes[1]) : drawStoneSprite(stoneFrameIndexes[1], stoneFrameIndexes[0]);
                    }, 1000/8);
                } else {
                    drawStone(curFrameIndex);

                    // drawStone next frame
                    that.playTimer = setTimeout(function () {
                        //  drawStone direction
                        that.direct == "forward" ? drawStoneSprite(parseInt(curFrameIndex)+1, endFrameIndex) : drawStoneSprite(parseInt(curFrameIndex)-1, endFrameIndex);
                    }, 1000/8);
                }
            }

            if (that.canPlay == true) {
                that.curFrameIndex = curFrameIndex;

                //  check whether current frame is keyframe
                for (var i = 0; i < stoneKeyframeIndexes.length; i++) {
                    if (that.curFrameIndex == stoneKeyframeIndexes[i]) {
                        curStoneParaIndex = i;

                        //  show para
                        $('.scene01 .item').removeClass('active');
                        $('.scene01 .item').eq(curStoneParaIndex).addClass('active');
                        $('.cursor').removeClass('cursor01 cursor02 cursor03 cursor04')
                            .addClass('active cursor0' + (curStoneParaIndex+1));

                        //  play next frames
                        that.playTimer = setTimeout(function () {
                            $('.scene01 .item').removeClass('active');
                            play();
                        }, 3200);
                        return;
                    }
                }

                // if current frame is not keyframe, play the current frame
                $('.cursor').removeClass('active');
                play();
            }
        }

        //  recursive to drawStone sprites
        function drawWaveSprite(curFrameIndex, endFrameIndex) {
            //  clear timer
            clearTimeout(that.waveTimer);

            //  check whether currentFrame is the last frame of the current scene.
            if (curFrameIndex == endFrameIndex) {
                drawWave(curFrameIndex);

                // drawStone next frame
                that.waveTimer = setTimeout(function () {
                    drawWaveSprite(waveFrameIndexes[0], waveFrameIndexes[1]);
                }, 1000/25);
            } else {
                drawWave(curFrameIndex);

                // drawStone next frame
                that.waveTimer = setTimeout(function () {
                    //  drawStone direction
                    drawWaveSprite(parseInt(curFrameIndex)+1, endFrameIndex);
                }, 1000/25);
            }
        }

        function drawStone(frameIndex) {
            /**
             * Draw frame into canvas
             * @param {Number} frameIndex  the index of frame you want to drawStone into canvas
             * */
            var img = that.sprites.stone[frameIndex];

            if (img) {
                //  clear paper
                stoneCtx.clearRect(0, 0, stoneCanvasWidth, stoneCanvasHeight);

                //  drawStone image
                stoneCtx.drawImage(img, 0, 0, stoneCanvasWidth, stoneCanvasHeight);
            } else {

            }
        }

        function drawWave(frameIndex) {
            /**
             * Draw frame into canvas
             * @param {Number} frameIndex  the index of frame you want to drawStone into canvas
             * */
            var img = that.sprites.wave[frameIndex];

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
        }

        //  touch handler
        function setTouchStartPoint(e) {
            touchStartPoint = e.touches[0].pageX;
            clearTimeout(that.playTimer);

            //  hide para
            $('.scene01 .item').removeClass('active');
            $('.cursor').removeClass('active cursor01 cursor02 cursor03 cursor04');
        }

        function setCurrentFrame (e) {
            that.canPlay = false;

            //  get current touch position
            var curPoint = e.touches[0].pageX;
            var distance = Math.abs(curPoint - touchStartPoint);

            var startFrame = stoneFrameIndexes[0];
            var endFrame = stoneFrameIndexes[1];

            //  calculate the next frame's index to draw
            //  if the drag direction is "forward"
            if (distance > minMove && curPoint > touchStartPoint) {
                that.curFrameIndex += 2;

                that.curFrameIndex > endFrame ? that.curFrameIndex = stoneFrameIndexes[0] : null;
            } else if (distance > minMove && curPoint < touchStartPoint) {
                that.curFrameIndex -= 2;

                that.curFrameIndex < startFrame ? that.curFrameIndex = stoneFrameIndexes[1] : null;
            } else {

            }

            //  draw next frame
            touchStartPoint = curPoint;
            drawStone(that.curFrameIndex);
        }

        function touchEndHandler() {
            that.canPlay = true;

            //  get current frame closer which keyframe
            var min = 10000;
            var minIndex = 0;

            for (var i = 0; i < stoneKeyframeIndexes.length; i++) {
                var distance = Math.abs(that.curFrameIndex - stoneKeyframeIndexes[i]);
                if (distance < min) {
                    min = distance;
                    minIndex = i;
                }
            }

            //  show para
            $('.scene01 .item').removeClass('active');
            $('.scene01 .item').eq(minIndex).addClass('active');
            $('.cursor').removeClass('cursor01 cursor02 cursor03 cursor04')
                .addClass('active cursor0' + (minIndex+1));


            that.playTimer = setTimeout(function () {
                //  start from second frame

                that.curFrameIndex +1 == stoneFrameIndexes[1] ? that.curFrameIndex = 0 : that.curFrameIndex++;
                drawStoneSprite(that.curFrameIndex, stoneFrameIndexes[1]);
            }, 3200);
        }
    },

    start: function (){
        //  init page response plugin
        var page = new pageResponse({
            class : 'swiper-container',     //模块的类名，使用class来控制页面上的模块(1个或多个)
            mode : 'cover',     // auto || contain || cover ，默认模式为auto
            width : '375',      //输入页面的宽度，只支持输入数值，默认宽度为320px
            height : '625'      //输入页面的高度，只支持输入数值，默认高度为504px
        });

        this.create();
    }
};

$(function (){
    // init app
    app.preload();
    console.log('app started success...');
});