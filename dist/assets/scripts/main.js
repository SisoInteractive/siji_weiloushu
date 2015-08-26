// Created by sam mok 2015(Siso brand interactive team).

"use strict";

var app = {
    sprites: {
        stone: [],
        wave: []
    },

    direct: 'forward',

    canPlay: true,

    curStoneParaIndex: 0,

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

        //  let main scene active
        $('.main-scene').addClass('active');

        //  init swiper
        var swiperItemsLength = $('.scene').length;

        app.mySwiper = new Swiper ('.swiper-container', {
            direction: 'vertical',

            parallax : true,

            noSwiping: false,

            // init
            onInit: function (swiper) {
                $('.swiper-container').show();
                $('.scene').eq(swiper.activeIndex).addClass('active');

                //  bound menu button
                $('.btn-menu').click(function (e) {
                    e.stopPropagation();
                    slideTo(0);
                });

                $('.btn-main').click(function (e) {
                    e.stopPropagation();
                    slideTo(1);
                });

                $('.item01 .stone-txt, .menu-scene .item01').click(function(e){
                    e.stopPropagation();
                    slideTo(2);
                });

                $('.item02 .stone-txt, .menu-scene .item02').click(function(e){
                    e.stopPropagation();
                    slideTo(3);
                });

                $('.item03 .stone-txt, .menu-scene .item03').click(function(e){
                    e.stopPropagation();
                    slideTo(4);
                });

                $('.item04 .stone-txt, .menu-scene .item04').click(function(e){
                    e.stopPropagation();
                    slideTo(5);
                });

                function slideTo(index) {
                    $('.wrap').addClass('toContent').removeClass('mainSceneToMenu contentToMenu');
                    $('.btn-menu, .btn-main').removeClass('active');
                    swiper.slideTo(index, 0);//切换到第一个slide，速度为1秒
                }
            },

            onTransitionStart: function (swiper) {
                //  hide menu button when transition start
                $('.btn-menu, .btn-main').addClass('active');

                if (swiper.activeIndex == swiperItemsLength) {
                    $('.slider-arrow').hide();
                } else {
                    $('.slider-arrow').hide();
                }
            },

            onTransitionEnd: function (swiper) {
                $('.btn-menu, .btn-main').removeClass('active');
                $('.scene').removeClass('active');
                $('.scene').eq(swiper.activeIndex).addClass('active');

                //  show menu button if current page is not the first page
                if (swiper.activeIndex == 0) {
                    $('.btn-menu, .btn-main').addClass('active');
                } else {
                    $('.btn-menu, .btn-main').removeClass('active');
                }
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

            setTimeout(function () {
                $('.bird').removeClass('transformed')
                    .addClass('fly');
            }, 600);
        }, 500);

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
                    $('.main-scene .item').removeClass('active');
                    $('.main-scene .item').eq(curStoneParaIndex).addClass('active');
                    $('.cursor').removeClass('cursor01 cursor02 cursor03 cursor04')
                        .addClass('active cursor0' + (curStoneParaIndex+1));

                    /** play the second time animation */
                    that.playTimer = setTimeout(function () {
                        //  hide para
                        $('.main-scene .item').removeClass('active');

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
                    }, 1000/12);
                }
            }
        })(stoneFrameIndexes[0], stoneFrameIndexes[1]);

        /**  play wave animation */
        drawWaveSprite(waveFrameIndexes[0], waveFrameIndexes[1]);

        //  bind touch event
        var toucharea = document.getElementsByClassName('wrap')[0];
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
                        that.curStoneParaIndex = i;

                        //  show para
                        $('.main-scene .item').removeClass('active');
                        $('.main-scene .item').eq(curStoneParaIndex).addClass('active');
                        $('.cursor').removeClass('cursor01 cursor02 cursor03 cursor04')
                            .addClass('active cursor0' + (curStoneParaIndex+1));

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
            $('.main-scene .item').removeClass('active');
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
            $('.main-scene .item').removeClass('active');
            $('.main-scene .item').eq(minIndex).addClass('active');
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
            class : 'wrap',     //模块的类名，使用class来控制页面上的模块(1个或多个)
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