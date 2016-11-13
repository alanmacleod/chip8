
import Base from '../../util/base';
import {opcodes} from './opcodes';

const WORD_SIZE = 2; // 16-bit instruction
const IP_INIT = 0x200; // = 512. Bytes 0-511 reserved for built-in interpreter

export default class CPU extends Base
{
  constructor(gfx)
  {
    super();
    this._this = "CPU"; // for context debugging
    this.gfx = gfx;

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

  fetch(ram)
  {
    return ram.readWord(this.reg.ip);
  }

  decode(instr)
  {
    let i = instr & 0xffff;
    let major = (i & 0xf000) >> 12,
        minor = i & 0x0fff;
    return {major, minor}
  }

  execute({major, minor})
  {
    if (!this.exec[major].call(this, {major, minor}))
        this.next();
  }

  _debug_dump_registers()
  {
    console.log("==CPU REGISTER DUMP==")
    console.log(this.reg);
  }


}
