/**
 * If pausegame-folder is not localized together with
 * html page, change here.
 * 
 * @type String
 */
window.baseurl = '';

/**
 * Initalize game
 * 
 * @returns {void}
 */
var init = function() {
    
    load_map();
    load_character();
    
};

/**
 * Load/reset default map
 * 
 * @returns {void}
 */
var load_map = function() {
    
    $.get( window.baseurl + 'raw/map.txt', function(data) {
        $('.map > div').html(data.replace(/\n/g,"<br>").replace(/\s/g, '&nbsp;'));
        wrap_map();
    });
    
};

/**
 * Wrap each "danger"-character 
 * in span
 * 
 * @returns {undefined}
 */
var wrap_map = function() {
    $('.map > div').html(function (_, text) {
        return text.replace(/(-|\||\+)/g, '<span>$1</span>');
    });    
};

/**
 * Load default character
 * 
 * @returns {void}
 */
var load_character = function() {
    
    $.get( window.baseurl + 'raw/character.txt', function(data) {
        $('.character pre.frame1').html(data);
    });
    
    $.get( window.baseurl + 'raw/character2.txt', function(data) {
        $('.character pre.frame2').html(data);
    });
    
};

/**
 * Start game
 * 
 * @returns {void}
 */
var start = function() {
    
    start_map();
    start_character_animation();
    
};

/**
 * Stop game
 * 
 * @returns {void}
 */
var stop = function() {
  
    stop_map();
    stop_character_animation();
    jump_character(true);
    $('.restart-btn').show();
};

/**
 * Check if character touches
 * dangers
 * 
 * @returns {void}
 */
var check_danger = function() {
    
    var pos = get_character_position();
    
    // The character fills up more than one pixel
    // so we check more than that
    check_position(pos.left, pos.top);
    check_position(pos.left+5, pos.top+5);
    check_position(pos.left+10, pos.top+10);
    check_position(pos.left+15, pos.top+15);
    
};

/**
 * Check if "danger-span" is at position
 * 
 * @param {integer} x
 * @param {integer} y
 * @returns {undefined}
 */
var check_position = function(x,y) {
    var elem = document.elementFromPoint(x - window.pageXOffset, y - window.pageYOffset);
    
    if ( $(elem).length && $(elem).is('.map > div > span') )
        stop();
};

/**
 * Get character offset
 * 
 * @returns {Object}
 */
var get_character_position = function() {
    
    return $('.game .character').offset();
    
};

/**
 * Add point to counter
 * 
 * @returns {void}
 */
var count_point = function() {
    
    var $points = $('.points > pre:first');
    
    var points = parseInt($points.html())+2;
    
    var points_as_string = points.toString();
    var number_of_zeroes = 9 - points_as_string.length;
    
    points_as_string = Array(number_of_zeroes).join("0") + points_as_string;
    $points.html(points_as_string);
    
};

/**
 * Start animating map by continuous adding 
 * -10px margin-left to ".map > div"
 * 
 * @returns {void}
 */
var start_map = function() {
    
    var $content = $('.map > div'); 
    
    $content.animate({marginLeft: "-=7000"}, 30000, 'linear');
    
    window.start_map_timer = setInterval(function() {
        count_point();
        check_danger();
    }, 60);
    
};

/**
 * Stop animating map
 * 
 * @returns {void}
 */
var stop_map = function() {
    
    $('.map > div').stop();
    clearInterval(window.start_map_timer); 
    
};

/**
 * Start animating character
 * 
 * @returns {void}
 */
var start_character_animation = function() {
    
    window.character_animation_timer = setInterval(function() {
        
        if ($('.frame1').is(':visible')) {
            $('.frame1').hide();
            $('.frame2').show();
        } else {
            $('.frame2').hide();
            $('.frame1').show();
        }
        
    }, 250);
    
};

/**
 * Stop animating character
 * 
 * @returns {void}
 */
var stop_character_animation = function() {
    
    clearInterval(window.character_animation_timer); 
    
};

/**
 * Make character do a jump
 * 
 * @param force
 * @returns {void}
 */
var jump_character = function(force) {
    
    if (window.jumping === true && typeof force === "undefined")
        return;
    
    var $character = $('.game div.character');
    
    window.jumping = true;
    $character.animate({ bottom: "+=150"}, 400, function() {
        $character.animate({ bottom: "-=150"}, 900, function() {
            window.jumping = false;
        });
    });
    
};

var get_character_top = function() {
    
    return parseInt($('div.character').css('top'));
    
};

$(document).ready(function() {
    
    init();
   
    $('.game').click(function() { jump_character(); });
    
    $(window).keypress(function (e) {
        if (e.charCode === 32 || e.keyCode === 32) {
            e.preventDefault();
            jump_character();
        }
    });
  
    $('.start-btn').click(function() { start(); $('.start-btn').hide(); });
    
});

