$(function() {
      var image = new Image();  
      image.src = "thumb.jpg";  
      var ctx = $('#stage-demo')[0].getContext("2d"); 
      var W = 200;
      var H = 100;
      
      var Particle = Sheng.Particle.extend({
          colorR : 0, 
	  colorG : 0, 
	  colorB : 0, 
	  colorA : 0
      });
      var Sys = Sheng.ParticleSys.extend({
          outBound: function(p) {
              var np = p.p.clone().add(p.v);
	      if (np.x<0 || np.x>W) {
	          p.bounce([1,0]);
		  return true
	      } 
	      if (np.y<0 || np.y>H) {
	          p.bounce([0,1]);
		  return true
	      }
	      return false
	  }, 

	  updateAll: function() {
              
	      ctx.clearRect(0,0,500,500);
	      for (var j=0;j<this.particles.length;j++) {
	          var p = this.particles[j];
		  p.update();
		  p.v.add(p.dest.clone().subtract(p.p).scale(.12));
		  p.v.scale(Math.random()*.1+.9);
		  if (p.v.length()<=.01){
		      p.v.set(Math.random()*30-15, Math.random()*5-2.4);
		  }
		  var i = redValueForPixel(p.p.x, p.p.y);
		  this.imageData.data[i] = p.colorR;
		  this.imageData.data[i+1] = p.colorG;
		  this.imageData.data[i+2] = p.colorB;
		  this.imageData.data[i+3] = p.colorA;
	      }

	      ctx.putImageData(this.imageData, 0, 0);  
	  }
      });


      var p, spawn, sys;
      sys = Sheng.create(Sys);
      sys.init({silent:true, maxsize:22250});
      var tl = Sheng.timeline();

      tl.bind(tl.EVENT_ENTER_FRAME, function(){
          sys.updateAll();
      });


      var redValueForPixel = function(x,y) { 
	  x = Math.floor(x);
	  y = Math.floor(y);
          return ((y - 1) * (W * 4)) + ((x - 1) * 4) 
      }; 

      $(image).load(function() {  
          ctx.drawImage(image, 0, 0, W, H);  
	  var imageData = ctx.getImageData(0, 0, W, H);  
	  var pixels = imageData.data;  
	  var spawn = function(s){return [Math.random()*s, Math.random()*s]};
	  sys.imageData = imageData;
	  for (var x=1;x<=imageData.width;x++){
	      for (var y=1;y<imageData.height;y++){
		  p = Sheng.create(Particle, {
		      p : Sheng.point(x,y).add(Sheng.point(y,x)),
		      v : Sheng.point(Math.random()*10-5, Math.random()*15-7.5),
		      a : Sheng.point(0,0),
		      colorR : pixels[redValueForPixel(x,y)],
		      colorG : pixels[redValueForPixel(x,y)+1],
		      colorB : pixels[redValueForPixel(x,y)+2],
		      colorA : pixels[redValueForPixel(x,y)+3]
	          });    
		  p.dest = Sheng.point(x,y);

	          sys.add(p);
	      }
	  }

      });  

      $("#stage-demo").click(function(e){
          e.preventDefault();
	  tl.toggle();
      });      
});

  
 
