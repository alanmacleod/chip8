
import log from 'loglevel';

import {$_instr_0x0} from './opcode-0x0.js';
import {$_instr_0x8} from './opcode-0x8.js';
import {$_instr_0xF} from './opcode-0xF.js';

export let opcodes = [
  function({major, minor})  // 0x0???
  {
    $_instr_0x0[minor & 0xff].call(this, {major, minor});
  },

  function({major, minor}) //0x1nnn: JMP nnn
  {
    //log.info(`jmp ${minor&0xfff}`);
    this.reg._ip = minor&0xfff;
    return true;
  },

  function({major, minor}) // 0x2nnn: CALL nnn
  {
    //log.info(`-> STACK.push(0x${(this.reg.ip).toString(16)})`)
    this.stack.push(this.reg.ip);
    this.reg._ip = minor&0xfff;
    //log.info(`call 0x${(minor&0xfff).toString(16)}`);
    return true;
  },

  function({major, minor}) // 0x3XRR // jump next instr if vX == RR
  {
    //log.info(`jeq ${(minor>>8)&0xf}, ${minor&0xff}`);
    if (this.reg.v[(minor>>8)&0xf] == (minor&0xff))
      this.reg._ip += 2;
  },

  notimp,  // 0x4???
  notimp,  // 0x5???

  function ({major, minor}) // 0x6xnn  mov vx, nn
  {
    this.reg.v[(minor>>8)&0xf] = minor & 0xff;
    //log.info(`mov v${((minor>>8)&0xf).toString(16)}, ${minor & 0xff}`);
  },

  function({major, minor}) // 0x7xrr add vx, rr
  {
    //log.info(`add v${(minor>>8)&0xf}, ${minor&0xff}`);
    this.reg.v[(minor>>8)&0xf] += minor&0xff;
  },

  function({major, minor}) // 0x8
  {
    $_instr_0x8[minor & 0xf].call(this, {major, minor});
  },

  notimp,  // 0x9???
  function({major, minor}) // 0xAnnn: mvi nnn (load 'I' with nnn)
  {
    this.reg.i = minor & 0xfff;
    //log.info(`mvi ${minor & 0xfff}`);

  },
  notimp,  // 0xB???
  function({major, minor}) // 0xCxkk; rnd vx, kk
  {
    let rnd = Math.floor(Math.random() * 255) & (minor&0xff)
    //log.info(`rnd v${(minor>>8)&0xf}, ${minor&0xff} [${rnd}]`)
    this.reg.v[(minor>>8)&0xf] = rnd;

  },
  function ({major, minor})  // 0xDxyn: DRW Vx, Vy, n  (draw sprite)
  {
    let r = this.reg, m = minor;
    r.vf = this.gfx.draw(r.i, r.v[(m>>8)&0xf], r.v[(m>>4)&0xf], m&0xf);
    //log.info(`drw ${r.v[(m>>8)&0xf]}, ${r.v[(m>>4)&0xf]}, ${m&0xf}`);
  },
  notimp,  // 0xE???
  function({major, minor})  // 0xFx??
  {
    $_instr_0xF[minor & 0xff].call(this, {major, minor});
  }
];


function notimp({major, minor})
{
  this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`});
}
