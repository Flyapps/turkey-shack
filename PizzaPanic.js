var $hxClasses = $hxClasses || {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var EReg = $hxClasses["EReg"] = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.b += Std.string(this.matchedLeft());
			buf.b += Std.string(f(this));
			s = this.matchedRight();
		}
		buf.b += Std.string(s);
		return buf.b;
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,r: null
	,__class__: EReg
}
var HxOverrides = $hxClasses["HxOverrides"] = function() { }
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntIter = $hxClasses["IntIter"] = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,max: null
	,min: null
	,__class__: IntIter
}
var List = $hxClasses["List"] = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += Std.string("{");
		while(l != null) {
			if(first) first = false; else s.b += Std.string(", ");
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,length: null
	,q: null
	,h: null
	,__class__: List
}
var Reflect = $hxClasses["Reflect"] = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var Std = $hxClasses["Std"] = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var StringBuf = $hxClasses["StringBuf"] = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = $hxClasses["StringTools"] = function() { }
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = $hxClasses["Type"] = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
var co = co || {}
if(!co.doubleduck) co.doubleduck = {}
co.doubleduck.BaseAssets = $hxClasses["co.doubleduck.BaseAssets"] = function() {
};
co.doubleduck.BaseAssets.__name__ = ["co","doubleduck","BaseAssets"];
co.doubleduck.BaseAssets.loader = function() {
	if(co.doubleduck.BaseAssets._loader == null) {
		co.doubleduck.BaseAssets._loader = new createjs.LoadQueue(true);
		co.doubleduck.BaseAssets._loader.installPlugin(createjs.LoadQueue.SOUND);
		co.doubleduck.BaseAssets._loader.onFileLoad = co.doubleduck.BaseAssets.handleFileLoaded;
		co.doubleduck.BaseAssets._loader.onError = co.doubleduck.BaseAssets.handleLoadError;
		co.doubleduck.BaseAssets._loader.setMaxConnections(10);
	}
	return co.doubleduck.BaseAssets._loader;
}
co.doubleduck.BaseAssets.loadAndCall = function(uri,callbackFunc) {
	co.doubleduck.BaseAssets.loader().loadFile(uri);
	co.doubleduck.BaseAssets._loadCallbacks[uri] = callbackFunc;
}
co.doubleduck.BaseAssets.finishLoading = function(manifest,sounds) {
	if(co.doubleduck.SoundManager.available) {
		var _g1 = 0, _g = sounds.length;
		while(_g1 < _g) {
			var currSound = _g1++;
			manifest.push(sounds[currSound] + co.doubleduck.SoundManager.EXTENSION);
			co.doubleduck.SoundManager.initSound(sounds[currSound]);
		}
	}
	if(co.doubleduck.BaseAssets._useLocalStorage) co.doubleduck.BaseAssets.loadFromLocalStorage(manifest);
	if(manifest.length == 0) {
		if(co.doubleduck.BaseAssets.onLoadAll != null) co.doubleduck.BaseAssets.onLoadAll();
	}
	co.doubleduck.BaseAssets.loader().onProgress = co.doubleduck.BaseAssets.handleProgress;
	co.doubleduck.BaseAssets.loader().onFileLoad = co.doubleduck.BaseAssets.manifestFileLoad;
	co.doubleduck.BaseAssets.loader().loadManifest(manifest);
	co.doubleduck.BaseAssets.loader().load();
}
co.doubleduck.BaseAssets.loadAll = function(manifest,sounds) {
	manifest[manifest.length] = "images/duckling/orientation_error_port.png";
	manifest[manifest.length] = "images/duckling/orientation_error_land.png";
	manifest[manifest.length] = "images/duckling/page_marker.png";
}
co.doubleduck.BaseAssets.audioLoaded = function(event) {
	co.doubleduck.BaseAssets._cacheData[event.item.src] = event;
}
co.doubleduck.BaseAssets.manifestFileLoad = function(event) {
	if(co.doubleduck.BaseAssets._useLocalStorage && event != null) {
		var utils = new ddjsutils();
		try {
			var fileName = event.item.src;
			if(HxOverrides.substr(fileName,fileName.length - 3,null) == "jpg") return;
			co.doubleduck.BasePersistence.setValue(event.item.src,utils.getBase64Image(event.result));
		} catch( err ) {
		}
	}
}
co.doubleduck.BaseAssets.loadFromLocalStorage = function(manifest) {
	var entriesToRemove = new Array();
	var _g1 = 0, _g = manifest.length;
	while(_g1 < _g) {
		var i = _g1++;
		var entry = manifest[i];
		var value = co.doubleduck.BasePersistence.getValue(entry);
		if(value != null) {
			var bmp = new createjs.Bitmap("data:image/png;base64," + value);
			co.doubleduck.BaseAssets._cacheData[entry] = bmp.image;
			entriesToRemove.push(manifest[i]);
		}
	}
	var _g1 = 0, _g = entriesToRemove.length;
	while(_g1 < _g) {
		var j = _g1++;
		HxOverrides.remove(manifest,entriesToRemove[j]);
	}
}
co.doubleduck.BaseAssets.handleProgress = function(event) {
	co.doubleduck.BaseAssets.loaded = event.loaded;
	if(event.loaded == event.total) {
		co.doubleduck.BaseAssets.loader().onProgress = null;
		co.doubleduck.BaseAssets.onLoadAll();
	}
}
co.doubleduck.BaseAssets.handleLoadError = function(event) {
}
co.doubleduck.BaseAssets.handleFileLoaded = function(event) {
	if(event != null) {
		co.doubleduck.BaseAssets._cacheData[event.item.src] = event.result;
		var callbackFunc = Reflect.field(co.doubleduck.BaseAssets._loadCallbacks,event.item.src);
		if(callbackFunc != null) callbackFunc();
	}
}
co.doubleduck.BaseAssets.getAsset = function(uri) {
	var cache = Reflect.field(co.doubleduck.BaseAssets._cacheData,uri);
	if(cache == null) {
		if(co.doubleduck.BaseAssets.loader().getResult(uri) != null) {
			cache = co.doubleduck.BaseAssets.loader().getResult(uri);
			co.doubleduck.BaseAssets._cacheData[uri] = cache;
		}
	}
	return cache;
}
co.doubleduck.BaseAssets.getRawImage = function(uri) {
	var cache = co.doubleduck.BaseAssets.getAsset(uri);
	if(cache == null) {
		var bmp = new createjs.Bitmap(uri);
		co.doubleduck.BaseAssets._cacheData[uri] = bmp.image;
		cache = bmp.image;
		null;
	}
	return cache;
}
co.doubleduck.BaseAssets.getImage = function(uri,mouseEnabled) {
	if(mouseEnabled == null) mouseEnabled = false;
	var result = new createjs.Bitmap(co.doubleduck.BaseAssets.getRawImage(uri));
	result.mouseEnabled = mouseEnabled;
	return result;
}
co.doubleduck.BaseAssets.prototype = {
	__class__: co.doubleduck.BaseAssets
}
co.doubleduck.Assets = $hxClasses["co.doubleduck.Assets"] = function() {
	co.doubleduck.BaseAssets.call(this);
};
co.doubleduck.Assets.__name__ = ["co","doubleduck","Assets"];
co.doubleduck.Assets.loadAll = function() {
	var manifest = new Array();
	var sounds = new Array();
	sounds.push("sound/buttonPress");
	sounds.push("sound/dough");
	sounds.push("sound/drink");
	sounds.push("sound/givePizza");
	sounds.push("sound/inTheOven");
	sounds.push("sound/outOfTheOven");
	sounds.push("sound/pizzPanic_theme");
	sounds.push("sound/topping1");
	sounds.push("sound/star1");
	sounds.push("sound/star2");
	sounds.push("sound/star3");
	sounds.push("sound/end_tune");
	sounds.push("sound/3starsTune");
	co.doubleduck.BaseAssets.loadAll(manifest,sounds);
	manifest.push("images/splash/bg.png");
	manifest.push("images/splash/tap_to_play.png");
	manifest.push("images/splash/pizza_1.png");
	manifest.push("images/splash/pizza_2.png");
	manifest.push("images/splash/pizza_3.png");
	manifest.push("images/splash/pizza_logo.png");
	manifest.push("images/splash/logo/green.png");
	manifest.push("images/splash/logo/red.png");
	manifest.push("images/splash/logo/mushroom.png");
	manifest.push("images/splash/logo/olive.png");
	manifest.push("images/splash/logo/olive_2.png");
	manifest.push("images/splash/logo/onion.png");
	manifest.push("images/splash/logo/pepperoni.png");
	manifest.push("images/splash/logo/pineapple.png");
	manifest.push("images/splash/logo/text_a.png");
	manifest.push("images/splash/logo/text_b.png");
	manifest.push("images/menu/bg.png");
	manifest.push("images/menu/arrow_left.png");
	manifest.push("images/menu/arrow_right.png");
	manifest.push("images/menu/level_icons.png");
	manifest.push("images/menu/sound.png");
	var _g = 0;
	while(_g < 10) {
		var i = _g++;
		manifest.push("images/menu/menu_font/" + i + ".png");
	}
	manifest.push("images/menu/help.png");
	manifest.push("images/menu/help/next.png");
	manifest.push("images/menu/help/got_it.png");
	manifest.push("images/menu/help/help_board.png");
	var _g = 1;
	while(_g < 7) {
		var i = _g++;
		manifest.push("images/menu/help/help" + i + ".png");
	}
	manifest.push("images/session/bg.jpg");
	manifest.push("images/session/desk/desk.png");
	manifest.push("images/session/desk/trash.png");
	manifest.push("images/session/desk/toppings/dough.png");
	manifest.push("images/session/desk/toppings/empty.png");
	manifest.push("images/session/desk/toppings/ananas.png");
	manifest.push("images/session/desk/toppings/olives.png");
	manifest.push("images/session/desk/toppings/mushrooms.png");
	manifest.push("images/session/desk/toppings/pepperoni.png");
	manifest.push("images/session/desk/toppings/onion.png");
	manifest.push("images/session/desk/drink1.png");
	manifest.push("images/session/desk/drink2.png");
	manifest.push("images/session/desk/drink3.png");
	manifest.push("images/session/desk/desk_pizza/pizza_dough.png");
	manifest.push("images/session/desk/desk_pizza/burnt.png");
	manifest.push("images/session/desk/desk_pizza/pizza_ready.png");
	manifest.push("images/session/desk/desk_pizza/medium.png");
	manifest.push("images/session/desk/desk_pizza/sauce.png");
	manifest.push("images/session/desk/desk_pizza/cheese.png");
	manifest.push("images/session/desk/desk_pizza/mushroom.png");
	manifest.push("images/session/desk/desk_pizza/olives.png");
	manifest.push("images/session/desk/desk_pizza/onion.png");
	manifest.push("images/session/desk/desk_pizza/pepperoni.png");
	manifest.push("images/session/desk/desk_pizza/pineapple.png");
	manifest.push("images/session/oven/oven.png");
	manifest.push("images/session/oven/oven_pizza.png");
	manifest.push("images/session/oven/oven_toppings.png");
	manifest.push("images/session/oven/slot.png");
	manifest.push("images/session/oven/bar1.png");
	manifest.push("images/session/oven/bar2.png");
	manifest.push("images/session/oven/bar3.png");
	manifest.push("images/session/oven/oven_pizza/4.png");
	manifest.push("images/session/customers/girl.png");
	manifest.push("images/session/customers/man1.png");
	manifest.push("images/session/customers/man2.png");
	manifest.push("images/session/customers/woman1.png");
	manifest.push("images/session/customers/woman2.png");
	manifest.push("images/session/customers/japanese.png");
	manifest.push("images/session/customers/old_man.png");
	manifest.push("images/session/customers/bubbles/bubble1.png");
	manifest.push("images/session/customers/bubbles/bubble2.png");
	manifest.push("images/session/customers/bubbles/drink1.png");
	manifest.push("images/session/customers/bubbles/drink2.png");
	manifest.push("images/session/customers/bubbles/drink3.png");
	manifest.push("images/session/customers/bubbles/toppings.png");
	manifest.push("images/session/UI/bar.png");
	manifest.push("images/session/UI/bar2.png");
	manifest.push("images/session/UI/money.png");
	manifest.push("images/session/UI/pause.png");
	manifest.push("images/session/UI/pause_sign.png");
	manifest.push("images/session/UI/star1.png");
	manifest.push("images/session/UI/star2.png");
	manifest.push("images/session/UI/timer_font/0.png");
	manifest.push("images/session/UI/timer_font/1.png");
	manifest.push("images/session/UI/timer_font/2.png");
	manifest.push("images/session/UI/timer_font/3.png");
	manifest.push("images/session/UI/timer_font/4.png");
	manifest.push("images/session/UI/timer_font/5.png");
	manifest.push("images/session/UI/timer_font/6.png");
	manifest.push("images/session/UI/timer_font/7.png");
	manifest.push("images/session/UI/timer_font/8.png");
	manifest.push("images/session/UI/timer_font/9.png");
	manifest.push("images/session/UI/timer_font/comma.png");
	manifest.push("images/session/UI/timer_font/dollar.png");
	manifest.push("images/session/UI/money_font/0.png");
	manifest.push("images/session/UI/money_font/1.png");
	manifest.push("images/session/UI/money_font/2.png");
	manifest.push("images/session/UI/money_font/3.png");
	manifest.push("images/session/UI/money_font/4.png");
	manifest.push("images/session/UI/money_font/5.png");
	manifest.push("images/session/UI/money_font/6.png");
	manifest.push("images/session/UI/money_font/7.png");
	manifest.push("images/session/UI/money_font/8.png");
	manifest.push("images/session/UI/money_font/9.png");
	manifest.push("images/session/UI/money_font/comma.png");
	manifest.push("images/session/UI/money_font/dollar.png");
	manifest.push("images/session/end_screen/end_screen.png");
	manifest.push("images/session/end_screen/lose.png");
	manifest.push("images/session/end_screen/menu.png");
	manifest.push("images/session/end_screen/next.png");
	manifest.push("images/session/end_screen/rainbow.png");
	manifest.push("images/session/end_screen/restart.png");
	manifest.push("images/session/end_screen/star1.png");
	manifest.push("images/session/end_screen/star2.png");
	manifest.push("images/session/end_screen/star3.png");
	manifest.push("images/general/game_won.png");
	manifest.push("images/general/back_to_menu.png");
	co.doubleduck.BaseAssets.finishLoading(manifest,sounds);
}
co.doubleduck.Assets.__super__ = co.doubleduck.BaseAssets;
co.doubleduck.Assets.prototype = $extend(co.doubleduck.BaseAssets.prototype,{
	__class__: co.doubleduck.Assets
});
co.doubleduck.BaseGame = $hxClasses["co.doubleduck.BaseGame"] = function(stage) {
	this._waitingToStart = false;
	this._orientError = null;
	this._prevWinSize = new createjs.Rectangle(0,0,1,1);
	if(this._wantLandscape) {
		co.doubleduck.BaseGame.MAX_HEIGHT = 427;
		co.doubleduck.BaseGame.MAX_WIDTH = 915;
	} else {
		co.doubleduck.BaseGame.MAX_HEIGHT = 760;
		co.doubleduck.BaseGame.MAX_WIDTH = 427;
	}
	if(co.doubleduck.BaseGame.DEBUG) co.doubleduck.BasePersistence.clearAll();
	var isGS3Stock = /Android 4.0.4/.test(navigator.userAgent);
	isGS3Stock = isGS3Stock && /GT-I9300/.test(navigator.userAgent);
	isGS3Stock = isGS3Stock && !/Chrome/.test(navigator.userAgent);
	if(isGS3Stock) {
		var loc = window.location.href;
		if(loc.lastIndexOf("index.html") != -1) loc = HxOverrides.substr(loc,0,loc.lastIndexOf("index.html"));
		loc += "error.html";
		window.location.href=loc;
		return;
	}
	co.doubleduck.Persistence.initGameData();
	co.doubleduck.BaseGame._stage = stage;
	co.doubleduck.BaseGame._stage.onTick = $bind(this,this.handleStageTick);
	co.doubleduck.BaseGame._viewport = new createjs.Rectangle(0,0,1,1);
	co.doubleduck.BaseGame.hammer = new Hammer(js.Lib.document.getElementById("stageCanvas"));
	viewporter.preventPageScroll = true;
	viewporter.change($bind(this,this.handleViewportChanged));
	if(viewporter.ACTIVE) {
		viewporter.preventPageScroll = true;
		viewporter.change($bind(this,this.handleViewportChanged));
		if(this._wantLandscape != viewporter.isLandscape()) {
			if(this._wantLandscape) co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.ORIENT_LAND_URI,$bind(this,this.waitForOrientation)); else co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.ORIENT_PORT_URI,$bind(this,this.waitForOrientation));
		} else co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOGO_URI,$bind(this,this.loadBarFill));
	} else co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOGO_URI,$bind(this,this.loadBarFill));
};
co.doubleduck.BaseGame.__name__ = ["co","doubleduck","BaseGame"];
co.doubleduck.BaseGame._stage = null;
co.doubleduck.BaseGame.MAX_HEIGHT = null;
co.doubleduck.BaseGame.MAX_WIDTH = null;
co.doubleduck.BaseGame.hammer = null;
co.doubleduck.BaseGame.getViewport = function() {
	return co.doubleduck.BaseGame._viewport;
}
co.doubleduck.BaseGame.getScale = function() {
	return co.doubleduck.BaseGame._scale;
}
co.doubleduck.BaseGame.getStage = function() {
	return co.doubleduck.BaseGame._stage;
}
co.doubleduck.BaseGame.prototype = {
	setScale: function() {
		var fixedVal = co.doubleduck.BaseGame._viewport.width;
		var varVal = co.doubleduck.BaseGame._viewport.height;
		var idealFixed = co.doubleduck.BaseGame.MAX_WIDTH;
		var idealVar = co.doubleduck.BaseGame.MAX_HEIGHT;
		if(this._wantLandscape) {
			fixedVal = co.doubleduck.BaseGame._viewport.height;
			varVal = co.doubleduck.BaseGame._viewport.width;
			idealFixed = co.doubleduck.BaseGame.MAX_HEIGHT;
			idealVar = co.doubleduck.BaseGame.MAX_WIDTH;
		}
		var regScale = varVal / idealVar;
		if(fixedVal >= varVal) co.doubleduck.BaseGame._scale = regScale; else if(idealFixed * regScale < fixedVal) co.doubleduck.BaseGame._scale = fixedVal / idealFixed; else co.doubleduck.BaseGame._scale = regScale;
	}
	,handleViewportChanged: function() {
		if(this._wantLandscape != viewporter.isLandscape()) {
			if(this._orientError == null) {
				var err = co.doubleduck.BaseGame.ORIENT_PORT_URI;
				if(this._wantLandscape) err = co.doubleduck.BaseGame.ORIENT_LAND_URI;
				this._orientError = co.doubleduck.BaseAssets.getImage(err);
				this._orientError.regX = this._orientError.image.width / 2;
				this._orientError.regY = this._orientError.image.height / 2;
				this._orientError.x = co.doubleduck.BaseGame._viewport.height / 2;
				this._orientError.y = co.doubleduck.BaseGame._viewport.width / 2;
				co.doubleduck.BaseGame._stage.addChildAt(this._orientError,co.doubleduck.BaseGame._stage.getNumChildren());
				co.doubleduck.BaseGame._stage.update();
			}
		} else if(this._orientError != null) {
			co.doubleduck.BaseGame._stage.removeChild(this._orientError);
			this._orientError = null;
			if(createjs.Ticker.getPaused()) co.doubleduck.BaseGame._stage.update();
			if(this._waitingToStart) {
				this._waitingToStart = false;
				co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOGO_URI,$bind(this,this.loadBarFill));
			}
		}
	}
	,focused: function() {
		co.doubleduck.SoundManager.unmute();
	}
	,blured: function(e) {
		co.doubleduck.SoundManager.mute();
	}
	,handleResize: function(e) {
		var isFirefox = /Firefox/.test(navigator.userAgent);
		var isAndroid = /Android/.test(navigator.userAgent);
		var screenW = js.Lib.window.innerWidth;
		var screenH = js.Lib.window.innerHeight;
		co.doubleduck.BaseGame._stage.canvas.width = screenW;
		co.doubleduck.BaseGame._stage.canvas.height = screenH;
		var shouldResize = this._wantLandscape == viewporter.isLandscape() || !viewporter.ACTIVE;
		if(shouldResize) {
			if(isFirefox) {
				screenH = Math.floor(co.doubleduck.Main.getFFHeight());
				var ffEstimate = Math.ceil((js.Lib.window.screen.height - 110) * (screenW / js.Lib.window.screen.width));
				if(!isAndroid) ffEstimate = Math.ceil((js.Lib.window.screen.height - 30) * (screenW / js.Lib.window.screen.width));
				if(ffEstimate < screenH) screenH = Math.floor(ffEstimate);
			}
			var wrongSize = screenH < screenW;
			if(this._wantLandscape) wrongSize = screenH > screenW;
			if(!viewporter.ACTIVE || !wrongSize) {
				co.doubleduck.BaseGame._viewport.width = screenW;
				co.doubleduck.BaseGame._viewport.height = screenH;
				this.setScale();
			}
			if(this._orientError != null && isFirefox) this.handleViewportChanged();
		} else if(isFirefox) this.handleViewportChanged();
		if(createjs.Ticker.getPaused()) co.doubleduck.BaseGame._stage.update();
	}
	,handleBackToMenu: function() {
		this._session.destroy();
		co.doubleduck.BaseGame._stage.removeChild(this._session);
		this._session = null;
		this._menu = new co.doubleduck.Menu();
		co.doubleduck.BaseGame._stage.addChildAt(this._menu,0);
		this._menu.onPlayClick = $bind(this,this.handlePlayClick);
	}
	,handleRestart: function(properties) {
		this._session.destroy();
		co.doubleduck.BaseGame._stage.removeChild(this._session);
		this._session = null;
		this.startSession(properties);
	}
	,handleSessionEnd: function() {
	}
	,handlePlayClick: function(properties) {
		co.doubleduck.BaseGame._stage.removeChild(this._menu);
		this.startSession(properties);
		this._menu.destroy();
		this._menu = null;
	}
	,startSession: function(properties) {
		this._session = new co.doubleduck.Session(properties);
		this._session.onBackToMenu = $bind(this,this.handleBackToMenu);
		this._session.onRestart = $bind(this,this.handleRestart);
		this._session.onSessionEnd = $bind(this,this.handleSessionEnd);
		co.doubleduck.BaseGame._stage.addChild(this._session);
	}
	,showMenu: function() {
		this._menu = new co.doubleduck.Menu();
		co.doubleduck.BaseGame._stage.addChildAt(this._menu,0);
		this._menu.onPlayClick = $bind(this,this.handlePlayClick);
	}
	,alphaFade: function(fadeElement) {
		if(fadeElement != null && js.Boot.__instanceof(fadeElement,createjs.Bitmap)) this._fadedText = fadeElement; else if(this._fadedText == null) return;
		if(this._fadedText.alpha == 0) createjs.Tween.get(this._fadedText).to({ alpha : 1},750).call($bind(this,this.alphaFade)); else if(this._fadedText.alpha == 1) createjs.Tween.get(this._fadedText).to({ alpha : 0},1500).call($bind(this,this.alphaFade));
	}
	,showGameSplash: function() {
	}
	,splashEnded: function() {
		js.Lib.document.body.bgColor = "#000000";
		co.doubleduck.BaseGame._stage.removeChild(this._splash);
		this._splash = null;
		js.Lib.window.onresize = $bind(this,this.handleResize);
		this.handleResize(null);
		this.showGameSplash();
	}
	,handleDoneLoading: function() {
		createjs.Tween.get(this._splash).wait(200).to({ alpha : 0},800).call($bind(this,this.splashEnded));
		co.doubleduck.BaseGame._stage.removeChild(this._loadingBar);
		co.doubleduck.BaseGame._stage.removeChild(this._loadingStroke);
	}
	,updateLoading: function() {
		if(co.doubleduck.BaseAssets.loaded != 1) {
			this._loadingBar.visible = true;
			var percent = co.doubleduck.BaseAssets.loaded;
			var barMask = new createjs.Shape();
			barMask.graphics.beginFill("#00000000");
			barMask.graphics.drawRect(this._loadingBar.x - this._loadingBar.image.width / 2,this._loadingBar.y,this._loadingBar.image.width * percent | 0,this._loadingBar.image.height);
			barMask.graphics.endFill();
			this._loadingBar.mask = barMask;
			co.doubleduck.Utils.waitAndCall(this,10,$bind(this,this.updateLoading));
		}
	}
	,exitFocus: function() {
		var hidden = document.mozHidden;
		if(hidden) co.doubleduck.SoundManager.mute(false); else if(!co.doubleduck.SoundManager.getPersistedMute()) co.doubleduck.SoundManager.unmute(false);
	}
	,showSplash: function() {
		if(viewporter.ACTIVE) js.Lib.document.body.bgColor = "#00A99D"; else js.Lib.document.body.bgColor = "#D94D00";
		this._splash = co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.LOGO_URI);
		this._splash.regX = this._splash.image.width / 2;
		this._splash.x = js.Lib.window.innerWidth / 2;
		if(this._wantLandscape) this._splash.y = 20; else this._splash.y = 90;
		co.doubleduck.BaseGame._stage.addChild(this._splash);
		this._loadingStroke = co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.LOAD_STROKE_URI);
		this._loadingStroke.regX = this._loadingStroke.image.width / 2;
		co.doubleduck.BaseGame._stage.addChildAt(this._loadingStroke,0);
		this._loadingBar = co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.LOAD_FILL_URI);
		this._loadingBar.regX = this._loadingBar.image.width / 2;
		co.doubleduck.BaseGame._stage.addChildAt(this._loadingBar,1);
		this._loadingBar.x = js.Lib.window.innerWidth / 2;
		this._loadingBar.y = this._splash.y + 192;
		this._loadingStroke.x = this._loadingBar.x;
		this._loadingStroke.y = this._loadingBar.y;
		this._loadingBar.visible = false;
		this.updateLoading();
		co.doubleduck.BaseGame._stage.canvas.width = js.Lib.window.innerWidth;
		co.doubleduck.BaseGame._stage.canvas.height = js.Lib.window.innerHeight;
		co.doubleduck.BaseAssets.onLoadAll = $bind(this,this.handleDoneLoading);
		co.doubleduck.Assets.loadAll();
		document.addEventListener('mozvisibilitychange', this.exitFocus);
	}
	,waitForOrientation: function() {
		this._waitingToStart = true;
		if(this._orientError == null) {
			this._orientError = this.getErrorImage();
			this._orientError.regX = this._orientError.image.width / 2;
			this._orientError.regY = this._orientError.image.height / 2;
			this._orientError.x = js.Lib.window.innerWidth / 2;
			this._orientError.y = js.Lib.window.innerHeight / 2;
			co.doubleduck.BaseGame._stage.addChildAt(this._orientError,co.doubleduck.BaseGame._stage.getNumChildren());
		}
	}
	,getErrorImage: function() {
		if(this._wantLandscape) return co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.ORIENT_LAND_URI); else return co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.ORIENT_PORT_URI);
	}
	,loadBarStroke: function() {
		co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOAD_STROKE_URI,$bind(this,this.showSplash));
	}
	,loadBarFill: function() {
		co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOAD_FILL_URI,$bind(this,this.loadBarStroke));
	}
	,handleStageTick: function() {
		if(js.Lib.window.innerWidth != this._prevWinSize.width || js.Lib.window.innerHeight != this._prevWinSize.height) {
			this._prevWinSize.width = js.Lib.window.innerWidth;
			this._prevWinSize.height = js.Lib.window.innerHeight;
			this.handleResize(null);
		}
	}
	,_prevWinSize: null
	,_fadedText: null
	,_loadingStroke: null
	,_loadingBar: null
	,_waitingToStart: null
	,_orientError: null
	,_wantLandscape: null
	,_session: null
	,_menu: null
	,_splash: null
	,__class__: co.doubleduck.BaseGame
}
co.doubleduck.BaseMenu = $hxClasses["co.doubleduck.BaseMenu"] = function() {
	createjs.Container.call(this);
};
co.doubleduck.BaseMenu.__name__ = ["co","doubleduck","BaseMenu"];
co.doubleduck.BaseMenu.__super__ = createjs.Container;
co.doubleduck.BaseMenu.prototype = $extend(createjs.Container.prototype,{
	destroy: function() {
		this.onPlayClick = null;
	}
	,onPlayClick: null
	,__class__: co.doubleduck.BaseMenu
});
co.doubleduck.BasePersistence = $hxClasses["co.doubleduck.BasePersistence"] = function() { }
co.doubleduck.BasePersistence.__name__ = ["co","doubleduck","BasePersistence"];
co.doubleduck.BasePersistence.localStorageSupported = function() {
	var result = null;
	try {
		localStorage.setItem("test","test");
		localStorage.removeItem("test");
		result = true;
	} catch( e ) {
		result = false;
	}
	return result;
}
co.doubleduck.BasePersistence.getValue = function(key) {
	if(!co.doubleduck.BasePersistence.available) return "0";
	var val = localStorage[co.doubleduck.BasePersistence.GAME_PREFIX + key];
	return val;
}
co.doubleduck.BasePersistence.setValue = function(key,value) {
	if(!co.doubleduck.BasePersistence.available) return;
	localStorage[co.doubleduck.BasePersistence.GAME_PREFIX + key] = value;
}
co.doubleduck.BasePersistence.clearAll = function() {
	if(!co.doubleduck.BasePersistence.available) return;
	localStorage.clear();
}
co.doubleduck.BasePersistence.initVar = function(initedVar,defaultVal) {
	if(defaultVal == null) defaultVal = "0";
	var value = co.doubleduck.BasePersistence.getValue(initedVar);
	if(value == null) try {
		co.doubleduck.BasePersistence.setValue(initedVar,defaultVal);
	} catch( e ) {
		co.doubleduck.BasePersistence.available = false;
	}
}
co.doubleduck.BasePersistence.getDynamicValue = function(key) {
	if(!co.doubleduck.BasePersistence.available) return { };
	var val = localStorage[co.doubleduck.BasePersistence.GAME_PREFIX + key];
	return val;
}
co.doubleduck.BasePersistence.setDynamicValue = function(key,value) {
	if(!co.doubleduck.BasePersistence.available) return;
	localStorage[co.doubleduck.BasePersistence.GAME_PREFIX + key] = value;
}
co.doubleduck.BasePersistence.initDynamicVar = function(initedVar,defaultVal) {
	var value = co.doubleduck.BasePersistence.getDynamicValue(initedVar);
	if(value == null) try {
		co.doubleduck.BasePersistence.setDynamicValue(initedVar,defaultVal);
	} catch( e ) {
		co.doubleduck.BasePersistence.available = false;
	}
}
co.doubleduck.BasePersistence.printAll = function() {
	var ls = localStorage;
	var localStorageLength = ls.length;
	var _g = 0;
	while(_g < localStorageLength) {
		var entry = _g++;
		null;
	}
}
co.doubleduck.BaseSession = $hxClasses["co.doubleduck.BaseSession"] = function() {
	createjs.Container.call(this);
};
co.doubleduck.BaseSession.__name__ = ["co","doubleduck","BaseSession"];
co.doubleduck.BaseSession.__super__ = createjs.Container;
co.doubleduck.BaseSession.prototype = $extend(createjs.Container.prototype,{
	destroy: function() {
		createjs.Ticker.removeListener(this);
		this.onRestart = null;
		this.onBackToMenu = null;
		this.onSessionEnd = null;
		this.onNextLevel = null;
	}
	,sessionEnded: function() {
		if(this.onSessionEnd != null) {
			createjs.Ticker.setPaused(false);
			this.onSessionEnd();
		}
	}
	,handleReplayClick: function(properties) {
		if(this.onRestart != null) {
			createjs.Ticker.setPaused(false);
			this.onRestart(properties);
		}
	}
	,handleMenuClick: function() {
		if(this.onBackToMenu != null) {
			createjs.Ticker.setPaused(false);
			this.onBackToMenu();
		}
	}
	,_replayBtn: null
	,_menuBtn: null
	,onNextLevel: null
	,onBackToMenu: null
	,onSessionEnd: null
	,onRestart: null
	,__class__: co.doubleduck.BaseSession
});
co.doubleduck.PizzaStatus = $hxClasses["co.doubleduck.PizzaStatus"] = { __ename__ : ["co","doubleduck","PizzaStatus"], __constructs__ : ["RAW","HALF_COOKED","COOKED","BURNT"] }
co.doubleduck.PizzaStatus.RAW = ["RAW",0];
co.doubleduck.PizzaStatus.RAW.toString = $estr;
co.doubleduck.PizzaStatus.RAW.__enum__ = co.doubleduck.PizzaStatus;
co.doubleduck.PizzaStatus.HALF_COOKED = ["HALF_COOKED",1];
co.doubleduck.PizzaStatus.HALF_COOKED.toString = $estr;
co.doubleduck.PizzaStatus.HALF_COOKED.__enum__ = co.doubleduck.PizzaStatus;
co.doubleduck.PizzaStatus.COOKED = ["COOKED",2];
co.doubleduck.PizzaStatus.COOKED.toString = $estr;
co.doubleduck.PizzaStatus.COOKED.__enum__ = co.doubleduck.PizzaStatus;
co.doubleduck.PizzaStatus.BURNT = ["BURNT",3];
co.doubleduck.PizzaStatus.BURNT.toString = $estr;
co.doubleduck.PizzaStatus.BURNT.__enum__ = co.doubleduck.PizzaStatus;
co.doubleduck.BigPizza = $hxClasses["co.doubleduck.BigPizza"] = function(status,initToppings,tweenBase) {
	if(tweenBase == null) tweenBase = false;
	if(status == null) status = co.doubleduck.BigPizza.DEFAULT_STATUS;
	createjs.Container.call(this);
	var doughUri = "";
	switch( (status)[1] ) {
	case 0:
		doughUri = "images/session/desk/desk_pizza/pizza_dough.png";
		break;
	case 1:
		doughUri = "images/session/desk/desk_pizza/medium.png";
		break;
	case 2:
		doughUri = "images/session/desk/desk_pizza/pizza_ready.png";
		break;
	case 3:
		doughUri = "images/session/desk/desk_pizza/burnt.png";
		break;
	default:
	}
	this._dough = co.doubleduck.BaseAssets.getImage(doughUri);
	this.addChild(this._dough);
	if(status == co.doubleduck.PizzaStatus.RAW) this.addBase(tweenBase);
	if(initToppings != null && status != co.doubleduck.PizzaStatus.BURNT) {
		var _g = 0;
		while(_g < initToppings.length) {
			var currTopping = initToppings[_g];
			++_g;
			this.addTopping(currTopping,false);
		}
	}
};
co.doubleduck.BigPizza.__name__ = ["co","doubleduck","BigPizza"];
co.doubleduck.BigPizza.__super__ = createjs.Container;
co.doubleduck.BigPizza.prototype = $extend(createjs.Container.prototype,{
	addTopping: function(topping,tween) {
		if(tween == null) tween = true;
		var topping1 = co.doubleduck.BaseAssets.getImage(co.doubleduck.Topping.getPizzaIconUri(topping));
		this.addChild(topping1);
		if(tween) {
			topping1.alpha = 0;
			createjs.Tween.get(topping1).to({ alpha : 1},200);
		}
	}
	,addBase: function(tween) {
		if(tween == null) tween = true;
		var sauce = co.doubleduck.BaseAssets.getImage("images/session/desk/desk_pizza/sauce.png");
		if(tween) {
			sauce.alpha = 0;
			createjs.Tween.get(sauce).to({ alpha : 1},300);
		}
		this.addChild(sauce);
		var cheese = co.doubleduck.BaseAssets.getImage("images/session/desk/desk_pizza/cheese.png");
		if(tween) {
			cheese.alpha = 0;
			createjs.Tween.get(cheese).wait(300).to({ alpha : 1},350);
		}
		this.addChild(cheese);
	}
	,_toppingGraphics: null
	,_dough: null
	,__class__: co.doubleduck.BigPizza
});
co.doubleduck.LabeledContainer = $hxClasses["co.doubleduck.LabeledContainer"] = function(bmp) {
	createjs.Container.call(this);
	this._bitmap = bmp;
	if(this._bitmap != null) {
		if(js.Boot.__instanceof(this._bitmap,createjs.Bitmap)) {
			this._bmp = this._bitmap;
			this.image = this._bmp.image;
		} else if(js.Boot.__instanceof(this._bitmap,createjs.BitmapAnimation)) {
			this.anim = this._bitmap;
			this.image = { width : this.anim.spriteSheet._frameWidth, height : this.anim.spriteSheet._frameHeight};
		}
	}
};
co.doubleduck.LabeledContainer.__name__ = ["co","doubleduck","LabeledContainer"];
co.doubleduck.LabeledContainer.__super__ = createjs.Container;
co.doubleduck.LabeledContainer.prototype = $extend(createjs.Container.prototype,{
	getLabel: function() {
		return this._label;
	}
	,addBitmap: function() {
		this.addChild(this._bitmap);
	}
	,addCenteredBitmap: function() {
		this._bitmap.regX = this.image.width / 2;
		this._bitmap.regY = this.image.height / 2;
		this._bitmap.x = this.image.width / 2;
		this._bitmap.y = this.image.height / 2;
		this.addChild(this._bitmap);
	}
	,addBitmapLabel: function(label,fontType,padding,centered) {
		if(centered == null) centered = true;
		if(padding == null) padding = 0;
		if(fontType == null) fontType = "";
		if(this._bitmapText != null) this.removeChild(this._bitmapText);
		var fontHelper = new co.doubleduck.FontHelper(fontType);
		this._bitmapText = fontHelper.getNumber(Std.parseInt(label),1,true,null,padding,centered);
		if(this.image != null) {
			this._bitmapText.x = this.image.width / 2;
			this._bitmapText.y = this.image.height / 2;
		}
		this._label = label;
		this.addChild(this._bitmapText);
	}
	,scaleBitmapFont: function(scale) {
		this._bitmapText.scaleX = this._bitmapText.scaleY = scale;
	}
	,shiftLabel: function(shiftX,shiftY) {
		this._bitmapText.x *= shiftX;
		this._bitmapText.y *= shiftY;
	}
	,setBitmapLabelY: function(ly) {
		this._bitmapText.y = ly;
	}
	,setBitmapLabelX: function(lx) {
		this._bitmapText.x = lx;
	}
	,getBitmapLabelWidth: function() {
		var maxWidth = 0;
		var _g1 = 0, _g = this._bitmapText.getNumChildren();
		while(_g1 < _g) {
			var digit = _g1++;
			var currentDigit = js.Boot.__cast(this._bitmapText.getChildAt(digit) , createjs.Bitmap);
			var endsAt = currentDigit.x + currentDigit.image.width;
			if(endsAt > maxWidth) maxWidth = endsAt;
		}
		return maxWidth;
	}
	,setLabelY: function(ly) {
		this._text.y = ly;
	}
	,setLabelX: function(lx) {
		this._text.x = lx;
	}
	,addLabel: function(label,color) {
		if(color == null) color = "#000000";
		if(this._text != null) this.removeChild(this._text);
		this._label = label;
		this._text = new createjs.Text(label,"bold 22px Arial",color);
		this._text.regY = this._text.getMeasuredHeight() / 2;
		this._text.textAlign = "center";
		if(this._bitmap != null) {
			this._text.x = this._bitmap.x;
			this._text.y = this._bitmap.y;
		}
		this.addChild(this._text);
	}
	,changeText: function(txt) {
	}
	,_bitmapText: null
	,_text: null
	,_bmp: null
	,_bitmap: null
	,_label: null
	,anim: null
	,image: null
	,__class__: co.doubleduck.LabeledContainer
});
co.doubleduck.Button = $hxClasses["co.doubleduck.Button"] = function(bmp,pauseAffected,clickType,clickSound) {
	if(clickType == null) clickType = 2;
	if(pauseAffected == null) pauseAffected = true;
	this._lastClickTime = 0;
	co.doubleduck.LabeledContainer.call(this,bmp);
	if(clickSound == null && co.doubleduck.Button._defaultSound != null) this._clickSound = co.doubleduck.Button._defaultSound; else this._clickSound = clickSound;
	this._bitmap.mouseEnabled = true;
	this._clickType = clickType;
	this._pauseAffected = pauseAffected;
	if(clickType == co.doubleduck.Button.CLICK_TYPE_TOGGLE) {
		var initObject = { };
		var size = this.image.width / 2;
		initObject.images = [this.image];
		initObject.frames = { width : size, height : this.image.height, regX : size / 2, regY : this.image.height / 2};
		this._states = new createjs.BitmapAnimation(new createjs.SpriteSheet(initObject));
		this._states.gotoAndStop(0);
		this.onClick = $bind(this,this.handleToggle);
		this.addChild(this._states);
	} else this.addCenteredBitmap();
	this.onPress = $bind(this,this.handlePress);
};
co.doubleduck.Button.__name__ = ["co","doubleduck","Button"];
co.doubleduck.Button.setDefaultSound = function(sound) {
	co.doubleduck.Button._defaultSound = sound;
}
co.doubleduck.Button.__super__ = co.doubleduck.LabeledContainer;
co.doubleduck.Button.prototype = $extend(co.doubleduck.LabeledContainer.prototype,{
	handleEndPressTint: function() {
		co.doubleduck.Utils.tintBitmap(this._bmp,1,1,1,1);
		if(createjs.Ticker.getPaused()) co.doubleduck.BaseGame.getStage().update();
	}
	,setToggle: function(flag) {
		if(flag) this._states.gotoAndStop(0); else this._states.gotoAndStop(1);
	}
	,handleToggle: function(e) {
		if(this.onToggle == null) return;
		if(this._lastClickPos == null) this._lastClickPos = new createjs.Point(0,0);
		if((this._lastClickPos.x < e.stageX + 1 || this._lastClickPos.x > e.stageX + 1) && (this._lastClickPos.y < e.stageY + 1 || this._lastClickPos.y > e.stageY + 1)) {
			var now = createjs.Ticker.getTime(true);
			if(now < this._lastClickTime + 500) return;
		}
		this._lastClickPos.x = e.stageX;
		this._lastClickPos.y = e.stageY;
		this._lastClickTime = createjs.Ticker.getTime(true);
		this._states.gotoAndStop(1 - this._states.currentFrame);
		this.onToggle();
	}
	,handlePress: function(event) {
		if(createjs.Ticker.getPaused() && this._pauseAffected) return;
		if(this._clickType == co.doubleduck.Button.CLICK_TYPE_HOLD) {
			if(this.onHoldStart != null) {
				this.onHoldStart();
				event.onMouseUp = this.onHoldFinish;
			}
		}
		if(this.onClick != null) {
			if(this._clickSound != null) co.doubleduck.SoundManager.playEffect(this._clickSound);
			switch(this._clickType) {
			case co.doubleduck.Button.CLICK_TYPE_TINT:
				if(this._bmp != null) {
					co.doubleduck.Utils.tintBitmap(this._bmp,0.55,0.55,0.55,1);
					var tween = createjs.Tween.get(this._bmp);
					tween.ignoreGlobalPause = true;
					tween.wait(200).call($bind(this,this.handleEndPressTint));
					if(createjs.Ticker.getPaused()) co.doubleduck.BaseGame.getStage().update();
				}
				break;
			case co.doubleduck.Button.CLICK_TYPE_JUICY:
				this._juiceTween = createjs.Tween.get(this._bitmap);
				this._juiceTween.ignoreGlobalPause = true;
				var startScaleX = this._bitmap.scaleX;
				var startScaleY = this._bitmap.scaleY;
				this._bitmap.scaleX = startScaleX * 1.25;
				this._bitmap.scaleY = startScaleY * 0.75;
				this._juiceTween.to({ scaleX : startScaleX, scaleY : startScaleY},500,createjs.Ease.elasticOut);
				break;
			case co.doubleduck.Button.CLICK_TYPE_SCALE:
				this._juiceTween = createjs.Tween.get(this._bitmap);
				this._juiceTween.ignoreGlobalPause = true;
				var startScaleX = this._bitmap.scaleX;
				var startScaleY = this._bitmap.scaleY;
				this._bitmap.scaleX = startScaleX * 1.18;
				this._bitmap.scaleY = startScaleY * 1.18;
				this._juiceTween.to({ scaleX : startScaleX, scaleY : startScaleY},200,createjs.Ease.elasticOut);
				break;
			case co.doubleduck.Button.CLICK_TYPE_TOGGLE:
				break;
			case co.doubleduck.Button.CLICK_TYPE_NONE:
				break;
			case co.doubleduck.Button.CLICK_TYPE_HOLD:
				throw "Use onHoldStart with CLICK_TYPE_HOLD, not onClick";
				break;
			}
		}
	}
	,setNoSound: function() {
		this._clickSound = null;
	}
	,_lastClickPos: null
	,_lastClickTime: null
	,_clickSound: null
	,_juiceTween: null
	,_clickType: null
	,_pauseAffected: null
	,_states: null
	,onHoldFinish: null
	,onHoldStart: null
	,onToggle: null
	,__class__: co.doubleduck.Button
});
co.doubleduck.Customer = $hxClasses["co.doubleduck.Customer"] = function(id,waitFactor,bitmapLoc,frameWidth,frameHeight,arrivingFrame,leavingAngryFrame,leavingSatisfiedFrame,idleFrame,pissedFrame1,pissedFrame2,pissedFrame3,tip) {
	this._serviceable = false;
	this._customerID = id;
	this._waitFactor = waitFactor;
	var initObject = { };
	initObject.images = [co.doubleduck.BaseAssets.getRawImage(bitmapLoc)];
	initObject.frames = { width : frameWidth, height : frameHeight, regX : frameWidth / 2, regY : frameHeight * co.doubleduck.Customer.CUSTOMER_VIEW_LINE};
	initObject.animations = { };
	initObject.animations.idle = { frames : idleFrame, frequency : 20, next : false};
	initObject.animations.arriving = { frames : arrivingFrame, frequency : 20, next : false};
	initObject.animations.satisfied = { frames : leavingSatisfiedFrame, frequency : 20};
	initObject.animations.angry = { frames : leavingAngryFrame, frequency : 20};
	initObject.animations.pissed1 = { frames : pissedFrame1, frequency : 20};
	initObject.animations.pissed2 = { frames : pissedFrame2, frequency : 50, next : false};
	initObject.animations.pissed3 = { frames : pissedFrame3, frequency : 50, next : false};
	var spriteSheet = new createjs.SpriteSheet(initObject);
	this._sprite = new createjs.BitmapAnimation(spriteSheet);
	this._tip = tip;
	createjs.Container.call(this);
	this.addChild(this._sprite);
	this.scaleX = this.scaleY = co.doubleduck.BaseGame.getScale();
	this.mouseEnabled = false;
	this._creationTime = createjs.Ticker.getTime(true);
};
co.doubleduck.Customer.__name__ = ["co","doubleduck","Customer"];
co.doubleduck.Customer.createCustomer = function(name) {
	var customer = co.doubleduck.DataLoader.getCustomer(name);
	return new co.doubleduck.Customer(customer.id,customer.waitFactor,customer.spritesheet,customer.frameWidth,customer.frameHeight,customer.idleFrame,customer.angryFrame,customer.satisfiedFrame,customer.arrivingFrame,customer.pissedOff1,customer.pissedOff2,customer.pissedOff3,customer.tip);
}
co.doubleduck.Customer.__super__ = createjs.Container;
co.doubleduck.Customer.prototype = $extend(createjs.Container.prototype,{
	initToppingSpritesheet: function() {
		var img;
		var initObject;
		img = co.doubleduck.BaseAssets.getRawImage("images/session/customers/bubbles/toppings.png");
		var imgWidth = 24;
		var imgHeight = 22;
		initObject = { };
		initObject.images = [img];
		initObject.frames = { width : imgWidth, height : imgHeight, regX : imgWidth / 2, regY : imgHeight / 2};
		initObject.animations = { };
		var _g = 0, _g1 = Type.getEnumConstructs(co.doubleduck.ToppingType);
		while(_g < _g1.length) {
			var currTopping = _g1[_g];
			++_g;
			var topFrames = co.doubleduck.DataLoader.getToppingByName(currTopping.toLowerCase()).custIconFrame;
			initObject.animations[currTopping] = { frames : topFrames, frequency : 1};
		}
		co.doubleduck.Customer._toppingSpritesheet = new createjs.SpriteSheet(initObject);
	}
	,recieveGlass: function() {
	}
	,getHeight: function() {
		return this._sprite.spriteSheet._frameHeight;
	}
	,getWidth: function() {
		return this._sprite.spriteSheet._frameWidth;
	}
	,getCreationTime: function() {
		return this._creationTime;
	}
	,getTip: function() {
		var passedSinceOrder = (createjs.Ticker.getTime(true) - this._orderTime) / this._maxWaitTime;
		var readynessDelta = Math.abs(this._acceptedPizzaReadyness - 1);
		var cookFactor = new LevelDB().getTipFactorCooking();
		var timeFactor = new LevelDB().getTipFactorTime();
		var result = this._tip * (1 - passedSinceOrder) * timeFactor;
		result += this._tip * (1 - readynessDelta) * cookFactor;
		return Math.floor(result);
	}
	,acceptRecipe: function(pizza,liquid) {
		if(pizza == null) return false;
		if(pizza != null && (pizza.getStatus() == co.doubleduck.PizzaStatus.RAW || pizza.getStatus() == co.doubleduck.PizzaStatus.BURNT)) return false;
		var liquidEqual = liquid == this._requestedLiquid;
		var pizzaEqual = this._requestedPizza.equals(pizza);
		this._acceptedPizzaReadyness = pizza.getReadyness();
		return pizzaEqual && liquidEqual;
	}
	,pause: function() {
		createjs.Tween.removeTweens(this);
		createjs.Ticker.removeListener(this);
	}
	,isServiceable: function() {
		return this._serviceable;
	}
	,arrived: function() {
		this._sprite.gotoAndPlay("idle");
		this.onArrive(this);
	}
	,destroy: function() {
		this.onDestroy(this);
	}
	,leave: function(direction,angry) {
		if(angry == null) angry = false;
		if(angry) this._sprite.gotoAndPlay("angry"); else this._sprite.gotoAndPlay("satisfied");
		var myParent = this.parent;
		if(myParent != null) {
			myParent.removeChild(this);
			myParent.addChildAt(this,0);
		}
		var destinationX = 0;
		var time = 1000;
		var glassDiffX = 0;
		if(direction == co.doubleduck.Customer.DIRECTION_LEFT) {
			this._sprite.scaleX = Math.abs(this._sprite.scaleX);
			glassDiffX = -1 * this.getWidth() / 3;
			destinationX = 0 - this.getWidth() / 2 * co.doubleduck.BaseGame.getScale();
		} else if(direction == co.doubleduck.Customer.DIRECTION_RIGHT) {
			this._sprite.scaleX = -1 * Math.abs(this._sprite.scaleX);
			destinationX = co.doubleduck.BaseGame.getViewport().width + this.getWidth() / 2 * co.doubleduck.BaseGame.getScale();
			glassDiffX = this.getWidth() / 3;
		}
		this.mouseEnabled = false;
		this._serviceable = false;
		var travelPx = Math.abs(destinationX - this.x);
		var travelScreenPercent = travelPx / co.doubleduck.BaseGame.getViewport().width;
		if(angry) time = travelScreenPercent / co.doubleduck.Customer.LEAVE_SPEED_ANGRY * 1000; else time = travelScreenPercent / co.doubleduck.Customer.LEAVE_SPEED_SATISFIED * 1000;
		createjs.Tween.get(this._requestBubble).to({ alpha : 0},100);
		if(this._requestedToppings != null) {
			var _g = 0, _g1 = this._requestedToppings;
			while(_g < _g1.length) {
				var topping = _g1[_g];
				++_g;
				this.removeChild(topping);
				topping = null;
			}
		}
		this.removeChild(this._requestLiquidDisplay);
		createjs.Tween.get(this).to({ x : destinationX},time).call($bind(this,this.destroy));
		this.onLeave(this);
	}
	,arrive: function(destinationX) {
		var startX = 0;
		if(Math.random() > 0.5) startX = 0 - this.getWidth() / 2 * co.doubleduck.BaseGame.getScale(); else startX = co.doubleduck.BaseGame.getViewport().width + this.getWidth() / 2 * co.doubleduck.BaseGame.getScale();
		if(destinationX > startX) this._sprite.scaleX = -1 * Math.abs(this._sprite.scaleX); else this._sprite.scaleX = Math.abs(this._sprite.scaleX);
		this.x = startX;
		this._sprite.gotoAndPlay("arriving");
		var travelPx = Math.abs(destinationX - startX);
		var travelScreenPercent = travelPx / co.doubleduck.BaseGame.getViewport().width;
		var time = travelScreenPercent / co.doubleduck.Customer.ARRIVE_SPEED * 1000;
		createjs.Tween.get(this).to({ x : destinationX},time).call($bind(this,this.arrived));
	}
	,orderGiven: function() {
		this._orderTime = createjs.Ticker.getTime(true);
		this.mouseEnabled = true;
		this._serviceable = true;
		this.updateMood();
	}
	,addRequestBubble: function() {
		var toppingLocation = new createjs.Point(0,0);
		if(this._requestedLiquid != null) {
			this._requestBubble = co.doubleduck.Utils.getCenteredImage("images/session/customers/bubbles/bubble2.png");
			this._requestBubble.y -= 147;
			this.addChild(this._requestBubble);
			toppingLocation.x = this._requestBubble.x + 20;
			toppingLocation.y = this._requestBubble.y - 7;
			this._requestLiquidDisplay = co.doubleduck.Utils.getCenteredImage(co.doubleduck.Liquid.getCustomerIconUri(this._requestedLiquid));
			this.addChild(this._requestLiquidDisplay);
			this._requestLiquidDisplay.x = this._requestBubble.x - 38;
			this._requestLiquidDisplay.y = this._requestBubble.y - 5;
		} else {
			this._requestBubble = co.doubleduck.Utils.getCenteredImage("images/session/customers/bubbles/bubble1.png");
			this._requestBubble.y -= 147;
			toppingLocation.x = this._requestBubble.x;
			toppingLocation.y = this._requestBubble.y - 5;
			this.addChild(this._requestBubble);
		}
		if(this._requestedPizza.getToppings() != null && this._requestedPizza.getToppings().length > 0) {
			if(co.doubleduck.Customer._toppingSpritesheet == null) this.initToppingSpritesheet();
			this._requestedToppings = new Array();
			var toppingLocationsX = [0.18,0.18,-0.18,-0.18,0];
			var toppingLocationsY = [-0.18,0.18,0.18,-0.18,0];
			if(this._requestedPizza.getToppings() != null && this._requestedPizza.getToppings().length > 0) {
				var _g1 = 0, _g = this._requestedPizza.getToppings().length;
				while(_g1 < _g) {
					var toppingTypeIndex = _g1++;
					var toppingType = this._requestedPizza.getToppings()[toppingTypeIndex];
					var topping = new createjs.BitmapAnimation(co.doubleduck.Customer._toppingSpritesheet);
					this.addChild(topping);
					topping.gotoAndStop(toppingType[0]);
					topping.x = toppingLocation.x;
					topping.y = toppingLocation.y;
					topping.x += toppingLocationsX[toppingTypeIndex] * 60;
					topping.y += toppingLocationsY[toppingTypeIndex] * 60;
					this._requestedToppings.push(topping);
				}
			}
		}
	}
	,makeOrder: function(availableToppings,availableLiquids,maxWaitTimeSecs,maxRecipeSize) {
		this._maxWaitTime = maxWaitTimeSecs * 1000 * this._waitFactor;
		var liquidType = null;
		if(availableLiquids == null || availableLiquids.length == 0) {
			var liquidType1 = null;
		} else if(Math.random() < 0.7) liquidType = availableLiquids[Std.random(availableLiquids.length)]; else liquidType = null;
		this._requestedLiquid = liquidType;
		this._requestedPizza = new co.doubleduck.Pizza();
		var toppings = availableToppings.slice();
		var numToppings = Std.random(maxRecipeSize + 1);
		var _g = 0;
		while(_g < numToppings) {
			var currTopping = _g++;
			var topping = availableToppings.splice(Std.random(availableToppings.length),1)[0];
			if(topping != null) this._requestedPizza.addTopping(topping);
		}
		this.addRequestBubble();
		this.orderGiven();
	}
	,updateMood: function() {
		if(!this._serviceable) return;
		var now = createjs.Ticker.getTime(true);
		var passedSinceOrder = now - this._orderTime;
		if(passedSinceOrder > this._maxWaitTime) this.leave(Math.floor(Math.random() * 2),true); else if(passedSinceOrder > this._maxWaitTime * co.doubleduck.Customer.PISSED_3) {
			if(this._sprite.currentAnimation != "pissed3") this._sprite.gotoAndPlay("pissed3");
		} else if(passedSinceOrder > this._maxWaitTime * co.doubleduck.Customer.PISSED_2) {
			if(this._sprite.currentAnimation != "pissed2") this._sprite.gotoAndPlay("pissed2");
		} else if(passedSinceOrder > this._maxWaitTime * co.doubleduck.Customer.PISSED_1) {
			if(this._sprite.currentAnimation != "pissed1") this._sprite.gotoAndPlay("pissed1");
		}
		co.doubleduck.Utils.waitAndCall(this,1000,$bind(this,this.updateMood));
	}
	,onDestroy: null
	,onLeave: null
	,onArrive: null
	,_acceptedPizzaReadyness: null
	,_tip: null
	,_creationTime: null
	,_maxWaitTime: null
	,_orderTime: null
	,_requestLiquidDisplay: null
	,_requestedLiquid: null
	,_requestedPizza: null
	,_requestedToppings: null
	,_requestBubble: null
	,_serviceable: null
	,_waitFactor: null
	,_customerID: null
	,_sprite: null
	,__class__: co.doubleduck.Customer
});
co.doubleduck.DataLoader = $hxClasses["co.doubleduck.DataLoader"] = function() {
};
co.doubleduck.DataLoader.__name__ = ["co","doubleduck","DataLoader"];
co.doubleduck.DataLoader.getLevel = function(id) {
	var result = null;
	var allLevels = co.doubleduck.DataLoader.getAllLevels();
	var _g1 = 0, _g = allLevels.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(allLevels[i].id == id) {
			result = allLevels[i];
			break;
		}
	}
	return result;
}
co.doubleduck.DataLoader.getHelpForLevel = function(level) {
	var result = null;
	var helpScreens = co.doubleduck.DataLoader.getAllHelpScreens();
	var _g1 = 0, _g = helpScreens.length;
	while(_g1 < _g) {
		var i = _g1++;
		result = helpScreens[i];
		if(level >= helpScreens[i].fromLevel && level <= helpScreens[i].toLevel) break;
	}
	return result;
}
co.doubleduck.DataLoader.getToppingById = function(type) {
	var result = null;
	var productDB = new ProductDB();
	var allToppings = productDB.getAllToppings();
	var _g1 = 0, _g = allToppings.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(allToppings[i].id == type) {
			result = allToppings[i];
			break;
		}
	}
	return result;
}
co.doubleduck.DataLoader.getToppingByName = function(name) {
	var result = null;
	var productDB = new ProductDB();
	var allToppings = productDB.getAllToppings();
	var _g1 = 0, _g = allToppings.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(allToppings[i].name == name) {
			result = allToppings[i];
			break;
		}
	}
	return result;
}
co.doubleduck.DataLoader.getLiquidById = function(type) {
	var result = null;
	var productDB = new ProductDB();
	var allFruits = productDB.getAllLiquids();
	var _g1 = 0, _g = allFruits.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(allFruits[i].id == type) {
			result = allFruits[i];
			break;
		}
	}
	return result;
}
co.doubleduck.DataLoader.getLiquidByName = function(name) {
	var result = null;
	var productDB = new ProductDB();
	var allFruits = productDB.getAllLiquids();
	var _g1 = 0, _g = allFruits.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(allFruits[i].name == name) {
			result = allFruits[i];
			break;
		}
	}
	return result;
}
co.doubleduck.DataLoader.getCustomer = function(id) {
	var result = null;
	var cdb = new CustomerDB();
	var allCustomers = cdb.getAllCustomers();
	var _g1 = 0, _g = allCustomers.length;
	while(_g1 < _g) {
		var currCustomer = _g1++;
		if(allCustomers[currCustomer].id == id) {
			result = allCustomers[currCustomer];
			break;
		}
	}
	return result;
}
co.doubleduck.DataLoader.getLevelCount = function() {
	return co.doubleduck.DataLoader.getAllLevels().length;
}
co.doubleduck.DataLoader.getAllLevels = function() {
	var levelDB = new LevelDB();
	return levelDB.getAllLevels();
}
co.doubleduck.DataLoader.getAllHelpScreens = function() {
	var levelDB = new LevelDB();
	return levelDB.getAllHelpScreens();
}
co.doubleduck.DataLoader.prototype = {
	__class__: co.doubleduck.DataLoader
}
co.doubleduck.FontHelper = $hxClasses["co.doubleduck.FontHelper"] = function(type) {
	this._fontType = type;
};
co.doubleduck.FontHelper.__name__ = ["co","doubleduck","FontHelper"];
co.doubleduck.FontHelper.prototype = {
	getNumber: function(num,scale,forceContainer,dims,padding,centered) {
		if(centered == null) centered = true;
		if(padding == null) padding = 0;
		if(forceContainer == null) forceContainer = false;
		if(scale == null) scale = 1;
		if(num >= 0 && num < 10) {
			var result = new createjs.Container();
			var bmp = this.getDigit(num);
			bmp.scaleX = bmp.scaleY = scale;
			result.addChild(bmp);
			if(centered) {
				result.regX = bmp.image.width / 2;
				result.regY = bmp.image.height / 2;
			}
			if(forceContainer) {
				if(dims != null) {
					dims.width = bmp.image.width;
					dims.height = bmp.image.height;
				}
				return result;
			} else return bmp;
		} else {
			var result = new createjs.Container();
			var numString = "" + num;
			var digits = new Array();
			var totalWidth = 0;
			digits[digits.length] = this.getDigit(Std.parseInt(HxOverrides.substr(numString,0,1)));
			digits[0].scaleX = digits[0].scaleY = scale;
			result.addChild(digits[0]);
			totalWidth += digits[0].image.width * scale;
			if(numString.length == 4 || numString.length == 7) {
				this._lastComma = this.getComma();
				this._lastComma.scaleX = this._lastComma.scaleY = scale;
				this._lastComma.x = digits[0].x + digits[0].image.width + padding;
				result.addChild(this._lastComma);
				totalWidth += this._lastComma.image.width * scale;
			}
			var _g1 = 1, _g = numString.length;
			while(_g1 < _g) {
				var i = _g1++;
				var index = digits.length;
				digits[index] = this.getDigit(Std.parseInt(HxOverrides.substr(numString,i,1)));
				if(numString.length - i == 3 || numString.length - i == 6) digits[index].x = this._lastComma.x + this._lastComma.image.width + padding; else digits[index].x = digits[index - 1].x + digits[index - 1].image.width + padding;
				digits[index].scaleX = digits[index].scaleY = scale;
				result.addChild(digits[index]);
				totalWidth += digits[index].image.width * scale + padding;
				if(numString.length - i == 4 || numString.length - i == 7) {
					this._lastComma = this.getComma();
					this._lastComma.scaleX = this._lastComma.scaleY = scale;
					this._lastComma.x = digits[index].x + digits[index].image.width + padding;
					result.addChild(this._lastComma);
					totalWidth += this._lastComma.image.width * scale + padding;
				}
			}
			if(centered) {
				result.regX = totalWidth / 2;
				result.regY = digits[0].image.height / 2;
			}
			if(dims != null) {
				dims.width = totalWidth;
				dims.height = digits[0].image.height;
			}
			return result;
		}
	}
	,getDigit: function(digit) {
		var digit1 = co.doubleduck.BaseAssets.getImage(this._fontType + digit + ".png");
		return digit1;
	}
	,getComma: function() {
		return co.doubleduck.BaseAssets.getImage(this._fontType + "comma.png");
	}
	,_fontType: null
	,_lastComma: null
	,__class__: co.doubleduck.FontHelper
}
co.doubleduck.Game = $hxClasses["co.doubleduck.Game"] = function(stage) {
	this._wantLandscape = false;
	co.doubleduck.BaseGame.call(this,stage);
};
co.doubleduck.Game.__name__ = ["co","doubleduck","Game"];
co.doubleduck.Game.__super__ = co.doubleduck.BaseGame;
co.doubleduck.Game.prototype = $extend(co.doubleduck.BaseGame.prototype,{
	startSession: function(properties) {
		co.doubleduck.BaseGame.prototype.startSession.call(this,properties);
		this._session.onNextLevel = $bind(this,this.handleNextLevel);
		this._session.setMenuCB($bind(this,this.handleBackToMenu));
		this._session.setRestartCB($bind(this,this.handleRestart));
	}
	,handleNextLevel: function() {
    var self = this;

    Popup.show(actualNextlevel);

    function actualNextlevel() {
  		self._session.destroy();
  		co.doubleduck.BaseGame._stage.removeChild(self._session);
  		self._session = null;
  		var nextLvl = co.doubleduck.Session.getLastLevel() + 1;
  		if(co.doubleduck.Menu.isTutorialNeeded(nextLvl)) {
  			self._menu = new co.doubleduck.Menu();
  			self._menu.preLevelTutorial(nextLvl);
  			co.doubleduck.BaseGame._stage.addChildAt(self._menu,0);
  			self._menu.onPlayClick = $bind(self,self.handlePlayClick);
  		} else {
  			var params = { };
  			params.level = co.doubleduck.Session.level + 1 | 0;
  			self.startSession(params);
  		}
    }
	}
	,handleRestart: function(properties) {
		this._session.destroy();
		co.doubleduck.BaseGame._stage.removeChild(this._session);
		this._session = null;
		var params = { };
		params.level = co.doubleduck.Session.level;
		params.backOffset = 0;
		this.startSession(params);
	}
	,scaleObj: function(obj) {
		obj.scaleX = obj.scaleY = co.doubleduck.BaseGame.getScale();
	}
	,removeBack: function() {
		this._splashBack.visible = false;
		co.doubleduck.BaseGame._stage.removeChild(this._splashBack);
		this._splashBack = null;
	}
	,removeSplashLogo: function() {
		this._logoLayer.removeAllChildren();
		co.doubleduck.BaseGame._stage.removeChild(this._logoLayer);
		this._logoLayer = null;
		this.showMenu();
		createjs.Tween.get(this._splashBack).to({ x : this._splashBack.x + co.doubleduck.BaseGame.getViewport().width},300,createjs.Ease.sineIn).call($bind(this,this.removeBack));
	}
	,handleTappedToPlay: function() {
		createjs.Tween.removeTweens(this._tap2play);
		this._tap2play.visible = false;
		co.doubleduck.BaseGame._stage.removeChild(this._tap2play);
		this._tap2play = null;
		createjs.Tween.get(this._logoTextA).to({ x : co.doubleduck.BaseGame.getViewport().width},400,createjs.Ease.circIn);
		createjs.Tween.get(this._logoTextB).to({ x : -co.doubleduck.BaseGame.getViewport().width},400,createjs.Ease.circIn);
		createjs.Tween.get(this._logoLayer).wait(420).to({ alpha : 0},300).call($bind(this,this.removeSplashLogo));
	}
	,addTap2Play: function() {
		this._tap2play = co.doubleduck.Utils.getCenteredImage("images/splash/tap_to_play.png",true);
		this._tap2play.x = co.doubleduck.BaseGame.getViewport().width / 2;
		this._tap2play.y = co.doubleduck.BaseGame.getViewport().height * 0.65;
		this._tap2play.alpha = 0;
		co.doubleduck.BaseGame._stage.addChild(this._tap2play);
		this.alphaFade(this._tap2play);
		this._splashBack.mouseEnabled = true;
		this._splashBack.onClick = $bind(this,this.handleTappedToPlay);
	}
	,slideInLogo: function() {
		this._logoTextA = co.doubleduck.BaseAssets.getImage("images/splash/logo/text_a.png");
		this.scaleObj(this._logoTextA);
		this._logoTextA.x = -co.doubleduck.BaseGame.getViewport().width;
		this._logoLayer.addChild(this._logoTextA);
		this._logoTextB = co.doubleduck.BaseAssets.getImage("images/splash/logo/text_b.png");
		this.scaleObj(this._logoTextB);
		this._logoTextB.x = co.doubleduck.BaseGame.getViewport().width;
		this._logoLayer.addChild(this._logoTextB);
		createjs.Tween.get(this._logoTextA).to({ x : 0},400,createjs.Ease.circOut);
		createjs.Tween.get(this._logoTextB).to({ x : 0},400,createjs.Ease.circOut).call($bind(this,this.addTap2Play));
	}
	,dropToppings: function() {
		var toppings = ["mushroom","onion","pineapple","olive","olive_2","pepperoni"];
		var delay = 50;
		var lastTween = null;
		var _g1 = 0, _g = toppings.length;
		while(_g1 < _g) {
			var i = _g1++;
			var top = co.doubleduck.BaseAssets.getImage("images/splash/logo/" + toppings[i] + ".png");
			this.scaleObj(top);
			top.alpha = 0;
			top.scaleX = top.scaleY = top.scaleX * 2;
			top.y = -300 * co.doubleduck.BaseGame.getScale();
			top.x = -100 * co.doubleduck.BaseGame.getScale();
			this._logoLayer.addChild(top);
			lastTween = createjs.Tween.get(top).wait(delay).to({ x : 0, y : 0, alpha : 1, scaleX : co.doubleduck.BaseGame.getScale(), scaleY : co.doubleduck.BaseGame.getScale()},650,createjs.Ease.bounceOut);
			delay += 190;
		}
		lastTween.call($bind(this,this.slideInLogo));
	}
	,showSplashLogo: function() {
		this._pizzaBack.visible = false;
		this._logoLayer.removeChild(this._pizzaBack);
		this._pizzaBack = null;
		this._logoSlice.visible = true;
		this._pizzaSlice.visible = false;
		this._logoLayer.removeChild(this._pizzaSlice);
		this._pizzaSlice = null;
		createjs.Tween.get(this._logoGreen).wait(100).to({ alpha : 1},200);
		createjs.Tween.get(this._logoRed).wait(250).to({ alpha : 1},200).call($bind(this,this.dropToppings));
	}
	,seperatePizza: function() {
		this._pizzaFront.visible = false;
		this._logoLayer.removeChild(this._pizzaFront);
		this._pizzaFront = null;
		this._logoSlice = co.doubleduck.BaseAssets.getImage("images/splash/pizza_logo.png");
		this.scaleObj(this._logoSlice);
		this._logoSlice.visible = false;
		this._logoLayer.addChild(this._logoSlice);
		createjs.Tween.get(this._logoLayer).to({ x : co.doubleduck.BaseGame.getViewport().width / 2, y : co.doubleduck.BaseGame.getViewport().height * 0.35},1200,createjs.Ease.sineInOut);
		createjs.Tween.get(this._pizzaBack).to({ x : co.doubleduck.BaseGame.getViewport().width * 2, y : co.doubleduck.BaseGame.getViewport().height},1200,createjs.Ease.sineInOut).call($bind(this,this.showSplashLogo));
		createjs.Tween.get(this._pizzaSlice).to({ x : (this._logoSlice.image.width - this._pizzaSlice.image.width) * co.doubleduck.BaseGame.getScale(), y : (this._logoSlice.image.height - this._pizzaSlice.image.height) * co.doubleduck.BaseGame.getScale()},1200);
	}
	,showGameSplash: function() {
		this._splashBack = co.doubleduck.BaseAssets.getImage("images/splash/bg.png");
		this.scaleObj(this._splashBack);
		this._splashBack.regX = this._splashBack.image.width / 2;
		this._splashBack.regY = this._splashBack.image.height / 2;
		this._splashBack.x = co.doubleduck.BaseGame.getViewport().width / 2;
		this._splashBack.y = co.doubleduck.BaseGame.getViewport().height / 2;
		co.doubleduck.BaseGame._stage.addChild(this._splashBack);
		this._logoLayer = new createjs.Container();
		co.doubleduck.BaseGame._stage.addChild(this._logoLayer);
		this._logoRed = co.doubleduck.BaseAssets.getImage("images/splash/logo/red.png");
		this.scaleObj(this._logoRed);
		this._logoRed.alpha = 0;
		this._logoLayer.addChild(this._logoRed);
		this._logoGreen = co.doubleduck.BaseAssets.getImage("images/splash/logo/green.png");
		this.scaleObj(this._logoGreen);
		this._logoGreen.alpha = 0;
		this._logoLayer.addChild(this._logoGreen);
		this._logoLayer.regX = this._logoRed.image.width * co.doubleduck.BaseGame.getScale() / 2;
		this._logoLayer.regY = this._logoRed.image.height * co.doubleduck.BaseGame.getScale() / 2;
		this._logoLayer.x = co.doubleduck.BaseGame.getViewport().width * 0.57;
		this._logoLayer.y = co.doubleduck.BaseGame.getViewport().height * 0.62;
		this._logoLayer.alpha = 0;
		this._pizzaBack = co.doubleduck.BaseAssets.getImage("images/splash/pizza_1.png");
		this.scaleObj(this._pizzaBack);
		this._logoLayer.addChild(this._pizzaBack);
		this._pizzaSlice = co.doubleduck.BaseAssets.getImage("images/splash/pizza_2.png");
		this.scaleObj(this._pizzaSlice);
		this._logoLayer.addChild(this._pizzaSlice);
		this._pizzaFront = co.doubleduck.BaseAssets.getImage("images/splash/pizza_3.png");
		this.scaleObj(this._pizzaFront);
		this._logoLayer.addChild(this._pizzaFront);
		createjs.Tween.get(this._logoLayer).to({ alpha : 1, x : co.doubleduck.BaseGame.getViewport().width * 0.6, y : co.doubleduck.BaseGame.getViewport().height * 0.65},400,createjs.Ease.sineOut).wait(200).call($bind(this,this.seperatePizza));
	}
	,_tap2play: null
	,_logoTextB: null
	,_logoTextA: null
	,_logoSlice: null
	,_logoGreen: null
	,_logoRed: null
	,_pizzaFront: null
	,_pizzaSlice: null
	,_pizzaBack: null
	,_logoLayer: null
	,_splashBack: null
	,__class__: co.doubleduck.Game
});
co.doubleduck.HUD = $hxClasses["co.doubleduck.HUD"] = function(starsScore) {
	this._prevScore = 0;
	this.onMenuClick = null;
	this.onRestart = null;
	this.onPauseClick = null;
	createjs.Container.call(this);
	this._fontMoney = new co.doubleduck.FontHelper("images/session/UI/money_font/");
	this._fontTimer = new co.doubleduck.FontHelper("images/session/UI/timer_font/");
	this._pauseBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/UI/pause.png"));
	this._pauseBtn.regX = this._pauseBtn.image.width;
	this._pauseBtn.scaleX = this._pauseBtn.scaleY = co.doubleduck.BaseGame.getScale();
	this._pauseBtn.x = co.doubleduck.BaseGame.getViewport().width - 5 * co.doubleduck.BaseGame.getScale();
	this._pauseBtn.y = co.doubleduck.BaseGame.getViewport().y + 5 * co.doubleduck.BaseGame.getScale();
	this._pauseBtn.onClick = $bind(this,this.handlePauseClick);
	createjs.Ticker.addListener(this,false);
	this.addChild(this._pauseBtn);
	this._scoreBox = co.doubleduck.BaseAssets.getImage("images/session/UI/money.png");
	this._scoreBox.scaleX = this._scoreBox.scaleY = co.doubleduck.BaseGame.getScale();
	this._scoreBox.x = co.doubleduck.BaseGame.getViewport().x + 5 * co.doubleduck.BaseGame.getScale();
	this._scoreBox.y = co.doubleduck.BaseGame.getViewport().y + 10 * co.doubleduck.BaseGame.getScale();
	this._scoreBar = co.doubleduck.BaseAssets.getImage("images/session/UI/bar.png");
	this._scoreBar.scaleX = this._scoreBar.scaleY = co.doubleduck.BaseGame.getScale();
	this._scoreBar.regY = this._scoreBar.image.height / 2;
	this._scoreBar.x = this._scoreBox.x + this._scoreBox.image.width * 0.9 * co.doubleduck.BaseGame.getScale();
	this._scoreBar.y = this._scoreBox.y + this._scoreBox.image.height / 2 * co.doubleduck.BaseGame.getScale();
	this._scoreFill = co.doubleduck.BaseAssets.getImage("images/session/UI/bar2.png");
	this._scoreFill.scaleX = this._scoreFill.scaleY = this._scoreBar.scaleX;
	this._scoreFill.regX = this._scoreBar.regX;
	this._scoreFill.regY = this._scoreBar.regY;
	this._scoreFill.x = this._scoreBar.x;
	this._scoreFill.y = this._scoreBar.y;
	this._scoreBarMask = new createjs.Shape();
	this._scoreFill.mask = this._scoreBarMask;
	this._starsScore = starsScore;
	var barWidth = this._scoreBar.image.width * co.doubleduck.BaseGame.getScale();
	this._stars = new Array();
	this._starsType = new Array();
	var _g1 = 0, _g = this._starsScore.length;
	while(_g1 < _g) {
		var i = _g1++;
		this._stars[i] = co.doubleduck.BaseAssets.getImage("images/session/UI/star1.png");
		this._stars[i].regX = this._stars[i].image.width / 2;
		this._stars[i].regY = this._stars[i].image.height * 0.6;
		this._stars[i].y = this._scoreBar.y;
		this._stars[i].x = this._scoreBar.x + barWidth * (this._starsScore[i] / this._starsScore[this._starsScore.length - 1]);
		this._stars[i].scaleX = this._stars[i].scaleY = co.doubleduck.BaseGame.getScale();
		this._starsType[i] = 1;
		if(i == 2) this._stars[i].x -= 14 * co.doubleduck.BaseGame.getScale();
	}
	this.addChild(this._scoreBar);
	this.addChild(this._scoreFill);
	this.addChild(this._scoreBox);
	var _g1 = 0, _g = this._stars.length;
	while(_g1 < _g) {
		var i = _g1++;
		this.addChild(this._stars[i]);
	}
	this._pauseScreenBG = new createjs.Shape();
	this._pauseScreenBG.graphics.beginFill("#000000");
	this._pauseScreenBG.graphics.drawRect(0,0,co.doubleduck.BaseGame.getViewport().width,co.doubleduck.BaseGame.getViewport().height);
	this._pauseScreenBG.graphics.endFill();
	this._pauseScreenBG.alpha = 0.5;
	this._pauseScreenBG.visible = false;
	this._pauseBtnScreenTitle = co.doubleduck.BaseAssets.getImage("images/session/UI/pause_sign.png");
	this._pauseBtnScreenTitle.regX = this._pauseBtnScreenTitle.image.width / 2;
	this._pauseBtnScreenTitle.regY = this._pauseBtnScreenTitle.image.height / 2;
	this._pauseBtnScreenTitle.scaleX = this._pauseBtnScreenTitle.scaleY = co.doubleduck.BaseGame.getScale();
	this._pauseBtnScreenTitle.x = co.doubleduck.BaseGame.getViewport().width / 2;
	this._pauseBtnScreenTitle.y = co.doubleduck.BaseGame.getViewport().height * 0.4;
	this._pauseScreenBtnRestart = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/end_screen/restart.png"),false);
	this._pauseScreenBtnRestart.regX = this._pauseScreenBtnRestart.image.width / 2;
	this._pauseScreenBtnRestart.regY = this._pauseScreenBtnRestart.image.height / 2;
	this._pauseScreenBtnRestart.scaleX = this._pauseScreenBtnRestart.scaleY = co.doubleduck.BaseGame.getScale();
	this._pauseScreenBtnRestart.x = this._pauseBtnScreenTitle.x;
	this._pauseScreenBtnRestart.y = this._pauseBtnScreenTitle.y + 200 * co.doubleduck.BaseGame.getScale();
	this._pauseScreenBtnRestart.onClick = $bind(this,this.handleRestartClick);
	this._pauseScreenBtnResume = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/end_screen/next.png"),false);
	this._pauseScreenBtnResume.regX = this._pauseScreenBtnResume.image.width / 2;
	this._pauseScreenBtnResume.regY = this._pauseScreenBtnResume.image.height / 2;
	this._pauseScreenBtnResume.scaleX = this._pauseScreenBtnResume.scaleY = co.doubleduck.BaseGame.getScale();
	this._pauseScreenBtnResume.onClick = $bind(this,this.handlePauseClick);
	this._pauseScreenBtnResume.y = this._pauseScreenBtnRestart.y;
	this._pauseScreenBtnResume.x = this._pauseScreenBtnRestart.x + this._pauseScreenBtnRestart.image.width * co.doubleduck.BaseGame.getScale();
	this._pauseScreenBtnMenu = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/end_screen/menu.png"),false);
	this._pauseScreenBtnMenu.regX = this._pauseScreenBtnMenu.image.width / 2;
	this._pauseScreenBtnMenu.regY = this._pauseScreenBtnMenu.image.height / 2;
	this._pauseScreenBtnMenu.scaleX = this._pauseScreenBtnMenu.scaleY = co.doubleduck.BaseGame.getScale();
	this._pauseScreenBtnMenu.y = this._pauseScreenBtnRestart.y;
	this._pauseScreenBtnMenu.x = this._pauseScreenBtnRestart.x - this._pauseScreenBtnRestart.image.width * co.doubleduck.BaseGame.getScale();
	this._pauseScreenBtnMenu.onClick = $bind(this,this.handleMenuClick);
	this._pauseContainer = new createjs.Container();
	this.addChild(this._pauseContainer);
	if(co.doubleduck.BaseGame.DEBUG) {
		this._fps = new createjs.Text("0","Arial 22px","#FF0000");
		this.addChild(this._fps);
		this._fps.x = co.doubleduck.BaseGame.getViewport().width - 100;
		this._fps.y = 250;
		createjs.Ticker.addListener(this);
	}
};
co.doubleduck.HUD.__name__ = ["co","doubleduck","HUD"];
co.doubleduck.HUD.__super__ = createjs.Container;
co.doubleduck.HUD.prototype = $extend(createjs.Container.prototype,{
	setPauseOverlay: function(flag) {
		this._pauseScreenBG.visible = flag;
		if(flag) {
			this.removeChild(this._pauseBtn);
			this.addChild(this._pauseScreenBG);
			this.addChild(this._pauseBtn);
			this.removeChild(this._pauseContainer);
			this.addChild(this._pauseContainer);
			this._pauseContainer.addChild(this._pauseBtnScreenTitle);
			this._pauseContainer.addChild(this._pauseScreenBtnRestart);
			this._pauseContainer.addChild(this._pauseScreenBtnResume);
			this._pauseContainer.addChild(this._pauseScreenBtnMenu);
			this._pauseBtn.visible = false;
			this._pauseContainer.visible = true;
			var destY = this._pauseContainer.y;
			this._pauseContainer.y = -150 * co.doubleduck.BaseGame.getScale();
		} else {
			this.removeChild(this._pauseScreenBG);
			this.removeChild(this._pauseContainer);
			this._pauseContainer.removeChild(this._pauseBtnScreenTitle);
			this._pauseContainer.removeChild(this._pauseScreenBtnRestart);
			this._pauseContainer.removeChild(this._pauseScreenBtnResume);
			this._pauseContainer.removeChild(this._pauseScreenBtnMenu);
			this._pauseBtn.visible = true;
			this._pauseContainer.visible = false;
		}
		co.doubleduck.BaseGame.getStage().update();
	}
	,removePopup: function(money) {
		this.removeChild(money);
	}
	,popupScore: function(amount,posX,posY) {
		var dims = new createjs.Rectangle(0,0,0,0);
		var moneyFont = new co.doubleduck.FontHelper("images/session/UI/timer_font/");
		var money = moneyFont.getNumber(amount,1,true,dims,-2);
		var dollar = co.doubleduck.BaseAssets.getImage("images/session/UI/timer_font/dollar.png");
		money.scaleX = money.scaleY = co.doubleduck.BaseGame.getScale();
		money.x = posX;
		money.y = posY;
		money.x += dollar.image.width / 2 * co.doubleduck.BaseGame.getScale();
		co.doubleduck.Utils.setCenterReg(dollar);
		dollar.regX = dollar.image.width;
		dollar.scaleX = dollar.scaleY = co.doubleduck.BaseGame.getScale();
		var moneyCont = new createjs.Container();
		moneyCont.addChild(money);
		moneyCont.addChild(dollar);
		dollar.y = money.y;
		dollar.x = money.x - dims.width / 2 * co.doubleduck.BaseGame.getScale();
		var deltaY = -15 * co.doubleduck.BaseGame.getScale();
		var deltaX = 0;
		createjs.Tween.get(moneyCont).to({ y : deltaY, x : deltaX},500,createjs.Ease.sineOut).to({ alpha : 0},200).call($bind(this,this.removePopup),[moneyCont]);
		this.addChild(moneyCont);
	}
	,timeScaleDown: function() {
		createjs.Tween.get(this._remainingSecs).to({ scaleX : this._remainingSecs.scaleX, scaleY : this._remainingSecs.scaleY},450);
	}
	,timeScaleUp: function() {
		createjs.Tween.get(this._remainingSecs).to({ scaleX : this._remainingSecs.scaleX * 1.5, scaleY : this._remainingSecs.scaleY * 1.5},450).call($bind(this,this.timeScaleDown));
	}
	,setRemainingSecs: function(secs) {
		if(this._remainingSecs != null) this.removeChild(this._remainingSecs);
		var dims = new createjs.Rectangle(0,0,0,0);
		this._remainingSecs = this._fontTimer.getNumber(secs,1,true,dims);
		this._remainingSecs.y = this._pauseBtn.y + this._pauseBtn.image.height / 2 * co.doubleduck.BaseGame.getScale();
		this._remainingSecs.scaleX = this._remainingSecs.scaleY = co.doubleduck.BaseGame.getScale();
		this._remainingSecs.x = this._pauseBtn.x - this._pauseBtn.image.width * co.doubleduck.BaseGame.getScale() - dims.width / 2 * co.doubleduck.BaseGame.getScale();
		this.addChild(this._remainingSecs);
	}
	,tick: function() {
		if(co.doubleduck.BaseGame.DEBUG) this._fps.text = "" + createjs.Ticker.getMeasuredFPS();
	}
	,setScore: function(score) {
		var prevPercent = co.doubleduck.Utils.map(this._prevScore,0,this._starsScore[2]);
		var percent = co.doubleduck.Utils.map(score,0,this._starsScore[2]);
		if(this._scoreText != null) this.removeChild(this._scoreText);
		if(this._dollarSign != null) this.removeChild(this._dollarSign);
		var dims = new createjs.Rectangle(0,0,0,0);
		this._scoreText = this._fontMoney.getNumber(score,1,true,dims);
		this._scoreText.scaleX = this._scoreText.scaleY = co.doubleduck.BaseGame.getScale();
		this._scoreText.x = this._scoreBox.x + this._scoreBox.image.width / 2 * co.doubleduck.BaseGame.getScale();
		this._scoreText.y = this._scoreBox.y + this._scoreBox.image.height / 2 * co.doubleduck.BaseGame.getScale();
		this.addChild(this._scoreText);
		this._dollarSign = co.doubleduck.BaseAssets.getImage("images/session/UI/money_font/dollar.png");
		co.doubleduck.Utils.setCenterReg(this._dollarSign);
		this.addChild(this._dollarSign);
		this._dollarSign.x = this._scoreText.x - (dims.width / 2 + 3) * co.doubleduck.BaseGame.getScale() - this._dollarSign.image.width / 2 * co.doubleduck.BaseGame.getScale();
		this._dollarSign.y = this._scoreText.y;
		this._dollarSign.scaleX = this._dollarSign.scaleY = co.doubleduck.BaseGame.getScale();
		this._dollarSign.x += this._dollarSign.image.width / 2 * co.doubleduck.BaseGame.getScale();
		this._scoreText.x += this._dollarSign.image.width / 2 * co.doubleduck.BaseGame.getScale();
		this._scoreBarMask.graphics.clear();
		this._scoreBarMask.x = 0;
		this._scoreBarMask.graphics.beginFill("#00000000");
		var fillWidth = this._scoreFill.image.width * co.doubleduck.BaseGame.getScale();
		var fillHeight = this._scoreFill.image.height * co.doubleduck.BaseGame.getScale();
		var deltaWidth = fillWidth * (percent - prevPercent);
		this._scoreBarMask.graphics.drawRect(this._scoreFill.x - deltaWidth,this._scoreFill.y - fillHeight / 2,fillWidth * percent,fillHeight);
		this._scoreBarMask.graphics.endFill();
		this._scoreFill.mask = this._scoreBarMask;
		createjs.Tween.get(this._scoreBarMask).to({ x : this._scoreBarMask.x + deltaWidth},350);
		this._prevScore = score;
		var _g1 = 0, _g = this._starsScore.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(score >= this._starsScore[i]) {
				if(this._starsType[i] == 1) {
					var newStar = co.doubleduck.BaseAssets.getImage("images/session/UI/star2.png");
					newStar.x = this._stars[i].x;
					newStar.y = this._stars[i].y;
					newStar.scaleX = newStar.scaleY = this._stars[i].scaleX;
					newStar.regX = newStar.image.width / 2;
					newStar.regY = newStar.image.height / 2;
					this.removeChild(this._stars[i]);
					this._starsType[i] = 2;
					this._stars[i] = newStar;
					this.addChild(this._stars[i]);
					var currScale = this._stars[i].scaleX;
					var targetScale = currScale * 1.5;
					createjs.Tween.get(this._stars[i]).to({ scaleX : targetScale, scaleY : targetScale},80).to({ scaleX : currScale, scaleY : currScale},140);
				}
			}
		}
	}
	,handlePauseClick: function() {
		if(this.onPauseClick != null) this.onPauseClick();
	}
	,handleRestartClick: function() {
		if(this.onRestart != null) {
			createjs.Ticker.setPaused(false);
			this.onRestart();
		}
	}
	,handleMenuClick: function() {
		if(this.onMenuClick != null) {
			createjs.Ticker.setPaused(false);
			this.onMenuClick();
		}
	}
	,_dollarSign: null
	,_fontTimer: null
	,_fontMoney: null
	,_pauseContainer: null
	,_pauseScreenBtnResume: null
	,_pauseScreenBtnRestart: null
	,_pauseScreenBtnMenu: null
	,_pauseBtnScreenTitle: null
	,_pauseScreenBG: null
	,_pauseBtn: null
	,_remainingSecs: null
	,_starsType: null
	,_stars: null
	,_starsScore: null
	,_scoreBarMask: null
	,_scoreFill: null
	,_scoreBar: null
	,_scoreText: null
	,_scoreBox: null
	,_prevScore: null
	,_fps: null
	,onMenuClick: null
	,onRestart: null
	,onPauseClick: null
	,__class__: co.doubleduck.HUD
});
co.doubleduck.Liquid = $hxClasses["co.doubleduck.Liquid"] = function(typeStr,graphic,icon) {
	this._liquidType = Type.createEnum(co.doubleduck.LiquidType,typeStr.toUpperCase());
	this._name = typeStr;
	this.name = typeStr;
	this._icon = icon;
	co.doubleduck.Button.call(this,co.doubleduck.BaseAssets.getImage(graphic));
	this.setNoSound();
};
co.doubleduck.Liquid.__name__ = ["co","doubleduck","Liquid"];
co.doubleduck.Liquid.createLiquid = function(id) {
	var graphic = co.doubleduck.DataLoader.getLiquidById(id).bigIcon;
	var name = co.doubleduck.DataLoader.getLiquidById(id).name;
	var icon = co.doubleduck.DataLoader.getLiquidById(id).smallIcon;
	return new co.doubleduck.Liquid(name,graphic,icon);
}
co.doubleduck.Liquid.getCustomerIconUri = function(type) {
	var icon = co.doubleduck.DataLoader.getLiquidByName(type[0].toLowerCase()).smallIcon;
	return icon;
}
co.doubleduck.Liquid.__super__ = co.doubleduck.Button;
co.doubleduck.Liquid.prototype = $extend(co.doubleduck.Button.prototype,{
	getIconUri: function() {
		return this._icon;
	}
	,getName: function() {
		return this._name;
	}
	,getType: function() {
		return this._liquidType;
	}
	,_icon: null
	,_name: null
	,_liquidType: null
	,__class__: co.doubleduck.Liquid
});
co.doubleduck.LiquidType = $hxClasses["co.doubleduck.LiquidType"] = { __ename__ : ["co","doubleduck","LiquidType"], __constructs__ : ["RED","ORANGE","LIME"] }
co.doubleduck.LiquidType.RED = ["RED",0];
co.doubleduck.LiquidType.RED.toString = $estr;
co.doubleduck.LiquidType.RED.__enum__ = co.doubleduck.LiquidType;
co.doubleduck.LiquidType.ORANGE = ["ORANGE",1];
co.doubleduck.LiquidType.ORANGE.toString = $estr;
co.doubleduck.LiquidType.ORANGE.__enum__ = co.doubleduck.LiquidType;
co.doubleduck.LiquidType.LIME = ["LIME",2];
co.doubleduck.LiquidType.LIME.toString = $estr;
co.doubleduck.LiquidType.LIME.__enum__ = co.doubleduck.LiquidType;
co.doubleduck.Main = $hxClasses["co.doubleduck.Main"] = function() { }
co.doubleduck.Main.__name__ = ["co","doubleduck","Main"];
co.doubleduck.Main._stage = null;
co.doubleduck.Main._game = null;
co.doubleduck.Main._ffHeight = null;
co.doubleduck.Main.main = function() {
	co.doubleduck.Main.testFFHeight();
	createjs.Ticker.useRAF = true;
	createjs.Ticker.setFPS(60);
	co.doubleduck.Main._stage = new createjs.Stage(js.Lib.document.getElementById("stageCanvas"));
	co.doubleduck.Main._game = new co.doubleduck.Game(co.doubleduck.Main._stage);
	createjs.Ticker.addListener(co.doubleduck.Main._stage);
	createjs.Touch.enable(co.doubleduck.Main._stage,true,false);
}
co.doubleduck.Main.testFFHeight = function() {
	var isAplicable = /Firefox/.test(navigator.userAgent);
	if(isAplicable && viewporter.ACTIVE) co.doubleduck.Main._ffHeight = js.Lib.window.innerHeight;
}
co.doubleduck.Main.getFFHeight = function() {
	return co.doubleduck.Main._ffHeight;
}
co.doubleduck.Menu = $hxClasses["co.doubleduck.Menu"] = function() {
	this._currLevelScreen = 0;
	this._isMoving = false;
	this._isInHelp = false;
	this._justViewedTutor = false;
	co.doubleduck.BaseMenu.call(this);
	co.doubleduck.Button.setDefaultSound("sound/buttonPress");
	this._back = co.doubleduck.BaseAssets.getImage("images/menu/bg.png");
	this._back.regX = 0;
	this._back.regY = this._back.image.height / 2;
	this._back.scaleX = this._back.scaleY = co.doubleduck.BaseGame.getScale();
	this._back.y = co.doubleduck.BaseGame.getViewport().height / 2;
	this.addChild(this._back);
	this._levelButtons = new Array();
	this._levelsLayer = new createjs.Container();
	this._levelsLayer.mouseEnabled = false;
	co.doubleduck.Utils.waitAndCall(this,1000,$bind(this,this.enableLevelClick));
	if(co.doubleduck.Menu._iconSpritesheet == null) {
		var img = co.doubleduck.BaseAssets.getRawImage("images/menu/level_icons.png");
		var initObject = { };
		initObject.images = [img];
		initObject.frames = { width : img.width / 5, height : img.height, regX : 0, regY : 0};
		initObject.animations = { };
		initObject.animations.locked = { frames : 4, frequency : 20};
		var _g = 0;
		while(_g < 4) {
			var i = _g++;
			initObject.animations["star" + i] = { frames : i, frequency : 20};
		}
		co.doubleduck.Menu._iconSpritesheet = new createjs.SpriteSheet(initObject);
	}
	var _g1 = 0, _g = Math.ceil(co.doubleduck.DataLoader.getLevelCount() / co.doubleduck.Menu.LEVELS_PER_SCREEN);
	while(_g1 < _g) {
		var i = _g1++;
		var _g3 = 0, _g2 = co.doubleduck.Menu.LEVELS_PER_SCREEN;
		while(_g3 < _g2) {
			var j = _g3++;
			var lvlNum = i * co.doubleduck.Menu.LEVELS_PER_SCREEN + j + 1;
			if(lvlNum > co.doubleduck.DataLoader.getLevelCount()) break;
			var currLvl = new co.doubleduck.Button(new createjs.BitmapAnimation(co.doubleduck.Menu._iconSpritesheet));
			currLvl.name = "" + lvlNum;
			currLvl.scaleX = currLvl.scaleY = co.doubleduck.BaseGame.getScale();
			currLvl.regX = currLvl.image.width / 2;
			currLvl.regY = currLvl.image.height / 2;
			currLvl.x = co.doubleduck.BaseGame.getViewport().width * (0.33 + j % (co.doubleduck.Menu.LEVELS_PER_SCREEN / 3) * 0.34);
			currLvl.x += co.doubleduck.BaseGame.getViewport().width * i;
			currLvl.y = co.doubleduck.BaseGame.getViewport().height * (0.2 + Math.floor(j / (co.doubleduck.Menu.LEVELS_PER_SCREEN / 3)) * 0.24);
			if(lvlNum <= co.doubleduck.Persistence.getUnlockedLevel()) {
				var stars = co.doubleduck.Persistence.getStarRating(lvlNum);
				currLvl.anim.gotoAndStop("star" + stars);
				currLvl.addBitmapLabel("" + lvlNum,"images/menu/menu_font/",6);
				currLvl.shiftLabel(1,0.8);
				currLvl.scaleBitmapFont(0.74);
				currLvl.onClick = $bind(this,this.handleLevelClick);
			} else currLvl.anim.gotoAndStop("locked");
			this._levelButtons[lvlNum - 1] = currLvl;
			this._levelsLayer.addChild(currLvl);
		}
	}
	this._levelsLayer.alpha = 0;
	this.addChild(this._levelsLayer);
	createjs.Tween.get(this._levelsLayer).wait(100).to({ alpha : 1},400);
	this._menuRightBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/arrow_right.png"));
	this._menuRightBtn.scaleX = this._menuRightBtn.scaleY = co.doubleduck.BaseGame.getScale();
	this._menuRightBtn.regX = this._menuRightBtn.image.width;
	this._menuRightBtn.regY = this._menuRightBtn.image.height / 2;
	this._menuRightBtn.x = co.doubleduck.BaseGame.getViewport().width;
	this._menuRightBtn.y = co.doubleduck.BaseGame.getViewport().height * 0.475;
	this._menuRightBtn.onClick = $bind(this,this.goToNext);
	this._menuRightBtn.alpha = 0;
	this.addChild(this._menuRightBtn);
	createjs.Tween.get(this._menuRightBtn).to({ alpha : 1},300);
	this._menuLeftBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/arrow_left.png"));
	this._menuLeftBtn.scaleX = this._menuLeftBtn.scaleY = co.doubleduck.BaseGame.getScale();
	this._menuLeftBtn.regX = 0;
	this._menuLeftBtn.regY = this._menuLeftBtn.image.height / 2;
	this._menuLeftBtn.x = 0;
	this._menuLeftBtn.y = this._menuRightBtn.y;
	this._menuLeftBtn.onClick = $bind(this,this.goToPrev);
	this._menuLeftBtn.alpha = 0;
	this.addChild(this._menuLeftBtn);
	createjs.Tween.get(this._menuLeftBtn).to({ alpha : 1},300);
	this._helpBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/help.png"));
	this._helpBtn.regX = 0;
	this._helpBtn.regY = this._helpBtn.image.height;
	this._helpBtn.scaleX = this._helpBtn.scaleY = co.doubleduck.BaseGame.getScale();
	this._helpBtn.x = co.doubleduck.BaseGame.getScale() * 22;
	this._helpBtn.y = this._back.y + this._back.image.height * co.doubleduck.BaseGame.getScale() * 0.31;
	this._helpBtn.onClick = $bind(this,this.showHelpMenu);
	this._helpBtn.alpha = 0;
	this.addChild(this._helpBtn);
	createjs.Tween.get(this._helpBtn).to({ alpha : 1},200);
	if(co.doubleduck.SoundManager.available) {
		this._muteBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/sound.png"),true,co.doubleduck.Button.CLICK_TYPE_TOGGLE);
		this.addChild(this._muteBtn);
		this._muteBtn.regX = this._muteBtn.image.width / 4;
		this._muteBtn.regY = this._muteBtn.image.height / 2;
		this._muteBtn.scaleX = this._muteBtn.scaleY = co.doubleduck.BaseGame.getScale();
		this._muteBtn.x = co.doubleduck.BaseGame.getViewport().width - co.doubleduck.BaseGame.getScale() * 22;
		this._muteBtn.y = this._helpBtn.y;
		this._muteBtn.setToggle(!co.doubleduck.SoundManager.isMuted());
		this._muteBtn.onToggle = $bind(this,this.handleMuteToggle);
		this._muteBtn.alpha = 0;
		this.addChild(this._muteBtn);
		createjs.Tween.get(this._muteBtn).to({ alpha : 1},200);
	}
	var gotoLevel = co.doubleduck.Session.getLastLevel();
	if(gotoLevel == -1) gotoLevel = co.doubleduck.Persistence.getUnlockedLevel();
	gotoLevel--;
	this.goToWorld(Math.floor(gotoLevel / co.doubleduck.Menu.LEVELS_PER_SCREEN),true);
	this.setArrowBtnVisibility();
	co.doubleduck.BaseGame.hammer.onswipe = $bind(this,this.handleSwipe);
	this._themeMusic = co.doubleduck.SoundManager.playMusic("sound/pizzPanic_theme");
};
co.doubleduck.Menu.__name__ = ["co","doubleduck","Menu"];
co.doubleduck.Menu.isTutorialNeeded = function(level) {
	var screensData = co.doubleduck.DataLoader.getHelpForLevel(level);
	return level == (screensData.fromLevel | 0);
}
co.doubleduck.Menu.__super__ = co.doubleduck.BaseMenu;
co.doubleduck.Menu.prototype = $extend(co.doubleduck.BaseMenu.prototype,{
	goToPrev: function() {
		if(this._currLevelScreen <= 0) return;
		if(this._isInHelp) return;
		this.goToWorld(this._currLevelScreen - 1);
		this.setArrowBtnVisibility();
	}
	,goToNext: function() {
		if(this._currLevelScreen >= Math.floor((co.doubleduck.DataLoader.getLevelCount() - 1) / co.doubleduck.Menu.LEVELS_PER_SCREEN)) return;
		if(this._isInHelp) return;
		this.goToWorld(this._currLevelScreen + 1);
		this.setArrowBtnVisibility();
	}
	,handleTick: function(elapsed) {
		var delta = co.doubleduck.Menu.WORLD_MOVE_EASE * elapsed;
		delta = Math.min(delta,0.2);
		delta *= this._targetLevelsPos - this._levelsLayer.x;
		this._levelsLayer.x += delta;
		if(Math.abs(delta) >= 1) this._levelsLayer.mouseEnabled = false; else this._levelsLayer.mouseEnabled = true;
		if(Math.abs(this._targetLevelsPos - this._levelsLayer.x) < 1) {
			this._levelsLayer.x = this._targetLevelsPos;
			this._levelsLayer.mouseEnabled = true;
			this._isMoving = false;
			this.onTick = null;
		}
	}
	,setArrowBtnVisibility: function() {
		this._menuRightBtn.visible = this._currLevelScreen < Math.floor((co.doubleduck.DataLoader.getLevelCount() - 1) / co.doubleduck.Menu.LEVELS_PER_SCREEN);
		this._menuLeftBtn.visible = this._currLevelScreen > 0;
	}
	,goToWorld: function(id,force) {
		if(force == null) force = false;
		this._targetLevelsPos = id * co.doubleduck.BaseGame.getViewport().width * -1;
		this._currLevelScreen = id;
		if(force) this._levelsLayer.x = this._targetLevelsPos; else if(!this._isMoving) {
			this.onTick = $bind(this,this.handleTick);
			this._isMoving = true;
		}
	}
	,handleLevelClick: function(e) {
		var levelID = Std.parseInt(e.target.name);
		this._chosenLevel = levelID;
		if(this._themeMusic != null) this._themeMusic.stop();
		var screensData = co.doubleduck.DataLoader.getHelpForLevel(this._chosenLevel);
		if(this._chosenLevel == (screensData.fromLevel | 0)) {
			if(this._justViewedTutor) this._justViewedTutor = false; else {
				this._justViewedTutor = true;
				this._levelAfterTutor = this._chosenLevel;
				this.showHelpMenu();
				return;
			}
		}
		this._levelsLayer.mouseEnabled = false;
		if(co.doubleduck.SoundManager.available) this._muteBtn.onClick = null;
		this._helpBtn.onClick = null;
		if(co.doubleduck.SoundManager.available) createjs.Tween.get(this._muteBtn).to({ alpha : 0},140);
		createjs.Tween.get(this._helpBtn).to({ alpha : 0},140);
		createjs.Tween.get(this._menuRightBtn).to({ alpha : 0},140);
		createjs.Tween.get(this._menuLeftBtn).to({ alpha : 0},140);
		createjs.Tween.get(this._levelsLayer).to({ alpha : 0},500);
		if(this.onPlayClick != null) {
			var properties = { level : this._chosenLevel};
			this.onPlayClick(properties);
		}
	}
	,closeHelp: function() {
		co.doubleduck.BaseGame.hammer.onswipe = $bind(this,this.handleSwipe);
		this._isInHelp = false;
		createjs.Tween.removeTweens(this._helpScreen);
		createjs.Tween.removeTweens(this._helpBtn);
		createjs.Tween.get(this._helpScreen).to({ alpha : 0},1000,createjs.Ease.sineOut);
		this._helpBtn.onClick = $bind(this,this.showHelpMenu);
		this._levelsLayer.mouseEnabled = true;
		if(this._muteBtn != null) this._muteBtn.alpha = 1;
		if(this._justViewedTutor) {
			var e = { target : { name : "" + this._levelAfterTutor}};
			this.handleLevelClick(e);
		} else {
			this.setArrowBtnVisibility();
			this._helpBtn.alpha = 1;
		}
	}
	,showHelpMenu: function() {
		if(this._helpScreen != null) {
			this._helpScreen.visible = false;
			this.removeChild(this._helpScreen);
			this._helpScreen = null;
		}
		var screensData;
		if(this._justViewedTutor) screensData = co.doubleduck.DataLoader.getHelpForLevel(this._levelAfterTutor); else screensData = co.doubleduck.DataLoader.getHelpForLevel(co.doubleduck.Persistence.getUnlockedLevel());
		var screens = new Array();
		var _g1 = 0, _g = screensData.availableScreens.length;
		while(_g1 < _g) {
			var i = _g1++;
			screens.push("images/menu/help/help" + screensData.availableScreens[i] + ".png");
		}
		this._helpScreen = new co.doubleduck.PagedHelp("images/menu/help/help_board.png","images/menu/help/next.png","images/menu/help/got_it.png",screens);
		this._helpScreen.x = co.doubleduck.BaseGame.getViewport().width / 2;
		this._helpScreen.y = co.doubleduck.BaseGame.getViewport().height * 0.475;
		this._helpScreen.scaleX = this._helpScreen.scaleY = co.doubleduck.BaseGame.getScale();
		this._helpScreen.setButtonsPos(0.79,0.86);
		this._helpScreen.setMarkersPos(0.947);
		this._helpScreen.onGotIt = $bind(this,this.closeHelp);
		if(this._justViewedTutor) this._helpScreen.goToPage((screensData.focusOn | 0) - 1);
		this.addChild(this._helpScreen);
		this._helpScreen.alpha = 0;
		if(this._muteBtn != null) this._muteBtn.alpha = 0;
		this._helpScreen.enableSwipe();
		this._isInHelp = true;
		createjs.Tween.get(this._helpScreen).to({ alpha : 1},1000,createjs.Ease.sineOut);
		createjs.Tween.get(this._helpBtn).to({ alpha : 0},1000,createjs.Ease.sineOut);
		this._helpScreen.visible = true;
		this._helpBtn.onClick = null;
		this._levelsLayer.mouseEnabled = false;
		this._menuRightBtn.visible = this._menuLeftBtn.visible = false;
	}
	,handleMuteToggle: function() {
		co.doubleduck.SoundManager.toggleMute();
	}
	,handleSwipe: function(event) {
		if(event.direction == "left") this.goToNext(); else if(event.direction == "right") this.goToPrev();
	}
	,preLevelTutorial: function(level) {
		var e = { target : { name : "" + level}};
		this.handleLevelClick(e);
		this._helpBtn.visible = false;
	}
	,enableLevelClick: function() {
		this._levelsLayer.mouseEnabled = true;
	}
	,_chosenLevel: null
	,_levelsLayer: null
	,_currLevelScreen: null
	,_isMoving: null
	,_targetLevelsPos: null
	,_chaz: null
	,_menuLeftBtn: null
	,_menuRightBtn: null
	,_helpScreen: null
	,_helpBtn: null
	,_muteBtn: null
	,_snow: null
	,_back: null
	,_isInHelp: null
	,_themeMusic: null
	,_levelAfterTutor: null
	,_justViewedTutor: null
	,_levelButtons: null
	,__class__: co.doubleduck.Menu
});
co.doubleduck.Oven = $hxClasses["co.doubleduck.Oven"] = function() {
	var img;
	var initObject;
	img = co.doubleduck.BaseAssets.getRawImage("images/session/oven/oven.png");
	var imgWidth = 112;
	var imgHeight = 69;
	initObject = { };
	initObject.images = [img];
	initObject.frames = { width : imgWidth, height : imgHeight, regX : 0, regY : 0};
	initObject.animations = { };
	initObject.animations.idle = { frames : [0], frequency : 1};
	initObject.animations.cook = { frames : [1,2,3,4,3,2,1], frequency : 15, next : "cook"};
	var spritesheet = new createjs.SpriteSheet(initObject);
	createjs.BitmapAnimation.call(this,spritesheet);
	this.idle();
};
co.doubleduck.Oven.__name__ = ["co","doubleduck","Oven"];
co.doubleduck.Oven.__super__ = createjs.BitmapAnimation;
co.doubleduck.Oven.prototype = $extend(createjs.BitmapAnimation.prototype,{
	cook: function() {
		if(this.currentAnimation != "cook") this.gotoAndPlay("cook");
	}
	,idle: function() {
		this.gotoAndStop("idle");
	}
	,__class__: co.doubleduck.Oven
});
co.doubleduck.OvenSlot = $hxClasses["co.doubleduck.OvenSlot"] = function() {
	createjs.Container.call(this);
	this._slot = co.doubleduck.BaseAssets.getImage("images/session/oven/slot.png");
	this._slot.regY = this._slot.image.height / 2;
	this._slot.regX = this._slot.image.width / 2;
	this._slot.x += this._slot.image.width / 2;
	this._slot.mouseEnabled = true;
	this.addChild(this._slot);
	var barShadow = co.doubleduck.BaseAssets.getImage("images/session/oven/bar3.png");
	this.addChild(barShadow);
	barShadow.regY = barShadow.image.height / 2;
	barShadow.x = this._slot.x + this._slot.image.width / 2 + co.doubleduck.OvenSlot.SLOT_PADDING;
	this._barFill = co.doubleduck.BaseAssets.getImage("images/session/oven/bar2.png");
	this.addChild(this._barFill);
	this._barFill.regY = this._barFill.image.height / 2;
	this._barFill.x = barShadow.x;
	this._barMask = new createjs.Shape();
	this._barMask.graphics.beginFill("#000000");
	this._barMask.graphics.drawRect(0,0,this._barFill.image.width,this._barFill.image.height * 0.90);
	this._barMask.graphics.endFill();
	this._barMask.alpha = 0.5;
	this._barMask.regY = this._barFill.image.height;
	this._barMask.x = this._barFill.x;
	this._barMask.y = this._barFill.y + this._barFill.image.height * 0.53;
	this._barFill.mask = this._barMask;
	this._barMask.scaleY = 0.01;
	var barStroke = co.doubleduck.BaseAssets.getImage("images/session/oven/bar1.png");
	this.addChild(barStroke);
	barStroke.regY = barStroke.image.height / 2;
	barStroke.x = this._barFill.x;
};
co.doubleduck.OvenSlot.__name__ = ["co","doubleduck","OvenSlot"];
co.doubleduck.OvenSlot.__super__ = createjs.Container;
co.doubleduck.OvenSlot.prototype = $extend(createjs.Container.prototype,{
	popPizza: function() {
		this.disablePizzaCooking();
		this.removeChild(this._pizza);
		this._barMask.scaleY = 0.01;
		this._pizza = null;
		var result = this._myPizza.copy();
		this._myPizza = null;
		return result;
	}
	,occupied: function() {
		return this._myPizza != null;
	}
	,tick: function(elapsed) {
		var oldStatus = this._myPizza.getStatus();
		var elapsedSecs = elapsed / 1000;
		var totalBakingTimeSecs = co.doubleduck.DataLoader.getLevel(co.doubleduck.Session.level).pizzaCookDuration | 0;
		var elapsedCooking = elapsedSecs / totalBakingTimeSecs;
		var currReadyness = this._myPizza.getReadyness();
		currReadyness += elapsedCooking;
		this._myPizza.setReadyness(currReadyness);
		if(currReadyness > 1) {
			var burn = (currReadyness - 1) * 2;
			this._pizza.setBurnProgression(burn);
		} else if(currReadyness >= 1.5) this._pizza.setBurnProgression(0);
		var newStatus = this._myPizza.getStatus();
		if(newStatus != oldStatus) this._pizza.updateStatus(newStatus);
		var newScale = currReadyness;
		if(newScale == 0) newScale = 0.01; else if(newScale > 1) newScale = 1;
		this._barMask.scaleY = newScale;
	}
	,disablePizzaCooking: function() {
		createjs.Ticker.removeListener(this);
	}
	,enablePizzaCooking: function() {
		createjs.Ticker.addListener(this);
	}
	,addPizza: function(pizza) {
		this._pizza = new co.doubleduck.SmallPizza(pizza.getStatus(),pizza.getToppings());
		this._pizza.x = this._slot.x;
		this._pizza.y = this._slot.y;
		this.addChild(this._pizza);
	}
	,acceptPizza: function(pizza) {
		if(this._myPizza != null || pizza == null) return false; else this._myPizza = pizza;
		this.addPizza(pizza);
		this.enablePizzaCooking();
		return true;
	}
	,getGlobalCenter: function() {
		var center = this.localToGlobal(this._slot.x,this._slot.y);
		return center;
	}
	,getWidth: function() {
		return this._slot.image.width + co.doubleduck.OvenSlot.SLOT_PADDING + this._barFill.image.width;
	}
	,_pizza: null
	,_slot: null
	,_barMask: null
	,_barFill: null
	,_myPizza: null
	,__class__: co.doubleduck.OvenSlot
});
co.doubleduck.PagedHelp = $hxClasses["co.doubleduck.PagedHelp"] = function(backUri,nextBtnUri,gotItBtnUri,pages) {
	createjs.Container.call(this);
	this._background = co.doubleduck.BaseAssets.getImage(backUri);
	this.addChild(this._background);
	this.regX = this._background.image.width / 2;
	this.regY = this._background.image.height / 2;
	this._contentLayer = new createjs.Container();
	if(pages.length > 0) {
		var _g1 = 0, _g = pages.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.addPage(pages[i],i);
		}
		this.addChild(this._contentLayer);
		this._pagesCount = pages.length;
		this._mask = new createjs.Shape();
		this._mask.graphics.beginFill("#000000");
		this._mask.graphics.drawRect(20,20,this._background.image.width - 40,this._background.image.height - 40);
		this._mask.graphics.endFill();
		this._contentLayer.mask = this._mask;
	} else this._pagesCount = 0;
	if(nextBtnUri != null && nextBtnUri != "") {
		this._nextBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage(nextBtnUri),true,co.doubleduck.Button.CLICK_TYPE_SCALE);
		this._nextBtn.regX = this._nextBtn.image.width / 2;
		this._nextBtn.regY = this._nextBtn.image.height / 2;
		this._nextBtn.onClick = $bind(this,this.handleNextClick);
		this.addChild(this._nextBtn);
	}
	this._gotItBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage(gotItBtnUri),true,co.doubleduck.Button.CLICK_TYPE_SCALE);
	this._gotItBtn.regX = this._gotItBtn.image.width / 2;
	this._gotItBtn.regY = this._gotItBtn.image.height / 2;
	this._gotItBtn.onClick = $bind(this,this.handleGotItClick);
	this.addChild(this._gotItBtn);
	this.setButtonsPos();
	this._currPage = 0;
	this.enableSwipe();
	this.addPageMarkers();
	this.setButtonsVis();
};
co.doubleduck.PagedHelp.__name__ = ["co","doubleduck","PagedHelp"];
co.doubleduck.PagedHelp.__super__ = createjs.Container;
co.doubleduck.PagedHelp.prototype = $extend(createjs.Container.prototype,{
	createPageMarker: function() {
		var img = co.doubleduck.BaseAssets.getRawImage("images/duckling/page_marker.png");
		var initObject = { };
		initObject.images = [img];
		initObject.frames = { width : 16, height : 18};
		initObject.animations = { };
		initObject.animations.idle = { frames : 0, frequency : 20};
		initObject.animations.active = { frames : 1, frequency : 20};
		var pageMarker = new createjs.BitmapAnimation(new createjs.SpriteSheet(initObject));
		pageMarker.gotoAndStop("idle");
		return pageMarker;
	}
	,handleNextClick: function() {
		this._currPage++;
		if(this._currPage >= this._pagesCount) {
			this._currPage = this._pagesCount - 1;
			return;
		}
		this._pageMarkers[this._currPage - 1].gotoAndStop("idle");
		this._pageMarkers[this._currPage].gotoAndStop("active");
		createjs.Tween.get(this._contentLayer).to({ x : -1 * this._background.image.width * this._currPage},200,createjs.Ease.sineOut);
		this.setButtonsVis();
	}
	,handlePrevClick: function() {
		this._currPage--;
		if(this._currPage < 0) {
			this._currPage = 0;
			return;
		}
		this._pageMarkers[this._currPage + 1].gotoAndStop("idle");
		this._pageMarkers[this._currPage].gotoAndStop("active");
		createjs.Tween.get(this._contentLayer).to({ x : -1 * this._background.image.width * this._currPage},200,createjs.Ease.sineOut);
		this.setButtonsVis();
	}
	,setButtonsVis: function() {
		if(this._pagesCount == 0) {
			this._gotItBtn.visible = true;
			return;
		}
		if(this._currPage == this._pagesCount - 1) {
			this._gotItBtn.visible = true;
			this._nextBtn.visible = false;
		} else {
			this._gotItBtn.visible = false;
			this._nextBtn.visible = true;
		}
	}
	,handleSwipe: function(event) {
		if(event.direction == "left") this.handleNextClick(); else if(event.direction == "right") this.handlePrevClick();
	}
	,handleGotItClick: function() {
		if(this.onGotIt != null) this.onGotIt();
	}
	,addPageMarkers: function() {
		if(this._pagesCount == 0) return;
		this._pageMarkers = new Array();
		var totalWidth = 0;
		this._markersLayer = new createjs.Container();
		var _g1 = 0, _g = this._pagesCount;
		while(_g1 < _g) {
			var currPage = _g1++;
			var pageMarker = this.createPageMarker();
			this._pageMarkers.push(pageMarker);
			if(currPage != 0) {
				pageMarker.x = this._pageMarkers[currPage - 1].x + this._pageMarkers[currPage - 1].spriteSheet._frameWidth + 5;
				totalWidth += 5;
			}
			totalWidth += pageMarker.spriteSheet._frameWidth;
			this._markersLayer.addChild(pageMarker);
		}
		this._markersLayer.y = this._background.image.height * 0.80;
		this._markersLayer.x = this._background.image.width / 2;
		this._markersLayer.regX = totalWidth / 2;
		this.addChild(this._markersLayer);
		this._pageMarkers[0].gotoAndStop("active");
	}
	,addPage: function(pageUri,index) {
		var page = co.doubleduck.BaseAssets.getImage(pageUri);
		page.x += this._background.image.width * index;
		this._contentLayer.addChild(page);
	}
	,goToPage: function(page) {
		this._pageMarkers[this._currPage].gotoAndStop("idle");
		this._currPage = page;
		this._pageMarkers[this._currPage].gotoAndStop("active");
		this._contentLayer.x = -1 * this._background.image.width * this._currPage;
		this.setButtonsVis();
	}
	,changeContentMask: function(topPad,bottomPad,leftPad,rightPad) {
		this._mask.graphics.clear();
		this._mask.graphics.beginFill("#000000");
		this._mask.graphics.drawRect(leftPad,topPad,this._background.image.width - (rightPad + leftPad),this._background.image.height - (bottomPad + topPad));
		this._mask.graphics.endFill();
	}
	,rewindPages: function() {
		this.goToPage(0);
	}
	,enableSwipe: function() {
		co.doubleduck.BaseGame.hammer.onswipe = $bind(this,this.handleSwipe);
	}
	,setMarkersPos: function(percentY,percentX) {
		if(percentX == null) percentX = 0.5;
		this._markersLayer.y = this._background.image.height * percentY;
		this._markersLayer.x = this._background.image.width * percentX;
	}
	,setButtonsPos: function(percentX,percentY) {
		if(percentY == null) percentY = 0.5;
		if(percentX == null) percentX = 0.5;
		if(this._nextBtn != null) {
			this._nextBtn.x = this._background.image.width * percentX;
			this._nextBtn.y = this._background.image.height * percentY;
		}
		this._gotItBtn.x = this._background.image.width * percentX;
		this._gotItBtn.y = this._background.image.height * percentY;
	}
	,_currPage: null
	,_pagesCount: null
	,_gotItBtn: null
	,_nextBtn: null
	,_pageMarkers: null
	,_markersLayer: null
	,_mask: null
	,_contentLayer: null
	,_background: null
	,onGotIt: null
	,__class__: co.doubleduck.PagedHelp
});
co.doubleduck.Persistence = $hxClasses["co.doubleduck.Persistence"] = function() { }
co.doubleduck.Persistence.__name__ = ["co","doubleduck","Persistence"];
co.doubleduck.Persistence.initGameData = function() {
	co.doubleduck.BasePersistence.GAME_PREFIX = "DDPizza_";
	if(!co.doubleduck.BasePersistence.available) return;
	co.doubleduck.BasePersistence.initVar("unlockedLVL","1");
	var _g1 = 0, _g = co.doubleduck.DataLoader.getLevelCount();
	while(_g1 < _g) {
		var i = _g1++;
		co.doubleduck.BasePersistence.initVar("starRating" + (i + 1),"0");
	}
}
co.doubleduck.Persistence.getUnlockedLevel = function() {
  var lvl = Std.parseInt(co.doubleduck.BasePersistence.getValue("unlockedLVL"));
	return lvl || 1;
}
co.doubleduck.Persistence.setUnlockedLevel = function(newLevel) {
	co.doubleduck.BasePersistence.setValue("unlockedLVL","" + newLevel);
}
co.doubleduck.Persistence.getStarRating = function(lvl) {
	return Std.parseInt(co.doubleduck.BasePersistence.getValue("starRating" + lvl));
}
co.doubleduck.Persistence.setStarRating = function(lvl,rating) {
	co.doubleduck.BasePersistence.setValue("starRating" + lvl,"" + rating);
}
co.doubleduck.Persistence.__super__ = co.doubleduck.BasePersistence;
co.doubleduck.Persistence.prototype = $extend(co.doubleduck.BasePersistence.prototype,{
	__class__: co.doubleduck.Persistence
});
co.doubleduck.Pizza = $hxClasses["co.doubleduck.Pizza"] = function() {
	this._status = co.doubleduck.PizzaStatus.RAW;
	this._readyness = 0;
	this._toppings = new Array();
};
co.doubleduck.Pizza.__name__ = ["co","doubleduck","Pizza"];
co.doubleduck.Pizza.prototype = {
	equals: function(otherPizza) {
		var result = true;
		if(otherPizza.getToppings().length == 0 && this.getToppings().length == 0) return true; else if(otherPizza.getToppings().length != this.getToppings().length) return false;
		var _g = 0, _g1 = this.getToppings();
		while(_g < _g1.length) {
			var currTopping = _g1[_g];
			++_g;
			var foundTopping = false;
			var _g2 = 0, _g3 = otherPizza.getToppings();
			while(_g2 < _g3.length) {
				var otherTopping = _g3[_g2];
				++_g2;
				if(currTopping == otherTopping) {
					foundTopping = true;
					break;
				}
			}
			if(!foundTopping) return false;
		}
		return true;
	}
	,copy: function() {
		var copy = new co.doubleduck.Pizza();
		copy._status = this._status;
		copy._readyness = this._readyness;
		if(this._toppings != null) copy._toppings = this._toppings.slice();
		return copy;
	}
	,getStatus: function() {
		return this._status;
	}
	,getReadyness: function() {
		return this._readyness;
	}
	,setReadyness: function(readyness) {
		this._readyness = readyness;
		if(this._readyness >= 1.5) this._status = co.doubleduck.PizzaStatus.BURNT; else if(this._readyness >= 0.8) this._status = co.doubleduck.PizzaStatus.COOKED; else if(this._readyness >= 0.4) this._status = co.doubleduck.PizzaStatus.HALF_COOKED; else this._status = co.doubleduck.PizzaStatus.RAW;
	}
	,getToppings: function() {
		return this._toppings;
	}
	,addTopping: function(topping) {
		var exists = false;
		if(this._toppings.length == co.doubleduck.Pizza.MAX_TOPPINGS) return true;
		var _g = 0, _g1 = this._toppings;
		while(_g < _g1.length) {
			var currTopping = _g1[_g];
			++_g;
			if(currTopping == topping) {
				exists = true;
				break;
			}
		}
		if(!exists) this._toppings.push(topping);
		return exists;
	}
	,_status: null
	,_readyness: null
	,_toppings: null
	,__class__: co.doubleduck.Pizza
}
co.doubleduck.Session = $hxClasses["co.doubleduck.Session"] = function(properties) {
	this._money = 0;
	this._isPaused = false;
	this._sessionEnded = false;
	this._workAreaPizza = null;
	co.doubleduck.BaseSession.call(this);
	this._levelData = co.doubleduck.DataLoader.getLevel(properties.level | 0);
	co.doubleduck.Session.level = properties.level | 0;
	this.constructLevel();
	this._remainingTime = this._levelData.duration | 0;
	this._customerSlots = [null,null,null];
	this._levelStars = this._levelData.stars;
	this._hud = new co.doubleduck.HUD(this._levelStars);
	this._hud.onPauseClick = $bind(this,this.handlePauseClick);
	this.addChild(this._hud);
	this.levelTimer();
	this.spawnTimer();
	this._hud.setScore(0);
	this._ldb = new LevelDB();
};
co.doubleduck.Session.__name__ = ["co","doubleduck","Session"];
co.doubleduck.Session.getLastLevel = function() {
	return co.doubleduck.Session.level;
}
co.doubleduck.Session.__super__ = co.doubleduck.BaseSession;
co.doubleduck.Session.prototype = $extend(co.doubleduck.BaseSession.prototype,{
	setRestartCB: function(cb) {
		this._hud.onRestart = cb;
	}
	,setMenuCB: function(cb) {
		this._hud.onMenuClick = cb;
	}
	,resume: function() {
		if(this._isPaused) {
			this._isPaused = false;
			createjs.Ticker.setPaused(false);
			this._buttonContainer.mouseEnabled = true;
			this._hud.setPauseOverlay(false);
		}
	}
	,pause: function() {
		if(this._sessionEnded) return;
		if(!this._isPaused) {
			this._isPaused = true;
			createjs.Ticker.setPaused(true);
			this._buttonContainer.mouseEnabled = false;
			this._hud.setPauseOverlay(true);
		}
	}
	,handlePauseClick: function() {
		this.removeChild(this._hud);
		this.addChild(this._hud);
		if(this._isPaused) this.resume(); else this.pause();
	}
	,destroy: function() {
		this._sessionEnded = true;
		createjs.Ticker.removeListener(this);
		this.onRestart = null;
		this.onBackToMenu = null;
		this.onSessionEnd = null;
		var _g1 = 0, _g = this._customerSlots.length;
		while(_g1 < _g) {
			var currCustomer = _g1++;
			if(this._customerSlots[currCustomer] != null) this._customerSlots[currCustomer].destroy();
		}
	}
	,handleLiquidReached: function(e) {
		this.enableLiquids();
	}
	,enableLiquids: function() {
		var _g = 0, _g1 = this._liquidsOccupying;
		while(_g < _g1.length) {
			var liquid = _g1[_g];
			++_g;
			liquid.mouseEnabled = true;
		}
	}
	,disableLiquids: function() {
		var _g = 0, _g1 = this._liquidsOccupying;
		while(_g < _g1.length) {
			var liquid = _g1[_g];
			++_g;
			liquid.mouseEnabled = false;
		}
	}
	,handleLiquidClicked: function(e) {
		co.doubleduck.SoundManager.playEffect("sound/drink");
		this.disableLiquids();
		var liquidClicked = e.target;
		if(this._workAreaLiquid == null) {
			createjs.Tween.get(liquidClicked).to({ scaleX : co.doubleduck.Session.LIQUID_SCALE * co.doubleduck.BaseGame.getScale(), scaleY : co.doubleduck.Session.LIQUID_SCALE * co.doubleduck.BaseGame.getScale()},150);
			createjs.Tween.get(liquidClicked).to({ y : liquidClicked.y - 50 * co.doubleduck.BaseGame.getScale()},150);
			createjs.Tween.get(liquidClicked).to({ x : this._liquidLocation[0].x - 40 * co.doubleduck.BaseGame.getScale()},150).call($bind(this,this.handleLiquidReached));
			this._workAreaLiquid = liquidClicked;
		} else if(liquidClicked == this._workAreaLiquid) {
			var index = 0;
			var _g1 = 0, _g = this._liquidsOccupying.length;
			while(_g1 < _g) {
				var liquidIndex = _g1++;
				var liquid = this._liquidsOccupying[liquidIndex];
				if(liquid == liquidClicked) {
					index = liquidIndex;
					break;
				}
			}
			this._workAreaLiquid = null;
			var pos = this._liquidLocation[index];
			createjs.Tween.get(liquidClicked).to({ scaleX : co.doubleduck.BaseGame.getScale(), scaleY : co.doubleduck.BaseGame.getScale()},150);
			createjs.Tween.get(liquidClicked).to({ y : pos.y},150);
			createjs.Tween.get(liquidClicked).to({ x : pos.x},150).call($bind(this,this.handleLiquidReached));
		} else {
			createjs.Tween.get(liquidClicked).to({ scaleX : co.doubleduck.Session.LIQUID_SCALE * co.doubleduck.BaseGame.getScale(), scaleY : co.doubleduck.Session.LIQUID_SCALE * co.doubleduck.BaseGame.getScale()},150);
			createjs.Tween.get(liquidClicked).to({ y : liquidClicked.y - 50 * co.doubleduck.BaseGame.getScale()},150);
			createjs.Tween.get(liquidClicked).to({ x : this._liquidLocation[0].x - 40 * co.doubleduck.BaseGame.getScale()},150).call($bind(this,this.handleLiquidReached));
			var oldLiquid = this._workAreaLiquid;
			var index = 0;
			this._workAreaLiquid = liquidClicked;
			var _g1 = 0, _g = this._liquidsOccupying.length;
			while(_g1 < _g) {
				var liquidIndex = _g1++;
				var liquid = this._liquidsOccupying[liquidIndex];
				if(liquid == oldLiquid) {
					index = liquidIndex;
					break;
				}
			}
			var pos = this._liquidLocation[index];
			createjs.Tween.get(oldLiquid).to({ scaleX : co.doubleduck.BaseGame.getScale(), scaleY : co.doubleduck.BaseGame.getScale()},150);
			createjs.Tween.get(oldLiquid).to({ y : pos.y},150);
			createjs.Tween.get(oldLiquid).to({ x : pos.x},150).call($bind(this,this.handleLiquidReached));
		}
	}
	,handleToppingClicked: function(e) {
		if(this._workAreaPizza != null && (this._workAreaPizza.getReadyness() != 0 || this._workAreaPizza.getStatus() == co.doubleduck.PizzaStatus.BURNT)) return;
		var clickedTopping = e.target;
		var type = clickedTopping.getType();
		if(this._workAreaPizza != null && this._workAreaPizzaDisplay != null) {
			var alreadyOnPizza = this._workAreaPizza.addTopping(type);
			if(!alreadyOnPizza) {
				co.doubleduck.SoundManager.playEffect("sound/topping1");
				this._workAreaPizzaDisplay.addTopping(type);
			}
		}
	}
	,updateOven: function() {
		var active = false;
		var _g = 0, _g1 = this._ovenSlots;
		while(_g < _g1.length) {
			var currSlot = _g1[_g];
			++_g;
			if(currSlot.occupied()) {
				active = true;
				break;
			}
		}
		if(active) this._oven.cook(); else this._oven.idle();
	}
	,addBigPizza: function() {
		this._workAreaPizzaDisplay = new co.doubleduck.BigPizza(this._workAreaPizza.getStatus(),this._workAreaPizza.getToppings(),this._workAreaPizza.getReadyness() == 0);
		this.addChild(this._workAreaPizzaDisplay);
		this._workAreaPizzaDisplay.scaleX = this._workAreaPizzaDisplay.scaleY = co.doubleduck.BaseGame.getScale();
		this._workAreaPizzaDisplay.x = this._desk.x - this._desk.image.width * 0.4 * co.doubleduck.BaseGame.getScale();
		this._workAreaPizzaDisplay.y = this._desk.y + 10 * co.doubleduck.BaseGame.getScale();
	}
	,handleDoughClicked: function() {
		if(this._workAreaPizza == null) {
			this._workAreaPizza = new co.doubleduck.Pizza();
			this.addBigPizza();
		}
	}
	,handleTrashClick: function() {
		this._workAreaPizza = null;
		this.removeChild(this._workAreaPizzaDisplay);
		this._workAreaPizzaDisplay = null;
	}
	,handleOvenClicked: function() {
		var _g = 0, _g1 = this._ovenSlots;
		while(_g < _g1.length) {
			var currSlot = _g1[_g];
			++_g;
			if(!currSlot.occupied()) {
				this.sendToSlot(currSlot);
				break;
			}
		}
	}
	,takeFromSlot: function(slot) {
		if(this._workAreaPizza != null || !slot.occupied()) return;
		co.doubleduck.SoundManager.playEffect("sound/outOfTheOven");
		this._workAreaPizza = slot.popPizza();
		this.addBigPizza();
		this.updateOven();
	}
	,sendToSlot: function(slot) {
		var pizzaAccepted = false;
		pizzaAccepted = slot.acceptPizza(this._workAreaPizza);
		if(pizzaAccepted) {
			co.doubleduck.SoundManager.playEffect("sound/inTheOven");
			this.removeChild(this._workAreaPizzaDisplay);
			this._workAreaPizza = null;
			this.updateOven();
		}
	}
	,handleOvenSlotClicked: function(e) {
		if(this._lastClickPos == null) this._lastClickPos = new createjs.Point(0,0);
		if((this._lastClickPos.x < e.stageX + 1 || this._lastClickPos.x > e.stageX + 1) && (this._lastClickPos.y < e.stageY + 1 || this._lastClickPos.y > e.stageY + 1)) {
			var now = createjs.Ticker.getTime(true);
			if(now < this._lastClickTime + 500) return;
		}
		this._lastClickPos.x = e.stageX;
		this._lastClickPos.y = e.stageY;
		this._lastClickTime = createjs.Ticker.getTime(true);
		var clickedSlot = e.target;
		if(clickedSlot.occupied() && this._workAreaPizza == null) this.takeFromSlot(clickedSlot); else if(this._workAreaPizza != null) this.sendToSlot(clickedSlot);
	}
	,constructLevel: function() {
		this._buttonContainer = new createjs.Container();
		this._background = co.doubleduck.Utils.getCenteredImage("images/session/bg.jpg",true);
		this.addChild(this._background);
		this._background.x = co.doubleduck.BaseGame.getViewport().width / 2;
		this._background.y = co.doubleduck.BaseGame.getViewport().height / 2;
		this._customerLayer = new createjs.Container();
		this.addChild(this._customerLayer);
		this._desk = co.doubleduck.BaseAssets.getImage("images/session/desk/desk.png");
		this._desk.scaleX = this._desk.scaleY = co.doubleduck.BaseGame.getScale();
		this.addChild(this._desk);
		this._desk.regX = this._desk.image.width / 2;
		this._desk.x = this._background.x;
		this._desk.y = this._background.y - this._background.image.height * 0.05 * co.doubleduck.BaseGame.getScale();
		this.addChild(this._desk);
		var trashCan = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/desk/trash.png"),true,3);
		trashCan.regX = trashCan.image.width;
		trashCan.regY = trashCan.image.height;
		trashCan.scaleX = trashCan.scaleY = co.doubleduck.BaseGame.getScale();
		this._buttonContainer.addChild(trashCan);
		trashCan.x = this._desk.x + this._desk.image.width * 0.45 * co.doubleduck.BaseGame.getScale();
		trashCan.y = this._desk.y + this._desk.image.height * 0.49 * co.doubleduck.BaseGame.getScale();
		trashCan.onClick = $bind(this,this.handleTrashClick);
		var toppingStartX = this._desk.x - this._desk.image.width * 0.48 * co.doubleduck.BaseGame.getScale();
		var toppingStartY = this._desk.y + this._desk.image.height * 0.17 * co.doubleduck.BaseGame.getScale();
		var dough = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/desk/toppings/dough.png"),true,2,"sound/dough");
		dough.scaleX = dough.scaleY = co.doubleduck.BaseGame.getScale();
		dough.regY = dough.image.height * 0.2;
		this._buttonContainer.addChild(dough);
		dough.x = toppingStartX;
		dough.y = toppingStartY;
		dough.onClick = $bind(this,this.handleDoughClicked);
		var paddingX = 78 * co.doubleduck.BaseGame.getScale();
		var paddingY = 69 * co.doubleduck.BaseGame.getScale();
		var _g = 1;
		while(_g < 6) {
			var currTopping = _g++;
			var currToppingX = toppingStartX + paddingX * (currTopping % 3);
			var currToppingY = toppingStartY + paddingY * (currTopping / 3 | 0);
			if(currTopping > (this._levelData.toppings.length | 0)) {
				var emptyContainer = co.doubleduck.BaseAssets.getImage("images/session/desk/toppings/empty.png");
				emptyContainer.x = currToppingX;
				emptyContainer.y = currToppingY;
				emptyContainer.scaleX = emptyContainer.scaleY = co.doubleduck.BaseGame.getScale();
				this.addChild(emptyContainer);
			} else {
				var toppingName = this._levelData.toppings[currTopping - 1 | 0];
				var newTopping = co.doubleduck.Topping.createTopping(co.doubleduck.DataLoader.getToppingByName(toppingName).id | 0);
				newTopping.x = currToppingX;
				newTopping.y = currToppingY;
				newTopping.scaleX = newTopping.scaleY = co.doubleduck.BaseGame.getScale();
				this._buttonContainer.addChild(newTopping);
				newTopping.onClick = $bind(this,this.handleToppingClicked);
			}
		}
		var liquidStartX = trashCan.x - 148 * co.doubleduck.BaseGame.getScale();
		var liquidStartY = trashCan.y - 200 * co.doubleduck.BaseGame.getScale();
		var liquidPaddingX = 56 * co.doubleduck.BaseGame.getScale();
		var numLiquids = this._levelData.liquids.length | 0;
		if(numLiquids > 0) {
			this._liquidLocation = new Array();
			this._liquidsOccupying = new Array();
			var _g1 = 0, _g = this._levelData.liquids.length | 0;
			while(_g1 < _g) {
				var currLiquidIndex = _g1++;
				var liquidName = this._levelData.liquids[currLiquidIndex];
				var currLiquid = co.doubleduck.Liquid.createLiquid(co.doubleduck.DataLoader.getLiquidByName(liquidName).id | 0);
				currLiquid.scaleX = currLiquid.scaleY = co.doubleduck.BaseGame.getScale();
				currLiquid.y = liquidStartY;
				currLiquid.x = liquidStartX + liquidPaddingX * currLiquidIndex;
				if(currLiquidIndex > 0) this._buttonContainer.addChildAt(currLiquid,this._buttonContainer.getChildIndex(this._liquidsOccupying[currLiquidIndex - 1 | 0])); else this._buttonContainer.addChild(currLiquid);
				this._liquidLocation.push(new createjs.Point(currLiquid.x,currLiquid.y));
				this._liquidsOccupying.push(currLiquid);
				currLiquid.onClick = $bind(this,this.handleLiquidClicked);
			}
		}
		this._oven = new co.doubleduck.Oven();
		this._buttonContainer.addChild(this._oven);
		this._oven.scaleX = this._oven.scaleY = co.doubleduck.BaseGame.getScale();
		this._oven.x = this._desk.x - this._desk.image.width * 0.48 * co.doubleduck.BaseGame.getScale();
		this._oven.y = this._desk.y + this._desk.image.height * 0.57 * co.doubleduck.BaseGame.getScale();
		this._oven.onClick = $bind(this,this.handleOvenClicked);
		this._ovenSlots = new Array();
		var _g = 0;
		while(_g < 3) {
			var i = _g++;
			var ovenSlot = new co.doubleduck.OvenSlot();
			ovenSlot.scaleX = ovenSlot.scaleY = co.doubleduck.BaseGame.getScale();
			this._buttonContainer.addChild(ovenSlot);
			ovenSlot.x = this._oven.x + (this._oven.spriteSheet._frameWidth + 10) * co.doubleduck.BaseGame.getScale() + ovenSlot.getWidth() * co.doubleduck.BaseGame.getScale() * i;
			ovenSlot.y = this._oven.y + this._oven.spriteSheet._frameHeight / 2 * co.doubleduck.BaseGame.getScale();
			this._ovenSlots.push(ovenSlot);
			ovenSlot.onClick = $bind(this,this.handleOvenSlotClicked);
		}
		this.addChild(this._buttonContainer);
	}
	,pauseCustomers: function() {
		var _g = 0, _g1 = this._customerLayer.children;
		while(_g < _g1.length) {
			var currCustomer = _g1[_g];
			++_g;
			var customer = currCustomer;
			customer.pause();
		}
	}
	,stopOven: function() {
		this._oven.mouseEnabled = false;
		this._oven.idle();
		var _g = 0, _g1 = this._ovenSlots;
		while(_g < _g1.length) {
			var ovenSlot = _g1[_g];
			++_g;
			createjs.Ticker.removeListener(ovenSlot);
			ovenSlot.mouseEnabled = false;
		}
	}
	,showEndScreen: function() {
		co.doubleduck.SoundManager.playEffect("sound/end_tune");
		var black = new createjs.Shape();
		black.graphics.beginFill("#000000");
		black.graphics.drawRect(0,0,co.doubleduck.BaseGame.getViewport().width,co.doubleduck.BaseGame.getViewport().height);
		black.graphics.endFill();
		black.alpha = 0.2;
		this.addChild(black);
		var stars = this.getLevelStars();
		var endScreen = new createjs.Container();
		this.addChild(endScreen);
		var sign = co.doubleduck.BaseAssets.getImage("images/session/end_screen/end_screen.png");
		sign.scaleX = sign.scaleY = co.doubleduck.BaseGame.getScale();
		sign.regX = sign.image.width / 2;
		sign.regY = sign.image.height * 0.7;
		var destX = co.doubleduck.BaseGame.getViewport().width / 2;
		var destY = co.doubleduck.BaseGame.getViewport().height / 2;
		endScreen.x = destX;
		endScreen.y = 0 - sign.image.height * co.doubleduck.BaseGame.getScale() * 0.7;
		var fallDuration = 800;
		createjs.Tween.get(endScreen).to({ y : destY},fallDuration,createjs.Ease.getElasticOut(1.0,0.95));
		endScreen.addChild(sign);
		if(stars == 0) {
			var loseImg = co.doubleduck.BaseAssets.getImage("images/session/end_screen/lose.png");
			endScreen.addChild(loseImg);
			loseImg.scaleX = loseImg.scaleY = co.doubleduck.BaseGame.getScale();
			co.doubleduck.Utils.setCenterReg(loseImg);
			loseImg.x = sign.x;
			loseImg.y = sign.y - 100 * co.doubleduck.BaseGame.getScale();
		} else {
			var rainbow = co.doubleduck.BaseAssets.getImage("images/session/end_screen/rainbow.png");
			co.doubleduck.Utils.setCenterReg(rainbow);
			rainbow.scaleX = rainbow.scaleY = co.doubleduck.BaseGame.getScale();
			rainbow.x = sign.x;
			rainbow.y = sign.y - 50 * co.doubleduck.BaseGame.getScale();
			endScreen.addChild(rainbow);
			var rainbowMask = new createjs.Shape();
			rainbowMask.graphics.beginFill("#000000");
			rainbowMask.graphics.drawRect(0,0,rainbow.image.width,rainbow.image.height);
			rainbowMask.graphics.endFill();
			rainbowMask.scaleX = rainbowMask.scaleY = co.doubleduck.BaseGame.getScale();
			rainbowMask.x = rainbow.x - rainbow.image.width / 2 * co.doubleduck.BaseGame.getScale();
			rainbowMask.y = rainbow.y - rainbow.image.height / 2 * co.doubleduck.BaseGame.getScale();
			rainbow.mask = rainbowMask;
			rainbowMask.scaleX = 0.01;
			createjs.Tween.get(rainbowMask).wait(fallDuration + 200).to({ scaleX : co.doubleduck.BaseGame.getScale()},300,createjs.Ease.sineOut);
			var currScale = co.doubleduck.BaseGame.getScale();
			var targetScale = 1.5 * co.doubleduck.BaseGame.getScale();
			if(stars == 3) {
				var star3 = co.doubleduck.Utils.getCenteredImage("images/session/end_screen/star3.png",true);
				star3.x = rainbow.x + 82 * co.doubleduck.BaseGame.getScale();
				star3.y = rainbow.y - 59 * co.doubleduck.BaseGame.getScale();
				endScreen.addChild(star3);
				star3.alpha = 0;
				createjs.Tween.get(star3).wait(fallDuration + 1400).to({ alpha : 1},10).call(co.doubleduck.SoundManager.playEffect,["sound/star3"]).to({ scaleX : targetScale, scaleY : targetScale},90).to({ scaleX : currScale, scaleY : currScale},140).wait(200).call(co.doubleduck.SoundManager.playEffect,["sound/3starsTune"]);
			}
			if(stars >= 2) {
				var star2 = co.doubleduck.Utils.getCenteredImage("images/session/end_screen/star2.png",true);
				star2.x = rainbow.x - 10 * co.doubleduck.BaseGame.getScale();
				star2.y = rainbow.y - 68 * co.doubleduck.BaseGame.getScale();
				endScreen.addChild(star2);
				star2.alpha = 0;
				createjs.Tween.get(star2).wait(fallDuration + 1000).to({ alpha : 1},10).call(co.doubleduck.SoundManager.playEffect,["sound/star2"]).to({ scaleX : targetScale, scaleY : targetScale},90).to({ scaleX : currScale, scaleY : currScale},140);
			}
			if(stars >= 1) {
				var star1 = co.doubleduck.Utils.getCenteredImage("images/session/end_screen/star1.png",true);
				star1.x = rainbow.x - 90 * co.doubleduck.BaseGame.getScale();
				star1.y = rainbow.y - 52 * co.doubleduck.BaseGame.getScale();
				endScreen.addChild(star1);
				star1.alpha = 0;
				createjs.Tween.get(star1).wait(fallDuration + 600).to({ alpha : 1},10).call(co.doubleduck.SoundManager.playEffect,["sound/star1"]).to({ scaleX : targetScale, scaleY : targetScale},90).to({ scaleX : currScale, scaleY : currScale},140);
			}
		}
		var dims = new createjs.Rectangle(0,0,0,0);
		var moneyFont = new co.doubleduck.FontHelper("images/session/UI/timer_font/");
		var money = moneyFont.getNumber(this._money,1,true,dims,-2);
		var dollar = co.doubleduck.BaseAssets.getImage("images/session/UI/timer_font/dollar.png");
		money.scaleX = money.scaleY = co.doubleduck.BaseGame.getScale();
		money.x = sign.x;
		money.y = sign.y + 19 * co.doubleduck.BaseGame.getScale();
		money.x += dollar.image.width / 2 * co.doubleduck.BaseGame.getScale();
		co.doubleduck.Utils.setCenterReg(dollar);
		dollar.regX = dollar.image.width;
		dollar.scaleX = dollar.scaleY = co.doubleduck.BaseGame.getScale();
		endScreen.addChild(money);
		endScreen.addChild(dollar);
		dollar.y = money.y;
		dollar.x = money.x - dims.width / 2 * co.doubleduck.BaseGame.getScale();
		var menu = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/end_screen/menu.png"));
		var restart = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/end_screen/restart.png"));
		var next = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/end_screen/next.png"));
		menu.onClick = this.onBackToMenu;
		restart.onClick = this.onRestart;
		next.onClick = this.onNextLevel;
		var buttons = [menu,restart];
		if(stars > 0) buttons.push(next);
		var menuContainer = co.doubleduck.Utils.containBitmaps(buttons,5);
		endScreen.addChild(menuContainer);
		menuContainer.scaleX = menuContainer.scaleY = co.doubleduck.BaseGame.getScale();
		menuContainer.x = sign.x;
		menuContainer.y = sign.y + 117 * co.doubleduck.BaseGame.getScale();
		var gameEnded = stars > 0 && co.doubleduck.Session.level == new LevelDB().getAllLevels().length;
		if(gameEnded) {
			menuContainer.visible = false;
			var gameEndCaption = co.doubleduck.Utils.getCenteredImage("images/general/game_won.png",true);
			gameEndCaption.x = co.doubleduck.BaseGame.getViewport().width / 2;
			gameEndCaption.y = co.doubleduck.BaseGame.getViewport().height / 2;
			this.addChild(gameEndCaption);
			gameEndCaption.alpha = 0;
			createjs.Tween.get(gameEndCaption).wait(3500).to({ alpha : 1},500);
			var backToMenu = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/general/back_to_menu.png"));
			co.doubleduck.Utils.setCenterReg(backToMenu);
			backToMenu.scaleX = backToMenu.scaleY = co.doubleduck.BaseGame.getScale();
			backToMenu.onClick = this.onBackToMenu;
			backToMenu.x = gameEndCaption.x + 110 * co.doubleduck.BaseGame.getScale();
			backToMenu.y = gameEndCaption.y + 240 * co.doubleduck.BaseGame.getScale();
			backToMenu.alpha = 0;
			createjs.Tween.get(backToMenu).wait(4000).to({ alpha : 1},500);
			this.addChild(backToMenu);
		}
	}
	,getLevelStars: function() {
		var result = 0;
		if(this._money >= (this._levelStars[2] | 0)) result = 3; else if(this._money >= (this._levelStars[1] | 0)) result = 2; else if(this._money >= (this._levelStars[0] | 0)) result = 1;
		return result;
	}
	,updatePersistence: function() {
		var stars = this.getLevelStars();
		if(co.doubleduck.Persistence.getStarRating(co.doubleduck.Session.level) < stars) co.doubleduck.Persistence.setStarRating(co.doubleduck.Session.level,stars);
		var unlockedLevel = co.doubleduck.Persistence.getUnlockedLevel();
		if(co.doubleduck.Session.level == unlockedLevel && unlockedLevel + 1 <= new LevelDB().getAllLevels().length && stars > 0) co.doubleduck.Persistence.setUnlockedLevel(unlockedLevel + 1);
		null;
	}
	,timesUp: function() {
		this._sessionEnded = true;
		if(this.onSessionEnd != null) this.onSessionEnd();
		this.pauseCustomers();
		this.stopOven();
		this._buttonContainer.mouseEnabled = false;
		this.updatePersistence();
		this._hud.mouseEnabled = false;
		this.showEndScreen();
	}
	,levelTimer: function() {
		if(this._sessionEnded) return;
		this._hud.setRemainingSecs(this._remainingTime);
		if(this._remainingTime == 0) {
			this.timesUp();
			return;
		} else {
			this._remainingTime--;
			co.doubleduck.Utils.waitAndCall(this,1000,$bind(this,this.levelTimer));
		}
	}
	,positionBySlot: function(slotNum) {
		var result = 0;
		if(slotNum == 0) result = co.doubleduck.BaseGame.getViewport().width / 6; else if(slotNum == 1) result = co.doubleduck.BaseGame.getViewport().width / 2; else if(slotNum == 2) result = co.doubleduck.BaseGame.getViewport().width * 5 / 6;
		return result;
	}
	,getVacantSlot: function() {
		var result = -1;
		if(this._customerSlots[1] == null) result = 1; else if(Math.random() > 0.5) {
			if(this._customerSlots[0] == null) result = 0; else if(this._customerSlots[2] == null) result = 2;
		} else if(this._customerSlots[2] == null) result = 2; else if(this._customerSlots[0] == null) result = 0;
		return result;
	}
	,replaceLiquid: function() {
		this.disableLiquids();
		var index = 0;
		var _g1 = 0, _g = this._liquidsOccupying.length;
		while(_g1 < _g) {
			var currIndex = _g1++;
			var currLiquid = this._liquidsOccupying[currIndex];
			if(currLiquid.getType() == this._workAreaLiquid.getType()) {
				index = currIndex;
				break;
			}
		}
		var liquidName = this._workAreaLiquid.getType()[0].toLowerCase();
		var newLiquid = co.doubleduck.Liquid.createLiquid(co.doubleduck.DataLoader.getLiquidByName(liquidName).id | 0);
		newLiquid.scaleX = newLiquid.scaleY = co.doubleduck.BaseGame.getScale();
		this._buttonContainer.removeChild(this._workAreaLiquid);
		this._workAreaLiquid = null;
		this._liquidsOccupying[index] = newLiquid;
		this._buttonContainer.addChild(newLiquid);
		newLiquid.y = this._liquidLocation[index].y;
		newLiquid.onClick = $bind(this,this.handleLiquidClicked);
		newLiquid.x = co.doubleduck.BaseGame.getViewport().width;
		createjs.Tween.get(newLiquid).to({ x : this._liquidLocation[index].x | 0},500).call($bind(this,this.enableLiquids));
	}
	,clearOrder: function() {
		this._workAreaPizza = null;
		this.removeChild(this._workAreaPizzaDisplay);
		if(this._workAreaLiquid != null) this.replaceLiquid();
	}
	,handleCustomerClicked: function(event) {
		if(this._sessionEnded || this._isPaused) return;
		var clickedCustomer = event.target;
		var liquidType = null;
		if(this._workAreaLiquid != null) liquidType = this._workAreaLiquid.getType();
		if(clickedCustomer.acceptRecipe(this._workAreaPizza,liquidType)) {
			co.doubleduck.SoundManager.playEffect("sound/givePizza");
			var moneyGot = this._ldb.getPizzaPrice();
			moneyGot += clickedCustomer.getTip();
			if(this._workAreaLiquid != null) {
				moneyGot += this._ldb.getDrinkPrice();
				null;
			}
			var numToppings = 0;
			if(this._workAreaPizza.getToppings() != null && this._workAreaPizza.getToppings().length > 0) numToppings = this._workAreaPizza.getToppings().length;
			if(numToppings > 0) {
				moneyGot += numToppings * this._ldb.getToppingPrice();
				null;
			}
			this._hud.popupScore(moneyGot,clickedCustomer.x,clickedCustomer.y - clickedCustomer.getHeight() * 0.9 * co.doubleduck.BaseGame.getScale());
			this._money += moneyGot;
			this._hud.setScore(this._money);
			this.clearOrder();
			clickedCustomer.leave(Math.floor(Math.random() * 2));
		} else null;
	}
	,handleCustomerArrived: function(customer) {
		var availableToppings = new Array();
		var _g1 = 0, _g = co.doubleduck.DataLoader.getLevel(co.doubleduck.Session.level).toppings.length;
		while(_g1 < _g) {
			var toppingIndex = _g1++;
			var toppingStr = co.doubleduck.DataLoader.getLevel(co.doubleduck.Session.level).toppings[toppingIndex];
			availableToppings.push(Type.createEnum(co.doubleduck.ToppingType,toppingStr.toUpperCase()));
		}
		var availableLiquids = new Array();
		var _g1 = 0, _g = co.doubleduck.DataLoader.getLevel(co.doubleduck.Session.level).liquids.length;
		while(_g1 < _g) {
			var liquidIndex = _g1++;
			var liquidStr = co.doubleduck.DataLoader.getLevel(co.doubleduck.Session.level).liquids[liquidIndex];
			availableLiquids.push(Type.createEnum(co.doubleduck.LiquidType,liquidStr.toUpperCase()));
		}
		customer.makeOrder(availableToppings,availableLiquids,this._levelData.customerWait,this._levelData.maxRecipeSize);
	}
	,handleCustomerLeft: function(customer) {
		this._numActiveCustomers -= 1;
		var _g1 = 0, _g = this._customerSlots.length;
		while(_g1 < _g) {
			var currSlot = _g1++;
			if(this._customerSlots[currSlot] == customer) {
				this._customerSlots[currSlot] = null;
				break;
			}
		}
	}
	,handleCustomerDestroyed: function(customer) {
		this._customerLayer.removeChild(customer);
	}
	,spawnCustomer: function() {
		var customersData = new CustomerDB().getAllCustomers();
		var custID = customersData.length;
		custID = Std.random(custID);
		var customer = co.doubleduck.Customer.createCustomer(customersData[custID].id);
		var vacantSlot = this.getVacantSlot();
		this._customerSlots[vacantSlot] = customer;
		customer.y = this._desk.y;
		customer.onArrive = $bind(this,this.handleCustomerArrived);
		customer.onClick = $bind(this,this.handleCustomerClicked);
		customer.onLeave = $bind(this,this.handleCustomerLeft);
		customer.onDestroy = $bind(this,this.handleCustomerDestroyed);
		this._customerLayer.addChildAt(customer,0);
		this._numActiveCustomers += 1;
		customer.arrive(this.positionBySlot(vacantSlot));
	}
	,spawnTimer: function() {
		if(this._sessionEnded) return;
		if(this._numActiveCustomers < (this._levelData.maxCustomersAtOnce | 0)) this.spawnCustomer();
		var interval = this._levelData.timeBetweenCustomers * 1000 | 0;
		co.doubleduck.Utils.waitAndCall(this,interval,$bind(this,this.spawnTimer));
	}
	,_lastClickTime: null
	,_lastClickPos: null
	,_hud: null
	,_levelStars: null
	,_ldb: null
	,_money: null
	,_isPaused: null
	,_remainingTime: null
	,_sessionEnded: null
	,_levelData: null
	,_ovenSlots: null
	,_oven: null
	,_liquidsOccupying: null
	,_liquidLocation: null
	,_buttonContainer: null
	,_desk: null
	,_background: null
	,_customerSlots: null
	,_numActiveCustomers: null
	,_customerLayer: null
	,_workAreaLiquid: null
	,_workAreaPizzaDisplay: null
	,_workAreaPizza: null
	,__class__: co.doubleduck.Session
});
co.doubleduck.SmallPizza = $hxClasses["co.doubleduck.SmallPizza"] = function(status,initToppings) {
	this._numToppings = 1;
	if(status == null) status = co.doubleduck.SmallPizza.DEFAULT_STATUS;
	createjs.Container.call(this);
	if(co.doubleduck.SmallPizza._doughSpritesheet == null) this.initDoughSpritesheet();
	if(co.doubleduck.SmallPizza._toppingSpritesheet == null) this.initToppingSpritesheet();
	this._dough = new createjs.BitmapAnimation(co.doubleduck.SmallPizza._doughSpritesheet);
	this.addChild(this._dough);
	this.updateStatus(status);
	if(initToppings != null && status != co.doubleduck.PizzaStatus.BURNT) {
		var _g = 0;
		while(_g < initToppings.length) {
			var currTopping = initToppings[_g];
			++_g;
			this.addTopping(currTopping);
		}
	}
	this._dough.x -= this._dough.spriteSheet._frameWidth / 2;
	this._dough.y -= this._dough.spriteSheet._frameHeight / 2;
};
co.doubleduck.SmallPizza.__name__ = ["co","doubleduck","SmallPizza"];
co.doubleduck.SmallPizza.__super__ = createjs.Container;
co.doubleduck.SmallPizza.prototype = $extend(createjs.Container.prototype,{
	initToppingSpritesheet: function() {
		var img;
		var initObject;
		img = co.doubleduck.BaseAssets.getRawImage("images/session/oven/oven_toppings.png");
		var imgWidth = 18;
		var imgHeight = 16;
		initObject = { };
		initObject.images = [img];
		initObject.frames = { width : imgWidth, height : imgHeight, regX : imgWidth / 2, regY : imgHeight / 2};
		initObject.animations = { };
		var _g = 0, _g1 = Type.getEnumConstructs(co.doubleduck.ToppingType);
		while(_g < _g1.length) {
			var currTopping = _g1[_g];
			++_g;
			var topFrames = co.doubleduck.DataLoader.getToppingByName(currTopping.toLowerCase()).ovenIconFrames;
			initObject.animations[currTopping] = { frames : topFrames, frequency : 1};
		}
		co.doubleduck.SmallPizza._toppingSpritesheet = new createjs.SpriteSheet(initObject);
	}
	,initDoughSpritesheet: function() {
		var img;
		var initObject;
		img = co.doubleduck.BaseAssets.getRawImage("images/session/oven/oven_pizza.png");
		var imgWidth = 53;
		var imgHeight = 53;
		initObject = { };
		initObject.images = [img];
		initObject.frames = { width : imgWidth, height : imgHeight, regX : 0, regY : 0};
		co.doubleduck.SmallPizza._doughSpritesheet = new createjs.SpriteSheet(initObject);
	}
	,setBurnProgression: function(prog) {
	}
	,updateStatus: function(status) {
		var doughFrame = 0;
		switch( (status)[1] ) {
		case 0:
			doughFrame = 0;
			break;
		case 1:
			doughFrame = 1;
			break;
		case 2:
			doughFrame = 2;
			this._burningImage = co.doubleduck.Utils.getCenteredImage("images/session/oven/oven_pizza/4.png");
			this._burningImage.alpha = 0;
			break;
		case 3:
			doughFrame = 3;
			if(this._toppingGraphics != null) {
				var _g = 0, _g1 = this._toppingGraphics;
				while(_g < _g1.length) {
					var topping = _g1[_g];
					++_g;
					this.removeChild(topping);
				}
			}
			break;
		default:
			doughFrame = 0;
		}
		this._dough.gotoAndStop(doughFrame);
	}
	,addTopping: function(toppingType) {
		if(this._toppingGraphics == null) this._toppingGraphics = new Array();
		var toppingLocationsX = [0.14,0.14,-0.14,-0.14,0];
		var toppingLocationsY = [-0.14,0.14,0.14,-0.14,0];
		var topping = new createjs.BitmapAnimation(co.doubleduck.SmallPizza._toppingSpritesheet);
		this.addChild(topping);
		topping.gotoAndStop(toppingType[0]);
		topping.x += toppingLocationsX[this._numToppings - 1] * this._dough.spriteSheet._frameWidth;
		topping.y += toppingLocationsY[this._numToppings - 1] * this._dough.spriteSheet._frameHeight;
		this._numToppings += 1;
		this._toppingGraphics.push(topping);
	}
	,_burningImage: null
	,_numToppings: null
	,_toppingGraphics: null
	,_dough: null
	,__class__: co.doubleduck.SmallPizza
});
co.doubleduck.SoundType = $hxClasses["co.doubleduck.SoundType"] = { __ename__ : ["co","doubleduck","SoundType"], __constructs__ : ["WEB_AUDIO","AUDIO_FX","AUDIO_NO_OVERLAP","HOWLER","NONE"] }
co.doubleduck.SoundType.WEB_AUDIO = ["WEB_AUDIO",0];
co.doubleduck.SoundType.WEB_AUDIO.toString = $estr;
co.doubleduck.SoundType.WEB_AUDIO.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.AUDIO_FX = ["AUDIO_FX",1];
co.doubleduck.SoundType.AUDIO_FX.toString = $estr;
co.doubleduck.SoundType.AUDIO_FX.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.AUDIO_NO_OVERLAP = ["AUDIO_NO_OVERLAP",2];
co.doubleduck.SoundType.AUDIO_NO_OVERLAP.toString = $estr;
co.doubleduck.SoundType.AUDIO_NO_OVERLAP.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.HOWLER = ["HOWLER",3];
co.doubleduck.SoundType.HOWLER.toString = $estr;
co.doubleduck.SoundType.HOWLER.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.NONE = ["NONE",4];
co.doubleduck.SoundType.NONE.toString = $estr;
co.doubleduck.SoundType.NONE.__enum__ = co.doubleduck.SoundType;
if(!co.doubleduck.audio) co.doubleduck.audio = {}
co.doubleduck.audio.AudioAPI = $hxClasses["co.doubleduck.audio.AudioAPI"] = function() { }
co.doubleduck.audio.AudioAPI.__name__ = ["co","doubleduck","audio","AudioAPI"];
co.doubleduck.audio.AudioAPI.prototype = {
	setVolume: null
	,pause: null
	,stop: null
	,playMusic: null
	,playEffect: null
	,init: null
	,__class__: co.doubleduck.audio.AudioAPI
}
co.doubleduck.audio.WebAudioAPI = $hxClasses["co.doubleduck.audio.WebAudioAPI"] = function(src) {
	this._src = src;
	this.loadAudioFile(this._src);
};
co.doubleduck.audio.WebAudioAPI.__name__ = ["co","doubleduck","audio","WebAudioAPI"];
co.doubleduck.audio.WebAudioAPI.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.WebAudioAPI.context = null;
co.doubleduck.audio.WebAudioAPI.webAudioInit = function() {
	co.doubleduck.audio.WebAudioAPI.context = new webkitAudioContext();
}
co.doubleduck.audio.WebAudioAPI.saveBuffer = function(buffer,name) {
	co.doubleduck.audio.WebAudioAPI._buffers[name] = buffer;
}
co.doubleduck.audio.WebAudioAPI.decodeError = function() {
	null;
}
co.doubleduck.audio.WebAudioAPI.prototype = {
	setVolume: function(volume) {
		if(this._gainNode != null) this._gainNode.gain.value = volume;
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		if(this._source != null) this._source.noteOff(0);
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
		this.playBuffer(this._src,loop);
		this.setVolume(volume);
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		this.playBuffer(this._src,loop);
		this.setVolume(volume);
	}
	,playBuffer: function(name,loop) {
		if(loop == null) loop = false;
		if(this._gainNode == null) {
			this._gainNode = co.doubleduck.audio.WebAudioAPI.context.createGainNode();
			this._gainNode.connect(co.doubleduck.audio.WebAudioAPI.context.destination);
		}
		this._buffer = Reflect.getProperty(co.doubleduck.audio.WebAudioAPI._buffers,this._src);
		if(this._buffer == null) return;
		this._source = co.doubleduck.audio.WebAudioAPI.context.createBufferSource();
		this._source.buffer = this._buffer;
		this._source.loop = loop;
		this._source.connect(this._gainNode);
		this._source.noteOn(0);
	}
	,loadAudioFile: function(src) {
		var request = new XMLHttpRequest();
		request.open("get",src,true);
		request.responseType = "arraybuffer";
		request.onload = function() { co.doubleduck.audio.WebAudioAPI.context.decodeAudioData(request.response, function(decodedBuffer) { buffer = decodedBuffer; co.doubleduck.audio.WebAudioAPI.saveBuffer(buffer,src); }, co.doubleduck.audio.WebAudioAPI.decodeError) }
		request.send();
	}
	,init: function() {
	}
	,_source: null
	,_gainNode: null
	,_buffer: null
	,_src: null
	,__class__: co.doubleduck.audio.WebAudioAPI
}
co.doubleduck.SoundManager = $hxClasses["co.doubleduck.SoundManager"] = function() {
};
co.doubleduck.SoundManager.__name__ = ["co","doubleduck","SoundManager"];
co.doubleduck.SoundManager.engineType = null;
co.doubleduck.SoundManager.EXTENSION = null;
co.doubleduck.SoundManager.getPersistedMute = function() {
	var mute = co.doubleduck.BasePersistence.getValue("mute");
	if(mute == "0") {
		mute = "false";
		co.doubleduck.SoundManager.setPersistedMute(false);
	}
	return mute == "true";
}
co.doubleduck.SoundManager.setPersistedMute = function(mute) {
	var val = "true";
	if(!mute) val = "false";
	co.doubleduck.BasePersistence.setValue("mute",val);
}
co.doubleduck.SoundManager.isSoundAvailable = function() {
	var isFirefox = /Firefox/.test(navigator.userAgent);
	var isChrome = /Chrome/.test(navigator.userAgent);
	var isMobile = /Mobile/.test(navigator.userAgent);
	var isAndroid = /Android/.test(navigator.userAgent);
	var isAndroid4 = /Android 4/.test(navigator.userAgent);
	var isSafari = /Safari/.test(navigator.userAgent);
	var agent = navigator.userAgent;
	var reg = new EReg("iPhone OS 6","");
	var isIOS6 = reg.match(agent) && isSafari && isMobile;
	var isIpad = /iPad/.test(navigator.userAgent);
	isIpad = isIpad && /OS 6/.test(navigator.userAgent);
	isIOS6 = isIOS6 || isIpad;
	if(isFirefox) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.AUDIO_FX;
		co.doubleduck.SoundManager.EXTENSION = ".ogg";
		return true;
	}
	if(isChrome && (!isAndroid && !isMobile)) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.WEB_AUDIO;
		co.doubleduck.audio.WebAudioAPI.webAudioInit();
		co.doubleduck.SoundManager.EXTENSION = ".mp3";
		return true;
	}
	if(isIOS6) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.WEB_AUDIO;
		co.doubleduck.audio.WebAudioAPI.webAudioInit();
		co.doubleduck.SoundManager.EXTENSION = ".mp3";
		return true;
	} else if(isAndroid4 && !isChrome) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.AUDIO_NO_OVERLAP;
		co.doubleduck.SoundManager.EXTENSION = ".mp3";
		return true;
	}
	co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.NONE;
	co.doubleduck.BasePersistence.initVar("mute");
	return false;
}
co.doubleduck.SoundManager.mute = function(persisted) {
	if(persisted == null) persisted = true;
	if(!co.doubleduck.SoundManager.available) return;
	co.doubleduck.SoundManager._muted = true;
	var _g1 = 0, _g = Reflect.fields(co.doubleduck.SoundManager._cache).length;
	while(_g1 < _g) {
		var currSound = _g1++;
		var mySound = Reflect.getProperty(co.doubleduck.SoundManager._cache,Reflect.fields(co.doubleduck.SoundManager._cache)[currSound]);
		if(mySound != null) mySound.setVolume(0);
	}
	if(persisted) co.doubleduck.SoundManager.setPersistedMute(co.doubleduck.SoundManager._muted);
}
co.doubleduck.SoundManager.unmute = function(persisted) {
	if(persisted == null) persisted = true;
	if(!co.doubleduck.SoundManager.available) return;
	co.doubleduck.SoundManager._muted = false;
	try {
		var _g1 = 0, _g = Reflect.fields(co.doubleduck.SoundManager._cache).length;
		while(_g1 < _g) {
			var currSound = _g1++;
			var mySound = Reflect.getProperty(co.doubleduck.SoundManager._cache,Reflect.fields(co.doubleduck.SoundManager._cache)[currSound]);
			if(mySound != null) mySound.setVolume(1);
		}
	} catch( e ) {
		null;
	}
	if(persisted) co.doubleduck.SoundManager.setPersistedMute(co.doubleduck.SoundManager._muted);
}
co.doubleduck.SoundManager.toggleMute = function() {
	if(co.doubleduck.SoundManager._muted) co.doubleduck.SoundManager.unmute(); else co.doubleduck.SoundManager.mute();
}
co.doubleduck.SoundManager.isMuted = function() {
	co.doubleduck.SoundManager._muted = co.doubleduck.SoundManager.getPersistedMute();
	return co.doubleduck.SoundManager._muted;
}
co.doubleduck.SoundManager.getAudioInstance = function(src) {
	if(!co.doubleduck.SoundManager.available) return new co.doubleduck.audio.DummyAudioAPI();
	src += co.doubleduck.SoundManager.EXTENSION;
	var audio = Reflect.getProperty(co.doubleduck.SoundManager._cache,src);
	if(audio == null) {
		switch( (co.doubleduck.SoundManager.engineType)[1] ) {
		case 1:
			audio = new co.doubleduck.audio.AudioFX(src);
			break;
		case 0:
			audio = new co.doubleduck.audio.WebAudioAPI(src);
			break;
		case 2:
			audio = new co.doubleduck.audio.NonOverlappingAudio(src);
			break;
		case 3:
			audio = new co.doubleduck.audio.HowlerAudio(src);
			break;
		case 4:
			return new co.doubleduck.audio.DummyAudioAPI();
		}
		Reflect.setProperty(co.doubleduck.SoundManager._cache,src,audio);
	}
	return audio;
}
co.doubleduck.SoundManager.playEffect = function(src,volume,optional) {
	if(optional == null) optional = false;
	if(volume == null) volume = 1;
	if(optional && co.doubleduck.SoundManager.engineType == co.doubleduck.SoundType.AUDIO_NO_OVERLAP) return new co.doubleduck.audio.DummyAudioAPI();
	var audio = co.doubleduck.SoundManager.getAudioInstance(src);
	var playVolume = volume;
	if(co.doubleduck.SoundManager._muted) playVolume = 0;
	audio.playEffect(playVolume);
	return audio;
}
co.doubleduck.SoundManager.playMusic = function(src,volume,loop) {
	if(loop == null) loop = true;
	if(volume == null) volume = 1;
	var audio = co.doubleduck.SoundManager.getAudioInstance(src);
	var playVolume = volume;
	if(co.doubleduck.SoundManager._muted) playVolume = 0;
	audio.playMusic(playVolume,loop);
	return audio;
}
co.doubleduck.SoundManager.initSound = function(src) {
	co.doubleduck.SoundManager.getAudioInstance(src);
}
co.doubleduck.SoundManager.prototype = {
	__class__: co.doubleduck.SoundManager
}
co.doubleduck.Topping = $hxClasses["co.doubleduck.Topping"] = function(typeStr,graphic,icon) {
	this._toppingType = Type.createEnum(co.doubleduck.ToppingType,typeStr.toUpperCase());
	this._name = typeStr;
	this.name = typeStr;
	this._icon = icon;
	co.doubleduck.Button.call(this,co.doubleduck.BaseAssets.getImage(graphic),true);
	this.setNoSound();
};
co.doubleduck.Topping.__name__ = ["co","doubleduck","Topping"];
co.doubleduck.Topping.createTopping = function(id) {
	var graphic = co.doubleduck.DataLoader.getToppingById(id).deskIcon;
	var name = co.doubleduck.DataLoader.getToppingById(id).name;
	var icon = co.doubleduck.DataLoader.getToppingById(id).custIcon;
	return new co.doubleduck.Topping(name,graphic,icon);
}
co.doubleduck.Topping.getCustomerIconUri = function(type) {
	var icon = co.doubleduck.DataLoader.getToppingByName(type[0].toLowerCase()).custIcon;
	return icon;
}
co.doubleduck.Topping.getPizzaIconUri = function(type) {
	var icon = co.doubleduck.DataLoader.getToppingByName(type[0].toLowerCase()).onPizza;
	return icon;
}
co.doubleduck.Topping.getOvenIconFrames = function(type) {
	var frames = co.doubleduck.DataLoader.getToppingByName(type[0].toLowerCase()).ovenIconFrames;
	return frames;
}
co.doubleduck.Topping.__super__ = co.doubleduck.Button;
co.doubleduck.Topping.prototype = $extend(co.doubleduck.Button.prototype,{
	getName: function() {
		return this._name;
	}
	,getType: function() {
		return this._toppingType;
	}
	,_icon: null
	,_name: null
	,_toppingType: null
	,__class__: co.doubleduck.Topping
});
co.doubleduck.ToppingType = $hxClasses["co.doubleduck.ToppingType"] = { __ename__ : ["co","doubleduck","ToppingType"], __constructs__ : ["OLIVES","MUSHROOMS","PINEAPPLE","PEPPERONI","ONION"] }
co.doubleduck.ToppingType.OLIVES = ["OLIVES",0];
co.doubleduck.ToppingType.OLIVES.toString = $estr;
co.doubleduck.ToppingType.OLIVES.__enum__ = co.doubleduck.ToppingType;
co.doubleduck.ToppingType.MUSHROOMS = ["MUSHROOMS",1];
co.doubleduck.ToppingType.MUSHROOMS.toString = $estr;
co.doubleduck.ToppingType.MUSHROOMS.__enum__ = co.doubleduck.ToppingType;
co.doubleduck.ToppingType.PINEAPPLE = ["PINEAPPLE",2];
co.doubleduck.ToppingType.PINEAPPLE.toString = $estr;
co.doubleduck.ToppingType.PINEAPPLE.__enum__ = co.doubleduck.ToppingType;
co.doubleduck.ToppingType.PEPPERONI = ["PEPPERONI",3];
co.doubleduck.ToppingType.PEPPERONI.toString = $estr;
co.doubleduck.ToppingType.PEPPERONI.__enum__ = co.doubleduck.ToppingType;
co.doubleduck.ToppingType.ONION = ["ONION",4];
co.doubleduck.ToppingType.ONION.toString = $estr;
co.doubleduck.ToppingType.ONION.__enum__ = co.doubleduck.ToppingType;
co.doubleduck.Utils = $hxClasses["co.doubleduck.Utils"] = function() { }
co.doubleduck.Utils.__name__ = ["co","doubleduck","Utils"];
co.doubleduck.Utils.dateDeltaInDays = function(day1,day2) {
	var delta = Math.abs(day2.getTime() - day1.getTime());
	return delta / 86400000;
}
co.doubleduck.Utils.getTodayDate = function() {
	var newDate = new Date();
	return HxOverrides.dateStr(newDate);
}
co.doubleduck.Utils.getHour = function() {
	var newDate = new Date();
	return newDate.getHours();
}
co.doubleduck.Utils.rectOverlap = function(r1,r2) {
	var r1TopLeft = new createjs.Point(r1.x,r1.y);
	var r1BottomRight = new createjs.Point(r1.x + r1.width,r1.y + r1.height);
	var r1TopRight = new createjs.Point(r1.x + r1.width,r1.y);
	var r1BottomLeft = new createjs.Point(r1.x,r1.y + r1.height);
	var r2TopLeft = new createjs.Point(r2.x,r2.y);
	var r2BottomRight = new createjs.Point(r2.x + r2.width,r2.y + r2.height);
	var r2TopRight = new createjs.Point(r2.x + r2.width,r2.y);
	var r2BottomLeft = new createjs.Point(r2.x,r2.y + r2.height);
	if(co.doubleduck.Utils.rectContainPoint(r2TopLeft,r2BottomRight,r1TopLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r2TopLeft,r2BottomRight,r1BottomRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r2TopLeft,r2BottomRight,r1TopRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r2TopLeft,r2BottomRight,r1BottomLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r1TopLeft,r1BottomRight,r2TopLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r1TopLeft,r1BottomRight,r2BottomRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r1TopLeft,r1BottomRight,r2TopRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r1TopLeft,r1BottomRight,r2BottomLeft)) return true;
	return false;
}
co.doubleduck.Utils.overlap = function(obj1,obj1Width,obj1Height,obj2,obj2Width,obj2Height) {
	var o1TopLeft = new createjs.Point(obj1.x - obj1.regX * co.doubleduck.BaseGame.getScale(),obj1.y - obj1.regY * co.doubleduck.BaseGame.getScale());
	var o1BottomRight = new createjs.Point(o1TopLeft.x - obj1.regX * co.doubleduck.BaseGame.getScale() + obj1Width * co.doubleduck.BaseGame.getScale(),o1TopLeft.y + obj1Height * co.doubleduck.BaseGame.getScale() - obj1.regY * co.doubleduck.BaseGame.getScale());
	var o1TopRight = new createjs.Point(o1BottomRight.x - obj1.regX * co.doubleduck.BaseGame.getScale(),o1TopLeft.y - obj1.regY * co.doubleduck.BaseGame.getScale());
	var o1BottomLeft = new createjs.Point(o1TopLeft.x - obj1.regX * co.doubleduck.BaseGame.getScale(),o1BottomRight.y - obj1.regY * co.doubleduck.BaseGame.getScale());
	var o2TopLeft = new createjs.Point(obj2.x - obj2.regX * co.doubleduck.BaseGame.getScale(),obj2.y - obj2.regY * co.doubleduck.BaseGame.getScale());
	var o2BottomRight = new createjs.Point(o2TopLeft.x + obj2Width * co.doubleduck.BaseGame.getScale() - obj2.regX * co.doubleduck.BaseGame.getScale(),o2TopLeft.y + obj2Height * co.doubleduck.BaseGame.getScale() - obj2.regY * co.doubleduck.BaseGame.getScale());
	var o2TopRight = new createjs.Point(o2BottomRight.x - obj2.regX * co.doubleduck.BaseGame.getScale(),o2TopLeft.y - obj2.regY * co.doubleduck.BaseGame.getScale());
	var o2BottomLeft = new createjs.Point(o2TopLeft.x - obj2.regX * co.doubleduck.BaseGame.getScale(),o2BottomRight.y - obj2.regY * co.doubleduck.BaseGame.getScale());
	if(co.doubleduck.Utils.rectContainPoint(o2TopLeft,o2BottomRight,o1TopLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o2TopLeft,o2BottomRight,o1BottomRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o2TopLeft,o2BottomRight,o1TopRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o2TopLeft,o2BottomRight,o1BottomLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o1TopLeft,o1BottomRight,o2TopLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o1TopLeft,o1BottomRight,o2BottomRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o1TopLeft,o1BottomRight,o2TopRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o1TopLeft,o1BottomRight,o2BottomLeft)) return true;
	return false;
}
co.doubleduck.Utils.rectContainPoint = function(rectTopLeft,rectBottomRight,point) {
	return point.x >= rectTopLeft.x && point.x <= rectBottomRight.x && point.y >= rectTopLeft.y && point.y <= rectBottomRight.y;
}
co.doubleduck.Utils.objectContains = function(dyn,memberName) {
	return Reflect.hasField(dyn,memberName);
}
co.doubleduck.Utils.contains = function(arr,obj) {
	var _g = 0;
	while(_g < arr.length) {
		var element = arr[_g];
		++_g;
		if(element == obj) return true;
	}
	return false;
}
co.doubleduck.Utils.isMobileFirefox = function() {
	var isFirefox = /Firefox/.test(navigator.userAgent);
	return isFirefox && viewporter.ACTIVE;
}
co.doubleduck.Utils.get = function(x,y,tiles,columns) {
	return tiles[columns * y + x];
}
co.doubleduck.Utils.getBitmapLabel = function(label,fontType,padding) {
	if(padding == null) padding = 0;
	if(fontType == null) fontType = "";
	var fontHelper = new co.doubleduck.FontHelper(fontType);
	var bitmapText = fontHelper.getNumber(Std.parseInt(label),1,true,null,padding);
	return bitmapText;
}
co.doubleduck.Utils.concatWithoutDuplicates = function(array,otherArray) {
	var _g = 0;
	while(_g < otherArray.length) {
		var element = otherArray[_g];
		++_g;
		co.doubleduck.Utils.addToArrayWithoutDuplicates(array,element);
	}
	return array;
}
co.doubleduck.Utils.addToArrayWithoutDuplicates = function(array,element) {
	var _g = 0;
	while(_g < array.length) {
		var currElement = array[_g];
		++_g;
		if(currElement == element) return array;
	}
	array.push(element);
	return array;
}
co.doubleduck.Utils.getImageData = function(image) {
	var ctx = co.doubleduck.Utils.getCanvasContext();
	var img = co.doubleduck.BaseAssets.getImage(image);
	ctx.drawImage(img.image,0,0);
	return ctx.getImageData(0,0,img.image.width,img.image.height);
}
co.doubleduck.Utils.getCanvasContext = function() {
	var dom = js.Lib.document.createElement("Canvas");
	var canvas = dom;
	return canvas.getContext("2d");
}
co.doubleduck.Utils.joinArrays = function(a1,a2) {
	var arr = a1.slice();
	var _g = 0;
	while(_g < a2.length) {
		var el = a2[_g];
		++_g;
		arr.push(el);
	}
	return arr;
}
co.doubleduck.Utils.getRandomElement = function(arr) {
	return arr[Std.random(arr.length)];
}
co.doubleduck.Utils.splitArray = function(arr,parts) {
	var arrs = new Array();
	var _g = 0;
	while(_g < parts) {
		var p = _g++;
		arrs.push(new Array());
	}
	var currArr = 0;
	while(arr.length > 0) {
		arrs[currArr].push(arr.pop());
		currArr++;
		currArr %= parts;
	}
	return arrs;
}
co.doubleduck.Utils.map = function(value,aMin,aMax,bMin,bMax) {
	if(bMax == null) bMax = 1;
	if(bMin == null) bMin = 0;
	if(value <= aMin) return bMin;
	if(value >= aMax) return bMax;
	return (value - aMin) * (bMax - bMin) / (aMax - aMin) + bMin;
}
co.doubleduck.Utils.waitAndCall = function(parent,delay,func,args) {
	createjs.Tween.get(parent).wait(delay).call(func,args);
}
co.doubleduck.Utils.tintBitmap = function(src,redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier) {
	var colorFilter = new createjs.ColorFilter(redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier);
	src.cache(src.x,src.y,src.image.width,src.image.height);
	src.filters = [colorFilter];
	src.updateCache();
}
co.doubleduck.Utils.containBitmaps = function(bitmapList,spacing,isRow,dims) {
	if(isRow == null) isRow = true;
	if(spacing == null) spacing = 0;
	var totalWidth = 0;
	var totalHeight = 0;
	var result = new createjs.Container();
	var _g1 = 0, _g = bitmapList.length;
	while(_g1 < _g) {
		var currBitmap = _g1++;
		var bmp = bitmapList[currBitmap];
		bmp.regY = bmp.image.height / 2;
		if(currBitmap != 0) {
			if(isRow) {
				bmp.x = bitmapList[currBitmap - 1].x + bitmapList[currBitmap - 1].image.width + spacing;
				if(bmp.image.height > totalHeight) totalHeight = bmp.image.height;
				totalWidth += bmp.image.width + spacing;
			} else {
				bmp.y = bitmapList[currBitmap - 1].y + bitmapList[currBitmap - 1].image.height + spacing;
				if(bmp.image.width > totalWidth) totalWidth = bmp.image.width;
				totalHeight += bmp.image.height + spacing;
			}
		} else {
			totalWidth = bmp.image.width;
			totalHeight = bmp.image.height;
		}
		result.addChild(bmp);
	}
	result.regX = totalWidth / 2;
	result.regY = totalHeight / 2;
	if(dims != null) {
		dims.width = totalWidth;
		dims.height = totalHeight;
	}
	return result;
}
co.doubleduck.Utils.getCenteredImage = function(name,scaleToGame) {
	if(scaleToGame == null) scaleToGame = false;
	var img = co.doubleduck.BaseAssets.getImage(name);
	img.regX = img.image.width / 2;
	img.regY = img.image.height / 2;
	if(scaleToGame) img.scaleX = img.scaleY = co.doubleduck.BaseGame.getScale();
	return img;
}
co.doubleduck.Utils.setCenterReg = function(bmp) {
	bmp.regX = bmp.image.width / 2;
	bmp.regY = bmp.image.height / 2;
}
co.doubleduck.Utils.shuffleArray = function(arr) {
	var tmp, j, i = arr.length;
	while(i > 0) {
		j = Math.random() * i | 0;
		tmp = arr[--i];
		arr[i] = arr[j];
		arr[j] = tmp;
	}
}
co.doubleduck.audio.AudioFX = $hxClasses["co.doubleduck.audio.AudioFX"] = function(src) {
	this._jsAudio = null;
	this._src = src;
	this._loop = false;
	this._volume = 1;
};
co.doubleduck.audio.AudioFX.__name__ = ["co","doubleduck","audio","AudioFX"];
co.doubleduck.audio.AudioFX.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.AudioFX._currentlyPlaying = null;
co.doubleduck.audio.AudioFX.prototype = {
	setVolume: function(volume) {
		this._volume = volume;
		if(this._jsAudio != null) this._jsAudio.setVolume(volume);
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		this._jsAudio.stop();
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop,2);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,load: function(isLoop,pool) {
		if(pool == null) pool = 1;
		var pathNoExtension = this._src;
		this._jsAudio = AudioFX(pathNoExtension, { loop: isLoop, pool: pool });
	}
	,init: function() {
	}
	,_volume: null
	,_loop: null
	,_jsAudio: null
	,_src: null
	,__class__: co.doubleduck.audio.AudioFX
}
co.doubleduck.audio.DummyAudioAPI = $hxClasses["co.doubleduck.audio.DummyAudioAPI"] = function() {
};
co.doubleduck.audio.DummyAudioAPI.__name__ = ["co","doubleduck","audio","DummyAudioAPI"];
co.doubleduck.audio.DummyAudioAPI.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.DummyAudioAPI.prototype = {
	setVolume: function(volume) {
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
	}
	,init: function() {
	}
	,__class__: co.doubleduck.audio.DummyAudioAPI
}
co.doubleduck.audio.HowlerAudio = $hxClasses["co.doubleduck.audio.HowlerAudio"] = function(src) {
	this._jsAudio = null;
	this._src = src;
	this._loop = false;
	this._volume = 1;
};
co.doubleduck.audio.HowlerAudio.__name__ = ["co","doubleduck","audio","HowlerAudio"];
co.doubleduck.audio.HowlerAudio.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.HowlerAudio._currentlyPlaying = null;
co.doubleduck.audio.HowlerAudio.prototype = {
	setVolume: function(volume) {
		this._volume = volume;
		if(this._jsAudio != null) this._jsAudio.volume = volume;
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		this._jsAudio.stop();
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop,1);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,load: function(isLoop,pool) {
		if(pool == null) pool = 1;
		var pathNoExtension = this._src;
		var myUrls = new Array();
		myUrls.push(this._src + ".mp3");
		myUrls.push(this._src + ".ogg");
		this._jsAudio = new Howl({urls: myUrls, loop: false});
	}
	,init: function() {
	}
	,_volume: null
	,_loop: null
	,_jsAudio: null
	,_src: null
	,__class__: co.doubleduck.audio.HowlerAudio
}
co.doubleduck.audio.NonOverlappingAudio = $hxClasses["co.doubleduck.audio.NonOverlappingAudio"] = function(src) {
	this._src = src;
	this.load();
	this._isMusic = false;
};
co.doubleduck.audio.NonOverlappingAudio.__name__ = ["co","doubleduck","audio","NonOverlappingAudio"];
co.doubleduck.audio.NonOverlappingAudio.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying = null;
co.doubleduck.audio.NonOverlappingAudio.prototype = {
	getSrc: function() {
		return this._src;
	}
	,audio: function() {
		return this._audio;
	}
	,setVolume: function(volume) {
		if(this._audio != null) this._audio.volume = volume;
	}
	,pause: function() {
		if(this._audio != null) this._audio.pause();
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		if(this._isMusic) co.doubleduck.audio.NonOverlappingAudio._musicPlaying = false;
		if(this._audio != null) {
			this._audio.removeEventListener("ended",$bind(this,this.handleEnded));
			this._audio.currentTime = 0;
			this._audio.pause();
		}
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(volume == null) volume = 1;
		if(co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying != null) co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying.stop();
		this._isMusic = true;
		co.doubleduck.audio.NonOverlappingAudio._musicPlaying = true;
		this._audio.play();
		this._audio.volume = volume;
		this._audio.loop = loop;
		if(!loop) this._audio.addEventListener("ended",$bind(this,this.stop));
	}
	,handleEnded: function() {
		this._audio.removeEventListener("ended",$bind(this,this.handleEnded));
		this._audio.currentTime = 0;
	}
	,handleTimeUpdate: function() {
		if(this._audio.currentTime >= this._audio.duration - 0.3) this.stop();
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		if(co.doubleduck.audio.NonOverlappingAudio._musicPlaying) return;
		if(overrideOtherEffects && co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying != null) co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying.stop();
		this._audio.play();
		this._audio.volume = volume;
		this._audio.loop = loop;
		if(!loop) this._audio.addEventListener("ended",$bind(this,this.stop));
		co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying = this;
	}
	,handleError: function() {
	}
	,handleCanPlay: function() {
	}
	,load: function() {
		this._audio = new Audio();
		this._audio.src = this._src;
		this._audio.initialTime = 0;
		this._audio.addEventListener("canplaythrough",$bind(this,this.handleCanPlay));
		this._audio.addEventListener("onerror",$bind(this,this.handleError));
	}
	,init: function() {
	}
	,_isMusic: null
	,_audio: null
	,_src: null
	,__class__: co.doubleduck.audio.NonOverlappingAudio
}
var haxe = haxe || {}
haxe.Log = $hxClasses["haxe.Log"] = function() { }
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Public = $hxClasses["haxe.Public"] = function() { }
haxe.Public.__name__ = ["haxe","Public"];
haxe.StackItem = $hxClasses["haxe.StackItem"] = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","Lambda"] }
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Lambda = function(v) { var $x = ["Lambda",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.Stack = $hxClasses["haxe.Stack"] = function() { }
haxe.Stack.__name__ = ["haxe","Stack"];
haxe.Stack.callStack = function() {
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe.StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe.StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe.Stack.makeStack(new Error().stack);
	a.shift();
	Error.prepareStackTrace = oldValue;
	return a;
}
haxe.Stack.exceptionStack = function() {
	return [];
}
haxe.Stack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += Std.string("\nCalled from ");
		haxe.Stack.itemToString(b,s);
	}
	return b.b;
}
haxe.Stack.itemToString = function(b,s) {
	var $e = (s);
	switch( $e[1] ) {
	case 0:
		b.b += Std.string("a C function");
		break;
	case 1:
		var m = $e[2];
		b.b += Std.string("module ");
		b.b += Std.string(m);
		break;
	case 2:
		var line = $e[4], file = $e[3], s1 = $e[2];
		if(s1 != null) {
			haxe.Stack.itemToString(b,s1);
			b.b += Std.string(" (");
		}
		b.b += Std.string(file);
		b.b += Std.string(" line ");
		b.b += Std.string(line);
		if(s1 != null) b.b += Std.string(")");
		break;
	case 3:
		var meth = $e[3], cname = $e[2];
		b.b += Std.string(cname);
		b.b += Std.string(".");
		b.b += Std.string(meth);
		break;
	case 4:
		var n = $e[2];
		b.b += Std.string("local function #");
		b.b += Std.string(n);
		break;
	}
}
haxe.Stack.makeStack = function(s) {
	if(typeof(s) == "string") {
		var stack = s.split("\n");
		var m = [];
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			m.push(haxe.StackItem.Module(line));
		}
		return m;
	} else return s;
}
if(!haxe.unit) haxe.unit = {}
haxe.unit.TestCase = $hxClasses["haxe.unit.TestCase"] = function() {
};
haxe.unit.TestCase.__name__ = ["haxe","unit","TestCase"];
haxe.unit.TestCase.__interfaces__ = [haxe.Public];
haxe.unit.TestCase.prototype = {
	assertEquals: function(expected,actual,c) {
		this.currentTest.done = true;
		if(actual != expected) {
			this.currentTest.success = false;
			this.currentTest.error = "expected '" + Std.string(expected) + "' but was '" + Std.string(actual) + "'";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,assertFalse: function(b,c) {
		this.currentTest.done = true;
		if(b == true) {
			this.currentTest.success = false;
			this.currentTest.error = "expected false but was true";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,assertTrue: function(b,c) {
		this.currentTest.done = true;
		if(b == false) {
			this.currentTest.success = false;
			this.currentTest.error = "expected true but was false";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,print: function(v) {
		haxe.unit.TestRunner.print(v);
	}
	,tearDown: function() {
	}
	,setup: function() {
	}
	,currentTest: null
	,__class__: haxe.unit.TestCase
}
haxe.unit.TestResult = $hxClasses["haxe.unit.TestResult"] = function() {
	this.m_tests = new List();
	this.success = true;
};
haxe.unit.TestResult.__name__ = ["haxe","unit","TestResult"];
haxe.unit.TestResult.prototype = {
	toString: function() {
		var buf = new StringBuf();
		var failures = 0;
		var $it0 = this.m_tests.iterator();
		while( $it0.hasNext() ) {
			var test = $it0.next();
			if(test.success == false) {
				buf.b += Std.string("* ");
				buf.b += Std.string(test.classname);
				buf.b += Std.string("::");
				buf.b += Std.string(test.method);
				buf.b += Std.string("()");
				buf.b += Std.string("\n");
				buf.b += Std.string("ERR: ");
				if(test.posInfos != null) {
					buf.b += Std.string(test.posInfos.fileName);
					buf.b += Std.string(":");
					buf.b += Std.string(test.posInfos.lineNumber);
					buf.b += Std.string("(");
					buf.b += Std.string(test.posInfos.className);
					buf.b += Std.string(".");
					buf.b += Std.string(test.posInfos.methodName);
					buf.b += Std.string(") - ");
				}
				buf.b += Std.string(test.error);
				buf.b += Std.string("\n");
				if(test.backtrace != null) {
					buf.b += Std.string(test.backtrace);
					buf.b += Std.string("\n");
				}
				buf.b += Std.string("\n");
				failures++;
			}
		}
		buf.b += Std.string("\n");
		if(failures == 0) buf.b += Std.string("OK "); else buf.b += Std.string("FAILED ");
		buf.b += Std.string(this.m_tests.length);
		buf.b += Std.string(" tests, ");
		buf.b += Std.string(failures);
		buf.b += Std.string(" failed, ");
		buf.b += Std.string(this.m_tests.length - failures);
		buf.b += Std.string(" success");
		buf.b += Std.string("\n");
		return buf.b;
	}
	,add: function(t) {
		this.m_tests.add(t);
		if(!t.success) this.success = false;
	}
	,success: null
	,m_tests: null
	,__class__: haxe.unit.TestResult
}
haxe.unit.TestRunner = $hxClasses["haxe.unit.TestRunner"] = function() {
	this.result = new haxe.unit.TestResult();
	this.cases = new List();
};
haxe.unit.TestRunner.__name__ = ["haxe","unit","TestRunner"];
haxe.unit.TestRunner.print = function(v) {
	var msg = StringTools.htmlEscape(js.Boot.__string_rec(v,"")).split("\n").join("<br/>");
	var d = document.getElementById("haxe:trace");
	if(d == null) alert("haxe:trace element not found"); else d.innerHTML += msg;
}
haxe.unit.TestRunner.customTrace = function(v,p) {
	haxe.unit.TestRunner.print(p.fileName + ":" + p.lineNumber + ": " + Std.string(v) + "\n");
}
haxe.unit.TestRunner.prototype = {
	runCase: function(t) {
		var old = haxe.Log.trace;
		haxe.Log.trace = haxe.unit.TestRunner.customTrace;
		var cl = Type.getClass(t);
		var fields = Type.getInstanceFields(cl);
		haxe.unit.TestRunner.print("Class: " + Type.getClassName(cl) + " ");
		var _g = 0;
		while(_g < fields.length) {
			var f = fields[_g];
			++_g;
			var fname = f;
			var field = Reflect.field(t,f);
			if(StringTools.startsWith(fname,"test") && Reflect.isFunction(field)) {
				t.currentTest = new haxe.unit.TestStatus();
				t.currentTest.classname = Type.getClassName(cl);
				t.currentTest.method = fname;
				t.setup();
				try {
					field.apply(t,new Array());
					if(t.currentTest.done) {
						t.currentTest.success = true;
						haxe.unit.TestRunner.print(".");
					} else {
						t.currentTest.success = false;
						t.currentTest.error = "(warning) no assert";
						haxe.unit.TestRunner.print("W");
					}
				} catch( $e0 ) {
					if( js.Boot.__instanceof($e0,haxe.unit.TestStatus) ) {
						var e = $e0;
						haxe.unit.TestRunner.print("F");
						t.currentTest.backtrace = haxe.Stack.toString(haxe.Stack.exceptionStack());
					} else {
					var e = $e0;
					haxe.unit.TestRunner.print("E");
					if(e.message != null) t.currentTest.error = "exception thrown : " + Std.string(e) + " [" + Std.string(e.message) + "]"; else t.currentTest.error = "exception thrown : " + Std.string(e);
					t.currentTest.backtrace = haxe.Stack.toString(haxe.Stack.exceptionStack());
					}
				}
				this.result.add(t.currentTest);
				t.tearDown();
			}
		}
		haxe.unit.TestRunner.print("\n");
		haxe.Log.trace = old;
	}
	,run: function() {
		this.result = new haxe.unit.TestResult();
		var $it0 = this.cases.iterator();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			this.runCase(c);
		}
		haxe.unit.TestRunner.print(this.result.toString());
		return this.result.success;
	}
	,add: function(c) {
		this.cases.add(c);
	}
	,cases: null
	,result: null
	,__class__: haxe.unit.TestRunner
}
haxe.unit.TestStatus = $hxClasses["haxe.unit.TestStatus"] = function() {
	this.done = false;
	this.success = false;
};
haxe.unit.TestStatus.__name__ = ["haxe","unit","TestStatus"];
haxe.unit.TestStatus.prototype = {
	backtrace: null
	,posInfos: null
	,classname: null
	,method: null
	,error: null
	,success: null
	,done: null
	,__class__: haxe.unit.TestStatus
}
var js = js || {}
js.Boot = $hxClasses["js.Boot"] = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Lib = $hxClasses["js.Lib"] = function() { }
js.Lib.__name__ = ["js","Lib"];
js.Lib.document = null;
js.Lib.window = null;
js.Lib.debug = function() {
	debugger;
}
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
co.doubleduck.BaseAssets.onLoadAll = null;
co.doubleduck.BaseAssets._loader = null;
co.doubleduck.BaseAssets._cacheData = { };
co.doubleduck.BaseAssets._loadCallbacks = { };
co.doubleduck.BaseAssets.loaded = 0;
co.doubleduck.BaseAssets._useLocalStorage = false;
co.doubleduck.BaseGame._viewport = null;
co.doubleduck.BaseGame._scale = 1;
co.doubleduck.BaseGame.DEBUG = false;
co.doubleduck.BaseGame.LOGO_URI = "images/duckling/splash_logo.png";
co.doubleduck.BaseGame.LOAD_STROKE_URI = "images/duckling/loading_stroke.png";
co.doubleduck.BaseGame.LOAD_FILL_URI = "images/duckling/loading_fill.png";
co.doubleduck.BaseGame.ORIENT_PORT_URI = "images/duckling/orientation_error_port.png";
co.doubleduck.BaseGame.ORIENT_LAND_URI = "images/duckling/orientation_error_land.png";
co.doubleduck.BasePersistence.GAME_PREFIX = "DUCK";
co.doubleduck.BasePersistence.available = co.doubleduck.BasePersistence.localStorageSupported();
co.doubleduck.BigPizza.DEFAULT_STATUS = co.doubleduck.PizzaStatus.RAW;
co.doubleduck.Button.CLICK_TYPE_NONE = 0;
co.doubleduck.Button.CLICK_TYPE_TINT = 1;
co.doubleduck.Button.CLICK_TYPE_JUICY = 2;
co.doubleduck.Button.CLICK_TYPE_SCALE = 3;
co.doubleduck.Button.CLICK_TYPE_TOGGLE = 4;
co.doubleduck.Button.CLICK_TYPE_HOLD = 5;
co.doubleduck.Button._defaultSound = null;
co.doubleduck.Customer.DIRECTION_LEFT = 0;
co.doubleduck.Customer.DIRECTION_RIGHT = 1;
co.doubleduck.Customer.CUSTOMER_VIEW_LINE = 0.8;
co.doubleduck.Customer.PISSED_1 = 0.4;
co.doubleduck.Customer.PISSED_2 = 0.6;
co.doubleduck.Customer.PISSED_3 = 0.8;
co.doubleduck.Customer.ARRIVE_SPEED = 0.5;
co.doubleduck.Customer.LEAVE_SPEED_SATISFIED = 0.3;
co.doubleduck.Customer.LEAVE_SPEED_ANGRY = 0.7;
co.doubleduck.Customer._toppingSpritesheet = null;
co.doubleduck.Menu.LEVELS_PER_SCREEN = 6;
co.doubleduck.Menu.WORLD_MOVE_EASE = 0.007;
co.doubleduck.Menu._iconSpritesheet = null;
co.doubleduck.Menu._shownChaz = false;
co.doubleduck.OvenSlot.SLOT_PADDING = 2;
co.doubleduck.Pizza.MAX_TOPPINGS = 4;
co.doubleduck.Session.LIQUID_SCALE = 0.7;
co.doubleduck.Session.level = 1;
co.doubleduck.SmallPizza.DEFAULT_STATUS = co.doubleduck.PizzaStatus.RAW;
co.doubleduck.SmallPizza._doughSpritesheet = null;
co.doubleduck.SmallPizza._toppingSpritesheet = null;
co.doubleduck.audio.WebAudioAPI._buffers = { };
co.doubleduck.SoundManager._muted = false;
co.doubleduck.SoundManager._cache = { };
co.doubleduck.SoundManager.available = co.doubleduck.SoundManager.isSoundAvailable();
co.doubleduck.audio.AudioFX._muted = false;
co.doubleduck.audio.HowlerAudio._muted = false;
co.doubleduck.audio.NonOverlappingAudio._musicPlaying = false;
js.Lib.onerror = null;
co.doubleduck.Main.main();

// ev.me code - in-game dialog
window.Popup = (function() {
  var el,

      cbHide,
      COOKIE_NAME = 'dontShowOffer';

  function show(onHide) {
    cbHide = onHide || function(){};

    if (Cookies.get(COOKIE_NAME)) {
      cbHide();
      return;
    }

    Cookies.set(COOKIE_NAME, 'yes', 60 * 60 * 24 * 365);

    createPrompt();

    window.setTimeout(function() {
      el.classList.add('active');

      var elScreen = document.createElement('div');
      elScreen.id = 'popup-screen';
      document.body.appendChild(elScreen);

      reportEvent('Show');
    }, 0);
  }

  function hide() {
    el.classList.remove('active');
    var elScreen = document.getElementById('popup-screen');
    elScreen && elScreen.parentNode.removeChild(elScreen);
    cbHide && cbHide();
    reportEvent('Hide');
  }

  function onClick(selector, callback) {
    document.getElementById(selector).addEventListener('click', callback);
  }

  function createPrompt() {
    el = document.getElementById('popup');

    if (!el) {
      el = document.createElement('div');
      el.id = 'popup';
      el.innerHTML =  '<div class="content">' +
                        '<span class="button" id="button-done"></span>' +
                      '</div>';

      document.body.appendChild(el);
    }

    onClick('button-done', hide);
  }

  return {
    show: show,
    hide: hide
  };
}());

function reportEvent(eventType) {
  !_gaq && (_gaq = []);
  _gaq.push(['_trackEvent', 'Turkey Shack', eventType]);
}

var Cookies = {
  "get": function get(key) {
    var cookies = document.cookie.split(';'),
        regexTrimStart = /\s+(.*)/g;

    for(var i=0, cookie; cookie=cookies[i++];) {
      cookie = cookie.split('=');
      if (cookie[0].replace(regexTrimStart, '$1') === key) {
        return cookie[1];
      }
    }

    return null;
  },

  "set": function set(key, value, ttl) {
    var expires = '';

    if (ttl) {
      var date = new Date();
      date.setTime(date.getTime() + ttl * 1000);
      expires = '; expires=' + date.toGMTString();
    }

    document.cookie = key + '=' + (value || '') + expires + '; path=/';
  },

  "remove": function remove(key) {
    this.set(key, '', -1);
  }
};