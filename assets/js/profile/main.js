$(function(){
  if( __n('#profileController') ) return;

  var _progressbar_time;

  var Profile  = L.Model.Default.extend({
    urlRoot: '/api/v1/profile/getFullProfile'
  });

  var ProfileCardView = L.View.DefaultBasicView.extend({
    tagName: 'div',
    className: 'ui segment segment400',
    template: function(data){
      if( eval($('#__s').val()) )
        return Template.get('profile/card/profile_card')(data);
      return Template.get('profile/card/profile_card_nologin')(data);
    },
    ui:{
      form: '#fileinfo',
      btn: '#btn',
      file: '#file',
      image: '.dimmable.image',
      change_img: '.change-image'
    },
    events:{
      'click @ui.change_img': 'showModal'
    },
    onRender: function (){
      if( eval($('#__s').val()) ) this.ui.image.dimmer({on: 'hover'});
    },
    showModal: function (){
      $('.ui.tiny.modal').modal({
  		  transition: 'scale',
  		  closable: false,
  		  onDeny    : function(){
          $('#file').val('').empty();
  		  },
  		  onApprove : function() {
          profileUpload(profile);
          // return false;
  		  },
  		  onShow    : function(){
          $('[description], [image-content]').hide();
          $('#fileinfo').show();
  		  },
  		}).modal('show');
    }
  });

  var ProfilePresentationView = L.View.DefaultBasicView.extend({
    tagName: 'div',
    className: 'ui segment segment400',
    template: Template.get('profile/presentation'),
  });

  // var ParentView = Marionette.View.extend({
  //   tagName: 'div',
  //   className: 'thirteen wide column',
  //   template: Template.get('profile/section_profile'),
  //   regions: {
  //     profile: {el: '#segmentCard', replaceElement: true},
  //     presentation: {el: '#segmentPresentation', replaceElement: true}
  //   },
  //   initialize: function(opts){
  //     var card = new ProfileCardView(opts);
  //     var presentation = new ProfilePresentationView(opts);
  //     this.showChildView('profile', card );
  //     this.showChildView('presentation', presentation );
  //   }
  // });

  var AppView = Marionette.Application.extend({
    region: { el:'#profileController'},
    initialize: function(opts){
      this.profile = opts.profile;

      this.listenTo(this.profile, 'sync', this.printProfile);
    },
    onStart: function (){
      this.profile.fetch({data:{id: $('#__i').val()}});
    },
    printProfile: function(){
      // var view = new ParentView({model: this.profile});
      // this.showView( view );

      var card = new ProfileCardView({model: this.profile});
      var presentation = new ProfilePresentationView({model: this.profile});
      $('#segmentCard').html(card.render().el );
      $('#segmentPresentation').html(presentation.render().el );

    }
  });

  var profile = new Profile();

  app.main = new AppView({profile: profile});
  app.main.start();

  var profileUpload = function (model){
    var formElement = document.getElementById('fileinfo');

    var xhr = new XMLHttpRequest();
    var form = new FormData(formElement);

    $('[description], [image-content]').hide();

    xhr.open('PUT', '/api/v1/profile/getFullProfile/'+model.get('id'));

    $('#progressBar').show();
    $('#progressBar')
      .progress('set value', 0)
      .progress('set progress', 0)
      .progress('set percent', 0)
      .progress('set label', 'Uploading photo...')
      ;

    xhr.upload.addEventListener('progress', function (d){
      _debug('progress', d.loaded, d.total);

      if( d.total == d.loaded ){
        $('#progressBar')
          .progress('set percent', 99)
          .progress('set label', 'Updating user data...')
        ;

        _progressbar_time = window.setInterval(function(){
          $('#progressBar').progress('update progress', 99);
        }, 500);


      }else{
        $('#progressBar')
          .progress('set percent', (((d.loaded) * 100) / d.total))
          .progress('set label', 'Updating user data...')
        ;
      }
    });

    xhr.onreadystatechange = function (){
      if( xhr.readyState == 4 ){
        if( xhr.status == 200 ){
          var json = (xhr.responseText ? JSON.parse(xhr.responseText) : {});
          _debug('JSON', json);
          var obj = model.get('user');
          obj.photo = json.secure_url;
          model.set('user', obj);
          var img = document.getElementById('imageProfile')
          img.src = json.secure_url;
          if(document.getElementById('avatar'))
            document.getElementById('avatar').src = json.photo80x80;
            $('#progressBar').progress('set label','Success!');
            $('#progressBar').progress('set success');
            $('#progressBar').hide();
            window.clearInterval(_progressbar_time);
        }
      }
    };

    xhr.send( form );
  };

  $('#file').on('change', function (){
    var input_file = document.getElementById('file');
    var img = document.getElementById('preview');
    FileUpload.showPreview(img, input_file);
    $('[description], [image-content]').show();
    $('#fileinfo').hide();
    $('.ui.small.modal').modal('refresh');
  });

});
