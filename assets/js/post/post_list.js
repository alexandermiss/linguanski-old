$(function (){

  if( __n('#feedListController') ) return;

  var page = 1, data_posts = 'da';

  function getScrollTop() {
  	return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
  }

  function getDocumentHeight() {
  	const body = document.body;
  	const html = document.documentElement;

  	return Math.max(
  		body.scrollHeight, body.offsetHeight,
  		html.clientHeight, html.scrollHeight, html.offsetHeight
  	);
  };

  function updatePosts () {
    if( data_posts == 'da' ){
      if (getScrollTop() < getDocumentHeight() - window.innerHeight) return;
      app.posts.fetch({ set: true, remove: false, data: {
        page: ++page, limit: 6, access_token: L.Auth.getToken()
      }});
    }
  };

  jQuery(window).on('scroll', _.throttle(updatePosts, 100));

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
					phrase_language: phrase_language,
          post_type: 'p'
				});

				post.save({access_token: L.Auth.getToken()},{success: function(post){
          $('#divider-post').css('display', 'none');
          $('#divider-post-item').slideUp(150);
          app.posts.add(post, {sort: false});
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

  $('#sendTextPost').on('click', function (e){
    var text = $('#text-post').val();
    var post = new PostModel({
      post_text: text,
      post_type: 't'
    });

    post.save({access_token: L.Auth.getToken()},{success: function(post){
      $('#divider-post').css('display', 'none');
      $('#divider-post-item').slideUp(150);
      $('#text-post').val('');
      app.posts.add(post, {sort: false});
    }});

  });

  var PostModel = L.Model.Friend.extend({
    urlRoot: '/api/v1/post'
  });

  var PostCollection = Backbone.Collection.extend({
    url: '/api/v1/post',
    model: PostModel,
    comparator: 'createdAt',
    parse: function(resp){
      data_posts = resp.data;
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
    getTemplate: function(){
      if(this.model.get('post_type') == 'p'){
        return Template.get('post/post_event_item');
      }else{
        return Template.get('post/post_text_item');
      }
    },
    ui: {
      dropdown: '.ui.dropdown',
      date: '.date'
    },

    onRender: function (){
      var self = this, prefix = $('#prefix').val();
      self.ui.dropdown.dropdown();

      var getTime = function (){
        moment.locale(prefix);
        var createdAt = moment.tz(self.model.get('createdAt'), 'America/Merida').fromNow();
        self.ui.date.text(createdAt);
      }

      getTime();
      window.setInterval(function(){
        getTime();
      }, 1000);
    }
  });

  var PostCollectionView = Marionette.CollectionView.extend({
    tagName: 'div',
    className: 'ui feed',
    childView: PostView,
    emptyView: Marionette.View.extend({template: _.template('<div> No posts </div>')}),
    attachHtml: function attachHtml(collectionView, childView, index) {
      if (collectionView._isBuffering) {
        collectionView._bufferedChildren.splice(0, 0, childView);
      } else {
        if (!collectionView._insertBefore(childView, index)) {
          collectionView._insertAfter(childView);
        }
      }
    },
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
      this.posts.fetch({reset: true, data: {
        page: page, limit: 6, access_token: L.Auth.getToken()}
      });
      this.maybe.fetch({reset: true, data: {
        limit: 5, access_token: L.Auth.getToken()}
      });
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
  app.posts = new PostCollection();

  app.router = new AppRoute();
  app.main = new AppMain({maybe: maybe, posts: app.posts});
  app.main.start();

});
