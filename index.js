// dependencies: jQuery
// license : public domain

// note to self: new fancy native array methods:
// forEach
// map
// filter
// reduce
// every
// some

if (typeof(module) == "undefined") var module = {}
var gl519 = module.exports = (function () {
var _ = {}

_.has = function (o, k) {
    return o.hasOwnProperty(k)
}

_.identity = function (e) { return e }

_.each = function (o, func) {
    if (!func) func = _.identity
    if (o instanceof Array) {
        for (var i = 0; i < o.length; i++)
            if (func(o[i], i, o) == false)
                break
    } else {
        for (var k in o)
            if (o.hasOwnProperty(k))
                if (func(o[k], k, o) == false)
                    break
    }
}

_.map = function (o, func) {
    if (!func) func = _.identity
    if (o instanceof Array) {
        var accum = []
        for (var i = 0; i < o.length; i++)
            accum[i] = func(o[i], i, o)
        return accum
    } else {
        var accum = {}
        for (var k in o)
            if (o.hasOwnProperty(k))
                accum[k] = func(o[k], k, o)
        return accum
    }
}

_.filter = function (o, func) {
    if (!func) func = _.identity
    if (o instanceof Array) {
        var accum = []
        for (var i = 0; i < o.length; i++)
            if (func(o[i], i, o))
                accum.push(o[i])
        return accum
    } else {
        var accum = {}
        for (var k in o)
            if (o.hasOwnProperty(k))
                if (func(o[k], k, o))
                    accum[k] = o[k]
        return accum
    }
}

_.reduce = _.fold = function (o, func, init) {
    if (!func) func = _.identity
    var accum = init
    _.each(o, function (v, k) {
        if (accum === undefined)
            accum = v
        else
            accum = func(accum, v, k, o)
    })
    return accum
}

_.some = _.any = function (o, func) {
    if (!func) func = _.identity
    var found = false
    _.each(o, function (v, k) {
        if (func(v, k, o)) {
            found = true
            return false
        }
    })
    return found
}

_.every = _.all = function (o, func) {
    if (!func) func = _.identity
    var allGood = true
    _.each(o, function (v, k) {
        if (!func(v, k, o)) {
            allGood = false
            return false
        }
    })
    return allGood
}

_.min = function (o, func) {
    if (!func) func = _.identity
    var bestScore = null
    var best = null
    _.each(o, function (v, k) {
        var score = func(v, k, o)
        if (bestScore === null || score < bestScore) {
            bestScore = score
            best = v
        }
    })
    return best
}

_.max = function (o, func) {
    if (!func) func = _.identity
    var bestScore = null
    var best = null
    _.each(o, function (v, k) {
        var score = func(v, k, o)
        if (bestScore === null || score > bestScore) {
            bestScore = score
            best = v
        }
    })
    return best
}

_.find = function (o, func) {
    if (!func) func = _.identity
    var found = null
    _.each(o, function (v, k) {
        if (func(v, k, o)) {
            found = v
            return false
        }
    })
    return found
}

_.range = function (start, stop, step) {
    if (stop == null) return _.range(0, start)
    if (step == null) step = 1
    var r = []
    for (var i = start; i < stop; i += step) {
        r.push(i)
    }
    return r
}

_.size = function (o) {
    if (o instanceof Array)
        return o.length
    return _.keys(o).length
}

_.deepEquals = function (a, b) {
    if (typeof(a) != typeof(b)) return false
    if (typeof(a) == 'object') {
        return _.size(a) == _.size(b) && _.all(a, function (v, k) {
            return _.has(b, k) && _.deepEquals(b[k], v)
        })
    } else {
        return a == b
    }
}

_.keys = function (o) {
    return Object.keys(o)
}

_.values = function (o) {
    var accum = []
    _.each(o, function (e) {
        accum.push(e)
    })
    return accum
}

_.merge = _.extend = function (o, that) {
    _.each(that, function (v, k) {
        o[k] = v
    })
    return o
}

_.clone = function (o) {
    if (o instanceof Array) {
        return o.slice(0)
    } else {
        return _.merge({}, o)
    }
}

_.deepClone = _.cloneDeep = function (o) {
    return _.map(o, function (v) {
        if (typeof(v) == 'object') {
            return _.cloneDeep(v)
        }
        return v
    })
}

_.pairs = function (o) {
    var accum = []
    _.each(o, function (v, k) {
        accum.push([k, v])
    })
    return accum
}

_.object = _.unPairs = function (a, b) {
    var accum = {}
    if (b) {
        _.each(a, function (k, i) {
            accum[k] = b[i]
        })
    } else {
        _.each(a, function (e) {
            accum[e[0]] = e[1]
        })
    }
    return accum
}

_.pick = function (o) {
    var accum = {}
    for (var i = 1; i < arguments.length; i++) {
        var k = arguments[i]
        if (_.has(o, k)) accum[k] = o[k]
    }
    return accum
}

_.omit = function (o) {
    var omits = _.makeSet(_.toArray(arguments).slice(1))
    var accum = {}
    _.each(o, function (v, k) {
        if (!_.has(omits, k))
            accum[k] = v
    })
    return accum
}

_.setAdd = function (s, key) {
    if (!_.has(s, key) || !s[key])
        return s[key] = true
    return false
}

_.makeSet = function (a) {
    var s = {}
    _.each(a, function (e) {
        s[e] = true
    })
    return s
}

_.inSet = function (s, x) {
    return _.has(s, x) && s[x]
}

_.setSub = function (a, b) {
    var c = {}
    _.each(a, function (v, k) {
        if (!_.inSet(b, k))
            c[k] = v
    })
    return c
}

_.bagAdd = function (bag, key, amount) {
    if (amount == null) amount = 1
    if (!_.has(bag, key))
        bag[key] = 0
    bag[key] += amount
    return bag[key]
}

_.lerp = function (t0, v0, t1, v1, t) {
    return (t - t0) * (v1 - v0) / (t1 - t0) + v0
}

_.lerpCap = function (t0, v0, t1, v1, t) {
    var v = (t - t0) * (v1 - v0) / (t1 - t0) + v0
    if (v0 < v1) {
        if (v < v0) v = v0
        else if (v > v1) v = v1
    } else {
        if (v > v0) v = v0
        else if (v < v1) v = v1
    }
    return v
}

_.time = function () {
    return new Date().getTime()
}

_.trim = function (s) {
    return s.replace(/^\s+|\s+$/g,"")
}

_.lines = function (s) {
    return s.split(/\r\n|\r|\n/)
}

_.sum = function (a) {
    return _.fold(a, function (a, b) { return a + b }, 0)
}

_.sample = function (o) {
    if (o instanceof Array)
        return o[Math.floor(o.length * Math.random())]
    else
        return _.sample(_.values(o))
}

_.shuffle = function (a) {
    for (var i = 0; i < a.length; i++) {
        var ri = Math.floor(a.length * Math.random())
        var temp = a[i]
        a[i] = a[ri]
        a[ri] = temp
    }
    return a
}

_.randomInt = _.randomInteger = _.randomIndex = function (a, b) {
    if (b === undefined)
        return Math.floor(a * Math.random())
    else
        return a + _.randomInt(b - a)
}

_.randomString = function (len, re) {
    re = re || /[a-zA-Z0-9]/
    var chars = []
    for (var i = 0; i < 256; i++) {
        var c = String.fromCharCode(i)
        if (c.match(re)) chars.push(c)
    }
    var ret = []
    for (var i = 0; i < len; i++) {
        ret.push(chars[Math.floor(Math.random() * chars.length)])
    }
    return ret.join('')
}

_.sort = _.sortBy = function (a, func, desc) {
    if (!func) func = _.identity
    return _.map(_.map(a, function (e, i) {
        return {
            v : e,
            f : func(e, i)
        }
    }).sort(function (a, b) {
        if (a.f < b.f) return desc ? 1 : -1
        if (a.f > b.f) return desc ? -1 : 1
        return 0
    }), function (e) { return e.v })
}

_.sortDesc = function (a, func) {
    return _.sort(a, func, true)
}

_.toArray = function (a) {
    return Array.prototype.slice.call(a)
    // var accum = []
    // for (var i = 0; i < a.length; i++)
    //     accum[i] = a[i]
    // return accum
}

_.ensure = function () {
    if (arguments.length <= 3) {
        if (!(arguments[1] in arguments[0])) {
            arguments[0][arguments[1]] = arguments[2]
        }
        return arguments[0][arguments[1]]
    }
    var args = _.toArray(arguments)
    var prev = _.ensure.apply(null, args.slice(0, 2).concat([typeof(args[2]) == "string" ? {} : []]))
    return _.ensure.apply(null, [prev].concat(args.slice(2)))
}

_.escapeUnicodeChar = function (c) {
    var code = c.charCodeAt(0)
    var hex = code.toString(16)
    if (code < 16) return '\\u000' + hex
    if (code < 256) return '\\u00' + hex
    if (code < 4096) return '\\u0' + hex
    return '\\u' + hex
}

_.escapeString = function (s) {
    return s.
        replace(/\\/g, '\\\\').
        replace(/\t/g, '\\t').
        replace(/\n/g, '\\n').
        replace(/\r/g, '\\r').
        replace(/'/g, '\\\'').
        replace(/"/g, '\\\"').
        replace(/[\u0000-\u001F]|[\u0080-\uFFFF]/g, _.escapeUnicodeChar)
}

_.escapeRegExp = function (s) {
    return _.escapeString(s).replace(/([\{\}\(\)\|\[\]\^\$\.\*\+\?])/g, "\\$1")
}

_.escapeUrl = function (s) {
    return encodeURIComponent(s)
}

_.unescapeUrl = function (s) {
    return decodeURIComponent(s.replace(/\+/g, "%20"))
}

_.escapeXml = function (s) {
    s = s.replace(/&/g, "&amp;")
    s = s.replace(/</g, "&lt;").
        replace(/>/g, "&gt;").
        replace(/'/g, "&apos;").
        replace(/"/g, "&quot;").
//            replace(/[\u0000-\u001F]|[\u0080-\uFFFF]/g, function (c) {
        replace(/[\u0080-\uFFFF]/g, function (c) {
            var code = c.charCodeAt(0)
            return '&#' + code + ';'
            // if we want hex:
            var hex = code.toString(16)
            return '&#x' + hex + ';'
        })
    return s;
}

_.unescapeXml = function (s) {
    return s.replace(/&[^;]+;/g, function (s) {
        switch(s.substring(1, s.length - 1)) {
            case "amp":  return "&";
            case "lt":   return "<";
            case "gt":   return ">";
            case "apos": return "'";
            case "quot": return '"';
            default:
                if (s.charAt(1) == "#") {
                    if (s.charAt(2) == "x") {
                        return String.fromCharCode(parseInt(s.substring(3, s.length - 1), 16));
                    } else {
                        return String.fromCharCode(parseInt(s.substring(2, s.length - 1)));
                    }
                } else {
                    throw "unknown XML escape sequence: " + s
                }
        }
    })
}

_.getUrlParams = function (url) {
    if (url === undefined) {
        url = window.location.href
    }
    var params = {}
    var m = url.match(/\?([^#]+)/)
    if (m) {
        _.each(m[1].split(/&/), function (m) {
            if (m.length > 0) {
                var a = m.split(/=/)
                params[_.unescapeUrl(a[0])] = a.length > 1 ? _.unescapeUrl(a[1]) : true
            }
        })
    }
    return params
}

_.splitSizeHelper = function (prefix, size) {
    if (size == null) return ""
    if (size <= 1) return prefix + '="' + Math.round(100 * size) + '%"'
    return prefix + '="' + size + 'px"'
}

_.splitHorz = function (aSize, bSize, a, b, fill) {
    if (fill === undefined) fill = true
    aSize = _.splitSizeHelper('width', aSize)
    bSize = _.splitSizeHelper('width', bSize)
    var t = $('<table ' + (fill ? 'style="width:100%;height:100%"' : '') + '><tr valign="top"><td class="a" ' + aSize + '></td><td class="b" ' + bSize + '></td></tr></table>')
    // don't do this:
    // t.find('.a').append(a)
    // t.find('.b').append(b)
    var _a = t.find('.a')
    var _b = t.find('.b')
    _a.append(a)
    _b.append(b)
    return t
}

_.splitVert = function (aSize, bSize, a, b, fill) {
    if (fill === undefined) fill = true
    aSize = _.splitSizeHelper('height', aSize)
    bSize = _.splitSizeHelper('height', bSize)
    var t = $('<table ' + (fill ? 'style="width:100%;height:100%"' : '') + '><tr valign="top"><td class="a" ' + aSize + '></td></tr><tr valign="top"><td class="b" ' + bSize + '></td></tr></table>')
    // don't do this:
    // t.find('.a').append(a)
    // t.find('.b').append(b)
    var _a = t.find('.a')
    var _b = t.find('.b')
    _a.append(a)
    _b.append(b)
    return t
}

_.dialog = function (content) {
    var win = $(window)
    var w = win.width()
    var h = win.height()
    
    var b
    $('body').append(b = $('<div style="position:fixed;left:0px;top:0px; z-index:10000;background:black;opacity:0.5"/>').width(w).height(h))
    
    var d = $('<div style="position:fixed;z-index:20000;background:white"/>').append(content)
    $('body').append(d)
    setTimeout(function () {
        var w = window.innerWidth
        var h = window.innerHeight
        d.css({
            left : Math.round(w / 2 - d.width() / 2) + "px",
            top : Math.round(h / 2 - d.height() / 2) + "px"
        })
    }, 0)
    
    _.closeDialog = function () {
        b.remove()
        d.remove()
    }
}

_.decycle = function(o) {
    var rootKey = "root_" + Math.round(Math.random() * 1000)
    var uniqueObj = {}
    while (true) {
        try {
            var objs = []
            function helper(o, path) {
                if (typeof(o) == "string" && o.slice(0, rootKey.length) == rootKey)
                    throw "bad root key"
                if (typeof(o) == "object" && o) {
                    if (typeof(o[rootKey]) == "object" && o[rootKey].uniqueObj == uniqueObj) {
                        return o[rootKey].path
                    } else {
                        if (rootKey in o)
                            throw "bad root key"
                        var oo = (o instanceof Array) ? [] : {}
                        o[rootKey] = {
                            uniqueObj : uniqueObj,
                            path : path,
                            newObj : oo
                        }
                        objs.push(o)
                        return oo
                    }
                }
                return o
            }
            function helper2(o) {
                var oo = o[rootKey].newObj
                var path = o[rootKey].path
                if (o instanceof Array) {
                    for (var i = 0; i < o.length; i++) {
                        oo[i] = helper(o[i], path + '[' + i + ']')
                    }
                } else {
                    for (k in o) {
                        if (k != rootKey) {
                            oo[k] = helper(o[k], path + '[' + JSON.stringify(k) + ']')
                        }
                    }
                }
            }
            function cleanup() {
                for (var i = 0; i < objs.length; i++) {
                    delete objs[i][rootKey]
                }
            }
            
            var ret = {}
            ret.cycle_root = rootKey
            ret[rootKey] = helper(o, rootKey)
            for (var i = 0; i < objs.length; i++) {
                helper2(objs[i])
            }
            cleanup()
            return ret
        } catch (e) {
            cleanup()
            if (e == "bad root key") {
                rootKey += Math.round(Math.random() * 1000)
            } else {
                throw e
            }
        }
    }
}

_.recycle = function (obj) {
    // regex adapted from https://github.com/douglascrockford/JSON-js/blob/master/cycle.js
    var r = /^root(?:_\d+)?(?:\[(?:\d+|\"(?:[^\\\"\u0000-\u001f]|\\([\\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*\")\])*$/
    
    if (!obj.cycle_root || !(obj.cycle_root in obj))
        throw "doesn't look recycle-able"
    
    var rootKey = obj.cycle_root
    function helper(o) {
        if (typeof(o) == "string" && o.slice(0, rootKey.length) == rootKey) {
            if (!o.match(r)) throw "I'm afraid to eval: " + o
            with (obj) {
                return eval(o)
            }
        }
        if (typeof(o) == "object" && o) {
            if (o instanceof Array) {
                for (var i = 0; i < o.length; i++) {
                    o[i] = helper(o[i])
                }
            } else {
                for (var k in o) {
                    o[k] = helper(o[k])
                }
            }
        }
        return o
    }
    return helper(obj[rootKey])
}

_.json = function (x, pretty) {
    try {
        return JSON.stringify(x, null, pretty === true ? "    " : pretty)
    } catch (e) {
        return _.json(_.decycle(x), pretty)
    }
}

_.unJson = function (s) {
    var o = JSON.parse(s)
    try {
        return _.recycle(o)
    } catch (e) {
        return o
    }
}

// node.js stuff

_.serveOnExpress = function (express, app) {
    app.use('/gl519', express.static(__dirname))
}

_.read = _.slurp = function (f) {
    return '' + require('fs').readFileSync(f)
}

_.write = _.save = function (f, s) {
    require('fs').writeFileSync(f, s)
}

_.print = function (o) {
    if (arguments.length > 1) {
        for (var i = 0; i < arguments.length; i++)
            _.print(arguments[i])
        return
    }
    if (typeof(o) == 'object') {
        console.log(_.json(o, true))
    } else {
        console.log(o)
    }
}

_.exit = function () {
    process.exit(1)
}

_.md5 = function (s) {
    return require('crypto').createHash('md5').update(s).digest("hex")    
}

_.run = function (f, x) {
    var Fiber = require('fibers')
    var c = Fiber.current
    if (c) c.yielding = true
    if (typeof(f) == 'function')
        var ret = Fiber(f).run(x)
    else
        if (f != c && f.started && !f.yielding)
            var ret = f.run(x)
    if (c) c.yielding = false
    return ret
}

_.yield = function (x) {
    var Fiber = require('fibers')
    return Fiber.yield(x)
}

_.p = _.promise = function () {
    var Fiber = require('fibers')
    var f = Fiber.current
    if (!f.promise) {
        f.promise = "waiting"
        return function () {
            if (arguments.length <= 1) {
                var arg = arguments[0]
                if (arg instanceof Error)
                    f.promise = { err : arg }
                else
                    f.promise = { val : arg }
            } else {
                f.promise = {
                    err : arguments[0],
                    val : arguments[1]
                }
            }
            _.run(f)
        }
    } else {
        while (f.promise == "waiting") _.yield()
        var p = f.promise 
        delete f.promise
        if (p.err) throw p.err
        return p.val
    }
}

_.parallel = function (funcs) {
    var set = _.p()
    var remaining = funcs.length
    _.each(funcs, function (f) {
        _.run(function () {
            f()
            remaining--
            if (remaining <= 0) set()
        })
    })
    if (remaining <= 0) set()
    return _.p()
}

_.consume = function (input, encoding) {
    if (encoding == 'stream') return input
        
    var chunks = []
    if (encoding != 'buffer') {
        input.setEncoding(encoding || 'utf8')
    }
    
    var p = _.p()
    input.on('data', function (chunk) {
        chunks.push(chunk)
    })
    input.on('end', function () {
        if (encoding == 'buffer') {
            p(Buffer.concat(chunks))
        } else {
            p(chunks.join(''))
        }
    })
    return _.p()
}

_.wget = function (method, url, params, encoding) {
    if (method && method.match(/:/)) {
        return _.wget(null, arguments[0], arguments[1], arguments[2])
    }
    
    url = require('url').parse(url)
    
    var o = {
        method : method || (params ? 'POST' : 'GET'),
        hostname : url.hostname,
        path : url.path
    }
    if (url.port) o.port = url.port
    if (url.auth) o.auth = url.auth

    o.headers = {}
    o.headers["User-Agent"] = "gl519/1.0"
    if (!o.method.match(/^get$/i)) {
        if (!params) {
            var data = ""
        } else if (typeof(params) == 'string') {
            var data = params
        } else {
            var data = _.values(_.map(params, function (v, k) { return k + "=" + encodeURIComponent(v) })).join('&')
        }
        o.headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8"
        o.headers["Content-Length"] = Buffer.byteLength(data, 'utf8')
    }
    
    var r = require(url.protocol.replace(/:/, '')).request(o, _.p())
    if (data)
        r.end(data, 'utf8')
    else
        r.end()
    var res = _.p()
    var ret = _.consume(res, encoding)
    _.wget.res = res
    return ret
}

return _
})();
if (typeof(_) == "undefined") var _ = gl519
