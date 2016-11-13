

import {$_instr_0x8} from './opcode-0x8.js';

export let opcodes = [
  notimp,  // 0x0???
  notimp,  // 0x1???
  notimp,  // 0x2???
  notimp,  // 0x3???
  notimp,  // 0x4???
  notimp,  // 0x5???
  notimp,  // 0x6???
  notimp,  // 0x7???

  function({major, minor}) // 0x8
  {
    $_instr_0x8[minor & 0xf].call(this, {major, minor});
  },

  notimp,  // 0x9???
  notimp,  // 0xA???
  notimp,  // 0xB???
  notimp,  // 0xC???
  notimp,  // 0xD???
  notimp,  // 0xE???
  notimp   // 0xF???
];


function notimp({major, minor})
{
  this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal/Unimplemented instruction: 0x${major.toString(16)}${minor.toString(16)}`});
}
