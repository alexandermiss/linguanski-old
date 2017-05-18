$(function (){

  var FriendModel = L.Model.Friend.extend({
    urlRoot: '/api/v1/friend'
  });

  var FriendCollection = L.Collection.Friend.extend({
    url: '/api/v1/accounts'
  });

  app.friend = new FriendCollection();

});
