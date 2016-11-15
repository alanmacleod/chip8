
import log from 'loglevel';

let MAX_INSTR = 0x65;
let $_instr_0xF = [];

// probs a smarter way to do this but oh well
for (var t=0; t<=MAX_INSTR; t++)
  $_instr_0xF.push( $_instr_0xF_notimp );

$_instr_0xF[0x07] = function({major, minor}) // Fx07: read delay timer from Vx
{
  log.info(`mov v${(minor>>8)&0xf}, dt`);
  this.reg.v[(minor>>8)&0xf] = this.delayTimer.get();
}

$_instr_0xF[0x15] = function({major, minor}) // Fx15: set delay timer from Vx
{
  log.info(`mov dt, v${(minor>>8)&0xf}`);
  this.delayTimer.set(this.reg.v[(minor>>8)&0xf]);

}

$_instr_0xF[0x29] = function({major, minor})
{
  log.info(`ld i, [[v${(minor>>8)&0xf}]]`);
  let val = this.reg.v[(minor>>8)&0xf];
  this.reg.i = this.ram.getCharAddrBIOS() + (this.ram.getCharSizeBIOS() * val);

}

$_instr_0xF[0x33] = function({major, minor}) // Fx33: bcd [i], Vx (store bcd of reg Vx at address reg i->i+2)
{

  log.info(`bcd [i], v${(minor>>8)&0xf}`);
  let v = this.reg[(minor>>8)&0xf];
  this.ram.data[this.reg.i+0] = Math.floor(v / 100);
  this.ram.data[this.reg.i+1] = Math.floor((v % 100) / 10);
  this.ram.data[this.reg.i+2] = (v % 10);
}

$_instr_0xF[0x65] = function({major, minor}) // Fx65: mov v0-vx, [i] (load numbers from reg.i into reg.v0 -> reg.vx)
{
  log.info(`mov v0..v${(minor>>8)&0xf}, [i]`);
  for (var x=0, mx=(minor>>8)&0xf; x<=mx; x++)
    this.reg.v[x] = this.ram.data[this.reg.i + x];

  this.reg.i += x; // i = i + X + 1
}


export {$_instr_0xF};

function $_instr_0xF_notimp({major, minor})
{
  this._executing = false;
  this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] (M-0xF) Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`});
}
