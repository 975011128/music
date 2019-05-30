var gussFun = require('./gaussFun');
function render (data) {
    renderImg(data);
    renderInfo(data);
    blur(data);
    renderAllTime(data.duration);
    renderCurTime(0);
    renderIsLike(data.isLike)
}
function renderImg (data) {
    $('.song-img').find('img').attr('src', data.image);
}
function renderInfo (data) {
    var str = '<div class="song-name">\
    <h2>' + data.song + '</h2>\
</div>\
<div class="singer">' + data.singer + '</div>\
<div class="album">' + data.album + '</div>'
    $('.song-info').html(str);
}
function timeFormat(t) {
    var minute = Math.floor(t / 60);
    var second = t - minute * 60;
    if (minute < 10) {
        minute = '0' + minute; 
    }
    if (second < 10) {
        second = '0' + second;
    }
    return minute  + ':' + second;
}
function renderCurTime(t) {
    var time = timeFormat(t);
    $('.cur-time').html(time);
}
function renderAllTime(t) {
    var time = timeFormat(t);
    $('.all-time').html(time);
}
function blur (data) {
    var img = new Image();
    img.src = data.image;
    img.onload = function () {
        var canvas = $('<canvas width="200" height="200"></canvas>');
        var ctx = canvas[0].getContext('2d');
        ctx.drawImage(img, 0, 0, 200, 200);
        var pixel = ctx.getImageData(0, 0, 200, 200);
        var srcData = gussFun(pixel);
        ctx.putImageData(srcData, 0, 0);
        var imgSrc = canvas[0].toDataURL();
        $('.wrapper').css({
            backgroundImage: 'url(' + imgSrc + ')'
        })
    }
}


function renderIsLike(islike) {
    if (islike) {
        $('.fav').addClass('liking')
    }
}

function renderProcess(per) {
    $('.pro-spot').css({
        left: per * 100 + '%',
    })
    // console.log($('.pro-spot').offset().left, $('.process').offset().left)
    var left = $('.process').width() - $('.pro-spot').width();
    var x = $('.pro-spot').offset().left - $('.process').offset().left;
    if ( x > left) {
        $('.pro-spot').css({
            left: left,
        });
    }
    $('pro-up').css({
        transform: 'translateX(' + (per - 1) * 100 + '%)',
    })
}

module.exports = {
    render,
    renderCurTime,
    renderProcess,
};