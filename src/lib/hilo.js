/**
 * Hilo 1.3.0 for standalone
 * Copyright 2016 alibaba.com
 * Licensed under the MIT License
 */
! function (t) {
  t.Hilo || (t.Hilo = {});
  var e = function () {
    var e = navigator.userAgent,
      i = document,
      n = t,
      r = i.documentElement,
      a = {
        iphone: /iphone/i.test(e),
        ipad: /ipad/i.test(e),
        ipod: /ipod/i.test(e),
        ios: /iphone|ipad|ipod/i.test(e),
        android: /android/i.test(e),
        webkit: /webkit/i.test(e),
        chrome: /chrome/i.test(e),
        safari: /safari/i.test(e),
        firefox: /firefox/i.test(e),
        ie: /msie/i.test(e),
        opera: /opera/i.test(e),
        supportTouch: "ontouchstart" in n,
        supportCanvas: null != i.createElement("canvas").getContext,
        supportStorage: !1,
        supportOrientation: "orientation" in n || "orientation" in n.screen,
        supportDeviceMotion: "ondevicemotion" in n
      };
    try {
      var o = "hilo";
      localStorage.setItem(o, o), localStorage.removeItem(o), a.supportStorage = !0
    } catch (s) {}
    var l = a.jsVendor = a.webkit ? "webkit" : a.firefox ? "webkit" : a.opera ? "o" : a.ie ? "ms" : "",
      h = a.cssVendor = "-" + l + "-",
      c = i.createElement("div"),
      u = c.style,
      d = void 0 != u[l + "Transform"],
      f = void 0 != u[l + "Perspective"];
    f && (c.id = "test3d", u = i.createElement("style"), u.textContent = "@media (" + h + "transform-3d){#test3d{height:3px}}", i.head.appendChild(u), r.appendChild(c), f = 3 == c.offsetHeight, i.head.removeChild(u), r.removeChild(c)), a.supportTransform = d, a.supportTransform3D = f;
    var p = a.supportTouch,
      v = p ? "touchstart" : "mousedown",
      m = p ? "touchmove" : "mousemove",
      g = p ? "touchend" : "mouseup";
    return a.POINTER_START = v, a.POINTER_MOVE = m, a.POINTER_END = g, a
  }();
  t.Hilo.browser = e
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = {
    copy: function (t, e, i) {
      for (var n in e) i && !t.hasOwnProperty(n) && void 0 === t[n] || (t[n] = e[n]);
      return t
    }
  };
  t.Hilo.util = e
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo.browser,
    i = t.Hilo.util,
    n = t,
    r = document,
    a = r.documentElement,
    o = 0,
    s = {},
    l = {
      version: "1.3.0",
      getUid: function (t) {
        var e = ++o;
        if (t) {
          var i = t.charCodeAt(t.length - 1);
          return i >= 48 && i <= 57 && (t += "_"), t + e
        }
        return e
      },
      viewToString: function (t) {
        for (var e, i = t; i;) e = e ? i.id + "." + e : i.id, i = i.parent;
        return e
      },
      copy: function (t, e, n) {
        return i.copy(t, e, n), s.copy || (s.copy = !0, console.warn("Hilo.copy has been Deprecated! Use Hilo.util.copy instead.")), t
      },
      browser: e,
      event: {
        POINTER_START: e.POINTER_START,
        POINTER_MOVE: e.POINTER_MOVE,
        POINTER_END: e.POINTER_END
      },
      align: {
        TOP_LEFT: "TL",
        TOP: "T",
        TOP_RIGHT: "TR",
        LEFT: "L",
        CENTER: "C",
        RIGHT: "R",
        BOTTOM_LEFT: "BL",
        BOTTOM: "B",
        BOTTOM_RIGHT: "BR"
      },
      getElementRect: function (t) {
        var e;
        try {
          e = t.getBoundingClientRect()
        } catch (i) {
          e = {
            top: t.offsetTop,
            left: t.offsetLeft,
            right: t.offsetLeft + t.offsetWidth,
            bottom: t.offsetTop + t.offsetHeight
          }
        }
        var r = (n.pageXOffset || a.scrollLeft) - (a.clientLeft || 0) || 0,
          o = (n.pageYOffset || a.scrollTop) - (a.clientTop || 0) || 0,
          s = n.getComputedStyle ? getComputedStyle(t) : t.currentStyle,
          l = parseInt,
          h = l(s.paddingLeft) + l(s.borderLeftWidth) || 0,
          c = l(s.paddingTop) + l(s.borderTopWidth) || 0,
          u = l(s.paddingRight) + l(s.borderRightWidth) || 0,
          d = l(s.paddingBottom) + l(s.borderBottomWidth) || 0,
          f = e.top || 0,
          p = e.left || 0,
          v = e.right || 0,
          m = e.bottom || 0;
        return {
          left: p + r + h,
          top: f + o + c,
          width: v - u - p - h,
          height: m - d - f - c
        }
      },
      createElement: function (t, e) {
        var i, n, a, o = r.createElement(t);
        for (i in e)
          if (n = e[i], "style" === i)
            for (a in n) o.style[a] = n[a];
          else o[i] = n;
        return o
      },
      getElement: function (t) {
        return r.getElementById(t)
      },
      setElementStyleByView: function (t) {
        var e = t.drawable,
          i = e.domElement.style,
          n = t._stateCache || (t._stateCache = {}),
          r = l.browser.jsVendor,
          a = "px",
          o = !1;
        if (this.cacheStateIfChanged(t, ["visible"], n) && (i.display = t.visible ? "" : "none"), this.cacheStateIfChanged(t, ["alpha"], n) && (i.opacity = t.alpha), t.visible && !(t.alpha <= 0)) {
          if (this.cacheStateIfChanged(t, ["width"], n) && (i.width = t.width + a), this.cacheStateIfChanged(t, ["height"], n) && (i.height = t.height + a), this.cacheStateIfChanged(t, ["depth"], n) && (i.zIndex = t.depth + 1), t.transform) {
            var s = t.transform;
            (o = this.cacheStateIfChanged(t, ["pivotX", "pivotY"], n)) && (i[r + "TransformOrigin"] = "0 0"), i[r + "Transform"] = "matrix3d(" + s.a + ", " + s.b + ", 0, 0, " + s.c + ", " + s.d + ", 0, 0, 0, 0, 1, 0, " + s.tx + ", " + s.ty + ", 0, 1)"
          } else(o = this.cacheStateIfChanged(t, ["pivotX", "pivotY"], n)) && (i[r + "TransformOrigin"] = t.pivotX + a + " " + t.pivotY + a), (this.cacheStateIfChanged(t, ["x", "y", "rotation", "scaleX", "scaleY"], n) || o) && (i[r + "Transform"] = this.getTransformCSS(t));
          this.cacheStateIfChanged(t, ["background"], n) && (i.backgroundColor = t.background), i.pointerEvents || (i.pointerEvents = "none");
          var h = e.image;
          if (h) {
            var c = h.src;
            c !== n.image && (n.image = c, i.backgroundImage = "url(" + c + ")");
            var u = e.rect;
            if (u) {
              var d = u[0],
                f = u[1];
              d !== n.sx && (n.sx = d, i.backgroundPositionX = -d + a), f !== n.sy && (n.sy = f, i.backgroundPositionY = -f + a)
            }
          }
          var p = t.mask;
          if (p) {
            var v = p.drawable.domElement.style.backgroundImage;
            v !== n.maskImage && (n.maskImage = v, i[r + "MaskImage"] = v, i[r + "MaskRepeat"] = "no-repeat");
            var m = p.x,
              g = p.y;
            m === n.maskX && g === n.maskY || (n.maskX = m, n.maskY = g, i[r + "MaskPosition"] = m + a + " " + g + a)
          }
        }
      },
      cacheStateIfChanged: function (t, e, i) {
        var n, r, a, o, s = !1;
        for (n = 0, r = e.length; n < r; n++) a = e[n], o = t[a], o != i[a] && (i[a] = o, s = !0);
        return s
      },
      getTransformCSS: function (t) {
        var e = this.browser.supportTransform3D,
          i = e ? "3d" : "";
        return "translate" + i + "(" + (t.x - t.pivotX) + "px, " + (t.y - t.pivotY) + (e ? "px, 0px)" : "px)") + "rotate" + i + (e ? "(0, 0, 1, " : "(") + t.rotation + "deg)scale" + i + "(" + t.scaleX + ", " + t.scaleY + (e ? ", 1)" : ")")
      }
    };
  for (var h in l) t.Hilo[h] = l[h]
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = function () {
    var t, e, i = function (t) {
        t = t || {};
        var e = t.hasOwnProperty("constructor") ? t.constructor : function () {};
        return n.call(e, t), e
      },
      n = function (t) {
        var e, i, n = {};
        for (e in t) i = t[e], r.hasOwnProperty(e) ? r[e].call(this, i) : n[e] = i;
        o(this.prototype, n)
      },
      r = {
        Extends: function (t) {
          var e = this.prototype,
            i = a(t.prototype);
          o(this, t), o(i, e), i.constructor = this, this.prototype = i, this.superclass = t.prototype
        },
        Mixes: function (t) {
          t instanceof Array || (t = [t]);
          for (var e, i = this.prototype; e = t.shift();) o(i, e.prototype || e)
        },
        Statics: function (t) {
          o(this, t)
        }
      },
      a = function () {
        if (Object.__proto__) return function (t) {
          return {
            __proto__: t
          }
        };
        var t = function () {};
        return function (e) {
          return t.prototype = e, new t
        }
      }(),
      o = function (t) {
        for (var i = 1, n = arguments.length; i < n; i++) {
          var r, a = arguments[i];
          for (var o in a) {
            var s = a[o];
            !s || "object" != typeof s || void 0 === s.value && "function" != typeof s.get && "function" != typeof s.set ? t[o] = s : (r = r || {}, r[o] = s)
          }
          r && e(t, r)
        }
        return t
      };
    try {
      t = Object.defineProperty, e = Object.defineProperties, t({}, "$", {
        value: 0
      })
    } catch (s) {
      "__defineGetter__" in Object && (t = function (t, e, i) {
        return "value" in i && (t[e] = i.value), "get" in i && t.__defineGetter__(e, i.get), "set" in i && t.__defineSetter__(e, i.set), t
      }, e = function (e, i) {
        for (var n in i) i.hasOwnProperty(n) && t(e, n, i[n]);
        return e
      })
    }
    return {
      create: i,
      mix: o
    }
  }();
  t.Hilo.Class = e
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo.Class,
    i = e.create({
      constructor: function (t, e, i, n, r, a) {
        this.a = t, this.b = e, this.c = i, this.d = n, this.tx = r, this.ty = a
      },
      set: function (t, e, i, n, r, a) {
        return this.a = t, this.b = e, this.c = i, this.d = n, this.tx = r, this.ty = a, this
      },
      copy: function (t) {
        return this.a = t.a, this.b = t.b, this.c = t.c, this.d = t.d, this.tx = t.tx, this.ty = t.ty, this
      },
      clone: function () {
        return (new i).copy(this)
      },
      concat: function (t) {
        var e, i, n, r, a, o, s = arguments,
          l = this.a,
          h = this.b,
          c = this.c,
          u = this.d,
          d = this.tx,
          f = this.ty;
        return s.length >= 6 ? (e = s[0], i = s[1], n = s[2], r = s[3], a = s[4], o = s[5]) : (e = t.a, i = t.b, n = t.c, r = t.d, a = t.tx, o = t.ty), this.a = l * e + h * n, this.b = l * i + h * r, this.c = c * e + u * n, this.d = c * i + u * r, this.tx = d * e + f * n + a, this.ty = d * i + f * r + o, this
      },
      rotate: function (t) {
        var e = Math.sin(t),
          i = Math.cos(t),
          n = this.a,
          r = this.b,
          a = this.c,
          o = this.d,
          s = this.tx,
          l = this.ty;
        return this.a = n * i - r * e, this.b = n * e + r * i, this.c = a * i - o * e, this.d = a * e + o * i, this.tx = s * i - l * e, this.ty = s * e + l * i, this
      },
      scale: function (t, e) {
        return this.a *= t, this.d *= e, this.c *= t, this.b *= e, this.tx *= t, this.ty *= e, this
      },
      translate: function (t, e) {
        return this.tx += t, this.ty += e, this
      },
      identity: function () {
        return this.a = this.d = 1, this.b = this.c = this.tx = this.ty = 0, this
      },
      invert: function () {
        var t = this.a,
          e = this.b,
          i = this.c,
          n = this.d,
          r = this.tx,
          a = t * n - e * i;
        return this.a = n / a, this.b = -e / a, this.c = -i / a, this.d = t / a, this.tx = (i * this.ty - n * r) / a, this.ty = -(t * this.ty - e * r) / a, this
      },
      transformPoint: function (t, e, i) {
        var n = t.x * this.a + t.y * this.c + this.tx,
          r = t.x * this.b + t.y * this.d + this.ty;
        return e && (n = n + .5 >> 0, r = r + .5 >> 0), i ? {
          x: n,
          y: r
        } : (t.x = n, t.y = r, t)
      }
    });
  t.Hilo.Matrix = i
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo.Class,
    i = {
      _listeners: null,
      on: function (t, e, i) {
        for (var n = this._listeners = this._listeners || {}, r = n[t] = n[t] || [], a = 0, o = r.length; a < o; a++) {
          var s = r[a];
          if (s.listener === e) return
        }
        return r.push({
          listener: e,
          once: i
        }), this
      },
      off: function (t, e) {
        if (0 == arguments.length) return this._listeners = null, this;
        var i = this._listeners && this._listeners[t];
        if (i) {
          if (1 == arguments.length) return delete this._listeners[t], this;
          for (var n = 0, r = i.length; n < r; n++) {
            var a = i[n];
            if (a.listener === e) {
              i.splice(n, 1), 0 === i.length && delete this._listeners[t];
              break
            }
          }
        }
        return this
      },
      fire: function (t, e) {
        var i, r;
        "string" == typeof t ? r = t : (i = t, r = t.type);
        var a = this._listeners;
        if (!a) return !1;
        var o = a[r];
        if (o) {
          var s = o.slice(0);
          if (i = i || new n(r, this, e), i._stopped) return !1;
          for (var l = 0; l < s.length; l++) {
            var h = s[l];
            if (h.listener.call(this, i), h.once) {
              var c = o.indexOf(h);
              c > -1 && o.splice(c, 1)
            }
          }
          return 0 == o.length && delete a[r], !0
        }
        return !1
      }
    },
    n = e.create({
      constructor: function (t, e, i) {
        this.type = t, this.target = e, this.detail = i, this.timeStamp = +new Date
      },
      type: null,
      target: null,
      detail: null,
      timeStamp: 0,
      stopImmediatePropagation: function () {
        this._stopped = !0
      }
    }),
    r = t.Event;
  if (r) {
    var a = r.prototype,
      o = a.stopImmediatePropagation;
    a.stopImmediatePropagation = function () {
      o && o.call(this), this._stopped = !0
    }
  }
  t.Hilo.EventMixin = i
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo.Class,
    i = t.Hilo.util,
    n = e.create({
      constructor: function (t) {
        this.init(t)
      },
      image: null,
      rect: null,
      init: function (t) {
        var e = this,
          r = e.image;
        n.isDrawable(t) ? e.image = t : i.copy(e, t, !0);
        var a = e.image;
        if ("string" == typeof a) {
          if (!r || a !== r.getAttribute("src")) {
            e.image = null;
            var o = new Image;
            return t.crossOrigin && (o.crossOrigin = t.crossOrigin), o.onload = function () {
              o.onload = null, e.init(o)
            }, void(o.src = a)
          }
          a = e.image = r
        }
        a && !e.rect && (e.rect = [0, 0, a.width, a.height])
      },
      Statics: {
        isDrawable: function (t) {
          if (!t || !t.tagName) return !1;
          var e = t.tagName.toLowerCase();
          return "img" === e || "canvas" === e || "video" === e
        }
      }
    });
  t.Hilo.Drawable = n
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo.Class,
    i = t.Hilo.util,
    n = e.create({
      constructor: function (t) {
        t = t || {}, i.copy(this, t, !0)
      },
      renderType: null,
      canvas: null,
      stage: null,
      blendMode: "source-over",
      startDraw: function (t) {},
      draw: function (t) {},
      endDraw: function (t) {},
      transform: function () {},
      hide: function () {},
      remove: function (t) {},
      clear: function (t, e, i, n) {},
      resize: function (t, e) {}
    });
  t.Hilo.Renderer = n
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo.Class,
    i = t.Hilo,
    n = t.Hilo.Renderer,
    r = e.create({
      Extends: n,
      constructor: function (t) {
        r.superclass.constructor.call(this, t), this.context = this.canvas.getContext("2d")
      },
      renderType: "canvas",
      context: null,
      startDraw: function (t) {
        return !!(t.visible && t.alpha > 0) && (t === this.stage && this.context.clearRect(0, 0, t.width, t.height), t.blendMode !== this.blendMode && (this.context.globalCompositeOperation = this.blendMode = t.blendMode), this.context.save(), !0)
      },
      draw: function (t) {
        var e = this.context,
          i = t.width,
          n = t.height,
          r = t.background;
        r && (e.fillStyle = r, e.fillRect(0, 0, i, n));
        var a = t.drawable,
          o = a && a.image;
        if (o) {
          var s = a.rect,
            l = s[2],
            h = s[3],
            c = s[4],
            u = s[5];
          if (!l || !h) return;
          i || n || (i = t.width = l, n = t.height = h), (c || u) && e.translate(c - .5 * l, u - .5 * h), e.drawImage(o, s[0], s[1], l, h, 0, 0, i, n)
        }
      },
      endDraw: function (t) {
        this.context.restore()
      },
      transform: function (t) {
        var e = t.drawable;
        if (e && e.domElement) return void i.setElementStyleByView(t);
        var n = this.context,
          r = t.scaleX,
          a = t.scaleY;
        if (t === this.stage) {
          var o = this.canvas.style,
            s = t._scaleX,
            l = t._scaleY,
            h = !1;
          (!s && 1 != r || s && s != r) && (t._scaleX = r, o.width = r * t.width + "px", h = !0), (!l && 1 != a || l && l != a) && (t._scaleY = a, o.height = a * t.height + "px", h = !0), h && t.updateViewport()
        } else {
          var c = t.x,
            u = t.y,
            d = t.pivotX,
            f = t.pivotY,
            p = t.rotation % 360,
            v = t.transform,
            m = t.mask;
          m && (m._render(this), n.clip());
          var g = t.align;
          if (g) {
            var _ = t.getAlignPosition();
            c = _.x, u = _.y
          }
          v ? n.transform(v.a, v.b, v.c, v.d, v.tx, v.ty) : (0 == c && 0 == u || n.translate(c, u), 0 != p && n.rotate(p * Math.PI / 180), 1 == r && 1 == a || n.scale(r, a), 0 == d && 0 == f || n.translate(-d, -f))
        }
        t.alpha > 0 && (n.globalAlpha *= t.alpha)
      },
      remove: function (t) {
        var e = t.drawable,
          i = e && e.domElement;
        if (i) {
          var n = i.parentNode;
          n && n.removeChild(i)
        }
      },
      clear: function (t, e, i, n) {
        this.context.clearRect(t, e, i, n)
      },
      resize: function (t, e) {
        var i = this.canvas,
          n = this.stage,
          r = i.style;
        i.width = t, i.height = e, r.width = n.width * n.scaleX + "px", r.height = n.height * n.scaleY + "px"
      }
    });
  t.Hilo.CanvasRenderer = r
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo.Class,
    i = t.Hilo,
    n = t.Hilo.Renderer,
    r = t.Hilo.Drawable,
    a = function () {
      function t(t, e) {
        var n = t.tagName || "div",
          r = e.image,
          a = t.width || r && r.width,
          o = t.height || r && r.height,
          s = i.createElement(n),
          l = s.style;
        if (t.id && (s.id = t.id), l.position = "absolute", l.left = (t.left || 0) + "px", l.top = (t.top || 0) + "px", l.width = a + "px", l.height = o + "px", "canvas" == n) {
          if (s.width = a, s.height = o, r) {
            var h = s.getContext("2d"),
              c = e.rect || [0, 0, a, o];
            h.drawImage(r, c[0], c[1], c[2], c[3], t.x || 0, t.y || 0, t.width || c[2], t.height || c[3])
          }
        } else if (l.opacity = void 0 != t.alpha ? t.alpha : 1, (t === this.stage || t.clipChildren) && (l.overflow = "hidden"), r && r.src) {
          l.backgroundImage = "url(" + r.src + ")";
          var u = t.rectX || 0,
            d = t.rectY || 0;
          l.backgroundPosition = -u + "px " + -d + "px"
        }
        return s
      }
      return e.create({
        Extends: n,
        constructor: function (t) {
          a.superclass.constructor.call(this, t)
        },
        renderType: "dom",
        startDraw: function (e) {
          var i = e.drawable = e.drawable || new r;
          return i.domElement = i.domElement || t(e, i), !0
        },
        draw: function (t) {
          var e = t.parent,
            i = t.drawable.domElement,
            n = i.parentNode;
          if (e) {
            var r = e.drawable.domElement;
            if (r != n && r.appendChild(i), !t.width && !t.height) {
              var a = t.drawable.rect;
              a && (a[2] || a[3]) && (t.width = a[2], t.height = a[3])
            }
          } else t !== this.stage || n || (i.style.overflow = "hidden", this.canvas.appendChild(i))
        },
        transform: function (t) {
          if (i.setElementStyleByView(t), t === this.stage) {
            var e = this.canvas.style,
              n = t._scaleX,
              r = t._scaleY,
              a = t.scaleX,
              o = t.scaleY;
            (!n && 1 != a || n && n != a) && (t._scaleX = a, e.width = a * t.width + "px"), (!r && 1 != o || r && r != o) && (t._scaleY = o, e.height = o * t.height + "px")
          }
        },
        remove: function (t) {
          var e = t.drawable,
            i = e && e.domElement;
          if (i) {
            var n = i.parentNode;
            n && n.removeChild(i)
          }
        },
        hide: function (t) {
          var e = t.drawable && t.drawable.domElement;
          e && (e.style.display = "none")
        },
        resize: function (t, e) {
          var i = this.canvas.style;
          i.width = t + "px", i.height = e + "px", "absolute" != i.position && (i.position = "relative")
        }
      })
    }();
  t.Hilo.DOMRenderer = a
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo.Class,
    i = t.Hilo,
    n = t.Hilo.Renderer,
    r = t.Hilo.Matrix,
    a = Math.PI / 180,
    o = e.create({
      Extends: n,
      Statics: {
        MAX_BATCH_NUM: 2e3,
        ATTRIBUTE_NUM: 5,
        isSupport: function () {
          if (void 0 == this._isSupported) {
            var t = document.createElement("canvas");
            t.getContext && (t.getContext("webgl") || t.getContext("experimental-webgl")) ? this._isSupported = !0 : this._isSupported = !1
          }
          return this._isSupported
        }
      },
      renderType: "webgl",
      gl: null,
      _isContextLost: !1,
      _cacheTexture: {},
      constructor: function (t) {
        o.superclass.constructor.call(this, t);
        var e = this;
        this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl"), this.maxBatchNum = o.MAX_BATCH_NUM, this.positionStride = 4 * o.ATTRIBUTE_NUM;
        var i = this.maxBatchNum * o.ATTRIBUTE_NUM * 4,
          n = 6 * this.maxBatchNum;
        this.arrayBuffer = new ArrayBuffer(4 * i), this.float32Array = new Float32Array(this.arrayBuffer), this.uint32Array = new Uint32Array(this.arrayBuffer), this.indexs = new Uint16Array(n);
        for (var r = 0, a = 0; r < n; r += 6, a += 4) this.indexs[r + 0] = a + 0, this.indexs[r + 1] = a + 1, this.indexs[r + 2] = a + 2, this.indexs[r + 3] = a + 1, this.indexs[r + 4] = a + 2, this.indexs[r + 5] = a + 3;
        this.batchIndex = 0, this.sprites = [], this.canvas.addEventListener("webglcontextlost", function (t) {
          e._isContextLost = !0, t.preventDefault()
        }, !1), this.canvas.addEventListener("webglcontextrestored", function (t) {
          e._isContextLost = !1, e.setupWebGLStateAndResource()
        }, !1), this.setupWebGLStateAndResource()
      },
      setupWebGLStateAndResource: function () {
        var t = this.gl;
        t.blendFunc(t.ONE, t.ONE_MINUS_SRC_ALPHA), t.clearColor(0, 0, 0, 0), t.disable(t.DEPTH_TEST), t.disable(t.CULL_FACE), t.enable(t.BLEND), this._cacheTexture = {}, this._initShaders(), this.defaultShader.active(), this.positionBuffer = t.createBuffer(), this.indexBuffer = t.createBuffer(), t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, this.indexBuffer), t.bufferData(t.ELEMENT_ARRAY_BUFFER, this.indexs, t.STATIC_DRAW), t.bindBuffer(t.ARRAY_BUFFER, this.positionBuffer), t.bufferData(t.ARRAY_BUFFER, this.arrayBuffer, t.DYNAMIC_DRAW), t.vertexAttribPointer(this.a_position, 2, t.FLOAT, !1, this.positionStride, 0), t.vertexAttribPointer(this.a_TexCoord, 2, t.FLOAT, !1, this.positionStride, 8), t.vertexAttribPointer(this.a_tint, 4, t.UNSIGNED_BYTE, !0, this.positionStride, 16)
      },
      context: null,
      startDraw: function (t) {
        return !!(t.visible && t.alpha > 0) && (t === this.stage && this.clear(), !0)
      },
      draw: function (t) {
        var e = t.width,
          i = t.height,
          n = (t.background, t.drawable),
          r = n && n.image;
        if (r) {
          var a = n.rect,
            o = a[2],
            s = a[3];
          e || i || (e = t.width = o, i = t.height = s), this.batchIndex >= this.maxBatchNum && this._renderBatches();
          var l = this._createVertexs(r, a[0], a[1], o, s, 0, 0, e, i),
            h = this.batchIndex * this.positionStride,
            c = this.float32Array,
            u = this.uint32Array,
            d = (t.tint >> 16) + (65280 & t.tint) + ((255 & t.tint) << 16) + (255 * t.__webglRenderAlpha << 24);
          c[h + 0] = l[0], c[h + 1] = l[1], c[h + 2] = l[2], c[h + 3] = l[3], u[h + 4] = d, c[h + 5] = l[4], c[h + 6] = l[5], c[h + 7] = l[6], c[h + 8] = l[7], u[h + 9] = d, c[h + 10] = l[8], c[h + 11] = l[9], c[h + 12] = l[10], c[h + 13] = l[11], u[h + 14] = d, c[h + 15] = l[12], c[h + 16] = l[13], c[h + 17] = l[14], c[h + 18] = l[15], u[h + 19] = d;
          for (var f = t.__webglWorldMatrix, p = 0; p < 4; p++) {
            var v = c[h + 5 * p],
              m = c[h + 5 * p + 1];
            c[h + 5 * p] = f.a * v + f.c * m + f.tx, c[h + 5 * p + 1] = f.b * v + f.d * m + f.ty
          }
          t.__textureImage = r, this.sprites[this.batchIndex++] = t
        }
      },
      endDraw: function (t) {
        t === this.stage && this._renderBatches()
      },
      transform: function (t) {
        var e = t.drawable;
        if (e && e.domElement) return void i.setElementStyleByView(t);
        var n = t.scaleX,
          a = t.scaleY;
        if (t === this.stage) {
          var o = this.canvas.style,
            s = t._scaleX,
            l = t._scaleY,
            h = !1;
          (!s && 1 != n || s && s != n) && (t._scaleX = n, o.width = n * t.width + "px", h = !0), (!l && 1 != a || l && l != a) && (t._scaleY = a, o.height = a * t.height + "px", h = !0), h && t.updateViewport(), t.__webglWorldMatrix = t.__webglWorldMatrix || new r(1, 0, 0, 1, 0, 0)
        } else t.parent && (t.__webglWorldMatrix = t.__webglWorldMatrix || new r(1, 0, 0, 1, 0, 0), this._setConcatenatedMatrix(t, t.parent));
        t.alpha > 0 && (t.parent && t.parent.__webglRenderAlpha ? t.__webglRenderAlpha = t.alpha * t.parent.__webglRenderAlpha : t.__webglRenderAlpha = t.alpha)
      },
      remove: function (t) {
        var e = t.drawable,
          i = e && e.domElement;
        if (i) {
          var n = i.parentNode;
          n && n.removeChild(i)
        }
      },
      clear: function (t, e, i, n) {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)
      },
      resize: function (t, e) {
        if (this.width !== t || this.height !== e) {
          var i = this.canvas,
            n = this.stage,
            r = i.style;
          this.width = i.width = t, this.height = i.height = e, r.width = n.width * n.scaleX + "px", r.height = n.height * n.scaleY + "px", this.gl.viewport(0, 0, t, e), this.canvasHalfWidth = .5 * t, this.canvasHalfHeight = .5 * e, this._uploadProjectionTransform(!0)
        }
      },
      _renderBatches: function () {
        var t = this.gl;
        t.bufferSubData(t.ARRAY_BUFFER, 0, this.uint32Array.subarray(0, this.batchIndex * this.positionStride));
        for (var e = 0, i = 0, n = null, r = 0; r < this.batchIndex; r++) {
          var a = this.sprites[r];
          n && n !== a.__textureImage && (this._renderBatch(e, r), e = r, i = 1), n = a.__textureImage
        }
        this._renderBatch(e, this.batchIndex), this.batchIndex = 0
      },
      _renderBatch: function (t, e) {
        var i = this.gl,
          n = e - t;
        n > 0 && (i.bindTexture(i.TEXTURE_2D, this._getTexture(this.sprites[t])), i.drawElements(i.TRIANGLES, 6 * n, i.UNSIGNED_SHORT, 6 * t * 2))
      },
      _uploadProjectionTransform: function (t) {
        this._projectionTransformElements && !t || (this._projectionTransformElements = new Float32Array([1 / this.canvasHalfWidth, 0, 0, 0, -1 / this.canvasHalfHeight, 0, -1, 1, 1])), this.gl.uniformMatrix3fv(this.u_projectionTransform, !1, this._projectionTransformElements)
      },
      _initShaders: function () {
        var t = "            attribute vec2 a_position;\n            attribute vec2 a_TexCoord;\n            attribute vec4 a_tint;\n            uniform mat3 u_projectionTransform;\n            varying vec2 v_TexCoord;\n            varying vec4 v_tint;\n            void main(){\n                gl_Position =  vec4((u_projectionTransform * vec3(a_position, 1.0)).xy, 1.0, 1.0);\n                v_TexCoord = a_TexCoord;\n                v_tint = vec4(a_tint.rgb * a_tint.a, a_tint.a);\n            }\n        ",
          e = "\n            precision mediump float;\n            uniform sampler2D u_Sampler;\n            varying vec2 v_TexCoord;\n            varying vec4 v_tint;\n            void main(){\n                gl_FragColor = texture2D(u_Sampler, v_TexCoord) * v_tint;\n            }\n        ";
        this.defaultShader = new s(this, {
          v: t,
          f: e
        }, {
          attributes: ["a_position", "a_TexCoord", "a_tint"],
          uniforms: ["u_projectionTransform", "u_Sampler"]
        })
      },
      _createVertexs: function (t, e, i, n, r, a, o, s, l) {
        var h = this.__tempVertexs || [],
          c = t.width,
          u = t.height;
        n /= c, r /= u, e /= c, i /= u, s = s, l = l, a = a, o = o, n + e > 1 && (n = 1 - e), r + i > 1 && (r = 1 - i);
        var d = 0;
        return h[d++] = a, h[d++] = o, h[d++] = e, h[d++] = i, h[d++] = a + s, h[d++] = o, h[d++] = e + n, h[d++] = i, h[d++] = a, h[d++] = o + l, h[d++] = e, h[d++] = i + r, h[d++] = a + s, h[d++] = o + l, h[d++] = e + n, h[d++] = i + r, h
      },
      _setConcatenatedMatrix: function (t, e) {
        var i = t.__webglWorldMatrix,
          n = 1,
          r = 0,
          o = t.rotation % 360,
          s = t.pivotX,
          l = t.pivotY,
          h = t.scaleX,
          c = t.scaleY,
          u = t.transform;
        if (u) i.copy(u);
        else {
          if (o) {
            var d = o * a;
            n = Math.cos(d), r = Math.sin(d)
          }
          var f = t.getAlignPosition();
          i.a = n * h, i.b = r * h, i.c = -r * c, i.d = n * c, i.tx = f.x - i.a * s - i.c * l, i.ty = f.y - i.b * s - i.d * l
        }
        i.concat(e.__webglWorldMatrix)
      },
      _getTexture: function (t) {
        var e = t.__textureImage,
          i = this._cacheTexture[e.src];
        return i || (i = this.activeShader.uploadTexture(e)), i
      }
    }),
    s = function (t, e, i) {
      this.renderer = t, this.gl = t.gl, this.program = this._createProgram(this.gl, e.v, e.f), i = i || {}, this.attributes = i.attributes || [], this.uniforms = i.uniforms || []
    };
  s.prototype = {
    active: function () {
      var t = this,
        e = t.renderer,
        i = t.gl,
        n = t.program;
      n && i && (e.activeShader = t, i.useProgram(n), t.attributes.forEach(function (t) {
        e[t] = i.getAttribLocation(n, t), i.enableVertexAttribArray(e[t])
      }), t.uniforms.forEach(function (t) {
        e[t] = i.getUniformLocation(n, t)
      }), t.width === e.width && t.height === e.height || (t.width = e.width, t.height = e.height, e._uploadProjectionTransform()))
    },
    uploadTexture: function (t) {
      var e = this.gl,
        i = this.renderer,
        n = e.createTexture(),
        r = i.u_Sampler;
      return e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, n), e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, t), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), e.uniform1i(r, 0), e.bindTexture(e.TEXTURE_2D, null), this.renderer._cacheTexture[t.src] = n, n
    },
    _createProgram: function (t, e, i) {
      var n = this._createShader(t, t.VERTEX_SHADER, e),
        r = this._createShader(t, t.FRAGMENT_SHADER, i);
      if (!n || !r) return null;
      var a = t.createProgram();
      if (a) {
        t.attachShader(a, n), t.attachShader(a, r), t.linkProgram(a), t.deleteShader(r), t.deleteShader(n);
        var o = t.getProgramParameter(a, t.LINK_STATUS);
        if (!o) {
          var s = t.getProgramInfoLog(a);
          return console.log("Failed to link program: " + s), t.deleteProgram(a), null
        }
      }
      return a
    },
    _createShader: function (t, e, i) {
      var n = t.createShader(e);
      if (n) {
        t.shaderSource(n, i), t.compileShader(n);
        var r = t.getShaderParameter(n, t.COMPILE_STATUS);
        if (!r) {
          var a = t.getShaderInfoLog(n);
          return console.log("Failed to compile shader: " + a), t.deleteShader(n), null
        }
      }
      return n
    }
  }, t.Hilo.WebGLRenderer = o
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo,
    i = t.Hilo.Class,
    n = t.Hilo.EventMixin,
    r = t.Hilo.Matrix,
    a = t.Hilo.util,
    o = function () {
      function t(t, e, i) {
        for (var n, r, a, o, s = 0, l = !1, h = 0, c = i.length; h < c; h++) {
          var u = i[h],
            d = i[(h + 1) % c];
          if (u.y == d.y && e == u.y && (u.x > d.x ? (n = d.x, r = u.x) : (n = u.x, r = d.x), t >= n && t <= r)) l = !0;
          else if (u.y > d.y ? (a = d.y, o = u.y) : (a = u.y, o = d.y), !(e < a || e > o)) {
            var f = (e - u.y) * (d.x - u.x) / (d.y - u.y) + u.x;
            if (f > t ? s++ : f == t && (l = !0), u.x > t && u.y == e) {
              var p = i[(c + h - 1) % c];
              (p.y < e && d.y > e || p.y > e && d.y < e) && s++
            }
          }
        }
        return l || s % 2 == 1
      }

      function o(t, e) {
        var i = s(t, e, {
          overlap: -(1 / 0),
          normal: {
            x: 0,
            y: 0
          }
        });
        return !!i && s(e, t, i)
      }

      function s(t, e, i) {
        for (var n, r, a, o, s, l, h, c, u, d = t.length, f = e.length, p = {
            x: 0,
            y: 0
          }, v = 0; v < d; v++) {
          n = t[v], r = t[v < d - 1 ? v + 1 : 0], p.x = n.y - r.y, p.y = r.x - n.x, a = Math.sqrt(p.x * p.x + p.y * p.y), p.x /= a, p.y /= a, o = s = t[0].x * p.x + t[0].y * p.y;
          for (var m = 1; m < d; m++) c = t[m].x * p.x + t[m].y * p.y, c > s ? s = c : c < o && (o = c);
          for (l = h = e[0].x * p.x + e[0].y * p.y, m = 1; m < f; m++) c = e[m].x * p.x + e[m].y * p.y, c > h ? h = c : c < l && (l = c);
          if (o < l ? (u = l - s, p.x = -p.x, p.y = -p.y) : u = o - h, u >= 0) return !1;
          u > i.overlap && (i.overlap = u, i.normal.x = p.x, i.normal.y = p.y)
        }
        return i
      }
      return i.create({
        Mixes: n,
        constructor: function (t) {
          t = t || {}, this.id = this.id || t.id || e.getUid("View"), a.copy(this, t, !0)
        },
        tint: 16777215,
        id: null,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        alpha: 1,
        rotation: 0,
        visible: !0,
        pivotX: 0,
        pivotY: 0,
        scaleX: 1,
        scaleY: 1,
        pointerEnabled: !0,
        background: null,
        mask: null,
        align: null,
        drawable: null,
        boundsArea: null,
        parent: null,
        depth: -1,
        transform: null,
        blendMode: "source-over",
        getStage: function () {
          for (var t, e = this; t = e.parent;) e = t;
          return e.canvas ? e : null
        },
        getScaledWidth: function () {
          return this.width * this.scaleX
        },
        getScaledHeight: function () {
          return this.height * this.scaleY
        },
        addTo: function (t, e) {
          return "number" == typeof e ? t.addChildAt(this, e) : t.addChild(this), this
        },
        removeFromParent: function () {
          var t = this.parent;
          return t && t.removeChild(this), this
        },
        getBounds: function () {
          for (var t, e, i, n, r, a, o, s = this.width, l = this.height, h = this.getConcatenatedMatrix(), c = this.boundsArea || [{
              x: 0,
              y: 0
            }, {
              x: s,
              y: 0
            }, {
              x: s,
              y: l
            }, {
              x: 0,
              y: l
            }], u = [], d = 0, f = c.length; d < f; d++) t = h.transformPoint(c[d], !0, !0), e = t.x, i = t.y, 0 == d ? (n = r = e, a = o = i) : (n > e ? n = e : r < e && (r = e), a > i ? a = i : o < i && (o = i)), u[d] = t;
          return u.x = n, u.y = a, u.width = r - n, u.height = o - a, u
        },
        getConcatenatedMatrix: function (t) {
          for (var e = new r(1, 0, 0, 1, 0, 0), i = this; i != t && i.parent; i = i.parent) {
            var n = 1,
              a = 0,
              o = i.rotation % 360,
              s = i.pivotX,
              l = i.pivotY,
              h = i.scaleX,
              c = i.scaleY,
              u = i.transform;
            if (u) e.concat(u);
            else {
              if (o) {
                var d = o * Math.PI / 180;
                n = Math.cos(d), a = Math.sin(d)
              }
              0 != s && (e.tx -= s), 0 != l && (e.ty -= l);
              var f = i.getAlignPosition();
              e.concat(n * h, a * h, -a * c, n * c, f.x, f.y)
            }
          }
          return e
        },
        getAlignPosition: function () {
          var t = this.parent,
            e = this.align,
            i = this.x,
            n = this.y;
          if (t && this.align) {
            if ("function" == typeof e) return this.align();
            var r = this.width,
              a = this.height,
              o = t.width,
              s = t.height;
            switch (e) {
              case "TL":
                i = 0, n = 0;
                break;
              case "T":
                i = o - r >> 1, n = 0;
                break;
              case "TR":
                i = o - r, n = 0;
                break;
              case "L":
                i = 0, n = s - a >> 1;
                break;
              case "C":
                i = o - r >> 1, n = s - a >> 1;
                break;
              case "R":
                i = o - r, n = s - a >> 1;
                break;
              case "BL":
                i = 0, n = s - a;
                break;
              case "B":
                i = o - r >> 1, n = s - a;
                break;
              case "BR":
                i = o - r, n = s - a
            }
          }
          return {
            x: i,
            y: n
          }
        },
        hitTestPoint: function (e, i, n) {
          var r = this.getBounds(),
            a = e >= r.x && e <= r.x + r.width && i >= r.y && i <= r.y + r.height;
          return a && n && (a = t(e, i, r)), a
        },
        hitTestObject: function (t, e) {
          var i = this.getBounds(),
            n = t.getBounds(),
            r = i.x <= n.x + n.width && n.x <= i.x + i.width && i.y <= n.y + n.height && n.y <= i.y + i.height;
          return r && e && (r = o(i, n)), !!r
        },
        _render: function (t, e) {
          this.onUpdate && this.onUpdate(e) === !1 || !t.startDraw(this) || (t.transform(this), this.render(t, e), t.endDraw(this))
        },
        _fireMouseEvent: function (t) {
          if (t.eventCurrentTarget = this, this.fire(t), "mousemove" == t.type) {
            if (!this.__mouseOver) {
              this.__mouseOver = !0;
              var e = a.copy({}, t);
              e.type = "mouseover", this.fire(e)
            }
          } else "mouseout" == t.type && (this.__mouseOver = !1);
          var i = this.parent;
          t._stopped || t._stopPropagationed || !i || ("mouseout" == t.type || "touchout" == t.type ? i.hitTestPoint(t.stageX, t.stageY, !0) || i._fireMouseEvent(t) : i._fireMouseEvent(t))
        },
        onUpdate: null,
        render: function (t, e) {
          t.draw(this)
        },
        toString: function () {
          return e.viewToString(this)
        }
      })
    }();
  t.Hilo.View = o
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e, i, n = t.Hilo.Drawable,
    r = t.Hilo.browser,
    a = {
      _cacheDirty: !0,
      cache: function (t) {
        (t || this._cacheDirty || !this.drawable) && this.updateCache()
      },
      updateCache: function () {
        r.supportCanvas && (e || (e = document.createElement("canvas"), i = e.getContext("2d")), e.width = this.width, e.height = this.height, this._draw(i), this.drawable = this.drawable || new n, this.drawable.init({
          image: e.toDataURL()
        }), this._cacheDirty = !1)
      },
      setCacheDirty: function (t) {
        this._cacheDirty = t
      }
    };
  t.Hilo.CacheMixin = a
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo,
    i = t.Hilo.Class,
    n = t.Hilo.View,
    r = i.create({
      Extends: n,
      constructor: function (t) {
        t = t || {}, this.id = this.id || t.id || e.getUid("Container"), r.superclass.constructor.call(this, t), this.children ? this._updateChildren() : this.children = []
      },
      children: null,
      pointerChildren: !0,
      clipChildren: !1,
      getNumChildren: function () {
        return this.children.length
      },
      addChildAt: function (t, e) {
        var i = this.children,
          n = i.length,
          r = t.parent;
        e = e < 0 ? 0 : e > n ? n : e;
        var a = this.getChildIndex(t);
        if (a == e) return this;
        if (a >= 0 ? (i.splice(a, 1), e = e == n ? n - 1 : e) : r && r.removeChild(t), i.splice(e, 0, t), a < 0) this._updateChildren(e);
        else {
          var o = a < e ? a : e,
            s = a < e ? e : a;
          this._updateChildren(o, s + 1)
        }
        return this
      },
      addChild: function (t) {
        for (var e = this.children.length, i = arguments, n = 0, r = i.length; n < r; n++) this.addChildAt(i[n], e + n);
        return this
      },
      removeChildAt: function (t) {
        var e = this.children;
        if (t < 0 || t >= e.length) return null;
        var i = e[t];
        if (i) {
          if (!i.__renderer)
            for (var n = i; n = n.parent;) {
              if (n.renderer) {
                i.__renderer = n.renderer;
                break
              }
              if (n.__renderer) {
                i.__renderer = n.__renderer;
                break
              }
            }
          i.__renderer && i.__renderer.remove(i), i.parent = null, i.depth = -1
        }
        return e.splice(t, 1), this._updateChildren(t), i
      },
      removeChild: function (t) {
        return this.removeChildAt(this.getChildIndex(t))
      },
      removeChildById: function (t) {
        for (var e, i = this.children, n = 0, r = i.length; n < r; n++)
          if (e = i[n], e.id === t) return this.removeChildAt(n), e;
        return null
      },
      removeAllChildren: function () {
        for (; this.children.length;) this.removeChildAt(0);
        return this
      },
      getChildAt: function (t) {
        var e = this.children;
        return t < 0 || t >= e.length ? null : e[t]
      },
      getChildById: function (t) {
        for (var e, i = this.children, n = 0, r = i.length; n < r; n++)
          if (e = i[n], e.id === t) return e;
        return null
      },
      getChildIndex: function (t) {
        return this.children.indexOf(t)
      },
      setChildIndex: function (t, e) {
        var i = this.children,
          n = i.indexOf(t);
        if (n >= 0 && n != e) {
          var r = i.length;
          e = e < 0 ? 0 : e >= r ? r - 1 : e, i.splice(n, 1), i.splice(e, 0, t), this._updateChildren()
        }
        return this
      },
      swapChildren: function (t, e) {
        var i = this.children,
          n = this.getChildIndex(t),
          r = this.getChildIndex(e);
        t.depth = r, i[r] = t, e.depth = n, i[n] = e
      },
      swapChildrenAt: function (t, e) {
        var i = this.children,
          n = this.getChildAt(t),
          r = this.getChildAt(e);
        n.depth = e, i[e] = n, r.depth = t, i[t] = r
      },
      sortChildren: function (t) {
        var e = t,
          i = this.children;
        if ("string" == typeof e) {
          var n = e;
          e = function (t, e) {
            return e[n] - t[n]
          }
        }
        i.sort(e), this._updateChildren()
      },
      _updateChildren: function (t, e) {
        var i, n = this.children;
        t = t || 0, e = e || n.length;
        for (var r = t; r < e; r++) i = n[r], i.depth = r + 1, i.parent = this
      },
      contains: function (t) {
        for (; t = t.parent;)
          if (t === this) return !0;
        return !1
      },
      getViewAtPoint: function (t, e, i, n, r) {
        for (var a, o, s = n ? [] : null, l = this.children, h = l.length - 1; h >= 0; h--)
          if (a = l[h], !(!a || !a.visible || a.alpha <= 0 || r && !a.pointerEnabled))
            if (a.children && a.children.length && (!r || a.pointerChildren) && (o = a.getViewAtPoint(t, e, i, n, r)), o) {
              if (!n) return o;
              o.length && (s = s.concat(o))
            } else if (a.hitTestPoint(t, e, i)) {
          if (!n) return a;
          s.push(a)
        }
        return n && s.length ? s : null
      },
      render: function (t, e) {
        r.superclass.render.call(this, t, e);
        var i, n, a, o = this.children.slice(0);
        for (i = 0, n = o.length; i < n; i++) a = o[i], a.parent === this && a._render(t, e)
      }
    });
  t.Hilo.Container = r
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo,
    i = t.Hilo.Class,
    n = t.Hilo.Container,
    r = t.Hilo.CanvasRenderer,
    a = t.Hilo.DOMRenderer,
    o = t.Hilo.WebGLRenderer,
    s = t.Hilo.browser,
    l = t.Hilo.util,
    h = i.create({
      Extends: n,
      constructor: function (t) {
        t = t || {}, this.id = this.id || t.id || e.getUid("Stage"), h.superclass.constructor.call(this, t), this._initRenderer(t);
        var i = this.width,
          n = this.height,
          r = this.updateViewport();
        t.width || (i = r && r.width || 320), t.height || (n = r && r.height || 480), this.resize(i, n, !0)
      },
      canvas: null,
      renderer: null,
      paused: !1,
      viewport: null,
      _initRenderer: function (t) {
        var i = t.canvas,
          n = t.container,
          s = t.renderType || "canvas";
        if ("string" == typeof i && (i = e.getElement(i)), "string" == typeof n && (n = e.getElement(n)), i) i.getContext || (s = "dom");
        else {
          var l = "dom" === s ? "div" : "canvas";
          i = e.createElement(l, {
            style: {
              position: "absolute"
            }
          })
        }
        this.canvas = i, n && n.appendChild(i);
        var h = {
          canvas: i,
          stage: this
        };
        switch (s) {
          case "dom":
            this.renderer = new a(h);
            break;
          case "webgl":
            o.isSupport() ? this.renderer = new o(h) : this.renderer = new r(h);
            break;
          case "canvas":
          default:
            this.renderer = new r(h)
        }
      },
      addTo: function (t) {
        var e = this.canvas;
        return e.parentNode !== t && t.appendChild(e), this
      },
      tick: function (t) {
        this.paused || this._render(this.renderer, t)
      },
      enableDOMEvent: function (t, e) {
        var i = this,
          n = i.canvas,
          r = i._domListener || (i._domListener = function (t) {
            i._onDOMEvent(t)
          });
        t = "string" == typeof t ? [t] : t, e = e !== !1;
        for (var a = 0; a < t.length; a++) {
          var o = t[a];
          e ? n.addEventListener(o, r, !1) : n.removeEventListener(o, r)
        }
        return i
      },
      _onDOMEvent: function (t) {
        var e = t.type,
          i = t,
          n = 0 == e.indexOf("touch"),
          r = t;
        if (n) {
          var a = t.touches,
            o = t.changedTouches;
          r = a && a.length ? a[0] : o && o.length ? o[0] : null
        }
        var h = r.pageX || r.clientX,
          c = r.pageY || r.clientY,
          u = this.viewport || this.updateViewport();
        i.stageX = h = (h - u.left) / this.scaleX, i.stageY = c = (c - u.top) / this.scaleY, i.stopPropagation = function () {
          this._stopPropagationed = !0
        };
        var d = this.getViewAtPoint(h, c, !0, !1, !0) || this,
          f = this.canvas,
          p = this._eventTarget,
          v = "mouseout" === e;
        if (p && (p != d && (!p.contains || !p.contains(d)) || v)) {
          var m = "touchmove" === e ? "touchout" : "mousemove" === e || v || !d ? "mouseout" : null;
          if (m) {
            var g = l.copy({}, i);
            g.type = m, g.eventTarget = p, p._fireMouseEvent(g)
          }
          i.lastEventTarget = p, this._eventTarget = null
        }
        if (d && d.pointerEnabled && "mouseout" !== e && (i.eventTarget = this._eventTarget = d, d._fireMouseEvent(i)), !n) {
          var _ = d && d.pointerEnabled && d.useHandCursor ? "pointer" : "";
          f.style.cursor = _
        }
        s.android && "touchmove" === e && t.preventDefault()
      },
      updateViewport: function () {
        var t = this.canvas,
          i = null;
        return t.parentNode && (i = this.viewport = e.getElementRect(t)), i
      },
      resize: function (t, e, i) {
        (i || this.width !== t || this.height !== e) && (this.width = t, this.height = e, this.renderer.resize(t, e), this.updateViewport())
      }
    });
  t.Hilo.Stage = h
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo,
    i = t.Hilo.Class,
    n = t.Hilo.View,
    r = t.Hilo.Drawable,
    a = i.create({
      Extends: n,
      constructor: function (t) {
        if (t = t || {}, this.id = this.id || t.id || e.getUid("Bitmap"), a.superclass.constructor.call(this, t), this.drawable = new r(t), !this.width || !this.height) {
          var i = this.drawable.rect;
          i && (this.width = i[2], this.height = i[3])
        }
      },
      setImage: function (t, e) {
        return this.drawable.init({
          image: t,
          rect: e
        }), e ? (this.width = e[2], this.height = e[3]) : this.width || this.height || (e = this.drawable.rect, e && (this.width = e[2], this.height = e[3])), this
      }
    });
  t.Hilo.Bitmap = a
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo,
    i = t.Hilo.Class,
    n = t.Hilo.View,
    r = t.Hilo.Drawable,
    a = i.create({
      Extends: n,
      constructor: function (t) {
        t = t || {}, this.id = this.id || t.id || e.getUid("Sprite"), a.superclass.constructor.call(this, t), this._frames = [], this._frameNames = {}, this.drawable = new r, t.frames && this.addFrame(t.frames)
      },
      _frames: null,
      _frameNames: null,
      _frameElapsed: 0,
      _firstRender: !0,
      paused: !1,
      loop: !0,
      timeBased: !1,
      interval: 1,
      currentFrame: 0,
      getNumFrames: function () {
        return this._frames ? this._frames.length : 0
      },
      addFrame: function (t, e) {
        var i = null != e ? e : this._frames.length;
        if (t instanceof Array)
          for (var n = 0, r = t.length; n < r; n++) this.setFrame(t[n], i + n);
        else this.setFrame(t, i);
        return this
      },
      setFrame: function (t, e) {
        var i = this._frames,
          n = i.length;
        return e = e < 0 ? 0 : e > n ? n : e, i[e] = t, t.name && (this._frameNames[t.name] = t), (0 != e || this.width) && this.height || (this.width = t.rect[2], this.height = t.rect[3]), this
      },
      getFrame: function (t) {
        if ("number" == typeof t) {
          var e = this._frames;
          return t < 0 || t >= e.length ? null : e[t]
        }
        return this._frameNames[t]
      },
      getFrameIndex: function (t) {
        var e = this._frames,
          i = e.length,
          n = -1;
        if ("number" == typeof t) n = t;
        else {
          var r = "string" == typeof t ? this._frameNames[t] : t;
          if (r)
            for (var a = 0; a < i; a++)
              if (r === e[a]) {
                n = a;
                break
              }
        }
        return n
      },
      play: function () {
        return this.paused = !1, this
      },
      stop: function () {
        return this.paused = !0, this
      },
      "goto": function (t, e) {
        var i = this._frames.length,
          n = this.getFrameIndex(t);
        return this.currentFrame = n < 0 ? 0 : n >= i ? i - 1 : n, this.paused = e, this._firstRender = !0, this
      },
      _render: function (t, e) {
        var i, n = this.currentFrame;
        if (this._firstRender ? (i = n, this._firstRender = !1) : i = this._nextFrame(e), i != n) {
          this.currentFrame = i;
          var r = this._frames[i].callback;
          r && r.call(this)
        }
        this.onEnterFrame && this.onEnterFrame(i), this.drawable.init(this._frames[i]), a.superclass._render.call(this, t, e)
      },
      _nextFrame: function (t) {
        var e = this._frames,
          i = e.length,
          n = this.currentFrame,
          r = e[n],
        a = r.duration || this.interval,
          o = this._frameElapsed,
          s = 0 != n || this.drawable ? o + (this.timeBased ? t : 1) : 0;
        return o = this._frameElapsed = s < a ? s : 0, (r.stop || !this.loop && n >= i - 1) && this.stop(), this.paused || 0 != o || (null != r.next ? n = this.getFrameIndex(r.next) : n >= i - 1 ? n = 0 : this.drawable && n++), n
      },
      setFrameCallback: function (t, e) {
        return t = this.getFrame(t), t && (t.callback = e), this
      },
      onEnterFrame: null
    });
  t.Hilo.Sprite = a
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo,
    i = t.Hilo.Class,
    n = t.Hilo.View,
    r = t.Hilo.Drawable,
    a = i.create({
      Extends: n,
      constructor: function (t) {
        t = t || {}, this.id = this.id || t.id || e.getUid("DOMElement"), a.superclass.constructor.call(this, t), this.drawable = new r;
        var i = this.drawable.domElement = t.element || e.createElement("div");
        i.id = this.id, this.pointerEnabled && !i.style.pointerEvents && (i.style.pointerEvents = "visible")
      },
      _render: function (t, e) {
        this.onUpdate && this.onUpdate(e) === !1 || (t.transform(this), this.visible && this.alpha > 0 && this.render(t, e))
      },
      render: function (t, i) {
        if ("dom" !== t.renderType) {
          var n = t.canvas,
            r = this.parent,
            a = t._domElementContainer;
          t._domElementContainer || (a = t._domElementContainer = e.createElement("div", {
            style: {
              position: "absolute",
              transform: "scale3d(" + r.scaleX + "," + r.scaleY + ", 1)",
              transformOrigin: "0 0",
              zIndex: "1"
            }
          }), n.parentNode.insertBefore(t._domElementContainer, n.nextSibling));
          var o, s = this.drawable.domElement,
            l = this.depth,
            h = a.childNodes[0];
          if (s.parentNode) return;
          for (; h && 3 != h.nodeType && (o = parseInt(h.style.zIndex) || 0, !(o <= 0 || o > l));) h = h.nextSibling;
          a.insertBefore(this.drawable.domElement, h)
        } else t.draw(this)
      }
    });
  t.Hilo.DOMElement = a
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo,
    i = t.Hilo.Class,
    n = t.Hilo.View,
    r = t.Hilo.CacheMixin,
    a = function () {
      var t = document.createElement("canvas"),
        o = t.getContext && t.getContext("2d");
      return i.create({
        Extends: n,
        Mixes: r,
        constructor: function (t) {
          t = t || {}, this.id = this.id || t.id || e.getUid("Graphics"), a.superclass.constructor.call(this, t), this._actions = []
        },
        lineWidth: 1,
        lineAlpha: 1,
        lineCap: null,
        lineJoin: null,
        miterLimit: 10,
        hasStroke: !1,
        strokeStyle: "0",
        hasFill: !1,
        fillStyle: "0",
        fillAlpha: 0,
        lineStyle: function (t, e, i, n, r, a) {
          var o = this,
            s = o._addAction;
          return s.call(o, ["lineWidth", o.lineWidth = t || 1]), s.call(o, ["strokeStyle", o.strokeStyle = e || "0"]), s.call(o, ["lineAlpha", o.lineAlpha = i || 1]), void 0 != n && s.call(o, ["lineCap", o.lineCap = n]), void 0 != r && s.call(o, ["lineJoin", o.lineJoin = r]), void 0 != a && s.call(o, ["miterLimit", o.miterLimit = a]), o.hasStroke = !0, o
        },
        setLineDash: function (t) {
          return this._addAction(["setLineDash", t])
        },
        beginFill: function (t, e) {
          var i = this,
            n = i._addAction;
          return n.call(i, ["fillStyle", i.fillStyle = t]), n.call(i, ["fillAlpha", i.fillAlpha = e || 1]), i.hasFill = !0, i
        },
        endFill: function () {
          var t = this,
            e = t._addAction;
          return t.hasStroke && e.call(t, ["stroke"]), t.hasFill && e.call(t, ["fill"]), t.setCacheDirty(!0), t
        },
        beginLinearGradientFill: function (t, e, i, n, r, a) {
          for (var s = this, l = o.createLinearGradient(t, e, i, n), h = 0, c = r.length; h < c; h++) l.addColorStop(a[h], r[h]);
          return s.hasFill = !0, s._addAction(["fillStyle", s.fillStyle = l])
        },
        beginRadialGradientFill: function (t, e, i, n, r, a, s, l) {
          for (var h = this, c = o.createRadialGradient(t, e, i, n, r, a), u = 0, d = s.length; u < d; u++) c.addColorStop(l[u], s[u]);
          return h.hasFill = !0, h._addAction(["fillStyle", h.fillStyle = c])
        },
        beginBitmapFill: function (t, e) {
          var i = this,
            n = o.createPattern(t, e || "");
          return i.hasFill = !0, i._addAction(["fillStyle", i.fillStyle = n])
        },
        beginPath: function () {
          return this._addAction(["beginPath"])
        },
        closePath: function () {
          return this._addAction(["closePath"])
        },
        moveTo: function (t, e) {
          return this._addAction(["moveTo", t, e])
        },
        lineTo: function (t, e) {
          return this._addAction(["lineTo", t, e])
        },
        quadraticCurveTo: function (t, e, i, n) {
          return this._addAction(["quadraticCurveTo", t, e, i, n])
        },
        bezierCurveTo: function (t, e, i, n, r, a) {
          return this._addAction(["bezierCurveTo", t, e, i, n, r, a])
        },
        drawRect: function (t, e, i, n) {
          return this._addAction(["rect", t, e, i, n])
        },
        drawRoundRectComplex: function (t, e, i, n, r, a, o, s) {
          var l = this,
            h = l._addAction;
          return h.call(l, ["moveTo", t + r, e]), h.call(l, ["lineTo", t + i - a, e]), h.call(l, ["arc", t + i - a, e + a, a, -Math.PI / 2, 0, !1]), h.call(l, ["lineTo", t + i, e + n - o]), h.call(l, ["arc", t + i - o, e + n - o, o, 0, Math.PI / 2, !1]), h.call(l, ["lineTo", t + s, e + n]), h.call(l, ["arc", t + s, e + n - s, s, Math.PI / 2, Math.PI, !1]), h.call(l, ["lineTo", t, e + r]), h.call(l, ["arc", t + r, e + r, r, Math.PI, 3 * Math.PI / 2, !1]), l
        },
        drawRoundRect: function (t, e, i, n, r) {
          return this.drawRoundRectComplex(t, e, i, n, r, r, r, r)
        },
        drawCircle: function (t, e, i) {
          return this._addAction(["arc", t + i, e + i, i, 0, 2 * Math.PI, 0])
        },
        drawEllipse: function (t, e, i, n) {
          var r = this;
          if (i == n) return r.drawCircle(t, e, i);
          var a = r._addAction,
            o = i / 2,
            s = n / 2,
            l = .5522847498307933,
            h = l * o,
            c = l * s;
          return t += o, e += s, a.call(r, ["moveTo", t + o, e]), a.call(r, ["bezierCurveTo", t + o, e - c, t + h, e - s, t, e - s]), a.call(r, ["bezierCurveTo", t - h, e - s, t - o, e - c, t - o, e]), a.call(r, ["bezierCurveTo", t - o, e + c, t - h, e + s, t, e + s]), a.call(r, ["bezierCurveTo", t + h, e + s, t + o, e + c, t + o, e]), r
        },
        drawSVGPath: function (t) {
          var e = this,
            i = e._addAction,
            n = t.replace(/,/g, " ").replace(/-/g, " -").split(/(?=[a-zA-Z])/);
          i.call(e, ["beginPath"]);
          for (var r, a = {
              x: 0,
              y: 0
            }, o = {
              x: 0,
              y: 0
            }, s = 0, l = n.length; s < l; s++) {
            var h = n[s];
            if (h.length) {
              var c = h[0],
                u = c.toUpperCase(),
                d = this._getSVGParams(h),
                f = u !== c;
              switch (u) {
                case "M":
                  f && this._convertToAbsolute(a, d), i.call(e, ["moveTo", d[0], d[1]]), this._setCurrentPoint(a, d[0], d[1]);
                  break;
                case "L":
                  f && this._convertToAbsolute(a, d), i.call(e, ["lineTo", d[0], d[1]]), this._setCurrentPoint(a, d[0], d[1]);
                  break;
                case "H":
                  f && (d[0] += a.x), i.call(e, ["lineTo", d[0], a.y]), a.x = d[0];
                  break;
                case "V":
                  f && (d[0] += a.y), i.call(e, ["lineTo", a.x, d[0]]), a.y = d[0];
                  break;
                case "Z":
                  i.call(e, ["closePath"]);
                  break;
                case "C":
                  f && this._convertToAbsolute(a, d), i.call(e, ["bezierCurveTo", d[0], d[1], d[2], d[3], d[4], d[5]]), o.x = d[2], o.y = d[3], this._setCurrentPoint(a, d[4], d[5]);
                  break;
                case "S":
                  f && this._convertToAbsolute(a, d), p = "C" === r || "S" === r ? this._getReflectionPoint(a, o) : a, i.call(e, ["bezierCurveTo", p.x, p.y, d[0], d[1], d[2], d[3]]), o.x = d[0], o.y = d[1], this._setCurrentPoint(a, d[2], d[3]);
                  break;
                case "Q":
                  f && this._convertToAbsolute(a, d), i.call(e, ["quadraticCurveTo", d[0], d[1], d[2], d[3]]), o.x = d[0], o.y = d[1], this._setCurrentPoint(a, d[2], d[3]);
                  break;
                case "T":
                  f && this._convertToAbsolute(a, d);
                  var p;
                  p = "Q" === r || "T" === r ? this._getReflectionPoint(a, o) : a, i.call(e, ["quadraticCurveTo", p.x, p.y, d[0], d[1]]), o = p, this._setCurrentPoint(a, d[0], d[1])
              }
              r = u
            }
          }
          return e
        },
        _getSVGParams: function (t) {
          var e = t.substring(1).replace(/[\s]+$|^[\s]+/g, "").split(/[\s]+/);
          0 == e[0].length && e.shift();
          for (var i = 0, n = e.length; i < n; i++) e[i] = parseFloat(e[i]);
          return e
        },
        _convertToAbsolute: function (t, e) {
          for (var i = 0, n = e.length; i < n; i++) i % 2 === 0 ? e[i] += t.x : e[i] += t.y
        },
        _setCurrentPoint: function (t, e, i) {
          t.x = e, t.y = i
        },
        _getReflectionPoint: function (t, e) {
          return {
            x: 2 * t.x - e.x,
            y: 2 * t.y - e.y
          }
        },
        _draw: function (t) {
          var e, i = this,
            n = i._actions,
            r = n.length;
          for (t.beginPath(), e = 0; e < r; e++) {
            var a = n[e],
              o = a[0],
              s = a.length > 1 ? a.slice(1) : null;
            "function" == typeof t[o] ? t[o].apply(t, s) : t[o] = a[1]
          }
        },
        render: function (t, e) {
          var i = this;
          "canvas" === t.renderType ? i._draw(t.context) : (i.cache(), t.draw(i))
        },
        clear: function () {
          var t = this;
          return t._actions.length = 0, t.lineWidth = 1, t.lineAlpha = 1, t.lineCap = null, t.lineJoin = null, t.miterLimit = 10, t.hasStroke = !1, t.strokeStyle = "0", t.hasFill = !1, t.fillStyle = "0", t.fillAlpha = 1, t.setCacheDirty(!0), t
        },
        _addAction: function (t) {
          var e = this;
          return e._actions.push(t), e
        }
      })
    }();
  t.Hilo.Graphics = a
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo.Class,
    i = t.Hilo,
    n = t.Hilo.View,
    r = t.Hilo.CacheMixin,
    a = e.create({
      Extends: n,
      Mixes: r,
      constructor: function (t) {
        t = t || {}, this.id = this.id || t.id || i.getUid("Text"), a.superclass.constructor.call(this, t), t.font || (this.font = "12px arial"), this._fontHeight = a.measureFontHeight(this.font)
      },
      text: null,
      color: "#000",
      textAlign: null,
      textVAlign: null,
      outline: !1,
      lineSpacing: 0,
      maxWidth: 200,
      font: null,
      textWidth: 0,
      textHeight: 0,
      setFont: function (t) {
        var e = this;
        return e.font !== t && (e.font = t, e._fontHeight = a.measureFontHeight(t)), e
      },
      render: function (t, e) {
        var i = this;
        if ("canvas" === t.renderType) this.drawable ? t.draw(i) : i._draw(t.context);
        else if ("dom" === t.renderType) {
          var n = i.drawable,
            r = n.domElement,
            a = r.style;
          a.font = i.font, a.textAlign = i.textAlign, a.color = i.color, a.width = i.width + "px", a.height = i.height + "px", a.lineHeight = i._fontHeight + i.lineSpacing + "px", r.innerHTML = i.text, t.draw(this)
        } else i.cache(), t.draw(i)
      },
      _draw: function (t) {
        var e = this,
          i = e.text.toString();
        if (i) {
          t.font = e.font, t.textAlign = e.textAlign, t.textBaseline = "top";
          var n, r, a, o, s, l = i.split(/\r\n|\r|\n|<br(?:[ \/])*>/),
            h = 0,
            c = 0,
            u = e._fontHeight + e.lineSpacing,
            d = [];
          for (n = 0, o = l.length; n < o; n++)
            if (r = l[n], a = t.measureText(r).width, a <= e.maxWidth) d.push({
              text: r,
              y: c
            }), h < a && (h = a), c += u;
            else {
              var f, p, v, m = "",
                g = 0;
              for (p = 0, s = r.length; p < s; p++) v = r[p], f = t.measureText(m + v).width, f > e.maxWidth ? (d.push({
                text: m,
                y: c
              }), h < g && (h = g), c += u, m = v) : (g = f, m += v), p == s - 1 && (d.push({
                text: m,
                y: c
              }), m !== v && h < f && (h = f), c += u)
            } e.textWidth = h, e.textHeight = c, e.width || (e.width = h), e.height || (e.height = c);
          var _ = 0;
          switch (e.textVAlign) {
            case "middle":
              _ = e.height - e.textHeight >> 1;
              break;
            case "bottom":
              _ = e.height - e.textHeight
          }
          var x = e.background;
          for (x && (t.fillStyle = x, t.fillRect(0, 0, e.width, e.height)), e.outline ? t.strokeStyle = e.color : t.fillStyle = e.color, n = 0; n < d.length; n++) r = d[n], e._drawTextLine(t, r.text, _ + r.y)
        }
      },
      _drawTextLine: function (t, e, i) {
        var n = this,
          r = 0,
          a = n.width;
        switch (n.textAlign) {
          case "center":
            r = a >> 1;
            break;
          case "right":
          case "end":
            r = a
        }
        n.outline ? t.strokeText(e, r, i) : t.fillText(e, r, i)
      },
      Statics: {
        measureFontHeight: function (t) {
          var e, n = document.documentElement,
            r = i.createElement("div", {
              style: {
                font: t,
                position: "absolute"
              },
              innerHTML: "M"
            });
          return n.appendChild(r), e = r.offsetHeight, n.removeChild(r), e
        }
      }
    });
  t.Hilo.Text = a
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo.Class,
    i = t.Hilo,
    n = t.Hilo.Container,
    r = t.Hilo.Bitmap,
    a = e.create({
      Extends: n,
      constructor: function (t) {
        t = t || {}, this.id = this.id || t.id || i.getUid("BitmapText"), a.superclass.constructor.call(this, t);
        var e = t.text + "";
        e && (this.text = "", this.setText(e)), this.pointerChildren = !1
      },
      glyphs: null,
      letterSpacing: 0,
      text: "",
      textAlign: "left",
      setText: function (t) {
        var e = this,
          i = t.toString(),
          n = i.length;
        if (e.text != i) {
          e.text = i;
          var r, a, o, s, l = 0,
            h = 0,
            c = 0;
          for (r = 0; r < n; r++) a = i.charAt(r), o = e.glyphs[a], o && (c = l + (l > 0 ? e.letterSpacing : 0), e.children[r] ? (s = e.children[r], s.setImage(o.image, o.rect)) : (s = e._createBitmap(o), e.addChild(s)), s.x = c, l = c + o.rect[2], h = Math.max(h, o.rect[3]));
          for (r = e.children.length - 1; r >= n; r--) e._releaseBitmap(e.children[r]), e.children[r].removeFromParent();
          return e.width = l, e.height = h, this.setTextAlign(), e
        }
      },
      _createBitmap: function (t) {
        var e;
        return a._pool.length ? (e = a._pool.pop(), e.setImage(t.image, t.rect)) : e = new r({
          image: t.image,
          rect: t.rect
        }), e
      },
      _releaseBitmap: function (t) {
        a._pool.push(t)
      },
      setTextAlign: function (t) {
        switch (this.textAlign = t || this.textAlign, this.textAlign) {
          case "center":
            this.pivotX = .5 * this.width;
            break;
          case "right":
            this.pivotX = this.width;
            break;
          case "left":
          default:
            this.pivotX = 0
        }
        return this
      },
      hasGlyphs: function (t) {
        var e = this.glyphs;
        if (!e) return !1;
        t = t.toString();
        var i, n = t.length;
        for (i = 0; i < n; i++)
          if (!e[t.charAt(i)]) return !1;
        return !0
      },
      Statics: {
        _pool: [],
        createGlyphs: function (t, e, i, n) {
          var r = t.toString();
          i = i || r.length, n = n || 1;
          for (var a = e.width / i, o = e.height / n, s = {}, l = 0, h = t.length; l < h; l++) {
            var c = r.charAt(l);
            s[c] = {
              image: e,
              rect: [a * (l % i), o * Math.floor(l / i), a, o]
            }
          }
          return s
        }
      }
    });
  t.Hilo.BitmapText = a
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo,
    i = t.Hilo.Class,
    n = t.Hilo.View,
    r = t.Hilo.Drawable,
    a = t.Hilo.util,
    o = i.create({
      Extends: n,
      constructor: function (t) {
        t = t || {}, this.id = this.id || t.id || e.getUid("Button"), o.superclass.constructor.call(this, t), this.drawable = new r(t), this.setState(o.UP)
      },
      upState: null,
      overState: null,
      downState: null,
      disabledState: null,
      state: null,
      enabled: !0,
      useHandCursor: !0,
      setEnabled: function (t) {
        return this.enabled != t && (t ? this.setState(o.UP) : this.setState(o.DISABLED)), this
      },
      setState: function (t) {
        if (this.state !== t) {
          this.state = t, this.pointerEnabled = this.enabled = t !== o.DISABLED;
          var e;
          switch (t) {
            case o.UP:
              e = this.upState;
              break;
            case o.OVER:
              e = this.overState;
              break;
            case o.DOWN:
              e = this.downState;
              break;
            case o.DISABLED:
              e = this.disabledState
          }
          e && (this.drawable.init(e), a.copy(this, e, !0))
        }
        return this
      },
      fire: function (t, e) {
        if (this.enabled) {
          var i = "string" == typeof t ? t : t.type;
          switch (i) {
            case "mousedown":
            case "touchstart":
            case "touchmove":
              this.setState(o.DOWN);
              break;
            case "mouseover":
              this.setState(o.OVER);
              break;
            case "mouseup":
              this.overState ? this.setState(o.OVER) : this.upState && this.setState(o.UP);
              break;
            case "touchend":
            case "touchout":
            case "mouseout":
              this.setState(o.UP)
          }
          return o.superclass.fire.call(this, t, e)
        }
      },
      Statics: {
        UP: "up",
        OVER: "over",
        DOWN: "down",
        DISABLED: "disabled"
      }
    });
  t.Hilo.Button = o
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo.Class,
    i = function () {
      function t(t) {
        var e, i, n = t.frames;
        if (!n) return null;
        var r, a = [];
        if (n instanceof Array)
          for (e = 0, i = n.length; e < i; e++) r = n[e], a[e] = {
            image: t.image,
            rect: r
          };
        else {
          var o = n.frameWidth,
            s = n.frameHeight,
            l = t.width / o | 0,
            h = t.height / s | 0,
            c = n.numFrames || l * h;
          for (e = 0; e < c; e++) a[e] = {
            image: t.image,
            rect: [e % l * o, (e / l | 0) * s, o, s]
          }
        }
        return a
      }

      function i(t, e) {
        var i, a, o = t.sprites;
        if (!o) return null;
        var s, l, h, c = {};
        for (var u in o) {
          if (s = o[u], r(s)) l = n(e[s]);
          else if (s instanceof Array)
            for (l = [], i = 0, a = s.length; i < a; i++) {
              var d, f = s[i];
              r(f) ? h = n(e[f]) : (d = f.rect, r(d) && (d = e[f.rect]), h = n(d, f)), l[i] = h
            } else
              for (l = [], i = s.from; i <= s.to; i++) l[i - s.from] = n(e[i], s[i]);
          c[u] = l
        }
        return c
      }

      function n(t, e) {
        var i = {
          image: t.image,
          rect: t.rect
        };
        return e && (i.name = e.name || null, i.duration = e.duration || 0, i.stop = !!e.stop, i.next = e.next || null), i
      }

      function r(t) {
        return "number" == typeof t
      }
      return e.create({
        constructor: function (e) {
          this._frames = t(e), this._sprites = i(e, this._frames)
        },
        _frames: null,
        _sprites: null,
        getFrame: function (t) {
          var e = this._frames;
          return e && e[t]
        },
        getSprite: function (t) {
          var e = this._sprites;
          return e && e[t]
        },
        Statics: {
          createSpriteFrames: function (t, e, i, n, r, a, o) {
            var s, l;
            if ("[object Array]" === Object.prototype.toString.call(t)) {
              var h = [];
              for (s = 0, l = t.length; s < l; s++) h = h.concat(this.createSpriteFrames.apply(this, t[s]));
              return h
            }
            if ("string" == typeof e) {
              var c = e.split(",");
              e = [];
              for (var u = 0, d = c.length; u < d; u++) {
                var f = c[u].split("-");
                if (1 == f.length) e.push(parseInt(f[0]));
                else
                  for (s = parseInt(f[0]), l = parseInt(f[1]); s <= l; s++) e.push(s)
              }
            }
            var p = Math.floor(i.width / n);
            for (s = 0; s < e.length; s++) {
              var v = e[s];
              e[s] = {
                rect: [n * (v % p), r * Math.floor(v / p), n, r],
                image: i,
                duration: o
              }
            }
            return e[0].name = t, a ? e[e.length - 1].next = t : e[e.length - 1].stop = !0, e
          }
        }
      })
    }();
  t.Hilo.TextureAtlas = i
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo.Class,
    i = t.Hilo.browser,
    n = e.create({
      constructor: function (t) {
        this._targetFPS = t || 60, this._interval = 1e3 / this._targetFPS, this._tickers = []
      },
      _paused: !1,
      _targetFPS: 0,
      _interval: 0,
      _intervalId: null,
      _tickers: null,
      _lastTime: 0,
      _tickCount: 0,
      _tickTime: 0,
      _measuredFPS: 0,
      start: function (e) {
        if (void 0 === e && (e = !0), !this._intervalId) {
          this._lastTime = +new Date;
          var n, r = this,
            a = this._interval,
            o = t.requestAnimationFrame || t[i.jsVendor + "RequestAnimationFrame"];
          e && o && a < 17 ? (this._useRAF = !0, n = function () {
            r._intervalId = o(n), r._tick()
          }) : n = function () {
            r._intervalId = setTimeout(n, a), r._tick()
          }, this._paused = !1, n()
        }
      },
      stop: function () {
        if (this._useRAF) {
          var e = t.cancelAnimationFrame || t[i.jsVendor + "CancelAnimationFrame"];
          e(this._intervalId)
        } else clearTimeout(this._intervalId);
        this._intervalId = null, this._lastTime = 0, this._paused = !0
      },
      pause: function () {
        this._paused = !0
      },
      resume: function () {
        this._paused = !1
      },
      _tick: function () {
        if (!this._paused) {
          var t = +new Date,
            e = t - this._lastTime,
            i = this._tickers;
          ++this._tickCount >= this._targetFPS ? (this._measuredFPS = 1e3 / (this._tickTime / this._tickCount) + .5 >> 0, this._tickCount = 0, this._tickTime = 0) : this._tickTime += t - this._lastTime, this._lastTime = t;
          for (var n = i.slice(0), r = 0, a = n.length; r < a; r++) n[r].tick(e)
        }
      },
      getMeasuredFPS: function () {
        return Math.min(this._measuredFPS, this._targetFPS)
      },
      addTick: function (t) {
        if (!t || "function" != typeof t.tick) throw new Error("Ticker: The tick object must implement the tick method.");
        this._tickers.push(t)
      },
      removeTick: function (t) {
        var e = this._tickers,
          i = e.indexOf(t);
        i >= 0 && e.splice(i, 1)
      },
      nextTick: function (t) {
        var e = this,
          i = {
            tick: function (n) {
              e.removeTick(i), t()
            }
          };
        return e.addTick(i), i
      },
      timeout: function (t, e) {
        var i = this,
          n = (new Date).getTime() + e,
          r = {
            tick: function () {
              var e = (new Date).getTime(),
                a = e - n;
              a >= 0 && (i.removeTick(r), t())
            }
          };
        return i.addTick(r), r
      },
      interval: function (t, e) {
        var i = this,
          n = (new Date).getTime() + e,
          r = {
            tick: function () {
              var i = (new Date).getTime(),
                r = i - n;
              r >= 0 && (r < e && (i -= r), n = i + e, t())
            }
          };
        return i.addTick(r), r
      }
    });
  t.Hilo.Ticker = n
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = Array.prototype,
    i = e.slice;
  e.indexOf || (e.indexOf = function (t, e) {
    e = e || 0;
    var i, n = this.length;
    if (0 == n || e >= n) return -1;
    for (e < 0 && (e = n + e), i = e; i < n; i++)
      if (this[i] === t) return i;
    return -1
  });
  var n = Function.prototype;
  n.bind || (n.bind = function (t) {
    function e() {
      var a = r.concat(i.call(arguments));
      return n.apply(this instanceof e ? this : t, a)
    }
    var n = this,
      r = i.call(arguments, 1),
      a = function () {};
    return a.prototype = n.prototype, e.prototype = new a, e
  }), t.Hilo.undefined = void 0
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo,
    i = {
      _isDragStart: !1,
      dragNeedTransform: !1,
      startDrag: function (t) {
        function i(t) {
          t.stopPropagation(), a(t), s.off(e.event.POINTER_START, i), p.x = s.x, p.y = s.y, s.dragNeedTransform && s.parent && s.parent.getConcatenatedMatrix().transformPoint(p), s.__dragX = p.x - h.x, s.__dragY = p.y - h.y, l || (l = s.getStage()), l.on(e.event.POINTER_MOVE, r), document.addEventListener(e.event.POINTER_END, n), s.fire("dragStart", h)
        }

        function n(t) {
          document.removeEventListener(e.event.POINTER_END, n), l && l.off(e.event.POINTER_MOVE, r), s.on(e.event.POINTER_START, i), s.fire("dragEnd", h)
        }

        function r(t) {
          a(t), p.x = h.x + s.__dragX, p.y = h.y + s.__dragY, s.dragNeedTransform && s.parent && s.parent.getConcatenatedMatrix().invert().transformPoint(p), s.x = Math.max(c, Math.min(d, p.x)), s.y = Math.max(u, Math.min(f, p.y)), s.fire("dragMove", h)
        }

        function a(t) {
          h.preX = h.x, h.preY = h.y, h.x = t.stageX, h.y = t.stageY
        }

        function o() {
          s._isDragStart = !1, document.removeEventListener(e.event.POINTER_END, n), l && l.off(e.event.POINTER_MOVE, r), s.off(e.event.POINTER_START, i)
        }
        var s = this;
        s._isDragStart && s.stopDrag(), s._isDragStart = !0;
        var l;
        t = t || [-(1 / 0), -(1 / 0), 1 / 0, 1 / 0];
        var h = {
            x: 0,
            y: 0,
            preX: 0,
            preY: 0
          },
          c = t[0],
          u = t[1],
          d = t[2] == 1 / 0 ? 1 / 0 : c + t[2],
          f = t[3] == 1 / 0 ? 1 / 0 : u + t[3],
          p = {
            x: 0,
            y: 0
          };
        s.on(e.event.POINTER_START, i), s.stopDrag = o
      },
      stopDrag: function () {
        this._isDragStart = !1
      }
    };
  t.Hilo.drag = i
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo.Class,
    i = function () {
      function t() {
        return +new Date
      }
      return e.create({
        constructor: function (t, e, i, n) {
          var r = this;
          r.target = t, r._startTime = 0, r._seekTime = 0, r._pausedTime = 0, r._pausedStartTime = 0, r._reverseFlag = 1, r._repeatCount = 0, 3 == arguments.length && (n = i, i = e, e = null);
          for (var a in n) r[a] = n[a];
          r._fromProps = e, r._toProps = i, !n.duration && n.time && (r.duration = n.time || 0, r.time = 0)
        },
        target: null,
        duration: 1e3,
        delay: 0,
        paused: !1,
        loop: !1,
        reverse: !1,
        repeat: 0,
        repeatDelay: 0,
        ease: null,
        time: 0,
        isStart: !1,
        onStart: null,
        onUpdate: null,
        onComplete: null,
        setProps: function (t, e) {
          var i = this,
            n = i.target,
            r = t || e,
            a = i._fromProps = {},
            o = i._toProps = {};
          t = t || n, e = e || n;
          for (var s in r) o[s] = e[s] || 0, n[s] = a[s] = t[s] || 0;
          return i
        },
        start: function () {
          var e = this;
          return e._startTime = t() + e.delay, e._seekTime = 0, e._pausedTime = 0, e.paused = !1, i.add(e), e
        },
        stop: function () {
          return i.remove(this), this
        },
        pause: function () {
          var e = this;
          return e.paused = !0, e._pausedStartTime = t(), e
        },
        resume: function () {
          var e = this;
          return e.paused = !1, e._pausedStartTime && (e._pausedTime += t() - e._pausedStartTime), e._pausedStartTime = 0, e
        },
        seek: function (e, n) {
          var r = this,
            a = t();
          return r._startTime = a, r._seekTime = e, r._pausedTime = 0, void 0 !== n && (r.paused = n), r._update(a, !0), i.add(r), r
        },
        link: function (t) {
          var e, n, r = this,
            a = t.delay,
            o = r._startTime;
          return "string" == typeof a && (e = 0 == a.indexOf("+"), n = 0 == a.indexOf("-"), a = e || n ? Number(a.substr(1)) * (e ? 1 : -1) : Number(a)), t.delay = a, t._startTime = e || n ? o + r.duration + a : o + a, r._next = t, i.remove(t), t
        },
        _render: function (t) {
          var e, i = this,
            n = i.target,
            r = i._fromProps;
          for (e in r) n[e] = r[e] + (i._toProps[e] - r[e]) * t
        },
        _update: function (e, n) {
          var r = this;
          if (!r.paused || n) {
            var a = e - r._startTime - r._pausedTime + r._seekTime;
            if (!(a < 0)) {
              var o, s = a / r.duration,
                l = !1;
              s = s <= 0 ? 0 : s >= 1 ? 1 : s;
              var h = r.ease ? r.ease(s) : s;
              r.reverse && (r._reverseFlag < 0 && (s = 1 - s, h = 1 - h), s < 1e-7 && (r.repeat > 0 && r._repeatCount++ >= r.repeat || 0 == r.repeat && !r.loop ? l = !0 : (r._startTime = t(), r._pausedTime = 0, r._reverseFlag *= -1))), r.isStart || (r.setProps(r._fromProps, r._toProps), r.isStart = !0, r.onStart && r.onStart.call(r, r)), r.time = a, r._render(h), (o = r.onUpdate) && o.call(r, s, r), s >= 1 && (r.reverse ? (r._startTime = t(), r._pausedTime = 0, r._reverseFlag *= -1) : r.loop || r.repeat > 0 && r._repeatCount++ < r.repeat ? (r._startTime = t() + r.repeatDelay, r._pausedTime = 0) : l = !0);
              var c = r._next;
              if (c && c.time <= 0) {
                var u = c._startTime;
                u > 0 && u <= e ? (c._render(s), c.time = a, i.add(c)) : l && (u < 0 || u > e) && c.start()
              }
              return l ? ((o = r.onComplete) && o.call(r, r), !0) : void 0
            }
          }
        },
        Statics: {
          _tweens: [],
          tick: function () {
            var e, n, r = i._tweens,
              a = r.length;
            for (n = 0; n < a; n++) e = r[n], e && e._update(t()) && (r.splice(n, 1), n--);
            return i
          },
          add: function (t) {
            var e = i._tweens;
            return e.indexOf(t) == -1 && e.push(t), i
          },
          remove: function (t) {
            var e, n;
            if (t instanceof Array) {
              for (e = 0, n = t.length; e < n; e++) i.remove(t[e]);
              return i
            }
            var r = i._tweens;
            if (t instanceof i) e = r.indexOf(t), e > -1 && r.splice(e, 1);
            else
              for (e = 0; e < r.length; e++) r[e].target === t && (r.splice(e, 1), e--);
            return i
          },
          removeAll: function () {
            return i._tweens.length = 0, i
          },
          fromTo: function (t, e, n, r) {
            r = r || {};
            var a = t instanceof Array;
            t = a ? t : [t];
            var o, s, l = r.stagger,
              h = [];
            for (s = 0; s < t.length; s++) o = new i(t[s], e, n, r), l && (o.delay = (r.delay || 0) + (s * l || 0)), o.start(), h.push(o);
            return a ? h : o
          },
          to: function (t, e, n) {
            return i.fromTo(t, null, e, n)
          },
          from: function (t, e, n) {
            return i.fromTo(t, e, null, n)
          }
        }
      })
    }();
  t.Hilo.Tween = i
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = function () {
    function t(t, e, i, n, r) {
      return t = t || {}, e && (t.EaseIn = e), i && (t.EaseOut = i), n && (t.EaseInOut = n), r && (t.EaseNone = r), t
    }
    var e = t(null, null, null, null, function (t) {
        return t
      }),
      i = t(null, function (t) {
        return t * t
      }, function (t) {
        return -t * (t - 2)
      }, function (t) {
        return (t *= 2) < 1 ? .5 * t * t : -.5 * (--t * (t - 2) - 1)
      }),
      n = t(null, function (t) {
        return t * t * t
      }, function (t) {
        return --t * t * t + 1
      }, function (t) {
        return (t *= 2) < 1 ? .5 * t * t * t : .5 * ((t -= 2) * t * t + 2)
      }),
      r = t(null, function (t) {
        return t * t * t * t
      }, function (t) {
        return -(--t * t * t * t - 1)
      }, function (t) {
        return (t *= 2) < 1 ? .5 * t * t * t * t : -.5 * ((t -= 2) * t * t * t - 2)
      }),
      a = t(null, function (t) {
        return t * t * t * t * t
      }, function (t) {
        return (t -= 1) * t * t * t * t + 1
      }, function (t) {
        return (t *= 2) < 1 ? .5 * t * t * t * t * t : .5 * ((t -= 2) * t * t * t * t + 2)
      }),
      o = Math,
      s = o.PI,
      l = .5 * s,
      h = o.sin,
      c = o.cos,
      u = o.pow,
      d = o.sqrt,
      f = t(null, function (t) {
        return -c(t * l) + 1
      }, function (t) {
        return h(t * l)
      }, function (t) {
        return -.5 * (c(s * t) - 1)
      }),
      p = t(null, function (t) {
        return 0 == t ? 0 : u(2, 10 * (t - 1))
      }, function (t) {
        return 1 == t ? 1 : -u(2, -10 * t) + 1
      }, function (t) {
        return 0 == t || 1 == t ? t : (t *= 2) < 1 ? .5 * u(2, 10 * (t - 1)) : .5 * (-u(2, -10 * (t - 1)) + 2)
      }),
      v = t(null, function (t) {
        return -(d(1 - t * t) - 1)
      }, function (t) {
        return d(1 - --t * t)
      }, function (t) {
        return (t /= .5) < 1 ? -.5 * (d(1 - t * t) - 1) : .5 * (d(1 - (t -= 2) * t) + 1)
      }),
      m = t({
        a: 1,
        p: .4,
        s: .1,
        config: function (t, e) {
          m.a = t, m.p = e, m.s = e / (2 * s) * Math.asin(1 / t) || 0
        }
      }, function (t) {
        return -(m.a * u(2, 10 * (t -= 1)) * h((t - m.s) * (2 * s) / m.p))
      }, function (t) {
        return m.a * u(2, -10 * t) * h((t - m.s) * (2 * s) / m.p) + 1
      }, function (t) {
        return (t *= 2) < 1 ? -.5 * (m.a * u(2, 10 * (t -= 1)) * h((t - m.s) * (2 * s) / m.p)) : m.a * u(2, -10 * (t -= 1)) * h((t - m.s) * (2 * s) / m.p) * .5 + 1
      }),
      g = t({
        o: 1.70158,
        s: 2.59491,
        config: function (t) {
          g.o = t, g.s = 1.525 * t
        }
      }, function (t) {
        return t * t * ((g.o + 1) * t - g.o)
      }, function (t) {
        return (t -= 1) * t * ((g.o + 1) * t + g.o) + 1
      }, function (t) {
        return (t *= 2) < 1 ? .5 * (t * t * ((g.s + 1) * t - g.s)) : .5 * ((t -= 2) * t * ((g.s + 1) * t + g.s) + 2)
      }),
      _ = t(null, function (t) {
        return 1 - _.EaseOut(1 - t)
      }, function (t) {
        return (t /= 1) < .36364 ? 7.5625 * t * t : t < .72727 ? 7.5625 * (t -= .54545) * t + .75 : t < .90909 ? 7.5625 * (t -= .81818) * t + .9375 : 7.5625 * (t -= .95455) * t + .984375
      }, function (t) {
        return t < .5 ? .5 * _.EaseIn(2 * t) : .5 * _.EaseOut(2 * t - 1) + .5
      });
    return {
      Linear: e,
      Quad: i,
      Cubic: n,
      Quart: r,
      Quint: a,
      Sine: f,
      Expo: p,
      Circ: v,
      Elastic: m,
      Back: g,
      Bounce: _
    }
  }();
  t.Hilo.Ease = e
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo.Class,
    i = e.create({
      load: function (t) {
        var e = this,
          i = new Image;
        t.crossOrigin && (i.crossOrigin = t.crossOrigin), i.onload = function () {
          e.onLoad(i)
        }, i.onerror = i.onabort = e.onError.bind(i), i.src = t.src + (t.noCache ? (t.src.indexOf("?") == -1 ? "?" : "&") + "t=" + +new Date : "")
      },
      onLoad: function (t) {
        return t.onload = t.onerror = t.onabort = null, t
      },
      onError: function (t) {
        var e = t.target;
        return e.onload = e.onerror = e.onabort = null, t
      }
    });
  t.Hilo.ImageLoader = i
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo.Class,
    i = e.create({
      load: function (e) {
        var n = this,
          r = e.src,
          a = "jsonp" == e.type;
        if (a) {
          var o = e.callbackName || "callback",
            s = e.callback || "jsonp" + ++i._count,
            l = t;
          l[s] || (l[s] = function (t) {
            delete l[s]
          }), r += (r.indexOf("?") == -1 ? "?" : "&") + o + "=" + s
        }
        e.noCache && (r += (r.indexOf("?") == -1 ? "?" : "&") + "t=" + +new Date);
        var h = document.createElement("script");
        h.type = "text/javascript", h.async = !0, h.onload = n.onLoad.bind(n), h.onerror = n.onError.bind(n), h.src = r, e.id && (h.id = e.id), document.getElementsByTagName("head")[0].appendChild(h)
      },
      onLoad: function (t) {
        var e = t.target;
        return e.onload = e.onerror = null, e
      },
      onError: function (t) {
        var e = t.target;
        return e.onload = e.onerror = null, t
      },
      Statics: {
        _count: 0
      }
    });
  t.Hilo.ScriptLoader = i
}(window),
function (t) {
  function e(t) {
    var e, i, n = /\/?[^\/]+\.(\w+)(\?\S+)?$/i;
    return (e = t.match(n)) && (i = e[1].toLowerCase()), i || null
  }
  t.Hilo || (t.Hilo = {});
  var i = t.Hilo.Class,
    n = t.Hilo.EventMixin,
    r = t.Hilo.ImageLoader,
    a = t.Hilo.ScriptLoader,
    o = i.create({
      Mixes: n,
      constructor: function (t) {
        this._source = [], this.add(t)
      },
      maxConnections: 2,
      _source: null,
      _loaded: 0,
      _connections: 0,
      _currentIndex: -1,
      add: function (t) {
        var e = this;
        return t && (t = t instanceof Array ? t : [t], e._source = e._source.concat(t)), e
      },
      get: function (t) {
        if (t)
          for (var e = this._source, i = 0; i < e.length; i++) {
            var n = e[i];
            if (n.id === t || n.src === t) return n
          }
        return null
      },
      getContent: function (t) {
        var e = this.get(t);
        return e && e.content
      },
      start: function () {
        var t = this;
        return t._loadNext(), t
      },
      _loadNext: function () {
        var t = this,
          e = t._source,
          i = e.length;
        if (t._loaded >= i) return void t.fire("complete");
        if (t._currentIndex < i - 1 && t._connections < t.maxConnections) {
          var n = ++t._currentIndex,
            r = e[n],
            a = t._getLoader(r);
          if (a) {
            var o = a.onLoad,
              s = a.onError;
            a.onLoad = function (e) {
              a.onLoad = o, a.onError = s;
              var i = o && o.call(a, e) || e.target;
              t._onItemLoad(n, i)
            }, a.onError = function (e) {
              a.onLoad = o, a.onError = s, s && s.call(a, e), t._onItemError(n, e)
            }, t._connections++
          }
          t._loadNext(), a && a.load(r)
        }
      },
      _getLoader: function (t) {
        var i = t.loader;
        if (i) return i;
        var n = t.type || e(t.src);
        switch (n) {
          case "png":
          case "jpg":
          case "jpeg":
          case "gif":
          case "webp":
            i = new r;
            break;
          case "js":
          case "jsonp":
            i = new a
        }
        return i
      },
      _onItemLoad: function (t, e) {
        var i = this,
          n = i._source[t];
        n.loaded = !0, n.content = e, i._connections--, i._loaded++, i.fire("load", n), i._loadNext()
      },
      _onItemError: function (t, e) {
        var i = this,
          n = i._source[t];
        n.error = e, i._connections--, i._loaded++, i.fire("error", n), i._loadNext()
      },
      getSize: function (t) {
        for (var e = 0, i = this._source, n = 0; n < i.length; n++) {
          var r = i[n];
          e += (t ? r.loaded && r.size : r.size) || 0
        }
        return e
      },
      getLoaded: function () {
        return this._loaded
      },
      getTotal: function () {
        return this._source.length
      }
    });
  t.Hilo.LoadQueue = o
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo.Class,
    i = t.Hilo.util,
    n = t.Hilo.EventMixin,
    r = e.create({
      Mixes: n,
      constructor: function (t) {
        i.copy(this, t, !0), this._onAudioEvent = this._onAudioEvent.bind(this)
      },
      src: null,
      loop: !1,
      autoPlay: !1,
      loaded: !1,
      playing: !1,
      duration: 0,
      volume: 1,
      muted: !1,
      _element: null,
      load: function () {
        if (!this._element) {
          var t;
          try {
            t = this._element = new Audio, t.addEventListener("canplaythrough", this._onAudioEvent, !1), t.addEventListener("ended", this._onAudioEvent, !1), t.addEventListener("error", this._onAudioEvent, !1), t.src = this.src, t.volume = this.volume, t.load()
          } catch (e) {
            t = this._element = {}, t.play = t.pause = function () {}
          }
        }
        return this
      },
      _onAudioEvent: function (t) {
        var e = t.type;
        switch (e) {
          case "canplaythrough":
            t.target.removeEventListener(e, this._onAudioEvent), this.loaded = !0, this.duration = this._element.duration, this.fire("load"), this.autoPlay && this._doPlay();
            break;
          case "ended":
            this.playing = !1, this.fire("end"), this.loop && this._doPlay();
            break;
          case "error":
            this.fire("error")
        }
      },
      _doPlay: function () {
        this.playing || (this._element.volume = this.muted ? 0 : this.volume, this._element.play(), this.playing = !0)
      },
      play: function () {
        return this.playing && this.stop(), this._element ? this.loaded && this._doPlay() : (this.autoPlay = !0, this.load()), this
      },
      pause: function () {
        return this.playing && (this._element.pause(), this.playing = !1), this
      },
      resume: function () {
        return this.playing || this._doPlay(), this
      },
      stop: function () {
        return this.playing && (this._element.pause(), this._element.currentTime = 0, this.playing = !1), this
      },
      setVolume: function (t) {
        return this.volume != t && (this.volume = t, this._element.volume = t), this
      },
      setMute: function (t) {
        return this.muted != t && (this.muted = t, this._element.volume = t ? 0 : this.volume), this
      },
      Statics: {
        isSupported: null !== t.Audio
      }
    });
  t.Hilo.HTMLAudio = r
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo.Class,
    i = t.Hilo.util,
    n = t.Hilo.EventMixin,
    r = function () {
      var a = t.AudioContext || t.webkitAudioContext,
        o = a ? new a : null;
      return e.create({
        Mixes: n,
        constructor: function (t) {
          i.copy(this, t, !0), this._init()
        },
        src: null,
        loop: !1,
        autoPlay: !1,
        loaded: !1,
        playing: !1,
        duration: 0,
        volume: 1,
        muted: !1,
        _context: null,
        _gainNode: null,
        _buffer: null,
        _audioNode: null,
        _startTime: 0,
        _offset: 0,
        _init: function () {
          this._context = o, this._gainNode = o.createGain ? o.createGain() : o.createGainNode(), this._gainNode.connect(o.destination), this._onAudioEvent = this._onAudioEvent.bind(this), this._onDecodeComplete = this._onDecodeComplete.bind(this), this._onDecodeError = this._onDecodeError.bind(this)
        },
        load: function () {
          if (!this._buffer) {
            var t = r._bufferCache[this.src];
            if (t) this._onDecodeComplete(t);
            else {
              var e = new XMLHttpRequest;
              e.src = this.src, e.open("GET", this.src, !0),
                e.responseType = "arraybuffer", e.onload = this._onAudioEvent, e.onprogress = this._onAudioEvent, e.onerror = this._onAudioEvent, e.send()
            }
            this._buffer = !0
          }
          return this
        },
        _onAudioEvent: function (t) {
          var e = t.type;
          switch (e) {
            case "load":
              var i = t.target;
              i.onload = i.onprogress = i.onerror = null, this._context.decodeAudioData(i.response, this._onDecodeComplete, this._onDecodeError), i = null;
              break;
            case "ended":
              this.playing = !1, this.fire("end"), this.loop && this._doPlay();
              break;
            case "progress":
              this.fire(t);
              break;
            case "error":
              this.fire(t)
          }
        },
        _onDecodeComplete: function (t) {
          r._bufferCache[this.src] || (r._bufferCache[this.src] = t), this._buffer = t, this.loaded = !0, this.duration = t.duration, this.fire("load"), this.autoPlay && this._doPlay()
        },
        _onDecodeError: function () {
          this.fire("error")
        },
        _doPlay: function () {
          this._clearAudioNode();
          var t = this._context.createBufferSource();
          t.start || (t.start = t.noteOn, t.stop = t.noteOff), t.buffer = this._buffer, t.onended = this._onAudioEvent, this._gainNode.gain.value = this.muted ? 0 : this.volume, t.connect(this._gainNode), t.start(0, this._offset), this._audioNode = t, this._startTime = this._context.currentTime, this.playing = !0
        },
        _clearAudioNode: function () {
          var t = this._audioNode;
          t && (t.onended = null, t.disconnect(0), this._audioNode = null)
        },
        play: function () {
          return this.playing && this.stop(), this.loaded ? this._doPlay() : this._buffer || (this.autoPlay = !0, this.load()), this
        },
        pause: function () {
          return this.playing && (this._audioNode.stop(0), this._offset += this._context.currentTime - this._startTime, this.playing = !1), this
        },
        resume: function () {
          return this.playing || this._doPlay(), this
        },
        stop: function () {
          return this.playing && (this._audioNode.stop(0), this._audioNode.disconnect(), this._offset = 0, this.playing = !1), this
        },
        setVolume: function (t) {
          return this.volume != t && (this.volume = t, this._gainNode.gain.value = t), this
        },
        setMute: function (t) {
          return this.muted != t && (this.muted = t, this._gainNode.gain.value = t ? 0 : this.volume), this
        },
        Statics: {
          isSupported: null != a,
          enabled: !1,
          enable: function () {
            if (!this.enabled && o) {
              var t = o.createBufferSource();
              return t.buffer = o.createBuffer(1, 1, 22050), t.connect(o.destination), t.start ? t.start(0, 0, 0) : t.noteOn(0, 0, 0), this.enabled = !0, !0
            }
            return this.enabled
          },
          _bufferCache: {},
          clearBufferCache: function (t) {
            t ? this._bufferCache[t] = null : this._bufferCache = {}
          }
        }
      })
    }();
  t.Hilo.WebAudio = r
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo.HTMLAudio,
    i = t.Hilo.WebAudio,
    n = t.Hilo.util,
    r = {
      _audios: {},
      enableAudio: function () {
        i.isSupported && i.enable()
      },
      getAudio: function (t, n) {
        void 0 === n && (n = !0), t = this._normalizeSource(t);
        var r = this._audios[t.src];
        return r || (n && i.isSupported ? r = new i(t) : e.isSupported && (r = new e(t)), this._audios[t.src] = r), r
      },
      removeAudio: function (t) {
        var e = "string" == typeof t ? t : t.src,
          i = this._audios[e];
        i && (i.stop(), i.off(), this._audios[e] = null, delete this._audios[e])
      },
      _normalizeSource: function (t) {
        var e = {};
        return "string" == typeof t ? e = {
          src: t
        } : n.copy(e, t), e
      }
    };
  t.Hilo.WebSound = r
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo.Class,
    i = t.Hilo.util,
    n = e.create({
      constructor: function (t) {
        this.width = 0, this.height = 0, this.target = null, this.deadzone = null, this.bounds = null, this.scroll = {
          x: 0,
          y: 0
        }, i.copy(this, t)
      },
      tick: function (t) {
        var e = this.target,
          i = this.scroll,
          n = this.bounds,
          r = this.deadzone;
        if (e) {
          var a, o;
          r ? (a = Math.min(Math.max(e.x - i.x, r[0]), r[0] + r[2]), o = Math.min(Math.max(e.y - i.y, r[1]), r[1] + r[3])) : (a = .5 * this.width, o = .5 * this.height), i.x = e.x - a, i.y = e.y - o, n && (i.x = Math.min(Math.max(i.x, n[0]), n[0] + n[2]), i.y = Math.min(Math.max(i.y, n[1]), n[1] + n[3]))
        } else i.x = 0, i.y = 0
      },
      follow: function (t, e) {
        this.target = t, void 0 !== e && (this.deadzone = e), this.tick()
      }
    });
  t.Hilo.Camera = n
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo.Class,
    i = t.Hilo.util,
    n = function () {
      function t(t, e, i, n, r) {
        return {
          x: t,
          y: e * n - i * r,
          z: e * r + i * n
        }
      }

      function n(t, e, i, n, r) {
        return {
          x: t * n - i * r,
          y: e,
          z: t * r + i * n
        }
      }

      function r(t, e, i, n, r) {
        return {
          x: t * n - e * r,
          y: t * r + e * n,
          z: i
        }
      }
      var a = Math.PI / 180,
        o = e.create({
          constructor: function (t) {
            t.x = t.x || 0, t.y = t.y || 0, t.z = t.z || 0, t.rotationX = t.rotationX || 0, t.rotationY = t.rotationY || 0, t.rotationZ = t.rotationZ || 0, i.copy(this, t)
          },
          translate: function (t, e, i) {
            this.tx = t, this.ty = e, this.tz = i
          },
          rotateX: function (t) {
            this.rotationX = t
          },
          rotateY: function (t) {
            this.rotationY = t
          },
          rotateZ: function (t) {
            this.rotationZ = t
          },
          project: function (e, i) {
            var o = this.rotationX * a,
              s = this.rotationY * a,
              l = this.rotationZ * a,
              h = Math.cos(o),
              c = Math.sin(o),
              u = Math.cos(s),
              d = Math.sin(s),
              f = Math.cos(l),
              p = Math.sin(l),
              v = e.x - this.x,
              m = e.y - this.y,
              g = e.z - this.z,
              _ = r(v, m, g, f, p);
            _ = n(_.x, _.y, _.z, u, d), _ = t(_.x, _.y, _.z, h, c), this.tx && (_.x -= this.tx), this.ty && (_.y -= this.ty), this.tz && (_.z -= this.tz);
            var x = this.fv / (this.fv + _.z),
              y = _.x * x,
              w = -_.y * x,
              T = {
                x: y + this.fx,
                y: w + this.fy,
                z: -_.z,
                scale: x
              };
            return i && (i.x = T.x, i.y = T.y, i.z = T.z, i.scaleX = T.scale, i.scaleY = T.scale), T
          },
          sortZ: function () {
            this.stage.children.sort(function (t, e) {
              return t.z > e.z
            })
          },
          tick: function () {
            this.sortZ()
          }
        });
      return o
    }();
  t.Hilo.Camera3d = n
}(window),
function (t) {
  t.Hilo || (t.Hilo = {});
  var e = t.Hilo,
    i = t.Hilo.Class,
    n = t.Hilo.View,
    r = t.Hilo.Container,
    a = t.Hilo.Drawable,
    o = t.Hilo.util,
    s = function () {
      function t(t, e) {
        return e ? t + 2 * (Math.random() - .5) * e : t
      }
      for (var s = ["x", "y", "vx", "vy", "ax", "ay", "rotation", "rotationV", "scale", "scaleV", "alpha", "alphaV", "life"], l = [], h = 0, c = s.length; h < c; h++) {
        var u = s[h];
        l.push(u), l.push(u + "Var")
      }
      var d = {
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          ax: 0,
          ay: 0,
          scale: 1,
          scaleV: 0,
          alpha: 1,
          alphaV: 0,
          rotation: 0,
          rotationV: 0,
          life: 1
        },
        f = [],
        p = i.create({
          Extends: r,
          constructor: function (t) {
            this.id = this.id || t.id || e.getUid("ParticleSystem"), this.emitterX = 0, this.emitterY = 0, this.gx = 0, this.gy = 0, this.totalTime = 1 / 0, this.emitNum = 10, this.emitNumVar = 0, this.emitTime = .2, this.emitTimeVar = 0, this.particle = {}, p.superclass.constructor.call(this, t), this.reset(t)
          },
          Statics: {
            PROPS: l,
            PROPS_DEFAULT: d,
            diedParticles: f
          },
          reset: function (t) {
            o.copy(this, t), this.particle.system = this, this.totalTime <= 0 && (this.totalTime = 1 / 0)
          },
          onUpdate: function (e) {
            e *= .001, this._isRun && (this._totalRunTime += e, this._currentRunTime += e, this._currentRunTime >= this._emitTime && (this._currentRunTime = 0, this._emitTime = t(this.emitTime, this.emitTimeVar), this._emit()), this._totalRunTime >= this.totalTime && this.stop())
          },
          _emit: function () {
            for (var e = t(this.emitNum, this.emitNumVar) >> 0, i = 0; i < e; i++) this.addChild(v.create(this.particle))
          },
          start: function () {
            this.stop(!0), this._currentRunTime = 0, this._totalRunTime = 0, this._isRun = !0, this._emitTime = t(this.emitTime, this.emitTimeVar)
          },
          stop: function (t) {
            if (this._isRun = !1, t)
              for (var e = this.children.length - 1; e >= 0; e--) this.children[e].destroy()
          }
        }),
        v = i.create({
          Extends: n,
          constructor: function (t) {
            this.id = this.id || t.id || e.getUid("Particle"), v.superclass.constructor.call(this, t), this.init(t)
          },
          onUpdate: function (t) {
            if (t *= .001, this._died) return !1;
            var e = this.ax + this.system.gx,
              i = this.ay + this.system.gy;
            return this.vx += e * t, this.vy += i * t, this.x += this.vx * t, this.y += this.vy * t, this.rotation += this.rotationV, this._time > .1 && (this.alpha += this.alphaV), this.scale += this.scaleV, this.scaleX = this.scaleY = this.scale, this._time += t, this._time >= this.life || this.alpha <= 0 ? (this.destroy(), !1) : void 0
          },
          setImage: function (t, e) {
            this.drawable = this.drawable || new a, e = e || [0, 0, t.width, t.height], this.width = e[2], this.height = e[3], this.drawable.rect = e, this.drawable.image = t
          },
          destroy: function () {
            this._died = !0, this.alpha = 0, this.removeFromParent(), f.push(this)
          },
          init: function (e) {
            this.system = e.system, this._died = !1, this._time = 0, this.alpha = 1;
            for (var i = 0, n = l.length; i < n; i++) {
              var r = l[i],
                a = void 0 === e[r] ? d[r] : e[r];
              this[r] = t(a, e[r + "Var"])
            }
            if (this.x += this.system.emitterX, this.y += this.system.emitterY, e.image) {
              var o = e.frame;
              o && o[0].length && (o = o[Math.random() * o.length >> 0]), this.setImage(e.image, o), void 0 !== e.pivotX && (this.pivotX = e.pivotX * o[2]), void 0 !== e.pivotY && (this.pivotY = e.pivotY * o[3])
            }
          },
          Statics: {
            create: function (t) {
              if (f.length > 0) {
                var e = f.pop();
                return e.init(t), e
              }
              return new v(t)
            }
          }
        });
      return p
    }();
  t.Hilo.ParticleSystem = s
}(window);