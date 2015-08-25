// Created by sam mok 2015(Siso brand interactive team).

"use strict";

var app = {
    sprites: [],

    paper: {
        canvas: {
            dom: null,
            width: 0,
            height: 0
        },

        ctx: null
    },

    direct: 'forward',

    preload: function () {
        var that = this;
        var Canvas = document.getElementById('stone-body');
        var ctx = Canvas.getContext('2d');

        //  set images generator
        var imgPath = "assets/images/";
        //  img amounts, use the amounts order to general image objects
        var imgAmounts = 24;
        var loadedAmounts = 0;
        var isLoaded = false;

        //  load fixed scene frames
        for (var i = 1; i <= 24; i++) {
            var img = new Image();
            img.src = imgPath + 's01-stone-body' + fixZero(i) + '.png';

            img.index = i;

            img.onload = function () {
                that.sprites[this.index] = this;
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

        //  init paper info
        that.paper.ctx = ctx;
        that.paper.canvas.dom = Canvas;
        that.paper.canvas.width = Canvas.width;
        that.paper.canvas.height = Canvas.height;

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

        var frameIndexes = [1, 24];
        var keyframeIndexes = [1, 9, 16, 24];

        //  play stone animation
        that.curFrameIndex = 1;
        drawSprite(that.curFrameIndex, frameIndexes[1]);

        //  recursive to draw sprites
        function drawSprite(curFrameIndex, endFrameIndex) {
            that.curFrameIndex = curFrameIndex;
            that.playing = true;

            //  check whether current frame is keyframe
            for (var i = 0; i < keyframeIndexes.length; i++) {
                if (that.curFrameIndex == keyframeIndexes[i]) {

                }
            }

            //  check whether currentFrame is the last frame of the current scene.
            if (curFrameIndex == endFrameIndex) {
                draw(curFrameIndex);

                // draw next frame
                that.playTimer = setTimeout(function () {
                    //  draw direction
                    that.direct == "forward" ? drawSprite(frameIndexes[0], frameIndexes[1]) : drawSprite(frameIndexes[1], frameIndexes[0]);
                }, 1000/6);
            } else {
                draw(curFrameIndex);

                // draw next frame
                that.playTimer = setTimeout(function () {
                    //  draw direction
                    that.direct == "forward" ? drawSprite(parseInt(curFrameIndex)+1, endFrameIndex) : drawSprite(parseInt(curFrameIndex)-1, endFrameIndex);
                }, 1000/6);
            }
        }

        function draw(frameIndex) {
            /**
             * Draw frame into canvas
             * @param {Number} frameIndex  the index of frame you want to draw into canvas
             * */
            var img = that.sprites[frameIndex];
            var ctx = that.paper.ctx;

            if (img) {
                //  clear paper
                ctx.clearRect(0, 0, that.paper.canvas.width, that.paper.canvas.height);

                //  draw image
                ctx.drawImage(img, 0, 0, that.paper.canvas.width, that.paper.canvas.height);
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