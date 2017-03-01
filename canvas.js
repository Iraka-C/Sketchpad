/*
	Written By Iraka
	Canvas layer for Sketch platform
*/

var lastData; // Data for Undo

var c; // Global Canvas
var ctx; // Global Canvas Context

var lx1,ly1;
var lx2,ly2;
var lx3,ly3;
var speed;

var blendName=new Array("NORMAL","MULTIPLY","SCREEN");

function recLine(e){
	if(c.style.visibility=="hidden")return;

	lx1=lx2=lx;
	ly1=ly2=ly;

	recLast();

	ctx.strokeStyle=color;
	ctx.lineWidth=(brush==1?0:thickness); // Brush starts thin
	ctx.lineCap="round";

	if(smooth>=0){ // slow down
		speed=Math.pow(0.75,smooth);
	}
	else{ // tremble
		speed=2-(smooth+5)*(smooth+5)/25;
	}

	if(brush!=1)drawLine(); // Draw a Plot Instantly
}

function drawLine(){
	lx3=lx*speed+lx2*(1-speed);
	ly3=ly*speed+ly2*(1-speed);

	if(brush==1){
		var dis=Math.sqrt((lx3-lx1)*(lx3-lx1)+(ly3-ly1)*(ly3-ly1));
		var lw=thickness*Math.pow(0.9,dis);
		ctx.lineWidth=lw*speed+ctx.lineWidth*(1-speed);
	}

	ctx.beginPath();
	ctx.moveTo(lx1,ly1);
	lx1=(lx2+lx3)/2;
	ly1=(ly2+ly3)/2;
	ctx.quadraticCurveTo(lx2,ly2,lx1,ly1);
	if(brushEnable){ // Now Brush is Enabled
		ctx.stroke();
	}

	lx2=lx3;
	ly2=ly3;
}

function recLast(){
	lastData=ctx.getImageData(0,0,c.width,c.height);
}

function undo(){
	if(lastData)
		ctx.putImageData(lastData,0,0);
}

function clearCanvas(e){
	lastData=ctx.getImageData(0,0,c.width,c.height);
	c.width=c.width;
}

function setCanvasSize(cv){
	var cvtx=cv.getContext("2d");
	var imgData=cvtx.getImageData(0,0,cv.width,cv.height);

	cv.width=cvw;
	cv.height=cvh;

	//document.getElementById("debug").innerHTML=cvw+","+cvh;
	cvtx.putImageData(imgData,0,0);
}

function fillCanvas(){
	recLast();
	var imgData=ctx.getImageData(0,0,c.width,c.height);
	var pix=imgData.data;
	for(var i=0;i<pix.length;i+=4){
		pix[i]=rgb.r;
		pix[i+1]=rgb.g;
		pix[i+2]=rgb.b;
		pix[i+3]=255;
	}
	ctx.putImageData(imgData,0,0);
}

function changeOpacity(e,layer){
	if(layer.canvas.style.visibility=="hidden")return;
	var nowOp=layer.opNum;
	if(e.wheelDelta>0&&nowOp<100){
		nowOp++;
	}
	else if(e.wheelDelta<0&&nowOp>0){
		nowOp--;
	}
	layer.canvas.style.opacity=nowOp/100;
	layer.opNum=nowOp;
	layer.op.innerHTML=nowOp+"%";
}

function switchLayerVis(layer){
	var vis=layer.canvas.style.visibility;
	if(vis=="visible"){
		layer.canvas.style.visibility="hidden";
		layer.op.innerHTML="----";
		//layer.icon.style.opacity=0.5;
	}
	else{
		layer.canvas.style.visibility="visible";
		layer.op.innerHTML=layer.opNum+"%";
		//layer.icon.style.opacity=1;
	}

}

function changeBlendMode(e){
	if(!ssm)return; // only change when SHIFT pressed;
	var bnum=blendName.length;
	if(e.wheelDelta>0){
		activeLayer.blend++;
		if(activeLayer.blend==bnum)activeLayer.blend=0;
	}
	else if(e.wheelDelta<0){
		activeLayer.blend--;
		if(activeLayer.blend==-1)activeLayer.blend=bnum-1;
	}
	document.getElementById("blendmode").innerHTML="Blend Mode<br/>"+blendName[activeLayer.blend];

	c.style.mixBlendMode=blendName[activeLayer.blend].toLowerCase();
}

function switchLayerClip(layer){
	layer.clip=1-layer.clip;
	if(layer.clip){
		layer.buttons.style.backgroundColor="#86c0e0";
	}
	else{
		layer.buttons.style.backgroundColor="transparent";
	}
	setBrushColor();
}
