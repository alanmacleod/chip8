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

	var c = new _chip2.default();

	c.on('error', function (data) {
	  c.stop();
	  console.log("\n", data.error, "\n");
	});

	c.load('./rom.rom');
	c.start();

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

	var _ram = __webpack_require__(7);

	var _ram2 = _interopRequireDefault(_ram);

	var _fs = __webpack_require__(8);

	var _fs2 = _interopRequireDefault(_fs);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Chip8 = function (_Base) {
	  _inherits(Chip8, _Base);

	  function Chip8() {
	    _classCallCheck(this, Chip8);

	    var _this = _possibleConstructorReturn(this, (Chip8.__proto__ || Object.getPrototypeOf(Chip8)).call(this));

	    console.log(_fs2.default);

	    _this.cpu = new _cpu2.default();
	    _this.ram = new _ram2.default();

	    _this.ram.on('gpf', function (data) {
	      this.emit('error', data);
	    }.bind(_this));

	    _this.cpu.on('opcode', function (data) {
	      this.emit('error', data);
	    }.bind(_this));

	    _this.reset();
	    _this._executing = false;
	    return _this;
	  }

	  _createClass(Chip8, [{
	    key: 'start',
	    value: function start() {
	      this._executing = true;

	      this.ram.writeWord(512, 0x8124); // 8xy0 -> MOV Vx, Vy

	      while (this._executing) {
	        this.cpu.execute(this.cpu.decode(this.cpu.fetch(this.ram)));
	      }
	    }
	  }, {
	    key: 'stop',
	    value: function stop() {
	      console.log("Halting execution...");
	      this._executing = false;
	    }
	  }, {
	    key: 'load',
	    value: function load(rom) {
	      // load cartridge rom into ram

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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var WORD_SIZE = 2; // 16-bit instruction
	var IP_INIT = 0x200; // = 512. Bytes 0-511 reserved for built-in interpreter

	var CPU = function (_Base) {
	  _inherits(CPU, _Base);

	  function CPU() {
	    _classCallCheck(this, CPU);

	    var _this = _possibleConstructorReturn(this, (CPU.__proto__ || Object.getPrototypeOf(CPU)).call(this));

	    _this._this = "CPU"; // for context debugging

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
	    value: function fetch(ram) {
	      return ram.readWord(this.reg.ip);
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

	      this.exec[major].call(this, { major: major, minor: minor });
	      this.next();
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

	var opcodes = exports.opcodes = [notimp, // 0x0???
	notimp, // 0x1???
	notimp, // 0x2???
	notimp, // 0x3???
	notimp, // 0x4???
	notimp, // 0x5???
	notimp, // 0x6???
	notimp, // 0x7???

	function (_ref) // 0x8
	{
	  var major = _ref.major,
	      minor = _ref.minor;

	  _opcode0x.$_instr_0x8[minor & 0xf].call(this, { major: major, minor: minor });
	}, notimp, // 0x9???
	notimp, // 0xA???
	notimp, // 0xB???
	notimp, // 0xC???
	notimp, // 0xD???
	notimp, // 0xE???
	notimp // 0xF???
	];

	function notimp(_ref2) {
	  var major = _ref2.major,
	      minor = _ref2.minor;

	  this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] Illegal/Unimplemented instruction: 0x' + major.toString(16) + minor.toString(16) });
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var $_instr_0x8 = exports.$_instr_0x8 = [$_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp, $_instr_0x8_notimp];

	function $_instr_0x8_notimp(_ref) {
	    var major = _ref.major,
	        minor = _ref.minor;

	    this.fire('opcode', { error: '[ADDR 0x' + this.reg.ip.toString(16) + '] (M-0x8) Illegal/Unimplemented instruction: 0x' + major.toString(16) + minor.toString(16) });
	}

/***/ },
/* 7 */
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

	var RAM = function (_Base) {
	  _inherits(RAM, _Base);

	  function RAM() {
	    _classCallCheck(this, RAM);

	    var _this = _possibleConstructorReturn(this, (RAM.__proto__ || Object.getPrototypeOf(RAM)).call(this));

	    _this._raw_data = new ArrayBuffer(0x1000);
	    _this.data = new Uint8Array(_this._raw_data);
	    _this._this = "RAM";
	    return _this;
	  }

	  _createClass(RAM, [{
	    key: 'reset',
	    value: function reset() {
	      //this.data = new Array(0x1000).fill(0);
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
	    key: '_validate_address',
	    value: function _validate_address(addr) {
	      //TODO: Handle execution halt
	      //TODO: Memory map?

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
/* 8 */
/***/ function(module, exports) {

	"use strict";

/***/ }
/******/ ]);