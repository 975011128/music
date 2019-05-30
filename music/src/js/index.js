require('../less/index.less');
var $ = require('zepto');
var render = require('./render');
var audio = new Audio();
var songList = []; 
var curAudioInfo = null;
var index = 0;
var status = false;
var frameId = null;
function getData() {
    $.ajax({
        url: '/mock/data.json',
        type: 'GET',
        success: function (data) {
            songList = data;
            bindClickEvent();
            bindTouchEvent()
            setProcess();
            $(document).trigger('changeAudio', index);
        }
    })
}
getData();


function bindClickEvent() {
    $(document).on('changeAudio', function (event, index) {
        render.render(songList[index]);
        audio.src = songList[index].audio;
        curAudioInfo = songList[index];
        if (status) {
            audio.play();
            setProcess();
        }
    })
    $('.play').click(function(e) {
        if (audio.paused) {
            audio.play();
            setProcess();
            status = true;
            $(this).addClass('pause');
        } else {
            audio.pause();
            status = false;
            $(this).removeClass('pause');
            cancelAnimationFrame(frameId);
        }        
    })
    $('.prev').click(function (e) {
        if (index == 0) {
            index = songList.length - 1;
        } else {
            index --;
        }
        $(document).trigger('changeAudio', index);
    })
    $('.next').click(function (e) {
        if (index == songList.length - 1) {
            index = 0;
        } else {
            index ++;
        }
        $(document).trigger('changeAudio', index);
    })
}
function bindTouchEvent() {
    var offsetLeft = $('.process').offset().left;
    var width = $('.process').width();
    $('.pro-spot').on('touchstart', function() {
        cancelAnimationFrame(frameId);
    }).on('touchmove', function(e) {
        var x = e.changedTouches[0].clientX - offsetLeft;
        var ratio = x / width;
        setCurTime(ratio);
        render.renderProcess(ratio);
        audio.play();
        setProcess();
        status = true;
        $('.play').addClass('pause');
    }).on('touchend', function(e) {
        console.log('end');
    });
    $(audio).on('ended', function() {
        $('.next').trigger('click');
    })
}
function setProcess() {
    cancelAnimationFrame(frameId);
    var frame = function () {
        var time = Math.round(audio.currentTime);
        render.renderCurTime(time);
        var ratio = getCurRatio();
        render.renderProcess(ratio);
        frameId = requestAnimationFrame(frame);
        if (time >= songList[index].duration) {
            cancelAnimationFrame(frameId);
            $('.next').trigger('click');
        }
    }
    frame(); 
}

function getCurRatio() {
    return audio.currentTime / songList[index].duration;
}

function setCurTime(ratio) {
    var time = ratio * curAudioInfo.duration;
    audio.currentTime = time;
    render.renderCurTime(Math.round(time));
}
