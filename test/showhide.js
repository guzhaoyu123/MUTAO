(function showhide() {
    "use strict";
    // 公共初始化/显示/隐藏
    // 防止反复触发(第一次)
    var init = function ($elem, callback) {
        if ($elem.is(':hidden')) {
            $elem.data("status", "hidden");
            if (typeof (callback) === "function") callback();
        } else {
            $elem.data("status", "shown")
        }
    };
    // 防止反复触发show
    function show($elem, callback) {
        if ($elem.data('status') === "show") return;
        if ($elem.data('status') === "shown") return;
        $elem.data("status", "show").trigger("show");
        callback();
    };
    // 防止反复触发hide
    function hide($elem, callback) {
        if ($elem.data('status') === "hide") return;
        if ($elem.data('status') === "hidden") return;
        $elem.data("status", "hide").trigger("hide");
        callback();
    };
    // 无动画模式
    var silent = {
        init: init,
        show: function ($elem) {
            show($elem, function () {
                $elem.show();
                $elem.data("status", "shown").trigger("shown")
            })
        },
        hide: function ($elem) {
            hide($elem, function () {
                $elem.hide();
                $elem.data("status", "hidden").trigger("hidden")
            })
        }
    };
    // css模式
    var css = {
        // css渐隐公共初始化init
        init: function ($elem, className) {
            $elem.addClass("transition");
            init($elem, function () {
                $elem.addClass(className)
            })
        },

        // css.show模板化
        show: function ($elem, className) {
            show($elem, function () {
                $elem.off("transitionend").one("transitionend", function () {
                    $elem.data('status', 'shown').trigger('shown');
                })
                $elem.show();
                setTimeout(function () {
                    $elem.removeClass(className)
                }, 20)
            });
        },

        // css.hide模板化
        hide: function ($elem, className) {
            hide($elem, function () {
                $elem.off("transitionend").one("transitionend", function () {
                    $elem.data("status", "hidden").trigger("hidden")
                });
                $elem.one("transitionend", function () {
                    $elem.hide()
                });
                setTimeout(function () {
                    $elem.addClass(className)
                }, 20)
            })
        },
        // css.fade渐隐效果
        fade: {
            // css.fade.init
            init: function ($elem) {
                css.init($elem, 'fadeout')
            },
            // css.fade.show
            show: function ($elem) {
                css.show($elem, "fadeout")
            },
            // css.fade.hide
            hide: function ($elem) {
                css.hide($elem, "fadeout")
            }
        },
        // css.slideUpDown上下滑动效果
        slideUpDown: {
            // css.slideUpDown.init
            init: function ($elem) {
                css.init($elem, "slideUpDown")
            },
            // css.slideUpDown.show
            show: function ($elem) {
                css.show($elem, "slideUpDown")
            },
            // css.slideUpDown.hide
            hide: function ($elem) {
                css.hide($elem, "slideUpDown")
            }
        },
        // 左右滑动
        slideLeftRight: {
            init: function ($elem) {
                css.init($elem, "slideLeftRight")
            },
            // css.slideUpDown.show
            show: function ($elem) {
                css.show($elem, "slideLeftRight")
            },
            // css.slideUpDown.hide
            hide: function ($elem) {
                css.hide($elem, "slideLeftRight")
            }
        },
        // fade上下滑动渐隐
        fadeSlideUpDown: {
            init: function ($elem) {
                css.init($elem, "fadeout slideUpDown")
            },
            // css.slideUpDown.show
            show: function ($elem) {
                css.show($elem, "fadeout slideUpDown")
            },
            // css.slideUpDown.hide
            hide: function ($elem) {
                css.hide($elem, "fadeout slideUpDown")
            }
        },
        // fade左右滑动渐隐
        fadeSlideLeftRight: {
            init: function ($elem) {
                css.init($elem, "fadeout slideLeftRight")
            },
            // css.slideUpDown.show
            show: function ($elem) {
                css.show($elem, "fadeout slideLeftRight")
            },
            // css.slideUpDown.hide
            hide: function ($elem) {
                css.hide($elem, "fadeout slideLeftRight")
            }
        }
    };
    // js模式
    var js = {
        // jq封装(fade/slideUpDown)
        init: function ($elem, callback) {
            $elem.removeClass("transition");
            init($elem, callback);
        },
        // jq封装show
        show: function ($elem, mode) {
            show($elem, function () {
                $elem.stop()[mode](function () {
                    $elem.data("status", "shown").trigger("shown")
                })
            })
        },
        // jq封装hide
        hide: function ($elem, mode) {
            hide($elem, function () {
                $elem.stop()[mode](function () {
                    $elem.data("status", "hidden").trigger("hidden")
                })
            })
        },
        // jq自定义封装init(fadeSlideLeftRight)
        customInit: function ($elem, options) {
            var size = {};
            for (var p in options) {
                size[p] = $elem.css(p)
            }
            $elem.data("size", size);
            $elem.removeClass("transition");
            js.init($elem, function () {
                $elem.css(options)
            })
        },
        // jq自定义封装show
        customShow: function ($elem) {
            show($elem, function () {
                $elem.show();
                $elem.stop().animate($elem.data("size"), function () {
                    $elem.trigger("shown")
                })
            })
        },
        // jq自定义封装hide
        customHide: function ($elem) {
            hide($elem, function () {
                var hiddenStyles = {};
                for (var p in $elem.data("size")) {
                    hiddenStyles[p] = "0"
                };
                $elem.stop().animate(hiddenStyles, function () {
                    $elem.hide().trigger("hidden")
                })
            })
        },
        fade: {
            init: function ($elem) {
                js.init($elem)
            },
            show: function ($elem) {
                js.show($elem, "fadeIn");
            },
            hide: function ($elem) {
                js.hide($elem, "fadeOut");
            }
        },
        slideUpDown: {
            init: function ($elem) {
                js.init($elem)
            },
            show: function ($elem) {
                js.show($elem, "slideDown");
            },
            hide: function ($elem) {
                js.hide($elem, "slideUp");
            }
        },
        slideLeftRight: {
            init: function ($elem) {
                js.customInit($elem, {
                    "width": "0px",
                    "padding-left": "0px",
                    "padding-right": "0px",
                })
            },
            show: function ($elem, callback) {
                js.customShow($elem)
            },
            hide: function ($elem, callback) {
                js.customHide($elem)
            }
        },
        fadeSlideUpDown: {
            init: function ($elem) {
                js.customInit($elem, {
                    "height": "0px",
                    "padding-top": "0px",
                    "padding-bottom": "0px",
                    "opacity": "0"
                })
            },
            show: function ($elem) {
                js.customShow($elem)
            },
            hide: function ($elem) {
                js.customHide($elem)
            }
        },
        fadeSlideLeftRight: {
            init: function ($elem) {
                js.customInit($elem, {
                    "width": "0px",
                    "padding-left": "0px",
                    "padding-right": "0px",
                    "opacity": "0"
                })
            },
            show: function ($elem) {
                js.customShow($elem)
            },
            hide: function ($elem) {
                js.customHide($elem)
            }
        }
    };
    // 构造函数
    function DropDown($elem, options) {
        this.$elem = $elem;
        this.options = options;
        this.$layer = this.$elem.find(".dropdown-layer");
        this.$activeClass = this.$elem.data("active") + "-active";
        this.$delay = this.options.delay;
        this._init();
    };
    DropDown.DEFAULTS = {
        trigger: "click",
        css: false,
        js: false,
        animation: 'fade'
    };
    DropDown.prototype._init = function () {
        var self = this;
        this.$layer.showHide(this.options);
        this.$layer.on("show shown hide hidden", function (e) {
            self.$elem.trigger("dropdown-" + e.type)
        });
        if (this.options.trigger === "click") {
            this.$elem.click(function (e) {
                self.show();
                e.stopPropagation();
            });
            $(document).click($.proxy(this.hide, this));
        } else {
            this.$elem.hover($.proxy(this.show, this), $.proxy(this.hide, this));
        }
    };
    DropDown.prototype.show = function () {
        let $this = this;
        this.timer = setTimeout(function () {
            $this.$elem.addClass($this.$activeClass);
            $this.$layer.showHide("show")
        }, 200)
    };
    DropDown.prototype.hide = function () {
        this.clearTimer = clearTimeout(this.timer);
        this.$elem.removeClass(this.$activeClass);
        this.$layer.showHide("hide")
    };

    function showHide($elem, option) {
        var mode = null;
        if (!option.css && !option.js) {
            mode = silent
        } else if (option.css) {
            mode = css[option.animation] || css[defaults.animation]
        } else {
            mode = js[option.animation] || js[defaults.animation]
        };
        mode.init($elem);
        return {
            show: $.proxy(mode.show, this, $elem),
            hide: $.proxy(mode.hide, this, $elem)
        }
    };
    $.fn.extend({
        showHide: function (options) {
            return this.each(function () {
                var $this = $(this),
                    mode = $this.data("showHide")
                if (!mode) {
                    $this.data('showHide', mode = showHide($this, typeof options === "object" && options))
                }
                if (typeof mode[options] === 'function') {
                    mode[options]()
                }
            })
        },
        // 调用
        dropdown: function (options) {
            return this.each(function () {
                var $this=$(this);
                var option = $.extend({}, DropDown.DEFAULTS, typeof options === 'object' && options);
                var dropdown = $this.data("dropdown");
                if (!dropdown) {
                    $this.data("dropdown", dropdown = new DropDown($this, option))
                };
                if (typeof dropdown[options] === 'function') {
                    dropdown[options]() 
                }
            })
        }
    })
})()