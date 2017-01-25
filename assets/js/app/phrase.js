var t = {};

for(var j in JST){
	var n = j.replace('assets/templates/', '').replace('.html', '');
	t[n] = JST[j];
}

var appfraseview;


var Phrase = Backbone.Model.extend({
	urlRoot: '/phrase'
});

var Phrases = Backbone.Collection.extend({
	model: Phrase,
	url: '/phrase'
});

var phrases = new Phrases();

var PhraseView = Backbone.View.extend({
	tagName: 'div',
	className: 'ui celled list',
	initialize: function (){
		this.listenTo(this.model, 'change', this.render);
	},
	render: function(){
		// var html = t.table_phrase_item(this.model.toJSON());
		var html = t['list'](this.model.toJSON());
		console.log(html);
		this.$el.html(html);
		return this;
	}
});


var AppPhraseView = Backbone.View.extend({
	el: $('body'),
	initialize: function(){
		console.log('debug: AppPhraseView');
		this.listenTo(phrases, 'reset', this.addAll);
		this.listenTo(phrases, 'add', this.addOne);
		phrases.fetch({reset: true});
	},

	addAll: function(){
		// $('table#table-phrase > tbody').html('');
		$('#lista').html('');
		phrases.each(this.addOne, this);
	},

	addOne: function (model){
		var view = new PhraseView({model: model}).render().el;
		// that.$table.append(view);
		// $('table#table-phrase > tbody').append(view);
		$('#lista').append(view);
	}
});


// if ($('table#table-phrase').length){
// 	appfraseview = new AppPhraseView();	
// }
// $(function(){
// 	if ($('div#lista').length){
// 		appfraseview = new AppPhraseView();	
// 	}
	
// });

io.socket.on('phrase', function (msg){
	console.log('msg', msg);

	    switch (msg.method) {
	        case 'created': phrases.add(msg.data); break;
	        case 'updated': phrases.get(msg.id).set(msg.previous); break;
	        case 'destroyed': phrases.remove(phrases.get(msg.id)); break;
	    }

});

$('#add-phrase').on('click', function (e){
	$('#modal-phrases').modal({
	  transition: 'scale',
	  closable: false,
	  onDeny    : function(){
	    // return false;
	  },
	  onApprove : function() {
	    var $c = $('#comment'), comment = $c.val();
	    phrases.create({ comment_text: comment });
	    $c.val('');
	  },
	  onShow    : function(){
	  },
	}).modal('show');
});

$('.ui.dropdown').dropdown();