//window.domain="test.co.kr:9090";
if (! window.NEXACROHTML) {
	  window.NEXACROHTML = {};
}

var parent = null;
var bInit = false;
window.NEXACROHTML.Init = function() {
	console.log("window.NEXACROHTML.Init start=> ");

	  var loopCnt = 0;
	  var interval = setInterval(fn = function() {
	      parent = window.NEXACROWEBBROWSER;
        if(loopCnt >= 10 || parent) {
            bInit = true;
    	      clearInterval(interval);
console.log("Parent:" + loopCnt + ":" + parent);
	      }

		    loopCnt++;
  	}, 50);
		console.log("window.NEXACROHTML.Init end=> ");
}

window.NEXACROHTML.FireUserNotify = function(userdata) {
	console.log("window.NEXACROHTML.FireUserNotify start=> ");
console.log("Fire:" + bInit + ":" + parent);
    if(bInit == false) {
        var loopCnt = 0;
        var interval = setInterval(fn = function() {		
		        if (loopCnt > 10 || bInit) {
			          clearInterval(interval);
		        }
  		      loopCnt++;
	      }, 50);
  	}
	  if (parent) {
	      parent.on_fire_onusernotify(parent, userdata);
  	} else {
	  	  window.document.title = userdata;
	  }			
		console.log("window.NEXACROHTML.FireUserNotify end=> ");
}