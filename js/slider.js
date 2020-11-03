(function () {
    'use strict';

    function Slider($elem, option) {
        this.$elem = $elem;
        this.option = option;
        this.$items = this.$elem.find('.slider-item');
        this.$indicators = this.$elem.find('.slider-indicator');
        this.$sliderControls = this.$elem.find('.slider-control');
        this.currentIndex = this._getCorrectIndex(this.option.activeIndex);
        this._init();
    }
    Slider.DEFAULTS = {
        css: true,
        js: false,
        animation: 'fade',
        activeIndex: 3,
        interval: 500,
        loop: false
    }
    Slider.prototype._init = function () {
        self = this;
        this.$indicators.removeClass('slider-indicator-active');
        this.$indicators.eq(this.currentIndex).addClass('slider-indicator-active');
        self.$elem.trigger('slider-show',[this.currentIndex,this.$items.eq(this.currentIndex)])

        if (this.option.toggle === 'slide') {
            var self=this;
            this.to = this._slide;
            this.itemWidth = this.$items.eq(0).width();
            this.$elem.addClass('slider-slide');
            this.$items.eq(this.currentIndex).css({
                left: 0,
            });
            // move init
            this.$items.slide(this.option);
            this.transitionClass=this.$items.eq(0).hasClass('transition')?'transition':'';
            // send message
            this.$items.on('move moved', function (e) {
                var $this = $(this);
                if (e.type === 'move') {
                    if ($this.index() === self.currentIndex) {
                        $this.trigger('hide', [$this.index(), this])
                    } else if ($this.index() != self.currentIndex) {
                        $this.trigger('show', [$this.index(), this])
                    }
                } else if (e.type === 'moved') {
                    if ($this.index() != self.currentIndex) {
                        $this.trigger('hidden', [$this.index(), this])
                    } else if ($this.index() === self.currentIndex) {
                        $this.trigger('shown', [$this.index(), this])
                    }
                }
            })
        } else {
            this.to = this._fade;
            this.$elem.addClass('slider-fade');
            this.$items.eq(this.currentIndex).show();
            // showhide init
            this.$items.showHide(this.option);
        }


        this.$sliderControls.showHide(this.option);


        // event binding
        this.$elem.hover(function () {
                self.$sliderControls.showHide('show')
            }, function () {
                self.$sliderControls.showHide('hide')
            })
            .on('click', '.slider-control-left', function () {
                var index = self.currentIndex - 1;
                self.to(self._getCorrectIndex(index), 1);
            })
            .on('click', '.slider-control-right', function () {
                var index = self.currentIndex + 1;
                self.to(self._getCorrectIndex(index), -1);
            })
            .on('click', '.slider-indicator', function () {
                self.to(self._getCorrectIndex($(this).index()));
            })

        // auto
        if (this.option.interval && !isNaN(Number(this.option.interval))) {
            this.auto();
            this.$elem.hover($.proxy(this.pause, this), $.proxy(this.auto, this))
        }

        // send message
        this.$items.on('show shown hide hidden', function (e) {
            self.$elem.trigger('slider-' + e.type, [self.$items.index(this), $(this)])
        })
        
    };
    Slider.prototype._getCorrectIndex = function (index) {
        if (isNaN(Number(index))) return 0;
        if (index < 0) {
            index = this.$items.length - 1
        }
        if (index > this.$items.length - 1) {
            index = 0
        }
        return index
    };
    Slider.prototype._activateIndicators = function (index) {
        this.$indicators.removeClass('slider-indicator-active');
        this.$indicators.eq(index).addClass('slider-indicator-active');
    }
    Slider.prototype._fade = function (index) {
        if (this.currentIndex === index) return;

        this.$items.eq(this.currentIndex).showHide('hide');
        this.$items.eq(index).showHide('show');

        this._activateIndicators(index)

        this.currentIndex = index;
    };
    Slider.prototype._slide = function (index, direction) {
        var self=this;
        if (this.currentIndex === index) return;
        if (!direction) {
            if (this.currentIndex > index) {
                direction = 1;
            } else if (this.currentIndex < index) {
                direction = -1;
            }
        }
        this.$items.eq(index).removeClass(this.transitionClass).css({
            left: direction * this.itemWidth * -1
        });
        setTimeout(function () {
            self.$items.eq(self.currentIndex).slide('x', self.itemWidth * direction);
            self.$items.eq(index).addClass(self.transitionClass).slide('x', 0);
            self.currentIndex = index;
        }, 20)


        this._activateIndicators(index)
        

    };
    Slider.prototype.auto = function () {
        var self = this;
        this.intervalID = setInterval(function () {
            self.to(self._getCorrectIndex(self.currentIndex + 1), -1);
        }, this.option.interval)
    };
    Slider.prototype.pause = function () {
        clearInterval(this.intervalID)
    };



    $.fn.extend({
        slider: function (option) {
            return this.each(function () {
                var $this = $(this);
                var slider = $this.data('slider');
                var options = $.extend({}, Slider.DEFAULTS, $this.data(), typeof option === 'object' && option);
                if (!slider) {
                    $this.data('slider', slider = new Slider($this, options))
                }
                if (typeof slider[option] === 'function') {
                    slider[option]()
                }
            })
        }
    })
})()