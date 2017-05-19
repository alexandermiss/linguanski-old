$(function (){

  if(!Backbone.$('#friendListController').length) return;

  var FriendModel = L.Model.Friend.extend({
    urlRoot: '/api/v1/friend'
  });

  var FriendCollection = L.Collection.Friend.extend({
    url: '/api/v1/accounts',
    parse: function (resp){
      return resp.results;
    }
  });

  var FriendView = L.View.FriendView.extend({
    tagName: 'div',
    className: 'card',
    template: Template.get('friend_item')
  });

  var FriendCollectionView = L.CollectionView.FriendCollectionView.extend({
    tagName: 'div',
    className: 'ui three stackable cards',
    childView: FriendView,
    emptyView: L.View.EmptyBasicView,
    collection: new FriendCollection()
  });

  var AppMain = Marionette.Application.extend({
    region: '#friendList',
    onStart: function(){
      this.showView( new FriendCollectionView() );
      this.getView().collection.fetch({reset: true});
    }
  });

  app.main = new AppMain()
  app.main.start();

});
