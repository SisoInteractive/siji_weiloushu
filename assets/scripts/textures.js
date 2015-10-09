function Textures () {
    var that = this;

    var foreground = undefined;
    var background = undefined;
    var text = undefined;

    var touchStart = 0;
    var curStep = 0;
    var isComplete = false;
    var stepClasses = ['step01', 'step02', 'step03'];

    that.init = function () {
        $('.textures').show();

        //  scratch images
        foreground = new Image();
        foreground.src = 'assets/images/bg06-05-mask.jpg';

        background = new Image();
        background.src = 'assets/images/bg06-05.jpg';

        text = new Image();
        text.src = 'assets/images/texture-content05.png';

        //  preload textures
        var img = new Image();
        img.src = 'assets/images/texture01-bg.jpg';
        img.src = 'assets/images/texture02-bg.jpg';
        img.src = 'assets/images/texture03-bg.jpg';
        img.src = 'assets/images/texture04-bg.png';
        img.src = 'assets/images/texture05-bg.jpg';

        //  bind click
        $('.texture01').click(function () {
            $('.texture01').addClass('active');
            $('.txt').fadeOut();

            setTimeout(function () {
                $('.texture01 .a').addClass('active');
            }, 2400);
        });

        $('.texture02').click(function () {
            $('.texture02').addClass('active');
            $('.txt').fadeOut();

            setTimeout(function () {
                $('.texture02 .a').addClass('active');
            }, 2400);
        });

        //  texture03
        var texture03MaskDom = $('.texture03 .a');
        var dragHeight = parseInt(screen.availHeight/6);

        texture03MaskDom.on('touchstart', function (e) {
            touchStart = e.originalEvent.touches[0].pageY;
        });

        texture03MaskDom.on('touchmove', function (e) {
            var curPoint = e.originalEvent.touches[0].pageY;

            if (curPoint - touchStart >= dragHeight && curStep < stepClasses.length-1) {
                curStep++;
                texture03MaskDom.addClass(stepClasses[curStep]);

                touchStart = curPoint;

                //  out of mask
                if (curStep == 2 && isComplete == false) {
                    isComplete = true;

                    setTimeout(function () {
                        texture03MaskDom.fadeOut(1200);
                        $('.txt').fadeOut();
                    }, 400);
                }
            }
        });

        $('.texture04').on('touchstart', function () {
            setTimeout(function () {
                $('.texture04').addClass('active');
                $('.txt').fadeOut();
            }, 100)
        });
    };

    //  texture 01
    that.texture01 = function () {
        that.show();

        //  show texture
        $('.texture01').show().siblings().hide();
    };

    //  texture 02
    that.texture02 = function () {
        that.show();

        //  show texture
        $('.texture02').show().siblings().hide();
    };

    //  texture 03
    that.texture03 = function () {
        that.show();

        //  show texture
        $('.texture03').show().siblings().hide();
    };

    //  texture 04
    that.texture04 = function () {
        that.show();

        //  show texture
        $('.texture04').show().siblings().hide();
    };

    //  texture 05
    that.texture05 = function () {
        that.show();

        //  show texture
        $('.texture05').show().siblings().hide();

        //  init scratch
        that.createScratch(foreground, background, text);
    };

    // show
    that.show = function () {
        $('.swiper-container, .textures, .btn-back').addClass('active');
        $('.wrap').addClass('inToGlasses');
        $('.btn-back').addClass('inScratch');

        //  bring it front
        setTimeout(function () {
            $('.textures').addClass('inFrontLayer');
        }, 400);
    };

    //  hide
    that.hide = function () {
        $('.swiper-container, .btn-back, .textures, .texture, .texture .a').removeClass('active');
        $('.wrap').removeClass('inToGlasses');
        $('.btn-back').removeClass('inScratch');
        $('.texture .txt').fadeIn(1500);

        //  reset texture03
        curStep = 0;
        touchStart = 0;
        isComplete = false;

        setTimeout(function () {
            $('.texture03 .a').removeClass('active step01 step02 step03').show();
        }, 1200);
    };

    //  scratch
    that.createScratch = function (foreground, background, text) {
        $('.textures-box').show();
        var canvas = document.getElementsByClassName('textures-box')[0];
        var ctx = canvas.getContext('2d');
        var cWidth = $('.wrap').width();
        var cHeight = $('.wrap').height();
        var erasierSize = 90;

        var covered = 0; // Set the covered area
        var update = 0; // Use to reduce the number of time covered area' size is checked
        var transparentAtStart; // proportion of the transparent pixels in theforeground image

        var limit = 10; // limit the number of time the percentage is calculated, reduce lag
        var jump = 20; // number of pixel ignored for one pixel analyzed, reduce lag

        ctx.globalCompositeOperation = 'source-over';

        //  set real card
        document.getElementsByClassName('textures')[0].style.backgroundImage = 'url(' + background.src + ')';

        //  set text
        document.getElementsByClassName('textures')[0].getElementsByClassName('text')[0].src = text.src;

        //  create opacity mask
        ctx.drawImage(foreground, 0, 0, cWidth, cHeight);

        //  open global composition operation for wipe
        ctx.globalCompositeOperation = 'destination-out';

        //  watch mouse drop event
        var wiping = false;

        //  event listener
        function addEventListener(obj, event, fn) {
            if (document.addEventListener) {
                obj.addEventListener(event, function (e){
                    fn(e);
                });
            } else {
                obj.attachEvent('on' + event, function (e){
                    fn(e);
                })
            }
        }

        addEventListener(canvas, 'mousedown', wipeStart);
        addEventListener(canvas, 'touchstart', wipeStart);
        addEventListener(canvas, 'mouseup', wipeEnd);
        addEventListener(canvas, 'touchend', wipeEnd);
        addEventListener(canvas, 'mousemove', wipping);
        addEventListener(canvas, 'touchmove', wipping);

        function wipeStart (e) {
            e.stopPropagation();
            wiping = true;
        }

        function wipeEnd (e) {
            e.stopPropagation();
            wiping = false;
        }

        function wipping (e) {
            e.stopPropagation();

            if (wiping) {
                //console.log('start wiping..');
                var position = {};

                if (e.clientX) {
                    position.x = e.clientX - canvas.offsetLeft;
                    position.y = e.clientY - canvas.offsetTop;
                } else {
                    position.x = e.touches[0].pageX - canvas.offsetLeft;
                    position.y = e.touches[0].pageY - canvas.offsetTop;
                }

                // Fix for a bug on some android phone where globalCompositeOperation prevents canvas to update
                //if(e.type == 'touchmove' || e.type == 'touchstart' || e.type == 'touchend') {
                //    canvas.style.marginRight = '1px';
                //    canvas.style.marginRight = '0px';
                //}

                ctx.beginPath();
                ctx.fillStyle = "#f00";
                ctx.arc(position.x, position.y, erasierSize, 0, Math.PI*2);
                ctx.fill();
                ctx.closePath();

                //  check collision
                var covered = scratchPercent(wiping);

                if (covered >= 20) {
                    $('.textures-box').fadeOut('slow');
                    $('.texture05 .txt').fadeOut('slow');
                }
            }
        }

        function scratchPercent(click) {
            // divise by 10 the number of time percent are calculated to avoid stressing the cpu on smartphones
            if (update++%limit == 0 || click) {
                var ct = 0;
                var canvasData = ctx.getImageData(0,0, cWidth, cHeight).data;

                for (var i=0, l=(canvasData.length-jump); i<l; i+=(4*jump)) {
                    if (canvasData[i] > 0) {
                        ct++;
                    }
                }

                if(typeof transparentAtStart === 'undefined') {
                    transparentAtStart = ((cWidth*cHeight)/jump)-ct;
                }

                covered = (100-(((ct)/(((cWidth*cHeight)/jump)-transparentAtStart))*(100))).toFixed(2);
                //console.log(covered);
            }

            return (covered);
        }

    }
}