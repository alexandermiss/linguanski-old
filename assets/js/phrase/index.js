var app = app || {};

$(function (){

	var Phrase = Backbone.Model.extend({
		urlRoot: '/api/v1/add_phrase'
	});

	var Phrases = Backbone.Collection.extend({
		model: Phrase,
		url: '/api/v1/phrases'
	});

	var PhraseView = Marionette.View.extend({
		tagName: 'div',
		className: 'three basic ui buttons',
		template: Template.get('list')
	});

	var EmptyView = Marionette.View.extend({
		template: _.template('<div>No items</div>')
	});

	var PhraseCollectionView = Marionette.CollectionView.extend({
		tagName: 'div',
		className: 'ui list',
		collection: new Phrases(),
		childView: PhraseView,
		emptyView: EmptyView
	});

	var MyApp = Marionette.Application.extend({
		region: '#phrase-content',

		onStart: function (){
			this.showView(new PhraseCollectionView());
			this.getView().collection.fetch({reset:true});
		}
	});

	if ( Backbone.$('#phrase-content').length ){
		app = new MyApp();
		app.start();
	}

	var phrases = app.getView().collection;

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
		    var ru 	= $('#phrase_ru').val()
				,		en 	= $('#phrase_en').val()
				,		es 	= $('#phrase_es').val()
				, 	src = $('#source').dropdown('get value');

		    phrases.create({
					phrase_ru: ru,
					phrase_en: en,
					phrase_es: es,
					source: src
				}, {wait: true});

		  },
		  onShow    : function(){
		  },
		}).modal('show');
	});

	$('#menu').dropdown({ action: 'combo'});
});
