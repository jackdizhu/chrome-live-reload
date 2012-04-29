/**
 * description: live reload background run init
 * author: rehorn@vip.qq.com
 * date: 2012-04-22
 */(function(a,b){var c=a.LiveReloadSetting,d=a.LiveReloadWatcher,e={_tabStatus:{},_res:{iconOn:"images/livereload-19.png",iconOff:"images/livereload-off-19.png",settingScript:"js/livereload-setting.js",injectScript:"js/livereload-inject.js",injectCss:"css/inject.css"},init:function(){console.log("LiveRload init start"),this.initEvents()},initEvents:function(){console.log("LiveRload initEvents");var a=this,b={injectScript:function(b){console.log("injectScript"),chrome.tabs.executeScript(b.id,{code:"var _setting = "+JSON.stringify(c.getOption())+";"}),chrome.tabs.executeScript(b.id,{file:a._res.injectScript}),chrome.tabs.insertCSS(b.id,{file:a._res.injectCss})},enableLiveReload:function(b){chrome.tabs.sendRequest(b.id,{action:"startLiveReload"}),chrome.browserAction.setIcon({tabId:b.id,path:a._res.iconOn}),a._tabStatus[b.id]=!0,c.addLiveList(b.url),console.log("enable reload tab "+b.id)},disableLiveReload:function(b){d.remove(b.id),chrome.browserAction.setIcon({tabId:b.id,path:a._res.iconOff}),a._tabStatus[b.id]=!1,c.removeLiveList(b.url),console.log("disable reload tab "+b.id)},onBrowserActionClicked:function(c){a._tabStatus[c.id]?b.disableLiveReload(c):b.enableLiveReload(c)},onExtRequest:function(b,c,e){b.action&&b.action==="initWatchList"&&(console.log("Request initWatchList"),d.add(c.tab.id,b.data,function(b){a.fireRload(c.tab.id,b),console.log("tab"+c.tab.id+" have changed")}),e("livereload initWatchList ok"))},onTabUpdated:function(a,d,e){if(e.url.indexOf("chrome://")!=-1||e.url.indexOf("chrome-devtools://")!=-1||e.url.indexOf("chrome-extension://")!=-1||e.url.indexOf("view-source:")!=-1)return!1;d.status==="complete"&&(console.log("complete"),b.injectScript(e),c.isUrlLive(e.url)?b.enableLiveReload(e):b.disableLiveReload(e))},onTabRemoved:function(b){a._tabStatus[b]===!0&&(d.remove(b),a._tabStatus[b]=!1)}};chrome.browserAction.onClicked.addListener(b.onBrowserActionClicked),chrome.extension.onRequest.addListener(b.onExtRequest),chrome.tabs.onUpdated.addListener(b.onTabUpdated),chrome.tabs.onRemoved.addListener(b.onTabRemoved)},fireRload:function(a,b){chrome.tabs.sendRequest(a,{action:"reload",item:b})}};e.init()})(window);