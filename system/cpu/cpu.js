
import log from 'loglevel';
import Base from '../../util/base';
import {opcodes} from './opcodes';

import DelayTimer         from '../timer-delay';

const WORD_SIZE = 2; // 16-bit instruction
const IP_INIT = 0x200; // = 512. Bytes 0-511 reserved for built-in interpreter
const TRACE_BUFFER_SIZE = 20;  // store last 10 instructions

export default class CPU extends Base
{
  constructor(gfx, ram)
  {
    super();
    this._this = "CPU"; // for context debugging
    this.gfx = gfx;
    this.ram = ram;

    this._trace = new Array(TRACE_BUFFER_SIZE);
    this._trace_ptr = 0;

    // I feel like this should be part of the Chip8() object/system instead of
    // in here but the delay timer appears to be only accessed or used directly
    // by the CPU so whatever
    this.delayTimer = new DelayTimer();

    this.reg = {
      v: [],
      i:  0,
      vf: 0,
      _ip: 0,
      _sp: 0,
      get ip() {return this._ip},
      get sp() {return this._sp},
    };

    this.stack = []
    this.exec = opcodes;
  }

  reset()
  {
    let r = this.reg;
    [r.v, r.i, r.vf, r._ip, r._sp] = [new Array(16).fill(0),0,0,IP_INIT,0];
  }

  next()
  {
    this.reg._ip += WORD_SIZE;
  }

  fetch()
  {
    //if (!this._executing) return 0;
    return this.ram.readWord(this.reg.ip);
  }

  decode(instr)
  {
    //if (!this._executing) return 0;
    let i = instr & 0xffff;
    let major = (i & 0xf000) >> 12,
        minor = i & 0x0fff;

    this._add_to_trace_loop(instr, this.reg.ip);

    return {major, minor}
  }

  execute({major, minor})
  {
    //if (!this._executing) return 0;
    if (!this.exec[major].call(this, {major, minor}))
        this.next();
  }

  // I am particularly pleased with this looped buffer solution
  // to record a window/snapshot of a data-stream of infinite (unknown) length
  _add_to_trace_loop(i,a)
  {
    this._trace[this._trace_ptr++] = {i, a}
    if (this._trace_ptr == TRACE_BUFFER_SIZE)
      this._trace_ptr = 0;
  }

  _unroll_trace_loop()
  {
    let trace_unrolled = {i:[], a:[]};

    let ip = this._trace_ptr;
    for (let p=0; p<TRACE_BUFFER_SIZE; p++)
    {
      //trace_unrolled.push(this._trace[ip])
      trace_unrolled.a.push(this._trace[ip].a);
      trace_unrolled.i.push(this._trace[ip].i)
      if (--ip < 0) ip = TRACE_BUFFER_SIZE-1;
    }

    trace_unrolled.a.reverse();
    trace_unrolled.i.reverse();
    return trace_unrolled;
  }

  trace()
  {
    return this._unroll_trace_loop();
  }

  dump_registers()
  {
    //log.debug("== CPU REGISTER DUMP ==")
    //log.debug(this.reg);
    return this.reg;
  }


}
