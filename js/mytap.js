function mytap(ele,callback) {
	var startTime = 0;
	var delayTime = 0;
	var maxDelay = 300;
	//定义一个变量来判断是否移动了 即是否进入了touchmove事件
	var falg = true;
	ele.addEventListener("touchstart",function() {
		startTime = Date.now();
	})
	ele.addEventListener("touchmove",function() {
		flag = false;
	})
	ele.addEventListener("touchend",function(event) {
		delayTime = Date.now() - startTime;
		if((flag === false) || (delayTime > maxDelay)) {
			return;
		}
		else {
			callback(event);
		}
	})
}