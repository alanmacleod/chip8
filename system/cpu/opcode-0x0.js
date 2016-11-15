
import log from 'loglevel';

let MAX_INSTR = 0xFF;
let $_instr_0x0 = [];

// probs a smarter way to do this but oh well
for (var t=0; t<=MAX_INSTR; t++)
  $_instr_0x0.push( $_instr_0x0_notimp );


$_instr_0x0[0xEE] = function({major, minor}) // RET (stack.pop)
{
  let addr = this.stack.pop();
  log.info(`-> STACK.pop()`);
  log.info(`ret [0x${addr.toString(16)}]`);
  this.reg._ip = addr;
}


export {$_instr_0x0};

function $_instr_0x0_notimp({major, minor})
{
  this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] (M-0x0) Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`});
}
