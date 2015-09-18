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
        pictureImgDom.setAttribute('style', 'transform: translate3d(-300px, -300px, 0); -webkit-transform: translate3d(-300px, -300px, 0)');
        pictureTitleDom.src = imgPath + 'big-picture-title01.png';
    };

    this.showPicture02 = function () {
        this.picture = null;
        pictureImgDom.src = bigPictureArr[1].src;
        pictureImgDom.width = bigPictureArr[1].width*pictureZoom;
        pictureImgDom.height = bigPictureArr[1].height*pictureZoom;
        pictureImgDom.setAttribute('style', 'transform: translate3d(-1955px, -887px, 0); -webkit-transform: translate3d(-1955, -887px, 0)');
        pictureTitleDom.src = imgPath + 'big-picture-title02.png';
    };

    this.showPicture03 = function () {
        this.picture = null;
        pictureImgDom.src = bigPictureArr[2].src;
        pictureImgDom.width = bigPictureArr[2].width*pictureZoom;
        pictureImgDom.height = bigPictureArr[2].height*pictureZoom;
        pictureImgDom.setAttribute('style', 'transform: translate3d(-1117px, -292px, 0); -webkit-transform: translate3d(-1117px, -292px, 0)');
        pictureTitleDom.src = imgPath + 'big-picture-title03.png';
    };

    this.pictureTouchStartHandler = function (e) {
        this.touchStartPointX = e.touches[0].pageX;
        this.touchStartPointY = e.touches[0].pageY;

        //  catch picture
        if (!this.picture) {
            this.picture = this.getElementsByTagName('img')[0];
        }
    };

    this.pictureTouchMoveHandler = function (e) {
        var canSetNewPosition = true;
        var picture = this.picture;
        var oldPosition = that.matrixToArray(this.picture.getAttribute('style'));
        var oldPositionX = oldPosition[0];
        var oldPositionY = oldPosition[1];

        //  get current touch position
        var curPointX = e.touches[0].pageX;
        var curPointY = e.touches[0].pageY;
        var oldPointX = this.touchStartPointX;
        var oldPointY = this.touchStartPointY;

        var distanceX = Math.abs(curPointX - oldPointX);
        var distanceY = Math.abs(curPointY - oldPointY);

        var newX = 0;
        var newY = 0;

        //  set new position changed value
        curPointX < oldPointX ? newX = -distanceX : newX = distanceX;
        curPointY < oldPointY ? newY = -distanceY : newY = distanceY;

        //  calculate final position
        newX = (newX + parseInt(oldPositionX));
        newY = (newY + parseInt(oldPositionY));

        //console.log(newX, newY);

        var isTheMaxLeftTop = newX > 0 || newY > 0;
        var isTheMaxLeftBottom = newX > 0 || newY < -(picture.height - app.scene.availHeight);
        var isTheMaxRightTop = newX < -(picture.width - app.scene.availWidth) || newY > 0;
        var isTheMaxRightBottom = newX < -(picture.width - app.scene.availWidth) || newY < -(picture.height - app.scene.availHeight);


        /**  if drag out of boundary */
        if ( isTheMaxLeftTop || isTheMaxLeftBottom || isTheMaxRightTop || isTheMaxRightBottom ) {
            canSetNewPosition = false;

            //  debug
            //console.log('\n', ' isTheMaxLeftTop', isTheMaxLeftTop);
            //console.log('isTheMaxLeftBottom', isTheMaxLeftBottom);
            //console.log('isTheMaxRightTop', isTheMaxRightTop);
            //console.log('isTheMaxRightBottom', isTheMaxRightBottom);
        }

        //  if can set new position
        if (canSetNewPosition) {
            //  set image new position
            picture.setAttribute('style', 'transform: translate3d(' + newX  +'px, ' + newY +  'px, 0);' + '-webkit-transform: translate3d(' + newX  +'px, ' + newY +  'px, 0);');

            //  update touchStart point
            this.touchStartPointX = curPointX;
            this.touchStartPointY = curPointY;
        }
    };

    this.matrixToArray = function (matrix) {
        return matrix.split(')')[0].split('(')[1].replace(/ /g, '').replace(/px/g, '').split(',');
    };

    //  bind touch handler for each picture wrap
    pictureWrap.addEventListener('touchstart', that.pictureTouchStartHandler);
    pictureWrap.addEventListener('touchmove', that.pictureTouchMoveHandler);
}