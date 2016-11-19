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
	
	var _loglevel = __webpack_require__(1);
	
	var _loglevel2 = _interopRequireDefault(_loglevel);
	
	var _disasm = __webpack_require__(2);
	
	var _disasm2 = _interopRequireDefault(_disasm);
	
	var _renderer = __webpack_require__(3);
	
	var _renderer2 = _interopRequireDefault(_renderer);
	
	var _input = __webpack_require__(4);
	
	var _input2 = _interopRequireDefault(_input);
	
	var _chip8Worker = __webpack_require__(5);
	
	var _chip8Worker2 = _interopRequireDefault(_chip8Worker);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var DISPLAY_SCALE = 10;
	
	var disasm = new _disasm2.default();
	var btn = document.getElementById('btnstop');
	var keyboard = new _input2.default(inputSignal);
	var renderer = new _renderer2.default(document.getElementById('display'), DISPLAY_SCALE);
	
	_loglevel2.default.info('CHIP-8 Virtual Machine');
	
	var emuWorker = new _chip8Worker2.default();
	
	emuWorker.addEventListener('message', function (message) {
	  switch (message.data.action) {
	    case 'render':
	      //console.log(message.data.args.frameBuffer);
	      renderer.Render(message.data.args.frameBuffer);
	      break;
	    case 'error':
	      var trace_instructions = disasm.decode(message.data.args.trace.i);
	      for (var t = 0; t < message.data.args.trace.i.length; t++) {
	        var o = '[' + message.data.args.trace.a[t].toString(16) + '] (0x' + message.data.args.trace.i[t].toString(16) + ') ' + trace_instructions[t].m + ' \t\t\t\t\t ' + trace_instructions[t].d;
	        if (message.data.args.trace.a[t] == message.data.args.address) _loglevel2.default.error(o);else _loglevel2.default.debug(o);
	      }
	      break;
	  }
	});
	
	function inputSignal(keyState) {
	  emuWorker.postMessage({ action: 'input', args: { keyState: keyState } });
	}
	
	btn.onclick = function () {
	  emuWorker.postMessage({ action: 'halt' });
	};

