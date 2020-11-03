// // 搜索框架
// (function () {
//     'use strict';
//     var $search = $(".header-search"),
//         $inputbox = $search.find(".search-inputbox"),
//         $btn = $search.find(".search-btn"),
//         $layer = $search.find(".search-layer"),
//         $item = $search.find(".search-layer-item"),
//         $form = $search.find(".search-form");

//     // 验证
//     $form.on("submit", function () {

//         if ($.trim($inputbox.val()) === "") {
//             return false;
//         }
//     })
//     // 正则去除HTML标签
//     var removeTags = function (str) {
//         return str.replace(/<[^>]+>/g, '')
//     }
//     // 自动完成
//     $inputbox.on({
//         input: function () {
//             var url = "https://suggest.taobao.com/sug?code=utf-8&q=" + encodeURIComponent($.trim($inputbox.val())) + "&_ksTS=1592086906869_7349&callback=jsonp7350&k=1&area=c2c&bucketid=5";
//             $.ajax({
//                 url: url,
//                 // timeout:1,
//                 dataType: 'jsonp'
//             }).done(function (data) {
//                 console.log(data);
//                 var html = '',
//                     maxNumber = 10,
//                     length = data['result'].length;
//                 if (length == 0) {
//                     $layer.hide().html('');
//                     return
//                 };
//                 for (var i = 0; i < length; i++) {
//                     if (i >= maxNumber) {
//                         break;
//                     }
//                     html += '<li class="search-layer-item text-ellipsis" title="">' + data['result'][i][0] + '</li>'
//                 }
//                 $layer.html(html).show();
//                 $layer.on("click", ".search-layer-item", function () {
//                     $inputbox.val(removeTags($(this).html()));
//                     $form.submit();
//                 })
//             }).fail(function () {
//                 $layer.hide().html('')
//             }).always(function () {
//                 console.log("why always me")
//             });
//         },
//     })
// })()


(function () {
    'use strict';

    function Search(elem, options) {
        var self = this;
        this.$elem = $(elem);
        this.options = options;
        this.$form = this.$elem.find('.search-form');
        this.$inputbox = this.$elem.find('.search-inputbox');
        this.$layer = this.$elem.find('.search-layer');
        this.loaded = false;
        if (this.options['autocomplete'] === true) {
            this.autocomplete();
        }
        this._init();
        this.$elem.on('click', '.search-btn', $.proxy(this.submit, self))
    }

    Search.Defaults = {
        url: "https://suggest.taobao.com/sug?code=utf-8&_ksTS=1592086906869_7349&callback=jsonp7350&k=1&area=c2c&bucketid=5&q=",
        autocomplete: true,
        trigger: "click",
        css: false,
        js: false,
        animation: 'fade',
        getDataInterval: 200
    }
    Search.prototype._init = function () {
        this.$layer.showHide(this.options);
    };

    Search.prototype.submit = function () {
        if (this.getInputVal() === '') {
            return false
        }
        this.$form.submit()
    }

    Search.prototype.autocomplete = function () {
        var self = this;
        var timer = null;
        this.$inputbox.on("input", function () {
                if (self.options.getDataInterval) {
                    console.log(1);
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        self.getData()
                    }, self.options['getDataInterval'])
                } else {
                    console.log(2);
                    self.getData()
                }
                    // clearTimeout(timer);
                    // timer = setTimeout(function () {
                    //     self.getData()
                    // }, self.options['getDataInterval'])
            })
            .on("focus", $.proxy(this.show, self))
            .on("click", function (e) {
                e.stopPropagation();
                $.proxy(this.show, self)
            })
        $(document).on("click", $.proxy(this.hide, self))

    }
    Search.prototype.getData = function () {
        var self = this;
        var inputVal = this.getInputVal();
        if (!inputVal) {
            return this.$elem.trigger('search-noData')
        }
        if (this.jqXHR) {
            this.jqXHR.abort()
        }
        this.jqXHR = $.ajax({
                url: this.options.url + inputVal,
                dataType: 'jsonp'
            })
            .done(function (data) {
                console.log(data);
                self.$elem.trigger('search-getData', [data]);
            })
            .fail(function () {
                self.$elem.trigger('search-noData')
            })
            .always(
                function () {
                    self.jqXHR = null
                }
            )
    }
    Search.prototype.show = function () {
        if (!this.loaded) return;
        this.$layer.showHide('show');
    }
    Search.prototype.hide = function () {
        this.$layer.showHide('hide');
    }

    function removeTags(str) {
        return str.replace(/<[^>]+>/g, '')
    }

    Search.prototype.getInputVal = function () {
        return $.trim(this.$inputbox.val())
    }
    Search.prototype.setInputVal = function (val) {
        this.$inputbox.val(removeTags(val))
    }

    Search.prototype.appendLayer = function (html) {
        this.$layer.html(html);
        this.loaded = !!html;
    }


    $.fn.extend({
        search: function (options, value) {
            return this.each(function () {
                var $this = $(this);
                var option = $.extend({}, Search.DEFAULTS, typeof options === 'object' && options);
                var search = $this.data("search");
                if (!search) {
                    $this.data("search", search = new Search($this, option))
                };
                if (typeof search[options] === 'function') {
                    search[options](value)
                }
            })
        }
    });


})()