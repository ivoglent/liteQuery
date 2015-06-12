/**
 * Created by Ivoglent Nguyen.
 * Contact : ivoglent@gmail.com
 * File: liteQuery.js
 * Date: 6/12/2015
 * Time: 9:51 PM
 * ------------------------------------------------------------------------------------------------------
 * This is minimum script that help to access DOM elements and events
 * It's useful for some times we can not use larger javascript libraries, like jQuery
 * I did not found any completed script for this purpose, so i decided writing it by myself. Just use for me now
 * Temporary called liteQuery
 * Base on basic javascript
 * Tested on chrome, firefox and IE 11
 */
'use strict';
(function (window, document) {
    function liteQueryException(message) {
        this.message = message;
        this.name = "liteQueryException";
    }
    function liteQuery(e) {
        this.methods = ['val', 'html', 'attr', 'css', 'hide', 'show', 'position', 'offset', 'bind', 'on', 'addClass', 'removeClass', 'child'];
        this.bind = function (event, func, element) {
            var self;
            if (element)
                self = element;
            else self = this;
            if (this.isNodeList(self)) {
                for (i = 0; i < self.length; i++) {
                    if (self[i].addEventListener) {
                        self[i].addEventListener(event,func, false);
                    } else {
                        self[i].attachEvent('on' + event,func);
                    }
                }
            }
            else if (self.addEventListener) {
                self.addEventListener(event, func, false);
            } else {
                self.attachEvent('on' + event,func);
            }
            return self;
        }
        this.bindMethods = function (obj) {
            if (obj == null || typeof (obj) == 'undefined') return;
            for (var k in this.methods) {
                try {
                    obj[this.methods[k]] = this[this.methods[k]];
                }
                catch (e) {
                    console.log(e);
                    continue;
                }
            }
            return obj;

        };
        this.isNodeList = function (o) {
            var type = Object.prototype.toString.call(o);
            return (typeof (o) == 'object' && (type == '[object HTMLCollection]' || type == '[object NodeList]' || type == '[object Object]'));
        }
        if (e)
            return this.e(e);

    }

    liteQuery.prototype.ready = function (func) {
        if (window.addEventListener) {
            window.addEventListener('load', func, false); // NB **not** 'onload'
        }
        else if (window.attachEvent) // Microsoft
        {
            window.attachEvent('onload', func);
        }
    }
    liteQuery.prototype.query = function (e) {
        if(typeof (e)=='undefined') return this;
        if (typeof (e) == 'object') return _$.bindMethods(e);
        if (e.substring(0, 1) == "#")
            return _$.id(e.replace('#', ''));
        else if (e.substring(0, 1) == ".")
            return _$.clss(e.replace('.', ''));
        else {
            return _$.tag(e);
        }
    };
    liteQuery.prototype.id = function (id) {
        var obj = document.getElementById(id);
        if(typeof (obj)!='undefined')
            return this.bindMethods(obj);
    };
    liteQuery.prototype.clss = function (_class) {
        var objs = document.getElementsByClassName(_class);
        for (var i in objs) {
            this.bindMethods(objs[i]);
        }
        if (objs.length == 1)
            return objs[0];
        return objs;
    }
    liteQuery.prototype.tag = function (_tag) {
        var objs = document.getElementsByTagName(_tag);
        for (var i in objs) {
           this.bindMethods(objs[i]);
        }
        objs = this.bindMethods(objs);
        if (objs.length == 1)
            return objs[0];
        return objs;
    }
    liteQuery.prototype.val = function (val) {
        if (val) {
            this.value = val;
            return this;
        }
        else return this.value;
    }
    liteQuery.prototype.html = function (html) {
        if (_$.isNodeList(this)) {
            throw new liteQueryException('Can not get or set HTML for a node list');
        }
        else {
            if (html) {
                this.innerHTML = html;
                return this;
            }
            else return this.innerHTML;
        }
    }
    liteQuery.prototype.attr = function (attr, val) {
        if (_$.isNodeList(this)) {
            for (var o in this)
                this[o].setAttribute(attr, val);
        }
        else {
            if (val){
                this.setAttribute(attr, val);
                return this;
            }
            return this.getAttribute(attr);
        }
    }
    liteQuery.prototype.hide = function () {
        if (_$.isNodeList(this)) {
            for (var o in this)
                this[o].style.display = 'none';
        }
        else
            this.style.display = 'none';
        return this;
    }
    liteQuery.prototype.show = function () {
        if (_$.isNodeList(this)) {
            for (var o in this)
                    this[o].style.display = 'block';
        }
        else
            this.style.display = 'block';
        return this;
    }
    liteQuery.prototype.position = function (pos) {
        if (pos)
            if (typeof (pos) == 'object') {
                this.style.top = pos.top;
                this.style.left = pos.left;
            }
            else
                return;
        return {top: this.style.top, left: this.style.left};
    }
    liteQuery.prototype.offset = function (offset) {
        if (offset)
            if (typeof (offset) == 'object') {
                this.offsetLeft = offset.left;
                this.offsetTop = offset.top;
            }
            else return;
        else
            return {top: this.offsetTop, left: this.offsetLeft};
    }
    liteQuery.prototype.css = function (name, val) {
        if (val) {
            this.style[name] = val;
            return this;
        }
        if (typeof (name) == 'object') {
            for (var key in name) {
                this.style[key] = name[key];
            }
            return this;
        }
        else {
            return this.style[name];
        }

    }
    liteQuery.prototype.addClass = function (_class) {
        if (_$.isNodeList(this)) {
            for (var o in this)
                    this[o].classList.add(_class);
        }
        else
            this.classList.add(_class);
        return this;
    }
    liteQuery.prototype.removeClass = function (_class) {
        try {
            if (_$.isNodeList(this)) {
                for (var o in this)
                        this[o].classList.remove(_class);
            }
            else
                this.classList.remove(_class);
        }
        catch (e) {

        }
        return this;
    }
    liteQuery.prototype.child = function (v) {
        var objs = null;
        if (v.substring(0, 1) == "#")
            objs = _$.id(v.replace('#', ''));
        else
            objs = this.clss(v.replace('.', ''));
        if (_$.isNodeList(objs)) {
            for (i = 0; i < objs.length; i++) {
                objs[i] = _$.bindMethods(objs[i]);
            }
            objs = _$.bindMethods(objs);
            if (objs.length == 1)
                return objs[0];
            return objs;
        }
        else {
            return _$.bindMethods(objs);
        }
    }
    liteQuery.prototype.first = function () {
        if (this.length > 0)
            return this[0];
        return null;
    }
    liteQuery.prototype.on = function (event, func) {
        if (_$.isNodeList(this))
            for (var o in this) {
                    _$.bind(event, func, this[o]);
            }
        else
            _$.bind(event, func, this);
    };
    /*
     *Cookie
     */
    function Cookie() {

    }
    Cookie.prototype.get= function (c_name) {
        var c_value = d.cookie;
        var c_start = c_value.indexOf(" " + c_name + "=");
        if (c_start == -1) {
            c_start = c_value.indexOf(c_name + "=");
        }
        if (c_start == -1) {
            c_value = null;
        }
        else {
            c_start = c_value.indexOf("=", c_start) + 1;
            var c_end = c_value.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = c_value.length;
            }
            c_value = unescape(c_value.substring(c_start, c_end));
        }
        return c_value;
    }
    Cookie.prototype.set= function (c_name, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        d.cookie = c_name + "=" + c_value;
    }
    liteQuery.cookie=new Cookie();

    /*
     * For HTTP Request
     */
    function Http(){
        this.send= function (url, data, callback) {
            var XMLHttpFactories = [
                function () {
                    return new XMLHttpRequest()
                },
                function () {
                    return new ActiveXObject("Msxml2.XMLHTTP")
                },
                function () {
                    return new ActiveXObject("Msxml3.XMLHTTP")
                },
                function () {
                    return new ActiveXObject("Microsoft.XMLHTTP")
                }
            ]
            var req = false;
            for (var i = 0; i < XMLHttpFactories.length; i++) {
                try {
                    req = XMLHttpFactories[i]();
                }
                catch (e) {
                    continue;

                }
                break;
            }
            if (req) {
                var method = (data) ? "POST" : "GET";
                req.open(method, url, false);
                if (data)
                    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                req.onreadystatechange = function () {
                    if (req.readyState != 4) return;
                    if (req.status != 200 && req.status != 304) {
                        return;
                    }

                    var result = null;
                    try {
                        result = JSON.parse(req.responseText);
                    }
                    catch (e) {
                        result = req.responseText;
                    }
                    if (callback && typeof (callback == 'function'))
                        callback(result);
                    return result;
                }
                if (req.readyState == 4) return false;
                req.send(data);
            }

        }
    }
    Http.prototype.get= function (url, callback) {
        return this.send(url, false, callback);
    }
    Http.prototype.post= function (url, data, callback) {
        return this.send(url, data, callback);
    }
    liteQuery.prototype.http = new Http();
    /*
     * Utitils
     * More methods
     *
     */
    liteQuery.prototype.merge= function (first, second) {
        var l = second.length,
            i = first.length,
            j = 0;

        if (typeof l === "number") {
            for (; j < l; j++) {
                first[i++] = second[j];
            }
        } else {
            while (second[j] !== undefined) {
                first[i++] = second[j++];
            }
        }

        first.length = i;

        return first;
    }
    liteQuery.prototype.isNum= function (obj) {
        return !isNaN(parseFloat(obj)) && isFinite(obj);
    }
    liteQuery.prototype.typeOf= function (obj) {
        if (obj == null) {
            return String(obj);
        }
        return typeof obj === "object" || typeof obj === "function" ?
        class2type[razd.core_toString.call(obj)] || "object" :
            typeof obj;
    }
    liteQuery.prototype.empty= function (obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    }
    liteQuery.prototype.serialize= function (obj, prefix) {
        var str = [];
        for (var p in obj) {
            var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
            str.push(typeof v == "object" ?
                serialize(v, k) :
            encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
        return str.join("&");
    }
    /*
     * Create new instance
     * and merge with current jQuery if it existed
     */
    window._$ =window.litequery=new liteQuery();
    if(typeof (jQuery)=='undefined') {
        window.$ = _$.query;
    }
})(window, document);