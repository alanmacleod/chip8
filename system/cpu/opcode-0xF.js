
import log from 'loglevel';

let MAX_INSTR = 0x65;
let $_instr_0xF = [];

// probs a smarter way to do this but oh well
for (var t=0; t<=MAX_INSTR; t++)
  $_instr_0xF.push({});

$_instr_0xF[0x07] = function({major, minor}) // Fx07: read delay timer from Vx
{
  this.reg.v[(minor>>8)&0xf] = this.delayTimer.get();
}

$_instr_0xF[0x0A] = function({major, minor})
{
  this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
}

$_instr_0xF[0x15] = function({major, minor}) // Fx15: set delay timer from Vx
{
  this.delayTimer.set(this.reg.v[(minor>>8)&0xf]);
}

$_instr_0xF[0x18] = function({major, minor})
{
  //this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
}
$_instr_0xF[0x1E] = function({major, minor})
{
  this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
}

$_instr_0xF[0x29] = function({major, minor})
{
  let val = this.reg.v[(minor>>8)&0xf];
  this.reg.i = this.ram.getCharAddrBIOS() + (this.ram.getCharSizeBIOS() * val);
}

$_instr_0xF[0x30] = function({major, minor})
{
  this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
}

$_instr_0xF[0x33] = function({major, minor}) // Fx33: bcd [i], Vx (store bcd of reg Vx at address reg i->i+2)
{
  let v = this.reg.v[(minor>>8)&0xf];
  this.ram.data[this.reg.i+0] = Math.floor(v / 100);
  this.ram.data[this.reg.i+1] = Math.floor((v % 100) / 10);
  this.ram.data[this.reg.i+2] = (v % 10);
}

$_instr_0xF[0x55] = function({major, minor})
{
  this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
}

$_instr_0xF[0x65] = function({major, minor}) // Fx65: mov v0-vx, [i] (load numbers from reg.i into reg.v0 -> reg.vx)
{
  for (var x=0, mx=(minor>>8)&0xf; x<=mx; x++)
    this.reg.v[x] = this.ram.data[this.reg.i + x];

  this.reg.i += x; // i = i + X + 1
}

export {$_instr_0xF};
