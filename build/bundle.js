/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

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

	console.log('CHIP-8 Virtual Machine');

	var canvas = document.getElementById('display');
	var c = new _chip2.default(canvas);

	c.on('error', function (data) {

	    c.halt();
	    console.log("\n", data.error, "\n");
	});

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

	var _ram = __webpack_require__(9);

	var _ram2 = _interopRequireDefault(_ram);

	var _loader = __webpack_require__(10);

	var _loader2 = _interopRequireDefault(_loader);

	var _gfx = __webpack_require__(11);

	var _gfx2 = _interopRequireDefault(_gfx);

	var _renderer = __webpack_require__(12);

	var _renderer2 = _interopRequireDefault(_renderer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BIOS_URL = "./bios.json";

	var Chip8 = function (_Base) {
	  _inherits(Chip8, _Base);

	  function Chip8(displayElement) {
	    _classCallCheck(this, Chip8);

	    var _this = _possibleConstructorReturn(this, (Chip8.__proto__ || Object.getPrototypeOf(Chip8)).call(this));

	    _this.ram = new _ram2.default();
	    _this.gfx = new _gfx2.default(_this.ram.data);
	    _this.cpu = new _cpu2.default(_this.gfx, _this.ram);
	    _this.renderer = new _renderer2.default(displayElement, _this.gfx.display, _this.gfx.size(), 20);

	    _this.loader = new _loader2.default();

	    _this.ram.on('gpf', function (data) {
	      this.emit('error', data);
	    }.bind(_this)); // Override 'this' to use Chip8() context instead of RAM()'s

	    _this.cpu.on('opcode', function (data) {
	      this.emit('error', data);
	      this.cpu._debug_dump_registers();
	    }.bind(_this));

	    _this.gfx.on('changed', function () {
	      this.renderer.Render();
	    }.bind(_this));

	    _this.reset();
	    _this._init_bios();
	    _this._executing = false;
	    return _this;
	  }

	  _createClass(Chip8, [{
	    key: 'poweron',
	    value: function poweron() {
	      this._executing = true;

	      //TODO: requestAnimationFrame or setTimeout() here, "while()" locks-up browsers!

	      while (this._executing) {
	        this.cpu.execute(this.cpu.decode(this.cpu.fetch()));
	      }
	    }
	  }, {
	    key: 'halt',
	    value: function halt() {
	      console.log("Halting execution...");
	      this._executing = false;
	    }
	  }, {
	    key: 'load',
	    value: function load(url, callback) {
	      var _this2 = this;

	      console.log('Fetching: \'' + url + '\'');

	      this.loader.load(url, function (data) {
	        console.log('Loading title \'' + data.title + '\'');

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
	      var binary_string = window.atob(base64);
	      var len = binary_string.length;

	      var bytes = new Uint8Array(len);
	      for (var i = 0; i < len; i++) {
	        bytes[i] = binary_string.charCodeAt(i);
	      }return bytes;
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      this.cpu.reset();
	      this.ram.reset();
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

	var _base = __webpack_require__(2);

	var _base2 = _interopRequireDefault(_base);

	var _opcodes = __webpack_require__(5);

	var _timerDelay = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../system/timer-delay\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _timerDelay2 = _interopRequireDefault(_timerDelay);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var WORD_SIZE = 2; // 16-bit instruction
	var IP_INIT = 0x200; // = 512. Bytes 0-511 reserved for built-in interpreter

	var CPU = function (_Base) {
	  _inherits(CPU, _Base);

	  function CPU(gfx, ram) {
	    _classCallCheck(this, CPU);

	    var _this = _possibleConstructorReturn(this, (CPU.__proto__ || Object.getPrototypeOf(CPU)).call(this));

	    _this._this = "CPU"; // for context debugging
	    _this.gfx = gfx;
	    _this.ram = ram;

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
	      return this.ram.readWord(this.reg.ip);
	    }
	  }, {
	    key: 'decode',
	    value: function decode(instr) {
	      var i = instr & 0xffff;
	      var major = (i & 0xf000) >> 12,
	          minor = i & 0x0fff;
	      return { major: major, minor: minor };
	    }
	  }, {
	    key: 'execute',
	    value: function execute(_ref2) {
	      var major = _ref2.major,
	          minor = _ref2.minor;

	      if (!this.exec[major].call(this, { major: major, minor: minor })) this.next();
	    }
	  }, {
	    key: '_debug_dump_registers',
	    value: function _debug_dump_registers() {
	      console.log("==CPU REGISTER DUMP==");
	      console.log(this.reg);
	    }
	  }]);

	  return CPU;
	}(_base2.default);

	exports.default = CPU;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.opcodes = undefined;

	var _opcode0x = __webpack_require__(6);

	var _opcode0x2 = __webpack_require__(7);

	var _opcode0xF = __webpack_require__(8);

	var opcodes = exports.opcodes = [function (_ref) // 0x0???
	{
	  var major = _ref.major,
	      minor = _ref.minor;

	  _opcode0x.$_instr_0x0[minor & 0xff].call(this, { major: major, minor: minor });
	}, notimp, // 0x1???

	function (_ref2) // 0x2nnn: CALL nnn
	{
	  var major = _ref2.major,
	      minor = _ref2.minor;

	  console.log('-> STACK.push(0x' + this.reg.ip.toString(16) + ')');
	  this.stack.push(this.reg.ip);
	  this.reg._ip = minor & 0xfff;
	  console.log('call 0x' + (minor & 0xfff).toString(16));
	  return true;
	}, notimp, // 0x3???
	notimp, // 0x4???
	notimp, // 0x5???

	function (_ref3) // 0x6xnn  mov vx, nn
	{
	  var major = _ref3.major,
	      minor = _ref3.minor;

	  this.reg.v[minor >> 8 & 0xf] = minor & 0xff;
	  console.log('mov v' + (minor >> 8 & 0xf).toString(16) + ', ' + (minor & 0xff));
	}, function (_ref4) // 0x7xrr add vx, rr
	{
	  var major = _ref4.major,
	      minor = _ref4.minor;

	  console.log('add v' + (minor >> 8 & 0xf) + ', ' + (minor & 0xff));
	  this.reg.v[minor >> 8 & 0xf] += minor & 0xff;
	}, function (_ref5) // 0x8
	{
	  var major = _ref5.major,
	      minor = _ref5.minor;

	  _opcode0x2.$_instr_0x8[minor & 0xf].call(this, { major: major, minor: minor });
	}, notimp, // 0x9???
	function (_ref6) // 0xAnnn: mvi nnn (load 'I' with nnn)
	{
	  var major = _ref6.major,
	      minor = _ref6.minor;

	  this.reg.i = minor & 0xfff;
	  console.log('mvi ' + (minor & 0xfff));
	}, notimp, // 0xB???
	notimp, // 0xC???
	function (_ref7) // 0xDxyn: DRW Vx, Vy, n  (draw sprite)
	{
	  var major = _ref7.major,
	      minor = _ref7.minor;

	  var r = this.reg,
	      m = minor;
	  r.vf = this.gfx.draw(r.i, r.v[m >> 8 & 0xf], r.v[m >> 4 & 0xf], m & 0xf);
	  console.log('drw ' + r.v[m >> 8 & 0xf] + ', ' + r.v[m >> 4 & 0xf] + ', ' + (m & 0xf));
	}, notimp, // 0xE???
	function (_ref8) // 0xFx??
	{
	  var major = _ref8.major,
	      minor = _ref8.minor;

	  _opcode0xF.$_instr_0xF[minor & 0xff].call(this, { major: major, minor: minor });
	}];

	function notimp(_ref9) {
	  var major = _ref9.major,
	      minor = _ref9.minor;

	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal instruction: 0x' + major.toString(16) + minor.toString(16) });
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var MAX_INSTR = 0xFF;
	var $_instr_0x0 = [];

	// probs a smarter way to do this but oh well
	for (var t = 0; t <= MAX_INSTR; t++) {
	  $_instr_0x0.push($_instr_0x0_notimp);
	}$_instr_0x0[0xEE] = function (_ref) // RET (stack.pop)
	{
	  var major = _ref.major,
	      minor = _ref.minor;

	  var addr = this.stack.pop();
	  console.log('-> STACK.pop()');
	  console.log('ret [0x' + addr.toString(16) + ']');
	  this.reg._ip = addr;
	};

	exports.$_instr_0x0 = $_instr_0x0;


	function $_instr_0x0_notimp(_ref2) {
	  var major = _ref2.major,
	      minor = _ref2.minor;

	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] (M-0x0) Illegal instruction: 0x' + major.toString(16) + minor.toString(16) });
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var $_instr_0x8 = exports.$_instr_0x8 = [$_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp];

	function $_instr_0x8_notimp(_ref) {
	    var major = _ref.major,
	        minor = _ref.minor;

	    this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] (M-0x8) Illegal instruction: 0x' + major.toString(16) + minor.toString(16) });
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var MAX_INSTR = 0x65;
	var $_instr_0xF = [];

	// probs a smarter way to do this but oh well
	for (var t = 0; t <= MAX_INSTR; t++) {
	  $_instr_0xF.push($_instr_0xF_notimp);
	}$_instr_0xF[0x29] = function (_ref) {
	  var major = _ref.major,
	      minor = _ref.minor;

	  console.log('ld i, [[v' + (minor >> 8 & 0xf) + ']]');
	  var val = this.reg.v[minor >> 8 & 0xf];
	  this.reg.i = this.ram.getCharAddrBIOS() + this.ram.getCharSizeBIOS() * val;
	};

	$_instr_0xF[0x33] = function (_ref2) // Fx33: bcd [i], Vx (store bcd of reg Vx at address reg i->i+2)
	{
	  var major = _ref2.major,
	      minor = _ref2.minor;


	  console.log('bcd [i], v' + (minor >> 8 & 0xf));
	  var v = this.reg[minor >> 8 & 0xf];
	  this.ram.data[this.reg.i + 0] = Math.floor(v / 100);
	  this.ram.data[this.reg.i + 1] = Math.floor(v % 100 / 10);
	  this.ram.data[this.reg.i + 2] = v % 10;
	};

	$_instr_0xF[0x65] = function (_ref3) // Fx65: mov v0-vx, [i] (load numbers from reg.i into reg.v0 -> reg.vx)
	{
	  var major = _ref3.major,
	      minor = _ref3.minor;

	  console.log('mov v0..v' + (minor >> 8 & 0xf) + ', [i]');
	  for (var x = 0, mx = minor >> 8 & 0xf; x <= mx; x++) {
	    this.reg.v[x] = this.ram.data[this.reg.i + x];
	  }this.reg.i += x; // i = i + X + 1
	};

	exports.$_instr_0xF = $_instr_0xF;


	function $_instr_0xF_notimp(_ref4) {
	  var major = _ref4.major,
	      minor = _ref4.minor;

	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] (M-0xF) Illegal instruction: 0x' + major.toString(16) + minor.toString(16) });
	}

/***/ },
/* 9 */
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
/* 10 */
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
/* 11 */
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
/* 12 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Renderer = function () {
	  function Renderer(element, video, dimensions) {
	    var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

	    _classCallCheck(this, Renderer);

	    this.element = element;
	    this.video = video; // pixel buffer of the Chip8 system in bytes

	    this.scale = Math.floor(scale) || 1;

	    this.videodim = dimensions;
	    this.dim = { width: dimensions.width * this.scale, height: dimensions.height * this.scale };

	    this.renderContext = this.element.getContext("2d");

	    console.log("Video size " + this.video.length + " bytes, width: " + this.dim.width + ", height: " + this.dim.height);
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
	  }

	  _createClass(Renderer, [{
	    key: "Render",
	    value: function Render() {
	      var o = 0;
	      for (var y = 0; y < this.videodim.height; y++) {
	        for (var x = 0; x < this.videodim.width; x++) {
	          var v = this.video[o++];
	          var p = v ? this.pixel_on : this.pixel_off;
	          this.renderContext.putImageData(p, this.scale * x, this.scale * y);
	        }
	      }
	    }
	  }]);

	  return Renderer;
	}();

	exports.default = Renderer;

/***/ }
/******/ ]);