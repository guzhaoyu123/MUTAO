(function () {
    'use strict';

    function Tab($elem, option) {
        this.$elem = $elem;
        this.option = option;

        this.$items = this.$elem.find('.tab-item')
        this.$panels = this.$elem.find('.tab-panel')

        this.itemLength = this.$items.length
        this.currentIndex = this._getCorrectIndex(this.option.activeIndex)

        this._init()
    }

    Tab.DEFAULTS = {
        event: 'mouseenter', //click
        css: true,
        js: false,
        animation: 'fade',
        activeIndex: 0,
        interval: 0,
        delay: 0,
    }

    Tab.prototype._init = function () {
        var self = this;
        var timer;
        this.$items.removeClass('tab-item-active')
        this.$items.eq(this.currentIndex).addClass('tab-item-active')

        this.$panels.eq(this.currentIndex).show()

        this.$elem.trigger('tab-show',[this.currentIndex,this.$panels[this.currentIndex]])
        
        this.$panels.on('show shown hide hidden', function (e) {
            self.$elem.trigger('tab-' + e.type, [self.$panels.index(this), this])
        })
        this.$panels.showHide(this.option)

        //event binding
        this.option.event = this.option.event === 'click' ? 'click' : 'mouseenter';
        this.$elem.on(this.option.event, '.tab-item', function (e) {
            var index = self.$items.index(this);
            
            if (self.option.delay) {//delay
                clearTimeout(timer)
                timer = setTimeout(function () {
                    self.toggle(index)
                }, self.option.delay)
            } else {//no delay
                self.toggle(index)
            }

        })


        //auto
        if (this.option.interval && !isNaN(Number(this.option.interval))) {
            this.$elem.hover($.proxy(this.pause, this), $.proxy(this.auto, this))
            this.auto();
        }
    }

    Tab.prototype._getCorrectIndex = function (index) {
        if (isNaN(Number(index))) return 0;
        if (index < 0) {
            index = this.$items.length - 1
        }
        if (index > this.$items.length - 1) {
            index = 0
        }
        return index
    };


    Tab.prototype.toggle = function (index) {
        if (index === this.currentIndex) return
        this.$panels.eq(this.currentIndex).showHide('hide')
        this.$panels.eq(index).showHide('show');

        this.$items.removeClass('tab-item-active')
        this.$items.eq(index).addClass('tab-item-active')

        this.currentIndex = index
    }


    Tab.prototype.auto = function () {
        var self = this;
        this.intervalId = setInterval(function () {
            self.toggle(self._getCorrectIndex(self.currentIndex + 1))
        }, this.option.interval)
    }


    Tab.prototype.pause = function () {
        clearInterval(this.intervalId)
    }
    $.fn.extend({
        tab: function (option) {
            return this.each(function () {
                var $this = $(this);
                var tab = $this.data('tab');
                var options = $.extend({}, Tab.DEFAULTS, typeof option === 'object' && option);
                if (!tab) {
                    $this.data('tab', tab = new Tab($this, options))
                }
                if (typeof tab.option === 'function') {
                    tab[option]()
                }
            })
        }
    })
})()