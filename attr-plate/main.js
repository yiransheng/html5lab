 
var attr = function(name,value){
  this.p = new point();
  this.name = name;
  this.value = value;
  this.set();
};
attr.prototype = {
  set: function(rot){
    if (typeof rot =='undefined'){rot = 0};
    this.p.x = this.value * Math.cos(rot);
    this.p.y = this.value * Math.sin(rot);
  }
};
var pad = function(x,y,c,s){
  this.attrs = new Array;
  this.pos = new point(x,y);
  this.canvas = c;
  this.size = s;
};
pad.prototype = {
  append: function(name,value){
    var p = new attr(name,value);
    this.attrs.push(p);
    this.refresh();
  },
  find: function(name){
    for (j in this.attrs){
      var a = this.attrs[Number(j)];
      if (a.name == name){
        return a;
      }   
    } 
  },
  refresh: function(){
    var l = this.attrs.length;
    for (var i=0; i<l; i++){
      this.attrs[i].set(Math.PI*2*i/l);
    }
  },
  connect: function(p1,p2,a){
    var _p1 = this.pos.add(p1);
    var _p2 = this.pos.add(p2);
    var x1 = _p1.x;
    var y1 = _p1.y;
    var x2 = _p2.x;
    var y2 = _p2.y;
    var c = this.canvas.getContext('2d');
    c.moveTo(x1,y1);
    c.lineTo(x2,y2);
    c.lineWidth = 2;
    c.lineCap = 'round';
    c.strokeStyle = 'rgba(255, 20, 0,'+a+')';
    c.stroke();
  },
  draw: function(){
    for (var i=1;i<11;i++){
      var c = this.canvas.getContext('2d');
      c.fillStyle = "rgba(245,100,0,.05)";
      c.beginPath();
      c.arc(this.pos.x,this.pos.y,this.size*i/10,0,Math.PI*2,true);
      c.closePath();
      c.stroke();
      c.fill();
    }
    for (j in this.attrs){
      var a = this.attrs[Number(j)];
      var x2 = this.pos.add(a.p).x;
      var y2 = this.pos.add(a.p).y;
      c.fillStyle = "rgba(245,100,0,.05)";
      c.beginPath();
      c.arc(x2,y2,2,0,Math.PI*2,true);
      c.closePath();
      c.fill();
      c.fillStyle = 'rgba(145,100,55,.9)';
      c.font = 'italic 12px sans-serif';
      c.textBaseline = 'top';
      c.fillText  (a.name, x2, y2);
      var lj = Number(j)-1;
      if (lj<0) { lj = this.attrs.length - 1};
      var b = this.attrs[lj];
      this.connect(a.p,b.p,.6); 
      this.connect(a.p,new point(0,0),.1);
      this.connect(b.p,new point(0,0),.1);   
    }
  },
  clear: function(){
    var c = this.canvas.getContext('2d');
    c.clearRect(0,0,this.canvas.width,this.canvas.height);
  }
};
//---main program
(function() {
  var c = document.getElementById("canvas");
  var p = new pad(150,150,c,150);
  var ani = new Array;
  for(var i=1;i<9;i++){
    var n = '#n'+i;
    var a = '#a'+i;
    nValue = $(n).val();
    aValue = $(a).val();
    ani.push(aValue*40);
  }
  var onEnterFrame = function(){
    temp.clear();
    temp = new pad(150,150,c,150);
    var totalDiff = 0;
    for(var i=0;i<8;i++){
      var incre = (p.attrs[i].value - ani[i]);
      ani[i] += incre/20;
      temp.append(p.attrs[i].name, ani[i]);
      totalDiff += Math.abs(incre);
    }
    temp.draw();
    if (totalDiff<2){
      temp.clear();
      temp = null;
      p.draw();
      tl.stop();
    }
  };
  var tl = new Timeline();
  $("#start").click(function(){
      p = new pad(150,150,c,150);
      for(var i=1;i<9;i++){
        var n = '#n'+i;
        var a = '#a'+i;
        nValue = $(n).val();
        aValue = $(a).val();
        p.append(nValue,aValue*150);
      }
      temp = new pad(150,150,c,150);
      tl.bind(tl.EVENT_ENTER_FRAME, onEnterFrame);
      tl.start();
    });
})();
 
