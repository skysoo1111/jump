this._s=this._s||{};(function(_){var window=this;
try{
_.Qvc=function(a){this.Pk=a};
}catch(e){_._DumpException(e)}
try{
var Rvc=function(a){_.An.call(this,a.Ka);var b=this;this.window=a.service.window.get();this.wa=this.Pk();this.oa=window.orientation;this.ka=function(){var c=b.Pk(),d=b.cbb()&&90===Math.abs(window.orientation)&&b.oa===-1*window.orientation;b.oa=window.orientation;if(c!==b.wa||d){b.wa=c;d=_.Sa(b.Je);for(var e=d.next();!e.done;e=d.next()){e=e.value;var f=new _.Qvc(c);try{e(f)}catch(g){_.ca(g)}}}};this.Je=new Set;this.window.addEventListener("resize",this.ka);this.cbb()&&this.window.addEventListener("orientationchange",
this.ka)};_.C(Rvc,_.An);Rvc.Bb=_.An.Bb;Rvc.Ea=function(){return{service:{window:_.Bn}}};Rvc.prototype.addListener=function(a){this.Je.add(a)};Rvc.prototype.removeListener=function(a){this.Je.delete(a)};
Rvc.prototype.Pk=function(){if(Svc()){var a=_.pl(this.window);a=new _.Yk(a.width,Math.round(a.width*this.window.innerHeight/this.window.innerWidth))}else a=this.Xb()||(_.ta()?Svc():this.window.visualViewport)?_.pl(this.window):new _.Yk(this.window.innerWidth,this.window.innerHeight);return a.height<a.width};Rvc.prototype.destroy=function(){this.window.removeEventListener("resize",this.ka);this.window.removeEventListener("orientationchange",this.ka)};var Svc=function(){return _.ta()&&_.nh.XE()&&!navigator.userAgent.includes("GSA")};
Rvc.prototype.Xb=function(){return _.Tvc};Rvc.prototype.cbb=function(){return"orientation"in window};_.Tvc=!1;_.Dn(_.u_a,Rvc);
_.Tvc=!0;
}catch(e){_._DumpException(e)}
try{
_.l("aLUfP");

_.n();
}catch(e){_._DumpException(e)}
})(this._s);
// Google Inc.
