$(function (){

  if( __n('#friendListController') ) return;

  var FriendModel = L.Model.Friend.extend({
    urlRoot: '/api/v1/friend'
  });

  var FriendCollection = L.Collection.Default.extend({
    url: '/api/v1/friend'
  });

  var MaybeModel = L.Model.Friend.extend({
    urlRoot: '/api/v1/maybe'
  });

  var MaybeCollection = L.Collection.Default.extend({
    url: '/api/v1/maybe'
  });

  var FriendView = L.View.FriendView.extend({
    tagName: 'div',
    className: 'item',
    template: Template.get('friend_item'),
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
          .addClass('red')
          .html('<i class="remove icon"></i> Delete');
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

  var FriendCollectionView = L.CollectionView.FriendCollectionView.extend({
    tagName: 'div',
    className: 'ui divided items',
    childView: FriendView,
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
    // region: '#friendList',

    initialize: function (options){
      this.friends = options.friends;
      this.maybe = options.maybe;

      this.listenTo(this.friends, 'sync', this.friendsList);
      this.listenTo(this.maybe, 'sync', this.maybeList);
    },
    friendsList: function (){
      var v = new FriendCollectionView({collection: this.friends});
      $('#friendList').html(v.render().el);
    },
    maybeList: function (){
      console.log(this.maybe.toJSON());
      var v = new MaybeCollectionView({collection: this.maybe});
      $('#maybeList').html(v.render().el);
    },
    onStart: function(){
      this.friends.fetch({reset: true, data: {page: 1}});
      this.maybe.fetch({reset: true, data: {page: 1}});
    }
  });

  var friends = new FriendCollection();
  var maybe = new MaybeCollection();

  app.main = new AppMain({friends: friends, maybe: maybe});
  app.main.start();

});
