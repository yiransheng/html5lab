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
	       .bind("click", (this.moveTo = Sheng.proxy(function(e){
	           var name = $(e.target).text(), 
		       id = Number($(e.target).attr("name"));
		   this.tabs[id].toggleClass("hide");
		   this.active.toggleClass("hide");
		   this.active = this.tabs[id];
	       }, this)) ).appendTo($(head));
       }
       return this
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

var AppListView = {

    items : null, 

    tags: null, 

    tag_count: null,

    sorted: false, 

    template: "#template-applist", 

    init: function(items){
	this.items = items;
        this.allTags();
	this.sort();
	return this
    }, 

    sort  : function(subset) {
        if (!subset) subset = this.items;
	subset.sort(function(a,b){
	    return (a.updated_at <= b.updated_at)
	});
        this.sorted = true;
	return subset
    }, 

    renderByTag: function(tags) {
	// split tags by white space
        var splitter=/\s+/,i,j,tag,ret=[];	   
	tags = tags.split(splitter);
	for (i in tags){
	    tag = tags[i];
	    if (this.tags.indexOf(tag) != -1){
	        for (j in this.items){
		    if (this.items[j].tags.indexOf(tag) != -1) {
		        ret.push(this.items[j]);
		    }
		}    
	    }
	}

	return this.sorted ? this.render(ret) : this.render( this.sort(ret) )
    }, 

    allTags: function() {
	var i,j, item,tag,count={},ret=[];
        for (i in this.items){
	    item = this.items[i];
            for (j in item.tags){
	        tag = item.tags[j];
		if (!count[tag]){
		    count[tag] = 1;
		} else {
		    count[tag] ++;
		}
	    }
	};
	for (i in count){
	    ret.push(i);
	};
	this.tags = ret;
	this.tag_count = count;
	return count
    }, 

    render: function(items){
	var i, k, template, item, tags, output="";
	template = $(this.template).clone();
        if (!items) items = this.items;
	for (i in items){
	    item = items[i];
	    tags = Sheng.map(item.tags, function(tag){
	        return '<a href="#" name="'+tag+'">'+ tag + '</a>';
	    });
	    template.find('[name="date"]').empty().text(item.updated_at);
	    template.find('[name="tags"]').empty().html(tags.join(","));
	    template.find('[name="title"]')
		    .empty().text(item.name)
		    .attr("href", "#"+item.place);
	    output+=template[0].innerHTML;
	}
	return output
    }, 

    tagCloud: function() {
        var tags = this.tags;
	tags = Sheng.map(tags, function(tag){
            return '<a href="#" name="'+tag+'">'+ tag +'(' + this.tag_count[tag]+')</a>';
	}, this);
	return tags.join(" ");
    }

};
