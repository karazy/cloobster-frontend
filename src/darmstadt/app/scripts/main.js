
$('#moveDown, #starBadge').click(function() {
	$('html, body').animate({
		scrollTop: $('body').height()//$(".footer").offset().top
	}, 1000);
});

$('#moveDown2').click(function() {
    $('html, body').animate({
        scrollTop: $('body').height()*2
    }, 1000);
});

$(document).ready(function() {
    setupScrollFading({
        fadeStart: 0,
        fadeUntil: 300,
        selector: '#moveDown'
    });

    setupScrollFading({
        fadeStart: $('body').height(),
        fadeUntil: $('body').height()+100,
        selector: '#moveDown2'
    });
});




function setupScrollFading(config) {
    if(!config) {
        return;
    }

    $(window).bind('scroll', function(){
        var offset = $('body').scrollTop(),
            opacity = 0;

        if( offset<=config.fadeStart ){
            opacity=1;
        }else if( offset<=config.fadeUntil ){
            opacity=1-offset/config.fadeUntil;
        }
        $(config.selector).css('opacity',opacity).html(opacity + 'o:' + offset +' fs:'+config.fadeStart+ ' fu:'+config.fadeUntil);
    });
}

$('#abgToggle').bind('click', function(event) {
    $('.agb').toggle();
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
    return false;
});