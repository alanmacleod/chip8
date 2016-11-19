
import Base from '../util/base';

const BIOS_CHAR_BASE_ADDR = 0x0;
const BIOS_CHAR_SIZE = 5;
const BIOS_NUM_CHARS = 16;
const BIOS_KEYB_BASE_ADDR = (BIOS_CHAR_SIZE * BIOS_NUM_CHARS);

export default class RAM extends Base
{
  constructor()
  {
    super();
    this._this = "RAM";
    this._data = new ArrayBuffer(0x1000);
    this.data = new Uint8Array(this._data);
  }

  reset()
  {
    //this.data = new Array(0x1000).fill(0);
  }

  getCharAddrBIOS()
  {
    return BIOS_CHAR_BASE_ADDR;
  }

  getCharSizeBIOS()
  {
    return BIOS_CHAR_SIZE;
  }

  // Decided to write the keyboard buffer into system RAM
  // instead of passing an additional Input() object to the CPU() class
  // This is probably more like an embedded system would work
  getKeyboardBufferAddress()
  {
    return BIOS_KEYB_BASE_ADDR;
  }

  readByte(addr)
  {
    this._validate_address(addr);
    return this.data[addr];
  }

  readWord(addr)
  {
    this._validate_address(addr);
    return ((this.data[addr] & 0xff) << 8) | (this.data[addr+1] & 0xff); // TODO: +1 == gpf ?
  }

  writeByte(addr, data)
  {
    this._validate_address(addr);
    this.data[addr] = data;
  }

  writeWord(addr, data)
  {
    this._validate_address(addr);
    this.data[addr] = ((data >> 8) & 0xff);
    this.data[addr+1] = (data & 0xff);
  }

  blit(typedArray, toAddr)
  {
    // Bypass address validation here so we can blit the bios into place
    this.data.set(typedArray, toAddr);
  }

  _validate_address(addr)
  {
    if (addr < 0x200)
    {
      this.emit('gpf', {error: `Illegal address: 0x${addr.toString(16)}`});
    }

    if (addr >= 0x1000)
    {
      this.emit('gpf', {error: `Illegal address: 0x${addr.toString(16)}`});
    }
  }

}
