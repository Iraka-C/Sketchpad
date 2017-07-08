/*
	Written By Iraka
	Layer management for Sketch platform
*/

var layerWidth; // width of layer area

var layerStack=new Array(); // a Stack for canvases;
var activeLayer; // now active layer

var leftGap; // Canvas Left Gap
var topGap; // Canvas Top Gap
var cvw;
var cvh;

//================ prototypes =======================

Array.prototype.indexOf=function(ele){
	for(var i in this){
		if(ele==this[i])
			return i;
	}
	return -1;
};

Array.prototype.remove=function(ele){
	var id=this.indexOf(ele);
	if(id>-1){
		this.splice(id,1);
	}
}

//================ functions =======================

function setPanelSize(){
	var dc=document.documentElement;
	cvw=dc.clientWidth-leftGap*3-layerWidth+20;
	//cvw=(cvw>300?cvw:300);
	cvh=dc.clientHeight-leftGap-topGap;
	//cvh=(cvh>200?cvh:200);

	/*for(var i in layerStack){
		setCanvasSize(layerStack[i].canvas);
	}*/
	setMouseLayerSize();
	document.getElementById("canvaspanel").style.width=cvw+"px";
	document.getElementById("layerpanel").style.left=dc.clientWidth-leftGap-layerWidth+10+"px";
	document.getElementById("newlayer").style.left=dc.clientWidth-leftGap-layerWidth+10+"px";
	document.getElementById("canvaspanel").style.height=cvh+"px";
	document.getElementById("layerpanel").style.height=cvh-70+"px"
	document.getElementById("layerscroll").style.height=cvh-70+"px";

	document.getElementById("sizeinfo").innerHTML="Canvas size:<br/>"+cvw+"*"+cvh;

	hideCursor();
	setBrushColor();
}

var uniID=0;

function LayerShell(){
	uniID++;

	var cv=document.createElement("canvas");
	cv.style.position="inherit";
	cv.style.visibility="visible";
	cv.style.zIndex=""+uniID;
	cv.style.pointerEvents="none";
	cv.width=screen.width;
	cv.height=screen.height;
	//cv.style.mixBlendMode="multiply";

	var icon=document.createElement("div");
	icon.style.position="relative";
	icon.style.width="100px";
	icon.style.height="60px";
	icon.style.margin="0px 20px 30px 20px";
	icon.style.backgroundColor="#e0e0e0";
	icon.style.boxShadow="0px 0px 20px #707070";
	//icon.onclick=function(event){setActiveLayer(this)}; // ??!

	var buttons=document.createElement("div");
	buttons.className="layerbutton";

	var close=document.createElement("p"); // close a layer
	close.innerHTML="&times;";
	close.style.position="relative";
	close.style.left="4px";
	buttons.appendChild(close);

	var vis=document.createElement("p"); // mix a layer with lower layer
	vis.innerHTML="&darr;";
	vis.style.position="relative";
	vis.style.left="4px";
	buttons.appendChild(vis);

	icon.appendChild(buttons);

	var opct=document.createElement("p");
	opct.innerHTML="100%";
	opct.className="opct";
	icon.appendChild(opct);

	var name="Layer "+uniID;
	var label=document.createElement("input");
	label.type="text";
	label.maxLength="24";
	label.size="10";
	label.value=name;
	icon.appendChild(label);

	this.canvas=cv;
	this.icon=icon;
	this.buttons=buttons;
	this.close=close;
	this.vis=vis;
	this.op=opct;
	this.opNum=100;
	this.name=name;
	this.blend=0; // Cover mode
	this.clip=0; // 0:Normal 1:Clipping mode
}

