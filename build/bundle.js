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
	
	var DISPLAY_SCALE = 16;
	
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
	      //console.log(message.data.args.frameBuffer);
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
		return new Worker(__webpack_require__.p + "1a67e6f39f937a3ec264.worker.js");
	};

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMjMyMmUzNDUwZmI5M2Q5MmE3YTAiLCJ3ZWJwYWNrOi8vLy4vbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2xvZ2xldmVsL2xpYi9sb2dsZXZlbC5qcyIsIndlYnBhY2s6Ly8vLi9zeXN0ZW0vZGlzYXNtLmpzIiwid2VicGFjazovLy8uL2RvbS9yZW5kZXJlci5qcyIsIndlYnBhY2s6Ly8vLi9kb20vaW5wdXQuanMiLCJ3ZWJwYWNrOi8vLy4vY2hpcDgtd29ya2VyLmpzIl0sIm5hbWVzIjpbIkRJU1BMQVlfU0NBTEUiLCJidG5IYWx0IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImJ0blBhdXNlIiwiYnRuU3RlcCIsImJ0blJlc3VtZSIsImRpc2FzbSIsImtleWJvYXJkIiwiaW5wdXRTaWduYWwiLCJyZW5kZXJlciIsImluZm8iLCJlbXVXb3JrZXIiLCJhZGRFdmVudExpc3RlbmVyIiwibWVzc2FnZSIsImRhdGEiLCJhY3Rpb24iLCJSZW5kZXIiLCJhcmdzIiwiZnJhbWVCdWZmZXIiLCJ0cmFjZSIsImFkZHJlc3MiLCJlcnJvciIsInJlZ2lzdGVycyIsInRyYWNlX2luc3RydWN0aW9ucyIsImRlY29kZSIsImkiLCJ0IiwibGVuZ3RoIiwibyIsImEiLCJ0b1N0cmluZyIsIm0iLCJkIiwiZGVidWciLCJrZXlTdGF0ZSIsInBvc3RNZXNzYWdlIiwib25jbGljayIsIkRpc2Fzc2VtYmxlciIsImluc3RyIiwibGlzdCIsIkFycmF5IiwiaXNBcnJheSIsIm91dCIsIl9kZWNvZGVfc2luZ2xlIiwiaGV4IiwicHVzaCIsImluc3RyX2RhdGEiLCJmcm9tX2luc3RyIiwic2l6ZSIsInRvX2RlY29kZSIsInJlYWRXb3JkIiwibWFqb3IiLCJtaW5vciIsIm1pbjAiLCJtaW4xIiwibWluMiIsIm1pbjEyIiwibiIsIkRJU1BMQVlfV0lEVEgiLCJESVNQTEFZX0hFSUdIVCIsIlJlbmRlcmVyIiwiZWxlbWVudCIsInNjYWxlIiwiTWF0aCIsImZsb29yIiwiYWJzIiwiZGltIiwid2lkdGgiLCJoZWlnaHQiLCJyZW5kZXJDb250ZXh0IiwiZ2V0Q29udGV4dCIsInBpeGVsX29uIiwiY3JlYXRlSW1hZ2VEYXRhIiwicGl4ZWxfb2ZmIiwieSIsIngiLCJ2IiwicCIsInB1dEltYWdlRGF0YSIsIklucHV0IiwiY2FsbGJhY2siLCJrZXlEYXRhIiwiVWludDhBcnJheSIsIl9jYWxsYmFjayIsImtleU1hcCIsIl9pbml0Iiwia2V5IiwiayIsImNoYXJDb2RlQXQiLCJ3aW5kb3ciLCJlIiwiY29kZSIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsImtleUNvZGUiLCJ0b0xvd2VyQ2FzZSIsIl9zZXRLZXlEb3duIiwiX3NldEtleVVwIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7O0FDckNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLEtBQU1BLGdCQUFnQixFQUF0Qjs7QUFFQSxLQUFJQyxVQUFZQyxTQUFTQyxjQUFULENBQXdCLGFBQXhCLENBQWhCO0FBQ0EsS0FBSUMsV0FBWUYsU0FBU0MsY0FBVCxDQUF3QixVQUF4QixDQUFoQjtBQUNBLEtBQUlFLFVBQVlILFNBQVNDLGNBQVQsQ0FBd0IsU0FBeEIsQ0FBaEI7QUFDQSxLQUFJRyxZQUFZSixTQUFTQyxjQUFULENBQXdCLFdBQXhCLENBQWhCOztBQUVBLEtBQUlJLFNBQVksc0JBQWhCO0FBQ0EsS0FBSUMsV0FBWSxvQkFBVUMsV0FBVixDQUFoQjtBQUNBLEtBQUlDLFdBQVksdUJBQWFSLFNBQVNDLGNBQVQsQ0FBd0IsU0FBeEIsQ0FBYixFQUFpREgsYUFBakQsQ0FBaEI7O0FB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QXhELENBQVg7QUFDQSxjQUFLLElBQUlELEtBQUUsQ0FBWCxFQUFjQSxLQUFFLE1BQUtILE1BQUwsQ0FBWXpELE1BQTVCLEVBQW9DNEQsSUFBcEMsRUFDQTtBQUNFLGVBQUksTUFBS0gsTUFBTCxDQUFZRyxFQUFaLEtBQWtCSSxJQUF0QixFQUNFLE1BQUtLLFdBQUwsQ0FBaUJULEVBQWpCO0FBQ0g7QUFDRDtBQUNELFFBUkQsRUFRRyxJQVJIOztBQVVBRSxjQUFPN0UsZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsVUFBQzhFLENBQUQsRUFBTztBQUN0QztBQUNBLGFBQUlDLE9BQU9DLE9BQU9DLFlBQVAsQ0FBb0JILEVBQUVJLE9BQXRCLEVBQStCQyxXQUEvQixHQUE2Q1AsVUFBN0MsQ0FBd0QsQ0FBeEQsQ0FBWDtBQUNBLGNBQUssSUFBSUQsTUFBRSxDQUFYLEVBQWNBLE1BQUUsTUFBS0gsTUFBTCxDQUFZekQsTUFBNUIsRUFBb0M0RCxLQUFwQyxFQUNBO0FBQ0UsZUFBSSxNQUFLSCxNQUFMLENBQVlHLEdBQVosS0FBa0JJLElBQXRCLEVBQ0UsTUFBS00sU0FBTCxDQUFlVixHQUFmO0FBQ0g7QUFDRixRQVJELEVBUUcsSUFSSDtBQVVEOzs7Ozs7bUJBckVrQlIsSzs7Ozs7O0FDRnJCO0FBQ0E7QUFDQSxHIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDIzMjJlMzQ1MGZiOTNkOTJhN2EwIiwiXG5pbXBvcnQgbG9nICAgICAgICAgICAgICAgIGZyb20gJ2xvZ2xldmVsJztcbmltcG9ydCBEaXNhc3NlbWJsZXIgICAgICAgZnJvbSAnLi9zeXN0ZW0vZGlzYXNtJztcbmltcG9ydCBSZW5kZXJlciAgICAgICAgICAgZnJvbSAnLi9kb20vcmVuZGVyZXInO1xuaW1wb3J0IElucHV0ICAgICAgICAgICAgICBmcm9tICcuL2RvbS9pbnB1dCc7XG5pbXBvcnQgRW11bGF0aW9uV29ya2VyICAgIGZyb20gJ3dvcmtlci1sb2FkZXIhLi9jaGlwOC13b3JrZXIuanMnO1xuXG5jb25zdCBESVNQTEFZX1NDQUxFID0gMTY7XG5cbmxldCBidG5IYWx0ICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnRuc3RvcGR1bXAnKTtcbmxldCBidG5QYXVzZSAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnRucGF1c2UnKTtcbmxldCBidG5TdGVwICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnRuc3RlcCcpO1xubGV0IGJ0blJlc3VtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG5yZXN1bWUnKTtcblxubGV0IGRpc2FzbSAgICA9IG5ldyBEaXNhc3NlbWJsZXIoKTtcbmxldCBrZXlib2FyZCAgPSBuZXcgSW5wdXQoaW5wdXRTaWduYWwpO1xubGV0IHJlbmRlcmVyICA9IG5ldyBSZW5kZXJlcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGlzcGxheScpLCBESVNQTEFZX1NDQUxFKTtcblxubG9nLmluZm8oYENISVAtOCBWaXJ0dWFsIE1hY2hpbmVgKTtcblxubGV0IGVtdVdvcmtlciA9IG5ldyBFbXVsYXRpb25Xb3JrZXIoKTtcblxuZW11V29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAobWVzc2FnZSkgPT4ge1xuICBzd2l0Y2gobWVzc2FnZS5kYXRhLmFjdGlvbilcbiAge1xuICAgIGNhc2UgJ3JlbmRlcic6XG4gICAgICAvL2NvbnNvbGUubG9nKG1lc3NhZ2UuZGF0YS5hcmdzLmZyYW1lQnVmZmVyKTtcbiAgICAgIHJlbmRlcmVyLlJlbmRlcihtZXNzYWdlLmRhdGEuYXJncy5mcmFtZUJ1ZmZlcik7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdlcnJvcic6XG4gICAgICAgIGxldCB7dHJhY2UsIGFkZHJlc3MsIGVycm9yLCByZWdpc3RlcnN9ID0gbWVzc2FnZS5kYXRhLmFyZ3M7XG4gICAgICAgIGxldCB0cmFjZV9pbnN0cnVjdGlvbnMgPSBkaXNhc20uZGVjb2RlKHRyYWNlLmkpO1xuXG4gICAgICAgIGxvZy5lcnJvcihlcnJvcik7XG5cbiAgICAgICAgZm9yICh2YXIgdD0wOyB0PHRyYWNlLmkubGVuZ3RoOyB0KyspXG4gICAgICAgIHtcbiAgICAgICAgICB2YXIgbyA9IGBbJHt0cmFjZS5hW3RdLnRvU3RyaW5nKDE2KX1dICgweCR7dHJhY2UuaVt0XS50b1N0cmluZygxNil9KSAke3RyYWNlX2luc3RydWN0aW9uc1t0XS5tfSBcXHRcXHRcXHRcXHRcXHQgJHt0cmFjZV9pbnN0cnVjdGlvbnNbdF0uZH1gO1xuICAgICAgICAgIGlmICh0cmFjZS5hW3RdID09IGFkZHJlc3MpXG4gICAgICAgICAgICBsb2cuZXJyb3Iobyk7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbG9nLmRlYnVnKG8pO1xuICAgICAgICB9XG4gICAgICAgIGxvZy5lcnJvcihyZWdpc3RlcnMpO1xuICAgICAgYnJlYWs7XG4gIH1cbn0pO1xuXG5mdW5jdGlvbiBpbnB1dFNpZ25hbChrZXlTdGF0ZSlcbntcbiAgZW11V29ya2VyLnBvc3RNZXNzYWdlKHthY3Rpb246ICdpbnB1dCcsIGFyZ3M6IHtrZXlTdGF0ZX19KTtcbn1cblxuYnRuSGFsdC5vbmNsaWNrID0gKCkgPT4ge1xuICBlbXVXb3JrZXIucG9zdE1lc3NhZ2Uoe2FjdGlvbjogJ2hhbHRkdW1wJ30pO1xufTtcblxuYnRuUGF1c2Uub25jbGljayA9ICgpID0+IHtcbiAgZW11V29ya2VyLnBvc3RNZXNzYWdlKHthY3Rpb246ICdwYXVzZSd9KTtcbn07XG5cbmJ0blN0ZXAub25jbGljayA9ICgpID0+IHtcbiAgZW11V29ya2VyLnBvc3RNZXNzYWdlKHthY3Rpb246ICdzdGVwJ30pO1xufTtcblxuYnRuUmVzdW1lLm9uY2xpY2sgPSAoKSA9PiB7XG4gIGVtdVdvcmtlci5wb3N0TWVzc2FnZSh7YWN0aW9uOiAncmVzdW1lJ30pO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL21haW4uanMiLCIvKlxuKiBsb2dsZXZlbCAtIGh0dHBzOi8vZ2l0aHViLmNvbS9waW10ZXJyeS9sb2dsZXZlbFxuKlxuKiBDb3B5cmlnaHQgKGMpIDIwMTMgVGltIFBlcnJ5XG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiovXG4oZnVuY3Rpb24gKHJvb3QsIGRlZmluaXRpb24pIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShkZWZpbml0aW9uKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3QubG9nID0gZGVmaW5pdGlvbigpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBub29wID0gZnVuY3Rpb24oKSB7fTtcbiAgICB2YXIgdW5kZWZpbmVkVHlwZSA9IFwidW5kZWZpbmVkXCI7XG5cbiAgICBmdW5jdGlvbiByZWFsTWV0aG9kKG1ldGhvZE5hbWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSB1bmRlZmluZWRUeXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vIFdlIGNhbid0IGJ1aWxkIGEgcmVhbCBtZXRob2Qgd2l0aG91dCBhIGNvbnNvbGUgdG8gbG9nIHRvXG4gICAgICAgIH0gZWxzZSBpZiAoY29uc29sZVttZXRob2ROYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gYmluZE1ldGhvZChjb25zb2xlLCBtZXRob2ROYW1lKTtcbiAgICAgICAgfSBlbHNlIGlmIChjb25zb2xlLmxvZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gYmluZE1ldGhvZChjb25zb2xlLCAnbG9nJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbm9vcDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJpbmRNZXRob2Qob2JqLCBtZXRob2ROYW1lKSB7XG4gICAgICAgIHZhciBtZXRob2QgPSBvYmpbbWV0aG9kTmFtZV07XG4gICAgICAgIGlmICh0eXBlb2YgbWV0aG9kLmJpbmQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiBtZXRob2QuYmluZChvYmopO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuY2FsbChtZXRob2QsIG9iaik7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgLy8gTWlzc2luZyBiaW5kIHNoaW0gb3IgSUU4ICsgTW9kZXJuaXpyLCBmYWxsYmFjayB0byB3cmFwcGluZ1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5hcHBseShtZXRob2QsIFtvYmosIGFyZ3VtZW50c10pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB0aGVzZSBwcml2YXRlIGZ1bmN0aW9ucyBhbHdheXMgbmVlZCBgdGhpc2AgdG8gYmUgc2V0IHByb3Blcmx5XG5cbiAgICBmdW5jdGlvbiBlbmFibGVMb2dnaW5nV2hlbkNvbnNvbGVBcnJpdmVzKG1ldGhvZE5hbWUsIGxldmVsLCBsb2dnZXJOYW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IHVuZGVmaW5lZFR5cGUpIHtcbiAgICAgICAgICAgICAgICByZXBsYWNlTG9nZ2luZ01ldGhvZHMuY2FsbCh0aGlzLCBsZXZlbCwgbG9nZ2VyTmFtZSk7XG4gICAgICAgICAgICAgICAgdGhpc1ttZXRob2ROYW1lXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlcGxhY2VMb2dnaW5nTWV0aG9kcyhsZXZlbCwgbG9nZ2VyTmFtZSkge1xuICAgICAgICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxvZ01ldGhvZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBtZXRob2ROYW1lID0gbG9nTWV0aG9kc1tpXTtcbiAgICAgICAgICAgIHRoaXNbbWV0aG9kTmFtZV0gPSAoaSA8IGxldmVsKSA/XG4gICAgICAgICAgICAgICAgbm9vcCA6XG4gICAgICAgICAgICAgICAgdGhpcy5tZXRob2RGYWN0b3J5KG1ldGhvZE5hbWUsIGxldmVsLCBsb2dnZXJOYW1lKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlZmF1bHRNZXRob2RGYWN0b3J5KG1ldGhvZE5hbWUsIGxldmVsLCBsb2dnZXJOYW1lKSB7XG4gICAgICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICAgIHJldHVybiByZWFsTWV0aG9kKG1ldGhvZE5hbWUpIHx8XG4gICAgICAgICAgICAgICBlbmFibGVMb2dnaW5nV2hlbkNvbnNvbGVBcnJpdmVzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgdmFyIGxvZ01ldGhvZHMgPSBbXG4gICAgICAgIFwidHJhY2VcIixcbiAgICAgICAgXCJkZWJ1Z1wiLFxuICAgICAgICBcImluZm9cIixcbiAgICAgICAgXCJ3YXJuXCIsXG4gICAgICAgIFwiZXJyb3JcIlxuICAgIF07XG5cbiAgICBmdW5jdGlvbiBMb2dnZXIobmFtZSwgZGVmYXVsdExldmVsLCBmYWN0b3J5KSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICB2YXIgY3VycmVudExldmVsO1xuICAgICAgdmFyIHN0b3JhZ2VLZXkgPSBcImxvZ2xldmVsXCI7XG4gICAgICBpZiAobmFtZSkge1xuICAgICAgICBzdG9yYWdlS2V5ICs9IFwiOlwiICsgbmFtZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcGVyc2lzdExldmVsSWZQb3NzaWJsZShsZXZlbE51bSkge1xuICAgICAgICAgIHZhciBsZXZlbE5hbWUgPSAobG9nTWV0aG9kc1tsZXZlbE51bV0gfHwgJ3NpbGVudCcpLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgICAvLyBVc2UgbG9jYWxTdG9yYWdlIGlmIGF2YWlsYWJsZVxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Vbc3RvcmFnZUtleV0gPSBsZXZlbE5hbWU7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XG5cbiAgICAgICAgICAvLyBVc2Ugc2Vzc2lvbiBjb29raWUgYXMgZmFsbGJhY2tcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQuY29va2llID1cbiAgICAgICAgICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoc3RvcmFnZUtleSkgKyBcIj1cIiArIGxldmVsTmFtZSArIFwiO1wiO1xuICAgICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZ2V0UGVyc2lzdGVkTGV2ZWwoKSB7XG4gICAgICAgICAgdmFyIHN0b3JlZExldmVsO1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSB3aW5kb3cubG9jYWxTdG9yYWdlW3N0b3JhZ2VLZXldO1xuICAgICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cblxuICAgICAgICAgIGlmICh0eXBlb2Ygc3RvcmVkTGV2ZWwgPT09IHVuZGVmaW5lZFR5cGUpIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIHZhciBjb29raWUgPSB3aW5kb3cuZG9jdW1lbnQuY29va2llO1xuICAgICAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0gY29va2llLmluZGV4T2YoXG4gICAgICAgICAgICAgICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KHN0b3JhZ2VLZXkpICsgXCI9XCIpO1xuICAgICAgICAgICAgICAgICAgaWYgKGxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSAvXihbXjtdKykvLmV4ZWMoY29va2llLnNsaWNlKGxvY2F0aW9uKSlbMV07XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBJZiB0aGUgc3RvcmVkIGxldmVsIGlzIG5vdCB2YWxpZCwgdHJlYXQgaXQgYXMgaWYgbm90aGluZyB3YXMgc3RvcmVkLlxuICAgICAgICAgIGlmIChzZWxmLmxldmVsc1tzdG9yZWRMZXZlbF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBzdG9yZWRMZXZlbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gc3RvcmVkTGV2ZWw7XG4gICAgICB9XG5cbiAgICAgIC8qXG4gICAgICAgKlxuICAgICAgICogUHVibGljIEFQSVxuICAgICAgICpcbiAgICAgICAqL1xuXG4gICAgICBzZWxmLmxldmVscyA9IHsgXCJUUkFDRVwiOiAwLCBcIkRFQlVHXCI6IDEsIFwiSU5GT1wiOiAyLCBcIldBUk5cIjogMyxcbiAgICAgICAgICBcIkVSUk9SXCI6IDQsIFwiU0lMRU5UXCI6IDV9O1xuXG4gICAgICBzZWxmLm1ldGhvZEZhY3RvcnkgPSBmYWN0b3J5IHx8IGRlZmF1bHRNZXRob2RGYWN0b3J5O1xuXG4gICAgICBzZWxmLmdldExldmVsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjdXJyZW50TGV2ZWw7XG4gICAgICB9O1xuXG4gICAgICBzZWxmLnNldExldmVsID0gZnVuY3Rpb24gKGxldmVsLCBwZXJzaXN0KSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBsZXZlbCA9PT0gXCJzdHJpbmdcIiAmJiBzZWxmLmxldmVsc1tsZXZlbC50b1VwcGVyQ2FzZSgpXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGxldmVsID0gc2VsZi5sZXZlbHNbbGV2ZWwudG9VcHBlckNhc2UoKV07XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0eXBlb2YgbGV2ZWwgPT09IFwibnVtYmVyXCIgJiYgbGV2ZWwgPj0gMCAmJiBsZXZlbCA8PSBzZWxmLmxldmVscy5TSUxFTlQpIHtcbiAgICAgICAgICAgICAgY3VycmVudExldmVsID0gbGV2ZWw7XG4gICAgICAgICAgICAgIGlmIChwZXJzaXN0ICE9PSBmYWxzZSkgeyAgLy8gZGVmYXVsdHMgdG8gdHJ1ZVxuICAgICAgICAgICAgICAgICAgcGVyc2lzdExldmVsSWZQb3NzaWJsZShsZXZlbCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVwbGFjZUxvZ2dpbmdNZXRob2RzLmNhbGwoc2VsZiwgbGV2ZWwsIG5hbWUpO1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgPT09IHVuZGVmaW5lZFR5cGUgJiYgbGV2ZWwgPCBzZWxmLmxldmVscy5TSUxFTlQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBcIk5vIGNvbnNvbGUgYXZhaWxhYmxlIGZvciBsb2dnaW5nXCI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdyBcImxvZy5zZXRMZXZlbCgpIGNhbGxlZCB3aXRoIGludmFsaWQgbGV2ZWw6IFwiICsgbGV2ZWw7XG4gICAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgc2VsZi5zZXREZWZhdWx0TGV2ZWwgPSBmdW5jdGlvbiAobGV2ZWwpIHtcbiAgICAgICAgICBpZiAoIWdldFBlcnNpc3RlZExldmVsKCkpIHtcbiAgICAgICAgICAgICAgc2VsZi5zZXRMZXZlbChsZXZlbCwgZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHNlbGYuZW5hYmxlQWxsID0gZnVuY3Rpb24ocGVyc2lzdCkge1xuICAgICAgICAgIHNlbGYuc2V0TGV2ZWwoc2VsZi5sZXZlbHMuVFJBQ0UsIHBlcnNpc3QpO1xuICAgICAgfTtcblxuICAgICAgc2VsZi5kaXNhYmxlQWxsID0gZnVuY3Rpb24ocGVyc2lzdCkge1xuICAgICAgICAgIHNlbGYuc2V0TGV2ZWwoc2VsZi5sZXZlbHMuU0lMRU5ULCBwZXJzaXN0KTtcbiAgICAgIH07XG5cbiAgICAgIC8vIEluaXRpYWxpemUgd2l0aCB0aGUgcmlnaHQgbGV2ZWxcbiAgICAgIHZhciBpbml0aWFsTGV2ZWwgPSBnZXRQZXJzaXN0ZWRMZXZlbCgpO1xuICAgICAgaWYgKGluaXRpYWxMZXZlbCA9PSBudWxsKSB7XG4gICAgICAgICAgaW5pdGlhbExldmVsID0gZGVmYXVsdExldmVsID09IG51bGwgPyBcIldBUk5cIiA6IGRlZmF1bHRMZXZlbDtcbiAgICAgIH1cbiAgICAgIHNlbGYuc2V0TGV2ZWwoaW5pdGlhbExldmVsLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKlxuICAgICAqIFBhY2thZ2UtbGV2ZWwgQVBJXG4gICAgICpcbiAgICAgKi9cblxuICAgIHZhciBkZWZhdWx0TG9nZ2VyID0gbmV3IExvZ2dlcigpO1xuXG4gICAgdmFyIF9sb2dnZXJzQnlOYW1lID0ge307XG4gICAgZGVmYXVsdExvZ2dlci5nZXRMb2dnZXIgPSBmdW5jdGlvbiBnZXRMb2dnZXIobmFtZSkge1xuICAgICAgICBpZiAodHlwZW9mIG5hbWUgIT09IFwic3RyaW5nXCIgfHwgbmFtZSA9PT0gXCJcIikge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJZb3UgbXVzdCBzdXBwbHkgYSBuYW1lIHdoZW4gY3JlYXRpbmcgYSBsb2dnZXIuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxvZ2dlciA9IF9sb2dnZXJzQnlOYW1lW25hbWVdO1xuICAgICAgICBpZiAoIWxvZ2dlcikge1xuICAgICAgICAgIGxvZ2dlciA9IF9sb2dnZXJzQnlOYW1lW25hbWVdID0gbmV3IExvZ2dlcihcbiAgICAgICAgICAgIG5hbWUsIGRlZmF1bHRMb2dnZXIuZ2V0TGV2ZWwoKSwgZGVmYXVsdExvZ2dlci5tZXRob2RGYWN0b3J5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG9nZ2VyO1xuICAgIH07XG5cbiAgICAvLyBHcmFiIHRoZSBjdXJyZW50IGdsb2JhbCBsb2cgdmFyaWFibGUgaW4gY2FzZSBvZiBvdmVyd3JpdGVcbiAgICB2YXIgX2xvZyA9ICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlKSA/IHdpbmRvdy5sb2cgOiB1bmRlZmluZWQ7XG4gICAgZGVmYXVsdExvZ2dlci5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlICYmXG4gICAgICAgICAgICAgICB3aW5kb3cubG9nID09PSBkZWZhdWx0TG9nZ2VyKSB7XG4gICAgICAgICAgICB3aW5kb3cubG9nID0gX2xvZztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZWZhdWx0TG9nZ2VyO1xuICAgIH07XG5cbiAgICByZXR1cm4gZGVmYXVsdExvZ2dlcjtcbn0pKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9sb2dsZXZlbC9saWIvbG9nbGV2ZWwuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaXNhc3NlbWJsZXJcbntcbiAgY29uc3RydWN0b3IoKVxuICB7XG4gIH1cblxuICBkZWNvZGUoaW5zdHIpXG4gIHtcbiAgICBsZXQgbGlzdCA9IEFycmF5LmlzQXJyYXkoaW5zdHIpID8gaW5zdHIgOiBbaW5zdHJdO1xuICAgIGxldCBvdXQgPSBbXTtcblxuICAgIGZvciAobGV0IGkgb2YgbGlzdClcbiAgICB7XG4gICAgICBsZXQgZCA9IHRoaXMuX2RlY29kZV9zaW5nbGUoaSk7XG4gICAgICBkLmkgPSBgMHgke2hleChpKX1gO1xuICAgICAgb3V0LnB1c2goZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dC5sZW5ndGggPT0gMSA/IG91dFswXSA6IG91dDtcbiAgfVxuXG4gIGV4cGxvZGUoaW5zdHJfZGF0YSwgZnJvbV9pbnN0ciwgc2l6ZSlcbiAge1xuICAgIGxldCB0b19kZWNvZGUgPSBbXTtcbiAgICBmb3IgKGxldCB0PWZyb21faW5zdHItKHNpemUqMik7IHQ8PWZyb21faW5zdHIrKHNpemUqMik7IHQrPTIpXG4gICAge1xuICAgICAgdG9fZGVjb2RlLnB1c2goaW5zdHJfZGF0YS5yZWFkV29yZCh0KSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmRlY29kZSh0b19kZWNvZGUpO1xuICB9XG5cbiAgX2RlY29kZV9zaW5nbGUoaW5zdHIpXG4gIHtcbiAgICAgIGxldCBtYWpvciA9IChpbnN0ciA+PiAxMikgJiAweGY7XG4gICAgICBsZXQgbWlub3IgPSBpbnN0ciAmIDB4ZmZmO1xuXG4gICAgICAvLyBlLmcuIDVYWTA6IGpycSB2eCwgdnlcbiAgICAgIGxldCBtaW4wID0gKG1pbm9yID4+IDgpICYgMHhmOyAgLy8gWFxuICAgICAgbGV0IG1pbjEgPSAobWlub3IgPj4gNCkgJiAweGY7ICAvLyBZXG4gICAgICBsZXQgbWluMiA9IG1pbm9yICYgMHhmOyAgICAgICAgIC8vIDBcbiAgICAgIGxldCBtaW4xMiA9IG1pbm9yICYgMHhmZjsgICAgICAgLy8gWTBcblxuICAgICAgc3dpdGNoKG1ham9yKVxuICAgICAge1xuICAgICAgICBjYXNlIDB4MDpcbiAgICAgICAgICBzd2l0Y2gobWlub3IpXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2FzZSAweGUwOiByZXR1cm4ge206IFwiY2xzXCIsIGQ6XCJDbGVhciBzY3JlZW5cIn07IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAweGVlOiByZXR1cm4ge206IFwicmV0XCIsIGQ6XCJSZXR1cm4gZnJvbSBzdWJyb3V0aW5lIFtzdGFja11cIn07IGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDogcmV0dXJuIHttOiBgc3lzICR7bWlub3IudG9TdHJpbmcoMTYpfWAsIGQ6XCJKdW1wIHRvIHJvdXRpbmUgYXQgYWRkcmVzcyBbbGVnYWN5OyBpZ25vcmVkIGJ5IGludGVycHJldGVyXVwifTticmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHgxOiByZXR1cm4ge206IGBqbXAgMHgke2hleChtaW5vcil9YCwgZDpcIkp1bXAgdG8gYWRkcmVzc1wifTsgICAgICAgICAgICAgLy8gMW5ublxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4MjogcmV0dXJuIHttOiBgY2FsbCAweCR7aGV4KG1pbm9yKX1gLCBkOlwiQ2FsbCBzdWJyb3V0aW5lIFtzdGFja11cIn07ICAgICAgICAgICAgLy8gMm5ublxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4MzogcmV0dXJuIHttOiBgamVxIHYke2hleChtaW4wKX0sICR7bWluMTJ9YCwgZDpcIkp1bXAgb3ZlciBuZXh0IGluc3RydWN0aW9uIGlmIG9wZXJhbmRzIGVxdWFsXCJ9OyAgIC8vIDN4bm5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweDQ6IHJldHVybiB7bTogYGpucSB2JHtoZXgobWluMCl9LCAke21pbjEyfWAsIGQ6XCJKdW1wIG92ZXIgbmV4dCBpbnN0cnVjdGlvbiBpZiBvcGVyYW5kcyBub3QgZXF1YWxcIn07ICAgLy8gNHhublxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4NTogcmV0dXJuIHttOiBganJlIHYke2hleChtaW4wKX0sIHYke2hleChtaW4xKX1gLCBkOlwiSnVtcCBvdmVyIG5leHQgaW5zdHJ1Y3Rpb24gaWYgcmVnaXN0ZXJzIGVxdWFsXCJ9Oy8vIDV4eTBcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweDY6IHJldHVybiB7bTogYG1vdiB2JHtoZXgobWluMCl9LCAke21pbjEyfWAsIGQ6XCJNb3ZlIGNvbnN0YW50IGludG8gcmVnaXN0ZXJcIn07OyAgIC8vIDZ4bm5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweDc6IHJldHVybiB7bTogYGFkZCB2JHtoZXgobWluMCl9LCAke21pbjEyfWAsIGQ6XCJBZGQgY29uc3RhbnQgdG8gcmVnaXN0ZXJcIn07OyAgIC8vIDd4bm5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweDg6XG4gICAgICAgICAgc3dpdGNoIChtaW4yKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNhc2UgMHgwOiByZXR1cm4ge206IGBtb3YgdiR7aGV4KG1pbjApfSwgdiR7aGV4KG1pbjEpfWAsIGQ6IFwiTW92ZSByZWdpc3RlciBpbnRvIHJlZ2lzdGVyXCJ9OyBicmVhazsgICAvLyA4eHkwXG4gICAgICAgICAgICBjYXNlIDB4MTogcmV0dXJuIHttOiBgb3IgdiR7aGV4KG1pbjApfSwgdiR7aGV4KG1pbjEpfWAsIGQ6IFwiT1IgcmVnaXN0ZXIgd2l0aCByZWdpc3RlclwifTsgYnJlYWs7ICAgIC8vIDh4eTFcbiAgICAgICAgICAgIGNhc2UgMHgyOiByZXR1cm4ge206IGBhbmQgdiR7aGV4KG1pbjApfSwgdiR7aGV4KG1pbjEpfWAsIGQ6IFwiQU5EIHJlZ2lzdGVyIHdpdGggcmVnaXN0ZXJcIn07IGJyZWFrOyAgIC8vIDh4eTJcbiAgICAgICAgICAgIGNhc2UgMHgzOiByZXR1cm4ge206IGB4b3IgdiR7aGV4KG1pbjApfSwgdiR7aGV4KG1pbjEpfWAsIGQ6IFwiWE9SIHJlZ2lzdGVyIHdpdGggcmVnaXN0ZXJcIn07IGJyZWFrOyAgIC8vIDh4eTJcbiAgICAgICAgICAgIGNhc2UgMHg0OiByZXR1cm4ge206IGBhZGQgdiR7aGV4KG1pbjApfSwgdiR7aGV4KG1pbjEpfWAsIGQ6IFwiQWRkIHJlZ2lzdGVyIHRvIHJlZ2lzdGVyXCJ9OyBicmVhazsgICAvLyA4eHk0XG4gICAgICAgICAgICBjYXNlIDB4NTogcmV0dXJuIHttOiBgc3ViIHYke2hleChtaW4wKX0sIHYke2hleChtaW4xKX1gLCBkOiBcIlN1YnRyYWN0IHJlZ2lzdGVyIGZyb20gcmVnaXN0ZXJcIn07IGJyZWFrOyAgIC8vIDh4eTVcbiAgICAgICAgICAgIGNhc2UgMHg2OiByZXR1cm4ge206IGBzaHIgdiR7aGV4KG1pbjApfWAsIGQ6IFwiU2hpZnQgcmlnaHQgcmVnaXN0ZXJcIn07IGJyZWFrOyAgICAgICAgICAgICAgICAgIC8vIDh4MDZcbiAgICAgICAgICAgIGNhc2UgMHg3OiByZXR1cm4ge206IGByc2IgdiR7aGV4KG1pbjApfSwgdiR7aGV4KG1pbjEpfWAsIGQ6IFwiUmV2ZXJzZSBzdWJ0cmFjdCByZWdpc3RlciBmcm9tIHJlZ2lzdGVyXCJ9OyBicmVhazsgICAvLyA4eHk3XG4gICAgICAgICAgICBjYXNlIDB4ZTogcmV0dXJuIHttOiBgc2hsIHYke2hleChtaW4wKX1gLCBkOiBcIlNoaWZ0IGxlZnQgcmVnaXN0ZXJcIn07IGJyZWFrOyAgICAgICAgICAgICAgICAgIC8vIDh4MGVcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHg5OiByZXR1cm4ge206IGBqcm4gdiR7aGV4KG1pbjApfSwgdiR7aGV4KG1pbjEpfWAsIGQ6IFwiSnVtcCBvdmVyIG5leHQgaW5zdHJ1Y3Rpb24gaWYgcmVnaXN0ZXIgbm90IGVxdWFsXCJ9OyAgICAgICAgICAgICAvLyA5eHkwXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMHhBOiByZXR1cm4ge206IGBtb3YgaSwgJHttaW5vcn1gLCBkOlwiTW92ZSBjb25zdGFudCBpbnRvIEluZGV4IHJlZ2lzdGVyXCJ9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4QjogcmV0dXJuIHttOiBganJsIDB4JHtoZXgobWlub3IpfWAsIGQ6XCJKdW1wIHRvIGFkZHJlc3MgZ2l2ZW4gYnkgY29uc3RhbnQgKyB2MCByZWdpc3RlclwifVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDB4QzogcmV0dXJuIHttOiBgcm5kIHYke2hleChtaW4wKX0sIDB4JHtoZXgobWluMTIpfWAsIGQ6XCJSYW5kb20gbnVtYmVyIEFORCB3aXRoIGNvbnN0YW50IGludG8gcmVnaXN0ZXJcIn1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweEQ6IHJldHVybiB7bTogYGRydyB2JHtoZXgobWluMCl9LCB2JHtoZXgobWluMSl9LCAkeyhtaW4yKX1gLCBkOlwiRHJhdyBzcHJpdGUgYXQgcmVnaXN0ZXJzIGxvY2F0aW9uIG9mIHNpemUgY29uc3RhbnRcIn1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweEU6XG4gICAgICAgICAgc3dpdGNoKG1pbjEyKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNhc2UgMHg5RTogcmV0dXJuIHttOiBgamtwIHYke2hleChtaW4wKX1gLCBkOlwiSnVtcCBpZiBrZXkgY29kZSBpbiByZWdpc3RlciBwcmVzc2VkXCJ9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAweEExOiByZXR1cm4ge206IGBqa24gdiR7aGV4KG1pbjApfWAsIGQ6XCJKdW1wIGlmIGtleSBjb2RlIGluIHJlZ2lzdGVyIG5vdCBwcmVzc2VkXCJ9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAweEY6XG4gICAgICAgICAgc3dpdGNoKG1pbjEyKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNhc2UgMHgwNzogcmV0dXJuIHttOiBgbGR0IHYke2hleChtaW4wKX1gLCBkOlwiTG9hZCBkZWxheSB0aW1lciB2YWx1ZSBpbnRvIHJlZ2lzdGVyXCJ9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAweDBBOiByZXR1cm4ge206IGB3YWl0IHYke2hleChtaW4wKX1gLCBkOlwiV2FpdCBmb3IgYSBrZXkgcHJlc3MsIHN0b3JlIGtleSBpbiByZWdpc3RlclwifVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMHgxNTogcmV0dXJuIHttOiBgc2R0IHYke2hleChtaW4wKX1gLCBkOlwiU2V0IGRlbGF5IHRpbWVyIGZyb20gcmVnaXN0ZXJcIn1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDB4MTg6IHJldHVybiB7bTogYHNzdCB2JHtoZXgobWluMCl9YCwgZDpcIlNldCBzb3VuZCB0aW1lciBmcm9tIHJlZ2lzdGVyXCJ9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAweDFFOiByZXR1cm4ge206IGBhZGkgdiR7aGV4KG1pbjApfWAsIGQ6XCJBZGQgcmVnaXN0ZXIgdmFsdWUgdG8gSW5kZXggcmVnaXN0ZXJcIn1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDB4Mjk6IHJldHVybiB7bTogYGxkaSB2JHtoZXgobWluMCl9YCwgZDpcIkxvYWQgSW5kZXggcmVnaXN0ZXIgd2l0aCBzcHJpdGUgYWRkcmVzcyBvZiBkaWdpdCBpbiByZWdpc3RlclwifVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMHgzMzogcmV0dXJuIHttOiBgYmNkIHYke2hleChtaW4wKX1gLCBkOlwiU3RvcmUgQkNEIG9mIHJlZ2lzdGVyIHN0YXJ0aW5nIGF0IGJhc2UgYWRkcmVzcyBJbmRleFwifVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMHg1NTogcmV0dXJuIHttOiBgc3RyIHYke2hleChtaW4wKX1gLCBkOlwiU3RvcmUgcmVnaXN0ZXJzIGZyb20gdjAgdG8gcmVnaXN0ZXIgb3BlcmFuZCBhdCBiYXNlIGFkZHJlc3MgSW5kZXhcIn1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDB4NjU6IHJldHVybiB7bTogYGxkciB2JHtoZXgobWluMCl9YCwgZDpcIlNldCByZWdpc3RlcnMgZnJvbSB2MCB0byByZWdpc3RlciBvcGVyYW5kIHdpdGggdmFsdWVzIGZyb20gYmFzZSBhZGRyZXNzIEluZGV4XCJ9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiB7bTpgVW5rbm93biBvcGNvZGUgJHtoZXgoaW5zdHIpfWAsIGQ6XCJVbmtub3duL2lsbGVnYWwgaW5zdHJ1Y3Rpb25cIn07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBoZXgobikgeyByZXR1cm4gbi50b1N0cmluZygxNik7IH1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3N5c3RlbS9kaXNhc20uanMiLCJcbmltcG9ydCBsb2cgICAgICAgICAgICAgICAgZnJvbSAnbG9nbGV2ZWwnO1xuXG5jb25zdCBESVNQTEFZX1dJRFRIID0gNjQsIERJU1BMQVlfSEVJR0hUID0gMzI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlcmVyXG57XG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIHNjYWxlPTEpXG4gIHtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIC8vdGhpcy52aWRlbyA9IHZpZGVvOyAgLy8gcGl4ZWwgYnVmZmVyIG9mIHRoZSBDaGlwOCBzeXN0ZW0gaW4gYnl0ZXNcblxuICAgIHRoaXMuc2NhbGUgPSBNYXRoLmZsb29yKE1hdGguYWJzKHNjYWxlKSkgfHwgMTtcblxuICAgIC8vdGhpcy52aWRlb2RpbSA9IGRpbWVuc2lvbnM7XG4gICAgdGhpcy5kaW0gPSB7d2lkdGg6IERJU1BMQVlfV0lEVEggKiB0aGlzLnNjYWxlLCBoZWlnaHQ6IERJU1BMQVlfSEVJR0hUICogdGhpcy5zY2FsZSB9O1xuXG4gICAgdGhpcy5yZW5kZXJDb250ZXh0ID0gdGhpcy5lbGVtZW50LmdldENvbnRleHQoXCIyZFwiKTtcblxuICAgIC8vbG9nLmRlYnVnKGBWaWRlbyBzaXplICR7dGhpcy52aWRlby5sZW5ndGh9IGJ5dGVzLCB3aWR0aDogJHt0aGlzLmRpbS53aWR0aH0sIGhlaWdodDogJHt0aGlzLmRpbS5oZWlnaHR9YCk7XG4gICAgdGhpcy5lbGVtZW50LndpZHRoID0gdGhpcy5kaW0ud2lkdGg7XG4gICAgdGhpcy5lbGVtZW50LmhlaWdodCA9IHRoaXMuZGltLmhlaWdodDtcblxuICAgIHRoaXMucGl4ZWxfb24gPSB0aGlzLnJlbmRlckNvbnRleHQuY3JlYXRlSW1hZ2VEYXRhKHRoaXMuc2NhbGUsdGhpcy5zY2FsZSk7XG4gICAgbGV0IGQgID0gdGhpcy5waXhlbF9vbi5kYXRhO1xuICAgIGZvciAobGV0IG89MDsgbzxzY2FsZSpzY2FsZSo0OyBvKyspXG4gICAgICAgIGRbb10gICA9IDI1NTtcblxuICAgIHRoaXMucGl4ZWxfb2ZmID0gdGhpcy5yZW5kZXJDb250ZXh0LmNyZWF0ZUltYWdlRGF0YSh0aGlzLnNjYWxlLHRoaXMuc2NhbGUpO1xuICAgIGQgID0gdGhpcy5waXhlbF9vZmYuZGF0YTtcbiAgICBmb3IgKGxldCBvPTA7IG88c2NhbGUqc2NhbGUqNDsgbys9NClcbiAgICB7XG4gICAgICAgIGRbbyswXSAgID0gMDtcbiAgICAgICAgZFtvKzFdICAgPSAwO1xuICAgICAgICBkW28rMl0gICA9IDA7XG4gICAgICAgIGRbbyszXSAgID0gMjU1O1xuICAgIH1cblxuICAgIC8vdGhpcy5kaXJ0eSA9IGZhbHNlO1xuICB9XG5cbiAgRGlydHkoKVxuICB7XG4gICAgLy90aGlzLmRpcnR5ID0gdHJ1ZTtcbiAgfVxuXG4gIFJlbmRlcihmcmFtZUJ1ZmZlcilcbiAge1xuICAgIC8vaWYgKCF0aGlzLmRpcnR5KSByZXR1cm47XG5cbiAgICB2YXIgbyA9IDA7XG4gICAgZm9yIChsZXQgeT0wOyB5PERJU1BMQVlfSEVJR0hUOyB5KyspXG4gICAge1xuICAgICAgZm9yIChsZXQgeD0wOyB4PERJU1BMQVlfV0lEVEg7IHgrKylcbiAgICAgIHtcbiAgICAgICAgbGV0IHYgPSBmcmFtZUJ1ZmZlcltvKytdO1xuICAgICAgICBsZXQgcCA9IHYgPyB0aGlzLnBpeGVsX29uIDogdGhpcy5waXhlbF9vZmZcbiAgICAgICAgdGhpcy5yZW5kZXJDb250ZXh0LnB1dEltYWdlRGF0YShwLCB0aGlzLnNjYWxlKngsIHRoaXMuc2NhbGUqeSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vdGhpcy5kaXJ0eSA9IGZhbHNlO1xuICB9XG5cblxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZG9tL3JlbmRlcmVyLmpzIiwiaW1wb3J0IGxvZyBmcm9tICdsb2dsZXZlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElucHV0XG57XG4gIC8vIE5vdGUsIHRoZSBrZXlzdGF0ZXMgYXJlIHdyaXR0ZW4gZGlyZWNsdHkgaW50byB0aGUgQ2hpcDgncyBCSU9TL1JBTVxuICAvLyBmb3IgZGlyZWN0IGFjY2VzcyBieSB0aGUgQ1BVXG5cbiAgY29uc3RydWN0b3IoY2FsbGJhY2spXG4gIHtcbiAgICAvLyAxIDIgMyBDXG4gICAgLy8gNCA1IDYgRFxuICAgIC8vIDcgOCA5IEVcbiAgICAvLyBBIDAgQiBGXG4gICAgLy8gdGhpcy5rZXlNYXAgPSBbXG4gICAgLy8gICAxOicxJywgMjonMicsIDM6JzMnLCBjOic0JyxcbiAgICAvLyAgIDQ6J3EnLCA1Oid3JywgNjonZScsIGQ6J3InLFxuICAgIC8vICAgNzonYScsIDg6J3MnLCA5OidkJywgZTonZicsXG4gICAgLy8gICAxMDoneicsIDowJ3gnLCBCOidjJywgZjondidcbiAgICAvLyBdO1xuXG4gICAgdGhpcy5rZXlEYXRhID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xuICAgIHRoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XG5cbiAgICB0aGlzLmtleU1hcCA9IFtcbiAgICAgICd4JywgJzEnLCAnMicsICczJyxcbiAgICAgICdxJywgJ3cnLCAnZScsICdhJyxcbiAgICAgICdzJywgJ2QnLCAneicsICdjJyxcbiAgICAgICc0JywgJ3InLCAnZicsICd2J1xuICAgIF07XG5cbiAgICB0aGlzLl9pbml0KCk7XG4gIH1cblxuICBfc2V0S2V5RG93bihrZXkpXG4gIHtcbiAgICAgIHRoaXMua2V5RGF0YVtrZXldID0gMTtcbiAgICAgIGlmICh0aGlzLl9jYWxsYmFjaykgdGhpcy5fY2FsbGJhY2sodGhpcy5rZXlEYXRhKTtcbiAgfVxuXG4gIF9zZXRLZXlVcChrZXkpXG4gIHtcbiAgICAgIHRoaXMua2V5RGF0YVtrZXldID0gMDtcbiAgICAgIGlmICh0aGlzLl9jYWxsYmFjaykgdGhpcy5fY2FsbGJhY2sodGhpcy5rZXlEYXRhKTtcbiAgfVxuXG4gIF9pbml0KClcbiAge1xuICAgIC8vSEFDSzogY29udmVydCBhcnJheSBpbnRvIGludGVnZXIgYXNjaWkgY29kZXMgZm9yIHF1aWNrZXIgbG9va3VwXG4gICAgZm9yIChsZXQgaz0wO2s8dGhpcy5rZXlNYXAubGVuZ3RoO2srKylcbiAgICAgIHRoaXMua2V5TWFwW2tdID0gdGhpcy5rZXlNYXBba10uY2hhckNvZGVBdCgwKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICAgIHZhciBjb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLmtleUNvZGUpLnRvTG93ZXJDYXNlKCkuY2hhckNvZGVBdCgwKVxuICAgICAgZm9yIChsZXQgaz0wOyBrPHRoaXMua2V5TWFwLmxlbmd0aDsgaysrKVxuICAgICAge1xuICAgICAgICBpZiAodGhpcy5rZXlNYXBba10gPT0gY29kZSlcbiAgICAgICAgICB0aGlzLl9zZXRLZXlEb3duKGspO1xuICAgICAgfVxuICAgICAgLy90aGlzLnByaW50VGFibGUoKTtcbiAgICB9LCB0cnVlKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChlKSA9PiB7XG4gICAgICAvL2xvZy53YXJuKCk7XG4gICAgICB2YXIgY29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZS5rZXlDb2RlKS50b0xvd2VyQ2FzZSgpLmNoYXJDb2RlQXQoMClcbiAgICAgIGZvciAobGV0IGs9MDsgazx0aGlzLmtleU1hcC5sZW5ndGg7IGsrKylcbiAgICAgIHtcbiAgICAgICAgaWYgKHRoaXMua2V5TWFwW2tdID09IGNvZGUpXG4gICAgICAgICAgdGhpcy5fc2V0S2V5VXAoayk7XG4gICAgICB9XG4gICAgfSwgdHJ1ZSk7XG5cbiAgfVxuXG5cblxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZG9tL2lucHV0LmpzIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIG5ldyBXb3JrZXIoX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIjFhNjdlNmYzOWY5MzdhM2VjMjY0Lndvcmtlci5qc1wiKTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3dvcmtlci1sb2FkZXIhLi9jaGlwOC13b3JrZXIuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==