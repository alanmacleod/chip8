
import log from 'loglevel';

let MAX_INSTR = 0xA1;
let $_instr_0xE = [];

// probs a smarter way to do this but oh well
for (var t=0; t<=MAX_INSTR; t++)
  $_instr_0xE.push( {} );

$_instr_0xE[0x9E] = function({major, minor})
{
  this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
}

$_instr_0xE[0xA1] = function({major, minor})
{
  if (this.ram.data[this.keyStateAddr + this.reg.v[(minor>>8)&0xf]] == 0)
    this.reg._ip += 2;
}


export {$_instr_0xE};
