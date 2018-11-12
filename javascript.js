var GRID_ITEM_WIDTH = 200; // 100px each cell in grid
var GRID_GAP = 40; // 10 px grid gap for packery


$(document).ready(function () {
    if ($('.grid').length != 0) {
        $('.grid').packery({
            itemSelector: '.grid-item',
            gutter: GRID_GAP,
            stagger: 30,
            transitionDuration: '0.2s',
        });
    }

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
    showHideSendMsg();
    fixMenuBars();
    setGridBodyWidth();
});

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
    var bottomBuffer = 200; // scrolling in this zone will not matter (msgbuddy visible)
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
    $('.msg_buddy').css('transform', 'translateY(50px)');

}

function msgBuddyShow() {
    $('.msg_buddy').css('transform', 'translateY(00px)');

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

    } else {
        $(".menu_items").css("display", "none");
        $(".content").show();
        $(window).scrollTop(lastScrollTop);
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
