$(function(){

  if( __n('#typing') ) return;

  var Letter = Backbone.Model.extend({});
  var Letters = Backbone.Collection.extend({model: Letter});

  var Phrase = Backbone.Model.extend({
    urlRoot: '/api/v1/getOnePhrase'
  });

  var InputView = Marionette.View.extend({
    tagName: 'div',
    className: 'ui basic label letter',
    template: Template.get('form_typing'),

    initialize: function (){
      this.listenTo(this.model, 'focusItem', this.focusItem);
      this.listenTo(this.model, 'beginTyping', this.beginTyping);
    },
    ui: {
      input: 'input'
    },
    events:{
      'keyup @ui.input': 'onKey'
    },
    onKey: _.debounce(function (e){
      if( this.ui.input.val().length > 1) {
        e.preventDefault();
        console.log('Escritura no permitida');
        this.ui.input.val('');
        return;
      }

      this.triggerMethod('typing:item', this);
    }, 100, {leading: false}),
    readyTyping: function(){
      this.ui.input.get(0).removeAttribute('disabled');
      this.ui.input.removeClass('disabled');
      this.ui.input.focus();
    },
    focusItem: function (){
      this.readyTyping();
    },
    onRender: function (){
      this.ui.input.attr('disabled', 'disabled').addClass('disabled');
    },
    beginTyping: function (){
      this.readyTyping();
    }
  });

  var ListView = Marionette.CollectionView.extend({
    childView: InputView,

    onChildviewTypingItem: function ( chilView ){
      var letter_typed  = chilView.ui.input.val().toLowerCase();
      var letter_orig   = chilView.model.get('letter').toLowerCase();
      var phrase        = this.collection.phrase;
      var cursor        = this.collection.cursor;

      if(cursor == this.collection.size() -1){
        _debug('Listo');
        app.start();
      }else if ( letter_orig == letter_typed && cursor < this.collection.size() ){
        _debug('cursor', cursor);
        if ( cursor > this.collection.size() - 1
          || this.collection.cursor > this.collection.size() - 1 ){
          cursor = this.collection.size() - 1;
          this.collection.cursor = (cursor+1);
        }
        else {
          this.collection.phrase += letter_typed;
          if ( ( cursor + 1 ) != this.collection.size() ){

            var m = this.collection.findWhere({i: (cursor+1)});
            m.trigger('focusItem');
          }
        }
        chilView.$el.find('input').attr('disabled', 'disabled');
        chilView.$el.removeClass('red').addClass('green');
        this.collection.cursor++;
        cursor++;

      }else{
        chilView.$el.addClass('red').transition({
          animation:'jiggle',
          onComplete: function(){
            chilView.$el.removeClass('red');
          }
        });
        chilView.ui.input.val('');
      }
    },
    onAttach: function (){
      this.collection.first().trigger('beginTyping');
    }
  });

  var App = Marionette.Application.extend({
    region: '#typing',

    onStart: function (){
      var self = this;
      var col = new Letters()
      ,   phr = new Phrase({collection: col});

      phr.fetch({data: {access_token: L.Auth.getToken()}});

      phr.on('sync', function (){
        var phrase =phr.get('phrase_language');
        $('h2').text(phr.get('phrase_native'));
        $('h3').text(phrase);

        _.each(phrase.split(''), function (l, i){
          col.add( new Letter({letter: l, i: i}) );
        });

        col.cursor = 0;
        col.phrase = '';
        self.showView( new ListView({ collection: col }) );
      });


    }
  });

  app = new App();
  app.start();

  $('#add-phrase').on('click', function(){
    app.start();
  });

});
