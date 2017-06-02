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
    collection: new FriendCollection()
  });

  var AppMain = Marionette.Application.extend({
    region: '#friendList',
    onStart: function(){
      this.showView( new FriendCollectionView() );
      this.getView().collection.fetch({reset: true,data: {friends: 1}});
    }
  });

  app.main = new AppMain()
  app.main.start();

});
