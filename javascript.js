var GRID_ITEM_WIDTH = 200; // 100px each cell in grid
var GRID_GAP = 40; // 10 px grid gap for packery
var MAX_ITEMS_SHORTENABLE = 3; // maximum number of list items visible before more is clicked


$(document).ready(function () {
    if ($('.grid').length != 0) {
        $('.grid').packery({
            itemSelector: '.grid-item',
            gutter: GRID_GAP,
            stagger: 30,
            transitionDuration: '0.2s',
        });
    }
    showHideSendMsg();
    fixMenuBars();
    setGridBodyWidth();

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
                    // if there is an expandable menu, toggle it
                    if ($(this).next().css("display") == "none") {
                        $(this).next().css("display", "block");
                    } else {
                        $(this).next().css("display", "none");
                    }
                }
            });
        }

    });

    // shorten all shortenable lists
    $(".shortenable").each(function () {
        hideMoreThan(this, MAX_ITEMS_SHORTENABLE);
    });


    if (hasTouch()) { // remove all :hover stylesheets
        try { // prevent exception on browsers not supporting DOM styleSheets properly
            for (var si in document.styleSheets) {
                var styleSheet = document.styleSheets[si];
                if (!styleSheet.rules) continue;

                for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
                    if (!styleSheet.rules[ri].selectorText) continue;

                    if (styleSheet.rules[ri].selectorText.match(':hover')) {
                        styleSheet.deleteRule(ri);
                    }
                }
            }
        } catch (ex) {}
    }

});


function hasTouch() {
    return 'ontouchstart' in document.documentElement ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0;
}


var scrollingUp = false;
var lastScrollPos = 0;
var msgBuddyTimer;

$(window).scroll(function () {
    detectScrollDirection();
    showHideSendMsg();
    fixMenuBars();
});

function detectScrollDirection() {
    // detect scrolling direction
    if ($(window).scrollTop() > lastScrollPos)
        scrollingUp = false;
    else
        scrollingUp = true;
    lastScrollPos = $(window).scrollTop();
}


function showHideSendMsg() {
    // actions based on scroll direction (hide/show)
    var bottomBuffer = 100; // scrolling in this zone will not matter (msgbuddy visible)
    var maxScrollTop = $(document).height() - $(window).height();

    if ($(window).scrollTop() < (maxScrollTop - bottomBuffer)) {
        // scrolling above the always visible zone
        if (scrollingUp) {
            // slide the msg button down
            msgBuddyHide();
        } else {
            msgBuddyShow();
            // set a timer to hide it again
            clearTimeout(msgBuddyTimer);
            msgBuddyTimer = setTimeout(() => {
                msgBuddyHide();
            }, 2000);
        }

    } else {
        // in the buffer zone
        clearTimeout(msgBuddyTimer);
        msgBuddyShow();
    }


}

function msgBuddyHide() {
    $('.msg_buddy').css('transform', 'translateY(55px)');

}

function msgBuddyShow() {
    $('.msg_buddy').css('transform', 'translateY(00px)');

}

function hideMoreThan(list, num) {
    var i = 0;
    $(list).children("li").each(function () {
        if (i >= num) {
            $(this).hide()
        }
        i++;
    });
    // add the more button
    if (i > num - 1) {
        $(list).append("<li onclick='toggleShowAll(this)'>more...</li>");
    }
}

function toggleShowAll(list) {
    console.log(list);

    console.log($(list).parent().children().eq(-1).text());
    // if something was hidden
    if ($(list).parent().children().eq(-1).text() == "hide...") {
        // hide it
        var i = 0;
        $(list).parent().children("li").each(function () {
            if (i >= MAX_ITEMS_SHORTENABLE) {
                $(this).hide();
            }
            i++;
        });
        // unhide the more button
        $(list).parent().children().eq(-1).show();
        // rename it to show
        $(list).parent().children().eq(-1).html("show...");

    } else {
        // show all
        console.log("showing");
        $(list).parent().children().each(function () {
            $(this).show();
        });
        $(list).parent().children().eq(-1).html("hide...");

    }


}

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

    if ($(window).scrollTop() < (sum)) {
        $('.top_bar').css("background-color", "rgba(255, 255, 255, 0)");
        $('.top_bar').css("top", (diff).toString() + "px")
    } else {
        $('.top_bar').css("background-color", "rgba(255, 255, 255, 0.63)");
        $('.top_bar').css("top", "0px");
    }
}

var lastScrollTop;

function toggleMenu() {
    if ($(".menu_items").css("display") == "none") {
        // if menu hidden, show
        lastScrollTop = $(window).scrollTop();
        $(".menu_items").css("display", "block");
        $(".content").hide();
        msgBuddyShow();
        clearTimeout(msgBuddyTimer);
    } else {
        $(".menu_items").css("display", "none");
        $(".content").show();
        $(window).scrollTop(lastScrollTop);
        msgBuddyHide();
    }
}

var wentBig = true;

$(window).resize(function () {
    if ($(window).width() >= 840) {
        // full site
        wentBig = true;
        $('.menu_items').css("display", "block");
        $(".content").show();
    } else {
        console.log("changes " + $(window).width());
        // mobile site

        // have to only hide when coming from a big size page
        if (wentBig) {
            wentBig = false;
            $('.menu_items').css("display", "none");
        }
    }
    setGridBodyWidth();
    fixMenuBars();
});
