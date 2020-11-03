// 组件调用
(function () {


    var dropdown = {};
    dropdown.loadOnce = function ($elem, success) {
        var dataLoad = $elem.data('load');
        if (!dataLoad) return;
        if (!$elem.data('loaded')) {
            $elem.data('loaded', true);
            $.getJSON(dataLoad).done(function (data) {
                if (typeof success === 'function')
                    success($elem, data)
            }).fail($elem.data('loaded'), false)
        }
    }

    function buildMenuItem($elem, data) {
        var html = '';
        if (data.length == 0) {
            return
        } else {
            for (var i = 0; i < data.length; i++) {
                html += '<li><a href="' + data[i].url + '" class="dropdown-item">' + data[i].name + '</a></li>'
            }
        }
        $elem.find('.dropdown-layer').html(html)
    }

    dropdown.$dropdown = $(".dropdown.menu");
    dropdown.$dropdown.dropdown({
        trigger: "hover",
        css: true,
        js: true,
        animation: "fadeSlideLeftRight",
        delay: 0,
    });

    var $cart = $('.header-cart');


    var $search = $('.header-search');
    var maxNumber = 10;
    var html = '';
    $search.on("search-getData", function (e, data) {
        var $this = $(this);
        html = createHeaderSearchLayer(data, maxNumber);
        $search.search('appendLayer', html);
        if (html) {
            $this.search('show')
        } else {
            $this.search('hide')
        }
    }).on("search-noData", function (e) {
        $search.search('hide').search('appendLayer', '');

    }).on("click", '.search-layer-item', function () {
        $search.search('setInputVal', $(this).html());
        $search.search('submit')
    })


    function createHeaderSearchLayer(data, maxNumber) {
        var length = data['result'].length;
        var html = '';
        if (length == 0) {
            return ''
        }
        for (var i = 0; i < length; i++) {
            if (i >= maxNumber) {
                break;
            }
            html += '<li class="search-layer-item text-ellipsis" title="">' + data['result'][i][0] + '</li>'
        }
        return html;
    }


    $search.search({
        url: "https://suggest.taobao.com/sug?code=utf-8&_ksTS=1592086906869_7349&callback=jsonp7350&k=1&area=c2c&bucketid=5&q=",
        autocomplete: true,
        trigger: "click",
        css: false,
        js: true,
        animation: 'slideUpDown',
        getDataInterval: 0
    })


    var $catagory = $('.catagory').find('.dropdown');
    $catagory.dropdown({
        trigger: "hover",
        css: true,
        js: false,
        animation: "fadeSlideUpDown",
        delay: 0,
    })


    $('.catagory').on('dropdown-show', '.dropdown', function () {
        dropdown.loadOnce($(this), createCatagoryDetailsLayer)
    })

    function createCatagoryDetailsLayer($elem, data) {
        var html = '';
        if (data.length === 0) return;
        for (var i = 0; i < data.length; i++) {
            html += '<dl class="cf catagory-details">' + '<dt class="fl catagory-details-title">' + '<a href="###" target="_blank" class="link">' + data[i]['title'] + '</a>' + '</dt>' + '<dd class="fl catagory-details-link">';
            for (var j = 0; j < data[i]['items'].length; j++) {
                html += '<a href="###" target="_blank" class="link">' + data[i]['items'][j] + '</a>'
            }
            html += '</dd></dl>'
        }

        $elem.find('.dropdown-layer').html(html)
    }



    // imgLoader 命名空间
    var imgLoader = {}


    imgLoader.loadImg = function loadImg(url, imgLoaded, imgFailed) {
        var image = new Image();
        image.onerror = function () {
            // 图片加载失败后执行的回调函数
            if (typeof imgFailed === 'function') imgFailed(url)
        }
        image.onload = function () {
            // 图片加载完成后执行的回调函数
            if (typeof imgLoaded === 'function') imgLoaded(url)
        }
        // 后台加载图片
        image.src = url
    }
    imgLoader.loadImgs = function ($imgs, success, fail) {
        $imgs.each(function (_, elem) {
            var $elem = $(elem);
            var url = $elem.data('src')

            imgLoader.loadImg(url, function () {
                $elem.attr('src', url)
                success()
            }, function () {
                console.log('从' + url + '加载图片失败')
                fail($elem, url)
            })
        })
    }

    // loadOnDemand 命名空间
    var loadOnDemand = {};


    loadOnDemand.loadOnDemand = function (option) {
        var loadedItemsStatus = {};
        var loadedItemsNum = 0;
        var loadItemFuntion;
        var $elem = option.$container;
        var id = option.id
        $elem.on(option.triggerEvent, loadItemFuntion = function (e, index, elem) {
            // 防止重复加载
            if (loadedItemsStatus[index] !== 'loaded') {
                $elem.trigger(id + '-startLoading', [index, elem, function () {
                    // 记录已加载状态
                    loadedItemsStatus[index] = 'loaded';
                    // 已加载计数+1
                    loadedItemsNum++;
                    // 全部加载 以后清除加载事件
                    if (loadedItemsNum === option.totalItemNum) {
                        $elem.trigger(id + 'FullyLoaded')
                    }
                }])
            }
        })
        $elem.on(id + 'FullyLoaded', function (e) {
            $elem.off(option.triggerEvent, loadItemFuntion)
            // $window.off('scroll resize', timeToShow)
            console.log(id + 'fully loaded')
        })
    }

    loadOnDemand.isVisible = function (index) {
        if ($window.height() + $window.scrollTop() > floorData[index].offsetTop && $window.scrollTop() < floorData[index].offsetTop + floorData[index].height) return true
    }

    //focus-slider  命名空间

    var focus = {};
    focus.$focus = $('#focus-slider')

    focus.$focus.on('focus-startLoading', function (e, index, elem, success) {
        var $imgs = $(elem).find('.slider-img');
        setTimeout(function () {
            imgLoader.loadImgs($imgs, success, function ($elem, url) {
                $elem.attr('src', 'img/focus-slider/placeholder.png')
            })
        }, 1000)
        success()
    })


    loadOnDemand.loadOnDemand({
        $container: focus.$focus,
        totalItemNum: 7,
        triggerEvent: 'slider-show',
        id: 'focus'
    })

    focus.$focus.slider({
        css: true,
        js: true,
        toggle: 'slide',
        animation: 'fadeSlideLeftRight',
        activeIndex: 0,
        interval: 4000,
    })

    //todays-slider 命名空间
    var slider = {};

    slider.$todays = $('#todays-slider');
    slider.$todays.on('todays-startLoading', function (e, index, elem, success) {
        var $imgs = $(elem).find('.slider-img');
        setTimeout(function () {
            imgLoader.loadImgs($imgs, success, function ($elem, url) {
                $elem.attr('src', 'img/todays-slider/placeholder.png')
            })
        }, 1000)
        success()
    })
    loadOnDemand.loadOnDemand({
        $container: slider.$todays,
        totalItemNum: 15,
        triggerEvent: 'slider-show',
        id: 'todays'
    })

    slider.$todays.slider({
        css: true,
        js: true,
        toggle: 'slide',
        animation: 'fadeSlideLeftRight',
        activeIndex: 0,
        interval: 4000,
    })



    var $floor = $('.floor')
    var $window = $(window)
    var $document = $(document)
    var floorData = [{
        num: '1',
        text: '服装鞋包',
        tabs: ['大牌', '男装', '女装'],
        offsetTop: $floor.eq(0).offset().top,
        height: $floor.eq(0).height(),
        items: [
            [{
                name: '匡威男棒球开衫外套2015',
                price: 479
            }, {
                name: 'adidas 阿迪达斯 训练 男子',
                price: 335
            }, {
                name: '必迈BMAI一体织跑步短袖T恤',
                price: 159
            }, {
                name: 'NBA袜子半毛圈运动高邦棉袜',
                price: 65
            }, {
                name: '特步官方运动帽男女帽子2016',
                price: 69
            }, {
                name: 'KELME足球训练防寒防风手套',
                price: 4999
            }, {
                name: '战地吉普三合一冲锋衣',
                price: 289
            }, {
                name: '探路者户外男士徒步鞋',
                price: 369
            }, {
                name: '羽绒服2015秋冬新款轻薄男士',
                price: 399
            }, {
                name: '溯溪鞋涉水鞋户外鞋',
                price: 689
            }, {
                name: '旅行背包多功能双肩背包',
                price: 269
            }, {
                name: '户外旅行双肩背包OS0099',
                price: 99
            }],
            [{
                name: '匡威男棒球开衫外套2015',
                price: 479
            }, {
                name: 'adidas 阿迪达斯 训练 男子',
                price: 335
            }, {
                name: '必迈BMAI一体织跑步短袖T恤',
                price: 159
            }, {
                name: 'NBA袜子半毛圈运动高邦棉袜',
                price: 65
            }, {
                name: '特步官方运动帽男女帽子2016',
                price: 69
            }, {
                name: 'KELME足球训练防寒防风手套',
                price: 4999
            }, {
                name: '战地吉普三合一冲锋衣',
                price: 289
            }, {
                name: '探路者户外男士徒步鞋',
                price: 369
            }, {
                name: '羽绒服2015秋冬新款轻薄男士',
                price: 399
            }, {
                name: '溯溪鞋涉水鞋户外鞋',
                price: 689
            }, {
                name: '旅行背包多功能双肩背包',
                price: 269
            }, {
                name: '户外旅行双肩背包OS0099',
                price: 99
            }],
            [{
                name: '匡威男棒球开衫外套2015',
                price: 479
            }, {
                name: 'adidas 阿迪达斯 训练 男子',
                price: 335
            }, {
                name: '必迈BMAI一体织跑步短袖T恤',
                price: 159
            }, {
                name: 'NBA袜子半毛圈运动高邦棉袜',
                price: 65
            }, {
                name: '特步官方运动帽男女帽子2016',
                price: 69
            }, {
                name: 'KELME足球训练防寒防风手套',
                price: 4999
            }, {
                name: '战地吉普三合一冲锋衣',
                price: 289
            }, {
                name: '探路者户外男士徒步鞋',
                price: 369
            }, {
                name: '羽绒服2015秋冬新款轻薄男士',
                price: 399
            }, {
                name: '溯溪鞋涉水鞋户外鞋',
                price: 689
            }, {
                name: '旅行背包多功能双肩背包',
                price: 269
            }, {
                name: '户外旅行双肩背包OS0099',
                price: 99
            }]
        ]
    }, {
        num: '2',
        text: '个护美妆',
        tabs: ['热门', '国际大牌', '国际名品'],
        offsetTop: $floor.eq(1).offset().top,
        height: $floor.eq(1).height(),
        items: [
            [{
                name: '韩束红石榴鲜活水盈七件套装',
                price: 169
            }, {
                name: '温碧泉八杯水亲亲水润五件套装',
                price: 198
            }, {
                name: '御泥坊红酒透亮矿物蚕丝面膜贴',
                price: 79.9
            }, {
                name: '吉列手动剃须刀锋隐致护',
                price: 228
            }, {
                name: 'Mediheal水润保湿面膜',
                price: 119
            }, {
                name: '纳益其尔芦荟舒缓保湿凝胶',
                price: 39
            }, {
                name: '宝拉珍选基础护肤旅行四件套',
                price: 299
            }, {
                name: '温碧泉透芯润五件套装',
                price: 257
            }, {
                name: '玉兰油多效修护三部曲套装',
                price: 199
            }, {
                name: 'LOREAL火山岩控油清痘洁面膏',
                price: 36
            }, {
                name: '百雀羚水嫩倍现盈透精华水',
                price: 139
            }, {
                name: '珀莱雅新柔皙莹润三件套',
                price: 99
            }],
            [{
                name: '韩束红石榴鲜活水盈七件套装',
                price: 169
            }, {
                name: '温碧泉八杯水亲亲水润五件套装',
                price: 198
            }, {
                name: '御泥坊红酒透亮矿物蚕丝面膜贴',
                price: 79.9
            }, {
                name: '吉列手动剃须刀锋隐致护',
                price: 228
            }, {
                name: 'Mediheal水润保湿面膜',
                price: 119
            }, {
                name: '纳益其尔芦荟舒缓保湿凝胶',
                price: 39
            }, {
                name: '宝拉珍选基础护肤旅行四件套',
                price: 299
            }, {
                name: '温碧泉透芯润五件套装',
                price: 257
            }, {
                name: '玉兰油多效修护三部曲套装',
                price: 199
            }, {
                name: 'LOREAL火山岩控油清痘洁面膏',
                price: 36
            }, {
                name: '百雀羚水嫩倍现盈透精华水',
                price: 139
            }, {
                name: '珀莱雅新柔皙莹润三件套',
                price: 99
            }],
            [{
                name: '韩束红石榴鲜活水盈七件套装',
                price: 169
            }, {
                name: '温碧泉八杯水亲亲水润五件套装',
                price: 198
            }, {
                name: '御泥坊红酒透亮矿物蚕丝面膜贴',
                price: 79.9
            }, {
                name: '吉列手动剃须刀锋隐致护',
                price: 228
            }, {
                name: 'Mediheal水润保湿面膜',
                price: 119
            }, {
                name: '纳益其尔芦荟舒缓保湿凝胶',
                price: 39
            }, {
                name: '宝拉珍选基础护肤旅行四件套',
                price: 299
            }, {
                name: '温碧泉透芯润五件套装',
                price: 257
            }, {
                name: '玉兰油多效修护三部曲套装',
                price: 199
            }, {
                name: 'LOREAL火山岩控油清痘洁面膏',
                price: 36
            }, {
                name: '百雀羚水嫩倍现盈透精华水',
                price: 139
            }, {
                name: '珀莱雅新柔皙莹润三件套',
                price: 99
            }]
        ]
    }, {
        num: '3',
        text: '手机通讯',
        tabs: ['热门', '品质优选', '新机尝鲜'],
        offsetTop: $floor.eq(2).offset().top,
        height: $floor.eq(2).height(),
        items: [
            [{
                name: '摩托罗拉 Moto Z Play',
                price: 3999
            }, {
                name: 'Apple iPhone 7 (A1660)',
                price: 6188
            }, {
                name: '小米 Note 全网通 白色',
                price: 999
            }, {
                name: '小米5 全网通 标准版 3GB内存',
                price: 1999
            }, {
                name: '荣耀7i 海岛蓝 移动联通4G手机',
                price: 1099
            }, {
                name: '乐视（Le）乐2（X620）32GB',
                price: 1099
            }, {
                name: 'OPPO R9 4GB+64GB内存版',
                price: 2499
            }, {
                name: '魅蓝note3 全网通公开版',
                price: 899
            }, {
                name: '飞利浦 X818 香槟金 全网通4G',
                price: 1998
            }, {
                name: '三星 Galaxy S7（G9300）',
                price: 4088
            }, {
                name: '华为 荣耀7 双卡双待双通',
                price: 1128
            }, {
                name: '努比亚(nubia)Z7Max(NX505J)',
                price: 728
            }],
            [{
                name: '摩托罗拉 Moto Z Play',
                price: 3999
            }, {
                name: 'Apple iPhone 7 (A1660)',
                price: 6188
            }, {
                name: '小米 Note 全网通 白色',
                price: 999
            }, {
                name: '小米5 全网通 标准版 3GB内存',
                price: 1999
            }, {
                name: '荣耀7i 海岛蓝 移动联通4G手机',
                price: 1099
            }, {
                name: '乐视（Le）乐2（X620）32GB',
                price: 1099
            }, {
                name: 'OPPO R9 4GB+64GB内存版',
                price: 2499
            }, {
                name: '魅蓝note3 全网通公开版',
                price: 899
            }, {
                name: '飞利浦 X818 香槟金 全网通4G',
                price: 1998
            }, {
                name: '三星 Galaxy S7（G9300）',
                price: 4088
            }, {
                name: '华为 荣耀7 双卡双待双通',
                price: 1128
            }, {
                name: '努比亚(nubia)Z7Max(NX505J)',
                price: 728
            }],
            [{
                name: '摩托罗拉 Moto Z Play',
                price: 3999
            }, {
                name: 'Apple iPhone 7 (A1660)',
                price: 6188
            }, {
                name: '小米 Note 全网通 白色',
                price: 999
            }, {
                name: '小米5 全网通 标准版 3GB内存',
                price: 1999
            }, {
                name: '荣耀7i 海岛蓝 移动联通4G手机',
                price: 1099
            }, {
                name: '乐视（Le）乐2（X620）32GB',
                price: 1099
            }, {
                name: 'OPPO R9 4GB+64GB内存版',
                price: 2499
            }, {
                name: '魅蓝note3 全网通公开版',
                price: 899
            }, {
                name: '飞利浦 X818 香槟金 全网通4G',
                price: 1998
            }, {
                name: '三星 Galaxy S7（G9300）',
                price: 4088
            }, {
                name: '华为 荣耀7 双卡双待双通',
                price: 1128
            }, {
                name: '努比亚(nubia)Z7Max(NX505J)',
                price: 728
            }]
        ]
    }, {
        num: '4',
        text: '家用电器',
        tabs: ['热门', '大家电', '生活电器'],
        offsetTop: $floor.eq(3).offset().top,
        height: $floor.eq(3).height(),
        items: [
            [{
                name: '暴风TV 超体电视 40X 40英寸',
                price: 1299
            }, {
                name: '小米（MI）L55M5-AA 55英寸',
                price: 3699
            }, {
                name: '飞利浦HTD5580/93 音响',
                price: 2999
            }, {
                name: '金门子H108 5.1套装音响组合',
                price: 1198
            }, {
                name: '方太ENJOY云魔方抽油烟机',
                price: 4390
            }, {
                name: '美的60升预约洗浴电热水器',
                price: 1099
            }, {
                name: '九阳电饭煲多功能智能电饭锅',
                price: 159
            }, {
                name: '美的电烤箱家用大容量',
                price: 329
            }, {
                name: '奥克斯(AUX)936破壁料理机',
                price: 1599
            }, {
                name: '飞利浦面条机 HR2356/31',
                price: 665
            }, {
                name: '松下NU-JA100W 家用蒸烤箱',
                price: 1799
            }, {
                name: '飞利浦咖啡机 HD7751/00',
                price: 1299
            }],
            [{
                name: '暴风TV 超体电视 40X 40英寸',
                price: 1299
            }, {
                name: '小米（MI）L55M5-AA 55英寸',
                price: 3699
            }, {
                name: '飞利浦HTD5580/93 音响',
                price: 2999
            }, {
                name: '金门子H108 5.1套装音响组合',
                price: 1198
            }, {
                name: '方太ENJOY云魔方抽油烟机',
                price: 4390
            }, {
                name: '美的60升预约洗浴电热水器',
                price: 1099
            }, {
                name: '九阳电饭煲多功能智能电饭锅',
                price: 159
            }, {
                name: '美的电烤箱家用大容量',
                price: 329
            }, {
                name: '奥克斯(AUX)936破壁料理机',
                price: 1599
            }, {
                name: '飞利浦面条机 HR2356/31',
                price: 665
            }, {
                name: '松下NU-JA100W 家用蒸烤箱',
                price: 1799
            }, {
                name: '飞利浦咖啡机 HD7751/00',
                price: 1299
            }],
            [{
                name: '暴风TV 超体电视 40X 40英寸',
                price: 1299
            }, {
                name: '小米（MI）L55M5-AA 55英寸',
                price: 3699
            }, {
                name: '飞利浦HTD5580/93 音响',
                price: 2999
            }, {
                name: '金门子H108 5.1套装音响组合',
                price: 1198
            }, {
                name: '方太ENJOY云魔方抽油烟机',
                price: 4390
            }, {
                name: '美的60升预约洗浴电热水器',
                price: 1099
            }, {
                name: '九阳电饭煲多功能智能电饭锅',
                price: 159
            }, {
                name: '美的电烤箱家用大容量',
                price: 329
            }, {
                name: '奥克斯(AUX)936破壁料理机',
                price: 1599
            }, {
                name: '飞利浦面条机 HR2356/31',
                price: 665
            }, {
                name: '松下NU-JA100W 家用蒸烤箱',
                price: 1799
            }, {
                name: '飞利浦咖啡机 HD7751/00',
                price: 1299
            }]
        ]
    }, {
        num: '5',
        text: '电脑数码',
        tabs: ['热门', '电脑/平板', '潮流影音'],
        offsetTop: $floor.eq(4).offset().top,
        height: $floor.eq(4).height(),
        items: [
            [{
                name: '戴尔成就Vostro 3800-R6308',
                price: 2999
            }, {
                name: '联想IdeaCentre C560',
                price: 5399
            }, {
                name: '惠普260-p039cn台式电脑',
                price: 3099
            }, {
                name: '华硕飞行堡垒旗舰版FX-PRO',
                price: 6599
            }, {
                name: '惠普(HP)暗影精灵II代PLUS',
                price: 12999
            }, {
                name: '联想(Lenovo)小新700电竞版',
                price: 5999
            }, {
                name: '游戏背光牧马人机械手感键盘',
                price: 499
            }, {
                name: '罗技iK1200背光键盘保护套',
                price: 799
            }, {
                name: '西部数据2.5英寸移动硬盘1TB',
                price: 419
            }, {
                name: '新睿翼3TB 2.5英寸 移动硬盘',
                price: 849
            }, {
                name: 'Rii mini i28无线迷你键盘鼠标',
                price: 349
            }, {
                name: '罗技G29 力反馈游戏方向盘',
                price: 2999
            }],
            [{
                name: '戴尔成就Vostro 3800-R6308',
                price: 2999
            }, {
                name: '联想IdeaCentre C560',
                price: 5399
            }, {
                name: '惠普260-p039cn台式电脑',
                price: 3099
            }, {
                name: '华硕飞行堡垒旗舰版FX-PRO',
                price: 6599
            }, {
                name: '惠普(HP)暗影精灵II代PLUS',
                price: 12999
            }, {
                name: '联想(Lenovo)小新700电竞版',
                price: 5999
            }, {
                name: '游戏背光牧马人机械手感键盘',
                price: 499
            }, {
                name: '罗技iK1200背光键盘保护套',
                price: 799
            }, {
                name: '西部数据2.5英寸移动硬盘1TB',
                price: 419
            }, {
                name: '新睿翼3TB 2.5英寸 移动硬盘',
                price: 849
            }, {
                name: 'Rii mini i28无线迷你键盘鼠标',
                price: 349
            }, {
                name: '罗技G29 力反馈游戏方向盘',
                price: 2999
            }],
            [{
                name: '戴尔成就Vostro 3800-R6308',
                price: 2999
            }, {
                name: '联想IdeaCentre C560',
                price: 5399
            }, {
                name: '惠普260-p039cn台式电脑',
                price: 3099
            }, {
                name: '华硕飞行堡垒旗舰版FX-PRO',
                price: 6599
            }, {
                name: '惠普(HP)暗影精灵II代PLUS',
                price: 12999
            }, {
                name: '联想(Lenovo)小新700电竞版',
                price: 5999
            }, {
                name: '游戏背光牧马人机械手感键盘',
                price: 499
            }, {
                name: '罗技iK1200背光键盘保护套',
                price: 799
            }, {
                name: '西部数据2.5英寸移动硬盘1TB',
                price: 419
            }, {
                name: '新睿翼3TB 2.5英寸 移动硬盘',
                price: 849
            }, {
                name: 'Rii mini i28无线迷你键盘鼠标',
                price: 349
            }, {
                name: '罗技G29 力反馈游戏方向盘',
                price: 2999
            }]
        ]
    }];

    // floor命名空间
    var floor = {};
    floor.buildFloor = function (floorData) {
        var html = ''
        html += '<div class="container">'
        html += floor.buildFloorHead(floorData)
        html += floor.buildFloorBody(floorData)
        html += '</div>'

        return html;
    }

    floor.buildFloorHead = function (floorData) {
        var html = ''
        html += '<div class="floor-head">'
        html += '<h2 class="floor-title fl"><span class="floor-title-num">' + floorData.num + 'F</span><span class="floor-title-text">' + floorData.text + '</span></h2>'
        html += '<ul class="tab-item-wrap fr">'

        for (var i = 0; i < floorData.tabs.length; i++) {
            html += '<li class="fl"><a href="javascript:;" class="tab-item">' + floorData.tabs[i] + '</a></li>'
            if (i !== floorData.tabs.length - 1) {
                html += '<li class="floor-divider fl text-hidden">分隔线</li>'
            }
        }
        html += '</ul>'
        html += '</div>'
        return html
    }

    floor.buildFloorBody = function (floorData) {
        var html = '';
        html += '<div class="floor-body">'
        for (var i = 0; i < floorData.tabs.length; i++) {
            html += '<ul class="tab-panel">'
            for (var y = 0; y < floorData.items[i].length; y++) {
                html += '<li class="floor-item fl">'
                html += '<p class="floor-item-pic"><a href="###" target="_blank"><img src="img/floor/loading.gif" class="floor-img" data-src="img/floor/' + floorData.num + '/' + (i + 1) + '/' + (y + 1) + '.png" alt="" /></a></p>'
                html += '<p class="floor-item-name"><a href="###" target="_blank" class="link">' + floorData.items[i][y].name + '</a></p>'
                html += '<p class="floor-item-price">￥' + floorData.items[i][y].price + '</p>'
                html += '</li>'
            }
            html += '</ul>'
        }
        html += '</div>'
        return html
    }

    floor.timeToShow = function () {
        $floor.each(function (index, elem) {
            if (loadOnDemand.isVisible(index)) {
                $document.trigger('floor-show', [index, elem])
                console.log('time to show')
            }
        })
    }

    // elevator
    floor.$elevator = $('#elevator')
    floor.$elevatorItems = floor.$elevator.find('.elevator-item') 
    floor.currentFloorFn;
    floor.currentFloor=function(){
        var currentFloor=-1;
        var offsetTop=$window.scrollTop();
        
        $floor.each(function(index){
            if(offsetTop+$window.height()/2<floorData[index]['offsetTop']){
                currentFloor=index-1
                return false
            }
        })
        console.log(currentFloor)
        return currentFloor
    }
     
    $window.on('scroll',floor.currentFloorFn=function(e){
        var currentFloor=floor.currentFloor();
        if(currentFloor===-1){
            floor.$elevator.fadeOut()
        }
        if(currentFloor!==-1){
            floor.$elevator.fadeIn()
            floor.$elevatorItems.removeClass('elevator-active');
            floor.$elevatorItems.eq(currentFloor).addClass('elevator-active')
        }
    })

    floor.$elevator.on('click','.elevator-item',function(e){
        var $this=$(this)
        var index=$this.index()
        var offsetTop=floorData[0]['offsetTop'];
        var height=floorData[0]['height']
        $window.scrollTop(offsetTop+height*index+100-$window.height()/2)
    })




    
    $document.on('floor-startLoading', function (e, index, elem, success) {
        // 加载floor
        setTimeout(function () {
            $(elem).html(floor.buildFloor(floorData[index]))
            loadOnDemand.loadOnDemand({
                $container: $(elem),
                totalItemNum: $($(elem)[0]).find('.floor-img').length,
                triggerEvent: 'tab-show',
                id: 'tab'
            })
            $(elem).tab({
                event: 'mouseenter', //click
                css: true,
                js: false,
                animation: 'fade',
                activeIndex: 0,
                interval: 0,
                delay: 0,
            })
        }, 1000)
        success()
    })
    $document.on('floorFullyLoaded', function (e) {
        $window.off('scroll resize', floor.showFloor)
    })
    $floor.on('tab-startLoading', function (e, index, elem, success) {
        var $imgs = $(elem).find('.floor-img');
        setTimeout(function () {
            imgLoader.loadImgs($imgs, success, function ($elem, url) {
                $elem.attr('src', 'img/floor/placeholder.png')
            })
        }, 1000)
        success()
    })
    $window.on('scroll resize', floor.showFloor = function () {
        clearTimeout(floor.floorTimer)
        floor.floorTimer = setTimeout(floor.timeToShow, 250)
    })

    loadOnDemand.loadOnDemand({
        $container: $document,
        totalItemNum: 5,
        triggerEvent: 'floor-show',
        id: 'floor'
    })

})()