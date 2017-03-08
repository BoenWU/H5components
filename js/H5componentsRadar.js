var H5ComponentRadar=function(name,cfg){
	var component=new H5ComponentBase(name,cfg);
	var w=cfg.width;
	var h=cfg.height;
	//加入一个canvas画布作为网格线背景
	var canvas=document.createElement('canvas');
	var ctx=canvas.getContext('2d');
	canvas.width=ctx.width=w;
	canvas.height=ctx.height=h;
	component.append(canvas);
	var r=w/2;
	var step=cfg.data.length;

	var isBlue=true;
	// ctx.save();
	for(var s=10;s>0;s--){
		ctx.beginPath();
		for(var i=0;i<step;i++){
			var rad=(2*Math.PI/360)*(360/step)*i;
			var x=r+Math.sin(rad)*r*(s/10);
			var  y=r+Math.cos(rad)*r*(s/10);
			// ctx.moveTo(r,r);
			ctx.lineTo(x,y);
			// ctx.arc(x,y,5,0,2*Math.PI);
		}
		ctx.closePath();
		ctx.fillStyle=(isBlue=!isBlue)?'#99c0ff':'#f1f9ff';
		ctx.fill();
	}
	//绘制伞骨
	for(var i=0;i<step;i++){
		var rad=(2*Math.PI/360)*(360/step)*i;
		var x=r+Math.sin(rad)*r;
		var  y=r+Math.cos(rad)*r;
		ctx.moveTo(r,r);
		ctx.strokeStyle="#e0e0e0";
		ctx.lineTo(x,y);
		//输出项目文字
		var text=$('<div class="text">');
		text.text(cfg.data[i][0]);
		text.css('transition','all .5s '+i*.2+'s');
		if(x>w/2){
			text.css('left',x/2+5);
		}else{
			text.css('right',(w-x)/2+5);
		}
		if(y>h/2){
			text.css('top',y/2+5);
		}else{
			text.css('bottom',(h-y)/2+5);
		}
		if(cfg.data[i][2]){
			text.css('color',cfg.data[i][2]);
		}
		text.css('opacity',0);
		component.append(text);

	}
	ctx.stroke();
	// ctx.restore();

	var canvas=document.createElement('canvas');
	var ctx=canvas.getContext('2d');
	canvas.width=ctx.width=w;
	canvas.height=ctx.height=h;
	component.append(canvas);
	var draw=function(per){
	ctx.clearRect(0,0,w,h);
	ctx.strokeStyle='#f00';
		// ctx.save();
		ctx.beginPath();
		//输出数据折线
		for(var i=0;i<step;i++){
		var rad=(2*Math.PI/360)*(360/step)*i;
		var rate=cfg.data[i][1]*per;
		var x=r+Math.sin(rad)*r*rate;
		var  y=r+Math.cos(rad)*r*rate;
		ctx.lineTo(x,y);
		}
		ctx.closePath();
		ctx.stroke();
		ctx.restore();

		ctx.save();
		ctx.fillStyle='#ff7676';
	for(var i=0;i<step;i++){
		var rad=(2*Math.PI/360)*(360/step)*i;
		var rate=cfg.data[i][1]*per;
		var x=r+Math.sin(rad)*r*rate;
		var  y=r+Math.cos(rad)*r*rate;
		ctx.beginPath();
		ctx.arc(x,y,5,0,2*Math.PI);
		ctx.fill();
		ctx.closePath();
		}
		// ctx.restore();
		if(per<=1){
			component.find('.text').css('opacity',0);
		}
		if(per>=1){
			component.find('.text').css('opacity',1);
		}
	}
		draw(.01);
	

	component.on('onload',function(){
		var s=0;
		for(var i=0;i<100;i++){
			setTimeout(function(){
				s+=.01;
				draw(s);	
			},i*10)
		}
	});
	component.on('onleave',function(){
		var s=1;
		for(var i=0;i<100;i++){
			setTimeout(function(){
				s-=.01;
				draw(s);	
			},i*10+500)
		}
	});
	return component;
}
