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
	
	var btnHalt = document.getElementById('btnstopdump');
	var btnPause = document.getElementById('btnpause');
	var btnStep = document.getElementById('btnstep');
	var btnResume = document.getElementById('btnresume');
	
	var disasm = new _disasm2.default();
	var keyboard = new _input2.default(inputSignal);
	var renderer = new _renderer2.default(document.getElementById('display'), DISPLAY_SCALE);
	
	_loglevel2.default.info('CHIP-8 Virtual Machine');
	
	var emuWorker = new _chip8Worker2.default();
	
	emuWorker.addEventListener('message', function (message) {
	  switch (message.data.action) {
	    case 'render':
	      renderer.Render(message.data.args.frameBuffer);
	      break;
	    case 'error':
	      var _message$data$args = message.data.args,
	          trace = _message$data$args.trace,
	          address = _message$data$args.address,
	          error = _message$data$args.error,
	          registers = _message$data$args.registers;
	
	      var trace_instructions = disasm.decode(trace.i);
	
	      _loglevel2.default.error(error);
	
	      for (var t = 0; t < trace.i.length; t++) {
	        var o = '[' + trace.a[t].toString(16) + '] (0x' + trace.i[t].toString(16) + ') ' + trace_instructions[t].m + ' \t\t\t\t\t ' + trace_instructions[t].d;
	        if (trace.a[t] == address) _loglevel2.default.error(o);else _loglevel2.default.debug(o);
	      }
	      _loglevel2.default.error(registers);
	      break;
	  }
	});
	
	function inputSignal(keyState) {
	  emuWorker.postMessage({ action: 'input', args: { keyState: keyState } });
	}
	
	btnHalt.onclick = function () {
	  emuWorker.postMessage({ action: 'haltdump' });
	};
	
	btnPause.onclick = function () {
	  emuWorker.postMessage({ action: 'pause' });
	};
	
	btnStep.onclick = function () {
	  emuWorker.postMessage({ action: 'step' });
	};
	
	btnResume.onclick = function () {
	  emuWorker.postMessage({ action: 'resume' });
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
		return new Worker(__webpack_require__.p + "d7385a3b9f7677b682b0.worker.js");
	};

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODkzMGYyMTVkNTAxMDYxNWQwNTMiLCJ3ZWJwYWNrOi8vLy4vbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZ2xldmVsL2xpYi9sb2dsZXZlbC5qcyIsIndlYnBhY2s6Ly8vLi9zeXN0ZW0vZGlzYXNtLmpzIiwid2VicGFjazovLy8uL2RvbS9yZW5kZXJlci5qcyIsIndlYnBhY2s6Ly8vLi9kb20vaW5wdXQuanMiLCJ3ZWJwYWNrOi8vLy4vY2hpcDgtd29ya2VyLmpzIl0sIm5hbWVzIjpbIkRJU1BMQVlfU0NBTEUiLCJidG5IYWx0IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImJ0blBhdXNlIiwiYnRuU3RlcCIsImJ0blJlc3VtZSIsImRpc2FzbSIsImtleWJvYXJkIiwiaW5wdXRTaWduYWwiLCJyZW5kZXJlciIsImluZm8iLCJlbXVXb3JrZXIiLCJhZGRFdmVudExpc3RlbmVyIiwibWVzc2FnZSIsImRhdGEiLCJhY3Rpb24iLCJSZW5kZXIiLCJhcmdzIiwiZnJhbWVCdWZmZXIiLCJ0cmFjZSIsImFkZHJlc3MiLCJlcnJvciIsInJlZ2lzdGVycyIsInRyYWNlX2luc3RydWN0aW9ucyIsImRlY29kZSIsImkiLCJ0IiwibGVuZ3RoIiwibyIsImEiLCJ0b1N0cmluZyIsIm0iLCJkIiwiZGVidWciLCJrZXlTdGF0ZSIsInBvc3RNZXNzYWdlIiwib25jbGljayIsIkRpc2Fzc2VtYmxlciIsImluc3RyIiwibGlzdCIsIkFycmF5IiwiaXNBcnJheSIsIm91dCIsIl9kZWNvZGVfc2luZ2xlIiwiaGV4IiwicHVzaCIsImluc3RyX2RhdGEiLCJmcm9tX2luc3RyIiwic2l6ZSIsInRvX2RlY29kZSIsInJlYWRXb3JkIiwibWFqb3IiLCJtaW5vciIsIm1pbjAiLCJtaW4xIiwibWluMiIsIm1pbjEyIiwibiIsIkRJU1BMQVlfV0lEVEgiLCJESVNQTEFZX0hFSUdIVCIsIlJlbmRlcmVyIiwiZWxlbWVudCIsInNjYWxlIiwiTWF0aCIsImZsb29yIiwiYWJzIiwiZGltIiwid2lkdGgiLCJoZWlnaHQiLCJyZW5kZXJDb250ZXh0IiwiZ2V0Q29udGV4dCIsInBpeGVsX29uIiwiY3JlYXRlSW1hZ2VEYXRhIiwicGl4ZWxfb2ZmIiwieSIsIngiLCJ2IiwicCIsInB1dEltYWdlRGF0YSIsIklucHV0IiwiY2FsbGJhY2siLCJrZXlEYXRhIiwiVWludDhBcnJheSIsIl9jYWxsYmFjayIsImtleU1hcCIsIl9pbml0Iiwia2V5IiwiayIsImNoYXJDb2RlQXQiLCJ3aW5kb3ciLCJlIiwiY29kZSIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsImtleUNvZGUiLCJ0b0xvd2VyQ2FzZSIsIl9zZXRLZXlEb3duIiwiX3NldEtleVVwIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7O0FDckNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLEtBQU1BLGdCQUFnQixFQUF0Qjs7QUFFQSxLQUFJQyxVQUFZQyxTQUFTQyxjQUFULENBQXdCLGFBQXhCLENBQWhCO0FBQ0EsS0FBSUMsV0FBWUYsU0FBU0MsY0FBVCxDQUF3QixVQUF4QixDQUFoQjtBQUNBLEtBQUlFLFVBQVlILFNBQVNDLGNBQVQsQ0FBd0IsU0FBeEIsQ0FBaEI7QUFDQSxLQUFJRyxZQUFZSixTQUFTQyxjQUFULENBQXdCLFdBQXhCLENBQWhCOztBQUVBLEtBQUlJLFNBQVksc0JBQWhCO0FBQ0EsS0FBSUMsV0FBWSxvQkFBVUMsV0FBVixDQUFoQjtBQUNBLEtBQUlDLFdBQVksdUJBQWFSLFNBQVNDLGNBQVQsQ0FBd0IsU0FBeEIsQ0FBYixFQUFpREgsYUFBakQsQ0FBaEI7O0FB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QUFYO0FBQ0EsY0FBSyxJQUFJRCxLQUFFLENBQVgsRUFBY0EsS0FBRSxNQUFLSCxNQUFMLENBQVl6RCxNQUE1QixFQUFvQzRELElBQXBDLEVBQ0E7QUFDRSxlQUFJLE1BQUtILE1BQUwsQ0FBWUcsRUFBWixLQUFrQkksSUFBdEIsRUFDRSxNQUFLSyxXQUFMLENBQWlCVCxFQUFqQjtBQUNIO0FBQ0Q7QUFDRCxRQVJELEVBUUcsSUFSSDs7QUFVQUUsY0FBTzdFLGdCQUFQLENBQXdCLE9BQXhCLEVBQWlDLFVBQUM4RSxDQUFELEVBQU87QUFDdEM7QUFDQSxhQUFJQyxPQUFPQyxPQUFPQyxZQUFQLENBQW9CSCxFQUFFSSxPQUF0QixFQUErQkMsV0FBL0IsR0FBNkNQLFVBQTdDLENBQXdELENBQXhELENBQVg7QUFDQSxjQUFLLElBQUlELE1BQUUsQ0FBWCxFQUFjQSxNQUFFLE1BQUtILE1BQUwsQ0FBWXpELE1BQTVCLEVBQW9DNEQsS0FBcEMsRUFDQTtBQUNFLGVBQUksTUFBS0gsTUFBTCxDQUFZRyxHQUFaLEtBQWtCSSxJQUF0QixFQUNFLE1BQUtNLFNBQUwsQ0FBZVYsR0FBZjtBQUNIO0FBQ0YsUUFSRCxFQVFHLElBUkg7QUFVRDs7Ozs7O21CQXJFa0JSLEs7Ozs7OztBQ0ZyQjtBQUNBO0FBQ0EsRyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA4OTMwZjIxNWQ1MDEwNjE1ZDA1MyIsIlxuaW1wb3J0IGxvZyAgICAgICAgICAgICAgICBmcm9tICdsb2dsZXZlbCc7XG5pbXBvcnQgRGlzYXNzZW1ibGVyICAgICAgIGZyb20gJy4vc3lzdGVtL2Rpc2FzbSc7XG5pbXBvcnQgUmVuZGVyZXIgICAgICAgICAgIGZyb20gJy4vZG9tL3JlbmRlcmVyJztcbmltcG9ydCBJbnB1dCAgICAgICAgICAgICAgZnJvbSAnLi9kb20vaW5wdXQnO1xuaW1wb3J0IEVtdWxhdGlvbldvcmtlciAgICBmcm9tICd3b3JrZXItbG9hZGVyIS4vY2hpcDgtd29ya2VyLmpzJztcblxuY29uc3QgRElTUExBWV9TQ0FMRSA9IDEwO1xuXG5sZXQgYnRuSGFsdCAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bnN0b3BkdW1wJyk7XG5sZXQgYnRuUGF1c2UgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bnBhdXNlJyk7XG5sZXQgYnRuU3RlcCAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bnN0ZXAnKTtcbmxldCBidG5SZXN1bWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnRucmVzdW1lJyk7XG5cbmxldCBkaXNhc20gICAgPSBuZXcgRGlzYXNzZW1ibGVyKCk7XG5sZXQga2V5Ym9hcmQgID0gbmV3IElucHV0KGlucHV0U2lnbmFsKTtcbmxldCByZW5kZXJlciAgPSBuZXcgUmVuZGVyZXIoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rpc3BsYXknKSwgRElTUExBWV9TQ0FMRSk7XG5cbmxvZy5pbmZvKGBDSElQLTggVmlydHVhbCBNYWNoaW5lYCk7XG5cbmxldCBlbXVXb3JrZXIgPSBuZXcgRW11bGF0aW9uV29ya2VyKCk7XG5cbmVtdVdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgKG1lc3NhZ2UpID0+IHtcbiAgc3dpdGNoKG1lc3NhZ2UuZGF0YS5hY3Rpb24pXG4gIHtcbiAgICBjYXNlICdyZW5kZXInOlxuICAgICAgcmVuZGVyZXIuUmVuZGVyKG1lc3NhZ2UuZGF0YS5hcmdzLmZyYW1lQnVmZmVyKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2Vycm9yJzpcbiAgICAgICAgbGV0IHt0cmFjZSwgYWRkcmVzcywgZXJyb3IsIHJlZ2lzdGVyc30gPSBtZXNzYWdlLmRhdGEuYXJncztcbiAgICAgICAgbGV0IHRyYWNlX2luc3RydWN0aW9ucyA9IGRpc2FzbS5kZWNvZGUodHJhY2UuaSk7XG5cbiAgICAgICAgbG9nLmVycm9yKGVycm9yKTtcblxuICAgICAgICBmb3IgKHZhciB0PTA7IHQ8dHJhY2UuaS5sZW5ndGg7IHQrKylcbiAgICAgICAge1xuICAgICAgICAgIHZhciBvID0gYFske3RyYWNlLmFbdF0udG9TdHJpbmcoMTYpfV0gKDB4JHt0cmFjZS5pW3RdLnRvU3RyaW5nKDE2KX0pICR7dHJhY2VfaW5zdHJ1Y3Rpb25zW3RdLm19IFxcdFxcdFxcdFxcdFxcdCAke3RyYWNlX2luc3RydWN0aW9uc1t0XS5kfWA7XG4gICAgICAgICAgaWYgKHRyYWNlLmFbdF0gPT0gYWRkcmVzcylcbiAgICAgICAgICAgIGxvZy5lcnJvcihvKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBsb2cuZGVidWcobyk7XG4gICAgICAgIH1cbiAgICAgICAgbG9nLmVycm9yKHJlZ2lzdGVycyk7XG4gICAgICBicmVhaztcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIGlucHV0U2lnbmFsKGtleVN0YXRlKVxue1xuICBlbXVXb3JrZXIucG9zdE1lc3NhZ2Uoe2FjdGlvbjogJ2lucHV0JywgYXJnczoge2tleVN0YXRlfX0pO1xufVxuXG5idG5IYWx0Lm9uY2xpY2sgPSAoKSA9PiB7XG4gIGVtdVdvcmtlci5wb3N0TWVzc2FnZSh7YWN0aW9uOiAnaGFsdGR1bXAnfSk7XG59O1xuXG5idG5QYXVzZS5vbmNsaWNrID0gKCkgPT4ge1xuICBlbXVXb3JrZXIucG9zdE1lc3NhZ2Uoe2FjdGlvbjogJ3BhdXNlJ30pO1xufTtcblxuYnRuU3RlcC5vbmNsaWNrID0gKCkgPT4ge1xuICBlbXVXb3JrZXIucG9zdE1lc3NhZ2Uoe2FjdGlvbjogJ3N0ZXAnfSk7XG59O1xuXG5idG5SZXN1bWUub25jbGljayA9ICgpID0+IHtcbiAgZW11V29ya2VyLnBvc3RNZXNzYWdlKHthY3Rpb246ICdyZXN1bWUnfSk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbWFpbi5qcyIsIi8qXG4qIGxvZ2xldmVsIC0gaHR0cHM6Ly9naXRodWIuY29tL3BpbXRlcnJ5L2xvZ2xldmVsXG4qXG4qIENvcHlyaWdodCAoYykgMjAxMyBUaW0gUGVycnlcbiogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuKi9cbihmdW5jdGlvbiAocm9vdCwgZGVmaW5pdGlvbikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKGRlZmluaXRpb24pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5sb2cgPSBkZWZpbml0aW9uKCk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIG5vb3AgPSBmdW5jdGlvbigpIHt9O1xuICAgIHZhciB1bmRlZmluZWRUeXBlID0gXCJ1bmRlZmluZWRcIjtcblxuICAgIGZ1bmN0aW9uIHJlYWxNZXRob2QobWV0aG9kTmFtZSkge1xuICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgPT09IHVuZGVmaW5lZFR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gV2UgY2FuJ3QgYnVpbGQgYSByZWFsIG1ldGhvZCB3aXRob3V0IGEgY29uc29sZSB0byBsb2cgdG9cbiAgICAgICAgfSBlbHNlIGlmIChjb25zb2xlW21ldGhvZE5hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBiaW5kTWV0aG9kKGNvbnNvbGUsIG1ldGhvZE5hbWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGNvbnNvbGUubG9nICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBiaW5kTWV0aG9kKGNvbnNvbGUsICdsb2cnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBub29wO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYmluZE1ldGhvZChvYmosIG1ldGhvZE5hbWUpIHtcbiAgICAgICAgdmFyIG1ldGhvZCA9IG9ialttZXRob2ROYW1lXTtcbiAgICAgICAgaWYgKHR5cGVvZiBtZXRob2QuYmluZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIG1ldGhvZC5iaW5kKG9iaik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5jYWxsKG1ldGhvZCwgb2JqKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAvLyBNaXNzaW5nIGJpbmQgc2hpbSBvciBJRTggKyBNb2Rlcm5penIsIGZhbGxiYWNrIHRvIHdyYXBwaW5nXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmFwcGx5KG1ldGhvZCwgW29iaiwgYXJndW1lbnRzXSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHRoZXNlIHByaXZhdGUgZnVuY3Rpb25zIGFsd2F5cyBuZWVkIGB0aGlzYCB0byBiZSBzZXQgcHJvcGVybHlcblxuICAgIGZ1bmN0aW9uIGVuYWJsZUxvZ2dpbmdXaGVuQ29uc29sZUFycml2ZXMobWV0aG9kTmFtZSwgbGV2ZWwsIGxvZ2dlck5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gdW5kZWZpbmVkVHlwZSkge1xuICAgICAgICAgICAgICAgIHJlcGxhY2VMb2dnaW5nTWV0aG9kcy5jYWxsKHRoaXMsIGxldmVsLCBsb2dnZXJOYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzW21ldGhvZE5hbWVdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVwbGFjZUxvZ2dpbmdNZXRob2RzKGxldmVsLCBsb2dnZXJOYW1lKSB7XG4gICAgICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbG9nTWV0aG9kcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSBsb2dNZXRob2RzW2ldO1xuICAgICAgICAgICAgdGhpc1ttZXRob2ROYW1lXSA9IChpIDwgbGV2ZWwpID9cbiAgICAgICAgICAgICAgICBub29wIDpcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGhvZEZhY3RvcnkobWV0aG9kTmFtZSwgbGV2ZWwsIGxvZ2dlck5hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVmYXVsdE1ldGhvZEZhY3RvcnkobWV0aG9kTmFtZSwgbGV2ZWwsIGxvZ2dlck5hbWUpIHtcbiAgICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgICAgcmV0dXJuIHJlYWxNZXRob2QobWV0aG9kTmFtZSkgfHxcbiAgICAgICAgICAgICAgIGVuYWJsZUxvZ2dpbmdXaGVuQ29uc29sZUFycml2ZXMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICB2YXIgbG9nTWV0aG9kcyA9IFtcbiAgICAgICAgXCJ0cmFjZVwiLFxuICAgICAgICBcImRlYnVnXCIsXG4gICAgICAgIFwiaW5mb1wiLFxuICAgICAgICBcIndhcm5cIixcbiAgICAgICAgXCJlcnJvclwiXG4gICAgXTtcblxuICAgIGZ1bmN0aW9uIExvZ2dlcihuYW1lLCBkZWZhdWx0TGV2ZWwsIGZhY3RvcnkpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHZhciBjdXJyZW50TGV2ZWw7XG4gICAgICB2YXIgc3RvcmFnZUtleSA9IFwibG9nbGV2ZWxcIjtcbiAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgIHN0b3JhZ2VLZXkgKz0gXCI6XCIgKyBuYW1lO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlKGxldmVsTnVtKSB7XG4gICAgICAgICAgdmFyIGxldmVsTmFtZSA9IChsb2dNZXRob2RzW2xldmVsTnVtXSB8fCAnc2lsZW50JykudG9VcHBlckNhc2UoKTtcblxuICAgICAgICAgIC8vIFVzZSBsb2NhbFN0b3JhZ2UgaWYgYXZhaWxhYmxlXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZVtzdG9yYWdlS2V5XSA9IGxldmVsTmFtZTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cblxuICAgICAgICAgIC8vIFVzZSBzZXNzaW9uIGNvb2tpZSBhcyBmYWxsYmFja1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5jb29raWUgPVxuICAgICAgICAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChzdG9yYWdlS2V5KSArIFwiPVwiICsgbGV2ZWxOYW1lICsgXCI7XCI7XG4gICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRQZXJzaXN0ZWRMZXZlbCgpIHtcbiAgICAgICAgICB2YXIgc3RvcmVkTGV2ZWw7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBzdG9yZWRMZXZlbCA9IHdpbmRvdy5sb2NhbFN0b3JhZ2Vbc3RvcmFnZUtleV07XG4gICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxuXG4gICAgICAgICAgaWYgKHR5cGVvZiBzdG9yZWRMZXZlbCA9PT0gdW5kZWZpbmVkVHlwZSkge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgdmFyIGNvb2tpZSA9IHdpbmRvdy5kb2N1bWVudC5jb29raWU7XG4gICAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSBjb29raWUuaW5kZXhPZihcbiAgICAgICAgICAgICAgICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoc3RvcmFnZUtleSkgKyBcIj1cIik7XG4gICAgICAgICAgICAgICAgICBpZiAobG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICBzdG9yZWRMZXZlbCA9IC9eKFteO10rKS8uZXhlYyhjb29raWUuc2xpY2UobG9jYXRpb24pKVsxXTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIElmIHRoZSBzdG9yZWQgbGV2ZWwgaXMgbm90IHZhbGlkLCB0cmVhdCBpdCBhcyBpZiBub3RoaW5nIHdhcyBzdG9yZWQuXG4gICAgICAgICAgaWYgKHNlbGYubGV2ZWxzW3N0b3JlZExldmVsXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHN0b3JlZExldmVsID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBzdG9yZWRMZXZlbDtcbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgICAqXG4gICAgICAgKiBQdWJsaWMgQVBJXG4gICAgICAgKlxuICAgICAgICovXG5cbiAgICAgIHNlbGYubGV2ZWxzID0geyBcIlRSQUNFXCI6IDAsIFwiREVCVUdcIjogMSwgXCJJTkZPXCI6IDIsIFwiV0FSTlwiOiAzLFxuICAgICAgICAgIFwiRVJST1JcIjogNCwgXCJTSUxFTlRcIjogNX07XG5cbiAgICAgIHNlbGYubWV0aG9kRmFjdG9yeSA9IGZhY3RvcnkgfHwgZGVmYXVsdE1ldGhvZEZhY3Rvcnk7XG5cbiAgICAgIHNlbGYuZ2V0TGV2ZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGN1cnJlbnRMZXZlbDtcbiAgICAgIH07XG5cbiAgICAgIHNlbGYuc2V0TGV2ZWwgPSBmdW5jdGlvbiAobGV2ZWwsIHBlcnNpc3QpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGxldmVsID09PSBcInN0cmluZ1wiICYmIHNlbGYubGV2ZWxzW2xldmVsLnRvVXBwZXJDYXNlKCldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgbGV2ZWwgPSBzZWxmLmxldmVsc1tsZXZlbC50b1VwcGVyQ2FzZSgpXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHR5cGVvZiBsZXZlbCA9PT0gXCJudW1iZXJcIiAmJiBsZXZlbCA+PSAwICYmIGxldmVsIDw9IHNlbGYubGV2ZWxzLlNJTEVOVCkge1xuICAgICAgICAgICAgICBjdXJyZW50TGV2ZWwgPSBsZXZlbDtcbiAgICAgICAgICAgICAgaWYgKHBlcnNpc3QgIT09IGZhbHNlKSB7ICAvLyBkZWZhdWx0cyB0byB0cnVlXG4gICAgICAgICAgICAgICAgICBwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlKGxldmVsKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXBsYWNlTG9nZ2luZ01ldGhvZHMuY2FsbChzZWxmLCBsZXZlbCwgbmFtZSk7XG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSA9PT0gdW5kZWZpbmVkVHlwZSAmJiBsZXZlbCA8IHNlbGYubGV2ZWxzLlNJTEVOVCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiTm8gY29uc29sZSBhdmFpbGFibGUgZm9yIGxvZ2dpbmdcIjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93IFwibG9nLnNldExldmVsKCkgY2FsbGVkIHdpdGggaW52YWxpZCBsZXZlbDogXCIgKyBsZXZlbDtcbiAgICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBzZWxmLnNldERlZmF1bHRMZXZlbCA9IGZ1bmN0aW9uIChsZXZlbCkge1xuICAgICAgICAgIGlmICghZ2V0UGVyc2lzdGVkTGV2ZWwoKSkge1xuICAgICAgICAgICAgICBzZWxmLnNldExldmVsKGxldmVsLCBmYWxzZSk7XG4gICAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgc2VsZi5lbmFibGVBbGwgPSBmdW5jdGlvbihwZXJzaXN0KSB7XG4gICAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVscy5UUkFDRSwgcGVyc2lzdCk7XG4gICAgICB9O1xuXG4gICAgICBzZWxmLmRpc2FibGVBbGwgPSBmdW5jdGlvbihwZXJzaXN0KSB7XG4gICAgICAgICAgc2VsZi5zZXRMZXZlbChzZWxmLmxldmVscy5TSUxFTlQsIHBlcnNpc3QpO1xuICAgICAgfTtcblxuICAgICAgLy8gSW5pdGlhbGl6ZSB3aXRoIHRoZSByaWdodCBsZXZlbFxuICAgICAgdmFyIGluaXRpYWxMZXZlbCA9IGdldFBlcnNpc3RlZExldmVsKCk7XG4gICAgICBpZiAoaW5pdGlhbExldmVsID09IG51bGwpIHtcbiAgICAgICAgICBpbml0aWFsTGV2ZWwgPSBkZWZhdWx0TGV2ZWwgPT0gbnVsbCA/IFwiV0FSTlwiIDogZGVmYXVsdExldmVsO1xuICAgICAgfVxuICAgICAgc2VsZi5zZXRMZXZlbChpbml0aWFsTGV2ZWwsIGZhbHNlKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqXG4gICAgICogUGFja2FnZS1sZXZlbCBBUElcbiAgICAgKlxuICAgICAqL1xuXG4gICAgdmFyIGRlZmF1bHRMb2dnZXIgPSBuZXcgTG9nZ2VyKCk7XG5cbiAgICB2YXIgX2xvZ2dlcnNCeU5hbWUgPSB7fTtcbiAgICBkZWZhdWx0TG9nZ2VyLmdldExvZ2dlciA9IGZ1bmN0aW9uIGdldExvZ2dlcihuYW1lKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIiB8fCBuYW1lID09PSBcIlwiKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIllvdSBtdXN0IHN1cHBseSBhIG5hbWUgd2hlbiBjcmVhdGluZyBhIGxvZ2dlci5cIik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbG9nZ2VyID0gX2xvZ2dlcnNCeU5hbWVbbmFtZV07XG4gICAgICAgIGlmICghbG9nZ2VyKSB7XG4gICAgICAgICAgbG9nZ2VyID0gX2xvZ2dlcnNCeU5hbWVbbmFtZV0gPSBuZXcgTG9nZ2VyKFxuICAgICAgICAgICAgbmFtZSwgZGVmYXVsdExvZ2dlci5nZXRMZXZlbCgpLCBkZWZhdWx0TG9nZ2VyLm1ldGhvZEZhY3RvcnkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsb2dnZXI7XG4gICAgfTtcblxuICAgIC8vIEdyYWIgdGhlIGN1cnJlbnQgZ2xvYmFsIGxvZyB2YXJpYWJsZSBpbiBjYXNlIG9mIG92ZXJ3cml0ZVxuICAgIHZhciBfbG9nID0gKHR5cGVvZiB3aW5kb3cgIT09IHVuZGVmaW5lZFR5cGUpID8gd2luZG93LmxvZyA6IHVuZGVmaW5lZDtcbiAgICBkZWZhdWx0TG9nZ2VyLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IHVuZGVmaW5lZFR5cGUgJiZcbiAgICAgICAgICAgICAgIHdpbmRvdy5sb2cgPT09IGRlZmF1bHRMb2dnZXIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5sb2cgPSBfbG9nO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRlZmF1bHRMb2dnZXI7XG4gICAgfTtcblxuICAgIHJldHVybiBkZWZhdWx0TG9nZ2VyO1xufSkpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvZ2xldmVsL2xpYi9sb2dsZXZlbC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpc2Fzc2VtYmxlclxue1xuICBjb25zdHJ1Y3RvcigpXG4gIHtcbiAgfVxuXG4gIGRlY29kZShpbnN0cilcbiAge1xuICAgIGxldCBsaXN0ID0gQXJyYXkuaXNBcnJheShpbnN0cikgPyBpbnN0ciA6IFtpbnN0cl07XG4gICAgbGV0IG91dCA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSBvZiBsaXN0KVxuICAgIHtcbiAgICAgIGxldCBkID0gdGhpcy5fZGVjb2RlX3NpbmdsZShpKTtcbiAgICAgIGQuaSA9IGAweCR7aGV4KGkpfWA7XG4gICAgICBvdXQucHVzaChkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0Lmxlbmd0aCA9PSAxID8gb3V0WzBdIDogb3V0O1xuICB9XG5cbiAgZXhwbG9kZShpbnN0cl9kYXRhLCBmcm9tX2luc3RyLCBzaXplKVxuICB7XG4gICAgbGV0IHRvX2RlY29kZSA9IFtdO1xuICAgIGZvciAobGV0IHQ9ZnJvbV9pbnN0ci0oc2l6ZSoyKTsgdDw9ZnJvbV9pbnN0cisoc2l6ZSoyKTsgdCs9MilcbiAgICB7XG4gICAgICB0b19kZWNvZGUucHVzaChpbnN0cl9kYXRhLnJlYWRXb3JkKHQpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZGVjb2RlKHRvX2RlY29kZSk7XG4gIH1cblxuICBfZGVjb2RlX3NpbmdsZShpbnN0cilcbiAge1xuICAgICAgbGV0IG1ham9yID0gKGluc3RyID4+IDEyKSAmIDB4ZjtcbiAgICAgIGxldCBtaW5vciA9IGluc3RyICYgMHhmZmY7XG5cbiAgICAgIC8vIGUuZy4gNVhZMDoganJxIHZ4LCB2eVxuICAgICAgbGV0IG1pbjAgPSAobWlub3IgPj4gOCkgJiAweGY7ICAvLyBYXG4gICAgICBsZXQgbWluMSA9IChtaW5vciA+PiA0KSAmIDB4ZjsgIC8vIFlcbiAgICAgIGxldCBtaW4yID0gbWlub3IgJiAweGY7ICAgICAgICAgLy8gMFxuICAgICAgbGV0IG1pbjEyID0gbWlub3IgJiAweGZmOyAgICAgICAvLyBZMFxuXG4gICAgICBzd2l0Y2gobWFqb3IpXG4gICAgICB7XG4gICAgICAgIGNhc2UgMHgwOlxuICAgICAgICAgIHN3aXRjaChtaW5vcilcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjYXNlIDB4ZTA6IHJldHVybiB7bTogXCJjbHNcIiwgZDpcIkNsZWFyIHNjcmVlblwifTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDB4ZWU6IHJldHVybiB7bTogXCJyZXRcIiwgZDpcIlJldHVybiBmcm9tIHN1YnJvdXRpbmUgW3N0YWNrXVwifTsgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4ge206IGBzeXMgJHttaW5vci50b1N0cmluZygxNil9YCwgZDpcIkp1bXAgdG8gcm91dGluZSBhdCBhZGRyZXNzIFtsZWdhY3k7IGlnbm9yZWQgYnkgaW50ZXJwcmV0ZXJdXCJ9O2JyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweDE6IHJldHVybiB7bTogYGptcCAweCR7aGV4KG1pbm9yKX1gLCBkOlwiSnVtcCB0byBhZGRyZXNzXCJ9OyAgICAgICAgICAgICAvLyAxbm5uXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHgyOiByZXR1cm4ge206IGBjYWxsIDB4JHtoZXgobWlub3IpfWAsIGQ6XCJDYWxsIHN1YnJvdXRpbmUgW3N0YWNrXVwifTsgICAgICAgICAgICAvLyAybm5uXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHgzOiByZXR1cm4ge206IGBqZXEgdiR7aGV4KG1pbjApfSwgJHttaW4xMn1gLCBkOlwiSnVtcCBvdmVyIG5leHQgaW5zdHJ1Y3Rpb24gaWYgb3BlcmFuZHMgZXF1YWxcIn07ICAgLy8gM3hublxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4NDogcmV0dXJuIHttOiBgam5xIHYke2hleChtaW4wKX0sICR7bWluMTJ9YCwgZDpcIkp1bXAgb3ZlciBuZXh0IGluc3RydWN0aW9uIGlmIG9wZXJhbmRzIG5vdCBlcXVhbFwifTsgICAvLyA0eG5uXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHg1OiByZXR1cm4ge206IGBqcmUgdiR7aGV4KG1pbjApfSwgdiR7aGV4KG1pbjEpfWAsIGQ6XCJKdW1wIG92ZXIgbmV4dCBpbnN0cnVjdGlvbiBpZiByZWdpc3RlcnMgZXF1YWxcIn07Ly8gNXh5MFxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4NjogcmV0dXJuIHttOiBgbW92IHYke2hleChtaW4wKX0sICR7bWluMTJ9YCwgZDpcIk1vdmUgY29uc3RhbnQgaW50byByZWdpc3RlclwifTs7ICAgLy8gNnhublxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4NzogcmV0dXJuIHttOiBgYWRkIHYke2hleChtaW4wKX0sICR7bWluMTJ9YCwgZDpcIkFkZCBjb25zdGFudCB0byByZWdpc3RlclwifTs7ICAgLy8gN3hublxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4ODpcbiAgICAgICAgICBzd2l0Y2ggKG1pbjIpXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2FzZSAweDA6IHJldHVybiB7bTogYG1vdiB2JHtoZXgobWluMCl9LCB2JHtoZXgobWluMSl9YCwgZDogXCJNb3ZlIHJlZ2lzdGVyIGludG8gcmVnaXN0ZXJcIn07IGJyZWFrOyAgIC8vIDh4eTBcbiAgICAgICAgICAgIGNhc2UgMHgxOiByZXR1cm4ge206IGBvciB2JHtoZXgobWluMCl9LCB2JHtoZXgobWluMSl9YCwgZDogXCJPUiByZWdpc3RlciB3aXRoIHJlZ2lzdGVyXCJ9OyBicmVhazsgICAgLy8gOHh5MVxuICAgICAgICAgICAgY2FzZSAweDI6IHJldHVybiB7bTogYGFuZCB2JHtoZXgobWluMCl9LCB2JHtoZXgobWluMSl9YCwgZDogXCJBTkQgcmVnaXN0ZXIgd2l0aCByZWdpc3RlclwifTsgYnJlYWs7ICAgLy8gOHh5MlxuICAgICAgICAgICAgY2FzZSAweDM6IHJldHVybiB7bTogYHhvciB2JHtoZXgobWluMCl9LCB2JHtoZXgobWluMSl9YCwgZDogXCJYT1IgcmVnaXN0ZXIgd2l0aCByZWdpc3RlclwifTsgYnJlYWs7ICAgLy8gOHh5MlxuICAgICAgICAgICAgY2FzZSAweDQ6IHJldHVybiB7bTogYGFkZCB2JHtoZXgobWluMCl9LCB2JHtoZXgobWluMSl9YCwgZDogXCJBZGQgcmVnaXN0ZXIgdG8gcmVnaXN0ZXJcIn07IGJyZWFrOyAgIC8vIDh4eTRcbiAgICAgICAgICAgIGNhc2UgMHg1OiByZXR1cm4ge206IGBzdWIgdiR7aGV4KG1pbjApfSwgdiR7aGV4KG1pbjEpfWAsIGQ6IFwiU3VidHJhY3QgcmVnaXN0ZXIgZnJvbSByZWdpc3RlclwifTsgYnJlYWs7ICAgLy8gOHh5NVxuICAgICAgICAgICAgY2FzZSAweDY6IHJldHVybiB7bTogYHNociB2JHtoZXgobWluMCl9YCwgZDogXCJTaGlmdCByaWdodCByZWdpc3RlclwifTsgYnJlYWs7ICAgICAgICAgICAgICAgICAgLy8gOHgwNlxuICAgICAgICAgICAgY2FzZSAweDc6IHJldHVybiB7bTogYHJzYiB2JHtoZXgobWluMCl9LCB2JHtoZXgobWluMSl9YCwgZDogXCJSZXZlcnNlIHN1YnRyYWN0IHJlZ2lzdGVyIGZyb20gcmVnaXN0ZXJcIn07IGJyZWFrOyAgIC8vIDh4eTdcbiAgICAgICAgICAgIGNhc2UgMHhlOiByZXR1cm4ge206IGBzaGwgdiR7aGV4KG1pbjApfWAsIGQ6IFwiU2hpZnQgbGVmdCByZWdpc3RlclwifTsgYnJlYWs7ICAgICAgICAgICAgICAgICAgLy8gOHgwZVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweDk6IHJldHVybiB7bTogYGpybiB2JHtoZXgobWluMCl9LCB2JHtoZXgobWluMSl9YCwgZDogXCJKdW1wIG92ZXIgbmV4dCBpbnN0cnVjdGlvbiBpZiByZWdpc3RlciBub3QgZXF1YWxcIn07ICAgICAgICAgICAgIC8vIDl4eTBcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweEE6IHJldHVybiB7bTogYG1vdiBpLCAke21pbm9yfWAsIGQ6XCJNb3ZlIGNvbnN0YW50IGludG8gSW5kZXggcmVnaXN0ZXJcIn07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHhCOiByZXR1cm4ge206IGBqcmwgMHgke2hleChtaW5vcil9YCwgZDpcIkp1bXAgdG8gYWRkcmVzcyBnaXZlbiBieSBjb25zdGFudCArIHYwIHJlZ2lzdGVyXCJ9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHhDOiByZXR1cm4ge206IGBybmQgdiR7aGV4KG1pbjApfSwgMHgke2hleChtaW4xMil9YCwgZDpcIlJhbmRvbSBudW1iZXIgQU5EIHdpdGggY29uc3RhbnQgaW50byByZWdpc3RlclwifVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4RDogcmV0dXJuIHttOiBgZHJ3IHYke2hleChtaW4wKX0sIHYke2hleChtaW4xKX0sICR7KG1pbjIpfWAsIGQ6XCJEcmF3IHNwcml0ZSBhdCByZWdpc3RlcnMgbG9jYXRpb24gb2Ygc2l6ZSBjb25zdGFudFwifVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4RTpcbiAgICAgICAgICBzd2l0Y2gobWluMTIpXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2FzZSAweDlFOiByZXR1cm4ge206IGBqa3AgdiR7aGV4KG1pbjApfWAsIGQ6XCJKdW1wIGlmIGtleSBjb2RlIGluIHJlZ2lzdGVyIHByZXNzZWRcIn1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDB4QTE6IHJldHVybiB7bTogYGprbiB2JHtoZXgobWluMCl9YCwgZDpcIkp1bXAgaWYga2V5IGNvZGUgaW4gcmVnaXN0ZXIgbm90IHByZXNzZWRcIn1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4RjpcbiAgICAgICAgICBzd2l0Y2gobWluMTIpXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2FzZSAweDA3OiByZXR1cm4ge206IGBsZHQgdiR7aGV4KG1pbjApfWAsIGQ6XCJMb2FkIGRlbGF5IHRpbWVyIHZhbHVlIGludG8gcmVnaXN0ZXJcIn1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDB4MEE6IHJldHVybiB7bTogYHdhaXQgdiR7aGV4KG1pbjApfWAsIGQ6XCJXYWl0IGZvciBhIGtleSBwcmVzcywgc3RvcmUga2V5IGluIHJlZ2lzdGVyXCJ9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAweDE1OiByZXR1cm4ge206IGBzZHQgdiR7aGV4KG1pbjApfWAsIGQ6XCJTZXQgZGVsYXkgdGltZXIgZnJvbSByZWdpc3RlclwifVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMHgxODogcmV0dXJuIHttOiBgc3N0IHYke2hleChtaW4wKX1gLCBkOlwiU2V0IHNvdW5kIHRpbWVyIGZyb20gcmVnaXN0ZXJcIn1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDB4MUU6IHJldHVybiB7bTogYGFkaSB2JHtoZXgobWluMCl9YCwgZDpcIkFkZCByZWdpc3RlciB2YWx1ZSB0byBJbmRleCByZWdpc3RlclwifVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMHgyOTogcmV0dXJuIHttOiBgbGRpIHYke2hleChtaW4wKX1gLCBkOlwiTG9hZCBJbmRleCByZWdpc3RlciB3aXRoIHNwcml0ZSBhZGRyZXNzIG9mIGRpZ2l0IGluIHJlZ2lzdGVyXCJ9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAweDMzOiByZXR1cm4ge206IGBiY2QgdiR7aGV4KG1pbjApfWAsIGQ6XCJTdG9yZSBCQ0Qgb2YgcmVnaXN0ZXIgc3RhcnRpbmcgYXQgYmFzZSBhZGRyZXNzIEluZGV4XCJ9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAweDU1OiByZXR1cm4ge206IGBzdHIgdiR7aGV4KG1pbjApfWAsIGQ6XCJTdG9yZSByZWdpc3RlcnMgZnJvbSB2MCB0byByZWdpc3RlciBvcGVyYW5kIGF0IGJhc2UgYWRkcmVzcyBJbmRleFwifVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMHg2NTogcmV0dXJuIHttOiBgbGRyIHYke2hleChtaW4wKX1gLCBkOlwiU2V0IHJlZ2lzdGVycyBmcm9tIHYwIHRvIHJlZ2lzdGVyIG9wZXJhbmQgd2l0aCB2YWx1ZXMgZnJvbSBiYXNlIGFkZHJlc3MgSW5kZXhcIn1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgZGVmYXVsdDogcmV0dXJuIHttOmBVbmtub3duIG9wY29kZSAke2hleChpbnN0cil9YCwgZDpcIlVua25vd24vaWxsZWdhbCBpbnN0cnVjdGlvblwifTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGhleChuKSB7IHJldHVybiBuLnRvU3RyaW5nKDE2KTsgfVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3lzdGVtL2Rpc2FzbS5qcyIsIlxuaW1wb3J0IGxvZyAgICAgICAgICAgICAgICBmcm9tICdsb2dsZXZlbCc7XG5cbmNvbnN0IERJU1BMQVlfV0lEVEggPSA2NCwgRElTUExBWV9IRUlHSFQgPSAzMjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyZXJcbntcbiAgY29uc3RydWN0b3IoZWxlbWVudCwgc2NhbGU9MSlcbiAge1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgLy90aGlzLnZpZGVvID0gdmlkZW87ICAvLyBwaXhlbCBidWZmZXIgb2YgdGhlIENoaXA4IHN5c3RlbSBpbiBieXRlc1xuXG4gICAgdGhpcy5zY2FsZSA9IE1hdGguZmxvb3IoTWF0aC5hYnMoc2NhbGUpKSB8fCAxO1xuXG4gICAgLy90aGlzLnZpZGVvZGltID0gZGltZW5zaW9ucztcbiAgICB0aGlzLmRpbSA9IHt3aWR0aDogRElTUExBWV9XSURUSCAqIHRoaXMuc2NhbGUsIGhlaWdodDogRElTUExBWV9IRUlHSFQgKiB0aGlzLnNjYWxlIH07XG5cbiAgICB0aGlzLnJlbmRlckNvbnRleHQgPSB0aGlzLmVsZW1lbnQuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG4gICAgLy9sb2cuZGVidWcoYFZpZGVvIHNpemUgJHt0aGlzLnZpZGVvLmxlbmd0aH0gYnl0ZXMsIHdpZHRoOiAke3RoaXMuZGltLndpZHRofSwgaGVpZ2h0OiAke3RoaXMuZGltLmhlaWdodH1gKTtcbiAgICB0aGlzLmVsZW1lbnQud2lkdGggPSB0aGlzLmRpbS53aWR0aDtcbiAgICB0aGlzLmVsZW1lbnQuaGVpZ2h0ID0gdGhpcy5kaW0uaGVpZ2h0O1xuXG4gICAgdGhpcy5waXhlbF9vbiA9IHRoaXMucmVuZGVyQ29udGV4dC5jcmVhdGVJbWFnZURhdGEodGhpcy5zY2FsZSx0aGlzLnNjYWxlKTtcbiAgICBsZXQgZCAgPSB0aGlzLnBpeGVsX29uLmRhdGE7XG4gICAgZm9yIChsZXQgbz0wOyBvPHNjYWxlKnNjYWxlKjQ7IG8rKylcbiAgICAgICAgZFtvXSAgID0gMjU1O1xuXG4gICAgdGhpcy5waXhlbF9vZmYgPSB0aGlzLnJlbmRlckNvbnRleHQuY3JlYXRlSW1hZ2VEYXRhKHRoaXMuc2NhbGUsdGhpcy5zY2FsZSk7XG4gICAgZCAgPSB0aGlzLnBpeGVsX29mZi5kYXRhO1xuICAgIGZvciAobGV0IG89MDsgbzxzY2FsZSpzY2FsZSo0OyBvKz00KVxuICAgIHtcbiAgICAgICAgZFtvKzBdICAgPSAwO1xuICAgICAgICBkW28rMV0gICA9IDA7XG4gICAgICAgIGRbbysyXSAgID0gMDtcbiAgICAgICAgZFtvKzNdICAgPSAyNTU7XG4gICAgfVxuXG4gICAgLy90aGlzLmRpcnR5ID0gZmFsc2U7XG4gIH1cblxuICBEaXJ0eSgpXG4gIHtcbiAgICAvL3RoaXMuZGlydHkgPSB0cnVlO1xuICB9XG5cbiAgUmVuZGVyKGZyYW1lQnVmZmVyKVxuICB7XG4gICAgLy9pZiAoIXRoaXMuZGlydHkpIHJldHVybjtcblxuICAgIHZhciBvID0gMDtcbiAgICBmb3IgKGxldCB5PTA7IHk8RElTUExBWV9IRUlHSFQ7IHkrKylcbiAgICB7XG4gICAgICBmb3IgKGxldCB4PTA7IHg8RElTUExBWV9XSURUSDsgeCsrKVxuICAgICAge1xuICAgICAgICBsZXQgdiA9IGZyYW1lQnVmZmVyW28rK107XG4gICAgICAgIGxldCBwID0gdiA/IHRoaXMucGl4ZWxfb24gOiB0aGlzLnBpeGVsX29mZlxuICAgICAgICB0aGlzLnJlbmRlckNvbnRleHQucHV0SW1hZ2VEYXRhKHAsIHRoaXMuc2NhbGUqeCwgdGhpcy5zY2FsZSp5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy90aGlzLmRpcnR5ID0gZmFsc2U7XG4gIH1cblxuXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9kb20vcmVuZGVyZXIuanMiLCJpbXBvcnQgbG9nIGZyb20gJ2xvZ2xldmVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5wdXRcbntcbiAgLy8gTm90ZSwgdGhlIGtleXN0YXRlcyBhcmUgd3JpdHRlbiBkaXJlY2x0eSBpbnRvIHRoZSBDaGlwOCdzIEJJT1MvUkFNXG4gIC8vIGZvciBkaXJlY3QgYWNjZXNzIGJ5IHRoZSBDUFVcblxuICBjb25zdHJ1Y3RvcihjYWxsYmFjaylcbiAge1xuICAgIC8vIDEgMiAzIENcbiAgICAvLyA0IDUgNiBEXG4gICAgLy8gNyA4IDkgRVxuICAgIC8vIEEgMCBCIEZcbiAgICAvLyB0aGlzLmtleU1hcCA9IFtcbiAgICAvLyAgIDE6JzEnLCAyOicyJywgMzonMycsIGM6JzQnLFxuICAgIC8vICAgNDoncScsIDU6J3cnLCA2OidlJywgZDoncicsXG4gICAgLy8gICA3OidhJywgODoncycsIDk6J2QnLCBlOidmJyxcbiAgICAvLyAgIDEwOid6JywgOjAneCcsIEI6J2MnLCBmOid2J1xuICAgIC8vIF07XG5cbiAgICB0aGlzLmtleURhdGEgPSBuZXcgVWludDhBcnJheSgxNik7XG4gICAgdGhpcy5fY2FsbGJhY2sgPSBjYWxsYmFjaztcblxuICAgIHRoaXMua2V5TWFwID0gW1xuICAgICAgJ3gnLCAnMScsICcyJywgJzMnLFxuICAgICAgJ3EnLCAndycsICdlJywgJ2EnLFxuICAgICAgJ3MnLCAnZCcsICd6JywgJ2MnLFxuICAgICAgJzQnLCAncicsICdmJywgJ3YnXG4gICAgXTtcblxuICAgIHRoaXMuX2luaXQoKTtcbiAgfVxuXG4gIF9zZXRLZXlEb3duKGtleSlcbiAge1xuICAgICAgdGhpcy5rZXlEYXRhW2tleV0gPSAxO1xuICAgICAgaWYgKHRoaXMuX2NhbGxiYWNrKSB0aGlzLl9jYWxsYmFjayh0aGlzLmtleURhdGEpO1xuICB9XG5cbiAgX3NldEtleVVwKGtleSlcbiAge1xuICAgICAgdGhpcy5rZXlEYXRhW2tleV0gPSAwO1xuICAgICAgaWYgKHRoaXMuX2NhbGxiYWNrKSB0aGlzLl9jYWxsYmFjayh0aGlzLmtleURhdGEpO1xuICB9XG5cbiAgX2luaXQoKVxuICB7XG4gICAgLy9IQUNLOiBjb252ZXJ0IGFycmF5IGludG8gaW50ZWdlciBhc2NpaSBjb2RlcyBmb3IgcXVpY2tlciBsb29rdXBcbiAgICBmb3IgKGxldCBrPTA7azx0aGlzLmtleU1hcC5sZW5ndGg7aysrKVxuICAgICAgdGhpcy5rZXlNYXBba10gPSB0aGlzLmtleU1hcFtrXS5jaGFyQ29kZUF0KDApO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgICAgdmFyIGNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUua2V5Q29kZSkudG9Mb3dlckNhc2UoKS5jaGFyQ29kZUF0KDApXG4gICAgICBmb3IgKGxldCBrPTA7IGs8dGhpcy5rZXlNYXAubGVuZ3RoOyBrKyspXG4gICAgICB7XG4gICAgICAgIGlmICh0aGlzLmtleU1hcFtrXSA9PSBjb2RlKVxuICAgICAgICAgIHRoaXMuX3NldEtleURvd24oayk7XG4gICAgICB9XG4gICAgICAvL3RoaXMucHJpbnRUYWJsZSgpO1xuICAgIH0sIHRydWUpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGUpID0+IHtcbiAgICAgIC8vbG9nLndhcm4oKTtcbiAgICAgIHZhciBjb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLmtleUNvZGUpLnRvTG93ZXJDYXNlKCkuY2hhckNvZGVBdCgwKVxuICAgICAgZm9yIChsZXQgaz0wOyBrPHRoaXMua2V5TWFwLmxlbmd0aDsgaysrKVxuICAgICAge1xuICAgICAgICBpZiAodGhpcy5rZXlNYXBba10gPT0gY29kZSlcbiAgICAgICAgICB0aGlzLl9zZXRLZXlVcChrKTtcbiAgICAgIH1cbiAgICB9LCB0cnVlKTtcblxuICB9XG5cblxuXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9kb20vaW5wdXQuanMiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gbmV3IFdvcmtlcihfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiZDczODVhM2I5Zjc2NzdiNjgyYjAud29ya2VyLmpzXCIpO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vd29ya2VyLWxvYWRlciEuL2NoaXA4LXdvcmtlci5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9