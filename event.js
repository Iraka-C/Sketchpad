/*
	Written By Iraka
	Event handlers for Sketch platform
*/

var mouseDown=0;
var ssm=0; // 1: Shift Down

var nowTime;
var lastMouseTime=0; // last move/ scroll on layer time

function getDefaultStyle(obj,attribute){
	return obj.currentStyle?obj.currentStyle[attribute]:document.defaultView.getComputedStyle(obj,false)[attribute];
}

function setTime(){
	nowTime=new Date();
	lastMouseTime=nowTime.getTime();
	//document.getElementById("debug").innerHTML=""+lastMouseTime;
}

function mouseDownCanvas(e){

	if(e.button==2){ // Right Button, Undo
		if(mouseDown==0) // Left or Middle not pressed
			undo();
	}
	else{ // Left or Middle
		mouseDown=1;
		lx=e.clientX-leftGap;
		ly=e.clientY-topGap;
		if(ssm)
			pickColor();
		else
			recLine(e);
	}
}

function mouseMove(e){

	setTime();

	lx=e.clientX-leftGap;
	ly=e.clientY-topGap;

	if(ssm){ // Picking color
		showColorPickerCursor();
	}
	else{
		showBrushCursor();

		if(mouseDown!=0){
			drawLine(e);
		}
	}

}

function mouseUp(e){
	if(e.button!=2){ // Left or Middle up
		mouseDown=0;
	}
}


function keyDown(e){
	if(e.shiftKey==1&&ssm==0){ // Shift Down
		ssm=1;
		document.getElementById("thickness").innerHTML="Smooth:"+(smooth<10&&smooth>=0?"0":"")+smooth;
		//document.getElementById("cpick").innerHTML="SetBG>";
		document.getElementById("help").innerHTML="&nbsp;??&nbsp;";
		document.getElementById("penhelp").style.visibility="hidden";
		document.getElementById("colorhelp").style.visibility="hidden";
		document.getElementById("toolhelp").style.visibility="hidden";
		document.getElementById("canvashelp").style.visibility="hidden";
		document.getElementById("layerhelp").style.visibility="hidden";
		document.getElementById("sizeinfo").style.visibility="inherit";
		document.getElementById("penhelp2").style.visibility="inherit";
		document.getElementById("toolhelp2").style.visibility="inherit";
		document.getElementById("colorhelp2").style.visibility="inherit";
		document.getElementById("layerhelp2").style.visibility="inherit";
		document.getElementById("addlayer").style.visibility="hidden";
		document.getElementById("blendmode").style.visibility="inherit";

		showColorPickerCursor();

		for(var i in layerStack)
			if(i!="remove"){
				var l=layerStack[i];
				l.close.innerHTML="¡ø";
				l.close.style.color="#000000";
				l.vis.innerHTML="¨‹";
				l.vis.style.color="#000000";
			}
	}
}

function keyUp(e){
	if(e.shiftKey==0&&ssm==1){ // Shift Up
		ssm=0;
		document.getElementById("thickness").innerHTML="Size:"+(thickness<10?"0":"")+thickness;
		//document.getElementById("cpick").innerHTML="Color>";
		document.getElementById("help").innerHTML="&nbsp;?&nbsp;";
		document.getElementById("penhelp").style.visibility="inherit";
		document.getElementById("colorhelp").style.visibility="inherit";
		document.getElementById("toolhelp").style.visibility="inherit";
		document.getElementById("canvashelp").style.visibility="inherit";
		document.getElementById("layerhelp").style.visibility="inherit";
		document.getElementById("sizeinfo").style.visibility="hidden";
		document.getElementById("penhelp2").style.visibility="hidden";
		document.getElementById("toolhelp2").style.visibility="hidden";
		document.getElementById("colorhelp2").style.visibility="hidden";
		document.getElementById("layerhelp2").style.visibility="hidden";
		document.getElementById("addlayer").style.visibility="inherit";
		document.getElementById("blendmode").style.visibility="hidden";

		showBrushCursor();
		setTag();

		for(var i in layerStack)
			if(i!="remove"){
				var l=layerStack[i];
				l.close.innerHTML="¡Á";
				l.vis.innerHTML="¡ý";
				if(i==0)
					l.vis.style.color="#e0e0e0";
			}

		if(layerStack.length<=1)
			for(var i in layerStack)
				if(i!="remove"){
					layerStack[i].close.style.color="#e0e0e0";
				}
	}
}

function init(){
	//c=document.getElementById("cv");
	//ctx=c.getContext("2d");
	initLayerStack();
	pt=document.getElementById("pt");
	pc=document.getElementById("pc");
	pc1=document.getElementById("pc1");
	pc2=document.getElementById("pc2");
	leftGap=parseInt(getDefaultStyle(document.getElementById("canvaspanel"),'left'));
	topGap=parseInt(getDefaultStyle(document.getElementById("canvaspanel"),'top'));
	layerWidth=parseInt(getDefaultStyle(document.getElementById("layerpanel"),'width'));

	setPanelSize();
	initFile();
	initHelp();
}

function initFile(){
	var drop=document.getElementById("save");
	drop.addEventListener("dragenter",dragHandle,false);
	drop.addEventListener("dragleave",dragHandle,false);
	drop.addEventListener("dragover",dragHandle,false);
	drop.addEventListener("drop",dragHandle,false);
}

function dragHandle(e){
	e.preventDefault();
	if(e.type=="dragenter"){
		var drop=document.getElementById("save");
		drop.innerHTML="Import";
	}
	if(e.type=="dragleave"){
		var drop=document.getElementById("save");
		drop.innerHTML="Export";
	}
	if(e.type=="drop"){
		var drop=document.getElementById("save");
		drop.innerHTML="Export";

		for(i in e.dataTransfer.files){
			var file=e.dataTransfer.files[i];
			if(!file.type.match(/image*/))continue;

			//recLast();
			//addLayer();

			window.URL=window.URL||window.webkitURL;
			var img=new Image();
			img.src=window.URL.createObjectURL(file);
			img.onload=function(e){
				addLayer(); // draw after image loaded
				var w=this.width;
				var h=this.height;
				var tw=cvw;
				var th=cvh;
				if(w>tw||h>th){
					var rx=tw/w,ry=th/h;
					var r=Math.min(rx,ry);
					w*=r;h*=r;
				}
				ctx.drawImage(this,0,0,w,h);
				window.URL.revokeObjectURL(this.src);

			}
		}
	}
}
