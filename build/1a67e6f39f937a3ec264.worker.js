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
	
	    _loglevel2.default.setLevel('error');
	
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
	      this.cycleTimer = setInterval(this.cycle.bind(this), 100);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMWE2N2U2ZjM5ZjkzN2EzZWMyNjQiLCJ3ZWJwYWNrOi8vLy4vY2hpcDgtd29ya2VyLmpzIiwid2VicGFjazovLy8uL3N5c3RlbS9jaGlwOC5qcyIsIndlYnBhY2s6Ly8vLi91dGlsL2Jhc2UuanMiLCJ3ZWJwYWNrOi8vLy4vdXRpbC9ldmVudC5qcyIsIndlYnBhY2s6Ly8vLi91dGlsL2xvYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9kb20vaW5wdXQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9sb2dsZXZlbC9saWIvbG9nbGV2ZWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3lzdGVtL2NwdS9jcHUuanMiLCJ3ZWJwYWNrOi8vLy4vc3lzdGVtL2NwdS9vcGNvZGVzLmpzIiwid2VicGFjazovLy8uL3N5c3RlbS9jcHUvb3Bjb2RlLTB4MC5qcyIsIndlYnBhY2s6Ly8vLi9zeXN0ZW0vY3B1L29wY29kZS0weDguanMiLCJ3ZWJwYWNrOi8vLy4vc3lzdGVtL2NwdS9vcGNvZGUtMHhFLmpzIiwid2VicGFjazovLy8uL3N5c3RlbS9jcHUvb3Bjb2RlLTB4Ri5qcyIsIndlYnBhY2s6Ly8vLi9zeXN0ZW0vdGltZXItZGVsYXkuanMiLCJ3ZWJwYWNrOi8vLy4vc3lzdGVtL3JhbS5qcyIsIndlYnBhY2s6Ly8vLi9zeXN0ZW0vZ2Z4LmpzIiwid2VicGFjazovLy8uL3N5c3RlbS9kaXNhc20uanMiXSwibmFtZXMiOlsiYyIsImxvYWQiLCJwb3dlcm9uIiwiQklPU19VUkwiLCJDaGlwOCIsInNldExldmVsIiwiZGlzYXNtIiwiY3ljbGVzIiwicmFtIiwiZ2Z4IiwiZGF0YSIsImNwdSIsImxvYWRlciIsImN5Y2xlVGltZXIiLCJfaW5pdEV2ZW50cyIsIl9yZXNldCIsIl9pbml0X2Jpb3MiLCJfZXhlY3V0aW5nIiwidCIsIm9wY29kZSIsImZldGNoIiwiZXhlY3V0ZSIsImRlY29kZSIsInNldEludGVydmFsIiwiY3ljbGUiLCJiaW5kIiwid2FybiIsImNsZWFySW50ZXJ2YWwiLCJfZHVtcCIsImQiLCJkZWJ1ZyIsInJlZyIsImlwIiwidG9TdHJpbmciLCJtIiwiaGFsdCIsInMiLCJ2IiwibGVuZ3RoIiwiaSIsInZmIiwidXJsIiwiY2FsbGJhY2siLCJpbmZvIiwidGl0bGUiLCJidWZmZXIiLCJfYmFzZTY0VG9BcnJheUJ1ZmZlciIsImJpbmFyeSIsImJsaXQiLCJiaW9zX2RhdGEiLCJieXRlcyIsImJpbiIsInNwbGl0IiwiX2RhdGEiLCJBcnJheUJ1ZmZlciIsIlVpbnQ4QXJyYXkiLCJwIiwiY2hhcmxpbmUiLCJwYXJzZUludCIsImdldENoYXJBZGRyQklPUyIsImJhc2U2NCIsImJpbmFyeV9zdHJpbmciLCJzZWxmIiwiYXRvYiIsImxlbiIsImNoYXJDb2RlQXQiLCJyZXNldCIsIm9uIiwiZW1pdCIsInBvc3RNZXNzYWdlIiwiYWN0aW9uIiwiYXJncyIsImVycm9yIiwidHJhY2UiLCJyZWdpc3RlcnMiLCJkdW1wX3JlZ2lzdGVycyIsImFkZHJlc3MiLCJmcmFtZUJ1ZmZlciIsImRpc3BsYXkiLCJvbm1lc3NhZ2UiLCJtZXNzYWdlSGFuZGxlciIsIm1zZyIsImtleVN0YXRlIiwiZ2V0S2V5Ym9hcmRCdWZmZXJBZGRyZXNzIiwicGF1c2VkdW1wIiwicmVzdW1lIiwiaGFsdGR1bXAiLCJzdGVwIiwiQmFzZSIsIkV2ZW50RW1pdHRlciIsImxpc3RlbmVycyIsIk1hcCIsImFkZExpc3RlbmVyIiwiZmlyZSIsImxhYmVsIiwiZm4iLCJoYXMiLCJzZXQiLCJnZXQiLCJwdXNoIiwib2JqIiwiaW5kZXgiLCJyZWR1Y2UiLCJsaXN0ZW5lciIsIl9pc0Z1bmN0aW9uIiwic3BsaWNlIiwiZm9yRWFjaCIsIkxvYWRlciIsInhtbGh0dHAiLCJYTUxIdHRwUmVxdWVzdCIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsInJlYWR5U3RhdGUiLCJzdGF0dXMiLCJqc29uIiwiSlNPTiIsInBhcnNlIiwicmVzcG9uc2VUZXh0Iiwib3BlbiIsInNlbmQiLCJJbnB1dCIsImtleURhdGEiLCJfY2FsbGJhY2siLCJrZXlNYXAiLCJfaW5pdCIsImtleSIsImsiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImNvZGUiLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJrZXlDb2RlIiwidG9Mb3dlckNhc2UiLCJfc2V0S2V5RG93biIsIl9zZXRLZXlVcCIsIldPUkRfU0laRSIsIklQX0lOSVQiLCJUUkFDRV9CVUZGRVJfU0laRSIsIl9WRiIsIkNQVSIsIl90aGlzIiwia2V5U3RhdGVBZGRyIiwiX3RyYWNlIiwiQXJyYXkiLCJfdHJhY2VfcHRyIiwiZGVsYXlUaW1lciIsIl9pcCIsIl9zcCIsInNwIiwic3RhY2siLCJleGVjIiwiciIsImZpbGwiLCJyZWFkV29yZCIsImluc3RyIiwibWFqb3IiLCJtaW5vciIsIl9hZGRfdG9fdHJhY2VfbG9vcCIsImNhbGwiLCJuZXh0IiwiYSIsInRyYWNlX3Vucm9sbGVkIiwicmV2ZXJzZSIsIl91bnJvbGxfdHJhY2VfbG9vcCIsIm9wY29kZXMiLCJ4Iiwicm5kIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiZHJhdyIsIk1BWF9JTlNUUiIsIiRfaW5zdHJfMHgwIiwiYWRkciIsInBvcCIsIiRfaW5zdHJfMHg4IiwidngiLCJ2eSIsInJ4IiwicnkiLCJyZXMiLCJ5IiwiJF9pbnN0cl8weEUiLCIkX2luc3RyXzB4RiIsInZhbCIsImdldENoYXJTaXplQklPUyIsIm14IiwiRlJFUVVFTkNZIiwiRGVsYXlUaW1lciIsImNvdW50ZXIiLCJfdGltZXJJZCIsInZhbHVlIiwiX3N0YXJ0IiwiX3N0b3AiLCJpbnRlcnZhbEZ1bmMiLCJCSU9TX0NIQVJfQkFTRV9BRERSIiwiQklPU19DSEFSX1NJWkUiLCJCSU9TX05VTV9DSEFSUyIsIkJJT1NfS0VZQl9CQVNFX0FERFIiLCJSQU0iLCJfdmFsaWRhdGVfYWRkcmVzcyIsInR5cGVkQXJyYXkiLCJ0b0FkZHIiLCJXSURUSCIsIkhFSUdIVCIsIlNQUklURV9XSURUSCIsIkdGWCIsIl9kaXNwbGF5Iiwid2lkdGgiLCJoZWlnaHQiLCJzeCIsInN5IiwibyIsImNvbGxpc2lvbiIsImJpdF9yb3ciLCJwaXhlbCIsInhvcl9waXhlbCIsIkRpc2Fzc2VtYmxlciIsImxpc3QiLCJpc0FycmF5Iiwib3V0IiwiX2RlY29kZV9zaW5nbGUiLCJoZXgiLCJpbnN0cl9kYXRhIiwiZnJvbV9pbnN0ciIsInNpemUiLCJ0b19kZWNvZGUiLCJtaW4wIiwibWluMSIsIm1pbjIiLCJtaW4xMiIsIm4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUN0Q0E7Ozs7OztBQUVBLEtBQUlBLElBQUksb0JBQVI7O0FBRUFBLEdBQUVDLElBQUYsQ0FBTyxvQkFBUCxFQUE2QixZQUFNO0FBQUs7QUFDcENELE9BQUVFLE9BQUYsR0FEK0IsQ0FDSztBQUN2QyxFQUZELEU7Ozs7Ozs7Ozs7Ozs7O0FDSEE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7Ozs7Ozs7Ozs7O0FBRUEsS0FBTUMsV0FBWSxhQUFsQjs7S0FFcUJDLEs7OztBQUVuQixvQkFDQTtBQUFBOztBQUFBOztBQUVFLHdCQUFJQyxRQUFKLENBQWEsT0FBYjs7QUFFQSxXQUFLQyxNQUFMLEdBQWMsc0JBQWQ7O0FBRUEsV0FBS0MsTUFBTCxHQUFjLENBQWQ7O0FBRUEsV0FBS0MsR0FBTCxHQUFXLG1CQUFYO0FBQ0EsV0FBS0MsR0FBTCxHQUFXLGtCQUFRLE1BQUtELEdBQUwsQ0FBU0UsSUFBakIsQ0FBWDtBQUNBLFdBQUtDLEdBQUwsR0FBVyxrQkFBUSxNQUFLRixHQUFiLEVBQWtCLE1BQUtELEdBQXZCLENBQVg7O0FBRUEsV0FBS0ksTUFBTCxHQUFjLHNCQUFk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dk0sR0FBRSw4REFBM0IsRUFBUDtBQUNUO0FBQ0Ysa0JBQUssSUFBTDtBQUFXLHNCQUFPLEVBQUNLLGFBQVc2TCxJQUFJSyxJQUFKLENBQVosRUFBeUJ2TSxHQUFFLHNEQUEzQixFQUFQO0FBQ1Q7QUFDRixrQkFBSyxJQUFMO0FBQVcsc0JBQU8sRUFBQ0ssYUFBVzZMLElBQUlLLElBQUosQ0FBWixFQUF5QnZNLEdBQUUsbUVBQTNCLEVBQVA7QUFDVDtBQUNGLGtCQUFLLElBQUw7QUFBVyxzQkFBTyxFQUFDSyxhQUFXNkwsSUFBSUssSUFBSixDQUFaLEVBQXlCdk0sR0FBRSwrRUFBM0IsRUFBUDtBQUNUO0FBbkJKO0FBcUJBOztBQUVBO0FBQVMsa0JBQU8sRUFBQ0ssdUJBQW9CNkwsSUFBSXBFLEtBQUosQ0FBckIsRUFBbUM5SCxHQUFFLDZCQUFyQyxFQUFQO0FBQ1A7QUFsRk47QUFvRkg7Ozs7OzttQkE5SGtCNkwsWTs7O0FBaUlyQixVQUFTSyxHQUFULENBQWFTLENBQWIsRUFBZ0I7QUFBRSxVQUFPQSxFQUFFdk0sUUFBRixDQUFXLEVBQVgsQ0FBUDtBQUF3QixFIiwiZmlsZSI6IjFhNjdlNmYzOWY5MzdhM2VjMjY0Lndvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDFhNjdlNmYzOWY5MzdhM2VjMjY0IiwiaW1wb3J0IENoaXA4IGZyb20gJy4vc3lzdGVtL2NoaXA4JztcblxubGV0IGMgPSBuZXcgQ2hpcDgoKTtcblxuYy5sb2FkKCdyb20tanNvbi9wb25nLmpzb24nLCAoKSA9PiB7ICAgIC8vIGluc2VydCB0aGUgY2FydHJpZGdlLi4uXG4gICAgYy5wb3dlcm9uKCk7ICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3dpdGNoIGl0IG9uIDopXG59KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2NoaXA4LXdvcmtlci5qcyIsIlxuaW1wb3J0IEJhc2UgICAgICAgICAgICAgICBmcm9tICcuLi91dGlsL2Jhc2UnO1xuaW1wb3J0IExvYWRlciAgICAgICAgICAgICBmcm9tICcuLi91dGlsL2xvYWRlcic7XG5pbXBvcnQgSW5wdXQgICAgICAgICAgICAgIGZyb20gJy4uL2RvbS9pbnB1dCc7XG5pbXBvcnQgQ1BVICAgICAgICAgICAgICAgIGZyb20gJy4vY3B1L2NwdSc7XG5pbXBvcnQgUkFNICAgICAgICAgICAgICAgIGZyb20gJy4vcmFtJztcbmltcG9ydCBHRlggICAgICAgICAgICAgICAgZnJvbSAnLi9nZngnO1xuaW1wb3J0IGxvZyAgICAgICAgICAgICAgICBmcm9tICdsb2dsZXZlbCc7XG5cbmltcG9ydCBEaXNhc3NlbWJsZXIgICAgICAgZnJvbSAnLi9kaXNhc20nO1xuXG5jb25zdCBCSU9TX1VSTCAgPSBcIi4vYmlvcy5qc29uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoaXA4IGV4dGVuZHMgQmFzZVxue1xuICBjb25zdHJ1Y3RvcigpXG4gIHtcbiAgICBzdXBlcigpO1xuICAgIGxvZy5zZXRMZXZlbCgnZXJyb3InKTtcblxuICAgIHRoaXMuZGlzYXNtID0gbmV3IERpc2Fzc2VtYmxlcigpO1xuXG4gICAgdGhpcy5jeWNsZXMgPSAxO1xuXG4gICAgdGhpcy5yYW0gPSBuZXcgUkFNKCk7XG4gICAgdGhpcy5nZnggPSBuZXcgR0ZYKHRoaXMucmFtLmRhdGEpO1xuICAgIHRoaXMuY3B1ID0gbmV3IENQVSh0aGlzLmdmeCwgdGhpcy5yYW0pO1xuXG4gICAgdGhpcy5sb2FkZXIgPSBuZXcgTG9hZGVyKCk7XG4gICAgdGhpcy5jeWNsZVRpbWVyID0gbnVsbDtcblxuICAgIHRoaXMuX2luaXRFdmVudHMoKTtcbiAgICB0aGlzLl9yZXNldCgpO1xuICAgIHRoaXMuX2luaXRfYmlvcygpO1xuICAgIHRoaXMuX2V4ZWN1dGluZyA9IGZhbHNlO1xuICB9XG5cbiAgY3ljbGUoKVxuICB7XG4gICAgLy9jb25zb2xlLmxvZyhcImN5Y2xlXCIpOyByZXR1cm47XG4gICAgZm9yIChsZXQgdD0wOyB0PHRoaXMuY3ljbGVzOyB0KyspXG4gICAge1xuICAgICAgaWYgKCF0aGlzLl9leGVjdXRpbmcpIHJldHVybjtcbiAgICAgIGxldCBvcGNvZGUgPSB0aGlzLmNwdS5mZXRjaCgpO1xuICAgICAgLy9sZXQgZCA9IHRoaXMuZGlzYXNtLmRlY29kZShvcGNvZGUpO1xuICAgIC8vICBsb2cuZGVidWcoYFske3RoaXMuY3B1LnJlZy5pcC50b1N0cmluZygxNil9XSAke2QubX1cXHRcXHQke2QuZH1gKTtcbiAgICAgIHRoaXMuY3B1LmV4ZWN1dGUoXG4gICAgICAgIHRoaXMuY3B1LmRlY29kZShcbiAgICAgICAgICBvcGNvZGVcbiAgICAgICAgKVxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIHBvd2Vyb24oKVxuICB7XG4gICAgdGhpcy5fZXhlY3V0aW5nID0gdHJ1ZTtcbiAgICB0aGlzLmN5Y2xlVGltZXIgPSBzZXRJbnRlcnZhbCgodGhpcy5jeWNsZSkuYmluZCh0aGlzKSwgMTAwKTtcbiAgfVxuXG4gIGhhbHQoKVxuICB7XG4gICAgbG9nLndhcm4oXCJIYWx0aW5nIGV4ZWN1dGlvbi4uLlwiKTtcbiAgICB0aGlzLl9leGVjdXRpbmcgPSBmYWxzZTtcbiAgICBjbGVhckludGVydmFsKHRoaXMuY3ljbGVUaW1lcik7XG4gIH1cblxuICBwYXVzZWR1bXAoKVxuICB7XG4gICAgdGhpcy5fZXhlY3V0aW5nID0gZmFsc2U7XG4gICAgdGhpcy5fZHVtcCgpO1xuICB9XG5cbiAgc3RlcCgpXG4gIHtcbiAgICB0aGlzLl9leGVjdXRpbmcgPSBmYWxzZTtcblxuICAgIGxldCBvcGNvZGUgPSB0aGlzLmNwdS5mZXRjaCgpO1xuICAgIGxldCBkID0gdGhpcy5kaXNhc20uZGVjb2RlKG9wY29kZSk7XG4gICAgbG9nLmRlYnVnKGBbJHt0aGlzLmNwdS5yZWcuaXAudG9TdHJpbmcoMTYpfV0gJHtkLm19XFx0XFx0JHtkLmR9YCk7XG4gICAgdGhpcy5jcHUuZXhlY3V0ZShcbiAgICAgIHRoaXMuY3B1LmRlY29kZShcbiAgICAgICAgb3Bjb2RlXG4gICAgICApXG4gICAgKVxuXG4gICAgdGhpcy5fZHVtcCgpO1xuICB9XG5cbiAgcmVzdW1lKClcbiAge1xuICAgIHRoaXMuX2V4ZWN1dGluZyA9IHRydWU7XG4gIH1cblxuICBoYWx0ZHVtcCgpXG4gIHtcbiAgICB0aGlzLmhhbHQoKTtcbiAgICB0aGlzLl9kdW1wKCk7XG4gIH1cblxuICBfZHVtcCgpXG4gIHtcbiAgICBsZXQgcyA9ICcnO1xuXG4gICAgZm9yIChsZXQgdD0wLHt2fT10aGlzLmNwdS5yZWc7IHQ8di5sZW5ndGg7IHQrKylcbiAgICB7XG4gICAgICBzICs9IGB2JHt0LnRvU3RyaW5nKDE2KX09JHt2W3RdfWA7XG4gICAgICBzICs9IHQ8di5sZW5ndGgtMSA/ICcsICcgOiAnJztcbiAgICB9XG5cbiAgICBsb2cud2FybihzKTtcbiAgICBsb2cud2FybihgaT0ke3RoaXMuY3B1LnJlZy5pfSwgdmY9JHt0aGlzLmNwdS5yZWcudmZ9LCBpcD0weCR7dGhpcy5jcHUucmVnLmlwLnRvU3RyaW5nKDE2KX1gKTtcbiAgfVxuXG4gIGxvYWQodXJsLCBjYWxsYmFjaylcbiAge1xuICAgIGxvZy5kZWJ1ZyhgRmV0Y2hpbmc6ICcke3VybH0nYCk7XG5cbiAgICB0aGlzLmxvYWRlci5sb2FkKHVybCwgKGRhdGEpID0+IHtcbiAgICAgIGxvZy5pbmZvKGBPcGVuaW5nIHRpdGxlICcke2RhdGEudGl0bGV9J2ApO1xuXG4gICAgICBsZXQgYnVmZmVyID0gdGhpcy5fYmFzZTY0VG9BcnJheUJ1ZmZlcihkYXRhLmJpbmFyeSk7XG4gICAgICB0aGlzLnJhbS5ibGl0KGJ1ZmZlciwgNTEyKTtcblxuICAgICAgY2FsbGJhY2soKTtcblxuICAgIH0pO1xuICB9XG5cbiAgX2luaXRfYmlvcygpXG4gIHtcbiAgICAvLyBMb2FkIHRoZSBcIkJJT1NcIiBjaGFyYWN0ZXJzIGludG8gdGhlIHByb3RlY3RlZCBhcmVhXG5cbiAgICB0aGlzLmxvYWRlci5sb2FkKEJJT1NfVVJMLCAoYmlvc19kYXRhKSA9PiB7XG5cbiAgICAgIGxldCBieXRlcyA9IGJpb3NfZGF0YS5iaW4uc3BsaXQoJywnKTtcbiAgICAgIGxldCBfZGF0YSA9IG5ldyBBcnJheUJ1ZmZlcihieXRlcy5sZW5ndGgpO1xuICAgICAgbGV0IGRhdGEgPSBuZXcgVWludDhBcnJheShfZGF0YSk7XG4gICAgICBsZXQgcCA9IDA7XG5cbiAgICAgIGZvciAobGV0IGNoYXJsaW5lIG9mIGJ5dGVzKVxuICAgICAgICBkYXRhW3ArK10gPSAocGFyc2VJbnQoXCIweFwiK2NoYXJsaW5lLCAxNikgJiAweGZmKTtcblxuICAgICAgdGhpcy5yYW0uYmxpdChkYXRhLCB0aGlzLnJhbS5nZXRDaGFyQWRkckJJT1MoKSk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIF9iYXNlNjRUb0FycmF5QnVmZmVyKGJhc2U2NClcbiAge1xuICAgIHZhciBiaW5hcnlfc3RyaW5nID0gIHNlbGYuYXRvYihiYXNlNjQpO1xuICAgIHZhciBsZW4gPSBiaW5hcnlfc3RyaW5nLmxlbmd0aDtcblxuICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KCBsZW4gKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgICBieXRlc1tpXSA9IGJpbmFyeV9zdHJpbmcuY2hhckNvZGVBdChpKTtcblxuICAgIHJldHVybiBieXRlcztcbiAgfVxuXG4gIF9yZXNldCgpXG4gIHtcbiAgICB0aGlzLmNwdS5yZXNldCgpO1xuICAgIHRoaXMucmFtLnJlc2V0KCk7XG4gIH1cblxuICBfaW5pdEV2ZW50cygpXG4gIHtcbiAgICB0aGlzLnJhbS5vbignZ3BmJywgKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBkYXRhKTtcbiAgICB9KS5iaW5kKHRoaXMpKTsgLy8gT3ZlcnJpZGUgJ3RoaXMnIHRvIHVzZSBDaGlwOCgpIGNvbnRleHQgaW5zdGVhZCBvZiBSQU0oKSdzXG5cbiAgICB0aGlzLmNwdS5vbignZGVidWcnLCAoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgdGhpcy5fZXhlY3V0aW5nID0gZmFsc2U7XG4gICAgfSkuYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLmNwdS5vbignb3Bjb2RlJywgKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHRoaXMuaGFsdCgpO1xuICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7XG4gICAgICAgIGFjdGlvbjogJ2Vycm9yJyxcbiAgICAgICAgYXJnczp7XG4gICAgICAgICAgZXJyb3I6IGRhdGEuZXJyb3IsXG4gICAgICAgICAgdHJhY2U6IHRoaXMuY3B1LnRyYWNlKCksXG4gICAgICAgICAgcmVnaXN0ZXJzOiB0aGlzLmNwdS5kdW1wX3JlZ2lzdGVycygpLFxuICAgICAgICAgIGFkZHJlc3M6IHRoaXMuY3B1LnJlZy5pcFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KS5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMuZ2Z4Lm9uKCdjaGFuZ2VkJywgKGZ1bmN0aW9uKCkge1xuICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICBhY3Rpb246ICdyZW5kZXInLFxuICAgICAgICAgIGFyZ3M6IHtcbiAgICAgICAgICAgIGZyYW1lQnVmZmVyOiB0aGlzLmdmeC5kaXNwbGF5XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KS5iaW5kKHRoaXMpKTtcblxuICAgIHNlbGYub25tZXNzYWdlID0gKHRoaXMubWVzc2FnZUhhbmRsZXIpLmJpbmQodGhpcyk7XG4gIH1cblxuICBtZXNzYWdlSGFuZGxlcihtc2cpXG4gIHtcbiAgICBzd2l0Y2gobXNnLmRhdGEuYWN0aW9uKVxuICAgIHtcbiAgICAgIGNhc2UgJ2lucHV0JzpcbiAgICAgICAgdGhpcy5yYW0uYmxpdChtc2cuZGF0YS5hcmdzLmtleVN0YXRlLCB0aGlzLnJhbS5nZXRLZXlib2FyZEJ1ZmZlckFkZHJlc3MoKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncGF1c2UnOlxuICAgICAgICB0aGlzLnBhdXNlZHVtcCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3Jlc3VtZSc6XG4gICAgICAgIHRoaXMucmVzdW1lKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnaGFsdGR1bXAnOlxuICAgICAgICB0aGlzLmhhbHRkdW1wKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc3RlcCc6XG4gICAgICAgIHRoaXMuc3RlcCgpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zeXN0ZW0vY2hpcDguanMiLCJcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnLi9ldmVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2UgZXh0ZW5kcyBFdmVudEVtaXR0ZXJcbntcblxuICBjb25zdHJ1Y3RvciAoKVxuICB7XG4gICAgc3VwZXIoKTtcblxuICB9XG5cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3V0aWwvYmFzZS5qcyIsIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudEVtaXR0ZXJcbntcbiAgY29uc3RydWN0b3IoKVxuICB7XG4gICAgdGhpcy5saXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5vbiA9IHRoaXMuYWRkTGlzdGVuZXI7XG4gICAgdGhpcy5maXJlID0gdGhpcy5lbWl0O1xuXG4gIH1cblxuICBhZGRMaXN0ZW5lcihsYWJlbCwgZm4pXG4gIHtcbiAgICB0aGlzLmxpc3RlbmVycy5oYXMobGFiZWwpIHx8IHRoaXMubGlzdGVuZXJzLnNldChsYWJlbCwgW10pO1xuICAgIHRoaXMubGlzdGVuZXJzLmdldChsYWJlbCkucHVzaChmbik7XG4gIH1cblxuICBfaXNGdW5jdGlvbihvYmopXG4gIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PSAnZnVuY3Rpb24nIHx8IGZhbHNlO1xuICB9XG5cbiAgcmVtb3ZlTGlzdGVuZXIobGFiZWwsIGZuKVxuICB7XG4gICAgbGV0IGxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzLmdldChsYWJlbCksXG4gICAgICAgIGluZGV4O1xuXG4gICAgaWYgKGxpc3RlbmVycyAmJiBsaXN0ZW5lcnMubGVuZ3RoKVxuICAgIHtcbiAgICAgICAgaW5kZXggPSBsaXN0ZW5lcnMucmVkdWNlKChpLCBsaXN0ZW5lciwgaW5kZXgpID0+IHtcbiAgICAgICAgICByZXR1cm4gKF9pc0Z1bmN0aW9uKGxpc3RlbmVyKSAmJiBsaXN0ZW5lciA9PT0gY2FsbGJhY2spID9cbiAgICAgICAgICAgIGkgPSBpbmRleCA6XG4gICAgICAgICAgICBpO1xuICAgICAgICB9LCAtMSk7XG5cbiAgICAgICAgaWYgKGluZGV4ID4gLTEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnMuc2V0KGxhYmVsLCBsaXN0ZW5lcnMpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZW1pdChsYWJlbCwgLi4uYXJncylcbiAge1xuICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVycy5nZXQobGFiZWwpO1xuICAgIGlmIChsaXN0ZW5lcnMgJiYgbGlzdGVuZXJzLmxlbmd0aClcbiAgICB7XG4gICAgICBsaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIpID0+IHtcbiAgICAgICAgbGlzdGVuZXIoLi4uYXJncylcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vdXRpbC9ldmVudC5qcyIsIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2FkZXJcbntcbiAgY29uc3RydWN0b3IoKVxuICB7XG5cbiAgfVxuXG4gIGxvYWQodXJsLCBmbilcbiAge1xuICAgIGxldCB4bWxodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICB4bWxodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09IDQgJiYgdGhpcy5zdGF0dXMgPT0gMjAwKSB7XG4gICAgICAgICAgICB2YXIganNvbiA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgZm4oanNvbik7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgeG1saHR0cC5vcGVuKFwiR0VUXCIsIHVybCwgdHJ1ZSk7XG4gICAgeG1saHR0cC5zZW5kKCk7XG4gIH1cblxuXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi91dGlsL2xvYWRlci5qcyIsImltcG9ydCBsb2cgZnJvbSAnbG9nbGV2ZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnB1dFxue1xuICAvLyBOb3RlLCB0aGUga2V5c3RhdGVzIGFyZSB3cml0dGVuIGRpcmVjbHR5IGludG8gdGhlIENoaXA4J3MgQklPUy9SQU1cbiAgLy8gZm9yIGRpcmVjdCBhY2Nlc3MgYnkgdGhlIENQVVxuXG4gIGNvbnN0cnVjdG9yKGNhbGxiYWNrKVxuICB7XG4gICAgLy8gMSAyIDMgQ1xuICAgIC8vIDQgNSA2IERcbiAgICAvLyA3IDggOSBFXG4gICAgLy8gQSAwIEIgRlxuICAgIC8vIHRoaXMua2V5TWFwID0gW1xuICAgIC8vICAgMTonMScsIDI6JzInLCAzOiczJywgYzonNCcsXG4gICAgLy8gICA0OidxJywgNTondycsIDY6J2UnLCBkOidyJyxcbiAgICAvLyAgIDc6J2EnLCA4OidzJywgOTonZCcsIGU6J2YnLFxuICAgIC8vICAgMTA6J3onLCA6MCd4JywgQjonYycsIGY6J3YnXG4gICAgLy8gXTtcblxuICAgIHRoaXMua2V5RGF0YSA9IG5ldyBVaW50OEFycmF5KDE2KTtcbiAgICB0aGlzLl9jYWxsYmFjayA9IGNhbGxiYWNrO1xuXG4gICAgdGhpcy5rZXlNYXAgPSBbXG4gICAgICAneCcsICcxJywgJzInLCAnMycsXG4gICAgICAncScsICd3JywgJ2UnLCAnYScsXG4gICAgICAncycsICdkJywgJ3onLCAnYycsXG4gICAgICAnNCcsICdyJywgJ2YnLCAndidcbiAgICBdO1xuXG4gICAgdGhpcy5faW5pdCgpO1xuICB9XG5cbiAgX3NldEtleURvd24oa2V5KVxuICB7XG4gICAgICB0aGlzLmtleURhdGFba2V5XSA9IDE7XG4gICAgICBpZiAodGhpcy5fY2FsbGJhY2spIHRoaXMuX2NhbGxiYWNrKHRoaXMua2V5RGF0YSk7XG4gIH1cblxuICBfc2V0S2V5VXAoa2V5KVxuICB7XG4gICAgICB0aGlzLmtleURhdGFba2V5XSA9IDA7XG4gICAgICBpZiAodGhpcy5fY2FsbGJhY2spIHRoaXMuX2NhbGxiYWNrKHRoaXMua2V5RGF0YSk7XG4gIH1cblxuICBfaW5pdCgpXG4gIHtcbiAgICAvL0hBQ0s6IGNvbnZlcnQgYXJyYXkgaW50byBpbnRlZ2VyIGFzY2lpIGNvZGVzIGZvciBxdWlja2VyIGxvb2t1cFxuICAgIGZvciAobGV0IGs9MDtrPHRoaXMua2V5TWFwLmxlbmd0aDtrKyspXG4gICAgICB0aGlzLmtleU1hcFtrXSA9IHRoaXMua2V5TWFwW2tdLmNoYXJDb2RlQXQoMCk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgICB2YXIgY29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZS5rZXlDb2RlKS50b0xvd2VyQ2FzZSgpLmNoYXJDb2RlQXQoMClcbiAgICAgIGZvciAobGV0IGs9MDsgazx0aGlzLmtleU1hcC5sZW5ndGg7IGsrKylcbiAgICAgIHtcbiAgICAgICAgaWYgKHRoaXMua2V5TWFwW2tdID09IGNvZGUpXG4gICAgICAgICAgdGhpcy5fc2V0S2V5RG93bihrKTtcbiAgICAgIH1cbiAgICAgIC8vdGhpcy5wcmludFRhYmxlKCk7XG4gICAgfSwgdHJ1ZSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZSkgPT4ge1xuICAgICAgLy9sb2cud2FybigpO1xuICAgICAgdmFyIGNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUua2V5Q29kZSkudG9Mb3dlckNhc2UoKS5jaGFyQ29kZUF0KDApXG4gICAgICBmb3IgKGxldCBrPTA7IGs8dGhpcy5rZXlNYXAubGVuZ3RoOyBrKyspXG4gICAgICB7XG4gICAgICAgIGlmICh0aGlzLmtleU1hcFtrXSA9PSBjb2RlKVxuICAgICAgICAgIHRoaXMuX3NldEtleVVwKGspO1xuICAgICAgfVxuICAgIH0sIHRydWUpO1xuXG4gIH1cblxuXG5cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2RvbS9pbnB1dC5qcyIsIi8qXG4qIGxvZ2xldmVsIC0gaHR0cHM6Ly9naXRodWIuY29tL3BpbXRlcnJ5L2xvZ2xldmVsXG4qXG4qIENvcHlyaWdodCAoYykgMjAxMyBUaW0gUGVycnlcbiogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuKi9cbihmdW5jdGlvbiAocm9vdCwgZGVmaW5pdGlvbikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKGRlZmluaXRpb24pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5sb2cgPSBkZWZpbml0aW9uKCk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIG5vb3AgPSBmdW5jdGlvbigpIHt9O1xuICAgIHZhciB1bmRlZmluZWRUeXBlID0gXCJ1bmRlZmluZWRcIjtcblxuICAgIGZ1bmN0aW9uIHJlYWxNZXRob2QobWV0aG9kTmFtZSkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgPT09IHVuZGVmaW5lZFR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gV2UgY2FuJ3QgYnVpbGQgYSByZWFsIG1ldGhvZCB3aXRob3V0IGEgY29uc29sZSB0byBsb2cgdG9cbiAgICAgICAgfSBlbHNlIGlmIChjb25zb2xlW21ldGhvZE5hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBiaW5kTWV0aG9kKGNvbnNvbGUsIG1ldGhvZE5hbWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGNvbnNvbGUubG9nICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBiaW5kTWV0aG9kKGNvbnNvbGUsICdsb2cnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBub29wO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYmluZE1ldGhvZChvYmosIG1ldGhvZE5hbWUpIHtcbiAgICAgICAgdmFyIG1ldGhvZCA9IG9ialttZXRob2ROYW1lXTtcbiAgICAgICAgaWYgKHR5cGVvZiBtZXRob2QuYmluZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIG1ldGhvZC5iaW5kKG9iaik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5jYWxsKG1ldGhvZCwgb2JqKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAvLyBNaXNzaW5nIGJpbmQgc2hpbSBvciBJRTggKyBNb2Rlcm5penIsIGZhbGxiYWNrIHRvIHdyYXBwaW5nXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmFwcGx5KG1ldGhvZCwgW29iaiwgYXJndW1lbnRzXSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHRoZXNlIHByaXZhdGUgZnVuY3Rpb25zIGFsd2F5cyBuZWVkIGB0aGlzYCB0byBiZSBzZXQgcHJvcGVybHlcblxuICAgIGZ1bmN0aW9uIGVuYWJsZUxvZ2dpbmdXaGVuQ29uc29sZUFycml2ZXMobWV0aG9kTmFtZSwgbGV2ZWwsIGxvZ2dlck5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gdW5kZWZpbmVkVHlwZSkge1xuICAgICAgICAgICAgICAgIHJlcGxhY2VMb2dnaW5nTWV0aG9kcy5jYWxsKHRoaXMsIGxldmVsLCBsb2dnZXJOYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzW21ldGhvZE5hbWVdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVwbGFjZUxvZ2dpbmdNZXRob2RzKGxldmVsLCBsb2dnZXJOYW1lKSB7XG4gICAgICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbG9nTWV0aG9kcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSBsb2dNZXRob2RzW2ldO1xuICAgICAgICAgICAgdGhpc1ttZXRob2ROYW1lXSA9IChpIDwgbGV2ZWwpID9cbiAgICAgICAgICAgICAgICBub29wIDpcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGhvZEZhY3RvcnkobWV0aG9kTmFtZSwgbGV2ZWwsIGxvZ2dlck5hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVmYXVsdE1ldGhvZEZhY3RvcnkobWV0aG9kTmFtZSwgbGV2ZWwsIGxvZ2dlck5hbWUpIHtcbiAgICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgICAgcmV0dXJuIHJlYWxNZXRob2QobWV0aG9kTmFtZSkgfHxcbiAgICAgICAgICAgICAgIGVuYWJsZUxvZ2dpbmdXaGVuQ29uc29sZUFycml2ZXMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICB2YXIgbG9nTWV0aG9kcyA9IFtcbiAgICAgICAgXCJ0cmFjZVwiLFxuICAgICAgICBcImRlYnVnXCIsXG4gICAgICAgIFwiaW5mb1wiLFxuICAgICAgICBcIndhcm5cIixcbiAgICAgICAgXCJlcnJvclwiXG4gICAgXTtcblxuICAgIGZ1bmN0aW9uIExvZ2dlcihuYW1lLCBkZWZhdWx0TGV2ZWwsIGZhY3RvcnkpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHZhciBjdXJyZW50TGV2ZWw7XG4gICAgICB2YXIgc3RvcmFnZUtleSA9IFwibG9nbGV2ZWxcIjtcbiAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgIHN0b3JhZ2VLZXkgKz0gXCI6XCIgKyBuYW1lO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlKGxldmVsTnVtKSB7XG4gICAgICAgICAgdmFyIGxldmVsTmFtZSA9IChsb2dNZXRob2RzW2xldmVsTnVtXSB8fCAnc2lsZW50JykudG9VcHBlckNhc2UoKTtcblxuICAgICAgICAgIC8vIFVzZSBsb2NhbFN0b3JhZ2UgaWYgYXZhaWxhYmxlXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZVtzdG9yYWdlS2V5XSA9IGxldmVsTmFtZTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cblxuICAgICAgICAgIC8vIFVzZSBzZXNzaW9uIGNvb2tpZSBhcyBmYWxsYmFja1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5jb29raWUgPVxuICAgICAgICAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChzdG9yYWdlS2V5KSArIFwiPVwiICsgbGV2ZWxOYW1lICsgXCI7XCI7XG4gICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRQZXJzaXN0ZWRMZXZlbCgpIHtcbiAgICAgICAgICB2YXIgc3RvcmVkTGV2ZWw7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBzdG9yZWRMZXZlbCA9IHdpbmRvdy5sb2NhbFN0b3JhZ2Vbc3RvcmFnZUtleV07XG4gICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxuXG4gICAgICAgICAgaWYgKHR5cGVvZiBzdG9yZWRMZXZlbCA9PT0gdW5kZWZpbmVkVHlwZSkge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgdmFyIGNvb2tpZSA9IHdpbmRvdy5kb2N1bWVudC5jb29raWU7XG4gICAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSBjb29raWUuaW5kZXhPZihcbiAgICAgICAgICAgICAgICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoc3RvcmFnZUtleSkgKyBcIj1cIik7XG4gICAgICAgICAgICAgICAgICBpZiAobG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICBzdG9yZWRMZXZlbCA9IC9eKFteO10rKS8uZXhlYyhjb29raWUuc2xpY2UobG9jYXRpb24pKVsxXTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIElmIHRoZSBzdG9yZWQgbGV2ZWwgaXMgbm90IHZhbGlkLCB0cmVhdCBpdCBhcyBpZiBub3RoaW5nIHdhcyBzdG9yZWQuXG4gICAgICAgICAgaWYgKHNlbGYubGV2ZWxzW3N0b3JlZExldmVsXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHN0b3JlZExldmVsID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBzdG9yZWRMZXZlbDtcbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgICAqXG4gICAgICAgKiBQdWJsaWMgQVBJXG4gICAgICAgKlxuICAgICAgICovXG5cbiAgICAgIHNlbGYubGV2ZWxzID0geyBcIlRSQUNFXCI6IDAsIFwiREVCVUdcIjogMSwgXCJJTkZPXCI6IDIsIFwiV0FSTlwiOiAzLFxuICAgICAgICAgIFwiRVJST1JcIjogNCwgXCJTSUxFTlRcIjogNX07XG5cbiAgICAgIHNlbGYubWV0aG9kRmFjdG9yeSA9IGZhY3RvcnkgfHwgZGVmYXVsdE1ldGhvZEZhY3Rvcnk7XG5cbiAgICAgIHNlbGYuZ2V0TGV2ZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGN1cnJlbnRMZXZlbDtcbiAgICAgIH07XG5cbiAgICAgIHNlbGYuc2V0TGV2ZWwgPSBmdW5jdGlvbiAobGV2ZWwsIHBlcnNpc3QpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGxldmVsID09PSBcInN0cmluZ1wiICYmIHNlbGYubGV2ZWxzW2xldmVsLnRvVXBwZXJDYXNlKCldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgbGV2ZWwgPSBzZWxmLmxldmVsc1tsZXZlbC50b1VwcGVyQ2FzZSgpXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHR5cGVvZiBsZXZlbCA9PT0gXCJudW1iZXJcIiAmJiBsZXZlbCA+PSAwICYmIGxldmVsIDw9IHNlbGYubGV2ZWxzLlNJTEVOVCkge1xuICAgICAgICAgICAgICBjdXJyZW50TGV2ZWwgPSBsZXZlbDtcbiAgICAgICAgICAgICAgaWYgKHBlcnNpc3QgIT09IGZhbHNlKSB7ICAvLyBkZWZhdWx0cyB0byB0cnVlXG4gICAgICAgICAgICAgICAgICBwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlKGxldmVsKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXBsYWNlTG9nZ2luZ01ldGhvZHMuY2FsbChzZWxmLCBsZXZlbCwgbmFtZSk7XG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSA9PT0gdW5kZWZpbmVkVHlwZSAmJiBsZXZlbCA8IHNlbGYubGV2ZWxzLlNJTEVOVCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiTm8gY29uc29sZSBhdmFpbGFibGUgZm9yIGxvZ2dpbmdcIjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93IFwibG9nLnNldExldmVsKCkgY2FsbGVkIHdpdGggaW52YWxpZCBsZXZlbDogXCIgKyBsZXZlbDtcbiAgICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBzZWxmLnNldERlZmF1bHRMZXZlbCA9IGZ1bmN0aW9uIChsZXZlbCkge1xuICAgICAgICAgIGlmICghZ2V0UGVyc2lzdGVkTGV2ZWwoKSkge1xuICAgICAgICAgICAgICBzZWxmLnNldExldmVsKGxldmVsLCBmYWxzZSk7XG4gICAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgc2VsZi5lbmFibGVBbGwgPSBmdW5jdGlvbihwZXJzaXN0KSB7XG4gICAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVscy5UUkFDRSwgcGVyc2lzdCk7XG4gICAgICB9O1xuXG4gICAgICBzZWxmLmRpc2FibGVBbGwgPSBmdW5jdGlvbihwZXJzaXN0KSB7XG4gICAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVscy5TSUxFTlQsIHBlcnNpc3QpO1xuICAgICAgfTtcblxuICAgICAgLy8gSW5pdGlhbGl6ZSB3aXRoIHRoZSByaWdodCBsZXZlbFxuICAgICAgdmFyIGluaXRpYWxMZXZlbCA9IGdldFBlcnNpc3RlZExldmVsKCk7XG4gICAgICBpZiAoaW5pdGlhbExldmVsID09IG51bGwpIHtcbiAgICAgICAgICBpbml0aWFsTGV2ZWwgPSBkZWZhdWx0TGV2ZWwgPT0gbnVsbCA/IFwiV0FSTlwiIDogZGVmYXVsdExldmVsO1xuICAgICAgfVxuICAgICAgc2VsZi5zZXRMZXZlbChpbml0aWFsTGV2ZWwsIGZhbHNlKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqXG4gICAgICogUGFja2FnZS1sZXZlbCBBUElcbiAgICAgKlxuICAgICAqL1xuXG4gICAgdmFyIGRlZmF1bHRMb2dnZXIgPSBuZXcgTG9nZ2VyKCk7XG5cbiAgICB2YXIgX2xvZ2dlcnNCeU5hbWUgPSB7fTtcbiAgICBkZWZhdWx0TG9nZ2VyLmdldExvZ2dlciA9IGZ1bmN0aW9uIGdldExvZ2dlcihuYW1lKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIiB8fCBuYW1lID09PSBcIlwiKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIllvdSBtdXN0IHN1cHBseSBhIG5hbWUgd2hlbiBjcmVhdGluZyBhIGxvZ2dlci5cIik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbG9nZ2VyID0gX2xvZ2dlcnNCeU5hbWVbbmFtZV07XG4gICAgICAgIGlmICghbG9nZ2VyKSB7XG4gICAgICAgICAgbG9nZ2VyID0gX2xvZ2dlcnNCeU5hbWVbbmFtZV0gPSBuZXcgTG9nZ2VyKFxuICAgICAgICAgICAgbmFtZSwgZGVmYXVsdExvZ2dlci5nZXRMZXZlbCgpLCBkZWZhdWx0TG9nZ2VyLm1ldGhvZEZhY3RvcnkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsb2dnZXI7XG4gICAgfTtcblxuICAgIC8vIEdyYWIgdGhlIGN1cnJlbnQgZ2xvYmFsIGxvZyB2YXJpYWJsZSBpbiBjYXNlIG9mIG92ZXJ3cml0ZVxuICAgIHZhciBfbG9nID0gKHR5cGVvZiB3aW5kb3cgIT09IHVuZGVmaW5lZFR5cGUpID8gd2luZG93LmxvZyA6IHVuZGVmaW5lZDtcbiAgICBkZWZhdWx0TG9nZ2VyLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IHVuZGVmaW5lZFR5cGUgJiZcbiAgICAgICAgICAgICAgIHdpbmRvdy5sb2cgPT09IGRlZmF1bHRMb2dnZXIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5sb2cgPSBfbG9nO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRlZmF1bHRMb2dnZXI7XG4gICAgfTtcblxuICAgIHJldHVybiBkZWZhdWx0TG9nZ2VyO1xufSkpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZ2xldmVsL2xpYi9sb2dsZXZlbC5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcbmltcG9ydCBsb2cgZnJvbSAnbG9nbGV2ZWwnO1xuaW1wb3J0IEJhc2UgZnJvbSAnLi4vLi4vdXRpbC9iYXNlJztcbmltcG9ydCB7b3Bjb2Rlc30gZnJvbSAnLi9vcGNvZGVzJztcblxuaW1wb3J0IERlbGF5VGltZXIgICAgICAgICBmcm9tICcuLi90aW1lci1kZWxheSc7XG5cbmNvbnN0IFdPUkRfU0laRSA9IDI7ICAgICAgICAgICAgLy8gMTYtYml0IGluc3RydWN0aW9uXG5jb25zdCBJUF9JTklUID0gMHgyMDA7ICAgICAgICAgIC8vID0gNTEyLiBCeXRlcyAwLTUxMSByZXNlcnZlZCBmb3IgYnVpbHQtaW4gaW50ZXJwcmV0ZXJcbmNvbnN0IFRSQUNFX0JVRkZFUl9TSVpFID0gMTA7ICAgLy8gc3RvcmUgbGFzdCAxMCBpbnN0cnVjdGlvbnNcbmNvbnN0IF9WRiAgICAgICAgPSAweGY7ICAgICAgICAgICAgICAvLyBGbGFnIHJlZ2lzdGVyXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENQVSBleHRlbmRzIEJhc2VcbntcbiAgY29uc3RydWN0b3IoZ2Z4LCByYW0pXG4gIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX3RoaXMgPSBcIkNQVVwiOyAvLyBmb3IgY29udGV4dCBkZWJ1Z2dpbmcgKFRfVClcbiAgICB0aGlzLmdmeCA9IGdmeDtcbiAgICB0aGlzLnJhbSA9IHJhbTtcbiAgICB0aGlzLmtleVN0YXRlQWRkciA9IHJhbS5nZXRLZXlib2FyZEJ1ZmZlckFkZHJlc3MoKTtcbiAgICBsb2cuZGVidWcoXCJDUFUgSW5pdGlhbGlzZWRcIik7XG5cbiAgICB0aGlzLl90cmFjZSA9IG5ldyBBcnJheShUUkFDRV9CVUZGRVJfU0laRSk7XG4gICAgdGhpcy5fdHJhY2VfcHRyID0gMDtcblxuICAgIC8vIEkgZmVlbCBsaWtlIHRoaXMgc2hvdWxkIGJlIHBhcnQgb2YgdGhlIENoaXA4KCkgb2JqZWN0L3N5c3RlbSBpbnN0ZWFkIG9mXG4gICAgLy8gaW4gaGVyZSBidXQgdGhlIGRlbGF5IHRpbWVyIGFwcGVhcnMgdG8gYmUgb25seSBhY2Nlc3NlZCBvciB1c2VkIGRpcmVjdGx5XG4gICAgLy8gYnkgdGhlIENQVSBzbyB3aGF0ZXZlclxuICAgIHRoaXMuZGVsYXlUaW1lciA9IG5ldyBEZWxheVRpbWVyKCk7XG5cbiAgICB0aGlzLnJlZyA9IHtcbiAgICAgIHY6IFtdLFxuICAgICAgaTogIDAsXG4gICAgICBfaXA6IDAsXG4gICAgICBfc3A6IDAsXG4gICAgICBnZXQgaXAoKSB7cmV0dXJuIHRoaXMuX2lwfSxcbiAgICAgIGdldCBzcCgpIHtyZXR1cm4gdGhpcy5fc3B9LFxuICAgIH07XG5cbiAgICB0aGlzLnN0YWNrID0gW11cbiAgICB0aGlzLmV4ZWMgPSBvcGNvZGVzO1xuICB9XG5cbiAgcmVzZXQoKVxuICB7XG4gICAgbGV0IHIgPSB0aGlzLnJlZztcbiAgICBbci52LCByLmksIHIuX2lwLCByLl9zcF0gPSBbbmV3IEFycmF5KDE2KS5maWxsKDApLDAsSVBfSU5JVCwwXTtcbiAgfVxuXG4gIG5leHQoKVxuICB7XG4gICAgdGhpcy5yZWcuX2lwICs9IFdPUkRfU0laRTtcbiAgfVxuXG4gIGZldGNoKClcbiAge1xuICAgIHJldHVybiB0aGlzLnJhbS5yZWFkV29yZCh0aGlzLnJlZy5pcCk7XG4gIH1cblxuICBkZWNvZGUoaW5zdHIpXG4gIHtcbiAgICBsZXQgaSA9IGluc3RyICYgMHhmZmZmO1xuICAgIGxldCBtYWpvciA9IChpICYgMHhmMDAwKSA+PiAxMixcbiAgICAgICAgbWlub3IgPSBpICYgMHgwZmZmO1xuXG4gICAgdGhpcy5fYWRkX3RvX3RyYWNlX2xvb3AoaW5zdHIsIHRoaXMucmVnLmlwKTtcblxuICAgIHJldHVybiB7bWFqb3IsIG1pbm9yfVxuICB9XG5cbiAgZXhlY3V0ZSh7bWFqb3IsIG1pbm9yfSlcbiAge1xuICAgIGlmICghdGhpcy5leGVjW21ham9yXS5jYWxsKHRoaXMsIHttYWpvciwgbWlub3J9KSlcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gIH1cblxuICAvLyBJJ20gcGFydGljdWxhcmx5IHBsZWFzZWQgd2l0aCB0aGlzIGxvb3BlZCBidWZmZXIgc29sdXRpb25cbiAgLy8gdG8gcmVjb3JkIGEgd2luZG93L3NuYXBzaG90IG9mIGEgZGF0YS1zdHJlYW0gb2YgaW5maW5pdGUgKHVua25vd24pIGxlbmd0aFxuICAvLyBLaW5kYSBsaWtlIGhvdyB0aGUgYnVmZmVyIHdvcmtzIGluIGEgZGlnaXRhbCBzb3VuZCBjaGlwXG4gIC8vIFRoaXMgaXMgb2J2aW91c2x5IGZhc3RlciB0aGFuIHNsaWNpbmcgYW4gYXJyYXkncyBlbGVtZW50c1xuICBfYWRkX3RvX3RyYWNlX2xvb3AoaSxhKVxuICB7XG4gICAgdGhpcy5fdHJhY2VbdGhpcy5fdHJhY2VfcHRyKytdID0ge2ksIGF9XG4gICAgaWYgKHRoaXMuX3RyYWNlX3B0ciA9PSBUUkFDRV9CVUZGRVJfU0laRSlcbiAgICAgIHRoaXMuX3RyYWNlX3B0ciA9IDA7XG4gIH1cblxuICBfdW5yb2xsX3RyYWNlX2xvb3AoKVxuICB7XG4gICAgLy8gU2VwYXJhdGUgdGhlIGluc3RydWN0aW9uIGFuZCBhZGRyZXNzIGludG8gc2VwYXJhdGVcbiAgICAvLyBhcnJheXMgZm9yIGVhc2llciBwYXNzaW5nIHRvIHRoZSBkaXNhc3NlbWJsZXJcbiAgICBsZXQgdHJhY2VfdW5yb2xsZWQgPSB7aTpbXSwgYTpbXX07XG5cbiAgICBsZXQgaXAgPSB0aGlzLl90cmFjZV9wdHI7XG4gICAgZm9yIChsZXQgcD0wOyBwPFRSQUNFX0JVRkZFUl9TSVpFOyBwKyspXG4gICAge1xuICAgICAgdHJhY2VfdW5yb2xsZWQuYS5wdXNoKHRoaXMuX3RyYWNlW2lwXS5hKTsgIC8vIGFkZHJlc3NcbiAgICAgIHRyYWNlX3Vucm9sbGVkLmkucHVzaCh0aGlzLl90cmFjZVtpcF0uaSkgICAvLyBpbnN0cnVjdGlvblxuICAgICAgaWYgKC0taXAgPCAwKSBpcCA9IFRSQUNFX0JVRkZFUl9TSVpFLTE7XG4gICAgfVxuXG4gICAgdHJhY2VfdW5yb2xsZWQuYS5yZXZlcnNlKCk7XG4gICAgdHJhY2VfdW5yb2xsZWQuaS5yZXZlcnNlKCk7XG4gICAgcmV0dXJuIHRyYWNlX3Vucm9sbGVkO1xuICB9XG5cbiAgdHJhY2UoKVxuICB7XG4gICAgcmV0dXJuIHRoaXMuX3Vucm9sbF90cmFjZV9sb29wKCk7XG4gIH1cblxuICBkdW1wX3JlZ2lzdGVycygpXG4gIHtcbiAgICByZXR1cm4gdGhpcy5yZWc7XG4gIH1cblxuXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zeXN0ZW0vY3B1L2NwdS5qcyIsIlxuaW1wb3J0IGxvZyBmcm9tICdsb2dsZXZlbCc7XG5cbmltcG9ydCB7JF9pbnN0cl8weDB9IGZyb20gJy4vb3Bjb2RlLTB4MC5qcyc7XG5pbXBvcnQgeyRfaW5zdHJfMHg4fSBmcm9tICcuL29wY29kZS0weDguanMnO1xuaW1wb3J0IHskX2luc3RyXzB4RX0gZnJvbSAnLi9vcGNvZGUtMHhFLmpzJztcbmltcG9ydCB7JF9pbnN0cl8weEZ9IGZyb20gJy4vb3Bjb2RlLTB4Ri5qcyc7XG5cbmNvbnN0IF9WRiAgICAgICAgPSAweGY7ICAgICAgICAgICAgICAvLyBGbGFnIHJlZ2lzdGVyXG5cbmV4cG9ydCBsZXQgb3Bjb2RlcyA9IFtcblxuICBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSkgIC8vIDB4MD8/P1xuICB7XG4gICAgJF9pbnN0cl8weDBbbWlub3IgJiAweGZmXS5jYWxsKHRoaXMsIHttYWpvciwgbWlub3J9KTtcbiAgfSxcblxuICBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSkgLy8weDFubm46IEpNUCBubm5cbiAge1xuICAgIHRoaXMucmVnLl9pcCA9IG1pbm9yJjB4ZmZmO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuXG4gIGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAvLyAweDJubm46IENBTEwgbm5uXG4gIHtcbiAgICB0aGlzLnN0YWNrLnB1c2godGhpcy5yZWcuaXApO1xuICAgIHRoaXMucmVnLl9pcCA9IG1pbm9yJjB4ZmZmO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuXG4gIGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAvLyAweDNYUlIgLy8ganVtcCBuZXh0IGluc3RyIGlmIHZYID09IFJSXG4gIHtcbiAgICBpZiAodGhpcy5yZWcudlsobWlub3I+PjgpJjB4Zl0gPT0gKG1pbm9yJjB4ZmYpKVxuICAgICAgdGhpcy5yZWcuX2lwICs9IDI7XG4gIH0sXG5cbiAgZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vNFxuICB7XG4gICAgaWYgKHRoaXMucmVnLnZbKG1pbm9yPj44KSYweGZdICE9IChtaW5vciYweGZmKSlcbiAgICAgIHRoaXMucmVnLl9pcCArPSAyO1xuICB9LFxuXG4gIGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAvLzVcbiAge1xuICAgIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbiAgfSxcblxuICBmdW5jdGlvbiAoe21ham9yLCBtaW5vcn0pIC8vIDB4NnhubiAgbW92IHZ4LCBublxuICB7XG4gICAgdGhpcy5yZWcudlsobWlub3I+PjgpJjB4Zl0gPSBtaW5vciAmIDB4ZmY7XG4gIH0sXG5cbiAgZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vIDB4N3hyciBhZGQgdngsIHJyXG4gIHtcbiAgICBsZXQgeCA9IChtaW5vcj4+OCkmMHhmXG4gICAgdGhpcy5yZWcudlt4XSArPSBtaW5vciYweGZmO1xuICAgIHRoaXMucmVnLnZbeF0gJj0gMjU1O1xuXG4gIH0sXG5cbiAgZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vIDB4OFxuICB7XG4gICAgJF9pbnN0cl8weDhbbWlub3IgJiAweGZdLmNhbGwodGhpcywge21ham9yLCBtaW5vcn0pO1xuICB9LFxuXG4gIGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAvLyA5XG4gIHtcbiAgICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG4gIH0sXG5cbiAgZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vIDB4QW5ubjogbXZpIG5ubiAobG9hZCAnSScgd2l0aCBubm4pXG4gIHtcbiAgICB0aGlzLnJlZy5pID0gbWlub3IgJiAweGZmZjtcbiAgfSxcblxuICBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSkgLy8gYlxuICB7XG4gICAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xuICB9LFxuXG4gIGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAvLyAweEN4a2s7IHJuZCB2eCwga2tcbiAge1xuICAgIGxldCBybmQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNTUpICYgKG1pbm9yJjB4ZmYpXG4gICAgdGhpcy5yZWcudlsobWlub3I+PjgpJjB4Zl0gPSBybmQ7XG4gIH0sXG5cbiAgZnVuY3Rpb24gKHttYWpvciwgbWlub3J9KSAgLy8gMHhEeHluOiBEUlcgVngsIFZ5LCBuICAoZHJhdyBzcHJpdGUpXG4gIHtcbiAgICBsZXQgciA9IHRoaXMucmVnLCBtID0gbWlub3I7XG4gICAgci52W19WRl0gPSB0aGlzLmdmeC5kcmF3KHIuaSwgci52WyhtPj44KSYweGZdLCByLnZbKG0+PjQpJjB4Zl0sIG0mMHhmKTtcbiAgfSxcblxuICBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSkgLy8gMHhFXG4gIHtcbiAgICAkX2luc3RyXzB4RVttaW5vciAmIDB4ZmZdLmNhbGwodGhpcywge21ham9yLCBtaW5vcn0pO1xuICB9LFxuXG4gIGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAgLy8gMHhGeD8/XG4gIHtcbiAgICAkX2luc3RyXzB4RlttaW5vciAmIDB4ZmZdLmNhbGwodGhpcywge21ham9yLCBtaW5vcn0pO1xuICB9XG5dO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3lzdGVtL2NwdS9vcGNvZGVzLmpzIiwiXG5pbXBvcnQgbG9nIGZyb20gJ2xvZ2xldmVsJztcblxubGV0IE1BWF9JTlNUUiA9IDB4RkY7XG5sZXQgJF9pbnN0cl8weDAgPSBbXTtcblxuLy8gcHJvYnMgYSBzbWFydGVyIHdheSB0byBkbyB0aGlzIGJ1dCBvaCB3ZWxsXG5mb3IgKHZhciB0PTA7IHQ8PU1BWF9JTlNUUjsgdCsrKVxuICAkX2luc3RyXzB4MC5wdXNoKCB7fSApO1xuXG4kX2luc3RyXzB4MFsweEUwXSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAvLyBSRVQgKHN0YWNrLnBvcClcbntcbiAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuXG4kX2luc3RyXzB4MFsweEVFXSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAvLyBSRVQgKHN0YWNrLnBvcClcbntcbiAgbGV0IGFkZHIgPSB0aGlzLnN0YWNrLnBvcCgpO1xuICB0aGlzLnJlZy5faXAgPSBhZGRyO1xufVxuXG5leHBvcnQgeyRfaW5zdHJfMHgwfTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3N5c3RlbS9jcHUvb3Bjb2RlLTB4MC5qcyIsIlxubGV0ICRfaW5zdHJfMHg4ID0gW107XG5cbmNvbnN0IF9WRiAgICAgICAgPSAweGY7ICAgICAgICAgICAgICAvLyBGbGFnIHJlZ2lzdGVyXG5cbiRfaW5zdHJfMHg4WzB4MF0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgdGhpcy5yZWcudlttaW5vcj4+OCYweGZdID0gdGhpcy5yZWcudlsobWlub3I+PjQpJjB4Zl07XG4gIC8vdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuJF9pbnN0cl8weDhbMHgxXSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG5cbiRfaW5zdHJfMHg4WzB4Ml0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSkgLy8gYW5kIHZ4LCB2eVxue1xuICBsZXQgdnggPSAobWlub3I+PjgpJjB4ZjtcbiAgbGV0IHZ5ID0gKG1pbm9yPj40KSYweGY7XG4gIGxldCByeCA9IHRoaXMucmVnLnZbdnhdO1xuICBsZXQgcnkgPSB0aGlzLnJlZy52W3Z5XTtcbiAgbGV0IHJlcyA9IHRoaXMucmVnLnZbdnhdICYgdGhpcy5yZWcudlsobWlub3I+PjQpJjB4Zl07XG4gIGxldCBtc2cgPSBgYW5kICR7dnh9LCAke3Z5fSAoYW5kICR7cnh9LCAke3J5fSA9ICR7cmVzfSlgO1xuICB0aGlzLnJlZy52W3Z4XSA9IHJlczsvL3RoaXMucmVnLnZbdnhdICYgdGhpcy5yZWcudlsobWlub3I+PjQpJjB4Zl07XG4gIC8vdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IG1zZ30pO1xuICAvL2NvbnNvbGUubG9nKG1zZyk7XG4gIC8vdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuJF9pbnN0cl8weDhbMHgzXSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG4kX2luc3RyXzB4OFsweDRdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vIEFERCB2eCwgdnkgLT4gdmZcbntcbiAgLy90aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG5cbiAgbGV0IHggPSAobWlub3I+PjgpJjB4ZiwgeSA9IChtaW5vcj4+NCkmMHhmO1xuICB0aGlzLnJlZy52W3hdICs9IHRoaXMucmVnLnZbeV07XG4gIHRoaXMucmVnLnZbX1ZGXSA9ICsodGhpcy5yZWcudlt4XSA+IDI1NSk7XG4gIGlmICh0aGlzLnJlZy52W3hdID4gMjU1KSB0aGlzLnJlZy52W3hdIC09IDI1NjtcblxuICAvLyBsZXQgdnggPSAobWlub3I+PjgpJjB4ZjtcbiAgLy8gbGV0IHIgPSB0aGlzLnJlZy52W3Z4XSArIHRoaXMucmVnLnZbKG1pbm9yPj40KSYweGZdO1xuICAvLyBsZXQgbXNnID0gYCR7dGhpcy5yZWcudlt2eF19ICsgJHt0aGlzLnJlZy52WyhtaW5vcj4+NCkmMHhmXX0gPSAke3J9IChhY3R1YWwgPSAke3RoaXMucmVnLnZbdnhdfSwgZmxhZyA9ICR7dGhpcy5yZWcudmZ9KWA7XG4gIC8vIHRoaXMucmVnLnZbdnhdID0gciYweGZmO1xuICAvLyB0aGlzLnJlZy52ZiA9ICghIShyJjB4ZmYwMCkpKzA7ICAvLyBsb2xcbiAgLy8gY29uc29sZS5kZWJ1Zyhtc2cpXG4gIC8vdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IG1zZ30pO1xufVxuJF9pbnN0cl8weDhbMHg1XSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICBsZXQgeCA9IChtaW5vcj4+OCkmMHhmLCB5ID0gKG1pbm9yPj40KSYweGY7XG4gIHRoaXMucmVnLnZbX1ZGXSA9ICsodGhpcy5yZWcudlt4XSA+IHRoaXMucmVnLnZbeV0pO1xuICB0aGlzLnJlZy52W3hdIC09IHRoaXMucmVnLnZbeV07XG4gIC8vdGhpcy5maXJlKCdkZWJ1ZycpO1xuICBpZiAodGhpcy5yZWcudlt4XSA8IDApIHRoaXMucmVnLnZbeF0gKz0gMjU2O1xuXG4gIC8vIGxldCB2eCA9IHRoaXMucmVnLnZbKG1pbm9yPj44KSYweGZdLCB2eSA9IHRoaXMucmVnLnZbKG1pbm9yPj40KSYweGZdO1xuICAvLyBsZXQgZiA9ICh2eCA+IHZ5KSswO1xuICAvLyB0aGlzLnJlZy52W3Z4XSA9IGYgPyB0aGlzLnJlZy52W3Z4XSAtIHRoaXMucmVnLnZbdnldIDogdGhpcy5yZWcudlt2eV0gLSB0aGlzLnJlZy52W3Z4XTtcbiAgLy90aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG4kX2luc3RyXzB4OFsweDZdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cbiRfaW5zdHJfMHg4WzB4N10gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuJF9pbnN0cl8weDhbMHg4XSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG4kX2luc3RyXzB4OFsweDldID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cbiRfaW5zdHJfMHg4WzB4QV0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuJF9pbnN0cl8weDhbMHhCXSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG4kX2luc3RyXzB4OFsweENdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cbiRfaW5zdHJfMHg4WzB4RF0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuJF9pbnN0cl8weDhbMHhFXSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG4kX2luc3RyXzB4OFsweEZdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cblxuZXhwb3J0eyRfaW5zdHJfMHg4fTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3N5c3RlbS9jcHUvb3Bjb2RlLTB4OC5qcyIsIlxuaW1wb3J0IGxvZyBmcm9tICdsb2dsZXZlbCc7XG5cbmxldCBNQVhfSU5TVFIgPSAweEExO1xubGV0ICRfaW5zdHJfMHhFID0gW107XG5cbi8vIHByb2JzIGEgc21hcnRlciB3YXkgdG8gZG8gdGhpcyBidXQgb2ggd2VsbFxuZm9yICh2YXIgdD0wOyB0PD1NQVhfSU5TVFI7IHQrKylcbiAgJF9pbnN0cl8weEUucHVzaCgge30gKTtcblxuJF9pbnN0cl8weEVbMHg5RV0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuXG4kX2luc3RyXzB4RVsweEExXSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICBpZiAodGhpcy5yYW0uZGF0YVt0aGlzLmtleVN0YXRlQWRkciArIHRoaXMucmVnLnZbKG1pbm9yPj44KSYweGZdXSA9PSAwKVxuICAgIHRoaXMucmVnLl9pcCArPSAyO1xufVxuXG5cbmV4cG9ydCB7JF9pbnN0cl8weEV9O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3lzdGVtL2NwdS9vcGNvZGUtMHhFLmpzIiwiXG5pbXBvcnQgbG9nIGZyb20gJ2xvZ2xldmVsJztcblxubGV0IE1BWF9JTlNUUiA9IDB4NjU7XG5sZXQgJF9pbnN0cl8weEYgPSBbXTtcblxuLy8gcHJvYnMgYSBzbWFydGVyIHdheSB0byBkbyB0aGlzIGJ1dCBvaCB3ZWxsXG5mb3IgKHZhciB0PTA7IHQ8PU1BWF9JTlNUUjsgdCsrKVxuICAkX2luc3RyXzB4Ri5wdXNoKHt9KTtcblxuJF9pbnN0cl8weEZbMHgwN10gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSkgLy8gRngwNzogcmVhZCBkZWxheSB0aW1lciBmcm9tIFZ4XG57XG4gIHRoaXMucmVnLnZbKG1pbm9yPj44KSYweGZdID0gdGhpcy5kZWxheVRpbWVyLmdldCgpO1xufVxuXG4kX2luc3RyXzB4RlsweDBBXSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG5cbiRfaW5zdHJfMHhGWzB4MTVdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vIEZ4MTU6IHNldCBkZWxheSB0aW1lciBmcm9tIFZ4XG57XG4gIHRoaXMuZGVsYXlUaW1lci5zZXQodGhpcy5yZWcudlsobWlub3I+PjgpJjB4Zl0pO1xufVxuXG4kX2luc3RyXzB4RlsweDE4XSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICAvL3RoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cbiRfaW5zdHJfMHhGWzB4MUVdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cblxuJF9pbnN0cl8weEZbMHgyOV0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgbGV0IHZhbCA9IHRoaXMucmVnLnZbKG1pbm9yPj44KSYweGZdO1xuICB0aGlzLnJlZy5pID0gdGhpcy5yYW0uZ2V0Q2hhckFkZHJCSU9TKCkgKyAodGhpcy5yYW0uZ2V0Q2hhclNpemVCSU9TKCkgKiB2YWwpO1xufVxuXG4kX2luc3RyXzB4RlsweDMwXSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG5cbiRfaW5zdHJfMHhGWzB4MzNdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vIEZ4MzM6IGJjZCBbaV0sIFZ4IChzdG9yZSBiY2Qgb2YgcmVnIFZ4IGF0IGFkZHJlc3MgcmVnIGktPmkrMilcbntcbiAgbGV0IHYgPSB0aGlzLnJlZy52WyhtaW5vcj4+OCkmMHhmXTtcbiAgdGhpcy5yYW0uZGF0YVt0aGlzLnJlZy5pKzBdID0gTWF0aC5mbG9vcih2IC8gMTAwKTtcbiAgdGhpcy5yYW0uZGF0YVt0aGlzLnJlZy5pKzFdID0gTWF0aC5mbG9vcigodiAlIDEwMCkgLyAxMCk7XG4gIHRoaXMucmFtLmRhdGFbdGhpcy5yZWcuaSsyXSA9ICh2ICUgMTApO1xufVxuXG4kX2luc3RyXzB4RlsweDU1XSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG5cbiRfaW5zdHJfMHhGWzB4NjVdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vIEZ4NjU6IG1vdiB2MC12eCwgW2ldIChsb2FkIG51bWJlcnMgZnJvbSByZWcuaSBpbnRvIHJlZy52MCAtPiByZWcudngpXG57XG4gIGZvciAodmFyIHg9MCwgbXg9KG1pbm9yPj44KSYweGY7IHg8PW14OyB4KyspXG4gICAgdGhpcy5yZWcudlt4XSA9IHRoaXMucmFtLmRhdGFbdGhpcy5yZWcuaSArIHhdO1xuXG4gIHRoaXMucmVnLmkgKz0geDsgLy8gaSA9IGkgKyBYICsgMVxufVxuXG5leHBvcnQgeyRfaW5zdHJfMHhGfTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3N5c3RlbS9jcHUvb3Bjb2RlLTB4Ri5qcyIsIlxuY29uc3QgRlJFUVVFTkNZID0gMTAwMC82MDsgLy8gNjBIelxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZWxheVRpbWVyXG57XG4gIGNvbnN0cnVjdG9yKClcbiAge1xuICAgIHRoaXMuY291bnRlciA9IDA7XG4gICAgdGhpcy5fdGltZXJJZCA9IG51bGw7XG4gIH1cblxuICBzZXQodmFsdWUpXG4gIHtcbiAgICB0aGlzLmNvdW50ZXIgPSB2YWx1ZSAmIDB4ZmY7XG4gICAgdGhpcy5fc3RhcnQoKTtcbiAgfVxuXG4gIGdldCh2YWx1ZSlcbiAge1xuICAgIHJldHVybiB0aGlzLmNvdW50ZXI7XG4gIH1cblxuICBpbnRlcnZhbEZ1bmMoKVxuICB7XG4gICAgdGhpcy5jb3VudGVyLS07XG4gICAgaWYgKHRoaXMuY291bnRlciA9PSAwKSB0aGlzLl9zdG9wKCk7XG4gIH1cblxuICBfc3RhcnQoKVxuICB7XG4gICAgdGhpcy5fdGltZXJJZCA9IHNlbGYuc2V0SW50ZXJ2YWwoKHRoaXMuaW50ZXJ2YWxGdW5jKS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIF9zdG9wKClcbiAge1xuICAgIGlmICh0aGlzLl90aW1lcklkKVxuICAgIHtcbiAgICAgIHNlbGYuY2xlYXJJbnRlcnZhbCh0aGlzLl90aW1lcklkKTtcbiAgICAgIHRoaXMuX3RpbWVySWQgPSBudWxsO1xuICAgIH1cbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3lzdGVtL3RpbWVyLWRlbGF5LmpzIiwiXG5pbXBvcnQgQmFzZSBmcm9tICcuLi91dGlsL2Jhc2UnO1xuXG5jb25zdCBCSU9TX0NIQVJfQkFTRV9BRERSID0gMHgwO1xuY29uc3QgQklPU19DSEFSX1NJWkUgPSA1O1xuY29uc3QgQklPU19OVU1fQ0hBUlMgPSAxNjtcbmNvbnN0IEJJT1NfS0VZQl9CQVNFX0FERFIgPSAoQklPU19DSEFSX1NJWkUgKiBCSU9TX05VTV9DSEFSUyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJBTSBleHRlbmRzIEJhc2VcbntcbiAgY29uc3RydWN0b3IoKVxuICB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl90aGlzID0gXCJSQU1cIjtcbiAgICB0aGlzLl9kYXRhID0gbmV3IEFycmF5QnVmZmVyKDB4MTAwMCk7XG4gICAgdGhpcy5kYXRhID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5fZGF0YSk7XG4gIH1cblxuICByZXNldCgpXG4gIHtcbiAgICAvL3RoaXMuZGF0YSA9IG5ldyBBcnJheSgweDEwMDApLmZpbGwoMCk7XG4gIH1cblxuICBnZXRDaGFyQWRkckJJT1MoKVxuICB7XG4gICAgcmV0dXJuIEJJT1NfQ0hBUl9CQVNFX0FERFI7XG4gIH1cblxuICBnZXRDaGFyU2l6ZUJJT1MoKVxuICB7XG4gICAgcmV0dXJuIEJJT1NfQ0hBUl9TSVpFO1xuICB9XG5cbiAgLy8gRGVjaWRlZCB0byB3cml0ZSB0aGUga2V5Ym9hcmQgYnVmZmVyIGludG8gc3lzdGVtIFJBTVxuICAvLyBpbnN0ZWFkIG9mIHBhc3NpbmcgYW4gYWRkaXRpb25hbCBJbnB1dCgpIG9iamVjdCB0byB0aGUgQ1BVKCkgY2xhc3NcbiAgLy8gVGhpcyBpcyBwcm9iYWJseSBtb3JlIGxpa2UgYW4gZW1iZWRkZWQgc3lzdGVtIHdvdWxkIHdvcmtcbiAgZ2V0S2V5Ym9hcmRCdWZmZXJBZGRyZXNzKClcbiAge1xuICAgIHJldHVybiBCSU9TX0tFWUJfQkFTRV9BRERSO1xuICB9XG5cbiAgcmVhZEJ5dGUoYWRkcilcbiAge1xuICAgIHRoaXMuX3ZhbGlkYXRlX2FkZHJlc3MoYWRkcik7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVthZGRyXTtcbiAgfVxuXG4gIHJlYWRXb3JkKGFkZHIpXG4gIHtcbiAgICB0aGlzLl92YWxpZGF0ZV9hZGRyZXNzKGFkZHIpO1xuICAgIHJldHVybiAoKHRoaXMuZGF0YVthZGRyXSAmIDB4ZmYpIDw8IDgpIHwgKHRoaXMuZGF0YVthZGRyKzFdICYgMHhmZik7IC8vIFRPRE86ICsxID09IGdwZiA/XG4gIH1cblxuICB3cml0ZUJ5dGUoYWRkciwgZGF0YSlcbiAge1xuICAgIHRoaXMuX3ZhbGlkYXRlX2FkZHJlc3MoYWRkcik7XG4gICAgdGhpcy5kYXRhW2FkZHJdID0gZGF0YTtcbiAgfVxuXG4gIHdyaXRlV29yZChhZGRyLCBkYXRhKVxuICB7XG4gICAgdGhpcy5fdmFsaWRhdGVfYWRkcmVzcyhhZGRyKTtcbiAgICB0aGlzLmRhdGFbYWRkcl0gPSAoKGRhdGEgPj4gOCkgJiAweGZmKTtcbiAgICB0aGlzLmRhdGFbYWRkcisxXSA9IChkYXRhICYgMHhmZik7XG4gIH1cblxuICBibGl0KHR5cGVkQXJyYXksIHRvQWRkcilcbiAge1xuICAgIC8vIEJ5cGFzcyBhZGRyZXNzIHZhbGlkYXRpb24gaGVyZSBzbyB3ZSBjYW4gYmxpdCB0aGUgYmlvcyBpbnRvIHBsYWNlXG4gICAgdGhpcy5kYXRhLnNldCh0eXBlZEFycmF5LCB0b0FkZHIpO1xuICB9XG5cbiAgX3ZhbGlkYXRlX2FkZHJlc3MoYWRkcilcbiAge1xuICAgIGlmIChhZGRyIDwgMHgyMDApXG4gICAge1xuICAgICAgdGhpcy5lbWl0KCdncGYnLCB7ZXJyb3I6IGBJbGxlZ2FsIGFkZHJlc3M6IDB4JHthZGRyLnRvU3RyaW5nKDE2KX1gfSk7XG4gICAgfVxuXG4gICAgaWYgKGFkZHIgPj0gMHgxMDAwKVxuICAgIHtcbiAgICAgIHRoaXMuZW1pdCgnZ3BmJywge2Vycm9yOiBgSWxsZWdhbCBhZGRyZXNzOiAweCR7YWRkci50b1N0cmluZygxNil9YH0pO1xuICAgIH1cbiAgfVxuXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zeXN0ZW0vcmFtLmpzIiwiXG5pbXBvcnQgQmFzZSAgIGZyb20gJy4uL3V0aWwvYmFzZSc7XG5pbXBvcnQgbG9nICAgIGZyb20gJ2xvZ2xldmVsJztcblxuY29uc3QgV0lEVEggPSA2NCwgSEVJR0hUID0gMzI7XG5jb25zdCBTUFJJVEVfV0lEVEggPSA4O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHRlggZXh0ZW5kcyBCYXNlXG57XG4gIGNvbnN0cnVjdG9yKHJhbSlcbiAge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fZGlzcGxheSA9IG5ldyBBcnJheUJ1ZmZlciAoV0lEVEggKiBIRUlHSFQpO1xuICAgIHRoaXMuZGlzcGxheSA9IG5ldyBVaW50OEFycmF5KHRoaXMuX2Rpc3BsYXkpO1xuICAgIHRoaXMucmFtID0gcmFtO1xuXG4gIH1cblxuICBzaXplKClcbiAge1xuICAgIHJldHVybiB7d2lkdGg6IFdJRFRILCBoZWlnaHQ6IEhFSUdIVH07XG4gIH1cblxuICBkcmF3KGksIHN4LCBzeSwgaGVpZ2h0KVxuICB7XG4gICAgbGV0IG8gPSAoc3kgKiBXSURUSCkgKyBzeDsgICAgLy8gYWRkcmVzcyBvZiBkaXNwbGF5IGNvb3Jkc1xuICAgIGxldCBkID0gKFdJRFRIIC0gU1BSSVRFX1dJRFRIKTsgLy8gb2Zmc2V0IGRlbHRhIGluY3JlbWVudFxuICAgIGxldCBzID0gaTsgICAgICAgICAgICAgICAgICAgIC8vIGFkZHJlc3Mgb2Ygc3ByaXRlIGluIFJBTVxuICAgIGxldCBjb2xsaXNpb24gPSAwO1xuXG4gICAgLy9jb25zb2xlLmxvZyhgRHJhd2luZyBzcHJpdGUgYXQgJHtzeH0sICR7c3l9LCBvZmZzZXQgPSAke299YCk7XG5cbiAgICBmb3IgKGxldCB5PTA7IHk8aGVpZ2h0OyB5KyspXG4gICAge1xuICAgICAgbGV0IGJpdF9yb3cgPSB0aGlzLnJhbVtzKytdO1xuICAgICAgbGV0IHBpeGVsLCB4b3JfcGl4ZWw7XG4gICAgICBmb3IgKGxldCB4PVNQUklURV9XSURUSC0xOyB4Pj0wOyB4LS0pXG4gICAgICB7XG4gICAgICAgIHBpeGVsID0gKChiaXRfcm93ID4+IHgpICYgMHgxKTsgICAgLy9UT0RPOiAqTVVTVCogYmUgYSBzbWFydGVyIHdheSB0byB3cml0ZSB0aGlzISFcbiAgICAgICAgeG9yX3BpeGVsID0gdGhpcy5kaXNwbGF5W29dIF4gcGl4ZWw7XG4gICAgICAgIHRoaXMuZGlzcGxheVtvKytdID0geG9yX3BpeGVsO1xuICAgICAgICBpZiAoKHhvcl9waXhlbCE9cGl4ZWwpICYmIHhvcl9waXhlbCA9PSAwKSBjb2xsaXNpb24gPSAxO1xuICAgICAgfVxuICAgICAgbyArPSBkO1xuICAgIH1cblxuICAgIC8vIGJlbG93LCBkZWJ1Zywgd3JpdGUgb3V0IGNvbnRlbnRzIG9mIGRpc3BsYXkgdG8gY29uc29sZSBpbiBhIHdpZCAqIGhlaSBncmlkXG4gICAgLy8gZm9yICh2YXIgeT0wOyB5PEhFSUdIVDsgeSsrKVxuICAgIC8vIHtcbiAgICAvLyAgIHZhciBzdCA9IFwiXCI7XG4gICAgLy8gICBpZiAoeSA8IDEwKSBzdCArPSBcInkgMFwiK3krXCI6XCI7IGVsc2Ugc3QrPSBcInkgXCIreStcIjpcIjtcbiAgICAvLyAgIGZvciAodmFyIHg9MDsgeDxXSURUSDsgeCsrKVxuICAgIC8vICAge1xuICAgIC8vICAgICAgIHN0ICs9IHRoaXMuZGlzcGxheVsoeSAqIFdJRFRIKSt4XSA/IFwiMVwiIDogXCIwXCJcbiAgICAvLyAgIH1cbiAgICAvLyAgIGNvbnNvbGUubG9nKHN0KTtcbiAgICAvLyB9XG5cbiAgICB0aGlzLmZpcmUoJ2NoYW5nZWQnKTtcbiAgICBpZiAoY29sbGlzaW9uID09MSApIGxvZy5pbmZvKFwiKioqIENvbGxpc2lvbiEgKioqXCIpO1xuICAgIHJldHVybiBjb2xsaXNpb247XG4gIH1cblxuICAvLyBfc2V0X3BpeGVsKHgsIHksIHYpXG4gIC8vIHtcbiAgLy8gICBsZXQgb2ZmcyA9ICh5KldJRFRIKSt4O1xuICAvLyAgIHRoaXMuZGlzcGxheVtvZmZzXSA9IHY7XG4gIC8vIH1cblxuICBjbGVhcigpXG4gIHtcbiAgICB0aGlzLmRpc3BsYXkuZmlsbCgwKTtcbiAgICB0aGlzLmZpcmUoJ2NoYW5nZWQnKTtcbiAgfVxuXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zeXN0ZW0vZ2Z4LmpzIiwiXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaXNhc3NlbWJsZXJcbntcbiAgY29uc3RydWN0b3IoKVxuICB7XG4gIH1cblxuICBkZWNvZGUoaW5zdHIpXG4gIHtcbiAgICBsZXQgbGlzdCA9IEFycmF5LmlzQXJyYXkoaW5zdHIpID8gaW5zdHIgOiBbaW5zdHJdO1xuICAgIGxldCBvdXQgPSBbXTtcblxuICAgIGZvciAobGV0IGkgb2YgbGlzdClcbiAgICB7XG4gICAgICBsZXQgZCA9IHRoaXMuX2RlY29kZV9zaW5nbGUoaSk7XG4gICAgICBkLmkgPSBgMHgke2hleChpKX1gO1xuICAgICAgb3V0LnB1c2goZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dC5sZW5ndGggPT0gMSA/IG91dFswXSA6IG91dDtcbiAgfVxuXG4gIGV4cGxvZGUoaW5zdHJfZGF0YSwgZnJvbV9pbnN0ciwgc2l6ZSlcbiAge1xuICAgIGxldCB0b19kZWNvZGUgPSBbXTtcbiAgICBmb3IgKGxldCB0PWZyb21faW5zdHItKHNpemUqMik7IHQ8PWZyb21faW5zdHIrKHNpemUqMik7IHQrPTIpXG4gICAge1xuICAgICAgdG9fZGVjb2RlLnB1c2goaW5zdHJfZGF0YS5yZWFkV29yZCh0KSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmRlY29kZSh0b19kZWNvZGUpO1xuICB9XG5cbiAgX2RlY29kZV9zaW5nbGUoaW5zdHIpXG4gIHtcbiAgICAgIGxldCBtYWpvciA9IChpbnN0ciA+PiAxMikgJiAweGY7XG4gICAgICBsZXQgbWlub3IgPSBpbnN0ciAmIDB4ZmZmO1xuXG4gICAgICAvLyBlLmcuIDVYWTA6IGpycSB2eCwgdnlcbiAgICAgIGxldCBtaW4wID0gKG1pbm9yID4+IDgpICYgMHhmOyAgLy8gWFxuICAgICAgbGV0IG1pbjEgPSAobWlub3IgPj4gNCkgJiAweGY7ICAvLyBZXG4gICAgICBsZXQgbWluMiA9IG1pbm9yICYgMHhmOyAgICAgICAgIC8vIDBcbiAgICAgIGxldCBtaW4xMiA9IG1pbm9yICYgMHhmZjsgICAgICAgLy8gWTBcblxuICAgICAgc3dpdGNoKG1ham9yKVxuICAgICAge1xuICAgICAgICBjYXNlIDB4MDpcbiAgICAgICAgICBzd2l0Y2gobWlub3IpXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2FzZSAweGUwOiByZXR1cm4ge206IFwiY2xzXCIsIGQ6XCJDbGVhciBzY3JlZW5cIn07IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAweGVlOiByZXR1cm4ge206IFwicmV0XCIsIGQ6XCJSZXR1cm4gZnJvbSBzdWJyb3V0aW5lIFtzdGFja11cIn07IGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDogcmV0dXJuIHttOiBgc3lzICR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGQ6XCJKdW1wIHRvIHJvdXRpbmUgYXQgYWRkcmVzcyBbbGVnYWN5OyBpZ25vcmVkIGJ5IGludGVycHJldGVyXVwifTticmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHgxOiByZXR1cm4ge206IGBqbXAgMHgke2hleChtaW5vcil9YCwgZDpcIkp1bXAgdG8gYWRkcmVzc1wifTsgICAgICAgICAgICAgLy8gMW5ublxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4MjogcmV0dXJuIHttOiBgY2FsbCAweCR7aGV4KG1pbm9yKX1gLCBkOlwiQ2FsbCBzdWJyb3V0aW5lIFtzdGFja11cIn07ICAgICAgICAgICAgLy8gMm5ublxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4MzogcmV0dXJuIHttOiBgamVxIHYke2hleChtaW4wKX0sICR7bWluMTJ9YCwgZDpcIkp1bXAgb3ZlciBuZXh0IGluc3RydWN0aW9uIGlmIG9wZXJhbmRzIGVxdWFsXCJ9OyAgIC8vIDN4bm5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweDQ6IHJldHVybiB7bTogYGpucSB2JHtoZXgobWluMCl9LCAke21pbjEyfWAsIGQ6XCJKdW1wIG92ZXIgbmV4dCBpbnN0cnVjdGlvbiBpZiBvcGVyYW5kcyBub3QgZXF1YWxcIn07ICAgLy8gNHhublxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4NTogcmV0dXJuIHttOiBganJlIHYke2hleChtaW4wKX0sIHYke2hleChtaW4xKX1gLCBkOlwiSnVtcCBvdmVyIG5leHQgaW5zdHJ1Y3Rpb24gaWYgcmVnaXN0ZXJzIGVxdWFsXCJ9Oy8vIDV4eTBcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweDY6IHJldHVybiB7bTogYG1vdiB2JHtoZXgobWluMCl9LCAke21pbjEyfWAsIGQ6XCJNb3ZlIGNvbnN0YW50IGludG8gcmVnaXN0ZXJcIn07OyAgIC8vIDZ4bm5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweDc6IHJldHVybiB7bTogYGFkZCB2JHtoZXgobWluMCl9LCAke21pbjEyfWAsIGQ6XCJBZGQgY29uc3RhbnQgdG8gcmVnaXN0ZXJcIn07OyAgIC8vIDd4bm5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweDg6XG4gICAgICAgICAgc3dpdGNoIChtaW4yKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNhc2UgMHgwOiByZXR1cm4ge206IGBtb3YgdiR7aGV4KG1pbjApfSwgdiR7aGV4KG1pbjEpfWAsIGQ6IFwiTW92ZSByZWdpc3RlciBpbnRvIHJlZ2lzdGVyXCJ9OyBicmVhazsgICAvLyA4eHkwXG4gICAgICAgICAgICBjYXNlIDB4MTogcmV0dXJuIHttOiBgb3IgdiR7aGV4KG1pbjApfSwgdiR7aGV4KG1pbjEpfWAsIGQ6IFwiT1IgcmVnaXN0ZXIgd2l0aCByZWdpc3RlclwifTsgYnJlYWs7ICAgIC8vIDh4eTFcbiAgICAgICAgICAgIGNhc2UgMHgyOiByZXR1cm4ge206IGBhbmQgdiR7aGV4KG1pbjApfSwgdiR7aGV4KG1pbjEpfWAsIGQ6IFwiQU5EIHJlZ2lzdGVyIHdpdGggcmVnaXN0ZXJcIn07IGJyZWFrOyAgIC8vIDh4eTJcbiAgICAgICAgICAgIGNhc2UgMHgzOiByZXR1cm4ge206IGB4b3IgdiR7aGV4KG1pbjApfSwgdiR7aGV4KG1pbjEpfWAsIGQ6IFwiWE9SIHJlZ2lzdGVyIHdpdGggcmVnaXN0ZXJcIn07IGJyZWFrOyAgIC8vIDh4eTJcbiAgICAgICAgICAgIGNhc2UgMHg0OiByZXR1cm4ge206IGBhZGQgdiR7aGV4KG1pbjApfSwgdiR7aGV4KG1pbjEpfWAsIGQ6IFwiQWRkIHJlZ2lzdGVyIHRvIHJlZ2lzdGVyXCJ9OyBicmVhazsgICAvLyA4eHk0XG4gICAgICAgICAgICBjYXNlIDB4NTogcmV0dXJuIHttOiBgc3ViIHYke2hleChtaW4wKX0sIHYke2hleChtaW4xKX1gLCBkOiBcIlN1YnRyYWN0IHJlZ2lzdGVyIGZyb20gcmVnaXN0ZXJcIn07IGJyZWFrOyAgIC8vIDh4eTVcbiAgICAgICAgICAgIGNhc2UgMHg2OiByZXR1cm4ge206IGBzaHIgdiR7aGV4KG1pbjApfWAsIGQ6IFwiU2hpZnQgcmlnaHQgcmVnaXN0ZXJcIn07IGJyZWFrOyAgICAgICAgICAgICAgICAgIC8vIDh4MDZcbiAgICAgICAgICAgIGNhc2UgMHg3OiByZXR1cm4ge206IGByc2IgdiR7aGV4KG1pbjApfSwgdiR7aGV4KG1pbjEpfWAsIGQ6IFwiUmV2ZXJzZSBzdWJ0cmFjdCByZWdpc3RlciBmcm9tIHJlZ2lzdGVyXCJ9OyBicmVhazsgICAvLyA4eHk3XG4gICAgICAgICAgICBjYXNlIDB4ZTogcmV0dXJuIHttOiBgc2hsIHYke2hleChtaW4wKX1gLCBkOiBcIlNoaWZ0IGxlZnQgcmVnaXN0ZXJcIn07IGJyZWFrOyAgICAgICAgICAgICAgICAgIC8vIDh4MGVcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHg5OiByZXR1cm4ge206IGBqcm4gdiR7aGV4KG1pbjApfSwgdiR7aGV4KG1pbjEpfWAsIGQ6IFwiSnVtcCBvdmVyIG5leHQgaW5zdHJ1Y3Rpb24gaWYgcmVnaXN0ZXIgbm90IGVxdWFsXCJ9OyAgICAgICAgICAgICAvLyA5eHkwXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHhBOiByZXR1cm4ge206IGBtb3YgaSwgJHttaW5vcn1gLCBkOlwiTW92ZSBjb25zdGFudCBpbnRvIEluZGV4IHJlZ2lzdGVyXCJ9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4QjogcmV0dXJuIHttOiBganJsIDB4JHtoZXgobWlub3IpfWAsIGQ6XCJKdW1wIHRvIGFkZHJlc3MgZ2l2ZW4gYnkgY29uc3RhbnQgKyB2MCByZWdpc3RlclwifVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4QzogcmV0dXJuIHttOiBgcm5kIHYke2hleChtaW4wKX0sIDB4JHtoZXgobWluMTIpfWAsIGQ6XCJSYW5kb20gbnVtYmVyIEFORCB3aXRoIGNvbnN0YW50IGludG8gcmVnaXN0ZXJcIn1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweEQ6IHJldHVybiB7bTogYGRydyB2JHtoZXgobWluMCl9LCB2JHtoZXgobWluMSl9LCAkeyhtaW4yKX1gLCBkOlwiRHJhdyBzcHJpdGUgYXQgcmVnaXN0ZXJzIGxvY2F0aW9uIG9mIHNpemUgY29uc3RhbnRcIn1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweEU6XG4gICAgICAgICAgc3dpdGNoKG1pbjEyKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNhc2UgMHg5RTogcmV0dXJuIHttOiBgamtwIHYke2hleChtaW4wKX1gLCBkOlwiSnVtcCBpZiBrZXkgY29kZSBpbiByZWdpc3RlciBwcmVzc2VkXCJ9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAweEExOiByZXR1cm4ge206IGBqa24gdiR7aGV4KG1pbjApfWAsIGQ6XCJKdW1wIGlmIGtleSBjb2RlIGluIHJlZ2lzdGVyIG5vdCBwcmVzc2VkXCJ9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweEY6XG4gICAgICAgICAgc3dpdGNoKG1pbjEyKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNhc2UgMHgwNzogcmV0dXJuIHttOiBgbGR0IHYke2hleChtaW4wKX1gLCBkOlwiTG9hZCBkZWxheSB0aW1lciB2YWx1ZSBpbnRvIHJlZ2lzdGVyXCJ9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAweDBBOiByZXR1cm4ge206IGB3YWl0IHYke2hleChtaW4wKX1gLCBkOlwiV2FpdCBmb3IgYSBrZXkgcHJlc3MsIHN0b3JlIGtleSBpbiByZWdpc3RlclwifVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMHgxNTogcmV0dXJuIHttOiBgc2R0IHYke2hleChtaW4wKX1gLCBkOlwiU2V0IGRlbGF5IHRpbWVyIGZyb20gcmVnaXN0ZXJcIn1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDB4MTg6IHJldHVybiB7bTogYHNzdCB2JHtoZXgobWluMCl9YCwgZDpcIlNldCBzb3VuZCB0aW1lciBmcm9tIHJlZ2lzdGVyXCJ9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAweDFFOiByZXR1cm4ge206IGBhZGkgdiR7aGV4KG1pbjApfWAsIGQ6XCJBZGQgcmVnaXN0ZXIgdmFsdWUgdG8gSW5kZXggcmVnaXN0ZXJcIn1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDB4Mjk6IHJldHVybiB7bTogYGxkaSB2JHtoZXgobWluMCl9YCwgZDpcIkxvYWQgSW5kZXggcmVnaXN0ZXIgd2l0aCBzcHJpdGUgYWRkcmVzcyBvZiBkaWdpdCBpbiByZWdpc3RlclwifVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMHgzMzogcmV0dXJuIHttOiBgYmNkIHYke2hleChtaW4wKX1gLCBkOlwiU3RvcmUgQkNEIG9mIHJlZ2lzdGVyIHN0YXJ0aW5nIGF0IGJhc2UgYWRkcmVzcyBJbmRleFwifVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMHg1NTogcmV0dXJuIHttOiBgc3RyIHYke2hleChtaW4wKX1gLCBkOlwiU3RvcmUgcmVnaXN0ZXJzIGZyb20gdjAgdG8gcmVnaXN0ZXIgb3BlcmFuZCBhdCBiYXNlIGFkZHJlc3MgSW5kZXhcIn1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDB4NjU6IHJldHVybiB7bTogYGxkciB2JHtoZXgobWluMCl9YCwgZDpcIlNldCByZWdpc3RlcnMgZnJvbSB2MCB0byByZWdpc3RlciBvcGVyYW5kIHdpdGggdmFsdWVzIGZyb20gYmFzZSBhZGRyZXNzIEluZGV4XCJ9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiB7bTpgVW5rbm93biBvcGNvZGUgJHtoZXgoaW5zdHIpfWAsIGQ6XCJVbmtub3duL2lsbGVnYWwgaW5zdHJ1Y3Rpb25cIn07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBoZXgobikgeyByZXR1cm4gbi50b1N0cmluZygxNik7IH1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3N5c3RlbS9kaXNhc20uanMiXSwic291cmNlUm9vdCI6IiJ9