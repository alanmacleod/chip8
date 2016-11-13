
export let $_instr_0x8 = [
    $_instr_0x8_notimp,
    $_instr_0x8_notimp,
    $_instr_0x8_notimp,
    $_instr_0x8_notimp,
    $_instr_0x8_notimp,
    $_instr_0x8_notimp,
    $_instr_0x8_notimp,
    $_instr_0x8_notimp,
    $_instr_0x8_notimp,
    $_instr_0x8_notimp,
    $_instr_0x8_notimp,
    $_instr_0x8_notimp,
    $_instr_0x8_notimp,
    $_instr_0x8_notimp,
    $_instr_0x8_notimp,
    $_instr_0x8_notimp
];


function $_instr_0x8_notimp({major, minor})
{
  this.fire('opcode', {error: `[ADDR 0x${this.reg.ip.toString(16)}] (M-0x8) Illegal/Unimplemented instruction: 0x${major.toString(16)}${minor.toString(16)}`});
}
