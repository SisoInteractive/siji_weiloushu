function Picture (app) {
    var that = this;

    var pictureWrap = document.getElementsByClassName('big-picture')[0];
    var pictureImgDom = pictureWrap.getElementsByClassName('picture-wrap')[0].getElementsByTagName('img')[0];
    var pictureTitleDom = pictureWrap.getElementsByClassName('title')[0].getElementsByTagName('img')[0];
    var bigPictureArr = [];
    //var pictureZoom = $('.wrap').css('transform').split(')')[0].split('(')[1].replace(/ /g, '').split(',')[0];
    var pictureZoom = 1;

    //  request big picture
    var img = new Image();
    var imgPath = 'assets/images/';
    img.src = imgPath + 'big-picture01.jpg';
    bigPictureArr.push(img);

    img = new Image();
    img.src = imgPath + 'big-picture02.jpg';
    bigPictureArr.push(img);

    img = new Image();
    img.src = imgPath + 'big-picture03.jpg';
    bigPictureArr.push(img);

    //  set default picture as undefined
    pictureWrap.picture = undefined;

    var isZoomInited = false;

    //  bind entry button
    $('.circle').click(function () {
        //  add "in big picture" statue for "scene big picture"
        $(this).parents('.scene-big-picture').addClass('inBigPicture');

        //  show back button
        $('.btn-back').addClass('active');

        var bigPictureIndex = parseInt(this.getAttribute('data-pic-index'));

        switch ( bigPictureIndex ) {
            case 1:
                that.showPicture01();
                break;
            case 2:
                that.showPicture02();
                break;
            case 3:
                that.showPicture03();
                break;
        }

        if (isZoomInited == true) {
            $('#imageZoom').smoothZoom('Reset');
        } else {
            $('#imageZoom').smoothZoom({
                width: '100%',
                height: '100%',
                zoom_MIN: 20,
                animation_SPEED_PAN: 7,
                animation_SMOOTHNESS: 7,
                zoom_OUT_TO_FIT: false,
                zoom_BUTTONS_SHOW: false,
                pan_BUTTONS_SHOW: false
            });

            isZoomInited = true;
        }



        //  set big picture show, and set big picture layout to the front
        $('.big-picture').addClass('inBigPicture');
        setTimeout(function () {
            $('.big-picture').addClass('inFrontLayer');
        }, 300);

        //  disable slider when in big picture,
        //  enable slider when click menu buttons
        app.mySwiper.lockSwipes();
    });

    this.showPicture01 = function () {
        this.picture = null;
        pictureImgDom.src = bigPictureArr[0].src;
        pictureImgDom.width = bigPictureArr[0].width*pictureZoom;
        pictureImgDom.height = bigPictureArr[0].height*pictureZoom;
        pictureTitleDom.src = imgPath + 'big-picture-title01.png';
    };

    this.showPicture02 = function () {
        this.picture = null;
        pictureImgDom.src = bigPictureArr[1].src;
        pictureImgDom.width = bigPictureArr[1].width*pictureZoom;
        pictureImgDom.height = bigPictureArr[1].height*pictureZoom;
        pictureTitleDom.src = imgPath + 'big-picture-title02.png';
    };

    this.showPicture03 = function () {
        this.picture = null;
        pictureImgDom.src = bigPictureArr[2].src;
        pictureImgDom.width = bigPictureArr[2].width*pictureZoom;
        pictureImgDom.height = bigPictureArr[2].height*pictureZoom;
        pictureTitleDom.src = imgPath + 'big-picture-title03.png';
    };

    this.matrixToArray = function (matrix) {
        return matrix.split(')')[0].split('(')[1].replace(/ /g, '').replace(/px/g, '').split(',');
    };

    //  bind touch handler for each picture wrap
    pictureWrap.addEventListener('touchstart', that.pictureTouchStartHandler);
    pictureWrap.addEventListener('touchmove', that.pictureTouchMoveHandler);
}