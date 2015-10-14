// Created by sam mok 2015(Siso brand interactive team).

"use strict";

//  limit browser drag move
document.addEventListener('touchmove', function (e) {
    e.preventDefault();
},true);

var app = {
    sprites: {
        stone: [],
        wave: []
    },

    scene: {
        availWidth: 0,
        availHeight: 0
    },

    direct: 'forward',

    canPlay: true,

    curStoneParaIndex: 0,

    preload: function () {
        var that = this;

        var Canvas = document.getElementById('stone-body');
        var ctx = Canvas.getContext('2d');

        //  set scene info
        that.scene.availWidth = 375;
        that.scene.availHeight = 627;

        //  set images generator
        var imgPath = "assets/images/";
        //  img amounts, use the amounts order to general image objects
        var imgAmounts = 24+5;
        var loadedAmounts = 0;
        var isLoaded = false;
        var startLoadTime = new Date().getTime();
        var endLoadTime = null;


        //  init fast click
        FastClick.attach(document.body);

        if ('addEventListener' in document) {
            document.addEventListener('DOMContentLoaded', function() {
                FastClick.attach(document.body);
            }, false);
        }

        //  load main images
        //  load stone scene frames
        for (var i = 0; i < 24; i++) {
            var img = new Image();
            //img.src = imgPath + 's01-stone-body' + fixZero(i) + '.png';
            //img.src = 'assets/img/' + 's01-stone-body' + fixZero(i) + '.png';
            img.src = 'assets/img2/shitou_0929.' + (i > 11 ? i - 12 : i) + '.png';

            img.index = i;

            loadedAmounts++;

            img.onload = function () {
                that.sprites.stone[this.index] = this;
                /* check img load progress */
                if (checkIsAllMainImagesLoaded() && isLoaded == false) {
                    goCreatingProcess();
                }
            };

            img.onerror = function (error) {
                imgAmounts -= 1;

                /* check img load progress */
                if (checkIsAllMainImagesLoaded() && isLoaded == false) {
                    goCreatingProcess();
                }
            };
        }

        //  load wave scene frames
        for (var i = 1; i <= 5; i++) {
            var img = new Image();
            img.src = imgPath + 'wave0' + i + '.png';

            img.index = i;

            img.onload = function () {
                that.sprites.wave[this.index] = this;
                loadedAmounts++;

                /* check img load progress */
                if (checkIsAllMainImagesLoaded() && isLoaded == false) {
                    goCreatingProcess();
                }
            };

            img.onerror = function (error) {
                imgAmounts -= 1;

                /* check img load progress */
                if (checkIsAllMainImagesLoaded() && isLoaded == false) {
                    goCreatingProcess();
                }
            };
        }

        function goCreatingProcess () {
            isLoaded = true;
            endLoadTime = new Date().getTime();
            var timeDifference = (endLoadTime - startLoadTime)/1000;

            //  if loaded time less than 3.5 seconds,
            //  delay then start app
            if (timeDifference < 3) {
                console.log('images loader end..');
                var delay = 3500 - timeDifference*1000;
                //var delay = 10;

                setTimeout(function () {
                    //  update loading bar
                    $('.loading .counter').text('100%');
                    $('.line-wrap').css({'background-position' : '100% 0%'});

                    setTimeout(function () {
                        app.start();
                    }, parseInt(delay/3*1));
                }, parseInt(delay/3*2));
            } else {
                //  update loading bar
                $('.loading .counter').text('100%');
                $('.line-wrap').css({'background-position' : '100% 0%'});

                console.log('images loader end..');
                setTimeout(function () {
                    app.start();
                }, 300);
            }
        }

        function checkIsAllMainImagesLoaded () {
            if (isLoaded == false) {
                var loadedRate = 0.98;

                var lineWidth = parseInt(375*0.64);
                var lineActiveWidth = 54;

                var percent = parseInt(loadedAmounts / imgAmounts*100);
                $('.loading .counter').text(percent + '%');
                $('.line-wrap').css({'background-position' : (parseInt(lineWidth*percent/100) - lineActiveWidth +'px 0px')});

                return loadedAmounts / imgAmounts >= loadedRate;
            }
        }

        function fixZero (num) {
            return num < 10 ? '0' + num : num;
        }
    },

    create: function (){
        var that = this;

        //  init swiper
        $('.swiper-container').show();

        var swiperItemsLength = $('.scene').length;

        app.mySwiper = new Swiper ('.swiper-container', {
            direction: 'vertical',

            parallax : true,

            noSwiping: false,

            // init
            onInit: function (swiper) {
                $('.main-scene').addClass('active');

                $('.scene').eq(swiper.activeIndex).addClass('active');

                $('.tips-arrow, .big-picture').show();

                //  bound menu button
                $('.btn-main').click(function (e) {
                    e.stopPropagation();

                    //  enable slider
                    app.mySwiper.unlockSwipes();

                    //  hide back button
                    $('.btn-back').removeClass('active');

                    //  remove in big picture statue for scene big picture
                    $('.scene-big-picture').removeClass('inBigPicture');

                    //  remove big picture show, and remove big picture layout to the front
                    $('.big-picture').removeClass('inBigPicture inFrontLayer');

                    //  exist texture active status
                    that.textures.hide();

                    //  hide para right now
                    $('.main-scene .item').removeClass('active').addClass('backRightNow');
                    setTimeout(function () {
                        $('.main-scene .item').removeClass('backRightNow');
                    }, 300);

                    //  bird back to start stat
                    $('.bird').removeClass('transform transformed fly');

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

                    //  play first time again
                    that.stone.playFirstTime();

                    slideTo(0);
                });

                $('.btn-menu').click(function (e) {
                    e.stopPropagation();

                    //  enable slider
                    app.mySwiper.unlockSwipes();

                    //  remove in big picture statue for scene big picture
                    $('.scene-big-picture').removeClass('inBigPicture');

                    //  remove big picture show, and remove big picture layout to the front
                    $('.big-picture').removeClass('inBigPicture inFrontLayer');

                    //  exist texture active status
                    that.textures.hide();

                    slideTo(1);
                });

                $('.btn-back').click(function (e) {
                    e.stopPropagation();

                    $(this).removeClass('active inScratch');

                    //  enable slider
                    app.mySwiper.unlockSwipes();

                    //  remove in big picture statue for scene big picture
                    $('.scene-big-picture').removeClass('inBigPicture');

                    //  remove big picture show, and remove big picture layout to the front
                    $('.big-picture').removeClass('inBigPicture inFrontLayer');

                    //  exist texture active status
                    that.textures.hide();
                });

                //  bound main scene content router
                $('.item01 .stone-txt, .menu-scene .item01').click(function(e){
                    e.stopPropagation();
                    slideTo(2);
                });

                $('.item02 .stone-txt, .menu-scene .item02').click(function(e){
                    e.stopPropagation();
                    slideTo(4);
                });

                $('.item03 .stone-txt, .menu-scene .item03').click(function(e){
                    e.stopPropagation();
                    slideTo(9);
                });

                $('.item04 .stone-txt, .menu-scene .item04').click(function(e){
                    e.stopPropagation();
                    slideTo(15);
                });

                //  cursor for content entry
                $('.cursor').click(function (e) {
                    e.stopPropagation();

                    var index = $(this).attr('class');
                    index = index[index.length-1];
                    console.log(index);

                    switch (parseInt(index)) {
                        case 1:
                            slideTo(2);
                            break;
                        case 2:
                            slideTo(4);
                            break;
                        case 3:
                            slideTo(9);
                            break;
                        case 4:
                            slideTo(15);
                            break;
                    }
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
                    $('.slider-arrow').show();
                }
            },

            onTransitionEnd: function (swiper) {
                $('.btn-menu, .btn-main').removeClass('active');
                $('.scene').removeClass('active');
                $('.scene').eq(swiper.activeIndex).addClass('active');

                //  show menu button if current page is not the first page
                if (swiper.activeIndex == 0) {
                    $('.btn-menu, .btn-main').addClass('active');

                    that.stone.drawStoneSprite(that.stone.curFrameIndex, that.stone.stoneFrameIndexes[1]);
                    that.wave.drawWaveSprite(that.wave.waveFrameIndexes[0], that.wave.waveFrameIndexes[0]);
                } else {
                    $('.btn-menu, .btn-main').removeClass('active');

                    that.stone.pause();
                    that.wave.pause();
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

        //  init sliders
        $('.bxslider').bxSlider({
            controls: false
        });

        /** Animation parts * */
        //  init objects
        that.stone = new Stone(app);
        that.stone.playFirstTime();

        that.wave = new Wave(app);
        that.wave.drawWaveSprite(that.wave.waveFrameIndexes[0], that.wave.waveFrameIndexes[0]);

        that.picture = new Picture(app);

        that.textures = new Textures();

        //  bind touch event
        var toucharea = document.getElementsByClassName('wrap')[0];

        toucharea.addEventListener('touchstart', that.stone.setTouchStartPoint);

        toucharea.addEventListener('touchmove', that.stone.setCurrentFrame);

        toucharea.addEventListener('touchend', that.stone.touchEndHandler);

        //  bind texture entry
        $('.texture-title01').click(function () {
            that.textures.texture01();
        });

        $('.texture-title02').click(function () {
            that.textures.texture02();
        });

        $('.texture-title03').click(function () {
            that.textures.texture03();
        });

        $('.texture-title04').click(function () {
            that.textures.texture04();
        });

        $('.texture-title05').click(function () {
            that.textures.texture05();
        });

        //  lazyload images
        if ( localStorage.isWeiloushuLoaded == false ) {
            setTimeout(function () {
                $('img').each(function () {
                    var lazySrc = $(this).attr('lazy-src');
                    if (lazySrc) { $(this).attr('src', lazySrc) }
                    localStorage.isWeiloushuLoaded = true;
                });

                setTimeout(function () {
                    that.textures.init();
                }, 4000);
            }, 6000);
        } else {
            $('img').each(function () {
                var lazySrc = $(this).attr('lazy-src');
                if (lazySrc) { $(this).attr('src', lazySrc) }
            });

            setTimeout(function () {
                that.textures.init();
            }, 4000);
        }

        function cleanImageCache () {
            localStorage.removeItem('isWeiloushuLoaded');
        }

    },

    start: function (){
        var that = this;

        //  let main scene active
        $('.loading').addClass('leave');

        setTimeout(function () {
            that.create()
        }, 400);
    }
};