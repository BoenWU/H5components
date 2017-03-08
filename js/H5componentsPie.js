var H5ComponentPie = function(name, cfg) {
	var component = new H5ComponentBase(name, cfg);
	var w = cfg.width;
	var h = cfg.height;
	//加入一个canvas画布作为网格线背景
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	canvas.width = ctx.width = w;
	canvas.height = ctx.height = h;
	component.append(canvas);
	var r = w / 2;
	var step = cfg.data.length;
	var colors = ['red', 'green', 'blue', 'darkred', 'orange'];

	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = '#eee';
	ctx.lineWidth = 1;
	ctx.arc(r, r, r, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	ctx.restore();

	//绘制一个数据层
	var sAngle = 1.5 * Math.PI; //设置开始角度在12点位置
	var eAngle = 0; //结束角度
	var aAngle = Math.PI * 2; //100%的角度
	for (var i = 0; i < step; i++) {
		var item = cfg.data[i];
		var color = item[2] || (item[2] = colors.pop());
		eAngle = sAngle + aAngle * item[1];
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.fillStyle = color;
		ctx.strokeStyle="#eee";
		ctx.lineWidth = .1;
		ctx.moveTo(r, r);
		ctx.arc(r, r, r, sAngle, eAngle);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.restore();
		sAngle = eAngle;
		//加入所有项目文本和百分比
		var text=$('<div class="text">');
		text.text(cfg.data[i][0]);
		var per=$('<div class="per">');
		per.text(cfg.data[i][1]*100+'%');
		text.append(per);
		var x=r+Math.sin(0.5*Math.PI-sAngle)*r;
		var y=r+Math.cos(0.5*Math.PI-sAngle)*r;
		if(x>w/2){
			text.css('left',x/2);
		}else{
			text.css('right',(w-x)/2);
		}

		if(y>h/2){
			text.css('top',y/2);
		}else{
			text.css('bottom',(h-y)/2);
		}
		if(cfg.data[i][2]){
			text.css('color',cfg.data[i][2]);
			text.css('color','#fff');
			text.css('backgroundColor',cfg.data[i][2]);
		}
		text.css('opacity',0);
		component.append(text);
	}

	//加入一个蒙版层覆盖达到动画效果
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	canvas.width = ctx.width = w;
	canvas.height = ctx.height = h;
	component.append(canvas);
	var draw = function(per) {
		ctx.clearRect(0, 0, w, h);
		ctx.beginPath();
		ctx.fillStyle = '#eee';
		ctx.lineWidth = 1;
		ctx.moveTo(r, r);
		if (per <= 0) {
			ctx.arc(r, r, r, 0, 2 * Math.PI);
			component.find('.text').css('opacity',0);
		} else {
			ctx.arc(r, r, r, 1.5 * Math.PI, 1.5* Math.PI + 2 * Math.PI * per, true);
		}
		ctx.closePath();
		ctx.fill();
		if(per>=1){
			component.find('.text').css('transition','all 0s');
			H5ComponentPie.reSort(component.find('.text'));
			component.find('.text').css('transition','all 1s');
			component.find('.text').css('opacity',1);
		}
	}
	draw(0);


	component.on('onload', function() {
		var s = 0;
		for (var i = 0; i < 100; i++) {
			setTimeout(function() {
				s += .01;
				draw(s);
			}, i * 10)
		}
	});
	component.on('onleave', function() {
		var s = 1;
		for (var i = 0; i < 100; i++) {
			setTimeout(function() {
				s -= .01;
				draw(s);
			}, i * 10 + 500)
		}
	});
	return component;
}

H5ComponentPie.reSort=function(list){
	//检测相交
	var compare=function(domA,domB){
		//元素的位置不用left，因为left为auto
		var offsetA=$(domA).offset();
		var shadowA_x=[offsetA.left,$(domA).width()+offsetA.left];
		var shadowA_y=[offsetA.top,$(domA).height()+offsetA.top];
		var offsetB=$(domB).offset();
		var shadowB_x=[offsetB.left,$(domB).width()+offsetB.left];
		var shadowB_y=[offsetB.top,$(domB).height()+offsetB.top];

		var intersect_x=(shadowA_x[0]>shadowB_x[0]&&shadowA_x[0]<shadowB_x[1])||(shadowA_x[1]>shadowB_x[0]&&shadowA_x[1]<shadowB_x[1]);
		var intersect_y=(shadowA_y[0]>shadowB_y[0]&&shadowA_y[0]<shadowB_y[1])||(shadowA_y[1]>shadowB_y[0]&&shadowA_y[1]<shadowB_y[1]);
		return intersect_x&&intersect_y;
	}
	//重排
	var reset=function(domA,domB){
		if($(domA).css('top') != 'auto'){
			$(domA).css('top',parseInt($(domA).css('top'))+$(domB).height());
		}
		if($(domA).css('bottom') != 'auto'){
			$(domA).css('bottom',parseInt($(domA).css('bottom'))+$(domB).height());
		}
	}
	var willReset=[];
	$.each(list,function(i,domTarget){
		if(list[i+1]&&compare(domTarget,list[i+1])){
			console.log($(domTarget).text(),$(list[i+1]).text(),'相交',compare(domTarget,list[i+1]));
			if(willReset.length==0){
				willReset.push(domTarget);
				willReset.push(list[i+1]);
			}else{
				willReset.push(list[i+1]);
			}
		}
	})
	console.log(willReset);
	if(willReset.length>1){
		$.each(willReset,function(i,domA){
			if(willReset[i+1]){
				reset(domA,willReset[i+1]);
			}
		})
		H5ComponentPie.reSort(willReset);
	}
}