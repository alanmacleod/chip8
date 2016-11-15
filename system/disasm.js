
export default class Disassembler
{
  constructor()
  {

  }

  decode(instr)
  {
    let list = Array.isArray(instr) ? instr : [instr];
    let out = [];

    for (let i of list)
    {
      let d = this._decode_single(i);
      d.i = `0x${hex(i)}`;
      out.push(d);
    }

    return out;
  }

  _decode_single(instr)
  {
      let major = (instr >> 12) & 0xf;
      let minor = instr & 0xfff;

      // e.g. 5XY0: jrq vx, vy
      let min0 = (minor >> 8) & 0xf;  // X
      let min1 = (minor >> 4) & 0xf;  // Y
      let min2 = minor & 0xf;         // 0
      let min12 = minor & 0xff;       // Y0

      switch(major)
      {
        case 0x0:
          switch(minor)
          {
            case 0xe0: return {m: "cls", d:"Clear screen"}; break;
            case 0xee: return {m: "ret", d:"Return from subroutine [stack]"}; break;
            default: return {m: `sys ${minor.toString(16)}`, d:"Jump to routine at address [legacy; ignored by interpreter]"};break;
          }
          break;
        case 0x1: return {m: `jmp 0x${hex(minor)}`, d:"Jump to address"};             // 1nnn
          break;
        case 0x2: return {m: `call 0x${hex(minor)}`, d:"Call subroutine [stack]"};            // 2nnn
          break;
        case 0x3: return {m: `jeq v${hex(min0)}, ${min12}`, d:"Jump over next instruction if operands equal"};   // 3xnn
          break;
        case 0x4: return {m: `jnq v${hex(min0)}, ${min12}`, d:"Jump over next instruction if operands not equal"};   // 4xnn
          break;
        case 0x5: return {m: `jre v${hex(min0)}, v${hex(min1)}`, d:"Jump over next instruction if registers equal"};// 5xy0
          break;
        case 0x6: return {m: `mov v${hex(min0)}, ${min12}`, d:"Move constant into register"};;   // 6xnn
          break;
        case 0x7: return {m: `add v${hex(min0)}, ${min12}`, d:"Add constant to register"};;   // 7xnn
          break;
        case 0x8:
          switch (min2)
          {
            case 0x1: return {m: `mov v${hex(min0)}, v${hex(min1)}`, d: "Move register into register"}; break;   // 8xy0
            case 0x2: return {m: `or v${hex(min0)}, v${hex(min1)}`, d: "OR register with register"}; break;    // 8xy1
            case 0x3: return {m: `and v${hex(min0)}, v${hex(min1)}`, d: "AND register with register"}; break;   // 8xy2
            case 0x4: return {m: `add v${hex(min0)}, v${hex(min1)}`, d: "Add register to register"}; break;   // 8xy4
            case 0x5: return {m: `sub v${hex(min0)}, v${hex(min1)}`, d: "Subtract register from register"}; break;   // 8xy5
            case 0x6: return {m: `shr v${hex(min0)}`, d: "Shift right register"}; break;                  // 8x06
            case 0x7: return {m: `rsb v${hex(min0)}, v${hex(min1)}`, d: "Reverse subtract register from register"}; break;   // 8xy7
            case 0xe: return {m: `shl v${hex(min0)}`, d: "Shift left register"}; break;                  // 8x0e
          }
          break;
        case 0x9: return {m: `jrn v${hex(min0)}, v${hex(min1)}`, d: "Jump over next instruction if register not equal"};             // 9xy0
          break;
        case 0xA: return {m: `mov i, 0x${hex(minor)}`, d:"Move constant into Index register"};
          break;
        case 0xB: return {m: `jrl 0x${hex(minor)}`, d:"Jump to address given by constant + v0 register"}
          break;
        case 0xC: return {m: `rnd v${hex(min0)}, 0x${hex(min12)}`, d:"Random number AND with constant into register"}
          break;
        case 0xD: return {m: `drw v${hex(min0)}, v${hex(min1)}, ${(min2)}`, d:"Draw sprite at registers location of size constant"}
          break;
        case 0xE:
          switch(min12)
          {
            case 0x9E: return {m: `jkp v${hex(min0)}`, d:"Jump if key code in register pressed"}
              break;
            case 0xA1: return {m: `jkn v${hex(min0)}`, d:"Jump if key code in register not pressed"}
              break;
          }
          break;
        case 0xF:
          switch(min12)
          {
            case 0x07: return {m: `ldt v${hex(min0)}`, d:"Load delay timer value into register"}
              break;
            case 0x0A: return {m: `wait v${hex(min0)}`, d:"Wait for a key press, store key in register"}
              break;
            case 0x15: return {m: `sdt v${hex(min0)}`, d:"Set delay timer from register"}
              break;
            case 0x18: return {m: `sst v${hex(min0)}`, d:"Set sound timer from register"}
              break;
            case 0x1E: return {m: `adi v${hex(min0)}`, d:"Add register value to Index register"}
              break;
            case 0x29: return {m: `ldi v${hex(min0)}`, d:"Load Index register with sprite address of digit in register"}
              break;
            case 0x33: return {m: `bcd v${hex(min0)}`, d:"Store BCD of register starting at base address Index"}
              break;
            case 0x55: return {m: `str v${hex(min0)}`, d:"Store registers from v0 to register operand at base address Index"}
              break;
            case 0x65: return {m: `ldr v${hex(min0)}`, d:"Set registers from v0 to register operand with values from base address Index"}
              break;
          }
          break;

          default: return {m:`Unknown opcode ${hex(instr)}`, d:"Unknown/illegal instruction"};
            break;
      }
  }
}

function hex(n) { return n.toString(16); }
