
$('#moveDown, #starBadge').click(function() {
	$('html, body').animate({
		scrollTop: $('body').height()//$(".footer").offset().top
	}, 1000);
});

var fadeStart=0, // 100px scroll or less will equiv to 1 opacity
    fadeUntil=200, // 200px scroll or more will equiv to 0 opacity
    fading = $('#moveDown');


$(window).bind('scroll', function(){
    var offset = $(document).scrollTop()
        ,opacity=0
    ;
    if( offset<=fadeStart ){
        opacity=1;
    }else if( offset<=fadeUntil ){
        opacity=1-offset/fadeUntil;
    }
    fading.css('opacity',opacity);
    //.html(opacity);
});

$('#abgToggle').bind('click', function(event) {
    $('.agb').toggle();
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
    return false;
});