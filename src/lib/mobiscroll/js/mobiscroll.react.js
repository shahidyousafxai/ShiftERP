/* eslint-disable */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports, require('react'), require('react-dom'))
    : typeof define === 'function' && define.amd
    ? define(['exports', 'react', 'react-dom'], factory)
    : ((global = typeof globalThis !== 'undefined' ? globalThis : global || self),
      factory((global.mobiscroll = {}), global.React, global.ReactDOM));
})(this, function (exports, react, reactDom) {
  'use strict';

  /* eslint-disable */

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function (d, b) {
    extendStatics =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (d, b) {
          d.__proto__ = b;
        }) ||
      function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };
    return extendStatics(d, b);
  };

  function __extends(d, b) {
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
  }

  var __assign = function () {
    __assign =
      Object.assign ||
      function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };

  function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
      }
    return t;
  }

  var Observable = /*#__PURE__*/ (function () {
    function Observable() {
      this.nr = 0;
      this.keys = 1;
      // handler function map
      this.subscribers = {};
    }
    /**
     * Subscribes a function that will be called when the observable changes. It will receive the new value as parameter.
     * NOTE: Don't forget to unsubscribe to prevent memory leaks!
     * @param handler A function that will be called when a new value is provided by the observable
     */
    Observable.prototype.subscribe = function (handler) {
      var key = this.keys++;
      this.subscribers[key] = handler;
      this.nr++;
      return key;
    };
    /**
     * Unsubscribes a handler from the observable
     * @param handler The handler of the function returned by the subscribe method or the function itself
     */
    Observable.prototype.unsubscribe = function (key) {
      this.nr--;
      delete this.subscribers[key];
    };
    /**
     * Notifies the subscribers of the observable of the next value.
     * @param value The next value of the observable
     */
    Observable.prototype.next = function (value) {
      var subscribers = this.subscribers;
      for (var key in subscribers) {
        if (subscribers.hasOwnProperty(key)) {
          subscribers[key](value);
        }
      }
    };
    return Observable;
  })();

  var os;
  var vers;
  var majorVersion;
  var minorVersion;
  var version = [];
  var touchUi = false;
  var isBrowser = typeof window !== 'undefined';
  var isDarkQuery = isBrowser && window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)');
  var userAgent = isBrowser ? navigator.userAgent : '';
  var platform = isBrowser ? navigator.platform : '';
  var maxTouchPoints = isBrowser ? navigator.maxTouchPoints : 0;
  var device = userAgent && userAgent.match(/Android|iPhone|iPad|iPod|Windows Phone|Windows|MSIE/i);
  var isSafari = userAgent && /Safari/.test(userAgent);
  if (/Android/i.test(device)) {
    os = 'android';
    vers = userAgent.match(/Android\s+([\d.]+)/i);
    touchUi = true;
    if (vers) {
      version = vers[0].replace('Android ', '').split('.');
    }
  } else if (/iPhone|iPad|iPod/i.test(device) || /iPhone|iPad|iPod/i.test(platform) || (platform === 'MacIntel' && maxTouchPoints > 1)) {
    // On iPad with iOS 13 desktop site request is automatically enabled in Safari,
    // so 'iPad' is no longer present in the user agent string.
    // In this case we check `navigator.platform` and `navigator.maxTouchPoints`.
    // maxTouchPoints is needed to exclude desktop Mac OS X.
    os = 'ios';
    vers = userAgent.match(/OS\s+([\d_]+)/i);
    touchUi = true;
    if (vers) {
      version = vers[0].replace(/_/g, '.').replace('OS ', '').split('.');
    }
  } else if (/Windows Phone/i.test(device)) {
    os = 'wp';
    touchUi = true;
  } else if (/Windows|MSIE/i.test(device)) {
    os = 'windows';
  }
  majorVersion = +version[0];
  minorVersion = +version[1];

  var options = {};
  var util = {};
  /** @hidden */
  var themes = {};
  /** @hidden */
  var autoDetect = {};
  /** @hidden */
  var globalChanges = new Observable();
  /** @hidden */
  function getAutoTheme() {
    var autoTheme = '';
    var theme = '';
    var firstTheme = '';
    if (os === 'android') {
      theme = 'material';
    } else if (os === 'wp' || os === 'windows') {
      theme = 'windows';
    } else {
      theme = 'ios';
    }
    for (var key in themes) {
      // Stop at the first custom theme with the OS base theme
      if (themes[key].baseTheme === theme && themes[key].auto !== false && key !== theme + '-dark') {
        autoTheme = key;
        break;
      } else if (key === theme) {
        autoTheme = key;
      } else if (!firstTheme) {
        firstTheme = key;
      }
    }
    return autoTheme || firstTheme;
  }
  function setOptions(local) {
    for (var k in local) {
      if (local.hasOwnProperty(k)) {
        options[k] = local[k];
      }
    }
    globalChanges.next(options);
  }
  /**
   * Creates a custom theme definition object. It inherits the defaults from the specified base theme.
   * @param name Name of the custom theme.
   * @param baseTheme Name of the base theme (ios, material or windows).
   * @param auto Allow to set it as auto theme, if the component has theme: 'auto' set. True, if not set.
   */
  function createCustomTheme(name, baseTheme, auto) {
    var base = themes[baseTheme];
    themes[name] = __assign({}, base, { auto: auto, baseTheme: baseTheme });
    autoDetect.theme = getAutoTheme();
  }
  var platform$1 = {
    majorVersion: majorVersion,
    minorVersion: minorVersion,
    name: os
  };

  // tslint:disable max-line-length
  var arrowBack =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z"/></svg>';

  // tslint:disable max-line-length
  var arrowDown =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 294.1L383 167c9.4-9.4 24.6-9.4 33.9 0s9.3 24.6 0 34L273 345c-9.1 9.1-23.7 9.3-33.1.7L95 201.1c-4.7-4.7-7-10.9-7-17s2.3-12.3 7-17c9.4-9.4 24.6-9.4 33.9 0l127.1 127z"/></svg>';

  // tslint:disable max-line-length
  var arrowForward =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"/></svg>';

  // tslint:disable max-line-length
  var arrowUp =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 217.9L383 345c9.4 9.4 24.6 9.4 33.9 0 9.4-9.4 9.3-24.6 0-34L273 167c-9.1-9.1-23.7-9.3-33.1-.7L95 310.9c-4.7 4.7-7 10.9-7 17s2.3 12.3 7 17c9.4 9.4 24.6 9.4 33.9 0l127.1-127z"/></svg>';

  // tslint:disable max-line-length
  var clear =
    '<svg xmlns="http://www.w3.org/2000/svg" height="17" viewBox="0 0 17 17" width="17"><path d="M8.5 0a8.5 8.5 0 110 17 8.5 8.5 0 010-17zm3.364 5.005a.7.7 0 00-.99 0l-2.44 2.44-2.439-2.44-.087-.074a.7.7 0 00-.903 1.064l2.44 2.439-2.44 2.44-.074.087a.7.7 0 001.064.903l2.439-2.441 2.44 2.441.087.074a.7.7 0 00.903-1.064l-2.441-2.44 2.441-2.439.074-.087a.7.7 0 00-.074-.903z" fill="currentColor" fill-rule="evenodd"/></svg>';

  var textFieldOpt = {
    clearIcon: clear,
    labelStyle: 'inline'
  };
  themes.ios = {
    Calendar: {
      nextIconH: arrowForward,
      nextIconV: arrowDown,
      prevIconH: arrowBack,
      prevIconV: arrowUp
    },
    Checkbox: {
      position: 'end'
    },
    Datepicker: {
      clearIcon: clear,
      display: 'bottom'
    },
    Dropdown: textFieldOpt,
    Eventcalendar: {
      chevronIconDown: arrowDown,
      nextIconH: arrowForward,
      nextIconV: arrowDown,
      prevIconH: arrowBack,
      prevIconV: arrowUp
    },
    Input: textFieldOpt,
    Radio: {
      position: 'end'
    },
    Scroller: {
      display: 'bottom',
      itemHeight: 34,
      minWheelWidth: 55,
      rows: 5,
      scroll3d: true
    },
    SegmentedGroup: {
      drag: true
    },
    Select: {
      clearIcon: clear
    },
    Textarea: textFieldOpt
  };
  createCustomTheme('ios-dark', 'ios');

  // tslint:disable max-line-length
  var arrowDropDown =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';

  // tslint:disable max-line-length
  var arrowDropUp =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';

  // tslint:disable max-line-length
  var chevronLeft =
    '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><path d="M23.12 11.12L21 9l-9 9 9 9 2.12-2.12L16.24 18z"/></svg>';

  // tslint:disable max-line-length
  var chevronRight =
    '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><path d="M15 9l-2.12 2.12L19.76 18l-6.88 6.88L15 27l9-9z"/></svg>';

  // tslint:disable max-line-length
  var clear$1 =
    '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>';

  // tslint:disable max-line-length
  var keyboardArrowDown =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>';

  // tslint:disable max-line-length
  var keyboardArrowUp =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';

  var textFieldOpt$1 = {
    clearIcon: clear$1,
    dropdownIcon: arrowDropDown,
    inputStyle: 'box',
    labelStyle: 'floating',
    notch: true,
    ripple: true
  };
  themes.material = {
    Button: {
      ripple: true
    },
    Calendar: {
      downIcon: arrowDropDown,
      nextIconH: chevronRight,
      nextIconV: keyboardArrowDown,
      prevIconH: chevronLeft,
      prevIconV: keyboardArrowUp,
      upIcon: arrowDropUp
    },
    Datepicker: {
      clearIcon: clear$1,
      display: 'center'
    },
    Dropdown: textFieldOpt$1,
    Eventcalendar: {
      chevronIconDown: keyboardArrowDown,
      colorEventList: true,
      downIcon: arrowDropDown,
      nextIconH: chevronRight,
      nextIconV: keyboardArrowDown,
      prevIconH: chevronLeft,
      prevIconV: keyboardArrowUp,
      upIcon: arrowDropUp
    },
    Input: textFieldOpt$1,
    ListItem: {
      ripple: true
    },
    Scroller: {
      display: 'center',
      rows: 3
    },
    Select: {
      clearIcon: clear$1,
      rows: 3
    },
    Textarea: textFieldOpt$1
  };
  createCustomTheme('material-dark', 'material');

  // tslint:disable max-line-length
  var angleDown =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M4.22 10.78l-1.44 1.44 12.5 12.5.72.686.72-.687 12.5-12.5-1.44-1.44L16 22.564 4.22 10.78z"/></svg>';

  // tslint:disable max-line-length
  var angleLeft =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M19.03 4.28l-11 11-.686.72.687.72 11 11 1.44-1.44L10.187 16l10.28-10.28-1.437-1.44z"/></svg>';

  // tslint:disable max-line-length
  var angleRight =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M12.97 4.28l-1.44 1.44L21.814 16 11.53 26.28l1.44 1.44 11-11 .686-.72-.687-.72-11-11z"/></svg>';

  // tslint:disable max-line-length
  var arrowDown$1 =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M15 4v20.063L8.22 17.28l-1.44 1.44 8.5 8.5.72.686.72-.687 8.5-8.5-1.44-1.44L17 24.063V4h-2z"/></svg>';

  // tslint:disable max-line-length
  var arrowUp$1 =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 4.094l-.72.687-8.5 8.5 1.44 1.44L15 7.936V28h2V7.937l6.78 6.782 1.44-1.44-8.5-8.5-.72-.686z"/></svg>';

  // tslint:disable max-line-length
  var close =
    '<svg fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32px" height="32px"><path d="M 7.21875 5.78125 L 5.78125 7.21875 L 14.5625 16 L 5.78125 24.78125 L 7.21875 26.21875 L 16 17.4375 L 24.78125 26.21875 L 26.21875 24.78125 L 17.4375 16 L 26.21875 7.21875 L 24.78125 5.78125 L 16 14.5625 Z"/></svg>';

  var textFieldOpt$2 = {
    clearIcon: close,
    inputStyle: 'box',
    labelStyle: 'stacked'
  };
  themes.windows = {
    Calendar: {
      nextIconH: angleRight,
      nextIconV: arrowDown$1,
      prevIconH: angleLeft,
      prevIconV: arrowUp$1
    },
    Checkbox: {
      position: 'start'
    },
    Datepicker: {
      clearIcon: close,
      display: 'center'
    },
    Dropdown: textFieldOpt$2,
    Eventcalendar: {
      chevronIconDown: angleDown,
      nextIconH: angleRight,
      nextIconV: arrowDown$1,
      prevIconH: angleLeft,
      prevIconV: arrowUp$1
    },
    Input: textFieldOpt$2,
    Scroller: {
      display: 'center',
      itemHeight: 44,
      minWheelWidth: 88,
      rows: 6
    },
    Select: {
      clearIcon: close,
      rows: 6
    },
    Textarea: textFieldOpt$2
  };
  createCustomTheme('windows-dark', 'windows');

  autoDetect.theme = getAutoTheme();

  // Arabic
  function intPart(floatNum) {
    if (floatNum < -0.0000001) {
      return Math.ceil(floatNum - 0.0000001);
    }
    return Math.floor(floatNum + 0.0000001);
  }
  function hijriToGregorian(hY, hM, hD) {
    var l;
    var j;
    var n;
    var i;
    var k;
    var gregDate = new Array(3);
    var jd = intPart((11 * hY + 3) / 30) + 354 * hY + 30 * hM - intPart((hM - 1) / 2) + hD + 1948440 - 385;
    if (jd > 2299160) {
      l = jd + 68569;
      n = intPart((4 * l) / 146097);
      l = l - intPart((146097 * n + 3) / 4);
      i = intPart((4000 * (l + 1)) / 1461001);
      l = l - intPart((1461 * i) / 4) + 31;
      j = intPart((80 * l) / 2447);
      hD = l - intPart((2447 * j) / 80);
      l = intPart(j / 11);
      hM = j + 2 - 12 * l;
      hY = 100 * (n - 49) + i + l;
    } else {
      j = jd + 1402;
      k = intPart((j - 1) / 1461);
      l = j - 1461 * k;
      n = intPart((l - 1) / 365) - intPart(l / 1461);
      i = l - 365 * n + 30;
      j = intPart((80 * i) / 2447);
      hD = i - intPart((2447 * j) / 80);
      i = intPart(j / 11);
      hM = j + 2 - 12 * i;
      hY = 4 * k + n + i - 4716;
    }
    gregDate[2] = hD;
    gregDate[1] = hM;
    gregDate[0] = hY;
    return gregDate;
  }
  function gregorianToHijri(gY, gM, gD) {
    var jd;
    var l;
    var j;
    var n;
    var hijriDate = [0, 0, 0];
    if (gY > 1582 || (gY === 1582 && gM > 10) || (gY === 1582 && gM === 10 && gD > 14)) {
      jd =
        intPart((1461 * (gY + 4800 + intPart((gM - 14) / 12))) / 4) +
        intPart((367 * (gM - 2 - 12 * intPart((gM - 14) / 12))) / 12) -
        intPart((3 * intPart((gY + 4900 + intPart((gM - 14) / 12)) / 100)) / 4) +
        gD -
        32075;
    } else {
      jd = 367 * gY - intPart((7 * (gY + 5001 + intPart((gM - 9) / 7))) / 4) + intPart((275 * gM) / 9) + gD + 1729777;
    }
    l = jd - 1948440 + 10632;
    n = intPart((l - 1) / 10631);
    l = l - 10631 * n + 354;
    j = intPart((10985 - l) / 5316) * intPart((50 * l) / 17719) + intPart(l / 5670) * intPart((43 * l) / 15238);
    l = l - intPart((30 - j) / 15) * intPart((17719 * j) / 50) - intPart(j / 16) * intPart((15238 * j) / 43) + 29;
    gM = intPart((24 * l) / 709);
    gD = l - intPart((709 * gM) / 24);
    gY = 30 * n + j - 30;
    hijriDate[2] = gD;
    hijriDate[1] = gM;
    hijriDate[0] = gY;
    return hijriDate;
  }
  var hijriCalendar = {
    getYear: function (date) {
      return gregorianToHijri(date.getFullYear(), date.getMonth() + 1, date.getDate())[0];
    },
    getMonth: function (date) {
      return --gregorianToHijri(date.getFullYear(), date.getMonth() + 1, date.getDate())[1];
    },
    getDay: function (date) {
      return gregorianToHijri(date.getFullYear(), date.getMonth() + 1, date.getDate())[2];
    },
    getDate: function (y, m, d, h, i, s, u) {
      if (m < 0) {
        y += Math.floor(m / 12);
        m = m % 12 ? 12 + (m % 12) : 0;
      }
      if (m > 11) {
        y += Math.floor(m / 12);
        m = m % 12;
      }
      var gregorianDate = hijriToGregorian(y, +m + 1, d);
      return new Date(gregorianDate[0], gregorianDate[1] - 1, gregorianDate[2], h || 0, i || 0, s || 0, u || 0);
    },
    getMaxDayOfMonth: function (hY, hM) {
      if (hM < 0) {
        hY += Math.floor(hM / 12);
        hM = hM % 12 ? 12 + (hM % 12) : 0;
      }
      if (hM > 11) {
        hY += Math.floor(hM / 12);
        hM = hM % 12;
      }
      var daysPerMonth = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
      var leapYear = (hY * 11 + 14) % 30 < 11;
      return daysPerMonth[hM] + (hM === 11 && leapYear ? 1 : 0);
    }
  };

  var UNDEFINED = undefined;
  var ARRAY3 = getArray(3);
  var ARRAY4 = getArray(4);
  var ARRAY7 = getArray(7);
  getArray(24);
  /**
   * Constrains the value to be between min and max.
   * @hidden
   * @param val   Tha value to constrain.
   * @param min   Min value.
   * @param max   Max value.
   * @return      The constrained value.
   */
  function constrain(val, min, max) {
    return Math.max(min, Math.min(val, max));
  }
  /** @hidden */
  function isArray(obj) {
    return Array.isArray(obj);
  }
  /** @hidden */
  function isNumeric(a) {
    return a - parseFloat(a) >= 0;
  }
  /** @hidden */
  function isNumber(a) {
    return typeof a === 'number';
  }
  /** @hidden */
  function isString(s) {
    return typeof s === 'string';
  }
  /** @hidden */
  function isEmpty(v) {
    return v === UNDEFINED || v === null || v === '';
  }
  /** @hidden */
  function isUndefined(v) {
    return typeof v === 'undefined';
  }
  /** @hidden */
  function isObject(v) {
    return typeof v === 'object';
  }
  /** @hidden */
  function emptyOrTrue(value) {
    return value !== null && value !== UNDEFINED && '' + value !== 'false';
  }
  /**
   * Returns an array with the specified length.
   * @hidden
   * @param nr Length of the array to create.
   * @return Array with the specified length.
   */
  function getArray(nr) {
    return Array.apply(0, Array(Math.max(0, nr)));
  }
  /** @hidden */
  function addPixel(value) {
    return value !== UNDEFINED ? value + (isNumeric(value) ? 'px' : '') : '';
  }
  /** @hidden */
  function noop() {
    return;
  }
  /** @hidden */
  function pad(num, size) {
    if (size === void 0) {
      size = 2;
    }
    var str = num + '';
    while (str.length < size) {
      str = '0' + str;
    }
    return str;
  }
  /** @hidden */
  function round(nr) {
    return Math.round(nr);
  }
  /** @hidden */
  function step(value, st) {
    // return Math.min(max, floor(value / st) * st + min);
    return floor(value / st) * st;
  }
  /** @hidden */
  function floor(nr) {
    return Math.floor(nr);
  }
  /** @hidden */
  function throttle(fn, threshhold) {
    if (threshhold === void 0) {
      threshhold = 100;
    }
    var last;
    var timer;
    return function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      var now = +new Date();
      if (last && now < last + threshhold) {
        clearTimeout(timer);
        timer = setTimeout(function () {
          last = now;
          fn.apply(void 0, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(void 0, args);
      }
    };
  }
  /** @hidden */
  function debounce(fn, threshhold) {
    if (threshhold === void 0) {
      threshhold = 100;
    }
    var timer;
    return function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(void 0, args);
      }, threshhold);
    };
  }
  /**
   * Like setTimeout, but only for Angular, otherwise calls the function instantly.
   * @param inst The component instance.
   * @param cb The callback function.
   */
  function ngSetTimeout(inst, cb) {
    if (inst._cdr) {
      // It's an Angular component
      setTimeout(cb);
    } else {
      cb();
    }
  }
  /**
   * Returns the value of the first element in the array that satisfies the testing function.
   * If no values satisfy the testing function, undefined is returned.
   * @hidden
   * @param arr The array to search.
   * @param fn Function to execute on each value in the array.
   */
  function find(arr, fn) {
    return findItemOrIndex(arr, fn);
  }
  /**
   * Returns the index of the first element in the array that satisfies the testing function.
   * If no values satisfy the testing function, -1 is returned.
   * @hidden
   * @param arr The array to search.
   * @param fn Function to execute on each value in the array.
   */
  function findIndex(arr, fn) {
    return findItemOrIndex(arr, fn, true);
  }
  function findItemOrIndex(arr, fn, index) {
    var len = arr.length;
    for (var i = 0; i < len; i++) {
      var item = arr[i];
      if (fn(item, i)) {
        return index ? i : item;
      }
    }
    return index ? -1 : UNDEFINED;
  }
  /**
   * Just like the .map() function, only it checks for single values as well, not only arrays
   * @param v a single value or an array of values to call the function on
   * @param fn the ransform function to call on each items
   * @returns a single value or an array values transformed by the function provided
   */
  function map(v, fn) {
    if (isArray(v)) {
      return v.map(fn);
    } else {
      return fn(v, 0, [v]);
    }
  }
  /**
   * Converts map to array.
   */
  function toArray(m) {
    var arr = [];
    if (m) {
      for (var _i = 0, _a = Object.keys(m); _i < _a.length; _i++) {
        var key = _a[_i];
        arr.push(m[key]);
      }
    }
    return arr;
  }

  // فارسی
  var gDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var jDaysInMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  function jalaliToGregorian(jY, jM, jD) {
    var i;
    var jy = jY - 979;
    var jm = jM - 1;
    var jd = jD - 1;
    var jDayNo = 365 * jy + floor(jy / 33) * 8 + floor(((jy % 33) + 3) / 4);
    for (i = 0; i < jm; ++i) {
      jDayNo += jDaysInMonth[i];
    }
    jDayNo += jd;
    var gDayNo = jDayNo + 79;
    var gy = 1600 + 400 * floor(gDayNo / 146097);
    gDayNo = gDayNo % 146097;
    var leap = true;
    if (gDayNo >= 36525) {
      gDayNo--;
      gy += 100 * floor(gDayNo / 36524);
      gDayNo = gDayNo % 36524;
      if (gDayNo >= 365) {
        gDayNo++;
      } else {
        leap = false;
      }
    }
    gy += 4 * floor(gDayNo / 1461);
    gDayNo %= 1461;
    if (gDayNo >= 366) {
      leap = false;
      gDayNo--;
      gy += floor(gDayNo / 365);
      gDayNo = gDayNo % 365;
    }
    for (i = 0; gDayNo >= gDaysInMonth[i] + (i === 1 && leap ? 1 : 0); i++) {
      gDayNo -= gDaysInMonth[i] + (i === 1 && leap ? 1 : 0);
    }
    var gm = i + 1;
    var gd = gDayNo + 1;
    return [gy, gm, gd];
  }
  function checkDate(jY, jM, jD) {
    return !(
      jY < 0 ||
      jY > 32767 ||
      jM < 1 ||
      jM > 12 ||
      jD < 1 ||
      jD > jDaysInMonth[jM - 1] + (jM === 12 && ((jY - 979) % 33) % 4 === 0 ? 1 : 0)
    );
  }
  function gregorianToJalali(gY, gM, gD) {
    var i;
    var gy = gY - 1600;
    var gm = gM - 1;
    var gd = gD - 1;
    var gDayNo = 365 * gy + floor((gy + 3) / 4) - floor((gy + 99) / 100) + floor((gy + 399) / 400);
    for (i = 0; i < gm; ++i) {
      gDayNo += gDaysInMonth[i];
    }
    if (gm > 1 && ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0)) {
      ++gDayNo;
    }
    gDayNo += gd;
    var jDayNo = gDayNo - 79;
    var jNp = floor(jDayNo / 12053);
    jDayNo %= 12053;
    var jy = 979 + 33 * jNp + 4 * floor(jDayNo / 1461);
    jDayNo %= 1461;
    if (jDayNo >= 366) {
      jy += floor((jDayNo - 1) / 365);
      jDayNo = (jDayNo - 1) % 365;
    }
    for (i = 0; i < 11 && jDayNo >= jDaysInMonth[i]; ++i) {
      jDayNo -= jDaysInMonth[i];
    }
    var jm = i + 1;
    var jd = jDayNo + 1;
    return [jy, jm, jd];
  }
  var jalaliCalendar = {
    getYear: function (date) {
      return gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate())[0];
    },
    getMonth: function (date) {
      return --gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate())[1];
    },
    getDay: function (date) {
      return gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate())[2];
    },
    getDate: function (y, m, d, h, i, s, u) {
      if (m < 0) {
        y += floor(m / 12);
        m = m % 12 ? 12 + (m % 12) : 0;
      }
      if (m > 11) {
        y += floor(m / 12);
        m = m % 12;
      }
      var gregorianDate = jalaliToGregorian(y, +m + 1, d);
      return new Date(gregorianDate[0], gregorianDate[1] - 1, gregorianDate[2], h || 0, i || 0, s || 0, u || 0);
    },
    getMaxDayOfMonth: function (y, m) {
      var maxdays = 31;
      if (m < 0) {
        y += floor(m / 12);
        m = m % 12 ? 12 + (m % 12) : 0;
      }
      if (m > 11) {
        y += floor(m / 12);
        m = m % 12;
      }
      while (checkDate(y, m + 1, maxdays) === false) {
        maxdays--;
      }
      return maxdays;
    }
  };

  // ar import localeAr from '../i18n/ar';
  // bg import localeBg from '../i18n/bg';
  // ca import localeCa from '../i18n/ca';
  // cs import localeCs from '../i18n/cs';
  // da import localeDa from '../i18n/da';
  // de import localeDe from '../i18n/de';
  // el import localeEl from '../i18n/el';
  // engb import localeEnGB from '../i18n/en-GB';
  // es import localeEs from '../i18n/es';
  // fa import localeFa from '../i18n/fa';
  // fi import localeFi from '../i18n/fi';
  // fr import localeFr from '../i18n/fr';
  // he import localeHe from '../i18n/he';
  // hi import localeHi from '../i18n/hi';
  // hr import localeHr from '../i18n/hr';
  // hu import localeHu from '../i18n/hu';
  // it import localeIt from '../i18n/it';
  // ja import localeJa from '../i18n/ja';
  // ko import localeKo from '../i18n/ko';
  // lt import localeLt from '../i18n/lt';
  // nl import localeNl from '../i18n/nl';
  // no import localeNo from '../i18n/no';
  // pl import localePl from '../i18n/pl';
  // ptbr import localePtBR from '../i18n/pt-BR';
  // ptpt import localePtPT from '../i18n/pt-PT';
  // ro import localeRo from '../i18n/ro';
  // ru import localeRu from '../i18n/ru';
  // ruua import localeRuUA from '../i18n/ru-UA';
  // sk import localeSk from '../i18n/sk';
  // sr import localeSr from '../i18n/sr';
  // sv import localeSv from '../i18n/sv';
  // th import localeTh from '../i18n/th';
  // tr import localeTr from '../i18n/tr';
  // ua import localeUa from '../i18n/ua';
  // vi import localeVi from '../i18n/vi';
  // zh import localeZh from '../i18n/zh';

  var localeEn = {};

  var locale = {
    // ar   ar: localeAr,
    // bg   bg: localeBg,
    // ca   ca: localeCa,
    // cs   cs: localeCs,
    // da   da: localeDa,
    // de   de: localeDe,
    // el   el: localeEl,
    en: localeEn
    // engb   'en-GB': localeEnGB,
    // es   es: localeEs,
    // fa   fa: localeFa,
    // fi   fi: localeFi,
    // fr   fr: localeFr,
    // he   he: localeHe,
    // hi   hi: localeHi,
    // hr   hr: localeHr,
    // hu   hu: localeHu,
    // it   it: localeIt,
    // ja   ja: localeJa,
    // ko   ko: localeKo,
    // lt   lt: localeLt,
    // nl   nl: localeNl,
    // no   no: localeNo,
    // pl   pl: localePl,
    // ptbr   'pt-BR': localePtBR,
    // ptpt   'pt-PT': localePtPT,
    // ro   ro: localeRo,
    // ru   ru: localeRu,
    // ruua   'ru-UA': localeRuUA,
    // sk   sk: localeSk,
    // sr   sr: localeSr,
    // sv   sv: localeSv,
    // th   th: localeTh,
    // tr   tr: localeTr,
    // ua   ua: localeUa,
    // vi   vi: localeVi,
    // zh   zh: localeZh,
  };

  // tslint:disable no-non-null-assertion
  /**
   * Generic DOM functions.
   */
  var doc = isBrowser ? document : UNDEFINED;
  var win = isBrowser ? window : UNDEFINED;
  var prefixes = ['Webkit', 'Moz'];
  var elem = doc && doc.createElement('div').style;
  var canvas = doc && doc.createElement('canvas');
  var ctx = canvas && canvas.getContext && canvas.getContext('2d');
  var css = win && win.CSS;
  var cssSupports = css && css.supports;
  var textColors = {};
  var raf =
    (win && win.requestAnimationFrame) ||
    function (func) {
      return setTimeout(func, 20);
    };
  var rafc =
    (win && win.cancelAnimationFrame) ||
    function (id) {
      clearTimeout(id);
    };
  var hasAnimation = elem && elem.animationName !== UNDEFINED;
  // UIWebView on iOS still has the ghost click,
  // WkWebView does not have a ghost click, but it's hard to tell if it's UIWebView or WkWebView
  // In addition in iOS 12.2 if we enable tap handling, it brakes the form inputs
  // (keyboard appears, but the cursor is not in the input).
  var isWebView = os === 'ios' && !isSafari;
  var isWkWebView = isWebView && win && win.webkit && win.webkit.messageHandlers;
  var hasGhostClick = (elem && elem.touchAction === UNDEFINED) || (isWebView && !isWkWebView);
  var jsPrefix = getPrefix();
  var cssPrefix = jsPrefix ? '-' + jsPrefix.toLowerCase() + '-' : '';
  var has3d = cssSupports && cssSupports('(transform-style: preserve-3d)');
  var hasSticky = cssSupports && (cssSupports('position', 'sticky') || cssSupports('position', '-webkit-sticky'));
  /** @hidden */
  function getPrefix() {
    if (!elem || elem.transform !== UNDEFINED) {
      return '';
    }
    for (var _i = 0, prefixes_1 = prefixes; _i < prefixes_1.length; _i++) {
      var prefix = prefixes_1[_i];
      if (elem[prefix + 'Transform'] !== UNDEFINED) {
        return prefix;
      }
    }
    return '';
  }
  /**
   * @hidden
   * @param el
   * @param event
   * @param handler
   */
  function listen(el, event, handler, opt) {
    if (el) {
      el.addEventListener(event, handler, opt);
    }
  }
  /**
   * @hidden
   * @param el
   * @param event
   * @param handler
   */
  function unlisten(el, event, handler, opt) {
    if (el) {
      el.removeEventListener(event, handler, opt);
    }
  }
  /**
   * @hidden
   * @param el
   */
  function getDocument(el) {
    if (!isBrowser) {
      return UNDEFINED;
    }
    return el && el.ownerDocument ? el.ownerDocument : doc;
  }
  function getDimension(el, property) {
    return parseFloat(getComputedStyle(el)[property] || '0');
  }
  function getScrollLeft(el) {
    return el.scrollLeft !== UNDEFINED ? el.scrollLeft : el.pageXOffset;
  }
  function getScrollTop(el) {
    return el.scrollTop !== UNDEFINED ? el.scrollTop : el.pageYOffset;
  }
  function setScrollLeft(el, val) {
    if (el.scrollTo) {
      el.scrollTo(val, el.scrollY);
    } else {
      el.scrollLeft = val;
    }
  }
  function setScrollTop(el, val) {
    if (el.scrollTo) {
      el.scrollTo(el.scrollX, val);
    } else {
      el.scrollTop = val;
    }
  }
  /**
   * @hidden
   * @param el
   */
  function getWindow(el) {
    if (!isBrowser) {
      return UNDEFINED;
    }
    return el && el.ownerDocument && el.ownerDocument.defaultView ? el.ownerDocument.defaultView : win;
  }
  /**
   * @hidden
   * @param el
   * @param vertical
   */
  function getPosition(el, vertical) {
    var style = getComputedStyle(el);
    var transform = jsPrefix ? style[jsPrefix + 'Transform'] : style.transform;
    var matrix = transform.split(')')[0].split(', ');
    var px = vertical ? matrix[13] || matrix[5] : matrix[12] || matrix[4];
    return +px || 0;
  }
  /**
   * Calculates the text color to be used with a given color (black or white)
   * @hidden
   * @param color
   */
  function getTextColor(color) {
    // Cache calculated text colors, because it is slow
    if (textColors[color]) {
      return textColors[color];
    }
    if (!ctx) {
      return '#fff';
    }
    // Use canvas element, since it does not require DOM append
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    var img = ctx.getImageData(0, 0, 1, 1);
    var rgb = img ? img.data : [0, 0, 0];
    var delta = +rgb[0] * 0.299 + +rgb[1] * 0.587 + +rgb[2] * 0.114;
    var textColor = delta < 130 ? '#fff' : '#000';
    textColors[color] = textColor;
    return textColor;
  }
  /** @hidden */
  function scrollStep(elm, startTime, fromX, fromY, toX, toY, callback) {
    var elapsed = Math.min(1, (+new Date() - startTime) / 468);
    var eased = 0.5 * (1 - Math.cos(Math.PI * elapsed));
    var currentX;
    var currentY;
    if (toX !== UNDEFINED) {
      currentX = round(fromX + (toX - fromX) * eased);
      elm.scrollLeft = currentX;
    }
    if (toY !== UNDEFINED) {
      currentY = round(fromY + (toY - fromY) * eased);
      elm.scrollTop = currentY;
    }
    if (currentX !== toX || currentY !== toY) {
      raf(function () {
        scrollStep(elm, startTime, fromX, fromY, toX, toY, callback);
      });
    } else if (callback) {
      callback();
    }
  }
  /**
   * Scrolls a container to the given position
   * @hidden
   * @param elm Element to scroll
   * @param toX Position to scroll horizontally to
   * @param toY Position to scroll vertically to
   * @param animate If true, scroll will be animated
   * @param rtl Rtl
   * @param callback Callback when scroll position is reached
   */
  function smoothScroll(elm, toX, toY, animate, rtl, callback) {
    if (toX !== UNDEFINED) {
      toX = Math.max(0, round(toX));
    }
    if (toY !== UNDEFINED) {
      toY = Math.max(0, round(toY));
    }
    if (rtl && toX !== UNDEFINED) {
      toX = -toX;
    }
    if (animate) {
      scrollStep(elm, +new Date(), elm.scrollLeft, elm.scrollTop, toX, toY, callback);
    } else {
      if (toX !== UNDEFINED) {
        elm.scrollLeft = toX;
      }
      if (toY !== UNDEFINED) {
        elm.scrollTop = toY;
      }
      if (callback) {
        callback();
      }
    }
  }
  /**
   * Convert html text to plain text
   * @hidden
   * @param htmlString
   */
  function htmlToText(htmlString) {
    if (doc && htmlString) {
      var tempElm = doc.createElement('div');
      tempElm.innerHTML = htmlString;
      return tempElm.textContent.trim();
    }
    return htmlString || '';
  }
  /**
   * Gets the offset of a HTML element relative to the window
   * @param el The HTML element
   */
  function getOffset(el) {
    var bRect = el.getBoundingClientRect();
    var ret = {
      left: bRect.left,
      top: bRect.top
    };
    var window = getWindow(el);
    if (window !== UNDEFINED) {
      ret.top += getScrollTop(window);
      ret.left += getScrollLeft(window);
    }
    return ret;
  }
  /**
   * Checks if an HTML element matches the given selector
   * @param elm
   * @param selector
   */
  function matches(elm, selector) {
    // IE11 only supports msMatchesSelector
    var matchesSelector = elm && (elm.matches || elm.msMatchesSelector);
    return matchesSelector && matchesSelector.call(elm, selector);
  }
  /**
   * Returns the closest parent element matching the selector
   * @param elm The starting element
   * @param selector The selector string
   * @param context Only look within the context element
   */
  function closest(elm, selector, context) {
    while (elm && !matches(elm, selector)) {
      if (elm === context || elm.nodeType === elm.DOCUMENT_NODE) {
        return null;
      }
      elm = elm.parentNode;
    }
    return elm;
  }
  /**
   * Triggers an event on a HTML element
   * NOTE: React messes with the eventlisteners, so triggering an event with
   * this method will not be picked up with a react way listener (ex. `<input onChange={handler} />`),
   * instead will require to be listened manually (ex. listen/unlisten util functions)
   * @param elm The target HTML element, the event will triggered on
   * @param name The name of the event
   * @param data Additional event data
   */
  function trigger(elm, name, data) {
    var evt;
    try {
      evt = new CustomEvent(name, {
        bubbles: true,
        cancelable: true,
        detail: data
      });
    } catch (e) {
      evt = document.createEvent('Event');
      evt.initEvent(name, true, true);
      evt.detail = data;
    }
    elm.dispatchEvent(evt);
  }
  function forEach(items, func) {
    for (var i = 0; i < items.length; i++) {
      func(items[i], i);
    }
  }

  var print = {
    init: function (inst) {
      inst.print = function (config) {
        if (win) {
          inst._print = true;
          inst.forceUpdate();
          var printWin_1 = win.open('', 'Print', 'menubar=no,location=no,resizable=no,scrollbars=no,status=no,width=1024,height=1024');
          var printDoc_1 = printWin_1.document;
          // Add Base tag to the print document
          var configOrDefault = config || {};
          var baseUrl = configOrDefault.baseUrl || win.location.origin;
          var base = printDoc_1.createElement('base');
          base.setAttribute('href', baseUrl);
          printDoc_1.head.appendChild(base);
          var el_1 = inst._el;
          var doc = getDocument(el_1);
          // Set title
          printDoc_1.title = doc.title;
          // Copy all styles
          var styles = doc.querySelectorAll('style,link');
          var sMap_1 = new Map();
          styles.forEach(function (style) {
            if (style.nodeName.toLowerCase() !== 'link' || style.getAttribute('rel') === 'stylesheet') {
              var styleClone_1 = cloneNode(printDoc_1, style);
              sMap_1.set(styleClone_1, false);
              styleClone_1.onload = function () {
                return sMap_1.delete(styleClone_1);
              };
              printDoc_1.head.appendChild(styleClone_1);
            }
          });
          // fix for third party styles that make the body disappear
          printDoc_1.body.style.setProperty('display', 'block', 'important');
          // Copy the element to print
          var loading_1 = printDoc_1.createElement('div'); // printDoc.importNode(el, true);
          loading_1.innerHTML = 'Loading...'; // in IE11 the cloning of the eventcalendar takes a while
          printDoc_1.body.appendChild(loading_1);
          var i_1 = 0;
          var int_1 = setInterval(function () {
            if (!sMap_1.size || i_1 > 300) {
              clearInterval(int_1);
              // clone the element
              var elClone = cloneNode(printDoc_1, el_1);
              printDoc_1.body.appendChild(elClone);
              printDoc_1.body.removeChild(loading_1);
              // ** Eventcalendar specific code **
              // Restore horizontal scroll positions (timeline)
              var tlScrollDiv = el_1.querySelector('.mbsc-timeline-grid-scroll');
              if (tlScrollDiv) {
                var tlScrollDivClone = elClone.querySelector('.mbsc-timeline-grid-scroll');
                tlScrollDivClone.scrollLeft = tlScrollDiv.scrollLeft;
              }
              // Restore horizontal scroll positions (scheduler)
              var scScrollDiv = el_1.querySelector('.mbsc-schedule-grid-scroll');
              if (scScrollDiv) {
                var scScrollDivClone = elClone.querySelector('.mbsc-schedule-grid-scroll');
                scScrollDivClone.scrollLeft = scScrollDiv.scrollLeft;
              }
              // Open print dialog then close the window
              printWin_1.document.close();
              setTimeout(function () {
                printWin_1.focus();
                printWin_1.print();
                printWin_1.close();
                inst._print = false;
                inst.forceUpdate();
              }, 10);
            }
            i_1++;
          }, 10);
        }
      };
    }
  };
  /**
   * Creates a clone of a Node. Clones elements, text and attributes.
   * We need to use this, instead of the built in clone function of elements for IE11.
   * Reason: In IE11, elements created/cloned from a different document, won't be added to a new document
   * @param doc The document the Node needs to be added to
   * @param node The Original Node that needs to be cloned
   * @returns The cloned Node for a document
   */
  function cloneNode(doc, node) {
    var clone = null;
    if (node.nodeType === 1) {
      // Element
      clone = doc.createElement(node.nodeName);
      var attrs = getAllAttributes(node);
      attrs.forEach(function (attributeName) {
        var attrValue = node.getAttribute(attributeName);
        if (attrValue) {
          clone.setAttribute(attributeName, attrValue);
        }
      });
    } else if (node.nodeType === 3) {
      // text
      clone = doc.createTextNode(node.nodeValue);
    }
    if (clone != null) {
      node.childNodes.forEach(function (child) {
        var childClone = cloneNode(doc, child);
        if (childClone) {
          clone.appendChild(childClone);
        }
      });
    }
    return clone;
  }
  /** Returns an array of all attributes of a HTMLElement */
  function getAllAttributes(el) {
    var arr = [];
    var atts = el.attributes;
    // tslint:disable-next-line
    for (var i = 0; i < atts.length; i++) {
      arr.push(atts[i].name);
    }
    return arr;
  }

  // tslint:disable no-non-null-assertion
  // TODO: Add types and descriptions
  var REF_DATE = new Date(1970, 0, 1);
  var ONE_MIN = 60000;
  var ONE_HOUR = 60 * ONE_MIN;
  var ONE_DAY = 24 * ONE_HOUR;
  /**
   * Returns if a date object is a pseudo-date object
   * Pseudo-date objects are our implementation of a Date interface
   */
  function isMBSCDate(d) {
    return !!d._mbsc;
  }
  /**
   * Returns an ISO8601 date string in data timezone, if it's a timezoned date, otherwise the original date.
   * @param d The date to check.
   * @param s Options object containing timezone options.
   */
  function convertTimezone(d, s) {
    var timezone = s.dataTimezone || s.displayTimezone;
    var timezonePlugin = s.timezonePlugin;
    if (timezone && timezonePlugin && isMBSCDate(d)) {
      var clone = d.clone();
      clone.setTimezone(timezone);
      return clone.toISOString();
    }
    return d;
  }
  /** @hidden */
  var dateTimeLocale = {
    amText: 'am',
    dateFormat: 'MM/DD/YYYY',
    dateFormatLong: 'D DDD MMM YYYY',
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    daySuffix: '',
    firstDay: 0,
    fromText: 'Start',
    getDate: adjustedDate,
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    monthSuffix: '',
    pmText: 'pm',
    separator: ' ',
    shortYearCutoff: '+10',
    timeFormat: 'h:mm A',
    toText: 'End',
    todayText: 'Today',
    weekText: 'Week {count}',
    yearSuffix: '',
    getMonth: function (d) {
      return d.getMonth();
    },
    getDay: function (d) {
      return d.getDate();
    },
    getYear: function (d) {
      return d.getFullYear();
    },
    getMaxDayOfMonth: function (y, m) {
      return 32 - new Date(y, m, 32, 12).getDate();
    },
    getWeekNumber: function (dt) {
      // Copy date so don't modify original
      var d = new Date(+dt);
      d.setHours(0, 0, 0);
      // Set to nearest Thursday: current date + 4 - current day number
      // Make Sunday's day number 7
      d.setDate(d.getDate() + 4 - (d.getDay() || 7));
      // Get first day of year
      var yearStart = new Date(d.getFullYear(), 0, 1);
      // Calculate full weeks to nearest Thursday
      return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    }
  };
  // tslint:disable-next-line max-line-length
  var ISO_8601_FULL =
    /^(\d{4}|[+-]\d{6})(?:-?(\d{2})(?:-?(\d{2}))?)?(?:[T\s](\d{2}):?(\d{2})(?::?(\d{2})(?:\.(\d{3}))?)?((Z)|([+-])(\d{2})(?::?(\d{2}))?)?)?$/;
  var ISO_8601_TIME = /^((\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+-])(\d{2})(?::?(\d{2}))?)?)?$/;
  /** @hidden */
  function setISOParts(parsed, offset, parts) {
    var part;
    var v;
    var p = { y: 1, m: 2, d: 3, h: 4, i: 5, s: 6, u: 7, tz: 8 };
    if (parts) {
      for (part in p) {
        if (p.hasOwnProperty(part)) {
          v = parsed[p[part] - offset];
          if (v) {
            parts[part] = part === 'tz' ? v : 1;
          }
        }
      }
    }
  }
  /** @hidden */
  function getISOString(d, parts) {
    var ret = '';
    var time = '';
    if (d) {
      if (parts.h) {
        time += pad(d.getHours()) + ':' + pad(d.getMinutes());
        if (parts.s) {
          time += ':' + pad(d.getSeconds());
        }
        if (parts.u) {
          time += '.' + pad(d.getMilliseconds(), 3);
        }
        if (parts.tz) {
          time += parts.tz; // Just put what we got
        }
      }
      if (parts.y) {
        ret += d.getFullYear();
        if (parts.m) {
          ret += '-' + pad(d.getMonth() + 1);
          if (parts.d) {
            ret += '-' + pad(d.getDate());
          }
          if (parts.h) {
            ret += 'T' + time;
          }
        }
      } else if (parts.h) {
        ret = time;
      }
    }
    return ret;
  }
  /**
   * Returns the milliseconds of a date since midnight.
   * @hidden
   * @param d The date.
   */
  function getDayMilliseconds(d) {
    // We need to use a date where we don't have DST change
    var dd = new Date(1970, 0, 1, d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
    return +dd - +REF_DATE;
  }
  /**
   * Checks if two date ranges are overlapping each other
   * @hidden
   * @param start1 start date of the first range
   * @param end1 end date of the first range
   * @param start2 start date of the second range
   * @param end2 end date of the second range
   * @param adjust if true, 0 length range will be modified to 1ms
   * @returns true if there is overlap false otherwise
   */
  function checkDateRangeOverlap(start1, end1, start2, end2, adjust) {
    var aStart = +start1;
    var bStart = +start2;
    var aEnd = adjust && aStart === +end1 ? +end1 + 1 : +end1;
    var bEnd = adjust && bStart === +end2 ? +end2 + 1 : +end2;
    return aStart < bEnd && aEnd > bStart;
  }
  /**
   * Returns the starting point of a day in display timezone
   * @param s
   * @param d
   * @returns
   */
  function getDayStart(s, d) {
    var newDate = createDate(s, d);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }
  /**
   * Returns the last point of a day in display timezone
   * @param s
   * @param d
   * @returns
   */
  function getDayEnd(s, d) {
    var newDate = createDate(s, d);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
  }
  /** @hidden */
  function getEndDate(s, allDay, start, end, isList) {
    var exclusive = allDay || isList ? s.exclusiveEndDates : true;
    var tzOpt = allDay ? UNDEFINED : s;
    return exclusive && start && end && start < end ? createDate(tzOpt, +end - 1) : end;
  }
  /** @hidden */
  function getDateStr(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  /** @hidden */
  function getDateOnly(d, nativeDate) {
    if (isMBSCDate(d) && !nativeDate) {
      return d.createDate(d.getFullYear(), d.getMonth(), d.getDate());
    } else {
      return adjustedDate(d.getFullYear(), d.getMonth(), d.getDate());
    }
  }
  /** @hidden */
  function getUTCDateOnly(d) {
    return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  }
  /**
   * Returns the difference in days for two dates
   * @hidden
   * @param d1 First date
   * @param d2 Second date
   * @returns Difference in days
   */
  function getDayDiff(d1, d2) {
    return round((getUTCDateOnly(d2) - getUTCDateOnly(d1)) / ONE_DAY);
  }
  /**
   * Returns the number of days between two dates if there are missing days between them
   * @hidden
   */
  function getGridDayDiff(from, to, startDay, endDay) {
    var dayIndex = -1;
    for (var d = getDateOnly(from); d <= getDateOnly(to); d.setDate(d.getDate() + 1)) {
      if (isInWeek(d.getDay(), startDay, endDay)) {
        dayIndex++;
      }
    }
    return dayIndex;
  }
  /**
   * Returns the date of the first day of the week for a given date
   * @hidden
   */
  function getFirstDayOfWeek(d, s, w) {
    var y = d.getFullYear(); // s.getYear(d);
    var m = d.getMonth(); // s.getMonth(d);
    var weekDay = d.getDay();
    var firstWeekDay = w === UNDEFINED ? s.firstDay : w;
    var offset = firstWeekDay - weekDay > 0 ? 7 : 0;
    return new Date(y, m, firstWeekDay - offset - weekDay + d.getDate());
  }
  /**
   * Checks if two dates are on the same date
   * @hidden
   * @param d1 First date
   * @param d2 Second date
   * @returns True or false
   */
  function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  }
  /**
   * Check if 2 dates are in the same month (depends on the calendar system).
   * @param d1 First date.
   * @param d2 Second date.
   * @param s Settings containing the calendar system functions.
   */
  function isSameMonth(d1, d2, s) {
    return s.getYear(d1) === s.getYear(d2) && s.getMonth(d1) === s.getMonth(d2);
  }
  /** @hidden */
  function adjustedDate(y, m, d, h, i, s, u) {
    var date = new Date(y, m, d, h || 0, i || 0, s || 0, u || 0);
    if (date.getHours() === 23 && (h || 0) === 0) {
      date.setHours(date.getHours() + 2);
    }
    return date;
  }
  function isDate(d) {
    return d.getTime;
  }
  function isTime(d) {
    return isString(d) && ISO_8601_TIME.test(d);
  }
  /**
   * When timezoneplugin is specified, return a date with the same parts as the passed date (year, month, day, hour)
   * only with a timezone specified to display timezone
   * Otherwise it returns the same thing in the local timezone
   * @param s Settings object
   * @param d Date object
   * @returns
   */
  function addTimezone(s, d) {
    return createDate(s, d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
  }
  /**
   * Returns a local date with the same year/monthday/hours/minutes... as the original date in the parameter
   * It does not convert to any timezone, it just takes the date/hour/minute and creates a new local date from that
   * @param d Date with or without timezone data or null/undefined
   * @returns A new local Date object or undefined/null when nothing is pass as param
   */
  function removeTimezone(d) {
    if (!d) {
      return d;
    } else {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
    }
  }
  function createDate(s, yearOrStamp, month, date, h, min, sec, ms) {
    if (yearOrStamp === null) {
      return null;
    }
    if (yearOrStamp && (isNumber(yearOrStamp) || isString(yearOrStamp)) && isUndefined(month)) {
      return makeDate(yearOrStamp, s);
    }
    if (s && s.timezonePlugin) {
      return s.timezonePlugin.createDate(s, yearOrStamp, month, date, h, min, sec, ms);
    }
    if (isObject(yearOrStamp)) {
      return new Date(yearOrStamp);
    }
    if (isUndefined(yearOrStamp)) {
      return new Date();
    }
    return new Date(yearOrStamp, month || 0, date || 1, h || 0, min || 0, sec || 0, ms || 0);
  }
  /** @hidden */
  // this should return a Date type or null, but it's fucking hard to make this work, so I give up
  // re: nice comment, but tslint gave an error about the line lenght, so I moved it above the function (@dioslaska).
  function makeDate(d, s, format, parts, skipTimezone) {
    var parse;
    if (isString(d)) {
      d = d.trim();
    }
    if (!d) {
      return null;
    }
    var plugin = s && s.timezonePlugin;
    if (plugin && !skipTimezone) {
      var parsedDate = isMBSCDate(d) ? d : plugin.parse(d, s);
      parsedDate.setTimezone(s.displayTimezone);
      return parsedDate;
    }
    // If already date object
    if (isDate(d)) {
      return d;
    }
    // Moment object
    if (d._isAMomentObject) {
      return d.toDate();
    }
    // timestamp
    if (isNumber(d)) {
      return new Date(d);
    }
    parse = ISO_8601_TIME.exec(d);
    // If ISO 8601 time string
    if (parse) {
      setISOParts(parse, 2, parts);
      return new Date(1970, 0, 1, parse[2] ? +parse[2] : 0, parse[3] ? +parse[3] : 0, parse[4] ? +parse[4] : 0, parse[5] ? +parse[5] : 0);
    }
    parse = ISO_8601_FULL.exec(d);
    // If ISO 8601 date string
    if (parse) {
      setISOParts(parse, 0, parts);
      return new Date(
        parse[1] ? +parse[1] : 1970,
        parse[2] ? parse[2] - 1 : 0,
        parse[3] ? +parse[3] : 1,
        parse[4] ? +parse[4] : 0,
        parse[5] ? +parse[5] : 0,
        parse[6] ? +parse[6] : 0,
        parse[7] ? +parse[7] : 0
      );
    }
    // Parse date based on format
    return parseDate(format, d, s);
  }
  /** @hidden */
  function returnDate(d, s, displayFormat, isoParts, hasTimePart) {
    var moment = (isBrowser && window.moment) || s.moment;
    var timezone = s.timezonePlugin && (s.dataTimezone || s.displayTimezone);
    var format = timezone ? 'iso8601' : s.returnFormat;
    if (timezone && hasTimePart) {
      return convertTimezone(d, s);
    }
    if (d) {
      if (format === 'moment' && moment) {
        return moment(d);
      }
      if (format === 'locale') {
        return formatDate(displayFormat, d, s);
      }
      if (format === 'iso8601') {
        return getISOString(d, isoParts);
      }
    }
    return d;
  }
  /**
   * Format a date into a string value with a specified format.
   * @param {string} format - Output format.
   * @param {Date} date - Date to format.
   * @param {IDatetimeProps} options - Locale options.
   * @returns {string} The formatted date string.
   */
  function formatDatePublic(format, date, options$1) {
    var s = __assign({}, dateTimeLocale, options.locale, options$1);
    return formatDate(format, date, s);
  }
  /**
   * Format a date into a string value with a specified format.
   * This is for inner usage, and it's faster than the one above, because it skips the option merge.
   * @param {string} format - Output format.
   * @param {Date} date - Date to format.
   * @param {IDatetimeProps} options - Locale options.
   * @returns {string} The formatted date string.
   */
  function formatDate(format, date, s) {
    // if (!date) {
    //   return null;
    // }
    var i;
    var year;
    var output = '';
    var literal = false;
    var c;
    // Counts how many times a symbol is repeated (0 if not repeated, 1 if its doubled, etc...)
    var peekAhead = function (symbol) {
      var nr = 0;
      var j = i;
      while (j + 1 < format.length && format.charAt(j + 1) === symbol) {
        nr++;
        j++;
      }
      return nr;
    };
    // Check whether a format character is doubled
    var lookAhead = function (symbol) {
      var nr = peekAhead(symbol);
      i += nr;
      return nr;
    };
    // Format a number, with leading zero if necessary
    var formatNumber = function (symbol, val, len) {
      var ret = '' + val;
      if (lookAhead(symbol)) {
        while (ret.length < len) {
          ret = '0' + ret;
        }
      }
      return ret;
    };
    // Format a name, short or long as requested
    var formatName = function (symbol, val, short, long) {
      return lookAhead(symbol) === 3 ? long[val] : short[val];
    };
    for (i = 0; i < format.length; i++) {
      if (literal) {
        if (format.charAt(i) === "'" && !lookAhead("'")) {
          literal = false;
        } else {
          output += format.charAt(i);
        }
      } else {
        switch (format.charAt(i)) {
          case 'D':
            c = peekAhead('D');
            if (c > 1) {
              output += formatName('D', date.getDay(), s.dayNamesShort, s.dayNames);
            } else {
              output += formatNumber('D', s.getDay(date), 2);
            }
            break;
          case 'M':
            c = peekAhead('M');
            if (c > 1) {
              output += formatName('M', s.getMonth(date), s.monthNamesShort, s.monthNames);
            } else {
              output += formatNumber('M', s.getMonth(date) + 1, 2);
            }
            break;
          case 'Y':
            year = s.getYear(date);
            output += lookAhead('Y') === 3 ? year : (year % 100 < 10 ? '0' : '') + (year % 100);
            break;
          case 'h':
            var h = date.getHours();
            output += formatNumber('h', h > 12 ? h - 12 : h === 0 ? 12 : h, 2);
            break;
          case 'H':
            output += formatNumber('H', date.getHours(), 2);
            break;
          case 'm':
            output += formatNumber('m', date.getMinutes(), 2);
            break;
          case 's':
            output += formatNumber('s', date.getSeconds(), 2);
            break;
          case 'a':
            output += date.getHours() > 11 ? s.pmText : s.amText;
            break;
          case 'A':
            output += date.getHours() > 11 ? s.pmText.toUpperCase() : s.amText.toUpperCase();
            break;
          case "'":
            if (lookAhead("'")) {
              output += "'";
            } else {
              literal = true;
            }
            break;
          default:
            output += format.charAt(i);
        }
      }
    }
    return output;
  }
  /**
   * Extract a date from a string value with a specified format.
   * @param {string} format Input format.
   * @param {string} value String to parse.
   * @param {IDatetimeProps} options Locale options
   * @return {Date} Returns the extracted date or defaults to now if no format or no value is given
   */
  function parseDate(format, value, options) {
    var s = __assign({}, dateTimeLocale, options);
    var def = makeDate(s.defaultValue || new Date());
    if (!value) {
      return def;
    }
    if (!format) {
      format = s.dateFormat + s.separator + s.timeFormat;
    }
    var shortYearCutoff = s.shortYearCutoff;
    var year = s.getYear(def);
    var month = s.getMonth(def) + 1;
    // let doy = -1,
    var day = s.getDay(def);
    var hours = def.getHours();
    var minutes = def.getMinutes();
    var seconds = 0; // def.getSeconds()
    var ampm = -1;
    var literal = false;
    var iValue = 0;
    var iFormat;
    /**
     * Counts how many times a symbol is repeated (0 if not repeated, 1 if its doubled, etc...)
     * without moving the index forward
     */
    var peekAhead = function (symbol) {
      var nr = 0;
      var j = iFormat;
      while (j + 1 < format.length && format.charAt(j + 1) === symbol) {
        nr++;
        j++;
      }
      return nr;
    };
    /**
     * Check whether a format character is doubled
     * Check how many times a format character is repeated. Also move the index forward.
     */
    var lookAhead = function (match) {
      var matches = peekAhead(match);
      iFormat += matches;
      return matches;
    };
    /**
     * Extract a number from the string value
     * @param {string} match The current symbol in the format string
     * @returns {number} The extracted number
     */
    var getNumber = function (match) {
      var count = lookAhead(match);
      // const size = count === 3 ? 4 : 2; // size is either 4 digit (year) or a maximum 2 digit number
      var size = count >= 2 ? 4 : 2;
      var digits = new RegExp('^\\d{1,' + size + '}');
      var num = value.substr(iValue).match(digits);
      if (!num) {
        return 0;
      }
      iValue += num[0].length;
      return parseInt(num[0], 10);
    };
    /**
     * Extracts a name from the string value and converts to an index
     * @param {string} match The symbol we are looking at in the format string
     * @param {Array<string>} shortNames Short names array
     * @param {Array<string>} longNames Long names array
     * @returns {number} Returns the index + 1 of the name in the names array if found, 0 otherwise
     */
    var getName = function (match, shortNames, longNames) {
      var count = lookAhead(match);
      var names = count === 3 ? longNames : shortNames;
      for (var i = 0; i < names.length; i++) {
        if (value.substr(iValue, names[i].length).toLowerCase() === names[i].toLowerCase()) {
          iValue += names[i].length;
          return i + 1;
        }
      }
      return 0;
    };
    var checkLiteral = function () {
      iValue++;
    };
    for (iFormat = 0; iFormat < format.length; iFormat++) {
      if (literal) {
        if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
          literal = false;
        } else {
          checkLiteral();
        }
      } else {
        switch (format.charAt(iFormat)) {
          case 'Y':
            year = getNumber('Y');
            break;
          case 'M': {
            var p = peekAhead('M');
            if (p < 2) {
              month = getNumber('M');
            } else {
              month = getName('M', s.monthNamesShort, s.monthNames);
            }
            break;
          }
          case 'D': {
            var p = peekAhead('D');
            if (p < 2) {
              day = getNumber('D');
            } else {
              getName('D', s.dayNamesShort, s.dayNames);
            }
            break;
          }
          case 'H':
            hours = getNumber('H');
            break;
          case 'h':
            hours = getNumber('h');
            break;
          case 'm':
            minutes = getNumber('m');
            break;
          case 's':
            seconds = getNumber('s');
            break;
          case 'a':
            ampm = getName('a', [s.amText, s.pmText], [s.amText, s.pmText]) - 1;
            break;
          case 'A':
            ampm = getName('A', [s.amText, s.pmText], [s.amText, s.pmText]) - 1;
            break;
          case "'":
            if (lookAhead("'")) {
              checkLiteral();
            } else {
              literal = true;
            }
            break;
          default:
            checkLiteral();
        }
      }
    }
    if (year < 100) {
      var cutoffYear = void 0;
      // cutoffyear setting supports string and number. When string, it is considered relative to the current year.
      // otherwise it is the year number in the current century
      if (!isString(shortYearCutoff)) {
        cutoffYear = +shortYearCutoff;
      } else {
        cutoffYear = (new Date().getFullYear() % 100) + parseInt(shortYearCutoff, 10);
      }
      var addedCentury = void 0;
      if (year <= cutoffYear) {
        addedCentury = 0;
      } else {
        addedCentury = -100;
      }
      year += new Date().getFullYear() - (new Date().getFullYear() % 100) + addedCentury;
    }
    hours = ampm === -1 ? hours : ampm && hours < 12 ? hours + 12 : !ampm && hours === 12 ? 0 : hours;
    var date = s.getDate(year, month - 1, day, hours, minutes, seconds);
    if (s.getYear(date) !== year || s.getMonth(date) + 1 !== month || s.getDay(date) !== day) {
      return def; // Invalid date
    }
    return date;
  }
  /** Value Equality function for Date and Array of Date types
   * Checks if two dates or two array of dates are the same.
   * NOTE: empty Arrays are treated the same way as null values because,
   * when parsing a null value, the returned value representation is an empty object (datepicker),
   * which when turned back, won't be null, but rather an empty array
   */
  function dateValueEquals(v1, v2, s) {
    if (v1 === v2) {
      // shortcut for reference equaliy
      return true;
    }
    // Empty Arrays are treated the same way as null values
    if ((isArray(v1) && !v1.length && v2 === null) || (isArray(v2) && !v2.length && v1 === null)) {
      return true;
    }
    if (v1 === null || v2 === null || v1 === UNDEFINED || v2 === UNDEFINED) {
      return false;
    }
    // compare strings
    if (isString(v1) && isString(v2)) {
      // shortcut for strings
      return v1 === v2;
    }
    var dateFormat = s && s.dateFormat;
    // if one of them is an array compare each items
    if (isArray(v1) || isArray(v2)) {
      if (v1.length !== v2.length) {
        // if one of them is not an array, or the lengths are not the same
        return false;
      }
      for (var i = 0; i < v1.length; i++) {
        var eq = true;
        var a = v1[i];
        var b = v2[i];
        if (isString(a) && isString(b)) {
          eq = a === b;
        } else {
          eq = +makeDate(a, s, dateFormat) === +makeDate(b, s, dateFormat);
        }
        if (!eq) {
          return false;
        }
      }
      return true;
    }
    return +makeDate(v1, s, dateFormat) === +makeDate(v2, s, dateFormat);
  }
  /**
   * Clones a date object (native or custom mbsc date).
   * @param date The date to clone.
   */
  function cloneDate(date) {
    return isMBSCDate(date) ? date.clone() : new Date(date);
  }
  /**
   * Adds the sepcified number of days to a date. Returns a new date object.
   * @param date The date.
   * @param days Days to add.
   */
  function addDays(date, days) {
    var copy = cloneDate(date);
    copy.setDate(copy.getDate() + days);
    return copy;
  }
  /**
   * Check if a day is inside the visible week days.
   * @param day Weekday to check.
   * @param startDay Start day of the week.
   * @param endDay End day of the week.
   */
  function isInWeek(day, startDay, endDay) {
    return startDay > endDay ? day <= endDay || day >= startDay : day >= startDay && day <= endDay;
  }
  /**
   * Rounds a date to the specified minute step.
   * @param date The date to round.
   * @param step Step specified as minutes.
   */
  function roundTime(date, step) {
    var ms = ONE_MIN * step;
    var copy = cloneDate(date).setHours(0, 0, 0, 0);
    var rounded = copy + Math.round((+date - +copy) / ms) * ms;
    return isMBSCDate(date) ? date.createDate(rounded) : new Date(rounded);
  }
  /** Constrains a date to min and max */
  function constrainDate(date, min, max) {
    return min && date < min ? new Date(min) : max && date > max ? new Date(max) : date;
  }
  // Symbol dummy for IE11
  if (isBrowser && typeof Symbol === 'undefined') {
    window.Symbol = {
      toPrimitive: 'toPrimitive'
    };
  }
  util.datetime = {
    formatDate: formatDatePublic,
    parseDate: parseDate
  };

  var win$1 = isBrowser ? window : UNDEFINED;
  var hasPromise = isBrowser && !!win$1.Promise;
  function returnValue(callback, value) {
    if (callback) {
      callback(value);
    }
    if (hasPromise) {
      return new Promise(function (resolve) {
        resolve(value);
      });
    }
  }
  function loadScript(url, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = callback;
    script.src = url;
    document.head.appendChild(script);
  }

  var DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
  var SCOPES =
    'https://www.googleapis.com/auth/calendar.events.public.readonly https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events.owned';
  var SESSION_KEY = 'mbsc_google_session';
  var s;
  var gapi;
  var googleAuth;
  var tokenClient;
  var tokenExpiry;
  var isPublic;
  var isTokenRefresh;
  var refreshToken;
  var authResolve;
  var authReject;
  function initCallback() {
    // Load access token from local storage
    var tokenStr = localStorage.getItem(SESSION_KEY);
    if (!isPublic && tokenStr) {
      try {
        var session = JSON.parse(tokenStr);
        tokenExpiry = session.expiry;
        if (session.refresh) {
          refreshToken = session.refresh;
        }
        if (tokenExpiry > +new Date()) {
          gapi.client.setToken(session.token);
        } else if (s.auth === 'server' && refreshToken) {
          // In case of server auth, if the token is expired, we can ask for a new one right away
          sendRequest(refreshToken, true);
        }
      } catch (e) {
        // JSON could not be parsed
      }
    }
    if (googleCalendarSync.isSignedIn() && s.onSignedIn) {
      s.onSignedIn();
    }
    if (s.onInit) {
      s.onInit();
    }
  }
  function sendRequest(codeOrToken, isRefresh) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', isRefresh ? s.refreshUrl : s.authUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('X-Requested-With', 'XmlHttpRequest');
    xhr.onload = function () {
      var token = JSON.parse(xhr.responseText);
      gapi.client.setToken(token);
      saveToken(token);
    };
    xhr.send((isRefresh ? 'refresh_token=' : 'code=') + codeOrToken);
  }
  function tokenCallback(response) {
    if (response) {
      var err = response.error;
      if (err) {
        if (authReject) {
          authReject(err);
          authReject = null;
        }
      } else {
        if (s.auth === 'server') {
          sendRequest(response.code, false);
        } else {
          saveToken(response);
        }
      }
    }
  }
  function saveToken(token) {
    if (token.refresh_token) {
      refreshToken = token.refresh_token;
    }
    // Calculate the end timestamp of token validity, comes expressed in seconds
    tokenExpiry = +new Date() + token.expires_in * 1000;
    // Save token to local storage
    localStorage.setItem(SESSION_KEY, JSON.stringify({ token: token, expiry: tokenExpiry, refresh: refreshToken }));
    if (authResolve) {
      authResolve();
      authResolve = null;
    }
    if (!isTokenRefresh && s && s.onSignedIn) {
      s.onSignedIn();
    }
    isTokenRefresh = false;
  }
  function initToken() {
    var config = {
      callback: tokenCallback,
      client_id: s.clientId,
      scope: s.scopes || SCOPES,
      ux_mode: 'popup'
    };
    tokenClient = s.auth === 'server' ? googleAuth.initCodeClient(config) : googleAuth.initTokenClient(config);
  }
  function checkToken() {
    return new Promise(function (resolve, reject) {
      if (tokenExpiry && tokenExpiry < +new Date()) {
        // Access token has expired, request a new one
        authResolve = resolve;
        authReject = reject;
        isTokenRefresh = true;
        if (s.auth === 'server') {
          // Get a new access token from the server, using the refresh token
          sendRequest(refreshToken, true);
        } else {
          // Get a new access token client side
          tokenClient.requestAccessToken({ prompt: '' });
        }
      } else {
        // Proceed with the task
        resolve();
      }
    });
  }
  function getEventProps(event, googleCalendarId) {
    var timezone = s.timezone;
    var timezonePlugin = s.timezonePlugin;
    var allDayStart = event.start.date;
    var allDayEnd = event.end.date;
    var allDay = !!allDayStart;
    var eventStart = allDayStart || new Date(event.start.dateTime);
    var eventEnd = allDayEnd || new Date(event.end.dateTime);
    if (timezone && timezonePlugin && !allDay) {
      var tzOpt = {
        displayTimezone: timezone,
        timezonePlugin: timezonePlugin
      };
      eventStart = makeDate(event.start.dateTime, tzOpt).toISOString();
      eventEnd = makeDate(event.end.dateTime, tzOpt).toISOString();
    }
    return {
      allDay: allDay,
      end: eventEnd,
      googleCalendarId: googleCalendarId,
      id: event.id,
      start: eventStart,
      title: event.summary
    };
  }
  var googleCalendarSync = {
    init: function (config) {
      if (isBrowser) {
        s = config;
        isPublic = !s.clientId;
        if (s.gapi) {
          gapi = s.gapi;
          initCallback();
        } else {
          loadScript('https://apis.google.com/js/api.js', function () {
            gapi = win$1.gapi;
            gapi.load('client', function () {
              gapi.client
                .init({
                  apiKey: s.apiKey,
                  discoveryDocs: DISCOVERY_DOCS
                })
                .then(function () {
                  initCallback();
                });
            });
          });
        }
        if (!isPublic) {
          if (s.gis) {
            googleAuth = s.gis.accounts.oauth2;
            initToken();
          } else {
            loadScript('https://accounts.google.com/gsi/client', function () {
              googleAuth = win$1.google.accounts.oauth2;
              initToken();
            });
          }
        }
      }
    },
    signIn: function () {
      return new Promise(function (resolve, reject) {
        if (gapi && gapi.client) {
          var token = gapi.client.getToken();
          if (s.auth === 'server') {
            if (token === null) {
              authResolve = resolve;
              authReject = reject;
              tokenClient.requestCode();
            } else {
              resolve();
            }
          } else {
            authResolve = resolve;
            authReject = reject;
            if (token === null) {
              // Prompt the user to select a Google Account
              // and ask for consent to share their data when establishing a new session.
              tokenClient.requestAccessToken({ prompt: 'consent' });
            } else {
              // Skip display of account chooser and consent dialog for an existing session.
              tokenClient.requestAccessToken({ prompt: '' });
            }
          }
        } else {
          // Cannot start logging in, gapi not loaded
          reject();
        }
      });
    },
    signOut: function () {
      var signOutPromise = Promise.resolve();
      if (gapi && gapi.client) {
        gapi.client.setToken('');
        localStorage.removeItem(SESSION_KEY);
      }
      if (s && s.onSignedOut) {
        s.onSignedOut();
      }
      return signOutPromise;
    },
    isSignedIn: function () {
      return gapi && gapi.client && gapi.client.getToken() !== null;
    },
    getCalendars: function (callback) {
      return checkToken()
        .then(function () {
          return gapi.client.calendar.calendarList.list();
        })
        .then(function (resp) {
          return returnValue(callback, resp.result.items);
        });
    },
    getEvents: function (calendarIds, start, end, callback) {
      if (!isArray(calendarIds)) {
        calendarIds = [calendarIds];
      }
      if (!calendarIds.length || !gapi || !gapi.client || !gapi.client.calendar) {
        return returnValue(callback, []);
      }
      return checkToken()
        .then(function () {
          var batch = gapi.client.newBatch();
          for (var _i = 0, calendarIds_1 = calendarIds; _i < calendarIds_1.length; _i++) {
            var calId = calendarIds_1[_i];
            batch.add(
              gapi.client.calendar.events.list({
                calendarId: calId,
                singleEvents: true,
                timeMax: end.toISOString(),
                timeMin: start.toISOString()
              })
            );
          }
          batch.add(gapi.client.calendar.colors.get());
          if (!isPublic) {
            batch.add(gapi.client.calendar.calendarList.list());
          }
          return batch;
        })
        .then(function (resp) {
          var results = resp.result;
          var result = Object.keys(results).map(function (key) {
            return results[key].result;
          });
          var mobiscrollEvents = [];
          var colors = [];
          var calendars = [];
          result.sort(function (a, b) {
            return a.kind > b.kind ? 1 : -1;
          });
          for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
            var res = result_1[_i];
            if (res.kind === 'calendar#colors') {
              colors = res.event;
            } else if (res.kind === 'calendar#calendarList') {
              calendars = res.items;
            } else if (res.kind === 'calendar#events') {
              var _loop_1 = function (event_1) {
                var calId = event_1.organizer.email;
                var calendar = calendars.find(function (c) {
                  return c.id === calId;
                });
                var extProp = event_1.extendedProperties ? event_1.extendedProperties.shared : UNDEFINED;
                mobiscrollEvents.push(
                  __assign({}, extProp, getEventProps(event_1, calId), {
                    color: event_1.colorId ? colors[event_1.colorId].background : isPublic || !calendar ? '' : calendar.backgroundColor,
                    editable: isPublic || !calendar ? false : calendar.accessRole === 'writer' || calendar.accessRole === 'owner',
                    googleEvent: event_1
                  })
                );
              };
              for (var _a = 0, _b = res.items; _a < _b.length; _a++) {
                var event_1 = _b[_a];
                _loop_1(event_1);
              }
            }
          }
          return returnValue(callback, mobiscrollEvents);
        });
    },
    addEvent: function (calendarId, event, callback) {
      return checkToken()
        .then(function () {
          event.end;
          event.id;
          event.start;
          event.title;
          var googleEvent = event.googleEvent,
            extPorps = __rest(event, ['end', 'id', 'start', 'title', 'googleEvent']);
          var newEvent = __assign({}, googleEvent, {
            end: {
              date: event.allDay ? getDateStr(makeDate(event.end)) : UNDEFINED,
              dateTime: event.allDay ? UNDEFINED : event.end
            },
            extendedProperties: {
              shared: extPorps
            },
            start: {
              date: event.allDay ? getDateStr(makeDate(event.start)) : UNDEFINED,
              dateTime: event.allDay ? UNDEFINED : event.start
            },
            summary: event.title
          });
          return gapi.client.calendar.events.insert({
            calendarId: calendarId,
            resource: newEvent
          });
        })
        .then(function (resp) {
          return returnValue(callback, getEventProps(resp.result, calendarId));
        });
    },
    updateEvent: function (calendarId, event, callback) {
      return checkToken()
        .then(function () {
          event.end;
          event.id;
          event.start;
          event.title;
          var googleEvent = event.googleEvent,
            extPorps = __rest(event, ['end', 'id', 'start', 'title', 'googleEvent']);
          var eventToUpdate = __assign({}, googleEvent, {
            allDay: event.allDay,
            end: {
              date: event.allDay ? getDateStr(makeDate(event.end)) : UNDEFINED,
              dateTime: event.allDay ? UNDEFINED : event.end
            },
            extendedProperties: {
              shared: extPorps
            },
            start: {
              date: event.allDay ? getDateStr(makeDate(event.start)) : UNDEFINED,
              dateTime: event.allDay ? UNDEFINED : event.start
            },
            summary: event.title
          });
          return gapi.client.calendar.events.update({
            calendarId: calendarId,
            eventId: event.id,
            resource: eventToUpdate
          });
        })
        .then(function (resp) {
          return returnValue(callback, getEventProps(resp.result, calendarId));
        });
    },
    deleteEvent: function (calendarId, event, callback) {
      return checkToken()
        .then(function () {
          return gapi.client.calendar.events.delete({
            calendarId: calendarId,
            eventId: event.id
          });
        })
        .then(function () {
          return returnValue(callback, event);
        });
    }
  };

  var calendarConfig;
  var msal;
  var msalClient;
  var graphClient;
  var MS_GRAPH_CLIENT_URL = 'https://cdn.jsdelivr.net/npm/@microsoft/microsoft-graph-client@3.0.0/lib/graph-js-sdk.js';
  var MSAL_URL = 'https://alcdn.msauth.net/browser/2.16.1/js/msal-browser.min.js';
  var MSAL_BROWSER_AUTH_URL =
    'https://cdn.jsdelivr.net/npm/@microsoft/microsoft-graph-client@3.0.0/lib/graph-client-msalBrowserAuthProvider.js';
  var msalRequest = {
    scopes: ['user.read', 'mailboxsettings.read', 'calendars.readwrite']
  };
  var presetColors = {
    preset0: '#e74856',
    preset1: '#ff8c22',
    preset10: '#9faeb2',
    preset11: '#014b60',
    preset12: '#b1adab',
    preset13: '#5d5a58',
    preset14: '#000000',
    preset15: '#750b1c',
    preset16: '#ca5015',
    preset17: '#ab6214',
    preset18: '#c19c20',
    preset19: '#004b1c',
    preset2: '#ffab45',
    preset20: '#014b50',
    preset21: '#0b6a0e',
    preset22: '#001f50',
    preset23: '#32145a',
    preset24: '#5c005c',
    preset3: '#fff134',
    preset4: '#47d041',
    preset5: '#2fc5cc',
    preset6: '#73aa24',
    preset7: '#00bcf2',
    preset8: '#8764b8',
    preset9: '#f495be'
  };
  function getClient() {
    return new msal.PublicClientApplication({
      auth: {
        clientId: calendarConfig.clientId,
        redirectUri: calendarConfig.redirectUri || 'http://localhost:3000'
      }
    });
  }
  function initializeGraphClient(account, scopes) {
    var authProvider = new win$1.MSGraphAuthCodeMSALBrowserAuthProvider.AuthCodeMSALBrowserAuthenticationProvider(msalClient, {
      account: account,
      interactionType: msal.InteractionType.PopUp,
      scopes: scopes
    });
    graphClient = win$1.MicrosoftGraph.Client.initWithMiddleware({ authProvider: authProvider });
  }
  function getProperties(event, outlookCalendarId) {
    var timezone = calendarConfig.timezone;
    var timezonePlugin = calendarConfig.timezonePlugin;
    var allDay = event.isAllDay;
    var eventStart = allDay ? event.start.dateTime.split('.')[0] : new Date(event.start.dateTime + 'Z');
    var eventEnd = allDay ? event.end.dateTime.split('.')[0] : new Date(event.end.dateTime + 'Z');
    if (timezone && timezonePlugin && !allDay) {
      var tzOpt = {
        displayTimezone: timezone,
        timezonePlugin: timezonePlugin
      };
      eventStart = makeDate(event.start.dateTime, tzOpt).toISOString();
      eventEnd = makeDate(event.end.dateTime, tzOpt).toISOString();
    }
    return {
      allDay: allDay,
      end: eventEnd,
      id: event.id,
      outlookCalendarId: outlookCalendarId,
      start: eventStart,
      title: event.subject
    };
  }
  var outlookCalendarSync = {
    init: function (config) {
      if (isBrowser) {
        calendarConfig = config;
        if (config.msal && config.msalClient) {
          msal = config.msal;
          msalClient = config.msalClient || getClient();
        } else {
          loadScript(MS_GRAPH_CLIENT_URL, function () {
            loadScript(MSAL_URL, function () {
              msal = win$1.msal;
              loadScript(MSAL_BROWSER_AUTH_URL, function () {
                msalClient = getClient();
                if (outlookCalendarSync.isSignedIn()) {
                  initializeGraphClient(msalClient.getActiveAccount(), msalRequest.scopes);
                  if (config.onSignedIn) {
                    config.onSignedIn();
                  }
                }
                if (config.onInit) {
                  config.onInit();
                }
              });
            });
          });
        }
      }
    },
    signIn: function () {
      return msalClient.loginPopup(msalRequest).then(function (authResult) {
        msalClient.setActiveAccount(authResult.account);
        initializeGraphClient(authResult.account, msalRequest.scopes);
        if (calendarConfig.onSignedIn) {
          calendarConfig.onSignedIn();
        }
      });
    },
    signOut: function () {
      return msalClient.logoutPopup(msalRequest).then(function (authResult) {
        if (calendarConfig.onSignedOut) {
          calendarConfig.onSignedOut();
        }
      });
    },
    isSignedIn: function () {
      return msalClient && msalClient.getActiveAccount() ? true : false;
    },
    getCalendars: function (callback) {
      return graphClient
        .api('/me/calendars')
        .get()
        .then(function (calendars) {
          return returnValue(callback, calendars.value);
        });
    },
    getEvents: function (calendarIds, start, end, callback) {
      if (!isArray(calendarIds)) {
        calendarIds = [calendarIds];
      }
      if (!calendarIds.length) {
        return returnValue(callback, []);
      }
      var MicrosoftGraph = win$1.MicrosoftGraph;
      var batches = [];
      var calendars = [];
      var mobiscrollEvents = [];
      var masterColors = [];
      batches.push({
        id: 'colors',
        request: new Request('/me/outlook/masterCategories', {
          method: 'GET'
        })
      });
      calendarIds.forEach(function (calendarId, i) {
        batches.push(
          {
            dependsOn: i === 0 ? ['colors'] : ['events_' + calendarIds[i - 1]],
            id: 'calendars_' + i,
            request: new Request('/me/calendars/' + calendarId, {
              method: 'GET'
            })
          },
          {
            dependsOn: ['calendars_' + i],
            id: 'events_' + calendarIds[i],
            request: new Request(
              '/me/calendars/' +
                calendarId +
                '/calendarView/?startDateTime=' +
                start.toISOString() +
                '&endDateTime=' +
                end.toISOString() +
                '&$top=' +
                (calendarConfig.pageSize || 1000),
              {
                method: 'GET'
              }
            )
          }
        );
      });
      // create the batch request content
      return new MicrosoftGraph.BatchRequestContent(batches)
        .getContent()
        .then(function (requestContent) {
          return graphClient.api('/$batch').post(requestContent);
        })
        .then(function (batchResponse) {
          var _loop_1 = function (b) {
            var batchId = b.id;
            var resp = b.body;
            if (batchId === 'colors') {
              masterColors = resp.value;
            } else if (batchId.includes('calendars')) {
              calendars.push({
                canEdit: resp.canEdit,
                hexColor: resp.hexColor,
                id: resp.id,
                name: resp.name
              });
            } else if (batchId.includes('events')) {
              var calendarId_1 = batchId.replace('events_', '');
              var calendar = calendars.find(function (c) {
                return c.id === calendarId_1;
              });
              var _loop_2 = function (event_1) {
                var category = event_1.categories
                  ? masterColors.find(function (c) {
                      return c.displayName === event_1.categories[0];
                    })
                  : UNDEFINED;
                mobiscrollEvents.push(
                  __assign({}, getProperties(event_1, calendarId_1), {
                    color: category ? presetColors[category.color] : calendar.hexColor,
                    editable: calendar.canEdit,
                    outlookEvent: event_1
                  })
                );
              };
              for (var _i = 0, _a = resp.value; _i < _a.length; _i++) {
                var event_1 = _a[_i];
                _loop_2(event_1);
              }
            }
          };
          for (var _i = 0, _a = batchResponse.responses; _i < _a.length; _i++) {
            var b = _a[_i];
            _loop_1(b);
          }
          return returnValue(callback, mobiscrollEvents);
        });
    },
    addEvent: function (calendarId, event, callback) {
      var isAllDay = event.allDay;
      var start = isAllDay ? getDateStr(makeDate(event.start)) : event.start;
      var end = isAllDay ? getDateStr(makeDate(event.end)) : event.end;
      var newEvent = __assign({}, event.outlookEvent, {
        end: {
          dateTime: end,
          timeZone: calendarConfig.timezone || 'UTC'
        },
        isAllDay: isAllDay,
        start: {
          dateTime: start,
          timeZone: calendarConfig.timezone || 'UTC'
        },
        subject: event.title
      });
      return graphClient
        .api('/me/calendars/' + calendarId + '/events')
        .post(newEvent)
        .then(function (e) {
          return returnValue(callback, getProperties(e, calendarId));
        });
    },
    updateEvent: function (calendarId, event, callback) {
      var isAllDay = event.allDay;
      var start = isAllDay && event.start ? getDateStr(makeDate(event.start)) : event.start;
      var end = isAllDay && event.end ? getDateStr(makeDate(event.end)) : event.end;
      var eventToUpdate = __assign({}, event.outlookEvent, {
        end: end
          ? {
              dateTime: end,
              timezone: calendarConfig.timezone || 'UTC'
            }
          : UNDEFINED,
        isAllDay: event.allDay,
        start: start
          ? {
              dateTime: start,
              timezone: calendarConfig.timezone || 'UTC'
            }
          : UNDEFINED,
        subject: event.title
      });
      return graphClient
        .api('/me/calendars/' + calendarId + '/events/' + event.id)
        .update(eventToUpdate)
        .then(function (e) {
          return returnValue(callback, getProperties(e, calendarId));
        });
    },
    deleteEvent: function (calendarId, event, callback) {
      return graphClient
        .api('/me/calendars/' + calendarId + '/events/' + event.id)
        .delete()
        .then(function () {
          return returnValue(callback, event);
        });
    }
  };

  var Options = react.createContext({});
  // TODO: types
  var OptionsProvider = /*#__PURE__*/ (function (_super) {
    __extends(OptionsProvider, _super);
    function OptionsProvider() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    OptionsProvider.prototype.render = function () {
      return react.createElement(Options.Provider, { value: this.props.options }, this.props.children);
    };
    return OptionsProvider;
  })(react.Component);

  /** @hidden */
  var Base = /*#__PURE__*/ (function (_super) {
    __extends(Base, _super);
    function Base() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      // tslint:disable variable-name
      _this._setEl = function (el) {
        _this._el = el ? el._el || el : null;
      };
      return _this;
    }
    Object.defineProperty(Base.prototype, 'value', {
      get: function () {
        return this.__value;
      },
      set: function (v) {
        this.__value = v;
      },
      enumerable: true,
      configurable: true
    });
    // tslint:enable variable-name
    Base.prototype.componentDidMount = function () {
      this.__init(); // For base class
      this._init();
      this._mounted();
      // this._hook('onMarkupReady', { target: this._el });
      this._updated();
    };
    Base.prototype.componentDidUpdate = function () {
      this._updated();
    };
    Base.prototype.componentWillUnmount = function () {
      this._destroy();
      this.__destroy(); // For base class
    };
    Base.prototype.render = function () {
      this._opt = this.context;
      this._willUpdate();
      return this._template(this.s, this.state);
    };
    // tslint:enable variable-name
    Base.prototype._safeHtml = function (html) {
      return { __html: html };
    };
    Base.prototype._init = function () {};
    Base.prototype.__init = function () {};
    Base.prototype._emit = function (name, args) {};
    Base.prototype._mounted = function () {};
    Base.prototype._updated = function () {};
    Base.prototype._destroy = function () {};
    Base.prototype.__destroy = function () {};
    Base.prototype._willUpdate = function () {};
    Base.prototype._template = function (s, state) {
      return;
    };
    /** @hidden */
    Base.contextType = Options;
    return Base;
  })(react.PureComponent);

  var guid = 0;
  var BREAKPOINTS = {
    large: 992,
    medium: 768,
    small: 576,
    xlarge: 1200,
    xsmall: 0
  };
  var isDark;
  if (isDarkQuery) {
    isDark = isDarkQuery.matches;
    // addListener is deprecated, however addEventListener does not have the necessary browser support
    // tslint:disable-next-line:deprecation
    isDarkQuery.addListener(function (ev) {
      isDark = ev.matches;
      globalChanges.next();
    });
  }
  /** @hidden */
  var BaseComponent = /*#__PURE__*/ (function (_super) {
    __extends(BaseComponent, _super);
    function BaseComponent() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      /** @hidden */
      _this.s = {};
      /** @hidden */
      _this.state = {};
      /**
       * Used to identify if it's a mobiscroll component
       * @hidden
       */
      _this._mbsc = true;
      /** @hidden */
      _this._v = {
        version: '5.19.2'
      };
      _this._uid = ++guid;
      return _this;
    }
    Object.defineProperty(BaseComponent.prototype, 'nativeElement', {
      get: function () {
        return this._el;
      },
      enumerable: true,
      configurable: true
    });
    /* TRIALFUNC */
    // tslint:enable variable-name
    BaseComponent.prototype.destroy = function () {};
    BaseComponent.prototype._hook = function (name, args) {
      var s = this.s;
      args.inst = this;
      args.type = name;
      this._emit(name, args);
      if (s[name]) {
        return s[name](args, this);
      }
    };
    BaseComponent.prototype.__init = function () {
      var _this = this;
      var self = this.constructor;
      // Subscribe only for top level components. Subcomponents get their settings from the top.
      // Checking the top level by the existence of static defaults property
      if (self.defaults) {
        this._optChange = globalChanges.subscribe(function () {
          _this.forceUpdate();
        });
        // this.s.modules is not ready yet bc ngOnInit is called before ngDoCheck (when the first _merge is)
        var modules = this.props.modules;
        if (modules) {
          for (var _i = 0, modules_1 = modules; _i < modules_1.length; _i++) {
            var module = modules_1[_i];
            if (module.init) {
              module.init(this);
            }
          }
        }
      }
      this._hook('onInit', {});
    };
    BaseComponent.prototype.__destroy = function () {
      if (this._optChange !== UNDEFINED) {
        globalChanges.unsubscribe(this._optChange);
      }
      this._hook('onDestroy', {});
    };
    BaseComponent.prototype._render = function (s, state) {
      return;
    };
    BaseComponent.prototype._willUpdate = function () {
      this._merge();
      this._render(this.s, this.state);
    };
    BaseComponent.prototype._resp = function (s) {
      var resp = s.responsive;
      var ret;
      var br = -1;
      var width = this.state.width;
      // If we don't have width yet in the state, let's default to the window width,
      // most of the time it will be ok to get a good initial value, and will prevent sudden change, e.g. when showing the popup.
      // Default to 375 (a standard mobile view), if there's no window object (server side rendering)
      if (width === UNDEFINED) {
        width = win ? win.innerWidth : 375;
      }
      if (resp && width) {
        for (var key in resp) {
          if (resp.hasOwnProperty(key)) {
            var value = resp[key];
            var breakpoint = value.breakpoint || BREAKPOINTS[key];
            if (width >= breakpoint && breakpoint > br) {
              ret = value;
              br = breakpoint;
            }
          }
        }
      }
      return ret;
    };
    BaseComponent.prototype._merge = function () {
      var self = this.constructor;
      var defaults = self.defaults;
      var context = this._opt || {};
      var props = {};
      var baseTheme;
      var s;
      var themeDef;
      this._prevS = this.s || {};
      // TODO: don't merge if setState call
      if (defaults) {
        // Filter undefined values
        for (var prop in this.props) {
          if (this.props[prop] !== UNDEFINED) {
            props[prop] = this.props[prop];
          }
        }
        // if (this._newProps) {
        //   for (const prop in this._newProps) {
        //     if (this._newProps[prop] !== UNDEFINED) {
        //       props[prop] = this._newProps[prop];
        //     }
        //   }
        // }
        // Load locale options
        var locale = props.locale || context.locale || options.locale || {};
        var calendarSystem = props.calendarSystem || locale.calendarSystem || context.calendarSystem || options.calendarSystem;
        // Load theme options
        var themeName = props.theme || context.theme || options.theme;
        var themeVariant = props.themeVariant || context.themeVariant || options.themeVariant;
        if (themeName === 'auto' || !themeName) {
          themeName = autoDetect.theme;
        }
        // Set dark theme if:
        // - themeVariant is explicitly set to dark OR
        // - themeVariant is auto or not set, and system theme is dark
        // Also check if the theme exists in the themes object
        if ((themeVariant === 'dark' || (isDark && (themeVariant === 'auto' || !themeVariant))) && themes[themeName + '-dark']) {
          themeName += '-dark';
        }
        // Write back the auto-detected theme
        props.theme = themeName;
        themeDef = themes[themeName];
        var theme = themeDef && themes[themeName][self._name];
        // Merge everything together
        s = __assign({}, defaults, theme, locale, options, context, calendarSystem, props);
        // Merge responsive options
        var resp = this._resp(s);
        this._respProps = resp;
        if (resp) {
          s = __assign({}, s, resp);
        }
      } else {
        s = __assign({}, this.props);
        themeDef = themes[s.theme];
      }
      baseTheme = themeDef && themeDef.baseTheme;
      s.baseTheme = baseTheme;
      this.s = s;
      this._className = s.cssClass || s.class || s.className || '';
      this._rtl = ' mbsc-' + (s.rtl ? 'rtl' : 'ltr');
      this._theme = ' mbsc-' + s.theme + (baseTheme ? ' mbsc-' + baseTheme : '');
      this._touchUi = s.touchUi === 'auto' || s.touchUi === UNDEFINED ? touchUi : s.touchUi;
      this._hb = os === 'ios' && (s.theme === 'ios' || baseTheme === 'ios') ? ' mbsc-hb' : '';
    };
    // tslint:disable variable-name
    /** @hidden */
    BaseComponent.defaults = UNDEFINED;
    BaseComponent._name = '';
    return BaseComponent;
  })(Base);

  var ANIMATION_START = 'animationstart';
  var BLUR = 'blur';
  var CHANGE = 'change';
  var CLICK = 'click';
  var CONTEXTMENU = 'contextmenu';
  var DOUBLE_CLICK = 'dblclick';
  var FOCUS = 'focus';
  var FOCUS_IN = 'focusin';
  var INPUT = 'input';
  var KEY_DOWN = 'keydown';
  var MOUSE_DOWN = 'mousedown';
  var MOUSE_MOVE = 'mousemove';
  var MOUSE_UP = 'mouseup';
  var MOUSE_OVER = 'mousedown';
  var MOUSE_ENTER = 'mouseenter';
  var MOUSE_LEAVE = 'mouseleave';
  var MOUSE_WHEEL = 'mousewheel';
  var RESIZE = 'resize';
  var SCROLL = 'scroll';
  var TOUCH_START = 'touchstart';
  var TOUCH_MOVE = 'touchmove';
  var TOUCH_END = 'touchend';
  var TOUCH_CANCEL = 'touchcancel';
  var WHEEL = 'wheel';

  // tslint:disable no-non-null-assertion
  var tapped = 0;
  var allowQuick;
  /**
   * Returns the X or Y coordinate from a touch or mouse event.
   * @hidden
   * @param ev
   * @param axis
   * @param page
   * @returns
   */
  function getCoord(ev, axis, page) {
    // const ev = e.originalEvent || e;
    var prop = (page ? 'page' : 'client') + axis;
    // Multi touch support
    if (ev.targetTouches && ev.targetTouches[0]) {
      return ev.targetTouches[0][prop];
    }
    if (ev.changedTouches && ev.changedTouches[0]) {
      return ev.changedTouches[0][prop];
    }
    return ev[prop];
  }
  /** @hidden */
  function preventClick() {
    // Prevent ghost click
    tapped++;
    setTimeout(function () {
      tapped--;
    }, 500);
  }
  /** @hidden */
  function triggerClick(ev, control) {
    // Prevent duplicate triggers on the same element
    // e.g. a form checkbox inside a listview item
    if (control.mbscClick) {
      return;
    }
    var touch = (ev.originalEvent || ev).changedTouches[0];
    var evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(
      'click',
      true,
      true,
      window,
      1,
      touch.screenX,
      touch.screenY,
      touch.clientX,
      touch.clientY,
      false,
      false,
      false,
      false,
      0,
      null
    );
    evt.isMbscTap = true;
    // Prevent ionic to bust our click
    // This works for Ionic 1 - 3, not sure about 4
    evt.isIonicTap = true;
    // This will allow a click fired together with this click
    // We need this, because clicking on a label will trigger a click
    // on the associated input as well, which should not be busted
    allowQuick = true;
    control.mbscChange = true;
    control.mbscClick = true;
    control.dispatchEvent(evt);
    allowQuick = false;
    // Prevent ghost click
    preventClick();
    setTimeout(function () {
      delete control.mbscClick;
    });
  }
  /**
   * Prevent standard behaviour on click
   * @hidden
   * @param ev
   */
  function bustClick(ev) {
    // Textarea needs the mousedown event
    if (tapped && !allowQuick && !ev.isMbscTap && !(ev.target.nodeName === 'TEXTAREA' && ev.type === MOUSE_DOWN)) {
      ev.stopPropagation();
      ev.preventDefault();
    }
  }
  if (isBrowser) {
    [MOUSE_OVER, MOUSE_ENTER, MOUSE_DOWN, MOUSE_UP, CLICK].forEach(function (ev) {
      doc.addEventListener(ev, bustClick, true);
    });
    if (os === 'android' && majorVersion < 5) {
      doc.addEventListener(
        CHANGE,
        function (ev) {
          var target = ev.target;
          if (tapped && target.type === 'checkbox' && !target.mbscChange) {
            ev.stopPropagation();
            ev.preventDefault();
          }
          delete target.mbscChange;
        },
        true
      );
    }
  }

  // tslint:disable no-non-null-assertion
  var wasTouched;
  /** @hidden */
  function setFocusInvisible(ev) {
    var win = getWindow(ev.target);
    win.__mbscFocusVisible = false;
  }
  /** @hidden */
  function setFocusVisible(ev) {
    var win = getWindow(ev.target);
    win.__mbscFocusVisible = true;
  }
  function onTouchMove(ev) {
    var document = getDocument(ev.target);
    document.__mbscMoveObs.next(ev);
  }
  /** @hidden */
  function addRipple(elm, x, y) {
    var rect = elm.getBoundingClientRect();
    var left = x - rect.left;
    var top = y - rect.top;
    var width = Math.max(left, elm.offsetWidth - left);
    var height = Math.max(top, elm.offsetHeight - top);
    var size = 2 * Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
    var ripple = doc.createElement('span');
    ripple.classList.add('mbsc-ripple');
    var style = ripple.style;
    style.backgroundColor = getComputedStyle(elm).color;
    style.width = size + 'px';
    style.height = size + 'px';
    style.top = y - rect.top - size / 2 + 'px';
    style.left = x - rect.left - size / 2 + 'px';
    elm.appendChild(ripple);
    // raf(() => {
    setTimeout(function () {
      style.opacity = '.2';
      style.transform = 'scale(1)';
      style.transition = 'opacity linear .1s, transform cubic-bezier(0, 0, 0.2, 1) .4s';
    }, 30);
    return ripple;
  }
  /** @hidden */
  function removeRipple(r) {
    if (r) {
      setTimeout(function () {
        r.style.opacity = '0';
        r.style.transition = 'opacity linear .4s';
        setTimeout(function () {
          if (r && r.parentNode) {
            r.parentNode.removeChild(r);
          }
        }, 400);
      }, 200);
    }
  }
  /** @hidden */
  function gestureListener(elm, options) {
    var args = {};
    var win = getWindow(elm);
    var document = getDocument(elm);
    var active;
    var activeable;
    var activeTimer;
    var ripple;
    var hasFocus;
    var hasHover;
    var hasRipple;
    var moved;
    var moveId;
    var startX;
    var startY;
    var endX;
    var endY;
    var deltaX;
    var deltaY;
    var started;
    function skipMouseEvent(ev) {
      if (ev.type === TOUCH_START) {
        wasTouched = true;
      } else if (wasTouched) {
        if (ev.type === MOUSE_DOWN) {
          wasTouched = false;
        }
        return true;
      }
      return false;
    }
    function activate() {
      if (hasRipple) {
        removeRipple(ripple);
        ripple = addRipple(elm, endX, endY);
      }
      options.onPress();
      active = true;
    }
    function deactivate(r, time) {
      activeable = false;
      removeRipple(r);
      clearTimeout(activeTimer);
      activeTimer = setTimeout(function () {
        if (active) {
          options.onRelease();
          active = false;
        }
      }, time);
    }
    function onStart(ev) {
      // Skip if mouse down event was fired after touch
      if (skipMouseEvent(ev)) {
        return;
      }
      // Skip mousedown event if right click
      if (ev.type === MOUSE_DOWN && (ev.button !== 0 || ev.ctrlKey)) {
        return;
      }
      startX = getCoord(ev, 'X');
      startY = getCoord(ev, 'Y');
      endX = startX;
      endY = startY;
      active = false;
      activeable = false;
      moved = false;
      started = true;
      args.moved = moved;
      args.startX = startX;
      args.startY = startY;
      args.endX = endX;
      args.endY = endY;
      args.deltaX = 0;
      args.deltaY = 0;
      args.domEvent = ev;
      args.isTouch = wasTouched;
      removeRipple(ripple);
      if (options.onStart) {
        var ret = options.onStart(args);
        hasRipple = ret && ret.ripple;
      }
      if (options.onPress) {
        activeable = true;
        clearTimeout(activeTimer);
        activeTimer = setTimeout(activate, 50);
      }
      if (ev.type === MOUSE_DOWN) {
        listen(document, MOUSE_MOVE, onMove);
        listen(document, MOUSE_UP, onEnd);
      }
      listen(document, CONTEXTMENU, onContextMenu);
    }
    function onMove(ev) {
      if (!started) {
        return;
      }
      endX = getCoord(ev, 'X');
      endY = getCoord(ev, 'Y');
      deltaX = endX - startX;
      deltaY = endY - startY;
      if (!moved && (Math.abs(deltaX) > 9 || Math.abs(deltaY) > 9)) {
        moved = true;
        deactivate(ripple);
      }
      args.moved = moved;
      args.endX = endX;
      args.endY = endY;
      args.deltaX = deltaX;
      args.deltaY = deltaY;
      args.domEvent = ev;
      args.isTouch = ev.type === TOUCH_MOVE;
      if (options.onMove) {
        options.onMove(args);
      }
    }
    function onEnd(ev) {
      if (!started) {
        return;
      }
      if (activeable && !active) {
        clearTimeout(activeTimer);
        activate();
      }
      args.domEvent = ev;
      args.isTouch = ev.type === TOUCH_END;
      if (options.onEnd) {
        options.onEnd(args);
      }
      deactivate(ripple, 75);
      started = false;
      if (ev.type === TOUCH_END && options.click && hasGhostClick && !moved) {
        triggerClick(ev, ev.target);
      }
      if (ev.type === MOUSE_UP) {
        unlisten(document, MOUSE_MOVE, onMove);
        unlisten(document, MOUSE_UP, onEnd);
      }
      unlisten(document, CONTEXTMENU, onContextMenu);
    }
    function onHoverIn(ev) {
      if (skipMouseEvent(ev)) {
        return;
      }
      hasHover = true;
      options.onHoverIn(ev);
    }
    function onHoverOut(ev) {
      if (hasHover) {
        options.onHoverOut(ev);
      }
      hasHover = false;
    }
    function onKeyDown(ev) {
      options.onKeyDown(ev);
    }
    function onFocus(ev) {
      if (options.keepFocus || win.__mbscFocusVisible) {
        hasFocus = true;
        options.onFocus(ev);
      }
    }
    function onBlur(ev) {
      if (hasFocus) {
        options.onBlur(ev);
      }
      hasFocus = false;
    }
    function onChange(ev) {
      options.onChange(ev);
    }
    function onDoubleClick(ev) {
      args.domEvent = ev;
      if (!wasTouched) {
        options.onDoubleClick(args);
      }
    }
    function onContextMenu(ev) {
      if (wasTouched) {
        ev.preventDefault();
      }
    }
    // Set up listeners
    listen(elm, TOUCH_START, onStart, { passive: true });
    listen(elm, MOUSE_DOWN, onStart);
    // listen(elm, TOUCH_MOVE, onMove);
    listen(elm, TOUCH_END, onEnd);
    listen(elm, TOUCH_CANCEL, onEnd);
    if (document) {
      var moveCount = document.__mbscMoveCount || 0;
      var moveListener = document.__mbscMoveObs || new Observable();
      if (moveCount === 0) {
        listen(document, TOUCH_MOVE, onTouchMove, { passive: false });
      }
      document.__mbscMoveObs = moveListener;
      document.__mbscMoveCount = ++moveCount;
      moveId = moveListener.subscribe(onMove);
    }
    if (options.onChange) {
      listen(elm, CHANGE, onChange);
    }
    if (options.onHoverIn) {
      listen(elm, MOUSE_ENTER, onHoverIn);
    }
    if (options.onHoverOut) {
      listen(elm, MOUSE_LEAVE, onHoverOut);
    }
    if (options.onKeyDown) {
      listen(elm, KEY_DOWN, onKeyDown);
    }
    if (options.onFocus && win) {
      listen(elm, FOCUS, onFocus);
      if (!options.keepFocus) {
        var focusCount = win.__mbscFocusCount || 0;
        if (focusCount === 0) {
          listen(win, MOUSE_DOWN, setFocusInvisible, true);
          listen(win, KEY_DOWN, setFocusVisible, true);
        }
        win.__mbscFocusCount = ++focusCount;
      }
    }
    if (options.onBlur) {
      listen(elm, BLUR, onBlur);
    }
    if (options.onDoubleClick) {
      listen(elm, DOUBLE_CLICK, onDoubleClick);
    }
    return function () {
      clearTimeout(activeTimer);
      if (options.onFocus && win && !options.keepFocus) {
        var focusCount = win.__mbscFocusCount || 0;
        win.__mbscFocusCount = --focusCount;
        if (focusCount <= 0) {
          unlisten(win, MOUSE_DOWN, setFocusInvisible);
          unlisten(win, KEY_DOWN, setFocusVisible);
        }
      }
      if (document) {
        var moveCount = document.__mbscMoveCount || 0;
        document.__mbscMoveCount = --moveCount;
        if (document.__mbscMoveObs) {
          document.__mbscMoveObs.unsubscribe(moveId);
        }
        if (moveCount <= 0) {
          delete document.__mbscMoveCount;
          delete document.__mbscMoveObs;
          unlisten(document, TOUCH_MOVE, onTouchMove, { passive: false });
        }
      }
      unlisten(elm, MOUSE_DOWN, onStart, { passive: true });
      // unlisten(elm, TOUCH_MOVE, onMove);
      unlisten(elm, TOUCH_END, onEnd);
      unlisten(elm, TOUCH_CANCEL, onEnd);
      unlisten(document, MOUSE_MOVE, onMove);
      unlisten(document, MOUSE_UP, onEnd);
      unlisten(document, CONTEXTMENU, onContextMenu);
      unlisten(elm, CHANGE, onChange);
      unlisten(elm, MOUSE_ENTER, onHoverIn);
      unlisten(elm, MOUSE_LEAVE, onHoverOut);
      unlisten(elm, KEY_DOWN, onKeyDown);
      unlisten(elm, TOUCH_START, onStart);
      unlisten(elm, FOCUS, onFocus);
      unlisten(elm, BLUR, onBlur);
      unlisten(elm, DOUBLE_CLICK, onDoubleClick);
    };
  }

  // tslint:disable no-non-null-assertion
  // tslint:disable no-inferrable-types
  // tslint:disable directive-class-suffix
  // tslint:disable directive-selector
  var dragObservable = new Observable();
  function subscribeExternalDrag(handler) {
    return dragObservable.subscribe(handler);
  }
  function unsubscribeExternalDrag(key) {
    dragObservable.unsubscribe(key);
  }
  /** @hidden */
  var DraggableBase = /*#__PURE__*/ (function (_super) {
    __extends(DraggableBase, _super);
    function DraggableBase() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    // tslint:enable variable-name
    DraggableBase.prototype._render = function (s) {
      if (s.dragData !== this._prevS.dragData) {
        this._dragData = isString(s.dragData) ? JSON.parse(s.dragData.toString()) : s.dragData;
      }
    };
    DraggableBase.prototype._updated = function () {
      var _this = this;
      var el = this.s.element || this._el;
      if (this._unlisten === UNDEFINED && el) {
        el.classList.add('mbsc-draggable');
        var clone_1;
        var isDrag_1;
        var touchTimer_1;
        var body_1 = getDocument(el).body;
        var moveClone_1 = function (ev) {
          clone_1.style.left = ev.endX + 'px';
          clone_1.style.top = ev.endY + 'px';
        };
        this._unlisten = gestureListener(el, {
          onEnd: function (ev) {
            if (isDrag_1) {
              var args = __assign({}, ev);
              // Will prevent mousedown event on doc
              args.domEvent.preventDefault();
              args.action = 'externalDrop';
              args.event = _this._dragData;
              args.create = true;
              args.eventName = 'onDragEnd';
              dragObservable.next(args);
              isDrag_1 = false;
              body_1.removeChild(clone_1);
            }
            clearTimeout(touchTimer_1);
          },
          onMove: function (ev) {
            var args = __assign({}, ev);
            args.event = _this._dragData;
            args.clone = clone_1;
            args.create = true;
            args.external = true;
            if (isDrag_1 || !args.isTouch) {
              // Prevents page scroll on touch and text selection with mouse
              args.domEvent.preventDefault();
            }
            if (isDrag_1) {
              moveClone_1(ev);
              args.eventName = 'onDragMove';
              dragObservable.next(args);
            } else if (Math.abs(args.deltaX) > 7 || Math.abs(args.deltaY) > 7) {
              clearTimeout(touchTimer_1);
              if (!args.isTouch) {
                moveClone_1(ev);
                body_1.appendChild(clone_1);
                args.eventName = 'onDragStart';
                dragObservable.next(args);
                isDrag_1 = true;
              }
            }
          },
          onStart: function (ev) {
            var args = __assign({}, ev);
            if (!isDrag_1) {
              clone_1 = el.cloneNode(true);
              clone_1.classList.add('mbsc-drag-clone');
              args.event = _this._dragData;
              args.create = true;
              args.external = true;
              if (args.isTouch) {
                touchTimer_1 = setTimeout(function () {
                  moveClone_1(ev);
                  body_1.appendChild(clone_1);
                  args.clone = clone_1;
                  args.eventName = 'onDragModeOn';
                  dragObservable.next(args);
                  args.eventName = 'onDragStart';
                  dragObservable.next(args);
                  isDrag_1 = true;
                }, 350);
              }
            }
          }
        });
      }
    };
    DraggableBase.prototype._destroy = function () {
      if (this._unlisten) {
        this._unlisten();
      }
    };
    return DraggableBase;
  })(BaseComponent);

  var Draggable = /*#__PURE__*/ (function (_super) {
    __extends(Draggable, _super);
    function Draggable() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    Draggable.prototype._template = function (s) {
      return s.children || ''; // this is needed because otherwise if the Draggable component is empty, React throws an error
    };
    return Draggable;
  })(DraggableBase);

  // tslint:disable no-non-null-assertion
  var labelGuid = 1;
  var MONTH_VIEW = 'month';
  var YEAR_VIEW = 'year';
  var MULTI_YEAR_VIEW = 'multi-year';
  var PAGE_WIDTH = 296;
  var calendarViewDefaults = __assign({}, dateTimeLocale, {
    dateText: 'Date',
    eventText: 'event',
    eventsText: 'events',
    moreEventsText: '{count} more',
    nextPageText: 'Next page',
    prevPageText: 'Previous page',
    showEventTooltip: true,
    showToday: true,
    timeText: 'Time'
  });
  /**
   * @hidden
   * Returns the first date of the given page.
   * The pages are defined by the eventRange and eventRangeSize props.
   */
  function getFirstPageDay(pageIndex, s) {
    var refDate = s.refDate ? makeDate(s.refDate) : REF_DATE;
    var pageType = s.showCalendar ? s.calendarType : s.eventRange;
    var pageSize = (s.showCalendar ? (pageType === 'year' ? 1 : pageType === 'week' ? s.weeks : s.size) : s.eventRangeSize) || 1;
    var getDate = s.getDate;
    var ref = pageType === 'week' ? getFirstDayOfWeek(refDate, s) : refDate;
    var year = s.getYear(ref);
    var month = s.getMonth(ref);
    var day = s.getDay(ref);
    switch (pageType) {
      case 'year':
        return getDate(year + pageIndex * pageSize, 0, 1);
      case 'week':
        return getDate(year, month, day + 7 * pageSize * pageIndex);
      case 'day':
        return getDate(year, month, day + pageSize * pageIndex);
      default:
        return getDate(year, month + pageIndex * pageSize, 1);
    }
  }
  /** @hidden */
  function getPageIndex(d, s) {
    var refDate = s.refDate ? makeDate(s.refDate) : REF_DATE;
    var getYear = s.getYear;
    var getMonth = s.getMonth;
    var pageType = s.showCalendar ? s.calendarType : s.eventRange;
    var pageSize = (s.showCalendar ? (pageType === 'year' ? 1 : pageType === 'week' ? s.weeks : s.size) : s.eventRangeSize) || 1;
    var diff;
    switch (pageType) {
      case 'year':
        diff = getYear(d) - getYear(refDate);
        break;
      case 'week':
        diff = getDayDiff(getFirstDayOfWeek(refDate, s), getFirstDayOfWeek(d, s)) / 7;
        break;
      case 'day':
        diff = getDayDiff(refDate, d);
        break;
      case 'month':
        diff = getMonth(d) - getMonth(refDate) + (getYear(d) - getYear(refDate)) * 12;
        break;
      default:
        return;
    }
    return floor(diff / pageSize);
  }
  /** @hidden */
  function getYearsIndex(d, s) {
    var refDate = s.refDate ? makeDate(s.refDate) : REF_DATE;
    return floor((s.getYear(d) - s.getYear(refDate)) / 12);
  }
  /** @hidden */
  function getYearIndex(d, s) {
    var refDate = s.refDate ? makeDate(s.refDate) : REF_DATE;
    return s.getYear(d) - s.getYear(refDate);
  }
  /** @hidden */
  function compareEvents(a, b) {
    var start1 = makeDate(a.start || a.date);
    var start2 = makeDate(b.start || a.date);
    var text1 = a.title || a.text;
    var text2 = b.title || b.text;
    // For non all-day events we multiply the timestamp by 10 to make sure they appear under the all-day events
    var weight1 = !start1 ? 0 : +start1 * (a.allDay ? 1 : 10);
    var weight2 = !start2 ? 0 : +start2 * (b.allDay ? 1 : 10);
    // In case of same weights, order by event title
    if (weight1 === weight2) {
      return text1 > text2 ? 1 : -1;
    }
    return weight1 - weight2;
  }
  /** @hidden */
  function getPageNr(pages, width) {
    return pages === 'auto' // Exact month number from setting
      ? Math.max(
          1, // Min 1 month
          Math.min(
            3, // Max 3 months
            Math.floor(width ? width / PAGE_WIDTH : 1)
          )
        )
      : pages
      ? +pages
      : 1;
  }
  /** @hidden */
  function getLabels(
    s,
    labelsObj,
    start,
    end,
    maxLabels,
    days,
    allDayOnly,
    firstWeekDay,
    isMultiRow,
    eventOrder,
    noOuterDays,
    showLabelCount,
    moreEventsText,
    moreEventsPluralText
  ) {
    labelsObj = labelsObj || {};
    var dayLabels = {};
    var eventRows = {};
    var day = start;
    var uid = 0;
    var max = maxLabels;
    var rowEnd = end;
    while (day < end) {
      var dateKey = getDateStr(day);
      var weekDay = day.getDay();
      var monthDay = s.getDay(day);
      var lastDayOfMonth = noOuterDays && s.getDate(s.getYear(day), s.getMonth(day) + 1, 0);
      var isRowStart = (isMultiRow && (weekDay === firstWeekDay || (monthDay === 1 && noOuterDays))) || +day === +start;
      var firstDay = getFirstDayOfWeek(day, s);
      var events = sortEvents(labelsObj[dateKey] || [], eventOrder);
      var prevEvent = void 0;
      var prevIndex = void 0;
      var row = 0;
      var displayed = 0;
      var i = 0;
      if (isRowStart) {
        eventRows = {};
        rowEnd = isMultiRow ? addDays(firstDay, days) : end;
      }
      if (allDayOnly) {
        events = events.filter(function (ev) {
          return ev.allDay;
        });
      }
      // maxLabels -1 means to display all labels
      if (maxLabels === -1) {
        max = events.length + 1;
      }
      var eventsNr = events.length;
      var data = [];
      if (showLabelCount) {
        data.push({ id: 'count_' + +day, count: eventsNr, placeholder: eventsNr === 0 });
        row = max;
      }
      while (eventsNr && row < max) {
        prevEvent = null;
        // Check  if there are any events already in this row
        for (var j = 0; j < events.length; j++) {
          if (eventRows[row] === events[j]) {
            prevEvent = events[j];
            prevIndex = j;
          }
        }
        if (row === max - 1 && (displayed < eventsNr - 1 || (i === eventsNr && !prevEvent)) && maxLabels !== -1) {
          var nr = eventsNr - displayed;
          var moreText = moreEventsText || '';
          var text = (nr > 1 ? moreEventsPluralText || moreText : moreText).replace(/{count}/, nr);
          if (nr) {
            data.push({ id: 'more_' + ++uid, more: text, label: text });
          }
          // Remove event from previous days and replace it with more label
          if (prevEvent) {
            eventRows[row] = null;
            for (var _i = 0, _a = prevEvent._days; _i < _a.length; _i++) {
              var d = _a[_i];
              var t = moreText.replace(/{count}/, '1');
              dayLabels[getDateStr(d)].data[row] = { id: 'more_' + ++uid, more: t, label: t };
            }
          }
          displayed++;
          row++;
        } else if (prevEvent) {
          if (prevIndex === i) {
            i++;
          }
          if (isSameDay(day, makeDate(prevEvent.end, prevEvent.allDay ? UNDEFINED : s))) {
            eventRows[row] = null;
          }
          data.push({ id: prevEvent.occurrenceId || prevEvent.id, event: prevEvent });
          row++;
          displayed++;
          prevEvent._days.push(day);
        } else if (i < eventsNr) {
          var event_1 = events[i];
          var allDay = event_1.allDay;
          var startTime = event_1.start && makeDate(event_1.start, allDay ? UNDEFINED : s);
          if (
            !startTime || // all day event
            isSameDay(day, startTime) || // event start day
            isRowStart // event started previously, but continues in this row as well
          ) {
            var eventEnd = event_1.end && makeDate(event_1.end, allDay ? UNDEFINED : s);
            var endTime = getEndDate(s, allDay, startTime, eventEnd, true);
            var multiDay = endTime && !isSameDay(startTime, endTime);
            var labelEnd = lastDayOfMonth && lastDayOfMonth < endTime ? lastDayOfMonth : endTime;
            var startStr = startTime ? ', ' + s.fromText + ': ' + formatDate('DDDD, MMMM D, YYYY', startTime, s) : '';
            var endStr = endTime ? ', ' + s.toText + ': ' + formatDate('DDDD, MMMM D, YYYY', endTime, s) : '';
            if (event_1.id === UNDEFINED) {
              event_1.id = 'mbsc_' + labelGuid++;
            }
            if (multiDay) {
              eventRows[row] = event_1;
            }
            event_1._days = [day];
            data.push({
              event: event_1,
              id: event_1.occurrenceId || event_1.id,
              label: (event_1.title || event_1.text || '') + startStr + endStr,
              lastDay: lastDayOfMonth ? addDays(lastDayOfMonth, 1) : UNDEFINED,
              multiDay: multiDay,
              showText: true,
              width: multiDay ? Math.min(getDayDiff(day, labelEnd) + 1, getDayDiff(day, rowEnd)) * 100 : 100
            });
            row++;
            displayed++;
          }
          i++;
        } else {
          if (displayed < eventsNr) {
            data.push({ id: 'ph_' + ++uid, placeholder: true });
          }
          row++;
        }
      }
      dayLabels[dateKey] = { data: data, events: events };
      day = getDateOnly(addDays(day, 1));
    }
    return dayLabels;
  }
  /** @hidden */
  function sortEvents(events, eventOrder) {
    return events && events.slice(0).sort(eventOrder || compareEvents);
  }

  // tslint:disable no-non-null-assertion
  var MbscCalendarNavService = /*#__PURE__*/ (function () {
    function MbscCalendarNavService() {
      this.pageSize = 0;
      // tslint:disable-next-line: variable-name
      this._prevS = {};
      // tslint:disable-next-line: variable-name
      this._s = {};
    }
    MbscCalendarNavService.prototype.options = function (news, forcePageLoading) {
      var s = (this._s = __assign({}, this._s, news));
      var prevS = this._prevS;
      var getDate = s.getDate;
      var getYear = s.getYear;
      var getMonth = s.getMonth;
      var showCalendar = s.showCalendar;
      var calendarType = s.calendarType;
      var isWeekView = calendarType === 'week';
      var weeks = showCalendar ? (isWeekView ? s.weeks : 6) : 0;
      var minDate = s.min !== prevS.min || !this.minDate ? (!isEmpty(s.min) ? makeDate(s.min) : -Infinity) : this.minDate;
      var maxDate = s.max !== prevS.max || !this.maxDate ? (!isEmpty(s.max) ? makeDate(s.max) : Infinity) : this.maxDate;
      var activeDate = constrain(s.activeDate || +new Date(), +minDate, +maxDate);
      var d = new Date(activeDate);
      var activeChanged = activeDate !== prevS.activeDate;
      var viewChanged =
        s.calendarType !== prevS.calendarType ||
        s.eventRange !== prevS.eventRange ||
        s.firstDay !== prevS.firstDay ||
        s.eventRangeSize !== prevS.eventRangeSize ||
        s.refDate !== prevS.refDate ||
        showCalendar !== prevS.showCalendar ||
        s.size !== prevS.size ||
        s.weeks !== prevS.weeks;
      var pageIndex =
        this.forcePageChange ||
        this.pageIndex === UNDEFINED ||
        viewChanged ||
        (!this.preventPageChange && activeChanged && (activeDate < +this.firstDay || activeDate >= +this.lastDay))
          ? getPageIndex(d, s)
          : this.pageIndex;
      var size = calendarType === 'year' ? 12 : s.size || 1;
      var isGrid = size > 1 && !isWeekView;
      var pageNr = isGrid ? 1 : getPageNr(s.pages, this.pageSize);
      var isVertical = s.calendarScroll === 'vertical' && s.pages !== 'auto' && (s.pages === UNDEFINED || s.pages === 1);
      var showOuter = s.showOuterDays !== UNDEFINED ? s.showOuterDays : !isVertical && pageNr < 2 && (isWeekView || !size || size < 2);
      var pageBuffer = isGrid ? 0 : 1;
      var firstDay = getFirstPageDay(pageIndex, s);
      var lastDay = getFirstPageDay(pageIndex + pageNr, s);
      // In case of scheduler and timeline, if startDay & endDay is specified, calculate first and last days based on that
      if (!showCalendar && s.eventRange === 'week' && s.startDay !== UNDEFINED && s.endDay !== UNDEFINED) {
        firstDay = addDays(firstDay, s.startDay - s.firstDay + (s.startDay < s.firstDay ? 7 : 0));
        lastDay = addDays(firstDay, 7 * s.eventRangeSize + s.endDay - s.startDay + 1 - (s.endDay < s.startDay ? 0 : 7));
      }
      var firstPageDay = showCalendar && showOuter ? getFirstDayOfWeek(firstDay, s) : firstDay;
      var lastPage = isGrid ? getDate(getYear(lastDay), getMonth(lastDay) - 1, 1) : getFirstPageDay(pageIndex + pageNr - 1, s);
      var lastPageDay = showCalendar && showOuter ? addDays(getFirstDayOfWeek(lastPage, s), weeks * 7) : lastDay;
      var start = showCalendar ? getFirstDayOfWeek(getFirstPageDay(pageIndex - pageBuffer, s), s) : firstDay;
      var last = showCalendar ? getFirstDayOfWeek(getFirstPageDay(pageIndex + pageNr + pageBuffer - 1, s), s) : lastDay;
      var end = showCalendar ? addDays(isGrid ? getFirstDayOfWeek(lastPage, s) : last, weeks * 7) : lastDay;
      var initialRun = this.pageIndex === UNDEFINED;
      var pageChange = false;
      if (pageIndex !== UNDEFINED) {
        pageChange = +start !== +this.viewStart || +end !== +this.viewEnd;
        this.pageIndex = pageIndex;
      }
      this.firstDay = firstDay;
      this.lastDay = lastDay;
      this.firstPageDay = firstPageDay;
      this.lastPageDay = lastPageDay;
      this.viewStart = start;
      this.viewEnd = end;
      this.forcePageChange = false;
      this.preventPageChange = false;
      this.minDate = minDate;
      this.maxDate = maxDate;
      this._prevS = s;
      if (pageIndex !== UNDEFINED && (pageChange || forcePageLoading)) {
        if (pageChange && !initialRun) {
          this.pageChange();
        }
        this.pageLoading(pageChange);
      }
    };
    MbscCalendarNavService.prototype.pageChange = function () {
      if (this._s.onPageChange) {
        this._s.onPageChange(
          {
            firstDay: this.firstPageDay,
            lastDay: this.lastPageDay,
            month: this._s.calendarType === 'month' ? this.firstDay : UNDEFINED,
            type: 'onPageChange',
            viewEnd: this.viewEnd,
            viewStart: this.viewStart
          },
          null
        );
      }
    };
    MbscCalendarNavService.prototype.pageLoading = function (viewChanged) {
      if (this._s.onPageLoading) {
        this._s.onPageLoading(
          {
            firstDay: this.firstPageDay,
            lastDay: this.lastPageDay,
            month: this._s.calendarType === 'month' ? this.firstDay : UNDEFINED,
            type: 'onPageLoading',
            viewChanged: viewChanged,
            viewEnd: this.viewEnd,
            viewStart: this.viewStart
          },
          null
        );
      }
    };
    return MbscCalendarNavService;
  })();

  // tslint:disable no-non-null-assertion
  // tslint:disable no-inferrable-types
  var WEEK_DAYNAMES = { 0: 'SU', 1: 'MO', 2: 'TU', 3: 'WE', 4: 'TH', 5: 'FR', 6: 'SA' };
  var WEEK_DAYS = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };
  var RULE_KEY_MAP = {
    byday: 'weekDays',
    bymonth: 'month',
    bymonthday: 'day',
    bysetpos: 'pos',
    dtstart: 'from',
    freq: 'repeat',
    wkst: 'weekStart'
  };
  /** @hidden */
  function addMultiDayEvent(obj, item, s, overwrite) {
    var start = makeDate(item.start, item.allDay ? UNDEFINED : s);
    var end = makeDate(item.end, item.allDay ? UNDEFINED : s);
    var duration = end - start;
    if (overwrite) {
      item.start = start;
      item.end = end;
    }
    start = getDateOnly(start);
    end = s.exclusiveEndDates ? end : getDateOnly(addDays(end, 1));
    // If event has no duration, it should still be added to the start day
    while (start < end || !duration) {
      addToList(obj, start, item);
      start = addDays(start, 1);
      duration = 1;
    }
  }
  /** @hidden */
  function addToList(obj, d, data) {
    var key = getDateStr(d);
    if (!obj[key]) {
      obj[key] = [];
      // Stored the date object on the array for performance reasons, so we don't have to parse it again later
      // TODO: do this with proper types
      obj[key].date = getDateOnly(d, true);
    }
    obj[key].push(data);
  }
  /** @hidden */
  function getExceptionDateMap(dtStart, start, end, s, exception, exceptionRule) {
    var map = {};
    if (exception) {
      var exceptionDates = getExceptionList(exception);
      for (var _i = 0, exceptionDates_1 = exceptionDates; _i < exceptionDates_1.length; _i++) {
        var e = exceptionDates_1[_i];
        map[getDateStr(makeDate(e))] = true;
      }
    }
    if (exceptionRule) {
      // Get exception date list from the rule
      var exceptionDateList = getOccurrences(exceptionRule, dtStart, start, end, s);
      for (var _a = 0, exceptionDateList_1 = exceptionDateList; _a < exceptionDateList_1.length; _a++) {
        var ex = exceptionDateList_1[_a];
        map[getDateStr(ex.d)] = true;
      }
    }
    return map;
  }
  /** @hidden */
  function getDateFromItem(item) {
    // If the item is a string, Date, or moment object, it's directly the date (e.g. in case of invalid setting),
    // otherwise check the d or start attributes
    return isString(item) || item.getTime || item.toDate ? item : item.start || item.date;
  }
  /** @hidden */
  function parseRule(ruleStr) {
    var rule = {};
    var pairs = ruleStr.split(';');
    for (var _i = 0, pairs_1 = pairs; _i < pairs_1.length; _i++) {
      var pair = pairs_1[_i];
      var values = pair.split('=');
      var key = values[0].trim().toLowerCase();
      var value = values[1].trim();
      rule[RULE_KEY_MAP[key] || key] = value;
    }
    return rule;
  }
  /** @hidden */
  function getRule(rule) {
    return isString(rule) ? parseRule(rule) : __assign({}, rule);
  }
  /**
   * Updates a recurring rule, based on a new start date and old start date.
   * @param recurringRule
   * @param newStart
   * @param oldStart
   */
  function updateRecurringRule(recurringRule, newStart, oldStart) {
    var updatedRule = getRule(recurringRule);
    var newStartDate = makeDate(newStart);
    var oldStartDate = makeDate(oldStart);
    var dayDelta = getDayDiff(oldStartDate, newStartDate);
    var repeat = (updatedRule.repeat || '').toLowerCase();
    var updateArray = function (values, oldValue, newValue) {
      var newValues = values.filter(function (value) {
        return value !== oldValue;
      });
      if (newValues.indexOf(newValue) === -1) {
        newValues.push(newValue);
      }
      return newValues;
    };
    var updateNumber = function (values, oldValue, newValue) {
      var oldValues = isArray(values)
        ? values
        : ((values || '') + '').split(',').map(function (nr) {
            return +nr;
          });
      var newValues = updateArray(oldValues, oldValue, newValue);
      return newValues.length > 1 ? newValues : newValues[0];
    };
    var updateWeekDays = function () {
      if (updatedRule.weekDays) {
        var oldWeekDays = updatedRule.weekDays.split(',');
        // if (oldValues.length > 1) {
        var oldWeekDay = WEEK_DAYNAMES[oldStartDate.getDay()];
        var newWeekDay = WEEK_DAYNAMES[newStartDate.getDay()];
        var newWeekDays = updateArray(oldWeekDays, oldWeekDay, newWeekDay);
        // const newValues = oldValues.filter((day: string) => day !== oldValue);
        // if (newValues.indexOf(newValue) === -1) {
        //   newValues.push(newValue);
        // }
        // } else {
        //   // Shift all values in the week days array with dayDelta
        //   newValues = oldValues.map((day: string) => {
        //     const dayIndex = WEEK_DAYS[day.trim()];
        //     const delta = dayDelta % 7;
        //     const newDayIndex = dayIndex + delta + (dayIndex + delta < 0 ? 7 : 0);
        //     return WEEK_DAYNAMES[newDayIndex % 7];
        //   });
        // }
        updatedRule.weekDays = newWeekDays.join();
      }
    };
    if (repeat === 'weekly') {
      updateWeekDays();
    } else if (repeat === 'monthly') {
      if (updatedRule.pos === UNDEFINED) {
        updatedRule.day = updateNumber(updatedRule.day, oldStartDate.getDate(), newStartDate.getDate());
      } else {
        updateWeekDays();
      }
    } else if (repeat === 'yearly') {
      if (updatedRule.pos === UNDEFINED) {
        updatedRule.month = updateNumber(updatedRule.month, oldStartDate.getMonth() + 1, newStartDate.getMonth() + 1);
        updatedRule.day = updateNumber(updatedRule.day, oldStartDate.getDate(), newStartDate.getDate());
      } else {
        updateWeekDays();
      }
    }
    if (updatedRule.from) {
      updatedRule.from = addDays(makeDate(updatedRule.from), dayDelta);
    }
    if (updatedRule.until) {
      updatedRule.until = addDays(makeDate(updatedRule.until), dayDelta);
    }
    return updatedRule;
  }
  /**
   * Updates a recurring event, returns the updated and the new event.
   * @param originalRecurringEvent The original event to update.
   * @param oldEventOccurrence The original event occurrence in case of d&d (what is dragged).
   * @param newEvent The created even in case of d&d (where is dragged).
   * @param updatedEvent The updated event from popup.
   * @param updateMode The update type.
   */
  function updateRecurringEvent(originalRecurringEvent, oldEventOccurrence, newEvent, updatedEvent, updateMode, timezone, timezonePlugin) {
    var retUpdatedEvent = __assign({}, originalRecurringEvent);
    var retNewEvent = null;
    var newStart = newEvent && newEvent.start;
    var newEnd = newEvent && newEvent.end;
    var oldStart = oldEventOccurrence && oldEventOccurrence.start;
    var originalRule = getRule(originalRecurringEvent.recurring);
    switch (updateMode) {
      case 'following':
        var newRule = void 0;
        if (updatedEvent) {
          // edit from popup
          if (updatedEvent.recurring) {
            newRule = getRule(updatedEvent.recurring);
          }
          retNewEvent = updatedEvent;
          delete retNewEvent.id;
        } else if (newStart && oldStart) {
          // drag & drop
          newRule = updateRecurringRule(originalRule, newStart, oldStart);
          retNewEvent = __assign({}, newEvent);
        }
        // set the hours to 00:00
        originalRule.until = getDateStr(makeDate(oldStart));
        if (originalRule.count) {
          var oldNr = (oldEventOccurrence && oldEventOccurrence.nr) || 0;
          if (newRule) {
            newRule.count = originalRule.count - oldNr;
          }
          originalRule.count = oldNr;
        }
        if (newStart && newRule) {
          newRule.from = newStart;
        }
        if (retNewEvent && newRule) {
          retNewEvent.recurring = newRule;
        }
        retUpdatedEvent.recurring = originalRule;
        break;
      case 'all':
        if (updatedEvent) {
          // edit from popup
          newStart = updatedEvent.start;
          newEnd = updatedEvent.end;
          retUpdatedEvent = updatedEvent;
        } else if (newEvent && newStart && newEnd && oldStart) {
          // drag & drop
          retUpdatedEvent.allDay = newEvent.allDay;
          retUpdatedEvent.recurring = updateRecurringRule(originalRule, newStart, oldStart);
        }
        if (newStart && newEnd) {
          var tzOpt = timezone && timezonePlugin ? { displayTimezone: timezone, timezonePlugin: timezonePlugin } : UNDEFINED;
          var tzOpt1 = retUpdatedEvent.allDay ? UNDEFINED : tzOpt;
          var tzOpt2 = originalRecurringEvent.allDay ? UNDEFINED : tzOpt;
          var start = makeDate(newStart, tzOpt1);
          var end = makeDate(newEnd, tzOpt1);
          var origStart = originalRecurringEvent.start;
          var origEnd = originalRecurringEvent.end;
          var allDayChange = originalRecurringEvent.allDay && !retUpdatedEvent.allDay;
          var origStartDate = origStart && makeDate(origStart, tzOpt2);
          var oldStartDate = oldStart && makeDate(oldStart, tzOpt2);
          var duration = end - start;
          var delta = oldStartDate ? start - oldStartDate : 0;
          var updatedStart = origStartDate && oldStartDate ? createDate(tzOpt1, +origStartDate + delta) : start;
          var updatedEnd = createDate(tzOpt1, +updatedStart + duration);
          if (isTime(origStart) || (!origStart && allDayChange)) {
            // Set the time only
            retUpdatedEvent.start = formatDatePublic('HH:mm', start);
          } else if (origStart) {
            retUpdatedEvent.start = tzOpt1 ? updatedStart.toISOString() : updatedStart;
          }
          if (isTime(origEnd) || (!origEnd && allDayChange)) {
            // Set the time only
            retUpdatedEvent.end = formatDatePublic('HH:mm', end);
          } else if (origEnd) {
            retUpdatedEvent.end = tzOpt1 ? updatedEnd.toISOString() : updatedEnd;
          }
        }
        break;
      default:
        var originalException = originalRecurringEvent.recurringException;
        var exception = isArray(originalException) ? originalException.slice() : originalException ? [originalException] : [];
        if (oldStart) {
          exception.push(oldStart);
        }
        retUpdatedEvent.recurringException = exception;
        // from popup or drag & drop
        retNewEvent = updatedEvent || newEvent;
        break;
    }
    return { updatedEvent: retUpdatedEvent, newEvent: retNewEvent };
  }
  /**
   * @hidden
   * Returns the first date on which occurs something from the list of rules/dates
   * For example it returns the next invalid date from the list of invalid and a given start date
   */
  function getNextOccurrence(list, from, s, displayFormat) {
    // this will hold the next invalid date or null if none was found
    var closest = null;
    // loop through all the invalid entries to find the closest date to the starting point
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
      var item = list_1[_i];
      if (item.recurring) {
        // Recurring rule
        var dtStart = makeDate(item.start || item.date);
        var firstOccurrence = getOccurrences(
          item.recurring,
          dtStart,
          from,
          UNDEFINED,
          s,
          item.reccurringException,
          item.recurringExceptionRule,
          'first'
        );
        if (!closest || firstOccurrence < closest) {
          closest = firstOccurrence;
        }
      } else if (item.start && item.end) {
        // Range with start/end
        var start = makeDate(item.start, s, displayFormat);
        var end = makeDate(item.end, s, displayFormat);
        if (end > from) {
          if (start <= from) {
            closest = from;
          } else {
            closest = closest && closest < start ? closest : start;
          }
        }
      } else {
        // Exact date
        var exactDate = makeDate(getDateFromItem(item), s, displayFormat);
        if (exactDate > from && (!closest || exactDate < closest)) {
          closest = exactDate;
        }
      }
    }
    return closest;
  }
  /**
   * @hidden
   * Returns the latest possible date from a list without braking a consecutive day sequence.
   */
  function getLatestOccurrence(list, from, s, displayFormat) {
    var latest = from;
    // Sort entries by start date
    list.sort(function (a, b) {
      var d1 = makeDate(getDateFromItem(a), s, displayFormat);
      var d2 = makeDate(getDateFromItem(b), s, displayFormat);
      return d1 - d2;
    });
    // Loop through the list to find the latest entry
    for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
      var item = list_2[_i];
      if (item.recurring) {
        // Recurring rule
        var dtStart = makeDate(item.start || item.date);
        var latestOccurrence = getOccurrences(
          item.recurring,
          dtStart,
          from,
          UNDEFINED,
          s,
          item.reccurringException,
          item.recurringExceptionRule,
          'last'
        );
        if (latestOccurrence > latest) {
          latest = latestOccurrence;
        }
      } else if (item.start && item.end) {
        // Range with start/end
        var start = makeDate(item.start, s, displayFormat);
        var end = makeDate(item.end, s, displayFormat);
        if (end > latest && getDayDiff(latest, start) <= 1) {
          latest = end;
        }
      } else {
        // Exact date
        var exactDate = makeDate(getDateFromItem(item), s, displayFormat);
        if (exactDate > latest && getDayDiff(latest, exactDate) <= 1) {
          latest = exactDate;
        }
      }
    }
    return latest;
  }
  /** @hidden */
  function getExceptionList(exception) {
    if (exception) {
      if (isArray(exception)) {
        return exception;
      }
      if (isString(exception)) {
        return exception.split(',');
      }
      return [exception];
    }
    return [];
  }
  /** @hidden */
  function getOccurrences(rule, dtStart, start, end, s, exception, exceptionRule, returnOccurrence) {
    if (isString(rule)) {
      rule = parseRule(rule);
    }
    var getYear = s.getYear;
    var getMonth = s.getMonth;
    var getDay = s.getDay;
    var getDate = s.getDate;
    var getMaxDays = s.getMaxDayOfMonth;
    var freq = (rule.repeat || '').toLowerCase();
    var interval = rule.interval || 1;
    var count = rule.count;
    // the staring point of the current rule
    var from = rule.from ? makeDate(rule.from) : dtStart || (interval !== 1 || count !== UNDEFINED ? new Date() : start);
    var fromDate = getDateOnly(from);
    var fromYear = getYear(from);
    var fromMonth = getMonth(from);
    var until = rule.until ? makeDate(rule.until) : Infinity;
    var occurredBefore = from < start;
    var rangeStart = occurredBefore ? start : getDateOnly(from);
    var firstOnly = returnOccurrence === 'first';
    var lastOnly = returnOccurrence === 'last';
    var rangeEnd = firstOnly || lastOnly || !end ? until : until < end ? until : end;
    var countOrInfinity = count === UNDEFINED ? Infinity : count;
    var weekDays = (rule.weekDays || WEEK_DAYNAMES[from.getDay()]).split(',');
    var weekStart = WEEK_DAYS[(rule.weekStart || 'MO').trim().toUpperCase()];
    var days = isArray(rule.day) ? rule.day : ((rule.day || getDay(from)) + '').split(',');
    var months = isArray(rule.month) ? rule.month : ((rule.month || getMonth(from) + 1) + '').split(',');
    var occurrences = [];
    var hasPos = rule.pos !== UNDEFINED;
    var pos = hasPos ? +rule.pos : 1;
    var weekDayValues = [];
    var exceptionDateMap = end ? getExceptionDateMap(dtStart, start, end, s, exception, exceptionRule) : {};
    var first;
    var iterator;
    var repeat = true;
    var i = 0;
    var nr = 0;
    var closest = null;
    var latest = start;
    for (var _i = 0, weekDays_1 = weekDays; _i < weekDays_1.length; _i++) {
      var weekDay = weekDays_1[_i];
      weekDayValues.push(WEEK_DAYS[weekDay.trim().toUpperCase()]);
    }
    var handleOccurrence = function () {
      // If end is not specified, get the exception dates for the current day
      if (!end) {
        exceptionDateMap = getExceptionDateMap(iterator, iterator, addDays(iterator, 1), s, exception, exceptionRule);
      }
      // Check that it's not an exception date and it's after the start of the range
      if (!exceptionDateMap[getDateStr(iterator)] && iterator >= rangeStart) {
        if (firstOnly) {
          // if it is closer to the start than the current one, stop looking further
          closest = !closest || iterator < closest ? iterator : closest;
          repeat = false;
        } else if (lastOnly) {
          var diff = getDayDiff(latest, iterator);
          latest = iterator > latest && diff <= 1 ? iterator : latest;
          repeat = diff <= 1;
        } else {
          occurrences.push({ d: iterator, i: nr });
        }
      }
      nr++;
    };
    var handlePos = function (monthFirstDay, monthLastDay) {
      var matches = [];
      for (var _i = 0, weekDayValues_1 = weekDayValues; _i < weekDayValues_1.length; _i++) {
        var weekDay = weekDayValues_1[_i];
        var startWeekDay = getFirstDayOfWeek(monthFirstDay, { firstDay: weekDay });
        for (var d = startWeekDay; d < monthLastDay; d.setDate(d.getDate() + 7)) {
          if (d.getMonth() === monthFirstDay.getMonth()) {
            matches.push(+d);
          }
        }
      }
      matches.sort();
      var match = matches[pos < 0 ? matches.length + pos : pos - 1];
      iterator = match ? new Date(match) : monthLastDay;
      if (iterator < rangeEnd) {
        if (match) {
          handleOccurrence();
        }
      } else {
        repeat = false;
      }
    };
    switch (freq) {
      case 'daily':
        nr = count && occurredBefore ? floor(getDayDiff(from, start) / interval) : 0;
        while (repeat) {
          iterator = getDate(getYear(from), getMonth(from), getDay(from) + nr * interval);
          if (iterator < rangeEnd && nr < countOrInfinity) {
            handleOccurrence();
          } else {
            repeat = false;
          }
        }
        break;
      case 'weekly':
        // const nrByDay: { [key: number]: number } = {};
        var sortedDays = weekDayValues;
        var fromFirstWeekDay = getFirstDayOfWeek(from, { firstDay: weekStart });
        var fromWeekDay_1 = fromFirstWeekDay.getDay();
        // const startFirstWeekDay = getFirstDayOfWeek(start, { firstDay: weekStart });
        // Sort week day numbers to start with from day
        sortedDays.sort(function (a, b) {
          a = a - fromWeekDay_1;
          a = a < 0 ? a + 7 : a;
          b = b - fromWeekDay_1;
          b = b < 0 ? b + 7 : b;
          return a - b;
        });
        // TODO: the calculation below is not always correct, and leads to skipping occurrences in the actual range
        // Calculate how many times the event occured before the start date of the range
        // if (occurredBefore && count === UNDEFINED) {
        //   const daysNr = floor(getDayDiff(fromFirstWeekDay, startFirstWeekDay));
        //   for (const weekDay of sortedDays) {
        //     let temp = floor(daysNr / (7 * interval));
        //     if (weekDay < from.getDay()) {
        //       temp--;
        //     }
        //     if (weekDay < start.getDay()) {
        //       temp++;
        //     }
        //     nrByDay[weekDay] = temp;
        //     nr += temp;
        //   }
        // }
        while (repeat) {
          for (var _a = 0, sortedDays_1 = sortedDays; _a < sortedDays_1.length; _a++) {
            var weekDay = sortedDays_1[_a];
            first = addDays(fromFirstWeekDay, weekDay < weekStart ? weekDay - weekStart + 7 : weekDay - weekStart);
            // iterator = getDate(getYear(first), getMonth(first), getDay(first) + ((nrByDay[weekDay] || 0) + i) * 7 * interval);
            iterator = getDate(getYear(first), getMonth(first), getDay(first) + i * 7 * interval);
            if (iterator < rangeEnd && nr < countOrInfinity) {
              if (iterator >= fromDate) {
                handleOccurrence();
              }
            } else {
              repeat = false;
            }
          }
          i++;
        }
        break;
      case 'monthly':
        // TODO: calculate occurences before start instead of iterating through all
        while (repeat) {
          var maxDays = getMaxDays(fromYear, fromMonth + i * interval);
          if (hasPos) {
            var monthFirstDay = getDate(fromYear, fromMonth + i * interval, 1);
            var monthLastDay = getDate(fromYear, fromMonth + i * interval + 1, 1);
            handlePos(monthFirstDay, monthLastDay);
          } else {
            for (var _b = 0, days_1 = days; _b < days_1.length; _b++) {
              var d = days_1[_b];
              var day = +d;
              iterator = getDate(fromYear, fromMonth + i * interval, day < 0 ? maxDays + day + 1 : day);
              if (iterator < rangeEnd && nr < countOrInfinity) {
                if (maxDays >= d && iterator >= fromDate) {
                  handleOccurrence();
                }
              } else {
                repeat = false;
              }
            }
          }
          i++;
        }
        break;
      case 'yearly':
        // TODO: calculate occurences before start instead of iterating through all
        while (repeat) {
          for (var _c = 0, months_1 = months; _c < months_1.length; _c++) {
            var m = months_1[_c];
            var month = +m;
            var maxDays = getMaxDays(fromYear + i * interval, month - 1);
            if (hasPos) {
              var monthFirstDay = getDate(fromYear + i * interval, month - 1, 1);
              var monthLastDay = getDate(fromYear + i * interval, month, 1);
              handlePos(monthFirstDay, monthLastDay);
            } else {
              for (var _d = 0, days_2 = days; _d < days_2.length; _d++) {
                var d = days_2[_d];
                var day = +d;
                iterator = getDate(fromYear + i * interval, month - 1, day < 0 ? maxDays + day + 1 : day);
                if (iterator < rangeEnd && nr < countOrInfinity) {
                  if (maxDays >= d && iterator >= fromDate) {
                    handleOccurrence();
                  }
                } else {
                  repeat = false;
                }
              }
            }
          }
          i++;
        }
        break;
    }
    return firstOnly ? closest : lastOnly ? latest : occurrences;
  }
  /** @hidden */
  function getEventMap(list, start, end, s, overwrite) {
    var obj = {};
    var tz = s.timezonePlugin;
    var dataTimezone = s.dataTimezone || s.displayTimezone;
    // We need to get the occurence start date in data timezone to make sure times are correct
    var tzOpt = tz ? { displayTimezone: dataTimezone, timezonePlugin: tz } : s;
    if (!list) {
      return;
    }
    for (var _i = 0, list_3 = list; _i < list_3.length; _i++) {
      var item = list_3[_i];
      var d = getDateFromItem(item);
      var dt = makeDate(d, item.allDay ? UNDEFINED : s);
      if (item.recurring) {
        // Use a timezone-less start for getting the occurences, since getOccurrences does not use timezones
        var dtStart = ISO_8601_TIME.test(d) ? null : makeDate(d);
        // We need to extend the range with 1-1 days, because
        // start/end is in local timezone, but data is in data timezone.
        // We cannot convert start/end to data timezone, because the time part is not relevant here.
        var from = addDays(start, -1);
        var until = addDays(end, 1);
        var dates = getOccurrences(item.recurring, dtStart, from, until, s, item.recurringException, item.recurringExceptionRule);
        var origStart = createDate(item.allDay ? UNDEFINED : tzOpt, dt);
        var origEnd = item.end ? makeDate(item.end, item.allDay ? UNDEFINED : s) : origStart;
        var duration = +origEnd - +origStart;
        for (var _a = 0, dates_1 = dates; _a < dates_1.length; _a++) {
          var occurrence = dates_1[_a];
          var date = occurrence.d;
          // For each occurrence create a clone of the event
          var clone = __assign({}, item);
          // Modify the start/end dates for the occurence
          if (item.start) {
            clone.start = createDate(
              item.allDay ? UNDEFINED : tzOpt,
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              origStart.getHours(),
              origStart.getMinutes(),
              origStart.getSeconds()
            );
          } else {
            clone.allDay = true;
            clone.start = createDate(UNDEFINED, date.getFullYear(), date.getMonth(), date.getDate());
          }
          if (item.end) {
            if (item.allDay) {
              // In case of all-day events keep the length in days, end set the original time for the end day
              var endDay = addDays(date, getDayDiff(origStart, origEnd));
              clone.end = new Date(
                endDay.getFullYear(),
                endDay.getMonth(),
                endDay.getDate(),
                origEnd.getHours(),
                origEnd.getMinutes(),
                origEnd.getSeconds()
              );
            } else {
              // In case of non all-day events keep the event duration
              clone.end = createDate(tzOpt, +clone.start + duration);
            }
            if (item.end === '00:00') {
              clone.end.setHours(23, 59, 59, 999);
            }
          }
          // Save the occurrence number
          clone.nr = occurrence.i;
          // Set uid
          clone.occurrenceId = clone.id + '_' + getDateStr(clone.start);
          // Save reference to the original event
          clone.original = item;
          if (clone.start && clone.end) {
            addMultiDayEvent(obj, clone, s, overwrite);
          } else {
            addToList(obj, date, clone);
          }
        }
      } else if (item.start && item.end) {
        addMultiDayEvent(obj, item, s, overwrite);
      } else if (dt) {
        // Exact date
        addToList(obj, dt, item);
      }
    }
    return obj;
  }

  // tslint:disable no-non-null-assertion
  /**
   * Checks if a date is invalid or not.
   * @param s Options object for the exclusiveEndDates and timezone options used
   * @param d The date to check.
   * @param invalids Object map containing the invalids.
   * @param valids Object map containing the valids.
   * @param min Timestamp of the min date.
   * @param max Timestamp of the max date.
   */
  function isInvalid(s, d, invalids, valids, min, max) {
    var key = getDateStr(d); // +getDateOnly(d);
    if ((min && +d < min) || (max && +d > max)) {
      return true;
    }
    if (valids && valids[key]) {
      return false;
    }
    var invalidsForDay = invalids && invalids[key];
    if (invalidsForDay) {
      for (var _i = 0, invalidsForDay_1 = invalidsForDay; _i < invalidsForDay_1.length; _i++) {
        var invalid = invalidsForDay_1[_i];
        var start = invalid.start,
          end = invalid.end,
          allDay = invalid.allDay;
        if (start && end && !allDay) {
          var endDate = getEndDate(s, allDay, start, end);
          var dayStart = getDayStart(s, d);
          var dayEnd = getDayEnd(s, endDate);
          if (
            !isSameDay(start, end) &&
            (+start === +dayStart || +endDate === +dayEnd || (!isSameDay(d, start) && !isSameDay(d, end) && d > start && d < end)) // d <= end???
          ) {
            return invalid;
          }
        } else {
          return invalid;
        }
      }
    }
    return false;
  }
  /**
   * Returns the closest valid date. Actually gets the closest valid only if the next or the previous valid is in
   * the other month. Otherwise it gets the next valid (when not given direction), regardless if the previous valid is closer.
   * @param d Initial date.
   * @param s Date & time options.
   * @param min Timestamp of the min date.
   * @param max Timestamp of the max date.
   * @param invalids Object map containing the invalids.
   * @param valids Object map containing the valids.
   * @param dir Direction to find the next valid date. If 1, it will search forwards, if -1, backwards,
   * otherwise will search both directions and return the closest one.
   */
  function getClosestValidDate(d, s, min, max, invalids, valids, dir) {
    var next;
    var prev;
    var nextInvalid = true;
    var prevInvalid = true;
    var up = 0;
    var down = 0;
    if (+d < min) {
      d = createDate(s, min);
    }
    if (+d > max) {
      d = createDate(s, max);
    }
    var year = s.getYear(d);
    var month = s.getMonth(d);
    var start = s.getDate(year, month - 1, 1);
    var end = s.getDate(year, month + 2, 1);
    var from = +start > min ? +start : min;
    var until = +end < max ? +end : max;
    // If invalids are not passed we create the invalids map for +/- 1 month
    if (!invalids) {
      // Map the valids and invalids for prev and next months
      valids = getEventMap(s.valid, start, end, s, true);
      invalids = getEventMap(s.invalid, start, end, s, true);
    }
    if (!isInvalid(s, d, invalids, valids, min, max)) {
      return d;
    }
    next = d;
    prev = d;
    // Find next valid value
    while (nextInvalid && +next < until && up < 100) {
      next = addDays(next, 1);
      nextInvalid = isInvalid(s, next, invalids, valids, min, max);
      up++;
    }
    // Find previous valid value
    while (prevInvalid && +prev > from && down < 100) {
      prev = addDays(prev, -1);
      prevInvalid = isInvalid(s, prev, invalids, valids, min, max);
      down++;
    }
    // If no valid value found, return the invalid value
    if (nextInvalid && prevInvalid) {
      return d;
    }
    if (dir === 1 && !nextInvalid) {
      return next;
    }
    if (dir === -1 && !prevInvalid) {
      return prev;
    }
    // if (viewStart && viewEnd) {
    //   if (+next >= viewStart && +next < viewEnd) {
    //     return next;
    //   }
    //   if (+prev >= viewStart && +prev < viewEnd) {
    //     return prev;
    //   }
    // }
    if (isSameMonth(d, next, s)) {
      return next;
    }
    if (isSameMonth(d, prev, s)) {
      return prev;
    }
    return down >= up && !nextInvalid ? next : prev;
  }

  var BACKSPACE = 8;
  var TAB = 9;
  var ENTER = 13;
  var ESC = 27;
  var SPACE = 32;
  var PAGE_UP = 33;
  var PAGE_DOWN = 34;
  var END = 35;
  var HOME = 36;
  var LEFT_ARROW = 37;
  var UP_ARROW = 38;
  var RIGHT_ARROW = 39;
  var DOWN_ARROW = 40;
  var DELETE = 46;

  var uid = 1;
  /** @hidden */
  function getDataInRange(data, s, firstDay, lastDay, start, end) {
    var startDate = firstDay;
    var endDate = lastDay;
    var map = new Map();
    var dataInRange = [];
    if (start) {
      startDate = makeDate(start, s);
    }
    if (end) {
      endDate = makeDate(end, s);
    } else if (start) {
      endDate = addDays(startDate, 1);
    }
    var events = getEventMap(data, startDate, endDate, s);
    for (var date in events) {
      if (date) {
        for (var _i = 0, _a = events[date]; _i < _a.length; _i++) {
          var event_1 = _a[_i];
          var eventStart = makeDate(event_1.start, s);
          var eventEnd = makeDate(event_1.end, s) || eventStart;
          if (!event_1.start) {
            // Single date only (in case of invalids)
            dataInRange.push(event_1);
          } else if (!map.has(event_1) && checkDateRangeOverlap(startDate, endDate, eventStart, eventEnd)) {
            var eventCopy = __assign({}, event_1);
            if (s.dataTimezone || s.displayTimezone) {
              eventCopy.start = eventStart.toISOString();
              eventCopy.end = eventEnd.toISOString();
            }
            map.set(event_1, true);
            dataInRange.push(eventCopy);
          }
        }
      }
    }
    return dataInRange;
  }
  /** @hidden */
  function getEventId() {
    return 'mbsc_' + uid++;
  }
  /** @hidden */
  function getEventData(s, event, eventDay, colorEvent, timeFormat, allDayText, toText, resource, isList, isTimeline, skipLabels) {
    var color = event.color || (resource && resource.color);
    var st = event.start || event.date;
    var origStart = event.recurring ? event.original.start : event.start;
    var allDay = event.allDay || !origStart;
    var start = st ? makeDate(st, allDay ? UNDEFINED : s) : null;
    var end = event.end ? makeDate(event.end, allDay ? UNDEFINED : s) : null;
    var endDate = getEndDate(s, event.allDay, start, end, isList);
    var isMultiDay = start && endDate && !isSameDay(start, endDate);
    var isFirstDay = isMultiDay ? isSameDay(start, eventDay) : true;
    var isLastDay = isMultiDay ? isSameDay(endDate, eventDay) : true;
    var fillsAllDay = allDay || (!isTimeline && isMultiDay && !isFirstDay && !isLastDay);
    var startTime = !skipLabels && start && !allDay ? formatDate(timeFormat, start, s) : '';
    var endTime = !skipLabels && end && !allDay ? formatDate(timeFormat, end, s) : '';
    var eventStart = !skipLabels && !fillsAllDay && (isFirstDay || isTimeline) ? startTime : '';
    var eventEnd = !skipLabels && !fillsAllDay && (isLastDay || isTimeline) ? endTime : '';
    var html = event.title || event.text || '';
    var title = html; // htmlToText(html);
    var tooltip = title + (fillsAllDay ? '' : ', ' + eventStart + ' - ' + eventEnd);
    var format = 'DDDD, MMMM D, YYYY';
    var startStr = !skipLabels && start ? ', ' + s.fromText + ': ' + formatDate(format, start, s) + (allDay ? '' : ', ' + startTime) : '';
    var endStr = !skipLabels && end ? ', ' + s.toText + ': ' + formatDate(format, end, s) + (allDay ? '' : ', ' + endTime) : '';
    var resourceStr = resource && resource.name ? ', ' + resource.name : '';
    return {
      allDay: allDay,
      allDayText: fillsAllDay ? allDayText : '',
      ariaLabel: title + resourceStr + startStr + endStr,
      color: color,
      currentResource: resource,
      date: +eventDay,
      end: eventEnd,
      endDate: end ? end : start ? new Date(start) : null,
      html: html,
      id: event.id,
      isMultiDay: isMultiDay,
      lastDay: !fillsAllDay && isMultiDay && isLastDay ? toText : '',
      original: event,
      position: {},
      resource: event.resource,
      slot: event.slot,
      start: eventStart,
      startDate: start,
      style: {
        background: color,
        color: colorEvent && color ? getTextColor(color) : ''
      },
      title: title,
      tooltip: s.showEventTooltip ? event.tooltip || tooltip : UNDEFINED,
      // uid will contain the start date as well in case of recurring events
      uid: event.occurrenceId ? event.occurrenceId : event.id
    };
  }
  /** @hidden */
  function prepareEvents(events) {
    var data = [];
    if (events) {
      for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
        var event_2 = events_1[_i];
        if (event_2.id === UNDEFINED) {
          event_2.id = getEventId();
        }
        data.push(event_2);
      }
    }
    return data;
  }
  /** @hidden */
  function checkInvalidCollision(s, invalids, valids, start, end, min, max, invalidateEvent, exclusiveEndDates) {
    if (invalidateEvent === 'start-end') {
      var invalidStart = isInvalid(s, start, invalids, valids, min, max);
      var invalidEnd = isInvalid(s, end, invalids, valids, min, max);
      if (invalidStart) {
        return invalidStart;
      }
      if (invalidEnd) {
        return invalidEnd;
      }
    } else {
      var until = exclusiveEndDates ? end : getDateOnly(addDays(end, 1));
      for (var d = getDateOnly(start); d < until; d.setDate(d.getDate() + 1)) {
        var invalid = isInvalid(s, d, invalids, valids, min, max);
        if (invalid) {
          return invalid;
        }
      }
    }
    return false;
  }

  // tslint:disable no-non-null-assertion
  var id = 0;
  function jsonp(url, callback) {
    // Check if we're in browser env
    if (win) {
      var script_1 = doc.createElement('script');
      var unique_1 = 'mbscjsonp' + ++id;
      win[unique_1] = function (data) {
        script_1.parentNode.removeChild(script_1);
        delete win[unique_1];
        if (!data) {
          return;
        }
        callback(data);
      };
      script_1.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + unique_1;
      doc.body.appendChild(script_1);
    }
  }
  function ajaxGet(url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        callback(JSON.parse(request.response));
      } // else {
      // We reached our target server, but it returned an error
      // }
    };
    request.onerror = function () {
      // There was a connection error of some sort
    };
    request.send();
  }
  /**
   * Load JSON-encoded data from a server using a GET HTTP request.
   * @param url URL to which the request is sent.
   * @param callback A function that is executed if the request succeeds.
   * @param type Type of the JSON request (json or jsonp)
   */
  function getJson(url, callback, type) {
    if (type === 'jsonp') {
      jsonp(url, callback);
    } else {
      ajaxGet(url, callback);
    }
  }
  var http = {
    getJson: getJson
  };
  util.http = http;

  // tslint:disable: no-use-before-declare
  var localTimezone;
  function normTimezone(timezone) {
    if (!localTimezone) {
      localTimezone = luxonTimezone.luxon.DateTime.local().zoneName;
    }
    return !timezone || timezone === 'local' ? localTimezone : timezone;
  }
  /**
   * Checks which version of luxon library is used, version 1 or 2+
   * @param DT
   * @returns 1 for version 1.x and 2 for versions above 2.0, depending on the DT.fromObject function
   */
  function getVersion(DT) {
    var fn = DT.fromObject.toString().trim();
    return /^(function )?\w*\(\w+\)/.test(fn) ? 1 : 2;
  }
  var LDate = /*#__PURE__*/ (function () {
    function LDate(value, timezone) {
      if (timezone === void 0) {
        timezone = 'utc';
      }
      // tslint:disable-next-line
      this._mbsc = true;
      timezone = normTimezone(timezone);
      var DT = luxonTimezone.luxon.DateTime;
      var zoneOpt = { zone: timezone };
      this.zone = timezone;
      if (isUndefined(value)) {
        this.dt = DT.utc().setZone(timezone);
      } else if (isDate(value) || isNumber(value)) {
        this.dt = DT.fromMillis(+value, zoneOpt);
      } else if (isString(value)) {
        this.dt = DT.fromISO(value, zoneOpt);
      } else if (isArray(value)) {
        var keys = ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond'];
        var valueObj = {};
        for (var i = 0; i < value.length && i < 7; i++) {
          valueObj[keys[i]] = value[i] + (i === 1 ? 1 : 0);
        }
        // In version 2+ of luxon, the options (the zone) should go into a second parameter.
        // To work with both version 1 and 2 we need to determin the version of luxon if not provided explicitly.
        luxonTimezone.version = luxonTimezone.version || getVersion(DT);
        if (luxonTimezone.version === 1) {
          // v1.x
          this.dt = DT.fromObject(__assign({}, valueObj, zoneOpt));
        } else {
          // v2+
          this.dt = DT.fromObject(valueObj, zoneOpt);
        }
      }
    }
    LDate.prototype.clone = function () {
      return new LDate(this, this.zone);
    };
    LDate.prototype.createDate = function (year, month, date, h, min, sec, ms) {
      return luxonTimezone.createDate({ displayTimezone: this.zone }, year, month, date, h, min, sec, ms);
    };
    LDate.prototype[Symbol.toPrimitive] = function (hint) {
      return this.dt.toJSDate()[Symbol.toPrimitive](hint);
    };
    LDate.prototype.toDateString = function () {
      return this.dt.toFormat('ccc MMM dd yyyy');
    };
    LDate.prototype.toISOString = function () {
      return this.dt.toISO();
    };
    LDate.prototype.toJSON = function () {
      return this.dt.toISO();
    };
    LDate.prototype.valueOf = function () {
      return this.dt.valueOf();
    };
    // Getters
    LDate.prototype.getDate = function () {
      return this.dt.day;
    };
    LDate.prototype.getDay = function () {
      return this.dt.weekday % 7;
    };
    LDate.prototype.getFullYear = function () {
      return this.dt.year;
    };
    LDate.prototype.getHours = function () {
      return this.dt.hour;
    };
    LDate.prototype.getMilliseconds = function () {
      return this.dt.millisecond;
    };
    LDate.prototype.getMinutes = function () {
      return this.dt.minute;
    };
    LDate.prototype.getMonth = function () {
      return this.dt.month - 1;
    };
    LDate.prototype.getSeconds = function () {
      return this.dt.second;
    };
    LDate.prototype.getTime = function () {
      return this.valueOf();
    };
    LDate.prototype.getTimezoneOffset = function () {
      return -this.dt.offset;
    };
    LDate.prototype.getUTCDate = function () {
      return this.dt.toUTC().day;
    };
    LDate.prototype.getUTCDay = function () {
      return this.dt.toUTC().weekday % 7;
    };
    LDate.prototype.getUTCFullYear = function () {
      return this.dt.toUTC().year;
    };
    LDate.prototype.getUTCHours = function () {
      return this.dt.toUTC().hour;
    };
    LDate.prototype.getUTCMilliseconds = function () {
      return this.dt.toUTC().millisecond;
    };
    LDate.prototype.getUTCMinutes = function () {
      return this.dt.toUTC().minute;
    };
    LDate.prototype.getUTCMonth = function () {
      return this.dt.toUTC().month - 1;
    };
    LDate.prototype.getUTCSeconds = function () {
      return this.dt.toUTC().second;
    };
    // Setters
    LDate.prototype.setMilliseconds = function (millisecond) {
      return this.setter({ millisecond: millisecond }).millisecond;
    };
    LDate.prototype.setSeconds = function (second, millisecond) {
      return this.setter({ second: second, millisecond: millisecond }).second;
    };
    LDate.prototype.setMinutes = function (minute, second, millisecond) {
      return this.setter({ minute: minute, second: second, millisecond: millisecond }).minute;
    };
    LDate.prototype.setHours = function (hour, minute, second, millisecond) {
      return this.setter({ hour: hour, minute: minute, second: second, millisecond: millisecond }).hour;
    };
    LDate.prototype.setDate = function (day) {
      return this.setter({ day: day }).day;
    };
    LDate.prototype.setMonth = function (month, day) {
      month++;
      return this.setter({ month: month, day: day }).month - 1;
    };
    LDate.prototype.setFullYear = function (year, month, day) {
      return this.setter({ year: year, month: month, day: day }).year;
    };
    LDate.prototype.setTime = function (time) {
      this.dt = luxonTimezone.luxon.DateTime.fromMillis(time);
      return this.dt.valueOf();
    };
    LDate.prototype.setTimezone = function (timezone) {
      timezone = normTimezone(timezone);
      this.zone = timezone;
      this.dt = this.dt.setZone(timezone);
    };
    // The correct implementations of the UTC methods are omitted for not using them currently
    // but because of the Date interface they must be present
    LDate.prototype.setUTCMilliseconds = function (ms) {
      return 0;
    };
    LDate.prototype.setUTCSeconds = function (sec, ms) {
      return 0;
    };
    LDate.prototype.setUTCMinutes = function (min, sec, ms) {
      return 0;
    };
    LDate.prototype.setUTCHours = function (hours, min, sec, ms) {
      return 0;
    };
    LDate.prototype.setUTCDate = function (date) {
      return 0;
    };
    LDate.prototype.setUTCMonth = function (month, date) {
      return 0;
    };
    LDate.prototype.setUTCFullYear = function (year, month, date) {
      return 0;
    };
    LDate.prototype.toUTCString = function () {
      return '';
    };
    LDate.prototype.toTimeString = function () {
      return '';
    };
    LDate.prototype.toLocaleDateString = function () {
      return '';
    };
    LDate.prototype.toLocaleTimeString = function () {
      return '';
    };
    LDate.prototype.setter = function (obj) {
      this.dt = this.dt.set(obj);
      return this.dt;
    };
    return LDate;
  })();
  var luxonTimezone = {
    luxon: UNDEFINED,
    version: UNDEFINED,
    parse: function (date, s) {
      return new LDate(date, s.dataTimezone || s.displayTimezone);
    },
    /**
     * Supports two call signatures:
     * createDate(settings, dateObj|timestamp)
     * createDate(settings, year, month, date, hour, min, sec)
     * @returns IDate object
     */
    createDate: function (s, year, month, day, hour, minute, second, millisecond) {
      var displayTimezone = s.displayTimezone;
      if (isObject(year) || isString(year) || isUndefined(month)) {
        return new LDate(year, displayTimezone);
      }
      return new LDate([year || 1970, month || 0, day || 1, hour || 0, minute || 0, second || 0, millisecond || 0], displayTimezone);
    }
  };

  // tslint:disable: no-use-before-declare
  function normTimezone$1(timezone) {
    return !timezone || timezone === 'local' ? momentTimezone.moment.tz.guess() : timezone;
  }
  var MDate = /*#__PURE__*/ (function () {
    function MDate(value, timezone) {
      // tslint:disable-next-line
      this._mbsc = true;
      this.timezone = normTimezone$1(timezone);
      this.init(value);
    }
    MDate.prototype.clone = function () {
      return new MDate(this, this.timezone);
    };
    MDate.prototype.createDate = function (year, month, date, h, min, sec, ms) {
      return momentTimezone.createDate({ displayTimezone: this.timezone }, year, month, date, h, min, sec, ms);
    };
    MDate.prototype[Symbol.toPrimitive] = function (hint) {
      return this.m.toDate()[Symbol.toPrimitive](hint);
    };
    MDate.prototype.toDateString = function () {
      return this.m.format('ddd MMM DD YYYY');
    };
    MDate.prototype.toISOString = function () {
      return this.m.toISOString(true);
    };
    MDate.prototype.toJSON = function () {
      return this.m.toISOString();
    };
    MDate.prototype.valueOf = function () {
      return this.m.valueOf();
    };
    // Getters
    MDate.prototype.getDate = function () {
      return this.m.date();
    };
    MDate.prototype.getDay = function () {
      return this.m.day();
    };
    MDate.prototype.getFullYear = function () {
      return this.m.year();
    };
    MDate.prototype.getHours = function () {
      return this.m.hours();
    };
    MDate.prototype.getMilliseconds = function () {
      return this.m.milliseconds();
    };
    MDate.prototype.getMinutes = function () {
      return this.m.minutes();
    };
    MDate.prototype.getMonth = function () {
      return this.m.month();
    };
    MDate.prototype.getSeconds = function () {
      return this.m.seconds();
    };
    MDate.prototype.getTime = function () {
      return this.m.valueOf();
    };
    MDate.prototype.getTimezoneOffset = function () {
      return -this.m.utcOffset();
    };
    MDate.prototype.getUTCDate = function () {
      return this.utc().date();
    };
    MDate.prototype.getUTCDay = function () {
      return this.utc().day();
    };
    MDate.prototype.getUTCFullYear = function () {
      return this.utc().year();
    };
    MDate.prototype.getUTCHours = function () {
      return this.utc().hours();
    };
    MDate.prototype.getUTCMilliseconds = function () {
      return this.utc().milliseconds();
    };
    MDate.prototype.getUTCMinutes = function () {
      return this.utc().minutes();
    };
    MDate.prototype.getUTCMonth = function () {
      return this.utc().month();
    };
    MDate.prototype.getUTCSeconds = function () {
      return this.utc().seconds();
    };
    // Setters
    MDate.prototype.setMilliseconds = function (ms) {
      return this.m.set({ millisecond: ms }).milliseconds();
    };
    MDate.prototype.setSeconds = function (sec, ms) {
      return this.m.set({ seconds: sec, milliseconds: ms }).seconds();
    };
    MDate.prototype.setMinutes = function (min, sec, ms) {
      return this.m.set({ minutes: min, seconds: sec, milliseconds: ms }).minutes();
    };
    MDate.prototype.setHours = function (hours, min, sec, ms) {
      return this.m.set({ hours: hours, minutes: min, seconds: sec, milliseconds: ms }).hours();
    };
    MDate.prototype.setDate = function (date) {
      return this.m.set({ date: date }).date();
    };
    MDate.prototype.setMonth = function (month, date) {
      return this.m.set({ month: month, date: date }).month();
    };
    MDate.prototype.setFullYear = function (year, month, date) {
      return this.m.set({ year: year, month: month, date: date }).year();
    };
    MDate.prototype.setTime = function (time) {
      this.init(time);
      return this.m.valueOf();
    };
    MDate.prototype.setTimezone = function (timezone) {
      this.timezone = normTimezone$1(timezone);
      this.m.tz(this.timezone);
    };
    // The original implementations of the UTC methods are commented out below for not using them currently
    // but because of the Date interface they must be present
    MDate.prototype.setUTCMilliseconds = function (ms) {
      return 0;
    };
    MDate.prototype.setUTCSeconds = function (sec, ms) {
      return 0;
    };
    MDate.prototype.setUTCMinutes = function (min, sec, ms) {
      return 0;
    };
    MDate.prototype.setUTCHours = function (hours, min, sec, ms) {
      return 0;
    };
    MDate.prototype.setUTCDate = function (date) {
      return 0;
    };
    MDate.prototype.setUTCMonth = function (month, date) {
      return 0;
    };
    MDate.prototype.setUTCFullYear = function (year, month, date) {
      return 0;
    };
    MDate.prototype.toUTCString = function () {
      return '';
    };
    MDate.prototype.toTimeString = function () {
      return '';
    };
    MDate.prototype.toLocaleDateString = function () {
      return '';
    };
    MDate.prototype.toLocaleTimeString = function () {
      return '';
    };
    // public setUTCMilliseconds(ms: number) { return this.setter({ millisecond: ms }, true).milliseconds(); }
    // public setUTCSeconds(sec: number, ms?: number) { return this.setter({ seconds: sec, milliseconds: ms }, true).seconds(); }
    // public setUTCMinutes(min: number, sec?: number, ms?: number) {
    //   return this.setter({ minutes: min, seconds: sec, milliseconds: ms }, true).minutes();
    // }
    // public setUTCHours(hours: number, min?: number, sec?: number, ms?: number) {
    //   return this.setter({ hours, minutes: min, seconds: sec, milliseconds: ms }, true).hours();
    // }
    // public setUTCDate(date: number) { return this.setter({ date }, true).date(); }
    // public setUTCMonth(month: number, date?: number) { return this.setter({ month, date }, true).month(); }
    // public setUTCFullYear(year: number, month?: number, date?: number) { return this.setter({ year, month, date }, true).year(); }
    // public toUTCString() { throw new Error('not implemented'); return ''; }
    // public toTimeString() { throw new Error('not implemented'); return ''; }
    // public toLocaleDateString() { throw new Error('not implemented'); return ''; }
    // public toLocaleTimeString() { throw new Error('not implemented'); return ''; }
    MDate.prototype.init = function (input) {
      var tz = momentTimezone.moment.tz;
      var normInput = isUndefined(input) || isString(input) || isNumber(input) || isArray(input) ? input : +input;
      var isTime = isString(input) && ISO_8601_TIME.test(input);
      this.m = isTime ? tz(normInput, 'HH:mm:ss', this.timezone) : tz(normInput, this.timezone);
    };
    MDate.prototype.utc = function () {
      return this.m.clone().utc();
    };
    return MDate;
  })();
  var momentTimezone = {
    // ...timezonePluginBase,
    moment: UNDEFINED,
    parse: function (date, s) {
      return new MDate(date, s.dataTimezone || s.displayTimezone);
    },
    /**
     * Supports two call signatures:
     * createDate(settings, dateObj|timestamp)
     * createDate(settings, year, month, date, hour, min, sec)
     * @returns IDate object
     */
    createDate: function (s, year, month, date, h, min, sec, ms) {
      var displayTimezone = s.displayTimezone;
      if (isObject(year) || isString(year) || isUndefined(month)) {
        return new MDate(year, displayTimezone);
      }
      return new MDate([year || 1970, month || 0, date || 1, h || 0, min || 0, sec || 0, ms || 0], displayTimezone);
    }
  };

  // tslint:disable no-non-null-assertion
  // tslint:disable no-inferrable-types
  // tslint:disable directive-class-suffix
  // tslint:disable directive-selector
  /** @hidden */
  var EventcalendarBase = /*#__PURE__*/ (function (_super) {
    __extends(EventcalendarBase, _super);
    function EventcalendarBase() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      // Initial state required by Vue
      _this.state = {
        activeDate: UNDEFINED,
        eventList: [],
        popoverList: [],
        selectedDate: UNDEFINED
      };
      _this.print = noop;
      /** @hidden */
      _this._navService = new MbscCalendarNavService();
      /** @hidden */
      _this._pageLoad = 0;
      /** @hidden */
      _this._selectedDates = {};
      /** @hidden */
      _this._shouldScrollSchedule = 0;
      /** @hidden */
      _this._update = 0;
      /** @hidden */
      _this._onScroll = throttle(function () {
        if (!_this._isListScrolling && !_this._viewChanged) {
          for (var timestamp in _this._listDays) {
            if (_this._listDays[timestamp]) {
              var day = _this._listDays[timestamp];
              var bottom = day.offsetTop + day.offsetHeight - _this._list.scrollTop;
              if (bottom > 0) {
                if (+timestamp !== _this._selected) {
                  _this._shouldSkipScroll = true;
                  _this.setState({
                    selectedDate: +timestamp
                  });
                  _this._selectedChange(new Date(+timestamp));
                }
                break;
              }
            }
          }
        }
      });
      _this._isListScrolling = 0;
      /** @hidden */
      _this._onWeekDayClick = function (d) {
        if (d !== _this._selected) {
          _this._skipScheduleScroll = true;
          _this.setState({ selectedDate: d });
          _this._selectedChange(new Date(d));
        }
      };
      /** @hidden */
      _this._onDayClick = function (args) {
        var date = args.date;
        var d = +date;
        var key = getDateStr(date);
        var state = _this.state;
        var events = sortEvents(_this._eventMap[key], _this.s.eventOrder);
        var showEventPopover = _this._showEventPopover;
        var computed =
          showEventPopover === UNDEFINED ? !_this._showEventLabels && !_this._showEventList && !_this._showSchedule : showEventPopover;
        var showMore = showEventPopover !== false && _this._moreLabelClicked;
        var showPopover =
          (computed || showMore) && // Popover is enabled
          (!state.showPopover || (state.showPopover && d !== state.popoverDate)) && // Check if popover is already opened for the date
          events &&
          events.length > 0; // Has events
        args.events = events;
        if (!_this._isEventClick) {
          _this._resetSelection();
        }
        _this._navService.preventPageChange = !_this._showEventList;
        _this._hook('onCellClick', args);
        _this._moreLabelClicked = false;
        if (!args.disabled) {
          _this.setState({ selectedDate: d });
          if (d !== _this._selected) {
            _this._skipScheduleScroll = true;
            _this._selectedChange(date);
          }
        }
        if (showPopover) {
          // Wait for the popover to hide (if any)
          setTimeout(function () {
            _this._anchor = args.target;
            _this._popoverClass = _this._popoverClass.replace(' mbsc-popover-hidden', '');
            _this.setState({
              popoverDate: d,
              popoverList: events.map(function (event) {
                return _this._getEventData(event, date);
              }),
              showPopover: true
            });
          });
        }
        _this._isEventClick = false;
      };
      /** @hidden */
      _this._onActiveChange = function (args) {
        var d = _this._getValidDay(args.date, args.dir);
        // We set the active date in the state as well, to trigger re-render
        // Note: we cannot use the state only, because the active date will be updated when the selected date changes,
        // but we don't want an extra setState call on selected date change
        var newState = {
          activeDate: d
        };
        _this._active = d;
        _this._update++; // Force update in case of Angular, if active date is the same as previous active date
        _this._skipScheduleScroll = args.pageChange && !args.nav;
        // If page is changed or today button is clicked, also update the selected date
        if (args.pageChange || args.today) {
          newState.selectedDate = d;
          _this._selectedChange(new Date(d));
          _this._navService.forcePageChange = true;
        }
        _this.setState(newState);
      };
      /** @hidden */
      _this._onGestureStart = function (args) {
        _this._hidePopover();
      };
      /** @hidden */
      _this._onDayDoubleClick = function (args) {
        _this._dayClick('onCellDoubleClick', args);
      };
      /** @hidden */
      _this._onDayRightClick = function (args) {
        _this._dayClick('onCellRightClick', args);
      };
      /** @hidden */
      _this._onCellHoverIn = function (args) {
        args.events = _this._eventMap[getDateStr(args.date)];
        _this._hook('onCellHoverIn', args);
      };
      /** @hidden */
      _this._onCellHoverOut = function (args) {
        args.events = _this._eventMap[getDateStr(args.date)];
        _this._hook('onCellHoverOut', args);
      };
      /** @hidden */
      _this._onEventHoverIn = function (args) {
        _this._hoverTimer = setTimeout(function () {
          _this._isHover = true;
          _this._eventClick('onEventHoverIn', args);
        }, 150);
      };
      /** @hidden */
      _this._onEventHoverOut = function (args) {
        clearTimeout(_this._hoverTimer);
        if (_this._isHover) {
          _this._isHover = false;
          _this._eventClick('onEventHoverOut', args);
        }
      };
      /** @hidden */
      _this._onEventClick = function (args) {
        var s = _this.s;
        _this._handleMultipleSelect(args);
        var close = _this._eventClick('onEventClick', args);
        if (
          close !== false &&
          !(s.selectMultipleEvents || s.eventDelete || ((s.dragToCreate || s.clickToCreate) && s.eventDelete !== false))
        ) {
          _this._hidePopover();
        }
      };
      /** @hidden */
      _this._onEventDoubleClick = function (args) {
        _this._eventClick('onEventDoubleClick', args);
      };
      /** @hidden */
      _this._onEventRightClick = function (args) {
        _this._eventClick('onEventRightClick', args);
      };
      /** @hidden */
      _this._onEventDragEnd = function (args) {
        _this._hook('onEventDragEnd', args);
      };
      /** @hidden */
      _this._onEventDragStart = function (args) {
        _this._hook('onEventDragStart', args);
      };
      /** @hidden */
      _this._onLabelHoverIn = function (args) {
        _this._hoverTimer = setTimeout(function () {
          _this._isHover = true;
          _this._labelClick('onEventHoverIn', args);
        }, 150);
      };
      /** @hidden */
      _this._onLabelHoverOut = function (args) {
        clearTimeout(_this._hoverTimer);
        if (_this._isHover) {
          _this._isHover = false;
          _this._labelClick('onEventHoverOut', args);
        }
      };
      /** @hidden */
      _this._onLabelClick = function (args) {
        _this._handleMultipleSelect(args);
        _this._hook('onLabelClick', args);
        _this._labelClick('onEventClick', args);
        _this._isEventClick = true;
        if (!args.label) {
          _this._moreLabelClicked = true;
        }
      };
      /** @hidden */
      _this._onLabelDoubleClick = function (args) {
        _this._labelClick('onEventDoubleClick', args);
      };
      /** @hidden */
      _this._onLabelRightClick = function (args) {
        _this._labelClick('onEventRightClick', args);
      };
      /** @hidden */
      _this._onCellClick = function (args) {
        _this._resetSelection();
        _this._cellClick('onCellClick', args);
      };
      /** @hidden */
      _this._onCellDoubleClick = function (args) {
        _this._cellClick('onCellDoubleClick', args);
      };
      /** @hidden */
      _this._onCellRightClick = function (args) {
        _this._cellClick('onCellRightClick', args);
      };
      /** @hidden */
      _this._onPageChange = function (args) {
        // Next cycle
        setTimeout(function () {
          _this._hidePopover();
        });
        _this._isPageChange = true;
        _this._hook('onPageChange', args);
      };
      /** @hidden */
      _this._onPageLoading = function (args) {
        var s = _this.s;
        var eventMap = getEventMap(_this._events, args.viewStart, args.viewEnd, s);
        _this._colorsMap = getEventMap(s.colors, args.viewStart, args.viewEnd, s);
        _this._invalidsMap = getEventMap(s.invalid, args.viewStart, args.viewEnd, s, true);
        _this._validsMap = getEventMap(s.valid, args.viewStart, args.viewEnd, s, true);
        _this._eventMap = eventMap;
        _this._firstDay = getFirstDayOfWeek(args.firstDay, s, _this._firstWeekDay);
        _this._lastDay = args.lastDay;
        _this._labelsMap = _this._marksMap = UNDEFINED;
        if (!s.labels && (_this._showEventLabels || _this._showEventCount)) {
          _this._labelsMap = eventMap;
        } else if (!s.marked) {
          _this._marksMap = eventMap;
        }
        if (args.viewChanged) {
          _this._hook('onPageLoading', args);
        }
      };
      /** @hidden */
      _this._onPageLoaded = function (args) {
        _this._shouldAnimateScroll = _this._isPageChange;
        _this._isPageChange = false;
        var viewType = _this._eventListType;
        // Generate event list
        if (_this._showEventList && !(_this._showCalendar && viewType === 'day')) {
          var s = _this.s;
          var month = args.month;
          var isMonthList = _this._showEventList && month && viewType === 'month';
          var firstDay = isMonthList ? month : args.firstDay;
          var lastDay = isMonthList ? s.getDate(s.getYear(month), s.getMonth(month) + _this._eventListSize, 1) : args.lastDay;
          _this._setEventList(firstDay, lastDay);
        }
        _this._hook('onPageLoaded', args);
      };
      /** @hidden */
      _this._onPopoverClose = function () {
        _this._hidePopover();
      };
      /** @hidden */
      _this._onResize = function (ev) {
        var isListScrollable;
        if (_this._showEventList && isBrowser) {
          // Calculate the available height for the event list
          var cal = ev.target;
          var height = cal.offsetHeight;
          var calTop = cal.getBoundingClientRect().top;
          var listTop = _this._list.getBoundingClientRect().top;
          isListScrollable = height - listTop + calTop > 170;
        }
        _this.setState({ height: ev.height, isListScrollable: isListScrollable, width: ev.width });
      };
      /** @hidden */
      _this._onSelectedEventsChange = function (events) {
        _this._emit('selectedEventsChange', events); // needed for the two-way binding to work (copied from _selectedChange)
        _this._hook('onSelectedEventsChange', { events: events });
      };
      //#region Drag & Drop
      /** @hidden */
      _this._getDragDates = function (start, end, event) {
        var draggedDates = {};
        var firstWeekDay = _this._firstWeekDay;
        var endDate = getEndDate(_this.s, event.allDay, start, end, true);
        var until = getDateOnly(addDays(endDate, 1));
        for (var d = getDateOnly(start); d < until; d.setDate(d.getDate() + 1)) {
          var weekDay = d.getDay();
          var offset = firstWeekDay - weekDay > 0 ? 7 : 0;
          if (isSameDay(start, d) || weekDay === firstWeekDay) {
            draggedDates[getDateStr(d)] = {
              event: event,
              width: Math.min(getDayDiff(d, endDate) + 1, 7 + firstWeekDay - weekDay - offset) * 100
            };
          } else {
            draggedDates[getDateStr(d)] = {};
          }
        }
        return draggedDates;
      };
      _this._onLabelUpdateModeOn = function (args) {
        var event = args.create ? _this._tempEvent : args.data;
        if (event) {
          var start = makeDate(event.start);
          var end = makeDate(event.end || start);
          _this.setState({
            isTouchDrag: true,
            labelDragData: {
              draggedEvent: event,
              originDates: args.external ? UNDEFINED : _this._getDragDates(start, end, event)
            }
          });
        }
      };
      _this._onLabelUpdateModeOff = function (args) {
        var event = args.create ? _this._tempEvent : args.data;
        _this._hook('onEventDragEnd', {
          domEvent: args.domEvent,
          event: event,
          source: 'calendar'
        });
        _this.setState({
          isTouchDrag: false,
          labelDragData: UNDEFINED
        });
      };
      _this._onLabelUpdateStart = function (args) {
        var s = _this.s;
        var el = _this._el;
        var weekNumWidth = _this._showWeekNumbers ? el.querySelector('.mbsc-calendar-week-nr').getBoundingClientRect().width : 0;
        var slide =
          el.querySelectorAll('.mbsc-calendar-slide')[_this._calendarLabelList === 'all' || isNumeric(_this._calendarLabelList) ? 0 : 1];
        var slideRect = slide.getBoundingClientRect();
        var weeksCont = el.querySelector('.mbsc-calendar-week-days');
        var rows = slide.querySelectorAll('.mbsc-calendar-row');
        var isClick = /click/.test(args.domEvent.type);
        _this._areaTop = 0;
        if (weeksCont) {
          var weeksRect = weeksCont.getBoundingClientRect();
          _this._areaTop = weeksRect.top + weeksRect.height;
        }
        _this._areaLeft = slideRect.left + (s.rtl ? 0 : weekNumWidth);
        _this._areaBottom = slideRect.top + slideRect.height;
        _this._areaRight = _this._areaLeft + slideRect.width - (s.rtl ? weekNumWidth : 0);
        _this._calCellWidth = (_this._areaRight - _this._areaLeft) / 7;
        var newWeek = 0;
        _this._rowTops = [];
        rows.forEach(function (r, i) {
          var rowTop = r.getBoundingClientRect().top - _this._areaTop;
          _this._rowTops.push(rowTop);
          if (args.endY - _this._areaTop > rowTop) {
            newWeek = i;
          }
        });
        if (args.create) {
          var newDay = floor((s.rtl ? _this._areaRight - args.endX : args.endX - _this._areaLeft) / _this._calCellWidth);
          var newStartDay = addDays(_this._firstDay, newWeek * 7 + newDay);
          var newStart = new Date(newStartDay.getFullYear(), newStartDay.getMonth(), newStartDay.getDate());
          var nextDay = addDays(newStart, 1);
          var newEnd = s.exclusiveEndDates ? nextDay : new Date(+nextDay - 1);
          var eventData = s.extendDefaultEvent ? s.extendDefaultEvent({ start: newStart }) : UNDEFINED;
          _this._tempEvent = __assign(
            { allDay: true, end: newEnd, id: getEventId(), start: newStart, title: s.newEventText },
            args.event,
            eventData
          );
        }
        if (!isClick) {
          _this._hook('onEventDragStart', {
            domEvent: args.domEvent,
            event: args.create ? _this._tempEvent : args.data,
            source: 'calendar'
          });
        }
      };
      _this._onLabelUpdateMove = function (args) {
        var s = _this.s;
        var event = args.create ? _this._tempEvent : args.data;
        var tzOpt = event.allDay ? UNDEFINED : s;
        if (args.endY > _this._areaTop && args.endY < _this._areaBottom && args.endX > _this._areaLeft && args.endX < _this._areaRight) {
          var labelDragData = _this.state.labelDragData;
          var newDay = floor((s.rtl ? _this._areaRight - args.endX : args.endX - _this._areaLeft) / _this._calCellWidth);
          var oldDay = floor((s.rtl ? _this._areaRight - args.startX : args.startX - _this._areaLeft) / _this._calCellWidth);
          var newWeek_1 = 0;
          var oldWeek_1 = 0;
          _this._rowTops.forEach(function (rowTop, i) {
            if (args.startY - _this._areaTop > rowTop) {
              oldWeek_1 = i;
            }
            if (args.endY - _this._areaTop > rowTop) {
              newWeek_1 = i;
            }
          });
          var dayDelta = (newWeek_1 - oldWeek_1) * 7 + (newDay - oldDay);
          if (newDay !== _this._tempDay || newWeek_1 !== _this._tempWeek) {
            var start = makeDate(event.start, tzOpt);
            var end = makeDate(event.end, tzOpt) || start;
            var draggedEvent = __assign({}, event);
            var newStart = start;
            var newEnd = end;
            if (args.external) {
              var ms = getDayMilliseconds(start);
              var duration = +end - +start;
              newStart = createDate(s, +addDays(_this._firstDay, newWeek_1 * 7 + newDay) + ms);
              newEnd = createDate(s, +newStart + duration);
            } else if (args.drag) {
              // Drag
              newStart = addDays(start, dayDelta);
              newEnd = addDays(end, dayDelta);
            } else {
              // Resize, create
              var rtl = s.rtl ? -1 : 1;
              var endResize = args.create ? (newWeek_1 === oldWeek_1 ? args.deltaX * rtl > 0 : dayDelta > 0) : args.direction === 'end';
              var days = getDayDiff(start, end);
              if (endResize) {
                newEnd = addDays(end, Math.max(-days, dayDelta));
              } else {
                newStart = addDays(start, Math.min(days, dayDelta));
              }
              // Don't allow end date before start date when resizing
              if (newEnd < newStart) {
                if (endResize) {
                  newEnd = createDate(tzOpt, newStart);
                } else {
                  newStart = createDate(tzOpt, newEnd);
                }
              }
            }
            draggedEvent.start = newStart;
            draggedEvent.end = newEnd;
            if (!/mbsc-popover-hidden/.test(_this._popoverClass)) {
              _this._popoverClass = _this._popoverClass + ' mbsc-popover-hidden';
            }
            _this.setState({
              labelDragData: {
                draggedDates: _this._getDragDates(newStart, newEnd, draggedEvent),
                draggedEvent: draggedEvent,
                originDates: labelDragData && labelDragData.originDates
              }
            });
            _this._tempDay = newDay;
            _this._tempWeek = newWeek_1;
          }
        }
      };
      _this._onLabelUpdateEnd = function (args) {
        var state = _this.state;
        var isCreating = args.create;
        var dragData = state.labelDragData || {};
        var event = isCreating ? _this._tempEvent : args.data;
        var draggedEvent = dragData.draggedEvent || event;
        var origStart = makeDate(event.start);
        var origEnd = makeDate(event.end);
        var newStart = makeDate(draggedEvent.start);
        var newEnd = makeDate(draggedEvent.end);
        var changed = isCreating || +origStart !== +newStart || +origEnd !== +newEnd;
        var draggedEventData = {
          allDay: event.allDay,
          endDate: newEnd,
          original: event,
          startDate: newStart
        };
        var action = args.action || (dragData.draggedEvent ? 'drag' : 'click');
        var allowUpdate = changed
          ? _this._onEventDragStop({
              action: action,
              collision: checkInvalidCollision(
                _this.s,
                _this._invalidsMap,
                _this._validsMap,
                newStart,
                newEnd,
                _this._minDate,
                _this._maxDate,
                _this.s.invalidateEvent,
                _this.s.exclusiveEndDates
              ),
              create: isCreating,
              domEvent: args.domEvent,
              event: draggedEventData,
              source: 'calendar'
            })
          : true;
        var keepDragMode = state.isTouchDrag && (!isCreating || allowUpdate);
        if (!keepDragMode && action !== 'click') {
          _this._hook('onEventDragEnd', {
            domEvent: args.domEvent,
            event: event,
            source: 'calendar'
          });
        }
        _this.setState({
          isTouchDrag: keepDragMode,
          labelDragData: keepDragMode
            ? {
                draggedEvent: draggedEvent,
                originDates: allowUpdate ? _this._getDragDates(newStart, newEnd, draggedEventData.original) : dragData.originDates
              }
            : {}
        });
        if (args.drag) {
          _this._hidePopover();
        }
        _this._tempWeek = -1;
        _this._tempDay = -1;
      };
      _this._onEventDragStop = function (args) {
        var s = _this.s;
        var action = args.action;
        var resource = args.resource;
        var slot = args.slot;
        var invalidCollision = args.collision;
        var isCreating = args.create;
        var source = args.source;
        var draggedEvent = args.event;
        var event = draggedEvent.original;
        // In case of recurring event original refers to the occurrence,
        var originalEvent = event.recurring ? event.original : event;
        var oldEvent = __assign({}, originalEvent);
        var eventCopy = __assign({}, originalEvent);
        var origStart = convertTimezone(event.start, s);
        var start = convertTimezone(draggedEvent.startDate, s);
        var end = convertTimezone(draggedEvent.endDate, s);
        var allDay = draggedEvent.allDay;
        var isRecurring = eventCopy.recurring;
        if (isRecurring) {
          // add original start date to exceptions
          eventCopy.recurringException = getExceptionList(eventCopy.recurringException).concat([origStart]);
        } else {
          // Update the copy of the original event
          eventCopy.allDay = allDay;
          eventCopy.start = start;
          eventCopy.end = end;
          if (resource !== UNDEFINED) {
            eventCopy.resource = resource;
          }
          if (slot !== UNDEFINED) {
            eventCopy.slot = slot;
          }
        }
        var allowUpdate = false;
        var newEvent = isRecurring ? __assign({}, originalEvent) : originalEvent;
        if (isCreating || isRecurring) {
          if (isRecurring) {
            // remove recurring property
            delete newEvent.recurring;
          }
          if (isRecurring || newEvent.id === UNDEFINED) {
            newEvent.id = getEventId();
          }
          if (resource !== UNDEFINED) {
            newEvent.resource = resource;
          }
          if (slot !== UNDEFINED) {
            newEvent.slot = slot;
          }
          newEvent.start = start;
          newEvent.end = end;
          newEvent.allDay = allDay;
          allowUpdate =
            _this._hook(
              'onEventCreate',
              __assign({ action: action, domEvent: args.domEvent, event: newEvent, source: source }, isRecurring && { originEvent: event })
            ) !== false;
          if (invalidCollision !== false) {
            allowUpdate = false;
            _this._hook(
              'onEventCreateFailed',
              __assign(
                { action: action, event: newEvent, invalid: invalidCollision, source: source },
                isRecurring && { originEvent: event }
              )
            );
          }
        }
        if (!isCreating || isRecurring) {
          allowUpdate =
            _this._hook(
              'onEventUpdate',
              __assign(
                { domEvent: args.domEvent, event: eventCopy, oldEvent: oldEvent, source: source },
                isRecurring && { newEvent: newEvent, oldEventOccurrence: event }
              )
            ) !== false;
          if (invalidCollision !== false) {
            allowUpdate = false;
            _this._hook(
              'onEventUpdateFailed',
              __assign(
                { event: eventCopy, invalid: invalidCollision, oldEvent: oldEvent, source: source },
                isRecurring && { newEvent: newEvent, oldEventOccurrence: event }
              )
            );
          }
        }
        if (allowUpdate) {
          if (isCreating || isRecurring) {
            _this._events.push(newEvent);
            _this._triggerCreated = {
              action: action,
              event: newEvent,
              source: source
            };
          }
          if (!isCreating || isRecurring) {
            // Handle recurring event
            if (isRecurring) {
              draggedEvent.id = newEvent.id;
              draggedEvent.original = newEvent;
              originalEvent.recurringException = eventCopy.recurringException;
            } else {
              // Update the original event
              originalEvent.start = start;
              originalEvent.end = end;
              originalEvent.allDay = allDay;
              if (resource !== UNDEFINED) {
                originalEvent.resource = resource;
              }
              if (slot !== UNDEFINED) {
                originalEvent.slot = slot;
              }
            }
            _this._triggerUpdated = {
              event: originalEvent,
              oldEvent: oldEvent,
              source: source
            };
          }
          _this._refresh = true;
          if (source !== 'calendar') {
            _this.forceUpdate();
          }
        }
        return allowUpdate;
      };
      _this._onExternalDrag = function (args) {
        if (_this.s.externalDrop && _this._showCalendar) {
          switch (args.eventName) {
            case 'onDragModeOff':
              _this._onLabelUpdateModeOff(args);
              break;
            case 'onDragModeOn':
              _this._onLabelUpdateModeOn(args);
              break;
            case 'onDragStart':
              _this._onLabelUpdateStart(args);
              break;
            case 'onDragMove':
              var clone = args.clone;
              if (
                args.endY > _this._areaTop &&
                args.endY < _this._areaBottom &&
                args.endX > _this._areaLeft &&
                args.endX < _this._areaRight
              ) {
                clone.style.display = 'none';
                _this._onLabelUpdateMove(args);
                _this._onCalendar = true;
              } else if (_this._onCalendar) {
                clone.style.display = 'table';
                _this.setState({
                  labelDragData: {}
                });
                _this._tempWeek = -1;
                _this._tempDay = -1;
                _this._onCalendar = false;
              }
              break;
            case 'onDragEnd':
              // this is needed, otherwise it creates event on drag click
              if (
                !(
                  args.endY > _this._areaTop &&
                  args.endY < _this._areaBottom &&
                  args.endX > _this._areaLeft &&
                  args.endX < _this._areaRight
                )
              ) {
                _this.setState({
                  labelDragData: UNDEFINED
                });
                _this._hook('onEventDragEnd', {
                  domEvent: args.domEvent,
                  event: args.event,
                  source: 'calendar'
                });
              } else {
                _this._onLabelUpdateEnd(args);
              }
              break;
          }
        }
      };
      //#endregion Drag & drop
      /** @hidden */
      _this._onEventDelete = function (args) {
        var _a;
        var s = _this.s;
        if ((s.eventDelete === UNDEFINED && !s.dragToCreate && !s.clickToCreate) || s.eventDelete === false) {
          return;
        }
        var changed = false;
        var hasRecurring = false;
        var hasNonRecurring = false;
        var originalEvent;
        var oldEvent;
        var eventCopy;
        var event = args.event;
        var occurrence = event;
        var isMultiple = s.selectMultipleEvents;
        var selectedEventsMap = isMultiple ? _this._selectedEventsMap : ((_a = {}), (_a[event.id] = event), _a);
        var selectedEvents = toArray(selectedEventsMap);
        var oldEvents = [];
        var recurringEvents = [];
        var updatedEvents = [];
        var updatedEventsMap = {};
        var events = [];
        for (var _i = 0, selectedEvents_1 = selectedEvents; _i < selectedEvents_1.length; _i++) {
          var selectedEvent = selectedEvents_1[_i];
          if (selectedEvent.recurring) {
            occurrence = selectedEvent;
            originalEvent = selectedEvent.original;
            hasRecurring = true;
            var id = originalEvent.id;
            if (updatedEventsMap[id]) {
              eventCopy = updatedEventsMap[id];
            } else {
              oldEvent = __assign({}, originalEvent);
              eventCopy = __assign({}, originalEvent);
              recurringEvents.push(originalEvent);
              oldEvents.push(oldEvent);
              updatedEvents.push(eventCopy);
              updatedEventsMap[id] = eventCopy;
            }
            // add original start date to exceptions
            var origStart = convertTimezone(selectedEvent.start, s);
            eventCopy.recurringException = getExceptionList(eventCopy.recurringException).concat([origStart]);
          } else {
            hasNonRecurring = true;
            event = selectedEvent;
            events.push(selectedEvent);
          }
        }
        if (hasRecurring) {
          var allowUpdate =
            _this._hook('onEventUpdate', {
              domEvent: args.domEvent,
              event: eventCopy,
              events: isMultiple ? updatedEvents : UNDEFINED,
              isDelete: true,
              oldEvent: isMultiple ? UNDEFINED : oldEvent,
              oldEventOccurrence: occurrence,
              oldEvents: isMultiple ? oldEvents : UNDEFINED
            }) !== false;
          if (allowUpdate) {
            changed = true;
            for (var _b = 0, recurringEvents_1 = recurringEvents; _b < recurringEvents_1.length; _b++) {
              var recurringEvent = recurringEvents_1[_b];
              var updatedEvent = updatedEventsMap[recurringEvent.id];
              recurringEvent.recurringException = updatedEvent.recurringException;
            }
            _this._triggerUpdated = {
              event: originalEvent,
              events: isMultiple ? recurringEvents : UNDEFINED,
              oldEvent: isMultiple ? UNDEFINED : oldEvent,
              oldEvents: isMultiple ? oldEvents : UNDEFINED,
              source: args.source
            };
          }
        }
        if (hasNonRecurring) {
          var allowDelete =
            _this._hook('onEventDelete', {
              domEvent: args.domEvent,
              event: event,
              events: isMultiple ? events : UNDEFINED
            }) !== false;
          if (allowDelete) {
            changed = true;
            _this._events = _this._events.filter(function (e) {
              return !selectedEventsMap[e.id];
            });
            _this._selectedEventsMap = {};
            _this._triggerDeleted = {
              event: event,
              events: isMultiple ? events : UNDEFINED,
              source: args.source
            };
          }
        }
        if (changed) {
          _this._hidePopover();
          _this.refresh();
        }
      };
      // tslint:disable-next-line: variable-name
      _this._onKeyDown = function (ev) {
        if (ev.keyCode === TAB) {
          _this._resetSelection();
        }
      };
      return _this;
    }
    /**
     * Sets the events for the calendar.
     * @param events Array containing the events.
     */
    EventcalendarBase.prototype.addEvent = function (events) {
      // TODO: check if id exists already?
      var eventsToAdd = isArray(events) ? events : [events];
      var ids = [];
      var data = prepareEvents(eventsToAdd);
      for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var event_1 = data_1[_i];
        ids.push('' + event_1.id);
        this._events.push(event_1);
      }
      this.refresh();
      return ids;
    };
    /**
     * Returns the events between start/end.
     */
    EventcalendarBase.prototype.getEvents = function (start, end) {
      return getDataInRange(this._events, this.s, this._firstDay, this._lastDay, start, end);
    };
    /**
     * Returns the invalids between start/end.
     */
    EventcalendarBase.prototype.getInvalids = function (start, end) {
      return getDataInRange(this.s.invalid, this.s, this._firstDay, this._lastDay, start, end);
    };
    /**
     * Returns the selected events.
     */
    EventcalendarBase.prototype.getSelectedEvents = function () {
      return toArray(this._selectedEventsMap);
    };
    /**
     * Sets the events for the calendar.
     * @param events Array containing the events.
     */
    EventcalendarBase.prototype.setEvents = function (events) {
      var ids = [];
      var data = prepareEvents(events);
      for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
        var event_2 = data_2[_i];
        ids.push('' + event_2.id);
      }
      this._events = data;
      this.refresh();
      return ids;
    };
    /**
     * Set the selected events.
     */
    EventcalendarBase.prototype.setSelectedEvents = function (selectedEvents) {
      this._selectedEventsMap = (selectedEvents || []).reduce(function (map, ev) {
        if (ev.occurrenceId) {
          map[ev.occurrenceId] = ev;
        } else {
          map[ev.id] = ev;
        }
        return map;
      }, {});
      this.forceUpdate();
    };
    /**
     * Removes one or more events from the calendar.
     * @param events
     */
    EventcalendarBase.prototype.removeEvent = function (events) {
      var eventsToRemove = isArray(events) ? events : [events];
      var data = this._events;
      var len = data.length;
      for (var _i = 0, eventsToRemove_1 = eventsToRemove; _i < eventsToRemove_1.length; _i++) {
        var eventToRemove = eventsToRemove_1[_i];
        var found = false;
        var i = 0;
        while (!found && i < len) {
          var event_3 = data[i];
          if (event_3.id === eventToRemove || event_3.id === eventToRemove.id) {
            found = true;
            data.splice(i, 1);
          }
          i++;
        }
      }
      this.refresh();
    };
    /**
     * Navigates the calendar to the specified event.
     * @param event
     */
    EventcalendarBase.prototype.navigateToEvent = function (event) {
      this._navigateToEvent = event;
      this._shouldScrollSchedule++;
      this.navigate(event.start, true);
    };
    /**
     * Navigates the calendar to the specified date.
     * @param date
     */
    EventcalendarBase.prototype.navigate = function (date, animate) {
      var d = +makeDate(date);
      var changed = d !== this._selectedDateTime || this._navigateToEvent !== UNDEFINED;
      if (changed) {
        this._shouldAnimateScroll = !!animate;
      }
      if (this.s.selectedDate === UNDEFINED) {
        if ((this._showSchedule || this._showTimeline) && !changed) {
          // If we navigate to the already selected date, we should still force a scroll on the view
          this._shouldScrollSchedule++;
          this.forceUpdate();
        } else {
          this.setState({ selectedDate: d });
        }
      } else if (changed) {
        // In controlled mode just trigger a selected date change event
        this._selectedChange(date);
      }
    };
    /**
     * Updates one or more events in the calendar.
     * @param events
     */
    EventcalendarBase.prototype.updateEvent = function (events) {
      var eventsToUpdate = isArray(events) ? events : [events];
      var data = this._events;
      var len = data.length;
      for (var _i = 0, eventsToUpdate_1 = eventsToUpdate; _i < eventsToUpdate_1.length; _i++) {
        var eventToUpdate = eventsToUpdate_1[_i];
        var found = false;
        var i = 0;
        while (!found && i < len) {
          var event_4 = data[i];
          if (event_4.id === eventToUpdate.id) {
            found = true;
            data.splice(i, 1, __assign({}, eventToUpdate));
          }
          i++;
        }
      }
      this.refresh();
    };
    /**
     * Refreshes the view.
     */
    EventcalendarBase.prototype.refresh = function () {
      this._refresh = true;
      this.forceUpdate();
    };
    // tslint:enable variable-name
    // ---
    EventcalendarBase.prototype._render = function (s, state) {
      var _this = this;
      var prevProps = this._prevS;
      var showDate = this._showDate;
      var timezonesChanged = s.displayTimezone !== prevProps.displayTimezone || s.dataTimezone !== prevProps.dataTimezone;
      var renderList = false;
      var selected;
      var selectedDateTime;
      var selectedDate;
      this._colorEventList = s.eventTemplate !== UNDEFINED || s.renderEvent !== UNDEFINED ? false : s.colorEventList;
      // If we have display timezone set, default to exclusive end dates
      if (s.exclusiveEndDates === UNDEFINED) {
        s.exclusiveEndDates = !!s.displayTimezone;
      }
      if (!isEmpty(s.min)) {
        if (prevProps.min !== s.min) {
          this._minDate = +makeDate(s.min);
        }
      } else {
        this._minDate = -Infinity;
      }
      if (!isEmpty(s.max)) {
        if (prevProps.max !== s.max) {
          this._maxDate = +makeDate(s.max);
        }
      } else {
        this._maxDate = Infinity;
      }
      // Load selected date from prop or state
      if (s.selectedDate !== UNDEFINED) {
        selectedDateTime = +makeDate(s.selectedDate);
      } else {
        if (!this._defaultDate) {
          // Need to save the default date, otherwise if no default selected is specified, new Date will always create a later timestamp
          this._defaultDate = +(s.defaultSelectedDate !== UNDEFINED ? makeDate(s.defaultSelectedDate) : removeTimezone(createDate(s)));
        }
        selectedDateTime = state.selectedDate || this._defaultDate;
      }
      this.eventList = state.eventList;
      if (s.data !== prevProps.data) {
        this._events = prepareEvents(s.data);
        this._refresh = true;
      }
      if (s.invalid !== prevProps.invalid || s.colors !== prevProps.colors || timezonesChanged) {
        this._refresh = true;
      }
      // Process the view option
      if (s.view !== prevProps.view || s.firstDay !== prevProps.firstDay) {
        var firstDay = s.firstDay;
        var view = s.view || {};
        var agenda = view.agenda || {};
        var calendar = view.calendar || {};
        var schedule = view.schedule || {};
        var timeline = view.timeline || {};
        var eventListSize = +(agenda.size || 1);
        var eventListType = agenda.type || 'month';
        var scheduleSize = +(schedule.size || 1);
        var scheduleType = schedule.type || 'week';
        var scheduleStartDay = schedule.startDay !== UNDEFINED ? schedule.startDay : firstDay;
        var scheduleEndDay = schedule.endDay !== UNDEFINED ? schedule.endDay : (firstDay + 6) % 7;
        var scheduleStartTime = schedule.startTime;
        var scheduleEndTime = schedule.endTime;
        var scheduleTimeCellStep = schedule.timeCellStep || 60;
        var scheduleTimeLabelStep = schedule.timeLabelStep || 60;
        var scheduleTimezones = schedule.timezones;
        var showCalendar = !!view.calendar;
        var showEventCount = calendar.count;
        var showEventList = !!view.agenda;
        var showSchedule = !!view.schedule;
        var showScheduleDays =
          schedule.days !== UNDEFINED
            ? schedule.days
            : !showCalendar && showSchedule && !(scheduleType === 'day' && s.resources && s.resources.length > 0 && scheduleSize < 2);
        var showTimeline = !!view.timeline;
        var showTimelineWeekNumbers = timeline.weekNumbers;
        var timelineStartDay = timeline.startDay !== UNDEFINED ? timeline.startDay : firstDay;
        var timelineEndDay = timeline.endDay !== UNDEFINED ? timeline.endDay : (firstDay + 6) % 7;
        var timelineStartTime = timeline.startTime;
        var timelineEndTime = timeline.endTime;
        var hasSlots = showTimeline && !!s.slots && s.slots.length > 0;
        var timelineListing = timeline.eventList || hasSlots;
        var timelineSize = +(timeline.size || 1);
        var timelineType = timeline.type || 'week';
        var timelineStep = timelineType === 'month' || timelineType === 'year' || timelineListing ? 1440 : 60;
        var timelineTimeCellStep = hasSlots ? timelineStep : timeline.timeCellStep || timelineStep;
        var timelineTimeLabelStep = hasSlots ? timelineStep : timeline.timeLabelStep || timelineStep;
        var calendarType = calendar.type || 'month';
        var showEventLabels =
          calendar.labels !== UNDEFINED
            ? !!calendar.labels
            : !showEventList &&
              !showSchedule &&
              !showTimeline &&
              !s.marked &&
              !(calendarType === 'year' || (calendarType === 'month' && calendar.size));
        this._calendarScroll = calendar.scroll;
        this._calendarSize = calendar.size || 1;
        this._calendarLabelList = calendar.labels;
        this._calendarType = calendarType;
        this._showEventPopover = calendar.popover;
        this._showOuterDays = calendar.outerDays;
        this._showWeekNumbers = calendar.weekNumbers;
        this._popoverClass = calendar.popoverClass || '';
        this._showScheduleAllDay = schedule.allDay !== UNDEFINED ? schedule.allDay : true;
        if (
          eventListSize !== this._eventListSize ||
          eventListType !== this._eventListType ||
          showCalendar !== this._showCalendar ||
          showEventCount !== this._showEventCount ||
          showEventLabels !== this._showEventLabels ||
          showEventList !== this._showEventList ||
          scheduleSize !== this._scheduleSize ||
          scheduleType !== this._scheduleType ||
          showSchedule !== this._showSchedule ||
          showScheduleDays !== this._showScheduleDays ||
          scheduleStartDay !== this._scheduleStartDay ||
          scheduleEndDay !== this._scheduleEndDay ||
          scheduleStartTime !== this._scheduleStartTime ||
          scheduleEndTime !== this._scheduleEndTime ||
          scheduleTimeCellStep !== this._scheduleTimeCellStep ||
          scheduleTimeLabelStep !== this._scheduleTimeLabelStep ||
          showTimeline !== this._showTimeline ||
          timelineStartDay !== this._timelineStartDay ||
          timelineEndDay !== this._timelineEndDay ||
          timelineStartTime !== this._timelineStartTime ||
          timelineEndTime !== this._timelineEndTime ||
          timelineSize !== this._timelineSize ||
          timelineType !== this._timelineType ||
          timelineTimeCellStep !== this._timelineTimeCellStep ||
          timelineTimeLabelStep !== this._timelineTimeLabelStep ||
          timelineListing !== this._timelineListing
        ) {
          this._refresh = true;
        }
        this._eventListSize = eventListSize;
        this._eventListType = eventListType;
        this._scheduleType = scheduleType;
        this._showCalendar = showCalendar;
        this._showEventCount = showEventCount;
        this._showEventLabels = showEventLabels;
        this._showEventList = showEventList;
        this._showSchedule = showSchedule;
        this._showScheduleDays = showScheduleDays;
        this._scheduleStartDay = scheduleStartDay;
        this._scheduleEndDay = scheduleEndDay;
        this._scheduleStartTime = scheduleStartTime;
        this._scheduleEndTime = scheduleEndTime;
        this._scheduleSize = scheduleSize;
        this._scheduleTimeCellStep = scheduleTimeCellStep;
        this._scheduleTimeLabelStep = scheduleTimeLabelStep;
        this._scheduleTimezones = scheduleTimezones;
        this._showTimeline = showTimeline;
        this._showTimelineWeekNumbers = showTimelineWeekNumbers;
        this._timelineSize = timelineSize;
        this._timelineType = timelineType;
        this._timelineStartDay = timelineStartDay;
        this._timelineEndDay = timelineEndDay;
        this._timelineListing = timelineListing;
        this._timelineStartTime = timelineStartTime;
        this._timelineEndTime = timelineEndTime;
        this._timelineTimeCellStep = timelineTimeCellStep;
        this._timelineTimeLabelStep = timelineTimeLabelStep;
        this._timelineRowHeight = timeline.rowHeight;
        this._rangeType = showSchedule ? scheduleType : showTimeline ? timelineType : eventListType;
        this._rangeStartDay = showSchedule ? scheduleStartDay : showTimeline ? timelineStartDay : UNDEFINED;
        this._rangeEndDay = showSchedule ? scheduleEndDay : showTimeline ? timelineEndDay : UNDEFINED;
        this._firstWeekDay = showSchedule ? scheduleStartDay : showTimeline ? timelineStartDay : firstDay;
        this._viewChanged = true;
      }
      this._showDate =
        !this._showScheduleDays &&
        ((this._showSchedule && this._scheduleType === 'day') ||
          (this._showEventList && this._eventListType === 'day' && this._eventListSize < 2));
      // Check if page reload needed
      var lastPageLoad = this._pageLoad;
      if (this._refresh || s.locale !== prevProps.locale || s.theme !== prevProps.theme) {
        renderList = true;
        this._pageLoad++;
      }
      if (s.resources !== prevProps.resources) {
        this._resourcesMap = (s.resources || []).reduce(function (map, res) {
          map[res.id] = res;
          return map;
        }, {});
      }
      if (s.selectMultipleEvents) {
        if (s.selectedEvents !== prevProps.selectedEvents) {
          this._selectedEventsMap = (s.selectedEvents || []).reduce(function (map, ev) {
            if (ev.occurrenceId) {
              map[ev.occurrenceId] = ev;
            } else {
              map[ev.id] = ev;
            }
            return map;
          }, {});
        }
      }
      if (this._selectedEventsMap === UNDEFINED) {
        this._selectedEventsMap = {};
      }
      if (s.refDate !== prevProps.refDate) {
        this._refDate = makeDate(s.refDate);
      }
      if (!this._refDate && !this._showCalendar && (this._showSchedule || this._showTimeline)) {
        this._refDate = getDateOnly(new Date());
      }
      // Check if selected date & time changed
      if (selectedDateTime !== this._selectedDateTime || this._viewChanged) {
        var validated =
          this._showCalendar && (this._showSchedule || this._showTimeline || this._showEventList)
            ? +getClosestValidDate(new Date(selectedDateTime), s, this._minDate, this._maxDate, UNDEFINED, UNDEFINED, 1)
            : constrain(selectedDateTime, this._minDate, this._maxDate);
        // In day view (scheduler/timeline), if only certain week days are displayed,
        // we need to change the loaded day, if it's outside of the displayed week days.
        validated = this._getValidDay(validated);
        // Emit selected change event, if change happened.
        if (selectedDateTime !== validated) {
          selectedDateTime = validated;
          setTimeout(function () {
            _this._selectedChange(new Date(selectedDateTime));
          });
        }
        if (!this._skipScheduleScroll && selectedDateTime !== this._selectedDateTime) {
          this._shouldScrollSchedule++;
        }
        this._selectedDateTime = selectedDateTime;
      }
      selectedDate = getDateOnly(new Date(selectedDateTime));
      selected = +selectedDate;
      // Re-format selected date if displayed
      if (
        selected !== this._selected ||
        showDate !== this._showDate ||
        s.locale !== prevProps.locale ||
        prevProps.dateFormatLong !== s.dateFormatLong
      ) {
        this._selectedDateHeader = this._showDate ? formatDate(s.dateFormatLong, selectedDate, s) : '';
      }
      // Check if selected changed
      if (selected !== this._selected || s.dataTimezone !== prevProps.dataTimezone || s.displayTimezone !== prevProps.displayTimezone) {
        this._shouldScroll = !this._isPageChange && !this._shouldSkipScroll;
        this._shouldAnimateScroll = this._shouldAnimateScroll !== UNDEFINED ? this._shouldAnimateScroll : this._selected !== UNDEFINED;
        this._selected = selected;
        this._selectedDates = {};
        this._selectedDates[+addTimezone(s, new Date(selected))] = true;
        // If the selected date changes, update the active date as well
        this._active = selected;
        renderList = true;
      }
      if (
        renderList &&
        this._showCalendar &&
        (this._eventListType === 'day' || this._scheduleType === 'day' || this._timelineType === 'day')
      ) {
        this._setEventList(selectedDate, addDays(selectedDate, 1));
      }
      if (this._refresh && state.showPopover) {
        setTimeout(function () {
          _this._hidePopover();
        });
      }
      this._refresh = false;
      this._cssClass =
        this._className +
        ' mbsc-eventcalendar' +
        (this._showEventList ? ' mbsc-eventcalendar-agenda' : '') +
        (this._showSchedule ? ' mbsc-eventcalendar-schedule' : '') +
        (this._showTimeline ? ' mbsc-eventcalendar-timeline' : '');
      this._navService.options(
        {
          activeDate: this._active,
          calendarType: this._calendarType,
          endDay: this._showSchedule ? this._scheduleEndDay : this._showTimeline ? this._timelineEndDay : this._rangeEndDay,
          eventRange: this._rangeType,
          eventRangeSize: this._showSchedule ? this._scheduleSize : this._showTimeline ? this._timelineSize : this._eventListSize,
          firstDay: s.firstDay,
          getDate: s.getDate,
          getDay: s.getDay,
          getMonth: s.getMonth,
          getYear: s.getYear,
          max: s.max,
          min: s.min,
          onPageChange: this._onPageChange,
          onPageLoading: this._onPageLoading,
          refDate: this._refDate,
          showCalendar: this._showCalendar,
          showOuterDays: this._showOuterDays,
          size: this._calendarSize,
          startDay: this._rangeStartDay,
          weeks: this._calendarSize
        },
        this._pageLoad !== lastPageLoad
      );
    };
    EventcalendarBase.prototype._mounted = function () {
      this._unsubscribe = subscribeExternalDrag(this._onExternalDrag);
      listen(this._el, KEY_DOWN, this._onKeyDown);
    };
    EventcalendarBase.prototype._updated = function () {
      var _this = this;
      // Scroll to selected date in the list
      if (this._shouldScroll && this.state.isListScrollable) {
        this._scrollToDay();
        this._shouldScroll = false;
        this._shouldAnimateScroll = UNDEFINED;
      }
      if (this._shouldLoadDays) {
        // In case of custom event listing in jQuery and plain js we need to find
        // the day containers and store them, this is needed to scroll the event list
        // to the selected day, when a day is clicked
        this._shouldLoadDays = false;
        forEach(this._list.querySelectorAll('[mbsc-timestamp]'), function (listItem) {
          _this._listDays[listItem.getAttribute('mbsc-timestamp')] = listItem;
        });
      }
      if (this._shouldEnhance) {
        this._shouldEnhance = this._shouldEnhance === 'popover' ? this._popoverList : this._list;
      }
      if (this._triggerCreated) {
        var created = this._triggerCreated;
        var target =
          created.source === 'calendar'
            ? this._calendarView._body.querySelector('.mbsc-calendar-table-active .mbsc-calendar-text[data-id="' + created.event.id + '"]')
            : this._el.querySelector('.mbsc-schedule-event[data-id="' + created.event.id + '"]');
        this._hook('onEventCreated', __assign({}, this._triggerCreated, { target: target }));
        this._triggerCreated = null;
      }
      if (this._triggerUpdated) {
        var updated = this._triggerUpdated;
        var target =
          updated.source === 'calendar'
            ? this._calendarView._body.querySelector('.mbsc-calendar-table-active .mbsc-calendar-text[data-id="' + updated.event.id + '"]')
            : this._el.querySelector('.mbsc-schedule-event[data-id="' + updated.event.id + '"]');
        this._hook('onEventUpdated', __assign({}, this._triggerUpdated, { target: target }));
        this._triggerUpdated = null;
      }
      if (this._triggerDeleted) {
        this._hook('onEventDeleted', __assign({}, this._triggerDeleted));
        this._triggerDeleted = null;
      }
      if (this._viewChanged) {
        // setTimeout needed because the scroll event will fire later
        setTimeout(function () {
          _this._viewChanged = false;
        }, 10);
      }
      if (this._shouldSkipScroll) {
        setTimeout(function () {
          _this._shouldSkipScroll = false;
        });
      }
      this._skipScheduleScroll = false;
      this._navigateToEvent = UNDEFINED;
    };
    EventcalendarBase.prototype._destroy = function () {
      unsubscribeExternalDrag(this._unsubscribe);
      unlisten(this._el, KEY_DOWN, this._onKeyDown);
    };
    EventcalendarBase.prototype._resetSelection = function () {
      // reset selected events if there are any selected
      if (this.s.selectMultipleEvents && Object.keys(this._selectedEventsMap).length > 0) {
        this._selectedEventsMap = {};
        this._onSelectedEventsChange([]);
        this.forceUpdate();
      }
    };
    EventcalendarBase.prototype._getAgendaEvents = function (firstDay, lastDay, eventMap) {
      var _this = this;
      var events = [];
      var s = this.s;
      if (eventMap && this._showEventList) {
        var _loop_1 = function (d) {
          var eventsForDay = eventMap[getDateStr(d)];
          if (eventsForDay && eventsForDay.length) {
            var sorted = sortEvents(eventsForDay, s.eventOrder);
            events.push({
              date: formatDate(s.dateFormatLong, d, s),
              events: sorted.map(function (event) {
                return _this._getEventData(event, d);
              }),
              timestamp: +d
            });
          }
        };
        for (var d = getDateOnly(firstDay); d < lastDay; d.setDate(d.getDate() + 1)) {
          _loop_1(d);
        }
      }
      return events;
    };
    EventcalendarBase.prototype._getEventData = function (event, d) {
      var s = this.s;
      var res;
      if (!event.color && event.resource) {
        var resItem = isArray(event.resource) ? event.resource : [event.resource];
        res = (this._resourcesMap || {})[resItem[0]];
      }
      var ev = getEventData(s, event, d, this._colorEventList, s.timeFormat, s.allDayText, s.toText, res, true);
      ev.html = this._safeHtml(ev.html);
      return ev;
    };
    /**
     * Returns the timestamp of the closest day which falls between the specified start and end weekdays.
     * @param timestamp The timestamp of the date to validate.
     * @param dir Navigation direction. If not specified, it will return the next valid day, otherwise the next or prev, based on direction.
     */
    EventcalendarBase.prototype._getValidDay = function (timestamp, dir) {
      if (dir === void 0) {
        dir = 1;
      }
      var startDay = this._rangeStartDay;
      var endDay = this._rangeEndDay;
      if (!this._showCalendar && this._rangeType === 'day' && startDay !== UNDEFINED && endDay !== UNDEFINED) {
        var date = new Date(timestamp);
        var day = date.getDay();
        var diff = 0;
        // Case 1: endDay < startDay, e.g. Friday -> Monday (5-1)
        // Case 2: endDay >= startDay, e.g. Tuesday -> Friday (2-5)
        if (endDay < startDay ? day > endDay && day < startDay : day > endDay || day < startDay) {
          // If navigating backwards, we go to end day, otherwise to start day
          diff = dir < 0 ? endDay - day : startDay - day;
        }
        if (diff) {
          diff += dir < 0 ? (diff > 0 ? -7 : 0) : diff < 0 ? 7 : 0;
          return +addDays(date, diff);
        }
      }
      return timestamp;
    };
    EventcalendarBase.prototype._setEventList = function (firstDay, lastDay) {
      var _this = this;
      setTimeout(function () {
        _this._eventListHTML = UNDEFINED;
        _this._shouldScroll = true;
        _this._listDays = null;
        _this._scrollToDay(0);
        _this.setState({
          eventList: _this._getAgendaEvents(firstDay, lastDay, _this._eventMap)
        });
      });
    };
    EventcalendarBase.prototype._hidePopover = function () {
      if (this.state.showPopover) {
        this.setState({
          showPopover: false
        });
      }
    };
    EventcalendarBase.prototype._scrollToDay = function (pos) {
      var _this = this;
      if (this._list) {
        var to = pos;
        var animate = void 0;
        if (pos === UNDEFINED && this._listDays) {
          var day = this._listDays[this._selected];
          var eventId = this._navigateToEvent && this._navigateToEvent.id;
          if (day) {
            if (eventId !== UNDEFINED) {
              var event_5 = day.querySelector('.mbsc-event[data-id="' + eventId + '"]');
              var dayHeader = day.querySelector('.mbsc-event-day');
              if (event_5) {
                to = event_5.offsetTop - (dayHeader ? dayHeader.offsetHeight : 0) + 1;
              }
            } else {
              to = day.offsetTop;
            }
          }
          if (to !== UNDEFINED) {
            animate = this._shouldAnimateScroll;
          }
        }
        if (to !== UNDEFINED) {
          this._isListScrolling++;
          smoothScroll(this._list, UNDEFINED, to, animate, false, function () {
            setTimeout(function () {
              _this._isListScrolling--;
            }, 150);
          });
        }
      }
    };
    EventcalendarBase.prototype._selectedChange = function (d) {
      this._emit('selectedDateChange', d); // needed for the two-way binding to work - the argument needs to be the value only
      this._hook('onSelectedDateChange', { date: d });
    };
    EventcalendarBase.prototype._cellClick = function (name, args) {
      this._hook(name, __assign({ target: args.domEvent.currentTarget }, args));
    };
    EventcalendarBase.prototype._dayClick = function (name, args) {
      var d = getDateStr(args.date);
      var events = sortEvents(this._eventMap[d], this.s.eventOrder);
      args.events = events;
      this._hook(name, args);
    };
    EventcalendarBase.prototype._labelClick = function (name, args) {
      if (args.label) {
        this._hook(name, {
          date: args.date,
          domEvent: args.domEvent,
          event: args.label,
          source: 'calendar'
        });
      }
    };
    EventcalendarBase.prototype._eventClick = function (name, args) {
      args.date = new Date(args.date);
      return this._hook(name, args);
    };
    /**
     * Handles multiple event selection on label/event click.
     */
    EventcalendarBase.prototype._handleMultipleSelect = function (args) {
      var event = args.label || args.event;
      if (event && this.s.selectMultipleEvents) {
        var domEvent = args.domEvent;
        var selectedEvents = !domEvent.shiftKey && !domEvent.ctrlKey && !domEvent.metaKey ? {} : this._selectedEventsMap;
        var eventId = event.occurrenceId || event.id;
        if (selectedEvents[eventId]) {
          delete selectedEvents[eventId];
        } else {
          selectedEvents[eventId] = event;
        }
        this._selectedEventsMap = __assign({}, selectedEvents);
        this._onSelectedEventsChange(toArray(selectedEvents));
        if (this.s.selectedEvents === UNDEFINED) {
          this.forceUpdate();
        }
      }
    };
    /** @hidden */
    EventcalendarBase.defaults = __assign({}, calendarViewDefaults, {
      actionableEvents: true,
      allDayText: 'All-day',
      data: [],
      dragTimeStep: 15,
      newEventText: 'New event',
      noEventsText: 'No events',
      showControls: true,
      showEventTooltip: true,
      view: { calendar: { type: 'month' } }
    });
    // tslint:disable variable-name
    EventcalendarBase._name = 'Eventcalendar';
    return EventcalendarBase;
  })(BaseComponent);

  var createContext = react.createContext;
  var createElement = react.createElement;
  var enhance = UNDEFINED;
  var Fragment = react.Fragment;
  var PureComponent = react.PureComponent;

  /** @hidden */
  var IconBase = /*#__PURE__*/ (function (_super) {
    __extends(IconBase, _super);
    function IconBase() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    // tslint:enable variable-name
    IconBase.prototype._render = function (s) {
      // The icon might be custom markup as well
      this._hasChildren = !isString(s.name);
      this._cssClass =
        this._className +
        ' mbsc-icon' +
        this._theme +
        (s.name && !this._hasChildren
          ? // If the icon name contains a space, we consider it as a 3rd party font icon,
            // (e.g. FA: 'fas fa-camera', or Ionicon: 'icon ion-md-heart').
            // Otherwas we add the 'mbsc-icon-' prefix to use our font.
            s.name.indexOf(' ') !== -1
            ? ' ' + s.name
            : ' mbsc-font-icon mbsc-icon-' + s.name
          : '');
      this._svg = s.svg ? this._safeHtml(s.svg) : UNDEFINED;
    };
    return IconBase;
  })(BaseComponent);

  /**
   * The Icon component.
   *
   * Usage:
   *
   * ```
   * <Icon name="home" />
   * ```
   */
  var Icon = /*#__PURE__*/ (function (_super) {
    __extends(Icon, _super);
    function Icon() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    Icon.prototype._template = function (s) {
      return createElement(
        'span',
        { onClick: s.onClick, className: this._cssClass, dangerouslySetInnerHTML: this._svg },
        this._hasChildren && s.name
      );
    };
    return Icon;
  })(IconBase);

  /** @hidden */
  var ButtonBase = /*#__PURE__*/ (function (_super) {
    __extends(ButtonBase, _super);
    function ButtonBase() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    // tslint:enable variable-name
    ButtonBase.prototype._mounted = function () {
      var _this = this;
      this._unlisten = gestureListener(this._el, {
        click: true,
        onBlur: function () {
          _this.setState({ hasFocus: false });
        },
        onFocus: function () {
          _this.setState({ hasFocus: true });
        },
        onHoverIn: function () {
          if (!_this.s.disabled) {
            _this.setState({ hasHover: true });
          }
        },
        onHoverOut: function () {
          _this.setState({ hasHover: false });
        },
        onKeyDown: function (ev) {
          switch (ev.keyCode) {
            case ENTER:
            case SPACE:
              _this._el.click();
              ev.preventDefault();
              break;
          }
        },
        onPress: function () {
          _this.setState({ isActive: true });
        },
        onRelease: function () {
          _this.setState({ isActive: false });
        },
        onStart: function () {
          return { ripple: _this.s.ripple && !_this.s.disabled };
        }
      });
    };
    ButtonBase.prototype._render = function (s, state) {
      var _this = this;
      var disabled = s.disabled;
      this._isIconOnly = !!(s.icon || s.iconSvg);
      this._hasStartIcon = !!(s.startIcon || s.startIconSvg);
      this._hasEndIcon = !!(s.endIcon || s.endIconSvg);
      this._tabIndex = disabled ? UNDEFINED : s.tabIndex || 0;
      this._cssClass =
        this._className +
        ' mbsc-reset mbsc-font mbsc-button' +
        this._theme +
        this._rtl +
        ' mbsc-button-' +
        s.variant +
        (this._isIconOnly ? ' mbsc-icon-button' : '') +
        (disabled ? ' mbsc-disabled' : '') +
        (s.color ? ' mbsc-button-' + s.color : '') +
        (state.hasFocus && !disabled ? ' mbsc-focus' : '') +
        (state.isActive && !disabled ? ' mbsc-active' : '') +
        (state.hasHover && !disabled ? ' mbsc-hover' : '');
      this._iconClass = 'mbsc-button-icon' + this._rtl;
      this._startIconClass = this._iconClass + ' mbsc-button-icon-start';
      this._endIconClass = this._iconClass + ' mbsc-button-icon-end';
      // Workaround for mouseleave not firing on disabled button
      if (s.disabled && state.hasHover) {
        setTimeout(function () {
          _this.setState({ hasHover: false });
        });
      }
    };
    ButtonBase.prototype._destroy = function () {
      this._unlisten();
    };
    // tslint:disable variable-name
    ButtonBase.defaults = {
      ripple: false,
      role: 'button',
      tag: 'button',
      variant: 'standard'
    };
    ButtonBase._name = 'Button';
    return ButtonBase;
  })(BaseComponent);

  /**
   * The Button component.
   *
   * Usage:
   *
   * ```
   * <Button icon="home">A button</Button>
   * ```
   */
  var Button = /*#__PURE__*/ (function (_super) {
    __extends(Button, _super);
    function Button() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    Button.prototype._template = function (s) {
      var _a = this.props,
        ariaLabel = _a.ariaLabel,
        children = _a.children;
      _a.className;
      _a.color;
      var endIcon = _a.endIcon;
      _a.endIconSrc;
      var endIconSvg = _a.endIconSvg;
      _a.hasChildren;
      var icon = _a.icon;
      _a.iconSrc;
      var iconSvg = _a.iconSvg;
      _a.ripple;
      _a.rtl;
      var role = _a.role,
        startIcon = _a.startIcon;
      _a.startIconSrc;
      var startIconSvg = _a.startIconSvg;
      _a.tag;
      _a.tabIndex;
      _a.theme;
      _a.themeVariant;
      _a.variant;
      var other = __rest(_a, [
        'ariaLabel',
        'children',
        'className',
        'color',
        'endIcon',
        'endIconSrc',
        'endIconSvg',
        'hasChildren',
        'icon',
        'iconSrc',
        'iconSvg',
        'ripple',
        'rtl',
        'role',
        'startIcon',
        'startIconSrc',
        'startIconSvg',
        'tag',
        'tabIndex',
        'theme',
        'themeVariant',
        'variant'
      ]);
      // Need to use props here, otherwise all inherited settings will be included in ...other,
      // which will end up on the native element, resulting in invalid DOM
      var props = __assign({ 'aria-label': ariaLabel, className: this._cssClass, ref: this._setEl }, other);
      var inner = createElement(
        Fragment,
        null,
        this._isIconOnly && createElement(Icon, { className: this._iconClass, name: icon, svg: iconSvg, theme: s.theme }),
        this._hasStartIcon && createElement(Icon, { className: this._startIconClass, name: startIcon, svg: startIconSvg, theme: s.theme }),
        children,
        this._hasEndIcon && createElement(Icon, { className: this._endIconClass, name: endIcon, svg: endIconSvg, theme: s.theme })
      );
      if (s.tag === 'span') {
        return createElement('span', __assign({ role: role, 'aria-disabled': s.disabled, tabIndex: this._tabIndex }, props), inner);
      }
      if (s.tag === 'a') {
        return createElement('a', __assign({ 'aria-disabled': s.disabled, tabIndex: this._tabIndex }, props), inner);
      }
      return createElement('button', __assign({ role: role, tabIndex: this._tabIndex }, props), inner);
    };
    return Button;
  })(ButtonBase);

  var CalendarContext = createContext({});
  var InstanceSubscriber = /*#__PURE__*/ (function (_super) {
    __extends(InstanceSubscriber, _super);
    function InstanceSubscriber() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    // tslint:enable: variable-name
    InstanceSubscriber.prototype.componentWillUnmount = function () {
      if (this._changes) {
        this._changes.unsubscribe(this._handler);
      }
    };
    InstanceSubscriber.prototype.render = function () {
      var _this = this;
      var _a = this.props,
        host = _a.host,
        component = _a.component,
        view = _a.view,
        other = __rest(_a, ['host', 'component', 'view']);
      var calView = view || (host && host._calendarView);
      if (calView && !this._changes) {
        this._changes = calView.s.instanceService.onComponentChange;
        this._handler = this._changes.subscribe(function () {
          _this.forceUpdate();
        });
      }
      return createElement(CalendarContext.Consumer, null, function (_a) {
        var instance = _a.instance;
        var inst = instance || view || (host && host._calendarView);
        return inst && createElement(component, __assign({ inst: inst }, other));
      });
    };
    return InstanceSubscriber;
  })(PureComponent);
  var CalendarPrevButton = function (_a) {
    var inst = _a.inst,
      className = _a.className;
    return createElement(Button, {
      ariaLabel: inst.s.prevPageText,
      className: 'mbsc-calendar-button ' + (className || ''),
      disabled: inst._isPrevDisabled(),
      iconSvg: inst._prevIcon,
      onClick: inst.prevPage,
      theme: inst.s.theme,
      themeVariant: inst.s.themeVariant,
      type: 'button',
      variant: 'flat'
    });
  };
  var CalendarNextButton = function (_a) {
    var inst = _a.inst,
      className = _a.className;
    return createElement(Button, {
      ariaLabel: inst.s.nextPageText,
      disabled: inst._isNextDisabled(),
      className: 'mbsc-calendar-button ' + (className || ''),
      iconSvg: inst._nextIcon,
      onClick: inst.nextPage,
      theme: inst.s.theme,
      themeVariant: inst.s.themeVariant,
      type: 'button',
      variant: 'flat'
    });
  };
  var CalendarTodayButton = function (_a) {
    var inst = _a.inst,
      className = _a.className;
    return createElement(
      Button,
      {
        className: 'mbsc-calendar-button mbsc-calendar-button-today ' + (className || ''),
        onClick: inst._onTodayClick,
        theme: inst.s.theme,
        themeVariant: inst.s.themeVariant,
        type: 'button',
        variant: 'flat'
      },
      inst.s.todayText
    );
  };
  var CalendarTitleButton = function (_a) {
    var inst = _a.inst,
      className = _a.className;
    var s = inst.s;
    var theme = inst._theme;
    var view = inst._view;
    return createElement(
      'div',
      { 'aria-live': 'polite', className: (className || '') + theme },
      inst._title.map(function (val, index) {
        return (
          (inst._pageNr === 1 || index === 0 || inst._hasPicker || view === MONTH_VIEW) &&
          createElement(
            Button,
            {
              className: 'mbsc-calendar-button',
              'data-index': index,
              onClick: inst._onPickerBtnClick,
              key: index,
              theme: s.theme,
              themeVariant: s.themeVariant,
              type: 'button',
              variant: 'flat'
            },
            (inst._hasPicker || view === MONTH_VIEW) &&
              (val.title
                ? createElement('span', { className: 'mbsc-calendar-title' + theme }, val.title)
                : createElement(
                    Fragment,
                    null,
                    inst._yearFirst &&
                      createElement('span', { className: 'mbsc-calendar-title mbsc-calendar-year' + theme }, val.yearTitle),
                    createElement('span', { className: 'mbsc-calendar-title mbsc-calendar-month' + theme }, val.monthTitle),
                    !inst._yearFirst &&
                      createElement('span', { className: 'mbsc-calendar-title mbsc-calendar-year' + theme }, val.yearTitle)
                  )),
            !inst._hasPicker && view !== MONTH_VIEW && createElement('span', { className: 'mbsc-calendar-title' + theme }, inst._viewTitle),
            s.downIcon && inst._pageNr === 1
              ? createElement(Icon, { svg: view === MONTH_VIEW ? s.downIcon : s.upIcon, theme: s.theme })
              : null
          )
        );
      })
    );
  };
  var CalendarPrev = function (_a) {
    var calendar = _a.calendar,
      view = _a.view,
      others = __rest(_a, ['calendar', 'view']);
    return createElement(InstanceSubscriber, __assign({ component: CalendarPrevButton, host: calendar, view: view }, others));
  };
  CalendarPrev._name = 'CalendarPrev';
  var CalendarNext = function (_a) {
    var calendar = _a.calendar,
      view = _a.view,
      others = __rest(_a, ['calendar', 'view']);
    return createElement(InstanceSubscriber, __assign({ component: CalendarNextButton, host: calendar, view: view }, others));
  };
  CalendarNext._name = 'CalendarNext';
  var CalendarToday = function (_a) {
    var calendar = _a.calendar,
      view = _a.view,
      others = __rest(_a, ['calendar', 'view']);
    return createElement(InstanceSubscriber, __assign({ component: CalendarTodayButton, host: calendar, view: view }, others));
  };
  CalendarToday._name = 'CalendarToday';
  var CalendarNav = function (_a) {
    var calendar = _a.calendar,
      view = _a.view,
      others = __rest(_a, ['calendar', 'view']);
    return createElement(InstanceSubscriber, __assign({ component: CalendarTitleButton, host: calendar, view: view }, others));
  };
  CalendarNav._name = 'CalendarNav';

  /** @hidden */
  var Portal = /*#__PURE__*/ (function (_super) {
    __extends(Portal, _super);
    function Portal() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    Portal.prototype.render = function () {
      var context = this.props.context;
      return context ? reactDom.createPortal(this.props.children, context) : null;
    };
    return Portal;
  })(react.Component);

  var markup =
    '<div class="mbsc-resize"><div class="mbsc-resize-i mbsc-resize-x"></div></div>' +
    '<div class="mbsc-resize"><div class="mbsc-resize-i mbsc-resize-y"></div></div>';
  var observer;
  var count = 0;
  function resizeObserver(el, callback, zone) {
    var expand;
    var expandChild;
    var helper;
    var hiddenRafId;
    var rafId;
    var shrink;
    var stopCheck;
    var lastCheck = 0;
    function reset() {
      expandChild.style.width = '100000px';
      expandChild.style.height = '100000px';
      expand.scrollLeft = 100000;
      expand.scrollTop = 100000;
      shrink.scrollLeft = 100000;
      shrink.scrollTop = 100000;
    }
    function checkHidden() {
      var now = +new Date();
      hiddenRafId = 0;
      if (!stopCheck) {
        if (now - lastCheck > 200 && !expand.scrollTop && !expand.scrollLeft) {
          lastCheck = now;
          reset();
        }
        if (!hiddenRafId) {
          hiddenRafId = raf(checkHidden);
        }
      }
    }
    function onScroll() {
      if (!rafId) {
        rafId = raf(onResize);
      }
    }
    function onResize() {
      rafId = 0;
      reset();
      callback();
    }
    if (win && win.ResizeObserver) {
      if (!observer) {
        observer = new win.ResizeObserver(function (entries) {
          if (!rafId) {
            rafId = raf(function () {
              for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                var entry = entries_1[_i];
                // Sometimes this fires after unobserve has been called,
                // so we need to check if the callback function is still there
                if (entry.target.__mbscResize) {
                  entry.target.__mbscResize();
                }
              }
              rafId = 0;
            });
          }
        });
      }
      count++;
      el.__mbscResize = function () {
        if (zone) {
          zone.run(callback);
        } else {
          callback();
        }
      };
      observer.observe(el);
    } else {
      helper = doc && doc.createElement('div');
    }
    if (helper) {
      helper.innerHTML = markup;
      helper.dir = 'ltr'; // Need this to work in rtl as well;
      shrink = helper.childNodes[1];
      expand = helper.childNodes[0];
      expandChild = expand.childNodes[0];
      el.appendChild(helper);
      listen(expand, 'scroll', onScroll);
      listen(shrink, 'scroll', onScroll);
      if (zone) {
        zone.runOutsideAngular(function () {
          raf(checkHidden);
        });
      } else {
        raf(checkHidden);
      }
    }
    return {
      detach: function () {
        if (observer) {
          count--;
          delete el.__mbscResize;
          observer.unobserve(el);
          if (!count) {
            observer = UNDEFINED;
          }
        } else {
          if (helper) {
            unlisten(expand, 'scroll', onScroll);
            unlisten(shrink, 'scroll', onScroll);
            el.removeChild(helper);
            rafc(rafId);
            helper = UNDEFINED;
          }
          stopCheck = true;
        }
      }
    };
  }

  // tslint:disable no-non-null-assertion
  // tslint:disable directive-class-suffix
  // tslint:disable directive-selector
  var activeModal;
  var EDITABLE = 'input,select,textarea,button';
  var ALLOW_ENTER = 'textarea,button,input[type="button"],input[type="submit"]';
  var FOCUSABLE = EDITABLE + ',[tabindex="0"]';
  var MAX_WIDTH = 600;
  var KEY_CODES = {
    enter: ENTER,
    esc: ESC,
    space: SPACE
  };
  var needsFixed = isBrowser && /(iphone|ipod)/i.test(userAgent) && majorVersion >= 7 && majorVersion < 15;
  /** @hidden */
  function processButtons(inst, buttons) {
    var s = inst.s; // needed for localization settings
    var processedButtons = [];
    var predefinedButtons = {
      cancel: {
        cssClass: 'mbsc-popup-button-close',
        name: 'cancel',
        text: s.cancelText
      },
      close: {
        cssClass: 'mbsc-popup-button-close',
        name: 'close',
        text: s.closeText
      },
      ok: {
        cssClass: 'mbsc-popup-button-primary',
        keyCode: ENTER,
        name: 'ok',
        text: s.okText
      },
      set: {
        cssClass: 'mbsc-popup-button-primary',
        keyCode: ENTER,
        name: 'set',
        text: s.setText
      }
    };
    if (buttons && buttons.length) {
      buttons.forEach(function (btn) {
        var button = isString(btn) ? predefinedButtons[btn] || { text: btn } : btn;
        if (!button.handler || isString(button.handler)) {
          if (isString(button.handler)) {
            button.name = button.handler;
          }
          button.handler = function (domEvent) {
            inst._onButtonClick({ domEvent: domEvent, button: button });
          };
        }
        processedButtons.push(button);
      });
      return processedButtons;
    }
    return;
  }
  function getPrevActive(modal, i) {
    if (i === void 0) {
      i = 0;
    }
    var prevModal = modal._prevModal;
    if (prevModal && prevModal !== modal && i < 10) {
      if (prevModal.isVisible()) {
        return prevModal;
      }
      return getPrevActive(prevModal, i + 1);
    }
    return;
  }
  /**
   * @hidden
   */
  var PopupBase = /*#__PURE__*/ (function (_super) {
    __extends(PopupBase, _super);
    function PopupBase() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      _this._lastFocus = +new Date();
      _this._onOverlayClick = function () {
        if (_this._isOpen && _this.s.closeOnOverlayClick && !_this._preventClose) {
          _this._close('overlay');
        }
        _this._preventClose = false;
      };
      _this._onDocClick = function (ev) {
        if (!_this.s.showOverlay && ev.target !== _this.s.focusElm && activeModal === _this) {
          _this._onOverlayClick();
        }
      };
      _this._onMouseDown = function (ev) {
        if (!_this.s.showOverlay) {
          _this._target = ev.target;
        }
      };
      _this._onMouseUp = function (ev) {
        if (_this._target && _this._popup && _this._popup.contains(_this._target) && !_this._popup.contains(ev.target)) {
          _this._preventClose = true;
        }
        _this._target = false;
      };
      _this._onPopupClick = function () {
        if (!_this.s.showOverlay) {
          _this._preventClose = true;
        }
      };
      _this._onAnimationEnd = function (ev) {
        if (ev.target === _this._popup) {
          if (_this._isClosing) {
            _this._onClosed();
            _this._isClosing = false;
            if (_this.state.isReady) {
              _this.setState({ isReady: false });
            } else {
              _this.forceUpdate();
            }
          }
          if (_this._isOpening) {
            _this._onOpened();
            _this._isOpening = false;
            _this.forceUpdate();
          }
        }
      };
      _this._onButtonClick = function (_a) {
        var domEvent = _a.domEvent,
          button = _a.button;
        _this._hook('onButtonClick', { domEvent: domEvent, button: button });
        if (/cancel|close|ok|set/.test(button.name)) {
          _this._close(button.name);
        }
      };
      _this._onFocus = function (ev) {
        var now = +new Date();
        // If an element outside of the modal is focused, put the focus back inside the modal
        // Last focus time is tracked, to avoid infinite loop for focus,
        // if there's another modal present on page, e.g. Ionic or Bootstrap
        // https://github.com/acidb/mobiscroll/issues/341
        if (
          activeModal === _this &&
          ev.target.nodeType &&
          _this._ctx.contains(ev.target) &&
          !_this._popup.contains(ev.target) &&
          now - _this._lastFocus > 100 &&
          ev.target !== _this.s.focusElm
        ) {
          _this._lastFocus = now;
          _this._active.focus();
        }
      };
      _this._onKeyDown = function (ev) {
        var s = _this.s;
        var keyCode = ev.keyCode;
        var focusElm = s.focusElm && !s.focusOnOpen ? s.focusElm : UNDEFINED;
        // Prevent scroll on Space key
        if ((keyCode === SPACE && !matches(ev.target, EDITABLE)) || (_this._lock && (keyCode === UP_ARROW || keyCode === DOWN_ARROW))) {
          ev.preventDefault();
        }
        // Trap the focus inside the modal
        if (s.focusTrap && keyCode === TAB) {
          var all = _this._popup.querySelectorAll(FOCUSABLE);
          var focusable_1 = [];
          var end_1 = -1;
          var target = 0;
          var current_1 = -1;
          var targetElm = UNDEFINED;
          // Filter truly focusable elements
          forEach(all, function (elm) {
            if (!elm.disabled && (elm.offsetHeight || elm.offsetWidth)) {
              focusable_1.push(elm);
              end_1++;
              // Save the index of the currently focused element
              if (elm === _this._doc.activeElement) {
                current_1 = end_1;
              }
            }
          });
          // If shift is also pressed, means we're going backwards,
          // so we target the last focusable element if the current active is the first
          if (ev.shiftKey) {
            target = end_1;
            end_1 = 0;
          }
          // If current active is first or last, move focus to last or first focusable element
          if (current_1 === end_1) {
            targetElm = focusElm || focusable_1[target];
          } else if (ev.target === focusElm) {
            targetElm = focusable_1[target];
          }
          if (targetElm) {
            targetElm.focus();
            ev.preventDefault();
          }
        }
      };
      _this._onContentScroll = function (ev) {
        if (_this._lock && (ev.type !== TOUCH_MOVE || ev.touches[0].touchType !== 'stylus')) {
          ev.preventDefault();
        }
      };
      _this._onScroll = function (ev) {
        var s = _this.s;
        if (s.closeOnScroll) {
          _this._close('scroll');
        } else if (_this._hasContext || s.display === 'anchored') {
          _this.position();
        }
      };
      _this._onWndKeyDown = function (ev) {
        var s = _this.s;
        var keyCode = ev.keyCode;
        // keyCode is not defined if Chrome triggers keydown when a field is autofilled
        if (activeModal === _this && keyCode !== UNDEFINED) {
          _this._hook('onKeyDown', { keyCode: keyCode });
          if (s.closeOnEsc && keyCode === ESC) {
            _this._close('esc');
          }
          if (keyCode === ENTER && matches(ev.target, ALLOW_ENTER) && !ev.shiftKey) {
            return;
          }
          if (_this._buttons) {
            for (var _i = 0, _a = _this._buttons; _i < _a.length; _i++) {
              var button = _a[_i];
              var buttonKeyCodes = isArray(button.keyCode) ? button.keyCode : [button.keyCode];
              for (var _b = 0, buttonKeyCodes_1 = buttonKeyCodes; _b < buttonKeyCodes_1.length; _b++) {
                var key = buttonKeyCodes_1[_b];
                if (!button.disabled && key !== UNDEFINED && (key === keyCode || KEY_CODES[key] === keyCode)) {
                  button.handler(ev);
                  return;
                }
              }
            }
          }
        }
      };
      _this._onResize = function () {
        var wrapper = _this._wrapper;
        var hasContext = _this._hasContext;
        _this._vpWidth = Math.min(wrapper.clientWidth, hasContext ? Infinity : _this._win.innerWidth);
        _this._vpHeight = Math.min(wrapper.clientHeight, hasContext ? Infinity : _this._win.innerHeight);
        _this._maxWidth = _this._limitator.offsetWidth;
        _this._maxHeight =
          _this.s.maxHeight !== UNDEFINED || _this._vpWidth < 768 || _this._vpHeight < 650 ? _this._limitator.offsetHeight : 600;
        _this._round = _this.s.touchUi === false || (_this._popup.offsetWidth < _this._vpWidth && _this._vpWidth > _this._maxWidth);
        var args = {
          isLarge: _this._round,
          maxPopupHeight: _this._maxHeight,
          maxPopupWidth: _this._maxWidth,
          target: wrapper,
          windowHeight: _this._vpHeight,
          windowWidth: _this._vpWidth
        };
        if (_this._hook('onResize', args) !== false && !args.cancel) {
          _this.position();
        }
      };
      return _this;
    }
    // tslint:enable variable-name
    // ---
    /**
     * Open
     */
    PopupBase.prototype.open = function () {
      if (!this._isOpen) {
        this.setState({
          isOpen: true
        });
      }
    };
    /**
     * Close
     */
    PopupBase.prototype.close = function () {
      this._close();
    };
    /**
     * Is open?
     */
    PopupBase.prototype.isVisible = function () {
      return !!this._isOpen;
    };
    PopupBase.prototype.position = function () {
      if (!this._isOpen) {
        return;
      }
      var s = this.s;
      var state = this.state;
      var wrapper = this._wrapper;
      var popup = this._popup;
      var hasContext = this._hasContext;
      var anchor = s.anchor;
      var anchorAlign = s.anchorAlign;
      var rtl = s.rtl;
      var scrollTop = getScrollTop(this._scrollCont);
      var scrollLeft = getScrollLeft(this._scrollCont);
      var viewportWidth = this._vpWidth;
      var viewportHeight = this._vpHeight;
      var maxWidth = this._maxWidth;
      var maxHeight = this._maxHeight;
      var popupWidth = Math.min(popup.offsetWidth, maxWidth);
      var popupHeight = Math.min(popup.offsetHeight, maxHeight);
      var showArrow = s.showArrow;
      this._lock = s.scrollLock && this._content.scrollHeight <= this._content.clientHeight;
      // this._short = popupHeight >= (viewportHeight - 50);
      if (hasContext) {
        wrapper.style.top = scrollTop + 'px';
        wrapper.style.left = scrollLeft + 'px';
      }
      var skip =
        this._hook('onPosition', {
          isLarge: this._round,
          maxPopupHeight: maxHeight,
          maxPopupWidth: maxWidth,
          target: this._wrapper,
          windowHeight: viewportHeight,
          windowWidth: viewportWidth
        }) === false;
      if (s.display === 'anchored' && !skip) {
        var ctxLeft = 0;
        var ctxTop = 0;
        var left = constrain(state.modalLeft || 0, 8, viewportWidth - popupWidth - 8);
        var top_1 = state.modalTop || 8;
        var bubblePos = 'bottom';
        var arrowPos = {};
        var arrowHeight = showArrow ? 16 : 4;
        var fullWidth = wrapper.offsetWidth;
        var fullHeight = wrapper.offsetHeight;
        var widthOffset = (fullWidth - viewportWidth) / 2;
        var heightOffset = (fullHeight - viewportHeight) / 2;
        if (hasContext) {
          var ctxBox = this._ctx.getBoundingClientRect();
          ctxTop = ctxBox.top;
          ctxLeft = ctxBox.left;
        }
        // Check if anchor exists and it's inside the context
        if (anchor && this._ctx.contains(anchor)) {
          var box = anchor.getBoundingClientRect();
          var anchorTop = box.top - ctxTop;
          var anchorLeft = box.left - ctxLeft;
          var anchorWidth = anchor.offsetWidth;
          var anchorHeight = anchor.offsetHeight;
          if ((anchorAlign === 'start' && !rtl) || (anchorAlign === 'end' && rtl)) {
            // Position to the left of the anchor
            left = anchorLeft;
          } else if ((anchorAlign === 'end' && !rtl) || (anchorAlign === 'start' && rtl)) {
            // Position to the right of the anchor
            left = anchorLeft + anchorWidth - popupWidth;
          } else {
            // Position to the center of the anchor
            left = anchorLeft - (popupWidth - anchorWidth) / 2;
          }
          // Make sure to remain in the viewport
          left = constrain(left, 8, viewportWidth - popupWidth - 8);
          // By default position the popup to the bottom of the anchor
          top_1 = anchorTop + anchorHeight + arrowHeight;
          arrowPos = {
            left: constrain(anchorLeft + anchorWidth / 2 - left - widthOffset, 30, popupWidth - 30) + 'px'
          };
          // if there's no space below
          if (top_1 + popupHeight + arrowHeight > viewportHeight) {
            if (anchorTop - popupHeight - arrowHeight > 0) {
              // check if above the anchor is enough space
              bubblePos = 'top';
              top_1 = anchorTop - popupHeight - arrowHeight;
            } else if (!s.disableLeftRight) {
              var leftPos = anchorLeft - popupWidth - 8 > 0; // check if there's space on the left
              var rightPos = anchorLeft + anchorWidth + popupWidth + 8 <= viewportWidth; // check if there's space on the right
              // calculations are almost the same for the left and right position, so we group them toghether
              if (leftPos || rightPos) {
                top_1 = constrain(anchorTop - (popupHeight - anchorHeight) / 2, 8, viewportHeight - popupHeight - 8);
                // Make sure it stays in the viewport
                if (top_1 + popupHeight + 8 > viewportHeight) {
                  // the top position can be negative because of the -16px spacing
                  top_1 = Math.max(viewportHeight - popupHeight - 8, 0);
                }
                arrowPos = {
                  top: constrain(anchorTop + anchorHeight / 2 - top_1 - heightOffset, 30, popupHeight - 30) + 'px'
                };
                bubblePos = leftPos ? 'left' : 'right';
                left = leftPos ? anchorLeft - popupWidth : anchorLeft + anchorWidth;
              }
            }
          }
        }
        if (bubblePos === 'top' || bubblePos === 'bottom') {
          // Make sure it stays in the viewport
          if (top_1 + popupHeight + arrowHeight > viewportHeight) {
            // the top position can be negative because of the -16px spacing
            top_1 = Math.max(viewportHeight - popupHeight - arrowHeight, 0);
            showArrow = false;
          }
        }
        this.setState({
          arrowPos: arrowPos,
          bubblePos: bubblePos,
          height: viewportHeight,
          isReady: true,
          modalLeft: left,
          modalTop: top_1,
          showArrow: showArrow,
          width: viewportWidth
        });
      } else {
        this.setState({
          height: viewportHeight,
          isReady: true,
          showArrow: showArrow,
          width: viewportWidth
        });
      }
    };
    PopupBase.prototype._render = function (s, state) {
      // 'bubble' is deprecated, renamed to 'anchored'
      if (s.display === 'bubble') {
        s.display = 'anchored';
      }
      var animation = s.animation;
      var display = s.display;
      var prevProps = this._prevS;
      var hasPos = display === 'anchored';
      var isModal = display !== 'inline';
      var isFullScreen = s.fullScreen && isModal;
      var isOpen = isModal ? (s.isOpen === UNDEFINED ? state.isOpen : s.isOpen) : false;
      if (
        isOpen &&
        (s.windowWidth !== prevProps.windowWidth ||
          s.display !== prevProps.display ||
          s.showArrow !== prevProps.showArrow ||
          (s.anchor !== prevProps.anchor && s.display === 'anchored'))
      ) {
        this._shouldPosition = true;
      }
      this._limits = {
        maxHeight: addPixel(s.maxHeight),
        maxWidth: addPixel(s.maxWidth)
      };
      this._style = {
        height: isFullScreen ? '100%' : addPixel(s.height),
        left: hasPos && state.modalLeft ? state.modalLeft + 'px' : '',
        maxHeight: addPixel(this._maxHeight || s.maxHeight),
        maxWidth: addPixel(this._maxWidth || s.maxWidth),
        top: hasPos && state.modalTop ? state.modalTop + 'px' : '',
        width: isFullScreen ? '100%' : addPixel(s.width)
      };
      this._hasContext = s.context !== 'body' && s.context !== UNDEFINED;
      this._needsLock = needsFixed && !this._hasContext && display !== 'anchored' && s.scrollLock;
      this._isModal = isModal;
      this._flexButtons = display === 'center' || (!this._touchUi && !isFullScreen && (display === 'top' || display === 'bottom'));
      if (animation !== UNDEFINED && animation !== true) {
        this._animation = isString(animation) ? animation : '';
      } else {
        switch (display) {
          case 'bottom':
            this._animation = 'slide-up';
            break;
          case 'top':
            this._animation = 'slide-down';
            break;
          default:
            this._animation = 'pop';
        }
      }
      if (s.buttons) {
        if (s.buttons !== prevProps.buttons) {
          this._buttons = processButtons(this, s.buttons);
        }
      } else {
        this._buttons = UNDEFINED;
      }
      if (s.headerText !== prevProps.headerText) {
        this._headerText = s.headerText ? this._safeHtml(s.headerText) : UNDEFINED;
      }
      // Will open
      if (isOpen && !this._isOpen) {
        this._onOpen();
      }
      // Will close
      if (!isOpen && this._isOpen) {
        this._onClose();
      }
      this._isOpen = isOpen;
      this._isVisible = isOpen || this._isClosing;
    };
    PopupBase.prototype._updated = function () {
      var _this = this;
      var s = this.s;
      var wrapper = this._wrapper;
      if (doc && (s.context !== this._prevS.context || !this._ctx)) {
        // TODO: refactor for React Native
        var ctx = isString(s.context) ? doc.querySelector(s.context) : s.context;
        if (!ctx) {
          ctx = doc.body;
        }
        ctx.__mbscLock = ctx.__mbscLock || 0;
        ctx.__mbscIOSLock = ctx.__mbscIOSLock || 0;
        ctx.__mbscModals = ctx.__mbscModals || 0;
        this._ctx = ctx;
        // If we just got the context and at the same time the popup was opened,
        // we need an update for the Portal to render the content of the popup
        if (this._justOpened) {
          ngSetTimeout(this, function () {
            _this.forceUpdate();
          });
          return;
        }
      }
      if (!wrapper) {
        return;
      }
      if (this._justOpened) {
        var ctx = this._ctx;
        var hasContext = this._hasContext;
        var doc_1 = (this._doc = getDocument(wrapper));
        var win = (this._win = getWindow(wrapper));
        var activeElm_1 = doc_1.activeElement;
        // If we have responsive setting, we need to make sure to pass the width to the state,
        // and re-render so we have the correct calculated settings, which is based on the width.
        if (!this._hasWidth && s.responsive) {
          var viewportWidth_1 = Math.min(wrapper.clientWidth, hasContext ? Infinity : win.innerWidth);
          var viewportHeight_1 = Math.min(wrapper.clientHeight, hasContext ? Infinity : win.innerHeight);
          this._hasWidth = true;
          if (viewportWidth_1 !== this.state.width || viewportHeight_1 !== this.state.height) {
            ngSetTimeout(this, function () {
              _this.setState({
                height: viewportHeight_1,
                width: viewportWidth_1
              });
            });
            return;
          }
        }
        this._scrollCont = hasContext ? ctx : win;
        this._observer = resizeObserver(wrapper, this._onResize, this._zone);
        this._prevFocus = s.focusElm || activeElm_1;
        ctx.__mbscModals++;
        if (s.focusOnOpen && activeElm_1) {
          setTimeout(function () {
            // TODO investigate on this
            activeElm_1.blur();
          });
        }
        // Scroll locking
        if (this._needsLock) {
          if (!ctx.__mbscIOSLock) {
            var scrollTop = getScrollTop(this._scrollCont);
            var scrollLeft = getScrollLeft(this._scrollCont);
            ctx.style.left = -scrollLeft + 'px';
            ctx.style.top = -scrollTop + 'px';
            ctx.__mbscScrollLeft = scrollLeft;
            ctx.__mbscScrollTop = scrollTop;
            ctx.classList.add('mbsc-popup-open-ios');
            ctx.parentNode.classList.add('mbsc-popup-open-ios');
          }
          ctx.__mbscIOSLock++;
        }
        if (hasContext) {
          ctx.classList.add('mbsc-popup-ctx');
        }
        if (s.focusTrap) {
          listen(win, FOCUS_IN, this._onFocus);
        }
        if (s.focusElm && !s.focusOnOpen) {
          listen(s.focusElm, KEY_DOWN, this._onKeyDown);
        }
        listen(this._scrollCont, TOUCH_MOVE, this._onContentScroll, { passive: false });
        listen(this._scrollCont, WHEEL, this._onContentScroll, { passive: false });
        listen(this._scrollCont, MOUSE_WHEEL, this._onContentScroll, { passive: false });
        // Need setTimeout to prevent immediate close
        // TODO: use touch events here
        setTimeout(function () {
          listen(doc_1, MOUSE_DOWN, _this._onMouseDown);
          listen(doc_1, MOUSE_UP, _this._onMouseUp);
          listen(doc_1, CLICK, _this._onDocClick);
        });
        this._hook('onOpen', { target: this._wrapper });
      }
      if (this._shouldPosition) {
        ngSetTimeout(this, function () {
          // this.position();
          _this._onResize();
        });
      }
      this._justOpened = false;
      this._justClosed = false;
      this._shouldPosition = false;
    };
    PopupBase.prototype._destroy = function () {
      if (this._isOpen) {
        this._onClosed();
        this._unlisten();
        if (activeModal === this) {
          activeModal = getPrevActive(this);
        }
      }
    };
    PopupBase.prototype._onOpen = function () {
      var _this = this;
      if (hasAnimation && this._animation) {
        this._isOpening = true;
        this._isClosing = false;
      } else {
        this._onOpened();
      }
      this._justOpened = true;
      this._preventClose = false;
      if (activeModal !== this) {
        // Wait for the click to propagate,
        // because if another popup needs to be closed on doc click, we don't want to override
        // the activeModal variable.
        setTimeout(function () {
          _this._prevModal = activeModal;
          activeModal = _this;
        });
      }
    };
    PopupBase.prototype._onClose = function () {
      var _this = this;
      // const activeElm = this._doc!.activeElement as HTMLElement;
      // if (activeElm) {
      // There's a weird issue on Safari, where the page scrolls up when
      // 1) A readonly input inside the popup has the focus
      // 2) The popup is closed by clicking on a `button` element (built in popup buttons, or a button in the popup content)
      // To prevent this, blur the active element when closing the popup.
      // setTimeout is needed to prevent to avoid the "Cannot flush updates when React is already rendering" error in React
      // setTimeout(() => {
      // activeElm.blur();
      // });
      // }
      if (hasAnimation && this._animation) {
        this._isClosing = true;
        this._isOpening = false;
      } else {
        setTimeout(function () {
          _this._onClosed();
          _this.setState({ isReady: false });
        });
      }
      this._hasWidth = false;
      this._unlisten();
    };
    PopupBase.prototype._onOpened = function () {
      var s = this.s;
      if (s.focusOnOpen) {
        var activeElm = s.activeElm;
        var active = activeElm ? (isString(activeElm) ? this._popup.querySelector(activeElm) || this._active : activeElm) : this._active;
        if (active && active.focus) {
          active.focus();
        }
      }
      listen(this._win, KEY_DOWN, this._onWndKeyDown);
      listen(this._scrollCont, SCROLL, this._onScroll);
    };
    PopupBase.prototype._onClosed = function () {
      var _this = this;
      var ctx = this._ctx;
      var prevFocus = this._prevFocus;
      var shouldFocus = this.s.focusOnClose && prevFocus && prevFocus.focus && prevFocus !== this._doc.activeElement;
      ctx.mbscModals--;
      this._justClosed = true;
      if (this._needsLock) {
        ctx.__mbscIOSLock--;
        if (!ctx.__mbscIOSLock) {
          ctx.classList.remove('mbsc-popup-open-ios');
          ctx.parentNode.classList.remove('mbsc-popup-open-ios');
          ctx.style.left = '';
          ctx.style.top = '';
          setScrollLeft(this._scrollCont, ctx.__mbscScrollLeft);
          setScrollTop(this._scrollCont, ctx.__mbscScrollTop);
        }
      }
      if (this._hasContext && !ctx.mbscModals) {
        ctx.classList.remove('mbsc-popup-ctx');
      }
      this._hook('onClosed', { focus: shouldFocus });
      if (shouldFocus) {
        prevFocus.focus();
      }
      setTimeout(function () {
        if (activeModal === _this) {
          activeModal = getPrevActive(_this);
        }
      });
    };
    PopupBase.prototype._unlisten = function () {
      unlisten(this._win, KEY_DOWN, this._onWndKeyDown);
      unlisten(this._scrollCont, SCROLL, this._onScroll);
      unlisten(this._scrollCont, TOUCH_MOVE, this._onContentScroll, { passive: false });
      unlisten(this._scrollCont, WHEEL, this._onContentScroll, { passive: false });
      unlisten(this._scrollCont, MOUSE_WHEEL, this._onContentScroll, { passive: false });
      unlisten(this._doc, MOUSE_DOWN, this._onMouseDown);
      unlisten(this._doc, MOUSE_UP, this._onMouseUp);
      unlisten(this._doc, CLICK, this._onDocClick);
      if (this.s.focusTrap) {
        unlisten(this._win, FOCUS_IN, this._onFocus);
      }
      if (this.s.focusElm) {
        unlisten(this.s.focusElm, KEY_DOWN, this._onKeyDown);
      }
      if (this._observer) {
        this._observer.detach();
        this._observer = null;
      }
    };
    PopupBase.prototype._close = function (source) {
      if (this._isOpen) {
        if (this.s.isOpen === UNDEFINED) {
          this.setState({
            isOpen: false
          });
        }
        this._hook('onClose', { source: source });
      }
    };
    /** @hidden */
    PopupBase.defaults = {
      buttonVariant: 'flat',
      cancelText: 'Cancel',
      closeOnEsc: true,
      closeOnOverlayClick: true,
      closeText: 'Close',
      contentPadding: true,
      display: 'center',
      focusOnClose: true,
      focusOnOpen: true,
      focusTrap: true,
      maxWidth: MAX_WIDTH,
      okText: 'Ok',
      scrollLock: true,
      setText: 'Set',
      showArrow: true,
      showOverlay: true
    };
    return PopupBase;
  })(BaseComponent);

  var Portal$1 = Portal;
  var Popup = /*#__PURE__*/ (function (_super) {
    __extends(Popup, _super);
    function Popup() {
      // tslint:disable variable-name
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      _this._setActive = function (el) {
        _this._active = el;
      };
      _this._setContent = function (el) {
        _this._content = el;
      };
      _this._setLimitator = function (el) {
        _this._limitator = el;
      };
      _this._setPopup = function (el) {
        _this._popup = el;
      };
      _this._setWrapper = function (el) {
        _this._wrapper = el;
      };
      return _this;
    }
    // tslint:enable variable-name
    Popup.prototype._template = function (s, state) {
      var _this = this;
      var hb = this._hb;
      var rtl = this._rtl;
      var theme = this._theme;
      var display = s.display;
      return this._isModal
        ? this._isVisible
          ? createElement(
              Portal$1,
              { context: this._ctx },
              createElement(
                'div',
                {
                  className:
                    'mbsc-font mbsc-popup-wrapper mbsc-popup-wrapper-' +
                    display +
                    theme +
                    rtl +
                    ' ' +
                    this._className +
                    (s.fullScreen ? ' mbsc-popup-wrapper-' + display + '-full' : '') +
                    (this._touchUi ? '' : ' mbsc-popup-pointer') +
                    (this._round ? ' mbsc-popup-round' : '') +
                    (this._hasContext ? ' mbsc-popup-wrapper-ctx' : '') +
                    (state.isReady ? '' : ' mbsc-popup-hidden'),
                  ref: this._setWrapper,
                  onKeyDown: this._onKeyDown
                },
                s.showOverlay &&
                  createElement('div', {
                    className:
                      'mbsc-popup-overlay mbsc-popup-overlay-' +
                      display +
                      theme +
                      (this._isClosing ? ' mbsc-popup-overlay-out' : '') +
                      (this._isOpening && state.isReady ? ' mbsc-popup-overlay-in' : ''),
                    onClick: this._onOverlayClick
                  }),
                createElement('div', {
                  className: 'mbsc-popup-limits mbsc-popup-limits-' + display,
                  ref: this._setLimitator,
                  style: this._limits
                }),
                createElement(
                  'div',
                  {
                    className:
                      'mbsc-popup ' +
                      theme +
                      hb +
                      ' mbsc-popup-' +
                      display +
                      (s.fullScreen ? '-full' : '') +
                      // (this._short ? ' mbsc-popup-short' : '') +
                      (state.bubblePos && state.showArrow && display === 'anchored' ? ' mbsc-popup-anchored-' + state.bubblePos : '') +
                      (this._isClosing ? ' mbsc-popup-' + this._animation + '-out' : '') +
                      (this._isOpening && state.isReady ? ' mbsc-popup-' + this._animation + '-in' : ''),
                    role: 'dialog',
                    'aria-modal': 'true',
                    ref: this._setPopup,
                    style: this._style,
                    onClick: this._onPopupClick,
                    onAnimationEnd: this._onAnimationEnd
                  },
                  display === 'anchored' &&
                    state.showArrow &&
                    createElement(
                      'div',
                      { className: 'mbsc-popup-arrow-wrapper mbsc-popup-arrow-wrapper-' + state.bubblePos + theme },
                      createElement('div', {
                        className: 'mbsc-popup-arrow mbsc-popup-arrow-' + state.bubblePos + theme,
                        style: state.arrowPos
                      })
                    ),
                  createElement('div', { className: 'mbsc-popup-focus', tabIndex: -1, ref: this._setActive }),
                  createElement(
                    'div',
                    {
                      className:
                        'mbsc-popup-body mbsc-popup-body-' +
                        display +
                        theme +
                        hb +
                        (s.fullScreen ? ' mbsc-popup-body-' + display + '-full' : '') +
                        // (this._short ? ' mbsc-popup-short' : '') +
                        (this._round ? ' mbsc-popup-body-round' : '')
                    },
                    this._headerText &&
                      createElement('div', {
                        className:
                          'mbsc-popup-header mbsc-popup-header-' +
                          display +
                          theme +
                          hb +
                          (this._buttons ? '' : ' mbsc-popup-header-no-buttons'),
                        dangerouslySetInnerHTML: this._headerText
                      }),
                    createElement(
                      'div',
                      { className: 'mbsc-popup-content' + (s.contentPadding ? ' mbsc-popup-padding' : ''), ref: this._setContent },
                      s.children
                    ),
                    this._buttons &&
                      createElement(
                        'div',
                        {
                          className:
                            'mbsc-popup-buttons mbsc-popup-buttons-' +
                            display +
                            theme +
                            rtl +
                            hb +
                            (this._flexButtons ? ' mbsc-popup-buttons-flex' : '') +
                            (s.fullScreen ? ' mbsc-popup-buttons-' + display + '-full' : '')
                        },
                        this._buttons.map(function (btn, i) {
                          return createElement(
                            Button,
                            {
                              color: btn.color,
                              className:
                                'mbsc-popup-button mbsc-popup-button-' +
                                display +
                                rtl +
                                hb +
                                (_this._flexButtons ? ' mbsc-popup-button-flex' : '') +
                                ' ' +
                                (btn.cssClass || ''),
                              icon: btn.icon,
                              disabled: btn.disabled,
                              key: i,
                              theme: s.theme,
                              themeVariant: s.themeVariant,
                              variant: btn.variant || s.buttonVariant,
                              onClick: btn.handler
                            },
                            btn.text
                          );
                        })
                      )
                  )
                )
              )
            )
          : null
        : createElement(Fragment, null, s.children);
    };
    return Popup;
  })(PopupBase);

  // TODO: snap points
  function getItem(items, i, min, max) {
    var item;
    if (i < min || i > max) {
      return;
    }
    if (isArray(items)) {
      var len = items.length;
      var index = i % len;
      item = items[index >= 0 ? index : index + len];
    } else {
      item = items(i);
    }
    return item;
  }
  /** @hidden */
  var ScrollviewBase = /*#__PURE__*/ (function (_super) {
    __extends(ScrollviewBase, _super);
    function ScrollviewBase() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      _this._currPos = 0;
      _this._delta = 0;
      _this._endPos = 0;
      _this._lastRaf = 0;
      _this._maxSnapScroll = 0;
      _this._margin = 0;
      _this._scrollEnd = debounce(function () {
        rafc(_this._raf);
        _this._raf = false;
        _this._onEnd();
        _this._hasScrolled = false;
      }, 200);
      // tslint:disable-next-line: variable-name
      _this._onStart = function (args) {
        // const ev = args.domEvent;
        var s = _this.s;
        _this._hook('onStart', {});
        // Don't allow new gesture if new items are only generated on animation end OR
        // mouse swipe is not enabled OR
        // swipe is completely disabled
        if ((s.changeOnEnd && _this._isScrolling) || (!s.mouseSwipe && !args.isTouch) || !s.swipe) {
          return;
        }
        // Better performance if there are tap events on document
        // if (s.stopProp) {
        //   ev.stopPropagation();
        // }
        // TODO: check this, will prevent click on touch device
        // if (s.prevDef) {
        //   // Prevent touch highlight and focus
        //   ev.preventDefault();
        // }
        _this._started = true;
        _this._hasScrolled = _this._isScrolling;
        _this._currX = args.startX;
        _this._currY = args.startY;
        _this._delta = 0;
        _this._velocityX = 0;
        _this._velocityY = 0;
        _this._startPos = getPosition(_this._scrollEl, _this._isVertical);
        _this._timestamp = +new Date();
        if (_this._isScrolling) {
          // Stop running movement
          rafc(_this._raf);
          _this._raf = false;
          _this._scroll(_this._startPos);
        }
      };
      // tslint:disable-next-line: variable-name
      _this._onMove = function (args) {
        var ev = args.domEvent;
        var s = _this.s;
        if (_this._isVertical || s.scrollLock) {
          // Always prevent native scroll, if vertical
          if (ev.cancelable) {
            ev.preventDefault();
          }
        } else {
          if (_this._hasScrolled) {
            // Prevent native scroll
            if (ev.cancelable) {
              ev.preventDefault();
            }
          } else if (ev.type === TOUCH_MOVE && (Math.abs(args.deltaY) > 7 || !s.swipe)) {
            // It's a native scroll, stop listening
            _this._started = false;
          }
        }
        if (!_this._started) {
          return;
        }
        _this._delta = _this._isVertical ? args.deltaY : args.deltaX;
        if (_this._hasScrolled || Math.abs(_this._delta) > _this._threshold) {
          if (!_this._hasScrolled) {
            _this._hook('onGestureStart', {});
          }
          _this._hasScrolled = true;
          _this._isScrolling = true;
          if (!_this._raf) {
            _this._raf = raf(function () {
              return _this._move(args);
            });
          }
        }
      };
      // tslint:disable-next-line: variable-name
      _this._onEnd = function () {
        _this._started = false;
        if (_this._hasScrolled) {
          var s = _this.s;
          var v = (_this._isVertical ? _this._velocityY : _this._velocityX) * 17;
          var maxSnapScroll = _this._maxSnapScroll;
          var delta = _this._delta;
          var time = 0;
          // Calculate stopping distance
          // TODO: speedUnit
          delta += v * v * 0.5 * (v < 0 ? -1 : 1);
          // Allow only max snap
          if (maxSnapScroll) {
            delta = constrain(delta, -_this._round * maxSnapScroll, _this._round * maxSnapScroll);
          }
          // Round and limit between min/max
          var pos = constrain(round((_this._startPos + delta) / _this._round) * _this._round, _this._min, _this._max);
          var index = round((-pos * _this._rtlNr) / s.itemSize) + _this._offset;
          var direction = delta > 0 ? (_this._isVertical ? 270 : 360) : _this._isVertical ? 90 : 180;
          var diff = index - s.selectedIndex;
          // Calculate animation time
          // TODO: timeUnit
          time = s.time || Math.max(1000, Math.abs(pos - _this._currPos) * 3);
          _this._hook('onGestureEnd', { direction: direction, index: index });
          // needed for the infinite scrollbar to be cleared at each end
          _this._delta = 0;
          // Set new position
          _this._scroll(pos, time);
          if (diff && !s.changeOnEnd) {
            _this._hook('onIndexChange', { index: index, diff: diff });
            // In case if the onIndexChange handler leaves the index at the previous position,
            // we need a force update to move the wheel back to the correct position
            if (s.selectedIndex === _this._prevIndex && s.selectedIndex !== index) {
              _this.forceUpdate();
            }
          }
        }
      };
      // tslint:disable-next-line: variable-name
      _this._onClick = function (ev) {
        if (_this._hasScrolled) {
          _this._hasScrolled = false;
          ev.stopPropagation();
          ev.preventDefault();
        }
      };
      // tslint:disable-next-line: variable-name
      _this._onScroll = function (ev) {
        ev.target.scrollTop = 0;
        ev.target.scrollLeft = 0;
      };
      // tslint:disable-next-line: variable-name
      _this._onMouseWheel = function (ev) {
        var delta = _this._isVertical ? (ev.deltaY === UNDEFINED ? ev.wheelDelta || ev.detail : ev.deltaY) : ev.deltaX;
        if (!_this._el.contains(ev.target)) {
          return;
        }
        if (delta && _this.s.mousewheel) {
          ev.preventDefault();
          _this._hook('onStart', {});
          if (!_this._started) {
            _this._delta = 0;
            _this._velocityX = 0;
            _this._velocityY = 0;
            _this._startPos = _this._currPos;
            _this._hook('onGestureStart', {});
          }
          if (ev.deltaMode && ev.deltaMode === 1) {
            delta *= 15;
          }
          delta = constrain(-delta, -_this._scrollSnap, _this._scrollSnap);
          _this._delta += delta;
          if (_this._maxSnapScroll && Math.abs(_this._delta) > _this._round * _this._maxSnapScroll) {
            delta = 0;
          }
          if (_this._startPos + _this._delta < _this._min) {
            _this._startPos = _this._min;
            _this._delta = 0;
            delta = 0;
          }
          if (_this._startPos + _this._delta > _this._max) {
            _this._startPos = _this._max;
            _this._delta = 0;
            delta = 0;
          }
          if (!_this._raf) {
            _this._raf = raf(function () {
              return _this._move();
            });
          }
          if (!delta && _this._started) {
            return;
          }
          _this._hasScrolled = true;
          _this._isScrolling = true;
          _this._started = true;
          _this._scrollEnd();
        }
      };
      // tslint:disable-next-line: variable-name
      _this._onTrackStart = function (ev) {
        ev.stopPropagation();
        var args = {
          domEvent: ev,
          startX: getCoord(ev, 'X', true),
          startY: getCoord(ev, 'Y', true)
        };
        _this._onStart(args);
        _this._trackStartX = args.startX;
        _this._trackStartY = args.startY;
        if (ev.target === _this._scrollbarEl) {
          listen(_this._doc, MOUSE_UP, _this._onTrackEnd);
          listen(_this._doc, MOUSE_MOVE, _this._onTrackMove);
        } else {
          // this._trackStartY = getOffset(this._scrollbarEl).top;
          var top_1 = getOffset(_this._scrollbarContEl).top;
          var percent = (args.startY - top_1) / _this._barContSize;
          _this._startPos = _this._currPos = _this._max + (_this._min - _this._max) * percent;
          _this._hasScrolled = true;
          _this._onEnd();
        }
      };
      // tslint:disable-next-line: variable-name
      _this._onTrackMove = function (ev) {
        var barContSize = _this._barContSize;
        var endX = getCoord(ev, 'X', true);
        var endY = getCoord(ev, 'Y', true);
        var trackDelta = _this._isVertical ? endY - _this._trackStartY : endX - _this._trackStartX;
        var percent = trackDelta / barContSize;
        if (_this._isInfinite) {
          _this._delta = -(_this._maxSnapScroll * _this._round * 2 + barContSize) * percent;
        } else {
          _this._delta = (_this._min - _this._max - barContSize) * percent;
        }
        if (_this._hasScrolled || Math.abs(_this._delta) > _this._threshold) {
          if (!_this._hasScrolled) {
            _this._hook('onGestureStart', {});
          }
          _this._hasScrolled = true;
          _this._isScrolling = true;
          if (!_this._raf) {
            _this._raf = raf(function () {
              return _this._move({ endX: endX, endY: endY }, !_this._isInfinite);
            });
          }
        }
      };
      // tslint:disable-next-line: variable-name
      _this._onTrackEnd = function () {
        _this._delta = 0;
        _this._startPos = _this._currPos;
        _this._onEnd();
        unlisten(_this._doc, MOUSE_UP, _this._onTrackEnd);
        unlisten(_this._doc, MOUSE_MOVE, _this._onTrackMove);
      };
      // tslint:disable-next-line: variable-name
      _this._onTrackClick = function (ev) {
        ev.stopPropagation();
      };
      return _this;
    }
    // tslint:enable variable-name
    ScrollviewBase.prototype._render = function (s, state) {
      var prevS = this._prevS;
      var batchSize = s.batchSize;
      var batchSize3d = s.batchSize3d;
      var itemNr = s.itemNr || 1;
      var itemSize = s.itemSize;
      // Index of the selected item
      var selectedIndex = s.selectedIndex;
      // Index of the previously selected item;
      var prevIndex = prevS.selectedIndex;
      // Index of the actual middle item during animation
      var currIndex = state.index === UNDEFINED ? selectedIndex : state.index;
      var visibleItems = [];
      var visible3dItems = [];
      var diff = selectedIndex - prevIndex;
      var diff2 = currIndex - this._currIndex;
      var minIndex = s.minIndex;
      var maxIndex = s.maxIndex;
      var items = s.items;
      var offset = s.offset;
      this._currIndex = currIndex;
      this._isVertical = s.axis === 'Y';
      this._threshold = this._isVertical ? s.thresholdY : s.thresholdX;
      this._rtlNr = !this._isVertical && s.rtl ? -1 : 1;
      this._round = s.snap ? itemSize : 1;
      var scrollSnap = this._round;
      while (scrollSnap > 44) {
        scrollSnap /= 2;
      }
      this._scrollSnap = round(44 / scrollSnap) * scrollSnap;
      if (items) {
        for (var i = currIndex - batchSize; i < currIndex + itemNr + batchSize; i++) {
          visibleItems.push({ key: i, data: getItem(items, i, minIndex, maxIndex) });
        }
        if (s.scroll3d) {
          for (var i = currIndex - batchSize3d; i < currIndex + itemNr + batchSize3d; i++) {
            visible3dItems.push({ key: i, data: getItem(items, i, minIndex, maxIndex) });
          }
        }
        this.visibleItems = visibleItems;
        this.visible3dItems = visible3dItems;
        this._maxSnapScroll = batchSize;
        this._isInfinite = typeof items === 'function';
      }
      if (this._offset === UNDEFINED) {
        this._offset = selectedIndex;
      }
      var nextPos = -(selectedIndex - this._offset) * itemSize * this._rtlNr;
      if (Math.abs(diff) > batchSize && nextPos !== this._endPos) {
        var off = diff + batchSize * (diff > 0 ? -1 : 1);
        this._offset += off;
        this._margin -= off;
      }
      if (offset && offset !== prevS.offset) {
        this._offset += offset;
        this._margin -= offset;
      }
      if (diff2) {
        this._margin += diff2;
      }
      if (minIndex !== UNDEFINED) {
        this._max = -(minIndex - this._offset) * itemSize * this._rtlNr;
      } else {
        this._max = Infinity;
      }
      if (maxIndex !== UNDEFINED) {
        this._min = -(maxIndex - this._offset - (s.spaceAround ? 0 : itemNr - 1)) * itemSize * this._rtlNr;
      } else {
        this._min = -Infinity;
      }
      if (this._rtlNr === -1) {
        var temp = this._min;
        this._min = this._max;
        this._max = temp;
      }
      if (this._min > this._max) {
        this._min = this._max;
      }
      var visibleSize = s.visibleSize;
      var barContSize = visibleSize * itemSize;
      this._barContSize = barContSize;
      this._barSize = Math.max(20, (barContSize * barContSize) / (this._max - this._min + barContSize));
      this._cssClass = this._className + ' mbsc-ltr';
      // TODO: get rid of this:
      // (!s.scrollBar || this._barSize === this._barContSize ? ' mbsc-scroller-bar-none' : '');
    };
    ScrollviewBase.prototype._mounted = function () {
      // TODO: caluclate scroll sizes, if not infinite
      // const s = this.s;
      // this.size = this.isVertical ? this.cont.clientHeight : this.cont.clientWidth;
      // this.max = 0;
      // this.min = Math.min(this.max, Math.min(0, this.size - (this.isVertical ? this.el.offsetHeight : this.el.offsetWidth)));
      // this.max = Infinity;
      // this.min = -Infinity;
      this._doc = getDocument(this._el);
      listen(this._el, CLICK, this._onClick, true);
      listen(this.s.scroll3d ? this._innerEl : this._el, SCROLL, this._onScroll);
      // Attached to doc to prevent Violation warning about non-passive event listeners
      listen(this._doc, MOUSE_WHEEL, this._onMouseWheel, { passive: false, capture: true });
      listen(this._doc, WHEEL, this._onMouseWheel, { passive: false, capture: true });
      listen(this._scrollbarContEl, MOUSE_DOWN, this._onTrackStart);
      listen(this._scrollbarContEl, CLICK, this._onTrackClick);
      this._unlisten = gestureListener(this._el, {
        onEnd: this._onEnd,
        onMove: this._onMove,
        onStart: this._onStart,
        prevDef: true
      });
    };
    ScrollviewBase.prototype._updated = function () {
      var s = this.s;
      var batchSize = s.batchSize;
      var itemSize = s.itemSize;
      // const selectedIndex = s.selectedIndex! < s.minIndex! ? s.minIndex! : s.selectedIndex!;
      var selectedIndex = s.selectedIndex;
      var prevIndex = this._prevIndex;
      var shouldAnimate = !s.prevAnim && ((prevIndex !== UNDEFINED && prevIndex !== selectedIndex) || this._isAnimating);
      var newPos = -(selectedIndex - this._offset) * itemSize * this._rtlNr;
      if (s.margin) {
        this._scrollEl.style.marginTop = this._isVertical ? (this._margin - batchSize) * itemSize + 'px' : '';
      }
      // Scroll to the new position, but only if the view is not being moved currently
      // The _scroll function will call _infinite, so if the index is changed from outside
      // compared to the index stored in the state, this will ensure to update the index in the state,
      // to regenerate the visible items
      if (!this._started) {
        this._scroll(newPos, shouldAnimate ? this._isAnimating || s.time || 1000 : 0);
      }
      this._prevIndex = selectedIndex;
    };
    ScrollviewBase.prototype._destroy = function () {
      unlisten(this._el, CLICK, this._onClick, true);
      unlisten(this.s.scroll3d ? this._innerEl : this._el, SCROLL, this._onScroll);
      unlisten(this._doc, MOUSE_WHEEL, this._onMouseWheel, { passive: false, capture: true });
      unlisten(this._doc, WHEEL, this._onMouseWheel, { passive: false, capture: true });
      unlisten(this._scrollbarContEl, MOUSE_DOWN, this._onTrackStart);
      unlisten(this._scrollbarContEl, CLICK, this._onTrackClick);
      rafc(this._raf);
      this._raf = false;
      // Need to reset scroll because Preact recycles the DOM element
      this._scroll(0);
      this._unlisten();
    };
    /**
     * Maintains the current position during animation
     */
    ScrollviewBase.prototype._anim = function (dir) {
      var _this = this;
      return (this._raf = raf(function () {
        var s = _this.s;
        var now = +new Date();
        // Component was destroyed
        if (!_this._raf) {
          return;
        }
        if ((_this._currPos - _this._endPos) * -dir < 4) {
          _this._currPos = _this._endPos;
          _this._raf = false;
          _this._isAnimating = 0;
          _this._isScrolling = false;
          _this._infinite(_this._currPos);
          _this._hook('onAnimationEnd', {});
          _this._scrollbarContEl.classList.remove('mbsc-scroller-bar-started'); // hide scrollbar after animation finished
          return;
        }
        if (now - _this._lastRaf > 100) {
          _this._lastRaf = now;
          _this._currPos = getPosition(_this._scrollEl, _this._isVertical);
          if (!s.changeOnEnd) {
            _this._infinite(_this._currPos);
          }
        }
        _this._raf = _this._anim(dir);
      }));
    };
    ScrollviewBase.prototype._infinite = function (pos) {
      var s = this.s;
      if (s.itemSize) {
        var index = round((-pos * this._rtlNr) / s.itemSize) + this._offset;
        var diff = index - this._currIndex;
        if (diff) {
          // this._margin += diff;
          if (s.changeOnEnd) {
            this._hook('onIndexChange', { index: index, diff: diff });
          } else {
            this.setState({ index: index });
          }
        }
      }
    };
    ScrollviewBase.prototype._scroll = function (pos, time) {
      var s = this.s;
      var itemSize = s.itemSize;
      var isVertical = this._isVertical;
      var style = this._scrollEl.style;
      var prefix = jsPrefix ? jsPrefix + 'T' : 't';
      var timing = time ? cssPrefix + 'transform ' + round(time) + 'ms ' + s.easing : '';
      style[prefix + 'ransform'] = 'translate3d(' + (isVertical ? '0,' + pos + 'px,' : pos + 'px,0,') + '0)';
      style[prefix + 'ransition'] = timing;
      this._endPos = pos;
      if (s.scroll3d) {
        var style3d = this._scrollEl3d.style;
        var angle = 360 / (s.batchSize3d * 2);
        style3d[prefix + 'ransform'] = 'translateY(-50%) rotateX(' + (-pos / itemSize) * angle + 'deg)';
        style3d[prefix + 'ransition'] = timing;
      }
      if (this._scrollbarEl) {
        var sbStyle = this._scrollbarEl.style;
        var percent = this._isInfinite
          ? (this._maxSnapScroll * this._round - this._delta) / (this._maxSnapScroll * this._round * 2)
          : (pos - this._max) / (this._min - this._max);
        var barPos = constrain((this._barContSize - this._barSize) * percent, 0, this._barContSize - this._barSize);
        sbStyle[prefix + 'ransform'] = 'translate3d(' + (isVertical ? '0,' + barPos + 'px,' : barPos + 'px,0,') + '0)';
        sbStyle[prefix + 'ransition'] = timing;
      }
      if (time) {
        rafc(this._raf);
        // Maintain position during animation
        this._isAnimating = time;
        this._scrollbarContEl.classList.add('mbsc-scroller-bar-started'); // show the scrollbar during animation
        this._raf = this._anim(pos > this._currPos ? 1 : -1);
      } else {
        this._currPos = pos;
        // Infinite
        if (!s.changeOnEnd) {
          this._infinite(pos);
        }
      }
    };
    ScrollviewBase.prototype._move = function (args, preventMaxSnap) {
      var prevX = this._currX;
      var prevY = this._currY;
      var prevT = this._timestamp;
      var maxSnapScroll = this._maxSnapScroll;
      if (args) {
        this._currX = args.endX;
        this._currY = args.endY;
        this._timestamp = +new Date();
        var timeDelta = this._timestamp - prevT;
        if (timeDelta > 0 && timeDelta < 100) {
          var velocityX = (this._currX - prevX) / timeDelta;
          var velocityY = (this._currY - prevY) / timeDelta;
          this._velocityX = velocityX * 0.7 + this._velocityX * 0.3;
          this._velocityY = velocityY * 0.7 + this._velocityY * 0.3;
        }
      }
      if (maxSnapScroll && !preventMaxSnap) {
        this._delta = constrain(this._delta, -this._round * maxSnapScroll, this._round * maxSnapScroll);
      }
      this._scroll(constrain(this._startPos + this._delta, this._min - this.s.itemSize, this._max + this.s.itemSize));
      this._raf = false;
    };
    ScrollviewBase.defaults = {
      axis: 'Y',
      batchSize: 40,
      easing: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
      mouseSwipe: true,
      mousewheel: true,
      prevDef: true,
      selectedIndex: 0,
      spaceAround: true,
      stopProp: true,
      swipe: true,
      thresholdX: 10,
      thresholdY: 5
    };
    return ScrollviewBase;
  })(BaseComponent);

  /** @hidden */
  var Scrollview = /*#__PURE__*/ (function (_super) {
    __extends(Scrollview, _super);
    function Scrollview() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      // tslint:disable variable-name
      _this._setInnerEl = function (el) {
        _this._innerEl = el;
      };
      _this._setScrollEl = function (el) {
        _this._scrollEl = el;
      };
      _this._setScrollEl3d = function (el) {
        _this._scrollEl3d = el;
      };
      _this._setScrollbarEl = function (el) {
        _this._scrollbarEl = el;
      };
      _this._setScrollbarContEl = function (el) {
        _this._scrollbarContEl = el;
      };
      return _this;
    }
    // tslint:enable variable-name
    Scrollview.prototype._template = function (s) {
      var _this = this;
      var content = s.children;
      var content3d;
      if (s.itemRenderer) {
        content = this.visibleItems.map(function (item) {
          return s.itemRenderer(item, _this._offset);
        });
        if (s.scroll3d) {
          content3d = this.visible3dItems.map(function (item) {
            return s.itemRenderer(item, _this._offset, true);
          });
        }
      }
      // TODO: forward other props as well
      return createElement(
        'div',
        { ref: this._setEl, className: this._cssClass, style: s.styles },
        createElement(
          'div',
          { ref: this._setInnerEl, className: s.innerClass, style: s.innerStyles },
          createElement('div', { ref: this._setScrollEl, className: 'mbsc-scrollview-scroll' + this._rtl }, content)
        ),
        s.scroll3d &&
          createElement(
            'div',
            { ref: this._setScrollEl3d, style: { height: s.itemSize + 'px' }, className: 'mbsc-scroller-items-3d' },
            content3d
          ),
        createElement(
          'div',
          {
            ref: this._setScrollbarContEl,
            className:
              'mbsc-scroller-bar-cont ' +
              this._rtl +
              (!s.scrollBar || this._barSize === this._barContSize ? ' mbsc-scroller-bar-hidden' : '') +
              (this._started ? ' mbsc-scroller-bar-started' : '')
          },
          createElement('div', {
            className: 'mbsc-scroller-bar' + this._theme,
            ref: this._setScrollbarEl,
            style: { height: this._barSize + 'px' }
          })
        )
      );
    };
    return Scrollview;
  })(ScrollviewBase);

  /** @hidden */
  var CalendarDayBase = /*#__PURE__*/ (function (_super) {
    __extends(CalendarDayBase, _super);
    function CalendarDayBase() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      // tslint:enable variable-name
      // tslint:disable-next-line variable-name
      _this._onClick = function (ev) {
        _this._cellClick('onDayClick', ev);
      };
      // tslint:disable-next-line variable-name
      _this._onRightClick = function (ev) {
        _this._cellClick('onDayRightClick', ev);
      };
      // tslint:disable-next-line variable-name
      _this._onLabelClick = function (args) {
        _this._labelClick('onLabelClick', args);
      };
      // tslint:disable-next-line variable-name
      _this._onLabelDoubleClick = function (args) {
        _this._labelClick('onLabelDoubleClick', args);
      };
      // tslint:disable-next-line variable-name
      _this._onLabelRightClick = function (args) {
        _this._labelClick('onLabelRightClick', args);
      };
      // tslint:disable-next-line variable-name
      _this._onLabelHoverIn = function (args) {
        _this._labelClick('onLabelHoverIn', args);
      };
      // tslint:disable-next-line variable-name
      _this._onLabelHoverOut = function (args) {
        _this._labelClick('onLabelHoverOut', args);
      };
      return _this;
    }
    CalendarDayBase.prototype._mounted = function () {
      var _this = this;
      var allowCreate;
      var allowStart;
      var touchTimer;
      this._unlisten = gestureListener(this._el, {
        click: true,
        onBlur: function () {
          _this.setState({ hasFocus: false });
        },
        onDoubleClick: function (args) {
          var s = _this.s;
          if (s.clickToCreate && s.clickToCreate !== 'single' && s.labels && !s.disabled && s.display) {
            _this._hook('onLabelUpdateStart', args);
            _this._hook('onLabelUpdateEnd', args);
          }
          _this._cellClick('onDayDoubleClick', args.domEvent);
        },
        onEnd: function (args) {
          if (allowCreate) {
            // Will prevent mousedown event on doc, which would exit drag mode
            args.domEvent.preventDefault();
            // args.target = this._el;
            _this._hook('onLabelUpdateEnd', args);
            allowCreate = false;
          }
          clearTimeout(touchTimer);
          allowCreate = false;
          allowStart = false;
        },
        onFocus: function () {
          _this.setState({ hasFocus: true });
        },
        onHoverIn: function (ev) {
          var s = _this.s;
          if (!s.disabled) {
            _this.setState({ hasHover: true });
          }
          _this._hook('onHoverIn', {
            date: new Date(s.date),
            domEvent: ev,
            hidden: !s.display,
            outer: s.outer,
            target: _this._el
          });
        },
        onHoverOut: function (ev) {
          var s = _this.s;
          _this.setState({ hasHover: false });
          _this._hook('onHoverOut', {
            date: new Date(s.date),
            domEvent: ev,
            hidden: !s.display,
            outer: s.outer,
            target: _this._el
          });
        },
        onKeyDown: function (ev) {
          switch (ev.keyCode) {
            case ENTER:
            case SPACE:
              ev.preventDefault();
              _this._onClick(ev);
              break;
          }
        },
        onMove: function (args) {
          if (allowCreate && _this.s.dragToCreate) {
            args.domEvent.preventDefault();
            _this._hook('onLabelUpdateMove', args);
          } else if (allowStart && _this.s.dragToCreate && (Math.abs(args.deltaX) > 7 || Math.abs(args.deltaY) > 7)) {
            allowCreate = !args.isTouch;
            _this._hook('onLabelUpdateStart', args);
          } else {
            clearTimeout(touchTimer);
          }
        },
        onStart: function (args) {
          var s = _this.s;
          args.create = true;
          if (!s.disabled && (s.dragToCreate || s.clickToCreate) && s.labels && !allowCreate) {
            // Check if we started on a label or not
            var label = closest(args.domEvent.target, '.mbsc-calendar-text', _this._el);
            if (!label) {
              if (args.isTouch && s.dragToCreate) {
                touchTimer = setTimeout(function () {
                  _this._hook('onLabelUpdateStart', args);
                  _this._hook('onLabelUpdateModeOn', args);
                  allowCreate = true;
                }, 350);
              } else if (s.clickToCreate === 'single') {
                _this._hook('onLabelUpdateStart', args);
                allowCreate = true;
              } else {
                allowStart = !args.isTouch;
              }
            }
          }
        }
      });
    };
    CalendarDayBase.prototype._render = function (s, state) {
      var now = createDate(s);
      var d = s.date;
      var colors = s.colors,
        display = s.display,
        dragData = s.dragData,
        hoverEnd = s.hoverEnd,
        hoverStart = s.hoverStart,
        labels = s.labels,
        rangeEnd = s.rangeEnd,
        rangeStart = s.rangeStart;
      var date = new Date(d);
      var dateKey = getDateStr(date);
      var isToday = isSameDay(now, date);
      var events = labels && labels.events;
      var color = colors && colors[0];
      var background = color && color.background;
      var highlight = color && color.highlight;
      var cellClass = '';
      var highlightClass = '';
      this._draggedLabel = dragData && dragData.draggedDates && dragData.draggedDates[dateKey];
      this._draggedLabelOrig = dragData && dragData.originDates && dragData.originDates[dateKey];
      this._todayClass = isToday ? ' mbsc-calendar-today' : '';
      this._cellStyles = background && display ? { backgroundColor: background, color: getTextColor(background) } : UNDEFINED;
      this._circleStyles = highlight ? { backgroundColor: highlight, color: getTextColor(color.highlight) } : UNDEFINED;
      this._ariaLabel =
        s.type === 'day'
          ? (isToday ? s.todayText + ', ' : '') + s.day + ', ' + s.month + ' ' + s.text + ', ' + s.year
          : s.type === 'month'
          ? s.month
          : '';
      // Only add highlight classes if the cell is actually displayed
      if (display) {
        // range selection can start with a rangeStart or with a rangeEnd without the other
        // the same classes are needed in both cases
        if (
          (rangeStart && d >= rangeStart && d <= (rangeEnd || rangeStart)) ||
          (rangeEnd && d <= rangeEnd && d >= (rangeStart || rangeEnd))
        ) {
          highlightClass =
            ' mbsc-range-day' +
            (d === (rangeStart || rangeEnd) ? ' mbsc-range-day-start' : '') +
            (d === (rangeEnd || rangeStart) ? ' mbsc-range-day-end' : '');
        }
        if (hoverStart && hoverEnd && d >= hoverStart && d <= hoverEnd) {
          highlightClass +=
            ' mbsc-range-hover' +
            (d === hoverStart ? ' mbsc-range-hover-start mbsc-hover' : '') +
            (d === hoverEnd ? ' mbsc-range-hover-end mbsc-hover' : '');
        }
      }
      if (s.marks) {
        s.marks.forEach(function (e) {
          cellClass += e.cellCssClass ? ' ' + e.cellCssClass : '';
        });
      }
      if (colors) {
        colors.forEach(function (e) {
          cellClass += e.cellCssClass ? ' ' + e.cellCssClass : '';
        });
      }
      if (events) {
        events.forEach(function (e) {
          cellClass += e.cellCssClass ? ' ' + e.cellCssClass : '';
        });
      }
      this._cssClass =
        'mbsc-calendar-cell mbsc-flex-1-0-0 mbsc-calendar-' +
        s.type +
        this._theme +
        this._rtl +
        this._hb +
        cellClass +
        (labels ? ' mbsc-calendar-day-labels' : '') +
        (colors ? ' mbsc-calendar-day-colors' : '') +
        (s.outer ? ' mbsc-calendar-day-outer' : '') +
        (s.hasMarks ? ' mbsc-calendar-day-marked' : '') +
        (s.disabled ? ' mbsc-disabled' : '') +
        (display ? '' : ' mbsc-calendar-day-empty') +
        (s.selected ? ' mbsc-selected' : '') +
        (state.hasFocus ? ' mbsc-focus' : '') +
        // hover styling needed only on hoverStart and hoverEnd dates in the case of range hover
        // we can tell if no range hover is in place when neither hoverStart nor hoverEnd is there
        (state.hasHover && (d === hoverStart || d === hoverEnd || (!hoverStart && !hoverEnd)) ? ' mbsc-hover' : '') +
        (this._draggedLabel ? ' mbsc-calendar-day-highlight' : '') +
        highlightClass;
      this._data = {
        date: date,
        events: events,
        selected: s.selected
      };
    };
    CalendarDayBase.prototype._destroy = function () {
      this._unlisten();
    };
    CalendarDayBase.prototype._cellClick = function (name, domEvent) {
      var s = this.s;
      if (s.display) {
        this._hook(name, {
          date: new Date(s.date),
          disabled: s.disabled,
          domEvent: domEvent,
          outer: s.outer,
          selected: s.selected,
          source: 'calendar',
          target: this._el
        });
      }
    };
    CalendarDayBase.prototype._labelClick = function (name, args) {
      var s = this.s;
      args.date = new Date(s.date);
      args.labels = s.labels.events;
      this._hook(name, args);
    };
    return CalendarDayBase;
  })(BaseComponent);

  var stateObservables = {};
  /** @hidden */
  var CalendarLabelBase = /*#__PURE__*/ (function (_super) {
    __extends(CalendarLabelBase, _super);
    function CalendarLabelBase() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      // tslint:enable variable-name
      // tslint:disable-next-line: variable-name
      _this._onClick = function (ev) {
        if (_this._isDrag) {
          ev.stopPropagation();
        } else {
          _this._triggerEvent('onClick', ev);
          var s = _this.s;
          var observable = stateObservables[s.id];
          if (observable && s.selected) {
            observable.next({ hasFocus: false });
          }
        }
      };
      // tslint:disable-next-line: variable-name
      _this._onRightClick = function (ev) {
        _this._triggerEvent('onRightClick', ev);
      };
      // tslint:disable-next-line: variable-name
      _this._onDocTouch = function (ev) {
        unlisten(_this._doc, TOUCH_START, _this._onDocTouch);
        unlisten(_this._doc, MOUSE_DOWN, _this._onDocTouch);
        _this._isDrag = false;
        _this._hook('onDragModeOff', {
          data: _this.s.event
        });
      };
      // tslint:disable-next-line: variable-name
      _this._updateState = function (args) {
        if (_this.s.showText) {
          _this.setState(args);
        }
      };
      // tslint:disable-next-line: variable-name
      _this._triggerEvent = function (name, ev) {
        _this._hook(name, {
          domEvent: ev,
          label: _this.s.event,
          target: _this._el
        });
      };
      return _this;
    }
    CalendarLabelBase.prototype._mounted = function () {
      var _this = this;
      var opt = this.s;
      var id = opt.id;
      var isPicker = opt.isPicker;
      var resizeDir;
      var observable = stateObservables[id];
      if (!observable) {
        observable = new Observable();
        stateObservables[id] = observable;
      }
      this._unsubscribe = observable.subscribe(this._updateState);
      this._doc = getDocument(this._el);
      this._unlisten = gestureListener(this._el, {
        keepFocus: true,
        onBlur: function () {
          if (!isPicker) {
            observable.next({ hasFocus: false });
          }
        },
        onDoubleClick: function (ev) {
          // Prevent event creation on label double click
          ev.domEvent.stopPropagation();
          _this._hook('onDoubleClick', {
            domEvent: ev.domEvent,
            label: _this.s.event,
            target: _this._el
          });
        },
        onEnd: function (ev) {
          if (_this._isDrag) {
            var s = _this.s;
            var args = __assign({}, ev);
            // Will prevent mousedown event on doc
            args.domEvent.preventDefault();
            args.data = s.event;
            // args.target = this._el;
            if (s.resize && resizeDir) {
              args.resize = true;
              args.direction = resizeDir;
            } else if (s.drag) {
              args.drag = true;
            }
            _this._hook('onDragEnd', args);
            // Turn off update, unless we're in touch update mode
            if (!s.isUpdate) {
              _this._isDrag = false;
            }
          }
          clearTimeout(_this._touchTimer);
          resizeDir = UNDEFINED;
        },
        onFocus: function () {
          if (!isPicker) {
            observable.next({ hasFocus: true });
          }
        },
        onHoverIn: function (ev) {
          if (_this._isDrag || isPicker) {
            return;
          }
          observable.next({ hasHover: true });
          _this._triggerEvent('onHoverIn', ev);
        },
        onHoverOut: function (ev) {
          observable.next({ hasHover: false });
          _this._triggerEvent('onHoverOut', ev);
        },
        onKeyDown: function (ev) {
          var event = _this.s.event;
          switch (ev.keyCode) {
            case ENTER:
            case SPACE:
              _this._el.click();
              ev.preventDefault();
              break;
            case BACKSPACE:
            case DELETE:
              if (event && event.editable !== false) {
                _this._hook('onDelete', {
                  domEvent: ev,
                  event: event,
                  source: 'calendar'
                });
              }
              break;
          }
        },
        onMove: function (ev) {
          var s = _this.s;
          var args = __assign({}, ev);
          args.data = s.event;
          if (resizeDir) {
            args.resize = true;
            args.direction = resizeDir;
          } else if (s.drag) {
            args.drag = true;
          } else {
            return;
          }
          if (!s.event || s.event.editable === false) {
            return;
          }
          if (_this._isDrag) {
            // Prevent page scroll
            args.domEvent.preventDefault();
            _this._hook('onDragMove', args);
          } else if (Math.abs(args.deltaX) > 7 || Math.abs(args.deltaY) > 7) {
            clearTimeout(_this._touchTimer);
            if (!args.isTouch) {
              _this._isDrag = true;
              _this._hook('onDragStart', args);
            }
          }
        },
        onStart: function (ev) {
          var s = _this.s;
          var args = __assign({}, ev);
          var target = args.domEvent.target;
          args.data = s.event;
          if (s.resize && target.classList.contains('mbsc-calendar-label-resize')) {
            resizeDir = target.classList.contains('mbsc-calendar-label-resize-start') ? 'start' : 'end';
            args.resize = true;
            args.direction = resizeDir;
          } else if (s.drag) {
            args.drag = true;
          } else {
            return;
          }
          if (!s.event || s.event.editable === false) {
            return;
          }
          if (_this._isDrag || !args.isTouch) {
            // Prevent exiting drag mode in case of touch,
            // prevent calendar swipe in case of mouse drag
            args.domEvent.stopPropagation();
          }
          if (_this._isDrag) {
            _this._hook('onDragStart', args);
          } else if (args.isTouch) {
            _this._touchTimer = setTimeout(function () {
              _this._hook('onDragModeOn', args);
              _this._hook('onDragStart', args);
              _this._isDrag = true;
            }, 350);
          }
        }
      });
      if (this._isDrag) {
        listen(this._doc, TOUCH_START, this._onDocTouch);
        listen(this._doc, MOUSE_DOWN, this._onDocTouch);
      }
    };
    CalendarLabelBase.prototype._destroy = function () {
      if (this._unsubscribe) {
        var id = this.s.id;
        var observable = stateObservables[id];
        if (observable) {
          observable.unsubscribe(this._unsubscribe);
          if (!observable.nr) {
            delete stateObservables[id];
          }
        }
      }
      if (this._unlisten) {
        this._unlisten();
      }
      unlisten(this._doc, TOUCH_START, this._onDocTouch);
      unlisten(this._doc, MOUSE_DOWN, this._onDocTouch);
    };
    CalendarLabelBase.prototype._render = function (s, state) {
      var event = s.event;
      var d = new Date(s.date);
      var render = s.render || s.renderContent;
      var start;
      var end;
      var isMultiDay = false;
      var isStart;
      var isEnd;
      var isEndStyle;
      var text;
      this._isDrag = this._isDrag || s.isUpdate;
      this._content = UNDEFINED;
      this._title = s.more || s.count || !s.showEventTooltip ? UNDEFINED : htmlToText(event.tooltip || event.title || event.text);
      this._tabIndex = s.isActiveMonth && s.showText && !s.count && !s.isPicker ? 0 : -1;
      if (event) {
        var allDay = event.allDay;
        var tzOpt = allDay ? UNDEFINED : s;
        start = event.start ? makeDate(event.start, tzOpt) : null;
        end = event.end ? makeDate(event.end, tzOpt) : null;
        var endTime = start && end && getEndDate(s, allDay, start, end, true);
        var firstDayOfWeek = getFirstDayOfWeek(d, s);
        var lastDayOfWeek = addDays(firstDayOfWeek, 7);
        var lastDay = s.lastDay && s.lastDay < lastDayOfWeek ? s.lastDay : lastDayOfWeek;
        isMultiDay = start && endTime && !isSameDay(start, endTime);
        isStart = !isMultiDay || (start && isSameDay(start, d));
        isEnd = !isMultiDay || (endTime && isSameDay(endTime, d));
        isEndStyle = !isMultiDay || (s.showText ? endTime < lastDay : isEnd);
        this._hasResizeStart = s.resize && isStart;
        this._hasResizeEnd = s.resize && isEndStyle;
        var color = event.color;
        if (!color && event.resource && s.resourcesMap) {
          var resource = s.resourcesMap[isArray(event.resource) ? event.resource[0] : event.resource];
          color = resource && resource.color;
        }
        if (s.showText) {
          this._textColor = color ? getTextColor(color) : UNDEFINED;
        }
        this._color = s.render || s.template ? UNDEFINED : event.textColor && !color ? 'transparent' : color;
      }
      if (event && s.showText && (render || s.contentTemplate || s.template)) {
        var fillsAllDay = event.allDay || !start || (isMultiDay && !isStart && !isEnd);
        this._data = {
          end: !fillsAllDay && isEnd && end ? formatDate(s.timeFormat, end, s) : '',
          id: event.id,
          isMultiDay: isMultiDay,
          original: event,
          start: !fillsAllDay && isStart && start ? formatDate(s.timeFormat, start, s) : '',
          title: this._title
        };
        if (render) {
          var content = render(this._data);
          if (isString(content)) {
            text = content;
          } else {
            this._content = content;
          }
        }
      } else {
        text = s.more || s.count || (s.showText ? event.title || event.text || '' : '');
      }
      if (text !== this._text) {
        this._text = text;
        this._html = text ? this._safeHtml(text) : UNDEFINED;
        this._shouldEnhance = text && event && s.showText && !!render;
      }
      this._cssClass =
        'mbsc-calendar-text' +
        this._theme +
        this._rtl +
        ((state.hasFocus && !s.inactive && !s.selected) || (s.selected && s.showText) ? ' mbsc-calendar-label-active ' : '') +
        (state.hasHover && !s.inactive && !this._isDrag ? ' mbsc-calendar-label-hover' : '') +
        (s.more ? ' mbsc-calendar-text-more' : s.render || s.template ? ' mbsc-calendar-custom-label' : ' mbsc-calendar-label') +
        (s.inactive ? ' mbsc-calendar-label-inactive' : '') +
        (s.isUpdate ? ' mbsc-calendar-label-dragging' : '') +
        (s.hidden ? ' mbsc-calendar-label-hidden' : '') +
        (isStart ? ' mbsc-calendar-label-start' : '') +
        (isEndStyle ? ' mbsc-calendar-label-end' : '') +
        (event && event.editable === false ? ' mbsc-readonly-event' : '');
    };
    return CalendarLabelBase;
  })(BaseComponent);

  /** @hidden */
  var CalendarLabel = /*#__PURE__*/ (function (_super) {
    __extends(CalendarLabel, _super);
    function CalendarLabel() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    CalendarLabel.prototype._template = function (s) {
      var editable = s.event && s.event.editable !== false;
      return createElement(
        'div',
        {
          'aria-hidden': s.showText ? UNDEFINED : 'true',
          className: this._cssClass,
          'data-id': s.showText && s.event ? s.event.id : null,
          onClick: this._onClick,
          onContextMenu: this._onRightClick,
          ref: this._setEl,
          role: s.showText ? 'button' : UNDEFINED,
          style: { color: this._color },
          tabIndex: this._tabIndex,
          title: this._title
        },
        this._hasResizeStart &&
          editable &&
          createElement('div', {
            className:
              'mbsc-calendar-label-resize mbsc-calendar-label-resize-start' +
              this._rtl +
              (s.isUpdate ? ' mbsc-calendar-label-resize-start-touch' : '')
          }),
        this._hasResizeEnd &&
          editable &&
          createElement('div', {
            className:
              'mbsc-calendar-label-resize mbsc-calendar-label-resize-end' +
              this._rtl +
              (s.isUpdate ? ' mbsc-calendar-label-resize-end-touch' : '')
          }),
        s.showText && !s.more && !s.render && createElement('div', { className: 'mbsc-calendar-label-background' + this._theme }),
        s.showText && !s.more && s.render
          ? this._html
            ? createElement('div', { dangerouslySetInnerHTML: this._html })
            : this._content
          : createElement(
              'div',
              { className: 'mbsc-calendar-label-inner' + this._theme, style: { color: this._textColor } },
              createElement(
                'div',
                {
                  'aria-hidden': 'true',
                  className: 'mbsc-calendar-label-text' + this._theme,
                  dangerouslySetInnerHTML: this._html,
                  style: { color: s.event && s.event.textColor }
                },
                this._content
              ),
              s.label && createElement('div', { className: 'mbsc-hidden-content' }, s.label)
            )
      );
    };
    return CalendarLabel;
  })(CalendarLabelBase);

  /** @hidden */
  var CalendarDay = /*#__PURE__*/ (function (_super) {
    __extends(CalendarDay, _super);
    function CalendarDay() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    CalendarDay.prototype._renderEvent = function (s, label, showText, hidden, isUpdate, key) {
      return createElement(CalendarLabel, {
        key: key,
        amText: s.amText,
        count: label.count ? label.count + ' ' + (label.count > 1 ? s.eventsText : s.eventText) : UNDEFINED,
        date: s.date,
        dataTimezone: s.dataTimezone,
        displayTimezone: s.displayTimezone,
        drag: s.dragToMove,
        resize: s.dragToResize,
        event: label.event,
        exclusiveEndDates: s.exclusiveEndDates,
        firstDay: s.firstDay,
        hidden: hidden,
        id: label.id,
        inactive: !isUpdate && label.event && s.dragData && s.dragData.draggedEvent && label.event.id === s.dragData.draggedEvent.id,
        isActiveMonth: s.isActiveMonth,
        isPicker: s.isPicker,
        isUpdate: isUpdate,
        label: label.label,
        lastDay: label.lastDay,
        more: label.more,
        pmText: s.pmText,
        resourcesMap: s.resourcesMap,
        rtl: s.rtl,
        selected: label.event && s.selectedEventsMap && (s.selectedEventsMap[label.id] || s.selectedEventsMap[label.event.id]),
        showEventTooltip: s.showEventTooltip,
        showText: showText,
        theme: s.theme,
        timeFormat: s.timeFormat,
        timezonePlugin: s.timezonePlugin,
        render: s.renderLabel,
        renderContent: s.renderLabelContent,
        onClick: this._onLabelClick,
        onDoubleClick: this._onLabelDoubleClick,
        onRightClick: this._onLabelRightClick,
        onHoverIn: this._onLabelHoverIn,
        onHoverOut: this._onLabelHoverOut,
        onDelete: s.onLabelDelete,
        onDragStart: s.onLabelUpdateStart,
        onDragMove: s.onLabelUpdateMove,
        onDragEnd: s.onLabelUpdateEnd,
        onDragModeOn: s.onLabelUpdateModeOn,
        onDragModeOff: s.onLabelUpdateModeOff
      });
    };
    CalendarDay.prototype._renderLabel = function (s, label) {
      var key = label.id;
      if (label.placeholder) {
        return createElement('div', { className: 'mbsc-calendar-text mbsc-calendar-text-placeholder', key: key });
      }
      if (label.more || label.count) {
        return this._renderEvent(s, label, true, false, false, key);
      }
      return label.multiDay
        ? [
            createElement(
              'div',
              { className: 'mbsc-calendar-label-wrapper', style: { width: label.width + '%' }, key: key },
              this._renderEvent(s, label, true)
            ),
            this._renderEvent(s, label, false, false, false, '-' + key)
          ]
        : this._renderEvent(s, label, label.showText, false, false, key);
    };
    CalendarDay.prototype._template = function (s) {
      var _this = this;
      var draggedLabel = this._draggedLabel;
      var draggedLabelOrig = this._draggedLabelOrig;
      var theme = this._theme;
      var content;
      if (s.renderDay) {
        content = s.renderDay(this._data);
      }
      if (s.renderDayContent) {
        content = s.renderDayContent(this._data);
      }
      if (isString(content)) {
        content = createElement('div', { dangerouslySetInnerHTML: this._safeHtml(content) });
        this._shouldEnhance = true;
      }
      return createElement(
        'div',
        {
          ref: this._setEl,
          className: this._cssClass,
          onClick: this._onClick,
          onContextMenu: this._onRightClick,
          style: this._cellStyles,
          tabIndex: s.disabled ? UNDEFINED : s.active ? 0 : -1
        },
        createElement(
          'div',
          {
            className:
              'mbsc-calendar-cell-inner mbsc-calendar-' +
              s.type +
              '-inner' +
              theme +
              (s.type === 'day' ? '' : this._hb) +
              (s.display ? '' : ' mbsc-calendar-day-hidden')
          },
          s.renderDay
            ? content
            : createElement(
                Fragment,
                null,
                s.text === 1 &&
                  createElement('div', { 'aria-hidden': 'true', className: 'mbsc-calendar-month-name' + theme + this._rtl }, s.monthShort),
                createElement(
                  'div',
                  {
                    'aria-label': this._ariaLabel,
                    role: 'button',
                    'aria-pressed': s.selected,
                    className: 'mbsc-calendar-cell-text mbsc-calendar-' + s.type + '-text' + theme + this._todayClass,
                    style: this._circleStyles
                  },
                  s.text
                ),
                s.marks && // Extra div is needed in RTL, otherwise position is wrong in Chrome
                  createElement(
                    'div',
                    null,
                    createElement(
                      'div',
                      { className: 'mbsc-calendar-marks' + theme + this._rtl },
                      s.marks.map(function (mark, k) {
                        return createElement('div', {
                          className: 'mbsc-calendar-mark ' + (mark.markCssClass || '') + theme,
                          key: k,
                          style: { background: mark.color }
                        });
                      })
                    )
                  ),
                s.renderDayContent && content
              ),
          s.labels && // Extra div is needed in RTL, otherwise position is wrong in Chrome
            createElement(
              'div',
              null,
              draggedLabelOrig &&
                draggedLabelOrig.event &&
                createElement(
                  'div',
                  { className: 'mbsc-calendar-labels mbsc-calendar-labels-dragging' },
                  createElement(
                    'div',
                    { style: { width: draggedLabelOrig.width + '%' || 100 + '%' } },
                    this._renderEvent(s, { id: 0, event: draggedLabelOrig.event }, true, !!s.dragData.draggedDates, true)
                  )
                ),
              draggedLabel &&
                draggedLabel.event &&
                createElement(
                  'div',
                  { className: 'mbsc-calendar-labels mbsc-calendar-labels-dragging' },
                  createElement(
                    'div',
                    { className: 'mbsc-calendar-label-wrapper', style: { width: draggedLabel.width + '%' || 100 + '%' } },
                    this._renderEvent(s, { id: 0, event: draggedLabel.event }, true, false, true)
                  )
                ),
              createElement(
                'div',
                { className: 'mbsc-calendar-labels' },
                s.labels.data.map(function (label) {
                  return _this._renderLabel(s, label);
                })
              ),
              createElement('div', { className: 'mbsc-calendar-text mbsc-calendar-text-placeholder' })
            )
        )
      );
    };
    return CalendarDay;
  })(CalendarDayBase);

  // tslint:disable no-non-null-assertion
  // tslint:disable directive-class-suffix
  // tslint:disable directive-selector
  /** @hidden */
  var CalendarViewBase = /*#__PURE__*/ (function (_super) {
    __extends(CalendarViewBase, _super);
    function CalendarViewBase() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      _this.state = {
        height: 'sm',
        // maxLabels: 0,
        pageSize: 0,
        pickerSize: 0,
        // view: MONTH_VIEW,
        width: 'sm'
      };
      _this._dim = {};
      _this._months = [1, 2, 3]; // TODO: this is crap
      _this._title = [];
      _this.MONTH_VIEW = MONTH_VIEW;
      _this.YEAR_VIEW = YEAR_VIEW;
      _this.MULTI_YEAR_VIEW = MULTI_YEAR_VIEW;
      // tslint:enable variable-name
      // ---
      /**
       * Navigates to next page
       */
      _this.nextPage = function () {
        _this._prevDocClick();
        switch (_this._view) {
          case MULTI_YEAR_VIEW:
            _this._activeYearsChange(1);
            break;
          case YEAR_VIEW:
            _this._activeYearChange(1);
            break;
          default:
            _this._activeChange(1);
        }
      };
      /**
       * Navigates to previous page
       */
      _this.prevPage = function () {
        _this._prevDocClick();
        switch (_this._view) {
          case MULTI_YEAR_VIEW:
            _this._activeYearsChange(-1);
            break;
          case YEAR_VIEW:
            _this._activeYearChange(-1);
            break;
          default:
            _this._activeChange(-1);
        }
      };
      // These are public because of the angular template only
      // ---
      // tslint:disable variable-name
      _this._changeView = function (newView) {
        var s = _this.s;
        var view = _this._view;
        var hasPicker = _this._hasPicker;
        var selectView = s.selectView;
        var isYearView = (s.showCalendar ? s.calendarType : s.eventRange) === 'year';
        if (!newView) {
          switch (view) {
            case MONTH_VIEW:
              newView = MULTI_YEAR_VIEW;
              break;
            case MULTI_YEAR_VIEW:
              newView = YEAR_VIEW;
              break;
            default:
              newView = hasPicker || selectView === YEAR_VIEW ? MULTI_YEAR_VIEW : MONTH_VIEW;
          }
          if (view === MULTI_YEAR_VIEW && isYearView) {
            newView = MONTH_VIEW;
          }
        }
        var skipAnimation = hasPicker && newView === selectView;
        _this.setState({
          view: newView,
          viewClosing: skipAnimation ? UNDEFINED : view,
          viewOpening: skipAnimation ? UNDEFINED : newView
        });
      };
      _this._onDayHoverIn = function (ev) {
        if (!_this._disableHover) {
          _this._hook('onDayHoverIn', ev);
          _this._hoverTimer = setTimeout(function () {
            var key = getDateStr(ev.date);
            if (_this._labels) {
              ev.labels = _this._labels[key];
            }
            if (_this._marked) {
              ev.marked = _this._marked[key];
            }
            _this._isHover = true;
            _this._hook('onCellHoverIn', ev);
          }, 150);
        }
      };
      _this._onDayHoverOut = function (ev) {
        if (!_this._disableHover) {
          _this._hook('onDayHoverOut', ev);
          clearTimeout(_this._hoverTimer);
          if (_this._isHover) {
            var key = getDateStr(ev.date);
            if (_this._labels) {
              ev.labels = _this._labels[key];
            }
            if (_this._marked) {
              ev.marked = _this._marked[key];
            }
            _this._isHover = false;
            _this._hook('onCellHoverOut', ev);
          }
        }
      };
      _this._onLabelClick = function (args) {
        _this._isLabelClick = true;
        _this._hook('onLabelClick', args);
      };
      _this._onDayClick = function (args) {
        _this._shouldFocus = !_this._isLabelClick;
        _this._prevAnim = false;
        _this._isLabelClick = false;
        _this._hook('onDayClick', args);
      };
      _this._onTodayClick = function (args) {
        _this._prevAnim = false;
        _this._hook('onActiveChange', {
          date: +removeTimezone(createDate(_this.s)),
          today: true
        });
        _this._hook('onTodayClick', {});
      };
      _this._onMonthClick = function (args) {
        if (args.disabled) {
          return;
        }
        var d = args.date;
        var s = _this.s;
        if (s.selectView === YEAR_VIEW) {
          _this._hook('onDayClick', args);
        } else {
          var newIndex = getPageIndex(d, s);
          _this._changeView(MONTH_VIEW);
          _this._shouldFocus = true;
          _this._prevAnim = !_this._hasPicker;
          _this._hook('onActiveChange', {
            date: +d,
            // it is used for scrolling to the first day of the selected month in case of quick navigation
            nav: true,
            pageChange: newIndex !== _this._pageIndex
          });
        }
      };
      _this._onYearClick = function (args) {
        if (args.disabled) {
          return;
        }
        var d = args.date;
        var s = _this.s;
        var view = s.selectView;
        if (view === MULTI_YEAR_VIEW) {
          _this._hook('onDayClick', args);
        } else {
          _this._shouldFocus = true;
          _this._prevAnim = view === YEAR_VIEW;
          _this._activeMonth = +d;
          _this._changeView();
          if ((s.showCalendar ? s.calendarType : s.eventRange) === 'year') {
            var newIndex = getPageIndex(d, s);
            _this._hook('onActiveChange', {
              date: +d,
              pageChange: newIndex !== _this._pageIndex
            });
          }
        }
      };
      _this._onPageChange = function (args) {
        _this._isSwipeChange = true;
        _this._activeChange(args.diff);
      };
      _this._onYearPageChange = function (args) {
        _this._activeYearChange(args.diff);
      };
      _this._onYearsPageChange = function (args) {
        _this._activeYearsChange(args.diff);
      };
      _this._onAnimationEnd = function (args) {
        _this._disableHover = false;
        if (_this._isIndexChange) {
          _this._pageLoaded();
          _this._isIndexChange = false;
        }
      };
      _this._onStart = function () {
        clearTimeout(_this._hoverTimer);
      };
      _this._onGestureStart = function (args) {
        _this._disableHover = true;
        _this._hook('onGestureStart', args);
      };
      _this._onGestureEnd = function (args) {
        _this._prevDocClick();
      };
      _this._onPickerClose = function () {
        _this.setState({ view: MONTH_VIEW });
      };
      _this._onPickerOpen = function () {
        var pageHeight = _this._pickerCont.clientHeight;
        var pageWidth = _this._pickerCont.clientWidth;
        _this.setState({ pickerSize: _this._isVertical ? pageHeight : pageWidth });
      };
      _this._onPickerBtnClick = function (ev) {
        if (_this._view === MONTH_VIEW) {
          _this._pickerBtn = ev.currentTarget;
        }
        _this._prevDocClick();
        _this._changeView();
      };
      _this._onDocClick = function (ev) {
        var view = _this.s.selectView;
        if (!_this._prevClick && !_this._hasPicker && _this._view !== view && _this._pickerCont && !_this._pickerCont.contains(ev.target)) {
          _this._changeView(view);
        }
      };
      _this._onViewAnimationEnd = function () {
        if (_this.state.viewClosing) {
          _this.setState({ viewClosing: UNDEFINED });
        }
        if (_this.state.viewOpening) {
          _this.setState({ viewOpening: UNDEFINED });
        }
      };
      _this._onResize = function () {
        if (!_this._body || !isBrowser) {
          return;
        }
        var s = _this.s;
        var state = _this.state;
        var showCalendar = s.showCalendar;
        // In Chrome, if _body has a size in subpixels, the inner element will still have rounded pixel values,
        // so we calculate with the size of the inner element.
        var body = showCalendar /* TRIALCOND */ ? _this._body.querySelector('.mbsc-calendar-body-inner') : _this._body;
        // We need to use getBoundingClientRect to get the subpixel values if that's the case,
        // otherwise after multiple navigations the transform will be off
        // const rect = body.getBoundingClientRect();
        // const pageHeight = rect.height; // this._body.clientHeight;
        // const pageWidth = rect.width; // this._body.clientWidth;
        var totalWidth = _this._el.offsetWidth;
        var totalHeight = _this._el.offsetHeight;
        var pageHeight = body.clientHeight;
        var pageWidth = body.clientWidth;
        var pageSize = _this._isVertical ? pageHeight : pageWidth;
        var pickerSize = _this._hasPicker ? state.pickerSize : pageSize;
        var ready = showCalendar !== UNDEFINED;
        var width = 'sm';
        var height = 'sm';
        var maxLabels = 1;
        var hasScrollY = false;
        var cellTextHeight = 0;
        var labelHeight = 0;
        if (s.responsiveStyle && !_this._isGrid) {
          if (pageHeight > 300) {
            height = 'md';
          }
          if (pageWidth > 767) {
            width = 'md';
          }
        }
        if (width !== state.width || height !== state.height) {
          // Switch between mobile and desktop styling.
          // After the new classes are applied, labels and page sizes needs re-calculation
          _this._shouldCheckSize = true;
          _this.setState({ width: width, height: height });
        } else {
          if (_this._labels && showCalendar /* TRIALCOND */) {
            // Check how many labels can we display on a day
            // TODO: this must be refactored for React Native
            var placeholder = body.querySelector('.mbsc-calendar-text');
            var cell = body.querySelector('.mbsc-calendar-day-inner');
            var labelsCont = cell.querySelector('.mbsc-calendar-labels');
            var txtMargin = placeholder ? getDimension(placeholder, 'marginBottom') : 2;
            var txtHeight = placeholder ? placeholder.offsetHeight : 18;
            cellTextHeight = labelsCont.offsetTop;
            hasScrollY = body.scrollHeight > body.clientHeight;
            labelHeight = txtHeight + txtMargin;
            maxLabels = Math.max(1, floor((cell.clientHeight - cellTextHeight) / labelHeight));
          }
          _this._hook('onResize', {
            height: totalHeight,
            target: _this._el,
            width: totalWidth
          });
          s.navigationService.pageSize = pageSize;
          _this.setState({
            cellTextHeight: cellTextHeight,
            hasScrollY: hasScrollY,
            labelHeight: labelHeight,
            maxLabels: maxLabels,
            pageSize: pageSize,
            pickerSize: pickerSize,
            ready: ready
          });
        }
      };
      _this._onKeyDown = function (ev) {
        var s = _this.s;
        var view = _this._view;
        var active = view === MONTH_VIEW ? _this._active : _this._activeMonth;
        var activeDate = new Date(active);
        var year = s.getYear(activeDate);
        var month = s.getMonth(activeDate);
        var day = s.getDay(activeDate);
        var getDate = s.getDate;
        var weeks = s.weeks;
        var isMonthView = s.calendarType === 'month';
        var newDate;
        if (view === MULTI_YEAR_VIEW) {
          var newYear = void 0;
          switch (ev.keyCode) {
            case LEFT_ARROW:
              newYear = year - 1 * _this._rtlNr;
              break;
            case RIGHT_ARROW:
              newYear = year + 1 * _this._rtlNr;
              break;
            case UP_ARROW:
              newYear = year - 3;
              break;
            case DOWN_ARROW:
              newYear = year + 3;
              break;
            case HOME:
              newYear = _this._getPageYears(_this._yearsIndex);
              break;
            case END:
              newYear = _this._getPageYears(_this._yearsIndex) + 11;
              break;
            case PAGE_UP:
              newYear = year - 12;
              break;
            case PAGE_DOWN:
              newYear = year + 12;
              break;
          }
          if (newYear && _this._minYears <= newYear && _this._maxYears >= newYear) {
            ev.preventDefault();
            _this._shouldFocus = true;
            _this._prevAnim = false;
            _this._activeMonth = +getDate(newYear, 0, 1);
            _this.forceUpdate();
          }
        } else if (view === YEAR_VIEW) {
          switch (ev.keyCode) {
            case LEFT_ARROW:
              newDate = getDate(year, month - 1 * _this._rtlNr, 1);
              break;
            case RIGHT_ARROW:
              newDate = getDate(year, month + 1 * _this._rtlNr, 1);
              break;
            case UP_ARROW:
              newDate = getDate(year, month - 3, 1);
              break;
            case DOWN_ARROW:
              newDate = getDate(year, month + 3, 1);
              break;
            case HOME:
              newDate = getDate(year, 0, 1);
              break;
            case END:
              newDate = getDate(year, 11, 1);
              break;
            case PAGE_UP:
              newDate = getDate(year - 1, month, 1);
              break;
            case PAGE_DOWN:
              newDate = getDate(year + 1, month, 1);
              break;
          }
          if (newDate && _this._minYear <= newDate && _this._maxYear >= newDate) {
            ev.preventDefault();
            _this._shouldFocus = true;
            _this._prevAnim = false;
            _this._activeMonth = +newDate;
            _this.forceUpdate();
          }
        } else if (view === MONTH_VIEW) {
          switch (ev.keyCode) {
            case LEFT_ARROW:
              newDate = getDate(year, month, day - 1 * _this._rtlNr);
              break;
            case RIGHT_ARROW:
              newDate = getDate(year, month, day + 1 * _this._rtlNr);
              break;
            case UP_ARROW:
              newDate = getDate(year, month, day - 7);
              break;
            case DOWN_ARROW:
              newDate = getDate(year, month, day + 7);
              break;
            case HOME:
              newDate = getDate(year, month, 1);
              break;
            case END:
              newDate = getDate(year, month + 1, 0);
              break;
            case PAGE_UP:
              newDate = ev.altKey
                ? getDate(year - 1, month, day)
                : isMonthView
                ? getDate(year, month - 1, day)
                : getDate(year, month, day - weeks * 7);
              break;
            case PAGE_DOWN:
              newDate = ev.altKey
                ? getDate(year + 1, month, day)
                : isMonthView
                ? getDate(year, month + 1, day)
                : getDate(year, month, day + weeks * 7);
              break;
          }
          if (newDate && _this._minDate <= newDate && _this._maxDate >= newDate) {
            ev.preventDefault();
            var newIndex = getPageIndex(newDate, s);
            _this._shouldFocus = true;
            _this._prevAnim = false;
            _this._pageChange = s.noOuterChange && newIndex !== _this._pageIndex;
            _this._hook('onActiveChange', {
              date: +newDate,
              pageChange: _this._pageChange
            });
          }
        }
      };
      return _this;
    }
    CalendarViewBase.prototype._getPageDay = function (pageIndex) {
      return +getFirstPageDay(pageIndex, this.s);
    };
    CalendarViewBase.prototype._getPageStyle = function (index, offset, pageNr) {
      var _a;
      return (
        (_a = {}),
        (_a[(jsPrefix ? jsPrefix + 'T' : 't') + 'ransform'] = 'translate' + this._axis + '(' + (index - offset) * 100 * this._rtlNr + '%)'),
        (_a.width = 100 / (pageNr || 1) + '%'),
        _a
      );
    };
    CalendarViewBase.prototype._getPageYear = function (pageIndex) {
      var s = this.s;
      var refDate = s.refDate ? makeDate(s.refDate) : REF_DATE;
      var year = s.getYear(refDate);
      return year + pageIndex;
    };
    CalendarViewBase.prototype._getPageYears = function (pageIndex) {
      var s = this.s;
      var refDate = s.refDate ? makeDate(s.refDate) : REF_DATE;
      var year = s.getYear(refDate);
      return year + pageIndex * 12;
    };
    CalendarViewBase.prototype._getPickerClass = function (view) {
      var animName;
      var pickerName = view === this.s.selectView ? ' mbsc-calendar-picker-main' : '';
      var baseName = 'mbsc-calendar-picker';
      var hasPicker = this._hasPicker;
      var _a = this.state,
        viewClosing = _a.viewClosing,
        viewOpening = _a.viewOpening;
      switch (view) {
        case MONTH_VIEW:
          animName = hasPicker ? '' : (viewOpening === MONTH_VIEW ? 'in-down' : '') + (viewClosing === MONTH_VIEW ? 'out-down' : '');
          break;
        case MULTI_YEAR_VIEW:
          animName =
            hasPicker && viewClosing === MONTH_VIEW
              ? ''
              : (viewOpening === MULTI_YEAR_VIEW ? 'in-up' : '') + (viewClosing === MULTI_YEAR_VIEW ? 'out-up' : '');
          break;
        default:
          animName =
            hasPicker && viewOpening === MONTH_VIEW
              ? ''
              : (viewOpening === YEAR_VIEW ? (viewClosing === MULTI_YEAR_VIEW ? 'in-down' : 'in-up') : '') +
                (viewClosing === YEAR_VIEW ? (viewOpening === MULTI_YEAR_VIEW ? 'out-down' : 'out-up') : '');
      }
      return baseName + pickerName + (hasAnimation && animName ? ' ' + baseName + '-' + animName : '');
    };
    CalendarViewBase.prototype._isNextDisabled = function (isModalPicker) {
      if (!this._hasPicker || isModalPicker) {
        var view = this._view;
        if (view === MULTI_YEAR_VIEW) {
          return this._yearsIndex + 1 > this._maxYearsIndex;
        }
        if (view === YEAR_VIEW) {
          return this._yearIndex + 1 > this._maxYearIndex;
        }
      }
      return this._pageIndex + 1 > this._maxIndex;
    };
    CalendarViewBase.prototype._isPrevDisabled = function (isModalPicker) {
      if (!this._hasPicker || isModalPicker) {
        var view = this._view;
        if (view === MULTI_YEAR_VIEW) {
          return this._yearsIndex - 1 < this._minYearsIndex;
        }
        if (view === YEAR_VIEW) {
          return this._yearIndex - 1 < this._minYearIndex;
        }
      }
      return this._pageIndex - 1 < this._minIndex;
    };
    // tslint:enable variable-name
    // ---
    CalendarViewBase.prototype._render = function (s, state) {
      var getDate = s.getDate;
      var getYear = s.getYear;
      var getMonth = s.getMonth;
      var showCalendar = s.showCalendar;
      var calendarType = s.calendarType;
      var eventRange = s.eventRange;
      var eventRangeSize = s.eventRangeSize || 1;
      var firstWeekDay = s.firstDay;
      var isWeekView = calendarType === 'week';
      var isMonthView = calendarType === 'month';
      var isYearView = calendarType === 'year';
      var size = isYearView ? 12 : s.size || 1;
      var isGrid = size > 1 && !isWeekView;
      var weeks = showCalendar ? (isWeekView ? s.weeks : 6) : 0;
      var active = s.activeDate || this._active || +new Date();
      var activeChanged = active !== this._active;
      var d = new Date(active);
      var prevProps = this._prevS;
      var dateFormat = s.dateFormat;
      var monthNames = s.monthNames;
      var yearSuffix = s.yearSuffix;
      var variableRow = isNumeric(s.labelList) ? +s.labelList + 1 : s.labelList === 'all' ? -1 : 0;
      var labelListingChanged = s.labelList !== prevProps.labelList;
      var navService = s.navigationService;
      var pageIndex = navService.pageIndex;
      var firstDay = navService.firstDay;
      var lastDay = navService.lastDay;
      var start = navService.viewStart;
      var end = navService.viewEnd;
      this._minDate = navService.minDate;
      this._maxDate = navService.maxDate;
      if (!isEmpty(s.min)) {
        var min = getDateOnly(this._minDate);
        this._minDate = getDateOnly(min);
        this._minYear = getDate(getYear(min), getMonth(min), 1);
        this._minYears = getYear(min);
        this._minIndex = getPageIndex(min, s);
        this._minYearIndex = getYearIndex(min, s);
        this._minYearsIndex = getYearsIndex(min, s);
      } else {
        this._minIndex = -Infinity;
        this._minYears = -Infinity;
        this._minYearsIndex = -Infinity;
        this._minYear = -Infinity;
        this._minYearIndex = -Infinity;
      }
      if (!isEmpty(s.max)) {
        var max = this._maxDate;
        this._maxYear = getDate(getYear(max), getMonth(max) + 1, 1);
        this._maxYears = getYear(max);
        this._maxIndex = getPageIndex(max, s);
        this._maxYearIndex = getYearIndex(max, s);
        this._maxYearsIndex = getYearsIndex(max, s);
      } else {
        this._maxIndex = Infinity;
        this._maxYears = Infinity;
        this._maxYearsIndex = Infinity;
        this._maxYear = Infinity;
        this._maxYearIndex = Infinity;
      }
      // We only recalculate the page index if the new active date is outside of the current view limits,
      // or page change is forced (swipe, or prev/next arrows), or the view is changed
      var viewChanged =
        calendarType !== prevProps.calendarType ||
        eventRange !== prevProps.eventRange ||
        firstWeekDay !== prevProps.firstDay ||
        s.eventRangeSize !== prevProps.eventRangeSize ||
        s.refDate !== prevProps.refDate ||
        s.showCalendar !== prevProps.showCalendar ||
        s.weeks !== prevProps.weeks;
      if (viewChanged) {
        this._prevAnim = true;
      }
      if (activeChanged) {
        this._activeMonth = active;
      }
      this._view = state.view || s.selectView;
      this._yearsIndex = getYearsIndex(new Date(this._activeMonth), s);
      this._yearIndex = getYearIndex(new Date(this._activeMonth), s);
      if (this._view === YEAR_VIEW) {
        this._viewTitle = this._getPageYear(this._yearIndex) + '';
      } else if (this._view === MULTI_YEAR_VIEW) {
        var startYear = this._getPageYears(this._yearsIndex);
        this._viewTitle = startYear + ' - ' + (startYear + 11);
      }
      var pageNr = isGrid ? 1 : getPageNr(s.pages, state.pageSize);
      var isVertical = s.calendarScroll === 'vertical' && s.pages !== 'auto' && (s.pages === UNDEFINED || s.pages === 1);
      var showOuter = s.showOuterDays !== UNDEFINED ? s.showOuterDays : !isVertical && pageNr < 2 && (isWeekView || !size || size < 2);
      var monthIndex = dateFormat.search(/m/i);
      var yearIndex = dateFormat.search(/y/i);
      // Grid view
      if (isGrid) {
        this._monthsMulti = [];
        if (pageIndex !== UNDEFINED) {
          // Multiplying with 0.96 and 1.1 needed, because margins and paddings are used on the month grid
          var columns = floor((state.pageSize * 0.96) / (PAGE_WIDTH * 1.1)) || 1;
          while (size % columns) {
            columns--;
          }
          for (var i = 0; i < size / columns; ++i) {
            var rowItems = [];
            for (var j = 0; j < columns; ++j) {
              rowItems.push(+getDate(getYear(firstDay), getMonth(firstDay) + i * columns + j, 1));
            }
            this._monthsMulti.push(rowItems);
          }
        }
      }
      if (
        calendarType !== prevProps.calendarType ||
        s.theme !== prevProps.theme ||
        s.calendarScroll !== prevProps.calendarScroll ||
        s.hasContent !== prevProps.hasContent ||
        s.showCalendar !== prevProps.showCalendar ||
        s.showWeekNumbers !== prevProps.showWeekNumbers ||
        s.weeks !== prevProps.weeks ||
        labelListingChanged
      ) {
        this._shouldCheckSize = true;
      }
      if (prevProps.width !== s.width || prevProps.height !== s.height) {
        this._dim = {
          height: addPixel(s.height),
          width: addPixel(s.width)
        };
      }
      this._cssClass =
        'mbsc-calendar mbsc-font' +
        this._theme +
        this._rtl +
        (state.ready ? '' : ' mbsc-hidden') +
        (isGrid ? ' mbsc-calendar-grid-view' : ' mbsc-calendar-height-' + state.height + ' mbsc-calendar-width-' + state.width) +
        ' ' +
        s.cssClass;
      this._dayNames = state.width === 'sm' || isGrid ? s.dayNamesMin : s.dayNamesShort;
      this._isSwipeChange = false;
      this._yearFirst = yearIndex < monthIndex;
      this._pageNr = pageNr;
      this._variableRow = variableRow;
      // Only calculate labels/marks/colors when needed
      var forcePageLoad = s.pageLoad !== prevProps.pageLoad;
      var pageChanged = +start !== +this._viewStart || +end !== +this._viewEnd;
      if (this._pageIndex !== UNDEFINED && pageChanged) {
        this._isIndexChange = !this._isSwipeChange && !viewChanged;
      }
      if (pageIndex !== UNDEFINED) {
        this._pageIndex = pageIndex;
      }
      if (
        pageIndex !== UNDEFINED &&
        (s.marked !== prevProps.marked ||
          s.colors !== prevProps.colors ||
          s.labels !== prevProps.labels ||
          s.invalid !== prevProps.invalid ||
          s.valid !== prevProps.valid ||
          state.maxLabels !== this._maxLabels ||
          pageChanged ||
          labelListingChanged ||
          forcePageLoad)
      ) {
        this._maxLabels = state.maxLabels || 1;
        this._viewStart = start;
        this._viewEnd = end;
        var labelsMap = s.labelsMap || getEventMap(s.labels, start, end, s);
        var labels =
          labelsMap &&
          getLabels(
            s,
            labelsMap,
            start,
            end,
            this._variableRow || this._maxLabels,
            7,
            false,
            firstWeekDay,
            true,
            s.eventOrder,
            !showOuter,
            s.showLabelCount,
            s.moreEventsText,
            s.moreEventsPluralText
          );
        // If labels were not displayed previously, need to calculate how many labels can be placed
        if (labels && !this._labels) {
          this._shouldCheckSize = true;
        }
        if ((labels && state.maxLabels) || !labels) {
          this._shouldPageLoad = !this._isIndexChange || this._prevAnim || !showCalendar || forcePageLoad;
        }
        this._labelsLayout = labels;
        this._labels = labelsMap;
        this._marked = !labelsMap && (s.marksMap || getEventMap(s.marked, start, end, s));
        this._colors = getEventMap(s.colors, start, end, s);
        this._valid = getEventMap(s.valid, start, end, s, true);
        this._invalid = getEventMap(s.invalid, start, end, s, true);
      }
      // Generate the header title
      if (
        pageChanged ||
        activeChanged ||
        eventRange !== prevProps.eventRange ||
        eventRangeSize !== prevProps.eventRangeSize ||
        s.monthNames !== prevProps.monthNames
      ) {
        this._title = [];
        var lDay = addDays(lastDay, -1);
        var titleDate = pageIndex === UNDEFINED ? d : firstDay;
        // Check if a selected day is in the current view,
        // the title will be generated based on the selected day
        if (isWeekView) {
          titleDate = d;
          for (var _i = 0, _a = Object.keys(s.selectedDates); _i < _a.length; _i++) {
            var key = _a[_i];
            if (+key >= +firstDay && +key < +lastDay) {
              titleDate = new Date(+key);
              break;
            }
          }
        }
        if (this._pageNr > 1) {
          for (var i = 0; i < pageNr; i++) {
            var dt = getDate(getYear(firstDay), getMonth(firstDay) + i, 1);
            var yt = getYear(dt) + yearSuffix;
            var mt = monthNames[getMonth(dt)];
            this._title.push({ yearTitle: yt, monthTitle: mt });
          }
        } else {
          var titleObj = { yearTitle: getYear(titleDate) + yearSuffix, monthTitle: monthNames[getMonth(titleDate)] };
          var titleType = s.showSchedule && eventRangeSize === 1 ? eventRange : showCalendar ? calendarType : eventRange;
          var agendaOnly = eventRange && !showCalendar && (!s.showSchedule || eventRangeSize > 1);
          switch (titleType) {
            case 'year': {
              titleObj.title = getYear(firstDay) + yearSuffix;
              if (eventRangeSize > 1) {
                titleObj.title += ' - ' + (getYear(lDay) + yearSuffix);
              }
              break;
            }
            case 'month': {
              if (eventRangeSize > 1 && !showCalendar) {
                var monthStart = monthNames[getMonth(firstDay)];
                var yearStart = getYear(firstDay) + yearSuffix;
                var titleStart = this._yearFirst ? yearStart + ' ' + monthStart : monthStart + ' ' + yearStart;
                var monthEnd = monthNames[getMonth(lDay)];
                var yearEnd = getYear(lDay) + yearSuffix;
                var titleEnd = this._yearFirst ? yearEnd + ' ' + monthEnd : monthEnd + ' ' + yearEnd;
                titleObj.title = titleStart + ' - ' + titleEnd;
              } else if (isGrid) {
                titleObj.title = getYear(firstDay) + yearSuffix;
              }
              break;
            }
            case 'day':
            case 'week': {
              if (agendaOnly) {
                var dayIndex = dateFormat.search(/d/i);
                var shortDateFormat = dayIndex < monthIndex ? 'D MMM, YYYY' : 'MMM D, YYYY';
                titleObj.title = formatDate(shortDateFormat, firstDay, s);
                if (titleType === 'week' || eventRangeSize > 1) {
                  titleObj.title += ' - ' + formatDate(shortDateFormat, lDay, s);
                }
              }
              break;
            }
            // case 'day': {
            //   if (agendaOnly) {
            //     titleObj.title = formatDate(dateFormat, firstDay, s);
            //     if (eventRangeSize > 1) {
            //       titleObj.title += ' - ' + formatDate(dateFormat, lDay, s);
            //     }
            //   }
            // }
          }
          this._title.push(titleObj);
        }
      }
      this._active = active;
      this._hasPicker = s.hasPicker || isGrid || !isMonthView || !showCalendar || (state.width === 'md' && s.hasPicker !== false);
      this._axis = isVertical ? 'Y' : 'X';
      this._rtlNr = !isVertical && s.rtl ? -1 : 1;
      this._weeks = weeks;
      this._nextIcon = isVertical ? s.nextIconV : s.rtl ? s.prevIconH : s.nextIconH;
      this._prevIcon = isVertical ? s.prevIconV : s.rtl ? s.nextIconH : s.prevIconH;
      this._mousewheel = s.mousewheel === UNDEFINED ? isVertical : s.mousewheel;
      this._isGrid = isGrid;
      this._isVertical = isVertical;
      this._showOuter = showOuter;
    };
    CalendarViewBase.prototype._mounted = function () {
      this._observer = resizeObserver(this._el, this._onResize, this._zone);
      this._doc = getDocument(this._el);
      listen(this._doc, CLICK, this._onDocClick);
    };
    CalendarViewBase.prototype._updated = function () {
      var _this = this;
      if (this._shouldCheckSize) {
        setTimeout(function () {
          _this._onResize();
        });
        this._shouldCheckSize = false;
      } else if (this._shouldPageLoad) {
        // Trigger initial onPageLoaded if needed
        this._pageLoaded();
        this._shouldPageLoad = false;
      }
      if (this._shouldFocus) {
        // Angular needs setTimeout to wait for the next tick
        setTimeout(function () {
          _this._focusActive();
          _this._shouldFocus = false;
        });
      }
      if (this.s.instanceService) {
        this.s.instanceService.onComponentChange.next({});
      }
      this._pageChange = false;
      // TODO: why is this needed???
      if (this._variableRow && this._body.firstChild) {
        var body = this._body.firstChild;
        var hasScrollY = body.scrollHeight > body.clientHeight;
        if (hasScrollY !== this.state.hasScrollY) {
          this._shouldCheckSize = true;
          this.setState({ hasScrollY: hasScrollY });
        }
      }
    };
    CalendarViewBase.prototype._destroy = function () {
      if (this._observer) {
        this._observer.detach();
      }
      unlisten(this._doc, CLICK, this._onDocClick);
      clearTimeout(this._hoverTimer);
    };
    // ---
    CalendarViewBase.prototype._getActiveCell = function () {
      // TODO: get rid of direct DOM function
      var view = this._view;
      var cont = view === MONTH_VIEW ? this._body : this._pickerCont;
      var cell = view === MULTI_YEAR_VIEW ? 'year' : view === YEAR_VIEW ? 'month' : 'cell';
      return cont && cont.querySelector('.mbsc-calendar-' + cell + '[tabindex="0"]');
    };
    CalendarViewBase.prototype._focusActive = function () {
      var cell = this._getActiveCell();
      if (cell) {
        cell.focus();
      }
    };
    CalendarViewBase.prototype._pageLoaded = function () {
      var navService = this.s.navigationService;
      this._hook('onPageLoaded', {
        activeElm: this._getActiveCell(),
        firstDay: navService.firstPageDay,
        lastDay: navService.lastPageDay,
        month: this.s.calendarType === 'month' ? navService.firstDay : UNDEFINED,
        viewEnd: navService.viewEnd,
        viewStart: navService.viewStart
      });
    };
    CalendarViewBase.prototype._activeChange = function (diff) {
      var nextIndex = this._pageIndex + diff;
      if (this._minIndex <= nextIndex && this._maxIndex >= nextIndex /* TRIALCOND */) {
        this._prevAnim = false;
        this._pageChange = true;
        this._hook('onActiveChange', {
          date: this._getPageDay(nextIndex),
          dir: diff,
          pageChange: true
        });
      }
    };
    CalendarViewBase.prototype._activeYearsChange = function (diff) {
      var nextIndex = this._yearsIndex + diff;
      if (this._minYearsIndex <= nextIndex && this._maxYearsIndex >= nextIndex) {
        var newYear = this._getPageYears(nextIndex);
        this._prevAnim = false;
        this._activeMonth = +this.s.getDate(newYear, 0, 1);
        this.forceUpdate();
      }
    };
    CalendarViewBase.prototype._activeYearChange = function (diff) {
      var nextIndex = this._yearIndex + diff;
      if (this._minYearIndex <= nextIndex && this._maxYearIndex >= nextIndex) {
        var newYear = this._getPageYear(nextIndex);
        this._prevAnim = false;
        this._activeMonth = +this.s.getDate(newYear, 0, 1);
        this.forceUpdate();
      }
    };
    CalendarViewBase.prototype._prevDocClick = function () {
      var _this = this;
      this._prevClick = true;
      setTimeout(function () {
        _this._prevClick = false;
      });
    };
    return CalendarViewBase;
  })(BaseComponent);

  /** @jsxRuntime classic */
  /** @hidden */
  var CalendarWeekDays = function (props) {
    var firstDay = props.firstDay,
      hidden = props.hidden,
      rtl = props.rtl,
      theme = props.theme,
      dayNamesShort = props.dayNamesShort,
      showWeekNumbers = props.showWeekNumbers,
      hasScroll = props.hasScroll;
    return createElement(
      'div',
      { 'aria-hidden': 'true', className: 'mbsc-calendar-week-days mbsc-flex' + (hidden ? ' mbsc-hidden' : '') },
      showWeekNumbers && createElement('div', { className: 'mbsc-calendar-week-day mbsc-flex-none mbsc-calendar-week-nr' + theme + rtl }),
      ARRAY7.map(function (x, i) {
        return createElement(
          'div',
          { className: 'mbsc-calendar-week-day mbsc-flex-1-0-0' + theme + rtl, key: i },
          dayNamesShort[(i + firstDay) % 7]
        );
      }),
      hasScroll && createElement('div', { className: 'mbsc-schedule-fake-scroll-y' })
    );
  };

  /** @hidden */
  var MonthViewBase = /*#__PURE__*/ (function (_super) {
    __extends(MonthViewBase, _super);
    function MonthViewBase() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    MonthViewBase.prototype._isActive = function (d) {
      return this.s.isActive && d === this.s.activeDate;
    };
    MonthViewBase.prototype._isInvalid = function (d) {
      var s = this.s;
      var localDate = new Date(d);
      var timezoneDate = addTimezone(s, localDate);
      return isInvalid(s, timezoneDate, s.invalid, s.valid, +s.min, +s.max);
    };
    MonthViewBase.prototype._isSelected = function (d) {
      var localDate = new Date(d);
      var timezoneDate = addTimezone(this.s, localDate);
      return !!this.s.selectedDates[+timezoneDate];
    };
    MonthViewBase.prototype._getWeekNr = function (s, date) {
      var d = new Date(date);
      return '' + s.getWeekNumber(s.getDate(d.getFullYear(), d.getMonth(), d.getDate() + ((7 - s.firstDay + 1) % 7)));
    };
    // tslint:enable variable-name
    MonthViewBase.prototype._render = function (s) {
      // TODO: optimize what to calculate on render
      var weeks = s.weeks;
      var firstWeekDay = s.firstDay;
      var firstDay = new Date(s.firstPageDay);
      var year = s.getYear(firstDay);
      var month = s.getMonth(firstDay);
      var day = s.getDay(firstDay);
      var weekDay = s.getDate(year, month, day).getDay();
      var offset = firstWeekDay - weekDay > 0 ? 7 : 0;
      var row = [];
      var maxLabels = 0;
      this._rowHeights = [];
      this._rows = [];
      this._days = Array.apply(0, Array(7));
      for (var i = 0; i < 7 * weeks; i++) {
        var curr = s.getDate(year, month, i + firstWeekDay - offset - weekDay + day);
        var key = getDateStr(curr);
        var displayMonth = s.getMonth(curr);
        // let y = curr.getFullYear();
        // let m = curr.getMonth();
        // let d = curr.getDate();
        var outer = displayMonth !== month && s.calendarType !== 'week';
        var marked = s.marked && s.marked[key];
        var marks = marked ? (s.showSingleMark ? [{}] : marked) : null;
        var labels = s.labels && s.labels[key];
        var labelCount = labels ? labels.data.length : 0;
        var isWeekStart = i % 7 === 0;
        if (s.variableRow) {
          // Don't render rows containing fully outer days
          if (isWeekStart && outer && i) {
            break;
          }
          if (labelCount > maxLabels) {
            maxLabels = labelCount;
          }
          // Row end
          if (i % 7 === 6) {
            this._rowHeights.push(maxLabels * (s.labelHeight || 20) + (s.cellTextHeight || 0) + 3);
            maxLabels = 0;
          }
        }
        if (isWeekStart) {
          row = [];
          this._rows.push(row);
        }
        row.push({
          colors: s.colors && s.colors[key],
          date: +curr,
          day: s.dayNames[curr.getDay()],
          display: outer ? s.showOuter : true,
          labels: labels,
          marks: marks,
          month: s.monthNames[displayMonth],
          monthShort: s.monthNamesShort[displayMonth],
          outer: outer,
          text: s.getDay(curr),
          year: s.getYear(curr)
        });
      }
    };
    return MonthViewBase;
  })(BaseComponent);

  /** @hidden */
  var MonthView = /*#__PURE__*/ (function (_super) {
    __extends(MonthView, _super);
    function MonthView() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    MonthView.prototype._template = function (s) {
      var _this = this;
      var showWeekNumbers = s.showWeekNumbers;
      var calWeekDays = s.showWeekDays
        ? createElement(CalendarWeekDays, {
            dayNamesShort: s.dayNamesShort,
            firstDay: s.firstDay,
            rtl: this._rtl,
            showWeekNumbers: showWeekNumbers,
            theme: this._theme
          })
        : null;
      return createElement(
        'div',
        {
          'aria-hidden': s.isActive ? UNDEFINED : 'true',
          className: 'mbsc-calendar-table mbsc-flex-col mbsc-flex-1-1' + (s.isActive ? ' mbsc-calendar-table-active' : '')
        },
        calWeekDays,
        this._rows.map(function (row, i) {
          var weekNr = showWeekNumbers ? _this._getWeekNr(s, row[0].date) : '';
          return createElement(
            'div',
            { className: 'mbsc-calendar-row mbsc-flex mbsc-flex-1-0', key: i, style: { minHeight: _this._rowHeights[i] } },
            showWeekNumbers &&
              createElement(
                'div',
                { className: 'mbsc-calendar-cell mbsc-flex-none mbsc-calendar-day mbsc-calendar-week-nr' + _this._theme },
                createElement('div', { 'aria-hidden': 'true' }, weekNr),
                createElement('div', { className: 'mbsc-hidden-content' }, s.weekText.replace('{count}', weekNr))
              ),
            row.map(function (cell, j) {
              return createElement(CalendarDay, {
                active: cell.display && _this._isActive(cell.date),
                amText: s.amText,
                clickToCreate: s.clickToCreate,
                colors: cell.colors,
                date: cell.date,
                day: cell.day,
                disabled: _this._isInvalid(cell.date),
                display: cell.display,
                dataTimezone: s.dataTimezone,
                displayTimezone: s.displayTimezone,
                dragData: s.dragData,
                dragToCreate: s.dragToCreate,
                dragToResize: s.dragToResize,
                dragToMove: s.dragToMove,
                eventText: s.eventText,
                eventsText: s.eventsText,
                exclusiveEndDates: s.exclusiveEndDates,
                firstDay: s.firstDay,
                hasMarks: s.hasMarks,
                hoverEnd: s.hoverEnd,
                hoverStart: s.hoverStart,
                isActiveMonth: s.isActive,
                isPicker: s.isPicker,
                key: cell.date,
                labels: cell.labels,
                pmText: s.pmText,
                marks: cell.marks,
                month: cell.month,
                monthShort: cell.monthShort,
                onDayClick: s.onDayClick,
                onDayDoubleClick: s.onDayDoubleClick,
                onDayRightClick: s.onDayRightClick,
                onLabelClick: s.onLabelClick,
                onLabelDoubleClick: s.onLabelDoubleClick,
                onLabelRightClick: s.onLabelRightClick,
                onLabelHoverIn: s.onLabelHoverIn,
                onLabelHoverOut: s.onLabelHoverOut,
                onLabelDelete: s.onLabelDelete,
                onLabelUpdateStart: s.onLabelUpdateStart,
                onLabelUpdateMove: s.onLabelUpdateMove,
                onLabelUpdateEnd: s.onLabelUpdateEnd,
                onLabelUpdateModeOn: s.onLabelUpdateModeOn,
                onLabelUpdateModeOff: s.onLabelUpdateModeOff,
                outer: cell.outer,
                renderDay: s.renderDay,
                renderDayContent: s.renderDayContent,
                renderLabel: s.renderLabel,
                renderLabelContent: s.renderLabelContent,
                rangeEnd: s.rangeEnd,
                rangeStart: s.rangeStart,
                resourcesMap: s.resourcesMap,
                selectedEventsMap: s.selectedEventsMap,
                rtl: s.rtl,
                showEventTooltip: s.showEventTooltip,
                selected: _this._isSelected(cell.date),
                text: cell.text,
                theme: s.theme,
                timeFormat: s.timeFormat,
                timezonePlugin: s.timezonePlugin,
                todayText: s.todayText,
                type: 'day',
                year: cell.year,
                // In case of Preact we need to force update by always passing a new object,
                // otherwise sometimes DOM elements will mix up
                // update={isPreact ? {} : 0}
                onHoverIn: s.onDayHoverIn,
                onHoverOut: s.onDayHoverOut
              });
            })
          );
        })
      );
    };
    return MonthView;
  })(MonthViewBase);

  var update = 0;
  /** @hidden */
  var CalendarView = /*#__PURE__*/ (function (_super) {
    __extends(CalendarView, _super);
    function CalendarView() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      _this._setHeader = function (el) {
        _this._headerElement = el;
      };
      _this._setBody = function (el) {
        _this._body = el;
      };
      _this._setPickerCont = function (el) {
        _this._pickerCont = el;
      };
      _this._renderMonthView = function (timestamp, props) {
        var s = _this.s;
        var state = _this.state;
        return createElement(
          MonthView,
          __assign({}, props, {
            activeDate: _this._active,
            amText: s.amText,
            calendarType: s.calendarType,
            cellTextHeight: state.cellTextHeight,
            clickToCreate: s.clickToCreate,
            colors: _this._colors,
            dayNames: s.dayNames,
            dayNamesShort: _this._dayNames,
            dataTimezone: s.dataTimezone,
            displayTimezone: s.displayTimezone,
            eventText: s.eventText,
            eventsText: s.eventsText,
            exclusiveEndDates: s.exclusiveEndDates,
            firstDay: s.firstDay,
            firstPageDay: timestamp,
            getDate: s.getDate,
            getDay: s.getDay,
            getMonth: s.getMonth,
            getWeekNumber: s.getWeekNumber,
            getYear: s.getYear,
            hasMarks: !!_this._marked,
            hoverEnd: s.hoverEnd,
            hoverStart: s.hoverStart,
            isPicker: s.isPicker,
            invalid: _this._invalid,
            labels: _this._labelsLayout,
            labelHeight: state.labelHeight,
            marked: _this._marked,
            max: _this._maxDate,
            min: _this._minDate,
            monthNames: s.monthNames,
            monthNamesShort: s.monthNamesShort,
            onDayClick: _this._onDayClick,
            onDayDoubleClick: s.onDayDoubleClick,
            onDayRightClick: s.onDayRightClick,
            onDayHoverIn: _this._onDayHoverIn,
            onDayHoverOut: _this._onDayHoverOut,
            onLabelClick: _this._onLabelClick,
            onLabelDoubleClick: s.onLabelDoubleClick,
            onLabelRightClick: s.onLabelRightClick,
            onLabelHoverIn: s.onLabelHoverIn,
            onLabelHoverOut: s.onLabelHoverOut,
            onLabelDelete: s.onLabelDelete,
            pmText: s.pmText,
            rangeEnd: s.rangeEnd,
            rangeStart: s.rangeStart,
            resourcesMap: s.resourcesMap,
            rtl: s.rtl,
            selectedDates: s.selectedDates,
            selectedEventsMap: s.selectedEventsMap,
            showEventTooltip: s.showEventTooltip,
            showOuter: _this._showOuter,
            showWeekDays: !_this._isVertical && !_this._variableRow,
            showWeekNumbers: s.showWeekNumbers,
            showSingleMark: !!s.marksMap,
            todayText: s.todayText,
            theme: s.theme,
            timeFormat: s.timeFormat,
            timezonePlugin: s.timezonePlugin,
            valid: _this._valid,
            weeks: _this._weeks,
            weekText: s.weekText,
            renderDay: s.renderDay,
            renderDayContent: s.renderDayContent,
            renderLabel: s.renderLabel,
            renderLabelContent: s.renderLabelContent,
            variableRow: _this._variableRow
          })
        );
      };
      _this._renderMonth = function (item, offset) {
        var s = _this.s;
        var key = item.key;
        var isActive = key >= _this._pageIndex && key < _this._pageIndex + _this._pageNr && _this._view === MONTH_VIEW;
        var ownProps = {
          dragData: s.dragData,
          dragToCreate: s.dragToCreate,
          dragToMove: s.dragToMove,
          dragToResize: s.dragToResize,
          isActive: isActive,
          onLabelUpdateEnd: s.onLabelUpdateEnd,
          onLabelUpdateModeOff: s.onLabelUpdateModeOff,
          onLabelUpdateModeOn: s.onLabelUpdateModeOn,
          onLabelUpdateMove: s.onLabelUpdateMove,
          onLabelUpdateStart: s.onLabelUpdateStart
        };
        return createElement(
          'div',
          {
            className: 'mbsc-calendar-slide' + (isActive ? ' mbsc-calendar-slide-active' : '') + _this._theme + _this._rtl,
            key: key,
            style: _this._getPageStyle(key, offset, _this._pageNr)
          },
          _this._renderMonthView(_this._getPageDay(key), ownProps)
        );
      };
      _this._renderYears = function (item, offset) {
        var s = _this.s;
        var index = item.key;
        var first = _this._getPageYears(index);
        var selectedYear = s.getYear(new Date(_this._active));
        var activeYear = s.getYear(new Date(_this._activeMonth));
        return createElement(
          'div',
          {
            'aria-hidden': _this._yearsIndex === index ? UNDEFINED : 'true',
            className: 'mbsc-calendar-picker-slide mbsc-calendar-slide' + _this._theme + _this._rtl,
            key: index,
            style: _this._getPageStyle(index, offset)
          },
          createElement(
            'div',
            { className: 'mbsc-calendar-table mbsc-flex-col' },
            ARRAY4.map(function (x, i) {
              return createElement(
                'div',
                { className: 'mbsc-calendar-row mbsc-flex mbsc-flex-1-0', key: i },
                ARRAY3.map(function (y, j) {
                  var year = first + i * 3 + j;
                  var d = +s.getDate(year, 0, 1);
                  return createElement(CalendarDay, {
                    active: year === activeYear,
                    date: d,
                    display: true,
                    selected: year === selectedYear,
                    disabled: year < _this._minYears || year > _this._maxYears,
                    rtl: s.rtl,
                    text: year + s.yearSuffix,
                    theme: s.theme,
                    type: 'year',
                    onDayClick: _this._onYearClick,
                    key: year
                  });
                })
              );
            })
          )
        );
      };
      _this._renderYear = function (item, offset) {
        var s = _this.s;
        var index = item.key;
        var year = _this._getPageYear(index);
        var active = new Date(_this._activeMonth);
        var activeYear = s.getYear(active);
        var activeMonth = s.getMonth(active);
        var selected = new Date(_this._active);
        var selectedYear = s.getYear(selected);
        var selectedMonth = s.getMonth(selected);
        return createElement(
          'div',
          {
            'aria-hidden': _this._yearIndex === index ? UNDEFINED : 'true',
            className: 'mbsc-calendar-picker-slide mbsc-calendar-slide' + _this._theme + _this._rtl,
            key: index,
            style: _this._getPageStyle(index, offset)
          },
          createElement(
            'div',
            { className: 'mbsc-calendar-table mbsc-flex-col' },
            ARRAY4.map(function (a, i) {
              return createElement(
                'div',
                { className: 'mbsc-calendar-row mbsc-flex mbsc-flex-1-0', key: i },
                ARRAY3.map(function (b, j) {
                  var d = s.getDate(year, i * 3 + j, 1);
                  var y = s.getYear(d);
                  var m = s.getMonth(d);
                  return createElement(CalendarDay, {
                    active: y === activeYear && m === activeMonth,
                    date: +d,
                    display: true,
                    selected: y === selectedYear && m === selectedMonth,
                    disabled: d < _this._minYear || d >= _this._maxYear,
                    month: s.monthNames[m],
                    rtl: s.rtl,
                    text: s.monthNamesShort[m],
                    theme: s.theme,
                    type: 'month',
                    onDayClick: _this._onMonthClick,
                    key: +d
                  });
                })
              );
            })
          )
        );
      };
      return _this;
    }
    // tslint:enable variable-name
    CalendarView.prototype._template = function (s, state) {
      var _this = this;
      update++;
      var variableRow = this._variableRow;
      var monthOrYearSelection = this._view !== MONTH_VIEW;
      var renderHeader = function () {
        var content;
        var html;
        if (s.renderHeader) {
          content = s.renderHeader();
          if (isString(content)) {
            if (content !== _this._headerHTML) {
              _this._headerHTML = content;
              _this._shouldEnhanceHeader = true;
            }
            html = _this._safeHtml(content);
          }
        } else {
          var isMultiPage = _this._pageNr > 1;
          content = createElement(
            Fragment,
            null,
            createElement(CalendarNav, {
              className: 'mbsc-calendar-title-wrapper' + (isMultiPage ? ' mbsc-calendar-title-wrapper-multi' : '')
            }),
            createElement(CalendarPrev, {
              className: 'mbsc-calendar-button-prev' + (isMultiPage ? ' mbsc-calendar-button-prev-multi' : '')
            }),
            s.showToday && createElement(CalendarToday, { className: 'mbsc-calendar-header-today' }),
            createElement(CalendarNext, {
              className: 'mbsc-calendar-button-next' + (isMultiPage ? ' mbsc-calendar-button-next-multi' : '')
            })
          );
        }
        var header = createElement('div', { className: 'mbsc-calendar-controls' + _this._theme, dangerouslySetInnerHTML: html }, content);
        // We need to use the createElement for preact to work with context
        return createElement(CalendarContext.Provider, { children: header, value: { instance: _this } });
      };
      var calWeekDays =
        (this._isVertical || (variableRow && +s.size === 1)) && s.showCalendar
          ? createElement(CalendarWeekDays, {
              dayNamesShort: this._dayNames,
              rtl: this._rtl,
              theme: this._theme,
              firstDay: s.firstDay,
              hasScroll: state.hasScrollY,
              hidden: this._view !== MONTH_VIEW && !this._hasPicker,
              showWeekNumbers: s.showWeekNumbers
            })
          : null;
      var pickerProps = {
        axis: this._axis,
        batchSize: 1,
        changeOnEnd: true,
        className: 'mbsc-calendar-scroll-wrapper' + this._theme,
        // Need to pass some random data to render month views inside the scrollview if something changed (other than scrollview props)
        data: update,
        easing: 'ease-out',
        itemSize: state.pickerSize,
        items: this._months,
        mousewheel: this._mousewheel,
        prevAnim: this._prevAnim,
        rtl: s.rtl,
        snap: true,
        time: 200
      };
      var monthYearPicker = createElement(
        'div',
        { ref: this._setPickerCont, className: this._hasPicker ? 'mbsc-calendar-picker-wrapper' : '' },
        (state.view === MULTI_YEAR_VIEW || state.viewClosing === MULTI_YEAR_VIEW || s.selectView === MULTI_YEAR_VIEW) &&
          createElement(
            'div',
            { onAnimationEnd: this._onViewAnimationEnd, className: this._getPickerClass(MULTI_YEAR_VIEW) },
            createElement(
              Scrollview,
              __assign(
                {
                  key: 'years',
                  itemRenderer: this._renderYears,
                  maxIndex: this._maxYearsIndex,
                  minIndex: this._minYearsIndex,
                  onGestureEnd: this._onGestureEnd,
                  onIndexChange: this._onYearsPageChange,
                  selectedIndex: this._yearsIndex
                },
                pickerProps
              )
            )
          ),
        (state.view === YEAR_VIEW || state.viewClosing === YEAR_VIEW || s.selectView === YEAR_VIEW) &&
          createElement(
            'div',
            { onAnimationEnd: this._onViewAnimationEnd, className: this._getPickerClass(YEAR_VIEW) },
            createElement(
              Scrollview,
              __assign(
                {
                  key: 'year',
                  itemRenderer: this._renderYear,
                  maxIndex: this._maxYearIndex,
                  minIndex: this._minYearIndex,
                  onGestureEnd: this._onGestureEnd,
                  onIndexChange: this._onYearPageChange,
                  selectedIndex: this._yearIndex
                },
                pickerProps
              )
            )
          )
      );
      return createElement(
        'div',
        { className: this._cssClass, ref: this._setEl, style: this._dim, onClick: noop },
        createElement(
          'div',
          {
            className:
              'mbsc-calendar-wrapper mbsc-flex-col mbsc-flex-1-1' +
              this._theme +
              this._hb +
              (s.hasContent || !s.showCalendar ? ' mbsc-calendar-wrapper-fixed' : '')
          },
          createElement(
            'div',
            {
              className:
                'mbsc-calendar-header' + this._theme + this._hb + (this._isVertical || variableRow ? ' mbsc-calendar-header-vertical' : ''),
              ref: this._setHeader
            },
            s.showControls && renderHeader(),
            calWeekDays
          ),
          createElement(
            'div',
            { className: 'mbsc-calendar-body mbsc-flex-col mbsc-flex-1-1' + this._theme, ref: this._setBody, onKeyDown: this._onKeyDown },
            s.showCalendar &&
              createElement(
                'div',
                {
                  className:
                    'mbsc-calendar-body-inner mbsc-flex-col mbsc-flex-1-1' + (variableRow ? ' mbsc-calendar-body-inner-variable' : '')
                },
                this._isGrid
                  ? createElement(
                      'div',
                      {
                        'aria-hidden': monthOrYearSelection ? 'true' : UNDEFINED,
                        className: 'mbsc-calendar-grid mbsc-flex-1-1 mbsc-flex-col' + this._theme + this._hb
                      },
                      this._monthsMulti.map(function (row, i) {
                        return createElement(
                          'div',
                          { key: i, className: 'mbsc-calendar-grid-row mbsc-flex mbsc-flex-1-1' },
                          row.map(function (item, j) {
                            return createElement(
                              'div',
                              { key: j, className: 'mbsc-calendar-grid-item mbsc-flex-col mbsc-flex-1-1' + _this._theme },
                              createElement(
                                'div',
                                { className: 'mbsc-calendar-month-title' + _this._theme },
                                s.monthNames[new Date(item).getMonth()]
                              ),
                              _this._renderMonthView(item, { isActive: true })
                            );
                          })
                        );
                      })
                    )
                  : variableRow
                  ? createElement(
                      'div',
                      {
                        'aria-hidden': monthOrYearSelection ? 'true' : UNDEFINED,
                        className: 'mbsc-calendar-slide mbsc-calendar-slide-active ' + this._getPickerClass(MONTH_VIEW)
                      },
                      this._renderMonthView(+s.navigationService.firstDay, {
                        dragData: s.dragData,
                        dragToCreate: s.dragToCreate,
                        dragToMove: s.dragToMove,
                        dragToResize: s.dragToResize,
                        isActive: true,
                        onLabelUpdateEnd: s.onLabelUpdateEnd,
                        onLabelUpdateModeOff: s.onLabelUpdateModeOff,
                        onLabelUpdateModeOn: s.onLabelUpdateModeOn,
                        onLabelUpdateMove: s.onLabelUpdateMove,
                        onLabelUpdateStart: s.onLabelUpdateStart
                      })
                    )
                  : s.selectView === MONTH_VIEW &&
                    createElement(
                      'div',
                      {
                        'aria-hidden': monthOrYearSelection ? 'true' : UNDEFINED,
                        className: this._getPickerClass(MONTH_VIEW),
                        onAnimationEnd: this._onViewAnimationEnd
                      },
                      createElement(
                        Scrollview,
                        __assign({}, pickerProps, {
                          itemNr: this._pageNr,
                          itemSize: state.pageSize / this._pageNr,
                          itemRenderer: this._renderMonth,
                          maxIndex: this._maxIndex,
                          minIndex: this._minIndex,
                          mouseSwipe: s.mouseSwipe,
                          onAnimationEnd: this._onAnimationEnd,
                          onGestureStart: this._onGestureStart,
                          onIndexChange: this._onPageChange,
                          onStart: this._onStart,
                          selectedIndex: this._pageIndex,
                          swipe: s.swipe
                        })
                      )
                    ),
                !this._hasPicker && monthYearPicker
              )
          )
        ),
        this.props.children,
        this._hasPicker &&
          createElement(
            Popup,
            {
              anchor: this._pickerBtn,
              closeOnScroll: true,
              contentPadding: false,
              context: s.context,
              cssClass: 'mbsc-calendar-popup',
              display: 'anchored',
              isOpen: this._view !== MONTH_VIEW,
              locale: s.locale,
              onClose: this._onPickerClose,
              onOpen: this._onPickerOpen,
              rtl: s.rtl,
              scrollLock: false,
              showOverlay: false,
              theme: s.theme,
              themeVariant: s.themeVariant
            },
            createElement(
              'div',
              { onKeyDown: this._onKeyDown },
              createElement(
                'div',
                { className: 'mbsc-calendar-controls' + this._theme },
                createElement(
                  'div',
                  { 'aria-live': 'polite', className: 'mbsc-calendar-picker-button-wrapper mbsc-calendar-title-wrapper' + this._theme },
                  createElement(
                    Button,
                    {
                      className: 'mbsc-calendar-button',
                      onClick: this._onPickerBtnClick,
                      theme: s.theme,
                      themeVariant: s.themeVariant,
                      type: 'button',
                      variant: 'flat'
                    },
                    this._viewTitle,
                    s.downIcon && createElement(Icon, { svg: state.view === MULTI_YEAR_VIEW ? s.downIcon : s.upIcon, theme: s.theme })
                  )
                ),
                createElement(Button, {
                  className: 'mbsc-calendar-button',
                  ariaLabel: s.prevPageText,
                  disabled: this._isPrevDisabled(true),
                  iconSvg: this._prevIcon,
                  onClick: this.prevPage,
                  theme: s.theme,
                  themeVariant: s.themeVariant,
                  type: 'button',
                  variant: 'flat'
                }),
                createElement(Button, {
                  className: 'mbsc-calendar-button',
                  ariaLabel: s.nextPageText,
                  disabled: this._isNextDisabled(true),
                  iconSvg: this._nextIcon,
                  onClick: this.nextPage,
                  theme: s.theme,
                  themeVariant: s.themeVariant,
                  type: 'button',
                  variant: 'flat'
                })
              ),
              monthYearPicker
            )
          )
      );
    };
    CalendarView.prototype._updated = function () {
      _super.prototype._updated.call(this);
      if (this._shouldEnhanceHeader) {
        enhance(this._headerElement, { view: this });
        this._shouldEnhanceHeader = false;
      }
    };
    return CalendarView;
  })(CalendarViewBase);

  var InstanceServiceBase = /*#__PURE__*/ (function () {
    function InstanceServiceBase() {
      this.onInstanceReady = new Observable();
      this.onComponentChange = new Observable();
    }
    Object.defineProperty(InstanceServiceBase.prototype, 'instance', {
      get: function () {
        return this.inst;
      },
      set: function (inst) {
        this.inst = inst;
        this.onInstanceReady.next(inst);
      },
      enumerable: true,
      configurable: true
    });
    return InstanceServiceBase;
  })();

  /** @hidden */
  var ListHeaderBase = /*#__PURE__*/ (function (_super) {
    __extends(ListHeaderBase, _super);
    function ListHeaderBase() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    ListHeaderBase.prototype._render = function (s) {
      this._cssClass = this._className + ' mbsc-list-header' + this._theme + this._hb;
    };
    return ListHeaderBase;
  })(BaseComponent);

  /**
   * The ListItem component
   */
  var ListHeader = /*#__PURE__*/ (function (_super) {
    __extends(ListHeader, _super);
    function ListHeader() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    ListHeader.prototype._template = function (s) {
      return createElement('div', { ref: this._setEl, className: this._cssClass }, s.children);
    };
    return ListHeader;
  })(ListHeaderBase);

  /** @hidden */
  var ListItemBase = /*#__PURE__*/ (function (_super) {
    __extends(ListItemBase, _super);
    function ListItemBase() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      _this._onClick = function (ev) {
        _this._hook('onClick', { domEvent: ev });
        if (_this.s.selected) {
          _this.setState({ hasFocus: false });
        }
      };
      return _this;
    }
    // tslint:enable variable-name
    ListItemBase.prototype._mounted = function () {
      var _this = this;
      var isDrag;
      var touchTimer;
      this._unlisten = gestureListener(this._el, {
        click: true,
        keepFocus: true,
        onBlur: function () {
          _this.setState({ hasFocus: false });
        },
        onEnd: function (ev) {
          if (isDrag) {
            var args = __assign({}, ev);
            // Will prevent mousedown event on doc
            args.domEvent.preventDefault();
            args.data = _this.s.data;
            args.drag = true;
            _this._hook('onDragEnd', args);
            isDrag = false;
          }
          clearTimeout(touchTimer);
        },
        onFocus: function () {
          _this.setState({ hasFocus: true });
        },
        onHoverIn: function (ev) {
          if (_this.s.actionable) {
            _this.setState({ hasHover: true });
          }
          _this._hook('onHoverIn', { domEvent: ev });
        },
        onHoverOut: function (ev) {
          _this.setState({ hasHover: false });
          _this._hook('onHoverOut', { domEvent: ev });
        },
        onKeyDown: function (ev) {
          var event = _this.s.data;
          switch (ev.keyCode) {
            case ENTER:
            case SPACE:
              _this._el.click();
              ev.preventDefault();
              break;
            case BACKSPACE:
            case DELETE:
              if (event && event.editable !== false) {
                _this._hook('onDelete', {
                  domEvent: ev,
                  event: event,
                  source: 'agenda'
                });
              }
              break;
          }
        },
        onMove: function (ev) {
          var s = _this.s;
          var args = __assign({}, ev);
          args.data = s.data;
          args.drag = true;
          args.external = true;
          if (isDrag || !args.isTouch) {
            // Prevents page scroll on touch and text selection with mouse
            args.domEvent.preventDefault();
          }
          if (isDrag) {
            _this._hook('onDragMove', args);
          } else if (Math.abs(args.deltaX) > 7 || Math.abs(args.deltaY) > 7) {
            clearTimeout(touchTimer);
            if (!args.isTouch && s.drag && s.data.editable !== false) {
              isDrag = true;
              _this._hook('onDragStart', args);
            }
          }
        },
        onPress: function () {
          if (_this.s.actionable) {
            _this.setState({ isActive: true });
          }
        },
        onRelease: function () {
          _this.setState({ isActive: false });
        },
        onStart: function (ev) {
          var s = _this.s;
          if (ev.isTouch && s.drag && s.data.editable !== false && !isDrag) {
            touchTimer = setTimeout(function () {
              var args = __assign({}, ev);
              args.data = s.data;
              args.drag = true;
              _this._hook('onDragModeOn', args);
              _this._hook('onDragStart', args);
              isDrag = true;
            }, 350);
          }
          return { ripple: s.actionable && s.ripple };
        }
      });
    };
    ListItemBase.prototype._render = function (s, state) {
      this._cssClass =
        this._className +
        ' mbsc-list-item' +
        this._theme +
        this._hb +
        this._rtl +
        (s.actionable ? ' mbsc-list-item-actionable' : '') +
        (state.hasFocus ? ' mbsc-focus' : '') +
        (state.hasHover ? ' mbsc-hover' : '') +
        (state.isActive ? ' mbsc-active' : '') +
        (s.selected ? ' mbsc-selected' : '');
    };
    ListItemBase.prototype._destroy = function () {
      this._unlisten();
    };
    ListItemBase.defaults = {
      actionable: true,
      ripple: false
    };
    // tslint:disable variable-name
    ListItemBase._name = 'ListItem';
    return ListItemBase;
  })(BaseComponent);

  /**
   * The ListItem component
   */
  var ListItem = /*#__PURE__*/ (function (_super) {
    __extends(ListItem, _super);
    function ListItem() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    ListItem.prototype._template = function (s) {
      var _a = this.props;
      _a.actionable;
      var children = _a.children;
      _a.className;
      _a.data;
      _a.drag;
      _a.ripple;
      _a.rtl;
      var theme = _a.theme;
      _a.themeVariant;
      _a.onHoverIn;
      _a.onHoverOut;
      _a.onDragEnd;
      _a.onDragMove;
      _a.onDragStart;
      _a.onDragModeOn;
      _a.onDragModeOff;
      _a.onDelete;
      _a.onClick;
      var other = __rest(_a, [
        'actionable',
        'children',
        'className',
        'data',
        'drag',
        'ripple',
        'rtl',
        'theme',
        'themeVariant',
        'onHoverIn',
        'onHoverOut',
        'onDragEnd',
        'onDragMove',
        'onDragStart',
        'onDragModeOn',
        'onDragModeOff',
        'onDelete',
        'onClick'
      ]);
      return createElement(
        'div',
        __assign({ tabIndex: 0, ref: this._setEl, onClick: this._onClick, className: this._cssClass }, other),
        children,
        createElement('div', { className: 'mbsc-list-item-background mbsc-' + theme })
      );
    };
    return ListItem;
  })(ListItemBase);

  // tslint:enable interface-name
  /** @hidden */
  var ListBase = /*#__PURE__*/ (function (_super) {
    __extends(ListBase, _super);
    function ListBase() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    // tslint:enable variable-name
    ListBase.prototype._render = function (s) {
      this._cssClass = this._className + this._rtl + ' mbsc-font mbsc-list' + this._theme;
    };
    return ListBase;
  })(BaseComponent);

  /**
   * The List component
   *
   * Usage:
   *
   * ```
   * <List theme="ios">
   *   <ListItem>Items inside</ListItem>
   * </List>
   * ```
   */
  var List = /*#__PURE__*/ (function (_super) {
    __extends(List, _super);
    function List() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    List.prototype._template = function (s) {
      return createElement('div', { ref: this._setEl, className: this._cssClass }, s.children);
    };
    return List;
  })(ListBase);

  // tslint:disable no-non-null-assertion
  var DEF_ID = 'mbsc-def';
  /** @hidden */
  function checkInvalidCollision$1(invalids, start, end, allDay, invalidateEvent, exclusiveEndDates) {
    var onlyStartEnd = invalidateEvent === 'start-end';
    var until = exclusiveEndDates ? end : getDateOnly(addDays(end, 1));
    for (var _i = 0, _a = Object.keys(invalids); _i < _a.length; _i++) {
      var r = _a[_i];
      var invalidMap = invalids[r];
      for (var d = getDateOnly(start); d < until; d.setDate(d.getDate() + 1)) {
        var invalidsForDay = invalidMap[getDateStr(d)];
        if (invalidsForDay) {
          if (invalidsForDay.allDay && (!onlyStartEnd || isSameDay(d, start) || isSameDay(d, end))) {
            return invalidsForDay.allDay;
          }
          if (!allDay) {
            for (var _b = 0, _c = invalidsForDay.invalids; _b < _c.length; _b++) {
              var inv = _c[_b];
              if (onlyStartEnd) {
                if (checkDateRangeOverlap(inv.startDate, inv.endDate, start, start, true)) {
                  return inv.original;
                }
                if (checkDateRangeOverlap(inv.startDate, inv.endDate, end, end)) {
                  return inv.original;
                }
              } else if (checkDateRangeOverlap(inv.startDate, inv.endDate, start, end)) {
                return inv.original;
              }
            }
          }
        }
      }
    }
    return false;
  }
  /** @hidden */
  function calcLayout(s, groups, event, next, isListing) {
    // Layout algorithm
    // Overlapping events are organized in groups, groups are organized in levels (columns)
    var eventAllDay = event.allDay || isListing;
    var eStart = event.startDate;
    var eEnd = eventAllDay ? getEndDate(s, eventAllDay, eStart, event.endDate) : event.endDate;
    var eventStart = eventAllDay ? createDate(s, eStart.getFullYear(), eStart.getMonth(), eStart.getDate()) : eStart;
    var eventEnd = eventAllDay ? createDate(s, eEnd.getFullYear(), eEnd.getMonth(), eEnd.getDate(), 23, 59, 59, 999) : eEnd;
    var pushed = false;
    for (var _i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
      var group = groups_1[_i];
      var i = 0;
      var groupOverlap = false;
      var groupLevel = void 0;
      for (var _a = 0, group_1 = group; _a < group_1.length; _a++) {
        var level = group_1[_a];
        var overlap = false;
        for (var _b = 0, level_1 = level; _b < level_1.length; _b++) {
          var item = level_1[_b];
          // The collision check works on timestamps, so the right timestamp for allDay events will be the start of the start day
          // and end of the end day (1ms is already removed in case of exclusive end dates).
          // In case of timezones, the allDay event dates are always in the display timezone (meaning
          // they don't use timezones at all) and the times are not taken into account.
          var itemAllDay = item.allDay;
          var iStart = item.startDate;
          var iEnd = itemAllDay ? getEndDate(s, itemAllDay, iStart, item.endDate) : item.endDate;
          var itemStart = itemAllDay ? createDate(s, iStart.getFullYear(), iStart.getMonth(), iStart.getDate()) : iStart;
          var itemEnd = itemAllDay ? createDate(s, iEnd.getFullYear(), iEnd.getMonth(), iEnd.getDate(), 23, 59, 59, 999) : iEnd;
          if (checkDateRangeOverlap(itemStart, itemEnd, eventStart, eventEnd, true)) {
            overlap = true;
            groupOverlap = true;
            if (groupLevel) {
              next[event.uid] = next[event.uid] || i;
            } else {
              next[item.uid] = i + 1;
            }
          }
        }
        // There is place on this level, if the event belongs to this group, will be added here
        if (!overlap && !groupLevel) {
          groupLevel = level;
        }
        i++;
      }
      // If event belongs to this group
      if (groupOverlap) {
        if (groupLevel) {
          // Add to existing level
          groupLevel.push(event);
        } else {
          // Add to new level
          group.push([event]);
        }
        pushed = true;
      }
    }
    // Create a new group
    if (!pushed) {
      next[event.uid] = 0;
      groups.push([[event]]);
    }
  }
  /** @hidden */
  function roundStep(v) {
    // Don't allow negative values
    v = Math.abs(round(v));
    if (v > 60) {
      return round(v / 60) * 60;
    }
    if (60 % v === 0) {
      return v;
    }
    return [6, 10, 12, 15, 20, 30].reduce(function (a, b) {
      return Math.abs(b - v) < Math.abs(a - v) ? b : a;
    });
  }
  /** @hidden */
  function getEventHeight(startDate, endDate, displayedTime, startTime, endTime) {
    var start = getDayMilliseconds(startDate);
    var end = getDayMilliseconds(endDate);
    if (startTime > start) {
      start = startTime;
    }
    if (endTime < end) {
      end = endTime;
    }
    return ((end - start) * 100) / displayedTime;
  }
  /** @hidden */
  function getEventWidth(startDate, endDate, displayedTime, viewStart, viewEnd, startTime, endTime, startDay, endDay, fullDay) {
    var startD = startDate;
    var endD = endDate;
    if (startD < viewStart) {
      startD = viewStart;
    }
    if (endD > viewEnd) {
      endD = viewEnd;
    }
    var start = getDayMilliseconds(startD);
    var end = getDayMilliseconds(endD);
    // limit the start/end time of the events
    if (startTime > start) {
      start = startTime;
    }
    if (endTime < end) {
      end = endTime;
    }
    //  in case of multi-day events limit the start/end hours if moved to a position without a cursor date change
    if (!isSameDay(startD, endD)) {
      if (start > endTime) {
        start = endTime;
      }
      if (end < startTime) {
        end = startTime;
      }
    }
    var time = 0;
    if (isSameDay(startD, endD)) {
      time = fullDay ? displayedTime : end - start;
    } else {
      for (var d = getDateOnly(startD); d <= endD; d.setDate(d.getDate() + 1)) {
        if (isInWeek(d.getDay(), startDay, endDay)) {
          if (!fullDay && isSameDay(d, startD)) {
            time += displayedTime - start + startTime;
          } else if (!fullDay && isSameDay(d, endD)) {
            time += end - startTime;
          } else {
            time += displayedTime;
          }
        }
      }
    }
    return (time * 100) / displayedTime;
  }
  /** @hidden */
  function getEventStart(startDate, startTime, displayedTime, viewStart, startDay, endDay) {
    if (viewStart && viewStart > startDate) {
      startDate = viewStart;
    }
    var start = getDayMilliseconds(startDate);
    if (startTime > start || (startDay !== UNDEFINED && endDay !== UNDEFINED && !isInWeek(startDate.getDay(), startDay, endDay))) {
      start = startTime;
    }
    return ((start - startTime) * 100) / displayedTime;
  }
  /** @hidden */
  function getResourceMap(eventsMap, resources, slots, hasResources, hasSlots) {
    eventsMap = eventsMap || {};
    var eventKeys = Object.keys(eventsMap);
    var resourceMap = {};
    var resourceIds = resources.map(function (resource) {
      return resource.id;
    });
    var slotIds = slots.map(function (s) {
      return s.id;
    });
    resourceIds.forEach(function (rid) {
      resourceMap[rid] = {};
      slotIds.forEach(function (sid) {
        resourceMap[rid][sid] = {};
      });
    });
    var _loop_1 = function (timestamp) {
      var events = eventsMap[timestamp];
      var _loop_2 = function (event_1) {
        var eventResource = event_1.resource;
        var eventSlot = event_1.slot;
        // If resources are not passed at all (null or undefined), we'll show all events.
        // If the event has not resource specified, show it for all resources.
        var res = eventResource === UNDEFINED || !hasResources ? resourceIds : isArray(eventResource) ? eventResource : [eventResource];
        var slot = eventSlot === UNDEFINED || !hasSlots ? slotIds : [eventSlot];
        res.forEach(function (rid) {
          var map = resourceMap[rid];
          if (map) {
            slot.forEach(function (sid) {
              var slotMap = map[sid];
              if (slotMap) {
                if (!slotMap[timestamp]) {
                  slotMap[timestamp] = [];
                }
                slotMap[timestamp].push(event_1);
              }
            });
          }
        });
      };
      for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
        var event_1 = events_1[_i];
        _loop_2(event_1);
      }
    };
    for (var _i = 0, eventKeys_1 = eventKeys; _i < eventKeys_1.length; _i++) {
      var timestamp = eventKeys_1[_i];
      _loop_1(timestamp);
    }
    return resourceMap;
  }
  /** @hidden */
  function getCellDate(timestamp, ms) {
    var d = new Date(timestamp);
    var time = new Date(+REF_DATE + ms); // Date with no DST
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), time.getHours(), time.getMinutes());
  }

  var stateObservables$1 = {};
  /** @hidden */
  var ScheduleEventBase = /*#__PURE__*/ (function (_super) {
    __extends(ScheduleEventBase, _super);
    function ScheduleEventBase() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      // tslint:enable variable-name
      // tslint:disable-next-line: variable-name
      _this._onClick = function (ev) {
        _this._triggerClick('onClick', ev);
        var s = _this.s;
        var observable = stateObservables$1[s.event.uid];
        if (observable && s.selected) {
          observable.next({ hasFocus: false });
        }
      };
      // tslint:disable-next-line: variable-name
      _this._onRightClick = function (ev) {
        _this._triggerClick('onRightClick', ev);
      };
      // tslint:disable-next-line: variable-name
      _this._onDocTouch = function (ev) {
        unlisten(_this._doc, TOUCH_START, _this._onDocTouch);
        unlisten(_this._doc, MOUSE_DOWN, _this._onDocTouch);
        _this._isDrag = false;
        _this._hook('onDragModeOff', {
          event: _this.s.event.original
        });
      };
      // tslint:disable-next-line: variable-name
      _this._updateState = function (args) {
        _this.setState(args);
      };
      return _this;
    }
    ScheduleEventBase.prototype._render = function (s, state) {
      var event = s.event;
      var day = new Date(event.date);
      var pos = event.position;
      var startDate = event.startDate;
      var endDate = getEndDate(s, event.allDay, startDate, event.endDate);
      var isTimeline = s.isTimeline;
      var isTimelineListing = s.isListing;
      var isAllDay = isTimelineListing || event.allDay;
      var isMultiDay = !isSameDay(startDate, endDate);
      var isMultiDayStart = isMultiDay && isSameDay(startDate, day);
      var isMultiDayEnd = isMultiDay && isSameDay(endDate, day);
      var allDayStyle = isAllDay && (!isTimeline || isTimelineListing);
      var host = isTimeline ? 'timeline' : 'schedule';
      var gridStartTime = s.gridStartTime;
      var gridEndTime = s.gridEndTime;
      var startTime = getDayMilliseconds(startDate);
      var endTime = getDayMilliseconds(endDate);
      var hasSlots = isTimeline && s.slot !== DEF_ID;
      var lastDay = s.singleDay ? addDays(day, 1) : new Date(s.lastDay);
      var isEndInWeek = isInWeek(endDate.getDay(), s.startDay, s.endDay);
      this._isStart = hasSlots || !isMultiDay || isMultiDayStart;
      this._isEnd = hasSlots || !isMultiDay || (isAllDay || isTimeline ? endDate < lastDay && isEndInWeek : isMultiDayEnd);
      if (!hasSlots && !isAllDay && (gridStartTime > startTime || gridEndTime < startTime)) {
        this._isStart = false;
      }
      if (!hasSlots && !isAllDay && (gridEndTime < endTime || gridStartTime > endTime)) {
        this._isEnd = false;
      }
      // check for custom templates
      this._isDrag = this._isDrag || s.isDrag;
      this._content = UNDEFINED;
      this._rangeText = event.start + ' - ' + event.end;
      this._isAllDay = allDayStyle;
      this._host = host;
      if (event.allDay || (!isTimeline && isMultiDay && !isMultiDayStart && !isMultiDayEnd)) {
        this._rangeText = event.allDayText;
      }
      this._cssClass =
        'mbsc-schedule-event' +
        this._theme +
        this._rtl +
        (s.render || s.template ? ' mbsc-schedule-event-custom' : '') +
        (isTimeline ? ' mbsc-timeline-event' : '') +
        (isTimelineListing ? ' mbsc-timeline-event-listing' : '') +
        (this._isStart ? ' mbsc-' + host + '-event-start' : '') +
        (this._isEnd ? ' mbsc-' + host + '-event-end' : '') +
        (allDayStyle ? ' mbsc-schedule-event-all-day' : '') +
        (hasSlots ? ' mbsc-timeline-event-slot' : '') +
        ((state.hasFocus && !s.inactive && !s.selected) || s.selected ? ' mbsc-schedule-event-active' : '') +
        (state.hasHover && !s.inactive && !this._isDrag ? ' mbsc-schedule-event-hover' : '') +
        (s.isDrag ? ' mbsc-schedule-event-dragging' + (isTimeline ? ' mbsc-timeline-event-dragging' : '') : '') +
        (s.hidden ? ' mbsc-schedule-event-hidden' : '') +
        (s.inactive ? ' mbsc-schedule-event-inactive' : '') +
        (event.original.editable === false ? ' mbsc-readonly-event' : '');
      this._style = __assign({}, pos, {
        color: event.color,
        top: s.eventHeight && pos.top !== UNDEFINED ? pos.top * s.eventHeight + 'px' : pos.top
      });
      var renderer = s.render || s.renderContent;
      var text;
      if (renderer) {
        var content = renderer(event);
        if (isString(content)) {
          text = content;
        } else {
          this._content = content;
        }
      } else if (!s.contentTemplate) {
        text = event.html;
      }
      if (text !== this._text) {
        this._text = text;
        this._html = text ? this._safeHtml(text) : UNDEFINED;
        this._shouldEnhance = text && !!renderer;
      }
    };
    ScheduleEventBase.prototype._mounted = function () {
      var _this = this;
      var id = this.s.event.uid;
      var resizeDir;
      var observable = stateObservables$1[id];
      var touchTimer;
      if (!observable) {
        observable = new Observable();
        stateObservables$1[id] = observable;
      }
      this._unsubscribe = observable.subscribe(this._updateState);
      this._doc = getDocument(this._el);
      this._unlisten = gestureListener(this._el, {
        keepFocus: true,
        onBlur: function () {
          observable.next({ hasFocus: false });
        },
        onDoubleClick: function (ev) {
          // Prevent event creation on label double click
          ev.domEvent.stopPropagation();
          _this._triggerClick('onDoubleClick', ev.domEvent);
        },
        onEnd: function (ev) {
          if (_this._isDrag) {
            var s = _this.s;
            var args = __assign({}, ev);
            // Will prevent mousedown event on doc
            args.domEvent.preventDefault();
            args.event = s.event;
            args.resource = s.resource;
            args.slot = s.slot;
            if (s.resize && resizeDir) {
              args.resize = true;
              args.direction = resizeDir;
            } else if (s.drag) {
              args.drag = true;
            }
            _this._hook('onDragEnd', args);
            // Turn off update, unless we're in touch update mode
            if (!s.isDrag) {
              _this._isDrag = false;
            }
            if (_this._el && args.moved) {
              _this._el.blur();
            }
          }
          clearTimeout(touchTimer);
          resizeDir = UNDEFINED;
        },
        onFocus: function () {
          observable.next({ hasFocus: true });
        },
        onHoverIn: function (ev) {
          observable.next({ hasHover: true });
          _this._triggerClick('onHoverIn', ev);
        },
        onHoverOut: function (ev) {
          observable.next({ hasHover: false });
          _this._triggerClick('onHoverOut', ev);
        },
        onKeyDown: function (ev) {
          var event = _this.s.event.original;
          switch (ev.keyCode) {
            case ENTER:
            case SPACE:
              _this._el.click();
              ev.preventDefault();
              break;
            case BACKSPACE:
            case DELETE:
              if (event.editable !== false) {
                _this._hook('onDelete', {
                  domEvent: ev,
                  event: event,
                  source: _this._host
                });
              }
              break;
          }
        },
        onMove: function (ev) {
          var s = _this.s;
          var args = __assign({}, ev);
          args.event = s.event;
          args.resource = s.resource;
          args.slot = s.slot;
          if (resizeDir) {
            args.resize = true;
            args.direction = resizeDir;
          } else if (s.drag) {
            args.drag = true;
          } else {
            return;
          }
          if (s.event.original.editable === false) {
            return;
          }
          if (_this._isDrag || !args.isTouch) {
            // Prevents page scroll on touch and text selection with mouse
            args.domEvent.preventDefault();
          }
          if (_this._isDrag) {
            _this._hook('onDragMove', args);
          } else if (Math.abs(args.deltaX) > 7 || Math.abs(args.deltaY) > 7) {
            clearTimeout(touchTimer);
            if (!args.isTouch) {
              _this._isDrag = true;
              _this._hook('onDragStart', args);
            }
          }
        },
        onStart: function (ev) {
          var s = _this.s;
          var args = __assign({}, ev);
          var target = args.domEvent.target;
          args.event = s.event;
          args.resource = s.resource;
          args.slot = s.slot;
          if (s.resize && target.classList.contains('mbsc-schedule-event-resize')) {
            resizeDir = target.classList.contains('mbsc-schedule-event-resize-start') ? 'start' : 'end';
            args.resize = true;
            args.direction = resizeDir;
          } else if (s.drag) {
            args.drag = true;
          } else {
            return;
          }
          if (s.event.original.editable === false) {
            return;
          }
          if (_this._isDrag) {
            args.domEvent.stopPropagation();
            _this._hook('onDragStart', args);
          } else if (args.isTouch) {
            touchTimer = setTimeout(function () {
              _this._hook('onDragModeOn', args);
              _this._hook('onDragStart', args);
              _this._isDrag = true;
            }, 350);
          }
        }
      });
      if (this._isDrag) {
        listen(this._doc, TOUCH_START, this._onDocTouch);
        listen(this._doc, MOUSE_DOWN, this._onDocTouch);
      }
    };
    ScheduleEventBase.prototype._destroy = function () {
      if (this._el) {
        this._el.blur();
      }
      if (this._unsubscribe) {
        var id = this.s.event.uid;
        var observable = stateObservables$1[id];
        if (observable) {
          observable.unsubscribe(this._unsubscribe);
          if (!observable.nr) {
            delete stateObservables$1[id];
          }
        }
      }
      if (this._unlisten) {
        this._unlisten();
      }
      unlisten(this._doc, TOUCH_START, this._onDocTouch);
      unlisten(this._doc, MOUSE_DOWN, this._onDocTouch);
    };
    ScheduleEventBase.prototype._triggerClick = function (name, domEvent) {
      var s = this.s;
      this._hook(name, {
        date: s.event.date,
        domEvent: domEvent,
        event: s.event.original,
        resource: s.resource,
        slot: s.slot,
        source: this._host
      });
    };
    return ScheduleEventBase;
  })(BaseComponent);

  // tslint:disable no-non-null-assertion
  /** @hidden */
  var ScheduleEvent = /*#__PURE__*/ (function (_super) {
    __extends(ScheduleEvent, _super);
    function ScheduleEvent() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    ScheduleEvent.prototype._template = function (s) {
      var event = s.event;
      var isAllDay = this._isAllDay;
      var isTimeline = s.isTimeline;
      var theme = this._theme;
      var editable = s.resize && event.original.editable !== false;
      return createElement(
        'div',
        {
          tabIndex: 0,
          className: this._cssClass,
          'data-id': event.id,
          style: this._style,
          ref: this._setEl,
          title: event.tooltip,
          onClick: this._onClick,
          onContextMenu: this._onRightClick
        },
        this._isStart &&
          editable &&
          createElement('div', {
            className:
              'mbsc-schedule-event-resize mbsc-schedule-event-resize-start' +
              (isTimeline ? ' mbsc-timeline-event-resize' : '') +
              this._rtl +
              (s.isDrag ? ' mbsc-schedule-event-resize-start-touch' : '')
          }),
        this._isEnd &&
          editable &&
          createElement('div', {
            className:
              'mbsc-schedule-event-resize mbsc-schedule-event-resize-end' +
              (isTimeline ? ' mbsc-timeline-event-resize' : '') +
              this._rtl +
              (s.isDrag ? ' mbsc-schedule-event-resize-end-touch' : '')
          }),
        s.render
          ? // Full custom template (_content is vdom markup, _html is string)
            this._html
            ? createElement('div', { style: { height: '100%' }, dangerouslySetInnerHTML: this._html })
            : this._content
          : // Default template
            createElement(
              Fragment,
              null,
              !isAllDay && !isTimeline && createElement('div', { className: 'mbsc-schedule-event-bar' + theme + this._rtl }),
              createElement('div', {
                className:
                  'mbsc-schedule-event-background' +
                  (isTimeline ? ' mbsc-timeline-event-background' : '') +
                  (isAllDay ? ' mbsc-schedule-event-all-day-background' : '') +
                  theme,
                style: { background: event.style.background }
              }),
              createElement(
                'div',
                {
                  'aria-hidden': 'true',
                  className:
                    'mbsc-schedule-event-inner' + theme + (isAllDay ? ' mbsc-schedule-event-all-day-inner' : '') + (event.cssClass || ''),
                  style: { color: event.style.color }
                },
                createElement(
                  'div',
                  {
                    className: 'mbsc-schedule-event-title' + (isAllDay ? ' mbsc-schedule-event-all-day-title' : '') + theme,
                    dangerouslySetInnerHTML: this._html
                  },
                  this._content
                ),
                !isAllDay && createElement('div', { className: 'mbsc-schedule-event-range' + theme }, this._rangeText)
              ),
              event.ariaLabel && createElement('div', { className: 'mbsc-hidden-content' }, event.ariaLabel)
            )
      );
    };
    return ScheduleEvent;
  })(ScheduleEventBase);

  // tslint:disable no-non-null-assertion
  // tslint:disable no-inferrable-types
  // tslint:disable directive-class-suffix
  // tslint:disable directive-selector
  /** @hidden */
  var STBase = /*#__PURE__*/ (function (_super) {
    __extends(STBase, _super);
    function STBase() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      // tslint:disable-next-line: variable-name no-empty
      _this._onScroll = function () {};
      // tslint:disable-next-line: variable-name
      _this._onTouchStart = function () {
        _this._isTouch = true;
      };
      // tslint:disable-next-line: variable-name
      _this._onMouseLeave = function () {
        if (_this._cursorTimeCont && !_this.state.dragData) {
          _this._cursorTimeCont.style.visibility = 'hidden';
          _this._isCursorTimeVisible = false;
        }
      };
      // tslint:disable-next-line: variable-name
      _this._onMouseMove = function (ev, delta) {
        if (_this._showCursorTime) {
          var s = _this.s;
          var rtl = s.rtl;
          var isTimeline = _this._isTimeline;
          var scrollCont = _this._scrollCont;
          var timeCont = _this._cursorTimeCont;
          if (!_this._isTouch || _this._tempStart) {
            if (!_this._isCursorTimeVisible && ev) {
              _this._calcGridSizes();
              timeCont.style.visibility = 'visible';
              _this._isCursorTimeVisible = true;
            }
          } else {
            timeCont.style.visibility = 'hidden';
            _this._isCursorTimeVisible = false;
          }
          if (_this._isCursorTimeVisible) {
            var clientX = ev ? ev.clientX : _this._cursorX || 0;
            var clientY = ev ? ev.clientY : _this._cursorY || 0;
            var offsetX = clientX + scrollCont.scrollLeft - _this._resWidth * (rtl ? -1 : 1);
            var posX = rtl ? _this._gridContRight - offsetX : offsetX - _this._gridContLeft;
            var posY = constrain(clientY + scrollCont.scrollTop - _this._gridContTop, 8, _this._colHeight);
            var dayIndex = void 0;
            var date = void 0;
            var time = void 0;
            if (delta !== UNDEFINED) {
              // use the _tempStart/_tempEnd since that is already calculated
              date = createDate(s, delta < 0 ? _this._tempStart : _this._tempEnd);
              dayIndex = isTimeline ? _this._dayIndexMap[getDateStr(date)] : 0;
              time = getDayMilliseconds(date);
              time = time === 0 ? (delta < 0 ? time : ONE_DAY) : time;
            } else {
              dayIndex = isTimeline ? constrain(floor(posX / _this._colWidth), 0, _this._daysNr - 1) : 0;
              time =
                _this._startTime +
                step(
                  _this._isTimeline
                    ? floor((_this._time * (posX - dayIndex * _this._colWidth)) / _this._colWidth)
                    : floor((_this._time * (posY - 8)) / (_this._colHeight - 16)),
                  s.dragTimeStep * ONE_MIN
                ); // Remove 16px for top and bottom spacing
              var day = _this._days[dayIndex].date;
              var d = new Date(+REF_DATE + time); // Date with no DST
              date = createDate(s, day.getFullYear(), day.getMonth(), day.getDate(), d.getHours(), d.getMinutes());
            }
            var milliSeconds = _this._time * (isTimeline ? _this._daysNr : 1);
            var pos = isTimeline ? (rtl ? 'right' : 'left') : 'top';
            var timeContStyle = timeCont.style;
            timeContStyle[pos] = ((dayIndex * _this._time + time - _this._startTime) * 100) / milliSeconds + '%';
            timeContStyle[rtl ? 'left' : 'right'] = '';
            timeCont.textContent = formatDate(s.timeFormat, date, s);
            _this._cursorX = clientX;
            _this._cursorY = clientY;
          }
        }
      };
      // #region Drag & Drop
      // tslint:disable-next-line: variable-name
      _this._onEventDragModeOn = function (args) {
        var event = args.create ? _this._tempEvent : args.event;
        var resource = args.create ? _this._tempResource : args.resource;
        var slot = args.create ? _this._tempSlot : args.slot;
        _this.setState({
          dragData: {
            draggedEvent: event,
            originDates: args.external ? UNDEFINED : _this._getDragDates(event, resource, slot),
            resource: resource
          },
          isTouchDrag: true
        });
      };
      // tslint:disable-next-line: variable-name
      _this._onEventDragModeOff = function (args) {
        _this._hook('onEventDragEnd', {
          domEvent: args.domEvent,
          event: args.event,
          resource: args.resource,
          slot: args.slot,
          source: args.source
        });
        _this.setState({
          dragData: UNDEFINED,
          isTouchDrag: false
        });
      };
      // tslint:disable-next-line: variable-name
      _this._onEventDragStart = function (args) {
        var s = _this.s;
        var isClick = args.click;
        var isListing = s.eventList;
        var isTimeline = _this._isTimeline;
        var resources = _this._visibleResources;
        var slots = _this._slots;
        var timeStep = s.dragTimeStep;
        var startX = args.startX;
        var startY = args.startY;
        var groupByResource = _this._groupByResource;
        var groupCount = groupByResource ? _this._daysNr : _this._hasSlots ? _this._slots.length : resources.length;
        _this._scrollY = 0;
        _this._scrollX = 0;
        _this._calcGridSizes();
        var posX = s.rtl ? _this._gridRight - startX : startX - _this._gridLeft;
        var posY = constrain(startY - _this._gridTop, 8, _this._colHeight - 9); // There's 8px top and 8px bottom spacing
        var colIndex = floor(posX / _this._colWidth);
        var resourceIndex = 0;
        var dayIndex = colIndex;
        var slotIndex = 0;
        if (!isTimeline) {
          var allDayCont = _this._el.querySelector('.mbsc-schedule-all-day-wrapper');
          var allDayRect = allDayCont && allDayCont.getBoundingClientRect();
          _this._allDayTop = allDayRect ? allDayRect.top : _this._gridContTop;
          resourceIndex = groupByResource ? floor(colIndex / groupCount) : colIndex % groupCount;
          dayIndex = groupByResource ? colIndex % groupCount : floor(colIndex / groupCount);
        } else {
          slotIndex = floor(posX / (_this._colWidth / slots.length)) % slots.length;
          resources.forEach(function (r, i) {
            if (posY > _this._resourceTops[r.id]) {
              resourceIndex = i;
            }
          });
        }
        var resource = args.external ? UNDEFINED : resources[resourceIndex];
        var resourceId = resource ? resource.id : UNDEFINED;
        var slot = args.external ? UNDEFINED : slots[slotIndex];
        var slotId = slot ? slot.id : UNDEFINED;
        if (args.create) {
          dayIndex = constrain(dayIndex, 0, _this._daysNr - 1);
          // It's enough to check the bottom of the all day area,
          // because the create gesture is surely started on an all day cell or a time cell
          var allDay = !isTimeline && s.showAllDay && args.endY < _this._gridContTop;
          var eventDay = s.type === 'day' && s.size === 1 ? _this._firstDay : _this._days[dayIndex].date;
          var eventLength = !isListing && (args.external || isClick) ? _this._stepCell : timeStep * ONE_MIN;
          // when working with allDay events, we always use timezoneless dates
          var gridTime = _this._getGridTime(eventDay, posX, posY, dayIndex, isClick ? _this._stepCell / ONE_MIN : timeStep);
          var newStart = allDay || isListing ? eventDay : gridTime;
          var nextDay = addDays(newStart, 1);
          var allDayEnd = s.exclusiveEndDates ? nextDay : new Date(+nextDay - 1);
          var newEnd = allDay || isListing ? allDayEnd : roundTime(createDate(s, +newStart + eventLength), isClick ? 1 : timeStep);
          var eventData = s.extendDefaultEvent
            ? s.extendDefaultEvent({
                resource: resourceId,
                slot: slotId,
                start: newStart
              })
            : UNDEFINED;
          var newEvent = __assign(
            {
              allDay: allDay,
              end: newEnd,
              id: getEventId(),
              resource: resource && resourceId !== DEF_ID ? resourceId : UNDEFINED,
              slot: slot && slotId !== DEF_ID ? slotId : UNDEFINED,
              start: newStart,
              title: s.newEventText
            },
            eventData,
            args.event
          );
          var ev = _this._getEventData(newEvent, eventDay, resource);
          if (args.event) {
            var eventDuration = +ev.endDate - +ev.startDate;
            ev.startDate = eventDay;
            ev.endDate = new Date(+eventDay + eventDuration);
          }
          _this._tempEvent = ev;
          _this._tempResource = resourceId;
          _this._tempSlot = slotId;
        }
        if (!isClick) {
          _this._hook('onEventDragStart', {
            domEvent: args.domEvent,
            event: (args.create ? _this._tempEvent : args.event).original,
            resource: resourceId,
            slot: slotId,
            source: isTimeline ? 'timeline' : 'schedule'
          });
        }
      };
      // tslint:disable-next-line: variable-name
      _this._onEventDragMove = function (args) {
        clearTimeout(_this._scrollTimer);
        var s = _this.s;
        var rtl = s.rtl;
        var rtlNr = rtl ? -1 : 1;
        var isTimeline = _this._isTimeline;
        var daysNr = _this._daysNr;
        var slots = _this._slots;
        var groupByResource = _this._groupByResource;
        var resources = _this._visibleResources;
        var dragData = _this.state.dragData;
        var timeStep = s.dragTimeStep;
        var timeFormat = s.timeFormat;
        var isListing = s.eventList;
        // Limit coordinates to the droppable area
        var startX = args.startX;
        var endX = constrain(args.endX, _this._gridContLeft, _this._gridContRight - 1);
        var endY = constrain(args.endY, _this._gridContTop, _this._gridContBottom - 1);
        var deltaY = endY - args.startY + _this._scrollY;
        var deltaX = rtl ? startX - endX + _this._scrollX : endX - startX + _this._scrollX;
        var delta = isTimeline ? deltaX : deltaY;
        var daySize = isTimeline ? _this._colWidth : _this._colHeight - 16; // Extract 16 to compensate for top/bottom spacing
        var posX = constrain(
          rtl ? _this._gridRight + _this._scrollX - endX : endX - _this._gridLeft + _this._scrollX,
          0,
          _this._gridRight - _this._gridLeft - 1
        );
        var posY = constrain(endY - _this._gridTop + _this._scrollY, 8, _this._colHeight - 9); // There's 8px top and 8px bottom spacing
        var oldIndex = floor((rtl ? _this._gridRight - startX : startX - _this._gridLeft) / _this._colWidth);
        var newIndex = floor(posX / _this._colWidth);
        var inAllDay = s.showAllDay && args.endY < _this._gridContTop;
        var scrollCont = _this._scrollCont;
        var oldDayIndex = oldIndex;
        var newDayIndex = newIndex;
        var resourceIndex = 0;
        var slotIndex = 0;
        var hasScroll = false;
        var distBottom = _this._gridContBottom - args.endY;
        var distTop = args.endY - _this._gridContTop;
        var distLeft = args.endX - _this._gridContLeft;
        var distRight = _this._gridContRight - args.endX;
        var maxScrollH = (scrollCont.scrollWidth - scrollCont.clientWidth) * rtlNr;
        var rightLimit = rtl ? 0 : maxScrollH;
        var leftLimit = rtl ? maxScrollH : 0;
        // Vertical scroll
        if (distBottom < 30 && scrollCont.scrollTop < scrollCont.scrollHeight - scrollCont.clientHeight) {
          scrollCont.scrollTop += 5;
          _this._scrollY += 5;
          hasScroll = true;
        }
        if (distTop < 30 && !inAllDay && scrollCont.scrollTop > 0) {
          scrollCont.scrollTop -= 5;
          _this._scrollY -= 5;
          hasScroll = true;
        }
        // Horizontal scroll
        if (distLeft < 30 + (rtl ? 0 : _this._resWidth) && scrollCont.scrollLeft > leftLimit) {
          scrollCont.scrollLeft -= 5;
          _this._scrollX -= 5 * rtlNr;
          hasScroll = true;
        }
        if (distRight < 30 + (rtl ? _this._resWidth : 0) && scrollCont.scrollLeft < rightLimit) {
          scrollCont.scrollLeft += 5;
          _this._scrollX += 5 * rtlNr;
          hasScroll = true;
        }
        if (hasScroll) {
          _this._scrollTimer = setTimeout(function () {
            _this._onEventDragMove(args);
          }, 20);
        }
        if (!isTimeline) {
          var groupCount = groupByResource ? daysNr : _this._resources.length;
          oldDayIndex = groupByResource ? oldIndex % groupCount : floor(oldIndex / groupCount);
          newDayIndex = groupByResource ? newIndex % groupCount : floor(newIndex / groupCount);
          resourceIndex = groupByResource ? floor(newIndex / groupCount) : newIndex % groupCount;
        } else {
          slotIndex = floor(posX / (_this._colWidth / slots.length)) % slots.length;
          resources.forEach(function (r, i) {
            if (posY > _this._resourceTops[r.id]) {
              resourceIndex = i;
            }
          });
        }
        oldDayIndex = constrain(oldDayIndex, 0, daysNr - 1);
        newDayIndex = constrain(newDayIndex, 0, daysNr - 1);
        var event = args.create ? _this._tempEvent : args.event;
        var start = event.startDate;
        var end = event.endDate;
        var duration = +end - +start;
        var ms = _this._time;
        var timeDelta = floor((ms * delta) / daySize);
        var slotId = slots[slotIndex].id;
        var resourceId = resources[resourceIndex].id;
        var allDay = event.allDay;
        var tzOpt = allDay ? UNDEFINED : s;
        var addDayOnly = allDay || isListing;
        var newStart = start;
        var newEnd = end;
        var newDate;
        var oldDay = _this._days[oldDayIndex].date;
        var newDay = _this._days[newDayIndex].date;
        var dayDelta = s.type === 'day' && s.size === 1 ? 0 : getDayDiff(oldDay, newDay);
        var deltaDiff = dayDelta - newDayIndex + oldDayIndex;
        if (args.drag || args.external) {
          // Drag
          // Only allow changing between all-day / not all-day in case of drag (not resize or create)
          allDay = inAllDay || (isTimeline && event.allDay);
          addDayOnly = inAllDay || isListing || (isTimeline && event.allDay);
          tzOpt = allDay ? UNDEFINED : s;
          if ((event.allDay && !isTimeline && !inAllDay) || (args.external && !inAllDay)) {
            var day = getDateOnly(addDays(start, dayDelta));
            newStart = _this._getGridTime(day, posX, posY, newDayIndex, timeStep);
          } else {
            if (isTimeline && !addDayOnly) {
              newStart = roundTime(createDate(s, +start + timeDelta + (ONE_DAY - ms) * dayDelta + ms * deltaDiff), timeStep);
            } else {
              newDate = addDays(start, dayDelta);
              newStart = addDayOnly ? newDate : roundTime(createDate(tzOpt, +newDate + timeDelta), timeStep);
            }
          }
          // if (end.getMilliseconds() === 999) {
          //   // TODO: this should be removed when non-inclusive end dates are implemented
          //   duration += 1;
          // }
          newEnd = createDate(tzOpt, +newStart + duration);
        } else {
          // Resize, create
          var gridDelta = isTimeline ? 0 : newIndex - oldIndex; // use the initial values for the correct create endResize calc
          var endResize = args.create ? (gridDelta ? gridDelta > 0 : delta > 0) : args.direction === 'end';
          var days = getDayDiff(start, end);
          var startResource = args.create ? _this._tempResource : args.resource;
          if (!isTimeline && groupByResource && startResource !== resourceId && dragData && dragData.draggedEvent) {
            // preserve the previous dayDelta if it is moved out from the resource group
            // TODO check resize
            dayDelta = getDayDiff(dragData.draggedEvent.startDate, dragData.draggedEvent.endDate) * (endResize ? 1 : -1);
          }
          if (endResize) {
            if (isTimeline && !addDayOnly) {
              newEnd = roundTime(createDate(s, +end + timeDelta + dayDelta * (ONE_DAY - ms) + ms * deltaDiff), timeStep);
            } else {
              newDate = addDays(end, Math.max(-days, dayDelta));
              newEnd = addDayOnly ? newDate : roundTime(createDate(tzOpt, +newDate + timeDelta), timeStep);
              // Ensure that end time remains between visible hours
              // TODO: this should be simpler
              if (!addDayOnly && (getDayMilliseconds(newEnd) > _this._endTime + 1 || newEnd >= addDays(getDateOnly(newDate), 1))) {
                newEnd = createDate(s, +getDateOnly(newDate) + _this._endTime + 1);
              }
            }
          } else {
            if (isTimeline && !addDayOnly) {
              newStart = roundTime(createDate(s, +start + timeDelta + dayDelta * (ONE_DAY - ms) + ms * deltaDiff), timeStep);
            } else {
              newDate = addDays(start, Math.min(days, dayDelta));
              newStart = addDayOnly ? newDate : roundTime(createDate(tzOpt, +newDate + timeDelta), timeStep);
              // Ensure that start time remains between visible hours
              // TODO: this should be simpler
              if (!addDayOnly && (getDayMilliseconds(newStart) < _this._startTime || newStart < getDateOnly(newDate))) {
                newStart = createDate(s, +getDateOnly(newDate) + _this._startTime);
              }
            }
          }
          resourceId = startResource; // set the resource back to the starting resource
          // Don't allow end date before start date when resizing all day events
          if (addDayOnly && newEnd < newStart) {
            if (endResize) {
              newEnd = createDate(s, newStart);
            } else {
              newStart = createDate(s, newEnd);
            }
          }
          // Let's have dragTimeStep minutes minimum duration
          if (!addDayOnly && (newEnd < newStart || Math.abs(+newEnd - +newStart) < timeStep * ONE_MIN)) {
            if (endResize) {
              newEnd = createDate(s, +newStart + timeStep * ONE_MIN);
            } else {
              newStart = createDate(s, +newEnd - timeStep * ONE_MIN);
            }
          }
        }
        // Check if dates changed since last move
        if (
          _this._tempStart !== +newStart ||
          _this._tempEnd !== +newEnd ||
          _this._tempAllDay !== allDay ||
          _this._tempResource !== resourceId ||
          _this._tempSlot !== slotId
        ) {
          // Create a copy from the original event
          var draggedEvent = __assign({}, event);
          // Modify the dates
          draggedEvent.startDate = newStart;
          draggedEvent.endDate = newEnd;
          draggedEvent.start = formatDate(timeFormat, newStart, s);
          draggedEvent.end = formatDate(timeFormat, newEnd, s);
          draggedEvent.allDay = allDay;
          _this._tempStart = +newStart;
          _this._tempEnd = +newEnd;
          _this._tempAllDay = allDay;
          _this._tempResource = resourceId;
          _this._tempSlot = slotId;
          // Call mouse move to display the time during drag
          if (!allDay) {
            _this._onMouseMove(args.domEvent, args.drag ? -1 : args.direction ? (args.direction === 'end' ? 1 : -1) : delta);
          }
          _this.setState({
            dragData: {
              draggedDates: _this._getDragDates(draggedEvent, resourceId, slotId),
              draggedEvent: draggedEvent,
              originDates: dragData && dragData.originDates,
              resource: resourceId,
              slot: slotId
            }
          });
        }
      };
      // tslint:disable-next-line: variable-name
      _this._onEventDragEnd = function (args) {
        clearTimeout(_this._scrollTimer);
        var s = _this.s;
        var isCreating = args.create;
        var state = _this.state;
        var dragData = state.dragData;
        if (isCreating && !dragData) {
          // if there was no drag move create dummy object for create on click to work
          dragData = {};
          dragData.draggedEvent = _this._tempEvent;
        }
        if (dragData && dragData.draggedEvent) {
          var event_1 = args.event;
          var draggedEvent = dragData.draggedEvent;
          var newStart = draggedEvent.startDate;
          var newEnd = draggedEvent.endDate;
          var allDay = draggedEvent.allDay;
          var origEvent = draggedEvent.original;
          var oldResource = args.resource;
          var newResource_1 = dragData.resource === UNDEFINED ? oldResource : dragData.resource;
          var eventResource = origEvent.resource === UNDEFINED ? newResource_1 : origEvent.resource;
          var oldSlot = isCreating ? _this._tempSlot : args.slot;
          var newSlot = dragData.slot === UNDEFINED ? oldSlot : dragData.slot;
          var invalids = {};
          var source = _this._isTimeline ? 'timeline' : 'schedule';
          var changed =
            isCreating ||
            +newStart !== +event_1.startDate ||
            +newEnd !== +event_1.endDate ||
            allDay !== event_1.allDay ||
            oldResource !== newResource_1 ||
            oldSlot !== newSlot;
          var updatedResource = eventResource;
          var invalidResources = void 0;
          if (oldResource !== newResource_1 && !isCreating && !_this._isSingleResource) {
            if (isArray(eventResource) && eventResource.length && newResource_1) {
              var indx = eventResource.indexOf(oldResource);
              if (eventResource.indexOf(newResource_1) === -1) {
                // Don't allow to two resource combine
                updatedResource = eventResource.slice();
                updatedResource.splice(indx, 1, newResource_1);
              }
            } else {
              updatedResource = newResource_1;
            }
          }
          if (!updatedResource || !s.resources) {
            // if the event is not tied to a resource, process all invalids
            invalidResources = _this._resources.map(function (r) {
              return r.id;
            });
          } else {
            invalidResources = isArray(updatedResource) ? updatedResource : [updatedResource];
          }
          for (var _i = 0, invalidResources_1 = invalidResources; _i < invalidResources_1.length; _i++) {
            var r = invalidResources_1[_i];
            if (_this._invalids[r]) {
              invalids[r] = _this._invalids[r][newSlot];
            }
          }
          var action = args.action || (state.dragData ? 'drag' : 'click');
          var allowUpdate = changed
            ? s.eventDragEnd({
                action: action,
                collision: checkInvalidCollision$1(invalids, newStart, newEnd, allDay, s.invalidateEvent, s.exclusiveEndDates),
                create: isCreating,
                domEvent: args.domEvent,
                event: draggedEvent,
                resource: updatedResource !== DEF_ID ? updatedResource : UNDEFINED,
                slot: newSlot !== DEF_ID ? newSlot : UNDEFINED,
                source: source
              })
            : true;
          var keepDragMode = state.isTouchDrag && (!isCreating || allowUpdate);
          if (allowUpdate && keepDragMode && oldResource !== newResource_1 && !origEvent.color) {
            var newRes = find(_this._resources, function (r) {
              return r.id === newResource_1;
            });
            var resColor = newRes && newRes.color;
            // update drag mode event color manually
            if (resColor) {
              draggedEvent.color = resColor;
              draggedEvent.style.background = resColor;
              draggedEvent.style.color = getTextColor(resColor);
            } else {
              draggedEvent.color = UNDEFINED;
              draggedEvent.style = {};
            }
          }
          if (!keepDragMode && action !== 'click') {
            _this._hook('onEventDragEnd', {
              domEvent: args.domEvent,
              event: (isCreating ? _this._tempEvent : args.event).original,
              resource: newResource_1,
              slot: newSlot,
              source: source
            });
          }
          _this.setState({
            dragData: keepDragMode
              ? {
                  draggedEvent: draggedEvent,
                  originDates: allowUpdate ? _this._getDragDates(draggedEvent, newResource_1, newSlot) : dragData.originDates
                }
              : UNDEFINED,
            isTouchDrag: keepDragMode
          });
          _this._tempStart = 0;
          _this._tempEnd = 0;
          _this._tempAllDay = UNDEFINED;
        }
      };
      // tslint:disable-next-line: variable-name
      _this._onExternalDrag = function (args) {
        if (_this.s.externalDrop) {
          var isInArea =
            args.endY < _this._gridContBottom &&
            args.endY > _this._allDayTop &&
            args.endX > _this._gridContLeft &&
            args.endX < _this._gridContRight;
          switch (args.eventName) {
            case 'onDragModeOff':
              _this._onEventDragModeOff(args);
              break;
            case 'onDragModeOn':
              _this._onEventDragModeOn(args);
              break;
            case 'onDragStart':
              _this._onEventDragStart(args);
              break;
            case 'onDragMove':
              var clone = args.clone;
              if (isInArea) {
                clone.style.display = 'none';
                _this._onEventDragMove(args);
                _this._onCalendar = true;
              } else if (_this._onCalendar) {
                clearTimeout(_this._scrollTimer);
                clone.style.display = 'table';
                _this.setState({
                  dragData: {}
                });
                _this._tempStart = 0;
                _this._tempEnd = 0;
                _this._tempAllDay = UNDEFINED;
                _this._onCalendar = false;
              }
              break;
            case 'onDragEnd':
              // this is needed, otherwise it creates event on drag click
              if (isInArea) {
                _this._onEventDragEnd(args);
              } else {
                _this.setState({
                  dragData: UNDEFINED,
                  isTouchDrag: false
                });
                _this._hook('onEventDragEnd', {
                  domEvent: args.domEvent,
                  event: args.event,
                  resource: args.resource,
                  slot: args.slot,
                  source: args.source
                });
              }
              break;
          }
        }
      };
      return _this;
    }
    // tslint:enable variable-name
    STBase.prototype._isToday = function (d) {
      return isSameDay(new Date(d), createDate(this.s));
    };
    STBase.prototype._formatTime = function (v, timezone) {
      var s = this.s;
      var format = s.timeFormat;
      var timeFormat = /a/i.test(format) && this._stepLabel === ONE_HOUR && v % ONE_HOUR === 0 ? format.replace(/.[m]+/i, '') : format;
      var d = new Date(+REF_DATE + v);
      var dd = createDate(s, d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());
      if (isMBSCDate(dd) && timezone) {
        dd.setTimezone(timezone);
      }
      return formatDate(timeFormat, dd, s);
    };
    // #endregion Drag & Drop
    STBase.prototype._getEventPos = function (event, day, dateKey, displayedMap) {
      var s = this.s;
      var tzOpt = event.allDay ? UNDEFINED : s;
      var d = createDate(tzOpt, day.getFullYear(), day.getMonth(), day.getDate());
      var dayIndex = this._dayIndexMap[dateKey];
      var nextDay = getDateOnly(addDays(d, 1));
      var firstDay = tzOpt ? this._firstDayTz : this._firstDay;
      var lastDay = tzOpt ? this._lastDayTz : this._lastDay;
      var isTimeline = this._isTimeline;
      var groupByDate = !isTimeline && !this._groupByResource;
      var isAllDay = event.allDay;
      var startTime = this._startTime;
      var endTime = this._endTime + 1;
      var displayedTime = this._time;
      var hasSlots = this._hasSlots;
      var origEndDate = event.endDate;
      var start = event.start;
      var startDate = event.startDate;
      var end = event.end;
      var endDate = getEndDate(s, isAllDay, startDate, origEndDate);
      // Increase endDate by 1ms if start equals with end, to make sure we display
      // 0 length events at the beginning of displayed time range
      var adjust = +startDate === +endDate ? 1 : 0;
      if (isAllDay || isTimeline) {
        if (!displayedMap.get(event.original) || hasSlots || groupByDate) {
          var startDay = s.startDay;
          var endDay = s.endDay;
          var isListing = s.eventList;
          var isFullDay = isAllDay || isListing;
          var isMultiDay = !isSameDay(startDate, endDate);
          var daysNr = this._daysNr;
          if (isTimeline && isMultiDay && getDayMilliseconds(startDate) >= endTime) {
            startDate = createDate(s, +getDateOnly(startDate) + endTime);
          }
          // Need to use the original (inclusive) end date for proper width on DST day
          var endD = isFullDay ? endDate : origEndDate;
          var leftPos = getEventStart(startDate, startTime, displayedTime, firstDay, startDay, endDay);
          var width = getEventWidth(startDate, endD, displayedTime, firstDay, lastDay, startTime, endTime, startDay, endDay, isFullDay);
          if (isTimeline) {
            width = width / daysNr;
            leftPos = (leftPos + dayIndex * 100) / daysNr;
          }
          var position = isTimeline
            ? isFullDay
              ? {
                  left: s.rtl ? '' : (hasSlots ? '' : (dayIndex * 100) / daysNr) + '%',
                  right: s.rtl ? (hasSlots ? '' : (dayIndex * 100) / daysNr) + '%' : '',
                  width: (hasSlots ? '' : width) + '%'
                }
              : {
                  height: this._setRowHeight ? '' : '100%',
                  left: s.rtl ? '' : leftPos + '%',
                  right: s.rtl ? leftPos + '%' : '',
                  top: '0',
                  width: width + '%'
                }
            : {
                width: (isMultiDay && !groupByDate ? width : 100) + '%'
              };
          var isStartInView = getDayMilliseconds(startDate) < endTime && endDate > firstDay;
          var isEndInView = getDayMilliseconds(endDate) + adjust > startTime;
          // Skip events not in view
          if (isFullDay || (isMultiDay && width > 0) || (isStartInView && isEndInView)) {
            displayedMap.set(event.original, true);
            return {
              end: end,
              endDate: endDate,
              position: position,
              start: start,
              startDate: startDate
            };
          }
        }
      } else {
        if (startDate < d) {
          start = '';
          startDate = createDate(s, d);
        }
        if (endDate >= nextDay) {
          end = '';
          endDate = createDate(s, +nextDay - 1);
        }
        if (origEndDate >= nextDay) {
          origEndDate = createDate(s, +nextDay - 1);
        }
        // Skip events not in view
        if (getDayMilliseconds(startDate) < endTime && getDayMilliseconds(endDate) + adjust > startTime && endDate >= startDate) {
          // Need to use the original (inclusive) end date for proper height   on DST day
          var eventHeight = getEventHeight(startDate, origEndDate, displayedTime, startTime, endTime);
          return {
            cssClass: eventHeight < 2 ? ' mbsc-schedule-event-small-height' : '',
            end: end,
            endDate: endDate,
            position: {
              height: eventHeight + '%',
              top: getEventStart(startDate, startTime, displayedTime) + '%',
              width: '100%'
            },
            start: start,
            startDate: startDate
          };
        }
      }
      return;
    };
    STBase.prototype._getEventData = function (event, d, resource, skipLabels) {
      var s = this.s;
      var ev = getEventData(s, event, d, true, s.timeFormat, s.allDayText, '', resource, false, this._isTimeline, skipLabels);
      if (event.allDay && s.exclusiveEndDates && +ev.endDate === +ev.startDate) {
        ev.endDate = getDateOnly(addDays(ev.startDate, 1));
      }
      return ev;
    };
    STBase.prototype._getEvents = function (eventMap) {
      var _this = this;
      var s = this.s;
      var resources = this._resources;
      var slots = this._slots;
      var hasSlots = this._hasSlots;
      var isTimeline = this._isTimeline;
      var isSchedule = !isTimeline;
      var events = {};
      var eventMaps = getResourceMap(eventMap, resources, slots, !!s.resources, !!s.slots);
      var eventLabels = {};
      var firstDay = this._firstDay;
      var lastDay = this._lastDay;
      var connectionMap = {};
      if (s.connections) {
        for (var _i = 0, _a = s.connections; _i < _a.length; _i++) {
          var c = _a[_i];
          connectionMap[c.from] = true;
          connectionMap[c.to] = true;
        }
      }
      var _loop_1 = function (resource) {
        var resourceId = resource.id;
        var eventDisplayMap = new Map();
        var eventsForRange = [];
        var eventRows = 0;
        events[resourceId] = {};
        var _loop_2 = function (slot) {
          var slotId = slot.id;
          var eventsForSlot = eventMaps[resourceId][slotId];
          var eventKeys = Object.keys(eventsForSlot).sort();
          events[resourceId][slotId] = { all: { allDay: [], events: [] } };
          if (isSchedule) {
            eventLabels[slotId] = getLabels(s, eventsForSlot, firstDay, lastDay, -1, this_1._daysNr, true, s.startDay, false, s.eventOrder);
          }
          var _loop_4 = function (dateKey) {
            // The date object is stored on the array for performance reasons, so we don't have to parse it all over again
            // TODO: do this with proper types
            var d = eventMap[dateKey].date;
            if (this_1._dayIndexMap[dateKey] !== UNDEFINED && isInWeek(d.getDay(), s.startDay, s.endDay)) {
              var eventsForDay = sortEvents(eventsForSlot[dateKey]) || [];
              var groups = [];
              var next_1 = {};
              var key_1 = !hasSlots && isTimeline ? 'all' : dateKey;
              var eventNr = 0;
              if (isSchedule || hasSlots) {
                events[resourceId][slotId][key_1] = { allDay: [], events: [] };
              }
              for (var _i = 0, eventsForDay_1 = eventsForDay; _i < eventsForDay_1.length; _i++) {
                var ev = eventsForDay_1[_i];
                if (!ev.allDay || isTimeline) {
                  var event_2 = this_1._getEventData(ev, d, resource);
                  var pos = this_1._getEventPos(event_2, d, dateKey, eventDisplayMap);
                  if (pos) {
                    event_2.cssClass = pos.cssClass;
                    event_2.position = pos.position;
                    if (isSchedule) {
                      event_2.showText = true;
                      calcLayout(s, groups, event_2, next_1, s.eventList);
                    }
                    events[resourceId][slotId][key_1].events.push(event_2);
                    eventsForRange.push(event_2);
                    eventNr++;
                    this_1._eventMap[event_2.id] = event_2;
                  }
                }
              }
              if (hasSlots && eventNr > eventRows) {
                eventRows = eventNr;
              }
              if (isSchedule) {
                // All day events
                if (eventLabels[slotId][dateKey]) {
                  eventLabels[slotId][dateKey].data.forEach(function (_a) {
                    var event = _a.event,
                      width = _a.width;
                    if (event) {
                      var ev = _this._getEventData(event, d, resource);
                      var pos = _this._getEventPos(ev, d, dateKey, eventDisplayMap);
                      ev.position = { width: pos ? pos.position.width : width };
                      ev.showText = !!pos;
                      events[resourceId][slotId][key_1].allDay.push(ev);
                    }
                  });
                }
                var _loop_5 = function (group) {
                  var nr = group.length;
                  group.forEach(function (level, i) {
                    for (var _i = 0, level_1 = level; _i < level_1.length; _i++) {
                      var event_3 = level_1[_i];
                      var dimension = (((next_1[event_3.uid] || nr) - i) / nr) * 100;
                      event_3.position.width = dimension + '%';
                      event_3.position[s.rtl ? 'right' : 'left'] = (i * 100) / nr + '%';
                      event_3.position[s.rtl ? 'left' : 'right'] = 'auto';
                    }
                  });
                };
                // Set the width and left of the non all-day events, based on the final layout
                for (var _a = 0, groups_2 = groups; _a < groups_2.length; _a++) {
                  var group = groups_2[_a];
                  _loop_5(group);
                }
              }
            } else if (s.connections) {
              // Process the events which are part of a connection, but not shown on the view
              var eventsForDay = eventsForSlot[dateKey] || [];
              for (var _b = 0, eventsForDay_2 = eventsForDay; _b < eventsForDay_2.length; _b++) {
                var event_4 = eventsForDay_2[_b];
                var id = event_4.id;
                if (!this_1._eventMap[id] && connectionMap[id]) {
                  this_1._eventMap[id] = this_1._getEventData(event_4, d, resource);
                }
              }
            }
          };
          for (var _i = 0, eventKeys_1 = eventKeys; _i < eventKeys_1.length; _i++) {
            var dateKey = eventKeys_1[_i];
            _loop_4(dateKey);
          }
        };
        for (var _i = 0, slots_1 = slots; _i < slots_1.length; _i++) {
          var slot = slots_1[_i];
          _loop_2(slot);
        }
        // In case of the timeline, calculate the layout for the whole displayed view, not just per day
        if (isTimeline && !hasSlots) {
          var groups = [];
          var next_2 = {};
          var variableRow_1 = this_1._setRowHeight;
          for (var _a = 0, eventsForRange_1 = eventsForRange; _a < eventsForRange_1.length; _a++) {
            var event_5 = eventsForRange_1[_a];
            calcLayout(s, groups, event_5, next_2, s.eventList);
          }
          var _loop_3 = function (group) {
            var nr = group.length;
            if (variableRow_1 && nr > eventRows) {
              eventRows = nr;
            }
            group.forEach(function (level, i) {
              for (var _i = 0, level_2 = level; _i < level_2.length; _i++) {
                var event_6 = level_2[_i];
                var dimension = (((next_2[event_6.uid] || nr) - i) / nr) * 100;
                event_6.position.height = variableRow_1 ? '' : dimension + '%';
                event_6.position.top = variableRow_1 ? i : (i * 100) / nr + '%';
              }
            });
          };
          for (var _b = 0, groups_1 = groups; _b < groups_1.length; _b++) {
            var group = groups_1[_b];
            _loop_3(group);
          }
        }
        this_1._eventRows[resourceId] = eventRows || 1; // make sure the min-height will be at least 1 event tall
      };
      var this_1 = this;
      for (var _b = 0, resources_1 = resources; _b < resources_1.length; _b++) {
        var resource = resources_1[_b];
        _loop_1(resource);
      }
      return events;
    };
    STBase.prototype._getInvalids = function (invalidMap) {
      var _a;
      var s = this.s;
      var isListing = s.eventList;
      var invalids = {};
      var invalidMaps = getResourceMap(invalidMap, this._resources, this._slots, !!s.resources, !!s.slots);
      var invalidKeys = Object.keys(invalidMap || {}).sort();
      var minDate = isListing ? getDateOnly(new Date(s.minDate)) : new Date(s.minDate);
      var maxDate = isListing ? getDateOnly(addDays(new Date(s.maxDate), 1)) : new Date(s.maxDate);
      var isTimeline = this._isTimeline;
      for (var _i = 0, _b = this._resources; _i < _b.length; _i++) {
        var resource = _b[_i];
        var resourceId = resource.id;
        var invalidDisplayedMap = new Map();
        invalids[resourceId] = {};
        for (var _c = 0, _d = this._slots; _c < _d.length; _c++) {
          var slot = _d[_c];
          var slotId = slot.id;
          var allInvalids = { invalids: [] };
          invalids[resourceId][slotId] = { all: allInvalids };
          for (var _e = 0, invalidKeys_1 = invalidKeys; _e < invalidKeys_1.length; _e++) {
            var dateKey = invalidKeys_1[_e];
            var d = makeDate(dateKey);
            if (isInWeek(d.getDay(), s.startDay, s.endDay)) {
              var invalidsForDay = invalidMaps[resourceId][slotId][dateKey] || [];
              // Contains all invalids for the day
              var allDailyInvalids = { invalids: [] };
              // Only contains invalids beginning on the day, for the timeline
              var dailyInvalids = [];
              invalids[resourceId][slotId][dateKey] = allDailyInvalids;
              if (d < minDate) {
                invalidsForDay.push({
                  end: minDate,
                  start: new Date(d)
                });
              }
              if (d >= getDateOnly(maxDate)) {
                invalidsForDay.push({
                  end: new Date(this._lastDay),
                  start: maxDate
                });
              }
              for (var _f = 0, invalidsForDay_1 = invalidsForDay; _f < invalidsForDay_1.length; _f++) {
                var invalid = invalidsForDay_1[_f];
                // if a string or a date object is passed
                if (isString(invalid) || isDate(invalid)) {
                  var start = makeDate(invalid);
                  var end = new Date(start);
                  invalid = { allDay: true, end: end, start: start };
                }
                var invalidData = this._getEventData(invalid, d, resource, true);
                invalidData.cssClass = '';
                invalidData.position = UNDEFINED;
                var pos = this._getEventPos(invalidData, d, dateKey, invalidDisplayedMap);
                if (pos) {
                  // If the invalid spans across the whole day, make it invalid
                  if (!isTimeline && getDayMilliseconds(pos.startDate) === 0 && new Date(+pos.endDate + 1) >= addDays(d, 1)) {
                    invalidData.allDay = true;
                  } else {
                    invalidData.position = pos.position;
                    if (getDayMilliseconds(pos.startDate) <= this._startTime) {
                      invalidData.cssClass += ' mbsc-schedule-invalid-start';
                    }
                    if (getDayMilliseconds(pos.endDate) >= this._endTime) {
                      invalidData.cssClass += ' mbsc-schedule-invalid-end';
                    }
                  }
                  dailyInvalids.push(invalidData);
                }
                allDailyInvalids.invalids.push(invalidData);
                if (invalidData.allDay) {
                  if (!isTimeline) {
                    invalidData.position = {};
                  }
                  allDailyInvalids.allDay = invalidData;
                  allDailyInvalids.invalids = [invalidData];
                  dailyInvalids = [invalidData];
                  break;
                }
              }
              (_a = allInvalids.invalids).push.apply(_a, dailyInvalids);
            }
          }
        }
      }
      return invalids;
    };
    STBase.prototype._getColors = function (colorMap) {
      var s = this.s;
      var colors = {};
      var colorMaps = getResourceMap(colorMap, this._resources, this._slots, !!s.resources, !!s.slots);
      var colorKeys = Object.keys(colorMap || {}).sort();
      var hasSlots = this._hasSlots;
      var isTimeline = this._isTimeline;
      for (var _i = 0, _a = this._resources; _i < _a.length; _i++) {
        var resource = _a[_i];
        var resourceId = resource.id;
        var colorDisplayedMap = new Map();
        colors[resourceId] = {};
        for (var _b = 0, _c = this._slots; _b < _c.length; _b++) {
          var slot = _c[_b];
          var slotId = slot.id;
          colors[resourceId][slotId] = { all: { colors: [] } };
          for (var _d = 0, colorKeys_1 = colorKeys; _d < colorKeys_1.length; _d++) {
            var dateKey = colorKeys_1[_d];
            var d = makeDate(dateKey);
            if (isInWeek(d.getDay(), s.startDay, s.endDay)) {
              var colorsForDay = colorMaps[resourceId][slotId][dateKey] || [];
              var key = !hasSlots && isTimeline ? 'all' : dateKey;
              if (!isTimeline || hasSlots) {
                colors[resourceId][slotId][key] = { colors: [] };
              }
              var dailyColors = colors[resourceId][slotId][key];
              for (var _e = 0, colorsForDay_1 = colorsForDay; _e < colorsForDay_1.length; _e++) {
                var color = colorsForDay_1[_e];
                var colorData = this._getEventData(color, d, resource, true);
                if (colorData.allDay && !isTimeline) {
                  dailyColors.allDay = colorData;
                } else {
                  var pos = this._getEventPos(colorData, d, dateKey, colorDisplayedMap);
                  if (pos) {
                    colorData.position = pos.position;
                    colorData.cssClass = '';
                    if (getDayMilliseconds(pos.startDate) <= this._startTime) {
                      colorData.cssClass += ' mbsc-schedule-color-start';
                    }
                    if (getDayMilliseconds(pos.endDate) >= this._endTime) {
                      colorData.cssClass += ' mbsc-schedule-color-end';
                    }
                    dailyColors.colors.push(colorData);
                  }
                }
                colorData.position.background = color.background;
                colorData.position.color = color.textColor ? color.textColor : getTextColor(color.background);
              }
            }
          }
        }
      }
      return colors;
    };
    STBase.prototype._flattenResources = function (resources, flat, depth, all) {
      var res = resources && resources.length ? resources : [{ id: DEF_ID }];
      for (var _i = 0, res_1 = res; _i < res_1.length; _i++) {
        var r = res_1[_i];
        r.depth = depth;
        r.isParent = !!(r.children && r.children.length);
        flat.push(r);
        if (r.isParent) {
          this._hasHierarchy = true;
          if (!r.collapsed || all) {
            this._flattenResources(r.children, flat, depth + 1, all);
          }
        }
      }
      return flat;
    };
    // #region Lifecycle hooks
    STBase.prototype._render = function (s, state) {
      var _this = this;
      var prevS = this._prevS;
      var isTimeline = this._isTimeline;
      var selected = new Date(s.selected);
      var size = +s.size;
      var stepLabel = roundStep(s.timeLabelStep);
      var stepCell = roundStep(s.timeCellStep);
      var firstDay = s.firstDay;
      var startDay = s.startDay;
      var endDay = s.endDay;
      var resources = s.resources;
      var slots = s.slots;
      var resourceChange = s.groupBy !== prevS.groupBy || resources !== prevS.resources;
      var disableVirtual = s.virtualScroll === false;
      var reloadData = s.rtl !== prevS.rtl || resourceChange;
      var startTime = this._startTime;
      var endTime = this._endTime;
      if (
        s.startTime !== prevS.startTime ||
        s.endTime !== prevS.endTime ||
        s.timeLabelStep !== prevS.timeLabelStep ||
        s.timeCellStep !== prevS.timeCellStep ||
        s.timeFormat !== prevS.timeFormat ||
        this._startTime === UNDEFINED ||
        this._endTime === UNDEFINED
      ) {
        var start = makeDate(s.startTime || '00:00');
        var end = new Date(+makeDate(s.endTime || '00:00') - 1);
        this._startTime = startTime = getDayMilliseconds(start);
        this._endTime = endTime = getDayMilliseconds(end);
        this._time = endTime - startTime + 1;
        this._timesBetween = getArray(floor(stepCell / stepLabel) - 1);
        this._times = [];
        this._timeLabels = {};
        var timeStep = stepCell * ONE_MIN;
        var timesFrom = floor(startTime / timeStep) * timeStep;
        var _loop_6 = function (d) {
          this_2._times.push(d);
          if (isTimeline) {
            // Pre-generate time labels to prevent in on every render
            var first = d === timesFrom;
            this_2._timeLabels[d] = first || d % (stepLabel * ONE_MIN) === 0 ? this_2._formatTime(first ? startTime : d) : '';
            this_2._timesBetween.forEach(function (tb, i) {
              var ms = d + (i + 1) * stepLabel * ONE_MIN;
              _this._timeLabels[ms] = _this._formatTime(ms);
            });
          }
        };
        var this_2 = this;
        for (var d = timesFrom; d <= endTime; d += timeStep) {
          _loop_6(d);
        }
        reloadData = true;
      }
      if (
        resourceChange ||
        startDay !== prevS.startDay ||
        endDay !== prevS.endDay ||
        slots !== prevS.slots ||
        s.dayNames !== prevS.dayNames ||
        s.eventList !== prevS.eventList ||
        s.getDay !== prevS.getDay ||
        s.refDate !== prevS.refDate ||
        s.rowHeight !== prevS.rowHeight ||
        s.selected !== prevS.selected ||
        s.size !== prevS.size ||
        s.showDays !== prevS.showDays ||
        s.type !== prevS.type ||
        s.weekNumbers !== prevS.weekNumbers
      ) {
        var now = removeTimezone(createDate(s));
        var isDaily = s.type === 'day';
        var isMonthly = s.type === 'month';
        var isYearly = s.type === 'year';
        var firstGridDay = void 0;
        var lastGridDay = void 0;
        var firstHeaderDay = void 0;
        var lastHeaderDay = void 0;
        if (size > 1 || isYearly || isMonthly) {
          var navService = s.navigationService;
          firstHeaderDay = firstGridDay = navService.firstDay;
          lastHeaderDay = lastGridDay = navService.lastDay;
        } else {
          var firstWeekDay = getFirstDayOfWeek(selected, s);
          firstHeaderDay = addDays(firstWeekDay, startDay - firstDay + (startDay < firstDay ? 7 : 0));
          if (isDaily) {
            // When startDay is different from the locale firstDay, the selected day might end up
            // outside of the week defined by startDay and end Day
            if (selected < firstHeaderDay) {
              firstHeaderDay = addDays(firstHeaderDay, -7);
            }
            if (selected >= addDays(firstHeaderDay, 7)) {
              firstHeaderDay = addDays(firstHeaderDay, 7);
            }
          }
          lastHeaderDay = addDays(firstHeaderDay, endDay - startDay + 1 + (endDay < startDay ? 7 : 0));
          firstGridDay = isDaily ? getDateOnly(selected) : firstHeaderDay;
          lastGridDay = isDaily ? addDays(firstGridDay, 1) : lastHeaderDay;
        }
        this._isMulti = size > 1 || isYearly;
        this._hasHierarchy = false;
        this._resources = this._flattenResources(resources, [], 0, true);
        this._visibleResources = this._flattenResources(resources, [], 0);
        this._hasSlots = isTimeline && !!slots && slots.length > 0;
        this._slots = slots && slots.length ? slots : [{ id: DEF_ID }];
        this._isSingleResource = this._resources.length === 1;
        this._groupByResource = (s.groupBy !== 'date' && !(isDaily && size < 2)) || this._isSingleResource;
        this._firstDay = firstGridDay;
        this._lastDay = lastGridDay;
        this._firstDayTz = createDate(s, firstGridDay.getFullYear(), firstGridDay.getMonth(), firstGridDay.getDate());
        this._lastDayTz = createDate(s, lastGridDay.getFullYear(), lastGridDay.getMonth(), lastGridDay.getDate());
        this._selectedDay = +getDateOnly(selected);
        this._setRowHeight = s.eventList || s.rowHeight !== 'equal';
        this._shouldAnimateScroll = prevS.selected !== UNDEFINED;
        this._showTimeIndicator =
          (!isTimeline || (isTimeline && !isMonthly && !isYearly)) &&
          !s.eventList &&
          (isDaily && size < 2 ? isSameDay(now, selected) : firstGridDay <= now && lastGridDay >= now);
        // Generate day data
        this._dayIndexMap = {};
        this._days = [];
        this._headerDays = [];
        var i = 0;
        var month = -1;
        var monthIndex = -1;
        var monthText = '';
        var week = -1;
        var weekIndex = -1;
        var weekText = '';
        var first = firstGridDay;
        var last = lastGridDay;
        var isDayViewOnly = isDaily && size < 2;
        var monthPos = s.dateFormat.search(/m/i);
        var yearPos = s.dateFormat.search(/y/i);
        var yearFirst = yearPos < monthPos;
        if (!isTimeline && isDayViewOnly) {
          first = firstHeaderDay;
          last = lastHeaderDay;
        }
        for (var d = getDateOnly(first); d < getDateOnly(last); d.setDate(d.getDate() + 1)) {
          if (isInWeek(d.getDay(), startDay, endDay)) {
            var dateKey = getDateStr(d);
            var monthTitle = '';
            var weekTitle = '';
            if (isTimeline) {
              var newWeek = s.getWeekNumber(addDays(d, (7 - firstDay + 1) % 7));
              var newMonth = s.getMonth(d);
              if (month !== newMonth) {
                monthIndex = i;
                month = newMonth;
                var year = s.getYear(d);
                var monthName = s.monthNames[month];
                monthText = yearFirst ? year + ' ' + monthName : monthName + ' ' + year;
                monthTitle = monthText;
                if (i > 0) {
                  this._days[i - 1].lastOfMonth = true;
                }
              }
              if (week !== newWeek) {
                weekIndex = i;
                week = newWeek;
                weekText = s.weekText.replace(/{count}/, week);
                weekTitle = weekText;
                if (i > 0) {
                  this._days[i - 1].lastOfWeek = true;
                }
              }
            }
            var dayData = {
              date: new Date(d),
              dateIndex: i,
              dateKey: dateKey,
              dateText: formatDate(isMonthly || this._isMulti ? 'D DDD' : s.dateFormatLong, d, s),
              day: s.getDay(d),
              label: formatDate('DDDD, MMMM D, YYYY', d, s),
              monthIndex: monthIndex,
              monthText: monthText,
              monthTitle: monthTitle,
              timestamp: +getDateOnly(d),
              weekIndex: weekIndex,
              weekText: weekText,
              weekTitle: weekTitle
            };
            if (isDayViewOnly) {
              this._headerDays.push(dayData);
            }
            if (!isDayViewOnly || this._selectedDay === +d) {
              this._days.push(dayData);
            }
            this._dayIndexMap[dateKey] = i;
            i++;
          }
        }
        this._daysNr = isDayViewOnly ? 1 : i;
        reloadData = true;
      }
      if (s.colorsMap !== prevS.colorsMap || reloadData) {
        this._colors = this._getColors(s.colorsMap);
      }
      if (s.eventMap !== prevS.eventMap || reloadData || !this._events) {
        this._eventMap = {};
        this._eventRows = {};
        this._events = this._getEvents(s.eventMap);
      }
      if (s.invalidsMap !== prevS.invalidsMap || reloadData) {
        this._invalids = this._getInvalids(s.invalidsMap);
      }
      // We need to check the event height in case of timeline
      var checkEventHeight = isTimeline && s.eventMap !== prevS.eventMap;
      if (s.height !== prevS.height || s.width !== prevS.width || checkEventHeight || reloadData) {
        this._shouldCheckSize = isBrowser && !!s.height && !!s.width;
      }
      if (s.scroll !== prevS.scroll) {
        this._shouldScroll = true;
      }
      if (s.height !== UNDEFINED) {
        // Only set sticky on the second render, to solve SSR different markup issues
        this._hasSideSticky = hasSticky && !s.rtl;
        this._hasSticky = hasSticky;
      }
      this._stepCell = stepCell * ONE_MIN;
      this._stepLabel = stepLabel * ONE_MIN;
      this._dayNames = state.dayNameWidth > 49 ? s.dayNamesShort : s.dayNamesMin;
      this._displayTime = stepLabel < 1440;
      this._eventHeight = state.eventHeight || (s.eventList ? 24 : 46);
      this._showCursorTime = this._displayTime && !!(s.dragToCreate || s.dragToMove || s.dragToResize);
      this._headerClass =
        ' mbsc-timeline-header-placeholder mbsc-timeline-header-row-' +
        (1 + (this._isMulti ? 1 : 0) + (this._displayTime || this._hasSlots ? 1 : 0) + (s.weekNumbers ? 1 : 0));
      // Calculate day batches for virtual scroll
      if (isTimeline) {
        var daysBatch = [];
        // limit rendered days to min 1 day & max 30(maxBatchDay) days
        var daysBatchNr = this._daysBatchNr === UNDEFINED ? constrain(floor(this._stepCell / (this._time / 30)), 1, 30) : this._daysBatchNr;
        var dayIndex = this._dayIndexMap[getDateStr(selected)] || 0;
        var batchIndexX = state.batchIndexX !== UNDEFINED ? state.batchIndexX : round(dayIndex / daysBatchNr);
        // limit the batch day index within the displayed days (it can be bigger if switching from a big view to a smaller one)
        var batchDayIndex = Math.min(batchIndexX * daysBatchNr, this._daysNr - 1);
        var batchStart = disableVirtual ? 0 : Math.max(0, batchDayIndex - floor((daysBatchNr * 3) / 2));
        var batchEnd = disableVirtual ? this._daysNr : Math.min(batchStart + 3 * daysBatchNr, this._daysNr);
        var batchStartDay = this._days[batchStart].date;
        var batchEndDay = addDays(this._days[batchEnd - 1].date, 1);
        for (var i = batchStart; i < batchEnd; i++) {
          daysBatch.push(this._days[i]);
        }
        this._batchStart = createDate(s, batchStartDay.getFullYear(), batchStartDay.getMonth(), batchStartDay.getDate());
        this._batchEnd = createDate(s, batchEndDay.getFullYear(), batchEndDay.getMonth(), batchEndDay.getDate());
        this._daysBatch = daysBatch;
        this._daysBatchNr = daysBatchNr;
        this._placeholderSizeX = state.dayWidth * round(Math.max(0, batchDayIndex - (daysBatchNr * 3) / 2)) || 0;
        // vertical virtual scroll
        var gridContHeight_1 = (state.scrollContHeight || 0) - (state.headerHeight || 0);
        var rowHeight_1 = state.rowHeight || 52;
        var resourcesBatch = [];
        var batchIndexY = state.batchIndexY || 0;
        var visibleResources = this._visibleResources;
        var virtualPagesY_1 = [];
        var pageIndex_1 = -1;
        var gridHeight_1 = 0;
        // calculate virtual pages for vertical scroll
        if (gridContHeight_1) {
          if (state.hasScrollY) {
            this._resourceTops = {};
          }
          visibleResources.forEach(function (r, i) {
            // in case of event listing the default calculated height is less then css min-height
            var resHeight = _this._setRowHeight ? Math.max(_this._eventRows[r.id] * _this._eventHeight + 16, 52) : rowHeight_1;
            var currPageIndex = floor(gridHeight_1 / gridContHeight_1);
            if (state.hasScrollY) {
              // Store resource row tops if there is vertical scroll
              _this._resourceTops[r.id] = gridHeight_1;
            }
            if (currPageIndex !== pageIndex_1) {
              virtualPagesY_1.push({
                startIndex: i,
                top: gridHeight_1
              });
              pageIndex_1 = currPageIndex;
            }
            gridHeight_1 += resHeight;
          });
        }
        var startPage = virtualPagesY_1[batchIndexY - 1];
        var endPage = virtualPagesY_1[batchIndexY + 2];
        var batchStartY = startPage ? startPage.startIndex : 0;
        // Render max 30 resources on the initial render
        var batchEndY = endPage ? endPage.startIndex : gridHeight_1 ? visibleResources.length : 30;
        // When there's no scroll, render all rows
        if (disableVirtual || (gridHeight_1 && !state.hasScrollY)) {
          batchStartY = 0;
          batchEndY = visibleResources.length;
        }
        for (var i = batchStartY; i < batchEndY; i++) {
          var res = visibleResources[i];
          if (res) {
            resourcesBatch.push(res);
          }
        }
        this._gridHeight = gridHeight_1;
        this._virtualPagesY = virtualPagesY_1;
        this._resourcesBatch = resourcesBatch;
        this._placeholderSizeY = startPage && !disableVirtual ? startPage.top : 0;
      }
    };
    STBase.prototype._mounted = function () {
      var _this = this;
      var allowCreate;
      var allowStart;
      var validTarget;
      this._unlisten = gestureListener(this._el, {
        onDoubleClick: function (args) {
          var s = _this.s;
          if (validTarget && s.clickToCreate && s.clickToCreate !== 'single') {
            args.click = true;
            _this._onEventDragStart(args);
            _this._onEventDragEnd(args);
          }
        },
        onEnd: function (args) {
          if (!allowCreate && allowStart && _this.s.clickToCreate === 'single') {
            allowCreate = true;
            args.click = true;
            _this._onEventDragStart(args);
          }
          if (allowCreate) {
            // Will prevent mousedown event on doc, which would exit drag mode
            args.domEvent.preventDefault();
            _this._onEventDragEnd(args);
          }
          clearTimeout(_this._touchTimer);
          allowCreate = false;
          allowStart = false;
        },
        onMove: function (args) {
          var s = _this.s;
          if (allowCreate && s.dragToCreate) {
            args.domEvent.preventDefault();
            _this._onEventDragMove(args);
          } else if (allowStart && s.dragToCreate && (Math.abs(args.deltaX) > 7 || Math.abs(args.deltaY) > 7)) {
            allowCreate = true;
            _this._onEventDragStart(args);
          } else {
            clearTimeout(_this._touchTimer);
          }
        },
        onStart: function (args) {
          var s = _this.s;
          args.create = true;
          args.click = false;
          if (!allowCreate && (s.dragToCreate || s.clickToCreate)) {
            var targetClasses = (args.domEvent.target && args.domEvent.target.classList) || [];
            validTarget =
              targetClasses.contains('mbsc-schedule-item') ||
              targetClasses.contains('mbsc-schedule-all-day-item') ||
              targetClasses.contains('mbsc-timeline-column');
            if (validTarget) {
              if (args.isTouch && s.dragToCreate) {
                _this._touchTimer = setTimeout(function () {
                  _this._onEventDragStart(args);
                  _this._onEventDragModeOn(args);
                  allowCreate = true;
                }, 350);
              } else {
                allowStart = !args.isTouch;
              }
            }
          }
        }
      });
      this._unsubscribe = subscribeExternalDrag(this._onExternalDrag);
    };
    STBase.prototype._updated = function () {
      var _this = this;
      var s = this.s;
      var state = this.state;
      if (this._shouldCheckSize) {
        ngSetTimeout(this, function () {
          var resCont = _this._resCont;
          var resContWidth = resCont ? resCont.offsetWidth : 0;
          var headerCont = _this._headerCont;
          var headerHeight = headerCont.offsetHeight;
          var scrollCont = _this._scrollCont;
          var scrollContWidth = scrollCont.offsetWidth;
          var scrollContHeight = scrollCont.offsetHeight;
          var scrollClientWidth = scrollCont.clientWidth;
          var scrollClientHeight = scrollCont.clientHeight;
          var scrollBarSizeY = scrollContWidth - scrollClientWidth;
          var scrollBarSizeX = scrollContHeight - scrollClientHeight;
          var gridContWidth = scrollContWidth - resContWidth; // Available space for grid
          var gridContHeight = scrollContHeight - headerHeight;
          var hasScrollY = scrollCont.scrollHeight > scrollClientHeight;
          var hasScrollX = scrollCont.scrollWidth > scrollClientWidth;
          var cellHeight;
          var cellWidth;
          var dayWidth;
          var dayNameWidth;
          var gridWidth;
          var rowHeight;
          var eventHeight = state.eventHeight;
          if (_this._isTimeline) {
            var day = scrollCont.querySelector('.mbsc-timeline-day');
            var gridRow = scrollCont.querySelector('.mbsc-timeline-row');
            dayWidth = day ? day.offsetWidth : 64;
            rowHeight = gridRow ? gridRow.offsetHeight : 52;
            // Since the width of the grid is set in case of virtual scroll, we need to double check, if there will be horizontall scroll
            if (dayWidth * _this._daysNr < gridContWidth) {
              hasScrollX = false;
            }
            if (_this._gridHeight && _this._gridHeight < gridContHeight) {
              hasScrollY = false;
            }
            dayWidth = hasScrollX ? dayWidth : round(gridContWidth / _this._daysNr);
            gridWidth = hasScrollX ? dayWidth * _this._daysNr : gridContWidth;
            cellWidth = (_this._stepCell * dayWidth) / _this._time;
            _this._gridWidth = gridWidth;
            _this._daysBatchNr = Math.max(1, Math.ceil(gridContWidth / dayWidth));
            if (!_this._hasSticky) {
              headerCont.style[s.rtl ? 'left' : 'right'] = scrollBarSizeY + 'px';
            }
            if (!_this._hasSideSticky && resCont) {
              resCont.style.bottom = scrollBarSizeX + 'px';
            }
            if (_this._setRowHeight) {
              var event_7 = scrollCont.querySelector('.mbsc-schedule-event');
              if (event_7) {
                eventHeight = event_7.clientHeight;
              }
            }
            if (!hasScrollY) {
              // Calculate tops of the resource rows, when there's no vertical scroll
              _this._resourceTops = {};
              var grid = _this._gridCont;
              var gridRect_1 = grid.getBoundingClientRect();
              var rows = grid.querySelectorAll('.mbsc-timeline-row');
              rows.forEach(function (r, i) {
                _this._resourceTops[_this._visibleResources[i].id] = r.getBoundingClientRect().top - gridRect_1.top;
              });
            }
          } else {
            _this._calcGridSizes();
            var gridCol = _this._el.querySelector('.mbsc-schedule-column-inner');
            var dayName = _this._el.querySelector('.mbsc-schedule-header-item');
            cellHeight = gridCol ? (_this._stepCell * gridCol.offsetHeight) / _this._time : 0;
            dayNameWidth = dayName ? dayName.offsetWidth : 0;
          }
          // Make sure scroll remains in sync
          _this._onScroll();
          _this._calcConnections = !!s.connections && (_this._isParentClick || _this._calcConnections || !hasScrollY);
          _this._shouldCheckSize = false;
          _this._isCursorTimeVisible = false;
          _this._isTouch = false;
          _this.setState({
            cellHeight: cellHeight,
            cellWidth: cellWidth,
            dayNameWidth: dayNameWidth,
            dayWidth: dayWidth,
            eventHeight: eventHeight,
            gridWidth: gridWidth,
            hasScrollX: hasScrollX,
            hasScrollY: hasScrollY,
            headerHeight: headerHeight,
            rowHeight: rowHeight,
            scrollContHeight: hasScrollX ? scrollClientHeight : scrollContHeight,
            // Force update if connection calculation is needed
            update: _this._calcConnections ? (state.update || 0) + 1 : state.update
          });
        });
      }
      // only scroll to time when the dayWidth is set in case of timeline
      if (this._shouldScroll && (state.dayWidth || !this._isTimeline)) {
        ngSetTimeout(this, function () {
          _this._scrollToTime(_this._shouldAnimateScroll);
        });
        this._shouldScroll = false;
      }
    };
    STBase.prototype._destroy = function () {
      this._unlisten();
      unsubscribeExternalDrag(this._unsubscribe);
    };
    // #endregion Lifecycle hooks
    STBase.prototype._calcGridSizes = function () {
      var s = this.s;
      var resources = this._resources;
      var isTimeline = this._isTimeline;
      var daysNr = this._daysNr * (isTimeline ? 1 : resources.length);
      var grid = this._gridCont;
      var scrollCont = this._scrollCont;
      var rect = grid.getBoundingClientRect();
      var gridRect = scrollCont.getBoundingClientRect();
      var gridWidth = isTimeline ? rect.width : grid.scrollWidth;
      this._gridLeft = s.rtl ? rect.right - gridWidth : rect.left;
      this._gridRight = s.rtl ? rect.right : rect.left + gridWidth;
      this._gridTop = rect.top;
      this._gridContTop = gridRect.top;
      this._gridContBottom = gridRect.bottom;
      this._gridContLeft = gridRect.left;
      this._gridContRight = gridRect.right;
      this._allDayTop = this._gridContTop;
      this._colWidth = gridWidth / daysNr;
      this._colHeight = rect.height;
      this._resWidth = this._resCont ? this._resCont.offsetWidth : 0;
    };
    STBase.prototype._getDragDates = function (event, resourceId, slotId) {
      var s = this.s;
      var dates = {};
      var dragDisplayedMap = new Map();
      var first = event.allDay ? this._firstDay : this._firstDayTz;
      var start = event.startDate;
      var end = event.endDate;
      start = getDateOnly(start);
      start = start < first ? first : start;
      end = getEndDate(s, event.allDay || s.eventList, start, end);
      // If event has no duration, it should still be added to the start day
      while (start <= end) {
        var eventForDay = __assign({}, event);
        var dateKey = getDateStr(start);
        var pos = isInWeek(start.getDay(), s.startDay, s.endDay) && this._getEventPos(event, start, dateKey, dragDisplayedMap);
        if (pos) {
          var key = this._isTimeline && !this._hasSlots ? 'all' : dateKey;
          eventForDay.date = +getDateOnly(start, true);
          eventForDay.cssClass = pos.cssClass;
          eventForDay.start = pos.start;
          eventForDay.end = pos.end;
          eventForDay.position = pos.position;
          // Add the data for the day
          dates[resourceId + '__' + (this._isTimeline ? slotId + '__' : '') + key] = eventForDay;
        }
        start = addDays(start, 1);
      }
      return dates;
    };
    /**
     * Returns a date with the time based on the coordinates on the grid.
     * @param day We're on this day.
     * @param posX X coord - for timeline.
     * @param posY Y coord - for schedule.
     * @param dayIndex Index of the day on the timeline.
     * @param timeStep Time step in minutes.
     */
    STBase.prototype._getGridTime = function (day, posX, posY, dayIndex, timeStep) {
      var ms = step(
        this._isTimeline
          ? floor((this._time * (posX - dayIndex * this._colWidth)) / this._colWidth)
          : floor((this._time * (posY - 8)) / (this._colHeight - 16)),
        timeStep * ONE_MIN
      ); // Remove 16px for top and bottom spacing
      var time = new Date(+REF_DATE + this._startTime + ms); // Date with no DST
      return createDate(this.s, day.getFullYear(), day.getMonth(), day.getDate(), time.getHours(), time.getMinutes());
    };
    STBase.prototype._scrollToTime = function (animate) {
      var el = this._scrollCont;
      var gridCont = this._gridCont;
      var isTimeline = this._isTimeline;
      if (el) {
        var s = this.s;
        var navigateToEvent = s.navigateToEvent;
        var targetDate =
          navigateToEvent && navigateToEvent.start
            ? roundTime(new Date(+makeDate(navigateToEvent.start, s) - this._stepCell), s.timeCellStep)
            : new Date(s.selected); // : createDate(s, s.selected);
        targetDate.setHours(s.eventList ? 0 : targetDate.getHours(), 0);
        var timeStart = getEventStart(targetDate, this._startTime, this._time * (isTimeline ? this._daysNr : 1));
        var dayDiff = getGridDayDiff(this._firstDay, targetDate, s.startDay, s.endDay);
        var width = isTimeline ? gridCont.offsetWidth : gridCont.scrollWidth;
        var newScrollPosX = (width * ((dayDiff * 100) / this._daysNr + (isTimeline ? timeStart : 0))) / 100;
        var newScrollPosY = void 0;
        if (navigateToEvent) {
          var res = navigateToEvent.resource;
          var eventResource_1 = isArray(res) ? res[0] : res;
          if (eventResource_1) {
            if (isTimeline) {
              newScrollPosY = this._resourceTops[eventResource_1];
            } else {
              var colWidth = this._colWidth;
              var resources = this._visibleResources;
              var resourceIndex =
                findIndex(resources, function (r) {
                  return r.id === eventResource_1;
                }) || 0;
              if (this._groupByResource && !this._isSingleResource) {
                newScrollPosX = this._daysNr * colWidth * resourceIndex + colWidth * dayDiff;
              } else {
                newScrollPosX = resources.length * dayDiff * colWidth + resourceIndex * colWidth;
              }
            }
          }
        }
        if (!isTimeline) {
          var gridCol = el.querySelector('.mbsc-schedule-column-inner');
          newScrollPosY = gridCol ? (gridCol.offsetHeight * timeStart) / 100 : 0;
          if (this._groupByResource && !this._isSingleResource && !navigateToEvent) {
            newScrollPosX = UNDEFINED;
          }
        }
        smoothScroll(el, newScrollPosX, newScrollPosY, animate, s.rtl);
      }
    };
    return STBase;
  })(BaseComponent);

  /** @hidden */
  var SchedulerBase = /*#__PURE__*/ (function (_super) {
    __extends(SchedulerBase, _super);
    function SchedulerBase() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      // tslint:disable-next-line: variable-name
      _this._onScroll = function () {
        var grid = _this._scrollCont;
        if (grid) {
          var scrollTop = grid.scrollTop;
          var scrollLeft = 'translateX(' + -grid.scrollLeft + 'px)';
          var timeCont = _this._timeCont;
          var allDay = _this._allDayCont;
          var header = _this._headerCont;
          var transform = (jsPrefix ? jsPrefix + 'T' : 't') + 'ransform';
          if (allDay) {
            allDay.style[transform] = scrollLeft;
          }
          if (timeCont) {
            timeCont.style.marginTop = -scrollTop + 'px';
          }
          if (header) {
            header.style[transform] = scrollLeft;
          }
          if (scrollTop === 0) {
            _this.setState({ showShadow: false });
          } else if (!_this.state.showShadow) {
            _this.setState({ showShadow: true });
          }
          _this._onMouseMove();
        }
      };
      return _this;
    }
    SchedulerBase.prototype._render = function (s, state) {
      _super.prototype._render.call(this, s, state);
      var prevS = this._prevS;
      var timezones = s.timezones;
      var stepCell = this._stepCell / ONE_MIN;
      var startMinutes = floor(this._startTime / ONE_MIN) % stepCell;
      var endMinutes = (floor(this._endTime / ONE_MIN) % stepCell) + 1;
      if (timezones !== prevS.timezones) {
        this._timeWidth = timezones ? { width: timezones.length * 4.25 + 'em' } : UNDEFINED;
        this._timezones = UNDEFINED;
        if (timezones) {
          var tz = [];
          for (var _i = 0, timezones_1 = timezones; _i < timezones_1.length; _i++) {
            var t = timezones_1[_i];
            var tzProps = void 0;
            if (isString(t)) {
              var d = createDate(s, 1970, 0, 1);
              if (isMBSCDate(d)) {
                d.setTimezone(t);
              }
              var offset = (d.getTimezoneOffset() / 60) * -1;
              tzProps = {
                label: 'UTC' + (offset > 0 ? '+' : '') + offset,
                timezone: t
              };
            } else {
              tzProps = t;
            }
            tz.push(tzProps);
          }
          this._timezones = tz;
        }
      }
      this._largeDayNames = state.dayNameWidth > 99;
      this._startCellStyle =
        startMinutes % stepCell !== 0
          ? {
              height: (state.cellHeight || 50) * (((stepCell - startMinutes) % stepCell) / stepCell) + 'px'
            }
          : UNDEFINED;
      this._endCellStyle =
        endMinutes % stepCell !== 0
          ? {
              height: ((state.cellHeight || 50) * (endMinutes % stepCell)) / stepCell + 'px'
            }
          : UNDEFINED;
    };
    return SchedulerBase;
  })(STBase);

  /** @hidden */
  var TimeIndicatorBase = /*#__PURE__*/ (function (_super) {
    __extends(TimeIndicatorBase, _super);
    function TimeIndicatorBase() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    // tslint:enable variable-name
    TimeIndicatorBase.prototype._mounted = function () {
      var _this = this;
      clearInterval(this._timer);
      this._timer = setInterval(function () {
        if (_this._zone) {
          _this._zone.runOutsideAngular(function () {
            _this.forceUpdate();
          });
        } else {
          _this.forceUpdate();
        }
      }, 10000);
    };
    TimeIndicatorBase.prototype._destroy = function () {
      clearInterval(this._timer);
    };
    TimeIndicatorBase.prototype._render = function (s) {
      var now = createDate(s);
      var rtl = s.rtl;
      var displayedDays = s.displayedDays;
      var displayedTime = s.displayedTime;
      var startTime = s.startTime;
      var time = floor(getDayMilliseconds(now) / ONE_MIN) * ONE_MIN;
      var timezones = s.timezones;
      var formatOpt = { amText: s.amText, pmText: s.pmText };
      if (timezones && isMBSCDate(now)) {
        this._times = [];
        for (var _i = 0, timezones_1 = timezones; _i < timezones_1.length; _i++) {
          var t = timezones_1[_i];
          var tzNow = now.clone();
          tzNow.setTimezone(t.timezone);
          this._times.push(formatDate(s.timeFormat, tzNow, formatOpt));
        }
      } else {
        this._time = formatDate(s.timeFormat, now, formatOpt);
      }
      this._cssClass =
        'mbsc-schedule-time-indicator mbsc-schedule-time-indicator-' +
        s.orientation +
        this._theme +
        this._rtl +
        ' ' +
        // (s.cssClass || '') +
        (time < startTime || time > startTime + displayedTime || !isInWeek(now.getDay(), s.startDay, s.endDay) ? ' mbsc-hidden' : '');
      var dayIndex = getGridDayDiff(s.firstDay, now, s.startDay, s.endDay);
      if (s.orientation === 'x') {
        var horiz = (dayIndex * 100) / displayedDays + '%';
        var multiPos = timezones && 4.25 * timezones.length + 'em';
        this._pos = {
          left: timezones && !rtl ? multiPos : UNDEFINED,
          right: timezones && rtl ? multiPos : UNDEFINED,
          top: ((time - startTime) * 100) / displayedTime + '%'
        };
        this._dayPos = {
          left: rtl ? '' : horiz,
          right: rtl ? horiz : '',
          width: 100 / displayedDays + '%'
        };
      } else {
        var pos = ((dayIndex * displayedTime + time - startTime) * 100) / (displayedDays * displayedTime) + '%';
        this._pos = {
          left: rtl ? '' : pos,
          right: rtl ? pos : ''
        };
      }
    };
    return TimeIndicatorBase;
  })(BaseComponent);

  // tslint:disable no-non-null-assertion
  /**
   * The TimeIndicator component.
   *
   * Usage:
   *
   * ```
   * <TimeIndicator scheduleTimeIndicatorPosition="{}" />
   * ```
   */
  var TimeIndicator = /*#__PURE__*/ (function (_super) {
    __extends(TimeIndicator, _super);
    function TimeIndicator() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    TimeIndicator.prototype._template = function (s) {
      var _this = this;
      var timezones = s.timezones;
      return createElement(
        'div',
        { 'aria-hidden': 'true', className: this._cssClass, style: this._pos },
        createElement(
          'div',
          {
            className:
              (timezones ? 'mbsc-flex ' : '') +
              'mbsc-schedule-time-indicator-time mbsc-schedule-time-indicator-time-' +
              s.orientation +
              this._theme +
              this._rtl
          },
          timezones
            ? timezones.map(function (t, i) {
                return createElement(
                  'div',
                  { key: i, className: 'mbsc-schedule-time-indicator-tz' + _this._theme + _this._rtl },
                  _this._times[i]
                );
              })
            : this._time
        ),
        s.showDayIndicator && createElement('div', { className: 'mbsc-schedule-time-indicator-day' + this._theme, style: this._dayPos })
      );
    };
    return TimeIndicator;
  })(TimeIndicatorBase);

  /** @hidden */
  var WeekDayBase = /*#__PURE__*/ (function (_super) {
    __extends(WeekDayBase, _super);
    function WeekDayBase() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      // tslint:enable variable-name
      // tslint:disable-next-line variable-name
      _this._onClick = function () {
        var s = _this.s;
        if (s.selectable) {
          s.onClick(s.timestamp);
        }
      };
      return _this;
    }
    WeekDayBase.prototype._render = function (s, state) {
      var date = new Date(s.timestamp);
      this._cssClass =
        'mbsc-schedule-header-item ' +
        this._className +
        this._theme +
        this._rtl +
        this._hb +
        (s.largeNames ? ' mbsc-schedule-header-item-large' : '') +
        (s.selected ? ' mbsc-selected' : '') +
        (state.hasHover ? ' mbsc-hover' : '');
      this._data = {
        date: date,
        events: s.events,
        resource: s.resource,
        selected: s.selected
      };
      this._day = date.getDay();
    };
    WeekDayBase.prototype._mounted = function () {
      var _this = this;
      this._unlisten = gestureListener(this._el, {
        onHoverIn: function () {
          if (_this.s.selectable) {
            _this.setState({ hasHover: true });
          }
        },
        onHoverOut: function () {
          if (_this.s.selectable) {
            _this.setState({ hasHover: false });
          }
        }
      });
    };
    WeekDayBase.prototype._destroy = function () {
      if (this._unlisten) {
        this._unlisten();
      }
    };
    return WeekDayBase;
  })(BaseComponent);

  // tslint:disable no-non-null-assertion
  /** @hidden */
  var WeekDay = /*#__PURE__*/ (function (_super) {
    __extends(WeekDay, _super);
    function WeekDay() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    WeekDay.prototype._template = function (s, state) {
      var content;
      if (s.renderDay) {
        content = s.renderDay(this._data);
      }
      if (s.renderDayContent) {
        content = s.renderDayContent(this._data);
      }
      if (isString(content)) {
        content = createElement('div', { dangerouslySetInnerHTML: this._safeHtml(content) });
        this._shouldEnhance = true;
      }
      return createElement(
        'div',
        { ref: this._setEl, className: this._cssClass, onClick: this._onClick },
        s.renderDay
          ? content
          : createElement(
              Fragment,
              null,
              createElement(
                'div',
                {
                  'aria-hidden': 'true',
                  className:
                    'mbsc-schedule-header-dayname' +
                    this._theme +
                    (s.selected ? ' mbsc-selected' : '') +
                    (s.isToday ? ' mbsc-schedule-header-dayname-curr' : '')
                },
                s.dayNames[this._day]
              ),
              createElement(
                'div',
                {
                  'aria-hidden': 'true',
                  className:
                    'mbsc-schedule-header-day' +
                    this._theme +
                    this._rtl +
                    (s.selected ? ' mbsc-selected' : '') +
                    (s.isToday ? ' mbsc-schedule-header-day-today' : '') +
                    (state.hasHover ? ' mbsc-hover' : '')
                },
                s.day
              ),
              s.label &&
                createElement(
                  'div',
                  {
                    className: 'mbsc-hidden-content',
                    'aria-pressed': s.selectable ? (s.selected ? 'true' : 'false') : UNDEFINED,
                    role: s.selectable ? 'button' : UNDEFINED
                  },
                  s.label
                ),
              s.renderDayContent && content
            )
      );
    };
    return WeekDay;
  })(WeekDayBase);

  var Scheduler = /*#__PURE__*/ (function (_super) {
    __extends(Scheduler, _super);
    function Scheduler() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      // tslint:disable-next-line: variable-name
      _this._setCont = function (el) {
        _this._scrollCont = el;
      };
      // tslint:disable-next-line: variable-name
      _this._setTimeCont = function (el) {
        _this._timeCont = el;
      };
      // tslint:disable-next-line: variable-name
      _this._setAllDayCont = function (el) {
        _this._allDayCont = el;
      };
      // tslint:disable-next-line: variable-name
      _this._setGridCont = function (el) {
        _this._gridCont = el;
      };
      // tslint:disable-next-line: variable-name
      _this._setHeaderCont = function (el) {
        _this._headerCont = el;
      };
      // tslint:disable-next-line: variable-name
      _this._setCursorTimeCont = function (el) {
        _this._cursorTimeCont = el;
      };
      return _this;
    }
    Scheduler.prototype._template = function (s, state) {
      var _this = this;
      var colors = this._colors;
      var dragData = state.dragData;
      var draggedEventId = dragData && dragData.draggedEvent && dragData.draggedEvent.id;
      var events = this._events;
      var invalids = this._invalids;
      var hb = this._hb;
      var rtl = this._rtl;
      var times = this._times;
      var startTime = this._startTime;
      var endTime = this._endTime;
      var startCellStyle = this._startCellStyle;
      var endCellStyle = this._endCellStyle;
      var stepLabel = this._stepLabel;
      var theme = this._theme;
      var isSingleResource = this._isSingleResource;
      var eventMap = s.eventMap || {};
      var source = 'schedule';
      var groupClass = ' mbsc-flex-1-0 mbsc-schedule-resource-group' + theme + rtl;
      var timezones = this._timezones;
      var groupByResource = this._groupByResource;
      var days = this._days;
      var resources = this._resources;
      var weekDayProps = {
        dayNames: this._dayNames,
        largeNames: this._largeDayNames,
        onClick: s.onWeekDayClick,
        renderDay: s.renderDay,
        renderDayContent: s.renderDayContent,
        rtl: s.rtl,
        theme: s.theme
      };
      var renderResource = function (resource) {
        var content = resource.name;
        var html;
        if (s.renderResource) {
          content = s.renderResource(resource);
          if (isString(content)) {
            html = _this._safeHtml(content);
            _this._shouldEnhance = true;
          }
        }
        return (
          content &&
          createElement(
            'div',
            {
              key: resource.id,
              className:
                'mbsc-schedule-resource' +
                theme +
                rtl +
                hb +
                (!groupByResource || (s.type === 'day' && s.size === 1) ? ' mbsc-flex-1-0 mbsc-schedule-col-width' : '')
            },
            createElement('div', { dangerouslySetInnerHTML: html, className: 'mbsc-schedule-resource-title' }, content)
          )
        );
      };
      var renderEvents = function (data, dateKey, resource, allDay) {
        var dragKey = resource + '__' + dateKey;
        var eventProps = {
          displayTimezone: s.displayTimezone,
          drag: s.dragToMove,
          endDay: s.endDay,
          exclusiveEndDates: s.exclusiveEndDates,
          gridEndTime: endTime,
          gridStartTime: startTime,
          lastDay: +_this._lastDay,
          render: s.renderEvent,
          renderContent: s.renderEventContent,
          resize: s.dragToResize,
          resource: resource,
          rtl: s.rtl,
          singleDay: !groupByResource,
          startDay: s.startDay,
          theme: s.theme,
          timezonePlugin: s.timezonePlugin
        };
        return createElement(
          Fragment,
          null,
          data.map(function (event) {
            return event.showText
              ? createElement(
                  ScheduleEvent,
                  __assign({}, eventProps, {
                    event: event,
                    key: event.uid,
                    inactive: draggedEventId === event.id,
                    selected: s.selectedEventsMap[event.uid] || s.selectedEventsMap[event.id],
                    onClick: s.onEventClick,
                    onDoubleClick: s.onEventDoubleClick,
                    onRightClick: s.onEventRightClick,
                    onDelete: s.onEventDelete,
                    onHoverIn: s.onEventHoverIn,
                    onHoverOut: s.onEventHoverOut,
                    onDragStart: _this._onEventDragStart,
                    onDragMove: _this._onEventDragMove,
                    onDragEnd: _this._onEventDragEnd,
                    onDragModeOn: _this._onEventDragModeOn,
                    onDragModeOff: _this._onEventDragModeOff
                  })
                )
              : createElement(
                  'div',
                  { key: event.uid, className: 'mbsc-schedule-event mbsc-schedule-event-all-day mbsc-schedule-event-all-day-placeholder' },
                  createElement('div', { className: 'mbsc-schedule-event-all-day-inner' + theme })
                );
          }),
          dragData &&
            dragData.originDates &&
            dragData.originDates[dragKey] &&
            !!dragData.originDates[dragKey].allDay === !!allDay &&
            createElement(
              ScheduleEvent,
              __assign({}, eventProps, {
                event: dragData.originDates[dragKey],
                hidden: dragData && !!dragData.draggedDates,
                isDrag: true,
                onDragStart: _this._onEventDragStart,
                onDragMove: _this._onEventDragMove,
                onDragEnd: _this._onEventDragEnd,
                onDragModeOff: _this._onEventDragModeOff
              })
            ),
          dragData &&
            dragData.draggedDates &&
            dragData.draggedDates[dragKey] &&
            !!dragData.draggedDates[dragKey].allDay === !!allDay &&
            createElement(ScheduleEvent, __assign({}, eventProps, { event: dragData.draggedDates[dragKey], isDrag: true }))
        );
      };
      var renderTimes = function (timezone) {
        return times.map(function (v, i) {
          var first = !i;
          var last = i === times.length - 1;
          return createElement(
            'div',
            {
              key: i,
              className:
                'mbsc-flex-col mbsc-flex-1-0 mbsc-schedule-time-wrapper' +
                theme +
                rtl +
                (last ? ' mbsc-schedule-time-wrapper-end' : '') +
                ((first && startCellStyle) || (last && endCellStyle) ? ' mbsc-flex-none' : ''),
              style: first ? startCellStyle : last ? endCellStyle : {}
            },
            createElement(
              'div',
              { className: 'mbsc-flex-1-1 mbsc-schedule-time' + theme + rtl },
              first || v % stepLabel === 0 ? _this._formatTime(first ? startTime : v, timezone) : ''
            ),
            _this._timesBetween.map(function (t, j) {
              var ms = v + (j + 1) * stepLabel;
              return (
                ms > startTime &&
                ms < endTime &&
                createElement(
                  'div',
                  { key: j, className: 'mbsc-flex-1-1 mbsc-schedule-time' + theme + rtl },
                  _this._formatTime(ms, timezone)
                )
              );
            }),
            last &&
              createElement(
                'div',
                { className: 'mbsc-schedule-time mbsc-schedule-time-end' + theme + rtl },
                _this._formatTime(endTime + 1, timezone)
              )
          );
        });
      };
      var renderAllDayData = function (resource, dateKey, i, timestamp) {
        var invalid = invalids[resource][DEF_ID][dateKey] && invalids[resource][DEF_ID][dateKey].allDay;
        var color = colors[resource][DEF_ID][dateKey] && colors[resource][DEF_ID][dateKey].allDay;
        var dayEvents = events[resource][DEF_ID][dateKey] && events[resource][DEF_ID][dateKey].allDay;
        return createElement(
          'div',
          { key: i + '-' + timestamp, className: 'mbsc-schedule-all-day-item mbsc-schedule-col-width mbsc-flex-1-0' + theme + rtl + hb },
          renderEvents(dayEvents || [], dateKey, resource, true),
          invalid &&
            createElement(
              'div',
              { className: 'mbsc-schedule-invalid mbsc-schedule-invalid-all-day' + theme },
              createElement('div', { className: 'mbsc-schedule-invalid-text' }, invalid.title)
            ),
          color &&
            createElement(
              'div',
              { className: 'mbsc-schedule-color mbsc-schedule-color-all-day' + theme, style: color.position },
              createElement('div', { className: 'mbsc-schedule-color-text' }, color.title)
            )
        );
      };
      var renderDayData = function (resource, dateKey, i, timestamp) {
        var dayInvalids = invalids[resource][DEF_ID][dateKey] && invalids[resource][DEF_ID][dateKey].invalids;
        var dayColors = colors[resource][DEF_ID][dateKey] && colors[resource][DEF_ID][dateKey].colors;
        var dayEvents = events[resource][DEF_ID][dateKey] && events[resource][DEF_ID][dateKey].events;
        return createElement(
          'div',
          {
            key: i + '-' + timestamp,
            className: 'mbsc-flex-col mbsc-flex-1-0 mbsc-schedule-column mbsc-schedule-col-width' + theme + rtl + hb
          },
          createElement(
            'div',
            { className: 'mbsc-flex-col mbsc-flex-1-1 mbsc-schedule-column-inner' + theme + rtl + hb },
            createElement('div', { className: 'mbsc-schedule-events' + rtl }, renderEvents(dayEvents || [], dateKey, resource)),
            dayInvalids &&
              dayInvalids.map(function (invalid, j) {
                return (
                  invalid.position &&
                  createElement(
                    'div',
                    { key: j, className: 'mbsc-schedule-invalid' + invalid.cssClass + theme, style: invalid.position },
                    createElement('div', { className: 'mbsc-schedule-invalid-text' }, invalid.allDay ? '' : invalid.title || '')
                  )
                );
              }),
            dayColors &&
              dayColors.map(function (color, j) {
                return createElement(
                  'div',
                  { key: j, className: 'mbsc-schedule-color' + color.cssClass + theme, style: color.position },
                  createElement('div', { className: 'mbsc-schedule-color-text' }, color.title)
                );
              }),
            times.map(function (v, j) {
              var date = getCellDate(timestamp, v);
              var first = !j;
              var last = j === times.length - 1;
              return createElement('div', {
                key: j,
                className:
                  'mbsc-schedule-item mbsc-flex-1-0' +
                  theme +
                  hb +
                  (last ? ' mbsc-schedule-item-last' : '') +
                  ((first && startCellStyle) || (last && endCellStyle) ? ' mbsc-flex-none' : ''),
                // tslint:disable jsx-no-lambda
                onClick: function (domEvent) {
                  return s.onCellClick({ date: date, domEvent: domEvent, resource: resource, source: source });
                },
                onDoubleClick: function (domEvent) {
                  return s.onCellDoubleClick({ date: date, domEvent: domEvent, resource: resource, source: source });
                },
                onContextMenu: function (domEvent) {
                  return s.onCellRightClick({ date: date, domEvent: domEvent, resource: resource, source: source });
                },
                // tslint:enable jsx-no-lambda
                style: first ? startCellStyle : last ? endCellStyle : {}
              });
            })
          )
        );
      };
      return createElement(
        'div',
        {
          ref: this._setEl,
          className: 'mbsc-flex-col mbsc-flex-1-1 mbsc-schedule-wrapper' + theme + (this._daysNr > 7 ? ' mbsc-schedule-wrapper-multi' : '')
        },
        createElement(
          'div',
          { className: 'mbsc-schedule-header mbsc-flex mbsc-flex-none' + theme + hb },
          createElement('div', {
            className: 'mbsc-schedule-time-col mbsc-schedule-time-col-empty' + theme + rtl + hb,
            style: this._timeWidth
          }),
          createElement(
            'div',
            { className: 'mbsc-flex-1-1 mbsc-schedule-header-wrapper' },
            createElement(
              'div',
              { ref: this._setHeaderCont, className: 'mbsc-flex' },
              s.type === 'day' && s.size === 1
                ? createElement(
                    'div',
                    { className: groupClass },
                    createElement(
                      'div',
                      { className: 'mbsc-flex' },
                      s.showDays &&
                        this._headerDays.map(function (dayData) {
                          var timestamp = dayData.timestamp;
                          return createElement(
                            WeekDay,
                            __assign({}, weekDayProps, {
                              key: timestamp,
                              cssClass: 'mbsc-flex-1-1',
                              day: dayData.day,
                              events: eventMap[dayData.dateKey],
                              isToday: _this._isToday(timestamp),
                              label: dayData.label,
                              selectable: true,
                              selected: _this._selectedDay === timestamp,
                              timestamp: timestamp
                            })
                          );
                        })
                    ),
                    s.resources && createElement('div', { className: 'mbsc-flex' }, resources.map(renderResource))
                  )
                : groupByResource
                ? resources.map(function (resource, i) {
                    return createElement(
                      'div',
                      { key: i, className: groupClass },
                      renderResource(resource),
                      createElement(
                        'div',
                        { className: 'mbsc-flex' },
                        s.showDays &&
                          days.map(function (dayData) {
                            var timestamp = dayData.timestamp;
                            return createElement(
                              WeekDay,
                              __assign({}, weekDayProps, {
                                key: timestamp,
                                cssClass: 'mbsc-flex-1-0 mbsc-schedule-col-width',
                                day: dayData.day,
                                events: eventMap[dayData.dateKey],
                                isToday: isSingleResource && _this._isToday(timestamp),
                                label: dayData.label,
                                resource: resource.id,
                                selectable: false,
                                selected: isSingleResource && _this._isToday(timestamp),
                                timestamp: timestamp
                              })
                            );
                          })
                      )
                    );
                  })
                : days.map(function (dayData, i) {
                    var timestamp = dayData.timestamp;
                    return createElement(
                      'div',
                      { key: i, className: groupClass },
                      s.showDays &&
                        createElement(
                          WeekDay,
                          __assign({}, weekDayProps, {
                            key: timestamp,
                            day: dayData.day,
                            events: eventMap[dayData.dateKey],
                            isToday: isSingleResource && _this._isToday(timestamp),
                            label: dayData.label,
                            selectable: false,
                            selected: _this._isToday(timestamp),
                            timestamp: timestamp
                          })
                        ),
                      s.resources && createElement('div', { className: 'mbsc-flex' }, resources.map(renderResource))
                    );
                  })
            )
          ),
          createElement('div', { className: 'mbsc-schedule-fake-scroll-y' })
        ),
        createElement(
          'div',
          { className: 'mbsc-schedule-all-day-cont' + (state.showShadow ? ' mbsc-schedule-all-day-wrapper-shadow' : '') + theme },
          timezones &&
            createElement(
              'div',
              { className: 'mbsc-flex mbsc-schedule-timezone-labels', style: this._timeWidth },
              timezones.map(function (tz, i) {
                return createElement('div', { key: i, className: 'mbsc-flex-1-0-0 mbsc-schedule-timezone-label' + theme + rtl }, tz.label);
              })
            ),
          s.showAllDay &&
            createElement(
              'div',
              { className: 'mbsc-schedule-all-day-wrapper mbsc-flex-none' + theme + hb },
              createElement(
                'div',
                { className: 'mbsc-flex mbsc-schedule-all-day' + theme },
                createElement(
                  'div',
                  { className: 'mbsc-schedule-time-col' + theme + rtl, style: this._timeWidth },
                  !timezones && createElement('div', { className: 'mbsc-schedule-all-day-text' + theme + rtl }, s.allDayText)
                ),
                createElement(
                  'div',
                  { className: 'mbsc-flex-col mbsc-flex-1-1 mbsc-schedule-all-day-group-wrapper' },
                  createElement(
                    'div',
                    { ref: this._setAllDayCont, className: 'mbsc-flex mbsc-flex-1-1' },
                    groupByResource
                      ? resources.map(function (resource, i) {
                          return createElement(
                            'div',
                            { key: i, className: 'mbsc-flex' + groupClass },
                            days.map(function (day, j) {
                              return renderAllDayData(resource.id, day.dateKey, j, day.timestamp);
                            })
                          );
                        })
                      : days.map(function (day, i) {
                          return createElement(
                            'div',
                            { key: i, className: 'mbsc-flex' + groupClass },
                            resources.map(function (resource, j) {
                              return renderAllDayData(resource.id, day.dateKey, j, day.timestamp);
                            })
                          );
                        })
                  )
                )
              )
            )
        ),
        createElement(
          'div',
          { className: 'mbsc-flex mbsc-flex-1-1 mbsc-schedule-grid-wrapper' + theme },
          createElement(
            'div',
            {
              'aria-hidden': 'true',
              className: 'mbsc-flex-col mbsc-schedule-time-col mbsc-schedule-time-cont' + theme + rtl,
              style: this._timeWidth,
              ref: this._setTimeCont
            },
            createElement(
              'div',
              { className: 'mbsc-flex mbsc-schedule-time-cont-inner' },
              createElement(
                'div',
                { className: 'mbsc-flex-col mbsc-flex-1-1' },
                createElement(
                  'div',
                  {
                    className:
                      'mbsc-flex-1-1 mbsc-schedule-time-cont-pos' +
                      theme +
                      (timezones ? ' mbsc-flex' : ' mbsc-flex-col mbsc-schedule-time-col-last')
                  },
                  timezones
                    ? timezones.map(function (tz, i) {
                        return createElement(
                          'div',
                          {
                            key: i,
                            className: 'mbsc-flex-col' + theme + (i === timezones.length - 1 ? ' mbsc-schedule-time-col-last' : '')
                          },
                          renderTimes(tz.timezone)
                        );
                      })
                    : renderTimes(),
                  this._showTimeIndicator &&
                    createElement(TimeIndicator, {
                      amText: s.amText,
                      displayedTime: this._time,
                      displayedDays: this._daysNr,
                      displayTimezone: s.displayTimezone,
                      endDay: s.endDay,
                      firstDay: this._firstDayTz,
                      orientation: 'x',
                      pmText: s.pmText,
                      rtl: s.rtl,
                      showDayIndicator: isSingleResource && !this._isMulti && s.type === 'week',
                      startDay: s.startDay,
                      startTime: startTime,
                      theme: s.theme,
                      timeFormat: s.timeFormat,
                      timezones: timezones,
                      timezonePlugin: s.timezonePlugin
                    }),
                  this._showCursorTime &&
                    createElement('div', {
                      ref: this._setCursorTimeCont,
                      className: 'mbsc-schedule-cursor-time mbsc-schedule-cursor-time-x' + theme + rtl
                    })
                ),
                state.hasScrollX && createElement('div', { className: 'mbsc-schedule-fake-scroll-x' })
              ),
              createElement('div', { className: 'mbsc-schedule-fake-scroll-y' })
            )
          ),
          createElement(
            'div',
            { ref: this._setCont, className: 'mbsc-flex-col mbsc-flex-1-1 mbsc-schedule-grid-scroll' + theme, onScroll: this._onScroll },
            createElement(
              'div',
              { className: 'mbsc-flex mbsc-flex-1-1' },
              createElement(
                'div',
                {
                  className: 'mbsc-flex mbsc-schedule-grid',
                  ref: this._setGridCont,
                  onMouseLeave: this._onMouseLeave,
                  onMouseMove: this._onMouseMove,
                  onTouchStart: this._onTouchStart
                },
                groupByResource
                  ? resources.map(function (resource, i) {
                      return createElement(
                        'div',
                        { key: i, className: 'mbsc-flex' + groupClass },
                        days.map(function (day, j) {
                          return renderDayData(resource.id, day.dateKey, j, day.timestamp);
                        })
                      );
                    })
                  : days.map(function (day, i) {
                      return createElement(
                        'div',
                        { key: i, className: 'mbsc-flex' + groupClass },
                        resources.map(function (resource, j) {
                          return renderDayData(resource.id, day.dateKey, j, day.timestamp);
                        })
                      );
                    })
              )
            )
          )
        ),
        dragData && !state.isTouchDrag && createElement('div', { className: 'mbsc-calendar-dragging' })
      );
    };
    return Scheduler;
  })(SchedulerBase);

  /** @hidden */
  var TimelineBase = /*#__PURE__*/ (function (_super) {
    __extends(TimelineBase, _super);
    function TimelineBase() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      // tslint:disable variable-name
      _this._isTimeline = true;
      // tslint:enable variable-name
      // tslint:disable-next-line: variable-name
      _this._onScroll = function () {
        var s = _this.s;
        var isRtl = s.rtl;
        var state = _this.state;
        var gridWidth = _this._gridWidth;
        var scrollCont = _this._scrollCont;
        var scrollTop = scrollCont.scrollTop;
        var scrollLeft = scrollCont.scrollLeft;
        var resCont = _this._resCont;
        var header = _this._headerCont;
        var stickyHeader = _this._stickyHeader;
        var daysNr = _this._daysNr;
        var rtl = isRtl ? -1 : 1;
        var margin = isRtl ? 'marginRight' : 'marginLeft';
        var batchIndexX = round((scrollLeft * rtl * (daysNr / _this._daysBatchNr)) / gridWidth);
        // Vertical virtual page index
        var virtualPagesY = _this._virtualPagesY || [];
        var batchIndexY = 0;
        var i = 0;
        while (i < virtualPagesY.length && virtualPagesY[i].top <= scrollTop) {
          batchIndexY = i;
          i++;
        }
        // RTL issue https://bugs.chromium.org/p/chromium/issues/detail?id=1140374
        if (resCont && (!hasSticky || isRtl)) {
          resCont.scrollTop = scrollTop;
        }
        if (stickyHeader && hasSticky) {
          // Update the sticky header position to handle scroll bounce on touch devices
          var headerStyle = stickyHeader.style;
          headerStyle.marginTop = scrollTop < 0 ? -scrollTop + 'px' : '';
          headerStyle[margin] = scrollLeft * rtl < 0 ? -scrollLeft * rtl + 'px' : '';
        }
        if (header && gridWidth) {
          var days_1 = _this._days;
          var dayWidth_1 = gridWidth / daysNr;
          var dayIndex_1 = constrain(floor((scrollLeft * rtl) / dayWidth_1), 0, daysNr - 1);
          var updateStickyLabel = function (label, key) {
            if (label && dayWidth_1) {
              label.textContent = days_1[dayIndex_1][key + 'Text'];
              var labelWidth = label.offsetWidth;
              var labelStyle = label.style;
              var nextDayIndex = constrain(floor((scrollLeft * rtl + labelWidth) / dayWidth_1), 0, daysNr - 1);
              if (days_1[dayIndex_1][key + 'Index'] !== days_1[nextDayIndex][key + 'Index']) {
                labelStyle[margin] = -(scrollLeft * rtl + labelWidth - days_1[nextDayIndex][key + 'Index'] * dayWidth_1 + 1) + 'px';
              } else {
                labelStyle[margin] = '';
              }
            }
          };
          updateStickyLabel(_this._stickyDate, 'date');
          updateStickyLabel(_this._stickyMonth, 'month');
          updateStickyLabel(_this._stickyWeek, 'week');
          if (!hasSticky) {
            header.scrollLeft = scrollLeft;
          }
        }
        if (gridWidth && (batchIndexX !== state.batchIndexX || batchIndexY !== state.batchIndexY)) {
          _this.setState({ batchIndexX: batchIndexX, batchIndexY: batchIndexY });
        }
        _this._onMouseMove();
      };
      return _this;
    }
    // tslint:disable-next-line: variable-name
    TimelineBase.prototype._onParentClick = function (resource) {
      resource.collapsed = !resource.collapsed;
      this._visibleResources = this._flattenResources(this.s.resources, [], 0);
      this._shouldCheckSize = true;
      this._isParentClick = true;
      this.forceUpdate();
    };
    TimelineBase.prototype._render = function (s, state) {
      _super.prototype._render.call(this, s, state);
      var prevS = this._prevS;
      var eventMap = this._eventMap;
      var resourceTops = this._resourceTops;
      var stepCell = this._stepCell / ONE_MIN;
      var startMinutes = floor(this._startTime / ONE_MIN) % stepCell;
      var endMinutes = (floor(this._endTime / ONE_MIN) % stepCell) + 1;
      this._startCellStyle =
        this._displayTime && startMinutes % stepCell !== 0
          ? {
              width: (state.cellWidth || 64) * (((stepCell - startMinutes) % stepCell) / stepCell) + 'px'
            }
          : UNDEFINED;
      this._endCellStyle =
        this._displayTime && endMinutes % stepCell !== 0
          ? {
              width: ((state.cellWidth || 64) * (endMinutes % stepCell)) / stepCell + 'px'
            }
          : UNDEFINED;
      if (s.connections !== prevS.connections || s.eventMap !== prevS.eventMap || s.theme !== prevS.theme || s.rtl !== prevS.rtl) {
        this._calcConnections = true;
      }
      if (this._hasSlots) {
        this._connections = UNDEFINED;
      }
      if (this._calcConnections && !this._hasSlots && !this._shouldCheckSize && resourceTops) {
        var connections = [];
        var eventHeight = this._eventHeight;
        var gridWidth = this._gridWidth;
        var gridHeight = state.hasScrollY ? this._gridHeight : state.scrollContHeight - state.headerHeight;
        var constLineH = 1500 / gridWidth; // 15 px converted to percent - horizontal
        var isRtl = s.rtl === true;
        var rtl = isRtl ? -1 : 1;
        var arrowH = (750 / gridWidth) * rtl;
        var arrowV = (400 / gridHeight) * rtl;
        var eventHeightInPercent = (100 * eventHeight) / gridHeight;
        for (var _i = 0, _a = s.connections || []; _i < _a.length; _i++) {
          var connection = _a[_i];
          var fromEvent = eventMap[connection.from];
          var toEvent = eventMap[connection.to];
          var arrow = connection.arrow;
          var color = connection.color;
          var cssClass = connection.cssClass || '';
          var id = connection.from + '__' + connection.to;
          if (fromEvent && toEvent) {
            var fromPos = fromEvent.position;
            var toPos = toEvent.position;
            var hasFromPos = fromPos.width !== UNDEFINED;
            var hasToPos = toPos.width !== UNDEFINED;
            var fromResource = fromEvent.resource;
            var toResource = toEvent.resource;
            // one of the to/from positions should be calculated (present on the view)
            if ((hasFromPos || hasToPos) && resourceTops[fromResource] >= 0 && resourceTops[toResource] >= 0) {
              var fromEnd = fromEvent.endDate;
              var toStart = toEvent.startDate;
              var isToBefore = toStart < fromEnd;
              var startDate = isToBefore ? toStart : fromEnd;
              var endDate = isToBefore ? fromEnd : toStart;
              var fromTop = fromPos.top || 0;
              var toTop = toPos.top || 0;
              var positionProp = isRtl ? 'right' : 'left';
              var fromLeft = hasFromPos ? +fromPos[positionProp].replace('%', '') : isToBefore ? 100 : 0;
              var toLeft = hasToPos ? +toPos[positionProp].replace('%', '') : isToBefore ? 0 : 100;
              var fromWidth = hasFromPos ? +fromPos.width.replace('%', '') : 0;
              var isSameResLine = fromEvent.resource === toEvent.resource && isToBefore && toTop === fromTop;
              var lineWidth = toLeft - fromLeft - fromWidth - 2 * constLineH;
              var resourceTopsDiff = resourceTops[toResource] - resourceTops[fromResource];
              var toUpperResource = resourceTopsDiff < 0 || (!resourceTopsDiff && toTop < fromTop) ? -1 : 1;
              var lineHeight =
                (100 *
                  (resourceTopsDiff -
                    fromTop * eventHeight + // - fromEvent top position
                    toTop * eventHeight + // + toEvent top position
                    (isSameResLine ? eventHeight : 0))) /
                gridHeight;
              var posX = (isRtl ? 100 - fromLeft : fromLeft) + fromWidth * rtl;
              var posY = (100 * (resourceTops[fromResource] + fromTop * eventHeight + 3 + eventHeight / 2)) / gridHeight;
              if (hasFromPos && (arrow === 'from' || arrow === 'bidirectional')) {
                connections.push({
                  color: color,
                  cssClass: 'mbsc-connection-arrow ' + cssClass,
                  endDate: endDate,
                  fill: color,
                  id: id + '__start',
                  pathD:
                    'M ' +
                    posX +
                    ', ' +
                    posY +
                    ' L ' +
                    (posX + arrowH) +
                    ' ' +
                    (posY - arrowV) +
                    ' L ' +
                    (posX + arrowH) +
                    ' ' +
                    (posY + arrowV) +
                    ' Z',
                  startDate: startDate
                });
              }
              // set the starting position
              var pathD = 'M ' + posX + ', ' + posY;
              // adding the starting line
              posX += constLineH * rtl;
              // adding vertical line if there is one
              if (lineHeight) {
                pathD += ' H ' + posX;
                posY += lineHeight - (lineWidth < 0 ? eventHeightInPercent / 2 : 0) * toUpperResource;
                pathD += ' V ' + posY;
              }
              // adding the horizontal line that connects the two events.
              posX += lineWidth * rtl;
              if (lineHeight) {
                pathD += ' H ' + posX;
              }
              // in case of the toEvents took place before the fromEvent add the second vertical section
              if (lineHeight && lineWidth < 0) {
                posY += (eventHeightInPercent / 2) * toUpperResource * (isSameResLine ? -1 : 1);
                pathD += ' V ' + posY;
              }
              // adding the ending line
              posX += constLineH * rtl;
              pathD += ' H ' + posX;
              connections.push({ color: color, cssClass: cssClass, id: id, pathD: pathD, startDate: startDate, endDate: endDate });
              if (hasToPos && (arrow === 'to' || arrow === 'bidirectional' || arrow === true)) {
                connections.push({
                  color: color,
                  cssClass: 'mbsc-connection-arrow ' + cssClass,
                  endDate: endDate,
                  fill: color,
                  id: id + '__end',
                  pathD:
                    'M ' +
                    posX +
                    ', ' +
                    posY +
                    ' L ' +
                    (posX - arrowH) +
                    ' ' +
                    (posY - arrowV) +
                    ' L ' +
                    (posX - arrowH) +
                    ' ' +
                    (posY + arrowV) +
                    ' Z',
                  startDate: startDate
                });
              }
            }
          }
        }
        this._connections = connections;
        this._calcConnections = false;
      }
    };
    return TimelineBase;
  })(STBase);

  var Timeline = /*#__PURE__*/ (function (_super) {
    __extends(Timeline, _super);
    function Timeline() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      // tslint:disable-next-line: variable-name
      _this._setStickyHeader = function (el) {
        _this._stickyHeader = el;
      };
      // tslint:disable-next-line: variable-name
      _this._setStickyDay = function (el) {
        _this._stickyDate = el;
      };
      // tslint:disable-next-line: variable-name
      _this._setStickyMonth = function (el) {
        _this._stickyMonth = el;
      };
      // tslint:disable-next-line: variable-name
      _this._setStickyWeek = function (el) {
        _this._stickyWeek = el;
      };
      // tslint:disable-next-line: variable-name
      _this._setCont = function (el) {
        _this._scrollCont = el;
      };
      // tslint:disable-next-line: variable-name
      _this._setResCont = function (el) {
        _this._resCont = el;
      };
      // tslint:disable-next-line: variable-name
      _this._setGridCont = function (el) {
        _this._gridCont = el;
      };
      // tslint:disable-next-line: variable-name
      _this._setHeaderCont = function (el) {
        _this._headerCont = el;
      };
      // tslint:disable-next-line: variable-name
      _this._setCursorTimeCont = function (el) {
        _this._cursorTimeCont = el;
      };
      return _this;
    }
    Timeline.prototype._template = function (s, state) {
      var _this = this;
      var dragData = state.dragData;
      var draggedEventId = dragData && dragData.draggedEvent && dragData.draggedEvent.id;
      var hasSlots = this._hasSlots;
      var hb = this._hb;
      var rtl = this._rtl;
      var times = this._times;
      var theme = this._theme;
      var startTime = this._startTime;
      var endTime = this._endTime;
      var stepLabel = this._stepLabel;
      var slots = this._slots;
      var source = 'timeline';
      var resources = s.resources;
      var isListing = s.eventList;
      var isMonthView = s.type === 'month';
      var isHourly = this._stepCell < ONE_DAY;
      var startCellStyle = this._startCellStyle;
      var endCellStyle = this._endCellStyle;
      var headerClass = this._headerClass;
      var daysBatch = this._daysBatch;
      var renderSlot = function (args) {
        var slot = args.slot;
        var content = slot.name;
        var html;
        if (s.renderSlot) {
          content = s.renderSlot(args);
          if (isString(content)) {
            html = _this._safeHtml(content);
            _this._shouldEnhance = true;
          }
        }
        // eslint-disable-next-line react/no-danger-with-children
        return createElement('div', { key: slot.id, className: 'mbsc-timeline-slot-title', dangerouslySetInnerHTML: html }, content);
      };
      var renderResourceHeader = function () {
        var content;
        var html;
        if (s.renderResourceHeader) {
          content = s.renderResourceHeader();
          if (isString(content)) {
            html = _this._safeHtml(content);
            _this._shouldEnhance = true;
          }
        }
        return createElement('div', { className: 'mbsc-timeline-resource-header', dangerouslySetInnerHTML: html }, content);
      };
      var renderResource = function (resource) {
        var isParent = resource.isParent;
        var padding = _this._hasHierarchy ? resource.depth * 1.75 + 'em' : UNDEFINED;
        var style = {
          minHeight: _this._setRowHeight ? _this._eventRows[resource.id] * _this._eventHeight + 16 : UNDEFINED,
          paddingLeft: s.rtl ? UNDEFINED : padding,
          paddingRight: s.rtl ? padding : UNDEFINED
        };
        var content = resource.name;
        var html;
        if (s.renderResource) {
          content = s.renderResource(resource);
          if (isString(content)) {
            html = _this._safeHtml(content);
            _this._shouldEnhance = true;
          }
        }
        return createElement(
          'div',
          {
            key: resource.id,
            className: 'mbsc-timeline-resource' + theme + rtl + hb + (isParent ? ' mbsc-timeline-parent mbsc-flex' : ''),
            style: style
          },
          isParent &&
            createElement(Icon, {
              className: 'mbsc-timeline-resource-icon' + rtl + hb,
              svg: resource.collapsed ? (s.rtl ? s.nextIconRtl : s.nextIcon) : s.downIcon,
              theme: s.theme,
              // tslint:disable jsx-no-lambda
              onClick: function () {
                return _this._onParentClick(resource);
              }
            }),
          createElement(
            'div',
            { className: 'mbsc-timeline-resource-title' + (isParent ? ' mbsc-flex-1-1' : ''), dangerouslySetInnerHTML: html },
            content
          )
        );
      };
      var renderData = function (data, key, resource, renderFunc, checkDrag) {
        var rangeData = data[resource][DEF_ID].all;
        var dataForBatch = [];
        for (var _i = 0, _a = rangeData[key]; _i < _a.length; _i++) {
          var item = _a[_i];
          if (
            (checkDrag && draggedEventId === item.id) ||
            checkDateRangeOverlap(_this._batchStart, _this._batchEnd, item.startDate, item.endDate, true)
          ) {
            dataForBatch.push(item);
          }
        }
        return renderFunc(dataForBatch, 'all', resource, DEF_ID);
      };
      var renderColors = function (colors) {
        return colors.map(function (color, i) {
          return createElement(
            'div',
            { key: i, className: 'mbsc-schedule-color mbsc-timeline-color' + color.cssClass + theme, style: color.position },
            createElement('div', { className: 'mbsc-schedule-color-text' }, color.title)
          );
        });
      };
      var renderInvalids = function (invalids) {
        return invalids.map(function (invalid, i) {
          return (
            invalid.position &&
            createElement(
              'div',
              { key: i, className: 'mbsc-schedule-invalid mbsc-timeline-invalid' + invalid.cssClass + theme, style: invalid.position },
              createElement('div', { className: 'mbsc-schedule-invalid-text' }, invalid.title)
            )
          );
        });
      };
      var renderEvents = function (events, dateKey, resource, slot) {
        var dragKey = resource + '__' + slot + '__' + dateKey;
        var eventProps = {
          displayTimezone: s.displayTimezone,
          drag: s.dragToMove,
          endDay: s.endDay,
          eventHeight: _this._setRowHeight ? _this._eventHeight : UNDEFINED,
          exclusiveEndDates: s.exclusiveEndDates,
          gridEndTime: endTime,
          gridStartTime: startTime,
          isListing: isListing,
          isTimeline: true,
          lastDay: +_this._lastDay,
          render: s.renderEvent,
          renderContent: s.renderEventContent,
          resize: s.dragToResize,
          resource: resource,
          rtl: s.rtl,
          slot: slot,
          startDay: s.startDay,
          theme: s.theme,
          timezonePlugin: s.timezonePlugin
        };
        return createElement(
          Fragment,
          null,
          events.map(function (event) {
            return createElement(
              ScheduleEvent,
              __assign({}, eventProps, {
                event: event,
                inactive: draggedEventId === event.id,
                key: event.uid,
                selected: s.selectedEventsMap[event.uid] || s.selectedEventsMap[event.id],
                onClick: s.onEventClick,
                onDoubleClick: s.onEventDoubleClick,
                onRightClick: s.onEventRightClick,
                onHoverIn: s.onEventHoverIn,
                onHoverOut: s.onEventHoverOut,
                onDelete: s.onEventDelete,
                onDragStart: _this._onEventDragStart,
                onDragMove: _this._onEventDragMove,
                onDragEnd: _this._onEventDragEnd,
                onDragModeOn: _this._onEventDragModeOn,
                onDragModeOff: _this._onEventDragModeOff
              })
            );
          }),
          dragData &&
            dragData.originDates &&
            dragData.originDates[dragKey] &&
            createElement(
              ScheduleEvent,
              __assign({}, eventProps, {
                event: dragData.originDates[dragKey],
                hidden: dragData && !!dragData.draggedDates,
                isDrag: true,
                onDragStart: _this._onEventDragStart,
                onDragMove: _this._onEventDragMove,
                onDragEnd: _this._onEventDragEnd,
                onDragModeOff: _this._onEventDragModeOff
              })
            ),
          dragData &&
            dragData.draggedDates &&
            dragData.draggedDates[dragKey] &&
            createElement(ScheduleEvent, __assign({}, eventProps, { event: dragData.draggedDates[dragKey], isDrag: true }))
        );
      };
      var renderRow = function (res) {
        var resource = res.id;
        return createElement(
          'div',
          {
            key: resource,
            className: 'mbsc-flex mbsc-timeline-row' + theme + hb + (res.isParent ? ' mbsc-timeline-parent' : ''),
            style: { minHeight: _this._setRowHeight ? _this._eventRows[resource] * _this._eventHeight + 16 : UNDEFINED }
          },
          !hasSlots &&
            createElement(
              Fragment,
              null,
              createElement(
                'div',
                { className: 'mbsc-timeline-events' },
                renderData(_this._events, 'events', resource, renderEvents, true)
              ),
              renderData(_this._invalids, 'invalids', resource, renderInvalids),
              renderData(_this._colors, 'colors', resource, renderColors)
            ),
          createElement('div', { style: { width: _this._placeholderSizeX }, className: 'mbsc-flex-none' }),
          daysBatch.map(function (dayData) {
            var timestamp = dayData.timestamp;
            var dateKey = dayData.dateKey;
            return createElement(
              'div',
              {
                key: timestamp,
                className:
                  'mbsc-timeline-day mbsc-flex' +
                  theme +
                  rtl +
                  hb +
                  ((dayData.dateIndex < _this._daysNr - 1 && isHourly) || dayData.lastOfMonth ? ' mbsc-timeline-day-border' : '') +
                  (state.hasScrollX ? ' mbsc-flex-none' : ' mbsc-flex-1-0-0') +
                  (isMonthView || _this._isMulti ? ' mbsc-timeline-day-month' : '')
              },
              slots.map(function (sl) {
                var slot = sl.id;
                var dayEvents = _this._events[resource][slot][dateKey];
                var dayColors = _this._colors[resource][slot][dateKey];
                var dayInvalids = _this._invalids[resource][slot][dateKey];
                return createElement(
                  'div',
                  { key: slot, className: 'mbsc-flex mbsc-flex-1-1' + (hasSlots ? ' mbsc-timeline-slot' : '') },
                  hasSlots &&
                    createElement(
                      Fragment,
                      null,
                      createElement(
                        'div',
                        { className: 'mbsc-timeline-events' },
                        renderEvents(dayEvents ? dayEvents.events : [], dateKey, resource, slot)
                      ),
                      dayInvalids && renderInvalids(dayInvalids.invalids),
                      dayColors && renderColors(dayColors.colors)
                    ),
                  times.map(function (v, k) {
                    var date = getCellDate(timestamp, v);
                    var first = !k;
                    var last = k === times.length - 1;
                    return createElement('div', {
                      key: k,
                      className:
                        'mbsc-timeline-column mbsc-flex-1-1' +
                        theme +
                        rtl +
                        hb +
                        ((first && startCellStyle) || (last && endCellStyle) ? ' mbsc-flex-none' : ''),
                      // tslint:disable jsx-no-lambda
                      onClick: function (domEvent) {
                        return s.onCellClick({ date: date, domEvent: domEvent, resource: resource, slot: slot, source: source });
                      },
                      onDoubleClick: function (domEvent) {
                        return s.onCellDoubleClick({ date: date, domEvent: domEvent, resource: resource, slot: slot, source: source });
                      },
                      onContextMenu: function (domEvent) {
                        return s.onCellRightClick({ date: date, domEvent: domEvent, resource: resource, slot: slot, source: source });
                      },
                      // tslint:enable jsx-no-lambda
                      style: first && !last ? startCellStyle : last && !first ? endCellStyle : UNDEFINED
                    });
                  })
                );
              })
            );
          })
        );
      };
      return createElement(
        'div',
        {
          ref: this._setEl,
          className:
            'mbsc-timeline mbsc-flex-1-1 mbsc-flex-col' +
            (state.cellWidth ? '' : ' mbsc-hidden') +
            (this._hasSticky ? ' mbsc-has-sticky' : '') +
            (resources ? '' : ' mbsc-timeline-no-resource') +
            theme +
            rtl
        },
        createElement(
          'div',
          { ref: this._setStickyHeader, className: 'mbsc-timeline-header-sticky mbsc-flex' },
          resources &&
            createElement(
              'div',
              { className: 'mbsc-timeline-resource-empty mbsc-timeline-resource-col' + headerClass + theme + rtl + hb },
              renderResourceHeader()
            ),
          createElement(
            'div',
            { className: 'mbsc-flex-1-1' },
            this._isMulti &&
              createElement(
                'div',
                { className: 'mbsc-timeline-header-month' + theme + rtl + hb },
                createElement('div', {
                  ref: this._setStickyMonth,
                  className: 'mbsc-timeline-header-text mbsc-timeline-header-month-text' + theme
                })
              ),
            s.weekNumbers &&
              createElement(
                'div',
                { className: 'mbsc-timeline-header-week' + theme + rtl + hb },
                createElement('div', {
                  ref: this._setStickyWeek,
                  className: 'mbsc-timeline-header-text mbsc-timeline-header-week-text' + theme
                })
              ),
            (hasSlots || isHourly) &&
              createElement(
                'div',
                { className: 'mbsc-timeline-header-date' + theme + rtl + hb },
                createElement('div', {
                  ref: this._setStickyDay,
                  className: 'mbsc-timeline-header-text mbsc-timeline-header-date-text' + theme
                })
              )
          ),
          state.hasScrollY && createElement('div', { className: 'mbsc-schedule-fake-scroll-y' })
        ),
        createElement(
          'div',
          {
            ref: this._setCont,
            className: 'mbsc-timeline-grid-scroll mbsc-flex-col mbsc-flex-1-1' + theme + rtl + hb,
            onScroll: this._onScroll
          },
          createElement('div', { className: 'mbsc-flex-none' + (this._hasSticky ? '' : headerClass) }),
          createElement(
            'div',
            { className: 'mbsc-timeline-header mbsc-flex' + theme + rtl + hb, ref: this._setHeaderCont },
            resources &&
              createElement('div', {
                className: 'mbsc-timeline-resource-empty mbsc-timeline-resource-col' + headerClass + theme + rtl + hb
              }),
            createElement(
              'div',
              { className: 'mbsc-timeline-header-bg mbsc-flex-1-0 mbsc-flex' + theme },
              createElement(
                'div',
                {
                  className: 'mbsc-timeline-time-indicator-cont',
                  style: {
                    height: (state.scrollContHeight || 0) - (state.headerHeight || 0),
                    width: state.hasScrollX ? this._gridWidth : UNDEFINED
                  }
                },
                this._showTimeIndicator &&
                  createElement(TimeIndicator, {
                    amText: s.amText,
                    displayedTime: this._time,
                    displayedDays: this._daysNr,
                    displayTimezone: s.displayTimezone,
                    endDay: s.endDay,
                    firstDay: this._firstDayTz,
                    orientation: 'y',
                    pmText: s.pmText,
                    rtl: s.rtl,
                    startDay: s.startDay,
                    startTime: startTime,
                    theme: s.theme,
                    timeFormat: s.timeFormat,
                    timezonePlugin: s.timezonePlugin
                  }),
                this._showCursorTime &&
                  createElement('div', {
                    ref: this._setCursorTimeCont,
                    className: 'mbsc-schedule-cursor-time mbsc-schedule-cursor-time-y' + theme
                  })
              ),
              createElement('div', { className: 'mbsc-flex-none', style: { width: this._placeholderSizeX } }),
              createElement(
                'div',
                { className: state.hasScrollX ? 'mbsc-flex-none' : 'mbsc-flex-1-1' },
                this._isMulti &&
                  createElement(
                    'div',
                    { className: 'mbsc-flex' },
                    daysBatch.map(function (d) {
                      var last = d.lastOfMonth;
                      return createElement(
                        'div',
                        {
                          key: d.timestamp,
                          className:
                            'mbsc-timeline-month mbsc-flex-1-0-0' +
                            theme +
                            rtl +
                            hb +
                            (last ? ' mbsc-timeline-day mbsc-timeline-day-border' : '')
                        },
                        createElement(
                          'div',
                          { className: 'mbsc-timeline-header-month' + theme + rtl + hb + (last ? ' mbsc-timeline-header-month-last' : '') },
                          createElement(
                            'div',
                            { className: 'mbsc-timeline-header-month-text' + (last ? ' mbsc-timeline-header-month-text-last' : '') },
                            d.monthTitle
                          )
                        )
                      );
                    })
                  ),
                s.weekNumbers &&
                  createElement(
                    'div',
                    { className: 'mbsc-flex' },
                    daysBatch.map(function (d) {
                      var last = d.lastOfWeek;
                      return createElement(
                        'div',
                        {
                          key: d.timestamp,
                          className:
                            'mbsc-timeline-month mbsc-flex-1-0-0' +
                            theme +
                            rtl +
                            hb +
                            (last && (isHourly || d.lastOfMonth) ? ' mbsc-timeline-day mbsc-timeline-day-border' : '')
                        },
                        createElement(
                          'div',
                          { className: 'mbsc-timeline-header-week' + theme + rtl + hb + (last ? ' mbsc-timeline-header-week-last' : '') },
                          createElement(
                            'div',
                            { className: 'mbsc-timeline-header-week-text' + (last ? ' mbsc-timeline-header-week-text-last' : '') },
                            d.weekTitle
                          )
                        )
                      );
                    })
                  ),
                createElement(
                  'div',
                  { className: 'mbsc-flex' },
                  daysBatch.map(function (d) {
                    return createElement(
                      'div',
                      {
                        key: d.timestamp,
                        className:
                          'mbsc-timeline-day mbsc-flex-1-0-0' +
                          theme +
                          rtl +
                          hb +
                          ((d.dateIndex < _this._daysNr - 1 && isHourly) || d.lastOfMonth ? ' mbsc-timeline-day-border' : '') +
                          (isMonthView || _this._isMulti ? ' mbsc-timeline-day-month' : '')
                      },
                      createElement(
                        'div',
                        { className: 'mbsc-timeline-header-date' + theme + rtl + hb },
                        createElement('div', { 'aria-hidden': 'true', className: 'mbsc-timeline-header-date-text' }, d.dateText),
                        d.label && createElement('div', { className: 'mbsc-hidden-content' }, d.label)
                      ),
                      hasSlots &&
                        createElement(
                          'div',
                          { className: 'mbsc-flex mbsc-timeline-slots' + theme },
                          slots.map(function (slot) {
                            return createElement(
                              'div',
                              { key: slot.id, className: 'mbsc-timeline-slot mbsc-timeline-slot-header' + rtl + theme },
                              slot.name && renderSlot({ slot: slot, date: d.date })
                            );
                          })
                        ),
                      createElement(
                        'div',
                        { 'aria-hidden': 'true', className: 'mbsc-flex' },
                        times.map(function (t, j) {
                          var first = !j;
                          var last = j === times.length - 1;
                          return createElement(
                            'div',
                            {
                              key: j,
                              style: first && !last ? startCellStyle : last && !first ? endCellStyle : UNDEFINED,
                              className:
                                'mbsc-flex mbsc-flex-1-1 mbsc-timeline-header-column' +
                                theme +
                                rtl +
                                hb +
                                (!_this._displayTime || hasSlots ? ' mbsc-timeline-no-height' : '') +
                                (stepLabel > _this._stepCell && times[j + 1] % stepLabel ? ' mbsc-timeline-no-border' : '') +
                                ((first && startCellStyle) || (last && endCellStyle) ? ' mbsc-flex-none' : '')
                            },
                            createElement(
                              'div',
                              { className: 'mbsc-timeline-header-time mbsc-flex-1-1 ' + theme },
                              _this._displayTime ? _this._timeLabels[t] : ''
                            ),
                            _this._timesBetween.map(function (tb, k) {
                              var ms = t + (k + 1) * stepLabel;
                              return (
                                ms > startTime &&
                                ms < endTime &&
                                createElement(
                                  'div',
                                  { key: k, className: 'mbsc-timeline-header-time mbsc-flex-1-1 ' + theme },
                                  _this._timeLabels[ms]
                                )
                              );
                            })
                          );
                        })
                      )
                    );
                  })
                )
              )
            )
          ),
          createElement(
            'div',
            { className: 'mbsc-flex mbsc-flex-1-1' },
            createElement(
              'div',
              { className: 'mbsc-flex mbsc-flex-1-1' },
              resources &&
                createElement(
                  'div',
                  { className: 'mbsc-timeline-resources mbsc-timeline-resource-col mbsc-flex-col' + theme + rtl, ref: this._setResCont },
                  createElement('div', { className: 'mbsc-flex-none' + (this._hasSideSticky ? '' : headerClass) }),
                  createElement(
                    'div',
                    {
                      className:
                        'mbsc-timeline-resource-bg mbsc-flex-1-1' + (this._hasHierarchy || state.hasScrollY ? '' : ' mbsc-flex-col') + theme
                    },
                    createElement('div', { style: { height: this._placeholderSizeY }, className: 'mbsc-flex-none' }),
                    this._resourcesBatch.map(renderResource)
                  )
                ),
              resources && createElement('div', { className: this._hasSideSticky ? '' : 'mbsc-timeline-resource-col' }),
              createElement(
                'div',
                {
                  className: 'mbsc-timeline-grid mbsc-flex-1-0' + (this._hasHierarchy || state.hasScrollY ? '' : ' mbsc-flex-col'),
                  ref: this._setGridCont,
                  style: { height: state.hasScrollY ? this._gridHeight : UNDEFINED, width: state.hasScrollX ? this._gridWidth : UNDEFINED },
                  onMouseLeave: this._onMouseLeave,
                  onMouseMove: this._onMouseMove,
                  onTouchStart: this._onTouchStart
                },
                createElement('div', { style: { height: this._placeholderSizeY }, className: 'mbsc-flex-none' }),
                this._resourcesBatch.map(renderRow),
                this._connections &&
                  createElement(
                    'svg',
                    { className: 'mbsc-connections' + theme, viewBox: '0 0 100 100', preserveAspectRatio: 'none' },
                    this._connections.map(function (c) {
                      var _a;
                      var props =
                        ((_a = {
                          className: 'mbsc-connection ' + c.cssClass + theme,
                          d: c.pathD,
                          style: { stroke: c.color, fill: c.fill }
                        }),
                        (_a['vectorEffect'] = 'non-scaling-stroke'),
                        _a);
                      return (
                        checkDateRangeOverlap(_this._batchStart, _this._batchEnd, c.startDate, c.endDate, true) &&
                        createElement('path', __assign({ key: c.id }, props))
                      );
                    })
                  )
              )
            )
          )
        ),
        dragData && !state.isTouchDrag && createElement('div', { className: 'mbsc-calendar-dragging' })
      );
    };
    return Timeline;
  })(TimelineBase);

  /**
   * The Eventcalendar component.
   *
   * Usage:
   *
   * ```
   * <Eventcalendar />
   * ```
   */
  var Eventcalendar = /*#__PURE__*/ (function (_super) {
    __extends(Eventcalendar, _super);
    function Eventcalendar() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      // tslint:disable variable-name
      _this._instanceService = new InstanceServiceBase();
      _this._setList = function (el) {
        _this._list = el;
      };
      _this._setPopoverList = function (list) {
        _this._popoverList = list && list._el;
      };
      // tslint:disable-next-line: variable-name
      _this._setEl = function (el) {
        _this._el = el ? el._el || el : null;
        _this._calendarView = el;
        // this._instanceService.instance = this;
      };
      return _this;
    }
    // tslint:enable variable-name
    Eventcalendar.prototype._eventRenderer = function (data, key, date, s, isPopup) {
      var _this = this;
      var showColor = !this._colorEventList;
      var source = isPopup ? 'popover' : 'agenda';
      var isVisible = !isPopup || this.state.showPopover;
      var theme = this._theme;
      var eventHTML;
      var eventContent = s.renderEventContent
        ? s.renderEventContent(data)
        : createElement('div', { className: 'mbsc-event-text ' + theme, title: data.tooltip, dangerouslySetInnerHTML: data.html });
      // The extra wrapper div is needed for being consistent with other frameworks.
      // We need it in the case of jQuery and JavaScript because we need an element (div) to set the inner html to.
      // At this point the Fragment component does not support the dangerouslySetInnerHTML prop.
      if (isString(eventContent)) {
        var eventContentHTML = { __html: eventContent };
        eventContent = createElement('div', { className: 'mbsc-event-content' + theme, dangerouslySetInnerHTML: eventContentHTML });
        this._shouldEnhance = isVisible && source;
      } else {
        eventContent = createElement('div', { className: 'mbsc-event-content' + theme }, eventContent);
      }
      var eventInner = s.renderEvent
        ? s.renderEvent(data)
        : createElement(
            Fragment,
            null,
            createElement('div', { className: 'mbsc-event-color' + theme + this._rtl, style: data.style }),
            eventContent,
            createElement(
              'div',
              { className: 'mbsc-event-time' + theme + this._rtl },
              data.allDayText && createElement('div', { className: 'mbsc-event-all-day' + theme }, data.allDayText),
              data.lastDay && createElement('div', { className: 'mbsc-event-until' + theme }, data.lastDay),
              data.start && createElement('div', { className: 'mbsc-event-start' + theme }, data.start),
              data.start && data.end && createElement('div', { className: 'mbsc-event-sep' + theme }, '-'),
              data.end && createElement('div', { className: 'mbsc-event-end' + theme }, data.end)
            )
          );
      // In case of custom event listing, the renderer function might return string (for jQuery and plain JS)
      // In this case we will set the string as innerHTML of the list container
      if (isString(eventInner)) {
        eventHTML = { __html: eventInner };
        eventInner = UNDEFINED;
        this._shouldEnhance = isVisible && source;
      }
      return createElement(
        ListItem,
        {
          className: 'mbsc-event' + (showColor ? '' : ' mbsc-colored-event'),
          'data-id': data.original.id,
          key: key,
          actionable: s.actionableEvents,
          dangerouslySetInnerHTML: eventHTML,
          data: data.original,
          drag: isPopup && this._showEventLabels && s.dragToMove,
          rtl: s.rtl,
          selected: this._selectedEventsMap[data.uid] || this._selectedEventsMap[data.id],
          style: showColor ? UNDEFINED : data.style,
          theme: s.theme,
          themeVariant: s.themeVariant,
          // tslint:disable jsx-no-lambda
          onClick: function (ev) {
            return _this._onEventClick({ date: date, domEvent: ev.domEvent, event: data.original, source: source });
          },
          onDoubleClick: function (domEvent) {
            return _this._onEventDoubleClick({ date: date, domEvent: domEvent, event: data.original, source: source });
          },
          onContextMenu: function (domEvent) {
            return _this._onEventRightClick({ date: date, domEvent: domEvent, event: data.original, source: source });
          },
          onHoverIn: function (_a) {
            var domEvent = _a.domEvent;
            return _this._onEventHoverIn({ date: date, domEvent: domEvent, event: data.original, source: source });
          },
          onHoverOut: function (_a) {
            var domEvent = _a.domEvent;
            return _this._onEventHoverOut({ date: date, domEvent: domEvent, event: data.original, source: source });
          },
          // tslint:enable jsx-no-lambda
          onDelete: this._onEventDelete,
          onDragEnd: this._onLabelUpdateEnd,
          onDragModeOff: this._onLabelUpdateModeOff,
          onDragModeOn: this._onLabelUpdateModeOn,
          onDragMove: this._onLabelUpdateMove,
          onDragStart: this._onLabelUpdateStart
        },
        eventInner
      );
    };
    Eventcalendar.prototype._listRenderer = function () {
      var _this = this;
      var s = this.s;
      var theme = s.theme;
      var dayRefs = this._listDays;
      var events = this.state.eventList;
      if (s.renderAgenda) {
        if (this._eventListHTML === UNDEFINED) {
          return s.renderAgenda(events, s, dayRefs);
        }
      } else {
        return createElement(
          List,
          { theme: theme, themeVariant: s.themeVariant, rtl: s.rtl },
          !events.length && createElement('div', { className: 'mbsc-event-list-empty' + this._theme }, s.noEventsText),
          events.map(function (day, i) {
            return createElement(
              'div',
              {
                className: 'mbsc-event-group' + _this._theme,
                key: i,
                ref: function (el) {
                  return (dayRefs[day.timestamp] = el);
                }
              },
              (_this._eventListType !== 'day' || _this._eventListSize > 1) &&
                createElement(ListHeader, { theme: theme, themeVariant: s.themeVariant, className: 'mbsc-event-day' }, day.date),
              day.events.map(function (event, j) {
                return _this._eventRenderer(event, j, day.timestamp, s);
              })
            );
          })
        );
      }
    };
    Eventcalendar.prototype._template = function (s, state) {
      var _this = this;
      var eventList;
      if (!this._listDays) {
        this._listDays = {};
      }
      if (this._showEventList) {
        eventList = this._listRenderer();
        // In case of custom event listing, the renderer function might return string (for jQuery and plain JS)
        // In this case we will set the string as innerHTML of the list container
        if (isString(eventList)) {
          this._eventListHTML = { __html: eventList };
          // After the DOM is updated we should load the day wrapper based on the mbsc-timestamp attribute (if any)
          // It's needed for scrolling the list to the selected date
          this._shouldLoadDays = true;
          this._shouldEnhance = true;
          eventList = UNDEFINED;
        }
      }
      var commonProps = {
        amText: s.amText,
        clickToCreate: s.clickToCreate,
        dataTimezone: s.dataTimezone,
        dateFormat: s.dateFormat,
        dayNames: s.dayNames,
        dayNamesMin: s.dayNamesMin,
        dayNamesShort: s.dayNamesShort,
        displayTimezone: s.displayTimezone,
        dragToCreate: s.dragToCreate,
        dragToMove: s.dragToMove,
        dragToResize: s.dragToResize,
        eventOrder: s.eventOrder,
        exclusiveEndDates: s.exclusiveEndDates,
        firstDay: s.firstDay,
        fromText: s.fromText,
        getDate: s.getDate,
        getDay: s.getDay,
        getMonth: s.getMonth,
        getYear: s.getYear,
        monthNames: s.monthNames,
        monthNamesShort: s.monthNamesShort,
        pmText: s.pmText,
        refDate: this._refDate,
        rtl: s.rtl,
        selectedEventsMap: this._selectedEventsMap,
        showEventTooltip: s.showEventTooltip,
        theme: s.theme,
        themeVariant: s.themeVariant,
        timeFormat: s.timeFormat,
        timezonePlugin: s.timezonePlugin,
        toText: s.toText
      };
      var scheduleTimelineProps = __assign({}, commonProps, {
        allDayText: s.allDayText,
        colorsMap: this._colorsMap,
        dateFormatLong: s.dateFormatLong,
        dragTimeStep: s.dragTimeStep,
        eventDragEnd: this._onEventDragStop,
        eventMap: this._eventMap,
        extendDefaultEvent: s.extendDefaultEvent,
        externalDrop: s.externalDrop,
        groupBy: s.groupBy,
        height: state.height,
        invalidateEvent: s.invalidateEvent,
        invalidsMap: this._invalidsMap,
        maxDate: this._maxDate,
        minDate: this._minDate,
        navigateToEvent: this._navigateToEvent,
        navigationService: this._navService,
        newEventText: s.newEventText,
        onCellClick: this._onCellClick,
        onCellDoubleClick: this._onCellDoubleClick,
        onCellRightClick: this._onCellRightClick,
        onEventClick: this._onEventClick,
        onEventDelete: this._onEventDelete,
        onEventDoubleClick: this._onEventDoubleClick,
        onEventDragEnd: this._onEventDragEnd,
        onEventDragStart: this._onEventDragStart,
        onEventHoverIn: this._onEventHoverIn,
        onEventHoverOut: this._onEventHoverOut,
        onEventRightClick: this._onEventRightClick,
        renderEvent: s.renderScheduleEvent,
        renderEventContent: s.renderScheduleEventContent,
        renderResource: s.renderResource,
        resources: s.resources,
        scroll: this._shouldScrollSchedule,
        selected: this._selectedDateTime,
        width: state.width
      });
      return createElement(
        CalendarView,
        __assign({ ref: this._setEl }, commonProps, {
          activeDate: this._active,
          calendarScroll: this._calendarScroll,
          calendarType: this._calendarType,
          colors: s.colors,
          context: s.context,
          cssClass: this._cssClass,
          downIcon: s.downIcon,
          dragData: state.labelDragData,
          endDay: this._rangeEndDay,
          eventRange: this._rangeType,
          eventRangeSize: this._showSchedule ? this._scheduleSize : this._showTimeline ? this._timelineSize : this._eventListSize,
          hasContent: this._showEventList || this._showSchedule || this._showTimeline,
          hasPicker: true,
          height: s.height,
          invalid: s.invalid,
          instanceService: this._instanceService,
          labels: s.labels,
          labelList: this._calendarLabelList,
          labelsMap: this._labelsMap,
          marked: s.marked,
          marksMap: this._marksMap,
          max: s.max,
          min: s.min,
          mouseSwipe: (!s.dragToCreate && s.clickToCreate !== 'single') || (!this._showEventLabels && !this._showEventCount),
          mousewheel: s.mousewheel,
          navigationService: this._navService,
          nextIconH: s.nextIconH,
          nextIconV: s.nextIconV,
          nextPageText: s.nextPageText,
          noOuterChange: !this._showEventList,
          onActiveChange: this._onActiveChange,
          onCellHoverIn: this._onCellHoverIn,
          onCellHoverOut: this._onCellHoverOut,
          onDayClick: this._onDayClick,
          onDayDoubleClick: this._onDayDoubleClick,
          onDayRightClick: this._onDayRightClick,
          onGestureStart: this._onGestureStart,
          onLabelClick: this._onLabelClick,
          onLabelDoubleClick: this._onLabelDoubleClick,
          onLabelRightClick: this._onLabelRightClick,
          onLabelHoverIn: this._onLabelHoverIn,
          onLabelHoverOut: this._onLabelHoverOut,
          onLabelDelete: this._onEventDelete,
          onLabelUpdateStart: this._onLabelUpdateStart,
          onLabelUpdateMove: this._onLabelUpdateMove,
          onLabelUpdateEnd: this._onLabelUpdateEnd,
          onLabelUpdateModeOn: this._onLabelUpdateModeOn,
          onLabelUpdateModeOff: this._onLabelUpdateModeOff,
          onPageChange: this._onPageChange,
          onPageLoaded: this._onPageLoaded,
          onPageLoading: this._onPageLoading,
          onResize: this._onResize,
          pageLoad: this._pageLoad,
          prevIconH: s.prevIconH,
          prevIconV: s.prevIconV,
          prevPageText: s.prevPageText,
          resourcesMap: this._resourcesMap,
          responsiveStyle: true,
          renderHeader: s.renderHeader,
          renderDay: s.renderDay,
          renderDayContent: s.renderDayContent,
          renderLabel: s.renderLabel,
          renderLabelContent: s.renderLabelContent,
          selectedDates: this._selectedDates,
          selectView: MONTH_VIEW,
          showCalendar: this._showCalendar,
          showControls: s.showControls,
          showLabelCount: this._showEventCount,
          showOuterDays: this._showOuterDays,
          showSchedule: this._showSchedule || this._showTimeline,
          showToday: s.showToday,
          showWeekNumbers: this._showWeekNumbers,
          size: this._calendarSize,
          startDay: this._rangeStartDay,
          swipe: !state.isTouchDrag,
          upIcon: s.upIcon,
          valid: s.valid,
          weeks: this._calendarSize,
          width: s.width,
          // Calendar system
          getMaxDayOfMonth: s.getMaxDayOfMonth,
          getWeekNumber: s.getWeekNumber,
          // Localization
          eventText: s.eventText,
          eventsText: s.eventsText,
          fromText: s.fromText,
          moreEventsPluralText: s.moreEventsPluralText,
          moreEventsText: s.moreEventsText,
          todayText: s.todayText,
          toText: s.toText,
          weekText: s.weekText,
          yearSuffix: s.yearSuffix
        }),
        this._showDate &&
          createElement(
            'div',
            { className: 'mbsc-schedule-date-header mbsc-flex' + this._theme + this._hb },
            this._showSchedule && !this._showCalendar && s.resources && createElement('div', { className: 'mbsc-schedule-time-col' }),
            createElement('div', { className: 'mbsc-schedule-date-header-text mbsc-flex-1-1' + this._theme }, this._selectedDateHeader),
            this._showSchedule && !this._showCalendar && s.resources && createElement('div', { className: 'mbsc-schedule-fake-scroll-y' })
          ),
        this._showEventList &&
          createElement(
            'div',
            {
              className: 'mbsc-event-list' + (state.isListScrollable ? ' mbsc-event-list-scroll' : ''),
              dangerouslySetInnerHTML: this._eventListHTML,
              onScroll: this._onScroll,
              ref: this._setList
            },
            eventList
          ),
        this._showSchedule &&
          createElement(
            Scheduler,
            __assign({}, scheduleTimelineProps, {
              endDay: this._scheduleEndDay,
              endTime: this._scheduleEndTime,
              renderDay: s.renderDay,
              renderDayContent: s.renderDayContent,
              showAllDay: this._showScheduleAllDay,
              showDays: this._showScheduleDays,
              size: this._scheduleSize,
              startDay: this._scheduleStartDay,
              startTime: this._scheduleStartTime,
              timeCellStep: this._scheduleTimeCellStep,
              timeLabelStep: this._scheduleTimeLabelStep,
              timezones: this._scheduleTimezones,
              type: this._scheduleType,
              onWeekDayClick: this._onWeekDayClick
            })
          ),
        this._showTimeline &&
          createElement(
            Timeline,
            __assign({}, scheduleTimelineProps, {
              dragToCreate: s.slots ? false : s.dragToCreate,
              dragToResize: s.slots ? false : s.dragToResize,
              downIcon: s.chevronIconDown,
              connections: s.connections,
              endDay: this._timelineEndDay,
              endTime: this._timelineEndTime,
              eventList: this._timelineListing,
              getWeekNumber: s.getWeekNumber,
              nextIcon: s.nextIconH,
              nextIconRtl: s.prevIconH,
              renderResourceHeader: s.renderResourceHeader,
              renderSlot: s.renderSlot,
              rowHeight: this._timelineRowHeight,
              weekNumbers: this._showTimelineWeekNumbers,
              weekText: s.weekText,
              size: this._timelineSize,
              slots: s.slots,
              startDay: this._timelineStartDay,
              startTime: this._timelineStartTime,
              timeCellStep: this._timelineTimeCellStep,
              timeLabelStep: this._timelineTimeLabelStep,
              type: this._timelineType,
              virtualScroll: !this._print
            })
          ),
        createElement(
          Popup,
          {
            anchor: this._anchor,
            closeOnScroll: true,
            contentPadding: false,
            context: s.context,
            cssClass: 'mbsc-calendar-popup ' + this._popoverClass,
            display: 'anchored',
            isOpen: state.showPopover,
            locale: s.locale,
            maxHeight: '24em',
            onClose: this._onPopoverClose,
            rtl: s.rtl,
            scrollLock: false,
            showOverlay: false,
            theme: s.theme,
            themeVariant: s.themeVariant
          },
          state.popoverList &&
            createElement(
              List,
              { ref: this._setPopoverList, theme: s.theme, themeVariant: s.themeVariant, rtl: s.rtl, className: 'mbsc-popover-list' },
              state.popoverList.map(function (event, i) {
                return _this._eventRenderer(event, i, state.popoverDate, s, true);
              })
            )
        ),
        state.labelDragData &&
          state.labelDragData.draggedEvent &&
          !state.isTouchDrag &&
          createElement('div', { className: 'mbsc-calendar-dragging' })
      );
    };
    return Eventcalendar;
  })(EventcalendarBase);

  // tslint:disable no-non-null-assertion
  function getIonInput(el, cb, nr) {
    if (nr === void 0) {
      nr = 0;
    }
    // Give up after multiple tries, and return the ion-input element
    if (nr > 10) {
      delete el.__mbscTimer;
      cb(el);
    } else {
      clearTimeout(el.__mbscTimer);
      el.__mbscTimer = setTimeout(function () {
        // IonInput might not be fully read yet, so if getInputElement is not yet there, try once again
        if (el.getInputElement) {
          el.getInputElement().then(function (inp) {
            // In Safari the input element is sometimes not set on the first call, so try once again
            if (inp) {
              delete el.__mbscTimer;
              cb(inp);
            } else {
              getIonInput(el, cb, nr + 1);
            }
          });
        } else {
          getIonInput(el, cb, nr + 1);
        }
      }, 10);
    }
  }
  function isIonInput(el) {
    return el.getInputElement || (el.tagName && el.tagName.toLowerCase() === 'ion-input');
  }
  function getNativeElement(input, callback) {
    if (input) {
      if (isIonInput(input)) {
        getIonInput(input, callback);
      } else if (input.vInput) {
        // if it's Mobiscroll Input (Angular)
        callback(input.vInput.nativeElement);
      } else if (input._el) {
        // if it's Mobiscroll Input (React)
        callback(input._el);
      } else if (input.nodeType === 1) {
        // The element must be a HTMLElement
        callback(input);
      } else if (isString(input)) {
        // It's a query string
        var inputElement = doc.querySelector(input);
        if (inputElement) {
          callback(inputElement);
        }
      }
    }
  }
  function initPickerElement(el, inst, handleChange, handleClick) {
    // The element must be a HTMLElement, but might be something else,
    // if a custom component was passed through the component option
    if (!el || el.nodeType !== 1) {
      return noop;
    }
    var setReadOnly = function () {
      if ((inst.s.showOnClick || inst.s.showOnFocus) && isInput && !inst._allowTyping) {
        // Set input to readonly
        input.readOnly = true;
      }
    };
    var onClick = function (ev) {
      var s = inst.s;
      if (handleClick) {
        handleClick(ev);
      }
      if (s.showOnClick && !s.disabled) {
        inst._focusElm = el;
        inst._anchor = s.anchor || el;
        inst.open();
      }
    };
    var onMouseDown = function (ev) {
      if (inst.s.showOnClick) {
        if (inst.s.showOnFocus) {
          // Delay showing on click instead of focus, otherwise the document click will not close any previous popup
          inst._preventShow = true;
        }
        if (!inst._allowTyping) {
          // Prevent input focus
          ev.preventDefault();
        }
      }
    };
    var onKeyDown = function (ev) {
      if (inst.s.showOnClick) {
        if (inst._isOpen) {
          // Prevent closing the picker on input enter key
          if (ev.keyCode === ENTER && inst._allowTyping) {
            ev.stopPropagation();
          }
        } else {
          if (ev.keyCode === SPACE) {
            ev.preventDefault();
          }
          // Open the picker on space or enter
          if (ev.keyCode === ENTER || ev.keyCode === SPACE) {
            onClick(ev);
          }
        }
      }
    };
    var onFocus = function (ev) {
      setReadOnly();
      if (inst.s.showOnFocus) {
        if (inst._preventShow) {
          inst._preventShow = false;
        } else {
          onClick(ev);
        }
      }
    };
    var onBlur = function () {
      if (isInput) {
        // Reset original readonly state
        input.readOnly = readOnly;
      }
    };
    var onChange = function (ev) {
      if (handleChange) {
        handleChange(ev);
      }
    };
    var onWinFocus = function () {
      if (win.document.activeElement === el) {
        setReadOnly();
        inst._preventShow = true;
      }
    };
    var win = getWindow(el);
    var isInput = matches(el, 'input,select');
    var input = el;
    var readOnly;
    if (isInput) {
      input.autocomplete = 'off';
      // Save original readony state
      readOnly = input.readOnly;
    }
    listen(el, CLICK, onClick);
    listen(el, MOUSE_DOWN, onMouseDown);
    listen(el, KEY_DOWN, onKeyDown);
    listen(el, FOCUS, onFocus);
    listen(el, BLUR, onBlur);
    listen(el, CHANGE, onChange);
    listen(win, FOCUS, onWinFocus);
    return function () {
      if (isInput) {
        // Reset original readonly state
        input.readOnly = readOnly;
      }
      unlisten(el, CLICK, onClick);
      unlisten(el, MOUSE_DOWN, onMouseDown);
      unlisten(el, KEY_DOWN, onKeyDown);
      unlisten(el, FOCUS, onFocus);
      unlisten(el, BLUR, onBlur);
      unlisten(el, CHANGE, onChange);
      unlisten(win, FOCUS, onWinFocus);
    };
  }

  // tslint:disable no-non-null-assertion
  // tslint:disable directive-class-suffix
  // tslint:disable directive-selector
  /** @hidden */
  var PickerBase = /*#__PURE__*/ (function (_super) {
    __extends(PickerBase, _super);
    function PickerBase() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      /** Does the picker support the null value
       * If the null value is not supported by the picker, it will trigger a change when the value differs after parse.
       * If the null value is supported by the picker, it will not trigger a change when the tempValueRep changes after parse.
       */
      _this._nullSupport = true;
      _this._onInputChange = function (ev, val) {
        // In case of tag input the value will come in the event detail, when tag clear is clicked
        var value = ev.detail || (val !== UNDEFINED ? val : ev.target.value);
        if (value !== _this._tempValueText && !_this._preventChange) {
          _this._readValue(value, true);
          // Make sure to write the correct value to the input, if validation changed it
          _this._valueTextChange = value !== _this._tempValueText;
          var newValue = isEmpty(value) ? null : _this._get(_this._tempValueRep);
          _this.value = newValue;
          _this._change(newValue);
        }
        _this._preventChange = false;
      };
      // tslint:disable-next-line: no-empty
      _this._onResize = function (args) {
        _this._hook('onResize', args);
      };
      _this._onWrapperResize = function () {
        if (_this._wrapper) {
          _this._onResize({ windowWidth: _this._wrapper.offsetWidth });
        }
      };
      _this._onPopupClose = function (args) {
        // Trigger the onCancel event if close happened from Cancel button click,
        // Esc key, overlay click or page scroll
        if (/cancel|esc|overlay|scroll/.test(args.source)) {
          _this._hook('onCancel', {
            value: _this.value,
            valueText: _this._valueText
          });
        }
        _this.close();
      };
      _this._onPopupClosed = function (args) {
        if (args.focus) {
          _this._preventShow = true;
        }
        _this._hook('onClosed', args);
        _this._onClosed();
      };
      _this._onPopupKey = function (args) {
        if (args.keyCode === 13) {
          _this._onEnterKey(args);
        }
      };
      _this._onPopupOpen = function (args) {
        args.value = _this.value;
        args.valueText = _this._valueText;
        _this._hook('onOpen', args);
      };
      _this._onButtonClick = function (_a) {
        var domEvent = _a.domEvent,
          button = _a.button;
        if (button.name === 'set') {
          _this.set();
        }
        if (_this._popup) {
          _this._popup._onButtonClick({ domEvent: domEvent, button: button });
        }
      };
      _this._setInput = function (inp) {
        _this._el = inp && inp.nativeElement ? inp.nativeElement : inp;
      };
      _this._setPopup = function (popup) {
        _this._popup = popup;
      };
      _this._setWrapper = function (wrapper) {
        _this._wrapper = wrapper;
      };
      return _this;
    }
    PickerBase.prototype.open = function () {
      if (this._inst) {
        this._inst.open();
        return;
      }
      if (this.s.isOpen === UNDEFINED) {
        this.setState({ isOpen: true });
      }
    };
    PickerBase.prototype.close = function () {
      if (this.s.display === 'inline') {
        return;
      }
      if (this._inst) {
        this._inst.close();
        return;
      }
      var args = {
        value: this.value,
        valueText: this._valueText
      };
      if (this.s.isOpen === UNDEFINED) {
        this.setState({ isOpen: false });
      }
      this._hook('onClose', args);
    };
    PickerBase.prototype.set = function () {
      this._valueRep = this._copy(this._tempValueRep);
      this._valueText = this._tempValueText;
      this._value = this.value = this._get(this._valueRep);
      this._change(this.value);
    };
    PickerBase.prototype.position = function () {
      if (this._inst) {
        this._inst.position();
        return;
      }
      if (this._popup) {
        this._popup.position();
      }
    };
    PickerBase.prototype.isVisible = function () {
      if (this._inst) {
        return this._inst.isVisible();
      }
      return !!this._popup && this._popup.isVisible();
    };
    PickerBase.prototype.getVal = function () {
      return this._get(this._valueRep);
    };
    PickerBase.prototype.setVal = function (value) {
      this.value = value;
      this.setState({ value: value });
    };
    /** Returns the temporary value selected on the picker. */
    PickerBase.prototype.getTempVal = function () {
      return this._get(this._tempValueRep);
    };
    /**
     * Sets the Picker temporary value. This temp value is shown on the picker until the selection.
     * In the case of inline mode or when the touchUi setting is false the value will be set to the Model as well,
     * since in these cases there's no temporary value.
     * @param value The value to set to the datepicker as temporary value
     */
    PickerBase.prototype.setTempVal = function (value) {
      this._tempValueSet = true;
      this._tempValueRep = this._parse(value);
      this._setOrUpdate(true);
    };
    PickerBase.prototype._shouldValidate = function (s, prevS) {
      return false;
    };
    PickerBase.prototype._valueEquals = function (v1, v2) {
      return v1 === v2;
    };
    // tslint:enable variable-name
    PickerBase.prototype._render = function (s, state) {
      var _this = this;
      var props = this.props || {};
      var resp = this._respProps || {};
      var prevS = this._prevS;
      if (!this._touchUi) {
        s.display = resp.display || props.display || options.display || 'anchored';
        s.showArrow = resp.showArrow || props.showArrow || false;
      }
      // 'bubble' is deprecated, renamed to 'anchored'
      if (s.display === 'bubble') {
        s.display = 'anchored';
      }
      this._scrollLock = s.scrollLock;
      var isOpen = s.isOpen !== UNDEFINED ? s.isOpen : state.isOpen;
      var controlled = s.value !== UNDEFINED;
      var value = controlled
        ? s.value // Controlled
        : state.value === UNDEFINED
        ? s.defaultValue
        : state.value; // Uncontrolled
      this._showInput = s.showInput !== UNDEFINED ? s.showInput : s.display !== 'inline' && s.element === UNDEFINED;
      if (
        !this._buttons ||
        s.buttons !== prevS.buttons ||
        s.display !== prevS.display ||
        s.setText !== prevS.setText ||
        s.cancelText !== prevS.cancelText ||
        s.closeText !== prevS.closeText ||
        s.touchUi !== prevS.touchUi
      ) {
        // If no buttons given, in inline mode and desktop anchored mode defaults to no buttons,
        // all other cases will have set and cancel by default
        this._buttons = processButtons(
          this,
          s.buttons || (s.display !== 'inline' && (s.display !== 'anchored' || this._touchUi) ? ['cancel', 'set'] : [])
        );
        // If no set button is found, live mode is activated
        this._live = true;
        if (this._buttons && this._buttons.length) {
          for (var _i = 0, _a = this._buttons; _i < _a.length; _i++) {
            var b = _a[_i];
            if (b.name === 'ok' || b.name === 'set') {
              this._live = false;
            }
          }
        }
      }
      // Parse and validate the value when needed:
      // - when the value changed
      // - when there's no value yet
      // - when _shouldvalidate returns true, depending on the picker implementation,
      // e.g. in case of datetime scroller value should be parsed again if wheels are changed
      // - when invalid, valid, or defaultSelection options are changed
      // Skip parse if value is changed from the UI - e.g. wheel scroll,
      // in this case validation runs on change and the value representation is updated in place.
      var valueChange = !this._valueEquals(value, this._value);
      if (
        valueChange ||
        this._tempValueRep === UNDEFINED ||
        this._shouldValidate(s, prevS) ||
        s.defaultSelection !== prevS.defaultSelection ||
        s.invalid !== prevS.invalid ||
        s.valid !== prevS.valid
      ) {
        // we need to save the tempValue, for later checks if the onTempValueChange should be raised
        // const oldTempValueRep = this._tempValueRep ? this._copy(this._tempValueRep) : null;
        // const oldTempValue = this._tempValueRep ? this._get(oldTempValueRep) : UNDEFINED;
        this._readValue(value);
        // Trigger onChange if validation changed the value again
        var newValue_1 = this._get(this._tempValueRep);
        var validationChange_1 = !this._valueEquals(value, newValue_1) && (!this._nullSupport || !isEmpty(value));
        this._setHeader();
        clearTimeout(this._handler);
        this._handler = setTimeout(function () {
          _this.value = value;
          if (validationChange_1) {
            _this._change(newValue_1);
          }
          // in the case of angular directives, there will be two value changes, one for the directive
          // and one for the dynamically created component. Event emitters are forwarded from the dyn. component,
          // so there's no need to trigger the onTempChange again for the directive
          if (!_this._valueEquals(_this._tempValue, newValue_1) && _this._inst === UNDEFINED) {
            _this._hook('onTempChange', { value: newValue_1 });
          }
        });
      }
      if (s.headerText !== prevS.headerText) {
        this._setHeader();
      }
      if (isOpen && !this._isOpen) {
        if (!this._tempValueSet || this._live) {
          var tempValue = this._get(this._tempValueRep);
          var parsedValue_1 = this._get(this._valueRep);
          this._tempValueRep = this._copy(this._valueRep);
          this._tempValueText = this._format(this._tempValueRep); // this._valueText;
          this._tempValue = tempValue;
          this._setHeader();
          if (!this._valueEquals(tempValue, parsedValue_1)) {
            setTimeout(function () {
              _this._hook('onTempChange', { value: parsedValue_1 });
            });
          }
        }
        this._onOpen();
      }
      this._allowTyping = s.inputTyping && !touchUi && !this._touchUi;
      this._anchorAlign = s.anchorAlign || (this._touchUi ? 'center' : 'start');
      this._cssClass = 'mbsc-picker ' + (s.cssClass || '');
      this._isOpen = isOpen;
      this._maxWidth = s.maxWidth;
      this._valueTextChange = this._valueTextChange || this._oldValueText !== this._valueText;
      this._oldValueText = this._valueText;
      this._value = value;
      this._shouldInitInput = this._shouldInitInput || s.display !== prevS.display || s.element !== prevS.element;
    };
    PickerBase.prototype._updated = function () {
      var _this = this;
      var s = this.s;
      var input = this._input;
      // we should initialize the components on the given input only, the directives should initialize the inputs
      // otherwise a single input will have the event handlers twice
      // (once for the directive and once for the dyn. created component)
      if (this._shouldInitInput && !this._inst) {
        this._unlisten();
        if (this._wrapper && s.display === 'inline') {
          this._observer = resizeObserver(this._wrapper, this._onWrapperResize, this._zone);
        }
        getNativeElement(s.element || this._el, function (el) {
          _this._el = el;
          if (s.display !== 'inline') {
            _this._resetEl = initPickerElement(el, _this, _this._onInputChange);
          }
          if (matches(el, 'input,select')) {
            _this._input = el;
            // Write the value (needs to happen after the event listeners were added)
            _this._write(el);
          }
        });
      }
      // Write the value to the input
      if (this._valueTextChange && input) {
        this._write(input);
      }
      this._shouldInitInput = false;
      this._valueTextChange = false;
      this._anchor = s.anchor || this._focusElm || s.element || this._el;
    };
    /**
     * Writes the value to the element and returns if the value was changed
     * @param elm The HTML element the value should be written to
     * @param text The value text that's written into the element
     */
    PickerBase.prototype._writeValue = function (elm, text, value) {
      var oldValue = elm.value;
      elm.value = text;
      return oldValue !== text;
    };
    PickerBase.prototype._destroy = function () {
      this._unlisten();
      this._shouldInitInput = true; // to work in React strict mode
    };
    PickerBase.prototype._setHeader = function () {
      var headerText = this.s.headerText;
      this._headerText = headerText ? headerText.replace(/\{value\}/i, this._tempValueText || '&nbsp;') : UNDEFINED;
    };
    PickerBase.prototype._setOrUpdate = function (preventChange) {
      var value = this._get(this._tempValueRep);
      this._tempValue = value;
      this._tempValueText = this._format(this._tempValueRep);
      this._setHeader();
      if (!preventChange) {
        this._hook('onTempChange', { value: value });
      }
      if (this._live) {
        this.set();
      } else {
        this.forceUpdate();
      }
    };
    // tslint:disable variable-name
    /**
     * Returns a copy of the value representation.
     * Is used to copy the temporary value to the final value and vica versa.
     * @param value The value to copy.
     */
    PickerBase.prototype._copy = function (value) {
      return value;
    };
    /**
     * Formats the value representation into a string to display the selection.
     * @param value The value to format.
     */
    PickerBase.prototype._format = function (value) {
      return value;
    };
    /**
     * Transforms the value representation into the actual value.
     * E.g. in case of date scroller the value is represented as an array like [5, 28, 2020],
     * this function will transform it into a date object.
     * @param value The value to transform.
     */
    PickerBase.prototype._get = function (value) {
      return value;
    };
    /**
     * Parses a string or actual value into the value representation.
     * E.g. in case of the date scroller the '05/28/2020' string should be parsed into [5, 28, 2020].
     * @param valueText The value to parse.
     */
    PickerBase.prototype._parse = function (valueText, fromInput) {
      return valueText;
    };
    // tslint:disable-next-line: no-empty
    PickerBase.prototype._validate = function () {};
    // tslint:disable-next-line: no-empty
    PickerBase.prototype._onClosed = function () {};
    // tslint:disable-next-line: no-empty
    PickerBase.prototype._onOpen = function () {};
    // tslint:disable-next-line: no-empty
    PickerBase.prototype._onParse = function () {};
    /**
     * Default behavior for the enter key in a picker to set the selection and close the picker
     * @param args
     */
    PickerBase.prototype._onEnterKey = function (args) {
      this.set();
      this.close();
    };
    // tslint:enable variable-name
    PickerBase.prototype._change = function (value) {
      if (this.s.value === UNDEFINED) {
        this.setState({ value: value });
      }
      this._hook('onChange', {
        value: value,
        valueText: this._tempValueText
      });
    };
    PickerBase.prototype._readValue = function (value, fromInput) {
      this._tempValueRep = this._parse(value, fromInput);
      this._onParse();
      this._validate();
      this._tempValueText = this._format(this._tempValueRep);
      this._valueRep = this._copy(this._tempValueRep);
      this._valueText = !isEmpty(value) ? this._tempValueText : '';
    };
    PickerBase.prototype._unlisten = function () {
      if (this._resetEl) {
        this._resetEl();
        this._resetEl = UNDEFINED;
      }
      if (this._observer) {
        this._observer.detach();
        this._observer = UNDEFINED;
      }
    };
    PickerBase.prototype._write = function (input) {
      var _this = this;
      var value = this._value;
      var changed = this._writeValue(input, this._valueText || '', value);
      if (changed) {
        setTimeout(function () {
          _this._preventChange = true;
          trigger(input, INPUT);
          trigger(input, CHANGE);
        });
      }
      // In case of jquery/js mobiscroll input, pass pickerMap and pickerValue to the input, needed for tags
      var mbscInput = input.__mbscFormInst;
      if (mbscInput) {
        mbscInput.setOptions({ pickerMap: this.s.valueMap, pickerValue: value });
      }
    };
    PickerBase.defaults = {
      cancelText: 'Cancel',
      closeText: 'Close',
      focusOnClose: os !== 'android',
      okText: 'Ok',
      setText: 'Set',
      showOnFocus: touchUi
    };
    return PickerBase;
  })(BaseComponent);

  var modules = {};
  var RANGE_SEPARATOR = ' - ';
  var CALENDAR_CTRL = ['calendar'];
  var INVALID_ALL = [{ recurring: { repeat: 'daily' } }];
  function notActive(active) {
    return active === 'start' ? 'end' : 'start';
  }
  /**
   * Returns the range selection stard/end dates calculated from a date.
   * Takes into account the selectSize and firstSelectDay options and calculates the selection start/end dates
   * from the passed date.
   */
  function getPresetRange(timestamp, s) {
    var date = new Date(timestamp);
    var firstSelectDay = s.firstSelectDay !== UNDEFINED ? s.firstSelectDay : s.firstDay;
    var start = getFirstDayOfWeek(date, s, firstSelectDay);
    var end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + s.selectSize - 1);
    return { start: start, end: end };
  }
  /** @hidden */
  var DatepickerBase = /*#__PURE__*/ (function (_super) {
    __extends(DatepickerBase, _super);
    function DatepickerBase() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      _this._iso = {};
      _this._onActiveChange = function (ev) {
        _this._active = ev.date;
        _this.forceUpdate();
      };
      _this._onResize = function (ev) {
        var viewportWidth = ev.windowWidth;
        // Will prevent the immediate positioning of the popup,
        // postponing it to the next cycle, with the potential new options (if responsive)
        ev.cancel = _this.state.width !== viewportWidth;
        _this.setState({
          isLarge: ev.isLarge,
          maxPopupWidth: ev.maxPopupWidth,
          width: viewportWidth,
          widthType: viewportWidth > 600 ? 'md' : 'sm'
        });
        // return this._hook('onPosition', ev);
      };
      _this._onDayHoverIn = function (_a) {
        var date = _a.date,
          hidden = _a.hidden;
        _this.setState({ hoverDate: hidden ? UNDEFINED : +date });
      };
      _this._onDayHoverOut = function (_a) {
        var date = _a.date;
        if (_this.state.hoverDate === +date) {
          _this.setState({ hoverDate: UNDEFINED });
        }
      };
      /** Saves the last clicked date on the calendar */
      _this._onCellClick = function (args) {
        _this._lastSelected = addTimezone(_this.s, args.date);
        args.active = _this._activeSelect;
        _this._hook('onCellClick', args);
      };
      _this._onCalendarChange = function (ev) {
        _this._tempValueSet = false;
        var s = _this.s;
        var tempValueRep = _this._copy(_this._tempValueRep);
        var date = map(ev.value, function (item) {
          return addTimezone(s, item);
        });
        var isPreset = s.select === 'preset-range';
        var isRange = s.select === 'range';
        var newSelection = isRange && _this._newSelection;
        var slide = (isRange || isPreset) && s.exclusiveEndDates && !_this._hasTime;
        if (slide && tempValueRep.end) {
          // tempValueRep.end = +getDayStart(s, addDays(createDate(s, tempValueRep.end), -1));
          tempValueRep.end = +getDayStart(s, createDate(s, tempValueRep.end - 1));
        }
        // if time was set previosly set it to the new selected date as well
        if (_this._hasTime && _this._selectedTime && !isRange) {
          if (_this.s.selectMultiple) {
            var lastSelection = date[date.length - 1];
            if (lastSelection) {
              lastSelection.setHours(_this._selectedTime.getHours(), _this._selectedTime.getMinutes());
            }
          } else {
            date.setHours(_this._selectedTime.getHours(), _this._selectedTime.getMinutes());
          }
        }
        if (isRange || isPreset) {
          // get the newly selected value
          var oldValue = _this._getDate(tempValueRep);
          var oldRangeDate = oldValue.filter(function (v) {
            return v !== null;
          });
          var oldRange = oldRangeDate.map(function (dateValue) {
            return +dateValue;
          });
          var oldRangeCut_1 = oldRangeDate.map(function (v) {
            return +getDateOnly(v);
          });
          var newValue = date.filter(function (v) {
            return oldRangeCut_1.indexOf(+v) < 0;
          })[0];
          if (isPreset) {
            // preset-range
            if (newValue) {
              // when no new value is selected, we shouldn't do anything
              var _a = getPresetRange(+newValue, s),
                start = _a.start,
                end = _a.end;
              tempValueRep.start = +start;
              tempValueRep.end = +end;
            }
          } else {
            // range
            var cycle = !_this._hasTime;
            var cycleAndLabels = _this._renderControls;
            var activeSelect = _this._activeSelect;
            var notActiveSelect = notActive(activeSelect);
            if (newValue) {
              if (_this._hasTime && _this._selectedTime) {
                newValue.setHours(
                  _this._selectedTime.getHours(),
                  _this._selectedTime.getMinutes(),
                  _this._selectedTime.getSeconds(),
                  _this._selectedTime.getMilliseconds()
                );
              }
              switch (oldRange.length) {
                case 0: {
                  // simple start/end date selection
                  tempValueRep = {};
                  tempValueRep[activeSelect] = +newValue;
                  break;
                }
                case 1: {
                  if (cycleAndLabels) {
                    // oneCycle selection
                    tempValueRep[activeSelect] = +newValue;
                    break;
                  }
                  if (oldRange[0] > +newValue || _this._activeSelect === 'start') {
                    // new start date selection
                    if (_this._hasTime) {
                      tempValueRep[activeSelect] = +newValue;
                    } else {
                      tempValueRep = { start: +newValue };
                      cycle = false;
                    }
                  } else {
                    // simple end date selection
                    tempValueRep.end = +newValue;
                  }
                  break;
                }
                case 2: {
                  if (cycleAndLabels) {
                    // oneCycle selection
                    tempValueRep[activeSelect] = +newValue;
                    break;
                  }
                  if (oldRange[0] > +newValue || _this._activeSelect === 'start') {
                    if (_this._hasTime) {
                      tempValueRep[activeSelect] = +newValue;
                    } else {
                      tempValueRep = { start: +newValue };
                      if (_this._activeSelect === 'end') {
                        cycle = false;
                      }
                    }
                  } else if (_this._activeSelect === 'end') {
                    // new end date selection
                    tempValueRep.end = +newValue;
                  }
                  break;
                }
              }
              // validate cross start/end (when the start is bigger than end)
              if (cycleAndLabels && tempValueRep.start && tempValueRep.end && tempValueRep.start > tempValueRep.end) {
                tempValueRep = {
                  start: +newValue
                };
                _this._setActiveSelect('end');
              }
            } else {
              // either the already selected start or end date were selected
              var newDate = void 0;
              if (oldRange.length === 1) {
                // only the start date was selected
                newDate = createDate(s, oldRange[0]);
              } else {
                newDate = _this._lastSelected;
              }
              if (_this._hasTime && _this._selectedTime) {
                newDate.setHours(
                  _this._selectedTime.getHours(),
                  _this._selectedTime.getMinutes(),
                  _this._selectedTime.getSeconds(),
                  _this._selectedTime.getMilliseconds()
                );
              } else if (
                !s.exclusiveEndDates &&
                !_this._hasTime &&
                _this._activeSelect === 'end' &&
                oldValue[0] &&
                isSameDay(newDate, oldValue[0])
              ) {
                newDate.setHours(23, 59, 59, 999);
              }
              if (cycleAndLabels || _this._hasTime) {
                // oneCycle selection
                tempValueRep[activeSelect] = +newDate;
              } else if (_this._activeSelect === 'start') {
                tempValueRep = { start: +newDate };
              } else {
                // _activeSelect === 'end'
                tempValueRep.end = +newDate;
              }
            }
            // validate the new range
            if (tempValueRep.start && tempValueRep.end) {
              // this can occur if a time control is present and we change the start date to the same day the end is on,
              // but the end date's time is am and the start date was pm
              if (tempValueRep.start > tempValueRep.end) {
                var st = createDate(s, tempValueRep.start);
                var ed = createDate(s, tempValueRep.end);
                if (isSameDay(st, ed)) {
                  ed.setHours(st.getHours(), st.getMinutes(), st.getSeconds(), st.getMilliseconds());
                  tempValueRep.end = +ed;
                } else {
                  tempValueRep.end = UNDEFINED;
                }
              }
              // validate the range for minRange
              if (s.minRange && tempValueRep.end) {
                var newEnd = _this._hasTime ? tempValueRep.start + s.minRange : +addDays(createDate(s, tempValueRep.start), s.minRange - 1);
                // if we slide the selection to a lesser range than the minimum,
                // (this can be done only when there's a time control and we change the date, not the time)
                // we let the time control validate the time part = we don't clear the end
                if (tempValueRep.end < newEnd && (!_this._hasTime || activeSelect === 'start')) {
                  tempValueRep.end = UNDEFINED;
                }
              }
              // validate the range for maxRange
              if (s.maxRange && tempValueRep.end) {
                // the end check is needed because the minRange could have cleared the end above
                // if we slide the selection to a greater range than the maximum,
                // (this can be done only when there's a time control and we change the date, not the time)
                // we let the time control validate the time part = we don't clear the end
                var newEnd = _this._hasTime ? tempValueRep.start + s.maxRange : +addDays(createDate(s, tempValueRep.start), s.maxRange) - 1;
                if (tempValueRep.end > newEnd && (!_this._hasTime || activeSelect === 'start')) {
                  tempValueRep.end = UNDEFINED;
                }
              }
              // validate the range for inRangeInvalids
              // we refine the selection and invalids are not allowed in the range
              // then need to refine/clear the end date
              if (tempValueRep.end && activeSelect === 'start' && !s.inRangeInvalid) {
                var nextInvalid = s.valid
                  ? addDays(getLatestOccurrence(s.valid, createDate(s, tempValueRep.start), s), 1)
                  : getNextOccurrence(s.invalid || [], createDate(s, tempValueRep.start), s);
                if (nextInvalid !== null && +nextInvalid < tempValueRep.end) {
                  // there is an invalid date in the range
                  tempValueRep.end = UNDEFINED;
                }
              }
            }
            // Cycling is based on whether we are refining the selection or creating a new selection.
            // When we open the picker, we always start a new selection (no matter if there was already a selected date)
            // Also sometimes the cycling is prevented, for example when the selection is forced to be the not active date
            // (when selecting an end that is less than the start)
            // Cycling is also prevented when the time control is shown. Then we need to manually switch the active date.
            if (
              cycle &&
              (_this._newSelection || !_this._renderControls || (_this._newSelection === UNDEFINED && _this.s.display === 'inline'))
            ) {
              _this._setActiveSelect(notActiveSelect);
              _this._newSelection = false;
            }
          }
        } else {
          // single or multiple date selection
          tempValueRep = { date: {} };
          if (_this.s.selectMultiple) {
            for (var _i = 0, date_1 = date; _i < date_1.length; _i++) {
              var dateVal = date_1[_i];
              tempValueRep.date[+dateVal] = dateVal;
            }
          } else {
            if (_this._hasTime) {
              var time = _this._selectedTime || new Date();
              date.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
            }
            tempValueRep.date[+date] = date;
          }
        }
        _this._tempValueRep = tempValueRep;
        if (slide && tempValueRep.end) {
          tempValueRep.end = +getDayStart(s, addDays(createDate(s, tempValueRep.end), 1));
        }
        _this._setOrUpdate();
        // In case of single live selection close the picker when a date is clicked
        if (
          _this._live &&
          (!_this.s.selectMultiple || isRange) &&
          !_this._hasTime &&
          (!isRange || (tempValueRep.start && tempValueRep.end && !newSelection))
        ) {
          _this.close();
        }
      };
      _this._onDatetimeChange = function (ev) {
        var s = _this.s;
        var isRange = s.select === 'range';
        var value = addTimezone(s, ev.value);
        var date = _this._hasTime ? value : getDateOnly(value);
        var d = +date;
        _this._tempValueSet = false;
        var tempValueRep = _this._copy(_this._tempValueRep);
        var slide = isRange && s.exclusiveEndDates && !_this._hasTime;
        if (slide && tempValueRep.end) {
          // tempValueRep.end = +getDayStart(s, addDays(createDate(s, tempValueRep.end), -1));
          tempValueRep.end = +getDayStart(s, createDate(s, tempValueRep.end - 1));
        }
        if (isRange) {
          if (_this._activeSelect === 'start') {
            if (_this._hasTime && _this._selectedTime) {
              date.setHours(
                _this._selectedTime.getHours(),
                _this._selectedTime.getMinutes(),
                _this._selectedTime.getSeconds(),
                _this._selectedTime.getMilliseconds()
              );
            }
            tempValueRep.start = d;
            if (tempValueRep.end) {
              // validate the range for minRange
              var minRange = s.minRange && !_this._hasTime ? (s.minRange - 1) * 24 * 60 * 60 * 1000 - 1 : s.minRange || 0;
              var range = tempValueRep.end - tempValueRep.start;
              if (range < minRange) {
                tempValueRep.end = UNDEFINED;
              }
            }
          } else {
            // end selection
            if (_this._hasTime) {
              if (_this._selectedTime) {
                date.setHours(
                  _this._selectedTime.getHours(),
                  _this._selectedTime.getMinutes(),
                  _this._selectedTime.getSeconds(),
                  _this._selectedTime.getMilliseconds()
                );
              }
            } else if (tempValueRep.start === +getDateOnly(date) && !s.exclusiveEndDates) {
              date.setHours(23, 59, 59, 999);
            }
            tempValueRep.end = +date;
          }
        } else {
          // single date selection (there's no multiselect in the case of the datetime scroller)
          if (_this._hasTime && _this._hasDate && s.controls.indexOf('datetime') < 0) {
            var time = _this._selectedTime || new Date();
            date.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
          } else {
            _this._selectedTime = createDate(s, date);
          }
          tempValueRep = { date: {} };
          tempValueRep.date[+date] = date;
        }
        _this._tempValueRep = tempValueRep;
        if (slide && tempValueRep.end) {
          tempValueRep.end = +getDayStart(s, addDays(createDate(s, tempValueRep.end), 1));
        }
        _this._setOrUpdate();
      };
      _this._onTimePartChange = function (ev) {
        _this._tempValueSet = false;
        var s = _this.s;
        var isRange = s.select === 'range';
        var date = addTimezone(s, ev.value);
        _this._selectedTime = date; // save the time part selection - this is needed when there's no date part selection yet,
        // it will be added when the date is selected
        if (isRange) {
          // range selection
          var values = _this._getDate(_this._tempValueRep);
          var valueIndex = _this._activeSelect === 'start' ? 0 : 1;
          if (values[valueIndex]) {
            var value = createDate(s, values[valueIndex]);
            // update the time part in the active selection
            value.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
            values[valueIndex] = value;
            if (_this._activeSelect === 'start' && +value > +values[1]) {
              values.length = 1;
            }
            _this._tempValueRep = _this._parse(values);
          } else {
            _this._selectedTime.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
          }
        } else if (!s.selectMultiple) {
          // single select either with calendar or date
          var value = _this._getDate(_this._tempValueRep);
          if (value) {
            value.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
            _this._tempValueRep = { date: {} };
            _this._tempValueRep.date[+value] = value;
          } else {
            _this._selectedTime.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
            // In live mode, a set will be triggered later instead of the forceupdate, but no value change is happening until
            // a date is also selected, so no update will happen to re-render the datepicker and pass the newly selected time
            // to the time scroller. So we need to trigger an update here.
            if (_this._live) {
              _this.forceUpdate();
            }
          }
        }
        _this._setOrUpdate();
      };
      /** @hidden */
      _this._changeActiveTab = function (ev) {
        _this.setState({ activeTab: ev.target.value });
      };
      /** @hidden */
      _this._changeActiveSelect = function (ev) {
        var active = ev.target.value;
        _this._setActiveSelect(active);
        _this.setActiveDate(active);
      };
      _this._clearEnd = function () {
        _this._tempValueRep.end = UNDEFINED;
        // if there's a timegrid, we should also clear the time part of the selection
        if (_this._hasTimegrid) {
          _this._selectedTime = UNDEFINED;
        }
        _this._setOrUpdate();
      };
      _this._clearStart = function () {
        _this._tempValueRep = {};
        _this._newSelection = true;
        // if there's a timegrid, we should also clear the time part of the selection
        if (_this._hasTimegrid) {
          _this._selectedTime = UNDEFINED;
        }
        _this._setOrUpdate();
      };
      // tslint:disable-next-line: variable-name
      _this._proxy = function (args) {
        _this._hook(args.type, args);
      };
      // tslint:disable-next-line: variable-name
      _this._onInputClickRange = function (ev) {
        var inp = ev.target;
        var activate = inp === _this._startInput || _this._renderControls ? 'start' : 'end';
        _this._setActiveSelect(activate);
      };
      // tslint:disable-next-line: variable-name
      _this._onInputChangeRange = function (ev) {
        var startInput = _this._startInput;
        var endInput = _this._endInput;
        var value = (startInput ? startInput.value : '') + (endInput && endInput.value ? RANGE_SEPARATOR + endInput.value : '');
        _this._onInputChange(ev, value);
      };
      return _this;
    }
    /**
     * Sets which date or time is currently selected (start or end).
     * @param active Specifies which one should be active start or end selection.
     */
    DatepickerBase.prototype.setActiveDate = function (active) {
      var notActiveSelect = notActive(active);
      this._activeSelect = active;
      var activeValue = this._tempValueRep[active];
      var notActiveValue = this._tempValueRep[notActiveSelect];
      if ((this._tempValueRep.start && this._tempValueRep.end) || (!activeValue && notActiveValue)) {
        this._newSelection = false;
      } else if (activeValue && !notActiveValue) {
        this._newSelection = true;
      }
      if (activeValue) {
        this._active = activeValue;
      }
      // when switching the active selection in the case of the timegrid, we should clear the selected time
      if (!activeValue && this._hasTimegrid) {
        this._selectedTime = UNDEFINED;
      }
      this.forceUpdate();
    };
    /** Returns the temporary value selected on the datepicker. */
    DatepickerBase.prototype.getTempVal = function () {
      return _super.prototype.getTempVal.call(this);
    };
    /**
     * Sets the datepicker temporary value. This temp value is shown on the picker until the selection.
     * In the case of inline mode or when the touchUi setting is false the value will be set to the Model as well,
     * since in these cases there's no temporary value.
     * @param value The value to set to the datepicker as temporary value
     */
    DatepickerBase.prototype.setTempVal = function (value) {
      _super.prototype.setTempVal.call(this, value);
    };
    /**
     * Navigates the calendar to the specified date.
     * @param date
     */
    DatepickerBase.prototype.navigate = function (date) {
      this._active = +makeDate(date);
      this.forceUpdate();
    };
    DatepickerBase.prototype._shouldValidate = function (s, prevS) {
      return (
        s.controls !== prevS.controls ||
        s.dataTimezone !== prevS.dataTimezone ||
        s.displayTimezone !== prevS.displayTimezone ||
        s.dateFormat !== prevS.dateFormat ||
        s.timeFormat !== prevS.timeFormat ||
        s.locale !== prevS.locale ||
        s.min !== prevS.min ||
        s.max !== prevS.max
      );
    };
    DatepickerBase.prototype._valueEquals = function (v1, v2) {
      var side1 = (isArray(v1) && v1.length === 0) || v1 === UNDEFINED || v1 === null;
      var side2 = (isArray(v2) && v2.length === 0) || v2 === UNDEFINED || v2 === null;
      return (side1 && side1 === side2) || dateValueEquals(v1, v2, this.s);
    };
    // tslint:enable variable-name
    DatepickerBase.prototype._init = function () {
      // Register the injected modules
      if (this.props.modules) {
        this.props.modules.forEach(function (module) {
          modules[module._name] = module;
        });
      }
    };
    DatepickerBase.prototype._render = function (s, state) {
      var _this = this;
      // when invalids can be part of the range, we disregard the rangeEndInvalid option
      if (s.inRangeInvalid) {
        s.rangeEndInvalid = false;
      }
      // when using the 'preset-range' selection mode, we only support the calendar control, and we disregard the controls option
      // we need to overwrite the controls option because in angular the prevS is compared to it, and the controls are destroyed
      // and recreated base on the s.controls, and otherwise it results in an error.
      if (s.select === 'preset-range') {
        s.controls = CALENDAR_CTRL;
      }
      // If we have display timezone set, default to exclusive end dates
      if (s.exclusiveEndDates === UNDEFINED) {
        s.exclusiveEndDates = !!s.displayTimezone;
      }
      var hasTime = find(s.controls, function (item) {
        return item === 'time' || item === 'datetime' || item === 'timegrid';
      });
      // if there's no time control on the picker, we disregard the timezone options
      if (!hasTime) {
        s.timezonePlugin = s.dataTimezone = s.displayTimezone = UNDEFINED;
      }
      // invalidate all, when valid option is defined
      if (s.valid && (!s.invalid || hasTime)) {
        s.invalid = INVALID_ALL;
      }
      var prevS = this._prevS;
      s.buttons; // needed for decomposition - we should not pass this to the subcomponents in the `other` props
      var calendarSize = s.calendarSize;
      s.children;
      s.className;
      var controls = s.controls;
      s.cssClass;
      s.element;
      s.onDestroy;
      s.onInit;
      // onMarkupReady,
      s.onTempChange; // needed for decomposition
      s.responsive; // needed for decomposition
      var select = s.select,
        selectMultiple = s.selectMultiple, // needed for decomposition - only passed to the calendar when no range selection
        tabs = s.tabs,
        other = __rest(s, [
          'buttons',
          'calendarSize',
          'children',
          'className',
          'controls',
          'cssClass',
          'element',
          'onDestroy',
          'onInit',
          'onTempChange',
          'responsive',
          'select',
          'selectMultiple',
          'tabs'
        ]);
      var widthType = state.widthType || 'sm';
      var isRange = select !== 'date';
      this._renderTabs = controls.length > 1 && (tabs === 'auto' ? widthType === 'sm' : tabs);
      // Switching between range and date selection
      // When there are already selected values, then we try to move them between selections
      if (select !== prevS.select && this._tempValueRep) {
        if (isRange && this._tempValueRep.date) {
          var _a = Object.keys(this._tempValueRep.date)
              .map(function (v) {
                return +v;
              })
              .sort(),
            start = _a[0],
            end = _a[1];
          this._tempValueRep.start = start;
          this._tempValueRep.end = end;
          this._tempValueRep.date = UNDEFINED;
          this._tempValueText = this._format(this._tempValueRep);
          setTimeout(function () {
            _this.set();
          });
        } else if (!isRange && (this._tempValueRep.start || this._tempValueRep.end)) {
          if (!this._tempValueRep.date) {
            this._tempValueRep.date = {};
          }
          var first = this._tempValueRep.start || this._tempValueRep.end;
          this._tempValueRep.date[first] = new Date(first);
          var second = this._tempValueRep.end || this._tempValueRep.start;
          if (second !== first && s.selectMultiple) {
            this._tempValueRep.date[second] = new Date(second);
          }
          this._tempValueRep.start = UNDEFINED;
          this._tempValueRep.end = UNDEFINED;
          this._tempValueText = this._format(this._tempValueRep);
          setTimeout(function () {
            _this.set();
          });
        }
      }
      if (s.min !== prevS.min) {
        this._min = isEmpty(s.min) ? UNDEFINED : makeDate(s.min, s, s.dateFormat);
      }
      if (s.max !== prevS.max) {
        this._max = isEmpty(s.max) ? UNDEFINED : makeDate(s.max, s, s.dateFormat);
      }
      if (s.minTime !== prevS.minTime) {
        this._minTime = isEmpty(s.minTime) ? UNDEFINED : makeDate(s.minTime, s, s.timeFormat);
      }
      if (s.maxTime !== prevS.maxTime) {
        this._maxTime = isEmpty(s.maxTime) ? UNDEFINED : makeDate(s.maxTime, s, s.timeFormat);
      }
      // Process the controls
      var hadTime = this._hasTime;
      var controlsChanged = controls !== prevS.controls;
      if (controlsChanged) {
        this._controls = [];
        this._hasCalendar = false;
        this._hasDate = false;
        this._hasTime = false;
        this._hasTimegrid = false;
        this._controlsClass = '';
        for (var _i = 0, _b = controls; _i < _b.length; _i++) {
          var control = _b[_i];
          if (control === 'time' || control === 'datetime') {
            this._hasTime = true;
          }
          if (control === 'timegrid') {
            this._hasTime = true;
            this._hasTimegrid = true;
          }
          if (control === 'calendar' || control === 'date' || control === 'datetime') {
            this._hasDate = true;
          }
          if (control === 'calendar') {
            this._hasCalendar = true;
          }
          this._controls.push({
            Component: modules[control === 'calendar' ? 'Calendar' : control === 'timegrid' ? 'Timegrid' : 'Datetime'],
            name: control,
            title: control === 'time' || control === 'timegrid' ? s.timeText : s.dateText
          });
          this._controlsClass += ' mbsc-datepicker-control-' + control;
        }
        // when changing from a distinct time picker to a datetime the selected time will be tracked
        // by the datetime control, so the _selectedTime should be undefined
        if (!this._hasTime) {
          this._selectedTime = UNDEFINED;
        }
      }
      var tempValueRepEnd = this._tempValueRep && this._tempValueRep.end;
      var tempValueRepStart = this._tempValueRep && this._tempValueRep.start;
      this._renderControls = isRange && select !== 'preset-range' && (s.showRangeLabels !== UNDEFINED ? s.showRangeLabels : true);
      this._nullSupport = s.display !== 'inline' || select !== 'date' || s.selectMultiple === true;
      // Determine the date & time format
      var format = '';
      if (this._hasDate) {
        format += s.dateFormat;
      }
      if (this._hasTime) {
        format += (this._hasDate ? s.separator : '') + s.timeFormat;
      }
      this._valueFormat = format;
      this._activeTab = state.activeTab || s.controls[0];
      _super.prototype._render.call(this, s, state); // TODO _valueFormat is undefined at initial load if this is on the top check if there's any other way
      // When controls change, it triggers a readValue() in the base render.
      // It will also trigger a change with a setTimeout if the value changed during this readValue.
      // When switching back and fort from date/datetime selection
      // the following setTimeout should come after the setTimeout of the picker base, so it won't override
      // the value with the parsed one. The parsed one will not have time info.
      if (controlsChanged && isRange && s.exclusiveEndDates && this._hasTime !== hadTime && tempValueRepEnd) {
        setTimeout(function () {
          var end = +addDays(createDate(s, tempValueRepEnd), hadTime ? 1 : -1); // this._hasTime ? -1 : 1
          var startDate = tempValueRepStart && createDate(s, tempValueRepStart);
          var endCorrected = startDate && end < +startDate ? +addDays(createDate(s, startDate), 1) : end;
          _this._tempValueRep.end = endCorrected;
          _this._tempValueRep.start = startDate && +startDate;
          _this._valueText = _this._tempValueText = _this._format(_this._tempValueRep);
          _this._valueTextChange = true;
          _this.set();
          _this.forceUpdate();
        });
      }
      if (s.headerText !== prevS.headerText || s.selectCounter !== prevS.selectCounter || s.selectMultiple !== prevS.selectMultiple) {
        this._setHeader();
      }
      /** In the case of the timegrid control, we need to turn off the scrollLock,
       * otherwise the control is not scrollable
       */
      this._scrollLock = s.scrollLock !== UNDEFINED ? s.scrollLock : !this._hasTimegrid;
      // overwrite showinput based on start/end input in range
      // we only show the input when not in inline mode and if there are no custom inputs passed in range mode
      this._showInput = s.showInput !== UNDEFINED ? s.showInput : this._showInput && (!isRange || (!s.startInput && !s.endInput));
      // overwrite the initialization of inputs - take into account the start and end inputs
      this._shouldInitInputs =
        this._shouldInitInputs || select !== prevS.select || s.startInput !== prevS.startInput || s.endInput !== prevS.endInput;
      this._shouldInitInput = this._shouldInitInput || this._shouldInitInputs;
      /* Determine the ISO parts from format */
      if (
        controls !== prevS.controls ||
        s.dateWheels !== prevS.dateWheels ||
        s.timeWheels !== prevS.timeWheels ||
        s.dateFormat !== prevS.dateFormat ||
        s.timeFormat !== prevS.timeFormat
      ) {
        var dateParts = s.dateWheels || s.dateFormat;
        var timeParts = s.timeWheels || s.timeFormat;
        var isoParts = (this._iso = {});
        if (this._hasDate) {
          if (/y/i.test(dateParts)) {
            isoParts.y = 1;
          }
          if (/M/.test(dateParts)) {
            isoParts.y = 1;
            isoParts.m = 1;
          }
          if (/d/i.test(dateParts)) {
            isoParts.y = 1;
            isoParts.m = 1;
            isoParts.d = 1;
          }
        }
        if (this._hasTime) {
          if (/h/i.test(timeParts)) {
            isoParts.h = 1;
          }
          if (/m/.test(timeParts)) {
            isoParts.i = 1;
          }
          if (/s/i.test(timeParts)) {
            isoParts.s = 1;
          }
        }
      }
      var setButtonDisabled;
      if (isRange) {
        // Set active selection
        if (this._activeSelect === UNDEFINED) {
          this._setActiveSelect('start', true);
        }
        // Disable the set button if the selection is not ready
        setButtonDisabled = this._selectionNotReady();
      } else {
        this._activeSelect = UNDEFINED;
        // enable the set button - when switching between range and date select, the set button can be stuck otherwise
        setButtonDisabled = false;
      }
      if (this._buttons) {
        // find the set button
        var setBtn = find(this._buttons, function (btn) {
          return btn.name === 'set';
        });
        if (setBtn && setBtn.disabled !== setButtonDisabled) {
          setBtn.disabled = setButtonDisabled;
          // Forces re-render
          this._buttons = this._buttons.slice();
        }
      }
      var activeSelect = this._activeSelect; // saved for optimization
      this._needsWidth =
        (s.display === 'anchored' ||
          s.display === 'center' ||
          (s.display !== 'inline' && state.isLarge) ||
          (controls.length > 1 && !tabs)) &&
        s.width === UNDEFINED;
      // limit selection range based on invalids and min/max range options
      var maxDate = s.max !== UNDEFINED ? makeDate(s.max, s, format) : UNDEFINED;
      var minDate = s.min !== UNDEFINED ? makeDate(s.min, s, format) : UNDEFINED;
      this._maxLimited = maxDate;
      this._minLimited = minDate;
      // get the next invalid date from the selected start date and cache it
      // only calculate if the start date or the invalids changed
      var selectedStart = this._tempValueRep.start;
      if (selectedStart && (this._prevStart !== selectedStart || prevS.valid !== s.valid || prevS.invalid !== s.invalid)) {
        var startDate = createDate(s, selectedStart);
        this._nextInvalid = s.valid
          ? addDays(getLatestOccurrence(s.valid, startDate, s), 1)
          : getNextOccurrence(s.invalid || [], startDate, s);
      }
      var endSelection = activeSelect === 'end' && selectedStart;
      if (endSelection) {
        if (!s.inRangeInvalid) {
          var nextInvalid = this._nextInvalid;
          if (nextInvalid) {
            // in case the range end can occur on an invalid date, we need to allow that date to be selected
            // so we need to extend the _maxLimited with an addition day
            // we also need to add it as a valid date late on when we pass the options to the controls
            if (s.rangeEndInvalid) {
              this._maxLimited = createDate(s, +addDays(nextInvalid, 1) - 1);
            } else {
              this._maxLimited = createDate(s, +nextInvalid - 1);
            }
          }
        }
        if (!this._hasCalendar || this._hasTime) {
          if (!this._minLimited || makeDate(this._minLimited, s, format) < createDate(s, selectedStart)) {
            this._minLimited = createDate(s, this._tempValueRep.start);
          }
        }
      }
      this._minTimeLimited = this._minLimited;
      if (endSelection) {
        if (s.minRange) {
          // we take out the 0 range as well by not comparing to UNDEFINED
          var minLimited = this._hasTime
            ? this._tempValueRep.start + s.minRange
            : +addDays(createDate(s, this._tempValueRep.start), s.minRange) - 1;
          if (!this._minLimited || +makeDate(this._minLimited, s, format) < minLimited) {
            this._minLimited = createDate(s, minLimited);
            this._minTimeLimited = this._minLimited;
          }
        }
        if (this._minTimeLimited === UNDEFINED && this._tempValueRep.start && this._tempValueRep.end) {
          this._minTimeLimited = createDate(s, +this._tempValueRep.start);
        }
        if (s.maxRange !== UNDEFINED) {
          var maxLimited = this._hasTime
            ? this._tempValueRep.start + s.maxRange
            : +addDays(createDate(s, this._tempValueRep.start), s.maxRange) - 1;
          if (!this._maxLimited || +makeDate(this._maxLimited, s, format) > maxLimited) {
            this._maxLimited = createDate(s, maxLimited);
          }
        }
      }
      // Set control options
      for (var _c = 0, _d = this._controls; _c < _d.length; _c++) {
        var control = _d[_c];
        var options = __assign({}, other, {
          display: 'inline',
          isOpen: s.isOpen || state.isOpen,
          max: this._maxLimited,
          min: this._minLimited
        });
        // in case the range end can occur on an invalid date, and we are selecting the end date of the range
        // we need to allow that date to be selected
        // so we need to add it as a valid date to overwrite the invalid option for that day
        // we also need to extend the _maxLimited with an addition day since the inRangeInvalid option is also false
        // this is done above when we calculate the _maxLimited
        if (s.rangeEndInvalid && endSelection && this._nextInvalid) {
          options.valid = (options.valid || []).concat([this._nextInvalid]);
        }
        if (control.name === 'calendar') {
          options.min = this._minLimited ? getDateOnly(this._minLimited) : UNDEFINED;
          options.max = this._maxLimited ? getDateOnly(this._maxLimited) : UNDEFINED;
          options.selectRange = isRange;
          options.width = this._needsWidth ? PAGE_WIDTH * getPageNr(s.pages, state.maxPopupWidth) : UNDEFINED;
          if (s.calendarType === 'week' && calendarSize) {
            options.weeks = calendarSize;
          } else {
            options.size = calendarSize;
          }
          // If we have more than 2 pages, increase the max width of the popup (which defaults to 600px)
          var pages = s.pages === 'auto' ? 3 : s.pages || 1;
          this._maxWidth = s.maxWidth || (pages > 2 ? PAGE_WIDTH * pages : UNDEFINED);
          if (isRange) {
            var valueDate = this._getDate(this._tempValueRep);
            var endDate = valueDate[1];
            if (endDate && s.exclusiveEndDates && !this._hasTime) {
              valueDate[1] = createDate(s, +endDate - 1);
            }
            var values = valueDate
              .filter(function (v) {
                return v !== null;
              }) // filter out null values
              .map(function (v) {
                return +getDateOnly(v);
              }) // cut the time part and turn into timestamp (number) - for the distinct filter to work
              .filter(function (v, ind, arr) {
                return arr.indexOf(v) === ind;
              }) // keep only distinct values
              // always pass date objects to subcomponents
              .map(function (v) {
                return new Date(v);
              });
            options.value = values;
            // Highlighted and hovered days
            if (s.rangeHighlight) {
              options.rangeStart = valueDate[0] && +getDateOnly(removeTimezone(valueDate[0]));
              options.rangeEnd = valueDate[1] && +getDateOnly(removeTimezone(valueDate[1]));
              options.onDayHoverIn = this._onDayHoverIn;
              options.onDayHoverOut = this._onDayHoverOut;
              if (select === 'preset-range') {
                if (state.hoverDate) {
                  var _e = getPresetRange(state.hoverDate, s),
                    start = _e.start,
                    end = _e.end;
                  options.hoverStart = +start;
                  options.hoverEnd = +end;
                }
              } else {
                if (activeSelect === 'end' && valueDate[0]) {
                  options.hoverStart = options.rangeEnd || options.rangeStart;
                  options.hoverEnd = state.hoverDate;
                }
                if (activeSelect === 'start' && valueDate[1] && this._renderControls) {
                  options.hoverStart = state.hoverDate;
                  options.hoverEnd = options.rangeStart || options.rangeEnd;
                }
              }
            }
          } else {
            options.selectMultiple = selectMultiple; // this should not be passed to the calendar in the case of the range
            options.value = this._getDate(this._tempValueRep);
          }
          var vals = isArray(options.value) ? options.value : [options.value];
          var min = options.min ? +options.min : -Infinity;
          var max = options.max ? +options.max : Infinity;
          var selected = void 0;
          for (var _f = 0, vals_1 = vals; _f < vals_1.length; _f++) {
            var val = vals_1[_f];
            // Find first value between min and max
            if (!selected && val >= min && val <= max) {
              selected = +val;
            }
          }
          if (selected !== this._selectedDate || this._active === UNDEFINED || s.min !== prevS.min || s.max !== prevS.max) {
            this._selectedDate = selected;
            this._active = constrain(selected ? +getDateOnly(new Date(selected)) : this._active || +getDateOnly(new Date()), min, max);
          }
          var viewFormat = s.dateWheels || s.dateFormat;
          var selectedView = /d/i.test(viewFormat)
            ? MONTH_VIEW
            : /m/i.test(viewFormat)
            ? YEAR_VIEW
            : /y/i.test(viewFormat)
            ? MULTI_YEAR_VIEW
            : MONTH_VIEW;
          options.active = this._active;
          options.onActiveChange = this._onActiveChange;
          options.onChange = this._onCalendarChange;
          options.onCellClick = this._onCellClick;
          options.onCellHoverIn = this._proxy;
          options.onCellHoverOut = this._proxy;
          options.onLabelClick = this._proxy;
          options.onPageChange = this._proxy;
          options.onPageLoaded = this._proxy;
          options.onPageLoading = this._proxy;
          options.selectView = selectedView;
        } else {
          var tempValueKeys = Object.keys(this._tempValueRep.date || {});
          // In case of the iOS theme we need the center color styling (light gray instead of darker gray),
          // if tabs are displayed or calendar is present (in top & bottom mode)
          options.displayStyle =
            (s.display === 'bottom' || s.display === 'top') && (this._hasCalendar || this._renderTabs) ? 'center' : s.display;
          options.mode = control.name; // date, time or datetime
          if ((control.name === 'time' || control.name === 'timegrid') && this._hasDate) {
            options.onChange = this._onTimePartChange;
            if (isRange) {
              // selectedTime needs to be set only initially, when there's no selection yet
              // it is updated from the change event in the _onTimePartChange
              var alreadySelectedOne = this._tempValueRep[activeSelect];
              // we need to update the date part of the passed value, because the datetime validation
              // will take into account the date part as well (even if the control is time)
              var selectedTime = void 0;
              if (this._selectedTime) {
                if (!this._minTimeLimited || this._selectedTime > this._minTimeLimited) {
                  selectedTime = this._selectedTime;
                } else {
                  selectedTime = createDate(s, this._minTimeLimited);
                  selectedTime.setHours(
                    this._selectedTime.getHours(),
                    this._selectedTime.getMinutes(),
                    this._selectedTime.getSeconds(),
                    this._selectedTime.getMilliseconds()
                  );
                }
              }
              this._selectedTime = alreadySelectedOne
                ? createDate(s, alreadySelectedOne)
                : selectedTime || (control.name === 'time' ? createDate(s) : UNDEFINED);
              options.value = this._selectedTime;
            } else if (!s.selectMultiple) {
              var alreadyDate = (this._tempValueRep.date && this._tempValueRep.date[tempValueKeys[0]]) || this._selectedTime;
              this._selectedTime = options.value = alreadyDate;
            }
            options.min = this._minTimeLimited;
            options.max = this._maxLimited;
          } else {
            options.onChange = this._onDatetimeChange;
            if (isRange) {
              var n = this._tempValueRep[activeSelect];
              var m = this._tempValueRep[notActive(activeSelect)];
              options.value = n ? createDate(s, n) : m ? createDate(s, m) : null; // if there is already a selection of the not active,
              // we should start with that value
              // ^ Why? because when there is only the time picker the passed date object might have a different date than today.
              // But this will default to today in the Date component, so if you selected 8 PM yesterday on a only time picker, it
              // will allow to select the 7 PM as end time (which is not valid, bc. we should not take into account the Date only the time)
              if (activeSelect === 'end' && s.exclusiveEndDates && !this._hasTime) {
                options.value = createDate(s, +options.value - 1);
              }
            } else {
              var value = this._tempValueRep.date && this._tempValueRep.date[tempValueKeys[0]];
              var passed = value;
              if (value) {
                if (!this._hasTime) {
                  passed = getDateOnly(value);
                }
              }
              options.value = passed || null;
            }
          }
          if (control.name === 'time' || control.name === 'timegrid') {
            // get the selected date or default
            var selectedOrDefault = options.value || constrainDate(new Date(), options.min, options.max);
            if (this._minTime) {
              // construct a minimum date from given time part and selected date's date part
              var minTime = this._minTime;
              var min = new Date(
                selectedOrDefault.getFullYear(),
                selectedOrDefault.getMonth(),
                selectedOrDefault.getDate(),
                minTime.getHours(),
                minTime.getMinutes(),
                minTime.getSeconds(),
                minTime.getMilliseconds()
              );
              // override min option passed to the time control if bigger (more constraining) than already specified min option
              // Note: already specified min might be calculated from other factors like the range selection
              // end date can't be lass than the start and so on...
              if (!options.min || min > options.min) {
                options.min = min;
              }
            }
            if (this._maxTime) {
              // construct a maximum date from given time part and selected date's date part
              var maxTime = this._maxTime;
              var max = new Date(
                selectedOrDefault.getFullYear(),
                selectedOrDefault.getMonth(),
                selectedOrDefault.getDate(),
                maxTime.getHours(),
                maxTime.getMinutes(),
                maxTime.getSeconds(),
                maxTime.getMilliseconds()
              );
              // override max option passed to the time control if smaller (more constraining) than already specified max option
              // Note: already specified max might be calculated from other factors like the range selection
              // maxRange option that limits the maximum value
              if (!options.max || max < options.max) {
                options.max = max;
              }
            }
          }
        }
        control.options = options;
      }
      this._prevStart = this._tempValueRep.start;
    };
    DatepickerBase.prototype._updated = function () {
      var _this = this;
      var s = this.s;
      if (this._shouldInitInputs) {
        this._resetInputs();
        if (s.select === 'range') {
          var startInput = s.startInput;
          if (startInput) {
            this._setupInput('start', startInput);
          }
          var endInput = s.endInput;
          if (endInput) {
            this._setupInput('end', endInput);
          }
          if (s.element && (this._startInput === s.element || this._endInput === s.element)) {
            this._shouldInitInput = false;
            clearTimeout(s.element.__mbscTimer);
          }
        }
        this._shouldInitInputs = false;
      }
      // we save the valueTextChange bc the base overwrites it and we won't know if there
      // was a value change or not. We need to populate the start/end inputs after the base _updated() call,
      // to overwrite the start value if the same input is used for the start and the initial input
      var valueTextChange = this._valueTextChange;
      _super.prototype._updated.call(this);
      if (s.select === 'range' && valueTextChange) {
        var triggerChange = function (inp, val) {
          inp.value = val;
          setTimeout(function () {
            _this._preventChange = true;
            trigger(inp, INPUT);
            trigger(inp, CHANGE);
          });
        };
        if (this._startInput) {
          triggerChange(this._startInput, this._getValueText('start'));
        }
        if (this._endInput) {
          triggerChange(this._endInput, this._getValueText('end'));
        }
      }
    };
    DatepickerBase.prototype._onEnterKey = function (args) {
      if (!this._selectionNotReady()) {
        // if selection is ready do the default behavior
        _super.prototype._onEnterKey.call(this, args);
      }
    };
    DatepickerBase.prototype._setupInput = function (i, input) {
      var _this = this;
      getNativeElement(input, function (inp) {
        var resetElement = initPickerElement(inp, _this, _this._onInputChangeRange, _this._onInputClickRange);
        if (i === 'start') {
          _this._startInput = inp;
          _this._resetStartInput = resetElement;
        } else {
          _this._endInput = inp;
          _this._resetEndInput = resetElement;
        }
        var val = _this._getValueText(i);
        var changed = val !== inp.value;
        inp.value = val;
        if (changed) {
          setTimeout(function () {
            _this._preventChange = true;
            trigger(inp, INPUT);
            trigger(inp, CHANGE);
          });
        }
      });
    };
    DatepickerBase.prototype._destroy = function () {
      // clean up after start/end inputs
      this._resetInputs();
      _super.prototype._destroy.call(this);
    };
    DatepickerBase.prototype._setHeader = function () {
      var s = this.s;
      if (s.selectCounter && s.selectMultiple) {
        var count = Object.keys((this._tempValueRep && this._tempValueRep.date) || {}).length;
        this._headerText = (count > 1 ? s.selectedPluralText || s.selectedText : s.selectedText).replace(/{count}/, '' + count);
      } else {
        _super.prototype._setHeader.call(this);
      }
    };
    // TODO: check if common parts with date scroller validation could be extracted
    DatepickerBase.prototype._validate = function () {
      if (this._max <= this._min) {
        return;
      }
      var s = this.s;
      var min = this._min ? +this._min : -Infinity;
      var max = this._max ? +this._max : Infinity;
      if (s.select === 'date') {
        var values = this._tempValueRep.date;
        // In case of multiple select we don't validate the values
        if (!s.selectMultiple) {
          // Iterate through all selected dates and validate them
          for (var _i = 0, _a = Object.keys(values); _i < _a.length; _i++) {
            var key = _a[_i];
            var d = values[key];
            var validated = getClosestValidDate(d, s, min, max);
            if (+validated !== +d) {
              delete values[key];
              values[+getDateOnly(validated)] = validated;
            }
          }
        }
      } else {
        // range
        var range = this._getDate(this._tempValueRep);
        // Constrain the range between the min and max values
        var startDate = range[0],
          endDate = range[1];
        if (startDate) {
          startDate = getClosestValidDate(startDate, s, min, max);
          // also get the next invalid date in case there can't be any invalids in the range
          // for later validating the endDate
          if (!s.inRangeInvalid && (!this._prevStart || this._prevStart !== +startDate)) {
            this._nextInvalid = s.valid
              ? addDays(getLatestOccurrence(s.valid, startDate, s), 1)
              : getNextOccurrence(s.invalid || [], startDate, s);
          }
        }
        if (endDate) {
          // validate the end using the inRangeInvalid an the rangeEndInvalid options
          if (!s.inRangeInvalid && this._nextInvalid && this._nextInvalid <= endDate) {
            endDate = s.rangeEndInvalid ? this._nextInvalid : addDays(this._nextInvalid, -1);
          } else {
            endDate = getClosestValidDate(endDate, s, min, max); // otherwise get the next valid date
          }
        }
        if (startDate && endDate && startDate > endDate) {
          if (this._activeSelect === 'end') {
            startDate = endDate;
          } else {
            endDate = startDate;
          }
        }
        if (startDate) {
          this._prevStart = this._tempValueRep.start = +startDate;
        }
        if (endDate) {
          this._tempValueRep.end = +endDate;
        }
      }
    };
    DatepickerBase.prototype._copy = function (value) {
      var date = value.date ? __assign({}, value.date) : value.date;
      return __assign({}, value, { date: date });
    };
    /**
     * Formats the value representation to a string
     * IMPORTANT: The order of the dates in the formatted string is definition order!
     * @param valueRep The value representation object
     */
    DatepickerBase.prototype._format = function (valueRep) {
      var s = this.s;
      var ret = [];
      if (!s) {
        return '';
      }
      if (s.select === 'date') {
        var vRep = valueRep.date;
        for (var i in vRep) {
          if (vRep[i] !== UNDEFINED && vRep[i] !== null) {
            ret.push(formatDate(this._valueFormat, vRep[i], s));
          }
        }
        return s.selectMultiple ? ret.join(', ') : ret[0];
      } else {
        // range selection
        if (valueRep.start) {
          ret.push(formatDate(this._valueFormat, createDate(s, valueRep.start), s));
        }
        if (valueRep.end) {
          if (!ret.length) {
            // only end date is selected
            ret.push('');
          }
          var end = createDate(s, valueRep.end - (s.exclusiveEndDates && !this._hasTime ? 1 : 0));
          ret.push(formatDate(this._valueFormat, end, s));
        }
        this._tempStartText = ret[0] || '';
        this._tempEndText = ret[1] || '';
        return ret.join(RANGE_SEPARATOR);
      }
    };
    // tslint:disable-next-line: variable-name
    DatepickerBase.prototype._parse = function (value, fromInput) {
      var s = this.s;
      var ret = {};
      var isRange = s.select !== 'date';
      var isMultiple = s.selectMultiple;
      var values = [];
      if (isEmpty(value)) {
        var def = s.defaultSelection;
        value =
          isMultiple || isRange
            ? // Range & multiple select
              def
            : // Single selection, only allow explicit null, otherwise default to now
            // Also in live mode when, the value is empty, we parse to NULL, and pass the defaultSelection
            // to the inner controls, so they make the decision on what to show to the user.
            // Otherwise the current value can't be set by clicking on it.
            // def === null || !this._hasCalendar || (this._live && s.display !== 'inline') ? null : (def || new Date());
            def === null || (this._live && s.display !== 'inline')
            ? null
            : def || new Date();
      }
      if (isString(value) && (isRange || isMultiple)) {
        values = value.split(isRange ? RANGE_SEPARATOR : ',');
      } else if (isArray(value)) {
        values = value;
      } else if (value && !isArray(value)) {
        values = [value];
      }
      if (isRange) {
        var start = values[0],
          end = values[1];
        var startDate = makeDate(start, s, this._valueFormat, this._iso);
        var endDate = makeDate(end, s, this._valueFormat, this._iso);
        ret.start = startDate ? +startDate : UNDEFINED;
        ret.end = endDate ? +endDate : UNDEFINED;
      } else {
        ret.date = {};
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
          var val = values_1[_i];
          if (!isEmpty(val)) {
            var date = makeDate(val, s, this._valueFormat, this._iso, fromInput);
            if (date) {
              if (fromInput) {
                date = addTimezone(s, date);
              }
              var key = +getDateOnly(date); // we need this for ranges that are less or equal to one day
              ret.date[key] = date;
              if (this._hasTime) {
                this._selectedTime = new Date(date);
              }
            }
          }
        }
      }
      return ret;
    };
    DatepickerBase.prototype._getDate = function (value) {
      var s = this.s;
      var isRange = s.select !== 'date';
      // range picker
      if (isRange) {
        var start = value.start ? createDate(s, value.start) : null;
        var end = value.end ? createDate(s, value.end) : null;
        if (!start && !end) {
          return [];
        }
        return [start, end];
      }
      // multi-select date
      if (s.selectMultiple) {
        var valueArray = [];
        var dates = value.date;
        if (dates) {
          for (var _i = 0, _a = Object.keys(dates); _i < _a.length; _i++) {
            var v = _a[_i];
            valueArray.push(createDate(s, +v));
          }
        }
        return valueArray;
      }
      // single-select date
      var valueKeys = Object.keys(value.date || {});
      if (!valueKeys.length) {
        return null;
      }
      return createDate(s, value.date[valueKeys[0]]);
    };
    /**
     * Returns the value from the value representation
     * NOTE: In the case of the range, if the start date is selected only, the end will be null
     * @param value The value representation for the datepicker
     */
    DatepickerBase.prototype._get = function (value) {
      var _this = this;
      var s = this.s;
      var valueFormat = this._valueFormat;
      var isoParts = this._iso;
      var valueDate = this._getDate(value);
      if (isArray(valueDate)) {
        return valueDate.map(function (date) {
          return date ? returnDate(date, s, valueFormat, isoParts, _this._hasTime) : null;
        });
      } else if (valueDate === null) {
        return null;
      } else {
        return returnDate(valueDate, s, valueFormat, isoParts, this._hasTime);
      }
    };
    DatepickerBase.prototype._onClosed = function () {
      this._active = this._activeSelect = UNDEFINED;
      // if there's a timegrid, we should also clear the time part of the selection
      if (this._hasTimegrid) {
        this._selectedTime = UNDEFINED;
      }
    };
    DatepickerBase.prototype._onOpen = function () {
      this._newSelection = true; // used by the range selection only
    };
    DatepickerBase.prototype._resetInputs = function () {
      if (this._resetStartInput) {
        this._resetStartInput();
        this._resetStartInput = UNDEFINED;
      }
      if (this._resetEndInput) {
        this._resetEndInput();
        this._resetEndInput = UNDEFINED;
      }
    };
    /** The formatted end value in the case of the range picker */
    DatepickerBase.prototype._getValueText = function (input) {
      return this._valueText.split(RANGE_SEPARATOR)[input === 'start' ? 0 : 1] || '';
    };
    /**
     * Checks if the temp selection is NOT ready yet for set
     * In the case of the range picker the selection is not ready when
     *  - no value is selected OR
     *  - only one value is selected and the labels are shown
     *    if the labels are not shown, we allow the selection in the case of date control or the calendar together with
     *    time - there's no way to switch to second value otherwise
     */
    DatepickerBase.prototype._selectionNotReady = function () {
      var notReady = false;
      if (this.s.select === 'range') {
        var val = (this._get(this._tempValueRep || {}) || []).filter(function (v) {
          return v;
        }); // filter out null/undefined
        notReady = !val.length; // no value selected
        if (!notReady) {
          if (this._hasCalendar && !this._hasTime) {
            notReady = val.length < 2; // using the calendar - both values have to be selected
          } else {
            if (this._renderControls) {
              // start/end selection labels shown - both values have to be selected
              notReady = val.length < 2;
            } else {
              // start/end selection labels hidden - we let only one value to be selected if it's the active selection
              notReady = !this._tempValueRep[this._activeSelect];
            }
          }
        }
      }
      return notReady;
    };
    /** Sets the _activeSelect property and triggers the 'onActiveDateChange' event if the active select changed */
    DatepickerBase.prototype._setActiveSelect = function (active, timeout) {
      var _this = this;
      if (this._activeSelect !== active) {
        if (timeout) {
          // TODO: What if we always do it with timeout?
          setTimeout(function () {
            return _this._hook('onActiveDateChange', { active: active });
          });
        } else {
          this._hook('onActiveDateChange', { active: active });
        }
      }
      this._activeSelect = active;
    };
    /** @hidden */
    DatepickerBase.defaults = __assign({}, dateTimeLocale, PickerBase.defaults, {
      activeElm: '.mbsc-calendar-cell[tabindex="0"]',
      controls: CALENDAR_CTRL,
      dateText: 'Date',
      inRangeInvalid: false,
      inputTyping: true,
      rangeEndHelp: 'Please select',
      rangeEndLabel: 'End',
      rangeHighlight: true,
      rangeStartHelp: 'Please select',
      rangeStartLabel: 'Start',
      select: 'date',
      selectSize: 7,
      selectedText: '{count} selected',
      showOnClick: true,
      // showOnFocus: true,
      timeText: 'Time'
    });
    // tslint:disable variable-name
    DatepickerBase._name = 'Datepicker';
    return DatepickerBase;
  })(PickerBase);

  // tslint:disable max-line-length
  var cloudUpload =
    '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>';

  var resizeObservable = new Observable();
  var resizeSubscribers = 0;
  var resizeTimer;
  function onWindowResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resizeObservable.next();
    }, 100);
  }
  function subscribeResize(handler) {
    if (!resizeSubscribers) {
      listen(win, RESIZE, onWindowResize);
    }
    resizeSubscribers++;
    return resizeObservable.subscribe(handler);
  }
  function unsubscribeResize(id) {
    resizeSubscribers--;
    resizeObservable.unsubscribe(id);
    if (!resizeSubscribers) {
      unlisten(win, RESIZE, onWindowResize);
    }
  }
  function checkAutoFill(el) {
    try {
      return matches(el, '*:-webkit-autofill');
    } catch (ex) {
      return false;
    }
  }
  /**
   * @hidden
   */
  var InputBase = /*#__PURE__*/ (function (_super) {
    __extends(InputBase, _super);
    function InputBase() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      _this._tag = 'input';
      // tslint:enable variable-name
      // tslint:disable-next-line: variable-name
      _this._onClick = function () {
        _this._hidePass = !_this._hidePass;
      };
      // tslint:disable-next-line: variable-name
      _this._onMouseDown = function (ev) {
        if (_this.s.tags) {
          _this._preventFocus = true;
        }
      };
      // tslint:disable-next-line: variable-name
      _this._onTagClear = function (ev, index) {
        ev.stopPropagation();
        ev.preventDefault();
        if (!_this.s.disabled) {
          // if the component is disabled, we should change the value
          var value = _this.s.pickerValue.slice();
          value.splice(index, 1);
          // Trigger change and pass the new value in event detail
          trigger(_this._el, CHANGE, value);
        }
      };
      // tslint:disable-next-line: variable-name
      _this._sizeTextArea = function () {
        var input = _this._el;
        var rowNr = _this.s.rows;
        var lineHeight = 24;
        var height;
        var lineNr;
        var line;
        if (input.offsetHeight) {
          input.style.height = '';
          line = input.scrollHeight - input.offsetHeight;
          height = input.offsetHeight + (line > 0 ? line : 0);
          lineNr = Math.round(height / lineHeight);
          if (lineNr > rowNr) {
            height = lineHeight * rowNr + (height - lineNr * lineHeight);
            input.style.overflow = 'auto';
          } else {
            input.style.overflow = '';
          }
          if (height) {
            input.style.height = height + 'px';
          }
        }
      };
      // tslint:disable-next-line: variable-name
      _this._onAutoFill = function () {
        if (_this.s.labelStyle === 'floating' && checkAutoFill(_this._el)) {
          _this.setState({ isFloatingActive: true });
        }
      };
      return _this;
    }
    InputBase.prototype._checkFloating = function () {
      var _this = this;
      var el = this._el;
      var s = this.s;
      var isAutoFill = checkAutoFill(el);
      var isFloatingActive = this.state.hasFocus || isAutoFill || !isEmpty(this.value);
      if (el && s.labelStyle === 'floating') {
        if (this._tag === 'select') {
          var select = el;
          var firstOption = select.options[0];
          isFloatingActive = !!(
            isFloatingActive ||
            select.multiple ||
            select.value ||
            (select.selectedIndex > -1 && firstOption && firstOption.label)
          );
        } else if (this.value === UNDEFINED) {
          var input = el;
          isFloatingActive = !!(isFloatingActive || input.value);
        }
        this._valueChecked = true;
        ngSetTimeout(this, function () {
          _this.setState({ isFloatingActive: isFloatingActive });
        });
      }
    };
    InputBase.prototype._mounted = function () {
      var _this = this;
      var s = this.s;
      var input = this._el;
      // In case of autofill in webkit browsers the animationstart event will fire
      // due to the empty animation added in the css,
      // because there's no other event in case of the initial autofill
      listen(input, ANIMATION_START, this._onAutoFill);
      if (this._tag === 'textarea') {
        listen(input, INPUT, this._sizeTextArea);
        this._unsubscribe = subscribeResize(this._sizeTextArea);
      }
      this._unlisten = gestureListener(input, {
        keepFocus: true,
        // click: true, // TODO: handle 300ms delay
        onBlur: function () {
          _this.setState({
            hasFocus: false,
            isFloatingActive: !!input.value
          });
        },
        onChange: function (ev) {
          // this._hook('onChange', ev);
          if (s.type === 'file') {
            // Copy value on file upload
            var files = ev.target.files;
            var names = [];
            for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
              var file = files_1[_i];
              names.push(file.name);
            }
            _this.setState({ files: names.join(', ') });
          }
          // TODO: we check defaultValue here not to be UNDEFINED, because the picker uses the defaultValue instead of value
          if (s.tags && s.value === UNDEFINED && s.defaultValue === UNDEFINED) {
            _this.setState({ value: ev.target.value });
          }
          _this._checkFloating();
          _this._emit('onChange', ev);
        },
        onFocus: function () {
          if (!_this._preventFocus) {
            _this.setState({
              hasFocus: true,
              isFloatingActive: true
            });
          }
          _this._preventFocus = false;
        },
        onHoverIn: function () {
          if (!_this._disabled) {
            _this.setState({ hasHover: true });
          }
        },
        onHoverOut: function () {
          _this.setState({ hasHover: false });
        }
      });
    };
    InputBase.prototype._render = function (s, state) {
      var hasEndIcon = !!(s.endIconSvg || s.endIcon);
      var pickerValue = s.pickerValue;
      var hasStartIcon = !!(s.startIconSvg || s.startIcon);
      var hasLabel = s.label !== UNDEFINED || s.hasChildren;
      var hasError = s.error;
      var iconStartPosition = s.rtl ? 'right' : 'left';
      var iconEndPosition = s.rtl ? 'left' : 'right';
      var inputType = s.inputStyle;
      var labelType = s.labelStyle;
      var isFloating = labelType === 'floating';
      var isFloatingActive = !!(isFloating && hasLabel && (state.isFloatingActive || !isEmpty(s.value)));
      var disabled = s.disabled === UNDEFINED ? state.disabled : s.disabled;
      var prevS = this._prevS;
      var value = s.value !== UNDEFINED ? s.value : state.value !== UNDEFINED ? state.value : s.defaultValue;
      var commonClasses =
        this._theme +
        this._rtl +
        (hasError ? ' mbsc-error' : '') +
        (disabled ? ' mbsc-disabled' : '') +
        (state.hasHover ? ' mbsc-hover' : '') +
        (state.hasFocus && !disabled ? ' mbsc-focus' : '');
      if (s.type === 'file' && !hasEndIcon) {
        s.endIconSvg = cloudUpload;
        hasEndIcon = true;
      }
      if (s.tags) {
        if (isEmpty(pickerValue)) {
          pickerValue = [];
        }
        if (!isArray(pickerValue)) {
          pickerValue = [pickerValue];
        }
        this._tagsArray = s.pickerMap
          ? pickerValue.map(function (val) {
              return s.pickerMap.get(val);
            })
          : isEmpty(value)
          ? []
          : value.split(', ');
      }
      if (s.passwordToggle) {
        hasEndIcon = true;
        this._passIconClass =
          commonClasses +
          ' mbsc-toggle-icon' +
          (' mbsc-textfield-icon mbsc-textfield-icon-' + inputType + ' mbsc-textfield-icon-' + iconEndPosition) +
          (' mbsc-textfield-icon-' + inputType + '-' + iconEndPosition) +
          (hasLabel ? ' mbsc-textfield-icon-' + labelType : '');
        this._hidePass = this._hidePass === UNDEFINED ? s.type === 'password' : this._hidePass;
      }
      this._hasStartIcon = hasStartIcon;
      this._hasEndIcon = hasEndIcon;
      this._hasError = hasError;
      this._disabled = disabled;
      // Outer element classes
      this._cssClass =
        this._className +
        this._hb +
        commonClasses +
        ' mbsc-form-control-wrapper mbsc-textfield-wrapper mbsc-font' +
        (' mbsc-textfield-wrapper-' + inputType) +
        (disabled ? ' mbsc-disabled' : '') +
        (hasLabel ? ' mbsc-textfield-wrapper-' + labelType : '') +
        (hasStartIcon ? ' mbsc-textfield-wrapper-has-icon-' + iconStartPosition + ' ' : '') +
        (hasEndIcon ? ' mbsc-textfield-wrapper-has-icon-' + iconEndPosition + ' ' : '');
      // Label classes
      if (hasLabel) {
        this._labelClass =
          commonClasses +
          (' mbsc-label mbsc-label-' + labelType + ' mbsc-label-' + inputType + '-' + labelType) +
          (hasStartIcon ? ' mbsc-label-' + inputType + '-' + labelType + '-has-icon-' + iconStartPosition + ' ' : '') +
          (hasEndIcon ? ' mbsc-label-' + inputType + '-' + labelType + '-has-icon-' + iconEndPosition + ' ' : '') +
          (isFloating && this._animateFloating ? ' mbsc-label-floating-animate' : '') +
          (isFloatingActive ? ' mbsc-label-floating-active' : '');
      }
      // Inner element classes
      this._innerClass =
        commonClasses +
        (' mbsc-textfield-inner mbsc-textfield-inner-' + inputType) +
        (hasLabel ? ' mbsc-textfield-inner-' + labelType : '');
      // Icon classes
      if (hasStartIcon) {
        this._startIconClass =
          commonClasses +
          (' mbsc-textfield-icon mbsc-textfield-icon-' + inputType + ' mbsc-textfield-icon-' + iconStartPosition) +
          (' mbsc-textfield-icon-' + inputType + '-' + iconStartPosition) +
          (hasLabel ? ' mbsc-textfield-icon-' + labelType : '');
      }
      if (hasEndIcon) {
        this._endIconClass =
          commonClasses +
          (' mbsc-textfield-icon mbsc-textfield-icon-' + inputType + ' mbsc-textfield-icon-' + iconEndPosition) +
          (' mbsc-textfield-icon-' + inputType + '-' + iconEndPosition) +
          (hasLabel ? ' mbsc-textfield-icon-' + labelType : '');
      }
      // Native element classes
      this._nativeElmClass =
        commonClasses +
        ' ' +
        (s.inputClass || '') +
        (' mbsc-textfield mbsc-textfield-' + inputType) +
        (s.dropdown ? ' mbsc-select' : '') +
        (hasLabel ? ' mbsc-textfield-' + labelType + ' mbsc-textfield-' + inputType + '-' + labelType : '') +
        (isFloatingActive ? ' mbsc-textfield-floating-active' : '') +
        (hasStartIcon
          ? ' mbsc-textfield-has-icon-' +
            iconStartPosition +
            ' mbsc-textfield-' +
            inputType +
            '-has-icon-' +
            iconStartPosition +
            (hasLabel ? ' mbsc-textfield-' + inputType + '-' + labelType + '-has-icon-' + iconStartPosition : '')
          : '') +
        (hasEndIcon
          ? ' mbsc-textfield-has-icon-' +
            iconEndPosition +
            ' mbsc-textfield-' +
            inputType +
            '-has-icon-' +
            iconEndPosition +
            (hasLabel ? ' mbsc-textfield-' + inputType + '-' + labelType + '-has-icon-' + iconEndPosition : '')
          : '');
      // Select
      if (this._tag === 'select' || s.dropdown) {
        this._selectIconClass =
          'mbsc-select-icon mbsc-select-icon-' +
          inputType +
          this._rtl +
          this._theme +
          (hasLabel ? ' mbsc-select-icon-' + labelType : '') +
          (hasStartIcon ? ' mbsc-select-icon-' + iconStartPosition : '') +
          (hasEndIcon ? ' mbsc-select-icon-' + iconEndPosition : '');
      }
      // Textarea
      if (this._tag === 'textarea' || s.tags) {
        this._cssClass += ' mbsc-textarea-wrapper';
        this._innerClass += ' mbsc-textarea-inner';
        this._nativeElmClass += ' mbsc-textarea';
        // Update the size of the textarea on certain setting changes
        if (
          this._tag === 'textarea' &&
          (value !== this._prevValue ||
            s.inputStyle !== prevS.inputStyle ||
            s.labelStyle !== prevS.labelStyle ||
            s.rows !== prevS.rows ||
            s.theme !== prevS.theme)
        ) {
          this._shouldSize = true;
        }
        this._prevValue = value;
      }
      if (s.tags) {
        this._innerClass += ' mbsc-textfield-tags-inner';
      }
      if (s.type === 'file') {
        this._dummyElmClass = this._nativeElmClass;
        this._nativeElmClass += ' mbsc-textfield-file';
      }
      // Error message classes
      this._errorClass =
        this._theme +
        this._rtl +
        (' mbsc-error-message mbsc-error-message-' + inputType) +
        (hasLabel ? ' mbsc-error-message-' + labelType : '') +
        (hasStartIcon ? ' mbsc-error-message-has-icon-' + iconStartPosition : '') +
        (hasEndIcon ? ' mbsc-error-message-has-icon-' + iconEndPosition : '');
      if (s.notch && inputType === 'outline') {
        this._fieldSetClass =
          'mbsc-textfield-fieldset' +
          commonClasses +
          (hasStartIcon ? ' mbsc-textfield-fieldset-has-icon-' + iconStartPosition : '') +
          (hasEndIcon ? ' mbsc-textfield-fieldset-has-icon-' + iconEndPosition : '');
        this._legendClass =
          'mbsc-textfield-legend' +
          this._theme +
          (isFloatingActive || (hasLabel && labelType === 'stacked') ? ' mbsc-textfield-legend-active' : '');
      }
      if (s.ripple && s.inputStyle !== 'outline') {
        this._rippleClass =
          'mbsc-textfield-ripple' + this._theme + (hasError ? ' mbsc-error' : '') + (state.hasFocus ? ' mbsc-textfield-ripple-active' : '');
      }
      if (this._valueChecked) {
        this._animateFloating = true;
      }
    };
    InputBase.prototype._updated = function () {
      var _this = this;
      // Update the size of the textarea on certain setting changes
      if (this._shouldSize) {
        this._shouldSize = false;
        ngSetTimeout(this, function () {
          _this._sizeTextArea();
        });
      }
      this._checkFloating();
    };
    InputBase.prototype._destroy = function () {
      unlisten(this._el, ANIMATION_START, this._onAutoFill);
      unlisten(this._el, INPUT, this._sizeTextArea);
      unsubscribeResize(this._unsubscribe);
      this._unlisten();
    };
    // tslint:disable variable-name
    InputBase.defaults = {
      dropdown: false,
      dropdownIcon: arrowDown,
      hideIcon: 'eye-blocked',
      inputStyle: 'underline',
      labelStyle: 'stacked',
      placeholder: '',
      ripple: false,
      rows: 6,
      showIcon: 'eye',
      type: 'text'
    };
    InputBase._name = 'Input';
    return InputBase;
  })(BaseComponent);

  var Input = /*#__PURE__*/ (function (_super) {
    __extends(Input, _super);
    function Input() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    Object.defineProperty(Input.prototype, 'value', {
      get: function () {
        return this._el && this._el.value;
      },
      set: function (value) {
        this._el.value = value;
        this._checkFloating();
        if (this._tag === 'textarea') {
          this._sizeTextArea();
        }
      },
      enumerable: true,
      configurable: true
    });
    Input.prototype._template = function (s, state) {
      var _this = this;
      var _a = this.props,
        children = _a.children,
        dropdown = _a.dropdown;
      _a.dropdownIcon;
      _a.endIcon;
      _a.endIconSrc;
      _a.endIconSvg;
      _a.error;
      var errorMessage = _a.errorMessage,
        hasChildren = _a.hasChildren;
      _a.hideIcon;
      _a.hideIconSvg;
      _a.inputClass;
      _a.inputStyle;
      _a.label;
      _a.labelStyle;
      _a.notch;
      _a.passwordToggle;
      _a.pickerMap;
      _a.pickerValue;
      _a.ripple;
      _a.rows;
      _a.rtl;
      _a.showIcon;
      _a.showIconSvg;
      _a.startIcon;
      _a.startIconSrc;
      _a.startIconSvg;
      var tags = _a.tags;
      _a.theme;
      _a.themeVariant;
      var type = _a.type,
        other = __rest(_a, [
          'children',
          'dropdown',
          'dropdownIcon',
          'endIcon',
          'endIconSrc',
          'endIconSvg',
          'error',
          'errorMessage',
          'hasChildren',
          'hideIcon',
          'hideIconSvg',
          'inputClass',
          'inputStyle',
          'label',
          'labelStyle',
          'notch',
          'passwordToggle',
          'pickerMap',
          'pickerValue',
          'ripple',
          'rows',
          'rtl',
          'showIcon',
          'showIconSvg',
          'startIcon',
          'startIconSrc',
          'startIconSvg',
          'tags',
          'theme',
          'themeVariant',
          'type'
        ]);
      // Need to use props here, otherwise all inherited settings will be included in ...other,
      // which will end up on the native element, resulting in invalid DOM
      var lbl = s.label;
      return createElement(
        'label',
        { className: this._cssClass, onMouseDown: this._onMouseDown },
        (lbl || hasChildren) && createElement('span', { className: this._labelClass }, hasChildren ? '' : lbl),
        createElement(
          'span',
          { className: this._innerClass },
          this._tag === 'input' &&
            createElement(
              'input',
              __assign({}, other, {
                ref: this._setEl,
                className: this._nativeElmClass + (s.tags ? ' mbsc-textfield-hidden' : ''),
                disabled: this._disabled,
                type: s.passwordToggle ? (this._hidePass ? 'password' : 'text') : type
              })
            ),
          type === 'file' &&
            createElement('input', {
              className: this._dummyElmClass,
              disabled: this._disabled,
              placeholder: s.placeholder,
              readOnly: true,
              type: 'text',
              value: state.files || ''
            }),
          this._tag === 'select' &&
            createElement(
              'select',
              __assign({}, other, { ref: this._setEl, className: 'mbsc-select' + this._nativeElmClass, disabled: this._disabled }),
              children
            ),
          this._tag === 'textarea' &&
            createElement('textarea', __assign({}, other, { ref: this._setEl, className: this._nativeElmClass, disabled: this._disabled })),
          tags &&
            createElement(
              'span',
              { className: 'mbsc-textfield-tags' + this._nativeElmClass },
              this._tagsArray.length
                ? this._tagsArray.map(function (v, i) {
                    return (
                      v &&
                      createElement(
                        'span',
                        { key: i, className: 'mbsc-textfield-tag' + _this._theme + _this._rtl },
                        createElement('span', { className: 'mbsc-textfield-tag-text' + _this._theme }, v),
                        createElement(Icon, {
                          className: 'mbsc-textfield-tag-clear',
                          // tslint:disable-next-line: jsx-no-lambda
                          onClick: function (ev) {
                            return _this._onTagClear(ev, i);
                          },
                          svg: s.clearIcon,
                          theme: s.theme
                        })
                      )
                    );
                  })
                : createElement('span', { className: 'mbsc-textfield-tags-placeholder' + this._theme }, s.placeholder)
            ),
          (this._tag === 'select' || dropdown) &&
            createElement(Icon, { className: this._selectIconClass, svg: s.dropdownIcon, theme: s.theme }),
          this._hasStartIcon &&
            createElement(Icon, { className: this._startIconClass, name: s.startIcon, svg: s.startIconSvg, theme: s.theme }),
          this._hasEndIcon &&
            !s.passwordToggle &&
            createElement(Icon, { className: this._endIconClass, name: s.endIcon, svg: s.endIconSvg, theme: s.theme }),
          s.passwordToggle &&
            createElement(Icon, {
              onClick: this._onClick,
              className: this._passIconClass,
              name: this._hidePass ? s.showIcon : s.hideIcon,
              svg: this._hidePass ? s.showIconSvg : s.hideIconSvg,
              theme: s.theme
            }),
          this._hasError && createElement('span', { className: this._errorClass }, errorMessage),
          s.notch &&
            s.inputStyle === 'outline' &&
            createElement(
              'fieldset',
              { 'aria-hidden': 'true', className: this._fieldSetClass },
              createElement('legend', { className: this._legendClass }, lbl && s.labelStyle !== 'inline' ? lbl : '&nbsp;')
            ),
          s.ripple && s.inputStyle !== 'outline' && createElement('span', { className: this._rippleClass })
        )
      );
    };
    return Input;
  })(InputBase);

  function template(inst, s, content) {
    var comp = s.inputComponent;
    var props = __assign(
      { defaultValue: (inst._value && inst._valueText) || '', placeholder: s.placeholder, ref: inst._setInput },
      s.inputProps
    );
    if (!s.inputComponent) {
      comp = Input;
      props = __assign(
        {
          'aria-expanded': !!inst._isOpen,
          'aria-haspopup': 'dialog',
          disabled: s.disabled,
          dropdown: s.dropdown,
          endIcon: s.endIcon,
          endIconSrc: s.endIconSrc,
          endIconSvg: s.endIconSvg,
          error: s.error,
          errorMessage: s.errorMessage,
          inputStyle: s.inputStyle,
          label: s.label,
          labelStyle: s.labelStyle,
          name: s.name,
          pickerMap: s.valueMap,
          pickerValue: inst._value,
          placeholder: s.placeholder,
          rtl: s.rtl,
          startIcon: s.startIcon,
          startIconSrc: s.startIconSrc,
          startIconSvg: s.startIconSvg,
          tags: s.tagInput === UNDEFINED ? s.selectMultiple : s.tagInput,
          theme: s.theme,
          themeVariant: s.themeVariant
        },
        props
      );
    }
    var input = createElement(comp, props);
    return createElement(
      Fragment,
      null,
      inst._showInput && input,
      createElement(
        Popup,
        {
          activeElm: s.activeElm,
          anchor: inst._anchor,
          anchorAlign: inst._anchorAlign,
          animation: s.animation,
          buttons: inst._buttons,
          cancelText: s.cancelText,
          closeOnEsc: s.closeOnEsc,
          closeOnOverlayClick: s.closeOnOverlayClick,
          closeOnScroll: s.closeOnScroll,
          closeText: s.closeText,
          contentPadding: false,
          context: s.context,
          cssClass: inst._cssClass,
          disableLeftRight: true,
          display: s.display,
          focusElm: inst._focusElm,
          focusOnClose: s.focusOnClose,
          focusOnOpen: !inst._allowTyping,
          focusTrap: s.focusTrap,
          fullScreen: s.fullScreen,
          headerText: inst._headerText,
          height: s.height,
          isOpen: inst._isOpen,
          maxHeight: s.maxHeight,
          maxWidth: inst._maxWidth,
          onClose: inst._onPopupClose,
          onClosed: inst._onPopupClosed,
          onKeyDown: inst._onPopupKey,
          onOpen: inst._onPopupOpen,
          onResize: inst._onResize,
          setText: s.setText,
          showArrow: s.showArrow,
          showOverlay: inst._allowTyping ? false : s.showOverlay,
          ref: inst._setPopup,
          rtl: s.rtl,
          scrollLock: inst._scrollLock,
          theme: s.theme,
          themeVariant: s.themeVariant,
          touchUi: inst._touchUi,
          windowWidth: inst.state.width,
          width: s.width
        },
        content
      )
    );
  }

  // TODO handle:
  //  1 headerText count
  /** @hidden */
  var CalendarBase = /*#__PURE__*/ (function (_super) {
    __extends(CalendarBase, _super);
    function CalendarBase() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      /** @hidden */
      _this._navService = new MbscCalendarNavService();
      // tslint:enable variable-name
      /** @hidden */
      // tslint:disable-next-line: variable-name
      _this._onDayClick = function (args) {
        var s = _this.s;
        var date = addTimezone(s, args.date);
        var d = +date;
        if (args.disabled) {
          return;
        }
        // Update tempValueRep with the new selection
        if (s.selectMultiple) {
          var tempValueRep = _this._tempValueRep;
          if (tempValueRep[d]) {
            delete tempValueRep[d];
          } else if (s.selectMax !== UNDEFINED ? Object.keys(tempValueRep).length < s.selectMax : true) {
            tempValueRep[d] = date;
          }
          // Need a new object reference to always re-render the calendarview
          _this._tempValueRep = __assign({}, tempValueRep);
        } else {
          if (!s.selectRange) {
            _this._tempValueRep = {};
          }
          _this._tempValueRep[d] = date;
        }
        _this._navService.preventPageChange = s.selectRange;
        _this._hook('onCellClick', args);
        _this._setOrUpdate();
      };
      /** @hidden */
      // tslint:disable-next-line: variable-name
      _this._onTodayClick = function () {
        var date = new Date();
        var d = +date;
        if (!_this.s.selectRange && !_this.s.selectMultiple) {
          _this._tempValueRep = {};
          _this._tempValueRep[d] = date;
          _this._setOrUpdate();
        }
      };
      /** @hidden */
      // tslint:disable-next-line: variable-name
      _this._onActiveChange = function (args) {
        _this._navService.forcePageChange = args.pageChange;
        _this._hook('onActiveChange', args);
      };
      return _this;
    }
    /** @hidden */
    CalendarBase.prototype._valueEquals = function (v1, v2) {
      return dateValueEquals(v1, v2, this.s);
    };
    CalendarBase.prototype._shouldValidate = function (s, prevS) {
      return s.dataTimezone !== prevS.dataTimezone || s.displayTimezone !== prevS.displayTimezone;
    };
    CalendarBase.prototype._render = function (s, state) {
      _super.prototype._render.call(this, s, state);
      this._navService.options({
        activeDate: s.active,
        calendarType: s.calendarType,
        firstDay: s.firstDay,
        getDate: s.getDate,
        getDay: s.getDay,
        getMonth: s.getMonth,
        getYear: s.getYear,
        max: s.max,
        min: s.min,
        onPageChange: s.onPageChange,
        onPageLoading: s.onPageLoading,
        pages: s.pages,
        refDate: s.refDate,
        showCalendar: true,
        showOuterDays: s.showOuterDays,
        size: s.size,
        weeks: s.weeks
      });
    };
    CalendarBase.prototype._copy = function (value) {
      return __assign({}, value);
    };
    CalendarBase.prototype._format = function (value) {
      var s = this.s;
      var ret = [];
      for (var i in value) {
        if (value[i] !== UNDEFINED && value[i] !== null) {
          ret.push(formatDate(s.dateFormat, new Date(+value[i]), s));
        }
      }
      return s.selectMultiple || s.selectRange ? ret.join(', ') : ret[0];
    };
    CalendarBase.prototype._parse = function (value) {
      var s = this.s;
      var isRange = s.selectRange;
      var ret = {};
      var values = [];
      if (isString(value)) {
        values = value.split(',');
      } else if (isArray(value)) {
        values = value;
      } else if (value && !isArray(value)) {
        values = [value];
      }
      for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var val = values_1[_i];
        if (val !== null) {
          var date = makeDate(val, s, s.dateFormat);
          var key = isRange ? +date : +getDateOnly(date); // we need the time part for the same day ranges ex. [06.30 00:00 - 06.30 23:59]
          ret[key] = date;
        }
      }
      return ret;
    };
    CalendarBase.prototype._get = function (value) {
      var s = this.s;
      var isRange = s.selectRange;
      if (this.s.selectMultiple || isRange) {
        var valueArray = [];
        for (var _i = 0, _a = Object.keys(value); _i < _a.length; _i++) {
          var v = _a[_i];
          valueArray.push(createDate(s, +value[v]));
        }
        return valueArray;
      }
      var valueKeys = Object.keys(value || {});
      if (!valueKeys.length) {
        return null;
      }
      return createDate(s, value[valueKeys[0]]);
    };
    /** @hidden */
    CalendarBase.defaults = __assign({}, calendarViewDefaults, {
      calendarScroll: 'horizontal',
      calendarType: 'month',
      selectedText: '{count} selected',
      showControls: true,
      showOnClick: true,
      weeks: 1
    });
    // tslint:disable variable-name
    CalendarBase._name = 'Calendar';
    return CalendarBase;
  })(PickerBase);

  /**
   * The Calendar component.
   *
   * Usage:
   *
   * ```
   * <Calendar />
   * ```
   */
  var Calendar = /*#__PURE__*/ (function (_super) {
    __extends(Calendar, _super);
    function Calendar() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      // tslint:disable variable-name
      _this._instanceService = new InstanceServiceBase();
      _this._setCal = function (cal) {
        _this._calendarView = cal;
        // this._instanceService.instance = this;
      };
      return _this;
    }
    // tslint:enable variable-name
    Calendar.prototype._template = function (s) {
      return createElement(CalendarView, {
        ref: this._setCal,
        refDate: s.refDate,
        activeDate: s.active,
        amText: s.amText,
        cssClass: this._className + ' mbsc-flex-1-1 mbsc-calendar-' + s.display,
        calendarScroll: s.calendarScroll,
        calendarType: s.calendarType,
        colors: s.colors,
        context: s.context,
        dataTimezone: s.dataTimezone,
        displayTimezone: s.displayTimezone,
        timezonePlugin: s.timezonePlugin,
        downIcon: s.downIcon,
        exclusiveEndDates: s.exclusiveEndDates,
        hoverEnd: s.hoverEnd,
        hoverStart: s.hoverStart,
        invalid: s.invalid,
        instanceService: this._instanceService,
        isPicker: true,
        labels: s.labels,
        marked: s.marked,
        max: s.max,
        min: s.min,
        mousewheel: s.mousewheel,
        navigationService: this._navService,
        nextIconH: s.nextIconH,
        nextIconV: s.nextIconV,
        nextPageText: s.nextPageText,
        noOuterChange: s.selectRange,
        onActiveChange: this._onActiveChange,
        onCellHoverIn: s.onCellHoverIn,
        onCellHoverOut: s.onCellHoverOut,
        onDayClick: this._onDayClick,
        onDayHoverIn: s.onDayHoverIn,
        onDayHoverOut: s.onDayHoverOut,
        onLabelClick: s.onLabelClick,
        onPageChange: s.onPageChange,
        onPageLoaded: s.onPageLoaded,
        onPageLoading: s.onPageLoading,
        onTodayClick: this._onTodayClick,
        pages: s.pages,
        pmText: s.pmText,
        prevIconH: s.prevIconH,
        prevIconV: s.prevIconV,
        prevPageText: s.prevPageText,
        renderDay: s.renderDay,
        renderDayContent: s.renderDayContent,
        renderHeader: s.renderCalendarHeader,
        rangeEnd: s.rangeEnd,
        rangeStart: s.rangeStart,
        rtl: s.rtl,
        selectedDates: this._tempValueRep,
        selectView: s.selectView,
        showCalendar: true,
        showControls: s.showControls,
        showOuterDays: s.showOuterDays,
        showToday: false,
        showWeekNumbers: s.showWeekNumbers,
        size: s.size,
        theme: s.theme,
        themeVariant: s.themeVariant,
        upIcon: s.upIcon,
        valid: s.valid,
        weeks: s.weeks,
        width: s.width,
        // Calendar system
        getDate: s.getDate,
        getDay: s.getDay,
        getMaxDayOfMonth: s.getMaxDayOfMonth,
        getMonth: s.getMonth,
        getWeekNumber: s.getWeekNumber,
        getYear: s.getYear,
        // Localization
        dateFormat: s.dateFormat,
        dayNames: s.dayNames,
        dayNamesMin: s.dayNamesMin,
        dayNamesShort: s.dayNamesShort,
        eventText: s.eventText,
        eventsText: s.eventsText,
        firstDay: s.firstDay,
        fromText: s.fromText,
        monthNames: s.monthNames,
        monthNamesShort: s.monthNamesShort,
        moreEventsPluralText: s.moreEventsPluralText,
        moreEventsText: s.moreEventsText,
        todayText: s.todayText,
        toText: s.toText,
        weekText: s.weekText,
        yearSuffix: s.yearSuffix
      });
    };
    return Calendar;
  })(CalendarBase);

  /** @hidden */
  var WheelBase = /*#__PURE__*/ (function (_super) {
    __extends(WheelBase, _super);
    function WheelBase() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      // tslint:enable variable-name
      // tslint:disable-next-line: variable-name
      _this._onIndexChange = function (args) {
        args.wheel = _this.s.wheel;
        _this._hook('onIndexChange', args);
      };
      // tslint:disable-next-line: variable-name
      _this._onItemClick = function (args) {
        _this._hook('onIndexChange', { click: true, index: args.index, wheel: _this.s.wheel, selected: args.selected });
      };
      // tslint:disable-next-line: variable-name
      _this._onKeyDown = function (ev) {
        var dir = 0;
        if (ev.keyCode === UP_ARROW) {
          dir = -1;
        } else if (ev.keyCode === DOWN_ARROW) {
          dir = 1;
        }
        var s = _this.s;
        var newIndex = s.activeIndex + dir;
        // Only triggerd the hooks if there's a change in the index.
        // Compare using the ! operator, because min and max indexes might be undefined
        var change = !(newIndex < s.minIndex) && !(newIndex > s.maxIndex);
        if (dir) {
          // Prevent content scroll on arrow keys
          ev.preventDefault();
        }
        if (dir && change) {
          var hook = s.selectOnScroll ? 'onIndexChange' : 'onActiveChange';
          _this._shouldFocus = true;
          _this._hook(hook, { diff: dir, index: newIndex, wheel: s.wheel });
        } else if (ev.keyCode === ENTER && s.multiple) {
          _this._hook('onSet', {});
        }
      };
      return _this;
    }
    WheelBase.prototype._getText = function (data) {
      return data !== UNDEFINED ? (data.display !== UNDEFINED ? data.display : data) : UNDEFINED;
    };
    WheelBase.prototype._getValue = function (data) {
      return data ? (data.value !== UNDEFINED ? data.value : data.display !== UNDEFINED ? data.display : data) : data;
    };
    WheelBase.prototype._isActive = function (item, text, is3d) {
      var s = this.s;
      var d3 = s.scroll3d && s.multiple ? is3d : !is3d;
      return s.activeIndex === item.key && text && d3;
    };
    WheelBase.prototype._isSelected = function (item) {
      var s = this.s;
      var selectedValues = s.selectedValues;
      var value = this._getValue(item.data);
      return s.multiple
        ? !!(selectedValues && selectedValues.indexOf) && selectedValues.indexOf(value) >= 0
        : s.selectOnScroll
        ? item.key === s.selectedIndex
        : value !== UNDEFINED && value === selectedValues;
    };
    WheelBase.prototype._isDisabled = function (data) {
      var disabledMap = this.s.disabled;
      var disabledProp = data && data.disabled;
      var value = this._getValue(data);
      return !!(disabledProp || (disabledMap && disabledMap.get(value)));
    };
    WheelBase.prototype._render = function (s) {
      var rows = s.rows;
      var itemHeight = s.itemHeight;
      var key = s.wheel._key;
      var itemHeight3d = round((itemHeight - ((itemHeight * rows) / 2 + 3) * 0.03) / 2) * 2;
      this._items = s.wheel.getItem || s.wheel.data || [];
      this._batchSize3d = round(rows * 1.8);
      this._angle3d = 360 / (this._batchSize3d * 2);
      this._style = {
        height: round((rows * itemHeight * (s.scroll3d ? 1.1 : 1)) / 2) * 2
      };
      this._itemNr = s.wheel.spaceAround ? 1 : rows;
      this._innerStyle = {
        height: (s.scroll3d ? itemHeight3d : s.wheel.spaceAround ? itemHeight : itemHeight * rows) + 'px'
      };
      this._wheelStyle = s.wheelWidth
        ? {
            width: s.wheelWidth[key] || s.wheelWidth
          }
        : {
            maxWidth: isArray(s.maxWheelWidth) ? s.maxWheelWidth[key] : s.maxWheelWidth,
            minWidth: isArray(s.minWheelWidth) ? s.minWheelWidth[key] : s.minWheelWidth
          };
      if (s.scroll3d) {
        this._innerStyle[cssPrefix + 'transform'] = 'translateY(-50%) translateZ(' + ((itemHeight * rows) / 2 + 3) + 'px';
      }
    };
    WheelBase.prototype._updated = function () {
      if (this._shouldFocus) {
        var item_1 = this._el.querySelector('[tabindex="0"]');
        if (item_1) {
          setTimeout(function () {
            item_1.focus();
          });
        }
        this._shouldFocus = false;
      }
    };
    return WheelBase;
  })(BaseComponent);

  /** @hidden */
  var WheelItemBase = /*#__PURE__*/ (function (_super) {
    __extends(WheelItemBase, _super);
    function WheelItemBase() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      // tslint:enable variable-name
      // tslint:disable-next-line: variable-name
      _this._onClick = function () {
        var s = _this.s;
        if (s.text !== UNDEFINED && !s.isGroup) {
          _this._hook('onClick', { index: s.index, selected: s.selected, disabled: s.disabled });
        }
      };
      return _this;
    }
    WheelItemBase.prototype._mounted = function () {
      var _this = this;
      this._unlisten = gestureListener(this._el, {
        click: true,
        keepFocus: false,
        onBlur: function () {
          _this.setState({ hasFocus: false });
        },
        onFocus: function () {
          _this.setState({ hasFocus: true });
        },
        onHoverIn: function () {
          if (_this.s.text !== UNDEFINED) {
            _this.setState({ hasHover: true });
          }
        },
        onHoverOut: function () {
          if (_this.s.text !== UNDEFINED) {
            _this.setState({ hasHover: false });
          }
        },
        onKeyDown: function (ev) {
          if (ev.keyCode === SPACE || (!_this.s.multiple && ev.keyCode === ENTER)) {
            _this._onClick();
          }
        },
        onPress: function () {
          if (_this.s.text !== UNDEFINED) {
            _this.setState({ isActive: true });
          }
        },
        onRelease: function () {
          if (_this.s.text !== UNDEFINED) {
            _this.setState({ isActive: false });
          }
        }
      });
    };
    WheelItemBase.prototype._destroy = function () {
      this._unlisten();
    };
    WheelItemBase.prototype._render = function (s, state) {
      var height = s.height;
      this._cssClass =
        'mbsc-scroller-wheel-' +
        (s.isGroup ? 'header' : 'item') +
        this._theme +
        this._rtl +
        (s.checkmark && !s.isGroup ? ' mbsc-wheel-item-checkmark' : '') +
        (s.is3d ? ' mbsc-scroller-wheel-item-3d' : '') +
        (s.scroll3d && !s.is3d ? ' mbsc-scroller-wheel-item-2d' : '') +
        (s.selected && !s.is3d ? ' mbsc-selected' : '') +
        (s.selected && s.is3d ? ' mbsc-selected-3d' : '') +
        (s.disabled ? ' mbsc-disabled' : '') +
        (s.multiple && !s.isGroup ? ' mbsc-wheel-item-multi' : '') +
        (state.hasHover ? ' mbsc-hover' : '') +
        (state.hasFocus ? ' mbsc-focus' : '') +
        (state.isActive ? ' mbsc-active' : '');
      this._style = {
        height: height,
        lineHeight: height + 'px'
      };
      this._checkmarkClass = this._theme + this._rtl + ' mbsc-wheel-checkmark' + (s.selected ? ' mbsc-selected' : '');
      if (s.is3d) {
        this._transform = 'rotateX(' + (((s.offset - s.index) * s.angle3d) % 360) + 'deg) translateZ(' + (height * s.rows) / 2 + 'px)';
        this._style[cssPrefix + 'transform'] = this._transform;
      }
    };
    return WheelItemBase;
  })(BaseComponent);

  /** @hidden */
  var WheelItem = /*#__PURE__*/ (function (_super) {
    __extends(WheelItem, _super);
    function WheelItem() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    WheelItem.prototype._template = function (s) {
      // html += '<div role="option" aria-selected="' + (checked[value] ? true : false) +
      // '" class="mbsc-sc-itm ' + (is3d ? 'mbsc-sc-itm-3d ' : '') + css + ' ' +
      // (selected ? 'mbsc-sc-itm-sel ' : '') +
      // (checked[value] ? selectedClass : '') +
      // (value === undefined ? ' mbsc-sc-itm-ph' : ' mbsc-btn-e') +
      // (invalid ? ' mbsc-sc-itm-inv-h mbsc-disabled' : '') +
      // (disabled[value] ? ' mbsc-sc-itm-inv mbsc-disabled' : '') +
      // '" data-index="' + i +
      // '" data-val="' + value + '"' +
      // (lbl ? ' aria-label="' + lbl + '"' : '') +
      // (selected ? ' aria-selected="true"' : '') +
      // (lines > 1 ? '<div class="mbsc-sc-itm-ml" style="line-height:' +
      // Math.round(itemHeight / lines) + 'px;font-size:' + Math.round(itemHeight / lines * 0.8) + 'px;">' : '') +
      // text +
      // (lines > 1 ? '</div>' : '') +
      // '</div>';
      var content;
      if (s.renderItem && s.data !== UNDEFINED) {
        var cont = s.renderItem(s.data);
        var contentHtml = isString(cont) ? { __html: cont } : UNDEFINED;
        content = contentHtml ? createElement('div', { dangerouslySetInnerHTML: contentHtml }) : createElement('div', null, cont);
      } else {
        content = s.text;
      }
      return createElement(
        'div',
        {
          'aria-disabled': s.disabled ? 'true' : UNDEFINED,
          'aria-hidden': content === UNDEFINED || s.is3d ? 'true' : UNDEFINED,
          'aria-selected': s.selected ? 'true' : UNDEFINED,
          ref: this._setEl,
          tabIndex: s.active ? 0 : UNDEFINED,
          className: this._cssClass,
          role: 'option',
          style: this._style,
          onClick: this._onClick
        },
        s.checkmark && createElement('span', { className: this._checkmarkClass }),
        content
      );
    };
    return WheelItem;
  })(WheelItemBase);

  /** @hidden */
  var Wheel = /*#__PURE__*/ (function (_super) {
    __extends(Wheel, _super);
    function Wheel() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      _this.renderer = function (item, offset, is3d) {
        var s = _this.s;
        if (item !== UNDEFINED) {
          var text = _this._getText(item.data);
          return createElement(WheelItem, {
            active: _this._isActive(item, text, is3d),
            angle3d: _this._angle3d,
            data: item.data,
            disabled: _this._isDisabled(item.data),
            height: s.itemHeight,
            index: item.key,
            is3d: is3d,
            isGroup: item.data && item.data.isGroup,
            key: item.key,
            multiple: s.multiple,
            onClick: _this._onItemClick,
            offset: offset,
            checkmark: s.wheel.checkmark,
            renderItem: s.renderItem,
            rows: s.rows,
            rtl: s.rtl,
            scroll3d: s.scroll3d,
            selected: _this._isSelected(item),
            text: text,
            theme: s.theme
          });
        }
        return null;
      };
      return _this;
    }
    Wheel.prototype._template = function (s, state) {
      return createElement(
        'div',
        {
          'aria-multiselectable': s.multiple ? 'true' : UNDEFINED,
          className:
            'mbsc-scroller-wheel-wrapper mbsc-scroller-wheel-wrapper-' +
            s.wheel._key +
            ' ' +
            (s.wheel.cssClass || '') +
            (s.scroll3d ? ' mbsc-scroller-wheel-wrapper-3d' : '') +
            this._theme +
            this._rtl,
          onKeyDown: this._onKeyDown,
          ref: this._setEl,
          role: 'listbox',
          style: this._wheelStyle
        },
        createElement(Scrollview, {
          batchSize3d: this._batchSize3d,
          className: 'mbsc-scroller-wheel' + (s.scroll3d ? ' mbsc-scroller-wheel-3d' : '') + this._theme,
          innerClass:
            'mbsc-scroller-wheel-cont mbsc-scroller-wheel-cont-' +
            s.display +
            (s.scroll3d ? ' mbsc-scroller-wheel-cont-3d' : '') +
            (s.multiple ? ' mbsc-scroller-wheel-multi' : '') +
            this._theme,
          innerStyles: this._innerStyle,
          items: this._items,
          itemSize: s.itemHeight,
          itemRenderer: this.renderer,
          itemNr: this._itemNr,
          margin: true,
          maxIndex: s.maxIndex,
          minIndex: s.minIndex,
          onIndexChange: this._onIndexChange,
          offset: s.wheel._offset,
          rtl: s.rtl,
          scroll3d: s.scroll3d,
          scrollBar: !this._touchUi,
          selectedIndex: s.selectedIndex,
          snap: true,
          spaceAround: s.wheel.spaceAround,
          styles: this._style,
          visibleSize: s.rows
        })
      );
    };
    return Wheel;
  })(WheelBase);

  /**
   * Returns the closest valid value on a wheel.
   * @hidden
   * @param wheel The wheel object.
   * @param val The current value.
   * @param direction Direction of the wheel movement.
   * @param disabled Disabled values on the wheel.
   */
  function getValid(wheel, val, disabled, direction) {
    var min = wheel.min === UNDEFINED ? -Infinity : wheel.min;
    var max = wheel.max === UNDEFINED ? Infinity : wheel.max;
    var index = getIndex(wheel, val);
    var value = getValue(wheel, index);
    var value1 = value;
    var value2 = value;
    var dist1 = 0;
    var dist2 = 0;
    if (disabled && disabled.get(value)) {
      while (index - dist1 >= min && disabled.get(value1) && dist1 < 100) {
        dist1++;
        value1 = getValue(wheel, index - dist1);
      }
      while (index + dist2 < max && disabled.get(value2) && dist2 < 100) {
        dist2++;
        value2 = getValue(wheel, index + dist2);
      }
      // If no valid value found, return the invalid value
      if (disabled.get(value1) && disabled.get(value2)) {
        return value;
      }
      if (((dist2 < dist1 && dist2 && direction !== -1) || !dist1 || index - dist1 < 0 || direction === 1) && !disabled.get(value2)) {
        value = value2;
      } else {
        value = value1;
      }
    }
    return value;
  }
  /** @hidden */
  function getItemValue(item) {
    return item !== UNDEFINED ? (item.value !== UNDEFINED ? item.value : item.display !== UNDEFINED ? item.display : item) : item;
  }
  /** @hidden */
  function getItem$1(wheel, index) {
    if (wheel.getItem) {
      return wheel.getItem(index);
    }
    var data = wheel.data || [];
    var len = data.length;
    var i = index % len;
    return wheel._circular ? data[i >= 0 ? i : i + len] : data[constrain(index, 0, len - 1)];
    // if (i >= wheel.min && i <= wheel.max) {
    // }
  }
  /**
   * Returns the index of a value on a wheel
   * In case of Multi-Wheels (when multiselection is available),
   * returns the index of the first selected item
   * @hidden
   * @param wheel
   * @param value
   * @returns Returns the index of the value or the first value in case of multiple values
   */
  function getIndex(wheel, value) {
    var val = wheel.multiple ? (value && value.length && value[0]) || UNDEFINED : value;
    return (wheel.getIndex ? +wheel.getIndex(value) : wheel._map.get(val)) || 0;
  }
  /** @hidden */
  // This function returns the first index when circular data is provided on wheels.
  // Note: when there are circular wheels, the index can go past the data length or below 0.
  // In these cases we take the remainder as the index from the division by data length.
  function getFirstIndex(wheel, index) {
    if (wheel.getItem && wheel.getIndex) {
      return wheel.getIndex(getItemValue(wheel.getItem(index)));
    }
    var data = wheel.data || [];
    var len = data.length;
    var i = index % len;
    return !len ? 0 : i >= 0 ? i : i + len;
  }
  /** @hidden */
  function getValue(wheel, index) {
    return getItemValue(getItem$1(wheel, index));
  }
  /** @hidden */
  var ScrollerBase = /*#__PURE__*/ (function (_super) {
    __extends(ScrollerBase, _super);
    function ScrollerBase() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      /** @hidden */
      _this._indexes = [];
      /** @hidden */
      _this._activeIndexes = [];
      /** @hidden */
      _this._wheels = [];
      _this._batches = [];
      /**
       * Stores the last index that was set when selecting a value
       * Check out the _setIndexes method for more explanations.
       */
      _this._lastIndexes = [];
      _this._onSet = function () {
        _this._setOrUpdate();
      };
      /**
       * Triggered when the active item is changed via keyboard navigation.
       * When the selectOnScroll is true the onWheelIndexChange is triggered instead,
       * because selection also happens.
       */
      _this._onActiveChange = function (_a) {
        var wheel = _a.wheel,
          index = _a.index;
        var wheelIndex = wheel._key;
        _this._activeIndexes[wheelIndex] = index; // set the active index
        // we need to update the current index if the active item is outside of the visible items
        // so the wheel is scrolled down/up to be visible
        var indexes = _this._indexes;
        var currentIndex = indexes[wheelIndex];
        if (_this._scroll3d) {
          currentIndex = index;
        } else if (index - currentIndex >= _this._rows) {
          currentIndex++;
        } else if (index < currentIndex) {
          currentIndex--;
        }
        indexes[wheelIndex] = currentIndex; // update the index
        _this.forceUpdate();
      };
      _this._onWheelIndexChange = function (args) {
        var s = _this.s;
        var wheel = args.wheel;
        var key = wheel._key;
        var isMultiple = wheel.multiple;
        var newValue = getValue(wheel, args.index);
        var disabled = _this._disabled && _this._disabled[key] && _this._disabled[key].get(newValue);
        var lengths = [];
        var selectOnScroll = s.selectOnScroll;
        var updateIndex = selectOnScroll || !args.click;
        if (updateIndex) {
          _this._lastIndexes[key] = _this._indexes[key] = args.index;
          // update batches too
          _this._indexes.forEach(function (val, i) {
            var w = _this._wheelMap[i];
            var len = w.data ? w.data.length : 0;
            _this._batches[i] = len ? floor(val / len) : 0;
            lengths[i] = len;
          });
        }
        _this._activeIndexes[key] = args.index;
        var beforeTempValue = _this._get(_this._tempValueRep);
        var itemTap = !!args.click && !disabled;
        var scrollOrTapSelect = selectOnScroll || itemTap;
        // Update the Temp. Value Representation
        if (isMultiple) {
          if (itemTap) {
            var selectionArr = (_this._tempValueRep[key] || []).slice();
            if (args.selected === false) {
              // add
              selectionArr.push(newValue);
            } else if (args.selected === true) {
              selectionArr.splice(selectionArr.indexOf(newValue), 1);
            }
            _this._tempValueRep[key] = selectionArr;
          }
        } else if (scrollOrTapSelect) {
          _this._tempValueRep[key] = newValue;
        }
        if (s.onWheelMove && args.index !== UNDEFINED) {
          var wheelRep = s.onWheelMove({
            dataItem: getItem$1(wheel, args.index),
            selection: scrollOrTapSelect,
            wheelIndex: key
          });
          if (wheelRep) {
            wheelRep.forEach(function (v, i) {
              if (v !== UNDEFINED) {
                _this._tempValueRep[i] = v;
              }
              if (!scrollOrTapSelect) {
                // there will be no validation in this case down the line, so we need to move the wheel to the new index
                var w = _this._wheelMap[i];
                var newIndex = getIndex(w, v);
                _this._constrainIndex(newIndex, w);
              }
            });
          }
        }
        // Run validation on the tempValue
        if (scrollOrTapSelect) {
          _this._validate(key, args.diff > 0 ? 1 : -1);
        }
        // Update wheel offset with the new validated value
        // _offset is used to compensate for wheel length changes. For example changing the month from March to February
        // will change the days wheel length from 31 to 28-29, which equals 2-3 index difference for each circular batches
        // that are rendered. The index difference is added as the offset, and later used to compensate for this by adding
        // margins to the wheel (in the ScrollView).
        if (selectOnScroll) {
          _this._tempValueRep.forEach(function (val, i) {
            var w = _this._wheelMap[i];
            var len = w.data ? w.data.length : 0;
            var oldIndex = _this._indexes[i];
            var newIndex = getIndex(w, val) + _this._batches[i] * len;
            _this._activeIndexes[i] = _this._lastIndexes[i] = _this._indexes[i] = newIndex;
            w._offset = len !== lengths[i] ? newIndex - oldIndex : 0;
          });
        }
        // Update underlying components or set the new value
        var currentTempValue = _this._get(_this._tempValueRep);
        var tempValueChanged = !_this._valueEquals(beforeTempValue, currentTempValue);
        if (tempValueChanged || (args.click && _this._live && !_this._valueEquals(_this.value, currentTempValue))) {
          // If the temp value changed, or in live mode we clicked the selected item
          _this._setOrUpdate(!tempValueChanged);
        } else {
          // In the case of tap select (multi select, and single select desktop mode) when we spin the wheel,
          // or the temp value did not change, we need to propagate down the new index.
          _this.forceUpdate();
        }
        if (_this._live && itemTap && wheel.closeOnTap) {
          _this.close();
        }
      };
      return _this;
    }
    ScrollerBase.prototype._initWheels = function () {
      var _this = this;
      var key = 0;
      var wheels = this.s.wheels || [];
      this._wheelMap = [];
      wheels.forEach(function (wheelGroup) {
        wheelGroup.forEach(function (wheel) {
          _this._initWheel(wheel, key);
          _this._wheelMap[key] = wheel;
          key++;
        });
      });
      this._wheels = wheels;
    };
    ScrollerBase.prototype._shouldValidate = function (s, prevS) {
      // TODO: wheel check is moved to the datetime currently, but it should be checked here
      // We removed it, because select filtering changes the wheel, but re-validation of the value should not happen in this case.
      // A possible solution would be that the select only changes the wheel data only, but in this case we need to force the
      // re-render of the scroller somehow
      // const superValidate = s.shouldValidate ? s.shouldValidate(s, prevS) : false;
      // return superValidate || s.wheels !== prevS.wheels;
      return s.shouldValidate ? s.shouldValidate(s, prevS) : false;
    };
    ScrollerBase.prototype._valueEquals = function (v1, v2) {
      if (this.s.valueEquality) {
        return this.s.valueEquality(v1, v2);
      }
      return v1 === v2;
    };
    // tslint:enable variable-name
    ScrollerBase.prototype._render = function (s, state) {
      var _this = this;
      var props = this.props || {};
      var resp = this._respProps || {};
      var prevS = this._prevS;
      var circular = this._touchUi ? s.circular : false;
      var rows = this._touchUi ? s.rows : resp.rows || props.rows || 7;
      this._displayStyle = s.displayStyle || s.display;
      this._scroll3d = s.scroll3d && this._touchUi && has3d;
      // this._nullSupport = this._displayStyle !== 'inline';
      if (s.itemHeight !== prevS.itemHeight || rows !== this._rows) {
        this._rows = rows;
        this._lineStyle = {
          height: s.itemHeight + 'px'
        };
        if (this._scroll3d) {
          var translateZ = 'translateZ(' + ((s.itemHeight * rows) / 2 + 3) + 'px';
          this._overlayStyle = {};
          this._overlayStyle[cssPrefix + 'transform'] = translateZ;
          this._lineStyle[cssPrefix + 'transform'] = 'translateY(-50%) ' + translateZ;
        }
      }
      if (s.wheels !== prevS.wheels || circular !== this._circular) {
        this._batches = [];
        this._shouldSetIndex = true;
        this._circular = circular;
        this._initWheels();
      }
      _super.prototype._render.call(this, s, state);
      if (this._shouldSetIndex) {
        this._setIndexes();
        this._shouldSetIndex = this._indexFromValue = false;
      }
      if (s.wheels !== prevS.wheels && prevS.wheels !== UNDEFINED) {
        // Trigger wheel index change if wheels changed dynamically,
        // this will validate the values on each wheel
        // TODO: we need a better solution here, maybe this should be triggered from the wheel/scrollview somehow
        setTimeout(function () {
          for (var _i = 0, _a = _this._wheelMap; _i < _a.length; _i++) {
            var wheel = _a[_i];
            _this._onWheelIndexChange({
              diff: 0,
              index: _this._indexes[wheel._key],
              wheel: wheel
            });
          }
        });
      }
    };
    ScrollerBase.prototype._writeValue = function (elm, text, value) {
      if (this.s.writeValue) {
        return this.s.writeValue(elm, text, value);
      }
      return _super.prototype._writeValue.call(this, elm, text, value);
    };
    // tslint:disable variable-name
    ScrollerBase.prototype._copy = function (value) {
      return value.slice(0);
    };
    ScrollerBase.prototype._format = function (value) {
      if (this.s.formatValue) {
        return this.s.formatValue(value);
      }
      return value.join(' ');
    };
    ScrollerBase.prototype._get = function (value) {
      if (this.s.getValue) {
        return this.s.getValue(value);
      }
      return value;
    };
    ScrollerBase.prototype._parse = function (valueStr) {
      if (this.s.parseValue) {
        return this.s.parseValue(valueStr);
      }
      var ret = [];
      var values = [];
      var i = 0;
      if (valueStr !== null && valueStr !== UNDEFINED) {
        values = (valueStr + '').split(' ');
      }
      this._wheels.forEach(function (wheelGroup) {
        wheelGroup.forEach(function (wheel) {
          var data = wheel.data || [];
          var len = data.length;
          // Default to first wheel value if not found
          var value = getItemValue(data[0]);
          var j = 0;
          // Don't do strict comparison, because the parsed value is always string,
          // but the wheel value can be number as well
          /* eslint-disable eqeqeq */
          // tslint:disable-next-line: triple-equals
          while (value != values[i] && j < len) {
            value = getItemValue(data[j]);
            j++;
          }
          /* eslint-enable eqeqeq */
          ret.push(value);
          i++;
        });
      });
      return ret;
    };
    /**
     * Does the validation
     * @param index Index of the wheel
     * @param direction Direction the wheel was moved
     */
    ScrollerBase.prototype._validate = function (index, direction) {
      var _this = this;
      if (this.s.validate) {
        var ret = this.s.validate.call(this._el, {
          direction: direction,
          index: index,
          values: this._tempValueRep.slice(0),
          wheels: this._wheelMap
        });
        this._disabled = ret.disabled;
        if (ret.init) {
          this._initWheels();
        }
        if (ret.indexes) {
          ret.indexes.forEach(function (value, i) {
            if (value !== UNDEFINED) {
              var w = _this._wheelMap[i];
              var newIndex = getIndex(w, value);
              _this._constrainIndex(newIndex, w);
            }
          });
        }
        if (ret.valid) {
          this._tempValueRep = ret.valid.slice(0);
        } else {
          this._wheelMap.forEach(function (wheel, i) {
            _this._tempValueRep[i] = getValid(wheel, _this._tempValueRep[i], _this._disabled && _this._disabled[i], direction);
          });
        }
      }
    };
    ScrollerBase.prototype._onOpen = function () {
      this._batches = [];
      this._shouldSetIndex = true;
      this._indexFromValue = true;
    };
    ScrollerBase.prototype._onParse = function () {
      this._shouldSetIndex = true;
    };
    // tslint:enable variable-name
    ScrollerBase.prototype._initWheel = function (wheel, key) {
      var circular = this._circular;
      wheel._key = key;
      wheel._map = new Map();
      wheel._circular =
        circular === UNDEFINED
          ? wheel.circular === UNDEFINED
            ? wheel.data && wheel.data.length > this._rows
            : wheel.circular
          : isArray(circular)
          ? circular[key]
          : circular;
      if (wheel.data) {
        wheel.min = wheel._circular ? UNDEFINED : 0;
        wheel.max = wheel._circular ? UNDEFINED : wheel.data.length - 1;
        // Map keys to index
        wheel.data.forEach(function (item, i) {
          wheel._map.set(getItemValue(item), i);
        });
      }
    };
    /** Indexes must be set in two occasions:
     * 1. When the picker is opened
     * 2. When the wheels are changed (ex. select filtering)
     *
     * The new index can come from the value (when opening the scroller), or from the currently scrolled to item
     */
    ScrollerBase.prototype._setIndexes = function () {
      var _this = this;
      var currentIndexes = this._indexes || [];
      this._indexes = [];
      this._activeIndexes = [];
      this._tempValueRep.forEach(function (val, i) {
        var w = _this._wheelMap[i];
        var len = w.data ? w.data.length : 0;
        var newIndex = getIndex(w, val);
        if (_this.s.selectOnScroll) {
          _this._activeIndexes[i] = _this._indexes[i] = newIndex + (_this._batches[i] || 0) * len;
        } else {
          var currentIndex = newIndex; // comes from the selected value
          if (!_this._indexFromValue) {
            // comes from the currently "scrolled to item"
            currentIndex = currentIndexes[i];
            if (currentIndex !== UNDEFINED) {
              currentIndex = getFirstIndex(w, currentIndex) + (_this._batches[i] || 0) * len;
            }
          }
          // the current index is the index of the topmost visible item on the scroller, but the selected item can be under that.
          // So if the currentIndex comes from the selected value, the currentIndex can turn up greater than the topmost item's
          // index. So we need to constrain the currentIndex in this case, otherwise at the end of the list, there will be an
          // empty space
          _this._constrainIndex(currentIndex, w);
        }
      });
    };
    /**
     * The newIndex is the index of the topmost visible item on the scroller, but the selected item can be under that.
     * So if the newIndex comes from the selected value, the newIndex can turn up greater than the topmost item's
     * index. So we need to constrain the newIndex in this case, otherwise at the end of the list, there will be an
     * empty space
     * @param newIndex
     * @param wheel
     */
    ScrollerBase.prototype._constrainIndex = function (newIndex, wheel) {
      var i = wheel._key;
      if (newIndex !== UNDEFINED && wheel.data) {
        // constrain so we don't get an empty space at the end of the list
        if (!wheel.spaceAround) {
          // the index needs to be constraine only in case of desktop styling
          newIndex = constrain(newIndex, 0, Math.max(wheel.data.length - this._rows, 0));
        }
        this._activeIndexes[i] = this._indexes[i] = newIndex;
      } else {
        this._activeIndexes[i] = this._indexes[i] = this._lastIndexes[i] || 0; // we use the last available index or default to zero
      }
    };
    /** @hidden */
    ScrollerBase.defaults = {
      itemHeight: 40,
      rows: 5,
      selectOnScroll: true,
      showOnClick: true
    };
    // tslint:disable variable-name
    ScrollerBase._name = 'Scroller';
    return ScrollerBase;
  })(PickerBase);

  /**
   * The Scroller component.
   *
   * Usage:
   *
   * ```
   * <Scroller />
   * ```
   */
  var Scroller = /*#__PURE__*/ (function (_super) {
    __extends(Scroller, _super);
    function Scroller() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    Scroller.prototype._template = function (s) {
      var _this = this;
      var preContent = s.renderPreContent ? s.renderPreContent(s.preContentData) : '';
      var inContent = s.renderInContent ? s.renderInContent(s.preContentData) : '';
      var content = createElement(
        Fragment,
        null,
        preContent,
        createElement(
          'div',
          {
            className:
              'mbsc-scroller mbsc-scroller-' +
              this._displayStyle +
              this._theme +
              this._rtl +
              (this._touchUi ? ' mbsc-scroller-touch' : ' mbsc-scroller-pointer') +
              (s.display === 'inline' ? ' mbsc-font ' : ' ') +
              this._className
          },
          inContent,
          this._wheels.map(function (wheelGroup, i) {
            return createElement(
              'div',
              {
                key: i,
                className: 'mbsc-scroller-wheel-group-cont' + (s.scroll3d ? ' mbsc-scroller-wheel-group-cont-3d' : '') + _this._theme
              },
              s.selectOnScroll && createElement('div', { className: 'mbsc-scroller-wheel-line' + _this._theme, style: _this._lineStyle }),
              createElement(
                'div',
                { className: 'mbsc-scroller-wheel-group' + (s.scroll3d ? ' mbsc-scroller-wheel-group-3d' : '') + _this._theme },
                createElement('div', {
                  className: 'mbsc-scroller-wheel-overlay mbsc-scroller-wheel-overlay-' + _this._displayStyle + _this._theme,
                  style: _this._overlayStyle
                }),
                wheelGroup.map(function (wheel, j) {
                  return createElement(Wheel, {
                    activeIndex: _this._activeIndexes[wheel._key],
                    disabled: _this._disabled && _this._disabled[wheel._key],
                    display: _this._displayStyle,
                    key: j,
                    itemHeight: s.itemHeight,
                    onActiveChange: _this._onActiveChange,
                    onIndexChange: _this._onWheelIndexChange,
                    onSet: _this._onSet,
                    maxIndex: wheel.max,
                    maxWheelWidth: s.maxWheelWidth,
                    minIndex: wheel.min,
                    minWheelWidth: s.minWheelWidth,
                    multiple: wheel.multiple,
                    renderItem: s.renderItem,
                    rows: _this._rows,
                    scroll3d: _this._scroll3d,
                    selectedIndex: _this._indexes[wheel._key],
                    selectedValues: _this._tempValueRep[wheel._key],
                    selectOnScroll: s.selectOnScroll,
                    theme: s.theme,
                    touchUi: s.touchUi,
                    rtl: s.rtl,
                    wheel: wheel,
                    wheelWidth: s.wheelWidth
                  });
                })
              )
            );
          })
        )
      );
      return template(this, s, content);
    };
    return Scroller;
  })(ScrollerBase);

  // tslint:disable no-non-null-assertion
  // tslint:disable directive-class-suffix
  // tslint:disable directive-selector
  var WHEEL_WIDTHS = {
    ios: 50,
    material: 46,
    windows: 50
  };
  var TIME_PARTS = ['a', 'h', 'i', 's', 'tt'];
  function validateTimes(
    s,
    hasAmPm,
    i,
    valid,
    wheelOrder,
    getDatePart,
    maxs,
    steps,
    key,
    disabled,
    order,
    validDate,
    startDate,
    endDate,
    isValid,
    exclusiveEndDates
  ) {
    // Notes:
    // 1. in case of invalid rules that are limited to a single day (start and end is on same day)
    // we take the start and end of the rule
    // 2. in case of invalid rules that span across multple days, we need to take the start of the day
    // or end of the day depending on the current date we are validating ("validated")
    // if we are validating the "end of the rule" (the last date of the rule) - invalids will start at
    // the beginning of the day (bc invalids are coming from prev. day), and span until the end of the rule
    // if we are validating the "start of the rule" (the first date of the rule) - invalids will start at
    // the rule start and will span until the end of the day (bc. the rule spans to the next day...)
    var sameDayInvalid = isSameDay(startDate, endDate);
    var start = sameDayInvalid || !isSameDay(validDate, endDate) ? startDate : getDayStart(s, startDate);
    var end = sameDayInvalid || !isSameDay(validDate, startDate) ? endDate : getDayEnd(s, endDate);
    var startAmPm = getDatePart.a(start);
    var endAmPm = getDatePart.a(end);
    var startProp = true;
    var endProp = true;
    var all = false;
    var add = 0;
    var remove = 0;
    // Look behind to check if the invalid propagates down to the current wheel
    for (var j = 0; j < i; j++) {
      var k = TIME_PARTS[j];
      var validVal = valid[wheelOrder[k]];
      if (validVal !== UNDEFINED) {
        var startVal = startProp ? getDatePart[k](start) : 0;
        var endVal = endProp ? getDatePart[k](end) : maxs[k];
        if (hasAmPm && j === 1) {
          // Adjust hours
          startVal += startAmPm ? 12 : 0;
          endVal += endAmPm ? 12 : 0;
          validVal += valid[wheelOrder.a] ? 12 : 0;
        }
        if ((startProp || endProp) && startVal < validVal && validVal < endVal) {
          all = true;
        }
        if (validVal !== startVal) {
          startProp = false;
        }
        if (validVal !== endVal) {
          endProp = false;
        }
      }
    }
    if (!isValid) {
      // Look ahead to see if there are any possible values on lower wheels,
      // if yes, don't disable the start and/or end value of the range.
      for (var j = i + 1; j < 4; j++) {
        var k = TIME_PARTS[j];
        if (wheelOrder[k] !== UNDEFINED) {
          if (getDatePart[k](start) > 0 && startProp) {
            add = steps[key];
          }
          if (getDatePart[k](end) < maxs[k] && endProp) {
            remove = steps[key];
          }
        }
      }
      if (endProp && exclusiveEndDates && !remove) {
        remove = end.getMilliseconds() !== 999 ? steps[key] : 0;
      }
    }
    // Set disabled values
    if (startProp || endProp || all) {
      var startVal = startProp && !all ? getDatePart[key](start) + add : 0;
      var endVal = endProp && !all ? getDatePart[key](end) - remove : maxs[key];
      for (var j = startVal; j <= endVal; j += steps[key]) {
        disabled[order].set(j, !isValid);
      }
    }
  }
  function getDateIndex(d, hasDay) {
    var dt = new Date(d);
    return hasDay
      ? // Number of days since 1970-01-01
        floor(+dt / 8.64e7)
      : // Number of month since 1970-01-01
        dt.getMonth() + 12 * (dt.getFullYear() - 1970);
  }
  function getFullDate(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function getMilliseconds(d) {
    return d.getMilliseconds();
  }
  function getAmPm(d) {
    return d.getHours() > 11 ? 1 : 0;
  }
  /**
   * @hidden
   */
  var DatetimeBase = /*#__PURE__*/ (function (_super) {
    __extends(DatetimeBase, _super);
    function DatetimeBase() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      _this._preset = 'date';
      _this._innerValues = {};
      _this._onChange = function (args) {
        if (_this.s.value === UNDEFINED) {
          _this.setState({ value: args.value });
        }
        _this._hook('onChange', args);
      };
      _this._parseDate = function (value) {
        var s = _this.s;
        if (!value) {
          _this._innerValues = {};
        }
        return _this._getArray(makeDate(value || s.defaultSelection || new Date(), s, _this._format), !!value);
      };
      _this._formatDate = function (values) {
        var d = _this._getDate(values);
        return d ? formatDate(_this._format, d, _this.s) : '';
      };
      _this._getDate = function (values) {
        var s = _this.s;
        var getArrayPart = _this._getArrayPart;
        var wheelOrder = _this._wheelOrder;
        var today = new Date(new Date().setHours(0, 0, 0, 0));
        var d;
        var t;
        if (values === null || values === UNDEFINED) {
          return null;
        }
        if (wheelOrder.dd !== UNDEFINED) {
          var parts = values[wheelOrder.dd].split('-');
          d = new Date(parts[0], parts[1] - 1, parts[2]);
        }
        if (wheelOrder.tt !== UNDEFINED) {
          t = d || today;
          t = new Date(t.getTime() + (values[wheelOrder.tt] % 86400) * 1000);
        }
        var year = getArrayPart(values, 'y', d, today);
        var month = getArrayPart(values, 'm', d, today);
        var day = Math.min(getArrayPart(values, 'd', d, today), s.getMaxDayOfMonth(year, month));
        var hour = getArrayPart(values, 'h', t, today);
        return s.getDate(
          year,
          month,
          day,
          _this._hasAmPm && getArrayPart(values, 'a', t, today) ? hour + 12 : hour,
          getArrayPart(values, 'i', t, today),
          getArrayPart(values, 's', t, today),
          getArrayPart(values, 'u', t, today)
        );
      };
      _this._validate = function (_a) {
        var direction = _a.direction,
          index = _a.index,
          values = _a.values,
          wheels = _a.wheels;
        var disabled = [];
        var s = _this.s;
        var stepHour = s.stepHour;
        var stepMinute = s.stepMinute;
        var stepSecond = s.stepSecond;
        var preset = s.mode || _this._preset;
        var wheelOrder = _this._wheelOrder;
        var getDatePart = _this._getDatePart;
        var maxDate = _this._max;
        var minDate = _this._min;
        var current = addTimezone(s, _this._getDate(values));
        var currYear = s.getYear(current);
        var currMonth = s.getMonth(current);
        var from = s.getDate(currYear, currMonth - 1, 1);
        var until = s.getDate(currYear, currMonth + 2, 1);
        // Map the valids and invalids for prev and next months
        if (index === wheelOrder.y || index === wheelOrder.m || index === wheelOrder.d || index === wheelOrder.dd || index === UNDEFINED) {
          _this._valids = getEventMap(s.valid, from, until, s, true);
          _this._invalids = getEventMap(s.invalid, from, until, s, true);
        }
        var valids = _this._valids;
        var invalids = _this._invalids;
        // Normalize min and max dates for comparing later (set default values where there are no values from wheels)
        // const mind = this._min ? +this._getDate(this._getArray(this._min))! : -Infinity;
        // const maxd = this._max ? +this._getDate(this._getArray(this._max))! : Infinity;
        var mind = minDate ? +minDate : -Infinity;
        var maxd = maxDate ? +maxDate : Infinity;
        // Get the closest valid dates
        var validated = getClosestValidDate(current, s, mind, maxd, invalids, valids, direction);
        var valid = _this._getArray(validated);
        var dayWheel = _this._wheels && _this._wheels[0][wheelOrder.d];
        var y = getDatePart.y(validated);
        var m = getDatePart.m(validated);
        var maxDays = s.getMaxDayOfMonth(y, m);
        // tslint:disable object-literal-sort-keys
        var mins = {
          y: minDate ? minDate.getFullYear() : -Infinity,
          m: 0,
          d: 1,
          h: 0,
          i: 0,
          s: 0,
          a: 0,
          tt: 0
        };
        var maxs = {
          y: maxDate ? maxDate.getFullYear() : Infinity,
          m: 11,
          d: 31,
          h: step(_this._hasAmPm ? 11 : 23, stepHour),
          i: step(59, stepMinute),
          s: step(59, stepSecond),
          a: 1,
          tt: 86400
        };
        var steps = {
          y: 1,
          m: 1,
          d: 1,
          h: stepHour,
          i: stepMinute,
          s: stepSecond,
          a: 1,
          tt: _this._timeStep
        };
        // tslint:enable object-literal-sort-keys
        var init = false;
        var minprop = true;
        var maxprop = true;
        ['dd', 'y', 'm', 'd', 'tt', 'a', 'h', 'i', 's'].forEach(function (key) {
          var min = mins[key];
          var max = maxs[key];
          var val = getDatePart[key](validated);
          var order = wheelOrder[key];
          if (minprop && minDate) {
            min = getDatePart[key](minDate);
          }
          if (maxprop && maxDate) {
            max = getDatePart[key](maxDate);
          }
          if (val < min) {
            val = min;
          }
          if (val > max) {
            val = max;
          }
          // Skip full date, full time, and am/pm wheel (if not present)
          if (key !== 'dd' && key !== 'tt' && !(key === 'a' && order === UNDEFINED)) {
            if (minprop) {
              minprop = val === min;
            }
            if (maxprop) {
              maxprop = val === max;
            }
          }
          if (order !== UNDEFINED) {
            disabled[order] = new Map();
            if (key !== 'y' && key !== 'dd') {
              for (var i = mins[key]; i <= maxs[key]; i += steps[key]) {
                if (i < min || i > max) {
                  disabled[order].set(i, true);
                }
              }
            }
            // Validate dates
            if (key === 'd' && invalids) {
              for (var d in invalids) {
                if (!valids || !valids[d]) {
                  var dd = new Date(d); // d is a string here
                  var yy = s.getYear(dd);
                  var mm = s.getMonth(dd);
                  // If invalid is in the currently displayed month, let's add it
                  if (yy === y && mm === m && isInvalid(s, dd, invalids, valids)) {
                    disabled[order].set(s.getDay(dd), true);
                  }
                }
              }
            }
          }
        });
        // Validate times
        if (/time/i.test(preset)) {
          // TODO: merge overlapping invalids
          var invalidsForDay_1 = invalids && invalids[getDateStr(validated)];
          var validsForDay_1 = valids && valids[getDateStr(validated)];
          TIME_PARTS.forEach(function (key, i) {
            var order = wheelOrder[key];
            if (order !== UNDEFINED) {
              var entries = s.valid ? validsForDay_1 : invalidsForDay_1;
              if (entries) {
                if (s.valid) {
                  // Set everything to invalid
                  for (var j = 0; j <= maxs[key]; j++) {
                    disabled[order].set(j, true);
                  }
                }
                for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                  var entry = entries_1[_i];
                  var start = entry.start;
                  var end = entry.end;
                  if (start && end) {
                    validateTimes(
                      s,
                      _this._hasAmPm,
                      i,
                      valid,
                      wheelOrder,
                      getDatePart,
                      maxs,
                      steps,
                      key,
                      disabled,
                      order,
                      validated,
                      start,
                      end,
                      !!s.valid,
                      s.exclusiveEndDates
                    );
                  }
                }
              }
              // Get valid wheel value
              valid[order] = getValid(wheels[order], getDatePart[key](validated), disabled[order], direction);
            }
          });
        }
        // Regenerate day wheel if number of days in month changes
        // or if day names needs to be regenerated
        var dateDisplay = _this._dateDisplay;
        if (dayWheel && (dayWheel.data.length !== maxDays || /DDD/.test(dateDisplay))) {
          var data = [];
          var dayDisplay = dateDisplay
            .replace(/[my|]/gi, '')
            .replace(/DDDD/, '{dddd}')
            .replace(/DDD/, '{ddd}')
            .replace(/DD/, '{dd}')
            .replace(/D/, '{d}');
          for (var j = 1; j <= maxDays; j++) {
            var weekDay = s.getDate(y, m, j).getDay();
            var dayStr = dayDisplay
              .replace(/{dddd}/, s.dayNames[weekDay])
              .replace(/{ddd}/, s.dayNamesShort[weekDay])
              .replace(/{dd}/, pad(j) + s.daySuffix)
              .replace(/{d}/, j + s.daySuffix);
            data.push({
              display: dayStr,
              value: j
            });
          }
          dayWheel.data = data;
          // Will trigger wheel re-render
          // this._wheels[0][wheelOrder.d] = { ...dayWheel };
          // Will trigger wheel re-init in scroller validation
          init = true;
        }
        return { disabled: disabled, init: init, valid: valid };
      };
      // public _shouldValidate = (s: MbscDatetimeOptions, prevS: MbscDatetimeOptions) => {
      // We're using any types here, since min/max are datetime options, and wheels are scroller options
      // This is a temporary solution, the wheels should be checked by the scroller
      _this._shouldValidate = function (s, prevS) {
        return (
          !!((s.min && +s.min !== +prevS.min) || (s.max && +s.max !== +prevS.max)) ||
          s.wheels !== prevS.wheels ||
          s.dataTimezone !== prevS.dataTimezone ||
          s.displayTimezone !== prevS.displayTimezone
        );
      };
      // tslint:disable variable-name
      _this._getYearValue = function (i) {
        return {
          display: (/yy/i.test(_this._dateDisplay) ? i : (i + '').substr(2, 2)) + _this.s.yearSuffix,
          value: i
        };
      };
      _this._getYearIndex = function (i) {
        return +i;
      };
      _this._getDateIndex = function (i) {
        return getDateIndex(i, _this._hasDay);
      };
      _this._getDateItem = function (i) {
        var s = _this.s;
        var hasDay = _this._hasDay;
        var today = new Date(new Date().setHours(0, 0, 0, 0));
        var d = hasDay ? new Date(i * 8.64e7) : new Date(1970, i, 1);
        if (hasDay) {
          d = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
        }
        return {
          disabled: hasDay && isInvalid(s, d, _this._invalids, _this._valids),
          display: today.getTime() === d.getTime() ? s.todayText : formatDate(_this._dateTemplate, d, s),
          value: getFullDate(d)
        };
      };
      // tslint:disable-next-line: variable-name
      _this._getArrayPart = function (values, part, d, def) {
        var ret;
        if (_this._wheelOrder[part] !== UNDEFINED) {
          ret = +values[_this._wheelOrder[part]];
          if (!isNaN(ret)) {
            return ret;
          }
        }
        if (d) {
          return _this._getDatePart[part](d);
        }
        if (_this._innerValues[part] !== UNDEFINED) {
          return _this._innerValues[part];
        }
        return _this._getDatePart[part](def);
      };
      // tslint:disable-next-line: variable-name
      _this._getHours = function (d) {
        var hour = d.getHours();
        hour = _this._hasAmPm && hour >= 12 ? hour - 12 : hour;
        // TODO: check if min/max needed here
        // return step(hour, this.s.stepHour, minHour, maxHour);
        return step(hour, _this.s.stepHour);
      };
      // tslint:disable-next-line: variable-name
      _this._getMinutes = function (d) {
        // TODO: check if min/max needed here
        // return step(d.getMinutes(), this.s.stepMinute, minMinute, maxMinute);
        return step(d.getMinutes(), _this.s.stepMinute);
      };
      // tslint:disable-next-line: variable-name
      _this._getSeconds = function (d) {
        // TODO: check if min/max needed here
        // return step(d.getSeconds(), this.s.stepSecond, minSecond, maxSecond);
        return step(d.getSeconds(), _this.s.stepSecond);
      };
      // tslint:disable-next-line: variable-name
      _this._getFullTime = function (d) {
        // TODO: check if min/max needed here
        // return step(Math.round((d.getTime() - new Date(d).setHours(0, 0, 0, 0)) / 1000), this._timeStep || 1, 0, 86400);
        return step(round((d.getTime() - new Date(d).setHours(0, 0, 0, 0)) / 1000), _this._timeStep || 1);
      };
      return _this;
    }
    DatetimeBase.prototype.getVal = function () {
      return this._value;
    };
    DatetimeBase.prototype.setVal = function (value) {
      this._value = value;
      this.setState({ value: value });
    };
    DatetimeBase.prototype.position = function () {
      if (this._scroller) {
        this._scroller.position();
      }
    };
    DatetimeBase.prototype.isVisible = function () {
      return this._scroller && this._scroller.isVisible();
    };
    DatetimeBase.prototype._valueEquals = function (v1, v2) {
      return dateValueEquals(v1, v2, this.s);
    };
    // tslint:enable variable-name
    DatetimeBase.prototype._render = function (s, state) {
      var genWheels = false;
      var prevProps = this._prevS;
      var dateFormat = s.dateFormat;
      var timeFormat = s.timeFormat;
      var preset = s.mode || this._preset;
      var format = preset === 'datetime' ? dateFormat + s.separator + timeFormat : preset === 'time' ? timeFormat : dateFormat;
      this._value = s.value === UNDEFINED ? state.value : s.value;
      this._minWheelWidth = s.minWheelWidth || (preset === 'datetime' ? WHEEL_WIDTHS[s.baseTheme || s.theme] : UNDEFINED);
      this._dateWheels = s.dateWheels || (preset === 'datetime' ? s.dateWheelFormat : dateFormat);
      this._dateDisplay = s.dateWheels || s.dateDisplay;
      this._timeWheels = s.timeWheels || timeFormat;
      this._timeDisplay = this._timeWheels;
      this._format = format;
      this._hasAmPm = /h/.test(this._timeDisplay);
      // tslint:disable: object-literal-sort-keys
      this._getDatePart = {
        y: s.getYear,
        m: s.getMonth,
        d: s.getDay,
        h: this._getHours,
        i: this._getMinutes,
        s: this._getSeconds,
        u: getMilliseconds,
        a: getAmPm,
        dd: getFullDate,
        tt: this._getFullTime
      };
      // tslint:enable: object-literal-sort-keys
      if (+makeDate(prevProps.min) !== +makeDate(s.min)) {
        genWheels = true;
        this._min = isEmpty(s.min) ? UNDEFINED : makeDate(s.min, s, format);
      }
      if (+makeDate(prevProps.max) !== +makeDate(s.max)) {
        genWheels = true;
        this._max = isEmpty(s.max) ? UNDEFINED : makeDate(s.max, s, format);
      }
      if (
        s.theme !== prevProps.theme ||
        s.mode !== prevProps.mode ||
        s.locale !== prevProps.locale ||
        s.dateWheels !== prevProps.dateWheels ||
        s.timeWheels !== prevProps.timeWheels ||
        genWheels
      ) {
        this._wheels = this._getWheels();
      }
    };
    // tslint:enable variable-name
    DatetimeBase.prototype._getWheels = function () {
      this._wheelOrder = {};
      var s = this.s;
      var preset = s.mode || this._preset;
      var hasAmPm = this._hasAmPm;
      var dateDisplay = this._dateDisplay;
      var timeDisplay = this._timeDisplay;
      var wheelOrder = this._wheelOrder;
      var wheels = [];
      var dateGroup = [];
      var values;
      var timeGroup = [];
      var nr = 0;
      if (/date/i.test(preset)) {
        var dateParts = this._dateWheels.split(/\|/.test(this._dateWheels) ? '|' : '');
        for (var _i = 0, dateParts_1 = dateParts; _i < dateParts_1.length; _i++) {
          var template = dateParts_1[_i];
          var types = 0;
          if (template.length) {
            // If contains different characters
            if (/y/i.test(template)) {
              types++;
            }
            if (/m/i.test(template)) {
              types++;
            }
            if (/d/i.test(template)) {
              types++;
            }
            if (types > 1 && wheelOrder.dd === UNDEFINED) {
              wheelOrder.dd = nr;
              nr++;
              dateGroup.push(this._getDateWheel(template));
              timeGroup = dateGroup; // TODO ???
              // oneDateWheel = true;
            } else if (/y/i.test(template) && wheelOrder.y === UNDEFINED) {
              wheelOrder.y = nr;
              nr++;
              // Year wheel
              dateGroup.push({
                cssClass: 'mbsc-datetime-year-wheel',
                getIndex: this._getYearIndex,
                getItem: this._getYearValue,
                max: this._max ? s.getYear(this._max) : UNDEFINED,
                min: this._min ? s.getYear(this._min) : UNDEFINED,
                spaceAround: true
              });
            } else if (/m/i.test(template) && wheelOrder.m === UNDEFINED) {
              // Month wheel
              wheelOrder.m = nr;
              values = [];
              nr++;
              var monthDisplay = dateDisplay
                .replace(/[dy|]/gi, '')
                .replace(/MMMM/, '{mmmm}')
                .replace(/MMM/, '{mmm}')
                .replace(/MM/, '{mm}')
                .replace(/M/, '{m}');
              for (var j = 0; j < 12; j++) {
                var monthStr = monthDisplay
                  .replace(/{mmmm}/, s.monthNames[j])
                  .replace(/{mmm}/, s.monthNamesShort[j])
                  .replace(/{mm}/, pad(j + 1) + (s.monthSuffix || ''))
                  .replace(/{m}/, j + 1 + (s.monthSuffix || ''));
                values.push({
                  display: monthStr,
                  value: j
                });
              }
              dateGroup.push({
                cssClass: 'mbsc-datetime-month-wheel',
                data: values,
                spaceAround: true
              });
            } else if (/d/i.test(template) && wheelOrder.d === UNDEFINED) {
              // Day wheel
              wheelOrder.d = nr;
              values = [];
              nr++;
              for (var j = 1; j < 32; j++) {
                values.push({
                  display: (/dd/i.test(dateDisplay) ? pad(j) : j) + s.daySuffix,
                  value: j
                });
              }
              dateGroup.push({
                cssClass: 'mbsc-datetime-day-wheel',
                data: values,
                spaceAround: true
              });
            }
          }
        }
        wheels.push(dateGroup);
      }
      if (/time/i.test(preset)) {
        var timeParts = this._timeWheels.split(/\|/.test(this._timeWheels) ? '|' : '');
        for (var _a = 0, timeParts_1 = timeParts; _a < timeParts_1.length; _a++) {
          var template = timeParts_1[_a];
          var types = 0;
          if (template.length) {
            // If contains different characters
            if (/h/i.test(template)) {
              types++;
            }
            if (/m/i.test(template)) {
              types++;
            }
            if (/s/i.test(template)) {
              types++;
            }
            if (/a/i.test(template)) {
              types++;
            }
          }
          if (types > 1 && wheelOrder.tt === UNDEFINED) {
            wheelOrder.tt = nr;
            nr++;
            timeGroup.push(this._getTimeWheel(template));
          } else if (/h/i.test(template) && wheelOrder.h === UNDEFINED) {
            // Hours wheel
            values = [];
            wheelOrder.h = nr;
            nr++;
            for (var j = 0; j < (hasAmPm ? 12 : 24); j += s.stepHour) {
              values.push({
                display: hasAmPm && j === 0 ? 12 : /hh/i.test(timeDisplay) ? pad(j) : j,
                value: j
              });
            }
            timeGroup.push({
              cssClass: 'mbsc-datetime-hour-wheel',
              data: values,
              spaceAround: true
            });
          } else if (/m/i.test(template) && wheelOrder.i === UNDEFINED) {
            // Minutes wheel
            values = [];
            wheelOrder.i = nr;
            nr++;
            for (var j = 0; j < 60; j += s.stepMinute) {
              values.push({
                display: /mm/i.test(timeDisplay) ? pad(j) : j,
                value: j
              });
            }
            timeGroup.push({
              cssClass: 'mbsc-datetime-minute-wheel',
              data: values,
              spaceAround: true
            });
          } else if (/s/i.test(template) && wheelOrder.s === UNDEFINED) {
            // Seconds wheel
            values = [];
            wheelOrder.s = nr;
            nr++;
            for (var j = 0; j < 60; j += s.stepSecond) {
              values.push({
                display: /ss/i.test(timeDisplay) ? pad(j) : j,
                value: j
              });
            }
            timeGroup.push({
              cssClass: 'mbsc-datetime-second-wheel',
              data: values,
              spaceAround: true
            });
          } else if (/a/i.test(template) && wheelOrder.a === UNDEFINED) {
            wheelOrder.a = nr;
            nr++;
            timeGroup.push({
              cssClass: 'mbsc-dt-whl-a',
              data: /A/.test(template)
                ? [
                    {
                      display: s.amText.toUpperCase(),
                      value: 0
                    },
                    {
                      display: s.pmText.toUpperCase(),
                      value: 1
                    }
                  ]
                : [
                    {
                      display: s.amText,
                      value: 0
                    },
                    {
                      display: s.pmText,
                      value: 1
                    }
                  ],
              spaceAround: true
            });
          }
        }
        if (timeGroup !== dateGroup) {
          wheels.push(timeGroup);
        }
      }
      return wheels;
    };
    DatetimeBase.prototype._getDateWheel = function (template) {
      var hasDay = /d/i.test(template);
      this._hasDay = hasDay;
      this._dateTemplate = template;
      return {
        cssClass: 'mbsc-datetime-date-wheel',
        getIndex: this._getDateIndex,
        getItem: this._getDateItem,
        label: '',
        max: this._max ? getDateIndex(getFullDate(this._max), hasDay) : UNDEFINED,
        min: this._min ? getDateIndex(getFullDate(this._min), hasDay) : UNDEFINED,
        spaceAround: true
      };
    };
    DatetimeBase.prototype._getTimeWheel = function (template) {
      var s = this.s;
      var values = [];
      var st = 1;
      if (/s/i.test(template)) {
        st = s.stepSecond;
      } else if (/m/i.test(template)) {
        st = s.stepMinute * 60;
      } else if (/h/i.test(template)) {
        st = s.stepHour * 3600;
      }
      // timeStep = steps.tt = step;
      this._timeStep = st;
      for (var i = 0; i < 86400; i += st) {
        var time = new Date(new Date().setHours(0, 0, 0, 0) + i * 1000);
        values.push({
          display: formatDate(template, time, s),
          value: i
        });
      }
      return {
        // cssClass: 'mbsc-datetime-time-wheel',
        data: values,
        label: '',
        spaceAround: true
      };
    };
    DatetimeBase.prototype._getArray = function (d, fillInner) {
      var parts = ['y', 'm', 'd', 'a', 'h', 'i', 's', 'u', 'dd', 'tt'];
      var ret = [];
      var wheelOrder = this._wheelOrder;
      if (d === null || d === UNDEFINED) {
        return ret;
      }
      for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var part = parts_1[_i];
        var v = this._getDatePart[part](d);
        if (wheelOrder[part] !== UNDEFINED) {
          ret[wheelOrder[part]] = v;
        }
        if (fillInner) {
          this._innerValues[part] = v;
        }
      }
      return ret;
    };
    /** @hidden */
    DatetimeBase.defaults = __assign({}, dateTimeLocale, {
      dateDisplay: 'MMMMDDYYYY',
      dateWheelFormat: '|DDD MMM D|',
      stepHour: 1,
      stepMinute: 1,
      stepSecond: 1
    });
    // tslint:disable variable-name
    DatetimeBase._name = 'Datetime';
    return DatetimeBase;
  })(BaseComponent);

  var Date$1 = /*#__PURE__*/ (function (_super) {
    __extends(Date, _super);
    function Date() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      // tslint:disable-next-line: variable-name
      _this._setScroller = function (scroller) {
        _this._scroller = scroller;
      };
      return _this;
    }
    Date.prototype._template = function (s, state) {
      return createElement(
        Scroller,
        __assign({}, s, {
          formatValue: this._formatDate,
          getValue: this._getDate,
          minWheelWidth: this._minWheelWidth,
          parseValue: this._parseDate,
          ref: this._setScroller,
          shouldValidate: this._shouldValidate,
          validate: this._validate,
          value: this._value,
          valueEquality: this._valueEquals,
          wheels: this._wheels,
          onChange: this._onChange
        }),
        s.children
      );
    };
    return Date;
  })(DatetimeBase);

  var Datetime = /*#__PURE__*/ (function (_super) {
    __extends(Datetime, _super);
    function Datetime() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      // tslint:disable-next-line: variable-name
      _this._preset = 'datetime';
      return _this;
    }
    return Datetime;
  })(Date$1);

  /** @jsxRuntime classic */
  var RadioContext = createContext({});

  var radios = {};
  function subscribeRadio(name, handler) {
    if (!radios[name]) {
      radios[name] = {
        change: new Observable(),
        selectedIndex: -1
      };
    }
    return radios[name].change.subscribe(handler);
  }
  function unsubscribeRadio(name, key) {
    var data = radios[name];
    if (data) {
      data.change.unsubscribe(key);
      if (!data.change.nr) {
        delete radios[name];
      }
    }
  }
  function setRadio(name, value, selectedIndex) {
    var data = radios[name];
    if (data) {
      if (selectedIndex !== UNDEFINED) {
        data.selectedIndex = selectedIndex;
      }
      if (value !== UNDEFINED) {
        data.value = value;
      }
      data.change.next(data.value);
    }
  }
  function getSelectedIndex(name) {
    return radios[name] && radios[name].selectedIndex;
  }
  function setSelectedIndex(name, selectedIndex) {
    if (radios[name]) {
      radios[name].selectedIndex = selectedIndex;
    }
  }

  // tslint:disable no-non-null-assertion
  // tslint:disable no-inferrable-types
  // tslint:disable directive-class-suffix
  // tslint:disable directive-selector
  var guid$1 = 1;
  /** @hidden */
  var SegmentedGroupBase = /*#__PURE__*/ (function (_super) {
    __extends(SegmentedGroupBase, _super);
    function SegmentedGroupBase() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      _this._id = 'mbsc-segmented-group' + guid$1++;
      _this._onChange = function (ev, val) {
        var s = _this.s;
        var value = _this.value;
        if (s.select === 'multiple') {
          if (value !== UNDEFINED) {
            value = value || [];
            var index = value.indexOf(val);
            if (index !== -1) {
              value.splice(index, 1);
            } else {
              value.push(val);
            }
            _this.value = value.slice();
          }
        } else {
          _this.value = val;
        }
        if (s.onChange) {
          s.onChange(ev);
        }
      };
      return _this;
    }
    SegmentedGroupBase.prototype._setupDrag = function () {
      var _this = this;
      var disabledArray = [];
      var widthArray = [];
      var wrapperWidth;
      var wrapperLeft;
      var isDragging;
      var selectedIndex;
      var oldIndex;
      var name;
      this._unlisten = gestureListener(this._el, {
        onEnd: function () {
          if (isDragging && selectedIndex !== oldIndex && !disabledArray[selectedIndex]) {
            var inputElement = _this._el.querySelectorAll('.mbsc-segmented-input')[selectedIndex];
            inputElement.click();
          }
          isDragging = false;
          _this.setState({ dragging: false });
        },
        onMove: function (ev) {
          // if (this.state.dragging && this.state.handleDrag && widthArray.length) {
          if (isDragging) {
            // mouse x constrained to the group left and right side
            var relativeLeft = Math.min(Math.max(ev.endX - wrapperLeft, 0), wrapperWidth);
            var newIndex = 0;
            var beforeSum = widthArray[0];
            while (relativeLeft > beforeSum && widthArray.length > newIndex + 1) {
              newIndex++;
              beforeSum += widthArray[newIndex];
            }
            newIndex = _this.s.rtl ? widthArray.length - 1 - newIndex : newIndex;
            // const newIndex = Math.floor(relativeLeft / this._itemWidth);
            if (newIndex !== selectedIndex && !disabledArray[newIndex]) {
              selectedIndex = newIndex;
              // this.forceUpdate();
              setRadio(name, UNDEFINED, selectedIndex);
            }
          }
        },
        onStart: function (ev) {
          // go into dragging state - handle or not
          var item = closest(ev.domEvent.target, '.mbsc-segmented-item', _this._el);
          if (!item) {
            // Gesture was started outside of an item
            return;
          }
          var input = item.querySelector('.mbsc-segmented-input');
          var classList = input.classList;
          if (classList.contains('mbsc-selected')) {
            // this.setState({ dragging: true, handleDrag: classList.contains('mbsc-selected') });
            // update disabled array
            disabledArray = [];
            forEach(_this._el.querySelectorAll('.mbsc-segmented-button'), function (button) {
              disabledArray.push(button.classList.contains('mbsc-disabled'));
            });
            widthArray = [];
            forEach(_this._el.querySelectorAll('.mbsc-segmented-item'), function (el) {
              widthArray.push(el.clientWidth);
            });
            var padding = 15; // (12 + 3) on each side
            wrapperWidth = _this._el.clientWidth - padding * 2;
            wrapperLeft = getOffset(_this._el).left + padding;
            name = input.name;
            selectedIndex = getSelectedIndex(name);
            oldIndex = selectedIndex;
            // We don't always have select multiple specified for the group,
            // so we additionally check if it's a radio input
            if (widthArray.length && input.type === 'radio') {
              isDragging = true;
              _this.setState({ dragging: true });
            }
          }
        }
      });
    };
    SegmentedGroupBase.prototype._cleanupDrag = function () {
      if (this._unlisten) {
        this._unlisten();
        this._unlisten = null;
      }
    };
    SegmentedGroupBase.prototype._render = function (s) {
      this._name = s.name === UNDEFINED ? this._id : s.name;
      this._groupClass =
        'mbsc-segmented ' +
        this._className +
        this._theme +
        this._rtl +
        (s.color ? ' mbsc-segmented-' + s.color : '') +
        (this.state.dragging ? ' mbsc-segmented-dragging' : '');
    };
    SegmentedGroupBase.prototype._updated = function () {
      // we need to setup the dragging based on the `drag` option (theme specific default), which can change
      if (this.s.drag && this.s.select !== 'multiple') {
        if (!this._unlisten) {
          this._setupDrag();
        }
      } else {
        this._cleanupDrag();
      }
    };
    SegmentedGroupBase.prototype._destroy = function () {
      this._cleanupDrag();
    };
    // tslint:disable variable-name
    SegmentedGroupBase.defaults = {
      select: 'single'
    };
    SegmentedGroupBase._name = 'SegmentedGroup';
    return SegmentedGroupBase;
  })(BaseComponent);

  /**
   * The SegmentedGroup.
   *
   * Usage:
   *
   * ```
   * <SegmentedGroup>...</SegmentedGroup>
   * ```
   */
  var SegmentedGroup = /*#__PURE__*/ (function (_super) {
    __extends(SegmentedGroup, _super);
    function SegmentedGroup() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    SegmentedGroup.prototype._template = function (s) {
      var value = {
        color: s.color,
        disabled: s.disabled,
        name: this._name,
        onChange: this._onChange,
        select: s.select,
        value: s.value
      };
      var group = createElement('div', { className: this._groupClass, ref: this._setEl }, s.children);
      // With preact it does not compile if jsx <RadioContext.Provider> is used,
      // so we're using the createElement function
      return createElement(RadioContext.Provider, { children: group, value: value });
    };
    return SegmentedGroup;
  })(SegmentedGroupBase);

  // tslint:disable no-non-null-assertion
  // tslint:disable directive-class-suffix
  // tslint:disable directive-selector
  var guid$2 = 1;
  /** @hidden */
  var SegmentedBase = /*#__PURE__*/ (function (_super) {
    __extends(SegmentedBase, _super);
    function SegmentedBase() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      _this._id = 'mbsc-segmented-' + guid$2++;
      _this._onChange = function (ev) {
        var s = _this.s;
        var checked = ev.target.checked;
        if (checked === _this._checked) {
          return;
        }
        _this._change(checked); // needed for angular
        // Notify group
        if (_this._onGroupChange) {
          _this._onGroupChange(ev, _this._value);
        }
        _this._toggle(checked);
        if (s.onChange) {
          s.onChange(ev);
        }
      };
      _this._onValueChange = function (value) {
        var s = _this.s;
        var selected = _this._isMultiple ? value && value.indexOf(_this._value) !== -1 : value === _this._value;
        // Uncontrolled
        if (s.checked === UNDEFINED && selected !== _this.state.selected) {
          _this.setState({ selected: selected });
        } else {
          // Force update to handle index change
          _this.forceUpdate();
        }
        _this._change(selected);
      };
      return _this;
    }
    // tslint:enable variable-name
    // tslint:disable-next-line no-empty
    SegmentedBase.prototype._change = function (checked) {};
    SegmentedBase.prototype._toggle = function (checked) {
      // Update state of uncontrolled component
      if (this.s.checked === UNDEFINED) {
        this.setState({ selected: checked });
      }
      // The setRadio is now moved in the _render, to also handle programatic changes
      // if (!this._isMultiple) {
      //   setRadio(this._name, this._value, this._index);
      // }
    };
    SegmentedBase.prototype._groupOptions = function (_a) {
      var _this = this;
      var color = _a.color,
        disabled = _a.disabled,
        name = _a.name,
        onChange = _a.onChange,
        select = _a.select,
        value = _a.value;
      // The group options received above are optional. In case of jQuery / JS they won't be present,
      // because we render the group and items separately, without context between them.
      // Group options have higher priority, if present.
      var s = this.s;
      var state = this.state;
      var prevChecked = this._checked;
      var checked =
        s.checked !== UNDEFINED
          ? emptyOrTrue(s.checked) // Controlled
          : state.selected === UNDEFINED
          ? emptyOrTrue(s.defaultChecked)
          : state.selected; // Uncontrolled
      this._value = s.value === UNDEFINED ? this._id : s.value;
      this._onGroupChange = onChange;
      this._isMultiple = (select || s.select) === 'multiple';
      this._name = name === UNDEFINED ? s.name : name;
      this._disabled =
        disabled === UNDEFINED ? (s.disabled === UNDEFINED ? state.disabled : emptyOrTrue(s.disabled)) : emptyOrTrue(disabled);
      this._color = color === UNDEFINED ? s.color : color;
      this._checked = value === UNDEFINED ? checked : this._isMultiple ? value && value.indexOf(this._value) !== -1 : value === this._value;
      // Subscribe to radio changes if not yet subscribed
      if (this._name && !this._unsubscribe) {
        this._unsubscribe = subscribeRadio(this._name, this._onValueChange);
      }
      if (!this._isMultiple && !prevChecked && this._checked) {
        setTimeout(function () {
          // It's possible that the checked state is modified with a subsequent render,
          // so we check again, otherwise we end up with an infinite loop
          if (_this._checked) {
            setRadio(_this._name, _this._value, _this._index);
          }
        });
      }
      this._selectedIndex = getSelectedIndex(this._name);
      this._cssClass =
        'mbsc-segmented-item ' +
        this._className +
        this._theme +
        this._rtl +
        (this._checked ? ' mbsc-segmented-item-checked' : '') +
        (state.hasFocus ? ' mbsc-focus' : '') +
        (this._index === this._selectedIndex ||
        (this._index === UNDEFINED && this._checked) || // We do not have an index yet, but we know it's checked (on first render)
        (this._isMultiple && this._checked)
          ? ' mbsc-segmented-item-selected'
          : '');
    };
    SegmentedBase.prototype._mounted = function () {
      var _this = this;
      // The click event needs to be listened manually, because react messes with the onChange listening
      // and doesn't pick up the programatically triggered events
      listen(this._el, CLICK, this._onChange);
      this._unlisten = gestureListener(this._el, {
        onBlur: function () {
          _this.setState({ hasFocus: false });
        },
        onFocus: function () {
          _this.setState({ hasFocus: true });
        }
      });
    };
    SegmentedBase.prototype._updated = function () {
      if (!this._isMultiple) {
        // Find the index and selected index.
        // We're using the document and getting the siblings by name, because the group is not available in jQuery / JS.
        // TODO: this is not very nice, think of a better solution.
        var cont = closest(this._el, '.mbsc-segmented');
        var index = -1;
        var selectedIndex = -1;
        if (cont) {
          var items = cont.querySelectorAll('.mbsc-segmented-input[name="' + this._name + '"]');
          for (var i = 0; i < items.length; i++) {
            if (items[i] === this._el) {
              index = i;
            }
            if (items[i].checked) {
              selectedIndex = i;
            }
          }
        }
        if (this._index !== index && selectedIndex !== -1) {
          setSelectedIndex(this._name, selectedIndex);
        }
        if (this._selectedIndex !== -1) {
          this._box.style.transform = 'translateX(' + (this.s.rtl ? -1 : 1) * (this._selectedIndex - index) * 100 + '%)';
          this._animate = true;
        }
        if (index !== -1) {
          this._index = index;
        }
      }
    };
    SegmentedBase.prototype._destroy = function () {
      unsubscribeRadio(this._name, this._unsubscribe);
      unlisten(this._el, CLICK, this._onChange);
      this._unlisten();
    };
    // tslint:disable variable-name
    SegmentedBase.defaults = {
      select: 'single'
    };
    SegmentedBase._name = 'Segmented';
    return SegmentedBase;
  })(BaseComponent);

  var Segmented = /*#__PURE__*/ (function (_super) {
    __extends(Segmented, _super);
    function Segmented() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      // tslint:disable-next-line: variable-name
      _this._setBox = function (box) {
        _this._box = box;
      };
      return _this;
    }
    Object.defineProperty(Segmented.prototype, 'checked', {
      get: function () {
        return this._checked;
      },
      set: function (value) {
        this._toggle(value);
      },
      enumerable: true,
      configurable: true
    });
    Segmented.prototype._template = function (s, state) {
      var _this = this;
      // With preact it does not compile if jsx <RadioContext.Consumer> is used,
      // so we're using the createElement function
      return createElement(RadioContext.Consumer, null, function (groupOpt) {
        _this._groupOptions(groupOpt);
        return createElement(
          'label',
          { className: _this._cssClass },
          createElement('input', {
            ref: _this._setEl,
            'aria-labelledby': _this._id,
            checked: _this._checked,
            className: 'mbsc-segmented-input mbsc-reset ' + (s.inputClass || '') + _this._theme + (_this._checked ? ' mbsc-selected' : ''),
            disabled: _this._disabled,
            name: _this._isMultiple ? s.name : _this._name,
            onChange: noop,
            type: _this._isMultiple ? 'checkbox' : 'radio',
            value: _this._value
          }),
          createElement(
            'div',
            {
              ref: _this._setBox,
              className:
                'mbsc-segmented-selectbox' +
                _this._theme +
                (_this._animate ? ' mbsc-segmented-selectbox-animate' : '') +
                (_this._checked ? ' mbsc-selected' : '')
            },
            createElement('div', {
              className:
                'mbsc-segmented-selectbox-inner' +
                _this._theme +
                (_this._index === _this._selectedIndex || _this._checked ? ' mbsc-segmented-selectbox-inner-visible' : '') +
                (_this._checked ? ' mbsc-selected' : '')
            })
          ),
          createElement(
            Button,
            {
              'aria-hidden': true,
              ariaLabel: s.ariaLabel,
              className: 'mbsc-segmented-button' + (_this._checked ? ' mbsc-selected' : '') + (state.hasFocus ? ' mbsc-focus' : ''),
              color: _this._color,
              disabled: _this._disabled,
              endIcon: s.endIcon,
              endIconSrc: s.endIconSrc,
              endIconSvg: s.endIconSvg,
              icon: s.icon,
              iconSrc: s.iconSrc,
              iconSvg: s.iconSvg,
              id: _this._id,
              ripple: s.ripple,
              rtl: s.rtl,
              startIcon: s.startIcon,
              startIconSrc: s.startIconSrc,
              startIconSvg: s.startIconSvg,
              tag: 'span',
              tabIndex: -1,
              theme: s.theme,
              themeVariant: s.themeVariant
            },
            s.children
          )
        );
      });
    };
    return Segmented;
  })(SegmentedBase);

  /** @jsxRuntime classic */
  function TimeBox(_a) {
    var disabled = _a.disabled,
      selected = _a.selected,
      theme = _a.theme,
      timeSlot = _a.timeSlot,
      onClick = _a.onClick,
      onKeyDown = _a.onKeyDown;
    // tslint:disable: jsx-no-lambda
    return createElement(
      'div',
      {
        className: 'mbsc-timegrid-item' + (selected ? ' mbsc-selected' : '') + (disabled ? ' mbsc-disabled' : '') + theme,
        onClick: function () {
          return onClick(timeSlot);
        },
        onKeyDown: onKeyDown,
        tabIndex: disabled ? UNDEFINED : 0,
        'data-timeslot': timeSlot.value
      },
      timeSlot.formattedValue
    );
    // tslint:enable: jsx-no-lambda
  }

  /**
   * Returns the closest number (timestamp) to a value from an array of numbers
   */
  function getClosestNumber(arr, value) {
    if (value == null || !arr.length) {
      // intentional == checks for undefined as well
      return null;
    }
    // go until find a greated number
    var i = 0;
    while (i < arr.length && value >= arr[i]) {
      i++;
    }
    if (i === arr.length) {
      // no greater number was found
      return arr[i - 1]; // the last one is the closest
    } else if (i === 0) {
      // the first one was greater
      return arr[0];
    } else {
      var prev = arr[i - 1];
      var next = arr[i];
      return value - prev < next - value ? prev : next; // return the one that is closer to the given number
    }
  }
  var TimegridBase = /*#__PURE__*/ (function (_super) {
    __extends(TimegridBase, _super);
    function TimegridBase() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      _this._setTime = function (timeSlot) {
        _this._hook('onChange', { value: createDate(_this.s, timeSlot.value) });
      };
      _this._isDisabled = function (d) {
        if (d) {
          var key = getDateStr(createDate(_this.s, d));
          var invalidsForDay = _this._invalids && _this._invalids[key];
          var validsForDay = _this._valids && _this._valids[key];
          var exclusiveEndDates = _this.s.exclusiveEndDates;
          if (validsForDay) {
            for (var _i = 0, validsForDay_1 = validsForDay; _i < validsForDay_1.length; _i++) {
              var valid = validsForDay_1[_i];
              var lessThanEnd = valid.end && (exclusiveEndDates ? d < +valid.end : d <= +valid.end);
              if ((valid.start && d >= +valid.start && lessThanEnd) || valid.allDay) {
                return false;
              }
            }
            return true;
          }
          if (invalidsForDay) {
            for (var _a = 0, invalidsForDay_1 = invalidsForDay; _a < invalidsForDay_1.length; _a++) {
              var invalid = invalidsForDay_1[_a];
              var lessThanEnd = invalid.end && (exclusiveEndDates ? d < +invalid.end : d <= +invalid.end);
              if ((invalid.start && d >= +invalid.start && lessThanEnd) || invalid.allDay) {
                return true;
              }
            }
            return false;
          }
        }
        return false;
      };
      _this._onKeyDown = function (ev) {
        switch (ev.keyCode) {
          case SPACE:
            ev.target.click();
            ev.preventDefault();
            break;
        }
      };
      return _this;
    }
    TimegridBase.prototype._render = function (s, state) {
      var _this = this;
      var prevS = this._prevS;
      this._cssClass = 'mbsc-timegrid-container mbsc-font' + this._theme + this._rtl;
      var minChanged = s.min !== prevS.min;
      var maxChanged = s.max !== prevS.max;
      var timeFormat = s.timeFormat;
      var valueChanged = (prevS.value && !s.value) || (s.value && +s.value !== this._value);
      if (minChanged) {
        this._min = isEmpty(s.min) ? UNDEFINED : makeDate(s.min, s, timeFormat);
      }
      if (maxChanged) {
        this._max = isEmpty(s.max) ? UNDEFINED : makeDate(s.max, s, timeFormat);
      }
      // constrain the default date or the selected date that comes from outside to the min and max
      var selected = s.value || createDate(s);
      // const selectedConstrained = createDate(s, constrain(+selected, +this._min, +this._max));
      // calculate the current day start and end points
      var dayStart = getDateOnly(selected);
      var dayEnd = addDays(dayStart, 1);
      // optimize the invalid map to only reload when the current day changes
      // because invalids are loaded for a single day only
      // TODO: maybe we could optimize for a month as well
      var currentDateChanged = this._selectedDate !== +dayStart;
      var invChanged = s.invalid !== prevS.invalid;
      var validChanged = s.valid !== prevS.valid;
      if (invChanged || currentDateChanged) {
        this._invalids = getEventMap(s.invalid, dayStart, dayEnd, s, true);
      }
      if (validChanged || currentDateChanged) {
        this._valids = getEventMap(s.valid, dayStart, dayEnd, s, true);
      }
      if (valueChanged) {
        this._value = s.value && +s.value; // set or clear the selected time
      }
      var timeSlotsChange = currentDateChanged || invChanged || minChanged || maxChanged || timeFormat !== prevS.timeFormat;
      if (timeSlotsChange) {
        this._selectedDate = +dayStart; // save the current day for next render
        // define start and end points of the timeslots - the day start and day end points constrained with min and max
        // const start = +constrainDate(dayStart, this._min);
        // const end = +constrainDate(dayEnd, UNDEFINED, this._max);
        var start = Math.max(+dayStart, +(this._min || -Infinity));
        var end = Math.min(+dayEnd, +(this._max || Infinity) + 1);
        // calculate the time step
        var timeInterval = s.stepHour * 3600000 + s.stepMinute * 60000;
        this._timeSlots = [];
        this._validTimes = [];
        var arr = [];
        var i = 0;
        for (var d = +dayStart; d < +dayEnd; d += timeInterval) {
          if (end >= start ? d >= start && d < end : d >= start || d < end) {
            var timeslot = { formattedValue: formatDate(timeFormat, createDate(s, d), s), value: d };
            arr.push(timeslot);
            if (i === 2) {
              this._timeSlots.push(arr);
              arr = [];
              i = -1;
            }
            if (!this._isDisabled(d)) {
              this._validTimes.push(timeslot);
            }
            i++;
          }
        }
        if (arr.length) {
          this._timeSlots.push(arr);
        }
      }
      // validate the selected time passed down from datepicker
      if (
        this._isDisabled(this._value) ||
        ((valueChanged || timeSlotsChange) &&
          findIndex(this._validTimes, function (ts) {
            return ts.value === _this._value;
          }) === -1)
      ) {
        var validated_1 = getClosestNumber(
          this._validTimes.map(function (slot) {
            return slot.value;
          }),
          this._value
        );
        if (validated_1) {
          clearTimeout(this._validationHandle);
          this._validationHandle = setTimeout(function () {
            var validTimeslot = find(_this._validTimes, function (slot) {
              return slot.value === validated_1;
            });
            _this._setTime(validTimeslot);
          });
        }
      } else if (timeSlotsChange) {
        // if the value and the valid times also change in the next cycle, before the setTimeout above could have run,
        // then the validated value will not be found in the _validTimes array, so the validTimeSlot will error out in
        // _setTime. We can safely clear the timeout since, the value we wanted to set is not available anymore.
        clearTimeout(this._validationHandle);
      }
      this._valueChanged = this._valueChanged || valueChanged;
    };
    TimegridBase.prototype._updated = function () {
      if (this._value !== UNDEFINED && (this._valueChanged || (this._isOpen !== this.s.isOpen && this.s.isOpen))) {
        var animate_1 = this._lastValue !== UNDEFINED;
        var grid_1 = this._gridContEl;
        var timeslot_1 = grid_1.querySelector('[data-timeslot="' + this._value + '"]');
        if (timeslot_1) {
          setTimeout(function () {
            var itemRect = timeslot_1.getBoundingClientRect();
            var itemTop = itemRect.top;
            var itemHeight = itemRect.height;
            var gridRect = grid_1.getBoundingClientRect();
            var gridTop = gridRect.top;
            var gridHeight = gridRect.height;
            var currPos = getScrollTop(grid_1);
            if (itemTop + itemHeight > gridTop + gridHeight || itemTop < gridTop) {
              var scrollPos = itemTop - gridTop + currPos - 5;
              smoothScroll(grid_1, UNDEFINED, scrollPos, animate_1);
            }
          });
        }
        this._valueChanged = false;
        this._lastValue = this._value;
      }
      this._isOpen = this.s.isOpen;
    };
    /** @hidden */
    TimegridBase.defaults = __assign({}, dateTimeLocale, { stepHour: 0, stepMinute: 30 });
    // tslint:disable variable-name
    TimegridBase._name = 'Timegrid';
    return TimegridBase;
  })(BaseComponent);

  var Timegrid = /*#__PURE__*/ (function (_super) {
    __extends(Timegrid, _super);
    function Timegrid() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      // tslint:disable-next-line: variable-name
      _this._setCont = function (el) {
        _this._gridContEl = el && el.parentElement;
      };
      return _this;
    }
    Timegrid.prototype._template = function (s) {
      var _this = this;
      return createElement(
        'div',
        { className: this._cssClass, ref: this._setCont },
        this._timeSlots.map(function (arr, rowIndex) {
          return createElement(
            'div',
            { className: 'mbsc-timegrid-row', key: rowIndex },
            arr.map(function (v, cellIndex) {
              var disabled = _this._isDisabled(v.value);
              return createElement(
                'div',
                { className: 'mbsc-timegrid-cell' + (disabled ? ' mbsc-disabled' : ''), key: cellIndex },
                createElement(TimeBox, {
                  disabled: disabled,
                  onKeyDown: _this._onKeyDown,
                  selected: _this._value === v.value,
                  timeSlot: v,
                  onClick: _this._setTime,
                  theme: _this._theme
                })
              );
            })
          );
        })
      );
    };
    return Timegrid;
  })(TimegridBase);

  modules.Datetime = Datetime;
  modules.Calendar = Calendar;
  modules.Timegrid = Timegrid;
  /**
   * The Calendar component.
   *
   * Usage:
   *
   * ```
   * <Datepicker />
   * ```
   */
  var Datepicker = /*#__PURE__*/ (function (_super) {
    __extends(Datepicker, _super);
    function Datepicker() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    Datepicker.prototype._template = function (s) {
      var _this = this;
      var hasTabs = this._renderTabs;
      var controls = this._controls;
      var activeSelect = this._activeSelect;
      var rtl = this._rtl;
      var theme = this._theme;
      var content = createElement(
        'div',
        {
          className:
            'mbsc-datepicker mbsc-flex-col mbsc-datepicker-' +
            s.display +
            theme +
            (s.display === 'inline' ? ' ' + this._className : '') +
            this._controlsClass
        },
        this._headerText &&
          s.display === 'inline' &&
          createElement('div', { className: 'mbsc-picker-header' + theme + this._hb }, this._headerText),
        hasTabs &&
          createElement(
            SegmentedGroup,
            { rtl: s.rtl, theme: s.theme, themeVariant: s.themeVariant, value: this._activeTab, onChange: this._changeActiveTab },
            controls.map(function (control, indx) {
              return createElement(
                Segmented,
                { key: indx, rtl: s.rtl, theme: s.theme, themeVariant: s.themeVariant, value: control.name },
                control.title
              );
            })
          ),
        this._renderControls &&
          createElement(
            'div',
            { className: 'mbsc-range-control-wrapper' + theme },
            createElement(
              SegmentedGroup,
              { theme: s.theme, themeVariant: s.themeVariant, rtl: s.rtl, value: activeSelect, onChange: this._changeActiveSelect },
              createElement(
                Segmented,
                {
                  rtl: s.rtl,
                  theme: s.theme,
                  themeVariant: s.themeVariant,
                  value: 'start',
                  className: 'mbsc-range-start' + (this._tempStartText ? ' mbsc-range-value-nonempty' : '')
                },
                createElement(
                  'div',
                  { className: 'mbsc-range-control-label' + theme + rtl + (activeSelect === 'start' ? ' active' : '') },
                  s.rangeStartLabel
                ),
                createElement(
                  'div',
                  {
                    className:
                      'mbsc-range-control-value' +
                      theme +
                      rtl +
                      (activeSelect === 'start' ? ' active' : '') +
                      (!this._tempStartText ? ' mbsc-range-control-text-empty' : '')
                  },
                  this._tempStartText || s.rangeStartHelp
                ),
                activeSelect === 'start' &&
                  this._tempStartText &&
                  createElement(Icon, {
                    className: 'mbsc-range-label-clear' + rtl,
                    onClick: this._clearStart,
                    svg: s.clearIcon,
                    theme: s.theme
                  })
              ),
              createElement(
                Segmented,
                {
                  rtl: s.rtl,
                  theme: s.theme,
                  themeVariant: s.themeVariant,
                  value: 'end',
                  className: 'mbsc-range-end' + (this._tempEndText ? ' mbsc-range-value-nonempty' : '')
                },
                createElement(
                  'div',
                  { className: 'mbsc-range-control-label' + theme + rtl + (activeSelect === 'end' ? ' active' : '') },
                  s.rangeEndLabel
                ),
                createElement(
                  'div',
                  {
                    className:
                      'mbsc-range-control-value' +
                      theme +
                      rtl +
                      (activeSelect === 'end' ? ' active' : '') +
                      (!this._tempEndText ? ' mbsc-range-control-text-empty' : '')
                  },
                  this._tempEndText || s.rangeEndHelp
                ),
                activeSelect === 'end' &&
                  this._tempEndText &&
                  createElement(Icon, {
                    className: 'mbsc-range-label-clear' + rtl,
                    onClick: this._clearEnd,
                    svg: s.clearIcon,
                    theme: s.theme
                  })
              )
            )
          ),
        createElement(
          'div',
          { className: 'mbsc-datepicker-tab-wrapper mbsc-flex-1-1' + theme, ref: this._setWrapper },
          controls.map(function (control, indx) {
            return createElement(
              'div',
              {
                key: indx,
                className:
                  'mbsc-datepicker-tab mbsc-datepicker-tab-' +
                  control.name +
                  theme +
                  ((hasTabs && control.name === _this._activeTab) || !hasTabs ? ' mbsc-datepicker-tab-active' : '') +
                  (hasTabs && control.name === 'time' ? ' mbsc-datepicker-time-modal' : '') +
                  (hasTabs || controls.length === 1 ? ' mbsc-datepicker-tab-expand' : '')
              },
              createElement(control.Component, __assign({}, control.options))
            );
          })
        )
      );
      return template(this, s, content);
    };
    return Datepicker;
  })(DatepickerBase);

  exports.CalendarContext = CalendarContext;
  exports.CalendarNav = CalendarNav;
  exports.CalendarNext = CalendarNext;
  exports.CalendarPrev = CalendarPrev;
  exports.CalendarToday = CalendarToday;
  exports.Datepicker = Datepicker;
  exports.Draggable = Draggable;
  exports.DraggableBase = DraggableBase;
  exports.Eventcalendar = Eventcalendar;
  exports.EventcalendarBase = EventcalendarBase;
  exports.LDate = LDate;
  exports.MDate = MDate;
  exports.OptionsProvider = OptionsProvider;
  exports.PopupBase = PopupBase;
  exports.autoDetect = autoDetect;
  exports.createCustomTheme = createCustomTheme;
  exports.formatDate = formatDatePublic;
  exports.getAutoTheme = getAutoTheme;
  exports.getJson = getJson;
  exports.globalChanges = globalChanges;
  exports.googleCalendarSync = googleCalendarSync;
  exports.hijriCalendar = hijriCalendar;
  exports.jalaliCalendar = jalaliCalendar;
  exports.locale = locale;
  exports.localeEn = localeEn;
  exports.luxonTimezone = luxonTimezone;
  exports.momentTimezone = momentTimezone;
  exports.options = options;
  exports.outlookCalendarSync = outlookCalendarSync;
  exports.parseDate = parseDate;
  exports.platform = platform$1;
  exports.print = print;
  exports.processButtons = processButtons;
  exports.setOptions = setOptions;
  exports.subscribeExternalDrag = subscribeExternalDrag;
  exports.themes = themes;
  exports.unsubscribeExternalDrag = unsubscribeExternalDrag;
  exports.updateRecurringEvent = updateRecurringEvent;
  exports.util = util;

  Object.defineProperty(exports, '__esModule', { value: true });
});
