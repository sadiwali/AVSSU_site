

var GRID_ITEM_WIDTH = 440; // 100px each cell in grid
var GRID_GAP = 40; // 10 px grid gap for packery


$(document).ready(function () {
    
     $('.grid').packery({
        itemSelector: '.grid-item',
        gutter: GRID_GAP,
        stagger: 30,
        transitionDuration: '0.2s',
    });

    // the menu click handling
    $(".menu_items > li").each(function () {
        // expandable menus hidden initially through css (display none)
        if ($(this).next().attr('class') == "expand") {
            $(this).html($(this).text() + " +");
            // install the click handler
            $(this).click(function () {
                var menu_text = $(this).text();
                if (menu_text.substr(menu_text.length - 1) == "+") {
                    $(this).html(menu_text.substr(0, menu_text.length - 1) + "-");
                } else {
                    // add the plus
                    $(this).html(menu_text.substr(0, menu_text.length - 1) + "+");
                }
                // now toggle the expand menu
                if ($(this).next().attr('class') == "expand") {
                    console.log("yes");
                    // if there is an expandable menu, toggle it
                    console.log($(this).next().attr("display"));
                    if ($(this).next().css("display") == "none") {
                        $(this).next().css("display", "block");
                    } else {
                        $(this).next().css("display", "none");
                    }
                }
            });
        }

    });
    
    fixMenuBars();
    setGridBodyWidth();
});

$(window).scroll(function () {

    fixMenuBars();
});

// set the grid body width so it is tightest, for centering
function setGridBodyWidth() {
    var howManyCanFit = Math.floor($('.grid_wrapper').width() / (GRID_ITEM_WIDTH + GRID_GAP));
    $('.grid').css({
        'width': (howManyCanFit * (GRID_ITEM_WIDTH + GRID_GAP) - GRID_GAP).toString() + 'px'
    });
}


function fixMenuBars() {
    var buffer = 50;
    var sum = $(".logo").position().top + $(".logo").outerHeight() + buffer;
    var diff = Math.abs($(window).scrollTop() - sum);

    if ($(window).scrollTop() < (sum )) {
        $('.top_bar').css("background-color", "rgba(255, 255, 255, 0)");
        $('.top_bar').css("top", (diff).toString() + "px")
    } else {
        $('.top_bar').css("background-color", "rgba(255, 255, 255, 0.63)");
        $('.top_bar').css("top", "0px");
    }
    console.log($(window).scrollTop(), diff, sum );
}


function toggleMenu() {
    if ($(".menu_items").css("display") == "none") {
        // if menu hidde, show
        $(".menu_items").css("display", "block");
        $(".content").hide();
    } else {
        $(".menu_items").css("display", "none");
        $(".content").show();

    }

}

$(window).resize(function () {
    if ($(window).outerWidth() > 840) {
        // full site
        $('.menu_items').css("display", "block");
        $(".content").show();

    } else {
        // mobile site
        $('.menu_items').css("display", "none");
    }
    setGridBodyWidth();
    fixMenuBars();
});
