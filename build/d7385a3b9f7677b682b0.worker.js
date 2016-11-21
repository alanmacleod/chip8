/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _chip = __webpack_require__(1);
	
	var _chip2 = _interopRequireDefault(_chip);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var c = new _chip2.default();
	
	c.load('rom-json/pong.json', function () {
	    // insert the cartridge...
	    c.poweron(); // switch it on :)
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _base = __webpack_require__(2);
	
	var _base2 = _interopRequireDefault(_base);
	
	var _loader = __webpack_require__(4);
	
	var _loader2 = _interopRequireDefault(_loader);
	
	var _input = __webpack_require__(5);
	
	var _input2 = _interopRequireDefault(_input);
	
	var _cpu = __webpack_require__(7);
	
	var _cpu2 = _interopRequireDefault(_cpu);
	
	var _ram = __webpack_require__(14);
	
	var _ram2 = _interopRequireDefault(_ram);
	
	var _gfx = __webpack_require__(15);
	
	var _gfx2 = _interopRequireDefault(_gfx);
	
	var _loglevel = __webpack_require__(6);
	
	var _loglevel2 = _interopRequireDefault(_loglevel);
	
	var _disasm = __webpack_require__(16);
	
	var _disasm2 = _interopRequireDefault(_disasm);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var BIOS_URL = "./bios.json";
	
	var Chip8 = function (_Base) {
	  _inherits(Chip8, _Base);
	
	  function Chip8() {
	    _classCallCheck(this, Chip8);
	
	    var _this = _possibleConstructorReturn(this, (Chip8.__proto__ || Object.getPrototypeOf(Chip8)).call(this));
	
	    _loglevel2.default.setLevel('debug');
	    _loglevel2.default.debug("Test");
	
	    _this.disasm = new _disasm2.default();
	
	    _this.cycles = 1;
	
	    _this.ram = new _ram2.default();
	    _this.gfx = new _gfx2.default(_this.ram.data);
	    _this.cpu = new _cpu2.default(_this.gfx, _this.ram);
	
	    _this.loader = new _loader2.default();
	    _this.cycleTimer = null;
	
	    _this._initEvents();
	    _this._reset();
	    _this._init_bios();
	    _this._executing = false;
	    return _this;
	  }
	
	  _createClass(Chip8, [{
	    key: 'cycle',
	    value: function cycle() {
	      //console.log("cycle"); return;
	      for (var t = 0; t < this.cycles; t++) {
	        if (!this._executing) return;
	        var opcode = this.cpu.fetch();
	        //let d = this.disasm.decode(opcode);
	        //  log.debug(`[${this.cpu.reg.ip.toString(16)}] ${d.m}\t\t${d.d}`);
	        this.cpu.execute(this.cpu.decode(opcode));
	      }
	    }
	  }, {
	    key: 'poweron',
	    value: function poweron() {
	      this._executing = true;
	      this.cycleTimer = setInterval(this.cycle.bind(this), 10);
	    }
	  }, {
	    key: 'halt',
	    value: function halt() {
	      _loglevel2.default.warn("Halting execution...");
	      this._executing = false;
	      clearInterval(this.cycleTimer);
	    }
	  }, {
	    key: 'pausedump',
	    value: function pausedump() {
	      this._executing = false;
	      this._dump();
	    }
	  }, {
	    key: 'step',
	    value: function step() {
	      this._executing = false;
	
	      var opcode = this.cpu.fetch();
	      var d = this.disasm.decode(opcode);
	      _loglevel2.default.debug('[' + this.cpu.reg.ip.toString(16) + '] ' + d.m + '\t\t' + d.d);
	      this.cpu.execute(this.cpu.decode(opcode));
	
	      this._dump();
	    }
	  }, {
	    key: 'resume',
	    value: function resume() {
	      this._executing = true;
	    }
	  }, {
	    key: 'haltdump',
	    value: function haltdump() {
	      this.halt();
	      this._dump();
	    }
	  }, {
	    key: '_dump',
	    value: function _dump() {
	      var s = '';
	
	      for (var t = 0, v = this.cpu.reg.v; t < v.length; t++) {
	        s += 'v' + t.toString(16) + '=' + v[t];
	        s += t < v.length - 1 ? ', ' : '';
	      }
	
	      _loglevel2.default.warn(s);
	      _loglevel2.default.warn('i=' + this.cpu.reg.i + ', vf=' + this.cpu.reg.vf + ', ip=0x' + this.cpu.reg.ip.toString(16));
	    }
	  }, {
	    key: 'load',
	    value: function load(url, callback) {
	      var _this2 = this;
	
	      _loglevel2.default.debug('Fetching: \'' + url + '\'');
	
	      this.loader.load(url, function (data) {
	        _loglevel2.default.info('Opening title \'' + data.title + '\'');
	
	        var buffer = _this2._base64ToArrayBuffer(data.binary);
	        _this2.ram.blit(buffer, 512);
	
	        callback();
	      });
	    }
	  }, {
	    key: '_init_bios',
	    value: function _init_bios() {
	      var _this3 = this;
	
	      // Load the "BIOS" characters into the protected area
	
	      this.loader.load(BIOS_URL, function (bios_data) {
	
	        var bytes = bios_data.bin.split(',');
	        var _data = new ArrayBuffer(bytes.length);
	        var data = new Uint8Array(_data);
	        var p = 0;
	
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;
	
	        try {
	          for (var _iterator = bytes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var charline = _step.value;
	
	            data[p++] = parseInt("0x" + charline, 16) & 0xff;
	          }
	        } catch (err) {
	          _didIteratorError = true;
	          _iteratorError = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	              _iterator.return();
	            }
	          } finally {
	            if (_didIteratorError) {
	              throw _iteratorError;
	            }
	          }
	        }
	
	        _this3.ram.blit(data, _this3.ram.getCharAddrBIOS());
	      });
	    }
	  }, {
	    key: '_base64ToArrayBuffer',
	    value: function _base64ToArrayBuffer(base64) {
	      var binary_string = self.atob(base64);
	      var len = binary_string.length;
	
	      var bytes = new Uint8Array(len);
	      for (var i = 0; i < len; i++) {
	        bytes[i] = binary_string.charCodeAt(i);
	      }return bytes;
	    }
	  }, {
	    key: '_reset',
	    value: function _reset() {
	      this.cpu.reset();
	      this.ram.reset();
	    }
	  }, {
	    key: '_initEvents',
	    value: function _initEvents() {
	      this.ram.on('gpf', function (data) {
	        this.emit('error', data);
	      }.bind(this)); // Override 'this' to use Chip8() context instead of RAM()'s
	
	      this.cpu.on('debug', function (data) {
	        this._executing = false;
	      }.bind(this));
	
	      this.cpu.on('opcode', function (data) {
	        this.halt();
	        self.postMessage({
	          action: 'error',
	          args: {
	            error: data.error,
	            trace: this.cpu.trace(),
	            registers: this.cpu.dump_registers(),
	            address: this.cpu.reg.ip
	          }
	        });
	      }.bind(this));
	
	      this.gfx.on('changed', function () {
	        self.postMessage({
	          action: 'render',
	          args: {
	            frameBuffer: this.gfx.display
	          }
	        });
	      }.bind(this));
	
	      self.onmessage = this.messageHandler.bind(this);
	    }
	  }, {
	    key: 'messageHandler',
	    value: function messageHandler(msg) {
	      switch (msg.data.action) {
	        case 'input':
	          this.ram.blit(msg.data.args.keyState, this.ram.getKeyboardBufferAddress());
	          break;
	        case 'pause':
	          this.pausedump();
	          break;
	        case 'resume':
	          this.resume();
	          break;
	        case 'haltdump':
	          this.haltdump();
	          break;
	        case 'step':
	          this.step();
	          break;
	      }
	    }
	  }]);
	
	  return Chip8;
	}(_base2.default);
	
	exports.default = Chip8;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _event = __webpack_require__(3);
	
	var _event2 = _interopRequireDefault(_event);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Base = function (_EventEmitter) {
	  _inherits(Base, _EventEmitter);
	
	  function Base() {
	    _classCallCheck(this, Base);
	
	    return _possibleConstructorReturn(this, (Base.__proto__ || Object.getPrototypeOf(Base)).call(this));
	  }
	
	  return Base;
	}(_event2.default);
	
	exports.default = Base;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var EventEmitter = function () {
	  function EventEmitter() {
	    _classCallCheck(this, EventEmitter);
	
	    this.listeners = new Map();
	    this.on = this.addListener;
	    this.fire = this.emit;
	  }
	
	  _createClass(EventEmitter, [{
	    key: 'addListener',
	    value: function addListener(label, fn) {
	      this.listeners.has(label) || this.listeners.set(label, []);
	      this.listeners.get(label).push(fn);
	    }
	  }, {
	    key: '_isFunction',
	    value: function _isFunction(obj) {
	      return typeof obj == 'function' || false;
	    }
	  }, {
	    key: 'removeListener',
	    value: function removeListener(label, fn) {
	      var listeners = this.listeners.get(label),
	          index = void 0;
	
	      if (listeners && listeners.length) {
	        index = listeners.reduce(function (i, listener, index) {
	          return _isFunction(listener) && listener === callback ? i = index : i;
	        }, -1);
	
	        if (index > -1) {
	          listeners.splice(index, 1);
	          this.listeners.set(label, listeners);
	          return true;
	        }
	      }
	      return false;
	    }
	  }, {
	    key: 'emit',
	    value: function emit(label) {
	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }
	
	      var listeners = this.listeners.get(label);
	      if (listeners && listeners.length) {
	        listeners.forEach(function (listener) {
	          listener.apply(undefined, args);
	        });
	        return true;
	      }
	      return false;
	    }
	  }]);
	
	  return EventEmitter;
	}();
	
	exports.default = EventEmitter;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Loader = function () {
	  function Loader() {
	    _classCallCheck(this, Loader);
	  }
	
	  _createClass(Loader, [{
	    key: "load",
	    value: function load(url, fn) {
	      var xmlhttp = new XMLHttpRequest();
	
	      xmlhttp.onreadystatechange = function () {
	        if (this.readyState == 4 && this.status == 200) {
	          var json = JSON.parse(this.responseText);
	          fn(json);
	        }
	      };
	
	      xmlhttp.open("GET", url, true);
	      xmlhttp.send();
	    }
	  }]);
	
	  return Loader;
	}();
	
	exports.default = Loader;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _loglevel = __webpack_require__(6);
	
	var _loglevel2 = _interopRequireDefault(_loglevel);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Input = function () {
	  // Note, the keystates are written direclty into the Chip8's BIOS/RAM
	  // for direct access by the CPU
	
	  function Input(callback) {
	    _classCallCheck(this, Input);
	
	    // 1 2 3 C
	    // 4 5 6 D
	    // 7 8 9 E
	    // A 0 B F
	    // this.keyMap = [
	    //   1:'1', 2:'2', 3:'3', c:'4',
	    //   4:'q', 5:'w', 6:'e', d:'r',
	    //   7:'a', 8:'s', 9:'d', e:'f',
	    //   10:'z', :0'x', B:'c', f:'v'
	    // ];
	
	    this.keyData = new Uint8Array(16);
	    this._callback = callback;
	
	    this.keyMap = ['x', '1', '2', '3', 'q', 'w', 'e', 'a', 's', 'd', 'z', 'c', '4', 'r', 'f', 'v'];
	
	    this._init();
	  }
	
	  _createClass(Input, [{
	    key: '_setKeyDown',
	    value: function _setKeyDown(key) {
	      this.keyData[key] = 1;
	      if (this._callback) this._callback(this.keyData);
	    }
	  }, {
	    key: '_setKeyUp',
	    value: function _setKeyUp(key) {
	      this.keyData[key] = 0;
	      if (this._callback) this._callback(this.keyData);
	    }
	  }, {
	    key: '_init',
	    value: function _init() {
	      var _this = this;
	
	      //HACK: convert array into integer ascii codes for quicker lookup
	      for (var k = 0; k < this.keyMap.length; k++) {
	        this.keyMap[k] = this.keyMap[k].charCodeAt(0);
	      }window.addEventListener('keydown', function (e) {
	        var code = String.fromCharCode(e.keyCode).toLowerCase().charCodeAt(0);
	        for (var _k = 0; _k < _this.keyMap.length; _k++) {
	          if (_this.keyMap[_k] == code) _this._setKeyDown(_k);
	        }
	        //this.printTable();
	      }, true);
	
	      window.addEventListener('keyup', function (e) {
	        //log.warn();
	        var code = String.fromCharCode(e.keyCode).toLowerCase().charCodeAt(0);
	        for (var _k2 = 0; _k2 < _this.keyMap.length; _k2++) {
	          if (_this.keyMap[_k2] == code) _this._setKeyUp(_k2);
	        }
	      }, true);
	    }
	  }]);
	
	  return Input;
	}();
	
	exports.default = Input;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	* loglevel - https://github.com/pimterry/loglevel
	*
	* Copyright (c) 2013 Tim Perry
	* Licensed under the MIT license.
	*/
	(function (root, definition) {
	    "use strict";
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module === 'object' && module.exports) {
	        module.exports = definition();
	    } else {
	        root.log = definition();
	    }
	}(this, function () {
	    "use strict";
	    var noop = function() {};
	    var undefinedType = "undefined";
	
	    function realMethod(methodName) {
	        if (typeof console === undefinedType) {
	            return false; // We can't build a real method without a console to log to
	        } else if (console[methodName] !== undefined) {
	            return bindMethod(console, methodName);
	        } else if (console.log !== undefined) {
	            return bindMethod(console, 'log');
	        } else {
	            return noop;
	        }
	    }
	
	    function bindMethod(obj, methodName) {
	        var method = obj[methodName];
	        if (typeof method.bind === 'function') {
	            return method.bind(obj);
	        } else {
	            try {
	                return Function.prototype.bind.call(method, obj);
	            } catch (e) {
	                // Missing bind shim or IE8 + Modernizr, fallback to wrapping
	                return function() {
	                    return Function.prototype.apply.apply(method, [obj, arguments]);
	                };
	            }
	        }
	    }
	
	    // these private functions always need `this` to be set properly
	
	    function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
	        return function () {
	            if (typeof console !== undefinedType) {
	                replaceLoggingMethods.call(this, level, loggerName);
	                this[methodName].apply(this, arguments);
	            }
	        };
	    }
	
	    function replaceLoggingMethods(level, loggerName) {
	        /*jshint validthis:true */
	        for (var i = 0; i < logMethods.length; i++) {
	            var methodName = logMethods[i];
	            this[methodName] = (i < level) ?
	                noop :
	                this.methodFactory(methodName, level, loggerName);
	        }
	    }
	
	    function defaultMethodFactory(methodName, level, loggerName) {
	        /*jshint validthis:true */
	        return realMethod(methodName) ||
	               enableLoggingWhenConsoleArrives.apply(this, arguments);
	    }
	
	    var logMethods = [
	        "trace",
	        "debug",
	        "info",
	        "warn",
	        "error"
	    ];
	
	    function Logger(name, defaultLevel, factory) {
	      var self = this;
	      var currentLevel;
	      var storageKey = "loglevel";
	      if (name) {
	        storageKey += ":" + name;
	      }
	
	      function persistLevelIfPossible(levelNum) {
	          var levelName = (logMethods[levelNum] || 'silent').toUpperCase();
	
	          // Use localStorage if available
	          try {
	              window.localStorage[storageKey] = levelName;
	              return;
	          } catch (ignore) {}
	
	          // Use session cookie as fallback
	          try {
	              window.document.cookie =
	                encodeURIComponent(storageKey) + "=" + levelName + ";";
	          } catch (ignore) {}
	      }
	
	      function getPersistedLevel() {
	          var storedLevel;
	
	          try {
	              storedLevel = window.localStorage[storageKey];
	          } catch (ignore) {}
	
	          if (typeof storedLevel === undefinedType) {
	              try {
	                  var cookie = window.document.cookie;
	                  var location = cookie.indexOf(
	                      encodeURIComponent(storageKey) + "=");
	                  if (location) {
	                      storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
	                  }
	              } catch (ignore) {}
	          }
	
	          // If the stored level is not valid, treat it as if nothing was stored.
	          if (self.levels[storedLevel] === undefined) {
	              storedLevel = undefined;
	          }
	
	          return storedLevel;
	      }
	
	      /*
	       *
	       * Public API
	       *
	       */
	
	      self.levels = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3,
	          "ERROR": 4, "SILENT": 5};
	
	      self.methodFactory = factory || defaultMethodFactory;
	
	      self.getLevel = function () {
	          return currentLevel;
	      };
	
	      self.setLevel = function (level, persist) {
	          if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
	              level = self.levels[level.toUpperCase()];
	          }
	          if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
	              currentLevel = level;
	              if (persist !== false) {  // defaults to true
	                  persistLevelIfPossible(level);
	              }
	              replaceLoggingMethods.call(self, level, name);
	              if (typeof console === undefinedType && level < self.levels.SILENT) {
	                  return "No console available for logging";
	              }
	          } else {
	              throw "log.setLevel() called with invalid level: " + level;
	          }
	      };
	
	      self.setDefaultLevel = function (level) {
	          if (!getPersistedLevel()) {
	              self.setLevel(level, false);
	          }
	      };
	
	      self.enableAll = function(persist) {
	          self.setLevel(self.levels.TRACE, persist);
	      };
	
	      self.disableAll = function(persist) {
	          self.setLevel(self.levels.SILENT, persist);
	      };
	
	      // Initialize with the right level
	      var initialLevel = getPersistedLevel();
	      if (initialLevel == null) {
	          initialLevel = defaultLevel == null ? "WARN" : defaultLevel;
	      }
	      self.setLevel(initialLevel, false);
	    }
	
	    /*
	     *
	     * Package-level API
	     *
	     */
	
	    var defaultLogger = new Logger();
	
	    var _loggersByName = {};
	    defaultLogger.getLogger = function getLogger(name) {
	        if (typeof name !== "string" || name === "") {
	          throw new TypeError("You must supply a name when creating a logger.");
	        }
	
	        var logger = _loggersByName[name];
	        if (!logger) {
	          logger = _loggersByName[name] = new Logger(
	            name, defaultLogger.getLevel(), defaultLogger.methodFactory);
	        }
	        return logger;
	    };
	
	    // Grab the current global log variable in case of overwrite
	    var _log = (typeof window !== undefinedType) ? window.log : undefined;
	    defaultLogger.noConflict = function() {
	        if (typeof window !== undefinedType &&
	               window.log === defaultLogger) {
	            window.log = _log;
	        }
	
	        return defaultLogger;
	    };
	
	    return defaultLogger;
	}));


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _loglevel = __webpack_require__(6);
	
	var _loglevel2 = _interopRequireDefault(_loglevel);
	
	var _base = __webpack_require__(2);
	
	var _base2 = _interopRequireDefault(_base);
	
	var _opcodes = __webpack_require__(8);
	
	var _timerDelay = __webpack_require__(13);
	
	var _timerDelay2 = _interopRequireDefault(_timerDelay);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var WORD_SIZE = 2; // 16-bit instruction
	var IP_INIT = 0x200; // = 512. Bytes 0-511 reserved for built-in interpreter
	var TRACE_BUFFER_SIZE = 10; // store last 10 instructions
	var _VF = 0xf; // Flag register
	
	var CPU = function (_Base) {
	  _inherits(CPU, _Base);
	
	  function CPU(gfx, ram) {
	    _classCallCheck(this, CPU);
	
	    var _this = _possibleConstructorReturn(this, (CPU.__proto__ || Object.getPrototypeOf(CPU)).call(this));
	
	    _this._this = "CPU"; // for context debugging (T_T)
	    _this.gfx = gfx;
	    _this.ram = ram;
	    _this.keyStateAddr = ram.getKeyboardBufferAddress();
	    _loglevel2.default.debug("CPU Initialised");
	
	    _this._trace = new Array(TRACE_BUFFER_SIZE);
	    _this._trace_ptr = 0;
	
	    // I feel like this should be part of the Chip8() object/system instead of
	    // in here but the delay timer appears to be only accessed or used directly
	    // by the CPU so whatever
	    _this.delayTimer = new _timerDelay2.default();
	
	    _this.reg = {
	      v: [],
	      i: 0,
	      _ip: 0,
	      _sp: 0,
	      get ip() {
	        return this._ip;
	      },
	      get sp() {
	        return this._sp;
	      }
	    };
	
	    _this.stack = [];
	    _this.exec = _opcodes.opcodes;
	    return _this;
	  }
	
	  _createClass(CPU, [{
	    key: 'reset',
	    value: function reset() {
	      var r = this.reg;
	      var _ref = [new Array(16).fill(0), 0, IP_INIT, 0];
	      r.v = _ref[0];
	      r.i = _ref[1];
	      r._ip = _ref[2];
	      r._sp = _ref[3];
	    }
	  }, {
	    key: 'next',
	    value: function next() {
	      this.reg._ip += WORD_SIZE;
	    }
	  }, {
	    key: 'fetch',
	    value: function fetch() {
	      return this.ram.readWord(this.reg.ip);
	    }
	  }, {
	    key: 'decode',
	    value: function decode(instr) {
	      var i = instr & 0xffff;
	      var major = (i & 0xf000) >> 12,
	          minor = i & 0x0fff;
	
	      this._add_to_trace_loop(instr, this.reg.ip);
	
	      return { major: major, minor: minor };
	    }
	  }, {
	    key: 'execute',
	    value: function execute(_ref2) {
	      var major = _ref2.major,
	          minor = _ref2.minor;
	
	      if (!this.exec[major].call(this, { major: major, minor: minor })) this.next();
	    }
	
	    // I'm particularly pleased with this looped buffer solution
	    // to record a window/snapshot of a data-stream of infinite (unknown) length
	    // Kinda like how the buffer works in a digital sound chip
	    // This is obviously faster than slicing an array's elements
	
	  }, {
	    key: '_add_to_trace_loop',
	    value: function _add_to_trace_loop(i, a) {
	      this._trace[this._trace_ptr++] = { i: i, a: a };
	      if (this._trace_ptr == TRACE_BUFFER_SIZE) this._trace_ptr = 0;
	    }
	  }, {
	    key: '_unroll_trace_loop',
	    value: function _unroll_trace_loop() {
	      // Separate the instruction and address into separate
	      // arrays for easier passing to the disassembler
	      var trace_unrolled = { i: [], a: [] };
	
	      var ip = this._trace_ptr;
	      for (var p = 0; p < TRACE_BUFFER_SIZE; p++) {
	        trace_unrolled.a.push(this._trace[ip].a); // address
	        trace_unrolled.i.push(this._trace[ip].i); // instruction
	        if (--ip < 0) ip = TRACE_BUFFER_SIZE - 1;
	      }
	
	      trace_unrolled.a.reverse();
	      trace_unrolled.i.reverse();
	      return trace_unrolled;
	    }
	  }, {
	    key: 'trace',
	    value: function trace() {
	      return this._unroll_trace_loop();
	    }
	  }, {
	    key: 'dump_registers',
	    value: function dump_registers() {
	      return this.reg;
	    }
	  }]);
	
	  return CPU;
	}(_base2.default);
	
	exports.default = CPU;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.opcodes = undefined;
	
	var _loglevel = __webpack_require__(6);
	
	var _loglevel2 = _interopRequireDefault(_loglevel);
	
	var _opcode0x = __webpack_require__(9);
	
	var _opcode0x2 = __webpack_require__(10);
	
	var _opcode0xE = __webpack_require__(11);
	
	var _opcode0xF = __webpack_require__(12);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _VF = 0xf; // Flag register
	
	var opcodes = exports.opcodes = [function (_ref) // 0x0???
	{
	  var major = _ref.major,
	      minor = _ref.minor;
	
	  _opcode0x.$_instr_0x0[minor & 0xff].call(this, { major: major, minor: minor });
	}, function (_ref2) //0x1nnn: JMP nnn
	{
	  var major = _ref2.major,
	      minor = _ref2.minor;
	
	  this.reg._ip = minor & 0xfff;
	  return true;
	}, function (_ref3) // 0x2nnn: CALL nnn
	{
	  var major = _ref3.major,
	      minor = _ref3.minor;
	
	  this.stack.push(this.reg.ip);
	  this.reg._ip = minor & 0xfff;
	  return true;
	}, function (_ref4) // 0x3XRR // jump next instr if vX == RR
	{
	  var major = _ref4.major,
	      minor = _ref4.minor;
	
	  if (this.reg.v[minor >> 8 & 0xf] == (minor & 0xff)) this.reg._ip += 2;
	}, function (_ref5) //4
	{
	  var major = _ref5.major,
	      minor = _ref5.minor;
	
	  if (this.reg.v[minor >> 8 & 0xf] != (minor & 0xff)) this.reg._ip += 2;
	}, function (_ref6) //5
	{
	  var major = _ref6.major,
	      minor = _ref6.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
	}, function (_ref7) // 0x6xnn  mov vx, nn
	{
	  var major = _ref7.major,
	      minor = _ref7.minor;
	
	  this.reg.v[minor >> 8 & 0xf] = minor & 0xff;
	}, function (_ref8) // 0x7xrr add vx, rr
	{
	  var major = _ref8.major,
	      minor = _ref8.minor;
	
	  var x = minor >> 8 & 0xf;
	  this.reg.v[x] += minor & 0xff;
	  this.reg.v[x] &= 255;
	}, function (_ref9) // 0x8
	{
	  var major = _ref9.major,
	      minor = _ref9.minor;
	
	  _opcode0x2.$_instr_0x8[minor & 0xf].call(this, { major: major, minor: minor });
	}, function (_ref10) // 9
	{
	  var major = _ref10.major,
	      minor = _ref10.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
	}, function (_ref11) // 0xAnnn: mvi nnn (load 'I' with nnn)
	{
	  var major = _ref11.major,
	      minor = _ref11.minor;
	
	  this.reg.i = minor & 0xfff;
	}, function (_ref12) // b
	{
	  var major = _ref12.major,
	      minor = _ref12.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
	}, function (_ref13) // 0xCxkk; rnd vx, kk
	{
	  var major = _ref13.major,
	      minor = _ref13.minor;
	
	  var rnd = Math.floor(Math.random() * 255) & (minor & 0xff);
	  this.reg.v[minor >> 8 & 0xf] = rnd;
	}, function (_ref14) // 0xDxyn: DRW Vx, Vy, n  (draw sprite)
	{
	  var major = _ref14.major,
	      minor = _ref14.minor;
	
	  var r = this.reg,
	      m = minor;
	  r.v[_VF] = this.gfx.draw(r.i, r.v[m >> 8 & 0xf], r.v[m >> 4 & 0xf], m & 0xf);
	}, function (_ref15) // 0xE
	{
	  var major = _ref15.major,
	      minor = _ref15.minor;
	
	  _opcode0xE.$_instr_0xE[minor & 0xff].call(this, { major: major, minor: minor });
	}, function (_ref16) // 0xFx??
	{
	  var major = _ref16.major,
	      minor = _ref16.minor;
	
	  _opcode0xF.$_instr_0xF[minor & 0xff].call(this, { major: major, minor: minor });
	}];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.$_instr_0x0 = undefined;
	
	var _loglevel = __webpack_require__(6);
	
	var _loglevel2 = _interopRequireDefault(_loglevel);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var MAX_INSTR = 0xFF;
	var $_instr_0x0 = [];
	
	// probs a smarter way to do this but oh well
	for (var t = 0; t <= MAX_INSTR; t++) {
	  $_instr_0x0.push({});
	}$_instr_0x0[0xE0] = function (_ref) // RET (stack.pop)
	{
	  var major = _ref.major,
	      minor = _ref.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
	};
	
	$_instr_0x0[0xEE] = function (_ref2) // RET (stack.pop)
	{
	  var major = _ref2.major,
	      minor = _ref2.minor;
	
	  var addr = this.stack.pop();
	  this.reg._ip = addr;
	};
	
	exports.$_instr_0x0 = $_instr_0x0;

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var $_instr_0x8 = [];
	
	var _VF = 0xf; // Flag register
	
	$_instr_0x8[0x0] = function (_ref) {
	  var major = _ref.major,
	      minor = _ref.minor;
	
	  this.reg.v[minor >> 8 & 0xf] = this.reg.v[minor >> 4 & 0xf];
	  //this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
	};
	$_instr_0x8[0x1] = function (_ref2) {
	  var major = _ref2.major,
	      minor = _ref2.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
	};
	
	$_instr_0x8[0x2] = function (_ref3) // and vx, vy
	{
	  var major = _ref3.major,
	      minor = _ref3.minor;
	
	  var vx = minor >> 8 & 0xf;
	  var vy = minor >> 4 & 0xf;
	  var rx = this.reg.v[vx];
	  var ry = this.reg.v[vy];
	  var res = this.reg.v[vx] & this.reg.v[minor >> 4 & 0xf];
	  var msg = 'and ' + vx + ', ' + vy + ' (and ' + rx + ', ' + ry + ' = ' + res + ')';
	  this.reg.v[vx] = res; //this.reg.v[vx] & this.reg.v[(minor>>4)&0xf];
	  //this.fire('opcode', {error: msg});
	  //console.log(msg);
	  //this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
	};
	$_instr_0x8[0x3] = function (_ref4) {
	  var major = _ref4.major,
	      minor = _ref4.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
	};
	$_instr_0x8[0x4] = function (_ref5) // ADD vx, vy -> vf
	{
	  var major = _ref5.major,
	      minor = _ref5.minor;
	
	  //this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
	
	  var x = minor >> 8 & 0xf,
	      y = minor >> 4 & 0xf;
	  this.reg.v[x] += this.reg.v[y];
	  this.reg.v[_VF] = +(this.reg.v[x] > 255);
	  if (this.reg.v[x] > 255) this.reg.v[x] -= 256;
	
	  // let vx = (minor>>8)&0xf;
	  // let r = this.reg.v[vx] + this.reg.v[(minor>>4)&0xf];
	  // let msg = `${this.reg.v[vx]} + ${this.reg.v[(minor>>4)&0xf]} = ${r} (actual = ${this.reg.v[vx]}, flag = ${this.reg.vf})`;
	  // this.reg.v[vx] = r&0xff;
	  // this.reg.vf = (!!(r&0xff00))+0;  // lol
	  // console.debug(msg)
	  //this.fire('opcode', {error: msg});
	};
	$_instr_0x8[0x5] = function (_ref6) {
	  var major = _ref6.major,
	      minor = _ref6.minor;
	
	  var x = minor >> 8 & 0xf,
	      y = minor >> 4 & 0xf;
	  this.reg.v[_VF] = +(this.reg.v[x] > this.reg.v[y]);
	  this.reg.v[x] -= this.reg.v[y];
	  //this.fire('debug');
	  if (this.reg.v[x] < 0) this.reg.v[x] += 256;
	
	  // let vx = this.reg.v[(minor>>8)&0xf], vy = this.reg.v[(minor>>4)&0xf];
	  // let f = (vx > vy)+0;
	  // this.reg.v[vx] = f ? this.reg.v[vx] - this.reg.v[vy] : this.reg.v[vy] - this.reg.v[vx];
	  //this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
	};
	$_instr_0x8[0x6] = function (_ref7) {
	  var major = _ref7.major,
	      minor = _ref7.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
	};
	$_instr_0x8[0x7] = function (_ref8) {
	  var major = _ref8.major,
	      minor = _ref8.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
	};
	$_instr_0x8[0x8] = function (_ref9) {
	  var major = _ref9.major,
	      minor = _ref9.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
	};
	$_instr_0x8[0x9] = function (_ref10) {
	  var major = _ref10.major,
	      minor = _ref10.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
	};
	$_instr_0x8[0xA] = function (_ref11) {
	  var major = _ref11.major,
	      minor = _ref11.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
	};
	$_instr_0x8[0xB] = function (_ref12) {
	  var major = _ref12.major,
	      minor = _ref12.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
	};
	$_instr_0x8[0xC] = function (_ref13) {
	  var major = _ref13.major,
	      minor = _ref13.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
	};
	$_instr_0x8[0xD] = function (_ref14) {
	  var major = _ref14.major,
	      minor = _ref14.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
	};
	$_instr_0x8[0xE] = function (_ref15) {
	  var major = _ref15.major,
	      minor = _ref15.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
	};
	$_instr_0x8[0xF] = function (_ref16) {
	  var major = _ref16.major,
	      minor = _ref16.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
	};
	
	exports.$_instr_0x8 = $_instr_0x8;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.$_instr_0xE = undefined;
	
	var _loglevel = __webpack_require__(6);
	
	var _loglevel2 = _interopRequireDefault(_loglevel);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var MAX_INSTR = 0xA1;
	var $_instr_0xE = [];
	
	// probs a smarter way to do this but oh well
	for (var t = 0; t <= MAX_INSTR; t++) {
	  $_instr_0xE.push({});
	}$_instr_0xE[0x9E] = function (_ref) {
	  var major = _ref.major,
	      minor = _ref.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
	};
	
	$_instr_0xE[0xA1] = function (_ref2) {
	  var major = _ref2.major,
	      minor = _ref2.minor;
	
	  if (this.ram.data[this.keyStateAddr + this.reg.v[minor >> 8 & 0xf]] == 0) this.reg._ip += 2;
	};
	
	exports.$_instr_0xE = $_instr_0xE;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.$_instr_0xF = undefined;
	
	var _loglevel = __webpack_require__(6);
	
	var _loglevel2 = _interopRequireDefault(_loglevel);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var MAX_INSTR = 0x65;
	var $_instr_0xF = [];
	
	// probs a smarter way to do this but oh well
	for (var t = 0; t <= MAX_INSTR; t++) {
	  $_instr_0xF.push({});
	}$_instr_0xF[0x07] = function (_ref) // Fx07: read delay timer from Vx
	{
	  var major = _ref.major,
	      minor = _ref.minor;
	
	  this.reg.v[minor >> 8 & 0xf] = this.delayTimer.get();
	};
	
	$_instr_0xF[0x0A] = function (_ref2) {
	  var major = _ref2.major,
	      minor = _ref2.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
	};
	
	$_instr_0xF[0x15] = function (_ref3) // Fx15: set delay timer from Vx
	{
	  var major = _ref3.major,
	      minor = _ref3.minor;
	
	  this.delayTimer.set(this.reg.v[minor >> 8 & 0xf]);
	};
	
	$_instr_0xF[0x18] = function (_ref4) {
	  //this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
	
	  var major = _ref4.major,
	      minor = _ref4.minor;
	};
	$_instr_0xF[0x1E] = function (_ref5) {
	  var major = _ref5.major,
	      minor = _ref5.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
	};
	
	$_instr_0xF[0x29] = function (_ref6) {
	  var major = _ref6.major,
	      minor = _ref6.minor;
	
	  var val = this.reg.v[minor >> 8 & 0xf];
	  this.reg.i = this.ram.getCharAddrBIOS() + this.ram.getCharSizeBIOS() * val;
	};
	
	$_instr_0xF[0x30] = function (_ref7) {
	  var major = _ref7.major,
	      minor = _ref7.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
	};
	
	$_instr_0xF[0x33] = function (_ref8) // Fx33: bcd [i], Vx (store bcd of reg Vx at address reg i->i+2)
	{
	  var major = _ref8.major,
	      minor = _ref8.minor;
	
	  var v = this.reg.v[minor >> 8 & 0xf];
	  this.ram.data[this.reg.i + 0] = Math.floor(v / 100);
	  this.ram.data[this.reg.i + 1] = Math.floor(v % 100 / 10);
	  this.ram.data[this.reg.i + 2] = v % 10;
	};
	
	$_instr_0xF[0x55] = function (_ref9) {
	  var major = _ref9.major,
	      minor = _ref9.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
	};
	
	$_instr_0xF[0x65] = function (_ref10) // Fx65: mov v0-vx, [i] (load numbers from reg.i into reg.v0 -> reg.vx)
	{
	  var major = _ref10.major,
	      minor = _ref10.minor;
	
	  for (var x = 0, mx = minor >> 8 & 0xf; x <= mx; x++) {
	    this.reg.v[x] = this.ram.data[this.reg.i + x];
	  }this.reg.i += x; // i = i + X + 1
	};
	
	exports.$_instr_0xF = $_instr_0xF;

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var FREQUENCY = 1000 / 60; // 60Hz
	
	var DelayTimer = function () {
	  function DelayTimer() {
	    _classCallCheck(this, DelayTimer);
	
	    this.counter = 0;
	    this._timerId = null;
	  }
	
	  _createClass(DelayTimer, [{
	    key: "set",
	    value: function set(value) {
	      this.counter = value & 0xff;
	      this._start();
	    }
	  }, {
	    key: "get",
	    value: function get(value) {
	      return this.counter;
	    }
	  }, {
	    key: "intervalFunc",
	    value: function intervalFunc() {
	      this.counter--;
	      if (this.counter == 0) this._stop();
	    }
	  }, {
	    key: "_start",
	    value: function _start() {
	      this._timerId = self.setInterval(this.intervalFunc.bind(this));
	    }
	  }, {
	    key: "_stop",
	    value: function _stop() {
	      if (this._timerId) {
	        self.clearInterval(this._timerId);
	        this._timerId = null;
	      }
	    }
	  }]);
	
	  return DelayTimer;
	}();
	
	exports.default = DelayTimer;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _base = __webpack_require__(2);
	
	var _base2 = _interopRequireDefault(_base);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var BIOS_CHAR_BASE_ADDR = 0x0;
	var BIOS_CHAR_SIZE = 5;
	var BIOS_NUM_CHARS = 16;
	var BIOS_KEYB_BASE_ADDR = BIOS_CHAR_SIZE * BIOS_NUM_CHARS;
	
	var RAM = function (_Base) {
	  _inherits(RAM, _Base);
	
	  function RAM() {
	    _classCallCheck(this, RAM);
	
	    var _this = _possibleConstructorReturn(this, (RAM.__proto__ || Object.getPrototypeOf(RAM)).call(this));
	
	    _this._this = "RAM";
	    _this._data = new ArrayBuffer(0x1000);
	    _this.data = new Uint8Array(_this._data);
	    return _this;
	  }
	
	  _createClass(RAM, [{
	    key: 'reset',
	    value: function reset() {
	      //this.data = new Array(0x1000).fill(0);
	    }
	  }, {
	    key: 'getCharAddrBIOS',
	    value: function getCharAddrBIOS() {
	      return BIOS_CHAR_BASE_ADDR;
	    }
	  }, {
	    key: 'getCharSizeBIOS',
	    value: function getCharSizeBIOS() {
	      return BIOS_CHAR_SIZE;
	    }
	
	    // Decided to write the keyboard buffer into system RAM
	    // instead of passing an additional Input() object to the CPU() class
	    // This is probably more like an embedded system would work
	
	  }, {
	    key: 'getKeyboardBufferAddress',
	    value: function getKeyboardBufferAddress() {
	      return BIOS_KEYB_BASE_ADDR;
	    }
	  }, {
	    key: 'readByte',
	    value: function readByte(addr) {
	      this._validate_address(addr);
	      return this.data[addr];
	    }
	  }, {
	    key: 'readWord',
	    value: function readWord(addr) {
	      this._validate_address(addr);
	      return (this.data[addr] & 0xff) << 8 | this.data[addr + 1] & 0xff; // TODO: +1 == gpf ?
	    }
	  }, {
	    key: 'writeByte',
	    value: function writeByte(addr, data) {
	      this._validate_address(addr);
	      this.data[addr] = data;
	    }
	  }, {
	    key: 'writeWord',
	    value: function writeWord(addr, data) {
	      this._validate_address(addr);
	      this.data[addr] = data >> 8 & 0xff;
	      this.data[addr + 1] = data & 0xff;
	    }
	  }, {
	    key: 'blit',
	    value: function blit(typedArray, toAddr) {
	      // Bypass address validation here so we can blit the bios into place
	      this.data.set(typedArray, toAddr);
	    }
	  }, {
	    key: '_validate_address',
	    value: function _validate_address(addr) {
	      if (addr < 0x200) {
	        this.emit('gpf', { error: 'Illegal address: 0x' + addr.toString(16) });
	      }
	
	      if (addr >= 0x1000) {
	        this.emit('gpf', { error: 'Illegal address: 0x' + addr.toString(16) });
	      }
	    }
	  }]);
	
	  return RAM;
	}(_base2.default);
	
	exports.default = RAM;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _base = __webpack_require__(2);
	
	var _base2 = _interopRequireDefault(_base);
	
	var _loglevel = __webpack_require__(6);
	
	var _loglevel2 = _interopRequireDefault(_loglevel);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var WIDTH = 64,
	    HEIGHT = 32;
	var SPRITE_WIDTH = 8;
	
	var GFX = function (_Base) {
	  _inherits(GFX, _Base);
	
	  function GFX(ram) {
	    _classCallCheck(this, GFX);
	
	    var _this = _possibleConstructorReturn(this, (GFX.__proto__ || Object.getPrototypeOf(GFX)).call(this));
	
	    _this._display = new ArrayBuffer(WIDTH * HEIGHT);
	    _this.display = new Uint8Array(_this._display);
	    _this.ram = ram;
	
	    return _this;
	  }
	
	  _createClass(GFX, [{
	    key: 'size',
	    value: function size() {
	      return { width: WIDTH, height: HEIGHT };
	    }
	  }, {
	    key: 'draw',
	    value: function draw(i, sx, sy, height) {
	      var o = sy * WIDTH + sx; // address of display coords
	      var d = WIDTH - SPRITE_WIDTH; // offset delta increment
	      var s = i; // address of sprite in RAM
	      var collision = 0;
	
	      //console.log(`Drawing sprite at ${sx}, ${sy}, offset = ${o}`);
	
	      for (var y = 0; y < height; y++) {
	        var bit_row = this.ram[s++];
	        var pixel = void 0,
	            xor_pixel = void 0;
	        for (var x = SPRITE_WIDTH - 1; x >= 0; x--) {
	          pixel = bit_row >> x & 0x1; //TODO: *MUST* be a smarter way to write this!!
	          xor_pixel = this.display[o] ^ pixel;
	          this.display[o++] = xor_pixel;
	          if (xor_pixel != pixel && xor_pixel == 0) collision = 1;
	        }
	        o += d;
	      }
	
	      // below, debug, write out contents of display to console in a wid * hei grid
	      // for (var y=0; y<HEIGHT; y++)
	      // {
	      //   var st = "";
	      //   if (y < 10) st += "y 0"+y+":"; else st+= "y "+y+":";
	      //   for (var x=0; x<WIDTH; x++)
	      //   {
	      //       st += this.display[(y * WIDTH)+x] ? "1" : "0"
	      //   }
	      //   console.log(st);
	      // }
	
	      this.fire('changed');
	      //if (collision ==1 ) log.info("*** Collision! ***");
	      return collision;
	    }
	
	    // _set_pixel(x, y, v)
	    // {
	    //   let offs = (y*WIDTH)+x;
	    //   this.display[offs] = v;
	    // }
	
	  }, {
	    key: 'clear',
	    value: function clear() {
	      this.display.fill(0);
	      this.fire('changed');
	    }
	  }]);
	
	  return GFX;
	}(_base2.default);
	
	exports.default = GFX;

