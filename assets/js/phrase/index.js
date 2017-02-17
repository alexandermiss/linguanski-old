var app = app || {};

$(function (){

	var Phrase = Backbone.Model.extend({
		urlRoot: '/api/v1/add_phrase'
	});

	var Phrases = Backbone.Collection.extend({
		model: Phrase,
		url: '/api/v1/phrases',

		parse: function (resp){
			_.extend( this, _.omit(resp, 'results') );
			return _.pick(resp, 'results').results;
		},


	});

	var PhraseView = Marionette.View.extend({
		tagName: 'div',
		className: 'three column row',
		template: Template.get('list'),
		ui: {
			phrase_ru: '.phrase_ru',
			phrase_es: '.phrase_es',
			phrase_en: '.phrase_en'
		},
		events: {
			'click @ui.phrase_ru': 'updatePhrase',
			'click @ui.phrase_es': 'updatePhrase',
			'click @ui.phrase_en': 'updatePhrase',
		},
		updatePhrase: function (e){
			Backbone.history.navigate('update/'+this.model.get('id'), {trigger:true});
		}
	});

	var EmptyView = Marionette.View.extend({
		template: _.template('<div>No items</div>')
	});

	var PhraseCollectionView = Marionette.CollectionView.extend({
		tagName: 'div',
		className: 'ui vertically divided grid container',
		collection: new Phrases(),
		childView: PhraseView,
		emptyView: EmptyView
	});

	var AppRoute = Marionette.AppRouter.extend({
		initialize: function (opts){
			this.collection = opts.collection;
			this.collection.fetch({reset:true});
		},
		appRoutes: {
			'update/:id' : 'update',
		},
		controller:{
			update: function (id){
				console.log('updating route', id);
				$('#modal-phrases').modal('show');
			},
		}
	});

	var Pagination = Marionette.View.extend({
		el: '#pagination',
		template: Template.get('pagination_phrase'),

		ui: {
			'atras': '.atras',
			'adelante': '.adelante'
		},

		events: {
			'click @ui.atras': 'atrasEvent',
			'click @ui.adelante': 'adelanteEvent',
		},

		atrasEvent: function (){
			if( this.collection.page > 1 ) this.collection.page -= 1;
			console.log(this.collection.page);
			this.collection.reset(this.collection.toJSON());
			this.collection.fetch({ data: { page: this.collection.page} });
		},

		adelanteEvent: function(){
			this.collection.page += 1;
			console.log(this.collection.page);
			this.collection.reset(this.collection.toJSON());
			this.collection.fetch({ data: { page: this.collection.page} });
		},

		onRender: function(){
			console.log(this.collection);
		}
	});

	var MyApp = Marionette.Application.extend({
		region: '#phrase-content',

		onStart: function (){
			this.showView(new PhraseCollectionView());
			var col = this.getView().collection;
			app.col = col;
			var appRoute = new AppRoute({collection: col});
			var pagination = new Pagination({collection: col});
			pagination.render();
			Backbone.history.start({ root: 'phrases' });
			Backbone.history.navigate('index', {trigger:true});
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
				Backbone.history.navigate('index', {trigger:true});
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

				$('#phrase_ru, #phrase_en, #phrase_es').val('');
				$('#source').dropdown('clear')
				Backbone.history.navigate('index', {trigger:true});
		  },
		  onShow    : function(){
				Backbone.history.navigate('new', {trigger:true});
		  },
		}).modal('show');
	});

	$('#menu').dropdown({ action: 'combo'});
});