function Layer(){
	var layer=new LayerShell();
	layer.icon.onclick=function(e){
		if(e.altKey==1){
			switchLayerClip(layer);
		}
		else{
			setActiveLayer(layer);
		}
	};
	layer.close.onclick=function(e){
		if(ssm)
			layerUp(layer);
		else
			delLayer(layer);
		// prevent event bubble to setActiveLayer()
		var e=(e)?e:window.event; // is the browser based on IE kernel?
		if(window.event){
			e.cancelBubble=true;
		}
		else{
			e.stopPropagation();
		}
	};
	layer.vis.onclick=function(e){
		if(ssm)
			layerDown(layer);
		else{
			var id=layerStack.indexOf(layer);
			if(id>0&&layer.canvas.style.visibility=="visible"&&layerStack[id-1].canvas.style.visibility=="visible"){
				mixLayer(layer,layerStack[id-1]);
				setActiveLayer(layerStack[id-1]);
			}
		}
		var e=(e)?e:window.event; // is the browser based on IE kernel?
		if(window.event){
			e.cancelBubble=true;
		}
		else{
			e.stopPropagation();
		}
	};
	layer.op.onmousewheel=function(e){
		nowTime=new Date();
		var thisMouseTime=nowTime.getTime();
		if(thisMouseTime-lastMouseTime>250){ // After Vis activated
			changeOpacity(e,layer);
		}
		else{
			//return true; // bubble to Scroll
			changeOpacity(e,layer);
		}

		var e=(e)?e:window.event; // is the browser based on IE kernel?
		if(window.event){
			e.cancelBubble=true;
		}
		else{
			e.stopPropagation();
		}
		return false;
	}; // prevent event bubble to Scroll
	layer.op.onmouseover=function(e){layer.op.style.color="#0090e0";};
	layer.op.onmouseout=function(e){layer.op.style.color="#86c0e0";};
	layer.op.onclick=function(e){
		switchLayerVis(layer);
		var e=(e)?e:window.event; // is the browser based on IE kernel?
		if(window.event){
			e.cancelBubble=true;
		}
		else{
			e.stopPropagation();
		}
	}
	return layer;
}

function setActiveLayer(layer){
	activeLayer.icon.style.backgroundColor="#e0e0e0";
	layer.icon.style.backgroundColor="#ffffff";
	activeLayer=layer;
	c=layer.canvas;
	ctx=c.getContext("2d");
	setBrushColor();
	document.getElementById("blendmode").innerHTML="Blend Mode<br/>"+blendName[layer.blend];
}

function initLayerStack(){
	layerStack[0]=new Layer();
	layerStack[0].close.style.color="#e0e0e0";
	layerStack[0].vis.style.color="#e0e0e0";
	activeLayer=layerStack[0];
	c=layerStack[0].canvas;
	ctx=c.getContext("2d");
	document.getElementById("canvaspanel").appendChild(c);
	layerStack[0].icon.style.backgroundColor="#ffffff";
	document.getElementById("layers").appendChild(layerStack[0].icon);
}

function addLayer(){
	if(ssm)return; // only add when SHIFT unpressed
	if(layerStack.length>=99)return; // Max Layer Number
	var layer=new Layer();
	layerStack.push(layer);
	document.getElementById("canvaspanel").appendChild(layer.canvas);
	var layers=document.getElementById("layers");
	layers.insertBefore(layer.icon,layers.childNodes[0]); // insert before

	setActiveLayer(layer); // new layer Activate

	for(var i in layerStack)
		if(i!="remove"){
			layerStack[i].close.style.color="#000000";
		}
}

var swapItems=function(arr,index1,index2){
	arr[index1]=arr.splice(index2,1,arr[index1])[0];
	return arr;
};

function exchangeLayer(id1,id2){
	var tmpLayer=new Layer();
	var l1=layerStack[id1];
	var l2=layerStack[id2];

	//document.getElementById("debug").innerHTML="EX "+id1+" & "+id2;
	// exchange z-index
	var zid1=getDefaultStyle(l1.canvas,"z-index");
	var zid2=getDefaultStyle(l2.canvas,"z-index");
	l1.canvas.style.zIndex=zid2;
	l2.canvas.style.zIndex=zid1;

	// exchange in layerStack
	swapItems(layerStack,id1,id2);

	// exchange in canvas panel
	var cvp=document.getElementById("canvaspanel");
	cvp.replaceChild(tmpLayer.canvas,l1.canvas);
	cvp.replaceChild(l1.canvas,l2.canvas);
	cvp.replaceChild(l2.canvas,tmpLayer.canvas);

	// exchange in layer panel
	var lyp=document.getElementById("layers");
	lyp.replaceChild(tmpLayer.icon,l1.icon);
	lyp.replaceChild(l1.icon,l2.icon);
	lyp.replaceChild(l2.icon,tmpLayer.icon);
}