/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Disassembler = function () {
	  function Disassembler() {
	    _classCallCheck(this, Disassembler);
	  }
	
	  _createClass(Disassembler, [{
	    key: "decode",
	    value: function decode(instr) {
	      var list = Array.isArray(instr) ? instr : [instr];
	      var out = [];
	
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var i = _step.value;
	
	          var d = this._decode_single(i);
	          d.i = "0x" + hex(i);
	          out.push(d);
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	
	      return out.length == 1 ? out[0] : out;
	    }
	  }, {
	    key: "explode",
	    value: function explode(instr_data, from_instr, size) {
	      var to_decode = [];
	      for (var t = from_instr - size * 2; t <= from_instr + size * 2; t += 2) {
	        to_decode.push(instr_data.readWord(t));
	      }
	      return this.decode(to_decode);
	    }
	  }, {
	    key: "_decode_single",
	    value: function _decode_single(instr) {
	      var major = instr >> 12 & 0xf;
	      var minor = instr & 0xfff;
	
	      // e.g. 5XY0: jrq vx, vy
	      var min0 = minor >> 8 & 0xf; // X
	      var min1 = minor >> 4 & 0xf; // Y
	      var min2 = minor & 0xf; // 0
	      var min12 = minor & 0xff; // Y0
	
	      switch (major) {
	        case 0x0:
	          switch (minor) {
	            case 0xe0:
	              return { m: "cls", d: "Clear screen" };break;
	            case 0xee:
	              return { m: "ret", d: "Return from subroutine [stack]" };break;
	            default:
	              return { m: "sys " + minor.toString(16), d: "Jump to routine at address [legacy; ignored by interpreter]" };break;
	          }
	          break;
	        case 0x1:
	          return { m: "jmp 0x" + hex(minor), d: "Jump to address" }; // 1nnn
	          break;
	        case 0x2:
	          return { m: "call 0x" + hex(minor), d: "Call subroutine [stack]" }; // 2nnn
	          break;
	        case 0x3:
	          return { m: "jeq v" + hex(min0) + ", " + min12, d: "Jump over next instruction if operands equal" }; // 3xnn
	          break;
	        case 0x4:
	          return { m: "jnq v" + hex(min0) + ", " + min12, d: "Jump over next instruction if operands not equal" }; // 4xnn
	          break;
	        case 0x5:
	          return { m: "jre v" + hex(min0) + ", v" + hex(min1), d: "Jump over next instruction if registers equal" }; // 5xy0
	          break;
	        case 0x6:
	          return { m: "mov v" + hex(min0) + ", " + min12, d: "Move constant into register" };; // 6xnn
	          break;
	        case 0x7:
	          return { m: "add v" + hex(min0) + ", " + min12, d: "Add constant to register" };; // 7xnn
	          break;
	        case 0x8:
	          switch (min2) {
	            case 0x0:
	              return { m: "mov v" + hex(min0) + ", v" + hex(min1), d: "Move register into register" };break; // 8xy0
	            case 0x1:
	              return { m: "or v" + hex(min0) + ", v" + hex(min1), d: "OR register with register" };break; // 8xy1
	            case 0x2:
	              return { m: "and v" + hex(min0) + ", v" + hex(min1), d: "AND register with register" };break; // 8xy2
	            case 0x3:
	              return { m: "xor v" + hex(min0) + ", v" + hex(min1), d: "XOR register with register" };break; // 8xy2
	            case 0x4:
	              return { m: "add v" + hex(min0) + ", v" + hex(min1), d: "Add register to register" };break; // 8xy4
	            case 0x5:
	              return { m: "sub v" + hex(min0) + ", v" + hex(min1), d: "Subtract register from register" };break; // 8xy5
	            case 0x6:
	              return { m: "shr v" + hex(min0), d: "Shift right register" };break; // 8x06
	            case 0x7:
	              return { m: "rsb v" + hex(min0) + ", v" + hex(min1), d: "Reverse subtract register from register" };break; // 8xy7
	            case 0xe:
	              return { m: "shl v" + hex(min0), d: "Shift left register" };break; // 8x0e
	          }
	          break;
	        case 0x9:
	          return { m: "jrn v" + hex(min0) + ", v" + hex(min1), d: "Jump over next instruction if register not equal" }; // 9xy0
	          break;
	        case 0xA:
	          return { m: "mov i, " + minor, d: "Move constant into Index register" };
	          break;
	        case 0xB:
	          return { m: "jrl 0x" + hex(minor), d: "Jump to address given by constant + v0 register" };
	          break;
	        case 0xC:
	          return { m: "rnd v" + hex(min0) + ", 0x" + hex(min12), d: "Random number AND with constant into register" };
	          break;
	        case 0xD:
	          return { m: "drw v" + hex(min0) + ", v" + hex(min1) + ", " + min2, d: "Draw sprite at registers location of size constant" };
	          break;
	        case 0xE:
	          switch (min12) {
	            case 0x9E:
	              return { m: "jkp v" + hex(min0), d: "Jump if key code in register pressed" };
	              break;
	            case 0xA1:
	              return { m: "jkn v" + hex(min0), d: "Jump if key code in register not pressed" };
	              break;
	          }
	          break;
	        case 0xF:
	          switch (min12) {
	            case 0x07:
	              return { m: "ldt v" + hex(min0), d: "Load delay timer value into register" };
	              break;
	            case 0x0A:
	              return { m: "wait v" + hex(min0), d: "Wait for a key press, store key in register" };
	              break;
	            case 0x15:
	              return { m: "sdt v" + hex(min0), d: "Set delay timer from register" };
	              break;
	            case 0x18:
	              return { m: "sst v" + hex(min0), d: "Set sound timer from register" };
	              break;
	            case 0x1E:
	              return { m: "adi v" + hex(min0), d: "Add register value to Index register" };
	              break;
	            case 0x29:
	              return { m: "ldi v" + hex(min0), d: "Load Index register with sprite address of digit in register" };
	              break;
	            case 0x33:
	              return { m: "bcd v" + hex(min0), d: "Store BCD of register starting at base address Index" };
	              break;
	            case 0x55:
	              return { m: "str v" + hex(min0), d: "Store registers from v0 to register operand at base address Index" };
	              break;
	            case 0x65:
	              return { m: "ldr v" + hex(min0), d: "Set registers from v0 to register operand with values from base address Index" };
	              break;
	          }
	          break;
	
	        default:
	          return { m: "Unknown opcode " + hex(instr), d: "Unknown/illegal instruction" };
	          break;
	      }
	    }
	  }]);
	
	  return Disassembler;
	}();
	
	exports.default = Disassembler;
	
	
	function hex(n) {
	  return n.toString(16);
	}

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDczODVhM2I5Zjc2NzdiNjgyYjAiLCJ3ZWJwYWNrOi8vLy4vY2hpcDgtd29ya2VyLmpzIiwid2VicGFjazovLy8uL3N5c3RlbS9jaGlwOC5qcyIsIndlYnBhY2s6Ly8vLi91dGlsL2Jhc2UuanMiLCJ3ZWJwYWNrOi8vLy4vdXRpbC9ldmVudC5qcyIsIndlYnBhY2s6Ly8vLi91dGlsL2xvYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9kb20vaW5wdXQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2dsZXZlbC9saWIvbG9nbGV2ZWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3lzdGVtL2NwdS9jcHUuanMiLCJ3ZWJwYWNrOi8vLy4vc3lzdGVtL2NwdS9vcGNvZGVzLmpzIiwid2VicGFjazovLy8uL3N5c3RlbS9jcHUvb3Bjb2RlLTB4MC5qcyIsIndlYnBhY2s6Ly8vLi9zeXN0ZW0vY3B1L29wY29kZS0weDguanMiLCJ3ZWJwYWNrOi8vLy4vc3lzdGVtL2NwdS9vcGNvZGUtMHhFLmpzIiwid2VicGFjazovLy8uL3N5c3RlbS9jcHUvb3Bjb2RlLTB4Ri5qcyIsIndlYnBhY2s6Ly8vLi9zeXN0ZW0vdGltZXItZGVsYXkuanMiLCJ3ZWJwYWNrOi8vLy4vc3lzdGVtL3JhbS5qcyIsIndlYnBhY2s6Ly8vLi9zeXN0ZW0vZ2Z4LmpzIiwid2VicGFjazovLy8uL3N5c3RlbS9kaXNhc20uanMiXSwibmFtZXMiOlsiYyIsImxvYWQiLCJwb3dlcm9uIiwiQklPU19VUkwiLCJDaGlwOCIsInNldExldmVsIiwiZGVidWciLCJkaXNhc20iLCJjeWNsZXMiLCJyYW0iLCJnZngiLCJkYXRhIiwiY3B1IiwibG9hZGVyIiwiY3ljbGVUaW1lciIsIl9pbml0RXZlbnRzIiwiX3Jlc2V0IiwiX2luaXRfYmlvcyIsIl9leGVjdXRpbmciLCJ0Iiwib3Bjb2RlIiwiZmV0Y2giLCJleGVjdXRlIiwiZGVjb2RlIiwic2V0SW50ZXJ2YWwiLCJjeWNsZSIsImJpbmQiLCJ3YXJuIiwiY2xlYXJJbnRlcnZhbCIsIl9kdW1wIiwiZCIsInJlZyIsImlwIiwidG9TdHJpbmciLCJtIiwiaGFsdCIsInMiLCJ2IiwibGVuZ3RoIiwiaSIsInZmIiwidXJsIiwiY2FsbGJhY2siLCJpbmZvIiwidGl0bGUiLCJidWZmZXIiLCJfYmFzZTY0VG9BcnJheUJ1ZmZlciIsImJpbmFyeSIsImJsaXQiLCJiaW9zX2RhdGEiLCJieXRlcyIsImJpbiIsInNwbGl0IiwiX2RhdGEiLCJBcnJheUJ1ZmZlciIsIlVpbnQ4QXJyYXkiLCJwIiwiY2hhcmxpbmUiLCJwYXJzZUludCIsImdldENoYXJBZGRyQklPUyIsImJhc2U2NCIsImJpbmFyeV9zdHJpbmciLCJzZWxmIiwiYXRvYiIsImxlbiIsImNoYXJDb2RlQXQiLCJyZXNldCIsIm9uIiwiZW1pdCIsInBvc3RNZXNzYWdlIiwiYWN0aW9uIiwiYXJncyIsImVycm9yIiwidHJhY2UiLCJyZWdpc3RlcnMiLCJkdW1wX3JlZ2lzdGVycyIsImFkZHJlc3MiLCJmcmFtZUJ1ZmZlciIsImRpc3BsYXkiLCJvbm1lc3NhZ2UiLCJtZXNzYWdlSGFuZGxlciIsIm1zZyIsImtleVN0YXRlIiwiZ2V0S2V5Ym9hcmRCdWZmZXJBZGRyZXNzIiwicGF1c2VkdW1wIiwicmVzdW1lIiwiaGFsdGR1bXAiLCJzdGVwIiwiQmFzZSIsIkV2ZW50RW1pdHRlciIsImxpc3RlbmVycyIsIk1hcCIsImFkZExpc3RlbmVyIiwiZmlyZSIsImxhYmVsIiwiZm4iLCJoYXMiLCJzZXQiLCJnZXQiLCJwdXNoIiwib2JqIiwiaW5kZXgiLCJyZWR1Y2UiLCJsaXN0ZW5lciIsIl9pc0Z1bmN0aW9uIiwic3BsaWNlIiwiZm9yRWFjaCIsIkxvYWRlciIsInhtbGh0dHAiLCJYTUxIdHRwUmVxdWVzdCIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsInJlYWR5U3RhdGUiLCJzdGF0dXMiLCJqc29uIiwiSlNPTiIsInBhcnNlIiwicmVzcG9uc2VUZXh0Iiwib3BlbiIsInNlbmQiLCJJbnB1dCIsImtleURhdGEiLCJfY2FsbGJhY2siLCJrZXlNYXAiLCJfaW5pdCIsImtleSIsImsiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImNvZGUiLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJrZXlDb2RlIiwidG9Mb3dlckNhc2UiLCJfc2V0S2V5RG93biIsIl9zZXRLZXlVcCIsIldPUkRfU0laRSIsIklQX0lOSVQiLCJUUkFDRV9CVUZGRVJfU0laRSIsIl9WRiIsIkNQVSIsIl90aGlzIiwia2V5U3RhdGVBZGRyIiwiX3RyYWNlIiwiQXJyYXkiLCJfdHJhY2VfcHRyIiwiZGVsYXlUaW1lciIsIl9pcCIsIl9zcCIsInNwIiwic3RhY2siLCJleGVjIiwiciIsImZpbGwiLCJyZWFkV29yZCIsImluc3RyIiwibWFqb3IiLCJtaW5vciIsIl9hZGRfdG9fdHJhY2VfbG9vcCIsImNhbGwiLCJuZXh0IiwiYSIsInRyYWNlX3Vucm9sbGVkIiwicmV2ZXJzZSIsIl91bnJvbGxfdHJhY2VfbG9vcCIsIm9wY29kZXMiLCJ4Iiwicm5kIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiZHJhdyIsIk1BWF9JTlNUUiIsIiRfaW5zdHJfMHgwIiwiYWRkciIsInBvcCIsIiRfaW5zdHJfMHg4IiwidngiLCJ2eSIsInJ4IiwicnkiLCJyZXMiLCJ5IiwiJF9pbnN0cl8weEUiLCIkX2luc3RyXzB4RiIsInZhbCIsImdldENoYXJTaXplQklPUyIsIm14IiwiRlJFUVVFTkNZIiwiRGVsYXlUaW1lciIsImNvdW50ZXIiLCJfdGltZXJJZCIsInZhbHVlIiwiX3N0YXJ0IiwiX3N0b3AiLCJpbnRlcnZhbEZ1bmMiLCJCSU9TX0NIQVJfQkFTRV9BRERSIiwiQklPU19DSEFSX1NJWkUiLCJCSU9TX05VTV9DSEFSUyIsIkJJT1NfS0VZQl9CQVNFX0FERFIiLCJSQU0iLCJfdmFsaWRhdGVfYWRkcmVzcyIsInR5cGVkQXJyYXkiLCJ0b0FkZHIiLCJXSURUSCIsIkhFSUdIVCIsIlNQUklURV9XSURUSCIsIkdGWCIsIl9kaXNwbGF5Iiwid2lkdGgiLCJoZWlnaHQiLCJzeCIsInN5IiwibyIsImNvbGxpc2lvbiIsImJpdF9yb3ciLCJwaXhlbCIsInhvcl9waXhlbCIsIkRpc2Fzc2VtYmxlciIsImxpc3QiLCJpc0FycmF5Iiwib3V0IiwiX2RlY29kZV9zaW5nbGUiLCJoZXgiLCJpbnN0cl9kYXRhIiwiZnJvbV9pbnN0ciIsInNpemUiLCJ0b19kZWNvZGUiLCJtaW4wIiwibWluMSIsIm1pbjIiLCJtaW4xMiIsIm4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUN0Q0E7Ozs7OztBQUVBLEtBQUlBLElBQUksb0JBQVI7O0FBRUFBLEdBQUVDLElBQUYsQ0FBTyxvQkFBUCxFQUE2QixZQUFNO0FBQUs7QUFDcENELE9BQUVFLE9BQUYsR0FEK0IsQ0FDSztBQUN2QyxFQUZELEU7Ozs7Ozs7Ozs7Ozs7O0FDSEE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7Ozs7Ozs7Ozs7O0FBRUEsS0FBTUMsV0FBWSxhQUFsQjs7S0FFcUJDLEs7OztBQUVuQixvQkFDQTtBQUFBOztBQUFBOztBQUVFLHdCQUFJQyxRQUFKLENBQWEsT0FBYjtBQUNBLHdCQUFJQyxLQUFKLENBQVUsTUFBVjs7QUFFQSxXQUFLQyxNQUFMLEdBQWMsc0JBQWQ7O0FBRUEsV0FBS0MsTUFBTCxHQUFjLENBQWQ7O0FBRUEsV0FBS0MsR0FBTCxHQUFXLG1CQUFYO0FBQ0EsV0FBS0MsR0FBTCxHQUFXLGtCQUFRLE1BQUtELEdBQUwsQ0FBU0UsSUFBakIsQ0FBWDtBQUNBLFdBQUtDLEdBQUwsR0FBVyxrQkFBUSxNQUFLRixHQUFiLEVBQWtCLE1BQUtELEdBQXZCLENBQVg7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QUNUO0FBQ0Ysa0JBQUssSUFBTDtBQUFXLHNCQUFPLEVBQUNJLGFBQVc2TCxJQUFJSyxJQUFKLENBQVosRUFBeUJ0TSxHQUFFLHNEQUEzQixFQUFQO0FBQ1Q7QUFDRixrQkFBSyxJQUFMO0FBQVcsc0JBQU8sRUFBQ0ksYUFBVzZMLElBQUlLLElBQUosQ0FBWixFQUF5QnRNLEdBQUUsbUVBQTNCLEVBQVA7QUFDVDtBQUNGLGtCQUFLLElBQUw7QUFBVyxzQkFBTyxFQUFDSSxhQUFXNkwsSUFBSUssSUFBSixDQUFaLEVBQXlCdE0sR0FBRSwrRUFBM0IsRUFBUDtBQUNUO0FBbkJKO0FBcUJBOztBQUVBO0FBQVMsa0JBQU8sRUFBQ0ksdUJBQW9CNkwsSUFBSXBFLEtBQUosQ0FBckIsRUFBbUM3SCxHQUFFLDZCQUFyQyxFQUFQO0FBQ1A7QUFsRk47QUFvRkg7Ozs7OzttQkE5SGtCNEwsWTs7O0FBaUlyQixVQUFTSyxHQUFULENBQWFTLENBQWIsRUFBZ0I7QUFBRSxVQUFPQSxFQUFFdk0sUUFBRixDQUFXLEVBQVgsQ0FBUDtBQUF3QixFIiwiZmlsZSI6ImQ3Mzg1YTNiOWY3Njc3YjY4MmIwLndvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGQ3Mzg1YTNiOWY3Njc3YjY4MmIwIiwiaW1wb3J0IENoaXA4IGZyb20gJy4vc3lzdGVtL2NoaXA4JztcblxubGV0IGMgPSBuZXcgQ2hpcDgoKTtcblxuYy5sb2FkKCdyb20tanNvbi9wb25nLmpzb24nLCAoKSA9PiB7ICAgIC8vIGluc2VydCB0aGUgY2FydHJpZGdlLi4uXG4gICAgYy5wb3dlcm9uKCk7ICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3dpdGNoIGl0IG9uIDopXG59KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2NoaXA4LXdvcmtlci5qcyIsIlxuaW1wb3J0IEJhc2UgICAgICAgICAgICAgICBmcm9tICcuLi91dGlsL2Jhc2UnO1xuaW1wb3J0IExvYWRlciAgICAgICAgICAgICBmcm9tICcuLi91dGlsL2xvYWRlcic7XG5pbXBvcnQgSW5wdXQgICAgICAgICAgICAgIGZyb20gJy4uL2RvbS9pbnB1dCc7XG5pbXBvcnQgQ1BVICAgICAgICAgICAgICAgIGZyb20gJy4vY3B1L2NwdSc7XG5pbXBvcnQgUkFNICAgICAgICAgICAgICAgIGZyb20gJy4vcmFtJztcbmltcG9ydCBHRlggICAgICAgICAgICAgICAgZnJvbSAnLi9nZngnO1xuaW1wb3J0IGxvZyAgICAgICAgICAgICAgICBmcm9tICdsb2dsZXZlbCc7XG5cbmltcG9ydCBEaXNhc3NlbWJsZXIgICAgICAgZnJvbSAnLi9kaXNhc20nO1xuXG5jb25zdCBCSU9TX1VSTCAgPSBcIi4vYmlvcy5qc29uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoaXA4IGV4dGVuZHMgQmFzZVxue1xuICBjb25zdHJ1Y3RvcigpXG4gIHtcbiAgICBzdXBlcigpO1xuICAgIGxvZy5zZXRMZXZlbCgnZGVidWcnKTtcbiAgICBsb2cuZGVidWcoXCJUZXN0XCIpO1xuXG4gICAgdGhpcy5kaXNhc20gPSBuZXcgRGlzYXNzZW1ibGVyKCk7XG5cbiAgICB0aGlzLmN5Y2xlcyA9IDE7XG5cbiAgICB0aGlzLnJhbSA9IG5ldyBSQU0oKTtcbiAgICB0aGlzLmdmeCA9IG5ldyBHRlgodGhpcy5yYW0uZGF0YSk7XG4gICAgdGhpcy5jcHUgPSBuZXcgQ1BVKHRoaXMuZ2Z4LCB0aGlzLnJhbSk7XG5cbiAgICB0aGlzLmxvYWRlciA9IG5ldyBMb2FkZXIoKTtcbiAgICB0aGlzLmN5Y2xlVGltZXIgPSBudWxsO1xuXG4gICAgdGhpcy5faW5pdEV2ZW50cygpO1xuICAgIHRoaXMuX3Jlc2V0KCk7XG4gICAgdGhpcy5faW5pdF9iaW9zKCk7XG4gICAgdGhpcy5fZXhlY3V0aW5nID0gZmFsc2U7XG4gIH1cblxuICBjeWNsZSgpXG4gIHtcbiAgICAvL2NvbnNvbGUubG9nKFwiY3ljbGVcIik7IHJldHVybjtcbiAgICBmb3IgKGxldCB0PTA7IHQ8dGhpcy5jeWNsZXM7IHQrKylcbiAgICB7XG4gICAgICBpZiAoIXRoaXMuX2V4ZWN1dGluZykgcmV0dXJuO1xuICAgICAgbGV0IG9wY29kZSA9IHRoaXMuY3B1LmZldGNoKCk7XG4gICAgICAvL2xldCBkID0gdGhpcy5kaXNhc20uZGVjb2RlKG9wY29kZSk7XG4gICAgLy8gIGxvZy5kZWJ1ZyhgWyR7dGhpcy5jcHUucmVnLmlwLnRvU3RyaW5nKDE2KX1dICR7ZC5tfVxcdFxcdCR7ZC5kfWApO1xuICAgICAgdGhpcy5jcHUuZXhlY3V0ZShcbiAgICAgICAgdGhpcy5jcHUuZGVjb2RlKFxuICAgICAgICAgIG9wY29kZVxuICAgICAgICApXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgcG93ZXJvbigpXG4gIHtcbiAgICB0aGlzLl9leGVjdXRpbmcgPSB0cnVlO1xuICAgIHRoaXMuY3ljbGVUaW1lciA9IHNldEludGVydmFsKCh0aGlzLmN5Y2xlKS5iaW5kKHRoaXMpLCAxMCk7XG4gIH1cblxuICBoYWx0KClcbiAge1xuICAgIGxvZy53YXJuKFwiSGFsdGluZyBleGVjdXRpb24uLi5cIik7XG4gICAgdGhpcy5fZXhlY3V0aW5nID0gZmFsc2U7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLmN5Y2xlVGltZXIpO1xuICB9XG5cbiAgcGF1c2VkdW1wKClcbiAge1xuICAgIHRoaXMuX2V4ZWN1dGluZyA9IGZhbHNlO1xuICAgIHRoaXMuX2R1bXAoKTtcbiAgfVxuXG4gIHN0ZXAoKVxuICB7XG4gICAgdGhpcy5fZXhlY3V0aW5nID0gZmFsc2U7XG5cbiAgICBsZXQgb3Bjb2RlID0gdGhpcy5jcHUuZmV0Y2goKTtcbiAgICBsZXQgZCA9IHRoaXMuZGlzYXNtLmRlY29kZShvcGNvZGUpO1xuICAgIGxvZy5kZWJ1ZyhgWyR7dGhpcy5jcHUucmVnLmlwLnRvU3RyaW5nKDE2KX1dICR7ZC5tfVxcdFxcdCR7ZC5kfWApO1xuICAgIHRoaXMuY3B1LmV4ZWN1dGUoXG4gICAgICB0aGlzLmNwdS5kZWNvZGUoXG4gICAgICAgIG9wY29kZVxuICAgICAgKVxuICAgIClcblxuICAgIHRoaXMuX2R1bXAoKTtcbiAgfVxuXG4gIHJlc3VtZSgpXG4gIHtcbiAgICB0aGlzLl9leGVjdXRpbmcgPSB0cnVlO1xuICB9XG5cbiAgaGFsdGR1bXAoKVxuICB7XG4gICAgdGhpcy5oYWx0KCk7XG4gICAgdGhpcy5fZHVtcCgpO1xuICB9XG5cbiAgX2R1bXAoKVxuICB7XG4gICAgbGV0IHMgPSAnJztcblxuICAgIGZvciAobGV0IHQ9MCx7dn09dGhpcy5jcHUucmVnOyB0PHYubGVuZ3RoOyB0KyspXG4gICAge1xuICAgICAgcyArPSBgdiR7dC50b1N0cmluZygxNil9PSR7dlt0XX1gO1xuICAgICAgcyArPSB0PHYubGVuZ3RoLTEgPyAnLCAnIDogJyc7XG4gICAgfVxuXG4gICAgbG9nLndhcm4ocyk7XG4gICAgbG9nLndhcm4oYGk9JHt0aGlzLmNwdS5yZWcuaX0sIHZmPSR7dGhpcy5jcHUucmVnLnZmfSwgaXA9MHgke3RoaXMuY3B1LnJlZy5pcC50b1N0cmluZygxNil9YCk7XG4gIH1cblxuICBsb2FkKHVybCwgY2FsbGJhY2spXG4gIHtcbiAgICBsb2cuZGVidWcoYEZldGNoaW5nOiAnJHt1cmx9J2ApO1xuXG4gICAgdGhpcy5sb2FkZXIubG9hZCh1cmwsIChkYXRhKSA9PiB7XG4gICAgICBsb2cuaW5mbyhgT3BlbmluZyB0aXRsZSAnJHtkYXRhLnRpdGxlfSdgKTtcblxuICAgICAgbGV0IGJ1ZmZlciA9IHRoaXMuX2Jhc2U2NFRvQXJyYXlCdWZmZXIoZGF0YS5iaW5hcnkpO1xuICAgICAgdGhpcy5yYW0uYmxpdChidWZmZXIsIDUxMik7XG5cbiAgICAgIGNhbGxiYWNrKCk7XG5cbiAgICB9KTtcbiAgfVxuXG4gIF9pbml0X2Jpb3MoKVxuICB7XG4gICAgLy8gTG9hZCB0aGUgXCJCSU9TXCIgY2hhcmFjdGVycyBpbnRvIHRoZSBwcm90ZWN0ZWQgYXJlYVxuXG4gICAgdGhpcy5sb2FkZXIubG9hZChCSU9TX1VSTCwgKGJpb3NfZGF0YSkgPT4ge1xuXG4gICAgICBsZXQgYnl0ZXMgPSBiaW9zX2RhdGEuYmluLnNwbGl0KCcsJyk7XG4gICAgICBsZXQgX2RhdGEgPSBuZXcgQXJyYXlCdWZmZXIoYnl0ZXMubGVuZ3RoKTtcbiAgICAgIGxldCBkYXRhID0gbmV3IFVpbnQ4QXJyYXkoX2RhdGEpO1xuICAgICAgbGV0IHAgPSAwO1xuXG4gICAgICBmb3IgKGxldCBjaGFybGluZSBvZiBieXRlcylcbiAgICAgICAgZGF0YVtwKytdID0gKHBhcnNlSW50KFwiMHhcIitjaGFybGluZSwgMTYpICYgMHhmZik7XG5cbiAgICAgIHRoaXMucmFtLmJsaXQoZGF0YSwgdGhpcy5yYW0uZ2V0Q2hhckFkZHJCSU9TKCkpO1xuICAgIH0pO1xuXG4gIH1cblxuICBfYmFzZTY0VG9BcnJheUJ1ZmZlcihiYXNlNjQpXG4gIHtcbiAgICB2YXIgYmluYXJ5X3N0cmluZyA9ICBzZWxmLmF0b2IoYmFzZTY0KTtcbiAgICB2YXIgbGVuID0gYmluYXJ5X3N0cmluZy5sZW5ndGg7XG5cbiAgICB2YXIgYnl0ZXMgPSBuZXcgVWludDhBcnJheSggbGVuICk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgICAgYnl0ZXNbaV0gPSBiaW5hcnlfc3RyaW5nLmNoYXJDb2RlQXQoaSk7XG5cbiAgICByZXR1cm4gYnl0ZXM7XG4gIH1cblxuICBfcmVzZXQoKVxuICB7XG4gICAgdGhpcy5jcHUucmVzZXQoKTtcbiAgICB0aGlzLnJhbS5yZXNldCgpO1xuICB9XG5cbiAgX2luaXRFdmVudHMoKVxuICB7XG4gICAgdGhpcy5yYW0ub24oJ2dwZicsIChmdW5jdGlvbihkYXRhKSB7XG4gICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgZGF0YSk7XG4gICAgfSkuYmluZCh0aGlzKSk7IC8vIE92ZXJyaWRlICd0aGlzJyB0byB1c2UgQ2hpcDgoKSBjb250ZXh0IGluc3RlYWQgb2YgUkFNKCknc1xuXG4gICAgdGhpcy5jcHUub24oJ2RlYnVnJywgKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHRoaXMuX2V4ZWN1dGluZyA9IGZhbHNlO1xuICAgIH0pLmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5jcHUub24oJ29wY29kZScsIChmdW5jdGlvbihkYXRhKSB7XG4gICAgICB0aGlzLmhhbHQoKTtcbiAgICAgIHNlbGYucG9zdE1lc3NhZ2Uoe1xuICAgICAgICBhY3Rpb246ICdlcnJvcicsXG4gICAgICAgIGFyZ3M6e1xuICAgICAgICAgIGVycm9yOiBkYXRhLmVycm9yLFxuICAgICAgICAgIHRyYWNlOiB0aGlzLmNwdS50cmFjZSgpLFxuICAgICAgICAgIHJlZ2lzdGVyczogdGhpcy5jcHUuZHVtcF9yZWdpc3RlcnMoKSxcbiAgICAgICAgICBhZGRyZXNzOiB0aGlzLmNwdS5yZWcuaXBcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSkuYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLmdmeC5vbignY2hhbmdlZCcsIChmdW5jdGlvbigpIHtcbiAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgYWN0aW9uOiAncmVuZGVyJyxcbiAgICAgICAgICBhcmdzOiB7XG4gICAgICAgICAgICBmcmFtZUJ1ZmZlcjogdGhpcy5nZnguZGlzcGxheVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSkuYmluZCh0aGlzKSk7XG5cbiAgICBzZWxmLm9ubWVzc2FnZSA9ICh0aGlzLm1lc3NhZ2VIYW5kbGVyKS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgbWVzc2FnZUhhbmRsZXIobXNnKVxuICB7XG4gICAgc3dpdGNoKG1zZy5kYXRhLmFjdGlvbilcbiAgICB7XG4gICAgICBjYXNlICdpbnB1dCc6XG4gICAgICAgIHRoaXMucmFtLmJsaXQobXNnLmRhdGEuYXJncy5rZXlTdGF0ZSwgdGhpcy5yYW0uZ2V0S2V5Ym9hcmRCdWZmZXJBZGRyZXNzKCkpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3BhdXNlJzpcbiAgICAgICAgdGhpcy5wYXVzZWR1bXAoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZXN1bWUnOlxuICAgICAgICB0aGlzLnJlc3VtZSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2hhbHRkdW1wJzpcbiAgICAgICAgdGhpcy5oYWx0ZHVtcCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3N0ZXAnOlxuICAgICAgICB0aGlzLnN0ZXAoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cblxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3lzdGVtL2NoaXA4LmpzIiwiXG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJy4vZXZlbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlIGV4dGVuZHMgRXZlbnRFbWl0dGVyXG57XG5cbiAgY29uc3RydWN0b3IgKClcbiAge1xuICAgIHN1cGVyKCk7XG5cbiAgfVxuXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi91dGlsL2Jhc2UuanMiLCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRFbWl0dGVyXG57XG4gIGNvbnN0cnVjdG9yKClcbiAge1xuICAgIHRoaXMubGlzdGVuZXJzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMub24gPSB0aGlzLmFkZExpc3RlbmVyO1xuICAgIHRoaXMuZmlyZSA9IHRoaXMuZW1pdDtcblxuICB9XG5cbiAgYWRkTGlzdGVuZXIobGFiZWwsIGZuKVxuICB7XG4gICAgdGhpcy5saXN0ZW5lcnMuaGFzKGxhYmVsKSB8fCB0aGlzLmxpc3RlbmVycy5zZXQobGFiZWwsIFtdKTtcbiAgICB0aGlzLmxpc3RlbmVycy5nZXQobGFiZWwpLnB1c2goZm4pO1xuICB9XG5cbiAgX2lzRnVuY3Rpb24ob2JqKVxuICB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT0gJ2Z1bmN0aW9uJyB8fCBmYWxzZTtcbiAgfVxuXG4gIHJlbW92ZUxpc3RlbmVyKGxhYmVsLCBmbilcbiAge1xuICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVycy5nZXQobGFiZWwpLFxuICAgICAgICBpbmRleDtcblxuICAgIGlmIChsaXN0ZW5lcnMgJiYgbGlzdGVuZXJzLmxlbmd0aClcbiAgICB7XG4gICAgICAgIGluZGV4ID0gbGlzdGVuZXJzLnJlZHVjZSgoaSwgbGlzdGVuZXIsIGluZGV4KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChfaXNGdW5jdGlvbihsaXN0ZW5lcikgJiYgbGlzdGVuZXIgPT09IGNhbGxiYWNrKSA/XG4gICAgICAgICAgICBpID0gaW5kZXggOlxuICAgICAgICAgICAgaTtcbiAgICAgICAgfSwgLTEpO1xuXG4gICAgICAgIGlmIChpbmRleCA+IC0xKVxuICAgICAgICB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzLnNldChsYWJlbCwgbGlzdGVuZXJzKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGVtaXQobGFiZWwsIC4uLmFyZ3MpXG4gIHtcbiAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnMuZ2V0KGxhYmVsKTtcbiAgICBpZiAobGlzdGVuZXJzICYmIGxpc3RlbmVycy5sZW5ndGgpXG4gICAge1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyKSA9PiB7XG4gICAgICAgIGxpc3RlbmVyKC4uLmFyZ3MpXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3V0aWwvZXZlbnQuanMiLCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9hZGVyXG57XG4gIGNvbnN0cnVjdG9yKClcbiAge1xuXG4gIH1cblxuICBsb2FkKHVybCwgZm4pXG4gIHtcbiAgICBsZXQgeG1saHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgeG1saHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PSA0ICYmIHRoaXMuc3RhdHVzID09IDIwMCkge1xuICAgICAgICAgICAgdmFyIGpzb24gPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIGZuKGpzb24pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHhtbGh0dHAub3BlbihcIkdFVFwiLCB1cmwsIHRydWUpO1xuICAgIHhtbGh0dHAuc2VuZCgpO1xuICB9XG5cblxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vdXRpbC9sb2FkZXIuanMiLCJpbXBvcnQgbG9nIGZyb20gJ2xvZ2xldmVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5wdXRcbntcbiAgLy8gTm90ZSwgdGhlIGtleXN0YXRlcyBhcmUgd3JpdHRlbiBkaXJlY2x0eSBpbnRvIHRoZSBDaGlwOCdzIEJJT1MvUkFNXG4gIC8vIGZvciBkaXJlY3QgYWNjZXNzIGJ5IHRoZSBDUFVcblxuICBjb25zdHJ1Y3RvcihjYWxsYmFjaylcbiAge1xuICAgIC8vIDEgMiAzIENcbiAgICAvLyA0IDUgNiBEXG4gICAgLy8gNyA4IDkgRVxuICAgIC8vIEEgMCBCIEZcbiAgICAvLyB0aGlzLmtleU1hcCA9IFtcbiAgICAvLyAgIDE6JzEnLCAyOicyJywgMzonMycsIGM6JzQnLFxuICAgIC8vICAgNDoncScsIDU6J3cnLCA2OidlJywgZDoncicsXG4gICAgLy8gICA3OidhJywgODoncycsIDk6J2QnLCBlOidmJyxcbiAgICAvLyAgIDEwOid6JywgOjAneCcsIEI6J2MnLCBmOid2J1xuICAgIC8vIF07XG5cbiAgICB0aGlzLmtleURhdGEgPSBuZXcgVWludDhBcnJheSgxNik7XG4gICAgdGhpcy5fY2FsbGJhY2sgPSBjYWxsYmFjaztcblxuICAgIHRoaXMua2V5TWFwID0gW1xuICAgICAgJ3gnLCAnMScsICcyJywgJzMnLFxuICAgICAgJ3EnLCAndycsICdlJywgJ2EnLFxuICAgICAgJ3MnLCAnZCcsICd6JywgJ2MnLFxuICAgICAgJzQnLCAncicsICdmJywgJ3YnXG4gICAgXTtcblxuICAgIHRoaXMuX2luaXQoKTtcbiAgfVxuXG4gIF9zZXRLZXlEb3duKGtleSlcbiAge1xuICAgICAgdGhpcy5rZXlEYXRhW2tleV0gPSAxO1xuICAgICAgaWYgKHRoaXMuX2NhbGxiYWNrKSB0aGlzLl9jYWxsYmFjayh0aGlzLmtleURhdGEpO1xuICB9XG5cbiAgX3NldEtleVVwKGtleSlcbiAge1xuICAgICAgdGhpcy5rZXlEYXRhW2tleV0gPSAwO1xuICAgICAgaWYgKHRoaXMuX2NhbGxiYWNrKSB0aGlzLl9jYWxsYmFjayh0aGlzLmtleURhdGEpO1xuICB9XG5cbiAgX2luaXQoKVxuICB7XG4gICAgLy9IQUNLOiBjb252ZXJ0IGFycmF5IGludG8gaW50ZWdlciBhc2NpaSBjb2RlcyBmb3IgcXVpY2tlciBsb29rdXBcbiAgICBmb3IgKGxldCBrPTA7azx0aGlzLmtleU1hcC5sZW5ndGg7aysrKVxuICAgICAgdGhpcy5rZXlNYXBba10gPSB0aGlzLmtleU1hcFtrXS5jaGFyQ29kZUF0KDApO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgICAgdmFyIGNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUua2V5Q29kZSkudG9Mb3dlckNhc2UoKS5jaGFyQ29kZUF0KDApXG4gICAgICBmb3IgKGxldCBrPTA7IGs8dGhpcy5rZXlNYXAubGVuZ3RoOyBrKyspXG4gICAgICB7XG4gICAgICAgIGlmICh0aGlzLmtleU1hcFtrXSA9PSBjb2RlKVxuICAgICAgICAgIHRoaXMuX3NldEtleURvd24oayk7XG4gICAgICB9XG4gICAgICAvL3RoaXMucHJpbnRUYWJsZSgpO1xuICAgIH0sIHRydWUpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGUpID0+IHtcbiAgICAgIC8vbG9nLndhcm4oKTtcbiAgICAgIHZhciBjb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLmtleUNvZGUpLnRvTG93ZXJDYXNlKCkuY2hhckNvZGVBdCgwKVxuICAgICAgZm9yIChsZXQgaz0wOyBrPHRoaXMua2V5TWFwLmxlbmd0aDsgaysrKVxuICAgICAge1xuICAgICAgICBpZiAodGhpcy5rZXlNYXBba10gPT0gY29kZSlcbiAgICAgICAgICB0aGlzLl9zZXRLZXlVcChrKTtcbiAgICAgIH1cbiAgICB9LCB0cnVlKTtcblxuICB9XG5cblxuXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9kb20vaW5wdXQuanMiLCIvKlxuKiBsb2dsZXZlbCAtIGh0dHBzOi8vZ2l0aHViLmNvbS9waW10ZXJyeS9sb2dsZXZlbFxuKlxuKiBDb3B5cmlnaHQgKGMpIDIwMTMgVGltIFBlcnJ5XG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiovXG4oZnVuY3Rpb24gKHJvb3QsIGRlZmluaXRpb24pIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShkZWZpbml0aW9uKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3QubG9nID0gZGVmaW5pdGlvbigpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBub29wID0gZnVuY3Rpb24oKSB7fTtcbiAgICB2YXIgdW5kZWZpbmVkVHlwZSA9IFwidW5kZWZpbmVkXCI7XG5cbiAgICBmdW5jdGlvbiByZWFsTWV0aG9kKG1ldGhvZE5hbWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSB1bmRlZmluZWRUeXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vIFdlIGNhbid0IGJ1aWxkIGEgcmVhbCBtZXRob2Qgd2l0aG91dCBhIGNvbnNvbGUgdG8gbG9nIHRvXG4gICAgICAgIH0gZWxzZSBpZiAoY29uc29sZVttZXRob2ROYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gYmluZE1ldGhvZChjb25zb2xlLCBtZXRob2ROYW1lKTtcbiAgICAgICAgfSBlbHNlIGlmIChjb25zb2xlLmxvZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gYmluZE1ldGhvZChjb25zb2xlLCAnbG9nJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbm9vcDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJpbmRNZXRob2Qob2JqLCBtZXRob2ROYW1lKSB7XG4gICAgICAgIHZhciBtZXRob2QgPSBvYmpbbWV0aG9kTmFtZV07XG4gICAgICAgIGlmICh0eXBlb2YgbWV0aG9kLmJpbmQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiBtZXRob2QuYmluZChvYmopO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuY2FsbChtZXRob2QsIG9iaik7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgLy8gTWlzc2luZyBiaW5kIHNoaW0gb3IgSUU4ICsgTW9kZXJuaXpyLCBmYWxsYmFjayB0byB3cmFwcGluZ1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5hcHBseShtZXRob2QsIFtvYmosIGFyZ3VtZW50c10pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB0aGVzZSBwcml2YXRlIGZ1bmN0aW9ucyBhbHdheXMgbmVlZCBgdGhpc2AgdG8gYmUgc2V0IHByb3Blcmx5XG5cbiAgICBmdW5jdGlvbiBlbmFibGVMb2dnaW5nV2hlbkNvbnNvbGVBcnJpdmVzKG1ldGhvZE5hbWUsIGxldmVsLCBsb2dnZXJOYW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IHVuZGVmaW5lZFR5cGUpIHtcbiAgICAgICAgICAgICAgICByZXBsYWNlTG9nZ2luZ01ldGhvZHMuY2FsbCh0aGlzLCBsZXZlbCwgbG9nZ2VyTmFtZSk7XG4gICAgICAgICAgICAgICAgdGhpc1ttZXRob2ROYW1lXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlcGxhY2VMb2dnaW5nTWV0aG9kcyhsZXZlbCwgbG9nZ2VyTmFtZSkge1xuICAgICAgICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxvZ01ldGhvZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBtZXRob2ROYW1lID0gbG9nTWV0aG9kc1tpXTtcbiAgICAgICAgICAgIHRoaXNbbWV0aG9kTmFtZV0gPSAoaSA8IGxldmVsKSA/XG4gICAgICAgICAgICAgICAgbm9vcCA6XG4gICAgICAgICAgICAgICAgdGhpcy5tZXRob2RGYWN0b3J5KG1ldGhvZE5hbWUsIGxldmVsLCBsb2dnZXJOYW1lKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlZmF1bHRNZXRob2RGYWN0b3J5KG1ldGhvZE5hbWUsIGxldmVsLCBsb2dnZXJOYW1lKSB7XG4gICAgICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICAgIHJldHVybiByZWFsTWV0aG9kKG1ldGhvZE5hbWUpIHx8XG4gICAgICAgICAgICAgICBlbmFibGVMb2dnaW5nV2hlbkNvbnNvbGVBcnJpdmVzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgdmFyIGxvZ01ldGhvZHMgPSBbXG4gICAgICAgIFwidHJhY2VcIixcbiAgICAgICAgXCJkZWJ1Z1wiLFxuICAgICAgICBcImluZm9cIixcbiAgICAgICAgXCJ3YXJuXCIsXG4gICAgICAgIFwiZXJyb3JcIlxuICAgIF07XG5cbiAgICBmdW5jdGlvbiBMb2dnZXIobmFtZSwgZGVmYXVsdExldmVsLCBmYWN0b3J5KSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICB2YXIgY3VycmVudExldmVsO1xuICAgICAgdmFyIHN0b3JhZ2VLZXkgPSBcImxvZ2xldmVsXCI7XG4gICAgICBpZiAobmFtZSkge1xuICAgICAgICBzdG9yYWdlS2V5ICs9IFwiOlwiICsgbmFtZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcGVyc2lzdExldmVsSWZQb3NzaWJsZShsZXZlbE51bSkge1xuICAgICAgICAgIHZhciBsZXZlbE5hbWUgPSAobG9nTWV0aG9kc1tsZXZlbE51bV0gfHwgJ3NpbGVudCcpLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgICAvLyBVc2UgbG9jYWxTdG9yYWdlIGlmIGF2YWlsYWJsZVxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Vbc3RvcmFnZUtleV0gPSBsZXZlbE5hbWU7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XG5cbiAgICAgICAgICAvLyBVc2Ugc2Vzc2lvbiBjb29raWUgYXMgZmFsbGJhY2tcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQuY29va2llID1cbiAgICAgICAgICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoc3RvcmFnZUtleSkgKyBcIj1cIiArIGxldmVsTmFtZSArIFwiO1wiO1xuICAgICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZ2V0UGVyc2lzdGVkTGV2ZWwoKSB7XG4gICAgICAgICAgdmFyIHN0b3JlZExldmVsO1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSB3aW5kb3cubG9jYWxTdG9yYWdlW3N0b3JhZ2VLZXldO1xuICAgICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cblxuICAgICAgICAgIGlmICh0eXBlb2Ygc3RvcmVkTGV2ZWwgPT09IHVuZGVmaW5lZFR5cGUpIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIHZhciBjb29raWUgPSB3aW5kb3cuZG9jdW1lbnQuY29va2llO1xuICAgICAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0gY29va2llLmluZGV4T2YoXG4gICAgICAgICAgICAgICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KHN0b3JhZ2VLZXkpICsgXCI9XCIpO1xuICAgICAgICAgICAgICAgICAgaWYgKGxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSAvXihbXjtdKykvLmV4ZWMoY29va2llLnNsaWNlKGxvY2F0aW9uKSlbMV07XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBJZiB0aGUgc3RvcmVkIGxldmVsIGlzIG5vdCB2YWxpZCwgdHJlYXQgaXQgYXMgaWYgbm90aGluZyB3YXMgc3RvcmVkLlxuICAgICAgICAgIGlmIChzZWxmLmxldmVsc1tzdG9yZWRMZXZlbF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBzdG9yZWRMZXZlbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gc3RvcmVkTGV2ZWw7XG4gICAgICB9XG5cbiAgICAgIC8qXG4gICAgICAgKlxuICAgICAgICogUHVibGljIEFQSVxuICAgICAgICpcbiAgICAgICAqL1xuXG4gICAgICBzZWxmLmxldmVscyA9IHsgXCJUUkFDRVwiOiAwLCBcIkRFQlVHXCI6IDEsIFwiSU5GT1wiOiAyLCBcIldBUk5cIjogMyxcbiAgICAgICAgICBcIkVSUk9SXCI6IDQsIFwiU0lMRU5UXCI6IDV9O1xuXG4gICAgICBzZWxmLm1ldGhvZEZhY3RvcnkgPSBmYWN0b3J5IHx8IGRlZmF1bHRNZXRob2RGYWN0b3J5O1xuXG4gICAgICBzZWxmLmdldExldmVsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjdXJyZW50TGV2ZWw7XG4gICAgICB9O1xuXG4gICAgICBzZWxmLnNldExldmVsID0gZnVuY3Rpb24gKGxldmVsLCBwZXJzaXN0KSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBsZXZlbCA9PT0gXCJzdHJpbmdcIiAmJiBzZWxmLmxldmVsc1tsZXZlbC50b1VwcGVyQ2FzZSgpXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGxldmVsID0gc2VsZi5sZXZlbHNbbGV2ZWwudG9VcHBlckNhc2UoKV07XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0eXBlb2YgbGV2ZWwgPT09IFwibnVtYmVyXCIgJiYgbGV2ZWwgPj0gMCAmJiBsZXZlbCA8PSBzZWxmLmxldmVscy5TSUxFTlQpIHtcbiAgICAgICAgICAgICAgY3VycmVudExldmVsID0gbGV2ZWw7XG4gICAgICAgICAgICAgIGlmIChwZXJzaXN0ICE9PSBmYWxzZSkgeyAgLy8gZGVmYXVsdHMgdG8gdHJ1ZVxuICAgICAgICAgICAgICAgICAgcGVyc2lzdExldmVsSWZQb3NzaWJsZShsZXZlbCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVwbGFjZUxvZ2dpbmdNZXRob2RzLmNhbGwoc2VsZiwgbGV2ZWwsIG5hbWUpO1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgPT09IHVuZGVmaW5lZFR5cGUgJiYgbGV2ZWwgPCBzZWxmLmxldmVscy5TSUxFTlQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBcIk5vIGNvbnNvbGUgYXZhaWxhYmxlIGZvciBsb2dnaW5nXCI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdyBcImxvZy5zZXRMZXZlbCgpIGNhbGxlZCB3aXRoIGludmFsaWQgbGV2ZWw6IFwiICsgbGV2ZWw7XG4gICAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgc2VsZi5zZXREZWZhdWx0TGV2ZWwgPSBmdW5jdGlvbiAobGV2ZWwpIHtcbiAgICAgICAgICBpZiAoIWdldFBlcnNpc3RlZExldmVsKCkpIHtcbiAgICAgICAgICAgICAgc2VsZi5zZXRMZXZlbChsZXZlbCwgZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHNlbGYuZW5hYmxlQWxsID0gZnVuY3Rpb24ocGVyc2lzdCkge1xuICAgICAgICAgIHNlbGYuc2V0TGV2ZWwoc2VsZi5sZXZlbHMuVFJBQ0UsIHBlcnNpc3QpO1xuICAgICAgfTtcblxuICAgICAgc2VsZi5kaXNhYmxlQWxsID0gZnVuY3Rpb24ocGVyc2lzdCkge1xuICAgICAgICAgIHNlbGYuc2V0TGV2ZWwoc2VsZi5sZXZlbHMuU0lMRU5ULCBwZXJzaXN0KTtcbiAgICAgIH07XG5cbiAgICAgIC8vIEluaXRpYWxpemUgd2l0aCB0aGUgcmlnaHQgbGV2ZWxcbiAgICAgIHZhciBpbml0aWFsTGV2ZWwgPSBnZXRQZXJzaXN0ZWRMZXZlbCgpO1xuICAgICAgaWYgKGluaXRpYWxMZXZlbCA9PSBudWxsKSB7XG4gICAgICAgICAgaW5pdGlhbExldmVsID0gZGVmYXVsdExldmVsID09IG51bGwgPyBcIldBUk5cIiA6IGRlZmF1bHRMZXZlbDtcbiAgICAgIH1cbiAgICAgIHNlbGYuc2V0TGV2ZWwoaW5pdGlhbExldmVsLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKlxuICAgICAqIFBhY2thZ2UtbGV2ZWwgQVBJXG4gICAgICpcbiAgICAgKi9cblxuICAgIHZhciBkZWZhdWx0TG9nZ2VyID0gbmV3IExvZ2dlcigpO1xuXG4gICAgdmFyIF9sb2dnZXJzQnlOYW1lID0ge307XG4gICAgZGVmYXVsdExvZ2dlci5nZXRMb2dnZXIgPSBmdW5jdGlvbiBnZXRMb2dnZXIobmFtZSkge1xuICAgICAgICBpZiAodHlwZW9mIG5hbWUgIT09IFwic3RyaW5nXCIgfHwgbmFtZSA9PT0gXCJcIikge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJZb3UgbXVzdCBzdXBwbHkgYSBuYW1lIHdoZW4gY3JlYXRpbmcgYSBsb2dnZXIuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxvZ2dlciA9IF9sb2dnZXJzQnlOYW1lW25hbWVdO1xuICAgICAgICBpZiAoIWxvZ2dlcikge1xuICAgICAgICAgIGxvZ2dlciA9IF9sb2dnZXJzQnlOYW1lW25hbWVdID0gbmV3IExvZ2dlcihcbiAgICAgICAgICAgIG5hbWUsIGRlZmF1bHRMb2dnZXIuZ2V0TGV2ZWwoKSwgZGVmYXVsdExvZ2dlci5tZXRob2RGYWN0b3J5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG9nZ2VyO1xuICAgIH07XG5cbiAgICAvLyBHcmFiIHRoZSBjdXJyZW50IGdsb2JhbCBsb2cgdmFyaWFibGUgaW4gY2FzZSBvZiBvdmVyd3JpdGVcbiAgICB2YXIgX2xvZyA9ICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlKSA/IHdpbmRvdy5sb2cgOiB1bmRlZmluZWQ7XG4gICAgZGVmYXVsdExvZ2dlci5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlICYmXG4gICAgICAgICAgICAgICB3aW5kb3cubG9nID09PSBkZWZhdWx0TG9nZ2VyKSB7XG4gICAgICAgICAgICB3aW5kb3cubG9nID0gX2xvZztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZWZhdWx0TG9nZ2VyO1xuICAgIH07XG5cbiAgICByZXR1cm4gZGVmYXVsdExvZ2dlcjtcbn0pKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2dsZXZlbC9saWIvbG9nbGV2ZWwuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXG5pbXBvcnQgbG9nIGZyb20gJ2xvZ2xldmVsJztcbmltcG9ydCBCYXNlIGZyb20gJy4uLy4uL3V0aWwvYmFzZSc7XG5pbXBvcnQge29wY29kZXN9IGZyb20gJy4vb3Bjb2Rlcyc7XG5cbmltcG9ydCBEZWxheVRpbWVyICAgICAgICAgZnJvbSAnLi4vdGltZXItZGVsYXknO1xuXG5jb25zdCBXT1JEX1NJWkUgPSAyOyAgICAgICAgICAgIC8vIDE2LWJpdCBpbnN0cnVjdGlvblxuY29uc3QgSVBfSU5JVCA9IDB4MjAwOyAgICAgICAgICAvLyA9IDUxMi4gQnl0ZXMgMC01MTEgcmVzZXJ2ZWQgZm9yIGJ1aWx0LWluIGludGVycHJldGVyXG5jb25zdCBUUkFDRV9CVUZGRVJfU0laRSA9IDEwOyAgIC8vIHN0b3JlIGxhc3QgMTAgaW5zdHJ1Y3Rpb25zXG5jb25zdCBfVkYgICAgICAgID0gMHhmOyAgICAgICAgICAgICAgLy8gRmxhZyByZWdpc3RlclxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDUFUgZXh0ZW5kcyBCYXNlXG57XG4gIGNvbnN0cnVjdG9yKGdmeCwgcmFtKVxuICB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl90aGlzID0gXCJDUFVcIjsgLy8gZm9yIGNvbnRleHQgZGVidWdnaW5nIChUX1QpXG4gICAgdGhpcy5nZnggPSBnZng7XG4gICAgdGhpcy5yYW0gPSByYW07XG4gICAgdGhpcy5rZXlTdGF0ZUFkZHIgPSByYW0uZ2V0S2V5Ym9hcmRCdWZmZXJBZGRyZXNzKCk7XG4gICAgbG9nLmRlYnVnKFwiQ1BVIEluaXRpYWxpc2VkXCIpO1xuXG4gICAgdGhpcy5fdHJhY2UgPSBuZXcgQXJyYXkoVFJBQ0VfQlVGRkVSX1NJWkUpO1xuICAgIHRoaXMuX3RyYWNlX3B0ciA9IDA7XG5cbiAgICAvLyBJIGZlZWwgbGlrZSB0aGlzIHNob3VsZCBiZSBwYXJ0IG9mIHRoZSBDaGlwOCgpIG9iamVjdC9zeXN0ZW0gaW5zdGVhZCBvZlxuICAgIC8vIGluIGhlcmUgYnV0IHRoZSBkZWxheSB0aW1lciBhcHBlYXJzIHRvIGJlIG9ubHkgYWNjZXNzZWQgb3IgdXNlZCBkaXJlY3RseVxuICAgIC8vIGJ5IHRoZSBDUFUgc28gd2hhdGV2ZXJcbiAgICB0aGlzLmRlbGF5VGltZXIgPSBuZXcgRGVsYXlUaW1lcigpO1xuXG4gICAgdGhpcy5yZWcgPSB7XG4gICAgICB2OiBbXSxcbiAgICAgIGk6ICAwLFxuICAgICAgX2lwOiAwLFxuICAgICAgX3NwOiAwLFxuICAgICAgZ2V0IGlwKCkge3JldHVybiB0aGlzLl9pcH0sXG4gICAgICBnZXQgc3AoKSB7cmV0dXJuIHRoaXMuX3NwfSxcbiAgICB9O1xuXG4gICAgdGhpcy5zdGFjayA9IFtdXG4gICAgdGhpcy5leGVjID0gb3Bjb2RlcztcbiAgfVxuXG4gIHJlc2V0KClcbiAge1xuICAgIGxldCByID0gdGhpcy5yZWc7XG4gICAgW3Iudiwgci5pLCByLl9pcCwgci5fc3BdID0gW25ldyBBcnJheSgxNikuZmlsbCgwKSwwLElQX0lOSVQsMF07XG4gIH1cblxuICBuZXh0KClcbiAge1xuICAgIHRoaXMucmVnLl9pcCArPSBXT1JEX1NJWkU7XG4gIH1cblxuICBmZXRjaCgpXG4gIHtcbiAgICByZXR1cm4gdGhpcy5yYW0ucmVhZFdvcmQodGhpcy5yZWcuaXApO1xuICB9XG5cbiAgZGVjb2RlKGluc3RyKVxuICB7XG4gICAgbGV0IGkgPSBpbnN0ciAmIDB4ZmZmZjtcbiAgICBsZXQgbWFqb3IgPSAoaSAmIDB4ZjAwMCkgPj4gMTIsXG4gICAgICAgIG1pbm9yID0gaSAmIDB4MGZmZjtcblxuICAgIHRoaXMuX2FkZF90b190cmFjZV9sb29wKGluc3RyLCB0aGlzLnJlZy5pcCk7XG5cbiAgICByZXR1cm4ge21ham9yLCBtaW5vcn1cbiAgfVxuXG4gIGV4ZWN1dGUoe21ham9yLCBtaW5vcn0pXG4gIHtcbiAgICBpZiAoIXRoaXMuZXhlY1ttYWpvcl0uY2FsbCh0aGlzLCB7bWFqb3IsIG1pbm9yfSkpXG4gICAgICAgIHRoaXMubmV4dCgpO1xuICB9XG5cbiAgLy8gSSdtIHBhcnRpY3VsYXJseSBwbGVhc2VkIHdpdGggdGhpcyBsb29wZWQgYnVmZmVyIHNvbHV0aW9uXG4gIC8vIHRvIHJlY29yZCBhIHdpbmRvdy9zbmFwc2hvdCBvZiBhIGRhdGEtc3RyZWFtIG9mIGluZmluaXRlICh1bmtub3duKSBsZW5ndGhcbiAgLy8gS2luZGEgbGlrZSBob3cgdGhlIGJ1ZmZlciB3b3JrcyBpbiBhIGRpZ2l0YWwgc291bmQgY2hpcFxuICAvLyBUaGlzIGlzIG9idmlvdXNseSBmYXN0ZXIgdGhhbiBzbGljaW5nIGFuIGFycmF5J3MgZWxlbWVudHNcbiAgX2FkZF90b190cmFjZV9sb29wKGksYSlcbiAge1xuICAgIHRoaXMuX3RyYWNlW3RoaXMuX3RyYWNlX3B0cisrXSA9IHtpLCBhfVxuICAgIGlmICh0aGlzLl90cmFjZV9wdHIgPT0gVFJBQ0VfQlVGRkVSX1NJWkUpXG4gICAgICB0aGlzLl90cmFjZV9wdHIgPSAwO1xuICB9XG5cbiAgX3Vucm9sbF90cmFjZV9sb29wKClcbiAge1xuICAgIC8vIFNlcGFyYXRlIHRoZSBpbnN0cnVjdGlvbiBhbmQgYWRkcmVzcyBpbnRvIHNlcGFyYXRlXG4gICAgLy8gYXJyYXlzIGZvciBlYXNpZXIgcGFzc2luZyB0byB0aGUgZGlzYXNzZW1ibGVyXG4gICAgbGV0IHRyYWNlX3Vucm9sbGVkID0ge2k6W10sIGE6W119O1xuXG4gICAgbGV0IGlwID0gdGhpcy5fdHJhY2VfcHRyO1xuICAgIGZvciAobGV0IHA9MDsgcDxUUkFDRV9CVUZGRVJfU0laRTsgcCsrKVxuICAgIHtcbiAgICAgIHRyYWNlX3Vucm9sbGVkLmEucHVzaCh0aGlzLl90cmFjZVtpcF0uYSk7ICAvLyBhZGRyZXNzXG4gICAgICB0cmFjZV91bnJvbGxlZC5pLnB1c2godGhpcy5fdHJhY2VbaXBdLmkpICAgLy8gaW5zdHJ1Y3Rpb25cbiAgICAgIGlmICgtLWlwIDwgMCkgaXAgPSBUUkFDRV9CVUZGRVJfU0laRS0xO1xuICAgIH1cblxuICAgIHRyYWNlX3Vucm9sbGVkLmEucmV2ZXJzZSgpO1xuICAgIHRyYWNlX3Vucm9sbGVkLmkucmV2ZXJzZSgpO1xuICAgIHJldHVybiB0cmFjZV91bnJvbGxlZDtcbiAgfVxuXG4gIHRyYWNlKClcbiAge1xuICAgIHJldHVybiB0aGlzLl91bnJvbGxfdHJhY2VfbG9vcCgpO1xuICB9XG5cbiAgZHVtcF9yZWdpc3RlcnMoKVxuICB7XG4gICAgcmV0dXJuIHRoaXMucmVnO1xuICB9XG5cblxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3lzdGVtL2NwdS9jcHUuanMiLCJcbmltcG9ydCBsb2cgZnJvbSAnbG9nbGV2ZWwnO1xuXG5pbXBvcnQgeyRfaW5zdHJfMHgwfSBmcm9tICcuL29wY29kZS0weDAuanMnO1xuaW1wb3J0IHskX2luc3RyXzB4OH0gZnJvbSAnLi9vcGNvZGUtMHg4LmpzJztcbmltcG9ydCB7JF9pbnN0cl8weEV9IGZyb20gJy4vb3Bjb2RlLTB4RS5qcyc7XG5pbXBvcnQgeyRfaW5zdHJfMHhGfSBmcm9tICcuL29wY29kZS0weEYuanMnO1xuXG5jb25zdCBfVkYgICAgICAgID0gMHhmOyAgICAgICAgICAgICAgLy8gRmxhZyByZWdpc3RlclxuXG5leHBvcnQgbGV0IG9wY29kZXMgPSBbXG5cbiAgZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pICAvLyAweDA/Pz9cbiAge1xuICAgICRfaW5zdHJfMHgwW21pbm9yICYgMHhmZl0uY2FsbCh0aGlzLCB7bWFqb3IsIG1pbm9yfSk7XG4gIH0sXG5cbiAgZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vMHgxbm5uOiBKTVAgbm5uXG4gIHtcbiAgICB0aGlzLnJlZy5faXAgPSBtaW5vciYweGZmZjtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcblxuICBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSkgLy8gMHgybm5uOiBDQUxMIG5ublxuICB7XG4gICAgdGhpcy5zdGFjay5wdXNoKHRoaXMucmVnLmlwKTtcbiAgICB0aGlzLnJlZy5faXAgPSBtaW5vciYweGZmZjtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcblxuICBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSkgLy8gMHgzWFJSIC8vIGp1bXAgbmV4dCBpbnN0ciBpZiB2WCA9PSBSUlxuICB7XG4gICAgaWYgKHRoaXMucmVnLnZbKG1pbm9yPj44KSYweGZdID09IChtaW5vciYweGZmKSlcbiAgICAgIHRoaXMucmVnLl9pcCArPSAyO1xuICB9LFxuXG4gIGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAvLzRcbiAge1xuICAgIGlmICh0aGlzLnJlZy52WyhtaW5vcj4+OCkmMHhmXSAhPSAobWlub3ImMHhmZikpXG4gICAgICB0aGlzLnJlZy5faXAgKz0gMjtcbiAgfSxcblxuICBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSkgLy81XG4gIHtcbiAgICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG4gIH0sXG5cbiAgZnVuY3Rpb24gKHttYWpvciwgbWlub3J9KSAvLyAweDZ4bm4gIG1vdiB2eCwgbm5cbiAge1xuICAgIHRoaXMucmVnLnZbKG1pbm9yPj44KSYweGZdID0gbWlub3IgJiAweGZmO1xuICB9LFxuXG4gIGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAvLyAweDd4cnIgYWRkIHZ4LCByclxuICB7XG4gICAgbGV0IHggPSAobWlub3I+PjgpJjB4ZlxuICAgIHRoaXMucmVnLnZbeF0gKz0gbWlub3ImMHhmZjtcbiAgICB0aGlzLnJlZy52W3hdICY9IDI1NTtcblxuICB9LFxuXG4gIGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAvLyAweDhcbiAge1xuICAgICRfaW5zdHJfMHg4W21pbm9yICYgMHhmXS5jYWxsKHRoaXMsIHttYWpvciwgbWlub3J9KTtcbiAgfSxcblxuICBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSkgLy8gOVxuICB7XG4gICAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xuICB9LFxuXG4gIGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAvLyAweEFubm46IG12aSBubm4gKGxvYWQgJ0knIHdpdGggbm5uKVxuICB7XG4gICAgdGhpcy5yZWcuaSA9IG1pbm9yICYgMHhmZmY7XG4gIH0sXG5cbiAgZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vIGJcbiAge1xuICAgIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbiAgfSxcblxuICBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSkgLy8gMHhDeGtrOyBybmQgdngsIGtrXG4gIHtcbiAgICBsZXQgcm5kID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU1KSAmIChtaW5vciYweGZmKVxuICAgIHRoaXMucmVnLnZbKG1pbm9yPj44KSYweGZdID0gcm5kO1xuICB9LFxuXG4gIGZ1bmN0aW9uICh7bWFqb3IsIG1pbm9yfSkgIC8vIDB4RHh5bjogRFJXIFZ4LCBWeSwgbiAgKGRyYXcgc3ByaXRlKVxuICB7XG4gICAgbGV0IHIgPSB0aGlzLnJlZywgbSA9IG1pbm9yO1xuICAgIHIudltfVkZdID0gdGhpcy5nZnguZHJhdyhyLmksIHIudlsobT4+OCkmMHhmXSwgci52WyhtPj40KSYweGZdLCBtJjB4Zik7XG4gIH0sXG5cbiAgZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vIDB4RVxuICB7XG4gICAgJF9pbnN0cl8weEVbbWlub3IgJiAweGZmXS5jYWxsKHRoaXMsIHttYWpvciwgbWlub3J9KTtcbiAgfSxcblxuICBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSkgIC8vIDB4Rng/P1xuICB7XG4gICAgJF9pbnN0cl8weEZbbWlub3IgJiAweGZmXS5jYWxsKHRoaXMsIHttYWpvciwgbWlub3J9KTtcbiAgfVxuXTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3N5c3RlbS9jcHUvb3Bjb2Rlcy5qcyIsIlxuaW1wb3J0IGxvZyBmcm9tICdsb2dsZXZlbCc7XG5cbmxldCBNQVhfSU5TVFIgPSAweEZGO1xubGV0ICRfaW5zdHJfMHgwID0gW107XG5cbi8vIHByb2JzIGEgc21hcnRlciB3YXkgdG8gZG8gdGhpcyBidXQgb2ggd2VsbFxuZm9yICh2YXIgdD0wOyB0PD1NQVhfSU5TVFI7IHQrKylcbiAgJF9pbnN0cl8weDAucHVzaCgge30gKTtcblxuJF9pbnN0cl8weDBbMHhFMF0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSkgLy8gUkVUIChzdGFjay5wb3ApXG57XG4gIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cblxuJF9pbnN0cl8weDBbMHhFRV0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSkgLy8gUkVUIChzdGFjay5wb3ApXG57XG4gIGxldCBhZGRyID0gdGhpcy5zdGFjay5wb3AoKTtcbiAgdGhpcy5yZWcuX2lwID0gYWRkcjtcbn1cblxuZXhwb3J0IHskX2luc3RyXzB4MH07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zeXN0ZW0vY3B1L29wY29kZS0weDAuanMiLCJcbmxldCAkX2luc3RyXzB4OCA9IFtdO1xuXG5jb25zdCBfVkYgICAgICAgID0gMHhmOyAgICAgICAgICAgICAgLy8gRmxhZyByZWdpc3RlclxuXG4kX2luc3RyXzB4OFsweDBdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIHRoaXMucmVnLnZbbWlub3I+PjgmMHhmXSA9IHRoaXMucmVnLnZbKG1pbm9yPj40KSYweGZdO1xuICAvL3RoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cbiRfaW5zdHJfMHg4WzB4MV0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuXG4kX2luc3RyXzB4OFsweDJdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vIGFuZCB2eCwgdnlcbntcbiAgbGV0IHZ4ID0gKG1pbm9yPj44KSYweGY7XG4gIGxldCB2eSA9IChtaW5vcj4+NCkmMHhmO1xuICBsZXQgcnggPSB0aGlzLnJlZy52W3Z4XTtcbiAgbGV0IHJ5ID0gdGhpcy5yZWcudlt2eV07XG4gIGxldCByZXMgPSB0aGlzLnJlZy52W3Z4XSAmIHRoaXMucmVnLnZbKG1pbm9yPj40KSYweGZdO1xuICBsZXQgbXNnID0gYGFuZCAke3Z4fSwgJHt2eX0gKGFuZCAke3J4fSwgJHtyeX0gPSAke3Jlc30pYDtcbiAgdGhpcy5yZWcudlt2eF0gPSByZXM7Ly90aGlzLnJlZy52W3Z4XSAmIHRoaXMucmVnLnZbKG1pbm9yPj40KSYweGZdO1xuICAvL3RoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBtc2d9KTtcbiAgLy9jb25zb2xlLmxvZyhtc2cpO1xuICAvL3RoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cbiRfaW5zdHJfMHg4WzB4M10gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuJF9pbnN0cl8weDhbMHg0XSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAvLyBBREQgdngsIHZ5IC0+IHZmXG57XG4gIC8vdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xuXG4gIGxldCB4ID0gKG1pbm9yPj44KSYweGYsIHkgPSAobWlub3I+PjQpJjB4ZjtcbiAgdGhpcy5yZWcudlt4XSArPSB0aGlzLnJlZy52W3ldO1xuICB0aGlzLnJlZy52W19WRl0gPSArKHRoaXMucmVnLnZbeF0gPiAyNTUpO1xuICBpZiAodGhpcy5yZWcudlt4XSA+IDI1NSkgdGhpcy5yZWcudlt4XSAtPSAyNTY7XG5cbiAgLy8gbGV0IHZ4ID0gKG1pbm9yPj44KSYweGY7XG4gIC8vIGxldCByID0gdGhpcy5yZWcudlt2eF0gKyB0aGlzLnJlZy52WyhtaW5vcj4+NCkmMHhmXTtcbiAgLy8gbGV0IG1zZyA9IGAke3RoaXMucmVnLnZbdnhdfSArICR7dGhpcy5yZWcudlsobWlub3I+PjQpJjB4Zl19ID0gJHtyfSAoYWN0dWFsID0gJHt0aGlzLnJlZy52W3Z4XX0sIGZsYWcgPSAke3RoaXMucmVnLnZmfSlgO1xuICAvLyB0aGlzLnJlZy52W3Z4XSA9IHImMHhmZjtcbiAgLy8gdGhpcy5yZWcudmYgPSAoISEociYweGZmMDApKSswOyAgLy8gbG9sXG4gIC8vIGNvbnNvbGUuZGVidWcobXNnKVxuICAvL3RoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBtc2d9KTtcbn1cbiRfaW5zdHJfMHg4WzB4NV0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgbGV0IHggPSAobWlub3I+PjgpJjB4ZiwgeSA9IChtaW5vcj4+NCkmMHhmO1xuICB0aGlzLnJlZy52W19WRl0gPSArKHRoaXMucmVnLnZbeF0gPiB0aGlzLnJlZy52W3ldKTtcbiAgdGhpcy5yZWcudlt4XSAtPSB0aGlzLnJlZy52W3ldO1xuICAvL3RoaXMuZmlyZSgnZGVidWcnKTtcbiAgaWYgKHRoaXMucmVnLnZbeF0gPCAwKSB0aGlzLnJlZy52W3hdICs9IDI1NjtcblxuICAvLyBsZXQgdnggPSB0aGlzLnJlZy52WyhtaW5vcj4+OCkmMHhmXSwgdnkgPSB0aGlzLnJlZy52WyhtaW5vcj4+NCkmMHhmXTtcbiAgLy8gbGV0IGYgPSAodnggPiB2eSkrMDtcbiAgLy8gdGhpcy5yZWcudlt2eF0gPSBmID8gdGhpcy5yZWcudlt2eF0gLSB0aGlzLnJlZy52W3Z5XSA6IHRoaXMucmVnLnZbdnldIC0gdGhpcy5yZWcudlt2eF07XG4gIC8vdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuJF9pbnN0cl8weDhbMHg2XSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG4kX2luc3RyXzB4OFsweDddID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cbiRfaW5zdHJfMHg4WzB4OF0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuJF9pbnN0cl8weDhbMHg5XSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG4kX2luc3RyXzB4OFsweEFdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cbiRfaW5zdHJfMHg4WzB4Ql0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuJF9pbnN0cl8weDhbMHhDXSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG4kX2luc3RyXzB4OFsweERdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cbiRfaW5zdHJfMHg4WzB4RV0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuJF9pbnN0cl8weDhbMHhGXSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG5cbmV4cG9ydHskX2luc3RyXzB4OH07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zeXN0ZW0vY3B1L29wY29kZS0weDguanMiLCJcbmltcG9ydCBsb2cgZnJvbSAnbG9nbGV2ZWwnO1xuXG5sZXQgTUFYX0lOU1RSID0gMHhBMTtcbmxldCAkX2luc3RyXzB4RSA9IFtdO1xuXG4vLyBwcm9icyBhIHNtYXJ0ZXIgd2F5IHRvIGRvIHRoaXMgYnV0IG9oIHdlbGxcbmZvciAodmFyIHQ9MDsgdDw9TUFYX0lOU1RSOyB0KyspXG4gICRfaW5zdHJfMHhFLnB1c2goIHt9ICk7XG5cbiRfaW5zdHJfMHhFWzB4OUVdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cblxuJF9pbnN0cl8weEVbMHhBMV0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgaWYgKHRoaXMucmFtLmRhdGFbdGhpcy5rZXlTdGF0ZUFkZHIgKyB0aGlzLnJlZy52WyhtaW5vcj4+OCkmMHhmXV0gPT0gMClcbiAgICB0aGlzLnJlZy5faXAgKz0gMjtcbn1cblxuXG5leHBvcnQgeyRfaW5zdHJfMHhFfTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3N5c3RlbS9jcHUvb3Bjb2RlLTB4RS5qcyIsIlxuaW1wb3J0IGxvZyBmcm9tICdsb2dsZXZlbCc7XG5cbmxldCBNQVhfSU5TVFIgPSAweDY1O1xubGV0ICRfaW5zdHJfMHhGID0gW107XG5cbi8vIHByb2JzIGEgc21hcnRlciB3YXkgdG8gZG8gdGhpcyBidXQgb2ggd2VsbFxuZm9yICh2YXIgdD0wOyB0PD1NQVhfSU5TVFI7IHQrKylcbiAgJF9pbnN0cl8weEYucHVzaCh7fSk7XG5cbiRfaW5zdHJfMHhGWzB4MDddID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vIEZ4MDc6IHJlYWQgZGVsYXkgdGltZXIgZnJvbSBWeFxue1xuICB0aGlzLnJlZy52WyhtaW5vcj4+OCkmMHhmXSA9IHRoaXMuZGVsYXlUaW1lci5nZXQoKTtcbn1cblxuJF9pbnN0cl8weEZbMHgwQV0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuXG4kX2luc3RyXzB4RlsweDE1XSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAvLyBGeDE1OiBzZXQgZGVsYXkgdGltZXIgZnJvbSBWeFxue1xuICB0aGlzLmRlbGF5VGltZXIuc2V0KHRoaXMucmVnLnZbKG1pbm9yPj44KSYweGZdKTtcbn1cblxuJF9pbnN0cl8weEZbMHgxOF0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgLy90aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG4kX2luc3RyXzB4RlsweDFFXSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG5cbiRfaW5zdHJfMHhGWzB4MjldID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIGxldCB2YWwgPSB0aGlzLnJlZy52WyhtaW5vcj4+OCkmMHhmXTtcbiAgdGhpcy5yZWcuaSA9IHRoaXMucmFtLmdldENoYXJBZGRyQklPUygpICsgKHRoaXMucmFtLmdldENoYXJTaXplQklPUygpICogdmFsKTtcbn1cblxuJF9pbnN0cl8weEZbMHgzMF0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuXG4kX2luc3RyXzB4RlsweDMzXSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAvLyBGeDMzOiBiY2QgW2ldLCBWeCAoc3RvcmUgYmNkIG9mIHJlZyBWeCBhdCBhZGRyZXNzIHJlZyBpLT5pKzIpXG57XG4gIGxldCB2ID0gdGhpcy5yZWcudlsobWlub3I+PjgpJjB4Zl07XG4gIHRoaXMucmFtLmRhdGFbdGhpcy5yZWcuaSswXSA9IE1hdGguZmxvb3IodiAvIDEwMCk7XG4gIHRoaXMucmFtLmRhdGFbdGhpcy5yZWcuaSsxXSA9IE1hdGguZmxvb3IoKHYgJSAxMDApIC8gMTApO1xuICB0aGlzLnJhbS5kYXRhW3RoaXMucmVnLmkrMl0gPSAodiAlIDEwKTtcbn1cblxuJF9pbnN0cl8weEZbMHg1NV0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuXG4kX2luc3RyXzB4RlsweDY1XSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAvLyBGeDY1OiBtb3YgdjAtdngsIFtpXSAobG9hZCBudW1iZXJzIGZyb20gcmVnLmkgaW50byByZWcudjAgLT4gcmVnLnZ4KVxue1xuICBmb3IgKHZhciB4PTAsIG14PShtaW5vcj4+OCkmMHhmOyB4PD1teDsgeCsrKVxuICAgIHRoaXMucmVnLnZbeF0gPSB0aGlzLnJhbS5kYXRhW3RoaXMucmVnLmkgKyB4XTtcblxuICB0aGlzLnJlZy5pICs9IHg7IC8vIGkgPSBpICsgWCArIDFcbn1cblxuZXhwb3J0IHskX2luc3RyXzB4Rn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zeXN0ZW0vY3B1L29wY29kZS0weEYuanMiLCJcbmNvbnN0IEZSRVFVRU5DWSA9IDEwMDAvNjA7IC8vIDYwSHpcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGVsYXlUaW1lclxue1xuICBjb25zdHJ1Y3RvcigpXG4gIHtcbiAgICB0aGlzLmNvdW50ZXIgPSAwO1xuICAgIHRoaXMuX3RpbWVySWQgPSBudWxsO1xuICB9XG5cbiAgc2V0KHZhbHVlKVxuICB7XG4gICAgdGhpcy5jb3VudGVyID0gdmFsdWUgJiAweGZmO1xuICAgIHRoaXMuX3N0YXJ0KCk7XG4gIH1cblxuICBnZXQodmFsdWUpXG4gIHtcbiAgICByZXR1cm4gdGhpcy5jb3VudGVyO1xuICB9XG5cbiAgaW50ZXJ2YWxGdW5jKClcbiAge1xuICAgIHRoaXMuY291bnRlci0tO1xuICAgIGlmICh0aGlzLmNvdW50ZXIgPT0gMCkgdGhpcy5fc3RvcCgpO1xuICB9XG5cbiAgX3N0YXJ0KClcbiAge1xuICAgIHRoaXMuX3RpbWVySWQgPSBzZWxmLnNldEludGVydmFsKCh0aGlzLmludGVydmFsRnVuYykuYmluZCh0aGlzKSk7XG4gIH1cblxuICBfc3RvcCgpXG4gIHtcbiAgICBpZiAodGhpcy5fdGltZXJJZClcbiAgICB7XG4gICAgICBzZWxmLmNsZWFySW50ZXJ2YWwodGhpcy5fdGltZXJJZCk7XG4gICAgICB0aGlzLl90aW1lcklkID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3N5c3RlbS90aW1lci1kZWxheS5qcyIsIlxuaW1wb3J0IEJhc2UgZnJvbSAnLi4vdXRpbC9iYXNlJztcblxuY29uc3QgQklPU19DSEFSX0JBU0VfQUREUiA9IDB4MDtcbmNvbnN0IEJJT1NfQ0hBUl9TSVpFID0gNTtcbmNvbnN0IEJJT1NfTlVNX0NIQVJTID0gMTY7XG5jb25zdCBCSU9TX0tFWUJfQkFTRV9BRERSID0gKEJJT1NfQ0hBUl9TSVpFICogQklPU19OVU1fQ0hBUlMpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSQU0gZXh0ZW5kcyBCYXNlXG57XG4gIGNvbnN0cnVjdG9yKClcbiAge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fdGhpcyA9IFwiUkFNXCI7XG4gICAgdGhpcy5fZGF0YSA9IG5ldyBBcnJheUJ1ZmZlcigweDEwMDApO1xuICAgIHRoaXMuZGF0YSA9IG5ldyBVaW50OEFycmF5KHRoaXMuX2RhdGEpO1xuICB9XG5cbiAgcmVzZXQoKVxuICB7XG4gICAgLy90aGlzLmRhdGEgPSBuZXcgQXJyYXkoMHgxMDAwKS5maWxsKDApO1xuICB9XG5cbiAgZ2V0Q2hhckFkZHJCSU9TKClcbiAge1xuICAgIHJldHVybiBCSU9TX0NIQVJfQkFTRV9BRERSO1xuICB9XG5cbiAgZ2V0Q2hhclNpemVCSU9TKClcbiAge1xuICAgIHJldHVybiBCSU9TX0NIQVJfU0laRTtcbiAgfVxuXG4gIC8vIERlY2lkZWQgdG8gd3JpdGUgdGhlIGtleWJvYXJkIGJ1ZmZlciBpbnRvIHN5c3RlbSBSQU1cbiAgLy8gaW5zdGVhZCBvZiBwYXNzaW5nIGFuIGFkZGl0aW9uYWwgSW5wdXQoKSBvYmplY3QgdG8gdGhlIENQVSgpIGNsYXNzXG4gIC8vIFRoaXMgaXMgcHJvYmFibHkgbW9yZSBsaWtlIGFuIGVtYmVkZGVkIHN5c3RlbSB3b3VsZCB3b3JrXG4gIGdldEtleWJvYXJkQnVmZmVyQWRkcmVzcygpXG4gIHtcbiAgICByZXR1cm4gQklPU19LRVlCX0JBU0VfQUREUjtcbiAgfVxuXG4gIHJlYWRCeXRlKGFkZHIpXG4gIHtcbiAgICB0aGlzLl92YWxpZGF0ZV9hZGRyZXNzKGFkZHIpO1xuICAgIHJldHVybiB0aGlzLmRhdGFbYWRkcl07XG4gIH1cblxuICByZWFkV29yZChhZGRyKVxuICB7XG4gICAgdGhpcy5fdmFsaWRhdGVfYWRkcmVzcyhhZGRyKTtcbiAgICByZXR1cm4gKCh0aGlzLmRhdGFbYWRkcl0gJiAweGZmKSA8PCA4KSB8ICh0aGlzLmRhdGFbYWRkcisxXSAmIDB4ZmYpOyAvLyBUT0RPOiArMSA9PSBncGYgP1xuICB9XG5cbiAgd3JpdGVCeXRlKGFkZHIsIGRhdGEpXG4gIHtcbiAgICB0aGlzLl92YWxpZGF0ZV9hZGRyZXNzKGFkZHIpO1xuICAgIHRoaXMuZGF0YVthZGRyXSA9IGRhdGE7XG4gIH1cblxuICB3cml0ZVdvcmQoYWRkciwgZGF0YSlcbiAge1xuICAgIHRoaXMuX3ZhbGlkYXRlX2FkZHJlc3MoYWRkcik7XG4gICAgdGhpcy5kYXRhW2FkZHJdID0gKChkYXRhID4+IDgpICYgMHhmZik7XG4gICAgdGhpcy5kYXRhW2FkZHIrMV0gPSAoZGF0YSAmIDB4ZmYpO1xuICB9XG5cbiAgYmxpdCh0eXBlZEFycmF5LCB0b0FkZHIpXG4gIHtcbiAgICAvLyBCeXBhc3MgYWRkcmVzcyB2YWxpZGF0aW9uIGhlcmUgc28gd2UgY2FuIGJsaXQgdGhlIGJpb3MgaW50byBwbGFjZVxuICAgIHRoaXMuZGF0YS5zZXQodHlwZWRBcnJheSwgdG9BZGRyKTtcbiAgfVxuXG4gIF92YWxpZGF0ZV9hZGRyZXNzKGFkZHIpXG4gIHtcbiAgICBpZiAoYWRkciA8IDB4MjAwKVxuICAgIHtcbiAgICAgIHRoaXMuZW1pdCgnZ3BmJywge2Vycm9yOiBgSWxsZWdhbCBhZGRyZXNzOiAweCR7YWRkci50b1N0cmluZygxNil9YH0pO1xuICAgIH1cblxuICAgIGlmIChhZGRyID49IDB4MTAwMClcbiAgICB7XG4gICAgICB0aGlzLmVtaXQoJ2dwZicsIHtlcnJvcjogYElsbGVnYWwgYWRkcmVzczogMHgke2FkZHIudG9TdHJpbmcoMTYpfWB9KTtcbiAgICB9XG4gIH1cblxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3lzdGVtL3JhbS5qcyIsIlxuaW1wb3J0IEJhc2UgICBmcm9tICcuLi91dGlsL2Jhc2UnO1xuaW1wb3J0IGxvZyAgICBmcm9tICdsb2dsZXZlbCc7XG5cbmNvbnN0IFdJRFRIID0gNjQsIEhFSUdIVCA9IDMyO1xuY29uc3QgU1BSSVRFX1dJRFRIID0gODtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR0ZYIGV4dGVuZHMgQmFzZVxue1xuICBjb25zdHJ1Y3RvcihyYW0pXG4gIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2Rpc3BsYXkgPSBuZXcgQXJyYXlCdWZmZXIgKFdJRFRIICogSEVJR0hUKTtcbiAgICB0aGlzLmRpc3BsYXkgPSBuZXcgVWludDhBcnJheSh0aGlzLl9kaXNwbGF5KTtcbiAgICB0aGlzLnJhbSA9IHJhbTtcblxuICB9XG5cbiAgc2l6ZSgpXG4gIHtcbiAgICByZXR1cm4ge3dpZHRoOiBXSURUSCwgaGVpZ2h0OiBIRUlHSFR9O1xuICB9XG5cbiAgZHJhdyhpLCBzeCwgc3ksIGhlaWdodClcbiAge1xuICAgIGxldCBvID0gKHN5ICogV0lEVEgpICsgc3g7ICAgIC8vIGFkZHJlc3Mgb2YgZGlzcGxheSBjb29yZHNcbiAgICBsZXQgZCA9IChXSURUSCAtIFNQUklURV9XSURUSCk7IC8vIG9mZnNldCBkZWx0YSBpbmNyZW1lbnRcbiAgICBsZXQgcyA9IGk7ICAgICAgICAgICAgICAgICAgICAvLyBhZGRyZXNzIG9mIHNwcml0ZSBpbiBSQU1cbiAgICBsZXQgY29sbGlzaW9uID0gMDtcblxuICAgIC8vY29uc29sZS5sb2coYERyYXdpbmcgc3ByaXRlIGF0ICR7c3h9LCAke3N5fSwgb2Zmc2V0ID0gJHtvfWApO1xuXG4gICAgZm9yIChsZXQgeT0wOyB5PGhlaWdodDsgeSsrKVxuICAgIHtcbiAgICAgIGxldCBiaXRfcm93ID0gdGhpcy5yYW1bcysrXTtcbiAgICAgIGxldCBwaXhlbCwgeG9yX3BpeGVsO1xuICAgICAgZm9yIChsZXQgeD1TUFJJVEVfV0lEVEgtMTsgeD49MDsgeC0tKVxuICAgICAge1xuICAgICAgICBwaXhlbCA9ICgoYml0X3JvdyA+PiB4KSAmIDB4MSk7ICAgIC8vVE9ETzogKk1VU1QqIGJlIGEgc21hcnRlciB3YXkgdG8gd3JpdGUgdGhpcyEhXG4gICAgICAgIHhvcl9waXhlbCA9IHRoaXMuZGlzcGxheVtvXSBeIHBpeGVsO1xuICAgICAgICB0aGlzLmRpc3BsYXlbbysrXSA9IHhvcl9waXhlbDtcbiAgICAgICAgaWYgKCh4b3JfcGl4ZWwhPXBpeGVsKSAmJiB4b3JfcGl4ZWwgPT0gMCkgY29sbGlzaW9uID0gMTtcbiAgICAgIH1cbiAgICAgIG8gKz0gZDtcbiAgICB9XG5cbiAgICAvLyBiZWxvdywgZGVidWcsIHdyaXRlIG91dCBjb250ZW50cyBvZiBkaXNwbGF5IHRvIGNvbnNvbGUgaW4gYSB3aWQgKiBoZWkgZ3JpZFxuICAgIC8vIGZvciAodmFyIHk9MDsgeTxIRUlHSFQ7IHkrKylcbiAgICAvLyB7XG4gICAgLy8gICB2YXIgc3QgPSBcIlwiO1xuICAgIC8vICAgaWYgKHkgPCAxMCkgc3QgKz0gXCJ5IDBcIit5K1wiOlwiOyBlbHNlIHN0Kz0gXCJ5IFwiK3krXCI6XCI7XG4gICAgLy8gICBmb3IgKHZhciB4PTA7IHg8V0lEVEg7IHgrKylcbiAgICAvLyAgIHtcbiAgICAvLyAgICAgICBzdCArPSB0aGlzLmRpc3BsYXlbKHkgKiBXSURUSCkreF0gPyBcIjFcIiA6IFwiMFwiXG4gICAgLy8gICB9XG4gICAgLy8gICBjb25zb2xlLmxvZyhzdCk7XG4gICAgLy8gfVxuXG4gICAgdGhpcy5maXJlKCdjaGFuZ2VkJyk7XG4gICAgLy9pZiAoY29sbGlzaW9uID09MSApIGxvZy5pbmZvKFwiKioqIENvbGxpc2lvbiEgKioqXCIpO1xuICAgIHJldHVybiBjb2xsaXNpb247XG4gIH1cblxuICAvLyBfc2V0X3BpeGVsKHgsIHksIHYpXG4gIC8vIHtcbiAgLy8gICBsZXQgb2ZmcyA9ICh5KldJRFRIKSt4O1xuICAvLyAgIHRoaXMuZGlzcGxheVtvZmZzXSA9IHY7XG4gIC8vIH1cblxuICBjbGVhcigpXG4gIHtcbiAgICB0aGlzLmRpc3BsYXkuZmlsbCgwKTtcbiAgICB0aGlzLmZpcmUoJ2NoYW5nZWQnKTtcbiAgfVxuXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zeXN0ZW0vZ2Z4LmpzIiwiXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaXNhc3NlbWJsZXJcbntcbiAgY29uc3RydWN0b3IoKVxuICB7XG4gIH1cblxuICBkZWNvZGUoaW5zdHIpXG4gIHtcbiAgICBsZXQgbGlzdCA9IEFycmF5LmlzQXJyYXkoaW5zdHIpID8gaW5zdHIgOiBbaW5zdHJdO1xuICAgIGxldCBvdXQgPSBbXTtcblxuICAgIGZvciAobGV0IGkgb2YgbGlzdClcbiAgICB7XG4gICAgICBsZXQgZCA9IHRoaXMuX2RlY29kZV9zaW5nbGUoaSk7XG4gICAgICBkLmkgPSBgMHgke2hleChpKX1gO1xuICAgICAgb3V0LnB1c2goZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dC5sZW5ndGggPT0gMSA/IG91dFswXSA6IG91dDtcbiAgfVxuXG4gIGV4cGxvZGUoaW5zdHJfZGF0YSwgZnJvbV9pbnN0ciwgc2l6ZSlcbiAge1xuICAgIGxldCB0b19kZWNvZGUgPSBbXTtcbiAgICBmb3IgKGxldCB0PWZyb21faW5zdHItKHNpemUqMik7IHQ8PWZyb21faW5zdHIrKHNpemUqMik7IHQrPTIpXG4gICAge1xuICAgICAgdG9fZGVjb2RlLnB1c2goaW5zdHJfZGF0YS5yZWFkV29yZCh0KSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmRlY29kZSh0b19kZWNvZGUpO1xuICB9XG5cbiAgX2RlY29kZV9zaW5nbGUoaW5zdHIpXG4gIHtcbiAgICAgIGxldCBtYWpvciA9IChpbnN0ciA+PiAxMikgJiAweGY7XG4gICAgICBsZXQgbWlub3IgPSBpbnN0ciAmIDB4ZmZmO1xuXG4gICAgICAvLyBlLmcuIDVYWTA6IGpycSB2eCwgdnlcbiAgICAgIGxldCBtaW4wID0gKG1pbm9yID4+IDgpICYgMHhmOyAgLy8gWFxuICAgICAgbGV0IG1pbjEgPSAobWlub3IgPj4gNCkgJiAweGY7ICAvLyBZXG4gICAgICBsZXQgbWluMiA9IG1pbm9yICYgMHhmOyAgICAgICAgIC8vIDBcbiAgICAgIGxldCBtaW4xMiA9IG1pbm9yICYgMHhmZjsgICAgICAgLy8gWTBcblxuICAgICAgc3dpdGNoKG1ham9yKVxuICAgICAge1xuICAgICAgICBjYXNlIDB4MDpcbiAgICAgICAgICBzd2l0Y2gobWlub3IpXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2FzZSAweGUwOiByZXR1cm4ge206IFwiY2xzXCIsIGQ6XCJDbGVhciBzY3JlZW5cIn07IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAweGVlOiByZXR1cm4ge206IFwicmV0XCIsIGQ6XCJSZXR1cm4gZnJvbSBzdWJyb3V0aW5lIFtzdGFja11cIn07IGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDogcmV0dXJuIHttOiBgc3lzICR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGQ6XCJKdW1wIHRvIHJvdXRpbmUgYXQgYWRkcmVzcyBbbGVnYWN5OyBpZ25vcmVkIGJ5IGludGVycHJldGVyXVwifTticmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHgxOiByZXR1cm4ge206IGBqbXAgMHgke2hleChtaW5vcil9YCwgZDpcIkp1bXAgdG8gYWRkcmVzc1wifTsgICAgICAgICAgICAgLy8gMW5ublxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4MjogcmV0dXJuIHttOiBgY2FsbCAweCR7aGV4KG1pbm9yKX1gLCBkOlwiQ2FsbCBzdWJyb3V0aW5lIFtzdGFja11cIn07ICAgICAgICAgICAgLy8gMm5ublxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4MzogcmV0dXJuIHttOiBgamVxIHYke2hleChtaW4wKX0sICR7bWluMTJ9YCwgZDpcIkp1bXAgb3ZlciBuZXh0IGluc3RydWN0aW9uIGlmIG9wZXJhbmRzIGVxdWFsXCJ9OyAgIC8vIDN4bm5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweDQ6IHJldHVybiB7bTogYGpucSB2JHtoZXgobWluMCl9LCAke21pbjEyfWAsIGQ6XCJKdW1wIG92ZXIgbmV4dCBpbnN0cnVjdGlvbiBpZiBvcGVyYW5kcyBub3QgZXF1YWxcIn07ICAgLy8gNHhublxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4NTogcmV0dXJuIHttOiBganJlIHYke2hleChtaW4wKX0sIHYke2hleChtaW4xKX1gLCBkOlwiSnVtcCBvdmVyIG5leHQgaW5zdHJ1Y3Rpb24gaWYgcmVnaXN0ZXJzIGVxdWFsXCJ9Oy8vIDV4eTBcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweDY6IHJldHVybiB7bTogYG1vdiB2JHtoZXgobWluMCl9LCAke21pbjEyfWAsIGQ6XCJNb3ZlIGNvbnN0YW50IGludG8gcmVnaXN0ZXJcIn07OyAgIC8vIDZ4bm5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweDc6IHJldHVybiB7bTogYGFkZCB2JHtoZXgobWluMCl9LCAke21pbjEyfWAsIGQ6XCJBZGQgY29uc3RhbnQgdG8gcmVnaXN0ZXJcIn07OyAgIC8vIDd4bm5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweDg6XG4gICAgICAgICAgc3dpdGNoIChtaW4yKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNhc2UgMHgwOiByZXR1cm4ge206IGBtb3YgdiR7aGV4KG1pbjApfSwgdiR7aGV4KG1pbjEpfWAsIGQ6IFwiTW92ZSByZWdpc3RlciBpbnRvIHJlZ2lzdGVyXCJ9OyBicmVhazsgICAvLyA4eHkwXG4gICAgICAgICAgICBjYXNlIDB4MTogcmV0dXJuIHttOiBgb3IgdiR7aGV4KG1pbjApfSwgdiR7aGV4KG1pbjEpfWAsIGQ6IFwiT1IgcmVnaXN0ZXIgd2l0aCByZWdpc3RlclwifTsgYnJlYWs7ICAgIC8vIDh4eTFcbiAgICAgICAgICAgIGNhc2UgMHgyOiByZXR1cm4ge206IGBhbmQgdiR7aGV4KG1pbjApfSwgdiR7aGV4KG1pbjEpfWAsIGQ6IFwiQU5EIHJlZ2lzdGVyIHdpdGggcmVnaXN0ZXJcIn07IGJyZWFrOyAgIC8vIDh4eTJcbiAgICAgICAgICAgIGNhc2UgMHgzOiByZXR1cm4ge206IGB4b3IgdiR7aGV4KG1pbjApfSwgdiR7aGV4KG1pbjEpfWAsIGQ6IFwiWE9SIHJlZ2lzdGVyIHdpdGggcmVnaXN0ZXJcIn07IGJyZWFrOyAgIC8vIDh4eTJcbiAgICAgICAgICAgIGNhc2UgMHg0OiByZXR1cm4ge206IGBhZGQgdiR7aGV4KG1pbjApfSwgdiR7aGV4KG1pbjEpfWAsIGQ6IFwiQWRkIHJlZ2lzdGVyIHRvIHJlZ2lzdGVyXCJ9OyBicmVhazsgICAvLyA4eHk0XG4gICAgICAgICAgICBjYXNlIDB4NTogcmV0dXJuIHttOiBgc3ViIHYke2hleChtaW4wKX0sIHYke2hleChtaW4xKX1gLCBkOiBcIlN1YnRyYWN0IHJlZ2lzdGVyIGZyb20gcmVnaXN0ZXJcIn07IGJyZWFrOyAgIC8vIDh4eTVcbiAgICAgICAgICAgIGNhc2UgMHg2OiByZXR1cm4ge206IGBzaHIgdiR7aGV4KG1pbjApfWAsIGQ6IFwiU2hpZnQgcmlnaHQgcmVnaXN0ZXJcIn07IGJyZWFrOyAgICAgICAgICAgICAgICAgIC8vIDh4MDZcbiAgICAgICAgICAgIGNhc2UgMHg3OiByZXR1cm4ge206IGByc2IgdiR7aGV4KG1pbjApfSwgdiR7aGV4KG1pbjEpfWAsIGQ6IFwiUmV2ZXJzZSBzdWJ0cmFjdCByZWdpc3RlciBmcm9tIHJlZ2lzdGVyXCJ9OyBicmVhazsgICAvLyA4eHk3XG4gICAgICAgICAgICBjYXNlIDB4ZTogcmV0dXJuIHttOiBgc2hsIHYke2hleChtaW4wKX1gLCBkOiBcIlNoaWZ0IGxlZnQgcmVnaXN0ZXJcIn07IGJyZWFrOyAgICAgICAgICAgICAgICAgIC8vIDh4MGVcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHg5OiByZXR1cm4ge206IGBqcm4gdiR7aGV4KG1pbjApfSwgdiR7aGV4KG1pbjEpfWAsIGQ6IFwiSnVtcCBvdmVyIG5leHQgaW5zdHJ1Y3Rpb24gaWYgcmVnaXN0ZXIgbm90IGVxdWFsXCJ9OyAgICAgICAgICAgICAvLyA5eHkwXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHhBOiByZXR1cm4ge206IGBtb3YgaSwgJHttaW5vcn1gLCBkOlwiTW92ZSBjb25zdGFudCBpbnRvIEluZGV4IHJlZ2lzdGVyXCJ9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4QjogcmV0dXJuIHttOiBganJsIDB4JHtoZXgobWlub3IpfWAsIGQ6XCJKdW1wIHRvIGFkZHJlc3MgZ2l2ZW4gYnkgY29uc3RhbnQgKyB2MCByZWdpc3RlclwifVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4QzogcmV0dXJuIHttOiBgcm5kIHYke2hleChtaW4wKX0sIDB4JHtoZXgobWluMTIpfWAsIGQ6XCJSYW5kb20gbnVtYmVyIEFORCB3aXRoIGNvbnN0YW50IGludG8gcmVnaXN0ZXJcIn1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweEQ6IHJldHVybiB7bTogYGRydyB2JHtoZXgobWluMCl9LCB2JHtoZXgobWluMSl9LCAkeyhtaW4yKX1gLCBkOlwiRHJhdyBzcHJpdGUgYXQgcmVnaXN0ZXJzIGxvY2F0aW9uIG9mIHNpemUgY29uc3RhbnRcIn1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweEU6XG4gICAgICAgICAgc3dpdGNoKG1pbjEyKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNhc2UgMHg5RTogcmV0dXJuIHttOiBgamtwIHYke2hleChtaW4wKX1gLCBkOlwiSnVtcCBpZiBrZXkgY29kZSBpbiByZWdpc3RlciBwcmVzc2VkXCJ9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAweEExOiByZXR1cm4ge206IGBqa24gdiR7aGV4KG1pbjApfWAsIGQ6XCJKdW1wIGlmIGtleSBjb2RlIGluIHJlZ2lzdGVyIG5vdCBwcmVzc2VkXCJ9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweEY6XG4gICAgICAgICAgc3dpdGNoKG1pbjEyKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNhc2UgMHgwNzogcmV0dXJuIHttOiBgbGR0IHYke2hleChtaW4wKX1gLCBkOlwiTG9hZCBkZWxheSB0aW1lciB2YWx1ZSBpbnRvIHJlZ2lzdGVyXCJ9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAweDBBOiByZXR1cm4ge206IGB3YWl0IHYke2hleChtaW4wKX1gLCBkOlwiV2FpdCBmb3IgYSBrZXkgcHJlc3MsIHN0b3JlIGtleSBpbiByZWdpc3RlclwifVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMHgxNTogcmV0dXJuIHttOiBgc2R0IHYke2hleChtaW4wKX1gLCBkOlwiU2V0IGRlbGF5IHRpbWVyIGZyb20gcmVnaXN0ZXJcIn1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDB4MTg6IHJldHVybiB7bTogYHNzdCB2JHtoZXgobWluMCl9YCwgZDpcIlNldCBzb3VuZCB0aW1lciBmcm9tIHJlZ2lzdGVyXCJ9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAweDFFOiByZXR1cm4ge206IGBhZGkgdiR7aGV4KG1pbjApfWAsIGQ6XCJBZGQgcmVnaXN0ZXIgdmFsdWUgdG8gSW5kZXggcmVnaXN0ZXJcIn1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDB4Mjk6IHJldHVybiB7bTogYGxkaSB2JHtoZXgobWluMCl9YCwgZDpcIkxvYWQgSW5kZXggcmVnaXN0ZXIgd2l0aCBzcHJpdGUgYWRkcmVzcyBvZiBkaWdpdCBpbiByZWdpc3RlclwifVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMHgzMzogcmV0dXJuIHttOiBgYmNkIHYke2hleChtaW4wKX1gLCBkOlwiU3RvcmUgQkNEIG9mIHJlZ2lzdGVyIHN0YXJ0aW5nIGF0IGJhc2UgYWRkcmVzcyBJbmRleFwifVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMHg1NTogcmV0dXJuIHttOiBgc3RyIHYke2hleChtaW4wKX1gLCBkOlwiU3RvcmUgcmVnaXN0ZXJzIGZyb20gdjAgdG8gcmVnaXN0ZXIgb3BlcmFuZCBhdCBiYXNlIGFkZHJlc3MgSW5kZXhcIn1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDB4NjU6IHJldHVybiB7bTogYGxkciB2JHtoZXgobWluMCl9YCwgZDpcIlNldCByZWdpc3RlcnMgZnJvbSB2MCB0byByZWdpc3RlciBvcGVyYW5kIHdpdGggdmFsdWVzIGZyb20gYmFzZSBhZGRyZXNzIEluZGV4XCJ9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiB7bTpgVW5rbm93biBvcGNvZGUgJHtoZXgoaW5zdHIpfWAsIGQ6XCJVbmtub3duL2lsbGVnYWwgaW5zdHJ1Y3Rpb25cIn07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBoZXgobikgeyByZXR1cm4gbi50b1N0cmluZygxNik7IH1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3N5c3RlbS9kaXNhc20uanMiXSwic291cmNlUm9vdCI6IiJ9