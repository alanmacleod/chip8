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
	
	var _cpu = __webpack_require__(4);
	
	var _cpu2 = _interopRequireDefault(_cpu);
	
	var _ram = __webpack_require__(12);
	
	var _ram2 = _interopRequireDefault(_ram);
	
	var _loader = __webpack_require__(13);
	
	var _loader2 = _interopRequireDefault(_loader);
	
	var _gfx = __webpack_require__(14);
	
	var _gfx2 = _interopRequireDefault(_gfx);
	
	var _loglevel = __webpack_require__(5);
	
	var _loglevel2 = _interopRequireDefault(_loglevel);
	
	var _input = __webpack_require__(15);
	
	var _input2 = _interopRequireDefault(_input);
	
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
	
	    _this.cycles = 50;
	
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
	      for (var t = 0; t < this.cycles; t++) {
	        if (!this._executing) return;
	        this.cpu.execute(this.cpu.decode(this.cpu.fetch()));
	      }
	    }
	  }, {
	    key: 'poweron',
	    value: function poweron() {
	      this._executing = true;
	      this.cycleTimer = setInterval(this.cycle.bind(this), 1000 / (60 * 2));
	    }
	  }, {
	    key: 'halt',
	    value: function halt() {
	      _loglevel2.default.warn("Halting execution...");
	      this._executing = false;
	      clearInterval(this.cycleTimer);
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
	
	      this.cpu.on('opcode', function (data) {
	        this.halt();
	        self.postMessage({
	          action: 'error',
	          args: {
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
	        case 'halt':
	          this.halt();
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
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _loglevel = __webpack_require__(5);
	
	var _loglevel2 = _interopRequireDefault(_loglevel);
	
	var _base = __webpack_require__(2);
	
	var _base2 = _interopRequireDefault(_base);
	
	var _opcodes = __webpack_require__(6);
	
	var _timerDelay = __webpack_require__(11);
	
	var _timerDelay2 = _interopRequireDefault(_timerDelay);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var WORD_SIZE = 2; // 16-bit instruction
	var IP_INIT = 0x200; // = 512. Bytes 0-511 reserved for built-in interpreter
	var TRACE_BUFFER_SIZE = 10; // store last 10 instructions
	
	var CPU = function (_Base) {
	  _inherits(CPU, _Base);
	
	  function CPU(gfx, ram) {
	    _classCallCheck(this, CPU);
	
	    var _this = _possibleConstructorReturn(this, (CPU.__proto__ || Object.getPrototypeOf(CPU)).call(this));
	
	    _this._this = "CPU"; // for context debugging
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
	      vf: 0,
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
	      var _ref = [new Array(16).fill(0), 0, 0, IP_INIT, 0];
	      r.v = _ref[0];
	      r.i = _ref[1];
	      r.vf = _ref[2];
	      r._ip = _ref[3];
	      r._sp = _ref[4];
	    }
	  }, {
	    key: 'next',
	    value: function next() {
	      this.reg._ip += WORD_SIZE;
	    }
	  }, {
	    key: 'fetch',
	    value: function fetch() {
	      //if (!this._executing) return 0;
	      return this.ram.readWord(this.reg.ip);
	    }
	  }, {
	    key: 'decode',
	    value: function decode(instr) {
	      //if (!this._executing) return 0;
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
	
	      //if (!this._executing) return 0;
	      if (!this.exec[major].call(this, { major: major, minor: minor })) this.next();
	    }
	
	    // I am particularly pleased with this looped buffer solution
	    // to record a window/snapshot of a data-stream of infinite (unknown) length
	
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
	      //console.log("cpu this = ",this);
	      var ip = this._trace_ptr;
	      for (var p = 0; p < TRACE_BUFFER_SIZE; p++) {
	        //trace_unrolled.push(this._trace[ip])
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
	      //console.log(this._trace);
	      return this._unroll_trace_loop();
	    }
	  }, {
	    key: 'dump_registers',
	    value: function dump_registers() {
	      //log.debug("== CPU REGISTER DUMP ==")
	      //log.debug(this.reg);
	      return this.reg;
	    }
	  }]);
	
	  return CPU;
	}(_base2.default);
	
	exports.default = CPU;

/***/ },
/* 5 */
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.opcodes = undefined;
	
	var _loglevel = __webpack_require__(5);
	
	var _loglevel2 = _interopRequireDefault(_loglevel);
	
	var _opcode0x = __webpack_require__(7);
	
	var _opcode0x2 = __webpack_require__(8);
	
	var _opcode0xE = __webpack_require__(9);
	
	var _opcode0xF = __webpack_require__(10);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
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
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
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
	
	  this.reg.v[minor >> 8 & 0xf] += minor & 0xff;
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
	  r.vf = this.gfx.draw(r.i, r.v[m >> 8 & 0xf], r.v[m >> 4 & 0xf], m & 0xf);
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.$_instr_0x0 = undefined;
	
	var _loglevel = __webpack_require__(5);
	
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
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var $_instr_0x8 = [];
	
	$_instr_0x8[0x0] = function (_ref) {
	  var major = _ref.major,
	      minor = _ref.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
	};
	$_instr_0x8[0x1] = function (_ref2) {
	  var major = _ref2.major,
	      minor = _ref2.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
	};
	$_instr_0x8[0x2] = function (_ref3) {
	  var major = _ref3.major,
	      minor = _ref3.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
	};
	$_instr_0x8[0x3] = function (_ref4) {
	  var major = _ref4.major,
	      minor = _ref4.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
	};
	$_instr_0x8[0x4] = function (_ref5) {
	  var major = _ref5.major,
	      minor = _ref5.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
	};
	$_instr_0x8[0x5] = function (_ref6) {
	  var major = _ref6.major,
	      minor = _ref6.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.$_instr_0xE = undefined;
	
	var _loglevel = __webpack_require__(5);
	
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.$_instr_0xF = undefined;
	
	var _loglevel = __webpack_require__(5);
	
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
	  var major = _ref4.major,
	      minor = _ref4.minor;
	
	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + ':' + minor.toString(16), address: this.reg.ip });
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
	
	  var v = this.reg[minor >> 8 & 0xf];
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
/* 11 */
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
/* 12 */
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
/* 13 */
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
	          if (xor_pixel != pixel) collision = 1;
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _loglevel = __webpack_require__(5);
	
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

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMWM5NjJjZWNlY2MyMjNmNmIwMDMiLCJ3ZWJwYWNrOi8vLy4vY2hpcDgtd29ya2VyLmpzIiwid2VicGFjazovLy8uL2NoaXA4LmpzIiwid2VicGFjazovLy8uL3V0aWwvYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi91dGlsL2V2ZW50LmpzIiwid2VicGFjazovLy8uL3N5c3RlbS9jcHUvY3B1LmpzIiwid2VicGFjazovLy8uL34vbG9nbGV2ZWwvbGliL2xvZ2xldmVsLmpzIiwid2VicGFjazovLy8uL3N5c3RlbS9jcHUvb3Bjb2Rlcy5qcyIsIndlYnBhY2s6Ly8vLi9zeXN0ZW0vY3B1L29wY29kZS0weDAuanMiLCJ3ZWJwYWNrOi8vLy4vc3lzdGVtL2NwdS9vcGNvZGUtMHg4LmpzIiwid2VicGFjazovLy8uL3N5c3RlbS9jcHUvb3Bjb2RlLTB4RS5qcyIsIndlYnBhY2s6Ly8vLi9zeXN0ZW0vY3B1L29wY29kZS0weEYuanMiLCJ3ZWJwYWNrOi8vLy4vc3lzdGVtL3RpbWVyLWRlbGF5LmpzIiwid2VicGFjazovLy8uL3N5c3RlbS9yYW0uanMiLCJ3ZWJwYWNrOi8vLy4vdXRpbC9sb2FkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3lzdGVtL2dmeC5qcyIsIndlYnBhY2s6Ly8vLi9kb20vaW5wdXQuanMiXSwibmFtZXMiOlsiYyIsImxvYWQiLCJwb3dlcm9uIiwiQklPU19VUkwiLCJDaGlwOCIsInNldExldmVsIiwiY3ljbGVzIiwicmFtIiwiZ2Z4IiwiZGF0YSIsImNwdSIsImxvYWRlciIsImN5Y2xlVGltZXIiLCJfaW5pdEV2ZW50cyIsIl9yZXNldCIsIl9pbml0X2Jpb3MiLCJfZXhlY3V0aW5nIiwidCIsImV4ZWN1dGUiLCJkZWNvZGUiLCJmZXRjaCIsInNldEludGVydmFsIiwiY3ljbGUiLCJiaW5kIiwid2FybiIsImNsZWFySW50ZXJ2YWwiLCJ1cmwiLCJjYWxsYmFjayIsImRlYnVnIiwiaW5mbyIsInRpdGxlIiwiYnVmZmVyIiwiX2Jhc2U2NFRvQXJyYXlCdWZmZXIiLCJiaW5hcnkiLCJibGl0IiwiYmlvc19kYXRhIiwiYnl0ZXMiLCJiaW4iLCJzcGxpdCIsIl9kYXRhIiwiQXJyYXlCdWZmZXIiLCJsZW5ndGgiLCJVaW50OEFycmF5IiwicCIsImNoYXJsaW5lIiwicGFyc2VJbnQiLCJnZXRDaGFyQWRkckJJT1MiLCJiYXNlNjQiLCJiaW5hcnlfc3RyaW5nIiwic2VsZiIsImF0b2IiLCJsZW4iLCJpIiwiY2hhckNvZGVBdCIsInJlc2V0Iiwib24iLCJlbWl0IiwiaGFsdCIsInBvc3RNZXNzYWdlIiwiYWN0aW9uIiwiYXJncyIsInRyYWNlIiwicmVnaXN0ZXJzIiwiZHVtcF9yZWdpc3RlcnMiLCJhZGRyZXNzIiwicmVnIiwiaXAiLCJmcmFtZUJ1ZmZlciIsImRpc3BsYXkiLCJvbm1lc3NhZ2UiLCJtZXNzYWdlSGFuZGxlciIsIm1zZyIsImtleVN0YXRlIiwiZ2V0S2V5Ym9hcmRCdWZmZXJBZGRyZXNzIiwiQmFzZSIsIkV2ZW50RW1pdHRlciIsImxpc3RlbmVycyIsIk1hcCIsImFkZExpc3RlbmVyIiwiZmlyZSIsImxhYmVsIiwiZm4iLCJoYXMiLCJzZXQiLCJnZXQiLCJwdXNoIiwib2JqIiwiaW5kZXgiLCJyZWR1Y2UiLCJsaXN0ZW5lciIsIl9pc0Z1bmN0aW9uIiwic3BsaWNlIiwiZm9yRWFjaCIsIldPUkRfU0laRSIsIklQX0lOSVQiLCJUUkFDRV9CVUZGRVJfU0laRSIsIkNQVSIsIl90aGlzIiwia2V5U3RhdGVBZGRyIiwiX3RyYWNlIiwiQXJyYXkiLCJfdHJhY2VfcHRyIiwiZGVsYXlUaW1lciIsInYiLCJ2ZiIsIl9pcCIsIl9zcCIsInNwIiwic3RhY2siLCJleGVjIiwiciIsImZpbGwiLCJyZWFkV29yZCIsImluc3RyIiwibWFqb3IiLCJtaW5vciIsIl9hZGRfdG9fdHJhY2VfbG9vcCIsImNhbGwiLCJuZXh0IiwiYSIsInRyYWNlX3Vucm9sbGVkIiwicmV2ZXJzZSIsIl91bnJvbGxfdHJhY2VfbG9vcCIsIm9wY29kZXMiLCJlcnJvciIsInRvU3RyaW5nIiwicm5kIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwibSIsImRyYXciLCJNQVhfSU5TVFIiLCIkX2luc3RyXzB4MCIsImFkZHIiLCJwb3AiLCIkX2luc3RyXzB4OCIsIiRfaW5zdHJfMHhFIiwiJF9pbnN0cl8weEYiLCJ2YWwiLCJnZXRDaGFyU2l6ZUJJT1MiLCJ4IiwibXgiLCJGUkVRVUVOQ1kiLCJEZWxheVRpbWVyIiwiY291bnRlciIsIl90aW1lcklkIiwidmFsdWUiLCJfc3RhcnQiLCJfc3RvcCIsImludGVydmFsRnVuYyIsIkJJT1NfQ0hBUl9CQVNFX0FERFIiLCJCSU9TX0NIQVJfU0laRSIsIkJJT1NfTlVNX0NIQVJTIiwiQklPU19LRVlCX0JBU0VfQUREUiIsIlJBTSIsIl92YWxpZGF0ZV9hZGRyZXNzIiwidHlwZWRBcnJheSIsInRvQWRkciIsIkxvYWRlciIsInhtbGh0dHAiLCJYTUxIdHRwUmVxdWVzdCIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsInJlYWR5U3RhdGUiLCJzdGF0dXMiLCJqc29uIiwiSlNPTiIsInBhcnNlIiwicmVzcG9uc2VUZXh0Iiwib3BlbiIsInNlbmQiLCJXSURUSCIsIkhFSUdIVCIsIlNQUklURV9XSURUSCIsIkdGWCIsIl9kaXNwbGF5Iiwid2lkdGgiLCJoZWlnaHQiLCJzeCIsInN5IiwibyIsImQiLCJzIiwiY29sbGlzaW9uIiwieSIsImJpdF9yb3ciLCJwaXhlbCIsInhvcl9waXhlbCIsIklucHV0Iiwia2V5RGF0YSIsIl9jYWxsYmFjayIsImtleU1hcCIsIl9pbml0Iiwia2V5IiwiayIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiY29kZSIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsImtleUNvZGUiLCJ0b0xvd2VyQ2FzZSIsIl9zZXRLZXlEb3duIiwiX3NldEtleVVwIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0JBQXVCLHVCQUF1QjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVzs7QUFFWDtBQUNBO0FBQ0E7QUFDQSxzRUFBcUU7QUFDckUsWUFBVztBQUNYOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVc7O0FBRVg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTBDO0FBQzFDO0FBQ0EsZ0JBQWU7QUFDZjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXFCO0FBQ3JCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVztBQUNYO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FB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SSxLQUFFLENBQVgsRUFBY0EsS0FBRSxNQUFLSCxNQUFMLENBQVl0SixNQUE1QixFQUFvQ3lKLElBQXBDLEVBQ0E7QUFDRSxlQUFJLE1BQUtILE1BQUwsQ0FBWUcsRUFBWixLQUFrQkksSUFBdEIsRUFDRSxNQUFLSyxXQUFMLENBQWlCVCxFQUFqQjtBQUNIO0FBQ0Q7QUFDRCxRQVJELEVBUUcsSUFSSDs7QUFVQUMsY0FBT0MsZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsVUFBQ0MsQ0FBRCxFQUFPO0FBQ3RDO0FBQ0EsYUFBSUMsT0FBT0MsT0FBT0MsWUFBUCxDQUFvQkgsRUFBRUksT0FBdEIsRUFBK0JDLFdBQS9CLEdBQTZDckosVUFBN0MsQ0FBd0QsQ0FBeEQsQ0FBWDtBQUNBLGNBQUssSUFBSTZJLE1BQUUsQ0FBWCxFQUFjQSxNQUFFLE1BQUtILE1BQUwsQ0FBWXRKLE1BQTVCLEVBQW9DeUosS0FBcEMsRUFDQTtBQUNFLGVBQUksTUFBS0gsTUFBTCxDQUFZRyxHQUFaLEtBQWtCSSxJQUF0QixFQUNFLE1BQUtNLFNBQUwsQ0FBZVYsR0FBZjtBQUNIO0FBQ0YsUUFSRCxFQVFHLElBUkg7QUFVRDs7Ozs7O21CQXJFa0JOLEsiLCJmaWxlIjoiMWM5NjJjZWNlY2MyMjNmNmIwMDMud29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMWM5NjJjZWNlY2MyMjNmNmIwMDMiLCJpbXBvcnQgQ2hpcDggZnJvbSAnLi9jaGlwOCc7XG5cbmxldCBjID0gbmV3IENoaXA4KCk7XG5cbmMubG9hZCgncm9tLWpzb24vcG9uZy5qc29uJywgKCkgPT4geyAgICAvLyBpbnNlcnQgdGhlIGNhcnRyaWRnZS4uLlxuICAgIGMucG93ZXJvbigpOyAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN3aXRjaCBpdCBvbiA6KVxufSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9jaGlwOC13b3JrZXIuanMiLCJcbmltcG9ydCBCYXNlICAgICAgICAgICAgICAgZnJvbSAnLi91dGlsL2Jhc2UnO1xuaW1wb3J0IENQVSAgICAgICAgICAgICAgICBmcm9tICcuL3N5c3RlbS9jcHUvY3B1JztcbmltcG9ydCBSQU0gICAgICAgICAgICAgICAgZnJvbSAnLi9zeXN0ZW0vcmFtJztcbmltcG9ydCBMb2FkZXIgICAgICAgICAgICAgZnJvbSAnLi91dGlsL2xvYWRlcic7XG5pbXBvcnQgR0ZYICAgICAgICAgICAgICAgIGZyb20gJy4vc3lzdGVtL2dmeCc7XG5pbXBvcnQgbG9nICAgICAgICAgICAgICAgIGZyb20gJ2xvZ2xldmVsJztcbmltcG9ydCBJbnB1dCAgICAgICAgICAgICAgZnJvbSAnLi9kb20vaW5wdXQnO1xuXG5jb25zdCBCSU9TX1VSTCA9IFwiLi9iaW9zLmpzb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hpcDggZXh0ZW5kcyBCYXNlXG57XG4gIGNvbnN0cnVjdG9yKClcbiAge1xuICAgIHN1cGVyKCk7XG4gICAgbG9nLnNldExldmVsKCdkZWJ1ZycpO1xuXG4gICAgdGhpcy5jeWNsZXMgPSA1MDtcblxuICAgIHRoaXMucmFtID0gbmV3IFJBTSgpO1xuICAgIHRoaXMuZ2Z4ID0gbmV3IEdGWCh0aGlzLnJhbS5kYXRhKTtcbiAgICB0aGlzLmNwdSA9IG5ldyBDUFUodGhpcy5nZngsIHRoaXMucmFtKTtcblxuICAgIHRoaXMubG9hZGVyID0gbmV3IExvYWRlcigpO1xuICAgIHRoaXMuY3ljbGVUaW1lciA9IG51bGw7XG5cbiAgICB0aGlzLl9pbml0RXZlbnRzKCk7XG4gICAgdGhpcy5fcmVzZXQoKTtcbiAgICB0aGlzLl9pbml0X2Jpb3MoKTtcbiAgICB0aGlzLl9leGVjdXRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIGN5Y2xlKClcbiAge1xuICAgIGZvciAobGV0IHQ9MDsgdDx0aGlzLmN5Y2xlczsgdCsrKVxuICAgIHtcbiAgICAgIGlmICghdGhpcy5fZXhlY3V0aW5nKSByZXR1cm47XG4gICAgICB0aGlzLmNwdS5leGVjdXRlKFxuICAgICAgICB0aGlzLmNwdS5kZWNvZGUoXG4gICAgICAgICAgdGhpcy5jcHUuZmV0Y2goKVxuICAgICAgICApXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgcG93ZXJvbigpXG4gIHtcbiAgICB0aGlzLl9leGVjdXRpbmcgPSB0cnVlO1xuICAgIHRoaXMuY3ljbGVUaW1lciA9IHNldEludGVydmFsKCh0aGlzLmN5Y2xlKS5iaW5kKHRoaXMpLCAxMDAwLyg2MCoyKSk7XG4gIH1cblxuICBoYWx0KClcbiAge1xuICAgIGxvZy53YXJuKFwiSGFsdGluZyBleGVjdXRpb24uLi5cIik7XG4gICAgdGhpcy5fZXhlY3V0aW5nID0gZmFsc2U7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLmN5Y2xlVGltZXIpO1xuICB9XG5cbiAgbG9hZCh1cmwsIGNhbGxiYWNrKVxuICB7XG4gICAgbG9nLmRlYnVnKGBGZXRjaGluZzogJyR7dXJsfSdgKTtcblxuICAgIHRoaXMubG9hZGVyLmxvYWQodXJsLCAoZGF0YSkgPT4ge1xuICAgICAgbG9nLmluZm8oYE9wZW5pbmcgdGl0bGUgJyR7ZGF0YS50aXRsZX0nYCk7XG5cbiAgICAgIGxldCBidWZmZXIgPSB0aGlzLl9iYXNlNjRUb0FycmF5QnVmZmVyKGRhdGEuYmluYXJ5KTtcbiAgICAgIHRoaXMucmFtLmJsaXQoYnVmZmVyLCA1MTIpO1xuXG4gICAgICBjYWxsYmFjaygpO1xuXG4gICAgfSk7XG4gIH1cblxuICBfaW5pdF9iaW9zKClcbiAge1xuICAgIC8vIExvYWQgdGhlIFwiQklPU1wiIGNoYXJhY3RlcnMgaW50byB0aGUgcHJvdGVjdGVkIGFyZWFcblxuICAgIHRoaXMubG9hZGVyLmxvYWQoQklPU19VUkwsIChiaW9zX2RhdGEpID0+IHtcblxuICAgICAgbGV0IGJ5dGVzID0gYmlvc19kYXRhLmJpbi5zcGxpdCgnLCcpO1xuICAgICAgbGV0IF9kYXRhID0gbmV3IEFycmF5QnVmZmVyKGJ5dGVzLmxlbmd0aCk7XG4gICAgICBsZXQgZGF0YSA9IG5ldyBVaW50OEFycmF5KF9kYXRhKTtcbiAgICAgIGxldCBwID0gMDtcblxuICAgICAgZm9yIChsZXQgY2hhcmxpbmUgb2YgYnl0ZXMpXG4gICAgICAgIGRhdGFbcCsrXSA9IChwYXJzZUludChcIjB4XCIrY2hhcmxpbmUsIDE2KSAmIDB4ZmYpO1xuXG4gICAgICB0aGlzLnJhbS5ibGl0KGRhdGEsIHRoaXMucmFtLmdldENoYXJBZGRyQklPUygpKTtcbiAgICB9KTtcblxuICB9XG5cbiAgX2Jhc2U2NFRvQXJyYXlCdWZmZXIoYmFzZTY0KVxuICB7XG4gICAgdmFyIGJpbmFyeV9zdHJpbmcgPSAgc2VsZi5hdG9iKGJhc2U2NCk7XG4gICAgdmFyIGxlbiA9IGJpbmFyeV9zdHJpbmcubGVuZ3RoO1xuXG4gICAgdmFyIGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoIGxlbiApO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICAgIGJ5dGVzW2ldID0gYmluYXJ5X3N0cmluZy5jaGFyQ29kZUF0KGkpO1xuXG4gICAgcmV0dXJuIGJ5dGVzO1xuICB9XG5cbiAgX3Jlc2V0KClcbiAge1xuICAgIHRoaXMuY3B1LnJlc2V0KCk7XG4gICAgdGhpcy5yYW0ucmVzZXQoKTtcbiAgfVxuXG4gIF9pbml0RXZlbnRzKClcbiAge1xuICAgIHRoaXMucmFtLm9uKCdncGYnLCAoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGRhdGEpO1xuICAgIH0pLmJpbmQodGhpcykpOyAvLyBPdmVycmlkZSAndGhpcycgdG8gdXNlIENoaXA4KCkgY29udGV4dCBpbnN0ZWFkIG9mIFJBTSgpJ3NcblxuICAgIHRoaXMuY3B1Lm9uKCdvcGNvZGUnLCAoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgdGhpcy5oYWx0KCk7XG4gICAgICBzZWxmLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgYWN0aW9uOiAnZXJyb3InLFxuICAgICAgICBhcmdzOntcbiAgICAgICAgICB0cmFjZTogdGhpcy5jcHUudHJhY2UoKSxcbiAgICAgICAgICByZWdpc3RlcnM6IHRoaXMuY3B1LmR1bXBfcmVnaXN0ZXJzKCksXG4gICAgICAgICAgYWRkcmVzczogdGhpcy5jcHUucmVnLmlwXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pLmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5nZngub24oJ2NoYW5nZWQnLCAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgIGFjdGlvbjogJ3JlbmRlcicsXG4gICAgICAgICAgYXJnczoge1xuICAgICAgICAgICAgZnJhbWVCdWZmZXI6IHRoaXMuZ2Z4LmRpc3BsYXlcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pLmJpbmQodGhpcykpO1xuXG4gICAgc2VsZi5vbm1lc3NhZ2UgPSAodGhpcy5tZXNzYWdlSGFuZGxlcikuYmluZCh0aGlzKTtcblxuICB9XG5cbiAgbWVzc2FnZUhhbmRsZXIobXNnKVxuICB7XG4gICAgc3dpdGNoKG1zZy5kYXRhLmFjdGlvbilcbiAgICB7XG4gICAgICBjYXNlICdpbnB1dCc6XG4gICAgICAgIHRoaXMucmFtLmJsaXQobXNnLmRhdGEuYXJncy5rZXlTdGF0ZSwgdGhpcy5yYW0uZ2V0S2V5Ym9hcmRCdWZmZXJBZGRyZXNzKCkpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2hhbHQnOlxuICAgICAgICB0aGlzLmhhbHQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cblxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vY2hpcDguanMiLCJcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnLi9ldmVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2UgZXh0ZW5kcyBFdmVudEVtaXR0ZXJcbntcblxuICBjb25zdHJ1Y3RvciAoKVxuICB7XG4gICAgc3VwZXIoKTtcblxuICB9XG5cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3V0aWwvYmFzZS5qcyIsIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudEVtaXR0ZXJcbntcbiAgY29uc3RydWN0b3IoKVxuICB7XG4gICAgdGhpcy5saXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5vbiA9IHRoaXMuYWRkTGlzdGVuZXI7XG4gICAgdGhpcy5maXJlID0gdGhpcy5lbWl0O1xuXG4gIH1cblxuICBhZGRMaXN0ZW5lcihsYWJlbCwgZm4pXG4gIHtcbiAgICB0aGlzLmxpc3RlbmVycy5oYXMobGFiZWwpIHx8IHRoaXMubGlzdGVuZXJzLnNldChsYWJlbCwgW10pO1xuICAgIHRoaXMubGlzdGVuZXJzLmdldChsYWJlbCkucHVzaChmbik7XG4gIH1cblxuICBfaXNGdW5jdGlvbihvYmopXG4gIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PSAnZnVuY3Rpb24nIHx8IGZhbHNlO1xuICB9XG5cbiAgcmVtb3ZlTGlzdGVuZXIobGFiZWwsIGZuKVxuICB7XG4gICAgbGV0IGxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzLmdldChsYWJlbCksXG4gICAgICAgIGluZGV4O1xuXG4gICAgaWYgKGxpc3RlbmVycyAmJiBsaXN0ZW5lcnMubGVuZ3RoKVxuICAgIHtcbiAgICAgICAgaW5kZXggPSBsaXN0ZW5lcnMucmVkdWNlKChpLCBsaXN0ZW5lciwgaW5kZXgpID0+IHtcbiAgICAgICAgICByZXR1cm4gKF9pc0Z1bmN0aW9uKGxpc3RlbmVyKSAmJiBsaXN0ZW5lciA9PT0gY2FsbGJhY2spID9cbiAgICAgICAgICAgIGkgPSBpbmRleCA6XG4gICAgICAgICAgICBpO1xuICAgICAgICB9LCAtMSk7XG5cbiAgICAgICAgaWYgKGluZGV4ID4gLTEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnMuc2V0KGxhYmVsLCBsaXN0ZW5lcnMpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZW1pdChsYWJlbCwgLi4uYXJncylcbiAge1xuICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVycy5nZXQobGFiZWwpO1xuICAgIGlmIChsaXN0ZW5lcnMgJiYgbGlzdGVuZXJzLmxlbmd0aClcbiAgICB7XG4gICAgICBsaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIpID0+IHtcbiAgICAgICAgbGlzdGVuZXIoLi4uYXJncylcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vdXRpbC9ldmVudC5qcyIsIlxuaW1wb3J0IGxvZyBmcm9tICdsb2dsZXZlbCc7XG5pbXBvcnQgQmFzZSBmcm9tICcuLi8uLi91dGlsL2Jhc2UnO1xuaW1wb3J0IHtvcGNvZGVzfSBmcm9tICcuL29wY29kZXMnO1xuXG5pbXBvcnQgRGVsYXlUaW1lciAgICAgICAgIGZyb20gJy4uL3RpbWVyLWRlbGF5JztcblxuY29uc3QgV09SRF9TSVpFID0gMjsgLy8gMTYtYml0IGluc3RydWN0aW9uXG5jb25zdCBJUF9JTklUID0gMHgyMDA7IC8vID0gNTEyLiBCeXRlcyAwLTUxMSByZXNlcnZlZCBmb3IgYnVpbHQtaW4gaW50ZXJwcmV0ZXJcbmNvbnN0IFRSQUNFX0JVRkZFUl9TSVpFID0gMTA7ICAvLyBzdG9yZSBsYXN0IDEwIGluc3RydWN0aW9uc1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDUFUgZXh0ZW5kcyBCYXNlXG57XG4gIGNvbnN0cnVjdG9yKGdmeCwgcmFtKVxuICB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl90aGlzID0gXCJDUFVcIjsgLy8gZm9yIGNvbnRleHQgZGVidWdnaW5nXG4gICAgdGhpcy5nZnggPSBnZng7XG4gICAgdGhpcy5yYW0gPSByYW07XG4gICAgdGhpcy5rZXlTdGF0ZUFkZHIgPSByYW0uZ2V0S2V5Ym9hcmRCdWZmZXJBZGRyZXNzKCk7XG4gICAgbG9nLmRlYnVnKFwiQ1BVIEluaXRpYWxpc2VkXCIpO1xuXG4gICAgdGhpcy5fdHJhY2UgPSBuZXcgQXJyYXkoVFJBQ0VfQlVGRkVSX1NJWkUpO1xuICAgIHRoaXMuX3RyYWNlX3B0ciA9IDA7XG5cbiAgICAvLyBJIGZlZWwgbGlrZSB0aGlzIHNob3VsZCBiZSBwYXJ0IG9mIHRoZSBDaGlwOCgpIG9iamVjdC9zeXN0ZW0gaW5zdGVhZCBvZlxuICAgIC8vIGluIGhlcmUgYnV0IHRoZSBkZWxheSB0aW1lciBhcHBlYXJzIHRvIGJlIG9ubHkgYWNjZXNzZWQgb3IgdXNlZCBkaXJlY3RseVxuICAgIC8vIGJ5IHRoZSBDUFUgc28gd2hhdGV2ZXJcbiAgICB0aGlzLmRlbGF5VGltZXIgPSBuZXcgRGVsYXlUaW1lcigpO1xuXG4gICAgdGhpcy5yZWcgPSB7XG4gICAgICB2OiBbXSxcbiAgICAgIGk6ICAwLFxuICAgICAgdmY6IDAsXG4gICAgICBfaXA6IDAsXG4gICAgICBfc3A6IDAsXG4gICAgICBnZXQgaXAoKSB7cmV0dXJuIHRoaXMuX2lwfSxcbiAgICAgIGdldCBzcCgpIHtyZXR1cm4gdGhpcy5fc3B9LFxuICAgIH07XG5cbiAgICB0aGlzLnN0YWNrID0gW11cbiAgICB0aGlzLmV4ZWMgPSBvcGNvZGVzO1xuICB9XG5cbiAgcmVzZXQoKVxuICB7XG4gICAgbGV0IHIgPSB0aGlzLnJlZztcbiAgICBbci52LCByLmksIHIudmYsIHIuX2lwLCByLl9zcF0gPSBbbmV3IEFycmF5KDE2KS5maWxsKDApLDAsMCxJUF9JTklULDBdO1xuICB9XG5cbiAgbmV4dCgpXG4gIHtcbiAgICB0aGlzLnJlZy5faXAgKz0gV09SRF9TSVpFO1xuICB9XG5cbiAgZmV0Y2goKVxuICB7XG4gICAgLy9pZiAoIXRoaXMuX2V4ZWN1dGluZykgcmV0dXJuIDA7XG4gICAgcmV0dXJuIHRoaXMucmFtLnJlYWRXb3JkKHRoaXMucmVnLmlwKTtcbiAgfVxuXG4gIGRlY29kZShpbnN0cilcbiAge1xuICAgIC8vaWYgKCF0aGlzLl9leGVjdXRpbmcpIHJldHVybiAwO1xuICAgIGxldCBpID0gaW5zdHIgJiAweGZmZmY7XG4gICAgbGV0IG1ham9yID0gKGkgJiAweGYwMDApID4+IDEyLFxuICAgICAgICBtaW5vciA9IGkgJiAweDBmZmY7XG5cbiAgICB0aGlzLl9hZGRfdG9fdHJhY2VfbG9vcChpbnN0ciwgdGhpcy5yZWcuaXApO1xuXG4gICAgcmV0dXJuIHttYWpvciwgbWlub3J9XG4gIH1cblxuICBleGVjdXRlKHttYWpvciwgbWlub3J9KVxuICB7XG4gICAgLy9pZiAoIXRoaXMuX2V4ZWN1dGluZykgcmV0dXJuIDA7XG4gICAgaWYgKCF0aGlzLmV4ZWNbbWFqb3JdLmNhbGwodGhpcywge21ham9yLCBtaW5vcn0pKVxuICAgICAgICB0aGlzLm5leHQoKTtcbiAgfVxuXG4gIC8vIEkgYW0gcGFydGljdWxhcmx5IHBsZWFzZWQgd2l0aCB0aGlzIGxvb3BlZCBidWZmZXIgc29sdXRpb25cbiAgLy8gdG8gcmVjb3JkIGEgd2luZG93L3NuYXBzaG90IG9mIGEgZGF0YS1zdHJlYW0gb2YgaW5maW5pdGUgKHVua25vd24pIGxlbmd0aFxuICBfYWRkX3RvX3RyYWNlX2xvb3AoaSxhKVxuICB7XG4gICAgdGhpcy5fdHJhY2VbdGhpcy5fdHJhY2VfcHRyKytdID0ge2ksIGF9XG4gICAgaWYgKHRoaXMuX3RyYWNlX3B0ciA9PSBUUkFDRV9CVUZGRVJfU0laRSlcbiAgICAgIHRoaXMuX3RyYWNlX3B0ciA9IDA7XG5cblxuICB9XG5cbiAgX3Vucm9sbF90cmFjZV9sb29wKClcbiAge1xuICAgIC8vIFNlcGFyYXRlIHRoZSBpbnN0cnVjdGlvbiBhbmQgYWRkcmVzcyBpbnRvIHNlcGFyYXRlXG4gICAgLy8gYXJyYXlzIGZvciBlYXNpZXIgcGFzc2luZyB0byB0aGUgZGlzYXNzZW1ibGVyXG4gICAgbGV0IHRyYWNlX3Vucm9sbGVkID0ge2k6W10sIGE6W119O1xuICAgIC8vY29uc29sZS5sb2coXCJjcHUgdGhpcyA9IFwiLHRoaXMpO1xuICAgIGxldCBpcCA9IHRoaXMuX3RyYWNlX3B0cjtcbiAgICBmb3IgKGxldCBwPTA7IHA8VFJBQ0VfQlVGRkVSX1NJWkU7IHArKylcbiAgICB7XG4gICAgICAvL3RyYWNlX3Vucm9sbGVkLnB1c2godGhpcy5fdHJhY2VbaXBdKVxuICAgICAgdHJhY2VfdW5yb2xsZWQuYS5wdXNoKHRoaXMuX3RyYWNlW2lwXS5hKTsgIC8vIGFkZHJlc3NcbiAgICAgIHRyYWNlX3Vucm9sbGVkLmkucHVzaCh0aGlzLl90cmFjZVtpcF0uaSkgICAvLyBpbnN0cnVjdGlvblxuICAgICAgaWYgKC0taXAgPCAwKSBpcCA9IFRSQUNFX0JVRkZFUl9TSVpFLTE7XG4gICAgfVxuXG4gICAgdHJhY2VfdW5yb2xsZWQuYS5yZXZlcnNlKCk7XG4gICAgdHJhY2VfdW5yb2xsZWQuaS5yZXZlcnNlKCk7XG4gICAgcmV0dXJuIHRyYWNlX3Vucm9sbGVkO1xuICB9XG5cbiAgdHJhY2UoKVxuICB7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLl90cmFjZSk7XG4gICAgcmV0dXJuIHRoaXMuX3Vucm9sbF90cmFjZV9sb29wKCk7XG4gIH1cblxuICBkdW1wX3JlZ2lzdGVycygpXG4gIHtcbiAgICAvL2xvZy5kZWJ1ZyhcIj09IENQVSBSRUdJU1RFUiBEVU1QID09XCIpXG4gICAgLy9sb2cuZGVidWcodGhpcy5yZWcpO1xuICAgIHJldHVybiB0aGlzLnJlZztcbiAgfVxuXG5cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3N5c3RlbS9jcHUvY3B1LmpzIiwiLypcbiogbG9nbGV2ZWwgLSBodHRwczovL2dpdGh1Yi5jb20vcGltdGVycnkvbG9nbGV2ZWxcbipcbiogQ29weXJpZ2h0IChjKSAyMDEzIFRpbSBQZXJyeVxuKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4qL1xuKGZ1bmN0aW9uIChyb290LCBkZWZpbml0aW9uKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoZGVmaW5pdGlvbik7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByb290LmxvZyA9IGRlZmluaXRpb24oKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgbm9vcCA9IGZ1bmN0aW9uKCkge307XG4gICAgdmFyIHVuZGVmaW5lZFR5cGUgPSBcInVuZGVmaW5lZFwiO1xuXG4gICAgZnVuY3Rpb24gcmVhbE1ldGhvZChtZXRob2ROYW1lKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uc29sZSA9PT0gdW5kZWZpbmVkVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBXZSBjYW4ndCBidWlsZCBhIHJlYWwgbWV0aG9kIHdpdGhvdXQgYSBjb25zb2xlIHRvIGxvZyB0b1xuICAgICAgICB9IGVsc2UgaWYgKGNvbnNvbGVbbWV0aG9kTmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGJpbmRNZXRob2QoY29uc29sZSwgbWV0aG9kTmFtZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY29uc29sZS5sb2cgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGJpbmRNZXRob2QoY29uc29sZSwgJ2xvZycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBiaW5kTWV0aG9kKG9iaiwgbWV0aG9kTmFtZSkge1xuICAgICAgICB2YXIgbWV0aG9kID0gb2JqW21ldGhvZE5hbWVdO1xuICAgICAgICBpZiAodHlwZW9mIG1ldGhvZC5iaW5kID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kLmJpbmQob2JqKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLmNhbGwobWV0aG9kLCBvYmopO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIC8vIE1pc3NpbmcgYmluZCBzaGltIG9yIElFOCArIE1vZGVybml6ciwgZmFsbGJhY2sgdG8gd3JhcHBpbmdcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuYXBwbHkobWV0aG9kLCBbb2JqLCBhcmd1bWVudHNdKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gdGhlc2UgcHJpdmF0ZSBmdW5jdGlvbnMgYWx3YXlzIG5lZWQgYHRoaXNgIHRvIGJlIHNldCBwcm9wZXJseVxuXG4gICAgZnVuY3Rpb24gZW5hYmxlTG9nZ2luZ1doZW5Db25zb2xlQXJyaXZlcyhtZXRob2ROYW1lLCBsZXZlbCwgbG9nZ2VyTmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSB1bmRlZmluZWRUeXBlKSB7XG4gICAgICAgICAgICAgICAgcmVwbGFjZUxvZ2dpbmdNZXRob2RzLmNhbGwodGhpcywgbGV2ZWwsIGxvZ2dlck5hbWUpO1xuICAgICAgICAgICAgICAgIHRoaXNbbWV0aG9kTmFtZV0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXBsYWNlTG9nZ2luZ01ldGhvZHMobGV2ZWwsIGxvZ2dlck5hbWUpIHtcbiAgICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsb2dNZXRob2RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbWV0aG9kTmFtZSA9IGxvZ01ldGhvZHNbaV07XG4gICAgICAgICAgICB0aGlzW21ldGhvZE5hbWVdID0gKGkgPCBsZXZlbCkgP1xuICAgICAgICAgICAgICAgIG5vb3AgOlxuICAgICAgICAgICAgICAgIHRoaXMubWV0aG9kRmFjdG9yeShtZXRob2ROYW1lLCBsZXZlbCwgbG9nZ2VyTmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWZhdWx0TWV0aG9kRmFjdG9yeShtZXRob2ROYW1lLCBsZXZlbCwgbG9nZ2VyTmFtZSkge1xuICAgICAgICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgICAgICByZXR1cm4gcmVhbE1ldGhvZChtZXRob2ROYW1lKSB8fFxuICAgICAgICAgICAgICAgZW5hYmxlTG9nZ2luZ1doZW5Db25zb2xlQXJyaXZlcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIHZhciBsb2dNZXRob2RzID0gW1xuICAgICAgICBcInRyYWNlXCIsXG4gICAgICAgIFwiZGVidWdcIixcbiAgICAgICAgXCJpbmZvXCIsXG4gICAgICAgIFwid2FyblwiLFxuICAgICAgICBcImVycm9yXCJcbiAgICBdO1xuXG4gICAgZnVuY3Rpb24gTG9nZ2VyKG5hbWUsIGRlZmF1bHRMZXZlbCwgZmFjdG9yeSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgdmFyIGN1cnJlbnRMZXZlbDtcbiAgICAgIHZhciBzdG9yYWdlS2V5ID0gXCJsb2dsZXZlbFwiO1xuICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgc3RvcmFnZUtleSArPSBcIjpcIiArIG5hbWU7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHBlcnNpc3RMZXZlbElmUG9zc2libGUobGV2ZWxOdW0pIHtcbiAgICAgICAgICB2YXIgbGV2ZWxOYW1lID0gKGxvZ01ldGhvZHNbbGV2ZWxOdW1dIHx8ICdzaWxlbnQnKS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICAgICAgLy8gVXNlIGxvY2FsU3RvcmFnZSBpZiBhdmFpbGFibGVcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlW3N0b3JhZ2VLZXldID0gbGV2ZWxOYW1lO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxuXG4gICAgICAgICAgLy8gVXNlIHNlc3Npb24gY29va2llIGFzIGZhbGxiYWNrXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LmNvb2tpZSA9XG4gICAgICAgICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KHN0b3JhZ2VLZXkpICsgXCI9XCIgKyBsZXZlbE5hbWUgKyBcIjtcIjtcbiAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGdldFBlcnNpc3RlZExldmVsKCkge1xuICAgICAgICAgIHZhciBzdG9yZWRMZXZlbDtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHN0b3JlZExldmVsID0gd2luZG93LmxvY2FsU3RvcmFnZVtzdG9yYWdlS2V5XTtcbiAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XG5cbiAgICAgICAgICBpZiAodHlwZW9mIHN0b3JlZExldmVsID09PSB1bmRlZmluZWRUeXBlKSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICB2YXIgY29va2llID0gd2luZG93LmRvY3VtZW50LmNvb2tpZTtcbiAgICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IGNvb2tpZS5pbmRleE9mKFxuICAgICAgICAgICAgICAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChzdG9yYWdlS2V5KSArIFwiPVwiKTtcbiAgICAgICAgICAgICAgICAgIGlmIChsb2NhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgIHN0b3JlZExldmVsID0gL14oW147XSspLy5leGVjKGNvb2tpZS5zbGljZShsb2NhdGlvbikpWzFdO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gSWYgdGhlIHN0b3JlZCBsZXZlbCBpcyBub3QgdmFsaWQsIHRyZWF0IGl0IGFzIGlmIG5vdGhpbmcgd2FzIHN0b3JlZC5cbiAgICAgICAgICBpZiAoc2VsZi5sZXZlbHNbc3RvcmVkTGV2ZWxdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHN0b3JlZExldmVsO1xuICAgICAgfVxuXG4gICAgICAvKlxuICAgICAgICpcbiAgICAgICAqIFB1YmxpYyBBUElcbiAgICAgICAqXG4gICAgICAgKi9cblxuICAgICAgc2VsZi5sZXZlbHMgPSB7IFwiVFJBQ0VcIjogMCwgXCJERUJVR1wiOiAxLCBcIklORk9cIjogMiwgXCJXQVJOXCI6IDMsXG4gICAgICAgICAgXCJFUlJPUlwiOiA0LCBcIlNJTEVOVFwiOiA1fTtcblxuICAgICAgc2VsZi5tZXRob2RGYWN0b3J5ID0gZmFjdG9yeSB8fCBkZWZhdWx0TWV0aG9kRmFjdG9yeTtcblxuICAgICAgc2VsZi5nZXRMZXZlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gY3VycmVudExldmVsO1xuICAgICAgfTtcblxuICAgICAgc2VsZi5zZXRMZXZlbCA9IGZ1bmN0aW9uIChsZXZlbCwgcGVyc2lzdCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgbGV2ZWwgPT09IFwic3RyaW5nXCIgJiYgc2VsZi5sZXZlbHNbbGV2ZWwudG9VcHBlckNhc2UoKV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBsZXZlbCA9IHNlbGYubGV2ZWxzW2xldmVsLnRvVXBwZXJDYXNlKCldO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodHlwZW9mIGxldmVsID09PSBcIm51bWJlclwiICYmIGxldmVsID49IDAgJiYgbGV2ZWwgPD0gc2VsZi5sZXZlbHMuU0lMRU5UKSB7XG4gICAgICAgICAgICAgIGN1cnJlbnRMZXZlbCA9IGxldmVsO1xuICAgICAgICAgICAgICBpZiAocGVyc2lzdCAhPT0gZmFsc2UpIHsgIC8vIGRlZmF1bHRzIHRvIHRydWVcbiAgICAgICAgICAgICAgICAgIHBlcnNpc3RMZXZlbElmUG9zc2libGUobGV2ZWwpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlcGxhY2VMb2dnaW5nTWV0aG9kcy5jYWxsKHNlbGYsIGxldmVsLCBuYW1lKTtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSB1bmRlZmluZWRUeXBlICYmIGxldmVsIDwgc2VsZi5sZXZlbHMuU0lMRU5UKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBjb25zb2xlIGF2YWlsYWJsZSBmb3IgbG9nZ2luZ1wiO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhyb3cgXCJsb2cuc2V0TGV2ZWwoKSBjYWxsZWQgd2l0aCBpbnZhbGlkIGxldmVsOiBcIiArIGxldmVsO1xuICAgICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHNlbGYuc2V0RGVmYXVsdExldmVsID0gZnVuY3Rpb24gKGxldmVsKSB7XG4gICAgICAgICAgaWYgKCFnZXRQZXJzaXN0ZWRMZXZlbCgpKSB7XG4gICAgICAgICAgICAgIHNlbGYuc2V0TGV2ZWwobGV2ZWwsIGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBzZWxmLmVuYWJsZUFsbCA9IGZ1bmN0aW9uKHBlcnNpc3QpIHtcbiAgICAgICAgICBzZWxmLnNldExldmVsKHNlbGYubGV2ZWxzLlRSQUNFLCBwZXJzaXN0KTtcbiAgICAgIH07XG5cbiAgICAgIHNlbGYuZGlzYWJsZUFsbCA9IGZ1bmN0aW9uKHBlcnNpc3QpIHtcbiAgICAgICAgICBzZWxmLnNldExldmVsKHNlbGYubGV2ZWxzLlNJTEVOVCwgcGVyc2lzdCk7XG4gICAgICB9O1xuXG4gICAgICAvLyBJbml0aWFsaXplIHdpdGggdGhlIHJpZ2h0IGxldmVsXG4gICAgICB2YXIgaW5pdGlhbExldmVsID0gZ2V0UGVyc2lzdGVkTGV2ZWwoKTtcbiAgICAgIGlmIChpbml0aWFsTGV2ZWwgPT0gbnVsbCkge1xuICAgICAgICAgIGluaXRpYWxMZXZlbCA9IGRlZmF1bHRMZXZlbCA9PSBudWxsID8gXCJXQVJOXCIgOiBkZWZhdWx0TGV2ZWw7XG4gICAgICB9XG4gICAgICBzZWxmLnNldExldmVsKGluaXRpYWxMZXZlbCwgZmFsc2UpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICpcbiAgICAgKiBQYWNrYWdlLWxldmVsIEFQSVxuICAgICAqXG4gICAgICovXG5cbiAgICB2YXIgZGVmYXVsdExvZ2dlciA9IG5ldyBMb2dnZXIoKTtcblxuICAgIHZhciBfbG9nZ2Vyc0J5TmFtZSA9IHt9O1xuICAgIGRlZmF1bHRMb2dnZXIuZ2V0TG9nZ2VyID0gZnVuY3Rpb24gZ2V0TG9nZ2VyKG5hbWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiIHx8IG5hbWUgPT09IFwiXCIpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiWW91IG11c3Qgc3VwcGx5IGEgbmFtZSB3aGVuIGNyZWF0aW5nIGEgbG9nZ2VyLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsb2dnZXIgPSBfbG9nZ2Vyc0J5TmFtZVtuYW1lXTtcbiAgICAgICAgaWYgKCFsb2dnZXIpIHtcbiAgICAgICAgICBsb2dnZXIgPSBfbG9nZ2Vyc0J5TmFtZVtuYW1lXSA9IG5ldyBMb2dnZXIoXG4gICAgICAgICAgICBuYW1lLCBkZWZhdWx0TG9nZ2VyLmdldExldmVsKCksIGRlZmF1bHRMb2dnZXIubWV0aG9kRmFjdG9yeSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxvZ2dlcjtcbiAgICB9O1xuXG4gICAgLy8gR3JhYiB0aGUgY3VycmVudCBnbG9iYWwgbG9nIHZhcmlhYmxlIGluIGNhc2Ugb2Ygb3ZlcndyaXRlXG4gICAgdmFyIF9sb2cgPSAodHlwZW9mIHdpbmRvdyAhPT0gdW5kZWZpbmVkVHlwZSkgPyB3aW5kb3cubG9nIDogdW5kZWZpbmVkO1xuICAgIGRlZmF1bHRMb2dnZXIubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gdW5kZWZpbmVkVHlwZSAmJlxuICAgICAgICAgICAgICAgd2luZG93LmxvZyA9PT0gZGVmYXVsdExvZ2dlcikge1xuICAgICAgICAgICAgd2luZG93LmxvZyA9IF9sb2c7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVmYXVsdExvZ2dlcjtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGRlZmF1bHRMb2dnZXI7XG59KSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9nbGV2ZWwvbGliL2xvZ2xldmVsLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlxuaW1wb3J0IGxvZyBmcm9tICdsb2dsZXZlbCc7XG5cbmltcG9ydCB7JF9pbnN0cl8weDB9IGZyb20gJy4vb3Bjb2RlLTB4MC5qcyc7XG5pbXBvcnQgeyRfaW5zdHJfMHg4fSBmcm9tICcuL29wY29kZS0weDguanMnO1xuaW1wb3J0IHskX2luc3RyXzB4RX0gZnJvbSAnLi9vcGNvZGUtMHhFLmpzJztcbmltcG9ydCB7JF9pbnN0cl8weEZ9IGZyb20gJy4vb3Bjb2RlLTB4Ri5qcyc7XG5cbmV4cG9ydCBsZXQgb3Bjb2RlcyA9IFtcbiAgXG4gIGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAgLy8gMHgwPz8/XG4gIHtcbiAgICAkX2luc3RyXzB4MFttaW5vciAmIDB4ZmZdLmNhbGwodGhpcywge21ham9yLCBtaW5vcn0pO1xuICB9LFxuXG4gIGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAvLzB4MW5ubjogSk1QIG5ublxuICB7XG4gICAgdGhpcy5yZWcuX2lwID0gbWlub3ImMHhmZmY7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vIDB4Mm5ubjogQ0FMTCBubm5cbiAge1xuICAgIHRoaXMuc3RhY2sucHVzaCh0aGlzLnJlZy5pcCk7XG4gICAgdGhpcy5yZWcuX2lwID0gbWlub3ImMHhmZmY7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vIDB4M1hSUiAvLyBqdW1wIG5leHQgaW5zdHIgaWYgdlggPT0gUlJcbiAge1xuICAgIGlmICh0aGlzLnJlZy52WyhtaW5vcj4+OCkmMHhmXSA9PSAobWlub3ImMHhmZikpXG4gICAgICB0aGlzLnJlZy5faXAgKz0gMjtcbiAgfSxcblxuICBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSkgLy80XG4gIHtcbiAgICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG4gIH0sXG5cbiAgZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vNVxuICB7XG4gICAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xuICB9LFxuXG4gIGZ1bmN0aW9uICh7bWFqb3IsIG1pbm9yfSkgLy8gMHg2eG5uICBtb3YgdngsIG5uXG4gIHtcbiAgICB0aGlzLnJlZy52WyhtaW5vcj4+OCkmMHhmXSA9IG1pbm9yICYgMHhmZjtcbiAgfSxcblxuICBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSkgLy8gMHg3eHJyIGFkZCB2eCwgcnJcbiAge1xuICAgIHRoaXMucmVnLnZbKG1pbm9yPj44KSYweGZdICs9IG1pbm9yJjB4ZmY7XG4gIH0sXG5cbiAgZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vIDB4OFxuICB7XG4gICAgJF9pbnN0cl8weDhbbWlub3IgJiAweGZdLmNhbGwodGhpcywge21ham9yLCBtaW5vcn0pO1xuICB9LFxuXG4gIGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAvLyA5XG4gIHtcbiAgICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG4gIH0sXG5cbiAgZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vIDB4QW5ubjogbXZpIG5ubiAobG9hZCAnSScgd2l0aCBubm4pXG4gIHtcbiAgICB0aGlzLnJlZy5pID0gbWlub3IgJiAweGZmZjtcbiAgfSxcblxuICBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSkgLy8gYlxuICB7XG4gICAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xuICB9LFxuXG4gIGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAvLyAweEN4a2s7IHJuZCB2eCwga2tcbiAge1xuICAgIGxldCBybmQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNTUpICYgKG1pbm9yJjB4ZmYpXG4gICAgdGhpcy5yZWcudlsobWlub3I+PjgpJjB4Zl0gPSBybmQ7XG4gIH0sXG5cbiAgZnVuY3Rpb24gKHttYWpvciwgbWlub3J9KSAgLy8gMHhEeHluOiBEUlcgVngsIFZ5LCBuICAoZHJhdyBzcHJpdGUpXG4gIHtcbiAgICBsZXQgciA9IHRoaXMucmVnLCBtID0gbWlub3I7XG4gICAgci52ZiA9IHRoaXMuZ2Z4LmRyYXcoci5pLCByLnZbKG0+PjgpJjB4Zl0sIHIudlsobT4+NCkmMHhmXSwgbSYweGYpO1xuICB9LFxuXG4gIGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAvLyAweEVcbiAge1xuICAgICRfaW5zdHJfMHhFW21pbm9yICYgMHhmZl0uY2FsbCh0aGlzLCB7bWFqb3IsIG1pbm9yfSk7XG4gIH0sXG5cbiAgZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pICAvLyAweEZ4Pz9cbiAge1xuICAgICRfaW5zdHJfMHhGW21pbm9yICYgMHhmZl0uY2FsbCh0aGlzLCB7bWFqb3IsIG1pbm9yfSk7XG4gIH1cbl07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zeXN0ZW0vY3B1L29wY29kZXMuanMiLCJcbmltcG9ydCBsb2cgZnJvbSAnbG9nbGV2ZWwnO1xuXG5sZXQgTUFYX0lOU1RSID0gMHhGRjtcbmxldCAkX2luc3RyXzB4MCA9IFtdO1xuXG4vLyBwcm9icyBhIHNtYXJ0ZXIgd2F5IHRvIGRvIHRoaXMgYnV0IG9oIHdlbGxcbmZvciAodmFyIHQ9MDsgdDw9TUFYX0lOU1RSOyB0KyspXG4gICRfaW5zdHJfMHgwLnB1c2goIHt9ICk7XG5cbiRfaW5zdHJfMHgwWzB4RTBdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vIFJFVCAoc3RhY2sucG9wKVxue1xuICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG5cbiRfaW5zdHJfMHgwWzB4RUVdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vIFJFVCAoc3RhY2sucG9wKVxue1xuICBsZXQgYWRkciA9IHRoaXMuc3RhY2sucG9wKCk7XG4gIHRoaXMucmVnLl9pcCA9IGFkZHI7XG59XG5cbmV4cG9ydCB7JF9pbnN0cl8weDB9O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3lzdGVtL2NwdS9vcGNvZGUtMHgwLmpzIiwiXG5sZXQgJF9pbnN0cl8weDggPSBbXTtcblxuJF9pbnN0cl8weDhbMHgwXSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG4kX2luc3RyXzB4OFsweDFdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cbiRfaW5zdHJfMHg4WzB4Ml0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuJF9pbnN0cl8weDhbMHgzXSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG4kX2luc3RyXzB4OFsweDRdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cbiRfaW5zdHJfMHg4WzB4NV0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuJF9pbnN0cl8weDhbMHg2XSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG4kX2luc3RyXzB4OFsweDddID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cbiRfaW5zdHJfMHg4WzB4OF0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuJF9pbnN0cl8weDhbMHg5XSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG4kX2luc3RyXzB4OFsweEFdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cbiRfaW5zdHJfMHg4WzB4Ql0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuJF9pbnN0cl8weDhbMHhDXSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG4kX2luc3RyXzB4OFsweERdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cbiRfaW5zdHJfMHg4WzB4RV0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuJF9pbnN0cl8weDhbMHhGXSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG5cbmV4cG9ydHskX2luc3RyXzB4OH07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zeXN0ZW0vY3B1L29wY29kZS0weDguanMiLCJcbmltcG9ydCBsb2cgZnJvbSAnbG9nbGV2ZWwnO1xuXG5sZXQgTUFYX0lOU1RSID0gMHhBMTtcbmxldCAkX2luc3RyXzB4RSA9IFtdO1xuXG4vLyBwcm9icyBhIHNtYXJ0ZXIgd2F5IHRvIGRvIHRoaXMgYnV0IG9oIHdlbGxcbmZvciAodmFyIHQ9MDsgdDw9TUFYX0lOU1RSOyB0KyspXG4gICRfaW5zdHJfMHhFLnB1c2goIHt9ICk7XG5cbiRfaW5zdHJfMHhFWzB4OUVdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cblxuJF9pbnN0cl8weEVbMHhBMV0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgaWYgKHRoaXMucmFtLmRhdGFbdGhpcy5rZXlTdGF0ZUFkZHIgKyB0aGlzLnJlZy52WyhtaW5vcj4+OCkmMHhmXV0gPT0gMClcbiAgICB0aGlzLnJlZy5faXAgKz0gMjtcbn1cblxuXG5leHBvcnQgeyRfaW5zdHJfMHhFfTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3N5c3RlbS9jcHUvb3Bjb2RlLTB4RS5qcyIsIlxuaW1wb3J0IGxvZyBmcm9tICdsb2dsZXZlbCc7XG5cbmxldCBNQVhfSU5TVFIgPSAweDY1O1xubGV0ICRfaW5zdHJfMHhGID0gW107XG5cbi8vIHByb2JzIGEgc21hcnRlciB3YXkgdG8gZG8gdGhpcyBidXQgb2ggd2VsbFxuZm9yICh2YXIgdD0wOyB0PD1NQVhfSU5TVFI7IHQrKylcbiAgJF9pbnN0cl8weEYucHVzaCh7fSk7XG5cbiRfaW5zdHJfMHhGWzB4MDddID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vIEZ4MDc6IHJlYWQgZGVsYXkgdGltZXIgZnJvbSBWeFxue1xuICB0aGlzLnJlZy52WyhtaW5vcj4+OCkmMHhmXSA9IHRoaXMuZGVsYXlUaW1lci5nZXQoKTtcbn1cblxuJF9pbnN0cl8weEZbMHgwQV0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuXG4kX2luc3RyXzB4RlsweDE1XSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KSAvLyBGeDE1OiBzZXQgZGVsYXkgdGltZXIgZnJvbSBWeFxue1xuICB0aGlzLmRlbGF5VGltZXIuc2V0KHRoaXMucmVnLnZbKG1pbm9yPj44KSYweGZdKTtcbn1cblxuJF9pbnN0cl8weEZbMHgxOF0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuJF9pbnN0cl8weEZbMHgxRV0gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSlcbntcbiAgdGhpcy5maXJlKCdvcGNvZGUnLCB7ZXJyb3I6IGBbQUREUiAweCR7dGhpcy5yZWcuaXAudG9TdHJpbmcoMTYpfV0gSWxsZWdhbCBpbnN0cnVjdGlvbjogMHgke21ham9yLnRvU3RyaW5nKDE2KX06JHttaW5vci50b1N0cmluZygxNil9YCwgYWRkcmVzczp0aGlzLnJlZy5pcH0pO1xufVxuXG4kX2luc3RyXzB4RlsweDI5XSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICBsZXQgdmFsID0gdGhpcy5yZWcudlsobWlub3I+PjgpJjB4Zl07XG4gIHRoaXMucmVnLmkgPSB0aGlzLnJhbS5nZXRDaGFyQWRkckJJT1MoKSArICh0aGlzLnJhbS5nZXRDaGFyU2l6ZUJJT1MoKSAqIHZhbCk7XG59XG5cbiRfaW5zdHJfMHhGWzB4MzBdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pXG57XG4gIHRoaXMuZmlyZSgnb3Bjb2RlJywge2Vycm9yOiBgW0FERFIgMHgke3RoaXMucmVnLmlwLnRvU3RyaW5nKDE2KX1dIElsbGVnYWwgaW5zdHJ1Y3Rpb246IDB4JHttYWpvci50b1N0cmluZygxNil9OiR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGFkZHJlc3M6dGhpcy5yZWcuaXB9KTtcbn1cblxuJF9pbnN0cl8weEZbMHgzM10gPSBmdW5jdGlvbih7bWFqb3IsIG1pbm9yfSkgLy8gRngzMzogYmNkIFtpXSwgVnggKHN0b3JlIGJjZCBvZiByZWcgVnggYXQgYWRkcmVzcyByZWcgaS0+aSsyKVxue1xuICBsZXQgdiA9IHRoaXMucmVnWyhtaW5vcj4+OCkmMHhmXTtcbiAgdGhpcy5yYW0uZGF0YVt0aGlzLnJlZy5pKzBdID0gTWF0aC5mbG9vcih2IC8gMTAwKTtcbiAgdGhpcy5yYW0uZGF0YVt0aGlzLnJlZy5pKzFdID0gTWF0aC5mbG9vcigodiAlIDEwMCkgLyAxMCk7XG4gIHRoaXMucmFtLmRhdGFbdGhpcy5yZWcuaSsyXSA9ICh2ICUgMTApO1xufVxuXG4kX2luc3RyXzB4RlsweDU1XSA9IGZ1bmN0aW9uKHttYWpvciwgbWlub3J9KVxue1xuICB0aGlzLmZpcmUoJ29wY29kZScsIHtlcnJvcjogYFtBRERSIDB4JHt0aGlzLnJlZy5pcC50b1N0cmluZygxNil9XSBJbGxlZ2FsIGluc3RydWN0aW9uOiAweCR7bWFqb3IudG9TdHJpbmcoMTYpfToke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBhZGRyZXNzOnRoaXMucmVnLmlwfSk7XG59XG5cbiRfaW5zdHJfMHhGWzB4NjVdID0gZnVuY3Rpb24oe21ham9yLCBtaW5vcn0pIC8vIEZ4NjU6IG1vdiB2MC12eCwgW2ldIChsb2FkIG51bWJlcnMgZnJvbSByZWcuaSBpbnRvIHJlZy52MCAtPiByZWcudngpXG57XG4gIGZvciAodmFyIHg9MCwgbXg9KG1pbm9yPj44KSYweGY7IHg8PW14OyB4KyspXG4gICAgdGhpcy5yZWcudlt4XSA9IHRoaXMucmFtLmRhdGFbdGhpcy5yZWcuaSArIHhdO1xuXG4gIHRoaXMucmVnLmkgKz0geDsgLy8gaSA9IGkgKyBYICsgMVxufVxuXG5leHBvcnQgeyRfaW5zdHJfMHhGfTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3N5c3RlbS9jcHUvb3Bjb2RlLTB4Ri5qcyIsIlxuY29uc3QgRlJFUVVFTkNZID0gMTAwMC82MDsgLy8gNjBIelxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZWxheVRpbWVyXG57XG4gIGNvbnN0cnVjdG9yKClcbiAge1xuICAgIHRoaXMuY291bnRlciA9IDA7XG4gICAgdGhpcy5fdGltZXJJZCA9IG51bGw7XG4gIH1cblxuICBzZXQodmFsdWUpXG4gIHtcbiAgICB0aGlzLmNvdW50ZXIgPSB2YWx1ZSAmIDB4ZmY7XG4gICAgdGhpcy5fc3RhcnQoKTtcbiAgfVxuXG4gIGdldCh2YWx1ZSlcbiAge1xuICAgIHJldHVybiB0aGlzLmNvdW50ZXI7XG4gIH1cblxuICBpbnRlcnZhbEZ1bmMoKVxuICB7XG4gICAgdGhpcy5jb3VudGVyLS07XG4gICAgaWYgKHRoaXMuY291bnRlciA9PSAwKSB0aGlzLl9zdG9wKCk7XG4gIH1cblxuICBfc3RhcnQoKVxuICB7XG4gICAgdGhpcy5fdGltZXJJZCA9IHNlbGYuc2V0SW50ZXJ2YWwoKHRoaXMuaW50ZXJ2YWxGdW5jKS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIF9zdG9wKClcbiAge1xuICAgIGlmICh0aGlzLl90aW1lcklkKVxuICAgIHtcbiAgICAgIHNlbGYuY2xlYXJJbnRlcnZhbCh0aGlzLl90aW1lcklkKTtcbiAgICAgIHRoaXMuX3RpbWVySWQgPSBudWxsO1xuICAgIH1cbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3lzdGVtL3RpbWVyLWRlbGF5LmpzIiwiXG5pbXBvcnQgQmFzZSBmcm9tICcuLi91dGlsL2Jhc2UnO1xuXG5jb25zdCBCSU9TX0NIQVJfQkFTRV9BRERSID0gMHgwO1xuY29uc3QgQklPU19DSEFSX1NJWkUgPSA1O1xuY29uc3QgQklPU19OVU1fQ0hBUlMgPSAxNjtcbmNvbnN0IEJJT1NfS0VZQl9CQVNFX0FERFIgPSAoQklPU19DSEFSX1NJWkUgKiBCSU9TX05VTV9DSEFSUyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJBTSBleHRlbmRzIEJhc2VcbntcbiAgY29uc3RydWN0b3IoKVxuICB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl90aGlzID0gXCJSQU1cIjtcbiAgICB0aGlzLl9kYXRhID0gbmV3IEFycmF5QnVmZmVyKDB4MTAwMCk7XG4gICAgdGhpcy5kYXRhID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5fZGF0YSk7XG4gIH1cblxuICByZXNldCgpXG4gIHtcbiAgICAvL3RoaXMuZGF0YSA9IG5ldyBBcnJheSgweDEwMDApLmZpbGwoMCk7XG4gIH1cblxuICBnZXRDaGFyQWRkckJJT1MoKVxuICB7XG4gICAgcmV0dXJuIEJJT1NfQ0hBUl9CQVNFX0FERFI7XG4gIH1cblxuICBnZXRDaGFyU2l6ZUJJT1MoKVxuICB7XG4gICAgcmV0dXJuIEJJT1NfQ0hBUl9TSVpFO1xuICB9XG5cbiAgLy8gRGVjaWRlZCB0byB3cml0ZSB0aGUga2V5Ym9hcmQgYnVmZmVyIGludG8gc3lzdGVtIFJBTVxuICAvLyBpbnN0ZWFkIG9mIHBhc3NpbmcgYW4gYWRkaXRpb25hbCBJbnB1dCgpIG9iamVjdCB0byB0aGUgQ1BVKCkgY2xhc3NcbiAgLy8gVGhpcyBpcyBwcm9iYWJseSBtb3JlIGxpa2UgYW4gZW1iZWRkZWQgc3lzdGVtIHdvdWxkIHdvcmtcbiAgZ2V0S2V5Ym9hcmRCdWZmZXJBZGRyZXNzKClcbiAge1xuICAgIHJldHVybiBCSU9TX0tFWUJfQkFTRV9BRERSO1xuICB9XG5cbiAgcmVhZEJ5dGUoYWRkcilcbiAge1xuICAgIHRoaXMuX3ZhbGlkYXRlX2FkZHJlc3MoYWRkcik7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVthZGRyXTtcbiAgfVxuXG4gIHJlYWRXb3JkKGFkZHIpXG4gIHtcbiAgICB0aGlzLl92YWxpZGF0ZV9hZGRyZXNzKGFkZHIpO1xuICAgIHJldHVybiAoKHRoaXMuZGF0YVthZGRyXSAmIDB4ZmYpIDw8IDgpIHwgKHRoaXMuZGF0YVthZGRyKzFdICYgMHhmZik7IC8vIFRPRE86ICsxID09IGdwZiA/XG4gIH1cblxuICB3cml0ZUJ5dGUoYWRkciwgZGF0YSlcbiAge1xuICAgIHRoaXMuX3ZhbGlkYXRlX2FkZHJlc3MoYWRkcik7XG4gICAgdGhpcy5kYXRhW2FkZHJdID0gZGF0YTtcbiAgfVxuXG4gIHdyaXRlV29yZChhZGRyLCBkYXRhKVxuICB7XG4gICAgdGhpcy5fdmFsaWRhdGVfYWRkcmVzcyhhZGRyKTtcbiAgICB0aGlzLmRhdGFbYWRkcl0gPSAoKGRhdGEgPj4gOCkgJiAweGZmKTtcbiAgICB0aGlzLmRhdGFbYWRkcisxXSA9IChkYXRhICYgMHhmZik7XG4gIH1cblxuICBibGl0KHR5cGVkQXJyYXksIHRvQWRkcilcbiAge1xuICAgIC8vIEJ5cGFzcyBhZGRyZXNzIHZhbGlkYXRpb24gaGVyZSBzbyB3ZSBjYW4gYmxpdCB0aGUgYmlvcyBpbnRvIHBsYWNlXG4gICAgdGhpcy5kYXRhLnNldCh0eXBlZEFycmF5LCB0b0FkZHIpO1xuICB9XG5cbiAgX3ZhbGlkYXRlX2FkZHJlc3MoYWRkcilcbiAge1xuICAgIGlmIChhZGRyIDwgMHgyMDApXG4gICAge1xuICAgICAgdGhpcy5lbWl0KCdncGYnLCB7ZXJyb3I6IGBJbGxlZ2FsIGFkZHJlc3M6IDB4JHthZGRyLnRvU3RyaW5nKDE2KX1gfSk7XG4gICAgfVxuXG4gICAgaWYgKGFkZHIgPj0gMHgxMDAwKVxuICAgIHtcbiAgICAgIHRoaXMuZW1pdCgnZ3BmJywge2Vycm9yOiBgSWxsZWdhbCBhZGRyZXNzOiAweCR7YWRkci50b1N0cmluZygxNil9YH0pO1xuICAgIH1cbiAgfVxuXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zeXN0ZW0vcmFtLmpzIiwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvYWRlclxue1xuICBjb25zdHJ1Y3RvcigpXG4gIHtcblxuICB9XG5cbiAgbG9hZCh1cmwsIGZuKVxuICB7XG4gICAgbGV0IHhtbGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgIHhtbGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT0gNCAmJiB0aGlzLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgICAgIHZhciBqc29uID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICBmbihqc29uKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB4bWxodHRwLm9wZW4oXCJHRVRcIiwgdXJsLCB0cnVlKTtcbiAgICB4bWxodHRwLnNlbmQoKTtcbiAgfVxuXG5cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3V0aWwvbG9hZGVyLmpzIiwiXG5pbXBvcnQgQmFzZSBmcm9tICcuLi91dGlsL2Jhc2UnO1xuXG5jb25zdCBXSURUSCA9IDY0LCBIRUlHSFQgPSAzMjtcbmNvbnN0IFNQUklURV9XSURUSCA9IDg7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdGWCBleHRlbmRzIEJhc2VcbntcbiAgY29uc3RydWN0b3IocmFtKVxuICB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9kaXNwbGF5ID0gbmV3IEFycmF5QnVmZmVyIChXSURUSCAqIEhFSUdIVCk7XG4gICAgdGhpcy5kaXNwbGF5ID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5fZGlzcGxheSk7XG4gICAgdGhpcy5yYW0gPSByYW07XG5cbiAgfVxuXG4gIHNpemUoKVxuICB7XG4gICAgcmV0dXJuIHt3aWR0aDogV0lEVEgsIGhlaWdodDogSEVJR0hUfTtcbiAgfVxuXG4gIGRyYXcoaSwgc3gsIHN5LCBoZWlnaHQpXG4gIHtcbiAgICBsZXQgbyA9IChzeSAqIFdJRFRIKSArIHN4OyAgICAvLyBhZGRyZXNzIG9mIGRpc3BsYXkgY29vcmRzXG4gICAgbGV0IGQgPSAoV0lEVEggLSBTUFJJVEVfV0lEVEgpOyAvLyBvZmZzZXQgZGVsdGEgaW5jcmVtZW50XG4gICAgbGV0IHMgPSBpOyAgICAgICAgICAgICAgICAgICAgLy8gYWRkcmVzcyBvZiBzcHJpdGUgaW4gUkFNXG4gICAgbGV0IGNvbGxpc2lvbiA9IDA7XG5cbiAgICAvL2NvbnNvbGUubG9nKGBEcmF3aW5nIHNwcml0ZSBhdCAke3N4fSwgJHtzeX0sIG9mZnNldCA9ICR7b31gKTtcblxuICAgIGZvciAobGV0IHk9MDsgeTxoZWlnaHQ7IHkrKylcbiAgICB7XG4gICAgICBsZXQgYml0X3JvdyA9IHRoaXMucmFtW3MrK107XG4gICAgICBsZXQgcGl4ZWwsIHhvcl9waXhlbDtcbiAgICAgIGZvciAobGV0IHg9U1BSSVRFX1dJRFRILTE7IHg+PTA7IHgtLSlcbiAgICAgIHtcbiAgICAgICAgcGl4ZWwgPSAoKGJpdF9yb3cgPj4geCkgJiAweDEpOyAgICAvL1RPRE86ICpNVVNUKiBiZSBhIHNtYXJ0ZXIgd2F5IHRvIHdyaXRlIHRoaXMhIVxuICAgICAgICB4b3JfcGl4ZWwgPSB0aGlzLmRpc3BsYXlbb10gXiBwaXhlbDtcbiAgICAgICAgdGhpcy5kaXNwbGF5W28rK10gPSB4b3JfcGl4ZWw7XG4gICAgICAgIGlmICh4b3JfcGl4ZWwhPXBpeGVsKSBjb2xsaXNpb24gPSAxO1xuICAgICAgfVxuICAgICAgbyArPSBkO1xuICAgIH1cblxuICAgIC8vIGJlbG93LCBkZWJ1Zywgd3JpdGUgb3V0IGNvbnRlbnRzIG9mIGRpc3BsYXkgdG8gY29uc29sZSBpbiBhIHdpZCAqIGhlaSBncmlkXG4gICAgLy8gZm9yICh2YXIgeT0wOyB5PEhFSUdIVDsgeSsrKVxuICAgIC8vIHtcbiAgICAvLyAgIHZhciBzdCA9IFwiXCI7XG4gICAgLy8gICBpZiAoeSA8IDEwKSBzdCArPSBcInkgMFwiK3krXCI6XCI7IGVsc2Ugc3QrPSBcInkgXCIreStcIjpcIjtcbiAgICAvLyAgIGZvciAodmFyIHg9MDsgeDxXSURUSDsgeCsrKVxuICAgIC8vICAge1xuICAgIC8vICAgICAgIHN0ICs9IHRoaXMuZGlzcGxheVsoeSAqIFdJRFRIKSt4XSA/IFwiMVwiIDogXCIwXCJcbiAgICAvLyAgIH1cbiAgICAvLyAgIGNvbnNvbGUubG9nKHN0KTtcbiAgICAvLyB9XG5cbiAgICB0aGlzLmZpcmUoJ2NoYW5nZWQnKTtcblxuICAgIHJldHVybiBjb2xsaXNpb247XG4gIH1cblxuICAvLyBfc2V0X3BpeGVsKHgsIHksIHYpXG4gIC8vIHtcbiAgLy8gICBsZXQgb2ZmcyA9ICh5KldJRFRIKSt4O1xuICAvLyAgIHRoaXMuZGlzcGxheVtvZmZzXSA9IHY7XG4gIC8vIH1cblxuICBjbGVhcigpXG4gIHtcbiAgICB0aGlzLmRpc3BsYXkuZmlsbCgwKTtcbiAgICB0aGlzLmZpcmUoJ2NoYW5nZWQnKTtcbiAgfVxuXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zeXN0ZW0vZ2Z4LmpzIiwiaW1wb3J0IGxvZyBmcm9tICdsb2dsZXZlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElucHV0XG57XG4gIC8vIE5vdGUsIHRoZSBrZXlzdGF0ZXMgYXJlIHdyaXR0ZW4gZGlyZWNsdHkgaW50byB0aGUgQ2hpcDgncyBCSU9TL1JBTVxuICAvLyBmb3IgZGlyZWN0IGFjY2VzcyBieSB0aGUgQ1BVXG5cbiAgY29uc3RydWN0b3IoY2FsbGJhY2spXG4gIHtcbiAgICAvLyAxIDIgMyBDXG4gICAgLy8gNCA1IDYgRFxuICAgIC8vIDcgOCA5IEVcbiAgICAvLyBBIDAgQiBGXG4gICAgLy8gdGhpcy5rZXlNYXAgPSBbXG4gICAgLy8gICAxOicxJywgMjonMicsIDM6JzMnLCBjOic0JyxcbiAgICAvLyAgIDQ6J3EnLCA1Oid3JywgNjonZScsIGQ6J3InLFxuICAgIC8vICAgNzonYScsIDg6J3MnLCA5OidkJywgZTonZicsXG4gICAgLy8gICAxMDoneicsIDowJ3gnLCBCOidjJywgZjondidcbiAgICAvLyBdO1xuXG4gICAgdGhpcy5rZXlEYXRhID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xuICAgIHRoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XG5cbiAgICB0aGlzLmtleU1hcCA9IFtcbiAgICAgICd4JywgJzEnLCAnMicsICczJyxcbiAgICAgICdxJywgJ3cnLCAnZScsICdhJyxcbiAgICAgICdzJywgJ2QnLCAneicsICdjJyxcbiAgICAgICc0JywgJ3InLCAnZicsICd2J1xuICAgIF07XG5cbiAgICB0aGlzLl9pbml0KCk7XG4gIH1cblxuICBfc2V0S2V5RG93bihrZXkpXG4gIHtcbiAgICAgIHRoaXMua2V5RGF0YVtrZXldID0gMTtcbiAgICAgIGlmICh0aGlzLl9jYWxsYmFjaykgdGhpcy5fY2FsbGJhY2sodGhpcy5rZXlEYXRhKTtcbiAgfVxuXG4gIF9zZXRLZXlVcChrZXkpXG4gIHtcbiAgICAgIHRoaXMua2V5RGF0YVtrZXldID0gMDtcbiAgICAgIGlmICh0aGlzLl9jYWxsYmFjaykgdGhpcy5fY2FsbGJhY2sodGhpcy5rZXlEYXRhKTtcbiAgfVxuXG4gIF9pbml0KClcbiAge1xuICAgIC8vSEFDSzogY29udmVydCBhcnJheSBpbnRvIGludGVnZXIgYXNjaWkgY29kZXMgZm9yIHF1aWNrZXIgbG9va3VwXG4gICAgZm9yIChsZXQgaz0wO2s8dGhpcy5rZXlNYXAubGVuZ3RoO2srKylcbiAgICAgIHRoaXMua2V5TWFwW2tdID0gdGhpcy5rZXlNYXBba10uY2hhckNvZGVBdCgwKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICAgIHZhciBjb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLmtleUNvZGUpLnRvTG93ZXJDYXNlKCkuY2hhckNvZGVBdCgwKVxuICAgICAgZm9yIChsZXQgaz0wOyBrPHRoaXMua2V5TWFwLmxlbmd0aDsgaysrKVxuICAgICAge1xuICAgICAgICBpZiAodGhpcy5rZXlNYXBba10gPT0gY29kZSlcbiAgICAgICAgICB0aGlzLl9zZXRLZXlEb3duKGspO1xuICAgICAgfVxuICAgICAgLy90aGlzLnByaW50VGFibGUoKTtcbiAgICB9LCB0cnVlKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChlKSA9PiB7XG4gICAgICAvL2xvZy53YXJuKCk7XG4gICAgICB2YXIgY29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZS5rZXlDb2RlKS50b0xvd2VyQ2FzZSgpLmNoYXJDb2RlQXQoMClcbiAgICAgIGZvciAobGV0IGs9MDsgazx0aGlzLmtleU1hcC5sZW5ndGg7IGsrKylcbiAgICAgIHtcbiAgICAgICAgaWYgKHRoaXMua2V5TWFwW2tdID09IGNvZGUpXG4gICAgICAgICAgdGhpcy5fc2V0S2V5VXAoayk7XG4gICAgICB9XG4gICAgfSwgdHJ1ZSk7XG5cbiAgfVxuXG5cblxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZG9tL2lucHV0LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==