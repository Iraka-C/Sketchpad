/*
	Written By Iraka
	Brush activities for Sketch platform
*/

var thickness=4; // Initial thickness
var smooth=2; // Initial smoothness

var brush=0; // brush type
var brushName=new Array("Pen","Brush","Eraser");

var brushEnable=1; // is brush Enabled?

function setBrushColor(){

	pt.setAttribute("stroke",color);
	brushEnable=1;
	if(brush==0||brush==1){ // the canvas has been inited
		if(activeLayer.clip){ // Opacity Protected
			ctx.globalCompositeOperation="source-atop";
		}
		else{
			ctx.globalCompositeOperation="source-over";
		}
	}
	else{
		if(activeLayer.clip){ // Opacity Protected
			brushEnable=0;
		}
		else{
			ctx.globalCompositeOperation="destination-out";
		}
	}
}

function changeBrushParam(e){

	if(ssm==0){ // change thickness
		if(e.wheelDelta>0&&thickness<99){
			thickness++;
			document.getElementById("thickness").innerHTML="Size:"+(thickness<10?"0":"")+thickness;
		}
		else if(e.wheelDelta<0&&thickness>1){
			thickness--;
			document.getElementById("thickness").innerHTML="Size:"+(thickness<10?"0":"")+thickness;
		}
		pt.setAttribute("r",thickness/2);
	}
	else{ // change smoothness
		if(e.wheelDelta>0&&smooth<15){
			smooth++;
			document.getElementById("thickness").innerHTML="Smooth:"+(smooth<10&&smooth>=0?"0":"")+smooth;
		}
		else if(e.wheelDelta<0&&smooth>-5){
			smooth--;
			document.getElementById("thickness").innerHTML="Smooth:"+(smooth<10&&smooth>=0?"0":"")+smooth;
		}
	}
}

function changeBrush(e){
	if(e.altKey==1){
	}
	else{
		brush=(brush+1)%brushName.length;
		document.getElementById("brushtype").innerHTML=brushName[brush]+">";
		setBrushColor();
	}
}
