$(function (){

  if( __n('#requestListController') ) return;

  var RequestModel = L.Model.Friend.extend({
    urlRoot: '/api/v1/request'
  });

  var RequestCollection = L.Collection.Default.extend({
    url: '/api/v1/request'
  });

  var MaybeModel = L.Model.Friend.extend({
    urlRoot: '/api/v1/maybe'
  });

  var MaybeCollection = L.Collection.Default.extend({
    url: '/api/v1/maybe'
  });

  var RequestView = L.View.FriendView.extend({
    tagName: 'div',
    className: 'item',
    template: Template.get('friend/request_item'),
    ui: {
      friend: '.friend-btn',
      i: 'i'
    },
    events: {
      'click @ui.friend': 'friendBtn',
      'mouseenter @ui.friend': 'mouseEnter',
      'mouseleave @ui.friend': 'mouseLeave'
    },
    mouseEnter: function (e){
      if( this.model.get('status') == 'friend'){
        this.ui.friend
          .removeClass('teal')
          .removeClass('basic')
          .addClass('red')
          .html('<i class="remove icon"></i>  Delete');
      }
    },
    mouseLeave: function (e){
      if( this.model.get('status') == 'friend'){
        this.ui.friend
        .removeClass('red')
        .addClass('basic')
        .addClass('teal')
        .html('<i class="checkmark icon"></i> Friends');
      }
    },
    friendBtn: function (e){
      console.log(this.model.toJSON());
      this.model.save();
    }
  });

  var RequestCollectionView = L.CollectionView.FriendCollectionView.extend({
    tagName: 'div',
    className: 'ui divided items',
    childView: RequestView,
    emptyView: Marionette.View.extend({
      template: _.template('<div> You have no friends</div>')
    }),
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
      _debug('Request Model', this.model.toJSON());
      this.model.save();
    }
  });

  var MaybeCollectionView = Marionette.CollectionView.extend({
    tagName: 'div',
    className: 'ui middle aligned divided list',
    childView: MaybeView,
    emptyView: Marionette.View.extend({
      template: _.template('<div> You have no friends</div>')
    }),
  });

  var AppMain = Marionette.Application.extend({

    initialize: function (options){
      this.request = options.request;
      this.maybe = options.maybe;

      this.listenTo(this.request, 'sync', this.requestList);
      this.listenTo(this.maybe, 'sync', this.maybeList);
    },
    requestList: function (){
      var v = new RequestCollectionView({collection: this.request});
      $('#requestList').html(v.render().el);
    },
    maybeList: function (){
      var v = new MaybeCollectionView({collection: this.maybe});
      $('#maybeList').html(v.render().el);
    },
    onStart: function(){
      this.request.fetch({reset: true, data: {page: 1}});
      this.maybe.fetch({reset: true, data: {page: 1}});
    }
  });

  var request = new RequestCollection();
  var maybe = new MaybeCollection();

  app.main = new AppMain({request: request, maybe: maybe});
  app.main.start();

});
