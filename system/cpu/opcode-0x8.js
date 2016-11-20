
let $_instr_0x8 = [];

const _VF        = 0xf;              // Flag register

$_instr_0x8[0x0] = function({major, minor})
{
  this.reg.v[minor>>8&0xf] = this.reg.v[(minor>>4)&0xf];
  //this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
}
$_instr_0x8[0x1] = function({major, minor})
{
  this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
}

$_instr_0x8[0x2] = function({major, minor}) // and vx, vy
{
  let vx = (minor>>8)&0xf;
  let vy = (minor>>4)&0xf;
  let rx = this.reg.v[vx];
  let ry = this.reg.v[vy];
  let res = this.reg.v[vx] & this.reg.v[(minor>>4)&0xf];
  let msg = `and ${vx}, ${vy} (and ${rx}, ${ry} = ${res})`;
  this.reg.v[vx] = res;//this.reg.v[vx] & this.reg.v[(minor>>4)&0xf];
  //this.fire('opcode', {error: msg});
  //console.log(msg);
  //this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
}
$_instr_0x8[0x3] = function({major, minor})
{
  this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
}
$_instr_0x8[0x4] = function({major, minor}) // ADD vx, vy -> vf
{
  //this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});

  let x = (minor>>8)&0xf, y = (minor>>4)&0xf;
  this.reg.v[x] += this.reg.v[y];
  this.reg.v[_VF] = +(this.reg.v[x] > 255);
  if (this.reg.v[x] > 255) this.reg.v[x] -= 256;

  // let vx = (minor>>8)&0xf;
  // let r = this.reg.v[vx] + this.reg.v[(minor>>4)&0xf];
  // let msg = `${this.reg.v[vx]} + ${this.reg.v[(minor>>4)&0xf]} = ${r} (actual = ${this.reg.v[vx]}, flag = ${this.reg.vf})`;
  // this.reg.v[vx] = r&0xff;
  // this.reg.vf = (!!(r&0xff00))+0;  // lol
  // console.debug(msg)
  //this.fire('opcode', {error: msg});
}
$_instr_0x8[0x5] = function({major, minor})
{
  let x = (minor>>8)&0xf, y = (minor>>4)&0xf;
  this.reg.v[_VF] = +(this.reg.v[x] > this.reg.v[y]);
  this.reg.v[x] -= this.reg.v[y];
  //this.fire('debug');
  if (this.reg.v[x] < 0) this.reg.v[x] += 256;

  // let vx = this.reg.v[(minor>>8)&0xf], vy = this.reg.v[(minor>>4)&0xf];
  // let f = (vx > vy)+0;
  // this.reg.v[vx] = f ? this.reg.v[vx] - this.reg.v[vy] : this.reg.v[vy] - this.reg.v[vx];
  //this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
}
$_instr_0x8[0x6] = function({major, minor})
{
  this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
}
$_instr_0x8[0x7] = function({major, minor})
{
  this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
}
$_instr_0x8[0x8] = function({major, minor})
{
  this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
}
$_instr_0x8[0x9] = function({major, minor})
{
  this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
}
$_instr_0x8[0xA] = function({major, minor})
{
  this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
}
$_instr_0x8[0xB] = function({major, minor})
{
  this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
}
$_instr_0x8[0xC] = function({major, minor})
{
  this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
}
$_instr_0x8[0xD] = function({major, minor})
{
  this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
}
$_instr_0x8[0xE] = function({major, minor})
{
  this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
}
$_instr_0x8[0xF] = function({major, minor})
{
  this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] Illegal instruction: 0x${major.toString(16)}:${minor.toString(16)}`, address:this.reg.ip});
}

export{$_instr_0x8};
