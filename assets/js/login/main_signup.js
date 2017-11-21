$(function(){

  if( __n('#signupForm') ) return;

  $('.ui .checkbox').checkbox();
  $('.dropdown').dropdown();

  $('form')
    .form({
      fields: {
        name: {
          identifier  : "name",
          rules: [
            {
              type   : "empty",
              prompt : "Please enter your name"
            },
            {
              type   : "length[2]",
              prompt : "Your password must be at least 8 characters"
            }
          ]
        },
        email: {
          identifier  : "email",
          rules: [
            {
              type   : "empty",
              prompt : "Please enter your email"
            },
            {
              type   : "email",
              prompt : "Please enter a valid e-mail"
            }
          ]
        },
        password: {
          identifier  : "password",
          rules: [
            {
              type   : "empty",
              prompt : "Please enter your password"
            },
            {
              type   : "length[8]",
              prompt : "Your password must be at least 8 characters"
            }
          ]
        },
        country: {
          identifier  : 'country',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter your country'
            }
          ]
        },
        language: {
          identifier  : 'language',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter your language'
            }
          ]
        },
        conditions: {
          identifier  : "conditions",
          rules: [
            {
              type   : "checked",
              prompt : "Please check the terms and conditions"
            },
          ]
        }
      },
      onSuccess: function (event, fields){
        event.preventDefault();

          $.post('/auth/register', {
              email: fields.email,
              password: fields.password,
              name: fields.name,
              country: fields.country,
              language: fields.language
              // access_token: L.Auth.getToken()
            })
            .done(function(data){
              console.log(data);
              if(data && data.access_token){
                L.Auth.saveSession(data);
                window.location.href='/feed';
              }
            }).fail(function(data){
              $('.mini.modal')
                .modal('show')
              ;
            });

      }
    });
});
