window.onload = function() {
	// 顶部通栏透明度
	headerRgba();

	// 顶部轮播图
	sliderAnimate();
	
	// 倒计时
	countTime();
}


// 顶部通栏透明度
function headerRgba() {
	//获取导航部分底部到顶部的距离 因为顶部通栏到那里再往下透明度就一直是1了
	var navDom = document.querySelector(".container_nav");
	var navDistance = navDom.offsetHeight + navDom.offsetTop;

	// 获取顶部通栏
	var header = document.querySelector(".container_header");
	header.style.backgroundColor = "rgba(201,21,35,0)";
	//获取屏幕被卷去的距离   被卷去的距离/navDistance 就是透明度 
	//scrollTop写兼容写法
	//兼容写法如下
	function scroll() {
		return {
			"top":window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
			"left":window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft
		}
	}
	//在屏幕滚动事件中获取
	window.onscroll = function() {
		var scrollHeight = scroll().top;
		var opacity = scrollHeight/navDistance;
		if(opacity >= 1) {
			opacity = 1;
		}
		header.style.backgroundColor = "rgba(201, 21, 35,"+opacity+")";
	}
}
	


//顶部轮播图
function sliderAnimate() {
	//获取单个图片的宽度  图片的宽度就是container_slider的宽度
	var imgWidth = document.querySelector(".container_slider").offsetWidth;

	//获取移动的ul
	var moveUl = document.querySelector(".slider_img");

	//获取小方块
	var slideIndexArr = document.querySelectorAll(".slider_index li");

	//设置一个索引index来控制图片距离
	var index = 1;
	//设置一个变量num来控制小方块
	var num = 0;

	//把开启关闭过渡封装成一个函数,这样就可以避免出错 并且容易修改
	var startTransition = function() {
		moveUl.style.transition = "all 0.3s linear";
	}
	var closeTransition = function() {
		moveUl.style.transition = "";
	}

	//把设置moveUl的transform封装成一个函数
	var setTransform = function(distance) {
		moveUl.style.transform = "translateX("+distance+"px)";
	}

	//设置一个定时器让他实现自动跳向下一张图 通过C3的transform 和 transition实现
	var timer = null;
	timer = setInterval(fn,1000);
	function fn() {
		//在过渡结束事件中关闭 所以每进一次就开
		startTransition();
		//先自增再显示 是因为默认显示第一张和第一个
		index++;
		num++;
		moveUl.style.transform = "translateX("+index*imgWidth*(-1)+"px)";
	}

	//设置过渡结束事件  在过渡结束时会调用
	moveUl.addEventListener("webkitTransitionEnd",function() {
		if(index > 8) {
			//index=1 是为了让图片能够再下次定时器开始的时候ul从第一张滑到第二张
			index = 1;
			closeTransition();
			//让ul瞬间移动到第一张图片处
			setTransform(index*imgWidth*(-1));
		}
		if(index < 1) {
			index = 8;
			closeTransition();
			setTransform(index*imgWidth*(-1));
		}

		if(num > 7) {
			num = 0;
		}
		if(num < 0) {
			num = 7;
		}

		//控制小圆点高亮显示  为什么在过渡结束事件中判断 因为在触摸中将定时器关了
		//如果在定时器中判断 那么小圆点在触摸中将不再继续跟着动
		//但是小圆点索引还是要在定时器中自加  因为如果在过渡结束中自加
		//那么在触摸结束中开启过渡后对num++ num--就会和 过渡结束事件里面重复操作
		for(var i=0;i<slideIndexArr.length;i++) {
			slideIndexArr[i].classList.remove("current");
		}
		slideIndexArr[num].classList.add("current");

	});

	
	//定义一个变量,记录初始触摸位置
	var startX = 0;
	//定义一个变量,记录移动的距离
	var moveX = 0;
	
	//触摸开始事件
	moveUl.addEventListener("touchstart",function(event) {
		//触摸开始的时候要关闭定时器并关闭过渡
		clearInterval(timer);
		closeTransition();
		startX = event.touches[0].clientX;
	})

	//触摸移动事件
	moveUl.addEventListener("touchmove",function() {
		moveX = event.touches[0].clientX - startX;
		setTransform(moveX+index*imgWidth*(-1));
	})

	//触摸结束事件
	moveUl.addEventListener("touchend",function() {
		//定义一个移动的最小距离 来判断吸附
		var minDistance = imgWidth/3;

		//在这里要重新开启过渡 因为在触摸开始的时候关了过渡  为了好看在结束时开
		startTransition();
		if(Math.abs(moveX) < minDistance) {
			setTransform(index*imgWidth*(-1));
		}
		else {
			if(moveX > 0) {
				index--;
				num--;
			}
			else {
				index++;
				num++;
			}
			setTransform(index*imgWidth*(-1));
		}

		//重新开启定时器
		timer = setInterval(fn,1000);
	})
}




// 倒计时
function countTime() {
	//实际上这是通过服务端动态生成的,这里就不这么做


	// 获取倒计时的li数组
	var timeLiArr = document.querySelectorAll(".main_content_top:nth-child(1) .main_content_top_left li");
	
	//设置一个定时器
	var timer = null;

	//创建一个未来指定时间的Date对象,并且获取总的毫秒值
	var futureDate = new Date("2018/6/26 09:00:00");
	var futureDateMs = futureDate.getTime();

	//在定时器开启前先执行一遍
	fn();

	//获取一个现在时间的Data对象,并且获取总的毫秒值,但是这个要在定时器里获取
	var timer = setInterval(fn,1000);
	function fn() {
		var nowDate = new Date();
		var nowDateMs = nowDate.getTime();
		//获取总毫秒差值 并转化为时分秒
		var totalMs = futureDateMs-nowDateMs;
		var totalHour = Math.floor(totalMs/1000/60/60);
		var totalMin = Math.floor(totalMs/1000/60%60);
		var totalSec = Math.floor(totalMs/1000%60);

		// 判断当毫秒差小于等于0时关闭定时器
		if(totalMs < 0) {
			timeLiArr[0].innerHTML = 0;
			timeLiArr[1].innerHTML = 0;
			timeLiArr[3].innerHTML = 0;
			timeLiArr[4].innerHTML = 0;
			timeLiArr[6].innerHTML = 0;
			timeLiArr[7].innerHTML = 0;
			clearInterval(timer);
			return;
		}

		// 为timeLiArr设置值
		// /10是为了当>=10时取十位 <10时为0
		// %10取剩下的
		timeLiArr[0].innerHTML = Math.floor(totalHour/10);
		timeLiArr[1].innerHTML = totalHour%10;

		timeLiArr[3].innerHTML = Math.floor(totalMin/10);
		timeLiArr[4].innerHTML = totalMin%10;

		timeLiArr[6].innerHTML = Math.floor(totalSec/10);
		timeLiArr[7].innerHTML = totalSec%10;
	}
}