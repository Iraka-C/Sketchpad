/*
	Written By Iraka
	Mathematical functions for Sketch platform
*/

function d3n(v){
	return (v<100?"0":"")+(v<10?"0":"")+v;
}

function rgb2hsv(trgb){
	var maxc=Math.max(trgb.r,trgb.g,trgb.b);
	var minc=Math.min(trgb.r,trgb.g,trgb.b);
	var thsv={h:0,s:0,v:0};
	thsv.v=Math.floor(maxc*100/255);
	if(maxc==minc){
		return thsv;
	}

	if(maxc==trgb.r)thsv.h=(trgb.g-trgb.b)/(maxc-minc);
	else if(maxc==trgb.g)thsv.h=2+(trgb.b-trgb.r)/(maxc-minc);
	else thsv.h=4+(trgb.r-trgb.g)/(maxc-minc);

	thsv.h*=60;
	if(thsv.h<0)thsv.h+=360;


	thsv.h=Math.floor(thsv.h);
	thsv.s=Math.floor((maxc-minc)/maxc*100);
	return thsv;
}

function hsv2rgb(thsv){
	var v=Math.floor(thsv.v*255/100);
	if(thsv.s==0){
		return {r:v,g:v,b:v};
	}
	var h=thsv.h/60;
	var s=thsv.s/100;

	var i=Math.floor(h);
	var f=h-i;
	var a=Math.floor(v*(1-s));
	var b=Math.floor(v*(1-s*f));
	var c=Math.floor(v*(1-s*(1-f)));

	switch(i){
	case 0:return {r:v,g:c,b:a};
	case 1:return {r:b,g:v,b:a};
	case 2:return {r:a,g:v,b:c};
	case 3:return {r:a,g:b,b:v};
	case 4:return {r:c,g:a,b:v};
	case 5:return {r:v,g:a,b:b};
	}

}

function blendPixel(pix1,pix2,mode){  // pix={r,g,b,a} pix2 on pix1, a in [0,1]
	var res={r:0,g:0,b:0,a:0};
	if(mode==0){ // NORMAL mode
		var opc=pix1.a+pix2.a-pix1.a*pix2.a;
		if(opc==0)return res;

		var p=pix2.a/opc,q=1-p;
		res.r=pix2.r*p+pix1.r*q;
		res.g=pix2.g*p+pix1.g*q;
		res.b=pix2.b*p+pix1.b*q;
		res.a=opc;

		return res;
	}
	if(mode==1){ // MULTIPLY mode

		var v2=(pix2.r+pix2.g+pix2.b)/3;
		var opc=pix1.a+(1-pix1.a)*pix2.a*(1-v2/255);
		if(opc==0)return res;

		var kr1=pix1.a*(1-pix1.r/255),kr2=pix2.a*(1-pix2.r/255);
		var kg1=pix1.a*(1-pix1.g/255),kg2=pix2.a*(1-pix2.g/255);
		var kb1=pix1.a*(1-pix1.b/255),kb2=pix2.a*(1-pix2.b/255);

		res.r=255*(1-(kr1+kr2-kr1*kr2)/opc);
		res.g=255*(1-(kg1+kg2-kg1*kg2)/opc);
		res.b=255*(1-(kb1+kb2-kb1*kb2)/opc);
		res.a=opc;

		return res;
	}
	if(mode==2){ // SCREEN mode

		var v2=(pix2.r+pix2.g+pix2.b)/3;
		var opc=pix1.a+(1-pix1.a)*pix2.a*(v2/255);
		if(opc==0)return res;

		var kr1=pix1.a*pix1.r/255,kr2=pix2.a*pix2.r/255;
		var kg1=pix1.a*pix1.g/255,kg2=pix2.a*pix2.g/255;
		var kb1=pix1.a*pix1.b/255,kb2=pix2.a*pix2.b/255;

		res.r=255*(kr1+kr2-kr1*kr2)/opc;
		res.g=255*(kg1+kg2-kg1*kg2)/opc;
		res.b=255*(kb1+kb2-kb1*kb2)/opc;
		res.a=opc;

		return res;
	}
}
