(function () {

    var DOM = $('body'),
    siteLang = DOM.attr('data-language'),
    locales = {
        'es': 'es_ES',
        'ca': 'es_CA',
        'en': 'en_GB'
    },
    md = new MobileDetect(window.navigator.userAgent),
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

        }

    };

    window.gulpTemplate = f.init;

})();

