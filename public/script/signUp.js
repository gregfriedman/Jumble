define( ['jquery', 'lib/cookies.min'], function($, Cookies) {

    //var Cookies = require("cookies.min");
    
    // TODO: what's the right way to do this?
    $(function() { 
        $('.sign-up .sign-up-button').click( function() {
            var json = JSON.stringify( { email: $('input.email-address').val() });
            $.ajax({
                type: 'POST',
                contentType: "application/json",
                data: json,
                url: 'a-song-a-month/subscribe',
                dataType: 'JSON'
            }).done(function(data) {
                var List_AlreadySubscribed = 214;
                if (!data.error || data.error.errorCode == List_AlreadySubscribed){
                    Cookies.set('signup', 'complete', { expires: '01/01/2020' });
                }
            }).fail(function(data) {
                var error = data.errorMessage;
            });
        
            $('.overlay').removeClass('enabled');
        });
        
        $('.sign-up-skip').click( function(event) {
            event.preventDefault();
        
            $('.overlay').removeClass('enabled');
        
            Cookies.set('signup', 'skipped', { expires: '01/01/2020' });
        });
    });
    
    return {
        promptForEmail: function() {
            if (Cookies.get('signup')) {
                //alert('Already ' + Cookies.get('signup') + ' it');
            } else {
                $('.overlay').addClass('enabled');
            }
        }
    }

});