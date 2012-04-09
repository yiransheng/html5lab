/*===========================================
By Yiran Sheng: http://www.yiransheng.com
Basic Geometry Lib
============================================*/
//--point 
var point = function(x,y){
  this.x = x;
  this.y = y;
};
point.prototype = {
  x:0,
  y:0,
  add: function(p){
    var nx = this.x + p.x;
    var ny = this.y + p.y;
    return new point(nx,ny);
  },
  subtract: function(p){
    var nx = this.x - p.x;
    var ny = this.y - p.y;
    return new point(nx,ny);
  },
  times: function(v){
    return new point(this.x*v,this.y*v);
  },
  dotp: function(p){
    var dp = this.x*p.x+this.y*p.y;
    return dp;
  },
  vecp: function(p){
    var vp = this.x*p.y+this.y*p.x;
    return vp;
  },
  dist: function(){
    return Math.sqrt(this.x*this.x+this.y*this.y);
  },
  normalize: function(){
    var d = this.dist();
    return new point((this.x/d),(this.y/d));
  }
};

//--------Timeline
var Timeline = function( option ){
  this.config( option );
};
Timeline.prototype = {
  EVENT_ENTER_FRAME : "enterFrame",

  option:{
    fps:30
  },
  tid:null,
  parent: null,
  active:false,
  
  config:function( option,p ){
    if( isNaN( option ) ){
      this.option = $.extend( {}, this.option, option );
    } else {
      this.option.fps = option;
    }
    this.parent = p;
    return this;
  },
  start:function(){
    this.active = true;
    this._enterFrame();
    return this;
  },
  _enterFrame:function(){
    if( this.active ){
      this.tid = setTimeout(
        $.proxy( this._enterFrame, this ),
        Math.floor( 1000 / this.option.fps )
      );
      $(this).trigger( this.EVENT_ENTER_FRAME );
    }
  },
  stop:function(){
    this.active = false;
    clearTimeout( this.tid );
    return this;
  },
  setParent:function(p){
    this.parent = p;
    return this;
  },
  bind:function( name, func ){
    $(this).bind( name, func );
    return this;
  },
  unbind:function( name, func ){
    $(this).unbind( name, func );
    return this;
  }
};

 



