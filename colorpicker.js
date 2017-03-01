/*
	Written By Iraka
	Color picker and color manipulation for Sketch platform
*/

var color="RGB(0,0,0)"; // Global Color
var rgb={r:0,g:0,b:0};
var hsv={h:0,s:0,v:0};
//var bgc={r:255,g:255,b:255}; // Background Color
var csp=0; // Active Color Space RGB=0 HSV=1

function setHSVTag(thsv){
	document.getElementById("pick1").innerHTML="H:"+d3n(thsv.h);
	document.getElementById("pick2").innerHTML="S:"+d3n(thsv.s);
	document.getElementById("pick3").innerHTML="V:"+d3n(thsv.v);
	var trgb=hsv2rgb({h:thsv.h,s:100,v:100});
	document.getElementById("pick1").style.color="RGB("+trgb.r+","+trgb.g+","+trgb.b+")";
	trgb=hsv2rgb({h:thsv.h,s:thsv.s,v:100});
	document.getElementById("pick2").style.color="RGB("+trgb.r+","+trgb.g+","+trgb.b+")";
	trgb=hsv2rgb({h:thsv.h,s:100,v:thsv.v});
	document.getElementById("pick3").style.color="RGB("+trgb.r+","+trgb.g+","+trgb.b+")";
}

function setRGBTag(trgb){
	document.getElementById("pick1").innerHTML="R:"+d3n(trgb.r);
	document.getElementById("pick2").innerHTML="G:"+d3n(trgb.g);
	document.getElementById("pick3").innerHTML="B:"+d3n(trgb.b);
	document.getElementById("pick1").style.color="RGB("+trgb.r+","+0+","+0+")";
	document.getElementById("pick2").style.color="RGB("+0+","+trgb.g+","+0+")";
	document.getElementById("pick3").style.color="RGB("+0+","+0+","+trgb.b+")";
}


function setTag(){ // set now Global Color as tag
	if(csp==0){
		setRGBTag(rgb);
	}
	else{
		setHSVTag(hsv);
	}

	document.getElementById("cpick").style.color=color;
}

function clickColorSpace(e){
	if(ssm){ // Fill Canvas
		fillCanvas();
	}
	else{ // change Color Space
		csp=1-csp;
		setTag();
	}
}

function getColor(){
	if(lx<0||ly<0)return {r:0,g:0,b:0};
	var pixel=ctx.getImageData(lx,ly,1,1).data;

	var trgb={r:pixel[0],g:pixel[1],b:pixel[2]};
	var thsv=rgb2hsv(trgb);
	if(csp==0){ // Temp Color Set
		setRGBTag(trgb);
	}
	else{
		setHSVTag(thsv);
	}
	document.getElementById("cpick").style.color="RGB("+trgb.r+","+trgb.g+","+trgb.b+")";
	return trgb;
}

function refreshColorSettings(){ // Refresh all item Params related to Global Color
	color="RGB("+rgb.r+","+rgb.g+","+rgb.b+")";
	setTag();
	setBrushColor();
}

function pickColor(){
	if(lx<0||ly<0)return;
	rgb=getColor();
	hsv=rgb2hsv(rgb);

	refreshColorSettings();
}


function change1(e){
	var pick1=document.getElementById("pick1");
	if(csp==0){
		if(e.wheelDelta>0&&rgb.r<255){
			rgb.r++;
		}
		else if(e.wheelDelta<0&&rgb.r>0){
			rgb.r--;
		}
		hsv=rgb2hsv(rgb);
	}
	else{
		if(e.wheelDelta>0){
			hsv.h++;
			if(hsv.h>=360)hsv.h=0;
		}
		else if(e.wheelDelta<0){
			hsv.h--;
			if(hsv.h<0)hsv.h=359;
		}
		rgb=hsv2rgb(hsv);
	}
	refreshColorSettings();
}

function change2(e){
	var pick2=document.getElementById("pick2");
	if(csp==0){
		if(e.wheelDelta>0&&rgb.g<255){
			rgb.g++;
		}
		else if(e.wheelDelta<0&&rgb.g>0){
			rgb.g--;
		}
		hsv=rgb2hsv(rgb);
	}
	else{
		if(e.wheelDelta>0&&hsv.s<100){
			hsv.s++;
		}
		else if(e.wheelDelta<0&&hsv.s>0){
			hsv.s--;
		}
		rgb=hsv2rgb(hsv);
	}
	refreshColorSettings();
}

function change3(e){
	var pick3=document.getElementById("pick3");
	if(csp==0){
		if(e.wheelDelta>0&&rgb.b<255){
			rgb.b++;
		}
		else if(e.wheelDelta<0&&rgb.b>0){
			rgb.b--;
		}
		hsv=rgb2hsv(rgb);
	}
	else{
		if(e.wheelDelta>0&&hsv.v<100){
			hsv.v++;
		}
		else if(e.wheelDelta<0&&hsv.v>0){
			hsv.v--;
		}
		rgb=hsv2rgb(hsv);
	}
	refreshColorSettings();
}

function reverse1(e){
	var pick1=document.getElementById("pick1");
	if(csp==0){
		rgb.r=255-rgb.r;
		hsv=rgb2hsv(rgb);
	}
	else{
		hsv.h=(hsv.h+180)%360;
		rgb=hsv2rgb(hsv);
	}
	refreshColorSettings();
}

function reverse2(e){
	var pick2=document.getElementById("pick1");
	if(csp==0){
		rgb.g=255-rgb.g;
		hsv=rgb2hsv(rgb);
	}
	else{
		hsv.s=100-hsv.s;
		rgb=hsv2rgb(hsv);
	}
	refreshColorSettings();
}

function reverse3(e){
	var pick1=document.getElementById("pick1");
	if(csp==0){
		rgb.b=255-rgb.b;
		hsv=rgb2hsv(rgb);
	}
	else{
		hsv.v=100-hsv.v;
		rgb=hsv2rgb(hsv);
	}
	refreshColorSettings();
}
