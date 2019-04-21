/*-----------------------------------------------------
jQuery & WP REST API Slider: NG Slider
Author: Will Leffert (https://classicwfl.com)
License: MIT
Just a simple js script for a slider; I hate most WP
post slider plugins, so I opted to create my own. Easy
drop-in and go with minimal work.
HTML Info: You'll need the following..
A container with the ID ng-slider-container
2 buttons: one with the ID ng-left, the other ng-right
(these control the manual controls for the slider)
CSS Info:
You'll need a class for ng-slider-slide, which covers
the main style for each slide. You'll want to set
opacity to 0 and display:none on this.
You'll also need ng-slider-slide-active for the active
slide; this should only have opacity:1 and
display:block. z-index can be used for troubleshooting,
too.
Finally, I use an overlay div, too, with the class
ng-slider-slide-overlay.
-----------------------------------------------------*/


var ngCurrentSlides = [];

function ngSlide(slide, nextSlide) {
    $(slide).fadeOut(200).removeClass('ng-slider-slide-active');
    $(nextSlide).fadeIn(200).addClass('ng-slider-slide-active');
}

//Customize the variables passed to match your slider; Keep slideNum, as this is used to flag the first slide in generation to get the active class.
function generateSlide(slideNum,category,title,image,brief,link) {
    var slideClasses = "ng-slider-slide";

    if (slideNum === 0) {
        slideClasses = "ng-slider-slide ng-slider-slide-active";
    };

    //Customize this to match what you want the slides to contain; currently contains the markup for the NerfedGamer.news slider
    $( "#ng-slider-container" ).append(
        '<div id="ng-' + (slideNum+1) 
        + '" class="' + slideClasses
        + '" style="background-image:url(' + image 
        + ');"><a href="' + link
        + '" class="ng-slider-slide-overlay"><h5>' + category
        + '</h5><h3>' + title
        + '</h3><p>' + brief
        + ' <span>Read more.</span></p></a></div>'
    );

    if (slideNum === 0) {
        $("#ng-1").addClass("ng-slider-slide-active");
    };
}

function pullSlidesAndGenerate() {

    //Set this to your WP-REST API feed
    var ng_recent_posts = "https://hereisyourwebsite.com/wp-json/wp/v2/posts?per_page=4&_embed";
    $.getJSON( ng_recent_posts, function (data) {
        $.each( data, function( i, item ) {
            var imageUrl = "";

            if (item.featured_media === 0)
            {
                //Change this to an image you want to use as a backup in case you don't have a featured image set
                imageUrl = 'https://hereisyourimage.url/image.jpg';
            } else {
                imageUrl = item._embedded['wp:featuredmedia']['0'].source_url;
            };

            //Remember the function you customized earlier to note which fields you wanted on your slides? Leave i alone, but change the rest to whatever you like. Keep imageUrl too, obviously.
            generateSlide(i, item._embedded['wp:term']['0']['0'].name, item.title.rendered, imageUrl, item.acf.snippet, item.link);

            ngCurrentSlides.push("#ng-" + (i+1));
        });
    });

}

$(document).ready(function() {
    var ngActiveSlide = "#ng-1";
    
    pullSlidesAndGenerate();

    $('#ng-right').click(function()
    {
        clearInterval(ngAutoSlide);
        ngSlideRight();
    });
    
    $('#ng-left').click(function()
    {
        clearInterval(ngAutoSlide);
        ngSlideLeft();
    });

    function ngSlideLeft() {
        var nextSlide = ngCurrentSlides.indexOf(ngActiveSlide);
    
        if (nextSlide <= 0) {
            nextSlide = ngCurrentSlides.length;
        }
        nextSlide = '#ng-' + (nextSlide);
        ngSlide(ngActiveSlide,nextSlide);
        ngActiveSlide = nextSlide;
    }

    function ngSlideRight() {
        var nextSlide = ngCurrentSlides.indexOf(ngActiveSlide) + 2;
    
        if (nextSlide > ngCurrentSlides.length) {
            nextSlide = 1;
        }
        nextSlide = '#ng-' + (nextSlide);
        ngSlide(ngActiveSlide,nextSlide);
        ngActiveSlide = nextSlide;
    }

    //Change 7000 to whatever you want the auto-slide interval to be, or comment out the line to not have it automatically slide. You can also hide the clearInterval() lines on the click events further up if you do that.
    var ngAutoSlide = setInterval(ngSlideRight, 7000);
});
