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
	      if (collision == 1) _loglevel2.default.info("*** Collision! ***");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNzI0NDYzZTEzODBhZDAxMDg0MzciLCJ3ZWJwYWNrOi8vLy4vY2hpcDgtd29ya2VyLmpzIiwid2VicGFjazovLy8uL3N5c3RlbS9jaGlwOC5qcyIsIndlYnBhY2s6Ly8vLi91dGlsL2Jhc2UuanMiLCJ3ZWJwYWNrOi8vLy4vdXRpbC9ldmVudC5qcyIsIndlYnBhY2s6Ly8vLi91dGlsL2xvYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9kb20vaW5wdXQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2dsZXZlbC9saWIvbG9nbGV2ZWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3lzdGVtL2NwdS9jcHUuanMiLCJ3ZWJwYWNrOi8vLy4vc3lzdGVtL2NwdS9vcGNvZGVzLmpzIiwid2VicGFjazovLy8uL3N5c3RlbS9jcHUvb3Bjb2RlLTB4MC5qcyIsIndlYnBhY2s6Ly8vLi9zeXN0ZW0vY3B1L29wY29kZS0weDguanMiLCJ3ZWJwYWNrOi8vLy4vc3lzdGVtL2NwdS9vcGNvZGUtMHhFLmpzIiwid2VicGFjazovLy8uL3N5c3RlbS9jcHUvb3Bjb2RlLTB4Ri5qcyIsIndlYnBhY2s6Ly8vLi9zeXN0ZW0vdGltZXItZGVsYXkuanMiLCJ3ZWJwYWNrOi8vLy4vc3lzdGVtL3JhbS5qcyIsIndlYnBhY2s6Ly8vLi9zeXN0ZW0vZ2Z4LmpzIiwid2VicGFjazovLy8uL3N5c3RlbS9kaXNhc20uanMiXSwibmFtZXMiOlsiYyIsImxvYWQiLCJwb3dlcm9uIiwiQklPU19VUkwiLCJDaGlwOCIsInNldExldmVsIiwiZGlzYXNtIiwiY3ljbGVzIiwicmFtIiwiZ2Z4IiwiZGF0YSIsImNwdSIsImxvYWRlciIsImN5Y2xlVGltZXIiLCJfaW5pdEV2ZW50cyIsIl9yZXNldCIsIl9pbml0X2Jpb3MiLCJfZXhlY3V0aW5nIiwidCIsIm9wY29kZSIsImZldGNoIiwiZXhlY3V0ZSIsImRlY29kZSIsInNldEludGVydmFsIiwiY3ljbGUiLCJiaW5kIiwid2FybiIsImNsZWFySW50ZXJ2YWwiLCJfZHVtcCIsImQiLCJkZWJ1ZyIsInJlZyIsImlwIiwidG9TdHJpbmciLCJtIiwiaGFsdCIsInMiLCJ2IiwibGVuZ3RoIiwiaSIsInZmIiwidXJsIiwiY2FsbGJhY2siLCJpbmZvIiwidGl0bGUiLCJidWZmZXIiLCJfYmFzZTY0VG9BcnJheUJ1ZmZlciIsImJpbmFyeSIsImJsaXQiLCJiaW9zX2RhdGEiLCJieXRlcyIsImJpbiIsInNwbGl0IiwiX2RhdGEiLCJBcnJheUJ1ZmZlciIsIlVpbnQ4QXJyYXkiLCJwIiwiY2hhcmxpbmUiLCJwYXJzZUludCIsImdldENoYXJBZGRyQklPUyIsImJhc2U2NCIsImJpbmFyeV9zdHJpbmciLCJzZWxmIiwiYXRvYiIsImxlbiIsImNoYXJDb2RlQXQiLCJyZXNldCIsIm9uIiwiZW1pdCIsInBvc3RNZXNzYWdlIiwiYWN0aW9uIiwiYXJncyIsImVycm9yIiwidHJhY2UiLCJyZWdpc3RlcnMiLCJkdW1wX3JlZ2lzdGVycyIsImFkZHJlc3MiLCJmcmFtZUJ1ZmZlciIsImRpc3BsYXkiLCJvbm1lc3NhZ2UiLCJtZXNzYWdlSGFuZGxlciIsIm1zZyIsImtleVN0YXRlIiwiZ2V0S2V5Ym9hcmRCdWZmZXJBZGRyZXNzIiwicGF1c2VkdW1wIiwicmVzdW1lIiwiaGFsdGR1bXAiLCJzdGVwIiwiQmFzZSIsIkV2ZW50RW1pdHRlciIsImxpc3RlbmVycyIsIk1hcCIsImFkZExpc3RlbmVyIiwiZmlyZSIsImxhYmVsIiwiZm4iLCJoYXMiLCJzZXQiLCJnZXQiLCJwdXNoIiwib2JqIiwiaW5kZXgiLCJyZWR1Y2UiLCJsaXN0ZW5lciIsIl9pc0Z1bmN0aW9uIiwic3BsaWNlIiwiZm9yRWFjaCIsIkxvYWRlciIsInhtbGh0dHAiLCJYTUxIdHRwUmVxdWVzdCIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsInJlYWR5U3RhdGUiLCJzdGF0dXMiLCJqc29uIiwiSlNPTiIsInBhcnNlIiwicmVzcG9uc2VUZXh0Iiwib3BlbiIsInNlbmQiLCJJbnB1dCIsImtleURhdGEiLCJfY2FsbGJhY2siLCJrZXlNYXAiLCJfaW5pdCIsImtleSIsImsiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImNvZGUiLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJrZXlDb2RlIiwidG9Mb3dlckNhc2UiLCJfc2V0S2V5RG93biIsIl9zZXRLZXlVcCIsIldPUkRfU0laRSIsIklQX0lOSVQiLCJUUkFDRV9CVUZGRVJfU0laRSIsIl9WRiIsIkNQVSIsIl90aGlzIiwia2V5U3RhdGVBZGRyIiwiX3RyYWNlIiwiQXJyYXkiLCJfdHJhY2VfcHRyIiwiZGVsYXlUaW1lciIsIl9pcCIsIl9zcCIsInNwIiwic3RhY2siLCJleGVjIiwiciIsImZpbGwiLCJyZWFkV29yZCIsImluc3RyIiwibWFqb3IiLCJtaW5vciIsIl9hZGRfdG9fdHJhY2VfbG9vcCIsImNhbGwiLCJuZXh0IiwiYSIsInRyYWNlX3Vucm9sbGVkIiwicmV2ZXJzZSIsIl91bnJvbGxfdHJhY2VfbG9vcCIsIm9wY29kZXMiLCJ4Iiwicm5kIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiZHJhdyIsIk1BWF9JTlNUUiIsIiRfaW5zdHJfMHgwIiwiYWRkciIsInBvcCIsIiRfaW5zdHJfMHg4IiwidngiLCJ2eSIsInJ4IiwicnkiLCJyZXMiLCJ5IiwiJF9pbnN0cl8weEUiLCIkX2luc3RyXzB4RiIsInZhbCIsImdldENoYXJTaXplQklPUyIsIm14IiwiRlJFUVVFTkNZIiwiRGVsYXlUaW1lciIsImNvdW50ZXIiLCJfdGltZXJJZCIsInZhbHVlIiwiX3N0YXJ0IiwiX3N0b3AiLCJpbnRlcnZhbEZ1bmMiLCJCSU9TX0NIQVJfQkFTRV9BRERSIiwiQklPU19DSEFSX1NJWkUiLCJCSU9TX05VTV9DSEFSUyIsIkJJT1NfS0VZQl9CQVNFX0FERFIiLCJSQU0iLCJfdmFsaWRhdGVfYWRkcmVzcyIsInR5cGVkQXJyYXkiLCJ0b0FkZHIiLCJXSURUSCIsIkhFSUdIVCIsIlNQUklURV9XSURUSCIsIkdGWCIsIl9kaXNwbGF5Iiwid2lkdGgiLCJoZWlnaHQiLCJzeCIsInN5IiwibyIsImNvbGxpc2lvbiIsImJpdF9yb3ciLCJwaXhlbCIsInhvcl9waXhlbCIsIkRpc2Fzc2VtYmxlciIsImxpc3QiLCJpc0FycmF5Iiwib3V0IiwiX2RlY29kZV9zaW5nbGUiLCJoZXgiLCJpbnN0cl9kYXRhIiwiZnJvbV9pbnN0ciIsInNpemUiLCJ0b19kZWNvZGUiLCJtaW4wIiwibWluMSIsIm1pbjIiLCJtaW4xMiIsIm4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUN0Q0E7Ozs7OztBQUVBLEtBQUlBLElBQUksb0JBQVI7O0FBRUFBLEdBQUVDLElBQUYsQ0FBTyxvQkFBUCxFQUE2QixZQUFNO0FBQUs7QUFDcENELE9BQUVFLE9BQUYsR0FEK0IsQ0FDSztBQUN2QyxFQUZELEU7Ozs7Ozs7Ozs7Ozs7O0FDSEE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7Ozs7Ozs7Ozs7O0FBRUEsS0FBTUMsV0FBWSxhQUFsQjs7S0FFcUJDLEs7OztBQUVuQixvQkFDQTtBQUFBOztBQUFBOztBQUVFLHdCQUFJQyxRQUFKLENBQWEsT0FBYjs7QUFFQSxXQUFLQyxNQUFMLEdBQWMsc0JBQWQ7O0FBRUEsV0FBS0MsTUFBTCxHQUFjLENBQWQ7O0FBRUEsV0FBS0MsR0FBTCxHQUFXLG1CQUFYO0FBQ0EsV0FBS0MsR0FBTCxHQUFXLGtCQUFRLE1BQUtELEdBQUwsQ0FBU0UsSUFBakIsQ0FBWDtBQUNBLFdBQUtDLEdBQUwsR0FBVyxrQkFBUSxNQUFLRixHQUFiLEVBQWtCLE1BQUtELEdBQXZCLENBQVg7O0FBRUEsV0FBS0ksTUFBTCxHQUFjLHNCQUFk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dk0sR0FBRSw4REFBM0IsRUFBUDtBQUNUO0FBQ0Ysa0JBQUssSUFBTDtBQUFXLHNCQUFPLEVBQUNLLGFBQVc2TCxJQUFJSyxJQUFKLENBQVosRUFBeUJ2TSxHQUFFLHNEQUEzQixFQUFQO0FBQ1Q7QUFDRixrQkFBSyxJQUFMO0FBQVcsc0JBQU8sRUFBQ0ssYUFBVzZMLElBQUlLLElBQUosQ0FBWixFQUF5QnZNLEdBQUUsbUVBQTNCLEVBQVA7QUFDVDtBQUNGLGtCQUFLLElBQUw7QUFBVyxzQkFBTyxFQUFDSyxhQUFXNkwsSUFBSUssSUFBSixDQUFaLEVBQXlCdk0sR0FBRSwrRUFBM0IsRUFBUDtBQUNUO0FBbkJKO0FBcUJBOztBQUVBO0FBQVMsa0JBQU8sRUFBQ0ssdUJBQW9CNkwsSUFBSXBFLEtBQUosQ0FBckIsRUFBbUM5SCxHQUFFLDZCQUFyQyxFQUFQO0FBQ1A7QUFsRk47QUFvRkg7Ozs7OzttQkE5SGtCNkwsWTs7O0FBaUlyQixVQUFTSyxHQUFULENBQWFTLENBQWIsRUFBZ0I7QUFBRSxVQUFPQSxFQUFFdk0sUUFBRixDQUFXLEVBQVgsQ0FBUDtBQUF3QixFIiwiZmlsZSI6IjcyNDQ2M2UxMzgwYWQwMTA4NDM3Lndvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDcyNDQ2M2UxMzgwYWQwMTA4NDM3IiwiaW1wb3J0IENoaXA4IGZyb20gJy4vc3lzdGVtL2NoaXA4JztcblxubGV0IGMgPSBuZXcgQ2hpcDgoKTtcblxuYy5sb2FkKCdyb20tanNvbi9wb25nLmpzb24nLCAoKSA9PiB7ICAgIC8vIGluc2VydCB0aGUgY2FydHJpZGdlLi4uXG4gICAgYy5wb3dlcm9uKCk7ICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3dpdGNoIGl0IG9uIDopXG59KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2NoaXA4LXdvcmtlci5qcyIsIlxuaW1wb3J0IEJhc2UgICAgICAgICAgICAgICBmcm9tICcuLi91dGlsL2Jhc2UnO1xuaW1wb3J0IExvYWRlciAgICAgICAgICAgICBmcm9tICcuLi91dGlsL2xvYWRlcic7XG5pbXBvcnQgSW5wdXQgICAgICAgICAgICAgIGZyb20gJy4uL2RvbS9pbnB1dCc7XG5pbXBvcnQgQ1BVICAgICAgICAgICAgICAgIGZyb20gJy4vY3B1L2NwdSc7XG5pbXBvcnQgUkFNICAgICAgICAgICAgICAgIGZyb20gJy4vcmFtJztcbmltcG9ydCBHRlggICAgICAgICAgICAgICAgZnJvbSAnLi9nZngnO1xuaW1wb3J0IGxvZyAgICAgICAgICAgICAgICBmcm9tICdsb2dsZXZlbCc7XG5cbmltcG9ydCBEaXNhc3NlbWJsZXIgICAgICAgZnJvbSAnLi9kaXNhc20nO1xuXG5jb25zdCBCSU9TX1VSTCAgPSBcIi4vYmlvcy5qc29uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoaXA4IGV4dGVuZHMgQmFzZVxue1xuICBjb25zdHJ1Y3RvcigpXG4gIHtcbiAgICBzdXBlcigpO1xuICAgIGxvZy5zZXRMZXZlbCgnZGVidWcnKTtcblxuICAgIHRoaXMuZGlzYXNtID0gbmV3IERpc2Fzc2VtYmxlcigpO1xuXG4gICAgdGhpcy5jeWNsZXMgPSAxO1xuXG4gICAgdGhpcy5yYW0gPSBuZXcgUkFNKCk7XG4gICAgdGhpcy5nZnggPSBuZXcgR0ZYKHRoaXMucmFtLmRhdGEpO1xuICAgIHRoaXMuY3B1ID0gbmV3IENQVSh0aGlzLmdmeCwgdGhpcy5yYW0pO1xuXG4gICAgdGhpcy5sb2FkZXIgPSBuZXcgTG9hZGVyKCk7XG4gICAgdGhpcy5jeWNsZVRpbWVyID0gbnVsbDtcblxuICAgIHRoaXMuX2luaXRFdmVudHMoKTtcbiAgICB0aGlzLl9yZXNldCgpO1xuICAgIHRoaXMuX2luaXRfYmlvcygpO1xuICAgIHRoaXMuX2V4ZWN1dGluZyA9IGZhbHNlO1xuICB9XG5cbiAgY3ljbGUoKVxuICB7XG4gICAgLy9jb25zb2xlLmxvZyhcImN5Y2xlXCIpOyByZXR1cm47XG4gICAgZm9yIChsZXQgdD0wOyB0PHRoaXMuY3ljbGVzOyB0KyspXG4gICAge1xuICAgICAgaWYgKCF0aGlzLl9leGVjdXRpbmcpIHJldHVybjtcbiAgICAgIGxldCBvcGNvZGUgPSB0aGlzLmNwdS5mZXRjaCgpO1xuICAgICAgLy9sZXQgZCA9IHRoaXMuZGlzYXNtLmRlY29kZShvcGNvZGUpO1xuICAgIC8vICBsb2cuZGVidWcoYFske3RoaXMuY3B1LnJlZy5pcC50b1N0cmluZygxNil9XSAke2QubX1cXHRcXHQke2QuZH1gKTtcbiAgICAgIHRoaXMuY3B1LmV4ZWN1dGUoXG4gICAgICAgIHRoaXMuY3B1LmRlY29kZShcbiAgICAgICAgICBvcGNvZGVcbiAgICAgICAgKVxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIHBvd2Vyb24oKVxuICB7XG4gICAgdGhpcy5fZXhlY3V0aW5nID0gdHJ1ZTtcbiAgICB0aGlzLmN5Y2xlVGltZXIgPSBzZXRJbnRlcnZhbCgodGhpcy5jeWNsZSkuYmluZCh0aGlzKSwgMTApO1xuICB9XG5cbiAgaGFsdCgpXG4gIHtcbiAgICBsb2cud2FybihcIkhhbHRpbmcgZXhlY3V0aW9uLi4uXCIpO1xuICAgIHRoaXMuX2V4ZWN1dGluZyA9IGZhbHNlO1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5jeWNsZVRpbWVyKTtcbiAgfVxuXG4gIHBhdXNlZHVtcCgpXG4gIHtcbiAgICB0aGlzLl9leGVjdXRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLl9kdW1wKCk7XG4gIH1cblxuICBzdGVwKClcbiAge1xuICAgIHRoaXMuX2V4ZWN1dGluZyA9IGZhbHNlO1xuXG4gICAgbGV0IG9wY29kZSA9IHRoaXMuY3B1LmZldGNoKCk7XG4gICAgbGV0IGQgPSB0aGlzLmRpc2FzbS5kZWNvZGUob3Bjb2RlKTtcbiAgICBsb2cuZGVidWcoYFske3RoaXMuY3B1LnJlZy5pcC50b1N0cmluZygxNil9XSAke2QubX1cXHRcXHQke2QuZH1gKTtcbiAgICB0aGlzLmNwdS5leGVjdXRlKFxuICAgICAgdGhpcy5jcHUuZGVjb2RlKFxuICAgICAgICBvcGNvZGVcbiAgICAgIClcbiAgICApXG5cbiAgICB0aGlzLl9kdW1wKCk7XG4gIH1cblxuICByZXN1bWUoKVxuICB7XG4gICAgdGhpcy5fZXhlY3V0aW5nID0gdHJ1ZTtcbiAgfVxuXG4gIGhhbHRkdW1wKClcbiAge1xuICAgIHRoaXMuaGFsdCgpO1xuICAgIHRoaXMuX2R1bXAoKTtcbiAgfVxuXG4gIF9kdW1wKClcbiAge1xuICAgIGxldCBzID0gJyc7XG5cbiAgICBmb3IgKGxldCB0PTAse3Z9PXRoaXMuY3B1LnJlZzsgdDx2Lmxlbmd0aDsgdCsrKVxuICAgIHtcbiAgICAgIHMgKz0gYHYke3QudG9TdHJpbmcoMTYpfT0ke3ZbdF19YDtcbiAgICAgIHMgKz0gdDx2Lmxlbmd0aC0xID8gJywgJyA6ICcnO1xuICAgIH1cblxuICAgIGxvZy53YXJuKHMpO1xuICAgIGxvZy53YXJuKGBpPSR7dGhpcy5jcHUucmVnLml9LCB2Zj0ke3RoaXMuY3B1LnJlZy52Zn0sIGlwPTB4JHt0aGlzLmNwdS5yZWcuaXAudG9TdHJpbmcoMTYpfWApO1xuICB9XG5cbiAgbG9hZCh1cmwsIGNhbGxiYWNrKVxuICB7XG4gICAgbG9nLmRlYnVnKGBGZXRjaGluZzogJyR7dXJsfSdgKTtcblxuICAgIHRoaXMubG9hZGVyLmxvYWQodXJsLCAoZGF0YSkgPT4ge1xuICAgICAgbG9nLmluZm8oYE9wZW5pbmcgdGl0bGUgJyR7ZGF0YS50aXRsZX0nYCk7XG5cbiAgICAgIGxldCBidWZmZXIgPSB0aGlzLl9iYXNlNjRUb0FycmF5QnVmZmVyKGRhdGEuYmluYXJ5KTtcbiAgICAgIHRoaXMucmFtLmJsaXQoYnVmZmVyLCA1MTIpO1xuXG4gICAgICBjYWxsYmFjaygpO1xuXG4gICAgfSk7XG4gIH1cblxuICBfaW5pdF9iaW9zKClcbiAge1xuICAgIC8vIExvYWQgdGhlIFwiQklPU1wiIGNoYXJhY3RlcnMgaW50byB0aGUgcHJvdGVjdGVkIGFyZWFcblxuICAgIHRoaXMubG9hZGVyLmxvYWQoQklPU19VUkwsIChiaW9zX2RhdGEpID0+IHtcblxuICAgICAgbGV0IGJ5dGVzID0gYmlvc19kYXRhLmJpbi5zcGxpdCgnLCcpO1xuICAgICAgbGV0IF9kYXRhID0gbmV3IEFycmF5QnVmZmVyKGJ5dGVzLmxlbmd0aCk7XG4gICAgICBsZXQgZGF0YSA9IG5ldyBVaW50OEFycmF5KF9kYXRhKTtcbiAgICAgIGxldCBwID0gMDtcblxuICAgICAgZm9yIChsZXQgY2hhcmxpbmUgb2YgYnl0ZXMpXG4gICAgICAgIGRhdGFbcCsrXSA9IChwYXJzZUludChcIjB4XCIrY2hhcmxpbmUsIDE2KSAmIDB4ZmYpO1xuXG4gICAgICB0aGlzLnJhbS5ibGl0KGRhdGEsIHRoaXMucmFtLmdldENoYXJBZGRyQklPUygpKTtcbiAgICB9KTtcblxuICB9XG5cbiAgX2Jhc2U2NFRvQXJyYXlCdWZmZXIoYmFzZTY0KVxuICB7XG4gICAgdmFyIGJpbmFyeV9zdHJpbmcgPSAgc2VsZi5hdG9iKGJhc2U2NCk7XG4gICAgdmFyIGxlbiA9IGJpbmFyeV9zdHJpbmcubGVuZ3RoO1xuXG4gICAgdmFyIGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoIGxlbiApO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICAgIGJ5dGVzW2ldID0gYmluYXJ5X3N0cmluZy5jaGFyQ29kZUF0KGkpO1xuXG4gICAgcmV0dXJuIGJ5dGVzO1xuICB9XG5cbiAgX3Jlc2V0KClcbiAge1xuICAgIHRoaXMuY3B1LnJlc2V0KCk7XG4gICAgdGhpcy5yYW0ucmVzZXQoKTtcbiAgfVxuXG4gIF9pbml0RXZlbnRzKClcbiAge1xuICAgIHRoaXMucmFtLm9uKCdncGYnLCAoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGRhdGEpO1xuICAgIH0pLmJpbmQodGhpcykpOyAvLyBPdmVycmlkZSAndGhpcycgdG8gdXNlIENoaXA4KCkgY29udGV4dCBpbnN0ZWFkIG9mIFJBTSgpJ3NcblxuICAgIHRoaXMuY3B1Lm9uKCdkZWJ1ZycsIChmdW5jdGlvbihkYXRhKSB7XG4gICAgICB0aGlzLl9leGVjdXRpbmcgPSBmYWxzZTtcbiAgICB9KS5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMuY3B1Lm9uKCdvcGNvZGUnLCAoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgdGhpcy5oYWx0KCk7XG4gICAgICBzZWxmLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgYWN0aW9uOiAnZXJyb3InLFxuICAgICAgICBhcmdzOntcbiAgICAgICAgICBlcnJvcjogZGF0YS5lcnJvcixcbiAgICAgICAgICB0cmFjZTogdGhpcy5jcHUudHJhY2UoKSxcbiAgICAgICAgICByZWdpc3RlcnM6IHRoaXMuY3B1LmR1bXBfcmVnaXN0ZXJzKCksXG4gICAgICAgICAgYWRkcmVzczogdGhpcy5jcHUucmVnLmlwXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pLmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5nZngub24oJ2NoYW5nZWQnLCAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgIGFjdGlvbjogJ3JlbmRlcicsXG4gICAgICAgICAgYXJnczoge1xuICAgICAgICAgICAgZnJhbWVCdWZmZXI6IHRoaXMuZ2Z4LmRpc3BsYXlcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pLmJpbmQodGhpcykpO1xuXG4gICAgc2VsZi5vbm1lc3NhZ2UgPSAodGhpcy5tZXNzYWdlSGFuZGxlcikuYmluZCh0aGlzKTtcbiAgfVxuXG4gIG1lc3NhZ2VIYW5kbGVyKG1zZylcbiAge1xuICAgIHN3aXRjaChtc2cuZGF0YS5hY3Rpb24pXG4gICAge1xuICAgICAgY2FzZSAnaW5wdXQnOlxuICAgICAgICB0aGlzLnJhbS5ibGl0KG1zZy5kYXRhLmFyZ3Mua2V5U3RhdGUsIHRoaXMucmFtLmdldEtleWJvYXJkQnVmZmVyQWRkcmVzcygpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdwYXVzZSc6XG4gICAgICAgIHRoaXMucGF1c2VkdW1wKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVzdW1lJzpcbiAgICAgICAgdGhpcy5yZXN1bWUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdoYWx0ZHVtcCc6XG4gICAgICAgIHRoaXMuaGFsdGR1bXAoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzdGVwJzpcbiAgICAgICAgdGhpcy5zdGVwKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG5cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3N5c3RlbS9jaGlwOC5qcyIsIlxuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICcuL2V2ZW50JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZSBleHRlbmRzIEV2ZW50RW1pdHRlclxue1xuXG4gIGNvbnN0cnVjdG9yICgpXG4gIHtcbiAgICBzdXBlcigpO1xuXG4gIH1cblxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vdXRpbC9iYXNlLmpzIiwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50RW1pdHRlclxue1xuICBjb25zdHJ1Y3RvcigpXG4gIHtcbiAgICB0aGlzLmxpc3RlbmVycyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLm9uID0gdGhpcy5hZGRMaXN0ZW5lcjtcbiAgICB0aGlzLmZpcmUgPSB0aGlzLmVtaXQ7XG5cbiAgfVxuXG4gIGFkZExpc3RlbmVyKGxhYmVsLCBmbilcbiAge1xuICAgIHRoaXMubGlzdGVuZXJzLmhhcyhsYWJlbCkgfHwgdGhpcy5saXN0ZW5lcnMuc2V0KGxhYmVsLCBbXSk7XG4gICAgdGhpcy5saXN0ZW5lcnMuZ2V0KGxhYmVsKS5wdXNoKGZuKTtcbiAgfVxuXG4gIF9pc0Z1bmN0aW9uKG9iailcbiAge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09ICdmdW5jdGlvbicgfHwgZmFsc2U7XG4gIH1cblxuICByZW1vdmVMaXN0ZW5lcihsYWJlbCwgZm4pXG4gIHtcbiAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnMuZ2V0KGxhYmVsKSxcbiAgICAgICAgaW5kZXg7XG5cbiAgICBpZiAobGlzdGVuZXJzICYmIGxpc3RlbmVycy5sZW5ndGgpXG4gICAge1xuICAgICAgICBpbmRleCA9IGxpc3RlbmVycy5yZWR1Y2UoKGksIGxpc3RlbmVyLCBpbmRleCkgPT4ge1xuICAgICAgICAgIHJldHVybiAoX2lzRnVuY3Rpb24obGlzdGVuZXIpICYmIGxpc3RlbmVyID09PSBjYWxsYmFjaykgP1xuICAgICAgICAgICAgaSA9IGluZGV4IDpcbiAgICAgICAgICAgIGk7XG4gICAgICAgIH0sIC0xKTtcblxuICAgICAgICBpZiAoaW5kZXggPiAtMSlcbiAgICAgICAge1xuICAgICAgICAgICAgbGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVycy5zZXQobGFiZWwsIGxpc3RlbmVycyk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBlbWl0KGxhYmVsLCAuLi5hcmdzKVxuICB7XG4gICAgbGV0IGxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzLmdldChsYWJlbCk7XG4gICAgaWYgKGxpc3RlbmVycyAmJiBsaXN0ZW5lcnMubGVuZ3RoKVxuICAgIHtcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lcikgPT4ge1xuICAgICAgICBsaXN0ZW5lciguLi5hcmdzKVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi91dGlsL2V2ZW50LmpzIiwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvYWRlclxue1xuICBjb25zdHJ1Y3RvcigpXG4gIHtcblxuICB9XG5cbiAgbG9hZCh1cmwsIGZuKVxuICB7XG4gICAgbGV0IHhtbGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgIHhtbGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT0gNCAmJiB0aGlzLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgICAgIHZhciBqc29uID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICBmbihqc29uKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB4bWxodHRwLm9wZW4oXCJHRVRcIiwgdXJsLCB0cnVlKTtcbiAgICB4bWxodHRwLnNlbmQoKTtcbiAgfVxuXG5cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3V0aWwvbG9hZGVyLmpzIiwiaW1wb3J0IGxvZyBmcm9tICdsb2dsZXZlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElucHV0XG57XG4gIC8vIE5vdGUsIHRoZSBrZXlzdGF0ZXMgYXJlIHdyaXR0ZW4gZGlyZWNsdHkgaW50byB0aGUgQ2hpcDgncyBCSU9TL1JBTVxuICAvLyBmb3IgZGlyZWN0IGFjY2VzcyBieSB0aGUgQ1BVXG5cbiAgY29uc3RydWN0b3IoY2FsbGJhY2spXG4gIHtcbiAgICAvLyAxIDIgMyBDXG4gICAgLy8gNCA1IDYgRFxuICAgIC8vIDcgOCA5IEVcbiAgICAvLyBBIDAgQiBGXG4gICAgLy8gdGhpcy5rZXlNYXAgPSBbXG4gICAgLy8gICAxOicxJywgMjonMicsIDM6JzMnLCBjOic0JyxcbiAgICAvLyAgIDQ6J3EnLCA1Oid3JywgNjonZScsIGQ6J3InLFxuICAgIC8vICAgNzonYScsIDg6J3MnLCA5OidkJywgZTonZicsXG4gICAgLy8gICAxMDoneicsIDowJ3gnLCBCOidjJywgZjondidcbiAgICAvLyBdO1xuXG4gICAgdGhpcy5rZXlEYXRhID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xuICAgIHRoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XG5cbiAgICB0aGlzLmtleU1hcCA9IFtcbiAgICAgICd4JywgJzEnLCAnMicsICczJyxcbiAgICAgICdxJywgJ3cnLCAnZScsICdhJyxcbiAgICAgICdzJywgJ2QnLCAneicsICdjJyxcbiAgICAgICc0JywgJ3InLCAnZicsICd2J1xuICAgIF07XG5cbiAgICB0aGlzLl9pbml0KCk7XG4gIH1cblxuICBfc2V0S2V5RG93bihrZXkpXG4gIHtcbiAgICAgIHRoaXMua2V5RGF0YVtrZXldID0gMTtcbiAgICAgIGlmICh0aGlzLl9jYWxsYmFjaykgdGhpcy5fY2FsbGJhY2sodGhpcy5rZXlEYXRhKTtcbiAgfVxuXG4gIF9zZXRLZXlVcChrZXkpXG4gIHtcbiAgICAgIHRoaXMua2V5RGF0YVtrZXldID0gMDtcbiAgICAgIGlmICh0aGlzLl9jYWxsYmFjaykgdGhpcy5fY2FsbGJhY2sodGhpcy5rZXlEYXRhKTtcbiAgfVxuXG4gIF9pbml0KClcbiAge1xuICAgIC8vSEFDSzogY29udmVydCBhcnJheSBpbnRvIGludGVnZXIgYXNjaWkgY29kZXMgZm9yIHF1aWNrZXIgbG9va3VwXG4gICAgZm9yIChsZXQgaz0wO2s8dGhpcy5rZXlNYXAubGVuZ3RoO2srKylcbiAgICAgIHRoaXMua2V5TWFwW2tdID0gdGhpcy5rZXlNYXBba10uY2hhckNvZGVBdCgwKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICAgIHZhciBjb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLmtleUNvZGUpLnRvTG93ZXJDYXNlKCkuY2hhckNvZGVBdCgwKVxuICAgICAgZm9yIChsZXQgaz0wOyBrPHRoaXMua2V5TWFwLmxlbmd0aDsgaysrKVxuICAgICAge1xuICAgICAgICBpZiAodGhpcy5rZXlNYXBba10gPT0gY29kZSlcbiAgICAgICAgICB0aGlzLl9zZXRLZXlEb3duKGspO1xuICAgICAgfVxuICAgICAgLy90aGlzLnByaW50VGFibGUoKTtcbiAgICB9LCB0cnVlKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChlKSA9PiB7XG4gICAgICAvL2xvZy53YXJuKCk7XG4gICAgICB2YXIgY29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZS5rZXlDb2RlKS50b0xvd2VyQ2FzZSgpLmNoYXJDb2RlQXQoMClcbiAgICAgIGZvciAobGV0IGs9MDsgazx0aGlzLmtleU1hcC5sZW5ndGg7IGsrKylcbiAgICAgIHtcbiAgICAgICAgaWYgKHRoaXMua2V5TWFwW2tdID09IGNvZGUpXG4gICAgICAgICAgdGhpcy5fc2V0S2V5VXAoayk7XG4gICAgICB9XG4gICAgfSwgdHJ1ZSk7XG5cbiAgfVxuXG5cblxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZG9tL2lucHV0LmpzIiwiLypcbiogbG9nbGV2ZWwgLSBodHRwczovL2dpdGh1Yi5jb20vcGltdGVycnkvbG9nbGV2ZWxcbipcbiogQ29weXJpZ2h0IChjKSAyMDEzIFRpbSBQZXJyeVxuKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4qL1xuKGZ1bmN0aW9uIChyb290LCBkZWZpbml0aW9uKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoZGVmaW5pdGlvbik7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByb290LmxvZyA9IGRlZmluaXRpb24oKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgbm9vcCA9IGZ1bmN0aW9uKCkge307XG4gICAgdmFyIHVuZGVmaW5lZFR5cGUgPSBcInVuZGVmaW5lZFwiO1xuXG4gICAgZnVuY3Rpb24gcmVhbE1ldGhvZChtZXRob2ROYW1lKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uc29sZSA9PT0gdW5kZWZpbmVkVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBXZSBjYW4ndCBidWlsZCBhIHJlYWwgbWV0aG9kIHdpdGhvdXQgYSBjb25zb2xlIHRvIGxvZyB0b1xuICAgICAgICB9IGVsc2UgaWYgKGNvbnNvbGVbbWV0aG9kTmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGJpbmRNZXRob2QoY29uc29sZSwgbWV0aG9kTmFtZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY29uc29sZS5sb2cgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGJpbmRNZXRob2QoY29uc29sZSwgJ2xvZycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBiaW5kTWV0aG9kKG9iaiwgbWV0aG9kTmFtZSkge1xuICAgICAgICB2YXIgbWV0aG9kID0gb2JqW21ldGhvZE5hbWVdO1xuICAgICAgICBpZiAodHlwZW9mIG1ldGhvZC5iaW5kID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kLmJpbmQob2JqKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLmNhbGwobWV0aG9kLCBvYmopO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIC8vIE1pc3NpbmcgYmluZCBzaGltIG9yIElFOCArIE1vZGVybml6ciwgZmFsbGJhY2sgdG8gd3JhcHBpbmdcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuYXBwbHkobWV0aG9kLCBbb2JqLCBhcmd1bWVudHNdKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gdGhlc2UgcHJpdmF0ZSBmdW5jdGlvbnMgYWx3YXlzIG5lZWQgYHRoaXNgIHRvIGJlIHNldCBwcm9wZXJseVxuXG4gICAgZnVuY3Rpb24gZW5hYmxlTG9nZ2luZ1doZW5Db25zb2xlQXJyaXZlcyhtZXRob2ROYW1lLCBsZXZlbCwgbG9nZ2VyTmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSB1bmRlZmluZWRUeXBlKSB7XG4gICAgICAgICAgICAgICAgcmVwbGFjZUxvZ2dpbmdNZXRob2RzLmNhbGwodGhpcywgbGV2ZWwsIGxvZ2dlck5hbWUpO1xuICAgICAgICAgICAgICAgIHRoaXNbbWV0aG9kTmFtZV0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXBsYWNlTG9nZ2luZ01ldGhvZHMobGV2ZWwsIGxvZ2dlck5hbWUpIHtcbiAgICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsb2dNZXRob2RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbWV0aG9kTmFtZSA9IGxvZ01ldGhvZHNbaV07XG4gICAgICAgICAgICB0aGlzW21ldGhvZE5hbWVdID0gKGkgPCBsZXZlbCkgP1xuICAgICAgICAgICAgICAgIG5vb3AgOlxuICAgICAgICAgICAgICAgIHRoaXMubWV0aG9kRmFjdG9yeShtZXRob2ROYW1lLCBsZXZlbCwgbG9nZ2VyTmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWZhdWx0TWV0aG9kRmFjdG9yeShtZXRob2ROYW1lLCBsZXZlbCwgbG9nZ2VyTmFtZSkge1xuICAgICAgICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgICAgICByZXR1cm4gcmVhbE1ldGhvZChtZXRob2ROYW1lKSB8fFxuICAgICAgICAgICAgICAgZW5hYmxlTG9nZ2luZ1doZW5Db25zb2xlQXJyaXZlcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIHZhciBsb2dNZXRob2RzID0gW1xuICAgICAgICBcInRyYWNlXCIsXG4gICAgICAgIFwiZGVidWdcIixcbiAgICAgICAgXCJpbmZvXCIsXG4gICAgICAgIFwid2FyblwiLFxuICAgICAgICBcImVycm9yXCJcbiAgICBdO1xuXG4gICAgZnVuY3Rpb24gTG9nZ2VyKG5hbWUsIGRlZmF1bHRMZXZlbCwgZmFjdG9yeSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgdmFyIGN1cnJlbnRMZXZlbDtcbiAgICAgIHZhciBzdG9yYWdlS2V5ID0gXCJsb2dsZXZlbFwiO1xuICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgc3RvcmFnZUtleSArPSBcIjpcIiArIG5hbWU7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHBlcnNpc3RMZXZlbElmUG9zc2libGUobGV2ZWxOdW0pIHtcbiAgICAgICAgICB2YXIgbGV2ZWxOYW1lID0gKGxvZ01ldGhvZHNbbGV2ZWxOdW1dIHx8ICdzaWxlbnQnKS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICAgICAgLy8gVXNlIGxvY2FsU3RvcmFnZSBpZiBhdmFpbGFibGVcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlW3N0b3JhZ2VLZXldID0gbGV2ZWxOYW1lO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxuXG4gICAgICAgICAgLy8gVXNlIHNlc3Npb24gY29va2llIGFzIGZhbGxiYWNrXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LmNvb2tpZSA9XG4gICAgICAgICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KHN0b3JhZ2VLZXkpICsgXCI9XCIgKyBsZXZlbE5hbWUgKyBcIjtcIjtcbiAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGdldFBlcnNpc3RlZExldmVsKCkge1xuICAgICAgICAgIHZhciBzdG9yZWRMZXZlbDtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHN0b3JlZExldmVsID0gd2luZG93LmxvY2FsU3RvcmFnZVtzdG9yYWdlS2V5XTtcbiAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XG5cbiAgICAgICAgICBpZiAodHlwZW9mIHN0b3JlZExldmVsID09PSB1bmRlZmluZWRUeXBlKSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICB2YXIgY29va2llID0gd2luZG93LmRvY3VtZW50LmNvb2tpZTtcbiAgICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IGNvb2tpZS5pbmRleE9mKFxuICAgICAgICAgICAgICAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChzdG9yYWdlS2V5KSArIFwiPVwiKTtcbiAgICAgICAgICAgICAgICAgIGlmIChsb2NhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgIHN0b3JlZExldmVsID0gL14oW147XSspLy5leGVjKGNvb2tpZS5zbGljZShsb2NhdGlvbikpWzFdO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gSWYgdGhlIHN0b3JlZCBsZXZlbCBpcyBub3QgdmFsaWQsIHRyZWF0IGl0IGFzIGlmIG5vdGhpbmcgd2FzIHN0b3JlZC5cbiAgICAgICAgICBpZiAoc2VsZi5sZXZlbHNbc3RvcmVkTGV2ZWxdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHN0b3JlZExldmVsO1xuICAgICAgfVxuXG4gICAgICAvKlxuICAgICAgICpcbiAgICAgICAqIFB1YmxpYyBBUElcbiAgICAgICAqXG4gICAgICAgKi9cblxuICAgICAgc2VsZi5sZXZlbHMgPSB7IFwiVFJBQ0VcIjogMCwgXCJERUJVR1wiOiAxLCBcIklORk9cIjogMiwgXCJXQVJOXCI6IDMsXG4gICAgICAgICAgXCJFUlJPUlwiOiA0LCBcIlNJTEVOVFwiOiA1fTtcblxuICAgICAgc2VsZi5tZXRob2RGYWN0b3J5ID0gZmFjdG9yeSB8fCBkZWZhdWx0TWV0aG9kRmFjdG9yeTtcblxuICAgICAgc2VsZi5nZXRMZXZlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gY3VycmVudExldmVsO1xuICAgICAgfTtcblxuICAgICAgc2VsZi5zZXRMZXZlbCA9IGZ1bmN0aW9uIChsZXZlbCwgcGVyc2lzdCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgbGV2ZWwgPT09IFwic3RyaW5nXCIgJiYgc2VsZi5sZXZlbHNbbGV2ZWwudG9VcHBlckNhc2UoKV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBsZXZlbCA9IHNlbGYubGV2ZWxzW2xldmVsLnRvVXBwZXJDYXNlKCldO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodHlwZW9mIGxldmVsID09PSBcIm51bWJlclwiICYmIGxldmVsID49IDAgJiYgbGV2ZWwgPD0gc2VsZi5sZXZlbHMuU0lMRU5UKSB7XG4gICAgICAgICAgICAgIGN1cnJlbnRMZXZlbCA9IGxldmVsO1xuICAgICAgICAgICAgICBpZiAocGVyc2lzdCAhPT0gZmFsc2UpIHsgIC8vIGRlZmF1bHRzIHRvIHRydWVcbiAgICAgICAgICAgICAgICAgIHBlcnNpc3RMZXZlbElmUG9zc2libGUobGV2ZWwpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlcGxhY2VMb2dnaW5nTWV0aG9kcy5jYWxsKHNlbGYsIGxldmVsLCBuYW1lKTtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSB1bmRlZmluZWRUeXBlICYmIGxldmVsIDwgc2VsZi5sZXZlbHMuU0lMRU5UKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBjb25zb2xlIGF2YWlsYWJsZSBmb3IgbG9nZ2luZ1wiO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhyb3cgXCJsb2cuc2V0TGV2ZWwoKSBjYWxsZWQgd2l0aCBpbnZhbGlkIGxldmVsOiBcIiArIGxldmVsO1xuICAgICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHNlbGYuc2V0RGVmYXVsdExldmVsID0gZnVuY3Rpb24gKGxldmVsKSB7XG4gICAgICAgICAgaWYgKCFnZXRQZXJzaXN0ZWRMZXZlbCgpKSB7XG4gICAgICAgICAgICAgIHNlbGYuc2V0TGV2ZWwobGV2ZWwsIGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBzZWxmLmVuYWJsZUFsbCA9IGZ1bmN0aW9uKHBlcnNpc3QpIHtcbiAgICAgICAgICBzZWxmLnNldExldmVsKHNlbGYubGV2ZWxzLlRSQUNFLCBwZXJzaXN0KTtcbiAgICAgIH07XG5cbiAgICAgIHNlbGYuZGlzYWJsZUFsbCA9IGZ1bmN0aW9uKHBlcnNpc3QpIHtcbiAgICAgICAgICBzZWxmLnNldExldmVsKHNlbGYubGV2ZWxzLlNJTEVOVCwgcGVyc2lzdCk7XG4gICAgICB9O1xuXG4gICAgICAvLyBJbml0aWFsaXplIHdpdGggdGhlIHJpZ2h0IGxldmVsXG4gICAgICB2YXIgaW5pdGlhbExldmVsID0gZ2V0UGVyc2lzdGVkTGV2ZWwoKTtcbiAgICAgIGlmIChpbml0aWFsTGV2ZWwgPT0gbnVsbCkge1xuICAgICAgICAgIGluaXRpYWxMZXZlbCA9IGRlZmF1bHRMZXZlbCA9PSBudWxsID8gXCJXQVJOXCIgOiBkZWZhdWx0TGV2ZWw7XG4gICAgICB9XG4gICAgICBzZWxmLnNldExldmVsKGluaXRpYWxMZXZlbCwgZmFsc2UpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICpcbiAgICAgKiBQYWNrYWdlLWxldmVsIEFQSVxuICAgICAqXG4gICAgICovXG5cbiAgICB2YXIgZGVmYXVsdExvZ2dlciA9IG5ldyBMb2dnZXIoKTtcblxuICAgIHZhciBfbG9nZ2Vyc0J5TmFtZSA9IHt9O1xuICAgIGRlZmF1bHRMb2dnZXIuZ2V0TG9nZ2VyID0gZnVuY3Rpb24gZ2V0TG9nZ2VyKG5hbWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiIHx8IG5hbWUgPT09IFwiXCIpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiWW91IG11c3Qgc3VwcGx5IGEgbmFtZSB3aGVuIGNyZWF0aW5nIGEgbG9nZ2VyLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsb2dnZXIgPSBfbG9nZ2Vyc0J5TmFtZVtuYW1lXTtcbiAgICAgICAgaWYgKCFsb2dnZXIpIHtcbiAgICAgICAgICBsb2dnZXIgPSBfbG9nZ2Vyc0J5TmFtZVtuYW1lXSA9IG5ldyBMb2dnZXIoXG4gICAgICAgICAgICBuYW1lLCBkZWZhdWx0TG9nZ2VyLmdldExldmVsKCksIGRlZmF1bHRMb2dnZXIubWV0aG9kRmFjdG9yeSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxvZ2dlcjtcbiAgICB9O1xuXG4gICAgLy8gR3JhYiB0aGUgY3VycmVudCBnbG9iYWwgbG9nIHZhcmlhYmxlIGluIGNhc2Ugb2Ygb3ZlcndyaXRlXG4gICAgdmFyIF9sb2cgPSAodHlwZW9mIHdpbmRvdyAhPT0gdW5kZWZpbmVkVHlwZSkgPyB3aW5kb3cubG9nIDogdW5kZWZpbmVkO1xuICAgIGRlZmF1bHRMb2dnZXIubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gdW5kZWZpbmVkVHlwZSAmJlxuICAgICAgICAgICAgICAgd2luZG93LmxvZyA9PT0gZGVmYXVsdExvZ2dlcikge1xuICAgICAgICAgICAgd2luZG93LmxvZyA9IF9sb2c7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVmYXVsdExvZ2dlcjtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGRlZmF1bHRMb2dnZXI7XG59KSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9nbGV2ZWwvbGliL2xvZ2xldmVsLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlxuaW1wb3J0IGxvZyBmcm9tICdsb2dsZXZlbCc7XG5pbXBvcnQgQmFzZSBmcm9tICcuLi8uLi91dGlsL2Jhc2UnO1xuaW1wb3J0IHtvcGNvZGVzfSBmcm9tICcuL29wY29kZXMnO1xuXG5pbXBvcnQgRGVsYXlUaW1lciAgICAgICAgIGZyb20gJy4uL3RpbWVyLWRlbGF5JztcblxuY29uc3QgV09SRF9TSVpFID0gMjsgICAgICAgICAgICAvLyAxNi1iaXQgaW5zdHJ1Y3Rpb25cbmNvbnN0IElQX0lOSVQgPSAweDIwMDsgICAgICAgICAgLy8gPSA1MTIuIEJ5dGVzIDAtNTExIHJlc2VydmVkIGZvciBidWlsdC1pbiBpbnRlcnByZXRlclxuY29uc3QgVFJBQ0VfQlVGRkVSX1NJWkUgPSAxMDsgICAvLyBzdG9yZSBsYXN0IDEwIGluc3RydWN0aW9uc1xuY29uc3QgX1ZGICAgICAgICA9IDB4ZjsgICAgICAgICAgICAgIC8vIEZsYWcgcmVnaXN0ZXJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ1BVIGV4dGVuZHMgQmFzZVxue1xuICBjb25zdHJ1Y3RvcihnZngsIHJhbSlcbiAge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fdGhpcyA9IFwiQ1BVXCI7IC8vIGZvciBjb250ZXh0IGRlYnVnZ2luZyAoVF9UKVxuICAgIHRoaXMuZ2Z4ID0gZ2Z4O1xuICAgIHRoaXMucmFtID0gcmFtO1xuICAgIHRoaXMua2V5U3RhdGVBZGRyID0gcmFtLmdldEtleWJvYXJkQnVmZmVyQWRkcmVzcygpO1xuICAgIGxvZy5kZWJ1ZyhcIkNQVSBJbml0aWFsaXNlZFwiKTtcblxuICAgIHRoaXMuX3RyYWNlID0gbmV3IEFycmF5KFRSQUNFX0JVRkZFUl9TSVpFKTtcbiAgICB0aGlzLl90cmFjZV9wdHIgPSAwO1xuXG4gICAgLy8gSSBmZWVsIGxpa2UgdGhpcyBzaG91bGQgYmUgcGFydCBvZiB0aGUgQ2hpcDgoKSBvYmplY3Qvc3lzdGVtIGluc3RlYWQgb2ZcbiAgICAvLyBpbiBoZXJlIGJ1dCB0aGUgZGVsYXkgdGltZXIgYXBwZWFycyB0byBiZSBvbmx5IGFjY2Vzc2VkIG9yIHVzZWQgZGlyZWN0bHlcbiAgICAvLyBieSB0aGUgQ1BVIHNvIHdoYXRldmVyXG4gICAgdGhpcy5kZWxheVRpbWVyID0gbmV3IERlbGF5VGltZXIoKTtcblxuICAgIHRoaXMucmVnID0ge1xuICAgICAgdjogW10sXG4gICAgICBpOiAgMCxcbiAgICAgIF9pcDogMCxcbiAgICAgIF9zcDogMCxcbiAgICAgIGdldCBpcCgpIHtyZXR1cm4gdGhpcy5faXB9LFxuICAgICAgZ2V0IHNwKCkge3JldHVybiB0aGlzLl9zcH0sXG4gICAgfTtcblxuICAgIHRoaXMuc3RhY2sgPSBbXVxuICAgIHRoaXMuZXhlYyA9IG9wY29kZXM7XG4gIH1cblxuICByZXNldCgpXG4gIHtcbiAgICBsZXQgciA9IHRoaXMucmVnO1xuICAgIFtyLnYsIHIuaSwgci5faXAsIHIuX3NwXSA9IFtuZXcgQXJyYXkoMTYpLmZpbGwoMCksMCxJUF9JTklULDBdO1xuICB9XG5cbiAgbmV4dCgpXG4gIHtcbiAgICB0aGlzLnJlZy5faXAgKz0gV09SRF9TSVpFO1xuICB9XG5cbiAgZmV0Y2goKVxuICB7XG4gICAgcmV0dXJuIHRoaXMucmFtLnJlYWRXb3JkKHRoaXMucmVnLmlwKTtcbiAgfVxuXG4gIGRlY29kZShpbnN0cilcbiAge1xuICAgIGxldCBpID0gaW5zdHIgJiAweGZmZmY7XG4gICAgbGV0IG1ham9yID0gKGkgJiAweGYwMDApID4+IDEyLFxuICAgICAgICBtaW5vciA9IGkgJiAweDBmZmY7XG5cbiAgICB0aGlzLl9hZGRfdG9fdHJhY2VfbG9vcChpbnN0ciwgdGhpcy5yZWcuaXApO1xuXG4gICAgcmV0dXJuIHttYWpvciwgbWlub3J9XG4gIH1cblxuICBleGVjdXRlKHttYWpvciwgbWlub3J9KVxuICB7XG4gICAgaWYgKCF0aGlzLmV4ZWNbbWFqb3JdLmNhbGwodGhpcywge21ham9yLCBtaW5vcn0pKVxuICAgICAgICB0aGlzLm5leHQoKTtcbiAgfVxuXG4gIC8vIEknbSBwYXJ0aWN1bGFybHkgcGxlYXNlZCB3aXRoIHRoaXMgbG9vcGVkIGJ1ZmZlciBzb2x1dGlvblxuICAvLyB0byByZWNvcmQgYSB3aW5kb3cvc25hcHNob3Qgb2YgYSBkYXRhLXN0cmVhbSBvZiBpbmZpbml0ZSAodW5rbm93bikgbGVuZ3RoXG4gIC8vIEtpbmRhIGxpa2UgaG93IHRoZSBidWZmZXIgd29ya3MgaW4gYSBkaWdpdGFsIHNvdW5kIGNoaXBcbiAgLy8gVGhpcyBpcyBvYnZpb3VzbHkgZmFzdGVyIHRoYW4gc2xpY2luZyBhbiBhcnJheSdzIGVsZW1lbnRzXG4gIF9hZGRfdG9fdHJhY2VfbG9vcChpLGEpXG4gIHtcbiAgICB0aGlzLl90cmFjZVt0aGlzLl90cmFjZV9wdHIrK10gPSB7aSwgYX1cbiAgICBpZiAodGhpcy5fdHJhY2VfcHRyID09IFRSQUNFX0JVRkZFUl9TSVpFKVxuICAgICAgdGhpcy5fdHJhY2VfcHRyID0gMDtcbiAgfVxuXG4gIF91bnJvbGxfdHJhY2VfbG9vcCgpXG4gIHtcbiAgICAvLyBTZXBhcmF0ZSB0aGUgaW5zdHJ1Y3Rpb24gYW5kIGFkZHJlc3MgaW50byBzZXBhcmF0ZVxuICAgIC8vIGFycmF5cyBmb3IgZWFzaWVyIHBhc3NpbmcgdG8gdGhlIGRpc2Fzc2VtYmxlclxuICAgIGxldCB0cmFjZV91bnJvbGxlZCA9IHtpOltdLCBhOltdfTtcblxuICAgIGxldCBpcCA9IHRoaXMuX3RyYWNlX3B0cjtcbiAgICBmb3IgKGxldCBwPTA7IHA8VFJBQ0VfQlVGRkVSX1NJWkU7IHArKylcbiAgICB7XG4gICAgICB0cmFjZV91bnJvbGxlZC5hLnB1c2godGhpcy5fdHJhY2VbaXBdLmEpOyAgLy8gYWRkcmVzc1xuICAgICAgdHJhY2VfdW5yb2xsZWQuaS5wdXNoKHRoaXMuX3RyYWNlW2lwXS5pKSAgIC8vIGluc3RydWN0aW9uXG4gICAgICBpZiAoLS1pcCA8IDApIGlwID0gVFJBQ0VfQlVGRkVSX1NJWkUtMTtcbiAgICB9XG5cbiAgICB0cmFjZV91bnJvbGxlZC5hLnJldmVyc2UoKTtcbiAgICB0cmFjZV91bnJvbGxlZC5pLnJldmVyc2UoKTtcbiAgICByZXR1cm4gdHJhY2VfdW5yb2xsZWQ7XG4gIH1cblxuICB0cmFjZSgpXG4gIHtcbiAgICByZXR1cm4gdGhpcy5fdW5yb2xsX3RyYWNlX2xvb3AoKTtcbiAgfVxuXG4gIGR1bXBfcmVnaXN0ZXJzKClcbiAge1xuICAgIHJldHVybiB0aGlzLnJlZztcbiAgfVxuXG5cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3N5c3RlbS9jcHUvY3B1LmpzIiwiXG5pbXBvcnQgbG9nIGZyb20gJ2xvZ2xldmVsJztcblxuaW1wb3J0IHskX2luc3RyXzB4MH0gZnJvbSAnLi9vcGNvZGUtMHgwLmpzJztcbmltcG9ydCB7JF9pbnN0cl8weDh9IGZyb20gJy4vb3Bjb2RlLTB4OC5qcyc7XG5pbXBvcnQgeyRfaW5zdHJfMHhFfSBmcm9tICcuL29wY29kZS0weEUuanMnO1xuaW1wb3J0IHskX2luc3RyXzB4Rn0gZnJvbSAnLi9vcGNvZGUtMHhGLmpzJztcblxuY29uc3QgX1ZGICAgICAgICA9IDB4ZjsgICAgICAgICAgICAgIC8vIEZsYWcgcmVnaXN0ZXJcblxuZXhwb3J0IGxldCBvcGNvZGVzID0gW1xuXG4gIGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAgLy8gMHgwPz8/XG4gIHtcbiAgICAkX2luc3RyXzB4MFttaW5vciAmIDB4ZmZdLmNhbGwodGhpcywge21ham9yLCBtaW5vcn0pO1xuICB9LFxuXG4gIGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAvLzB4MW5ubjogSk1QIG5ublxuICB7XG4gICAgdGhpcy5yZWcuX2lwID0gbWlub3ImMHhmZmY7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vIDB4Mm5ubjogQ0FMTCBubm5cbiAge1xuICAgIHRoaXMuc3RhY2sucHVzaCh0aGlzLnJlZy5pcCk7XG4gICAgdGhpcy5yZWcuX2lwID0gbWlub3ImMHhmZmY7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vIDB4M1hSUiAvLyBqdW1wIG5leHQgaW5zdHIgaWYgdlggPT0gUlJcbiAge1xuICAgIGlmICh0aGlzLnJlZy52WyhtaW5vcj4+OCkmMHhmXSA9PSAobWlub3ImMHhmZikpXG4gICAgICB0aGlzLnJlZy5faXAgKz0gMjtcbiAgfSxcblxuICBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSkgLy80XG4gIHtcbiAgICBpZiAodGhpcy5yZWcudlsobWlub3I+PjgpJjB4Zl0gIT0gKG1pbm9yJjB4ZmYpKVxuICAgICAgdGhpcy5yZWcuX2lwICs9IDI7XG4gIH0sXG5cbiAgZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vNVxuICB7XG4gICAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xuICB9LFxuXG4gIGZ1bmN0aW9uICh7bWFqb3IsIG1pbm9yfSkgLy8gMHg2eG5uICBtb3YgdngsIG5uXG4gIHtcbiAgICB0aGlzLnJlZy52WyhtaW5vcj4+OCkmMHhmXSA9IG1pbm9yICYgMHhmZjtcbiAgfSxcblxuICBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSkgLy8gMHg3eHJyIGFkZCB2eCwgcnJcbiAge1xuICAgIGxldCB4ID0gKG1pbm9yPj44KSYweGZcbiAgICB0aGlzLnJlZy52W3hdICs9IG1pbm9yJjB4ZmY7XG4gICAgdGhpcy5yZWcudlt4XSAmPSAyNTU7XG5cbiAgfSxcblxuICBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSkgLy8gMHg4XG4gIHtcbiAgICAkX2luc3RyXzB4OFttaW5vciAmIDB4Zl0uY2FsbCh0aGlzLCB7bWFqb3IsIG1pbm9yfSk7XG4gIH0sXG5cbiAgZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vIDlcbiAge1xuICAgIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbiAgfSxcblxuICBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSkgLy8gMHhBbm5uOiBtdmkgbm5uIChsb2FkICdJJyB3aXRoIG5ubilcbiAge1xuICAgIHRoaXMucmVnLmkgPSBtaW5vciAmIDB4ZmZmO1xuICB9LFxuXG4gIGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAvLyBiXG4gIHtcbiAgICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG4gIH0sXG5cbiAgZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vIDB4Q3hrazsgcm5kIHZ4LCBra1xuICB7XG4gICAgbGV0IHJuZCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI1NSkgJiAobWlub3ImMHhmZilcbiAgICB0aGlzLnJlZy52WyhtaW5vcj4+OCkmMHhmXSA9IHJuZDtcbiAgfSxcblxuICBmdW5jdGlvbiAoe21ham9yLCBtaW5vcn0pICAvLyAweER4eW46IERSVyBWeCwgVnksIG4gIChkcmF3IHNwcml0ZSlcbiAge1xuICAgIGxldCByID0gdGhpcy5yZWcsIG0gPSBtaW5vcjtcbiAgICByLnZbX1ZGXSA9IHRoaXMuZ2Z4LmRyYXcoci5pLCByLnZbKG0+PjgpJjB4Zl0sIHIudlsobT4+NCkmMHhmXSwgbSYweGYpO1xuICB9LFxuXG4gIGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAvLyAweEVcbiAge1xuICAgICRfaW5zdHJfMHhFW21pbm9yICYgMHhmZl0uY2FsbCh0aGlzLCB7bWFqb3IsIG1pbm9yfSk7XG4gIH0sXG5cbiAgZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pICAvLyAweEZ4Pz9cbiAge1xuICAgICRfaW5zdHJfMHhGW21pbm9yICYgMHhmZl0uY2FsbCh0aGlzLCB7bWFqb3IsIG1pbm9yfSk7XG4gIH1cbl07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zeXN0ZW0vY3B1L29wY29kZXMuanMiLCJcbmltcG9ydCBsb2cgZnJvbSAnbG9nbGV2ZWwnO1xuXG5sZXQgTUFYX0lOU1RSID0gMHhGRjtcbmxldCAkX2luc3RyXzB4MCA9IFtdO1xuXG4vLyBwcm9icyBhIHNtYXJ0ZXIgd2F5IHRvIGRvIHRoaXMgYnV0IG9oIHdlbGxcbmZvciAodmFyIHQ9MDsgdDw9TUFYX0lOU1RSOyB0KyspXG4gICRfaW5zdHJfMHgwLnB1c2goIHt9ICk7XG5cbiRfaW5zdHJfMHgwWzB4RTBdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vIFJFVCAoc3RhY2sucG9wKVxue1xuICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG5cbiRfaW5zdHJfMHgwWzB4RUVdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vIFJFVCAoc3RhY2sucG9wKVxue1xuICBsZXQgYWRkciA9IHRoaXMuc3RhY2sucG9wKCk7XG4gIHRoaXMucmVnLl9pcCA9IGFkZHI7XG59XG5cbmV4cG9ydCB7JF9pbnN0cl8weDB9O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3lzdGVtL2NwdS9vcGNvZGUtMHgwLmpzIiwiXG5sZXQgJF9pbnN0cl8weDggPSBbXTtcblxuY29uc3QgX1ZGICAgICAgICA9IDB4ZjsgICAgICAgICAgICAgIC8vIEZsYWcgcmVnaXN0ZXJcblxuJF9pbnN0cl8weDhbMHgwXSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICB0aGlzLnJlZy52W21pbm9yPj44JjB4Zl0gPSB0aGlzLnJlZy52WyhtaW5vcj4+NCkmMHhmXTtcbiAgLy90aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG4kX2luc3RyXzB4OFsweDFdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cblxuJF9pbnN0cl8weDhbMHgyXSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAvLyBhbmQgdngsIHZ5XG57XG4gIGxldCB2eCA9IChtaW5vcj4+OCkmMHhmO1xuICBsZXQgdnkgPSAobWlub3I+PjQpJjB4ZjtcbiAgbGV0IHJ4ID0gdGhpcy5yZWcudlt2eF07XG4gIGxldCByeSA9IHRoaXMucmVnLnZbdnldO1xuICBsZXQgcmVzID0gdGhpcy5yZWcudlt2eF0gJiB0aGlzLnJlZy52WyhtaW5vcj4+NCkmMHhmXTtcbiAgbGV0IG1zZyA9IGBhbmQgJHt2eH0sICR7dnl9IChhbmQgJHtyeH0sICR7cnl9ID0gJHtyZXN9KWA7XG4gIHRoaXMucmVnLnZbdnhdID0gcmVzOy8vdGhpcy5yZWcudlt2eF0gJiB0aGlzLnJlZy52WyhtaW5vcj4+NCkmMHhmXTtcbiAgLy90aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogbXNnfSk7XG4gIC8vY29uc29sZS5sb2cobXNnKTtcbiAgLy90aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG4kX2luc3RyXzB4OFsweDNdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cbiRfaW5zdHJfMHg4WzB4NF0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSkgLy8gQUREIHZ4LCB2eSAtPiB2Zlxue1xuICAvL3RoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcblxuICBsZXQgeCA9IChtaW5vcj4+OCkmMHhmLCB5ID0gKG1pbm9yPj40KSYweGY7XG4gIHRoaXMucmVnLnZbeF0gKz0gdGhpcy5yZWcudlt5XTtcbiAgdGhpcy5yZWcudltfVkZdID0gKyh0aGlzLnJlZy52W3hdID4gMjU1KTtcbiAgaWYgKHRoaXMucmVnLnZbeF0gPiAyNTUpIHRoaXMucmVnLnZbeF0gLT0gMjU2O1xuXG4gIC8vIGxldCB2eCA9IChtaW5vcj4+OCkmMHhmO1xuICAvLyBsZXQgciA9IHRoaXMucmVnLnZbdnhdICsgdGhpcy5yZWcudlsobWlub3I+PjQpJjB4Zl07XG4gIC8vIGxldCBtc2cgPSBgJHt0aGlzLnJlZy52W3Z4XX0gKyAke3RoaXMucmVnLnZbKG1pbm9yPj40KSYweGZdfSA9ICR7cn0gKGFjdHVhbCA9ICR7dGhpcy5yZWcudlt2eF19LCBmbGFnID0gJHt0aGlzLnJlZy52Zn0pYDtcbiAgLy8gdGhpcy5yZWcudlt2eF0gPSByJjB4ZmY7XG4gIC8vIHRoaXMucmVnLnZmID0gKCEhKHImMHhmZjAwKSkrMDsgIC8vIGxvbFxuICAvLyBjb25zb2xlLmRlYnVnKG1zZylcbiAgLy90aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogbXNnfSk7XG59XG4kX2luc3RyXzB4OFsweDVdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIGxldCB4ID0gKG1pbm9yPj44KSYweGYsIHkgPSAobWlub3I+PjQpJjB4ZjtcbiAgdGhpcy5yZWcudltfVkZdID0gKyh0aGlzLnJlZy52W3hdID4gdGhpcy5yZWcudlt5XSk7XG4gIHRoaXMucmVnLnZbeF0gLT0gdGhpcy5yZWcudlt5XTtcbiAgLy90aGlzLmZpcmUoJ2RlYnVnJyk7XG4gIGlmICh0aGlzLnJlZy52W3hdIDwgMCkgdGhpcy5yZWcudlt4XSArPSAyNTY7XG5cbiAgLy8gbGV0IHZ4ID0gdGhpcy5yZWcudlsobWlub3I+PjgpJjB4Zl0sIHZ5ID0gdGhpcy5yZWcudlsobWlub3I+PjQpJjB4Zl07XG4gIC8vIGxldCBmID0gKHZ4ID4gdnkpKzA7XG4gIC8vIHRoaXMucmVnLnZbdnhdID0gZiA/IHRoaXMucmVnLnZbdnhdIC0gdGhpcy5yZWcudlt2eV0gOiB0aGlzLnJlZy52W3Z5XSAtIHRoaXMucmVnLnZbdnhdO1xuICAvL3RoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cbiRfaW5zdHJfMHg4WzB4Nl0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuJF9pbnN0cl8weDhbMHg3XSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG4kX2luc3RyXzB4OFsweDhdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cbiRfaW5zdHJfMHg4WzB4OV0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuJF9pbnN0cl8weDhbMHhBXSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG4kX2luc3RyXzB4OFsweEJdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cbiRfaW5zdHJfMHg4WzB4Q10gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuJF9pbnN0cl8weDhbMHhEXSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG4kX2luc3RyXzB4OFsweEVdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cbiRfaW5zdHJfMHg4WzB4Rl0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuXG5leHBvcnR7JF9pbnN0cl8weDh9O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3lzdGVtL2NwdS9vcGNvZGUtMHg4LmpzIiwiXG5pbXBvcnQgbG9nIGZyb20gJ2xvZ2xldmVsJztcblxubGV0IE1BWF9JTlNUUiA9IDB4QTE7XG5sZXQgJF9pbnN0cl8weEUgPSBbXTtcblxuLy8gcHJvYnMgYSBzbWFydGVyIHdheSB0byBkbyB0aGlzIGJ1dCBvaCB3ZWxsXG5mb3IgKHZhciB0PTA7IHQ8PU1BWF9JTlNUUjsgdCsrKVxuICAkX2luc3RyXzB4RS5wdXNoKCB7fSApO1xuXG4kX2luc3RyXzB4RVsweDlFXSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG5cbiRfaW5zdHJfMHhFWzB4QTFdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIGlmICh0aGlzLnJhbS5kYXRhW3RoaXMua2V5U3RhdGVBZGRyICsgdGhpcy5yZWcudlsobWlub3I+PjgpJjB4Zl1dID09IDApXG4gICAgdGhpcy5yZWcuX2lwICs9IDI7XG59XG5cblxuZXhwb3J0IHskX2luc3RyXzB4RX07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zeXN0ZW0vY3B1L29wY29kZS0weEUuanMiLCJcbmltcG9ydCBsb2cgZnJvbSAnbG9nbGV2ZWwnO1xuXG5sZXQgTUFYX0lOU1RSID0gMHg2NTtcbmxldCAkX2luc3RyXzB4RiA9IFtdO1xuXG4vLyBwcm9icyBhIHNtYXJ0ZXIgd2F5IHRvIGRvIHRoaXMgYnV0IG9oIHdlbGxcbmZvciAodmFyIHQ9MDsgdDw9TUFYX0lOU1RSOyB0KyspXG4gICRfaW5zdHJfMHhGLnB1c2goe30pO1xuXG4kX2luc3RyXzB4RlsweDA3XSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAvLyBGeDA3OiByZWFkIGRlbGF5IHRpbWVyIGZyb20gVnhcbntcbiAgdGhpcy5yZWcudlsobWlub3I+PjgpJjB4Zl0gPSB0aGlzLmRlbGF5VGltZXIuZ2V0KCk7XG59XG5cbiRfaW5zdHJfMHhGWzB4MEFdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cblxuJF9pbnN0cl8weEZbMHgxNV0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSkgLy8gRngxNTogc2V0IGRlbGF5IHRpbWVyIGZyb20gVnhcbntcbiAgdGhpcy5kZWxheVRpbWVyLnNldCh0aGlzLnJlZy52WyhtaW5vcj4+OCkmMHhmXSk7XG59XG5cbiRfaW5zdHJfMHhGWzB4MThdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIC8vdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuJF9pbnN0cl8weEZbMHgxRV0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuXG4kX2luc3RyXzB4RlsweDI5XSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICBsZXQgdmFsID0gdGhpcy5yZWcudlsobWlub3I+PjgpJjB4Zl07XG4gIHRoaXMucmVnLmkgPSB0aGlzLnJhbS5nZXRDaGFyQWRkckJJT1MoKSArICh0aGlzLnJhbS5nZXRDaGFyU2l6ZUJJT1MoKSAqIHZhbCk7XG59XG5cbiRfaW5zdHJfMHhGWzB4MzBdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cblxuJF9pbnN0cl8weEZbMHgzM10gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSkgLy8gRngzMzogYmNkIFtpXSwgVnggKHN0b3JlIGJjZCBvZiByZWcgVnggYXQgYWRkcmVzcyByZWcgaS0+aSsyKVxue1xuICBsZXQgdiA9IHRoaXMucmVnLnZbKG1pbm9yPj44KSYweGZdO1xuICB0aGlzLnJhbS5kYXRhW3RoaXMucmVnLmkrMF0gPSBNYXRoLmZsb29yKHYgLyAxMDApO1xuICB0aGlzLnJhbS5kYXRhW3RoaXMucmVnLmkrMV0gPSBNYXRoLmZsb29yKCh2ICUgMTAwKSAvIDEwKTtcbiAgdGhpcy5yYW0uZGF0YVt0aGlzLnJlZy5pKzJdID0gKHYgJSAxMCk7XG59XG5cbiRfaW5zdHJfMHhGWzB4NTVdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cblxuJF9pbnN0cl8weEZbMHg2NV0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSkgLy8gRng2NTogbW92IHYwLXZ4LCBbaV0gKGxvYWQgbnVtYmVycyBmcm9tIHJlZy5pIGludG8gcmVnLnYwIC0+IHJlZy52eClcbntcbiAgZm9yICh2YXIgeD0wLCBteD0obWlub3I+PjgpJjB4ZjsgeDw9bXg7IHgrKylcbiAgICB0aGlzLnJlZy52W3hdID0gdGhpcy5yYW0uZGF0YVt0aGlzLnJlZy5pICsgeF07XG5cbiAgdGhpcy5yZWcuaSArPSB4OyAvLyBpID0gaSArIFggKyAxXG59XG5cbmV4cG9ydCB7JF9pbnN0cl8weEZ9O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3lzdGVtL2NwdS9vcGNvZGUtMHhGLmpzIiwiXG5jb25zdCBGUkVRVUVOQ1kgPSAxMDAwLzYwOyAvLyA2MEh6XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlbGF5VGltZXJcbntcbiAgY29uc3RydWN0b3IoKVxuICB7XG4gICAgdGhpcy5jb3VudGVyID0gMDtcbiAgICB0aGlzLl90aW1lcklkID0gbnVsbDtcbiAgfVxuXG4gIHNldCh2YWx1ZSlcbiAge1xuICAgIHRoaXMuY291bnRlciA9IHZhbHVlICYgMHhmZjtcbiAgICB0aGlzLl9zdGFydCgpO1xuICB9XG5cbiAgZ2V0KHZhbHVlKVxuICB7XG4gICAgcmV0dXJuIHRoaXMuY291bnRlcjtcbiAgfVxuXG4gIGludGVydmFsRnVuYygpXG4gIHtcbiAgICB0aGlzLmNvdW50ZXItLTtcbiAgICBpZiAodGhpcy5jb3VudGVyID09IDApIHRoaXMuX3N0b3AoKTtcbiAgfVxuXG4gIF9zdGFydCgpXG4gIHtcbiAgICB0aGlzLl90aW1lcklkID0gc2VsZi5zZXRJbnRlcnZhbCgodGhpcy5pbnRlcnZhbEZ1bmMpLmJpbmQodGhpcykpO1xuICB9XG5cbiAgX3N0b3AoKVxuICB7XG4gICAgaWYgKHRoaXMuX3RpbWVySWQpXG4gICAge1xuICAgICAgc2VsZi5jbGVhckludGVydmFsKHRoaXMuX3RpbWVySWQpO1xuICAgICAgdGhpcy5fdGltZXJJZCA9IG51bGw7XG4gICAgfVxuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zeXN0ZW0vdGltZXItZGVsYXkuanMiLCJcbmltcG9ydCBCYXNlIGZyb20gJy4uL3V0aWwvYmFzZSc7XG5cbmNvbnN0IEJJT1NfQ0hBUl9CQVNFX0FERFIgPSAweDA7XG5jb25zdCBCSU9TX0NIQVJfU0laRSA9IDU7XG5jb25zdCBCSU9TX05VTV9DSEFSUyA9IDE2O1xuY29uc3QgQklPU19LRVlCX0JBU0VfQUREUiA9IChCSU9TX0NIQVJfU0laRSAqIEJJT1NfTlVNX0NIQVJTKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUkFNIGV4dGVuZHMgQmFzZVxue1xuICBjb25zdHJ1Y3RvcigpXG4gIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX3RoaXMgPSBcIlJBTVwiO1xuICAgIHRoaXMuX2RhdGEgPSBuZXcgQXJyYXlCdWZmZXIoMHgxMDAwKTtcbiAgICB0aGlzLmRhdGEgPSBuZXcgVWludDhBcnJheSh0aGlzLl9kYXRhKTtcbiAgfVxuXG4gIHJlc2V0KClcbiAge1xuICAgIC8vdGhpcy5kYXRhID0gbmV3IEFycmF5KDB4MTAwMCkuZmlsbCgwKTtcbiAgfVxuXG4gIGdldENoYXJBZGRyQklPUygpXG4gIHtcbiAgICByZXR1cm4gQklPU19DSEFSX0JBU0VfQUREUjtcbiAgfVxuXG4gIGdldENoYXJTaXplQklPUygpXG4gIHtcbiAgICByZXR1cm4gQklPU19DSEFSX1NJWkU7XG4gIH1cblxuICAvLyBEZWNpZGVkIHRvIHdyaXRlIHRoZSBrZXlib2FyZCBidWZmZXIgaW50byBzeXN0ZW0gUkFNXG4gIC8vIGluc3RlYWQgb2YgcGFzc2luZyBhbiBhZGRpdGlvbmFsIElucHV0KCkgb2JqZWN0IHRvIHRoZSBDUFUoKSBjbGFzc1xuICAvLyBUaGlzIGlzIHByb2JhYmx5IG1vcmUgbGlrZSBhbiBlbWJlZGRlZCBzeXN0ZW0gd291bGQgd29ya1xuICBnZXRLZXlib2FyZEJ1ZmZlckFkZHJlc3MoKVxuICB7XG4gICAgcmV0dXJuIEJJT1NfS0VZQl9CQVNFX0FERFI7XG4gIH1cblxuICByZWFkQnl0ZShhZGRyKVxuICB7XG4gICAgdGhpcy5fdmFsaWRhdGVfYWRkcmVzcyhhZGRyKTtcbiAgICByZXR1cm4gdGhpcy5kYXRhW2FkZHJdO1xuICB9XG5cbiAgcmVhZFdvcmQoYWRkcilcbiAge1xuICAgIHRoaXMuX3ZhbGlkYXRlX2FkZHJlc3MoYWRkcik7XG4gICAgcmV0dXJuICgodGhpcy5kYXRhW2FkZHJdICYgMHhmZikgPDwgOCkgfCAodGhpcy5kYXRhW2FkZHIrMV0gJiAweGZmKTsgLy8gVE9ETzogKzEgPT0gZ3BmID9cbiAgfVxuXG4gIHdyaXRlQnl0ZShhZGRyLCBkYXRhKVxuICB7XG4gICAgdGhpcy5fdmFsaWRhdGVfYWRkcmVzcyhhZGRyKTtcbiAgICB0aGlzLmRhdGFbYWRkcl0gPSBkYXRhO1xuICB9XG5cbiAgd3JpdGVXb3JkKGFkZHIsIGRhdGEpXG4gIHtcbiAgICB0aGlzLl92YWxpZGF0ZV9hZGRyZXNzKGFkZHIpO1xuICAgIHRoaXMuZGF0YVthZGRyXSA9ICgoZGF0YSA+PiA4KSAmIDB4ZmYpO1xuICAgIHRoaXMuZGF0YVthZGRyKzFdID0gKGRhdGEgJiAweGZmKTtcbiAgfVxuXG4gIGJsaXQodHlwZWRBcnJheSwgdG9BZGRyKVxuICB7XG4gICAgLy8gQnlwYXNzIGFkZHJlc3MgdmFsaWRhdGlvbiBoZXJlIHNvIHdlIGNhbiBibGl0IHRoZSBiaW9zIGludG8gcGxhY2VcbiAgICB0aGlzLmRhdGEuc2V0KHR5cGVkQXJyYXksIHRvQWRkcik7XG4gIH1cblxuICBfdmFsaWRhdGVfYWRkcmVzcyhhZGRyKVxuICB7XG4gICAgaWYgKGFkZHIgPCAweDIwMClcbiAgICB7XG4gICAgICB0aGlzLmVtaXQoJ2dwZicsIHtlcnJvcjogYElsbGVnYWwgYWRkcmVzczogMHgke2FkZHIudG9TdHJpbmcoMTYpfWB9KTtcbiAgICB9XG5cbiAgICBpZiAoYWRkciA+PSAweDEwMDApXG4gICAge1xuICAgICAgdGhpcy5lbWl0KCdncGYnLCB7ZXJyb3I6IGBJbGxlZ2FsIGFkZHJlc3M6IDB4JHthZGRyLnRvU3RyaW5nKDE2KX1gfSk7XG4gICAgfVxuICB9XG5cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3N5c3RlbS9yYW0uanMiLCJcbmltcG9ydCBCYXNlICAgZnJvbSAnLi4vdXRpbC9iYXNlJztcbmltcG9ydCBsb2cgICAgZnJvbSAnbG9nbGV2ZWwnO1xuXG5jb25zdCBXSURUSCA9IDY0LCBIRUlHSFQgPSAzMjtcbmNvbnN0IFNQUklURV9XSURUSCA9IDg7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdGWCBleHRlbmRzIEJhc2VcbntcbiAgY29uc3RydWN0b3IocmFtKVxuICB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9kaXNwbGF5ID0gbmV3IEFycmF5QnVmZmVyIChXSURUSCAqIEhFSUdIVCk7XG4gICAgdGhpcy5kaXNwbGF5ID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5fZGlzcGxheSk7XG4gICAgdGhpcy5yYW0gPSByYW07XG5cbiAgfVxuXG4gIHNpemUoKVxuICB7XG4gICAgcmV0dXJuIHt3aWR0aDogV0lEVEgsIGhlaWdodDogSEVJR0hUfTtcbiAgfVxuXG4gIGRyYXcoaSwgc3gsIHN5LCBoZWlnaHQpXG4gIHtcbiAgICBsZXQgbyA9IChzeSAqIFdJRFRIKSArIHN4OyAgICAvLyBhZGRyZXNzIG9mIGRpc3BsYXkgY29vcmRzXG4gICAgbGV0IGQgPSAoV0lEVEggLSBTUFJJVEVfV0lEVEgpOyAvLyBvZmZzZXQgZGVsdGEgaW5jcmVtZW50XG4gICAgbGV0IHMgPSBpOyAgICAgICAgICAgICAgICAgICAgLy8gYWRkcmVzcyBvZiBzcHJpdGUgaW4gUkFNXG4gICAgbGV0IGNvbGxpc2lvbiA9IDA7XG5cbiAgICAvL2NvbnNvbGUubG9nKGBEcmF3aW5nIHNwcml0ZSBhdCAke3N4fSwgJHtzeX0sIG9mZnNldCA9ICR7b31gKTtcblxuICAgIGZvciAobGV0IHk9MDsgeTxoZWlnaHQ7IHkrKylcbiAgICB7XG4gICAgICBsZXQgYml0X3JvdyA9IHRoaXMucmFtW3MrK107XG4gICAgICBsZXQgcGl4ZWwsIHhvcl9waXhlbDtcbiAgICAgIGZvciAobGV0IHg9U1BSSVRFX1dJRFRILTE7IHg+PTA7IHgtLSlcbiAgICAgIHtcbiAgICAgICAgcGl4ZWwgPSAoKGJpdF9yb3cgPj4geCkgJiAweDEpOyAgICAvL1RPRE86ICpNVVNUKiBiZSBhIHNtYXJ0ZXIgd2F5IHRvIHdyaXRlIHRoaXMhIVxuICAgICAgICB4b3JfcGl4ZWwgPSB0aGlzLmRpc3BsYXlbb10gXiBwaXhlbDtcbiAgICAgICAgdGhpcy5kaXNwbGF5W28rK10gPSB4b3JfcGl4ZWw7XG4gICAgICAgIGlmICgoeG9yX3BpeGVsIT1waXhlbCkgJiYgeG9yX3BpeGVsID09IDApIGNvbGxpc2lvbiA9IDE7XG4gICAgICB9XG4gICAgICBvICs9IGQ7XG4gICAgfVxuXG4gICAgLy8gYmVsb3csIGRlYnVnLCB3cml0ZSBvdXQgY29udGVudHMgb2YgZGlzcGxheSB0byBjb25zb2xlIGluIGEgd2lkICogaGVpIGdyaWRcbiAgICAvLyBmb3IgKHZhciB5PTA7IHk8SEVJR0hUOyB5KyspXG4gICAgLy8ge1xuICAgIC8vICAgdmFyIHN0ID0gXCJcIjtcbiAgICAvLyAgIGlmICh5IDwgMTApIHN0ICs9IFwieSAwXCIreStcIjpcIjsgZWxzZSBzdCs9IFwieSBcIit5K1wiOlwiO1xuICAgIC8vICAgZm9yICh2YXIgeD0wOyB4PFdJRFRIOyB4KyspXG4gICAgLy8gICB7XG4gICAgLy8gICAgICAgc3QgKz0gdGhpcy5kaXNwbGF5Wyh5ICogV0lEVEgpK3hdID8gXCIxXCIgOiBcIjBcIlxuICAgIC8vICAgfVxuICAgIC8vICAgY29uc29sZS5sb2coc3QpO1xuICAgIC8vIH1cblxuICAgIHRoaXMuZmlyZSgnY2hhbmdlZCcpO1xuICAgIGlmIChjb2xsaXNpb24gPT0xICkgbG9nLmluZm8oXCIqKiogQ29sbGlzaW9uISAqKipcIik7XG4gICAgcmV0dXJuIGNvbGxpc2lvbjtcbiAgfVxuXG4gIC8vIF9zZXRfcGl4ZWwoeCwgeSwgdilcbiAgLy8ge1xuICAvLyAgIGxldCBvZmZzID0gKHkqV0lEVEgpK3g7XG4gIC8vICAgdGhpcy5kaXNwbGF5W29mZnNdID0gdjtcbiAgLy8gfVxuXG4gIGNsZWFyKClcbiAge1xuICAgIHRoaXMuZGlzcGxheS5maWxsKDApO1xuICAgIHRoaXMuZmlyZSgnY2hhbmdlZCcpO1xuICB9XG5cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3N5c3RlbS9nZnguanMiLCJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpc2Fzc2VtYmxlclxue1xuICBjb25zdHJ1Y3RvcigpXG4gIHtcbiAgfVxuXG4gIGRlY29kZShpbnN0cilcbiAge1xuICAgIGxldCBsaXN0ID0gQXJyYXkuaXNBcnJheShpbnN0cikgPyBpbnN0ciA6IFtpbnN0cl07XG4gICAgbGV0IG91dCA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSBvZiBsaXN0KVxuICAgIHtcbiAgICAgIGxldCBkID0gdGhpcy5fZGVjb2RlX3NpbmdsZShpKTtcbiAgICAgIGQuaSA9IGAweCR7aGV4KGkpfWA7XG4gICAgICBvdXQucHVzaChkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0Lmxlbmd0aCA9PSAxID8gb3V0WzBdIDogb3V0O1xuICB9XG5cbiAgZXhwbG9kZShpbnN0cl9kYXRhLCBmcm9tX2luc3RyLCBzaXplKVxuICB7XG4gICAgbGV0IHRvX2RlY29kZSA9IFtdO1xuICAgIGZvciAobGV0IHQ9ZnJvbV9pbnN0ci0oc2l6ZSoyKTsgdDw9ZnJvbV9pbnN0cisoc2l6ZSoyKTsgdCs9MilcbiAgICB7XG4gICAgICB0b19kZWNvZGUucHVzaChpbnN0cl9kYXRhLnJlYWRXb3JkKHQpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZGVjb2RlKHRvX2RlY29kZSk7XG4gIH1cblxuICBfZGVjb2RlX3NpbmdsZShpbnN0cilcbiAge1xuICAgICAgbGV0IG1ham9yID0gKGluc3RyID4+IDEyKSAmIDB4ZjtcbiAgICAgIGxldCBtaW5vciA9IGluc3RyICYgMHhmZmY7XG5cbiAgICAgIC8vIGUuZy4gNVhZMDoganJxIHZ4LCB2eVxuICAgICAgbGV0IG1pbjAgPSAobWlub3IgPj4gOCkgJiAweGY7ICAvLyBYXG4gICAgICBsZXQgbWluMSA9IChtaW5vciA+PiA0KSAmIDB4ZjsgIC8vIFlcbiAgICAgIGxldCBtaW4yID0gbWlub3IgJiAweGY7ICAgICAgICAgLy8gMFxuICAgICAgbGV0IG1pbjEyID0gbWlub3IgJiAweGZmOyAgICAgICAvLyBZMFxuXG4gICAgICBzd2l0Y2gobWFqb3IpXG4gICAgICB7XG4gICAgICAgIGNhc2UgMHgwOlxuICAgICAgICAgIHN3aXRjaChtaW5vcilcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjYXNlIDB4ZTA6IHJldHVybiB7bTogXCJjbHNcIiwgZDpcIkNsZWFyIHNjcmVlblwifTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDB4ZWU6IHJldHVybiB7bTogXCJyZXRcIiwgZDpcIlJldHVybiBmcm9tIHN1YnJvdXRpbmUgW3N0YWNrXVwifTsgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4ge206IGBzeXMgJHttaW5vci50b1N0cmluZygxNil9YCwgZDpcIkp1bXAgdG8gcm91dGluZSBhdCBhZGRyZXNzIFtsZWdhY3k7IGlnbm9yZWQgYnkgaW50ZXJwcmV0ZXJdXCJ9O2JyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweDE6IHJldHVybiB7bTogYGptcCAweCR7aGV4KG1pbm9yKX1gLCBkOlwiSnVtcCB0byBhZGRyZXNzXCJ9OyAgICAgICAgICAgICAvLyAxbm5uXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHgyOiByZXR1cm4ge206IGBjYWxsIDB4JHtoZXgobWlub3IpfWAsIGQ6XCJDYWxsIHN1YnJvdXRpbmUgW3N0YWNrXVwifTsgICAgICAgICAgICAvLyAybm5uXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHgzOiByZXR1cm4ge206IGBqZXEgdiR7aGV4KG1pbjApfSwgJHttaW4xMn1gLCBkOlwiSnVtcCBvdmVyIG5leHQgaW5zdHJ1Y3Rpb24gaWYgb3BlcmFuZHMgZXF1YWxcIn07ICAgLy8gM3hublxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4NDogcmV0dXJuIHttOiBgam5xIHYke2hleChtaW4wKX0sICR7bWluMTJ9YCwgZDpcIkp1bXAgb3ZlciBuZXh0IGluc3RydWN0aW9uIGlmIG9wZXJhbmRzIG5vdCBlcXVhbFwifTsgICAvLyA0eG5uXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHg1OiByZXR1cm4ge206IGBqcmUgdiR7aGV4KG1pbjApfSwgdiR7aGV4KG1pbjEpfWAsIGQ6XCJKdW1wIG92ZXIgbmV4dCBpbnN0cnVjdGlvbiBpZiByZWdpc3RlcnMgZXF1YWxcIn07Ly8gNXh5MFxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4NjogcmV0dXJuIHttOiBgbW92IHYke2hleChtaW4wKX0sICR7bWluMTJ9YCwgZDpcIk1vdmUgY29uc3RhbnQgaW50byByZWdpc3RlclwifTs7ICAgLy8gNnhublxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4NzogcmV0dXJuIHttOiBgYWRkIHYke2hleChtaW4wKX0sICR7bWluMTJ9YCwgZDpcIkFkZCBjb25zdGFudCB0byByZWdpc3RlclwifTs7ICAgLy8gN3hublxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4ODpcbiAgICAgICAgICBzd2l0Y2ggKG1pbjIpXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2FzZSAweDA6IHJldHVybiB7bTogYG1vdiB2JHtoZXgobWluMCl9LCB2JHtoZXgobWluMSl9YCwgZDogXCJNb3ZlIHJlZ2lzdGVyIGludG8gcmVnaXN0ZXJcIn07IGJyZWFrOyAgIC8vIDh4eTBcbiAgICAgICAgICAgIGNhc2UgMHgxOiByZXR1cm4ge206IGBvciB2JHtoZXgobWluMCl9LCB2JHtoZXgobWluMSl9YCwgZDogXCJPUiByZWdpc3RlciB3aXRoIHJlZ2lzdGVyXCJ9OyBicmVhazsgICAgLy8gOHh5MVxuICAgICAgICAgICAgY2FzZSAweDI6IHJldHVybiB7bTogYGFuZCB2JHtoZXgobWluMCl9LCB2JHtoZXgobWluMSl9YCwgZDogXCJBTkQgcmVnaXN0ZXIgd2l0aCByZWdpc3RlclwifTsgYnJlYWs7ICAgLy8gOHh5MlxuICAgICAgICAgICAgY2FzZSAweDM6IHJldHVybiB7bTogYHhvciB2JHtoZXgobWluMCl9LCB2JHtoZXgobWluMSl9YCwgZDogXCJYT1IgcmVnaXN0ZXIgd2l0aCByZWdpc3RlclwifTsgYnJlYWs7ICAgLy8gOHh5MlxuICAgICAgICAgICAgY2FzZSAweDQ6IHJldHVybiB7bTogYGFkZCB2JHtoZXgobWluMCl9LCB2JHtoZXgobWluMSl9YCwgZDogXCJBZGQgcmVnaXN0ZXIgdG8gcmVnaXN0ZXJcIn07IGJyZWFrOyAgIC8vIDh4eTRcbiAgICAgICAgICAgIGNhc2UgMHg1OiByZXR1cm4ge206IGBzdWIgdiR7aGV4KG1pbjApfSwgdiR7aGV4KG1pbjEpfWAsIGQ6IFwiU3VidHJhY3QgcmVnaXN0ZXIgZnJvbSByZWdpc3RlclwifTsgYnJlYWs7ICAgLy8gOHh5NVxuICAgICAgICAgICAgY2FzZSAweDY6IHJldHVybiB7bTogYHNociB2JHtoZXgobWluMCl9YCwgZDogXCJTaGlmdCByaWdodCByZWdpc3RlclwifTsgYnJlYWs7ICAgICAgICAgICAgICAgICAgLy8gOHgwNlxuICAgICAgICAgICAgY2FzZSAweDc6IHJldHVybiB7bTogYHJzYiB2JHtoZXgobWluMCl9LCB2JHtoZXgobWluMSl9YCwgZDogXCJSZXZlcnNlIHN1YnRyYWN0IHJlZ2lzdGVyIGZyb20gcmVnaXN0ZXJcIn07IGJyZWFrOyAgIC8vIDh4eTdcbiAgICAgICAgICAgIGNhc2UgMHhlOiByZXR1cm4ge206IGBzaGwgdiR7aGV4KG1pbjApfWAsIGQ6IFwiU2hpZnQgbGVmdCByZWdpc3RlclwifTsgYnJlYWs7ICAgICAgICAgICAgICAgICAgLy8gOHgwZVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweDk6IHJldHVybiB7bTogYGpybiB2JHtoZXgobWluMCl9LCB2JHtoZXgobWluMSl9YCwgZDogXCJKdW1wIG92ZXIgbmV4dCBpbnN0cnVjdGlvbiBpZiByZWdpc3RlciBub3QgZXF1YWxcIn07ICAgICAgICAgICAgIC8vIDl4eTBcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweEE6IHJldHVybiB7bTogYG1vdiBpLCAke21pbm9yfWAsIGQ6XCJNb3ZlIGNvbnN0YW50IGludG8gSW5kZXggcmVnaXN0ZXJcIn07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHhCOiByZXR1cm4ge206IGBqcmwgMHgke2hleChtaW5vcil9YCwgZDpcIkp1bXAgdG8gYWRkcmVzcyBnaXZlbiBieSBjb25zdGFudCArIHYwIHJlZ2lzdGVyXCJ9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHhDOiByZXR1cm4ge206IGBybmQgdiR7aGV4KG1pbjApfSwgMHgke2hleChtaW4xMil9YCwgZDpcIlJhbmRvbSBudW1iZXIgQU5EIHdpdGggY29uc3RhbnQgaW50byByZWdpc3RlclwifVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4RDogcmV0dXJuIHttOiBgZHJ3IHYke2hleChtaW4wKX0sIHYke2hleChtaW4xKX0sICR7KG1pbjIpfWAsIGQ6XCJEcmF3IHNwcml0ZSBhdCByZWdpc3RlcnMgbG9jYXRpb24gb2Ygc2l6ZSBjb25zdGFudFwifVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4RTpcbiAgICAgICAgICBzd2l0Y2gobWluMTIpXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2FzZSAweDlFOiByZXR1cm4ge206IGBqa3AgdiR7aGV4KG1pbjApfWAsIGQ6XCJKdW1wIGlmIGtleSBjb2RlIGluIHJlZ2lzdGVyIHByZXNzZWRcIn1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDB4QTE6IHJldHVybiB7bTogYGprbiB2JHtoZXgobWluMCl9YCwgZDpcIkp1bXAgaWYga2V5IGNvZGUgaW4gcmVnaXN0ZXIgbm90IHByZXNzZWRcIn1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4RjpcbiAgICAgICAgICBzd2l0Y2gobWluMTIpXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2FzZSAweDA3OiByZXR1cm4ge206IGBsZHQgdiR7aGV4KG1pbjApfWAsIGQ6XCJMb2FkIGRlbGF5IHRpbWVyIHZhbHVlIGludG8gcmVnaXN0ZXJcIn1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDB4MEE6IHJldHVybiB7bTogYHdhaXQgdiR7aGV4KG1pbjApfWAsIGQ6XCJXYWl0IGZvciBhIGtleSBwcmVzcywgc3RvcmUga2V5IGluIHJlZ2lzdGVyXCJ9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAweDE1OiByZXR1cm4ge206IGBzZHQgdiR7aGV4KG1pbjApfWAsIGQ6XCJTZXQgZGVsYXkgdGltZXIgZnJvbSByZWdpc3RlclwifVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMHgxODogcmV0dXJuIHttOiBgc3N0IHYke2hleChtaW4wKX1gLCBkOlwiU2V0IHNvdW5kIHRpbWVyIGZyb20gcmVnaXN0ZXJcIn1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDB4MUU6IHJldHVybiB7bTogYGFkaSB2JHtoZXgobWluMCl9YCwgZDpcIkFkZCByZWdpc3RlciB2YWx1ZSB0byBJbmRleCByZWdpc3RlclwifVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMHgyOTogcmV0dXJuIHttOiBgbGRpIHYke2hleChtaW4wKX1gLCBkOlwiTG9hZCBJbmRleCByZWdpc3RlciB3aXRoIHNwcml0ZSBhZGRyZXNzIG9mIGRpZ2l0IGluIHJlZ2lzdGVyXCJ9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAweDMzOiByZXR1cm4ge206IGBiY2QgdiR7aGV4KG1pbjApfWAsIGQ6XCJTdG9yZSBCQ0Qgb2YgcmVnaXN0ZXIgc3RhcnRpbmcgYXQgYmFzZSBhZGRyZXNzIEluZGV4XCJ9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAweDU1OiByZXR1cm4ge206IGBzdHIgdiR7aGV4KG1pbjApfWAsIGQ6XCJTdG9yZSByZWdpc3RlcnMgZnJvbSB2MCB0byByZWdpc3RlciBvcGVyYW5kIGF0IGJhc2UgYWRkcmVzcyBJbmRleFwifVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMHg2NTogcmV0dXJuIHttOiBgbGRyIHYke2hleChtaW4wKX1gLCBkOlwiU2V0IHJlZ2lzdGVycyBmcm9tIHYwIHRvIHJlZ2lzdGVyIG9wZXJhbmQgd2l0aCB2YWx1ZXMgZnJvbSBiYXNlIGFkZHJlc3MgSW5kZXhcIn1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgZGVmYXVsdDogcmV0dXJuIHttOmBVbmtub3duIG9wY29kZSAke2hleChpbnN0cil9YCwgZDpcIlVua25vd24vaWxsZWdhbCBpbnN0cnVjdGlvblwifTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGhleChuKSB7IHJldHVybiBuLnRvU3RyaW5nKDE2KTsgfVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3lzdGVtL2Rpc2FzbS5qcyJdLCJzb3VyY2VSb290IjoiIn0=