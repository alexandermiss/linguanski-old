$(function (){

  if( __n('#friendListController') ) return;

  var FriendModel = L.Model.Friend.extend({
    urlRoot: '/api/v1/friend'
  });

  var FriendCollection = L.Collection.Default.extend({
    url: '/api/v1/friends'
  });

  var FriendView = L.View.FriendView.extend({
    tagName: 'div',
    className: 'item',
    template: Template.get('friend_item'),
    onRender: function (){
      this.$el.css('position', 'relative');
    }
  });

  var FriendCollectionView = L.CollectionView.FriendCollectionView.extend({
    tagName: 'div',
    className: 'ui divided items',
    childView: FriendView,
    emptyView: L.View.EmptyBasicView,
  });

  var MaybeView = Marionette.View.extend({
    tagName: 'div',
    className: 'item',
    template: Template.get('maybe_item'),
  });

  var MaybeCollectionView = Marionette.CollectionView.extend({
    tagName: 'div',
    className: 'ui middle aligned divided list',
    childView: MaybeView,
    emptyView: L.View.EmptyBasicView,
  });

  var AppMain = Marionette.Application.extend({
    // region: '#friendList',

    initialize: function (options){
      this.friends = options.friends;
      this.maybe = options.maybe;

      // this.mergeOptions(options);

      this.listenTo(this.friends, 'sync', this.friendsList);
      this.listenTo(this.maybe, 'sync', this.maybeList);

    },
    friendsList: function (){
      var v = new FriendCollectionView({collection: this.friends});
      $('#friendList').html(v.render().el);
    },
    maybeList: function (){
      var v = new MaybeCollectionView({collection: this.maybe});
      $('#maybeList').html(v.render().el);
    },
    onStart: function(){
      this.friends.fetch({reset: true, data: {friends: 1}});
      this.maybe.fetch({reset: true, data: {maybe: 1}});
    }
  });

  var friends = new FriendCollection();
  var maybe = new FriendCollection();

  app.main = new AppMain({friends: friends, maybe: maybe});
  app.main.start();

});
