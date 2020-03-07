// import { callbackify } from "util";

(function(window){
  function Progress($progresslower,$progressline,$progressdot){
    return new Progress.prototype.init($progresslower,$progressline,$progressdot);
  }
  Progress.prototype = {
    constructor: Progress,
    init: function($progresslower,$progressline,$progressdot){
      this.$progresslower = $progresslower;
      this.$progressline = $progressline;
      this.$progressdot = $progressdot;
    },
    isMove: false,
    progressClick:function(callBack){
      var $this = this;/**this是progress */
      this.$progresslower.click(function(event){
        var leftdistance = $(this).offset().left;

        var eventleft = event.pageX;

        $this.$progressline.css("width",eventleft - leftdistance)
        $this.$progressdot.css("left",eventleft - leftdistance)
        //计算进度条比例
        var value = (eventleft - leftdistance) / $(this).width()
        callBack(value)
      })
    },
    progressmove:function(callBack){
      var $this = this;
      this.$progresslower.mousedown(function(){
        $this.isMove =true;
      var leftdistance = $(this).offset().left;

      $(document).mousemove(function (event) { 

        var eventleft = event.pageX;
//         $this.$progressdot.css("left",eventleft - leftdistance)
//         $this.$progressline.css("width",eventleft - leftdistance)
//         判断移动距离不超过进度条
        if(eventleft - leftdistance >=0 && eventleft - leftdistance <=660){
          $this.$progressline.css("width",eventleft - leftdistance)
          $this.$progressdot.css("left",eventleft - leftdistance)
        }
        else{
          $this.$progressline.css().stop()
          $this.$progressdot.css().stop()

        }
       
      });
      })
      
      $(document).mouseup(function () { 
        $(document).off("mousemove")
        $this.isMove = false;
        var value = (eventleft - leftdistance) / $this.$progresslower.width();
        callBack(value);
      });
    },
    setProgress: function(value){
      if(this.isMove) return;
      if(value<0 || value>100) return;
      this.$progressline.css({
        width: value+"%"
      })
      this.$progressdot.css({
        left: value+"%"
      })
    }
  }
  Progress.prototype.init.prototype = Progress.prototype;
  window.Progress = Progress;
})(window);