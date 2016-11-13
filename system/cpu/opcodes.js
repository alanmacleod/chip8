
import {$_instr_0x8} from './opcode-0x8.js';

export let opcodes = [
  notimp,  // 0x0???
  notimp,  // 0x1???
  function({major, minor}) // 0x2nnn: CALL nnn
  {
    this.stack.push(this.reg.ip);
    this.reg._ip = minor&0xfff;
    console.log(`call 0x${(minor&0xfff).toString(16)}`);
    return true;
  },
  notimp,  // 0x3???
  notimp,  // 0x4???
  notimp,  // 0x5???
  function ({major, minor}) // 0x6xx
  {
    this.reg.v[(minor>>8)&0xf] = minor & 0xff;
    console.log(`mov v${((minor>>8)&0xf).toString(16)}, ${minor & 0xff}`);
  },

  notimp,  // 0x7???

  function({major, minor}) // 0x8
  {
    $_instr_0x8[minor & 0xf].call(this, {major, minor});
  },

  notimp,  // 0x9???
  function({major, minor}) // 0xAnnn: mvi nnn (load 'I' with nnn)
  {
    this.reg.i = minor & 0xfff;
    console.log(`mvi ${minor & 0xfff}`);

  },
  notimp,  // 0xB???
  notimp,  // 0xC???
  function ({major, minor})  // 0xDxyn: DRW Vx, Vy, n  (draw sprite)
  {
    let r = this.reg, m = minor;
    r.vf = this.gfx.draw(r.i, r.v[(m>>8)&0xf], r.v[(m>>4)&0xf], m&0xf);
    console.log(`drw ${r.v[(m>>8)&0xf]}, ${r.v[(m>>4)&0xf]}, ${m&0xf}`);
  },
  notimp,  // 0xE???
  notimp   // 0xF???
];


function notimp({major, minor})
{
  this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}${minor.toString(16)}`});
}
