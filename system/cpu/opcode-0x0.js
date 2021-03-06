
import log from 'loglevel';

let MAX_INSTR = 0xFF;
let $_instr_0x0 = [];

// probs a smarter way to do this but oh well
for (var t=0; t<=MAX_INSTR; t++)
  $_instr_0x0.push( {} );

$_instr_0x0[0xE0] = function({major, minor}) // RET (stack.pop)
{
  this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
}

$_instr_0x0[0xEE] = function({major, minor}) // RET (stack.pop)
{
  let addr = this.stack.pop();
  this.reg._ip = addr;
}

export {$_instr_0x0};
