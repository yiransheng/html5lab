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
//--------Vein
var vein = function(main){
  this.main = main; 
};
vein.prototype = {
  main: true,
  active: true,
  pos: {
    x:0,
    y:0
  },
  node: {
    x:0,
    y:0
  },
  des: {
    x:0,
    y:0
  },
  scale : 1,
  rot : 0,
  LENGTH : 30,
  setPos: function(x,y,r,s){
    this.pos = {x:x,y:y};
    this.node = this.des;
    var dx = x + this.LENGTH * Math.cos(r) * s ;
    var dy = y + this.LENGTH * Math.sin(r) * s ;
    this.des = {x:dx, y:dy};
    this.scale = s;
    this.rot = r;
  },
  alive: function(){
    if (Math.abs(this.pos.x - this.des.x)<1){
       return false;
    }
    else{
       return true;
    }
  },
  update: function(){
    var x = (this.des.x - this.pos.x)/20 + this.pos.x;
    var y = (this.des.x - this.pos.x)/20 + this.pos.y;
    this.pos = {x:x,y:y};
  },
  render: function(){
    //alert("onrender");
    var x1 = this.node.x;
    var y1 = this.node.y;
    var x2 = this.pos.x;
    var y2 = this.pos.y;
    var c = document.getElementById("canvas").getContext("2d");
    if(this.main){
	    c.fillStyle = "rgba(245,100,0,.3)";
	    c.beginPath();
	    c.arc(x2,y2,3*this.scale,0,Math.PI*2,true);
	    c.closePath();
	    c.stroke();
	    c.fill();
            c.moveTo(x1,y1);
	    c.lineTo(x2,y2);
	    c.lineWidth = this.scale*8;
	    c.lineCap = 'round';
	    c.strokeStyle = 'rgba(255, 20, 0, .01)';
	    c.stroke();
    }
    else{
            c.fillStyle = "rgba(235,20,0,.3)";
	    c.beginPath();
	    c.arc(x2,y2,2*this.scale,0,Math.PI*2,true);
	    c.closePath();
	    c.stroke();
	    c.fill();
            c.moveTo(x1,y1);
	    c.lineTo(x2,y2);
	    c.lineWidth = this.scale*8;
	    c.lineCap = 'round';
	    c.strokeStyle = 'rgba(245, 244, 33, .01)';
	    c.stroke();
    }
  }
};
 
 
//---main program
(function() {
    //alert("Program Begins.");
    var settings = {
      first : .94,
      second : .84,
      third : .7
    };
    var veins = new Array();
    veins[0] = new vein(true);
    veins[0].setPos(3,3,Math.PI/4,1);
    veins[0].render();
    var tl = new Timeline();
    var onEnterFrame = function (){
       //alert("onEnterFrame"+veins[0].pos.x);
       for (var j=0;j<veins.length; j++){
          if (veins[j].alive()){
             veins[j].node = veins[j].pos;
             veins[j].pos.x += (veins[j].des.x - veins[j].pos.x)/20;
             veins[j].pos.y += (veins[j].des.y - veins[j].pos.y)/20;
             veins[j].render();
          }
          else{
             if(veins[j].active && veins[j].scale>.2){
                veins[j].active = false;
                if (veins[j].main){
                  var v1 =new vein(true);
                  var rot1 = (Math.random()-0.5)*Math.PI/10;                
                  v1.setPos(veins[j].pos.x,veins[j].pos.y,veins[j].rot+rot1,veins[j].scale*settings.first);
                  veins.push(v1);
                }
                var v2 =new vein(false); 
                var rot2 = (Math.random()-.5)*Math.PI/2;                
                v2.setPos(veins[j].pos.x,veins[j].pos.y,veins[j].rot+rot2,veins[j].scale*settings.second);
                veins.push(v2);
                var v2 =new vein(false); 
                var rot2 = (Math.random()-.5)*Math.PI/4;                
                v2.setPos(veins[j].pos.x,veins[j].pos.y,veins[j].rot+rot2,veins[j].scale*settings.third);
                veins.push(v2);
             }
          }
       }
       if (veins.length>1500){
         tl.stop();
       }
    };
    //alert("free of error");
    $("#start").click(function(){
      tl.bind(tl.EVENT_ENTER_FRAME, onEnterFrame);
      var a1 = document.getElementById('attentuation_1');
      settings.first = a1.value;
      var a2 = document.getElementById('attentuation_2');
      settings.second = a2.value;
      var a3 = document.getElementById('attentuation_3');
      settings.third = a3.value;
      tl.start();
    });
    $("#stop").click(function(){
      tl.unbind(tl.EVENT_ENTER_FRAME, onEnterFrame);
      tl.stop();
    });
})();
 
