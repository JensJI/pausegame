class Game {
    /**
     * Initalize game
     * If pausegame-folder is not localized together with html page, change here.
     * @param {string} baseurl
     * 
     * @returns {void}
     */
    constructor(baseurl = "") {
        this.baseurl = baseurl;
        this.jumping = false;
        this.start_map_timer = 0;
        this.character_animation_timer = 0;

        this.load_map();
        this.load_character();
    }

    /**
     * Load/reset default map
     * 
     * @returns {void}
     */
    load_map() {
        $.get(`${this.baseurl}raw/map.txt`, data => {
            $(".map > div").html(
                data.replace(/\n/g, "<br>").replace(/\s/g, "&nbsp;")
            );
            this.wrap_map();
        });
    }

    /**
     * Load default character
     * 
     * @returns {void}
     */
    load_character() {
        $.get(`${this.baseurl}raw/character.txt`, data => {
            $(".character pre.frame1").html(data);
        });

        $.get(`${this.baseurl}raw/character2.txt`, data => {
            $(".character pre.frame2").html(data);
        });
    }

    /**
     * Wrap each "danger"-character 
     * in span
     * 
     * @returns {undefined}
     */
    wrap_map() {
        $(".map > div").html((_, text) =>
            text.replace(/(-|\||\+)/g, "<span>$1</span>")
        );
    }

    start() {
        this.start_map();
        this.start_character_animation();
    }

    /**
     * Stop game
     * 
     * @returns {void}
     */
    stop() {
        this.stop_map();
        this.stop_character_animation();
        this.jump_character(true);
        $(".restart-btn").show();
    }

    /**
     * Check if character touches
     * dangers
     * 
     * @returns {void}
     */

    check_danger() {
        const pos = this.get_character_position();

        // The character fills up more than one pixel
        // so we check more than that
        this.check_position(pos.left, pos.top);
        this.check_position(pos.left + 5, pos.top + 5);
        this.check_position(pos.left + 10, pos.top + 10);
        this.check_position(pos.left + 15, pos.top + 15);
    }

    /**
     * Check if "danger-span" is at position
     * 
     * @param {integer} x
     * @param {integer} y
     * @returns {undefined}
     */
    check_position(x, y) {
        const elem = document.elementFromPoint(
            x - window.pageXOffset,
            y - window.pageYOffset
        );

        if ($(elem).length && $(elem).is(".map > div > span")) {
            this.stop();
        }
    }

    /**
     * Start animating map by continuous adding 
     * -10px margin-left to ".map > div"
     * 
     * @returns {void}
     */
    start_map() {
        const $content = $(".map > div");

        $.fx.interval = 60;
        $content.animate({
            marginLeft: "-=7000"
        }, 30000, "linear");

        this.start_map_timer = setInterval(() => {
            this.count_point();
            this.check_danger();
        }, 60);
    }

    /**
     * Add point to counter
     * 
     * @returns {void}
     */
    count_point() {
        const $points = $(".points > pre:first");

        const points = parseInt($points.html()) + 2;

        let points_as_string = points.toString();
        const number_of_zeroes = 9 - points_as_string.length;

        points_as_string = Array(number_of_zeroes).join("0") + points_as_string;
        $points.html(points_as_string);
    }

    /**
     * Stop animating map
     * 
     * @returns {void}
     */
    stop_map() {
        $(".map > div").stop();
        clearInterval(this.start_map_timer);
    }

    /**
     * Start animating character
     * 
     * @returns {void}
     */
    start_character_animation() {
        this.character_animation_timer = setInterval(() => {
            if ($(".frame1").is(":visible")) {
                $(".frame1").hide();
                $(".frame2").show();
            } else {
                $(".frame2").hide();
                $(".frame1").show();
            }
        }, 250);
    }

    /**
     * Stop animating character
     * 
     * @returns {void}
     */
    stop_character_animation() {
        clearInterval(this.character_animation_timer);
    }

    /**
     * Make character do a jump
     * 
     * @param force
     * @returns {void}
     */
    jump_character(force = false) {
        if (this.jumping && !force ) {
            return;
        }

        const $character = $(".game div.character");

        this.jumping = true;
        $character.animate({
            bottom: "+=150"
        }, 400, () => {
            $character.animate({
                bottom: "-=150"
            }, 900, () => {
                this.jumping = false;
            });
        });
    }

    get_character_position() {
        return $(".game .character").offset();
    }
}
/**
 * Get character offset
 * 
 * @returns {Object}
 */

$(document).ready(() => {
    const game = new Game();

    $(".game").click(() => {
        game.jump_character();
    });

    $(window).keypress(e => {
        if (e.charCode === 32 || e.keyCode === 32) {
            e.preventDefault();
            game.jump_character();
        }
    });

    $(".start-btn").click(() => {
        game.start();
        $(".start-btn").hide();
    });
});