/***/ },
/* 1 */
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
/* 2 */
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
	
	      return out;
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
	          return { m: "mov i, 0x" + hex(minor), d: "Move constant into Index register" };
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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _loglevel = __webpack_require__(1);
	
	var _loglevel2 = _interopRequireDefault(_loglevel);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var DISPLAY_WIDTH = 64,
	    DISPLAY_HEIGHT = 32;
	
	var Renderer = function () {
	  function Renderer(element) {
	    var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
	
	    _classCallCheck(this, Renderer);
	
	    this.element = element;
	    //this.video = video;  // pixel buffer of the Chip8 system in bytes
	
	    this.scale = Math.floor(Math.abs(scale)) || 1;
	
	    //this.videodim = dimensions;
	    this.dim = { width: DISPLAY_WIDTH * this.scale, height: DISPLAY_HEIGHT * this.scale };
	
	    this.renderContext = this.element.getContext("2d");
	
	    //log.debug(`Video size ${this.video.length} bytes, width: ${this.dim.width}, height: ${this.dim.height}`);
	    this.element.width = this.dim.width;
	    this.element.height = this.dim.height;
	
	    this.pixel_on = this.renderContext.createImageData(this.scale, this.scale);
	    var d = this.pixel_on.data;
	    for (var o = 0; o < scale * scale * 4; o++) {
	      d[o] = 255;
	    }this.pixel_off = this.renderContext.createImageData(this.scale, this.scale);
	    d = this.pixel_off.data;
	    for (var _o = 0; _o < scale * scale * 4; _o += 4) {
	      d[_o + 0] = 0;
	      d[_o + 1] = 0;
	      d[_o + 2] = 0;
	      d[_o + 3] = 255;
	    }
	
	    //this.dirty = false;
	  }
	
	  _createClass(Renderer, [{
	    key: "Dirty",
	    value: function Dirty() {
	      //this.dirty = true;
	    }
	  }, {
	    key: "Render",
	    value: function Render(frameBuffer) {
	      //if (!this.dirty) return;
	
	      var o = 0;
	      for (var y = 0; y < DISPLAY_HEIGHT; y++) {
	        for (var x = 0; x < DISPLAY_WIDTH; x++) {
	          var v = frameBuffer[o++];
	          var p = v ? this.pixel_on : this.pixel_off;
	          this.renderContext.putImageData(p, this.scale * x, this.scale * y);
	        }
	      }
	      //this.dirty = false;
	    }
	  }]);
	
	  return Renderer;
	}();
	
	exports.default = Renderer;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _loglevel = __webpack_require__(1);
	
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function() {
		return new Worker(__webpack_require__.p + "1c962cececc223f6b003.worker.js");
	};

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODA0YzliYTM1YzIzNWZjYzFhY2MiLCJ3ZWJwYWNrOi8vLy4vbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZ2xldmVsL2xpYi9sb2dsZXZlbC5qcyIsIndlYnBhY2s6Ly8vLi9zeXN0ZW0vZGlzYXNtLmpzIiwid2VicGFjazovLy8uL2RvbS9yZW5kZXJlci5qcyIsIndlYnBhY2s6Ly8vLi9kb20vaW5wdXQuanMiLCJ3ZWJwYWNrOi8vLy4vY2hpcDgtd29ya2VyLmpzIl0sIm5hbWVzIjpbIkRJU1BMQVlfU0NBTEUiLCJkaXNhc20iLCJidG4iLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwia2V5Ym9hcmQiLCJpbnB1dFNpZ25hbCIsInJlbmRlcmVyIiwiaW5mbyIsImVtdVdvcmtlciIsImFkZEV2ZW50TGlzdGVuZXIiLCJtZXNzYWdlIiwiZGF0YSIsImFjdGlvbiIsIlJlbmRlciIsImFyZ3MiLCJmcmFtZUJ1ZmZlciIsInRyYWNlX2luc3RydWN0aW9ucyIsImRlY29kZSIsInRyYWNlIiwiaSIsInQiLCJsZW5ndGgiLCJvIiwiYSIsInRvU3RyaW5nIiwibSIsImQiLCJhZGRyZXNzIiwiZXJyb3IiLCJkZWJ1ZyIsImtleVN0YXRlIiwicG9zdE1lc3NhZ2UiLCJvbmNsaWNrIiwiRGlzYXNzZW1ibGVyIiwiaW5zdHIiLCJsaXN0IiwiQXJyYXkiLCJpc0FycmF5Iiwib3V0IiwiX2RlY29kZV9zaW5nbGUiLCJoZXgiLCJwdXNoIiwiaW5zdHJfZGF0YSIsImZyb21faW5zdHIiLCJzaXplIiwidG9fZGVjb2RlIiwicmVhZFdvcmQiLCJtYWpvciIsIm1pbm9yIiwibWluMCIsIm1pbjEiLCJtaW4yIiwibWluMTIiLCJuIiwiRElTUExBWV9XSURUSCIsIkRJU1BMQVlfSEVJR0hUIiwiUmVuZGVyZXIiLCJlbGVtZW50Iiwic2NhbGUiLCJNYXRoIiwiZmxvb3IiLCJhYnMiLCJkaW0iLCJ3aWR0aCIsImhlaWdodCIsInJlbmRlckNvbnRleHQiLCJnZXRDb250ZXh0IiwicGl4ZWxfb24iLCJjcmVhdGVJbWFnZURhdGEiLCJwaXhlbF9vZmYiLCJ5IiwieCIsInYiLCJwIiwicHV0SW1hZ2VEYXRhIiwiSW5wdXQiLCJjYWxsYmFjayIsImtleURhdGEiLCJVaW50OEFycmF5IiwiX2NhbGxiYWNrIiwia2V5TWFwIiwiX2luaXQiLCJrZXkiLCJrIiwiY2hhckNvZGVBdCIsIndpbmRvdyIsImUiLCJjb2RlIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwia2V5Q29kZSIsInRvTG93ZXJDYXNlIiwiX3NldEtleURvd24iLCJfc2V0S2V5VXAiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUNyQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsS0FBTUEsZ0JBQWdCLEVBQXRCOztBQUVBLEtBQUlDLFNBQVMsc0JBQWI7QUFDQSxLQUFJQyxNQUFNQyxTQUFTQyxjQUFULENBQXdCLFNBQXhCLENBQVY7QUFDQSxLQUFJQyxXQUFXLG9CQUFVQyxXQUFWLENBQWY7QUFDQSxLQUFJQyxXQUFXLHVCQUFhSixTQUFTQyxjQUFULENBQXdCLFNBQXhCLENBQWIsRUFBaURKLGFBQWpELENBQWY7O0FBRUEsb0JBQUlRLElBQUo7O0FBRUEsS0FBSUMsWUFBWSwyQkFBaEI7O0FBRUFBLFdBQVVDLGdCQUFWLENBQTJCLFNBQTNCLEVBQXNDLFVBQUNDLE9BQUQsRUFBYTtBQUNqRCxXQUFPQSxRQUFRQyxJQUFSLENBQWFDLE1BQXBCO0FBRUUsVUFBSyxRQUFMO0FBQ0U7QUFDQU4sZ0JBQVNPLE1BQVQsQ0FBZ0JILFFBQVFDLElBQVIsQ0FBYUcsSUFBYixDQUFrQkMsV0FBbEM7QUFDQTtBQUNGLFVBQUssT0FBTDtBQUNJLFdBQUlDLHFCQUFxQmhCLE9BQU9pQixNQUFQLENBQWNQLFFBQVFDLElBQVIsQ0FBYUcsSUFBYixDQUFrQkksS0FBbEIsQ0FBd0JDLENBQXRDLENBQXpCO0FBQ0EsWUFBSyxJQUFJQyxJQUFFLENBQVgsRUFBY0EsSUFBRVYsUUFBUUMsSUFBUixDQUFhRyxJQUFiLENBQWtCSSxLQUFsQixDQUF3QkMsQ0FBeEIsQ0FBMEJFLE1BQTFDLEVBQWtERCxHQUFsRCxFQUNBO0FBQ0UsYUFBSUUsVUFBUVosUUFBUUMsSUFBUixDQUFhRyxJQUFiLENBQWtCSSxLQUFsQixDQUF3QkssQ0FBeEIsQ0FBMEJILENBQTFCLEVBQTZCSSxRQUE3QixDQUFzQyxFQUF0QyxDQUFSLGFBQXlEZCxRQUFRQyxJQUFSLENBQWFHLElBQWIsQ0FBa0JJLEtBQWxCLENBQXdCQyxDQUF4QixDQUEwQkMsQ0FBMUIsRUFBNkJJLFFBQTdCLENBQXNDLEVBQXRDLENBQXpELFVBQXVHUixtQkFBbUJJLENBQW5CLEVBQXNCSyxDQUE3SCxvQkFBNklULG1CQUFtQkksQ0FBbkIsRUFBc0JNLENBQXZLO0FBQ0EsYUFBSWhCLFFBQVFDLElBQVIsQ0FBYUcsSUFBYixDQUFrQkksS0FBbEIsQ0FBd0JLLENBQXhCLENBQTBCSCxDQUExQixLQUFnQ1YsUUFBUUMsSUFBUixDQUFhRyxJQUFiLENBQWtCYSxPQUF0RCxFQUNFLG1CQUFJQyxLQUFKLENBQVVOLENBQVYsRUFERixLQUdFLG1CQUFJTyxLQUFKLENBQVVQLENBQVY7QUFDSDtBQUNIO0FBaEJKO0FBa0JELEVBbkJEOztBQXFCQSxVQUFTakIsV0FBVCxDQUFxQnlCLFFBQXJCLEVBQ0E7QUFDRXRCLGFBQVV1QixXQUFWLENBQXNCLEVBQUNuQixRQUFRLE9BQVQsRUFBa0JFLE1BQU0sRUFBQ2dCLGtCQUFELEVBQXhCLEVBQXRCO0FBQ0Q7O0FBRUQ3QixLQUFJK0IsT0FBSixHQUFjLFlBQU07QUFDbEJ4QixhQUFVdUIsV0FBVixDQUFzQixFQUFDbkIsUUFBUSxNQUFULEVBQXRCO0FBQ0QsRUFGRCxDOzs7Ozs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLEVBQUM7QUFDRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QixVQUFTO0FBQ1Q7QUFDQSxVQUFTO0FBQ1Q7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0JBQXVCLHVCQUF1QjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVzs7QUFFWDtBQUNBO0FBQ0E7QUFDQSxzRUFBcUU7QUFDckUsWUFBVztBQUNYOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVc7O0FBRVg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTBDO0FBQzFDO0FBQ0EsZ0JBQWU7QUFDZjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXFCO0FBQ3JCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVztBQUNYO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztLQzdOb0JxQixZO0FBRW5CLDJCQUNBO0FBQUE7QUFDQzs7Ozs0QkFFTUMsSyxFQUNQO0FBQ0UsV0FBSUMsT0FBT0MsTUFBTUMsT0FBTixDQUFjSCxLQUFkLElBQXVCQSxLQUF2QixHQUErQixDQUFDQSxLQUFELENBQTFDO0FBQ0EsV0FBSUksTUFBTSxFQUFWOztBQUZGO0FBQUE7QUFBQTs7QUFBQTtBQUlFLDhCQUFjSCxJQUFkLDhIQUNBO0FBQUEsZUFEU2hCLENBQ1Q7O0FBQ0UsZUFBSU8sSUFBSSxLQUFLYSxjQUFMLENBQW9CcEIsQ0FBcEIsQ0FBUjtBQUNBTyxhQUFFUCxDQUFGLFVBQVdxQixJQUFJckIsQ0FBSixDQUFYO0FBQ0FtQixlQUFJRyxJQUFKLENBQVNmLENBQVQ7QUFDRDtBQVRIO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBV0UsY0FBT1ksR0FBUDtBQUNEOzs7NkJBRU9JLFUsRUFBWUMsVSxFQUFZQyxJLEVBQ2hDO0FBQ0UsV0FBSUMsWUFBWSxFQUFoQjtBQUNBLFlBQUssSUFBSXpCLElBQUV1QixhQUFZQyxPQUFLLENBQTVCLEVBQWdDeEIsS0FBR3VCLGFBQVlDLE9BQUssQ0FBcEQsRUFBd0R4QixLQUFHLENBQTNELEVBQ0E7QUFDRXlCLG1CQUFVSixJQUFWLENBQWVDLFdBQVdJLFFBQVgsQ0FBb0IxQixDQUFwQixDQUFmO0FBQ0Q7QUFDRCxjQUFPLEtBQUtILE1BQUwsQ0FBWTRCLFNBQVosQ0FBUDtBQUNEOzs7b0NBRWNYLEssRUFDZjtBQUNJLFdBQUlhLFFBQVNiLFNBQVMsRUFBVixHQUFnQixHQUE1QjtBQUNBLFdBQUljLFFBQVFkLFFBQVEsS0FBcEI7O0FBRUE7QUFDQSxXQUFJZSxPQUFRRCxTQUFTLENBQVYsR0FBZSxHQUExQixDQUxKLENBS29DO0FBQ2hDLFdBQUlFLE9BQVFGLFNBQVMsQ0FBVixHQUFlLEdBQTFCLENBTkosQ0FNb0M7QUFDaEMsV0FBSUcsT0FBT0gsUUFBUSxHQUFuQixDQVBKLENBT29DO0FBQ2hDLFdBQUlJLFFBQVFKLFFBQVEsSUFBcEIsQ0FSSixDQVFvQzs7QUFFaEMsZUFBT0QsS0FBUDtBQUVFLGNBQUssR0FBTDtBQUNFLG1CQUFPQyxLQUFQO0FBRUUsa0JBQUssSUFBTDtBQUFXLHNCQUFPLEVBQUN2QixHQUFHLEtBQUosRUFBV0MsR0FBRSxjQUFiLEVBQVAsQ0FBcUM7QUFDaEQsa0JBQUssSUFBTDtBQUFXLHNCQUFPLEVBQUNELEdBQUcsS0FBSixFQUFXQyxHQUFFLGdDQUFiLEVBQVAsQ0FBdUQ7QUFDbEU7QUFBUyxzQkFBTyxFQUFDRCxZQUFVdUIsTUFBTXhCLFFBQU4sQ0FBZSxFQUFmLENBQVgsRUFBaUNFLEdBQUUsNkRBQW5DLEVBQVAsQ0FBeUc7QUFKcEg7QUFNQTtBQUNGLGNBQUssR0FBTDtBQUFVLGtCQUFPLEVBQUNELGNBQVllLElBQUlRLEtBQUosQ0FBYixFQUEyQnRCLEdBQUUsaUJBQTdCLEVBQVAsQ0FBVixDQUE4RTtBQUM1RTtBQUNGLGNBQUssR0FBTDtBQUFVLGtCQUFPLEVBQUNELGVBQWFlLElBQUlRLEtBQUosQ0FBZCxFQUE0QnRCLEdBQUUseUJBQTlCLEVBQVAsQ0FBVixDQUFzRjtBQUNwRjtBQUNGLGNBQUssR0FBTDtBQUFVLGtCQUFPLEVBQUNELGFBQVdlLElBQUlTLElBQUosQ0FBWCxVQUF5QkcsS0FBMUIsRUFBbUMxQixHQUFFLDhDQUFyQyxFQUFQLENBQVYsQ0FBeUc7QUFDdkc7QUFDRixjQUFLLEdBQUw7QUFBVSxrQkFBTyxFQUFDRCxhQUFXZSxJQUFJUyxJQUFKLENBQVgsVUFBeUJHLEtBQTFCLEVBQW1DMUIsR0FBRSxrREFBckMsRUFBUCxDQUFWLENBQTZHO0FBQzNHO0FBQ0YsY0FBSyxHQUFMO0FBQVUsa0JBQU8sRUFBQ0QsYUFBV2UsSUFBSVMsSUFBSixDQUFYLFdBQTBCVCxJQUFJVSxJQUFKLENBQTNCLEVBQXdDeEIsR0FBRSwrQ0FBMUMsRUFBUCxDQUFWLENBQTRHO0FBQzFHO0FBQ0YsY0FBSyxHQUFMO0FBQVUsa0JBQU8sRUFBQ0QsYUFBV2UsSUFBSVMsSUFBSixDQUFYLFVBQXlCRyxLQUExQixFQUFtQzFCLEdBQUUsNkJBQXJDLEVBQVAsQ0FBMkUsQ0FBckYsQ0FBeUY7QUFDdkY7QUFDRixjQUFLLEdBQUw7QUFBVSxrQkFBTyxFQUFDRCxhQUFXZSxJQUFJUyxJQUFKLENBQVgsVUFBeUJHLEtBQTFCLEVBQW1DMUIsR0FBRSwwQkFBckMsRUFBUCxDQUF3RSxDQUFsRixDQUFzRjtBQUNwRjtBQUNGLGNBQUssR0FBTDtBQUNFLG1CQUFReUIsSUFBUjtBQUVFLGtCQUFLLEdBQUw7QUFBVSxzQkFBTyxFQUFDMUIsYUFBV2UsSUFBSVMsSUFBSixDQUFYLFdBQTBCVCxJQUFJVSxJQUFKLENBQTNCLEVBQXdDeEIsR0FBRyw2QkFBM0MsRUFBUCxDQUFrRixNQUY5RixDQUV1RztBQUNyRyxrQkFBSyxHQUFMO0FBQVUsc0JBQU8sRUFBQ0QsWUFBVWUsSUFBSVMsSUFBSixDQUFWLFdBQXlCVCxJQUFJVSxJQUFKLENBQTFCLEVBQXVDeEIsR0FBRywyQkFBMUMsRUFBUCxDQUErRSxNQUgzRixDQUdxRztBQUNuRyxrQkFBSyxHQUFMO0FBQVUsc0JBQU8sRUFBQ0QsYUFBV2UsSUFBSVMsSUFBSixDQUFYLFdBQTBCVCxJQUFJVSxJQUFKLENBQTNCLEVBQXdDeEIsR0FBRyw0QkFBM0MsRUFBUCxDQUFpRixNQUo3RixDQUlzRztBQUNwRyxrQkFBSyxHQUFMO0FBQVUsc0JBQU8sRUFBQ0QsYUFBV2UsSUFBSVMsSUFBSixDQUFYLFdBQTBCVCxJQUFJVSxJQUFKLENBQTNCLEVBQXdDeEIsR0FBRyw0QkFBM0MsRUFBUCxDQUFpRixNQUw3RixDQUtzRztBQUNwRyxrQkFBSyxHQUFMO0FBQVUsc0JBQU8sRUFBQ0QsYUFBV2UsSUFBSVMsSUFBSixDQUFYLFdBQTBCVCxJQUFJVSxJQUFKLENBQTNCLEVBQXdDeEIsR0FBRywwQkFBM0MsRUFBUCxDQUErRSxNQU4zRixDQU1vRztBQUNsRyxrQkFBSyxHQUFMO0FBQVUsc0JBQU8sRUFBQ0QsYUFBV2UsSUFBSVMsSUFBSixDQUFYLFdBQTBCVCxJQUFJVSxJQUFKLENBQTNCLEVBQXdDeEIsR0FBRyxpQ0FBM0MsRUFBUCxDQUFzRixNQVBsRyxDQU8yRztBQUN6RyxrQkFBSyxHQUFMO0FBQVUsc0JBQU8sRUFBQ0QsYUFBV2UsSUFBSVMsSUFBSixDQUFaLEVBQXlCdkIsR0FBRyxzQkFBNUIsRUFBUCxDQUE0RCxNQVJ4RSxDQVFnRztBQUM5RixrQkFBSyxHQUFMO0FBQVUsc0JBQU8sRUFBQ0QsYUFBV2UsSUFBSVMsSUFBSixDQUFYLFdBQTBCVCxJQUFJVSxJQUFKLENBQTNCLEVBQXdDeEIsR0FBRyx5Q0FBM0MsRUFBUCxDQUE4RixNQVQxRyxDQVNtSDtBQUNqSCxrQkFBSyxHQUFMO0FBQVUsc0JBQU8sRUFBQ0QsYUFBV2UsSUFBSVMsSUFBSixDQUFaLEVBQXlCdkIsR0FBRyxxQkFBNUIsRUFBUCxDQUEyRCxNQVZ2RSxDQVUrRjtBQVYvRjtBQVlBO0FBQ0YsY0FBSyxHQUFMO0FBQVUsa0JBQU8sRUFBQ0QsYUFBV2UsSUFBSVMsSUFBSixDQUFYLFdBQTBCVCxJQUFJVSxJQUFKLENBQTNCLEVBQXdDeEIsR0FBRyxrREFBM0MsRUFBUCxDQUFWLENBQTZIO0FBQzNIO0FBQ0YsY0FBSyxHQUFMO0FBQVUsa0JBQU8sRUFBQ0QsaUJBQWVlLElBQUlRLEtBQUosQ0FBaEIsRUFBOEJ0QixHQUFFLG1DQUFoQyxFQUFQO0FBQ1I7QUFDRixjQUFLLEdBQUw7QUFBVSxrQkFBTyxFQUFDRCxjQUFZZSxJQUFJUSxLQUFKLENBQWIsRUFBMkJ0QixHQUFFLGlEQUE3QixFQUFQO0FBQ1I7QUFDRixjQUFLLEdBQUw7QUFBVSxrQkFBTyxFQUFDRCxhQUFXZSxJQUFJUyxJQUFKLENBQVgsWUFBMkJULElBQUlZLEtBQUosQ0FBNUIsRUFBMEMxQixHQUFFLCtDQUE1QyxFQUFQO0FBQ1I7QUFDRixjQUFLLEdBQUw7QUFBVSxrQkFBTyxFQUFDRCxhQUFXZSxJQUFJUyxJQUFKLENBQVgsV0FBMEJULElBQUlVLElBQUosQ0FBMUIsVUFBeUNDLElBQTFDLEVBQW1EekIsR0FBRSxvREFBckQsRUFBUDtBQUNSO0FBQ0YsY0FBSyxHQUFMO0FBQ0UsbUJBQU8wQixLQUFQO0FBRUUsa0JBQUssSUFBTDtBQUFXLHNCQUFPLEVBQUMzQixhQUFXZSxJQUFJUyxJQUFKLENBQVosRUFBeUJ2QixHQUFFLHNDQUEzQixFQUFQO0FBQ1Q7QUFDRixrQkFBSyxJQUFMO0FBQVcsc0JBQU8sRUFBQ0QsYUFBV2UsSUFBSVMsSUFBSixDQUFaLEVBQXlCdkIsR0FBRSwwQ0FBM0IsRUFBUDtBQUNUO0FBTEo7QUFPQTtBQUNGLGNBQUssR0FBTDtBQUNFLG1CQUFPMEIsS0FBUDtBQUVFLGtCQUFLLElBQUw7QUFBVyxzQkFBTyxFQUFDM0IsYUFBV2UsSUFBSVMsSUFBSixDQUFaLEVBQXlCdkIsR0FBRSxzQ0FBM0IsRUFBUDtBQUNUO0FBQ0Ysa0JBQUssSUFBTDtBQUFXLHNCQUFPLEVBQUNELGNBQVllLElBQUlTLElBQUosQ0FBYixFQUEwQnZCLEdBQUUsNkNBQTVCLEVBQVA7QUFDVDtBQUNGLGtCQUFLLElBQUw7QUFBVyxzQkFBTyxFQUFDRCxhQUFXZSxJQUFJUyxJQUFKLENBQVosRUFBeUJ2QixHQUFFLCtCQUEzQixFQUFQO0FBQ1Q7QUFDRixrQkFBSyxJQUFMO0FBQVcsc0JBQU8sRUFBQ0QsYUFBV2UsSUFBSVMsSUFBSixDQUFaLEVBQXlCdkIsR0FBRSwrQkFBM0IsRUFBUDtBQUNUO0FBQ0Ysa0JBQUssSUFBTDtBQUFXLHNCQUFPLEVBQUNELGFBQVdlLElBQUlTLElBQUosQ0FBWixFQUF5QnZCLEdBQUUsc0NBQTNCLEVBQVA7QUFDVDtBQUNGLGtCQUFLLElBQUw7QUFBVyxzQkFBTyxFQUFDRCxhQUFXZSxJQUFJUyxJQUFKLENBQVosRUFBeUJ2QixHQUFFLDhEQUEzQixFQUFQO0FBQ1Q7QUFDRixrQkFBSyxJQUFMO0FBQVcsc0JBQU8sRUFBQ0QsYUFBV2UsSUFBSVMsSUFBSixDQUFaLEVBQXlCdkIsR0FBRSxzREFBM0IsRUFBUDtBQUNUO0FBQ0Ysa0JBQUssSUFBTDtBQUFXLHNCQUFPLEVBQUNELGFBQVdlLElBQUlTLElBQUosQ0FBWixFQUF5QnZCLEdBQUUsbUVBQTNCLEVBQVA7QUFDVDtBQUNGLGtCQUFLLElBQUw7QUFBVyxzQkFBTyxFQUFDRCxhQUFXZSxJQUFJUyxJQUFKLENBQVosRUFBeUJ2QixHQUFFLCtFQUEzQixFQUFQO0FBQ1Q7QUFuQko7QUFxQkE7O0FBRUE7QUFBUyxrQkFBTyxFQUFDRCx1QkFBb0JlLElBQUlOLEtBQUosQ0FBckIsRUFBbUNSLEdBQUUsNkJBQXJDLEVBQVA7QUFDUDtBQWxGTjtBQW9GSDs7Ozs7O21CQTlIa0JPLFk7OztBQWlJckIsVUFBU08sR0FBVCxDQUFhYSxDQUFiLEVBQWdCO0FBQUUsVUFBT0EsRUFBRTdCLFFBQUYsQ0FBVyxFQUFYLENBQVA7QUFBd0IsRTs7Ozs7Ozs7Ozs7Ozs7QUNqSTFDOzs7Ozs7OztBQUVBLEtBQU04QixnQkFBZ0IsRUFBdEI7QUFBQSxLQUEwQkMsaUJBQWlCLEVBQTNDOztLQUVxQkMsUTtBQUVuQixxQkFBWUMsT0FBWixFQUNBO0FBQUEsU0FEcUJDLEtBQ3JCLHVFQUQyQixDQUMzQjs7QUFBQTs7QUFDRSxVQUFLRCxPQUFMLEdBQWVBLE9BQWY7QUFDQTs7QUFFQSxVQUFLQyxLQUFMLEdBQWFDLEtBQUtDLEtBQUwsQ0FBV0QsS0FBS0UsR0FBTCxDQUFTSCxLQUFULENBQVgsS0FBK0IsQ0FBNUM7O0FBRUE7QUFDQSxVQUFLSSxHQUFMLEdBQVcsRUFBQ0MsT0FBT1QsZ0JBQWdCLEtBQUtJLEtBQTdCLEVBQW9DTSxRQUFRVCxpQkFBaUIsS0FBS0csS0FBbEUsRUFBWDs7QUFFQSxVQUFLTyxhQUFMLEdBQXFCLEtBQUtSLE9BQUwsQ0FBYVMsVUFBYixDQUF3QixJQUF4QixDQUFyQjs7QUFFQTtBQUNBLFVBQUtULE9BQUwsQ0FBYU0sS0FBYixHQUFxQixLQUFLRCxHQUFMLENBQVNDLEtBQTlCO0FBQ0EsVUFBS04sT0FBTCxDQUFhTyxNQUFiLEdBQXNCLEtBQUtGLEdBQUwsQ0FBU0UsTUFBL0I7O0FBRUEsVUFBS0csUUFBTCxHQUFnQixLQUFLRixhQUFMLENBQW1CRyxlQUFuQixDQUFtQyxLQUFLVixLQUF4QyxFQUE4QyxLQUFLQSxLQUFuRCxDQUFoQjtBQUNBLFNBQUloQyxJQUFLLEtBQUt5QyxRQUFMLENBQWN4RCxJQUF2QjtBQUNBLFVBQUssSUFBSVcsSUFBRSxDQUFYLEVBQWNBLElBQUVvQyxRQUFNQSxLQUFOLEdBQVksQ0FBNUIsRUFBK0JwQyxHQUEvQjtBQUNJSSxTQUFFSixDQUFGLElBQVMsR0FBVDtBQURKLE1BR0EsS0FBSytDLFNBQUwsR0FBaUIsS0FBS0osYUFBTCxDQUFtQkcsZUFBbkIsQ0FBbUMsS0FBS1YsS0FBeEMsRUFBOEMsS0FBS0EsS0FBbkQsQ0FBakI7QUFDQWhDLFNBQUssS0FBSzJDLFNBQUwsQ0FBZTFELElBQXBCO0FBQ0EsVUFBSyxJQUFJVyxLQUFFLENBQVgsRUFBY0EsS0FBRW9DLFFBQU1BLEtBQU4sR0FBWSxDQUE1QixFQUErQnBDLE1BQUcsQ0FBbEMsRUFDQTtBQUNJSSxTQUFFSixLQUFFLENBQUosSUFBVyxDQUFYO0FBQ0FJLFNBQUVKLEtBQUUsQ0FBSixJQUFXLENBQVg7QUFDQUksU0FBRUosS0FBRSxDQUFKLElBQVcsQ0FBWDtBQUNBSSxTQUFFSixLQUFFLENBQUosSUFBVyxHQUFYO0FBQ0g7O0FBRUQ7QUFDRDs7Ozs2QkFHRDtBQUNFO0FBQ0Q7Ozs0QkFFTVAsVyxFQUNQO0FBQ0U7O0FBRUEsV0FBSU8sSUFBSSxDQUFSO0FBQ0EsWUFBSyxJQUFJZ0QsSUFBRSxDQUFYLEVBQWNBLElBQUVmLGNBQWhCLEVBQWdDZSxHQUFoQyxFQUNBO0FBQ0UsY0FBSyxJQUFJQyxJQUFFLENBQVgsRUFBY0EsSUFBRWpCLGFBQWhCLEVBQStCaUIsR0FBL0IsRUFDQTtBQUNFLGVBQUlDLElBQUl6RCxZQUFZTyxHQUFaLENBQVI7QUFDQSxlQUFJbUQsSUFBSUQsSUFBSSxLQUFLTCxRQUFULEdBQW9CLEtBQUtFLFNBQWpDO0FBQ0EsZ0JBQUtKLGFBQUwsQ0FBbUJTLFlBQW5CLENBQWdDRCxDQUFoQyxFQUFtQyxLQUFLZixLQUFMLEdBQVdhLENBQTlDLEVBQWlELEtBQUtiLEtBQUwsR0FBV1ksQ0FBNUQ7QUFDRDtBQUNGO0FBQ0Q7QUFDRDs7Ozs7O21CQXhEa0JkLFE7Ozs7Ozs7Ozs7Ozs7O0FDTHJCOzs7Ozs7OztLQUVxQm1CLEs7QUFFbkI7QUFDQTs7QUFFQSxrQkFBWUMsUUFBWixFQUNBO0FBQUE7O0FBQ0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsVUFBS0MsT0FBTCxHQUFlLElBQUlDLFVBQUosQ0FBZSxFQUFmLENBQWY7QUFDQSxVQUFLQyxTQUFMLEdBQWlCSCxRQUFqQjs7QUFFQSxVQUFLSSxNQUFMLEdBQWMsQ0FDWixHQURZLEVBQ1AsR0FETyxFQUNGLEdBREUsRUFDRyxHQURILEVBRVosR0FGWSxFQUVQLEdBRk8sRUFFRixHQUZFLEVBRUcsR0FGSCxFQUdaLEdBSFksRUFHUCxHQUhPLEVBR0YsR0FIRSxFQUdHLEdBSEgsRUFJWixHQUpZLEVBSVAsR0FKTyxFQUlGLEdBSkUsRUFJRyxHQUpILENBQWQ7O0FBT0EsVUFBS0MsS0FBTDtBQUNEOzs7O2lDQUVXQyxHLEVBQ1o7QUFDSSxZQUFLTCxPQUFMLENBQWFLLEdBQWIsSUFBb0IsQ0FBcEI7QUFDQSxXQUFJLEtBQUtILFNBQVQsRUFBb0IsS0FBS0EsU0FBTCxDQUFlLEtBQUtGLE9BQXBCO0FBQ3ZCOzs7K0JBRVNLLEcsRUFDVjtBQUNJLFlBQUtMLE9BQUwsQ0FBYUssR0FBYixJQUFvQixDQUFwQjtBQUNBLFdBQUksS0FBS0gsU0FBVCxFQUFvQixLQUFLQSxTQUFMLENBQWUsS0FBS0YsT0FBcEI7QUFDdkI7Ozs2QkFHRDtBQUFBOztBQUNFO0FBQ0EsWUFBSyxJQUFJTSxJQUFFLENBQVgsRUFBYUEsSUFBRSxLQUFLSCxNQUFMLENBQVkzRCxNQUEzQixFQUFrQzhELEdBQWxDO0FBQ0UsY0FBS0gsTUFBTCxDQUFZRyxDQUFaLElBQWlCLEtBQUtILE1BQUwsQ0FBWUcsQ0FBWixFQUFlQyxVQUFmLENBQTBCLENBQTFCLENBQWpCO0FBREYsUUFHQUMsT0FBTzVFLGdCQUFQLENBQXdCLFNBQXhCLEVBQW1DLFVBQUM2RSxDQUFELEVBQU87QUFDeEMsYUFBSUMsT0FBT0MsT0FBT0MsWUFBUCxDQUFvQkgsRUFBRUksT0FBdEIsRUFBK0JDLFdBQS9CLEdBQTZDUCxVQUE3QyxDQUF3RCxDQUF4RCxDQUFYO0FBQ0EsY0FBSyxJQUFJRCxLQUFFLENBQVgsRUFBY0EsS0FBRSxNQUFLSCxNQUFMLENBQVkzRCxNQUE1QixFQUFvQzhELElBQXBDLEVBQ0E7QUFDRSxlQUFJLE1BQUtILE1BQUwsQ0FBWUcsRUFBWixLQUFrQkksSUFBdEIsRUFDRSxNQUFLSyxXQUFMLENBQWlCVCxFQUFqQjtBQUNIO0FBQ0Q7QUFDRCxRQVJELEVBUUcsSUFSSDs7QUFVQUUsY0FBTzVFLGdCQUFQLENBQXdCLE9BQXhCLEVBQWlDLFVBQUM2RSxDQUFELEVBQU87QUFDdEM7QUFDQSxhQUFJQyxPQUFPQyxPQUFPQyxZQUFQLENBQW9CSCxFQUFFSSxPQUF0QixFQUErQkMsV0FBL0IsR0FBNkNQLFVBQTdDLENBQXdELENBQXhELENBQVg7QUFDQSxjQUFLLElBQUlELE1BQUUsQ0FBWCxFQUFjQSxNQUFFLE1BQUtILE1BQUwsQ0FBWTNELE1BQTVCLEVBQW9DOEQsS0FBcEMsRUFDQTtBQUNFLGVBQUksTUFBS0gsTUFBTCxDQUFZRyxHQUFaLEtBQWtCSSxJQUF0QixFQUNFLE1BQUtNLFNBQUwsQ0FBZVYsR0FBZjtBQUNIO0FBQ0YsUUFSRCxFQVFHLElBUkg7QUFVRDs7Ozs7O21CQXJFa0JSLEs7Ozs7OztBQ0ZyQjtBQUNBO0FBQ0EsRyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA4MDRjOWJhMzVjMjM1ZmNjMWFjYyIsIlxuaW1wb3J0IGxvZyAgICAgICAgICAgICAgICBmcm9tICdsb2dsZXZlbCc7XG5pbXBvcnQgRGlzYXNzZW1ibGVyICAgICAgIGZyb20gJy4vc3lzdGVtL2Rpc2FzbSc7XG5pbXBvcnQgUmVuZGVyZXIgICAgICAgICAgIGZyb20gJy4vZG9tL3JlbmRlcmVyJztcbmltcG9ydCBJbnB1dCAgICAgICAgICAgICAgZnJvbSAnLi9kb20vaW5wdXQnO1xuaW1wb3J0IEVtdWxhdGlvbldvcmtlciAgICBmcm9tICd3b3JrZXItbG9hZGVyIS4vY2hpcDgtd29ya2VyLmpzJztcblxuY29uc3QgRElTUExBWV9TQ0FMRSA9IDEwO1xuXG5sZXQgZGlzYXNtID0gbmV3IERpc2Fzc2VtYmxlcigpO1xubGV0IGJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG5zdG9wJyk7XG5sZXQga2V5Ym9hcmQgPSBuZXcgSW5wdXQoaW5wdXRTaWduYWwpO1xubGV0IHJlbmRlcmVyID0gbmV3IFJlbmRlcmVyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXNwbGF5JyksIERJU1BMQVlfU0NBTEUpO1xuXG5sb2cuaW5mbyhgQ0hJUC04IFZpcnR1YWwgTWFjaGluZWApO1xuXG5sZXQgZW11V29ya2VyID0gbmV3IEVtdWxhdGlvbldvcmtlcigpO1xuXG5lbXVXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChtZXNzYWdlKSA9PiB7XG4gIHN3aXRjaChtZXNzYWdlLmRhdGEuYWN0aW9uKVxuICB7XG4gICAgY2FzZSAncmVuZGVyJzpcbiAgICAgIC8vY29uc29sZS5sb2cobWVzc2FnZS5kYXRhLmFyZ3MuZnJhbWVCdWZmZXIpO1xuICAgICAgcmVuZGVyZXIuUmVuZGVyKG1lc3NhZ2UuZGF0YS5hcmdzLmZyYW1lQnVmZmVyKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2Vycm9yJzpcbiAgICAgICAgbGV0IHRyYWNlX2luc3RydWN0aW9ucyA9IGRpc2FzbS5kZWNvZGUobWVzc2FnZS5kYXRhLmFyZ3MudHJhY2UuaSk7XG4gICAgICAgIGZvciAodmFyIHQ9MDsgdDxtZXNzYWdlLmRhdGEuYXJncy50cmFjZS5pLmxlbmd0aDsgdCsrKVxuICAgICAgICB7XG4gICAgICAgICAgdmFyIG8gPSBgWyR7bWVzc2FnZS5kYXRhLmFyZ3MudHJhY2UuYVt0XS50b1N0cmluZygxNil9XSAoMHgke21lc3NhZ2UuZGF0YS5hcmdzLnRyYWNlLmlbdF0udG9TdHJpbmcoMTYpfSkgJHt0cmFjZV9pbnN0cnVjdGlvbnNbdF0ubX0gXFx0XFx0XFx0XFx0XFx0ICR7dHJhY2VfaW5zdHJ1Y3Rpb25zW3RdLmR9YDtcbiAgICAgICAgICBpZiAobWVzc2FnZS5kYXRhLmFyZ3MudHJhY2UuYVt0XSA9PSBtZXNzYWdlLmRhdGEuYXJncy5hZGRyZXNzKVxuICAgICAgICAgICAgbG9nLmVycm9yKG8pO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGxvZy5kZWJ1ZyhvKTtcbiAgICAgICAgfVxuICAgICAgYnJlYWs7XG4gIH1cbn0pO1xuXG5mdW5jdGlvbiBpbnB1dFNpZ25hbChrZXlTdGF0ZSlcbntcbiAgZW11V29ya2VyLnBvc3RNZXNzYWdlKHthY3Rpb246ICdpbnB1dCcsIGFyZ3M6IHtrZXlTdGF0ZX19KTtcbn1cblxuYnRuLm9uY2xpY2sgPSAoKSA9PiB7XG4gIGVtdVdvcmtlci5wb3N0TWVzc2FnZSh7YWN0aW9uOiAnaGFsdCd9KTtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9tYWluLmpzIiwiLypcbiogbG9nbGV2ZWwgLSBodHRwczovL2dpdGh1Yi5jb20vcGltdGVycnkvbG9nbGV2ZWxcbipcbiogQ29weXJpZ2h0IChjKSAyMDEzIFRpbSBQZXJyeVxuKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4qL1xuKGZ1bmN0aW9uIChyb290LCBkZWZpbml0aW9uKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoZGVmaW5pdGlvbik7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByb290LmxvZyA9IGRlZmluaXRpb24oKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgbm9vcCA9IGZ1bmN0aW9uKCkge307XG4gICAgdmFyIHVuZGVmaW5lZFR5cGUgPSBcInVuZGVmaW5lZFwiO1xuXG4gICAgZnVuY3Rpb24gcmVhbE1ldGhvZChtZXRob2ROYW1lKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uc29sZSA9PT0gdW5kZWZpbmVkVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBXZSBjYW4ndCBidWlsZCBhIHJlYWwgbWV0aG9kIHdpdGhvdXQgYSBjb25zb2xlIHRvIGxvZyB0b1xuICAgICAgICB9IGVsc2UgaWYgKGNvbnNvbGVbbWV0aG9kTmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGJpbmRNZXRob2QoY29uc29sZSwgbWV0aG9kTmFtZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY29uc29sZS5sb2cgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGJpbmRNZXRob2QoY29uc29sZSwgJ2xvZycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBiaW5kTWV0aG9kKG9iaiwgbWV0aG9kTmFtZSkge1xuICAgICAgICB2YXIgbWV0aG9kID0gb2JqW21ldGhvZE5hbWVdO1xuICAgICAgICBpZiAodHlwZW9mIG1ldGhvZC5iaW5kID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kLmJpbmQob2JqKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLmNhbGwobWV0aG9kLCBvYmopO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIC8vIE1pc3NpbmcgYmluZCBzaGltIG9yIElFOCArIE1vZGVybml6ciwgZmFsbGJhY2sgdG8gd3JhcHBpbmdcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuYXBwbHkobWV0aG9kLCBbb2JqLCBhcmd1bWVudHNdKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gdGhlc2UgcHJpdmF0ZSBmdW5jdGlvbnMgYWx3YXlzIG5lZWQgYHRoaXNgIHRvIGJlIHNldCBwcm9wZXJseVxuXG4gICAgZnVuY3Rpb24gZW5hYmxlTG9nZ2luZ1doZW5Db25zb2xlQXJyaXZlcyhtZXRob2ROYW1lLCBsZXZlbCwgbG9nZ2VyTmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSB1bmRlZmluZWRUeXBlKSB7XG4gICAgICAgICAgICAgICAgcmVwbGFjZUxvZ2dpbmdNZXRob2RzLmNhbGwodGhpcywgbGV2ZWwsIGxvZ2dlck5hbWUpO1xuICAgICAgICAgICAgICAgIHRoaXNbbWV0aG9kTmFtZV0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXBsYWNlTG9nZ2luZ01ldGhvZHMobGV2ZWwsIGxvZ2dlck5hbWUpIHtcbiAgICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsb2dNZXRob2RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbWV0aG9kTmFtZSA9IGxvZ01ldGhvZHNbaV07XG4gICAgICAgICAgICB0aGlzW21ldGhvZE5hbWVdID0gKGkgPCBsZXZlbCkgP1xuICAgICAgICAgICAgICAgIG5vb3AgOlxuICAgICAgICAgICAgICAgIHRoaXMubWV0aG9kRmFjdG9yeShtZXRob2ROYW1lLCBsZXZlbCwgbG9nZ2VyTmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWZhdWx0TWV0aG9kRmFjdG9yeShtZXRob2ROYW1lLCBsZXZlbCwgbG9nZ2VyTmFtZSkge1xuICAgICAgICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgICAgICByZXR1cm4gcmVhbE1ldGhvZChtZXRob2ROYW1lKSB8fFxuICAgICAgICAgICAgICAgZW5hYmxlTG9nZ2luZ1doZW5Db25zb2xlQXJyaXZlcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIHZhciBsb2dNZXRob2RzID0gW1xuICAgICAgICBcInRyYWNlXCIsXG4gICAgICAgIFwiZGVidWdcIixcbiAgICAgICAgXCJpbmZvXCIsXG4gICAgICAgIFwid2FyblwiLFxuICAgICAgICBcImVycm9yXCJcbiAgICBdO1xuXG4gICAgZnVuY3Rpb24gTG9nZ2VyKG5hbWUsIGRlZmF1bHRMZXZlbCwgZmFjdG9yeSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgdmFyIGN1cnJlbnRMZXZlbDtcbiAgICAgIHZhciBzdG9yYWdlS2V5ID0gXCJsb2dsZXZlbFwiO1xuICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgc3RvcmFnZUtleSArPSBcIjpcIiArIG5hbWU7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHBlcnNpc3RMZXZlbElmUG9zc2libGUobGV2ZWxOdW0pIHtcbiAgICAgICAgICB2YXIgbGV2ZWxOYW1lID0gKGxvZ01ldGhvZHNbbGV2ZWxOdW1dIHx8ICdzaWxlbnQnKS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICAgICAgLy8gVXNlIGxvY2FsU3RvcmFnZSBpZiBhdmFpbGFibGVcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlW3N0b3JhZ2VLZXldID0gbGV2ZWxOYW1lO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxuXG4gICAgICAgICAgLy8gVXNlIHNlc3Npb24gY29va2llIGFzIGZhbGxiYWNrXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LmNvb2tpZSA9XG4gICAgICAgICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KHN0b3JhZ2VLZXkpICsgXCI9XCIgKyBsZXZlbE5hbWUgKyBcIjtcIjtcbiAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGdldFBlcnNpc3RlZExldmVsKCkge1xuICAgICAgICAgIHZhciBzdG9yZWRMZXZlbDtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHN0b3JlZExldmVsID0gd2luZG93LmxvY2FsU3RvcmFnZVtzdG9yYWdlS2V5XTtcbiAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XG5cbiAgICAgICAgICBpZiAodHlwZW9mIHN0b3JlZExldmVsID09PSB1bmRlZmluZWRUeXBlKSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICB2YXIgY29va2llID0gd2luZG93LmRvY3VtZW50LmNvb2tpZTtcbiAgICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IGNvb2tpZS5pbmRleE9mKFxuICAgICAgICAgICAgICAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChzdG9yYWdlS2V5KSArIFwiPVwiKTtcbiAgICAgICAgICAgICAgICAgIGlmIChsb2NhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgIHN0b3JlZExldmVsID0gL14oW147XSspLy5leGVjKGNvb2tpZS5zbGljZShsb2NhdGlvbikpWzFdO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gSWYgdGhlIHN0b3JlZCBsZXZlbCBpcyBub3QgdmFsaWQsIHRyZWF0IGl0IGFzIGlmIG5vdGhpbmcgd2FzIHN0b3JlZC5cbiAgICAgICAgICBpZiAoc2VsZi5sZXZlbHNbc3RvcmVkTGV2ZWxdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHN0b3JlZExldmVsO1xuICAgICAgfVxuXG4gICAgICAvKlxuICAgICAgICpcbiAgICAgICAqIFB1YmxpYyBBUElcbiAgICAgICAqXG4gICAgICAgKi9cblxuICAgICAgc2VsZi5sZXZlbHMgPSB7IFwiVFJBQ0VcIjogMCwgXCJERUJVR1wiOiAxLCBcIklORk9cIjogMiwgXCJXQVJOXCI6IDMsXG4gICAgICAgICAgXCJFUlJPUlwiOiA0LCBcIlNJTEVOVFwiOiA1fTtcblxuICAgICAgc2VsZi5tZXRob2RGYWN0b3J5ID0gZmFjdG9yeSB8fCBkZWZhdWx0TWV0aG9kRmFjdG9yeTtcblxuICAgICAgc2VsZi5nZXRMZXZlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gY3VycmVudExldmVsO1xuICAgICAgfTtcblxuICAgICAgc2VsZi5zZXRMZXZlbCA9IGZ1bmN0aW9uIChsZXZlbCwgcGVyc2lzdCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgbGV2ZWwgPT09IFwic3RyaW5nXCIgJiYgc2VsZi5sZXZlbHNbbGV2ZWwudG9VcHBlckNhc2UoKV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBsZXZlbCA9IHNlbGYubGV2ZWxzW2xldmVsLnRvVXBwZXJDYXNlKCldO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodHlwZW9mIGxldmVsID09PSBcIm51bWJlclwiICYmIGxldmVsID49IDAgJiYgbGV2ZWwgPD0gc2VsZi5sZXZlbHMuU0lMRU5UKSB7XG4gICAgICAgICAgICAgIGN1cnJlbnRMZXZlbCA9IGxldmVsO1xuICAgICAgICAgICAgICBpZiAocGVyc2lzdCAhPT0gZmFsc2UpIHsgIC8vIGRlZmF1bHRzIHRvIHRydWVcbiAgICAgICAgICAgICAgICAgIHBlcnNpc3RMZXZlbElmUG9zc2libGUobGV2ZWwpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlcGxhY2VMb2dnaW5nTWV0aG9kcy5jYWxsKHNlbGYsIGxldmVsLCBuYW1lKTtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSB1bmRlZmluZWRUeXBlICYmIGxldmVsIDwgc2VsZi5sZXZlbHMuU0lMRU5UKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBjb25zb2xlIGF2YWlsYWJsZSBmb3IgbG9nZ2luZ1wiO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhyb3cgXCJsb2cuc2V0TGV2ZWwoKSBjYWxsZWQgd2l0aCBpbnZhbGlkIGxldmVsOiBcIiArIGxldmVsO1xuICAgICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHNlbGYuc2V0RGVmYXVsdExldmVsID0gZnVuY3Rpb24gKGxldmVsKSB7XG4gICAgICAgICAgaWYgKCFnZXRQZXJzaXN0ZWRMZXZlbCgpKSB7XG4gICAgICAgICAgICAgIHNlbGYuc2V0TGV2ZWwobGV2ZWwsIGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBzZWxmLmVuYWJsZUFsbCA9IGZ1bmN0aW9uKHBlcnNpc3QpIHtcbiAgICAgICAgICBzZWxmLnNldExldmVsKHNlbGYubGV2ZWxzLlRSQUNFLCBwZXJzaXN0KTtcbiAgICAgIH07XG5cbiAgICAgIHNlbGYuZGlzYWJsZUFsbCA9IGZ1bmN0aW9uKHBlcnNpc3QpIHtcbiAgICAgICAgICBzZWxmLnNldExldmVsKHNlbGYubGV2ZWxzLlNJTEVOVCwgcGVyc2lzdCk7XG4gICAgICB9O1xuXG4gICAgICAvLyBJbml0aWFsaXplIHdpdGggdGhlIHJpZ2h0IGxldmVsXG4gICAgICB2YXIgaW5pdGlhbExldmVsID0gZ2V0UGVyc2lzdGVkTGV2ZWwoKTtcbiAgICAgIGlmIChpbml0aWFsTGV2ZWwgPT0gbnVsbCkge1xuICAgICAgICAgIGluaXRpYWxMZXZlbCA9IGRlZmF1bHRMZXZlbCA9PSBudWxsID8gXCJXQVJOXCIgOiBkZWZhdWx0TGV2ZWw7XG4gICAgICB9XG4gICAgICBzZWxmLnNldExldmVsKGluaXRpYWxMZXZlbCwgZmFsc2UpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICpcbiAgICAgKiBQYWNrYWdlLWxldmVsIEFQSVxuICAgICAqXG4gICAgICovXG5cbiAgICB2YXIgZGVmYXVsdExvZ2dlciA9IG5ldyBMb2dnZXIoKTtcblxuICAgIHZhciBfbG9nZ2Vyc0J5TmFtZSA9IHt9O1xuICAgIGRlZmF1bHRMb2dnZXIuZ2V0TG9nZ2VyID0gZnVuY3Rpb24gZ2V0TG9nZ2VyKG5hbWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiIHx8IG5hbWUgPT09IFwiXCIpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiWW91IG11c3Qgc3VwcGx5IGEgbmFtZSB3aGVuIGNyZWF0aW5nIGEgbG9nZ2VyLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsb2dnZXIgPSBfbG9nZ2Vyc0J5TmFtZVtuYW1lXTtcbiAgICAgICAgaWYgKCFsb2dnZXIpIHtcbiAgICAgICAgICBsb2dnZXIgPSBfbG9nZ2Vyc0J5TmFtZVtuYW1lXSA9IG5ldyBMb2dnZXIoXG4gICAgICAgICAgICBuYW1lLCBkZWZhdWx0TG9nZ2VyLmdldExldmVsKCksIGRlZmF1bHRMb2dnZXIubWV0aG9kRmFjdG9yeSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxvZ2dlcjtcbiAgICB9O1xuXG4gICAgLy8gR3JhYiB0aGUgY3VycmVudCBnbG9iYWwgbG9nIHZhcmlhYmxlIGluIGNhc2Ugb2Ygb3ZlcndyaXRlXG4gICAgdmFyIF9sb2cgPSAodHlwZW9mIHdpbmRvdyAhPT0gdW5kZWZpbmVkVHlwZSkgPyB3aW5kb3cubG9nIDogdW5kZWZpbmVkO1xuICAgIGRlZmF1bHRMb2dnZXIubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gdW5kZWZpbmVkVHlwZSAmJlxuICAgICAgICAgICAgICAgd2luZG93LmxvZyA9PT0gZGVmYXVsdExvZ2dlcikge1xuICAgICAgICAgICAgd2luZG93LmxvZyA9IF9sb2c7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVmYXVsdExvZ2dlcjtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGRlZmF1bHRMb2dnZXI7XG59KSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbG9nbGV2ZWwvbGliL2xvZ2xldmVsLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGlzYXNzZW1ibGVyXG57XG4gIGNvbnN0cnVjdG9yKClcbiAge1xuICB9XG5cbiAgZGVjb2RlKGluc3RyKVxuICB7XG4gICAgbGV0IGxpc3QgPSBBcnJheS5pc0FycmF5KGluc3RyKSA/IGluc3RyIDogW2luc3RyXTtcbiAgICBsZXQgb3V0ID0gW107XG5cbiAgICBmb3IgKGxldCBpIG9mIGxpc3QpXG4gICAge1xuICAgICAgbGV0IGQgPSB0aGlzLl9kZWNvZGVfc2luZ2xlKGkpO1xuICAgICAgZC5pID0gYDB4JHtoZXgoaSl9YDtcbiAgICAgIG91dC5wdXNoKGQpO1xuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBleHBsb2RlKGluc3RyX2RhdGEsIGZyb21faW5zdHIsIHNpemUpXG4gIHtcbiAgICBsZXQgdG9fZGVjb2RlID0gW107XG4gICAgZm9yIChsZXQgdD1mcm9tX2luc3RyLShzaXplKjIpOyB0PD1mcm9tX2luc3RyKyhzaXplKjIpOyB0Kz0yKVxuICAgIHtcbiAgICAgIHRvX2RlY29kZS5wdXNoKGluc3RyX2RhdGEucmVhZFdvcmQodCkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5kZWNvZGUodG9fZGVjb2RlKTtcbiAgfVxuXG4gIF9kZWNvZGVfc2luZ2xlKGluc3RyKVxuICB7XG4gICAgICBsZXQgbWFqb3IgPSAoaW5zdHIgPj4gMTIpICYgMHhmO1xuICAgICAgbGV0IG1pbm9yID0gaW5zdHIgJiAweGZmZjtcblxuICAgICAgLy8gZS5nLiA1WFkwOiBqcnEgdngsIHZ5XG4gICAgICBsZXQgbWluMCA9IChtaW5vciA+PiA4KSAmIDB4ZjsgIC8vIFhcbiAgICAgIGxldCBtaW4xID0gKG1pbm9yID4+IDQpICYgMHhmOyAgLy8gWVxuICAgICAgbGV0IG1pbjIgPSBtaW5vciAmIDB4ZjsgICAgICAgICAvLyAwXG4gICAgICBsZXQgbWluMTIgPSBtaW5vciAmIDB4ZmY7ICAgICAgIC8vIFkwXG5cbiAgICAgIHN3aXRjaChtYWpvcilcbiAgICAgIHtcbiAgICAgICAgY2FzZSAweDA6XG4gICAgICAgICAgc3dpdGNoKG1pbm9yKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNhc2UgMHhlMDogcmV0dXJuIHttOiBcImNsc1wiLCBkOlwiQ2xlYXIgc2NyZWVuXCJ9OyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMHhlZTogcmV0dXJuIHttOiBcInJldFwiLCBkOlwiUmV0dXJuIGZyb20gc3Vicm91dGluZSBbc3RhY2tdXCJ9OyBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiB7bTogYHN5cyAke21pbm9yLnRvU3RyaW5nKDE2KX1gLCBkOlwiSnVtcCB0byByb3V0aW5lIGF0IGFkZHJlc3MgW2xlZ2FjeTsgaWdub3JlZCBieSBpbnRlcnByZXRlcl1cIn07YnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4MTogcmV0dXJuIHttOiBgam1wIDB4JHtoZXgobWlub3IpfWAsIGQ6XCJKdW1wIHRvIGFkZHJlc3NcIn07ICAgICAgICAgICAgIC8vIDFubm5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweDI6IHJldHVybiB7bTogYGNhbGwgMHgke2hleChtaW5vcil9YCwgZDpcIkNhbGwgc3Vicm91dGluZSBbc3RhY2tdXCJ9OyAgICAgICAgICAgIC8vIDJubm5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweDM6IHJldHVybiB7bTogYGplcSB2JHtoZXgobWluMCl9LCAke21pbjEyfWAsIGQ6XCJKdW1wIG92ZXIgbmV4dCBpbnN0cnVjdGlvbiBpZiBvcGVyYW5kcyBlcXVhbFwifTsgICAvLyAzeG5uXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHg0OiByZXR1cm4ge206IGBqbnEgdiR7aGV4KG1pbjApfSwgJHttaW4xMn1gLCBkOlwiSnVtcCBvdmVyIG5leHQgaW5zdHJ1Y3Rpb24gaWYgb3BlcmFuZHMgbm90IGVxdWFsXCJ9OyAgIC8vIDR4bm5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweDU6IHJldHVybiB7bTogYGpyZSB2JHtoZXgobWluMCl9LCB2JHtoZXgobWluMSl9YCwgZDpcIkp1bXAgb3ZlciBuZXh0IGluc3RydWN0aW9uIGlmIHJlZ2lzdGVycyBlcXVhbFwifTsvLyA1eHkwXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHg2OiByZXR1cm4ge206IGBtb3YgdiR7aGV4KG1pbjApfSwgJHttaW4xMn1gLCBkOlwiTW92ZSBjb25zdGFudCBpbnRvIHJlZ2lzdGVyXCJ9OzsgICAvLyA2eG5uXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHg3OiByZXR1cm4ge206IGBhZGQgdiR7aGV4KG1pbjApfSwgJHttaW4xMn1gLCBkOlwiQWRkIGNvbnN0YW50IHRvIHJlZ2lzdGVyXCJ9OzsgICAvLyA3eG5uXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHg4OlxuICAgICAgICAgIHN3aXRjaCAobWluMilcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjYXNlIDB4MDogcmV0dXJuIHttOiBgbW92IHYke2hleChtaW4wKX0sIHYke2hleChtaW4xKX1gLCBkOiBcIk1vdmUgcmVnaXN0ZXIgaW50byByZWdpc3RlclwifTsgYnJlYWs7ICAgLy8gOHh5MFxuICAgICAgICAgICAgY2FzZSAweDE6IHJldHVybiB7bTogYG9yIHYke2hleChtaW4wKX0sIHYke2hleChtaW4xKX1gLCBkOiBcIk9SIHJlZ2lzdGVyIHdpdGggcmVnaXN0ZXJcIn07IGJyZWFrOyAgICAvLyA4eHkxXG4gICAgICAgICAgICBjYXNlIDB4MjogcmV0dXJuIHttOiBgYW5kIHYke2hleChtaW4wKX0sIHYke2hleChtaW4xKX1gLCBkOiBcIkFORCByZWdpc3RlciB3aXRoIHJlZ2lzdGVyXCJ9OyBicmVhazsgICAvLyA4eHkyXG4gICAgICAgICAgICBjYXNlIDB4MzogcmV0dXJuIHttOiBgeG9yIHYke2hleChtaW4wKX0sIHYke2hleChtaW4xKX1gLCBkOiBcIlhPUiByZWdpc3RlciB3aXRoIHJlZ2lzdGVyXCJ9OyBicmVhazsgICAvLyA4eHkyXG4gICAgICAgICAgICBjYXNlIDB4NDogcmV0dXJuIHttOiBgYWRkIHYke2hleChtaW4wKX0sIHYke2hleChtaW4xKX1gLCBkOiBcIkFkZCByZWdpc3RlciB0byByZWdpc3RlclwifTsgYnJlYWs7ICAgLy8gOHh5NFxuICAgICAgICAgICAgY2FzZSAweDU6IHJldHVybiB7bTogYHN1YiB2JHtoZXgobWluMCl9LCB2JHtoZXgobWluMSl9YCwgZDogXCJTdWJ0cmFjdCByZWdpc3RlciBmcm9tIHJlZ2lzdGVyXCJ9OyBicmVhazsgICAvLyA4eHk1XG4gICAgICAgICAgICBjYXNlIDB4NjogcmV0dXJuIHttOiBgc2hyIHYke2hleChtaW4wKX1gLCBkOiBcIlNoaWZ0IHJpZ2h0IHJlZ2lzdGVyXCJ9OyBicmVhazsgICAgICAgICAgICAgICAgICAvLyA4eDA2XG4gICAgICAgICAgICBjYXNlIDB4NzogcmV0dXJuIHttOiBgcnNiIHYke2hleChtaW4wKX0sIHYke2hleChtaW4xKX1gLCBkOiBcIlJldmVyc2Ugc3VidHJhY3QgcmVnaXN0ZXIgZnJvbSByZWdpc3RlclwifTsgYnJlYWs7ICAgLy8gOHh5N1xuICAgICAgICAgICAgY2FzZSAweGU6IHJldHVybiB7bTogYHNobCB2JHtoZXgobWluMCl9YCwgZDogXCJTaGlmdCBsZWZ0IHJlZ2lzdGVyXCJ9OyBicmVhazsgICAgICAgICAgICAgICAgICAvLyA4eDBlXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4OTogcmV0dXJuIHttOiBganJuIHYke2hleChtaW4wKX0sIHYke2hleChtaW4xKX1gLCBkOiBcIkp1bXAgb3ZlciBuZXh0IGluc3RydWN0aW9uIGlmIHJlZ2lzdGVyIG5vdCBlcXVhbFwifTsgICAgICAgICAgICAgLy8gOXh5MFxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4QTogcmV0dXJuIHttOiBgbW92IGksIDB4JHtoZXgobWlub3IpfWAsIGQ6XCJNb3ZlIGNvbnN0YW50IGludG8gSW5kZXggcmVnaXN0ZXJcIn07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHhCOiByZXR1cm4ge206IGBqcmwgMHgke2hleChtaW5vcil9YCwgZDpcIkp1bXAgdG8gYWRkcmVzcyBnaXZlbiBieSBjb25zdGFudCArIHYwIHJlZ2lzdGVyXCJ9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHhDOiByZXR1cm4ge206IGBybmQgdiR7aGV4KG1pbjApfSwgMHgke2hleChtaW4xMil9YCwgZDpcIlJhbmRvbSBudW1iZXIgQU5EIHdpdGggY29uc3RhbnQgaW50byByZWdpc3RlclwifVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4RDogcmV0dXJuIHttOiBgZHJ3IHYke2hleChtaW4wKX0sIHYke2hleChtaW4xKX0sICR7KG1pbjIpfWAsIGQ6XCJEcmF3IHNwcml0ZSBhdCByZWdpc3RlcnMgbG9jYXRpb24gb2Ygc2l6ZSBjb25zdGFudFwifVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4RTpcbiAgICAgICAgICBzd2l0Y2gobWluMTIpXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2FzZSAweDlFOiByZXR1cm4ge206IGBqa3AgdiR7aGV4KG1pbjApfWAsIGQ6XCJKdW1wIGlmIGtleSBjb2RlIGluIHJlZ2lzdGVyIHByZXNzZWRcIn1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDB4QTE6IHJldHVybiB7bTogYGprbiB2JHtoZXgobWluMCl9YCwgZDpcIkp1bXAgaWYga2V5IGNvZGUgaW4gcmVnaXN0ZXIgbm90IHByZXNzZWRcIn1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4RjpcbiAgICAgICAgICBzd2l0Y2gobWluMTIpXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2FzZSAweDA3OiByZXR1cm4ge206IGBsZHQgdiR7aGV4KG1pbjApfWAsIGQ6XCJMb2FkIGRlbGF5IHRpbWVyIHZhbHVlIGludG8gcmVnaXN0ZXJcIn1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDB4MEE6IHJldHVybiB7bTogYHdhaXQgdiR7aGV4KG1pbjApfWAsIGQ6XCJXYWl0IGZvciBhIGtleSBwcmVzcywgc3RvcmUga2V5IGluIHJlZ2lzdGVyXCJ9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAweDE1OiByZXR1cm4ge206IGBzZHQgdiR7aGV4KG1pbjApfWAsIGQ6XCJTZXQgZGVsYXkgdGltZXIgZnJvbSByZWdpc3RlclwifVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMHgxODogcmV0dXJuIHttOiBgc3N0IHYke2hleChtaW4wKX1gLCBkOlwiU2V0IHNvdW5kIHRpbWVyIGZyb20gcmVnaXN0ZXJcIn1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDB4MUU6IHJldHVybiB7bTogYGFkaSB2JHtoZXgobWluMCl9YCwgZDpcIkFkZCByZWdpc3RlciB2YWx1ZSB0byBJbmRleCByZWdpc3RlclwifVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMHgyOTogcmV0dXJuIHttOiBgbGRpIHYke2hleChtaW4wKX1gLCBkOlwiTG9hZCBJbmRleCByZWdpc3RlciB3aXRoIHNwcml0ZSBhZGRyZXNzIG9mIGRpZ2l0IGluIHJlZ2lzdGVyXCJ9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAweDMzOiByZXR1cm4ge206IGBiY2QgdiR7aGV4KG1pbjApfWAsIGQ6XCJTdG9yZSBCQ0Qgb2YgcmVnaXN0ZXIgc3RhcnRpbmcgYXQgYmFzZSBhZGRyZXNzIEluZGV4XCJ9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAweDU1OiByZXR1cm4ge206IGBzdHIgdiR7aGV4KG1pbjApfWAsIGQ6XCJTdG9yZSByZWdpc3RlcnMgZnJvbSB2MCB0byByZWdpc3RlciBvcGVyYW5kIGF0IGJhc2UgYWRkcmVzcyBJbmRleFwifVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMHg2NTogcmV0dXJuIHttOiBgbGRyIHYke2hleChtaW4wKX1gLCBkOlwiU2V0IHJlZ2lzdGVycyBmcm9tIHYwIHRvIHJlZ2lzdGVyIG9wZXJhbmQgd2l0aCB2YWx1ZXMgZnJvbSBiYXNlIGFkZHJlc3MgSW5kZXhcIn1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgZGVmYXVsdDogcmV0dXJuIHttOmBVbmtub3duIG9wY29kZSAke2hleChpbnN0cil9YCwgZDpcIlVua25vd24vaWxsZWdhbCBpbnN0cnVjdGlvblwifTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGhleChuKSB7IHJldHVybiBuLnRvU3RyaW5nKDE2KTsgfVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3lzdGVtL2Rpc2FzbS5qcyIsIlxuaW1wb3J0IGxvZyAgICAgICAgICAgICAgICBmcm9tICdsb2dsZXZlbCc7XG5cbmNvbnN0IERJU1BMQVlfV0lEVEggPSA2NCwgRElTUExBWV9IRUlHSFQgPSAzMjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyZXJcbntcbiAgY29uc3RydWN0b3IoZWxlbWVudCwgc2NhbGU9MSlcbiAge1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgLy90aGlzLnZpZGVvID0gdmlkZW87ICAvLyBwaXhlbCBidWZmZXIgb2YgdGhlIENoaXA4IHN5c3RlbSBpbiBieXRlc1xuXG4gICAgdGhpcy5zY2FsZSA9IE1hdGguZmxvb3IoTWF0aC5hYnMoc2NhbGUpKSB8fCAxO1xuXG4gICAgLy90aGlzLnZpZGVvZGltID0gZGltZW5zaW9ucztcbiAgICB0aGlzLmRpbSA9IHt3aWR0aDogRElTUExBWV9XSURUSCAqIHRoaXMuc2NhbGUsIGhlaWdodDogRElTUExBWV9IRUlHSFQgKiB0aGlzLnNjYWxlIH07XG5cbiAgICB0aGlzLnJlbmRlckNvbnRleHQgPSB0aGlzLmVsZW1lbnQuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG4gICAgLy9sb2cuZGVidWcoYFZpZGVvIHNpemUgJHt0aGlzLnZpZGVvLmxlbmd0aH0gYnl0ZXMsIHdpZHRoOiAke3RoaXMuZGltLndpZHRofSwgaGVpZ2h0OiAke3RoaXMuZGltLmhlaWdodH1gKTtcbiAgICB0aGlzLmVsZW1lbnQud2lkdGggPSB0aGlzLmRpbS53aWR0aDtcbiAgICB0aGlzLmVsZW1lbnQuaGVpZ2h0ID0gdGhpcy5kaW0uaGVpZ2h0O1xuXG4gICAgdGhpcy5waXhlbF9vbiA9IHRoaXMucmVuZGVyQ29udGV4dC5jcmVhdGVJbWFnZURhdGEodGhpcy5zY2FsZSx0aGlzLnNjYWxlKTtcbiAgICBsZXQgZCAgPSB0aGlzLnBpeGVsX29uLmRhdGE7XG4gICAgZm9yIChsZXQgbz0wOyBvPHNjYWxlKnNjYWxlKjQ7IG8rKylcbiAgICAgICAgZFtvXSAgID0gMjU1O1xuXG4gICAgdGhpcy5waXhlbF9vZmYgPSB0aGlzLnJlbmRlckNvbnRleHQuY3JlYXRlSW1hZ2VEYXRhKHRoaXMuc2NhbGUsdGhpcy5zY2FsZSk7XG4gICAgZCAgPSB0aGlzLnBpeGVsX29mZi5kYXRhO1xuICAgIGZvciAobGV0IG89MDsgbzxzY2FsZSpzY2FsZSo0OyBvKz00KVxuICAgIHtcbiAgICAgICAgZFtvKzBdICAgPSAwO1xuICAgICAgICBkW28rMV0gICA9IDA7XG4gICAgICAgIGRbbysyXSAgID0gMDtcbiAgICAgICAgZFtvKzNdICAgPSAyNTU7XG4gICAgfVxuXG4gICAgLy90aGlzLmRpcnR5ID0gZmFsc2U7XG4gIH1cblxuICBEaXJ0eSgpXG4gIHtcbiAgICAvL3RoaXMuZGlydHkgPSB0cnVlO1xuICB9XG5cbiAgUmVuZGVyKGZyYW1lQnVmZmVyKVxuICB7XG4gICAgLy9pZiAoIXRoaXMuZGlydHkpIHJldHVybjtcblxuICAgIHZhciBvID0gMDtcbiAgICBmb3IgKGxldCB5PTA7IHk8RElTUExBWV9IRUlHSFQ7IHkrKylcbiAgICB7XG4gICAgICBmb3IgKGxldCB4PTA7IHg8RElTUExBWV9XSURUSDsgeCsrKVxuICAgICAge1xuICAgICAgICBsZXQgdiA9IGZyYW1lQnVmZmVyW28rK107XG4gICAgICAgIGxldCBwID0gdiA/IHRoaXMucGl4ZWxfb24gOiB0aGlzLnBpeGVsX29mZlxuICAgICAgICB0aGlzLnJlbmRlckNvbnRleHQucHV0SW1hZ2VEYXRhKHAsIHRoaXMuc2NhbGUqeCwgdGhpcy5zY2FsZSp5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy90aGlzLmRpcnR5ID0gZmFsc2U7XG4gIH1cblxuXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9kb20vcmVuZGVyZXIuanMiLCJpbXBvcnQgbG9nIGZyb20gJ2xvZ2xldmVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5wdXRcbntcbiAgLy8gTm90ZSwgdGhlIGtleXN0YXRlcyBhcmUgd3JpdHRlbiBkaXJlY2x0eSBpbnRvIHRoZSBDaGlwOCdzIEJJT1MvUkFNXG4gIC8vIGZvciBkaXJlY3QgYWNjZXNzIGJ5IHRoZSBDUFVcblxuICBjb25zdHJ1Y3RvcihjYWxsYmFjaylcbiAge1xuICAgIC8vIDEgMiAzIENcbiAgICAvLyA0IDUgNiBEXG4gICAgLy8gNyA4IDkgRVxuICAgIC8vIEEgMCBCIEZcbiAgICAvLyB0aGlzLmtleU1hcCA9IFtcbiAgICAvLyAgIDE6JzEnLCAyOicyJywgMzonMycsIGM6JzQnLFxuICAgIC8vICAgNDoncScsIDU6J3cnLCA2OidlJywgZDoncicsXG4gICAgLy8gICA3OidhJywgODoncycsIDk6J2QnLCBlOidmJyxcbiAgICAvLyAgIDEwOid6JywgOjAneCcsIEI6J2MnLCBmOid2J1xuICAgIC8vIF07XG5cbiAgICB0aGlzLmtleURhdGEgPSBuZXcgVWludDhBcnJheSgxNik7XG4gICAgdGhpcy5fY2FsbGJhY2sgPSBjYWxsYmFjaztcblxuICAgIHRoaXMua2V5TWFwID0gW1xuICAgICAgJ3gnLCAnMScsICcyJywgJzMnLFxuICAgICAgJ3EnLCAndycsICdlJywgJ2EnLFxuICAgICAgJ3MnLCAnZCcsICd6JywgJ2MnLFxuICAgICAgJzQnLCAncicsICdmJywgJ3YnXG4gICAgXTtcblxuICAgIHRoaXMuX2luaXQoKTtcbiAgfVxuXG4gIF9zZXRLZXlEb3duKGtleSlcbiAge1xuICAgICAgdGhpcy5rZXlEYXRhW2tleV0gPSAxO1xuICAgICAgaWYgKHRoaXMuX2NhbGxiYWNrKSB0aGlzLl9jYWxsYmFjayh0aGlzLmtleURhdGEpO1xuICB9XG5cbiAgX3NldEtleVVwKGtleSlcbiAge1xuICAgICAgdGhpcy5rZXlEYXRhW2tleV0gPSAwO1xuICAgICAgaWYgKHRoaXMuX2NhbGxiYWNrKSB0aGlzLl9jYWxsYmFjayh0aGlzLmtleURhdGEpO1xuICB9XG5cbiAgX2luaXQoKVxuICB7XG4gICAgLy9IQUNLOiBjb252ZXJ0IGFycmF5IGludG8gaW50ZWdlciBhc2NpaSBjb2RlcyBmb3IgcXVpY2tlciBsb29rdXBcbiAgICBmb3IgKGxldCBrPTA7azx0aGlzLmtleU1hcC5sZW5ndGg7aysrKVxuICAgICAgdGhpcy5rZXlNYXBba10gPSB0aGlzLmtleU1hcFtrXS5jaGFyQ29kZUF0KDApO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgICAgdmFyIGNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUua2V5Q29kZSkudG9Mb3dlckNhc2UoKS5jaGFyQ29kZUF0KDApXG4gICAgICBmb3IgKGxldCBrPTA7IGs8dGhpcy5rZXlNYXAubGVuZ3RoOyBrKyspXG4gICAgICB7XG4gICAgICAgIGlmICh0aGlzLmtleU1hcFtrXSA9PSBjb2RlKVxuICAgICAgICAgIHRoaXMuX3NldEtleURvd24oayk7XG4gICAgICB9XG4gICAgICAvL3RoaXMucHJpbnRUYWJsZSgpO1xuICAgIH0sIHRydWUpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGUpID0+IHtcbiAgICAgIC8vbG9nLndhcm4oKTtcbiAgICAgIHZhciBjb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLmtleUNvZGUpLnRvTG93ZXJDYXNlKCkuY2hhckNvZGVBdCgwKVxuICAgICAgZm9yIChsZXQgaz0wOyBrPHRoaXMua2V5TWFwLmxlbmd0aDsgaysrKVxuICAgICAge1xuICAgICAgICBpZiAodGhpcy5rZXlNYXBba10gPT0gY29kZSlcbiAgICAgICAgICB0aGlzLl9zZXRLZXlVcChrKTtcbiAgICAgIH1cbiAgICB9LCB0cnVlKTtcblxuICB9XG5cblxuXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9kb20vaW5wdXQuanMiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gbmV3IFdvcmtlcihfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiMWM5NjJjZWNlY2MyMjNmNmIwMDMud29ya2VyLmpzXCIpO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vd29ya2VyLWxvYWRlciEuL2NoaXA4LXdvcmtlci5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9