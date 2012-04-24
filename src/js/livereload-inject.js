/**
 * description: live reload background run init
 * author: rehorn@vip.qq.com
 * date: 2012-04-22
 */

(function(window, undefined) {

    var Utils = {
        toArr: function(arrLike){
            return Array.prototype.slice.call(arrLike);
        },
        getAbsUrl: function(url) {
            if (/https{0,1}:\/\//.test(url)) {
                return url;
            } else {
                var href = window.location.href,
                    basePathArr = href.split('/');
                basePathArr.pop();

                var urlArr = url.split('/'),
                    tmpArr = [];

                urlArr.forEach(function(item) {
                    if (item === '..') {
                        basePathArr.pop();
                    } else if (item === '.') {
                        // do nothing
                    } else {
                        basePathArr.push(item);
                    }
                });
                return basePathArr.join('/');
            }
        }
    };

    var LiveReload = {
        init: function() {
            console.log('injectScript init');
            this.initWatchList();
            this.initEvents();
        },
        initWatchList: function() {
            var links = this._parseLinks();
            chrome.extension.sendRequest({
                "action": "initWatchList",
                "data": links
            }, function(response) {
                console.log(response);
            });
        },
        initEvents: function() {
            var self = this;
            var observer = {
                onExtRequest: function(request, sender, sendRequest) {
                    if(request.action === 'reload'){
                        self._reload(request.item);
                    }
                }
            };

            chrome.extension.onRequest.addListener(observer.onExtRequest);
        },
        _parseLinks: function(){
            var cssLinks = Utils.toArr(document.querySelectorAll('link[href*=".css"]')),
                jsLinks = Utils.toArr(document.querySelectorAll('script[src*=".js"]')),
                htmlLink = document.URL,
                result = [];

            cssLinks.forEach(function(item) {
                var l = {
                    type: 'css',
                    url: Utils.getAbsUrl(item.getAttribute('href'))
                };
                result.push(l);
            });

            jsLinks.forEach(function(item) {
                var l = {
                    type: 'js',
                    url: Utils.getAbsUrl(item.getAttribute('src'))
                };
                result.push(l);
            });

            result.push({
                type: 'html',
                url: htmlLink
            });

            return result;
        },

        _adjustScroll: function ( ) {
            var key = '__LiveRloadScrollY';
            var reg = new RegExp("(^| )" + key + "=([^;]*)(;|\x24)"),
                result = reg.exec(document.cookie);

            var y = result ? result[2] : null;
            if (y == null) return;
            if (window.pageYOffset != null) window.pageYOffset = y;
            if (document.documentElement.scrollTop != null) document.documentElement.scrollTop = y;
            if (window.pageYOffset != null) window.pageYOffset = y;
            if (document.body.scrollTop != null) document.body.scrollTop = y;
        },

        _reload: function(item){
            console.log('reload ' +  item.url);
            var self = this;
            if(item.type == 'css'){
                self._reloadCss();
            }else if(['js', 'html'].indexOf(item.type) >= 0){
                self._reloadPage();
            }
        },

        _reloadCss: function(){
            var cssLinks = Utils.toArr(document.querySelectorAll('link[href*=".css"]')),
                timeStamp = (new Date())-0;

            cssLinks.forEach(function(item){
                item.setAttribute('href', item.getAttribute('href'));
            });
        },

        _reloadPage: function(){
            var y = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            document.cookie = '__LiveRloadScrollY' + "=" + y;
            location.reload();
        }
    };

    LiveReload.init();

})(window);