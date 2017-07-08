/*
	Written By Iraka
	Help information for Sketch platform
*/

var helpText=[
	{"id":"penhelp",
	 "text":"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&uarr;<br/>This is a paint brush.<br/><br/>\
				Click to change the style of the brush.<br/>\
				A pen strokes evenly, and the thickness of a brush varies.<br/>\
				An eraser is also included.<br/><br/>\
				Scroll here to change the size of brushes.<br/><br/>"},
	{"id":"colorhelp",
	 "text":"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&uarr;<br/>\
				This is a color picker.<br/><br/>\
				Two color spaces (RGB,HSV) are allowed.\
				Press the'Color>' label to switch between them.<br/><br/>\
				Scroll on each conponent to adjust its value.<br/>\
				Click on each conponent to reverse the value.<br/>\
				You can observe the blending result by the 'Color>' label."},
	{"id":"toolhelp",
	 "text":"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&uarr;<br/>\
				These are function buttons.<br/><br/>\
				Export button allows you to export the canvas as an PNG image.\
				You can then view it in a blank page or download it.\
				The image size is the size of present canvas.<br/><br/>\
				Clear button clears the canvas.<br/><br/>\
				'?' button calls out help page. (This page)<br/><br/>\
				Also, try <span style='color:#c00000;font-weight:bold;'>SHIFT</span> key\
				to see advanced functions."},
	{"id":"canvashelp",
	 "text":"<span style='font-size:2em'>&oplus;</span>\
				Here's the canvas. Use your mouse to draw on it!<br/>\
				Right click to undo 1 step.<br/>\
				Notice that undo process puts the content back to the activated layer.<br/>\
				Resize the window shall change the size of the canvas,\
				but all canvas data will be preserved.<br/>\
				Chrome is recommended. Other browsers aren't assured.<br/>\
				Now left click to close help page."},
	{"id":"penhelp2",
	 "text":"If you press SHIFT key, a 'smooth' value will be shown here.\
				Scroll meantime to change the smoothness of the brush.<br/>\
				Larger value draws slower but produces a round curve,\
				while a minus value brings extra 'dither'."},
	{"id":"toolhelp2",
	 "text":"&nbsp;&nbsp;&uarr;&uarr;&uarr;<br/>\
				Drag image file(s) on to the 'Export' button!\
				The image will be loaded into the canvas,\
				each image put in a layer.\
				Large images will be zoomed out."},
	{"id":"colorhelp2",
	 "text":"If you press SHIFT key, the canvas will shift to straw mode,\
				that is, to pick a color under the cursor.\
				In this mode, the cursor shapes like a symbol '+'.<br/><br/>\
				Left click to choose a color.\
				It will be recorded in the color picker.<br/><br/>\
				Also, press the Color button will fill the activated layer with color.<br/>\
				It's only a filling, so it can be erased or cleared.<br/><br/>\
				Programmed by Iraka Crow<br/>\
				As a PKU lesson project<br/>\
				(Chen Minghui, 1400012889)"},
	{"id":"layerhelp",
	 "text":"These are layers. ==><br/>\
	 			Click on the layer to set this layer activated.<br/><br/>\
	 			Click + button to add an empty layer in the front.<br/><br/>\
	 			Click on layer name to rename the layer.<br/>\
	 			Click on &times; to delete this layer,\
	 			notice that there must be at least 1 layer.<br/>\
	 			Click on &darr; to mix this layer to the layer below,\
	 			notice that only mixable when two layers are both visible.<br/><br/>\
				Click on the opacity percentage to show/hide the layer.<br/>\
				Scroll on it to change its opacity."},
	{"id":"layerhelp2",
	 "text":"If you press SHIFT key, the + button will show the blend mode\
	 			of the activated layer.<br/><br/>\
	 			Scroll on it to change the blend mode.\
	 			NORMAL, MULTIPLY & SCREEN modes are avaliable.<br/><br/>\
	 			Click on &#9650; to move this layer upwards.<br/>\
	 			Click on &#9660; to move this layer downwards.<br/><br/>\
	 			If you click on a layer with ALT key pressed,\
	 			the opacity of pixels in this layer will be protected.\
	 			Click again with ALT key pressed to unlock the protection."}
];

function initHelp(){
	var i;
	for(i in helpText){
		var item=document.getElementById(helpText[i].id);
		if(item)
			item.innerHTML=helpText[i].text;
	}
}

function showHelp(e){
	document.getElementById("mask").style.visibility="visible";
}

function hideHelp(e){
	document.getElementById("mask").style.visibility="hidden";
}
