
  
/*使用delegate委托指令*/

$(function(){

  $(".music-play").click(function(){
    $(this).toggleClass("music-play2")
  })
  $(".music-mode").click(function(){
    $(this).toggleClass("music-mode4")
  })
  $(".music-like").click(function(){
    $(this).toggleClass("music-like2")
  })
  $(".music-only").click(function(){
    $(this).toggleClass("music-only2")
  })
 

  var $audio = $("audio");
  var player = new Player($audio);
  var $progresslower = $(".message-lower")
  var $progressline = $(".message-line")
  var $progressdot = $(".message-dot")
  var progress = Progress($progresslower,$progressline,$progressdot)
  progress.progressClick(function(value){
    player.musicSeekTo(value);
  })
  progress.progressmove(function(value){
    player.musicSeekTo(value);
  })



  var $volumelower = $(".volume-lower")
  var $volumeline = $(".volume-line")
  var $volumedot = $(".volume-dot")
  var volume = Progress($volumelower,$volumeline,$volumedot)
  volume.progressClick(function(value){
    player.musicVoide(value);
  })
  volume.progressmove(function(value){
    player.musicVoide(value);
  })
/*调用歌曲资源 */
  playjax();
  function playjax(){
    $.ajax({
      // type: "method",
      url: "./source/musiclist.json",
      // data: "data",
      dataType: "json",
      success: function (data) {
        player.musicList = data;
        var $listul = $(".list ul");
        $.each(data, function(index, ele){
          var $item = crateMusicItem(index, ele);
         
          $listul.append($item);
        })
        inMusicinfo(data[0]);
      },
      // error: function(e){
      //   // console.log(e); 
      // }
    });
  }
  /**
   * 初始化歌曲信息
   */
  function inMusicinfo(music){
    var $musicimage = $(".song-infor-pic img")
    var $musicsong = $(".song-infor-name a")
    var $musicsinger = $(".song-infor-singer a")
    var $musicablum = $(".song-infor-ablum a")
    var $musicmessage = $(".message-name")
    var $musicatime = $(".message-time")
    var $musicbg = $(".bg")

    $musicimage.attr("src",music.cover);
    $musicsong.text(music.name);
    $musicsinger.text(music.singer);
    $musicablum.text(music.ablum);
    $musicmessage.text(music.name + "/" + music.singer);
    $musicatime.text("00:00/"+ music.time)
    $musicbg.css("background","url('"+music.cover+"')")
  };
  /*所以点击事件 */
inevents();
function inevents(){
  
  $(".list").delegate(".music","mouseenter",function(){
    $(this).find(".list_menu").stop().fadeIn(100);
    $(this).find(".list_time a").stop().fadeIn(100).css("display","inline-block");
  
    $(this).find(".list_time span").stop().fadeOut(100);
  })
  $(".list").delegate(".music","mouseleave",function(){
    $(this).find(".list_menu").stop().fadeOut(100);
    $(this).find(".list_time a").stop().fadeOut(100);
  
    $(this).find(".list_time span").stop().fadeIn(100);
  })
  // $(".list").mCustomScrollbar();
  $(".list").delegate(".check","click",function(){
    $(this).toggleClass("checked")
  })

 
  var $musicplay = $(".music-play")
  $(".list").delegate(".list_menu_play","click",function(){
    /*点击切换播放按钮 */
    
    var $itemmusic = $(this).parents(".music")

    $(this).toggleClass("list_menu_play2")
    /*移除其它非当前点击操作 */
    $itemmusic.siblings().find(".list_menu_play")
    .removeClass("list_menu_play2");
    /*同步底部播放按钮 */

    if($(this).attr("class").indexOf("list_menu_play2") != -1){
      /*播放 */
      $musicplay.addClass("music-play2");
      /*文字高亮 */
      $itemmusic.find("div").css("color","#fff")
      $itemmusic.siblings().find("div").css("color","rgba(255, 255, 255,0.5)")
    }
    else{
      /*不播放 */
      $musicplay.removeClass("music-play2");
      /*文字不高亮 */
      $itemmusic.find("div").css("color","rgba(255, 255, 255,0.5)")
     
    }
    $itemmusic.find(".number").toggleClass("number2");
    $itemmusic.siblings().find(".number").removeClass("number2")

    player.playMusic($itemmusic.get(0).index,$itemmusic.get(0).music);
    inMusicinfo($itemmusic.get(0).music)
  });

  /*底部音乐播放主键控制 */
  $musicplay.click(function(){
    if(player.currentIndex == -1){
    $(".music").eq(0).find(".list_menu_play").trigger("click");
    }
    else{
      $(".music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
    }
  })
  /*底部上一首音乐控制 */
  $(".music-pre").click(function(){
    $(".music").eq(player.preIndex()).find(".list_menu_play").trigger("click");
  })
  /*底部下一首音乐控制 */
  $(".music-next").click(function(){
    $(".music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");
  })

    /**
     * 删除点击的音乐
     */
  $(".list").delegate(".list_menu_del", "click",function(){
    
  var $item = $(this).parents(".music");
  if($item.get(0).index == player.currentIndex){
    $(".music-next").trigger("click")
  }
  $item.remove();
  player.changeMusic($item.get(0).index);
  /**
   * 重新排列序号
   */
  $(".music").each(function (index, ele){
    ele.index = index;
    $(ele).find(".number").text(index + 1);
  })
  })

  // 8.监听播放的进度
  player.musicTimeUpdate(function (currentTime, duration, timeStr) {
    // 同步时间
    $(".message-time").text(timeStr);
    // 同步进度条
    // 计算播放比例
    var value = currentTime / duration * 100;
    progress.setProgress(value);
    // 实现歌词同步
    var index = lyric.currentIndex(currentTime);
    var $item = $(".song-music li").eq(index);
    $item.addClass("cur");
    $item.siblings().removeClass("cur");

    // 实现歌词滚动
    if(index <= 2) return;
    $(".song_lyric").css({
        marginTop: (-index + 2) * 30
    });
});
  // 9.声音按钮的控制
  $(".music-volume").click(function(){
    $(this).toggleClass("music-volume2")
    //声音切换
    if($(this).attr("class").indexOf("music-volume2") != -1){
      //没有声音
      player.musicVoide(0)
    }
    else{
      //有声音
      player.musicVoide(1)
    }
  })
}


  function crateMusicItem(index, music){
    var $item = $("<li class=\"music\">\n" +
    "<div class=\"check\"><i></i></div>\n" +
      "<div class=\"number\">"+(index+1)+"</div>\n" +
      "<div class=\"song\">"+music.name+"" +
        "<div class=\"list_menu\">\n" +
        "          <a href=\"javascript:;\" title=\"播放\" class=\"list_menu_play\"></a>\n" +
        "          <a href=\"javascript:;\" title=\"添加\"></a>\n" +
        "          <a href=\"javascript:;\" title=\"下载\"></a>\n" +
        "          <a href=\"javascript:;\" title=\"分享\"></a>\n" +
        "     </div>\n" +
      "</div>\n" +
      "<div class=\"list_singer\">"+music.singer+"</div>\n" +
      "<div class=\"list_time\">\n" +
        "<span>"+music.time+"</span>\n" +
        "<a href=\"javascript:;\" title=\"删除\" class=\"list_menu_del\"></a>\n" +
    "  </div>\n" +
 " </li>");
$item.get(0).index = index;
$item.get(0).music = music;
 return $item;
  }
})

