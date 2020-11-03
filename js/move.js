(function () {
    'use strict';

    function init($elem) {
        this.$elem = $elem;
        this.currentX = parseFloat(this.$elem.css('left'));
        this.currentY = parseFloat(this.$elem.css('top'));
    };

    function to(x, y, callback) {
        if (typeof y === 'number') {
            y
        } else {
            y = this.currentY
        };
        if (typeof x === 'number') {
            x
        } else {
            x = this.currentX
        }
        if (this.currentX === x && this.currentY === y) return;
        this.$elem.trigger('move', [this.$elem]);
        this.currentX = x;
        this.currentY = y;
        if (typeof callback === 'function') callback();
    };
    var Defaults = {
        css:true,
        js:false,
    };

    function Silent($elem, option) {
        init.call(this, $elem)
        this.$elem.removeClass('transition')
    }


    Silent.prototype.to = function (x, y) {
        var self = this;
        to.call(this, x, y, function () {
            self.$elem.css({
                left: x,
                top: y,
            })
        })
    }

    Silent.prototype.x = function (x) {
        this.to(x)
    };
    Silent.prototype.y = function (y) {
        this.to(null, y)
    }

    // css

    function Css($elem, option) {
        init.call(this, $elem);
        this.init();

    }

    Css.prototype.init = function () {
        this.$elem.addClass('transition');
        this.$elem.css({
            left: this.currentX,
            top: this.currentY,
        })
    }

    Css.prototype.to = function (x, y) {
        var self = this;
        to.call(this, x, y, function () {
            self.$elem.css({
                left: x,
                top: y,
            });
            self.$elem.off('transitionend').one('transitionend', function (e) {
                self.$elem.trigger('moved', [self.$elem])
            });
        })
    }

    Css.prototype.x = function (x) {
        this.to(x)
    }
    Css.prototype.y = function (y) {
        this.to(null, y)
    }



    function Js($elem, option) {
        init.call(this, $elem);
        this.$elem.removeClass('transition')
    }


    Js.prototype.to = function (x, y) {
        var self = this;
        to.call(this, x, y, function () {
            self.$elem.stop().animate({
                left: x,
                top: y,
            }, function () {
                self.$elem.trigger('moved', [self.$elem])
            });
        })
    }

    Js.prototype.x = function (x) {
        this.to(x)
    }

    Js.prototype.y = function (y) {
        this.to(null, y)
    }

    function mode($elem,option) {
        var move = null;
        if (!option.css && !option.js) {
            move = new Silent($elem, option)
        };
        if (option.css) {
            move = new Css($elem, option)
        }
        if (!option.css && option.js) {
            move = new Js($elem, option)
        }
        return {
            to:$.proxy(move.to,move),
            x:$.proxy(move.x,move),
            y:$.proxy(move.y,move),
        }
    }
    $.fn.extend({
        // slide: function (option, x, y) {
        //     var $this = $(this);
        //     var move = $this.data("move");
        //     var options = $.extend({}, Defaults, typeof option === 'object' && option);
        //     if (!option.css && !option.js) {
        //         if (!move) {
        //             $this.data("move", move = new Silent($this, options))
        //         };
        //     };
        //     if(option.css){
        //         if (!move) {
        //             $this.data("move", move = new Css($this, options))
        //         };
        //     };
        //     if(!option.css && option.js){
        //         if (!move) {
        //             $this.data("move", move = new Js($this, options))
        //         };
        //     }
        //     if (typeof move[option] === 'function') {
        //         move[option](x, y)
        //     }
        // },
        slide: function (option, x, y) {
            return this.each(function () {
                var $this = $(this);
                var move = $this.data('move');
                var options=$.extend({},Defaults, typeof option === 'object' && option);
                if (!move) {
                    $this.data('move',move=mode($this,options))
                }
                if (typeof move[option] === 'function') {
                    move[option](x,y);
                }
            })  
        }
    })
})()