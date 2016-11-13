
import Base from '../util/base';

export default class RAM extends Base
{
  constructor()
  {
    super();
    this._raw_data = new ArrayBuffer(0x1000);
    this.data = new Uint8Array(this._raw_data);
    this._this = "RAM";
  }

  reset()
  {
    //this.data = new Array(0x1000).fill(0);
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
