/*
	Written By Iraka
	Mouse cursor adjustments for Sketch platform
*/

var pt,pc,pc1,pc2; // Mouse Cursors
// pt = brush
// pc = colorpicker
var lx=-1000,ly=-1000; // Initial Position

function hideCursor(){
	pc.setAttribute("stroke-width","0");
	pt.setAttribute("stroke-width","0");
	lx=-1000;
	ly=-1000;
	//stopLine(e);
}

function showBrushCursor(){
	pt.setAttribute("cx",lx);
	pt.setAttribute("cy",ly);
	pt.setAttribute("stroke-width","2");
	pc.setAttribute("stroke-width","0");
}

function showColorPickerCursor(){
	pc1.setAttribute("x1",lx-10);
	pc1.setAttribute("x2",lx+10);
	pc1.setAttribute("y1",ly);
	pc1.setAttribute("y2",ly);
	pc2.setAttribute("x1",lx);
	pc2.setAttribute("x2",lx);
	pc2.setAttribute("y1",ly-10);
	pc2.setAttribute("y2",ly+10);
	var trgb=getColor();
	pc.setAttribute("stroke",(trgb.r+trgb.g+trgb.b<380?"#ffffff":"#000000"));
	pc.setAttribute("stroke-width","1");
	pt.setAttribute("stroke-width","0");
}

function setMouseLayerSize(){
	var s=document.getElementById("mouseLayer");
	s.setAttribute("width",cvw);
	s.setAttribute("height",cvh);
}

function showCursor(){
	if(ssm){
		showColorPickerCursor();
	}
	else{
		showBrushCursor();
	}
}
