// Created by sam mok 2015(Siso brand interactive team).

"use strict";

var app = {
    sprites: {
        stone: [],
        wave: []
    },

    direct: 'forward',

    preload: function () {
        var that = this;
        var Canvas = document.getElementById('stone-body');
        var ctx = Canvas.getContext('2d');

        //  set images generator
        var imgPath = "assets/images/";
        //  img amounts, use the amounts order to general image objects
        var imgAmounts = 24+90;
        var loadedAmounts = 0;
        var isLoaded = false;

        //  load stone scene frames
        for (var i = 1; i <= 24; i++) {
            var img = new Image();
            img.src = imgPath + 's01-stone-body' + fixZero(i) + '.png';

            img.index = i;

            img.onload = function () {
                that.sprites.stone[this.index] = this;
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

        //  load wave scene frames
        for (var i = 0; i <= 89; i++) {
            var img = new Image();
            img.src = imgPath + 'wave-000' + fixZero(i) + '.png';

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
                console.log(123);
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

        var stoneFrameIndexes = [1, 24];
        var stoneKeyframeIndexes = [1, 9, 16, 24];

        var waveFrameIndexes = [0, 89];

        //  play stone animation
        that.curFrameIndex = 1;
        drawStoneSprite(that.curFrameIndex, stoneFrameIndexes[1]);

        //  play wave animation
        drawWaveSprite(waveFrameIndexes[0], waveFrameIndexes[1]);

        //  recursive to drawStone sprites
        function drawStoneSprite(curFrameIndex, endFrameIndex) {
            that.curFrameIndex = curFrameIndex;
            that.playing = true;

            //  check whether current frame is keyframe
            for (var i = 0; i < stoneKeyframeIndexes.length; i++) {
                if (that.curFrameIndex == stoneKeyframeIndexes[i]) {

                }
            }

            //  check whether currentFrame is the last frame of the current scene.
            if (curFrameIndex == endFrameIndex) {
                drawStone(curFrameIndex);

                // drawStone next frame
                that.playTimer = setTimeout(function () {
                    //  drawStone direction
                    that.direct == "forward" ? drawStoneSprite(stoneFrameIndexes[0], stoneFrameIndexes[1]) : drawStoneSprite(stoneFrameIndexes[1], stoneFrameIndexes[0]);
                }, 1000/6);
            } else {
                drawStone(curFrameIndex);

                // drawStone next frame
                that.playTimer = setTimeout(function () {
                    //  drawStone direction
                    that.direct == "forward" ? drawStoneSprite(parseInt(curFrameIndex)+1, endFrameIndex) : drawStoneSprite(parseInt(curFrameIndex)-1, endFrameIndex);
                }, 1000/6);
            }
        }

        //  recursive to drawStone sprites
        function drawWaveSprite(curFrameIndex, endFrameIndex) {
            that.curFrameIndex = curFrameIndex;
            that.playing = true;

            //  check whether current frame is keyframe
            for (var i = 0; i < stoneKeyframeIndexes.length; i++) {
                if (that.curFrameIndex == stoneKeyframeIndexes[i]) {

                }
            }

            //  check whether currentFrame is the last frame of the current scene.
            if (curFrameIndex == endFrameIndex) {
                drawWave(curFrameIndex);

                // drawStone next frame
                that.playTimer = setTimeout(function () {
                    drawWaveSprite(stoneFrameIndexes[0], stoneFrameIndexes[1]);
                }, 1000/6);
            } else {
                drawWave(curFrameIndex);

                // drawStone next frame
                that.playTimer = setTimeout(function () {
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

                waveCtx.save();
                waveCtx.globalAlpha = 0.6;
                //  drawStone image
                waveCtx.drawImage(img, waveCanvasWidth*0.05, 0, waveCanvasWidth*0.9, waveCanvasHeight);
                waveCtx.restore();
            } else {

            }
        }
    },

    start: function (){
        //  init page response plugin
        //var page = new pageResponse({
        //    class : 'swiper-container',     //模块的类名，使用class来控制页面上的模块(1个或多个)
        //    mode : 'cover',     // auto || contain || cover ，默认模式为auto
        //    width : '375',      //输入页面的宽度，只支持输入数值，默认宽度为320px
        //    height : '625'      //输入页面的高度，只支持输入数值，默认高度为504px
        //});

        this.create();
    }
};

$(function (){
    // init app
    app.preload();
    console.log('app started success...');
});