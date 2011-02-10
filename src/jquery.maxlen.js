/*
 * Maxlen v 0.1 2011-02-10
 * http://aremesal.net/seccion-maxlen
 *
 * Copyright (c) 2011, Aremesal
 * 
 * Licensed under the MIT license.
 */

(function($){
    $.fn.maxlen = function(options){

        var settings = {
            maxChars: 10,                                       // Maximun number of characters
            showMessage: true,                                  // Show number of remain characters message
            strPreText: 'You have',                             // Text for message, previous to number of available
            strPostText: 'available characters remaining',      // Text for message, next to number of available
            classBase: 'jmaxlen',                               // Base root for CSS classes
            callbackFunc: ''                                    // Callback function to call when maximun number is reached
        }

        var methods = {
            /**
            * writeSpan: writes number of available characters into message span
            *
            * @param Object obj jQuery object containing *this* textarea or input
            * @param string str String with value tu write into span
            */
            writeSpan : function( obj, str ) { obj.next('span.'+obj.data('classBase')+'-sp').children('span').html(str); },

            /**
             * addErrorClass: adds an error class to respective span
             *
             * @param Object obj jQuery object containing *this* textarea or input
             */
            addErrorClass : function( obj ) { obj.next('span.'+obj.data('classBase')+'-sp').addClass(''+obj.data('classBase')+'-sperror'); },

            /**
             * removeErrorClass: removes the error class from the respective span
             *
             * @param Object obj jQuery object containing *this* textarea or input
             */
            removeErrorClass : function( obj ) { obj.next('span.'+obj.data('classBase')+'-sp').removeClass(''+obj.data('classBase')+'-sperror'); }
        };

        // Loops through all matching elements
        return this.each( function(){

            // Set user options, if any, ovewritting default ones
            var opts = jQuery.extend(settings, options);

            var th = $(this);

            // If element has defined 'maxlength', use this value instead
            if( th.attr('maxlength') != '-1' && th.attr('maxlength') != '')
                opts = jQuery.extend(settings, {maxChars: th.attr('maxlength')});

            if( !th.hasClass(opts.classBase+'-txt')) {      // To prevent duplicate calls to plugin for each element

                // Store values at element level, because this values can change in each different call to plugin
                th.data('maxChars', opts.maxChars);
                th.data('callbackFunc', opts.callbackFunc);
                th.data('showMessage', opts.showMessage);
                th.data('classBase', opts.classBase);

                // Count chars, if element is previously populated

                actualChars = th.data('maxChars') - th.val().length;

                // Create span for message
                if( th.data('showMessage') )
                    th.after('<span class="'+th.data('classBase')+'-sp">'+opts.strPreText+' <span>'+actualChars+'</span> '+opts.strPostText+'</span>');

                // Add base class to element
                th.addClass(th.data('classBase')+'-txt');

                // When keypressed, if maximum has been reached, call
                //   callback if any and prevent inserting new char. Permits
                //   all non-printable keys (as backspace, delete, arrows...)
                //   except enter key, so user can change inserted text
                th.keypress(function(event) {

                    var avail = th.data('maxChars') - $(this).val().length;

                    if(avail <= 0){
                        if( event.keyCode < '8' || event.keyCode > '48' || event.keyCode == '13') {
                            if( th.data('callbackFunc') != ''){ eval(th.data('callbackFunc'))(th); }
                            event.preventDefault();
                        }
                    }
                });

                // When keyup, write new number of available chars; if
                //   maximum number of chars has been reached, add error
                //   class to span message, or remove it if not reached maximum
                th.keyup(function(event) {
                    var avail = th.data('maxChars') - $(this).val().length;

                    if( avail >= 0 ) {
                        methods.writeSpan($(this),avail);
                    }

                    if(avail <= 0) {
                        methods.addErrorClass($(this));
                    }
                    else {
                        methods.removeErrorClass($(this));
                    }
                });

                // For prevent other methods for insert data no typing,
                //   such as copy&paste, when change checks if maximum
                //   has been reached and, if true, cuts pasted string,
                //   set number in span message to 0 and adds error class
                th.change(function(event){
                    var avail = th.data('maxChars') - $(this).val().length;
                    if( avail <= 0 ) {
                        th.val( th.val().substr(0, th.data('maxChars')) );
                        methods.writeSpan($(this),'0');
                        methods.addErrorClass($(this));
                    }
                });
            }
        });
    }
})(jQuery);