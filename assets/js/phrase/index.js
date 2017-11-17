
$(function (){
	if( __n('#phrase-content') ) return;

	var phrases = {};

	$('#formPhraseAdd')
    .form({
      fields: {
        phrase_native: {
          identifier  : 'phrase_native',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter a text'
            }
          ]
        },
				phrase_language: {
          identifier  : 'phrase_language',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter a text'
            }
          ]
        }
      },
			onSuccess: function (event, fields){
				var phrase_native 		= fields.phrase_native
				,		phrase_language 	= fields.phrase_language;

		    var ph = new Phrase({
					phrase_native: phrase_native,
					phrase_language: phrase_language
				});
				ph.save();

				$('#phrase_native, #phrase_language').val('');
				Backbone.history.navigate('/page/1');

				$('#modal-phrases').modal('hide');
			}
    })
  ;


	var Phrase = Backbone.Model.extend({
		urlRoot: '/api/v1/add_phrase'
	});

	var Phrases = Backbone.Collection.extend({
		model: Phrase,
		url: '/api/v1/phrases',
		parse: function (resp){
			_.extend( this, _.omit(resp, 'results') );
			return _.pick(resp, 'results').results;
		}
	});

	var PhraseView = Marionette.View.extend({
		tagName: 'div',
		className: 'two column row',
		template: Template.get('list'),
		ui: {
			phrase_native: '.phrase_native',
			phrase_language: '.phrase_language'
		},
		events: {
			'click @ui.phrase_native': 'updatePhrase',
			'click @ui.phrase_language': 'updatePhrase'
		},
		updatePhrase: function (e){
			var lang = $(e.target).data('lang');
			Backbone.history.navigate('/update/'+this.model.get('id')+'/lang/'+lang, {trigger:true});
		}
	});

	var EmptyView = Marionette.View.extend({
		template: _.template('<div>No items</div>')
	});

	var PhraseCollectionView = Marionette.CollectionView.extend({
		tagName: 'div',
		className: 'ui vertically grid container',
		collection: new Phrases(),
		childView: PhraseView,
		emptyView: EmptyView
	});

	var AppRoute = Marionette.AppRouter.extend({
		initialize: function (opts){
			this.collection = opts.collection;
		},
		routes: {
			'update/:id/lang/:lang' : 'update',
			'page/:id' : 'pageNumber',
			'search/:q' : 'searchPhrase'
		},
		update: function (id, lang){
			_debug('updating route', id, lang, phrases.get(id).toJSON());
			var self = this;
			var col = this.collection;
			var m = phrases.get(id);

			if ( m.get('phrase_native_flag_prefix') == lang ){
				$('#phrase_text').val(m.get('phrase_native'));
			}else{
				$('#phrase_text').val(m.get('phrase_language'));
			}

			$('#modal-phrases-detail').modal({
				transition: 'scale',
			  closable: false,
			  onDeny    : function(){
					Backbone.history.navigate('/page/'+phrases.page, {trigger:true});
			  },
			  onApprove : function() {
			    var text 	= $('#phrase_text').val();

					var p = 'phrase_'+lang;
					m.set(p, text);
					m.save({lang: lang});
					_debug(p, 'm', m.toJSON());

					$('#phrase_text, #phrase_lang').val('');
			  }
			}).modal('show');
		},
		pageNumber: function (id){
			try{
				id = parseInt(id);
				this.collection.fetch({ reset: true, data: {
					page: id, access_token: L.Auth.getToken()} });
			}catch(err){
				Backbone.history.navigate('/page/1', {trigger: true});
			}
		},
		searchPhrase: function (q){
			app.main.getView().collection.fetch({reset: true, data: {
				q: q, access_token: L.Auth.getToken()}});
		}
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
				Backbone.history.navigate('/page/'+page, {trigger:true});
			}
		},
		adelanteEvent: function(){
			var page = this.collection.page;
			if ( !_.isNumber(page) ) page = parseInt(page);

			if( this.collection.size() ){
				page++;
				this.ui.adelante.addClass('loading');
				this.collection.page = page;
				Backbone.history.navigate('/page/'+page, {trigger:true});
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
			phrases = app.main.getView().collection;
			pagination.render();
			Backbone.history.start({ root: 'phrases', pushState: true });
			Backbone.history.navigate('/page/1', {trigger:true});
		}
	});

		app.main = new MyApp();
		app.main.start();

	io.socket.on('phrase', function (msg){
		_debug('msg', msg);

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
				Backbone.history.navigate('/page/'+phrases.page, {trigger:true});
		  },
		  onApprove : function() {
				$('#formPhraseAdd').form('validate form');
				return false;
		  },
		  onShow    : function(){
				Backbone.history.navigate('/new', {trigger:true});
		  },
		}).modal('show');
	});

	$('.prompt').on('change', _.debounce(function(e){
		var val = $(this).val() || '';

		if ( val != '' ){
			Backbone.history.navigate('/search/'+val, {trigger: true});
		}
		else{
			Backbone.history.navigate('/page/1', {trigger: true});
		}

	}, 500));

});
