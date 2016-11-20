
import log from 'loglevel';

import {$_instr_0x0} from './opcode-0x0.js';
import {$_instr_0x8} from './opcode-0x8.js';
import {$_instr_0xE} from './opcode-0xE.js';
import {$_instr_0xF} from './opcode-0xF.js';

const _VF        = 0xf;              // Flag register

export let opcodes = [

  function({major, minor})  // 0x0???
  {
    $_instr_0x0[minor & 0xff].call(this, {major, minor});
  },

  function({major, minor}) //0x1nnn: JMP nnn
  {
    this.reg._ip = minor&0xfff;
    return true;
  },

  function({major, minor}) // 0x2nnn: CALL nnn
  {
    this.stack.push(this.reg.ip);
    this.reg._ip = minor&0xfff;
    return true;
  },

  function({major, minor}) // 0x3XRR // jump next instr if vX == RR
  {
    if (this.reg.v[(minor>>8)&0xf] == (minor&0xff))
      this.reg._ip += 2;
  },

  function({major, minor}) //4
  {
    if (this.reg.v[(minor>>8)&0xf] != (minor&0xff))
      this.reg._ip += 2;
  },

  function({major, minor}) //5
  {
    this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
  },

  function ({major, minor}) // 0x6xnn  mov vx, nn
  {
    this.reg.v[(minor>>8)&0xf] = minor & 0xff;
  },

  function({major, minor}) // 0x7xrr add vx, rr
  {
    let x = (minor>>8)&0xf
    this.reg.v[x] += minor&0xff;
    this.reg.v[x] &= 255;

  },

  function({major, minor}) // 0x8
  {
    $_instr_0x8[minor & 0xf].call(this, {major, minor});
  },

  function({major, minor}) // 9
  {
    this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
  },

  function({major, minor}) // 0xAnnn: mvi nnn (load 'I' with nnn)
  {
    this.reg.i = minor & 0xfff;
  },

  function({major, minor}) // b
  {
    this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
  },

  function({major, minor}) // 0xCxkk; rnd vx, kk
  {
    let rnd = Math.floor(Math.random() * 255) & (minor&0xff)
    this.reg.v[(minor>>8)&0xf] = rnd;
  },

  function ({major, minor})  // 0xDxyn: DRW Vx, Vy, n  (draw sprite)
  {
    let r = this.reg, m = minor;
    r.v[_VF] = this.gfx.draw(r.i, r.v[(m>>8)&0xf], r.v[(m>>4)&0xf], m&0xf);
  },

  function({major, minor}) // 0xE
  {
    $_instr_0xE[minor & 0xff].call(this, {major, minor});
  },

  function({major, minor})  // 0xFx??
  {
    $_instr_0xF[minor & 0xff].call(this, {major, minor});
  }
];
