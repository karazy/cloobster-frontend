
$('#moveDown').click(function() {
	$('html, body').animate({
		scrollTop: $('#slide2').offset().top // $('body').height()//$(".footer").offset().top
	}, 1000);
});

$('#moveDown2, #starBadge').click(function() {
    $('html, body').animate({
        scrollTop: $('#slide3').offset().top
    }, 1000);
});

$(document).ready(function() {
    setupScrollFading({
        fadeStart: 0,
        fadeUntil: 200,
        selector: '#moveDown'
    });

    setupScrollFading({
        fadeStart: $('body').height(),
        fadeUntil: $('body').height()+200,
        selector: '#moveDown2'
    });
});




function setupScrollFading(config) {
    if(!config) {
        return;
    }

    $(window).bind('scroll', function(){
        var offset = $(document).scrollTop(),
            opacity = 0,
            diff1, diff2;

        if( offset<=config.fadeStart ){
            opacity=1;
        }else if( offset<=config.fadeUntil ){
            diff = offset - config.fadeStart;
            diff2 = config.fadeUntil - config.fadeStart;
            // opacity=1-offset/config.fadeUntil;
            opacity=1-diff/diff2;
        }
        $(config.selector).css('opacity',opacity);
        // $(config.selector).html(opacity + ' o:' + offset +' fs:'+config.fadeStart+ ' fu:'+config.fadeUntil);
    });
}

$('#abgToggle').bind('click', function(event) {
    $('.agb').toggle();
    // $("html, body").animate({ scrollTop: $(document).height() }, 1000);
    return false;
});