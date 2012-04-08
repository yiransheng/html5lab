var Tab = {
    el : null, 
    childClass: ".sheng-ui-tab", 
    headClass: ".sheng-ui-tabhead", 
    active: null,
    init: function(){
       var tabs, size, i, tab, head, name;
       this.tabs = new Array;
       tabs = $(this.el).find(this.childClass);
       head = $(this.el).find(this.headClass)[0];
       size = tabs.length || tabs.size;
       for (i=0;i<size;i++){
	   tab = $(tabs[i]);
           this.tabs.push(tab);
	   if (i>0) {
	       tab.addClass("hide");
	   } else {
	       this.active = tab;
	   }
	   name = tab.attr("name");
	   $("<span></span>").text(name).attr("name", String(i))
	       .bind("click", Sheng.proxy(function(e){
	           var name = $(e.target).text(), 
		       id = Number($(e.target).attr("name"));
		   this.tabs[id].toggleClass("hide");
		   this.active.toggleClass("hide");
		   this.active = this.tabs[id];
	       }, this)).appendTo($(head));
       }

    }
};
// used to wrap the iframe of a demo html page
var Stage = {

    el : null,

    src: "",

    config: {
        thumb: "thumb.png", 
	html: "index.html", 
    },

    loadThumnail: function(){
        var img = new Image(), self=this;
        img.src = this.src + this.config.thumb;
	$(img).load(function(){
	    var me = $(this);
            me.css("top", ($(self.el).height()-me[0].height)/2+"px" )
              .css("left", ($(self.el).width()-me[0].width)/2+"px" )
	      .appendTo(self.el);
	});
    },

    init: function(config) {
	Sheng.extend(this.config, config);
        var self = this;
	if (this.src.match(/[^//]+$/g)) {
	    this.src += "/"  
	}
	$("<iframe></iframe>").hide().appendTo(this.el);
	$('<button class="play">Run</button>')
	    .bind("click", function(){
                $(self.el).find("iframe")[0].src=self.src+self.config.html;
	        $(this).fadeOut(function(){
		    $(self.el).find("img").remove();
		    $(this).remove();
		    $(self.el).find("iframe").show();
		});
	    }).appendTo(this.el);
	this.loadThumnail();
    }
}
