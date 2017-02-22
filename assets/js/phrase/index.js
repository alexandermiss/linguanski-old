
$(function (){
	var app = {}, phrases = {};

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
		},
		routes: {
			'update/:id' : 'update',
			'page/:id' : 'pageNumber',
		},
		update: function (id){
			console.log('updating route', id);
			$('#modal-phrases').modal('show');
		},
		pageNumber: function (id){
			this.collection.fetch({ reset: true, data: { page: parseInt(id)} });
		},
	});

	var Pagination = Marionette.View.extend({
		el: '#pagination',
		initialize: function (){
			this.collection.page = 1;
		},
		template: Template.get('pagination_phrase'),
		ui: {
			'atras': '.atras',
			'adelante': '.adelante'
		},
		events: {
			'click @ui.atras': 'atrasEvent',
			'click @ui.adelante': 'adelanteEvent',
		},
		collectionEvents: {
			'reset': 'actionButtons'
		},
		actionButtons: function (){
			var page = this.collection.page, size = this.collection.size();
			if( !_.isNumber(page) ) page = parseInt(page);

			this.ui.atras.removeClass('loading');
			this.ui.adelante.removeClass('loading');

			if( page == 1 && size ){
				this.ui.atras.addClass('disabled');
				this.ui.adelante.removeClass('disabled');
			}else if( page > 1 && size ){
				this.ui.atras.removeClass('disabled');
				this.ui.adelante.removeClass('disabled');
			}else if( !size ){
				this.ui.atras.removeClass('disabled');
				this.ui.adelante.addClass('disabled');
			}

		},
		atrasEvent: function (){
			var page = this.collection.page;
			if ( !_.isNumber(page) ) page = parseInt(page);

			if ( page > 1 ){
				page--;
				this.ui.atras.addClass('loading');
				this.collection.page = page;
				Backbone.history.navigate('page/'+page, {trigger:true});
			}
		},
		adelanteEvent: function(){
			var page = this.collection.page;
			if ( !_.isNumber(page) ) page = parseInt(page);

			if( this.collection.size() ){
				page++;
				this.ui.adelante.addClass('loading');
				this.collection.page = page;
				Backbone.history.navigate('page/'+page, {trigger:true});
			}
		}
	});

	var MyApp = Marionette.Application.extend({
		region: '#phrase-content',

		onStart: function (){
			this.showView(new PhraseCollectionView());
			var col = this.getView().collection;
			var appRoute = new AppRoute({collection: col});
			var pagination = new Pagination({collection: col});
			phrases = app.getView().collection;
			pagination.render();
			Backbone.history.start({ root: 'phrases' });
			Backbone.history.navigate('page/1', {trigger:true});
		}
	});

	if ( Backbone.$('#phrase-content').length ){
		app = new MyApp();
		app.start();
	}

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
				Backbone.history.navigate('page/'+phrases.page, {trigger:true});
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
				Backbone.history.navigate('page/1', {trigger:true});
		  },
		  onShow    : function(){
				Backbone.history.navigate('new', {trigger:true});
		  },
		}).modal('show');
	});

	$('#menu').dropdown({ action: 'combo'});
});
