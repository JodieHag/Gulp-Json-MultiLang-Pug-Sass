(function () {

    var DOM = $('body'),
    siteLang = DOM.attr('data-language'),
    locales = {
        'es': 'es_ES',
        'ca': 'es_CA',
        'en': 'en_GB'
    },
    md = new MobileDetect(window.navigator.userAgent),
    // apiPath = 'http://localhost:8081/',
    apiPath = '/api/',
    f = {

        init: function() {

            f.shareEvents();
            f.introEvents();
            f.formEvents();
            f.footerEvents();

            f.onResizeEvents();
            $(window).on('resize', f.onResizeEvents);

            DOM.find('#header select option[data-lang="' + siteLang + '"]').prop('selected', true);

            DOM.find('#header select').on('change', function(){
                document.location.href = $(this).val();
            });

            DOM.find('#header select').css({display: 'block'});

        },

        shareEvents: function() {

            // barcelona fans

            // whatsapp home


            // whatsapp thanks


            // twitter shares
            if (typeof $('#twitter-share').attr('data-share-url') == 'undefined') {
                // tracking home
                $('#twitter-share').on('click', function(){



                });

                $('#twitter-share').attr('href', 'https://twitter.com/intent/tweet?url=' + $('#twitter-share').attr('data-share-shortened-url') + '&text=' + encodeURIComponent($('#twitter-share').attr('data-share-text')));

            } else {

                // tracking thanks
                $('#twitter-share').on('click', function(){



                });
                $('#twitter-share').attr('href', 'https://twitter.com/intent/tweet?url=' + encodeURIComponent($('#twitter-share').attr('data-share-url')) + '&text=' + encodeURIComponent($('#twitter-share').attr('data-share-text')));
            }

            var left = ($(window).width() / 2) - 400 / 2;
            var top = ($(window).height() / 2) - 200 / 2;

            // facebook shares
            $('#fb-share').on('click', function(){

                var elem = $(this);

                if (typeof elem.attr('data-share-url') == 'undefined') {

                    // tracking home


                    window.open('https://www.facebook.com/sharer/sharer.php?u=' + elem.attr('data-share-shortened-url'), 'FB Share', 'width=400, height=200, top=' + top + ', left=' + left);
                } else {

                    // tracking thanks


                    window.open('https://www.facebook.com/sharer/sharer.php?u=' + elem.attr('data-share-url'), 'FB Share', 'width=400, height=200, top=' + top + ', left=' + left);
                }

                return false;
            });

        },

        introEvents: function() {

            var currentImage = 2, imagesLoaded = 0, subtitle = DOM.find('.subtitle-homepage:first');

            if (subtitle.length > 0) {
                for (var i = 1; i < 11; i++) {
                    $('<img src="media/assets/' + siteLang + '-sub' + i + '.png" style="display: none;">').appendTo(DOM).on('load', imageLoaded);
                }
            }

            function imageLoaded() {
                imagesLoaded++;
                if (imagesLoaded == 10) {
                    setInterval(function(){
                        subtitle.find('img').attr('src', 'media/assets/' + siteLang + '-sub' + currentImage + '.png');
                        currentImage++;
                        if (currentImage > 9) currentImage = 1;
                    }, 500);
                }
            }

            DOM.find('#content .button a').on('click', function(){

                // tracking
                // try {
                //     dataLayer.push({
                //         'eventCategory': 'boto-' + siteLang,
                //         'event': 'doubleyouEvent',
                //         'eventAction': 'sorteig-viatge-vip-copa-del-rei-2016',
                //         'eventLabel': 'participar-1'
                //     });
                //     // console.log(dataLayer);
                // } catch(e) {

                // }

                f.displayForm($(this));

                return false;
            });

        },

        formEvents: function() {

            f.resetForm();

            //display form


                // tracking
                // try {
                //     dataLayer.push({ // event
                //         'eventCategory': 'boto-' + siteLang,
                //         'event': 'doubleyouEvent',
                //         'eventAction': 'sorteig-viatge-vip-copa-del-rei-2016',
                //         'eventLabel': 'participar-1'
                //     });
                //     // console.log(dataLayer);
                // } catch (e) {
                // }

                f.displayForm($(this));



            //country select events
            DOM.find('#country').on('change', f.onCountryChange);

            //province select events
            DOM.find('#province').on('change', f.onProvinceChange);

            //text fields placeholders
            DOM.find('input[data-placeholder]').on('focus', function(){
                var elem = $(this);
                if (elem.val() == elem.attr('data-placeholder')) {
                    elem.val('');
                }

                // clear input errors on focus
                f.hideFormError(elem);

            }).on('blur', function(){
                var elem = $(this);
                if (elem.val() === '') {
                    elem.val(elem.attr('data-placeholder'));
                }
            });

            DOM.find('input[type="checkbox"]').on('change', function(){
                f.hideFormError($(this));
            });

            //datepicker
            $.datepicker.setDefaults($.datepicker.regional[DOM.attr('data-language')]);
            DOM.find("#birthdate" ).datepicker({
                changeMonth: true,
                changeYear: true,
                yearRange: '1920:2016',
                maxDate: new Date(),
                beforeShow: function() {
                    setTimeout(function(){
                        //$('#ui-datepicker-div').css({width: $('input[type="text"]:first').width()});
                    },0);
                },
                onSelect: f.onBirthdateChange
            });

            DOM.find('#content .form form').on('submit', function(){

                // tracking


                var form = $(this), tmpForm = $('<form>');

                if ($(this).data('submitting')) return false;

                DOM.find('.select2-container--default:first, input').css({borderColor: '#4f0515'});

                form.data('submitting', true);

                DOM.find('#content .form form').find('input, select').each(function(){

                    var elem = $(this);

                    // clear current errors
                    try {
                        elem.tooltipster('hide');
                        elem.tooltipster('destroy');
                    } catch (e) {

                    }

                    // clone to tmp form
                    elem.clone().val(elem.val()).appendTo(tmpForm);

                });

                tmpForm.find('[data-placeholder]').each(function(){
                    var elem = $(this);
                    if (elem.val() == elem.attr('data-placeholder')) elem.val('');
                });

                // prepare birthdate format
                tmpForm.find('#birthdate').val(f.prepareBirthDate(tmpForm.find('#birthdate').val(), DOM.attr('data-language')));

                // append language
                $('<input type="hidden" name="lang">').val(DOM.attr('data-language')).appendTo(tmpForm);

                $.ajax({
                    url: apiPath + 'register',
                    data: tmpForm.serialize(),
                    type: 'post',
                    dataType: 'json',
                    success: function(data){

                        if (typeof data.returnCode != 'undefined' && data.payload != 'undefined') {

                            if (data.returnCode < 0 && typeof data.error != 'undefined') {
                                DOM.find('.form-errors').text(data.error).css({display: 'block'});

                                $.when($('body, html').animate({scrollTop: form.offset().top}, 450, 'easeInOutSine')).done(function(){
                                });
                            }

                            switch(parseInt(data.returnCode)) {
                                case -2: // validation

                                    for (var key in data.payload) {

                                        var field = DOM.find('#content .form form *[name="' + key + '"]');

                                        if (field.length > 0) {
                                            f.showFormError(field, data.payload[key], key);
                                        }

                                    }

                                break;

                                case 1: // form sent OK

                                    form.find('input[type="submit"]').velocity({opacity: 0});

                                    // tracking
                                    try {
                                        dataLayer.push({ // event
                                            'eventCategory': 'boto-' + siteLang,
                                            'event': 'doubleyouEvent',
                                            'eventAction': 'sorteig-viatge-vip-copa-del-rei-2016',
                                            'eventLabel': 'registre-ok'
                                        });
                                        // console.log(dataLayer);
                                    } catch (e) {
                                    }

                                    setTimeout(function(){ // delay page change a bit to allow tag manager tracking to process
                                        $('<form method="post" action="' + data.payload + '">').appendTo(DOM).trigger('submit');
                                    }, 500);

                                break;

                            }

                        } else {

                            f.formGenericError();

                        }

                        form.removeData('submitting');

                    },
                    error: function(){

                        f.formGenericError();

                    }
                });

                return false;

            });

        },

        formGenericError: function() {

            var form = DOM.find('#content .form form');

            form.removeData('submitting');

            DOM.find('.form-errors').text(form.attr('data-error-message')).css({display: 'block'});
            $.when($('body, html').animate({scrollTop: form.offset().top}, 450, 'easeInOutSine')).done(function(){
            });

        },

        footerEvents: function() {

            //footer hovers
            DOM.find('[data-hover-image]').bind('mouseover', function(event) {
                var $this = $(this);

                if (!$this.data('original-image')) {
                    $this.data('original-image', $this.attr('src'));
                }

                $this.attr('src', $this.attr('data-hover-image'));
            }).bind('mouseout', function(event) {
                var $this = $(this),
                original = $this.data('original-image');

                if (original) {
                    $this.attr('src', original);
                }
            });

        },

        onResizeEvents: function() {

            // intro animation
            var subtitle = DOM.find('.subtitle:first');
            subtitle.css({height: subtitle.find('img').width() * 100 / 900});

            // country / province fields
            if (DOM.find('#province').data('started')) {
                // DOM.find('.select2-container').css({width: '48.5%'});
                // DOM.find('.select2-container:last').css({right: '0'});
            } else {
                DOM.find('.select2-container').css({width: DOM.find('#content .form form').find('div').eq(1).width()});
            }

        },

        prepareBirthDate: function(birthdate, lang) {

            var birthdateFormatted = [], birthdateSplitted = birthdate.split('/');

            if (lang == 'es' || lang == 'ca') {

                birthdateFormatted.push(birthdateSplitted[2]);
                birthdateFormatted.push(birthdateSplitted[1]);
                birthdateFormatted.push(birthdateSplitted[0]);

            } else {

                birthdateFormatted.push(birthdateSplitted[2]);
                birthdateFormatted.push(birthdateSplitted[0]);
                birthdateFormatted.push(birthdateSplitted[1]);

            }

            return birthdateFormatted.join('-');

        },

        onBirthdateChange: function() {

            f.hideFormError($(this));

            var birthdate = $(this).val(), birthdateFormatted = [], adultFieldsContainer = DOM.find('.not-adult');

            // /{api}/isAdult/{fecha} -> la {fecha} siempre en formato yyyy-MM-dd

            if (birthdate.split('/').length == 3) {

                $.ajax({
                    url: apiPath + 'isAdult/' + f.prepareBirthDate(birthdate),
                    type: 'post',
                    dataType: 'json',
                    success: function(data){

                        if (typeof data.returnCode != 'undefined' && data.payload != 'undefined') {

                            switch(parseInt(data.returnCode)) {

                                case 1:

                                    if (!data.payload) { // minor

                                        adultFieldsContainer.css({display: 'block', opacity: 0}).velocity({opacity: 1});

                                    } else {

                                        if (adultFieldsContainer.is(':visible')) {
                                            adultFieldsContainer.velocity({opacity: 0}, {complete: function(){

                                                //reset fields
                                                adultFieldsContainer.find('input[type="text"]').each(function(){
                                                    $(this).val($(this).attr('data-placeholder'));
                                                });

                                                adultFieldsContainer.css({display: 'none'});

                                            }});
                                        }
                                    }

                                break;

                                default: // show generic error

                                    f.formGenericError();

                                break;

                            }

                        } else { // show generic error

                            f.formGenericError();

                        }

                    },
                    error: function(){ // show generic error

                        f.formGenericError();

                    }
                });

            } else {

                f.showFormError($(this), $(this).attr('data-error-format'), 'birthdate');

            }

        },

        onProvinceChange: function() {
            var province = DOM.find('#province');
            if (province.val() !== '') f.hideFormError(province);
        },

        onCountryChange: function() {
            var province = DOM.find('#province');
            var country = $(this);

            if (country.val() !== '') f.hideFormError(country);

            // if (country.val() == 'AFG') {
            if (country.val() == 'ESP') {
                if (!province.data('started')) {
                    province.data('started', true);
                    DOM.find('.form .select2-container:first').css({float: 'left'}).velocity({width: '48.5%'},{
                        complete: function() {
                            province.select2();
                            DOM.find('.form div .select2-container:last').css({opacity: 0, position: 'absolute', right: 0, width: '47.5%'}).velocity({opacity: 1});
                            province.css({opacity: 0, display: 'block'}).velocity({opacity: 1});
                        }
                    });
                }
            } else {
                if (province.data('started')) { // remove
                    DOM.find('.form div .select2-container:last').velocity({opacity: 0}, {complete: function(){
                        province[0].selectedIndex = 0;
                        province.css({display: 'none'});
                        province.select2('destroy');
                        province.removeData('started');
                        DOM.find('.form .select2-container:first').css({float: 'left'}).velocity({width: '100%'});
                    }});
                }
            }
        },

        resetForm: function() {

            var form = DOM.find('#content .form form');

            form.find('input[type="text"]').each(function(){
                $(this).val($(this).attr('data-placeholder'));
            });

            form.find('select').each(function(){
                $(this)[0].selectedIndex = 0;
            });

        },

        hideFormError: function(elem) {
            try {
                elem.tooltipster('hide');
            } catch (e) {

            }
        },

        showFormError: function(elem, message, name) {

            if (!md.phone() && !md.tablet()) {

                var position = 'left', offsetY = 0;

                if (name == 'country') {
                    offsetY = (DOM.find('#content .form form input:first').height() / 2) * -1.4;
                }

                if (name == 'province') {
                    offsetY = (DOM.find('#content .form form input:first').height() / 2) * 1.4;
                    position = 'bottom';
                }

                f.hideFormError(elem);

                setTimeout(function(){

                    elem.tooltipster({
                        content: message,
                        position: position,
                        offsetY: offsetY,
                        trigger: 'custom',
                        positionTracker: false,
                        multiple: true,
                        theme: 'tooltipster-default tooltipster-error',
                        maxWidth: 320,
                        functionReady: function() {


                        }
                    });

                    try {
                        elem.tooltipster('show');
                    } catch(e) {

                    }

                }, 100);

            } else {

                elem.css({borderColor: 'red'});

                if (name == 'country') {
                    DOM.find('.select2-container--default:first').css({borderColor: 'red'});
                }

                if (name == 'province') {
                    DOM.find('.select2-container--default:last').css({borderColor: 'red'});
                }

            }

        },

        displayForm: function(elem) {

            // tracking


            var formContainer = DOM.find('.form-container');
            var infograma = DOM.find('.infograma');

            formContainer.css({opacity: 0, display: 'block'});

            if (elem.parent().hasClass('button')) { // top button

                DOM.find('#content').find('.title:first, .subtitle:first, .text:first, .button:first, .flecha:first, .icon:first, .participabutton').velocity({opacity: 0});
                formContainer.css({bottom: 'auto', top: '6%'});

            } else { // bottom button
                infograma.velocity({opacity: 0});

            }


            DOM.find('#country').select2();

            formContainer.velocity({opacity: 1});

        },

    };

    window.FCB_CLASICO_2016 = f.init;

})();