function layerUp(layer){
	var id=parseInt(layerStack.indexOf(layer)); // Why need parseInt() ?
	if(id<layerStack.length-1){
		exchangeLayer(id,id+1);
	}
}

function layerDown(layer){
	var id=parseInt(layerStack.indexOf(layer));
	if(id>0){
		exchangeLayer(id,id-1);
	}
}

function delLayer(layer){
	if(layerStack.length<=1)return;
	document.getElementById("layers").removeChild(layer.icon);
	document.getElementById("canvaspanel").removeChild(layer.canvas);

	layerStack.remove(layer);
	if(layer==activeLayer){
		for(var i=layerStack.length-1;i>=0;i--)
			if(i!="remove"){ // Why ?? prototype add a "remove" element in array.
				setActiveLayer(layerStack[i]);
				break;
			}
	}

	layer=null;

	layerStack[0].vis.style.color="#e0e0e0";
	if(layerStack.length<=1)
		for(var i in layerStack)
			if(i!="remove"){
				layerStack[i].close.style.color="#e0e0e0";
			}
}

function mixLayer(l1,l2){ // src des
	var srcCV=l1.canvas.getContext("2d");
	var srcData=srcCV.getImageData(0,0,c.width,c.height);
	var srcPix=srcData.data;

	var desCV=l2.canvas.getContext("2d");
	var desData=desCV.getImageData(0,0,c.width,c.height);
	var desPix=desData.data;

	var srcOpc=l1.opNum/100;
	var mode=l1.blend; // Blend mode
	for(var i=0;i<srcPix.length;i+=4){
		if(srcPix[i+3]>0){

			var pix1={r:desPix[i],g:desPix[i+1],b:desPix[i+2],a:desPix[i+3]/255};
			var pix2={r:srcPix[i],g:srcPix[i+1],b:srcPix[i+2],a:srcPix[i+3]/255*srcOpc};
			var pixRes=blendPixel(pix1,pix2,mode);

			desPix[i]=pixRes.r;
			desPix[i+1]=pixRes.g;
			desPix[i+2]=pixRes.b;
			desPix[i+3]=pixRes.a*255;
		}
	}
	desCV.putImageData(desData,0,0);
}

function exportPNG(e){
	var cv=document.createElement("canvas"); // canvas for mixing and output
	cv.width=screen.width;
	cv.height=screen.height;
	var cvtx=cv.getContext("2d");
	var outData=cvtx.getImageData(0,0,cvw,cvh);
	var outPix=outData.data;


	for(var i in layerStack){
		//document.getElementById("debug").innerHTML+="@"+i+":"+layerStack[i].name;
		if(i=="remove"){ // undefined
			continue;
		}
		if(layerStack[i].canvas.style.visibility=="hidden"){ // hidden layer
			continue;
		}
		var stackImgData=layerStack[i].canvas.getContext("2d").getImageData(0,0,cvw,cvh);
		var stackPix=stackImgData.data;
		var opcLayer=layerStack[i].opNum/100;
		var mode=layerStack[i].blend; // Blend mode
		for(var i=0;i<stackPix.length;i+=4){
			if(stackPix[i+3]>0){

				var pix1={r:outPix[i],g:outPix[i+1],b:outPix[i+2],a:outPix[i+3]/255};
				var pix2={r:stackPix[i],g:stackPix[i+1],b:stackPix[i+2],a:stackPix[i+3]/255*opcLayer};
				var pixRes=blendPixel(pix1,pix2,mode);

				outPix[i]=pixRes.r;
				outPix[i+1]=pixRes.g;
				outPix[i+2]=pixRes.b;
				outPix[i+3]=pixRes.a*255;

			}
		}
	}

	cvtx.putImageData(outData,0,0);

	var img=cv.toDataURL("image/png");
	var w=window.open('about:blank','');
	w.document.write("<img src='"+img+"' alt='' />");
	cv=null;
}
