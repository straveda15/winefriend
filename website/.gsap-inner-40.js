__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ScrollTrigger: () => (/* binding */ ScrollTrigger),
/* harmony export */   "default": () => (/* binding */ ScrollTrigger)
/* harmony export */ });
/* harmony import */ var _Observer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Observer.js */ "(app-pages-browser)/../node_modules/gsap/Observer.js");
/*!
 * ScrollTrigger 3.15.1
 * https://gsap.com
 *
 * @license Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/

/* eslint-disable */


var gsap,
    _coreInitted,
    _win,
    _doc,
    _docEl,
    _body,
    _root,
    _resizeDelay,
    _toArray,
    _clamp,
    _time2,
    _syncInterval,
    _refreshing,
    _pointerIsDown,
    _transformProp,
    _i,
    _prevWidth,
    _prevHeight,
    _autoRefresh,
    _sort,
    _suppressOverwrites,
    _ignoreResize,
    _normalizer,
    _ignoreMobileResize,
    _baseScreenHeight,
    _baseScreenWidth,
    _fixIOSBug,
    _context,
    _scrollRestoration,
    _div100vh,
    _100vh,
    _isReverted,
    _clampingMax,
    _limitCallbacks,
    // if true, we'll only trigger callbacks if the active state toggles, so if you scroll immediately past both the start and end positions of a ScrollTrigger (thus inactive to inactive), neither its onEnter nor onLeave will be called. This is useful during startup.
_startup = 1,
    _getTime = Date.now,
    _time1 = _getTime(),
    _lastScrollTime = 0,
    _enabled = 0,
    _parseClamp = function _parseClamp(value, type, self) {
  var clamp = _isString(value) && (value.substr(0, 6) === "clamp(" || value.indexOf("max") > -1);
  self["_" + type + "Clamp"] = clamp;
  return clamp ? value.substr(6, value.length - 7) : value;
},
    _keepClamp = function _keepClamp(value, clamp) {
  return clamp && (!_isString(value) || value.substr(0, 6) !== "clamp(") ? "clamp(" + value + ")" : value;
},
    _rafBugFix = function _rafBugFix() {
  return _enabled && requestAnimationFrame(_rafBugFix);
},
    // in some browsers (like Firefox), screen repaints weren't consistent unless we had SOMETHING queued up in requestAnimationFrame()! So this just creates a super simple loop to keep it alive and smooth out repaints.
_pointerDownHandler = function _pointerDownHandler() {
  return _pointerIsDown = 1;
},
    _pointerUpHandler = function _pointerUpHandler() {
  return _pointerIsDown = 0;
},
    _passThrough = function _passThrough(v) {
  return v;
},
    _round = function _round(value) {
  return Math.round(value * 100000) / 100000 || 0;
},
    _windowExists = function _windowExists() {
  return typeof window !== "undefined";
},
    _getGSAP = function _getGSAP() {
  return gsap || _windowExists() && (gsap = window.gsap) && gsap.registerPlugin && gsap;
},
    _isViewport = function _isViewport(e) {
  return !!~_root.indexOf(e);
},
    _getViewportDimension = function _getViewportDimension(dimensionProperty) {
  return (dimensionProperty === "Height" ? _100vh : _win["inner" + dimensionProperty]) || _docEl["client" + dimensionProperty] || _body["client" + dimensionProperty];
},
    _getBoundsFunc = function _getBoundsFunc(element) {
  return (0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__._getProxyProp)(element, "getBoundingClientRect") || (_isViewport(element) ? function () {
    _winOffsets.width = _win.innerWidth;
    _winOffsets.height = _100vh;
    return _winOffsets;
  } : function () {
    return _getBounds(element);
  });
},
    _getSizeFunc = function _getSizeFunc(scroller, isViewport, _ref) {
  var d = _ref.d,
      d2 = _ref.d2,
      a = _ref.a;
  return (a = (0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__._getProxyProp)(scroller, "getBoundingClientRect")) ? function () {
    return a()[d];
  } : function () {
    return (isViewport ? _getViewportDimension(d2) : scroller["client" + d2]) || 0;
  };
},
    _getOffsetsFunc = function _getOffsetsFunc(element, isViewport) {
  return !isViewport || ~_Observer_js__WEBPACK_IMPORTED_MODULE_0__._proxies.indexOf(element) ? _getBoundsFunc(element) : function () {
    return _winOffsets;
  };
},
    _maxScroll = function _maxScroll(element, _ref2) {
  var s = _ref2.s,
      d2 = _ref2.d2,
      d = _ref2.d,
      a = _ref2.a;
  return Math.max(0, (s = "scroll" + d2) && (a = (0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__._getProxyProp)(element, s)) ? a() - _getBoundsFunc(element)()[d] : _isViewport(element) ? (_docEl[s] || _body[s]) - _getViewportDimension(d2) : element[s] - element["offset" + d2]);
},
    _iterateAutoRefresh = function _iterateAutoRefresh(func, events) {
  for (var i = 0; i < _autoRefresh.length; i += 3) {
    (!events || ~events.indexOf(_autoRefresh[i + 1])) && func(_autoRefresh[i], _autoRefresh[i + 1], _autoRefresh[i + 2]);
  }
},
    _isString = function _isString(value) {
  return typeof value === "string";
},
    _isFunction = function _isFunction(value) {
  return typeof value === "function";
},
    _isNumber = function _isNumber(value) {
  return typeof value === "number";
},
    _isObject = function _isObject(value) {
  return typeof value === "object";
},
    _endAnimation = function _endAnimation(animation, reversed, pause) {
  return animation && animation.progress(reversed ? 0 : 1) && pause && animation.pause();
},
    _callback = function _callback(self, func, extraParam) {
  if (self.enabled) {
    var result = self._ctx ? self._ctx.add(function () {
      return func(self, extraParam);
    }) : func(self, extraParam);
    result && result.totalTime && (self.callbackAnimation = result);
  }
},
    _abs = Math.abs,
    _left = "left",
    _top = "top",
    _right = "right",
    _bottom = "bottom",
    _width = "width",
    _height = "height",
    _Right = "Right",
    _Left = "Left",
    _Top = "Top",
    _Bottom = "Bottom",
    _padding = "padding",
    _margin = "margin",
    _Width = "Width",
    _Height = "Height",
    _px = "px",
    _getComputedStyle = function _getComputedStyle(element) {
  return _win.getComputedStyle(element.nodeType === Node.DOCUMENT_NODE ? element.scrollingElement : element);
},
    _makePositionable = function _makePositionable(element) {
  // if the element already has position: absolute or fixed, leave that, otherwise make it position: relative
  var position = _getComputedStyle(element).position;

  element.style.position = position === "absolute" || position === "fixed" ? position : "relative";
},
    _setDefaults = function _setDefaults(obj, defaults) {
  for (var p in defaults) {
    p in obj || (obj[p] = defaults[p]);
  }

  return obj;
},
    _getBounds = function _getBounds(element, withoutTransforms) {
  var tween = withoutTransforms && _getComputedStyle(element)[_transformProp] !== "matrix(1, 0, 0, 1, 0, 0)" && gsap.to(element, {
    x: 0,
    y: 0,
    xPercent: 0,
    yPercent: 0,
    rotation: 0,
    rotationX: 0,
    rotationY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0
  }).progress(1),
      bounds = element.getBoundingClientRect ? element.getBoundingClientRect() : element.scrollingElement.getBoundingClientRect();
  tween && tween.progress(0).kill();
  return bounds;
},
    _getSize = function _getSize(element, _ref3) {
  var d2 = _ref3.d2;
  return element["offset" + d2] || element["client" + d2] || 0;
},
    _getLabelRatioArray = function _getLabelRatioArray(timeline) {
  var a = [],
      labels = timeline.labels,
      duration = timeline.duration(),
      p;

  for (p in labels) {
    a.push(labels[p] / duration);
  }

  return a;
},
    _getClosestLabel = function _getClosestLabel(animation) {
  return function (value) {
    return gsap.utils.snap(_getLabelRatioArray(animation), value);
  };
},
    _snapDirectional = function _snapDirectional(snapIncrementOrArray) {
  var snap = gsap.utils.snap(snapIncrementOrArray),
      a = Array.isArray(snapIncrementOrArray) && snapIncrementOrArray.slice(0).sort(function (a, b) {
    return a - b;
  });
  return a ? function (value, direction, threshold) {
    if (threshold === void 0) {
      threshold = 1e-3;
    }

    var i;

    if (!direction) {
      return snap(value);
    }

    if (direction > 0) {
      value -= threshold; // to avoid rounding errors. If we're too strict, it might snap forward, then immediately again, and again.

      for (i = 0; i < a.length; i++) {
        if (a[i] >= value) {
          return a[i];
        }
      }

      return a[i - 1];
    } else {
      i = a.length;
      value += threshold;

      while (i--) {
        if (a[i] <= value) {
          return a[i];
        }
      }
    }

    return a[0];
  } : function (value, direction, threshold) {
    if (threshold === void 0) {
      threshold = 1e-3;
    }

    var snapped = snap(value);
    return !direction || Math.abs(snapped - value) < threshold || snapped - value < 0 === direction < 0 ? snapped : snap(direction < 0 ? value - snapIncrementOrArray : value + snapIncrementOrArray);
  };
},
    _getLabelAtDirection = function _getLabelAtDirection(timeline) {
  return function (value, st) {
    return _snapDirectional(_getLabelRatioArray(timeline))(value, st.direction);
  };
},
    _multiListener = function _multiListener(func, element, types, callback) {
  return types.split(",").forEach(function (type) {
    return func(element, type, callback);
  });
},
    _addListener = function _addListener(element, type, func, nonPassive, capture) {
  return element.addEventListener(type, func, {
    passive: !nonPassive,
    capture: !!capture
  });
},
    _removeListener = function _removeListener(element, type, func, capture) {
  return element.removeEventListener(type, func, !!capture);
},
    _wheelListener = function _wheelListener(func, el, scrollFunc) {
  scrollFunc = scrollFunc && scrollFunc.wheelHandler;

  if (scrollFunc) {
    func(el, "wheel", scrollFunc);
    func(el, "touchmove", scrollFunc);
  }
},
    _markerDefaults = {
  startColor: "green",
  endColor: "red",
  indent: 0,
  fontSize: "16px",
  fontWeight: "normal"
},
    _defaults = {
  toggleActions: "play",
  anticipatePin: 0
},
    _keywords = {
  top: 0,
  left: 0,
  center: 0.5,
  bottom: 1,
  right: 1
},
    _offsetToPx = function _offsetToPx(value, size) {
  if (_isString(value)) {
    var eqIndex = value.indexOf("="),
        relative = ~eqIndex ? +(value.charAt(eqIndex - 1) + 1) * parseFloat(value.substr(eqIndex + 1)) : 0;

    if (~eqIndex) {
      value.indexOf("%") > eqIndex && (relative *= size / 100);
      value = value.substr(0, eqIndex - 1);
    }

    value = relative + (value in _keywords ? _keywords[value] * size : ~value.indexOf("%") ? parseFloat(value) * size / 100 : parseFloat(value) || 0);
  }

  return value;
},
    _createMarker = function _createMarker(type, name, container, direction, _ref4, offset, matchWidthEl, containerAnimation) {
  var startColor = _ref4.startColor,
      endColor = _ref4.endColor,
      fontSize = _ref4.fontSize,
      indent = _ref4.indent,
      fontWeight = _ref4.fontWeight;

  var e = _doc.createElement("div"),
      useFixedPosition = _isViewport(container) || (0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__._getProxyProp)(container, "pinType") === "fixed",
      isScroller = type.indexOf("scroller") !== -1,
      parent = useFixedPosition ? _body : container.tagName === "IFRAME" ? container.contentDocument.body : container,
      isStart = type.indexOf("start") !== -1,
      color = isStart ? startColor : endColor,
      css = "border-color:" + color + ";font-size:" + fontSize + ";color:" + color + ";font-weight:" + fontWeight + ";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";

  css += "position:" + ((isScroller || containerAnimation) && useFixedPosition ? "fixed;" : "absolute;");
  (isScroller || containerAnimation || !useFixedPosition) && (css += (direction === _Observer_js__WEBPACK_IMPORTED_MODULE_0__._vertical ? _right : _bottom) + ":" + (offset + parseFloat(indent)) + "px;");
  matchWidthEl && (css += "box-sizing:border-box;text-align:left;width:" + matchWidthEl.offsetWidth + "px;");
  e._isStart = isStart;
  e.setAttribute("class", "gsap-marker-" + type + (name ? " marker-" + name : ""));
  e.style.cssText = css;
  e.innerText = name || name === 0 ? type + "-" + name : type;
  parent.children[0] ? parent.insertBefore(e, parent.children[0]) : parent.appendChild(e);
  e._offset = e["offset" + direction.op.d2];

  _positionMarker(e, 0, direction, isStart);

  return e;
},
    _positionMarker = function _positionMarker(marker, start, direction, flipped) {
  var vars = {
    display: "block"
  },
      side = direction[flipped ? "os2" : "p2"],
      oppositeSide = direction[flipped ? "p2" : "os2"];
  marker._isFlipped = flipped;
  vars[direction.a + "Percent"] = flipped ? -100 : 0;
  vars[direction.a] = flipped ? "1px" : 0;
  vars["border" + side + _Width] = 1;
  vars["border" + oppositeSide + _Width] = 0;
  vars[direction.p] = start + "px";
  gsap.set(marker, vars);
},
    _triggers = [],
    _ids = {},
    _rafID,
    _sync = function _sync() {
  return _getTime() - _lastScrollTime > 34 && (_rafID || (_rafID = requestAnimationFrame(_updateAll)));
},
    _onScroll = function _onScroll() {
  // previously, we tried to optimize performance by batching/deferring to the next requestAnimationFrame(), but discovered that Safari has a few bugs that make this unworkable (especially on iOS). See https://codepen.io/GreenSock/pen/16c435b12ef09c38125204818e7b45fc?editors=0010 and https://codepen.io/GreenSock/pen/JjOxYpQ/3dd65ccec5a60f1d862c355d84d14562?editors=0010 and https://codepen.io/GreenSock/pen/ExbrPNa/087cef197dc35445a0951e8935c41503?editors=0010
  if (!_normalizer || !_normalizer.isPressed || _normalizer.startX > _body.clientWidth) {
    // if the user is dragging the scrollbar, allow it.
    _Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers.cache++;

    if (_normalizer) {
      _rafID || (_rafID = requestAnimationFrame(_updateAll));
    } else {
      _updateAll(); // Safari in particular (on desktop) NEEDS the immediate update rather than waiting for a requestAnimationFrame() whereas iOS seems to benefit from waiting for the requestAnimationFrame() tick, at least when normalizing. See https://codepen.io/GreenSock/pen/qBYozqO?editors=0110

    }

    _lastScrollTime || _dispatch("scrollStart");
    _lastScrollTime = _getTime();
  }
},
    _setBaseDimensions = function _setBaseDimensions() {
  _baseScreenWidth = _win.innerWidth;
  _baseScreenHeight = _win.innerHeight;
},
    _onResize = function _onResize(force) {
  _Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers.cache++;
  (force === true || !_refreshing && !_ignoreResize && !_doc.fullscreenElement && !_doc.webkitFullscreenElement && (!_ignoreMobileResize || _baseScreenWidth !== _win.innerWidth || Math.abs(_win.innerHeight - _baseScreenHeight) > _win.innerHeight * 0.25)) && _resizeDelay.restart(true);
},
    // ignore resizes triggered by refresh()
_listeners = {},
    _emptyArray = [],
    _softRefresh = function _softRefresh() {
  return _removeListener(ScrollTrigger, "scrollEnd", _softRefresh) || _refreshAll(true);
},
    _dispatch = function _dispatch(type) {
  return _listeners[type] && _listeners[type].map(function (f) {
    return f();
  }) || _emptyArray;
},
    _savedStyles = [],
    // when ScrollTrigger.saveStyles() is called, the inline styles are recorded in this Array in a sequential format like [element, cssText, gsCache, media]. This keeps it very memory-efficient and fast to iterate through.
_revertRecorded = function _revertRecorded(media) {
  for (var i = 0; i < _savedStyles.length; i += 5) {
    if (!media || _savedStyles[i + 4] && _savedStyles[i + 4].query === media) {
      _savedStyles[i].style.cssText = _savedStyles[i + 1];
      _savedStyles[i].getBBox && _savedStyles[i].setAttribute("transform", _savedStyles[i + 2] || "");
      _savedStyles[i + 3].uncache = 1;
    }
  }
},
    _recordScrollPositions = function _recordScrollPositions() {
  // record the current scroll position. Force a fresh read by bumping the shared cache (not each cacheID — after exactly one scroll event, ++cacheID can make cacheID === cache and return a stale value). Also some browsers take a little while to dispatch the "scroll" event and the user may have changed the scroll position and then called ScrollTrigger.refresh() right away
  _Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers.cache++;

  _Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers.forEach(function (obj) {
    return _isFunction(obj) && (obj.rec = obj());
  });
},
    _revertAll = function _revertAll(kill, media) {
  var trigger;

  for (_i = 0; _i < _triggers.length; _i++) {
    trigger = _triggers[_i];

    if (trigger && (!media || trigger._ctx === media)) {
      if (kill) {
        trigger.kill(1);
      } else {
        trigger.revert(true, true);
      }
    }
  }

  _isReverted = true;
  media && _revertRecorded(media);
  media || _dispatch("revert");
},
    _clearScrollMemory = function _clearScrollMemory(scrollRestoration, force) {
  // zero-out all the recorded scroll positions. Don't use _triggers because if, for example, .matchMedia() is used to create some ScrollTriggers and then the user resizes and it removes ALL ScrollTriggers, and then go back to a size where there are ScrollTriggers, it would have kept the position(s) saved from the initial state.
  _Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers.cache++;
  (force || !_refreshingAll) && _Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers.forEach(function (obj) {
    return _isFunction(obj) && obj.cacheID++ && (obj.rec = 0);
  });

  if (_isString(scrollRestoration)) {
    _scrollRestoration = scrollRestoration;
    _win.history.scrollRestoration !== scrollRestoration && (_win.history.scrollRestoration = scrollRestoration);
  }
},
    _refreshingAll,
    _refreshID = 0,
    _queueRefreshID,
    _queueRefreshAll = function _queueRefreshAll() {
  // we don't want to call _refreshAll() every time we create a new ScrollTrigger (for performance reasons) - it's better to batch them. Some frameworks dynamically load content and we can't rely on the window's "load" or "DOMContentLoaded" events to trigger it.
  if (_queueRefreshID !== _refreshID) {
    var id = _queueRefreshID = _refreshID;
    requestAnimationFrame(function () {
      return id === _refreshID && _refreshAll(true);
    });
  }
},
    _refresh100vh = function _refresh100vh() {
  _body.appendChild(_div100vh);

  _100vh = !_normalizer && _div100vh.offsetHeight || _win.innerHeight;

  _body.removeChild(_div100vh);
},
    _hideAllMarkers = function _hideAllMarkers(hide) {
  return _toArray(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end").forEach(function (el) {
    return el.style.display = hide ? "none" : "block";
  });
},
    _refreshAll = function _refreshAll(force, skipRevert) {
  _docEl = _doc.documentElement; // some frameworks like Astro may cache the <body> and replace it during routing, so we'll just re-record the _docEl and _body for safety (otherwise, the markers may not get added properly).

  _body = _doc.body;
  _root = [_win, _doc, _docEl, _body];

  if (_lastScrollTime && !force && !_isReverted) {
    _addListener(ScrollTrigger, "scrollEnd", _softRefresh);

    return;
  }

  _refresh100vh();

  _refreshingAll = ScrollTrigger.isRefreshing = true;
  _isReverted || _recordScrollPositions();

  var refreshInits = _dispatch("refreshInit");

  _sort && ScrollTrigger.sort();
  skipRevert || _revertAll();

  _Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers.forEach(function (obj) {
    if (_isFunction(obj)) {
      obj.smooth && (obj.target.style.scrollBehavior = "auto"); // smooth scrolling interferes

      obj(0);
    }
  });

  _triggers.slice(0).forEach(function (t) {
    return t.refresh();
  }); // don't loop with _i because during a refresh() someone could call ScrollTrigger.update() which would iterate through _i resulting in a skip.


  _isReverted = false;

  _triggers.forEach(function (t) {
    // nested pins (pinnedContainer) with pinSpacing may expand the container, so we must accommodate that here.
    if (t._subPinOffset && t.pin) {
      var prop = t.vars.horizontal ? "offsetWidth" : "offsetHeight",
          original = t.pin[prop];
      t.revert(true, 1);
      t.adjustPinSpacing(t.pin[prop] - original);
      t.refresh();
    }
  });

  _clampingMax = 1; // pinSpacing might be propping a page open, thus when we .setPositions() to clamp a ScrollTrigger's end we should leave the pinSpacing alone. That's what this flag is for.

  _hideAllMarkers(true);

  _triggers.forEach(function (t) {
    // the scroller's max scroll position may change after all the ScrollTriggers refreshed (like pinning could push it down), so we need to loop back and correct any with end: "max". Same for anything with a clamped end
    var max = _maxScroll(t.scroller, t._dir),
        endClamp = t.vars.end === "max" || t._endClamp && t.end > max,
        startClamp = t._startClamp && t.start >= max;

    (endClamp || startClamp) && t.setPositions(startClamp ? max - 1 : t.start, endClamp ? Math.max(startClamp ? max : t.start + 1, max) : t.end, true);
  });

  _hideAllMarkers(false);

  _clampingMax = 0;
  refreshInits.forEach(function (result) {
    return result && result.render && result.render(-1);
  }); // if the onRefreshInit() returns an animation (typically a gsap.set()), revert it. This makes it easy to put things in a certain spot before refreshing for measurement purposes, and then put things back.

  _Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers.forEach(function (obj) {
    if (_isFunction(obj)) {
      obj.smooth && requestAnimationFrame(function () {
        return obj.target.style.scrollBehavior = "smooth";
      });
      obj.rec && obj(obj.rec);
    }
  });

  _clearScrollMemory(_scrollRestoration, 1);

  _resizeDelay.pause();

  _refreshID++;
  _refreshingAll = 2;

  _updateAll(2);

  _triggers.forEach(function (t) {
    return _isFunction(t.vars.onRefresh) && t.vars.onRefresh(t);
  });

  _refreshingAll = ScrollTrigger.isRefreshing = false;

  _dispatch("refresh");
},
    _lastScroll = 0,
    _direction = 1,
    _primary,
    _updateAll = function _updateAll(force) {
  if (force === 2 || !_refreshingAll && !_isReverted) {
    // _isReverted could be true if, for example, a matchMedia() is in the process of executing. We don't want to update during the time everything is reverted.
    ScrollTrigger.isUpdating = true;
    _primary && _primary.update(0); // ScrollSmoother uses refreshPriority -9999 to become the primary that gets updated before all others because it affects the scroll position.

    var l = _triggers.length,
        time = _getTime(),
        recordVelocity = time - _time1 >= 50,
        scroll = l && _triggers[0].scroll();

    _direction = _lastScroll > scroll ? -1 : 1;
    _refreshingAll || (_lastScroll = scroll);

    if (recordVelocity) {
      if (_lastScrollTime && !_pointerIsDown && time - _lastScrollTime > 200) {
        _lastScrollTime = 0;

        _dispatch("scrollEnd");
      }

      _time2 = _time1;
      _time1 = time;
    }

    if (_direction < 0) {
      _i = l;

      while (_i-- > 0) {
        _triggers[_i] && _triggers[_i].update(0, recordVelocity);
      }

      _direction = 1;
    } else {
      for (_i = 0; _i < l; _i++) {
        _triggers[_i] && _triggers[_i].update(0, recordVelocity);
      }
    }

    ScrollTrigger.isUpdating = false;
  }

  _rafID = 0;
},
    _propNamesToCopy = [_left, _top, _bottom, _right, _margin + _Bottom, _margin + _Right, _margin + _Top, _margin + _Left, "display", "flexShrink", "float", "zIndex", "gridColumnStart", "gridColumnEnd", "gridRowStart", "gridRowEnd", "gridArea", "justifySelf", "alignSelf", "placeSelf", "order"],
    _stateProps = _propNamesToCopy.concat([_width, _height, "boxSizing", "max" + _Width, "max" + _Height, "position", _margin, _padding, _padding + _Top, _padding + _Right, _padding + _Bottom, _padding + _Left]),
    _swapPinOut = function _swapPinOut(pin, spacer, state) {
  _setState(state);

  var cache = pin._gsap;

  if (cache.spacerIsNative) {
    _setState(cache.spacerState);
  } else if (pin._gsap.swappedIn) {
    var parent = spacer.parentNode;

    if (parent) {
      parent.insertBefore(pin, spacer);
      parent.removeChild(spacer);
    }
  }

  pin._gsap.swappedIn = false;
},
    _swapPinIn = function _swapPinIn(pin, spacer, cs, spacerState) {
  if (!pin._gsap.swappedIn) {
    var i = _propNamesToCopy.length,
        spacerStyle = spacer.style,
        pinStyle = pin.style,
        p;

    while (i--) {
      p = _propNamesToCopy[i];
      spacerStyle[p] = cs[p];
    }

    spacerStyle.position = cs.position === "absolute" ? "absolute" : "relative";
    cs.display === "inline" && (spacerStyle.display = "inline-block");
    pinStyle[_bottom] = pinStyle[_right] = "auto";
    spacerStyle.flexBasis = cs.flexBasis || "auto";
    spacerStyle.overflow = "visible";
    spacerStyle.boxSizing = "border-box";
    spacerStyle[_width] = _getSize(pin, _Observer_js__WEBPACK_IMPORTED_MODULE_0__._horizontal) + _px;
    spacerStyle[_height] = _getSize(pin, _Observer_js__WEBPACK_IMPORTED_MODULE_0__._vertical) + _px;
    spacerStyle[_padding] = pinStyle[_margin] = pinStyle[_top] = pinStyle[_left] = "0";

    _setState(spacerState);

    pinStyle[_width] = pinStyle["max" + _Width] = cs[_width];
    pinStyle[_height] = pinStyle["max" + _Height] = cs[_height];
    pinStyle[_padding] = cs[_padding];

    if (pin.parentNode !== spacer) {
      pin.parentNode.insertBefore(spacer, pin);
      spacer.appendChild(pin);
    }

    pin._gsap.swappedIn = true;
  }
},
    _capsExp = /([A-Z])/g,
    _setState = function _setState(state) {
  if (state) {
    var style = state.t.style,
        l = state.length,
        i = 0,
        p,
        value;
    (state.t._gsap || gsap.core.getCache(state.t)).uncache = 1; // otherwise transforms may be off

    for (; i < l; i += 2) {
      value = state[i + 1];
      p = state[i];

      if (value) {
        style[p] = value;
      } else if (style[p]) {
        style.removeProperty(p.replace(_capsExp, "-$1").toLowerCase());
      }
    }
  }
},
    _getState = function _getState(element) {
  // returns an Array with alternating values like [property, value, property, value] and a "t" property pointing to the target (element). Makes it fast and cheap.
  var l = _stateProps.length,
      style = element.style,
      state = [],
      i = 0;

  for (; i < l; i++) {
    state.push(_stateProps[i], style[_stateProps[i]]);
  }

  state.t = element;
  return state;
},
    _copyState = function _copyState(state, override, omitOffsets) {
  var result = [],
      l = state.length,
      i = omitOffsets ? 8 : 0,
      // skip top, left, right, bottom if omitOffsets is true
  p;

  for (; i < l; i += 2) {
    p = state[i];
    result.push(p, p in override ? override[p] : state[i + 1]);
  }

  result.t = state.t;
  return result;
},
    _winOffsets = {
  left: 0,
  top: 0
},
    // // potential future feature (?) Allow users to calculate where a trigger hits (scroll position) like getScrollPosition("#id", "top bottom")
// _getScrollPosition = (trigger, position, {scroller, containerAnimation, horizontal}) => {
// 	scroller = _getTarget(scroller || _win);
// 	let direction = horizontal ? _horizontal : _vertical,
// 		isViewport = _isViewport(scroller);
// 	_getSizeFunc(scroller, isViewport, direction);
// 	return _parsePosition(position, _getTarget(trigger), _getSizeFunc(scroller, isViewport, direction)(), direction, _getScrollFunc(scroller, direction)(), 0, 0, 0, _getOffsetsFunc(scroller, isViewport)(), isViewport ? 0 : parseFloat(_getComputedStyle(scroller)["border" + direction.p2 + _Width]) || 0, 0, containerAnimation ? containerAnimation.duration() : _maxScroll(scroller), containerAnimation);
// },
_parsePosition = function _parsePosition(value, trigger, scrollerSize, direction, scroll, marker, markerScroller, self, scrollerBounds, borderWidth, useFixedPosition, scrollerMax, containerAnimation, clampZeroProp) {
  _isFunction(value) && (value = value(self));

  if (_isString(value) && value.substr(0, 3) === "max") {
    value = scrollerMax + (value.charAt(4) === "=" ? _offsetToPx("0" + value.substr(3), scrollerSize) : 0);
  }

  var time = containerAnimation ? containerAnimation.time() : 0,
      p1,
      p2,
      element;
  containerAnimation && containerAnimation.seek(0);
  isNaN(value) || (value = +value); // convert a string number like "45" to an actual number

  if (!_isNumber(value)) {
    _isFunction(trigger) && (trigger = trigger(self));
    var offsets = (value || "0").split(" "),
        bounds,
        localOffset,
        globalOffset,
        display;
    element = (0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__._getTarget)(trigger, self) || _body;
    bounds = _getBounds(element) || {};

    if ((!bounds || !bounds.left && !bounds.top) && _getComputedStyle(element).display === "none") {
      // if display is "none", it won't report getBoundingClientRect() properly
      display = element.style.display;
      element.style.display = "block";
      bounds = _getBounds(element);
      display ? element.style.display = display : element.style.removeProperty("display");
    }

    localOffset = _offsetToPx(offsets[0], bounds[direction.d]);
    globalOffset = _offsetToPx(offsets[1] || "0", scrollerSize);
    value = bounds[direction.p] - scrollerBounds[direction.p] - borderWidth + localOffset + scroll - globalOffset;
    markerScroller && _positionMarker(markerScroller, globalOffset, direction, scrollerSize - globalOffset < 20 || markerScroller._isStart && globalOffset > 20);
    scrollerSize -= scrollerSize - globalOffset; // adjust for the marker
  } else {
    containerAnimation && (value = gsap.utils.mapRange(containerAnimation.scrollTrigger.start, containerAnimation.scrollTrigger.end, 0, scrollerMax, value));
    markerScroller && _positionMarker(markerScroller, scrollerSize, direction, true);
  }

  if (clampZeroProp) {
    self[clampZeroProp] = value || -0.001;
    value < 0 && (value = 0);
  }

  if (marker) {
    var position = value + scrollerSize,
        isStart = marker._isStart;
    p1 = "scroll" + direction.d2;

    _positionMarker(marker, position, direction, isStart && position > 20 || !isStart && (useFixedPosition ? Math.max(_body[p1], _docEl[p1]) : marker.parentNode[p1]) <= position + 1);

    if (useFixedPosition) {
      scrollerBounds = _getBounds(markerScroller);
      useFixedPosition && (marker.style[direction.op.p] = scrollerBounds[direction.op.p] - direction.op.m - marker._offset + _px);
    }
  }

  if (containerAnimation && element) {
    p1 = _getBounds(element);
    containerAnimation.seek(scrollerMax);
    p2 = _getBounds(element);
    containerAnimation._caScrollDist = p1[direction.p] - p2[direction.p];
    value = value / containerAnimation._caScrollDist * scrollerMax;
  }

  containerAnimation && containerAnimation.seek(time);
  return containerAnimation ? value : Math.round(value);
},
    _prefixExp = /(webkit|moz|length|cssText|inset)/i,
    _reparent = function _reparent(element, parent, top, left) {
  if (element.parentNode !== parent) {
    var style = element.style,
        p,
        cs;

    if (parent === _body) {
      element._stOrig = style.cssText; // record original inline styles so we can revert them later

      cs = _getComputedStyle(element);

      for (p in cs) {
        // must copy all relevant styles to ensure that nothing changes visually when we reparent to the <body>. Skip the vendor prefixed ones.
        if (!+p && !_prefixExp.test(p) && cs[p] && typeof style[p] === "string" && p !== "0") {
          style[p] = cs[p];
        }
      }

      style.top = top;
      style.left = left;
    } else {
      style.cssText = element._stOrig;
    }

    gsap.core.getCache(element).uncache = 1;
    parent.appendChild(element);
  }
},
    _interruptionTracker = function _interruptionTracker(getValueFunc, initialValue, onInterrupt) {
  var last1 = initialValue,
      last2 = last1;
  return function (value) {
    var current = Math.round(getValueFunc()); // round because in some [very uncommon] Windows environments, scroll can get reported with decimals even though it was set without.

    if (current !== last1 && current !== last2 && Math.abs(current - last1) > 3 && Math.abs(current - last2) > 3) {
      // if the user scrolls, kill the tween. iOS Safari intermittently misreports the scroll position, it may be the most recently-set one or the one before that! When Safari is zoomed (CMD-+), it often misreports as 1 pixel off too! So if we set the scroll position to 125, for example, it'll actually report it as 124.
      value = current;
      onInterrupt && onInterrupt();
    }

    last2 = last1;
    last1 = Math.round(value);
    return last1;
  };
},
    _shiftMarker = function _shiftMarker(marker, direction, value) {
  var vars = {};
  vars[direction.p] = "+=" + value;
  gsap.set(marker, vars);
},
    // _mergeAnimations = animations => {
// 	let tl = gsap.timeline({smoothChildTiming: true}).startTime(Math.min(...animations.map(a => a.globalTime(0))));
// 	animations.forEach(a => {let time = a.totalTime(); tl.add(a); a.totalTime(time); });
// 	tl.smoothChildTiming = false;
// 	return tl;
// },
// returns a function that can be used to tween the scroll position in the direction provided, and when doing so it'll add a .tween property to the FUNCTION itself, and remove it when the tween completes or gets killed. This gives us a way to have multiple ScrollTriggers use a central function for any given scroller and see if there's a scroll tween running (which would affect if/how things get updated)
_getTweenCreator = function _getTweenCreator(scroller, direction) {
  var getScroll = (0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__._getScrollFunc)(scroller, direction),
      prop = "_scroll" + direction.p2,
      // add a tweenable property to the scroller that's a getter/setter function, like _scrollTop or _scrollLeft. This way, if someone does gsap.killTweensOf(scroller) it'll kill the scroll tween.
  getTween = function getTween(scrollTo, vars, initialValue, change1, change2) {
    var tween = getTween.tween,
        onComplete = vars.onComplete,
        modifiers = {};
    initialValue = initialValue || getScroll();

    var checkForInterruption = _interruptionTracker(getScroll, initialValue, function () {
      tween.kill();
      getTween.tween = 0;
    });

    change2 = change1 && change2 || 0; // if change1 is 0, we set that to the difference and ignore change2. Otherwise, there would be a compound effect.

    change1 = change1 || scrollTo - initialValue;
    tween && tween.kill();
    vars[prop] = scrollTo;
    vars.inherit = false;
    vars.modifiers = modifiers;

    modifiers[prop] = function () {
      return checkForInterruption(initialValue + change1 * tween.ratio + change2 * tween.ratio * tween.ratio);
    };

    vars.onUpdate = function () {
      _Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers.cache++;
      getTween.tween && _updateAll(); // if it was interrupted/killed, like in a context.revert(), don't force an updateAll()
    };

    vars.onComplete = function () {
      getTween.tween = 0;
      onComplete && onComplete.call(tween);
    };

    tween = getTween.tween = gsap.to(scroller, vars);
    return tween;
  };

  scroller[prop] = getScroll;

  getScroll.wheelHandler = function () {
    return getTween.tween && getTween.tween.kill() && (getTween.tween = 0);
  };

  _addListener(scroller, "wheel", getScroll.wheelHandler); // Windows machines handle mousewheel scrolling in chunks (like "3 lines per scroll") meaning the typical strategy for cancelling the scroll isn't as sensitive. It's much more likely to match one of the previous 2 scroll event positions. So we kill any snapping as soon as there's a wheel event.


  ScrollTrigger.isTouch && _addListener(scroller, "touchmove", getScroll.wheelHandler);
  return getTween;
};

var ScrollTrigger = /*#__PURE__*/function () {
  function ScrollTrigger(vars, animation) {
    _coreInitted || ScrollTrigger.register(gsap) || console.warn("Please gsap.registerPlugin(ScrollTrigger)");

    _context(this);

    this.init(vars, animation);
  }

  var _proto = ScrollTrigger.prototype;

  _proto.init = function init(vars, animation) {
    this.progress = this.start = 0;
    this.vars && this.kill(true, true); // in case it's being initted again

    if (!_enabled) {
      this.update = this.refresh = this.kill = _passThrough;
      return;
    }

    vars = _setDefaults(_isString(vars) || _isNumber(vars) || vars.nodeType ? {
      trigger: vars
    } : vars, _defaults);

    var _vars = vars,
        onUpdate = _vars.onUpdate,
        toggleClass = _vars.toggleClass,
        id = _vars.id,
        onToggle = _vars.onToggle,
        onRefresh = _vars.onRefresh,
        scrub = _vars.scrub,
        trigger = _vars.trigger,
        pin = _vars.pin,
        pinSpacing = _vars.pinSpacing,
        invalidateOnRefresh = _vars.invalidateOnRefresh,
        anticipatePin = _vars.anticipatePin,
        onScrubComplete = _vars.onScrubComplete,
        onSnapComplete = _vars.onSnapComplete,
        once = _vars.once,
        snap = _vars.snap,
        pinReparent = _vars.pinReparent,
        pinSpacer = _vars.pinSpacer,
        containerAnimation = _vars.containerAnimation,
        fastScrollEnd = _vars.fastScrollEnd,
        preventOverlaps = _vars.preventOverlaps,
        direction = vars.horizontal || vars.containerAnimation && vars.horizontal !== false ? _Observer_js__WEBPACK_IMPORTED_MODULE_0__._horizontal : _Observer_js__WEBPACK_IMPORTED_MODULE_0__._vertical,
        isToggle = !scrub && scrub !== 0,
        scroller = (0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__._getTarget)(vars.scroller || _win),
        scrollerCache = gsap.core.getCache(scroller),
        isViewport = _isViewport(scroller),
        useFixedPosition = ("pinType" in vars ? vars.pinType : (0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__._getProxyProp)(scroller, "pinType") || isViewport && "fixed") === "fixed",
        callbacks = [vars.onEnter, vars.onLeave, vars.onEnterBack, vars.onLeaveBack],
        toggleActions = isToggle && vars.toggleActions.split(" "),
        markers = "markers" in vars ? vars.markers : _defaults.markers,
        borderWidth = isViewport ? 0 : parseFloat(_getComputedStyle(scroller)["border" + direction.p2 + _Width]) || 0,
        self = this,
        onRefreshInit = vars.onRefreshInit && function () {
      return vars.onRefreshInit(self);
    },
        getScrollerSize = _getSizeFunc(scroller, isViewport, direction),
        getScrollerOffsets = _getOffsetsFunc(scroller, isViewport),
        lastSnap = 0,
        lastRefresh = 0,
        prevProgress = 0,
        scrollFunc = (0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__._getScrollFunc)(scroller, direction),
        tweenTo,
        pinCache,
        snapFunc,
        scroll1,
        scroll2,
        start,
        end,
        markerStart,
        markerEnd,
        markerStartTrigger,
        markerEndTrigger,
        markerVars,
        executingOnRefresh,
        change,
        pinOriginalState,
        pinActiveState,
        pinState,
        spacer,
        offset,
        pinGetter,
        pinSetter,
        pinStart,
        pinChange,
        spacingStart,
        spacerState,
        markerStartSetter,
        pinMoves,
        markerEndSetter,
        cs,
        snap1,
        snap2,
        scrubTween,
        scrubSmooth,
        snapDurClamp,
        snapDelayedCall,
        prevScroll,
        prevAnimProgress,
        caMarkerSetter,
        customRevertReturn; // for the sake of efficiency, _startClamp/_endClamp serve like a truthy value indicating that clamping was enabled on the start/end, and ALSO store the actual pre-clamped numeric value. We tap into that in ScrollSmoother for speed effects. So for example, if start="clamp(top bottom)" results in a start of -100 naturally, it would get clamped to 0 but -100 would be stored in _startClamp.


    self._startClamp = self._endClamp = false;
    self._dir = direction;
    anticipatePin *= 45;
    self.scroller = scroller;
    self.scroll = containerAnimation ? containerAnimation.time.bind(containerAnimation) : scrollFunc;
    scroll1 = scrollFunc();
    _isReverted && scrollFunc.rec == null && (scrollFunc.rec = scroll1); // if this scroller was first discovered while matchMedia was recreating contexts, it missed the initial scroll-position recording

    self.vars = vars;
    animation = animation || vars.animation;

    if ("refreshPriority" in vars) {
      _sort = 1;
      vars.refreshPriority === -9999 && (_primary = self); // used by ScrollSmoother
    }

    scrollerCache.tweenScroll = scrollerCache.tweenScroll || {
      top: _getTweenCreator(scroller, _Observer_js__WEBPACK_IMPORTED_MODULE_0__._vertical),
      left: _getTweenCreator(scroller, _Observer_js__WEBPACK_IMPORTED_MODULE_0__._horizontal)
    };
    self.tweenTo = tweenTo = scrollerCache.tweenScroll[direction.p];

    self.scrubDuration = function (value) {
      scrubSmooth = _isNumber(value) && value;

      if (!scrubSmooth) {
        scrubTween && scrubTween.progress(1).kill();
        scrubTween = 0;
      } else {
        scrubTween ? scrubTween.duration(value) : scrubTween = gsap.to(animation, {
          ease: "expo",
          totalProgress: "+=0",
          inherit: false,
          duration: scrubSmooth,
          paused: true,
          onComplete: function onComplete() {
            return onScrubComplete && onScrubComplete(self);
          }
        });
      }
    };

    if (animation) {
      animation.vars.lazy = false;
      animation._initted && !self.isReverted || animation.vars.immediateRender !== false && vars.immediateRender !== false && animation.duration() && animation.render(0, true, true); // special case: if this ScrollTrigger gets re-initted, a from() tween with a stagger could get initted initially and then reverted on the re-init which means it'll need to get rendered again here to properly display things. Otherwise, See https://gsap.com/forums/topic/36777-scrollsmoother-splittext-nextjs/ and https://codepen.io/GreenSock/pen/eYPyPpd?editors=0010

      self.animation = animation.pause();
      animation.scrollTrigger = self;
      self.scrubDuration(scrub);
      snap1 = 0;
      id || (id = animation.vars.id);
    }

    if (snap) {
      // TODO: potential idea: use legitimate CSS scroll snapping by pushing invisible elements into the DOM that serve as snap positions, and toggle the document.scrollingElement.style.scrollSnapType onToggle. See https://codepen.io/GreenSock/pen/JjLrgWM for a quick proof of concept.
      if (!_isObject(snap) || snap.push) {
        snap = {
          snapTo: snap
        };
      }

      "scrollBehavior" in _body.style && gsap.set(isViewport ? [_body, _docEl] : scroller, {
        scrollBehavior: "auto"
      }); // smooth scrolling doesn't work with snap.

      _Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers.forEach(function (o) {
        return _isFunction(o) && o.target === (isViewport ? _doc.scrollingElement || _docEl : scroller) && (o.smooth = false);
      }); // note: set smooth to false on both the vertical and horizontal scroll getters/setters


      snapFunc = _isFunction(snap.snapTo) ? snap.snapTo : snap.snapTo === "labels" ? _getClosestLabel(animation) : snap.snapTo === "labelsDirectional" ? _getLabelAtDirection(animation) : snap.directional !== false ? function (value, st) {
        return _snapDirectional(snap.snapTo)(value, _getTime() - lastRefresh < 500 ? 0 : st.direction);
      } : gsap.utils.snap(snap.snapTo);
      snapDurClamp = snap.duration || {
        min: 0.1,
        max: 2
      };
      snapDurClamp = _isObject(snapDurClamp) ? _clamp(snapDurClamp.min, snapDurClamp.max) : _clamp(snapDurClamp, snapDurClamp);
      snapDelayedCall = gsap.delayedCall(snap.delay || scrubSmooth / 2 || 0.1, function () {
        var scroll = scrollFunc(),
            refreshedRecently = _getTime() - lastRefresh < 500,
            tween = tweenTo.tween;

        if ((refreshedRecently || Math.abs(self.getVelocity()) < 10) && !tween && !_pointerIsDown && lastSnap !== scroll) {
          var progress = (scroll - start) / change,
              totalProgress = animation && !isToggle ? animation.totalProgress() : progress,
              velocity = refreshedRecently ? 0 : (totalProgress - snap2) / (_getTime() - _time2) * 1000 || 0,
              change1 = gsap.utils.clamp(-progress, 1 - progress, _abs(velocity / 2) * velocity / 0.185),
              naturalEnd = progress + (snap.inertia === false ? 0 : change1),
              endValue,
              endScroll,
              _snap = snap,
              onStart = _snap.onStart,
              _onInterrupt = _snap.onInterrupt,
              _onComplete = _snap.onComplete;
          endValue = snapFunc(naturalEnd, self);
          _isNumber(endValue) || (endValue = naturalEnd); // in case the function didn't return a number, fall back to using the naturalEnd

          endScroll = Math.max(0, Math.round(start + endValue * change));

          if (scroll <= end && scroll >= start && endScroll !== scroll) {
            if (tween && !tween._initted && tween.data <= _abs(endScroll - scroll)) {
              // there's an overlapping snap! So we must figure out which one is closer and let that tween live.
              return;
            }

            if (snap.inertia === false) {
              change1 = endValue - progress;
            }

            tweenTo(endScroll, {
              duration: snapDurClamp(_abs(Math.max(_abs(naturalEnd - totalProgress), _abs(endValue - totalProgress)) * 0.185 / velocity / 0.05 || 0)),
              ease: snap.ease || "power3",
              data: _abs(endScroll - scroll),
              // record the distance so that if another snap tween occurs (conflict) we can prioritize the closest snap.
              onInterrupt: function onInterrupt() {
                return snapDelayedCall.restart(true) && _onInterrupt && _callback(self, _onInterrupt);
              },
              onComplete: function onComplete() {
                self.update();
                lastSnap = scrollFunc();

                if (animation && !isToggle) {
                  // the resolution of the scrollbar is limited, so we should correct the scrubbed animation's playhead at the end to match EXACTLY where it was supposed to snap
                  scrubTween ? scrubTween.resetTo("totalProgress", endValue, animation._tTime / animation._tDur) : animation.progress(endValue);
                }

                snap1 = snap2 = animation && !isToggle ? animation.totalProgress() : self.progress;
                onSnapComplete && onSnapComplete(self);
                _onComplete && _callback(self, _onComplete);
              }
            }, scroll, change1 * change, endScroll - scroll - change1 * change);
            onStart && _callback(self, onStart, tweenTo.tween);
          }
        } else if (self.isActive && lastSnap !== scroll) {
          snapDelayedCall.restart(true);
        }
      }).pause();
    }

    id && (_ids[id] = self);
    trigger = self.trigger = (0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__._getTarget)(trigger || pin !== true && pin); // if a trigger has some kind of scroll-related effect applied that could contaminate the "y" or "x" position (like a ScrollSmoother effect), we needed a way to temporarily revert it, so we use the stRevert property of the gsCache. It can return another function that we'll call at the end so it can return to its normal state.

    customRevertReturn = trigger && trigger._gsap && trigger._gsap.stRevert;
    customRevertReturn && (customRevertReturn = customRevertReturn(self));
    pin = pin === true ? trigger : (0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__._getTarget)(pin);
    _isString(toggleClass) && (toggleClass = {
      targets: trigger,
      className: toggleClass
    });

    if (pin) {
      pinSpacing === false || pinSpacing === _margin || (pinSpacing = !pinSpacing && pin.parentNode && pin.parentNode.style && _getComputedStyle(pin.parentNode).display === "flex" ? false : _padding); // if the parent is display: flex, don't apply pinSpacing by default. We should check that pin.parentNode is an element (not shadow dom window)

      self.pin = pin;
      pinCache = gsap.core.getCache(pin);

      if (!pinCache.spacer) {
        // record the spacer and pinOriginalState on the cache in case someone tries pinning the same element with MULTIPLE ScrollTriggers - we don't want to have multiple spacers or record the "original" pin state after it has already been affected by another ScrollTrigger.
        if (pinSpacer) {
          pinSpacer = (0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__._getTarget)(pinSpacer);
          pinSpacer && !pinSpacer.nodeType && (pinSpacer = pinSpacer.current || pinSpacer.nativeElement); // for React & Angular

          pinCache.spacerIsNative = !!pinSpacer;
          pinSpacer && (pinCache.spacerState = _getState(pinSpacer));
        }

        pinCache.spacer = spacer = pinSpacer || _doc.createElement("div");
        spacer.classList.add("pin-spacer");
        id && spacer.classList.add("pin-spacer-" + id);
        pinCache.pinState = pinOriginalState = _getState(pin);
      } else {
        pinOriginalState = pinCache.pinState;
      }

      vars.force3D !== false && gsap.set(pin, {
        force3D: true
      });
      self.spacer = spacer = pinCache.spacer;
      cs = _getComputedStyle(pin);
      spacingStart = cs[pinSpacing + direction.os2];
      pinGetter = gsap.getProperty(pin);
      pinSetter = gsap.quickSetter(pin, direction.a, _px); // pin.firstChild && !_maxScroll(pin, direction) && (pin.style.overflow = "hidden"); // protects from collapsing margins, but can have unintended consequences as demonstrated here: https://codepen.io/GreenSock/pen/1e42c7a73bfa409d2cf1e184e7a4248d so it was removed in favor of just telling people to set up their CSS to avoid the collapsing margins (overflow: hidden | auto is just one option. Another is border-top: 1px solid transparent).

      _swapPinIn(pin, spacer, cs);

      pinState = _getState(pin);
    }

    if (markers) {
      markerVars = _isObject(markers) ? _setDefaults(markers, _markerDefaults) : _markerDefaults;
      markerStartTrigger = _createMarker("scroller-start", id, scroller, direction, markerVars, 0);
      markerEndTrigger = _createMarker("scroller-end", id, scroller, direction, markerVars, 0, markerStartTrigger);
      offset = markerStartTrigger["offset" + direction.op.d2];

      var content = (0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__._getTarget)((0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__._getProxyProp)(scroller, "content") || scroller);

      markerStart = this.markerStart = _createMarker("start", id, content, direction, markerVars, offset, 0, containerAnimation);
      markerEnd = this.markerEnd = _createMarker("end", id, content, direction, markerVars, offset, 0, containerAnimation);
      containerAnimation && (caMarkerSetter = gsap.quickSetter([markerStart, markerEnd], direction.a, _px));

      if (!useFixedPosition && !(_Observer_js__WEBPACK_IMPORTED_MODULE_0__._proxies.length && (0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__._getProxyProp)(scroller, "fixedMarkers") === true)) {
        _makePositionable(isViewport ? _body : scroller);

        gsap.set([markerStartTrigger, markerEndTrigger], {
          force3D: true
        });
        markerStartSetter = gsap.quickSetter(markerStartTrigger, direction.a, _px);
        markerEndSetter = gsap.quickSetter(markerEndTrigger, direction.a, _px);
      }
    }

    if (containerAnimation) {
      var oldOnUpdate = containerAnimation.vars.onUpdate,
          oldParams = containerAnimation.vars.onUpdateParams;
      containerAnimation.eventCallback("onUpdate", function () {
        self.update(0, 0, 1);
        oldOnUpdate && oldOnUpdate.apply(containerAnimation, oldParams || []);
      });
    }

    self.previous = function () {
      return _triggers[_triggers.indexOf(self) - 1];
    };

    self.next = function () {
      return _triggers[_triggers.indexOf(self) + 1];
    };

    self.revert = function (revert, temp) {
      if (!temp) {
        return self.kill(true);
      } // for compatibility with gsap.context() and gsap.matchMedia() which call revert()


      var r = revert !== false || !self.enabled,
          prevRefreshing = _refreshing;

      if (r !== self.isReverted) {
        if (r) {
          prevScroll = Math.max(scrollFunc(), self.scroll.rec || 0); // record the scroll so we can revert later (repositioning/pinning things can affect scroll position). In the static refresh() method, we first record all the scroll positions as a reference.

          prevProgress = self.progress;
          prevAnimProgress = animation && animation.progress();
        }

        markerStart && [markerStart, markerEnd, markerStartTrigger, markerEndTrigger].forEach(function (m) {
          return m.style.display = r ? "none" : "block";
        });

        if (r) {
          _refreshing = self;
          self.update(r); // make sure the pin is back in its original position so that all the measurements are correct. do this BEFORE swapping the pin out
        }

        if (pin && (!pinReparent || !self.isActive)) {
          if (r) {
            _swapPinOut(pin, spacer, pinOriginalState);
          } else {
            _swapPinIn(pin, spacer, _getComputedStyle(pin), spacerState);
          }
        }

        r || self.update(r); // when we're restoring, the update should run AFTER swapping the pin into its pin-spacer.

        _refreshing = prevRefreshing; // restore. We set it to true during the update() so that things fire properly in there.

        self.isReverted = r;
      }
    };

    self.refresh = function (soft, force, position, pinOffset) {
      // position is typically only defined if it's coming from setPositions() - it's a way to skip the normal parsing. pinOffset is also only from setPositions() and is mostly related to fancy stuff we need to do in ScrollSmoother with effects
      if ((_refreshing || !self.enabled) && !force) {
        return;
      }

      if (pin && soft && _lastScrollTime) {
        _addListener(ScrollTrigger, "scrollEnd", _softRefresh);

        return;
      }

      !_refreshingAll && onRefreshInit && onRefreshInit(self);
      _refreshing = self;

      if (tweenTo.tween && !position) {
        // we skip this if a position is passed in because typically that's from .setPositions() and it's best to allow in-progress snapping to continue.
        tweenTo.tween.kill();
        tweenTo.tween = 0;
      }

      scrubTween && scrubTween.pause();

      if (invalidateOnRefresh && animation) {
        animation.revert({
          kill: false
        }).invalidate();
        animation.getChildren ? animation.getChildren(true, true, false).forEach(function (t) {
          return t.vars.immediateRender && t.render(0, true, true);
        }) : animation.vars.immediateRender && animation.render(0, true, true); // any from() or fromTo() tweens should render immediately (well, unless they have immediateRender: false)
      }

      self.isReverted || self.revert(true, true);
      self._subPinOffset = false; // we'll set this to true in the sub-pins if we find any

      var size = getScrollerSize(),
          scrollerBounds = getScrollerOffsets(),
          max = containerAnimation ? containerAnimation.duration() : _maxScroll(scroller, direction),
          isFirstRefresh = change <= 0.01 || !change,
          offset = 0,
          otherPinOffset = pinOffset || 0,
          parsedEnd = _isObject(position) ? position.end : vars.end,
          parsedEndTrigger = vars.endTrigger || trigger,
          parsedStart = _isObject(position) ? position.start : vars.start || (vars.start === 0 || !trigger ? 0 : pin ? "0 0" : "0 100%"),
          pinnedContainer = self.pinnedContainer = vars.pinnedContainer && (0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__._getTarget)(vars.pinnedContainer, self),
          triggerIndex = trigger && Math.max(0, _triggers.indexOf(self)) || 0,
          i = triggerIndex,
          cs,
          bounds,
          scroll,
          isVertical,
          override,
          curTrigger,
          curPin,
          oppositeScroll,
          initted,
          revertedPins,
          forcedOverflow,
          markerStartOffset,
          markerEndOffset;

      if (markers && _isObject(position)) {
        // if we alter the start/end positions with .setPositions(), it generally feeds in absolute NUMBERS which don't convey information about where to line up the markers, so to keep it intuitive, we record how far the trigger positions shift after applying the new numbers and then offset by that much in the opposite direction. We do the same to the associated trigger markers too of course.
        markerStartOffset = gsap.getProperty(markerStartTrigger, direction.p);
        markerEndOffset = gsap.getProperty(markerEndTrigger, direction.p);
      }

      while (i-- > 0) {
        // user might try to pin the same element more than once, so we must find any prior triggers with the same pin, revert them, and determine how long they're pinning so that we can offset things appropriately. Make sure we revert from last to first so that things "rewind" properly.
        curTrigger = _triggers[i];
        curTrigger.end || curTrigger.refresh(0, 1) || (_refreshing = self); // if it's a timeline-based trigger that hasn't been fully initialized yet because it's waiting for 1 tick, just force the refresh() here, otherwise if it contains a pin that's supposed to affect other ScrollTriggers further down the page, they won't be adjusted properly.

        curPin = curTrigger.pin;

        if (curPin && (curPin === trigger || curPin === pin || curPin === pinnedContainer) && !curTrigger.isReverted) {
          revertedPins || (revertedPins = []);
          revertedPins.unshift(curTrigger); // we'll revert from first to last to make sure things reach their end state properly

          curTrigger.revert(true, true);
        }

        if (curTrigger !== _triggers[i]) {
          // in case it got removed.
          triggerIndex--;
          i--;
        }
      }

      _isFunction(parsedStart) && (parsedStart = parsedStart(self));
      parsedStart = _parseClamp(parsedStart, "start", self);
      start = _parsePosition(parsedStart, trigger, size, direction, scrollFunc(), markerStart, markerStartTrigger, self, scrollerBounds, borderWidth, useFixedPosition, max, containerAnimation, self._startClamp && "_startClamp") || (pin ? -0.001 : 0);
      _isFunction(parsedEnd) && (parsedEnd = parsedEnd(self));

      if (_isString(parsedEnd) && !parsedEnd.indexOf("+=")) {
        if (~parsedEnd.indexOf(" ")) {
          parsedEnd = (_isString(parsedStart) ? parsedStart.split(" ")[0] : "") + parsedEnd;
        } else {
          offset = _offsetToPx(parsedEnd.substr(2), size);
          parsedEnd = _isString(parsedStart) ? parsedStart : (containerAnimation ? gsap.utils.mapRange(0, containerAnimation.duration(), containerAnimation.scrollTrigger.start, containerAnimation.scrollTrigger.end, start) : start) + offset; // _parsePosition won't factor in the offset if the start is a number, so do it here.

          parsedEndTrigger = trigger;
        }
      }

      parsedEnd = _parseClamp(parsedEnd, "end", self);
      end = Math.max(start, _parsePosition(parsedEnd || (parsedEndTrigger ? "100% 0" : max), parsedEndTrigger, size, direction, scrollFunc() + offset, markerEnd, markerEndTrigger, self, scrollerBounds, borderWidth, useFixedPosition, max, containerAnimation, self._endClamp && "_endClamp")) || -0.001;
      offset = 0;
      i = triggerIndex;

      while (i--) {
        curTrigger = _triggers[i] || {};
        curPin = curTrigger.pin;

        if (curPin && curTrigger.start - curTrigger._pinPush <= start && !containerAnimation && curTrigger.end > 0) {
          cs = curTrigger.end - (self._startClamp ? Math.max(0, curTrigger.start) : curTrigger.start);

          if ((curPin === trigger && curTrigger.start - curTrigger._pinPush < start || curPin === pinnedContainer) && isNaN(parsedStart)) {
            // numeric start values shouldn't be offset at all - treat them as absolute
            offset += cs * (1 - curTrigger.progress);
          }

          curPin === pin && (otherPinOffset += cs);
        }
      }

      start += offset;
      end += offset;
      self._startClamp && (self._startClamp += offset);

      if (self._endClamp && !_refreshingAll) {
        self._endClamp = end || -0.001;
        end = Math.min(end, _maxScroll(scroller, direction));
      }

      change = end - start || (start -= 0.01) && 0.001;

      if (isFirstRefresh) {
        // on the very first refresh(), the prevProgress couldn't have been accurate yet because the start/end were never calculated, so we set it here. Before 3.11.5, it could lead to an inaccurate scroll position restoration with snapping.
        prevProgress = gsap.utils.clamp(0, 1, gsap.utils.normalize(start, end, prevScroll));
      }

      self._pinPush = otherPinOffset;

      if (markerStart && offset) {
        // offset the markers if necessary
        cs = {};
        cs[direction.a] = "+=" + offset;
        pinnedContainer && (cs[direction.p] = "-=" + scrollFunc());
        gsap.set([markerStart, markerEnd], cs);
      }

      if (pin && !(_clampingMax && self.end >= _maxScroll(scroller, direction))) {
        cs = _getComputedStyle(pin);
        isVertical = direction === _Observer_js__WEBPACK_IMPORTED_MODULE_0__._vertical;
        scroll = scrollFunc(); // recalculate because the triggers can affect the scroll

        pinStart = parseFloat(pinGetter(direction.a)) + otherPinOffset;

        if (!max && end > 1) {
          // makes sure the scroller has a scrollbar, otherwise if something has width: 100%, for example, it would be too big (exclude the scrollbar). See https://gsap.com/forums/topic/25182-scrolltrigger-width-of-page-increase-where-markers-are-set-to-false/
          forcedOverflow = (isViewport ? _doc.scrollingElement || _docEl : scroller).style;
          forcedOverflow = {
            style: forcedOverflow,
            value: forcedOverflow["overflow" + direction.a.toUpperCase()]
          };

          if (isViewport && _getComputedStyle(_body)["overflow" + direction.a.toUpperCase()] !== "scroll") {
            // avoid an extra scrollbar if BOTH <html> and <body> have overflow set to "scroll"
            forcedOverflow.style["overflow" + direction.a.toUpperCase()] = "scroll";
          }
        }

        _swapPinIn(pin, spacer, cs);

        pinState = _getState(pin); // transforms will interfere with the top/left/right/bottom placement, so remove them temporarily. getBoundingClientRect() factors in transforms.

        bounds = _getBounds(pin, true);
        oppositeScroll = useFixedPosition && (0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__._getScrollFunc)(scroller, isVertical ? _Observer_js__WEBPACK_IMPORTED_MODULE_0__._horizontal : _Observer_js__WEBPACK_IMPORTED_MODULE_0__._vertical)();

        if (pinSpacing) {
          spacerState = [pinSpacing + direction.os2, change + otherPinOffset + _px];
          spacerState.t = spacer;
          i = pinSpacing === _padding ? _getSize(pin, direction) + change + otherPinOffset : 0;

          if (i) {
            spacerState.push(direction.d, i + _px); // for box-sizing: border-box (must include padding).

            spacer.style.flexBasis !== "auto" && (spacer.style.flexBasis = i + _px);
          }

          _setState(spacerState);

          if (pinnedContainer) {
            // in ScrollTrigger.refresh(), we need to re-evaluate the pinContainer's size because this pinSpacing may stretch it out, but we can't just add the exact distance because depending on layout, it may not push things down or it may only do so partially.
            _triggers.forEach(function (t) {
              if (t.pin === pinnedContainer && t.vars.pinSpacing !== false) {
                t._subPinOffset = true;
              }
            });
          }

          useFixedPosition && scrollFunc(prevScroll);
        } else {
          i = _getSize(pin, direction);
          i && spacer.style.flexBasis !== "auto" && (spacer.style.flexBasis = i + _px);
        }

        if (useFixedPosition) {
          override = {
            top: bounds.top + (isVertical ? scroll - start : oppositeScroll) + _px,
            left: bounds.left + (isVertical ? oppositeScroll : scroll - start) + _px,
            boxSizing: "border-box",
            position: "fixed"
          };
          override[_width] = override["max" + _Width] = Math.ceil(bounds.width) + _px;
          override[_height] = override["max" + _Height] = Math.ceil(bounds.height) + _px;
          override[_margin] = override[_margin + _Top] = override[_margin + _Right] = override[_margin + _Bottom] = override[_margin + _Left] = "0";
          override[_padding] = cs[_padding];
          override[_padding + _Top] = cs[_padding + _Top];
          override[_padding + _Right] = cs[_padding + _Right];
          override[_padding + _Bottom] = cs[_padding + _Bottom];
          override[_padding + _Left] = cs[_padding + _Left];
          pinActiveState = _copyState(pinOriginalState, override, pinReparent);
          _refreshingAll && scrollFunc(0);
        }

        if (animation) {
          // the animation might be affecting the transform, so we must jump to the end, check the value, and compensate accordingly. Otherwise, when it becomes unpinned, the pinSetter() will get set to a value that doesn't include whatever the animation did.
          initted = animation._initted; // if not, we must invalidate() after this step, otherwise it could lock in starting values prematurely.

          _suppressOverwrites(1);

          animation.render(animation.duration(), true, true);
          pinChange = pinGetter(direction.a) - pinStart + change + otherPinOffset;
          pinMoves = Math.abs(change - pinChange) > 1;
          useFixedPosition && pinMoves && pinActiveState.splice(pinActiveState.length - 2, 2); // transform is the last property/value set in the state Array. Since the animation is controlling that, we should omit it.

          animation.render(0, true, true);
          initted || animation.invalidate(true);
          animation.parent || animation.totalTime(animation.totalTime()); // if, for example, a toggleAction called play() and then refresh() happens and when we render(1) above, it would cause the animation to complete and get removed from its parent, so this makes sure it gets put back in.

          _suppressOverwrites(0);
        } else {
          pinChange = change;
        }

        forcedOverflow && (forcedOverflow.value ? forcedOverflow.style["overflow" + direction.a.toUpperCase()] = forcedOverflow.value : forcedOverflow.style.removeProperty("overflow-" + direction.a));
      } else if (trigger && scrollFunc() && !containerAnimation) {
        // it may be INSIDE a pinned element, so walk up the tree and look for any elements with _pinOffset to compensate because anything with pinSpacing that's already scrolled would throw off the measurements in getBoundingClientRect()
        bounds = trigger.parentNode;

        while (bounds && bounds !== _body) {
          if (bounds._pinOffset) {
            start -= bounds._pinOffset;
            end -= bounds._pinOffset;
          }

          bounds = bounds.parentNode;
        }
      }

      revertedPins && revertedPins.forEach(function (t) {
        return t.revert(false, true);
      });
      self.start = start;
      self.end = end;
      scroll1 = scroll2 = _refreshingAll ? prevScroll : scrollFunc(); // reset velocity

      if (!containerAnimation && !_refreshingAll && !_isReverted) {
        // preserve the recorded position throughout a matchMedia revert/recreate transaction
        scroll1 < prevScroll && scrollFunc(prevScroll);
        self.scroll.rec = 0;
      }

      self.revert(false, true);
      lastRefresh = _getTime();

      if (snapDelayedCall) {
        lastSnap = -1; // just so snapping gets re-enabled, clear out any recorded last value
        // self.isActive && scrollFunc(start + change * prevProgress); // previously this line was here to ensure that when snapping kicks in, it's from the previous progress but in some cases that's not desirable, like an all-page ScrollTrigger when new content gets added to the page, that'd totally change the progress.

        snapDelayedCall.restart(true);
      }

      _refreshing = 0;
      animation && isToggle && (animation._initted || prevAnimProgress) && animation.progress() !== prevAnimProgress && animation.progress(prevAnimProgress || 0, true).render(animation.time(), true, true); // must force a re-render because if saveStyles() was used on the target(s), the styles could have been wiped out during the refresh().

      if (isFirstRefresh || prevProgress !== self.progress || containerAnimation || invalidateOnRefresh || animation && !animation._initted) {
        // ensures that the direction is set properly (when refreshing, progress is set back to 0 initially, then back again to wherever it needs to be) and that callbacks are triggered.
        animation && !isToggle && (animation._initted || prevProgress || animation.vars.immediateRender !== false) && animation.totalProgress(containerAnimation && start < -0.001 && !prevProgress ? gsap.utils.normalize(start, end, 0) : prevProgress, true); // to avoid issues where animation callbacks like onStart aren't triggered.

        self.progress = isFirstRefresh || (scroll1 - start) / change === prevProgress ? 0 : prevProgress;
      }

      pin && pinSpacing && (spacer._pinOffset = Math.round(self.progress * pinChange));
      scrubTween && scrubTween.invalidate();

      if (!isNaN(markerStartOffset)) {
        // numbers were passed in for the position which are absolute, so instead of just putting the markers at the very bottom of the viewport, we figure out how far they shifted down (it's safe to assume they were originally positioned in closer relation to the trigger element with values like "top", "center", a percentage or whatever, so we offset that much in the opposite direction to basically revert them to the relative position thy were at previously.
        markerStartOffset -= gsap.getProperty(markerStartTrigger, direction.p);
        markerEndOffset -= gsap.getProperty(markerEndTrigger, direction.p);

        _shiftMarker(markerStartTrigger, direction, markerStartOffset);

        _shiftMarker(markerStart, direction, markerStartOffset - (pinOffset || 0));

        _shiftMarker(markerEndTrigger, direction, markerEndOffset);

        _shiftMarker(markerEnd, direction, markerEndOffset - (pinOffset || 0));
      }

      isFirstRefresh && !_refreshingAll && self.update(); // edge case - when you reload a page when it's already scrolled down, some browsers fire a "scroll" event before DOMContentLoaded, triggering an updateAll(). If we don't update the self.progress as part of refresh(), then when it happens next, it may record prevProgress as 0 when it really shouldn't, potentially causing a callback in an animation to fire again.

      if (onRefresh && !_refreshingAll && !executingOnRefresh) {
        // when refreshing all, we do extra work to correct pinnedContainer sizes and ensure things don't exceed the maxScroll, so we should do all the refreshes at the end after all that work so that the start/end values are corrected.
        executingOnRefresh = true;
        onRefresh(self);
        executingOnRefresh = false;
      }
    };

    self.getVelocity = function () {
      return (scrollFunc() - scroll2) / (_getTime() - _time2) * 1000 || 0;
    };

    self.endAnimation = function () {
      _endAnimation(self.callbackAnimation);

      if (animation) {
        scrubTween ? scrubTween.progress(1) : !animation.paused() ? _endAnimation(animation, animation.reversed()) : isToggle || _endAnimation(animation, self.direction < 0, 1);
      }
    };

    self.labelToScroll = function (label) {
      return animation && animation.labels && (start || self.refresh() || start) + animation.labels[label] / animation.duration() * change || 0;
    };

    self.getTrailing = function (name) {
      var i = _triggers.indexOf(self),
          a = self.direction > 0 ? _triggers.slice(0, i).reverse() : _triggers.slice(i + 1);

      return (_isString(name) ? a.filter(function (t) {
        return t.vars.preventOverlaps === name;
      }) : a).filter(function (t) {
        return self.direction > 0 ? t.end <= start : t.start >= end;
      });
    };

    self.update = function (reset, recordVelocity, forceFake) {
      if (containerAnimation && !forceFake && !reset) {
        return;
      }

      var scroll = _refreshingAll === true ? prevScroll : self.scroll(),
          p = reset ? 0 : (scroll - start) / change,
          clipped = p < 0 ? 0 : p > 1 ? 1 : p || 0,
          prevProgress = self.progress,
          isActive,
          wasActive,
          toggleState,
          action,
          stateChanged,
          toggled,
          isAtMax,
          isTakingAction;

      if (recordVelocity) {
        scroll2 = scroll1;
        scroll1 = containerAnimation ? scrollFunc() : scroll;

        if (snap) {
          snap2 = snap1;
          snap1 = animation && !isToggle ? animation.totalProgress() : clipped;
        }
      } // anticipate the pinning a few ticks ahead of time based on velocity to avoid a visual glitch due to the fact that most browsers do scrolling on a separate thread (not synced with requestAnimationFrame).


      if (anticipatePin && pin && !_refreshing && !_startup && _lastScrollTime) {
        if (!clipped && start < scroll + (scroll - scroll2) / (_getTime() - _time2) * anticipatePin) {
          clipped = 0.0001;
        } else if (clipped === 1 && end > scroll + (scroll - scroll2) / (_getTime() - _time2) * anticipatePin) {
          clipped = 0.9999;
        }
      }

      if (clipped !== prevProgress && self.enabled) {
        isActive = self.isActive = !!clipped && clipped < 1;
        wasActive = !!prevProgress && prevProgress < 1;
        toggled = isActive !== wasActive;
        stateChanged = toggled || !!clipped !== !!prevProgress; // could go from start all the way to end, thus it didn't toggle but it did change state in a sense (may need to fire a callback)

        self.direction = clipped > prevProgress ? 1 : -1;
        self.progress = clipped;

        if (stateChanged && !_refreshing) {
          toggleState = clipped && !prevProgress ? 0 : clipped === 1 ? 1 : prevProgress === 1 ? 2 : 3; // 0 = enter, 1 = leave, 2 = enterBack, 3 = leaveBack (we prioritize the FIRST encounter, thus if you scroll really fast past the onEnter and onLeave in one tick, it'd prioritize onEnter.

          if (isToggle) {
            action = !toggled && toggleActions[toggleState + 1] !== "none" && toggleActions[toggleState + 1] || toggleActions[toggleState]; // if it didn't toggle, that means it shot right past and since we prioritize the "enter" action, we should switch to the "leave" in this case (but only if one is defined)

            isTakingAction = animation && (action === "complete" || action === "reset" || action in animation);
          }
        }

        preventOverlaps && (toggled || isTakingAction) && (isTakingAction || scrub || !animation) && (_isFunction(preventOverlaps) ? preventOverlaps(self) : self.getTrailing(preventOverlaps).forEach(function (t) {
          return t.endAnimation();
        }));

        if (!isToggle) {
          if (scrubTween && !_refreshing && !_startup) {
            scrubTween._dp._time - scrubTween._start !== scrubTween._time && scrubTween.render(scrubTween._dp._time - scrubTween._start); // if there's a scrub on both the container animation and this one (or a ScrollSmoother), the update order would cause this one not to have rendered yet, so it wouldn't make any progress before we .restart() it heading toward the new progress so it'd appear stuck thus we force a render here.

            if (scrubTween.resetTo) {
              scrubTween.resetTo("totalProgress", clipped, animation._tTime / animation._tDur);
            } else {
              // legacy support (courtesy), before 3.10.0
              scrubTween.vars.totalProgress = clipped;
              scrubTween.invalidate().restart();
            }
          } else if (animation) {
            animation.totalProgress(clipped, !!(_refreshing && (lastRefresh || reset)));
          }
        }

        if (pin) {
          reset && pinSpacing && (spacer.style[pinSpacing + direction.os2] = spacingStart);

          if (!useFixedPosition) {
            pinSetter(_round(pinStart + pinChange * clipped));
          } else if (stateChanged) {
            isAtMax = !reset && clipped > prevProgress && end + 1 > scroll && scroll + 1 >= _maxScroll(scroller, direction); // if it's at the VERY end of the page, don't switch away from position: fixed because it's pointless and it could cause a brief flash when the user scrolls back up (when it gets pinned again)

            if (pinReparent) {
              if (!reset && (isActive || isAtMax)) {
                var bounds = _getBounds(pin, true),
                    _offset = scroll - start;

                _reparent(pin, _body, bounds.top + (direction === _Observer_js__WEBPACK_IMPORTED_MODULE_0__._vertical ? _offset : 0) + _px, bounds.left + (direction === _Observer_js__WEBPACK_IMPORTED_MODULE_0__._vertical ? 0 : _offset) + _px);
              } else {
                _reparent(pin, spacer);
              }
            }

            _setState(isActive || isAtMax ? pinActiveState : pinState);

            pinMoves && clipped < 1 && isActive || pinSetter(pinStart + (clipped === 1 && !isAtMax ? pinChange : 0));
          }
        }

        snap && !tweenTo.tween && !_refreshing && !_startup && snapDelayedCall.restart(true);
        toggleClass && (toggled || once && clipped && (clipped < 1 || !_limitCallbacks)) && _toArray(toggleClass.targets).forEach(function (el) {
          return el.classList[isActive || once ? "add" : "remove"](toggleClass.className);
        }); // classes could affect positioning, so do it even if reset or refreshing is true.

        onUpdate && !isToggle && !reset && onUpdate(self);

        if (stateChanged && !_refreshing) {
          if (isToggle) {
            if (isTakingAction) {
              if (action === "complete") {
                animation.pause().totalProgress(1);
              } else if (action === "reset") {
                animation.restart(true).pause();
              } else if (action === "restart") {
                animation.restart(true);
              } else {
                animation[action]();
              }
            }

            onUpdate && onUpdate(self);
          }

          if (toggled || !_limitCallbacks) {
            // on startup, the page could be scrolled and we don't want to fire callbacks that didn't toggle. For example onEnter shouldn't fire if the ScrollTrigger isn't actually entered.
            onToggle && toggled && _callback(self, onToggle);
            callbacks[toggleState] && _callback(self, callbacks[toggleState]);
            once && (clipped === 1 ? self.kill(false, 1) : callbacks[toggleState] = 0); // a callback shouldn't be called again if once is true.

            if (!toggled) {
              // it's possible to go completely past, like from before the start to after the end (or vice-versa) in which case BOTH callbacks should be fired in that order
              toggleState = clipped === 1 ? 1 : 3;
              callbacks[toggleState] && _callback(self, callbacks[toggleState]);
            }
          }

          if (fastScrollEnd && !isActive && Math.abs(self.getVelocity()) > (_isNumber(fastScrollEnd) ? fastScrollEnd : 2500)) {
            _endAnimation(self.callbackAnimation);

            scrubTween ? scrubTween.progress(1) : _endAnimation(animation, action === "reverse" ? 1 : !clipped, 1);
          }
        } else if (isToggle && onUpdate && !_refreshing) {
          onUpdate(self);
        }
      } // update absolutely-positioned markers (only if the scroller isn't the viewport)


      if (markerEndSetter) {
        var n = containerAnimation ? scroll / containerAnimation.duration() * (containerAnimation._caScrollDist || 0) : scroll;
        markerStartSetter(n + (markerStartTrigger._isFlipped ? 1 : 0));
        markerEndSetter(n);
      }

      caMarkerSetter && caMarkerSetter(-scroll / containerAnimation.duration() * (containerAnimation._caScrollDist || 0));
    };

    self.enable = function (reset, refresh) {
      if (!self.enabled) {
        self.enabled = true;

        _addListener(scroller, "resize", _onResize);

        isViewport || _addListener(scroller, "scroll", _onScroll);
        onRefreshInit && _addListener(ScrollTrigger, "refreshInit", onRefreshInit);

        if (reset !== false) {
          self.progress = prevProgress = 0;
          scroll1 = scroll2 = lastSnap = scrollFunc();
        }

        refresh !== false && self.refresh();
      }
    };

    self.getTween = function (snap) {
      return snap && tweenTo ? tweenTo.tween : scrubTween;
    };

    self.setPositions = function (newStart, newEnd, keepClamp, pinOffset) {
      // doesn't persist after refresh()! Intended to be a way to override values that were set during refresh(), like you could set it in onRefresh()
      if (containerAnimation) {
        // convert ratios into scroll positions. Remember, start/end values on ScrollTriggers that have a containerAnimation refer to the time (in seconds), NOT scroll positions.
        var st = containerAnimation.scrollTrigger,
            duration = containerAnimation.duration(),
            _change = st.end - st.start;

        newStart = st.start + _change * newStart / duration;
        newEnd = st.start + _change * newEnd / duration;
      }

      self.refresh(false, false, {
        start: _keepClamp(newStart, keepClamp && !!self._startClamp),
        end: _keepClamp(newEnd, keepClamp && !!self._endClamp)
      }, pinOffset);
      self.update();
    };

    self.adjustPinSpacing = function (amount) {
      if (spacerState && amount) {
        var i = spacerState.indexOf(direction.d) + 1;
        spacerState[i] = parseFloat(spacerState[i]) + amount + _px;
        spacerState[1] = parseFloat(spacerState[1]) + amount + _px;

        _setState(spacerState);
      }
    };

    self.disable = function (reset, allowAnimation) {
      reset !== false && self.revert(true, true);

      if (self.enabled) {
        self.enabled = self.isActive = false;
        allowAnimation || scrubTween && scrubTween.pause();
        prevScroll = 0;
        pinCache && (pinCache.uncache = 1);
        onRefreshInit && _removeListener(ScrollTrigger, "refreshInit", onRefreshInit);

        if (snapDelayedCall) {
          snapDelayedCall.pause();
          tweenTo.tween && tweenTo.tween.kill() && (tweenTo.tween = 0);
        }

        if (!isViewport) {
          var i = _triggers.length;

          while (i--) {
            if (_triggers[i].scroller === scroller && _triggers[i] !== self) {
              return; //don't remove the listeners if there are still other triggers referencing it.
            }
          }

          _removeListener(scroller, "resize", _onResize);

          isViewport || _removeListener(scroller, "scroll", _onScroll);
        }
      }
    };

    self.kill = function (revert, allowAnimation) {
      self.disable(revert, allowAnimation);
      scrubTween && !allowAnimation && scrubTween.kill();
      id && delete _ids[id];

      var i = _triggers.indexOf(self);

      i >= 0 && _triggers.splice(i, 1);
      i === _i && _direction > 0 && _i--; // if we're in the middle of a refresh() or update(), splicing would cause skips in the index, so adjust...
      // if no other ScrollTrigger instances of the same scroller are found, wipe out any recorded scroll position. Otherwise, in a single page application, for example, it could maintain scroll position when it really shouldn't. Skip while _isReverted so matchMediaInit's pre-revert recording survives context.kill before onMatch recreates triggers.

      i = 0;

      _triggers.forEach(function (t) {
        return t.scroller === self.scroller && (i = 1);
      });

      i || _refreshingAll || _isReverted || (self.scroll.rec = 0);

      if (animation) {
        animation.scrollTrigger = null;
        revert && animation.revert({
          kill: false
        });
        allowAnimation || animation.kill();
      }

      markerStart && [markerStart, markerEnd, markerStartTrigger, markerEndTrigger].forEach(function (m) {
        return m.parentNode && m.parentNode.removeChild(m);
      });
      _primary === self && (_primary = 0);

      if (pin) {
        pinCache && (pinCache.uncache = 1);
        i = 0;

        _triggers.forEach(function (t) {
          return t.pin === pin && i++;
        });

        i || (pinCache.spacer = 0); // if there aren't any more ScrollTriggers with the same pin, remove the spacer, otherwise it could be contaminated with old/stale values if the user re-creates a ScrollTrigger for the same element.
      }

      vars.onKill && vars.onKill(self);
    };

    _triggers.push(self);

    self.enable(false, false);
    customRevertReturn && customRevertReturn(self);

    if (animation && animation.add && !change) {
      // if the animation is a timeline, it may not have been populated yet, so it wouldn't render at the proper place on the first refresh(), thus we should schedule one for the next tick. If "change" is defined, we know it must be re-enabling, thus we can refresh() right away.
      var updateFunc = self.update; // some browsers may fire a scroll event BEFORE a tick elapses and/or the DOMContentLoaded fires. So there's a chance update() will be called BEFORE a refresh() has happened on a Timeline-attached ScrollTrigger which means the start/end won't be calculated yet. We don't want to add conditional logic inside the update() method (like check to see if end is defined and if not, force a refresh()) because that's a function that gets hit a LOT (performance). So we swap out the real update() method for this one that'll re-attach it the first time it gets called and of course forces a refresh().

      self.update = function () {
        self.update = updateFunc;
        _Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers.cache++; // otherwise a cached scroll position may get used in the refresh() in a very rare scenario, like if ScrollTriggers are created inside a DOMContentLoaded event and the queued requestAnimationFrame() fires beforehand. See https://gsap.com/community/forums/topic/41267-scrolltrigger-breaks-on-refresh-when-using-domcontentloaded/

        start || end || self.refresh();
      };

      gsap.delayedCall(0.01, self.update);
      change = 0.01;
      start = end = 0;
    } else {
      self.refresh();
    }

    pin && _queueRefreshAll(); // pinning could affect the positions of other things, so make sure we queue a full refresh()
  };

  ScrollTrigger.register = function register(core) {
    if (!_coreInitted) {
      gsap = core || _getGSAP();
      _windowExists() && window.document && ScrollTrigger.enable();
      _coreInitted = _enabled;
    }

    return _coreInitted;
  };

  ScrollTrigger.defaults = function defaults(config) {
    if (config) {
      for (var p in config) {
        _defaults[p] = config[p];
      }
    }

    return _defaults;
  };

  ScrollTrigger.disable = function disable(reset, kill) {
    _enabled = 0;

    _triggers.forEach(function (trigger) {
      return trigger[kill ? "kill" : "disable"](reset);
    });

    _removeListener(_win, "wheel", _onScroll);

    _removeListener(_doc, "scroll", _onScroll);

    clearInterval(_syncInterval);

    _removeListener(_doc, "touchcancel", _passThrough);

    _removeListener(_body, "touchstart", _passThrough);

    _multiListener(_removeListener, _doc, "pointerdown,touchstart,mousedown", _pointerDownHandler);

    _multiListener(_removeListener, _doc, "pointerup,touchend,mouseup", _pointerUpHandler);

    _resizeDelay.kill();

    _iterateAutoRefresh(_removeListener);

    for (var i = 0; i < _Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers.length; i += 3) {
      _wheelListener(_removeListener, _Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers[i], _Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers[i + 1]);

      _wheelListener(_removeListener, _Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers[i], _Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers[i + 2]);
    }
  };

  ScrollTrigger.enable = function enable() {
    _win = window;
    _doc = document;
    _docEl = _doc.documentElement;
    _body = _doc.body;

    if (gsap) {
      _toArray = gsap.utils.toArray;
      _clamp = gsap.utils.clamp;
      _context = gsap.core.context || _passThrough;
      _suppressOverwrites = gsap.core.suppressOverwrites || _passThrough;
      _scrollRestoration = _win.history.scrollRestoration || "auto";
      _lastScroll = _win.pageYOffset || 0;
      gsap.core.globals("ScrollTrigger", ScrollTrigger); // must register the global manually because in Internet Explorer, functions (classes) don't have a "name" property.

      if (_body) {
        _enabled = 1;
        _div100vh = document.createElement("div"); // to solve mobile browser address bar show/hide resizing, we shouldn't rely on window.innerHeight. Instead, use a <div> with its height set to 100vh and measure that since that's what the scrolling is based on anyway and it's not affected by address bar showing/hiding.

        _div100vh.style.height = "100vh";
        _div100vh.style.position = "absolute";

        _refresh100vh();

        _rafBugFix();

        _Observer_js__WEBPACK_IMPORTED_MODULE_0__.Observer.register(gsap); // isTouch is 0 if no touch, 1 if ONLY touch, and 2 if it can accommodate touch but also other types like mouse/pointer.

        ScrollTrigger.isTouch = _Observer_js__WEBPACK_IMPORTED_MODULE_0__.Observer.isTouch;
        _fixIOSBug = _Observer_js__WEBPACK_IMPORTED_MODULE_0__.Observer.isTouch && /(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent); // since 2017, iOS has had a bug that causes event.clientX/Y to be inaccurate when a scroll occurs, thus we must alternate ignoring every other touchmove event to work around it. See https://bugs.webkit.org/show_bug.cgi?id=181954 and https://codepen.io/GreenSock/pen/ExbrPNa/087cef197dc35445a0951e8935c41503

        _ignoreMobileResize = _Observer_js__WEBPACK_IMPORTED_MODULE_0__.Observer.isTouch === 1;

        _addListener(_win, "wheel", _onScroll); // mostly for 3rd party smooth scrolling libraries.


        _root = [_win, _doc, _docEl, _body];

        if (gsap.matchMedia) {
          ScrollTrigger.matchMedia = function (vars) {
            var mm = gsap.matchMedia(),
                p;

            for (p in vars) {
              mm.add(p, vars[p]);
            }

            return mm;
          };

          gsap.addEventListener("matchMediaInit", function () {
            _recordScrollPositions();

            _revertAll();
          });
          gsap.addEventListener("matchMediaRevert", function () {
            return _revertRecorded();
          });
          gsap.addEventListener("matchMedia", function () {
            _refreshAll(0, 1);

            _dispatch("matchMedia");
          });
          gsap.matchMedia().add("(orientation: portrait)", function () {
            // when orientation changes, we should take new base measurements for the ignoreMobileResize feature.
            _setBaseDimensions();

            return _setBaseDimensions;
          });
        } else {
          console.warn("Requires GSAP 3.11.0 or later");
        }

        _setBaseDimensions();

        _addListener(_doc, "scroll", _onScroll); // some browsers (like Chrome), the window stops dispatching scroll events on the window if you scroll really fast, but it's consistent on the document!


        var bodyHasStyle = _body.hasAttribute("style"),
            bodyStyle = _body.style,
            border = bodyStyle.borderTopStyle,
            AnimationProto = gsap.core.Animation.prototype,
            bounds,
            i;

        AnimationProto.revert || Object.defineProperty(AnimationProto, "revert", {
          value: function value() {
            return this.time(-0.01, true);
          }
        }); // only for backwards compatibility (Animation.revert() was added after 3.10.4)

        bodyStyle.borderTopStyle = "solid"; // works around an issue where a margin of a child element could throw off the bounds of the _body, making it seem like there's a margin when there actually isn't. The border ensures that the bounds are accurate.

        bounds = _getBounds(_body);
        _Observer_js__WEBPACK_IMPORTED_MODULE_0__._vertical.m = Math.round(bounds.top + _Observer_js__WEBPACK_IMPORTED_MODULE_0__._vertical.sc()) || 0; // accommodate the offset of the <body> caused by margins and/or padding

        _Observer_js__WEBPACK_IMPORTED_MODULE_0__._horizontal.m = Math.round(bounds.left + _Observer_js__WEBPACK_IMPORTED_MODULE_0__._horizontal.sc()) || 0;
        border ? bodyStyle.borderTopStyle = border : bodyStyle.removeProperty("border-top-style");

        if (!bodyHasStyle) {
          // SSR frameworks like Next.js complain if this attribute gets added.
          _body.setAttribute("style", ""); // it's not enough to just removeAttribute() - we must first set it to empty, otherwise Next.js complains.


          _body.removeAttribute("style");
        } // TODO: (?) maybe move to leveraging the velocity mechanism in Observer and skip intervals.


        _syncInterval = setInterval(_sync, 250);
        gsap.delayedCall(0.5, function () {
          return _startup = 0;
        });

        _addListener(_doc, "touchcancel", _passThrough); // some older Android devices intermittently stop dispatching "touchmove" events if we don't listen for "touchcancel" on the document.


        _addListener(_body, "touchstart", _passThrough); //works around Safari bug: https://gsap.com/forums/topic/21450-draggable-in-iframe-on-mobile-is-buggy/


        _multiListener(_addListener, _doc, "pointerdown,touchstart,mousedown", _pointerDownHandler);

        _multiListener(_addListener, _doc, "pointerup,touchend,mouseup", _pointerUpHandler);

        _transformProp = gsap.utils.checkPrefix("transform");

        _stateProps.push(_transformProp);

        _coreInitted = _getTime();
        _resizeDelay = gsap.delayedCall(0.2, _refreshAll).pause();
        _autoRefresh = [_doc, "visibilitychange", function () {
          var w = _win.innerWidth,
              h = _win.innerHeight;

          if (_doc.hidden) {
            _prevWidth = w;
            _prevHeight = h;
          } else if (_prevWidth !== w || _prevHeight !== h) {
            _onResize();
          }
        }, _doc, "DOMContentLoaded", _refreshAll, _win, "load", _refreshAll, _win, "resize", _onResize];

        _iterateAutoRefresh(_addListener);

        _triggers.forEach(function (trigger) {
          return trigger.enable(0, 1);
        });

        for (i = 0; i < _Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers.length; i += 3) {
          _wheelListener(_removeListener, _Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers[i], _Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers[i + 1]);

          _wheelListener(_removeListener, _Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers[i], _Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers[i + 2]);
        }
      } else if (_doc) {
        var onLoad = function onLoad() {
          ScrollTrigger.enable();

          _doc.removeEventListener("DOMContentLoaded", onLoad);
        };

        _doc.addEventListener("DOMContentLoaded", onLoad);
      }
    }
  };

  ScrollTrigger.config = function config(vars) {
    "limitCallbacks" in vars && (_limitCallbacks = !!vars.limitCallbacks);
    var ms = vars.syncInterval;
    ms && clearInterval(_syncInterval) || (_syncInterval = ms) && setInterval(_sync, ms);
    "ignoreMobileResize" in vars && (_ignoreMobileResize = ScrollTrigger.isTouch === 1 && vars.ignoreMobileResize);

    if ("autoRefreshEvents" in vars) {
      _iterateAutoRefresh(_removeListener) || _iterateAutoRefresh(_addListener, vars.autoRefreshEvents || "none");
      _ignoreResize = (vars.autoRefreshEvents + "").indexOf("resize") === -1;
    }
  };

  ScrollTrigger.scrollerProxy = function scrollerProxy(target, vars) {
    var t = (0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__._getTarget)(target),
        i = _Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers.indexOf(t),
        isViewport = _isViewport(t);

    if (~i) {
      _Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers.splice(i, isViewport ? 6 : 2);
    }

    if (vars) {
      isViewport ? _Observer_js__WEBPACK_IMPORTED_MODULE_0__._proxies.unshift(_win, vars, _body, vars, _docEl, vars) : _Observer_js__WEBPACK_IMPORTED_MODULE_0__._proxies.unshift(t, vars);
    }
  };

  ScrollTrigger.clearMatchMedia = function clearMatchMedia(query) {
    _triggers.forEach(function (t) {
      return t._ctx && t._ctx.query === query && t._ctx.kill(true, true);
    });
  };

  ScrollTrigger.isInViewport = function isInViewport(element, ratio, horizontal) {
    var bounds = (_isString(element) ? (0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__._getTarget)(element) : element).getBoundingClientRect(),
        offset = bounds[horizontal ? _width : _height] * ratio || 0;
    return horizontal ? bounds.right - offset > 0 && bounds.left + offset < _win.innerWidth : bounds.bottom - offset > 0 && bounds.top + offset < _win.innerHeight;
  };

  ScrollTrigger.positionInViewport = function positionInViewport(element, referencePoint, horizontal) {
    _isString(element) && (element = (0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__._getTarget)(element));
    var bounds = element.getBoundingClientRect(),
        size = bounds[horizontal ? _width : _height],
        offset = referencePoint == null ? size / 2 : referencePoint in _keywords ? _keywords[referencePoint] * size : ~referencePoint.indexOf("%") ? parseFloat(referencePoint) * size / 100 : parseFloat(referencePoint) || 0;
    return horizontal ? (bounds.left + offset) / _win.innerWidth : (bounds.top + offset) / _win.innerHeight;
  };

  ScrollTrigger.killAll = function killAll(allowListeners) {
    _triggers.slice(0).forEach(function (t) {
      return t.vars.id !== "ScrollSmoother" && t.kill();
    });

    if (allowListeners !== true) {
      var listeners = _listeners.killAll || [];
      _listeners = {};
      listeners.forEach(function (f) {
        return f();
      });
    }
  };

  return ScrollTrigger;
}();
ScrollTrigger.version = "3.15.1";

ScrollTrigger.saveStyles = function (targets) {
  return targets ? _toArray(targets).forEach(function (target) {
    // saved styles are recorded in a consecutive alternating Array, like [element, cssText, transform attribute, cache, matchMedia, ...]
    if (target && target.style) {
      var i = _savedStyles.indexOf(target);

      i >= 0 && _savedStyles.splice(i, 5);

      _savedStyles.push(target, target.style.cssText, target.getBBox && target.getAttribute("transform"), gsap.core.getCache(target), _context());
    }
  }) : _savedStyles;
};

ScrollTrigger.revert = function (soft, media) {
  return _revertAll(!soft, media);
};

ScrollTrigger.create = function (vars, animation) {
  return new ScrollTrigger(vars, animation);
};

ScrollTrigger.refresh = function (safe) {
  return safe ? _onResize(true) : (_coreInitted || ScrollTrigger.register()) && _refreshAll(true);
};

ScrollTrigger.update = function (force) {
  return ++_Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers.cache && _updateAll(force === true ? 2 : 0);
};

ScrollTrigger.clearScrollMemory = _clearScrollMemory;

ScrollTrigger.maxScroll = function (element, horizontal) {
  return _maxScroll(element, horizontal ? _Observer_js__WEBPACK_IMPORTED_MODULE_0__._horizontal : _Observer_js__WEBPACK_IMPORTED_MODULE_0__._vertical);
};

ScrollTrigger.getScrollFunc = function (element, horizontal) {
  return (0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__._getScrollFunc)((0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__._getTarget)(element), horizontal ? _Observer_js__WEBPACK_IMPORTED_MODULE_0__._horizontal : _Observer_js__WEBPACK_IMPORTED_MODULE_0__._vertical);
};

ScrollTrigger.getById = function (id) {
  return _ids[id];
};

ScrollTrigger.getAll = function () {
  return _triggers.filter(function (t) {
    return t.vars.id !== "ScrollSmoother";
  });
}; // it's common for people to ScrollTrigger.getAll(t => t.kill()) on page routes, for example, and we don't want it to ruin smooth scrolling by killing the main ScrollSmoother one.


ScrollTrigger.isScrolling = function () {
  return !!_lastScrollTime;
};

ScrollTrigger.snapDirectional = _snapDirectional;

ScrollTrigger.addEventListener = function (type, callback) {
  var a = _listeners[type] || (_listeners[type] = []);
  ~a.indexOf(callback) || a.push(callback);
};

ScrollTrigger.removeEventListener = function (type, callback) {
  var a = _listeners[type],
      i = a && a.indexOf(callback);
  i >= 0 && a.splice(i, 1);
};

ScrollTrigger.batch = function (targets, vars) {
  var result = [],
      varsCopy = {},
      interval = vars.interval || 0.016,
      batchMax = vars.batchMax || 1e9,
      proxyCallback = function proxyCallback(type, callback) {
    var elements = [],
        triggers = [],
        delay = gsap.delayedCall(interval, function () {
      callback(elements, triggers);
      elements = [];
      triggers = [];
    }).pause();
    return function (self) {
      elements.length || delay.restart(true);
      elements.push(self.trigger);
      triggers.push(self);
      batchMax <= elements.length && delay.progress(1);
    };
  },
      p;

  for (p in vars) {
    varsCopy[p] = p.substr(0, 2) === "on" && _isFunction(vars[p]) && p !== "onRefreshInit" ? proxyCallback(p, vars[p]) : vars[p];
  }

  if (_isFunction(batchMax)) {
    batchMax = batchMax();

    _addListener(ScrollTrigger, "refresh", function () {
      return batchMax = vars.batchMax();
    });
  }

  _toArray(targets).forEach(function (target) {
    var config = {};

    for (p in varsCopy) {
      config[p] = varsCopy[p];
    }

    config.trigger = target;
    result.push(ScrollTrigger.create(config));
  });

  return result;
}; // to reduce file size. clamps the scroll and also returns a duration multiplier so that if the scroll gets chopped shorter, the duration gets curtailed as well (otherwise if you're very close to the top of the page, for example, and swipe up really fast, it'll suddenly slow down and take a long time to reach the top).


var _clampScrollAndGetDurationMultiplier = function _clampScrollAndGetDurationMultiplier(scrollFunc, current, end, max) {
  current > max ? scrollFunc(max) : current < 0 && scrollFunc(0);
  return end > max ? (max - current) / (end - current) : end < 0 ? current / (current - end) : 1;
},
    _allowNativePanning = function _allowNativePanning(target, direction) {
  if (direction === true) {
    target.style.removeProperty("touch-action");
  } else {
    target.style.touchAction = direction === true ? "auto" : direction ? "pan-" + direction + (_Observer_js__WEBPACK_IMPORTED_MODULE_0__.Observer.isTouch ? " pinch-zoom" : "") : "none"; // note: Firefox doesn't support it pinch-zoom properly, at least in addition to a pan-x or pan-y.
  }

  target === _docEl && _allowNativePanning(_body, direction);
},
    _overflow = {
  auto: 1,
  scroll: 1
},
    _nestedScroll = function _nestedScroll(_ref5) {
  var event = _ref5.event,
      target = _ref5.target,
      axis = _ref5.axis;

  var node = (event.changedTouches ? event.changedTouches[0] : event).target,
      cache = node._gsap || gsap.core.getCache(node),
      time = _getTime(),
      cs;

  if (!cache._isScrollT || time - cache._isScrollT > 2000) {
    // cache for 2 seconds to improve performance.
    while (node && node !== _body && (node.scrollHeight <= node.clientHeight && node.scrollWidth <= node.clientWidth || !(_overflow[(cs = _getComputedStyle(node)).overflowY] || _overflow[cs.overflowX]))) {
      node = node.parentNode;
    }

    cache._isScroll = node && node !== target && !_isViewport(node) && (_overflow[(cs = _getComputedStyle(node)).overflowY] || _overflow[cs.overflowX]);
    cache._isScrollT = time;
  }

  if (cache._isScroll || axis === "x") {
    event.stopPropagation();
    event._gsapAllow = true;
  }
},
    // capture events on scrollable elements INSIDE the <body> and allow those by calling stopPropagation() when we find a scrollable ancestor
_inputObserver = function _inputObserver(target, type, inputs, nested) {
  return _Observer_js__WEBPACK_IMPORTED_MODULE_0__.Observer.create({
    target: target,
    capture: true,
    debounce: false,
    lockAxis: true,
    type: type,
    onWheel: nested = nested && _nestedScroll,
    onPress: nested,
    onDrag: nested,
    onScroll: nested,
    onEnable: function onEnable() {
      return inputs && _addListener(_doc, _Observer_js__WEBPACK_IMPORTED_MODULE_0__.Observer.eventTypes[0], _captureInputs, false, true);
    },
    onDisable: function onDisable() {
      return _removeListener(_doc, _Observer_js__WEBPACK_IMPORTED_MODULE_0__.Observer.eventTypes[0], _captureInputs, true);
    }
  });
},
    _inputExp = /(input|label|select|textarea)/i,
    _inputIsFocused,
    _captureInputs = function _captureInputs(e) {
  var isInput = _inputExp.test(e.target.tagName);

  if (isInput || _inputIsFocused) {
    e._gsapAllow = true;
    _inputIsFocused = isInput;
  }
},
    _getScrollNormalizer = function _getScrollNormalizer(vars) {
  _isObject(vars) || (vars = {});
  vars.preventDefault = vars.isNormalizer = vars.allowClicks = true;
  vars.type || (vars.type = "wheel,touch");
  vars.debounce = !!vars.debounce;
  vars.id = vars.id || "normalizer";

  var _vars2 = vars,
      normalizeScrollX = _vars2.normalizeScrollX,
      momentum = _vars2.momentum,
      allowNestedScroll = _vars2.allowNestedScroll,
      onRelease = _vars2.onRelease,
      self,
      maxY,
      target = (0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__._getTarget)(vars.target) || _docEl,
      smoother = gsap.core.globals().ScrollSmoother,
      smootherInstance = smoother && smoother.get(),
      content = _fixIOSBug && (vars.content && (0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__._getTarget)(vars.content) || smootherInstance && vars.content !== false && !smootherInstance.smooth() && smootherInstance.content()),
      scrollFuncY = (0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__._getScrollFunc)(target, _Observer_js__WEBPACK_IMPORTED_MODULE_0__._vertical),
      scrollFuncX = (0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__._getScrollFunc)(target, _Observer_js__WEBPACK_IMPORTED_MODULE_0__._horizontal),
      scale = 1,
      initialScale = (_Observer_js__WEBPACK_IMPORTED_MODULE_0__.Observer.isTouch && _win.visualViewport ? _win.visualViewport.scale * _win.visualViewport.width : _win.outerWidth) / _win.innerWidth,
      wheelRefresh = 0,
      resolveMomentumDuration = _isFunction(momentum) ? function () {
    return momentum(self);
  } : function () {
    return momentum || 2.8;
  },
      lastRefreshID,
      skipTouchMove,
      inputObserver = _inputObserver(target, vars.type, true, allowNestedScroll),
      resumeTouchMove = function resumeTouchMove() {
    return skipTouchMove = false;
  },
      scrollClampX = _passThrough,
      scrollClampY = _passThrough,
      updateClamps = function updateClamps() {
    maxY = _maxScroll(target, _Observer_js__WEBPACK_IMPORTED_MODULE_0__._vertical);
    scrollClampY = _clamp(_fixIOSBug ? 1 : 0, maxY);
    normalizeScrollX && (scrollClampX = _clamp(0, _maxScroll(target, _Observer_js__WEBPACK_IMPORTED_MODULE_0__._horizontal)));
    lastRefreshID = _refreshID;
  },
      removeContentOffset = function removeContentOffset() {
    content._gsap.y = _round(parseFloat(content._gsap.y) + scrollFuncY.offset) + "px";
    content.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + parseFloat(content._gsap.y) + ", 0, 1)";
    scrollFuncY.offset = scrollFuncY.cacheID = 0;
  },
      ignoreDrag = function ignoreDrag() {
    if (skipTouchMove) {
      requestAnimationFrame(resumeTouchMove);

      var offset = _round(self.deltaY / 2),
          scroll = scrollClampY(scrollFuncY.v - offset);

      if (content && scroll !== scrollFuncY.v + scrollFuncY.offset) {
        scrollFuncY.offset = scroll - scrollFuncY.v;

        var y = _round((parseFloat(content && content._gsap.y) || 0) - scrollFuncY.offset);

        content.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + y + ", 0, 1)";
        content._gsap.y = y + "px";
        scrollFuncY.cacheID = _Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers.cache;

        _updateAll();
      }

      return true;
    }

    scrollFuncY.offset && removeContentOffset();
    skipTouchMove = true;
  },
      tween,
      startScrollX,
      startScrollY,
      onStopDelayedCall,
      onResize = function onResize() {
    // if the window resizes, like on an iPhone which Apple FORCES the address bar to show/hide even if we event.preventDefault(), it may be scrolling too far now that the address bar is showing, so we must dynamically adjust the momentum tween.
    updateClamps();

    if (tween.isActive() && tween.vars.scrollY > maxY) {
      scrollFuncY() > maxY ? tween.progress(1) && scrollFuncY(maxY) : tween.resetTo("scrollY", maxY);
    }
  };

  content && gsap.set(content, {
    y: "+=0"
  }); // to ensure there's a cache (element._gsap)

  vars.ignoreCheck = function (e) {
    return _fixIOSBug && e.type === "touchmove" && ignoreDrag(e) || scale > 1.05 && e.type !== "touchstart" || self.isGesturing || e.touches && e.touches.length > 1;
  };

  vars.onPress = function () {
    skipTouchMove = false;
    var prevScale = scale;
    scale = _round((_win.visualViewport && _win.visualViewport.scale || 1) / initialScale);
    tween.pause();
    prevScale !== scale && _allowNativePanning(target, scale > 1.01 ? true : normalizeScrollX ? false : "x");
    startScrollX = scrollFuncX();
    startScrollY = scrollFuncY();
    updateClamps();
    lastRefreshID = _refreshID;
  };

  vars.onRelease = vars.onGestureStart = function (self, wasDragging) {
    scrollFuncY.offset && removeContentOffset();

    if (!wasDragging) {
      onStopDelayedCall.restart(true);
    } else {
      _Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers.cache++; // make sure we're pulling the non-cached value
      // alternate algorithm: durX = Math.min(6, Math.abs(self.velocityX / 800)),	dur = Math.max(durX, Math.min(6, Math.abs(self.velocityY / 800))); dur = dur * (0.4 + (1 - _power4In(dur / 6)) * 0.6)) * (momentumSpeed || 1)

      var dur = resolveMomentumDuration(),
          currentScroll,
          endScroll;

      if (normalizeScrollX) {
        currentScroll = scrollFuncX();
        endScroll = currentScroll + dur * 0.05 * -self.velocityX / 0.227; // the constant .227 is from power4(0.05). velocity is inverted because scrolling goes in the opposite direction.

        dur *= _clampScrollAndGetDurationMultiplier(scrollFuncX, currentScroll, endScroll, _maxScroll(target, _Observer_js__WEBPACK_IMPORTED_MODULE_0__._horizontal));
        tween.vars.scrollX = scrollClampX(endScroll);
      }

      currentScroll = scrollFuncY();
      endScroll = currentScroll + dur * 0.05 * -self.velocityY / 0.227; // the constant .227 is from power4(0.05)

      dur *= _clampScrollAndGetDurationMultiplier(scrollFuncY, currentScroll, endScroll, _maxScroll(target, _Observer_js__WEBPACK_IMPORTED_MODULE_0__._vertical));
      tween.vars.scrollY = scrollClampY(endScroll);
      tween.invalidate().duration(dur).play(0.01);

      if (_fixIOSBug && tween.vars.scrollY >= maxY || currentScroll >= maxY - 1) {
        // iOS bug: it'll show the address bar but NOT fire the window "resize" event until the animation is done but we must protect against overshoot so we leverage an onUpdate to do so.
        gsap.to({}, {
          onUpdate: onResize,
          duration: dur
        });
      }
    }

    onRelease && onRelease(self);
  };

  vars.onWheel = function () {
    tween._ts && tween.pause();

    if (_getTime() - wheelRefresh > 1000) {
      // after 1 second, refresh the clamps otherwise that'll only happen when ScrollTrigger.refresh() is called or for touch-scrolling.
      lastRefreshID = 0;
      wheelRefresh = _getTime();
    }
  };

  vars.onChange = function (self, dx, dy, xArray, yArray) {
    _refreshID !== lastRefreshID && updateClamps();
    dx && normalizeScrollX && scrollFuncX(scrollClampX(xArray[2] === dx ? startScrollX + (self.startX - self.x) : scrollFuncX() + dx - xArray[1])); // for more precision, we track pointer/touch movement from the start, otherwise it'll drift.

    if (dy) {
      scrollFuncY.offset && removeContentOffset();
      var isTouch = yArray[2] === dy,
          y = isTouch ? startScrollY + self.startY - self.y : scrollFuncY() + dy - yArray[1],
          yClamped = scrollClampY(y);
      isTouch && y !== yClamped && (startScrollY += yClamped - y);
      scrollFuncY(yClamped);
    }

    (dy || dx) && _updateAll();
  };

  vars.onEnable = function () {
    _allowNativePanning(target, normalizeScrollX ? false : "x");

    ScrollTrigger.addEventListener("refresh", onResize);

    _addListener(_win, "resize", onResize);

    if (scrollFuncY.smooth) {
      scrollFuncY.target.style.scrollBehavior = "auto";
      scrollFuncY.smooth = scrollFuncX.smooth = false;
    }

    inputObserver.enable();
  };

  vars.onDisable = function () {
    _allowNativePanning(target, true);

    _removeListener(_win, "resize", onResize);

    ScrollTrigger.removeEventListener("refresh", onResize);
    inputObserver.kill();
  };

  vars.lockAxis = vars.lockAxis !== false;
  self = new _Observer_js__WEBPACK_IMPORTED_MODULE_0__.Observer(vars);
  self.iOS = _fixIOSBug; // used in the Observer getCachedScroll() function to work around an iOS bug that wreaks havoc with TouchEvent.clientY if we allow scroll to go all the way back to 0.

  _fixIOSBug && !scrollFuncY() && scrollFuncY(1); // iOS bug causes event.clientY values to freak out (wildly inaccurate) if the scroll position is exactly 0.

  _fixIOSBug && gsap.ticker.add(_passThrough); // prevent the ticker from sleeping

  onStopDelayedCall = self._dc;
  tween = gsap.to(self, {
    ease: "power4",
    paused: true,
    inherit: false,
    scrollX: normalizeScrollX ? "+=0.1" : "+=0",
    scrollY: "+=0.1",
    modifiers: {
      scrollY: _interruptionTracker(scrollFuncY, scrollFuncY(), function () {
        return tween.pause();
      })
    },
    onUpdate: _updateAll,
    onComplete: onStopDelayedCall.vars.onComplete
  }); // we need the modifier to sense if the scroll position is altered outside of the momentum tween (like with a scrollTo tween) so we can pause() it to prevent conflicts.

  return self;
};

ScrollTrigger.sort = function (func) {
  if (_isFunction(func)) {
    return _triggers.sort(func);
  }

  var scroll = _win.pageYOffset || 0;
  ScrollTrigger.getAll().forEach(function (t) {
    return t._sortY = t.trigger ? scroll + t.trigger.getBoundingClientRect().top : t.start + _win.innerHeight;
  });
  return _triggers.sort(func || function (a, b) {
    return (a.vars.refreshPriority || 0) * -1e6 + (a.vars.containerAnimation ? 1e6 : a._sortY) - ((b.vars.containerAnimation ? 1e6 : b._sortY) + (b.vars.refreshPriority || 0) * -1e6);
  }); // anything with a containerAnimation should refresh last.
};

ScrollTrigger.observe = function (vars) {
  return new _Observer_js__WEBPACK_IMPORTED_MODULE_0__.Observer(vars);
};

ScrollTrigger.normalizeScroll = function (vars) {
  if (typeof vars === "undefined") {
    return _normalizer;
  }

  if (vars === true && _normalizer) {
    return _normalizer.enable();
  }

  if (vars === false) {
    _normalizer && _normalizer.kill();
    _normalizer = vars;
    return;
  }

  var normalizer = vars instanceof _Observer_js__WEBPACK_IMPORTED_MODULE_0__.Observer ? vars : _getScrollNormalizer(vars);
  _normalizer && _normalizer.target === normalizer.target && _normalizer.kill();
  _isViewport(normalizer.target) && (_normalizer = normalizer);
  return normalizer;
};

ScrollTrigger.core = {
  // smaller file size way to leverage in ScrollSmoother and Observer
  _getVelocityProp: _Observer_js__WEBPACK_IMPORTED_MODULE_0__._getVelocityProp,
  _inputObserver: _inputObserver,
  _scrollers: _Observer_js__WEBPACK_IMPORTED_MODULE_0__._scrollers,
  _proxies: _Observer_js__WEBPACK_IMPORTED_MODULE_0__._proxies,
  bridge: {
    // when normalizeScroll sets the scroll position (ss = setScroll)
    ss: function ss() {
      _lastScrollTime || _dispatch("scrollStart");
      _lastScrollTime = _getTime();
    },
    // a way to get the _refreshing value in Observer
    ref: function ref() {
      return _refreshing;
    }
  }
};
_getGSAP() && gsap.registerPlugin(ScrollTrigger);
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uLi9ub2RlX21vZHVsZXMvZ3NhcC9TY3JvbGxUcmlnZ2VyLmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDb0o7O0FBRXBKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0EsU0FBUywyREFBYTtBQUN0QjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxHQUFHO0FBQ0gsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYywyREFBYTtBQUMzQjtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0EseUJBQXlCLGtEQUFRO0FBQ2pDO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCwyREFBYTtBQUM5RCxDQUFDO0FBQ0Q7QUFDQSxrQkFBa0IseUJBQXlCO0FBQzNDO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBMEI7O0FBRTFCLGtCQUFrQixjQUFjO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FB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QTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLFFBQVE7OztBQUdSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLDBDQUEwQztBQUMxQzs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVULG9DQUFvQztBQUNwQzs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9DQUFvQzs7QUFFcEM7QUFDQTtBQUNBLFFBQVEsb0RBQVUsVUFBVTs7QUFFNUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQSwrQkFBK0I7QUFDL0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7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O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxrREFBUTtBQUNyQix5QkFBeUI7O0FBRXpCLGtEQUFrRDs7QUFFbEQsK0NBQStDOztBQUUvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUcsR0FBRzs7QUFFTjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRyxHQUFHO0FBQ047O0FBRUE7QUFDQSxhQUFhLGtEQUFRO0FBQ3JCOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1DQUFtQyxrREFBUTtBQUMzQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLDBEQUFnQjtBQUNwQztBQUNBLGNBQWMsb0RBQVU7QUFDeEIsWUFBWSxrREFBUTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXEhhbnVtYW50XFxEZXNrdG9wXFxLYW1hbHRhcmFcXHdpbmVmcmllbmRcXG5vZGVfbW9kdWxlc1xcZ3NhcFxcU2Nyb2xsVHJpZ2dlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIFNjcm9sbFRyaWdnZXIgMy4xNS4xXG4gKiBodHRwczovL2dzYXAuY29tXG4gKlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IDIwMDgtMjAyNiwgR3JlZW5Tb2NrLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogU3ViamVjdCB0byB0aGUgdGVybXMgYXQgaHR0cHM6Ly9nc2FwLmNvbS9zdGFuZGFyZC1saWNlbnNlXG4gKiBAYXV0aG9yOiBKYWNrIERveWxlLCBqYWNrQGdyZWVuc29jay5jb21cbiovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5pbXBvcnQgeyBPYnNlcnZlciwgX2dldFRhcmdldCwgX3ZlcnRpY2FsLCBfaG9yaXpvbnRhbCwgX3Njcm9sbGVycywgX3Byb3hpZXMsIF9nZXRTY3JvbGxGdW5jLCBfZ2V0UHJveHlQcm9wLCBfZ2V0VmVsb2NpdHlQcm9wIH0gZnJvbSBcIi4vT2JzZXJ2ZXIuanNcIjtcblxudmFyIGdzYXAsXG4gICAgX2NvcmVJbml0dGVkLFxuICAgIF93aW4sXG4gICAgX2RvYyxcbiAgICBfZG9jRWwsXG4gICAgX2JvZHksXG4gICAgX3Jvb3QsXG4gICAgX3Jlc2l6ZURlbGF5LFxuICAgIF90b0FycmF5LFxuICAgIF9jbGFtcCxcbiAgICBfdGltZTIsXG4gICAgX3N5bmNJbnRlcnZhbCxcbiAgICBfcmVmcmVzaGluZyxcbiAgICBfcG9pbnRlcklzRG93bixcbiAgICBfdHJhbnNmb3JtUHJvcCxcbiAgICBfaSxcbiAgICBfcHJldldpZHRoLFxuICAgIF9wcmV2SGVpZ2h0LFxuICAgIF9hdXRvUmVmcmVzaCxcbiAgICBfc29ydCxcbiAgICBfc3VwcHJlc3NPdmVyd3JpdGVzLFxuICAgIF9pZ25vcmVSZXNpemUsXG4gICAgX25vcm1hbGl6ZXIsXG4gICAgX2lnbm9yZU1vYmlsZVJlc2l6ZSxcbiAgICBfYmFzZVNjcmVlbkhlaWdodCxcbiAgICBfYmFzZVNjcmVlbldpZHRoLFxuICAgIF9maXhJT1NCdWcsXG4gICAgX2NvbnRleHQsXG4gICAgX3Njcm9sbFJlc3RvcmF0aW9uLFxuICAgIF9kaXYxMDB2aCxcbiAgICBfMTAwdmgsXG4gICAgX2lzUmV2ZXJ0ZWQsXG4gICAgX2NsYW1waW5nTWF4LFxuICAgIF9saW1pdENhbGxiYWNrcyxcbiAgICAvLyBpZiB0cnVlLCB3ZSdsbCBvbmx5IHRyaWdnZXIgY2FsbGJhY2tzIGlmIHRoZSBhY3RpdmUgc3RhdGUgdG9nZ2xlcywgc28gaWYgeW91IHNjcm9sbCBpbW1lZGlhdGVseSBwYXN0IGJvdGggdGhlIHN0YXJ0IGFuZCBlbmQgcG9zaXRpb25zIG9mIGEgU2Nyb2xsVHJpZ2dlciAodGh1cyBpbmFjdGl2ZSB0byBpbmFjdGl2ZSksIG5laXRoZXIgaXRzIG9uRW50ZXIgbm9yIG9uTGVhdmUgd2lsbCBiZSBjYWxsZWQuIFRoaXMgaXMgdXNlZnVsIGR1cmluZyBzdGFydHVwLlxuX3N0YXJ0dXAgPSAxLFxuICAgIF9nZXRUaW1lID0gRGF0ZS5ub3csXG4gICAgX3RpbWUxID0gX2dldFRpbWUoKSxcbiAgICBfbGFzdFNjcm9sbFRpbWUgPSAwLFxuICAgIF9lbmFibGVkID0gMCxcbiAgICBfcGFyc2VDbGFtcCA9IGZ1bmN0aW9uIF9wYXJzZUNsYW1wKHZhbHVlLCB0eXBlLCBzZWxmKSB7XG4gIHZhciBjbGFtcCA9IF9pc1N0cmluZyh2YWx1ZSkgJiYgKHZhbHVlLnN1YnN0cigwLCA2KSA9PT0gXCJjbGFtcChcIiB8fCB2YWx1ZS5pbmRleE9mKFwibWF4XCIpID4gLTEpO1xuICBzZWxmW1wiX1wiICsgdHlwZSArIFwiQ2xhbXBcIl0gPSBjbGFtcDtcbiAgcmV0dXJuIGNsYW1wID8gdmFsdWUuc3Vic3RyKDYsIHZhbHVlLmxlbmd0aCAtIDcpIDogdmFsdWU7XG59LFxuICAgIF9rZWVwQ2xhbXAgPSBmdW5jdGlvbiBfa2VlcENsYW1wKHZhbHVlLCBjbGFtcCkge1xuICByZXR1cm4gY2xhbXAgJiYgKCFfaXNTdHJpbmcodmFsdWUpIHx8IHZhbHVlLnN1YnN0cigwLCA2KSAhPT0gXCJjbGFtcChcIikgPyBcImNsYW1wKFwiICsgdmFsdWUgKyBcIilcIiA6IHZhbHVlO1xufSxcbiAgICBfcmFmQnVnRml4ID0gZnVuY3Rpb24gX3JhZkJ1Z0ZpeCgpIHtcbiAgcmV0dXJuIF9lbmFibGVkICYmIHJlcXVlc3RBbmltYXRpb25GcmFtZShfcmFmQnVnRml4KTtcbn0sXG4gICAgLy8gaW4gc29tZSBicm93c2VycyAobGlrZSBGaXJlZm94KSwgc2NyZWVuIHJlcGFpbnRzIHdlcmVuJ3QgY29uc2lzdGVudCB1bmxlc3Mgd2UgaGFkIFNPTUVUSElORyBxdWV1ZWQgdXAgaW4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCkhIFNvIHRoaXMganVzdCBjcmVhdGVzIGEgc3VwZXIgc2ltcGxlIGxvb3AgdG8ga2VlcCBpdCBhbGl2ZSBhbmQgc21vb3RoIG91dCByZXBhaW50cy5cbl9wb2ludGVyRG93bkhhbmRsZXIgPSBmdW5jdGlvbiBfcG9pbnRlckRvd25IYW5kbGVyKCkge1xuICByZXR1cm4gX3BvaW50ZXJJc0Rvd24gPSAxO1xufSxcbiAgICBfcG9pbnRlclVwSGFuZGxlciA9IGZ1bmN0aW9uIF9wb2ludGVyVXBIYW5kbGVyKCkge1xuICByZXR1cm4gX3BvaW50ZXJJc0Rvd24gPSAwO1xufSxcbiAgICBfcGFzc1Rocm91Z2ggPSBmdW5jdGlvbiBfcGFzc1Rocm91Z2godikge1xuICByZXR1cm4gdjtcbn0sXG4gICAgX3JvdW5kID0gZnVuY3Rpb24gX3JvdW5kKHZhbHVlKSB7XG4gIHJldHVybiBNYXRoLnJvdW5kKHZhbHVlICogMTAwMDAwKSAvIDEwMDAwMCB8fCAwO1xufSxcbiAgICBfd2luZG93RXhpc3RzID0gZnVuY3Rpb24gX3dpbmRvd0V4aXN0cygpIHtcbiAgcmV0dXJuIHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCI7XG59LFxuICAgIF9nZXRHU0FQID0gZnVuY3Rpb24gX2dldEdTQVAoKSB7XG4gIHJldHVybiBnc2FwIHx8IF93aW5kb3dFeGlzdHMoKSAmJiAoZ3NhcCA9IHdpbmRvdy5nc2FwKSAmJiBnc2FwLnJlZ2lzdGVyUGx1Z2luICYmIGdzYXA7XG59LFxuICAgIF9pc1ZpZXdwb3J0ID0gZnVuY3Rpb24gX2lzVmlld3BvcnQoZSkge1xuICByZXR1cm4gISF+X3Jvb3QuaW5kZXhPZihlKTtcbn0sXG4gICAgX2dldFZpZXdwb3J0RGltZW5zaW9uID0gZnVuY3Rpb24gX2dldFZpZXdwb3J0RGltZW5zaW9uKGRpbWVuc2lvblByb3BlcnR5KSB7XG4gIHJldHVybiAoZGltZW5zaW9uUHJvcGVydHkgPT09IFwiSGVpZ2h0XCIgPyBfMTAwdmggOiBfd2luW1wiaW5uZXJcIiArIGRpbWVuc2lvblByb3BlcnR5XSkgfHwgX2RvY0VsW1wiY2xpZW50XCIgKyBkaW1lbnNpb25Qcm9wZXJ0eV0gfHwgX2JvZHlbXCJjbGllbnRcIiArIGRpbWVuc2lvblByb3BlcnR5XTtcbn0sXG4gICAgX2dldEJvdW5kc0Z1bmMgPSBmdW5jdGlvbiBfZ2V0Qm91bmRzRnVuYyhlbGVtZW50KSB7XG4gIHJldHVybiBfZ2V0UHJveHlQcm9wKGVsZW1lbnQsIFwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0XCIpIHx8IChfaXNWaWV3cG9ydChlbGVtZW50KSA/IGZ1bmN0aW9uICgpIHtcbiAgICBfd2luT2Zmc2V0cy53aWR0aCA9IF93aW4uaW5uZXJXaWR0aDtcbiAgICBfd2luT2Zmc2V0cy5oZWlnaHQgPSBfMTAwdmg7XG4gICAgcmV0dXJuIF93aW5PZmZzZXRzO1xuICB9IDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfZ2V0Qm91bmRzKGVsZW1lbnQpO1xuICB9KTtcbn0sXG4gICAgX2dldFNpemVGdW5jID0gZnVuY3Rpb24gX2dldFNpemVGdW5jKHNjcm9sbGVyLCBpc1ZpZXdwb3J0LCBfcmVmKSB7XG4gIHZhciBkID0gX3JlZi5kLFxuICAgICAgZDIgPSBfcmVmLmQyLFxuICAgICAgYSA9IF9yZWYuYTtcbiAgcmV0dXJuIChhID0gX2dldFByb3h5UHJvcChzY3JvbGxlciwgXCJnZXRCb3VuZGluZ0NsaWVudFJlY3RcIikpID8gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBhKClbZF07XG4gIH0gOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChpc1ZpZXdwb3J0ID8gX2dldFZpZXdwb3J0RGltZW5zaW9uKGQyKSA6IHNjcm9sbGVyW1wiY2xpZW50XCIgKyBkMl0pIHx8IDA7XG4gIH07XG59LFxuICAgIF9nZXRPZmZzZXRzRnVuYyA9IGZ1bmN0aW9uIF9nZXRPZmZzZXRzRnVuYyhlbGVtZW50LCBpc1ZpZXdwb3J0KSB7XG4gIHJldHVybiAhaXNWaWV3cG9ydCB8fCB+X3Byb3hpZXMuaW5kZXhPZihlbGVtZW50KSA/IF9nZXRCb3VuZHNGdW5jKGVsZW1lbnQpIDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfd2luT2Zmc2V0cztcbiAgfTtcbn0sXG4gICAgX21heFNjcm9sbCA9IGZ1bmN0aW9uIF9tYXhTY3JvbGwoZWxlbWVudCwgX3JlZjIpIHtcbiAgdmFyIHMgPSBfcmVmMi5zLFxuICAgICAgZDIgPSBfcmVmMi5kMixcbiAgICAgIGQgPSBfcmVmMi5kLFxuICAgICAgYSA9IF9yZWYyLmE7XG4gIHJldHVybiBNYXRoLm1heCgwLCAocyA9IFwic2Nyb2xsXCIgKyBkMikgJiYgKGEgPSBfZ2V0UHJveHlQcm9wKGVsZW1lbnQsIHMpKSA/IGEoKSAtIF9nZXRCb3VuZHNGdW5jKGVsZW1lbnQpKClbZF0gOiBfaXNWaWV3cG9ydChlbGVtZW50KSA/IChfZG9jRWxbc10gfHwgX2JvZHlbc10pIC0gX2dldFZpZXdwb3J0RGltZW5zaW9uKGQyKSA6IGVsZW1lbnRbc10gLSBlbGVtZW50W1wib2Zmc2V0XCIgKyBkMl0pO1xufSxcbiAgICBfaXRlcmF0ZUF1dG9SZWZyZXNoID0gZnVuY3Rpb24gX2l0ZXJhdGVBdXRvUmVmcmVzaChmdW5jLCBldmVudHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBfYXV0b1JlZnJlc2gubGVuZ3RoOyBpICs9IDMpIHtcbiAgICAoIWV2ZW50cyB8fCB+ZXZlbnRzLmluZGV4T2YoX2F1dG9SZWZyZXNoW2kgKyAxXSkpICYmIGZ1bmMoX2F1dG9SZWZyZXNoW2ldLCBfYXV0b1JlZnJlc2hbaSArIDFdLCBfYXV0b1JlZnJlc2hbaSArIDJdKTtcbiAgfVxufSxcbiAgICBfaXNTdHJpbmcgPSBmdW5jdGlvbiBfaXNTdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIjtcbn0sXG4gICAgX2lzRnVuY3Rpb24gPSBmdW5jdGlvbiBfaXNGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCI7XG59LFxuICAgIF9pc051bWJlciA9IGZ1bmN0aW9uIF9pc051bWJlcih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiO1xufSxcbiAgICBfaXNPYmplY3QgPSBmdW5jdGlvbiBfaXNPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIjtcbn0sXG4gICAgX2VuZEFuaW1hdGlvbiA9IGZ1bmN0aW9uIF9lbmRBbmltYXRpb24oYW5pbWF0aW9uLCByZXZlcnNlZCwgcGF1c2UpIHtcbiAgcmV0dXJuIGFuaW1hdGlvbiAmJiBhbmltYXRpb24ucHJvZ3Jlc3MocmV2ZXJzZWQgPyAwIDogMSkgJiYgcGF1c2UgJiYgYW5pbWF0aW9uLnBhdXNlKCk7XG59LFxuICAgIF9jYWxsYmFjayA9IGZ1bmN0aW9uIF9jYWxsYmFjayhzZWxmLCBmdW5jLCBleHRyYVBhcmFtKSB7XG4gIGlmIChzZWxmLmVuYWJsZWQpIHtcbiAgICB2YXIgcmVzdWx0ID0gc2VsZi5fY3R4ID8gc2VsZi5fY3R4LmFkZChmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZnVuYyhzZWxmLCBleHRyYVBhcmFtKTtcbiAgICB9KSA6IGZ1bmMoc2VsZiwgZXh0cmFQYXJhbSk7XG4gICAgcmVzdWx0ICYmIHJlc3VsdC50b3RhbFRpbWUgJiYgKHNlbGYuY2FsbGJhY2tBbmltYXRpb24gPSByZXN1bHQpO1xuICB9XG59LFxuICAgIF9hYnMgPSBNYXRoLmFicyxcbiAgICBfbGVmdCA9IFwibGVmdFwiLFxuICAgIF90b3AgPSBcInRvcFwiLFxuICAgIF9yaWdodCA9IFwicmlnaHRcIixcbiAgICBfYm90dG9tID0gXCJib3R0b21cIixcbiAgICBfd2lkdGggPSBcIndpZHRoXCIsXG4gICAgX2hlaWdodCA9IFwiaGVpZ2h0XCIsXG4gICAgX1JpZ2h0ID0gXCJSaWdodFwiLFxuICAgIF9MZWZ0ID0gXCJMZWZ0XCIsXG4gICAgX1RvcCA9IFwiVG9wXCIsXG4gICAgX0JvdHRvbSA9IFwiQm90dG9tXCIsXG4gICAgX3BhZGRpbmcgPSBcInBhZGRpbmdcIixcbiAgICBfbWFyZ2luID0gXCJtYXJnaW5cIixcbiAgICBfV2lkdGggPSBcIldpZHRoXCIsXG4gICAgX0hlaWdodCA9IFwiSGVpZ2h0XCIsXG4gICAgX3B4ID0gXCJweFwiLFxuICAgIF9nZXRDb21wdXRlZFN0eWxlID0gZnVuY3Rpb24gX2dldENvbXB1dGVkU3R5bGUoZWxlbWVudCkge1xuICByZXR1cm4gX3dpbi5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQubm9kZVR5cGUgPT09IE5vZGUuRE9DVU1FTlRfTk9ERSA/IGVsZW1lbnQuc2Nyb2xsaW5nRWxlbWVudCA6IGVsZW1lbnQpO1xufSxcbiAgICBfbWFrZVBvc2l0aW9uYWJsZSA9IGZ1bmN0aW9uIF9tYWtlUG9zaXRpb25hYmxlKGVsZW1lbnQpIHtcbiAgLy8gaWYgdGhlIGVsZW1lbnQgYWxyZWFkeSBoYXMgcG9zaXRpb246IGFic29sdXRlIG9yIGZpeGVkLCBsZWF2ZSB0aGF0LCBvdGhlcndpc2UgbWFrZSBpdCBwb3NpdGlvbjogcmVsYXRpdmVcbiAgdmFyIHBvc2l0aW9uID0gX2dldENvbXB1dGVkU3R5bGUoZWxlbWVudCkucG9zaXRpb247XG5cbiAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IHBvc2l0aW9uID09PSBcImFic29sdXRlXCIgfHwgcG9zaXRpb24gPT09IFwiZml4ZWRcIiA/IHBvc2l0aW9uIDogXCJyZWxhdGl2ZVwiO1xufSxcbiAgICBfc2V0RGVmYXVsdHMgPSBmdW5jdGlvbiBfc2V0RGVmYXVsdHMob2JqLCBkZWZhdWx0cykge1xuICBmb3IgKHZhciBwIGluIGRlZmF1bHRzKSB7XG4gICAgcCBpbiBvYmogfHwgKG9ialtwXSA9IGRlZmF1bHRzW3BdKTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59LFxuICAgIF9nZXRCb3VuZHMgPSBmdW5jdGlvbiBfZ2V0Qm91bmRzKGVsZW1lbnQsIHdpdGhvdXRUcmFuc2Zvcm1zKSB7XG4gIHZhciB0d2VlbiA9IHdpdGhvdXRUcmFuc2Zvcm1zICYmIF9nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpW190cmFuc2Zvcm1Qcm9wXSAhPT0gXCJtYXRyaXgoMSwgMCwgMCwgMSwgMCwgMClcIiAmJiBnc2FwLnRvKGVsZW1lbnQsIHtcbiAgICB4OiAwLFxuICAgIHk6IDAsXG4gICAgeFBlcmNlbnQ6IDAsXG4gICAgeVBlcmNlbnQ6IDAsXG4gICAgcm90YXRpb246IDAsXG4gICAgcm90YXRpb25YOiAwLFxuICAgIHJvdGF0aW9uWTogMCxcbiAgICBzY2FsZTogMSxcbiAgICBza2V3WDogMCxcbiAgICBza2V3WTogMFxuICB9KS5wcm9ncmVzcygxKSxcbiAgICAgIGJvdW5kcyA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0ID8gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSA6IGVsZW1lbnQuc2Nyb2xsaW5nRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgdHdlZW4gJiYgdHdlZW4ucHJvZ3Jlc3MoMCkua2lsbCgpO1xuICByZXR1cm4gYm91bmRzO1xufSxcbiAgICBfZ2V0U2l6ZSA9IGZ1bmN0aW9uIF9nZXRTaXplKGVsZW1lbnQsIF9yZWYzKSB7XG4gIHZhciBkMiA9IF9yZWYzLmQyO1xuICByZXR1cm4gZWxlbWVudFtcIm9mZnNldFwiICsgZDJdIHx8IGVsZW1lbnRbXCJjbGllbnRcIiArIGQyXSB8fCAwO1xufSxcbiAgICBfZ2V0TGFiZWxSYXRpb0FycmF5ID0gZnVuY3Rpb24gX2dldExhYmVsUmF0aW9BcnJheSh0aW1lbGluZSkge1xuICB2YXIgYSA9IFtdLFxuICAgICAgbGFiZWxzID0gdGltZWxpbmUubGFiZWxzLFxuICAgICAgZHVyYXRpb24gPSB0aW1lbGluZS5kdXJhdGlvbigpLFxuICAgICAgcDtcblxuICBmb3IgKHAgaW4gbGFiZWxzKSB7XG4gICAgYS5wdXNoKGxhYmVsc1twXSAvIGR1cmF0aW9uKTtcbiAgfVxuXG4gIHJldHVybiBhO1xufSxcbiAgICBfZ2V0Q2xvc2VzdExhYmVsID0gZnVuY3Rpb24gX2dldENsb3Nlc3RMYWJlbChhbmltYXRpb24pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBnc2FwLnV0aWxzLnNuYXAoX2dldExhYmVsUmF0aW9BcnJheShhbmltYXRpb24pLCB2YWx1ZSk7XG4gIH07XG59LFxuICAgIF9zbmFwRGlyZWN0aW9uYWwgPSBmdW5jdGlvbiBfc25hcERpcmVjdGlvbmFsKHNuYXBJbmNyZW1lbnRPckFycmF5KSB7XG4gIHZhciBzbmFwID0gZ3NhcC51dGlscy5zbmFwKHNuYXBJbmNyZW1lbnRPckFycmF5KSxcbiAgICAgIGEgPSBBcnJheS5pc0FycmF5KHNuYXBJbmNyZW1lbnRPckFycmF5KSAmJiBzbmFwSW5jcmVtZW50T3JBcnJheS5zbGljZSgwKS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIGEgLSBiO1xuICB9KTtcbiAgcmV0dXJuIGEgPyBmdW5jdGlvbiAodmFsdWUsIGRpcmVjdGlvbiwgdGhyZXNob2xkKSB7XG4gICAgaWYgKHRocmVzaG9sZCA9PT0gdm9pZCAwKSB7XG4gICAgICB0aHJlc2hvbGQgPSAxZS0zO1xuICAgIH1cblxuICAgIHZhciBpO1xuXG4gICAgaWYgKCFkaXJlY3Rpb24pIHtcbiAgICAgIHJldHVybiBzbmFwKHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAoZGlyZWN0aW9uID4gMCkge1xuICAgICAgdmFsdWUgLT0gdGhyZXNob2xkOyAvLyB0byBhdm9pZCByb3VuZGluZyBlcnJvcnMuIElmIHdlJ3JlIHRvbyBzdHJpY3QsIGl0IG1pZ2h0IHNuYXAgZm9yd2FyZCwgdGhlbiBpbW1lZGlhdGVseSBhZ2FpbiwgYW5kIGFnYWluLlxuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYVtpXSA+PSB2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiBhW2ldO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhW2kgLSAxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgaSA9IGEubGVuZ3RoO1xuICAgICAgdmFsdWUgKz0gdGhyZXNob2xkO1xuXG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGlmIChhW2ldIDw9IHZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIGFbaV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYVswXTtcbiAgfSA6IGZ1bmN0aW9uICh2YWx1ZSwgZGlyZWN0aW9uLCB0aHJlc2hvbGQpIHtcbiAgICBpZiAodGhyZXNob2xkID09PSB2b2lkIDApIHtcbiAgICAgIHRocmVzaG9sZCA9IDFlLTM7XG4gICAgfVxuXG4gICAgdmFyIHNuYXBwZWQgPSBzbmFwKHZhbHVlKTtcbiAgICByZXR1cm4gIWRpcmVjdGlvbiB8fCBNYXRoLmFicyhzbmFwcGVkIC0gdmFsdWUpIDwgdGhyZXNob2xkIHx8IHNuYXBwZWQgLSB2YWx1ZSA8IDAgPT09IGRpcmVjdGlvbiA8IDAgPyBzbmFwcGVkIDogc25hcChkaXJlY3Rpb24gPCAwID8gdmFsdWUgLSBzbmFwSW5jcmVtZW50T3JBcnJheSA6IHZhbHVlICsgc25hcEluY3JlbWVudE9yQXJyYXkpO1xuICB9O1xufSxcbiAgICBfZ2V0TGFiZWxBdERpcmVjdGlvbiA9IGZ1bmN0aW9uIF9nZXRMYWJlbEF0RGlyZWN0aW9uKHRpbWVsaW5lKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodmFsdWUsIHN0KSB7XG4gICAgcmV0dXJuIF9zbmFwRGlyZWN0aW9uYWwoX2dldExhYmVsUmF0aW9BcnJheSh0aW1lbGluZSkpKHZhbHVlLCBzdC5kaXJlY3Rpb24pO1xuICB9O1xufSxcbiAgICBfbXVsdGlMaXN0ZW5lciA9IGZ1bmN0aW9uIF9tdWx0aUxpc3RlbmVyKGZ1bmMsIGVsZW1lbnQsIHR5cGVzLCBjYWxsYmFjaykge1xuICByZXR1cm4gdHlwZXMuc3BsaXQoXCIsXCIpLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcbiAgICByZXR1cm4gZnVuYyhlbGVtZW50LCB0eXBlLCBjYWxsYmFjayk7XG4gIH0pO1xufSxcbiAgICBfYWRkTGlzdGVuZXIgPSBmdW5jdGlvbiBfYWRkTGlzdGVuZXIoZWxlbWVudCwgdHlwZSwgZnVuYywgbm9uUGFzc2l2ZSwgY2FwdHVyZSkge1xuICByZXR1cm4gZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGZ1bmMsIHtcbiAgICBwYXNzaXZlOiAhbm9uUGFzc2l2ZSxcbiAgICBjYXB0dXJlOiAhIWNhcHR1cmVcbiAgfSk7XG59LFxuICAgIF9yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIF9yZW1vdmVMaXN0ZW5lcihlbGVtZW50LCB0eXBlLCBmdW5jLCBjYXB0dXJlKSB7XG4gIHJldHVybiBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgZnVuYywgISFjYXB0dXJlKTtcbn0sXG4gICAgX3doZWVsTGlzdGVuZXIgPSBmdW5jdGlvbiBfd2hlZWxMaXN0ZW5lcihmdW5jLCBlbCwgc2Nyb2xsRnVuYykge1xuICBzY3JvbGxGdW5jID0gc2Nyb2xsRnVuYyAmJiBzY3JvbGxGdW5jLndoZWVsSGFuZGxlcjtcblxuICBpZiAoc2Nyb2xsRnVuYykge1xuICAgIGZ1bmMoZWwsIFwid2hlZWxcIiwgc2Nyb2xsRnVuYyk7XG4gICAgZnVuYyhlbCwgXCJ0b3VjaG1vdmVcIiwgc2Nyb2xsRnVuYyk7XG4gIH1cbn0sXG4gICAgX21hcmtlckRlZmF1bHRzID0ge1xuICBzdGFydENvbG9yOiBcImdyZWVuXCIsXG4gIGVuZENvbG9yOiBcInJlZFwiLFxuICBpbmRlbnQ6IDAsXG4gIGZvbnRTaXplOiBcIjE2cHhcIixcbiAgZm9udFdlaWdodDogXCJub3JtYWxcIlxufSxcbiAgICBfZGVmYXVsdHMgPSB7XG4gIHRvZ2dsZUFjdGlvbnM6IFwicGxheVwiLFxuICBhbnRpY2lwYXRlUGluOiAwXG59LFxuICAgIF9rZXl3b3JkcyA9IHtcbiAgdG9wOiAwLFxuICBsZWZ0OiAwLFxuICBjZW50ZXI6IDAuNSxcbiAgYm90dG9tOiAxLFxuICByaWdodDogMVxufSxcbiAgICBfb2Zmc2V0VG9QeCA9IGZ1bmN0aW9uIF9vZmZzZXRUb1B4KHZhbHVlLCBzaXplKSB7XG4gIGlmIChfaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIGVxSW5kZXggPSB2YWx1ZS5pbmRleE9mKFwiPVwiKSxcbiAgICAgICAgcmVsYXRpdmUgPSB+ZXFJbmRleCA/ICsodmFsdWUuY2hhckF0KGVxSW5kZXggLSAxKSArIDEpICogcGFyc2VGbG9hdCh2YWx1ZS5zdWJzdHIoZXFJbmRleCArIDEpKSA6IDA7XG5cbiAgICBpZiAofmVxSW5kZXgpIHtcbiAgICAgIHZhbHVlLmluZGV4T2YoXCIlXCIpID4gZXFJbmRleCAmJiAocmVsYXRpdmUgKj0gc2l6ZSAvIDEwMCk7XG4gICAgICB2YWx1ZSA9IHZhbHVlLnN1YnN0cigwLCBlcUluZGV4IC0gMSk7XG4gICAgfVxuXG4gICAgdmFsdWUgPSByZWxhdGl2ZSArICh2YWx1ZSBpbiBfa2V5d29yZHMgPyBfa2V5d29yZHNbdmFsdWVdICogc2l6ZSA6IH52YWx1ZS5pbmRleE9mKFwiJVwiKSA/IHBhcnNlRmxvYXQodmFsdWUpICogc2l6ZSAvIDEwMCA6IHBhcnNlRmxvYXQodmFsdWUpIHx8IDApO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufSxcbiAgICBfY3JlYXRlTWFya2VyID0gZnVuY3Rpb24gX2NyZWF0ZU1hcmtlcih0eXBlLCBuYW1lLCBjb250YWluZXIsIGRpcmVjdGlvbiwgX3JlZjQsIG9mZnNldCwgbWF0Y2hXaWR0aEVsLCBjb250YWluZXJBbmltYXRpb24pIHtcbiAgdmFyIHN0YXJ0Q29sb3IgPSBfcmVmNC5zdGFydENvbG9yLFxuICAgICAgZW5kQ29sb3IgPSBfcmVmNC5lbmRDb2xvcixcbiAgICAgIGZvbnRTaXplID0gX3JlZjQuZm9udFNpemUsXG4gICAgICBpbmRlbnQgPSBfcmVmNC5pbmRlbnQsXG4gICAgICBmb250V2VpZ2h0ID0gX3JlZjQuZm9udFdlaWdodDtcblxuICB2YXIgZSA9IF9kb2MuY3JlYXRlRWxlbWVudChcImRpdlwiKSxcbiAgICAgIHVzZUZpeGVkUG9zaXRpb24gPSBfaXNWaWV3cG9ydChjb250YWluZXIpIHx8IF9nZXRQcm94eVByb3AoY29udGFpbmVyLCBcInBpblR5cGVcIikgPT09IFwiZml4ZWRcIixcbiAgICAgIGlzU2Nyb2xsZXIgPSB0eXBlLmluZGV4T2YoXCJzY3JvbGxlclwiKSAhPT0gLTEsXG4gICAgICBwYXJlbnQgPSB1c2VGaXhlZFBvc2l0aW9uID8gX2JvZHkgOiBjb250YWluZXIudGFnTmFtZSA9PT0gXCJJRlJBTUVcIiA/IGNvbnRhaW5lci5jb250ZW50RG9jdW1lbnQuYm9keSA6IGNvbnRhaW5lcixcbiAgICAgIGlzU3RhcnQgPSB0eXBlLmluZGV4T2YoXCJzdGFydFwiKSAhPT0gLTEsXG4gICAgICBjb2xvciA9IGlzU3RhcnQgPyBzdGFydENvbG9yIDogZW5kQ29sb3IsXG4gICAgICBjc3MgPSBcImJvcmRlci1jb2xvcjpcIiArIGNvbG9yICsgXCI7Zm9udC1zaXplOlwiICsgZm9udFNpemUgKyBcIjtjb2xvcjpcIiArIGNvbG9yICsgXCI7Zm9udC13ZWlnaHQ6XCIgKyBmb250V2VpZ2h0ICsgXCI7cG9pbnRlci1ldmVudHM6bm9uZTt3aGl0ZS1zcGFjZTpub3dyYXA7Zm9udC1mYW1pbHk6c2Fucy1zZXJpZixBcmlhbDt6LWluZGV4OjEwMDA7cGFkZGluZzo0cHggOHB4O2JvcmRlci13aWR0aDowO2JvcmRlci1zdHlsZTpzb2xpZDtcIjtcblxuICBjc3MgKz0gXCJwb3NpdGlvbjpcIiArICgoaXNTY3JvbGxlciB8fCBjb250YWluZXJBbmltYXRpb24pICYmIHVzZUZpeGVkUG9zaXRpb24gPyBcImZpeGVkO1wiIDogXCJhYnNvbHV0ZTtcIik7XG4gIChpc1Njcm9sbGVyIHx8IGNvbnRhaW5lckFuaW1hdGlvbiB8fCAhdXNlRml4ZWRQb3NpdGlvbikgJiYgKGNzcyArPSAoZGlyZWN0aW9uID09PSBfdmVydGljYWwgPyBfcmlnaHQgOiBfYm90dG9tKSArIFwiOlwiICsgKG9mZnNldCArIHBhcnNlRmxvYXQoaW5kZW50KSkgKyBcInB4O1wiKTtcbiAgbWF0Y2hXaWR0aEVsICYmIChjc3MgKz0gXCJib3gtc2l6aW5nOmJvcmRlci1ib3g7dGV4dC1hbGlnbjpsZWZ0O3dpZHRoOlwiICsgbWF0Y2hXaWR0aEVsLm9mZnNldFdpZHRoICsgXCJweDtcIik7XG4gIGUuX2lzU3RhcnQgPSBpc1N0YXJ0O1xuICBlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiZ3NhcC1tYXJrZXItXCIgKyB0eXBlICsgKG5hbWUgPyBcIiBtYXJrZXItXCIgKyBuYW1lIDogXCJcIikpO1xuICBlLnN0eWxlLmNzc1RleHQgPSBjc3M7XG4gIGUuaW5uZXJUZXh0ID0gbmFtZSB8fCBuYW1lID09PSAwID8gdHlwZSArIFwiLVwiICsgbmFtZSA6IHR5cGU7XG4gIHBhcmVudC5jaGlsZHJlblswXSA/IHBhcmVudC5pbnNlcnRCZWZvcmUoZSwgcGFyZW50LmNoaWxkcmVuWzBdKSA6IHBhcmVudC5hcHBlbmRDaGlsZChlKTtcbiAgZS5fb2Zmc2V0ID0gZVtcIm9mZnNldFwiICsgZGlyZWN0aW9uLm9wLmQyXTtcblxuICBfcG9zaXRpb25NYXJrZXIoZSwgMCwgZGlyZWN0aW9uLCBpc1N0YXJ0KTtcblxuICByZXR1cm4gZTtcbn0sXG4gICAgX3Bvc2l0aW9uTWFya2VyID0gZnVuY3Rpb24gX3Bvc2l0aW9uTWFya2VyKG1hcmtlciwgc3RhcnQsIGRpcmVjdGlvbiwgZmxpcHBlZCkge1xuICB2YXIgdmFycyA9IHtcbiAgICBkaXNwbGF5OiBcImJsb2NrXCJcbiAgfSxcbiAgICAgIHNpZGUgPSBkaXJlY3Rpb25bZmxpcHBlZCA/IFwib3MyXCIgOiBcInAyXCJdLFxuICAgICAgb3Bwb3NpdGVTaWRlID0gZGlyZWN0aW9uW2ZsaXBwZWQgPyBcInAyXCIgOiBcIm9zMlwiXTtcbiAgbWFya2VyLl9pc0ZsaXBwZWQgPSBmbGlwcGVkO1xuICB2YXJzW2RpcmVjdGlvbi5hICsgXCJQZXJjZW50XCJdID0gZmxpcHBlZCA/IC0xMDAgOiAwO1xuICB2YXJzW2RpcmVjdGlvbi5hXSA9IGZsaXBwZWQgPyBcIjFweFwiIDogMDtcbiAgdmFyc1tcImJvcmRlclwiICsgc2lkZSArIF9XaWR0aF0gPSAxO1xuICB2YXJzW1wiYm9yZGVyXCIgKyBvcHBvc2l0ZVNpZGUgKyBfV2lkdGhdID0gMDtcbiAgdmFyc1tkaXJlY3Rpb24ucF0gPSBzdGFydCArIFwicHhcIjtcbiAgZ3NhcC5zZXQobWFya2VyLCB2YXJzKTtcbn0sXG4gICAgX3RyaWdnZXJzID0gW10sXG4gICAgX2lkcyA9IHt9LFxuICAgIF9yYWZJRCxcbiAgICBfc3luYyA9IGZ1bmN0aW9uIF9zeW5jKCkge1xuICByZXR1cm4gX2dldFRpbWUoKSAtIF9sYXN0U2Nyb2xsVGltZSA+IDM0ICYmIChfcmFmSUQgfHwgKF9yYWZJRCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShfdXBkYXRlQWxsKSkpO1xufSxcbiAgICBfb25TY3JvbGwgPSBmdW5jdGlvbiBfb25TY3JvbGwoKSB7XG4gIC8vIHByZXZpb3VzbHksIHdlIHRyaWVkIHRvIG9wdGltaXplIHBlcmZvcm1hbmNlIGJ5IGJhdGNoaW5nL2RlZmVycmluZyB0byB0aGUgbmV4dCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKSwgYnV0IGRpc2NvdmVyZWQgdGhhdCBTYWZhcmkgaGFzIGEgZmV3IGJ1Z3MgdGhhdCBtYWtlIHRoaXMgdW53b3JrYWJsZSAoZXNwZWNpYWxseSBvbiBpT1MpLiBTZWUgaHR0cHM6Ly9jb2RlcGVuLmlvL0dyZWVuU29jay9wZW4vMTZjNDM1YjEyZWYwOWMzODEyNTIwNDgxOGU3YjQ1ZmM/ZWRpdG9ycz0wMDEwIGFuZCBodHRwczovL2NvZGVwZW4uaW8vR3JlZW5Tb2NrL3Blbi9Kak94WXBRLzNkZDY1Y2NlYzVhNjBmMWQ4NjJjMzU1ZDg0ZDE0NTYyP2VkaXRvcnM9MDAxMCBhbmQgaHR0cHM6Ly9jb2RlcGVuLmlvL0dyZWVuU29jay9wZW4vRXhiclBOYS8wODdjZWYxOTdkYzM1NDQ1YTA5NTFlODkzNWM0MTUwMz9lZGl0b3JzPTAwMTBcbiAgaWYgKCFfbm9ybWFsaXplciB8fCAhX25vcm1hbGl6ZXIuaXNQcmVzc2VkIHx8IF9ub3JtYWxpemVyLnN0YXJ0WCA+IF9ib2R5LmNsaWVudFdpZHRoKSB7XG4gICAgLy8gaWYgdGhlIHVzZXIgaXMgZHJhZ2dpbmcgdGhlIHNjcm9sbGJhciwgYWxsb3cgaXQuXG4gICAgX3Njcm9sbGVycy5jYWNoZSsrO1xuXG4gICAgaWYgKF9ub3JtYWxpemVyKSB7XG4gICAgICBfcmFmSUQgfHwgKF9yYWZJRCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShfdXBkYXRlQWxsKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF91cGRhdGVBbGwoKTsgLy8gU2FmYXJpIGluIHBhcnRpY3VsYXIgKG9uIGRlc2t0b3ApIE5FRURTIHRoZSBpbW1lZGlhdGUgdXBkYXRlIHJhdGhlciB0aGFuIHdhaXRpbmcgZm9yIGEgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCkgd2hlcmVhcyBpT1Mgc2VlbXMgdG8gYmVuZWZpdCBmcm9tIHdhaXRpbmcgZm9yIHRoZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKSB0aWNrLCBhdCBsZWFzdCB3aGVuIG5vcm1hbGl6aW5nLiBTZWUgaHR0cHM6Ly9jb2RlcGVuLmlvL0dyZWVuU29jay9wZW4vcUJZb3pxTz9lZGl0b3JzPTAxMTBcblxuICAgIH1cblxuICAgIF9sYXN0U2Nyb2xsVGltZSB8fCBfZGlzcGF0Y2goXCJzY3JvbGxTdGFydFwiKTtcbiAgICBfbGFzdFNjcm9sbFRpbWUgPSBfZ2V0VGltZSgpO1xuICB9XG59LFxuICAgIF9zZXRCYXNlRGltZW5zaW9ucyA9IGZ1bmN0aW9uIF9zZXRCYXNlRGltZW5zaW9ucygpIHtcbiAgX2Jhc2VTY3JlZW5XaWR0aCA9IF93aW4uaW5uZXJXaWR0aDtcbiAgX2Jhc2VTY3JlZW5IZWlnaHQgPSBfd2luLmlubmVySGVpZ2h0O1xufSxcbiAgICBfb25SZXNpemUgPSBmdW5jdGlvbiBfb25SZXNpemUoZm9yY2UpIHtcbiAgX3Njcm9sbGVycy5jYWNoZSsrO1xuICAoZm9yY2UgPT09IHRydWUgfHwgIV9yZWZyZXNoaW5nICYmICFfaWdub3JlUmVzaXplICYmICFfZG9jLmZ1bGxzY3JlZW5FbGVtZW50ICYmICFfZG9jLndlYmtpdEZ1bGxzY3JlZW5FbGVtZW50ICYmICghX2lnbm9yZU1vYmlsZVJlc2l6ZSB8fCBfYmFzZVNjcmVlbldpZHRoICE9PSBfd2luLmlubmVyV2lkdGggfHwgTWF0aC5hYnMoX3dpbi5pbm5lckhlaWdodCAtIF9iYXNlU2NyZWVuSGVpZ2h0KSA+IF93aW4uaW5uZXJIZWlnaHQgKiAwLjI1KSkgJiYgX3Jlc2l6ZURlbGF5LnJlc3RhcnQodHJ1ZSk7XG59LFxuICAgIC8vIGlnbm9yZSByZXNpemVzIHRyaWdnZXJlZCBieSByZWZyZXNoKClcbl9saXN0ZW5lcnMgPSB7fSxcbiAgICBfZW1wdHlBcnJheSA9IFtdLFxuICAgIF9zb2Z0UmVmcmVzaCA9IGZ1bmN0aW9uIF9zb2Z0UmVmcmVzaCgpIHtcbiAgcmV0dXJuIF9yZW1vdmVMaXN0ZW5lcihTY3JvbGxUcmlnZ2VyLCBcInNjcm9sbEVuZFwiLCBfc29mdFJlZnJlc2gpIHx8IF9yZWZyZXNoQWxsKHRydWUpO1xufSxcbiAgICBfZGlzcGF0Y2ggPSBmdW5jdGlvbiBfZGlzcGF0Y2godHlwZSkge1xuICByZXR1cm4gX2xpc3RlbmVyc1t0eXBlXSAmJiBfbGlzdGVuZXJzW3R5cGVdLm1hcChmdW5jdGlvbiAoZikge1xuICAgIHJldHVybiBmKCk7XG4gIH0pIHx8IF9lbXB0eUFycmF5O1xufSxcbiAgICBfc2F2ZWRTdHlsZXMgPSBbXSxcbiAgICAvLyB3aGVuIFNjcm9sbFRyaWdnZXIuc2F2ZVN0eWxlcygpIGlzIGNhbGxlZCwgdGhlIGlubGluZSBzdHlsZXMgYXJlIHJlY29yZGVkIGluIHRoaXMgQXJyYXkgaW4gYSBzZXF1ZW50aWFsIGZvcm1hdCBsaWtlIFtlbGVtZW50LCBjc3NUZXh0LCBnc0NhY2hlLCBtZWRpYV0uIFRoaXMga2VlcHMgaXQgdmVyeSBtZW1vcnktZWZmaWNpZW50IGFuZCBmYXN0IHRvIGl0ZXJhdGUgdGhyb3VnaC5cbl9yZXZlcnRSZWNvcmRlZCA9IGZ1bmN0aW9uIF9yZXZlcnRSZWNvcmRlZChtZWRpYSkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IF9zYXZlZFN0eWxlcy5sZW5ndGg7IGkgKz0gNSkge1xuICAgIGlmICghbWVkaWEgfHwgX3NhdmVkU3R5bGVzW2kgKyA0XSAmJiBfc2F2ZWRTdHlsZXNbaSArIDRdLnF1ZXJ5ID09PSBtZWRpYSkge1xuICAgICAgX3NhdmVkU3R5bGVzW2ldLnN0eWxlLmNzc1RleHQgPSBfc2F2ZWRTdHlsZXNbaSArIDFdO1xuICAgICAgX3NhdmVkU3R5bGVzW2ldLmdldEJCb3ggJiYgX3NhdmVkU3R5bGVzW2ldLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBfc2F2ZWRTdHlsZXNbaSArIDJdIHx8IFwiXCIpO1xuICAgICAgX3NhdmVkU3R5bGVzW2kgKyAzXS51bmNhY2hlID0gMTtcbiAgICB9XG4gIH1cbn0sXG4gICAgX3JlY29yZFNjcm9sbFBvc2l0aW9ucyA9IGZ1bmN0aW9uIF9yZWNvcmRTY3JvbGxQb3NpdGlvbnMoKSB7XG4gIC8vIHJlY29yZCB0aGUgY3VycmVudCBzY3JvbGwgcG9zaXRpb24uIEZvcmNlIGEgZnJlc2ggcmVhZCBieSBidW1waW5nIHRoZSBzaGFyZWQgY2FjaGUgKG5vdCBlYWNoIGNhY2hlSUQg4oCUIGFmdGVyIGV4YWN0bHkgb25lIHNjcm9sbCBldmVudCwgKytjYWNoZUlEIGNhbiBtYWtlIGNhY2hlSUQgPT09IGNhY2hlIGFuZCByZXR1cm4gYSBzdGFsZSB2YWx1ZSkuIEFsc28gc29tZSBicm93c2VycyB0YWtlIGEgbGl0dGxlIHdoaWxlIHRvIGRpc3BhdGNoIHRoZSBcInNjcm9sbFwiIGV2ZW50IGFuZCB0aGUgdXNlciBtYXkgaGF2ZSBjaGFuZ2VkIHRoZSBzY3JvbGwgcG9zaXRpb24gYW5kIHRoZW4gY2FsbGVkIFNjcm9sbFRyaWdnZXIucmVmcmVzaCgpIHJpZ2h0IGF3YXlcbiAgX3Njcm9sbGVycy5jYWNoZSsrO1xuXG4gIF9zY3JvbGxlcnMuZm9yRWFjaChmdW5jdGlvbiAob2JqKSB7XG4gICAgcmV0dXJuIF9pc0Z1bmN0aW9uKG9iaikgJiYgKG9iai5yZWMgPSBvYmooKSk7XG4gIH0pO1xufSxcbiAgICBfcmV2ZXJ0QWxsID0gZnVuY3Rpb24gX3JldmVydEFsbChraWxsLCBtZWRpYSkge1xuICB2YXIgdHJpZ2dlcjtcblxuICBmb3IgKF9pID0gMDsgX2kgPCBfdHJpZ2dlcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgdHJpZ2dlciA9IF90cmlnZ2Vyc1tfaV07XG5cbiAgICBpZiAodHJpZ2dlciAmJiAoIW1lZGlhIHx8IHRyaWdnZXIuX2N0eCA9PT0gbWVkaWEpKSB7XG4gICAgICBpZiAoa2lsbCkge1xuICAgICAgICB0cmlnZ2VyLmtpbGwoMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cmlnZ2VyLnJldmVydCh0cnVlLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfaXNSZXZlcnRlZCA9IHRydWU7XG4gIG1lZGlhICYmIF9yZXZlcnRSZWNvcmRlZChtZWRpYSk7XG4gIG1lZGlhIHx8IF9kaXNwYXRjaChcInJldmVydFwiKTtcbn0sXG4gICAgX2NsZWFyU2Nyb2xsTWVtb3J5ID0gZnVuY3Rpb24gX2NsZWFyU2Nyb2xsTWVtb3J5KHNjcm9sbFJlc3RvcmF0aW9uLCBmb3JjZSkge1xuICAvLyB6ZXJvLW91dCBhbGwgdGhlIHJlY29yZGVkIHNjcm9sbCBwb3NpdGlvbnMuIERvbid0IHVzZSBfdHJpZ2dlcnMgYmVjYXVzZSBpZiwgZm9yIGV4YW1wbGUsIC5tYXRjaE1lZGlhKCkgaXMgdXNlZCB0byBjcmVhdGUgc29tZSBTY3JvbGxUcmlnZ2VycyBhbmQgdGhlbiB0aGUgdXNlciByZXNpemVzIGFuZCBpdCByZW1vdmVzIEFMTCBTY3JvbGxUcmlnZ2VycywgYW5kIHRoZW4gZ28gYmFjayB0byBhIHNpemUgd2hlcmUgdGhlcmUgYXJlIFNjcm9sbFRyaWdnZXJzLCBpdCB3b3VsZCBoYXZlIGtlcHQgdGhlIHBvc2l0aW9uKHMpIHNhdmVkIGZyb20gdGhlIGluaXRpYWwgc3RhdGUuXG4gIF9zY3JvbGxlcnMuY2FjaGUrKztcbiAgKGZvcmNlIHx8ICFfcmVmcmVzaGluZ0FsbCkgJiYgX3Njcm9sbGVycy5mb3JFYWNoKGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gX2lzRnVuY3Rpb24ob2JqKSAmJiBvYmouY2FjaGVJRCsrICYmIChvYmoucmVjID0gMCk7XG4gIH0pO1xuXG4gIGlmIChfaXNTdHJpbmcoc2Nyb2xsUmVzdG9yYXRpb24pKSB7XG4gICAgX3Njcm9sbFJlc3RvcmF0aW9uID0gc2Nyb2xsUmVzdG9yYXRpb247XG4gICAgX3dpbi5oaXN0b3J5LnNjcm9sbFJlc3RvcmF0aW9uICE9PSBzY3JvbGxSZXN0b3JhdGlvbiAmJiAoX3dpbi5oaXN0b3J5LnNjcm9sbFJlc3RvcmF0aW9uID0gc2Nyb2xsUmVzdG9yYXRpb24pO1xuICB9XG59LFxuICAgIF9yZWZyZXNoaW5nQWxsLFxuICAgIF9yZWZyZXNoSUQgPSAwLFxuICAgIF9xdWV1ZVJlZnJlc2hJRCxcbiAgICBfcXVldWVSZWZyZXNoQWxsID0gZnVuY3Rpb24gX3F1ZXVlUmVmcmVzaEFsbCgpIHtcbiAgLy8gd2UgZG9uJ3Qgd2FudCB0byBjYWxsIF9yZWZyZXNoQWxsKCkgZXZlcnkgdGltZSB3ZSBjcmVhdGUgYSBuZXcgU2Nyb2xsVHJpZ2dlciAoZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMpIC0gaXQncyBiZXR0ZXIgdG8gYmF0Y2ggdGhlbS4gU29tZSBmcmFtZXdvcmtzIGR5bmFtaWNhbGx5IGxvYWQgY29udGVudCBhbmQgd2UgY2FuJ3QgcmVseSBvbiB0aGUgd2luZG93J3MgXCJsb2FkXCIgb3IgXCJET01Db250ZW50TG9hZGVkXCIgZXZlbnRzIHRvIHRyaWdnZXIgaXQuXG4gIGlmIChfcXVldWVSZWZyZXNoSUQgIT09IF9yZWZyZXNoSUQpIHtcbiAgICB2YXIgaWQgPSBfcXVldWVSZWZyZXNoSUQgPSBfcmVmcmVzaElEO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gaWQgPT09IF9yZWZyZXNoSUQgJiYgX3JlZnJlc2hBbGwodHJ1ZSk7XG4gICAgfSk7XG4gIH1cbn0sXG4gICAgX3JlZnJlc2gxMDB2aCA9IGZ1bmN0aW9uIF9yZWZyZXNoMTAwdmgoKSB7XG4gIF9ib2R5LmFwcGVuZENoaWxkKF9kaXYxMDB2aCk7XG5cbiAgXzEwMHZoID0gIV9ub3JtYWxpemVyICYmIF9kaXYxMDB2aC5vZmZzZXRIZWlnaHQgfHwgX3dpbi5pbm5lckhlaWdodDtcblxuICBfYm9keS5yZW1vdmVDaGlsZChfZGl2MTAwdmgpO1xufSxcbiAgICBfaGlkZUFsbE1hcmtlcnMgPSBmdW5jdGlvbiBfaGlkZUFsbE1hcmtlcnMoaGlkZSkge1xuICByZXR1cm4gX3RvQXJyYXkoXCIuZ3NhcC1tYXJrZXItc3RhcnQsIC5nc2FwLW1hcmtlci1lbmQsIC5nc2FwLW1hcmtlci1zY3JvbGxlci1zdGFydCwgLmdzYXAtbWFya2VyLXNjcm9sbGVyLWVuZFwiKS5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgIHJldHVybiBlbC5zdHlsZS5kaXNwbGF5ID0gaGlkZSA/IFwibm9uZVwiIDogXCJibG9ja1wiO1xuICB9KTtcbn0sXG4gICAgX3JlZnJlc2hBbGwgPSBmdW5jdGlvbiBfcmVmcmVzaEFsbChmb3JjZSwgc2tpcFJldmVydCkge1xuICBfZG9jRWwgPSBfZG9jLmRvY3VtZW50RWxlbWVudDsgLy8gc29tZSBmcmFtZXdvcmtzIGxpa2UgQXN0cm8gbWF5IGNhY2hlIHRoZSA8Ym9keT4gYW5kIHJlcGxhY2UgaXQgZHVyaW5nIHJvdXRpbmcsIHNvIHdlJ2xsIGp1c3QgcmUtcmVjb3JkIHRoZSBfZG9jRWwgYW5kIF9ib2R5IGZvciBzYWZldHkgKG90aGVyd2lzZSwgdGhlIG1hcmtlcnMgbWF5IG5vdCBnZXQgYWRkZWQgcHJvcGVybHkpLlxuXG4gIF9ib2R5ID0gX2RvYy5ib2R5O1xuICBfcm9vdCA9IFtfd2luLCBfZG9jLCBfZG9jRWwsIF9ib2R5XTtcblxuICBpZiAoX2xhc3RTY3JvbGxUaW1lICYmICFmb3JjZSAmJiAhX2lzUmV2ZXJ0ZWQpIHtcbiAgICBfYWRkTGlzdGVuZXIoU2Nyb2xsVHJpZ2dlciwgXCJzY3JvbGxFbmRcIiwgX3NvZnRSZWZyZXNoKTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIF9yZWZyZXNoMTAwdmgoKTtcblxuICBfcmVmcmVzaGluZ0FsbCA9IFNjcm9sbFRyaWdnZXIuaXNSZWZyZXNoaW5nID0gdHJ1ZTtcbiAgX2lzUmV2ZXJ0ZWQgfHwgX3JlY29yZFNjcm9sbFBvc2l0aW9ucygpO1xuXG4gIHZhciByZWZyZXNoSW5pdHMgPSBfZGlzcGF0Y2goXCJyZWZyZXNoSW5pdFwiKTtcblxuICBfc29ydCAmJiBTY3JvbGxUcmlnZ2VyLnNvcnQoKTtcbiAgc2tpcFJldmVydCB8fCBfcmV2ZXJ0QWxsKCk7XG5cbiAgX3Njcm9sbGVycy5mb3JFYWNoKGZ1bmN0aW9uIChvYmopIHtcbiAgICBpZiAoX2lzRnVuY3Rpb24ob2JqKSkge1xuICAgICAgb2JqLnNtb290aCAmJiAob2JqLnRhcmdldC5zdHlsZS5zY3JvbGxCZWhhdmlvciA9IFwiYXV0b1wiKTsgLy8gc21vb3RoIHNjcm9sbGluZyBpbnRlcmZlcmVzXG5cbiAgICAgIG9iaigwKTtcbiAgICB9XG4gIH0pO1xuXG4gIF90cmlnZ2Vycy5zbGljZSgwKS5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgcmV0dXJuIHQucmVmcmVzaCgpO1xuICB9KTsgLy8gZG9uJ3QgbG9vcCB3aXRoIF9pIGJlY2F1c2UgZHVyaW5nIGEgcmVmcmVzaCgpIHNvbWVvbmUgY291bGQgY2FsbCBTY3JvbGxUcmlnZ2VyLnVwZGF0ZSgpIHdoaWNoIHdvdWxkIGl0ZXJhdGUgdGhyb3VnaCBfaSByZXN1bHRpbmcgaW4gYSBza2lwLlxuXG5cbiAgX2lzUmV2ZXJ0ZWQgPSBmYWxzZTtcblxuICBfdHJpZ2dlcnMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgIC8vIG5lc3RlZCBwaW5zIChwaW5uZWRDb250YWluZXIpIHdpdGggcGluU3BhY2luZyBtYXkgZXhwYW5kIHRoZSBjb250YWluZXIsIHNvIHdlIG11c3QgYWNjb21tb2RhdGUgdGhhdCBoZXJlLlxuICAgIGlmICh0Ll9zdWJQaW5PZmZzZXQgJiYgdC5waW4pIHtcbiAgICAgIHZhciBwcm9wID0gdC52YXJzLmhvcml6b250YWwgPyBcIm9mZnNldFdpZHRoXCIgOiBcIm9mZnNldEhlaWdodFwiLFxuICAgICAgICAgIG9yaWdpbmFsID0gdC5waW5bcHJvcF07XG4gICAgICB0LnJldmVydCh0cnVlLCAxKTtcbiAgICAgIHQuYWRqdXN0UGluU3BhY2luZyh0LnBpbltwcm9wXSAtIG9yaWdpbmFsKTtcbiAgICAgIHQucmVmcmVzaCgpO1xuICAgIH1cbiAgfSk7XG5cbiAgX2NsYW1waW5nTWF4ID0gMTsgLy8gcGluU3BhY2luZyBtaWdodCBiZSBwcm9wcGluZyBhIHBhZ2Ugb3BlbiwgdGh1cyB3aGVuIHdlIC5zZXRQb3NpdGlvbnMoKSB0byBjbGFtcCBhIFNjcm9sbFRyaWdnZXIncyBlbmQgd2Ugc2hvdWxkIGxlYXZlIHRoZSBwaW5TcGFjaW5nIGFsb25lLiBUaGF0J3Mgd2hhdCB0aGlzIGZsYWcgaXMgZm9yLlxuXG4gIF9oaWRlQWxsTWFya2Vycyh0cnVlKTtcblxuICBfdHJpZ2dlcnMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgIC8vIHRoZSBzY3JvbGxlcidzIG1heCBzY3JvbGwgcG9zaXRpb24gbWF5IGNoYW5nZSBhZnRlciBhbGwgdGhlIFNjcm9sbFRyaWdnZXJzIHJlZnJlc2hlZCAobGlrZSBwaW5uaW5nIGNvdWxkIHB1c2ggaXQgZG93biksIHNvIHdlIG5lZWQgdG8gbG9vcCBiYWNrIGFuZCBjb3JyZWN0IGFueSB3aXRoIGVuZDogXCJtYXhcIi4gU2FtZSBmb3IgYW55dGhpbmcgd2l0aCBhIGNsYW1wZWQgZW5kXG4gICAgdmFyIG1heCA9IF9tYXhTY3JvbGwodC5zY3JvbGxlciwgdC5fZGlyKSxcbiAgICAgICAgZW5kQ2xhbXAgPSB0LnZhcnMuZW5kID09PSBcIm1heFwiIHx8IHQuX2VuZENsYW1wICYmIHQuZW5kID4gbWF4LFxuICAgICAgICBzdGFydENsYW1wID0gdC5fc3RhcnRDbGFtcCAmJiB0LnN0YXJ0ID49IG1heDtcblxuICAgIChlbmRDbGFtcCB8fCBzdGFydENsYW1wKSAmJiB0LnNldFBvc2l0aW9ucyhzdGFydENsYW1wID8gbWF4IC0gMSA6IHQuc3RhcnQsIGVuZENsYW1wID8gTWF0aC5tYXgoc3RhcnRDbGFtcCA/IG1heCA6IHQuc3RhcnQgKyAxLCBtYXgpIDogdC5lbmQsIHRydWUpO1xuICB9KTtcblxuICBfaGlkZUFsbE1hcmtlcnMoZmFsc2UpO1xuXG4gIF9jbGFtcGluZ01heCA9IDA7XG4gIHJlZnJlc2hJbml0cy5mb3JFYWNoKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICByZXR1cm4gcmVzdWx0ICYmIHJlc3VsdC5yZW5kZXIgJiYgcmVzdWx0LnJlbmRlcigtMSk7XG4gIH0pOyAvLyBpZiB0aGUgb25SZWZyZXNoSW5pdCgpIHJldHVybnMgYW4gYW5pbWF0aW9uICh0eXBpY2FsbHkgYSBnc2FwLnNldCgpKSwgcmV2ZXJ0IGl0LiBUaGlzIG1ha2VzIGl0IGVhc3kgdG8gcHV0IHRoaW5ncyBpbiBhIGNlcnRhaW4gc3BvdCBiZWZvcmUgcmVmcmVzaGluZyBmb3IgbWVhc3VyZW1lbnQgcHVycG9zZXMsIGFuZCB0aGVuIHB1dCB0aGluZ3MgYmFjay5cblxuICBfc2Nyb2xsZXJzLmZvckVhY2goZnVuY3Rpb24gKG9iaikge1xuICAgIGlmIChfaXNGdW5jdGlvbihvYmopKSB7XG4gICAgICBvYmouc21vb3RoICYmIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBvYmoudGFyZ2V0LnN0eWxlLnNjcm9sbEJlaGF2aW9yID0gXCJzbW9vdGhcIjtcbiAgICAgIH0pO1xuICAgICAgb2JqLnJlYyAmJiBvYmoob2JqLnJlYyk7XG4gICAgfVxuICB9KTtcblxuICBfY2xlYXJTY3JvbGxNZW1vcnkoX3Njcm9sbFJlc3RvcmF0aW9uLCAxKTtcblxuICBfcmVzaXplRGVsYXkucGF1c2UoKTtcblxuICBfcmVmcmVzaElEKys7XG4gIF9yZWZyZXNoaW5nQWxsID0gMjtcblxuICBfdXBkYXRlQWxsKDIpO1xuXG4gIF90cmlnZ2Vycy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgcmV0dXJuIF9pc0Z1bmN0aW9uKHQudmFycy5vblJlZnJlc2gpICYmIHQudmFycy5vblJlZnJlc2godCk7XG4gIH0pO1xuXG4gIF9yZWZyZXNoaW5nQWxsID0gU2Nyb2xsVHJpZ2dlci5pc1JlZnJlc2hpbmcgPSBmYWxzZTtcblxuICBfZGlzcGF0Y2goXCJyZWZyZXNoXCIpO1xufSxcbiAgICBfbGFzdFNjcm9sbCA9IDAsXG4gICAgX2RpcmVjdGlvbiA9IDEsXG4gICAgX3ByaW1hcnksXG4gICAgX3VwZGF0ZUFsbCA9IGZ1bmN0aW9uIF91cGRhdGVBbGwoZm9yY2UpIHtcbiAgaWYgKGZvcmNlID09PSAyIHx8ICFfcmVmcmVzaGluZ0FsbCAmJiAhX2lzUmV2ZXJ0ZWQpIHtcbiAgICAvLyBfaXNSZXZlcnRlZCBjb3VsZCBiZSB0cnVlIGlmLCBmb3IgZXhhbXBsZSwgYSBtYXRjaE1lZGlhKCkgaXMgaW4gdGhlIHByb2Nlc3Mgb2YgZXhlY3V0aW5nLiBXZSBkb24ndCB3YW50IHRvIHVwZGF0ZSBkdXJpbmcgdGhlIHRpbWUgZXZlcnl0aGluZyBpcyByZXZlcnRlZC5cbiAgICBTY3JvbGxUcmlnZ2VyLmlzVXBkYXRpbmcgPSB0cnVlO1xuICAgIF9wcmltYXJ5ICYmIF9wcmltYXJ5LnVwZGF0ZSgwKTsgLy8gU2Nyb2xsU21vb3RoZXIgdXNlcyByZWZyZXNoUHJpb3JpdHkgLTk5OTkgdG8gYmVjb21lIHRoZSBwcmltYXJ5IHRoYXQgZ2V0cyB1cGRhdGVkIGJlZm9yZSBhbGwgb3RoZXJzIGJlY2F1c2UgaXQgYWZmZWN0cyB0aGUgc2Nyb2xsIHBvc2l0aW9uLlxuXG4gICAgdmFyIGwgPSBfdHJpZ2dlcnMubGVuZ3RoLFxuICAgICAgICB0aW1lID0gX2dldFRpbWUoKSxcbiAgICAgICAgcmVjb3JkVmVsb2NpdHkgPSB0aW1lIC0gX3RpbWUxID49IDUwLFxuICAgICAgICBzY3JvbGwgPSBsICYmIF90cmlnZ2Vyc1swXS5zY3JvbGwoKTtcblxuICAgIF9kaXJlY3Rpb24gPSBfbGFzdFNjcm9sbCA+IHNjcm9sbCA/IC0xIDogMTtcbiAgICBfcmVmcmVzaGluZ0FsbCB8fCAoX2xhc3RTY3JvbGwgPSBzY3JvbGwpO1xuXG4gICAgaWYgKHJlY29yZFZlbG9jaXR5KSB7XG4gICAgICBpZiAoX2xhc3RTY3JvbGxUaW1lICYmICFfcG9pbnRlcklzRG93biAmJiB0aW1lIC0gX2xhc3RTY3JvbGxUaW1lID4gMjAwKSB7XG4gICAgICAgIF9sYXN0U2Nyb2xsVGltZSA9IDA7XG5cbiAgICAgICAgX2Rpc3BhdGNoKFwic2Nyb2xsRW5kXCIpO1xuICAgICAgfVxuXG4gICAgICBfdGltZTIgPSBfdGltZTE7XG4gICAgICBfdGltZTEgPSB0aW1lO1xuICAgIH1cblxuICAgIGlmIChfZGlyZWN0aW9uIDwgMCkge1xuICAgICAgX2kgPSBsO1xuXG4gICAgICB3aGlsZSAoX2ktLSA+IDApIHtcbiAgICAgICAgX3RyaWdnZXJzW19pXSAmJiBfdHJpZ2dlcnNbX2ldLnVwZGF0ZSgwLCByZWNvcmRWZWxvY2l0eSk7XG4gICAgICB9XG5cbiAgICAgIF9kaXJlY3Rpb24gPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKF9pID0gMDsgX2kgPCBsOyBfaSsrKSB7XG4gICAgICAgIF90cmlnZ2Vyc1tfaV0gJiYgX3RyaWdnZXJzW19pXS51cGRhdGUoMCwgcmVjb3JkVmVsb2NpdHkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIFNjcm9sbFRyaWdnZXIuaXNVcGRhdGluZyA9IGZhbHNlO1xuICB9XG5cbiAgX3JhZklEID0gMDtcbn0sXG4gICAgX3Byb3BOYW1lc1RvQ29weSA9IFtfbGVmdCwgX3RvcCwgX2JvdHRvbSwgX3JpZ2h0LCBfbWFyZ2luICsgX0JvdHRvbSwgX21hcmdpbiArIF9SaWdodCwgX21hcmdpbiArIF9Ub3AsIF9tYXJnaW4gKyBfTGVmdCwgXCJkaXNwbGF5XCIsIFwiZmxleFNocmlua1wiLCBcImZsb2F0XCIsIFwiekluZGV4XCIsIFwiZ3JpZENvbHVtblN0YXJ0XCIsIFwiZ3JpZENvbHVtbkVuZFwiLCBcImdyaWRSb3dTdGFydFwiLCBcImdyaWRSb3dFbmRcIiwgXCJncmlkQXJlYVwiLCBcImp1c3RpZnlTZWxmXCIsIFwiYWxpZ25TZWxmXCIsIFwicGxhY2VTZWxmXCIsIFwib3JkZXJcIl0sXG4gICAgX3N0YXRlUHJvcHMgPSBfcHJvcE5hbWVzVG9Db3B5LmNvbmNhdChbX3dpZHRoLCBfaGVpZ2h0LCBcImJveFNpemluZ1wiLCBcIm1heFwiICsgX1dpZHRoLCBcIm1heFwiICsgX0hlaWdodCwgXCJwb3NpdGlvblwiLCBfbWFyZ2luLCBfcGFkZGluZywgX3BhZGRpbmcgKyBfVG9wLCBfcGFkZGluZyArIF9SaWdodCwgX3BhZGRpbmcgKyBfQm90dG9tLCBfcGFkZGluZyArIF9MZWZ0XSksXG4gICAgX3N3YXBQaW5PdXQgPSBmdW5jdGlvbiBfc3dhcFBpbk91dChwaW4sIHNwYWNlciwgc3RhdGUpIHtcbiAgX3NldFN0YXRlKHN0YXRlKTtcblxuICB2YXIgY2FjaGUgPSBwaW4uX2dzYXA7XG5cbiAgaWYgKGNhY2hlLnNwYWNlcklzTmF0aXZlKSB7XG4gICAgX3NldFN0YXRlKGNhY2hlLnNwYWNlclN0YXRlKTtcbiAgfSBlbHNlIGlmIChwaW4uX2dzYXAuc3dhcHBlZEluKSB7XG4gICAgdmFyIHBhcmVudCA9IHNwYWNlci5wYXJlbnROb2RlO1xuXG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShwaW4sIHNwYWNlcik7XG4gICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQoc3BhY2VyKTtcbiAgICB9XG4gIH1cblxuICBwaW4uX2dzYXAuc3dhcHBlZEluID0gZmFsc2U7XG59LFxuICAgIF9zd2FwUGluSW4gPSBmdW5jdGlvbiBfc3dhcFBpbkluKHBpbiwgc3BhY2VyLCBjcywgc3BhY2VyU3RhdGUpIHtcbiAgaWYgKCFwaW4uX2dzYXAuc3dhcHBlZEluKSB7XG4gICAgdmFyIGkgPSBfcHJvcE5hbWVzVG9Db3B5Lmxlbmd0aCxcbiAgICAgICAgc3BhY2VyU3R5bGUgPSBzcGFjZXIuc3R5bGUsXG4gICAgICAgIHBpblN0eWxlID0gcGluLnN0eWxlLFxuICAgICAgICBwO1xuXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgcCA9IF9wcm9wTmFtZXNUb0NvcHlbaV07XG4gICAgICBzcGFjZXJTdHlsZVtwXSA9IGNzW3BdO1xuICAgIH1cblxuICAgIHNwYWNlclN0eWxlLnBvc2l0aW9uID0gY3MucG9zaXRpb24gPT09IFwiYWJzb2x1dGVcIiA/IFwiYWJzb2x1dGVcIiA6IFwicmVsYXRpdmVcIjtcbiAgICBjcy5kaXNwbGF5ID09PSBcImlubGluZVwiICYmIChzcGFjZXJTdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmUtYmxvY2tcIik7XG4gICAgcGluU3R5bGVbX2JvdHRvbV0gPSBwaW5TdHlsZVtfcmlnaHRdID0gXCJhdXRvXCI7XG4gICAgc3BhY2VyU3R5bGUuZmxleEJhc2lzID0gY3MuZmxleEJhc2lzIHx8IFwiYXV0b1wiO1xuICAgIHNwYWNlclN0eWxlLm92ZXJmbG93ID0gXCJ2aXNpYmxlXCI7XG4gICAgc3BhY2VyU3R5bGUuYm94U2l6aW5nID0gXCJib3JkZXItYm94XCI7XG4gICAgc3BhY2VyU3R5bGVbX3dpZHRoXSA9IF9nZXRTaXplKHBpbiwgX2hvcml6b250YWwpICsgX3B4O1xuICAgIHNwYWNlclN0eWxlW19oZWlnaHRdID0gX2dldFNpemUocGluLCBfdmVydGljYWwpICsgX3B4O1xuICAgIHNwYWNlclN0eWxlW19wYWRkaW5nXSA9IHBpblN0eWxlW19tYXJnaW5dID0gcGluU3R5bGVbX3RvcF0gPSBwaW5TdHlsZVtfbGVmdF0gPSBcIjBcIjtcblxuICAgIF9zZXRTdGF0ZShzcGFjZXJTdGF0ZSk7XG5cbiAgICBwaW5TdHlsZVtfd2lkdGhdID0gcGluU3R5bGVbXCJtYXhcIiArIF9XaWR0aF0gPSBjc1tfd2lkdGhdO1xuICAgIHBpblN0eWxlW19oZWlnaHRdID0gcGluU3R5bGVbXCJtYXhcIiArIF9IZWlnaHRdID0gY3NbX2hlaWdodF07XG4gICAgcGluU3R5bGVbX3BhZGRpbmddID0gY3NbX3BhZGRpbmddO1xuXG4gICAgaWYgKHBpbi5wYXJlbnROb2RlICE9PSBzcGFjZXIpIHtcbiAgICAgIHBpbi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzcGFjZXIsIHBpbik7XG4gICAgICBzcGFjZXIuYXBwZW5kQ2hpbGQocGluKTtcbiAgICB9XG5cbiAgICBwaW4uX2dzYXAuc3dhcHBlZEluID0gdHJ1ZTtcbiAgfVxufSxcbiAgICBfY2Fwc0V4cCA9IC8oW0EtWl0pL2csXG4gICAgX3NldFN0YXRlID0gZnVuY3Rpb24gX3NldFN0YXRlKHN0YXRlKSB7XG4gIGlmIChzdGF0ZSkge1xuICAgIHZhciBzdHlsZSA9IHN0YXRlLnQuc3R5bGUsXG4gICAgICAgIGwgPSBzdGF0ZS5sZW5ndGgsXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBwLFxuICAgICAgICB2YWx1ZTtcbiAgICAoc3RhdGUudC5fZ3NhcCB8fCBnc2FwLmNvcmUuZ2V0Q2FjaGUoc3RhdGUudCkpLnVuY2FjaGUgPSAxOyAvLyBvdGhlcndpc2UgdHJhbnNmb3JtcyBtYXkgYmUgb2ZmXG5cbiAgICBmb3IgKDsgaSA8IGw7IGkgKz0gMikge1xuICAgICAgdmFsdWUgPSBzdGF0ZVtpICsgMV07XG4gICAgICBwID0gc3RhdGVbaV07XG5cbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICBzdHlsZVtwXSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIGlmIChzdHlsZVtwXSkge1xuICAgICAgICBzdHlsZS5yZW1vdmVQcm9wZXJ0eShwLnJlcGxhY2UoX2NhcHNFeHAsIFwiLSQxXCIpLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSxcbiAgICBfZ2V0U3RhdGUgPSBmdW5jdGlvbiBfZ2V0U3RhdGUoZWxlbWVudCkge1xuICAvLyByZXR1cm5zIGFuIEFycmF5IHdpdGggYWx0ZXJuYXRpbmcgdmFsdWVzIGxpa2UgW3Byb3BlcnR5LCB2YWx1ZSwgcHJvcGVydHksIHZhbHVlXSBhbmQgYSBcInRcIiBwcm9wZXJ0eSBwb2ludGluZyB0byB0aGUgdGFyZ2V0IChlbGVtZW50KS4gTWFrZXMgaXQgZmFzdCBhbmQgY2hlYXAuXG4gIHZhciBsID0gX3N0YXRlUHJvcHMubGVuZ3RoLFxuICAgICAgc3R5bGUgPSBlbGVtZW50LnN0eWxlLFxuICAgICAgc3RhdGUgPSBbXSxcbiAgICAgIGkgPSAwO1xuXG4gIGZvciAoOyBpIDwgbDsgaSsrKSB7XG4gICAgc3RhdGUucHVzaChfc3RhdGVQcm9wc1tpXSwgc3R5bGVbX3N0YXRlUHJvcHNbaV1dKTtcbiAgfVxuXG4gIHN0YXRlLnQgPSBlbGVtZW50O1xuICByZXR1cm4gc3RhdGU7XG59LFxuICAgIF9jb3B5U3RhdGUgPSBmdW5jdGlvbiBfY29weVN0YXRlKHN0YXRlLCBvdmVycmlkZSwgb21pdE9mZnNldHMpIHtcbiAgdmFyIHJlc3VsdCA9IFtdLFxuICAgICAgbCA9IHN0YXRlLmxlbmd0aCxcbiAgICAgIGkgPSBvbWl0T2Zmc2V0cyA/IDggOiAwLFxuICAgICAgLy8gc2tpcCB0b3AsIGxlZnQsIHJpZ2h0LCBib3R0b20gaWYgb21pdE9mZnNldHMgaXMgdHJ1ZVxuICBwO1xuXG4gIGZvciAoOyBpIDwgbDsgaSArPSAyKSB7XG4gICAgcCA9IHN0YXRlW2ldO1xuICAgIHJlc3VsdC5wdXNoKHAsIHAgaW4gb3ZlcnJpZGUgPyBvdmVycmlkZVtwXSA6IHN0YXRlW2kgKyAxXSk7XG4gIH1cblxuICByZXN1bHQudCA9IHN0YXRlLnQ7XG4gIHJldHVybiByZXN1bHQ7XG59LFxuICAgIF93aW5PZmZzZXRzID0ge1xuICBsZWZ0OiAwLFxuICB0b3A6IDBcbn0sXG4gICAgLy8gLy8gcG90ZW50aWFsIGZ1dHVyZSBmZWF0dXJlICg/KSBBbGxvdyB1c2VycyB0byBjYWxjdWxhdGUgd2hlcmUgYSB0cmlnZ2VyIGhpdHMgKHNjcm9sbCBwb3NpdGlvbikgbGlrZSBnZXRTY3JvbGxQb3NpdGlvbihcIiNpZFwiLCBcInRvcCBib3R0b21cIilcbi8vIF9nZXRTY3JvbGxQb3NpdGlvbiA9ICh0cmlnZ2VyLCBwb3NpdGlvbiwge3Njcm9sbGVyLCBjb250YWluZXJBbmltYXRpb24sIGhvcml6b250YWx9KSA9PiB7XG4vLyBcdHNjcm9sbGVyID0gX2dldFRhcmdldChzY3JvbGxlciB8fCBfd2luKTtcbi8vIFx0bGV0IGRpcmVjdGlvbiA9IGhvcml6b250YWwgPyBfaG9yaXpvbnRhbCA6IF92ZXJ0aWNhbCxcbi8vIFx0XHRpc1ZpZXdwb3J0ID0gX2lzVmlld3BvcnQoc2Nyb2xsZXIpO1xuLy8gXHRfZ2V0U2l6ZUZ1bmMoc2Nyb2xsZXIsIGlzVmlld3BvcnQsIGRpcmVjdGlvbik7XG4vLyBcdHJldHVybiBfcGFyc2VQb3NpdGlvbihwb3NpdGlvbiwgX2dldFRhcmdldCh0cmlnZ2VyKSwgX2dldFNpemVGdW5jKHNjcm9sbGVyLCBpc1ZpZXdwb3J0LCBkaXJlY3Rpb24pKCksIGRpcmVjdGlvbiwgX2dldFNjcm9sbEZ1bmMoc2Nyb2xsZXIsIGRpcmVjdGlvbikoKSwgMCwgMCwgMCwgX2dldE9mZnNldHNGdW5jKHNjcm9sbGVyLCBpc1ZpZXdwb3J0KSgpLCBpc1ZpZXdwb3J0ID8gMCA6IHBhcnNlRmxvYXQoX2dldENvbXB1dGVkU3R5bGUoc2Nyb2xsZXIpW1wiYm9yZGVyXCIgKyBkaXJlY3Rpb24ucDIgKyBfV2lkdGhdKSB8fCAwLCAwLCBjb250YWluZXJBbmltYXRpb24gPyBjb250YWluZXJBbmltYXRpb24uZHVyYXRpb24oKSA6IF9tYXhTY3JvbGwoc2Nyb2xsZXIpLCBjb250YWluZXJBbmltYXRpb24pO1xuLy8gfSxcbl9wYXJzZVBvc2l0aW9uID0gZnVuY3Rpb24gX3BhcnNlUG9zaXRpb24odmFsdWUsIHRyaWdnZXIsIHNjcm9sbGVyU2l6ZSwgZGlyZWN0aW9uLCBzY3JvbGwsIG1hcmtlciwgbWFya2VyU2Nyb2xsZXIsIHNlbGYsIHNjcm9sbGVyQm91bmRzLCBib3JkZXJXaWR0aCwgdXNlRml4ZWRQb3NpdGlvbiwgc2Nyb2xsZXJNYXgsIGNvbnRhaW5lckFuaW1hdGlvbiwgY2xhbXBaZXJvUHJvcCkge1xuICBfaXNGdW5jdGlvbih2YWx1ZSkgJiYgKHZhbHVlID0gdmFsdWUoc2VsZikpO1xuXG4gIGlmIChfaXNTdHJpbmcodmFsdWUpICYmIHZhbHVlLnN1YnN0cigwLCAzKSA9PT0gXCJtYXhcIikge1xuICAgIHZhbHVlID0gc2Nyb2xsZXJNYXggKyAodmFsdWUuY2hhckF0KDQpID09PSBcIj1cIiA/IF9vZmZzZXRUb1B4KFwiMFwiICsgdmFsdWUuc3Vic3RyKDMpLCBzY3JvbGxlclNpemUpIDogMCk7XG4gIH1cblxuICB2YXIgdGltZSA9IGNvbnRhaW5lckFuaW1hdGlvbiA/IGNvbnRhaW5lckFuaW1hdGlvbi50aW1lKCkgOiAwLFxuICAgICAgcDEsXG4gICAgICBwMixcbiAgICAgIGVsZW1lbnQ7XG4gIGNvbnRhaW5lckFuaW1hdGlvbiAmJiBjb250YWluZXJBbmltYXRpb24uc2VlaygwKTtcbiAgaXNOYU4odmFsdWUpIHx8ICh2YWx1ZSA9ICt2YWx1ZSk7IC8vIGNvbnZlcnQgYSBzdHJpbmcgbnVtYmVyIGxpa2UgXCI0NVwiIHRvIGFuIGFjdHVhbCBudW1iZXJcblxuICBpZiAoIV9pc051bWJlcih2YWx1ZSkpIHtcbiAgICBfaXNGdW5jdGlvbih0cmlnZ2VyKSAmJiAodHJpZ2dlciA9IHRyaWdnZXIoc2VsZikpO1xuICAgIHZhciBvZmZzZXRzID0gKHZhbHVlIHx8IFwiMFwiKS5zcGxpdChcIiBcIiksXG4gICAgICAgIGJvdW5kcyxcbiAgICAgICAgbG9jYWxPZmZzZXQsXG4gICAgICAgIGdsb2JhbE9mZnNldCxcbiAgICAgICAgZGlzcGxheTtcbiAgICBlbGVtZW50ID0gX2dldFRhcmdldCh0cmlnZ2VyLCBzZWxmKSB8fCBfYm9keTtcbiAgICBib3VuZHMgPSBfZ2V0Qm91bmRzKGVsZW1lbnQpIHx8IHt9O1xuXG4gICAgaWYgKCghYm91bmRzIHx8ICFib3VuZHMubGVmdCAmJiAhYm91bmRzLnRvcCkgJiYgX2dldENvbXB1dGVkU3R5bGUoZWxlbWVudCkuZGlzcGxheSA9PT0gXCJub25lXCIpIHtcbiAgICAgIC8vIGlmIGRpc3BsYXkgaXMgXCJub25lXCIsIGl0IHdvbid0IHJlcG9ydCBnZXRCb3VuZGluZ0NsaWVudFJlY3QoKSBwcm9wZXJseVxuICAgICAgZGlzcGxheSA9IGVsZW1lbnQuc3R5bGUuZGlzcGxheTtcbiAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgIGJvdW5kcyA9IF9nZXRCb3VuZHMoZWxlbWVudCk7XG4gICAgICBkaXNwbGF5ID8gZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheSA6IGVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJkaXNwbGF5XCIpO1xuICAgIH1cblxuICAgIGxvY2FsT2Zmc2V0ID0gX29mZnNldFRvUHgob2Zmc2V0c1swXSwgYm91bmRzW2RpcmVjdGlvbi5kXSk7XG4gICAgZ2xvYmFsT2Zmc2V0ID0gX29mZnNldFRvUHgob2Zmc2V0c1sxXSB8fCBcIjBcIiwgc2Nyb2xsZXJTaXplKTtcbiAgICB2YWx1ZSA9IGJvdW5kc1tkaXJlY3Rpb24ucF0gLSBzY3JvbGxlckJvdW5kc1tkaXJlY3Rpb24ucF0gLSBib3JkZXJXaWR0aCArIGxvY2FsT2Zmc2V0ICsgc2Nyb2xsIC0gZ2xvYmFsT2Zmc2V0O1xuICAgIG1hcmtlclNjcm9sbGVyICYmIF9wb3NpdGlvbk1hcmtlcihtYXJrZXJTY3JvbGxlciwgZ2xvYmFsT2Zmc2V0LCBkaXJlY3Rpb24sIHNjcm9sbGVyU2l6ZSAtIGdsb2JhbE9mZnNldCA8IDIwIHx8IG1hcmtlclNjcm9sbGVyLl9pc1N0YXJ0ICYmIGdsb2JhbE9mZnNldCA+IDIwKTtcbiAgICBzY3JvbGxlclNpemUgLT0gc2Nyb2xsZXJTaXplIC0gZ2xvYmFsT2Zmc2V0OyAvLyBhZGp1c3QgZm9yIHRoZSBtYXJrZXJcbiAgfSBlbHNlIHtcbiAgICBjb250YWluZXJBbmltYXRpb24gJiYgKHZhbHVlID0gZ3NhcC51dGlscy5tYXBSYW5nZShjb250YWluZXJBbmltYXRpb24uc2Nyb2xsVHJpZ2dlci5zdGFydCwgY29udGFpbmVyQW5pbWF0aW9uLnNjcm9sbFRyaWdnZXIuZW5kLCAwLCBzY3JvbGxlck1heCwgdmFsdWUpKTtcbiAgICBtYXJrZXJTY3JvbGxlciAmJiBfcG9zaXRpb25NYXJrZXIobWFya2VyU2Nyb2xsZXIsIHNjcm9sbGVyU2l6ZSwgZGlyZWN0aW9uLCB0cnVlKTtcbiAgfVxuXG4gIGlmIChjbGFtcFplcm9Qcm9wKSB7XG4gICAgc2VsZltjbGFtcFplcm9Qcm9wXSA9IHZhbHVlIHx8IC0wLjAwMTtcbiAgICB2YWx1ZSA8IDAgJiYgKHZhbHVlID0gMCk7XG4gIH1cblxuICBpZiAobWFya2VyKSB7XG4gICAgdmFyIHBvc2l0aW9uID0gdmFsdWUgKyBzY3JvbGxlclNpemUsXG4gICAgICAgIGlzU3RhcnQgPSBtYXJrZXIuX2lzU3RhcnQ7XG4gICAgcDEgPSBcInNjcm9sbFwiICsgZGlyZWN0aW9uLmQyO1xuXG4gICAgX3Bvc2l0aW9uTWFya2VyKG1hcmtlciwgcG9zaXRpb24sIGRpcmVjdGlvbiwgaXNTdGFydCAmJiBwb3NpdGlvbiA+IDIwIHx8ICFpc1N0YXJ0ICYmICh1c2VGaXhlZFBvc2l0aW9uID8gTWF0aC5tYXgoX2JvZHlbcDFdLCBfZG9jRWxbcDFdKSA6IG1hcmtlci5wYXJlbnROb2RlW3AxXSkgPD0gcG9zaXRpb24gKyAxKTtcblxuICAgIGlmICh1c2VGaXhlZFBvc2l0aW9uKSB7XG4gICAgICBzY3JvbGxlckJvdW5kcyA9IF9nZXRCb3VuZHMobWFya2VyU2Nyb2xsZXIpO1xuICAgICAgdXNlRml4ZWRQb3NpdGlvbiAmJiAobWFya2VyLnN0eWxlW2RpcmVjdGlvbi5vcC5wXSA9IHNjcm9sbGVyQm91bmRzW2RpcmVjdGlvbi5vcC5wXSAtIGRpcmVjdGlvbi5vcC5tIC0gbWFya2VyLl9vZmZzZXQgKyBfcHgpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChjb250YWluZXJBbmltYXRpb24gJiYgZWxlbWVudCkge1xuICAgIHAxID0gX2dldEJvdW5kcyhlbGVtZW50KTtcbiAgICBjb250YWluZXJBbmltYXRpb24uc2VlayhzY3JvbGxlck1heCk7XG4gICAgcDIgPSBfZ2V0Qm91bmRzKGVsZW1lbnQpO1xuICAgIGNvbnRhaW5lckFuaW1hdGlvbi5fY2FTY3JvbGxEaXN0ID0gcDFbZGlyZWN0aW9uLnBdIC0gcDJbZGlyZWN0aW9uLnBdO1xuICAgIHZhbHVlID0gdmFsdWUgLyBjb250YWluZXJBbmltYXRpb24uX2NhU2Nyb2xsRGlzdCAqIHNjcm9sbGVyTWF4O1xuICB9XG5cbiAgY29udGFpbmVyQW5pbWF0aW9uICYmIGNvbnRhaW5lckFuaW1hdGlvbi5zZWVrKHRpbWUpO1xuICByZXR1cm4gY29udGFpbmVyQW5pbWF0aW9uID8gdmFsdWUgOiBNYXRoLnJvdW5kKHZhbHVlKTtcbn0sXG4gICAgX3ByZWZpeEV4cCA9IC8od2Via2l0fG1venxsZW5ndGh8Y3NzVGV4dHxpbnNldCkvaSxcbiAgICBfcmVwYXJlbnQgPSBmdW5jdGlvbiBfcmVwYXJlbnQoZWxlbWVudCwgcGFyZW50LCB0b3AsIGxlZnQpIHtcbiAgaWYgKGVsZW1lbnQucGFyZW50Tm9kZSAhPT0gcGFyZW50KSB7XG4gICAgdmFyIHN0eWxlID0gZWxlbWVudC5zdHlsZSxcbiAgICAgICAgcCxcbiAgICAgICAgY3M7XG5cbiAgICBpZiAocGFyZW50ID09PSBfYm9keSkge1xuICAgICAgZWxlbWVudC5fc3RPcmlnID0gc3R5bGUuY3NzVGV4dDsgLy8gcmVjb3JkIG9yaWdpbmFsIGlubGluZSBzdHlsZXMgc28gd2UgY2FuIHJldmVydCB0aGVtIGxhdGVyXG5cbiAgICAgIGNzID0gX2dldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG5cbiAgICAgIGZvciAocCBpbiBjcykge1xuICAgICAgICAvLyBtdXN0IGNvcHkgYWxsIHJlbGV2YW50IHN0eWxlcyB0byBlbnN1cmUgdGhhdCBub3RoaW5nIGNoYW5nZXMgdmlzdWFsbHkgd2hlbiB3ZSByZXBhcmVudCB0byB0aGUgPGJvZHk+LiBTa2lwIHRoZSB2ZW5kb3IgcHJlZml4ZWQgb25lcy5cbiAgICAgICAgaWYgKCErcCAmJiAhX3ByZWZpeEV4cC50ZXN0KHApICYmIGNzW3BdICYmIHR5cGVvZiBzdHlsZVtwXSA9PT0gXCJzdHJpbmdcIiAmJiBwICE9PSBcIjBcIikge1xuICAgICAgICAgIHN0eWxlW3BdID0gY3NbcF07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc3R5bGUudG9wID0gdG9wO1xuICAgICAgc3R5bGUubGVmdCA9IGxlZnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0eWxlLmNzc1RleHQgPSBlbGVtZW50Ll9zdE9yaWc7XG4gICAgfVxuXG4gICAgZ3NhcC5jb3JlLmdldENhY2hlKGVsZW1lbnQpLnVuY2FjaGUgPSAxO1xuICAgIHBhcmVudC5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgfVxufSxcbiAgICBfaW50ZXJydXB0aW9uVHJhY2tlciA9IGZ1bmN0aW9uIF9pbnRlcnJ1cHRpb25UcmFja2VyKGdldFZhbHVlRnVuYywgaW5pdGlhbFZhbHVlLCBvbkludGVycnVwdCkge1xuICB2YXIgbGFzdDEgPSBpbml0aWFsVmFsdWUsXG4gICAgICBsYXN0MiA9IGxhc3QxO1xuICByZXR1cm4gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdmFyIGN1cnJlbnQgPSBNYXRoLnJvdW5kKGdldFZhbHVlRnVuYygpKTsgLy8gcm91bmQgYmVjYXVzZSBpbiBzb21lIFt2ZXJ5IHVuY29tbW9uXSBXaW5kb3dzIGVudmlyb25tZW50cywgc2Nyb2xsIGNhbiBnZXQgcmVwb3J0ZWQgd2l0aCBkZWNpbWFscyBldmVuIHRob3VnaCBpdCB3YXMgc2V0IHdpdGhvdXQuXG5cbiAgICBpZiAoY3VycmVudCAhPT0gbGFzdDEgJiYgY3VycmVudCAhPT0gbGFzdDIgJiYgTWF0aC5hYnMoY3VycmVudCAtIGxhc3QxKSA+IDMgJiYgTWF0aC5hYnMoY3VycmVudCAtIGxhc3QyKSA+IDMpIHtcbiAgICAgIC8vIGlmIHRoZSB1c2VyIHNjcm9sbHMsIGtpbGwgdGhlIHR3ZWVuLiBpT1MgU2FmYXJpIGludGVybWl0dGVudGx5IG1pc3JlcG9ydHMgdGhlIHNjcm9sbCBwb3NpdGlvbiwgaXQgbWF5IGJlIHRoZSBtb3N0IHJlY2VudGx5LXNldCBvbmUgb3IgdGhlIG9uZSBiZWZvcmUgdGhhdCEgV2hlbiBTYWZhcmkgaXMgem9vbWVkIChDTUQtKyksIGl0IG9mdGVuIG1pc3JlcG9ydHMgYXMgMSBwaXhlbCBvZmYgdG9vISBTbyBpZiB3ZSBzZXQgdGhlIHNjcm9sbCBwb3NpdGlvbiB0byAxMjUsIGZvciBleGFtcGxlLCBpdCdsbCBhY3R1YWxseSByZXBvcnQgaXQgYXMgMTI0LlxuICAgICAgdmFsdWUgPSBjdXJyZW50O1xuICAgICAgb25JbnRlcnJ1cHQgJiYgb25JbnRlcnJ1cHQoKTtcbiAgICB9XG5cbiAgICBsYXN0MiA9IGxhc3QxO1xuICAgIGxhc3QxID0gTWF0aC5yb3VuZCh2YWx1ZSk7XG4gICAgcmV0dXJuIGxhc3QxO1xuICB9O1xufSxcbiAgICBfc2hpZnRNYXJrZXIgPSBmdW5jdGlvbiBfc2hpZnRNYXJrZXIobWFya2VyLCBkaXJlY3Rpb24sIHZhbHVlKSB7XG4gIHZhciB2YXJzID0ge307XG4gIHZhcnNbZGlyZWN0aW9uLnBdID0gXCIrPVwiICsgdmFsdWU7XG4gIGdzYXAuc2V0KG1hcmtlciwgdmFycyk7XG59LFxuICAgIC8vIF9tZXJnZUFuaW1hdGlvbnMgPSBhbmltYXRpb25zID0+IHtcbi8vIFx0bGV0IHRsID0gZ3NhcC50aW1lbGluZSh7c21vb3RoQ2hpbGRUaW1pbmc6IHRydWV9KS5zdGFydFRpbWUoTWF0aC5taW4oLi4uYW5pbWF0aW9ucy5tYXAoYSA9PiBhLmdsb2JhbFRpbWUoMCkpKSk7XG4vLyBcdGFuaW1hdGlvbnMuZm9yRWFjaChhID0+IHtsZXQgdGltZSA9IGEudG90YWxUaW1lKCk7IHRsLmFkZChhKTsgYS50b3RhbFRpbWUodGltZSk7IH0pO1xuLy8gXHR0bC5zbW9vdGhDaGlsZFRpbWluZyA9IGZhbHNlO1xuLy8gXHRyZXR1cm4gdGw7XG4vLyB9LFxuLy8gcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gdHdlZW4gdGhlIHNjcm9sbCBwb3NpdGlvbiBpbiB0aGUgZGlyZWN0aW9uIHByb3ZpZGVkLCBhbmQgd2hlbiBkb2luZyBzbyBpdCdsbCBhZGQgYSAudHdlZW4gcHJvcGVydHkgdG8gdGhlIEZVTkNUSU9OIGl0c2VsZiwgYW5kIHJlbW92ZSBpdCB3aGVuIHRoZSB0d2VlbiBjb21wbGV0ZXMgb3IgZ2V0cyBraWxsZWQuIFRoaXMgZ2l2ZXMgdXMgYSB3YXkgdG8gaGF2ZSBtdWx0aXBsZSBTY3JvbGxUcmlnZ2VycyB1c2UgYSBjZW50cmFsIGZ1bmN0aW9uIGZvciBhbnkgZ2l2ZW4gc2Nyb2xsZXIgYW5kIHNlZSBpZiB0aGVyZSdzIGEgc2Nyb2xsIHR3ZWVuIHJ1bm5pbmcgKHdoaWNoIHdvdWxkIGFmZmVjdCBpZi9ob3cgdGhpbmdzIGdldCB1cGRhdGVkKVxuX2dldFR3ZWVuQ3JlYXRvciA9IGZ1bmN0aW9uIF9nZXRUd2VlbkNyZWF0b3Ioc2Nyb2xsZXIsIGRpcmVjdGlvbikge1xuICB2YXIgZ2V0U2Nyb2xsID0gX2dldFNjcm9sbEZ1bmMoc2Nyb2xsZXIsIGRpcmVjdGlvbiksXG4gICAgICBwcm9wID0gXCJfc2Nyb2xsXCIgKyBkaXJlY3Rpb24ucDIsXG4gICAgICAvLyBhZGQgYSB0d2VlbmFibGUgcHJvcGVydHkgdG8gdGhlIHNjcm9sbGVyIHRoYXQncyBhIGdldHRlci9zZXR0ZXIgZnVuY3Rpb24sIGxpa2UgX3Njcm9sbFRvcCBvciBfc2Nyb2xsTGVmdC4gVGhpcyB3YXksIGlmIHNvbWVvbmUgZG9lcyBnc2FwLmtpbGxUd2VlbnNPZihzY3JvbGxlcikgaXQnbGwga2lsbCB0aGUgc2Nyb2xsIHR3ZWVuLlxuICBnZXRUd2VlbiA9IGZ1bmN0aW9uIGdldFR3ZWVuKHNjcm9sbFRvLCB2YXJzLCBpbml0aWFsVmFsdWUsIGNoYW5nZTEsIGNoYW5nZTIpIHtcbiAgICB2YXIgdHdlZW4gPSBnZXRUd2Vlbi50d2VlbixcbiAgICAgICAgb25Db21wbGV0ZSA9IHZhcnMub25Db21wbGV0ZSxcbiAgICAgICAgbW9kaWZpZXJzID0ge307XG4gICAgaW5pdGlhbFZhbHVlID0gaW5pdGlhbFZhbHVlIHx8IGdldFNjcm9sbCgpO1xuXG4gICAgdmFyIGNoZWNrRm9ySW50ZXJydXB0aW9uID0gX2ludGVycnVwdGlvblRyYWNrZXIoZ2V0U2Nyb2xsLCBpbml0aWFsVmFsdWUsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHR3ZWVuLmtpbGwoKTtcbiAgICAgIGdldFR3ZWVuLnR3ZWVuID0gMDtcbiAgICB9KTtcblxuICAgIGNoYW5nZTIgPSBjaGFuZ2UxICYmIGNoYW5nZTIgfHwgMDsgLy8gaWYgY2hhbmdlMSBpcyAwLCB3ZSBzZXQgdGhhdCB0byB0aGUgZGlmZmVyZW5jZSBhbmQgaWdub3JlIGNoYW5nZTIuIE90aGVyd2lzZSwgdGhlcmUgd291bGQgYmUgYSBjb21wb3VuZCBlZmZlY3QuXG5cbiAgICBjaGFuZ2UxID0gY2hhbmdlMSB8fCBzY3JvbGxUbyAtIGluaXRpYWxWYWx1ZTtcbiAgICB0d2VlbiAmJiB0d2Vlbi5raWxsKCk7XG4gICAgdmFyc1twcm9wXSA9IHNjcm9sbFRvO1xuICAgIHZhcnMuaW5oZXJpdCA9IGZhbHNlO1xuICAgIHZhcnMubW9kaWZpZXJzID0gbW9kaWZpZXJzO1xuXG4gICAgbW9kaWZpZXJzW3Byb3BdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGNoZWNrRm9ySW50ZXJydXB0aW9uKGluaXRpYWxWYWx1ZSArIGNoYW5nZTEgKiB0d2Vlbi5yYXRpbyArIGNoYW5nZTIgKiB0d2Vlbi5yYXRpbyAqIHR3ZWVuLnJhdGlvKTtcbiAgICB9O1xuXG4gICAgdmFycy5vblVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIF9zY3JvbGxlcnMuY2FjaGUrKztcbiAgICAgIGdldFR3ZWVuLnR3ZWVuICYmIF91cGRhdGVBbGwoKTsgLy8gaWYgaXQgd2FzIGludGVycnVwdGVkL2tpbGxlZCwgbGlrZSBpbiBhIGNvbnRleHQucmV2ZXJ0KCksIGRvbid0IGZvcmNlIGFuIHVwZGF0ZUFsbCgpXG4gICAgfTtcblxuICAgIHZhcnMub25Db21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGdldFR3ZWVuLnR3ZWVuID0gMDtcbiAgICAgIG9uQ29tcGxldGUgJiYgb25Db21wbGV0ZS5jYWxsKHR3ZWVuKTtcbiAgICB9O1xuXG4gICAgdHdlZW4gPSBnZXRUd2Vlbi50d2VlbiA9IGdzYXAudG8oc2Nyb2xsZXIsIHZhcnMpO1xuICAgIHJldHVybiB0d2VlbjtcbiAgfTtcblxuICBzY3JvbGxlcltwcm9wXSA9IGdldFNjcm9sbDtcblxuICBnZXRTY3JvbGwud2hlZWxIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBnZXRUd2Vlbi50d2VlbiAmJiBnZXRUd2Vlbi50d2Vlbi5raWxsKCkgJiYgKGdldFR3ZWVuLnR3ZWVuID0gMCk7XG4gIH07XG5cbiAgX2FkZExpc3RlbmVyKHNjcm9sbGVyLCBcIndoZWVsXCIsIGdldFNjcm9sbC53aGVlbEhhbmRsZXIpOyAvLyBXaW5kb3dzIG1hY2hpbmVzIGhhbmRsZSBtb3VzZXdoZWVsIHNjcm9sbGluZyBpbiBjaHVua3MgKGxpa2UgXCIzIGxpbmVzIHBlciBzY3JvbGxcIikgbWVhbmluZyB0aGUgdHlwaWNhbCBzdHJhdGVneSBmb3IgY2FuY2VsbGluZyB0aGUgc2Nyb2xsIGlzbid0IGFzIHNlbnNpdGl2ZS4gSXQncyBtdWNoIG1vcmUgbGlrZWx5IHRvIG1hdGNoIG9uZSBvZiB0aGUgcHJldmlvdXMgMiBzY3JvbGwgZXZlbnQgcG9zaXRpb25zLiBTbyB3ZSBraWxsIGFueSBzbmFwcGluZyBhcyBzb29uIGFzIHRoZXJlJ3MgYSB3aGVlbCBldmVudC5cblxuXG4gIFNjcm9sbFRyaWdnZXIuaXNUb3VjaCAmJiBfYWRkTGlzdGVuZXIoc2Nyb2xsZXIsIFwidG91Y2htb3ZlXCIsIGdldFNjcm9sbC53aGVlbEhhbmRsZXIpO1xuICByZXR1cm4gZ2V0VHdlZW47XG59O1xuXG5leHBvcnQgdmFyIFNjcm9sbFRyaWdnZXIgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBTY3JvbGxUcmlnZ2VyKHZhcnMsIGFuaW1hdGlvbikge1xuICAgIF9jb3JlSW5pdHRlZCB8fCBTY3JvbGxUcmlnZ2VyLnJlZ2lzdGVyKGdzYXApIHx8IGNvbnNvbGUud2FybihcIlBsZWFzZSBnc2FwLnJlZ2lzdGVyUGx1Z2luKFNjcm9sbFRyaWdnZXIpXCIpO1xuXG4gICAgX2NvbnRleHQodGhpcyk7XG5cbiAgICB0aGlzLmluaXQodmFycywgYW5pbWF0aW9uKTtcbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBTY3JvbGxUcmlnZ2VyLnByb3RvdHlwZTtcblxuICBfcHJvdG8uaW5pdCA9IGZ1bmN0aW9uIGluaXQodmFycywgYW5pbWF0aW9uKSB7XG4gICAgdGhpcy5wcm9ncmVzcyA9IHRoaXMuc3RhcnQgPSAwO1xuICAgIHRoaXMudmFycyAmJiB0aGlzLmtpbGwodHJ1ZSwgdHJ1ZSk7IC8vIGluIGNhc2UgaXQncyBiZWluZyBpbml0dGVkIGFnYWluXG5cbiAgICBpZiAoIV9lbmFibGVkKSB7XG4gICAgICB0aGlzLnVwZGF0ZSA9IHRoaXMucmVmcmVzaCA9IHRoaXMua2lsbCA9IF9wYXNzVGhyb3VnaDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXJzID0gX3NldERlZmF1bHRzKF9pc1N0cmluZyh2YXJzKSB8fCBfaXNOdW1iZXIodmFycykgfHwgdmFycy5ub2RlVHlwZSA/IHtcbiAgICAgIHRyaWdnZXI6IHZhcnNcbiAgICB9IDogdmFycywgX2RlZmF1bHRzKTtcblxuICAgIHZhciBfdmFycyA9IHZhcnMsXG4gICAgICAgIG9uVXBkYXRlID0gX3ZhcnMub25VcGRhdGUsXG4gICAgICAgIHRvZ2dsZUNsYXNzID0gX3ZhcnMudG9nZ2xlQ2xhc3MsXG4gICAgICAgIGlkID0gX3ZhcnMuaWQsXG4gICAgICAgIG9uVG9nZ2xlID0gX3ZhcnMub25Ub2dnbGUsXG4gICAgICAgIG9uUmVmcmVzaCA9IF92YXJzLm9uUmVmcmVzaCxcbiAgICAgICAgc2NydWIgPSBfdmFycy5zY3J1YixcbiAgICAgICAgdHJpZ2dlciA9IF92YXJzLnRyaWdnZXIsXG4gICAgICAgIHBpbiA9IF92YXJzLnBpbixcbiAgICAgICAgcGluU3BhY2luZyA9IF92YXJzLnBpblNwYWNpbmcsXG4gICAgICAgIGludmFsaWRhdGVPblJlZnJlc2ggPSBfdmFycy5pbnZhbGlkYXRlT25SZWZyZXNoLFxuICAgICAgICBhbnRpY2lwYXRlUGluID0gX3ZhcnMuYW50aWNpcGF0ZVBpbixcbiAgICAgICAgb25TY3J1YkNvbXBsZXRlID0gX3ZhcnMub25TY3J1YkNvbXBsZXRlLFxuICAgICAgICBvblNuYXBDb21wbGV0ZSA9IF92YXJzLm9uU25hcENvbXBsZXRlLFxuICAgICAgICBvbmNlID0gX3ZhcnMub25jZSxcbiAgICAgICAgc25hcCA9IF92YXJzLnNuYXAsXG4gICAgICAgIHBpblJlcGFyZW50ID0gX3ZhcnMucGluUmVwYXJlbnQsXG4gICAgICAgIHBpblNwYWNlciA9IF92YXJzLnBpblNwYWNlcixcbiAgICAgICAgY29udGFpbmVyQW5pbWF0aW9uID0gX3ZhcnMuY29udGFpbmVyQW5pbWF0aW9uLFxuICAgICAgICBmYXN0U2Nyb2xsRW5kID0gX3ZhcnMuZmFzdFNjcm9sbEVuZCxcbiAgICAgICAgcHJldmVudE92ZXJsYXBzID0gX3ZhcnMucHJldmVudE92ZXJsYXBzLFxuICAgICAgICBkaXJlY3Rpb24gPSB2YXJzLmhvcml6b250YWwgfHwgdmFycy5jb250YWluZXJBbmltYXRpb24gJiYgdmFycy5ob3Jpem9udGFsICE9PSBmYWxzZSA/IF9ob3Jpem9udGFsIDogX3ZlcnRpY2FsLFxuICAgICAgICBpc1RvZ2dsZSA9ICFzY3J1YiAmJiBzY3J1YiAhPT0gMCxcbiAgICAgICAgc2Nyb2xsZXIgPSBfZ2V0VGFyZ2V0KHZhcnMuc2Nyb2xsZXIgfHwgX3dpbiksXG4gICAgICAgIHNjcm9sbGVyQ2FjaGUgPSBnc2FwLmNvcmUuZ2V0Q2FjaGUoc2Nyb2xsZXIpLFxuICAgICAgICBpc1ZpZXdwb3J0ID0gX2lzVmlld3BvcnQoc2Nyb2xsZXIpLFxuICAgICAgICB1c2VGaXhlZFBvc2l0aW9uID0gKFwicGluVHlwZVwiIGluIHZhcnMgPyB2YXJzLnBpblR5cGUgOiBfZ2V0UHJveHlQcm9wKHNjcm9sbGVyLCBcInBpblR5cGVcIikgfHwgaXNWaWV3cG9ydCAmJiBcImZpeGVkXCIpID09PSBcImZpeGVkXCIsXG4gICAgICAgIGNhbGxiYWNrcyA9IFt2YXJzLm9uRW50ZXIsIHZhcnMub25MZWF2ZSwgdmFycy5vbkVudGVyQmFjaywgdmFycy5vbkxlYXZlQmFja10sXG4gICAgICAgIHRvZ2dsZUFjdGlvbnMgPSBpc1RvZ2dsZSAmJiB2YXJzLnRvZ2dsZUFjdGlvbnMuc3BsaXQoXCIgXCIpLFxuICAgICAgICBtYXJrZXJzID0gXCJtYXJrZXJzXCIgaW4gdmFycyA/IHZhcnMubWFya2VycyA6IF9kZWZhdWx0cy5tYXJrZXJzLFxuICAgICAgICBib3JkZXJXaWR0aCA9IGlzVmlld3BvcnQgPyAwIDogcGFyc2VGbG9hdChfZ2V0Q29tcHV0ZWRTdHlsZShzY3JvbGxlcilbXCJib3JkZXJcIiArIGRpcmVjdGlvbi5wMiArIF9XaWR0aF0pIHx8IDAsXG4gICAgICAgIHNlbGYgPSB0aGlzLFxuICAgICAgICBvblJlZnJlc2hJbml0ID0gdmFycy5vblJlZnJlc2hJbml0ICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB2YXJzLm9uUmVmcmVzaEluaXQoc2VsZik7XG4gICAgfSxcbiAgICAgICAgZ2V0U2Nyb2xsZXJTaXplID0gX2dldFNpemVGdW5jKHNjcm9sbGVyLCBpc1ZpZXdwb3J0LCBkaXJlY3Rpb24pLFxuICAgICAgICBnZXRTY3JvbGxlck9mZnNldHMgPSBfZ2V0T2Zmc2V0c0Z1bmMoc2Nyb2xsZXIsIGlzVmlld3BvcnQpLFxuICAgICAgICBsYXN0U25hcCA9IDAsXG4gICAgICAgIGxhc3RSZWZyZXNoID0gMCxcbiAgICAgICAgcHJldlByb2dyZXNzID0gMCxcbiAgICAgICAgc2Nyb2xsRnVuYyA9IF9nZXRTY3JvbGxGdW5jKHNjcm9sbGVyLCBkaXJlY3Rpb24pLFxuICAgICAgICB0d2VlblRvLFxuICAgICAgICBwaW5DYWNoZSxcbiAgICAgICAgc25hcEZ1bmMsXG4gICAgICAgIHNjcm9sbDEsXG4gICAgICAgIHNjcm9sbDIsXG4gICAgICAgIHN0YXJ0LFxuICAgICAgICBlbmQsXG4gICAgICAgIG1hcmtlclN0YXJ0LFxuICAgICAgICBtYXJrZXJFbmQsXG4gICAgICAgIG1hcmtlclN0YXJ0VHJpZ2dlcixcbiAgICAgICAgbWFya2VyRW5kVHJpZ2dlcixcbiAgICAgICAgbWFya2VyVmFycyxcbiAgICAgICAgZXhlY3V0aW5nT25SZWZyZXNoLFxuICAgICAgICBjaGFuZ2UsXG4gICAgICAgIHBpbk9yaWdpbmFsU3RhdGUsXG4gICAgICAgIHBpbkFjdGl2ZVN0YXRlLFxuICAgICAgICBwaW5TdGF0ZSxcbiAgICAgICAgc3BhY2VyLFxuICAgICAgICBvZmZzZXQsXG4gICAgICAgIHBpbkdldHRlcixcbiAgICAgICAgcGluU2V0dGVyLFxuICAgICAgICBwaW5TdGFydCxcbiAgICAgICAgcGluQ2hhbmdlLFxuICAgICAgICBzcGFjaW5nU3RhcnQsXG4gICAgICAgIHNwYWNlclN0YXRlLFxuICAgICAgICBtYXJrZXJTdGFydFNldHRlcixcbiAgICAgICAgcGluTW92ZXMsXG4gICAgICAgIG1hcmtlckVuZFNldHRlcixcbiAgICAgICAgY3MsXG4gICAgICAgIHNuYXAxLFxuICAgICAgICBzbmFwMixcbiAgICAgICAgc2NydWJUd2VlbixcbiAgICAgICAgc2NydWJTbW9vdGgsXG4gICAgICAgIHNuYXBEdXJDbGFtcCxcbiAgICAgICAgc25hcERlbGF5ZWRDYWxsLFxuICAgICAgICBwcmV2U2Nyb2xsLFxuICAgICAgICBwcmV2QW5pbVByb2dyZXNzLFxuICAgICAgICBjYU1hcmtlclNldHRlcixcbiAgICAgICAgY3VzdG9tUmV2ZXJ0UmV0dXJuOyAvLyBmb3IgdGhlIHNha2Ugb2YgZWZmaWNpZW5jeSwgX3N0YXJ0Q2xhbXAvX2VuZENsYW1wIHNlcnZlIGxpa2UgYSB0cnV0aHkgdmFsdWUgaW5kaWNhdGluZyB0aGF0IGNsYW1waW5nIHdhcyBlbmFibGVkIG9uIHRoZSBzdGFydC9lbmQsIGFuZCBBTFNPIHN0b3JlIHRoZSBhY3R1YWwgcHJlLWNsYW1wZWQgbnVtZXJpYyB2YWx1ZS4gV2UgdGFwIGludG8gdGhhdCBpbiBTY3JvbGxTbW9vdGhlciBmb3Igc3BlZWQgZWZmZWN0cy4gU28gZm9yIGV4YW1wbGUsIGlmIHN0YXJ0PVwiY2xhbXAodG9wIGJvdHRvbSlcIiByZXN1bHRzIGluIGEgc3RhcnQgb2YgLTEwMCBuYXR1cmFsbHksIGl0IHdvdWxkIGdldCBjbGFtcGVkIHRvIDAgYnV0IC0xMDAgd291bGQgYmUgc3RvcmVkIGluIF9zdGFydENsYW1wLlxuXG5cbiAgICBzZWxmLl9zdGFydENsYW1wID0gc2VsZi5fZW5kQ2xhbXAgPSBmYWxzZTtcbiAgICBzZWxmLl9kaXIgPSBkaXJlY3Rpb247XG4gICAgYW50aWNpcGF0ZVBpbiAqPSA0NTtcbiAgICBzZWxmLnNjcm9sbGVyID0gc2Nyb2xsZXI7XG4gICAgc2VsZi5zY3JvbGwgPSBjb250YWluZXJBbmltYXRpb24gPyBjb250YWluZXJBbmltYXRpb24udGltZS5iaW5kKGNvbnRhaW5lckFuaW1hdGlvbikgOiBzY3JvbGxGdW5jO1xuICAgIHNjcm9sbDEgPSBzY3JvbGxGdW5jKCk7XG4gICAgX2lzUmV2ZXJ0ZWQgJiYgc2Nyb2xsRnVuYy5yZWMgPT0gbnVsbCAmJiAoc2Nyb2xsRnVuYy5yZWMgPSBzY3JvbGwxKTsgLy8gaWYgdGhpcyBzY3JvbGxlciB3YXMgZmlyc3QgZGlzY292ZXJlZCB3aGlsZSBtYXRjaE1lZGlhIHdhcyByZWNyZWF0aW5nIGNvbnRleHRzLCBpdCBtaXNzZWQgdGhlIGluaXRpYWwgc2Nyb2xsLXBvc2l0aW9uIHJlY29yZGluZ1xuXG4gICAgc2VsZi52YXJzID0gdmFycztcbiAgICBhbmltYXRpb24gPSBhbmltYXRpb24gfHwgdmFycy5hbmltYXRpb247XG5cbiAgICBpZiAoXCJyZWZyZXNoUHJpb3JpdHlcIiBpbiB2YXJzKSB7XG4gICAgICBfc29ydCA9IDE7XG4gICAgICB2YXJzLnJlZnJlc2hQcmlvcml0eSA9PT0gLTk5OTkgJiYgKF9wcmltYXJ5ID0gc2VsZik7IC8vIHVzZWQgYnkgU2Nyb2xsU21vb3RoZXJcbiAgICB9XG5cbiAgICBzY3JvbGxlckNhY2hlLnR3ZWVuU2Nyb2xsID0gc2Nyb2xsZXJDYWNoZS50d2VlblNjcm9sbCB8fCB7XG4gICAgICB0b3A6IF9nZXRUd2VlbkNyZWF0b3Ioc2Nyb2xsZXIsIF92ZXJ0aWNhbCksXG4gICAgICBsZWZ0OiBfZ2V0VHdlZW5DcmVhdG9yKHNjcm9sbGVyLCBfaG9yaXpvbnRhbClcbiAgICB9O1xuICAgIHNlbGYudHdlZW5UbyA9IHR3ZWVuVG8gPSBzY3JvbGxlckNhY2hlLnR3ZWVuU2Nyb2xsW2RpcmVjdGlvbi5wXTtcblxuICAgIHNlbGYuc2NydWJEdXJhdGlvbiA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgc2NydWJTbW9vdGggPSBfaXNOdW1iZXIodmFsdWUpICYmIHZhbHVlO1xuXG4gICAgICBpZiAoIXNjcnViU21vb3RoKSB7XG4gICAgICAgIHNjcnViVHdlZW4gJiYgc2NydWJUd2Vlbi5wcm9ncmVzcygxKS5raWxsKCk7XG4gICAgICAgIHNjcnViVHdlZW4gPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2NydWJUd2VlbiA/IHNjcnViVHdlZW4uZHVyYXRpb24odmFsdWUpIDogc2NydWJUd2VlbiA9IGdzYXAudG8oYW5pbWF0aW9uLCB7XG4gICAgICAgICAgZWFzZTogXCJleHBvXCIsXG4gICAgICAgICAgdG90YWxQcm9ncmVzczogXCIrPTBcIixcbiAgICAgICAgICBpbmhlcml0OiBmYWxzZSxcbiAgICAgICAgICBkdXJhdGlvbjogc2NydWJTbW9vdGgsXG4gICAgICAgICAgcGF1c2VkOiB0cnVlLFxuICAgICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uIG9uQ29tcGxldGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gb25TY3J1YkNvbXBsZXRlICYmIG9uU2NydWJDb21wbGV0ZShzZWxmKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoYW5pbWF0aW9uKSB7XG4gICAgICBhbmltYXRpb24udmFycy5sYXp5ID0gZmFsc2U7XG4gICAgICBhbmltYXRpb24uX2luaXR0ZWQgJiYgIXNlbGYuaXNSZXZlcnRlZCB8fCBhbmltYXRpb24udmFycy5pbW1lZGlhdGVSZW5kZXIgIT09IGZhbHNlICYmIHZhcnMuaW1tZWRpYXRlUmVuZGVyICE9PSBmYWxzZSAmJiBhbmltYXRpb24uZHVyYXRpb24oKSAmJiBhbmltYXRpb24ucmVuZGVyKDAsIHRydWUsIHRydWUpOyAvLyBzcGVjaWFsIGNhc2U6IGlmIHRoaXMgU2Nyb2xsVHJpZ2dlciBnZXRzIHJlLWluaXR0ZWQsIGEgZnJvbSgpIHR3ZWVuIHdpdGggYSBzdGFnZ2VyIGNvdWxkIGdldCBpbml0dGVkIGluaXRpYWxseSBhbmQgdGhlbiByZXZlcnRlZCBvbiB0aGUgcmUtaW5pdCB3aGljaCBtZWFucyBpdCdsbCBuZWVkIHRvIGdldCByZW5kZXJlZCBhZ2FpbiBoZXJlIHRvIHByb3Blcmx5IGRpc3BsYXkgdGhpbmdzLiBPdGhlcndpc2UsIFNlZSBodHRwczovL2dzYXAuY29tL2ZvcnVtcy90b3BpYy8zNjc3Ny1zY3JvbGxzbW9vdGhlci1zcGxpdHRleHQtbmV4dGpzLyBhbmQgaHR0cHM6Ly9jb2RlcGVuLmlvL0dyZWVuU29jay9wZW4vZVlQeVBwZD9lZGl0b3JzPTAwMTBcblxuICAgICAgc2VsZi5hbmltYXRpb24gPSBhbmltYXRpb24ucGF1c2UoKTtcbiAgICAgIGFuaW1hdGlvbi5zY3JvbGxUcmlnZ2VyID0gc2VsZjtcbiAgICAgIHNlbGYuc2NydWJEdXJhdGlvbihzY3J1Yik7XG4gICAgICBzbmFwMSA9IDA7XG4gICAgICBpZCB8fCAoaWQgPSBhbmltYXRpb24udmFycy5pZCk7XG4gICAgfVxuXG4gICAgaWYgKHNuYXApIHtcbiAgICAgIC8vIFRPRE86IHBvdGVudGlhbCBpZGVhOiB1c2UgbGVnaXRpbWF0ZSBDU1Mgc2Nyb2xsIHNuYXBwaW5nIGJ5IHB1c2hpbmcgaW52aXNpYmxlIGVsZW1lbnRzIGludG8gdGhlIERPTSB0aGF0IHNlcnZlIGFzIHNuYXAgcG9zaXRpb25zLCBhbmQgdG9nZ2xlIHRoZSBkb2N1bWVudC5zY3JvbGxpbmdFbGVtZW50LnN0eWxlLnNjcm9sbFNuYXBUeXBlIG9uVG9nZ2xlLiBTZWUgaHR0cHM6Ly9jb2RlcGVuLmlvL0dyZWVuU29jay9wZW4vSmpMcmdXTSBmb3IgYSBxdWljayBwcm9vZiBvZiBjb25jZXB0LlxuICAgICAgaWYgKCFfaXNPYmplY3Qoc25hcCkgfHwgc25hcC5wdXNoKSB7XG4gICAgICAgIHNuYXAgPSB7XG4gICAgICAgICAgc25hcFRvOiBzbmFwXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIFwic2Nyb2xsQmVoYXZpb3JcIiBpbiBfYm9keS5zdHlsZSAmJiBnc2FwLnNldChpc1ZpZXdwb3J0ID8gW19ib2R5LCBfZG9jRWxdIDogc2Nyb2xsZXIsIHtcbiAgICAgICAgc2Nyb2xsQmVoYXZpb3I6IFwiYXV0b1wiXG4gICAgICB9KTsgLy8gc21vb3RoIHNjcm9sbGluZyBkb2Vzbid0IHdvcmsgd2l0aCBzbmFwLlxuXG4gICAgICBfc2Nyb2xsZXJzLmZvckVhY2goZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgcmV0dXJuIF9pc0Z1bmN0aW9uKG8pICYmIG8udGFyZ2V0ID09PSAoaXNWaWV3cG9ydCA/IF9kb2Muc2Nyb2xsaW5nRWxlbWVudCB8fCBfZG9jRWwgOiBzY3JvbGxlcikgJiYgKG8uc21vb3RoID0gZmFsc2UpO1xuICAgICAgfSk7IC8vIG5vdGU6IHNldCBzbW9vdGggdG8gZmFsc2Ugb24gYm90aCB0aGUgdmVydGljYWwgYW5kIGhvcml6b250YWwgc2Nyb2xsIGdldHRlcnMvc2V0dGVyc1xuXG5cbiAgICAgIHNuYXBGdW5jID0gX2lzRnVuY3Rpb24oc25hcC5zbmFwVG8pID8gc25hcC5zbmFwVG8gOiBzbmFwLnNuYXBUbyA9PT0gXCJsYWJlbHNcIiA/IF9nZXRDbG9zZXN0TGFiZWwoYW5pbWF0aW9uKSA6IHNuYXAuc25hcFRvID09PSBcImxhYmVsc0RpcmVjdGlvbmFsXCIgPyBfZ2V0TGFiZWxBdERpcmVjdGlvbihhbmltYXRpb24pIDogc25hcC5kaXJlY3Rpb25hbCAhPT0gZmFsc2UgPyBmdW5jdGlvbiAodmFsdWUsIHN0KSB7XG4gICAgICAgIHJldHVybiBfc25hcERpcmVjdGlvbmFsKHNuYXAuc25hcFRvKSh2YWx1ZSwgX2dldFRpbWUoKSAtIGxhc3RSZWZyZXNoIDwgNTAwID8gMCA6IHN0LmRpcmVjdGlvbik7XG4gICAgICB9IDogZ3NhcC51dGlscy5zbmFwKHNuYXAuc25hcFRvKTtcbiAgICAgIHNuYXBEdXJDbGFtcCA9IHNuYXAuZHVyYXRpb24gfHwge1xuICAgICAgICBtaW46IDAuMSxcbiAgICAgICAgbWF4OiAyXG4gICAgICB9O1xuICAgICAgc25hcER1ckNsYW1wID0gX2lzT2JqZWN0KHNuYXBEdXJDbGFtcCkgPyBfY2xhbXAoc25hcER1ckNsYW1wLm1pbiwgc25hcER1ckNsYW1wLm1heCkgOiBfY2xhbXAoc25hcER1ckNsYW1wLCBzbmFwRHVyQ2xhbXApO1xuICAgICAgc25hcERlbGF5ZWRDYWxsID0gZ3NhcC5kZWxheWVkQ2FsbChzbmFwLmRlbGF5IHx8IHNjcnViU21vb3RoIC8gMiB8fCAwLjEsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNjcm9sbCA9IHNjcm9sbEZ1bmMoKSxcbiAgICAgICAgICAgIHJlZnJlc2hlZFJlY2VudGx5ID0gX2dldFRpbWUoKSAtIGxhc3RSZWZyZXNoIDwgNTAwLFxuICAgICAgICAgICAgdHdlZW4gPSB0d2VlblRvLnR3ZWVuO1xuXG4gICAgICAgIGlmICgocmVmcmVzaGVkUmVjZW50bHkgfHwgTWF0aC5hYnMoc2VsZi5nZXRWZWxvY2l0eSgpKSA8IDEwKSAmJiAhdHdlZW4gJiYgIV9wb2ludGVySXNEb3duICYmIGxhc3RTbmFwICE9PSBzY3JvbGwpIHtcbiAgICAgICAgICB2YXIgcHJvZ3Jlc3MgPSAoc2Nyb2xsIC0gc3RhcnQpIC8gY2hhbmdlLFxuICAgICAgICAgICAgICB0b3RhbFByb2dyZXNzID0gYW5pbWF0aW9uICYmICFpc1RvZ2dsZSA/IGFuaW1hdGlvbi50b3RhbFByb2dyZXNzKCkgOiBwcm9ncmVzcyxcbiAgICAgICAgICAgICAgdmVsb2NpdHkgPSByZWZyZXNoZWRSZWNlbnRseSA/IDAgOiAodG90YWxQcm9ncmVzcyAtIHNuYXAyKSAvIChfZ2V0VGltZSgpIC0gX3RpbWUyKSAqIDEwMDAgfHwgMCxcbiAgICAgICAgICAgICAgY2hhbmdlMSA9IGdzYXAudXRpbHMuY2xhbXAoLXByb2dyZXNzLCAxIC0gcHJvZ3Jlc3MsIF9hYnModmVsb2NpdHkgLyAyKSAqIHZlbG9jaXR5IC8gMC4xODUpLFxuICAgICAgICAgICAgICBuYXR1cmFsRW5kID0gcHJvZ3Jlc3MgKyAoc25hcC5pbmVydGlhID09PSBmYWxzZSA/IDAgOiBjaGFuZ2UxKSxcbiAgICAgICAgICAgICAgZW5kVmFsdWUsXG4gICAgICAgICAgICAgIGVuZFNjcm9sbCxcbiAgICAgICAgICAgICAgX3NuYXAgPSBzbmFwLFxuICAgICAgICAgICAgICBvblN0YXJ0ID0gX3NuYXAub25TdGFydCxcbiAgICAgICAgICAgICAgX29uSW50ZXJydXB0ID0gX3NuYXAub25JbnRlcnJ1cHQsXG4gICAgICAgICAgICAgIF9vbkNvbXBsZXRlID0gX3NuYXAub25Db21wbGV0ZTtcbiAgICAgICAgICBlbmRWYWx1ZSA9IHNuYXBGdW5jKG5hdHVyYWxFbmQsIHNlbGYpO1xuICAgICAgICAgIF9pc051bWJlcihlbmRWYWx1ZSkgfHwgKGVuZFZhbHVlID0gbmF0dXJhbEVuZCk7IC8vIGluIGNhc2UgdGhlIGZ1bmN0aW9uIGRpZG4ndCByZXR1cm4gYSBudW1iZXIsIGZhbGwgYmFjayB0byB1c2luZyB0aGUgbmF0dXJhbEVuZFxuXG4gICAgICAgICAgZW5kU2Nyb2xsID0gTWF0aC5tYXgoMCwgTWF0aC5yb3VuZChzdGFydCArIGVuZFZhbHVlICogY2hhbmdlKSk7XG5cbiAgICAgICAgICBpZiAoc2Nyb2xsIDw9IGVuZCAmJiBzY3JvbGwgPj0gc3RhcnQgJiYgZW5kU2Nyb2xsICE9PSBzY3JvbGwpIHtcbiAgICAgICAgICAgIGlmICh0d2VlbiAmJiAhdHdlZW4uX2luaXR0ZWQgJiYgdHdlZW4uZGF0YSA8PSBfYWJzKGVuZFNjcm9sbCAtIHNjcm9sbCkpIHtcbiAgICAgICAgICAgICAgLy8gdGhlcmUncyBhbiBvdmVybGFwcGluZyBzbmFwISBTbyB3ZSBtdXN0IGZpZ3VyZSBvdXQgd2hpY2ggb25lIGlzIGNsb3NlciBhbmQgbGV0IHRoYXQgdHdlZW4gbGl2ZS5cbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc25hcC5pbmVydGlhID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICBjaGFuZ2UxID0gZW5kVmFsdWUgLSBwcm9ncmVzcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHdlZW5UbyhlbmRTY3JvbGwsIHtcbiAgICAgICAgICAgICAgZHVyYXRpb246IHNuYXBEdXJDbGFtcChfYWJzKE1hdGgubWF4KF9hYnMobmF0dXJhbEVuZCAtIHRvdGFsUHJvZ3Jlc3MpLCBfYWJzKGVuZFZhbHVlIC0gdG90YWxQcm9ncmVzcykpICogMC4xODUgLyB2ZWxvY2l0eSAvIDAuMDUgfHwgMCkpLFxuICAgICAgICAgICAgICBlYXNlOiBzbmFwLmVhc2UgfHwgXCJwb3dlcjNcIixcbiAgICAgICAgICAgICAgZGF0YTogX2FicyhlbmRTY3JvbGwgLSBzY3JvbGwpLFxuICAgICAgICAgICAgICAvLyByZWNvcmQgdGhlIGRpc3RhbmNlIHNvIHRoYXQgaWYgYW5vdGhlciBzbmFwIHR3ZWVuIG9jY3VycyAoY29uZmxpY3QpIHdlIGNhbiBwcmlvcml0aXplIHRoZSBjbG9zZXN0IHNuYXAuXG4gICAgICAgICAgICAgIG9uSW50ZXJydXB0OiBmdW5jdGlvbiBvbkludGVycnVwdCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc25hcERlbGF5ZWRDYWxsLnJlc3RhcnQodHJ1ZSkgJiYgX29uSW50ZXJydXB0ICYmIF9jYWxsYmFjayhzZWxmLCBfb25JbnRlcnJ1cHQpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbiBvbkNvbXBsZXRlKCkge1xuICAgICAgICAgICAgICAgIHNlbGYudXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgbGFzdFNuYXAgPSBzY3JvbGxGdW5jKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoYW5pbWF0aW9uICYmICFpc1RvZ2dsZSkge1xuICAgICAgICAgICAgICAgICAgLy8gdGhlIHJlc29sdXRpb24gb2YgdGhlIHNjcm9sbGJhciBpcyBsaW1pdGVkLCBzbyB3ZSBzaG91bGQgY29ycmVjdCB0aGUgc2NydWJiZWQgYW5pbWF0aW9uJ3MgcGxheWhlYWQgYXQgdGhlIGVuZCB0byBtYXRjaCBFWEFDVExZIHdoZXJlIGl0IHdhcyBzdXBwb3NlZCB0byBzbmFwXG4gICAgICAgICAgICAgICAgICBzY3J1YlR3ZWVuID8gc2NydWJUd2Vlbi5yZXNldFRvKFwidG90YWxQcm9ncmVzc1wiLCBlbmRWYWx1ZSwgYW5pbWF0aW9uLl90VGltZSAvIGFuaW1hdGlvbi5fdER1cikgOiBhbmltYXRpb24ucHJvZ3Jlc3MoZW5kVmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNuYXAxID0gc25hcDIgPSBhbmltYXRpb24gJiYgIWlzVG9nZ2xlID8gYW5pbWF0aW9uLnRvdGFsUHJvZ3Jlc3MoKSA6IHNlbGYucHJvZ3Jlc3M7XG4gICAgICAgICAgICAgICAgb25TbmFwQ29tcGxldGUgJiYgb25TbmFwQ29tcGxldGUoc2VsZik7XG4gICAgICAgICAgICAgICAgX29uQ29tcGxldGUgJiYgX2NhbGxiYWNrKHNlbGYsIF9vbkNvbXBsZXRlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgc2Nyb2xsLCBjaGFuZ2UxICogY2hhbmdlLCBlbmRTY3JvbGwgLSBzY3JvbGwgLSBjaGFuZ2UxICogY2hhbmdlKTtcbiAgICAgICAgICAgIG9uU3RhcnQgJiYgX2NhbGxiYWNrKHNlbGYsIG9uU3RhcnQsIHR3ZWVuVG8udHdlZW4pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChzZWxmLmlzQWN0aXZlICYmIGxhc3RTbmFwICE9PSBzY3JvbGwpIHtcbiAgICAgICAgICBzbmFwRGVsYXllZENhbGwucmVzdGFydCh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfSkucGF1c2UoKTtcbiAgICB9XG5cbiAgICBpZCAmJiAoX2lkc1tpZF0gPSBzZWxmKTtcbiAgICB0cmlnZ2VyID0gc2VsZi50cmlnZ2VyID0gX2dldFRhcmdldCh0cmlnZ2VyIHx8IHBpbiAhPT0gdHJ1ZSAmJiBwaW4pOyAvLyBpZiBhIHRyaWdnZXIgaGFzIHNvbWUga2luZCBvZiBzY3JvbGwtcmVsYXRlZCBlZmZlY3QgYXBwbGllZCB0aGF0IGNvdWxkIGNvbnRhbWluYXRlIHRoZSBcInlcIiBvciBcInhcIiBwb3NpdGlvbiAobGlrZSBhIFNjcm9sbFNtb290aGVyIGVmZmVjdCksIHdlIG5lZWRlZCBhIHdheSB0byB0ZW1wb3JhcmlseSByZXZlcnQgaXQsIHNvIHdlIHVzZSB0aGUgc3RSZXZlcnQgcHJvcGVydHkgb2YgdGhlIGdzQ2FjaGUuIEl0IGNhbiByZXR1cm4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHdlJ2xsIGNhbGwgYXQgdGhlIGVuZCBzbyBpdCBjYW4gcmV0dXJuIHRvIGl0cyBub3JtYWwgc3RhdGUuXG5cbiAgICBjdXN0b21SZXZlcnRSZXR1cm4gPSB0cmlnZ2VyICYmIHRyaWdnZXIuX2dzYXAgJiYgdHJpZ2dlci5fZ3NhcC5zdFJldmVydDtcbiAgICBjdXN0b21SZXZlcnRSZXR1cm4gJiYgKGN1c3RvbVJldmVydFJldHVybiA9IGN1c3RvbVJldmVydFJldHVybihzZWxmKSk7XG4gICAgcGluID0gcGluID09PSB0cnVlID8gdHJpZ2dlciA6IF9nZXRUYXJnZXQocGluKTtcbiAgICBfaXNTdHJpbmcodG9nZ2xlQ2xhc3MpICYmICh0b2dnbGVDbGFzcyA9IHtcbiAgICAgIHRhcmdldHM6IHRyaWdnZXIsXG4gICAgICBjbGFzc05hbWU6IHRvZ2dsZUNsYXNzXG4gICAgfSk7XG5cbiAgICBpZiAocGluKSB7XG4gICAgICBwaW5TcGFjaW5nID09PSBmYWxzZSB8fCBwaW5TcGFjaW5nID09PSBfbWFyZ2luIHx8IChwaW5TcGFjaW5nID0gIXBpblNwYWNpbmcgJiYgcGluLnBhcmVudE5vZGUgJiYgcGluLnBhcmVudE5vZGUuc3R5bGUgJiYgX2dldENvbXB1dGVkU3R5bGUocGluLnBhcmVudE5vZGUpLmRpc3BsYXkgPT09IFwiZmxleFwiID8gZmFsc2UgOiBfcGFkZGluZyk7IC8vIGlmIHRoZSBwYXJlbnQgaXMgZGlzcGxheTogZmxleCwgZG9uJ3QgYXBwbHkgcGluU3BhY2luZyBieSBkZWZhdWx0LiBXZSBzaG91bGQgY2hlY2sgdGhhdCBwaW4ucGFyZW50Tm9kZSBpcyBhbiBlbGVtZW50IChub3Qgc2hhZG93IGRvbSB3aW5kb3cpXG5cbiAgICAgIHNlbGYucGluID0gcGluO1xuICAgICAgcGluQ2FjaGUgPSBnc2FwLmNvcmUuZ2V0Q2FjaGUocGluKTtcblxuICAgICAgaWYgKCFwaW5DYWNoZS5zcGFjZXIpIHtcbiAgICAgICAgLy8gcmVjb3JkIHRoZSBzcGFjZXIgYW5kIHBpbk9yaWdpbmFsU3RhdGUgb24gdGhlIGNhY2hlIGluIGNhc2Ugc29tZW9uZSB0cmllcyBwaW5uaW5nIHRoZSBzYW1lIGVsZW1lbnQgd2l0aCBNVUxUSVBMRSBTY3JvbGxUcmlnZ2VycyAtIHdlIGRvbid0IHdhbnQgdG8gaGF2ZSBtdWx0aXBsZSBzcGFjZXJzIG9yIHJlY29yZCB0aGUgXCJvcmlnaW5hbFwiIHBpbiBzdGF0ZSBhZnRlciBpdCBoYXMgYWxyZWFkeSBiZWVuIGFmZmVjdGVkIGJ5IGFub3RoZXIgU2Nyb2xsVHJpZ2dlci5cbiAgICAgICAgaWYgKHBpblNwYWNlcikge1xuICAgICAgICAgIHBpblNwYWNlciA9IF9nZXRUYXJnZXQocGluU3BhY2VyKTtcbiAgICAgICAgICBwaW5TcGFjZXIgJiYgIXBpblNwYWNlci5ub2RlVHlwZSAmJiAocGluU3BhY2VyID0gcGluU3BhY2VyLmN1cnJlbnQgfHwgcGluU3BhY2VyLm5hdGl2ZUVsZW1lbnQpOyAvLyBmb3IgUmVhY3QgJiBBbmd1bGFyXG5cbiAgICAgICAgICBwaW5DYWNoZS5zcGFjZXJJc05hdGl2ZSA9ICEhcGluU3BhY2VyO1xuICAgICAgICAgIHBpblNwYWNlciAmJiAocGluQ2FjaGUuc3BhY2VyU3RhdGUgPSBfZ2V0U3RhdGUocGluU3BhY2VyKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwaW5DYWNoZS5zcGFjZXIgPSBzcGFjZXIgPSBwaW5TcGFjZXIgfHwgX2RvYy5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBzcGFjZXIuY2xhc3NMaXN0LmFkZChcInBpbi1zcGFjZXJcIik7XG4gICAgICAgIGlkICYmIHNwYWNlci5jbGFzc0xpc3QuYWRkKFwicGluLXNwYWNlci1cIiArIGlkKTtcbiAgICAgICAgcGluQ2FjaGUucGluU3RhdGUgPSBwaW5PcmlnaW5hbFN0YXRlID0gX2dldFN0YXRlKHBpbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwaW5PcmlnaW5hbFN0YXRlID0gcGluQ2FjaGUucGluU3RhdGU7XG4gICAgICB9XG5cbiAgICAgIHZhcnMuZm9yY2UzRCAhPT0gZmFsc2UgJiYgZ3NhcC5zZXQocGluLCB7XG4gICAgICAgIGZvcmNlM0Q6IHRydWVcbiAgICAgIH0pO1xuICAgICAgc2VsZi5zcGFjZXIgPSBzcGFjZXIgPSBwaW5DYWNoZS5zcGFjZXI7XG4gICAgICBjcyA9IF9nZXRDb21wdXRlZFN0eWxlKHBpbik7XG4gICAgICBzcGFjaW5nU3RhcnQgPSBjc1twaW5TcGFjaW5nICsgZGlyZWN0aW9uLm9zMl07XG4gICAgICBwaW5HZXR0ZXIgPSBnc2FwLmdldFByb3BlcnR5KHBpbik7XG4gICAgICBwaW5TZXR0ZXIgPSBnc2FwLnF1aWNrU2V0dGVyKHBpbiwgZGlyZWN0aW9uLmEsIF9weCk7IC8vIHBpbi5maXJzdENoaWxkICYmICFfbWF4U2Nyb2xsKHBpbiwgZGlyZWN0aW9uKSAmJiAocGluLnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIik7IC8vIHByb3RlY3RzIGZyb20gY29sbGFwc2luZyBtYXJnaW5zLCBidXQgY2FuIGhhdmUgdW5pbnRlbmRlZCBjb25zZXF1ZW5jZXMgYXMgZGVtb25zdHJhdGVkIGhlcmU6IGh0dHBzOi8vY29kZXBlbi5pby9HcmVlblNvY2svcGVuLzFlNDJjN2E3M2JmYTQwOWQyY2YxZTE4NGU3YTQyNDhkIHNvIGl0IHdhcyByZW1vdmVkIGluIGZhdm9yIG9mIGp1c3QgdGVsbGluZyBwZW9wbGUgdG8gc2V0IHVwIHRoZWlyIENTUyB0byBhdm9pZCB0aGUgY29sbGFwc2luZyBtYXJnaW5zIChvdmVyZmxvdzogaGlkZGVuIHwgYXV0byBpcyBqdXN0IG9uZSBvcHRpb24uIEFub3RoZXIgaXMgYm9yZGVyLXRvcDogMXB4IHNvbGlkIHRyYW5zcGFyZW50KS5cblxuICAgICAgX3N3YXBQaW5JbihwaW4sIHNwYWNlciwgY3MpO1xuXG4gICAgICBwaW5TdGF0ZSA9IF9nZXRTdGF0ZShwaW4pO1xuICAgIH1cblxuICAgIGlmIChtYXJrZXJzKSB7XG4gICAgICBtYXJrZXJWYXJzID0gX2lzT2JqZWN0KG1hcmtlcnMpID8gX3NldERlZmF1bHRzKG1hcmtlcnMsIF9tYXJrZXJEZWZhdWx0cykgOiBfbWFya2VyRGVmYXVsdHM7XG4gICAgICBtYXJrZXJTdGFydFRyaWdnZXIgPSBfY3JlYXRlTWFya2VyKFwic2Nyb2xsZXItc3RhcnRcIiwgaWQsIHNjcm9sbGVyLCBkaXJlY3Rpb24sIG1hcmtlclZhcnMsIDApO1xuICAgICAgbWFya2VyRW5kVHJpZ2dlciA9IF9jcmVhdGVNYXJrZXIoXCJzY3JvbGxlci1lbmRcIiwgaWQsIHNjcm9sbGVyLCBkaXJlY3Rpb24sIG1hcmtlclZhcnMsIDAsIG1hcmtlclN0YXJ0VHJpZ2dlcik7XG4gICAgICBvZmZzZXQgPSBtYXJrZXJTdGFydFRyaWdnZXJbXCJvZmZzZXRcIiArIGRpcmVjdGlvbi5vcC5kMl07XG5cbiAgICAgIHZhciBjb250ZW50ID0gX2dldFRhcmdldChfZ2V0UHJveHlQcm9wKHNjcm9sbGVyLCBcImNvbnRlbnRcIikgfHwgc2Nyb2xsZXIpO1xuXG4gICAgICBtYXJrZXJTdGFydCA9IHRoaXMubWFya2VyU3RhcnQgPSBfY3JlYXRlTWFya2VyKFwic3RhcnRcIiwgaWQsIGNvbnRlbnQsIGRpcmVjdGlvbiwgbWFya2VyVmFycywgb2Zmc2V0LCAwLCBjb250YWluZXJBbmltYXRpb24pO1xuICAgICAgbWFya2VyRW5kID0gdGhpcy5tYXJrZXJFbmQgPSBfY3JlYXRlTWFya2VyKFwiZW5kXCIsIGlkLCBjb250ZW50LCBkaXJlY3Rpb24sIG1hcmtlclZhcnMsIG9mZnNldCwgMCwgY29udGFpbmVyQW5pbWF0aW9uKTtcbiAgICAgIGNvbnRhaW5lckFuaW1hdGlvbiAmJiAoY2FNYXJrZXJTZXR0ZXIgPSBnc2FwLnF1aWNrU2V0dGVyKFttYXJrZXJTdGFydCwgbWFya2VyRW5kXSwgZGlyZWN0aW9uLmEsIF9weCkpO1xuXG4gICAgICBpZiAoIXVzZUZpeGVkUG9zaXRpb24gJiYgIShfcHJveGllcy5sZW5ndGggJiYgX2dldFByb3h5UHJvcChzY3JvbGxlciwgXCJmaXhlZE1hcmtlcnNcIikgPT09IHRydWUpKSB7XG4gICAgICAgIF9tYWtlUG9zaXRpb25hYmxlKGlzVmlld3BvcnQgPyBfYm9keSA6IHNjcm9sbGVyKTtcblxuICAgICAgICBnc2FwLnNldChbbWFya2VyU3RhcnRUcmlnZ2VyLCBtYXJrZXJFbmRUcmlnZ2VyXSwge1xuICAgICAgICAgIGZvcmNlM0Q6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIG1hcmtlclN0YXJ0U2V0dGVyID0gZ3NhcC5xdWlja1NldHRlcihtYXJrZXJTdGFydFRyaWdnZXIsIGRpcmVjdGlvbi5hLCBfcHgpO1xuICAgICAgICBtYXJrZXJFbmRTZXR0ZXIgPSBnc2FwLnF1aWNrU2V0dGVyKG1hcmtlckVuZFRyaWdnZXIsIGRpcmVjdGlvbi5hLCBfcHgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb250YWluZXJBbmltYXRpb24pIHtcbiAgICAgIHZhciBvbGRPblVwZGF0ZSA9IGNvbnRhaW5lckFuaW1hdGlvbi52YXJzLm9uVXBkYXRlLFxuICAgICAgICAgIG9sZFBhcmFtcyA9IGNvbnRhaW5lckFuaW1hdGlvbi52YXJzLm9uVXBkYXRlUGFyYW1zO1xuICAgICAgY29udGFpbmVyQW5pbWF0aW9uLmV2ZW50Q2FsbGJhY2soXCJvblVwZGF0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYudXBkYXRlKDAsIDAsIDEpO1xuICAgICAgICBvbGRPblVwZGF0ZSAmJiBvbGRPblVwZGF0ZS5hcHBseShjb250YWluZXJBbmltYXRpb24sIG9sZFBhcmFtcyB8fCBbXSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzZWxmLnByZXZpb3VzID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIF90cmlnZ2Vyc1tfdHJpZ2dlcnMuaW5kZXhPZihzZWxmKSAtIDFdO1xuICAgIH07XG5cbiAgICBzZWxmLm5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gX3RyaWdnZXJzW190cmlnZ2Vycy5pbmRleE9mKHNlbGYpICsgMV07XG4gICAgfTtcblxuICAgIHNlbGYucmV2ZXJ0ID0gZnVuY3Rpb24gKHJldmVydCwgdGVtcCkge1xuICAgICAgaWYgKCF0ZW1wKSB7XG4gICAgICAgIHJldHVybiBzZWxmLmtpbGwodHJ1ZSk7XG4gICAgICB9IC8vIGZvciBjb21wYXRpYmlsaXR5IHdpdGggZ3NhcC5jb250ZXh0KCkgYW5kIGdzYXAubWF0Y2hNZWRpYSgpIHdoaWNoIGNhbGwgcmV2ZXJ0KClcblxuXG4gICAgICB2YXIgciA9IHJldmVydCAhPT0gZmFsc2UgfHwgIXNlbGYuZW5hYmxlZCxcbiAgICAgICAgICBwcmV2UmVmcmVzaGluZyA9IF9yZWZyZXNoaW5nO1xuXG4gICAgICBpZiAociAhPT0gc2VsZi5pc1JldmVydGVkKSB7XG4gICAgICAgIGlmIChyKSB7XG4gICAgICAgICAgcHJldlNjcm9sbCA9IE1hdGgubWF4KHNjcm9sbEZ1bmMoKSwgc2VsZi5zY3JvbGwucmVjIHx8IDApOyAvLyByZWNvcmQgdGhlIHNjcm9sbCBzbyB3ZSBjYW4gcmV2ZXJ0IGxhdGVyIChyZXBvc2l0aW9uaW5nL3Bpbm5pbmcgdGhpbmdzIGNhbiBhZmZlY3Qgc2Nyb2xsIHBvc2l0aW9uKS4gSW4gdGhlIHN0YXRpYyByZWZyZXNoKCkgbWV0aG9kLCB3ZSBmaXJzdCByZWNvcmQgYWxsIHRoZSBzY3JvbGwgcG9zaXRpb25zIGFzIGEgcmVmZXJlbmNlLlxuXG4gICAgICAgICAgcHJldlByb2dyZXNzID0gc2VsZi5wcm9ncmVzcztcbiAgICAgICAgICBwcmV2QW5pbVByb2dyZXNzID0gYW5pbWF0aW9uICYmIGFuaW1hdGlvbi5wcm9ncmVzcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFya2VyU3RhcnQgJiYgW21hcmtlclN0YXJ0LCBtYXJrZXJFbmQsIG1hcmtlclN0YXJ0VHJpZ2dlciwgbWFya2VyRW5kVHJpZ2dlcl0uZm9yRWFjaChmdW5jdGlvbiAobSkge1xuICAgICAgICAgIHJldHVybiBtLnN0eWxlLmRpc3BsYXkgPSByID8gXCJub25lXCIgOiBcImJsb2NrXCI7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChyKSB7XG4gICAgICAgICAgX3JlZnJlc2hpbmcgPSBzZWxmO1xuICAgICAgICAgIHNlbGYudXBkYXRlKHIpOyAvLyBtYWtlIHN1cmUgdGhlIHBpbiBpcyBiYWNrIGluIGl0cyBvcmlnaW5hbCBwb3NpdGlvbiBzbyB0aGF0IGFsbCB0aGUgbWVhc3VyZW1lbnRzIGFyZSBjb3JyZWN0LiBkbyB0aGlzIEJFRk9SRSBzd2FwcGluZyB0aGUgcGluIG91dFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBpbiAmJiAoIXBpblJlcGFyZW50IHx8ICFzZWxmLmlzQWN0aXZlKSkge1xuICAgICAgICAgIGlmIChyKSB7XG4gICAgICAgICAgICBfc3dhcFBpbk91dChwaW4sIHNwYWNlciwgcGluT3JpZ2luYWxTdGF0ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9zd2FwUGluSW4ocGluLCBzcGFjZXIsIF9nZXRDb21wdXRlZFN0eWxlKHBpbiksIHNwYWNlclN0YXRlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByIHx8IHNlbGYudXBkYXRlKHIpOyAvLyB3aGVuIHdlJ3JlIHJlc3RvcmluZywgdGhlIHVwZGF0ZSBzaG91bGQgcnVuIEFGVEVSIHN3YXBwaW5nIHRoZSBwaW4gaW50byBpdHMgcGluLXNwYWNlci5cblxuICAgICAgICBfcmVmcmVzaGluZyA9IHByZXZSZWZyZXNoaW5nOyAvLyByZXN0b3JlLiBXZSBzZXQgaXQgdG8gdHJ1ZSBkdXJpbmcgdGhlIHVwZGF0ZSgpIHNvIHRoYXQgdGhpbmdzIGZpcmUgcHJvcGVybHkgaW4gdGhlcmUuXG5cbiAgICAgICAgc2VsZi5pc1JldmVydGVkID0gcjtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgc2VsZi5yZWZyZXNoID0gZnVuY3Rpb24gKHNvZnQsIGZvcmNlLCBwb3NpdGlvbiwgcGluT2Zmc2V0KSB7XG4gICAgICAvLyBwb3NpdGlvbiBpcyB0eXBpY2FsbHkgb25seSBkZWZpbmVkIGlmIGl0J3MgY29taW5nIGZyb20gc2V0UG9zaXRpb25zKCkgLSBpdCdzIGEgd2F5IHRvIHNraXAgdGhlIG5vcm1hbCBwYXJzaW5nLiBwaW5PZmZzZXQgaXMgYWxzbyBvbmx5IGZyb20gc2V0UG9zaXRpb25zKCkgYW5kIGlzIG1vc3RseSByZWxhdGVkIHRvIGZhbmN5IHN0dWZmIHdlIG5lZWQgdG8gZG8gaW4gU2Nyb2xsU21vb3RoZXIgd2l0aCBlZmZlY3RzXG4gICAgICBpZiAoKF9yZWZyZXNoaW5nIHx8ICFzZWxmLmVuYWJsZWQpICYmICFmb3JjZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChwaW4gJiYgc29mdCAmJiBfbGFzdFNjcm9sbFRpbWUpIHtcbiAgICAgICAgX2FkZExpc3RlbmVyKFNjcm9sbFRyaWdnZXIsIFwic2Nyb2xsRW5kXCIsIF9zb2Z0UmVmcmVzaCk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAhX3JlZnJlc2hpbmdBbGwgJiYgb25SZWZyZXNoSW5pdCAmJiBvblJlZnJlc2hJbml0KHNlbGYpO1xuICAgICAgX3JlZnJlc2hpbmcgPSBzZWxmO1xuXG4gICAgICBpZiAodHdlZW5Uby50d2VlbiAmJiAhcG9zaXRpb24pIHtcbiAgICAgICAgLy8gd2Ugc2tpcCB0aGlzIGlmIGEgcG9zaXRpb24gaXMgcGFzc2VkIGluIGJlY2F1c2UgdHlwaWNhbGx5IHRoYXQncyBmcm9tIC5zZXRQb3NpdGlvbnMoKSBhbmQgaXQncyBiZXN0IHRvIGFsbG93IGluLXByb2dyZXNzIHNuYXBwaW5nIHRvIGNvbnRpbnVlLlxuICAgICAgICB0d2VlblRvLnR3ZWVuLmtpbGwoKTtcbiAgICAgICAgdHdlZW5Uby50d2VlbiA9IDA7XG4gICAgICB9XG5cbiAgICAgIHNjcnViVHdlZW4gJiYgc2NydWJUd2Vlbi5wYXVzZSgpO1xuXG4gICAgICBpZiAoaW52YWxpZGF0ZU9uUmVmcmVzaCAmJiBhbmltYXRpb24pIHtcbiAgICAgICAgYW5pbWF0aW9uLnJldmVydCh7XG4gICAgICAgICAga2lsbDogZmFsc2VcbiAgICAgICAgfSkuaW52YWxpZGF0ZSgpO1xuICAgICAgICBhbmltYXRpb24uZ2V0Q2hpbGRyZW4gPyBhbmltYXRpb24uZ2V0Q2hpbGRyZW4odHJ1ZSwgdHJ1ZSwgZmFsc2UpLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICByZXR1cm4gdC52YXJzLmltbWVkaWF0ZVJlbmRlciAmJiB0LnJlbmRlcigwLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgfSkgOiBhbmltYXRpb24udmFycy5pbW1lZGlhdGVSZW5kZXIgJiYgYW5pbWF0aW9uLnJlbmRlcigwLCB0cnVlLCB0cnVlKTsgLy8gYW55IGZyb20oKSBvciBmcm9tVG8oKSB0d2VlbnMgc2hvdWxkIHJlbmRlciBpbW1lZGlhdGVseSAod2VsbCwgdW5sZXNzIHRoZXkgaGF2ZSBpbW1lZGlhdGVSZW5kZXI6IGZhbHNlKVxuICAgICAgfVxuXG4gICAgICBzZWxmLmlzUmV2ZXJ0ZWQgfHwgc2VsZi5yZXZlcnQodHJ1ZSwgdHJ1ZSk7XG4gICAgICBzZWxmLl9zdWJQaW5PZmZzZXQgPSBmYWxzZTsgLy8gd2UnbGwgc2V0IHRoaXMgdG8gdHJ1ZSBpbiB0aGUgc3ViLXBpbnMgaWYgd2UgZmluZCBhbnlcblxuICAgICAgdmFyIHNpemUgPSBnZXRTY3JvbGxlclNpemUoKSxcbiAgICAgICAgICBzY3JvbGxlckJvdW5kcyA9IGdldFNjcm9sbGVyT2Zmc2V0cygpLFxuICAgICAgICAgIG1heCA9IGNvbnRhaW5lckFuaW1hdGlvbiA/IGNvbnRhaW5lckFuaW1hdGlvbi5kdXJhdGlvbigpIDogX21heFNjcm9sbChzY3JvbGxlciwgZGlyZWN0aW9uKSxcbiAgICAgICAgICBpc0ZpcnN0UmVmcmVzaCA9IGNoYW5nZSA8PSAwLjAxIHx8ICFjaGFuZ2UsXG4gICAgICAgICAgb2Zmc2V0ID0gMCxcbiAgICAgICAgICBvdGhlclBpbk9mZnNldCA9IHBpbk9mZnNldCB8fCAwLFxuICAgICAgICAgIHBhcnNlZEVuZCA9IF9pc09iamVjdChwb3NpdGlvbikgPyBwb3NpdGlvbi5lbmQgOiB2YXJzLmVuZCxcbiAgICAgICAgICBwYXJzZWRFbmRUcmlnZ2VyID0gdmFycy5lbmRUcmlnZ2VyIHx8IHRyaWdnZXIsXG4gICAgICAgICAgcGFyc2VkU3RhcnQgPSBfaXNPYmplY3QocG9zaXRpb24pID8gcG9zaXRpb24uc3RhcnQgOiB2YXJzLnN0YXJ0IHx8ICh2YXJzLnN0YXJ0ID09PSAwIHx8ICF0cmlnZ2VyID8gMCA6IHBpbiA/IFwiMCAwXCIgOiBcIjAgMTAwJVwiKSxcbiAgICAgICAgICBwaW5uZWRDb250YWluZXIgPSBzZWxmLnBpbm5lZENvbnRhaW5lciA9IHZhcnMucGlubmVkQ29udGFpbmVyICYmIF9nZXRUYXJnZXQodmFycy5waW5uZWRDb250YWluZXIsIHNlbGYpLFxuICAgICAgICAgIHRyaWdnZXJJbmRleCA9IHRyaWdnZXIgJiYgTWF0aC5tYXgoMCwgX3RyaWdnZXJzLmluZGV4T2Yoc2VsZikpIHx8IDAsXG4gICAgICAgICAgaSA9IHRyaWdnZXJJbmRleCxcbiAgICAgICAgICBjcyxcbiAgICAgICAgICBib3VuZHMsXG4gICAgICAgICAgc2Nyb2xsLFxuICAgICAgICAgIGlzVmVydGljYWwsXG4gICAgICAgICAgb3ZlcnJpZGUsXG4gICAgICAgICAgY3VyVHJpZ2dlcixcbiAgICAgICAgICBjdXJQaW4sXG4gICAgICAgICAgb3Bwb3NpdGVTY3JvbGwsXG4gICAgICAgICAgaW5pdHRlZCxcbiAgICAgICAgICByZXZlcnRlZFBpbnMsXG4gICAgICAgICAgZm9yY2VkT3ZlcmZsb3csXG4gICAgICAgICAgbWFya2VyU3RhcnRPZmZzZXQsXG4gICAgICAgICAgbWFya2VyRW5kT2Zmc2V0O1xuXG4gICAgICBpZiAobWFya2VycyAmJiBfaXNPYmplY3QocG9zaXRpb24pKSB7XG4gICAgICAgIC8vIGlmIHdlIGFsdGVyIHRoZSBzdGFydC9lbmQgcG9zaXRpb25zIHdpdGggLnNldFBvc2l0aW9ucygpLCBpdCBnZW5lcmFsbHkgZmVlZHMgaW4gYWJzb2x1dGUgTlVNQkVSUyB3aGljaCBkb24ndCBjb252ZXkgaW5mb3JtYXRpb24gYWJvdXQgd2hlcmUgdG8gbGluZSB1cCB0aGUgbWFya2Vycywgc28gdG8ga2VlcCBpdCBpbnR1aXRpdmUsIHdlIHJlY29yZCBob3cgZmFyIHRoZSB0cmlnZ2VyIHBvc2l0aW9ucyBzaGlmdCBhZnRlciBhcHBseWluZyB0aGUgbmV3IG51bWJlcnMgYW5kIHRoZW4gb2Zmc2V0IGJ5IHRoYXQgbXVjaCBpbiB0aGUgb3Bwb3NpdGUgZGlyZWN0aW9uLiBXZSBkbyB0aGUgc2FtZSB0byB0aGUgYXNzb2NpYXRlZCB0cmlnZ2VyIG1hcmtlcnMgdG9vIG9mIGNvdXJzZS5cbiAgICAgICAgbWFya2VyU3RhcnRPZmZzZXQgPSBnc2FwLmdldFByb3BlcnR5KG1hcmtlclN0YXJ0VHJpZ2dlciwgZGlyZWN0aW9uLnApO1xuICAgICAgICBtYXJrZXJFbmRPZmZzZXQgPSBnc2FwLmdldFByb3BlcnR5KG1hcmtlckVuZFRyaWdnZXIsIGRpcmVjdGlvbi5wKTtcbiAgICAgIH1cblxuICAgICAgd2hpbGUgKGktLSA+IDApIHtcbiAgICAgICAgLy8gdXNlciBtaWdodCB0cnkgdG8gcGluIHRoZSBzYW1lIGVsZW1lbnQgbW9yZSB0aGFuIG9uY2UsIHNvIHdlIG11c3QgZmluZCBhbnkgcHJpb3IgdHJpZ2dlcnMgd2l0aCB0aGUgc2FtZSBwaW4sIHJldmVydCB0aGVtLCBhbmQgZGV0ZXJtaW5lIGhvdyBsb25nIHRoZXkncmUgcGlubmluZyBzbyB0aGF0IHdlIGNhbiBvZmZzZXQgdGhpbmdzIGFwcHJvcHJpYXRlbHkuIE1ha2Ugc3VyZSB3ZSByZXZlcnQgZnJvbSBsYXN0IHRvIGZpcnN0IHNvIHRoYXQgdGhpbmdzIFwicmV3aW5kXCIgcHJvcGVybHkuXG4gICAgICAgIGN1clRyaWdnZXIgPSBfdHJpZ2dlcnNbaV07XG4gICAgICAgIGN1clRyaWdnZXIuZW5kIHx8IGN1clRyaWdnZXIucmVmcmVzaCgwLCAxKSB8fCAoX3JlZnJlc2hpbmcgPSBzZWxmKTsgLy8gaWYgaXQncyBhIHRpbWVsaW5lLWJhc2VkIHRyaWdnZXIgdGhhdCBoYXNuJ3QgYmVlbiBmdWxseSBpbml0aWFsaXplZCB5ZXQgYmVjYXVzZSBpdCdzIHdhaXRpbmcgZm9yIDEgdGljaywganVzdCBmb3JjZSB0aGUgcmVmcmVzaCgpIGhlcmUsIG90aGVyd2lzZSBpZiBpdCBjb250YWlucyBhIHBpbiB0aGF0J3Mgc3VwcG9zZWQgdG8gYWZmZWN0IG90aGVyIFNjcm9sbFRyaWdnZXJzIGZ1cnRoZXIgZG93biB0aGUgcGFnZSwgdGhleSB3b24ndCBiZSBhZGp1c3RlZCBwcm9wZXJseS5cblxuICAgICAgICBjdXJQaW4gPSBjdXJUcmlnZ2VyLnBpbjtcblxuICAgICAgICBpZiAoY3VyUGluICYmIChjdXJQaW4gPT09IHRyaWdnZXIgfHwgY3VyUGluID09PSBwaW4gfHwgY3VyUGluID09PSBwaW5uZWRDb250YWluZXIpICYmICFjdXJUcmlnZ2VyLmlzUmV2ZXJ0ZWQpIHtcbiAgICAgICAgICByZXZlcnRlZFBpbnMgfHwgKHJldmVydGVkUGlucyA9IFtdKTtcbiAgICAgICAgICByZXZlcnRlZFBpbnMudW5zaGlmdChjdXJUcmlnZ2VyKTsgLy8gd2UnbGwgcmV2ZXJ0IGZyb20gZmlyc3QgdG8gbGFzdCB0byBtYWtlIHN1cmUgdGhpbmdzIHJlYWNoIHRoZWlyIGVuZCBzdGF0ZSBwcm9wZXJseVxuXG4gICAgICAgICAgY3VyVHJpZ2dlci5yZXZlcnQodHJ1ZSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3VyVHJpZ2dlciAhPT0gX3RyaWdnZXJzW2ldKSB7XG4gICAgICAgICAgLy8gaW4gY2FzZSBpdCBnb3QgcmVtb3ZlZC5cbiAgICAgICAgICB0cmlnZ2VySW5kZXgtLTtcbiAgICAgICAgICBpLS07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX2lzRnVuY3Rpb24ocGFyc2VkU3RhcnQpICYmIChwYXJzZWRTdGFydCA9IHBhcnNlZFN0YXJ0KHNlbGYpKTtcbiAgICAgIHBhcnNlZFN0YXJ0ID0gX3BhcnNlQ2xhbXAocGFyc2VkU3RhcnQsIFwic3RhcnRcIiwgc2VsZik7XG4gICAgICBzdGFydCA9IF9wYXJzZVBvc2l0aW9uKHBhcnNlZFN0YXJ0LCB0cmlnZ2VyLCBzaXplLCBkaXJlY3Rpb24sIHNjcm9sbEZ1bmMoKSwgbWFya2VyU3RhcnQsIG1hcmtlclN0YXJ0VHJpZ2dlciwgc2VsZiwgc2Nyb2xsZXJCb3VuZHMsIGJvcmRlcldpZHRoLCB1c2VGaXhlZFBvc2l0aW9uLCBtYXgsIGNvbnRhaW5lckFuaW1hdGlvbiwgc2VsZi5fc3RhcnRDbGFtcCAmJiBcIl9zdGFydENsYW1wXCIpIHx8IChwaW4gPyAtMC4wMDEgOiAwKTtcbiAgICAgIF9pc0Z1bmN0aW9uKHBhcnNlZEVuZCkgJiYgKHBhcnNlZEVuZCA9IHBhcnNlZEVuZChzZWxmKSk7XG5cbiAgICAgIGlmIChfaXNTdHJpbmcocGFyc2VkRW5kKSAmJiAhcGFyc2VkRW5kLmluZGV4T2YoXCIrPVwiKSkge1xuICAgICAgICBpZiAofnBhcnNlZEVuZC5pbmRleE9mKFwiIFwiKSkge1xuICAgICAgICAgIHBhcnNlZEVuZCA9IChfaXNTdHJpbmcocGFyc2VkU3RhcnQpID8gcGFyc2VkU3RhcnQuc3BsaXQoXCIgXCIpWzBdIDogXCJcIikgKyBwYXJzZWRFbmQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb2Zmc2V0ID0gX29mZnNldFRvUHgocGFyc2VkRW5kLnN1YnN0cigyKSwgc2l6ZSk7XG4gICAgICAgICAgcGFyc2VkRW5kID0gX2lzU3RyaW5nKHBhcnNlZFN0YXJ0KSA/IHBhcnNlZFN0YXJ0IDogKGNvbnRhaW5lckFuaW1hdGlvbiA/IGdzYXAudXRpbHMubWFwUmFuZ2UoMCwgY29udGFpbmVyQW5pbWF0aW9uLmR1cmF0aW9uKCksIGNvbnRhaW5lckFuaW1hdGlvbi5zY3JvbGxUcmlnZ2VyLnN0YXJ0LCBjb250YWluZXJBbmltYXRpb24uc2Nyb2xsVHJpZ2dlci5lbmQsIHN0YXJ0KSA6IHN0YXJ0KSArIG9mZnNldDsgLy8gX3BhcnNlUG9zaXRpb24gd29uJ3QgZmFjdG9yIGluIHRoZSBvZmZzZXQgaWYgdGhlIHN0YXJ0IGlzIGEgbnVtYmVyLCBzbyBkbyBpdCBoZXJlLlxuXG4gICAgICAgICAgcGFyc2VkRW5kVHJpZ2dlciA9IHRyaWdnZXI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcGFyc2VkRW5kID0gX3BhcnNlQ2xhbXAocGFyc2VkRW5kLCBcImVuZFwiLCBzZWxmKTtcbiAgICAgIGVuZCA9IE1hdGgubWF4KHN0YXJ0LCBfcGFyc2VQb3NpdGlvbihwYXJzZWRFbmQgfHwgKHBhcnNlZEVuZFRyaWdnZXIgPyBcIjEwMCUgMFwiIDogbWF4KSwgcGFyc2VkRW5kVHJpZ2dlciwgc2l6ZSwgZGlyZWN0aW9uLCBzY3JvbGxGdW5jKCkgKyBvZmZzZXQsIG1hcmtlckVuZCwgbWFya2VyRW5kVHJpZ2dlciwgc2VsZiwgc2Nyb2xsZXJCb3VuZHMsIGJvcmRlcldpZHRoLCB1c2VGaXhlZFBvc2l0aW9uLCBtYXgsIGNvbnRhaW5lckFuaW1hdGlvbiwgc2VsZi5fZW5kQ2xhbXAgJiYgXCJfZW5kQ2xhbXBcIikpIHx8IC0wLjAwMTtcbiAgICAgIG9mZnNldCA9IDA7XG4gICAgICBpID0gdHJpZ2dlckluZGV4O1xuXG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGN1clRyaWdnZXIgPSBfdHJpZ2dlcnNbaV0gfHwge307XG4gICAgICAgIGN1clBpbiA9IGN1clRyaWdnZXIucGluO1xuXG4gICAgICAgIGlmIChjdXJQaW4gJiYgY3VyVHJpZ2dlci5zdGFydCAtIGN1clRyaWdnZXIuX3BpblB1c2ggPD0gc3RhcnQgJiYgIWNvbnRhaW5lckFuaW1hdGlvbiAmJiBjdXJUcmlnZ2VyLmVuZCA+IDApIHtcbiAgICAgICAgICBjcyA9IGN1clRyaWdnZXIuZW5kIC0gKHNlbGYuX3N0YXJ0Q2xhbXAgPyBNYXRoLm1heCgwLCBjdXJUcmlnZ2VyLnN0YXJ0KSA6IGN1clRyaWdnZXIuc3RhcnQpO1xuXG4gICAgICAgICAgaWYgKChjdXJQaW4gPT09IHRyaWdnZXIgJiYgY3VyVHJpZ2dlci5zdGFydCAtIGN1clRyaWdnZXIuX3BpblB1c2ggPCBzdGFydCB8fCBjdXJQaW4gPT09IHBpbm5lZENvbnRhaW5lcikgJiYgaXNOYU4ocGFyc2VkU3RhcnQpKSB7XG4gICAgICAgICAgICAvLyBudW1lcmljIHN0YXJ0IHZhbHVlcyBzaG91bGRuJ3QgYmUgb2Zmc2V0IGF0IGFsbCAtIHRyZWF0IHRoZW0gYXMgYWJzb2x1dGVcbiAgICAgICAgICAgIG9mZnNldCArPSBjcyAqICgxIC0gY3VyVHJpZ2dlci5wcm9ncmVzcyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY3VyUGluID09PSBwaW4gJiYgKG90aGVyUGluT2Zmc2V0ICs9IGNzKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzdGFydCArPSBvZmZzZXQ7XG4gICAgICBlbmQgKz0gb2Zmc2V0O1xuICAgICAgc2VsZi5fc3RhcnRDbGFtcCAmJiAoc2VsZi5fc3RhcnRDbGFtcCArPSBvZmZzZXQpO1xuXG4gICAgICBpZiAoc2VsZi5fZW5kQ2xhbXAgJiYgIV9yZWZyZXNoaW5nQWxsKSB7XG4gICAgICAgIHNlbGYuX2VuZENsYW1wID0gZW5kIHx8IC0wLjAwMTtcbiAgICAgICAgZW5kID0gTWF0aC5taW4oZW5kLCBfbWF4U2Nyb2xsKHNjcm9sbGVyLCBkaXJlY3Rpb24pKTtcbiAgICAgIH1cblxuICAgICAgY2hhbmdlID0gZW5kIC0gc3RhcnQgfHwgKHN0YXJ0IC09IDAuMDEpICYmIDAuMDAxO1xuXG4gICAgICBpZiAoaXNGaXJzdFJlZnJlc2gpIHtcbiAgICAgICAgLy8gb24gdGhlIHZlcnkgZmlyc3QgcmVmcmVzaCgpLCB0aGUgcHJldlByb2dyZXNzIGNvdWxkbid0IGhhdmUgYmVlbiBhY2N1cmF0ZSB5ZXQgYmVjYXVzZSB0aGUgc3RhcnQvZW5kIHdlcmUgbmV2ZXIgY2FsY3VsYXRlZCwgc28gd2Ugc2V0IGl0IGhlcmUuIEJlZm9yZSAzLjExLjUsIGl0IGNvdWxkIGxlYWQgdG8gYW4gaW5hY2N1cmF0ZSBzY3JvbGwgcG9zaXRpb24gcmVzdG9yYXRpb24gd2l0aCBzbmFwcGluZy5cbiAgICAgICAgcHJldlByb2dyZXNzID0gZ3NhcC51dGlscy5jbGFtcCgwLCAxLCBnc2FwLnV0aWxzLm5vcm1hbGl6ZShzdGFydCwgZW5kLCBwcmV2U2Nyb2xsKSk7XG4gICAgICB9XG5cbiAgICAgIHNlbGYuX3BpblB1c2ggPSBvdGhlclBpbk9mZnNldDtcblxuICAgICAgaWYgKG1hcmtlclN0YXJ0ICYmIG9mZnNldCkge1xuICAgICAgICAvLyBvZmZzZXQgdGhlIG1hcmtlcnMgaWYgbmVjZXNzYXJ5XG4gICAgICAgIGNzID0ge307XG4gICAgICAgIGNzW2RpcmVjdGlvbi5hXSA9IFwiKz1cIiArIG9mZnNldDtcbiAgICAgICAgcGlubmVkQ29udGFpbmVyICYmIChjc1tkaXJlY3Rpb24ucF0gPSBcIi09XCIgKyBzY3JvbGxGdW5jKCkpO1xuICAgICAgICBnc2FwLnNldChbbWFya2VyU3RhcnQsIG1hcmtlckVuZF0sIGNzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBpbiAmJiAhKF9jbGFtcGluZ01heCAmJiBzZWxmLmVuZCA+PSBfbWF4U2Nyb2xsKHNjcm9sbGVyLCBkaXJlY3Rpb24pKSkge1xuICAgICAgICBjcyA9IF9nZXRDb21wdXRlZFN0eWxlKHBpbik7XG4gICAgICAgIGlzVmVydGljYWwgPSBkaXJlY3Rpb24gPT09IF92ZXJ0aWNhbDtcbiAgICAgICAgc2Nyb2xsID0gc2Nyb2xsRnVuYygpOyAvLyByZWNhbGN1bGF0ZSBiZWNhdXNlIHRoZSB0cmlnZ2VycyBjYW4gYWZmZWN0IHRoZSBzY3JvbGxcblxuICAgICAgICBwaW5TdGFydCA9IHBhcnNlRmxvYXQocGluR2V0dGVyKGRpcmVjdGlvbi5hKSkgKyBvdGhlclBpbk9mZnNldDtcblxuICAgICAgICBpZiAoIW1heCAmJiBlbmQgPiAxKSB7XG4gICAgICAgICAgLy8gbWFrZXMgc3VyZSB0aGUgc2Nyb2xsZXIgaGFzIGEgc2Nyb2xsYmFyLCBvdGhlcndpc2UgaWYgc29tZXRoaW5nIGhhcyB3aWR0aDogMTAwJSwgZm9yIGV4YW1wbGUsIGl0IHdvdWxkIGJlIHRvbyBiaWcgKGV4Y2x1ZGUgdGhlIHNjcm9sbGJhcikuIFNlZSBodHRwczovL2dzYXAuY29tL2ZvcnVtcy90b3BpYy8yNTE4Mi1zY3JvbGx0cmlnZ2VyLXdpZHRoLW9mLXBhZ2UtaW5jcmVhc2Utd2hlcmUtbWFya2Vycy1hcmUtc2V0LXRvLWZhbHNlL1xuICAgICAgICAgIGZvcmNlZE92ZXJmbG93ID0gKGlzVmlld3BvcnQgPyBfZG9jLnNjcm9sbGluZ0VsZW1lbnQgfHwgX2RvY0VsIDogc2Nyb2xsZXIpLnN0eWxlO1xuICAgICAgICAgIGZvcmNlZE92ZXJmbG93ID0ge1xuICAgICAgICAgICAgc3R5bGU6IGZvcmNlZE92ZXJmbG93LFxuICAgICAgICAgICAgdmFsdWU6IGZvcmNlZE92ZXJmbG93W1wib3ZlcmZsb3dcIiArIGRpcmVjdGlvbi5hLnRvVXBwZXJDYXNlKCldXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGlmIChpc1ZpZXdwb3J0ICYmIF9nZXRDb21wdXRlZFN0eWxlKF9ib2R5KVtcIm92ZXJmbG93XCIgKyBkaXJlY3Rpb24uYS50b1VwcGVyQ2FzZSgpXSAhPT0gXCJzY3JvbGxcIikge1xuICAgICAgICAgICAgLy8gYXZvaWQgYW4gZXh0cmEgc2Nyb2xsYmFyIGlmIEJPVEggPGh0bWw+IGFuZCA8Ym9keT4gaGF2ZSBvdmVyZmxvdyBzZXQgdG8gXCJzY3JvbGxcIlxuICAgICAgICAgICAgZm9yY2VkT3ZlcmZsb3cuc3R5bGVbXCJvdmVyZmxvd1wiICsgZGlyZWN0aW9uLmEudG9VcHBlckNhc2UoKV0gPSBcInNjcm9sbFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF9zd2FwUGluSW4ocGluLCBzcGFjZXIsIGNzKTtcblxuICAgICAgICBwaW5TdGF0ZSA9IF9nZXRTdGF0ZShwaW4pOyAvLyB0cmFuc2Zvcm1zIHdpbGwgaW50ZXJmZXJlIHdpdGggdGhlIHRvcC9sZWZ0L3JpZ2h0L2JvdHRvbSBwbGFjZW1lbnQsIHNvIHJlbW92ZSB0aGVtIHRlbXBvcmFyaWx5LiBnZXRCb3VuZGluZ0NsaWVudFJlY3QoKSBmYWN0b3JzIGluIHRyYW5zZm9ybXMuXG5cbiAgICAgICAgYm91bmRzID0gX2dldEJvdW5kcyhwaW4sIHRydWUpO1xuICAgICAgICBvcHBvc2l0ZVNjcm9sbCA9IHVzZUZpeGVkUG9zaXRpb24gJiYgX2dldFNjcm9sbEZ1bmMoc2Nyb2xsZXIsIGlzVmVydGljYWwgPyBfaG9yaXpvbnRhbCA6IF92ZXJ0aWNhbCkoKTtcblxuICAgICAgICBpZiAocGluU3BhY2luZykge1xuICAgICAgICAgIHNwYWNlclN0YXRlID0gW3BpblNwYWNpbmcgKyBkaXJlY3Rpb24ub3MyLCBjaGFuZ2UgKyBvdGhlclBpbk9mZnNldCArIF9weF07XG4gICAgICAgICAgc3BhY2VyU3RhdGUudCA9IHNwYWNlcjtcbiAgICAgICAgICBpID0gcGluU3BhY2luZyA9PT0gX3BhZGRpbmcgPyBfZ2V0U2l6ZShwaW4sIGRpcmVjdGlvbikgKyBjaGFuZ2UgKyBvdGhlclBpbk9mZnNldCA6IDA7XG5cbiAgICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgc3BhY2VyU3RhdGUucHVzaChkaXJlY3Rpb24uZCwgaSArIF9weCk7IC8vIGZvciBib3gtc2l6aW5nOiBib3JkZXItYm94IChtdXN0IGluY2x1ZGUgcGFkZGluZykuXG5cbiAgICAgICAgICAgIHNwYWNlci5zdHlsZS5mbGV4QmFzaXMgIT09IFwiYXV0b1wiICYmIChzcGFjZXIuc3R5bGUuZmxleEJhc2lzID0gaSArIF9weCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgX3NldFN0YXRlKHNwYWNlclN0YXRlKTtcblxuICAgICAgICAgIGlmIChwaW5uZWRDb250YWluZXIpIHtcbiAgICAgICAgICAgIC8vIGluIFNjcm9sbFRyaWdnZXIucmVmcmVzaCgpLCB3ZSBuZWVkIHRvIHJlLWV2YWx1YXRlIHRoZSBwaW5Db250YWluZXIncyBzaXplIGJlY2F1c2UgdGhpcyBwaW5TcGFjaW5nIG1heSBzdHJldGNoIGl0IG91dCwgYnV0IHdlIGNhbid0IGp1c3QgYWRkIHRoZSBleGFjdCBkaXN0YW5jZSBiZWNhdXNlIGRlcGVuZGluZyBvbiBsYXlvdXQsIGl0IG1heSBub3QgcHVzaCB0aGluZ3MgZG93biBvciBpdCBtYXkgb25seSBkbyBzbyBwYXJ0aWFsbHkuXG4gICAgICAgICAgICBfdHJpZ2dlcnMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICBpZiAodC5waW4gPT09IHBpbm5lZENvbnRhaW5lciAmJiB0LnZhcnMucGluU3BhY2luZyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICB0Ll9zdWJQaW5PZmZzZXQgPSB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB1c2VGaXhlZFBvc2l0aW9uICYmIHNjcm9sbEZ1bmMocHJldlNjcm9sbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaSA9IF9nZXRTaXplKHBpbiwgZGlyZWN0aW9uKTtcbiAgICAgICAgICBpICYmIHNwYWNlci5zdHlsZS5mbGV4QmFzaXMgIT09IFwiYXV0b1wiICYmIChzcGFjZXIuc3R5bGUuZmxleEJhc2lzID0gaSArIF9weCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXNlRml4ZWRQb3NpdGlvbikge1xuICAgICAgICAgIG92ZXJyaWRlID0ge1xuICAgICAgICAgICAgdG9wOiBib3VuZHMudG9wICsgKGlzVmVydGljYWwgPyBzY3JvbGwgLSBzdGFydCA6IG9wcG9zaXRlU2Nyb2xsKSArIF9weCxcbiAgICAgICAgICAgIGxlZnQ6IGJvdW5kcy5sZWZ0ICsgKGlzVmVydGljYWwgPyBvcHBvc2l0ZVNjcm9sbCA6IHNjcm9sbCAtIHN0YXJ0KSArIF9weCxcbiAgICAgICAgICAgIGJveFNpemluZzogXCJib3JkZXItYm94XCIsXG4gICAgICAgICAgICBwb3NpdGlvbjogXCJmaXhlZFwiXG4gICAgICAgICAgfTtcbiAgICAgICAgICBvdmVycmlkZVtfd2lkdGhdID0gb3ZlcnJpZGVbXCJtYXhcIiArIF9XaWR0aF0gPSBNYXRoLmNlaWwoYm91bmRzLndpZHRoKSArIF9weDtcbiAgICAgICAgICBvdmVycmlkZVtfaGVpZ2h0XSA9IG92ZXJyaWRlW1wibWF4XCIgKyBfSGVpZ2h0XSA9IE1hdGguY2VpbChib3VuZHMuaGVpZ2h0KSArIF9weDtcbiAgICAgICAgICBvdmVycmlkZVtfbWFyZ2luXSA9IG92ZXJyaWRlW19tYXJnaW4gKyBfVG9wXSA9IG92ZXJyaWRlW19tYXJnaW4gKyBfUmlnaHRdID0gb3ZlcnJpZGVbX21hcmdpbiArIF9Cb3R0b21dID0gb3ZlcnJpZGVbX21hcmdpbiArIF9MZWZ0XSA9IFwiMFwiO1xuICAgICAgICAgIG92ZXJyaWRlW19wYWRkaW5nXSA9IGNzW19wYWRkaW5nXTtcbiAgICAgICAgICBvdmVycmlkZVtfcGFkZGluZyArIF9Ub3BdID0gY3NbX3BhZGRpbmcgKyBfVG9wXTtcbiAgICAgICAgICBvdmVycmlkZVtfcGFkZGluZyArIF9SaWdodF0gPSBjc1tfcGFkZGluZyArIF9SaWdodF07XG4gICAgICAgICAgb3ZlcnJpZGVbX3BhZGRpbmcgKyBfQm90dG9tXSA9IGNzW19wYWRkaW5nICsgX0JvdHRvbV07XG4gICAgICAgICAgb3ZlcnJpZGVbX3BhZGRpbmcgKyBfTGVmdF0gPSBjc1tfcGFkZGluZyArIF9MZWZ0XTtcbiAgICAgICAgICBwaW5BY3RpdmVTdGF0ZSA9IF9jb3B5U3RhdGUocGluT3JpZ2luYWxTdGF0ZSwgb3ZlcnJpZGUsIHBpblJlcGFyZW50KTtcbiAgICAgICAgICBfcmVmcmVzaGluZ0FsbCAmJiBzY3JvbGxGdW5jKDApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFuaW1hdGlvbikge1xuICAgICAgICAgIC8vIHRoZSBhbmltYXRpb24gbWlnaHQgYmUgYWZmZWN0aW5nIHRoZSB0cmFuc2Zvcm0sIHNvIHdlIG11c3QganVtcCB0byB0aGUgZW5kLCBjaGVjayB0aGUgdmFsdWUsIGFuZCBjb21wZW5zYXRlIGFjY29yZGluZ2x5LiBPdGhlcndpc2UsIHdoZW4gaXQgYmVjb21lcyB1bnBpbm5lZCwgdGhlIHBpblNldHRlcigpIHdpbGwgZ2V0IHNldCB0byBhIHZhbHVlIHRoYXQgZG9lc24ndCBpbmNsdWRlIHdoYXRldmVyIHRoZSBhbmltYXRpb24gZGlkLlxuICAgICAgICAgIGluaXR0ZWQgPSBhbmltYXRpb24uX2luaXR0ZWQ7IC8vIGlmIG5vdCwgd2UgbXVzdCBpbnZhbGlkYXRlKCkgYWZ0ZXIgdGhpcyBzdGVwLCBvdGhlcndpc2UgaXQgY291bGQgbG9jayBpbiBzdGFydGluZyB2YWx1ZXMgcHJlbWF0dXJlbHkuXG5cbiAgICAgICAgICBfc3VwcHJlc3NPdmVyd3JpdGVzKDEpO1xuXG4gICAgICAgICAgYW5pbWF0aW9uLnJlbmRlcihhbmltYXRpb24uZHVyYXRpb24oKSwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgICAgcGluQ2hhbmdlID0gcGluR2V0dGVyKGRpcmVjdGlvbi5hKSAtIHBpblN0YXJ0ICsgY2hhbmdlICsgb3RoZXJQaW5PZmZzZXQ7XG4gICAgICAgICAgcGluTW92ZXMgPSBNYXRoLmFicyhjaGFuZ2UgLSBwaW5DaGFuZ2UpID4gMTtcbiAgICAgICAgICB1c2VGaXhlZFBvc2l0aW9uICYmIHBpbk1vdmVzICYmIHBpbkFjdGl2ZVN0YXRlLnNwbGljZShwaW5BY3RpdmVTdGF0ZS5sZW5ndGggLSAyLCAyKTsgLy8gdHJhbnNmb3JtIGlzIHRoZSBsYXN0IHByb3BlcnR5L3ZhbHVlIHNldCBpbiB0aGUgc3RhdGUgQXJyYXkuIFNpbmNlIHRoZSBhbmltYXRpb24gaXMgY29udHJvbGxpbmcgdGhhdCwgd2Ugc2hvdWxkIG9taXQgaXQuXG5cbiAgICAgICAgICBhbmltYXRpb24ucmVuZGVyKDAsIHRydWUsIHRydWUpO1xuICAgICAgICAgIGluaXR0ZWQgfHwgYW5pbWF0aW9uLmludmFsaWRhdGUodHJ1ZSk7XG4gICAgICAgICAgYW5pbWF0aW9uLnBhcmVudCB8fCBhbmltYXRpb24udG90YWxUaW1lKGFuaW1hdGlvbi50b3RhbFRpbWUoKSk7IC8vIGlmLCBmb3IgZXhhbXBsZSwgYSB0b2dnbGVBY3Rpb24gY2FsbGVkIHBsYXkoKSBhbmQgdGhlbiByZWZyZXNoKCkgaGFwcGVucyBhbmQgd2hlbiB3ZSByZW5kZXIoMSkgYWJvdmUsIGl0IHdvdWxkIGNhdXNlIHRoZSBhbmltYXRpb24gdG8gY29tcGxldGUgYW5kIGdldCByZW1vdmVkIGZyb20gaXRzIHBhcmVudCwgc28gdGhpcyBtYWtlcyBzdXJlIGl0IGdldHMgcHV0IGJhY2sgaW4uXG5cbiAgICAgICAgICBfc3VwcHJlc3NPdmVyd3JpdGVzKDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBpbkNoYW5nZSA9IGNoYW5nZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcmNlZE92ZXJmbG93ICYmIChmb3JjZWRPdmVyZmxvdy52YWx1ZSA/IGZvcmNlZE92ZXJmbG93LnN0eWxlW1wib3ZlcmZsb3dcIiArIGRpcmVjdGlvbi5hLnRvVXBwZXJDYXNlKCldID0gZm9yY2VkT3ZlcmZsb3cudmFsdWUgOiBmb3JjZWRPdmVyZmxvdy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIm92ZXJmbG93LVwiICsgZGlyZWN0aW9uLmEpKTtcbiAgICAgIH0gZWxzZSBpZiAodHJpZ2dlciAmJiBzY3JvbGxGdW5jKCkgJiYgIWNvbnRhaW5lckFuaW1hdGlvbikge1xuICAgICAgICAvLyBpdCBtYXkgYmUgSU5TSURFIGEgcGlubmVkIGVsZW1lbnQsIHNvIHdhbGsgdXAgdGhlIHRyZWUgYW5kIGxvb2sgZm9yIGFueSBlbGVtZW50cyB3aXRoIF9waW5PZmZzZXQgdG8gY29tcGVuc2F0ZSBiZWNhdXNlIGFueXRoaW5nIHdpdGggcGluU3BhY2luZyB0aGF0J3MgYWxyZWFkeSBzY3JvbGxlZCB3b3VsZCB0aHJvdyBvZmYgdGhlIG1lYXN1cmVtZW50cyBpbiBnZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICBib3VuZHMgPSB0cmlnZ2VyLnBhcmVudE5vZGU7XG5cbiAgICAgICAgd2hpbGUgKGJvdW5kcyAmJiBib3VuZHMgIT09IF9ib2R5KSB7XG4gICAgICAgICAgaWYgKGJvdW5kcy5fcGluT2Zmc2V0KSB7XG4gICAgICAgICAgICBzdGFydCAtPSBib3VuZHMuX3Bpbk9mZnNldDtcbiAgICAgICAgICAgIGVuZCAtPSBib3VuZHMuX3Bpbk9mZnNldDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBib3VuZHMgPSBib3VuZHMucGFyZW50Tm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXZlcnRlZFBpbnMgJiYgcmV2ZXJ0ZWRQaW5zLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgcmV0dXJuIHQucmV2ZXJ0KGZhbHNlLCB0cnVlKTtcbiAgICAgIH0pO1xuICAgICAgc2VsZi5zdGFydCA9IHN0YXJ0O1xuICAgICAgc2VsZi5lbmQgPSBlbmQ7XG4gICAgICBzY3JvbGwxID0gc2Nyb2xsMiA9IF9yZWZyZXNoaW5nQWxsID8gcHJldlNjcm9sbCA6IHNjcm9sbEZ1bmMoKTsgLy8gcmVzZXQgdmVsb2NpdHlcblxuICAgICAgaWYgKCFjb250YWluZXJBbmltYXRpb24gJiYgIV9yZWZyZXNoaW5nQWxsICYmICFfaXNSZXZlcnRlZCkge1xuICAgICAgICAvLyBwcmVzZXJ2ZSB0aGUgcmVjb3JkZWQgcG9zaXRpb24gdGhyb3VnaG91dCBhIG1hdGNoTWVkaWEgcmV2ZXJ0L3JlY3JlYXRlIHRyYW5zYWN0aW9uXG4gICAgICAgIHNjcm9sbDEgPCBwcmV2U2Nyb2xsICYmIHNjcm9sbEZ1bmMocHJldlNjcm9sbCk7XG4gICAgICAgIHNlbGYuc2Nyb2xsLnJlYyA9IDA7XG4gICAgICB9XG5cbiAgICAgIHNlbGYucmV2ZXJ0KGZhbHNlLCB0cnVlKTtcbiAgICAgIGxhc3RSZWZyZXNoID0gX2dldFRpbWUoKTtcblxuICAgICAgaWYgKHNuYXBEZWxheWVkQ2FsbCkge1xuICAgICAgICBsYXN0U25hcCA9IC0xOyAvLyBqdXN0IHNvIHNuYXBwaW5nIGdldHMgcmUtZW5hYmxlZCwgY2xlYXIgb3V0IGFueSByZWNvcmRlZCBsYXN0IHZhbHVlXG4gICAgICAgIC8vIHNlbGYuaXNBY3RpdmUgJiYgc2Nyb2xsRnVuYyhzdGFydCArIGNoYW5nZSAqIHByZXZQcm9ncmVzcyk7IC8vIHByZXZpb3VzbHkgdGhpcyBsaW5lIHdhcyBoZXJlIHRvIGVuc3VyZSB0aGF0IHdoZW4gc25hcHBpbmcga2lja3MgaW4sIGl0J3MgZnJvbSB0aGUgcHJldmlvdXMgcHJvZ3Jlc3MgYnV0IGluIHNvbWUgY2FzZXMgdGhhdCdzIG5vdCBkZXNpcmFibGUsIGxpa2UgYW4gYWxsLXBhZ2UgU2Nyb2xsVHJpZ2dlciB3aGVuIG5ldyBjb250ZW50IGdldHMgYWRkZWQgdG8gdGhlIHBhZ2UsIHRoYXQnZCB0b3RhbGx5IGNoYW5nZSB0aGUgcHJvZ3Jlc3MuXG5cbiAgICAgICAgc25hcERlbGF5ZWRDYWxsLnJlc3RhcnQodHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIF9yZWZyZXNoaW5nID0gMDtcbiAgICAgIGFuaW1hdGlvbiAmJiBpc1RvZ2dsZSAmJiAoYW5pbWF0aW9uLl9pbml0dGVkIHx8IHByZXZBbmltUHJvZ3Jlc3MpICYmIGFuaW1hdGlvbi5wcm9ncmVzcygpICE9PSBwcmV2QW5pbVByb2dyZXNzICYmIGFuaW1hdGlvbi5wcm9ncmVzcyhwcmV2QW5pbVByb2dyZXNzIHx8IDAsIHRydWUpLnJlbmRlcihhbmltYXRpb24udGltZSgpLCB0cnVlLCB0cnVlKTsgLy8gbXVzdCBmb3JjZSBhIHJlLXJlbmRlciBiZWNhdXNlIGlmIHNhdmVTdHlsZXMoKSB3YXMgdXNlZCBvbiB0aGUgdGFyZ2V0KHMpLCB0aGUgc3R5bGVzIGNvdWxkIGhhdmUgYmVlbiB3aXBlZCBvdXQgZHVyaW5nIHRoZSByZWZyZXNoKCkuXG5cbiAgICAgIGlmIChpc0ZpcnN0UmVmcmVzaCB8fCBwcmV2UHJvZ3Jlc3MgIT09IHNlbGYucHJvZ3Jlc3MgfHwgY29udGFpbmVyQW5pbWF0aW9uIHx8IGludmFsaWRhdGVPblJlZnJlc2ggfHwgYW5pbWF0aW9uICYmICFhbmltYXRpb24uX2luaXR0ZWQpIHtcbiAgICAgICAgLy8gZW5zdXJlcyB0aGF0IHRoZSBkaXJlY3Rpb24gaXMgc2V0IHByb3Blcmx5ICh3aGVuIHJlZnJlc2hpbmcsIHByb2dyZXNzIGlzIHNldCBiYWNrIHRvIDAgaW5pdGlhbGx5LCB0aGVuIGJhY2sgYWdhaW4gdG8gd2hlcmV2ZXIgaXQgbmVlZHMgdG8gYmUpIGFuZCB0aGF0IGNhbGxiYWNrcyBhcmUgdHJpZ2dlcmVkLlxuICAgICAgICBhbmltYXRpb24gJiYgIWlzVG9nZ2xlICYmIChhbmltYXRpb24uX2luaXR0ZWQgfHwgcHJldlByb2dyZXNzIHx8IGFuaW1hdGlvbi52YXJzLmltbWVkaWF0ZVJlbmRlciAhPT0gZmFsc2UpICYmIGFuaW1hdGlvbi50b3RhbFByb2dyZXNzKGNvbnRhaW5lckFuaW1hdGlvbiAmJiBzdGFydCA8IC0wLjAwMSAmJiAhcHJldlByb2dyZXNzID8gZ3NhcC51dGlscy5ub3JtYWxpemUoc3RhcnQsIGVuZCwgMCkgOiBwcmV2UHJvZ3Jlc3MsIHRydWUpOyAvLyB0byBhdm9pZCBpc3N1ZXMgd2hlcmUgYW5pbWF0aW9uIGNhbGxiYWNrcyBsaWtlIG9uU3RhcnQgYXJlbid0IHRyaWdnZXJlZC5cblxuICAgICAgICBzZWxmLnByb2dyZXNzID0gaXNGaXJzdFJlZnJlc2ggfHwgKHNjcm9sbDEgLSBzdGFydCkgLyBjaGFuZ2UgPT09IHByZXZQcm9ncmVzcyA/IDAgOiBwcmV2UHJvZ3Jlc3M7XG4gICAgICB9XG5cbiAgICAgIHBpbiAmJiBwaW5TcGFjaW5nICYmIChzcGFjZXIuX3Bpbk9mZnNldCA9IE1hdGgucm91bmQoc2VsZi5wcm9ncmVzcyAqIHBpbkNoYW5nZSkpO1xuICAgICAgc2NydWJUd2VlbiAmJiBzY3J1YlR3ZWVuLmludmFsaWRhdGUoKTtcblxuICAgICAgaWYgKCFpc05hTihtYXJrZXJTdGFydE9mZnNldCkpIHtcbiAgICAgICAgLy8gbnVtYmVycyB3ZXJlIHBhc3NlZCBpbiBmb3IgdGhlIHBvc2l0aW9uIHdoaWNoIGFyZSBhYnNvbHV0ZSwgc28gaW5zdGVhZCBvZiBqdXN0IHB1dHRpbmcgdGhlIG1hcmtlcnMgYXQgdGhlIHZlcnkgYm90dG9tIG9mIHRoZSB2aWV3cG9ydCwgd2UgZmlndXJlIG91dCBob3cgZmFyIHRoZXkgc2hpZnRlZCBkb3duIChpdCdzIHNhZmUgdG8gYXNzdW1lIHRoZXkgd2VyZSBvcmlnaW5hbGx5IHBvc2l0aW9uZWQgaW4gY2xvc2VyIHJlbGF0aW9uIHRvIHRoZSB0cmlnZ2VyIGVsZW1lbnQgd2l0aCB2YWx1ZXMgbGlrZSBcInRvcFwiLCBcImNlbnRlclwiLCBhIHBlcmNlbnRhZ2Ugb3Igd2hhdGV2ZXIsIHNvIHdlIG9mZnNldCB0aGF0IG11Y2ggaW4gdGhlIG9wcG9zaXRlIGRpcmVjdGlvbiB0byBiYXNpY2FsbHkgcmV2ZXJ0IHRoZW0gdG8gdGhlIHJlbGF0aXZlIHBvc2l0aW9uIHRoeSB3ZXJlIGF0IHByZXZpb3VzbHkuXG4gICAgICAgIG1hcmtlclN0YXJ0T2Zmc2V0IC09IGdzYXAuZ2V0UHJvcGVydHkobWFya2VyU3RhcnRUcmlnZ2VyLCBkaXJlY3Rpb24ucCk7XG4gICAgICAgIG1hcmtlckVuZE9mZnNldCAtPSBnc2FwLmdldFByb3BlcnR5KG1hcmtlckVuZFRyaWdnZXIsIGRpcmVjdGlvbi5wKTtcblxuICAgICAgICBfc2hpZnRNYXJrZXIobWFya2VyU3RhcnRUcmlnZ2VyLCBkaXJlY3Rpb24sIG1hcmtlclN0YXJ0T2Zmc2V0KTtcblxuICAgICAgICBfc2hpZnRNYXJrZXIobWFya2VyU3RhcnQsIGRpcmVjdGlvbiwgbWFya2VyU3RhcnRPZmZzZXQgLSAocGluT2Zmc2V0IHx8IDApKTtcblxuICAgICAgICBfc2hpZnRNYXJrZXIobWFya2VyRW5kVHJpZ2dlciwgZGlyZWN0aW9uLCBtYXJrZXJFbmRPZmZzZXQpO1xuXG4gICAgICAgIF9zaGlmdE1hcmtlcihtYXJrZXJFbmQsIGRpcmVjdGlvbiwgbWFya2VyRW5kT2Zmc2V0IC0gKHBpbk9mZnNldCB8fCAwKSk7XG4gICAgICB9XG5cbiAgICAgIGlzRmlyc3RSZWZyZXNoICYmICFfcmVmcmVzaGluZ0FsbCAmJiBzZWxmLnVwZGF0ZSgpOyAvLyBlZGdlIGNhc2UgLSB3aGVuIHlvdSByZWxvYWQgYSBwYWdlIHdoZW4gaXQncyBhbHJlYWR5IHNjcm9sbGVkIGRvd24sIHNvbWUgYnJvd3NlcnMgZmlyZSBhIFwic2Nyb2xsXCIgZXZlbnQgYmVmb3JlIERPTUNvbnRlbnRMb2FkZWQsIHRyaWdnZXJpbmcgYW4gdXBkYXRlQWxsKCkuIElmIHdlIGRvbid0IHVwZGF0ZSB0aGUgc2VsZi5wcm9ncmVzcyBhcyBwYXJ0IG9mIHJlZnJlc2goKSwgdGhlbiB3aGVuIGl0IGhhcHBlbnMgbmV4dCwgaXQgbWF5IHJlY29yZCBwcmV2UHJvZ3Jlc3MgYXMgMCB3aGVuIGl0IHJlYWxseSBzaG91bGRuJ3QsIHBvdGVudGlhbGx5IGNhdXNpbmcgYSBjYWxsYmFjayBpbiBhbiBhbmltYXRpb24gdG8gZmlyZSBhZ2Fpbi5cblxuICAgICAgaWYgKG9uUmVmcmVzaCAmJiAhX3JlZnJlc2hpbmdBbGwgJiYgIWV4ZWN1dGluZ09uUmVmcmVzaCkge1xuICAgICAgICAvLyB3aGVuIHJlZnJlc2hpbmcgYWxsLCB3ZSBkbyBleHRyYSB3b3JrIHRvIGNvcnJlY3QgcGlubmVkQ29udGFpbmVyIHNpemVzIGFuZCBlbnN1cmUgdGhpbmdzIGRvbid0IGV4Y2VlZCB0aGUgbWF4U2Nyb2xsLCBzbyB3ZSBzaG91bGQgZG8gYWxsIHRoZSByZWZyZXNoZXMgYXQgdGhlIGVuZCBhZnRlciBhbGwgdGhhdCB3b3JrIHNvIHRoYXQgdGhlIHN0YXJ0L2VuZCB2YWx1ZXMgYXJlIGNvcnJlY3RlZC5cbiAgICAgICAgZXhlY3V0aW5nT25SZWZyZXNoID0gdHJ1ZTtcbiAgICAgICAgb25SZWZyZXNoKHNlbGYpO1xuICAgICAgICBleGVjdXRpbmdPblJlZnJlc2ggPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgc2VsZi5nZXRWZWxvY2l0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAoc2Nyb2xsRnVuYygpIC0gc2Nyb2xsMikgLyAoX2dldFRpbWUoKSAtIF90aW1lMikgKiAxMDAwIHx8IDA7XG4gICAgfTtcblxuICAgIHNlbGYuZW5kQW5pbWF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgX2VuZEFuaW1hdGlvbihzZWxmLmNhbGxiYWNrQW5pbWF0aW9uKTtcblxuICAgICAgaWYgKGFuaW1hdGlvbikge1xuICAgICAgICBzY3J1YlR3ZWVuID8gc2NydWJUd2Vlbi5wcm9ncmVzcygxKSA6ICFhbmltYXRpb24ucGF1c2VkKCkgPyBfZW5kQW5pbWF0aW9uKGFuaW1hdGlvbiwgYW5pbWF0aW9uLnJldmVyc2VkKCkpIDogaXNUb2dnbGUgfHwgX2VuZEFuaW1hdGlvbihhbmltYXRpb24sIHNlbGYuZGlyZWN0aW9uIDwgMCwgMSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHNlbGYubGFiZWxUb1Njcm9sbCA9IGZ1bmN0aW9uIChsYWJlbCkge1xuICAgICAgcmV0dXJuIGFuaW1hdGlvbiAmJiBhbmltYXRpb24ubGFiZWxzICYmIChzdGFydCB8fCBzZWxmLnJlZnJlc2goKSB8fCBzdGFydCkgKyBhbmltYXRpb24ubGFiZWxzW2xhYmVsXSAvIGFuaW1hdGlvbi5kdXJhdGlvbigpICogY2hhbmdlIHx8IDA7XG4gICAgfTtcblxuICAgIHNlbGYuZ2V0VHJhaWxpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIGkgPSBfdHJpZ2dlcnMuaW5kZXhPZihzZWxmKSxcbiAgICAgICAgICBhID0gc2VsZi5kaXJlY3Rpb24gPiAwID8gX3RyaWdnZXJzLnNsaWNlKDAsIGkpLnJldmVyc2UoKSA6IF90cmlnZ2Vycy5zbGljZShpICsgMSk7XG5cbiAgICAgIHJldHVybiAoX2lzU3RyaW5nKG5hbWUpID8gYS5maWx0ZXIoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgcmV0dXJuIHQudmFycy5wcmV2ZW50T3ZlcmxhcHMgPT09IG5hbWU7XG4gICAgICB9KSA6IGEpLmZpbHRlcihmdW5jdGlvbiAodCkge1xuICAgICAgICByZXR1cm4gc2VsZi5kaXJlY3Rpb24gPiAwID8gdC5lbmQgPD0gc3RhcnQgOiB0LnN0YXJ0ID49IGVuZDtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBzZWxmLnVwZGF0ZSA9IGZ1bmN0aW9uIChyZXNldCwgcmVjb3JkVmVsb2NpdHksIGZvcmNlRmFrZSkge1xuICAgICAgaWYgKGNvbnRhaW5lckFuaW1hdGlvbiAmJiAhZm9yY2VGYWtlICYmICFyZXNldCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBzY3JvbGwgPSBfcmVmcmVzaGluZ0FsbCA9PT0gdHJ1ZSA/IHByZXZTY3JvbGwgOiBzZWxmLnNjcm9sbCgpLFxuICAgICAgICAgIHAgPSByZXNldCA/IDAgOiAoc2Nyb2xsIC0gc3RhcnQpIC8gY2hhbmdlLFxuICAgICAgICAgIGNsaXBwZWQgPSBwIDwgMCA/IDAgOiBwID4gMSA/IDEgOiBwIHx8IDAsXG4gICAgICAgICAgcHJldlByb2dyZXNzID0gc2VsZi5wcm9ncmVzcyxcbiAgICAgICAgICBpc0FjdGl2ZSxcbiAgICAgICAgICB3YXNBY3RpdmUsXG4gICAgICAgICAgdG9nZ2xlU3RhdGUsXG4gICAgICAgICAgYWN0aW9uLFxuICAgICAgICAgIHN0YXRlQ2hhbmdlZCxcbiAgICAgICAgICB0b2dnbGVkLFxuICAgICAgICAgIGlzQXRNYXgsXG4gICAgICAgICAgaXNUYWtpbmdBY3Rpb247XG5cbiAgICAgIGlmIChyZWNvcmRWZWxvY2l0eSkge1xuICAgICAgICBzY3JvbGwyID0gc2Nyb2xsMTtcbiAgICAgICAgc2Nyb2xsMSA9IGNvbnRhaW5lckFuaW1hdGlvbiA/IHNjcm9sbEZ1bmMoKSA6IHNjcm9sbDtcblxuICAgICAgICBpZiAoc25hcCkge1xuICAgICAgICAgIHNuYXAyID0gc25hcDE7XG4gICAgICAgICAgc25hcDEgPSBhbmltYXRpb24gJiYgIWlzVG9nZ2xlID8gYW5pbWF0aW9uLnRvdGFsUHJvZ3Jlc3MoKSA6IGNsaXBwZWQ7XG4gICAgICAgIH1cbiAgICAgIH0gLy8gYW50aWNpcGF0ZSB0aGUgcGlubmluZyBhIGZldyB0aWNrcyBhaGVhZCBvZiB0aW1lIGJhc2VkIG9uIHZlbG9jaXR5IHRvIGF2b2lkIGEgdmlzdWFsIGdsaXRjaCBkdWUgdG8gdGhlIGZhY3QgdGhhdCBtb3N0IGJyb3dzZXJzIGRvIHNjcm9sbGluZyBvbiBhIHNlcGFyYXRlIHRocmVhZCAobm90IHN5bmNlZCB3aXRoIHJlcXVlc3RBbmltYXRpb25GcmFtZSkuXG5cblxuICAgICAgaWYgKGFudGljaXBhdGVQaW4gJiYgcGluICYmICFfcmVmcmVzaGluZyAmJiAhX3N0YXJ0dXAgJiYgX2xhc3RTY3JvbGxUaW1lKSB7XG4gICAgICAgIGlmICghY2xpcHBlZCAmJiBzdGFydCA8IHNjcm9sbCArIChzY3JvbGwgLSBzY3JvbGwyKSAvIChfZ2V0VGltZSgpIC0gX3RpbWUyKSAqIGFudGljaXBhdGVQaW4pIHtcbiAgICAgICAgICBjbGlwcGVkID0gMC4wMDAxO1xuICAgICAgICB9IGVsc2UgaWYgKGNsaXBwZWQgPT09IDEgJiYgZW5kID4gc2Nyb2xsICsgKHNjcm9sbCAtIHNjcm9sbDIpIC8gKF9nZXRUaW1lKCkgLSBfdGltZTIpICogYW50aWNpcGF0ZVBpbikge1xuICAgICAgICAgIGNsaXBwZWQgPSAwLjk5OTk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGNsaXBwZWQgIT09IHByZXZQcm9ncmVzcyAmJiBzZWxmLmVuYWJsZWQpIHtcbiAgICAgICAgaXNBY3RpdmUgPSBzZWxmLmlzQWN0aXZlID0gISFjbGlwcGVkICYmIGNsaXBwZWQgPCAxO1xuICAgICAgICB3YXNBY3RpdmUgPSAhIXByZXZQcm9ncmVzcyAmJiBwcmV2UHJvZ3Jlc3MgPCAxO1xuICAgICAgICB0b2dnbGVkID0gaXNBY3RpdmUgIT09IHdhc0FjdGl2ZTtcbiAgICAgICAgc3RhdGVDaGFuZ2VkID0gdG9nZ2xlZCB8fCAhIWNsaXBwZWQgIT09ICEhcHJldlByb2dyZXNzOyAvLyBjb3VsZCBnbyBmcm9tIHN0YXJ0IGFsbCB0aGUgd2F5IHRvIGVuZCwgdGh1cyBpdCBkaWRuJ3QgdG9nZ2xlIGJ1dCBpdCBkaWQgY2hhbmdlIHN0YXRlIGluIGEgc2Vuc2UgKG1heSBuZWVkIHRvIGZpcmUgYSBjYWxsYmFjaylcblxuICAgICAgICBzZWxmLmRpcmVjdGlvbiA9IGNsaXBwZWQgPiBwcmV2UHJvZ3Jlc3MgPyAxIDogLTE7XG4gICAgICAgIHNlbGYucHJvZ3Jlc3MgPSBjbGlwcGVkO1xuXG4gICAgICAgIGlmIChzdGF0ZUNoYW5nZWQgJiYgIV9yZWZyZXNoaW5nKSB7XG4gICAgICAgICAgdG9nZ2xlU3RhdGUgPSBjbGlwcGVkICYmICFwcmV2UHJvZ3Jlc3MgPyAwIDogY2xpcHBlZCA9PT0gMSA/IDEgOiBwcmV2UHJvZ3Jlc3MgPT09IDEgPyAyIDogMzsgLy8gMCA9IGVudGVyLCAxID0gbGVhdmUsIDIgPSBlbnRlckJhY2ssIDMgPSBsZWF2ZUJhY2sgKHdlIHByaW9yaXRpemUgdGhlIEZJUlNUIGVuY291bnRlciwgdGh1cyBpZiB5b3Ugc2Nyb2xsIHJlYWxseSBmYXN0IHBhc3QgdGhlIG9uRW50ZXIgYW5kIG9uTGVhdmUgaW4gb25lIHRpY2ssIGl0J2QgcHJpb3JpdGl6ZSBvbkVudGVyLlxuXG4gICAgICAgICAgaWYgKGlzVG9nZ2xlKSB7XG4gICAgICAgICAgICBhY3Rpb24gPSAhdG9nZ2xlZCAmJiB0b2dnbGVBY3Rpb25zW3RvZ2dsZVN0YXRlICsgMV0gIT09IFwibm9uZVwiICYmIHRvZ2dsZUFjdGlvbnNbdG9nZ2xlU3RhdGUgKyAxXSB8fCB0b2dnbGVBY3Rpb25zW3RvZ2dsZVN0YXRlXTsgLy8gaWYgaXQgZGlkbid0IHRvZ2dsZSwgdGhhdCBtZWFucyBpdCBzaG90IHJpZ2h0IHBhc3QgYW5kIHNpbmNlIHdlIHByaW9yaXRpemUgdGhlIFwiZW50ZXJcIiBhY3Rpb24sIHdlIHNob3VsZCBzd2l0Y2ggdG8gdGhlIFwibGVhdmVcIiBpbiB0aGlzIGNhc2UgKGJ1dCBvbmx5IGlmIG9uZSBpcyBkZWZpbmVkKVxuXG4gICAgICAgICAgICBpc1Rha2luZ0FjdGlvbiA9IGFuaW1hdGlvbiAmJiAoYWN0aW9uID09PSBcImNvbXBsZXRlXCIgfHwgYWN0aW9uID09PSBcInJlc2V0XCIgfHwgYWN0aW9uIGluIGFuaW1hdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJldmVudE92ZXJsYXBzICYmICh0b2dnbGVkIHx8IGlzVGFraW5nQWN0aW9uKSAmJiAoaXNUYWtpbmdBY3Rpb24gfHwgc2NydWIgfHwgIWFuaW1hdGlvbikgJiYgKF9pc0Z1bmN0aW9uKHByZXZlbnRPdmVybGFwcykgPyBwcmV2ZW50T3ZlcmxhcHMoc2VsZikgOiBzZWxmLmdldFRyYWlsaW5nKHByZXZlbnRPdmVybGFwcykuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgIHJldHVybiB0LmVuZEFuaW1hdGlvbigpO1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgaWYgKCFpc1RvZ2dsZSkge1xuICAgICAgICAgIGlmIChzY3J1YlR3ZWVuICYmICFfcmVmcmVzaGluZyAmJiAhX3N0YXJ0dXApIHtcbiAgICAgICAgICAgIHNjcnViVHdlZW4uX2RwLl90aW1lIC0gc2NydWJUd2Vlbi5fc3RhcnQgIT09IHNjcnViVHdlZW4uX3RpbWUgJiYgc2NydWJUd2Vlbi5yZW5kZXIoc2NydWJUd2Vlbi5fZHAuX3RpbWUgLSBzY3J1YlR3ZWVuLl9zdGFydCk7IC8vIGlmIHRoZXJlJ3MgYSBzY3J1YiBvbiBib3RoIHRoZSBjb250YWluZXIgYW5pbWF0aW9uIGFuZCB0aGlzIG9uZSAob3IgYSBTY3JvbGxTbW9vdGhlciksIHRoZSB1cGRhdGUgb3JkZXIgd291bGQgY2F1c2UgdGhpcyBvbmUgbm90IHRvIGhhdmUgcmVuZGVyZWQgeWV0LCBzbyBpdCB3b3VsZG4ndCBtYWtlIGFueSBwcm9ncmVzcyBiZWZvcmUgd2UgLnJlc3RhcnQoKSBpdCBoZWFkaW5nIHRvd2FyZCB0aGUgbmV3IHByb2dyZXNzIHNvIGl0J2QgYXBwZWFyIHN0dWNrIHRodXMgd2UgZm9yY2UgYSByZW5kZXIgaGVyZS5cblxuICAgICAgICAgICAgaWYgKHNjcnViVHdlZW4ucmVzZXRUbykge1xuICAgICAgICAgICAgICBzY3J1YlR3ZWVuLnJlc2V0VG8oXCJ0b3RhbFByb2dyZXNzXCIsIGNsaXBwZWQsIGFuaW1hdGlvbi5fdFRpbWUgLyBhbmltYXRpb24uX3REdXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gbGVnYWN5IHN1cHBvcnQgKGNvdXJ0ZXN5KSwgYmVmb3JlIDMuMTAuMFxuICAgICAgICAgICAgICBzY3J1YlR3ZWVuLnZhcnMudG90YWxQcm9ncmVzcyA9IGNsaXBwZWQ7XG4gICAgICAgICAgICAgIHNjcnViVHdlZW4uaW52YWxpZGF0ZSgpLnJlc3RhcnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGFuaW1hdGlvbikge1xuICAgICAgICAgICAgYW5pbWF0aW9uLnRvdGFsUHJvZ3Jlc3MoY2xpcHBlZCwgISEoX3JlZnJlc2hpbmcgJiYgKGxhc3RSZWZyZXNoIHx8IHJlc2V0KSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwaW4pIHtcbiAgICAgICAgICByZXNldCAmJiBwaW5TcGFjaW5nICYmIChzcGFjZXIuc3R5bGVbcGluU3BhY2luZyArIGRpcmVjdGlvbi5vczJdID0gc3BhY2luZ1N0YXJ0KTtcblxuICAgICAgICAgIGlmICghdXNlRml4ZWRQb3NpdGlvbikge1xuICAgICAgICAgICAgcGluU2V0dGVyKF9yb3VuZChwaW5TdGFydCArIHBpbkNoYW5nZSAqIGNsaXBwZWQpKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YXRlQ2hhbmdlZCkge1xuICAgICAgICAgICAgaXNBdE1heCA9ICFyZXNldCAmJiBjbGlwcGVkID4gcHJldlByb2dyZXNzICYmIGVuZCArIDEgPiBzY3JvbGwgJiYgc2Nyb2xsICsgMSA+PSBfbWF4U2Nyb2xsKHNjcm9sbGVyLCBkaXJlY3Rpb24pOyAvLyBpZiBpdCdzIGF0IHRoZSBWRVJZIGVuZCBvZiB0aGUgcGFnZSwgZG9uJ3Qgc3dpdGNoIGF3YXkgZnJvbSBwb3NpdGlvbjogZml4ZWQgYmVjYXVzZSBpdCdzIHBvaW50bGVzcyBhbmQgaXQgY291bGQgY2F1c2UgYSBicmllZiBmbGFzaCB3aGVuIHRoZSB1c2VyIHNjcm9sbHMgYmFjayB1cCAod2hlbiBpdCBnZXRzIHBpbm5lZCBhZ2FpbilcblxuICAgICAgICAgICAgaWYgKHBpblJlcGFyZW50KSB7XG4gICAgICAgICAgICAgIGlmICghcmVzZXQgJiYgKGlzQWN0aXZlIHx8IGlzQXRNYXgpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJvdW5kcyA9IF9nZXRCb3VuZHMocGluLCB0cnVlKSxcbiAgICAgICAgICAgICAgICAgICAgX29mZnNldCA9IHNjcm9sbCAtIHN0YXJ0O1xuXG4gICAgICAgICAgICAgICAgX3JlcGFyZW50KHBpbiwgX2JvZHksIGJvdW5kcy50b3AgKyAoZGlyZWN0aW9uID09PSBfdmVydGljYWwgPyBfb2Zmc2V0IDogMCkgKyBfcHgsIGJvdW5kcy5sZWZ0ICsgKGRpcmVjdGlvbiA9PT0gX3ZlcnRpY2FsID8gMCA6IF9vZmZzZXQpICsgX3B4KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfcmVwYXJlbnQocGluLCBzcGFjZXIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF9zZXRTdGF0ZShpc0FjdGl2ZSB8fCBpc0F0TWF4ID8gcGluQWN0aXZlU3RhdGUgOiBwaW5TdGF0ZSk7XG5cbiAgICAgICAgICAgIHBpbk1vdmVzICYmIGNsaXBwZWQgPCAxICYmIGlzQWN0aXZlIHx8IHBpblNldHRlcihwaW5TdGFydCArIChjbGlwcGVkID09PSAxICYmICFpc0F0TWF4ID8gcGluQ2hhbmdlIDogMCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNuYXAgJiYgIXR3ZWVuVG8udHdlZW4gJiYgIV9yZWZyZXNoaW5nICYmICFfc3RhcnR1cCAmJiBzbmFwRGVsYXllZENhbGwucmVzdGFydCh0cnVlKTtcbiAgICAgICAgdG9nZ2xlQ2xhc3MgJiYgKHRvZ2dsZWQgfHwgb25jZSAmJiBjbGlwcGVkICYmIChjbGlwcGVkIDwgMSB8fCAhX2xpbWl0Q2FsbGJhY2tzKSkgJiYgX3RvQXJyYXkodG9nZ2xlQ2xhc3MudGFyZ2V0cykuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICByZXR1cm4gZWwuY2xhc3NMaXN0W2lzQWN0aXZlIHx8IG9uY2UgPyBcImFkZFwiIDogXCJyZW1vdmVcIl0odG9nZ2xlQ2xhc3MuY2xhc3NOYW1lKTtcbiAgICAgICAgfSk7IC8vIGNsYXNzZXMgY291bGQgYWZmZWN0IHBvc2l0aW9uaW5nLCBzbyBkbyBpdCBldmVuIGlmIHJlc2V0IG9yIHJlZnJlc2hpbmcgaXMgdHJ1ZS5cblxuICAgICAgICBvblVwZGF0ZSAmJiAhaXNUb2dnbGUgJiYgIXJlc2V0ICYmIG9uVXBkYXRlKHNlbGYpO1xuXG4gICAgICAgIGlmIChzdGF0ZUNoYW5nZWQgJiYgIV9yZWZyZXNoaW5nKSB7XG4gICAgICAgICAgaWYgKGlzVG9nZ2xlKSB7XG4gICAgICAgICAgICBpZiAoaXNUYWtpbmdBY3Rpb24pIHtcbiAgICAgICAgICAgICAgaWYgKGFjdGlvbiA9PT0gXCJjb21wbGV0ZVwiKSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uLnBhdXNlKCkudG90YWxQcm9ncmVzcygxKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChhY3Rpb24gPT09IFwicmVzZXRcIikge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbi5yZXN0YXJ0KHRydWUpLnBhdXNlKCk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uID09PSBcInJlc3RhcnRcIikge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbi5yZXN0YXJ0KHRydWUpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvblthY3Rpb25dKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb25VcGRhdGUgJiYgb25VcGRhdGUoc2VsZik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRvZ2dsZWQgfHwgIV9saW1pdENhbGxiYWNrcykge1xuICAgICAgICAgICAgLy8gb24gc3RhcnR1cCwgdGhlIHBhZ2UgY291bGQgYmUgc2Nyb2xsZWQgYW5kIHdlIGRvbid0IHdhbnQgdG8gZmlyZSBjYWxsYmFja3MgdGhhdCBkaWRuJ3QgdG9nZ2xlLiBGb3IgZXhhbXBsZSBvbkVudGVyIHNob3VsZG4ndCBmaXJlIGlmIHRoZSBTY3JvbGxUcmlnZ2VyIGlzbid0IGFjdHVhbGx5IGVudGVyZWQuXG4gICAgICAgICAgICBvblRvZ2dsZSAmJiB0b2dnbGVkICYmIF9jYWxsYmFjayhzZWxmLCBvblRvZ2dsZSk7XG4gICAgICAgICAgICBjYWxsYmFja3NbdG9nZ2xlU3RhdGVdICYmIF9jYWxsYmFjayhzZWxmLCBjYWxsYmFja3NbdG9nZ2xlU3RhdGVdKTtcbiAgICAgICAgICAgIG9uY2UgJiYgKGNsaXBwZWQgPT09IDEgPyBzZWxmLmtpbGwoZmFsc2UsIDEpIDogY2FsbGJhY2tzW3RvZ2dsZVN0YXRlXSA9IDApOyAvLyBhIGNhbGxiYWNrIHNob3VsZG4ndCBiZSBjYWxsZWQgYWdhaW4gaWYgb25jZSBpcyB0cnVlLlxuXG4gICAgICAgICAgICBpZiAoIXRvZ2dsZWQpIHtcbiAgICAgICAgICAgICAgLy8gaXQncyBwb3NzaWJsZSB0byBnbyBjb21wbGV0ZWx5IHBhc3QsIGxpa2UgZnJvbSBiZWZvcmUgdGhlIHN0YXJ0IHRvIGFmdGVyIHRoZSBlbmQgKG9yIHZpY2UtdmVyc2EpIGluIHdoaWNoIGNhc2UgQk9USCBjYWxsYmFja3Mgc2hvdWxkIGJlIGZpcmVkIGluIHRoYXQgb3JkZXJcbiAgICAgICAgICAgICAgdG9nZ2xlU3RhdGUgPSBjbGlwcGVkID09PSAxID8gMSA6IDM7XG4gICAgICAgICAgICAgIGNhbGxiYWNrc1t0b2dnbGVTdGF0ZV0gJiYgX2NhbGxiYWNrKHNlbGYsIGNhbGxiYWNrc1t0b2dnbGVTdGF0ZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChmYXN0U2Nyb2xsRW5kICYmICFpc0FjdGl2ZSAmJiBNYXRoLmFicyhzZWxmLmdldFZlbG9jaXR5KCkpID4gKF9pc051bWJlcihmYXN0U2Nyb2xsRW5kKSA/IGZhc3RTY3JvbGxFbmQgOiAyNTAwKSkge1xuICAgICAgICAgICAgX2VuZEFuaW1hdGlvbihzZWxmLmNhbGxiYWNrQW5pbWF0aW9uKTtcblxuICAgICAgICAgICAgc2NydWJUd2VlbiA/IHNjcnViVHdlZW4ucHJvZ3Jlc3MoMSkgOiBfZW5kQW5pbWF0aW9uKGFuaW1hdGlvbiwgYWN0aW9uID09PSBcInJldmVyc2VcIiA/IDEgOiAhY2xpcHBlZCwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGlzVG9nZ2xlICYmIG9uVXBkYXRlICYmICFfcmVmcmVzaGluZykge1xuICAgICAgICAgIG9uVXBkYXRlKHNlbGYpO1xuICAgICAgICB9XG4gICAgICB9IC8vIHVwZGF0ZSBhYnNvbHV0ZWx5LXBvc2l0aW9uZWQgbWFya2VycyAob25seSBpZiB0aGUgc2Nyb2xsZXIgaXNuJ3QgdGhlIHZpZXdwb3J0KVxuXG5cbiAgICAgIGlmIChtYXJrZXJFbmRTZXR0ZXIpIHtcbiAgICAgICAgdmFyIG4gPSBjb250YWluZXJBbmltYXRpb24gPyBzY3JvbGwgLyBjb250YWluZXJBbmltYXRpb24uZHVyYXRpb24oKSAqIChjb250YWluZXJBbmltYXRpb24uX2NhU2Nyb2xsRGlzdCB8fCAwKSA6IHNjcm9sbDtcbiAgICAgICAgbWFya2VyU3RhcnRTZXR0ZXIobiArIChtYXJrZXJTdGFydFRyaWdnZXIuX2lzRmxpcHBlZCA/IDEgOiAwKSk7XG4gICAgICAgIG1hcmtlckVuZFNldHRlcihuKTtcbiAgICAgIH1cblxuICAgICAgY2FNYXJrZXJTZXR0ZXIgJiYgY2FNYXJrZXJTZXR0ZXIoLXNjcm9sbCAvIGNvbnRhaW5lckFuaW1hdGlvbi5kdXJhdGlvbigpICogKGNvbnRhaW5lckFuaW1hdGlvbi5fY2FTY3JvbGxEaXN0IHx8IDApKTtcbiAgICB9O1xuXG4gICAgc2VsZi5lbmFibGUgPSBmdW5jdGlvbiAocmVzZXQsIHJlZnJlc2gpIHtcbiAgICAgIGlmICghc2VsZi5lbmFibGVkKSB7XG4gICAgICAgIHNlbGYuZW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgX2FkZExpc3RlbmVyKHNjcm9sbGVyLCBcInJlc2l6ZVwiLCBfb25SZXNpemUpO1xuXG4gICAgICAgIGlzVmlld3BvcnQgfHwgX2FkZExpc3RlbmVyKHNjcm9sbGVyLCBcInNjcm9sbFwiLCBfb25TY3JvbGwpO1xuICAgICAgICBvblJlZnJlc2hJbml0ICYmIF9hZGRMaXN0ZW5lcihTY3JvbGxUcmlnZ2VyLCBcInJlZnJlc2hJbml0XCIsIG9uUmVmcmVzaEluaXQpO1xuXG4gICAgICAgIGlmIChyZXNldCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBzZWxmLnByb2dyZXNzID0gcHJldlByb2dyZXNzID0gMDtcbiAgICAgICAgICBzY3JvbGwxID0gc2Nyb2xsMiA9IGxhc3RTbmFwID0gc2Nyb2xsRnVuYygpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVmcmVzaCAhPT0gZmFsc2UgJiYgc2VsZi5yZWZyZXNoKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHNlbGYuZ2V0VHdlZW4gPSBmdW5jdGlvbiAoc25hcCkge1xuICAgICAgcmV0dXJuIHNuYXAgJiYgdHdlZW5UbyA/IHR3ZWVuVG8udHdlZW4gOiBzY3J1YlR3ZWVuO1xuICAgIH07XG5cbiAgICBzZWxmLnNldFBvc2l0aW9ucyA9IGZ1bmN0aW9uIChuZXdTdGFydCwgbmV3RW5kLCBrZWVwQ2xhbXAsIHBpbk9mZnNldCkge1xuICAgICAgLy8gZG9lc24ndCBwZXJzaXN0IGFmdGVyIHJlZnJlc2goKSEgSW50ZW5kZWQgdG8gYmUgYSB3YXkgdG8gb3ZlcnJpZGUgdmFsdWVzIHRoYXQgd2VyZSBzZXQgZHVyaW5nIHJlZnJlc2goKSwgbGlrZSB5b3UgY291bGQgc2V0IGl0IGluIG9uUmVmcmVzaCgpXG4gICAgICBpZiAoY29udGFpbmVyQW5pbWF0aW9uKSB7XG4gICAgICAgIC8vIGNvbnZlcnQgcmF0aW9zIGludG8gc2Nyb2xsIHBvc2l0aW9ucy4gUmVtZW1iZXIsIHN0YXJ0L2VuZCB2YWx1ZXMgb24gU2Nyb2xsVHJpZ2dlcnMgdGhhdCBoYXZlIGEgY29udGFpbmVyQW5pbWF0aW9uIHJlZmVyIHRvIHRoZSB0aW1lIChpbiBzZWNvbmRzKSwgTk9UIHNjcm9sbCBwb3NpdGlvbnMuXG4gICAgICAgIHZhciBzdCA9IGNvbnRhaW5lckFuaW1hdGlvbi5zY3JvbGxUcmlnZ2VyLFxuICAgICAgICAgICAgZHVyYXRpb24gPSBjb250YWluZXJBbmltYXRpb24uZHVyYXRpb24oKSxcbiAgICAgICAgICAgIF9jaGFuZ2UgPSBzdC5lbmQgLSBzdC5zdGFydDtcblxuICAgICAgICBuZXdTdGFydCA9IHN0LnN0YXJ0ICsgX2NoYW5nZSAqIG5ld1N0YXJ0IC8gZHVyYXRpb247XG4gICAgICAgIG5ld0VuZCA9IHN0LnN0YXJ0ICsgX2NoYW5nZSAqIG5ld0VuZCAvIGR1cmF0aW9uO1xuICAgICAgfVxuXG4gICAgICBzZWxmLnJlZnJlc2goZmFsc2UsIGZhbHNlLCB7XG4gICAgICAgIHN0YXJ0OiBfa2VlcENsYW1wKG5ld1N0YXJ0LCBrZWVwQ2xhbXAgJiYgISFzZWxmLl9zdGFydENsYW1wKSxcbiAgICAgICAgZW5kOiBfa2VlcENsYW1wKG5ld0VuZCwga2VlcENsYW1wICYmICEhc2VsZi5fZW5kQ2xhbXApXG4gICAgICB9LCBwaW5PZmZzZXQpO1xuICAgICAgc2VsZi51cGRhdGUoKTtcbiAgICB9O1xuXG4gICAgc2VsZi5hZGp1c3RQaW5TcGFjaW5nID0gZnVuY3Rpb24gKGFtb3VudCkge1xuICAgICAgaWYgKHNwYWNlclN0YXRlICYmIGFtb3VudCkge1xuICAgICAgICB2YXIgaSA9IHNwYWNlclN0YXRlLmluZGV4T2YoZGlyZWN0aW9uLmQpICsgMTtcbiAgICAgICAgc3BhY2VyU3RhdGVbaV0gPSBwYXJzZUZsb2F0KHNwYWNlclN0YXRlW2ldKSArIGFtb3VudCArIF9weDtcbiAgICAgICAgc3BhY2VyU3RhdGVbMV0gPSBwYXJzZUZsb2F0KHNwYWNlclN0YXRlWzFdKSArIGFtb3VudCArIF9weDtcblxuICAgICAgICBfc2V0U3RhdGUoc3BhY2VyU3RhdGUpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBzZWxmLmRpc2FibGUgPSBmdW5jdGlvbiAocmVzZXQsIGFsbG93QW5pbWF0aW9uKSB7XG4gICAgICByZXNldCAhPT0gZmFsc2UgJiYgc2VsZi5yZXZlcnQodHJ1ZSwgdHJ1ZSk7XG5cbiAgICAgIGlmIChzZWxmLmVuYWJsZWQpIHtcbiAgICAgICAgc2VsZi5lbmFibGVkID0gc2VsZi5pc0FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICBhbGxvd0FuaW1hdGlvbiB8fCBzY3J1YlR3ZWVuICYmIHNjcnViVHdlZW4ucGF1c2UoKTtcbiAgICAgICAgcHJldlNjcm9sbCA9IDA7XG4gICAgICAgIHBpbkNhY2hlICYmIChwaW5DYWNoZS51bmNhY2hlID0gMSk7XG4gICAgICAgIG9uUmVmcmVzaEluaXQgJiYgX3JlbW92ZUxpc3RlbmVyKFNjcm9sbFRyaWdnZXIsIFwicmVmcmVzaEluaXRcIiwgb25SZWZyZXNoSW5pdCk7XG5cbiAgICAgICAgaWYgKHNuYXBEZWxheWVkQ2FsbCkge1xuICAgICAgICAgIHNuYXBEZWxheWVkQ2FsbC5wYXVzZSgpO1xuICAgICAgICAgIHR3ZWVuVG8udHdlZW4gJiYgdHdlZW5Uby50d2Vlbi5raWxsKCkgJiYgKHR3ZWVuVG8udHdlZW4gPSAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNWaWV3cG9ydCkge1xuICAgICAgICAgIHZhciBpID0gX3RyaWdnZXJzLmxlbmd0aDtcblxuICAgICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIGlmIChfdHJpZ2dlcnNbaV0uc2Nyb2xsZXIgPT09IHNjcm9sbGVyICYmIF90cmlnZ2Vyc1tpXSAhPT0gc2VsZikge1xuICAgICAgICAgICAgICByZXR1cm47IC8vZG9uJ3QgcmVtb3ZlIHRoZSBsaXN0ZW5lcnMgaWYgdGhlcmUgYXJlIHN0aWxsIG90aGVyIHRyaWdnZXJzIHJlZmVyZW5jaW5nIGl0LlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIF9yZW1vdmVMaXN0ZW5lcihzY3JvbGxlciwgXCJyZXNpemVcIiwgX29uUmVzaXplKTtcblxuICAgICAgICAgIGlzVmlld3BvcnQgfHwgX3JlbW92ZUxpc3RlbmVyKHNjcm9sbGVyLCBcInNjcm9sbFwiLCBfb25TY3JvbGwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHNlbGYua2lsbCA9IGZ1bmN0aW9uIChyZXZlcnQsIGFsbG93QW5pbWF0aW9uKSB7XG4gICAgICBzZWxmLmRpc2FibGUocmV2ZXJ0LCBhbGxvd0FuaW1hdGlvbik7XG4gICAgICBzY3J1YlR3ZWVuICYmICFhbGxvd0FuaW1hdGlvbiAmJiBzY3J1YlR3ZWVuLmtpbGwoKTtcbiAgICAgIGlkICYmIGRlbGV0ZSBfaWRzW2lkXTtcblxuICAgICAgdmFyIGkgPSBfdHJpZ2dlcnMuaW5kZXhPZihzZWxmKTtcblxuICAgICAgaSA+PSAwICYmIF90cmlnZ2Vycy5zcGxpY2UoaSwgMSk7XG4gICAgICBpID09PSBfaSAmJiBfZGlyZWN0aW9uID4gMCAmJiBfaS0tOyAvLyBpZiB3ZSdyZSBpbiB0aGUgbWlkZGxlIG9mIGEgcmVmcmVzaCgpIG9yIHVwZGF0ZSgpLCBzcGxpY2luZyB3b3VsZCBjYXVzZSBza2lwcyBpbiB0aGUgaW5kZXgsIHNvIGFkanVzdC4uLlxuICAgICAgLy8gaWYgbm8gb3RoZXIgU2Nyb2xsVHJpZ2dlciBpbnN0YW5jZXMgb2YgdGhlIHNhbWUgc2Nyb2xsZXIgYXJlIGZvdW5kLCB3aXBlIG91dCBhbnkgcmVjb3JkZWQgc2Nyb2xsIHBvc2l0aW9uLiBPdGhlcndpc2UsIGluIGEgc2luZ2xlIHBhZ2UgYXBwbGljYXRpb24sIGZvciBleGFtcGxlLCBpdCBjb3VsZCBtYWludGFpbiBzY3JvbGwgcG9zaXRpb24gd2hlbiBpdCByZWFsbHkgc2hvdWxkbid0LiBTa2lwIHdoaWxlIF9pc1JldmVydGVkIHNvIG1hdGNoTWVkaWFJbml0J3MgcHJlLXJldmVydCByZWNvcmRpbmcgc3Vydml2ZXMgY29udGV4dC5raWxsIGJlZm9yZSBvbk1hdGNoIHJlY3JlYXRlcyB0cmlnZ2Vycy5cblxuICAgICAgaSA9IDA7XG5cbiAgICAgIF90cmlnZ2Vycy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHJldHVybiB0LnNjcm9sbGVyID09PSBzZWxmLnNjcm9sbGVyICYmIChpID0gMSk7XG4gICAgICB9KTtcblxuICAgICAgaSB8fCBfcmVmcmVzaGluZ0FsbCB8fCBfaXNSZXZlcnRlZCB8fCAoc2VsZi5zY3JvbGwucmVjID0gMCk7XG5cbiAgICAgIGlmIChhbmltYXRpb24pIHtcbiAgICAgICAgYW5pbWF0aW9uLnNjcm9sbFRyaWdnZXIgPSBudWxsO1xuICAgICAgICByZXZlcnQgJiYgYW5pbWF0aW9uLnJldmVydCh7XG4gICAgICAgICAga2lsbDogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIGFsbG93QW5pbWF0aW9uIHx8IGFuaW1hdGlvbi5raWxsKCk7XG4gICAgICB9XG5cbiAgICAgIG1hcmtlclN0YXJ0ICYmIFttYXJrZXJTdGFydCwgbWFya2VyRW5kLCBtYXJrZXJTdGFydFRyaWdnZXIsIG1hcmtlckVuZFRyaWdnZXJdLmZvckVhY2goZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgcmV0dXJuIG0ucGFyZW50Tm9kZSAmJiBtLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobSk7XG4gICAgICB9KTtcbiAgICAgIF9wcmltYXJ5ID09PSBzZWxmICYmIChfcHJpbWFyeSA9IDApO1xuXG4gICAgICBpZiAocGluKSB7XG4gICAgICAgIHBpbkNhY2hlICYmIChwaW5DYWNoZS51bmNhY2hlID0gMSk7XG4gICAgICAgIGkgPSAwO1xuXG4gICAgICAgIF90cmlnZ2Vycy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgcmV0dXJuIHQucGluID09PSBwaW4gJiYgaSsrO1xuICAgICAgICB9KTtcblxuICAgICAgICBpIHx8IChwaW5DYWNoZS5zcGFjZXIgPSAwKTsgLy8gaWYgdGhlcmUgYXJlbid0IGFueSBtb3JlIFNjcm9sbFRyaWdnZXJzIHdpdGggdGhlIHNhbWUgcGluLCByZW1vdmUgdGhlIHNwYWNlciwgb3RoZXJ3aXNlIGl0IGNvdWxkIGJlIGNvbnRhbWluYXRlZCB3aXRoIG9sZC9zdGFsZSB2YWx1ZXMgaWYgdGhlIHVzZXIgcmUtY3JlYXRlcyBhIFNjcm9sbFRyaWdnZXIgZm9yIHRoZSBzYW1lIGVsZW1lbnQuXG4gICAgICB9XG5cbiAgICAgIHZhcnMub25LaWxsICYmIHZhcnMub25LaWxsKHNlbGYpO1xuICAgIH07XG5cbiAgICBfdHJpZ2dlcnMucHVzaChzZWxmKTtcblxuICAgIHNlbGYuZW5hYmxlKGZhbHNlLCBmYWxzZSk7XG4gICAgY3VzdG9tUmV2ZXJ0UmV0dXJuICYmIGN1c3RvbVJldmVydFJldHVybihzZWxmKTtcblxuICAgIGlmIChhbmltYXRpb24gJiYgYW5pbWF0aW9uLmFkZCAmJiAhY2hhbmdlKSB7XG4gICAgICAvLyBpZiB0aGUgYW5pbWF0aW9uIGlzIGEgdGltZWxpbmUsIGl0IG1heSBub3QgaGF2ZSBiZWVuIHBvcHVsYXRlZCB5ZXQsIHNvIGl0IHdvdWxkbid0IHJlbmRlciBhdCB0aGUgcHJvcGVyIHBsYWNlIG9uIHRoZSBmaXJzdCByZWZyZXNoKCksIHRodXMgd2Ugc2hvdWxkIHNjaGVkdWxlIG9uZSBmb3IgdGhlIG5leHQgdGljay4gSWYgXCJjaGFuZ2VcIiBpcyBkZWZpbmVkLCB3ZSBrbm93IGl0IG11c3QgYmUgcmUtZW5hYmxpbmcsIHRodXMgd2UgY2FuIHJlZnJlc2goKSByaWdodCBhd2F5LlxuICAgICAgdmFyIHVwZGF0ZUZ1bmMgPSBzZWxmLnVwZGF0ZTsgLy8gc29tZSBicm93c2VycyBtYXkgZmlyZSBhIHNjcm9sbCBldmVudCBCRUZPUkUgYSB0aWNrIGVsYXBzZXMgYW5kL29yIHRoZSBET01Db250ZW50TG9hZGVkIGZpcmVzLiBTbyB0aGVyZSdzIGEgY2hhbmNlIHVwZGF0ZSgpIHdpbGwgYmUgY2FsbGVkIEJFRk9SRSBhIHJlZnJlc2goKSBoYXMgaGFwcGVuZWQgb24gYSBUaW1lbGluZS1hdHRhY2hlZCBTY3JvbGxUcmlnZ2VyIHdoaWNoIG1lYW5zIHRoZSBzdGFydC9lbmQgd29uJ3QgYmUgY2FsY3VsYXRlZCB5ZXQuIFdlIGRvbid0IHdhbnQgdG8gYWRkIGNvbmRpdGlvbmFsIGxvZ2ljIGluc2lkZSB0aGUgdXBkYXRlKCkgbWV0aG9kIChsaWtlIGNoZWNrIHRvIHNlZSBpZiBlbmQgaXMgZGVmaW5lZCBhbmQgaWYgbm90LCBmb3JjZSBhIHJlZnJlc2goKSkgYmVjYXVzZSB0aGF0J3MgYSBmdW5jdGlvbiB0aGF0IGdldHMgaGl0IGEgTE9UIChwZXJmb3JtYW5jZSkuIFNvIHdlIHN3YXAgb3V0IHRoZSByZWFsIHVwZGF0ZSgpIG1ldGhvZCBmb3IgdGhpcyBvbmUgdGhhdCdsbCByZS1hdHRhY2ggaXQgdGhlIGZpcnN0IHRpbWUgaXQgZ2V0cyBjYWxsZWQgYW5kIG9mIGNvdXJzZSBmb3JjZXMgYSByZWZyZXNoKCkuXG5cbiAgICAgIHNlbGYudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLnVwZGF0ZSA9IHVwZGF0ZUZ1bmM7XG4gICAgICAgIF9zY3JvbGxlcnMuY2FjaGUrKzsgLy8gb3RoZXJ3aXNlIGEgY2FjaGVkIHNjcm9sbCBwb3NpdGlvbiBtYXkgZ2V0IHVzZWQgaW4gdGhlIHJlZnJlc2goKSBpbiBhIHZlcnkgcmFyZSBzY2VuYXJpbywgbGlrZSBpZiBTY3JvbGxUcmlnZ2VycyBhcmUgY3JlYXRlZCBpbnNpZGUgYSBET01Db250ZW50TG9hZGVkIGV2ZW50IGFuZCB0aGUgcXVldWVkIHJlcXVlc3RBbmltYXRpb25GcmFtZSgpIGZpcmVzIGJlZm9yZWhhbmQuIFNlZSBodHRwczovL2dzYXAuY29tL2NvbW11bml0eS9mb3J1bXMvdG9waWMvNDEyNjctc2Nyb2xsdHJpZ2dlci1icmVha3Mtb24tcmVmcmVzaC13aGVuLXVzaW5nLWRvbWNvbnRlbnRsb2FkZWQvXG5cbiAgICAgICAgc3RhcnQgfHwgZW5kIHx8IHNlbGYucmVmcmVzaCgpO1xuICAgICAgfTtcblxuICAgICAgZ3NhcC5kZWxheWVkQ2FsbCgwLjAxLCBzZWxmLnVwZGF0ZSk7XG4gICAgICBjaGFuZ2UgPSAwLjAxO1xuICAgICAgc3RhcnQgPSBlbmQgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICBwaW4gJiYgX3F1ZXVlUmVmcmVzaEFsbCgpOyAvLyBwaW5uaW5nIGNvdWxkIGFmZmVjdCB0aGUgcG9zaXRpb25zIG9mIG90aGVyIHRoaW5ncywgc28gbWFrZSBzdXJlIHdlIHF1ZXVlIGEgZnVsbCByZWZyZXNoKClcbiAgfTtcblxuICBTY3JvbGxUcmlnZ2VyLnJlZ2lzdGVyID0gZnVuY3Rpb24gcmVnaXN0ZXIoY29yZSkge1xuICAgIGlmICghX2NvcmVJbml0dGVkKSB7XG4gICAgICBnc2FwID0gY29yZSB8fCBfZ2V0R1NBUCgpO1xuICAgICAgX3dpbmRvd0V4aXN0cygpICYmIHdpbmRvdy5kb2N1bWVudCAmJiBTY3JvbGxUcmlnZ2VyLmVuYWJsZSgpO1xuICAgICAgX2NvcmVJbml0dGVkID0gX2VuYWJsZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIF9jb3JlSW5pdHRlZDtcbiAgfTtcblxuICBTY3JvbGxUcmlnZ2VyLmRlZmF1bHRzID0gZnVuY3Rpb24gZGVmYXVsdHMoY29uZmlnKSB7XG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgZm9yICh2YXIgcCBpbiBjb25maWcpIHtcbiAgICAgICAgX2RlZmF1bHRzW3BdID0gY29uZmlnW3BdO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBfZGVmYXVsdHM7XG4gIH07XG5cbiAgU2Nyb2xsVHJpZ2dlci5kaXNhYmxlID0gZnVuY3Rpb24gZGlzYWJsZShyZXNldCwga2lsbCkge1xuICAgIF9lbmFibGVkID0gMDtcblxuICAgIF90cmlnZ2Vycy5mb3JFYWNoKGZ1bmN0aW9uICh0cmlnZ2VyKSB7XG4gICAgICByZXR1cm4gdHJpZ2dlcltraWxsID8gXCJraWxsXCIgOiBcImRpc2FibGVcIl0ocmVzZXQpO1xuICAgIH0pO1xuXG4gICAgX3JlbW92ZUxpc3RlbmVyKF93aW4sIFwid2hlZWxcIiwgX29uU2Nyb2xsKTtcblxuICAgIF9yZW1vdmVMaXN0ZW5lcihfZG9jLCBcInNjcm9sbFwiLCBfb25TY3JvbGwpO1xuXG4gICAgY2xlYXJJbnRlcnZhbChfc3luY0ludGVydmFsKTtcblxuICAgIF9yZW1vdmVMaXN0ZW5lcihfZG9jLCBcInRvdWNoY2FuY2VsXCIsIF9wYXNzVGhyb3VnaCk7XG5cbiAgICBfcmVtb3ZlTGlzdGVuZXIoX2JvZHksIFwidG91Y2hzdGFydFwiLCBfcGFzc1Rocm91Z2gpO1xuXG4gICAgX211bHRpTGlzdGVuZXIoX3JlbW92ZUxpc3RlbmVyLCBfZG9jLCBcInBvaW50ZXJkb3duLHRvdWNoc3RhcnQsbW91c2Vkb3duXCIsIF9wb2ludGVyRG93bkhhbmRsZXIpO1xuXG4gICAgX211bHRpTGlzdGVuZXIoX3JlbW92ZUxpc3RlbmVyLCBfZG9jLCBcInBvaW50ZXJ1cCx0b3VjaGVuZCxtb3VzZXVwXCIsIF9wb2ludGVyVXBIYW5kbGVyKTtcblxuICAgIF9yZXNpemVEZWxheS5raWxsKCk7XG5cbiAgICBfaXRlcmF0ZUF1dG9SZWZyZXNoKF9yZW1vdmVMaXN0ZW5lcik7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IF9zY3JvbGxlcnMubGVuZ3RoOyBpICs9IDMpIHtcbiAgICAgIF93aGVlbExpc3RlbmVyKF9yZW1vdmVMaXN0ZW5lciwgX3Njcm9sbGVyc1tpXSwgX3Njcm9sbGVyc1tpICsgMV0pO1xuXG4gICAgICBfd2hlZWxMaXN0ZW5lcihfcmVtb3ZlTGlzdGVuZXIsIF9zY3JvbGxlcnNbaV0sIF9zY3JvbGxlcnNbaSArIDJdKTtcbiAgICB9XG4gIH07XG5cbiAgU2Nyb2xsVHJpZ2dlci5lbmFibGUgPSBmdW5jdGlvbiBlbmFibGUoKSB7XG4gICAgX3dpbiA9IHdpbmRvdztcbiAgICBfZG9jID0gZG9jdW1lbnQ7XG4gICAgX2RvY0VsID0gX2RvYy5kb2N1bWVudEVsZW1lbnQ7XG4gICAgX2JvZHkgPSBfZG9jLmJvZHk7XG5cbiAgICBpZiAoZ3NhcCkge1xuICAgICAgX3RvQXJyYXkgPSBnc2FwLnV0aWxzLnRvQXJyYXk7XG4gICAgICBfY2xhbXAgPSBnc2FwLnV0aWxzLmNsYW1wO1xuICAgICAgX2NvbnRleHQgPSBnc2FwLmNvcmUuY29udGV4dCB8fCBfcGFzc1Rocm91Z2g7XG4gICAgICBfc3VwcHJlc3NPdmVyd3JpdGVzID0gZ3NhcC5jb3JlLnN1cHByZXNzT3ZlcndyaXRlcyB8fCBfcGFzc1Rocm91Z2g7XG4gICAgICBfc2Nyb2xsUmVzdG9yYXRpb24gPSBfd2luLmhpc3Rvcnkuc2Nyb2xsUmVzdG9yYXRpb24gfHwgXCJhdXRvXCI7XG4gICAgICBfbGFzdFNjcm9sbCA9IF93aW4ucGFnZVlPZmZzZXQgfHwgMDtcbiAgICAgIGdzYXAuY29yZS5nbG9iYWxzKFwiU2Nyb2xsVHJpZ2dlclwiLCBTY3JvbGxUcmlnZ2VyKTsgLy8gbXVzdCByZWdpc3RlciB0aGUgZ2xvYmFsIG1hbnVhbGx5IGJlY2F1c2UgaW4gSW50ZXJuZXQgRXhwbG9yZXIsIGZ1bmN0aW9ucyAoY2xhc3NlcykgZG9uJ3QgaGF2ZSBhIFwibmFtZVwiIHByb3BlcnR5LlxuXG4gICAgICBpZiAoX2JvZHkpIHtcbiAgICAgICAgX2VuYWJsZWQgPSAxO1xuICAgICAgICBfZGl2MTAwdmggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpOyAvLyB0byBzb2x2ZSBtb2JpbGUgYnJvd3NlciBhZGRyZXNzIGJhciBzaG93L2hpZGUgcmVzaXppbmcsIHdlIHNob3VsZG4ndCByZWx5IG9uIHdpbmRvdy5pbm5lckhlaWdodC4gSW5zdGVhZCwgdXNlIGEgPGRpdj4gd2l0aCBpdHMgaGVpZ2h0IHNldCB0byAxMDB2aCBhbmQgbWVhc3VyZSB0aGF0IHNpbmNlIHRoYXQncyB3aGF0IHRoZSBzY3JvbGxpbmcgaXMgYmFzZWQgb24gYW55d2F5IGFuZCBpdCdzIG5vdCBhZmZlY3RlZCBieSBhZGRyZXNzIGJhciBzaG93aW5nL2hpZGluZy5cblxuICAgICAgICBfZGl2MTAwdmguc3R5bGUuaGVpZ2h0ID0gXCIxMDB2aFwiO1xuICAgICAgICBfZGl2MTAwdmguc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG5cbiAgICAgICAgX3JlZnJlc2gxMDB2aCgpO1xuXG4gICAgICAgIF9yYWZCdWdGaXgoKTtcblxuICAgICAgICBPYnNlcnZlci5yZWdpc3Rlcihnc2FwKTsgLy8gaXNUb3VjaCBpcyAwIGlmIG5vIHRvdWNoLCAxIGlmIE9OTFkgdG91Y2gsIGFuZCAyIGlmIGl0IGNhbiBhY2NvbW1vZGF0ZSB0b3VjaCBidXQgYWxzbyBvdGhlciB0eXBlcyBsaWtlIG1vdXNlL3BvaW50ZXIuXG5cbiAgICAgICAgU2Nyb2xsVHJpZ2dlci5pc1RvdWNoID0gT2JzZXJ2ZXIuaXNUb3VjaDtcbiAgICAgICAgX2ZpeElPU0J1ZyA9IE9ic2VydmVyLmlzVG91Y2ggJiYgLyhpUGFkfGlQaG9uZXxpUG9kfE1hYykvZy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpOyAvLyBzaW5jZSAyMDE3LCBpT1MgaGFzIGhhZCBhIGJ1ZyB0aGF0IGNhdXNlcyBldmVudC5jbGllbnRYL1kgdG8gYmUgaW5hY2N1cmF0ZSB3aGVuIGEgc2Nyb2xsIG9jY3VycywgdGh1cyB3ZSBtdXN0IGFsdGVybmF0ZSBpZ25vcmluZyBldmVyeSBvdGhlciB0b3VjaG1vdmUgZXZlbnQgdG8gd29yayBhcm91bmQgaXQuIFNlZSBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTgxOTU0IGFuZCBodHRwczovL2NvZGVwZW4uaW8vR3JlZW5Tb2NrL3Blbi9FeGJyUE5hLzA4N2NlZjE5N2RjMzU0NDVhMDk1MWU4OTM1YzQxNTAzXG5cbiAgICAgICAgX2lnbm9yZU1vYmlsZVJlc2l6ZSA9IE9ic2VydmVyLmlzVG91Y2ggPT09IDE7XG5cbiAgICAgICAgX2FkZExpc3RlbmVyKF93aW4sIFwid2hlZWxcIiwgX29uU2Nyb2xsKTsgLy8gbW9zdGx5IGZvciAzcmQgcGFydHkgc21vb3RoIHNjcm9sbGluZyBsaWJyYXJpZXMuXG5cblxuICAgICAgICBfcm9vdCA9IFtfd2luLCBfZG9jLCBfZG9jRWwsIF9ib2R5XTtcblxuICAgICAgICBpZiAoZ3NhcC5tYXRjaE1lZGlhKSB7XG4gICAgICAgICAgU2Nyb2xsVHJpZ2dlci5tYXRjaE1lZGlhID0gZnVuY3Rpb24gKHZhcnMpIHtcbiAgICAgICAgICAgIHZhciBtbSA9IGdzYXAubWF0Y2hNZWRpYSgpLFxuICAgICAgICAgICAgICAgIHA7XG5cbiAgICAgICAgICAgIGZvciAocCBpbiB2YXJzKSB7XG4gICAgICAgICAgICAgIG1tLmFkZChwLCB2YXJzW3BdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG1tO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICBnc2FwLmFkZEV2ZW50TGlzdGVuZXIoXCJtYXRjaE1lZGlhSW5pdFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfcmVjb3JkU2Nyb2xsUG9zaXRpb25zKCk7XG5cbiAgICAgICAgICAgIF9yZXZlcnRBbGwoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBnc2FwLmFkZEV2ZW50TGlzdGVuZXIoXCJtYXRjaE1lZGlhUmV2ZXJ0XCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfcmV2ZXJ0UmVjb3JkZWQoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBnc2FwLmFkZEV2ZW50TGlzdGVuZXIoXCJtYXRjaE1lZGlhXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF9yZWZyZXNoQWxsKDAsIDEpO1xuXG4gICAgICAgICAgICBfZGlzcGF0Y2goXCJtYXRjaE1lZGlhXCIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGdzYXAubWF0Y2hNZWRpYSgpLmFkZChcIihvcmllbnRhdGlvbjogcG9ydHJhaXQpXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIHdoZW4gb3JpZW50YXRpb24gY2hhbmdlcywgd2Ugc2hvdWxkIHRha2UgbmV3IGJhc2UgbWVhc3VyZW1lbnRzIGZvciB0aGUgaWdub3JlTW9iaWxlUmVzaXplIGZlYXR1cmUuXG4gICAgICAgICAgICBfc2V0QmFzZURpbWVuc2lvbnMoKTtcblxuICAgICAgICAgICAgcmV0dXJuIF9zZXRCYXNlRGltZW5zaW9ucztcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXCJSZXF1aXJlcyBHU0FQIDMuMTEuMCBvciBsYXRlclwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9zZXRCYXNlRGltZW5zaW9ucygpO1xuXG4gICAgICAgIF9hZGRMaXN0ZW5lcihfZG9jLCBcInNjcm9sbFwiLCBfb25TY3JvbGwpOyAvLyBzb21lIGJyb3dzZXJzIChsaWtlIENocm9tZSksIHRoZSB3aW5kb3cgc3RvcHMgZGlzcGF0Y2hpbmcgc2Nyb2xsIGV2ZW50cyBvbiB0aGUgd2luZG93IGlmIHlvdSBzY3JvbGwgcmVhbGx5IGZhc3QsIGJ1dCBpdCdzIGNvbnNpc3RlbnQgb24gdGhlIGRvY3VtZW50IVxuXG5cbiAgICAgICAgdmFyIGJvZHlIYXNTdHlsZSA9IF9ib2R5Lmhhc0F0dHJpYnV0ZShcInN0eWxlXCIpLFxuICAgICAgICAgICAgYm9keVN0eWxlID0gX2JvZHkuc3R5bGUsXG4gICAgICAgICAgICBib3JkZXIgPSBib2R5U3R5bGUuYm9yZGVyVG9wU3R5bGUsXG4gICAgICAgICAgICBBbmltYXRpb25Qcm90byA9IGdzYXAuY29yZS5BbmltYXRpb24ucHJvdG90eXBlLFxuICAgICAgICAgICAgYm91bmRzLFxuICAgICAgICAgICAgaTtcblxuICAgICAgICBBbmltYXRpb25Qcm90by5yZXZlcnQgfHwgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFuaW1hdGlvblByb3RvLCBcInJldmVydFwiLCB7XG4gICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGltZSgtMC4wMSwgdHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTsgLy8gb25seSBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkgKEFuaW1hdGlvbi5yZXZlcnQoKSB3YXMgYWRkZWQgYWZ0ZXIgMy4xMC40KVxuXG4gICAgICAgIGJvZHlTdHlsZS5ib3JkZXJUb3BTdHlsZSA9IFwic29saWRcIjsgLy8gd29ya3MgYXJvdW5kIGFuIGlzc3VlIHdoZXJlIGEgbWFyZ2luIG9mIGEgY2hpbGQgZWxlbWVudCBjb3VsZCB0aHJvdyBvZmYgdGhlIGJvdW5kcyBvZiB0aGUgX2JvZHksIG1ha2luZyBpdCBzZWVtIGxpa2UgdGhlcmUncyBhIG1hcmdpbiB3aGVuIHRoZXJlIGFjdHVhbGx5IGlzbid0LiBUaGUgYm9yZGVyIGVuc3VyZXMgdGhhdCB0aGUgYm91bmRzIGFyZSBhY2N1cmF0ZS5cblxuICAgICAgICBib3VuZHMgPSBfZ2V0Qm91bmRzKF9ib2R5KTtcbiAgICAgICAgX3ZlcnRpY2FsLm0gPSBNYXRoLnJvdW5kKGJvdW5kcy50b3AgKyBfdmVydGljYWwuc2MoKSkgfHwgMDsgLy8gYWNjb21tb2RhdGUgdGhlIG9mZnNldCBvZiB0aGUgPGJvZHk+IGNhdXNlZCBieSBtYXJnaW5zIGFuZC9vciBwYWRkaW5nXG5cbiAgICAgICAgX2hvcml6b250YWwubSA9IE1hdGgucm91bmQoYm91bmRzLmxlZnQgKyBfaG9yaXpvbnRhbC5zYygpKSB8fCAwO1xuICAgICAgICBib3JkZXIgPyBib2R5U3R5bGUuYm9yZGVyVG9wU3R5bGUgPSBib3JkZXIgOiBib2R5U3R5bGUucmVtb3ZlUHJvcGVydHkoXCJib3JkZXItdG9wLXN0eWxlXCIpO1xuXG4gICAgICAgIGlmICghYm9keUhhc1N0eWxlKSB7XG4gICAgICAgICAgLy8gU1NSIGZyYW1ld29ya3MgbGlrZSBOZXh0LmpzIGNvbXBsYWluIGlmIHRoaXMgYXR0cmlidXRlIGdldHMgYWRkZWQuXG4gICAgICAgICAgX2JvZHkuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJcIik7IC8vIGl0J3Mgbm90IGVub3VnaCB0byBqdXN0IHJlbW92ZUF0dHJpYnV0ZSgpIC0gd2UgbXVzdCBmaXJzdCBzZXQgaXQgdG8gZW1wdHksIG90aGVyd2lzZSBOZXh0LmpzIGNvbXBsYWlucy5cblxuXG4gICAgICAgICAgX2JvZHkucmVtb3ZlQXR0cmlidXRlKFwic3R5bGVcIik7XG4gICAgICAgIH0gLy8gVE9ETzogKD8pIG1heWJlIG1vdmUgdG8gbGV2ZXJhZ2luZyB0aGUgdmVsb2NpdHkgbWVjaGFuaXNtIGluIE9ic2VydmVyIGFuZCBza2lwIGludGVydmFscy5cblxuXG4gICAgICAgIF9zeW5jSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChfc3luYywgMjUwKTtcbiAgICAgICAgZ3NhcC5kZWxheWVkQ2FsbCgwLjUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gX3N0YXJ0dXAgPSAwO1xuICAgICAgICB9KTtcblxuICAgICAgICBfYWRkTGlzdGVuZXIoX2RvYywgXCJ0b3VjaGNhbmNlbFwiLCBfcGFzc1Rocm91Z2gpOyAvLyBzb21lIG9sZGVyIEFuZHJvaWQgZGV2aWNlcyBpbnRlcm1pdHRlbnRseSBzdG9wIGRpc3BhdGNoaW5nIFwidG91Y2htb3ZlXCIgZXZlbnRzIGlmIHdlIGRvbid0IGxpc3RlbiBmb3IgXCJ0b3VjaGNhbmNlbFwiIG9uIHRoZSBkb2N1bWVudC5cblxuXG4gICAgICAgIF9hZGRMaXN0ZW5lcihfYm9keSwgXCJ0b3VjaHN0YXJ0XCIsIF9wYXNzVGhyb3VnaCk7IC8vd29ya3MgYXJvdW5kIFNhZmFyaSBidWc6IGh0dHBzOi8vZ3NhcC5jb20vZm9ydW1zL3RvcGljLzIxNDUwLWRyYWdnYWJsZS1pbi1pZnJhbWUtb24tbW9iaWxlLWlzLWJ1Z2d5L1xuXG5cbiAgICAgICAgX211bHRpTGlzdGVuZXIoX2FkZExpc3RlbmVyLCBfZG9jLCBcInBvaW50ZXJkb3duLHRvdWNoc3RhcnQsbW91c2Vkb3duXCIsIF9wb2ludGVyRG93bkhhbmRsZXIpO1xuXG4gICAgICAgIF9tdWx0aUxpc3RlbmVyKF9hZGRMaXN0ZW5lciwgX2RvYywgXCJwb2ludGVydXAsdG91Y2hlbmQsbW91c2V1cFwiLCBfcG9pbnRlclVwSGFuZGxlcik7XG5cbiAgICAgICAgX3RyYW5zZm9ybVByb3AgPSBnc2FwLnV0aWxzLmNoZWNrUHJlZml4KFwidHJhbnNmb3JtXCIpO1xuXG4gICAgICAgIF9zdGF0ZVByb3BzLnB1c2goX3RyYW5zZm9ybVByb3ApO1xuXG4gICAgICAgIF9jb3JlSW5pdHRlZCA9IF9nZXRUaW1lKCk7XG4gICAgICAgIF9yZXNpemVEZWxheSA9IGdzYXAuZGVsYXllZENhbGwoMC4yLCBfcmVmcmVzaEFsbCkucGF1c2UoKTtcbiAgICAgICAgX2F1dG9SZWZyZXNoID0gW19kb2MsIFwidmlzaWJpbGl0eWNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIHcgPSBfd2luLmlubmVyV2lkdGgsXG4gICAgICAgICAgICAgIGggPSBfd2luLmlubmVySGVpZ2h0O1xuXG4gICAgICAgICAgaWYgKF9kb2MuaGlkZGVuKSB7XG4gICAgICAgICAgICBfcHJldldpZHRoID0gdztcbiAgICAgICAgICAgIF9wcmV2SGVpZ2h0ID0gaDtcbiAgICAgICAgICB9IGVsc2UgaWYgKF9wcmV2V2lkdGggIT09IHcgfHwgX3ByZXZIZWlnaHQgIT09IGgpIHtcbiAgICAgICAgICAgIF9vblJlc2l6ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgX2RvYywgXCJET01Db250ZW50TG9hZGVkXCIsIF9yZWZyZXNoQWxsLCBfd2luLCBcImxvYWRcIiwgX3JlZnJlc2hBbGwsIF93aW4sIFwicmVzaXplXCIsIF9vblJlc2l6ZV07XG5cbiAgICAgICAgX2l0ZXJhdGVBdXRvUmVmcmVzaChfYWRkTGlzdGVuZXIpO1xuXG4gICAgICAgIF90cmlnZ2Vycy5mb3JFYWNoKGZ1bmN0aW9uICh0cmlnZ2VyKSB7XG4gICAgICAgICAgcmV0dXJuIHRyaWdnZXIuZW5hYmxlKDAsIDEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgX3Njcm9sbGVycy5sZW5ndGg7IGkgKz0gMykge1xuICAgICAgICAgIF93aGVlbExpc3RlbmVyKF9yZW1vdmVMaXN0ZW5lciwgX3Njcm9sbGVyc1tpXSwgX3Njcm9sbGVyc1tpICsgMV0pO1xuXG4gICAgICAgICAgX3doZWVsTGlzdGVuZXIoX3JlbW92ZUxpc3RlbmVyLCBfc2Nyb2xsZXJzW2ldLCBfc2Nyb2xsZXJzW2kgKyAyXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoX2RvYykge1xuICAgICAgICB2YXIgb25Mb2FkID0gZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICAgIFNjcm9sbFRyaWdnZXIuZW5hYmxlKCk7XG5cbiAgICAgICAgICBfZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIG9uTG9hZCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgX2RvYy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBvbkxvYWQpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBTY3JvbGxUcmlnZ2VyLmNvbmZpZyA9IGZ1bmN0aW9uIGNvbmZpZyh2YXJzKSB7XG4gICAgXCJsaW1pdENhbGxiYWNrc1wiIGluIHZhcnMgJiYgKF9saW1pdENhbGxiYWNrcyA9ICEhdmFycy5saW1pdENhbGxiYWNrcyk7XG4gICAgdmFyIG1zID0gdmFycy5zeW5jSW50ZXJ2YWw7XG4gICAgbXMgJiYgY2xlYXJJbnRlcnZhbChfc3luY0ludGVydmFsKSB8fCAoX3N5bmNJbnRlcnZhbCA9IG1zKSAmJiBzZXRJbnRlcnZhbChfc3luYywgbXMpO1xuICAgIFwiaWdub3JlTW9iaWxlUmVzaXplXCIgaW4gdmFycyAmJiAoX2lnbm9yZU1vYmlsZVJlc2l6ZSA9IFNjcm9sbFRyaWdnZXIuaXNUb3VjaCA9PT0gMSAmJiB2YXJzLmlnbm9yZU1vYmlsZVJlc2l6ZSk7XG5cbiAgICBpZiAoXCJhdXRvUmVmcmVzaEV2ZW50c1wiIGluIHZhcnMpIHtcbiAgICAgIF9pdGVyYXRlQXV0b1JlZnJlc2goX3JlbW92ZUxpc3RlbmVyKSB8fCBfaXRlcmF0ZUF1dG9SZWZyZXNoKF9hZGRMaXN0ZW5lciwgdmFycy5hdXRvUmVmcmVzaEV2ZW50cyB8fCBcIm5vbmVcIik7XG4gICAgICBfaWdub3JlUmVzaXplID0gKHZhcnMuYXV0b1JlZnJlc2hFdmVudHMgKyBcIlwiKS5pbmRleE9mKFwicmVzaXplXCIpID09PSAtMTtcbiAgICB9XG4gIH07XG5cbiAgU2Nyb2xsVHJpZ2dlci5zY3JvbGxlclByb3h5ID0gZnVuY3Rpb24gc2Nyb2xsZXJQcm94eSh0YXJnZXQsIHZhcnMpIHtcbiAgICB2YXIgdCA9IF9nZXRUYXJnZXQodGFyZ2V0KSxcbiAgICAgICAgaSA9IF9zY3JvbGxlcnMuaW5kZXhPZih0KSxcbiAgICAgICAgaXNWaWV3cG9ydCA9IF9pc1ZpZXdwb3J0KHQpO1xuXG4gICAgaWYgKH5pKSB7XG4gICAgICBfc2Nyb2xsZXJzLnNwbGljZShpLCBpc1ZpZXdwb3J0ID8gNiA6IDIpO1xuICAgIH1cblxuICAgIGlmICh2YXJzKSB7XG4gICAgICBpc1ZpZXdwb3J0ID8gX3Byb3hpZXMudW5zaGlmdChfd2luLCB2YXJzLCBfYm9keSwgdmFycywgX2RvY0VsLCB2YXJzKSA6IF9wcm94aWVzLnVuc2hpZnQodCwgdmFycyk7XG4gICAgfVxuICB9O1xuXG4gIFNjcm9sbFRyaWdnZXIuY2xlYXJNYXRjaE1lZGlhID0gZnVuY3Rpb24gY2xlYXJNYXRjaE1lZGlhKHF1ZXJ5KSB7XG4gICAgX3RyaWdnZXJzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgIHJldHVybiB0Ll9jdHggJiYgdC5fY3R4LnF1ZXJ5ID09PSBxdWVyeSAmJiB0Ll9jdHgua2lsbCh0cnVlLCB0cnVlKTtcbiAgICB9KTtcbiAgfTtcblxuICBTY3JvbGxUcmlnZ2VyLmlzSW5WaWV3cG9ydCA9IGZ1bmN0aW9uIGlzSW5WaWV3cG9ydChlbGVtZW50LCByYXRpbywgaG9yaXpvbnRhbCkge1xuICAgIHZhciBib3VuZHMgPSAoX2lzU3RyaW5nKGVsZW1lbnQpID8gX2dldFRhcmdldChlbGVtZW50KSA6IGVsZW1lbnQpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICBvZmZzZXQgPSBib3VuZHNbaG9yaXpvbnRhbCA/IF93aWR0aCA6IF9oZWlnaHRdICogcmF0aW8gfHwgMDtcbiAgICByZXR1cm4gaG9yaXpvbnRhbCA/IGJvdW5kcy5yaWdodCAtIG9mZnNldCA+IDAgJiYgYm91bmRzLmxlZnQgKyBvZmZzZXQgPCBfd2luLmlubmVyV2lkdGggOiBib3VuZHMuYm90dG9tIC0gb2Zmc2V0ID4gMCAmJiBib3VuZHMudG9wICsgb2Zmc2V0IDwgX3dpbi5pbm5lckhlaWdodDtcbiAgfTtcblxuICBTY3JvbGxUcmlnZ2VyLnBvc2l0aW9uSW5WaWV3cG9ydCA9IGZ1bmN0aW9uIHBvc2l0aW9uSW5WaWV3cG9ydChlbGVtZW50LCByZWZlcmVuY2VQb2ludCwgaG9yaXpvbnRhbCkge1xuICAgIF9pc1N0cmluZyhlbGVtZW50KSAmJiAoZWxlbWVudCA9IF9nZXRUYXJnZXQoZWxlbWVudCkpO1xuICAgIHZhciBib3VuZHMgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICBzaXplID0gYm91bmRzW2hvcml6b250YWwgPyBfd2lkdGggOiBfaGVpZ2h0XSxcbiAgICAgICAgb2Zmc2V0ID0gcmVmZXJlbmNlUG9pbnQgPT0gbnVsbCA/IHNpemUgLyAyIDogcmVmZXJlbmNlUG9pbnQgaW4gX2tleXdvcmRzID8gX2tleXdvcmRzW3JlZmVyZW5jZVBvaW50XSAqIHNpemUgOiB+cmVmZXJlbmNlUG9pbnQuaW5kZXhPZihcIiVcIikgPyBwYXJzZUZsb2F0KHJlZmVyZW5jZVBvaW50KSAqIHNpemUgLyAxMDAgOiBwYXJzZUZsb2F0KHJlZmVyZW5jZVBvaW50KSB8fCAwO1xuICAgIHJldHVybiBob3Jpem9udGFsID8gKGJvdW5kcy5sZWZ0ICsgb2Zmc2V0KSAvIF93aW4uaW5uZXJXaWR0aCA6IChib3VuZHMudG9wICsgb2Zmc2V0KSAvIF93aW4uaW5uZXJIZWlnaHQ7XG4gIH07XG5cbiAgU2Nyb2xsVHJpZ2dlci5raWxsQWxsID0gZnVuY3Rpb24ga2lsbEFsbChhbGxvd0xpc3RlbmVycykge1xuICAgIF90cmlnZ2Vycy5zbGljZSgwKS5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICByZXR1cm4gdC52YXJzLmlkICE9PSBcIlNjcm9sbFNtb290aGVyXCIgJiYgdC5raWxsKCk7XG4gICAgfSk7XG5cbiAgICBpZiAoYWxsb3dMaXN0ZW5lcnMgIT09IHRydWUpIHtcbiAgICAgIHZhciBsaXN0ZW5lcnMgPSBfbGlzdGVuZXJzLmtpbGxBbGwgfHwgW107XG4gICAgICBfbGlzdGVuZXJzID0ge307XG4gICAgICBsaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbiAoZikge1xuICAgICAgICByZXR1cm4gZigpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBTY3JvbGxUcmlnZ2VyO1xufSgpO1xuU2Nyb2xsVHJpZ2dlci52ZXJzaW9uID0gXCIzLjE1LjFcIjtcblxuU2Nyb2xsVHJpZ2dlci5zYXZlU3R5bGVzID0gZnVuY3Rpb24gKHRhcmdldHMpIHtcbiAgcmV0dXJuIHRhcmdldHMgPyBfdG9BcnJheSh0YXJnZXRzKS5mb3JFYWNoKGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAvLyBzYXZlZCBzdHlsZXMgYXJlIHJlY29yZGVkIGluIGEgY29uc2VjdXRpdmUgYWx0ZXJuYXRpbmcgQXJyYXksIGxpa2UgW2VsZW1lbnQsIGNzc1RleHQsIHRyYW5zZm9ybSBhdHRyaWJ1dGUsIGNhY2hlLCBtYXRjaE1lZGlhLCAuLi5dXG4gICAgaWYgKHRhcmdldCAmJiB0YXJnZXQuc3R5bGUpIHtcbiAgICAgIHZhciBpID0gX3NhdmVkU3R5bGVzLmluZGV4T2YodGFyZ2V0KTtcblxuICAgICAgaSA+PSAwICYmIF9zYXZlZFN0eWxlcy5zcGxpY2UoaSwgNSk7XG5cbiAgICAgIF9zYXZlZFN0eWxlcy5wdXNoKHRhcmdldCwgdGFyZ2V0LnN0eWxlLmNzc1RleHQsIHRhcmdldC5nZXRCQm94ICYmIHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiksIGdzYXAuY29yZS5nZXRDYWNoZSh0YXJnZXQpLCBfY29udGV4dCgpKTtcbiAgICB9XG4gIH0pIDogX3NhdmVkU3R5bGVzO1xufTtcblxuU2Nyb2xsVHJpZ2dlci5yZXZlcnQgPSBmdW5jdGlvbiAoc29mdCwgbWVkaWEpIHtcbiAgcmV0dXJuIF9yZXZlcnRBbGwoIXNvZnQsIG1lZGlhKTtcbn07XG5cblNjcm9sbFRyaWdnZXIuY3JlYXRlID0gZnVuY3Rpb24gKHZhcnMsIGFuaW1hdGlvbikge1xuICByZXR1cm4gbmV3IFNjcm9sbFRyaWdnZXIodmFycywgYW5pbWF0aW9uKTtcbn07XG5cblNjcm9sbFRyaWdnZXIucmVmcmVzaCA9IGZ1bmN0aW9uIChzYWZlKSB7XG4gIHJldHVybiBzYWZlID8gX29uUmVzaXplKHRydWUpIDogKF9jb3JlSW5pdHRlZCB8fCBTY3JvbGxUcmlnZ2VyLnJlZ2lzdGVyKCkpICYmIF9yZWZyZXNoQWxsKHRydWUpO1xufTtcblxuU2Nyb2xsVHJpZ2dlci51cGRhdGUgPSBmdW5jdGlvbiAoZm9yY2UpIHtcbiAgcmV0dXJuICsrX3Njcm9sbGVycy5jYWNoZSAmJiBfdXBkYXRlQWxsKGZvcmNlID09PSB0cnVlID8gMiA6IDApO1xufTtcblxuU2Nyb2xsVHJpZ2dlci5jbGVhclNjcm9sbE1lbW9yeSA9IF9jbGVhclNjcm9sbE1lbW9yeTtcblxuU2Nyb2xsVHJpZ2dlci5tYXhTY3JvbGwgPSBmdW5jdGlvbiAoZWxlbWVudCwgaG9yaXpvbnRhbCkge1xuICByZXR1cm4gX21heFNjcm9sbChlbGVtZW50LCBob3Jpem9udGFsID8gX2hvcml6b250YWwgOiBfdmVydGljYWwpO1xufTtcblxuU2Nyb2xsVHJpZ2dlci5nZXRTY3JvbGxGdW5jID0gZnVuY3Rpb24gKGVsZW1lbnQsIGhvcml6b250YWwpIHtcbiAgcmV0dXJuIF9nZXRTY3JvbGxGdW5jKF9nZXRUYXJnZXQoZWxlbWVudCksIGhvcml6b250YWwgPyBfaG9yaXpvbnRhbCA6IF92ZXJ0aWNhbCk7XG59O1xuXG5TY3JvbGxUcmlnZ2VyLmdldEJ5SWQgPSBmdW5jdGlvbiAoaWQpIHtcbiAgcmV0dXJuIF9pZHNbaWRdO1xufTtcblxuU2Nyb2xsVHJpZ2dlci5nZXRBbGwgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBfdHJpZ2dlcnMuZmlsdGVyKGZ1bmN0aW9uICh0KSB7XG4gICAgcmV0dXJuIHQudmFycy5pZCAhPT0gXCJTY3JvbGxTbW9vdGhlclwiO1xuICB9KTtcbn07IC8vIGl0J3MgY29tbW9uIGZvciBwZW9wbGUgdG8gU2Nyb2xsVHJpZ2dlci5nZXRBbGwodCA9PiB0LmtpbGwoKSkgb24gcGFnZSByb3V0ZXMsIGZvciBleGFtcGxlLCBhbmQgd2UgZG9uJ3Qgd2FudCBpdCB0byBydWluIHNtb290aCBzY3JvbGxpbmcgYnkga2lsbGluZyB0aGUgbWFpbiBTY3JvbGxTbW9vdGhlciBvbmUuXG5cblxuU2Nyb2xsVHJpZ2dlci5pc1Njcm9sbGluZyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuICEhX2xhc3RTY3JvbGxUaW1lO1xufTtcblxuU2Nyb2xsVHJpZ2dlci5zbmFwRGlyZWN0aW9uYWwgPSBfc25hcERpcmVjdGlvbmFsO1xuXG5TY3JvbGxUcmlnZ2VyLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbiAodHlwZSwgY2FsbGJhY2spIHtcbiAgdmFyIGEgPSBfbGlzdGVuZXJzW3R5cGVdIHx8IChfbGlzdGVuZXJzW3R5cGVdID0gW10pO1xuICB+YS5pbmRleE9mKGNhbGxiYWNrKSB8fCBhLnB1c2goY2FsbGJhY2spO1xufTtcblxuU2Nyb2xsVHJpZ2dlci5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24gKHR5cGUsIGNhbGxiYWNrKSB7XG4gIHZhciBhID0gX2xpc3RlbmVyc1t0eXBlXSxcbiAgICAgIGkgPSBhICYmIGEuaW5kZXhPZihjYWxsYmFjayk7XG4gIGkgPj0gMCAmJiBhLnNwbGljZShpLCAxKTtcbn07XG5cblNjcm9sbFRyaWdnZXIuYmF0Y2ggPSBmdW5jdGlvbiAodGFyZ2V0cywgdmFycykge1xuICB2YXIgcmVzdWx0ID0gW10sXG4gICAgICB2YXJzQ29weSA9IHt9LFxuICAgICAgaW50ZXJ2YWwgPSB2YXJzLmludGVydmFsIHx8IDAuMDE2LFxuICAgICAgYmF0Y2hNYXggPSB2YXJzLmJhdGNoTWF4IHx8IDFlOSxcbiAgICAgIHByb3h5Q2FsbGJhY2sgPSBmdW5jdGlvbiBwcm94eUNhbGxiYWNrKHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGVsZW1lbnRzID0gW10sXG4gICAgICAgIHRyaWdnZXJzID0gW10sXG4gICAgICAgIGRlbGF5ID0gZ3NhcC5kZWxheWVkQ2FsbChpbnRlcnZhbCwgZnVuY3Rpb24gKCkge1xuICAgICAgY2FsbGJhY2soZWxlbWVudHMsIHRyaWdnZXJzKTtcbiAgICAgIGVsZW1lbnRzID0gW107XG4gICAgICB0cmlnZ2VycyA9IFtdO1xuICAgIH0pLnBhdXNlKCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzZWxmKSB7XG4gICAgICBlbGVtZW50cy5sZW5ndGggfHwgZGVsYXkucmVzdGFydCh0cnVlKTtcbiAgICAgIGVsZW1lbnRzLnB1c2goc2VsZi50cmlnZ2VyKTtcbiAgICAgIHRyaWdnZXJzLnB1c2goc2VsZik7XG4gICAgICBiYXRjaE1heCA8PSBlbGVtZW50cy5sZW5ndGggJiYgZGVsYXkucHJvZ3Jlc3MoMSk7XG4gICAgfTtcbiAgfSxcbiAgICAgIHA7XG5cbiAgZm9yIChwIGluIHZhcnMpIHtcbiAgICB2YXJzQ29weVtwXSA9IHAuc3Vic3RyKDAsIDIpID09PSBcIm9uXCIgJiYgX2lzRnVuY3Rpb24odmFyc1twXSkgJiYgcCAhPT0gXCJvblJlZnJlc2hJbml0XCIgPyBwcm94eUNhbGxiYWNrKHAsIHZhcnNbcF0pIDogdmFyc1twXTtcbiAgfVxuXG4gIGlmIChfaXNGdW5jdGlvbihiYXRjaE1heCkpIHtcbiAgICBiYXRjaE1heCA9IGJhdGNoTWF4KCk7XG5cbiAgICBfYWRkTGlzdGVuZXIoU2Nyb2xsVHJpZ2dlciwgXCJyZWZyZXNoXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBiYXRjaE1heCA9IHZhcnMuYmF0Y2hNYXgoKTtcbiAgICB9KTtcbiAgfVxuXG4gIF90b0FycmF5KHRhcmdldHMpLmZvckVhY2goZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIHZhciBjb25maWcgPSB7fTtcblxuICAgIGZvciAocCBpbiB2YXJzQ29weSkge1xuICAgICAgY29uZmlnW3BdID0gdmFyc0NvcHlbcF07XG4gICAgfVxuXG4gICAgY29uZmlnLnRyaWdnZXIgPSB0YXJnZXQ7XG4gICAgcmVzdWx0LnB1c2goU2Nyb2xsVHJpZ2dlci5jcmVhdGUoY29uZmlnKSk7XG4gIH0pO1xuXG4gIHJldHVybiByZXN1bHQ7XG59OyAvLyB0byByZWR1Y2UgZmlsZSBzaXplLiBjbGFtcHMgdGhlIHNjcm9sbCBhbmQgYWxzbyByZXR1cm5zIGEgZHVyYXRpb24gbXVsdGlwbGllciBzbyB0aGF0IGlmIHRoZSBzY3JvbGwgZ2V0cyBjaG9wcGVkIHNob3J0ZXIsIHRoZSBkdXJhdGlvbiBnZXRzIGN1cnRhaWxlZCBhcyB3ZWxsIChvdGhlcndpc2UgaWYgeW91J3JlIHZlcnkgY2xvc2UgdG8gdGhlIHRvcCBvZiB0aGUgcGFnZSwgZm9yIGV4YW1wbGUsIGFuZCBzd2lwZSB1cCByZWFsbHkgZmFzdCwgaXQnbGwgc3VkZGVubHkgc2xvdyBkb3duIGFuZCB0YWtlIGEgbG9uZyB0aW1lIHRvIHJlYWNoIHRoZSB0b3ApLlxuXG5cbnZhciBfY2xhbXBTY3JvbGxBbmRHZXREdXJhdGlvbk11bHRpcGxpZXIgPSBmdW5jdGlvbiBfY2xhbXBTY3JvbGxBbmRHZXREdXJhdGlvbk11bHRpcGxpZXIoc2Nyb2xsRnVuYywgY3VycmVudCwgZW5kLCBtYXgpIHtcbiAgY3VycmVudCA+IG1heCA/IHNjcm9sbEZ1bmMobWF4KSA6IGN1cnJlbnQgPCAwICYmIHNjcm9sbEZ1bmMoMCk7XG4gIHJldHVybiBlbmQgPiBtYXggPyAobWF4IC0gY3VycmVudCkgLyAoZW5kIC0gY3VycmVudCkgOiBlbmQgPCAwID8gY3VycmVudCAvIChjdXJyZW50IC0gZW5kKSA6IDE7XG59LFxuICAgIF9hbGxvd05hdGl2ZVBhbm5pbmcgPSBmdW5jdGlvbiBfYWxsb3dOYXRpdmVQYW5uaW5nKHRhcmdldCwgZGlyZWN0aW9uKSB7XG4gIGlmIChkaXJlY3Rpb24gPT09IHRydWUpIHtcbiAgICB0YXJnZXQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJ0b3VjaC1hY3Rpb25cIik7XG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0LnN0eWxlLnRvdWNoQWN0aW9uID0gZGlyZWN0aW9uID09PSB0cnVlID8gXCJhdXRvXCIgOiBkaXJlY3Rpb24gPyBcInBhbi1cIiArIGRpcmVjdGlvbiArIChPYnNlcnZlci5pc1RvdWNoID8gXCIgcGluY2gtem9vbVwiIDogXCJcIikgOiBcIm5vbmVcIjsgLy8gbm90ZTogRmlyZWZveCBkb2Vzbid0IHN1cHBvcnQgaXQgcGluY2gtem9vbSBwcm9wZXJseSwgYXQgbGVhc3QgaW4gYWRkaXRpb24gdG8gYSBwYW4teCBvciBwYW4teS5cbiAgfVxuXG4gIHRhcmdldCA9PT0gX2RvY0VsICYmIF9hbGxvd05hdGl2ZVBhbm5pbmcoX2JvZHksIGRpcmVjdGlvbik7XG59LFxuICAgIF9vdmVyZmxvdyA9IHtcbiAgYXV0bzogMSxcbiAgc2Nyb2xsOiAxXG59LFxuICAgIF9uZXN0ZWRTY3JvbGwgPSBmdW5jdGlvbiBfbmVzdGVkU2Nyb2xsKF9yZWY1KSB7XG4gIHZhciBldmVudCA9IF9yZWY1LmV2ZW50LFxuICAgICAgdGFyZ2V0ID0gX3JlZjUudGFyZ2V0LFxuICAgICAgYXhpcyA9IF9yZWY1LmF4aXM7XG5cbiAgdmFyIG5vZGUgPSAoZXZlbnQuY2hhbmdlZFRvdWNoZXMgPyBldmVudC5jaGFuZ2VkVG91Y2hlc1swXSA6IGV2ZW50KS50YXJnZXQsXG4gICAgICBjYWNoZSA9IG5vZGUuX2dzYXAgfHwgZ3NhcC5jb3JlLmdldENhY2hlKG5vZGUpLFxuICAgICAgdGltZSA9IF9nZXRUaW1lKCksXG4gICAgICBjcztcblxuICBpZiAoIWNhY2hlLl9pc1Njcm9sbFQgfHwgdGltZSAtIGNhY2hlLl9pc1Njcm9sbFQgPiAyMDAwKSB7XG4gICAgLy8gY2FjaGUgZm9yIDIgc2Vjb25kcyB0byBpbXByb3ZlIHBlcmZvcm1hbmNlLlxuICAgIHdoaWxlIChub2RlICYmIG5vZGUgIT09IF9ib2R5ICYmIChub2RlLnNjcm9sbEhlaWdodCA8PSBub2RlLmNsaWVudEhlaWdodCAmJiBub2RlLnNjcm9sbFdpZHRoIDw9IG5vZGUuY2xpZW50V2lkdGggfHwgIShfb3ZlcmZsb3dbKGNzID0gX2dldENvbXB1dGVkU3R5bGUobm9kZSkpLm92ZXJmbG93WV0gfHwgX292ZXJmbG93W2NzLm92ZXJmbG93WF0pKSkge1xuICAgICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICB9XG5cbiAgICBjYWNoZS5faXNTY3JvbGwgPSBub2RlICYmIG5vZGUgIT09IHRhcmdldCAmJiAhX2lzVmlld3BvcnQobm9kZSkgJiYgKF9vdmVyZmxvd1soY3MgPSBfZ2V0Q29tcHV0ZWRTdHlsZShub2RlKSkub3ZlcmZsb3dZXSB8fCBfb3ZlcmZsb3dbY3Mub3ZlcmZsb3dYXSk7XG4gICAgY2FjaGUuX2lzU2Nyb2xsVCA9IHRpbWU7XG4gIH1cblxuICBpZiAoY2FjaGUuX2lzU2Nyb2xsIHx8IGF4aXMgPT09IFwieFwiKSB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZXZlbnQuX2dzYXBBbGxvdyA9IHRydWU7XG4gIH1cbn0sXG4gICAgLy8gY2FwdHVyZSBldmVudHMgb24gc2Nyb2xsYWJsZSBlbGVtZW50cyBJTlNJREUgdGhlIDxib2R5PiBhbmQgYWxsb3cgdGhvc2UgYnkgY2FsbGluZyBzdG9wUHJvcGFnYXRpb24oKSB3aGVuIHdlIGZpbmQgYSBzY3JvbGxhYmxlIGFuY2VzdG9yXG5faW5wdXRPYnNlcnZlciA9IGZ1bmN0aW9uIF9pbnB1dE9ic2VydmVyKHRhcmdldCwgdHlwZSwgaW5wdXRzLCBuZXN0ZWQpIHtcbiAgcmV0dXJuIE9ic2VydmVyLmNyZWF0ZSh7XG4gICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgY2FwdHVyZTogdHJ1ZSxcbiAgICBkZWJvdW5jZTogZmFsc2UsXG4gICAgbG9ja0F4aXM6IHRydWUsXG4gICAgdHlwZTogdHlwZSxcbiAgICBvbldoZWVsOiBuZXN0ZWQgPSBuZXN0ZWQgJiYgX25lc3RlZFNjcm9sbCxcbiAgICBvblByZXNzOiBuZXN0ZWQsXG4gICAgb25EcmFnOiBuZXN0ZWQsXG4gICAgb25TY3JvbGw6IG5lc3RlZCxcbiAgICBvbkVuYWJsZTogZnVuY3Rpb24gb25FbmFibGUoKSB7XG4gICAgICByZXR1cm4gaW5wdXRzICYmIF9hZGRMaXN0ZW5lcihfZG9jLCBPYnNlcnZlci5ldmVudFR5cGVzWzBdLCBfY2FwdHVyZUlucHV0cywgZmFsc2UsIHRydWUpO1xuICAgIH0sXG4gICAgb25EaXNhYmxlOiBmdW5jdGlvbiBvbkRpc2FibGUoKSB7XG4gICAgICByZXR1cm4gX3JlbW92ZUxpc3RlbmVyKF9kb2MsIE9ic2VydmVyLmV2ZW50VHlwZXNbMF0sIF9jYXB0dXJlSW5wdXRzLCB0cnVlKTtcbiAgICB9XG4gIH0pO1xufSxcbiAgICBfaW5wdXRFeHAgPSAvKGlucHV0fGxhYmVsfHNlbGVjdHx0ZXh0YXJlYSkvaSxcbiAgICBfaW5wdXRJc0ZvY3VzZWQsXG4gICAgX2NhcHR1cmVJbnB1dHMgPSBmdW5jdGlvbiBfY2FwdHVyZUlucHV0cyhlKSB7XG4gIHZhciBpc0lucHV0ID0gX2lucHV0RXhwLnRlc3QoZS50YXJnZXQudGFnTmFtZSk7XG5cbiAgaWYgKGlzSW5wdXQgfHwgX2lucHV0SXNGb2N1c2VkKSB7XG4gICAgZS5fZ3NhcEFsbG93ID0gdHJ1ZTtcbiAgICBfaW5wdXRJc0ZvY3VzZWQgPSBpc0lucHV0O1xuICB9XG59LFxuICAgIF9nZXRTY3JvbGxOb3JtYWxpemVyID0gZnVuY3Rpb24gX2dldFNjcm9sbE5vcm1hbGl6ZXIodmFycykge1xuICBfaXNPYmplY3QodmFycykgfHwgKHZhcnMgPSB7fSk7XG4gIHZhcnMucHJldmVudERlZmF1bHQgPSB2YXJzLmlzTm9ybWFsaXplciA9IHZhcnMuYWxsb3dDbGlja3MgPSB0cnVlO1xuICB2YXJzLnR5cGUgfHwgKHZhcnMudHlwZSA9IFwid2hlZWwsdG91Y2hcIik7XG4gIHZhcnMuZGVib3VuY2UgPSAhIXZhcnMuZGVib3VuY2U7XG4gIHZhcnMuaWQgPSB2YXJzLmlkIHx8IFwibm9ybWFsaXplclwiO1xuXG4gIHZhciBfdmFyczIgPSB2YXJzLFxuICAgICAgbm9ybWFsaXplU2Nyb2xsWCA9IF92YXJzMi5ub3JtYWxpemVTY3JvbGxYLFxuICAgICAgbW9tZW50dW0gPSBfdmFyczIubW9tZW50dW0sXG4gICAgICBhbGxvd05lc3RlZFNjcm9sbCA9IF92YXJzMi5hbGxvd05lc3RlZFNjcm9sbCxcbiAgICAgIG9uUmVsZWFzZSA9IF92YXJzMi5vblJlbGVhc2UsXG4gICAgICBzZWxmLFxuICAgICAgbWF4WSxcbiAgICAgIHRhcmdldCA9IF9nZXRUYXJnZXQodmFycy50YXJnZXQpIHx8IF9kb2NFbCxcbiAgICAgIHNtb290aGVyID0gZ3NhcC5jb3JlLmdsb2JhbHMoKS5TY3JvbGxTbW9vdGhlcixcbiAgICAgIHNtb290aGVySW5zdGFuY2UgPSBzbW9vdGhlciAmJiBzbW9vdGhlci5nZXQoKSxcbiAgICAgIGNvbnRlbnQgPSBfZml4SU9TQnVnICYmICh2YXJzLmNvbnRlbnQgJiYgX2dldFRhcmdldCh2YXJzLmNvbnRlbnQpIHx8IHNtb290aGVySW5zdGFuY2UgJiYgdmFycy5jb250ZW50ICE9PSBmYWxzZSAmJiAhc21vb3RoZXJJbnN0YW5jZS5zbW9vdGgoKSAmJiBzbW9vdGhlckluc3RhbmNlLmNvbnRlbnQoKSksXG4gICAgICBzY3JvbGxGdW5jWSA9IF9nZXRTY3JvbGxGdW5jKHRhcmdldCwgX3ZlcnRpY2FsKSxcbiAgICAgIHNjcm9sbEZ1bmNYID0gX2dldFNjcm9sbEZ1bmModGFyZ2V0LCBfaG9yaXpvbnRhbCksXG4gICAgICBzY2FsZSA9IDEsXG4gICAgICBpbml0aWFsU2NhbGUgPSAoT2JzZXJ2ZXIuaXNUb3VjaCAmJiBfd2luLnZpc3VhbFZpZXdwb3J0ID8gX3dpbi52aXN1YWxWaWV3cG9ydC5zY2FsZSAqIF93aW4udmlzdWFsVmlld3BvcnQud2lkdGggOiBfd2luLm91dGVyV2lkdGgpIC8gX3dpbi5pbm5lcldpZHRoLFxuICAgICAgd2hlZWxSZWZyZXNoID0gMCxcbiAgICAgIHJlc29sdmVNb21lbnR1bUR1cmF0aW9uID0gX2lzRnVuY3Rpb24obW9tZW50dW0pID8gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBtb21lbnR1bShzZWxmKTtcbiAgfSA6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbW9tZW50dW0gfHwgMi44O1xuICB9LFxuICAgICAgbGFzdFJlZnJlc2hJRCxcbiAgICAgIHNraXBUb3VjaE1vdmUsXG4gICAgICBpbnB1dE9ic2VydmVyID0gX2lucHV0T2JzZXJ2ZXIodGFyZ2V0LCB2YXJzLnR5cGUsIHRydWUsIGFsbG93TmVzdGVkU2Nyb2xsKSxcbiAgICAgIHJlc3VtZVRvdWNoTW92ZSA9IGZ1bmN0aW9uIHJlc3VtZVRvdWNoTW92ZSgpIHtcbiAgICByZXR1cm4gc2tpcFRvdWNoTW92ZSA9IGZhbHNlO1xuICB9LFxuICAgICAgc2Nyb2xsQ2xhbXBYID0gX3Bhc3NUaHJvdWdoLFxuICAgICAgc2Nyb2xsQ2xhbXBZID0gX3Bhc3NUaHJvdWdoLFxuICAgICAgdXBkYXRlQ2xhbXBzID0gZnVuY3Rpb24gdXBkYXRlQ2xhbXBzKCkge1xuICAgIG1heFkgPSBfbWF4U2Nyb2xsKHRhcmdldCwgX3ZlcnRpY2FsKTtcbiAgICBzY3JvbGxDbGFtcFkgPSBfY2xhbXAoX2ZpeElPU0J1ZyA/IDEgOiAwLCBtYXhZKTtcbiAgICBub3JtYWxpemVTY3JvbGxYICYmIChzY3JvbGxDbGFtcFggPSBfY2xhbXAoMCwgX21heFNjcm9sbCh0YXJnZXQsIF9ob3Jpem9udGFsKSkpO1xuICAgIGxhc3RSZWZyZXNoSUQgPSBfcmVmcmVzaElEO1xuICB9LFxuICAgICAgcmVtb3ZlQ29udGVudE9mZnNldCA9IGZ1bmN0aW9uIHJlbW92ZUNvbnRlbnRPZmZzZXQoKSB7XG4gICAgY29udGVudC5fZ3NhcC55ID0gX3JvdW5kKHBhcnNlRmxvYXQoY29udGVudC5fZ3NhcC55KSArIHNjcm9sbEZ1bmNZLm9mZnNldCkgKyBcInB4XCI7XG4gICAgY29udGVudC5zdHlsZS50cmFuc2Zvcm0gPSBcIm1hdHJpeDNkKDEsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIFwiICsgcGFyc2VGbG9hdChjb250ZW50Ll9nc2FwLnkpICsgXCIsIDAsIDEpXCI7XG4gICAgc2Nyb2xsRnVuY1kub2Zmc2V0ID0gc2Nyb2xsRnVuY1kuY2FjaGVJRCA9IDA7XG4gIH0sXG4gICAgICBpZ25vcmVEcmFnID0gZnVuY3Rpb24gaWdub3JlRHJhZygpIHtcbiAgICBpZiAoc2tpcFRvdWNoTW92ZSkge1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlc3VtZVRvdWNoTW92ZSk7XG5cbiAgICAgIHZhciBvZmZzZXQgPSBfcm91bmQoc2VsZi5kZWx0YVkgLyAyKSxcbiAgICAgICAgICBzY3JvbGwgPSBzY3JvbGxDbGFtcFkoc2Nyb2xsRnVuY1kudiAtIG9mZnNldCk7XG5cbiAgICAgIGlmIChjb250ZW50ICYmIHNjcm9sbCAhPT0gc2Nyb2xsRnVuY1kudiArIHNjcm9sbEZ1bmNZLm9mZnNldCkge1xuICAgICAgICBzY3JvbGxGdW5jWS5vZmZzZXQgPSBzY3JvbGwgLSBzY3JvbGxGdW5jWS52O1xuXG4gICAgICAgIHZhciB5ID0gX3JvdW5kKChwYXJzZUZsb2F0KGNvbnRlbnQgJiYgY29udGVudC5fZ3NhcC55KSB8fCAwKSAtIHNjcm9sbEZ1bmNZLm9mZnNldCk7XG5cbiAgICAgICAgY29udGVudC5zdHlsZS50cmFuc2Zvcm0gPSBcIm1hdHJpeDNkKDEsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIFwiICsgeSArIFwiLCAwLCAxKVwiO1xuICAgICAgICBjb250ZW50Ll9nc2FwLnkgPSB5ICsgXCJweFwiO1xuICAgICAgICBzY3JvbGxGdW5jWS5jYWNoZUlEID0gX3Njcm9sbGVycy5jYWNoZTtcblxuICAgICAgICBfdXBkYXRlQWxsKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHNjcm9sbEZ1bmNZLm9mZnNldCAmJiByZW1vdmVDb250ZW50T2Zmc2V0KCk7XG4gICAgc2tpcFRvdWNoTW92ZSA9IHRydWU7XG4gIH0sXG4gICAgICB0d2VlbixcbiAgICAgIHN0YXJ0U2Nyb2xsWCxcbiAgICAgIHN0YXJ0U2Nyb2xsWSxcbiAgICAgIG9uU3RvcERlbGF5ZWRDYWxsLFxuICAgICAgb25SZXNpemUgPSBmdW5jdGlvbiBvblJlc2l6ZSgpIHtcbiAgICAvLyBpZiB0aGUgd2luZG93IHJlc2l6ZXMsIGxpa2Ugb24gYW4gaVBob25lIHdoaWNoIEFwcGxlIEZPUkNFUyB0aGUgYWRkcmVzcyBiYXIgdG8gc2hvdy9oaWRlIGV2ZW4gaWYgd2UgZXZlbnQucHJldmVudERlZmF1bHQoKSwgaXQgbWF5IGJlIHNjcm9sbGluZyB0b28gZmFyIG5vdyB0aGF0IHRoZSBhZGRyZXNzIGJhciBpcyBzaG93aW5nLCBzbyB3ZSBtdXN0IGR5bmFtaWNhbGx5IGFkanVzdCB0aGUgbW9tZW50dW0gdHdlZW4uXG4gICAgdXBkYXRlQ2xhbXBzKCk7XG5cbiAgICBpZiAodHdlZW4uaXNBY3RpdmUoKSAmJiB0d2Vlbi52YXJzLnNjcm9sbFkgPiBtYXhZKSB7XG4gICAgICBzY3JvbGxGdW5jWSgpID4gbWF4WSA/IHR3ZWVuLnByb2dyZXNzKDEpICYmIHNjcm9sbEZ1bmNZKG1heFkpIDogdHdlZW4ucmVzZXRUbyhcInNjcm9sbFlcIiwgbWF4WSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnRlbnQgJiYgZ3NhcC5zZXQoY29udGVudCwge1xuICAgIHk6IFwiKz0wXCJcbiAgfSk7IC8vIHRvIGVuc3VyZSB0aGVyZSdzIGEgY2FjaGUgKGVsZW1lbnQuX2dzYXApXG5cbiAgdmFycy5pZ25vcmVDaGVjayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgcmV0dXJuIF9maXhJT1NCdWcgJiYgZS50eXBlID09PSBcInRvdWNobW92ZVwiICYmIGlnbm9yZURyYWcoZSkgfHwgc2NhbGUgPiAxLjA1ICYmIGUudHlwZSAhPT0gXCJ0b3VjaHN0YXJ0XCIgfHwgc2VsZi5pc0dlc3R1cmluZyB8fCBlLnRvdWNoZXMgJiYgZS50b3VjaGVzLmxlbmd0aCA+IDE7XG4gIH07XG5cbiAgdmFycy5vblByZXNzID0gZnVuY3Rpb24gKCkge1xuICAgIHNraXBUb3VjaE1vdmUgPSBmYWxzZTtcbiAgICB2YXIgcHJldlNjYWxlID0gc2NhbGU7XG4gICAgc2NhbGUgPSBfcm91bmQoKF93aW4udmlzdWFsVmlld3BvcnQgJiYgX3dpbi52aXN1YWxWaWV3cG9ydC5zY2FsZSB8fCAxKSAvIGluaXRpYWxTY2FsZSk7XG4gICAgdHdlZW4ucGF1c2UoKTtcbiAgICBwcmV2U2NhbGUgIT09IHNjYWxlICYmIF9hbGxvd05hdGl2ZVBhbm5pbmcodGFyZ2V0LCBzY2FsZSA+IDEuMDEgPyB0cnVlIDogbm9ybWFsaXplU2Nyb2xsWCA/IGZhbHNlIDogXCJ4XCIpO1xuICAgIHN0YXJ0U2Nyb2xsWCA9IHNjcm9sbEZ1bmNYKCk7XG4gICAgc3RhcnRTY3JvbGxZID0gc2Nyb2xsRnVuY1koKTtcbiAgICB1cGRhdGVDbGFtcHMoKTtcbiAgICBsYXN0UmVmcmVzaElEID0gX3JlZnJlc2hJRDtcbiAgfTtcblxuICB2YXJzLm9uUmVsZWFzZSA9IHZhcnMub25HZXN0dXJlU3RhcnQgPSBmdW5jdGlvbiAoc2VsZiwgd2FzRHJhZ2dpbmcpIHtcbiAgICBzY3JvbGxGdW5jWS5vZmZzZXQgJiYgcmVtb3ZlQ29udGVudE9mZnNldCgpO1xuXG4gICAgaWYgKCF3YXNEcmFnZ2luZykge1xuICAgICAgb25TdG9wRGVsYXllZENhbGwucmVzdGFydCh0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgX3Njcm9sbGVycy5jYWNoZSsrOyAvLyBtYWtlIHN1cmUgd2UncmUgcHVsbGluZyB0aGUgbm9uLWNhY2hlZCB2YWx1ZVxuICAgICAgLy8gYWx0ZXJuYXRlIGFsZ29yaXRobTogZHVyWCA9IE1hdGgubWluKDYsIE1hdGguYWJzKHNlbGYudmVsb2NpdHlYIC8gODAwKSksXHRkdXIgPSBNYXRoLm1heChkdXJYLCBNYXRoLm1pbig2LCBNYXRoLmFicyhzZWxmLnZlbG9jaXR5WSAvIDgwMCkpKTsgZHVyID0gZHVyICogKDAuNCArICgxIC0gX3Bvd2VyNEluKGR1ciAvIDYpKSAqIDAuNikpICogKG1vbWVudHVtU3BlZWQgfHwgMSlcblxuICAgICAgdmFyIGR1ciA9IHJlc29sdmVNb21lbnR1bUR1cmF0aW9uKCksXG4gICAgICAgICAgY3VycmVudFNjcm9sbCxcbiAgICAgICAgICBlbmRTY3JvbGw7XG5cbiAgICAgIGlmIChub3JtYWxpemVTY3JvbGxYKSB7XG4gICAgICAgIGN1cnJlbnRTY3JvbGwgPSBzY3JvbGxGdW5jWCgpO1xuICAgICAgICBlbmRTY3JvbGwgPSBjdXJyZW50U2Nyb2xsICsgZHVyICogMC4wNSAqIC1zZWxmLnZlbG9jaXR5WCAvIDAuMjI3OyAvLyB0aGUgY29uc3RhbnQgLjIyNyBpcyBmcm9tIHBvd2VyNCgwLjA1KS4gdmVsb2NpdHkgaXMgaW52ZXJ0ZWQgYmVjYXVzZSBzY3JvbGxpbmcgZ29lcyBpbiB0aGUgb3Bwb3NpdGUgZGlyZWN0aW9uLlxuXG4gICAgICAgIGR1ciAqPSBfY2xhbXBTY3JvbGxBbmRHZXREdXJhdGlvbk11bHRpcGxpZXIoc2Nyb2xsRnVuY1gsIGN1cnJlbnRTY3JvbGwsIGVuZFNjcm9sbCwgX21heFNjcm9sbCh0YXJnZXQsIF9ob3Jpem9udGFsKSk7XG4gICAgICAgIHR3ZWVuLnZhcnMuc2Nyb2xsWCA9IHNjcm9sbENsYW1wWChlbmRTY3JvbGwpO1xuICAgICAgfVxuXG4gICAgICBjdXJyZW50U2Nyb2xsID0gc2Nyb2xsRnVuY1koKTtcbiAgICAgIGVuZFNjcm9sbCA9IGN1cnJlbnRTY3JvbGwgKyBkdXIgKiAwLjA1ICogLXNlbGYudmVsb2NpdHlZIC8gMC4yMjc7IC8vIHRoZSBjb25zdGFudCAuMjI3IGlzIGZyb20gcG93ZXI0KDAuMDUpXG5cbiAgICAgIGR1ciAqPSBfY2xhbXBTY3JvbGxBbmRHZXREdXJhdGlvbk11bHRpcGxpZXIoc2Nyb2xsRnVuY1ksIGN1cnJlbnRTY3JvbGwsIGVuZFNjcm9sbCwgX21heFNjcm9sbCh0YXJnZXQsIF92ZXJ0aWNhbCkpO1xuICAgICAgdHdlZW4udmFycy5zY3JvbGxZID0gc2Nyb2xsQ2xhbXBZKGVuZFNjcm9sbCk7XG4gICAgICB0d2Vlbi5pbnZhbGlkYXRlKCkuZHVyYXRpb24oZHVyKS5wbGF5KDAuMDEpO1xuXG4gICAgICBpZiAoX2ZpeElPU0J1ZyAmJiB0d2Vlbi52YXJzLnNjcm9sbFkgPj0gbWF4WSB8fCBjdXJyZW50U2Nyb2xsID49IG1heFkgLSAxKSB7XG4gICAgICAgIC8vIGlPUyBidWc6IGl0J2xsIHNob3cgdGhlIGFkZHJlc3MgYmFyIGJ1dCBOT1QgZmlyZSB0aGUgd2luZG93IFwicmVzaXplXCIgZXZlbnQgdW50aWwgdGhlIGFuaW1hdGlvbiBpcyBkb25lIGJ1dCB3ZSBtdXN0IHByb3RlY3QgYWdhaW5zdCBvdmVyc2hvb3Qgc28gd2UgbGV2ZXJhZ2UgYW4gb25VcGRhdGUgdG8gZG8gc28uXG4gICAgICAgIGdzYXAudG8oe30sIHtcbiAgICAgICAgICBvblVwZGF0ZTogb25SZXNpemUsXG4gICAgICAgICAgZHVyYXRpb246IGR1clxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBvblJlbGVhc2UgJiYgb25SZWxlYXNlKHNlbGYpO1xuICB9O1xuXG4gIHZhcnMub25XaGVlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0d2Vlbi5fdHMgJiYgdHdlZW4ucGF1c2UoKTtcblxuICAgIGlmIChfZ2V0VGltZSgpIC0gd2hlZWxSZWZyZXNoID4gMTAwMCkge1xuICAgICAgLy8gYWZ0ZXIgMSBzZWNvbmQsIHJlZnJlc2ggdGhlIGNsYW1wcyBvdGhlcndpc2UgdGhhdCdsbCBvbmx5IGhhcHBlbiB3aGVuIFNjcm9sbFRyaWdnZXIucmVmcmVzaCgpIGlzIGNhbGxlZCBvciBmb3IgdG91Y2gtc2Nyb2xsaW5nLlxuICAgICAgbGFzdFJlZnJlc2hJRCA9IDA7XG4gICAgICB3aGVlbFJlZnJlc2ggPSBfZ2V0VGltZSgpO1xuICAgIH1cbiAgfTtcblxuICB2YXJzLm9uQ2hhbmdlID0gZnVuY3Rpb24gKHNlbGYsIGR4LCBkeSwgeEFycmF5LCB5QXJyYXkpIHtcbiAgICBfcmVmcmVzaElEICE9PSBsYXN0UmVmcmVzaElEICYmIHVwZGF0ZUNsYW1wcygpO1xuICAgIGR4ICYmIG5vcm1hbGl6ZVNjcm9sbFggJiYgc2Nyb2xsRnVuY1goc2Nyb2xsQ2xhbXBYKHhBcnJheVsyXSA9PT0gZHggPyBzdGFydFNjcm9sbFggKyAoc2VsZi5zdGFydFggLSBzZWxmLngpIDogc2Nyb2xsRnVuY1goKSArIGR4IC0geEFycmF5WzFdKSk7IC8vIGZvciBtb3JlIHByZWNpc2lvbiwgd2UgdHJhY2sgcG9pbnRlci90b3VjaCBtb3ZlbWVudCBmcm9tIHRoZSBzdGFydCwgb3RoZXJ3aXNlIGl0J2xsIGRyaWZ0LlxuXG4gICAgaWYgKGR5KSB7XG4gICAgICBzY3JvbGxGdW5jWS5vZmZzZXQgJiYgcmVtb3ZlQ29udGVudE9mZnNldCgpO1xuICAgICAgdmFyIGlzVG91Y2ggPSB5QXJyYXlbMl0gPT09IGR5LFxuICAgICAgICAgIHkgPSBpc1RvdWNoID8gc3RhcnRTY3JvbGxZICsgc2VsZi5zdGFydFkgLSBzZWxmLnkgOiBzY3JvbGxGdW5jWSgpICsgZHkgLSB5QXJyYXlbMV0sXG4gICAgICAgICAgeUNsYW1wZWQgPSBzY3JvbGxDbGFtcFkoeSk7XG4gICAgICBpc1RvdWNoICYmIHkgIT09IHlDbGFtcGVkICYmIChzdGFydFNjcm9sbFkgKz0geUNsYW1wZWQgLSB5KTtcbiAgICAgIHNjcm9sbEZ1bmNZKHlDbGFtcGVkKTtcbiAgICB9XG5cbiAgICAoZHkgfHwgZHgpICYmIF91cGRhdGVBbGwoKTtcbiAgfTtcblxuICB2YXJzLm9uRW5hYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIF9hbGxvd05hdGl2ZVBhbm5pbmcodGFyZ2V0LCBub3JtYWxpemVTY3JvbGxYID8gZmFsc2UgOiBcInhcIik7XG5cbiAgICBTY3JvbGxUcmlnZ2VyLmFkZEV2ZW50TGlzdGVuZXIoXCJyZWZyZXNoXCIsIG9uUmVzaXplKTtcblxuICAgIF9hZGRMaXN0ZW5lcihfd2luLCBcInJlc2l6ZVwiLCBvblJlc2l6ZSk7XG5cbiAgICBpZiAoc2Nyb2xsRnVuY1kuc21vb3RoKSB7XG4gICAgICBzY3JvbGxGdW5jWS50YXJnZXQuc3R5bGUuc2Nyb2xsQmVoYXZpb3IgPSBcImF1dG9cIjtcbiAgICAgIHNjcm9sbEZ1bmNZLnNtb290aCA9IHNjcm9sbEZ1bmNYLnNtb290aCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlucHV0T2JzZXJ2ZXIuZW5hYmxlKCk7XG4gIH07XG5cbiAgdmFycy5vbkRpc2FibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgX2FsbG93TmF0aXZlUGFubmluZyh0YXJnZXQsIHRydWUpO1xuXG4gICAgX3JlbW92ZUxpc3RlbmVyKF93aW4sIFwicmVzaXplXCIsIG9uUmVzaXplKTtcblxuICAgIFNjcm9sbFRyaWdnZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInJlZnJlc2hcIiwgb25SZXNpemUpO1xuICAgIGlucHV0T2JzZXJ2ZXIua2lsbCgpO1xuICB9O1xuXG4gIHZhcnMubG9ja0F4aXMgPSB2YXJzLmxvY2tBeGlzICE9PSBmYWxzZTtcbiAgc2VsZiA9IG5ldyBPYnNlcnZlcih2YXJzKTtcbiAgc2VsZi5pT1MgPSBfZml4SU9TQnVnOyAvLyB1c2VkIGluIHRoZSBPYnNlcnZlciBnZXRDYWNoZWRTY3JvbGwoKSBmdW5jdGlvbiB0byB3b3JrIGFyb3VuZCBhbiBpT1MgYnVnIHRoYXQgd3JlYWtzIGhhdm9jIHdpdGggVG91Y2hFdmVudC5jbGllbnRZIGlmIHdlIGFsbG93IHNjcm9sbCB0byBnbyBhbGwgdGhlIHdheSBiYWNrIHRvIDAuXG5cbiAgX2ZpeElPU0J1ZyAmJiAhc2Nyb2xsRnVuY1koKSAmJiBzY3JvbGxGdW5jWSgxKTsgLy8gaU9TIGJ1ZyBjYXVzZXMgZXZlbnQuY2xpZW50WSB2YWx1ZXMgdG8gZnJlYWsgb3V0ICh3aWxkbHkgaW5hY2N1cmF0ZSkgaWYgdGhlIHNjcm9sbCBwb3NpdGlvbiBpcyBleGFjdGx5IDAuXG5cbiAgX2ZpeElPU0J1ZyAmJiBnc2FwLnRpY2tlci5hZGQoX3Bhc3NUaHJvdWdoKTsgLy8gcHJldmVudCB0aGUgdGlja2VyIGZyb20gc2xlZXBpbmdcblxuICBvblN0b3BEZWxheWVkQ2FsbCA9IHNlbGYuX2RjO1xuICB0d2VlbiA9IGdzYXAudG8oc2VsZiwge1xuICAgIGVhc2U6IFwicG93ZXI0XCIsXG4gICAgcGF1c2VkOiB0cnVlLFxuICAgIGluaGVyaXQ6IGZhbHNlLFxuICAgIHNjcm9sbFg6IG5vcm1hbGl6ZVNjcm9sbFggPyBcIis9MC4xXCIgOiBcIis9MFwiLFxuICAgIHNjcm9sbFk6IFwiKz0wLjFcIixcbiAgICBtb2RpZmllcnM6IHtcbiAgICAgIHNjcm9sbFk6IF9pbnRlcnJ1cHRpb25UcmFja2VyKHNjcm9sbEZ1bmNZLCBzY3JvbGxGdW5jWSgpLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0d2Vlbi5wYXVzZSgpO1xuICAgICAgfSlcbiAgICB9LFxuICAgIG9uVXBkYXRlOiBfdXBkYXRlQWxsLFxuICAgIG9uQ29tcGxldGU6IG9uU3RvcERlbGF5ZWRDYWxsLnZhcnMub25Db21wbGV0ZVxuICB9KTsgLy8gd2UgbmVlZCB0aGUgbW9kaWZpZXIgdG8gc2Vuc2UgaWYgdGhlIHNjcm9sbCBwb3NpdGlvbiBpcyBhbHRlcmVkIG91dHNpZGUgb2YgdGhlIG1vbWVudHVtIHR3ZWVuIChsaWtlIHdpdGggYSBzY3JvbGxUbyB0d2Vlbikgc28gd2UgY2FuIHBhdXNlKCkgaXQgdG8gcHJldmVudCBjb25mbGljdHMuXG5cbiAgcmV0dXJuIHNlbGY7XG59O1xuXG5TY3JvbGxUcmlnZ2VyLnNvcnQgPSBmdW5jdGlvbiAoZnVuYykge1xuICBpZiAoX2lzRnVuY3Rpb24oZnVuYykpIHtcbiAgICByZXR1cm4gX3RyaWdnZXJzLnNvcnQoZnVuYyk7XG4gIH1cblxuICB2YXIgc2Nyb2xsID0gX3dpbi5wYWdlWU9mZnNldCB8fCAwO1xuICBTY3JvbGxUcmlnZ2VyLmdldEFsbCgpLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gdC5fc29ydFkgPSB0LnRyaWdnZXIgPyBzY3JvbGwgKyB0LnRyaWdnZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIDogdC5zdGFydCArIF93aW4uaW5uZXJIZWlnaHQ7XG4gIH0pO1xuICByZXR1cm4gX3RyaWdnZXJzLnNvcnQoZnVuYyB8fCBmdW5jdGlvbiAoYSwgYikge1xuICAgIHJldHVybiAoYS52YXJzLnJlZnJlc2hQcmlvcml0eSB8fCAwKSAqIC0xZTYgKyAoYS52YXJzLmNvbnRhaW5lckFuaW1hdGlvbiA/IDFlNiA6IGEuX3NvcnRZKSAtICgoYi52YXJzLmNvbnRhaW5lckFuaW1hdGlvbiA/IDFlNiA6IGIuX3NvcnRZKSArIChiLnZhcnMucmVmcmVzaFByaW9yaXR5IHx8IDApICogLTFlNik7XG4gIH0pOyAvLyBhbnl0aGluZyB3aXRoIGEgY29udGFpbmVyQW5pbWF0aW9uIHNob3VsZCByZWZyZXNoIGxhc3QuXG59O1xuXG5TY3JvbGxUcmlnZ2VyLm9ic2VydmUgPSBmdW5jdGlvbiAodmFycykge1xuICByZXR1cm4gbmV3IE9ic2VydmVyKHZhcnMpO1xufTtcblxuU2Nyb2xsVHJpZ2dlci5ub3JtYWxpemVTY3JvbGwgPSBmdW5jdGlvbiAodmFycykge1xuICBpZiAodHlwZW9mIHZhcnMgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4gX25vcm1hbGl6ZXI7XG4gIH1cblxuICBpZiAodmFycyA9PT0gdHJ1ZSAmJiBfbm9ybWFsaXplcikge1xuICAgIHJldHVybiBfbm9ybWFsaXplci5lbmFibGUoKTtcbiAgfVxuXG4gIGlmICh2YXJzID09PSBmYWxzZSkge1xuICAgIF9ub3JtYWxpemVyICYmIF9ub3JtYWxpemVyLmtpbGwoKTtcbiAgICBfbm9ybWFsaXplciA9IHZhcnM7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIG5vcm1hbGl6ZXIgPSB2YXJzIGluc3RhbmNlb2YgT2JzZXJ2ZXIgPyB2YXJzIDogX2dldFNjcm9sbE5vcm1hbGl6ZXIodmFycyk7XG4gIF9ub3JtYWxpemVyICYmIF9ub3JtYWxpemVyLnRhcmdldCA9PT0gbm9ybWFsaXplci50YXJnZXQgJiYgX25vcm1hbGl6ZXIua2lsbCgpO1xuICBfaXNWaWV3cG9ydChub3JtYWxpemVyLnRhcmdldCkgJiYgKF9ub3JtYWxpemVyID0gbm9ybWFsaXplcik7XG4gIHJldHVybiBub3JtYWxpemVyO1xufTtcblxuU2Nyb2xsVHJpZ2dlci5jb3JlID0ge1xuICAvLyBzbWFsbGVyIGZpbGUgc2l6ZSB3YXkgdG8gbGV2ZXJhZ2UgaW4gU2Nyb2xsU21vb3RoZXIgYW5kIE9ic2VydmVyXG4gIF9nZXRWZWxvY2l0eVByb3A6IF9nZXRWZWxvY2l0eVByb3AsXG4gIF9pbnB1dE9ic2VydmVyOiBfaW5wdXRPYnNlcnZlcixcbiAgX3Njcm9sbGVyczogX3Njcm9sbGVycyxcbiAgX3Byb3hpZXM6IF9wcm94aWVzLFxuICBicmlkZ2U6IHtcbiAgICAvLyB3aGVuIG5vcm1hbGl6ZVNjcm9sbCBzZXRzIHRoZSBzY3JvbGwgcG9zaXRpb24gKHNzID0gc2V0U2Nyb2xsKVxuICAgIHNzOiBmdW5jdGlvbiBzcygpIHtcbiAgICAgIF9sYXN0U2Nyb2xsVGltZSB8fCBfZGlzcGF0Y2goXCJzY3JvbGxTdGFydFwiKTtcbiAgICAgIF9sYXN0U2Nyb2xsVGltZSA9IF9nZXRUaW1lKCk7XG4gICAgfSxcbiAgICAvLyBhIHdheSB0byBnZXQgdGhlIF9yZWZyZXNoaW5nIHZhbHVlIGluIE9ic2VydmVyXG4gICAgcmVmOiBmdW5jdGlvbiByZWYoKSB7XG4gICAgICByZXR1cm4gX3JlZnJlc2hpbmc7XG4gICAgfVxuICB9XG59O1xuX2dldEdTQVAoKSAmJiBnc2FwLnJlZ2lzdGVyUGx1Z2luKFNjcm9sbFRyaWdnZXIpO1xuZXhwb3J0IHsgU2Nyb2xsVHJpZ2dlciBhcyBkZWZhdWx0IH07Il0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=webpack-internal:///(app-pages-browser)/../node_modules/gsap/ScrollTrigger.js
