$(function (){

  if( __n('#feedListController') ) return;

  $('.ui.dropdown').dropdown();

  $('#text-post').on('focusin', function (e){
    $('#divider-post').css('display', '');
    $('#divider-post-item').slideDown(200);
	});

  $('.cancelPost').on('click', function (e){
    $('#divider-post').css('display', 'none');
    $('#divider-post-item').slideUp(150);
  });

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

		    var post = new PostModel({
					phrase_native: phrase_native,
					phrase_language: phrase_language
				});

				post.save({},{success: function(post){
          $('#divider-post').css('display', 'none');
          $('#divider-post-item').slideUp(150);
          posts.add(post.toJSON());
        }});

				$('#phrase_native, #phrase_language').val('');
				Backbone.history.navigate('/');

				$('#modal-phrases').modal('hide');
			}
    })
  ;

  $('#add-phrase').on('click', function (e){
    Backbone.history.navigate('phrase/new', {trigger: true});
  });

  var PostModel = L.Model.Friend.extend({
    urlRoot: '/api/v1/post'
  });

  var PostCollection = Backbone.Collection.extend({
    url: '/api/v1/post',
    model: PostModel,
    parse: function(resp){
      return resp.results;
    }
  });

  var MaybeModel = L.Model.Friend.extend({
    urlRoot: '/api/v1/maybe'
  });

  var MaybeCollection = L.Collection.Default.extend({
    url: '/api/v1/maybe'
  });

  var PostView = Marionette.View.extend({
    tagName: 'div',
    className: 'ui event segment',
    template: Template.get('post/post_event_item'),
    ui: {
      dropdown: '.ui.dropdown',
      date: '.date'
    },
    attachElContent: function (html){
      this.$el.html(html);
      this.$el.find('.ellipsis.horizontal').dropdown();
      this.getDate();
      return this;
    },

    getDate: function (){
      var self = this;
      window.setInterval(function(){
        moment.locale(self.model.get('phrase_native_flag_prefix'));
        var createdAt = moment.tz(self.model.get('createdAt'), 'America/Merida').fromNow();
        self.ui.date.text(createdAt);
      }, 1000);

    }
  });

  var PostCollectionView = Marionette.CollectionView.extend({
    tagName: 'div',
    className: 'ui feed',
    childView: PostView,
    emptyView: Marionette.View.extend({template: _.template('<div> No posts </div>')})
  });

  var MaybeView = Marionette.View.extend({
    tagName: 'div',
    className: 'item',
    template: Template.get('maybe_item'),
    ui: {
      maybe: '.maybe-btn'
    },
    events: {
      'click @ui.maybe': 'maybeBtn'
    },
    maybeBtn: function (e){
      this.model.save();
    }
  });

  var MaybeCollectionView = Marionette.CollectionView.extend({
    tagName: 'div',
    className: 'ui middle aligned divided list',
    childView: MaybeView,
    emptyView: Marionette.View.extend({template: _.template('<div> You have no friends</div>')}),
  });

  var AppMain = Marionette.Application.extend({

    initialize: function (options){
      this.posts = options.posts;
      this.maybe = options.maybe;

      this.listenTo(this.maybe, 'sync', this.maybeList);
      this.listenTo(this.posts, 'sync', this.postList);
    },
    maybeList: function (){
      var v = new MaybeCollectionView({collection: this.maybe});
      $('#maybeList').html(v.render().el);
    },
    postList: function (){
      var v = new PostCollectionView({collection: this.posts});
      $('#feedPostListContainer').html(v.render().el);
    },
    onStart: function(){
      this.posts.fetch({reset: true});
      this.maybe.fetch({reset: true, data: {page: 1}});
    }
  });

  var AppRoute = Marionette.AppRouter.extend({
		routes: {
			'phrase/new' : 'newPhrase'
		},
		newPhrase: function (){
			_debug('newPost route');

      $('#modal-phrases').modal({
  		  transition: 'scale',
  		  closable: false,
  		  onDeny    : function(){
  				Backbone.history.navigate('/', {trigger:true});
  		  },
  		  onApprove : function() {
  				$('#formPhraseAdd').form('validate form');
  				return false;
  		  },
  		  onShow    : function(){

  		  },
  		}).modal('show');

		}
	});

  Backbone.history.start({ root: 'feed', pushState: true });

  var maybe = new MaybeCollection();
  var posts = new PostCollection();

  app.router = new AppRoute();
  app.main = new AppMain({maybe: maybe, posts: posts});
  app.main.start();

});