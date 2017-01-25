var myCollectionView, appfraseview;
$(function (){

	var Phrase = Backbone.Model.extend({
		urlRoot: '/phrase'
	});

	var Phrases = Backbone.Collection.extend({
		model: Phrase,
		url: '/phrase',
		initialize: function (){
			this.fetch({reset: true});
		}
	});

	var PhraseView = Marionette.View.extend({
		tagName: 'div',
		className: 'item',
		template: H.Template.list
	});

	var EmptyView = Marionette.View.extend({
		template: _.template('<div>No items</div>')
	});

	var MyCollectionView = Marionette.CollectionView.extend({
		tagName: 'div',
		className: 'ui celled list',
		collection: new Phrases(),
		childView: PhraseView,
		emptyView: EmptyView
	});


	if( $('#content').length ){
		myCollectionView = new MyCollectionView();
		myCollectionView.render();
		$('#content').html(myCollectionView.$el);		
	}




// var AppPhraseView = Backbone.View.extend({
// 	el: $('body'),
// 	initialize: function(){
// 		console.log('debug: AppPhraseView');
// 		this.listenTo(phrases, 'reset', this.addAll);
// 		this.listenTo(phrases, 'add', this.addOne);
// 		phrases.fetch({reset: true});
// 	},

// 	addAll: function(){
// 		// $('table#table-phrase > tbody').html('');
// 		$('#lista').html('');
// 		phrases.each(this.addOne, this);
// 	},

// 	addOne: function (model){
// 		var view = new PhraseView({model: model}).render().el;
// 		// that.$table.append(view);
// 		// $('table#table-phrase > tbody').append(view);
// 		$('#lista').append(view);
// 	}
// });


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
});